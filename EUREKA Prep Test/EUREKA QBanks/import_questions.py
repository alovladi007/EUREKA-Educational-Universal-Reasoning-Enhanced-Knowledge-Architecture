"""
Advanced Question Bank Import Script with IRT Parameters
Imports questions from JSON files with full IRT support
"""
import json
import os
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal
from app.models import Question, User
from app.api.v1.endpoints.auth import get_password_hash
import numpy as np
from scipy import stats


class QuestionBankImporter:
    """Import questions with IRT parameters from JSON files"""
    
    def __init__(self):
        self.db = SessionLocal()
        self.admin_user = None
        self.stats = {
            'total_imported': 0,
            'by_exam': {},
            'by_difficulty': {'easy': 0, 'medium': 0, 'hard': 0},
            'errors': []
        }
    
    def setup_admin_user(self):
        """Ensure admin user exists for question authorship"""
        admin = self.db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                id=str(uuid.uuid4()),
                email="admin@eureka.com",
                username="admin",
                full_name="Admin User",
                hashed_password=get_password_hash("admin123"),
                is_admin=True,
                is_verified=True,
                is_active=True,
                created_at=datetime.utcnow()
            )
            self.db.add(admin)
            self.db.commit()
        self.admin_user = admin
        return admin
    
    def import_questions_from_json(self, filepath: str):
        """Import questions from a JSON file"""
        print(f"\n📚 Importing from {filepath}...")
        
        try:
            with open(filepath, 'r') as f:
                questions = json.load(f)
            
            imported_count = 0
            for q_data in questions:
                if self.import_single_question(q_data):
                    imported_count += 1
            
            print(f"✅ Imported {imported_count} questions from {os.path.basename(filepath)}")
            return imported_count
            
        except Exception as e:
            error_msg = f"Error importing {filepath}: {str(e)}"
            print(f"❌ {error_msg}")
            self.stats['errors'].append(error_msg)
            return 0
    
    def import_single_question(self, q_data: dict) -> bool:
        """Import a single question with IRT parameters"""
        try:
            # Check if question already exists
            existing = self.db.query(Question).filter(
                Question.id == q_data.get('id', '')
            ).first()
            
            if existing:
                print(f"⚠️  Question {q_data['id']} already exists, skipping...")
                return False
            
            # Map difficulty label to numeric scale
            difficulty_map = {
                "easy": -1.0,
                "medium": 0.0,
                "hard": 1.0,
                "expert": 2.0
            }
            
            # Extract IRT parameters
            irt_params = q_data.get('irt', {})
            discrimination = irt_params.get('a', 1.0)
            difficulty = irt_params.get('b', difficulty_map.get(q_data.get('difficulty_label', 'medium'), 0.0))
            guessing = irt_params.get('c', 0.25)
            
            # Format choices for database
            choices_formatted = None
            if q_data.get('choices'):
                choices_formatted = [
                    {"value": chr(65+i), "text": choice} 
                    for i, choice in enumerate(q_data['choices'])
                ]
            
            # Determine correct answer format
            correct_answer = q_data.get('correct_answer')
            if correct_answer is None and q_data.get('correct_index') is not None:
                correct_answer = chr(65 + q_data['correct_index'])  # Convert index to letter
            
            # Create question object
            question = Question(
                id=q_data.get('id', str(uuid.uuid4())),
                question_text=q_data['stem'],
                question_type="multiple_choice" if q_data.get('choices') else "essay",
                options=choices_formatted,
                correct_answer=correct_answer,
                explanation=q_data.get('explanation', ''),
                hint=q_data.get('hint'),
                exam_type=q_data['exam'],
                subject=q_data.get('section', ''),
                topic=q_data['topic_path'][0] if q_data.get('topic_path') else '',
                subtopic=q_data['topic_path'][1] if len(q_data.get('topic_path', [])) > 1 else None,
                
                # IRT Parameters
                difficulty=difficulty,
                discrimination=discrimination,
                guessing=guessing,
                upper_asymptote=1.0,
                
                # Additional metadata
                difficulty_label=q_data.get('difficulty_label', 'medium'),
                estimated_time_seconds=q_data.get('time_sec_suggested', 60),
                tags=q_data.get('tags', []),
                skills_tested=q_data.get('tags', []),
                
                # Quality metrics
                quality_score=1.0 if not q_data.get('needs_review') else 0.7,
                flagged=q_data.get('needs_review', False),
                review_status='approved' if not q_data.get('needs_review') else 'pending',
                
                # Source
                source=q_data.get('source_note', 'seed-v1'),
                author_id=self.admin_user.id,
                is_official=True,
                
                created_at=datetime.utcnow()
            )
            
            self.db.add(question)
            
            # Update statistics
            self.stats['total_imported'] += 1
            exam = q_data['exam']
            if exam not in self.stats['by_exam']:
                self.stats['by_exam'][exam] = 0
            self.stats['by_exam'][exam] += 1
            
            difficulty_label = q_data.get('difficulty_label', 'medium')
            if difficulty_label in self.stats['by_difficulty']:
                self.stats['by_difficulty'][difficulty_label] += 1
            
            return True
            
        except Exception as e:
            error_msg = f"Error importing question {q_data.get('id', 'unknown')}: {str(e)}"
            print(f"❌ {error_msg}")
            self.stats['errors'].append(error_msg)
            return False
    
    def create_calibration_sets(self):
        """Create calibration test sets for initial ability estimation"""
        print("\n🎯 Creating calibration test sets...")
        
        calibration_sets = {
            'SAT': {
                'Math': self.generate_calibration_items('SAT', 'Math', 15),
                'Reading': self.generate_calibration_items('SAT', 'Reading', 15)
            },
            'GRE': {
                'Quant': self.generate_calibration_items('GRE', 'Quant', 15),
                'Verbal': self.generate_calibration_items('GRE', 'Verbal', 15)
            },
            'LSAT': {
                'Logical Reasoning': self.generate_calibration_items('LSAT', 'Logical Reasoning', 15)
            },
            'MCAT': {
                'Chem/Phys': self.generate_calibration_items('MCAT', 'Chem/Phys', 15),
                'Bio/Biochem': self.generate_calibration_items('MCAT', 'Bio/Biochem', 15),
                'CARS': self.generate_calibration_items('MCAT', 'CARS', 15)
            }
        }
        
        # Save calibration sets to JSON
        os.makedirs('backend/seed_data/calibration', exist_ok=True)
        
        for exam, sections in calibration_sets.items():
            for section, items in sections.items():
                filename = f"backend/seed_data/calibration/{exam.lower()}_{section.lower().replace('/', '_')}_calibration.json"
                with open(filename, 'w') as f:
                    json.dump(items, f, indent=2)
                print(f"✅ Created calibration set: {filename}")
        
        return calibration_sets
    
    def generate_calibration_items(self, exam: str, section: str, num_items: int = 15):
        """Generate calibration items with balanced difficulty distribution"""
        
        # Target difficulty levels for calibration
        b_targets = [-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5]
        items = []
        
        # Create items at each difficulty level
        for i in range(num_items):
            b_value = b_targets[i % len(b_targets)]
            
            # Vary discrimination slightly
            a_value = np.random.uniform(0.9, 1.3) if i % 5 != 0 else 1.5  # One high discrimination item
            
            # Standard guessing parameter
            c_value = 0.20 if exam == 'SAT' else 0.25  # SAT has 4 choices, others have 4-5
            
            item = {
                'id': f'cal-{exam.lower()}-{section[:3].lower()}-{i:03d}',
                'exam': exam,
                'section': section,
                'irt': {
                    'a': round(a_value, 2),
                    'b': round(b_value, 2),
                    'c': c_value
                },
                'difficulty_label': self.get_difficulty_label(b_value),
                'source_note': 'calibration-v1',
                'purpose': 'initial_ability_estimation'
            }
            items.append(item)
        
        return items
    
    def get_difficulty_label(self, b_value: float) -> str:
        """Convert IRT b parameter to difficulty label"""
        if b_value <= -1.0:
            return 'easy'
        elif b_value <= 0.5:
            return 'medium'
        else:
            return 'hard'
    
    def import_all(self):
        """Import all question bank files"""
        print("\n" + "="*60)
        print("🚀 EUREKA Question Bank Import")
        print("="*60)
        
        # Setup admin user
        self.setup_admin_user()
        
        # Import question files
        seed_dir = 'backend/seed_data/qbank'
        if os.path.exists(seed_dir):
            for filename in os.listdir(seed_dir):
                if filename.endswith('.json'):
                    filepath = os.path.join(seed_dir, filename)
                    self.import_questions_from_json(filepath)
        
        # Commit all changes
        try:
            self.db.commit()
            print("\n✅ All questions committed to database")
        except Exception as e:
            self.db.rollback()
            print(f"\n❌ Failed to commit: {str(e)}")
            return False
        
        # Create calibration sets
        self.create_calibration_sets()
        
        # Print summary
        self.print_summary()
        
        return True
    
    def print_summary(self):
        """Print import summary"""
        print("\n" + "="*60)
        print("📊 Import Summary")
        print("="*60)
        print(f"Total questions imported: {self.stats['total_imported']}")
        
        print("\nBy Exam Type:")
        for exam, count in self.stats['by_exam'].items():
            print(f"  {exam}: {count}")
        
        print("\nBy Difficulty:")
        for level, count in self.stats['by_difficulty'].items():
            print(f"  {level}: {count}")
        
        if self.stats['errors']:
            print(f"\n⚠️  Errors encountered: {len(self.stats['errors'])}")
            for error in self.stats['errors'][:5]:  # Show first 5 errors
                print(f"  - {error}")
        
        print("\n✨ Import complete!")
    
    def close(self):
        """Close database connection"""
        self.db.close()


class IRTCalibrator:
    """Calibrate and estimate IRT parameters"""
    
    @staticmethod
    def eap_theta(responses: list, items: list, grid=None):
        """
        Estimate ability using Expected A Posteriori method
        
        Args:
            responses: List of 0/1 responses
            items: List of dicts with 'a', 'b', 'c' parameters
            grid: Theta grid for integration
        
        Returns:
            tuple: (theta_estimate, standard_error)
        """
        if grid is None:
            grid = np.linspace(-3, 3, 121)
        
        # Prior: standard normal
        prior = stats.norm.pdf(grid, 0, 1)
        prior = prior / prior.sum()
        
        # Likelihood
        likelihood = np.ones_like(grid)
        
        for response, item in zip(responses, items):
            a = item.get('a', 1.0)
            b = item.get('b', 0.0)
            c = item.get('c', 0.25)
            
            # 3PL model probability
            P = c + (1 - c) / (1 + np.exp(-1.7 * a * (grid - b)))
            
            if response == 1:
                likelihood *= P
            else:
                likelihood *= (1 - P)
        
        # Posterior
        posterior = likelihood * prior
        posterior = posterior / posterior.sum()
        
        # EAP estimate
        theta = (grid * posterior).sum()
        variance = ((grid - theta)**2 * posterior).sum()
        se = np.sqrt(variance)
        
        return theta, se
    
    @staticmethod
    def information_function(theta: float, a: float, b: float, c: float = 0.25):
        """
        Calculate Fisher Information at given theta
        """
        P = c + (1 - c) / (1 + np.exp(-1.7 * a * (theta - b)))
        Q = 1 - P
        
        numerator = (1.7 * a)**2 * Q * (P - c)**2
        denominator = P * (1 - c)**2
        
        if denominator > 0:
            return numerator / denominator
        return 0
    
    @staticmethod
    def select_optimal_item(theta: float, available_items: list, used_items: set = None):
        """
        Select item with maximum information at current theta
        """
        if used_items is None:
            used_items = set()
        
        best_item = None
        max_info = -1
        
        for item in available_items:
            if item['id'] in used_items:
                continue
            
            info = IRTCalibrator.information_function(
                theta, 
                item['irt']['a'], 
                item['irt']['b'], 
                item['irt']['c']
            )
            
            if info > max_info:
                max_info = info
                best_item = item
        
        return best_item


def main():
    """Main import function"""
    importer = QuestionBankImporter()
    
    try:
        success = importer.import_all()
        if success:
            print("\n🎉 Question bank successfully imported!")
        else:
            print("\n⚠️  Import completed with errors")
    finally:
        importer.close()


if __name__ == "__main__":
    # Create all tables first
    from app.models import Base
    Base.metadata.create_all(bind=engine)
    
    # Run import
    main()

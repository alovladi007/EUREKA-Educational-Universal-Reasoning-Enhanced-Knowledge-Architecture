#!/usr/bin/env python3
"""
EUREKA Calibration Mini-Test Generator
Generates IRT-balanced calibration sets for initial ability estimation
"""

import json
import random
import numpy as np
from datetime import datetime
from typing import Dict, List, Tuple
from scipy import stats

class CalibrationTestGenerator:
    """Generate calibration mini-tests with optimal IRT parameter distribution"""
    
    def __init__(self):
        # Target b-values for optimal information spread
        self.b_targets = [-1.5, -0.75, 0, 0.75, 1.5]
        self.calibration_items = {}
        
        # Exam configurations
        self.exam_configs = {
            'SAT': {
                'sections': ['Math', 'Reading'],
                'num_choices': 4,
                'c_param': 0.25,
                'time_budget_minutes': 15
            },
            'GRE': {
                'sections': ['Quantitative', 'Verbal'],
                'num_choices': 5,
                'c_param': 0.20,
                'time_budget_minutes': 18
            },
            'LSAT': {
                'sections': ['Logical Reasoning', 'Analytical Reasoning', 'Reading Comprehension'],
                'num_choices': 5,
                'c_param': 0.20,
                'time_budget_minutes': 15
            },
            'MCAT': {
                'sections': ['Chem/Phys', 'Bio/Biochem', 'CARS', 'Psych/Soc'],
                'num_choices': 4,
                'c_param': 0.25,
                'time_budget_minutes': 18
            }
        }
    
    def generate_irt_params_for_calibration(self, b_target: float, item_num: int) -> Tuple[float, float, float]:
        """Generate IRT parameters for calibration items"""
        # Most items have moderate discrimination
        if item_num % 7 == 0:  # Every 7th item has high discrimination
            a = round(random.uniform(1.4, 1.6), 2)
        else:
            a = round(random.uniform(0.9, 1.3), 2)
        
        # Add small variation to target b value
        b = round(b_target + random.gauss(0, 0.1), 2)
        b = max(-3.0, min(3.0, b))  # Keep within reasonable bounds
        
        return a, b
    
    def generate_sat_math_item(self, item_num: int, b: float) -> Dict:
        """Generate SAT Math calibration item"""
        topics = {
            -1.5: ("Algebra", "Linear Equations", "Solve for x: 2x + 5 = 11"),
            -0.75: ("Geometry", "Area", "Find the area of a rectangle with length 8 and width 5"),
            0: ("Functions", "Quadratics", "Find the vertex of y = x² - 4x + 3"),
            0.75: ("Statistics", "Standard Deviation", "Calculate the standard deviation of {2, 4, 6, 8, 10}"),
            1.5: ("Advanced Math", "Complex Numbers", "Simplify: (2 + 3i)(1 - 2i)")
        }
        
        topic_info = topics.get(min(topics.keys(), key=lambda x: abs(x - b)))
        
        return {
            "topic_path": [topic_info[0], topic_info[1]],
            "stem": topic_info[2],
            "choices": ["Option A", "Option B", "Option C", "Option D"],
            "correct_index": random.randint(0, 3),
            "explanation": f"This tests {topic_info[1]} concepts at difficulty level b={b}"
        }
    
    def generate_gre_quant_item(self, item_num: int, b: float) -> Dict:
        """Generate GRE Quantitative calibration item"""
        topics = {
            -1.5: ("Arithmetic", "Percentages", "What is 15% of 80?"),
            -0.75: ("Algebra", "Systems", "Solve: x + y = 10 and x - y = 2"),
            0: ("Geometry", "Triangles", "In a right triangle with legs 3 and 4, find the hypotenuse"),
            0.75: ("Data Analysis", "Combinations", "How many ways to choose 3 items from 7?"),
            1.5: ("Number Properties", "Prime Factorization", "Find the number of distinct prime factors of 2520")
        }
        
        topic_info = topics.get(min(topics.keys(), key=lambda x: abs(x - b)))
        
        return {
            "topic_path": [topic_info[0], topic_info[1]],
            "stem": topic_info[2],
            "choices": ["A", "B", "C", "D", "E"],
            "correct_index": random.randint(0, 4),
            "explanation": f"Tests {topic_info[1]} at difficulty b={b}"
        }
    
    def generate_lsat_lr_item(self, item_num: int, b: float) -> Dict:
        """Generate LSAT Logical Reasoning calibration item"""
        question_types = {
            -1.5: ("Arguments", "Main Conclusion", "What is the main conclusion of the argument?"),
            -0.75: ("Assumptions", "Necessary Assumption", "The argument assumes which of the following?"),
            0: ("Flaws", "Reasoning Flaw", "The reasoning is flawed because it..."),
            0.75: ("Evidence", "Strengthen", "Which would most strengthen the argument?"),
            1.5: ("Formal Logic", "Parallel Reasoning", "Which argument has the same logical structure?")
        }
        
        topic_info = question_types.get(min(question_types.keys(), key=lambda x: abs(x - b)))
        
        return {
            "topic_path": [topic_info[0], topic_info[1]],
            "stem": topic_info[2],
            "choices": ["A", "B", "C", "D", "E"],
            "correct_index": random.randint(0, 4),
            "explanation": f"Tests {topic_info[1]} reasoning at difficulty b={b}"
        }
    
    def generate_mcat_chem_phys_item(self, item_num: int, b: float) -> Dict:
        """Generate MCAT Chem/Phys calibration item"""
        topics = {
            -1.5: ("Physics", "Kinematics", "Calculate velocity after 2s of constant acceleration at 5 m/s²"),
            -0.75: ("Chemistry", "Stoichiometry", "How many moles in 36g of H₂O?"),
            0: ("Physics", "Energy", "Calculate kinetic energy of 2kg mass at 10 m/s"),
            0.75: ("Chemistry", "pH", "What is the pH of 0.001 M HCl?"),
            1.5: ("Physics", "Optics", "Calculate focal length for converging lens system")
        }
        
        topic_info = topics.get(min(topics.keys(), key=lambda x: abs(x - b)))
        
        return {
            "topic_path": [topic_info[0], topic_info[1]],
            "stem": topic_info[2],
            "choices": ["A", "B", "C", "D"],
            "correct_index": random.randint(0, 3),
            "explanation": f"Tests {topic_info[1]} at difficulty b={b}"
        }
    
    def generate_calibration_item(self, exam: str, section: str, item_num: int, 
                                 b_target: float) -> Dict:
        """Generate a single calibration item"""
        a, b = self.generate_irt_params_for_calibration(b_target, item_num)
        c = self.exam_configs[exam]['c_param']
        
        # Generate content based on exam and section
        if exam == 'SAT' and section == 'Math':
            content = self.generate_sat_math_item(item_num, b)
        elif exam == 'GRE' and section == 'Quantitative':
            content = self.generate_gre_quant_item(item_num, b)
        elif exam == 'LSAT' and section == 'Logical Reasoning':
            content = self.generate_lsat_lr_item(item_num, b)
        elif exam == 'MCAT' and section == 'Chem/Phys':
            content = self.generate_mcat_chem_phys_item(item_num, b)
        else:
            # Default content for other sections
            content = {
                "topic_path": [section, "Calibration"],
                "stem": f"{exam} {section} calibration item {item_num}",
                "choices": ["A", "B", "C", "D"] if self.exam_configs[exam]['num_choices'] == 4 else ["A", "B", "C", "D", "E"],
                "correct_index": 0,
                "explanation": f"Calibration item for {section}"
            }
        
        # Determine difficulty label based on b value
        if b <= -0.8:
            difficulty_label = "easy"
        elif b <= 0.7:
            difficulty_label = "medium"
        else:
            difficulty_label = "hard"
        
        # Calculate time suggestion
        base_time = 60  # seconds
        time_multiplier = 1 + (b + 2) * 0.2  # Harder questions get more time
        time_suggested = int(base_time * time_multiplier)
        
        return {
            "id": f"cal-{exam.lower()}-{section[:4].lower()}-{item_num:03d}",
            "exam": exam,
            "section": section,
            "topic_path": content["topic_path"],
            "stem": content["stem"],
            "choices": content["choices"],
            "correct_index": content["correct_index"],
            "explanation": content["explanation"],
            "difficulty_label": difficulty_label,
            "irt": {
                "a": a,
                "b": b,
                "c": c
            },
            "time_sec_suggested": time_suggested,
            "tags": ["calibration", exam.lower(), section.lower(), difficulty_label],
            "source_note": "calibration-v1",
            "needs_review": False,
            "purpose": "initial_ability_estimation"
        }
    
    def generate_section_calibration_set(self, exam: str, section: str) -> List[Dict]:
        """Generate 15-item calibration set for a section"""
        items = []
        
        # Generate 3 items at each target b value
        for b_target in self.b_targets:
            for i in range(3):
                item_num = len(items) + 1
                item = self.generate_calibration_item(exam, section, item_num, b_target)
                items.append(item)
        
        return items
    
    def generate_all_calibration_sets(self):
        """Generate calibration sets for all exams and sections"""
        print("="*70)
        print("🎯 EUREKA CALIBRATION TEST GENERATOR")
        print("="*70)
        
        all_stats = {
            'total_items': 0,
            'by_exam': {},
            'by_difficulty': {'easy': 0, 'medium': 0, 'hard': 0}
        }
        
        for exam, config in self.exam_configs.items():
            print(f"\n📚 Generating calibration sets for {exam}...")
            exam_items = {}
            exam_count = 0
            
            for section in config['sections']:
                items = self.generate_section_calibration_set(exam, section)
                exam_items[section] = items
                exam_count += len(items)
                
                # Update statistics
                for item in items:
                    all_stats['by_difficulty'][item['difficulty_label']] += 1
                
                print(f"  ✅ {section}: {len(items)} items generated")
                
                # Save to file
                filename = f"/mnt/user-data/outputs/calibration_{exam.lower()}_{section.lower().replace('/', '_')}.json"
                with open(filename, 'w') as f:
                    json.dump(items, f, indent=2)
            
            self.calibration_items[exam] = exam_items
            all_stats['by_exam'][exam] = exam_count
            all_stats['total_items'] += exam_count
        
        # Generate summary
        self.generate_summary(all_stats)
        
        # Generate JSONL files
        self.generate_jsonl_files()
        
        return all_stats
    
    def generate_summary(self, stats: Dict):
        """Generate summary report"""
        print("\n" + "="*70)
        print("📊 CALIBRATION GENERATION SUMMARY")
        print("="*70)
        print(f"Total Calibration Items: {stats['total_items']}")
        
        print("\nBy Exam:")
        for exam, count in stats['by_exam'].items():
            print(f"  {exam}: {count} items")
        
        print("\nBy Difficulty:")
        for diff, count in stats['by_difficulty'].items():
            percentage = (count / stats['total_items']) * 100
            print(f"  {diff}: {count} ({percentage:.1f}%)")
        
        print("\nb-value Distribution:")
        print("  Target values: -1.5, -0.75, 0, +0.75, +1.5")
        print("  3 items per b-value per section")
        print("  Optimal spread for ability estimation")
        
        # Save summary to file
        summary = {
            'generated_at': datetime.utcnow().isoformat(),
            'statistics': stats,
            'configuration': {
                'items_per_section': 15,
                'b_targets': self.b_targets,
                'a_range': [0.9, 1.6],
                'purpose': 'initial_ability_estimation'
            }
        }
        
        with open('/mnt/user-data/outputs/calibration_summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        print("\n✅ Summary saved to calibration_summary.json")
    
    def generate_jsonl_files(self):
        """Generate JSONL files for easy import"""
        print("\n📄 Generating JSONL import files...")
        
        for exam, sections in self.calibration_items.items():
            for section, items in sections.items():
                filename = f"/mnt/user-data/outputs/calibration_{exam.lower()}_{section.lower().replace('/', '_')}.jsonl"
                
                with open(filename, 'w') as f:
                    for item in items:
                        f.write(json.dumps(item) + '\n')
                
                print(f"  ✅ {filename} created")


class EAPThetaEstimator:
    """Expected A Posteriori theta estimation for adaptive testing"""
    
    @staticmethod
    def eap_theta(responses: List[int], items: List[Dict], 
                  grid: np.ndarray = None) -> Tuple[float, float]:
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
            a = item.get('a', 1.0) if isinstance(item, dict) else item.a
            b = item.get('b', 0.0) if isinstance(item, dict) else item.b
            c = item.get('c', 0.25) if isinstance(item, dict) else item.c
            
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
        
        return round(theta, 3), round(se, 3)
    
    @staticmethod
    def information_function(theta: float, a: float, b: float, c: float = 0.25) -> float:
        """Calculate Fisher Information at given theta"""
        P = c + (1 - c) / (1 + np.exp(-1.7 * a * (theta - b)))
        Q = 1 - P
        
        numerator = (1.7 * a)**2 * Q * (P - c)**2
        denominator = P * (1 - c)**2
        
        if denominator > 0:
            return numerator / denominator
        return 0
    
    @staticmethod
    def select_optimal_item(theta: float, available_items: List[Dict], 
                           used_items: set = None) -> Dict:
        """Select item with maximum information at current theta"""
        if used_items is None:
            used_items = set()
        
        best_item = None
        max_info = -1
        
        for item in available_items:
            item_id = item.get('id', str(item))
            if item_id in used_items:
                continue
            
            irt = item.get('irt', item)
            info = EAPThetaEstimator.information_function(
                theta,
                irt.get('a', 1.0),
                irt.get('b', 0.0),
                irt.get('c', 0.25)
            )
            
            if info > max_info:
                max_info = info
                best_item = item
        
        return best_item


def main():
    """Generate all calibration sets"""
    generator = CalibrationTestGenerator()
    stats = generator.generate_all_calibration_sets()
    
    # Demonstrate EAP theta estimation
    print("\n" + "="*70)
    print("🧮 DEMONSTRATING EAP THETA ESTIMATION")
    print("="*70)
    
    # Example calibration responses
    example_items = [
        {'a': 1.2, 'b': -1.5, 'c': 0.25},
        {'a': 1.0, 'b': -0.75, 'c': 0.25},
        {'a': 1.4, 'b': 0.0, 'c': 0.25},
        {'a': 1.1, 'b': 0.75, 'c': 0.25},
        {'a': 1.3, 'b': 1.5, 'c': 0.25}
    ]
    
    # Simulate different ability levels
    test_cases = [
        ([1, 1, 1, 0, 0], "Medium ability"),
        ([1, 1, 1, 1, 0], "High ability"),
        ([1, 0, 0, 0, 0], "Low ability"),
        ([1, 1, 1, 1, 1], "Very high ability")
    ]
    
    estimator = EAPThetaEstimator()
    
    for responses, description in test_cases:
        theta, se = estimator.eap_theta(responses, example_items)
        print(f"{description}: θ = {theta:+.3f} (SE = {se:.3f})")
    
    print("\n✨ Calibration system complete!")


if __name__ == "__main__":
    main()

"""
Database seeder script to populate initial data
"""
import json
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal
from app.models import User, Question, QuestionAttempt, StudySession
from app.api.v1.endpoints.auth import get_password_hash
import uuid

# Sample questions for different exam types
GRE_QUESTIONS = [
    {
        "question_text": "If x + y = 10 and x - y = 4, what is the value of x?",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "3"},
            {"value": "B", "text": "5"},
            {"value": "C", "text": "7"},
            {"value": "D", "text": "9"}
        ],
        "correct_answer": "C",
        "explanation": "Adding the two equations: (x + y) + (x - y) = 10 + 4, which gives 2x = 14, so x = 7.",
        "hint": "Try adding the two equations together to eliminate y.",
        "subject": "Quantitative",
        "topic": "Algebra",
        "difficulty": -0.5,
        "difficulty_label": "Easy"
    },
    {
        "question_text": "The word 'ubiquitous' most nearly means:",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "Rare"},
            {"value": "B", "text": "Omnipresent"},
            {"value": "C", "text": "Ambiguous"},
            {"value": "D", "text": "Notorious"}
        ],
        "correct_answer": "B",
        "explanation": "Ubiquitous means present, appearing, or found everywhere; omnipresent.",
        "hint": "Think about something that is everywhere at once.",
        "subject": "Verbal",
        "topic": "Vocabulary",
        "difficulty": 0.0,
        "difficulty_label": "Medium"
    },
    {
        "question_text": "A circle has a radius of 5 units. What is its area?",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "10π"},
            {"value": "B", "text": "25π"},
            {"value": "C", "text": "50π"},
            {"value": "D", "text": "100π"}
        ],
        "correct_answer": "B",
        "explanation": "The area of a circle is πr². With r = 5, area = π(5)² = 25π.",
        "hint": "Remember the formula for the area of a circle: A = πr²",
        "subject": "Quantitative",
        "topic": "Geometry",
        "difficulty": -1.0,
        "difficulty_label": "Easy"
    },
    {
        "question_text": "Which of the following is a prime number?",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "91"},
            {"value": "B", "text": "87"},
            {"value": "C", "text": "89"},
            {"value": "D", "text": "93"}
        ],
        "correct_answer": "C",
        "explanation": "89 is prime. 91 = 7 × 13, 87 = 3 × 29, and 93 = 3 × 31.",
        "hint": "Try dividing each number by small primes like 2, 3, 5, 7.",
        "subject": "Quantitative",
        "topic": "Number Theory",
        "difficulty": 0.5,
        "difficulty_label": "Medium"
    },
    {
        "question_text": "The passage suggests that the author's primary concern is:",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "Economic inequality"},
            {"value": "B", "text": "Environmental degradation"},
            {"value": "C", "text": "Educational reform"},
            {"value": "D", "text": "Technological advancement"}
        ],
        "correct_answer": "A",
        "explanation": "The passage focuses on wealth distribution and its societal impacts.",
        "hint": "Look for the topic mentioned most frequently in the passage.",
        "subject": "Verbal",
        "topic": "Reading Comprehension",
        "difficulty": 1.0,
        "difficulty_label": "Hard"
    }
]

GMAT_QUESTIONS = [
    {
        "question_text": "If a company's revenue increased by 20% from 2022 to 2023, and then decreased by 10% from 2023 to 2024, what is the net percentage change from 2022 to 2024?",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "8%"},
            {"value": "B", "text": "10%"},
            {"value": "C", "text": "12%"},
            {"value": "D", "text": "15%"}
        ],
        "correct_answer": "A",
        "explanation": "If initial revenue is 100, after 20% increase it becomes 120. After 10% decrease: 120 × 0.9 = 108. Net change is 8%.",
        "hint": "Use 100 as the starting value and calculate step by step.",
        "subject": "Quantitative",
        "topic": "Percentages",
        "difficulty": 0.0,
        "difficulty_label": "Medium"
    },
    {
        "question_text": "The argument above relies on which of the following assumptions?",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "Past trends will continue into the future"},
            {"value": "B", "text": "All variables remain constant"},
            {"value": "C", "text": "The sample size is representative"},
            {"value": "D", "text": "Correlation implies causation"}
        ],
        "correct_answer": "A",
        "explanation": "The argument extrapolates from historical data, assuming past patterns will persist.",
        "hint": "What must be true for the conclusion to follow from the premise?",
        "subject": "Verbal",
        "topic": "Critical Reasoning",
        "difficulty": 1.0,
        "difficulty_label": "Hard"
    }
]

SAT_QUESTIONS = [
    {
        "question_text": "Solve for x: 2x + 5 = 17",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "4"},
            {"value": "B", "text": "6"},
            {"value": "C", "text": "8"},
            {"value": "D", "text": "10"}
        ],
        "correct_answer": "B",
        "explanation": "2x + 5 = 17, so 2x = 12, therefore x = 6.",
        "hint": "Subtract 5 from both sides first.",
        "subject": "Math",
        "topic": "Linear Equations",
        "difficulty": -1.5,
        "difficulty_label": "Easy"
    },
    {
        "question_text": "Choose the word that best completes the sentence: The scientist's findings were _____, contradicting years of established research.",
        "question_type": "multiple_choice",
        "options": [
            {"value": "A", "text": "conventional"},
            {"value": "B", "text": "revolutionary"},
            {"value": "C", "text": "redundant"},
            {"value": "D", "text": "trivial"}
        ],
        "correct_answer": "B",
        "explanation": "Revolutionary means involving or causing a complete change, which fits with contradicting established research.",
        "hint": "Look for a word that means causing major change.",
        "subject": "Reading & Writing",
        "topic": "Vocabulary in Context",
        "difficulty": 0.0,
        "difficulty_label": "Medium"
    }
]

def seed_database():
    """
    Populate database with initial data
    """
    db = SessionLocal()
    
    try:
        print("🌱 Starting database seeding...")
        
        # Create admin user
        admin = db.query(User).filter(User.username == "admin").first()
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
            db.add(admin)
            print("✅ Admin user created")
        
        # Create test users
        test_users = [
            {
                "email": "john.doe@example.com",
                "username": "johndoe",
                "full_name": "John Doe",
                "password": "testpass123",
                "education_level": "undergraduate",
                "target_exams": ["GRE"]
            },
            {
                "email": "jane.smith@example.com",
                "username": "janesmith",
                "full_name": "Jane Smith",
                "password": "testpass123",
                "education_level": "graduate",
                "target_exams": ["GMAT", "GRE"]
            },
            {
                "email": "student@example.com",
                "username": "student",
                "full_name": "Test Student",
                "password": "student123",
                "education_level": "high_school",
                "target_exams": ["SAT"]
            }
        ]
        
        created_users = []
        for user_data in test_users:
            existing = db.query(User).filter(User.username == user_data["username"]).first()
            if not existing:
                user = User(
                    id=str(uuid.uuid4()),
                    email=user_data["email"],
                    username=user_data["username"],
                    full_name=user_data["full_name"],
                    hashed_password=get_password_hash(user_data["password"]),
                    education_level=user_data["education_level"],
                    target_exams=user_data["target_exams"],
                    is_verified=True,
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                db.add(user)
                created_users.append(user)
        
        print(f"✅ Created {len(created_users)} test users")
        
        # Add questions
        all_questions = [
            ("GRE", GRE_QUESTIONS),
            ("GMAT", GMAT_QUESTIONS),
            ("SAT", SAT_QUESTIONS)
        ]
        
        question_count = 0
        created_questions = []
        
        for exam_type, questions in all_questions:
            for q_data in questions:
                # Check if question already exists
                existing = db.query(Question).filter(
                    Question.question_text == q_data["question_text"]
                ).first()
                
                if not existing:
                    question = Question(
                        id=str(uuid.uuid4()),
                        question_text=q_data["question_text"],
                        question_type=q_data["question_type"],
                        options=q_data["options"],
                        correct_answer=q_data["correct_answer"],
                        explanation=q_data["explanation"],
                        hint=q_data.get("hint"),
                        exam_type=exam_type,
                        subject=q_data["subject"],
                        topic=q_data["topic"],
                        difficulty=q_data["difficulty"],
                        difficulty_label=q_data["difficulty_label"],
                        discrimination=random.uniform(0.8, 1.5),
                        guessing=0.25,
                        author_id=admin.id,
                        is_official=True,
                        created_at=datetime.utcnow()
                    )
                    db.add(question)
                    created_questions.append(question)
                    question_count += 1
        
        print(f"✅ Added {question_count} questions")
        
        # Create sample attempts for users (to have some data)
        if created_users and created_questions:
            for user in created_users[:2]:  # First two users
                # Create a study session
                session = StudySession(
                    id=str(uuid.uuid4()),
                    user_id=user.id,
                    session_type="practice",
                    exam_type=user.target_exams[0] if user.target_exams else "GRE",
                    start_time=datetime.utcnow() - timedelta(hours=1),
                    end_time=datetime.utcnow(),
                    duration_seconds=3600,
                    total_questions=10,
                    correct_answers=7,
                    accuracy=0.7,
                    completed=True
                )
                db.add(session)
                
                # Create question attempts
                for i in range(10):
                    question = random.choice(created_questions)
                    is_correct = random.random() < 0.7  # 70% accuracy
                    
                    attempt = QuestionAttempt(
                        id=str(uuid.uuid4()),
                        user_id=user.id,
                        question_id=question.id,
                        session_id=session.id,
                        user_answer={"selected": question.correct_answer if is_correct else "A"},
                        is_correct=is_correct,
                        time_spent_seconds=random.randint(30, 180),
                        timestamp=datetime.utcnow() - timedelta(minutes=random.randint(0, 60))
                    )
                    db.add(attempt)
                    
                    # Update question statistics
                    question.exposure_count += 1
                    question.success_rate = (
                        (question.success_rate * (question.exposure_count - 1) + (1 if is_correct else 0))
                        / question.exposure_count
                    )
                
                # Update user stats
                user.total_questions_answered = 10
                user.overall_accuracy = 0.7
                user.current_streak_days = random.randint(0, 7)
        
        print("✅ Created sample study sessions and attempts")
        
        # Commit all changes
        db.commit()
        print("✨ Database seeding completed successfully!")
        
        # Print summary
        total_users = db.query(User).count()
        total_questions = db.query(Question).count()
        total_attempts = db.query(QuestionAttempt).count()
        
        print(f"""
📊 Database Summary:
- Total Users: {total_users}
- Total Questions: {total_questions}
- Total Attempts: {total_attempts}
        """)
        
    except Exception as e:
        print(f"❌ Error during seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    # Create all tables
    from app.models import Base
    Base.metadata.create_all(bind=engine)
    
    # Run seeder
    seed_database()

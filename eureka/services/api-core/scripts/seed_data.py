"""
Seed database with sample data

Creates sample organizations, users, courses, and enrollments for testing.
"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from uuid import uuid4, UUID
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_maker
from app.core.models import (
    Organization, User, Course, Enrollment, TierType, UserRole
)
from app.utils.auth import hash_password


# Pre-defined UUIDs for consistent testing
ORG_HIGH_SCHOOL_ID = UUID("550e8400-e29b-41d4-a716-446655440001")
ORG_UNIVERSITY_ID = UUID("550e8400-e29b-41d4-a716-446655440002")
ORG_MED_SCHOOL_ID = UUID("550e8400-e29b-41d4-a716-446655440003")

ADMIN_USER_ID = UUID("650e8400-e29b-41d4-a716-446655440001")


async def seed_organizations(db: AsyncSession):
    """Create sample organizations"""
    print("📊 Creating organizations...")
    
    orgs = [
        Organization(
            id=ORG_HIGH_SCHOOL_ID,
            name="Springfield High School",
            slug="springfield-hs",
            tier=TierType.HIGH_SCHOOL,
            email="admin@springfield-hs.edu",
            phone="555-0100",
            city="Springfield",
            state="IL",
            country="US",
            ferpa_compliant=True,
            coppa_compliant=True,
            is_active=True,
            is_verified=True,
            settings={
                "gamification_enabled": True,
                "badges_enabled": True,
                "leaderboard_enabled": True
            },
            tier_config={
                "max_students_per_class": 30,
                "supports_parent_portal": True
            }
        ),
        Organization(
            id=ORG_UNIVERSITY_ID,
            name="Midwest State University",
            slug="midwest-state",
            tier=TierType.UNDERGRADUATE,
            email="registrar@midwest-state.edu",
            phone="555-0200",
            city="Madison",
            state="WI",
            country="US",
            ferpa_compliant=True,
            is_active=True,
            is_verified=True,
            settings={
                "lti_enabled": True,
                "peer_review_enabled": True
            },
            tier_config={
                "max_students_per_course": 200,
                "supports_research_mode": False
            }
        ),
        Organization(
            id=ORG_MED_SCHOOL_ID,
            name="University Medical Center",
            slug="umc-med-school",
            tier=TierType.PROFESSIONAL_MEDICAL,
            email="admissions@umc-medschool.edu",
            phone="555-0300",
            city="Boston",
            state="MA",
            country="US",
            ferpa_compliant=True,
            hipaa_compliant=True,
            is_active=True,
            is_verified=True,
            settings={
                "clinical_rotations_enabled": True,
                "osce_enabled": True
            },
            tier_config={
                "max_students_per_cohort": 150,
                "supports_clinical_assessments": True
            }
        )
    ]
    
    for org in orgs:
        db.add(org)
    
    await db.commit()
    print(f"✅ Created {len(orgs)} organizations")


async def seed_users(db: AsyncSession):
    """Create sample users"""
    print("👥 Creating users...")
    
    # Common password for all test users
    password = hash_password("TestPass123!")
    
    users = [
        # Super admin
        User(
            id=ADMIN_USER_ID,
            org_id=ORG_UNIVERSITY_ID,
            email="admin@eureka.edu",
            hashed_password=password,
            first_name="System",
            last_name="Administrator",
            display_name="Admin",
            role=UserRole.SUPER_ADMIN,
            email_verified=True,
            is_active=True
        ),
        
        # High School users
        User(
            id=uuid4(),
            org_id=ORG_HIGH_SCHOOL_ID,
            email="teacher@springfield-hs.edu",
            hashed_password=password,
            first_name="Sarah",
            last_name="Johnson",
            display_name="Ms. Johnson",
            role=UserRole.TEACHER,
            email_verified=True,
            is_active=True
        ),
        User(
            id=uuid4(),
            org_id=ORG_HIGH_SCHOOL_ID,
            email="student1@springfield-hs.edu",
            hashed_password=password,
            first_name="Alex",
            last_name="Martinez",
            display_name="Alex M.",
            role=UserRole.STUDENT,
            email_verified=True,
            is_active=True,
            date_of_birth=datetime.now() - timedelta(days=365*16)
        ),
        
        # University users
        User(
            id=uuid4(),
            org_id=ORG_UNIVERSITY_ID,
            email="orgadmin@midwest-state.edu",
            hashed_password=password,
            first_name="Robert",
            last_name="Wilson",
            display_name="Dean Wilson",
            role=UserRole.ORG_ADMIN,
            email_verified=True,
            is_active=True
        ),
        User(
            id=uuid4(),
            org_id=ORG_UNIVERSITY_ID,
            email="prof.smith@midwest-state.edu",
            hashed_password=password,
            first_name="Emily",
            last_name="Smith",
            display_name="Prof. Smith",
            role=UserRole.TEACHER,
            email_verified=True,
            is_active=True
        ),
        User(
            id=uuid4(),
            org_id=ORG_UNIVERSITY_ID,
            email="student@midwest-state.edu",
            hashed_password=password,
            first_name="Jordan",
            last_name="Lee",
            display_name="Jordan L.",
            role=UserRole.STUDENT,
            email_verified=True,
            is_active=True
        ),
        
        # Medical School users
        User(
            id=uuid4(),
            org_id=ORG_MED_SCHOOL_ID,
            email="dr.anderson@umc-medschool.edu",
            hashed_password=password,
            first_name="David",
            last_name="Anderson",
            display_name="Dr. Anderson",
            role=UserRole.TEACHER,
            email_verified=True,
            is_active=True
        ),
        User(
            id=uuid4(),
            org_id=ORG_MED_SCHOOL_ID,
            email="medstudent@umc-medschool.edu",
            hashed_password=password,
            first_name="Maya",
            last_name="Patel",
            display_name="Maya P.",
            role=UserRole.STUDENT,
            email_verified=True,
            is_active=True
        )
    ]
    
    for user in users:
        db.add(user)
    
    await db.commit()
    print(f"✅ Created {len(users)} users")
    print("   Password for all test users: TestPass123!")


async def seed_courses(db: AsyncSession):
    """Create sample courses"""
    print("📚 Creating courses...")
    
    # Get instructor IDs
    from sqlalchemy import select
    
    # Get teachers
    result = await db.execute(
        select(User).where(
            User.role == UserRole.TEACHER,
            User.org_id == ORG_HIGH_SCHOOL_ID
        )
    )
    hs_teacher = result.scalar_one_or_none()
    
    result = await db.execute(
        select(User).where(
            User.role == UserRole.TEACHER,
            User.org_id == ORG_UNIVERSITY_ID
        )
    )
    uni_teacher = result.scalar_one_or_none()
    
    result = await db.execute(
        select(User).where(
            User.role == UserRole.TEACHER,
            User.org_id == ORG_MED_SCHOOL_ID
        )
    )
    med_teacher = result.scalar_one_or_none()
    
    courses = [
        # High School courses
        Course(
            id=uuid4(),
            org_id=ORG_HIGH_SCHOOL_ID,
            title="Introduction to Biology",
            code="BIO-101",
            description="Explore the fundamentals of life sciences with hands-on labs and interactive simulations.",
            tier=TierType.HIGH_SCHOOL,
            instructor_id=hs_teacher.id if hs_teacher else None,
            subject="Science",
            level="beginner",
            credits=1,
            is_published=True,
            start_date=datetime.now() - timedelta(days=30),
            end_date=datetime.now() + timedelta(days=150),
            learning_objectives=[
                "Understand cell structure and function",
                "Explain photosynthesis and cellular respiration",
                "Describe genetics and heredity"
            ],
            standards={
                "ngss": ["HS-LS1-1", "HS-LS1-2", "HS-LS1-6"]
            }
        ),
        Course(
            id=uuid4(),
            org_id=ORG_HIGH_SCHOOL_ID,
            title="Algebra I",
            code="MATH-101",
            description="Master algebraic concepts through gamified learning and real-world applications.",
            tier=TierType.HIGH_SCHOOL,
            instructor_id=hs_teacher.id if hs_teacher else None,
            subject="Mathematics",
            level="intermediate",
            credits=1,
            is_published=True,
            start_date=datetime.now() - timedelta(days=30),
            end_date=datetime.now() + timedelta(days=150),
            learning_objectives=[
                "Solve linear equations and inequalities",
                "Work with polynomials and factoring",
                "Understand functions and their graphs"
            ]
        ),
        
        # University courses
        Course(
            id=uuid4(),
            org_id=ORG_UNIVERSITY_ID,
            title="Data Structures & Algorithms",
            code="CS-201",
            description="Comprehensive study of fundamental data structures and algorithmic techniques.",
            tier=TierType.UNDERGRADUATE,
            instructor_id=uni_teacher.id if uni_teacher else None,
            subject="Computer Science",
            level="intermediate",
            credits=4,
            is_published=True,
            start_date=datetime.now() - timedelta(days=7),
            end_date=datetime.now() + timedelta(days=105),
            learning_objectives=[
                "Implement common data structures",
                "Analyze algorithm complexity",
                "Apply appropriate data structures to solve problems"
            ],
            standards={
                "abet": ["CS-1", "CS-2", "CS-3"]
            }
        ),
        Course(
            id=uuid4(),
            org_id=ORG_UNIVERSITY_ID,
            title="Introduction to Psychology",
            code="PSY-101",
            description="Explore the scientific study of behavior and mental processes.",
            tier=TierType.UNDERGRADUATE,
            instructor_id=uni_teacher.id if uni_teacher else None,
            subject="Psychology",
            level="beginner",
            credits=3,
            is_published=True,
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=105)
        ),
        
        # Medical School courses
        Course(
            id=uuid4(),
            org_id=ORG_MED_SCHOOL_ID,
            title="Clinical Pathology",
            code="PATH-302",
            description="Advanced study of disease mechanisms with clinical case studies and OSCE preparation.",
            tier=TierType.PROFESSIONAL_MEDICAL,
            instructor_id=med_teacher.id if med_teacher else None,
            subject="Pathology",
            level="advanced",
            credits=5,
            is_published=True,
            start_date=datetime.now() - timedelta(days=14),
            end_date=datetime.now() + timedelta(days=90),
            learning_objectives=[
                "Diagnose common pathological conditions",
                "Interpret laboratory results",
                "Demonstrate clinical reasoning in OSCE scenarios"
            ],
            settings={
                "osce_enabled": True,
                "clinical_cases_count": 50
            }
        )
    ]
    
    for course in courses:
        db.add(course)
    
    await db.commit()
    print(f"✅ Created {len(courses)} courses")


async def seed_enrollments(db: AsyncSession):
    """Create sample enrollments"""
    print("📝 Creating enrollments...")
    
    from sqlalchemy import select
    
    # Get students and courses
    result = await db.execute(
        select(User).where(User.role == UserRole.STUDENT)
    )
    students = list(result.scalars().all())
    
    result = await db.execute(
        select(Course).where(Course.is_published == True)
    )
    courses = list(result.scalars().all())
    
    enrollments = []
    
    # Enroll each student in courses from their org
    for student in students:
        student_courses = [c for c in courses if c.org_id == student.org_id]
        
        for course in student_courses[:2]:  # Enroll in first 2 courses
            enrollment = Enrollment(
                id=uuid4(),
                user_id=student.id,
                course_id=course.id,
                status='active',
                progress_percent=25 if course == student_courses[0] else 10,
                mastery_level=30 if course == student_courses[0] else 15,
                enrolled_at=datetime.now() - timedelta(days=20)
            )
            enrollments.append(enrollment)
            db.add(enrollment)
    
    await db.commit()
    print(f"✅ Created {len(enrollments)} enrollments")


async def main():
    """Main seed function"""
    print("=" * 60)
    print("🌱 EUREKA Database Seeding")
    print("=" * 60)
    
    async with async_session_maker() as db:
        try:
            await seed_organizations(db)
            await seed_users(db)
            await seed_courses(db)
            await seed_enrollments(db)
            
            print("\n" + "=" * 60)
            print("✅ Database seeding completed successfully!")
            print("=" * 60)
            print("\n📋 Test Credentials:")
            print("   Email: admin@eureka.edu")
            print("   Email: teacher@springfield-hs.edu")
            print("   Email: student@midwest-state.edu")
            print("   Password: TestPass123!")
            print("\n📊 Created:")
            print("   - 3 Organizations (HS, University, Medical)")
            print("   - 8 Users (1 super admin, 3 teachers, 4 students)")
            print("   - 5 Courses (across all tiers)")
            print("   - ~8 Enrollments")
            
        except Exception as e:
            print(f"\n❌ Error seeding database: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(main())

"""
Pytest configuration and fixtures for API Core tests
"""

import asyncio
import pytest
from typing import AsyncGenerator, Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from faker import Faker

from main import app
from app.core.database import Base, get_db
from app.core.config import get_settings
from app.models.user import User
from app.models.organization import Organization
from app.core.security import get_password_hash, create_access_token

# Initialize Faker
fake = Faker()

# Test database configuration
TEST_DATABASE_URL = "sqlite:///:memory:"  # In-memory SQLite for tests

# Create test engine
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """
    Create a fresh database for each test.
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Create a new session for the test
    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        # Drop all tables after the test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """
    Create a test client with a fresh database.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def test_organization(db_session: Session) -> Organization:
    """Create a test organization."""
    org = Organization(
        id=fake.uuid4(),
        name=fake.company(),
        domain=fake.domain_name(),
        settings={
            "theme": "default",
            "features": ["ai_tutor", "assessments"]
        },
        is_active=True
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


@pytest.fixture
def test_user(db_session: Session, test_organization: Organization) -> User:
    """Create a test user."""
    user = User(
        id=fake.uuid4(),
        email=fake.email(),
        username=fake.user_name(),
        full_name=fake.name(),
        hashed_password=get_password_hash("testpassword123"),
        organization_id=test_organization.id,
        role="student",
        is_active=True,
        is_verified=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_admin_user(db_session: Session, test_organization: Organization) -> User:
    """Create a test admin user."""
    admin = User(
        id=fake.uuid4(),
        email=fake.email(),
        username=fake.user_name(),
        full_name=fake.name(),
        hashed_password=get_password_hash("adminpassword123"),
        organization_id=test_organization.id,
        role="admin",
        is_active=True,
        is_verified=True,
        is_superuser=True
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def test_teacher_user(db_session: Session, test_organization: Organization) -> User:
    """Create a test teacher user."""
    teacher = User(
        id=fake.uuid4(),
        email=fake.email(),
        username=fake.user_name(),
        full_name=fake.name(),
        hashed_password=get_password_hash("teacherpassword123"),
        organization_id=test_organization.id,
        role="teacher",
        is_active=True,
        is_verified=True
    )
    db_session.add(teacher)
    db_session.commit()
    db_session.refresh(teacher)
    return teacher


@pytest.fixture
def auth_headers(test_user: User) -> dict:
    """Generate authentication headers for test user."""
    access_token = create_access_token(
        data={
            "sub": str(test_user.id),
            "email": test_user.email,
            "org_id": str(test_user.organization_id),
            "role": test_user.role
        }
    )
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def admin_auth_headers(test_admin_user: User) -> dict:
    """Generate authentication headers for admin user."""
    access_token = create_access_token(
        data={
            "sub": str(test_admin_user.id),
            "email": test_admin_user.email,
            "org_id": str(test_admin_user.organization_id),
            "role": test_admin_user.role
        }
    )
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def teacher_auth_headers(test_teacher_user: User) -> dict:
    """Generate authentication headers for teacher user."""
    access_token = create_access_token(
        data={
            "sub": str(test_teacher_user.id),
            "email": test_teacher_user.email,
            "org_id": str(test_teacher_user.organization_id),
            "role": test_teacher_user.role
        }
    )
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def mock_email_service(monkeypatch):
    """Mock email service to prevent actual emails being sent during tests."""
    async def mock_send_email(*args, **kwargs):
        return True

    # Patch the email service
    monkeypatch.setattr("app.services.email_service.send_email", mock_send_email)
    return mock_send_email


# Helper functions for tests
def create_test_user_data():
    """Generate test user registration data."""
    return {
        "email": fake.email(),
        "username": fake.user_name(),
        "password": "TestPassword123!",
        "full_name": fake.name(),
        "role": "student"
    }


def create_test_course_data():
    """Generate test course data."""
    return {
        "title": fake.catch_phrase(),
        "description": fake.paragraph(),
        "level": "undergraduate",
        "subject": fake.word(),
        "credits": fake.random_int(min=1, max=4)
    }

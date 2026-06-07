"""
Pytest configuration and fixtures for API Core tests
"""

import os

# Disable the OpenTelemetry OTLP exporter for the whole test session BEFORE the
# app is imported (init_observability runs at import and only wires the exporter
# when OTEL_EXPORTER_OTLP_ENDPOINT is set). In docker the api-core env points it
# at jaeger:4317, which isn't up during tests — so every request blocked on a
# gRPC export retry/timeout, making the suite ~50x slower (a single file took
# ~3.5 min instead of ~4s). Clearing it here keeps tests fast and offline.
os.environ.pop("OTEL_EXPORTER_OTLP_ENDPOINT", None)
os.environ.setdefault("OTEL_SDK_DISABLED", "true")

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
# app.core.security does not exist — the canonical auth utilities live in
# app.utils.auth (what the login endpoint + get_current_user use). The real
# hashing fn is `hash_password`; alias it so the fixtures below read naturally.
# Importing from the same module the app uses guarantees test-created hashes
# verify and test tokens validate.
from app.utils.auth import hash_password as get_password_hash, create_access_token

# Register the SQLite shims (UUID/JSONB/ARRAY/ENUM/INET/TSVECTOR compile rules,
# PG-only CHECK-constraint stripping, tz handling) BEFORE any create_all below.
# The models use Postgres-native column types the in-memory SQLite test engine
# can't render on its own, so without this create_all dies with
# "SQLiteTypeCompiler has no attribute 'visit_UUID'". install_all is idempotent.
from tests.integration._sqlite_compat import install_all as _install_sqlite_compat

_install_sqlite_compat(Base)

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
        name=fake.company(),
        # Model has `slug` (unique) + required `tier`; there is no `domain`.
        slug=f"org-{fake.uuid4()[:8]}",
        tier="high_school",
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
        email=fake.unique.email(),
        # Model uses first_name/last_name (no username/full_name), org_id (not
        # organization_id), and is_email_verified (not is_verified).
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        hashed_password=get_password_hash("testpassword123"),
        org_id=test_organization.id,
        role="student",
        is_active=True,
        is_email_verified=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_admin_user(db_session: Session, test_organization: Organization) -> User:
    """Create a test admin user."""
    admin = User(
        email=fake.unique.email(),
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        hashed_password=get_password_hash("adminpassword123"),
        org_id=test_organization.id,
        # No is_superuser column — admin is role-based (UserRole.SUPER_ADMIN).
        role="super_admin",
        is_active=True,
        is_email_verified=True
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def test_teacher_user(db_session: Session, test_organization: Organization) -> User:
    """Create a test teacher user."""
    teacher = User(
        email=fake.unique.email(),
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        hashed_password=get_password_hash("teacherpassword123"),
        org_id=test_organization.id,
        role="teacher",
        is_active=True,
        is_email_verified=True
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
            "org_id": str(test_user.org_id),
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
            "org_id": str(test_admin_user.org_id),
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
            "org_id": str(test_teacher_user.org_id),
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

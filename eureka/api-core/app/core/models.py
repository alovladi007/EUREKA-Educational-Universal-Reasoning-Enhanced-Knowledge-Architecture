"""
Core database models for EUREKA

Defines SQLAlchemy models for:
- Organizations (multi-tenancy)
- Users
- Roles & Permissions
- Audit logs
"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, JSON, Enum as SQLEnum, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from enum import Enum
import uuid

from app.core.database import Base


class TierType(str, Enum):
    """Educational tier types"""
    HIGH_SCHOOL = "high_school"
    UNDERGRADUATE = "undergraduate"
    GRADUATE = "graduate"
    PROFESSIONAL_MEDICAL = "professional_medical"
    PROFESSIONAL_LAW = "professional_law"
    PROFESSIONAL_MBA = "professional_mba"
    PROFESSIONAL_ENG = "professional_engineering"


class UserRole(str, Enum):
    """User roles"""
    SUPER_ADMIN = "super_admin"
    ORG_ADMIN = "org_admin"
    TEACHER = "teacher"
    STUDENT = "student"
    PARENT = "parent"
    RESEARCHER = "researcher"


class Organization(Base):
    """Organization model for multi-tenancy"""
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    tier = Column(SQLEnum(TierType), nullable=False)
    
    # Contact information
    email = Column(String(255))
    phone = Column(String(50))
    website = Column(String(255))
    
    # Address
    address_line1 = Column(String(255))
    address_line2 = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    country = Column(String(2), default="US")  # ISO 3166-1 alpha-2
    
    # Settings
    settings = Column(JSONB, default={})
    tier_config = Column(JSONB, default={})  # Tier-specific configuration
    
    # Compliance
    ferpa_compliant = Column(Boolean, default=True)
    coppa_compliant = Column(Boolean, default=False)
    hipaa_compliant = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="organization")
    courses = relationship("Course", back_populates="organization")
    
    def __repr__(self):
        return f"<Organization(id={self.id}, name={self.name}, tier={self.tier})>"


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    
    # Authentication
    email = Column(String(255), nullable=False, index=True)
    hashed_password = Column(String(255))
    email_verified = Column(Boolean, default=False)
    
    # Profile
    first_name = Column(String(100))
    last_name = Column(String(100))
    display_name = Column(String(200))
    avatar_url = Column(String(500))
    
    # Role
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.STUDENT)
    
    # Student-specific
    student_id = Column(String(100))  # External student ID
    date_of_birth = Column(DateTime)
    grade_level = Column(Integer)  # For HS tier
    
    # Parental consent (COPPA)
    parental_consent_given = Column(Boolean, default=False)
    parent_email = Column(String(255))
    parent_consent_date = Column(DateTime)
    
    # Preferences
    locale = Column(String(10), default="en-US")
    timezone = Column(String(50), default="UTC")
    preferences = Column(JSONB, default={})
    
    # Status
    is_active = Column(Boolean, default=True)
    is_banned = Column(Boolean, default=False)
    ban_reason = Column(Text)
    
    # Authentication tracking
    last_login_at = Column(DateTime)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime)  # Soft delete
    
    # Relationships
    organization = relationship("Organization", back_populates="users")
    enrollments = relationship("Enrollment", back_populates="user")
    
    # Constraints
    __table_args__ = (
        Index('idx_org_email', 'org_id', 'email', unique=True),
        CheckConstraint('date_of_birth IS NULL OR date_of_birth < NOW()', name='valid_birthdate'),
    )
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"


class Permission(Base):
    """Permission model"""
    __tablename__ = "permissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    resource = Column(String(50), nullable=False)  # e.g., 'course', 'user', 'assessment'
    action = Column(String(50), nullable=False)  # e.g., 'create', 'read', 'update', 'delete'
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Permission(name={self.name}, resource={self.resource}, action={self.action})>"


class RolePermission(Base):
    """Mapping between roles and permissions"""
    __tablename__ = "role_permissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(SQLEnum(UserRole), nullable=False, index=True)
    permission_id = Column(UUID(as_uuid=True), ForeignKey("permissions.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index('idx_role_permission', 'role', 'permission_id', unique=True),
    )


class Course(Base):
    """Course model"""
    __tablename__ = "courses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    
    # Basic info
    title = Column(String(255), nullable=False)
    code = Column(String(50))  # e.g., "CS101"
    description = Column(Text)
    
    # Educational tier
    tier = Column(SQLEnum(TierType), nullable=False)
    
    # Instructors
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Curriculum
    syllabus = Column(JSONB)
    learning_objectives = Column(JSONB)  # Array of objectives
    standards = Column(JSONB)  # e.g., CCSS, NGSS mappings
    
    # Metadata
    subject = Column(String(100))  # e.g., "Mathematics", "Biology"
    level = Column(String(50))  # e.g., "Beginner", "Intermediate", "Advanced"
    credits = Column(Integer)
    
    # Settings
    settings = Column(JSONB, default={})
    
    # Status
    is_published = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    
    # Timestamps
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    organization = relationship("Organization", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
    
    __table_args__ = (
        Index('idx_org_tier', 'org_id', 'tier'),
        Index('idx_published', 'is_published', 'is_archived'),
    )
    
    def __repr__(self):
        return f"<Course(id={self.id}, title={self.title}, tier={self.tier})>"


class Enrollment(Base):
    """User enrollment in courses"""
    __tablename__ = "enrollments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False, index=True)
    
    # Enrollment status
    status = Column(String(50), default="active")  # active, completed, withdrawn, dropped
    
    # Progress
    progress_percent = Column(Integer, default=0)
    mastery_level = Column(Integer, default=0)  # 0-100
    
    # Timestamps
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime)
    withdrawn_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    
    __table_args__ = (
        Index('idx_user_course', 'user_id', 'course_id', unique=True),
        CheckConstraint('progress_percent >= 0 AND progress_percent <= 100', name='valid_progress'),
    )
    
    def __repr__(self):
        return f"<Enrollment(user_id={self.user_id}, course_id={self.course_id}, status={self.status})>"


class AuditLog(Base):
    """Audit log for compliance (FERPA, HIPAA)"""
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    
    # Who
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    user_email = Column(String(255))
    user_role = Column(String(50))
    
    # What
    action = Column(String(100), nullable=False, index=True)  # e.g., 'user.view', 'course.update'
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(UUID(as_uuid=True), index=True)
    
    # Details
    details = Column(JSONB)
    changes = Column(JSONB)  # Old and new values for updates
    
    # Request metadata
    ip_address = Column(String(45))  # IPv6 max length
    user_agent = Column(String(500))
    request_id = Column(String(100))
    
    # Status
    status = Column(String(50))  # success, failure, denied
    error_message = Column(Text)
    
    # Timestamp (immutable)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    __table_args__ = (
        Index('idx_audit_timestamp', 'timestamp'),
        Index('idx_audit_action', 'action'),
        Index('idx_audit_user', 'user_id', 'timestamp'),
        Index('idx_audit_resource', 'resource_type', 'resource_id'),
    )
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, action={self.action}, timestamp={self.timestamp})>"

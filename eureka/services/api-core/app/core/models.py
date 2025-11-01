"""
Core enums and constants for EUREKA

This file contains enums used throughout the application.
The actual database models are in app/models/
"""

from enum import Enum


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

"""
CRUD operations for EUREKA API Core

Exports all database CRUD functions.
"""

# User CRUD
from app.crud.user import (
    create_user,
    get_user_by_id,
    get_user_by_email,
    get_users,
    update_user,
    update_user_password,
    verify_user_email,
    update_last_login,
    increment_failed_login_attempts,
    delete_user,
    ban_user,
    unban_user,
)

# Organization CRUD
from app.crud.organization import (
    create_organization,
    get_organization_by_id,
    get_organization_by_slug,
    get_organizations,
    update_organization,
    delete_organization,
    get_organization_stats,
)

# Course CRUD
from app.crud.course import (
    create_course,
    get_course_by_id,
    get_courses,
    update_course,
    delete_course,
    publish_course,
    archive_course,
    get_course_stats,
)

# Enrollment CRUD (from course.py)
from app.crud.course import (
    create_enrollment,
    get_enrollment_by_id,
    get_user_enrollments,
    get_course_enrollments,
    update_enrollment,
    withdraw_enrollment,
    complete_enrollment,
)

__all__ = [
    # User
    "create_user",
    "get_user_by_id",
    "get_user_by_email",
    "get_users",
    "update_user",
    "update_user_password",
    "verify_user_email",
    "update_last_login",
    "increment_failed_login_attempts",
    "delete_user",
    "ban_user",
    "unban_user",
    # Organization
    "create_organization",
    "get_organization_by_id",
    "get_organization_by_slug",
    "get_organizations",
    "update_organization",
    "delete_organization",
    "get_organization_stats",
    # Course
    "create_course",
    "get_course_by_id",
    "get_courses",
    "update_course",
    "delete_course",
    "publish_course",
    "archive_course",
    "get_course_stats",
    # Enrollment
    "create_enrollment",
    "get_enrollment_by_id",
    "get_user_enrollments",
    "get_course_enrollments",
    "update_enrollment",
    "withdraw_enrollment",
    "complete_enrollment",
]

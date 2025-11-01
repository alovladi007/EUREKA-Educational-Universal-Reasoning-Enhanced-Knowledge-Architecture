"""
CRUD operations for organizations

Database operations for organization management.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from uuid import UUID
from datetime import datetime

from app.models import Organization, User, Course, Enrollment
from app.core.models import TierType
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationStats


async def create_organization(
    db: AsyncSession,
    org_data: OrganizationCreate
) -> Organization:
    """
    Create a new organization.
    
    Args:
        db: Database session
        org_data: Organization creation data
        
    Returns:
        Created organization object
    """
    org = Organization(
        name=org_data.name,
        slug=org_data.slug,
        tier=org_data.tier,
        email=org_data.email,
        phone=org_data.phone,
        website=str(org_data.website) if org_data.website else None,
        address_line1=org_data.address_line1,
        address_line2=org_data.address_line2,
        city=org_data.city,
        state=org_data.state,
        postal_code=org_data.postal_code,
        country=org_data.country,
        settings=org_data.settings,
        tier_config=org_data.tier_config,
        ferpa_compliant=org_data.ferpa_compliant,
        coppa_compliant=org_data.coppa_compliant,
        hipaa_compliant=org_data.hipaa_compliant,
        is_active=True,
        is_verified=False
    )
    
    db.add(org)
    await db.commit()
    await db.refresh(org)
    
    return org


async def get_organization_by_id(
    db: AsyncSession,
    org_id: UUID
) -> Optional[Organization]:
    """
    Get an organization by ID.
    
    Args:
        db: Database session
        org_id: Organization ID
        
    Returns:
        Organization object or None if not found
    """
    result = await db.execute(
        select(Organization).where(Organization.id == org_id)
    )
    return result.scalar_one_or_none()


async def get_organization_by_slug(
    db: AsyncSession,
    slug: str
) -> Optional[Organization]:
    """
    Get an organization by slug.
    
    Args:
        db: Database session
        slug: Organization slug
        
    Returns:
        Organization object or None if not found
    """
    result = await db.execute(
        select(Organization).where(Organization.slug == slug)
    )
    return result.scalar_one_or_none()


async def get_organizations(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    tier: Optional[TierType] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None
) -> tuple[List[Organization], int]:
    """
    Get a paginated list of organizations.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        tier: Optional tier filter
        is_active: Optional active status filter
        search: Optional search query
        
    Returns:
        Tuple of (list of organizations, total count)
    """
    # Base query
    query = select(Organization)
    
    # Apply filters
    if tier:
        query = query.where(Organization.tier == tier)
    
    if is_active is not None:
        query = query.where(Organization.is_active == is_active)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            Organization.name.ilike(search_pattern) |
            Organization.slug.ilike(search_pattern)
        )
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Get paginated results
    query = query.offset(skip).limit(limit).order_by(Organization.created_at.desc())
    result = await db.execute(query)
    orgs = result.scalars().all()
    
    return list(orgs), total


async def update_organization(
    db: AsyncSession,
    org: Organization,
    update_data: OrganizationUpdate
) -> Organization:
    """
    Update an organization.
    
    Args:
        db: Database session
        org: Organization object to update
        update_data: Update data
        
    Returns:
        Updated organization object
    """
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        if field == "website" and value:
            value = str(value)
        setattr(org, field, value)
    
    org.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(org)
    
    return org


async def delete_organization(
    db: AsyncSession,
    org: Organization
) -> None:
    """
    Soft delete an organization.
    
    Args:
        db: Database session
        org: Organization object to delete
    """
    org.is_active = False
    org.updated_at = datetime.utcnow()
    
    await db.commit()


async def verify_organization(
    db: AsyncSession,
    org: Organization
) -> Organization:
    """
    Mark an organization as verified.
    
    Args:
        db: Database session
        org: Organization object
        
    Returns:
        Updated organization object
    """
    org.is_verified = True
    org.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(org)
    
    return org


async def get_organization_stats(
    db: AsyncSession,
    org_id: UUID
) -> OrganizationStats:
    """
    Get statistics for an organization.
    
    Args:
        db: Database session
        org_id: Organization ID
        
    Returns:
        Organization statistics
    """
    # Count total users
    total_users_result = await db.execute(
        select(func.count(User.id)).where(User.org_id == org_id)
    )
    total_users = total_users_result.scalar() or 0
    
    # Count active users
    active_users_result = await db.execute(
        select(func.count(User.id)).where(
            and_(User.org_id == org_id, User.is_active == True)
        )
    )
    active_users = active_users_result.scalar() or 0
    
    # Count total courses
    total_courses_result = await db.execute(
        select(func.count(Course.id)).where(Course.org_id == org_id)
    )
    total_courses = total_courses_result.scalar() or 0
    
    # Count active courses
    active_courses_result = await db.execute(
        select(func.count(Course.id)).where(
            and_(
                Course.org_id == org_id,
                Course.is_published == True,
                Course.is_archived == False
            )
        )
    )
    active_courses = active_courses_result.scalar() or 0
    
    # Count total enrollments
    total_enrollments_result = await db.execute(
        select(func.count(Enrollment.id))
        .select_from(Enrollment)
        .join(Course, Enrollment.course_id == Course.id)
        .where(Course.org_id == org_id)
    )
    total_enrollments = total_enrollments_result.scalar() or 0
    
    # Count active enrollments
    active_enrollments_result = await db.execute(
        select(func.count(Enrollment.id))
        .select_from(Enrollment)
        .join(Course, Enrollment.course_id == Course.id)
        .where(
            and_(
                Course.org_id == org_id,
                Enrollment.status == 'active'
            )
        )
    )
    active_enrollments = active_enrollments_result.scalar() or 0
    
    return OrganizationStats(
        org_id=org_id,
        total_users=total_users,
        active_users=active_users,
        total_courses=total_courses,
        active_courses=active_courses,
        total_enrollments=total_enrollments,
        active_enrollments=active_enrollments
    )

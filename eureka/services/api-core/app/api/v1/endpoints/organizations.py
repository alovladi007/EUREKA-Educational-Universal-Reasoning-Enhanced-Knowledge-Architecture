"""
Organization API endpoints

Handles organization management operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.schemas.organization import (
    OrganizationCreate, OrganizationUpdate, OrganizationResponse,
    OrganizationList, OrganizationStats
)
from app.crud import organization as org_crud
from app.crud import user as user_crud
from app.schemas.auth import UserResponse
from app.utils.dependencies import (
    get_current_user, require_super_admin, verify_org_access
)
from app.models import User
from app.core.models import UserRole

router = APIRouter()


@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: User = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new organization.
    Requires: Super admin role
    """
    # Check if slug already exists
    existing = await org_crud.get_organization_by_slug(db, org_data.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Organization with slug '{org_data.slug}' already exists"
        )
    
    # Create organization
    org = await org_crud.create_organization(db, org_data)
    
    return OrganizationResponse.model_validate(org)


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get organization by ID.
    Requires: Member of organization OR super admin
    """
    org = await org_crud.get_organization_by_id(db, org_id)
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Verify access
    await verify_org_access(org_id, current_user)
    
    return OrganizationResponse.model_validate(org)


@router.patch("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: UUID,
    update_data: OrganizationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update organization.
    Requires: Org admin OR super admin
    """
    org = await org_crud.get_organization_by_id(db, org_id)
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.SUPER_ADMIN:
        pass  # Super admin can update any org
    elif current_user.role == UserRole.ORG_ADMIN and current_user.org_id == org_id:
        pass  # Org admin can update their own org
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to update organization"
        )
    
    # Update organization
    updated_org = await org_crud.update_organization(db, org, update_data)
    
    return OrganizationResponse.model_validate(updated_org)


@router.get("/", response_model=OrganizationList)
async def list_organizations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    tier: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    List all organizations.
    Requires: Super admin role
    """
    from app.core.models import TierType
    
    tier_enum = TierType(tier) if tier else None
    orgs, total = await org_crud.get_organizations(
        db, skip, limit, tier_enum, is_active, search
    )
    
    pages = (total + limit - 1) // limit
    
    return OrganizationList(
        items=[OrganizationResponse.model_validate(o) for o in orgs],
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        pages=pages
    )


@router.get("/{org_id}/stats", response_model=OrganizationStats)
async def get_organization_stats(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get organization statistics.
    Requires: Member of organization OR super admin
    """
    org = await org_crud.get_organization_by_id(db, org_id)
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Verify access
    await verify_org_access(org_id, current_user)
    
    stats = await org_crud.get_organization_stats(db, org_id)
    
    return stats


@router.get("/{org_id}/users", response_model=dict)
async def get_organization_users(
    org_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get users in organization.
    Requires: Org admin OR super admin
    """
    org = await org_crud.get_organization_by_id(db, org_id)
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check permissions
    if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    
    # Verify org access for non-super admins
    if current_user.role != UserRole.SUPER_ADMIN:
        await verify_org_access(org_id, current_user)
    
    # Get users
    role_enum = UserRole(role) if role else None
    users, total = await user_crud.get_users(
        db, org_id, skip, limit, role_enum, is_active, search
    )
    
    pages = (total + limit - 1) // limit
    
    return {
        "items": [UserResponse.model_validate(u) for u in users],
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "pages": pages
    }


@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_organization(
    org_id: UUID,
    current_user: User = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Soft delete an organization.
    Requires: Super admin role
    """
    org = await org_crud.get_organization_by_id(db, org_id)
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    await org_crud.delete_organization(db, org)
    
    return None


@router.post("/{org_id}/verify", response_model=OrganizationResponse)
async def verify_organization(
    org_id: UUID,
    current_user: User = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Verify an organization.
    Requires: Super admin role
    """
    org = await org_crud.get_organization_by_id(db, org_id)
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    verified_org = await org_crud.verify_organization(db, org)
    
    return OrganizationResponse.model_validate(verified_org)

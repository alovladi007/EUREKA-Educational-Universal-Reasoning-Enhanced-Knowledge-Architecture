"""
Shared Authentication Middleware for EUREKA Phase 2 Services

This middleware provides JWT token validation and user authentication
across all Phase 2 microservices, ensuring consistent security.
"""

from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os
import logging

logger = logging.getLogger(__name__)

# JWT Configuration (should match api-core settings)
JWT_SECRET = os.getenv("JWT_SECRET", "eureka_dev_secret_key_change_in_production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# Security scheme
security = HTTPBearer()


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT token.

    Args:
        token: JWT token to decode

    Returns:
        Decoded token payload

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        logger.error(f"Token validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_access_token(token: str) -> Dict[str, Any]:
    """
    Verify a JWT access token and check its type.

    Args:
        token: JWT access token

    Returns:
        Decoded token payload with user info

    Raises:
        HTTPException: If token is invalid, expired, or wrong type
    """
    payload = decode_token(token)

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


async def get_current_user(credentials: HTTPAuthorizationCredentials = security) -> Dict[str, Any]:
    """
    FastAPI dependency to get the current authenticated user.

    Args:
        credentials: HTTP Bearer credentials from request

    Returns:
        User information from token payload

    Raises:
        HTTPException: If authentication fails
    """
    token = credentials.credentials
    payload = verify_access_token(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "user_id": user_id,
        "email": payload.get("email"),
        "tier": payload.get("tier"),
        "role": payload.get("role"),
        "token_data": payload
    }


async def get_optional_user(request: Request) -> Optional[Dict[str, Any]]:
    """
    Get user info from request if authenticated, None otherwise.
    Useful for endpoints that work both with and without authentication.

    Args:
        request: FastAPI request object

    Returns:
        User info if authenticated, None otherwise
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    try:
        token = auth_header.split(" ")[1]
        payload = verify_access_token(token)
        user_id = payload.get("sub")

        if not user_id:
            return None

        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "tier": payload.get("tier"),
            "role": payload.get("role"),
            "token_data": payload
        }
    except HTTPException:
        return None


def require_role(required_role: str):
    """
    Dependency factory to require a specific role.

    Args:
        required_role: The role required to access the endpoint

    Returns:
        Dependency function that checks user role
    """
    async def role_checker(user: Dict[str, Any] = get_current_user) -> Dict[str, Any]:
        user_role = user.get("role")
        if user_role != required_role and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {required_role}"
            )
        return user

    return role_checker


def require_tier(required_tier: str):
    """
    Dependency factory to require a specific education tier.

    Args:
        required_tier: The tier required to access the endpoint

    Returns:
        Dependency function that checks user tier
    """
    async def tier_checker(user: Dict[str, Any] = get_current_user) -> Dict[str, Any]:
        user_tier = user.get("tier")
        if user_tier != required_tier:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access restricted to {required_tier} tier"
            )
        return user

    return tier_checker


# Service-to-Service Authentication
def create_service_token(service_name: str) -> str:
    """
    Create a JWT token for service-to-service communication.

    Args:
        service_name: Name of the calling service

    Returns:
        JWT token for service authentication
    """
    from datetime import datetime, timedelta

    payload = {
        "sub": f"service:{service_name}",
        "type": "service",
        "service_name": service_name,
        "exp": datetime.utcnow() + timedelta(minutes=60),
        "iat": datetime.utcnow()
    }

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_service_token(token: str) -> str:
    """
    Verify a service-to-service authentication token.

    Args:
        token: Service JWT token

    Returns:
        Service name from token

    Raises:
        HTTPException: If token is invalid
    """
    payload = decode_token(token)

    if payload.get("type") != "service":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid service token"
        )

    return payload.get("service_name")

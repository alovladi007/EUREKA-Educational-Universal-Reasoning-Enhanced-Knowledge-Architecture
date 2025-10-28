"""
Tenancy Middleware for EUREKA

Ensures all requests are scoped to the correct organization for multi-tenancy.
"""

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import logging
import jwt

from app.core.config import settings

logger = logging.getLogger(__name__)


class TenancyMiddleware(BaseHTTPMiddleware):
    """Middleware to enforce org-scoped tenancy"""
    
    EXCLUDED_PATHS = [
        "/health",
        "/ready",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/refresh",
    ]
    
    async def dispatch(self, request: Request, call_next):
        """
        Process request and inject org_id from JWT token.
        
        Extracts org_id from the JWT token and adds it to request.state
        so downstream handlers can filter by organization.
        """
        # Skip tenancy check for excluded paths
        if any(request.url.path.startswith(path) for path in self.EXCLUDED_PATHS):
            return await call_next(request)
        
        # Extract JWT token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            # Allow unauthenticated access - let auth dependency handle it
            response = await call_next(request)
            return response
        
        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM]
            )
            
            # Extract org_id from token
            org_id = payload.get("org_id")
            user_id = payload.get("sub")
            role = payload.get("role")
            
            if org_id:
                # Inject into request state
                request.state.org_id = org_id
                request.state.user_id = user_id
                request.state.role = role
                
                logger.debug(f"Request scoped to org_id={org_id}, user_id={user_id}, role={role}")
            
        except jwt.ExpiredSignatureError:
            logger.warning("Expired JWT token")
            return Response(
                content='{"detail":"Token has expired"}',
                status_code=401,
                media_type="application/json"
            )
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid JWT token: {e}")
            return Response(
                content='{"detail":"Invalid token"}',
                status_code=401,
                media_type="application/json"
            )
        except Exception as e:
            logger.error(f"Error in tenancy middleware: {e}", exc_info=True)
        
        response = await call_next(request)
        return response

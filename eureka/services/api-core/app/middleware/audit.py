"""
Audit Middleware for EUREKA

Logs all API actions for compliance (FERPA, HIPAA, COPPA).
"""

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time
import uuid

logger = logging.getLogger(__name__)


class AuditMiddleware(BaseHTTPMiddleware):
    """Middleware to audit all API requests for compliance"""
    
    EXCLUDED_PATHS = [
        "/health",
        "/ready",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/static",
    ]
    
    SENSITIVE_ACTIONS = [
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
    ]
    
    async def dispatch(self, request: Request, call_next):
        """
        Log request details for audit trail.
        
        For compliance with FERPA (7 years) and HIPAA (6 years),
        we log all state-changing operations.
        """
        # Skip audit for excluded paths
        if any(request.url.path.startswith(path) for path in self.EXCLUDED_PATHS):
            return await call_next(request)
        
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Extract request metadata
        start_time = time.time()
        
        audit_data = {
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "ip_address": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
            "org_id": getattr(request.state, "org_id", None),
            "user_id": getattr(request.state, "user_id", None),
            "role": getattr(request.state, "role", None),
        }
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration_ms = (time.time() - start_time) * 1000
        
        # Log audit entry for sensitive operations or errors
        should_audit = (
            request.method in self.SENSITIVE_ACTIONS or
            response.status_code >= 400
        )
        
        if should_audit:
            audit_data.update({
                "status_code": response.status_code,
                "duration_ms": round(duration_ms, 2),
                "timestamp": time.time(),
            })
            
            # Log level based on status
            if response.status_code >= 500:
                log_level = logging.ERROR
            elif response.status_code >= 400:
                log_level = logging.WARNING
            else:
                log_level = logging.INFO
            
            logger.log(
                log_level,
                f"AUDIT: {request.method} {request.url.path} - {response.status_code}",
                extra=audit_data
            )
            
            # TODO: Write to audit_logs table for compliance
            # This would be done via a background task to avoid blocking
        
        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id
        
        return response

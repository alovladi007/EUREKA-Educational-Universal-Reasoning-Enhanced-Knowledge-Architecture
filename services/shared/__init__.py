"""
EUREKA Shared Services Module

Provides common functionality for Phase 2 microservices:
- Authentication middleware (JWT validation)
- Service-to-service communication client
- Kafka event bus for async messaging
"""

from .auth_middleware import (
    get_current_user,
    get_optional_user,
    require_role,
    require_tier,
    verify_access_token,
    verify_service_token,
)

from .service_client import (
    ServiceClient,
    get_service_client,
)

from .event_bus import (
    EventBus,
    get_event_bus,
    Topics,
)

__all__ = [
    # Auth
    "get_current_user",
    "get_optional_user",
    "require_role",
    "require_tier",
    "verify_access_token",
    "verify_service_token",
    # Service Client
    "ServiceClient",
    "get_service_client",
    # Event Bus
    "EventBus",
    "get_event_bus",
    "Topics",
]

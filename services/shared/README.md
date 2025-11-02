# EUREKA Shared Services Module

This module provides common functionality for all EUREKA Phase 2 microservices, enabling secure authentication, service-to-service communication, and event-driven architecture.

## Components

### 1. Authentication Middleware (`auth_middleware.py`)

Provides JWT-based authentication that integrates with the api-core service.

**Features:**
- JWT token validation
- User authentication via FastAPI dependencies
- Role-based access control
- Tier-based access control
- Service-to-service authentication

**Usage:**

```python
from fastapi import FastAPI, Depends
from shared import get_current_user, require_role

@app.get("/protected")
async def protected_endpoint(current_user: dict = Depends(get_current_user)):
    """Endpoint requiring user authentication."""
    return {"user_id": current_user["user_id"]}

@app.get("/admin-only")
async def admin_endpoint(current_user: dict = Depends(require_role("admin"))):
    """Endpoint requiring admin role."""
    return {"message": "Admin access granted"}
```

### 2. Service Communication Client (`service_client.py`)

HTTP client for secure service-to-service communication with automatic authentication.

**Features:**
- Automatic JWT token generation for service calls
- Token caching and refresh
- Support for all HTTP methods (GET, POST, PUT, DELETE)
- Configurable timeouts
- Error handling and logging

**Usage:**

```python
from shared import get_service_client

# Initialize client
client = get_service_client("pedagogy")

# Make authenticated request to another service
user_data = await client.get(
    service="api-core",
    path="/api/v1/users/123"
)

# POST request
result = await client.post(
    service="assessment",
    path="/api/v1/assessments",
    data={"title": "Math Quiz", "questions": [...]}
)
```

**Available Services:**
- `api-core` (port 8000)
- `tutor-llm` (port 8000)
- `assessment` (port 8000)
- `pedagogy` (port 8040)
- `marketplace` (port 8050)
- `ai-research` (port 8060)
- `xr-labs` (port 8070)
- `ethics-security` (port 8080)
- `data-fabric` (port 8090)
- `institutions` (port 8100)
- `futures` (port 8110)

### 3. Kafka Event Bus (`event_bus.py`)

Event-driven architecture support using Kafka for asynchronous service communication.

**Features:**
- Event publishing to Kafka topics
- Event subscription and consumption
- Automatic event serialization/deserialization
- Consumer group management
- Standard event topics defined

**Usage:**

#### Publishing Events

```python
from shared import get_event_bus, Topics

# Initialize event bus
event_bus = get_event_bus("pedagogy")
await event_bus.start()

# Publish event
await event_bus.publish_event(
    topic=Topics.COURSE_ENROLLED,
    event_type="course.enrolled",
    data={
        "course_id": "calc101",
        "tier": "undergraduate"
    },
    user_id="user123"
)
```

#### Subscribing to Events

```python
from shared import get_event_bus, Topics

# Define event handler
async def handle_enrollment(event: dict):
    user_id = event["user_id"]
    course_id = event["data"]["course_id"]
    # Process enrollment...

# Subscribe
event_bus = get_event_bus("pedagogy")
await event_bus.start()
await event_bus.subscribe(
    topic=Topics.COURSE_ENROLLED,
    handler=handle_enrollment
)

# Start consuming (in background task)
asyncio.create_task(event_bus.consume_events(Topics.COURSE_ENROLLED))
```

#### Standard Event Topics

The `Topics` class provides predefined topics for common events:

**User Events:**
- `USER_CREATED`, `USER_UPDATED`, `USER_DELETED`

**Course Events:**
- `COURSE_CREATED`, `COURSE_UPDATED`, `COURSE_ENROLLED`, `COURSE_COMPLETED`

**Assessment Events:**
- `ASSESSMENT_STARTED`, `ASSESSMENT_COMPLETED`, `ASSESSMENT_GRADED`

**Learning Events:**
- `LESSON_VIEWED`, `LESSON_COMPLETED`, `QUESTION_ANSWERED`

**Tutor Events:**
- `TUTOR_SESSION_STARTED`, `TUTOR_SESSION_ENDED`, `TUTOR_MESSAGE_SENT`

**Pedagogy Events:**
- `KNOWLEDGE_STATE_UPDATED`, `LEARNING_PATH_GENERATED`, `ADAPTATION_TRIGGERED`

**Marketplace Events:**
- `CONTENT_PUBLISHED`, `CONTENT_PURCHASED`, `CONTENT_REVIEWED`

**XR Events:**
- `XR_SESSION_STARTED`, `XR_SESSION_ENDED`, `XR_ACHIEVEMENT_UNLOCKED`

**Research Events:**
- `RESEARCH_QUERY`, `RESEARCH_PAPER_ANALYZED`, `RESEARCH_INSIGHT_GENERATED`

**Ethics & Security Events:**
- `SECURITY_ALERT`, `PRIVACY_VIOLATION`, `COMPLIANCE_CHECK`

**Analytics Events:**
- `ANALYTICS_EVENT`, `PERFORMANCE_METRIC`

## Complete Integration Example

Here's a complete example of integrating all three components into a FastAPI service:

```python
import logging
import sys
import asyncio
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends

# Add parent directory for shared imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from shared import (
    get_event_bus,
    get_service_client,
    get_current_user,
    Topics
)

logger = logging.getLogger(__name__)

# Event handlers
async def handle_course_enrollment(event: dict):
    """Handle course enrollment events."""
    user_id = event.get("user_id")
    course_id = event["data"]["course_id"]
    logger.info(f"Processing enrollment: {user_id} -> {course_id}")

    # Call another service
    service_client = get_service_client("my-service")
    user_data = await service_client.get("api-core", f"/api/v1/users/{user_id}")

    # Publish event
    event_bus = get_event_bus("my-service")
    await event_bus.publish_event(
        topic=Topics.KNOWLEDGE_STATE_UPDATED,
        event_type="knowledge.initialized",
        data={"user_id": user_id, "course_id": course_id},
        user_id=user_id
    )

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan with event bus integration."""

    # Startup
    event_bus = get_event_bus("my-service")
    await event_bus.start()

    # Subscribe to events
    await event_bus.subscribe(Topics.COURSE_ENROLLED, handle_course_enrollment)

    # Start background consumers
    app.state.event_tasks = [
        asyncio.create_task(event_bus.consume_events(Topics.COURSE_ENROLLED))
    ]

    # Initialize service client
    app.state.service_client = get_service_client("my-service")
    logger.info("✅ All services initialized")

    yield

    # Shutdown
    for task in app.state.event_tasks:
        task.cancel()
    await event_bus.stop()

app = FastAPI(lifespan=lifespan)

@app.get("/api/v1/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Protected endpoint requiring authentication."""
    return {
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "tier": current_user["tier"]
    }
```

## Environment Variables

The shared module uses the following environment variables:

### Authentication
- `JWT_SECRET` - Secret key for JWT token validation (default: "eureka_dev_secret_key_change_in_production")
- `JWT_ALGORITHM` - JWT algorithm (default: "HS256")

### Kafka
- `KAFKA_BOOTSTRAP_SERVERS` - Kafka broker address (default: "kafka:9092")

### Service URLs
All service URLs can be configured via environment variables:
- `API_CORE_URL` (default: "http://api-core:8000")
- `TUTOR_LLM_URL` (default: "http://tutor-llm:8000")
- `ASSESSMENT_URL` (default: "http://assessment:8000")
- `PEDAGOGY_URL` (default: "http://pedagogy:8040")
- `MARKETPLACE_URL` (default: "http://marketplace:8050")
- `AI_RESEARCH_URL` (default: "http://ai-research:8060")
- `XR_LABS_URL` (default: "http://xr-labs:8070")
- `ETHICS_SECURITY_URL` (default: "http://ethics-security:8080")
- `DATA_FABRIC_URL` (default: "http://data-fabric:8090")
- `INSTITUTIONS_URL` (default: "http://institutions:8100")
- `FUTURES_URL` (default: "http://futures:8110")

## Dependencies

The shared module requires the following Python packages:

```
fastapi>=0.104.0
httpx>=0.25.0
python-jose[cryptography]>=3.3.0
aiokafka>=0.8.1
```

Add these to your service's `requirements.txt`.

## Architecture

```
┌─────────────────┐
│  Frontend (Web) │
└────────┬────────┘
         │ JWT Token
         ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway (api-core)                │
│              - User Authentication                       │
│              - JWT Token Generation                      │
└─────────────────────────────────────────────────────────┘
         │
         │ Service Tokens
         ▼
┌─────────────────────────────────────────────────────────┐
│              Phase 2 Microservices                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Pedagogy │  │Marketplace│ │AI Research│   ...        │
│  └────┬─────┘  └─────┬────┘  └─────┬────┘              │
│       │              │              │                    │
│       │  Service-to-Service (HTTP)  │                    │
│       └──────────────┼──────────────┘                    │
│                      │                                    │
└──────────────────────┼────────────────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  Kafka Topics  │
              │  Event Streams │
              └────────────────┘
```

## Security Considerations

1. **JWT Tokens**: All inter-service communication uses JWT tokens for authentication
2. **Service Tokens**: Service-to-service calls use special service tokens with 60-minute expiration
3. **Token Caching**: Service tokens are cached to reduce token generation overhead
4. **HTTPS**: In production, all service communication should use HTTPS
5. **Secret Management**: JWT_SECRET should be stored securely (e.g., AWS Secrets Manager)

## Best Practices

1. **Always await event_bus.start()** in your lifespan manager
2. **Cancel background tasks** on shutdown to prevent memory leaks
3. **Use try/except blocks** around event handlers to prevent crashes
4. **Log all service calls** for debugging and monitoring
5. **Implement health checks** that verify event bus and service client connectivity
6. **Use environment variables** for service URLs in different environments

## Troubleshooting

### Event bus connection fails
- Verify Kafka is running: `docker ps | grep kafka`
- Check Kafka logs: `docker logs eureka-kafka`
- Verify KAFKA_BOOTSTRAP_SERVERS environment variable

### Service-to-service calls fail
- Check target service is running and healthy
- Verify JWT_SECRET matches across all services
- Check service URLs are correct for your environment
- Review logs for authentication errors

### Authentication fails
- Verify JWT token is valid and not expired
- Check JWT_SECRET environment variable
- Ensure Authorization header format: "Bearer <token>"
- Verify token was generated by api-core service

## Monitoring

Monitor these metrics for each service:

1. **Event Bus**:
   - Events published per second
   - Events consumed per second
   - Consumer lag
   - Failed event handlers

2. **Service Client**:
   - Request rate
   - Response times
   - Error rate
   - Token refresh rate

3. **Authentication**:
   - Authentication success/failure rate
   - Invalid token rate
   - Expired token rate

## Future Enhancements

- [ ] Circuit breaker pattern for service calls
- [ ] Request retry logic with exponential backoff
- [ ] Distributed tracing (OpenTelemetry)
- [ ] Service mesh integration (Istio/Linkerd)
- [ ] Rate limiting
- [ ] Request/response caching

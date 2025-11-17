"""
Prometheus metrics for monitoring

Exposes application metrics for Prometheus scraping.
"""

from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response
import time
from functools import wraps

# Request metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint'],
    buckets=(0.01, 0.05, 0.1, 0.5, 1.0, 2.5, 5.0, 10.0)
)

# Authentication metrics
auth_attempts_total = Counter(
    'auth_attempts_total',
    'Total authentication attempts',
    ['type', 'status']  # type: login/register, status: success/failure
)

auth_failures_total = Counter(
    'auth_failures_total',
    'Total authentication failures',
    ['type', 'reason']
)

# Database metrics
db_connections_active = Gauge(
    'db_connections_active',
    'Active database connections'
)

db_connections_max = Gauge(
    'db_connections_max',
    'Maximum database connections'
)

db_query_duration_seconds = Histogram(
    'db_query_duration_seconds',
    'Database query duration',
    ['query_type'],
    buckets=(0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0)
)

# AI Tutor metrics
ai_tutor_requests_total = Counter(
    'ai_tutor_requests_total',
    'Total AI tutor requests',
    ['model', 'status']
)

ai_tutor_tokens_used = Counter(
    'ai_tutor_tokens_used',
    'Total tokens used by AI tutor',
    ['model', 'type']  # type: input/output
)

ai_tutor_response_time_seconds = Histogram(
    'ai_tutor_response_time_seconds',
    'AI tutor response time',
    ['model'],
    buckets=(0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 30.0)
)

# Assessment metrics
assessments_created_total = Counter(
    'assessments_created_total',
    'Total assessments created',
    ['type']
)

assessments_completed_total = Counter(
    'assessments_completed_total',
    'Total assessments completed',
    ['type', 'status']
)

assessment_score_distribution = Histogram(
    'assessment_score_distribution',
    'Distribution of assessment scores',
    ['type'],
    buckets=(0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
)

# Rate limiting metrics
rate_limit_exceeded_total = Counter(
    'rate_limit_exceeded_total',
    'Total rate limit exceeded events',
    ['endpoint', 'identifier_type']
)

# Error metrics
errors_total = Counter(
    'errors_total',
    'Total errors',
    ['type', 'severity']
)

# Business metrics
active_users_gauge = Gauge(
    'active_users',
    'Number of active users',
    ['timeframe']  # 1h, 24h, 7d
)

enrollments_total = Counter(
    'enrollments_total',
    'Total course enrollments',
    ['tier']
)


# Decorator for timing functions
def track_time(metric: Histogram, labels: dict = None):
    """
    Decorator to track function execution time.

    Usage:
        @track_time(http_request_duration_seconds, {'endpoint': '/api/users'})
        async def get_users():
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                if labels:
                    metric.labels(**labels).observe(duration)
                else:
                    metric.observe(duration)
        return wrapper
    return decorator


# Metrics endpoint
def metrics_endpoint():
    """
    FastAPI endpoint to expose Prometheus metrics.

    Usage:
        @app.get("/metrics")
        async def metrics():
            return metrics_endpoint()
    """
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

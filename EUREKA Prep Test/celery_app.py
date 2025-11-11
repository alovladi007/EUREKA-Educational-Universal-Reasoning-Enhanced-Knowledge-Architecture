"""
Celery configuration for background tasks
"""
from celery import Celery
from app.core.config import settings

# Create Celery instance
celery_app = Celery(
    "eureka_tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=['app.tasks']
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    result_expires=3600,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Configure task routing
celery_app.conf.task_routes = {
    'app.tasks.analytics.*': {'queue': 'analytics'},
    'app.tasks.email.*': {'queue': 'email'},
    'app.tasks.ml.*': {'queue': 'ml'},
}

# Configure periodic tasks
celery_app.conf.beat_schedule = {
    'calibrate-questions': {
        'task': 'app.tasks.ml.calibrate_all_questions',
        'schedule': 3600.0,  # Every hour
    },
    'generate-daily-reports': {
        'task': 'app.tasks.analytics.generate_daily_reports',
        'schedule': 86400.0,  # Every day
    },
    'cleanup-old-sessions': {
        'task': 'app.tasks.maintenance.cleanup_old_sessions',
        'schedule': 3600.0,  # Every hour
    },
}

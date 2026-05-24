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

# Configure task routing.
# NOTE: tasks live in a single flat module app/tasks.py (not under
# app.tasks.{analytics,email,ml,maintenance} sub-packages). The old wildcard
# routes targeted non-existent paths, so EVERY enqueued job silently fell
# through to the default queue. Match the actual task names directly.
celery_app.conf.task_routes = {
    'app.tasks.calibrate_question':       {'queue': 'ml'},
    'app.tasks.calibrate_all_questions':  {'queue': 'ml'},
    'app.tasks.generate_user_report':     {'queue': 'analytics'},
    'app.tasks.generate_daily_reports':   {'queue': 'analytics'},
    'app.tasks.send_daily_reminder':      {'queue': 'email'},
    'app.tasks.update_user_streak':       {'queue': 'analytics'},
    'app.tasks.cleanup_old_sessions':     {'queue': 'celery'},
}

# Configure periodic tasks.
# Same fix — the previous paths pointed at non-existent submodules
# (app.tasks.ml.*, app.tasks.analytics.*, app.tasks.maintenance.*) so the
# beat scheduler would enqueue NotRegistered tasks every hour. Real task
# names live directly under app.tasks.
celery_app.conf.beat_schedule = {
    'calibrate-questions': {
        'task': 'app.tasks.calibrate_all_questions',
        'schedule': 3600.0,  # Every hour
    },
    'generate-daily-reports': {
        'task': 'app.tasks.generate_daily_reports',
        'schedule': 86400.0,  # Every day
    },
    'cleanup-old-sessions': {
        'task': 'app.tasks.cleanup_old_sessions',
        'schedule': 3600.0,  # Every hour
    },
}

"""
Background tasks for EUREKA Test Prep Platform
"""
from celery import Task
from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.models import Question, QuestionAttempt, User, StudySession
from app.ml.adaptive_engine import adaptive_engine
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class DatabaseTask(Task):
    """Base task with database session management"""
    _db = None

    @property
    def db(self):
        if self._db is None:
            self._db = SessionLocal()
        return self._db


@celery_app.task(base=DatabaseTask, bind=True)
def calibrate_question(self, question_id: str):
    """
    Calibrate IRT parameters for a specific question
    """
    try:
        db = self.db
        question = db.query(Question).filter(Question.id == question_id).first()
        
        if not question:
            logger.error(f"Question {question_id} not found")
            return
        
        # Get all attempts for this question
        attempts = db.query(QuestionAttempt).filter(
            QuestionAttempt.question_id == question_id
        ).all()
        
        if len(attempts) < 10:
            logger.info(f"Not enough attempts for question {question_id}")
            return
        
        # Prepare data for calibration
        calibration_data = []
        for attempt in attempts:
            if attempt.ability_estimate_before is not None:
                calibration_data.append({
                    'user_ability': attempt.ability_estimate_before,
                    'is_correct': attempt.is_correct
                })
        
        # Calibrate parameters
        new_params = adaptive_engine.calibrate_question_parameters(calibration_data)
        
        if new_params:
            question.difficulty = new_params['difficulty']
            question.discrimination = new_params['discrimination']
            question.confidence_interval = new_params['confidence']
            question.last_calibrated = datetime.utcnow()
            db.commit()
            logger.info(f"Successfully calibrated question {question_id}")
        
    except Exception as e:
        logger.error(f"Error calibrating question {question_id}: {str(e)}")
        self.db.rollback()


@celery_app.task(base=DatabaseTask, bind=True)
def calibrate_all_questions(self):
    """
    Calibrate IRT parameters for all questions with sufficient data
    """
    try:
        db = self.db
        # Get questions that need calibration
        questions = db.query(Question).filter(
            Question.exposure_count >= 10
        ).all()
        
        for question in questions:
            calibrate_question.delay(question.id)
        
        logger.info(f"Scheduled calibration for {len(questions)} questions")
        
    except Exception as e:
        logger.error(f"Error in batch calibration: {str(e)}")


@celery_app.task(base=DatabaseTask, bind=True)
def generate_user_report(self, user_id: str):
    """
    Generate comprehensive performance report for a user
    """
    try:
        db = self.db
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            logger.error(f"User {user_id} not found")
            return
        
        # Get user's attempts
        attempts = db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id == user_id
        ).order_by(QuestionAttempt.timestamp.desc()).limit(100).all()
        
        # Prepare data for report generation
        attempts_data = []
        for attempt in attempts:
            question = db.query(Question).filter(Question.id == attempt.question_id).first()
            if question:
                attempts_data.append({
                    'difficulty': question.difficulty,
                    'discrimination': question.discrimination,
                    'guessing': question.guessing,
                    'correct': attempt.is_correct,
                    'topic': question.topic,
                    'subject': question.subject
                })
        
        # Generate report using adaptive engine
        report = adaptive_engine.generate_ability_report(attempts_data)
        
        # Store report in cache or send via email
        logger.info(f"Generated report for user {user_id}: {report}")
        
        return report
        
    except Exception as e:
        logger.error(f"Error generating report for user {user_id}: {str(e)}")


@celery_app.task(base=DatabaseTask, bind=True)
def cleanup_old_sessions(self):
    """
    Clean up incomplete study sessions older than 24 hours
    """
    try:
        db = self.db
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        
        # Find and delete old incomplete sessions
        old_sessions = db.query(StudySession).filter(
            StudySession.completed == False,
            StudySession.start_time < cutoff_time
        ).all()
        
        for session in old_sessions:
            db.delete(session)
        
        db.commit()
        logger.info(f"Cleaned up {len(old_sessions)} old sessions")
        
    except Exception as e:
        logger.error(f"Error cleaning up sessions: {str(e)}")
        self.db.rollback()


@celery_app.task(base=DatabaseTask, bind=True)
def update_user_streak(self, user_id: str):
    """
    Update user's study streak
    """
    try:
        db = self.db
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return
        
        # Check if user has studied today
        today = datetime.utcnow().date()
        today_attempts = db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id == user_id,
            QuestionAttempt.timestamp >= datetime(today.year, today.month, today.day)
        ).count()
        
        if today_attempts > 0:
            # Check yesterday
            yesterday = today - timedelta(days=1)
            yesterday_attempts = db.query(QuestionAttempt).filter(
                QuestionAttempt.user_id == user_id,
                QuestionAttempt.timestamp >= datetime(yesterday.year, yesterday.month, yesterday.day),
                QuestionAttempt.timestamp < datetime(today.year, today.month, today.day)
            ).count()
            
            if yesterday_attempts > 0:
                # Continue streak
                user.current_streak_days += 1
            else:
                # Start new streak
                user.current_streak_days = 1
            
            # Update longest streak
            if user.current_streak_days > user.longest_streak_days:
                user.longest_streak_days = user.current_streak_days
            
            db.commit()
            logger.info(f"Updated streak for user {user_id}: {user.current_streak_days} days")
        
    except Exception as e:
        logger.error(f"Error updating streak for user {user_id}: {str(e)}")
        self.db.rollback()


@celery_app.task(base=DatabaseTask, bind=True)
def send_daily_reminder(self, user_id: str):
    """
    Send daily study reminder to user
    """
    try:
        db = self.db
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return
        
        # Check if user has studied today
        today = datetime.utcnow().date()
        today_attempts = db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id == user_id,
            QuestionAttempt.timestamp >= datetime(today.year, today.month, today.day)
        ).count()
        
        if today_attempts == 0:
            # Send reminder (implement email/notification logic)
            logger.info(f"Sending daily reminder to user {user.email}")
            # TODO: Implement actual email sending
        
    except Exception as e:
        logger.error(f"Error sending reminder to user {user_id}: {str(e)}")


@celery_app.task(base=DatabaseTask, bind=True)
def generate_daily_reports(self):
    """
    Generate daily reports for all active users
    """
    try:
        db = self.db
        # Get active users (logged in within last 7 days)
        cutoff_date = datetime.utcnow() - timedelta(days=7)
        active_users = db.query(User).filter(
            User.last_login >= cutoff_date,
            User.is_active == True
        ).all()
        
        for user in active_users:
            generate_user_report.delay(user.id)
        
        logger.info(f"Scheduled daily reports for {len(active_users)} users")
        
    except Exception as e:
        logger.error(f"Error generating daily reports: {str(e)}")

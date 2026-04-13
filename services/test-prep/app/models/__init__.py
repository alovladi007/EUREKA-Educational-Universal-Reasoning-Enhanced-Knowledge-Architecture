"""
Models package - Import all models for easy access
"""
from app.models.user import User
from app.models.question import Question
from app.models.question_attempt import QuestionAttempt, StudySession
from app.models.exam_result import ExamResult, StudyPlan, UserAchievement
from app.models.video_lesson import VideoLesson, UserLessonProgress
from app.models.lesson_note import LessonNote
from app.models.qbank_session import QBankSession
from app.models.flashcard import Flashcard, FlashcardProgress
from app.models.mpep_bookmark import MpepBookmark
from app.models.patent_live import PatentOfficeHoursSlot, PatentCohort
from app.models.patent_community import (
    PatentCourseRoster,
    PatentStudyGroup,
    PatentStudyGroupMember,
    PatentCommunityMessage,
)

__all__ = [
    "User",
    "Question",
    "QuestionAttempt",
    "StudySession",
    "ExamResult",
    "StudyPlan",
    "UserAchievement",
    "VideoLesson",
    "UserLessonProgress",
    "LessonNote",
    "QBankSession",
    "Flashcard",
    "FlashcardProgress",
    "MpepBookmark",
    "PatentOfficeHoursSlot",
    "PatentCohort",
    "PatentCourseRoster",
    "PatentStudyGroup",
    "PatentStudyGroupMember",
    "PatentCommunityMessage",
]

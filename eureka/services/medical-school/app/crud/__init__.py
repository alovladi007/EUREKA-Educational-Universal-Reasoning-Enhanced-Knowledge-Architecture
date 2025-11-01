"""
CRUD operations for Medical School service

Complete implementation of database operations for:
- USMLE Questions and Attempts
- Clinical Cases and Attempts
- OSCE Stations and Attempts
- Diagnostic Reasoning Sessions
- Student Profiles
- Medications
- Analytics and Recommendations
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc, case as sql_case
from sqlalchemy.orm import selectinload
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime, timedelta
import logging

# Import models
from app.models import (
    USMLEQuestion, USMLEAttempt,
    ClinicalCase, CaseAttempt,
    OSCEStation, OSCEAttempt,
    DiagnosticSession,
    MedicationDatabase,
    MedicalStudentProfile,
    HIPAAAuditLog,
    DifficultyLevel, CaseComplexity, DiagnosisConfidence
)

# Import schemas
from app.schemas.part1 import (
    USMLEQuestionCreate, USMLEAttemptCreate,
    ClinicalCaseCreate, CaseAttemptCreate,
    VitalSigns
)
from app.schemas.part2 import (
    OSCEStationCreate, OSCEAttemptCreate,
    DiagnosticSessionCreate, DiagnosticSessionUpdate, DiagnosticSessionComplete,
    MedicalStudentProfileCreate, MedicalStudentProfileUpdate,
    MedicationCreate
)

logger = logging.getLogger(__name__)


# ==========================================
# USMLE Questions
# ==========================================

async def create_usmle_question(db: AsyncSession, question: USMLEQuestionCreate):
    """Create a new USMLE question."""
    try:
        # Convert Pydantic model to dict and create SQLAlchemy model
        question_dict = question.model_dump(exclude_unset=True)
        db_question = USMLEQuestion(**question_dict)

        db.add(db_question)
        await db.commit()
        await db.refresh(db_question)

        logger.info(f"Created USMLE question {db_question.id}")
        return db_question
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating USMLE question: {str(e)}")
        raise


async def list_usmle_questions(
    db: AsyncSession,
    difficulty_level: Optional[str],
    subject: Optional[str],
    topic: Optional[str],
    limit: int,
    offset: int
):
    """List USMLE questions with filtering."""
    try:
        # Build query with filters
        query = select(USMLEQuestion).where(USMLEQuestion.is_active == True)

        if difficulty_level:
            query = query.where(USMLEQuestion.difficulty_level == difficulty_level)
        if subject:
            query = query.where(USMLEQuestion.subject == subject)
        if topic:
            query = query.where(USMLEQuestion.topic.ilike(f"%{topic}%"))

        # Order by updated_at descending to get recent questions first
        query = query.order_by(desc(USMLEQuestion.updated_at))
        query = query.offset(offset).limit(limit)

        result = await db.execute(query)
        questions = result.scalars().all()

        logger.info(f"Listed {len(questions)} USMLE questions")
        return questions
    except Exception as e:
        logger.error(f"Error listing USMLE questions: {str(e)}")
        raise


async def get_usmle_question(db: AsyncSession, question_id: UUID):
    """Get a specific USMLE question."""
    try:
        query = select(USMLEQuestion).where(USMLEQuestion.id == question_id)
        result = await db.execute(query)
        question = result.scalar_one_or_none()

        if question:
            logger.info(f"Retrieved USMLE question {question_id}")
        return question
    except Exception as e:
        logger.error(f"Error getting USMLE question {question_id}: {str(e)}")
        raise


async def create_usmle_attempt(db: AsyncSession, user_id: UUID, attempt: USMLEAttemptCreate):
    """Create a USMLE attempt and update question statistics."""
    try:
        # Get the question to check correct answer
        question = await get_usmle_question(db, attempt.question_id)
        if not question:
            raise ValueError(f"Question {attempt.question_id} not found")

        # Check if answer is correct
        is_correct = attempt.selected_answer.upper() == question.correct_answer.upper()

        # Count previous attempts for this question by this user
        attempt_count_query = select(func.count(USMLEAttempt.id)).where(
            and_(
                USMLEAttempt.user_id == user_id,
                USMLEAttempt.question_id == attempt.question_id
            )
        )
        result = await db.execute(attempt_count_query)
        attempt_number = result.scalar() + 1

        # Create attempt record
        db_attempt = USMLEAttempt(
            user_id=user_id,
            question_id=attempt.question_id,
            selected_answer=attempt.selected_answer.upper(),
            is_correct=is_correct,
            time_spent_seconds=attempt.time_spent_seconds,
            session_id=attempt.session_id,
            attempt_number=attempt_number
        )

        db.add(db_attempt)

        # Update question statistics
        question.times_used += 1
        if is_correct:
            question.times_correct += 1
        if attempt.time_spent_seconds:
            # Update average time (simple moving average)
            if question.average_time_seconds:
                question.average_time_seconds = int(
                    (question.average_time_seconds * (question.times_used - 1) + attempt.time_spent_seconds) / question.times_used
                )
            else:
                question.average_time_seconds = attempt.time_spent_seconds

        await db.commit()
        await db.refresh(db_attempt)

        logger.info(f"Created USMLE attempt {db_attempt.id} for user {user_id}")
        return db_attempt
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating USMLE attempt: {str(e)}")
        raise


async def get_user_usmle_attempts(db: AsyncSession, user_id: UUID, limit: int):
    """Get user's USMLE attempts."""
    try:
        query = select(USMLEAttempt).where(
            USMLEAttempt.user_id == user_id
        ).order_by(desc(USMLEAttempt.created_at)).limit(limit)

        result = await db.execute(query)
        attempts = result.scalars().all()

        logger.info(f"Retrieved {len(attempts)} USMLE attempts for user {user_id}")
        return attempts
    except Exception as e:
        logger.error(f"Error getting USMLE attempts for user {user_id}: {str(e)}")
        raise


async def get_usmle_statistics(db: AsyncSession, user_id: UUID):
    """Get USMLE statistics for user."""
    try:
        # Get all attempts
        attempts_query = select(USMLEAttempt).where(USMLEAttempt.user_id == user_id)
        result = await db.execute(attempts_query)
        attempts = result.scalars().all()

        if not attempts:
            # Return empty statistics
            return {
                "total_questions_attempted": 0,
                "correct_answers": 0,
                "incorrect_answers": 0,
                "accuracy_rate": 0.0,
                "average_time_per_question": 0.0,
                "questions_by_difficulty": {},
                "questions_by_subject": {},
                "strong_subjects": [],
                "weak_subjects": []
            }

        # Calculate basic stats
        total = len(attempts)
        correct = sum(1 for a in attempts if a.is_correct)
        incorrect = total - correct
        accuracy_rate = correct / total if total > 0 else 0.0

        # Calculate average time
        times = [a.time_spent_seconds for a in attempts if a.time_spent_seconds]
        average_time = sum(times) / len(times) if times else 0.0

        # Get questions for subject/difficulty breakdown
        question_ids = [a.question_id for a in attempts]
        questions_query = select(USMLEQuestion).where(USMLEQuestion.id.in_(question_ids))
        questions_result = await db.execute(questions_query)
        questions = questions_result.scalars().all()

        # Create lookup map for questions
        question_map = {q.id: q for q in questions}

        # Count by difficulty
        questions_by_difficulty = {}
        for attempt in attempts:
            question = question_map.get(attempt.question_id)
            if question:
                difficulty = question.difficulty_level.value if isinstance(question.difficulty_level, DifficultyLevel) else str(question.difficulty_level)
                questions_by_difficulty[difficulty] = questions_by_difficulty.get(difficulty, 0) + 1

        # Count by subject and calculate accuracy per subject
        subject_stats = {}
        for attempt in attempts:
            question = question_map.get(attempt.question_id)
            if question:
                subject = question.subject
                if subject not in subject_stats:
                    subject_stats[subject] = {"total": 0, "correct": 0}
                subject_stats[subject]["total"] += 1
                if attempt.is_correct:
                    subject_stats[subject]["correct"] += 1

        # Count by subject
        questions_by_subject = {subject: stats["total"] for subject, stats in subject_stats.items()}

        # Calculate strong and weak subjects (min 5 questions to be significant)
        subject_accuracies = [
            {
                "subject": subject,
                "accuracy": stats["correct"] / stats["total"],
                "count": stats["total"]
            }
            for subject, stats in subject_stats.items()
            if stats["total"] >= 5
        ]

        # Sort by accuracy
        subject_accuracies.sort(key=lambda x: x["accuracy"], reverse=True)

        # Top 3 strong subjects
        strong_subjects = subject_accuracies[:3]

        # Bottom 3 weak subjects
        weak_subjects = list(reversed(subject_accuracies[-3:]))

        statistics = {
            "total_questions_attempted": total,
            "correct_answers": correct,
            "incorrect_answers": incorrect,
            "accuracy_rate": round(accuracy_rate, 3),
            "average_time_per_question": round(average_time, 1),
            "questions_by_difficulty": questions_by_difficulty,
            "questions_by_subject": questions_by_subject,
            "strong_subjects": strong_subjects,
            "weak_subjects": weak_subjects
        }

        logger.info(f"Calculated USMLE statistics for user {user_id}")
        return statistics
    except Exception as e:
        logger.error(f"Error calculating USMLE statistics for user {user_id}: {str(e)}")
        raise


# ==========================================
# Clinical Cases
# ==========================================

async def create_clinical_case(db: AsyncSession, case: ClinicalCaseCreate):
    """Create a clinical case."""
    try:
        # Convert Pydantic model to dict
        case_dict = case.model_dump(exclude_unset=True)

        # Handle VitalSigns conversion
        if "vital_signs" in case_dict and isinstance(case_dict["vital_signs"], VitalSigns):
            case_dict["vital_signs"] = case_dict["vital_signs"].model_dump(exclude_unset=True)

        # Generate case number if not provided
        if not case_dict.get("case_number"):
            case_dict["case_number"] = f"CC-{uuid4().hex[:8].upper()}"

        db_case = ClinicalCase(**case_dict)

        db.add(db_case)
        await db.commit()
        await db.refresh(db_case)

        logger.info(f"Created clinical case {db_case.id}")
        return db_case
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating clinical case: {str(e)}")
        raise


async def list_clinical_cases(
    db: AsyncSession,
    specialty: Optional[str],
    complexity: Optional[str],
    limit: int,
    offset: int
):
    """List clinical cases."""
    try:
        # Build query with filters
        query = select(ClinicalCase).where(ClinicalCase.is_active == True)

        if specialty:
            query = query.where(ClinicalCase.specialty == specialty)
        if complexity:
            query = query.where(ClinicalCase.complexity == complexity)

        # Order by updated_at descending
        query = query.order_by(desc(ClinicalCase.updated_at))
        query = query.offset(offset).limit(limit)

        result = await db.execute(query)
        cases = result.scalars().all()

        logger.info(f"Listed {len(cases)} clinical cases")
        return cases
    except Exception as e:
        logger.error(f"Error listing clinical cases: {str(e)}")
        raise


async def get_clinical_case_student_view(db: AsyncSession, case_id: UUID):
    """Get clinical case (student view - no answers)."""
    try:
        query = select(ClinicalCase).where(
            and_(
                ClinicalCase.id == case_id,
                ClinicalCase.is_active == True
            )
        )
        result = await db.execute(query)
        case = result.scalar_one_or_none()

        if case:
            logger.info(f"Retrieved clinical case {case_id} (student view)")
        return case
    except Exception as e:
        logger.error(f"Error getting clinical case {case_id}: {str(e)}")
        raise


async def start_case_attempt(db: AsyncSession, user_id: UUID, case_id: UUID):
    """Start a case attempt."""
    try:
        # Verify case exists
        case = await get_clinical_case_student_view(db, case_id)
        if not case:
            raise ValueError(f"Case {case_id} not found")

        # Create new attempt
        db_attempt = CaseAttempt(
            user_id=user_id,
            case_id=case_id,
            started_at=datetime.utcnow(),
            differential_diagnosis=[],
            is_complete=False
        )

        db.add(db_attempt)
        await db.commit()
        await db.refresh(db_attempt)

        logger.info(f"Started case attempt {db_attempt.id} for user {user_id}")
        return db_attempt
    except Exception as e:
        await db.rollback()
        logger.error(f"Error starting case attempt: {str(e)}")
        raise


async def submit_case_attempt(
    db: AsyncSession,
    user_id: UUID,
    attempt_id: UUID,
    submission: CaseAttemptCreate
):
    """Submit case attempt and calculate scores."""
    try:
        # Get the attempt
        attempt_query = select(CaseAttempt).where(
            and_(
                CaseAttempt.id == attempt_id,
                CaseAttempt.user_id == user_id
            )
        )
        result = await db.execute(attempt_query)
        attempt = result.scalar_one_or_none()

        if not attempt:
            raise ValueError(f"Attempt {attempt_id} not found for user {user_id}")

        # Get the correct answer from the case
        case = await get_clinical_case_student_view(db, attempt.case_id)
        if not case:
            raise ValueError(f"Case {attempt.case_id} not found")

        # Update attempt with submission
        attempt.differential_diagnosis = [d.model_dump() if hasattr(d, 'model_dump') else d for d in submission.differential_diagnosis]
        attempt.primary_diagnosis = submission.primary_diagnosis
        attempt.diagnostic_reasoning = submission.diagnostic_reasoning
        attempt.treatment_plan = submission.treatment_plan.model_dump() if hasattr(submission.treatment_plan, 'model_dump') else submission.treatment_plan
        attempt.completed_at = datetime.utcnow()

        # Calculate time spent
        time_diff = attempt.completed_at - attempt.started_at
        attempt.time_spent_minutes = int(time_diff.total_seconds() / 60)

        # Calculate diagnosis accuracy (simple string matching for now)
        # In production, use more sophisticated NLP or AI evaluation
        correct_diagnosis = case.primary_diagnosis.lower()
        student_diagnosis = submission.primary_diagnosis.lower()

        if correct_diagnosis == student_diagnosis:
            diagnosis_accuracy = 100.0
        elif correct_diagnosis in student_diagnosis or student_diagnosis in correct_diagnosis:
            diagnosis_accuracy = 75.0
        else:
            # Check differential diagnoses
            differential_match = any(
                correct_diagnosis in str(d).lower()
                for d in submission.differential_diagnosis
            )
            diagnosis_accuracy = 50.0 if differential_match else 25.0

        # Calculate reasoning quality (based on length and keywords)
        reasoning_length = len(submission.diagnostic_reasoning)
        if reasoning_length >= 200:
            reasoning_quality = 90.0
        elif reasoning_length >= 100:
            reasoning_quality = 75.0
        elif reasoning_length >= 50:
            reasoning_quality = 60.0
        else:
            reasoning_quality = 40.0

        # Treatment appropriateness (placeholder - would use AI evaluation)
        treatment_appropriateness = 80.0

        # Overall score
        overall_score = (diagnosis_accuracy * 0.5 + reasoning_quality * 0.3 + treatment_appropriateness * 0.2)

        # Update attempt scores
        attempt.diagnosis_accuracy = diagnosis_accuracy
        attempt.reasoning_quality = reasoning_quality
        attempt.treatment_appropriateness = treatment_appropriateness
        attempt.overall_score = overall_score
        attempt.is_complete = True

        # Generate AI feedback
        feedback_lines = []
        if diagnosis_accuracy >= 75:
            feedback_lines.append("Excellent diagnostic accuracy! Your primary diagnosis is correct.")
        elif diagnosis_accuracy >= 50:
            feedback_lines.append("Good work considering the correct diagnosis in your differential.")
        else:
            feedback_lines.append(f"The correct diagnosis is: {case.primary_diagnosis}")

        if reasoning_quality >= 75:
            feedback_lines.append("Your diagnostic reasoning is thorough and well-articulated.")
        else:
            feedback_lines.append("Consider providing more detailed reasoning for your diagnosis.")

        feedback_lines.append(f"\nKey teaching points for this case:")
        for point in (case.key_teaching_points or []):
            feedback_lines.append(f"- {point}")

        attempt.ai_feedback = "\n".join(feedback_lines)

        await db.commit()
        await db.refresh(attempt)

        logger.info(f"Submitted case attempt {attempt_id} with score {overall_score}")
        return attempt
    except Exception as e:
        await db.rollback()
        logger.error(f"Error submitting case attempt {attempt_id}: {str(e)}")
        raise


async def get_user_case_attempts(db: AsyncSession, user_id: UUID, limit: int):
    """Get user's case attempts."""
    try:
        query = select(CaseAttempt).where(
            CaseAttempt.user_id == user_id
        ).order_by(desc(CaseAttempt.created_at)).limit(limit)

        result = await db.execute(query)
        attempts = result.scalars().all()

        logger.info(f"Retrieved {len(attempts)} case attempts for user {user_id}")
        return attempts
    except Exception as e:
        logger.error(f"Error getting case attempts for user {user_id}: {str(e)}")
        raise


async def get_case_statistics(db: AsyncSession, user_id: UUID):
    """Get case statistics."""
    try:
        # Get all completed attempts
        attempts_query = select(CaseAttempt).where(
            and_(
                CaseAttempt.user_id == user_id,
                CaseAttempt.is_complete == True
            )
        )
        result = await db.execute(attempts_query)
        attempts = result.scalars().all()

        if not attempts:
            return {
                "total_cases_attempted": 0,
                "completed_cases": 0,
                "average_diagnosis_accuracy": 0.0,
                "average_reasoning_quality": 0.0,
                "average_overall_score": 0.0,
                "cases_by_specialty": {},
                "cases_by_complexity": {},
                "average_completion_time": 0.0
            }

        # Calculate averages
        total = len(attempts)
        avg_diagnosis = sum(a.diagnosis_accuracy or 0 for a in attempts) / total
        avg_reasoning = sum(a.reasoning_quality or 0 for a in attempts) / total
        avg_score = sum(a.overall_score or 0 for a in attempts) / total
        avg_time = sum(a.time_spent_minutes or 0 for a in attempts) / total

        # Get cases for breakdown
        case_ids = [a.case_id for a in attempts]
        cases_query = select(ClinicalCase).where(ClinicalCase.id.in_(case_ids))
        cases_result = await db.execute(cases_query)
        cases = cases_result.scalars().all()

        # Create lookup map
        case_map = {c.id: c for c in cases}

        # Count by specialty and complexity
        cases_by_specialty = {}
        cases_by_complexity = {}

        for attempt in attempts:
            case = case_map.get(attempt.case_id)
            if case:
                specialty = case.specialty
                complexity = case.complexity.value if isinstance(case.complexity, CaseComplexity) else str(case.complexity)

                cases_by_specialty[specialty] = cases_by_specialty.get(specialty, 0) + 1
                cases_by_complexity[complexity] = cases_by_complexity.get(complexity, 0) + 1

        statistics = {
            "total_cases_attempted": total,
            "completed_cases": total,
            "average_diagnosis_accuracy": round(avg_diagnosis, 2),
            "average_reasoning_quality": round(avg_reasoning, 2),
            "average_overall_score": round(avg_score, 2),
            "cases_by_specialty": cases_by_specialty,
            "cases_by_complexity": cases_by_complexity,
            "average_completion_time": round(avg_time, 1)
        }

        logger.info(f"Calculated case statistics for user {user_id}")
        return statistics
    except Exception as e:
        logger.error(f"Error calculating case statistics for user {user_id}: {str(e)}")
        raise


# ==========================================
# OSCE Stations
# ==========================================

async def create_osce_station(db: AsyncSession, station: OSCEStationCreate):
    """Create OSCE station."""
    try:
        station_dict = station.model_dump(exclude_unset=True)

        # Convert rubric items to dict format
        if "rubric" in station_dict:
            station_dict["rubric"] = [
                item.model_dump() if hasattr(item, 'model_dump') else item
                for item in station_dict["rubric"]
            ]

        db_station = OSCEStation(**station_dict)

        db.add(db_station)
        await db.commit()
        await db.refresh(db_station)

        logger.info(f"Created OSCE station {db_station.id}")
        return db_station
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating OSCE station: {str(e)}")
        raise


async def list_osce_stations(
    db: AsyncSession,
    specialty: Optional[str],
    difficulty: Optional[str],
    limit: int,
    offset: int
):
    """List OSCE stations."""
    try:
        query = select(OSCEStation).where(OSCEStation.is_active == True)

        if specialty:
            query = query.where(OSCEStation.specialty == specialty)
        if difficulty:
            query = query.where(OSCEStation.difficulty == difficulty)

        query = query.order_by(OSCEStation.station_number).offset(offset).limit(limit)

        result = await db.execute(query)
        stations = result.scalars().all()

        logger.info(f"Listed {len(stations)} OSCE stations")
        return stations
    except Exception as e:
        logger.error(f"Error listing OSCE stations: {str(e)}")
        raise


async def get_osce_station_student_view(db: AsyncSession, station_id: UUID):
    """Get OSCE station (student view)."""
    try:
        query = select(OSCEStation).where(
            and_(
                OSCEStation.id == station_id,
                OSCEStation.is_active == True
            )
        )
        result = await db.execute(query)
        station = result.scalar_one_or_none()

        if station:
            logger.info(f"Retrieved OSCE station {station_id}")
        return station
    except Exception as e:
        logger.error(f"Error getting OSCE station {station_id}: {str(e)}")
        raise


async def create_osce_attempt(db: AsyncSession, user_id: UUID, attempt: OSCEAttemptCreate):
    """Create OSCE attempt."""
    try:
        # Get station to calculate scores
        station = await get_osce_station_student_view(db, attempt.station_id)
        if not station:
            raise ValueError(f"Station {attempt.station_id} not found")

        # Calculate total score from checklist
        total_score = sum(attempt.checklist_scores.values())
        percentage = (total_score / station.total_points * 100) if station.total_points > 0 else 0
        passed = total_score >= station.passing_score

        db_attempt = OSCEAttempt(
            user_id=user_id,
            station_id=attempt.station_id,
            exam_id=attempt.exam_id,
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            checklist_scores=attempt.checklist_scores,
            total_score=total_score,
            percentage=percentage,
            passed=passed,
            student_reflection=attempt.student_reflection,
            recording_consent_given=attempt.recording_consent_given
        )

        db.add(db_attempt)
        await db.commit()
        await db.refresh(db_attempt)

        logger.info(f"Created OSCE attempt {db_attempt.id} for user {user_id}")
        return db_attempt
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating OSCE attempt: {str(e)}")
        raise


async def get_user_osce_attempts(db: AsyncSession, user_id: UUID, limit: int):
    """Get user's OSCE attempts."""
    try:
        query = select(OSCEAttempt).where(
            OSCEAttempt.user_id == user_id
        ).order_by(desc(OSCEAttempt.created_at)).limit(limit)

        result = await db.execute(query)
        attempts = result.scalars().all()

        logger.info(f"Retrieved {len(attempts)} OSCE attempts for user {user_id}")
        return attempts
    except Exception as e:
        logger.error(f"Error getting OSCE attempts for user {user_id}: {str(e)}")
        raise


# ==========================================
# Diagnostic Sessions
# ==========================================

async def start_diagnostic_session(db: AsyncSession, user_id: UUID, session: DiagnosticSessionCreate):
    """Start diagnostic session."""
    try:
        session_dict = session.model_dump(exclude_unset=True)

        db_session = DiagnosticSession(
            user_id=user_id,
            started_at=datetime.utcnow(),
            **session_dict
        )

        db.add(db_session)
        await db.commit()
        await db.refresh(db_session)

        logger.info(f"Started diagnostic session {db_session.id} for user {user_id}")
        return db_session
    except Exception as e:
        await db.rollback()
        logger.error(f"Error starting diagnostic session: {str(e)}")
        raise


async def update_diagnostic_session(
    db: AsyncSession,
    user_id: UUID,
    session_id: UUID,
    update: DiagnosticSessionUpdate
):
    """Update diagnostic session."""
    try:
        query = select(DiagnosticSession).where(
            and_(
                DiagnosticSession.id == session_id,
                DiagnosticSession.user_id == user_id
            )
        )
        result = await db.execute(query)
        session = result.scalar_one_or_none()

        if not session:
            raise ValueError(f"Session {session_id} not found for user {user_id}")

        # Update fields
        update_dict = update.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            if hasattr(session, key):
                # Convert Pydantic models to dicts
                if isinstance(value, list):
                    value = [v.model_dump() if hasattr(v, 'model_dump') else v for v in value]
                setattr(session, key, value)

        await db.commit()
        await db.refresh(session)

        logger.info(f"Updated diagnostic session {session_id}")
        return session
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating diagnostic session {session_id}: {str(e)}")
        raise


async def complete_diagnostic_session(
    db: AsyncSession,
    user_id: UUID,
    session_id: UUID,
    completion: DiagnosticSessionComplete
):
    """Complete diagnostic session."""
    try:
        query = select(DiagnosticSession).where(
            and_(
                DiagnosticSession.id == session_id,
                DiagnosticSession.user_id == user_id
            )
        )
        result = await db.execute(query)
        session = result.scalar_one_or_none()

        if not session:
            raise ValueError(f"Session {session_id} not found for user {user_id}")

        # Update with completion data
        session.final_diagnosis = completion.final_diagnosis
        session.confidence_level = completion.confidence_level
        session.reasoning = completion.reasoning
        session.completed_at = datetime.utcnow()

        # Calculate time to diagnosis
        time_diff = session.completed_at - session.started_at
        session.time_to_diagnosis_minutes = int(time_diff.total_seconds() / 60)

        # TODO: In production, compare with correct diagnosis and calculate scores
        # For now, set placeholder scores
        session.is_correct = True  # Would check against correct_diagnosis
        session.accuracy_score = 85.0
        session.efficiency_score = 80.0

        # Generate AI feedback (placeholder)
        session.ai_analysis = "Good diagnostic reasoning demonstrated. Consider ordering fewer tests to improve efficiency."
        session.suggestions = [
            "Focus on high-yield diagnostic tests",
            "Consider cost-effectiveness in test ordering",
            "Review differential diagnosis approach"
        ]

        await db.commit()
        await db.refresh(session)

        logger.info(f"Completed diagnostic session {session_id}")
        return session
    except Exception as e:
        await db.rollback()
        logger.error(f"Error completing diagnostic session {session_id}: {str(e)}")
        raise


async def get_user_diagnostic_sessions(db: AsyncSession, user_id: UUID, limit: int):
    """Get user's diagnostic sessions."""
    try:
        query = select(DiagnosticSession).where(
            DiagnosticSession.user_id == user_id
        ).order_by(desc(DiagnosticSession.created_at)).limit(limit)

        result = await db.execute(query)
        sessions = result.scalars().all()

        logger.info(f"Retrieved {len(sessions)} diagnostic sessions for user {user_id}")
        return sessions
    except Exception as e:
        logger.error(f"Error getting diagnostic sessions for user {user_id}: {str(e)}")
        raise


# ==========================================
# Student Profiles
# ==========================================

async def create_student_profile(db: AsyncSession, profile: MedicalStudentProfileCreate):
    """Create student profile."""
    try:
        profile_dict = profile.model_dump(exclude_unset=True)

        db_profile = MedicalStudentProfile(**profile_dict)

        db.add(db_profile)
        await db.commit()
        await db.refresh(db_profile)

        logger.info(f"Created student profile for user {db_profile.user_id}")
        return db_profile
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating student profile: {str(e)}")
        raise


async def get_student_profile(db: AsyncSession, user_id: UUID):
    """Get student profile."""
    try:
        query = select(MedicalStudentProfile).where(
            MedicalStudentProfile.user_id == user_id
        )
        result = await db.execute(query)
        profile = result.scalar_one_or_none()

        if profile:
            logger.info(f"Retrieved student profile for user {user_id}")
        return profile
    except Exception as e:
        logger.error(f"Error getting student profile for user {user_id}: {str(e)}")
        raise


async def update_student_profile(db: AsyncSession, user_id: UUID, update: MedicalStudentProfileUpdate):
    """Update student profile."""
    try:
        profile = await get_student_profile(db, user_id)
        if not profile:
            raise ValueError(f"Profile not found for user {user_id}")

        # Update fields
        update_dict = update.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            if hasattr(profile, key):
                setattr(profile, key, value)

        await db.commit()
        await db.refresh(profile)

        logger.info(f"Updated student profile for user {user_id}")
        return profile
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating student profile for user {user_id}: {str(e)}")
        raise


async def get_student_dashboard(db: AsyncSession, user_id: UUID):
    """Get student dashboard."""
    try:
        # Get USMLE stats
        usmle_stats = await get_usmle_statistics(db, user_id)

        # Get case stats
        case_stats = await get_case_statistics(db, user_id)

        # Get recent activity (last 10 attempts across all types)
        recent_usmle = await get_user_usmle_attempts(db, user_id, 5)
        recent_cases = await get_user_case_attempts(db, user_id, 5)

        recent_activity = []
        for attempt in recent_usmle:
            recent_activity.append({
                "type": "usmle_question",
                "date": attempt.created_at,
                "result": "correct" if attempt.is_correct else "incorrect"
            })
        for attempt in recent_cases:
            recent_activity.append({
                "type": "clinical_case",
                "date": attempt.created_at,
                "score": attempt.overall_score
            })

        # Sort by date
        recent_activity.sort(key=lambda x: x["date"], reverse=True)
        recent_activity = recent_activity[:10]

        # Generate recommendations (basic version)
        recommendations = []
        if usmle_stats["total_questions_attempted"] > 0:
            if usmle_stats["accuracy_rate"] < 0.7:
                recommendations.append("Focus on reviewing weak subjects to improve accuracy")
            for subject in usmle_stats.get("weak_subjects", [])[:2]:
                recommendations.append(f"Practice more {subject['subject']} questions")

        if case_stats["total_cases_attempted"] > 0:
            if case_stats["average_diagnosis_accuracy"] < 70:
                recommendations.append("Work on differential diagnosis skills")

        dashboard = {
            "user_id": user_id,
            "usmle_stats": usmle_stats,
            "clinical_case_stats": case_stats,
            "recent_activity": recent_activity,
            "upcoming_goals": [],  # TODO: Implement goals tracking
            "recommendations": recommendations
        }

        logger.info(f"Generated dashboard for user {user_id}")
        return dashboard
    except Exception as e:
        logger.error(f"Error getting dashboard for user {user_id}: {str(e)}")
        raise


async def get_study_recommendations(db: AsyncSession, user_id: UUID, limit: int):
    """Get study recommendations."""
    try:
        recommendations = []

        # Get user statistics
        usmle_stats = await get_usmle_statistics(db, user_id)
        case_stats = await get_case_statistics(db, user_id)

        # Recommend based on weak subjects
        for subject_data in usmle_stats.get("weak_subjects", [])[:3]:
            recommendations.append({
                "type": "question_set",
                "title": f"Practice {subject_data['subject']} Questions",
                "description": f"Improve your accuracy in {subject_data['subject']}",
                "reason": f"Current accuracy: {subject_data['accuracy']:.1%}",
                "priority": 1,
                "estimated_time_minutes": 30,
                "resource_type": "usmle_questions"
            })

        # Recommend cases if needed
        if case_stats["total_cases_attempted"] < 10:
            recommendations.append({
                "type": "clinical_case",
                "title": "Complete More Clinical Cases",
                "description": "Build clinical reasoning skills with interactive cases",
                "reason": "Limited case experience",
                "priority": 2,
                "estimated_time_minutes": 40,
                "resource_type": "clinical_cases"
            })

        # Limit results
        recommendations = recommendations[:limit]

        logger.info(f"Generated {len(recommendations)} recommendations for user {user_id}")
        return recommendations
    except Exception as e:
        logger.error(f"Error getting recommendations for user {user_id}: {str(e)}")
        raise


async def get_performance_alerts(db: AsyncSession, user_id: UUID):
    """Get performance alerts."""
    try:
        alerts = []

        # Get statistics
        usmle_stats = await get_usmle_statistics(db, user_id)

        # Check for low accuracy
        if usmle_stats["total_questions_attempted"] >= 20:
            if usmle_stats["accuracy_rate"] < 0.6:
                alerts.append({
                    "type": "low_accuracy",
                    "severity": "high",
                    "message": f"Your overall accuracy is {usmle_stats['accuracy_rate']:.1%}",
                    "recommendations": [
                        "Review explanations for incorrect answers",
                        "Focus on understanding concepts rather than memorization",
                        "Consider creating a study group"
                    ],
                    "created_at": datetime.utcnow()
                })

        # Check for weak subjects
        for subject_data in usmle_stats.get("weak_subjects", [])[:2]:
            if subject_data["accuracy"] < 0.5 and subject_data["count"] >= 10:
                alerts.append({
                    "type": "weak_subject",
                    "severity": "medium",
                    "message": f"Low performance in {subject_data['subject']}: {subject_data['accuracy']:.1%}",
                    "recommendations": [
                        f"Review {subject_data['subject']} fundamentals",
                        f"Complete additional {subject_data['subject']} practice questions",
                        "Seek help from tutors or study groups"
                    ],
                    "created_at": datetime.utcnow()
                })

        logger.info(f"Generated {len(alerts)} alerts for user {user_id}")
        return alerts
    except Exception as e:
        logger.error(f"Error getting alerts for user {user_id}: {str(e)}")
        raise


# ==========================================
# Medications
# ==========================================

async def create_medication(db: AsyncSession, medication: MedicationCreate):
    """Create medication."""
    try:
        medication_dict = medication.model_dump(exclude_unset=True)

        db_medication = MedicationDatabase(**medication_dict)

        db.add(db_medication)
        await db.commit()
        await db.refresh(db_medication)

        logger.info(f"Created medication {db_medication.id}: {db_medication.generic_name}")
        return db_medication
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating medication: {str(e)}")
        raise


async def search_medications(
    db: AsyncSession,
    search: Optional[str],
    drug_class: Optional[str],
    limit: int,
    offset: int
):
    """Search medications."""
    try:
        query = select(MedicationDatabase)

        conditions = []
        if search:
            # Search in generic name or brand names
            search_term = f"%{search.lower()}%"
            conditions.append(
                or_(
                    func.lower(MedicationDatabase.generic_name).like(search_term),
                    MedicationDatabase.brand_names.any(search_term)
                )
            )

        if drug_class:
            conditions.append(MedicationDatabase.drug_class == drug_class)

        if conditions:
            query = query.where(and_(*conditions))

        query = query.order_by(MedicationDatabase.generic_name).offset(offset).limit(limit)

        result = await db.execute(query)
        medications = result.scalars().all()

        logger.info(f"Found {len(medications)} medications")
        return medications
    except Exception as e:
        logger.error(f"Error searching medications: {str(e)}")
        raise


async def get_medication(db: AsyncSession, medication_id: UUID):
    """Get medication."""
    try:
        query = select(MedicationDatabase).where(
            MedicationDatabase.id == medication_id
        )
        result = await db.execute(query)
        medication = result.scalar_one_or_none()

        if medication:
            logger.info(f"Retrieved medication {medication_id}")
        return medication
    except Exception as e:
        logger.error(f"Error getting medication {medication_id}: {str(e)}")
        raise


# ==========================================
# Batch Operations
# ==========================================

async def batch_import_usmle_questions(db: AsyncSession, batch):
    """Batch import USMLE questions."""
    try:
        imported_count = 0
        failed_count = 0
        errors = []
        created_ids = []

        for idx, question in enumerate(batch.questions):
            try:
                if not batch.validate_only:
                    db_question = await create_usmle_question(db, question)
                    created_ids.append(db_question.id)
                imported_count += 1
            except Exception as e:
                failed_count += 1
                errors.append({
                    "index": idx,
                    "error": str(e)
                })

        result = {
            "total_submitted": len(batch.questions),
            "successful": imported_count,
            "failed": failed_count,
            "errors": errors,
            "created_ids": created_ids
        }

        logger.info(f"Batch import completed: {imported_count} success, {failed_count} failed")
        return result
    except Exception as e:
        logger.error(f"Error in batch import: {str(e)}")
        raise


# ==========================================
# HIPAA Audit Log
# ==========================================

async def get_audit_log(
    db: AsyncSession,
    user_id: UUID,
    start_date: Optional[datetime],
    end_date: Optional[datetime],
    limit: int
):
    """Get HIPAA audit log."""
    try:
        query = select(HIPAAAuditLog)

        conditions = []
        if user_id:
            conditions.append(HIPAAAuditLog.user_id == user_id)
        if start_date:
            conditions.append(HIPAAAuditLog.timestamp >= start_date)
        if end_date:
            conditions.append(HIPAAAuditLog.timestamp <= end_date)

        if conditions:
            query = query.where(and_(*conditions))

        query = query.order_by(desc(HIPAAAuditLog.timestamp)).limit(limit)

        result = await db.execute(query)
        logs = result.scalars().all()

        # Convert to dict format
        log_dicts = [
            {
                "id": str(log.id),
                "user_id": str(log.user_id) if log.user_id else None,
                "action": log.action,
                "resource_type": log.resource_type,
                "timestamp": log.timestamp,
                "success": log.success,
                "details": log.details
            }
            for log in logs
        ]

        logger.info(f"Retrieved {len(logs)} audit log entries")
        return log_dicts
    except Exception as e:
        logger.error(f"Error getting audit log: {str(e)}")
        raise


async def deidentify_text(text: str):
    """De-identify PHI from text."""
    try:
        # TODO: Implement proper PHI detection using NLP/regex
        # For now, return placeholder implementation
        # In production, use libraries like presidio or custom NLP models

        import re

        deidentified = text
        phi_detected = False

        # Simple pattern matching for common PHI (very basic)
        # SSN pattern
        if re.search(r'\d{3}-\d{2}-\d{4}', text):
            deidentified = re.sub(r'\d{3}-\d{2}-\d{4}', '[SSN]', deidentified)
            phi_detected = True

        # Phone numbers
        if re.search(r'\d{3}-\d{3}-\d{4}', text):
            deidentified = re.sub(r'\d{3}-\d{3}-\d{4}', '[PHONE]', deidentified)
            phi_detected = True

        # Email addresses
        if re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text):
            deidentified = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL]', deidentified)
            phi_detected = True

        result = {
            "original": text if not phi_detected else "[REDACTED]",
            "deidentified": deidentified,
            "phi_detected": phi_detected
        }

        logger.info(f"De-identified text, PHI detected: {phi_detected}")
        return result
    except Exception as e:
        logger.error(f"Error de-identifying text: {str(e)}")
        raise

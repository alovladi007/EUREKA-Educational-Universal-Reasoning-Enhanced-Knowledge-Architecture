"""
Adaptive Learning Service - Core Business Logic

Generates personalized learning paths, tracks mastery, and provides recommendations.
"""
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.core.models import (
    Concept, StudentMastery, LearningPath, Recommendation,
    SkillGap, PracticeSession, DifficultyLevel, MasteryLevel, PathStatus
)
from app.core.config import get_settings

settings = get_settings()


class AdaptiveLearningService:
    """Core service for adaptive learning functionality"""
    
    # ============= Path Generation =============
    
    async def generate_learning_path(
        self,
        db: AsyncSession,
        user_id: UUID,
        course_id: UUID,
        target_difficulty: Optional[DifficultyLevel] = None,
        max_concepts: int = 10
    ) -> LearningPath:
        """
        Generate a personalized learning path based on:
        - Student's current mastery
        - Concept prerequisites
        - Target difficulty level
        """
        # Get student's current mastery
        mastery_map = await self._get_student_mastery_map(db, user_id, course_id)
        
        # Get all concepts for the course
        result = await db.execute(
            select(Concept).where(Concept.course_id == course_id)
        )
        all_concepts = result.scalars().all()
        
        # Build concept graph (adjacency list)
        concept_graph = self._build_concept_graph(all_concepts)
        
        # Generate optimal sequence using topological sort + mastery
        concept_sequence = self._generate_optimal_sequence(
            all_concepts, 
            concept_graph, 
            mastery_map,
            target_difficulty,
            max_concepts
        )
        
        # Estimate completion time
        estimated_hours = sum(
            c.estimated_time_minutes or 30 for c in concept_sequence
        ) / 60.0
        
        # Create learning path
        path = LearningPath(
            user_id=user_id,
            course_id=course_id,
            name=f"Personalized Path - {course_id}",
            description="AI-generated learning path based on your current level",
            target_difficulty=target_difficulty,
            concept_sequence=[c.id for c in concept_sequence],
            estimated_completion_hours=estimated_hours,
            started_at=datetime.utcnow()
        )
        
        db.add(path)
        await db.commit()
        await db.refresh(path)
        
        return path
    
    async def _get_student_mastery_map(
        self, 
        db: AsyncSession, 
        user_id: UUID,
        course_id: UUID
    ) -> Dict[UUID, StudentMastery]:
        """Get student's mastery for all concepts in a course"""
        result = await db.execute(
            select(StudentMastery, Concept)
            .join(Concept, StudentMastery.concept_id == Concept.id)
            .where(
                and_(
                    StudentMastery.user_id == user_id,
                    Concept.course_id == course_id
                )
            )
        )
        return {mastery.concept_id: mastery for mastery, _ in result.all()}
    
    def _build_concept_graph(self, concepts: List[Concept]) -> Dict[UUID, List[UUID]]:
        """Build adjacency list of concept dependencies"""
        graph = {c.id: c.prerequisites for c in concepts}
        return graph
    
    def _generate_optimal_sequence(
        self,
        concepts: List[Concept],
        graph: Dict[UUID, List[UUID]],
        mastery_map: Dict[UUID, StudentMastery],
        target_difficulty: Optional[DifficultyLevel],
        max_concepts: int
    ) -> List[Concept]:
        """
        Generate optimal learning sequence using:
        1. Topological sort (respect prerequisites)
        2. Mastery-based prioritization
        3. Difficulty filtering
        """
        # Filter by difficulty if specified
        if target_difficulty:
            filtered_concepts = [
                c for c in concepts 
                if c.difficulty_level == target_difficulty
            ]
        else:
            filtered_concepts = concepts
        
        # Topological sort with mastery weighting
        sequence = []
        visited = set()
        in_progress = set()
        
        def visit(concept: Concept):
            if concept.id in visited:
                return
            if concept.id in in_progress:
                return  # Cycle detection (skip)
            
            in_progress.add(concept.id)
            
            # Visit prerequisites first
            for prereq_id in concept.prerequisites:
                prereq = next((c for c in concepts if c.id == prereq_id), None)
                if prereq:
                    visit(prereq)
            
            visited.add(concept.id)
            in_progress.remove(concept.id)
            
            # Only add if not mastered or needs review
            mastery = mastery_map.get(concept.id)
            if not mastery or mastery.mastery_level != MasteryLevel.MASTERED:
                sequence.append(concept)
        
        # Sort concepts by priority (unmastered first, then by difficulty)
        priority_concepts = sorted(
            filtered_concepts,
            key=lambda c: (
                mastery_map.get(c.id, StudentMastery()).mastery_score,
                c.difficulty_level.value
            )
        )
        
        for concept in priority_concepts:
            if len(sequence) >= max_concepts:
                break
            visit(concept)
        
        return sequence[:max_concepts]
    
    # ============= Recommendations =============
    
    async def generate_recommendations(
        self,
        db: AsyncSession,
        user_id: UUID,
        course_id: Optional[UUID] = None,
        limit: int = 5
    ) -> List[Recommendation]:
        """
        Generate personalized learning recommendations based on:
        - Current mastery levels
        - Skill gaps
        - Learning patterns
        - Time since last practice
        """
        recommendations = []
        
        # 1. Review recommendations (concepts needing reinforcement)
        review_recs = await self._generate_review_recommendations(
            db, user_id, course_id
        )
        recommendations.extend(review_recs[:2])
        
        # 2. Practice recommendations (weak areas)
        practice_recs = await self._generate_practice_recommendations(
            db, user_id, course_id
        )
        recommendations.extend(practice_recs[:2])
        
        # 3. New content recommendations (next concepts)
        new_content_recs = await self._generate_new_content_recommendations(
            db, user_id, course_id
        )
        recommendations.extend(new_content_recs[:1])
        
        # Save recommendations
        for rec in recommendations[:limit]:
            db.add(rec)
        
        await db.commit()
        
        # Refresh all
        for rec in recommendations[:limit]:
            await db.refresh(rec)
        
        return recommendations[:limit]
    
    async def _generate_review_recommendations(
        self, 
        db: AsyncSession, 
        user_id: UUID,
        course_id: Optional[UUID]
    ) -> List[Recommendation]:
        """Recommend concepts that need review"""
        # Find concepts practiced but not mastered, not practiced recently
        query = select(StudentMastery, Concept).join(
            Concept, StudentMastery.concept_id == Concept.id
        ).where(
            and_(
                StudentMastery.user_id == user_id,
                StudentMastery.mastery_level.in_([MasteryLevel.LEARNING, MasteryLevel.PRACTICED]),
                StudentMastery.last_practice_date < datetime.utcnow() - timedelta(days=7)
            )
        )
        
        if course_id:
            query = query.where(Concept.course_id == course_id)
        
        result = await db.execute(query.order_by(StudentMastery.last_practice_date).limit(3))
        
        recommendations = []
        for mastery, concept in result.all():
            rec = Recommendation(
                user_id=user_id,
                recommendation_type="review",
                priority=8,
                concept_id=concept.id,
                reason=f"You haven't practiced '{concept.name}' in over a week. Review it to maintain mastery!",
                confidence=0.85,
                expires_at=datetime.utcnow() + timedelta(hours=24)
            )
            recommendations.append(rec)
        
        return recommendations
    
    async def _generate_practice_recommendations(
        self, 
        db: AsyncSession, 
        user_id: UUID,
        course_id: Optional[UUID]
    ) -> List[Recommendation]:
        """Recommend practice for weak concepts"""
        # Find concepts with low mastery scores
        query = select(StudentMastery, Concept).join(
            Concept, StudentMastery.concept_id == Concept.id
        ).where(
            and_(
                StudentMastery.user_id == user_id,
                StudentMastery.mastery_score < settings.MASTERY_THRESHOLD,
                StudentMastery.attempts > 0
            )
        )
        
        if course_id:
            query = query.where(Concept.course_id == course_id)
        
        result = await db.execute(
            query.order_by(StudentMastery.mastery_score).limit(3)
        )
        
        recommendations = []
        for mastery, concept in result.all():
            rec = Recommendation(
                user_id=user_id,
                recommendation_type="practice",
                priority=9,
                concept_id=concept.id,
                reason=f"Practice '{concept.name}' to improve your mastery from {mastery.mastery_score*100:.0f}% to 85%+",
                confidence=0.9,
                expires_at=datetime.utcnow() + timedelta(hours=24)
            )
            recommendations.append(rec)
        
        return recommendations
    
    async def _generate_new_content_recommendations(
        self, 
        db: AsyncSession, 
        user_id: UUID,
        course_id: Optional[UUID]
    ) -> List[Recommendation]:
        """Recommend new concepts to learn"""
        # Find concepts not yet started where prerequisites are met
        mastery_map = await self._get_student_mastery_map(db, user_id, course_id) if course_id else {}
        
        query = select(Concept)
        if course_id:
            query = query.where(Concept.course_id == course_id)
        
        result = await db.execute(query)
        all_concepts = result.scalars().all()
        
        recommendations = []
        for concept in all_concepts:
            # Check if not started
            if concept.id in mastery_map:
                continue
            
            # Check if prerequisites are met
            prereqs_met = all(
                prereq_id in mastery_map and 
                mastery_map[prereq_id].mastery_level in [MasteryLevel.MASTERED, MasteryLevel.PRACTICED]
                for prereq_id in concept.prerequisites
            )
            
            if prereqs_met or not concept.prerequisites:
                rec = Recommendation(
                    user_id=user_id,
                    recommendation_type="new_content",
                    priority=6,
                    concept_id=concept.id,
                    reason=f"You're ready to learn '{concept.name}'! All prerequisites are met.",
                    confidence=0.8,
                    expires_at=datetime.utcnow() + timedelta(hours=48)
                )
                recommendations.append(rec)
                
                if len(recommendations) >= 2:
                    break
        
        return recommendations
    
    # ============= Mastery Tracking =============
    
    async def update_mastery(
        self,
        db: AsyncSession,
        user_id: UUID,
        concept_id: UUID,
        assessment_score: float,
        time_spent_minutes: int
    ) -> StudentMastery:
        """
        Update student mastery based on assessment performance.
        Uses exponential moving average for smooth updates.
        """
        # Get or create mastery record
        result = await db.execute(
            select(StudentMastery).where(
                and_(
                    StudentMastery.user_id == user_id,
                    StudentMastery.concept_id == concept_id
                )
            )
        )
        mastery = result.scalar_one_or_none()
        
        if not mastery:
            mastery = StudentMastery(
                user_id=user_id,
                concept_id=concept_id
            )
            db.add(mastery)
        
        # Update attempts
        mastery.attempts += 1
        if assessment_score >= 0.6:  # 60% considered correct
            mastery.correct_attempts += 1
        
        # Update mastery score (exponential moving average)
        alpha = 0.3  # Weight for new data
        mastery.mastery_score = (
            alpha * assessment_score + 
            (1 - alpha) * mastery.mastery_score
        )
        
        # Update confidence based on consistency
        consistency = mastery.correct_attempts / mastery.attempts
        mastery.confidence_score = consistency ** 0.5  # Square root for smoother growth
        
        # Update time spent
        mastery.time_spent_minutes += time_spent_minutes
        mastery.last_practice_date = datetime.utcnow()
        
        # Determine mastery level
        mastery.mastery_level = self._calculate_mastery_level(mastery)
        
        # Mark as mastered if threshold met
        if (mastery.mastery_level == MasteryLevel.MASTERED and 
            not mastery.mastered_at):
            mastery.mastered_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(mastery)
        
        return mastery
    
    def _calculate_mastery_level(self, mastery: StudentMastery) -> MasteryLevel:
        """Determine mastery level based on score, confidence, and attempts"""
        if mastery.attempts == 0:
            return MasteryLevel.NOT_STARTED
        
        if (mastery.mastery_score >= settings.MASTERY_THRESHOLD and
            mastery.confidence_score >= settings.CONFIDENCE_THRESHOLD and
            mastery.attempts >= settings.MIN_ATTEMPTS_FOR_MASTERY):
            return MasteryLevel.MASTERED
        
        if mastery.mastery_score >= 0.7 and mastery.attempts >= 2:
            return MasteryLevel.PRACTICED
        
        return MasteryLevel.LEARNING
    
    # ============= Skill Gap Analysis =============
    
    async def identify_skill_gaps(
        self,
        db: AsyncSession,
        user_id: UUID,
        course_id: Optional[UUID] = None
    ) -> List[SkillGap]:
        """
        Identify skill gaps by analyzing:
        - Low mastery scores
        - Failed assessments
        - Weak prerequisite concepts
        """
        gaps = []
        
        # Get all mastery records
        query = select(StudentMastery, Concept).join(
            Concept, StudentMastery.concept_id == Concept.id
        ).where(StudentMastery.user_id == user_id)
        
        if course_id:
            query = query.where(Concept.course_id == course_id)
        
        result = await db.execute(query)
        mastery_records = result.all()
        
        for mastery, concept in mastery_records:
            # Calculate gap severity
            severity = 1.0 - mastery.mastery_score
            
            # Skip if performing well
            if severity < (1.0 - settings.GAP_SEVERITY_THRESHOLD):
                continue
            
            # Check if gap already exists
            existing_gap = await db.execute(
                select(SkillGap).where(
                    and_(
                        SkillGap.user_id == user_id,
                        SkillGap.concept_id == concept.id,
                        SkillGap.is_addressed == False
                    )
                )
            )
            
            if existing_gap.scalar_one_or_none():
                continue  # Gap already identified
            
            # Create new skill gap
            gap = SkillGap(
                user_id=user_id,
                concept_id=concept.id,
                severity=severity,
                confidence=mastery.confidence_score,
                weak_prerequisites=concept.prerequisites,  # Simplified
                suggested_content=concept.content_ids,
                suggested_practice=[]  # Would link to practice exercises
            )
            
            db.add(gap)
            gaps.append(gap)
        
        await db.commit()
        
        # Refresh all gaps
        for gap in gaps:
            await db.refresh(gap)
        
        return gaps
    
    # ============= Difficulty Adjustment =============
    
    async def adjust_difficulty(
        self,
        db: AsyncSession,
        user_id: UUID,
        concept_id: UUID,
        current_difficulty: DifficultyLevel,
        accuracy: float
    ) -> DifficultyLevel:
        """
        Dynamically adjust difficulty based on performance.
        Increase if doing well, decrease if struggling.
        """
        if accuracy >= settings.ACCURACY_THRESHOLD_UP:
            # Increase difficulty
            if current_difficulty == DifficultyLevel.BEGINNER:
                return DifficultyLevel.INTERMEDIATE
            elif current_difficulty == DifficultyLevel.INTERMEDIATE:
                return DifficultyLevel.ADVANCED
            elif current_difficulty == DifficultyLevel.ADVANCED:
                return DifficultyLevel.EXPERT
        
        elif accuracy < settings.ACCURACY_THRESHOLD_DOWN:
            # Decrease difficulty
            if current_difficulty == DifficultyLevel.EXPERT:
                return DifficultyLevel.ADVANCED
            elif current_difficulty == DifficultyLevel.ADVANCED:
                return DifficultyLevel.INTERMEDIATE
            elif current_difficulty == DifficultyLevel.INTERMEDIATE:
                return DifficultyLevel.BEGINNER
        
        return current_difficulty  # No change

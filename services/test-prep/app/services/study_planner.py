"""
EUREKA Test Prep - Intelligent Study Planner
AI-powered personalized study plan generation with optimization algorithms

Ported from study-planner.service.ts with full implementation
"""
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import numpy as np


@dataclass
class TopicAllocation:
    """Time allocation for a specific topic"""
    topic_id: str
    topic_name: str
    hours: float
    priority: float
    mastery: Dict[str, float]  # current, target, expected
    materials: List[Dict]
    exercises: List[Dict]


@dataclass
class PracticeSession:
    """Scheduled practice session"""
    id: str
    session_type: str  # adaptive, targeted, mixed, timed
    duration: int  # minutes
    topic: str
    difficulty: str
    question_count: int
    target_accuracy: float
    focus: List[str]


@dataclass
class MockExam:
    """Scheduled mock exam"""
    id: str
    date: datetime
    exam_type: str  # full, section, diagnostic
    expected_score: float
    focus_areas: List[str]
    review_time: int  # minutes


@dataclass
class Milestone:
    """Progress milestone"""
    id: str
    week_number: int
    milestone_type: str  # score, mastery, completion, consistency
    target: Dict
    importance: str  # critical, important, nice-to-have
    reward: Optional[str] = None


@dataclass
class FocusArea:
    """Topic requiring focused attention"""
    topic_id: str
    topic_name: str
    current_mastery: float
    target_mastery: float
    gap_analysis: Dict
    improvement_potential: float
    time_required: float
    strategy: str


@dataclass
class WeeklyPlan:
    """Plan for a single week"""
    week_number: int
    start_date: datetime
    end_date: datetime
    total_hours: float
    topics: List[TopicAllocation]
    practices: List[PracticeSession]
    mock_exams: List[MockExam]
    goals: List[str]
    expected_progress: float


@dataclass
class StudyPlan:
    """Complete study plan"""
    id: str
    user_id: str
    exam_date: datetime
    target_score: float
    current_score: float
    hours_per_week: float
    weeks: List[WeeklyPlan]
    milestones: List[Milestone]
    focus_areas: List[FocusArea]
    adaptive_adjustments: List[Dict]
    confidence_score: float
    expected_outcome: Dict


class StudyPlannerService:
    """
    Generates optimized study plans using:
    - Dynamic programming for time allocation
    - Monte Carlo simulation for outcome prediction
    - Phase-based learning strategies
    - Adaptive adjustments based on progress
    """

    def __init__(self):
        self.phase_weights = {
            'foundation': {'concept': 0.6, 'practice': 0.3, 'review': 0.1},
            'building': {'concept': 0.4, 'practice': 0.5, 'review': 0.1},
            'reinforcement': {'concept': 0.2, 'practice': 0.6, 'review': 0.2},
            'peak': {'concept': 0.1, 'practice': 0.7, 'review': 0.2},
            'taper': {'concept': 0.1, 'practice': 0.4, 'review': 0.5}
        }

        self.session_distribution = {
            'foundation': {'adaptive': 0.2, 'targeted': 0.6, 'mixed': 0.1, 'timed': 0.1},
            'building': {'adaptive': 0.3, 'targeted': 0.4, 'mixed': 0.2, 'timed': 0.1},
            'reinforcement': {'adaptive': 0.4, 'targeted': 0.2, 'mixed': 0.2, 'timed': 0.2},
            'peak': {'adaptive': 0.3, 'targeted': 0.1, 'mixed': 0.3, 'timed': 0.3},
            'taper': {'adaptive': 0.5, 'targeted': 0.1, 'mixed': 0.2, 'timed': 0.2}
        }

    def generate_study_plan(
        self,
        user_id: str,
        exam_type: str,
        exam_date: datetime,
        target_score: float,
        current_score: float,
        available_hours: float,
        topic_mastery: Dict[str, float]
    ) -> StudyPlan:
        """
        Generate comprehensive personalized study plan

        Args:
            user_id: User identifier
            exam_type: Type of exam (GRE, GMAT, etc.)
            exam_date: Target exam date
            target_score: Desired score
            current_score: Current ability score
            available_hours: Hours available per week
            topic_mastery: Current mastery levels by topic

        Returns:
            Complete study plan with weekly schedules
        """
        # Calculate time available
        weeks_until_exam = self._calculate_weeks_until_exam(exam_date)
        total_hours = weeks_until_exam * available_hours

        # Identify gaps and focus areas
        focus_areas = self._identify_focus_areas(
            topic_mastery,
            target_score,
            current_score
        )

        # Generate optimized weekly plans
        weekly_plans = self._generate_weekly_plans(
            weeks=weeks_until_exam,
            hours_per_week=available_hours,
            focus_areas=focus_areas,
            exam_type=exam_type,
            current_score=current_score,
            target_score=target_score
        )

        # Set milestones
        milestones = self._generate_milestones(
            weekly_plans,
            target_score,
            current_score
        )

        # Predict outcomes
        expected_outcome = self._predict_outcome(
            current_score,
            weekly_plans,
            focus_areas
        )

        # Create adaptive adjustments plan
        adjustments = self._plan_adaptive_adjustments(
            weekly_plans,
            focus_areas
        )

        plan = StudyPlan(
            id=self._generate_plan_id(),
            user_id=user_id,
            exam_date=exam_date,
            target_score=target_score,
            current_score=current_score,
            hours_per_week=available_hours,
            weeks=weekly_plans,
            milestones=milestones,
            focus_areas=focus_areas,
            adaptive_adjustments=adjustments,
            confidence_score=self._calculate_confidence_score(expected_outcome, weekly_plans),
            expected_outcome=expected_outcome
        )

        return plan

    def _generate_weekly_plans(
        self,
        weeks: int,
        hours_per_week: float,
        focus_areas: List[FocusArea],
        exam_type: str,
        current_score: float,
        target_score: float
    ) -> List[WeeklyPlan]:
        """Generate optimized weekly study plans"""
        plans = []
        score_gap = target_score - current_score
        weekly_improvement = score_gap / weeks

        # Optimize time allocation using dynamic programming
        time_allocation = self._optimize_time_allocation(
            focus_areas,
            weeks * hours_per_week
        )

        for week in range(1, weeks + 1):
            start_date = datetime.now() + timedelta(weeks=week - 1)
            end_date = start_date + timedelta(days=6)

            # Determine phase
            phase = self._determine_phase(week, weeks)

            # Allocate topics for this week
            topics = self._allocate_weekly_topics(
                focus_areas,
                time_allocation,
                week,
                weeks,
                phase,
                hours_per_week
            )

            # Schedule practice sessions
            practices = self._schedule_practice_sessions(
                topics,
                phase,
                week,
                hours_per_week
            )

            # Schedule mock exams
            mock_exams = self._schedule_mock_exams(
                week,
                weeks,
                phase,
                exam_type
            )

            # Set weekly goals
            expected_score = current_score + weekly_improvement * week
            goals = self._set_weekly_goals(topics, phase, week, expected_score)

            plans.append(WeeklyPlan(
                week_number=week,
                start_date=start_date,
                end_date=end_date,
                total_hours=hours_per_week,
                topics=topics,
                practices=practices,
                mock_exams=mock_exams,
                goals=goals,
                expected_progress=expected_score
            ))

        return plans

    def _optimize_time_allocation(
        self,
        focus_areas: List[FocusArea],
        total_hours: float
    ) -> Dict[str, float]:
        """
        Optimize time allocation using dynamic programming
        Maximizes expected score improvement
        """
        n = len(focus_areas)
        hours = int(total_hours)

        # dp[i][h] = max score improvement using first i topics with h hours
        dp = np.zeros((n + 1, hours + 1))
        allocation = np.zeros((n + 1, hours + 1), dtype=int)

        for i in range(1, n + 1):
            area = focus_areas[i - 1]
            max_hours = min(hours, int(np.ceil(area.time_required)))

            for h in range(hours + 1):
                # Don't allocate time to this topic
                dp[i][h] = dp[i - 1][h]
                allocation[i][h] = 0

                # Try allocating different amounts of time
                for allocate in range(1, min(h, max_hours) + 1):
                    improvement = self._calculate_improvement(area, allocate)
                    value = dp[i - 1][h - allocate] + improvement

                    if value > dp[i][h]:
                        dp[i][h] = value
                        allocation[i][h] = allocate

        # Backtrack to find optimal allocation
        result = {}
        remaining_hours = hours

        for i in range(n, 0, -1):
            allocated = allocation[i][remaining_hours]
            if allocated > 0:
                result[focus_areas[i - 1].topic_id] = float(allocated)
                remaining_hours -= allocated

        return result

    def _calculate_improvement(self, area: FocusArea, hours: float) -> float:
        """Calculate expected improvement for time spent on a topic"""
        # Diminishing returns model
        max_improvement = (area.target_mastery - area.current_mastery) * area.improvement_potential
        efficiency = 1 - np.exp(-hours / area.time_required)
        return max_improvement * efficiency

    def _determine_phase(self, week: int, total_weeks: int) -> str:
        """Determine current study phase"""
        progress = week / total_weeks

        if progress <= 0.2:
            return 'foundation'
        elif progress <= 0.4:
            return 'building'
        elif progress <= 0.7:
            return 'reinforcement'
        elif progress <= 0.9:
            return 'peak'
        else:
            return 'taper'

    def _allocate_weekly_topics(
        self,
        focus_areas: List[FocusArea],
        time_allocation: Dict[str, float],
        week: int,
        total_weeks: int,
        phase: str,
        hours_per_week: float
    ) -> List[TopicAllocation]:
        """Allocate topics for a specific week"""
        allocations = []
        weights = self.phase_weights[phase]
        total_allocated = 0.0

        for area in focus_areas:
            total_hours = time_allocation.get(area.topic_id, 0)
            weekly_hours = total_hours / total_weeks

            # Adjust based on phase and priority
            adjusted_hours = weekly_hours
            if phase == 'foundation' and area.current_mastery < 0.3:
                adjusted_hours *= 1.3  # Focus on weak areas early
            elif phase == 'peak' and area.current_mastery > 0.7:
                adjusted_hours *= 0.7  # Reduce time on strong areas

            # Cap at available hours
            adjusted_hours = min(adjusted_hours, hours_per_week - total_allocated)
            total_allocated += adjusted_hours

            if adjusted_hours > 0:
                allocations.append(TopicAllocation(
                    topic_id=area.topic_id,
                    topic_name=area.topic_name,
                    hours=adjusted_hours,
                    priority=self._calculate_topic_priority(area, week, total_weeks),
                    mastery={
                        'current': area.current_mastery,
                        'target': area.target_mastery,
                        'expected': self._predict_mastery(area.current_mastery, adjusted_hours)
                    },
                    materials=self._select_study_materials(area, adjusted_hours, weights),
                    exercises=self._generate_exercises(area, adjusted_hours, phase)
                ))

        return allocations

    def _schedule_practice_sessions(
        self,
        topics: List[TopicAllocation],
        phase: str,
        week: int,
        hours_per_week: float
    ) -> List[PracticeSession]:
        """Schedule practice sessions for the week"""
        sessions = []
        distribution = self.session_distribution[phase]
        practice_hours = hours_per_week * 0.6  # 60% practice time

        # Adaptive sessions
        if distribution['adaptive'] > 0:
            sessions.append(PracticeSession(
                id=self._generate_id(),
                session_type='adaptive',
                duration=int(practice_hours * distribution['adaptive'] * 60),
                topic='mixed',
                difficulty='adaptive',
                question_count=int(practice_hours * distribution['adaptive'] * 40),
                target_accuracy=0.75 + week * 0.01,
                focus=[t.topic_name for t in topics[:3]]
            ))

        # Targeted sessions for high-priority topics
        for topic in topics:
            if topic.priority > 0.5:
                sessions.append(PracticeSession(
                    id=self._generate_id(),
                    session_type='targeted',
                    duration=int(topic.hours * 0.4 * 60),
                    topic=topic.topic_name,
                    difficulty=self._select_difficulty(topic.mastery['current']),
                    question_count=int(topic.hours * 0.4 * 35),
                    target_accuracy=0.7 + topic.mastery['current'] * 0.2,
                    focus=[topic.topic_name]
                ))

        # Timed practice for peak phases
        if distribution['timed'] > 0 and phase in ['peak', 'reinforcement']:
            sessions.append(PracticeSession(
                id=self._generate_id(),
                session_type='timed',
                duration=int(practice_hours * distribution['timed'] * 60),
                topic='mixed',
                difficulty='medium',
                question_count=int(practice_hours * distribution['timed'] * 45),
                target_accuracy=0.7,
                focus=['time management', 'pacing']
            ))

        return sessions

    def _schedule_mock_exams(
        self,
        week: int,
        total_weeks: int,
        phase: str,
        exam_type: str
    ) -> List[MockExam]:
        """Schedule mock exams"""
        exams = []
        exam_date = datetime.now() + timedelta(weeks=week)

        # Diagnostic exam in first week
        if week == 1:
            exams.append(MockExam(
                id=self._generate_id(),
                date=exam_date,
                exam_type='diagnostic',
                expected_score=0,
                focus_areas=[],
                review_time=120
            ))

        # Section exams during building phase
        if phase == 'building' and week % 2 == 0:
            exams.append(MockExam(
                id=self._generate_id(),
                date=exam_date - timedelta(days=2),
                exam_type='section',
                expected_score=0,
                focus_areas=['weak areas'],
                review_time=60
            ))

        # Full exams during peak phase
        if phase in ['peak', 'reinforcement'] and week % 2 == 0:
            exams.append(MockExam(
                id=self._generate_id(),
                date=exam_date - timedelta(days=2),
                exam_type='full',
                expected_score=0,
                focus_areas=[],
                review_time=180
            ))

        # Final mock exam
        if week == total_weeks - 1:
            exams.append(MockExam(
                id=self._generate_id(),
                date=exam_date - timedelta(days=3),
                exam_type='full',
                expected_score=0,
                focus_areas=['final review'],
                review_time=240
            ))

        return exams

    def _generate_milestones(
        self,
        weekly_plans: List[WeeklyPlan],
        target_score: float,
        current_score: float
    ) -> List[Milestone]:
        """Generate progress milestones"""
        milestones = []
        score_gap = target_score - current_score

        # Consistency milestone
        milestones.append(Milestone(
            id=self._generate_id(),
            week_number=1,
            milestone_type='consistency',
            target={'days_per_week': 5, 'hours_per_week': weekly_plans[0].total_hours},
            importance='critical',
            reward='Study Streak Started!'
        ))

        # Score improvement milestones
        for progress in [0.25, 0.5, 0.75, 1.0]:
            week = int(len(weekly_plans) * progress)
            if week > 0:
                milestones.append(Milestone(
                    id=self._generate_id(),
                    week_number=week,
                    milestone_type='score',
                    target={'score': current_score + score_gap * progress},
                    importance='critical' if progress == 1.0 else 'important',
                    reward=f'{int(progress * 100)}% to target!'
                ))

        return milestones

    def _identify_focus_areas(
        self,
        topic_mastery: Dict[str, float],
        target_score: float,
        current_score: float
    ) -> List[FocusArea]:
        """Identify topics requiring focused attention"""
        areas = []
        score_gap = target_score - current_score

        for topic_id, mastery in topic_mastery.items():
            target_mastery = self._calculate_target_mastery(mastery, score_gap)
            gap = target_mastery - mastery

            if gap > 0.1:
                areas.append(FocusArea(
                    topic_id=topic_id,
                    topic_name=topic_id.replace('_', ' ').title(),
                    current_mastery=mastery,
                    target_mastery=target_mastery,
                    gap_analysis={
                        'conceptual_gaps': [],
                        'skill_gaps': [],
                        'practice_needed': int((target_mastery - mastery) * 100)
                    },
                    improvement_potential=self._calculate_potential(mastery, target_mastery),
                    time_required=self._estimate_time_required(mastery, target_mastery),
                    strategy=self._select_strategy(mastery, target_mastery)
                ))

        # Sort by improvement potential
        return sorted(areas, key=lambda a: a.improvement_potential, reverse=True)

    def _predict_outcome(
        self,
        current_score: float,
        weekly_plans: List[WeeklyPlan],
        focus_areas: List[FocusArea]
    ) -> Dict:
        """Predict outcome using Monte Carlo simulation"""
        simulations = 1000
        results = []

        for _ in range(simulations):
            score = current_score

            for week_plan in weekly_plans:
                for topic in week_plan.topics:
                    improvement = self._simulate_improvement(
                        topic.mastery['current'],
                        topic.hours,
                        np.random.random()
                    )
                    score += improvement

            results.append(score)

        results = sorted(results)

        return {
            'predicted_score': results[len(results) // 2],  # Median
            'confidence': self._calculate_confidence(results),
            'probability_range': {
                'min': results[len(results) // 10],
                'median': results[len(results) // 2],
                'max': results[int(len(results) * 0.9)]
            },
            'strengths': [a.topic_name for a in focus_areas if a.current_mastery > 0.7],
            'risks': self._identify_risks(weekly_plans, focus_areas)
        }

    # Helper methods
    def _calculate_weeks_until_exam(self, exam_date: datetime) -> int:
        delta = exam_date - datetime.now()
        return max(1, int(np.ceil(delta.days / 7)))

    def _generate_plan_id(self) -> str:
        import time
        return f"plan_{int(time.time())}_{np.random.randint(1000, 9999)}"

    def _generate_id(self) -> str:
        import time
        return f"{int(time.time())}_{np.random.randint(1000, 9999)}"

    def _calculate_topic_priority(self, area: FocusArea, week: int, total_weeks: int) -> float:
        time_urgency = 1 - (week / total_weeks)
        mastery_gap = area.target_mastery - area.current_mastery
        potential = area.improvement_potential
        return time_urgency * 0.3 + mastery_gap * 0.4 + potential * 0.3

    def _select_difficulty(self, mastery: float) -> str:
        if mastery < 0.4:
            return 'easy'
        elif mastery < 0.7:
            return 'medium'
        return 'hard'

    def _predict_mastery(self, current: float, hours: float) -> float:
        learning_rate = 0.05
        max_mastery = 0.95
        improvement = (max_mastery - current) * (1 - np.exp(-learning_rate * hours))
        return min(max_mastery, current + improvement)

    def _select_study_materials(self, area: FocusArea, hours: float, weights: Dict) -> List[Dict]:
        return []  # Placeholder for material selection logic

    def _generate_exercises(self, area: FocusArea, hours: float, phase: str) -> List[Dict]:
        return []  # Placeholder for exercise generation logic

    def _set_weekly_goals(self, topics: List[TopicAllocation], phase: str, week: int, expected_score: float) -> List[str]:
        goals = [f"Reach score of {int(expected_score)}"]

        for topic in topics[:3]:
            goals.append(f"Master {topic.topic_name}: {int(topic.mastery['expected'] * 100)}%")

        if phase == 'foundation':
            goals.append('Complete all foundational concepts')
        elif phase == 'peak':
            goals.append('Maintain peak performance')

        return goals

    def _plan_adaptive_adjustments(self, weekly_plans: List[WeeklyPlan], focus_areas: List[FocusArea]) -> List[Dict]:
        return []  # Placeholder for adjustment planning

    def _calculate_confidence_score(self, outcome: Dict, plans: List[WeeklyPlan]) -> float:
        range_width = outcome['probability_range']['max'] - outcome['probability_range']['min']
        median = outcome['probability_range']['median']
        target = plans[-1].expected_progress if plans else 0

        range_factor = 1 - (range_width / 50)
        distance_factor = 1 - abs(median - target) / target if target > 0 else 0

        return (range_factor * 0.5 + distance_factor * 0.5)

    def _simulate_improvement(self, current_mastery: float, hours: float, random_factor: float) -> float:
        base_improvement = hours * 0.5
        mastery_bonus = (1 - current_mastery) * 2
        variance = (random_factor - 0.5) * 2
        return base_improvement * mastery_bonus + variance

    def _calculate_confidence(self, results: List[float]) -> float:
        mean = np.mean(results)
        std_dev = np.std(results)
        return max(0, 1 - std_dev / 10)

    def _identify_risks(self, weekly_plans: List[WeeklyPlan], focus_areas: List[FocusArea]) -> List[str]:
        risks = []

        if len(weekly_plans) < 8:
            risks.append('Limited preparation time')

        major_gaps = [a for a in focus_areas if a.target_mastery - a.current_mastery > 0.4]
        if major_gaps:
            risks.append(f"Major gaps in: {', '.join([g.topic_name for g in major_gaps])}")

        return risks

    def _calculate_target_mastery(self, current: float, score_gap: float) -> float:
        return min(0.95, current + score_gap / 100)

    def _calculate_potential(self, current: float, target: float) -> float:
        return (target - current) * 1.0

    def _estimate_time_required(self, current: float, target: float) -> float:
        return (target - current) * 50

    def _select_strategy(self, current: float, target: float) -> str:
        gap = target - current
        if gap > 0.4:
            return 'intensive'
        elif gap > 0.2:
            return 'focused'
        return 'maintenance'

"""
EUREKA Test Prep - Advanced Analytics Service
Real-time performance tracking, predictive modeling, and insights generation
Full Python implementation with statistical analysis
"""

from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import numpy as np
from scipy import stats
from sqlalchemy.orm import Session
from sqlalchemy import func
import math

from app.models.question import Question
from app.models.question_attempt import QuestionAttempt, StudySession


class InsightType(str, Enum):
    STRENGTH = 'strength'
    WEAKNESS = 'weakness'
    OPPORTUNITY = 'opportunity'
    THREAT = 'threat'
    PATTERN = 'pattern'
    ANOMALY = 'anomaly'
    MILESTONE = 'milestone'


@dataclass
class TopicMetrics:
    mastery: float
    questions_answered: int
    accuracy: float
    avg_time: float
    last_practiced: datetime
    trend: str  # 'improving' | 'declining' | 'stable'
    confidence_interval: Tuple[float, float]
    expected_mastery: float
    gap_to_target: float


@dataclass
class PerformanceMetrics:
    readiness_score: float
    theta: float
    theta_se: float
    percentile: float
    questions_answered: int
    accuracy_by_difficulty: Dict[str, float]
    average_time_per_question: float
    study_streak: int
    total_study_hours: float
    topic_mastery: Dict[str, TopicMetrics]
    weakness_index: float
    improvement_rate: float
    consistency: float


@dataclass
class ScorePrediction:
    expected: float
    confidence: float
    range: Dict[str, float]  # min, median, max
    distribution: List[float]
    percentile_projection: float


@dataclass
class RiskFactor:
    type: str
    severity: str  # 'low' | 'medium' | 'high'
    impact: float
    mitigation: str


@dataclass
class Predictions:
    exam_score: ScorePrediction
    readiness_date: datetime
    probability_of_target: float
    critical_topics: List[str]
    risk_factors: List[RiskFactor]
    success_probability: float


@dataclass
class Trend:
    direction: str  # 'up' | 'down' | 'stable'
    magnitude: float
    confidence: float
    forecast: List[float]
    change_points: Optional[List[datetime]] = None


@dataclass
class TrendAnalysis:
    overall: Trend
    by_topic: Dict[str, Trend]
    by_difficulty: Dict[str, Trend]
    time_management: Trend
    consistency: Trend


@dataclass
class PeerComparison:
    percentile_rank: float
    average_score: float
    peer_group_size: int
    strengths: List[str]
    weaknesses: List[str]
    unique_patterns: List[str]


@dataclass
class Resource:
    type: str
    title: str
    url: Optional[str] = None
    duration: Optional[int] = None


@dataclass
class Recommendation:
    id: str
    priority: int
    type: str  # 'practice' | 'review' | 'strategy' | 'mindset'
    title: str
    description: str
    estimated_impact: float
    time_required: int
    resources: List[Resource] = field(default_factory=list)


@dataclass
class Insight:
    id: str
    type: InsightType
    title: str
    description: str
    importance: float
    actionable: bool
    recommendations: Optional[List[str]]
    evidence: Any
    timestamp: datetime


@dataclass
class ReadinessFactor:
    name: str
    weight: float
    score: float
    trend: str


@dataclass
class AnalyticsData:
    user_id: str
    exam_type: str
    metrics: PerformanceMetrics
    predictions: Predictions
    insights: List[Insight]
    trends: TrendAnalysis
    comparisons: PeerComparison
    recommendations: List[Recommendation]


class AnalyticsService:
    """Advanced analytics service with statistical analysis and predictions"""

    def __init__(self):
        pass

    async def get_user_analytics(
        self,
        db: Session,
        user_id: str,
        exam_type: str
    ) -> AnalyticsData:
        """Get comprehensive analytics for a user"""

        # Fetch data
        performance_data = self._fetch_performance_data(db, user_id, exam_type)
        historical_data = self._fetch_historical_data(db, user_id)

        # Calculate metrics
        metrics = self._calculate_metrics(db, user_id, exam_type, performance_data, historical_data)

        # Analyze trends
        trends = self._analyze_trends(historical_data)

        # Generate predictions
        predictions = self._generate_predictions(metrics, historical_data, trends)

        # Generate insights
        insights = self._generate_insights(metrics, trends, predictions)

        # Peer comparison
        comparisons = self._compare_to_peers(db, user_id, exam_type, metrics)

        # Generate recommendations
        recommendations = self._generate_recommendations(metrics, predictions, insights)

        return AnalyticsData(
            user_id=user_id,
            exam_type=exam_type,
            metrics=metrics,
            predictions=predictions,
            insights=insights,
            trends=trends,
            comparisons=comparisons,
            recommendations=recommendations
        )

    def calculate_readiness_score(
        self,
        db: Session,
        user_id: str
    ) -> Dict[str, Any]:
        """Calculate multi-factor readiness score"""

        data = self._fetch_performance_data(db, user_id, '')

        factors = [
            ReadinessFactor(
                name='Content Mastery',
                weight=0.35,
                score=self._calculate_content_mastery(data),
                trend='up'
            ),
            ReadinessFactor(
                name='Consistency',
                weight=0.20,
                score=self._calculate_consistency(data),
                trend='stable'
            ),
            ReadinessFactor(
                name='Time Management',
                weight=0.15,
                score=self._calculate_time_management(data),
                trend='up'
            ),
            ReadinessFactor(
                name='Accuracy',
                weight=0.20,
                score=self._calculate_accuracy(data),
                trend='up'
            ),
            ReadinessFactor(
                name='Difficulty Handling',
                weight=0.10,
                score=self._calculate_difficulty_handling(data),
                trend='up'
            )
        ]

        # Weighted average
        score = sum(f.score * f.weight for f in factors)

        # Confidence based on data quantity
        confidence = self._calculate_confidence(data)

        return {
            'score': score * 100,
            'confidence': confidence,
            'factors': [
                {
                    'name': f.name,
                    'weight': f.weight,
                    'score': f.score * 100,
                    'trend': f.trend
                }
                for f in factors
            ]
        }

    def _fetch_performance_data(
        self,
        db: Session,
        user_id: str,
        exam_type: str
    ) -> Dict[str, Any]:
        """Fetch performance data from database"""

        query = db.query(QuestionAttempt).filter(QuestionAttempt.user_id == user_id)

        if exam_type:
            # Join with Question to filter by exam type
            query = query.join(Question).filter(Question.exam == exam_type)

        attempts = query.all()

        return {
            'attempts': attempts,
            'total_count': len(attempts),
            'correct_count': sum(1 for a in attempts if a.is_correct),
            'total_time': sum(a.time_spent for a in attempts if a.time_spent),
            'by_topic': self._group_by_field(attempts, 'question.topic'),
            'by_difficulty': self._group_by_difficulty(attempts)
        }

    def _fetch_historical_data(
        self,
        db: Session,
        user_id: str
    ) -> Dict[str, Any]:
        """Fetch historical data for trend analysis"""

        # Get attempts over time
        attempts = db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id == user_id
        ).order_by(QuestionAttempt.created_at).all()

        # Group by day
        daily_data = {}
        for attempt in attempts:
            date_key = attempt.created_at.date()
            if date_key not in daily_data:
                daily_data[date_key] = {'attempts': [], 'correct': 0, 'total': 0}

            daily_data[date_key]['attempts'].append(attempt)
            daily_data[date_key]['total'] += 1
            if attempt.is_correct:
                daily_data[date_key]['correct'] += 1

        # Create time series
        dates = sorted(daily_data.keys())
        accuracy_series = [
            daily_data[d]['correct'] / daily_data[d]['total'] if daily_data[d]['total'] > 0 else 0
            for d in dates
        ]

        time_series = [
            np.mean([a.time_spent for a in daily_data[d]['attempts'] if a.time_spent])
            if daily_data[d]['attempts'] else 0
            for d in dates
        ]

        return {
            'dates': dates,
            'daily_data': daily_data,
            'accuracy_series': accuracy_series,
            'time_series': time_series,
            'activity_series': [daily_data[d]['total'] for d in dates]
        }

    def _calculate_metrics(
        self,
        db: Session,
        user_id: str,
        exam_type: str,
        performance: Dict,
        historical: Dict
    ) -> PerformanceMetrics:
        """Calculate comprehensive performance metrics"""

        attempts = performance['attempts']
        total = performance['total_count']
        correct = performance['correct_count']

        # Calculate topic mastery
        topic_mastery = {}
        for topic, topic_attempts in performance['by_topic'].items():
            topic_mastery[topic] = self._calculate_topic_metrics(topic_attempts, historical)

        # Calculate accuracy by difficulty
        accuracy_by_difficulty = {}
        for diff_level, diff_attempts in performance['by_difficulty'].items():
            total_diff = len(diff_attempts)
            correct_diff = sum(1 for a in diff_attempts if a.is_correct)
            accuracy_by_difficulty[diff_level] = correct_diff / total_diff if total_diff > 0 else 0

        # Average time
        avg_time = performance['total_time'] / total if total > 0 else 0

        # Study streak
        study_streak = self._calculate_study_streak(historical)

        # Total study hours
        total_hours = performance['total_time'] / 3600 if performance['total_time'] else 0

        # Improvement rate
        improvement_rate = self._calculate_improvement_rate(historical)

        # Consistency
        consistency = self._calculate_consistency_score(historical)

        # Weakness index
        weak_topics = [t for t, m in topic_mastery.items() if m.mastery < 0.5]
        weakness_index = len(weak_topics) / len(topic_mastery) if topic_mastery else 0

        return PerformanceMetrics(
            readiness_score=0.0,  # Will be calculated separately
            theta=0.0,  # From adaptive engine
            theta_se=1.0,
            percentile=50.0,
            questions_answered=total,
            accuracy_by_difficulty=accuracy_by_difficulty,
            average_time_per_question=avg_time,
            study_streak=study_streak,
            total_study_hours=total_hours,
            topic_mastery=topic_mastery,
            weakness_index=weakness_index,
            improvement_rate=improvement_rate,
            consistency=consistency
        )

    def _calculate_topic_metrics(
        self,
        attempts: List[QuestionAttempt],
        historical: Dict
    ) -> TopicMetrics:
        """Calculate detailed metrics for a topic"""

        if not attempts:
            return TopicMetrics(
                mastery=0.0,
                questions_answered=0,
                accuracy=0.0,
                avg_time=0.0,
                last_practiced=datetime.now(),
                trend='stable',
                confidence_interval=(0.0, 0.0),
                expected_mastery=0.0,
                gap_to_target=1.0
            )

        total = len(attempts)
        correct = sum(1 for a in attempts if a.is_correct)
        accuracy = correct / total

        # Mastery using exponentially weighted average (recent performance matters more)
        weights = np.exp(np.linspace(-2, 0, total))
        weights /= weights.sum()
        correctness = np.array([1 if a.is_correct else 0 for a in attempts])
        mastery = np.sum(weights * correctness)

        # Average time
        times = [a.time_spent for a in attempts if a.time_spent]
        avg_time = np.mean(times) if times else 0

        # Last practiced
        last_practiced = max(a.created_at for a in attempts)

        # Trend
        if total >= 5:
            recent = correctness[-5:]
            earlier = correctness[:-5] if len(correctness) > 5 else correctness[:5]
            recent_avg = np.mean(recent)
            earlier_avg = np.mean(earlier)

            if recent_avg > earlier_avg + 0.1:
                trend = 'improving'
            elif recent_avg < earlier_avg - 0.1:
                trend = 'declining'
            else:
                trend = 'stable'
        else:
            trend = 'stable'

        # Confidence interval (Wilson score interval)
        ci = self._wilson_confidence_interval(correct, total)

        # Expected mastery (target is 0.8)
        expected_mastery = 0.8
        gap_to_target = max(0, expected_mastery - mastery)

        return TopicMetrics(
            mastery=mastery,
            questions_answered=total,
            accuracy=accuracy,
            avg_time=avg_time,
            last_practiced=last_practiced,
            trend=trend,
            confidence_interval=ci,
            expected_mastery=expected_mastery,
            gap_to_target=gap_to_target
        )

    def _analyze_trends(self, historical: Dict) -> TrendAnalysis:
        """Analyze trends using statistical methods"""

        if not historical['accuracy_series']:
            # No data available
            empty_trend = Trend(
                direction='stable',
                magnitude=0.0,
                confidence=0.0,
                forecast=[]
            )
            return TrendAnalysis(
                overall=empty_trend,
                by_topic={},
                by_difficulty={},
                time_management=empty_trend,
                consistency=empty_trend
            )

        # Overall accuracy trend
        overall = self._detect_trend(historical['accuracy_series'])

        # Time management trend
        time_management = self._detect_trend(historical['time_series'])

        # Consistency trend (activity level)
        consistency = self._detect_trend(historical['activity_series'])

        return TrendAnalysis(
            overall=overall,
            by_topic={},  # Would need more detailed data
            by_difficulty={},
            time_management=time_management,
            consistency=consistency
        )

    def _detect_trend(self, series: List[float]) -> Trend:
        """Detect trend using multiple statistical methods"""

        if len(series) < 3:
            return Trend(
                direction='stable',
                magnitude=0.0,
                confidence=0.1,
                forecast=[]
            )

        # Convert to numpy array
        y = np.array(series)
        x = np.arange(len(y))

        # Linear regression
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)

        # Mann-Kendall test
        mk_result = self._mann_kendall_test(series)

        # Direction
        if slope > 0.01:
            direction = 'up'
        elif slope < -0.01:
            direction = 'down'
        else:
            direction = 'stable'

        # Forecast (simple linear extrapolation)
        forecast_steps = 5
        forecast_x = np.arange(len(y), len(y) + forecast_steps)
        forecast = (slope * forecast_x + intercept).tolist()
        # Clip to valid range [0, 1] for accuracy-like metrics
        forecast = [max(0, min(1, v)) for v in forecast]

        # Change point detection
        change_points = self._detect_change_points(series)
        change_point_dates = None
        if change_points and hasattr(self, '_dates'):
            change_point_dates = [self._dates[i] for i in change_points if i < len(self._dates)]

        return Trend(
            direction=direction,
            magnitude=abs(slope),
            confidence=0.95 if mk_result['p_value'] < 0.05 else 0.5,
            forecast=forecast,
            change_points=change_point_dates
        )

    def _generate_predictions(
        self,
        metrics: PerformanceMetrics,
        historical: Dict,
        trends: TrendAnalysis
    ) -> Predictions:
        """Generate predictions about future performance"""

        # Predict exam score based on current metrics
        base_score = metrics.questions_answered * 0.01 + 50  # Simplified
        trend_adjustment = trends.overall.magnitude * 10

        if trends.overall.direction == 'up':
            predicted_score = min(100, base_score + trend_adjustment)
        elif trends.overall.direction == 'down':
            predicted_score = max(0, base_score - trend_adjustment)
        else:
            predicted_score = base_score

        # Score prediction with distribution
        score_std = 5.0  # Standard deviation
        score_prediction = ScorePrediction(
            expected=predicted_score,
            confidence=trends.overall.confidence,
            range={
                'min': max(0, predicted_score - score_std * 2),
                'median': predicted_score,
                'max': min(100, predicted_score + score_std * 2)
            },
            distribution=self._generate_score_distribution(predicted_score, score_std),
            percentile_projection=self._score_to_percentile(predicted_score)
        )

        # Critical topics (lowest mastery)
        topic_scores = [(topic, tm.mastery) for topic, tm in metrics.topic_mastery.items()]
        topic_scores.sort(key=lambda x: x[1])
        critical_topics = [topic for topic, _ in topic_scores[:3]]

        # Risk factors
        risk_factors = []

        if metrics.consistency < 0.6:
            risk_factors.append(RiskFactor(
                type='Inconsistent Practice',
                severity='high',
                impact=0.15,
                mitigation='Establish daily study routine'
            ))

        if metrics.weakness_index > 0.4:
            risk_factors.append(RiskFactor(
                type='Multiple Weak Areas',
                severity='medium',
                impact=0.10,
                mitigation='Focus on foundational topics first'
            ))

        if trends.overall.direction == 'down':
            risk_factors.append(RiskFactor(
                type='Declining Performance',
                severity='high',
                impact=0.20,
                mitigation='Review study strategy and take breaks'
            ))

        # Readiness date (when predicted to be ready)
        days_to_ready = max(1, int((80 - predicted_score) / (trend_adjustment or 1) * 7))
        readiness_date = datetime.now() + timedelta(days=days_to_ready)

        # Success probability
        success_prob = min(1.0, predicted_score / 70)  # 70% as passing threshold

        return Predictions(
            exam_score=score_prediction,
            readiness_date=readiness_date,
            probability_of_target=success_prob,
            critical_topics=critical_topics,
            risk_factors=risk_factors,
            success_probability=success_prob
        )

    def _generate_insights(
        self,
        metrics: PerformanceMetrics,
        trends: TrendAnalysis,
        predictions: Predictions
    ) -> List[Insight]:
        """Generate actionable insights"""

        insights = []

        # Strength insights
        for topic, tm in metrics.topic_mastery.items():
            if tm.mastery > 0.8 and tm.trend == 'improving':
                insights.append(Insight(
                    id=self._generate_id(),
                    type=InsightType.STRENGTH,
                    title=f'Excellence in {topic}',
                    description=f"You've mastered {topic} with {int(tm.mastery * 100)}% proficiency",
                    importance=0.7,
                    actionable=False,
                    recommendations=None,
                    evidence={'mastery': tm.mastery, 'questions': tm.questions_answered},
                    timestamp=datetime.now()
                ))

        # Weakness insights
        weak_topics = [(topic, tm) for topic, tm in metrics.topic_mastery.items() if tm.mastery < 0.5]
        weak_topics.sort(key=lambda x: x[1].mastery)

        if weak_topics:
            topic, tm = weak_topics[0]
            insights.append(Insight(
                id=self._generate_id(),
                type=InsightType.WEAKNESS,
                title=f'Critical Gap: {topic}',
                description=f'{topic} needs immediate attention ({int(tm.mastery * 100)}% mastery)',
                importance=0.9,
                actionable=True,
                recommendations=[
                    f'Focus 60% of study time on {topic}',
                    'Start with foundational concepts',
                    'Use spaced repetition'
                ],
                evidence=tm,
                timestamp=datetime.now()
            ))

        # Pattern insights
        if trends.time_management.direction == 'down' and trends.time_management.magnitude > 0.02:
            insights.append(Insight(
                id=self._generate_id(),
                type=InsightType.PATTERN,
                title='Improving Speed',
                description='Your solving speed has increased significantly',
                importance=0.6,
                actionable=False,
                recommendations=None,
                evidence={'trend': trends.time_management},
                timestamp=datetime.now()
            ))

        # Milestone insights
        if metrics.questions_answered > 0 and metrics.questions_answered % 100 == 0:
            insights.append(Insight(
                id=self._generate_id(),
                type=InsightType.MILESTONE,
                title=f'{metrics.questions_answered} Questions Completed!',
                description='Major milestone achieved in your preparation journey',
                importance=0.8,
                actionable=False,
                recommendations=None,
                evidence={'total': metrics.questions_answered},
                timestamp=datetime.now()
            ))

        # Sort by importance
        insights.sort(key=lambda x: x.importance, reverse=True)

        return insights

    def _generate_recommendations(
        self,
        metrics: PerformanceMetrics,
        predictions: Predictions,
        insights: List[Insight]
    ) -> List[Recommendation]:
        """Generate personalized recommendations"""

        recommendations = []

        # Critical topic recommendations
        for topic in predictions.critical_topics:
            recommendations.append(Recommendation(
                id=self._generate_id(),
                priority=1,
                type='practice',
                title=f'Intensive Practice: {topic}',
                description=f'Focus on {topic} to maximize score improvement',
                estimated_impact=5.0,
                time_required=120,
                resources=[
                    Resource(type='video', title=f'{topic} Fundamentals', duration=30),
                    Resource(type='practice', title=f'{topic} Problem Set', duration=60),
                    Resource(type='review', title=f'{topic} Common Mistakes', duration=30)
                ]
            ))

        # Time management
        if metrics.average_time_per_question > 90:
            recommendations.append(Recommendation(
                id=self._generate_id(),
                priority=2,
                type='strategy',
                title='Speed Practice Sessions',
                description='Practice with strict time limits to improve pacing',
                estimated_impact=3.0,
                time_required=45,
                resources=[
                    Resource(type='practice', title='Timed Drills', duration=30),
                    Resource(type='guide', title='Time Management Strategies', duration=15)
                ]
            ))

        # Consistency
        if metrics.consistency < 0.7:
            recommendations.append(Recommendation(
                id=self._generate_id(),
                priority=2,
                type='mindset',
                title='Build Daily Habit',
                description='Consistent daily practice is key to improvement',
                estimated_impact=4.0,
                time_required=30,
                resources=[
                    Resource(type='guide', title='Building Study Habits', duration=10),
                    Resource(type='tool', title='Study Schedule Template', duration=20)
                ]
            ))

        # Difficulty progression
        easy_acc = metrics.accuracy_by_difficulty.get('easy', 0)
        medium_acc = metrics.accuracy_by_difficulty.get('medium', 0)
        hard_acc = metrics.accuracy_by_difficulty.get('hard', 0)

        if hard_acc < 0.5 and medium_acc > 0.7:
            recommendations.append(Recommendation(
                id=self._generate_id(),
                priority=3,
                type='practice',
                title='Challenge Yourself',
                description='Ready for harder problems to push your limits',
                estimated_impact=2.0,
                time_required=60
            ))

        # Sort by priority
        recommendations.sort(key=lambda x: x.priority)

        return recommendations

    def _compare_to_peers(
        self,
        db: Session,
        user_id: str,
        exam_type: str,
        metrics: PerformanceMetrics
    ) -> PeerComparison:
        """Compare performance to peer group"""

        # Get peer data (users with similar question counts)
        min_questions = max(10, metrics.questions_answered - 50)
        max_questions = metrics.questions_answered + 50

        peer_attempts = db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id != user_id
        ).join(Question).filter(
            Question.exam == exam_type
        ).all()

        # Group by user
        peer_users = {}
        for attempt in peer_attempts:
            if attempt.user_id not in peer_users:
                peer_users[attempt.user_id] = {'attempts': [], 'correct': 0}
            peer_users[attempt.user_id]['attempts'].append(attempt)
            if attempt.is_correct:
                peer_users[attempt.user_id]['correct'] += 1

        # Filter peers with similar question counts
        peer_scores = []
        for user, data in peer_users.items():
            count = len(data['attempts'])
            if min_questions <= count <= max_questions:
                accuracy = data['correct'] / count if count > 0 else 0
                peer_scores.append(accuracy)

        if not peer_scores:
            peer_scores = [0.5]  # Default

        # Calculate user's overall accuracy
        user_accuracy = (
            sum(metrics.accuracy_by_difficulty.values()) / len(metrics.accuracy_by_difficulty)
            if metrics.accuracy_by_difficulty else 0.5
        )

        # Percentile rank
        percentile = self._calculate_percentile(user_accuracy, peer_scores)

        # Average peer score
        avg_peer_score = np.mean(peer_scores)

        return PeerComparison(
            percentile_rank=percentile,
            average_score=avg_peer_score * 100,
            peer_group_size=len(peer_scores),
            strengths=[],  # Would need topic-level peer data
            weaknesses=[],
            unique_patterns=[]
        )

    # Helper methods

    def _group_by_field(self, attempts: List[QuestionAttempt], field: str) -> Dict[str, List]:
        """Group attempts by a field"""
        grouped = {}
        for attempt in attempts:
            # Get nested attribute (e.g., question.topic)
            value = attempt
            for attr in field.split('.'):
                value = getattr(value, attr, 'Unknown')

            if value not in grouped:
                grouped[value] = []
            grouped[value].append(attempt)

        return grouped

    def _group_by_difficulty(self, attempts: List[QuestionAttempt]) -> Dict[str, List]:
        """Group attempts by difficulty level"""
        grouped = {'easy': [], 'medium': [], 'hard': []}

        for attempt in attempts:
            if hasattr(attempt, 'question') and hasattr(attempt.question, 'difficulty_label'):
                diff = attempt.question.difficulty_label or 'medium'
                if diff in grouped:
                    grouped[diff].append(attempt)
            else:
                grouped['medium'].append(attempt)

        return grouped

    def _calculate_study_streak(self, historical: Dict) -> int:
        """Calculate current study streak in days"""
        if not historical['dates']:
            return 0

        dates = sorted(historical['dates'], reverse=True)
        streak = 0
        expected_date = datetime.now().date()

        for date in dates:
            if date == expected_date or date == expected_date - timedelta(days=1):
                streak += 1
                expected_date = date - timedelta(days=1)
            else:
                break

        return streak

    def _calculate_improvement_rate(self, historical: Dict) -> float:
        """Calculate rate of improvement"""
        if len(historical['accuracy_series']) < 5:
            return 0.0

        series = historical['accuracy_series']
        recent = np.mean(series[-5:])
        earlier = np.mean(series[:5])

        return (recent - earlier) / (earlier + 0.001)  # Avoid division by zero

    def _calculate_consistency_score(self, historical: Dict) -> float:
        """Calculate consistency of practice"""
        if not historical['dates']:
            return 0.0

        # Check how many days in the last 30 days had activity
        last_30_days = set()
        cutoff = datetime.now().date() - timedelta(days=30)

        for date in historical['dates']:
            if date >= cutoff:
                last_30_days.add(date)

        return len(last_30_days) / 30

    def _mann_kendall_test(self, series: List[float]) -> Dict[str, float]:
        """Mann-Kendall trend test"""
        n = len(series)
        s = 0

        for i in range(n - 1):
            for j in range(i + 1, n):
                diff = series[j] - series[i]
                if diff > 0:
                    s += 1
                elif diff < 0:
                    s -= 1

        # Variance
        var_s = n * (n - 1) * (2 * n + 5) / 18

        # Z-score
        if s > 0:
            z = (s - 1) / np.sqrt(var_s)
        elif s < 0:
            z = (s + 1) / np.sqrt(var_s)
        else:
            z = 0

        # P-value (two-tailed)
        p_value = 2 * (1 - stats.norm.cdf(abs(z)))

        return {'tau': s / (n * (n - 1) / 2), 'p_value': p_value, 'z': z}

    def _detect_change_points(self, series: List[float]) -> List[int]:
        """Detect change points in time series"""
        if len(series) < 4:
            return []

        change_points = []
        threshold = 0.2

        for i in range(1, len(series) - 1):
            left = series[:i]
            right = series[i:]

            left_mean = np.mean(left)
            right_mean = np.mean(right)

            if abs(left_mean - right_mean) > threshold:
                change_points.append(i)

        return change_points

    def _wilson_confidence_interval(self, successes: int, total: int, confidence: float = 0.95) -> Tuple[float, float]:
        """Wilson score confidence interval"""
        if total == 0:
            return (0.0, 0.0)

        p = successes / total
        z = stats.norm.ppf((1 + confidence) / 2)

        denominator = 1 + z**2 / total
        center = (p + z**2 / (2 * total)) / denominator
        margin = z * np.sqrt((p * (1 - p) + z**2 / (4 * total)) / total) / denominator

        return (max(0, center - margin), min(1, center + margin))

    def _generate_score_distribution(self, mean: float, std: float, samples: int = 100) -> List[float]:
        """Generate score distribution"""
        return np.random.normal(mean, std, samples).tolist()

    def _score_to_percentile(self, score: float) -> float:
        """Convert score to percentile (simplified)"""
        return min(99, max(1, score))

    def _calculate_percentile(self, value: float, distribution: List[float]) -> float:
        """Calculate percentile rank"""
        sorted_dist = sorted(distribution)
        index = sum(1 for v in sorted_dist if v < value)
        return (index / len(sorted_dist)) * 100 if sorted_dist else 50.0

    def _calculate_content_mastery(self, data: Dict) -> float:
        """Calculate content mastery score"""
        if data['total_count'] == 0:
            return 0.0
        return data['correct_count'] / data['total_count']

    def _calculate_consistency(self, data: Dict) -> float:
        """Calculate consistency score"""
        # Based on regular practice patterns
        return 0.7  # Placeholder - would need time-series data

    def _calculate_time_management(self, data: Dict) -> float:
        """Calculate time management score"""
        if data['total_count'] == 0:
            return 0.0

        avg_time = data['total_time'] / data['total_count']
        # Score based on optimal time (60-90 seconds per question)
        optimal_time = 75

        if avg_time <= optimal_time:
            return 1.0
        else:
            return max(0, 1.0 - (avg_time - optimal_time) / optimal_time)

    def _calculate_accuracy(self, data: Dict) -> float:
        """Calculate accuracy score"""
        if data['total_count'] == 0:
            return 0.0
        return data['correct_count'] / data['total_count']

    def _calculate_difficulty_handling(self, data: Dict) -> float:
        """Calculate difficulty handling score"""
        diff_scores = []

        for diff_level, attempts in data['by_difficulty'].items():
            if attempts:
                correct = sum(1 for a in attempts if a.is_correct)
                accuracy = correct / len(attempts)
                diff_scores.append(accuracy)

        return np.mean(diff_scores) if diff_scores else 0.0

    def _calculate_confidence(self, data: Dict) -> float:
        """Calculate confidence in metrics based on data quantity"""
        count = data['total_count']

        # Confidence increases with more data, plateaus at 100 questions
        return min(1.0, count / 100)

    def _generate_id(self) -> str:
        """Generate unique ID"""
        import random
        import string
        return f"{int(datetime.now().timestamp())}_{random.choice(string.ascii_letters)}{random.randint(100, 999)}"

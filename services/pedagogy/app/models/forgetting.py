"""
EUREKA Pedagogical Intelligence Layer - Forgetting Curve

Implements Ebbinghaus forgetting curve and spaced repetition scheduling.

References:
- Ebbinghaus (1885) "Memory: A Contribution to Experimental Psychology"
- Wozniak & Gorzelanczyk (1994) "Optimization of repetition spacing in the practice of learning"
"""
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class ForgettingCurveModel:
    """
    Models memory retention and optimal review timing using forgetting curve.

    R(t) = e^(-t/S)
    Where:
    - R(t) = retention probability at time t
    - S = memory strength (increases with each successful review)
    - t = time since last review
    """

    def __init__(
        self,
        initial_strength: float = 1.0,
        decay_rate: float = 0.5,
        min_retention: float = 0.7,
    ):
        """
        Initialize forgetting curve model.

        Args:
            initial_strength: Initial memory strength
            decay_rate: Base decay rate
            min_retention: Minimum retention threshold for scheduling
        """
        self.initial_strength = initial_strength
        self.decay_rate = decay_rate
        self.min_retention = min_retention

    def retention_probability(
        self,
        time_since_review_days: float,
        memory_strength: float
    ) -> float:
        """
        Calculate retention probability.

        Args:
            time_since_review_days: Days since last review
            memory_strength: Current memory strength

        Returns:
            float: Retention probability (0-1)
        """
        # Exponential decay: R(t) = e^(-t/S)
        retention = np.exp(-time_since_review_days / memory_strength)
        return float(np.clip(retention, 0.0, 1.0))

    def update_strength(
        self,
        current_strength: float,
        was_correct: bool,
        difficulty_rating: Optional[int] = None
    ) -> float:
        """
        Update memory strength after review.

        Args:
            current_strength: Current memory strength
            was_correct: Whether the review was successful
            difficulty_rating: Subjective difficulty (1=easy, 5=hard)

        Returns:
            float: Updated memory strength
        """
        if was_correct:
            # Successful review: increase strength
            if difficulty_rating is not None:
                # Easier = bigger boost (inverse relationship)
                boost_factor = (6 - difficulty_rating) / 2.0  # 2.5 to 0.5
            else:
                boost_factor = 1.5

            new_strength = current_strength * boost_factor

        else:
            # Failed review: reset strength partially
            new_strength = max(self.initial_strength, current_strength * 0.3)

        return new_strength

    def next_review_date(
        self,
        last_review_date: datetime,
        memory_strength: float
    ) -> datetime:
        """
        Calculate optimal next review date.

        Args:
            last_review_date: Date of last review
            memory_strength: Current memory strength

        Returns:
            datetime: Optimal next review date
        """
        # Find time when retention drops to min_retention
        # R(t) = min_retention
        # e^(-t/S) = min_retention
        # -t/S = ln(min_retention)
        # t = -S * ln(min_retention)

        days_until_review = -memory_strength * np.log(self.min_retention)

        # Ensure minimum interval of 1 day
        days_until_review = max(1.0, days_until_review)

        next_review = last_review_date + timedelta(days=days_until_review)

        return next_review

    def calculate_urgency(
        self,
        last_review_date: datetime,
        memory_strength: float,
        current_date: Optional[datetime] = None
    ) -> float:
        """
        Calculate review urgency score.

        Args:
            last_review_date: Date of last review
            memory_strength: Current memory strength
            current_date: Current date (default: now)

        Returns:
            float: Urgency score (0-1, higher = more urgent)
        """
        if current_date is None:
            current_date = datetime.now()

        # Calculate current retention
        days_elapsed = (current_date - last_review_date).days
        retention = self.retention_probability(days_elapsed, memory_strength)

        # Urgency increases as retention drops
        urgency = 1.0 - retention

        return float(np.clip(urgency, 0.0, 1.0))


class SpacedRepetitionScheduler:
    """
    Schedules reviews using spaced repetition and forgetting curve.
    """

    def __init__(
        self,
        forgetting_model: Optional[ForgettingCurveModel] = None
    ):
        """
        Initialize scheduler.

        Args:
            forgetting_model: Forgetting curve model (default: create new)
        """
        self.forgetting_model = forgetting_model or ForgettingCurveModel()

        # Item states: {item_id: {'strength': float, 'last_review': datetime, 'review_count': int}}
        self.item_states: Dict[str, Dict] = {}

    def record_review(
        self,
        item_id: str,
        was_correct: bool,
        difficulty_rating: Optional[int] = None,
        review_date: Optional[datetime] = None
    ):
        """
        Record a review and update item state.

        Args:
            item_id: Item identifier
            was_correct: Whether the review was successful
            difficulty_rating: Subjective difficulty (1-5)
            review_date: Review date (default: now)
        """
        if review_date is None:
            review_date = datetime.now()

        # Get or initialize item state
        if item_id not in self.item_states:
            self.item_states[item_id] = {
                'strength': self.forgetting_model.initial_strength,
                'last_review': review_date,
                'review_count': 0
            }

        state = self.item_states[item_id]

        # Update strength
        new_strength = self.forgetting_model.update_strength(
            state['strength'],
            was_correct,
            difficulty_rating
        )

        # Update state
        state['strength'] = new_strength
        state['last_review'] = review_date
        state['review_count'] += 1

        logger.info(f"Item {item_id}: strength {state['strength']:.2f}, reviews {state['review_count']}")

    def get_due_items(
        self,
        current_date: Optional[datetime] = None,
        limit: Optional[int] = None
    ) -> List[Dict]:
        """
        Get items due for review.

        Args:
            current_date: Current date (default: now)
            limit: Maximum number of items to return

        Returns:
            List[Dict]: Items sorted by urgency (most urgent first)
        """
        if current_date is None:
            current_date = datetime.now()

        due_items = []

        for item_id, state in self.item_states.items():
            urgency = self.forgetting_model.calculate_urgency(
                state['last_review'],
                state['strength'],
                current_date
            )

            # Calculate next review date
            next_review = self.forgetting_model.next_review_date(
                state['last_review'],
                state['strength']
            )

            is_due = current_date >= next_review

            due_items.append({
                'item_id': item_id,
                'urgency': urgency,
                'next_review': next_review,
                'is_due': is_due,
                'strength': state['strength'],
                'review_count': state['review_count']
            })

        # Sort by urgency (descending)
        due_items.sort(key=lambda x: x['urgency'], reverse=True)

        if limit:
            due_items = due_items[:limit]

        return due_items

    def get_item_state(self, item_id: str) -> Optional[Dict]:
        """Get current state for an item"""
        return self.item_states.get(item_id)


# Example usage
if __name__ == "__main__":
    # Initialize scheduler
    scheduler = SpacedRepetitionScheduler()

    # Simulate reviews
    now = datetime.now()

    # Day 1: First review, correct
    scheduler.record_review("concept_1", was_correct=True, difficulty_rating=3, review_date=now)

    # Day 2: Second review, correct and easy
    scheduler.record_review("concept_1", was_correct=True, difficulty_rating=1,
                           review_date=now + timedelta(days=1))

    # Day 3: Third review, incorrect
    scheduler.record_review("concept_1", was_correct=False,
                           review_date=now + timedelta(days=2))

    # Check due items
    due_items = scheduler.get_due_items(current_date=now + timedelta(days=3))
    print(f"Due items: {len(due_items)}")

    for item in due_items:
        print(f"Item: {item['item_id']}, Urgency: {item['urgency']:.2f}, Due: {item['is_due']}")

"""
Unit tests for Forgetting Curve and Spaced Repetition
"""
import pytest
import numpy as np
from datetime import datetime, timedelta
from app.models.forgetting import ForgettingCurveModel, SpacedRepetitionScheduler


class TestForgettingCurveModel:
    """Test forgetting curve calculations"""

    @pytest.fixture
    def model(self):
        """Create model fixture"""
        return ForgettingCurveModel(
            initial_strength=1.0,
            decay_rate=0.5,
            min_retention=0.7
        )

    def test_retention_probability_decay(self, model):
        """Test retention decays over time"""
        memory_strength = 2.0

        # Retention should decrease as time passes
        retention_day1 = model.retention_probability(1.0, memory_strength)
        retention_day7 = model.retention_probability(7.0, memory_strength)

        assert retention_day1 > retention_day7
        assert 0 <= retention_day7 <= 1

    def test_retention_with_strong_memory(self, model):
        """Test stronger memory decays slower"""
        days = 5.0

        weak_strength = 1.0
        strong_strength = 5.0

        retention_weak = model.retention_probability(days, weak_strength)
        retention_strong = model.retention_probability(days, strong_strength)

        assert retention_strong > retention_weak

    def test_update_strength_correct_review(self, model):
        """Test strength increases after correct review"""
        current_strength = 2.0
        new_strength = model.update_strength(
            current_strength, was_correct=True, difficulty_rating=3
        )

        assert new_strength > current_strength

    def test_update_strength_easy_vs_hard(self, model):
        """Test easy items boost strength more than hard items"""
        current_strength = 2.0

        strength_easy = model.update_strength(
            current_strength, was_correct=True, difficulty_rating=1  # Easy
        )
        strength_hard = model.update_strength(
            current_strength, was_correct=True, difficulty_rating=5  # Hard
        )

        assert strength_easy > strength_hard

    def test_update_strength_incorrect_review(self, model):
        """Test strength decreases after incorrect review"""
        current_strength = 3.0
        new_strength = model.update_strength(
            current_strength, was_correct=False
        )

        assert new_strength < current_strength
        # Should not go below initial strength
        assert new_strength >= model.initial_strength * 0.3

    def test_next_review_date(self, model):
        """Test next review date calculation"""
        last_review = datetime(2025, 1, 1)
        memory_strength = 2.0

        next_review = model.next_review_date(last_review, memory_strength)

        assert next_review > last_review
        # Should be at least 1 day later
        assert (next_review - last_review).days >= 1

    def test_next_review_stronger_memory_longer_interval(self, model):
        """Test stronger memory leads to longer review interval"""
        last_review = datetime(2025, 1, 1)

        weak_strength = 1.0
        strong_strength = 5.0

        next_weak = model.next_review_date(last_review, weak_strength)
        next_strong = model.next_review_date(last_review, strong_strength)

        # Stronger memory → longer interval
        assert (next_strong - last_review) > (next_weak - last_review)

    def test_calculate_urgency(self, model):
        """Test urgency calculation"""
        last_review = datetime(2025, 1, 1)
        current_date = datetime(2025, 1, 3)  # 2 days later
        memory_strength = 1.0

        urgency = model.calculate_urgency(last_review, memory_strength, current_date)

        assert 0 <= urgency <= 1

    def test_urgency_increases_over_time(self, model):
        """Test urgency increases as time passes"""
        last_review = datetime(2025, 1, 1)
        memory_strength = 2.0

        urgency_day1 = model.calculate_urgency(
            last_review, memory_strength, datetime(2025, 1, 2)
        )
        urgency_day7 = model.calculate_urgency(
            last_review, memory_strength, datetime(2025, 1, 8)
        )

        assert urgency_day7 > urgency_day1


class TestSpacedRepetitionScheduler:
    """Test spaced repetition scheduler"""

    @pytest.fixture
    def scheduler(self):
        """Create scheduler fixture"""
        return SpacedRepetitionScheduler()

    def test_initialization(self, scheduler):
        """Test scheduler initializes correctly"""
        assert scheduler.forgetting_model is not None
        assert isinstance(scheduler.item_states, dict)
        assert len(scheduler.item_states) == 0

    def test_record_review_creates_state(self, scheduler):
        """Test recording review creates item state"""
        item_id = "concept_1"
        scheduler.record_review(item_id, was_correct=True)

        assert item_id in scheduler.item_states
        state = scheduler.item_states[item_id]
        assert 'strength' in state
        assert 'last_review' in state
        assert 'review_count' in state
        assert state['review_count'] == 1

    def test_record_review_updates_state(self, scheduler):
        """Test recording multiple reviews updates state"""
        item_id = "concept_1"

        # First review
        scheduler.record_review(item_id, was_correct=True, difficulty_rating=3)
        strength_1 = scheduler.item_states[item_id]['strength']

        # Second review
        scheduler.record_review(item_id, was_correct=True, difficulty_rating=1)
        strength_2 = scheduler.item_states[item_id]['strength']

        # Strength should increase
        assert strength_2 > strength_1
        # Review count should be 2
        assert scheduler.item_states[item_id]['review_count'] == 2

    def test_record_review_incorrect_decreases_strength(self, scheduler):
        """Test incorrect review decreases strength"""
        item_id = "concept_1"

        # Build up strength
        scheduler.record_review(item_id, was_correct=True)
        scheduler.record_review(item_id, was_correct=True)
        strength_before = scheduler.item_states[item_id]['strength']

        # Incorrect review
        scheduler.record_review(item_id, was_correct=False)
        strength_after = scheduler.item_states[item_id]['strength']

        assert strength_after < strength_before

    def test_get_due_items_empty(self, scheduler):
        """Test getting due items when none exist"""
        due_items = scheduler.get_due_items()

        assert isinstance(due_items, list)
        assert len(due_items) == 0

    def test_get_due_items_sorting(self, scheduler):
        """Test due items are sorted by urgency"""
        now = datetime.now()

        # Create items with different review dates
        scheduler.record_review("item_1", True, review_date=now - timedelta(days=10))
        scheduler.record_review("item_2", True, review_date=now - timedelta(days=1))
        scheduler.record_review("item_3", True, review_date=now - timedelta(days=5))

        due_items = scheduler.get_due_items(current_date=now)

        # Should be sorted by urgency (descending)
        assert len(due_items) == 3
        for i in range(len(due_items) - 1):
            assert due_items[i]['urgency'] >= due_items[i+1]['urgency']

    def test_get_due_items_with_limit(self, scheduler):
        """Test limiting number of due items"""
        now = datetime.now()

        # Create 5 items
        for i in range(5):
            scheduler.record_review(f"item_{i}", True, review_date=now - timedelta(days=i+1))

        due_items = scheduler.get_due_items(current_date=now, limit=3)

        assert len(due_items) == 3

    def test_get_item_state(self, scheduler):
        """Test retrieving item state"""
        item_id = "concept_x"
        scheduler.record_review(item_id, was_correct=True)

        state = scheduler.get_item_state(item_id)

        assert state is not None
        assert state['strength'] > 0
        assert state['review_count'] == 1

    def test_get_item_state_nonexistent(self, scheduler):
        """Test retrieving state for non-existent item"""
        state = scheduler.get_item_state("nonexistent")

        assert state is None


class TestSpacedRepetitionIntegration:
    """Integration tests for spaced repetition workflow"""

    def test_learning_progression(self):
        """Test complete learning progression with multiple reviews"""
        scheduler = SpacedRepetitionScheduler()
        item_id = "algebra_quadratics"
        now = datetime(2025, 1, 1)

        # Day 1: First exposure, gets it correct
        scheduler.record_review(item_id, was_correct=True, difficulty_rating=4, review_date=now)
        state_day1 = scheduler.get_item_state(item_id)

        # Day 3: Review, gets it correct and easier
        scheduler.record_review(
            item_id, was_correct=True, difficulty_rating=2,
            review_date=now + timedelta(days=2)
        )
        state_day3 = scheduler.get_item_state(item_id)

        # Day 10: Review, gets it correct and very easy
        scheduler.record_review(
            item_id, was_correct=True, difficulty_rating=1,
            review_date=now + timedelta(days=9)
        )
        state_day10 = scheduler.get_item_state(item_id)

        # Strength should increase over successful reviews
        assert state_day3['strength'] > state_day1['strength']
        assert state_day10['strength'] > state_day3['strength']

        # Review count should be 3
        assert state_day10['review_count'] == 3

    def test_forgetting_and_relearning(self):
        """Test forgetting after incorrect review and relearning"""
        scheduler = SpacedRepetitionScheduler()
        item_id = "calc_derivatives"
        now = datetime(2025, 1, 1)

        # Initial learning
        scheduler.record_review(item_id, was_correct=True, review_date=now)
        scheduler.record_review(item_id, was_correct=True, review_date=now + timedelta(days=1))
        strength_learned = scheduler.get_item_state(item_id)['strength']

        # Forgot it
        scheduler.record_review(item_id, was_correct=False, review_date=now + timedelta(days=10))
        strength_forgotten = scheduler.get_item_state(item_id)['strength']

        # Relearn
        scheduler.record_review(item_id, was_correct=True, review_date=now + timedelta(days=11))
        scheduler.record_review(item_id, was_correct=True, review_date=now + timedelta(days=12))
        strength_relearned = scheduler.get_item_state(item_id)['strength']

        # Strength should drop after incorrect, then rebuild
        assert strength_forgotten < strength_learned
        assert strength_relearned > strength_forgotten

    def test_adaptive_scheduling(self):
        """Test scheduler adapts intervals based on performance"""
        scheduler = SpacedRepetitionScheduler()
        now = datetime(2025, 1, 1)

        # Easy item: should get longer intervals
        easy_item = "easy_concept"
        scheduler.record_review(easy_item, True, difficulty_rating=1, review_date=now)
        scheduler.record_review(easy_item, True, difficulty_rating=1, review_date=now + timedelta(days=1))

        # Hard item: should get shorter intervals
        hard_item = "hard_concept"
        scheduler.record_review(hard_item, True, difficulty_rating=5, review_date=now)
        scheduler.record_review(hard_item, True, difficulty_rating=5, review_date=now + timedelta(days=1))

        # Check next review dates
        due_items = scheduler.get_due_items(current_date=now + timedelta(days=2))

        easy_state = scheduler.get_item_state(easy_item)
        hard_state = scheduler.get_item_state(hard_item)

        # Easy item should have higher strength (longer interval)
        assert easy_state['strength'] > hard_state['strength']

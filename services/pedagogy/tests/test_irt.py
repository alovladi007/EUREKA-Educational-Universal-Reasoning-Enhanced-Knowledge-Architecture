"""
Unit tests for Item Response Theory (IRT) models
"""
import pytest
import numpy as np
from app.models.irt import IRTModel


class TestIRTModel:
    """Test IRT model implementations"""

    @pytest.fixture
    def model_2pl(self):
        """Create 2PL model fixture"""
        return IRTModel(model_type="2PL")

    @pytest.fixture
    def model_3pl(self):
        """Create 3PL model fixture"""
        return IRTModel(model_type="3PL")

    def test_model_initialization(self):
        """Test model initializes with correct type"""
        model = IRTModel(model_type="2PL")
        assert model.model_type == "2PL"
        assert model.cold_start_prior == 0.0

    def test_invalid_model_type(self):
        """Test invalid model type raises error"""
        with pytest.raises(ValueError):
            IRTModel(model_type="4PL")

    def test_probability_2pl(self, model_2pl):
        """Test 2PL probability calculation"""
        # Set item parameters
        item_id = 0
        model_2pl.item_params[item_id] = {'a': 1.5, 'b': 0.5, 'c': 0.0}

        # Calculate probability for different abilities
        theta_low = -2.0
        theta_high = 2.0

        prob_low = model_2pl.probability(theta_low, item_id)
        prob_high = model_2pl.probability(theta_high, item_id)

        # Higher ability should have higher probability
        assert prob_high > prob_low
        # Probabilities should be valid
        assert 0 <= prob_low <= 1
        assert 0 <= prob_high <= 1

    def test_probability_3pl(self, model_3pl):
        """Test 3PL probability with guessing parameter"""
        item_id = 0
        c = 0.25  # Guessing parameter
        model_3pl.item_params[item_id] = {'a': 1.0, 'b': 0.0, 'c': c}

        # Very low ability should still have probability ≥ c (guessing)
        theta_very_low = -10.0
        prob = model_3pl.probability(theta_very_low, item_id)

        assert prob >= c
        assert prob <= 1.0

    def test_estimate_ability_empty_responses(self, model_2pl):
        """Test ability estimation with no responses uses prior"""
        learner_id = "learner_1"
        responses = []

        theta = model_2pl.estimate_ability(learner_id, responses)

        assert theta == model_2pl.cold_start_prior

    def test_estimate_ability_convergence(self, model_2pl):
        """Test ability estimation converges"""
        # Set up items
        model_2pl.item_params = {
            0: {'a': 1.0, 'b': -1.0, 'c': 0.0},  # Easy
            1: {'a': 1.0, 'b': 0.0, 'c': 0.0},   # Medium
            2: {'a': 1.0, 'b': 1.0, 'c': 0.0},   # Hard
        }

        learner_id = "learner_2"

        # High performer: gets most items correct
        responses_high = [
            {'item_id': 0, 'is_correct': True},
            {'item_id': 1, 'is_correct': True},
            {'item_id': 2, 'is_correct': True},
        ]

        # Low performer: gets most items incorrect
        responses_low = [
            {'item_id': 0, 'is_correct': False},
            {'item_id': 1, 'is_correct': False},
            {'item_id': 2, 'is_correct': False},
        ]

        theta_high = model_2pl.estimate_ability("high", responses_high)
        theta_low = model_2pl.estimate_ability("low", responses_low)

        # High performer should have higher ability
        assert theta_high > theta_low

    def test_estimate_ability_mle_vs_map(self, model_2pl):
        """Test MLE vs MAP estimation"""
        model_2pl.item_params = {
            0: {'a': 1.0, 'b': 0.0, 'c': 0.0},
        }

        responses = [
            {'item_id': 0, 'is_correct': True},
        ]

        theta_mle = model_2pl.estimate_ability("learner_mle", responses, method="MLE")
        theta_map = model_2pl.estimate_ability("learner_map", responses, method="MAP")

        # MAP should be closer to prior (0.0) than MLE
        assert abs(theta_map) <= abs(theta_mle) or np.isclose(theta_map, theta_mle)

    def test_calibrate_items_2pl(self, model_2pl):
        """Test item calibration for 2PL"""
        # Synthetic data
        response_data = [
            {'learner_id': 'l1', 'item_id': 0, 'is_correct': True, 'theta': 1.0},
            {'learner_id': 'l2', 'item_id': 0, 'is_correct': True, 'theta': 0.5},
            {'learner_id': 'l3', 'item_id': 0, 'is_correct': False, 'theta': -1.0},
            {'learner_id': 'l4', 'item_id': 0, 'is_correct': False, 'theta': -0.5},
        ]

        params = model_2pl.calibrate_items(response_data)

        assert 0 in params
        assert 'a' in params[0]
        assert 'b' in params[0]
        # Discrimination should be positive
        assert params[0]['a'] > 0
        # Difficulty should be reasonable
        assert -3 <= params[0]['b'] <= 3

    def test_cold_start_predict(self, model_2pl):
        """Test cold-start prediction"""
        item_id = 0
        model_2pl.item_params[item_id] = {'a': 1.0, 'b': 0.0, 'c': 0.0}

        prob = model_2pl.cold_start_predict(item_id, prior_ability=0.0)

        # At θ=0, b=0, 2PL should give P=0.5
        assert 0.4 <= prob <= 0.6

    def test_get_ability(self, model_2pl):
        """Test retrieving stored ability"""
        learner_id = "learner_x"
        model_2pl.learner_abilities[learner_id] = 1.5

        ability = model_2pl.get_ability(learner_id)
        assert ability == 1.5

        # Non-existent learner should return prior
        ability_new = model_2pl.get_ability("new_learner")
        assert ability_new == model_2pl.cold_start_prior


class TestIRTModelsComparison:
    """Test differences between 1PL, 2PL, 3PL models"""

    def test_1pl_fixed_discrimination(self):
        """Test 1PL has fixed discrimination a=1"""
        model = IRTModel(model_type="1PL")
        model.item_params[0] = {'a': 1.5, 'b': 0.0, 'c': 0.0}

        # 1PL should ignore 'a' parameter and use a=1
        theta = 1.0
        prob_1pl = model.probability(theta, 0)

        # Compare with 2PL using a=1
        model_2pl = IRTModel(model_type="2PL")
        model_2pl.item_params[0] = {'a': 1.0, 'b': 0.0, 'c': 0.0}
        prob_2pl = model_2pl.probability(theta, 0)

        # Should be approximately equal
        assert np.isclose(prob_1pl, prob_2pl, atol=0.01)

    def test_3pl_guessing_floor(self):
        """Test 3PL has guessing floor"""
        model = IRTModel(model_type="3PL")
        c = 0.2
        model.item_params[0] = {'a': 1.0, 'b': 0.0, 'c': c}

        # Even at very low ability, probability should be >= c
        theta_very_low = -100.0
        prob = model.probability(theta_very_low, 0)

        assert prob >= c


class TestIRTIntegration:
    """Integration tests for IRT workflow"""

    def test_adaptive_testing_workflow(self):
        """Test adaptive testing: estimate ability, select next item"""
        model = IRTModel(model_type="2PL")

        # Set up item bank
        model.item_params = {
            0: {'a': 1.0, 'b': -1.0, 'c': 0.0},  # Easy
            1: {'a': 1.0, 'b': 0.0, 'c': 0.0},   # Medium
            2: {'a': 1.0, 'b': 1.0, 'c': 0.0},   # Hard
        }

        learner_id = "adaptive_learner"
        responses = []

        # Simulate adaptive test
        for item_id in [0, 1, 2]:
            # Get current ability estimate
            theta = model.estimate_ability(learner_id, responses) if responses else 0.0

            # Predict probability
            prob = model.probability(theta, item_id)

            # Simulate response (use probability)
            is_correct = np.random.rand() < prob

            responses.append({'item_id': item_id, 'is_correct': is_correct})

        # Final ability estimate
        final_theta = model.estimate_ability(learner_id, responses)

        # Should have a valid ability estimate
        assert -3 <= final_theta <= 3
        assert learner_id in model.learner_abilities

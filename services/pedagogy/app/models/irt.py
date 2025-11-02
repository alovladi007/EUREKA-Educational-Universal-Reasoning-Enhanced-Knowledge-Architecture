"""
EUREKA Pedagogical Intelligence Layer - Item Response Theory (IRT)

Implements 2PL and 3PL IRT models for estimating:
- Learner ability (θ)
- Item difficulty (b)
- Item discrimination (a)
- Item guessing (c) - for 3PL

References:
- Lord (1980) "Applications of Item Response Theory"
- Embretson & Reise (2000) "Item Response Theory for Psychologists"
"""
import numpy as np
from scipy.optimize import minimize
from scipy.special import expit  # Logistic sigmoid
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class IRTModel:
    """
    Base class for IRT models.
    """

    def __init__(self, model_type: str = "2PL"):
        """
        Initialize IRT model.

        Args:
            model_type: "1PL", "2PL", or "3PL"
        """
        if model_type not in ["1PL", "2PL", "3PL"]:
            raise ValueError(f"Invalid model type: {model_type}. Must be 1PL, 2PL, or 3PL")

        self.model_type = model_type

        # Item parameters: {item_id: {'a': discrimination, 'b': difficulty, 'c': guessing}}
        self.item_params: Dict[int, Dict[str, float]] = {}

        # Learner abilities: {learner_id: theta}
        self.learner_abilities: Dict[str, float] = {}

        # Cold-start prior for new learners
        self.cold_start_prior = 0.0  # Mean ability

    def probability(
        self,
        theta: float,
        item_id: int
    ) -> float:
        """
        Calculate probability of correct response using IRT model.

        Args:
            theta: Learner ability
            item_id: Item ID

        Returns:
            float: Probability of correctness (0-1)
        """
        if item_id not in self.item_params:
            logger.warning(f"Item {item_id} not found, using default parameters")
            params = {'a': 1.0, 'b': 0.0, 'c': 0.0}
        else:
            params = self.item_params[item_id]

        a = params.get('a', 1.0)  # Discrimination
        b = params.get('b', 0.0)  # Difficulty
        c = params.get('c', 0.0)  # Guessing

        if self.model_type == "1PL":
            # Rasch model: P(θ) = exp(θ - b) / (1 + exp(θ - b))
            prob = expit(theta - b)

        elif self.model_type == "2PL":
            # 2PL: P(θ) = exp(a(θ - b)) / (1 + exp(a(θ - b)))
            prob = expit(a * (theta - b))

        elif self.model_type == "3PL":
            # 3PL: P(θ) = c + (1 - c) * exp(a(θ - b)) / (1 + exp(a(θ - b)))
            prob = c + (1 - c) * expit(a * (theta - b))

        return prob

    def estimate_ability(
        self,
        learner_id: str,
        responses: List[Dict],
        method: str = "MLE"
    ) -> float:
        """
        Estimate learner ability given response pattern.

        Args:
            learner_id: Learner ID
            responses: List of {item_id, is_correct} dicts
            method: Estimation method ("MLE" or "MAP")

        Returns:
            float: Estimated ability (theta)
        """
        if not responses:
            return self.cold_start_prior

        def neg_log_likelihood(theta: float) -> float:
            """Negative log-likelihood for optimization"""
            nll = 0.0
            for response in responses:
                item_id = response['item_id']
                is_correct = response['is_correct']

                prob = self.probability(theta, item_id)

                # Avoid log(0)
                prob = np.clip(prob, 1e-10, 1 - 1e-10)

                if is_correct:
                    nll -= np.log(prob)
                else:
                    nll -= np.log(1 - prob)

            # MAP: add prior (assume N(0, 1))
            if method == "MAP":
                nll += 0.5 * theta ** 2

            return nll

        # Optimize
        result = minimize(
            neg_log_likelihood,
            x0=self.cold_start_prior,
            method='BFGS',
            options={'disp': False}
        )

        theta_est = result.x[0]

        # Update stored ability
        self.learner_abilities[learner_id] = theta_est

        return theta_est

    def calibrate_items(
        self,
        response_data: List[Dict]
    ) -> Dict[int, Dict[str, float]]:
        """
        Calibrate item parameters from response data.

        Args:
            response_data: List of {learner_id, item_id, is_correct, theta} dicts

        Returns:
            dict: Calibrated item parameters
        """
        # Group responses by item
        item_responses: Dict[int, List] = {}
        for response in response_data:
            item_id = response['item_id']
            if item_id not in item_responses:
                item_responses[item_id] = []
            item_responses[item_id].append(response)

        # Calibrate each item
        for item_id, responses in item_responses.items():
            if self.model_type == "1PL":
                # Estimate difficulty only
                params = self._calibrate_1pl(responses)
            elif self.model_type == "2PL":
                # Estimate difficulty and discrimination
                params = self._calibrate_2pl(responses)
            elif self.model_type == "3PL":
                # Estimate difficulty, discrimination, and guessing
                params = self._calibrate_3pl(responses)

            self.item_params[item_id] = params

        return self.item_params

    def _calibrate_2pl(self, responses: List[Dict]) -> Dict[str, float]:
        """Calibrate 2PL parameters"""

        def neg_log_likelihood(params: np.ndarray) -> float:
            a, b = params
            nll = 0.0
            for response in responses:
                theta = response.get('theta', 0.0)
                is_correct = response['is_correct']

                prob = expit(a * (theta - b))
                prob = np.clip(prob, 1e-10, 1 - 1e-10)

                if is_correct:
                    nll -= np.log(prob)
                else:
                    nll -= np.log(1 - prob)

            return nll

        # Optimize
        result = minimize(
            neg_log_likelihood,
            x0=[1.0, 0.0],  # Initial: a=1, b=0
            method='L-BFGS-B',
            bounds=[(0.1, 3.0), (-3.0, 3.0)],  # Reasonable bounds
            options={'disp': False}
        )

        a_est, b_est = result.x

        return {'a': a_est, 'b': b_est, 'c': 0.0}

    def _calibrate_1pl(self, responses: List[Dict]) -> Dict[str, float]:
        """Calibrate 1PL (Rasch) parameters"""
        # Fix a=1, estimate b only
        params = self._calibrate_2pl(responses)
        params['a'] = 1.0
        return params

    def _calibrate_3pl(self, responses: List[Dict]) -> Dict[str, float]:
        """Calibrate 3PL parameters"""

        def neg_log_likelihood(params: np.ndarray) -> float:
            a, b, c = params
            nll = 0.0
            for response in responses:
                theta = response.get('theta', 0.0)
                is_correct = response['is_correct']

                prob = c + (1 - c) * expit(a * (theta - b))
                prob = np.clip(prob, 1e-10, 1 - 1e-10)

                if is_correct:
                    nll -= np.log(prob)
                else:
                    nll -= np.log(1 - prob)

            return nll

        # Optimize
        result = minimize(
            neg_log_likelihood,
            x0=[1.0, 0.0, 0.2],  # Initial: a=1, b=0, c=0.2
            method='L-BFGS-B',
            bounds=[(0.1, 3.0), (-3.0, 3.0), (0.0, 0.35)],  # Guessing < 0.35
            options={'disp': False}
        )

        a_est, b_est, c_est = result.x

        return {'a': a_est, 'b': b_est, 'c': c_est}

    def get_ability(self, learner_id: str) -> float:
        """Get estimated ability for a learner"""
        return self.learner_abilities.get(learner_id, self.cold_start_prior)

    def cold_start_predict(
        self,
        item_id: int,
        prior_ability: float = 0.0
    ) -> float:
        """
        Predict for a new learner with no history (cold start).

        Args:
            item_id: Item ID
            prior_ability: Prior belief about ability (default 0.0 = average)

        Returns:
            float: Probability of correctness
        """
        return self.probability(prior_ability, item_id)


# Example usage
if __name__ == "__main__":
    # Initialize 2PL model
    model = IRTModel(model_type="2PL")

    # Set item parameters
    model.item_params = {
        0: {'a': 1.5, 'b': 0.5, 'c': 0.0},  # Moderately discriminating, slightly difficult
        1: {'a': 0.8, 'b': -0.5, 'c': 0.0},  # Less discriminating, easier
        2: {'a': 2.0, 'b': 1.0, 'c': 0.0},  # Highly discriminating, difficult
    }

    # Estimate ability for a learner
    responses = [
        {'item_id': 0, 'is_correct': True},
        {'item_id': 1, 'is_correct': True},
        {'item_id': 2, 'is_correct': False},
    ]

    theta = model.estimate_ability("learner_1", responses)
    print(f"Estimated ability: {theta:.3f}")

    # Predict next item
    prob = model.probability(theta, item_id=2)
    print(f"Probability of correctness for item 2: {prob:.3f}")

    # Cold start prediction
    cold_prob = model.cold_start_predict(item_id=0)
    print(f"Cold start probability for item 0: {cold_prob:.3f}")

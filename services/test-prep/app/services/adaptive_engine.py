"""
EUREKA Test Prep - Advanced IRT Adaptive Engine
Implements 3PL Item Response Theory with Bayesian ability estimation

Ported from TypeScript adaptive-engine.ts with full implementation
"""
import math
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
import numpy as np


@dataclass
class IRTParameters:
    """Item Response Theory parameters for 3PL model"""
    a: float  # Discrimination parameter
    b: float  # Difficulty parameter
    c: float  # Guessing parameter


@dataclass
class ResponseHistory:
    """Record of a student's response to an item"""
    item_id: str
    response: bool  # True if correct, False if incorrect
    irt_params: IRTParameters
    time_spent: int  # seconds
    topic: str


@dataclass
class AdaptiveState:
    """Current state of an adaptive testing session"""
    theta: float  # Ability estimate
    theta_se: float  # Standard error of ability estimate
    responses: List[ResponseHistory]
    information: List[float]  # Fisher information history
    questions_answered: int


class AdaptiveEngine:
    """
    Advanced adaptive testing engine using Item Response Theory

    Features:
    - 3-Parameter Logistic (3PL) model
    - Bayesian ability estimation using Expected A Posteriori (EAP)
    - Maximum Fisher Information item selection
    - Content balancing
    - Stopping criteria based on SE convergence
    """

    MIN_THETA = -3.0
    MAX_THETA = 3.0
    D = 1.7  # Scaling constant for logistic model

    def __init__(self):
        """Initialize the adaptive engine"""
        self.convergence_criterion = 0.3  # Stop when SE < 0.3
        self.min_questions = 20
        self.max_questions = 50

    def calculate_probability(self, theta: float, params: IRTParameters) -> float:
        """
        Calculate probability of correct response using 3PL model

        P(θ) = c + (1 - c) / (1 + exp(-D * a * (θ - b)))

        Args:
            theta: Ability level
            params: Item parameters (a, b, c)

        Returns:
            Probability of correct response (0 to 1)
        """
        a, b, c = params.a, params.b, params.c

        # Logistic function
        exponent = self.D * a * (theta - b)

        # Prevent overflow
        if exponent > 100:
            exp_term = math.exp(100)
        elif exponent < -100:
            exp_term = math.exp(-100)
        else:
            exp_term = math.exp(exponent)

        # 3PL model
        probability = c + (1 - c) / (1 + 1 / exp_term)

        return max(0.0, min(1.0, probability))

    def calculate_information(self, theta: float, params: IRTParameters) -> float:
        """
        Calculate Fisher Information for an item at given ability level

        I(θ) = (a² * Q * (P - c)²) / (P * (1 - c)²)

        where P = P(correct|θ), Q = 1 - P

        Args:
            theta: Ability level
            params: Item parameters

        Returns:
            Fisher information value
        """
        a, c = params.a, params.c
        P = self.calculate_probability(theta, params)
        Q = 1 - P

        # Prevent division by zero
        if P < 0.001 or (1 - c) < 0.001:
            return 0.0

        numerator = (a ** 2) * Q * ((P - c) ** 2)
        denominator = P * ((1 - c) ** 2)

        information = numerator / denominator

        return max(0.0, information)

    def select_next_question(
        self,
        state: AdaptiveState,
        item_bank: List[Dict]
    ) -> Optional[Dict]:
        """
        Select next question using Maximum Fisher Information with content balancing

        Args:
            state: Current adaptive state
            item_bank: Available questions

        Returns:
            Selected item or None if no suitable items
        """
        current_theta = state.theta
        max_info = -1.0
        selected_item = None

        # Get already answered item IDs
        answered_ids = {r.item_id for r in state.responses}

        for item in item_bank:
            # Skip already answered items
            if item['id'] in answered_ids:
                continue

            # Calculate Fisher Information at current ability
            params = IRTParameters(
                a=item.get('irt_a', 1.0),
                b=item.get('irt_b', 0.0),
                c=item.get('irt_c', 0.25)
            )

            info = self.calculate_information(current_theta, params)

            # Apply content balancing weight
            topic = item.get('topic', 'General')
            topic_weight = self._calculate_topic_weight(topic, state)
            weighted_info = info * topic_weight

            if weighted_info > max_info:
                max_info = weighted_info
                selected_item = item

        return selected_item

    def update_theta(
        self,
        state: AdaptiveState,
        response: bool,
        item_params: IRTParameters,
        item_id: str = "",
        topic: str = "General",
        time_spent: int = 0
    ) -> AdaptiveState:
        """
        Update ability estimate using Expected A Posteriori (EAP) method

        Uses Bayesian quadrature integration:
        θ_EAP = ∫ θ * L(θ) * π(θ) dθ / ∫ L(θ) * π(θ) dθ

        Args:
            state: Current state
            response: True if correct, False if incorrect
            item_params: Parameters of the answered item
            item_id: ID of the item
            topic: Topic of the item
            time_spent: Time spent in seconds

        Returns:
            Updated adaptive state
        """
        # Generate quadrature grid
        grid_points = 61
        theta_grid = self._generate_quadrature_grid(grid_points)

        # Prior: Normal(0, 1)
        prior = np.array([self._normal_pdf(theta, 0, 1) for theta in theta_grid])

        # Likelihood for all responses
        likelihood = np.ones(grid_points)

        # Include all previous responses
        for resp in state.responses:
            for i, theta in enumerate(theta_grid):
                P = self.calculate_probability(theta, resp.irt_params)
                likelihood[i] *= P if resp.response else (1 - P)

        # Include current response
        for i, theta in enumerate(theta_grid):
            P = self.calculate_probability(theta, item_params)
            likelihood[i] *= P if response else (1 - P)

        # Posterior = Prior × Likelihood
        posterior = prior * likelihood
        posterior_sum = np.sum(posterior)

        if posterior_sum == 0:
            # Fallback if numerical issues
            new_theta = state.theta + (0.2 if response else -0.2)
            new_se = state.theta_se
        else:
            # Normalize posterior
            normalized_posterior = posterior / posterior_sum

            # EAP estimate
            new_theta = np.sum(theta_grid * normalized_posterior)

            # Standard Error (posterior SD)
            variance = np.sum(((theta_grid - new_theta) ** 2) * normalized_posterior)
            new_se = math.sqrt(variance)

        # Constrain theta to reasonable range
        new_theta = max(self.MIN_THETA, min(self.MAX_THETA, new_theta))

        # Calculate information for this response
        info = self.calculate_information(new_theta, item_params)

        # Update state
        new_responses = state.responses + [
            ResponseHistory(
                item_id=item_id,
                response=response,
                irt_params=item_params,
                time_spent=time_spent,
                topic=topic
            )
        ]

        new_state = AdaptiveState(
            theta=new_theta,
            theta_se=new_se,
            responses=new_responses,
            information=state.information + [info],
            questions_answered=state.questions_answered + 1
        )

        return new_state

    def should_stop(self, state: AdaptiveState) -> bool:
        """
        Determine if testing should stop based on criteria

        Stops if:
        - Standard error < convergence criterion AND min questions reached
        - Maximum questions reached

        Args:
            state: Current adaptive state

        Returns:
            True if should stop, False otherwise
        """
        # Must answer minimum questions
        if state.questions_answered < self.min_questions:
            return False

        # Stop if SE converged
        if state.theta_se < self.convergence_criterion:
            return True

        # Stop if max questions reached
        if state.questions_answered >= self.max_questions:
            return True

        return False

    def calculate_mastery(
        self,
        responses: List[ResponseHistory],
        topic: str
    ) -> float:
        """
        Calculate mastery probability for a topic using Bayesian Knowledge Tracing

        BKT model parameters:
        - P(L): Probability already learned
        - P(T): Probability of learning (transit)
        - P(G): Probability of guess
        - P(S): Probability of slip

        Args:
            responses: All response history
            topic: Topic to calculate mastery for

        Returns:
            Probability of mastery (0 to 1)
        """
        # BKT parameters
        p_L = 0.1  # Prior knowledge
        p_T = 0.1  # Learning rate
        p_G = 0.25  # Guess rate
        p_S = 0.1  # Slip rate

        # Filter responses for this topic
        topic_responses = [r for r in responses if r.topic == topic]

        if not topic_responses:
            return p_L

        for resp in topic_responses:
            # P(correct) = P(L) * (1 - P(S)) + (1 - P(L)) * P(G)
            p_correct = p_L * (1 - p_S) + (1 - p_L) * p_G

            if resp.response:
                # Update after correct response
                if p_correct > 0:
                    p_L = (p_L * (1 - p_S)) / p_correct
            else:
                # Update after incorrect response
                if (1 - p_correct) > 0:
                    p_L = (p_L * p_S) / (1 - p_correct)

            # Learning transition
            p_L = p_L + (1 - p_L) * p_T

            # Constrain to [0, 1]
            p_L = max(0.0, min(1.0, p_L))

        return p_L

    def _calculate_topic_weight(self, topic: str, state: AdaptiveState) -> float:
        """
        Calculate content balancing weight for a topic

        Reduces weight for over-represented topics to ensure balanced coverage

        Args:
            topic: Topic to calculate weight for
            state: Current adaptive state

        Returns:
            Weight multiplier (0.5 to 1.0)
        """
        # Count topic occurrences
        topic_counts = {}
        for resp in state.responses:
            topic_counts[resp.topic] = topic_counts.get(resp.topic, 0) + 1

        count = topic_counts.get(topic, 0)

        # Reduce weight if topic is over-represented
        # Weight = 1 / (1 + count * 0.1)
        weight = 1.0 / (1.0 + count * 0.1)

        return max(0.5, weight)  # Minimum weight of 0.5

    def _generate_quadrature_grid(self, points: int) -> np.ndarray:
        """
        Generate quadrature grid for numerical integration

        Args:
            points: Number of grid points

        Returns:
            Array of theta values
        """
        return np.linspace(-4, 4, points)

    def _normal_pdf(self, x: float, mean: float, sd: float) -> float:
        """
        Normal probability density function

        Args:
            x: Value
            mean: Mean
            sd: Standard deviation

        Returns:
            PDF value
        """
        variance = sd ** 2
        exponent = -((x - mean) ** 2) / (2 * variance)
        coefficient = 1.0 / math.sqrt(2 * math.pi * variance)

        return coefficient * math.exp(exponent)

    def theta_to_score(self, theta: float, exam: str) -> int:
        """
        Convert theta (ability) to scaled score for specific exam

        Args:
            theta: Ability estimate
            exam: Exam type (GRE, GMAT, etc.)

        Returns:
            Scaled score
        """
        # Score mapping tables
        score_maps = {
            'GRE': {
                -3: 130, -2: 135, -1: 145, 0: 152,
                1: 162, 2: 168, 3: 170
            },
            'GMAT': {
                -3: 200, -2: 300, -1: 450, 0: 550,
                1: 650, 2: 750, 3: 800
            },
            'LSAT': {
                -3: 120, -2: 135, -1: 150, 0: 155,
                1: 165, 2: 172, 3: 180
            },
            'MCAT': {
                -3: 118, -2: 122, -1: 126, 0: 128,
                1: 130, 2: 131, 3: 132
            }
        }

        score_map = score_maps.get(exam, score_maps['GRE'])

        # Linear interpolation
        keys = sorted(score_map.keys())

        if theta <= keys[0]:
            return score_map[keys[0]]
        if theta >= keys[-1]:
            return score_map[keys[-1]]

        # Find surrounding points
        for i in range(len(keys) - 1):
            if keys[i] <= theta < keys[i + 1]:
                theta1, theta2 = keys[i], keys[i + 1]
                score1, score2 = score_map[theta1], score_map[theta2]

                # Linear interpolation
                fraction = (theta - theta1) / (theta2 - theta1)
                score = score1 + fraction * (score2 - score1)

                return int(round(score))

        return score_map[0]  # Fallback

    def create_initial_state(self) -> AdaptiveState:
        """
        Create initial adaptive state for new session

        Returns:
            Initial adaptive state
        """
        return AdaptiveState(
            theta=0.0,  # Start at average ability
            theta_se=1.0,  # High initial uncertainty
            responses=[],
            information=[],
            questions_answered=0
        )

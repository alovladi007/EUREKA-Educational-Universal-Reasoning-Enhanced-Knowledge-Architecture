"""
Adaptive Learning Engine using Item Response Theory (IRT) and Bayesian Knowledge Tracing (BKT)
"""
import numpy as np
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import math
from scipy import stats
from scipy.optimize import minimize_scalar
import logging

logger = logging.getLogger(__name__)


class AdaptiveEngine:
    """
    Core adaptive learning engine implementing IRT and BKT algorithms
    """
    
    def __init__(self):
        self.initialized = False
        
        # IRT Parameters
        self.min_ability = -3.0
        self.max_ability = 3.0
        self.default_ability = 0.0
        
        # BKT Parameters (Bayesian Knowledge Tracing)
        self.p_init = 0.3  # Initial knowledge probability
        self.p_learn = 0.1  # Learning rate
        self.p_slip = 0.1  # Probability of incorrect despite knowing
        self.p_guess = 0.25  # Probability of correct despite not knowing
        
        # Adaptive Selection Parameters
        self.exploration_rate = 0.1  # Epsilon for exploration vs exploitation
        self.min_exposure_per_question = 10  # Minimum exposures before confidence
        
    async def initialize(self):
        """
        Initialize the adaptive engine
        """
        logger.info("Initializing Adaptive Learning Engine...")
        # Load any pre-trained models or parameters here
        self.initialized = True
        logger.info("Adaptive Engine initialized successfully")
    
    def calculate_irt_probability(self, ability: float, difficulty: float, 
                                 discrimination: float = 1.0, guessing: float = 0.25) -> float:
        """
        Calculate probability of correct answer using 3-parameter IRT model
        P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))
        """
        exp_val = math.exp(-discrimination * (ability - difficulty))
        probability = guessing + (1 - guessing) / (1 + exp_val)
        return probability
    
    def estimate_ability_ml(self, response_pattern: List[Dict]) -> float:
        """
        Maximum Likelihood Estimation of ability given response pattern
        """
        def neg_log_likelihood(theta):
            log_lik = 0
            for response in response_pattern:
                prob = self.calculate_irt_probability(
                    theta, 
                    response['difficulty'],
                    response.get('discrimination', 1.0),
                    response.get('guessing', 0.25)
                )
                if response['correct']:
                    log_lik += math.log(prob + 1e-10)
                else:
                    log_lik += math.log(1 - prob + 1e-10)
            return -log_lik
        
        # Find theta that minimizes negative log likelihood
        result = minimize_scalar(
            neg_log_likelihood,
            bounds=(self.min_ability, self.max_ability),
            method='bounded'
        )
        return result.x
    
    def estimate_ability_eap(self, response_pattern: List[Dict], 
                            prior_mean: float = 0.0, prior_sd: float = 1.0) -> Tuple[float, float]:
        """
        Expected A Posteriori (EAP) estimation with Bayesian approach
        Returns (ability_estimate, standard_error)
        """
        # Discretize the ability scale
        theta_points = np.linspace(self.min_ability, self.max_ability, 61)
        
        # Prior distribution (normal)
        prior = stats.norm.pdf(theta_points, prior_mean, prior_sd)
        prior = prior / prior.sum()
        
        # Likelihood for each theta
        likelihood = np.ones_like(theta_points)
        for response in response_pattern:
            probs = [
                self.calculate_irt_probability(
                    theta, 
                    response['difficulty'],
                    response.get('discrimination', 1.0),
                    response.get('guessing', 0.25)
                )
                for theta in theta_points
            ]
            probs = np.array(probs)
            if response['correct']:
                likelihood *= probs
            else:
                likelihood *= (1 - probs)
        
        # Posterior distribution
        posterior = likelihood * prior
        posterior = posterior / posterior.sum()
        
        # EAP estimate
        ability_estimate = np.sum(theta_points * posterior)
        variance = np.sum((theta_points - ability_estimate) ** 2 * posterior)
        standard_error = math.sqrt(variance)
        
        return ability_estimate, standard_error
    
    def update_knowledge_bkt(self, prior_knowledge: float, is_correct: bool) -> float:
        """
        Update knowledge probability using Bayesian Knowledge Tracing
        """
        if is_correct:
            # P(K|correct) = P(K) * (1 - P_slip) / P(correct)
            p_correct = prior_knowledge * (1 - self.p_slip) + (1 - prior_knowledge) * self.p_guess
            posterior = prior_knowledge * (1 - self.p_slip) / p_correct
        else:
            # P(K|incorrect) = P(K) * P_slip / P(incorrect)
            p_incorrect = prior_knowledge * self.p_slip + (1 - prior_knowledge) * (1 - self.p_guess)
            posterior = prior_knowledge * self.p_slip / p_incorrect
        
        # Apply learning
        posterior = posterior + (1 - posterior) * self.p_learn
        
        return min(max(posterior, 0.0), 1.0)
    
    def calculate_information(self, ability: float, difficulty: float,
                            discrimination: float = 1.0, guessing: float = 0.25) -> float:
        """
        Calculate Fisher Information for a question at given ability level
        Higher information = better measurement precision
        """
        p = self.calculate_irt_probability(ability, difficulty, discrimination, guessing)
        q = 1 - p
        
        # Information function for 3-parameter model
        numerator = discrimination ** 2 * q * (p - guessing) ** 2
        denominator = p * (1 - guessing) ** 2
        
        if denominator > 0:
            information = numerator / denominator
        else:
            information = 0
        
        return information
    
    def select_next_question(self, user_ability: float, available_questions: List[Dict],
                           attempt_history: List[str] = None) -> Dict:
        """
        Select the next best question using adaptive algorithm
        """
        if not available_questions:
            return None
        
        attempt_history = attempt_history or []
        
        # Exploration vs Exploitation
        if np.random.random() < self.exploration_rate:
            # Exploration: select random question user hasn't attempted
            unattempted = [q for q in available_questions if q['id'] not in attempt_history]
            if unattempted:
                return np.random.choice(unattempted)
        
        # Exploitation: select question with maximum information
        best_question = None
        max_score = -1
        
        for question in available_questions:
            # Skip recently attempted questions
            if question['id'] in attempt_history[-5:]:
                continue
            
            # Calculate information at user's ability level
            information = self.calculate_information(
                user_ability,
                question.get('difficulty', 0),
                question.get('discrimination', 1.0),
                question.get('guessing', 0.25)
            )
            
            # Add novelty bonus for questions not attempted recently
            novelty_bonus = 0
            if question['id'] not in attempt_history:
                novelty_bonus = 0.2
            elif question['id'] not in attempt_history[-20:]:
                novelty_bonus = 0.1
            
            # Combine information and novelty
            score = information + novelty_bonus
            
            if score > max_score:
                max_score = score
                best_question = question
        
        return best_question or available_questions[0]
    
    def calibrate_question_parameters(self, attempts: List[Dict]) -> Dict:
        """
        Calibrate IRT parameters for a question based on response data
        Uses marginal maximum likelihood estimation
        """
        if len(attempts) < self.min_exposure_per_question:
            return None
        
        # Extract response pattern
        responses = [(a['user_ability'], a['is_correct']) for a in attempts]
        
        def neg_log_likelihood(params):
            difficulty, discrimination = params
            discrimination = max(0.1, discrimination)  # Ensure positive
            
            log_lik = 0
            for ability, correct in responses:
                prob = self.calculate_irt_probability(ability, difficulty, discrimination, 0.25)
                if correct:
                    log_lik += math.log(prob + 1e-10)
                else:
                    log_lik += math.log(1 - prob + 1e-10)
            return -log_lik
        
        # Initial guess
        success_rate = sum(r[1] for r in responses) / len(responses)
        initial_difficulty = -math.log(success_rate / (1 - success_rate + 1e-10))
        
        from scipy.optimize import minimize
        result = minimize(
            neg_log_likelihood,
            x0=[initial_difficulty, 1.0],
            bounds=[(-3, 3), (0.1, 3)],
            method='L-BFGS-B'
        )
        
        if result.success:
            return {
                'difficulty': result.x[0],
                'discrimination': result.x[1],
                'confidence': 1 - (1 / math.sqrt(len(attempts)))
            }
        return None
    
    def generate_ability_report(self, user_attempts: List[Dict]) -> Dict:
        """
        Generate comprehensive ability report for a user
        """
        if not user_attempts:
            return {
                'overall_ability': self.default_ability,
                'confidence_interval': 1.0,
                'strengths': [],
                'weaknesses': [],
                'recommendations': []
            }
        
        # Group by topic
        topic_performance = {}
        for attempt in user_attempts:
            topic = attempt.get('topic', 'general')
            if topic not in topic_performance:
                topic_performance[topic] = []
            topic_performance[topic].append(attempt)
        
        # Calculate ability per topic
        topic_abilities = {}
        for topic, attempts in topic_performance.items():
            ability, se = self.estimate_ability_eap(attempts)
            accuracy = sum(a['correct'] for a in attempts) / len(attempts)
            topic_abilities[topic] = {
                'ability': ability,
                'standard_error': se,
                'accuracy': accuracy,
                'attempts': len(attempts)
            }
        
        # Overall ability
        all_responses = [
            {'difficulty': a.get('difficulty', 0), 
             'correct': a['correct'],
             'discrimination': a.get('discrimination', 1.0),
             'guessing': a.get('guessing', 0.25)}
            for a in user_attempts
        ]
        overall_ability, overall_se = self.estimate_ability_eap(all_responses)
        
        # Identify strengths and weaknesses
        sorted_topics = sorted(topic_abilities.items(), key=lambda x: x[1]['ability'], reverse=True)
        strengths = [t[0] for t in sorted_topics[:3] if t[1]['ability'] > 0.5]
        weaknesses = [t[0] for t in sorted_topics[-3:] if t[1]['ability'] < -0.5]
        
        # Generate recommendations
        recommendations = []
        for topic in weaknesses:
            recommendations.append({
                'topic': topic,
                'priority': 'high',
                'suggested_difficulty': topic_abilities[topic]['ability'] - 0.5,
                'practice_questions': 20
            })
        
        return {
            'overall_ability': overall_ability,
            'confidence_interval': overall_se * 1.96,  # 95% CI
            'topic_abilities': topic_abilities,
            'strengths': strengths,
            'weaknesses': weaknesses,
            'recommendations': recommendations,
            'total_attempts': len(user_attempts),
            'overall_accuracy': sum(a['correct'] for a in user_attempts) / len(user_attempts)
        }
    
    def predict_exam_score(self, user_ability: float, exam_type: str) -> Dict:
        """
        Predict exam score based on user ability
        """
        # Score conversion tables (example for GRE)
        score_mappings = {
            'GRE': {
                'verbal': lambda a: 130 + 20 * (a + 3) / 6,  # Maps [-3, 3] to [130, 170]
                'quant': lambda a: 130 + 20 * (a + 3) / 6,
                'percentile': lambda a: stats.norm.cdf(a) * 100
            },
            'GMAT': {
                'total': lambda a: 200 + 400 * (a + 3) / 6,  # Maps to [200, 800]
                'percentile': lambda a: stats.norm.cdf(a) * 100
            },
            'SAT': {
                'total': lambda a: 400 + 800 * (a + 3) / 6,  # Maps to [400, 1600]
                'percentile': lambda a: stats.norm.cdf(a) * 100
            }
        }
        
        if exam_type not in score_mappings:
            return {'error': 'Unknown exam type'}
        
        mapping = score_mappings[exam_type]
        prediction = {}
        
        for section, formula in mapping.items():
            score = formula(user_ability)
            if section == 'percentile':
                prediction[section] = round(score, 1)
            else:
                prediction[section] = round(score)
        
        # Add confidence interval
        prediction['confidence_range'] = {
            'lower': round(prediction.get('total', prediction.get('verbal', 0)) * 0.95),
            'upper': round(prediction.get('total', prediction.get('verbal', 0)) * 1.05)
        }
        
        return prediction


# Singleton instance
adaptive_engine = AdaptiveEngine()

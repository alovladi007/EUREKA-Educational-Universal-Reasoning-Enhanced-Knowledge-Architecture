"""
EUREKA Pedagogical Intelligence Layer - Ethics Checker
"""
import logging
from typing import Dict, List, Optional
from textblob import TextBlob

logger = logging.getLogger(__name__)


class EthicsChecker:
    """
    Checks AI-generated content for ethical concerns including:
    - Bias and stereotyping
    - Harmful content
    - Manipulation
    - Inappropriate advice
    """

    def __init__(self):
        # Keywords indicating potential ethical concerns
        self.concern_keywords = {
            'bias': ['stereotype', 'always', 'never', 'all', 'none', 'inferior', 'superior'],
            'manipulation': ['must', 'should', 'have to', 'need to', 'obligated'],
            'harmful': ['hurt', 'harm', 'damage', 'destroy', 'kill'],
            'inappropriate': ['cheat', 'plagiarize', 'copy', 'steal'],
        }

        # Positive pedagogical keywords
        self.positive_keywords = ['learn', 'understand', 'explore', 'discover', 'think', 'reflect']

    def check(self, text: str, context: Optional[str] = None) -> Dict:
        """
        Check text for ethical concerns.

        Args:
            text: Text to check
            context: Optional context (e.g., 'metacog_prompt', 'tone_adaptation')

        Returns:
            dict: {
                'is_ethical': bool,
                'concerns': List[str],
                'sentiment': float,  # -1 to 1
                'recommendations': List[str]
            }
        """
        if not text:
            return {
                'is_ethical': True,
                'concerns': [],
                'sentiment': 0.0,
                'recommendations': []
            }

        concerns = []
        recommendations = []

        # Check for concerning keywords
        text_lower = text.lower()
        for concern_type, keywords in self.concern_keywords.items():
            found_keywords = [kw for kw in keywords if kw in text_lower]
            if found_keywords:
                concerns.append(f"{concern_type.capitalize()}: {', '.join(found_keywords)}")
                recommendations.append(f"Review {concern_type} language")

        # Sentiment analysis
        blob = TextBlob(text)
        sentiment = blob.sentiment.polarity

        # Check for overly negative sentiment in pedagogical content
        if sentiment < -0.5:
            concerns.append("Overly negative sentiment")
            recommendations.append("Reframe with more positive, growth-oriented language")

        # Check for prescriptive language
        prescriptive_count = sum(1 for word in ['must', 'should', 'have to'] if word in text_lower)
        if prescriptive_count > 2:
            concerns.append("Excessive prescriptive language")
            recommendations.append("Use more autonomy-supportive phrasing")

        # Check for positive pedagogical framing
        positive_count = sum(1 for word in self.positive_keywords if word in text_lower)
        if positive_count == 0 and len(text.split()) > 20:
            concerns.append("Lacks growth-oriented language")
            recommendations.append("Incorporate learner-centered vocabulary")

        is_ethical = len(concerns) == 0

        if not is_ethical:
            logger.warning(f"Ethics concerns detected in {context or 'unknown context'}: {concerns}")

        return {
            'is_ethical': is_ethical,
            'concerns': concerns,
            'sentiment': sentiment,
            'recommendations': recommendations
        }

    def check_metacog_prompt(self, prompt: str) -> Dict:
        """Check metacognition prompt for ethical concerns"""
        result = self.check(prompt, context='metacog_prompt')

        # Additional checks for metacognition prompts
        if 'why did you fail' in prompt.lower():
            result['concerns'].append("Deficit framing")
            result['recommendations'].append("Reframe around growth and learning")
            result['is_ethical'] = False

        return result

    def check_tone_adaptation(self, text: str, tone_state: str) -> Dict:
        """Check tone adaptation for ethical concerns"""
        result = self.check(text, context=f'tone_adaptation_{tone_state}')

        # Tone-specific checks
        if tone_state == 'frustrated' and result['sentiment'] < -0.3:
            result['concerns'].append("Tone may reinforce frustration")
            result['recommendations'].append("Ensure supportive, empathetic language")
            result['is_ethical'] = False

        return result


# Singleton instance
ethics = EthicsChecker()

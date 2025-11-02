"""
EUREKA Pedagogical Intelligence Layer - Compliance & Sanitization
"""
import re
import logging
from typing import Optional
from better_profanity import profanity

logger = logging.getLogger(__name__)


class ComplianceSanitizer:
    """
    Sanitizes user inputs and AI outputs to ensure compliance with safety standards.
    Prevents PII/PHI leakage, profanity, and unsafe content.
    """

    def __init__(self):
        profanity.load_censor_words()

        # Patterns for PII detection
        self.pii_patterns = {
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
            'credit_card': r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
        }

    def sanitize(self, text: str, context: Optional[str] = None) -> dict:
        """
        Sanitize text for compliance.

        Args:
            text: Input text to sanitize
            context: Optional context (e.g., 'user_input', 'ai_output')

        Returns:
            dict: {
                'sanitized_text': str,
                'is_safe': bool,
                'violations': List[str],
                'redactions': int
            }
        """
        if not text:
            return {
                'sanitized_text': '',
                'is_safe': True,
                'violations': [],
                'redactions': 0
            }

        violations = []
        redactions = 0
        sanitized = text

        # Check for PII
        for pii_type, pattern in self.pii_patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                violations.append(f"PII detected: {pii_type}")
                sanitized = re.sub(pattern, f'[REDACTED_{pii_type.upper()}]', sanitized)
                redactions += len(matches)
                logger.warning(f"PII {pii_type} detected and redacted in {context or 'unknown context'}")

        # Check for profanity
        if profanity.contains_profanity(sanitized):
            violations.append("Profanity detected")
            sanitized = profanity.censor(sanitized)
            redactions += 1
            logger.warning(f"Profanity detected and censored in {context or 'unknown context'}")

        # Check for potentially unsafe patterns
        unsafe_patterns = [
            (r'(?i)\b(password|passwd|pwd)\s*[:=]\s*\S+', 'credentials'),
            (r'(?i)\b(api[_-]?key|secret)\s*[:=]\s*\S+', 'api_keys'),
        ]

        for pattern, violation_type in unsafe_patterns:
            if re.search(pattern, sanitized):
                violations.append(f"Unsafe content: {violation_type}")
                sanitized = re.sub(pattern, f'[REDACTED_{violation_type.upper()}]', sanitized)
                redactions += 1

        is_safe = len(violations) == 0

        return {
            'sanitized_text': sanitized,
            'is_safe': is_safe,
            'violations': violations,
            'redactions': redactions
        }

    def validate_learner_input(self, text: str) -> dict:
        """Validate and sanitize learner input"""
        return self.sanitize(text, context='learner_input')

    def validate_ai_output(self, text: str) -> dict:
        """Validate and sanitize AI-generated output"""
        return self.sanitize(text, context='ai_output')


# Singleton instance
compliance = ComplianceSanitizer()

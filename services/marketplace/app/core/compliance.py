"""
Compliance and content safety for marketplace
Reuses patterns from pedagogy service
"""
import re
import logging
from typing import Dict, List, Optional
from better_profanity import profanity

logger = logging.getLogger(__name__)


class MarketplaceCompliance:
    """Content compliance checker for marketplace submissions"""

    def __init__(self):
        profanity.load_censor_words()

        # PII patterns (reuse from pedagogy)
        self.pii_patterns = {
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
            'credit_card': r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
        }

        # Prohibited content keywords
        self.prohibited_keywords = [
            'pirated', 'cracked', 'illegal', 'stolen',
            'copyright infringement', 'plagiarized'
        ]

        # Scam indicators
        self.scam_indicators = [
            'guaranteed money', 'get rich quick', 'free money',
            'no risk', '100% guaranteed', 'limited time only'
        ]

    def validate_content_submission(
        self,
        title: str,
        description: str,
        content_metadata: Optional[Dict] = None
    ) -> Dict:
        """
        Validate content submission for marketplace

        Returns:
            {
                'is_safe': bool,
                'violations': List[str],
                'sanitized_title': str,
                'sanitized_description': str,
                'risk_score': float  # 0.0-1.0
            }
        """
        violations = []
        risk_score = 0.0

        # Check title and description for PII
        title_result = self._check_pii(title)
        desc_result = self._check_pii(description)

        if title_result['has_pii']:
            violations.extend([f"Title: {v}" for v in title_result['violations']])
            risk_score += 0.3

        if desc_result['has_pii']:
            violations.extend([f"Description: {v}" for v in desc_result['violations']])
            risk_score += 0.3

        # Check for profanity
        if profanity.contains_profanity(title):
            violations.append("Title contains inappropriate language")
            risk_score += 0.4

        if profanity.contains_profanity(description):
            violations.append("Description contains inappropriate language")
            risk_score += 0.3

        # Check for prohibited content
        combined_text = f"{title} {description}".lower()
        for keyword in self.prohibited_keywords:
            if keyword in combined_text:
                violations.append(f"Prohibited keyword detected: {keyword}")
                risk_score += 0.5

        # Check for scam indicators
        scam_count = sum(1 for indicator in self.scam_indicators if indicator in combined_text)
        if scam_count >= 2:
            violations.append(f"Multiple scam indicators detected ({scam_count})")
            risk_score += 0.6

        # Sanitize outputs
        sanitized_title = profanity.censor(title_result['sanitized'])
        sanitized_description = profanity.censor(desc_result['sanitized'])

        risk_score = min(1.0, risk_score)
        is_safe = len(violations) == 0 and risk_score < 0.5

        logger.info(
            "Content validation",
            extra={
                'is_safe': is_safe,
                'violations': len(violations),
                'risk_score': risk_score
            }
        )

        return {
            'is_safe': is_safe,
            'violations': violations,
            'sanitized_title': sanitized_title,
            'sanitized_description': sanitized_description,
            'risk_score': risk_score
        }

    def _check_pii(self, text: str) -> Dict:
        """Check for PII in text"""
        violations = []
        sanitized = text

        for pii_type, pattern in self.pii_patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                violations.append(f"PII detected: {pii_type}")
                sanitized = re.sub(pattern, f'[REDACTED_{pii_type.upper()}]', sanitized)

        return {
            'has_pii': len(violations) > 0,
            'violations': violations,
            'sanitized': sanitized
        }

    def validate_pricing(self, price_usd: float, min_price: float, max_price: float) -> Dict:
        """Validate content pricing"""
        is_valid = min_price <= price_usd <= max_price

        if not is_valid:
            return {
                'is_valid': False,
                'error': f"Price must be between ${min_price} and ${max_price}"
            }

        return {'is_valid': True, 'normalized_price': round(price_usd, 2)}


# Singleton instance
compliance = MarketplaceCompliance()

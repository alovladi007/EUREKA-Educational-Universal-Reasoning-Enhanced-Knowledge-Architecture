"""
Unit tests for Marketplace Compliance
"""
import pytest
from app.core.compliance import MarketplaceCompliance, compliance


class TestMarketplaceCompliance:
    """Test marketplace compliance validation"""

    @pytest.fixture
    def comp(self):
        """Create compliance fixture"""
        return MarketplaceCompliance()

    def test_safe_content(self, comp):
        """Test safe content passes validation"""
        result = comp.validate_content_submission(
            title="Introduction to Python",
            description="Learn Python programming basics through interactive exercises"
        )

        assert result['is_safe'] is True
        assert len(result['violations']) == 0
        assert result['risk_score'] < 0.5

    def test_pii_in_title(self, comp):
        """Test PII detection in title"""
        result = comp.validate_content_submission(
            title="Contact me at john@example.com for course",
            description="Great course content"
        )

        assert result['is_safe'] is False
        assert any('Title' in v for v in result['violations'])
        assert '[REDACTED_EMAIL]' in result['sanitized_title']

    def test_pii_in_description(self, comp):
        """Test PII detection in description"""
        result = comp.validate_content_submission(
            title="Python Course",
            description="Call me at 555-1234 or email test@example.com"
        )

        assert result['is_safe'] is False
        assert any('Description' in v for v in result['violations'])

    def test_profanity_detection(self, comp):
        """Test profanity filtering"""
        result = comp.validate_content_submission(
            title="Great Course",
            description="This damn course is awesome"
        )

        # Should be censored
        assert '*' in result['sanitized_description'] or result['sanitized_description'] != "This damn course is awesome"

    def test_prohibited_keywords(self, comp):
        """Test prohibited content keyword detection"""
        result = comp.validate_content_submission(
            title="Pirated Content Collection",
            description="Access to cracked software and illegal downloads"
        )

        assert result['is_safe'] is False
        assert len(result['violations']) >= 2
        assert result['risk_score'] >= 0.5

    def test_scam_indicators(self, comp):
        """Test scam indicator detection"""
        result = comp.validate_content_submission(
            title="Get Rich Quick Course",
            description="Guaranteed money with no risk! 100% guaranteed returns. Limited time only!"
        )

        assert result['is_safe'] is False
        assert any('scam' in v.lower() for v in result['violations'])
        assert result['risk_score'] >= 0.6

    def test_pricing_validation_valid(self, comp):
        """Test valid pricing"""
        result = comp.validate_pricing(29.99, min_price=0.99, max_price=9999.99)

        assert result['is_valid'] is True
        assert result['normalized_price'] == 29.99

    def test_pricing_validation_too_low(self, comp):
        """Test price below minimum"""
        result = comp.validate_pricing(0.50, min_price=0.99, max_price=9999.99)

        assert result['is_valid'] is False
        assert 'error' in result

    def test_pricing_validation_too_high(self, comp):
        """Test price above maximum"""
        result = comp.validate_pricing(10000.00, min_price=0.99, max_price=9999.99)

        assert result['is_valid'] is False
        assert 'error' in result

    def test_multiple_violations(self, comp):
        """Test content with multiple compliance issues"""
        result = comp.validate_content_submission(
            title="Call 555-1234 for pirated content",
            description="Get rich quick with guaranteed money! Email bad@example.com"
        )

        assert result['is_safe'] is False
        assert len(result['violations']) >= 3
        assert result['risk_score'] >= 0.7


class TestComplianceSingleton:
    """Test compliance singleton"""

    def test_singleton_instance(self):
        """Test compliance is a singleton"""
        assert compliance is not None
        assert isinstance(compliance, MarketplaceCompliance)

    def test_singleton_validation(self):
        """Test using singleton directly"""
        result = compliance.validate_content_submission(
            title="Test Course",
            description="Great educational content"
        )

        assert result['is_safe'] is True

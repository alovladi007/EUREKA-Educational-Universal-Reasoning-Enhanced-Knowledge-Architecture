"""
Unit tests for Compliance Sanitizer
"""
import pytest
from app.core.compliance import ComplianceSanitizer, compliance


class TestComplianceSanitizer:
    """Test compliance sanitization"""

    @pytest.fixture
    def sanitizer(self):
        """Create sanitizer fixture"""
        return ComplianceSanitizer()

    def test_safe_text(self, sanitizer):
        """Test safe text passes through"""
        text = "This is a safe learning question about calculus"
        result = sanitizer.sanitize(text)

        assert result['is_safe'] is True
        assert result['sanitized_text'] == text
        assert len(result['violations']) == 0
        assert result['redactions'] == 0

    def test_email_detection(self, sanitizer):
        """Test email detection and redaction"""
        text = "Contact me at john.doe@example.com for help"
        result = sanitizer.sanitize(text)

        assert result['is_safe'] is False
        assert 'PII detected: email' in result['violations']
        assert '[REDACTED_EMAIL]' in result['sanitized_text']
        assert 'john.doe@example.com' not in result['sanitized_text']
        assert result['redactions'] > 0

    def test_phone_detection(self, sanitizer):
        """Test phone number detection"""
        text = "Call me at 555-123-4567"
        result = sanitizer.sanitize(text)

        assert result['is_safe'] is False
        assert 'PII detected: phone' in result['violations']
        assert '[REDACTED_PHONE]' in result['sanitized_text']
        assert result['redactions'] > 0

    def test_ssn_detection(self, sanitizer):
        """Test SSN detection"""
        text = "My SSN is 123-45-6789"
        result = sanitizer.sanitize(text)

        assert result['is_safe'] is False
        assert 'PII detected: ssn' in result['violations']
        assert '[REDACTED_SSN]' in result['sanitized_text']
        assert '123-45-6789' not in result['sanitized_text']

    def test_credit_card_detection(self, sanitizer):
        """Test credit card detection"""
        text = "Card number: 4532-1234-5678-9010"
        result = sanitizer.sanitize(text)

        assert result['is_safe'] is False
        assert 'PII detected: credit_card' in result['violations']
        assert '[REDACTED_CREDIT_CARD]' in result['sanitized_text']

    def test_profanity_detection(self, sanitizer):
        """Test profanity filtering"""
        # Using a mild example
        text = "This damn problem is hard"
        result = sanitizer.sanitize(text)

        # Should detect and censor
        assert result['sanitized_text'] != text

    def test_credentials_detection(self, sanitizer):
        """Test password/credential detection"""
        text = "My password is secret123"
        result = sanitizer.sanitize(text)

        assert result['is_safe'] is False
        assert any('credentials' in v for v in result['violations'])
        assert '[REDACTED_CREDENTIALS]' in result['sanitized_text']

    def test_api_key_detection(self, sanitizer):
        """Test API key detection"""
        text = "api_key: sk-1234567890abcdef"
        result = sanitizer.sanitize(text)

        assert result['is_safe'] is False
        assert any('api_keys' in v for v in result['violations'])

    def test_multiple_pii_types(self, sanitizer):
        """Test multiple PII types in one text"""
        text = "Email john@example.com and phone 555-1234 for my SSN 123-45-6789"
        result = sanitizer.sanitize(text)

        assert result['is_safe'] is False
        assert len(result['violations']) >= 3  # email, phone, ssn
        assert result['redactions'] >= 3

    def test_empty_text(self, sanitizer):
        """Test empty text"""
        result = sanitizer.sanitize("")

        assert result['is_safe'] is True
        assert result['sanitized_text'] == ""
        assert result['redactions'] == 0

    def test_validate_learner_input(self, sanitizer):
        """Test learner input validation"""
        text = "Help me with math homework"
        result = sanitizer.validate_learner_input(text)

        assert result['is_safe'] is True
        assert result['sanitized_text'] == text

    def test_validate_ai_output(self, sanitizer):
        """Test AI output validation"""
        text = "Here's the solution to your problem..."
        result = sanitizer.validate_ai_output(text)

        assert result['is_safe'] is True


class TestComplianceSingleton:
    """Test compliance singleton"""

    def test_singleton_instance(self):
        """Test compliance is a singleton"""
        assert compliance is not None
        assert isinstance(compliance, ComplianceSanitizer)

    def test_singleton_sanitize(self):
        """Test using singleton directly"""
        text = "Safe educational content"
        result = compliance.sanitize(text)

        assert result['is_safe'] is True
        assert result['sanitized_text'] == text

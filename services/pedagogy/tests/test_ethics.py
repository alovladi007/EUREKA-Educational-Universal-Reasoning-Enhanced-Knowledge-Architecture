"""
Unit tests for Ethics Checker
"""
import pytest
from app.core.ethics import EthicsChecker, ethics


class TestEthicsChecker:
    """Test ethics checking"""

    @pytest.fixture
    def checker(self):
        """Create checker fixture"""
        return EthicsChecker()

    def test_ethical_content(self, checker):
        """Test ethical pedagogical content passes"""
        text = "Let's explore this concept together and discover new understanding"
        result = checker.check(text)

        assert result['is_ethical'] is True
        assert len(result['concerns']) == 0
        assert -1 <= result['sentiment'] <= 1

    def test_bias_detection(self, checker):
        """Test bias keyword detection"""
        text = "Girls are always bad at math and boys are superior at science"
        result = checker.check(text)

        assert result['is_ethical'] is False
        assert any('bias' in concern.lower() for concern in result['concerns'])
        assert len(result['recommendations']) > 0

    def test_manipulation_detection(self, checker):
        """Test manipulative language detection"""
        text = "You must do this homework. You have to study or you will fail."
        result = checker.check(text)

        assert result['is_ethical'] is False
        # Should flag manipulation or prescriptive language
        assert len(result['concerns']) > 0

    def test_harmful_content(self, checker):
        """Test harmful content detection"""
        text = "This will hurt your grade and damage your future"
        result = checker.check(text)

        assert result['is_ethical'] is False
        assert any('harmful' in concern.lower() for concern in result['concerns'])

    def test_inappropriate_advice(self, checker):
        """Test inappropriate advice detection"""
        text = "Just cheat on the test and plagiarize the essay"
        result = checker.check(text)

        assert result['is_ethical'] is False
        assert any('inappropriate' in concern.lower() for concern in result['concerns'])

    def test_negative_sentiment(self, checker):
        """Test overly negative sentiment detection"""
        text = "You're terrible at this. Everything you do is wrong and hopeless."
        result = checker.check(text)

        assert result['is_ethical'] is False
        assert result['sentiment'] < -0.3
        assert any('negative' in concern.lower() for concern in result['concerns'])

    def test_positive_sentiment(self, checker):
        """Test positive sentiment"""
        text = "Great work! You're making excellent progress and learning well."
        result = checker.check(text)

        assert result['sentiment'] > 0
        # Positive sentiment alone shouldn't cause ethics failure
        # (unless there are other issues)

    def test_prescriptive_language(self, checker):
        """Test excessive prescriptive language"""
        text = "You must do this, you should do that, you have to complete this"
        result = checker.check(text)

        assert result['is_ethical'] is False
        assert any('prescriptive' in concern.lower() for concern in result['concerns'])

    def test_growth_oriented_language(self, checker):
        """Test presence of growth-oriented language"""
        text = "Learn from this experience and think about how to approach it differently"
        result = checker.check(text)

        # Should pass ethics check
        assert result['is_ethical'] is True

    def test_lack_of_growth_language(self, checker):
        """Test lack of learner-centered vocabulary in long text"""
        text = "Complete the assignment by following the instructions exactly as written without deviation"
        result = checker.check(text)

        # May flag lack of growth-oriented language
        # (depends on text length threshold)

    def test_empty_text(self, checker):
        """Test empty text"""
        result = checker.check("")

        assert result['is_ethical'] is True
        assert len(result['concerns']) == 0

    def test_check_metacog_prompt(self, checker):
        """Test metacognition prompt checking"""
        good_prompt = "What did you learn from this experience?"
        result = checker.check_metacog_prompt(good_prompt)

        assert result['is_ethical'] is True

    def test_check_deficit_framing(self, checker):
        """Test deficit framing detection in metacog prompts"""
        bad_prompt = "Why did you fail this problem?"
        result = checker.check_metacog_prompt(bad_prompt)

        assert result['is_ethical'] is False
        assert any('deficit' in concern.lower() for concern in result['concerns'])

    def test_check_tone_adaptation(self, checker):
        """Test tone adaptation checking"""
        text = "I understand this is challenging. Let's work through it together."
        result = checker.check_tone_adaptation(text, tone_state='supportive')

        assert result['is_ethical'] is True

    def test_frustrated_tone_check(self, checker):
        """Test frustrated tone shouldn't reinforce negativity"""
        # Negative text with frustrated state
        text = "This is impossible and you'll never get it right"
        result = checker.check_tone_adaptation(text, tone_state='frustrated')

        assert result['is_ethical'] is False
        # Should recommend supportive language


class TestEthicsSingleton:
    """Test ethics singleton"""

    def test_singleton_instance(self):
        """Test ethics is a singleton"""
        assert ethics is not None
        assert isinstance(ethics, EthicsChecker)

    def test_singleton_check(self):
        """Test using singleton directly"""
        text = "Let's explore this together"
        result = ethics.check(text)

        assert result['is_ethical'] is True


class TestEthicsIntegration:
    """Integration tests for ethics in workflow"""

    def test_recommendation_pipeline(self):
        """Test ethics checking recommendation text"""
        recommendations = [
            "Great job! Keep practicing to strengthen your understanding.",
            "You must study harder or you will fail this course.",
            "Consider reviewing the concepts that challenged you today.",
        ]

        results = [ethics.check(rec, context='recommendation') for rec in recommendations]

        # First and third should pass, second should fail
        assert results[0]['is_ethical'] is True
        assert results[1]['is_ethical'] is False
        assert results[2]['is_ethical'] is True

    def test_multiple_concerns(self):
        """Test text with multiple ethical concerns"""
        text = "Girls always fail at math. You must study harder or you're hopeless."

        result = ethics.check(text)

        assert result['is_ethical'] is False
        # Should have multiple concerns (bias, prescriptive, negative sentiment)
        assert len(result['concerns']) >= 2
        assert len(result['recommendations']) >= 2

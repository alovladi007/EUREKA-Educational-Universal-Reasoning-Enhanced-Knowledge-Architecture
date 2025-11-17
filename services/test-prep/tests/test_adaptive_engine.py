"""
Tests for the Adaptive Learning Engine
"""
import pytest
import numpy as np
from app.ml.adaptive_engine import AdaptiveEngine


@pytest.fixture
def engine():
    """Create an adaptive engine instance for testing"""
    engine = AdaptiveEngine()
    return engine


@pytest.fixture
def sample_responses():
    """Sample response pattern for testing"""
    return [
        {'difficulty': 0.5, 'discrimination': 1.2, 'guessing': 0.25, 'correct': True},
        {'difficulty': -0.5, 'discrimination': 1.0, 'guessing': 0.25, 'correct': True},
        {'difficulty': 1.0, 'discrimination': 0.8, 'guessing': 0.25, 'correct': False},
        {'difficulty': 0.0, 'discrimination': 1.5, 'guessing': 0.25, 'correct': True},
    ]


def test_irt_probability_calculation(engine):
    """Test IRT probability calculation"""
    # Test with known parameters
    ability = 0.0
    difficulty = 0.0
    discrimination = 1.0
    guessing = 0.25
    
    prob = engine.calculate_irt_probability(ability, difficulty, discrimination, guessing)
    
    # With equal ability and difficulty, probability should be (1 + guessing) / 2
    expected = (1 + guessing) / 2
    assert abs(prob - expected) < 0.01
    
    # Test edge cases
    # Very high ability should give high probability
    high_ability_prob = engine.calculate_irt_probability(3.0, 0.0, 1.0, 0.0)
    assert high_ability_prob > 0.95
    
    # Very low ability should give low probability
    low_ability_prob = engine.calculate_irt_probability(-3.0, 0.0, 1.0, 0.0)
    assert low_ability_prob < 0.05


def test_ability_estimation_ml(engine, sample_responses):
    """Test Maximum Likelihood ability estimation"""
    ability = engine.estimate_ability_ml(sample_responses)
    
    # Ability should be within reasonable bounds
    assert -3.0 <= ability <= 3.0
    
    # With mostly correct responses, ability should be positive
    assert ability > 0


def test_ability_estimation_eap(engine, sample_responses):
    """Test Expected A Posteriori ability estimation"""
    ability, standard_error = engine.estimate_ability_eap(sample_responses)
    
    # Check ability is within bounds
    assert -3.0 <= ability <= 3.0
    
    # Standard error should be positive
    assert standard_error > 0
    
    # Standard error should be reasonable (not too large)
    assert standard_error < 2.0


def test_bkt_knowledge_update(engine):
    """Test Bayesian Knowledge Tracing update"""
    prior = 0.5
    
    # Test correct response
    posterior_correct = engine.update_knowledge_bkt(prior, True)
    assert posterior_correct > prior  # Knowledge should increase
    assert 0 <= posterior_correct <= 1
    
    # Test incorrect response
    posterior_incorrect = engine.update_knowledge_bkt(prior, False)
    assert posterior_incorrect < prior  # Knowledge should decrease
    assert 0 <= posterior_incorrect <= 1


def test_information_calculation(engine):
    """Test Fisher Information calculation"""
    ability = 0.0
    difficulty = 0.0
    discrimination = 1.5
    
    info = engine.calculate_information(ability, difficulty, discrimination, 0.25)
    
    # Information should be positive
    assert info > 0
    
    # Information should be highest when ability matches difficulty
    info_matched = engine.calculate_information(0.5, 0.5, 1.0, 0.25)
    info_mismatched = engine.calculate_information(-2.0, 2.0, 1.0, 0.25)
    assert info_matched > info_mismatched


def test_next_question_selection(engine):
    """Test adaptive question selection"""
    user_ability = 0.5
    available_questions = [
        {'id': '1', 'difficulty': -1.0, 'discrimination': 1.0, 'guessing': 0.25},
        {'id': '2', 'difficulty': 0.5, 'discrimination': 1.2, 'guessing': 0.25},
        {'id': '3', 'difficulty': 2.0, 'discrimination': 0.8, 'guessing': 0.25},
    ]
    
    selected = engine.select_next_question(user_ability, available_questions)
    
    # Should select a question
    assert selected is not None
    assert selected['id'] in ['1', '2', '3']
    
    # Should prefer question closer to ability level (id='2')
    # Run multiple times to account for exploration
    selections = []
    for _ in range(100):
        q = engine.select_next_question(user_ability, available_questions)
        selections.append(q['id'])
    
    # Question 2 should be selected most often
    assert selections.count('2') > selections.count('1')
    assert selections.count('2') > selections.count('3')


def test_question_calibration(engine):
    """Test IRT parameter calibration"""
    # Create synthetic response data
    attempts = []
    true_difficulty = 0.5
    
    for _ in range(50):
        ability = np.random.normal(0, 1)
        # Use true IRT model to generate responses
        prob = engine.calculate_irt_probability(ability, true_difficulty, 1.0, 0.25)
        is_correct = np.random.random() < prob
        attempts.append({'user_ability': ability, 'is_correct': is_correct})
    
    # Calibrate parameters
    result = engine.calibrate_question_parameters(attempts)
    
    # Should return calibrated parameters
    assert result is not None
    assert 'difficulty' in result
    assert 'discrimination' in result
    assert 'confidence' in result
    
    # Difficulty should be somewhat close to true value (within 1 unit)
    assert abs(result['difficulty'] - true_difficulty) < 1.0


def test_ability_report_generation(engine):
    """Test comprehensive ability report generation"""
    attempts = [
        {'difficulty': 0.5, 'discrimination': 1.0, 'guessing': 0.25, 
         'correct': True, 'topic': 'Algebra', 'subject': 'Math'},
        {'difficulty': -0.5, 'discrimination': 1.2, 'guessing': 0.25, 
         'correct': True, 'topic': 'Algebra', 'subject': 'Math'},
        {'difficulty': 1.0, 'discrimination': 0.8, 'guessing': 0.25, 
         'correct': False, 'topic': 'Geometry', 'subject': 'Math'},
        {'difficulty': 0.0, 'discrimination': 1.5, 'guessing': 0.25, 
         'correct': True, 'topic': 'Vocabulary', 'subject': 'Verbal'},
    ]
    
    report = engine.generate_ability_report(attempts)
    
    # Check report structure
    assert 'overall_ability' in report
    assert 'confidence_interval' in report
    assert 'topic_abilities' in report
    assert 'strengths' in report
    assert 'weaknesses' in report
    assert 'recommendations' in report
    assert 'overall_accuracy' in report
    
    # Check calculations
    assert report['total_attempts'] == 4
    assert report['overall_accuracy'] == 0.75  # 3 out of 4 correct
    
    # Topic abilities should be calculated
    assert 'Algebra' in report['topic_abilities']
    assert 'Geometry' in report['topic_abilities']
    assert 'Vocabulary' in report['topic_abilities']


def test_exam_score_prediction(engine):
    """Test exam score prediction"""
    user_ability = 0.5
    
    # Test GRE prediction
    gre_prediction = engine.predict_exam_score(user_ability, 'GRE')
    assert 'verbal' in gre_prediction
    assert 'quant' in gre_prediction
    assert 'percentile' in gre_prediction
    assert 130 <= gre_prediction['verbal'] <= 170
    assert 0 <= gre_prediction['percentile'] <= 100
    
    # Test GMAT prediction
    gmat_prediction = engine.predict_exam_score(user_ability, 'GMAT')
    assert 'total' in gmat_prediction
    assert 200 <= gmat_prediction['total'] <= 800
    
    # Test SAT prediction
    sat_prediction = engine.predict_exam_score(user_ability, 'SAT')
    assert 'total' in sat_prediction
    assert 400 <= sat_prediction['total'] <= 1600
    
    # Test unknown exam type
    unknown_prediction = engine.predict_exam_score(user_ability, 'UNKNOWN')
    assert 'error' in unknown_prediction


def test_edge_cases(engine):
    """Test edge cases and boundary conditions"""
    # Empty response pattern
    empty_report = engine.generate_ability_report([])
    assert empty_report['overall_ability'] == 0.0
    assert empty_report['total_attempts'] == 0
    
    # Single response
    single_response = [{'difficulty': 0, 'correct': True, 'topic': 'Test'}]
    ability, se = engine.estimate_ability_eap(single_response)
    assert -3.0 <= ability <= 3.0
    
    # All correct responses
    all_correct = [
        {'difficulty': i, 'correct': True, 'discrimination': 1.0, 'guessing': 0.25}
        for i in [-1, 0, 1, 2]
    ]
    high_ability = engine.estimate_ability_ml(all_correct)
    assert high_ability > 1.0  # Should indicate high ability
    
    # All incorrect responses
    all_incorrect = [
        {'difficulty': i, 'correct': False, 'discrimination': 1.0, 'guessing': 0.25}
        for i in [-2, -1, 0, 1]
    ]
    low_ability = engine.estimate_ability_ml(all_incorrect)
    assert low_ability < -1.0  # Should indicate low ability


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

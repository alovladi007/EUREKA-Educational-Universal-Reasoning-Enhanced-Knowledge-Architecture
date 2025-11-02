"""
Unit tests for Deep Knowledge Tracing (DKT) model
"""
import pytest
import torch
import numpy as np
from app.models.dkt import DKTModel, DKTTrainer, encode_practice_sequence


class TestDKTModel:
    """Test DKT model architecture and forward pass"""

    def test_model_initialization(self):
        """Test model initializes with correct parameters"""
        num_concepts = 50
        hidden_dim = 128
        num_layers = 2

        model = DKTModel(
            num_concepts=num_concepts,
            hidden_dim=hidden_dim,
            num_layers=num_layers
        )

        assert model.num_concepts == num_concepts
        assert model.hidden_dim == hidden_dim
        assert model.num_layers == num_layers
        assert model.input_dim == num_concepts * 2

    def test_forward_pass_shape(self):
        """Test forward pass outputs correct shape"""
        num_concepts = 10
        batch_size = 4
        seq_len = 5

        model = DKTModel(num_concepts=num_concepts)

        # Create random input
        x = torch.randn(batch_size, seq_len, num_concepts * 2)

        output, hidden = model(x)

        assert output.shape == (batch_size, seq_len, num_concepts)
        assert hidden.shape == (model.num_layers, batch_size, model.hidden_dim)

    def test_output_probabilities(self):
        """Test output is valid probabilities (0-1)"""
        num_concepts = 10
        model = DKTModel(num_concepts=num_concepts)

        x = torch.randn(2, 3, num_concepts * 2)
        output, _ = model(x)

        # All outputs should be between 0 and 1 (sigmoid)
        assert torch.all(output >= 0)
        assert torch.all(output <= 1)

    def test_predict_next(self):
        """Test next-item prediction"""
        num_concepts = 10
        model = DKTModel(num_concepts=num_concepts)

        # Create practice sequence
        sequence = torch.randn(5, num_concepts * 2)
        concept_id = 3

        prob = model.predict_next(sequence, concept_id)

        assert isinstance(prob, float)
        assert 0 <= prob <= 1


class TestEncodePracticeSequence:
    """Test practice sequence encoding"""

    def test_encoding_shape(self):
        """Test encoded sequence has correct shape"""
        num_concepts = 50
        sequence = [
            {'concept_id': 0, 'is_correct': True},
            {'concept_id': 1, 'is_correct': False},
            {'concept_id': 2, 'is_correct': True},
        ]

        encoded = encode_practice_sequence(sequence, num_concepts)

        assert encoded.shape == (3, num_concepts * 2)

    def test_correct_encoding(self):
        """Test correct responses encoded in first half"""
        num_concepts = 5
        sequence = [{'concept_id': 2, 'is_correct': True}]

        encoded = encode_practice_sequence(sequence, num_concepts)

        # Correct: concept in first half
        assert encoded[0, 2] == 1.0  # Concept 2 in first half
        assert np.sum(encoded[0, :num_concepts]) == 1.0
        assert np.sum(encoded[0, num_concepts:]) == 0.0

    def test_incorrect_encoding(self):
        """Test incorrect responses encoded in second half"""
        num_concepts = 5
        sequence = [{'concept_id': 3, 'is_correct': False}]

        encoded = encode_practice_sequence(sequence, num_concepts)

        # Incorrect: concept in second half
        assert encoded[0, num_concepts + 3] == 1.0  # Concept 3 in second half
        assert np.sum(encoded[0, :num_concepts]) == 0.0
        assert np.sum(encoded[0, num_concepts:]) == 1.0

    def test_multiple_items(self):
        """Test encoding multiple practice items"""
        num_concepts = 10
        sequence = [
            {'concept_id': 0, 'is_correct': True},
            {'concept_id': 1, 'is_correct': False},
            {'concept_id': 2, 'is_correct': True},
        ]

        encoded = encode_practice_sequence(sequence, num_concepts)

        assert encoded.shape[0] == 3
        # Each row should sum to 1 (one-hot)
        for row in encoded:
            assert np.sum(row) == 1.0


class TestDKTTrainer:
    """Test DKT trainer"""

    @pytest.fixture
    def trainer(self):
        """Create trainer fixture"""
        model = DKTModel(num_concepts=10, hidden_dim=32, num_layers=1)
        return DKTTrainer(model, learning_rate=0.01)

    def test_trainer_initialization(self, trainer):
        """Test trainer initializes correctly"""
        assert trainer.model is not None
        assert trainer.optimizer is not None
        assert trainer.criterion is not None

    def test_train_epoch(self, trainer):
        """Test training for one epoch"""
        # Create dummy training data
        num_concepts = 10
        train_data = []
        for _ in range(10):
            seq_len = 5
            x = np.random.randn(seq_len, num_concepts * 2)
            y = np.random.rand(seq_len, num_concepts)
            train_data.append((x, y))

        loss = trainer.train_epoch(train_data, batch_size=4)

        assert isinstance(loss, float)
        assert loss >= 0  # Loss should be non-negative

    def test_evaluate(self, trainer):
        """Test evaluation"""
        # Create dummy eval data
        num_concepts = 10
        eval_data = []
        for _ in range(5):
            seq_len = 3
            x = np.random.randn(seq_len, num_concepts * 2)
            y = np.random.randint(0, 2, size=(seq_len, num_concepts)).astype(float)
            eval_data.append((x, y))

        metrics = trainer.evaluate(eval_data)

        assert 'auc' in metrics
        assert 'accuracy' in metrics
        assert 'num_samples' in metrics
        assert 0 <= metrics['auc'] <= 1
        assert 0 <= metrics['accuracy'] <= 1


class TestDKTIntegration:
    """Integration tests for DKT workflow"""

    def test_end_to_end_prediction(self):
        """Test complete workflow: encode → forward → predict"""
        num_concepts = 20
        model = DKTModel(num_concepts=num_concepts, hidden_dim=64)

        # Create practice sequence
        sequence = [
            {'concept_id': 0, 'is_correct': True},
            {'concept_id': 1, 'is_correct': False},
            {'concept_id': 0, 'is_correct': True},
            {'concept_id': 2, 'is_correct': True},
        ]

        # Encode
        encoded = encode_practice_sequence(sequence, num_concepts)
        inputs = torch.FloatTensor(encoded)

        # Predict
        prob = model.predict_next(inputs, concept_id=0)

        assert isinstance(prob, float)
        assert 0 <= prob <= 1

    def test_batch_processing(self):
        """Test processing multiple learners in batch"""
        num_concepts = 15
        batch_size = 8
        seq_len = 6
        model = DKTModel(num_concepts=num_concepts)

        # Batch input
        batch_input = torch.randn(batch_size, seq_len, num_concepts * 2)

        output, _ = model(batch_input)

        assert output.shape == (batch_size, seq_len, num_concepts)
        # All outputs valid probabilities
        assert torch.all(output >= 0)
        assert torch.all(output <= 1)

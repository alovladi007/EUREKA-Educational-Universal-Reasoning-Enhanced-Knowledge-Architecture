"""
EUREKA Pedagogical Intelligence Layer - Deep Knowledge Tracing (DKT)

Implements DKT using GRU for tracking learner knowledge states over time.
Predicts mastery probability for each concept given practice sequence.

References:
- Piech et al. (2015) "Deep Knowledge Tracing"
- https://arxiv.org/abs/1506.05908
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class DKTModel(nn.Module):
    """
    Deep Knowledge Tracing Model using GRU.

    Input: Sequence of (concept_id, correct/incorrect) tuples
    Output: Probability of correctness for next item in each concept
    """

    def __init__(
        self,
        num_concepts: int,
        hidden_dim: int = 128,
        num_layers: int = 2,
        dropout: float = 0.2
    ):
        """
        Initialize DKT model.

        Args:
            num_concepts: Number of unique concepts/skills
            hidden_dim: Hidden dimension for GRU
            num_layers: Number of GRU layers
            dropout: Dropout rate
        """
        super(DKTModel, self).__init__()

        self.num_concepts = num_concepts
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers

        # Input dimension: concept_id (one-hot) + correctness (binary) = num_concepts * 2
        self.input_dim = num_concepts * 2

        # Embedding layer for input
        self.input_embed = nn.Linear(self.input_dim, hidden_dim)

        # GRU layers
        self.gru = nn.GRU(
            input_size=hidden_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )

        # Output layer: predict probability for each concept
        self.output = nn.Linear(hidden_dim, num_concepts)

        # Dropout
        self.dropout = nn.Dropout(dropout)

    def forward(
        self,
        x: torch.Tensor,
        hidden: Optional[torch.Tensor] = None
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Forward pass.

        Args:
            x: Input tensor of shape (batch_size, seq_len, input_dim)
            hidden: Initial hidden state

        Returns:
            tuple: (output probabilities, final hidden state)
        """
        # Embed input
        embedded = self.input_embed(x)
        embedded = self.dropout(embedded)

        # GRU forward
        gru_out, hidden = self.gru(embedded, hidden)

        # Output layer
        output = self.output(gru_out)

        # Apply sigmoid for probabilities
        output = torch.sigmoid(output)

        return output, hidden

    def predict_next(
        self,
        sequence: torch.Tensor,
        concept_id: int
    ) -> float:
        """
        Predict probability of correctness for next item in a specific concept.

        Args:
            sequence: Practice sequence tensor
            concept_id: Target concept ID

        Returns:
            float: Probability of correctness (0-1)
        """
        self.eval()
        with torch.no_grad():
            output, _ = self.forward(sequence.unsqueeze(0))
            # Get prediction for the specific concept at the last timestep
            prob = output[0, -1, concept_id].item()
        return prob


class DKTTrainer:
    """
    Trainer for DKT model.
    """

    def __init__(
        self,
        model: DKTModel,
        learning_rate: float = 0.001,
        device: str = 'cpu'
    ):
        """
        Initialize trainer.

        Args:
            model: DKT model instance
            learning_rate: Learning rate for optimizer
            device: Device to train on ('cpu' or 'cuda')
        """
        self.model = model.to(device)
        self.device = device
        self.optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
        self.criterion = nn.BCELoss()

    def train_epoch(
        self,
        train_data: List[Tuple[np.ndarray, np.ndarray]],
        batch_size: int = 32
    ) -> float:
        """
        Train for one epoch.

        Args:
            train_data: List of (input_sequence, target_labels) tuples
            batch_size: Batch size

        Returns:
            float: Average loss for the epoch
        """
        self.model.train()
        total_loss = 0.0
        num_batches = 0

        # Simple batching (in production, use DataLoader)
        for i in range(0, len(train_data), batch_size):
            batch = train_data[i:i + batch_size]

            # Convert to tensors
            inputs = torch.FloatTensor([x[0] for x in batch]).to(self.device)
            targets = torch.FloatTensor([x[1] for x in batch]).to(self.device)

            # Forward pass
            self.optimizer.zero_grad()
            outputs, _ = self.model(inputs)

            # Calculate loss
            loss = self.criterion(outputs, targets)

            # Backward pass
            loss.backward()
            self.optimizer.step()

            total_loss += loss.item()
            num_batches += 1

        avg_loss = total_loss / num_batches if num_batches > 0 else 0.0
        return avg_loss

    def evaluate(
        self,
        eval_data: List[Tuple[np.ndarray, np.ndarray]]
    ) -> Dict[str, float]:
        """
        Evaluate model on validation data.

        Args:
            eval_data: List of (input_sequence, target_labels) tuples

        Returns:
            dict: Metrics including AUC, accuracy
        """
        self.model.eval()
        all_preds = []
        all_labels = []

        with torch.no_grad():
            for inputs, labels in eval_data:
                inputs_tensor = torch.FloatTensor(inputs).unsqueeze(0).to(self.device)
                labels_tensor = torch.FloatTensor(labels).to(self.device)

                outputs, _ = self.model(inputs_tensor)
                preds = outputs[0].cpu().numpy()

                all_preds.extend(preds.flatten())
                all_labels.extend(labels.flatten())

        # Calculate metrics
        all_preds = np.array(all_preds)
        all_labels = np.array(all_labels)

        # AUC (simplified - use sklearn.metrics.roc_auc_score in production)
        from sklearn.metrics import roc_auc_score, accuracy_score

        auc = roc_auc_score(all_labels, all_preds)
        accuracy = accuracy_score(all_labels, (all_preds > 0.5).astype(int))

        return {
            'auc': auc,
            'accuracy': accuracy,
            'num_samples': len(all_labels)
        }


def encode_practice_sequence(
    sequence: List[Dict],
    num_concepts: int
) -> np.ndarray:
    """
    Encode practice sequence for DKT input.

    Args:
        sequence: List of {concept_id, is_correct} dicts
        num_concepts: Total number of concepts

    Returns:
        np.ndarray: Encoded sequence of shape (seq_len, num_concepts * 2)
    """
    encoded = []

    for item in sequence:
        concept_id = item['concept_id']
        is_correct = item['is_correct']

        # One-hot encoding for concept_id
        concept_onehot = np.zeros(num_concepts)
        concept_onehot[concept_id] = 1.0

        # Combine with correctness
        if is_correct:
            # Correct: concept in first half
            input_vec = np.concatenate([concept_onehot, np.zeros(num_concepts)])
        else:
            # Incorrect: concept in second half
            input_vec = np.concatenate([np.zeros(num_concepts), concept_onehot])

        encoded.append(input_vec)

    return np.array(encoded)


# Example usage
if __name__ == "__main__":
    # Initialize model
    num_concepts = 50
    model = DKTModel(num_concepts=num_concepts, hidden_dim=128, num_layers=2)

    # Create dummy training data
    sequence = [
        {'concept_id': 0, 'is_correct': True},
        {'concept_id': 1, 'is_correct': False},
        {'concept_id': 0, 'is_correct': True},
    ]

    encoded = encode_practice_sequence(sequence, num_concepts)
    print(f"Encoded sequence shape: {encoded.shape}")

    # Predict next item
    inputs = torch.FloatTensor(encoded)
    prob = model.predict_next(inputs, concept_id=0)
    print(f"Probability of correctness for concept 0: {prob:.3f}")

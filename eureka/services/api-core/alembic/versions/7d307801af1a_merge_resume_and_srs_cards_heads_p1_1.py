"""merge resume and srs_cards heads (P1.1)

Revision ID: 7d307801af1a
Revises: resume_001, srs_cards_001
Create Date: 2026-05-31 03:27:17.973734

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7d307801af1a'
down_revision: Union[str, Sequence[str], None] = ('resume_001', 'srs_cards_001')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

"""Correct the Patent Bar product description to the bank it actually sells.

The description seeded in 20260723_add_billing_entitlements said "980
questions incl. 174 official USPTO released-exam questions". The bank has
since grown and the copy did not follow it. Counted from the arrays the
QBank itself loads:

    536 authored
  + 270 gap-fill (65 ethics + 66 design/plant + 40 PCT + 44 post-issuance
        + 55 top-up)
  + 828 official USPTO released-exam questions, spanning nine sitting
        dates AM and PM (Nov 1999 through Oct 2003)
  = 1,634

Both numbers in the old copy were wrong, and both understated the product,
so no customer was oversold - but a paid product's own description has to
be true in either direction. This is the same 1,634 that QBANK_SIZES and
exam-surfaces.ts carry, so all three now agree.

The earlier migration is left as written: it is history, and rewriting an
applied migration would make the two environments disagree about what ran.

Revision ID: pb_product_copy_001
Revises: mcat_passages_001
"""
from alembic import op
import sqlalchemy as sa


revision = "pb_product_copy_001"
down_revision = "mcat_passages_001"
branch_labels = None
depends_on = None


NEW = (
    "Full QBank (1,634 questions, including 828 official USPTO "
    "released-exam questions from nine sittings, Nov 1999 to Oct 2003), "
    "timed Real Exam Mode mocks, flashcards, MPEP workbench, and "
    "analytics. One-time purchase."
)

OLD = (
    "Full QBank (980 questions incl. 174 official USPTO released-exam "
    "questions), timed Real Exam Mode mocks, flashcards, MPEP workbench, "
    "and analytics. One-time purchase."
)


def upgrade() -> None:
    op.execute(
        sa.text("UPDATE products SET description = :d WHERE sku = :s").bindparams(
            d=NEW, s="patent_bar_full"
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text("UPDATE products SET description = :d WHERE sku = :s").bindparams(
            d=OLD, s="patent_bar_full"
        )
    )

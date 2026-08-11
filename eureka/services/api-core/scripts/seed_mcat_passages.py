#!/usr/bin/env python3
"""Seed the first MCAT passage sets (C2, AUDIT MC-8).

Two original passages - one Chem/Phys experiment with data, one CARS
humanities excerpt - each with four attached items. All content here is
AI-authored and lands as review_status=DRAFT with source AI_GENERATED,
same standing as the discrete bank: nothing is presented as SME-reviewed,
and the serving layer decides what DRAFT content may be used for.

Idempotent on metadata source_id. Run inside the container:

  docker exec eureka-api-core python scripts/seed_mcat_passages.py
"""

from __future__ import annotations

import asyncio
import os
import sys
from uuid import uuid4

sys.path.insert(0, "/app")

from sqlalchemy import select  # noqa: E402
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine  # noqa: E402

from app.models.item_bank import (  # noqa: E402
    Item, ItemBank, ItemKind, ItemReviewStatus, ItemSource, ItemSourceKind,
    Passage,
)

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+asyncpg://eureka:eureka_dev_password@db:5432/eureka",
)
if DB_URL.startswith("postgresql://"):
    DB_URL = DB_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

BANK_SLUG = "mcat-qbank-v1"

PASSAGES = [
    {
        "source_id": "mcat_passage_chem_001",
        "topic_id": 0,
        "section": "Chemical and Physical Foundations",
        "title": "Spectrophotometric determination of an enzyme's kinetic parameters",
        "body": (
            "Lactate dehydrogenase (LDH) catalyzes the reversible reduction of "
            "pyruvate to lactate, oxidizing NADH to NAD+ in the process. Because "
            "NADH absorbs strongly at 340 nm while NAD+ does not, the reaction "
            "can be followed by the decrease in absorbance at 340 nm.\n\n"
            "A student measured initial reaction velocities at fixed enzyme "
            "concentration while varying pyruvate concentration, keeping NADH "
            "saturating. Selected results:\n\n"
            "  [Pyruvate] (mM)   Initial velocity (uM NADH/min)\n"
            "  0.05              12\n"
            "  0.10              20\n"
            "  0.40              40\n"
            "  2.00              48\n"
            "  10.0              50\n\n"
            "In a second experiment, the student repeated the 0.40 mM "
            "measurement in the presence of oxamate, a molecule structurally "
            "similar to pyruvate. The measured velocity fell to 18 uM/min, but "
            "at 10.0 mM pyruvate the velocity with oxamate present returned to "
            "approximately 50 uM/min.\n\n"
            "The student also noted that below pH 6, the measured velocities "
            "at every substrate concentration decreased sharply, and that "
            "prolonged incubation at 55 C abolished activity entirely."
        ),
        "items": [
            {
                "source_id": "mcat_passage_chem_001_q1",
                "stem": "Based on the data, the approximate Vmax of the reaction is:",
                "options": ["12 uM/min", "25 uM/min", "50 uM/min", "100 uM/min"],
                "correct_index": 2,
                "explanation": (
                    "Velocity plateaus near 48-50 uM/min as substrate rises from "
                    "2.0 to 10.0 mM; the asymptote, not the highest measured "
                    "point alone, estimates Vmax at about 50 uM/min."
                ),
                "difficulty": 1,
                "subtopic": "Enzyme Kinetics - Vmax from data",
            },
            {
                "source_id": "mcat_passage_chem_001_q2",
                "stem": "The Km for pyruvate is closest to:",
                "options": ["0.05 mM", "0.1 mM", "0.4 mM", "2.0 mM"],
                "correct_index": 1,
                "explanation": (
                    "Km is the substrate concentration at half of Vmax "
                    "(about 25 uM/min here). Velocity is 20 uM/min at 0.10 mM "
                    "and 40 uM/min at 0.40 mM, so half-maximal velocity falls "
                    "nearest 0.1 mM."
                ),
                "difficulty": 2,
                "subtopic": "Enzyme Kinetics - Km from data",
            },
            {
                "source_id": "mcat_passage_chem_001_q3",
                "stem": (
                    "The behavior of oxamate is most consistent with which mode "
                    "of inhibition?"
                ),
                "options": [
                    "Competitive inhibition",
                    "Noncompetitive inhibition",
                    "Uncompetitive inhibition",
                    "Irreversible inactivation",
                ],
                "correct_index": 0,
                "explanation": (
                    "Oxamate resembles the substrate, lowers velocity at "
                    "moderate substrate concentration, and its effect is "
                    "overcome at high substrate - the signature of competition "
                    "for the active site: Vmax unchanged, apparent Km raised."
                ),
                "difficulty": 2,
                "subtopic": "Enzyme Kinetics - inhibition modes",
            },
            {
                "source_id": "mcat_passage_chem_001_q4",
                "stem": (
                    "The loss of all activity after prolonged incubation at "
                    "55 C is best explained by:"
                ),
                "options": [
                    "Denaturation disrupting the enzyme's tertiary structure",
                    "Competitive inhibition by heat-generated products",
                    "A shift in the reaction equilibrium toward pyruvate",
                    "Depletion of NADH at elevated temperature",
                ],
                "correct_index": 0,
                "explanation": (
                    "Sustained heat unfolds the protein: tertiary structure, "
                    "and with it the active site, is lost. Equilibrium shifts "
                    "or substrate depletion would slow the assay, not abolish "
                    "catalytic capacity."
                ),
                "difficulty": 1,
                "subtopic": "Proteins - denaturation",
            },
        ],
    },
    {
        "source_id": "mcat_passage_cars_001",
        "topic_id": 1,
        "section": "Critical Analysis and Reasoning Skills",
        "title": "On the restoration of paintings",
        "body": (
            "Every restoration of a painting is an argument. The restorer who "
            "removes a yellowed varnish asserts that the colors beneath are "
            "what the painter intended; the one who leaves it asserts that "
            "time's mediation has itself become part of the work. Neither can "
            "prove the claim, because the referent - the painting as it left "
            "the easel - no longer exists anywhere but in inference.\n\n"
            "Critics of aggressive cleaning point to the controversies that "
            "followed several famous restorations, where figures once veiled "
            "in shadow emerged in colors their admirers found garish. The "
            "shadows, restorers replied, were dirt. But the critics' deeper "
            "objection was not chromatic. It was that centuries of viewers "
            "had built the painting's meaning out of precisely those "
            "accidents, and that scraping them away traded a work with a "
            "history for a hypothesis with a fresh surface.\n\n"
            "The restorer's dilemma will not be resolved by better chemistry. "
            "Solvent analysis can say what is original pigment and what is "
            "later accretion; it cannot say which of the two the work is. "
            "That is a question about what we take a painting to be - an "
            "object made once, or a thing that accumulates itself over time - "
            "and it is answered, tacitly, every time a conservator lifts or "
            "lowers a swab."
        ),
        "items": [
            {
                "source_id": "mcat_passage_cars_001_q1",
                "stem": "The central claim of the passage is that:",
                "options": [
                    "Restoration decisions rest on a contested conception of what an artwork is",
                    "Chemical analysis has made restoration disputes obsolete",
                    "Paintings should never be cleaned once they have aged",
                    "Viewers prefer restored paintings to unrestored ones",
                ],
                "correct_index": 0,
                "explanation": (
                    "The passage frames every restoration as an argument about "
                    "whether the work is the original object or its accumulated "
                    "history, and says chemistry cannot settle that question. "
                    "It never counsels against cleaning as such."
                ),
                "difficulty": 1,
                "subtopic": "CARS - Main idea",
            },
            {
                "source_id": "mcat_passage_cars_001_q2",
                "stem": (
                    "The author's statement that solvent analysis 'cannot say "
                    "which of the two the work is' functions to:"
                ),
                "options": [
                    "Show that a scientific finding leaves the underlying question untouched",
                    "Discredit the accuracy of modern solvent analysis",
                    "Argue that restorers ignore chemical evidence",
                    "Demonstrate that original pigment cannot be identified",
                ],
                "correct_index": 0,
                "explanation": (
                    "The sentence concedes chemistry's power to distinguish "
                    "pigment from accretion, then denies that this settles the "
                    "interpretive question - the science is accurate but "
                    "beside the point."
                ),
                "difficulty": 2,
                "subtopic": "CARS - Function of a statement",
            },
            {
                "source_id": "mcat_passage_cars_001_q3",
                "stem": (
                    "According to the passage, the critics' 'deeper objection' "
                    "to aggressive cleaning was that it:"
                ),
                "options": [
                    "Replaced a historically accumulated work with a conjecture",
                    "Produced colors that were unpleasant to look at",
                    "Used solvents that damaged original pigment",
                    "Was performed without consulting the painter's heirs",
                ],
                "correct_index": 0,
                "explanation": (
                    "The passage explicitly subordinates the chromatic "
                    "complaint ('not chromatic') to the loss of meaning built "
                    "on the painting's accidents - 'traded a work with a "
                    "history for a hypothesis with a fresh surface.'"
                ),
                "difficulty": 1,
                "subtopic": "CARS - Detail in context",
            },
            {
                "source_id": "mcat_passage_cars_001_q4",
                "stem": (
                    "Which new finding would most WEAKEN the author's claim "
                    "that the restorer's dilemma 'will not be resolved by "
                    "better chemistry'?"
                ),
                "options": [
                    "A method proving which surface state the painter approved for display",
                    "A solvent that removes varnish without touching pigment",
                    "Evidence that varnish yellows faster than previously thought",
                    "A survey showing most museum visitors favor cleaned paintings",
                ],
                "correct_index": 0,
                "explanation": (
                    "The author says the missing referent is the painter's "
                    "intended object. A method recovering the artist's own "
                    "sanctioned state would supply exactly the fact the author "
                    "calls unavailable; gentler solvents or opinion surveys "
                    "leave the interpretive question standing."
                ),
                "difficulty": 3,
                "subtopic": "CARS - Weaken the argument",
            },
        ],
    },
]


async def main() -> None:
    engine = create_async_engine(DB_URL)
    maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with maker() as db:
        bank = (
            await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
        ).scalar_one_or_none()
        if bank is None:
            sys.exit(f"bank {BANK_SLUG} not seeded; run seed_mcat_item_bank.py first")

        existing_passages = {
            row.extra_metadata.get("source_id")
            for row in (
                await db.execute(select(Passage).where(Passage.bank_id == bank.id))
            ).scalars()
        }
        created_p = created_i = 0
        for spec in PASSAGES:
            if spec["source_id"] in existing_passages:
                continue
            passage = Passage(
                bank_id=bank.id,
                title=spec["title"],
                body=spec["body"],
                topic_id=spec["topic_id"],
                section=spec["section"],
                review_status=ItemReviewStatus.DRAFT,
                source_kind=ItemSourceKind.AI_GENERATED,
                attribution="EUREKA (AI-generated, pending SME review)",
                extra_metadata={"source_id": spec["source_id"]},
            )
            db.add(passage)
            await db.flush()
            created_p += 1
            for q in spec["items"]:
                item = Item(
                    bank_id=bank.id,
                    family_id=uuid4(),
                    passage_id=passage.id,
                    kind=ItemKind.MCQ_SINGLE,
                    content={
                        "stem": q["stem"],
                        "options": q["options"],
                        "correct_index": q["correct_index"],
                    },
                    explanation=q["explanation"],
                    difficulty_nominal={1: "easy", 2: "medium", 3: "hard"}[q["difficulty"]],
                    estimated_time_sec=90,
                    review_status=ItemReviewStatus.DRAFT,
                    tags=[q["subtopic"]],
                    extra_metadata={
                        "source_id": q["source_id"],
                        "topic_id": spec["topic_id"],
                        "section": spec["section"],
                        "subtopic": q["subtopic"],
                    },
                )
                db.add(item)
                await db.flush()
                db.add(
                    ItemSource(
                        item_id=item.id,
                        source_kind=ItemSourceKind.AI_GENERATED,
                        source_uri="scripts/seed_mcat_passages.py",
                        source_name="EUREKA passage seed",
                        license=bank.default_license,
                        attribution=passage.attribution,
                    )
                )
                created_i += 1
        await db.commit()
        print(f"created {created_p} passages, {created_i} attached items")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())

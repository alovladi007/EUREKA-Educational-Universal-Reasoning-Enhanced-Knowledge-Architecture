"""Register the three AXIOM courses as first-party marketplace products.

Integration Work Plan Section 3 ("Catalog"): AXIOM's courses become EUREKA
products so a purchase unlocks the paid units. Each course title carries the
[axiom:<sku>] tag the entitlement emitter resolves; listings are published at
$29 so checkout exercises the stub-confirm flow (first-party, no Stripe
Connect). Idempotent by course code. Run inside the api-core container:

    python scripts/seed_axiom_catalog.py
"""

from __future__ import annotations

import asyncio
import uuid

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models import Course, Organization, User
from app.models.marketplace import (
    CourseListing,
    CoursePricing,
    InstructorProfile,
    ListingStatus,
)

CATALOG = [
    ("AXIOM-LA", "Linear Algebra [axiom:axiom-linear-algebra]",
     "axiom-linear-algebra-course",
     "Applied linear algebra: vectors and systems through eigenvalues, "
     "least squares, and the SVD. CAS-verified practice at scale."),
    ("AXIOM-ODE", "Ordinary Differential Equations [axiom:axiom-odes]",
     "axiom-odes-course",
     "First-order through systems, Laplace transforms, series solutions, and "
     "stability. Every answer graded by verification."),
    ("AXIOM-PF", "PDEs and Fourier Analysis [axiom:axiom-pdes-fourier]",
     "axiom-pdes-fourier-course",
     "Fourier series and transforms, the heat and wave equations, "
     "Sturm-Liouville theory, characteristics, and Green's functions."),
]


async def main() -> None:
    async with AsyncSessionLocal() as db:
        org = (await db.execute(select(Organization).limit(1))).scalars().first()
        # First-party catalog: any existing user serves as the profile owner.
        owner = (await db.execute(select(User).limit(1))).scalars().first()
        if org is None or owner is None:
            raise SystemExit("need at least one organization and one user")

        instructor = (
            await db.execute(
                select(InstructorProfile).where(InstructorProfile.public_slug == "axiom")
            )
        ).scalars().first()
        if instructor is None:
            instructor = InstructorProfile(
                user_id=owner.id, public_slug="axiom", display_name="AXIOM (EUREKA)",
                headline="First-party engineering mathematics courses",
                expertise_tags=["mathematics", "engineering"],
            )
            db.add(instructor)
            await db.flush()

        created = 0
        for code, title, slug, summary in CATALOG:
            course = (
                await db.execute(select(Course).where(Course.code == code))
            ).scalars().first()
            if course is None:
                course = Course(
                    id=uuid.uuid4(), org_id=org.id, code=code, title=title,
                    tier="undergraduate",
                )
                db.add(course)
                await db.flush()
            listing = (
                await db.execute(
                    select(CourseListing).where(CourseListing.course_id == course.id)
                )
            ).scalars().first()
            if listing is None:
                db.add(CourseListing(
                    course_id=course.id, instructor_id=instructor.id, slug=slug,
                    headline=title, summary_md=summary,
                    tags=["axiom", "mathematics"],
                    status=ListingStatus.published.value,
                ))
                db.add(CoursePricing(course_id=course.id, list_price_cents=2900))
                created += 1
        await db.commit()
        print(f"axiom catalog: instructor={instructor.public_slug} listings created={created}")


asyncio.run(main())

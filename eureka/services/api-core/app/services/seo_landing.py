"""
Phase 11.2 — Programmatic SEO.

Builds skill-level landing pages from the existing Phase 4.2 skill graph.
Generated pages include H1, meta title/description, schema.org Course +
FAQPage JSON-LD, related marketplace listings, and a deterministic body
stub the SEO team can override.

Endpoints call `generate_or_refresh(skill)` to (re)write the row; the page
isn't published automatically — admins flip `is_published=True` after review.
"""

from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.gtm import SkillLandingPage
from app.models.marketplace import CourseListing, ListingStatus
from app.models.skill import Skill


_SLUG_RE = re.compile(r"[^a-z0-9]+")


def _slugify(value: str) -> str:
    return _SLUG_RE.sub("-", value.lower()).strip("-")[:160]


async def generate_or_refresh(
    db: AsyncSession,
    *,
    skill: Skill,
    locale: str = "en",
    publish: bool = False,
) -> SkillLandingPage:
    framework = skill.framework.value if hasattr(skill.framework, "value") else str(skill.framework)
    slug = f"{framework.lower()}-{_slugify(skill.code)}"

    q = await db.execute(
        select(SkillLandingPage).where(
            SkillLandingPage.skill_code == skill.code,
            SkillLandingPage.framework == framework,
            SkillLandingPage.locale == locale,
        )
    )
    page = q.scalar_one_or_none()
    is_new = page is None

    title_base = (skill.name or skill.code).strip()
    h1 = f"Master {title_base} — adaptive practice & explanations"
    meta_title = f"{title_base} | EUREKA"[:240]
    meta_desc = (
        f"Adaptive practice, AI tutor, and exam-style questions for "
        f"{title_base}. Track mastery, get personalised recommendations, "
        f"and prep for {framework} exams on EUREKA."
    )[:320]

    # Pull related published marketplace listings tagged with this skill.
    related_q = await db.execute(
        select(CourseListing).where(
            CourseListing.status == ListingStatus.published.value,
            CourseListing.target_skill_codes.any(skill.code),
        ).limit(8)
    )
    related = list(related_q.scalars().all())

    faq = [
        {
            "q": f"What is {title_base}?",
            "a": skill.description or f"{title_base} is a key concept in {framework}.",
        },
        {
            "q": f"How long does it take to master {title_base}?",
            "a": (
                "It depends on your current mastery — EUREKA's adaptive engine "
                "tracks your progress and surfaces the right next question for you."
            ),
        },
        {
            "q": f"What questions appear on the exam for {title_base}?",
            "a": (
                f"EUREKA has real-style {framework} items tagged to this skill, "
                "with full explanations and IRT-calibrated difficulty."
            ),
        },
    ]

    schema_jsonld = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": h1,
        "description": meta_desc,
        "provider": {"@type": "Organization", "name": "EUREKA", "sameAs": "https://eureka.example"},
        "educationalCredentialAwarded": framework,
        "about": [{"@type": "Thing", "name": title_base, "identifier": skill.code}],
        "hasCourseInstance": [
            {"@type": "CourseInstance", "courseMode": "online"},
        ],
        "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": item["q"],
                    "acceptedAnswer": {"@type": "Answer", "text": item["a"]},
                }
                for item in faq
            ],
        },
    }

    body_md = (
        f"# {h1}\n\n"
        f"_Framework: **{framework}**, skill code `{skill.code}`._\n\n"
        f"{skill.description or ''}\n\n"
        "## Why EUREKA?\n"
        "- IRT-calibrated questions written for the exam\n"
        "- AI tutor with citations to source material\n"
        "- Spaced-repetition keeps you sharp until exam day\n\n"
        "## Frequently asked questions\n"
    )
    for item in faq:
        body_md += f"\n**{item['q']}**\n\n{item['a']}\n"

    if page is None:
        page = SkillLandingPage(
            skill_code=skill.code,
            framework=framework,
            slug=slug,
            locale=locale,
            h1=h1,
            meta_title=meta_title,
            meta_description=meta_desc,
            body_md=body_md,
            faq=faq,
            schema_jsonld=schema_jsonld,
            related_listing_ids=[l.id for l in related],
            related_item_ids=[],
            is_published=publish,
            last_generated_at=datetime.now(timezone.utc),
        )
        db.add(page)
    else:
        page.h1 = h1
        page.meta_title = meta_title
        page.meta_description = meta_desc
        page.body_md = body_md
        page.faq = faq
        page.schema_jsonld = schema_jsonld
        page.related_listing_ids = [l.id for l in related]
        page.last_generated_at = datetime.now(timezone.utc)
        if publish:
            page.is_published = True

    await db.commit()
    await db.refresh(page)
    return page

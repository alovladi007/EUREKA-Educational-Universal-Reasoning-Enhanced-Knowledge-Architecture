#!/usr/bin/env python3
"""One-off seed for /dashboard/undergraduate so it stops looking empty.

State going in (verified 2026-05-23):
  - /tier-enrollments/me            → [] (admin has no UG enrolment)
  - /courses/?tier=undergraduate    → 15 rows, ALL is_published=false,
                                       titles like "no pricing" / codes like
                                       "P10-NO-PRICE-ba628a". Auto-generated
                                       test fixtures from an old pricing test
                                       run, never cleaned up. The frontend now
                                       filters is_published=true so they
                                       disappear; we don't need to delete them.
  - /resources?tier=undergraduate   → has real content (Three.js editor, etc.)

What this does (idempotent):
  1. Create (or skip) a tier_enrollment for the admin in tier=undergraduate
     with framework=acm and a 2028 target graduation. So the "Enrollments"
     card shows 1, the page surfaces a real status, and the recommender
     filters by an active tier.
  2. PATCH 4 of the existing junk fixtures into realistic published courses
     covering the breadth of an undergrad catalog:
       Calc II  (math, ABET-aligned)
       Intro to CS  (computing, ACM-aligned)
       Macroeconomics  (social science, AACSB-aligned)
       English Composition  (humanities, general-ed)
     This is cheaper than CourseCreate (which validates org tier matches
     and forces a unique code) and it cleans up the worst of the fixture
     noise at the same time.
  3. Leaves the remaining 11 junk fixtures alone — they stay unpublished
     and are filtered out by the frontend.

Why not delete the fixtures? `DELETE /courses/{id}` returns 204 but if any
of these are referenced by old enrolments / submissions / assessments the
delete would cascade or fail. Renaming a handful + leaving the rest as
unpublished noise is the safer move and matches what we did for the
graduate placeholder ("archive, don't delete").

Run: python3 scripts/seed_undergrad_demo.py
"""
import json
import urllib.request
import urllib.error

BASE = "http://localhost:8000/api/v1"

# 1. Auth as seeded admin (matches seed_graduate_demo.py).
r = urllib.request.urlopen(
    urllib.request.Request(
        f"{BASE}/auth/login",
        method="POST",
        data=json.dumps(
            {"email": "you@eureka.example.com", "password": "EurekaAdmin!2026"}
        ).encode(),
        headers={"Content-Type": "application/json"},
    )
)
TOK = json.loads(r.read())["access_token"]
HDRS = {"Content-Type": "application/json", "Authorization": f"Bearer {TOK}"}


def req(method, path, body=None):
    r = urllib.request.Request(
        f"{BASE}{path}",
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers=HDRS,
    )
    try:
        resp = urllib.request.urlopen(r)
        text = resp.read()
        return resp.status, (json.loads(text) if text else None)
    except urllib.error.HTTPError as e:
        body = e.read() or b"{}"
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"_raw": body.decode("utf-8", "replace")}


# 2. Tier enrollment — skip if one is already active.
print("=== tier enrollment ===")
_, existing = req("GET", "/tier-enrollments/me")
existing = existing or []
have_ug = [
    e
    for e in existing
    if e.get("tier") == "undergraduate" and e.get("status") in ("active", "pending")
]
# Idempotency: if there's already a UG enrolment but it's missing the
# framework/major in tier_context (e.g. seeded by an earlier broken
# version of this script), upgrade it via PATCH rather than skipping —
# otherwise re-running gives no improvement.
if have_ug:
    e0 = have_ug[0]
    ctx = e0.get("tier_context") or {}
    if not ctx.get("framework") or not ctx.get("major"):
        status, body = req(
            "PATCH",
            f"/tier-enrollments/me/{e0['id']}",
            {
                "status": "active",
                            # NB: target_completion_at column is TIMESTAMP WITHOUT TIME ZONE,
            # so send a naive ISO-8601 (no trailing 'Z') — sending '…Z' makes
            # asyncpg raise "can't subtract offset-naive and offset-aware".
            "target_completion_at": "2028-05-31T00:00:00",
                "tier_context": {
                    "framework": "acm",
                    "major": "Computer Science",
                    "minor": "Mathematics",
                    "expected_credits": 120,
                },
            },
        )
        if status >= 400:
            print(f"  upgrade-existing failed: {status} {body}")
        else:
            print(f"  ✓ upgraded existing enrollment (id={e0['id'][:8]})")
    else:
        print(f"  already enrolled in undergraduate (id={e0['id'][:8]}) — skip")
else:
    # NB: TierEnrollmentCreate (services/api-core/app/schemas/learner.py)
    # accepts tier / tier_context / status / target_completion_at /
    # extra_metadata. There is no top-level `framework` or `target_date`;
    # those go into tier_context. Earlier version of this script set
    # `framework="acm"` at the top level and asyncpg silently dropped it.
    status, body = req(
        "POST",
        "/tier-enrollments/me",
        {
            "tier": "undergraduate",
            "status": "active",
                        # NB: target_completion_at column is TIMESTAMP WITHOUT TIME ZONE,
            # so send a naive ISO-8601 (no trailing 'Z') — sending '…Z' makes
            # asyncpg raise "can't subtract offset-naive and offset-aware".
            "target_completion_at": "2028-05-31T00:00:00",
            "tier_context": {
                "framework": "acm",
                "major": "Computer Science",
                "minor": "Mathematics",
                "expected_credits": 120,
            },
        },
    )
    if status >= 400:
        print(f"  enrol failed: {status} {body}")
    else:
        print(f"  ✓ enrolled (id={body['id'][:8]})")


# 3. Convert 4 junk fixtures into real published courses.
print("=== courses ===")
_, listing = req("GET", "/courses/?limit=50&tier=undergraduate&is_archived=false")
items = (listing or {}).get("items", [])
# Skip codes we already created on a prior run — without this, a re-run
# tries to PATCH a different junk fixture into the same code and the
# unique_course_code_per_org index slams the door.
existing_codes = {c.get("code") for c in items if c.get("code")}
# Pick the first 4 unpublished test fixtures (the "P10-…" / "no pricing" rows).
junk = [c for c in items if not c.get("is_published")][:4]

PATCHES = [
    {
        "title": "Calculus II",
        "code": "MATH-201",
        "description": "Integration techniques, sequences and series, parametric and polar coordinates, and an introduction to multivariable calculus. The single most-transferred-credit course at most US undergrad programs.",
        "subject": "mathematics",
        "level": "intermediate",
        "credits": 4,
        "learning_objectives": [
            "Evaluate integrals using substitution, parts, partial fractions, and trig substitution",
            "Determine convergence of infinite series via comparison, ratio, and integral tests",
            "Compute arc length, surface area, and volumes of revolution",
            "Translate between Cartesian, polar, and parametric representations",
        ],
        "standards": {"abet": ["Math.Calculus.II"], "ccss": ["HSF-IF.C.7"]},
        "is_published": True,
    },
    {
        "title": "Introduction to Computer Science",
        "code": "CS-101",
        "description": "Foundations of computing using Python: variables, control flow, functions, data structures, file I/O, recursion, and a first taste of object-oriented design. Pair-programming labs and 6 small projects.",
        "subject": "computer_science",
        "level": "introductory",
        "credits": 4,
        "learning_objectives": [
            "Write, debug, and test Python programs up to ~300 lines",
            "Reason about runtime and memory cost of basic algorithms",
            "Use lists, dictionaries, sets, and tuples idiomatically",
            "Decompose a problem into functions with clear contracts",
        ],
        "standards": {
            "acm": ["CS1.Programming", "CS1.AlgorithmicThinking"],
            "ieee": ["SE.Foundations"],
        },
        "is_published": True,
    },
    {
        "title": "Principles of Macroeconomics",
        "code": "ECON-202",
        "description": "Aggregate measures (GDP, CPI, unemployment), the IS-LM and AD-AS frameworks, monetary and fiscal policy, growth theory, and an empirical look at three modern macro episodes (2008, 2020, 2022 inflation).",
        "subject": "economics",
        "level": "introductory",
        "credits": 3,
        "learning_objectives": [
            "Interpret National Income and Product Account data",
            "Diagram the short-run and long-run effects of policy shocks in AD-AS",
            "Compare monetarist, Keynesian, and neoclassical responses to recessions",
            "Critique a recent macro policy decision with reference to data",
        ],
        "standards": {"aacsb": ["Econ.Macro"]},
        "is_published": True,
    },
    {
        "title": "English Composition I",
        "code": "ENGL-101",
        "description": "Academic argument and rhetorical analysis. Four major essays (descriptive, analytical, argumentative, research) with peer review and instructor conferences. Required general-ed at most undergrad programs.",
        "subject": "english",
        "level": "introductory",
        "credits": 3,
        "learning_objectives": [
            "Construct an arguable thesis supported by evidence",
            "Use MLA / APA citation accurately",
            "Revise based on substantive peer and instructor feedback",
            "Distinguish summary, analysis, and argument in academic writing",
        ],
        "standards": {"liberal_arts": ["Writing.College"], "ccss": ["W.11-12.1"]},
        "is_published": True,
    },
]

if len(junk) < len(PATCHES):
    print(
        f"  WARN: only {len(junk)} unpublished fixtures available, want {len(PATCHES)}"
    )

for patch in PATCHES:
    if patch["code"] in existing_codes:
        print(f"  · {patch['code']}: already present — skip")
        continue
    if not junk:
        print(f"  · {patch['code']}: no junk fixtures left to repurpose — skip")
        continue
    course = junk.pop(0)
    cid = course["id"]
    status, body = req("PATCH", f"/courses/{cid}", patch)
    if status >= 400:
        # Put it back so the next patch can try
        junk.insert(0, course)
        print(f"  patch {cid[:8]} → {status} {body}")
    else:
        print(f"  ✓ {patch['code']}: {patch['title']}")

print()
print("=== verify ===")
_, listing = req(
    "GET", "/courses/?limit=50&tier=undergraduate&is_published=true&is_archived=false"
)
items = (listing or {}).get("items", [])
print(f"  published undergrad courses now visible: {len(items)}")
for c in items:
    print(f"    - {c.get('code','?'):<10} {c.get('title','?')}")

_, mine = req("GET", "/tier-enrollments/me")
ug = [e for e in (mine or []) if e.get("tier") == "undergraduate"]
print(f"  my undergrad enrollments: {len(ug)}")
for e in ug:
    ctx = e.get("tier_context") or {}
    print(
        f"    - status={e.get('status')} framework={ctx.get('framework')} "
        f"major={ctx.get('major')} target={e.get('target_completion_at')}"
    )

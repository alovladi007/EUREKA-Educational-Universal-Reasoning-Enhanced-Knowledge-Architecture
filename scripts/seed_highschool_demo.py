#!/usr/bin/env python3
"""One-off seed for /dashboard/high-school so the page populates.

State going in (verified 2026-05-23):
  - /tier-enrollments/me (filtered to high_school) → 0
  - /courses/?tier=high_school → 0 rows (NOT junk, just empty —
    course-create enforces course.tier == org.tier, and the demo org
    "Demo University" is tier=undergraduate; we can't create HS courses
    against this org without changing org tier first, which would break
    the undergrad page. Leaving courses empty is honest.)
  - /resources?tier=high_school → 4 real rows (PhET, Universe Sandbox,
    NASA Eyes, MolView). Those will populate the Resources card.

What this does (idempotent):
  1. Upsert a tier_enrollment for the admin in tier=high_school with
     framework=ngss, grade_level=12, school="Demo High School", and a
     target_completion_at of 2027-06-15 (graduation). This makes the
     Enrollments card render with a real status / framework / target
     instead of an empty state.

What this DOESN'T do:
  - Create HS courses (blocked by org-tier constraint, see above).
  - Touch existing UG enrolment (a user can have multiple tier
    enrolments — that's the whole point of `N per User`).

Run: python3 scripts/seed_highschool_demo.py
"""
import json
import urllib.request
import urllib.error

BASE = "http://localhost:8000/api/v1"

# 1. Auth as seeded admin.
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


CONTEXT = {
    "framework": "ngss",
    "grade_level": "12",
    "school": "Demo High School",
    "intended_majors": ["computer_science", "mathematics"],
    "ap_courses_taken": ["AP CSA", "AP Calculus BC", "AP Physics 1"],
}
TARGET = "2027-06-15T00:00:00"  # naive ISO-8601: column is TIMESTAMP WITHOUT TIME ZONE

print("=== high-school tier enrollment ===")
_, existing = req("GET", "/tier-enrollments/me")
existing = existing or []
have_hs = [
    e
    for e in existing
    if e.get("tier") == "high_school" and e.get("status") in ("active", "pending")
]
if have_hs:
    e0 = have_hs[0]
    ctx = e0.get("tier_context") or {}
    # Idempotent upgrade if context is missing framework/grade
    if not ctx.get("framework") or not ctx.get("grade_level"):
        status, body = req(
            "PATCH",
            f"/tier-enrollments/me/{e0['id']}",
            {
                "status": "active",
                "target_completion_at": TARGET,
                "tier_context": CONTEXT,
            },
        )
        if status >= 400:
            print(f"  upgrade-existing failed: {status} {body}")
        else:
            print(f"  ✓ upgraded existing enrollment (id={e0['id'][:8]})")
    else:
        print(f"  already enrolled in high_school (id={e0['id'][:8]}) — skip")
else:
    status, body = req(
        "POST",
        "/tier-enrollments/me",
        {
            "tier": "high_school",
            "status": "active",
            "target_completion_at": TARGET,
            "tier_context": CONTEXT,
        },
    )
    if status >= 400:
        print(f"  enrol failed: {status} {body}")
    else:
        print(f"  ✓ enrolled (id={body['id'][:8]})")

print()
print("=== verify ===")
_, mine = req("GET", "/tier-enrollments/me")
hs = [e for e in (mine or []) if e.get("tier") == "high_school"]
print(f"  my high_school enrollments: {len(hs)}")
for e in hs:
    ctx = e.get("tier_context") or {}
    print(
        f"    - status={e.get('status')} framework={ctx.get('framework')} "
        f"grade={ctx.get('grade_level')} school={ctx.get('school')!r} "
        f"target={e.get('target_completion_at')}"
    )

# Sanity: confirm courses are still empty (so the user knows what to expect)
_, courses = req("GET", "/courses/?limit=5&tier=high_school&is_published=true")
total = (courses or {}).get("total", 0)
print(f"  published high_school courses: {total} (expected 0 — org-tier constraint)")

# Sanity: confirm resources are visible
_, resources = req("GET", "/resources?tier=high_school&limit=10")
res_list = resources if isinstance(resources, list) else []
print(f"  high_school resources: {len(res_list)}")
for r in res_list[:4]:
    print(f"    - {r.get('title')}")

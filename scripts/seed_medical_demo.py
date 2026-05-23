#!/usr/bin/env python3
"""One-off seed for /dashboard/medical so the Enrollment tab populates.

State going in (verified 2026-05-23):
  - /tier-enrollments/me (filtered to medical) → 0
  - /courses/?tier=medical                     → empty (org is undergraduate-
    tier so course-create rejects medical courses — same constraint that
    blocks the HS seed; see scripts/seed_highschool_demo.py for rationale)
  - /resources?tier=medical                    → unknown until checked

What this does (idempotent):
  1. Upsert a tier_enrollment for the admin in tier=medical with a rich
     tier_context (framework=usmle_step_1, school, year=M3,
     intended_specialty, mocked Step 1 score, completed clerkships) and
     a target_completion_at matching a typical Step 1 sit date. So the
     Overview hero + Enrollment tab render real content instead of an
     empty state.

What this does NOT do:
  - Create medical courses (blocked by org-tier == course-tier).
  - Touch the existing QBank / Cases / Anatomy / OSCE sub-modules — those
    have their own data layers and aren't tier_enrollment-driven.

Run: python3 scripts/seed_medical_demo.py
"""
import json
import urllib.request
import urllib.error

BASE = "http://localhost:8000/api/v1"

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
    "framework": "usmle_step_1",
    "school": "Demo Medical School",
    "year": "M3",
    "intended_specialty": "Internal Medicine",
    "usmle_step_1_score": 248,
    "clerkships_completed": ["internal_medicine", "surgery", "pediatrics"],
}
# Typical Step 2 CK target ~end of M3 → mid-M4. Pick June 2027.
TARGET = "2027-06-15T00:00:00"

print("=== medical tier enrollment ===")
_, existing = req("GET", "/tier-enrollments/me")
existing = existing or []
have_med = [
    e
    for e in existing
    if e.get("tier") == "medical" and e.get("status") in ("active", "pending")
]
if have_med:
    e0 = have_med[0]
    ctx = e0.get("tier_context") or {}
    if not ctx.get("framework") or not ctx.get("school"):
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
        print(f"  already enrolled in medical (id={e0['id'][:8]}) — skip")
else:
    status, body = req(
        "POST",
        "/tier-enrollments/me",
        {
            "tier": "medical",
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
med = [e for e in (mine or []) if e.get("tier") == "medical"]
print(f"  my medical enrollments: {len(med)}")
for e in med:
    ctx = e.get("tier_context") or {}
    print(
        f"    - status={e.get('status')} framework={ctx.get('framework')} "
        f"school={ctx.get('school')!r} year={ctx.get('year')} "
        f"specialty={ctx.get('intended_specialty')!r} "
        f"step1={ctx.get('usmle_step_1_score')} target={e.get('target_completion_at')}"
    )

_, resources = req("GET", "/resources?tier=medical&limit=10")
res_list = resources if isinstance(resources, list) else []
print(f"  medical resources: {len(res_list)}")
for r in res_list[:5]:
    print(f"    - {r.get('title')}")

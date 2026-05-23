#!/usr/bin/env python3
"""Seed realistic /training content: workforce program + assignment +
compliance requirement + engagement activity."""

import json
import urllib.request
import urllib.error

BASE = "http://localhost:8000/api/v1"

r = urllib.request.urlopen(urllib.request.Request(
    f"{BASE}/auth/login", method="POST",
    data=json.dumps({"email": "you@eureka.example.com", "password": "EurekaAdmin!2026"}).encode(),
    headers={"Content-Type": "application/json"},
))
TOK = json.loads(r.read())["access_token"]
HDRS = {"Content-Type": "application/json", "Authorization": f"Bearer {TOK}"}


def req(method, path, body=None):
    r = urllib.request.Request(
        f"{BASE}{path}", method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers=HDRS,
    )
    try:
        resp = urllib.request.urlopen(r)
        text = resp.read()
        return resp.status, (json.loads(text) if text else None)
    except urllib.error.HTTPError as e:
        body_text = e.read() or b"{}"
        try:
            return e.code, json.loads(body_text)
        except Exception:
            return e.code, {"_raw": body_text.decode("utf-8", "replace")}


# 1. Get the existing partnership
status, partnerships = req("GET", "/partnerships")
if not partnerships:
    print("ERROR: no partnership to attach programs to.")
    raise SystemExit(1)
partnership = partnerships[0]
PID = partnership["id"]
USER_ID = "f65c8d72-12f4-49a1-973c-43895dd619d6"  # seeded admin from earlier traces
print(f"using partnership: {partnership['name']} ({PID[:8]})")


# 2. Get-or-create a seat assignment for the admin (so the admin can also be
#    a worker for demo purposes).
status, util = req("GET", f"/partnerships/{PID}/seat-utilisation")
print(f"  seats: {util.get('active_seats', 0)}/{util.get('contracted_seats', 0)} active")
if util.get("active_seats", 0) == 0:
    # bulk-assign just our admin as a worker
    bulk = req("POST", f"/partnerships/{PID}/seats/bulk-assign", {
        "rows": [{"email": "you@eureka.example.com", "role_label": "Senior engineer",
                  "team_label": "Platform team"}],
    })
    print(f"  bulk-assign: {bulk}")


# 3. Create 2 workforce programs
print()
print("=== creating workforce programs ===")
PROGRAMS = [
    {
        "slug": "hipaa-basics-2026",
        "name": "HIPAA Privacy & Security — Annual Refresher",
        "description_md": "Mandatory annual HIPAA refresher covering: minimum-necessary standard, BAAs, incidental disclosures, ePHI safeguards (technical/administrative/physical), breach-notification rule, and patient access rights.",
        "target_role": "any",
        "target_skill_codes": ["WORKFORCE.HIPAA.PRIVACY", "WORKFORCE.HIPAA.SECURITY"],
        "required_cert_codes": ["hipaa-refresher-2026"],
        "duration_weeks": 2,
        "is_mandatory": True,
        "target_mastery": 0.85,
    },
    {
        "slug": "secure-coding-2026",
        "name": "Secure Coding — OWASP Top 10",
        "description_md": "OWASP Top 10 walkthrough with code-review exercises. Covers injection, broken auth, sensitive-data exposure, XXE, broken access control, security misconfig, XSS, deserialization, vulnerable components, insufficient logging.",
        "target_role": "engineer",
        "target_skill_codes": ["WORKFORCE.SECURE_CODE.OWASP"],
        "required_cert_codes": ["secure-coding-2026"],
        "duration_weeks": 4,
        "is_mandatory": False,
        "target_mastery": 0.80,
    },
]

created_programs = []
for p in PROGRAMS:
    status, body = req("POST", f"/partnerships/{PID}/programs", p)
    if status == 201:
        created_programs.append(body)
        print(f"  + {body['name']} (mandatory={body['is_mandatory']})")
    else:
        print(f"  - failed: {status} {body}")


# 4. Assign the admin to BOTH programs
print()
print("=== assigning admin to programs ===")
for pg in created_programs:
    status, body = req("POST", f"/programs/{pg['id']}/assign", {
        "user_ids": [USER_ID],
    })
    print(f"  assigned to {pg['name']}: {status}")


# 5. Create a compliance requirement linked to the HIPAA program
print()
print("=== creating compliance requirement ===")
hipaa = next((p for p in created_programs if "hipaa" in p["slug"]), None)
if hipaa:
    status, comp = req("POST", f"/partnerships/{PID}/compliance", {
        "code": "HIPAA-ANNUAL-2026",
        "name": "HIPAA Annual Refresher (mandatory)",
        "regulation": "hipaa",
        "description_md": "Annual HIPAA refresher per 45 CFR 164.530(b). All workforce members must complete by Dec 31.",
        "program_id": hipaa["id"],
        "recurrence_months": 12,
        "nudge_window_days": 30,
        "attestation_required": True,
    })
    if status == 201:
        print(f"  + HIPAA compliance req created ({comp['id'][:8]})")
    else:
        print(f"  - failed: {status} {comp}")


# 6. Seed engagement activity — emit a few activity events to get streak + XP.
print()
print("=== seeding engagement (streak + XP) ===")
SOURCES = [
    "question_correct",
    "question_correct",
    "question_correct",
    "mock_completed",
    "skill_mastered",
]
for s in SOURCES:
    status, body = req("POST", "/me/engagement/activity", {"source": s})
    if status == 200:
        print(f"  + {s}: xp={body.get('engagement',{}).get('xp')} streak={body.get('engagement',{}).get('current_streak_days')}")


# 7. Show final /training state
print()
print("=== final /me/training state ===")
status, body = req("GET", "/me/training")
print(f"  programs: {len(body.get('programs', []))}")
for entry in body.get("programs", []):
    a = entry.get("assignment", {})
    p = entry.get("program", {})
    print(f"    - {p.get('name')} (status={a.get('status')}, progress={a.get('progress_pct')}%)")
print(f"  compliance: {len(body.get('compliance', []))}")
for c in body.get("compliance", []):
    print(f"    - {c.get('requirement', {}).get('name')} (status={c.get('due_date', {}).get('status')})")

status, eng = req("GET", "/me/engagement")
print(f"  engagement: streak={eng['current_streak_days']}d, level={eng['level']}, xp={eng['xp']}")

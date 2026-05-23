#!/usr/bin/env python3
"""One-off seed: clean the placeholder graduate program + create realistic
demo programs + milestones so the /dashboard/graduate UI has real content.
"""
import json
import urllib.request
import urllib.error
import sys

BASE = "http://localhost:8000/api/v1"

# 1. Auth as seeded admin
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
        body = e.read() or b"{}"
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"_raw": body.decode("utf-8", "replace")}


# 2. Cleanup any existing
print("=== cleanup ===")
me = req("GET", "/me/graduate")[1] or {"enrollments": []}
for e in me.get("enrollments", []):
    print(f"  withdrawing enrollment {e['enrollment_id'][:8]} from {e['program_name']!r}")
    req("POST", f"/graduate/enrollments/{e['enrollment_id']}/action",
        {"action": "withdraw", "reason": "demo cleanup"})

status, programs = req("GET", "/graduate/programs")
for p in (programs or []):
    print(f"  archiving program {p['name']!r}")
    req("PATCH", f"/graduate/programs/{p['id']}", {"status": "archived"})


# 3. Create 2 realistic programs
print()
print("=== creating realistic demo programs ===")
PROGRAMS = [
    {
        "slug": "phd-computer-science-demo",
        "name": "PhD in Computer Science",
        "degree_kind": "phd",
        "department": "Computer Science",
        "description_md": "Research-focused PhD with concentrations in ML systems, programming languages, and HCI. Five-year target; qualifying exam in year 1, proposal defense in year 2-3, dissertation defense in year 5.",
        "target_years": 5.0,
        "min_credits": 72,
        "requires_thesis": True,
        "requires_qualifying_exam": True,
        "completion_cert_code": "phd-cs-2026",
        "skill_targets": [
            {"skill_code": "GRAD.CS.ALGORITHMS", "target_mastery": 0.90, "is_required": True, "description": "Advanced algorithms + complexity"},
            {"skill_code": "GRAD.CS.ML.THEORY", "target_mastery": 0.85, "is_required": True, "description": "ML theory + statistical learning"},
            {"skill_code": "GRAD.CS.SYSTEMS", "target_mastery": 0.80, "is_required": False, "description": "Distributed systems + storage"},
            {"skill_code": "GRAD.RESEARCH.METHODS", "target_mastery": 0.85, "is_required": True, "description": "Research methods + writing"},
        ],
    },
    {
        "slug": "ms-data-science-demo",
        "name": "Master of Science — Data Science",
        "degree_kind": "masters_coursework",
        "department": "Statistics + Computer Science",
        "description_md": "Two-year coursework MS with capstone project. Coursework in statistical learning, deep learning, causal inference, plus an industry-partnered capstone.",
        "target_years": 2.0,
        "min_credits": 36,
        "requires_thesis": False,
        "requires_qualifying_exam": False,
        "completion_cert_code": "ms-ds-2026",
        "skill_targets": [
            {"skill_code": "GRAD.STATS.LEARNING", "target_mastery": 0.85, "is_required": True, "description": "Statistical learning theory"},
            {"skill_code": "GRAD.ML.APPLIED", "target_mastery": 0.85, "is_required": True, "description": "Applied ML — sklearn, PyTorch"},
            {"skill_code": "GRAD.STATS.CAUSAL", "target_mastery": 0.75, "is_required": False, "description": "Causal inference"},
        ],
    },
]

created = []
for p in PROGRAMS:
    status, body = req("POST", "/graduate/programs", p)
    if status == 201:
        created.append(body)
        # Activate
        req("PATCH", f"/graduate/programs/{body['id']}", {"status": "active"})
        print(f"  + {body['name']} (status=active)")
    else:
        print(f"  - failed: {status} {body}")


# 4. Self-enroll in the PhD program (more interesting demo than the MS)
print()
print("=== self-enrolling in PhD program ===")
phd = next((c for c in created if c["degree_kind"] == "phd"), None)
if not phd:
    print("  ERROR: no PhD program created")
    sys.exit(1)

status, enr = req("POST", f"/me/graduate/programs/{phd['id']}/enroll")
if status != 201:
    print(f"  ERROR: enroll failed: {status} {enr}")
    sys.exit(1)
eid = enr["id"]
print(f"  enrolled (enrollment id {eid[:8]})")


# 5. Seed milestones with VARIED statuses for a realistic mid-program feel
print()
print("=== seeding 8 milestones with varied lifecycle states ===")
MILESTONES = [
    # Pattern: tuples (milestone payload, end_state, decision_notes)
    (
        {"kind": "qualifying_exam", "title": "Qualifying exam — algorithms + complexity",
         "sequence": 1, "due_at": "2026-12-15",
         "description_md": "4-hour written exam covering CLRS chapters 1-25 + complexity classes through PSPACE."},
        "approved",
        "Strong defence — pass with distinction. Particularly impressive on the lower-bound proof for sorting.",
    ),
    (
        {"kind": "coursework", "title": "Year-1 coursework block",
         "sequence": 2, "due_at": "2027-05-01",
         "description_md": "12 credits across ML theory, systems, programming languages."},
        "submitted",
        None,
    ),
    (
        {"kind": "proposal", "title": "Dissertation proposal defense",
         "sequence": 3, "due_at": "2027-10-01",
         "description_md": "Public proposal defense with supervisor + two faculty. Topic: efficient ML model serving under cold-start."},
        "changes_requested",
        "Solid problem framing. Suggest tightening the 'cold-start' definition + adding a baselines table before the next iteration.",
    ),
    (
        {"kind": "irb", "title": "IRB review (human-subjects study)",
         "sequence": 4, "due_at": "2028-02-01",
         "description_md": "User study with ~50 software engineers; requires IRB Cat-2 review."},
        "not_started",
        None,
    ),
    (
        {"kind": "data_collection", "title": "Data collection phase",
         "sequence": 5, "due_at": "2028-09-01",
         "description_md": "User study + benchmark dataset construction."},
        "not_started",
        None,
    ),
    (
        {"kind": "manuscript", "title": "First publication — SIGCOMM or OSDI",
         "sequence": 6, "due_at": "2029-05-01",
         "description_md": "First-author paper on the core contribution."},
        "not_started",
        None,
    ),
    (
        {"kind": "thesis_draft", "title": "Full thesis draft to supervisor",
         "sequence": 7, "due_at": "2030-01-15",
         "description_md": "~200-page draft; supervisor turnaround ~4 weeks."},
        "not_started",
        None,
    ),
    (
        {"kind": "thesis_defense", "title": "Dissertation defense",
         "sequence": 8, "due_at": "2030-05-15",
         "description_md": "Public + private defense."},
        "not_started",
        None,
    ),
]

for ms_payload, end_state, notes in MILESTONES:
    status, ms = req("POST", f"/graduate/enrollments/{eid}/milestones", ms_payload)
    if status != 201:
        print(f"  failed: {status} {ms}")
        continue
    mid = ms["id"]

    if end_state == "submitted":
        req("POST", f"/graduate/milestones/{mid}/submit", {"artifact_url": "https://example.com/coursework-transcript.pdf"})
    elif end_state == "approved":
        req("POST", f"/graduate/milestones/{mid}/submit", {"artifact_url": "https://example.com/quals-exam-2026.pdf"})
        req("POST", f"/graduate/milestones/{mid}/decide", {"decision": "approved", "notes": notes or ""})
    elif end_state == "changes_requested":
        req("POST", f"/graduate/milestones/{mid}/submit", {"artifact_url": "https://example.com/proposal-v1.pdf"})
        req("POST", f"/graduate/milestones/{mid}/decide", {"decision": "changes_requested", "notes": notes or ""})

    print(f"  + seq {ms_payload['sequence']}: {ms_payload['title'][:55]:55} → {end_state}")


# 6. Show final state
print()
print("=== final state ===")
me = req("GET", "/me/graduate")[1]
for e in me.get("enrollments", []):
    print(f"  enrolled in: {e['program_name']} ({e['degree_kind']}, {e['status']})")
    print(f"    milestones: {e['milestones_done']}/{e['milestones_total']}")
    print(f"    next: {e.get('next_milestone_title') or '—'}")

status, avail = req("GET", "/me/graduate/available-programs")
print(f"  available to enroll: {len(avail or [])} program(s)")
for p in (avail or []):
    print(f"    - {p['name']}")

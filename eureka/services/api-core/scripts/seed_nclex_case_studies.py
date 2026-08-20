#!/usr/bin/env python3
"""Seed the first NCLEX NGN unfolding case studies (NX-14).

Next Gen NCLEX presents an evolving scenario with six sequential questions
walking the clinical-judgment steps: recognize cues -> analyze cues ->
prioritize hypotheses -> generate solutions -> take action -> evaluate
outcomes. Structurally this reuses the Passage infrastructure the MCAT
bank established (seed_mcat_passages.py): the Passage body is the initial
presentation, each attached Item's stem opens with its phase update, and
creation order is presentation order. Grading flows through the ordinary
/nclex/qbank/submit - a case question is a bank item and logs like one.

All content is AI-authored and lands DRAFT / verification 'unverified',
same standing as the discrete bank. Idempotent on metadata source_id.

  docker exec eureka-api-core python scripts/seed_nclex_case_studies.py
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

BANK_SLUG = "nclex-qbank-v1"
SOURCE_URI = "authoring/nclex-ngn-cases (2026-08-20)"

JUDGMENT_STEPS = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
]

CASES = [
    {
        "source_id": "nx_case_hemorrhage_001",
        "topic_id": 7,
        "category_id": "physio_adaptation",
        "section": "Physiological Adaptation",
        "subtopic": "Unfolding case: postoperative hemorrhage",
        "title": "Unfolding case: the quiet bleed after abdominal surgery",
        "scenario": (
            "A nurse on a surgical unit is caring for a 58-year-old client who "
            "returned four hours ago from an open abdominal hysterectomy.\n\n"
            "Initial assessment (1600):\n"
            "  - Alert and oriented; reports incisional pain 3/10\n"
            "  - BP 124/78 mm Hg, HR 84/min, RR 16/min, SpO2 97% on room air\n"
            "  - Abdominal dressing clean, dry, and intact; scant drain output\n"
            "  - Lactated Ringer's infusing at 100 mL/hr; oral analgesia ordered\n\n"
            "The questions that follow present the case as it evolves. Answer "
            "them in order."
        ),
        "questions": [
            {
                "source_id": "nx_case_hemorrhage_001_q1",
                "kind": "multi",
                "stem": (
                    "Phase 1 (1800): The client is restless and asks for water "
                    "repeatedly. Reassessment: HR 102/min, BP 112/70 mm Hg, RR "
                    "18/min, pain 3/10. The dressing remains dry with scant "
                    "drain output.\n\n"
                    "Which findings require follow-up? Select all that apply."
                ),
                "options": [
                    "Heart rate that has risen from 84 to 102/min",
                    "New restlessness",
                    "Repeated reports of thirst",
                    "The dry, intact surgical dressing",
                    "Pain rated 3/10",
                ],
                "correct_indices": [0, 1, 2],
                "explanation": (
                    "Correct (a), (b), (c): a climbing heart rate, restlessness, "
                    "and thirst are the EARLY compensating signs of volume loss "
                    "- catecholamines keep the blood pressure near normal while "
                    "the deficit grows, so the subtle cluster is the finding. "
                    "Wrong (d): a dry dressing is reassuring but does NOT rule "
                    "out bleeding - after abdominal surgery blood collects "
                    "internally where no dressing shows it. Wrong (e): stable, "
                    "controlled pain at 3/10 needs no follow-up."
                ),
            },
            {
                "source_id": "nx_case_hemorrhage_001_q2",
                "kind": "mcq",
                "stem": (
                    "Phase 1, continued: Considering the trend - rising heart "
                    "rate, restlessness, thirst, and a blood pressure drifting "
                    "down from baseline - these cues are most consistent with "
                    "which condition?"
                ),
                "options": [
                    "Early hypovolemia from internal bleeding",
                    "A normal response to emerging from anesthesia",
                    "An adverse effect of the oral analgesic",
                    "Anxiety about the surgical outcome",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): the combination and its TREND is early "
                    "hemorrhagic hypovolemia - internal bleeding after abdominal "
                    "surgery shows exactly this compensated picture first. (b) "
                    "Anesthesia recovery settles over time; it does not produce "
                    "a worsening trend at hour six. (c) Oral analgesics at this "
                    "dose do not cause tachycardia with thirst. (d) Anxiety is a "
                    "diagnosis of exclusion - assigning fear to a hemodynamic "
                    "trend is how bleeds are missed."
                ),
            },
            {
                "source_id": "nx_case_hemorrhage_001_q3",
                "kind": "mcq",
                "stem": (
                    "Phase 2 (1900): BP 96/60 mm Hg, HR 118/min, capillary "
                    "refill 4 seconds, skin cool. Urine output has been 20 mL/hr "
                    "for two hours.\n\n"
                    "What should the nurse do first?"
                ),
                "options": [
                    "Notify the provider immediately and prepare to increase IV fluids per orders",
                    "Recheck the vital signs in one hour",
                    "Administer the PRN antiemetic",
                    "Assist the client to ambulate to improve circulation",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): the picture has progressed to decompensating "
                    "hypovolemic shock - the provider is notified NOW and volume "
                    "resuscitation anticipated; this is also rapid-response "
                    "territory per policy. (b) Waiting an hour in a "
                    "deteriorating trend forfeits the intervention window. (c) "
                    "No nausea has been reported; the antiemetic treats nothing "
                    "here. (d) Ambulating a client in early shock invites "
                    "collapse."
                ),
            },
            {
                "source_id": "nx_case_hemorrhage_001_q4",
                "kind": "multi",
                "stem": (
                    "Phase 2, continued: The provider is at the bedside and "
                    "suspects postoperative hemorrhage.\n\n"
                    "Which orders should the nurse anticipate? Select all that "
                    "apply."
                ),
                "options": [
                    "An IV fluid bolus",
                    "STAT hemoglobin/hematocrit and type and crossmatch",
                    "Nothing by mouth (NPO) in case of return to the operating room",
                    "Discontinue the IV catheter",
                    "An increased dose of the oral opioid",
                ],
                "correct_indices": [0, 1, 2],
                "explanation": (
                    "Correct (a) - volume replacement is the immediate "
                    "counter to hypovolemia; (b) - the H/H quantifies loss and "
                    "crossmatch readies blood; (c) - a client who may return to "
                    "surgery stays NPO. Wrong (d): IV access is the lifeline "
                    "now - a second line is more likely than removing the "
                    "first. Wrong (e): increasing oral opioids in a hypotensive, "
                    "possibly returning-to-OR client is unsafe and irrelevant "
                    "to the emergency."
                ),
            },
            {
                "source_id": "nx_case_hemorrhage_001_q5",
                "kind": "mcq",
                "stem": (
                    "Phase 2, continued: While preparing the fluid bolus, how "
                    "should the nurse position the client?"
                ),
                "options": [
                    "Supine with the legs elevated",
                    "High Fowler's position",
                    "Prone with the head turned to the side",
                    "Left side-lying with the head lower than the body",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): supine with legs elevated returns venous "
                    "blood to the central circulation - the standard positioning "
                    "support in hypovolemia. (b) High Fowler's pools blood in "
                    "the lower body and worsens cerebral perfusion. (c) Prone "
                    "positioning has no role and blocks assessment and access. "
                    "(d) Left-lateral head-down is the AIR EMBOLISM position, a "
                    "different emergency."
                ),
            },
            {
                "source_id": "nx_case_hemorrhage_001_q6",
                "kind": "mcq",
                "stem": (
                    "Phase 3 (2000): After the fluid bolus, the nurse "
                    "re-evaluates.\n\n"
                    "Which finding best indicates that treatment is working?"
                ),
                "options": [
                    "Urine output rises to 40 mL/hr",
                    "The client stops asking for water",
                    "The skin remains cool to touch",
                    "Heart rate of 122/min",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): urine output is the most objective bedside "
                    "index of restored organ perfusion - kidneys reperfuse when "
                    "volume returns. (b) Less thirst is subjective and lags "
                    "resuscitation. (c) Persistently cool skin suggests ongoing "
                    "peripheral vasoconstriction, not improvement. (d) A heart "
                    "rate still above 120 is a FAILED response, not success."
                ),
            },
        ],
    },
    {
        "source_id": "nx_case_opioid_001",
        "topic_id": 5,
        "category_id": "pharm_parenteral",
        "section": "Pharmacological & Parenteral Therapies",
        "subtopic": "Unfolding case: opioid respiratory depression",
        "title": "Unfolding case: the PCA pump and the sleeping client",
        "scenario": (
            "A night-shift nurse is caring for a 72-year-old client on the "
            "orthopedic unit, eight hours after total knee arthroplasty.\n\n"
            "Background:\n"
            "  - Hydromorphone PCA started two hours ago for severe pain\n"
            "  - History: obstructive sleep apnea (uses CPAP at home), "
            "hypertension\n"
            "  - 2100 assessment: drowsy but easily arousable, RR 18/min, "
            "SpO2 96% on room air, pain 4/10\n\n"
            "The questions that follow present the case as it evolves. Answer "
            "them in order."
        ),
        "questions": [
            {
                "source_id": "nx_case_opioid_001_q1",
                "kind": "multi",
                "stem": (
                    "Phase 1 (2330): On rounds, the nurse finds the client "
                    "snoring deeply. Assessment: RR 8/min and shallow, SpO2 88% "
                    "on room air, pupils pinpoint, and the client is difficult "
                    "to arouse. The surgical dressing is clean and intact.\n\n"
                    "Which cues require immediate follow-up? Select all that "
                    "apply."
                ),
                "options": [
                    "Respiratory rate of 8/min with shallow breaths",
                    "Oxygen saturation of 88%",
                    "Difficulty arousing the client",
                    "Pinpoint pupils",
                    "The clean, intact surgical dressing",
                ],
                "correct_indices": [0, 1, 2, 3],
                "explanation": (
                    "Correct (a)-(d): bradypnea, desaturation, depressed "
                    "arousability, and miosis together are the toxidrome of "
                    "opioid over-sedation - each one alone warrants action; the "
                    "cluster is an emergency. Wrong (e): the intact dressing is "
                    "an expected, reassuring finding with no bearing on the "
                    "airway problem."
                ),
            },
            {
                "source_id": "nx_case_opioid_001_q2",
                "kind": "mcq",
                "stem": (
                    "Phase 1, continued: Which factor in this client's history "
                    "most increased the risk of this event?"
                ),
                "options": [
                    "Obstructive sleep apnea combined with opioid PCA use",
                    "The history of hypertension",
                    "The time of day",
                    "The type of surgery performed",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): OSA is a leading risk factor for "
                    "opioid-induced respiratory depression - the same airway "
                    "that obstructs in sleep collapses further under opioid "
                    "sedation, which is why OSA clients on PCA warrant enhanced "
                    "monitoring. (b) Hypertension does not predispose to "
                    "respiratory depression. (c) Night matters only through "
                    "sleep itself; it is the OSA-opioid interaction that drives "
                    "risk. (d) Knee arthroplasty is not itself a respiratory "
                    "risk factor."
                ),
            },
            {
                "source_id": "nx_case_opioid_001_q3",
                "kind": "mcq",
                "stem": (
                    "Phase 1, continued: What should the nurse do first?"
                ),
                "options": [
                    "Stop the PCA infusion, stimulate the client, apply oxygen, and call for help",
                    "Document the findings and recheck in 30 minutes",
                    "Lower the head of the bed flat and leave to find the charge nurse",
                    "Increase the PCA lockout interval and continue rounds",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): the sequence is simultaneous - remove the "
                    "cause (stop the PCA), support the client (stimulate, "
                    "oxygen), and mobilize the team; anticipate naloxone. (b) "
                    "A client breathing 8/min at 88% may not survive 30 unmonitored "
                    "minutes. (c) Flat positioning worsens obstruction in OSA, "
                    "and leaving an unstable client is abandonment. (d) "
                    "Adjusting pump settings treats the machine while the "
                    "client hypoventilates - and setting changes need orders."
                ),
            },
            {
                "source_id": "nx_case_opioid_001_q4",
                "kind": "mcq",
                "stem": (
                    "Phase 2 (2340): The provider prescribes IV naloxone, which "
                    "is given with improvement in respiratory rate.\n\n"
                    "Which statement about naloxone should guide the nurse's "
                    "next hour of care?"
                ),
                "options": [
                    "Naloxone's duration can be shorter than the opioid's, so sedation may return",
                    "One dose of naloxone permanently reverses all opioid effect",
                    "Naloxone deepens analgesia while reversing sedation",
                    "No further monitoring is needed once the client wakes",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): naloxone often wears off BEFORE the opioid it "
                    "displaced - resedation and renewed respiratory depression "
                    "are expected risks, which is why monitoring continues and "
                    "repeat doses are anticipated. (b) 'Permanent reversal' is "
                    "the exact misconception that kills post-naloxone clients. "
                    "(c) Naloxone REVERSES analgesia; pain returning is part of "
                    "the trade. (d) Waking is the beginning of the monitoring "
                    "period, not the end."
                ),
            },
            {
                "source_id": "nx_case_opioid_001_q5",
                "kind": "multi",
                "stem": (
                    "Phase 2, continued: Which actions belong in the plan for "
                    "the rest of the shift? Select all that apply."
                ),
                "options": [
                    "Continuous pulse oximetry",
                    "Frequent respiratory rate and sedation-level checks",
                    "Have repeat naloxone doses available per orders",
                    "Resume the PCA at the previous settings right away",
                    "Leave the client undisturbed to catch up on sleep",
                ],
                "correct_indices": [0, 1, 2],
                "explanation": (
                    "Correct (a) - continuous oximetry catches the resedation "
                    "the naloxone kinetics predict; (b) - sedation scales and "
                    "respiratory counts detect depression BEFORE the saturation "
                    "falls; (c) - repeat dosing is expected, so it is ready. "
                    "Wrong (d): restarting the same PCA settings reinstates the "
                    "overdose - the regimen is reassessed with the provider "
                    "first. Wrong (e): 'undisturbed sleep' is indistinguishable "
                    "from resedation without assessment - exactly the wrong "
                    "night for it."
                ),
            },
            {
                "source_id": "nx_case_opioid_001_q6",
                "kind": "mcq",
                "stem": (
                    "Phase 3 (0600): The team has adjusted the plan to a "
                    "multimodal regimen with a reduced-dose PCA.\n\n"
                    "Which outcome indicates the revised plan is BOTH safe and "
                    "effective?"
                ),
                "options": [
                    "Respiratory rate 14/min, easily arousable, pain rated 3/10",
                    "Client deeply asleep and difficult to arouse, pain 0/10",
                    "Client wide awake with pain rated 9/10",
                    "Respiratory rate 9/min with SpO2 91% on oxygen",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): the goal is BOTH dimensions at once - intact "
                    "respiratory drive and arousability (safety) with tolerable "
                    "pain (effectiveness). (b) Unarousable with no pain is "
                    "over-sedation succeeding at the wrong goal. (c) Awake with "
                    "9/10 pain is safety without effectiveness - an inadequate "
                    "plan. (d) A rate of 9 with borderline saturation on oxygen "
                    "is continuing respiratory depression masked by supplemental "
                    "O2."
                ),
            },
        ],
    },
    {
        "source_id": "nx_case_cauti_001",
        "topic_id": 6,
        "category_id": "reduction_risk",
        "section": "Reduction of Risk Potential",
        "subtopic": "Unfolding case: catheter-associated sepsis",
        "title": "Unfolding case: the catheter nobody questioned",
        "scenario": (
            "A nurse on a medical unit is caring for an 84-year-old client "
            "admitted five days ago after a hip fracture repair. An indwelling "
            "urinary catheter was placed in the operating room and remains in "
            "place.\n\n"
            "Morning assessment (0800):\n"
            "  - Alert and oriented x3; participating in physical therapy\n"
            "  - Temperature 37.1 C, HR 78/min, BP 132/74 mm Hg, RR 16/min\n"
            "  - Catheter draining clear yellow urine; day 5 of catheterization\n"
            "  - No urinary complaints\n\n"
            "The questions that follow present the case as it evolves. Answer "
            "them in order."
        ),
        "questions": [
            {
                "source_id": "nx_case_cauti_001_q1",
                "kind": "mcq",
                "stem": (
                    "Phase 1 (0800): Reviewing the morning assessment, which "
                    "aspect of this client's care should the nurse QUESTION "
                    "today, before any new symptoms appear?"
                ),
                "options": [
                    "The continued need for a urinary catheter on postoperative day 5",
                    "The client's participation in physical therapy",
                    "The frequency of vital sign measurement",
                    "The client's oral fluid intake",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): every catheter day raises infection risk, and "
                    "day 5 after hip surgery in a mobile client rarely has a "
                    "continuing indication - the strongest CAUTI prevention is "
                    "REMOVAL, and nurses are expected to challenge lingering "
                    "catheters daily. (b) Therapy participation is exactly what "
                    "recovery needs. (c) Routine vitals frequency fits a stable "
                    "client. (d) Nothing suggests an intake problem, and intake "
                    "does not offset a lingering catheter."
                ),
            },
            {
                "source_id": "nx_case_cauti_001_q2",
                "kind": "multi",
                "stem": (
                    "Phase 2 (1500): The catheter remains in place awaiting a "
                    "provider decision. The client is now newly confused, "
                    "picking at the bedding. Temperature 38.4 C, HR 112/min, "
                    "BP 104/60 mm Hg, RR 22/min. Urine in the bag is cloudy "
                    "with sediment.\n\n"
                    "Which cues require immediate follow-up? Select all that "
                    "apply."
                ),
                "options": [
                    "New confusion",
                    "Temperature 38.4 C with heart rate 112/min",
                    "Blood pressure trending down from the morning baseline",
                    "Cloudy urine with sediment",
                    "The client picking at the bedding as a normal sleep habit",
                ],
                "correct_indices": [0, 1, 2, 3],
                "explanation": (
                    "Correct (a)-(d): new confusion in an older adult is often "
                    "the FIRST sign of serious infection; fever with "
                    "tachycardia, a falling blood pressure, and grossly "
                    "abnormal urine complete a picture of urinary-source sepsis "
                    "developing. Wrong (e): carphologia (picking at bedding) in "
                    "a newly confused client is part of the delirium, not a "
                    "sleep habit - normalizing it discards a key cue."
                ),
            },
            {
                "source_id": "nx_case_cauti_001_q3",
                "kind": "mcq",
                "stem": (
                    "Phase 2, continued: Which interpretation best explains "
                    "this cluster of findings?"
                ),
                "options": [
                    "Developing sepsis from a catheter-associated urinary tract infection",
                    "Ordinary postoperative pain response",
                    "A primary psychiatric disturbance",
                    "Dehydration from therapy exercises",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): day-5 catheter + new delirium + fever + "
                    "tachycardia + falling pressure + cloudy urine is "
                    "urinary-source sepsis until proven otherwise. (b) Pain "
                    "raises blood pressure and does not cause fever with "
                    "confusion. (c) New psychiatric illness at 84 is a "
                    "diagnosis of last resort - acute confusion is medical "
                    "until proven otherwise. (d) Therapy-related dehydration "
                    "does not produce fever or cloudy urine."
                ),
            },
            {
                "source_id": "nx_case_cauti_001_q4",
                "kind": "multi",
                "stem": (
                    "Phase 2, continued: The provider is notified and suspects "
                    "urosepsis.\n\n"
                    "Which orders should the nurse anticipate? Select all that "
                    "apply."
                ),
                "options": [
                    "Blood cultures and a urine culture",
                    "Serum lactate measurement",
                    "IV fluids and IV antibiotics promptly after cultures",
                    "Removal or replacement of the urinary catheter",
                    "A sleeping medication for the restlessness",
                ],
                "correct_indices": [0, 1, 2, 3],
                "explanation": (
                    "Correct (a) - cultures identify the organism, drawn before "
                    "antibiotics when this does not delay them; (b) - lactate "
                    "grades perfusion and is central to sepsis protocols; (c) - "
                    "early fluids and antibiotics are what change sepsis "
                    "survival; (d) - the infected catheter is the SOURCE, and "
                    "source control is part of treatment. Wrong (e): sedating "
                    "new delirium masks the assessment and adds fall and "
                    "respiratory risk while treating nothing."
                ),
            },
            {
                "source_id": "nx_case_cauti_001_q5",
                "kind": "mcq",
                "stem": (
                    "Phase 2, continued: While implementing the orders, which "
                    "task is appropriate for the nurse to DELEGATE to "
                    "assistive personnel?"
                ),
                "options": [
                    "Taking and reporting repeat vital signs at the ordered frequency",
                    "Evaluating the client's response to the fluid bolus",
                    "Providing the SBAR update to the provider",
                    "Assessing the client's level of consciousness each hour",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): measuring and reporting vitals is data "
                    "collection within AP scope even in a sick client - the "
                    "NURSE interprets the numbers. (b) Evaluating treatment "
                    "response is the evaluation step of the nursing process. "
                    "(c) Provider communication about a deteriorating client is "
                    "nursing accountability. (d) Level-of-consciousness "
                    "assessment is clinical assessment, not delegable "
                    "measurement."
                ),
            },
            {
                "source_id": "nx_case_cauti_001_q6",
                "kind": "mcq",
                "stem": (
                    "Phase 3 (2000): After fluids and the first antibiotic "
                    "dose, the nurse evaluates progress.\n\n"
                    "Which finding best indicates the client is responding to "
                    "treatment?"
                ),
                "options": [
                    "The client is oriented again, with BP 122/70 mm Hg and heart rate 88/min",
                    "The temperature is unchanged but the client is asleep",
                    "Urine output has fallen to 10 mL/hr",
                    "The client no longer complains because they are difficult to arouse",
                ],
                "correct_index": 0,
                "explanation": (
                    "Correct (a): clearing mentation with normalizing pressure "
                    "and heart rate is end-organ perfusion returning - the "
                    "delirium that announced the sepsis resolves as it is "
                    "treated. (b) Sleep with an unchanged fever is neutral at "
                    "best. (c) Falling urine output signals WORSENING "
                    "perfusion. (d) Decreasing arousability is deterioration "
                    "wearing the costume of quiet."
                ),
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
            sys.exit(f"bank {BANK_SLUG} not seeded - run seed_nclex_item_bank.py first")

        existing_cases = {
            row.extra_metadata.get("source_id")
            for row in (
                await db.execute(select(Passage).where(Passage.bank_id == bank.id))
            ).scalars()
        }
        existing_items = {
            row.extra_metadata.get("source_id")
            for row in (
                await db.execute(select(Item).where(Item.bank_id == bank.id))
            ).scalars()
        }

        new_cases = new_items = 0
        for case in CASES:
            if case["source_id"] in existing_cases:
                print(f"case {case['source_id']} exists")
                continue
            passage = Passage(
                bank_id=bank.id,
                title=case["title"],
                body=case["scenario"],
                topic_id=case["topic_id"],
                section=case["section"],
                review_status=ItemReviewStatus.DRAFT,
                source_kind=ItemSourceKind.AI_GENERATED,
                attribution="EUREKA (AI-authored NGN case, pending SME review)",
                extra_metadata={"source_id": case["source_id"], "ngn": True},
            )
            db.add(passage)
            await db.flush()
            new_cases += 1

            for phase, q in enumerate(case["questions"], start=1):
                if q["source_id"] in existing_items:
                    continue
                is_multi = q["kind"] == "multi"
                content: dict = {"stem": q["stem"], "options": q["options"]}
                if is_multi:
                    content["correct_indices"] = sorted(q["correct_indices"])
                else:
                    content["correct_index"] = q["correct_index"]
                item = Item(
                    bank_id=bank.id,
                    family_id=uuid4(),
                    passage_id=passage.id,
                    kind=ItemKind.MCQ_MULTI if is_multi else ItemKind.MCQ_SINGLE,
                    content=content,
                    explanation=q["explanation"],
                    difficulty_nominal="hard",
                    estimated_time_sec=120,
                    review_status=ItemReviewStatus.DRAFT,
                    tags=[case["subtopic"]],
                    extra_metadata={
                        "source_id": q["source_id"],
                        "topic_id": case["topic_id"],
                        "category_id": case["category_id"],
                        "section": case["section"],
                        "subtopic": case["subtopic"],
                        "verification": "unverified",
                        "ngn": {
                            "case": case["source_id"],
                            "phase": phase,
                            "judgment_step": JUDGMENT_STEPS[phase - 1],
                        },
                    },
                )
                db.add(item)
                await db.flush()
                db.add(
                    ItemSource(
                        item_id=item.id,
                        source_kind=ItemSourceKind.AI_GENERATED,
                        source_uri=SOURCE_URI,
                        source_name="EUREKA NGN unfolding case (AI-authored)",
                        license="proprietary",
                        attribution="EUREKA (pending SME review)",
                    )
                )
                new_items += 1
        await db.commit()
        print(f"inserted {new_cases} cases, {new_items} case questions")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())

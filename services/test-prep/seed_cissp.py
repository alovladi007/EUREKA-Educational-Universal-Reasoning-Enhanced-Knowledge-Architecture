"""
Seed CISSP questions into the PostgreSQL database.
Creates a CISSP course, assessment, and 400 questions.

Usage:
  docker exec -e ALLOWED_ORIGINS='["http://localhost:3000"]' eureka-test-prep python seed_cissp.py
"""
import json
import os
import sys
import uuid

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine
from sqlalchemy import text

SECTION_MAP = {
    1: "Security & Risk Management",
    2: "Asset Security",
    3: "Security Architecture & Engineering",
    4: "Communication & Network Security",
    5: "Identity & Access Management (IAM)",
    6: "Security Assessment & Testing",
    7: "Security Operations",
    8: "Software Development Security",
}

DIFFICULTY_MAP = {1: "easy", 2: "easy", 3: "medium", 4: "hard", 5: "hard"}

# Fixed UUIDs so re-running is idempotent
CISSP_COURSE_ID = "c1550000-0000-0000-0000-000000000001"
CISSP_ASSESSMENT_ID = "a1550000-0000-0000-0000-000000000001"
CISSP_ORG_ID = "550e8400-e29b-41d4-a716-446655440000"  # Match existing org


def find_qbank_files():
    for base in [os.path.join(os.path.dirname(__file__), "qbank", "cissp"), "/app/qbank/cissp"]:
        files = [(d, os.path.join(base, f"domain-{d}.json")) for d in range(1, 9)
                 if os.path.exists(os.path.join(base, f"domain-{d}.json"))]
        if len(files) == 8:
            return files
    print("ERROR: Could not find QBank files"); sys.exit(1)


def seed():
    qbank_files = find_qbank_files()

    with engine.connect() as conn:
        # 1. Clean up existing CISSP data
        conn.execute(text("DELETE FROM questions WHERE assessment_id = :aid"), {"aid": CISSP_ASSESSMENT_ID})
        conn.execute(text("DELETE FROM assessments WHERE id = :aid"), {"aid": CISSP_ASSESSMENT_ID})
        conn.execute(text("DELETE FROM courses WHERE id = :cid"), {"cid": CISSP_COURSE_ID})
        conn.commit()
        print("Cleaned existing CISSP data.")

        # 2. Create CISSP course
        conn.execute(text("""
            INSERT INTO courses (id, org_id, code, title, description, category, level, status, is_active, created_at, updated_at)
            VALUES (:id, :org_id, 'CISSP', 'CISSP Exam Prep', 'Certified Information Systems Security Professional - 8 CBK Domains',
                    'cybersecurity', 'advanced', 'published', true, NOW(), NOW())
        """), {"id": CISSP_COURSE_ID, "org_id": CISSP_ORG_ID})
        print("Created CISSP course.")

        # 3. Create CISSP QBank assessment
        conn.execute(text("""
            INSERT INTO assessments (id, course_id, title, description, assessment_type, total_points, passing_score,
                                     time_limit_minutes, shuffle_questions, shuffle_answers, show_correct_answers,
                                     is_published, created_at, updated_at)
            VALUES (:id, :course_id, 'CISSP Question Bank', '400 practice questions across 8 CBK domains',
                    'quiz', 400, 70, 480, true, true, true, true, NOW(), NOW())
        """), {"id": CISSP_ASSESSMENT_ID, "course_id": CISSP_COURSE_ID})
        print("Created CISSP assessment.")

        # 4. Insert questions
        total = 0
        for domain_num, filepath in qbank_files:
            with open(filepath) as f:
                data = json.load(f)

            section = SECTION_MAP[domain_num]
            for q in data["questions"]:
                qid = str(uuid.uuid4())

                options = []
                for i, letter in enumerate(["A", "B", "C", "D"]):
                    options.append({"id": str(uuid.uuid4()), "text": q["options"][letter], "index": i})

                correct_idx = ord(q["correct"]) - ord("A")
                correct_answer = {"index": correct_idx, "text": q["options"][q["correct"]]}

                diff = q.get("difficulty", 3)
                tags = {
                    "exam": "CISSP",
                    "section": section,
                    "domain": domain_num,
                    "type": q.get("type", "application"),
                    "blooms": q.get("blooms", "Apply"),
                    "sub_objective": q.get("sub_objective", ""),
                    "adaptive_tags": q.get("tags", []),
                    "original_id": q["id"],
                }
                metadata = {
                    "irt_a": 1.0,
                    "irt_b": {1: -1.5, 2: -0.5, 3: 0.0, 4: 1.0, 5: 2.0}.get(diff, 0.0),
                    "irt_c": 0.25,
                }

                conn.execute(text("""
                    INSERT INTO questions (
                        id, assessment_id, question_text, question_type, points, order_index,
                        answer_options, correct_answer, explanation,
                        difficulty, tags, metadata, created_at, updated_at
                    ) VALUES (
                        :id, :assessment_id, :question_text, 'multiple_choice', 1, :order_index,
                        CAST(:answer_options AS jsonb), CAST(:correct_answer AS jsonb), :explanation,
                        :difficulty, CAST(:tags AS jsonb), CAST(:metadata AS jsonb), NOW(), NOW()
                    )
                """), {
                    "id": qid,
                    "assessment_id": CISSP_ASSESSMENT_ID,
                    "question_text": q["stem"],
                    "order_index": total,
                    "answer_options": json.dumps(options),
                    "correct_answer": json.dumps(correct_answer),
                    "explanation": q["rationale"],
                    "difficulty": DIFFICULTY_MAP.get(diff, "medium"),
                    "tags": json.dumps(tags),
                    "metadata": json.dumps(metadata),
                })
                total += 1

            print(f"  Domain {domain_num} ({section}): {len(data['questions'])} questions")

        conn.commit()
        print(f"\nSeeded {total} CISSP questions.")

        # Verify
        result = conn.execute(text(
            "SELECT COUNT(*) FROM questions WHERE assessment_id = :aid"
        ), {"aid": CISSP_ASSESSMENT_ID})
        print(f"Verification: {result.scalar()} CISSP questions in database.")


if __name__ == "__main__":
    seed()

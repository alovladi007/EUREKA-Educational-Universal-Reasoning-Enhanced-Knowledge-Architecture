"""
Import seed data from complete-seed-data.js into SQLite database
"""
import json
import re
import sqlite3
from datetime import datetime
from pathlib import Path


def parse_js_to_json(js_file_path: str) -> dict:
    """Parse JavaScript object to Python dict"""
    with open(js_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract the seedData object
    # Find everything between "const seedData = {" and "};" at the end
    match = re.search(r'const seedData = ({.*});', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find seedData object in JS file")

    js_obj = match.group(1)

    # Clean up JavaScript to make it valid JSON
    # Replace single quotes with double quotes (carefully)
    js_obj = re.sub(r"'([^']*)'", r'"\1"', js_obj)

    # Fix object keys (add quotes if missing)
    js_obj = re.sub(r'(\w+):', r'"\1":', js_obj)

    # Remove trailing commas
    js_obj = re.sub(r',(\s*[}\]])', r'\1', js_obj)

    # Handle some edge cases
    js_obj = js_obj.replace('\\"', "'")  # Restore escaped quotes in strings

    try:
        return json.loads(js_obj)
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        # Fallback: manually parse the structure
        return parse_manual(content)


def parse_manual(content: str) -> dict:
    """Manually parse the JavaScript file structure"""
    data = {
        'questions': {
            'GRE': {'Quantitative': [], 'Verbal': []},
            'GMAT': {'Quantitative': [], 'Verbal': []},
            'LSAT': {'LogicalReasoning': []},
            'MCAT': {'ChemPhys': [], 'BioBiochem': []}
        }
    }

    # Extract GRE Quantitative questions
    gre_quant_match = re.search(r'GRE:\s*{[^}]*Quantitative:\s*\[(.*?)\]', content, re.DOTALL)
    if gre_quant_match:
        questions_str = gre_quant_match.group(1)
        data['questions']['GRE']['Quantitative'] = extract_questions(questions_str)

    # Extract GRE Verbal questions
    gre_verbal_match = re.search(r'Verbal:\s*\[(.*?)\]\s*}[^}]*},\s*GMAT', content, re.DOTALL)
    if gre_verbal_match:
        questions_str = gre_verbal_match.group(1)
        data['questions']['GRE']['Verbal'] = extract_questions(questions_str)

    # Extract GMAT questions
    gmat_quant_match = re.search(r'GMAT:\s*{[^}]*Quantitative:\s*\[(.*?)\]', content, re.DOTALL)
    if gmat_quant_match:
        questions_str = gmat_quant_match.group(1)
        data['questions']['GMAT']['Quantitative'] = extract_questions(questions_str)

    gmat_verbal_match = re.search(r'GMAT:[^}]*Verbal:\s*\[(.*?)\]\s*}', content, re.DOTALL)
    if gmat_verbal_match:
        questions_str = gmat_verbal_match.group(1)
        data['questions']['GMAT']['Verbal'] = extract_questions(questions_str)

    # Extract LSAT questions
    lsat_match = re.search(r'LSAT:\s*{[^}]*LogicalReasoning:\s*\[(.*?)\]', content, re.DOTALL)
    if lsat_match:
        questions_str = lsat_match.group(1)
        data['questions']['LSAT']['LogicalReasoning'] = extract_questions(questions_str)

    # Extract MCAT questions
    mcat_cp_match = re.search(r'MCAT:\s*{[^}]*ChemPhys:\s*\[(.*?)\]', content, re.DOTALL)
    if mcat_cp_match:
        questions_str = mcat_cp_match.group(1)
        data['questions']['MCAT']['ChemPhys'] = extract_questions(questions_str)

    mcat_bb_match = re.search(r'BioBiochem:\s*\[(.*?)\]', content, re.DOTALL)
    if mcat_bb_match:
        questions_str = mcat_bb_match.group(1)
        data['questions']['MCAT']['BioBiochem'] = extract_questions(questions_str)

    return data


def extract_questions(questions_str: str) -> list:
    """Extract individual question objects from a string"""
    questions = []

    # Find all question objects using a more robust pattern
    # Look for patterns starting with { and containing id:
    pattern = r'\{[^}]*id:\s*[\'"][^\'"]+[\'"][^}]*\}'

    # Use finditer to get all matches with their positions
    for match in re.finditer(pattern, questions_str, re.DOTALL):
        block = match.group(0)

        q = {}

        # Extract fields using regex
        id_match = re.search(r"id:\s*['\"]([^'\"]+)['\"]", block)
        if id_match:
            q['id'] = id_match.group(1)

        # Use a more flexible pattern for stem that handles escaped quotes
        stem_match = re.search(r"stem:\s*['\"](.+?)['\"](?:\s*,|\s*})", block, re.DOTALL)
        if stem_match:
            stem = stem_match.group(1)
            stem = stem.replace("\\'", "'").replace('\\"', '"')
            # Clean up any remaining escapes
            stem = stem.replace('\\n', ' ').strip()
            q['stem'] = stem

        # Extract choices array - look for the array between square brackets
        choices_match = re.search(r"choices:\s*\[([^\]]+)\]", block, re.DOTALL)
        if choices_match:
            choices_str = choices_match.group(1)
            # Find all quoted strings
            choices = []
            for choice_match in re.finditer(r"['\"]([^'\"]+)['\"]", choices_str):
                choice = choice_match.group(1)
                choice = choice.replace("\\'", "'").replace('\\"', '"')
                choices.append(choice)
            q['choices'] = choices

        correct_idx_match = re.search(r"correctIndex:\s*(\d+)", block)
        if correct_idx_match:
            q['correctIndex'] = int(correct_idx_match.group(1))

        # More flexible explanation pattern
        explanation_match = re.search(r"explanation:\s*['\"](.+?)['\"](?:\s*,|\s*})", block, re.DOTALL)
        if explanation_match:
            explanation = explanation_match.group(1)
            explanation = explanation.replace("\\'", "'").replace('\\"', '"')
            explanation = explanation.replace('\\n', ' ').strip()
            q['explanation'] = explanation

        difficulty_match = re.search(r"difficulty:\s*['\"]([^'\"]+)['\"]", block)
        if difficulty_match:
            q['difficulty'] = difficulty_match.group(1)

        # IRT parameters
        irt_a_match = re.search(r"irtA:\s*([\d.]+)", block)
        if irt_a_match:
            q['irtA'] = float(irt_a_match.group(1))

        irt_b_match = re.search(r"irtB:\s*([-\d.]+)", block)
        if irt_b_match:
            q['irtB'] = float(irt_b_match.group(1))

        irt_c_match = re.search(r"irtC:\s*([\d.]+)", block)
        if irt_c_match:
            q['irtC'] = float(irt_c_match.group(1))

        # Topics array
        topics_match = re.search(r"topics:\s*\[([^\]]+)\]", block, re.DOTALL)
        if topics_match:
            topics_str = topics_match.group(1)
            topics = []
            for topic_match in re.finditer(r"['\"]([^'\"]+)['\"]", topics_str):
                topics.append(topic_match.group(1))
            q['topics'] = topics

        time_match = re.search(r"timeEstimate:\s*(\d+)", block)
        if time_match:
            q['timeEstimate'] = int(time_match.group(1))

        if q and 'id' in q:
            questions.append(q)

    return questions


def import_questions_to_db(data: dict, db_path: str):
    """Import questions into SQLite database"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    total_imported = 0
    total_skipped = 0

    for exam_type, sections in data['questions'].items():
        for section_name, questions in sections.items():
            print(f"\nImporting {exam_type} - {section_name}: {len(questions)} questions")

            for q in questions:
                try:
                    # Check if question already exists
                    cursor.execute("SELECT id FROM questions WHERE id = ?", (q['id'],))
                    if cursor.fetchone():
                        print(f"  Skipping {q['id']} (already exists)")
                        total_skipped += 1
                        continue

                    # Prepare data
                    question_id = q['id']
                    stem = q.get('stem', '')
                    choices_json = json.dumps(q.get('choices', []))
                    correct_index = q.get('correctIndex', 0)
                    explanation = q.get('explanation', '')

                    # Map section names
                    section_map = {
                        'Quantitative': 'Quantitative Reasoning',
                        'Verbal': 'Verbal Reasoning',
                        'LogicalReasoning': 'Logical Reasoning',
                        'ChemPhys': 'Chemical and Physical Foundations',
                        'BioBiochem': 'Biological and Biochemical Foundations'
                    }
                    section = section_map.get(section_name, section_name)

                    # Topics
                    topics = q.get('topics', [])
                    topic = topics[0] if len(topics) > 0 else 'General'
                    subtopic = topics[1] if len(topics) > 1 else None

                    # IRT parameters
                    irt_a = q.get('irtA', 1.0)
                    irt_b = q.get('irtB', 0.0)
                    irt_c = q.get('irtC', 0.25)

                    # Difficulty and time
                    difficulty_label = q.get('difficulty', 'medium')
                    time_seconds = q.get('timeEstimate', 90)

                    # Insert into database
                    cursor.execute("""
                        INSERT INTO questions (
                            id, exam, section, topic, subtopic,
                            stem, choices, correct_index, explanation,
                            difficulty_label, irt_a, irt_b, irt_c,
                            time_seconds, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        question_id, exam_type, section, topic, subtopic,
                        stem, choices_json, correct_index, explanation,
                        difficulty_label, irt_a, irt_b, irt_c,
                        time_seconds, datetime.now().isoformat()
                    ))

                    print(f"  Imported: {question_id}")
                    total_imported += 1

                except Exception as e:
                    print(f"  Error importing {q.get('id', 'unknown')}: {e}")
                    continue

    conn.commit()
    conn.close()

    print(f"\n{'='*60}")
    print(f"Import Summary:")
    print(f"  Total imported: {total_imported}")
    print(f"  Total skipped: {total_skipped}")
    print(f"{'='*60}")


def main():
    # Paths
    seed_file = "/Users/vladimirantoine/Downloads/EUREKA  TEST PREP Platform/complete-seed-data.js"
    db_path = "/Users/vladimirantoine/EUREKA Updated/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/services/test-prep/qbank/questions.db"

    print("Starting seed data import...")
    print(f"Source: {seed_file}")
    print(f"Database: {db_path}")

    # Parse the JavaScript file
    print("\nParsing JavaScript file...")
    data = parse_manual(open(seed_file).read())

    # Count questions
    total_questions = sum(
        len(questions)
        for sections in data['questions'].values()
        for questions in sections.values()
    )
    print(f"Found {total_questions} questions to import")

    # Import to database
    print("\nImporting to database...")
    import_questions_to_db(data, db_path)

    print("\n✓ Import complete!")


if __name__ == "__main__":
    main()

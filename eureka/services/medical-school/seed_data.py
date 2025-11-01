"""
Sample Data Seed Script for EUREKA Medical School Service
Run this to populate your database with example data for testing
"""

import asyncio
from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import (
    USMLEQuestion,
    ClinicalCase,
    OSCEStation,
    MedicationDatabase,
    DifficultyLevel,
    CaseComplexity
)


async def seed_usmle_questions(db: AsyncSession, org_id: str):
    """Seed sample USMLE questions."""
    print("🎓 Seeding USMLE questions...")
    
    questions = [
        {
            "org_id": org_id,
            "question_text": "A 65-year-old man with a history of hypertension presents to the emergency department with severe chest pain radiating to his left arm. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most likely diagnosis?",
            "vignette": "Patient history: 20-year smoking history, family history of CAD, takes lisinopril and atorvastatin daily.",
            "option_a": "Acute pericarditis",
            "option_b": "Inferior wall myocardial infarction",
            "option_c": "Pulmonary embolism",
            "option_d": "Acute aortic dissection",
            "option_e": "Unstable angina",
            "correct_answer": "B",
            "difficulty_level": DifficultyLevel.STEP_2_CK,
            "subject": "Cardiology",
            "topic": "Myocardial Infarction",
            "subtopic": "ST-Elevation MI",
            "explanation": "ST-segment elevation in leads II, III, and aVF indicates an inferior wall STEMI. The right coronary artery (RCA) is typically involved. Immediate reperfusion therapy is indicated.",
            "learning_objectives": [
                "Recognize ECG patterns of inferior STEMI",
                "Understand coronary artery distribution",
                "Know immediate management of STEMI"
            ],
            "key_concepts": [
                "ST elevation",
                "Inferior leads",
                "RCA occlusion",
                "Immediate reperfusion"
            ]
        },
        {
            "org_id": org_id,
            "question_text": "A 28-year-old woman presents with a 3-week history of fatigue, weight gain, and cold intolerance. Laboratory studies show TSH 15 mU/L (normal 0.4-4.0) and free T4 0.6 ng/dL (normal 0.8-1.8). What is the most likely diagnosis?",
            "vignette": "Patient also reports constipation, dry skin, and irregular menses. No previous thyroid issues.",
            "option_a": "Graves' disease",
            "option_b": "Primary hypothyroidism",
            "option_c": "Secondary hypothyroidism",
            "option_d": "Subclinical hypothyroidism",
            "option_e": "Euthyroid sick syndrome",
            "correct_answer": "B",
            "difficulty_level": DifficultyLevel.STEP_1,
            "subject": "Endocrinology",
            "topic": "Thyroid Disorders",
            "subtopic": "Hypothyroidism",
            "explanation": "Elevated TSH with low free T4 indicates primary hypothyroidism. The thyroid gland is failing to produce adequate thyroid hormone, causing the pituitary to increase TSH production. Most common cause is Hashimoto's thyroiditis.",
            "learning_objectives": [
                "Interpret thyroid function tests",
                "Differentiate primary vs secondary hypothyroidism",
                "Recognize clinical manifestations of hypothyroidism"
            ],
            "key_concepts": [
                "TSH elevation",
                "Low T4",
                "Primary hypothyroidism",
                "Levothyroxine treatment"
            ]
        },
        {
            "org_id": org_id,
            "question_text": "A 45-year-old woman with no significant past medical history presents with sudden onset severe headache described as 'worst headache of my life.' She is alert but photophobic. What is the most appropriate next step?",
            "vignette": "Headache occurred suddenly while exercising. No fever, no focal neurological deficits on exam.",
            "option_a": "Start IV antibiotics",
            "option_b": "Administer triptans",
            "option_c": "Obtain non-contrast head CT",
            "option_d": "Perform lumbar puncture",
            "option_e": "Discharge with analgesics",
            "correct_answer": "C",
            "difficulty_level": DifficultyLevel.STEP_2_CK,
            "subject": "Neurology",
            "topic": "Headache",
            "subtopic": "Subarachnoid Hemorrhage",
            "explanation": "Sudden severe 'thunderclap' headache suggests subarachnoid hemorrhage (SAH). Non-contrast CT is first-line imaging (sensitivity ~95% within 6 hours). If negative, follow with LP to check for xanthochromia.",
            "learning_objectives": [
                "Recognize SAH presentation",
                "Know diagnostic approach for SAH",
                "Understand imaging sensitivity"
            ],
            "key_concepts": [
                "Thunderclap headache",
                "SAH workup",
                "Non-contrast CT first",
                "LP if CT negative"
            ]
        },
        {
            "org_id": org_id,
            "question_text": "A 6-month-old infant presents with recurrent respiratory infections and failure to thrive. Sweat chloride test shows 65 mEq/L (normal <40). What is the underlying genetic defect?",
            "vignette": "Baby has had 3 episodes of pneumonia. Stool is greasy and foul-smelling. Parents are concerned about growth.",
            "option_a": "Deletion of phenylalanine at position 508 of CFTR gene",
            "option_b": "Mutation in dystrophin gene",
            "option_c": "Trinucleotide repeat expansion",
            "option_d": "Chromosomal translocation",
            "option_e": "Mitochondrial DNA mutation",
            "correct_answer": "A",
            "difficulty_level": DifficultyLevel.STEP_1,
            "subject": "Pulmonology",
            "topic": "Cystic Fibrosis",
            "subtopic": "Genetics",
            "explanation": "Cystic fibrosis is caused by mutations in the CFTR gene, most commonly ΔF508 (deletion of phenylalanine at position 508). This causes defective chloride channel function, leading to thick secretions.",
            "learning_objectives": [
                "Understand CF genetics",
                "Recognize CF clinical presentation",
                "Interpret sweat chloride test"
            ],
            "key_concepts": [
                "CFTR gene mutation",
                "ΔF508 most common",
                "Autosomal recessive",
                "Sweat chloride >60 diagnostic"
            ]
        },
        {
            "org_id": org_id,
            "question_text": "A 35-year-old pregnant woman at 28 weeks gestation has a 1-hour glucose challenge test result of 155 mg/dL. What is the most appropriate next step?",
            "vignette": "First pregnancy, no previous history of diabetes. BMI 26. No symptoms.",
            "option_a": "Start insulin therapy",
            "option_b": "Perform 3-hour oral glucose tolerance test",
            "option_c": "Recheck in 4 weeks",
            "option_d": "Check HbA1c",
            "option_e": "No further testing needed",
            "correct_answer": "B",
            "difficulty_level": DifficultyLevel.STEP_2_CK,
            "subject": "Obstetrics",
            "topic": "Gestational Diabetes",
            "subtopic": "Screening",
            "explanation": "1-hour GCT >140 mg/dL requires confirmatory 3-hour OGTT. Two or more abnormal values on 3-hour test diagnose gestational diabetes. This screening occurs at 24-28 weeks gestation.",
            "learning_objectives": [
                "Understand GDM screening protocol",
                "Know diagnostic criteria",
                "Recognize importance of early detection"
            ],
            "key_concepts": [
                "GCT screening",
                "OGTT confirmation",
                "24-28 weeks timing",
                "Two abnormal values needed"
            ]
        }
    ]
    
    for q_data in questions:
        question = USMLEQuestion(**q_data)
        db.add(question)
    
    await db.commit()
    print(f"   ✅ Added {len(questions)} USMLE questions")


async def seed_clinical_cases(db: AsyncSession, org_id: str):
    """Seed sample clinical cases."""
    print("🏥 Seeding clinical cases...")
    
    cases = [
        {
            "org_id": org_id,
            "title": "Acute Appendicitis in Young Adult",
            "description": "Classic presentation of acute appendicitis with McBurney's point tenderness",
            "case_number": "CC-001",
            "patient_age": 22,
            "patient_sex": "Male",
            "chief_complaint": "Right lower quadrant abdominal pain for 12 hours",
            "presenting_symptoms": [
                "Periumbilical pain that migrated to RLQ",
                "Nausea and vomiting",
                "Anorexia",
                "Low-grade fever"
            ],
            "vital_signs": {
                "blood_pressure": "125/78",
                "heart_rate": 98,
                "respiratory_rate": 18,
                "temperature": 38.2,
                "oxygen_saturation": 98
            },
            "physical_exam_findings": {
                "general": "Uncomfortable, lying still",
                "abdomen": "RLQ tenderness, guarding, positive Rovsing sign, positive psoas sign",
                "bowel_sounds": "Hypoactive"
            },
            "hpi": "22-year-old male presents with 12 hours of abdominal pain. Pain started around umbilicus and migrated to RLQ. Associated with nausea, vomiting x2, and loss of appetite. Denies diarrhea or urinary symptoms.",
            "past_medical_history": ["None"],
            "medications": ["None"],
            "allergies": ["NKDA"],
            "social_history": {
                "occupation": "College student",
                "tobacco": "Non-smoker",
                "alcohol": "Occasional"
            },
            "primary_diagnosis": "Acute appendicitis",
            "differential_diagnoses": [
                "Mesenteric lymphadenitis",
                "Gastroenteritis",
                "Ureterolithiasis",
                "Ileitis"
            ],
            "icd_10_code": "K35.80",
            "learning_objectives": [
                "Recognize classic appendicitis presentation",
                "Perform appropriate physical examination",
                "Order correct diagnostic tests",
                "Know surgical indications"
            ],
            "key_teaching_points": [
                "Migration of pain is characteristic",
                "McBurney's point is 2/3 distance from umbilicus to ASIS",
                "CT imaging is gold standard",
                "Surgical consultation for appendectomy"
            ],
            "complexity": CaseComplexity.BASIC,
            "specialty": "General Surgery",
            "setting": "Emergency Department",
            "estimated_duration_minutes": 20
        },
        {
            "org_id": org_id,
            "title": "Diabetic Ketoacidosis in Type 1 Diabetes",
            "description": "Young patient with known Type 1 DM presents in DKA after missing insulin doses",
            "case_number": "CC-002",
            "patient_age": 19,
            "patient_sex": "Female",
            "chief_complaint": "Nausea, vomiting, and confusion for 1 day",
            "presenting_symptoms": [
                "Polyuria and polydipsia for 3 days",
                "Nausea and vomiting",
                "Abdominal pain",
                "Altered mental status",
                "Fruity breath odor"
            ],
            "vital_signs": {
                "blood_pressure": "95/60",
                "heart_rate": 125,
                "respiratory_rate": 28,
                "temperature": 37.1,
                "oxygen_saturation": 97
            },
            "physical_exam_findings": {
                "general": "Lethargic, ill-appearing",
                "heent": "Dry mucous membranes",
                "cardiovascular": "Tachycardic, regular rhythm",
                "respiratory": "Tachypneic, deep breathing (Kussmaul respirations)",
                "abdomen": "Diffuse tenderness without guarding",
                "skin": "Poor turgor"
            },
            "hpi": "19-year-old female with Type 1 DM (diagnosed age 12) presents with 3 days of polyuria/polydipsia and 1 day of nausea/vomiting. Admits to missing insulin doses over past week due to running out of supplies. Became increasingly confused today.",
            "past_medical_history": ["Type 1 Diabetes Mellitus"],
            "medications": ["Insulin glargine", "Insulin lispro"],
            "allergies": ["NKDA"],
            "social_history": {
                "occupation": "College student",
                "tobacco": "Non-smoker",
                "alcohol": "Denies"
            },
            "primary_diagnosis": "Diabetic ketoacidosis",
            "differential_diagnoses": [
                "Hyperosmolar hyperglycemic state",
                "Sepsis",
                "Acute gastroenteritis",
                "Pancreatitis"
            ],
            "icd_10_code": "E10.10",
            "learning_objectives": [
                "Recognize DKA clinical presentation",
                "Understand DKA pathophysiology",
                "Know diagnostic criteria",
                "Implement appropriate treatment"
            ],
            "key_teaching_points": [
                "DKA triad: hyperglycemia, ketosis, acidosis",
                "Kussmaul respirations are compensatory",
                "Treatment: fluids, insulin, potassium",
                "Common precipitants: infection, non-compliance"
            ],
            "complexity": CaseComplexity.INTERMEDIATE,
            "specialty": "Endocrinology",
            "setting": "Emergency Department",
            "estimated_duration_minutes": 30
        }
    ]
    
    for case_data in cases:
        case = ClinicalCase(**case_data)
        db.add(case)
    
    await db.commit()
    print(f"   ✅ Added {len(cases)} clinical cases")


async def seed_osce_stations(db: AsyncSession, org_id: str):
    """Seed sample OSCE stations."""
    print("🎯 Seeding OSCE stations...")
    
    stations = [
        {
            "org_id": org_id,
            "station_number": 1,
            "title": "Breaking Bad News - Cancer Diagnosis",
            "description": "Deliver a new diagnosis of lung cancer to a patient",
            "patient_scenario": "You are meeting with Mr. Johnson, a 62-year-old smoker, to discuss his recent CT scan results which show a suspicious mass in his right lung. Biopsy results confirm non-small cell lung cancer.",
            "standardized_patient_instructions": "You are shocked and scared. Ask questions about prognosis and treatment. Become emotional but receptive to support.",
            "tasks": [
                {"task": "Establish rapport and set appropriate environment", "points": 2},
                {"task": "Assess patient's understanding and readiness", "points": 2},
                {"task": "Deliver diagnosis clearly and compassionately", "points": 3},
                {"task": "Allow time for emotional response", "points": 2},
                {"task": "Provide information about next steps", "points": 2},
                {"task": "Offer support and resources", "points": 2},
                {"task": "Schedule follow-up", "points": 1}
            ],
            "duration_minutes": 10,
            "rubric": [
                {"id": "rapport", "description": "Established rapport and privacy", "points": 2, "category": "Communication"},
                {"id": "assess", "description": "Assessed patient understanding", "points": 2, "category": "Communication"},
                {"id": "deliver", "description": "Delivered news clearly and compassionately", "points": 3, "category": "Communication"},
                {"id": "emotion", "description": "Allowed time for emotional response", "points": 2, "category": "Communication"},
                {"id": "information", "description": "Provided clear information about next steps", "points": 2, "category": "Clinical Knowledge"},
                {"id": "support", "description": "Offered appropriate support and resources", "points": 2, "category": "Professionalism"},
                {"id": "followup", "description": "Arranged appropriate follow-up", "points": 1, "category": "Clinical Knowledge"}
            ],
            "total_points": 14,
            "passing_score": 10,
            "clinical_skills": ["Breaking bad news", "Patient communication", "Empathy"],
            "communication_skills": ["Active listening", "Non-verbal communication", "Clarity"],
            "specialty": "Internal Medicine",
            "difficulty": CaseComplexity.INTERMEDIATE
        },
        {
            "org_id": org_id,
            "station_number": 2,
            "title": "Cardiovascular Examination",
            "description": "Perform a focused cardiovascular examination",
            "patient_scenario": "Mr. Smith is a 55-year-old with chest pain. Perform a cardiovascular examination.",
            "standardized_patient_instructions": "You have a systolic murmur best heard at the apex. Cooperate with the examination.",
            "tasks": [
                {"task": "Wash hands and introduce self", "points": 1},
                {"task": "Position patient appropriately", "points": 1},
                {"task": "Inspect for signs of cardiac disease", "points": 2},
                {"task": "Palpate pulses systematically", "points": 3},
                {"task": "Auscultate all four areas", "points": 4},
                {"task": "Assess for peripheral edema", "points": 2},
                {"task": "Thank patient and explain findings", "points": 1}
            ],
            "duration_minutes": 10,
            "rubric": [
                {"id": "hygiene", "description": "Hand hygiene performed", "points": 1, "category": "Professionalism"},
                {"id": "position", "description": "Patient positioned correctly", "points": 1, "category": "Clinical Skills"},
                {"id": "inspect", "description": "Thorough inspection performed", "points": 2, "category": "Clinical Skills"},
                {"id": "pulses", "description": "All pulses checked systematically", "points": 3, "category": "Clinical Skills"},
                {"id": "auscultate", "description": "All four areas auscultated correctly", "points": 4, "category": "Clinical Skills"},
                {"id": "edema", "description": "Checked for peripheral edema", "points": 2, "category": "Clinical Skills"},
                {"id": "closure", "description": "Thanked patient and explained findings", "points": 1, "category": "Communication"}
            ],
            "total_points": 14,
            "passing_score": 10,
            "clinical_skills": ["Physical examination", "Cardiovascular assessment", "Auscultation"],
            "communication_skills": ["Patient interaction", "Explanation of findings"],
            "specialty": "Cardiology",
            "difficulty": CaseComplexity.BASIC
        }
    ]
    
    for station_data in stations:
        station = OSCEStation(**station_data)
        db.add(station)
    
    await db.commit()
    print(f"   ✅ Added {len(stations)} OSCE stations")


async def seed_medications(db: AsyncSession):
    """Seed sample medications."""
    print("💊 Seeding medications...")
    
    medications = [
        {
            "generic_name": "Lisinopril",
            "brand_names": ["Prinivil", "Zestril"],
            "drug_class": "ACE Inhibitor",
            "mechanism_of_action": "Inhibits angiotensin-converting enzyme (ACE), preventing conversion of angiotensin I to angiotensin II, resulting in decreased vasoconstriction and aldosterone secretion.",
            "indications": ["Hypertension", "Heart failure", "Post-MI", "Diabetic nephropathy"],
            "contraindications": ["Pregnancy", "Bilateral renal artery stenosis", "Angioedema history", "Hyperkalemia"],
            "side_effects": ["Dry cough", "Hyperkalemia", "Angioedema", "Hypotension", "Acute renal failure"],
            "drug_interactions": [
                {"drug": "NSAIDs", "interaction": "Decreased antihypertensive effect"},
                {"drug": "Potassium supplements", "interaction": "Increased risk of hyperkalemia"},
                {"drug": "Diuretics", "interaction": "Enhanced hypotensive effect"}
            ],
            "adult_dosing": "Initial: 5-10 mg PO daily; Maintenance: 10-40 mg PO daily",
            "pediatric_dosing": "Children ≥6 years: Initial 0.07 mg/kg once daily (max 5 mg); titrate to effect",
            "renal_adjustments": "CrCl <30: Initial dose 2.5 mg daily",
            "hepatic_adjustments": "No adjustment needed",
            "monitoring_parameters": ["Blood pressure", "Serum creatinine", "Potassium", "Cough"],
            "black_box_warnings": ["Can cause fetal harm when administered to pregnant women"],
            "clinical_pearls": [
                "First-line for hypertension in diabetes",
                "Cough occurs in 5-10% of patients",
                "Check K+ and Cr before starting and 1-2 weeks after",
                "Do not use with ARBs - increased adverse events"
            ],
            "board_exam_highlights": [
                "ACE inhibitor induced cough is bradykinin-mediated",
                "Contraindicated in pregnancy (teratogenic)",
                "First-line for diabetic nephropathy",
                "Can cause angioedema (stop immediately)"
            ]
        },
        {
            "generic_name": "Metformin",
            "brand_names": ["Glucophage", "Fortamet"],
            "drug_class": "Biguanide",
            "mechanism_of_action": "Decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity by increasing peripheral glucose uptake and utilization.",
            "indications": ["Type 2 diabetes mellitus", "Polycystic ovary syndrome (off-label)", "Prediabetes prevention"],
            "contraindications": ["eGFR <30", "Metabolic acidosis", "Acute CHF", "Severe liver disease", "Excessive alcohol use"],
            "side_effects": ["Diarrhea", "Nausea", "Abdominal discomfort", "Metallic taste", "Vitamin B12 deficiency", "Lactic acidosis (rare)"],
            "drug_interactions": [
                {"drug": "Contrast dye", "interaction": "Hold 48 hours before procedure"},
                {"drug": "Alcohol", "interaction": "Increased risk of lactic acidosis"},
                {"drug": "Carbonic anhydrase inhibitors", "interaction": "Increased risk of lactic acidosis"}
            ],
            "adult_dosing": "Initial: 500 mg PO BID or 850 mg PO daily with meals; Max: 2550 mg/day divided",
            "pediatric_dosing": "Children ≥10 years: Initial 500 mg PO BID; Max 2000 mg/day",
            "renal_adjustments": "eGFR 30-45: Use caution, monitor closely; eGFR <30: Contraindicated",
            "hepatic_adjustments": "Avoid in severe hepatic impairment",
            "monitoring_parameters": ["HbA1c", "Renal function", "Vitamin B12 levels", "LFTs"],
            "black_box_warnings": ["Lactic acidosis (rare but serious) - risk factors include renal impairment"],
            "clinical_pearls": [
                "First-line for Type 2 diabetes",
                "Weight neutral or slight weight loss",
                "Start low, titrate slow to minimize GI effects",
                "Hold before surgery and contrast procedures"
            ],
            "board_exam_highlights": [
                "Does NOT cause hypoglycemia",
                "Lactic acidosis is key side effect",
                "Must hold before contrast studies",
                "Check B12 levels with long-term use"
            ]
        },
        {
            "generic_name": "Albuterol",
            "brand_names": ["ProAir", "Ventolin", "Proventil"],
            "drug_class": "Short-acting beta-2 agonist (SABA)",
            "mechanism_of_action": "Selective beta-2 adrenergic agonist causing relaxation of bronchial smooth muscle, increased ciliary activity, and decreased mediator release from mast cells.",
            "indications": ["Bronchospasm", "Asthma", "COPD", "Exercise-induced bronchospasm"],
            "contraindications": ["Hypersensitivity to albuterol"],
            "side_effects": ["Tachycardia", "Tremor", "Nervousness", "Headache", "Hypokalemia", "Hyperglycemia"],
            "drug_interactions": [
                {"drug": "Beta-blockers", "interaction": "Antagonize bronchodilator effect"},
                {"drug": "MAOIs", "interaction": "Potentiate cardiovascular effects"},
                {"drug": "Diuretics", "interaction": "May potentiate hypokalemia"}
            ],
            "adult_dosing": "MDI: 2 puffs q4-6h PRN; Nebulizer: 2.5 mg q4-6h PRN",
            "pediatric_dosing": "MDI: 1-2 puffs q4-6h PRN; Nebulizer: 0.63-2.5 mg q4-6h PRN based on age",
            "renal_adjustments": "No adjustment needed",
            "hepatic_adjustments": "No adjustment needed",
            "monitoring_parameters": ["Heart rate", "Blood pressure", "Respiratory rate", "Lung sounds", "Peak flow"],
            "black_box_warnings": ["Asthma-related deaths increased with excessive use of LABAs (not albuterol)"],
            "clinical_pearls": [
                "Rescue inhaler for acute symptoms",
                "Using >2x/week suggests poor control",
                "Use spacer for better delivery",
                "Onset 5-15 minutes, duration 4-6 hours"
            ],
            "board_exam_highlights": [
                "First-line for acute bronchospasm",
                "Beta-2 selective (minimal cardiac effects)",
                "Overuse indicates need for controller",
                "Can cause hypokalemia"
            ]
        }
    ]
    
    for med_data in medications:
        medication = MedicationDatabase(**med_data)
        db.add(medication)
    
    await db.commit()
    print(f"   ✅ Added {len(medications)} medications")


async def main():
    """Main seeding function."""
    print("\n" + "="*60)
    print("🌱 EUREKA Medical School Service - Database Seeding")
    print("="*60 + "\n")
    
    # Generate org_id for sample data
    org_id = str(uuid4())
    print(f"📋 Using Organization ID: {org_id}\n")
    
    async with AsyncSessionLocal() as db:
        try:
            # Seed all data
            await seed_usmle_questions(db, org_id)
            await seed_clinical_cases(db, org_id)
            await seed_osce_stations(db, org_id)
            await seed_medications(db)
            
            print("\n" + "="*60)
            print("✅ Database seeding completed successfully!")
            print("="*60)
            print(f"\n📊 Summary:")
            print(f"   • 5 USMLE questions")
            print(f"   • 2 Clinical cases")
            print(f"   • 2 OSCE stations")
            print(f"   • 3 Medications")
            print(f"\n🎯 Organization ID: {org_id}")
            print(f"   Use this ID when testing the API\n")
            
        except Exception as e:
            print(f"\n❌ Error during seeding: {str(e)}")
            await db.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(main())

-- Seed data for Medical School tables
-- Starting with USMLE Questions only

DO $$
DECLARE
    org_uuid UUID;
BEGIN
    -- Get the first organization ID
    SELECT id INTO org_uuid FROM organizations LIMIT 1;

    -- If no organization exists, create a default one
    IF org_uuid IS NULL THEN
        INSERT INTO organizations (name, domain, is_active)
        VALUES ('EUREKA Medical School', 'eureka-medical.edu', true)
        RETURNING id INTO org_uuid;
    END IF;

    -- Insert USMLE Questions
    INSERT INTO usmle_questions (org_id, question_text, vignette, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, difficulty_level, subject, topic, "references", times_used, times_correct, is_active) VALUES
    (org_uuid, 'A 45-year-old woman presents with fatigue and weight gain. Lab results show TSH 12 mIU/L (normal 0.5-5.0) and free T4 0.6 ng/dL (normal 0.8-1.8). What is the most likely diagnosis?',
     'Patient has cold intolerance, dry skin, and constipation for 3 months.',
     'Hyperthyroidism',
     'Primary hypothyroidism',
     'Secondary hypothyroidism',
     'Subclinical hypothyroidism',
     'Euthyroid sick syndrome',
     'B',
     'The elevated TSH and low free T4 indicate primary hypothyroidism. The pituitary is producing more TSH to compensate for low thyroid hormone production. Clinical symptoms (cold intolerance, dry skin, constipation, fatigue, weight gain) are classic for hypothyroidism. Secondary hypothyroidism would show low TSH with low T4.',
     'intermediate', 'Endocrinology', 'Thyroid Disorders',
     '{"source": "Harrison''s Internal Medicine", "chapter": "Thyroid Disorders"}', 0, 0, true),

    (org_uuid, 'A 28-year-old man presents to the emergency department with severe chest pain radiating to his back. Blood pressure is 180/110 mmHg in the right arm and 130/80 mmHg in the left arm. What is the most appropriate immediate diagnostic test?',
     'Patient has a history of Marfan syndrome and sudden onset of tearing chest pain.',
     'ECG',
     'Chest X-ray',
     'CT angiography of the chest',
     'Echocardiography',
     'Cardiac catheterization',
     'C',
     'This presentation is highly concerning for aortic dissection: tearing chest pain radiating to back, BP differential between arms (>20 mmHg), and Marfan syndrome (risk factor for dissection). CT angiography is the gold standard for diagnosing aortic dissection. While ECG and CXR may provide clues, CT angiography directly visualizes the dissection and is the most appropriate immediate test.',
     'advanced', 'Cardiology', 'Aortic Dissection',
     '{"source": "UpToDate", "topic": "Acute Aortic Dissection"}', 0, 0, true),

    (org_uuid, 'Which of the following is the first-line treatment for uncomplicated urinary tract infection in a non-pregnant woman?',
     NULL,
     'Amoxicillin',
     'Nitrofurantoin',
     'Ciprofloxacin',
     'Cephalexin',
     'Azithromycin',
     'B',
     'Nitrofurantoin is first-line for uncomplicated UTI per IDSA guidelines due to its excellent urinary concentration, minimal resistance rates, and minimal collateral damage to normal flora. Ciprofloxacin (fluoroquinolone) is effective but reserved for complicated infections due to resistance concerns and side effects. Amoxicillin has high resistance rates.',
     'basic', 'Infectious Disease', 'Urinary Tract Infections',
     '{"source": "IDSA Guidelines", "year": 2023}', 0, 0, true),

    (org_uuid, 'A 60-year-old diabetic patient presents with a foot ulcer. Physical exam reveals absence of sensation to 10g monofilament. What is the most appropriate initial management?',
     'Patient has had diabetes for 15 years with poor glycemic control. Ulcer is on the plantar surface of the first metatarsal head.',
     'Immediate surgical debridement',
     'Oral antibiotics only',
     'Offloading with total contact cast',
     'Hyperbaric oxygen therapy',
     'Amputation',
     'C',
     'The patient has diabetic neuropathy (loss of protective sensation) and a plantar ulcer. Offloading with a total contact cast is the gold standard initial treatment to remove pressure from the ulcer and promote healing. The absence of sensation indicates neuropathic ulcer; continued pressure prevents healing. Antibiotics are only needed if infected. Debridement and other interventions may be needed but offloading is the priority.',
     'intermediate', 'Endocrinology', 'Diabetic Foot Care',
     '{"source": "ADA Clinical Practice Guidelines", "year": 2024}', 0, 0, true),

    (org_uuid, 'A newborn presents with cyanosis that does not improve with oxygen administration. An echocardiogram shows complete transposition of the great arteries. What is the most appropriate immediate intervention?',
     'The infant is 2 hours old with oxygen saturation of 70% despite 100% oxygen.',
     'Beta blockers',
     'Prostaglandin E1 infusion',
     'Diuretics',
     'ACE inhibitors',
     'Immediate surgical correction',
     'B',
     'Transposition of the great arteries (TGA) is a cyanotic congenital heart defect where the aorta arises from the RV and pulmonary artery from the LV. The infant is cyanotic because oxygenated and deoxygenated blood flow in parallel circuits. Prostaglandin E1 keeps the ductus arteriosus open, allowing mixing of blood between the two circuits until definitive surgical repair (arterial switch) can be performed. This is a critical intervention.',
     'advanced', 'Pediatrics', 'Congenital Heart Disease',
     '{"source": "Nelson Textbook of Pediatrics", "edition": "21st"}', 0, 0, true),

    (org_uuid, 'A 32-year-old woman presents with sudden onset severe headache described as "the worst headache of my life". She has nuchal rigidity and photophobia. What is the most appropriate immediate diagnostic test?',
     'Patient was exercising when headache started. No trauma. No history of migraines.',
     'MRI brain',
     'EEG',
     'Non-contrast CT head',
     'Lumbar puncture',
     'Cerebral angiography',
     'C',
     'This presentation is classic for subarachnoid hemorrhage (SAH): sudden onset "worst headache of life" with meningeal signs. Non-contrast CT head is the first test - it is 95% sensitive for SAH in the first 24 hours. If CT is negative but clinical suspicion remains high, then lumbar puncture should be performed. MRI is less sensitive acutely.',
     'advanced', 'Neurology', 'Subarachnoid Hemorrhage',
     '{"source": "Adams and Victor Principles of Neurology"}', 0, 0, true),

    (org_uuid, 'A 55-year-old man with chronic kidney disease presents with fatigue, weakness, and palpitations. ECG shows peaked T waves and widened QRS complexes. Potassium level is 7.2 mEq/L. What is the most appropriate immediate treatment?',
     'Patient missed his last two dialysis sessions.',
     'Oral kayexalate',
     'Furosemide',
     'IV calcium gluconate',
     'Hemodialysis',
     'Insulin and glucose IV',
     'C',
     'Severe hyperkalemia with ECG changes (peaked T waves, widened QRS) is a medical emergency. IV calcium gluconate is the first-line treatment because it stabilizes the cardiac membrane and prevents arrhythmias within minutes. It does not lower potassium but protects the heart. After calcium, treatments to lower K+ (insulin/glucose, dialysis) should be given.',
     'advanced', 'Nephrology', 'Hyperkalemia',
     '{"source": "UpToDate", "topic": "Treatment of Hyperkalemia"}', 0, 0, true),

    (org_uuid, 'A 3-year-old child presents with barking cough, inspiratory stridor, and hoarseness. Symptoms are worse at night. What is the most likely diagnosis?',
     'Child had a mild cold for 2 days before cough started. No difficulty swallowing.',
     'Epiglottitis',
     'Foreign body aspiration',
     'Croup (laryngotracheobronchitis)',
     'Bacterial tracheitis',
     'Asthma',
     'C',
     'Croup is characterized by barking cough, inspiratory stridor, and hoarseness, typically in children 6 months to 3 years. It follows an upper respiratory infection and is usually caused by parainfluenza virus. Symptoms worsen at night. Epiglottitis presents with drooling, difficulty swallowing, and toxic appearance (rare since Hib vaccine).',
     'basic', 'Pediatrics', 'Croup',
     '{"source": "Nelson Textbook of Pediatrics"}', 0, 0, true);

    -- Insert Clinical Cases (with correct column names)
    INSERT INTO clinical_cases (
        org_id, title, description, specialty, complexity,
        patient_age, patient_sex, chief_complaint, hpi,
        physical_exam_findings, lab_results, imaging_studies,
        primary_diagnosis, treatment_plan, learning_objectives, is_active
    ) VALUES
    (org_uuid, 'Acute Myocardial Infarction in Young Adult',
     'A 35-year-old male with no known medical history presents with acute onset chest pain.',
     'Cardiology', 'intermediate',
     35, 'male', 'Chest pain',
     'Patient reports sudden onset of crushing substernal chest pain radiating to left arm, started 2 hours ago. Associated with diaphoresis and nausea. No previous cardiac history. Smokes 1 pack per day for 15 years. Family history significant for father with MI at age 45.',
     '{"vitals": {"BP": "150/95", "HR": "110", "RR": "22", "SpO2": "96% on RA"}, "general": "anxious and diaphoretic", "cardiac": "regular rhythm, no murmurs", "pulmonary": "lungs clear bilaterally", "extremities": "no peripheral edema"}',
     '{"troponin": "2.5 ng/mL (elevated)", "CK-MB": "elevated", "CBC": "WBC 12,000", "BMP": "normal", "lipid_panel": {"total_cholesterol": 280, "LDL": 180, "HDL": 32, "triglycerides": 300}}',
     '{"ECG": "ST elevation in leads II, III, aVF - inferior STEMI", "CXR": "normal cardiac silhouette, no pulmonary edema"}',
     'Acute inferior wall ST-elevation myocardial infarction (STEMI)',
     '{"immediate": ["Aspirin 325mg", "Clopidogrel 600mg loading dose", "Heparin bolus", "Activate cath lab for primary PCI"], "long_term": ["Dual antiplatelet therapy", "High-intensity statin", "Beta blocker", "ACE inhibitor", "Cardiac rehabilitation", "Smoking cessation counseling"]}',
     '["Recognize STEMI presentation and ECG findings", "Understand time-critical nature of reperfusion therapy", "Identify cardiovascular risk factors in young patients", "Implement appropriate pharmacotherapy for ACS"]',
     true),

    (org_uuid, 'Diabetic Ketoacidosis Management',
     'A 22-year-old female with type 1 diabetes presents with altered mental status and vomiting.',
     'Endocrinology', 'advanced',
     22, 'female', 'Altered mental status and vomiting',
     'Patient with known T1DM for 10 years, usually well-controlled. Reports 3 days of nausea, vomiting, and increased urination. Ran out of insulin 2 days ago. No fever or other symptoms.',
     '{"vitals": {"BP": "95/60", "HR": "125", "RR": "28 (Kussmaul breathing)", "T": "37.2°C", "SpO2": "98% on RA"}, "general": "lethargic but arousable", "HEENT": "dry mucous membranes", "skin": "poor skin turgor", "breath": "fruity odor", "abdomen": "soft, diffusely tender"}',
     '{"glucose": "520 mg/dL", "pH": "7.15", "HCO3": "8 mEq/L", "anion_gap": 28, "beta_hydroxybutyrate": "6.2 mmol/L", "potassium": "5.8 mEq/L", "sodium": "128 mEq/L", "BUN": 35, "creatinine": 1.4}',
     '{"CXR": "no acute process", "Head_CT": "if indicated, no acute findings"}',
     'Diabetic ketoacidosis (DKA)',
     '{"immediate": ["IV fluids (NS 1-2L bolus then 250-500 mL/hr)", "Insulin infusion 0.1 units/kg/hr", "Monitor glucose hourly", "Electrolytes q2h"], "ongoing": ["Add dextrose when glucose <250", "Replace potassium when K+ <5.3 and adequate urine output", "Monitor for cerebral edema", "Search for precipitating cause"]}',
     '["Diagnose DKA based on triad of hyperglycemia, acidosis, and ketosis", "Understand fluid and electrolyte management in DKA", "Recognize complications including cerebral edema", "Implement appropriate insulin therapy protocol"]',
     true),

    (org_uuid, 'Community-Acquired Pneumonia in Elderly',
     'A 78-year-old nursing home resident presents with fever, cough, and confusion.',
     'Infectious Disease', 'intermediate',
     78, 'female', 'Fever and altered mental status',
     'Patient brought from nursing home with 2-day history of fever, productive cough with yellow sputum, and decreased oral intake. Baseline dementia but acutely more confused. Past medical history: HTN, CHF, dementia, COPD.',
     '{"vitals": {"BP": "105/65", "HR": "105", "RR": "26", "T": "39.1°C", "SpO2": "88% on RA"}, "mental_status": "confused, oriented to self only", "pulmonary": "crackles and decreased breath sounds in right lower lobe", "cardiovascular": "JVP not elevated, no peripheral edema"}',
     '{"WBC": "18,500 with left shift", "procalcitonin": 2.5, "lactate": 2.8, "BUN": 42, "creatinine": 1.8, "blood_cultures": "pending"}',
     '{"CXR": "right lower lobe infiltrate with air bronchograms", "CT_chest": "consolidation RLL, no empyema"}',
     'Community-acquired pneumonia (CAP), severe, likely aspiration component',
     '{"admission": "hospital admission", "antibiotics": ["IV ceftriaxone + azithromycin OR", "Respiratory fluoroquinolone"], "supportive": ["Supplemental oxygen to maintain SpO2 >90%", "IV fluids", "Monitor respiratory status"], "assessment": "CURB-65 score = 4 (high risk)", "precautions": "Aspiration precautions", "discussion": "Advance care planning with family"}',
     '["Apply CAP severity assessment tools (CURB-65, PSI)", "Select appropriate empiric antibiotic regimen", "Recognize aspiration risk in elderly patients", "Understand goals of care discussions"]',
     true);

    -- Insert OSCE Stations (with correct column names)
    INSERT INTO osce_stations (
        org_id, station_number, title, description, patient_scenario,
        duration_minutes, total_points, passing_score,
        rubric, clinical_skills, communication_skills,
        specialty, difficulty, is_active
    ) VALUES
    (org_uuid, 1, 'Breaking Bad News - Cancer Diagnosis',
     'Deliver a new cancer diagnosis to a patient using SPIKES protocol.',
     'You are seeing Mrs. Johnson, a 55-year-old woman, to discuss the results of her breast biopsy. The pathology shows invasive ductal carcinoma. She came alone to the appointment and appears anxious. You need to break the news of her cancer diagnosis.',
     20, 100, 70,
     '{"setting": {"points": 10, "criteria": "Ensures privacy, sits down, appropriate body language"}, "perception": {"points": 15, "criteria": "Explores patient understanding before delivering news"}, "invitation": {"points": 10, "criteria": "Asks patient how much information they want"}, "knowledge": {"points": 20, "criteria": "Delivers information clearly, avoids jargon, checks understanding"}, "empathy": {"points": 25, "criteria": "Acknowledges emotions, provides support, allows silence"}, "summary": {"points": 20, "criteria": "Summarizes, discusses next steps, offers resources"}}',
     '["SPIKES protocol", "Breaking bad news", "Patient-centered communication"]',
     '["Empathetic listening", "Non-verbal communication", "Handling emotions", "Clear explanation"]',
     'Oncology', 'intermediate', true),

    (org_uuid, 2, 'Cardiac Examination',
     'Perform a complete cardiovascular examination on a patient with a murmur.',
     'Examine this patient who has been referred for evaluation of a heart murmur detected during a routine physical exam. The patient is asymptomatic. Perform a complete cardiovascular examination and present your findings.',
     15, 100, 70,
     '{"preparation": {"points": 15, "criteria": "Hand hygiene, introduces self, explains procedure, obtains consent, proper positioning"}, "inspection": {"points": 15, "criteria": "JVP assessment, precordial inspection, peripheral inspection"}, "palpation": {"points": 20, "criteria": "Apex beat location and character, thrills, heaves, parasternal heave"}, "auscultation": {"points": 30, "criteria": "Systematic approach (aortic, pulmonary, tricuspid, mitral), bell and diaphragm, identifies murmur"}, "dynamic_maneuvers": {"points": 10, "criteria": "Appropriate maneuvers (Valsalva, position changes)"}, "presentation": {"points": 10, "criteria": "Clear, organized presentation of findings"}}',
     '["Cardiovascular examination", "Cardiac auscultation", "Physical examination"]',
     '["Professional manner", "Patient comfort", "Systematic approach"]',
     'Cardiology', 'basic', true),

    (org_uuid, 3, 'Suturing Simple Laceration',
     'Repair a 4cm laceration on a hand model using simple interrupted sutures.',
     'A 30-year-old patient presents to the ED with a 4cm laceration on the dorsum of the hand sustained from a kitchen knife. The wound is clean with no tendon or nerve involvement. Local anesthesia has been administered. Repair the laceration using simple interrupted sutures.',
     15, 100, 70,
     '{"sterile_technique": {"points": 20, "criteria": "Proper hand hygiene, gloving, wound preparation, draping"}, "instrument_handling": {"points": 15, "criteria": "Correct needle holder grip, forceps use"}, "suture_technique": {"points": 35, "criteria": "90-degree needle entry/exit, adequate bite (5mm), appropriate spacing, proper depth"}, "knot_tying": {"points": 20, "criteria": "Square knots, appropriate tension, secure knots"}, "wound_closure": {"points": 10, "criteria": "Good edge approximation, no strangulation, aesthetic result"}}',
     '["Simple interrupted sutures", "Sterile technique", "Wound repair", "Instrument handling"]',
     '["Patient explanation", "Procedural efficiency"]',
     'Emergency Medicine', 'basic', true);

END $$;

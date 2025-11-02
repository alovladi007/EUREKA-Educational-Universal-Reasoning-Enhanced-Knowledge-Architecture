-- Seed USMLE questions with correct difficulty levels (STEP_1, STEP_2_CK, STEP_3)
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

    -- Insert USMLE Questions with STEP levels
    INSERT INTO usmle_questions (org_id, question_text, vignette, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, difficulty_level, subject, topic, "references", times_used, times_correct, is_active) VALUES
    -- STEP_1 Questions (Basic Sciences)
    (org_uuid, 'A 45-year-old woman presents with fatigue and weight gain. Lab results show TSH 12 mIU/L (normal 0.5-5.0) and free T4 0.6 ng/dL (normal 0.8-1.8). What is the most likely diagnosis?',
     'Patient has cold intolerance, dry skin, and constipation for 3 months.',
     'Hyperthyroidism',
     'Primary hypothyroidism',
     'Secondary hypothyroidism',
     'Subclinical hypothyroidism',
     'Euthyroid sick syndrome',
     'B',
     'The elevated TSH and low free T4 indicate primary hypothyroidism. The pituitary is producing more TSH to compensate for low thyroid hormone production. Clinical symptoms (cold intolerance, dry skin, constipation, fatigue, weight gain) are classic for hypothyroidism. Secondary hypothyroidism would show low TSH with low T4.',
     'STEP_1', 'Endocrinology', 'Thyroid Disorders',
     '{"source": "Harrison''s Internal Medicine", "chapter": "Thyroid Disorders"}', 0, 0, true),

    (org_uuid, 'Which of the following is the first-line treatment for uncomplicated urinary tract infection in a non-pregnant woman?',
     NULL,
     'Amoxicillin',
     'Nitrofurantoin',
     'Ciprofloxacin',
     'Cephalexin',
     'Azithromycin',
     'B',
     'Nitrofurantoin is first-line for uncomplicated UTI per IDSA guidelines due to its excellent urinary concentration, minimal resistance rates, and minimal collateral damage to normal flora. Ciprofloxacin (fluoroquinolone) is effective but reserved for complicated infections due to resistance concerns and side effects. Amoxicillin has high resistance rates.',
     'STEP_1', 'Infectious Disease', 'Urinary Tract Infections',
     '{"source": "IDSA Guidelines", "year": 2023}', 0, 0, true),

    (org_uuid, 'A 3-year-old child presents with barking cough, inspiratory stridor, and hoarseness. Symptoms are worse at night. What is the most likely diagnosis?',
     'Child had a mild cold for 2 days before cough started. No difficulty swallowing.',
     'Epiglottitis',
     'Foreign body aspiration',
     'Croup (laryngotracheobronchitis)',
     'Bacterial tracheitis',
     'Asthma',
     'C',
     'Croup is characterized by barking cough, inspiratory stridor, and hoarseness, typically in children 6 months to 3 years. It follows an upper respiratory infection and is usually caused by parainfluenza virus. Symptoms worsen at night. Epiglottitis presents with drooling, difficulty swallowing, and toxic appearance (rare since Hib vaccine).',
     'STEP_1', 'Pediatrics', 'Croup',
     '{"source": "Nelson Textbook of Pediatrics"}', 0, 0, true),

    -- STEP_2_CK Questions (Clinical Knowledge)
    (org_uuid, 'A 60-year-old diabetic patient presents with a foot ulcer. Physical exam reveals absence of sensation to 10g monofilament. What is the most appropriate initial management?',
     'Patient has had diabetes for 15 years with poor glycemic control. Ulcer is on the plantar surface of the first metatarsal head.',
     'Immediate surgical debridement',
     'Oral antibiotics only',
     'Offloading with total contact cast',
     'Hyperbaric oxygen therapy',
     'Amputation',
     'C',
     'The patient has diabetic neuropathy (loss of protective sensation) and a plantar ulcer. Offloading with a total contact cast is the gold standard initial treatment to remove pressure from the ulcer and promote healing. The absence of sensation indicates neuropathic ulcer; continued pressure prevents healing. Antibiotics are only needed if infected. Debridement and other interventions may be needed but offloading is the priority.',
     'STEP_2_CK', 'Endocrinology', 'Diabetic Foot Care',
     '{"source": "ADA Clinical Practice Guidelines", "year": 2024}', 0, 0, true),

    (org_uuid, 'A 25-year-old pregnant woman at 28 weeks gestation presents with headache, visual changes, and blood pressure 160/110 mmHg. Urinalysis shows 3+ protein. What is the most likely diagnosis?',
     'Patient has no history of hypertension. Mild edema of hands and face.',
     'Gestational hypertension',
     'Chronic hypertension',
     'Preeclampsia',
     'Eclampsia',
     'HELLP syndrome',
     'C',
     'Preeclampsia is diagnosed by new-onset hypertension (≥140/90) after 20 weeks gestation with proteinuria or end-organ dysfunction (headache, visual changes). This patient has all criteria: HTN, proteinuria, and CNS symptoms. Eclampsia requires seizures. HELLP requires specific lab findings (hemolysis, elevated liver enzymes, low platelets).',
     'STEP_2_CK', 'Obstetrics', 'Preeclampsia',
     '{"source": "ACOG Practice Bulletins"}', 0, 0, true),

    (org_uuid, 'A 68-year-old woman with atrial fibrillation presents with sudden onset left leg weakness and difficulty speaking. Symptoms started 1 hour ago. What is the most appropriate immediate management?',
     'Patient is on aspirin but not anticoagulated. NIHSS score is 8.',
     'Aspirin 325mg',
     'Start heparin',
     'Non-contrast CT head, then consider IV tPA',
     'MRI brain with diffusion',
     'Emergent carotid endarterectomy',
     'C',
     'This is an acute ischemic stroke in the therapeutic window (<4.5 hours). Non-contrast CT is performed first to exclude hemorrhage. If no hemorrhage and patient meets criteria, IV tPA (thrombolysis) should be given. Time is brain - every minute counts. Aspirin should not be given acutely if considering thrombolysis.',
     'STEP_2_CK', 'Neurology', 'Acute Ischemic Stroke',
     '{"source": "AHA/ASA Stroke Guidelines"}', 0, 0, true),

    -- STEP_3 Questions (Advanced/Critical Care)
    (org_uuid, 'A 28-year-old man presents to the emergency department with severe chest pain radiating to his back. Blood pressure is 180/110 mmHg in the right arm and 130/80 mmHg in the left arm. What is the most appropriate immediate diagnostic test?',
     'Patient has a history of Marfan syndrome and sudden onset of tearing chest pain.',
     'ECG',
     'Chest X-ray',
     'CT angiography of the chest',
     'Echocardiography',
     'Cardiac catheterization',
     'C',
     'This presentation is highly concerning for aortic dissection: tearing chest pain radiating to back, BP differential between arms (>20 mmHg), and Marfan syndrome (risk factor for dissection). CT angiography is the gold standard for diagnosing aortic dissection. While ECG and CXR may provide clues, CT angiography directly visualizes the dissection and is the most appropriate immediate test.',
     'STEP_3', 'Cardiology', 'Aortic Dissection',
     '{"source": "UpToDate", "topic": "Acute Aortic Dissection"}', 0, 0, true),

    (org_uuid, 'A newborn presents with cyanosis that does not improve with oxygen administration. An echocardiogram shows complete transposition of the great arteries. What is the most appropriate immediate intervention?',
     'The infant is 2 hours old with oxygen saturation of 70% despite 100% oxygen.',
     'Beta blockers',
     'Prostaglandin E1 infusion',
     'Diuretics',
     'ACE inhibitors',
     'Immediate surgical correction',
     'B',
     'Transposition of the great arteries (TGA) is a cyanotic congenital heart defect where the aorta arises from the RV and pulmonary artery from the LV. The infant is cyanotic because oxygenated and deoxygenated blood flow in parallel circuits. Prostaglandin E1 keeps the ductus arteriosus open, allowing mixing of blood between the two circuits until definitive surgical repair (arterial switch) can be performed. This is a critical intervention.',
     'STEP_3', 'Pediatrics', 'Congenital Heart Disease',
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
     'STEP_3', 'Neurology', 'Subarachnoid Hemorrhage',
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
     'STEP_3', 'Nephrology', 'Hyperkalemia',
     '{"source": "UpToDate", "topic": "Treatment of Hyperkalemia"}', 0, 0, true);

END $$;

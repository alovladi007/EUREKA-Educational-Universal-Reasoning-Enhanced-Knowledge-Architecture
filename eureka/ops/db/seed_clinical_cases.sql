-- Seed Clinical Cases for Medical School
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

    -- Insert Clinical Cases with correct column mapping
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
     ARRAY['Recognize STEMI presentation and ECG findings', 'Understand time-critical nature of reperfusion therapy', 'Identify cardiovascular risk factors in young patients', 'Implement appropriate pharmacotherapy for ACS'],
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
     ARRAY['Diagnose DKA based on triad of hyperglycemia, acidosis, and ketosis', 'Understand fluid and electrolyte management in DKA', 'Recognize complications including cerebral edema', 'Implement appropriate insulin therapy protocol'],
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
     ARRAY['Apply CAP severity assessment tools (CURB-65, PSI)', 'Select appropriate empiric antibiotic regimen', 'Recognize aspiration risk in elderly patients', 'Understand goals of care discussions'],
     true),

    (org_uuid, 'Acute Appendicitis with Perforation',
     'A 19-year-old college student presents with 24 hours of worsening abdominal pain.',
     'Surgery', 'intermediate',
     19, 'male', 'Abdominal pain',
     'Pain started periumbilical, now localized to RLQ. Initially crampy, now constant and sharp. Anorexia, nausea, one episode of vomiting. Unable to attend classes. Pain worse with movement.',
     '{"vitals": {"BP": "118/72", "HR": "102", "RR": "18", "T": "38.9°C"}, "general": "appears uncomfortable, lies still", "abdomen": "McBurney point tenderness, rebound, guarding, positive psoas and obturator signs", "rectal": "right-sided tenderness"}',
     '{"WBC": "16,800 with left shift", "CRP": "85 mg/L", "HCG": "negative", "UA": "normal", "BMP": "normal"}',
     '{"CT_abdomen_pelvis": "dilated appendix 12mm with periappendiceal fat stranding and small amount of free fluid, concerning for early perforation"}',
     'Acute appendicitis with concern for early perforation',
     '{"immediate": ["NPO", "IV fluids", "IV antibiotics (ceftriaxone + metronidazole)", "Surgical consultation", "Pain control"], "surgical": "Appendectomy (laparoscopic preferred)", "postop": "Continue antibiotics 24-48h if perforated"}',
     ARRAY['Recognize classic appendicitis presentation and physical exam findings', 'Understand imaging modalities for appendicitis', 'Recognize signs of perforation', 'Understand timing and approach to surgical intervention'],
     true),

    (org_uuid, 'Septic Shock from Urinary Source',
     'A 72-year-old diabetic woman presents with altered mental status and hypotension.',
     'Critical Care', 'advanced',
     72, 'female', 'Altered mental status and hypotension',
     'Family reports 2 days of urinary frequency and dysuria. This morning found confused and minimally responsive. PMH: T2DM, HTN, CKD stage 3. Medications: metformin, lisinopril.',
     '{"vitals": {"BP": "78/45", "HR": "128", "RR": "28", "T": "39.8°C", "SpO2": "91% on RA"}, "general": "lethargic, responds to painful stimuli", "skin": "warm, dry, delayed capillary refill", "lungs": "tachypneic, clear", "abdomen": "suprapubic tenderness", "neuro": "GCS 11 (E3V3M5)"}',
     '{"WBC": "24,000 with toxic granulation", "lactate": "4.8 mmol/L", "creatinine": "2.8 (baseline 1.4)", "glucose": "340", "procalcitonin": "8.5", "blood_cultures": "pending", "UA": "WBC >100, bacteria, nitrite positive"}',
     '{"CXR": "no infiltrate", "CT_abdomen": "no hydronephrosis, bladder distension"}',
     'Septic shock secondary to urosepsis, acute kidney injury',
     '{"resuscitation": ["30mL/kg crystalloid bolus (immediately)", "Norepinephrine for MAP ≥65", "Broad-spectrum antibiotics within 1 hour (ceftriaxone + vancomycin)", "Source control - Foley catheter"], "monitoring": ["Central line + arterial line", "Hourly UOP, lactate q2-4h", "ICU admission"], "supportive": ["Mechanical ventilation if needed", "Glycemic control", "DVT prophylaxis"]}',
     ARRAY['Recognize septic shock and apply Surviving Sepsis Campaign guidelines', 'Implement early goal-directed therapy', 'Understand source control principles', 'Manage multiple organ dysfunction'],
     true);

END $$;

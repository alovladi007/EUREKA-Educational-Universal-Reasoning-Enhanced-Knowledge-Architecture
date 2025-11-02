-- Seed OSCE Stations for Medical School
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

    -- Insert OSCE Stations
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
     ARRAY['SPIKES protocol', 'Breaking bad news', 'Patient-centered communication'],
     ARRAY['Empathetic listening', 'Non-verbal communication', 'Handling emotions', 'Clear explanation'],
     'Oncology', 'intermediate', true),

    (org_uuid, 2, 'Cardiovascular Examination',
     'Perform a complete cardiovascular examination on a patient with a murmur.',
     'Examine this patient who has been referred for evaluation of a heart murmur detected during a routine physical exam. The patient is asymptomatic. Perform a complete cardiovascular examination and present your findings.',
     15, 100, 70,
     '{"preparation": {"points": 15, "criteria": "Hand hygiene, introduces self, explains procedure, obtains consent, proper positioning"}, "inspection": {"points": 15, "criteria": "JVP assessment, precordial inspection, peripheral inspection"}, "palpation": {"points": 20, "criteria": "Apex beat location and character, thrills, heaves, parasternal heave"}, "auscultation": {"points": 30, "criteria": "Systematic approach (aortic, pulmonary, tricuspid, mitral), bell and diaphragm, identifies murmur"}, "dynamic_maneuvers": {"points": 10, "criteria": "Appropriate maneuvers (Valsalva, position changes)"}, "presentation": {"points": 10, "criteria": "Clear, organized presentation of findings"}}',
     ARRAY['Cardiovascular examination', 'Cardiac auscultation', 'Physical examination', 'Murmur characterization'],
     ARRAY['Professional manner', 'Patient comfort', 'Systematic approach', 'Clear communication'],
     'Cardiology', 'basic', true),

    (org_uuid, 3, 'Suturing Simple Laceration',
     'Repair a 4cm laceration on a hand model using simple interrupted sutures.',
     'A 30-year-old patient presents to the ED with a 4cm laceration on the dorsum of the hand sustained from a kitchen knife. The wound is clean with no tendon or nerve involvement. Local anesthesia has been administered. Repair the laceration using simple interrupted sutures.',
     15, 100, 70,
     '{"sterile_technique": {"points": 20, "criteria": "Proper hand hygiene, gloving, wound preparation, draping"}, "instrument_handling": {"points": 15, "criteria": "Correct needle holder grip, forceps use"}, "suture_technique": {"points": 35, "criteria": "90-degree needle entry/exit, adequate bite (5mm), appropriate spacing, proper depth"}, "knot_tying": {"points": 20, "criteria": "Square knots, appropriate tension, secure knots"}, "wound_closure": {"points": 10, "criteria": "Good edge approximation, no strangulation, aesthetic result"}}',
     ARRAY['Simple interrupted sutures', 'Sterile technique', 'Wound repair', 'Instrument handling'],
     ARRAY['Patient explanation', 'Procedural efficiency'],
     'Emergency Medicine', 'basic', true),

    (org_uuid, 4, 'Informed Consent for Surgery',
     'Obtain informed consent from a patient for an elective cholecystectomy.',
     'Mr. Smith is a 58-year-old man scheduled for laparoscopic cholecystectomy for symptomatic gallstones. You need to obtain informed consent. He has questions about the procedure and is somewhat anxious.',
     15, 100, 70,
     '{"introduction": {"points": 15, "criteria": "Introduces self, confirms patient identity, establishes rapport"}, "indication": {"points": 15, "criteria": "Explains diagnosis and why surgery is recommended"}, "procedure_explanation": {"points": 20, "criteria": "Describes procedure in lay terms, answers questions clearly"}, "risks_benefits": {"points": 25, "criteria": "Discusses common and serious risks, benefits, alternatives"}, "patient_understanding": {"points": 15, "criteria": "Checks understanding, addresses concerns, allows time for questions"}, "documentation": {"points": 10, "criteria": "Documents consent appropriately, patient signs form"}}',
     ARRAY['Informed consent process', 'Shared decision making', 'Medical ethics'],
     ARRAY['Clear explanation', 'Active listening', 'Empathy', 'Addressing anxiety'],
     'Surgery', 'intermediate', true),

    (org_uuid, 5, 'Pediatric Developmental Assessment',
     'Perform a developmental assessment on an 18-month-old child.',
     'You are seeing an 18-month-old for a well-child visit. The parent has no specific concerns. Perform an age-appropriate developmental screening and counsel the parent on developmental milestones.',
     20, 100, 70,
     '{"gross_motor": {"points": 15, "criteria": "Assesses walking, climbing, balance"}, "fine_motor": {"points": 15, "criteria": "Assesses pincer grasp, scribbling, stacking blocks"}, "language": {"points": 20, "criteria": "Evaluates receptive and expressive language, vocabulary size"}, "social_emotional": {"points": 15, "criteria": "Stranger anxiety, attachment, imitation, pretend play"}, "red_flags": {"points": 20, "criteria": "Screens for autism, hearing/vision concerns, regression"}, "counseling": {"points": 15, "criteria": "Anticipatory guidance on safety, nutrition, development"}}',
     ARRAY['Developmental milestones', 'Pediatric assessment', 'Autism screening', 'Well-child visit'],
     ARRAY['Parent counseling', 'Child engagement', 'Age-appropriate communication'],
     'Pediatrics', 'intermediate', true),

    (org_uuid, 6, 'Difficult Conversation - DNR Discussion',
     'Discuss goals of care and DNR status with a terminally ill patient.',
     'Mr. Garcia is an 82-year-old man with metastatic lung cancer, COPD, and CHF. He was recently hospitalized for pneumonia. You need to discuss goals of care and code status. He is aware of his prognosis but has not previously discussed DNR.',
     20, 100, 70,
     '{"rapport": {"points": 10, "criteria": "Establishes trust, shows compassion, appropriate setting"}, "prognosis": {"points": 15, "criteria": "Sensitively reviews current status and likely trajectory"}, "values_exploration": {"points": 25, "criteria": "Explores patient values, what matters most, quality vs quantity of life"}, "code_status": {"points": 20, "criteria": "Explains CPR realistically, discusses DNR/DNI, allows patient autonomy"}, "support": {"points": 15, "criteria": "Offers palliative care, hospice, assures continued care"}, "documentation": {"points": 15, "criteria": "Documents discussion, confirms understanding, involves family if desired"}}',
     ARRAY['Goals of care discussion', 'End-of-life care', 'DNR counseling', 'Palliative care'],
     ARRAY['Difficult conversations', 'Empathy', 'Active listening', 'Respecting autonomy'],
     'Palliative Care', 'advanced', true);

END $$;

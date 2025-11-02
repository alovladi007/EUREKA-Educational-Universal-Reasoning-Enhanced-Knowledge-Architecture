-- Add real medical codes (ICD-10, LOINC, CPT, NDC, RxNorm) to all clinical cases
-- This updates existing clinical cases with comprehensive medical coding standards

-- ==================== AMI CASE ====================
UPDATE clinical_cases SET
  icd_10_code = 'I21.09',
  differential_diagnoses = '[
    {"diagnosis": "Acute inferior STEMI", "icd10": "I21.09", "likelihood": "high", "reasoning": "ST elevation in inferior leads, elevated troponin, risk factors"},
    {"diagnosis": "Unstable angina", "icd10": "I20.0", "likelihood": "medium", "reasoning": "Chest pain pattern, but ST elevation makes STEMI more likely"},
    {"diagnosis": "Aortic dissection", "icd10": "I71.00", "likelihood": "low", "reasoning": "Chest pain, but no radiation to back, equal BP in both arms"},
    {"diagnosis": "Pulmonary embolism", "icd10": "I26.99", "likelihood": "low", "reasoning": "Chest pain and SOB, but ECG shows STEMI pattern"}
  ]'::jsonb,
  lab_results = '{
    "troponin_I": {
      "value": "2.5 ng/mL",
      "status": "critically elevated",
      "loinc": "10839-9",
      "reference_range": "<0.04 ng/mL",
      "interpretation": "Consistent with acute MI"
    },
    "CK_MB": {
      "value": "58 ng/mL",
      "status": "elevated",
      "loinc": "13969-1",
      "reference_range": "<5 ng/mL"
    },
    "CBC": {
      "WBC": {"value": "12000", "loinc": "6690-2", "units": "/uL"},
      "hemoglobin": {"value": "14.2", "loinc": "718-7", "units": "g/dL"},
      "platelets": {"value": "245000", "loinc": "777-3", "units": "/uL"}
    },
    "BMP": {
      "sodium": {"value": "138", "loinc": "2951-2", "units": "mEq/L"},
      "potassium": {"value": "4.1", "loinc": "2823-3", "units": "mEq/L"},
      "creatinine": {"value": "1.0", "loinc": "2160-0", "units": "mg/dL"},
      "glucose": {"value": "145", "loinc": "2345-7", "units": "mg/dL"}
    },
    "lipid_panel": {
      "total_cholesterol": {"value": "280", "loinc": "2093-3", "units": "mg/dL", "status": "high"},
      "LDL": {"value": "180", "loinc": "18262-6", "units": "mg/dL", "status": "very high"},
      "HDL": {"value": "32", "loinc": "2085-9", "units": "mg/dL", "status": "low"},
      "triglycerides": {"value": "300", "loinc": "2571-8", "units": "mg/dL", "status": "high"}
    }
  }'::jsonb,
  imaging_studies = '{
    "ECG": {
      "findings": "ST elevation in leads II, III, aVF (2-3mm) - inferior STEMI pattern. Reciprocal ST depression in I, aVL",
      "interpretation": "Acute inferior wall STEMI",
      "cpt": "93000"
    },
    "CXR": {
      "findings": "Normal cardiac silhouette, no pulmonary edema, clear lung fields",
      "cpt": "71046"
    },
    "cardiac_catheterization": {
      "findings": "100% occlusion of proximal RCA, successful PCI with drug-eluting stent",
      "cpt": "93458"
    }
  }'::jsonb,
  treatment_plan = '{
    "immediate_STEMI_protocol": [
      {
        "medication": "Aspirin",
        "dose": "325mg",
        "route": "PO chewed",
        "ndc": "63739-434-01",
        "rxnorm": "1191",
        "timing": "immediately"
      },
      {
        "medication": "Clopidogrel",
        "dose": "600mg loading dose",
        "route": "PO",
        "ndc": "00781-5151-31",
        "rxnorm": "32968",
        "timing": "immediately"
      },
      {
        "medication": "Heparin",
        "dose": "60 units/kg bolus (max 4000 units)",
        "route": "IV",
        "ndc": "63323-540-01",
        "rxnorm": "5224",
        "timing": "immediately"
      },
      {
        "medication": "Nitroglycerin",
        "dose": "0.4mg sublingual q5min x3 PRN",
        "ndc": "00071-0434-24",
        "rxnorm": "7512",
        "indication": "chest pain relief"
      },
      {
        "procedure": "Primary PCI with drug-eluting stent",
        "cpt": "92928",
        "description": "Percutaneous transcatheter placement of intracoronary stent(s)",
        "timing": "door-to-balloon <90 minutes",
        "vessel": "RCA"
      }
    ],
    "long_term_secondary_prevention": [
      {
        "medication": "Atorvastatin",
        "dose": "80mg daily",
        "route": "PO",
        "ndc": "00071-0155-23",
        "rxnorm": "83367",
        "indication": "high-intensity statin therapy"
      },
      {
        "medication": "Metoprolol",
        "dose": "25mg BID, titrate to HR 50-60",
        "ndc": "00378-0407-01",
        "rxnorm": "6918",
        "indication": "beta blocker post-MI"
      },
      {
        "medication": "Lisinopril",
        "dose": "5mg daily, titrate up",
        "ndc": "00093-1042-01",
        "rxnorm": "29046",
        "indication": "ACE inhibitor for LV remodeling"
      },
      {
        "medication": "Aspirin",
        "dose": "81mg daily",
        "ndc": "63739-431-01",
        "rxnorm": "1191",
        "duration": "lifelong"
      },
      {
        "medication": "Clopidogrel",
        "dose": "75mg daily",
        "ndc": "00781-5151-13",
        "rxnorm": "32968",
        "duration": "12 months minimum (DAPT)"
      }
    ],
    "procedures_and_counseling": [
      {
        "service": "Cardiac rehabilitation referral",
        "cpt": "93797",
        "description": "Phase II cardiac rehab, 36 sessions"
      },
      {
        "service": "Smoking cessation counseling",
        "cpt": "99406",
        "description": "Intensive behavioral therapy, >10 minutes"
      },
      {
        "service": "Nutritionist referral",
        "description": "Mediterranean diet, low saturated fat"
      }
    ]
  }'::jsonb
WHERE title = 'Acute Myocardial Infarction in Young Adult';

-- ==================== DKA CASE ====================
UPDATE clinical_cases SET
  icd_10_code = 'E10.10',
  differential_diagnoses = '[
    {"diagnosis": "Diabetic ketoacidosis", "icd10": "E10.10", "likelihood": "high", "reasoning": "Hyperglycemia, acidosis, ketosis, T1DM history"},
    {"diagnosis": "Hyperosmolar hyperglycemic state", "icd10": "E11.01", "likelihood": "low", "reasoning": "High glucose but significant ketosis makes DKA more likely"},
    {"diagnosis": "Lactic acidosis", "icd10": "E87.2", "likelihood": "medium", "reasoning": "Acidosis present, but ketones very elevated"},
    {"diagnosis": "Sepsis with metabolic acidosis", "icd10": "A41.9", "likelihood": "low", "reasoning": "No fever, no infectious source identified"}
  ]'::jsonb,
  lab_results = '{
    "point_of_care": {
      "glucose": {
        "value": "520",
        "loinc": "2345-7",
        "units": "mg/dL",
        "critical_value": true
      }
    },
    "arterial_blood_gas": {
      "pH": {"value": "7.15", "loinc": "2744-1", "status": "critically low"},
      "pCO2": {"value": "28", "loinc": "2019-8", "units": "mmHg", "interpretation": "respiratory compensation"},
      "pO2": {"value": "95", "loinc": "2703-7", "units": "mmHg"},
      "bicarbonate": {"value": "8", "loinc": "1963-8", "units": "mEq/L", "status": "critically low"}
    },
    "chemistry": {
      "anion_gap": {"value": "28", "calculated": true, "status": "elevated"},
      "sodium": {"value": "128", "loinc": "2951-2", "units": "mEq/L", "corrected": "134 (corrected for glucose)"},
      "potassium": {"value": "5.8", "loinc": "2823-3", "units": "mEq/L"},
      "chloride": {"value": "92", "loinc": "2075-0", "units": "mEq/L"},
      "BUN": {"value": "35", "loinc": "3094-0", "units": "mg/dL"},
      "creatinine": {"value": "1.4", "loinc": "2160-0", "units": "mg/dL"}
    },
    "ketones": {
      "beta_hydroxybutyrate": {
        "value": "6.2",
        "loinc": "1989-3",
        "units": "mmol/L",
        "status": "critically elevated",
        "interpretation": "Severe ketosis"
      },
      "serum_ketones": {"value": "large", "loinc": "2514-8", "qualitative": "4+"}
    },
    "urine": {
      "glucose": {"loinc": "2350-7", "value": "4+"},
      "ketones": {"loinc": "2514-8", "value": "4+"},
      "specific_gravity": {"loinc": "5811-5", "value": "1.030"}
    }
  }'::jsonb,
  treatment_plan = '{
    "immediate_resuscitation": [
      {
        "fluid": "0.9% Normal Saline",
        "rate": "1-2L bolus over 1 hour, then 250-500 mL/hr",
        "ndc": "00338-0048-04",
        "goal": "Restore intravascular volume, tissue perfusion"
      },
      {
        "medication": "Regular Insulin",
        "dose": "0.1 units/kg/hr continuous IV infusion",
        "ndc": "00002-8215-01",
        "rxnorm": "5856",
        "goal": "Decrease glucose by 50-75 mg/dL/hr",
        "precaution": "Do NOT give bolus if K+ <3.3"
      }
    ],
    "hourly_monitoring": {
      "glucose": {
        "test": "Point-of-care glucose",
        "frequency": "every 1 hour",
        "loinc": "2345-7"
      },
      "electrolytes": {
        "test": "BMP",
        "frequency": "every 2-4 hours",
        "critical_values": ["potassium", "bicarbonate", "anion_gap"]
      },
      "vitals": {
        "frequency": "every 1 hour",
        "parameters": ["BP", "HR", "RR", "mental status"]
      }
    },
    "glucose_management": [
      {
        "trigger": "When glucose <250 mg/dL",
        "action": "Add D5W to IV fluids",
        "fluid": "D5 1/2 NS at 150-250 mL/hr",
        "ndc": "00338-0117-04",
        "rationale": "Continue insulin to clear ketones while preventing hypoglycemia"
      }
    ],
    "potassium_replacement": [
      {
        "condition": "If K+ <5.3 mEq/L and adequate urine output",
        "medication": "Potassium chloride",
        "dose": "20-30 mEq/L in IV fluids",
        "ndc": "00409-6653-02",
        "rxnorm": "8591",
        "goal": "Maintain K+ 4-5 mEq/L",
        "rationale": "Insulin drives K+ intracellularly, risk of life-threatening hypokalemia"
      }
    ],
    "transition_to_subcutaneous": [
      {
        "criteria": "Anion gap <12, HCO3 >15, pH >7.3, able to eat",
        "medication": "Insulin glargine",
        "dose": "0.2-0.3 units/kg subcutaneous",
        "ndc": "00088-2220-33",
        "rxnorm": "274783",
        "timing": "Give 2 hours before stopping IV insulin"
      },
      {
        "medication": "Insulin lispro",
        "dose": "Sliding scale with meals",
        "ndc": "00002-7510-01",
        "rxnorm": "51428"
      }
    ],
    "monitoring_complications": [
      "Cerebral edema (especially in children - headache, altered mental status)",
      "Hypokalemia",
      "Hypoglycemia",
      "Hypophosphatemia"
    ]
  }'::jsonb
WHERE title = 'Diabetic Ketoacidosis Management';

-- ==================== CAP CASE ====================
UPDATE clinical_cases SET
  icd_10_code = 'J18.9',
  differential_diagnoses = '[
    {"diagnosis": "Community-acquired pneumonia", "icd10": "J18.9", "likelihood": "high", "reasoning": "Fever, productive cough, infiltrate on CXR, elevated WBC"},
    {"diagnosis": "Aspiration pneumonia", "icd10": "J69.0", "likelihood": "high", "reasoning": "Nursing home resident, dementia, RLL location typical for aspiration"},
    {"diagnosis": "CHF exacerbation", "icd10": "I50.9", "likelihood": "medium", "reasoning": "History of CHF, but no JVD or peripheral edema"},
    {"diagnosis": "Pulmonary embolism", "icd10": "I26.99", "likelihood": "low", "reasoning": "Hypoxia and tachycardia, but infiltrate on CXR more consistent with pneumonia"}
  ]'::jsonb,
  lab_results = '{
    "CBC": {
      "WBC": {"value": "18500", "loinc": "6690-2", "units": "/uL", "differential": "82% neutrophils, 15% bands"},
      "hemoglobin": {"value": "11.2", "loinc": "718-7", "units": "g/dL"},
      "platelets": {"value": "425000", "loinc": "777-3", "units": "/uL"}
    },
    "inflammatory_markers": {
      "procalcitonin": {"value": "2.5", "loinc": "33959-8", "units": "ng/mL", "interpretation": "Suggests bacterial infection"},
      "CRP": {"value": "125", "loinc": "1988-5", "units": "mg/L", "status": "markedly elevated"},
      "lactate": {"value": "2.8", "loinc": "2524-7", "units": "mmol/L"}
    },
    "chemistry": {
      "BUN": {"value": "42", "loinc": "3094-0", "units": "mg/dL"},
      "creatinine": {"value": "1.8", "loinc": "2160-0", "units": "mg/dL", "baseline": "1.2"},
      "sodium": {"value": "131", "loinc": "2951-2", "units": "mEq/L"}
    },
    "blood_cultures": {
      "status": "pending",
      "loinc": "600-7",
      "bottles": "2 sets (4 bottles) drawn"
    },
    "sputum_culture": {
      "gram_stain": "Many WBCs, gram-positive diplococci",
      "loinc": "664-3",
      "status": "preliminary: Streptococcus pneumoniae suspected"
    }
  }'::jsonb,
  imaging_studies = '{
    "CXR": {
      "findings": "Right lower lobe infiltrate with air bronchograms, silhouette sign obscuring right hemidiaphragm",
      "interpretation": "RLL pneumonia",
      "cpt": "71046"
    },
    "CT_chest": {
      "findings": "Dense consolidation in RLL with air bronchograms, small parapneumonic effusion, no empyema",
      "cpt": "71260"
    }
  }'::jsonb,
  treatment_plan = '{
    "severity_assessment": {
      "CURB65_score": 4,
      "components": {
        "Confusion": "present (oriented to self only)",
        "Urea": ">19 mg/dL (BUN 42)",
        "Respiratory_rate": "≥30 (RR 26)",
        "Blood_pressure": "systolic <90 (BP 105/65)",
        "Age": "≥65 (age 78)"
      },
      "interpretation": "High risk, mortality 15-40%, hospital admission indicated"
    },
    "admission": {
      "level_of_care": "Medical floor with telemetry",
      "cpt": "99223",
      "description": "Initial hospital care, high complexity"
    },
    "antibiotic_therapy": [
      {
        "medication": "Ceftriaxone",
        "dose": "1g IV daily",
        "ndc": "00409-7330-01",
        "rxnorm": "309054",
        "coverage": "Streptococcus pneumoniae, Haemophilus influenzae"
      },
      {
        "medication": "Azithromycin",
        "dose": "500mg IV daily",
        "ndc": "00069-3150-50",
        "rxnorm": "18631",
        "coverage": "Atypicals (Mycoplasma, Legionella, Chlamydia)"
      },
      {
        "alternative": "Levofloxacin 750mg IV daily",
        "ndc": "50458-0291-01",
        "rxnorm": "82122",
        "indication": "Respiratory fluoroquinolone monotherapy option"
      }
    ],
    "supportive_care": [
      {
        "intervention": "Supplemental oxygen",
        "target": "SpO2 >90%",
        "current": "3L nasal cannula"
      },
      {
        "fluid": "IV Normal Saline",
        "rate": "75-100 mL/hr",
        "ndc": "00338-0048-04",
        "indication": "Volume resuscitation for prerenal AKI"
      },
      {
        "intervention": "Aspiration precautions",
        "measures": ["NPO until swallow evaluation", "Head of bed >30 degrees", "Speech therapy consult"],
        "cpt": "92610"
      }
    ],
    "monitoring": [
      "Vital signs q4h",
      "Daily CXR until improvement",
      "Repeat lactate in 6 hours",
      "Monitor renal function",
      "Follow blood and sputum culture results"
    ],
    "advance_care_planning": {
      "discussion": "Goals of care conversation with family given age, comorbidities, and severe pneumonia",
      "cpt": "99497",
      "description": "Advance care planning, first 30 minutes"
    }
  }'::jsonb
WHERE title = 'Community-Acquired Pneumonia in Elderly';

-- ==================== APPENDICITIS CASE ====================
UPDATE clinical_cases SET
  icd_10_code = 'K35.80',
  differential_diagnoses = '[
    {"diagnosis": "Acute appendicitis with perforation", "icd10": "K35.80", "likelihood": "high", "reasoning": "Classic presentation, RLQ tenderness, imaging shows dilated appendix with periappendiceal changes"},
    {"diagnosis": "Mesenteric lymphadenitis", "icd10": "I88.0", "likelihood": "low", "reasoning": "Can mimic appendicitis but less likely with classic exam findings"},
    {"diagnosis": "Crohn disease", "icd10": "K50.0", "likelihood": "low", "reasoning": "Can present with RLQ pain but acute onset less typical"},
    {"diagnosis": "Testicular torsion", "icd10": "N44.00", "likelihood": "low", "reasoning": "Can cause RLQ pain but exam should show testicular abnormality"}
  ]'::jsonb,
  lab_results = '{
    "CBC": {
      "WBC": {"value": "16800", "loinc": "6690-2", "units": "/uL", "differential": "Left shift with 12% bands"},
      "hemoglobin": {"value": "14.5", "loinc": "718-7", "units": "g/dL"},
      "platelets": {"value": "298000", "loinc": "777-3", "units": "/uL"}
    },
    "inflammatory_markers": {
      "CRP": {"value": "85", "loinc": "1988-5", "units": "mg/L", "status": "elevated"}
    },
    "pregnancy_test": {
      "HCG_qualitative": {"value": "negative", "loinc": "2118-8", "note": "Always check in reproductive-age patients"}
    },
    "urinalysis": {
      "appearance": "clear, yellow",
      "specific_gravity": {"value": "1.015", "loinc": "5811-5"},
      "pH": {"value": "6.0", "loinc": "5803-2"},
      "WBC": {"value": "0-2", "loinc": "5821-4", "interpretation": "negative"},
      "RBC": {"value": "0-1", "loinc": "5794-3"},
      "bacteria": "none",
      "interpretation": "Normal - rules out UTI"
    },
    "BMP": {
      "sodium": {"value": "138", "loinc": "2951-2"},
      "potassium": {"value": "3.9", "loinc": "2823-3"},
      "creatinine": {"value": "0.9", "loinc": "2160-0"},
      "glucose": {"value": "102", "loinc": "2345-7"}
    }
  }'::jsonb,
  imaging_studies = '{
    "CT_abdomen_pelvis": {
      "findings": "Dilated appendix measuring 12mm (normal <6mm), appendiceal wall thickening, periappendiceal fat stranding, small amount of free fluid in RLQ, concerning for early/contained perforation",
      "cpt": "74177",
      "contrast": "IV contrast administered",
      "interpretation": "Acute appendicitis with signs concerning for early perforation"
    },
    "ultrasound_alternative": {
      "note": "US can be first-line in children/pregnant patients",
      "cpt": "76705",
      "findings": "Not performed - CT preferred in this case"
    }
  }'::jsonb,
  treatment_plan = '{
    "immediate_management": [
      {
        "order": "NPO",
        "rationale": "Preparation for surgery"
      },
      {
        "fluid": "Lactated Ringers",
        "rate": "125 mL/hr",
        "ndc": "00338-0113-04",
        "indication": "IV hydration, electrolyte repletion"
      },
      {
        "medication": "Ondansetron",
        "dose": "4mg IV",
        "ndc": "00781-3086-92",
        "rxnorm": "72866",
        "indication": "Antiemetic"
      },
      {
        "medication": "Morphine",
        "dose": "4-8mg IV q4h PRN",
        "ndc": "00409-1234-01",
        "rxnorm": "7052",
        "indication": "Pain control",
        "note": "Pain control does NOT mask peritoneal signs"
      }
    ],
    "antibiotic_prophylaxis": [
      {
        "medication": "Ceftriaxone",
        "dose": "2g IV",
        "ndc": "00409-7330-11",
        "rxnorm": "309054",
        "timing": "Within 1 hour of incision"
      },
      {
        "medication": "Metronidazole",
        "dose": "500mg IV",
        "ndc": "00409-3688-02",
        "rxnorm": "6922",
        "coverage": "Anaerobic coverage for GI flora"
      }
    ],
    "surgical_intervention": {
      "procedure": "Laparoscopic appendectomy",
      "cpt": "44970",
      "timing": "Urgent - within 12-24 hours",
      "approach": "Laparoscopic preferred (vs open 44950)",
      "benefits": "Faster recovery, less pain, better cosmesis, lower infection rate",
      "conversion_to_open": {
        "indications": "Dense adhesions, unclear anatomy, uncontrolled bleeding",
        "cpt": "44950"
      }
    },
    "postoperative_antibiotics": {
      "indication": "Perforated appendicitis",
      "duration": "24-48 hours if perforation confirmed intraoperatively",
      "regimen": [
        {
          "medication": "Ceftriaxone",
          "dose": "2g IV daily",
          "ndc": "00409-7330-11"
        },
        {
          "medication": "Metronidazole",
          "dose": "500mg IV q8h",
          "ndc": "00409-3688-02"
        }
      ]
    },
    "postoperative_care": [
      {
        "diet": "Clear liquids when awake, advance as tolerated"
      },
      {
        "activity": "Ambulate evening of surgery"
      },
      {
        "discharge_criteria": "Tolerating diet, pain controlled on PO meds, afebrile, normal bowel function"
      },
      {
        "typical_LOS": "1-2 days for uncomplicated laparoscopic, 3-5 days if perforated"
      }
    ]
  }'::jsonb
WHERE title = 'Acute Appendicitis with Perforation';

-- ==================== SEPTIC SHOCK CASE ====================
UPDATE clinical_cases SET
  icd_10_code = 'A41.9',
  differential_diagnoses = '[
    {"diagnosis": "Septic shock, urinary source (urosepsis)", "icd10": "A41.9", "likelihood": "high", "reasoning": "SIRS criteria met, hypotension, elevated lactate, positive UA"},
    {"diagnosis": "Acute pyelonephritis", "icd10": "N10", "likelihood": "high", "reasoning": "Likely source of sepsis - UTI symptoms, suprapubic tenderness"},
    {"diagnosis": "Acute kidney injury", "icd10": "N17.9", "likelihood": "high", "reasoning": "Cr 2.8 vs baseline 1.4, secondary to sepsis"},
    {"diagnosis": "Distributive shock", "icd10": "R57.9", "likelihood": "medium", "reasoning": "Warm shock physiology"},
    {"diagnosis": "Diabetic ketoacidosis", "icd10": "E11.10", "likelihood": "low", "reasoning": "Hyperglycemia present but no significant acidosis or ketosis"}
  ]'::jsonb,
  lab_results = '{
    "initial_sepsis_labs": {
      "lactate": {
        "value": "4.8",
        "loinc": "2524-7",
        "units": "mmol/L",
        "critical_value": true,
        "interpretation": "Severe tissue hypoperfusion"
      },
      "procalcitonin": {
        "value": "8.5",
        "loinc": "33959-8",
        "units": "ng/mL",
        "interpretation": "Strongly suggests bacterial sepsis"
      }
    },
    "CBC": {
      "WBC": {"value": "24000", "loinc": "6690-2", "units": "/uL", "note": "Toxic granulation, Döhle bodies"},
      "hemoglobin": {"value": "10.8", "loinc": "718-7", "units": "g/dL"},
      "platelets": {"value": "145000", "loinc": "777-3", "units": "/uL", "trending": "down"}
    },
    "chemistry": {
      "sodium": {"value": "131", "loinc": "2951-2", "units": "mEq/L"},
      "potassium": {"value": "5.2", "loinc": "2823-3", "units": "mEq/L"},
      "chloride": {"value": "98", "loinc": "2075-0", "units": "mEq/L"},
      "bicarbonate": {"value": "18", "loinc": "1963-8", "units": "mEq/L", "note": "Metabolic acidosis"},
      "BUN": {"value": "58", "loinc": "3094-0", "units": "mg/dL"},
      "creatinine": {"value": "2.8", "loinc": "2160-0", "units": "mg/dL", "baseline": "1.4"},
      "glucose": {"value": "340", "loinc": "2345-7", "units": "mg/dL"}
    },
    "coagulation": {
      "PT": {"value": "15.2", "loinc": "5902-2", "units": "seconds"},
      "INR": {"value": "1.4", "loinc": "6301-6"},
      "PTT": {"value": "38", "loinc": "3173-2", "units": "seconds"}
    },
    "blood_cultures": {
      "sets": "2 sets drawn prior to antibiotics",
      "loinc": "600-7",
      "status": "pending",
      "expected": "E. coli (most common urosepsis organism)"
    },
    "urinalysis": {
      "appearance": "cloudy",
      "WBC": {"value": ">100", "loinc": "5821-4", "status": "severe pyuria"},
      "bacteria": {"value": "many", "loinc": "25145-4"},
      "nitrite": {"value": "positive", "loinc": "5802-4", "interpretation": "Gram-negative bacteria"},
      "leukocyte_esterase": {"value": "3+", "loinc": "5799-2"}
    },
    "urine_culture": {
      "status": "pending",
      "loinc": "630-4",
      "expected": ">100,000 CFU/mL E. coli"
    }
  }'::jsonb,
  imaging_studies = '{
    "CXR": {
      "findings": "No infiltrate, normal cardiac silhouette, no pulmonary edema",
      "cpt": "71046",
      "interpretation": "Negative for pulmonary source"
    },
    "CT_abdomen_pelvis": {
      "findings": "No hydronephrosis, no perinephric abscess, bladder distension with wall thickening, no free air",
      "cpt": "74177",
      "interpretation": "Suggests cystitis without upper tract involvement or complication"
    }
  }'::jsonb,
  treatment_plan = '{
    "surviving_sepsis_campaign_bundles": {
      "hour_1_bundle": [
        {
          "measure": "Measure lactate",
          "completed": true,
          "value": "4.8 mmol/L",
          "loinc": "2524-7"
        },
        {
          "measure": "Obtain blood cultures before antibiotics",
          "completed": true,
          "sets": 2
        },
        {
          "measure": "Administer broad-spectrum antibiotics",
          "target": "within 1 hour of recognition",
          "completed": true,
          "time_to_antibiotics": "45 minutes"
        },
        {
          "measure": "Begin rapid fluid resuscitation",
          "dose": "30 mL/kg crystalloid",
          "volume": "~2100 mL (patient 70kg)",
          "completed": true
        },
        {
          "measure": "Apply vasopressors if hypotensive during/after fluid resuscitation",
          "target": "MAP ≥65 mmHg",
          "completed": true
        }
      ]
    },
    "fluid_resuscitation": {
      "initial_bolus": {
        "fluid": "Lactated Ringers",
        "volume": "30 mL/kg (2100 mL for 70kg patient)",
        "timing": "Rapidly over 30-60 minutes",
        "ndc": "00338-0113-04"
      },
      "reassessment": {
        "after_bolus": "Assess BP, lactate, urine output, clinical exam",
        "additional_fluids": "Guided by dynamic assessment (passive leg raise, pulse pressure variation)"
      }
    },
    "antibiotic_therapy": [
      {
        "medication": "Ceftriaxone",
        "dose": "2g IV",
        "ndc": "00409-7330-11",
        "rxnorm": "309054",
        "coverage": "Gram-negative rods including E. coli",
        "timing": "Within 1 hour"
      },
      {
        "medication": "Vancomycin",
        "dose": "15-20 mg/kg IV (load ~1500mg for 70kg)",
        "ndc": "00409-4065-50",
        "rxnorm": "11124",
        "coverage": "MRSA and gram-positive coverage",
        "note": "May de-escalate based on culture results"
      }
    ],
    "vasopressor_support": {
      "first_line": {
        "medication": "Norepinephrine",
        "dose": "Start 0.05 mcg/kg/min, titrate to MAP ≥65",
        "route": "Central line preferred",
        "ndc": "00409-3375-01",
        "rxnorm": "7512",
        "max_dose": "Typically 0.5-1 mcg/kg/min"
      },
      "second_line_options": [
        {
          "medication": "Vasopressin",
          "dose": "0.03-0.04 units/min",
          "ndc": "42023-159-25",
          "indication": "If norepinephrine >0.25 mcg/kg/min"
        }
      ]
    },
    "source_control": {
      "intervention": "Foley catheter placement",
      "cpt": "51702",
      "rationale": "Drain infected urine, monitor urine output",
      "timing": "Immediate"
    },
    "invasive_monitoring": [
      {
        "procedure": "Arterial line placement",
        "cpt": "36620",
        "indication": "Continuous BP monitoring, frequent ABGs",
        "site": "Radial artery preferred"
      },
      {
        "procedure": "Central venous catheter",
        "cpt": "36556",
        "indication": "Vasopressor administration, CVP monitoring",
        "site": "Internal jugular or subclavian"
      }
    ],
    "ICU_admission": {
      "level_of_care": "Medical ICU",
      "cpt": "99291",
      "description": "Critical care, first 30-74 minutes",
      "additional_time": "99292 per additional 30 minutes"
    },
    "ongoing_management": [
      {
        "monitoring": "Lactate q2-4h until normalized",
        "target": "<2 mmol/L"
      },
      {
        "monitoring": "Urine output hourly",
        "target": "≥0.5 mL/kg/hr"
      },
      {
        "medication": "Insulin infusion protocol",
        "target": "Glucose 140-180 mg/dL",
        "ndc": "00002-8215-01"
      },
      {
        "prophylaxis": "DVT prophylaxis with heparin SQ",
        "dose": "5000 units q8-12h",
        "ndc": "63323-540-05"
      },
      {
        "prophylaxis": "Stress ulcer prophylaxis",
        "medication": "Pantoprazole 40mg IV daily",
        "ndc": "55390-100-10"
      }
    ],
    "de_escalation": {
      "antibiotics": "Narrow based on culture and sensitivities (typically 48-72 hours)",
      "duration": "7-10 days total for urosepsis",
      "vasopressors": "Wean as MAP and lactate improve"
    }
  }'::jsonb
WHERE title = 'Septic Shock from Urinary Source';

-- Update presentation fields with proper arrays
UPDATE clinical_cases SET
  presenting_symptoms = CASE title
    WHEN 'Acute Myocardial Infarction in Young Adult' THEN '["chest pain", "diaphoresis", "nausea", "left arm radiation"]'::jsonb
    WHEN 'Diabetic Ketoacidosis Management' THEN '["altered mental status", "nausea", "vomiting", "increased urination", "Kussmaul breathing"]'::jsonb
    WHEN 'Community-Acquired Pneumonia in Elderly' THEN '["fever", "cough", "confusion", "decreased oral intake"]'::jsonb
    WHEN 'Acute Appendicitis with Perforation' THEN '["abdominal pain", "anorexia", "nausea", "vomiting", "fever"]'::jsonb
    WHEN 'Septic Shock from Urinary Source' THEN '["altered mental status", "hypotension", "urinary frequency", "dysuria", "tachycardia"]'::jsonb
  END,
  vital_signs = CASE title
    WHEN 'Acute Myocardial Infarction in Young Adult' THEN '{"BP": "150/95", "HR": "110", "RR": "22", "SpO2": "96%", "T": "37.0°C"}'::jsonb
    WHEN 'Diabetic Ketoacidosis Management' THEN '{"BP": "95/60", "HR": "125", "RR": "28", "SpO2": "98%", "T": "37.2°C"}'::jsonb
    WHEN 'Community-Acquired Pneumonia in Elderly' THEN '{"BP": "105/65", "HR": "105", "RR": "26", "SpO2": "88%", "T": "39.1°C"}'::jsonb
    WHEN 'Acute Appendicitis with Perforation' THEN '{"BP": "118/72", "HR": "102", "RR": "18", "SpO2": "99%", "T": "38.9°C"}'::jsonb
    WHEN 'Septic Shock from Urinary Source' THEN '{"BP": "78/45", "HR": "128", "RR": "28", "SpO2": "91%", "T": "39.8°C"}'::jsonb
  END
WHERE title IN (
  'Acute Myocardial Infarction in Young Adult',
  'Diabetic Ketoacidosis Management',
  'Community-Acquired Pneumonia in Elderly',
  'Acute Appendicitis with Perforation',
  'Septic Shock from Urinary Source'
);

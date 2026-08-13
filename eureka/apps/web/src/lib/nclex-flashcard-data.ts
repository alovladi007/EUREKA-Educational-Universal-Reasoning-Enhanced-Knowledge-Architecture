/**
 * NCLEX-RN flashcard deck. Retrieval-practice content: pharmacology
 * prototypes, antidotes and therapeutic levels (the heaviest memorization
 * load on the exam), lab reference ranges with action thresholds, isolation
 * and safety anchors, and maternal/pediatric milestones. Original content
 * written against mainstream nursing references — no NCSBN items.
 */

export interface NCLEXFlashcard {
  id: number;
  front: string;
  back: string;
  domain: string;
  domainName: string;
  category: string; // 'drug' | 'antidote' | 'level' | 'lab' | 'safety' | 'maternal' | 'peds' | 'concept'
  topics: string[];
}

export const NCLEX_FLASHCARD_DOMAINS = [
  { id: 'pharm', label: 'Pharm', name: 'Pharmacology', count: 50 },
  { id: 'labs', label: 'Labs', name: 'Lab Values', count: 20 },
  { id: 'safety', label: 'Safety', name: 'Safety & Infection Control', count: 10 },
  { id: 'maternal_peds', label: 'OB/Peds', name: 'Maternal & Pediatric', count: 10 },
];

const d = (
  id: number,
  front: string,
  back: string,
  domain: string,
  domainName: string,
  category: string,
): NCLEXFlashcard => ({ id, front, back, domain, domainName, category, topics: ['NCLEX'] });

export const NCLEX_FLASHCARDS: NCLEXFlashcard[] = [
  // ───────────────────────── PHARMACOLOGY (50) ─────────────────────────
  d(1, 'Antidote: warfarin', 'Vitamin K (phytonadione). Warfarin is monitored by INR — therapeutic 2.0-3.0 for most indications. Teach consistent (not zero) vitamin K intake.', 'pharm', 'Pharmacology', 'antidote'),
  d(2, 'Antidote: heparin', 'Protamine sulfate. Heparin is monitored by aPTT (therapeutic commonly 1.5-2.5 × control). Watch for HIT: platelet drop >50% = stop heparin.', 'pharm', 'Pharmacology', 'antidote'),
  d(3, 'Antidote: opioid overdose', 'Naloxone. Short half-life — respiratory depression can RETURN as it wears off; monitor after reversal and redose as prescribed.', 'pharm', 'Pharmacology', 'antidote'),
  d(4, 'Antidote: benzodiazepine overdose', 'Flumazenil. Caution: can precipitate seizures in chronic benzodiazepine users.', 'pharm', 'Pharmacology', 'antidote'),
  d(5, 'Antidote: acetaminophen overdose', 'Acetylcysteine — most effective within 8-10 hours of ingestion. Maximum daily acetaminophen: 4 g (lower with liver disease or chronic alcohol use).', 'pharm', 'Pharmacology', 'antidote'),
  d(6, 'Antidote: digoxin toxicity', 'Digoxin immune Fab. Toxicity cues: anorexia, nausea, visual halos/yellow-green tint, dysrhythmias. Hypokalemia potentiates toxicity.', 'pharm', 'Pharmacology', 'antidote'),
  d(7, 'Antidote: magnesium sulfate toxicity', 'Calcium gluconate. Toxicity sequence: lost deep tendon reflexes → respiratory depression (<12/min) → cardiac arrest. Monitor urine output (renal excretion).', 'pharm', 'Pharmacology', 'antidote'),
  d(8, 'Antidote: iron overdose', 'Deferoxamine. Iron poisoning is a leading pediatric ingestion emergency — lock supplements away from children.', 'pharm', 'Pharmacology', 'antidote'),
  d(9, 'Therapeutic level: digoxin', '~0.5-2.0 ng/mL. Hold for apical pulse <60/min (adult), check level + potassium before dosing when toxicity suspected.', 'pharm', 'Pharmacology', 'level'),
  d(10, 'Therapeutic level: lithium', '0.6-1.2 mEq/L; toxicity begins ~1.5. Levels rise with sodium depletion and dehydration — teach steady salt and fluid intake.', 'pharm', 'Pharmacology', 'level'),
  d(11, 'Therapeutic level: phenytoin', '10-20 mcg/mL. Toxicity: nystagmus, ataxia, slurred speech. Chronic effect: gingival hyperplasia — teach oral hygiene.', 'pharm', 'Pharmacology', 'level'),
  d(12, 'Therapeutic INR on warfarin', '2.0-3.0 for most indications (some mechanical valves 2.5-3.5). INR ≥ ~4.5-5: hold, notify, expect vitamin K.', 'pharm', 'Pharmacology', 'level'),
  d(13, 'Insulin peaks: rapid / regular / NPH / glargine', 'Rapid (lispro/aspart): onset ~15 min, peak 1-3 h. Regular: peak 2-4 h. NPH: peak ~4-12 h. Glargine/detemir: peakless basal — never mix in a syringe.', 'pharm', 'Pharmacology', 'drug'),
  d(14, 'Mixing regular and NPH insulin', 'Draw CLEAR before CLOUDY (regular first, then NPH). Roll — do not shake — NPH to resuspend.', 'pharm', 'Pharmacology', 'drug'),
  d(15, 'Hypoglycemia treatment (conscious vs not)', 'Conscious: 15 g fast carbohydrate, recheck in 15 min (15-15 rule). Unconscious: IV dextrose 50% or IM glucagon — NEVER oral.', 'pharm', 'Pharmacology', 'drug'),
  d(16, 'Beta blockers (-olol): key cautions', 'Hold parameters for bradycardia/hypotension; mask hypoglycemia warning signs in diabetics; never stop abruptly (rebound tachycardia/ischemia).', 'pharm', 'Pharmacology', 'drug'),
  d(17, 'ACE inhibitors (-pril): three signatures', 'Dry persistent cough (common), angioedema (emergency), hyperkalemia (avoid potassium salt substitutes). ARBs (-sartan): same K⁺ caution, no cough.', 'pharm', 'Pharmacology', 'drug'),
  d(18, 'Nitroglycerin SL protocol', 'One tablet under the tongue; if pain persists 5 min after the first, activate EMS per current guidance; up to 3 doses 5 min apart. Burning/headache expected. Fatal with sildenafil-class drugs.', 'pharm', 'Pharmacology', 'drug'),
  d(19, 'Vancomycin: two watchpoints', 'Rate-dependent flushing reaction (slow infusion to ≥60 min) and nephrotoxicity/ototoxicity — monitor trough levels and creatinine.', 'pharm', 'Pharmacology', 'drug'),
  d(20, 'Aminoglycosides (gentamicin): toxicities', 'Nephrotoxicity + ototoxicity (tinnitus, hearing loss, vertigo). Monitor peaks/troughs and creatinine.', 'pharm', 'Pharmacology', 'drug'),
  d(21, 'Statins: teaching', 'Report unexplained muscle pain (myopathy → rhabdomyolysis); periodic liver enzymes; grapefruit interacts with several statins.', 'pharm', 'Pharmacology', 'drug'),
  d(22, 'Loop diuretics (furosemide): watchpoints', 'Hypokalemia (monitor K⁺, teach K-rich foods), ototoxicity with rapid IV push, orthostatic hypotension. Give early in the day.', 'pharm', 'Pharmacology', 'drug'),
  d(23, 'Spironolactone vs furosemide: potassium', 'Spironolactone is potassium-SPARING (hyperkalemia risk — no salt substitutes); furosemide and thiazides WASTE potassium (hypokalemia risk).', 'pharm', 'Pharmacology', 'drug'),
  d(24, 'Corticosteroids: four teachings', 'Take with food; never stop abruptly (adrenal crisis); watch glucose (hyperglycemia); infection risk with masked signs; long-term bone loss.', 'pharm', 'Pharmacology', 'drug'),
  d(25, 'Levothyroxine: administration', 'Morning, empty stomach, water only, separate from other meds. Overdose = hyperthyroid picture: tachycardia, heat intolerance, insomnia.', 'pharm', 'Pharmacology', 'drug'),
  d(26, 'Metformin: two rules', 'Hold around iodinated contrast per protocol (lactic acidosis risk with renal compromise); take with meals for GI tolerance. Does not itself cause hypoglycemia.', 'pharm', 'Pharmacology', 'drug'),
  d(27, 'SSRIs: onset and risk window', 'Therapeutic effect takes 2-4 weeks; energy may return before mood lifts — a suicide-risk window. Watch for serotonin syndrome when serotonergic drugs combine.', 'pharm', 'Pharmacology', 'drug'),
  d(28, 'Serotonin syndrome: picture', 'Agitation, hyperthermia, diaphoresis, tremor/clonus, tachycardia after serotonergic drugs stack (SSRI + MAOI/tramadol/triptan). Stop the drugs, supportive care.', 'pharm', 'Pharmacology', 'drug'),
  d(29, 'MAOIs: dietary restriction', 'Tyramine (aged cheese, cured/smoked meats, tap beer, fermented foods) → hypertensive crisis: severe headache, hypertension. 2-week washout around other antidepressants.', 'pharm', 'Pharmacology', 'drug'),
  d(30, 'Neuroleptic malignant syndrome vs serotonin syndrome', 'NMS (antipsychotics): lead-pipe RIGIDITY, hyperthermia, autonomic instability — days. Serotonin syndrome: CLONUS/hyperreflexia — hours. Both: stop the drug.', 'pharm', 'Pharmacology', 'drug'),
  d(31, 'Clozapine: signature risk', 'Agranulocytosis — mandatory ANC monitoring; report fever/sore throat immediately. Also seizure and myocarditis risk.', 'pharm', 'Pharmacology', 'drug'),
  d(32, 'Opioids: pre-dose check', 'Respiratory rate and sedation level BEFORE each dose; hold below ~12/min per policy. Sedation precedes respiratory arrest — trust the sedation scale.', 'pharm', 'Pharmacology', 'drug'),
  d(33, 'High-alert medication list', 'Insulin, anticoagulants, opioids, concentrated electrolytes, neuromuscular blockers, chemotherapy. Institutional rule: independent double checks by two nurses.', 'pharm', 'Pharmacology', 'safety'),
  d(34, 'IV potassium: the unbreakable rules', 'NEVER IV push (cardiac arrest). Dilute, infuse by pump (commonly ≤10 mEq/hr on general units), monitor the site — it burns and can blister.', 'pharm', 'Pharmacology', 'safety'),
  d(35, 'Dangerous abbreviations', 'Write UNITS (not U), daily (not QD). Trailing zeros never (5 mg, not 5.0 mg); leading zeros always (0.5 mg, not .5 mg).', 'pharm', 'Pharmacology', 'safety'),
  d(36, 'Allopurinol + which drug = danger', 'Azathioprine/mercaptopurine (blocked metabolism → toxicity). Also teach: push fluids, take after meals, report rash (SJS risk).', 'pharm', 'Pharmacology', 'drug'),
  d(37, 'Phenazopyridine: teaching', 'Urinary analgesic for UTI symptoms: turns urine red-orange (harmless, stains contacts/clothing); it treats pain, not infection — finish the antibiotic.', 'pharm', 'Pharmacology', 'drug'),
  d(38, 'Tetracyclines & fluoroquinolones: absorption', 'Separate from dairy, antacids, calcium/iron (chelation blocks absorption). Tetracycline: not in pregnancy/under 8 (teeth). Fluoroquinolones: tendon rupture warning.', 'pharm', 'Pharmacology', 'drug'),
  d(39, 'Rifampin: teaching', 'Turns body fluids red-orange (harmless; stains soft contacts); reduces oral contraceptive effectiveness — use backup contraception. TB therapy: never stop early.', 'pharm', 'Pharmacology', 'drug'),
  d(40, 'Isoniazid (INH): pairing and risk', 'Give with pyridoxine (vitamin B6) to prevent peripheral neuropathy; hepatotoxicity — no alcohol, report jaundice/dark urine.', 'pharm', 'Pharmacology', 'drug'),
  d(41, 'Oxytocin: stop-the-infusion triggers', 'Tachysystole (>5 contractions/10 min), contractions >2 min long or <1 min apart, or category II/III tracing (e.g., recurrent lates) — stop, left side, fluids, O₂, notify.', 'pharm', 'Pharmacology', 'drug'),
  d(42, 'Magnesium sulfate in OB: monitoring', 'Hourly: DTRs, respirations (≥12), urine output (≥30 mL/hr), LOC. Lost reflexes are the FIRST toxicity sign. Antidote: calcium gluconate at the bedside.', 'pharm', 'Pharmacology', 'drug'),
  d(43, 'RhoGAM (Rho(D) immune globulin): who and when', 'Rh-NEGATIVE mother, Rh-positive (or unknown) exposure: ~28 weeks, within 72 h after birth of an Rh-positive infant, and after any bleeding event/trauma/procedure.', 'pharm', 'Pharmacology', 'maternal'),
  d(44, 'Warfarin vs heparin in pregnancy', 'Warfarin is teratogenic — contraindicated. Heparin/LMWH do not cross the placenta and are the anticoagulants of pregnancy.', 'pharm', 'Pharmacology', 'maternal'),
  d(45, 'Digoxin pediatric/adult hold rule', 'Take apical pulse a FULL minute. Hold: adult <60, child <70 (infant <90-100 per institution) — and notify.', 'pharm', 'Pharmacology', 'drug'),
  d(46, 'Salicylate (aspirin) in children', 'Avoid with viral illness — Reye syndrome (encephalopathy + liver failure). Pediatric fever: acetaminophen or ibuprofen (ibuprofen only >6 months).', 'pharm', 'Pharmacology', 'peds'),
  d(47, 'Vaccines that are LIVE', 'MMR, varicella, rotavirus, live attenuated influenza (nasal). Contraindicated: pregnancy, significant immunosuppression. Egg allergy is NOT a flu-shot contraindication.', 'pharm', 'Pharmacology', 'peds'),
  d(48, 'Anaphylaxis drug sequence', '1) Stop the trigger/infusion. 2) Epinephrine IM anterolateral thigh, repeat q5-15 min. 3) Airway/O₂/fluids. Antihistamines and steroids are ADJUNCTS, never first.', 'pharm', 'Pharmacology', 'drug'),
  d(49, 'Thrombolytics (-teplase): exclusions', 'Active bleeding, recent surgery/trauma, hemorrhagic stroke history, severe uncontrolled hypertension. Given on a strict time window for ischemic stroke/MI.', 'pharm', 'Pharmacology', 'drug'),
  d(50, 'The rights of medication administration', 'Client (2 identifiers), drug, dose, route, time + documentation (after, never before), reason, response, and the client’s right to refuse.', 'pharm', 'Pharmacology', 'safety'),

  // ───────────────────────── LAB VALUES (20) ─────────────────────────
  d(51, 'Potassium: range and panic actions', '3.5-5.0 mEq/L. High: peaked T waves → calcium gluconate (protect heart), insulin+dextrose (shift), remove. Low: flat T/U waves, weakness — replace (never IV push).', 'labs', 'Lab Values', 'lab'),
  d(52, 'Sodium: range and danger zones', '135-145 mEq/L. <120: confusion → seizures — seizure precautions, correct SLOWLY (osmotic demyelination). High: thirst, agitation — slow water replacement.', 'labs', 'Lab Values', 'lab'),
  d(53, 'Calcium: range and signatures', '~9.0-10.5 mg/dL. Low: Trousseau + Chvostek signs, laryngospasm risk (think post-thyroidectomy) — calcium gluconate. High: weakness, constipation, stones — hydrate, mobilize.', 'labs', 'Lab Values', 'lab'),
  d(54, 'Magnesium: range and quirk', '1.5-2.5 mEq/L. Low mirrors low calcium (tremor, hyperreflexia, torsades) — and potassium will NOT correct until magnesium is repleted. High: lost DTRs → calcium gluconate.', 'labs', 'Lab Values', 'lab'),
  d(55, 'Glucose: fasting range and diabetes cutoffs', 'Fasting 70-99 mg/dL. Diabetes: fasting ≥126, or A1c ≥6.5%. Treated A1c goal for most: <7%. Hypoglycemia symptomatic <70.', 'labs', 'Lab Values', 'lab'),
  d(56, 'BUN and creatinine', 'BUN 10-20 mg/dL; creatinine ~0.6-1.2 mg/dL. Creatinine = the kidney number. BUN alone rises with dehydration and GI bleed.', 'labs', 'Lab Values', 'lab'),
  d(57, 'Hemoglobin & hematocrit', 'Hgb ~12-16 g/dL (women), 14-18 (men); Hct ≈ 3 × Hgb. Transfusion conversations typically begin below Hgb 7-8 in stable clients.', 'labs', 'Lab Values', 'lab'),
  d(58, 'Platelets: range and action thresholds', '150,000-400,000/mm³. <50k: bleeding precautions (soft brush, electric razor, no IMs). <20k: spontaneous bleeding risk — notify, expect transfusion.', 'labs', 'Lab Values', 'lab'),
  d(59, 'WBC and ANC', 'WBC 5,000-10,000/mm³. ANC <1,000 = neutropenic precautions; <500 = severe. ANY fever ≥38.3 °C in neutropenia = cultures + antibiotics within the hour.', 'labs', 'Lab Values', 'lab'),
  d(60, 'aPTT and INR: which drug, which range', 'aPTT → heparin (therapeutic ~1.5-2.5 × control). INR → warfarin (2-3). Swapping these two is the exam’s favorite coagulation trap.', 'labs', 'Lab Values', 'lab'),
  d(61, 'ABG normals', 'pH 7.35-7.45; PaCO₂ 35-45 mm Hg; HCO₃⁻ 22-26 mEq/L; PaO₂ 80-100 mm Hg. ROME: Respiratory Opposite, Metabolic Equal.', 'labs', 'Lab Values', 'lab'),
  d(62, 'ABG: respiratory acidosis picture', 'pH <7.35 with CO₂ >45 — hypoventilation: COPD, oversedation, fatigue. Fix the breathing (position, stimulate, reverse opioids, support ventilation).', 'labs', 'Lab Values', 'lab'),
  d(63, 'ABG: metabolic acidosis picture', 'pH <7.35 with HCO₃ <22 — DKA, renal failure, lactic acidosis, diarrhea. Expect Kussmaul respirations (compensation, not a second problem).', 'labs', 'Lab Values', 'lab'),
  d(64, 'Troponin vs BNP', 'Troponin: cardiac muscle injury (MI) — rises in hours, stays days. BNP: ventricular stretch — heart failure severity marker.', 'labs', 'Lab Values', 'lab'),
  d(65, 'Digoxin/lithium/phenytoin levels in one line', 'Digoxin ~0.5-2.0 ng/mL (watch K⁺); lithium 0.6-1.2 mEq/L (watch Na⁺/hydration); phenytoin 10-20 mcg/mL (watch albumin).', 'labs', 'Lab Values', 'lab'),
  d(66, 'Albumin and prealbumin', 'Albumin 3.5-5.0 g/dL (long-term nutrition marker); prealbumin ~15-36 mg/dL (short-term, tracks recent intake). Low albumin → edema, drug-level effects.', 'labs', 'Lab Values', 'lab'),
  d(67, 'Liver panel logic', 'AST/ALT = hepatocyte injury; bilirubin = jaundice threshold ~2-3 mg/dL; ammonia rises in hepatic encephalopathy (lactulose lowers it — titrated to 2-3 soft stools/day).', 'labs', 'Lab Values', 'lab'),
  d(68, 'Urine specific gravity', '~1.005-1.030. High = concentrated (dehydration, SIADH); low = dilute (overhydration, diabetes insipidus). Pairs with serum sodium for the water-balance picture.', 'labs', 'Lab Values', 'lab'),
  d(69, 'HbA1c: what it measures', 'Average glycemia over ~2-3 months (RBC lifespan). Not fooled by yesterday’s diet — the honesty check of diabetes management.', 'labs', 'Lab Values', 'lab'),
  d(70, 'D-dimer: how to use it', 'Negative RULES OUT thromboembolism in low-risk clients; positive proves nothing specific (rises with clot, surgery, infection, pregnancy). Confirmation is imaging.', 'labs', 'Lab Values', 'lab'),

  // ─────────────────── SAFETY & INFECTION CONTROL (10) ───────────────────
  d(71, 'Airborne precautions: diseases + PPE', 'Measles, TB, Varicella ("MTV"). Negative-pressure room, door closed, N95 on staff. Client wears a SURGICAL mask for transport.', 'safety', 'Safety & Infection Control', 'safety'),
  d(72, 'Droplet precautions: diseases + PPE', 'Influenza, pertussis, mumps, rubella, meningococcal disease, mycoplasma. Surgical mask within 3 feet/room entry. Meningococcus: precautions end after 24 h of antibiotics.', 'safety', 'Safety & Infection Control', 'safety'),
  d(73, 'Contact precautions: diseases + PPE', 'MRSA, VRE, C. difficile, scabies, RSV, uncontained wounds. Gown + gloves on entry, dedicated equipment.', 'safety', 'Safety & Infection Control', 'safety'),
  d(74, 'C. difficile: two exceptions', 'Hands: SOAP AND WATER (alcohol does not kill spores). Rooms: sporicidal/bleach cleaning.', 'safety', 'Safety & Infection Control', 'safety'),
  d(75, 'PPE order: donning and doffing', 'Don: gown → mask → goggles → gloves. Doff: gloves → goggles → gown → mask (respirator outside the room). Hand hygiene after.', 'safety', 'Safety & Infection Control', 'safety'),
  d(76, 'Restraint rules', 'Last resort after alternatives; timed order, NEVER PRN; release/circulation check q2h; quick-release knot to the bed FRAME (never side rails); 2 fingers of slack.', 'safety', 'Safety & Infection Control', 'safety'),
  d(77, 'Fire response: RACE / PASS', 'Rescue → Alarm → Confine → Extinguish/Evacuate (rescue first when someone is in danger). Extinguisher: Pull, Aim at the base, Squeeze, Sweep.', 'safety', 'Safety & Infection Control', 'safety'),
  d(78, 'Home oxygen safety', 'No open flames/smoking (post signs), ≥10 ft from heat sources, cotton clothing, water-based (never petroleum) products near the face.', 'safety', 'Safety & Infection Control', 'safety'),
  d(79, 'Neutropenic (protective) precautions', 'Private room, strict hand hygiene, no fresh flowers/standing water, screen visitors, no raw foods on strict protocols, avoid invasive procedures.', 'safety', 'Safety & Infection Control', 'safety'),
  d(80, 'Seizure precautions', 'Padded rails, bed low, suction + oxygen at bedside, IV access. During: side-lying, protect head, time it, NOTHING in the mouth, never restrain.', 'safety', 'Safety & Infection Control', 'safety'),

  // ─────────────────── MATERNAL & PEDIATRIC (10) ───────────────────
  d(81, 'VEAL CHOP', 'Variable decels = Cord compression; Early = Head compression (benign); Accelerations = Okay; Late = Placental insufficiency (stop oxytocin, left side, fluids, O₂, notify).', 'maternal_peds', 'Maternal & Pediatric', 'maternal'),
  d(82, 'Cord prolapse response', 'Lift the presenting part OFF the cord with a gloved hand; knee-chest or deep Trendelenburg; call for emergency delivery. NEVER attempt to replace the cord.', 'maternal_peds', 'Maternal & Pediatric', 'maternal'),
  d(83, 'Postpartum fundus findings', 'Firm, midline, at/below umbilicus = normal. Boggy midline → massage first. Firm but DEVIATED → empty the bladder. Pad soaked in 15 min → hemorrhage.', 'maternal_peds', 'Maternal & Pediatric', 'maternal'),
  d(84, 'Preeclampsia severe features', 'BP ≥160/110, persistent headache, visual changes, epigastric/RUQ pain, rising creatinine, falling platelets. Seizure prophylaxis: magnesium sulfate.', 'maternal_peds', 'Maternal & Pediatric', 'maternal'),
  d(85, 'Newborn: normal vs never-normal', 'Normal: acrocyanosis (first 24-48 h), milia, molding, weight loss ≤~10% regained by 2 weeks. Never normal: central cyanosis, grunting/flaring/retracting, jaundice in the FIRST 24 h.', 'maternal_peds', 'Maternal & Pediatric', 'maternal'),
  d(86, 'Infant milestones: 2-6-9-12 months', '2 mo: social smile. 6 mo: rolls both ways, sits with support, babbles. 9-10 mo: pincer grasp, pulls to stand. 12 mo: first steps, first words. Weight: doubles by 6 mo, triples by 12.', 'maternal_peds', 'Maternal & Pediatric', 'peds'),
  d(87, 'Fontanel closure', 'Posterior: 2-3 months. Anterior: 12-18 months. Bulging = increased ICP; sunken = dehydration.', 'maternal_peds', 'Maternal & Pediatric', 'peds'),
  d(88, 'Erikson stages, birth → adolescence', 'Infant: trust vs mistrust. Toddler: autonomy vs shame. Preschool: initiative vs guilt. School-age: industry vs inferiority. Adolescent: identity vs role confusion.', 'maternal_peds', 'Maternal & Pediatric', 'peds'),
  d(89, 'Toddler choking hazards', 'Hot dog rounds (cut lengthwise), whole grapes, nuts, popcorn, hard candy. Toddlers are also the drowning + poisoning age: fences, locks, Poison Control number.', 'maternal_peds', 'Maternal & Pediatric', 'peds'),
  d(90, 'Safe infant sleep', 'Supine ("back to sleep"), alone, in a bare crib: no pillows, bumpers, blankets, or co-sleeping. Room-sharing without bed-sharing is recommended.', 'maternal_peds', 'Maternal & Pediatric', 'peds'),
];

export function getNCLEXFlashcards(domain?: string): NCLEXFlashcard[] {
  if (!domain) return NCLEX_FLASHCARDS;
  return NCLEX_FLASHCARDS.filter((c) => c.domain === domain);
}

export const NCLEX_FLASHCARD_COUNT = NCLEX_FLASHCARDS.length;

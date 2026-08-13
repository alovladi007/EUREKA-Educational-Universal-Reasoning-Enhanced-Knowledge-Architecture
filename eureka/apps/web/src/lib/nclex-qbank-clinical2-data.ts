/**
 * NCLEX-RN (2026 test plan) — Question Bank, part 2 of 2.
 *
 * Clinical items for topics 4-7 (Basic Care & Comfort, Pharmacological &
 * Parenteral Therapies (non-calculation), Reduction of Risk Potential,
 * Physiological Adaptation). Same provenance rules as part 1: AI-authored
 * against mainstream nursing references, `unverified` pending SME review.
 * The dosage-calculation tier (dual-path verified keys) lives in part 1.
 */

import type { NclexQuestion } from '@/lib/nclex-qbank-data';

export const NCLEX_CLINICAL_QUESTIONS_2: NclexQuestion[] = [
  // ═══ TOPIC 4 — Basic Care & Comfort (8) ═══
  {
    id: 'nx_bcc_001',
    topicId: 4,
    subtopic: 'Assistive devices',
    difficulty: 1,
    question:
      'The nurse is teaching a client with right-leg weakness to use a cane. Which instruction is correct?',
    options: [
      'Hold the cane on the left side and move it together with the right leg',
      'Hold the cane on the right side and move it with the right leg',
      'Hold the cane on the left side and move it with the left leg',
      'Alternate the cane between hands to build equal strength',
    ],
    correct: 0,
    explanation:
      'The cane goes on the STRONG side and advances together with the WEAK leg, sharing its load — "cane opposite the bad leg, moves with the bad leg." Remember COAL: Cane Opposite Affected Leg.',
    verification: 'unverified',
  },
  {
    id: 'nx_bcc_002',
    topicId: 4,
    subtopic: 'Assistive devices',
    difficulty: 1,
    question:
      'A client using crutches after a left ankle fracture asks how to climb stairs. Which teaching is correct?',
    options: [
      'Lead up with the left (injured) leg, then bring the right leg and crutches',
      'Lead up with the right (unaffected) leg, then bring the crutches and left leg',
      'Place both crutches on the step above first, then hop up with both feet',
      'Always go up stairs backward for better balance',
    ],
    correct: 1,
    explanation:
      '"Up with the good, down with the bad": ascending, the strong leg leads and lifts the body; descending, the crutches and injured leg go first. The strong leg does the work against gravity in both directions.',
    verification: 'unverified',
  },
  {
    id: 'nx_bcc_003',
    topicId: 4,
    subtopic: 'Pressure injuries',
    difficulty: 2,
    question:
      'The nurse assesses a shallow, open sacral wound with a red-pink moist wound bed and no slough or visible deeper tissue. How should this pressure injury be staged?',
    options: ['Stage 1', 'Stage 2', 'Stage 3', 'Unstageable'],
    correct: 1,
    explanation:
      'Partial-thickness loss with a viable red-pink bed (or an intact serum-filled blister) is Stage 2. Stage 1 is intact skin with non-blanchable redness; Stage 3 reaches subcutaneous fat; unstageable means the base is obscured by slough or eschar.',
    verification: 'unverified',
  },
  {
    id: 'nx_bcc_004',
    topicId: 4,
    subtopic: 'Pressure injury prevention',
    difficulty: 2,
    question:
      'Which intervention best protects the heels of an immobile client from pressure injury?',
    options: [
      'Massaging the heels briskly every shift',
      'Placing a donut-shaped cushion under each heel',
      'Elevating the calves on a pillow so the heels float free of the bed',
      'Keeping the head of the bed at 45 degrees or higher',
    ],
    correct: 2,
    explanation:
      '"Floating" the heels off the mattress removes pressure entirely — the only fully effective measure. Massaging reddened areas damages fragile tissue, donut cushions create a new pressure ring, and a high head-of-bed increases sacral shear.',
    verification: 'unverified',
  },
  {
    id: 'nx_bcc_005',
    topicId: 4,
    subtopic: 'Enteral nutrition',
    difficulty: 2,
    question:
      'A nasogastric feeding tube has just been inserted. Which method verifies correct placement before the FIRST feeding?',
    options: [
      'Auscultating a whoosh of injected air over the stomach',
      'Measuring the pH of aspirate at the bedside',
      'Observing the client for coughing during flushes',
      'Radiographic (X-ray) confirmation of tube tip location',
    ],
    correct: 3,
    explanation:
      'X-ray is the only accepted initial verification before anything goes down a new tube. Bedside pH (gastric ≤ 5) supports ONGOING placement checks between feedings; the air-bolus "whoosh" is unreliable and obsolete; absence of coughing proves nothing.',
    verification: 'unverified',
  },
  {
    id: 'nx_bcc_006',
    topicId: 4,
    subtopic: 'Therapeutic diets',
    difficulty: 1,
    question:
      'A client is prescribed a clear liquid diet after abdominal surgery. Which item may the nurse provide?',
    options: ['Orange juice with pulp', 'Cream of chicken soup', 'Gelatin dessert', 'Vanilla ice cream'],
    correct: 2,
    explanation:
      'Clear liquids are those you can see through at room temperature: gelatin, broth, pulp-free juice, tea, black coffee, popsicles. Pulp, dairy, and cream soups belong to the full liquid diet.',
    verification: 'unverified',
  },
  {
    id: 'nx_bcc_007',
    topicId: 4,
    subtopic: 'Renal diet',
    difficulty: 2,
    question:
      'A client with end-stage kidney disease on hemodialysis is choosing lunch. Which selection indicates that dietary teaching has been effective?',
    options: [
      'Grilled chicken with white rice and green beans',
      'Baked potato with tomato salad and a banana',
      'Cheeseburger with french fries and a milkshake',
      'Spinach salad with orange slices and nuts',
    ],
    correct: 0,
    explanation:
      'The renal diet restricts potassium, phosphorus, and sodium. Potatoes, tomatoes, bananas, oranges, spinach, and nuts are potassium bombs; dairy and processed foods load phosphorus and sodium. Chicken, white rice, and green beans are the low-everything plate.',
    verification: 'unverified',
  },
  {
    id: 'nx_bcc_008',
    topicId: 4,
    subtopic: 'Aspiration precautions',
    difficulty: 2,
    type: 'multi',
    question:
      'The nurse is caring for a client with dysphagia after a stroke. Which aspiration precautions are appropriate? Select all that apply.',
    options: [
      'Position the client fully upright for all oral intake',
      'Instruct the client to tuck the chin while swallowing',
      'Provide thickened liquids as recommended by the swallow evaluation',
      'Offer a straw to make thin liquids easier to drink',
      'Keep the client upright for at least 30 minutes after meals',
    ],
    correctAnswers: [0, 1, 2, 4],
    explanation:
      'Upright positioning, chin-tuck swallow, prescribed thickened consistencies, and remaining upright after meals all defend the airway. Straws speed thin liquid past the swallow reflex and INCREASE aspiration risk — the one to reject.',
    verification: 'unverified',
  },

  // ═══ TOPIC 5 — Pharmacology, non-calculation (12) ═══
  {
    id: 'nx_pht_001',
    topicId: 5,
    subtopic: 'Cardiac glycosides',
    difficulty: 2,
    question:
      'A client taking digoxin reports nausea, poor appetite, and seeing yellow halos around lights. Which laboratory results should the nurse review first?',
    options: [
      'Hemoglobin and hematocrit',
      'Digoxin level and serum potassium',
      'Liver enzymes and bilirubin',
      'Serum creatinine and urine output',
    ],
    correct: 1,
    explanation:
      'Anorexia, nausea, and visual color disturbances are the classic digoxin-toxicity triad. The level confirms it, and potassium matters because hypokalemia potentiates toxicity at any level — the two results are read together.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_002',
    topicId: 5,
    subtopic: 'Insulin timing',
    difficulty: 2,
    question:
      'A client receives NPH insulin at 0730. At which time should the nurse be most alert for hypoglycemia?',
    options: [
      'Before the 0800 breakfast tray arrives',
      'Immediately at bedtime',
      'Between 1130 and 1930 (mid-afternoon peak window)',
      'At 0300 the following morning',
    ],
    correct: 2,
    explanation:
      'NPH is intermediate-acting: onset 1-2 hours, peak roughly 4-12 hours after injection — for an 0730 dose, the danger window centers on the afternoon, especially if lunch is missed. Rapid-acting analogs peak within 1-3 hours; that timing belongs to them.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_003',
    topicId: 5,
    subtopic: 'Anticoagulants',
    difficulty: 2,
    question:
      'Which laboratory value indicates that a client’s warfarin dose is within the usual therapeutic range for atrial fibrillation?',
    options: ['INR 1.0', 'INR 2.5', 'aPTT 70 seconds', 'Platelet count 250,000/mm³'],
    correct: 1,
    explanation:
      'Warfarin is monitored by INR, therapeutic 2.0-3.0 for most indications — 2.5 sits in the center. INR 1.0 is untreated normal; aPTT monitors heparin, not warfarin; platelets measure neither.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_004',
    topicId: 5,
    subtopic: 'Anticoagulants',
    difficulty: 2,
    question:
      'A client on a continuous heparin infusion develops significant bleeding. Which medication should the nurse prepare to administer?',
    options: ['Vitamin K', 'Protamine sulfate', 'Acetylcysteine', 'Naloxone'],
    correct: 1,
    explanation:
      'Protamine sulfate reverses heparin; vitamin K reverses warfarin. Keeping the two antidote pairs straight is a permanent exam fixture. Acetylcysteine rescues acetaminophen overdose; naloxone reverses opioids.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_005',
    topicId: 5,
    subtopic: 'Opioid safety',
    difficulty: 2,
    question:
      'Before administering a scheduled dose of IV morphine, which assessment finding requires the nurse to withhold the dose and notify the provider?',
    options: [
      'Pain rating of 8 out of 10',
      'The client reports itching relieved by antihistamine',
      'Blood pressure of 128/76 mm Hg',
      'Respiratory rate of 10 breaths per minute',
    ],
    correct: 3,
    explanation:
      'Respiratory depression is the lethal opioid effect: a rate at or below ~12/min (institutional cutoffs vary) means hold the dose, stimulate, and reassess — with naloxone ready if depression progresses. Severe pain is the indication, not a contraindication.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_006',
    topicId: 5,
    subtopic: 'Antidotes',
    difficulty: 1,
    question:
      'An adolescent is admitted after ingesting a large quantity of acetaminophen. Which medication should the nurse anticipate administering?',
    options: ['Flumazenil', 'Deferoxamine', 'Acetylcysteine', 'Atropine'],
    correct: 2,
    explanation:
      'Acetylcysteine replenishes glutathione and prevents the hepatic necrosis that makes acetaminophen the classic delayed-lethality overdose — most effective begun within 8-10 hours. Flumazenil reverses benzodiazepines, deferoxamine chelates iron, atropine treats cholinergic crisis.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_007',
    topicId: 5,
    subtopic: 'Antibiotic infusions',
    difficulty: 2,
    question:
      'Fifteen minutes into a vancomycin infusion, the client develops flushing of the face and neck and reports itching. Blood pressure is stable. What should the nurse do first?',
    options: [
      'Slow the infusion rate and notify the provider',
      'Stop the infusion permanently and document a vancomycin allergy',
      'Administer epinephrine intramuscularly',
      'Flush the line and restart at the original rate',
    ],
    correct: 0,
    explanation:
      'Flushing with a stable blood pressure is vancomycin infusion reaction (rate-related histamine release), not IgE allergy: slow or pause the rate, notify, and expect an antihistamine plus a ≥60-minute infusion going forward. Epinephrine is for anaphylaxis — hypotension, bronchospasm, airway edema.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_008',
    topicId: 5,
    subtopic: 'ACE inhibitors',
    difficulty: 2,
    question:
      'A client taking lisinopril should be taught to avoid which of the following?',
    options: [
      'Foods rich in vitamin K such as leafy greens',
      'Potassium-based salt substitutes',
      'Aged cheese and cured meats',
      'Grapefruit juice with every dose',
    ],
    correct: 1,
    explanation:
      'ACE inhibitors retain potassium; adding potassium-chloride salt substitutes invites hyperkalemia. Vitamin K consistency is warfarin teaching, tyramine (aged cheese) is MAOI teaching, and grapefruit interacts chiefly with statins and calcium-channel blockers.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_009',
    topicId: 5,
    subtopic: 'Mood stabilizers',
    difficulty: 3,
    question:
      'A client taking lithium begins a low-sodium diet and starts training outdoors in hot weather. The nurse should recognize this combination increases the risk of which outcome?',
    options: [
      'Subtherapeutic lithium levels and relapse',
      'Hypernatremia and fluid overload',
      'Lithium toxicity',
      'Serotonin syndrome',
    ],
    correct: 2,
    explanation:
      'The kidney handles lithium like sodium: sodium depletion and dehydration make it reabsorb BOTH, so levels climb toward toxicity (therapeutic 0.6-1.2 mEq/L; toxicity begins ~1.5). Steady salt and fluid intake is core lithium teaching.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_010',
    topicId: 5,
    subtopic: 'High-alert medications',
    difficulty: 1,
    question:
      'Which practice applies specifically to administering subcutaneous insulin as a high-alert medication?',
    options: [
      'Massaging the injection site to speed absorption',
      'Administering only with meals regardless of insulin type',
      'Using a 3-mL syringe for doses under 30 units',
      'Verification of the dose by a second nurse before administration, per policy',
    ],
    correct: 3,
    explanation:
      'High-alert drugs (insulin, heparin, opioids, concentrated electrolytes) carry independent double-check requirements in most institutions. Insulin is drawn ONLY in insulin-unit syringes, timing depends on the preparation, and sites are not massaged.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_011',
    topicId: 5,
    subtopic: 'Hypoglycemia',
    difficulty: 2,
    type: 'multi',
    question:
      'A client with type 1 diabetes received rapid-acting insulin 90 minutes ago and now reports feeling unwell. Which findings support hypoglycemia? Select all that apply.',
    options: [
      'Diaphoresis',
      'Tremulousness',
      'Fruity odor of the breath',
      'Tachycardia',
      'Confusion',
      'Deep, rapid respirations',
    ],
    correctAnswers: [0, 1, 3, 4],
    explanation:
      'Hypoglycemia is adrenergic and neuroglycopenic: sweating, tremor, tachycardia, hunger, then confusion. Fruity breath and Kussmaul respirations are ketoacidosis — the opposite emergency. Cold-and-clammy vs hot-and-dry is the bedside shorthand.',
    verification: 'unverified',
  },
  {
    id: 'nx_pht_012',
    topicId: 5,
    subtopic: 'Cardiac glycosides',
    difficulty: 3,
    type: 'multi',
    question:
      'The nurse prepares to administer the morning digoxin dose. Which findings require withholding the dose and contacting the provider? Select all that apply.',
    options: [
      'Apical heart rate of 54 beats per minute',
      'Serum potassium of 3.0 mEq/L',
      'Digoxin level of 2.4 ng/mL',
      'The client reports nausea and seeing halos',
      'Blood pressure of 138/84 mm Hg',
    ],
    correctAnswers: [0, 1, 2, 3],
    explanation:
      'Hold digoxin for bradycardia (<60 apical), hypokalemia (which potentiates toxicity), a supratherapeutic level (therapeutic ~0.5-2.0 ng/mL), or symptoms of toxicity. A normal-range blood pressure is not a digoxin decision point.',
    verification: 'unverified',
  },

  // ═══ TOPIC 6 — Reduction of Risk Potential (12) ═══
  {
    id: 'nx_rrp_001',
    topicId: 6,
    subtopic: 'Critical lab values',
    difficulty: 2,
    question:
      'A client’s morning potassium result is 2.8 mEq/L. Which nursing action takes priority?',
    options: [
      'Place the client on continuous cardiac monitoring and notify the provider',
      'Encourage potassium-rich foods at breakfast',
      'Document the value and recheck with the evening labs',
      'Hold the morning furosemide dose only',
    ],
    correct: 0,
    explanation:
      'Potassium 2.8 is critically low, and the killing complication is dysrhythmia — monitoring plus provider notification (expect IV replacement, NEVER IV push) comes first. Dietary potassium and holding the diuretic are right but secondary; waiting until evening is negligence.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_002',
    topicId: 6,
    subtopic: 'Critical lab values',
    difficulty: 2,
    question:
      'The nurse reviews a serum sodium of 118 mEq/L in a client admitted with confusion. Which precaution should the nurse institute?',
    options: [
      'Bleeding precautions',
      'Seizure precautions',
      'Neutropenic precautions',
      'Contact precautions',
    ],
    correct: 1,
    explanation:
      'Severe hyponatremia (<120) swells brain cells; confusion is the warning and seizure is the cliff. Pad the rails, ready suction and oxygen, and expect cautious correction — overly rapid sodium correction causes osmotic demyelination.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_003',
    topicId: 6,
    subtopic: 'Preoperative care',
    difficulty: 2,
    question:
      'On the preoperative checklist, the nurse notes the consent form is unsigned, and the client has already received the ordered preoperative sedation. What must the nurse do?',
    options: [
      'Have the client sign the consent before the sedation takes full effect',
      'Ask the client’s spouse to sign the consent form',
      'Notify the surgeon that consent cannot be obtained and the procedure must be delayed',
      'Send the client to the OR with a note about the missing consent',
    ],
    correct: 2,
    explanation:
      'Sedation destroys the capacity that makes consent valid — a signature obtained now is worthless, and a spouse cannot consent for a client with (ordinary) capacity. The error goes up the chain and the case waits. Consent BEFORE sedation is the checklist’s whole point.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_004',
    topicId: 6,
    subtopic: 'Postoperative complications',
    difficulty: 2,
    question:
      'Thirty-six hours after abdominal surgery, a client develops a temperature of 38.1 °C (100.6 °F) with diminished breath sounds at both bases. Which intervention should the nurse implement first?',
    options: [
      'Obtain blood and urine cultures',
      'Prepare the client for a chest X-ray and antibiotics',
      'Administer the PRN antipyretic and reassess in an hour',
      'Have the client use the incentive spirometer and ambulate as tolerated',
    ],
    correct: 3,
    explanation:
      'Low-grade fever with diminished bases in the first 24-48 hours is atelectasis — the "wind" of the classic post-op fever sequence. Lung expansion (spirometry, deep breathing, ambulation) treats the cause; cultures and antibiotics chase later-window fevers (urine day 3-5, wound day 5-7).',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_005',
    topicId: 6,
    subtopic: 'Chest tubes',
    difficulty: 3,
    question:
      'The nurse observes continuous vigorous bubbling in the water-seal chamber of a client’s chest drainage system. What does this finding indicate?',
    options: [
      'An air leak is present in the system or the pleural space',
      'The system is functioning normally',
      'The suction pressure is set too low',
      'The lung has fully re-expanded',
    ],
    correct: 0,
    explanation:
      'The water seal should rise and fall with breathing (tidaling) and may bubble intermittently with a pneumothorax — CONTINUOUS bubbling means air is entering somewhere: check connections from dressing to device, then notify. (Steady gentle bubbling in the suction-control chamber, by contrast, is normal.)',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_006',
    topicId: 6,
    subtopic: 'CAUTI prevention',
    difficulty: 1,
    question:
      'Which nursing action best prevents catheter-associated urinary tract infection in a client with an indwelling urinary catheter?',
    options: [
      'Irrigating the catheter with sterile saline daily',
      'Keeping the drainage bag below bladder level and the system closed',
      'Disconnecting the catheter from the bag when the client ambulates',
      'Changing the catheter every 24 hours',
    ],
    correct: 1,
    explanation:
      'Gravity drainage with an intact closed system — bag below the bladder, tubing off the floor, no dependent loops, secured to the thigh — plus daily necessity review and early removal are the CAUTI bundle. Routine irrigation, disconnection, and daily changes all open the system to organisms.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_007',
    topicId: 6,
    subtopic: 'Diabetes & procedures',
    difficulty: 2,
    question:
      'A client with type 1 diabetes is NPO after midnight for a morning procedure. The medication record lists the usual morning dose of insulin glargine. What should the nurse do?',
    options: [
      'Hold all insulin because the client is NPO',
      'Give half the glargine dose without contacting anyone',
      'Clarify the insulin plan with the provider',
      'Give the full dose with a small snack',
    ],
    correct: 2,
    explanation:
      'Basal insulin usually continues (sometimes reduced) even when NPO, because type 1 clients make no insulin of their own — but the decision is the prescriber’s. Independently holding invites ketoacidosis; independently halving is practicing medicine; a snack breaks NPO status.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_008',
    topicId: 6,
    subtopic: 'Post-procedure care',
    difficulty: 2,
    question:
      'A client returns from cardiac catheterization performed through the right femoral artery. Which assessment is the priority?',
    options: [
      'Pain level at the insertion site',
      'Urine output since the procedure',
      'Ability to tolerate oral fluids',
      'The puncture site and the right pedal pulses',
    ],
    correct: 3,
    explanation:
      'The two femoral-access killers are hemorrhage at the site and arterial occlusion distal to it — so the site and distal circulation (pulses, color, warmth) are checked together, frequently, with the leg straight and the client on bedrest. Fluids matter later for dye clearance.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_009',
    topicId: 6,
    subtopic: 'Bleeding precautions',
    difficulty: 2,
    question:
      'A client receiving chemotherapy has a platelet count of 38,000/mm³. Which instruction should the nurse include in the plan of care?',
    options: [
      'Use a soft-bristled toothbrush and an electric razor',
      'Administer all medications by intramuscular injection',
      'Encourage vigorous flossing to prevent gingivitis',
      'Apply ice and pressure after venipuncture for 30 seconds',
    ],
    correct: 0,
    explanation:
      'Thrombocytopenia care removes bleeding triggers: soft toothbrush, electric razor, no IM injections, no rectal temperatures or suppositories, stool softeners, and prolonged (5+ minute) pressure after any puncture. Flossing hard and IM routes do the opposite.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_010',
    topicId: 6,
    subtopic: 'Anticoagulation monitoring',
    difficulty: 2,
    question:
      'A client taking warfarin has a morning INR of 5.4 with no visible bleeding. Which action should the nurse anticipate?',
    options: [
      'Administer the next warfarin dose as scheduled',
      'Hold the warfarin and prepare to administer vitamin K per prescription',
      'Administer protamine sulfate immediately',
      'Increase the warfarin dose to stabilize the INR',
    ],
    correct: 1,
    explanation:
      'An INR above ~4.5-5 is a major bleeding risk: hold the drug, notify, and expect vitamin K (with the route and dose scaled to INR and bleeding). Protamine reverses heparin — the perennial antidote trap.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_011',
    topicId: 6,
    subtopic: 'VTE prevention',
    difficulty: 2,
    type: 'multi',
    question:
      'Which interventions help prevent deep-vein thrombosis in a postoperative client? Select all that apply.',
    options: [
      'Early and frequent ambulation',
      'Sequential compression devices while in bed',
      'Ankle circles and calf-pumping exercises each hour awake',
      'Pillows placed under the knees for comfort',
      'Adequate hydration',
    ],
    correctAnswers: [0, 1, 2, 4],
    explanation:
      'Movement, mechanical compression, and hydration all counter stasis. Pillows under the knees (or a raised knee gatch) compress the popliteal vessels and PROMOTE stasis — and calf massage is likewise forbidden once a clot may exist.',
    verification: 'unverified',
  },
  {
    id: 'nx_rrp_012',
    topicId: 6,
    subtopic: 'Critical lab values',
    difficulty: 3,
    type: 'multi',
    question:
      'The nurse receives morning laboratory results for four clients. Which values require immediate provider notification? Select all that apply.',
    options: [
      'Potassium 6.3 mEq/L',
      'Blood glucose 44 mg/dL',
      'Sodium 139 mEq/L',
      'Platelets 16,000/mm³',
      'White blood cells 8,200/mm³',
    ],
    correctAnswers: [0, 1, 3],
    explanation:
      'Hyperkalemia at 6.3 threatens the heart, glucose 44 is symptomatic-hypoglycemia territory, and platelets under 20,000 risk spontaneous bleeding — all critical callbacks. Sodium 139 and WBC 8,200 are normal (Na 135-145; WBC 5,000-10,000).',
    verification: 'unverified',
  },

  // ═══ TOPIC 7 — Physiological Adaptation (12) ═══
  {
    id: 'nx_pad_001',
    topicId: 7,
    subtopic: 'Acid-base balance',
    difficulty: 3,
    question:
      'A client with chronic obstructive pulmonary disease has arterial blood gases of pH 7.30, PaCO₂ 58 mm Hg, HCO₃⁻ 25 mEq/L. How should the nurse interpret these results?',
    options: [
      'Metabolic acidosis, compensated',
      'Respiratory alkalosis, uncompensated',
      'Respiratory acidosis, uncompensated',
      'Metabolic alkalosis, partially compensated',
    ],
    correct: 2,
    explanation:
      'Low pH = acidosis; the CO₂ is high and moves opposite the pH, so the cause is respiratory; the bicarbonate is still normal, so the kidneys have not compensated. ROME: Respiratory Opposite, Metabolic Equal.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_002',
    topicId: 7,
    subtopic: 'Acid-base balance',
    difficulty: 2,
    question:
      'A client having a panic attack has been breathing rapidly for 20 minutes and reports numbness and tingling around the mouth. Which acid-base imbalance is most likely?',
    options: [
      'Respiratory acidosis',
      'Metabolic acidosis',
      'Metabolic alkalosis',
      'Respiratory alkalosis',
    ],
    correct: 3,
    explanation:
      'Hyperventilation blows off CO₂, raising pH — respiratory alkalosis. The falling ionized calcium that accompanies alkalosis produces the circumoral and fingertip paresthesias. Coached slow breathing is the treatment.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_003',
    topicId: 7,
    subtopic: 'Electrolyte emergencies',
    difficulty: 3,
    question:
      'A client with acute kidney injury has a potassium of 6.8 mEq/L. Which ECG change should the nurse expect to see first?',
    options: [
      'Tall, peaked T waves',
      'Prominent U waves',
      'A lengthening QT interval',
      'ST-segment elevation in all leads',
    ],
    correct: 0,
    explanation:
      'Hyperkalemia announces itself with tall peaked T waves, then widening QRS and loss of P waves as it worsens. U waves belong to HYPOkalemia and long QT to hypocalcemia or hypomagnesemia — the exam loves swapping these signatures.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_004',
    topicId: 7,
    subtopic: 'Electrolyte emergencies',
    difficulty: 3,
    question:
      'Six hours after total thyroidectomy, a client reports tingling of the fingers and around the mouth. The nurse notes a carpal spasm when the blood pressure cuff inflates. Which prescription should the nurse anticipate?',
    options: [
      'IV potassium chloride',
      'IV calcium gluconate',
      'Oral levothyroxine',
      'IV magnesium sulfate',
    ],
    correct: 1,
    explanation:
      'Thyroidectomy can bruise or remove the parathyroids; the paresthesias and positive Trousseau sign are acute hypocalcemia, and the feared endpoint is laryngospasm. Calcium gluconate stays at the bedside of every fresh thyroidectomy for exactly this moment.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_005',
    topicId: 7,
    subtopic: 'Anaphylaxis',
    difficulty: 2,
    question:
      'Two minutes into a new IV antibiotic, the client develops wheezing, facial swelling, and hypotension. After stopping the infusion, which medication should the nurse administer first?',
    options: [
      'Diphenhydramine IV',
      'Methylprednisolone IV',
      'Epinephrine intramuscularly',
      'Albuterol by nebulizer',
    ],
    correct: 2,
    explanation:
      'Anaphylaxis has one first-line drug: epinephrine IM (anterolateral thigh), repeated every 5-15 minutes as needed. Antihistamines, steroids, and bronchodilators are adjuncts that treat symptoms but do not reverse the vasodilation and capillary leak that kill.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_006',
    topicId: 7,
    subtopic: 'Autonomic dysreflexia',
    difficulty: 3,
    question:
      'A client with a T4 spinal cord injury suddenly develops a pounding headache, facial flushing, and blood pressure of 210/110 mm Hg with bradycardia. What should the nurse do FIRST?',
    options: [
      'Administer the PRN antihypertensive',
      'Apply oxygen at 2 L/min by nasal cannula',
      'Recheck the blood pressure in 15 minutes',
      'Raise the head of the bed upright and lower the legs',
    ],
    correct: 3,
    explanation:
      'This is autonomic dysreflexia. Sitting the client bolt upright uses orthostatic pooling to drop pressure within seconds — faster than any drug — and then the hunt for the trigger begins (a full bladder is the usual culprit, then bowel, then skin). Antihypertensives come only if removal of the trigger fails.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_007',
    topicId: 7,
    subtopic: 'Compartment syndrome',
    difficulty: 3,
    question:
      'A client with a casted tibial fracture reports increasing pain unrelieved by opioids, worse with passive toe stretching. The toes are pale and cool. Which action should the nurse take?',
    options: [
      'Notify the provider immediately and prepare for cast removal or fasciotomy',
      'Administer an additional opioid dose and reassess in 30 minutes',
      'Elevate the extremity above heart level and apply ice',
      'Document the findings as expected fracture pain',
    ],
    correct: 0,
    explanation:
      'Pain out of proportion, worse on passive stretch, with pallor and coolness is compartment syndrome — a surgical emergency measured in hours of muscle viability. Elevation above the heart and ice REDUCE perfusion into the compartment and are contraindicated; more opioid just masks the alarm.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_008',
    topicId: 7,
    subtopic: 'Malignant hyperthermia',
    difficulty: 3,
    question:
      'During general anesthesia, a client develops jaw rigidity, a rapidly rising end-tidal CO₂, and tachycardia. Which medication is the specific treatment the nurse should prepare?',
    options: ['Dantrolene', 'Flumazenil', 'Labetalol', 'Calcium chloride'],
    correct: 0,
    explanation:
      'Rigidity plus climbing CO₂ under anesthesia is malignant hyperthermia — a runaway skeletal-muscle calcium release. Dantrolene blocks that release and is the only specific therapy; note the fever itself is a LATE sign, so nobody waits for it.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_009',
    topicId: 7,
    subtopic: 'Airway management',
    difficulty: 2,
    question:
      'A client with a tracheostomy has thick secretions and audible rhonchi. Which suctioning practice is correct?',
    options: [
      'Instill sterile saline into the tube before each pass to loosen secretions',
      'Limit each suction pass to 10-15 seconds with intermittent suction on withdrawal',
      'Apply suction while inserting the catheter to clear the path',
      'Suction on a fixed schedule of every two hours',
    ],
    correct: 1,
    explanation:
      'Suction only as needed, pre-oxygenate, insert WITHOUT suction, and apply intermittent suction while withdrawing for no more than 10-15 seconds per pass. Saline instillation is out — it drives organisms deeper and drops oxygenation without thinning anything.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_010',
    topicId: 7,
    subtopic: 'Diabetic emergencies',
    difficulty: 2,
    type: 'multi',
    question:
      'A client with type 1 diabetes is admitted with diabetic ketoacidosis. Which findings should the nurse expect? Select all that apply.',
    options: [
      'Deep, rapid (Kussmaul) respirations',
      'Fruity odor of the breath',
      'Blood glucose 480 mg/dL',
      'Cool, moist skin with tremors',
      'Polyuria and signs of dehydration',
    ],
    correctAnswers: [0, 1, 2, 4],
    explanation:
      'DKA = hyperglycemia, ketosis (fruity breath), acidosis driving Kussmaul respirations, and osmotic diuresis causing polyuria then dehydration. Cool moist skin with tremor is the adrenergic picture of HYPOglycemia — the opposite problem.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_011',
    topicId: 7,
    subtopic: 'Fluid overload',
    difficulty: 2,
    type: 'multi',
    question:
      'Which assessment findings indicate fluid volume excess in a client with heart failure? Select all that apply.',
    options: [
      'Crackles in the lung bases',
      'Jugular venous distention at 45 degrees',
      'Weight gain of 1.4 kg (3 lb) since yesterday',
      'Poor skin turgor with tenting',
      'Bounding peripheral pulses',
    ],
    correctAnswers: [0, 1, 2, 4],
    explanation:
      'Excess volume shows up as crackles, JVD, rapid weight gain (the single most sensitive bedside measure — 1 kg ≈ 1 L), edema, and full bounding pulses. Tenting turgor is a DEFICIT sign; it does not belong in this cluster.',
    verification: 'unverified',
  },
  {
    id: 'nx_pad_012',
    topicId: 7,
    subtopic: 'IV fluids',
    difficulty: 2,
    question:
      'A client with severe hyponatremia is prescribed 3% sodium chloride. Which nursing consideration applies to this infusion?',
    options: [
      'It may be infused rapidly through a peripheral line to correct sodium quickly',
      'It is isotonic and appropriate for routine maintenance fluids',
      'It is hypertonic and requires an infusion pump with frequent neurologic checks',
      'It is hypotonic and will rehydrate the intracellular space',
    ],
    correct: 2,
    explanation:
      'Three-percent saline is markedly hypertonic: small volumes, pump-controlled, ideally via central access, with serial sodium levels and neuro checks — because correcting sodium faster than ~8-12 mEq/L per day risks osmotic demyelination. Isotonic is 0.9%; hypotonic is 0.45%.',
    verification: 'unverified',
  },
];

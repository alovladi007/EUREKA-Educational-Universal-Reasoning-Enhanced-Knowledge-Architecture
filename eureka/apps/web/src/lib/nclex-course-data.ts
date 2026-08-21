/**
 * NCLEX-RN course content for the "Read Lessons" tab of the exam-prep app.
 * Written against the 2026 test plan (effective 2026-04-01, frozen through
 * 2029-03-31): the 8 Client Needs categories plus a foundations pair on the
 * NGN exam itself and the clinical judgment model. Original teaching content
 * only — NCSBN releases no items and none are reproduced here.
 */

import type { TopicLesson } from '@/lib/cissp-course-data';

export const NCLEX_COURSE: Record<string, TopicLesson> = {

nx_ngn_exam: {
  topicId: 'nx_ngn_exam',
  title: `The NGN Exam & CAT Strategy`,
  domainWeight: 'Foundations',
  overview: `The NCLEX-RN is not a fixed test — it is a computerized adaptive test (CAT) that builds itself around you, one item at a time, until it is statistically confident you are above or below the passing standard. Understanding the machine changes how you should sit in front of it: the exam is supposed to feel hard for everyone, a longer test does not mean you are failing, and there is no percentage score to chase. The 2026 test plan changed nothing of substance from the Next Generation NCLEX (NGN) framework, and it is locked through March 31, 2029 — what you study today is what you will face.`,
  sections: [
    {
      id: 'ngn-cat-mechanics',
      title: `1. How the CAT Decides`,
      content: `Every candidate answers between 85 and 150 items in up to 5 hours. Of the first 85, only 70 are scored — 15 are unscored pretest items being calibrated for future exams, and you cannot tell which are which, so every item deserves full effort.

The algorithm maintains a running estimate of your ability. Answer correctly and the next item is harder; miss and it gets easier. The exam ends when one of three things happens: the 95% confidence rule (the algorithm is 95% sure your ability is clearly above or clearly below the 0.00-logit passing standard), the maximum-length rule (at item 150, the final ability estimate decides), or the time rule (at 5 hours, a run-out-of-time decision is applied).

This is why the test "feels" like a coin flip: the CAT deliberately serves items near your estimated ability, where you have roughly a 50% chance on each. If the questions feel brutally hard, that usually means the algorithm has placed you high and is probing your ceiling. Neither test length nor perceived difficulty predicts the outcome — candidates pass at 85 items and at 150, and fail at both.`,
      examTip: `You cannot skip items or return to previous ones. Commit, move on, and do not diagnose your performance mid-exam — that spiral costs more points than any single wrong answer.`,
    },
    {
      id: 'ngn-item-types',
      title: `2. The NGN Item Types`,
      content: `Alongside classic multiple-choice and select-all-that-apply (SATA) items, the NGN introduced case studies and standalone item formats built around the clinical judgment model:

Case studies present one evolving client across six linked questions, each mapped to one step of the clinical judgment model. The record unfolds in tabs — nurses' notes, vital signs, labs, orders — exactly like a chart.

Bowtie items are a one-screen miniature case: from the presented findings you select the condition most likely developing (center), two actions to take (left), and two parameters to monitor (right).

Trend items ask you to interpret a series of measurements over time — a falling blood pressure across four readings, a rising temperature curve — rewarding recognition of trajectory, not single values.

Matrix/grid items have you classify each row (e.g., mark each finding as expected, unrelated, or requiring follow-up). Extended drag-and-drop, cloze (drop-down sentence completion), enhanced hot spot (highlighting text in a record), and extended multiple response round out the set.

Most NGN formats use partial-credit scoring: on a "+/-" scored item, correct selections earn points and incorrect selections cost them (never below zero for the item). You do not need a perfect response to earn most of the credit — so on multi-point items, select what you can defend and stop.`,
      importantNote: `SATA items now appear with the extended multiple response scoring model on many NGN items: partial credit exists. The old all-or-nothing SATA fear should not drive you to under-select defensible answers.`,
    },
    {
      id: 'ngn-preparation',
      title: `3. Preparing for an Adaptive Exam`,
      content: `Because the CAT samples across the whole test plan, breadth beats depth of any single topic. The eight Client Needs categories carry published weight ranges — Management of Care is the heaviest at 15-21% of scored items, Pharmacological and Parenteral Therapies second at 13-19% — and your preparation time should roughly mirror those weights.

Practice should be interleaved, not blocked: real exams never give you ten infection-control questions in a row, so drilling in shuffled mixed sets trains the switching your test day requires. Timed practice matters less than on fixed-length exams (the average pace works out to over two minutes per item even at 150 items), but stamina practice matters more — schedule at least two full-length practice sessions before test day.

Finally, calibrate your self-assessment to behavior, not feeling. After each practice session, sort misses into three bins: didn't know the content (study it), knew it but misread the question (slow down at the stem), and changed a right answer to wrong (trust the first defensible read). The three bins have three different fixes, and lumping them together as "I did badly" fixes none of them.`,
    },
  ],
  keyTakeaways: [
    `85-150 items, 5 hours, 15 unscored pretest items you cannot identify — treat every item as scored.`,
    `The CAT serves items near your ability: feeling challenged is the algorithm working, not a verdict.`,
    `NGN case studies follow the six clinical-judgment steps; bowtie and trend items are their standalone forms.`,
    `Partial credit exists on most NGN formats — select every answer you can defend.`,
    `The 2026 test plan is frozen through March 2029: weights, item types, and the 0.00-logit standard.`,
  ],
},

nx_clinical_judgment: {
  topicId: 'nx_clinical_judgment',
  title: `The Clinical Judgment Model`,
  domainWeight: 'Foundations',
  overview: `The NCSBN Clinical Judgment Measurement Model (NCJMM) is the skeleton under every NGN case study and most standalone items. Its six steps — recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, evaluate outcomes — are the exam's formalization of "thinking like a nurse." Learn the steps not as vocabulary but as questions you ask at the bedside, and every case study becomes a familiar walk instead of a puzzle.`,
  sections: [
    {
      id: 'cjm-recognize-analyze',
      title: `1. Recognize and Analyze Cues`,
      content: `Recognizing cues means separating what matters from the noise in the client record. A case study opens with a chart: some findings are expected for the client's condition, some are irrelevant, and a few are the thread the whole case hangs on. The exam asks this directly: "Which findings require immediate follow-up?"

The skill is anchoring each cue to the client's context. A respiratory rate of 24 means one thing in a resting adult and another in a client one hour post-extubation. An oxygen saturation of 94% is acceptable for a client with COPD and alarming in a healthy 25-year-old post-tonsillectomy.

Analyzing cues links the findings to possible explanations: "The client is 2 days post-op with sudden dyspnea, tachycardia, and pleuritic chest pain — which conditions do these support?" Here the exam rewards pattern recognition across body systems. Practice by naming, for every abnormal cue, at least two conditions that could produce it — then look for the second cue that separates them. Sudden dyspnea could be pulmonary embolism or pneumonia; a low-grade fever with productive cough points one way, a swollen unilateral calf the other.`,
      examTip: `In case studies, cues from DIFFERENT tabs (vitals + nurses' note + labs) are usually the ones that combine into the answer. A finding repeated across tabs is the exam pointing at it.`,
    },
    {
      id: 'cjm-prioritize-generate',
      title: `2. Prioritize Hypotheses and Generate Solutions`,
      content: `Prioritizing hypotheses asks: of the conditions these cues support, which is most likely — and which is most lethal if missed? The exam's ordering logic blends probability with consequence. A client with crushing chest pain probably has acute coronary syndrome; even if anxiety is statistically possible, ACS is pursued first because missing it kills.

Generate solutions then asks what could be done — the full menu, before choosing. This is where expected prescriptions live: for the client with suspected pulmonary embolism, you anticipate oxygen, anticoagulation, imaging. Bowtie items make this step literal: pick the condition, then the two most appropriate actions.

Two frameworks do most of the prioritization work. ABC (airway, breathing, circulation) ranks physiologic threats; Maslow puts physiologic needs before safety, safety before psychosocial. Acute beats chronic, unstable beats stable, unexpected-for-the-condition beats expected-for-the-condition. When two options both seem right, ask "which client dies or deteriorates first if I delay?" — that is nearly always the intended sort key.`,
      importantNote: `"Most likely hypothesis" and "priority hypothesis" are different questions. Likelihood follows the cue pattern; priority follows lethality. Read which one the item is asking.`,
    },
    {
      id: 'cjm-act-evaluate',
      title: `3. Take Action and Evaluate Outcomes`,
      content: `Take action selects and sequences the interventions — often "what should the nurse do FIRST?" The first action is usually the one that directly interrupts the threat identified in the earlier steps: raise the head of the bed for autonomic dysreflexia, stop the infusion for a transfusion reaction, epinephrine for anaphylaxis. Assessment verbs come first only when the situation is genuinely undiagnosed; once the stem hands you the diagnosis, act.

Evaluate outcomes closes the loop: which findings show the intervention worked — or didn't? The exam phrases this as "which finding indicates improvement?" or "which statement indicates the teaching was effective?" For teaching items, the correct answer is the client statement that translates the instruction into concrete behavior ("I will take this with a full glass of water and stay upright for 30 minutes"), and "indicates a need for further teaching" flips the polarity — hunt for the one wrong statement.

Across all six steps, the model rewards the same habit: tie every choice back to a cue in the record. If you cannot point at the finding that justifies an action, the action is probably a distractor.`,
    },
  ],
  keyTakeaways: [
    `Six steps: recognize cues → analyze cues → prioritize hypotheses → generate solutions → take action → evaluate outcomes.`,
    `Cue recognition = relevance against THIS client's context, not textbook normals in isolation.`,
    `Prioritization blends likelihood with lethality — the not-most-likely-but-fatal condition often outranks.`,
    `"First action" items: interrupt the identified threat; assess first only when the situation is undiagnosed.`,
    `"Need for further teaching" reverses polarity — you are hunting the single incorrect statement.`,
  ],
},

nx_prioritization: {
  topicId: 'nx_prioritization',
  title: `Prioritization, Delegation & Assignment`,
  domainWeight: 'Management of Care (15-21%)',
  overview: `Management of Care is the heaviest category on the exam, and prioritization-delegation questions are its core. These items simulate the real shift: four clients, one nurse, which door first? Or: a team of an RN, an LPN, and assistive personnel — who can safely do what? The rules are learnable, the frameworks are few, and the same patterns repeat endlessly.`,
  sections: [
    {
      id: 'pri-frameworks',
      title: `1. Who Do You See First?`,
      content: `Every "which client first" item resolves through a short stack of frameworks applied in order:

ABC with a caveat: airway compromise beats breathing problems beats circulation problems. Stridor, gurgling, or an obstructed artificial airway outranks nearly everything. The caveat: an ineffective airway beats a merely threatened one, and in CPR-adjacent situations current guidelines run circulation first (CAB) — but for triage-style questions, airway leads.

Unstable beats stable: new, changing, or unexpected findings outrank chronic, known, expected ones. A client with COPD and chronic O₂ saturation of 91% is expected; a post-op client whose saturation just dropped from 98% to 91% is a trend heading somewhere.

Acute beats chronic, and unexpected-for-the-condition beats expected-for-the-condition. Pain 8/10 two days after abdominal surgery is expected; sudden severe pain with a rigid abdomen is a possible dehiscence or bleed.

Maslow when nothing is physiologically on fire: physiologic needs, then safety, then psychosocial. The tearful client asking to talk matters — after the client whose IV antibiotic is an hour overdue.`,
      examTip: `Distractors are engineered to be urgent-sounding but expected: severe pain, high glucose without ketones, a chronic abnormal vital sign. Ask "is this NEW or CHANGING?" before ranking it.`,
    },
    {
      id: 'pri-delegation-rules',
      title: `2. What Can Be Delegated to Whom`,
      content: `Delegation questions test scope boundaries. The stable-vs-unstable axis and the assessment-teaching-evaluation triad decide almost every item.

Assistive personnel (AP/UAP) perform standardized, unchanging tasks for STABLE clients: hygiene, ambulation per established plan, turning, feeding clients without swallowing precautions, measuring and recording vital signs and I&O, applying prescribed sequential compression devices. AP never assess, never teach, never evaluate, never administer medications, and never take verbal orders. The trap items hand AP a task that looks routine but is attached to instability: vital signs on a fresh post-op client (that is assessment data driving immediate decisions) or feeding a client with new dysphagia.

LPN/LVNs care for stable clients with predictable outcomes: administer most oral, subcutaneous, and IM medications, perform sterile procedures (wound care, catheterization), reinforce teaching the RN initiated, and collect focused data (a wound description, a set of lung sounds). In most exam models, LPNs do not perform initial assessments, initial teaching, IV push medications, blood administration, or care planning.

The RN keeps everything requiring judgment: initial and ongoing assessment of unstable clients, care-plan development and evaluation, all client teaching that isn't reinforcement, blood products, titrated drips, and clinical decisions. The RN who delegates retains accountability for the delegation decision itself — the right task, right circumstance, right person, right direction, right supervision.`,
      importantNote: `"Stable" is the load-bearing word in every delegation stem. The same task flips between delegable and not based on that one adjective — read for it before matching task to role.`,
    },
    {
      id: 'pri-assignment-conflict',
      title: `3. Assignments, Floating, and Refusal`,
      content: `Assignment questions extend the same logic to whole clients. When distributing a team's caseload, the RN takes the unstable, the new admission, the client needing teaching or blood; the LPN takes the stable clients with treatments within scope; AP support across the group.

Floating scenarios test professional obligation against competence. A nurse floated to an unfamiliar unit does not refuse outright (abandonment risk) and does not silently accept an unsafe assignment. The correct pattern: report to the unit, state competencies honestly, accept the tasks within them, and negotiate the unfamiliar high-risk work to unit staff. If the charge nurse insists on an unsafe assignment, the escalation path is chain of command plus a written protest form where the institution provides one — while continuing to keep clients safe.

For disaster and mass-casualty triage, everyday rules invert: care goes to the salvageable many, not the sickest one. Walking wounded are green; serious-but-survivable injuries with respiratory or circulatory compromise are red and go first; stable significant injuries wait as yellow; the pulseless and the apneic-after-airway-repositioning are black/expectant. The exam signal that inverted rules apply is the phrase "mass casualty" or "disaster" in the stem.`,
    },
  ],
  keyTakeaways: [
    `Priority stack: airway → breathing → circulation → unstable/new/unexpected → Maslow.`,
    `AP: standardized tasks for stable clients — never assess, teach, evaluate, or medicate.`,
    `LPN: stable, predictable clients — meds and sterile procedures, reinforced (not initial) teaching.`,
    `RN keeps: unstable clients, initial assessment and teaching, blood, titration, care planning.`,
    `Disaster triage inverts everyday logic: greatest good for the greatest number; expectant = black.`,
  ],
},

nx_legal_ethical: {
  topicId: 'nx_legal_ethical',
  title: `Legal & Ethical Practice`,
  domainWeight: 'Management of Care (15-21%)',
  overview: `The exam's legal-ethical items rarely require statute citations. They test whether you know who owns which decision (client, provider, nurse), what must be reported and to whom, and where the paper trail lives. The recurring theme: the client with capacity decides, the provider discloses, the nurse witnesses, advocates, and documents facts.`,
  sections: [
    {
      id: 'leg-consent',
      title: `1. Informed Consent and Refusal`,
      content: `Valid informed consent requires three things: a client with decision-making capacity, a voluntary choice free of coercion, and disclosure — the provider performing the procedure explains its nature, risks, benefits, and alternatives. The nurse's signature witnesses that the client signed voluntarily and appeared to understand; it does not certify the explanation happened. If the client has unanswered questions about risks, the provider returns — the nurse does not fill the gap with a brochure.

Consent is revocable at any moment, verbally, including in the pre-op holding area with the IV running. "But they already signed" is never a reason to proceed; continuing after withdrawal is battery.

Capacity wrinkles the exam loves: sedation destroys capacity, so consent must precede pre-op medication — a form signed after the midazolam is worthless and the case waits. Emancipated minors (married, in the military, court-emancipated, and in many jurisdictions minors who are parents) consent for themselves. In a true emergency with an unconscious client and no surrogate, treatment proceeds under implied consent.

Refusal follows the same ownership: a client with capacity may refuse anything, including life-sustaining treatment, and may leave against medical advice. The nurse's job is to ensure the refusal is informed (explain consequences), notify the provider, and document the client's own words — not to guilt, delay, or threaten ("if you leave, insurance won't pay" is both coercive and usually false).`,
      examTip: `Whenever a consent stem includes sedation timing, that is the question. Sedated = no capacity = no valid signature.`,
    },
    {
      id: 'leg-directives-privacy',
      title: `2. Advance Directives and Confidentiality`,
      content: `An advance directive speaks when the client cannot: a living will states treatment preferences; a durable power of attorney for health care names a surrogate decision-maker. A do-not-resuscitate prescription means exactly one thing — no CPR at the moment of arrest. Everything else continues: oxygen, antibiotics, pain control, comfort, dignity. Treating DNR as "do not treat" is the classic exam error, presented both as a distractor and as a colleague's mistaken statement for you to correct.

The surrogate hierarchy matters when no directive exists: most jurisdictions run spouse → adult children → parents → siblings, and the exam expects you to involve the legally correct decision-maker, not the loudest relative.

Confidentiality items test the boundary of "need to know." Discussing clients in elevators or cafeterias, looking up records of clients not in your care (including family members and celebrities), sharing information with a client's employer or even family without permission — all breaches. When you witness a breach in progress, the first action is direct: stop the conversation. Reporting up the chain follows for patterns or refusals. The permitted disclosures are the legally mandated ones: suspected abuse and neglect, certain communicable diseases, gunshot and stab wounds, and credible threats to identifiable third parties (duty to warn).`,
      importantNote: `Mandated reporting requires SUSPICION, not proof. The nurse reports directly and personally — telling the provider or charge nurse does not discharge the individual legal duty in most jurisdictions.`,
    },
    {
      id: 'leg-torts-documentation',
      title: `3. Torts, Incident Reports, and the Record`,
      content: `The tort vocabulary maps to concrete bedside acts. Assault is the threat ("hold still or I'll restrain you"); battery is unconsented touching (proceeding after refusal, surgery without valid consent). False imprisonment is unlawful restriction — restraints without an order or clinical justification, or preventing a client with capacity from leaving. Negligence is the umbrella for care falling below standard; malpractice is professional negligence with duty, breach, causation, and damages.

Incident (occurrence) reports serve the quality system, not the chart. After any event — medication error, fall, equipment failure — the sequence is: assess and stabilize the client, notify the provider, implement orders, then complete the report. The medical record documents the facts (what happened, assessment findings, who was notified, care given) but NEVER mentions that an incident report exists; referencing it in the chart destroys its legal protection and is the most reliably tested detail of the whole topic.

Documentation standards close the set: chart facts and observations, not conclusions ("client states..." beats "client is angry"); late entries are labeled as such; errors get a single line, "mistaken entry," and initials — never correction fluid, never deletion. In electronic records, your login is your signature; sharing credentials is both a security violation and a documentation fraud risk.`,
    },
  ],
  keyTakeaways: [
    `Consent: provider discloses, client with capacity decides voluntarily, nurse witnesses — and sedation voids capacity.`,
    `Consent and refusal are revocable at any time; proceeding after withdrawal is battery.`,
    `DNR = no CPR at arrest. All other treatment and comfort care continues.`,
    `Abuse suspicion triggers a personal mandatory report — proof is the agency's job.`,
    `Incident reports never appear or get mentioned in the medical record; the chart carries only the facts.`,
  ],
},

nx_infection_control: {
  topicId: 'nx_infection_control',
  title: `Infection Control & Precautions`,
  domainWeight: 'Safety & Infection Control (10-16%)',
  overview: `Transmission-based precautions are among the most predictable points on the exam: a disease, a precaution level, the right PPE, and the right sequence for putting it on and taking it off. The pathogen lists are short and stable. Master the airborne three, the droplet cluster, the contact list, and the C. difficile exception, and this category becomes free points.`,
  sections: [
    {
      id: 'inf-standard-airborne',
      title: `1. Standard Precautions and the Airborne Three`,
      content: `Standard precautions apply to every client, every time: hand hygiene before and after contact, gloves for anticipated contact with blood or body fluids, mask and eye protection for splash risk, safe sharps handling. Alcohol-based hand rub is preferred over soap for routine hygiene — except when hands are visibly soiled and except for spore-formers, which is the C. difficile story below.

Airborne precautions cover pathogens that ride suspended droplet nuclei: tuberculosis, measles (rubeola), and varicella (chickenpox, and disseminated zoster). The bundle: a private negative-pressure airborne infection isolation room with the door closed, and a fit-tested N95 respirator (or PAPR) for everyone entering. For measles and varicella, immune staff should be assigned where possible. The client leaves the room only when essential, wearing a surgical mask (the client wears a surgical mask, not an N95 — the goal is source control).

The exam's favorite airborne distractors: putting a surgical mask on the caregiver (insufficient), leaving the door open (defeats negative pressure), and cohorting airborne clients with anyone (never, outside declared outbreak protocols).`,
      examTip: `Memorize the airborne three as "MTV": Measles, TB, Varicella. Everything else respiratory on the exam is droplet.`,
    },
    {
      id: 'inf-droplet-contact',
      title: `2. Droplet and Contact Precautions`,
      content: `Droplet precautions cover pathogens in large respiratory droplets that fall within about 3-6 feet: influenza, pertussis, mumps, rubella, meningococcal meningitis and sepsis, and mycoplasma pneumonia. The bundle: private room or cohorting, a surgical mask when within 3 feet of the client (in practice, on room entry), and a mask on the client during transport. Meningococcal disease carries a tested detail: droplet precautions may be discontinued after 24 hours of effective antibiotic therapy.

Contact precautions cover organisms spread by touch and fomites: MRSA, VRE, C. difficile, scabies, RSV in infants, and draining wounds that cannot be contained. The bundle: gown and gloves for room entry (donned before, removed at the door), dedicated or disinfected equipment, and a private room or cohort.

C. difficile adds two exceptions the exam tests relentlessly. First, hand hygiene is soap and water — the mechanical wash removes spores that alcohol cannot kill. Second, room cleaning requires a sporicidal agent (bleach-based). A stem that shows a caregiver using alcohol rub after C. diff care is showing you the error to catch.

Protective (reverse) isolation inverts the direction: neutropenic clients (commonly ANC below 500-1000) are shielded FROM the environment — private positive-pressure room for transplant-level cases, no fresh flowers or standing water, no raw fruits and vegetables on strict protocols, meticulous hand hygiene, and no sick visitors.`,
      importantNote: `The precaution follows the ORGANISM, not the diagnosis. A pneumonia stem is droplet or standard depending on the named pathogen; a wound stem is contact only if drainage is uncontained or the organism is resistant.`,
    },
    {
      id: 'inf-ppe-sequence',
      title: `3. PPE Sequences and Asepsis`,
      content: `Donning order builds from clean to critical: gown first, then mask or respirator, then goggles or face shield, gloves last (pulled over the gown cuffs). Doffing order removes the most contaminated items first: gloves, then goggles, then gown, then mask — with the respirator removed OUTSIDE the room for airborne precautions, and hand hygiene immediately after. If you remember one anchor for each direction: gown on first, gloves off first.

Surgical asepsis has its own testable geometry. A sterile field's 1-inch border is contaminated; anything below waist or table level is contaminated; reaching over the field contaminates it; sterile objects touched by non-sterile objects are contaminated; a wet field is a contaminated field (strike-through). When pouring liquids, the bottle lip stays off the container and the label faces the palm. Sterile gloves touch only sterile items — the moment of doubt is the moment of contamination, and the correct exam answer is always to start over with new supplies.

Order of care across multiple clients follows infection logic too: care for clean clients before colonized or infected ones, and the neutropenic client before the client on contact precautions when one caregiver covers both.`,
    },
  ],
  keyTakeaways: [
    `Airborne (MTV: measles, TB, varicella): negative-pressure room + N95 on staff; surgical mask on the client for transport.`,
    `Droplet (flu, pertussis, mumps, rubella, meningococcus): surgical mask; meningococcal precautions end after 24 h of antibiotics.`,
    `Contact (MRSA, VRE, C. diff, scabies, RSV): gown + gloves on entry; dedicated equipment.`,
    `C. difficile: soap-and-water hands and bleach cleaning — alcohol does not kill spores.`,
    `Don: gown → mask → goggles → gloves. Doff: gloves → goggles → gown → mask.`,
  ],
},

nx_client_safety: {
  topicId: 'nx_client_safety',
  title: `Client Safety & Error Prevention`,
  domainWeight: 'Safety & Infection Control (10-16%)',
  overview: `Safety items examine the systems that keep hospitalized people from being harmed by the hospital itself: falls, restraints, fires, and medication errors. The through-line is least-restrictive-first and system-over-blame. The exam wants the nurse who redesigns the environment before reaching for a restraint, and who reports errors into a system built to learn from them.`,
  sections: [
    {
      id: 'saf-falls-restraints',
      title: `1. Falls and Restraints`,
      content: `Fall prevention is a bundle, not a gadget: identify risk on admission and every shift (age, history of falls, sedating medications, orthostatic hypotension, toileting urgency, cognitive impairment); then bed low and locked, call light within reach and answered promptly, non-skid footwear, clear pathways, adequate lighting, hourly rounding with scheduled toileting, and high-risk clients placed near the nurses' station. Bed and chair alarms notify — they do not prevent — and all four side rails up is not a safety measure at all: it is a restraint that raises the height of the fall.

Restraints are the last resort after alternatives fail (reorientation, family or sitter presence, camouflaged tubing, activity, pain management). When required, the rules are rigid and heavily tested: a provider's order is required — never PRN — and if applied emergently, the order must follow within a defined window (commonly one hour for violent/self-destructive behavior, with face-to-face evaluation). Orders are time-limited (behavioral restraints: 4 hours adult, 2 hours ages 9-17, 1 hour under 9, renewable to a 24-hour maximum). The restrained client is observed continuously or on a strict schedule; circulation, skin, and range of motion are checked and the restraint released at least every 2 hours; the tie goes to the bed frame with a quick-release knot, never to a side rail; two fingers must fit between restraint and skin.`,
      examTip: `Any option that begins with applying a restraint, adding a side rail, or medicating for staff convenience is wrong until the stem shows least-restrictive alternatives already failed.`,
    },
    {
      id: 'saf-fire-electrical',
      title: `2. Fire, Oxygen, and Environmental Safety`,
      content: `Fire response is RACE, in order: Rescue anyone in immediate danger, Alarm, Confine (close doors), Extinguish if small or Evacuate. The sequencing detail the exam tests: with a person in the room, rescue precedes the alarm; with no one in danger, the alarm comes first. Extinguisher use is PASS: Pull, Aim at the base, Squeeze, Sweep. Horizontal evacuation (behind the next fire doors) precedes vertical; ambulatory clients walk out first in an evacuation, and elevators are never used.

Oxygen enriches fires rather than igniting them, so oxygen safety is distance and materials: no open flames or smoking anywhere near, signage posted, cotton rather than static-prone synthetics, no petroleum-based products around the face (water-based lubricants only), and electrical equipment in good repair.

Electrical and equipment safety round out the set: three-prong grounded plugs, no frayed cords or overloaded outlets, biomedical inspection tags current, and any device involved in an incident is sequestered exactly as it was — settings untouched — for investigation.`,
      importantNote: `RACE bends to the situation: the step that protects a life comes first. The exam stem tells you whether someone is in the room — read for it before choosing rescue versus alarm.`,
    },
    {
      id: 'saf-med-errors',
      title: `3. Medication Error Prevention`,
      content: `The rights of medication administration — right client (two identifiers), drug, dose, route, time, plus documentation, reason, and response — are the personal layer. The systems layer is where modern items live: barcode scanning actually performed at the bedside rather than worked around, smart-pump drug libraries used rather than overridden, high-alert medications (insulin, anticoagulants, opioids, concentrated electrolytes) double-checked independently by a second nurse, and concentrated potassium never stored on the unit and NEVER given IV push.

Communication failures cause the rest: dangerous abbreviations (U for units, trailing zeros — write 5 mg, never 5.0 mg; leading zeros required — 0.5 mg, never .5 mg), verbal orders repeated back and read back, and complete handoffs using a structured format (SBAR: situation, background, assessment, recommendation).

When an error occurs anyway, the sequence is fixed: client first (assess, stabilize), provider notified, prescribed follow-up done, then the incident report into the quality system — factual chart documentation without mentioning the report. The exam consistently rewards the nurse who reports near-misses too, because the system that hears about the almost-error fixes the process before it reaches a client.`,
    },
  ],
  keyTakeaways: [
    `Falls: bundle of environment + rounding + toileting; four rails up is a restraint, not protection.`,
    `Restraints: last resort, timed order (never PRN), release and reassess every 2 h, quick-release to the frame.`,
    `Fire: RACE and PASS — rescue first when someone is in danger; alarm first when no one is.`,
    `Oxygen: distance from flames, cotton clothing, water-based (never petroleum) products near the face.`,
    `High-alert meds get independent double checks; concentrated potassium is never unit-stocked, never IV push.`,
  ],
},

nx_lifespan: {
  topicId: 'nx_lifespan',
  title: `Growth & Development Across the Lifespan`,
  domainWeight: 'Health Promotion & Maintenance (6-12%)',
  overview: `Developmental questions are pattern-matching against a small table of anchors: what a healthy child does at each age, which vaccine lands when, and what aging changes are normal versus pathological. The exam offsets a milestone by a stage and asks whether you notice. Learn the anchors cold and the distractors dissolve.`,
  sections: [
    {
      id: 'life-infant-toddler',
      title: `1. Infants and Toddlers`,
      content: `The infant motor sequence runs head to toe: social smile around 2 months, head control by 4 months, rolling both ways and sitting with support by 6 months, sitting alone around 8 months, pulling to stand and pincer grasp emerging by 9-10 months, cruising then first steps around 12 months. Language tracks alongside: cooing at 2 months, babbling at 6, "mama/dada" with meaning near 12 months. Red flags include no social smile by 3 months, not rolling by 6-7 months, no babbling by 9, and no single words or inability to walk by 18 months.

Birth weight arithmetic is tested: weight doubles by about 6 months and triples by 12; the posterior fontanel closes by 2-3 months, the anterior by 12-18 months.

Toddlers (1-3 years) are Erikson's autonomy versus shame and doubt: the developmental jobs are saying no, choosing between two acceptable options, parallel play, and toilet training when ready (usually 2-3 years). Safety dominates teaching: toddlers are the drowning, poisoning, and choking age group. Round firm foods (hot dog rounds, whole grapes, nuts, hard candy, popcorn) are the classic aspiration set — cut lengthwise or avoid entirely. Car seats stay rear-facing per current guidance until the seat's height/weight limits, and the Poison Control number goes on every caregiver's phone (no ipecac — that guidance is decades gone).`,
      examTip: `Milestone items usually offset by one stage: the 6-month-old credited with 9-month skills, the 12-month "deficit" that is actually normal. Anchor to 2-6-9-12 months and check the offset direction.`,
    },
    {
      id: 'life-child-adolescent',
      title: `2. Preschool Through Adolescence`,
      content: `Preschoolers (3-5) work on initiative versus guilt: magical thinking, associative play, fears of mutilation and the dark. Their signature clinical need is concrete, honest preparation for procedures — a preschooler told "we're going to put you to sleep" hears the same words used for the family pet.

School-age children (6-12) work on industry versus inferiority: rules, projects, teams, collections, and cooperative play. They can understand cause and effect, so teaching can include the why; involving them in care (choosing the injection site, holding the dressing) feeds mastery.

Adolescents work on identity versus role confusion: peer group as the organizing force, body image salience, and a developmental drive toward risk-taking as the frontal lobe finishes wiring. Clinically this means confidential interviews without the parent for sensitive topics (HEADSS: home, education, activities, drugs, sexuality, suicide screening), teaching framed in present-tense consequences rather than distant disease, and honest inclusion in decisions about their own bodies.

Vaccine anchors worth memorizing: hepatitis B at birth; DTaP/IPV/Hib/PCV/rotavirus through infancy; MMR and varicella at 12-15 months (live vaccines — contraindicated in pregnancy and significant immunosuppression); HPV recommended starting at 11-12; Tdap booster and meningococcal at 11-12 with a booster at 16.`,
      importantNote: `Live vaccines (MMR, varicella, rotavirus, live attenuated influenza) are the contraindication cluster: pregnancy and immunocompromise. Egg allergy is NOT a contraindication to influenza vaccination in current guidance.`,
    },
    {
      id: 'life-older-adult',
      title: `3. Older Adults: Normal Versus Not`,
      content: `The normal-aging list is finite: presbyopia (reduced near vision) and presbycusis (high-frequency hearing loss), decreased skin elasticity and subcutaneous fat, slower reaction time and processing speed (with intact intelligence), decreased bladder capacity with nocturia, reduced thirst perception, decreased gastric acid and hepatic/renal clearance (the pharmacology consequence: start low, go slow), and shorter, lighter sleep.

Everything on the pathology side gets a workup, never a shrug: confusion and disorientation (delirium until proven otherwise — hunt infection, medications, hypoxia, retention, impaction), incontinence (always investigable), depression (not a normal feature of age, and frequently masquerading as cognitive decline — pseudodementia), and falls (a syndrome with causes, not an age tax).

Delirium versus dementia versus depression is a permanent exam fixture: delirium is acute in onset, fluctuating through the day, with impaired attention and often altered consciousness — and it is reversible when the cause is treated. Dementia is insidious and progressive with attention relatively spared early. Depression brings "I don't know" answers, poor effort, and vegetative signs. An acute change on top of chronic dementia is delirium until proven otherwise, and the first-line response is finding the cause — not sedating the behavior.`,
    },
  ],
  keyTakeaways: [
    `Motor anchors: rolls/sits-supported at 6 mo, pincer at 9-10 mo, walks ~12 mo; weight doubles by 6 mo, triples by 12.`,
    `Erikson ladder: trust → autonomy → initiative → industry → identity, matched to infant → toddler → preschool → school-age → adolescent.`,
    `Live vaccines (MMR, varicella): 12-15 months, contraindicated in pregnancy and immunocompromise.`,
    `Normal aging never includes confusion, incontinence, or depression — those get workups.`,
    `Acute, fluctuating confusion with impaired attention = delirium: find the cause before treating the behavior.`,
  ],
},

nx_maternal_newborn: {
  topicId: 'nx_maternal_newborn',
  title: `Maternal & Newborn Care`,
  domainWeight: 'Health Promotion & Maintenance (6-12%)',
  overview: `Obstetric items cluster around a few high-stakes recognitions: the fetal monitor patterns that demand action, the labor and postpartum findings that separate expected from emergency, and the newborn transitions that are normal at hour 12 but alarming at day 3. The volume of memorizable detail is real but bounded — these anchors cover most of what the exam asks.`,
  sections: [
    {
      id: 'mat-antepartum',
      title: `1. Antepartum Essentials`,
      content: `Prenatal care anchors: folic acid 400 mcg daily starting BEFORE conception (the neural tube closes by week 4, often before the first missed period is investigated); no alcohol in any amount; expected weight gain about 25-35 lb for normal BMI; and the standard visit rhythm of monthly to 28 weeks, biweekly to 36, weekly to birth.

The danger signs that end a "which finding requires immediate report" stem: any vaginal bleeding, severe continuous headache with visual changes or epigastric pain (preeclampsia trio), sudden facial/hand edema, decreased fetal movement after quickening (16-20 weeks), fever, and gush or steady leak of fluid before term.

Preeclampsia deserves its own anchor set: new hypertension (≥140/90 twice, four hours apart) after 20 weeks plus proteinuria or end-organ signs. Severe features include BP ≥160/110, persistent headache, visual disturbance, epigastric/RUQ pain, and rising creatinine or falling platelets. Magnesium sulfate is the seizure prophylaxis, and its toxicity sequence — lost deep tendon reflexes first, then respiratory depression under 12/min, then cardiac effects — with calcium gluconate as the antidote and hourly urine output monitoring (magnesium exits by kidney) is among the most retested medication clusters on the exam.

Supine hypotension rounds out the basics: after mid-pregnancy, lying flat lets the uterus compress the vena cava; the position for nearly everything is left lateral.`,
      examTip: `Magnesium sulfate items: absent DTRs come BEFORE respiratory depression. A stem reporting lost reflexes is the early warning to act on — stop the infusion, assess respirations, have calcium gluconate ready.`,
    },
    {
      id: 'mat-labor-monitoring',
      title: `2. Labor and Fetal Monitoring`,
      content: `Fetal heart rate interpretation compresses to VEAL CHOP: Variable decelerations = Cord compression; Early decelerations = Head compression (benign, mirror contractions); Accelerations = Okay; Late decelerations = Placental insufficiency. Baseline is 110-160; moderate variability is the single best indicator of fetal well-being.

Early decelerations require nothing. Variables get position changes first (shifting the cord), then oxygen and further steps if recurrent. Lates trigger the intrauterine resuscitation bundle in one motion: stop any oxytocin, turn to the left side, open IV fluids, apply oxygen at 8-10 L by non-rebreather, and notify the provider. A prolonged deceleration or bradycardia after membrane rupture adds one more reflex: check for cord prolapse — and if the cord is palpable, lift the presenting part off it with a gloved hand, knee-chest or deep Trendelenburg position, call for emergency delivery, and never attempt to push the cord back.

Labor stages in one line each: first stage runs from onset to full dilation (latent to 6 cm, active 6-10 with expected progress); second stage is pushing to birth; third is placenta (up to 30 minutes); fourth is the first hours of recovery where hemorrhage risk peaks. Oxytocin augmentation carries the tachysystole rule: more than 5 contractions in 10 minutes averaged over 30, or contractions lasting over 2 minutes or closer than 1 minute apart, means stop the infusion and resuscitate as for lates.`,
      importantNote: `Cord prolapse is a hands-on emergency: the ONLY correct first actions are relieving pressure off the cord and repositioning — everything else (including notifying) happens while doing so, and replacing the cord is never an option.`,
    },
    {
      id: 'mat-postpartum-newborn',
      title: `3. Postpartum and the Newborn`,
      content: `The postpartum uterus is a predictable object: immediately after birth the fundus sits midline near the umbilicus, firm as a grapefruit, descending about one fingerbreadth per day. Boggy and midline = massage first, then oxytocics as prescribed. Firm but deviated right = full bladder; empty it (the bladder is the most common cause of uterine displacement and early hemorrhage). Lochia runs rubra (red, days 1-3), serosa (pink-brown, to ~day 10), alba (white-yellow, weeks); saturating a pad in 15 minutes or passing large clots is hemorrhage until proven otherwise.

Postpartum hemorrhage's two big causes: uterine atony (the boggy fundus — massage, empty bladder, oxytocin) and retained fragments or lacerations (firm fundus with continued bright bleeding — provider now). The classic vital-sign trap: a healthy postpartum woman compensates, so tachycardia may be the ONLY early sign before pressure falls.

Newborn anchors: Apgar at 1 and 5 minutes (7-10 reassuring); normal vitals roughly HR 110-160, RR 30-60 with brief periodic pauses; glucose checks for the at-risk (infants of diabetic mothers, small or large for gestational age) with jitteriness as the signature hypoglycemia cue. Normal-but-alarming-to-parents findings: acrocyanosis in the first day or two, milia, erythema toxicum, molding, vernix, and weight loss up to about 7-10% regaining by two weeks. Never normal: central cyanosis, grunting/flaring/retracting (respiratory distress triad), jaundice in the FIRST 24 hours (pathologic — think hemolysis), and temperature instability. Safe-sleep teaching is unbendable: supine, alone, in a bare crib — and the newborn goes home in a rear-facing car seat.`,
    },
  ],
  keyTakeaways: [
    `VEAL CHOP; lates = stop oxytocin, left side, fluids, O₂, notify — in one motion.`,
    `Cord prolapse: lift the presenting part off the cord and reposition; never replace the cord.`,
    `Magnesium toxicity order: reflexes gone → respirations down → cardiac; antidote calcium gluconate.`,
    `Boggy midline fundus → massage; firm but deviated → empty the bladder; pad/15 min → hemorrhage.`,
    `Jaundice in the first 24 hours is pathologic; acrocyanosis on day one is normal; central cyanosis never is.`,
  ],
},

nx_therapeutic_comm: {
  topicId: 'nx_therapeutic_comm',
  title: `Therapeutic Communication & Mental Health`,
  domainWeight: 'Psychosocial Integrity (6-12%)',
  overview: `Psychosocial items reward a consistent stance: acknowledge the feeling, invite the story, never argue with an emotion, and never promise what you cannot deliver. Layered on top are the emergencies with fixed protocols — suicide risk, withdrawal syndromes, abuse — where the exam expects direct assessment and mandatory action, not gentle deferral.`,
  sections: [
    {
      id: 'psy-therapeutic-blocks',
      title: `1. Therapeutic Techniques and Their Opposites`,
      content: `The therapeutic toolbox is short: open-ended questions ("What was that like?"), reflection and restatement ("You feel the treatments aren't helping"), clarification, silence that leaves room, offering self ("I'll sit with you"), and focusing. Each one hands the conversation back to the client.

The non-therapeutic list is what the exam actually tests, because the wrong answers are built from it: false reassurance ("everything will be fine"), giving advice ("if I were you..."), asking "why" (demands justification, produces defensiveness), changing the subject, minimizing ("lots of people go through this"), approval/disapproval framing, and asking closed questions when the moment needs open ones.

The recognition rule: the correct response usually restates or explores the client's expressed feeling, and usually looks less "helpful" than the distractors. When a client says "I'm afraid I'm dying," the answer that scores is "Tell me more about what you're afraid of" — not the option that fixes, soothes, or deflects. One consistent exception: direct, closed questioning is CORRECT for suicide assessment, where specificity is the point.`,
      examTip: `Cross out every option containing "don't worry," "why," or advice before weighing what remains. Most psychosocial items resolve by elimination of the four classic blocks.`,
    },
    {
      id: 'psy-suicide-crisis',
      title: `2. Suicide Risk and Crisis`,
      content: `Any statement of hopelessness, burden ("everyone would be better off without me"), or farewell behavior (giving away possessions, sudden calm after depression) triggers direct assessment: "Are you thinking about killing yourself?" Asking does not plant the idea — it is the only way to measure plan, means, and intent, which together grade the risk. A specific plan with available means and stated intent is the highest tier and requires continuous one-to-one observation, an environment stripped of means (cords, sharps, glass, plastic bags), and removal to safety. Fifteen-minute checks are for lower risk; no-suicide contracts have no evidence and never substitute for observation.

The "sudden improvement" pattern deserves its own flag: a severely depressed client who becomes bright and energized may have resolved ambivalence by deciding to die — energy plus a plan is more dangerous than despair without one.

Crisis intervention outside suicide follows the same skeleton: safety first, then stay present, reduce stimulation, short concrete sentences, and structure. In panic-level anxiety, cognition narrows to the immediate — teaching, reasoning, and problem-solving are physiologically unavailable until arousal falls, which is why "stay with the client and speak simply" beats every insight-oriented option during the attack itself.`,
      importantNote: `Suicide assessment is the one place closed, direct questions are the therapeutic choice. Softening the question ("you're not thinking of hurting yourself, are you?") signals the desired answer and invalidates the assessment.`,
    },
    {
      id: 'psy-withdrawal-abuse',
      title: `3. Withdrawal Syndromes and Abuse`,
      content: `Alcohol withdrawal runs a clock the exam expects you to read: tremor, anxiety, diaphoresis, tachycardia, and hypertension at 6-24 hours after the last drink; peak seizure risk in the first 48; delirium tremens — disorientation, hallucinations, autonomic storm — at 48-72 hours, carrying real mortality. Management is benzodiazepines (dosed by a symptom scale like CIWA), thiamine before or with glucose (Wernicke prophylaxis), magnesium repletion, and seizure precautions. Opioid withdrawal (yawning, rhinorrhea, cramps, dilated pupils, gooseflesh) is miserable but not lethal; alcohol and benzodiazepine withdrawal can kill — that asymmetry decides several exam answers.

Abuse recognition spans ages: injuries inconsistent with the story, injuries in multiple healing stages, delay in seeking care, a partner or caregiver who answers every question and won't leave, fearfulness toward the caregiver, and in children, fractures or bruises in non-mobile infants and immersion-pattern burns. The nurse's duties are fixed: suspected child or vulnerable-adult abuse is a personal, mandatory report to the protective agency — suspicion suffices, confrontation is contraindicated, and documentation records observations verbatim and factually.

Intimate partner violence screening is universal and PRIVATE: interview alone (imaging trips and procedures are the standard pretexts for separation), ask directly, and if violence is disclosed, assess immediate danger and offer a safety plan. The client who is not ready to leave still gets resources and an unshaken alliance — leaving is a process, and the highest-risk window is precisely when the victim leaves.`,
    },
  ],
  keyTakeaways: [
    `Therapeutic = reflect, open, clarify, stay; the four classic blocks (reassure, advise, "why," deflect) mark wrong options.`,
    `Suicidal cues get the direct question; plan + means + intent = one-to-one observation, means removed.`,
    `Alcohol withdrawal timeline: 6-24 h tremor/autonomic, 48 h seizures, 48-72 h DTs; benzodiazepines + thiamine.`,
    `Abuse suspicion = mandatory personal report; document verbatim facts; never confront the suspected abuser.`,
    `IPV screening happens alone — never with the partner present.`,
  ],
},

nx_basic_care: {
  topicId: 'nx_basic_care',
  title: `Mobility, Nutrition & Elimination`,
  domainWeight: 'Basic Care & Comfort (6-12%)',
  overview: `Basic Care & Comfort is the mechanics of daily nursing: how a body is positioned, moved, fed, and kept intact. The category's exam presence is small but its items are refreshingly concrete — a cane on the correct side, a diet tray with the right items, a pressure injury staged accurately. These are the questions you should bank.`,
  sections: [
    {
      id: 'bcc-mobility-devices',
      title: `1. Positioning and Assistive Devices`,
      content: `Assistive-device rules compress into mnemonics that survive test-day stress. Cane: COAL — Cane Opposite Affected Leg, advancing with the weak leg so they share the load; the top of the cane meets the wrist crease with the elbow flexed 15-30 degrees. Walker: wall-to-walker sequence — move the walker, then the weaker leg, then the stronger; never carry it up stairs. Crutches: weight on the HANDS, never the axillae (radial nerve palsy); two to three fingerwidths between axilla and crutch pad; stairs run "up with the good, down with the bad" — the strong leg leads ascending, crutches and injured leg lead descending.

Positioning by purpose: high-Fowler's for dyspnea and meals; semi-Fowler's 30 degrees for enteral feedings and increased intracranial pressure; left lateral for the pregnant client and for enema administration (Sims'); supine flat post-lumbar-puncture per protocol; prone rarely but memorably for post-amputation hip-flexion-contracture prevention (several sessions daily after above-knee amputation); and the 30-degree lateral incline — not a full 90-degree side-lying on the trochanter — for pressure redistribution.

Hip precautions after posterior arthroplasty: no flexion past 90 degrees, no adduction past midline, no internal rotation — operationalized as a raised toilet seat, an abduction pillow between the knees, and no crossing legs or bending to tie shoes.`,
      examTip: `Device items are pure recall — bank them in seconds. COAL, wall-to-walker, up-with-the-good, hands-not-axillae. Spend your time on the judgment items instead.`,
    },
    {
      id: 'bcc-skin-wounds',
      title: `2. Pressure Injuries: Staging and Prevention`,
      content: `Staging is anatomy: Stage 1 is intact skin with non-blanchable erythema. Stage 2 is partial-thickness loss — a shallow open wound with a red-pink viable bed, or an intact/ruptured serum-filled blister, with NO slough and NO fat visible. Stage 3 is full-thickness into subcutaneous fat (possibly with slough, undermining, tunneling) but no bone, tendon, or muscle. Stage 4 exposes bone, tendon, or muscle. Unstageable means the base is obscured by slough or eschar — you cannot stage what you cannot see. Deep-tissue injury is the purple-maroon intact-skin lesion from shear over bone.

Two staging rules the exam checks: staging never runs backward (a healing Stage 3 is a "healing Stage 3," not a Stage 2), and stable dry eschar on heels is generally left intact.

Prevention is a bundle: risk scoring (Braden — lower is worse, ≤18 flags risk), repositioning about every 2 hours in bed and every hour seated (with weight shifts every 15 minutes for the able), the 30-degree lateral position, heels floated on pillows, head-of-bed at or below 30 degrees where tolerated to limit shear, moisture management, nutrition with adequate protein, and NEVER massaging reddened bony prominences or using donut cushions — both concentrate the damage they claim to prevent.`,
      importantNote: `"Non-blanchable" is the Stage 1 keyword and "slough/eschar obscuring the base" is the unstageable keyword. Most staging distractors hinge on exactly one such keyword.`,
    },
    {
      id: 'bcc-nutrition-elimination',
      title: `3. Diets, Tubes, and Elimination`,
      content: `Therapeutic diets by memorable content: clear liquids are see-through at room temperature (broth, gelatin, pulp-free juice, black coffee, popsicles); full liquids add dairy and anything pourable; mechanical soft and pureed track chewing and swallowing ability. Disease pairings: renal diets restrict potassium, phosphorus, and sodium (the potassium bombs — bananas, oranges, potatoes, tomatoes, spinach, avocados — are the tested list); heart failure restricts sodium and often fluids; celiac excludes wheat, barley, and rye (BROW: barley, rye, oats-if-contaminated, wheat); and dysphagia diets thicken liquids per the swallow evaluation, with aspiration precautions — upright for meals and 30-60 minutes after, chin tuck, small bites, no straws.

Enteral tubes: initial placement of any blindly inserted feeding tube is verified by X-ray, full stop. Ongoing checks pair aspirate pH (gastric ≤5) with external length marking; auscultating an air bolus is obsolete. Feeding position is head-of-bed ≥30 degrees during and 30-60 minutes after; residuals are checked per policy and feeds are not reflexively held for modest volumes under current practice.

Elimination anchors: for constipation, fiber, fluids, and activity precede laxatives, and impaction presents as paradoxical liquid seepage around a mass. Urinary retention is confirmed by bladder scan before catheterization. And every indwelling catheter carries the CAUTI bundle: closed system, bag below the bladder and off the floor, no dependent loops, secured to the thigh, and a daily challenge to remove it.`,
    },
  ],
  keyTakeaways: [
    `COAL; walker-then-weak-leg; up with the good, down with the bad; weight on hands, never axillae.`,
    `Stage 2 = partial-thickness, no slough; Stage 3 = fat; Stage 4 = bone/tendon/muscle; obscured base = unstageable.`,
    `Never massage red bony prominences; float heels; 30-degree lateral; Braden ≤18 = at risk.`,
    `New feeding tube = X-ray before use; ongoing checks = pH ≤5 + external length; HOB ≥30° for feeds.`,
    `Renal diet cuts K⁺/phosphorus/sodium — bananas, oranges, potatoes, tomatoes, spinach are the flag foods.`,
  ],
},

nx_dosage_calc: {
  topicId: 'nx_dosage_calc',
  title: `Dosage Calculation & Med Math`,
  domainWeight: 'Pharmacological & Parenteral Therapies (13-19%)',
  overview: `Every dosage problem on the exam is one of about ten shapes, and every shape yields to the same method: write what is ordered, write what is on hand, keep the units visible, and let them cancel. Nursing programs commonly require 90-100% on dosage exams because a misplaced decimal is a patient injury — the calculations here are worked in full, no shortcuts, and our practice bank's answer keys are machine-verified through two independent computation paths.`,
  sections: [
    {
      id: 'dose-foundations',
      title: `1. The Method and the Conversions`,
      content: `Dimensional analysis is the single method that solves every problem type: start with what you want to find, multiply by conversion fractions arranged so unwanted units cancel, and read the answer with its unit attached. The alternative formula — desired over have times vehicle (D/H × V) — is fine for simple problems, but dimensional analysis scales to multi-step infusions where D/H×V users get lost.

The conversion table is short: 1 g = 1,000 mg; 1 mg = 1,000 mcg; 1 kg = 2.2 lb; 1 L = 1,000 mL; 1 tsp = 5 mL; 1 tbsp = 15 mL; 1 oz = 30 mL. Metric conversions move the decimal three places — and direction errors are the fatal ones. 125 mcg = 0.125 mg: moving the decimal the wrong way produces a 1,000-fold error, and with drugs like digoxin or levothyroxine that error is a lethal dose. When in doubt, sanity-check magnitude: micro is smaller, so the mcg number must be BIGGER than the mg number for the same dose.

Rounding rules the exam expects: drops and pump rates round to whole numbers (you cannot program half a drop); milliliters round to the nearest tenth (hundredth for volumes under 1 mL in high-precision settings); weight-based doses keep a sensible decimal; and rounding happens ONCE, at the end — carrying rounded intermediates through a multi-step problem compounds the error.

Formatting rules that prevent tenfold errors: always a leading zero (0.5 mg, never .5 mg), never a trailing zero (5 mg, never 5.0 mg).`,
      examTip: `Before computing anything, convert the weight and match the units of ordered dose and on-hand concentration. Nearly every distractor is one skipped conversion.`,
    },
    {
      id: 'dose-core-families',
      title: `2. Tablets, Liquids, and Weight-Based Doses`,
      content: `Tablets and capsules: divide ordered dose by tablet strength. Levothyroxine 0.075 mg ordered, 25 mcg tablets on hand: convert first (0.075 mg = 75 mcg), then 75 ÷ 25 = 3 tablets. An answer of half a tablet is plausible only for scored tablets; an answer of 6 tablets should trigger a recheck — real answers are usually ½ to 3.

Oral liquids: desired ÷ have × vehicle volume. Amoxicillin 375 mg ordered from a 250 mg/5 mL suspension: (375 ÷ 250) × 5 = 7.5 mL. The classic error is reporting the bare ratio (1.5) and dropping the "per 5 mL."

Weight-based dosing: convert pounds to kilograms FIRST (divide by 2.2), then multiply by the mg/kg order. A 22-lb toddler ordered acetaminophen 15 mg/kg: 22 ÷ 2.2 = 10 kg; 15 × 10 = 150 mg. The distractor built from 15 × 22 = 330 mg is sitting in the options waiting for the skipped conversion — and it is a supratherapeutic dose.

Safe-dose-range problems add a judgment layer: compute the low and high acceptable doses from the range and the child's weight, then compare the order. Amoxicillin 50 mg/kg/DAY divided every 12 hours for a 16-kg child: 800 mg/day maximum, 400 mg/dose. An order for 500 mg/dose exceeds the safe single dose even though 500 < 800 — the per-day versus per-dose distinction IS the question, every time it appears.`,
      importantNote: `Read the order's denominator: mg/kg/DOSE and mg/kg/DAY differ by the number of daily doses. The exam plants the daily total among the options for per-dose questions.`,
    },
    {
      id: 'dose-iv-calculations',
      title: `3. IV Rates, Drips, and Critical-Care Math`,
      content: `Pump rate (mL/hr): volume ÷ hours. 1,000 mL over 8 hours = 125 mL/hr. Infusion time reverses it: volume ÷ rate = hours (1,000 mL at 80 mL/hr = 12.5 hours — useful for anticipating the next bag).

Gravity drip rate (gtt/min): volume in mL × drop factor (gtt/mL) ÷ time in MINUTES. 100 mL antibiotic over 30 minutes with 10 gtt/mL tubing: (100 × 10) ÷ 30 = 33 gtt/min. Microdrip tubing (60 gtt/mL) has a shortcut worth knowing: gtt/min equals mL/hr numerically, because the 60s cancel.

Reconstitution: the concentration that matters is the one AFTER adding the labeled diluent volume — printed on the vial for that volume — not the powder mass. Cefazolin reconstituted to 225 mg/mL with 750 mg ordered: 750 ÷ 225 = 3.3 mL.

Critical-care infusions chain three steps; write each one. Dopamine at 5 mcg/kg/min for an 80-kg client from a 400 mg/250 mL bag: dose = 5 × 80 = 400 mcg/min = 24 mg/hr (× 60 ÷ 1,000 — the mcg-to-mg step is where this calculation dies); concentration = 400 ÷ 250 = 1.6 mg/mL; rate = 24 ÷ 1.6 = 15 mL/hr. Heparin protocols run the same chain without the unit conversion: 18 units/kg/hr × 70 kg = 1,260 units/hr; bag concentration 25,000 units/250 mL = 100 units/mL; rate = 12.6 → 13 mL/hr — then verify against protocol maximums and with a second nurse, because heparin errors are never small errors.`,
    },
  ],
  keyTakeaways: [
    `One method — dimensional analysis with visible unit cancellation — solves every problem family.`,
    `Convert weight and match units BEFORE computing; most distractors are one skipped conversion.`,
    `mg/kg/DOSE vs mg/kg/DAY: the per-day total is always planted among the per-dose options.`,
    `gtt/min = (mL × drop factor) ÷ minutes; with microdrip (60 gtt/mL), gtt/min = mL/hr.`,
    `Critical-care chain: dose per minute → per hour → mg → ÷ concentration → mL/hr; write every step.`,
    `Leading zeros always (0.5), trailing zeros never (5.0) — the notation rules exist to stop tenfold errors.`,
  ],
},

nx_pharm_principles: {
  topicId: 'nx_pharm_principles',
  title: `Pharmacology Principles & High-Alert Meds`,
  domainWeight: 'Pharmacological & Parenteral Therapies (13-19%)',
  overview: `The exam cannot ask you every drug, so it asks prototypes, patterns, and the short list of medications that kill when mishandled. Learn drug classes by their signature assessment (what you check before giving), signature toxicity (what you watch for after), and antidote — and recognize the high-alert list, where policy adds a second pair of eyes.`,
  sections: [
    {
      id: 'pharm-cardiac',
      title: `1. Cardiovascular Prototypes`,
      content: `Digoxin: check the apical pulse a full minute (hold below 60 adult), monitor the level (therapeutic ~0.5-2.0 ng/mL) and potassium — hypokalemia potentiates toxicity at ANY level. Toxicity announces itself with anorexia, nausea, and visual changes (halos, yellow-green tint), then dysrhythmias; the antidote is digoxin immune Fab.

Beta blockers (-olol): hold parameters for bradycardia and hypotension; mask hypoglycemia's adrenergic warning signs (a diabetic teaching point); never stop abruptly (rebound tachycardia and ischemia). ACE inhibitors (-pril): dry cough is the common nuisance, angioedema the emergency, hyperkalemia the lab effect — no potassium-based salt substitutes. ARBs (-sartan) share the potassium caution without the cough.

Anticoagulant pairs are permanent exam material. Warfarin: monitored by INR (therapeutic 2-3 for most indications), reversed by vitamin K, interacts with everything (teach CONSISTENT vitamin K intake, not avoidance). Heparin: monitored by aPTT, reversed by protamine sulfate, and watched for heparin-induced thrombocytopenia (platelet drop >50% — stop the drug, no platelet transfusion). Enoxaparin needs no routine monitoring; direct oral anticoagulants mostly none. Antiplatelets (aspirin, clopidogrel) and thrombolytics (-teplase) complete the bleeding family — thrombolytics carry the strictest exclusion screens (recent surgery, stroke history, active bleeding).

Nitroglycerin: sublingual tablets every 5 minutes up to three doses with EMS activated per current protocols if pain persists after the first; burning under the tongue is expected; headache is expected; hypotension contraindicates — and combining with phosphodiesterase inhibitors (sildenafil) can be fatal.`,
      examTip: `Antidote pairs to bank: warfarin/vitamin K, heparin/protamine, digoxin/Fab, opioid/naloxone, benzodiazepine/flumazenil, acetaminophen/acetylcysteine, magnesium/calcium gluconate, iron/deferoxamine.`,
    },
    {
      id: 'pharm-endocrine-neuro',
      title: `2. Endocrine, Psych, and the Level-Monitored Drugs`,
      content: `Insulin timing is the testable core: rapid analogs (lispro, aspart) onset in ~15 minutes — food must be present or arriving; regular insulin peaks 2-4 hours; NPH peaks roughly 4-12 hours (the mid-afternoon hypoglycemia after a morning dose); glargine and detemir are peakless basals, never mixed in a syringe with anything. When mixing regular and NPH: clear before cloudy. Hypoglycemia treatment follows the 15-15 rule for the conscious client (15 g fast carbohydrate, recheck in 15 minutes); unconscious clients get IV dextrose or IM glucagon — never oral anything.

Levothyroxine: morning, empty stomach, alone; excess presents as hyperthyroidism (tachycardia, heat intolerance, insomnia). Corticosteroids: give with food, never stop abruptly (adrenal crisis), watch glucose, infection masking, and bone loss with long use.

The narrow-therapeutic drugs pair a number with a toxicity picture. Lithium (0.6-1.2 mEq/L): toxicity brings coarse tremor, vomiting, ataxia, confusion; sodium depletion and dehydration raise levels — steady salt and fluid intake is the core teaching. Phenytoin (10-20 mcg/mL): nystagmus, ataxia, gingival hyperplasia (teach oral hygiene). Vancomycin and aminoglycosides: trough levels, nephrotoxicity and ototoxicity, and vancomycin's rate-dependent flushing reaction — slow the infusion to at least 60 minutes.

Psych patterns: SSRIs take 2-4 weeks (energy may return before mood — a suicide-risk window); serotonin syndrome (agitation, hyperthermia, clonus) when serotonergic drugs stack; MAOIs plus tyramine (aged cheese, cured meat, tap beer) = hypertensive crisis; antipsychotics carry extrapyramidal effects and the emergency of neuroleptic malignant syndrome (rigidity, hyperthermia, autonomic instability — stop the drug).`,
      importantNote: `For every level-monitored drug, know three numbers: the range, the toxic threshold, and the lab that travels with it (lithium/sodium, digoxin/potassium, phenytoin/albumin).`,
    },
    {
      id: 'pharm-high-alert',
      title: `3. High-Alert Medications and Administration Rights`,
      content: `The high-alert list — insulin, anticoagulants, opioids, concentrated electrolytes, neuromuscular blockers, chemotherapy — is defined by consequence, not frequency: errors with these drugs maim. Institutional defenses the exam expects you to honor: independent double checks (two nurses, separately, comparing against the order), smart-pump libraries used rather than overridden, insulin drawn only in insulin syringes, and concentrated potassium chloride banished from floor stock and NEVER administered IV push — it stops hearts. IV potassium runs diluted, by pump, at limited rates (commonly ≤10 mEq/hr on a general unit), with the infusion site watched (it burns and blisters).

Opioids add the respiratory-depression discipline: rate and sedation level BEFORE each dose (hold and reassess below ~12/min per policy), naloxone available, and sedation scales trusted over self-report — sedation precedes respiratory arrest.

The rights of administration are the personal layer under all of it: right client (two identifiers, every time), drug, dose, route, time — plus right documentation (after giving, never before), right reason, right response, and the client's right to refuse. Barcode scanning is the rights automated; scanning the label taped to the pump instead of the client's band defeats the system and is the workaround stems are built from. Verbal and telephone orders are read back completely; error-prone abbreviations (U, IU, QD, trailing zeros) are written out.`,
    },
  ],
  keyTakeaways: [
    `Digoxin: apical pulse, level, AND potassium — hypokalemia potentiates toxicity; halos and GI upset announce it.`,
    `Warfarin→INR→vitamin K; heparin→aPTT→protamine. HIT = platelets down >50% = stop heparin.`,
    `Insulin peaks decide hypoglycemia timing: rapid ~1 h, regular 2-4 h, NPH 4-12 h; clear before cloudy.`,
    `Lithium rides sodium; steady salt and fluids. SSRIs lag 2-4 weeks — energy-before-mood is a risk window.`,
    `Concentrated KCl: never floor stock, never IV push. High-alert drugs get independent double checks.`,
  ],
},

nx_iv_therapy: {
  topicId: 'nx_iv_therapy',
  title: `IV Therapy, Blood Products & Parenteral Nutrition`,
  domainWeight: 'Pharmacological & Parenteral Therapies (13-19%)',
  overview: `Parenteral therapy items test three competencies: recognizing an IV complication by its local signature, running a blood transfusion by the unbending protocol, and respecting TPN's metabolic rules. The transfusion-reaction sequence — stop, disconnect, saline, verify, notify — is among the most frequently tested action sequences on the entire exam.`,
  sections: [
    {
      id: 'iv-complications',
      title: `1. Peripheral and Central Line Complications`,
      content: `Peripheral IV complications differentiate by look and feel. Infiltration (fluid in tissue): cool, pale, swollen, sluggish — stop, remove, elevate. Extravasation is infiltration with a vesicant (chemotherapy, vasopressors, concentrated electrolytes): stop immediately, leave the catheter for antidote administration per protocol, notify. Phlebitis (vein inflammation): warm, red, tender cord along the vein — remove, warm compress, restart elsewhere, and phlebitis (not infiltration) is graded on the visual scales. Local infection adds purulence and fever; thrombosis adds a palpable cord with sluggish flow.

Central lines raise the stakes. Insertion and removal share the air-embolism discipline: for removal, position supine or Trendelenburg, have the client perform Valsalva (bear down) during withdrawal, apply an occlusive — classically petroleum-gauze — dressing, and keep the client flat briefly after. Suspected air embolism (sudden dyspnea, chest pain, "mill-wheel" murmur) = clamp the line, LEFT lateral Trendelenburg (trapping air in the right ventricle apex), oxygen, call for help.

Central line-associated bloodstream infection (CLABSI) prevention is a bundle the exam quotes: hand hygiene, maximal barrier precautions at insertion, chlorhexidine skin antisepsis, "scrub the hub" (15 seconds, friction) before every access, dressing changes per protocol with sterile technique, and a daily review of line necessity — the safest line is the one removed.`,
      examTip: `Infiltration is COOL and pale; phlebitis is WARM and red. One temperature word in the stem usually decides the answer.`,
    },
    {
      id: 'iv-transfusions',
      title: `2. Blood Products and Transfusion Reactions`,
      content: `The transfusion protocol is rigid because the failure mode is fatal. Before: type and crossmatch, consent, large-enough gauge (traditionally 18-20 for adults), and NORMAL SALINE ONLY as the companion fluid — dextrose hemolyzes red cells, lactated Ringer's clots them. Verification is two licensed staff at the bedside comparing client, product, and numbers. Baseline vitals; then stay with the client for the first 15 minutes at a slow rate — the window in which acute hemolytic reactions declare themselves. Vitals per policy throughout; the unit infuses within 4 hours of leaving the blood bank.

Every suspected reaction begins identically: STOP the transfusion, disconnect the tubing at the hub and run new saline through NEW tubing (keeping the vein open without pushing more product), reverify identifiers, assess, notify the provider and blood bank, and return the unit and tubing to the bank. Then differentiate: acute hemolytic (fever, chills, flank pain, hypotension, red-brown urine — the ABO catastrophe) gets vigorous saline and urine output monitoring; febrile non-hemolytic (fever/chills without hemolysis signs) gets antipyretics; mild allergic (urticaria, itching) gets antihistamine and possibly a physician-approved restart — the only reaction where restart is even discussed; anaphylactic gets epinephrine.

Volume-status reactions bookend the set: transfusion-associated circulatory overload (dyspnea, hypertension, JVD, crackles — the heart-failure picture) is managed with upright positioning, oxygen, diuretics, and slower future rates; TRALI (transfusion-related acute lung injury: hypoxemia and bilateral infiltrates WITHOUT overload signs) is a ventilation emergency.`,
      importantNote: `Every transfusion-reaction answer starts with stopping the blood and maintaining the line with fresh saline through new tubing. Any option that keeps the product running — or slows it "to observe" — is wrong.`,
    },
    {
      id: 'iv-tpn',
      title: `3. Total Parenteral Nutrition`,
      content: `TPN is IV food concentrated beyond what a peripheral vein tolerates: solutions above roughly 10% dextrose require a central line. Its rules are metabolic. Glucose monitoring is scheduled (commonly every 4-6 hours initially) because the infusion is a continuous carbohydrate load; rates ramp up and taper down gradually, because abrupt cessation invites rebound hypoglycemia. If a bag runs dry and the next is unavailable, hang dextrose 10% at the same rate — never plain saline, never nothing.

The line and the formula are single-purpose: no medications, no blood draws, no piggybacks through the TPN lumen; lipids either run separately or arrive premixed as a 3-in-1. Bags and tubing change per protocol (bag typically every 24 hours, lipid-containing tubing on the stricter schedule) because the formula is a culture medium — which is also why refrigerated bags warm to room temperature before hanging and why a cracked, oily-looking, or precipitated bag goes back to pharmacy.

Monitoring beyond glucose: daily weights (the honest measure of nutrition and fluid), intake and output, electrolytes and liver panels per protocol, and vigilance for refeeding syndrome in the chronically malnourished — the phosphate, potassium, and magnesium crash as insulin surges with reintroduced carbohydrate. Infection surveillance never stops: the combination of a central line and sugar-rich fluid makes CLABSI the signature TPN complication, and unexplained fever in a TPN client points at the line first.`,
    },
  ],
  keyTakeaways: [
    `Infiltration = cool/pale (stop, remove, elevate); phlebitis = warm/red cord; vesicant extravasation = stop, keep the catheter for antidote.`,
    `Blood runs with saline only, double-verified at the bedside; stay the first 15 minutes.`,
    `Any reaction: stop → new tubing + saline → reverify → assess → notify → return the unit.`,
    `TACO looks like heart failure (overload); TRALI is hypoxemia without overload — both stop the transfusion.`,
    `TPN: central line for high dextrose, scheduled glucose checks, D10W if the bag runs out, nothing else in the lumen.`,
  ],
},

nx_lab_values: {
  topicId: 'nx_lab_values',
  title: `Laboratory Values & Diagnostics`,
  domainWeight: 'Reduction of Risk Potential (10-16%)',
  overview: `The exam expects a compact table of reference ranges and — more importantly — the nursing action attached to each critical deviation. A lab value on the NCLEX is never trivia: it is a cue demanding recognition (is this normal?), analysis (what does it threaten?), and action (monitor what, hold what, call whom?).`,
  sections: [
    {
      id: 'lab-electrolytes-metabolic',
      title: `1. Electrolytes and Metabolic Panels`,
      content: `The ranges to know cold: sodium 135-145 mEq/L; potassium 3.5-5.0; calcium ~9-10.5 mg/dL; magnesium 1.5-2.5 mEq/L (institutional ranges vary slightly); phosphorus 2.5-4.5 mg/dL; chloride 96-106; glucose fasting 70-99 mg/dL (diabetes diagnosed at ≥126 fasting or A1c ≥6.5%; A1c target for most treated diabetics <7%).

Renal function: BUN 10-20 mg/dL, creatinine ~0.6-1.2 mg/dL — creatinine is the kidney number; BUN rises with dehydration, GI bleeding, and steroids independent of kidneys. A rising creatinine flags dose adjustments for renally cleared drugs and gates nephrotoxic exposures: metformin around iodinated contrast, aminoglycosides, vancomycin trough monitoring.

The action layer decides exam answers. Potassium below 3.0 or above 6.0: cardiac monitor, provider, and (high) prepare calcium gluconate for membrane protection, insulin-with-dextrose to shift, and definitive removal — while remembering IV potassium replacement is NEVER pushed. Sodium below 120: seizure precautions, correct SLOWLY (osmotic demyelination). Calcium low after thyroid/parathyroid surgery: Trousseau and Chvostek signs, laryngospasm watch, calcium gluconate at the bedside. Magnesium low: often travels with low potassium and calcium — replete magnesium first or potassium will not hold.`,
      examTip: `For any electrolyte item, the wrong answers usually treat the number; the right answer usually protects the client (monitor, precautions, hold the drug) while the number is corrected per prescription.`,
    },
    {
      id: 'lab-heme-coag',
      title: `2. Hematology and Coagulation`,
      content: `Complete blood count anchors: hemoglobin ~12-16 g/dL women, 14-18 men (transfusion conversations typically begin below 7-8 in stable clients); hematocrit roughly three times the hemoglobin; platelets 150,000-400,000/mm³; WBC 5,000-10,000/mm³.

Platelet action thresholds: below ~50,000 = bleeding precautions (soft toothbrush, electric razor, no IM injections, no rectal anything, pressure ≥5 minutes after punctures); below ~20,000 = spontaneous bleeding risk — neuro checks for intracranial bleeding, provider notification, anticipated transfusion.

Neutropenia is the infection mirror: absolute neutrophil count below 1,000 (severe below 500) = protective precautions — private room, meticulous hand hygiene, no fresh flowers or standing water, screen visitors, avoid invasive procedures — and any single fever ≥38.3°C (101°F) or sustained ≥38°C is neutropenic fever, an oncologic EMERGENCY: cultures and broad-spectrum antibiotics within the hour, not routine follow-up.

Coagulation pairs: PT/INR monitors warfarin (therapeutic INR 2-3; above ~4.5-5 hold and expect vitamin K); aPTT monitors heparin (therapeutic commonly 1.5-2.5 × control; markedly high = stop infusion per protocol, protamine available). D-dimer rules OUT clot when negative but proves nothing when positive. Troponin is the cardiac injury marker (rises within hours, stays days); BNP tracks heart-failure severity — the two "which lab confirms" favorites.`,
      importantNote: `Neutropenic fever rewrites priorities: a temperature that would be "recheck in an hour" in anyone else is cultures-and-antibiotics-now in the client with an ANC under 500.`,
    },
    {
      id: 'lab-procedures',
      title: `3. Diagnostics: Before, During, After`,
      content: `Procedure questions test the checklists at the edges. Iodinated contrast studies (CT with contrast, angiography): screen for prior contrast reactions and shellfish-allergy folklore (true predictor is prior reaction), check creatinine, hold metformin per protocol around contrast, and push fluids after to clear the dye.

Cardiac catheterization (femoral): afterward, it is the site and the distal limb — pressure device or manual pressure, leg straight, bedrest per protocol, and scheduled checks of the puncture site plus pedal pulses, color, and warmth. A rapidly expanding groin swelling is arterial bleeding: direct pressure and a stat call, in that order.

Paracentesis and thoracentesis: void first (paracentesis — a full bladder is a puncture target), position (upright leaning over a table for thoracentesis), and afterward watch for the specific failure — hypotension after large-volume paracentesis, pneumothorax after thoracentesis (dyspnea, unilateral diminished sounds, falling saturation).

Lumbar puncture: post-procedure flat positioning per protocol and fluids for the spinal headache. Liver biopsy: right side-lying afterward, pressing the puncture against the mattress, with vital signs on a hemorrhage schedule — the liver is a vascular organ and bleeding is THE complication. Endoscopy with sedation: NPO until the gag reflex returns, full stop — the most tested single line in procedure care. And for any sedated or invasive procedure, informed consent precedes premedication.`,
    },
  ],
  keyTakeaways: [
    `Core ranges: Na 135-145, K 3.5-5.0, Ca 9-10.5, glucose 70-99 fasting, creatinine ~0.6-1.2, platelets 150-400k, WBC 5-10k.`,
    `K⁺ extremes = monitor + provider; IV potassium is never pushed. Na⁺ <120 = seizure precautions, correct slowly.`,
    `Platelets <50k = bleeding precautions; <20k = spontaneous-bleed watch. ANC <500 + fever = emergency antibiotics.`,
    `INR 2-3 on warfarin (K reverses); aPTT 1.5-2.5× control on heparin (protamine reverses).`,
    `Post-endoscopy NPO until gag returns; post-cath check site + distal pulses; post-LP flat + fluids.`,
  ],
},

nx_periop: {
  topicId: 'nx_periop',
  title: `Perioperative & Procedure Care`,
  domainWeight: 'Reduction of Risk Potential (10-16%)',
  overview: `Surgical clients travel a predictable arc, and the exam samples its checkpoints: what must exist before the OR doors (consent, verification, an optimized client), what each post-op day tends to produce (the fever timeline, the complication windows), and the drains, tubes, and devices whose findings you must sort into expected versus emergency.`,
  sections: [
    {
      id: 'periop-preop',
      title: `1. Preoperative: The Gatekeeping Role`,
      content: `The nurse is the last verification layer before surgery. Consent must be signed BEFORE any sedating premedication — a form signed after midazolam is void, the case waits, and the surgeon is notified. The pre-op checklist verifies identity and site (with the universal protocol's site marking and the OR time-out), NPO status per current anesthesia guidance (commonly clear liquids until 2 hours, light meal 6, heavier 8 — "NPO after midnight" survives institutionally but is no longer the physiologic rule), removal of jewelry, dentures, and nail polish per policy, and documented allergies including latex.

Medication reconciliation carries the tested decisions: anticoagulants are typically held on a provider-directed schedule; insulin doses adjust (basal usually reduced, not eliminated — clarify, never guess); beta blockers usually CONTINUE (abrupt cessation risks rebound ischemia); metformin pauses around contrast exposure and per policy.

Pre-op teaching earns its exam weight through the post-op behaviors it enables: incentive spirometry and splinting demonstrated BEFORE surgery (learning through pain is poor pedagogy), turning-coughing-deep-breathing, early ambulation expectations, and honest pain-management plans. The strongest answer to "which client statement indicates effective pre-op teaching" is the one describing a concrete behavior with its reason — "I'll hold a pillow against my incision when I cough so it hurts less."`,
      examTip: `Consent-before-sedation outranks nearly everything else in pre-op stems. Once sedation is in, no signature counts and the correct answer escalates rather than improvises.`,
    },
    {
      id: 'periop-postop-windows',
      title: `2. Postoperative Complication Windows`,
      content: `The post-op fever timeline sorts causes by clock: atelectasis in the first 24-48 hours (low-grade fever, diminished bases — treat with lung expansion: spirometer, deep breathing, ambulation); urinary tract infection around days 3-5 (especially catheterized clients); wound infection days 5-7 (rising incisional pain, erythema, purulence); and deep vein thrombosis anytime from day 3 onward (unilateral calf swelling, warmth — never massage, elevate and anticoagulate per orders).

Airway and circulation own the first hours: post-anesthesia clients are positioned to protect the airway (side-lying if unresponsive without contraindication), monitored for respiratory depression from residual anesthetic and opioids, and warmed (shivering raises oxygen demand). Hemorrhage surveillance includes the sheets UNDER the client — blood tracks by gravity — and the earliest shock signs are tachycardia and restlessness, not the late-falling blood pressure.

Wound catastrophes have a scripted response: dehiscence (edges separate, often heralded by a "giving way" sensation after coughing) and evisceration (organs protrude) mean stay with the client, call for help, cover protruding viscera with STERILE SALINE-MOISTENED gauze — never push anything back — position low-Fowler's with knees flexed to reduce tension, NPO, and prepare for surgery.

Paralytic ileus explains the post-op bowel rules: absent bowel sounds and no flatus are expected briefly; advancing diet waits for gut function; increasing distension with vomiting is the escalation cue. Early ambulation is the single intervention that appears in the correct answer to atelectasis, DVT, AND ileus prevention — when in doubt, walk the client.`,
      importantNote: `Evisceration: sterile saline-moistened gauze over the organs, low-Fowler's with knees bent, NPO, stat call. Every distractor involving reinsertion, dry dressings, or flat positioning is wrong.`,
    },
    {
      id: 'periop-tubes-drains',
      title: `3. Tubes, Drains, and Chest Tubes`,
      content: `Wound drains produce numbers to trend: a Jackson-Pratt or Hemovac is emptied and recompressed (that compression IS the suction), output recorded, and a sudden increase or change to frank blood reported. Nasogastric tubes for decompression stay patent per orders; for any tube, "aspirate looks like coffee grounds" is a GI-bleeding cue, not routine.

Chest drainage systems distill to three chambers and two rules. The water-seal chamber should TIDAL (rise and fall with breathing — proof the system communicates with the pleural space); tidaling stops when the lung re-expands or the tubing kinks. Intermittent bubbling in the water seal accompanies a resolving pneumothorax; CONTINUOUS bubbling means an air leak — trace connections from dressing to device and notify. Gentle continuous bubbling in the suction-CONTROL chamber (wet systems) is normal and merely reflects the suction setting.

The emergencies are scripted: tube disconnects from the system — submerge the tube end in sterile water (a makeshift water seal); tube pulls out of the CHEST — occlusive dressing taped on three sides (the flutter valve that vents air out but not in), call immediately. Clamping is reserved for provider-directed moments (changing the unit, assessing a leak's location briefly) — prolonged clamping of a bubbling tube manufactures a tension pneumothorax. Drainage above institutional thresholds (classically >100 mL/hr of frank blood after chest surgery) is a surgeon call, and the system always rides BELOW chest level with tubing free of dependent loops.`,
    },
  ],
  keyTakeaways: [
    `Fever clock: 24-48 h atelectasis (expand lungs), 3-5 d urine, 5-7 d wound, DVT from day 3 (never massage).`,
    `Earliest hemorrhage signs are tachycardia and restlessness; check beneath the client.`,
    `Evisceration: sterile moist saline gauze, low-Fowler's knees flexed, NPO, surgery.`,
    `Chest tube: tidaling normal; continuous water-seal bubbling = air leak; out of chest = 3-sided occlusive dressing.`,
    `Ambulation is the triple-preventer: atelectasis, DVT, and ileus.`,
  ],
},

nx_fluid_electrolyte: {
  topicId: 'nx_fluid_electrolyte',
  title: `Fluids, Electrolytes & Acid-Base`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `This is the exam's physiology core: six electrolytes with signature presentations, a three-step blood-gas method that never fails, and IV fluids sorted by tonicity. The items reward pattern recognition — peaked T waves, Trousseau's sign, Kussmaul respirations — attached to an immediate protective action.`,
  sections: [
    {
      id: 'fe-volume-fluids',
      title: `1. Volume Status and IV Fluids`,
      content: `Fluid volume deficit reads as: thirst, dry mucosa, poor turgor (unreliable in the elderly — use tongue furrows and orthostatics instead), tachycardia, orthostatic hypotension, concentrated urine, rising BUN out of proportion to creatinine, and acute weight LOSS. Fluid volume excess reads as: crackles, dyspnea, JVD, bounding pulses, edema, and acute weight GAIN — and daily weight is the single most sensitive bedside measure of fluid balance (1 kg ≈ 1 L). Same scale, same time, same clothing; a gain of more than about 1 kg overnight or 2.3 kg (5 lb) in a week is a report-now finding in heart failure teaching.

IV fluids sort by tonicity. Isotonic (0.9% NaCl, lactated Ringer's, D5W-in-the-bag) expands the vascular space: resuscitation, maintenance. (D5W behaves hypotonically once the dextrose metabolizes — it has no place in resuscitation or with intracranial pressure concerns.) Hypotonic (0.45% NaCl) hydrates cells: cellular dehydration, hypernatremia — but never for clients at risk of cerebral edema. Hypertonic (3% NaCl, D10W) pulls water out of cells: reserved, pump-controlled, and in 3% saline's case central-line-preferred with serial sodiums and neuro checks.

The transfusion-adjacent rule repeats here because it decides answers: sodium corrections run SLOW in both directions. Overcorrecting chronic hyponatremia causes osmotic demyelination; overcorrecting hypernatremia causes cerebral edema. Brains adapt to chronic tonicity, and the exam expects you to protect that adaptation.`,
      examTip: `When two options both address volume, prefer the one anchored in daily weight or a trend, not a single reading. Weights beat estimates; trends beat snapshots.`,
    },
    {
      id: 'fe-electrolytes',
      title: `2. The Six Electrolytes by Signature`,
      content: `Potassium (3.5-5.0): LOW — muscle weakness, cramps, flat T waves and U waves, dysrhythmias, and it potentiates digoxin toxicity; replace orally or by DILUTED pump infusion (never push). HIGH — muscle weakness progressing to paralysis, peaked T waves then widened QRS; protect the heart with calcium gluconate, shift with insulin-dextrose, remove with dialysis or binders. Both directions: continuous cardiac monitoring.

Sodium (135-145): LOW — confusion, headache, seizures as water shifts into brain cells; seizure precautions, fluid restriction for dilutional causes, slow correction. HIGH — thirst, dry sticky mucosa, agitation to coma; slow water replacement.

Calcium (9-10.5): LOW — the excitable picture: paresthesias, Trousseau's (BP-cuff carpal spasm) and Chvostek's (facial tap twitch) signs, laryngospasm risk; think post-thyroidectomy; IV calcium gluconate ready. HIGH — the sluggish picture: weakness, constipation, confusion, stones; hydrate, mobilize, expect loop diuretics.

Magnesium (1.5-2.5): LOW — mirrors low calcium (tremor, hyperreflexia, torsades risk) and travels with alcohol use disorder; replete magnesium before potassium will hold. HIGH — usually iatrogenic (magnesium infusions, renal failure): lost reflexes, respiratory depression; calcium gluconate is the antidote.

Phosphorus inverts calcium; chloride follows sodium. The memory scaffold: potassium and the HEART's rhythm, sodium and the BRAIN's water, calcium/magnesium and the MUSCLES' excitability.`,
      importantNote: `Trousseau's and Chvostek's = hypocalcemia; peaked T waves = hyperkalemia; U waves = hypokalemia; lost reflexes on a magnesium infusion = toxicity. Four signatures, four instant answers.`,
    },
    {
      id: 'fe-abg',
      title: `3. Blood Gases in Three Steps`,
      content: `Normals: pH 7.35-7.45, PaCO₂ 35-45 mm Hg, HCO₃⁻ 22-26 mEq/L. The three-step method: (1) classify the pH — below 7.35 acidosis, above 7.45 alkalosis; (2) find the culprit — if CO₂ moved OPPOSITE the pH, the cause is respiratory; if bicarbonate moved the SAME direction as pH, metabolic (ROME: Respiratory Opposite, Metabolic Equal); (3) check compensation — the other system unmoved means uncompensated; moving but pH still abnormal, partial; pH back in range, full.

Attach causes and you can predict the gas before reading it. Respiratory acidosis = hypoventilation: COPD, oversedation, respiratory fatigue; treat the breathing. Respiratory alkalosis = hyperventilation: anxiety, pain, early sepsis; treat the cause, coach the breathing. Metabolic acidosis = acid gained or base lost: DKA, renal failure, lactic acidosis, severe diarrhea; expect Kussmaul respirations (deep, rapid — the lungs compensating). Metabolic alkalosis = acid lost or base gained: vomiting, NG suction, diuretics.

Pair the gas with its client: pH 7.30/CO₂ 58/HCO₃ 25 in a COPD client — uncompensated respiratory acidosis; pH 7.30/CO₂ 28/HCO₃ 14 in DKA — partially compensated metabolic acidosis (the low CO₂ is Kussmaul at work, not a second problem); pH 7.49/CO₂ 30 in a panicking client — respiratory alkalosis whose paresthesias resolve with slowed breathing.`,
    },
  ],
  keyTakeaways: [
    `Daily weight is the volume-status gold standard: 1 kg = 1 L; >5 lb/week in heart failure = report.`,
    `Isotonic resuscitates, hypotonic hydrates cells (never with cerebral edema risk), hypertonic is a controlled rescue.`,
    `K⁺ owns the ECG (peaked T high, U wave low); Ca²⁺/Mg²⁺ own excitability (Trousseau/Chvostek low Ca).`,
    `Magnesium first: potassium will not correct while magnesium is low.`,
    `ROME: CO₂ opposite pH = respiratory; HCO₃ with pH = metabolic; then read compensation.`,
  ],
},

nx_emergencies: {
  topicId: 'nx_emergencies',
  title: `Medical Emergencies & Unexpected Responses`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `A short list of emergencies appears on the exam over and over because each has a signature presentation and a single best first action. These are recognition-reflex pairs: the stem describes the picture, and the options separate candidates who know the reflex from those who reach for something plausible but slower. Learn them as pairs and the items take seconds.`,
  sections: [
    {
      id: 'emerg-allergic-metabolic',
      title: `1. Anaphylaxis, Sepsis, and Glucose Emergencies`,
      content: `Anaphylaxis: exposure followed by any two of urticaria/angioedema, bronchospasm/stridor, hypotension, GI symptoms. Reflex: stop the trigger (infusion OFF first when the drug is the trigger), then epinephrine IM in the anterolateral thigh — before antihistamines, before steroids, before anything else — repeated every 5-15 minutes as needed, with airway watch and volume support. Diphenhydramine and steroids are adjuncts; every exam item plants them as premature answers.

Sepsis: infection plus systemic signs — fever or hypothermia, tachycardia, tachypnea, falling pressure, rising lactate, new confusion (often the FIRST sign in the elderly). Reflex: recognize early, cultures before antibiotics WITHOUT delaying antibiotics beyond the first hour, fluids for hypotension, and escalation. The tested nuance: a normal temperature does not exclude sepsis in the old or immunosuppressed.

Hypoglycemia (below 70 with symptoms): conscious clients get 15 g of fast carbohydrate and a 15-minute recheck; unconscious clients get IV dextrose 50% or IM glucagon — never oral. DKA (type 1 pattern): Kussmaul respirations, fruity breath, dehydration, glucose typically >300, ketones, acidosis. Reflex order matters: FLUIDS first (the deficit is liters), then insulin infusion, with potassium watched obsessively — insulin drives potassium into cells, so a normal-looking initial potassium plummets, and potassium is replaced before or with insulin per protocol once urine output is confirmed. HHS (type 2 pattern) is the same physiology minus ketosis: higher glucose, worse dehydration, no Kussmaul.`,
      examTip: `Two "first action" traps: antihistamine before epinephrine in anaphylaxis, and insulin before fluids in DKA. Both wrong, both permanent exam fixtures.`,
    },
    {
      id: 'emerg-neuro-msk',
      title: `2. Neurologic and Musculoskeletal Emergencies`,
      content: `Autonomic dysreflexia (spinal cord injury at T6 or above): pounding headache, flushing and sweating ABOVE the lesion, hypertension with bradycardia. Reflex: sit the client bolt upright FIRST (orthostatic pooling drops pressure faster than any drug), then hunt the trigger — bladder (kinked catheter, retention) is most common, then bowel impaction, then skin. Antihypertensives only if trigger removal fails.

Increased intracranial pressure: earliest sign is a CHANGE IN LEVEL OF CONSCIOUSNESS — restlessness, subtle confusion — long before the late Cushing triad (widening pulse pressure, bradycardia, irregular respirations). Care bundles: head midline, HOB 30 degrees, minimize stimulation and clustering of care, avoid Valsalva; and for any acute stroke picture, the reflex is the time-stamped "last known well" plus emergent imaging, because thrombolysis runs on a clock.

Compartment syndrome (casted or crushed limb): pain out of proportion, worse on PASSIVE stretch, unrelieved by opioids — plus paresthesia early; pallor, pulselessness, and paralysis are LATE. Reflex: do NOT elevate above the heart, do NOT ice (both reduce perfusion into the compartment); notify immediately, loosen constricting devices per order, prepare for cast splitting or fasciotomy. Muscle dies in hours.

Fat embolism (long-bone fractures, 24-72 hours): the triad of hypoxemia, altered mentation, and a PETECHIAL RASH on the chest and axillae — the rash separates it from thromboembolism. Reflex: oxygen, stabilize, urgent escalation.`,
      importantNote: `Compartment syndrome inverts routine fracture care: elevation and ice — correct for ordinary swelling — become harmful. The phrase "pain unrelieved by opioids" is the stem's alarm bell.`,
    },
    {
      id: 'emerg-periop-other',
      title: `3. Malignant Hyperthermia and the Unexpected-Response Set`,
      content: `Malignant hyperthermia (triggered by volatile anesthetics and succinylcholine): earliest reliable signs are jaw/muscle rigidity, an unexplained RISING end-tidal CO₂, and tachycardia — temperature elevation is LATE, so no one waits for fever. Reflex: stop the triggering agent, call for the MH cart, give dantrolene, cool actively, manage the potassium the dying muscle releases. Family history of anesthesia deaths is the screening question that prevents it entirely.

Thyroid storm (thyrotoxic client + stressor): fever, extreme tachycardia, agitation to delirium; beta blockade and antithyroid therapy per orders, cooling without aspirin (aspirin displaces thyroid hormone). Its mirror, myxedema coma: hypothermia, bradycardia, stupor — warm, support, IV thyroid hormone. Adrenal (Addisonian) crisis: hypotension unresponsive to fluids in a steroid-dependent client who stopped abruptly or met major stress — IV hydrocortisone is the fix and the reason "never stop steroids abruptly" is drilled.

Two transfusion-adjacent emergencies complete the set. Tension pneumothorax (trauma, ventilated clients, clamped bubbling chest tubes): escalating dyspnea, unilateral absent breath sounds, tracheal deviation AWAY from the affected side, hypotension — needle decompression/provider now, and if a clamped tube caused it, unclamp. And the universal rule underneath every "unexpected response" item: when a client deteriorates during any infusion, procedure, or new therapy — STOP the suspected cause first. Stopping is free, reversible, and almost always the first correct verb.`,
    },
  ],
  keyTakeaways: [
    `Anaphylaxis: stop trigger → epinephrine IM thigh. Antihistamines are adjuncts, never first.`,
    `DKA: fluids → insulin → potassium vigilance (insulin crashes K⁺). HHS = same minus ketosis.`,
    `Autonomic dysreflexia: sit upright first, then bladder → bowel → skin for the trigger.`,
    `Compartment syndrome: pain beyond analgesia + passive-stretch pain; do not elevate or ice — surgical urgency.`,
    `MH: rigidity + rising CO₂ before fever; dantrolene. Tension pneumothorax: trachea deviates AWAY; decompress now.`,
    `Deterioration during any infusion or therapy: stopping the suspected cause is the first correct verb.`,
  ],
},

// ═══════════════════════════════════════════════════════════════
// Adult Health wave 1 — Cardiovascular, Respiratory, Neuro, Endocrine
// ═══════════════════════════════════════════════════════════════

nx_cardiac_rhythms: {
  topicId: 'nx_cardiac_rhythms',
  title: `ECG Basics & Dysrhythmias`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `The exam does not ask you to be a cardiologist; it asks you to recognize a handful of rhythms from a description or strip, know which ones kill, and pair each with its first-line response. This chapter builds the five-step reading method, the lethal-versus-stable sorting, and the treatment pairings that answer nearly every rhythm question.`,
  sections: [
    {
      id: '1-reading-a-strip',
      title: `1. Reading a Strip in Five Steps`,
      content: `Every rhythm question yields to the same sequence. First, rate: count the QRS complexes in a 6-second strip and multiply by 10, or divide 300 by the number of large boxes between R waves. Normal is 60-100. Second, regularity: march the R-R intervals - are they even? Third, P waves: is there one before every QRS, and do they all look alike? Fourth, PR interval: normal is 0.12-0.20 seconds (3-5 small boxes); longer means the AV node is delaying. Fifth, QRS width: normal is under 0.12 seconds; wide means the impulse is traveling through muscle instead of the conduction system, which usually means ventricular origin.

Sinus rhythm passes all five checks. Sinus bradycardia and tachycardia fail only the rate check - and the nursing response depends entirely on whether the client is symptomatic. A marathon runner at 52 beats per minute needs nothing; a dizzy, hypotensive client at 40 needs atropine. That symptomatic-versus-asymptomatic distinction runs through the whole chapter: treat the client, never the monitor. A monitor showing a lethal rhythm on a client who is talking to you comfortably means loose leads before it means arrest - always check the client first.`,
    },
    {
      id: '2-atrial-rhythms',
      title: `2. Atrial Fibrillation, Flutter, and SVT`,
      content: `Atrial fibrillation is the most common sustained dysrhythmia and the exam's favorite: irregularly irregular rhythm with no discernible P waves. The atria quiver instead of contracting, so blood pools and clots - the danger is embolic stroke, which is why chronic AF clients live on anticoagulation and why their level questions (INR for warfarin) recur. Rate control uses beta-blockers, calcium channel blockers (diltiazem), or digoxin. If AF is new and the client is unstable - hypotensive, chest pain, altered - synchronized cardioversion is the answer; if the AF has lasted more than 48 hours, cardioversion waits for anticoagulation or a transesophageal echo to exclude clot, because shocking a clot-filled atrium launches the embolus.

Atrial flutter shows the classic sawtooth baseline with a regular ventricular response. Supraventricular tachycardia (SVT) is a narrow-QRS rate of 150-250: the stepwise response is vagal maneuvers first (bear down, ice to the face), then adenosine given rapid IV push followed by a saline flush - warn the client about the momentary sense of impending doom and the pause on the monitor, both expected. Unstable SVT, like any unstable tachycardia with a pulse, gets synchronized cardioversion. The word synchronized matters: the machine times the shock away from the T wave; an unsynchronized shock on a perfusing rhythm can cause the very VF you are trying to prevent.`,
    },
    {
      id: '3-lethal-rhythms',
      title: `3. The Lethal Rhythms and Their Responses`,
      content: `Ventricular tachycardia is a run of wide, bizarre QRS complexes at 100-250. The first nursing action is always the same: check the pulse. VT with a pulse and a stable client gets antiarrhythmics (amiodarone); VT with a pulse but unstable gets synchronized cardioversion; pulseless VT is a cardiac arrest treated exactly like VF - CPR and defibrillation. Ventricular fibrillation is chaotic quivering with no cardiac output: no pulse, no perfusion, and the only definitive treatment is defibrillation - unsynchronized, because there is no QRS to synchronize with. Every minute of delay drops survival; the sequence is start CPR, defibrillate as soon as the machine arrives, resume compressions immediately.

Asystole is the flat line - and the exam point is that you do NOT defibrillate a flat line. Confirm in a second lead (fine VF can masquerade), then CPR and epinephrine. Pulseless electrical activity (PEA) - an organized rhythm on the monitor with no pulse - is treated the same way while hunting the reversible causes (the H's and T's: hypovolemia, hypoxia, hydrogen ion, hypo/hyperkalemia, hypothermia, tension pneumothorax, tamponade, toxins, thrombosis). For blocks: first-degree is a long PR and needs monitoring only; second-degree type I (Wenckebach) shows progressively lengthening PR until a beat drops; type II drops beats without warning and can deteriorate; third-degree (complete) block shows P waves and QRS complexes marching independently - symptomatic blocks get atropine as a bridge and pacing as the answer, with transcutaneous pacing first in an emergency.`,
    },
  ],
  keyTakeaways: [
    `Treat the client, not the monitor: symptomatic status decides intervention for bradycardia and tachycardia alike, and a "lethal rhythm" in a talking client means check the leads.`,
    `Atrial fibrillation's danger is clot and stroke - anticoagulation questions, and no elective cardioversion after 48 hours without clot exclusion.`,
    `SVT ladder: vagal maneuvers, then rapid-push adenosine with a flush, then synchronized cardioversion if unstable.`,
    `VT: pulse check first - stable gets amiodarone, unstable gets synchronized cardioversion, pulseless gets CPR + defibrillation like VF.`,
    `Never defibrillate asystole or PEA - CPR and epinephrine while correcting H's and T's; symptomatic blocks bridge with atropine toward pacing.`,
  ],
},

nx_cad_acs: {
  topicId: 'nx_cad_acs',
  title: `Coronary Artery Disease & Acute Coronary Syndromes`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Chest pain questions test one core skill: distinguishing stable angina from unstable angina from infarction, and pairing each with the right urgency. This chapter covers the spectrum, the immediate response set, what the labs and ECG add, and the post-MI complications the exam plants in "day 2" stems.`,
  sections: [
    {
      id: '1-angina-spectrum',
      title: `1. Stable Angina to Infarction: One Disease, Three Urgencies`,
      content: `Coronary artery disease narrows the vessels; the syndromes differ in whether supply-demand mismatch is transient or a vessel is occluding. Stable angina is predictable: exertional chest pain relieved by rest and nitroglycerin within minutes. Teaching centers on the nitroglycerin protocol - stop activity, sit down, one sublingual tablet; if pain is unrelieved or worsening 5 minutes after the FIRST tablet, call emergency services (do not drive), and up to three tablets may be taken 5 minutes apart while waiting. Storage teaching recurs: dark container, replace by expiration, expect a slight sting or headache - and no PDE-5 inhibitors (sildenafil) within 24-48 hours, because the combined vasodilation can be fatal.

Unstable angina breaks the pattern: pain at rest, new-onset severe pain, or a crescendo of frequency and duration - it is an emergency because it usually means a plaque has ruptured and a clot is forming. Myocardial infarction is death of muscle: pain that is typically crushing or pressure-like, radiating to arm or jaw, lasting more than 20 minutes, unrelieved by rest or nitroglycerin, often with diaphoresis, nausea, and dyspnea. The exam expects atypical presentations too: women, older adults, and diabetic clients may present with fatigue, indigestion-like discomfort, or dyspnea alone - a diabetic client with "new heartburn and unusual fatigue" is an MI stem until proven otherwise.`,
    },
    {
      id: '2-acs-response',
      title: `2. The Acute Response: What You Do in the First Minutes`,
      content: `The immediate set for suspected ACS: obtain a 12-lead ECG within 10 minutes of presentation, give aspirin 162-325 mg chewed (chewing speeds absorption; it blocks further platelet aggregation), apply oxygen only if saturation is below about 90 percent (routine high-flow oxygen is no longer given - hyperoxia worsens outcomes), give nitroglycerin for pain unless contraindicated (hypotension, right ventricular infarction, recent PDE-5 inhibitor), and give morphine only for pain refractory to nitrates. Draw troponin - the definitive biomarker, rising within 2-3 hours (high-sensitivity assays) and staying elevated for days; serial troponins distinguish infarction (rise and fall) from chronic elevation.

The ECG sorts the pathway: ST elevation (STEMI) means a fully occluded artery and the clock is running - reperfusion by percutaneous coronary intervention (PCI) with a door-to-balloon goal of 90 minutes, or fibrinolytics within 30 minutes if PCI is unavailable within 120 minutes. Fibrinolytic questions test the contraindication screen: active bleeding, recent surgery or trauma, prior hemorrhagic stroke, uncontrolled hypertension. Non-ST-elevation ACS (NSTEMI/unstable angina) gets antiplatelet and anticoagulant therapy with early catheterization by risk. After PCI via the femoral artery, the post-procedure priorities are the ones from procedure care: bedrest with the leg straight, pressure at the site, monitor for the expanding hematoma and lost distal pulse, and report retroperitoneal warning signs (back pain, hypotension) immediately.`,
    },
    {
      id: '3-post-mi',
      title: `3. After the Infarction: Medications and Complications`,
      content: `Discharge medication questions follow a standard bundle, each with its teaching hook: aspirin indefinitely (bleeding precautions), a P2Y12 inhibitor such as clopidogrel after stenting (do not stop abruptly - stent thrombosis), a beta-blocker (reduces mortality; teach pulse-taking and never stopping abruptly; masks hypoglycemia in diabetics), an ACE inhibitor (watch for the dry cough that prompts an ARB switch, and for hyperkalemia), and a high-intensity statin (report muscle pain - rhabdomyolysis screen). Cardiac rehabilitation and staged activity resumption round out teaching, including the classic guidance that sexual activity can typically resume when the client can climb two flights of stairs without symptoms.

Complication timing is the exam's favorite trap. In the first hours to days, dysrhythmias are the leading killer - hence continuous monitoring; VF is most likely in the first hours. Days 2-3, pericarditis can appear: sharp pain WORSE lying flat and BETTER leaning forward, with a friction rub - distinguishing it from reinfarction (which would be pressure-like and ECG/troponin-evident) is a classic question. Around days 3-7, the healing wall is weakest: papillary muscle rupture (sudden mitral regurgitation - new murmur and flash pulmonary edema), ventricular septal rupture, or free-wall rupture with tamponade. Heart failure can emerge whenever enough muscle has died - crackles, S3, and the daily-weight logic from the heart failure chapter. Cardiogenic shock - hypotension, cold clammy skin, oliguria despite adequate volume - is the most lethal pump failure and demands ICU-level support.`,
    },
  ],
  keyTakeaways: [
    `Nitroglycerin protocol: sit, one SL tablet, call EMS if unrelieved 5 minutes after the FIRST dose; dark bottle, no sildenafil within 24-48 h.`,
    `Suspected ACS: ECG within 10 minutes, chewed aspirin, O2 only if sat < 90%, nitro then morphine for refractory pain, serial troponins.`,
    `STEMI is a reperfusion race - PCI door-to-balloon 90 minutes; screen fibrinolytics against the bleeding contraindication list.`,
    `Discharge bundle: aspirin + P2Y12 + beta-blocker + ACE inhibitor + statin, each with its signature teaching point.`,
    `Complication clock: dysrhythmias first hours; pericarditis days 2-3 (worse supine, better leaning forward); wall rupture days 3-7; watch for new murmurs.`,
  ],
},

nx_heart_failure: {
  topicId: 'nx_heart_failure',
  title: `Heart Failure & Inflammatory Cardiac Disorders`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Heart failure is tested through one anatomical idea - each ventricle floods what lies behind it - plus the daily-weight alarm, the medication bundle with digoxin's rules, and the recognition of acute pulmonary edema. This chapter adds the inflammatory trio (endocarditis, pericarditis, myocarditis) the exam pairs with it.`,
  sections: [
    {
      id: '1-left-vs-right',
      title: `1. Left Versus Right: The Anatomical Sort`,
      content: `The failing left ventricle backs blood into the lungs: dyspnea, orthopnea (ask how many pillows), paroxysmal nocturnal dyspnea, crackles, an S3 gallop, and in the extreme, pink frothy sputum. The failing right ventricle backs blood into the body: jugular venous distention, dependent edema, hepatomegaly with right-upper-quadrant tenderness, ascites, and weight gain. Left failure is the most common cause of right failure; pure right failure from lung disease is cor pulmonale. Sorting any finding to its side is the single most reliable HF question format, and the sort is purely anatomical - what is directly behind the failing chamber floods.

B-type natriuretic peptide (BNP) is the confirming lab: the ventricle secretes it when stretched, so elevated BNP distinguishes cardiac dyspnea from pulmonary causes. The monitoring cornerstone is the daily weight - same time, same scale, same clothing, after voiding, before breakfast - because weight is the most sensitive early indicator of fluid retention: more than about 1 kg (2-3 lb) overnight or 2.3 kg (5 lb) in a week is a call-the-provider number, taught to every client and tested constantly.`,
    },
    {
      id: '2-hf-management',
      title: `2. The Medication Bundle and Digoxin's Rules`,
      content: `Chronic HF management pairs lifestyle (sodium restriction, often fluid limits, activity as tolerated) with a bundle: ACE inhibitors or ARBs reduce afterload and remodeling (cough, hyperkalemia, monitor renal function); beta-blockers improve survival but are started low and slow - and are held in acute decompensation; loop diuretics (furosemide) relieve congestion - teach potassium-rich foods or supplements, watch for ototoxicity with rapid IV push (give over several minutes), and expect the potassium question (a client on furosemide and digoxin with K+ 3.0 is a classic danger stem); spironolactone spares potassium (so hyperkalemia is ITS risk); and newer agents follow the same logic of unloading the pump.

Digoxin earns its own paragraph every exam cycle. It increases contractility and slows rate. Therapeutic level is 0.5-2.0 ng/mL. Hold and call for a level above range or an apical pulse below 60 (count a full minute). Toxicity presents as anorexia, nausea, vomiting first, then visual changes - halos, yellow-green tint - and dysrhythmias. HYPOKALEMIA POTENTIATES DIGOXIN TOXICITY: low potassium lets digoxin bind more avidly, so the furosemide-digoxin pair without potassium repletion is the stem to flag. The antidote is digoxin immune Fab. Any digoxin question that mentions the client's potassium is telling you the answer's direction.`,
    },
    {
      id: '3-pulmonary-edema-inflammatory',
      title: `3. Acute Pulmonary Edema and the Inflammatory Trio`,
      content: `Acute decompensation is a scene question: sudden severe dyspnea, anxiety, cold sweat, crackles throughout, pink frothy sputum. The response set: sit the client upright with legs dependent (high Fowler's - decreases venous return), give oxygen (positive-pressure ventilation if needed), IV furosemide, and nitroglycerin to reduce preload; morphine appears in older references but is used cautiously now. The wrong answers lie the client flat or push fluids - the opposite of unloading a drowning pump.

The inflammatory trio rides along. Infective endocarditis - infection of the valves, risk with IV drug use, prosthetic valves, and invasive procedures - presents with fever, murmur, and embolic signatures (splinter hemorrhages, Janeway lesions, Osler nodes); care is weeks of IV antibiotics and prevention teaching: prophylactic antibiotics before dental work for high-risk clients, and meticulous oral hygiene. Pericarditis - post-MI, post-viral, or uremic - is the positional chest pain (worse supine, better leaning forward) with a friction rub; the feared complication is effusion progressing to tamponade: muffled heart sounds, JVD, hypotension (Beck's triad), pulsus paradoxus - a pericardiocentesis emergency. Myocarditis, often post-viral, presents as new heart failure in someone young; care is supportive with activity restriction. Distinguishing the trio by their signatures - embolic skin signs, positional rub, or unexplained new failure - is the question format.`,
    },
  ],
  keyTakeaways: [
    `Left failure floods the lungs (crackles, orthopnea, frothy sputum); right failure floods the body (JVD, edema, big liver) - sort every finding anatomically.`,
    `Daily weight is the alarm: >1 kg overnight or >2.3 kg/week means retained fluid - teach it, act on it.`,
    `Furosemide drops potassium; hypokalemia potentiates digoxin toxicity - the drug pair plus a low K+ is the exam's favorite danger stem.`,
    `Digoxin: level 0.5-2.0, hold for apical pulse < 60, toxicity = GI symptoms then visual halos; antidote is digoxin immune Fab.`,
    `Pulmonary edema: upright, oxygen, IV furosemide, nitrates - never supine, never fluids; tamponade's Beck triad (muffled sounds, JVD, hypotension) is a pericardiocentesis emergency.`,
  ],
},

nx_copd_asthma: {
  topicId: 'nx_copd_asthma',
  title: `Asthma & COPD`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Obstructive lung disease questions reward three skills: separating rescue from controller therapy, recognizing when an attack is deteriorating (the silent chest), and applying COPD's special oxygen and breathing rules. This chapter builds all three plus the inhaler technique teaching the exam loves to grade.`,
  sections: [
    {
      id: '1-asthma',
      title: `1. Asthma: Rescue Versus Controller`,
      content: `Asthma is reversible airway inflammation and bronchospasm: wheezing, chest tightness, cough, and dyspnea, triggered by allergens, exercise, cold air, or infection. The medication logic is a two-shelf system. The rescue shelf is the short-acting beta-agonist (SABA, albuterol) - fast onset, used for acute symptoms and pre-exercise; expect tremor and tachycardia as side effects. The controller shelf prevents attacks and does nothing in one: inhaled corticosteroids (the cornerstone - teach rinse-and-spit to prevent oral thrush), long-acting beta-agonists (NEVER alone in asthma - always paired with an inhaled steroid), and leukotriene modifiers (montelukast, oral, taken in the evening). The classic teaching failure the exam tests: a client using the controller for an acute attack, or using rescue albuterol daily - more than twice-weekly rescue use signals uncontrolled disease and a step-up need.

Inhaler technique is free points: shake, exhale fully, seal lips (or use a spacer - which improves delivery and is standard with steroids), inhale slowly while actuating, hold breath about 10 seconds; wait about a minute between puffs; bronchodilator BEFORE steroid when both are due (open the airways, then deliver the anti-inflammatory); rinse after steroids. Peak flow meters personalize monitoring: green zone (80-100% of personal best) means go, yellow (50-80%) means caution and rescue medication per plan, red (below 50%) means emergency action.`,
    },
    {
      id: '2-status-asthmaticus',
      title: `2. The Deteriorating Attack and Status Asthmaticus`,
      content: `Attack severity questions grade recognition of trajectory. A moderate attack: audible wheezing, speaking in phrases, using accessory muscles, tachycardia, oxygen saturation dropping. Deterioration signs: speaking in single words, exhaustion, paradoxical chest movement, and the finding every exam includes - the SILENT CHEST. Wheezing requires air movement; when wheezing disappears while the client worsens, air is no longer moving, and respiratory arrest is imminent. "Diminished wheezing" in a still-distressed client is never improvement - it is the most dangerous answer choice on the page. Rising CO2 on a blood gas tells the same story: an asthmatic working that hard should be blowing CO2 off (low PaCO2); a "normalizing" or rising PaCO2 means fatigue and failure.

Status asthmaticus - a severe attack unresponsive to initial bronchodilators - is an emergency: continuous nebulized SABA, ipratropium, systemic corticosteroids (IV), oxygen, and preparation for intubation if failing; IV magnesium sulfate appears as an adjunct. Position upright, stay with the client, minimize demand. Post-attack, every stem points toward trigger identification and an updated action plan - and the follow-up question is often about stepping up controller therapy.`,
    },
    {
      id: '3-copd',
      title: `3. COPD: The Special Rules`,
      content: `COPD - chronic bronchitis and emphysema, overwhelmingly smoking-related - is progressive and only partially reversible. The presentation set: dyspnea, chronic productive cough, prolonged expiration, barrel chest from air trapping, and in advanced disease, weight loss from the work of breathing. Two special rules dominate testing. Oxygen: the target saturation is 88-92 percent, not the high 90s - excessive oxygen in a chronic CO2 retainer worsens hypercapnia, so the wrong answer cranks the flow to chase a normal number, and the right answer maintains low-flow oxygen (1-2 L by cannula) within the target band. Never withhold oxygen from a hypoxic client - titrate to the band. Breathing retraining: pursed-lip breathing (inhale through the nose, exhale slowly through pursed lips, exhalation twice as long as inhalation) creates back-pressure that splints airways open; diaphragmatic breathing and the tripod position complete the set.

Exacerbations - usually infection-triggered - bring increased dyspnea, sputum volume, and purulence: treatment is bronchodilators, systemic corticosteroids, antibiotics when indicated, and controlled oxygen. Teaching bundles recur: smoking cessation (the single most effective intervention at any stage), influenza and pneumococcal vaccination, small frequent high-calorie meals (dyspneic clients cannot eat large ones), hydration to thin secretions, energy conservation, and pacing activities with rest. Right-sided heart failure (cor pulmonale) - edema, JVD, weight gain - is the late complication to recognize and report.`,
    },
  ],
  keyTakeaways: [
    `Rescue = SABA for the attack; controllers (inhaled steroids, LABA-with-steroid, montelukast) prevent and never treat one; rescue use > 2x/week signals step-up.`,
    `Inhaler order and technique are graded: bronchodilator before steroid, spacer with steroids, rinse-and-spit after, ~10-second breath hold.`,
    `A quieting chest in a worsening asthmatic is impending arrest, not improvement; a rising PaCO2 in an attack means fatigue and failure.`,
    `COPD oxygen target is 88-92% with low-flow titration - never chase 99%, never withhold oxygen either.`,
    `Pursed-lip breathing, tripod position, small frequent meals, vaccines, and smoking cessation are the COPD teaching core; new edema/JVD = cor pulmonale, report.`,
  ],
},

nx_diabetes: {
  topicId: 'nx_diabetes',
  title: `Diabetes Mellitus & Its Complications`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Diabetes may be the single highest-yield disease on the exam: insulin timing, hypoglycemia response, sick-day rules, DKA versus HHS, and foot care each generate reliable questions. This chapter organizes them around the numbers and the emergencies.`,
  sections: [
    {
      id: '1-types-and-insulins',
      title: `1. The Disease and the Insulin Clock`,
      content: `Type 1 diabetes is autoimmune beta-cell destruction: absolute insulin deficiency, usually younger onset, ketosis-prone, insulin-dependent for life. Type 2 is insulin resistance with relative deficiency: gradual onset, strongly weight-linked, managed stepwise with lifestyle, oral agents, and often eventually insulin. Diagnosis numbers worth holding: fasting glucose 126 mg/dL or higher, random 200 with symptoms, and hemoglobin A1c of 6.5% or higher - with A1c reflecting roughly three months of control (target commonly under 7%).

The insulin clock is pure test material. Rapid-acting (lispro, aspart): onset about 15 minutes, peak 1-2 hours - give with food in reach, because injecting and then delaying the meal invites hypoglycemia. Short-acting (regular): onset 30-60 minutes, peak 2-4 hours; it is the IV insulin. Intermediate (NPH): peak 4-12 hours - the classic mid-afternoon or 3-AM hypoglycemia stems; cloudy, and in mixing "clear before cloudy" (draw regular first). Long-acting (glargine, detemir): essentially peakless basal coverage, never mixed with anything. Every hypoglycemia-timing question is answered by matching the symptom time to a peak. Injection teaching: rotate sites within one region for absorption consistency, abdomen fastest; do not inject into an extremity about to be exercised.`,
    },
    {
      id: '2-hypoglycemia-sickdays',
      title: `2. Hypoglycemia and the Sick-Day Rules`,
      content: `Hypoglycemia (glucose below 70) is the emergency of treatment, not of disease: cold sweat, tremor, tachycardia, hunger, then confusion, slurred speech, seizure, coma. The conscious-client response is the 15-15 rule: 15 grams of fast carbohydrate (4 oz juice or regular soda, glucose tablets), recheck in 15 minutes, repeat if still under 70, then follow with a complex carb plus protein snack if the next meal is distant. Wrong answers add fat (slows absorption - no candy bars) or give oral anything to an unconscious client: unconsciousness means IM/subcut glucagon or IV dextrose, side-lying for airway protection. Beta-blockers mask the adrenergic warning signs - diaphoresis persists - so the beta-blocked diabetic is a recurring stem.

Sick-day rules answer the "client with the flu" question set: NEVER stop insulin during illness - counterregulatory stress hormones raise glucose even without eating; check glucose every 2-4 hours; check urine ketones (type 1) when glucose runs high; keep drinking - fluids to prevent the dehydration that accelerates crisis, substituting carbohydrate-containing liquids if unable to eat; call the provider for persistent vomiting, glucose stubbornly above about 240 with ketones, or signs of DKA. The client statement "I skip my insulin when I can't eat" is the further-teaching flag every version of this question uses.`,
    },
    {
      id: '3-dka-hhs-chronic',
      title: `3. DKA, HHS, and the Long Game`,
      content: `Diabetic ketoacidosis - mostly type 1, triggered by infection, omitted insulin, or new diagnosis - is the acid emergency: glucose typically 250-600, ketones, metabolic acidosis with Kussmaul respirations (deep, rapid - blowing off CO2) and fruity breath, dehydration, abdominal pain. Management order matters: isotonic fluids FIRST (the client is liters down), then IV regular insulin infusion; add dextrose to fluids when glucose falls to about 250 (prevent hypoglycemia while ketones clear); and the potassium rule the exam adores - insulin drives potassium into cells, so a "normal" starting K+ will plummet: verify adequate potassium and urine output BEFORE and during insulin, replacing as needed. Hyperosmolar hyperglycemic state (HHS) - typically type 2, older clients - runs higher glucose (often above 600), profound dehydration and osmolarity, minimal ketosis, and neurologic changes; treatment is the same fluids-then-insulin logic with even more emphasis on volume. The discriminator: acidosis and Kussmaul breathing = DKA; extreme glucose with neuro changes and no significant ketones = HHS.

The long game is complication surveillance: annual dilated eye exams (retinopathy), urine microalbumin and renal function (nephropathy - ACE inhibitors protect), monofilament foot exams (neuropathy), and aggressive cardiovascular risk management. Foot care teaching is a question factory: inspect feet daily with a mirror, wash and dry thoroughly especially between toes, moisturize but NOT between the toes, never go barefoot, well-fitting shoes broken in gradually, trim nails straight across, no heating pads on the feet, and report any wound that does not heal - because neuropathy hides injuries and vasculopathy stalls healing.`,
    },
  ],
  keyTakeaways: [
    `Insulin peaks answer timing questions: lispro 1-2 h, regular 2-4 h, NPH 4-12 h (the 3-AM stem), glargine peakless and never mixed; clear before cloudy.`,
    `Hypoglycemia: 15 g fast carb, recheck in 15 minutes; unconscious = glucagon/IV dextrose, never oral; beta-blockers mask the warnings except sweating.`,
    `Sick-day rules: never stop insulin, check glucose q2-4h and ketones, push fluids - "I skip insulin when sick" is the correction target.`,
    `DKA: fluids first, then insulin infusion, dextrose at ~250, and guard the potassium insulin will crash; HHS = higher sugar, no acidosis, more dehydration.`,
    `Foot care: daily inspection, dry between toes but no lotion there, never barefoot, straight-across nails, no heating pads - neuropathy hides what vasculopathy won't heal.`,
  ],
},

nx_stroke_icp: {
  topicId: 'nx_stroke_icp',
  title: `Stroke & Increased Intracranial Pressure`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Neuro emergencies test speed and sequence: recognize the stroke, protect the tPA window, sort left-brain from right-brain deficits, and catch rising intracranial pressure at the earliest sign - a change in level of consciousness - not the late, famous ones. This chapter drills all four.`,
  sections: [
    {
      id: '1-stroke-recognition',
      title: `1. Recognizing Stroke and Protecting the Window`,
      content: `Ischemic stroke (about 85 percent) is vessel occlusion; hemorrhagic stroke is vessel rupture - and everything in acute management hinges on which, because the treatment for one is catastrophic in the other. Recognition uses FAST: Face droop, Arm drift, Speech slurring, Time - and time is the treatment. The single most important history question is "when was the client last seen normal?" because that timestamp, not symptom discovery, starts the clock. IV fibrinolysis (alteplase) requires onset within 3 hours (up to 4.5 for selected clients) AND a CT scan first to exclude hemorrhage - the non-contrast head CT before any anticoagulation is the non-negotiable sequencing answer. Exclusions mirror the cardiac list: recent surgery or trauma, active bleeding, prior hemorrhagic stroke, uncontrolled severe hypertension. During and after infusion: bleeding precautions, frequent neuro checks, defer non-urgent injections and invasive lines, and immediately report any decline (possible hemorrhagic conversion). A transient ischemic attack - deficits resolving within minutes to an hour - is not a relief but a warning: stroke risk is highest in the following days, so TIA stems point toward urgent workup, not reassurance.

Hemorrhagic stroke - often the "worst headache of my life" with rapid deterioration - is managed by limiting the bleed: blood pressure control, reversing anticoagulation, possible surgery, and strict aneurysm precautions when that is the source: quiet dark room, stool softeners (no straining), limit visitors and stimulation.`,
    },
    {
      id: '2-deficits-and-care',
      title: `2. Left Brain, Right Brain, and Post-Stroke Care`,
      content: `Deficit-sorting is reliable test currency because control is crossed: each hemisphere runs the opposite body side. Left-hemisphere stroke: right-sided weakness, and - because language usually lives on the left - aphasia: expressive (Broca's: knows what to say, cannot produce it - give time, ask yes/no questions, offer communication boards), receptive (Wernicke's: fluent but meaningless speech, impaired comprehension - use gestures and simple phrases), or global. Left-stroke clients tend to be slow, cautious, and aware of deficits - depression risk. Right-hemisphere stroke: left-sided weakness, spatial-perceptual deficits, and the dangerous combination of impulsivity with unawareness of deficits - these clients overestimate ability, making them the falls-risk answer. Unilateral neglect - ignoring the affected side, classically with right-brain strokes - generates care questions: initially approach and place items on the UNAFFECTED side for function and safety, then progressively train attention toward the affected side; teach scanning for homonymous hemianopsia (loss of the same half of the visual field in both eyes).

The swallowing rule is absolute: nothing by mouth until a swallow screen is passed - aspiration pneumonia is a leading post-stroke killer. Dysphagia care repeats the basic-care rules: upright 90 degrees, chin tuck if prescribed, thickened liquids per speech pathology, no straws, remain upright after meals. Rehabilitation begins on day one: prevent contractures and shoulder subluxation (support the flaccid arm, never pull it), reposition, range-of-motion exercises, DVT prophylaxis, and early PT/OT/speech involvement.`,
    },
    {
      id: '3-icp',
      title: `3. Increased Intracranial Pressure: Early, Late, and the Care Set`,
      content: `The skull is a closed box holding brain, blood, and CSF; when any compartment expands - edema, bleeding, hydrocephalus, tumor - pressure rises and perfusion falls. The EARLIEST indicator of rising ICP is a change in level of consciousness: new restlessness, irritability, confusion, lethargy - the subtle cognitive shift, hours before anything dramatic. The famous signs are LATE: pupil changes (unilateral dilation and sluggishness as the third cranial nerve is compressed - a "blown pupil" means herniation is underway), and Cushing's triad - widening pulse pressure (rising systolic), bradycardia, and irregular respirations - is the brainstem's final warning, not a monitoring milestone. Posturing grades depth: flexor (decorticate) is bad; extensor (decerebrate) is worse. Any question asking for the earliest sign wants the LOC change; any answer waiting for Cushing's triad has waited too long.

The nursing care set is a coherent physics package: head of bed at 30 degrees with head midline (venous drainage); avoid extreme hip flexion and clustering of care; prevent Valsalva - stool softeners, no straining, no isometric pushing; suction only when necessary, for less than 10 seconds, pre-oxygenating first (suctioning spikes ICP); keep the environment calm; manage fever aggressively (each degree raises metabolic demand); maintain oxygenation and normocapnia (hypercapnia dilates cerebral vessels and raises ICP - which is also why brief hyperventilation lowers it and is reserved for emergencies). Osmotic therapy - mannitol or hypertonic saline - pulls water from brain tissue: monitor urine output, serum osmolarity, and for rebound edema. Seizure prophylaxis is common. Everything on the wrong-answer list raises pressure: flat positioning, hip flexion, clustered stimulating care, routine deep suctioning, unmanaged pain or fever.`,
    },
  ],
  keyTakeaways: [
    `"Last seen normal" starts the tPA clock (3-4.5 h) and a non-contrast CT to exclude hemorrhage comes before any lytic or anticoagulant - always.`,
    `Left stroke: right weakness + aphasia, cautious and aware; right stroke: left weakness, impulsive and unaware - the falls-risk client; approach neglect from the unaffected side first.`,
    `NPO until the swallow screen passes - aspiration is the post-stroke killer the exam guards with dysphagia-care questions.`,
    `Earliest ICP sign = level-of-consciousness change; pupils and Cushing's triad (wide pulse pressure, bradycardia, irregular respirations) are late herniation heralds.`,
    `ICP care physics: HOB 30, head midline, no Valsalva/hip flexion/clustered care, brief pre-oxygenated suctioning only, treat fever, mannitol with osmolarity and output monitoring.`,
  ],
},

};

/** Whether a course lesson exists for the given curriculum topic. */
export function hasNCLEXCourseContent(topicId: string): boolean {
  return topicId in NCLEX_COURSE;
}

/** The course lesson for a curriculum topic, or null. */
export function getNCLEXCourseContent(topicId: string): TopicLesson | null {
  return NCLEX_COURSE[topicId] ?? null;
}

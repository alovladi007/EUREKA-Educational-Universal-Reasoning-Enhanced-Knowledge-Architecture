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
  overview: `The NCLEX-RN is not a fixed test — it is a computerized adaptive test (CAT) that builds itself around you, one item at a time, until it is statistically confident you are above or below the passing standard. Understanding the machine changes how you should sit in front of it: the exam is supposed to feel hard for everyone, a longer test does not mean you are failing, and there is no percentage score to chase. The 2026 test plan is locked through March 31, 2029 — what you study today is what you will face. This chapter covers the algorithm, every NGN item type and how it is scored, the official content distribution, and the preparation habits that match how the test actually works.`,
  sections: [
    {
      id: 'ngn-cat-mechanics',
      title: `1. How the CAT Decides`,
      content: `Every candidate answers between 85 and 150 items in up to 5 hours. Of the first 85, only 70 are scored — 15 are unscored pretest items being calibrated for future exams, and you cannot tell which are which, so every item deserves full effort.

The algorithm maintains a running estimate of your ability. Answer correctly and the next item is harder; miss and it gets easier. The exam ends when one of three things happens:

| Stopping rule | What it means |
| --- | --- |
| 95% confidence | the algorithm is 95% sure your ability is clearly above or clearly below the passing standard — can happen as early as item 85 |
| maximum length | at item 150, the final ability estimate decides pass or fail |
| time | at 5 hours, a run-out-of-time rule is applied to the remaining estimate |

This is why the test "feels" like a coin flip: the CAT deliberately serves items near your estimated ability, where you have roughly a 50% chance on each. If the questions feel brutally hard, that usually means the algorithm has placed you high and is probing your ceiling. Neither test length nor perceived difficulty predicts the outcome — candidates pass at 85 items and at 150, and fail at both.

## What this changes about strategy

You cannot skip items or return to previous ones, so committing and moving on IS the strategy — there is no review pass. Mid-exam self-diagnosis ("these are getting easier, I must be failing") reads noise as signal and costs concentration; the honest answer is that you cannot tell, so stop reading tea leaves. Pace arithmetic: 5 hours across at most 150 items is two minutes per item — comfortable, which makes stamina and focus, not speed, the real constraints. Take the offered breaks; fatigue errors cluster late.`,
      examTip: `You cannot skip items or return to previous ones. Commit, move on, and do not diagnose your performance mid-exam — that spiral costs more points than any single wrong answer.`,
    },
    {
      id: 'ngn-item-types',
      title: `2. The NGN Item Types & Their Scoring`,
      content: `Alongside classic multiple-choice and select-all-that-apply (SATA), the NGN item set is built around the clinical judgment model, and most NGN formats award PARTIAL credit — which changes how you should answer them.

| Item type | What it looks like | Scoring |
| --- | --- | --- |
| case study | one evolving client, six linked questions, chart in tabs | each question scored on its own rubric |
| bowtie | one screen: condition (center), 2 actions (left), 2 parameters to monitor (right) | partial credit per correct piece |
| trend | a series of measurements over time to interpret | keyed to the trajectory, not single values |
| matrix / grid | classify each row (expected / unrelated / requires follow-up) | credit per correctly classified row |
| cloze (drop-down) | complete sentences by choosing from menus | credit per blank |
| enhanced hot spot | highlight the relevant text in a record | credit for correct highlights, penalty for wrong ones |
| extended multiple response | SATA with a longer option list | typically plus-minus scored |
| extended drag-and-drop | move options into response targets | credit per correct placement |

Plus-minus scoring is the practical headline: on most NGN multiple-response formats, each correct selection earns a point and each incorrect selection LOSES one (never below zero for the item). That kills the "select everything plausible" strategy — select what you can defend, and leave the coin flips unselected.

Classic SATA on the same exam is still scored all-or-nothing unless presented in the NGN partial-credit format; treat every option as an independent true-false judged on its own evidence.

Case studies deserve their tabs: the answer to each of the six questions is IN the record — vitals, notes, labs, orders — and the question sequence follows the clinical judgment model in order (recognize cues through evaluate outcomes). Read the tabs the question points to before the options.`,
      examTip: `On plus-minus items, an unselected maybe costs nothing; a selected wrong answer costs a point. When you cannot defend an option from the stem or the record, leave it alone.`,
    },
    {
      id: 'ngn-blueprint',
      title: `3. The 2026 Blueprint: Where the Questions Come From`,
      content: `The test plan publishes the distribution, which is also this course's map — the percentages below are why Management of Care and Pharmacological Therapies get the most chapters:

| Client Needs category | % of the exam |
| --- | --- |
| Management of Care | 15-21% |
| Safety and Infection Prevention and Control | 10-16% |
| Pharmacological and Parenteral Therapies | 13-19% |
| Physiological Adaptation | 11-17% |
| Reduction of Risk Potential | 9-15% |
| Health Promotion and Maintenance | 6-12% |
| Psychosocial Integrity | 6-12% |
| Basic Care and Comfort | 6-12% |

Three case-study sets (18 items) appear on every exam, plus roughly 10% stand-alone clinical-judgment items. Integrated throughout — not as separate sections — are nursing process, caring, communication, teaching/learning, and culture and spirituality.

Reading the table strategically: the top four categories together account for roughly half to two-thirds of the exam, and they are also where unstable clients live — prioritization, infection control, drug safety, and deteriorating physiology. A study plan that front-loads those four buys the most points per hour. The bottom four are not skippable (6-12% each is still 10+ items), but they reward breadth over depth — know the frameworks and the classic scenarios.`,
      examTip: `The blueprint is public and stable through March 2029 — study time should roughly track the percentages, not your comfort. The category you avoid is usually the one taking your points.`,
    },
    {
      id: 'ngn-preparation',
      title: `4. Preparing for an Adaptive Exam`,
      content: `Preparation for a CAT differs from preparation for a fixed test in specific, actionable ways.

Practice should be interleaved, not blocked: real exams never give you ten infection-control questions in a row, so drilling in shuffled mixed sets trains the switching your test day requires. Blocked practice feels better and performs worse — the fluency is an illusion of the format.

Practice the FORMATS, not just the content: bowtie, matrix, cloze, and highlighting have mechanics (partial credit, plus-minus penalties) that reward familiarity. The first time you meet a bowtie should not be on test day.

Wrong-answer review is where the points are: for every miss, name WHY — content gap, misread stem, missed cue in the record, or changed answer without evidence. The categories have different fixes (study, slow down, tab-reading discipline, first-answer discipline), and logging them turns practice into diagnosis.

Timed practice matters less than on fixed-length exams (the pace works out to over two minutes per item even at 150 items), but STAMINA practice matters more — schedule at least two full-length practice sessions before test day, because a 5-hour cognitive task is a physical event.

The final week: taper rather than cram, verify your Authorization to Test and ID match exactly, sleep two consecutive full nights, and plan the logistics (route, arrival buffer, permitted items) so test-day working memory is spent on clients, not parking. On the day: breakfast with protein, use the breaks, and expect the coin-flip feeling — it is the algorithm doing its job, not a verdict.`,
      examTip: `Review misses by CAUSE, not by topic: "misread the stem" and "content gap" are different diseases with different cures, and most candidates have a dominant one they have never named.`,
    },
    {
      id: 'ngn-selfcheck',
      title: `5. Self-Check`,
      content: `1. A candidate's exam ends at 85 items. What are the possible interpretations?

2. On an NGN extended multiple response item scored plus-minus, you are confident about three options and torn on two more. What do you select?

3. Which two Client Needs categories carry the highest percentage ranges, and what does that imply for study allocation?

4. A candidate reports the questions "felt impossible" from item 40 onward. What is the most accurate interpretation?

5. Why does interleaved practice beat blocked practice for CAT preparation?

## Answers

1. Either outcome — 85 items means the algorithm reached 95% confidence quickly, which happens for clear passes AND clear fails. Length carries no directional information.

2. The three you can defend. On plus-minus scoring, each wrong selection subtracts a point while an omitted maybe costs nothing — select only what the stem or record supports.

3. Management of Care (15-21%) and Pharmacological and Parenteral Therapies (13-19%). Together with Physiological Adaptation and Safety, they form roughly half or more of the exam and deserve proportional study time.

4. The CAT serves items near your estimated ability, so sustained difficulty most plausibly means the estimate is HIGH and the algorithm is probing the ceiling. Feeling is not feedback.

5. Because the real exam interleaves by design — consecutive items jump categories, and practice that rehearses the switching (retrieving the right framework cold, every item) transfers; blocked drilling rehearses a format the exam never uses.`,
    },
  ],
  keyTakeaways: [
    `The CAT serves items at your estimated ability until 95% confident, item 150, or 5 hours — so difficulty and length carry no directional information about passing.`,
    `NGN formats award partial credit, and plus-minus scoring punishes indefensible selections: choose what you can defend, omit the coin flips.`,
    `Case-study answers live in the chart tabs, and the six questions walk the clinical judgment model in order.`,
    `Study allocation should track the public blueprint — Management of Care and Pharm lead; the category you avoid is taking your points.`,
    `Prepare with interleaved mixed sets, format practice, cause-coded wrong-answer review, and two full-length stamina sessions.`,
  ],
},

nx_clinical_judgment: {
  topicId: 'nx_clinical_judgment',
  title: `The Clinical Judgment Model`,
  domainWeight: 'Foundations',
  overview: `Every NGN case study and most stand-alone items are written against one scaffold: the NCSBN Clinical Judgment Measurement Model, six cognitive steps from noticing to evaluating. Learning the model is not academic — each step has its own question style, its own verbs, and its own classic errors, so recognizing WHICH step a question is testing tells you what kind of answer it wants. This chapter walks the six steps with the question patterns, builds the cue-recognition habits the model rewards, and maps the model onto the older nursing process the exam still assumes.`,
  sections: [
    {
      id: 'cjm-model',
      title: `1. The Six Steps and Their Question Styles`,
      content: `The model runs in order, and NGN case studies ask one question per step, in sequence:

| Step | The cognitive task | The question sounds like |
| --- | --- | --- |
| 1. recognize cues | filter relevant from irrelevant data | "which findings require follow-up?" / highlight items |
| 2. analyze cues | link cues to possible conditions | "these findings are consistent with..." / matrix items |
| 3. prioritize hypotheses | rank what is most likely / most urgent | "the client is at highest risk for..." |
| 4. generate solutions | list interventions that address the priority | "which actions are appropriate?" (multiple response) |
| 5. take action | choose and sequence what to DO now | "which action should the nurse take FIRST?" |
| 6. evaluate outcomes | judge whether it worked | "which finding indicates improvement?" |

The step tells you the answer's shape. A recognize-cues question wants ABNORMAL-for-this-client findings, not interventions. A take-action question wants a doing verb, not more assessment — unless assessment IS the indicated action. An evaluate question wants a finding that moved toward target, not a restatement of the intervention.

## Recognizing cues: relevant beats abnormal

The step-1 trap is equating "abnormal" with "relevant." A chronically elevated creatinine in a dialysis client is abnormal and IRRELEVANT to today's chest pain; a heart rate that climbed from 88 to 112 is technically "normal range" and highly relevant. Relevance = departure from THIS client's baseline plus connection to the presenting problem. NGN highlighting items score exactly this discrimination — and penalize highlighting everything.`,
      examTip: `Identify which model step the question is asking before reading the options — the step dictates whether the right answer is a finding, a condition, a risk, an action, or an outcome. Half of "hard" NGN questions are just step misidentification.`,
    },
    {
      id: 'cjm-analyze',
      title: `2. Analyzing & Prioritizing: From Cues to the Working Problem`,
      content: `Analyzing cues means asking what could explain THIS cluster — and what cannot. The exam builds these items on classic clusters worth knowing cold:

| Cue cluster | Points toward |
| --- | --- |
| fever + new confusion + hypotension + tachycardia | sepsis (confusion may be the first sign in older adults) |
| sudden dyspnea + pleuritic pain + tachycardia after surgery or immobility | pulmonary embolism |
| crushing chest pain + diaphoresis + nausea | myocardial infarction |
| unilateral leg swelling + warmth + calf tenderness | deep vein thrombosis |
| headache + visual changes + epigastric pain in pregnancy over 20 weeks | preeclampsia moving toward severe |
| polyuria + polydipsia + fruity breath + Kussmaul respirations | diabetic ketoacidosis |
| restlessness + rising BP + widening pulse pressure + slowing pulse | increasing intracranial pressure (Cushing triad forming) |

Prioritizing hypotheses is risk-ranking, not diagnosis: the working problem is the one that is most LIKELY and most LETHAL-if-missed, and those are not always the same option. The exam's phrasing — "at highest risk for," "the priority concern" — asks you to weight probability against consequence. A post-op client with sudden dyspnea COULD have anxiety; the working problem is embolism, because being wrong about anxiety costs nothing and being wrong about PE costs the client.

This is also where "worst first" thinking from prioritization plugs in: the hypothesis you act on first is the one whose window for action closes fastest.`,
      examTip: `When two hypotheses fit the cues, choose the one that kills faster if ignored — the exam ranks by consequence-weighted likelihood, and "rule out the lethal one" beats "name the common one."`,
    },
    {
      id: 'cjm-action',
      title: `3. Taking Action: First, Best & In What Order`,
      content: `Action questions compress the whole model into one verb choice, and three patterns decide most of them.

Assess before you intervene — unless the stem already assessed. If the question gives you raw symptoms ("the client reports dizziness"), gathering the decisive data point (blood pressure, glucose) is usually first. If the stem HANDS you the assessment ("BP 78/50, client diaphoretic"), re-assessing is a stall — the answer is the indicated action. The wrong-answer pattern is assessment-as-avoidance: taking vitals on a client who is visibly not breathing.

Least invasive that works, fastest that matters. Reposition before suctioning; oxygen before intubation options; oral before IV when the client can swallow and time permits — but when the scenario is emergent, the definitive action outranks the gentle ladder. The stem's acuity sets which ladder applies.

Safety sequences have fixed first steps the exam samples directly: suspected anaphylaxis — stop the infusion FIRST; tonic-clonic seizure — protect the airway by positioning, nothing in the mouth; fall with suspected injury — assess before moving; wandering client missing — search per protocol while notifying; chest pain — position, oxygen per protocol, vitals, notify, obtain the ECG per protocol.

## Nursing process, still underneath

The older ADPIE nursing process (assess, diagnose, plan, implement, evaluate) maps onto the model — recognize/analyze cues are assessment and diagnosis, prioritize/generate are planning, take action is implementation, evaluate is evaluate. Older-style questions still use its vocabulary ("during the planning phase..."), so keep both frames; they never conflict, because the model is the process with the cognition made explicit.`,
      examTip: `"FIRST" does not mean "only" — every option may be right eventually. The first action is the one that makes the next minutes safe: stop the harm, secure the airway, get the decisive data point.`,
    },
    {
      id: 'cjm-evaluate',
      title: `4. Evaluating Outcomes & Teaching Effectiveness`,
      content: `Evaluate-outcomes items close the loop: which finding shows the intervention worked — or did not? The correct answer is a MEASURED CHANGE tied to the goal of the intervention, not a repetition of the intervention or a vague "client feels better."

| Intervention | The finding that says it worked |
| --- | --- |
| bronchodilator for asthma | wheezes clearing, saturation rising, client speaking full sentences |
| furosemide for fluid overload | urine output up, crackles resolving, daily weight down |
| naloxone for opioid depression | respirations above 10 and rising, arousable |
| fluid resuscitation in hypovolemia | BP up, HR down, urine output at least 30 mL/h |
| insulin for DKA | glucose falling, anion gap closing, respirations normalizing |

Watch the direction of each parameter: heart rate FALLING is improvement in hypovolemia (compensation unwinding) but potentially deterioration in a beta-blocked bradycardic client. Evaluation reads trends against the specific goal, exactly like recognizing cues in reverse.

## Teaching evaluation and the polarity flip

For teaching items, effectiveness is a client STATEMENT that translates instruction into concrete behavior: "I will take this with a full glass of water and stay upright for 30 minutes" evaluates alendronate teaching; "I understand the medication" evaluates nothing.

The polarity flip is the most missed mechanical trap in the category: "indicates a need for FURTHER teaching" asks for the WRONG statement — hunt for the one error among three correct behaviors. Mark the polarity before reading options; readers who skim pick the best statement and miss the reversed question entirely. The same flip appears as "requires immediate follow-up" (find the dangerous finding) versus "expected finding" (find the normal one).`,
      examTip: `Before reading any option set, name the polarity out loud: am I hunting the RIGHT behavior or the WRONG one? The flip ("further teaching needed") is tested constantly because skimmers fail it reliably.`,
    },
    {
      id: 'cjm-selfcheck',
      title: `5. Self-Check`,
      content: `1. A case-study question asks: "Click to highlight the findings that require immediate follow-up." Which model step is this, and what defines a correct highlight?

2. A post-op client suddenly reports dyspnea and pleuritic chest pain; HR is 118. Name the priority hypothesis and why it outranks anxiety.

3. The stem states: "BP 82/48, skin cool and clammy, client confused." One option is "obtain a full set of vital signs." Why is it wrong?

4. Which client statement shows warfarin teaching was effective: "I will double my next dose if I miss one," "I will use a soft toothbrush and report black stools," or "I can stop the drug once I feel normal"?

5. A question asks which finding indicates furosemide was effective; one option is "the nurse administered the dose at 0900." Why is that option wrong regardless of content?

## Answers

1. Step 1, recognize cues. A correct highlight departs from THIS client's baseline AND connects to the developing problem — highlighting every abnormal value scores against you on these items.

2. Pulmonary embolism — the cluster fits, and the consequence of missing PE is death while the consequence of missing anxiety is a delayed reassurance. Consequence-weighted likelihood ranks it first.

3. The stem already contains the assessment — pressure, perfusion, and mentation are given. Re-measuring is assessment-as-avoidance; the moment calls for action on the shock picture.

4. The soft toothbrush and black-stool report — concrete bleeding-precaution behavior plus the right warning sign. The other two statements are the classic dangerous errors (dose doubling, self-discontinuation).

5. It restates the INTERVENTION, not an outcome. Evaluation requires a measured change toward the goal — output, weight, breath sounds — and an option describing what the nurse did can never evaluate whether it worked.`,
    },
  ],
  keyTakeaways: [
    `Name the model step before the options: it dictates whether the answer is a finding, a condition, a risk, an action, or an outcome.`,
    `Relevant beats abnormal — cues are read against this client's baseline and the presenting problem, and highlighting everything scores negative.`,
    `Prioritize hypotheses by consequence-weighted likelihood: rule out what kills fastest, not what occurs most.`,
    `Assess first only until the stem hands you the assessment — then act; the first action is the one that makes the next minutes safe.`,
    `Evaluation is a measured change toward the goal, teaching effectiveness is a concrete behavior statement, and the "further teaching" polarity flip is hunted, not skimmed.`,
  ],
},

nx_prioritization: {
  topicId: 'nx_prioritization',
  title: `Prioritization, Delegation & Assignment`,
  domainWeight: 'Management of Care (15-21%)',
  overview: `Management of Care is the heaviest category on the exam, and prioritization-delegation questions are its core. These items simulate the real shift: four clients, one nurse, which door first? Or: a team of an RN, an LPN, and assistive personnel — who can safely do what? The rules are learnable, the frameworks are few, and the same patterns repeat endlessly. This chapter turns them into a decision procedure you can run under time pressure: the four-rung priority cascade, an instability radar, the full delegation scope table, assignment and floating logic, and the inverted rules of disaster triage.`,
  sections: [
    {
      id: 'prio-frameworks',
      title: `1. Who Do You See First — The Framework Stack`,
      content: `![The prioritization cascade: worst ABC wins, then unstable beats stable, then acute beats chronic, then Maslow — applied in order, stopping at the first rung that separates the clients.](/courses/nclex/figures/nclex-priority-cascade.svg)

Every "which client first" item resolves through the same short stack of frameworks, applied in order. The skill is not memorizing them — it is stopping at the FIRST rung that separates the clients, instead of arguing all four.

## Rung 1: worst ABC wins

Airway compromise beats breathing problems beats circulation problems. Stridor, gurgling, an obstructed tracheostomy, or a swelling neck hematoma after thyroidectomy outranks nearly everything on the board. Two caveats the exam loves:

An ACTUAL problem beats a POTENTIAL one at every rung. A client currently wheezing outranks a client at risk of aspiration. Do not let "airway" in a stem about risk trump "breathing" in a stem about an event in progress.

In cardiac arrest, current resuscitation guidance runs circulation first (CAB) — compressions before airway maneuvers. For triage-style "who first" questions outside of arrest, airway leads.

## Rung 2: unstable beats stable

New, changing, or unexpected findings outrank chronic, known, expected ones. A client with COPD and a chronic oxygen saturation of 91% is at their baseline; a post-operative client whose saturation just dropped from 98% to 91% is a trend heading somewhere. Same number, opposite priority.

## Rung 3: acute beats chronic, unexpected beats expected

Pain of 8/10 two days after abdominal surgery is expected and managed; sudden severe pain with a rigid abdomen in the same client is a possible dehiscence or bleed and jumps the line. Ask of every finding: is this what the textbook says this condition does at this point in its course? If yes, it can usually wait behind anything that is not.

## Rung 4: Maslow, when nothing physiologic is on fire

Physiologic needs, then safety, then psychosocial. The tearful client asking to talk matters — after the client whose IV antibiotic is an hour overdue. But do not use Maslow to zero out psychosocial forever: a client expressing suicidal intent is a SAFETY emergency and outranks routine physiologic care.

| Framework | The rule | The stem signal |
| --- | --- | --- |
| ABC | actual airway > breathing > circulation | stridor, gurgling, obstructed airway, uncontrolled bleeding |
| Unstable vs stable | new or changing beats known baseline | "suddenly," "new onset," a changed vital-sign trend |
| Acute vs chronic | unexpected-for-course beats expected | finding that does not match the condition's script |
| Maslow | physiologic > safety > psychosocial | no one deteriorating; needs of different kinds compete |
| Least restrictive | try the smallest intervention first | restraint, seclusion, or limit-setting options offered |`,
      examTip: `When two options both look urgent, ask which client dies or deteriorates FIRST if you walk past their door. That reframing resolves most ties faster than re-deriving frameworks.`,
    },
    {
      id: 'prio-instability',
      title: `2. Reading Instability: Expected vs Unexpected`,
      content: `The single most tested discrimination in this category is not a fact — it is a judgment: is this finding the condition behaving as the textbook says it behaves, or is it a departure? Departures get seen first. Train the reflex on classic pairs:

| Expected — can wait | Unexpected — see first |
| --- | --- |
| COPD client at chronic saturation 90-92% on 2 L | post-op client whose saturation fell 98% to 91% over an hour |
| pain 8/10 on post-op day 2, controlled with the ordered regimen | sudden severe pain with a rigid, board-like abdomen |
| known atrial fibrillation, rate-controlled, on anticoagulation | new irregular pulse WITH hypotension or chest pain |
| chronic stable angina relieved by rest and nitroglycerin | chest pain unrelieved by rest — possible infarction |
| long-standing tracheostomy managing usual secretions | fresh tracheostomy with thick secretions and noisy air movement |
| expected lochia rubra on postpartum day 1 | saturating a pad in 15 minutes — hemorrhage |
| serous drainage on a surgical dressing | sudden gush of pink fluid — possible dehiscence/evisceration |

## The trending rule

A trend beats any snapshot. Four blood-pressure readings drifting 128, 118, 104, 92 with a rising pulse describe compensating hemorrhage even though no single reading screams. NGN trend items are built exactly here: read series, not points, and act when the trajectory declares itself — before the last number becomes catastrophic.

## Red flags that jump every line

Some findings simply end the sorting: stridor or a silent chest in an asthmatic (obstruction, not improvement); new confusion in an older adult (hypoxia, sepsis, or stroke until proven otherwise); "the worst headache of my life"; chest pain with diaphoresis and nausea; an absent distal pulse after casting or vascular surgery; arterial bleeding; a client stating suicidal intent with a plan and means. If one of these is among the options, the question is over.`,
      examTip: `Numbers only matter against the client's baseline and trajectory. The exam gives you the baseline for a reason — a "normal" value can be the emergency when the last value was higher.`,
    },
    {
      id: 'prio-delegation',
      title: `3. Delegation: The Five Rights and the Scope Table`,
      content: `Delegation questions test scope boundaries, and nearly every one resolves on two axes: how STABLE the client is, and whether the task involves ASSESSMENT, TEACHING, or EVALUATION — the triad that never leaves the RN.

The five rights of delegation: the right task, under the right circumstance, to the right person, with the right direction (clear expectations and limits), and the right supervision (follow-up and availability). The RN who delegates retains accountability for the DECISION to delegate; the delegatee is accountable for their own performance of the task.

| Task | AP/UAP | LPN/LVN | RN |
| --- | --- | --- | --- |
| hygiene, bathing, bed-making (stable client) | yes | yes | yes |
| vital signs on a STABLE client | yes — RN interprets | yes | yes |
| intake, output, daily weights | yes | yes | yes |
| feeding a client WITHOUT swallowing precautions | yes | yes | yes |
| ambulation per an established plan | yes | yes | yes |
| oral, subcutaneous, IM medications | no | yes (most states) | yes |
| sterile procedures: wound care, catheter insertion | no | yes | yes |
| REINFORCE teaching the RN initiated | no | yes | yes |
| focused data collection (a wound description, lung sounds) | no | yes | yes |
| initial and ongoing assessment | no | no | yes |
| INITIAL teaching; discharge teaching | no | no | yes |
| IV push medications; titrated drips | no | no | yes |
| blood products — start and first 15 minutes | no | no | yes |
| care planning and evaluating outcomes | no | no | yes |
| anything on an UNSTABLE client | no | no | yes |

## The traps

"Stable" is the load-bearing word in every stem. The same task flips between delegable and not on that one adjective. Vital signs on a fresh post-operative client are not a vital-signs task — they are assessment data driving immediate decisions, so the RN takes them. Feeding a client with NEW dysphagia is a swallowing assessment in disguise. The first set of vital signs after starting a blood transfusion belongs to the RN, because it IS the evaluation of a high-risk intervention.

AP never assess, never teach, never evaluate, never administer medications, and never take verbal or telephone orders. When a stem shows an AP reporting a concerning finding, the correct RN response is to assess the client personally — not to send the AP back for a recheck.`,
      examTip: `Read the verb. "Reinforce" teaching is LPN-eligible; "teach," "assess," "evaluate," and "develop the plan" are RN verbs no matter how routine the topic sounds.`,
    },
    {
      id: 'prio-assignment',
      title: `4. Assignments, Floating & Safe Refusal`,
      content: `Assignment questions extend delegation logic to whole clients: the RN takes the unstable, the fresh post-op, the new admission, the client needing initial teaching or blood; the LPN takes stable clients with predictable treatments; AP support tasks across the group.

## Worked example: distributing a four-client team

The charge nurse has an RN, an LPN, and an AP for: (A) a client two hours post-thyroidectomy; (B) a client with stable heart failure awaiting discharge teaching; (C) a client three days post-hip-replacement needing help bathing; (D) a new admission with chest pain being ruled out for MI.

Work the logic: A is a fresh post-op with a high-risk airway (neck hematoma, laryngeal edema) — RN. D is a new admission, unstable until proven otherwise, needing an initial assessment — RN. B is stable, but discharge TEACHING is an RN function: the LPN can take B's routine care while the RN does the teaching, or B goes to the RN team outright. C's hygiene needs are exactly AP scope. The pattern generalizes: sort clients by instability first, then match the RN-only functions, then fill in with LPN and AP scope.

## Floating

A nurse floated to an unfamiliar unit does not refuse outright — walking away from an accepted assignment risks abandonment — and does not silently accept unsafe work. The tested sequence: report to the unit, state competencies honestly, accept the tasks within them, and negotiate unfamiliar high-risk work (chemotherapy, titrated drips, ventilator management) to the unit's own staff. A medical-surgical nurse floated to pediatrics takes the stable school-age clients, not the infant on a high-alert infusion.

## When the assignment is unsafe

If the charge nurse insists, the escalation path is the chain of command — charge nurse, then supervisor — plus a written protest or assignment-despite-objection form where the institution provides one. Filing the form does NOT release the nurse from caring for the clients in the meantime; it documents the objection while keeping them safe. Refusing an assignment for personal preference is insubordination; refusing to perform a task you are not competent in, while remaining on duty and escalating, is safe practice.`,
      examTip: `Two different failure modes, two different words: leaving clients after accepting them is ABANDONMENT; accepting work you cannot safely perform without speaking up is unsafe practice. The correct answers thread between them — stay, speak, escalate, document.`,
    },
    {
      id: 'prio-disaster',
      title: `5. Disaster & Mass-Casualty Triage`,
      content: `The phrase "mass casualty" or "disaster" in a stem flips the everyday rules: care goes to the salvageable MANY, not the sickest one. The sickest client — the one everyday triage would see first — may be tagged expectant so that limited resources save three others. Recognizing which rulebook the question is using is most of the answer.

| Tag | Category | Criteria (START pattern) | Example |
| --- | --- | --- | --- |
| green | minimal — "walking wounded" | can walk to a designated area | abrasions, small lacerations, anxiety |
| yellow | delayed | significant injuries, but respirations, perfusion, and mental status all pass | closed femur fracture with a strong radial pulse |
| red | immediate — treat first | respirations over 30, absent radial pulse or cap refill over 2 seconds, or cannot follow commands | tension chest injury, major bleed with thready pulse |
| black | expectant | not breathing after one attempt to reposition the airway | apneic after airway repositioning |

The START screen runs in that order — respirations, perfusion, mental status — and the FIRST failed check tags the client red. Anyone who can get up and walk is green before you screen anything. The client in cardiac arrest, who would command the entire team on a normal shift, is black when the hallway holds twenty casualties.

Two more disaster reflexes the exam samples: in an evacuation, ambulatory clients move first (they clear fastest with the least staff), then wheelchair, then bedbound — the reverse of "sickest first." And the nurse's own safety comes before rescue: a scene that is not secure produces more casualties, not more rescuers.`,
      examTip: `Everyday triage saves the sickest first. Disaster triage saves the MOST people. The stem tells you which world you are in — one phrase, opposite answers.`,
    },
    {
      id: 'prio-selfcheck',
      title: `6. Self-Check: Five Doors`,
      content: `Work each before reading its answer.

1. Four clients: a COPD client at saturation 91% (baseline), a post-op client reporting 8/10 incisional pain, a client whose new tracheostomy is producing noisy, gurgling respirations, and a client asking to discuss discharge plans. Who first?

2. The AP reports a blood pressure of 88/54 on a client who was 132/80 an hour ago. Best RN action?

3. Which task is appropriate to delegate to an LPN: initial assessment of a new admission, IV push furosemide, reinforcing crutch-walking teaching, or starting a unit of packed cells?

4. A medical-surgical nurse is floated to the oncology unit and asked to administer chemotherapy. Best response?

5. At a highway mass-casualty scene, a client is apneic and remains apneic after the airway is repositioned. Which tag?

## Answers

1. The tracheostomy client — an actual airway problem outranks expected baselines, expected post-op pain, and psychosocial needs. This is rung 1 of the cascade, and the sorting stops there.

2. Go assess the client personally. The AP's number is valid data, but a falling pressure is instability, and instability recalls the assessment to the RN — not a recheck delegated back to the AP.

3. Reinforcing crutch-walking teaching. Initial assessment, IV push medications, and blood administration are RN-only; reinforcement of established teaching is squarely LPN scope.

4. State the competency limit, accept the care within scope, and arrange for a chemotherapy-competent nurse to give that drug. Refusing the whole float risks abandonment; silently administering an unfamiliar high-alert drug is unsafe.

5. Black — expectant. In the mass-casualty rulebook, apnea persisting after one airway repositioning is not survivable with the resources at hand; staying to resuscitate would cost other salvageable lives.`,
    },
  ],
  keyTakeaways: [
    `Run the cascade in order and stop at the first rung that separates the clients: worst ACTUAL airway-breathing-circulation problem, then unstable over stable, then acute over chronic, then Maslow.`,
    `A trend beats a snapshot, and every number is read against baseline — the "normal" value that used to be higher is the emergency.`,
    `Assessment, teaching (initial), and evaluation never leave the RN; "stable" is the word that decides whether anything else can be delegated.`,
    `Floating: report, state competencies, accept what is within them, negotiate the rest — abandonment and silent unsafe acceptance are both wrong.`,
    `"Mass casualty" inverts triage: save the most, not the sickest — red goes first, and apnea after one airway repositioning is expectant.`,
  ],
},

nx_legal_ethical: {
  topicId: 'nx_legal_ethical',
  title: `Legal & Ethical Practice`,
  domainWeight: 'Management of Care (15-21%)',
  overview: `Legal and ethical items are not about memorizing law — they test whether you can protect the client's rights and your license at the same time, inside one scenario. Five clusters cover nearly everything the exam asks: informed consent and refusal, the tort vocabulary, documentation and unsafe orders, the strict clock on restraints, and the ethics-HIPAA-mandatory-reporting triad. Each has a small set of bright-line rules, and the distractors are always the almost-right actions that cross one of them.`,
  sections: [
    {
      id: 'leg-consent',
      title: `1. Informed Consent & the Right to Refuse`,
      content: `Informed consent is a PROCESS that belongs to the provider performing the procedure; the nurse's signature witnesses only that the client signed voluntarily and appeared competent. That division of labor decides most consent items.

| Element | What it requires |
| --- | --- |
| capacity | adult (or lawfully authorized) client who can understand and decide — not sedated, not declared incompetent |
| disclosure | the provider explains the procedure, its risks and benefits, and the alternatives INCLUDING doing nothing |
| voluntariness | no coercion — consent signed under pressure is not consent |

If the client says "I signed, but what exactly are they doing to my heart?" — the consent is not informed. The nurse stops the line, notifies the provider, and the provider re-explains. The nurse never fills the knowledge gap for a procedure someone else performs; teaching about nursing care is nursing scope, explaining the surgery is not.

## Who signs

| Situation | Who consents |
| --- | --- |
| competent adult | the client — no spouse or family signature substitutes |
| emancipated minor (married, in the military, court-emancipated) | the minor |
| minor (not emancipated) | parent or legal guardian |
| adult declared incompetent | legal guardian or healthcare proxy |
| life-threatening emergency, client unable, no surrogate | implied consent — treatment proceeds |
| parents refuse life-saving treatment for a minor | providers may seek a court order |

## Refusal and leaving against medical advice

A competent adult may refuse any treatment — including blood products, including life-sustaining care — and may leave against medical advice. The nurse's tested sequence: assess understanding, inform the provider, explain the risks of leaving without threatening ("we cannot readmit you" is false and coercive), have the AMA form offered, and document. Refusing to sign the form does not stop a competent client from leaving; blocking the door converts the scenario into false imprisonment.`,
      examTip: `Client questions about the PROCEDURE always route to the provider; the nurse witnesses signatures and advocates. An answer where the nurse explains the surgery's risks is wrong even when the explanation is accurate.`,
    },
    {
      id: 'leg-torts',
      title: `2. Torts: The Exam's Legal Vocabulary`,
      content: `The exam tests torts by scenario, not definition — it describes an action and asks what it constitutes.

| Tort | Definition | Classic exam scenario |
| --- | --- | --- |
| assault | a threat that creates fear of contact | "if you do not take this pill, I will hold you down and inject it" |
| battery | touching or treating without consent | surgery on a client who revoked consent; forcing the injection |
| false imprisonment | unlawful restriction of movement | restraints without an order; blocking a competent client from leaving |
| invasion of privacy | disclosure or intrusion without need | discussing a diagnosis in the elevator; reading a chart out of curiosity |
| defamation | false statement harming reputation — slander (spoken), libel (written) | telling a colleague an untrue rumor about a client or coworker |
| negligence | failing the ordinary standard of care | leaving rails down for a fall-risk client who then falls |
| malpractice | professional negligence | giving the wrong medication and causing harm |

## The four elements of malpractice

All four must exist, in order: DUTY (a nurse-client relationship existed), BREACH (the standard of care was violated), CAUSATION (the breach caused the injury), and DAMAGES (actual harm resulted). A medication error that caused no harm fails the damages element — an incident to report and learn from, but not malpractice. The exam builds distractors on the missing element.

Good Samaritan laws protect care rendered voluntarily at an emergency scene, in good faith, within scope, and without gross negligence — they do not cover paid duty or reckless acts, and no state compels a nurse to stop.`,
      examTip: `Assault is the THREAT; battery is the TOUCH. The exam pairs them in one stem and asks which occurred — parse the scenario into words versus contact.`,
    },
    {
      id: 'leg-docs',
      title: `3. Documentation, Incident Reports & Unsafe Orders`,
      content: `The chart is a legal record, and the exam's documentation rules are bright lines:

| Do | Do not |
| --- | --- |
| chart objectively what you observed, heard, measured | chart conclusions ("client is drunk") — describe findings instead |
| quote the client's own words for subjective data | interpret or paraphrase into diagnosis |
| label a late entry as a late entry, with both times | insert notes into an earlier time slot |
| correct errors with a single line, initials, and date | erase, obliterate, or use correction fluid |
| chart care AFTER it is given | pre-chart anything — a pre-charted dose you never gave is a false record |

## Incident reports

An incident (occurrence, variance) report is completed by the person who WITNESSED or discovered the event, for every error and near-miss — including those with no client harm. Two rules carry the points: the report is an internal quality tool, and the chart NEVER mentions that one was filed; the chart documents only the facts of the event and the care given. "Incident report completed" in a nurse's note is the classic wrong answer.

## Verbal, telephone, and unsafe orders

Verbal and telephone orders are for emergencies and off-site providers, not convenience: write it down, READ IT BACK, confirm, and ensure the provider co-signs within the institution's window. Only the RN or LPN receives them — never AP, never students.

An order that is unclear, unsafe, or outside the client's condition obligates the nurse to QUESTION it before executing — the nurse who administers an unsafe order shares liability with the prescriber. The sequence: clarify with the prescriber directly; if the answer does not resolve the safety concern, decline to carry it out and escalate the chain of command (charge nurse, supervisor), documenting the communication. Simply skipping the dose without notifying anyone is never the answer.`,
      examTip: `Two absolutes worth points: the chart never references the incident report, and no dose is ever charted before it is given.`,
    },
    {
      id: 'leg-restraints',
      title: `4. Restraints & Seclusion: Last Resort, Strict Clock`,
      content: `Restraints — physical, chemical, or seclusion — are the LAST resort after less restrictive alternatives fail: reorientation, a sitter or family presence, moving the client near the station, diversion, treating the cause of agitation. The exam expects you to try the least restrictive option in the stem before any restraint answer becomes correct.

The order rules are strict. A provider's order is required, based on a face-to-face evaluation; for violent or self-destructive behavior the provider evaluates in person within one hour. Orders are time-limited and never PRN — "restrain as needed" is an illegal order to refuse. In an emergency the nurse may apply restraints first, but the order must follow immediately.

| Client (behavioral/violent restraint) | Maximum single order |
| --- | --- |
| adult 18 and older | 4 hours |
| age 9 through 17 | 2 hours |
| under age 9 | 1 hour |

Renewals require reassessment, and nonviolent (medical) restraints — the wrist ties protecting a confused client's endotracheal tube — are renewed per policy, typically each calendar day. The goal at every reassessment is discontinuation at the earliest possible moment.

## Applying and monitoring

Secure ties with a quick-release knot to the BED FRAME or chair frame — never to a side rail, which moves with the rail and tightens. Leave two fingers of slack under the device. Monitor circulation, skin, and behavior on the institution's schedule (every 15 minutes is typical for behavioral restraints), and release for range of motion, toileting, fluids, and skin care at least every 2 hours. Document the behavior that justified the restraint, the alternatives tried, the client's response, and every monitoring cycle.`,
      examTip: `Numbers the exam samples directly: face-to-face within 1 hour; orders 4 h adult / 2 h ages 9-17 / 1 h under 9; never PRN; frame not rail; two fingers of slack; release q2h.`,
    },
    {
      id: 'leg-ethics',
      title: `5. Ethics, HIPAA & Mandatory Reporting`,
      content: `Ethics items give you a principle in action and ask you to name it, or give you a conflict and ask which principle the correct action serves.

| Principle | Meaning | One-line example |
| --- | --- | --- |
| autonomy | the client decides | honoring a refusal you disagree with |
| beneficence | act for the client's good | positioning, comfort, advocacy |
| nonmaleficence | first, do no harm | questioning the tenfold dose |
| justice | fair distribution of care | equal triage regardless of ability to pay |
| fidelity | keep promises | returning with the pain med when you said you would |
| veracity | tell the truth | not minimizing a serious prognosis when the client asks |

The classic collision is autonomy versus beneficence — the client refuses what would help them. Competent refusal wins; the nurse ensures the refusal is informed, then advocates and documents.

## HIPAA in scenarios

Access follows the need to know: caregivers currently caring for the client, and no one else. Tested violations: discussing clients in elevators and cafeterias, looking up records of clients not assigned to you (including family and celebrities), leaving a screen unlocked, giving information to a phone caller who lacks the client's code or consent, and posting anything — even de-identified-sounding details — on social media. Information may be shared without authorization for treatment, payment, operations, and legally mandated reports.

## Mandatory reporting

Nurses are mandated reporters of SUSPECTED abuse or neglect of children, elders, and vulnerable adults — suspicion triggers the report; proof is the investigator's job, not the nurse's. Certain communicable diseases are reportable to public health, and gunshot and stab wounds to law enforcement, per jurisdiction. An impaired coworker — alcohol on the breath, diverted narcotics, erratic behavior — is reported to the supervisor IMMEDIATELY; the tested wrong answers are confronting them privately, covering their assignment, or waiting to gather proof. Client safety outranks collegial loyalty.`,
      examTip: `For any confidentiality stem, run one test: does this person need this information to care for this client right now? If not, sharing it is a violation — regardless of relationship, rank, or good intentions.`,
    },
    {
      id: 'leg-selfcheck',
      title: `6. Self-Check`,
      content: `1. A client on the pre-op cart says, "The surgeon mentioned risks, but I do not really understand what could go wrong." The consent is signed. Best action?

2. A nurse tells a confused client, "If you get out of bed again, I will tie you down." Which tort does this describe, and which occurs if the nurse follows through without an order?

3. A nurse gives 10 mg of a drug when 1 mg was ordered; the client suffers no ill effect. Is this malpractice? What two actions follow?

4. A provider orders "restraints PRN for agitation" for a 15-year-old. What is wrong with this order — two things?

5. A nurse overhears a colleague giving a client's lab results to the client's employer by phone. Which principle and law are violated, and what is the nurse's obligation?

## Answers

1. Stop the process and notify the surgeon to re-explain — the client's statement voids the "informed" element. The nurse does not supply the surgical risk discussion.

2. The threat is assault. Applying restraints without an order (absent emergency) adds battery and false imprisonment — one stem, three torts, in that order.

3. Not malpractice — duty, breach, and causation exist, but there are no damages. The error is still charted factually in the record, and an incident report is completed (and never referenced in the chart).

4. Restraint orders may never be PRN, and for a 15-year-old a behavioral restraint order is limited to 2 hours — both violations, either alone invalidates the order.

5. Confidentiality (HIPAA) and the client's autonomy over their information — an employer has no treatment need to know. The nurse reports the breach to the supervisor; institutional obligations to address it follow.`,
    },
  ],
  keyTakeaways: [
    `Consent belongs to the provider; the nurse witnesses, advocates, and stops the line when the client's questions reveal the consent is not informed.`,
    `Assault is the threat, battery is the touch, false imprisonment is the blocked door — and malpractice requires all four: duty, breach, causation, damages.`,
    `The chart holds facts only: no pre-charting, single-line corrections, labeled late entries, and never a mention of the incident report.`,
    `Restraints are last resort on a strict clock — never PRN, 4 h adult / 2 h ages 9-17 / 1 h under 9, quick-release to the frame, release q2h.`,
    `Report suspected abuse and impaired colleagues immediately — suspicion triggers the duty, and client safety outranks loyalty.`,
  ],
},

nx_infection_control: {
  topicId: 'nx_infection_control',
  title: `Infection Control & Precautions`,
  domainWeight: 'Safety and Infection Prevention and Control (10-16%)',
  overview: `Infection control is one of the most learnable point sources on the exam: a finite set of organisms, three transmission-based precaution categories, one donning-doffing sequence, and a handful of absolute rules (soap for C. diff, N95 and negative pressure for TB, protective environment for neutropenia). This chapter builds the tables you need, the organism-to-precaution map the exam samples constantly, and the sterile-technique rules that decide procedure questions.`,
  sections: [
    {
      id: 'inf-standard',
      title: `1. The Chain of Infection & Standard Precautions`,
      content: `Every infection-control intervention breaks one link in the chain: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, susceptible host. The exam's favorite link is TRANSMISSION — that is what the precaution categories are — but stems also test reservoirs (contaminated equipment, water in respiratory tubing) and hosts (why the neutropenic client gets special rules).

Standard precautions apply to EVERY client, every time, regardless of diagnosis: hand hygiene, gloves for any contact with blood or body fluids, mask and eye protection when splash is possible, safe injection practice, and respiratory etiquette. They are the reason "no precautions needed" is never literally true.

## Hand hygiene — the highest-yield habit on the exam

Alcohol-based hand rub is preferred for most encounters: before and after every client contact, before aseptic tasks, after removing gloves (gloves are not a substitute — hands are contaminated during removal), after touching the client's surroundings.

Soap and water is REQUIRED — not optional — when hands are visibly soiled and after caring for a client with Clostridioides difficile or norovirus: alcohol does not kill C. diff spores. This single fact is one of the most retested points in the category.

Artificial nails harbor organisms and are prohibited in direct care; natural nails stay short. Wash a minimum of 20 seconds with friction; friction is the mechanism, not the soap brand.`,
      examTip: `See "C. diff" anywhere in a stem and audit the answers for two things: SOAP AND WATER (not alcohol rub) and a bleach-based (sporicidal) room clean. Most C. diff items are decided on one of the two.`,
    },
    {
      id: 'inf-transmission',
      title: `2. Transmission-Based Precautions: The Master Table`,
      content: `Transmission-based precautions are ADDED to standard precautions when the organism's route demands more. The exam expects instant recall of the category, the gear, and the room:

| Category | PPE added | Room | Classic organisms |
| --- | --- | --- | --- |
| contact | gown + gloves for every entry | private or cohort; dedicated equipment | MRSA, VRE, C. difficile, scabies, RSV, major draining wounds, norovirus |
| droplet | surgical mask within 3-6 feet | private or cohort; mask ON THE CLIENT for transport | influenza, pertussis, mumps, rubella, meningococcal meningitis (first 24 h of effective antibiotics) |
| airborne | fit-tested N95 or PAPR | NEGATIVE-pressure room, door closed, 6-12 air exchanges/hour | tuberculosis, measles (rubeola), varicella, disseminated zoster |

Memory anchor for airborne: measles, varicella, TB — the small-particle organisms that ride air currents beyond six feet. Everything else respiratory is droplet.

## The details that decide close questions

For measles and varicella, non-immune staff should not enter at all; immune caregivers still follow airborne gear rules per policy. Varicella and disseminated zoster take airborne PLUS contact (lesions shed virus by touch); localized zoster in an immunocompetent client with covered lesions needs standard precautions only.

Meningococcal meningitis is droplet only until 24 hours of effective antibiotics have run — after that, precautions lift. Pertussis stays droplet until 5 days of effective therapy.

Transport rules invert the gear: the CLIENT wears the surgical mask (droplet and airborne both — an N95 is never put on the client), lesions are covered, and transport happens only when essential.

A client on any precaution category is at risk for sensory deprivation and isolation distress — the psychosocial answer (schedule regular contact, explain the gear, provide diversion) is correct surprisingly often once the physical rules are satisfied.`,
      examTip: `Airborne = "My Chicken Hez TB" — Measles, Chickenpox (varicella), Herpes zoster (disseminated), TB. If the organism is not on that list, it is not airborne, no matter how bad the cough sounds.`,
    },
    {
      id: 'inf-ppe',
      title: `3. PPE: The Sequence and the N95`,
      content: `![CDC donning and doffing order: don gown, mask or respirator, goggles or face shield, then gloves; doff gloves, goggles, gown, then mask — with hand hygiene before donning, after doffing, and whenever hands are contaminated.](/courses/nclex/figures/nclex-ppe-sequence.svg)

Donning runs clean-to-dirty logic: GOWN first, MASK or respirator second (seal-check the respirator), GOGGLES or face shield third, GLOVES last — pulled over the gown cuffs. Doffing removes the most contaminated items first: GLOVES, then goggles or face shield, then gown (peeled inside-out from the shoulders), then mask or respirator — touched only by the straps.

Two placement rules the exam samples: the mask or respirator for an AIRBORNE room is removed OUTSIDE the closed door (the room air is the hazard), and hand hygiene happens after every doffing step where hands may have been contaminated, always at the end, and any time removal goes wrong.

The N95 respirator requires annual fit-testing and a user seal check at every don. Facial hair breaks the seal; a client's family member visiting an airborne room wears a surgical mask if not fit-tested. A PAPR substitutes when fit-testing fails.

Gloves change between tasks on the SAME client when moving from a contaminated site to a clean one (wound care, then IV site care means new gloves and hand hygiene between), and gowns are single-use per room entry on contact precautions — reusing a gown "because it looks clean" is a tested wrong answer.`,
      examTip: `Order questions are free points: don gown-mask-goggles-gloves; doff gloves-goggles-gown-mask. Gloves are LAST on and FIRST off — everything else follows from that.`,
    },
    {
      id: 'inf-organisms',
      title: `4. Problem Organisms & the Protective Environment`,
      content: `A short list of organisms carries special rules the exam tests by name:

| Organism / situation | The special rule |
| --- | --- |
| C. difficile | contact precautions + SOAP AND WATER + sporicidal (bleach) cleaning; review the antibiotic and PPI list driving it |
| tuberculosis | airborne, N95, negative pressure; confirmed by sputum cultures; client masked (surgical) for transport; therapy runs months — teaching targets adherence |
| MRSA / VRE | contact; dedicated equipment (the shared blood-pressure cuff is the classic vector) |
| RSV in infants | contact (droplet per policy); cohorting common in season |
| norovirus | contact; soap and water beats alcohol rub here too |
| scabies / lice | contact until 24 h after effective treatment |
| neutropenia (ANC under 500) | PROTECTIVE environment — the isolation arrow reverses |

## The protective environment

For the immunocompromised client the world is the hazard: private room (positive-pressure with HEPA filtration for stem-cell transplant clients), strict hand hygiene for every entrant, no fresh flowers or standing water, no raw or undercooked foods per policy (the low-microbial diet), daily inspection of every line site, no rectal temperatures or suppositories (mucosal injury seeds bacteremia), and visitors screened for even minor illness. A temperature of 38 C / 100.4 F in a neutropenic client is a MEDICAL EMERGENCY — cultures and antibiotics within the hour, and the exam expects you to treat that page as a now problem.`,
      examTip: `Read the direction of protection. Contact/droplet/airborne protect everyone FROM the client; the protective environment protects the CLIENT from everyone. Neutropenia, not diagnosis, is the trigger word.`,
    },
    {
      id: 'inf-asepsis',
      title: `5. Sharps, Exposure & Surgical Asepsis`,
      content: `Sharps rules are absolute: never recap a used needle (the classic exception — recapping with a one-handed scoop only when a safety device is absent and policy allows), activate safety devices immediately, dispose at the point of use in the puncture-proof container, and never force a full container. After a needlestick: wash with soap and water immediately, report at once, and begin the post-exposure protocol (source and exposed testing, prophylaxis timing decisions) — delay is the tested error.

## Surgical asepsis: the sterile field rules

Medical asepsis (clean technique) reduces organisms; surgical asepsis (sterile technique) excludes them — required for injections, central line care, catheter insertion, and surgical procedures. The field rules are mechanical and testable:

A 1-inch border around every sterile field is considered contaminated. Anything below the waist or table level is contaminated. Turning your back on a sterile field, reaching across it, or letting it out of sight contaminates it. Sterile touches only sterile; sterile-to-clean contact contaminates. Moisture wicks organisms upward — a wet spot on the drape contaminates the field (strike-through). Open sterile packages away from the body first, flaps toward you last. Pour liquids from 4-6 inches above the receptacle without touching it, and pour off a lip-splash first if policy requires. When in doubt about sterility, it is contaminated — replace it.

If contamination happens mid-procedure, the correct answer is always to stop and replace the contaminated item or field — never to proceed because the procedure is nearly done.`,
      examTip: `"When in doubt, throw it out" is literally the tested standard: any answer that continues with questionable sterility is wrong, and any answer that restarts cleanly is a candidate.`,
    },
    {
      id: 'inf-selfcheck',
      title: `6. Self-Check`,
      content: `1. A client is admitted with suspected pulmonary tuberculosis. List the room, the staff PPE, and what the client wears for an essential CT transport.

2. Which client may share a room (cohort): two clients with MRSA in surgical wounds, or a client with MRSA and a client with VRE?

3. After caring for a client with C. difficile, the nurse's hands are not visibly soiled. Alcohol rub or soap? Why?

4. Rank the doffing order for gown, gloves, goggles, and N95 after leaving an airborne-precaution room — and where does the N95 come off?

5. A neutropenic client's dinner tray arrives with a garden salad and a vase of flowers. What does the nurse do?

## Answers

1. Negative-pressure room with the door closed; fit-tested N95 (or PAPR) for every entrant; the client wears a SURGICAL mask for transport — never an N95 on the client.

2. The two MRSA clients — cohorting requires the SAME organism. MRSA plus VRE cross-colonizes two organisms between two clients.

3. Soap and water. Alcohol does not kill C. difficile spores; the friction and rinse remove them mechanically. Visibility of soil is irrelevant to this rule.

4. Gloves first, then goggles, then gown — and the N95 last, OUTSIDE the closed door, handled by the straps, because the room's air is the hazard.

5. Remove both — raw produce and fresh flowers (standing water, soil organisms) violate the protective environment. Then check that everyone entering has performed hand hygiene, and treat any fever as an emergency.`,
    },
  ],
  keyTakeaways: [
    `Standard precautions are universal; contact, droplet, and airborne are ADDED by transmission route — and airborne is only measles, varicella, disseminated zoster, and TB.`,
    `C. difficile and norovirus demand soap and water plus sporicidal cleaning — alcohol rub fails against spores.`,
    `Don gown-mask-goggles-gloves, doff gloves-goggles-gown-mask; the respirator comes off outside the closed airborne door.`,
    `Neutropenia reverses the arrow: protective environment, no fresh flowers or raw produce, and fever 38 C / 100.4 F is a one-hour-to-antibiotics emergency.`,
    `Sterile field mechanics: 1-inch border, waist level, no turned backs, moisture equals contamination — when in doubt, replace it.`,
  ],
},

nx_client_safety: {
  topicId: 'nx_client_safety',
  title: `Client Safety: Falls, Errors & the Environment`,
  domainWeight: 'Safety and Infection Prevention and Control (10-16%)',
  overview: `Safety items reward systems thinking: the exam wants the answer that prevents the error class, not the one that scolds the individual. This chapter covers fall prevention, correct-client identification and handoffs, the high-alert medication rules and forbidden abbreviations, fire and oxygen and MRI safety, and the home-safety teaching points — each a compact set of rules the exam samples directly.`,
  sections: [
    {
      id: 'safe-falls',
      title: `1. Falls: The Most Tested Adverse Event`,
      content: `Falls are the most common inpatient adverse event, and fall stems reward layered prevention over any single device. Risk concentrates in: age over 65, previous falls (the strongest single predictor), sedating or blood-pressure medications, orthostatic hypotension, urinary urgency or frequency, impaired gait or vision, cognitive impairment, and unfamiliar environments — which is why risk is reassessed after every transfer, new medication, and status change, not just on admission.

The intervention bundle the exam expects: bed low and locked, call light and personal items within reach, non-slip footwear, adequate lighting (a night light, not darkness), clear pathways, answer call lights promptly, scheduled (hourly) rounding that offers toileting — because many falls are elimination trips — and bed or chair alarms for clients who forget to call. Orthostatic precautions: sit before standing, dangle, rise slowly, and take the blood pressure lying-sitting-standing when orthostasis is suspected (a drop of 20 systolic or 10 diastolic within 3 minutes is positive).

Two answer patterns to distrust: RESTRAINTS as fall prevention (they increase injury and are last resort under the strict rules covered in Legal & Ethical Practice), and RAISING ALL FOUR SIDE RAILS — four rails constitute a restraint, and climbing over them raises the fall height. If a client falls, assess BEFORE moving them, then notify, document factually in the chart, and complete the incident report that the chart never mentions.`,
      examTip: `History of falls is the strongest predictor on every risk tool — when a stem asks which client is at highest fall risk, the previous faller usually outranks every single-factor competitor.`,
    },
    {
      id: 'safe-identify',
      title: `2. Right Client, Right Communication`,
      content: `Client identification uses TWO identifiers — name plus date of birth or medical record number, checked against the wristband and the order — before every medication, specimen, transfusion, treatment, and transport. The room number is NEVER an identifier; neither is "the client answered to the name." For clients who cannot confirm (confused, sedated, pediatric), the band and a second source carry the identification.

Before invasive procedures, the TIME-OUT verifies right client, right procedure, right site with the whole team, and site MARKING involves the client while awake when laterality exists. Any team member may stop the line — the tested answer respects the most junior person's veto.

## Handoffs and SBAR

Communication failures drive a large share of sentinel events, so structured handoff is tested as a skill:

| SBAR step | What it carries |
| --- | --- |
| Situation | who you are, who the client is, what is happening right now |
| Background | diagnosis, relevant history, code status, current therapy |
| Assessment | your read: vitals, findings, trend — what you think is going on |
| Recommendation | what you need: orders, evaluation, transfer — by when |

Critical values and critical results are repeated back (read-back) just like telephone orders, and handoff happens at every transition of care — shift change, transfer, procedure, discharge. The tested wrong answers skip the read-back, hand off without the current assessment, or accept "they know the client" as a substitute for the structure.`,
      examTip: `Two identifiers, neither of which is the room number, before EVERY intervention — a stem that shows the nurse skipping the band check because "I know this client" is showing you the error.`,
    },
    {
      id: 'safe-meds',
      title: `3. Medication Safety: High-Alert Drugs & Forbidden Shorthand`,
      content: `Most medication errors are SYSTEM failures, and the exam rewards the systems answer: barcode scanning at the bedside, independent double checks, smart pumps with dose limits, and questioning rather than working around a warning.

High-alert medications — the ones whose errors maim — carry an independent double-check by a second nurse in most institutions:

| High-alert class | The tested rule |
| --- | --- |
| insulin | second-nurse verification of drug, dose, and route; U-100 syringes only |
| anticoagulants (heparin, warfarin) | verify dose against the current lab (aPTT/anti-Xa, INR) before giving |
| opioids | assess sedation level and respirations BEFORE the dose; naloxone available |
| concentrated electrolytes | IV potassium is NEVER given by push — always diluted, always on a pump |
| chemotherapy | dose recalculated independently against body surface area |

The rights of medication administration — right client, drug, dose, route, time, documentation, plus the client's right to refuse — apply to every dose, and the three label checks (when reaching for the container, when preparing, at the bedside) survive every technology overlay.

## Error-prone abbreviations

| Never write | Because it reads as | Write instead |
| --- | --- | --- |
| U or IU | 0 or 4, or IV | units |
| QD / QOD | each other | daily / every other day |
| trailing zero: 5.0 mg | 50 mg | 5 mg |
| naked decimal: .5 mg | 5 mg | 0.5 mg |
| MS / MSO4 / MgSO4 | morphine vs magnesium | spell the drug out |

If an error occurs: assess the client FIRST, notify the provider, monitor, document the facts (never the word "error") in the chart, and file the incident report. Punitive answers and concealment answers are always wrong; so is any answer that delays client assessment to do paperwork.`,
      examTip: `IV potassium by push is lethal and appears as a distractor precisely because an order can say it: the nurse REFUSES, dilutes per protocol, and runs it on a pump. Never-push potassium outranks "follow the order."`,
    },
    {
      id: 'safe-environment',
      title: `4. Fire, Oxygen, Electrical & MRI Safety`,
      content: `Fire response is the RACE sequence, in order: RESCUE anyone in immediate danger, ALARM (activate it and call), CONTAIN by closing doors, EXTINGUISH if small — or evacuate. Fire extinguisher operation is PASS: Pull the pin, Aim at the base of the fire, Squeeze, Sweep side to side. In a unit fire, ambulatory clients evacuate first (horizontal evacuation to the adjacent smoke compartment), oxygen zones are shut off per policy by authorized staff, and elevators are never used.

| Mnemonic | Letters | Order matters because |
| --- | --- | --- |
| RACE | Rescue - Alarm - Contain - Extinguish | people out before doors close; alarm before you fight anything |
| PASS | Pull - Aim - Squeeze - Sweep | aiming at the flames instead of the BASE spreads the fire |

Oxygen enriches combustion: no smoking or open flames anywhere near it, no petroleum products on the face, cotton bedding over synthetics to limit static, and "oxygen in use" signage. Electrical safety: no frayed cords or overloaded outlets, three-prong grounded plugs, biomedical inspection of client-owned devices, and never touching the client and faulty equipment simultaneously.

MRI is a magnet that never turns off: screen for pacemakers, implanted defibrillators, aneurysm clips, cochlear implants, metal fragments, and medication patches with foil backings (burn risk); oxygen tanks and standard equipment stay outside the 5-gauss line. The classic stem is the forgotten object — the answer stops the transport and rescreens.`,
      examTip: `RACE and PASS are pure recall points, but the exam also tests the judgment version: the FIRST action in any fire is to move the person in immediate danger — rescue outranks alarm when someone is burning, and the stem tells you who is in danger.`,
    },
    {
      id: 'safe-home',
      title: `5. Home & Community Safety Teaching`,
      content: `Home-safety items test anticipatory guidance by age and hazard:

Infants sleep ALONE, on the BACK, in a bare CRIB — no pillows, bumpers, blankets, or co-sleeping; the crib slat gap is no wider than 2-3/8 inches (6 cm). Set the water heater to 120 F (49 C) or below — scalds are a leading child injury. Small objects, latex balloons, grapes, and hot dogs are choking hazards for children under 3 (the toilet-paper-tube test approximates a dangerous size). Medications and toxics live locked and up high, in original containers; the poison-control number is posted and syrup of ipecac is NOT used — no home-induced vomiting.

Firearms are stored unloaded and locked, ammunition locked separately. Smoke alarms on every level and in sleeping areas, tested monthly; carbon monoxide detectors near sleeping areas — CO poisoning presents as headache, nausea, and confusion in a whole household with a flushed-red color, and the intervention is fresh air and emergency evaluation, never "sleep it off."

For older adults at home: remove throw rugs, light the path to the bathroom, install grab bars and rails on BOTH sides of stairs, wear shoes rather than socks, and review the medication list for sedatives and orthostatic offenders — the same fall logic as the hospital, relocated.

Car seats belong to pediatrics but are tested as safety: rear-facing as long as possible (at least to age 2 per current guidance), then forward-facing harness, then booster until the seat belt fits (typically 4 feet 9 inches, ages 8-12), and children under 13 ride in the back seat — never in front of an active airbag.`,
      examTip: `Safe-sleep stems are decided by one image: back, alone, bare crib. Any answer adding ANYTHING soft to the crib — or any position but supine — is wrong regardless of the rationale offered.`,
    },
    {
      id: 'safe-selfcheck',
      title: `6. Self-Check`,
      content: `1. Which client is at highest fall risk: an 80-year-old two days post-op, a 72-year-old who fell at home last month, a 65-year-old on a new diuretic, or a 90-year-old with stable dementia in long-term care?

2. The pharmacy sends heparin for a client whose morning aPTT is 96 seconds (therapeutic range for the protocol: 60-80). What does the nurse do before giving it?

3. A fire starts in a trash can in an empty client room. Put the nurse's first four actions in order.

4. An order reads "insulin 10U SC now." Name two problems and the correct next step.

5. During transport to MRI, the nurse notices the client is wearing a medication patch. Why does this matter and what happens next?

## Answers

1. The 72-year-old with a fall last month — fall history is the strongest predictor and outranks each single-factor risk in the other options.

2. HOLD the dose and notify the provider — an aPTT above range means the anticoagulant is overshooting; giving a scheduled high-alert drug against a critical lab is the tested error. Verification against the current lab is part of the administration, not an extra.

3. Rescue (confirm the room is empty — no one to rescue), Alarm, Contain (close the door), Extinguish if small with PASS. The room being empty converts Rescue into a check, not a skip.

4. "U" is a forbidden abbreviation (reads as a zero — 100 units) and insulin is a high-alert drug requiring a second-nurse check. Clarify the order with the prescriber, have it rewritten as "units," and verify with a second nurse before administration.

5. Some patches have foil or metalized backings that heat in the magnetic field and burn the client. Stop, notify per protocol, and remove or verify the patch's MRI compatibility before entry — rescreening beats proceeding.`,
    },
  ],
  keyTakeaways: [
    `Fall prevention is a bundle — low locked bed, reachable call light, toileting rounds, alarms — and history of falls is the strongest single predictor; restraints and four raised rails are not fall prevention.`,
    `Two identifiers (never the room number) before every intervention; time-out before procedures; SBAR with read-back at every transition.`,
    `High-alert drugs get independent double checks; IV potassium is never pushed; forbidden abbreviations (U, QD, naked and trailing decimals) are rewritten, not interpreted.`,
    `RACE then PASS in order — rescue before alarm, aim at the base; oxygen zones, grounded plugs, and the always-on MRI magnet each carry absolute rules.`,
    `Home teaching: back-alone-bare crib, 120 F water, locked medications and firearms, CO detectors, cleared floors and grab bars — the hospital fall logic relocated.`,
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
      content: `![Fetal heart rate decelerations against the contraction (dashed): EARLY mirrors the contraction (head compression - benign), LATE begins after the peak (uteroplacental insufficiency - reposition, oxygen, stop oxytocin), VARIABLE is an abrupt V at any timing (cord compression - reposition first). The VEAL CHOP pattern, drawn.](/courses/nclex/figures/nclex-fhr-decels.svg)

Fetal heart rate interpretation compresses to VEAL CHOP: Variable decelerations = Cord compression; Early decelerations = Head compression (benign, mirror contractions); Accelerations = Okay; Late decelerations = Placental insufficiency. Baseline is 110-160; moderate variability is the single best indicator of fetal well-being.

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
      content: `![The alcohol withdrawal clock: early tremor and autonomic signs at 6-24 hours after the last drink, peak seizure risk in the first 48, and delirium tremens - the highest-mortality window - at 48-72 hours.](/courses/nclex/figures/nclex-etoh-withdrawal-timeline.svg)

Alcohol withdrawal runs a clock the exam expects you to read: tremor, anxiety, diaphoresis, tachycardia, and hypertension at 6-24 hours after the last drink; peak seizure risk in the first 48; delirium tremens — disorientation, hallucinations, autonomic storm — at 48-72 hours, carrying real mortality. Management is benzodiazepines (dosed by a symptom scale like CIWA), thiamine before or with glucose (Wernicke prophylaxis), magnesium repletion, and seizure precautions. Opioid withdrawal (yawning, rhinorrhea, cramps, dilated pupils, gooseflesh) is miserable but not lethal; alcohol and benzodiazepine withdrawal can kill — that asymmetry decides several exam answers.

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
  title: `Dosage Calculations & Safe Math`,
  domainWeight: 'Pharmacological and Parenteral Therapies (13-19%)',
  overview: `Dosage calculation is the one exam skill where you can guarantee points: the math never changes, the formats repeat, and fill-in-the-blank calculation items have no distractors to outwit — just an answer that is right or wrong. This chapter builds the complete toolkit: the conversion table, the desired-over-have and dimensional-analysis methods, IV flow rates and infusion times, weight-based and titration math, reconstitution, and the safe-dose check that turns arithmetic into nursing judgment. Every example is worked to the final rounded answer.`,
  sections: [
    {
      id: 'calc-foundations',
      title: `1. Conversions & the Two Methods`,
      content: `Memorize the conversion table cold — most calculation errors on the exam are unit errors, not arithmetic errors:

| Conversion | Value |
| --- | --- |
| 1 g | 1,000 mg |
| 1 mg | 1,000 mcg |
| 1 kg | 2.2 lb |
| 1 L | 1,000 mL |
| 1 tsp | 5 mL |
| 1 tbsp | 15 mL |
| 1 oz | 30 mL |
| 1 cup | 240 mL |
| 1 in | 2.5 cm |

## Desired over have

$$\\text{amount to give} = \\frac{\\text{dose desired}}{\\text{dose on hand}} \\times \\text{quantity of the on-hand form}$$

Order: digoxin 0.125 mg PO daily. On hand: 0.25 mg tablets.

$$\\frac{0.125}{0.25} \\times 1 \\text{ tab} = 0.5 \\text{ tab}$$

## Dimensional analysis

Chain the conversion factors so every unwanted unit cancels, and check that the surviving unit is the one the question asks for. Order: amoxicillin 500 mg PO. On hand: suspension 250 mg per 5 mL.

$$500 \\text{ mg} \\times \\frac{5 \\text{ mL}}{250 \\text{ mg}} = 10 \\text{ mL}$$

Both methods give identical answers; dimensional analysis scales better to multi-step problems (mcg/kg/min infusions), so build the habit on easy problems. Either way, finish with the sanity check: is this a plausible amount? An answer of 14 tablets or 0.02 mL means a setup error, not an unusual order.`,
      examTip: `Convert units FIRST, before any division — write the order and the on-hand strength in the same unit, then calculate. Most wrong answers on calc items are correct arithmetic performed on mismatched units.`,
    },
    {
      id: 'calc-parenteral',
      title: `2. Oral & Parenteral Doses`,
      content: `Parenteral problems are desired-over-have with a liquid on-hand quantity. Order: heparin 5,000 units subcutaneously. On hand: 10,000 units/mL.

$$\\frac{5000}{10000} \\times 1 \\text{ mL} = 0.5 \\text{ mL}$$

Order: morphine 4 mg IV. On hand: 10 mg/mL.

$$\\frac{4}{10} \\times 1 \\text{ mL} = 0.4 \\text{ mL}$$

## Rounding rules the exam grades

| Situation | Round to |
| --- | --- |
| volumes greater than 1 mL | nearest tenth (0.1 mL) |
| volumes less than 1 mL | nearest hundredth (0.01 mL) |
| drops per minute | nearest whole drop |
| mL per hour on a pump | per facility — the exam states the rule; follow the stem |
| tablets | only split scored tablets; never split capsules or extended-release forms |

Write the units on every line and follow the stem's rounding instruction EXACTLY — a correct calculation rounded wrong is scored wrong on fill-in-the-blank items. And keep the leading-zero rule from safe documentation: 0.5 mL, never .5 mL.

## Unit-trap examples

Order: levothyroxine 88 mcg PO daily. On hand: 0.088 mg tablets. Convert first: 0.088 mg = 88 mcg — the answer is 1 tablet, and the entire problem was the unit conversion.

Order: 1.5 g of an antibiotic; on hand 500 mg capsules. 1.5 g = 1,500 mg; 1500 / 500 = 3 capsules.`,
      examTip: `Insulin is measured in UNITS in a U-100 insulin syringe — never converted to mL by arithmetic. Any option that computes insulin volume through a mg or mL conversion is the error the item is testing.`,
    },
    {
      id: 'calc-iv',
      title: `3. IV Flow Rates & Infusion Times`,
      content: `Two formulas cover every IV rate item.

## Pump rate (mL/h)

$$\\text{mL/h} = \\frac{\\text{total volume (mL)}}{\\text{time (h)}}$$

Order: 1,000 mL of normal saline over 8 hours.

$$\\frac{1000}{8} = 125 \\text{ mL/h}$$

## Gravity drip rate (gtt/min)

$$\\text{gtt/min} = \\frac{\\text{volume (mL)} \\times \\text{drop factor (gtt/mL)}}{\\text{time (min)}}$$

Same order by gravity with 15 gtt/mL tubing:

$$\\frac{125 \\text{ mL/h} \\times 15}{60} = 31.25 \\rightarrow 31 \\text{ gtt/min}$$

An antibiotic piggyback: 50 mL over 30 minutes with 10 gtt/mL tubing:

$$\\frac{50 \\times 10}{30} = 16.7 \\rightarrow 17 \\text{ gtt/min}$$

## Infusion time and volume

Time = volume divided by rate: 500 mL at 80 mL/h runs 6.25 h = 6 hours 15 minutes. Started at 1400, it ends at 2015 — the exam asks for completion times in clock form, so practice the conversion of decimal hours to minutes (0.25 h = 15 min).

Micro-drip tubing is 60 gtt/mL, which makes gtt/min NUMERICALLY EQUAL to mL/h — a shortcut worth knowing both to compute and to sanity-check.`,
      examTip: `Drops are counted whole: always round gtt/min to the nearest whole number. And on micro-drip (60 gtt/mL) tubing, gtt/min equals mL/h — if your two numbers differ on micro-drip, one of them is wrong.`,
    },
    {
      id: 'calc-weight',
      title: `4. Weight-Based Doses & Titrated Infusions`,
      content: `Weight-based problems add one step — convert pounds to kilograms FIRST (divide by 2.2), then apply the ordered rate.

A child weighs 22 lb; the order is 40 mg/kg/day divided every 8 hours.

$$22 \\text{ lb} \\div 2.2 = 10 \\text{ kg}; \\quad 40 \\times 10 = 400 \\text{ mg/day}; \\quad \\frac{400}{3} = 133.3 \\text{ mg/dose}$$

## Safe-dose verification

The exam's favorite twist is the dose that calculates cleanly but is NOT SAFE. A child weighing 18 kg is ordered acetaminophen 500 mg PO every 6 hours; the reference range is 10-15 mg/kg/dose.

$$18 \\times 10 = 180 \\text{ mg}; \\quad 18 \\times 15 = 270 \\text{ mg}$$

The safe range is 180-270 mg/dose. The ordered 500 mg exceeds it — the correct action is HOLD AND CLARIFY with the prescriber, not administer, and not silently give the "right" dose. The calculation is nursing judgment with arithmetic inside.

## Continuous titrated infusions (mcg/kg/min)

Order: dopamine at 5 mcg/kg/min for an 80-kg client; the bag is 400 mg in 250 mL. Work to mL/h with dimensional analysis:

$$5 \\times 80 = 400 \\text{ mcg/min} = 24{,}000 \\text{ mcg/h} = 24 \\text{ mg/h}$$

$$\\text{concentration} = \\frac{400 \\text{ mg}}{250 \\text{ mL}} = 1.6 \\text{ mg/mL}; \\quad \\frac{24}{1.6} = 15 \\text{ mL/h}$$

The units walk mcg/min to mcg/h to mg/h to mL/h — write every step; the errors live in the skipped ones. IV insulin drips work the same way at 1 unit/mL: 8 units/h is 8 mL/h.`,
      examTip: `When a stem gives a weight in POUNDS and a reference range in mg/kg, the item is testing the 2.2 conversion — do it first, label it, and only then touch the ordered dose.`,
    },
    {
      id: 'calc-reconstitution',
      title: `5. Reconstitution & Multi-Step Problems`,
      content: `Reconstitution problems hide the concentration in the label text: the diluent volume you add plus the powder yields a stated FINAL concentration — use the label's concentration, not your diluent arithmetic, because the powder displaces volume.

A vial of cefazolin 1 g is reconstituted with 3.4 mL to yield 250 mg/mL. Order: 750 mg IM.

$$\\frac{750}{250} = 3 \\text{ mL}$$

Multi-dose vials: note the concentration, date-time-initial the label, and observe the beyond-use date. If a reconstituted answer exceeds the maximum IM volume for the site (roughly 3 mL for a large adult muscle, 1 mL for the deltoid), the answer may be to divide the dose between sites or question the route.

## Heparin protocol math

Heparin infusions run from weight-based protocols: a bag of 25,000 units in 250 mL (100 units/mL) ordered at 1,200 units/h:

$$\\frac{1200}{100} = 12 \\text{ mL/h}$$

A bolus of 80 units/kg for a 70-kg client is 5,600 units; from a 1,000 units/mL vial that is 5.6 mL. Protocol adjustments ("increase by 2 units/kg/h") repeat the same chain — always resolve to mL/h at the end, because that is what the pump takes.`,
      examTip: `On reconstitution items, the concentration printed on the label after mixing is the on-hand strength. Diluent volume is a decoy — the powder has volume too, and the label already accounts for it.`,
    },
    {
      id: 'calc-selfcheck',
      title: `6. Self-Check: Five Calculations`,
      content: `Work each on paper to the stated rounding before checking.

1. Order: furosemide 60 mg PO. On hand: 20 mg tablets. How many tablets?

2. Order: 1,500 mL lactated Ringer's over 12 hours by gravity, 20 gtt/mL tubing. What drip rate?

3. A child weighs 33 lb. Order: 14 mg/kg/day of an antibiotic once daily; suspension is 125 mg/5 mL. How many mL per dose (nearest tenth)?

4. Heparin infusion: 25,000 units in 250 mL, ordered at 1,400 units/h. Pump setting in mL/h?

5. Order: hydromorphone 0.6 mg IV. On hand: 1 mg/mL. Volume to give (nearest hundredth)?

## Answers

1. 60 / 20 = 3 tablets.

2. 1,500 / 12 = 125 mL/h. Then 125 x 20 / 60 = 41.7, rounds to 42 gtt/min.

3. 33 / 2.2 = 15 kg. 14 x 15 = 210 mg/day in one dose. 210 x 5 / 125 = 8.4 mL.

4. Concentration 25,000 / 250 = 100 units/mL. 1,400 / 100 = 14 mL/h.

5. 0.6 / 1 = 0.6 mL — reported as 0.60 mL to the hundredth, written with the leading zero.`,
    },
  ],
  keyTakeaways: [
    `Convert to matching units before any division — 2.2 lb per kg, 1,000 mcg per mg — and label every line; unit mismatch is the exam's favorite calc error.`,
    `Pump math is volume over hours; gravity math is volume times drop factor over minutes; drops round whole, and micro-drip gtt/min equals mL/h.`,
    `Weight-based orders are checked against the reference range — a clean calculation outside the safe range is held and clarified, never administered.`,
    `Titration chains resolve stepwise (mcg/min to mcg/h to mg/h to mL/h) because pumps take mL/h; skipped steps are where the errors live.`,
    `Reconstitution uses the label's final concentration, insulin stays in units in an insulin syringe, and volumes get leading zeros and the stem's exact rounding.`,
  ],
},

nx_pharm_principles: {
  topicId: 'nx_pharm_principles',
  title: `Pharmacology Principles & Drug Safety`,
  domainWeight: 'Pharmacological and Parenteral Therapies (13-19%)',
  overview: `Pharmacological and Parenteral Therapies is one of the two heaviest categories on the exam, and its non-calculation items cluster around a learnable core: how drugs move and act, the prototype-and-suffix system that lets you decode unfamiliar names, therapeutic drug monitoring with peaks and troughs, the antidote table, and administration rights and routes. This chapter builds that core; the drug classes themselves are covered with their diseases in the adult-health chapters, which is also how the exam frames them.`,
  sections: [
    {
      id: 'pharm-kinetics',
      title: `1. Pharmacokinetics: What the Body Does to the Drug`,
      content: `Four processes — absorption, distribution, metabolism, excretion — explain most "why" questions in pharmacology.

Absorption is route-dependent: IV is complete by definition, IM and subcutaneous depend on perfusion (a shocked client absorbs nothing from muscle — why emergencies go IV), and oral absorption crosses the FIRST-PASS effect: drugs absorbed from the gut transit the liver before reaching circulation, and heavily first-pass drugs (nitroglycerin is the classic) need sublingual, transdermal, or IV routes to work at all.

Distribution hinges on protein binding and barriers: only UNBOUND drug is active, so low albumin (malnutrition, liver disease, age) raises the free fraction of highly bound drugs — standard doses become overdoses. The blood-brain barrier and placenta are the tested barriers.

Metabolism happens mostly in the liver: liver disease slows it, so doses fall; enzyme inducers and inhibitors create interactions. Grapefruit juice inhibits intestinal CYP3A4 and boosts levels of statins and calcium channel blockers — the exam's favorite dietary interaction.

Excretion is mostly renal: creatinine and eGFR are checked before renally cleared drugs (vancomycin, aminoglycosides, digoxin, metformin), and the older adult's normal decline in renal function is why geriatric dosing starts low and goes slow.

Half-life sets the schedule: about five half-lives to reach steady state on repeated dosing, and about five to clear after stopping. A drug with a 6-hour half-life reaches steady state in roughly 30 hours — which is why levels drawn on day one mislead.`,
      examTip: `When a stem pairs liver disease or low albumin with a standard dose, the answer usually involves toxicity at "normal" doses; when it pairs renal decline with a renally cleared drug, look for the option that checks creatinine or reduces the dose.`,
    },
    {
      id: 'pharm-dynamics',
      title: `2. Pharmacodynamics & the Suffix System`,
      content: `Pharmacodynamics is what the drug does to the body: agonists activate receptors, antagonists block them (naloxone at opioid receptors), and the therapeutic index is the safety margin between the effective dose and the toxic one — narrow-index drugs (digoxin, lithium, warfarin, phenytoin, theophylline) are the monitored ones.

The suffix system converts unfamiliar generic names into classes — the single highest-leverage memorization in NCLEX pharmacology:

| Suffix | Class | Prototype |
| --- | --- | --- |
| -pril | ACE inhibitor | lisinopril |
| -sartan | angiotensin receptor blocker | losartan |
| -olol | beta blocker | metoprolol |
| -dipine | calcium channel blocker (dihydropyridine) | amlodipine |
| -statin | HMG-CoA reductase inhibitor | atorvastatin |
| -prazole | proton pump inhibitor | omeprazole |
| -tidine | H2 blocker | famotidine |
| -floxacin | fluoroquinolone | ciprofloxacin |
| -cillin | penicillin | amoxicillin |
| -cycline | tetracycline | doxycycline |
| -azepam / -zolam | benzodiazepine | lorazepam / midazolam |
| -zosin | alpha-1 blocker | tamsulosin family |
| -gliptin | DPP-4 inhibitor | sitagliptin |
| -gliflozin | SGLT2 inhibitor | empagliflozin |
| -parin | low-molecular-weight heparin | enoxaparin |
| -triptan | serotonin agonist (migraine) | sumatriptan |
| -profen / -coxib | NSAID / COX-2 | ibuprofen / celecoxib |

Decode, then apply the class rules: any -olol can mask hypoglycemia and worsen asthma; any -pril can cause a dry cough and hyperkalemia and angioedema; any -floxacin carries tendon-rupture warnings. The exam deliberately uses less-common members of a class to reward decoding over rote lists.`,
      examTip: `When you meet an unfamiliar drug name, read the suffix before the stem options — the class effects and warnings usually answer the question without your ever having seen that specific drug.`,
    },
    {
      id: 'pharm-monitoring',
      title: `3. Therapeutic Monitoring: Levels, Peaks & Troughs`,
      content: `![Serum drug level across repeated IV doses: the level saw-tooths upward to steady state; the peak is drawn about 30 minutes after an infusion ends and the trough immediately before the next dose — a high trough means the drug is accumulating.](/courses/nclex/figures/nclex-peak-trough.svg)

Narrow-therapeutic-index drugs are dosed by serum level, and the exam tests the sampling mechanics as often as the numbers: the PEAK is drawn about 30 minutes after an IV infusion ends (per protocol), and the TROUGH is drawn immediately BEFORE the next dose — the lowest point of the saw-tooth. A trough drawn late or a peak drawn early produces a level that lies.

| Drug | Therapeutic range | The toxicity picture |
| --- | --- | --- |
| digoxin | 0.5-2.0 ng/mL | anorexia, nausea, visual changes (halos), arrhythmias; check apical pulse 1 min, hold under 60 |
| lithium | 0.6-1.2 mEq/L | tremor to ataxia to seizures; dehydration and NSAIDs raise it; steady salt and water intake |
| phenytoin | 10-20 mcg/mL | nystagmus, ataxia, gingival hyperplasia at the margin |
| vancomycin | trough-guided (per protocol) | nephrotoxicity, ototoxicity; infuse slowly to avoid flushing reaction |
| aminoglycosides | peak and trough per protocol | nephrotoxicity and ototoxicity — tinnitus is a report-now symptom |
| theophylline | 10-20 mcg/mL | tachycardia, tremor to seizures |

A HIGH TROUGH is the accumulation signal — clearance (usually renal) is failing to keep up, and the tested action is to hold the dose and notify before the next scheduled administration, with a creatinine check close behind.

Warfarin is monitored by INR (therapeutic 2-3 for most indications) and reversed with vitamin K; heparin by aPTT (or anti-Xa) and reversed with protamine sulfate. The pair — lab, range, reversal — is a standing exam favorite.`,
      examTip: `Sampling time IS the answer on many level questions: trough immediately before the dose, peak shortly after it ends. An option that draws the trough "one hour after administration" is wrong before any number appears.`,
    },
    {
      id: 'pharm-antidotes',
      title: `4. Antidotes, Interactions & High-Alert Classes`,
      content: `The antidote table is pure recall and appears constantly:

| Drug / toxin | Antidote |
| --- | --- |
| opioids | naloxone |
| benzodiazepines | flumazenil |
| heparin | protamine sulfate |
| warfarin | vitamin K (phytonadione) |
| acetaminophen | acetylcysteine |
| digoxin | digoxin immune Fab |
| iron | deferoxamine |
| magnesium sulfate | calcium gluconate |
| methotrexate | leucovorin |
| cholinergic crisis | atropine |
| extravasated vesicants | per-drug protocol — stop the infusion first |

Naloxone's half-life is SHORTER than most opioids — respiratory depression can return as it wears off, so the client is monitored, not discharged, after reversal.

## Interactions worth points

Grapefruit juice with statins and calcium channel blockers (levels rise). MAOIs with tyramine-rich foods — aged cheese, cured meats, fermented anything — hypertensive crisis. Warfarin with leafy-green swings (vitamin K intake should be CONSISTENT, not eliminated) and with NSAIDs or aspirin (bleeding). Tetracyclines and fluoroquinolones with antacids, dairy, and iron — chelation blocks absorption; separate the doses. St. John's wort induces metabolism and weakens oral contraceptives, warfarin, and many others. Alcohol with metronidazole (disulfiram-like reaction) and with any CNS depressant.

High-alert administration rules recap from Client Safety: insulin and heparin get independent double checks, IV potassium is never pushed, and opioid dosing follows a sedation-and-respirations assessment, not the clock alone.`,
      examTip: `Learn the antidote pairs bidirectionally — stems ask "which drug should be available" (drug to antidote) as often as "this reversal agent is ordered for..." (antidote to drug).`,
    },
    {
      id: 'pharm-administration',
      title: `5. Routes, Rights & Client Teaching`,
      content: `Route mechanics the exam samples: sublingual drugs stay under the tongue (no swallowing, no water); enteric-coated and extended-release forms are NEVER crushed (decoded from suffixes like SR, XL, ER, EC — crushing converts a 24-hour dose into a bolus); transdermal patches go on clean dry hairless skin, sites rotate, and the OLD PATCH COMES OFF first (two fentanyl patches is an overdose); eye drops press the inner canthus (punctal occlusion) to limit systemic absorption; ear drops pull the pinna up-and-back for adults, down-and-back for children under 3.

Injection technique: subcutaneous insulin and heparin go in the abdomen (heparin 2 inches from the umbilicus, no aspiration, no massage); IM injections use the VENTROGLUTEAL site as the default adult choice and the vastus lateralis for infants, with the Z-track method for irritating drugs; needle length and gauge match the route and the client's size.

NPO and the swallowing-impaired client route through clinical judgment: which scheduled drugs are essential (usually cardiac, seizure, and steroid drugs get clarified for alternate routes), and nothing oral goes down an unassessed dysphagic throat.

## Teaching that finishes the course

Antibiotic courses are FINISHED even when symptoms resolve — stopping early breeds resistance and relapse. Steroids are TAPERED, never stopped abruptly (adrenal suppression). Beta blockers, anticonvulsants, and antidepressants likewise stop only under supervision. "Take with food" belongs to NSAIDs, metformin, and steroids; "empty stomach" to levothyroxine (morning, water, 30-60 minutes before food) and alendronate (upright 30 minutes, full glass of water). The effectiveness statement the exam rewards is always the concrete behavior, never "I understand."`,
      examTip: `Crush-safety is a two-second check that decides whole items: any ER/SR/XL/EC suffix means do not crush — and the correct alternative is calling the provider for a different form, not "crush it finely."`,
    },
    {
      id: 'pharm-selfcheck',
      title: `6. Self-Check`,
      content: `1. A client with cirrhosis and albumin of 2.1 g/dL takes a highly protein-bound drug at standard doses. What is the risk and why?

2. Decode: a client is started on "nebivolol," which you have never seen. What class, and what two class cautions apply?

3. Vancomycin trough returns elevated before the third dose. First action?

4. A client on an MAOI orders a charcuterie board. What is the danger, and which foods are the problem?

5. The med pass includes "diltiazem XL — crush and give via PEG tube" per a colleague's advice. What does the nurse do?

## Answers

1. Low albumin leaves more drug unbound and active — standard doses behave like overdoses. Monitor for toxicity and expect dose reduction; the liver's slowed metabolism compounds it.

2. The -olol suffix marks a beta blocker: it can mask tachycardia and tremor of hypoglycemia in diabetic clients and can trigger bronchospasm in asthma/COPD — plus hold-and-assess if pulse is bradycardic per parameters.

3. Hold the next dose and notify the provider — a high trough means accumulation, usually from falling renal clearance; expect a creatinine check and a dosing-interval change. Giving the dose "on time" is the tested error.

4. Tyramine-rich foods — aged cheeses and cured meats are the core of the board — can precipitate hypertensive crisis on an MAOI. Severe headache and surging pressure after such a meal is an emergency.

5. Refuse the shortcut: XL marks extended release, and crushing delivers the day's dose at once. Hold, and contact the provider or pharmacist for an immediate-release or liquid formulation appropriate for the tube.`,
    },
  ],
  keyTakeaways: [
    `Pharmacokinetics answers the "why": first-pass explains routes, protein binding and liver disease explain toxicity at normal doses, renal decline explains geriatric dosing, five half-lives explains steady state.`,
    `The suffix system decodes unfamiliar drugs into classes — learn the table and apply class effects and cautions to any member.`,
    `Peaks are drawn shortly after the infusion, troughs immediately before the next dose, and a high trough means hold and notify — accumulation from failing clearance.`,
    `The antidote pairs (naloxone, flumazenil, protamine, vitamin K, acetylcysteine, Fab, calcium gluconate) are tested in both directions, and naloxone can wear off before the opioid does.`,
    `Never crush ER/SR/XL/EC forms, take the old patch off first, finish antibiotic courses, taper steroids — and effective teaching is always the concrete behavior statement.`,
  ],
},

nx_iv_therapy: {
  topicId: 'nx_iv_therapy',
  title: `IV Therapy, Blood Products & Central Lines`,
  domainWeight: 'Pharmacological and Parenteral Therapies (13-19%)',
  overview: `Parenteral therapy questions cluster around four skill sets: choosing and reading IV fluids (the tonicity table), catching and managing site complications, running blood products by the strict transfusion script, and maintaining central lines without infecting or embolizing them. Each has bright-line rules — stop first, assess, then salvage — and the exam rewards the nurse who acts on the earliest sign, not the full-blown picture.`,
  sections: [
    {
      id: 'iv-fluids',
      title: `1. IV Fluids: The Tonicity Table`,
      content: `Fluid questions are decided by tonicity — where the water goes:

| Fluid | Tonicity | Where it goes | Classic use | Caution |
| --- | --- | --- | --- | --- |
| 0.9% NaCl (normal saline) | isotonic | stays intravascular | resuscitation, blood co-infusion, most bolus orders | fluid overload; hyperchloremic acidosis in volume |
| lactated Ringer's | isotonic | intravascular | surgery, burns, trauma | liver failure (lactate), hyperkalemia risk in renal failure |
| D5W | isotonic in the bag, hypotonic once dextrose metabolizes | into cells | free-water replacement, some drug dilutions | never for resuscitation; worsens cerebral edema |
| 0.45% NaCl (half NS) | hypotonic | into cells | cellular dehydration (DKA per protocol after resuscitation) | never in head injury or trauma; can crash intravascular volume |
| 3% NaCl | hypertonic | pulls water INTO vessels | severe symptomatic hyponatremia, cerebral edema | slow, monitored, often ICU; overshoot risks osmotic injury |
| D5 1/2 NS, D5 NS | hypertonic in the bag | maintenance with calories | common maintenance orders | not resuscitation fluids |

The two tested absolutes: hypotonic fluids never run in head-injury clients (they swell the brain), and 3% saline runs slowly with sodium checks — correcting sodium too fast injures the brain. Normal saline is the ONLY fluid compatible with blood products.

Older adults and clients with heart or kidney failure develop overload from "routine" rates: crackles, distended neck veins, bounding pulse, and a climbing weight are the assessment cluster; slow the fluid and call before the pulmonary edema completes the picture.`,
      examTip: `Ask where the water goes: isotonic stays in the vessels (resuscitation), hypotonic moves into cells (never with brain injury), hypertonic pulls water out of cells (severe hyponatremia, slow and monitored).`,
    },
    {
      id: 'iv-complications',
      title: `2. Peripheral IV Complications: Recognize, Stop, Salvage`,
      content: `Every complication item follows the same skeleton — earliest sign, first action, then the specific rescue:

| Complication | The picture | First action | Then |
| --- | --- | --- | --- |
| infiltration (non-vesicant into tissue) | cool, pale, swollen, sluggish or stopped infusion | STOP and remove | elevate; warm or cool per policy; restart proximally or other arm |
| extravasation (vesicant into tissue) | as above, plus a vesicant drug running | STOP infusion, leave catheter for antidote per protocol | notify; agent-specific antidote; document extent |
| phlebitis (vein inflammation) | red, warm, tender cord along the vein | STOP and remove | warm compress; new site; grade per scale |
| infection at site | purulence, spreading redness, fever | remove per policy | culture per orders; sterile dressing |
| air embolism | sudden dyspnea, chest pain, drop in pressure with line open to air | clamp the line | position LEFT side, head down (trap air in right heart); oxygen; call |
| catheter embolism | sheared fragment travels | apply tourniquet high on the limb per policy | imaging; retrieval |

The difference between infiltration and extravasation is only the DRUG — the tissue picture is identical, but a vesicant (chemotherapy agents, dopamine, calcium, potassium concentrates) turns a nuisance into a tissue-necrosis emergency with its own antidote pathway, and the catheter may stay in place initially so the antidote can be delivered through it.

Site care standards: the smallest gauge that serves the therapy (large bores — 18 or larger — for trauma and blood when rapid infusion is expected), aseptic insertion, dated dressings, scrub-the-hub before every access, and site assessment every shift and before every medication. A pump alarm of "occlusion" is an assessment trigger, not a silence-and-restart trigger.`,
      examTip: `For any deteriorating IV site the first verb is STOP — every correct sequence begins by halting the infusion before assessment, elevation, compresses, or restarts. An option that troubleshoots the pump first is wrong.`,
    },
    {
      id: 'iv-blood',
      title: `3. Blood Products: The Transfusion Script`,
      content: `Transfusion items test a fixed script, and deviations are the wrong answers.

Before: type and crossmatch on file, consent verified, LARGE-ENOUGH gauge line (18-20 g adult standard), baseline vital signs, and the two-nurse verification at the bedside — client identity (two identifiers), unit number, blood type compatibility, expiration. Only NORMAL SALINE primes and runs with blood; no medications ever enter the blood line.

During: start slowly (about 2 mL/min) and STAY WITH THE CLIENT for the first 15 minutes — most acute hemolytic reactions declare in the first 50 mL. Re-check vitals per protocol, and complete each unit within 4 hours of leaving the blood bank (bacterial growth limit).

| Reaction | The picture | Beyond stopping the blood |
| --- | --- | --- |
| acute hemolytic | fever, chills, FLANK PAIN, dark urine, hypotension — within minutes | run saline via NEW tubing, recheck identifiers, send unit and labs to bank |
| febrile non-hemolytic | fever and chills without hemolysis signs, usually within 2 h | antipyretics per orders; rule out worse first |
| allergic (mild) | urticaria, itching | antihistamine; per policy may resume slowly if isolated |
| anaphylactic | wheeze, hypotension, angioedema | epinephrine pathway, airway support |
| TACO (circulatory overload) | dyspnea, crackles, hypertension, distended neck veins | upright, oxygen, diuretics per orders; slower future rates |
| TRALI (acute lung injury) | sudden hypoxemia and bilateral infiltrates within 6 h | oxygen and support — a report-and-escalate emergency |

Every suspected reaction starts identically: STOP the transfusion, keep the line open with saline through NEW tubing (the old set holds more blood), assess, and notify provider and blood bank. The saline-through-new-tubing detail is the classic discriminator between right and almost-right options.`,
      examTip: `The first 15 minutes belong to the nurse at the bedside — and flank pain plus dark urine during a transfusion is hemolysis until proven otherwise: stop, new tubing, saline, recheck the identifiers you verified an hour ago.`,
    },
    {
      id: 'iv-central',
      title: `4. Central Lines, PICCs & TPN`,
      content: `Central venous catheters (internal jugular, subclavian, femoral), PICCs, and implanted ports carry three tested hazard classes: infection, air, and clot.

Central line-associated bloodstream infection (CLABSI) prevention is a bundle the exam quotes: maximal sterile barriers at insertion, chlorhexidine skin prep, hand hygiene and scrub-the-hub (15 seconds, friction) before every access, transparent dressings changed on schedule or when soiled, daily review of line necessity, and prompt removal when no longer needed. Femoral sites carry the highest infection risk and are avoided when possible.

Air-embolism defenses are positional and mechanical: clamp lumens when open to air, use Valsalva (bear down) or humming during tubing changes and removal, position the client FLAT or Trendelenburg for insertion and removal, and cover the removal site with an occlusive (petroleum-gauze) dressing while the client holds exhalation. Sudden dyspnea during any line manipulation is the air-embolism picture: clamp, LEFT side head down, oxygen, call.

Occlusion logic: never force a flush against resistance (a clot dislodged is an embolus); reposition, verify clamps, then follow the alteplase-per-protocol pathway. Blood return is verified before high-risk infusions.

## TPN rules

Total parenteral nutrition runs through a CENTRAL line (peripheral parenteral nutrition only at low dextrose concentrations), on a pump, with a dedicated lumen and a filter per policy. The tested cluster: check glucose regularly (hyperglycemia is the most common complication), never catch up a behind-schedule bag by speeding it, and if the next bag is delayed, hang D10W — abrupt cessation of the dextrose load precipitates hypoglycemia. Tubing and bag change on schedule (typically every 24 hours; lipids more often per policy) because the solution feeds bacteria as happily as clients.`,
      examTip: `Two never-force rules carry the section: never force a central-line flush (embolized clot) and never speed a late TPN bag (osmotic and glycemic injury) — and D10W is the bridge when TPN runs out.`,
    },
    {
      id: 'iv-selfcheck',
      title: `5. Self-Check`,
      content: `1. A client with a head injury has orders for IV fluids. Which bag makes the nurse call the provider: 0.9% NaCl, lactated Ringer's, or 0.45% NaCl?

2. Fifteen minutes into a packed-cell transfusion the client reports chills and flank pain; urine in the catheter bag is darkening. List the first three actions in order.

3. A vesicant chemotherapy infusion site becomes swollen and cool. What distinguishes this from simple infiltration, and what changes about management?

4. During central-line tubing change, the client suddenly becomes dyspneic and hypotensive. Position and first actions?

5. The TPN bag empties and the pharmacy's next bag is 2 hours away. What does the nurse hang, and why?

## Answers

1. 0.45% NaCl — hypotonic fluid shifts water into cells, including brain cells, and is contraindicated with intracranial pathology. The isotonic options are expected.

2. Stop the transfusion; keep the line open with NORMAL SALINE through NEW tubing; assess and notify the provider and blood bank (then re-verify identifiers, send the unit and ordered specimens). The picture is acute hemolysis.

3. The drug makes it extravasation — a tissue-necrosis emergency. Stop the infusion but LEAVE the catheter initially so the agent-specific antidote can be given through it per protocol, then follow documentation and plastic-surgery-consult pathways per policy.

4. Clamp the line, position LEFT lateral with head down to trap air in the right heart, apply oxygen, and call the rapid response — the picture is air embolism during an open-line maneuver.

5. D10W at the ordered rate — the client's insulin response is matched to a continuous dextrose load, and abrupt cessation drops glucose. Speeding the eventual bag to catch up is the paired wrong answer.`,
    },
  ],
  keyTakeaways: [
    `Read fluids by tonicity: isotonic resuscitates, hypotonic hydrates cells (never in brain injury), hypertonic 3% saline runs slow and monitored — and only normal saline touches blood.`,
    `Every IV-site complication starts with STOP; the drug decides infiltration versus extravasation, and vesicants keep the catheter for the antidote.`,
    `Transfusions: two-nurse bedside verification, slow start, 15 minutes at the bedside, 4-hour limit — and any reaction means stop, saline via new tubing, assess, notify.`,
    `Central lines: scrub the hub, clamp open lumens, Valsalva and occlusive dressing at removal, never force a flush — dyspnea during manipulation is air embolism (left side, head down).`,
    `TPN is central, pumped, glucose-monitored, never sped up — and D10W bridges a late bag.`,
  ],
},

nx_lab_values: {
  topicId: 'nx_lab_values',
  title: `Laboratory Values & Diagnostics`,
  domainWeight: 'Reduction of Risk Potential (9-15%)',
  overview: `Laboratory items pay twice: once for recall (is this value normal?) and once for judgment (what does the nurse DO about it?). This chapter consolidates the reference table the exam draws from — hematology, chemistry, renal, liver, cardiac, coagulation — then builds the ABG interpretation method with the four-quadrant map, the critical-value playbook, and the pre-procedure lab logic that Reduction of Risk Potential items live on.`,
  sections: [
    {
      id: 'lab-core',
      title: `1. The Core Reference Table`,
      content: `Adult reference ranges as commonly taught (institutional ranges vary slightly — the exam uses the conventional ones):

| Test | Reference range | The tested edge |
| --- | --- | --- |
| WBC | 5,000-10,000/mm3 | under 1,000 or ANC under 500 = neutropenic precautions |
| hemoglobin | male 14-18, female 12-16 g/dL | symptomatic anemia, transfusion conversations |
| hematocrit | male 42-52%, female 37-47% | roughly 3 x Hgb — a mismatch flags dilution or dehydration |
| platelets | 150,000-400,000/mm3 | under 50,000 bleeding precautions; under 20,000 spontaneous risk |
| sodium | 135-145 mEq/L | neuro symptoms at extremes; correct slowly |
| potassium | 3.5-5.0 mEq/L | cardiac risk both directions — the most dangerous electrolyte |
| calcium | 9.0-10.5 mg/dL | Trousseau/Chvostek low; stones-bones-groans high |
| magnesium | 1.8-2.6 mEq/L | mirrors potassium clinically; DTRs are the bedside monitor |
| glucose (fasting) | 70-99 mg/dL | 100-125 prediabetes; 126+ x2 diabetes |
| BUN | 10-20 mg/dL | rises with dehydration AND renal failure |
| creatinine | 0.6-1.2 mg/dL | THE kidney number — trend it before nephrotoxic drugs and contrast |
| albumin | 3.5-5.0 g/dL | nutrition status; drug binding; edema |
| bilirubin (total) | 0.3-1.0 mg/dL | jaundice visible around 2.5-3 |
| AST / ALT | roughly 10-40 / 7-56 units/L | hepatocellular injury; baseline before statins, isoniazid |
| troponin | essentially undetectable (assay-specific) | THE cardiac injury marker — serial draws |
| BNP | under 100 pg/mL | heart failure severity; rises with stretch |

Trend beats snapshot here as everywhere: a creatinine of 1.3 means one thing in a client who was 1.2 last year and another in a client who was 0.7 yesterday — the doubling is an acute kidney injury even though 1.3 "looks nearly normal."`,
      examTip: `Learn potassium, sodium, creatinine, platelets, and glucose to the DIGIT — these five drive the most action items. For the rest, learn the range and the one action each edge demands.`,
    },
    {
      id: 'lab-coag',
      title: `2. Coagulation & Drug-Level Monitoring`,
      content: `Coagulation studies pair with their drugs, and the exam tests the pairing more than the numbers:

| Test | Range | Monitors | Reversal |
| --- | --- | --- | --- |
| INR | 0.8-1.1 baseline; therapeutic 2-3 on warfarin | warfarin | vitamin K |
| aPTT | roughly 30-40 s baseline; therapeutic ~1.5-2.5 x control on heparin | IV heparin (or anti-Xa per protocol) | protamine sulfate |
| platelets | 150,000-400,000/mm3 | heparin-induced thrombocytopenia screen — a FALLING count on heparin | stop heparin, notify |
| anti-Xa | protocol-specific | LMWH when monitored at all | protamine (partial) |

Direct oral anticoagulants (apixaban, rivaroxaban, dabigatran) run without routine monitoring — the tested points are renal function checks, strict adherence (short half-lives mean missed doses matter), and specific reversal agents existing for emergencies.

An INR of 4.5 on warfarin is a hold-and-call with bleeding assessment; a falling platelet count on ANY heparin product raises heparin-induced thrombocytopenia — the counterintuitive answer is to STOP the heparin even though the client seems to need anticoagulation, because HIT causes clots, not just bleeding.

Bleeding-precaution bundle for any anticoagulated or thrombocytopenic client: soft toothbrush, electric razor, no IM injections when avoidable, pressure on punctures for 5-10 minutes, fall prevention, report black stools and easy bruising.`,
      examTip: `Pair test to drug reflexively — PT/INR-warfarin-vitamin K; aPTT-heparin-protamine. Items are engineered so the almost-right option monitors the RIGHT drug with the WRONG test.`,
    },
    {
      id: 'lab-abg',
      title: `3. Arterial Blood Gases: The Three-Step Read`,
      content: `![The ABG four-quadrant map: respiratory acidosis (pH down, CO2 up), respiratory alkalosis (pH up, CO2 down), metabolic acidosis (pH down, HCO3 down), metabolic alkalosis (pH up, HCO3 up) — with the classic causes in each cell and the normal ranges beneath.](/courses/nclex/figures/nclex-abg-map.svg)

Normal values: pH 7.35-7.45, PaCO2 35-45 mm Hg, HCO3 22-26 mEq/L (PaO2 80-100 on room air). The three-step method answers every ABG item:

Step 1 — read the pH. Below 7.35 acidosis, above 7.45 alkalosis. (Exactly normal with abnormal partners = fully compensated; note which side of 7.40 it sits.)

Step 2 — find the culprit. Which abnormal value EXPLAINS the pH? CO2 moves opposite to pH when respiratory (ROME: Respiratory Opposite); HCO3 moves the same direction as pH when metabolic (Metabolic Equal).

Step 3 — check compensation. Is the OTHER system abnormal in the rescuing direction? Absent = uncompensated; present but pH still abnormal = partial; pH normalized = full.

Worked read: pH 7.30, PaCO2 52, HCO3 26. Acidotic pH; CO2 elevated (opposite direction — respiratory culprit); HCO3 still normal — uncompensated respiratory acidosis. Picture: the oversedated or COPD-crisis client hypoventilating.

Second read: pH 7.33, PaCO2 30, HCO3 15. Acidotic pH; HCO3 low (same direction — metabolic culprit); CO2 low = the lungs blowing off acid — partially compensated metabolic acidosis. Picture: DKA with Kussmaul respirations doing exactly this.

The nursing layer: treat the CAUSE, not the number — the respiratory acidosis answer ventilates (stimulate, position, reverse opioids, support); the metabolic acidosis answer treats the ketoacidosis or perfusion; the respiratory alkalosis answer slows the breathing (anxiety coaching, pain control); the metabolic alkalosis answer addresses vomiting, suction losses, or diuretics.`,
      examTip: `ROME carries the read: Respiratory Opposite, Metabolic Equal. Name pH, find the matching culprit, check the rescuer — three steps, every time, before looking at the options.`,
    },
    {
      id: 'lab-critical',
      title: `4. Critical Values & the Action Table`,
      content: `Critical values are phone-call values — the lab calls, the nurse read-backs, and something happens NOW. The tested pattern is the paired action:

| Critical finding | The immediate nursing move |
| --- | --- |
| potassium 6.5 (or rising with ECG changes) | ECG and cardiac monitor, hold K-containing fluids/drugs, notify — expect calcium gluconate, insulin with dextrose |
| potassium 2.8 | cardiac monitor, hold digoxin awareness (toxicity risk), replace per orders — NEVER IV push |
| sodium 118 with confusion | seizure precautions, slow correction per orders — fast correction injures the brain |
| glucose 40 with symptoms | conscious: 15 g fast carbohydrate; unconscious/NPO: IV dextrose or glucagon — never oral to an unresponsive client |
| platelets 18,000 | bleeding precautions now; no IMs; notify — spontaneous bleeding territory |
| INR 6 on warfarin | hold warfarin, assess bleeding, notify — expect vitamin K |
| troponin positive | this plus symptoms is ACS — ECG, protocol activation, not a recheck-later |
| ANC under 500 | protective environment; any fever is a one-hour-to-antibiotics emergency |

The mechanics matter as much as the values: critical results get READ BACK, documented with time and provider notified, and re-drawn only when a pre-analytic error is genuinely suspected (a hemolyzed potassium from a tourniquet-squeezed draw is the classic false critical — but the client on the monitor comes first while the redraw runs).`,
      examTip: `For every critical value, the exam wants the CLIENT action before the paperwork action: monitor, protect, hold the offending drug — then the notification and documentation. An option that files first and assesses second is wrong.`,
    },
    {
      id: 'lab-procedures',
      title: `5. Pre- & Post-Procedure Lab Logic`,
      content: `Reduction of Risk Potential frames labs around procedures — what must be checked BEFORE, and what is watched AFTER.

Before contrast imaging: creatinine/eGFR (contrast is nephrotoxic — hydrate per protocol) and metformin coordination per policy around contrast timing. Before surgery or biopsy: platelets, PT/INR, aPTT — and the anticoagulant hold schedule (warfarin typically stopped days ahead per provider with INR rechecked; the exam tests that the nurse VERIFIES the result before the client leaves the unit). Before starting nephrotoxic or hepatotoxic drugs: baseline creatinine or LFTs, then scheduled monitoring.

Common specimen rules the exam samples: fasting labs actually fasting (8-12 h for lipids and fasting glucose); blood cultures BEFORE the first antibiotic dose, two sets from different sites; trough levels drawn before the dose (and held pending the result when protocol says so); urine culture from a clean-catch midstream or per sterile technique from a catheter port — never from the drainage bag.

After procedures, the labs mirror the risk: post-cardiac-catheterization checks include the puncture site AND distal pulses with hemoglobin if bleeding is suspected; post-thyroidectomy calcium (parathyroid injury — tingling and Chvostek/Trousseau signs); post-transfusion hemoglobin timing per policy; dialysis clients get potassium drawn per schedule and NOT from the access limb, and no blood pressures or venipunctures in a fistula arm — auscultate the bruit, palpate the thrill, and report their absence at once.`,
      examTip: `Blood cultures before antibiotics is a sequencing absolute the exam loves — one dose of antibiotic first is the classic error, and "obtain cultures, then administer the first dose" is the correct ordering whenever sepsis workup and treatment appear together.`,
    },
    {
      id: 'lab-selfcheck',
      title: `6. Self-Check`,
      content: `1. Interpret: pH 7.50, PaCO2 29, HCO3 24 — and name the classic bedside cause.

2. A client on IV heparin has platelets of 210,000 on admission and 90,000 on day 4. What is the concern and the counterintuitive first action?

3. The lab calls a potassium of 6.8 on a renal-failure client. List the first three nursing moves.

4. Interpret: pH 7.36, PaCO2 60, HCO3 33 — what happened here over time?

5. A client's morning INR is 5.2; warfarin is due at 1700. What does the nurse do with the dose, and what assessment accompanies it?

## Answers

1. Alkalotic pH with a LOW CO2 moving opposite — uncompensated respiratory alkalosis; HCO3 has not yet moved. The classic cause is hyperventilation from anxiety or pain; coaching slow breathing treats the gas.

2. Heparin-induced thrombocytopenia — a falling count on heparin. STOP all heparin products and notify; HIT paradoxically causes thrombosis, and continuing "because the client needs anticoagulation" is the tested error.

3. Cardiac monitor/ECG first, hold any potassium sources (IV fluids, supplements, K-sparing drugs), and notify the provider — anticipating calcium gluconate for membrane protection and insulin-with-dextrose to shift potassium in.

4. Fully compensated respiratory acidosis: the pH is normal-side-acidic while CO2 is high and HCO3 is high in the rescuing direction. Kidneys retained bicarbonate over days — the chronic CO2-retaining COPD picture, not an acute event.

5. Hold the dose and notify — INR 5.2 is well past therapeutic. Assess for bleeding (gums, urine, stool, bruising, neuro status) and expect vitamin K per orders; documenting and rechecking per protocol follows the client assessment.`,
    },
  ],
  keyTakeaways: [
    `Know potassium, sodium, creatinine, platelets, and glucose to the digit; read every value against the client's trend, not just the range.`,
    `Pair coagulation tests to drugs bidirectionally — INR-warfarin-vitamin K, aPTT-heparin-protamine — and a falling platelet count on heparin means stop the heparin (HIT clots).`,
    `ABGs read in three steps with ROME: pH names it, the matching culprit claims it, the other system's rescue grades compensation.`,
    `Critical values demand the client action before the paperwork: monitor, protect, hold the drug — then notify with read-back.`,
    `Procedure logic: creatinine before contrast, coags before surgery, cultures before antibiotics, troughs before doses — and nothing punctures a fistula arm.`,
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
      content: `![Adult serum electrolyte reference intervals - sodium 135-145 and potassium 3.5-5.0 mEq/L, chloride 98-106, calcium 9.0-10.5, magnesium 1.8-2.6, and phosphorus 3.0-4.5 mg/dL - drawn as range bars, each row on its own scale.](/courses/nclex/figures/nclex-electrolyte-ranges.svg)

Fluid volume deficit reads as: thirst, dry mucosa, poor turgor (unreliable in the elderly — use tongue furrows and orthostatics instead), tachycardia, orthostatic hypotension, concentrated urine, rising BUN out of proportion to creatinine, and acute weight LOSS. Fluid volume excess reads as: crackles, dyspnea, JVD, bounding pulses, edema, and acute weight GAIN — and daily weight is the single most sensitive bedside measure of fluid balance (1 kg ≈ 1 L). Same scale, same time, same clothing; a gain of more than about 1 kg overnight or 2.3 kg (5 lb) in a week is a report-now finding in heart failure teaching.

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
  overview: `Rhythm questions reward a fixed reading method plus a short catalogue of patterns, each with its am-I-worried test and its first-line response. This chapter builds the waveform vocabulary and interval numbers, the six-step strip read, the lethal-versus-tolerated catalogue from sinus rhythms through asystole, and the treatment logic — vagal to adenosine, synchronized cardioversion versus defibrillation, atropine to pacing — that the exam samples over and over.`,
  sections: [
    {
      id: 'ecg-waveform',
      title: `1. The Waveform & the Numbers`,
      content: `![One cardiac cycle: P wave, QRS complex, and T wave, with the tested intervals bracketed — PR 0.12 to 0.20 seconds, QRS under 0.12, corrected QT under about 0.44 — on a grid where each small box is 0.04 seconds.](/courses/nclex/figures/nclex-ecg-intervals.svg)

Each waveform maps to one electrical event: the P wave is atrial depolarization (the sinus node fired and the atria answered), the QRS is ventricular depolarization (narrow means the signal used the normal highway; wide means it originated in or detoured through ventricular muscle), and the T wave is ventricular repolarization — the recharge, and the vulnerable period an ill-timed shock or PVC can strike.

| Measurement | Normal | Meaning when abnormal |
| --- | --- | --- |
| PR interval | 0.12-0.20 s (3-5 small boxes) | prolonged = AV node delay (first-degree block); shortening/variable = block patterns |
| QRS width | under 0.12 s (under 3 small boxes) | wide = ventricular origin or conduction detour |
| corrected QT | under about 0.44 s | prolonged = torsades risk — audit the drug list |
| rate (regular rhythm) | 60-100/min | 300 divided by the number of large boxes between R waves |

Paper mechanics: each small box is 0.04 s, each large box 0.20 s. For irregular rhythms, count QRS complexes in a 6-second strip and multiply by 10.

The prolonged-QT drug audit is a recurring item: certain antiarrhythmics, some antipsychotics, some antibiotics (macrolides, fluoroquinolones), and methadone prolong QT — plus low potassium and magnesium. A QTc creeping past 0.50 s with those aboard is a call-the-provider finding before the torsades happens.`,
      examTip: `Narrow QRS = above the ventricles; wide QRS = ventricular until proven otherwise. That one discrimination sorts half the strips you will ever be shown.`,
    },
    {
      id: 'ecg-method',
      title: `2. The Six-Step Strip Read`,
      content: `Read every strip the same way and the diagnosis falls out:

1. RHYTHM — march the R-R intervals: regular, regularly irregular, or irregularly irregular?
2. RATE — 300-over-large-boxes if regular; 6-second count times 10 if not.
3. P WAVES — present? One before every QRS? All the same shape?
4. PR INTERVAL — measure it; is it constant, lengthening, or absent?
5. QRS — narrow or wide? All the same shape?
6. CLIENT — pulse, pressure, perfusion, mentation. The strip is never treated without the client attached to it.

Step 6 is the exam's favorite: STABLE versus UNSTABLE decides treatment more than the rhythm's name does. Unstable means the rhythm is causing hypotension, altered mentation, chest pain, or heart failure signs — and unstable tachyarrhythmias get electricity (synchronized cardioversion) while stable versions of the same rhythm get drugs and vagal maneuvers.

Worked read: irregularly irregular R-R, rate about 110 by 6-second count, NO discernible P waves — just a fibrillating baseline, PR unmeasurable, narrow QRS. Atrial fibrillation with rapid ventricular response. Client check: BP 118/76, alert — stable, so rate control and anticoagulation conversations, not cardioversion this minute.`,
      examTip: `Every rhythm answer runs through step 6: the same strip has two different correct treatments depending on whether the stem shows stability. Read the vitals before the options.`,
    },
    {
      id: 'ecg-catalogue',
      title: `3. The Rhythm Catalogue: Sinus to Blocks`,
      content: `| Rhythm | Recognition | Worry level & response |
| --- | --- | --- |
| sinus bradycardia | normal everything, rate under 60 | treat only if symptomatic: atropine, then pacing — athletes live here normally |
| sinus tachycardia | normal everything, rate 100-150 | find and treat the CAUSE: fever, pain, hypovolemia, hypoxia, anxiety |
| atrial fibrillation | irregularly irregular, no P waves | stroke risk from atrial clot — rate control, anticoagulation; cardiovert if unstable (or per protocol after clot evaluation) |
| atrial flutter | sawtooth flutter waves, often regular | same logic as fib; often responds to cardioversion/ablation |
| SVT | narrow QRS, rate 150-250, P buried | stable: vagal maneuvers, then adenosine RAPID push with flush; unstable: synchronized cardioversion |
| first-degree block | PR fixed but over 0.20 | benign alone — monitor, audit AV-slowing drugs |
| second-degree type I (Wenckebach) | PR lengthens until a QRS drops | usually tolerated — monitor, atropine if symptomatic |
| second-degree type II | PRs constant, QRS drops without warning | DANGEROUS — pacing territory; atropine often futile |
| third-degree (complete) block | P waves and QRS march independently | EMERGENCY — pacing; support pressure; atropine ineffective |

The block ladder is a classic: type I Wenckebach is the forgiving one, type II and third-degree are the pacemaker rhythms. The tested tell for complete block: atrial rate and ventricular rate each regular but unrelated — Ps marching through QRSs.

Premature ventricular contractions (PVCs) — wide, early, bizarre beats — matter by pattern and context: occasional PVCs are common; increasing frequency, runs, couplets, or PVCs landing on the T wave (R-on-T) in an ischemic client are the warning forms. Check electrolytes (potassium, magnesium), oxygen, and the drug list.`,
      examTip: `The two "looks-similar, acts-different" pairs the exam loves: Wenckebach (lengthening PR, benign) versus type II (fixed PR, dangerous), and sinus tach (treat the cause) versus SVT (treat the rhythm).`,
    },
    {
      id: 'ecg-lethal',
      title: `4. Lethal Rhythms & Electricity`,
      content: `Four patterns end circulation, and their responses are protocol:

Ventricular tachycardia (VT): wide-complex, regular, fast. WITH a pulse and stable — antiarrhythmics (amiodarone) and prepare for cardioversion; WITH a pulse but unstable — synchronized cardioversion; WITHOUT a pulse — it is an arrest rhythm: CPR and DEFIBRILLATION.

Ventricular fibrillation (VF): chaotic quivering, no output, no pulse — CPR and immediate DEFIBRILLATION; every minute of delay costs survival.

Torsades de pointes: polymorphic VT twisting around the baseline, bred by long QT — magnesium sulfate is the specific therapy alongside arrest protocols.

Asystole and PEA (a rhythm on the monitor with no pulse): CPR, epinephrine, and hunting the reversible causes — the Hs and Ts (hypovolemia, hypoxia, hydrogen ion, hypo/hyperkalemia, hypothermia; tension pneumothorax, tamponade, toxins, thrombosis pulmonary and coronary). NEVER shock asystole — there is nothing organized to reset.

## Synchronized versus defibrillation — the discrimination the exam loves

| | Synchronized cardioversion | Defibrillation |
| --- | --- | --- |
| for | unstable tachyarrhythmias WITH a pulse (SVT, a-fib, VT with pulse) | pulseless VT and VF only |
| timing | synchronized to the R wave — avoids the T-wave vulnerable period | immediate, unsynchronized |
| setup | sync button ON, sedation when time permits | sync OFF; resume CPR immediately after |

The sync detail is the point: shocking on the T wave can induce VF, so any client WITH a pulse gets a synchronized shock. And after any shock in an arrest, compressions resume IMMEDIATELY — rhythm checks wait for the cycle.

Post-arrest and post-cardioversion care: 12-lead ECG, continuous monitoring, airway and oxygenation, targeted temperature discussions per protocol, and the electrolyte-and-cause hunt continues.`,
      examTip: `Pulse present = synchronized; pulse absent = defibrillate (VT/VF) or compressions-and-epinephrine (asystole/PEA). Every electricity question resolves on the pulse check.`,
    },
    {
      id: 'ecg-nursing',
      title: `5. Pacemakers, Monitoring & the Nursing Layer`,
      content: `Pacemaker items test recognition and precautions. Pacing spikes precede the paced chamber's waveform; FAILURE TO CAPTURE is spikes without a following complex (reposition the client per protocol, check connections, notify); failure to sense is spikes marching through native beats. Temporary transvenous and transcutaneous pacing bridge to permanent devices; transcutaneous pacing hurts — sedation/analgesia accompany it.

Post-permanent-pacemaker teaching: keep the arm below shoulder level on the operative side initially, no heavy lifting for the prescribed weeks, report dizziness or syncope (capture failure), carry the device card, and modern devices tolerate most household electronics — but MRI compatibility is device-specific and always verified.

Telemetry nursing: alarms are answered by ASSESSING THE CLIENT, not the screen — a "VT" alarm with a client calmly drinking coffee is artifact from brushing teeth or loose leads; a lead-off alarm on a client who does not answer is a possible arrest. Electrodes get skin prep and daily changes per policy; alarm limits are set per client, and alarm fatigue — silencing without assessing — is a tested safety failure.

The electrolyte-drug loop closes the chapter: hypokalemia and hypomagnesemia breed ectopy and torsades; hyperkalemia peaks T waves, widens QRS, and marches toward sine-wave arrest; digoxin toxicity (nausea, vision changes, new dysrhythmias — check the level and the potassium) and AV-slowing drug stacking (beta blocker plus verapamil/diltiazem plus digoxin) produce the bradycardias and blocks the catalogue just taught.`,
      examTip: `Treat the client, not the monitor: artifact happens, leads fall off, and the first response to ANY alarm is eyes on the client — the strip confirms what the client already told you.`,
    },
    {
      id: 'ecg-selfcheck',
      title: `6. Self-Check`,
      content: `1. A strip shows PR intervals of 0.24 s, constant, with every P followed by a QRS. Rhythm and response?

2. A monitored client's strip shows a narrow-complex rate of 190; BP is 74/50 and the client is diaphoretic and confused. Treatment pathway?

3. Differentiate second-degree type I from type II in one sentence each, and state which one gets a pacemaker conversation.

4. The monitor alarms VF. The nurse finds the client pulseless. First two actions, and is the shock synchronized?

5. A client's potassium returns 2.9 while on digoxin, and the strip shows increasing PVCs. Connect the three findings and state the priorities.

## Answers

1. First-degree AV block — prolonged but constant PR with 1:1 conduction. Alone it is benign: monitor, and audit AV-slowing medications; no acute treatment.

2. Unstable SVT: this client gets SYNCHRONIZED cardioversion — the hypotension and altered mentation make drug-first pathways wrong. (Stable, the same strip would get vagal maneuvers then rapid-push adenosine.)

3. Type I: PR lengthens progressively until a beat drops — usually benign. Type II: PR fixed with sudden dropped beats — dangerous and unpredictable. Type II gets the pacemaker conversation (as does third-degree).

4. Begin CPR and defibrillate as soon as the machine arrives — unsynchronized; VF has no R wave to sync on. Compressions resume immediately after the shock.

5. Hypokalemia both breeds ventricular ectopy AND potentiates digoxin toxicity — the PVCs are the rhythm consequence. Priorities: cardiac monitoring continues, hold digoxin pending level per protocol, replace potassium per orders (never IV push), and magnesium gets checked — it travels with potassium.`,
    },
  ],
  keyTakeaways: [
    `PR 0.12-0.20, QRS under 0.12, QTc under about 0.44 — and narrow-versus-wide QRS sorts supraventricular from ventricular at a glance.`,
    `Read strips in six fixed steps and let step 6 (the client) pick the treatment: stable gets drugs and maneuvers, unstable gets synchronized electricity.`,
    `Wenckebach forgives, type II and complete block pace; a-fib adds stroke prevention; sinus tach is treated by treating its cause.`,
    `Pulseless VT and VF are defibrillated during CPR; torsades gets magnesium; asystole and PEA get compressions, epinephrine, and the Hs-and-Ts hunt — never a shock for asystole.`,
    `Electrolytes write rhythms: low K/Mg breed ectopy and torsades, high K peaks Ts and widens QRS, and digoxin toxicity rides on hypokalemia.`,
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
  overview: `Diabetes may be the single highest-yield disease on the exam: insulin timing, hypoglycemia response, oral agents, sick-day rules, DKA versus HHS, and foot care each generate reliable questions. This chapter carries the reference tables and the insulin action curves, a worked dosage calculation, and a self-check set - organized the way the exam actually asks.`,
  sections: [
    {
      id: '1-disease-and-numbers',
      title: `1. The Disease and the Diagnosis Numbers`,
      content: `## 1.1 Two diseases, one name

Type 1 diabetes is autoimmune beta-cell destruction: absolute insulin deficiency, usually younger onset, ketosis-prone, insulin-dependent for life. Type 2 is insulin resistance with progressive relative deficiency: gradual onset, strongly weight-linked, managed stepwise with lifestyle, oral agents, and often eventually insulin. Gestational diabetes appears in pregnancy, is screened at 24-28 weeks, and marks lifetime type-2 risk for the mother.

## 1.2 The numbers the exam expects cold

| Test | Normal | Prediabetes | Diabetes |
|---|---|---|---|
| Fasting plasma glucose | < 100 mg/dL | 100-125 | >= 126 (two occasions) |
| 2-h OGTT | < 140 mg/dL | 140-199 | >= 200 |
| Hemoglobin A1c | < 5.7% | 5.7-6.4% | >= 6.5% |
| Random glucose + symptoms | - | - | >= 200 |

A1c reflects roughly three months of control (the lifespan of a glycated red cell); the usual treatment target is below 7%. The exam's favorite A1c stem: a client whose fingerstick log looks perfect but whose A1c is 10% - the log, not the assay, is the unreliable narrator.

## 1.3 The presentation pattern

The classic triad - polyuria, polydipsia, polyphagia - is osmotic physics: glucose above the renal threshold (~180 mg/dL) drags water into the urine, dehydration drives thirst, and cellular starvation drives hunger. Type 1 tends to announce itself acutely (weight loss, ketosis, sometimes DKA as the first presentation); type 2 is often found on screening or via its complications - which is why an exam client with a silent foot ulcer and blurry vision may be a NEW diabetes stem, not a management one.`,
    },
    {
      id: '2-insulin-clock',
      title: `2. The Insulin Clock`,
      content: `## 2.1 The four families, drawn and tabulated

![Insulin action profiles: rapid, regular, and NPH activity curves with their published peak times, and glargine's peakless basal plateau. The shaded band marks NPH's 4-12 hour peak window - the source of the classic 3 AM hypoglycemia stem. Curve shapes are schematic; the labelled times are the standard published values.](/courses/nclex/figures/nclex-insulin-curves.svg)

| Insulin | Onset | Peak | Duration | Exam hook |
|---|---|---|---|---|
| Rapid (lispro, aspart) | ~15 min | 1-2 h | 3-5 h | food must be IN REACH at injection |
| Short (regular) | 30-60 min | 2-4 h | 5-8 h | the only IV insulin; give ~30 min before meals |
| Intermediate (NPH) | 1-2 h | 4-12 h | 12-18 h | cloudy; the 3 AM / mid-afternoon hypoglycemia stem |
| Long (glargine, detemir) | 1-2 h | none | ~24 h | peakless basal; NEVER mixed in a syringe |

Every hypoglycemia-timing question is answered by matching symptom time to a peak: morning NPH peaking at 3 PM explains the pre-dinner shakiness; bedtime NPH peaking at 3 AM explains the night sweats and morning headache.

## 2.2 Mixing, injecting, storing

Mixing regular and NPH: draw CLEAR before CLOUDY (air into NPH, air into regular, draw regular, draw NPH) - contaminating the regular vial with NPH would blunt its rapid action for every future dose. Glargine is never mixed with anything. Rotate injection sites WITHIN one anatomical region (the abdomen absorbs fastest and most consistently) rather than region-hopping day to day; do not inject a limb about to be exercised - a pre-soccer thigh injection absorbs unpredictably fast. Unopened insulin lives in the refrigerator; the in-use vial or pen is fine at room temperature (within its labeled day limit) and stings less when not cold.

## 2.3 Basal-bolus logic

Physiologic replacement pairs a peakless basal (glargine) covering hepatic glucose output with rapid boluses covering meals plus correction doses by sliding scale. The exam tests the logic, not just the names: holding the basal because a client is NPO is the classic error - the basal covers the liver, not the meal; the MEAL bolus is what gets held with the tray, while basal continues (often adjusted) and glucose is monitored.`,
    },
    {
      id: '3-oral-agents',
      title: `3. Oral Agents and Non-Insulin Injectables`,
      content: `## 3.1 The type-2 ladder

| Class (prototype) | Mechanism, one line | The tested warning |
|---|---|---|
| Biguanide (metformin) | reduces hepatic glucose output | hold for iodinated CONTRAST studies and renal impairment - lactic acidosis risk; GI upset early |
| Sulfonylurea (glipizide) | squeezes insulin from beta cells | true HYPOGLYCEMIA risk (the only common oral class that causes it alone); teach like insulin |
| SGLT2 inhibitor (empagliflozin) | spills glucose in urine | genital/urinary infections; euglycemic DKA - ketones without high sugar |
| GLP-1 agonist (semaglutide, injectable) | incretin: slows gastric emptying, satiety | GI effects, weight loss; hold for suspected pancreatitis |
| DPP-4 inhibitor (sitagliptin) | prolongs incretin action | weight-neutral, well tolerated - the "no hypoglycemia alone" comparator |

Metformin is first-line and its contrast-study rule is the single most-tested fact in the table: hold the dose the day of (per protocol, through 48 hours after) an iodinated contrast scan and confirm renal function before restarting - the combination of contrast nephropathy and metformin accumulation is the lactic-acidosis setup.

## 3.2 Reading the med list as an exam skill

A type-2 client on glipizide who skips lunch is a hypoglycemia stem; the same skipped lunch on metformin alone is not - metformin does not drive sugar below normal by itself. An SGLT2 client with nausea and ketones but glucose of 180 is the euglycemic-DKA trap: normal-ish sugar does NOT exclude DKA on this class. These class-behavior contrasts, not mechanism trivia, are what the exam pays for.`,
    },
    {
      id: '4-hypoglycemia-sickdays',
      title: `4. Hypoglycemia and the Sick-Day Rules`,
      content: `## 4.1 Recognize, then treat by consciousness

Hypoglycemia (glucose below 70 mg/dL) announces itself through two channels: adrenergic - cold sweat, tremor, tachycardia, hunger, anxiety - and neuroglycopenic - confusion, slurred speech, drowsiness, seizure, coma. Beta-blockers mask the adrenergic warnings EXCEPT diaphoresis, so the beta-blocked diabetic who "just feels sweaty" is a high-yield stem.

The conscious client gets the 15-15 rule: 15 grams of fast carbohydrate - 4 oz of juice or regular soda, 3-4 glucose tablets - recheck in 15 minutes, repeat if still under 70, then a complex-carb-plus-protein snack if the next meal is over an hour away. Fat slows absorption: the candy bar is a wrong answer, not a treatment. The unconscious client gets nothing by mouth - IM/subcutaneous glucagon (family teaching point) or IV dextrose, positioned side-lying to protect the airway.

## 4.2 Sick-day rules

Illness raises counterregulatory hormones, so glucose RISES even when eating stops. The rules the exam tests verbatim: NEVER stop insulin when ill; check glucose every 2-4 hours; check urine ketones (type 1) when glucose runs high; keep drinking - substituting carbohydrate-containing liquids if solid food fails; call the provider for persistent vomiting, glucose persistently above ~240 with ketones, or DKA symptoms. "I skip my insulin when I can't eat" is the correction-target statement in every version of this question.

## 4.3 Worked dosage example

A client is prescribed regular insulin 0.1 unit/kg/hour IV for DKA. Weight: 80 kg. The vial is 100 units/mL, and pharmacy supplies a 100 units in 100 mL NS infusion.

Dose = 0.1 x 80 = **8 units/hour**. The infusion is 1 unit/mL, so the pump runs at **8 mL/hour**. Cross-check by units: (units/kg/h) x kg = units/h; units/h divided by units/mL = mL/h - the dimensional-analysis chain from the dosage-calculation chapter, applied where the exam most often puts it.`,
    },
    {
      id: '5-dka-vs-hhs',
      title: `5. DKA versus HHS`,
      content: `## 5.1 The comparison table

| Feature | DKA | HHS |
|---|---|---|
| Typical client | type 1, younger | type 2, older |
| Glucose | 250-600 mg/dL | often > 600 |
| Ketones / acidosis | present - pH low, anion gap | minimal / absent |
| Breathing | Kussmaul (deep, rapid), fruity breath | unremarkable |
| Dehydration | severe | PROFOUND - the defining feature |
| Neuro findings | alert to drowsy | prominent - confusion to coma |
| Onset | hours to a day | days of insidious decline |

The discriminator the exam wants: acidosis with Kussmaul breathing = DKA; extreme glucose with neurologic change and no significant ketosis = HHS.

## 5.2 Management order - and the potassium trap

The sequence is fixed and tested in order: **isotonic fluids FIRST** (the client is liters down; perfusion before chemistry), **then IV regular insulin infusion**, with **dextrose added to fluids when glucose reaches ~250** so ketones can keep clearing without hypoglycemia. The potassium trap decides most DKA questions: acidosis shifts potassium OUT of cells, so the admission K+ looks normal-to-high while total-body potassium is depleted - and insulin drives potassium back INTO cells, crashing the serum level. Verify adequate potassium and urine output BEFORE and during the infusion, replacing as needed; a K+ of 3.0 before insulin starts is a hold-and-replace stem, not a proceed stem. Bicarbonate is not routine. HHS runs the same fluids-then-insulin logic with even greater volume emphasis.

## 5.3 Why each step is the step

Fluids first because osmotic diuresis has drained the tank - insulin into an empty vascular bed drops pressure as glucose (an osmotic hold on water) leaves the blood. Dextrose at 250 because the goal of the infusion is clearing KETONES, not merely lowering sugar; stopping insulin early leaves the acidosis untreated. The potassium rule because the cell membrane is the largest potassium reservoir in the body and insulin is its doorman. Understanding the WHY converts a memorized sequence into a derivable one - the FE-EE standard applied to a medical emergency.`,
    },
    {
      id: '6-long-game',
      title: `6. Complications, Foot Care, and Self-Check`,
      content: `## 6.1 Surveillance schedule

Annual dilated eye exam (retinopathy), urine microalbumin and creatinine (nephropathy - ACE inhibitors/ARBs protect the kidney and are preferred antihypertensives here), monofilament foot exam (peripheral neuropathy), lipids and blood pressure aggressively managed (macrovascular disease is the leading killer). Tight control slows microvascular complications - the evidence-backed sentence behind every "why does my A1c matter" teaching stem.

## 6.2 Foot care - the question factory

Inspect feet daily with a mirror; wash and DRY thoroughly, especially between toes; moisturize the tops and soles but NOT between the toes (maceration invites fungus); never go barefoot, even indoors; shoes fitted and broken in gradually, with socks; nails trimmed straight across; no heating pads, hot soaks, or chemical corn removers; report any wound that does not begin healing promptly. The pathophysiology pair to cite: neuropathy HIDES injuries, vasculopathy STALLS healing - which is why a pebble in the shoe can end in amputation, and why every option that applies heat or sharp instruments to a diabetic foot is wrong.

## 6.3 Self-check (answers below - work them first)

1. Bedtime NPH; the client is found diaphoretic and confused at 3 AM. Why?
2. Type 1 client, vomiting all day, asks whether to take insulin. Your teaching?
3. DKA admission, K+ 5.0, insulin infusion ordered. Proceed?
4. Metformin client scheduled for a contrast CT tomorrow. What instruction?
5. Which oral class causes hypoglycemia as monotherapy?

**Answers.** 1. NPH peaks 4-12 h after injection - the bedtime dose peaks in the small hours; treat, then discuss dose/snack adjustment. 2. Never stop insulin when ill; check glucose q2-4h and urine ketones, push carbohydrate-containing fluids, call for persistent vomiting. 3. Yes - 5.0 with urine output is adequate to start, but expect the level to FALL as insulin drives K+ intracellularly; monitor and be ready to replace. It is the LOW-normal admission K+ that must be replaced first. 4. Hold metformin per protocol for the contrast study and until renal function is confirmed after - lactic-acidosis prevention. 5. Sulfonylureas (glipizide) - they push insulin out regardless of intake; metformin, SGLT2, DPP-4 do not cause hypoglycemia alone.`,
    },
  ],
  keyTakeaways: [
    `Diagnosis numbers: fasting >= 126, random >= 200 with symptoms, A1c >= 6.5%; A1c is the three-month truth-teller with a target below 7%.`,
    `Insulin clock: lispro peaks 1-2 h, regular 2-4 h (only IV insulin), NPH 4-12 h (the 3 AM stem), glargine peakless and never mixed; clear before cloudy.`,
    `Metformin holds for contrast studies; sulfonylureas alone cause hypoglycemia; SGLT2 can produce euglycemic DKA.`,
    `Hypoglycemia: 15-15 rule conscious, glucagon/IV dextrose unconscious; beta-blockers mask everything except sweating; never stop insulin on sick days.`,
    `DKA: fluids -> insulin -> dextrose at ~250, guarding the potassium insulin will crash; HHS is the drier, older, ketone-free cousin; foot care = inspect daily, dry between toes, never barefoot, nothing hot or sharp.`,
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

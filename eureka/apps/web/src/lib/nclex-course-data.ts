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
  domainWeight: 'Health Promotion and Maintenance (6-12%)',
  overview: `Development questions test two skills: recalling the milestone tables precisely enough to spot the child who is off-schedule, and matching nursing approach to developmental stage — how you prepare a toddler versus a school-age child for a procedure, what an adolescent needs from a hospital that a preschooler does not. This chapter carries the milestone tables, the Erikson stages with their nursing translations, age-banded vital signs, and the safety-and-screening calendar from infancy through older adulthood.`,
  sections: [
    {
      id: 'dev-infant',
      title: `1. Infancy: The Fastest Year`,
      content: `Infant milestones are the most-tested table in the category — learn the anchors and, more importantly, the RED FLAGS that mean referral:

| Age | Gross motor | Fine motor / social-language |
| --- | --- | --- |
| 2 months | lifts head prone | social smile; coos |
| 4 months | rolls front-to-back; steady head | grasps rattle; laughs |
| 6 months | rolls both ways; sits with support | transfers objects hand to hand; babbles; stranger anxiety BEGINS |
| 9 months | sits alone; crawls; pulls to stand | pincer grasp developing; waves bye; "mama/dada" nonspecific |
| 12 months | stands alone; first steps | fine pincer; 1-3 words; follows simple command |

Red flags the exam samples: no social smile by 2-3 months, poor head control at 4 months, not sitting by 9, not babbling by 9, no pincer by 12, not walking by 15-18, loss of ANY previously achieved skill at any age (regression always refers).

Physical growth anchors: birth weight DOUBLES by about 5-6 months and TRIPLES by 12; posterior fontanel closes by about 2-3 months, anterior by 12-18 — a bulging fontanel in a quiet upright infant suggests raised pressure, a sunken one dehydration.

Care by stage: TRUST vs mistrust (Erikson) is built by prompt, consistent responsiveness — the tested answer picks the caregiver who responds over the one who "avoids spoiling." Solids begin around 6 months (iron-fortified cereal classically first, one new food every few days to watch reactions); no honey before 12 months (botulism); no cow's milk as the main drink before 12 months; back-to-sleep, bare crib, rear-facing car seat.

Separation anxiety (peaking late infancy into toddlerhood) and stranger anxiety are NORMAL and tested as such — the answer normalizes and works with the parent present, not around them.`,
      examTip: `Doubles by 6 months, triples by 12; social smile at 2, sits at 6-with-support and 9-alone, pincer at 9-12, walks around 12-15 — and ANY lost milestone is a referral, not reassurance.`,
    },
    {
      id: 'dev-toddler-preschool',
      title: `2. Toddlers & Preschoolers: Autonomy and Magic`,
      content: `TODDLERS (1-3): Erikson's AUTONOMY vs shame — the developmental job is "me do it," and the nursing translations are choices-within-limits ("red cup or blue cup?" never "do you want medicine?"), ritual and routine preserved in the hospital, parallel play (alongside, not with, other children), and tolerance for the negativism ("no!") that marks the stage. Walking refines into running and stair-climbing; vocabulary explodes from a handful of words to short sentences by 2-3 years; toilet training readiness (dry periods, walking to the potty, expressing interest) is a readiness conversation, not a calendar date.

Toddler safety is the heaviest teaching cluster: drowning (never alone near ANY water — buckets included), poisoning (locked up-and-away, poison control number, NO ipecac), choking (the under-3 small-object rule, cut grapes and hot dogs lengthwise), falls, and the car seat progression from the safety chapter.

PRESCHOOLERS (3-5): INITIATIVE vs guilt — magical thinking rules: illness can feel like PUNISHMENT ("I got sick because I was bad"), body-integrity fears loom huge (adhesive bandages have outsized power), and intrusive procedures terrify beyond their objective severity. Nursing translations: simple honest explanations immediately before procedures (not days of dread), therapeutic play and equipment handling (let the child "listen" to the doll's heart first), bandage the site, and never describe anesthesia as "being put to sleep" (the pet that was "put to sleep" did not come back). Associative-to-cooperative play develops; imaginary friends are normal.

Discipline teaching across both stages: consistent, immediate, brief — time-out arithmetic (about one minute per year of age) is the classic tested detail; and the correct response to regression under stress (a hospitalized 4-year-old wetting again) is acceptance and support, not punishment — regression is a normal coping mechanism that resolves.`,
      examTip: `Offer toddlers choices between acceptable options, never yes-no questions about required care; give preschoolers honest just-in-time explanations and guard the "sleep" language — each stage has its scripted item.`,
    },
    {
      id: 'dev-school-adolescent',
      title: `3. School-Age & Adolescence: Industry and Identity`,
      content: `SCHOOL-AGE (6-12): INDUSTRY vs inferiority — competence is the currency: collections, rules, skills, teams. Concrete operational thinking arrives: they understand cause and effect, want to know HOW equipment works, and benefit from being given jobs in their own care (holding the dressing, charting their fluids). Explanations can come days ahead with models and diagrams; peers begin to matter; body-image awareness starts. Cooperative play with rules is the signature — and the tested hospital intervention keeps schoolwork and peer contact alive.

ADOLESCENTS (12-18): IDENTITY vs role confusion — peers are the reference group, privacy and confidentiality are clinical tools, and the interview happens partly WITHOUT the parent (screening for risk: mood, substances, sexuality, safety) per policy and law. Abstract thinking matures ahead of risk judgment (the imaginary audience and personal fable — "it cannot happen to me" — explain the risk-taking stems). Body image dominates; chronic illness and visible differences hit hardest here; adherence plans that respect autonomy (letting the adolescent manage their own insulin schedule with support) outperform surveillance.

| Stage | Erikson task | Play/peer mode | Procedure preparation |
| --- | --- | --- | --- |
| infant | trust | sensorimotor | parent present, comfort after |
| toddler | autonomy | parallel | immediately before; choices; ritual |
| preschool | initiative | associative/cooperative begins | just before; play-based; bandage it |
| school-age | industry | cooperative, rules | days ahead; models; give a job |
| adolescent | identity | peer group | full information; privacy; involve in decisions |

Immunization and screening calendars ride this section on the exam: scoliosis screening in early adolescence, vision and hearing through school years, and the adolescent-visit vaccine cluster per the current schedule — with the standing teaching that mild illness is not a contraindication to vaccination while anaphylaxis to a prior dose is.`,
      examTip: `Match preparation to cognition: toddlers get minutes and choices, preschoolers get play and honesty, school-agers get days and mechanics, adolescents get information and privacy. The mismatched option is always among the distractors.`,
    },
    {
      id: 'dev-adult-older',
      title: `4. Adults, Older Adults & Age-Banded Vitals`,
      content: `Young and middle adulthood (INTIMACY vs isolation, then GENERATIVITY vs stagnation) appear mostly as screening-calendar and life-transition stems: reproductive health, cardiovascular risk emergence, the sandwich-generation stress of midlife caregiving.

OLDER ADULTS (INTEGRITY vs despair) carry the tested content. Normal aging versus pathology is the core discrimination: presbyopia and presbycusis (high-frequency loss first — lower your PITCH, face the client, never shout), slower reaction time and recall speed, decreased skin turgor and thirst sensation, nocturia — all NORMAL. Confusion is NEVER normal aging: new confusion is delirium until proven otherwise (infection — classically urinary, hypoxia, medications, retention, impaction), and the delirium-versus-dementia table (acute and fluctuating with impaired attention versus chronic and progressive) decides its own items. Depression in older adults masquerades as somatic complaints and "just tired" — screened, not dismissed.

Polypharmacy surveillance, fall logic (the safety chapter relocated), skin integrity, and advance-care conversations round out the cluster. Reminiscence and life review are therapeutic, not rumination.

## Vital signs by age — the reference bands

| Age | Heart rate | Respirations | Systolic BP (approx.) |
| --- | --- | --- | --- |
| newborn | 110-160 | 30-60 | 60-90 |
| infant | 90-160 | 25-50 | 70-100 |
| toddler | 80-140 | 20-30 | 80-110 |
| preschool | 70-120 | 20-25 | 80-110 |
| school-age | 60-110 | 18-22 | 85-120 |
| adolescent/adult | 60-100 | 12-20 | 90-120 |

The direction of the trend is the tested logic: rates FALL and pressures RISE as children grow. A heart rate of 130 is fine in an infant and an emergency in an adolescent; respirations of 45 are expected in a newborn and alarming at 5 years — always index the number to the age before judging it.`,
      examTip: `New confusion in an older adult is delirium — hunt the cause (infection, drugs, hypoxia, retention) — and hearing loss teaching lowers pitch rather than raising volume. Both appear constantly.`,
    },
    {
      id: 'dev-selfcheck',
      title: `5. Self-Check`,
      content: `1. A 9-month-old at a well visit sits alone and transfers blocks but does not babble and has no pincer attempt. Which findings reassure and which refer?

2. A hospitalized 4-year-old, previously toilet-trained, starts bedwetting and tells the nurse she got sick "because I hit my brother." Interpret both behaviors and respond.

3. Choose the better phrasing for a 2-year-old due for an oral medication, and justify: "Do you want to take your medicine now?" versus "Do you want your medicine in the spoon or the cup?"

4. An 82-year-old with no cognitive history becomes acutely confused overnight; she is afebrile with cloudy, foul urine. Name the syndrome, distinguish it from dementia in one sentence, and state the likely driver.

5. A 15-year-old with newly diagnosed diabetes refuses to check glucose at school "because everyone stares." Which developmental forces are operating, and which plan respects them?

## Answers

1. Sitting alone at 9 months is on time. Absent babbling at 9 months is a red flag (hearing and language referral), and no pincer development by 9-12 months warrants close follow-up — one reassures, the others earn evaluation, and regression anywhere would too.

2. Regression (bedwetting under stress) is normal coping — accept without punishment, keep routines. The guilt statement is preschool magical thinking framing illness as punishment — correct it gently and concretely: "Being sick is not caused by being mad at your brother."

3. The second — toddlers get CHOICES WITHIN LIMITS, never a yes-no on required care. The first phrasing invites the developmental "no" and converts routine care into a battle.

4. Delirium — acute onset with fluctuating attention, versus dementia's slow progressive course. The cloudy urine points to urinary infection, the most classic delirium driver in older women; treat the cause and the confusion follows.

5. Identity formation and the peer reference group — the imaginary audience makes visible illness feel catastrophic. The respectful plan gives autonomy and privacy: a private testing location, self-management authority with support, and peer-normalized education (groups, camps) rather than parental surveillance.`,
    },
  ],
  keyTakeaways: [
    `Milestone anchors: smile 2, sit 6/9, pincer 9-12, walk 12-15, doubles-by-6 triples-by-12 — and regression at any age refers.`,
    `Erikson translates to nursing: respond to build trust, offer toddlers choices, play-prepare preschoolers honestly, give school-agers jobs and mechanics, give adolescents privacy and real decisions.`,
    `Preparation timing scales with cognition: minutes for toddlers, just-before play for preschoolers, days and models for school-age, full information for teens.`,
    `Pediatric vitals trend predictably — rates fall, pressures rise with age — so every number is judged against its band, not the adult range.`,
    `Normal aging never includes confusion: acute fluctuation is delirium (find the infection, drug, or retention), and older-adult teaching adapts pitch, pace, and print — not volume.`,
  ],
},

nx_maternal_newborn: {
  topicId: 'nx_maternal_newborn',
  title: `Maternal & Newborn Essentials`,
  domainWeight: 'Health Promotion and Maintenance (6-12%)',
  overview: `This survey chapter carries the maternity core the exam samples most: prenatal expectations and warning signs, labor's stages with fetal monitoring (the VEAL CHOP patterns, drawn), the postpartum hemorrhage watch, and the newborn's first assessments. Each block is built around the discrimination the items actually test — expected versus report-now — and the full maternity sequence (prenatal through newborn complications) is expanded chapter by chapter in the dedicated maternity unit.`,
  sections: [
    {
      id: 'mat-prenatal',
      title: `1. Pregnancy: Expected Course & Warning Signs`,
      content: `Prenatal items sort findings into three bins: expected discomforts, findings needing follow-up, and emergencies. The expected column: nausea easing after the first trimester, physiologic anemia of dilution, round-ligament pain, dependent edema LATE in pregnancy, Braxton Hicks contractions that are irregular and relieved by rest and hydration.

| Warning sign | Think |
| --- | --- |
| vaginal bleeding — painless, bright, later pregnancy | placenta previa — NO vaginal exams |
| abdominal pain + rigid uterus + dark bleeding | abruption — emergency |
| headache + visual changes + epigastric pain + face/hand swelling, after 20 weeks | preeclampsia advancing — check pressure and reflexes |
| sudden fluid gush before term | rupture of membranes — check FHR first, screen for prolapse |
| decreased fetal movement | evaluate — kick-count teaching (commonly 10 movements in 2 hours) |
| persistent vomiting with weight loss | hyperemesis — hydration, electrolytes |

Preeclampsia is the heaviest tested syndrome: new hypertension (140/90 or higher on repeat) after 20 weeks with proteinuria or severe features (the headache-vision-epigastric triad, brisk reflexes with clonus). Severe management: quiet dim room, seizure precautions, MAGNESIUM SULFATE with the surveillance bundle from the electrolyte chapter (reflexes hourly, respirations at least 12, urine output at least 30 mL/h, calcium gluconate at the bedside) — and delivery as the cure. An eclamptic seizure follows the seizure script plus left-side positioning and FHR evaluation after.

Standing prenatal teaching: folic acid before and through early pregnancy (neural tube defects), no alcohol at any dose, smoking cessation, listeria-avoidance foods (unpasteurized cheeses, deli meats heated), weight-gain bands per BMI, and left-lateral rest positioning (aortocaval compression — supine hypotension presents as dizziness and pallor relieved by turning to the side).`,
      examTip: `Painless bright bleeding = previa = no vaginal exam; painful rigid uterus = abruption. The pair is tested constantly, and the exam wants the exam-refusal detail, not just the diagnosis.`,
    },
    {
      id: 'mat-labor',
      title: `2. Labor and Fetal Monitoring`,
      content: `![Fetal heart rate decelerations against the contraction (dashed): EARLY mirrors the contraction (head compression - benign), LATE begins after the peak (uteroplacental insufficiency - reposition, oxygen, stop oxytocin), VARIABLE is an abrupt V at any timing (cord compression - reposition first). The VEAL CHOP pattern, drawn.](/courses/nclex/figures/nclex-fhr-decels.svg)

Labor stages in one line each: FIRST stage runs from onset to full dilation (latent to 6 cm, then active with expected progress); SECOND is pushing to birth; THIRD is the placenta (up to about 30 minutes); FOURTH is the recovery hours where hemorrhage risk peaks.

Fetal monitoring vocabulary: baseline FHR 110-160 with MODERATE VARIABILITY as the single best well-being indicator; accelerations are reassuring. The deceleration table is VEAL CHOP, and the figure above is its picture:

| Deceleration | Cause | Response |
| --- | --- | --- |
| Variable | Cord compression | reposition first; check for prolapse if abrupt and deep |
| Early | Head compression | benign — mirrors the contraction; monitor |
| Acceleration | Okay — well oxygenated | none needed |
| Late | Placental insufficiency | intrauterine resuscitation: reposition LEFT, IV fluid bolus, oxygen per protocol, STOP oxytocin, notify |

The intrauterine resuscitation bundle answers every late-decel and minimal-variability stem: side-lying reposition, fluids, oxygen, oxytocin OFF, provider notified — in an order that starts with the free intervention (position).

Oxytocin runs with a tachysystole rule: more than 5 contractions in 10 minutes (averaged over 30), or contractions over 2 minutes long or less than 1 minute apart, means STOP the infusion and resuscitate as above.

Cord prolapse is the drill item: felt or visible cord after rupture — call for help, position knee-chest or deep Trendelenburg, lift the presenting part OFF the cord with a gloved hand and DO NOT let go or replace the cord, prepare for emergency delivery.`,
      examTip: `VEAL CHOP with responses attached: variables reposition, earlies watch, lates resuscitate (position-fluids-oxygen-oxytocin off). The order of the resuscitation bundle is itself a tested sequence.`,
    },
    {
      id: 'mat-postpartum',
      title: `3. Postpartum: The Hemorrhage Watch & Recovery`,
      content: `Postpartum assessment runs on BUBBLE-HE (breasts, uterus, bladder, bowel, lochia, episiotomy/laceration, Homans/hemorrhoids, emotions), and the hemorrhage logic dominates testing.

The FUNDUS should be firm, midline, and descending about a fingerbreadth daily from the umbilicus. A BOGGY fundus gets MASSAGED first — the uterus that will not clamp down is the most common hemorrhage cause (atony), and massage is the free first intervention. A fundus deviated to the RIGHT means a FULL BLADDER splinting it: assist to void or catheterize per orders, then reassess. Persistent atony escalates to uterotonics per orders (oxytocin, methylergonovine — held for hypertension, carboprost — cautioned in asthma).

Lochia grades rubra (days 1-3), serosa, alba — and the report-now findings: saturating a pad in 15 minutes to an hour per protocol, clots larger than a small egg, return to bright red after progression, or foul odor (infection). Bleeding WITH A FIRM fundus points to a laceration — the provider looks, because massage cannot fix anatomy.

The postpartum vital-sign trap: bradycardia to the 50s can be NORMAL in early postpartum, while tachycardia is the hemorrhage compensations sign — the reverse of the usual instincts. Temperature to 38 C in the first 24 hours can reflect exertion and dehydration; sustained fever is infection.

Rh-negative mothers with Rh-positive newborns receive Rho(D) immune globulin within 72 hours; rubella-nonimmune mothers are vaccinated postpartum (live vaccine — avoid pregnancy per teaching window). Breastfeeding support (early, frequent, correct latch — areola not nipple, audible swallows, no timed limits) and the baby-blues-versus-postpartum-depression line (blues peak and RESOLVE within about two weeks; persistent or worsening mood, detachment, or any harm ideation is depression/psychosis territory and reported) round out the tested set.`,
      examTip: `Boggy fundus: massage first. Deviated right: empty the bladder. Firm fundus but bleeding: suspect a laceration and call. Three findings, three different first actions — the exam rotates them.`,
    },
    {
      id: 'mat-newborn',
      title: `4. The Newborn: First Hours & First Assessments`,
      content: `Immediate care runs dry-warm-stimulate: thermoregulation is the newborn's first vulnerability (cold stress burns glucose and oxygen), so skin-to-skin or warmer, hat, and dry blankets lead. Apgar scores at 1 and 5 minutes grade heart rate, respirations, tone, reflex irritability, and color (0-2 each): 7-10 reassuring, 4-6 moderate support, below 4 aggressive resuscitation — but resuscitation decisions NEVER wait for the score.

Expected newborn findings that stems disguise as alarming: acrocyanosis (blue hands and feet, first day) — normal, while CENTRAL cyanosis is an emergency; caput succedaneum (crosses suture lines, from the trip) versus cephalohematoma (does not cross, watch bilirubin); milia, erythema toxicum, Mongolian spots documented; molding; pseudo-menstruation and breast buds from maternal hormones. Normal vitals: HR 110-160, respirations 30-60 with brief periodic pauses, temperature guarded jealously.

Report-now newborn findings: central cyanosis, grunting-flaring-retracting (respiratory distress triad), sustained tachypnea over 60, apnea over 20 seconds, jitteriness (check GLUCOSE — the hypoglycemia sign; at-risk infants are the large, the small, and the diabetic mother's), temperature instability (sepsis presents as cold as often as hot), and jaundice IN THE FIRST 24 HOURS (pathologic — always; physiologic jaundice appears after day 2-3 and is managed by feeding and monitored bilirubin with phototherapy per nomogram: eyes shielded, maximal skin exposed, feeds continued, hydration watched).

Routine prophylaxis: vitamin K IM (absent gut flora cannot make clotting factors), erythromycin eye ointment, hepatitis B vaccine per schedule, newborn metabolic screening after feeds established, hearing screen, and safe-sleep-plus-car-seat discharge teaching from the safety chapter. Umbilical cord care is clean and dry; circumcision care watches for the first void and bleeding.`,
      examTip: `Jitteriness = check glucose; jaundice before 24 hours = pathologic = report; grunting-flaring-retracting = distress triad. The newborn section is a report-now recognition exam wearing a fuzzy hat.`,
    },
    {
      id: 'mat-selfcheck',
      title: `5. Self-Check`,
      content: `1. A 34-week client calls with painless bright-red bleeding after resting. What may not be done at triage, and why?

2. During oxytocin augmentation, the strip shows decelerations beginning after each contraction peak with minimal variability. Name the pattern and give the response bundle in order.

3. One hour postpartum, the fundus is boggy and deviated right of midline with heavy rubra flow. Sequence the first interventions.

4. A term newborn, 90 minutes old, has blue hands and feet and a respiratory rate of 52 with occasional 5-second pauses. Which findings are expected, and what would change the answer?

5. A day-old newborn of a diabetic mother is jittery with a weak cry. First bedside action and why?

## Answers

1. No vaginal examination — painless bright bleeding in later pregnancy is placenta previa until placental location is confirmed, and an exam finger through a previa causes hemorrhage. Ultrasound localizes first.

2. Late decelerations with minimal variability — uteroplacental insufficiency. STOP the oxytocin, reposition left-lateral, IV fluid bolus, oxygen per protocol, and notify the provider — with continuous monitoring and preparation for expedited delivery if unresolved.

3. Massage the fundus first (atony is the bleeding); the rightward deviation says the bladder is full — assist to void or catheterize per orders — then reassess tone and lochia, quantify blood loss, and escalate to uterotonics per orders if boggy persists.

4. Acrocyanosis and a rate of 52 with brief periodic pauses are NORMAL at this age. Central (trunk, mucous membrane) cyanosis, sustained rate over 60, grunting, flaring, retracting, or pauses over 20 seconds convert the stem into an emergency.

5. Heel-stick glucose — jitteriness is the classic newborn hypoglycemia sign and infants of diabetic mothers are the highest-risk group (fetal hyperinsulinism outlives the maternal glucose supply). Feed or treat per protocol on the result; symptomatic or unresponsive values escalate.`,
    },
  ],
  keyTakeaways: [
    `Sort pregnancy findings into expected versus warning: the previa/abruption pair, the preeclampsia triad after 20 weeks, and decreased movement all have fixed responses — and previa forbids the vaginal exam.`,
    `Fetal strips read VEAL CHOP with moderate variability as the reassurance gold standard; lates get the position-fluids-oxygen-oxytocin-off bundle, and tachysystole stops the drip.`,
    `Postpartum hemorrhage logic: massage the boggy fundus, empty the deviating bladder, suspect laceration when firm-but-bleeding — and postpartum bradycardia is normal while tachycardia is the warning.`,
    `Newborns: dry-warm-stimulate first, acrocyanosis normal but central cyanosis never, jitteriness checks glucose, jaundice inside 24 hours is pathologic.`,
    `Magnesium surveillance (reflexes, respirations, output, calcium gluconate ready) spans preeclampsia care — the electrolyte chapter's rules relocated to the birth suite.`,
  ],
},

nx_therapeutic_comm: {
  topicId: 'nx_therapeutic_comm',
  title: `Psychosocial Integrity & Therapeutic Communication`,
  domainWeight: 'Psychosocial Integrity (6-12%)',
  overview: `Psychosocial items are won on technique: the therapeutic response is learnable as a set of moves (and a longer set of blockers to avoid), suicide risk has a fixed assessment protocol that overrides every privacy instinct, and the high-yield psychiatric emergencies — withdrawal timelines, serotonin and neuroleptic crises, lithium and MAOI rules — are recognition tables. This chapter builds all four layers, plus the defense mechanisms, crisis intervention, and grief frameworks the category samples.`,
  sections: [
    {
      id: 'psy-technique',
      title: `1. Therapeutic Technique: Moves & Blockers`,
      content: `The correct response almost always does three things: acknowledges the FEELING, stays with the CLIENT's agenda, and keeps the door open. The distractors do recognizable wrong things:

| Therapeutic move | Sounds like |
| --- | --- |
| open-ended lead | "Tell me more about that." |
| reflection of feeling | "You sound frightened about the surgery." |
| restating | "You have not slept in three days." |
| silence with presence | staying, attending, not filling the pause |
| offering self | "I will sit with you for a while." |
| seeking clarification | "Help me understand what you mean by..." |
| focusing on the here-and-now | "What is worrying you most right now?" |

| Blocker (always wrong) | Sounds like |
| --- | --- |
| false reassurance | "Everything will be fine." |
| advice | "If I were you, I would..." |
| WHY questions | "Why did you stop the medication?" (interrogates, produces defensiveness) |
| changing the subject | "Let's talk about your diet instead." |
| minimizing | "Lots of people feel that way." |
| approval/disapproval | "That is the right attitude." (makes care conditional) |
| defending | "Your doctor is excellent." (dismisses the concern) |

The exam's engineering: the false-reassurance option FEELS kind, the advice option FEELS helpful — the therapeutic option often feels least satisfying because it does not fix anything. It is not supposed to; it keeps the client talking.

Two scope notes: acknowledging feeling does not mean agreeing with delusions (see below), and therapeutic communication coexists with limit-setting — empathic tone, firm boundary.`,
      examTip: `Eliminate blockers first — false reassurance, advice, "why," subject changes — and two or three options usually vanish. Among survivors, pick the one that names the feeling and stays on the client's topic.`,
    },
    {
      id: 'psy-suicide',
      title: `2. Suicide Risk, Safety & Crisis Intervention`,
      content: `Suicide items have bright-line answers. ASK DIRECTLY: "Are you thinking about killing yourself?" — direct asking does not plant the idea (a myth the exam explicitly tests) and is the assessment. Risk stratifies on plan-means-intent: a stated PLAN with available MEANS and expressed INTENT is the highest-acuity psychiatric finding on the exam and initiates constant observation (1:1), means restriction (nothing sharp, no cords/tubing per policy), and provider notification — confidentiality NEVER extends to suicide or homicide risk; safety disclosures are mandatory, and "I will tell you a secret if you promise not to share it" is answered by declining the promise.

The classic paradox item: a severely depressed client whose mood SUDDENLY lifts with unexplained calm or giving away possessions may have decided to die — energy returning before mood is the dangerous window (also the tested reason antidepressant initiation carries early risk warnings, especially in young clients). The "improved" client is reassessed, not celebrated.

Safety contracts do not substitute for observation; environment sweeps and one-to-one continue per policy.

## Crisis intervention

Crisis work is here-and-now and directive: assess safety FIRST, focus on the immediate precipitant not childhood history, mobilize existing supports, and aim for return to baseline function — crisis intervention is short-term by definition. The escalation ladder for agitated clients: least restrictive first — verbal de-escalation (calm tone, space, simple choices, remove the audience), then offered PRN medication, then seclusion/restraint only when danger is imminent, under the strict rules from Legal & Ethical Practice. Personal safety mechanics: stay between the client and the DOOR, keep distance, never turn your back, never block the client's exit while blocking your own.`,
      examTip: `Ask directly, act on plan-means-intent, break confidentiality for safety, and re-assess the suddenly serene depressed client. These four override every softer instinct the distractors appeal to.`,
    },
    {
      id: 'psy-disorders',
      title: `3. The Clinical Pictures: Psychosis, Mania, Cognition & Defenses`,
      content: `HALLUCINATIONS AND DELUSIONS have a scripted response: do not argue, do not agree — present reality gently and redirect to feelings and safety. "I do not hear the voices, but I can see they frighten you. What are they saying?" — the content question for COMMAND hallucinations is mandatory safety assessment, not curiosity. For paranoid clients: consistent staff, clear simple language, no whispering in view, packaged foods if food refusal is fear-based, and no touching without warning.

MANIA nursing is environmental engineering: reduce stimulation (private room when possible, calm brief interactions), finger foods and high-calorie portables (the client who cannot sit cannot sit for meals — the tested nutrition answer), physical outlets (walking with staff), firm consistent limits delivered without argument, and safety surveillance for exhaustion and impulsivity.

DELIRIUM vs DEPRESSION vs DEMENTIA in older adults extends the lifespan chapter's table: delirium is acute and fluctuating with clouded attention (find the cause); depression can mimic dementia ("pseudodementia" — answers "I don't know" rather than confabulating); dementia is insidious and progressive. Dementia care: routine, simple one-step directions, orientation supports early, VALIDATION of feeling over harsh reorientation late ("You miss your mother" beats "Your mother died years ago" for the distressed late-stage client), wandering safety, and caregiver support as legitimate nursing territory.

## Defense mechanisms — the naming table

| Mechanism | One-line example |
| --- | --- |
| denial | "The biopsy is wrong; I feel fine." |
| projection | the angry client says everyone else is hostile |
| displacement | yelled at by the boss, kicks the dog |
| rationalization | "I only failed because the test was unfair." |
| regression | the hospitalized 6-year-old wants a bottle |
| sublimation | channeling aggression into sport (mature) |
| reaction formation | excessive kindness toward a resented person |
| intellectualization | reciting statistics about the tumor, no feeling |

Grief runs on Kubler-Ross vocabulary (denial, anger, bargaining, depression, acceptance) with the tested caveats: stages are non-linear and optional, anger directed at staff is grief work not a complaint to defend against, and anticipatory grief before a death is normal. Complicated grief — function still collapsed months-to-years later, or absent grieving with somatic explosion — refers.`,
      examTip: `For hallucinations the sequence is fixed: acknowledge the feeling, present reality once without arguing, assess command content for safety, redirect. Any option that argues the voices are fake — or plays along — is wrong.`,
    },
    {
      id: 'psy-substance',
      title: `4. Substance Use: Withdrawal Clocks & Psychiatric Emergencies`,
      content: `![The alcohol withdrawal clock: early tremor and autonomic signs at 6-24 hours after the last drink, peak seizure risk in the first 48, and delirium tremens - the highest-mortality window - at 48-72 hours.](/courses/nclex/figures/nclex-etoh-withdrawal-timeline.svg)

Alcohol withdrawal runs a clock the exam expects you to read: EARLY (6-24 hours after the last drink) tremor, anxiety, diaphoresis, tachycardia, hypertension; SEIZURE risk peaks in the first 48; DELIRIUM TREMENS (48-72 hours) — disorientation, hallucinations, autonomic storm — is the highest-mortality window and a medical emergency, not a behavioral problem. Management: symptom-triggered BENZODIAZEPINES by withdrawal scale, THIAMINE BEFORE GLUCOSE (Wernicke prevention — the sequencing item), seizure precautions, quiet lighting, hydration and electrolytes.

Opioid withdrawal is miserable but rarely lethal (yawning, rhinorrhea, cramps, dilated pupils — managed supportively and with agonist therapy per orders); opioid OVERDOSE kills: pinpoint pupils, respiratory depression, coma — naloxone, repeated as needed because it outlasts nothing. Stimulant intoxication brings hypertension, hyperthermia, and paranoia; benzodiazepine withdrawal, like alcohol, can seize and is tapered, never stopped cold.

## The three drug emergencies

| Emergency | Setting | Signature | Response |
| --- | --- | --- | --- |
| serotonin syndrome | SSRI + another serotonergic (MAOI, tramadol, triptan, St. John's wort) | agitation, tremor, HYPERREFLEXIA/clonus, diaphoresis, hyperthermia | stop serotonergics, supportive cooling, notify — often within hours of the combination |
| neuroleptic malignant syndrome | antipsychotics | LEAD-PIPE RIGIDITY, hyperthermia, autonomic instability, mutism — over days | stop the antipsychotic, aggressive cooling, dantrolene/bromocriptine per orders |
| acute dystonia | early antipsychotic exposure | torticollis, oculogyric crisis, laryngeal spasm risk | IM anticholinergic (benztropine/diphenhydramine) — frightening, treatable, urgent |

Lithium rides with this section: 0.6-1.2 range, toxicity climbing from GI upset and coarse tremor toward ataxia, confusion, and seizures — DEHYDRATION, sodium loss, and NSAIDs raise levels, so the teaching is steady salt and water intake and no casual ibuprofen. MAOI clients keep the tyramine list from pharmacology. SSRIs take weeks to work (teach the wait), are not stopped abruptly, and carry the early-energization suicide-risk window from section 2.`,
      examTip: `Clonus-and-hyperreflexia within hours points to serotonin syndrome; rigidity-and-mutism over days on an antipsychotic points to NMS. The reflexes and the clock separate the two hyperthermic emergencies.`,
    },
    {
      id: 'psy-selfcheck',
      title: `5. Self-Check`,
      content: `1. A pre-op client says, "I am sure I will not wake up from anesthesia." Rank these responses: "You have an excellent surgical team." / "Tell me more about what you are afraid of." / "Do not worry — this surgery is very routine."

2. A client hospitalized for depression suddenly appears peaceful, gives her roommate her books, and thanks the staff "for everything." Interpret and act.

3. A client with schizophrenia reports voices telling him to hurt his roommate. Give the response sequence.

4. A client admitted yesterday afternoon for pancreatitis becomes tremulous and diaphoretic with BP 168/98 and HR 118; he "had a few beers daily" per history. Place him on the clock and name the two medication priorities.

5. Three days after starting an SSRI, a client who also takes tramadol develops agitation, tremor, and inducible ankle clonus with a temperature of 38.6 C. Name it, distinguish it from NMS, and act.

## Answers

1. The open-ended exploration is correct — it names and pursues the client's fear. "Excellent team" is defending, "do not worry / routine" is false reassurance; both blockers close the conversation. (A statement of impending doom also earns a physiologic assessment and provider notification — sudden doom can be somatic.)

2. Sudden peace plus giving away possessions in a depressed client signals a made decision to die. Assess directly for plan, means, and intent now; initiate continuous observation and means restriction per policy; notify. This is the paradox window, not improvement.

3. Command hallucinations targeting another person: assess the content and intent directly, present reality once without arguing, ensure the roommate's and client's immediate safety (separation, observation level), notify the provider, and document — the safety steps outrank the communication finesse.

4. Roughly 18-24 hours since the last drink — early withdrawal, with the seizure window opening through 48 hours and DTs beyond. Priorities: symptom-triggered benzodiazepines per scale, and thiamine BEFORE any glucose-containing fluids, with seizure precautions and quiet environment.

5. Serotonin syndrome — the SSRI-tramadol combination, hours-to-days onset, and HYPERREFLEXIA with clonus distinguish it from NMS's lead-pipe rigidity on antipsychotics over days. Stop the serotonergic agents, cool and support, continuous monitoring, notify now.`,
    },
  ],
  keyTakeaways: [
    `Kill the blockers first (false reassurance, advice, why, subject changes); the right response names the feeling and keeps the client talking.`,
    `Ask about suicide directly, act on plan-means-intent with 1:1 and means restriction, never promise secrecy, and re-assess the suddenly calm depressed client.`,
    `Hallucinations: acknowledge feeling, present reality once, assess command content, redirect; mania gets low stimulation, finger foods, firm limits.`,
    `Alcohol withdrawal keeps a clock — tremor by 24 h, seizures by 48, DTs 48-72 — managed with scale-driven benzodiazepines and thiamine before glucose.`,
    `Separate the hyperthermic emergencies by reflexes and time: clonus-fast is serotonin syndrome, rigid-slow on antipsychotics is NMS — and lithium toxicity rides dehydration, sodium loss, and NSAIDs.`,
  ],
},

nx_basic_care: {
  topicId: 'nx_basic_care',
  title: `Basic Care & Comfort`,
  domainWeight: 'Basic Care and Comfort (6-12%)',
  overview: `Basic Care and Comfort is the fundamentals category — mobility, skin, nutrition, elimination, sleep, and pain — and its items are decided by precise mechanics: exact positioning names, pressure-injury staging, diet-by-condition tables, catheter and ostomy rules, and the assistive-device gait patterns. This chapter compresses those mechanics into the tables and scripts the items quote.`,
  sections: [
    {
      id: 'bcc-mobility',
      title: `1. Mobility, Positioning & Assistive Devices`,
      content: `Positioning is a vocabulary test with a physiologic key:

| Position | Use it for |
| --- | --- |
| high Fowler's (60-90) | dyspnea, meals, NG insertion, pulmonary edema (legs down) |
| semi-Fowler's (30-45) | head injury/ICP (30, midline), post-thyroidectomy, tube feeding running |
| left lateral / Sims | enemas, unconscious airway protection, postpartum supine-hypotension rescue |
| prone | rarely; post-amputation hip-flexion prevention per orders; ARDS per protocol |
| Trendelenburg variants | central line insertion/removal (air embolism physics); NOT modern shock care |
| dorsal recumbent / lithotomy | perineal exams and procedures |

Classic pairing items: post-lumbar-puncture lies FLAT (headache prevention per protocol); post-cataract surgery avoids the operative side and anything that raises eye pressure; above-knee amputation avoids prolonged sitting and PILLOWS UNDER THE STUMP after the early phase (flexion contracture); post-total-hip-replacement keeps ABDUCTION (pillow between legs), no crossing, no bending past 90 degrees, no internal rotation — the raised toilet seat and no-low-chairs teaching cluster.

## Assistive-device mechanics

Canes: held on the STRONG side, advanced WITH the weak leg; the memory hook "COAL" — cane opposite affected leg. Walkers: move the walker, then step in — "wandering wilma's always late" aside, the tested points are all four legs down before weight, no carrying it up stairs. Crutches: weight on HANDS never axillae (nerve injury), 2-3 fingerwidths below the axilla, and the stair rule "up with the good, down with the bad" — good leg leads ascending, crutches-and-bad leg lead descending. Gait patterns (2-point, 3-point for non-weight-bearing, 4-point, swing-through) match the ordered weight-bearing status.

Immobility's harm map organizes half the category: pneumonia and atelectasis (turn, cough, breathe, spirometer), DVT (SCDs, ambulation, prophylaxis), pressure injury (below), constipation (fluid, fiber, schedule), urinary stasis and stones, orthostatic intolerance (dangle first), contractures and footdrop (ROM, boots per orders), and disuse osteoporosis. Every immobilized-client stem is asking which harm is declaring itself.`,
      examTip: `Cane strong-side, crutch weight on hands, up-with-the-good-down-with-the-bad, hip replacement = abduction and under-90 flexion. These four mechanical facts each decide recurring items.`,
    },
    {
      id: 'bcc-skin',
      title: `2. Skin Integrity & Pressure Injury Staging`,
      content: `Staging is a straight recall table the exam samples verbatim:

| Stage | Definition | The tested marker |
| --- | --- | --- |
| 1 | intact skin, NON-BLANCHABLE redness | press it — blanchable redness is not yet an injury |
| 2 | partial-thickness loss — shallow open ulcer or intact/ruptured blister | pink, moist, no slough |
| 3 | full-thickness — subcutaneous fat visible | no bone/tendon/muscle visible; slough possible |
| 4 | full-thickness with exposed bone, tendon, or muscle | probe-to-bone territory; osteomyelitis risk |
| unstageable | base obscured by slough/eschar | cannot stage what you cannot see |
| deep tissue injury | intact purple/maroon discoloration or blood blister | evolves — protect and watch |

Prevention is the bundled answer: reposition at least every 2 hours in bed (and shift weight every 15-30 minutes seated), 30-degree lateral tilts rather than direct trochanter pressure, heels FLOATED off the bed, moisture management, no massage over bony reddened areas (it grinds fragile tissue), no donut cushions (they ring-ischemize), lift-don't-drag (shear), nutrition with adequate protein, and a validated risk scale (Braden: sensory, moisture, activity, mobility, nutrition, friction/shear — lower is worse) on schedule.

Wound care logic: moist wound healing beats dry, granulation tissue (beefy red) is protected not scrubbed, necrotic tissue is debrided per orders, and wounds are measured and documented consistently (length, width, depth, tunneling by clock position). Dehisced and infected wounds route back to the perioperative chapter's scripts.`,
      examTip: `Non-blanchable is the word that makes stage 1; visible fat is 3; visible bone is 4; covered-by-eschar is unstageable. And two prevention absolutes: no donuts, no massaging red bony prominences.`,
    },
    {
      id: 'bcc-nutrition',
      title: `3. Nutrition & Therapeutic Diets`,
      content: `Diet-by-condition is a straight table the items quote:

| Condition | The diet logic |
| --- | --- |
| heart failure / hypertension | sodium restriction (commonly 2 g); label literacy over saltshaker virtue |
| renal failure (pre-dialysis vs dialysis differ) | potassium, phosphorus, sodium restricted; protein per stage and modality |
| cirrhosis with encephalopathy | sodium restricted; protein managed per provider (not eliminated) |
| celiac disease | gluten-free — no wheat, barley, rye; oats only if certified |
| diverticulosis vs diverticulitis | high fiber when well; low residue/bowel rest during flares |
| dumping syndrome (post-gastrectomy) | small frequent meals, HIGH protein/fat, LOW simple carbs, liquids BETWEEN meals, lie down after |
| gout | limit purines: organ meats, shellfish, beer |
| iron therapy | give with vitamin C, not with dairy/antacids; stools darken (expected) |
| warfarin | CONSISTENT vitamin K greens, not elimination |
| COPD | small frequent high-calorie meals |
| pancreatitis recovery | low fat |

Aspiration-precaution feeding consolidates the stroke chapter's rules: upright 90 degrees, chin tuck when taught, thickened liquids per speech evaluation, small bites, no straws when directed, check for pocketing on the weak side, stay upright 30+ minutes after.

Enteral feeding mechanics: head of bed at least 30 degrees at ALL times while running (aspiration), placement verified initially by X-ray, residuals and tube patency per policy (flush before and after medications, each medication separately, nothing crushed that cannot be — the pharmacology chapter's rule at the bedside), and formula hang-times per policy. Diarrhea is the most common complication (rate, formula, sorbitol elixirs); the sudden-cessation-hypoglycemia logic from TPN applies in spirit to abruptly stopped continuous feeds in insulin-covered clients.`,
      examTip: `Dumping syndrome inverts intuition twice: liquids BETWEEN meals not with them, and lying DOWN after eating — the only diet where recumbency after meals is the right answer.`,
    },
    {
      id: 'bcc-elimination',
      title: `4. Elimination: Catheters, Ostomies & Bowel Care`,
      content: `Catheter care consolidates the safety chapters: dependent drainage below the bladder, no loops, secured to the thigh, perineal care per shift, sample from the port, and OUT at the earliest order (CAUTI). Intermittent catheterization uses sterile technique in hospital, clean at home — a tested distinction. Post-removal, the void watch (6-8 hours) with bladder scan for retention.

Ostomy assessment: a healthy stoma is PINK-RED and moist; pale, dusky, purple-black is ischemia — a report-now finding, always. Output logic follows anatomy: ileostomies run LIQUID and continuous (dehydration and skin risk, never irrigate, watch for blockage with corn/nuts/popcorn teaching), sigmoid colostomies produce formed stool (and MAY be irrigated on schedule to train regularity). Appliance mechanics: empty at one-third full, size the barrier to the stoma (a few millimeters clearance), expect size change as edema resolves over weeks. The psychosocial layer is tested equally: looking at the stoma is a milestone; the nurse's matter-of-fact competence models acceptance; referral to an ostomy nurse and peer groups is a strong answer.

Bowel program logic: constipation prevention (fluid, fiber, activity, scheduled toileting after meals to ride the gastrocolic reflex, answering the urge); impaction presents as seeping LIQUID stool around a blockage — the paradoxical-diarrhea item — confirmed by exam per policy and treated per orders. Enema mechanics: left Sims position, lubricated tip a few inches, bag height moderate (high pressure cramps), stop-and-breathe for cramping. Digital stimulation and disimpaction carry VAGAL bradycardia risk in cardiac and spinal clients — and in spinal cord injury above T6, a distended bladder or bowel can trigger AUTONOMIC DYSREFLEXIA: pounding headache, hypertension, flushing above the lesion — sit the client up, find and remove the trigger (kinked catheter first), and treat per protocol. It is an emergency the elimination chapter owns.`,
      examTip: `Stoma color is a traffic light — dusky means call. Ileostomy = liquid, never irrigate; sigmoid colostomy = formed, may irrigate. And liquid stool in a constipated client is impaction until examined.`,
    },
    {
      id: 'bcc-comfort',
      title: `5. Pain, Sleep & Comfort Measures`,
      content: `Pain is what the client says it is — the self-report rules, and the exam punishes options that substitute the nurse's skepticism ("he is laughing with visitors, so I held the opioid"). Scales match development and cognition: numeric for adults and older children, FACES for young children, FLACC (face, legs, activity, cry, consolability) for the preverbal, and behavioral indicators plus family input for the nonverbal — but observed calm never overrides a stated 8.

Pain management layers: scheduled dosing beats PRN-chasing for continuous pain; PCA pumps are pressed by the CLIENT ONLY (family-pressed buttons defeat the safety design — a tested teaching point); opioid surveillance pairs sedation level with respirations (sedation precedes depression); and nonpharmacologic measures (repositioning, heat and cold with 15-20-minutes-and-a-barrier rules, massage, distraction, relaxation, guided imagery) are adjuncts, not substitutes, in acute severe pain — but strong answers in chronic and procedural contexts.

Heat and cold mechanics: cold first for acute injury (vasoconstriction limits swelling) typically in the first 24-48 hours, heat for muscle spasm and chronic stiffness; barriers always; timed applications; extra caution with impaired sensation, circulation, and the very young or old — the diabetic-neuropathy heating-pad burn is a standing stem.

Sleep hygiene teaching: consistent schedule, dark cool quiet room, no screens near bedtime, caffeine cut in the afternoon, no alcohol as a sleep aid (fragments sleep), beds for sleep not worry, and daytime naps limited. Hospital sleep is nursing-engineered: cluster care to protect sleep blocks, lights and noise down, pain treated, and unnecessary night vitals questioned per orders — the tested mindset treats sleep as therapy, not a luxury.

End-of-life comfort belongs here too: repositioning, mouth care (often the highest-comfort intervention in final days), secretion management, presence, and honest family coaching (hearing persists late; speak to the client). Comfort-focused does not mean care-free — it means the goal changed.`,
      examTip: `Self-report outranks appearances, sedation change precedes respiratory depression, and only the client presses the PCA button. Three absolutes that each anchor recurring items.`,
    },
    {
      id: 'bcc-selfcheck',
      title: `6. Self-Check`,
      content: `1. A client with left-leg weakness is learning a cane. Which side holds the cane, which leg advances with it, and who leads on stairs?

2. Stage this wound: full-thickness sacral ulcer with visible subcutaneous fat, slough at the edges, no bone or tendon visible.

3. A post-gastrectomy client reports weakness, sweating, and cramping 20 minutes after meals. Name it and give three diet instructions.

4. A T4 spinal-cord-injured client suddenly develops a pounding headache, BP 210/110, and flushing above the chest. Name it and give the first three actions.

5. An ileostomy client asks whether she should irrigate her stoma like her friend with a colostomy does. Answer, and name the stoma finding that would be an emergency.

## Answers

1. Cane in the RIGHT (strong) hand — opposite the affected leg; the cane advances WITH the weak left leg. Stairs: up with the good (right leads up), down with the bad (cane and left lead down).

2. Stage 3 — full thickness with visible fat but no bone, tendon, or muscle. Slough at the edges does not make it unstageable while the base is visible.

3. Dumping syndrome. Small frequent meals; high protein and fat with LOW simple carbohydrates; liquids BETWEEN meals rather than with them — and lying down briefly after eating slows transit.

4. Autonomic dysreflexia — a lesion above T6 plus a noxious trigger below. Sit the client fully upright (drop the pressure), hunt and remove the trigger — kinked or blocked catheter first, then bowel, then skin — and notify/treat per protocol if pressure persists. Minutes matter; stroke is the risk.

5. No — ileostomy output is liquid and continuous; irrigation is only for trainable formed-stool colostomies (sigmoid). The emergency finding is a dusky, purple, or black stoma — ischemia — reported immediately.`,
    },
  ],
  keyTakeaways: [
    `Device mechanics decide items: cane strong-side with the weak leg, crutch weight on hands, up-with-the-good-down-with-the-bad, hip precautions = abduction and under-90.`,
    `Stage pressure injuries by what is visible (non-blanchable / fat / bone / obscured), prevent with q2h turns, floated heels, no donuts, no massage on red bone.`,
    `Diet tables are quotable: renal restricts K-phos-Na, celiac bans wheat-barley-rye, dumping wants liquids between meals and recumbency after.`,
    `Stoma color is the traffic light, ileostomies never irrigate, paradoxical liquid stool means impaction — and above-T6 injuries convert elimination triggers into autonomic dysreflexia emergencies.`,
    `Pain is the client's report: match the scale to development, watch sedation before respirations, client-only PCA, and treat sleep and mouth care as real therapy.`,
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
  domainWeight: 'Reduction of Risk Potential (9-15%)',
  overview: `Perioperative questions walk the surgical timeline — preparation, the immediate recovery hour, and the complication watch that follows — and each phase has its own checklists and its own emergencies. This chapter covers pre-op verification and medication decisions, PACU priorities, the day-by-day complication calendar (atelectasis to embolism to dehiscence), and the tube-and-drain rules that surgical stems assume you know.`,
  sections: [
    {
      id: 'periop-preop',
      title: `1. Pre-Op: Verification, Teaching & Medication Decisions`,
      content: `Pre-op nursing is a verification engine: consent signed BEFORE any sedating premedication (a sedated signature is invalid — sequence errors here are classic items), NPO status confirmed (typical published guidance: clear liquids up to 2 hours, light meal about 6, heavier meals about 8 — the exam follows the order and the institution), history and allergies (latex, iodine/shellfish for some preps, prior anesthesia reactions and any FAMILY history of malignant hyperthermia), jewelry and prosthetics removed, and the surgical site marked with the client involved.

## The medication sort

| Medication | Usual pre-op handling |
| --- | --- |
| anticoagulants and antiplatelets | held on a provider-set schedule (warfarin days ahead, verified by INR) |
| insulin | reduced or adjusted — NPO changes the arithmetic; glucose checked |
| oral hypoglycemics | typically held the morning of surgery; metformin coordinated around contrast |
| beta blockers | usually CONTINUED with a sip of water — abrupt stop risks rebound |
| anticonvulsants, cardiac drugs | usually continued — clarify, do not assume |
| herbal supplements | the g-list (ginkgo, garlic, ginseng, ginger) increases bleeding — report use |

Pre-op teaching that changes outcomes: incentive spirometry and splinting DEMONSTRATED before surgery (teaching through anesthesia fog fails), turning-coughing-deep-breathing schedule, early ambulation expectations, and honest pain-plan conversation. Effectiveness is the return demonstration, not a nod.`,
      examTip: `Consent precedes sedation — if the stem shows the premedication given and the consent unsigned, the surgery does not proceed on that signature, and the answer notifies the surgeon. Sequence is the whole item.`,
    },
    {
      id: 'periop-pacu',
      title: `2. PACU: The First Hour`,
      content: `Post-anesthesia priorities are rigidly ordered: AIRWAY (patency, positioning — lateral or head-turned until gag returns for general anesthesia), BREATHING (rate, depth, saturation; anesthetics and opioids depress both), CIRCULATION (pressure, pulse, site bleeding, dressings AND beneath the client — blood tracks), then neurologic recovery and pain. The airway answer beats the pain answer every time in the first-hour stem.

Report-now findings in the PACU: stridor or crowing respirations (laryngospasm — airway emergency), saturation falling despite oxygen, systolic pressure trending down with rising pulse (bleeding until proven otherwise), rigidity with a climbing temperature (see malignant hyperthermia below), and a dressing that saturates serially.

## Spinal and epidural recovery

Regional anesthesia adds its own rules: motor and sensory return are documented distal-to-proximal; the client stays flat per protocol after spinal anesthesia (post-dural-puncture headache is positional — worse upright — and treated with fluids, caffeine per orders, and blood patch when severe); orthostatic falls are the mobilization risk; and urinary retention is expected surveillance — a palpable bladder with no void within the protocol window gets a bladder scan.

## Malignant hyperthermia

The anesthesia emergency the exam loves: a hypermetabolic crisis triggered by volatile anesthetics and succinylcholine in susceptible clients. EARLIEST signs are unexplained tachycardia, tachypnea, a RISING end-tidal CO2, and muscle rigidity (jaw first) — the temperature spike is a LATE sign despite the name. Response: stop the triggering agent, call for the MH cart, DANTROLENE per protocol, 100% oxygen, active cooling, and treat the potassium the crisis releases. Family history screens for it; a prior uneventful anesthetic does not rule it out.`,
      examTip: `In MH stems, rising end-tidal CO2 and rigidity BEAT fever as the recognition cue — candidates who wait for temperature pick the late answer. Dantrolene is the drug pairing to know cold.`,
    },
    {
      id: 'periop-complications',
      title: `3. The Complication Calendar`,
      content: `Post-op complications keep a rough schedule, and the exam writes stems on it:

| Timing | Complication | The picture | First moves |
| --- | --- | --- | --- |
| first 48 h | atelectasis | low-grade temp, diminished bases, mild hypoxia | spirometry, cough-deep-breathe, ambulate |
| days 1-3 | hypoxemia/pneumonia risk builds | crackles, productive cough, fever climbing | same bundle plus cultures/antibiotics per orders |
| days 3-5 | wound infection declares | redness, warmth, purulence, fever | assess, culture per orders, notify |
| days 5-10 | DVT and embolism window peaks | unilateral swelling/warmth; sudden dyspnea if it travels | do NOT massage; notify; anticoagulation pathway; PE = rapid response |
| days 5-10 | dehiscence/evisceration | "something gave way," serosanguineous gush | low Fowler with knees flexed, cover viscera with STERILE SALINE gauze, NPO, call surgeon — do not push anything back |
| any time | urinary retention | no void 6-8 h post-op, palpable bladder | bladder scan, then catheterization per orders |
| any time | paralytic ileus | absent bowel sounds, distension, no flatus | NPO, ambulate, notify; NG decompression per orders |

Pulmonary embolism is the sudden catastrophe of the calendar: abrupt dyspnea, pleuritic pain, tachycardia, apprehension in a post-op or immobilized client — sit the head of the bed up, oxygen, rapid response, and anticipate the anticoagulation pathway. The paired prevention items (sequential compression devices ON whenever in bed, early ambulation, prophylactic anticoagulants given on time) score as often as the recognition items.

Post-op fever logic follows the timeline: lungs first days, then urine, then wound, then veins — the sequence tells you where to look before the culture results do.`,
      examTip: `Evisceration has a fixed script the exam quotes verbatim: position low Fowler knees flexed, sterile saline-moistened gauze over the viscera, NPO, notify the surgeon now. Any answer that repositions organs or delays is wrong.`,
    },
    {
      id: 'periop-tubes',
      title: `4. Tubes, Drains & Surgical Devices`,
      content: `Device questions test placement checks, expected output, and the report-now thresholds.

Nasogastric tubes: placement verified by X-RAY initially (aspirate pH per policy thereafter — auscultating air is obsolete and appears only as a wrong answer); suction settings per order (low intermittent for single-lumen); the vented lumen of a double-lumen (Salem sump) stays open to air and above the stomach; irrigation per orders with the ordered solution. NG output is measured, described, and REPLACED per orders when large — losing liters of gastric acid builds the metabolic alkalosis from the ABG chapter.

Closed-suction drains (Jackson-Pratt, Hemovac) hold gentle negative pressure: empty, measure, RECOMPRESS to re-establish suction, and chart character — serosanguineous drifting toward serous is the healing arc; a sudden return to frank red, or volumes climbing instead of falling, is a call. Penrose drains are passive and dress-absorbed; T-tubes after biliary surgery drain bile with expected volumes tapering.

Chest tubes summarize into three observations: TIDALING in the water seal with respiration is normal (its absence means lung re-expanded OR tube kinked/clotted — trace the tubing first); CONTINUOUS bubbling in the water seal is an air leak (system or client — locate it); drainage over the ordered threshold (commonly cited around 100 mL/h sustained, or per surgeon parameters) or suddenly bright red is a hemorrhage call. Never clamp a chest tube for transport; never strip/milk routinely; if the system cracks, the tube goes into sterile water while a new unit is set up; an accidental pull-out gets an occlusive dressing taped on three sides.

Urinary catheters: dependent drainage (bag below bladder, tubing unlooped), secured to the thigh, perineal care per shift, sampling from the port never the bag, and out at the earliest order — catheter days are CAUTI risk. Post-removal, the void watch begins.`,
      examTip: `Chest tube triage in one line: tidaling good, continuous bubbling equals leak, no tidaling equals check the tubing then the lung — and the clamp stays off.`,
    },
    {
      id: 'periop-selfcheck',
      title: `5. Self-Check`,
      content: `1. The pre-op checklist shows midazolam given at 0800; the consent is unsigned. The surgeon asks the nurse to witness the signature now. Response?

2. In the PACU, a client develops jaw rigidity, heart rate 138, and end-tidal CO2 climbing; temperature is 37.2 C. What is happening and what drug does the nurse prepare?

3. On post-op day 6, an abdominal surgery client says "I felt something pop," and the dressing shows a sudden serosanguineous gush with a loop of bowel visible. Give the four-part response in order.

4. A chest-tube water seal shows continuous vigorous bubbling. Interpret, and give the first action.

5. A client is post-op day 1 with a temperature of 37.9 C and diminished breath sounds at the bases. Most likely cause and the nursing bundle?

## Answers

1. Decline — the client is sedated and cannot give valid consent. The case waits; the surgeon is notified through channels. Witnessing now creates an invalid consent, and "the surgeon asked" changes nothing.

2. Malignant hyperthermia — rigidity plus tachycardia plus rising CO2 are the EARLY cluster; fever comes late. Prepare dantrolene, stop triggering agents, 100% oxygen, cooling, and the MH protocol.

3. Low Fowler's with knees flexed; cover the viscera with sterile saline-moistened gauze; NPO; notify the surgeon immediately. Nothing gets pushed back in, and the client stays still.

4. An air leak — continuous bubbling in the WATER SEAL chamber is air entering the system. Trace the tubing from dressing to unit for loose connections first; assess the client; notify if not resolved. (Gentle suction-chamber bubbling, by contrast, is normal.)

5. Atelectasis — the day-1-to-2 low-grade fever with diminished bases. Incentive spirometry every hour while awake, cough and deep breathe with splinting, ambulate as ordered, and reassess — escalating only if the picture worsens toward pneumonia.`,
    },
  ],
  keyTakeaways: [
    `Consent before sedation, NPO verified, site marked with the client, anticoagulants held on schedule, beta blockers usually continued — pre-op is sequence and verification.`,
    `PACU runs airway-breathing-circulation before comfort, and malignant hyperthermia announces itself with rigidity and rising CO2 before fever — dantrolene is the answer.`,
    `Complications keep a calendar: atelectasis early, infection mid, DVT/PE and dehiscence late — and evisceration has a fixed four-part script.`,
    `NG placement is verified by X-ray then pH (never air auscultation), drains are recompressed and trended, and chest tubes read tidaling-versus-bubbling with the clamp off.`,
    `Prevention scores like recognition: spirometry, splinting, SCDs on in bed, early ambulation, timely prophylaxis — taught before surgery, demonstrated back.`,
  ],
},

nx_fluid_electrolyte: {
  topicId: 'nx_fluid_electrolyte',
  title: `Fluids, Electrolytes & Acid-Base`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Electrolyte questions are pattern-recognition with a safety layer: each imbalance has a signature cluster, a cause list, a correction rule, and one or two absolute prohibitions (never push potassium, never correct sodium fast). This chapter maps fluid volume states, walks all six electrolytes with their signs and treatments, and connects the acid-base chapter's ABG method to the bedside pictures that produce each disturbance.`,
  sections: [
    {
      id: 'fe-volume',
      title: `1. Fluid Volume: Deficit & Excess`,
      content: `![Adult serum electrolyte reference intervals - sodium 135-145 and potassium 3.5-5.0 mEq/L, chloride 98-106, calcium 9.0-10.5, magnesium 1.8-2.6, and phosphorus 3.0-4.5 mg/dL - drawn as range bars, each row on its own scale.](/courses/nclex/figures/nclex-electrolyte-ranges.svg)

Fluid volume DEFICIT (hypovolemia): thirst, dry mucosa, poor turgor (unreliable in older adults — check the sternum or inner thigh), flat neck veins, tachycardia with a weak thready pulse, orthostatic drops, concentrated urine with rising specific gravity, climbing BUN out of proportion to creatinine, and weight LOSS. The kidneys speak early: urine output falling below 30 mL/h (0.5 mL/kg/h) is the tested oliguria threshold. Treatment: isotonic fluids, treat the cause, daily weights.

Fluid volume EXCESS (hypervolemia): bounding pulse, distended neck veins, crackles, dyspnea and orthopnea, edema (dependent, then generalized), weight GAIN, diluted labs (hematocrit and sodium falling by dilution). Heart failure, renal failure, and over-infusion are the cause triad. Treatment: sodium and fluid restriction, diuretics, daily weights, upright positioning, strict intake and output.

Daily weight is the single best fluid-status measure on the exam — same scale, same time, same clothing — and 1 kg equals 1 liter. A 2-kg overnight gain in a heart-failure client is a call, not a chart entry.

Third spacing (burns, ascites, peritonitis, post-op) hides volume the vitals treat as deficit — the client can be edematous AND intravascularly dry, which is why burns resuscitate by formula and why "edema means excess" fails as a rule.`,
      examTip: `Weights beat intake-output records, which beat vital signs, for tracking fluid state — 1 kg is 1 L, and the same-scale-same-time detail is what makes the trend valid.`,
    },
    {
      id: 'fe-sodium-potassium',
      title: `2. Sodium & Potassium: The Two That Kill`,
      content: `SODIUM (135-145) is a water problem wearing an electrolyte's name — and its symptoms are neurologic, because brain cells swell or shrink with the serum.

Hyponatremia (under 135): confusion, headache, lethargy sliding toward seizures and coma as it deepens or falls fast. Causes: SIADH, excess hypotonic fluids or water intake, diuretics, GI losses replaced with plain water. Care: fluid restriction for dilutional forms; 3% saline ONLY for severe symptomatic cases, slowly, with sodium checks — CORRECTING SODIUM TOO FAST INJURES THE BRAIN (osmotic demyelination), a tested absolute.

Hypernatremia (over 145): thirst, dry sticky mucosa, restlessness, agitation, seizures — the dehydrated-brain picture. Causes: water deprivation (the client who cannot ask), diabetes insipidus, hypertonic losses. Care: slow water replacement — the same speed rule in reverse.

POTASSIUM (3.5-5.0) is the cardiac electrolyte, dangerous in both directions.

| | Hypokalemia (under 3.5) | Hyperkalemia (over 5.0) |
| --- | --- | --- |
| classic causes | diuretics (loops/thiazides), GI losses, NG suction, steroids | renal failure, K-sparing diuretics, ACE inhibitors, tissue breakdown, acidosis |
| muscle picture | weakness, leg cramps, hyporeflexia, paralytic ileus | weakness to flaccid paralysis, cramping, diarrhea |
| ECG | flattened T waves, U waves, ectopy | PEAKED T waves, wide QRS, marching to sine wave |
| dangerous partner | digoxin (toxicity potentiated) | any K source still running |
| treatment | replace PO/IV — IV always diluted, always pumped, NEVER pushed | calcium gluconate (protects the heart), insulin + dextrose (shifts K in), kayexalate/dialysis (removes it) |

The hyperkalemia treatment logic is sequenced by mechanism: PROTECT the myocardium first (calcium gluconate), SHIFT potassium into cells second (insulin with dextrose, sometimes bicarbonate or albuterol), REMOVE it third (exchange resins, dialysis). Items that ask "which order first" are testing protect-shift-remove.`,
      examTip: `Sodium symptoms are neuro, potassium symptoms are cardiac-muscular — and the two absolutes are never-push-potassium and never-correct-sodium-fast. Those four facts answer most items in this section.`,
    },
    {
      id: 'fe-calcium-mag',
      title: `3. Calcium, Magnesium & Phosphorus`,
      content: `CALCIUM (9.0-10.5 mg/dL) questions hinge on neuromuscular excitability — low calcium means TWITCHY, high calcium means SLUGGISH.

Hypocalcemia: perioral tingling, muscle cramps, TROUSSEAU sign (carpal spasm with a blood-pressure cuff inflated 3 minutes) and CHVOSTEK sign (facial twitch when the cheek is tapped), hyperactive reflexes, laryngospasm risk, seizures. The tested scenario: post-THYROIDECTOMY (parathyroid injury) — keep calcium gluconate and airway equipment near. Chronic causes: renal failure, vitamin D deficiency, loop diuretics.

Hypercalcemia: the rhyme is real — stones (renal), bones (pain, pathologic fracture from the immobilized skeleton), groans (constipation, anorexia, nausea), and psychiatric moans (lethargy, confusion). Causes: hyperparathyroidism, malignancy, prolonged immobilization. Care: hydrate aggressively (saline), mobilize, loop diuretics per orders, treat the cause; monitor for digoxin issues.

MAGNESIUM (1.8-2.6 mEq/L) travels with potassium and mirrors calcium's logic: low magnesium is hyperexcitable (tremor, hyperreflexia, torsades risk — replace, and check potassium too), high magnesium is depressed everything (hyporeflexia, hypotension, bradypnea) — seen almost exclusively in renal failure and OBSTETRIC magnesium infusions for preeclampsia. The magnesium-drip surveillance bundle: hourly deep tendon reflexes (their LOSS is the earliest toxicity sign), respirations at least 12, urine output at least 30 mL/h — and CALCIUM GLUCONATE at the bedside as the antidote.

PHOSPHORUS (3.0-4.5 mg/dL) moves inversely to calcium: renal failure raises it (with binders as treatment — given WITH meals), refeeding syndrome crashes it. Its symptoms borrow from the calcium it displaces.`,
      examTip: `Trousseau and Chvostek mean LOW calcium; lost deep-tendon reflexes on a magnesium drip mean TOXICITY. Both are bedside signs the exam prefers over the lab value itself — and calcium gluconate answers both emergencies.`,
    },
    {
      id: 'fe-acidbase',
      title: `4. Acid-Base at the Bedside`,
      content: `The ABG method lives in the Laboratory Values chapter; here is the bedside layer — which clients produce which disturbance:

| Bedside story | Disturbance | The tell |
| --- | --- | --- |
| COPD crisis, oversedation, splinted breathing | respiratory acidosis | hypoventilation retains CO2 |
| anxiety attack, pain, early salicylate toxicity, ventilator overshoot | respiratory alkalosis | hyperventilation blows off CO2 |
| DKA, renal failure, lactic acidosis (shock), severe diarrhea | metabolic acidosis | acid gained or base lost; Kussmaul respirations compensate |
| vomiting, NG suction, excess antacids, aggressive diuretics | metabolic alkalosis | acid lost or base gained; slow shallow breathing compensates |

Two compensation pictures worth recognizing without a gas: the DKA client breathing deep and fast (Kussmaul — the lungs dumping CO2 to offset ketoacids) and the chronic COPD client with a normal-side pH, high CO2, and high bicarbonate (kidneys compensated over days — do NOT "fix" the CO2 aggressively; their drive and their baseline differ).

The potassium-pH seesaw links the chapters: acidosis pushes potassium OUT of cells (hyperkalemia accompanies DKA even as total-body potassium is depleted), and correcting the acidosis — or giving insulin — drives potassium back IN, sometimes precipitously. This is why DKA protocols replace potassium once it drops into range and why bicarbonate can crash a "normal" potassium.`,
      examTip: `Match the story to the disturbance before touching numbers: vomiting = metabolic alkalosis, diarrhea = metabolic acidosis, hypoventilation = respiratory acidosis, hyperventilation = respiratory alkalosis. The gas usually just confirms the stem.`,
    },
    {
      id: 'fe-selfcheck',
      title: `5. Self-Check`,
      content: `1. A client on furosemide reports leg cramps; the strip shows flattened T waves and a U wave. Name the imbalance, the value range you expect, and the administration absolute.

2. Two days post-thyroidectomy, a client reports tingling around the mouth; tapping the cheek produces a twitch. Interpret, and name the bedside preparation.

3. A renal-failure client's potassium is 6.9 with peaked T waves. Sequence the three treatment goals with an example of each.

4. A preeclamptic client on magnesium sulfate has absent patellar reflexes and respirations of 10. Interpret and act.

5. An NG tube on continuous suction has drained 1,800 mL overnight. Which acid-base disturbance is building, and which electrolytes travel with it?

## Answers

1. Hypokalemia — expect a value under 3.5 mEq/L; loops waste potassium and the ECG signature confirms. Replacement is oral or DILUTED IV on a pump; potassium is never given IV push.

2. Hypocalcemia from parathyroid injury — Chvostek sign positive, perioral paresthesia is the early cue. Calcium gluconate and airway equipment stay at the bedside; Trousseau confirms; laryngospasm is the feared progression.

3. PROTECT the heart: calcium gluconate. SHIFT potassium in: insulin with dextrose (albuterol/bicarbonate per protocol). REMOVE it: exchange resin or dialysis. Monitoring continues throughout; any K sources stop immediately.

4. Magnesium toxicity — reflex LOSS is the earliest sign and respirations under 12 confirm depression. Stop the infusion, give calcium gluconate per orders, support airway and breathing, notify — the drip does not simply get titrated down.

5. Metabolic alkalosis — gastric acid (HCl) is being suctioned away. Potassium and chloride losses travel with it (hypokalemic, hypochloremic alkalosis), so replacement orders and the potassium check accompany the acid-base watch.`,
    },
  ],
  keyTakeaways: [
    `Daily weight is the fluid-status gold standard (1 kg = 1 L); deficit shows flat veins and oliguria, excess shows crackles and distended veins — and third spacing can be both at once.`,
    `Sodium is neuro and corrected slowly in BOTH directions; potassium is cardiac, never pushed, and hyperkalemia treats in protect-shift-remove order.`,
    `Low calcium twitches (Trousseau/Chvostek, post-thyroidectomy), high calcium groans (stones-bones-groans); magnesium mirrors it, and lost reflexes on a mag drip mean stop and give calcium gluconate.`,
    `Match story to disturbance: vomiting alkalotic, diarrhea acidotic, hypoventilation acidotic, hyperventilation alkalotic — then let the ABG confirm.`,
    `The pH-potassium seesaw ties it together: acidosis raises serum potassium, and correcting it (or insulin) drops potassium fast — replace by protocol, monitor by strip.`,
  ],
},

nx_emergencies: {
  topicId: 'nx_emergencies',
  title: `Medical Emergencies: Shock, Sepsis & Anaphylaxis`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Emergency stems compress the whole exam into minutes: recognize the deteriorating pattern early, name the shock type from the hemodynamic picture, and execute a first-actions sequence that is mostly protocol. This chapter builds the shock taxonomy with its opposing vital-sign signatures, the sepsis hour-one bundle, the anaphylaxis script, and the rapid-response triggers that "requires immediate follow-up" items are written from.`,
  sections: [
    {
      id: 'em-shock',
      title: `1. Shock: One Problem, Four Mechanisms`,
      content: `All shock is inadequate tissue perfusion; the mechanism sorts the treatment. The compensated phase looks deceptively mild — restlessness or anxiety (the brain feels it first), mild tachycardia, narrowing pulse pressure, cool skin, slowing urine — and the exam rewards catching THIS phase, because decompensation (hypotension, altered mentation, oliguria) is late.

| Shock type | Mechanism | The distinguishing signature | First-line direction |
| --- | --- | --- | --- |
| hypovolemic | not enough volume | flat neck veins, dry, hemorrhage or fluid-loss story | stop the loss, isotonic fluids, blood if bleeding |
| cardiogenic | pump failure (usually MI) | crackles, distended neck veins, cool and wet — the OVERLOADED shocked client | improve pump: inotropes, reduce workload; fluids CAUTIOUSLY |
| septic (distributive) | vasodilation from infection | warm and flushed EARLY, fever, wide pulse pressure — then cold late | cultures, antibiotics, fluids, vasopressors |
| anaphylactic (distributive) | mast-cell vasodilation + airway | exposure story, hives, wheeze, swelling — minutes fast | epinephrine, airway, fluids |
| neurogenic (distributive) | lost sympathetic tone (cord injury) | hypotension WITH BRADYCARDIA, warm dry skin | fluids, vasopressors, atropine for the rate |

The two discriminations the exam loves: hypovolemic versus cardiogenic (both cold and clammy — but neck veins are FLAT in one and DISTENDED in the other, and cardiogenic has crackles: fluids rescue one and drown the other), and septic versus neurogenic (both distributive — but septic runs tachycardic and febrile while neurogenic uniquely pairs hypotension WITH bradycardia).

Positioning and oxygen are universal early moves; the fluid decision is where the taxonomy earns its keep. Urine output is the perfusion meter — below 30 mL/h means the kidneys are being sacrificed.`,
      examTip: `Restlessness and creeping tachycardia with a normal blood pressure IS shock — compensated. The blood pressure is the last vital sign to fall, and items that ask for the earliest indicator want the mentation and heart-rate answer, not the hypotension answer.`,
    },
    {
      id: 'em-sepsis',
      title: `2. Sepsis: Recognition & the Hour-One Bundle`,
      content: `Sepsis is infection plus organ dysfunction, and its recognition items reward pattern-spotting in the gray zone: fever OR hypothermia, tachycardia, tachypnea, new confusion (often the FIRST sign in older adults — the "pleasantly confused" UTI client is the classic stem), falling urine output, rising lactate, and a source story (urinary catheter, pneumonia, wound, line).

The hour-one logic runs on a fixed sequence the exam samples directly:

1. Recognize and escalate — rapid response or provider now; sepsis is a time-critical diagnosis.
2. CULTURES BEFORE ANTIBIOTICS — two sets of blood cultures (plus source cultures) drawn first, but never delaying antibiotics long for logistics.
3. Broad-spectrum antibiotics within the hour — the single most outcome-changing medication timing on the exam.
4. Lactate measured and trended — the perfusion debt meter.
5. Fluid resuscitation — commonly cited at 30 mL/kg isotonic crystalloid for hypotension or elevated lactate, per protocol.
6. Vasopressors (norepinephrine first-line per usual protocols) when fluids do not hold the pressure.

Septic shock is sepsis needing vasopressors despite fluids — the cold, mottled, oliguric late picture. Monitoring loops back through mentation, urine output, lactate clearance, and pressure.

Prevention items are the same chapter in reverse: catheter days minimized, lines scrubbed and removed when idle, wounds assessed, pneumonia bundles (head of bed, oral care, mobility) executed — every device is a portal the exam can build a sepsis stem on.`,
      examTip: `Two sequencing points decide most sepsis items: cultures BEFORE antibiotics, and antibiotics within the FIRST hour — an option that starts antibiotics after imaging, or cultures after the first dose, is the engineered error.`,
    },
    {
      id: 'em-anaphylaxis',
      title: `3. Anaphylaxis & Transfusion-Adjacent Emergencies`,
      content: `Anaphylaxis moves in minutes: exposure (drug, contrast, latex, food, sting) followed by hives and itching, then lip and tongue swelling, stridor or wheeze, hypotension, and the feeling of doom. The script is fixed:

1. STOP the trigger (the infusing drug, the transfusion, the contrast).
2. EPINEPHRINE intramuscular in the vastus lateralis — first, fast, and repeated per protocol; no antihistamine substitutes for it.
3. Airway and high-flow oxygen; prepare for advanced airway early — edema closes options.
4. Recumbent position with legs elevated as tolerated; IV fluids for the vasodilated pressure.
5. Adjuncts AFTER epinephrine: antihistamines, bronchodilators, corticosteroids (steroids blunt the LATE, biphasic recurrence — which is also why post-anaphylaxis clients are observed, not discharged from the bedside).

The tested error is sequence: diphenhydramine or a steroid chosen FIRST while epinephrine waits. Epinephrine is the answer whenever airway involvement or hypotension appears; mild isolated hives after a bee sting may earn antihistamines alone, but the stem will make the systemic signs unmistakable when it wants epinephrine.

Latex allergy earns its own line: risk concentrates in clients with spina bifida, multiple surgeries, and healthcare exposure; cross-reactions with banana, avocado, kiwi, and chestnut appear in stems; the latex-safe environment is planned BEFORE procedures, first case of the day where policy directs.`,
      examTip: `Epinephrine IM, first, every time systemic signs appear — and observation afterward for the biphasic second wave. Any option that leads with an antihistamine in a stem containing stridor, wheeze, or hypotension is wrong.`,
    },
    {
      id: 'em-rapid',
      title: `4. Rapid Response, Codes & the Deterioration Radar`,
      content: `Rapid response teams exist to be called EARLY — for the deteriorating client who is not yet arrested — and the exam rewards the low threshold: acute changes in heart rate, blood pressure, respiratory rate, saturation, urine output, or mentation; new chest pain; a nurse's unquantifiable "something is wrong." Family activation exists in many systems, and the tested attitude is that calling for help is judgment, not failure.

| Trigger cluster | Think | While waiting for the team |
| --- | --- | --- |
| sudden dyspnea + pleuritic pain + tachycardia (post-op, immobile) | pulmonary embolism | head of bed up, oxygen, vitals, stay |
| crushing chest pain + diaphoresis | acute coronary syndrome | position, oxygen per protocol, vitals, ECG per protocol |
| new unilateral weakness, facial droop, speech change | stroke | time-last-known-well, glucose check, NPO, neuro checks |
| worst headache of life, sudden | hemorrhagic stroke | quiet, head of bed per protocol, neuro checks |
| stridor, drooling, tripod position | airway emergency | do NOT force examination; keep calm; airway team |

Codes: when the client is unresponsive, not breathing normally, and pulseless, compressions start immediately — hard and fast, center chest, 100-120 per minute, at least 2 inches in adults, full recoil, minimal interruptions — with early defibrillation for shockable rhythms (the rhythm chapter's territory). The nurse's code roles include compressions, timing/recording, medication administration per ACLS orders, and family support — family PRESENCE during resuscitation is supported by policy in many institutions, with a staff member assigned to them.

Documentation after any emergency is factual and time-stamped; debriefing is a system tool, not blame.`,
      examTip: `The rapid-response threshold is deliberately low — the tested answer calls EARLY on trend changes rather than waiting to "gather more data" while the client declines. Waiting is the engineered wrong option.`,
    },
    {
      id: 'em-selfcheck',
      title: `5. Self-Check`,
      content: `1. A trauma client has BP 88/70, HR 128, flat neck veins, and cool clammy skin. Name the shock, the give-away findings, and the first-line treatment direction.

2. A client with an MI has BP 82/60, distended neck veins, and crackles throughout. Why is a large fluid bolus the WRONG answer, and what direction is right?

3. An older adult with a urinary catheter becomes newly confused; temperature 38.4 C, HR 112, BP 96/58. What is developing, and what two ordered actions must be sequenced correctly?

4. During an IV antibiotic infusion the client develops hives, lip swelling, and audible wheeze. List the first three actions in order.

5. A cervical spinal-cord-injured client has BP 80/50 and HR 48 with warm, dry skin. Which shock is this, and what makes it recognizable among the distributive shocks?

## Answers

1. Hypovolemic shock — the flat neck veins and trauma story distinguish it from cardiogenic. Stop the bleeding and replace volume: isotonic crystalloid and blood products per protocol.

2. The pump is failing, not the tank — distended veins and crackles say the volume is already backing up; a bolus drowns the lungs. Direction: improve contractility and reduce cardiac workload (inotropes, afterload and preload management per orders), with fluids only cautiously.

3. Sepsis from a urinary source, announced by new confusion. Blood (and urine) CULTURES first, broad-spectrum ANTIBIOTICS within the hour second — in that order, with lactate and fluids alongside per protocol.

4. Stop the infusion; give IM epinephrine in the vastus lateralis; manage airway with high-flow oxygen and early escalation. Fluids, antihistamines, and steroids follow — never precede — the epinephrine.

5. Neurogenic shock — the only shock that pairs hypotension with BRADYCARDIA (lost sympathetic tone cannot mount a tachycardia), plus warm dry skin below the injury. Fluids, vasopressors, and atropine per orders.`,
    },
  ],
  keyTakeaways: [
    `Compensated shock is restlessness, creeping heart rate, narrowing pulse pressure, and falling urine — the blood pressure falls LAST, and the early answer wins.`,
    `Neck veins and crackles sort the cold shocks (flat-dry = hypovolemic, distended-wet = cardiogenic); bradycardia-with-hypotension marks neurogenic among the warm ones.`,
    `Sepsis runs a sequenced hour: recognize, cultures BEFORE antibiotics, antibiotics within 60 minutes, lactate, 30 mL/kg fluids, then vasopressors.`,
    `Anaphylaxis: stop the trigger, IM epinephrine FIRST, airway — adjuncts follow, and the biphasic second wave keeps the client observed.`,
    `Call rapid response on trends, not arrests; when pulseless, compress hard-fast-deep with minimal interruption and defibrillate what is shockable.`,
  ],
},

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
  overview: `Chest-pain stems run from stable angina in clinic to STEMI on the monitor, and the exam tests the whole arc: distinguishing the pain patterns, executing the acute protocol in order, decoding the ECG-and-troponin diagnosis, the medication armory with its contraindications, and the cardiac-rehab teaching that follows. The discriminations are sharp — relieved-by-rest versus not, nitroglycerin rules, when morphine helps and when a beta blocker must wait — and each is a repeatable item.`,
  sections: [
    {
      id: 'cad-spectrum',
      title: `1. The Ischemia Spectrum: Reading the Pain`,
      content: `Coronary artery disease narrows supply; symptoms appear when demand outruns it. The exam expects you to place a client on the spectrum from the story alone:

| Pattern | Story | Meaning |
| --- | --- | --- |
| stable angina | predictable with exertion, relieved by REST and nitroglycerin within minutes | demand ischemia; managed outpatient |
| unstable angina | NEW onset, at rest, or accelerating; NOT reliably relieved | plaque disrupting — an ACS; troponin negative |
| NSTEMI | ACS picture WITH positive troponin, no ST elevation | partial-thickness infarction |
| STEMI | ST elevation in contiguous leads, troponin positive | full-thickness infarction — reperfusion clock running |

MI pain classically: crushing substernal pressure radiating to the left arm, jaw, or back, with diaphoresis, nausea, and dyspnea, lasting over 20 minutes, unrelieved by rest or nitroglycerin. But the exam is scrupulous about ATYPICAL presentations: women (fatigue, dyspnea, epigastric or jaw discomfort), older adults (sudden weakness or confusion), and diabetic clients (silent ischemia from neuropathy — sometimes no pain at all). A diabetic woman with "indigestion," profound fatigue, and diaphoresis is an MI stem until proven otherwise.

Differentials the exam plants: pericarditis pain is sharp, worse supine, better LEANING FORWARD, with a friction rub; GERD burns and follows meals; musculoskeletal pain is reproducible by palpation. None of these excuse skipping the workup when risk factors stack.

Risk factors sort into non-modifiable (age, sex, family history) and modifiable (smoking — the single most tested, hypertension, dyslipidemia, diabetes, obesity, sedentary living) — the teaching chapter of every cardiac stem.`,
      examTip: `The word RELIEVED does the diagnostic work: relieved by rest = stable angina; not relieved = ACS territory and a protocol, not an antacid. And in diabetic clients, absence of pain excludes nothing.`,
    },
    {
      id: 'cad-acute',
      title: `2. The Acute Protocol & the Diagnostic Pair`,
      content: `Suspected ACS runs a fixed opening: position upright, oxygen per protocol IF saturation is low (routine high-flow is out — hyperoxia harms), 12-lead ECG obtained and read within minutes, aspirin 162-325 mg CHEWED (antiplatelet effect fastest chewed — verify no allergy or active bleeding), nitroglycerin sublingual per protocol with pressure checks, IV access, troponin drawn, and continuous monitoring. Morphine remains for pain refractory to nitrates per protocol, with pressure and respiratory surveillance.

## Nitroglycerin rules

Sublingual dosing: one tablet or spray under the tongue, may repeat every 5 minutes to a maximum of three doses with EMS/provider activation per protocol; the client sits or lies during dosing (orthostatic drops). HOLD for systolic pressure below the protocol threshold (commonly 90-100) and REFUSE when a phosphodiesterase inhibitor (sildenafil, tadalafil) was taken in the last 24-48 hours — the combination crashes pressure. Storage teaching: dark glass container, replaced on schedule, a burning or tingling under the tongue historically signaled potency.

## The diagnostic pair

The ECG localizes and classifies (ST elevation in contiguous leads = STEMI; depression or T inversion = ischemia/NSTEMI patterns), and TROPONIN confirms myocyte death — rising within hours, peaking around a day, elevated for days after, drawn serially. The pairing logic: ECG decides the reperfusion pathway NOW (it cannot wait for enzymes); troponin separates unstable angina from NSTEMI later.

STEMI starts a literal clock: door-to-balloon (percutaneous coronary intervention) within 90 minutes where available, or fibrinolytics within 30 minutes of arrival when PCI is out of reach and no contraindications exist (active bleeding, recent stroke or surgery, uncontrolled hypertension). Items test the clock numbers and the contraindication screen.`,
      examTip: `Aspirin is CHEWED, nitroglycerin is held for hypotension and recent sildenafil-class drugs, and the ECG comes before the enzymes — three mechanical facts that each decide their own item.`,
    },
    {
      id: 'cad-meds',
      title: `3. The Medication Armory`,
      content: `| Class | Prototype | What it does | The tested caution |
| --- | --- | --- | --- |
| antiplatelet | aspirin; clopidogrel | keeps the culprit vessel open | bleeding; NEVER stopped abruptly after stents without cardiology |
| beta blocker | metoprolol | cuts demand (rate, contractility) | hold for HR under 60 or low BP per parameters; masks hypoglycemia; caution in acute heart failure |
| ACE inhibitor | lisinopril | remodeling protection post-MI | dry cough, hyperkalemia, angioedema; monitor creatinine |
| statin | atorvastatin | plaque stabilization, LDL lowering | report MUSCLE PAIN (rhabdomyolysis); check LFTs; avoid grapefruit for some |
| nitrate | nitroglycerin (SL, patch, IV) | venodilation cuts preload; coronary dilation | hypotension; sildenafil-class interaction; patch-free interval prevents tolerance |
| anticoagulant (acute) | heparin | halts clot propagation during ACS | aPTT monitoring, bleeding watch, protamine available |
| opioid | morphine | refractory pain, preload reduction | respiratory depression, hypotension — after nitrates, per protocol |

Post-stent teaching is its own cluster: DUAL antiplatelet therapy continues exactly as prescribed — stopping clopidogrel early risks in-stent thrombosis, and the tested client statement error is "I can stop the blood thinner once I feel fine." Radial or femoral access sites get bleeding surveillance (and the femoral client lies flat per protocol, with distal pulses checked; a rapidly expanding groin swelling is a call-now finding).

Post-MI complications the monitor announces: dysrhythmias (the most common early killer — hence continuous monitoring), heart failure (crackles and S3), cardiogenic shock (the emergencies chapter's picture), pericarditis days later (the leaning-forward pain), and ventricular rupture territory in the first week. New murmur + sudden decompensation = call.`,
      examTip: `Statin muscle pain is never "expected soreness" — unexplained myalgia on a statin is a report-and-check finding (rhabdomyolysis and the kidney injury behind it), and the exam plants it as a casual client remark.`,
    },
    {
      id: 'cad-rehab',
      title: `4. Recovery, Rehab & Secondary Prevention`,
      content: `Cardiac rehabilitation begins in the hospital (phase I): progressive supervised activity, no isometric straining or Valsalva (bearing down spikes pressure and vagal swings — stool softeners are ordered for a reason the exam tests), and symptom-guided pacing — activity stops for chest pain, dyspnea, dizziness, or a disproportionate heart-rate jump.

Discharge teaching clusters:

Activity: graded walking programs; sexual activity typically resumable when the client can climb two flights of stairs without symptoms (the standard teaching proxy); no driving until cleared; cardiac rehab referral accepted — it halves the fear as much as it trains the heart.

Diet: the heart-healthy pattern — sodium moderation, saturated and trans fats down, fiber and unsaturated fats up; the exam rewards concrete swaps (grilled for fried, added-salt removal) over abstract "eat better."

Warning plan: nitroglycerin protocol rehearsed (sit, dose, 5 minutes, repeat per protocol, call emergency services rather than driving); which symptoms mean call now (recurrent pain, syncope, palpitations, dyspnea).

Risk-factor work: smoking cessation is the highest-yield modifiable change and appears constantly — pair the ask with resources (counseling, pharmacotherapy per orders), not judgment. Blood pressure, glucose, and lipid targets are managed with adherence teaching: the drugs continue even when the client "feels fine," because atherosclerosis is silent between events.

Depression screening after MI is evidence-based and tested: persistent low mood, anhedonia, or "I'm just done" from a post-MI client is a report-and-refer finding, not expected adjustment — untreated depression worsens cardiac outcomes.`,
      examTip: `The two-flights-of-stairs proxy, the no-Valsalva rule, and call-EMS-do-not-drive are the three concrete rehab facts stems quote. Teaching effectiveness is always the concrete behavior statement.`,
    },
    {
      id: 'cad-selfcheck',
      title: `5. Self-Check`,
      content: `1. A 58-year-old diabetic woman reports two hours of epigastric discomfort, fatigue, and sweating; she took an antacid without relief. Why does this stem demand an ACS workup, and what are the first two diagnostic moves?

2. A client with chest pain has systolic BP 84 after one sublingual nitroglycerin. The protocol allows two more doses. What does the nurse do?

3. Distinguish unstable angina from NSTEMI in one sentence, and name which test separates them.

4. A client asks why he must chew the aspirin the nurse hands him during chest pain. Answer him, and name one situation where aspirin is withheld.

5. Three days post-MI, a client reports sharp chest pain that eases when he leans forward; a scratchy sound is heard at the sternal border. Interpret — and why is this NOT a reinfarction picture?

## Answers

1. Diabetic neuropathy blunts ischemic pain and women present atypically — epigastric discomfort plus diaphoresis and fatigue in a high-risk client is ACS until excluded. First moves: 12-lead ECG within minutes and serial troponins, with the acute protocol alongside.

2. HOLD further nitroglycerin — systolic 84 is below any hold threshold. Lay the client flat as tolerated, notify per protocol, and anticipate fluids; the remaining protocol doses are cancelled by the hypotension, not owed.

3. Both are ACS with ischemic symptoms and non-elevated ST segments — but NSTEMI has myocyte death and unstable angina does not; TROPONIN separates them.

4. Chewing gets the antiplatelet effect into circulation fastest, and minutes of platelet inhibition matter in a forming coronary clot. Withhold for true aspirin allergy or active serious bleeding, and flag recent GI hemorrhage to the provider.

5. Post-MI pericarditis — positional sharp pain relieved leaning forward with a friction rub, appearing days after infarction. Reinfarction pain is pressure-like, not positional, and has no rub; still, the finding is reported and an ECG per protocol distinguishes formally.`,
    },
  ],
  keyTakeaways: [
    `Place the client on the spectrum by the story: relieved-by-rest stable angina, rest-pain ACS, troponin sorting unstable angina from NSTEMI, ST elevation declaring STEMI and starting the reperfusion clock.`,
    `The acute protocol is mechanical: upright, ECG in minutes, chewed aspirin, nitroglycerin with hold rules (pressure, sildenafil-class), serial troponins — and door-to-balloon 90 minutes.`,
    `Know the armory's cautions: beta-blocker holds, ACE cough and potassium, statin myalgia, nitrate interactions, and dual antiplatelets that never stop early after stents.`,
    `Atypical is typical for women, elders, and diabetics — fatigue, dyspnea, epigastric discomfort, or nothing at all.`,
    `Rehab teaching is concrete: no Valsalva (stool softeners), two flights before sex, nitro-then-call-EMS, smoking cessation first among equals, and post-MI depression is screened and treated.`,
  ],
},

nx_heart_failure: {
  topicId: 'nx_heart_failure',
  title: `Heart Failure & Pulmonary Edema`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Heart failure is among the most stem-friendly diagnoses on the exam: left and right failure have clean opposing signatures, decompensation has an early-warning system (the daily weight), acute pulmonary edema has a fixed crisis script, and the medication list doubles as a monitoring list. This chapter builds the sided-failure table, the exacerbation playbook, the drug-by-drug surveillance map, and the self-management teaching that keeps the readmission stems honest.`,
  sections: [
    {
      id: 'hf-sides',
      title: `1. Left vs Right: Two Signatures`,
      content: `Failure means the ventricle cannot meet demand; WHERE it fails writes the symptoms. Left-sided failure backs blood into the LUNGS; right-sided failure backs it into the BODY.

| Left-sided (lungs) | Right-sided (body) |
| --- | --- |
| dyspnea on exertion, then at rest | dependent edema (ankles, sacrum when supine) |
| orthopnea — "how many pillows?" | jugular venous distension |
| paroxysmal nocturnal dyspnea | hepatomegaly, right-upper-quadrant discomfort |
| crackles, S3 gallop | ascites, anorexia and early satiety |
| fatigue, cool extremities | weight gain from fluid |
| cough, pink frothy sputum when severe | — |

The most common cause of right-sided failure is LEFT-sided failure (the lungs' congestion becomes the right ventricle's afterload); isolated right failure follows pulmonary disease (cor pulmonale) — the COPD client with new edema and distended neck veins is that stem.

Compensation mechanisms (sympathetic drive, renin-angiotensin activation, remodeling) buy time and then become the disease — which is why the drug list is mostly compensation blockers (ACE inhibitors, beta blockers, aldosterone antagonists) rather than stimulants.

BNP is the lab that arbitrates dyspnea: released by stretched ventricles, under 100 pg/mL argues against heart failure, and rising values track worsening. Echocardiography's ejection fraction (normal roughly 55-70%) classifies reduced versus preserved EF — vocabulary the stems use.`,
      examTip: `Sort every finding by side reflexively: wet lungs = left, wet body = right. Items love the crossover client — the COPD stem growing neck veins (right failure from lung disease) versus the orthopnea stem growing edema (left failure dragging the right down).`,
    },
    {
      id: 'hf-decomp',
      title: `2. Decompensation & the Pulmonary Edema Script`,
      content: `Decompensation announces itself in ounces before it arrives in crackles: the DAILY WEIGHT is the early-warning system, and the standard teaching threshold — gain of 2-3 lb (about 1 kg or more) overnight or 5 lb (about 2.3 kg) in a week — is a call-the-provider number, not a diary entry. Escalating orthopnea (more pillows), new nocturnal dyspnea, tightening rings and shoes, and a dry stepping-down cough round out the radar.

Acute pulmonary edema is the crisis form: severe dyspnea, anxiety and restlessness, tachypnea, tachycardia, cold clammy skin, crackles rising from bases toward apices, and PINK FROTHY SPUTUM as alveoli flood. The script is fixed and sequenced:

1. POSITION: high Fowler's, legs dependent — gravity pools volume away from the lungs.
2. OXYGEN: high-flow per protocol; anticipate noninvasive positive pressure (CPAP/BiPAP) — it splints alveoli open and cuts preload.
3. IV DIURETIC: furosemide push per orders — output should answer within the hour; a catheter often follows for measurement.
4. VASODILATION per orders: IV nitroglycerin when pressure allows — unloads the ventricle.
5. MONITOR: continuous saturation and rhythm, pressures, strict output, serial lung sounds — and potassium after the diuresis.

Morphine's historical role (anxiety and preload) appears in older materials; current protocols use it cautiously if at all — follow the stem's orders rather than importing it.

The positioning point is pure physiology and pure exam: the WRONG answer lays the client flat or lifts the legs (both dump volume into the flooded chest); high Fowler's with legs down is the one-move preload reduction that costs nothing.`,
      examTip: `Weight thresholds (2-3 lb overnight, 5 lb a week) and the position (high Fowler's, legs DOWN) are the two most-quoted facts in this chapter — and pink frothy sputum means the emergency already started.`,
    },
    {
      id: 'hf-meds',
      title: `3. The Medication & Monitoring Map`,
      content: `Heart-failure pharmacology is a monitoring exam in disguise — every drug pairs with a lab or vital sign:

| Drug class | Prototype | Why | Watch |
| --- | --- | --- | --- |
| loop diuretic | furosemide | volume off-loading | potassium DOWN (replace per orders), ototoxicity with fast IV push, orthostasis, daily weight |
| ACE inhibitor / ARB | lisinopril / losartan | blocks remodeling, drops afterload | potassium UP, creatinine, dry cough (ACE), angioedema, first-dose hypotension |
| beta blocker | metoprolol succinate, carvedilol | blocks sympathetic remodeling | start LOW in stable clients; hold parameters for rate and pressure; fatigue early is expected teaching |
| aldosterone antagonist | spironolactone | survival benefit | potassium UP — the K-sparing partner to the loop's K-wasting |
| digoxin | digoxin | symptom control, rate help in a-fib | apical pulse 60 rule, level 0.5-2.0, toxicity (anorexia, nausea, VISUAL changes) — hypokalemia potentiates it |
| SGLT2 inhibitor | dapagliflozin | outcome benefit even without diabetes | genitourinary infections, euglycemic DKA awareness |
| vasodilator (acute) | IV nitroglycerin | preload/afterload in decompensation | continuous pressure monitoring |

The potassium choreography is the tested core: loops WASTE it, ACE inhibitors and spironolactone SPARE it, digoxin becomes toxic when it is LOW — so a client on furosemide plus digoxin with potassium 3.1 and new nausea is a toxicity stem, while a client on lisinopril plus spironolactone with potassium 5.9 is the opposite trap. Read the drug list as a potassium equation before answering.

Fluid and sodium restriction orders accompany the drugs (commonly 2 g sodium; fluid limits per provider) — and the intake count includes ice chips, soups, and the water swallowed with pills.`,
      examTip: `Every heart-failure medication item is secretly a potassium item or a vital-sign-hold item. Compute the client's potassium direction from the drug list first — the answer usually falls out.`,
    },
    {
      id: 'hf-teaching',
      title: `4. Living With It: Teaching & Readmission Prevention`,
      content: `Heart failure readmissions are the tested quality problem, and the self-management bundle is the answer bank:

Daily weight, same scale, same time (morning, after voiding, before dressing), written down — with the call thresholds rehearsed as numbers, not vibes. The tested effective statement: "If I gain more than 2 pounds overnight or 5 in a week, I call the office that day."

Sodium literacy over sodium virtue: reading labels (canned soups, deli meats, bread, condiments — the salt hides in packages, not the shaker), restaurant strategies, and no salt substitutes without asking — many are POTASSIUM chloride, which collides with the ACE-spironolactone side of the drug map.

Medication adherence through symptom logic: the diuretic taken in the MORNING (sleep uninterrupted), the beta blocker continued even when fatigue is noticed early, nothing stopped when "feeling better" — feeling better IS the drugs working. Missed-dose plans and refill logistics are teaching content, not administrivia.

Activity: regular paced walking with rest between exertion, no isometrics or breath-holding, energy conservation (sit for tasks, spread chores), and the escalation plan for dyspnea beyond the client's baseline.

Vaccinations (influenza, pneumococcal per schedule) protect against the decompensation trigger the exam likes: infection. Other trigger stems: dietary indiscretion (the holiday-meal admission), medication interruption, uncontrolled hypertension, new arrhythmia (a-fib with rapid rates), and NSAIDs — which retain sodium and blunt diuretics and appear as the innocent over-the-counter culprit in readmission stems.

Advanced-disease conversations (devices, transplant evaluation, palliative integration) are introduced honestly when stems reach refractory symptoms — comfort-focused care and heart-failure care are not opposites, and the exam rewards the answer that discusses goals rather than deflecting.`,
      examTip: `The NSAID trap recurs: ibuprofen for a heart-failure client's aches is a decompensation trigger (sodium retention, diuretic resistance) — the correct teaching swaps it for acetaminophen per provider guidance.`,
    },
    {
      id: 'hf-selfcheck',
      title: `5. Self-Check`,
      content: `1. Sort these findings by failure side: orthopnea, ankle edema, jugular distension, crackles, hepatomegaly, pink frothy sputum.

2. A home-care client's log shows 152.0, 152.4, 153.1, 155.0 lb across four mornings. Interpret and act.

3. A client with acute pulmonary edema is found supine and panicking. Give the first two actions and the physiologic reason for each.

4. A client takes furosemide and digoxin. This morning: potassium 3.0, client reports nausea and "yellow-tinged" vision. Connect the findings and state the priorities.

5. A client with heart failure asks about using a salt substitute and taking ibuprofen for knee pain. Address both.

## Answers

1. Left (lungs): orthopnea, crackles, pink frothy sputum. Right (body): ankle edema, jugular distension, hepatomegaly. The frothy sputum marks acute decompensation of the left side.

2. A 3-lb rise over days with acceleration (0.4, 0.7, 1.9) — fluid gain, decompensation beginning. Call the provider today per the taught threshold; anticipate diuretic adjustment; reinforce sodium review. It is a same-day call, not a next-visit note.

3. Sit the client into high Fowler's with legs dependent — gravity shifts volume out of the pulmonary circuit (preload drops). Apply high-flow oxygen per protocol — the flooded alveoli are shunting; anticipate positive pressure. Diuretic and vasodilator orders follow.

4. Hypokalemia (the loop's work) is potentiating digoxin — nausea plus visual color changes are the toxicity signature. Hold the digoxin, obtain a level and notify, monitor the rhythm, and replace potassium per orders (diluted, pumped, never pushed).

5. No salt substitute without provider approval — most are potassium chloride, and his regimen may already spare potassium. No ibuprofen — NSAIDs retain sodium and blunt diuretics, a classic decompensation trigger; acetaminophen per provider guidance is the usual swap.`,
    },
  ],
  keyTakeaways: [
    `Left failure wets the lungs (orthopnea, crackles, frothy sputum), right failure wets the body (edema, JVD, hepatomegaly) — and left failure is right failure's most common cause.`,
    `The daily weight is the early-warning system: 2-3 lb overnight or 5 lb a week is a call-today number.`,
    `Pulmonary edema scripts: high Fowler's legs down, oxygen/positive pressure, IV loop diuretic, nitroglycerin per pressure — position first, it is free preload reduction.`,
    `Read the drug list as a potassium equation: loops waste, ACE/spironolactone spare, digoxin turns toxic when potassium falls.`,
    `Readmission prevention is concrete: label-reading sodium literacy, morning diuretics, drugs continued while well, vaccines, and no NSAIDs or unapproved salt substitutes.`,
  ],
},

nx_copd_asthma: {
  topicId: 'nx_copd_asthma',
  title: `Asthma & COPD`,
  domainWeight: 'Physiological Adaptation (11-17%)',
  overview: `Obstructive lung disease stems test two clocks: the asthma attack that escalates in minutes and the COPD course that decompensates over days. The exam's favorite discriminations live here — the silent chest that means worse not better, rescue versus controller inhalers, oxygen titration in the chronic CO2 retainer, and the inhaler technique teaching that decides return-demonstration items. This chapter builds both diseases, their crisis scripts, and the medication table they share.`,
  sections: [
    {
      id: 'resp-asthma',
      title: `1. Asthma: The Reversible Obstruction`,
      content: `Asthma is episodic, inflammatory, and REVERSIBLE bronchoconstriction: triggers (allergens, exercise, cold air, infection, stress, aspirin in sensitive clients) provoke wheeze, chest tightness, cough — classically nocturnal — and prolonged expiration. Between attacks the client can be entirely well; the disease lives in the airways' readiness to overreact.

Attack assessment ranks by the work of breathing: audible expiratory wheeze first, then inspiratory-plus-expiratory wheeze, accessory-muscle use, speech in words instead of sentences, tripod positioning — and then the finding the exam builds items on: the SILENT CHEST. Wheeze requires airflow; when breath sounds fade in a client still struggling, the airways have closed toward arrest. Silence plus exhaustion, bradycardia after tachycardia, or a "calming" client who is actually obtunded — these are pre-arrest cues demanding rapid response, not documentation of improvement.

Peak expiratory flow personalizes severity: measured against the client's PERSONAL BEST, the standard zone teaching runs green (80-100% — continue plan), yellow (50-80% — caution, deploy the action plan), red (below 50% — rescue medication and emergency help). The written asthma action plan pairs zones with exact medication steps — the tested teaching artifact.

Status asthmaticus is the attack that refuses standard therapy: continuous nebulized bronchodilators, systemic corticosteroids, oxygen, magnesium per protocol, and escalation toward ventilatory support — a client this tight who "suddenly quiets" is deteriorating until proven otherwise.`,
      examTip: `The silent chest is the classic reverse-logic item: less wheeze in a struggling asthmatic means LESS airflow, not less obstruction. Pair it with exhaustion or a falling respiratory rate and the answer is escalation now.`,
    },
    {
      id: 'resp-copd',
      title: `2. COPD: The Progressive Obstruction`,
      content: `COPD — chronic bronchitis and emphysema, overwhelmingly smoking-driven — is progressive, partially reversible airflow limitation: dyspnea advancing from exertion to rest, chronic productive cough, prolonged expiration through PURSED LIPS (self-taught physiologic PEEP that splints airways open), barrel chest from air trapping, accessory-muscle work, and eventually the right-heart consequences (cor pulmonale: the neck veins and edema from the heart-failure chapter).

The chronic ABG picture: retained CO2 with renal bicarbonate compensation — a normal-side pH riding on abnormal partners (the fully compensated respiratory acidosis worked in the lab chapter). This baseline REWRITES the oxygen rules: the target saturation for CO2-retaining COPD clients is commonly 88-92%, titrated with venturi precision rather than flooded — high-flow oxygen can worsen CO2 retention (ventilation-perfusion shifts and blunted drive), producing the drowsy, confused, oxygen-toxic stem. The tested answer titrates DOWN toward target, never removes oxygen abruptly, and monitors mentation as a CO2 gauge — rising drowsiness in a COPD client on new high-flow oxygen is CO2 narcosis until proven otherwise.

Exacerbations (usually infection-triggered): increased dyspnea, sputum volume or purulence change, wheeze on top of baseline — treated with bronchodilators, systemic corticosteroids, antibiotics per criteria, and controlled oxygen. The positioning answer is upright leaning forward on supports (the tripod the client invented at home).

Daily-living management: pursed-lip and diaphragmatic breathing training, energy conservation (the same pacing logic as heart failure), small frequent high-calorie meals (dyspnea makes eating exercise; weight loss is a poor prognostic marker), hydration to thin secretions, smoking cessation at every contact, and pulmonary rehabilitation referral — the highest-evidence intervention stems undersell.`,
      examTip: `The COPD oxygen number is 88-92%, and the mechanism item behind it is CO2 narcosis: new confusion or drowsiness on generous oxygen is a gas problem, and the fix is titration and an ABG — not sleep.`,
    },
    {
      id: 'resp-meds',
      title: `3. The Inhaler & Medication Table`,
      content: `| Class | Prototype | Role | The tested points |
| --- | --- | --- | --- |
| short-acting beta agonist (SABA) | albuterol | RESCUE — attacks, pre-exercise | first in every acute attack; tremor and tachycardia expected; overuse (more than 2 days/week) means control is failing |
| inhaled corticosteroid (ICS) | fluticasone, budesonide | CONTROLLER — daily inflammation control | never for acute attacks; RINSE the mouth after (thrush); effect builds over days |
| long-acting beta agonist (LABA) | salmeterol | controller partner | NEVER alone in asthma (paired with ICS); never for rescue |
| anticholinergic | ipratropium (short), tiotropium (long) | COPD mainstay, asthma adjunct | dry mouth; caution glaucoma/urinary retention histories |
| systemic corticosteroid | prednisone, IV methylprednisolone | exacerbations | short bursts; taper longer courses; glucose rises — monitor diabetics |
| leukotriene modifier | montelukast | oral controller, allergic/exercise asthma | evening dosing; neuropsychiatric mood warnings are the tested caution |
| methylxanthine | theophylline | rare, refractory | narrow index (10-20 mcg/mL); toxicity = tachycardia, tremor, seizures |
| magnesium sulfate | IV | severe attacks per protocol | bronchodilating adjunct in status asthmaticus |

The rescue-versus-controller sort is the highest-yield discrimination: albuterol is the only "right now" inhaler; steroids and LABAs prevent the next attack rather than treating this one, and a stem whose client reaches for salmeterol mid-attack is testing exactly that.

## Technique — where teaching items live

Metered-dose inhaler: shake, exhale fully, seal (or spacer), actuate ONCE while inhaling slowly and deeply, hold breath about 10 seconds, wait about a minute between puffs — bronchodilator FIRST when paired with a steroid (open the doors, then treat the walls), and rinse after the steroid. SPACERS improve delivery for weak technique and children. Dry-powder inhalers reverse the breath: FAST, forceful inhalation, and never exhale into the device. Return demonstration, not a nod, evaluates all of it.`,
      examTip: `Bronchodilator before steroid, rinse after the steroid, spacer for weak technique, fast breath for dry powder, slow for MDI — five mechanical facts that each anchor their own item.`,
    },
    {
      id: 'resp-crisis',
      title: `4. Crisis Comparisons & the Deterioration Radar`,
      content: `The two diseases share a deterioration radar worth holding side by side:

| Finding | In asthma | In COPD |
| --- | --- | --- |
| wheeze fading | silent chest — pre-arrest | same meaning at the extreme |
| speech | words-not-sentences marks severity | same |
| mentation change | hypoxia/exhaustion — escalate | ADD CO2 narcosis to the differential, check the oxygen flow |
| respiratory rate FALLING while distressed | fatigue failure — pre-arrest | same |
| saturation target | normal ranges | 88-92% in retainers |
| positioning | tripod/upright | tripod/upright |

Shared escalation script: upright, rescue bronchodilator (continuous nebulization per protocol in severe attacks), controlled oxygen to the appropriate target, systemic corticosteroids per orders, IV access, ABG when severity or mentation demands, and early rapid-response involvement — intubating an obstructed chest is hard, and the exam rewards escalation BEFORE arrest.

Pneumothorax lurks in both stems (bleb rupture in emphysema; barotrauma in ventilated asthma): sudden unilateral chest pain, absent breath sounds on one side, tracheal shift late, subcutaneous crackling — a chest-tube emergency the crisis can hide inside.

Infection prevention closes the loop: influenza vaccination annually, pneumococcal per schedule, hand hygiene, early treatment of respiratory infections — the same trigger-blocking logic as heart failure, and the same tested answer when stems ask how to prevent the next admission.`,
      examTip: `A falling respiratory rate in a client still visibly struggling is never improvement — it is the respiratory muscles failing. Pair it with quieting breath sounds and the only correct options escalate.`,
    },
    {
      id: 'resp-selfcheck',
      title: `5. Self-Check`,
      content: `1. Mid-attack, an asthmatic client's loud wheezing fades to near-silence while retractions continue. Interpret and act.

2. A COPD client on 6 L nasal cannula (applied by a well-meaning transporter) is now difficult to rouse; saturation reads 97%. What happened, and what is the response?

3. A client with asthma uses albuterol daily before work "to be safe" and salmeterol when attacks start. Identify both errors.

4. Sequence and explain: a client is due for albuterol MDI and fluticasone MDI, and asks why the order and the mouth rinse matter.

5. During a severe COPD exacerbation, the client develops sudden right-sided chest pain with absent right-sided breath sounds. What has likely happened and what does the nurse anticipate?

## Answers

1. Silent chest — airflow too low to generate wheeze; this is impending respiratory arrest. Rapid response, continuous nebulized bronchodilator per protocol, controlled oxygen, prepare for escalation including ventilatory support.

2. CO2 narcosis: high-flow oxygen in a chronic retainer worsened CO2 retention — the saturation looks fine while the CO2 climbs and sedates. Titrate oxygen toward the 88-92% target (do not remove it abruptly), obtain an ABG, monitor mentation, and notify.

3. Albuterol is RESCUE — daily scheduled use signals uncontrolled asthma and needs a controller review, not a habit. Salmeterol is a CONTROLLER — slow onset, never for acute attacks, and never used alone in asthma without an inhaled steroid.

4. Albuterol first: the bronchodilator opens the airways so the steroid penetrates. Fluticasone second, THEN rinse and spit — residual steroid in the mouth breeds oral candidiasis. About a minute between puffs; hold each breath about 10 seconds.

5. Spontaneous pneumothorax — bleb rupture is a known emphysema event, and unilateral absent sounds with sudden pain is its signature. Anticipate immediate provider notification, chest imaging, and chest-tube insertion; monitor for tension signs (tracheal deviation, worsening pressure) as an emergency-within-the-emergency.`,
    },
  ],
  keyTakeaways: [
    `Asthma severity climbs from wheeze to words-not-sentences to SILENT CHEST — and fading sounds in a struggling client mean escalate, not improve.`,
    `COPD retainers target 88-92% saturation with titrated oxygen; new drowsiness on generous flow is CO2 narcosis until an ABG says otherwise.`,
    `Albuterol is the only right-now inhaler; steroids and LABAs prevent, never rescue — and LABAs never fly solo in asthma.`,
    `Technique is testable mechanics: bronchodilator before steroid, rinse after steroid, spacer for weak technique, fast inhalation for dry powder.`,
    `Both diseases share the radar (falling rate + quieting chest = failing muscles) and the prevention bundle (vaccines, cessation, early infection treatment, pulmonary rehab).`,
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
  overview: `Neuro emergencies are clock-driven: stroke runs on time-last-known-well and the thrombolytic window, and rising intracranial pressure runs on catching the EARLIEST sign — a change in level of consciousness — before the Cushing triad announces that time is gone. This chapter covers stroke recognition and the two-pathway split (clot versus bleed), the acute and rehab nursing that follows, the ICP surveillance ladder with its positioning bundle, and the seizure care that travels with brain injury.`,
  sections: [
    {
      id: 'neuro-stroke-recognition',
      title: `1. Stroke Recognition & the Time Clock`,
      content: `Stroke recognition items use the public screens because they work: FAST (Face droop, Arm drift, Speech change, Time to call) and the fuller BE-FAST adding Balance and Eyes (sudden visual loss or diplopia). Sudden unilateral weakness or numbness, facial droop, aphasia or slurred speech, visual field loss, ataxia, or the "worst headache of my life" — each is a stroke stem, and the FIRST fact the nurse establishes is TIME LAST KNOWN WELL, because every downstream decision hangs on it.

Two mechanisms, opposite treatments:

| | Ischemic (about 85%) | Hemorrhagic |
| --- | --- | --- |
| mechanism | thrombus or embolus occludes | vessel ruptures — hypertension, aneurysm, AVM |
| classic stems | a-fib client, carotid disease | sudden thunderclap headache, rapid deterioration |
| imaging first | NON-CONTRAST CT — to EXCLUDE bleed | same CT — to FIND the bleed |
| acute pathway | thrombolytics if inside window and eligible; thrombectomy for large vessels per criteria | reverse anticoagulation, manage pressure, neurosurgery evaluation |
| anticoagulation | part of prevention (a-fib) | CONTRAINDICATED |

The thrombolytic (alteplase-class) window is commonly cited at 3 to 4.5 hours from last known well with strict eligibility screening — recent surgery, active bleeding, prior hemorrhage, uncontrolled hypertension above protocol thresholds exclude. The screening items test the CONCEPT: a client who woke with symptoms has an UNKNOWN onset (last known well was bedtime), and the nurse who says "it started when he woke at 7" is making the tested error.

TIA — transient symptoms with resolution — is not a reprieve but a WARNING (highest stroke risk in the following days) and earns urgent workup, not reassurance.

Before ANYTHING passes the lips: the swallow screen. Dysphagia is common, silent aspiration is real, and the tested sequence keeps every stroke client NPO until a swallow evaluation clears them — including the pills.`,
      examTip: `Two clock facts run the chapter: time LAST KNOWN WELL (not symptom discovery) starts the window, and the non-contrast CT precedes any thrombolytic because clot treatment kills the bleeding stroke.`,
    },
    {
      id: 'neuro-stroke-care',
      title: `2. Acute Stroke Nursing & Rehabilitation`,
      content: `Acute surveillance: neuro checks on schedule (level of consciousness FIRST — it moves before pupils do), blood-pressure management per pathway (permissive elevation is often tolerated in ischemic stroke per protocol — aggressive lowering can extend the infarct; post-thrombolytic clients run strict limits with bleeding surveillance), glucose checked (hypoglycemia mimics stroke; hyperglycemia worsens outcomes), temperature managed, and cardiac monitoring (the a-fib that caused it may still be there).

Post-thrombolytic care is a bleeding watch: neuro checks every 15 minutes initially per protocol, no invasive procedures or injections where avoidable, gums-urine-puncture-site surveillance, and ANY neurologic worsening treated as intracranial hemorrhage until imaged.

## Deficits by side — the rehabilitation map

| Left-hemisphere stroke (right body) | Right-hemisphere stroke (left body) |
| --- | --- |
| aphasia (language lives left for most) | spatial-perceptual deficits |
| slow, cautious behavior | IMPULSIVE, unaware of deficits — the safety problem |
| right visual field cut | left visual field cut, left NEGLECT |
| depression, frustration common | overestimates abilities — falls |

The safety logic falls out of the table: the right-hemisphere client with neglect and impulsivity is the fall risk who needs the environment arranged and supervision; approach and place belongings on the UNAFFECTED side initially for neglect clients, then progressively cue toward the neglected side as therapy advances. Homonymous hemianopsia teaching: scan to the blind side deliberately.

Aphasia communication: unhurried, simple direct sentences, one question at a time, yes-no formats for expressive aphasia, gestures and boards, and NEVER answering for the client or pretending to understand. Dysphagia feeding (once cleared for modified diets): upright 90 degrees, chin-tuck if taught, thickened liquids per speech therapy, food placed on the UNAFFECTED side of the mouth, no straws when directed, stay upright 30+ minutes after.

Hemiplegic-limb care: subluxation-prone shoulders supported (never pull the affected arm), range of motion, positioning to prevent contractures, and skin surveillance doubled where sensation is lost — the neglected limb burns and ulcers silently.`,
      examTip: `Side logic decides safety items: right-hemisphere = impulsive + neglect = the fall-and-injury stems; left-hemisphere = aphasic + cautious = the communication stems. Learn the table both directions.`,
    },
    {
      id: 'neuro-icp',
      title: `3. Increased Intracranial Pressure: The Surveillance Ladder`,
      content: `The skull is a fixed box; blood, brain, and CSF trade space (Monro-Kellie), and when compensation exhausts, pressure climbs and perfusion falls. The surveillance ladder is the chapter's core:

EARLIEST: a CHANGE IN LEVEL OF CONSCIOUSNESS — restlessness, irritability, new confusion, increasing drowsiness. Not pupils. Not vitals. The exam asks this directly and constantly.

EARLY-TO-MIDDLE: headache (worse in the morning, worse with strain), projectile vomiting without nausea, and pupil changes beginning — sluggish reaction on one side (the compressing third nerve).

LATE: the CUSHING TRIAD — widening pulse pressure (systolic climbing), BRADYCARDIA, and irregular respirations. This is herniation announcing itself; the exam wants you to name it and treat it as the emergency it is, and to know it is the OPPOSITE of shock's pattern (tachycardia, narrowing pressure).

Glasgow Coma Scale scores eye opening (4), verbal (5), and motor (6): 15 is intact, 8 or below is coma and conventionally the airway-protection threshold ("GCS 8, intubate" as taught shorthand), 3 is the floor. A falling GCS trend outranks any single score.

## The ICP nursing bundle

| Do | Avoid |
| --- | --- |
| head of bed 30 degrees, head MIDLINE | neck flexion/rotation, tight tube ties (jugular outflow) |
| quiet environment, spaced-out care activities | clustering all care at once (stacks the pressure spikes) |
| stool softeners; instruct no straining | Valsalva, coughing regimens, hip flexion extremes |
| manage fever aggressively | hyperthermia (raises metabolic demand) |
| oxygenate; maintain normocapnia per orders | routine hyperventilation (reserved, per protocol, transient) |
| seizure precautions | suctioning beyond brief, pre-oxygenated passes |

Medical armory: hyperosmolar therapy (mannitol or hypertonic saline per orders — watch for rebound and renal/volume effects; mannitol needs a filter and serum osmolality checks), CSF drainage via ventriculostomy where placed (leveled and zeroed to the tragus per policy), sedation, and surgical decompression as the ceiling. Corticosteroids help tumor-related edema, not traumatic — a detail stems use.`,
      examTip: `The two most-tested facts in neuro: LOC change is the EARLIEST ICP sign, and Cushing triad (wide pulse pressure, bradycardia, irregular breathing) is the LATE one. Everything between is positioning and prevention.`,
    },
    {
      id: 'neuro-seizure',
      title: `4. Seizures & Status Epilepticus`,
      content: `Seizure stems test the during-and-after script more than the classification.

DURING a tonic-clonic seizure: stay, time it, protect — ease the client to the floor or bed, side-lying as soon as possible (secretions drain), loosen clothing, clear hard objects, pad without restraining. NOTHING goes in the mouth — no airways, no fingers, no bite sticks; the tested wrong answers are restraining the limbs and inserting objects. Note onset, progression, duration, and behaviors — the description is diagnostic data.

AFTER (postictal): airway and positioning first, vitals and neuro checks, reorient the confused client calmly, check for injury (tongue, shoulders, head), and let them sleep with monitoring. Document factually.

STATUS EPILEPTICUS — seizure beyond 5 minutes or repeated seizures without recovery between — is a neurologic emergency: airway and oxygen, IV access, BENZODIAZEPINE first-line (lorazepam IV per protocol; midazolam IM when no line), then loading anticonvulsants per orders, glucose checked (hypoglycemia seizes), and rapid response engaged. The timing threshold and the benzo-first sequence are both tested.

Precautions for at-risk clients: bed low, padded rails per policy, suction and oxygen set up at the bedside, IV access maintained, no unsupervised swimming/baths in teaching, and medication adherence emphasized — the most common cause of breakthrough seizures in a known epileptic is MISSED DOSES, and anticonvulsants (phenytoin with its 10-20 level and gum care; levetiracetam with its mood warnings) never stop abruptly.

Driving and lifestyle teaching follows state law and provider guidance — the tested attitude is honest restriction plus adherence support, not indefinite prohibition.`,
      examTip: `Nothing in the mouth, nothing restrained, side-lying, TIMED — and 5 minutes converts a seizure into status epilepticus with a benzodiazepine-first emergency script.`,
    },
    {
      id: 'neuro-selfcheck',
      title: `5. Self-Check`,
      content: `1. A client's family reports he "seemed fine at breakfast" and was found with right-sided weakness and aphasia at 1300. What time starts the thrombolytic clock, and what imaging precedes treatment?

2. A head-injured client who was alert an hour ago is now irritable and intermittently drowsy; pupils remain equal and reactive. Interpret against the ICP ladder.

3. Interpret: BP 178/58, HR 52, respirations irregular in a client with a large intracerebral hemorrhage. What is this called and what does it signify?

4. A right-hemisphere stroke client with left neglect keeps trying to climb out of bed unaided. Connect the deficits to the risk and name two environmental interventions.

5. A hospitalized client seizes for 7 minutes despite positioning and oxygen. Classify, and name the first-line drug class with its route logic.

## Answers

1. BREAKFAST — the last time he was KNOWN well; symptom discovery at 1300 does not reset it. A non-contrast head CT must exclude hemorrhage before any thrombolytic is considered.

2. This IS the earliest ICP warning — level-of-consciousness change precedes pupil signs and vital-sign changes. Escalate now: neuro assessment, notify, tighten check frequency; waiting for pupils or the triad waits for herniation.

3. Cushing triad: widening pulse pressure, bradycardia, irregular respirations — the LATE sign of critically raised ICP heralding herniation. It is an emergency requiring immediate provider/rapid-response involvement, not a trend to watch.

4. Right-hemisphere injury pairs impulsivity (unaware of deficits) with left-sided neglect — he genuinely does not perceive the left field or his limitations, so he attempts unsafe transfers. Interventions: bed low with alarm, essentials and approach on the seeing/unaffected side initially, frequent rounding/supervision, and progressive cueing toward the neglected side per therapy.

5. Status epilepticus (over 5 minutes). Benzodiazepines first — lorazepam IV when access exists, midazolam IM when it does not — followed by anticonvulsant loading per orders, with airway, oxygen, glucose check, and rapid response running in parallel.`,
    },
  ],
  keyTakeaways: [
    `Stroke runs on time-last-known-well, and the non-contrast CT decides the pathway split: thrombolyse eligible clots, never bleeds — and every stroke client is NPO until the swallow screen.`,
    `Side logic maps rehab: left-hemisphere aphasia and caution, right-hemisphere impulsivity and neglect — the latter owns the safety stems.`,
    `ICP's ladder: LOC change earliest, pupil and headache middle, Cushing triad (wide pulse pressure, bradycardia, irregular breathing) late — and the bundle is 30 degrees, midline, quiet, unclustered, unstrained.`,
    `GCS 8 protects its own airway no longer; trends outrank scores; mannitol and hypertonic saline per orders with osmolality and volume surveillance.`,
    `Seizures: nothing in the mouth, side-lying, timed — 5 minutes is status epilepticus and benzodiazepines go first; missed doses are the classic breakthrough cause.`,
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

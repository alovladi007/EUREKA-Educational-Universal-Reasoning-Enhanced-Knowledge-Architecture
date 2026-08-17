// FE EE course content — Exam Strategy (1 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_EXAM_STRATEGY: Record<string, TopicLesson> = {
fee_reference_handbook: {
  topicId: 'fee_reference_handbook',
  title: `NCEES Reference Handbook Navigation`,
  domainWeight: 'Exam Strategy',
  overview: `The FE is an open-reference exam: NCEES supplies its own reference handbook on-screen and you may bring nothing else. That changes what preparation means. This chapter is not about new technical content; it is about the skill of working from a supplied reference under time pressure — finding a relation by concept rather than by memory, checking that its assumptions match the problem in front of you, mapping its symbols onto yours, converting units before substituting, verifying a result you did not derive, and budgeting the clock so that all of it fits. Handbook versions change between exam cycles, so this chapter deliberately teaches structure and method rather than page numbers, and sends you to ncees.org for anything version-specific.`,
  sections: [
    {
      id: 'handbook-layout',
      title: `1. Handbook Layout — Memorize the Section Order`,
      content: `A formula reference for a multi-discipline examination is organised the way the examination is: a set of general divisions every discipline draws on, followed by discipline-specific material. Learn that SHAPE, and learn where your own topics sit inside it, by working with the current handbook PDF from ncees.org.

Do not learn a section count, a page ordering or a table of contents from any third party, including this page. Those change between versions, and a navigation map that does not match the book you are handed is worse than no map at all — it sends you confidently to the wrong place. What follows is a list of the SUBJECT AREAS involved, which is stable, and not a claim about how any particular version arranges them.

## 1.1 Subject areas every FE discipline draws on

- **Units, Conversion Factors, & Constants** — SI prefixes, metric/Imperial conversions, fundamental constants (e, k, mₑ, mₚ, c, h, ε₀, μ₀, N_A)
- **Mathematics** — algebra/trig identities, calculus formulas, ODE solutions, Laplace transform pairs, Fourier series, vector identities
- **Probability & Statistics** — distributions (binomial, Poisson, normal, exponential, t, χ², F), statistical inference, regression formulas, z-tables
- **Engineering Economics** — interest factor tables (P/A, F/A, P/F, A/P, A/F, A/G), depreciation formulas, NPV, IRR, BCR
- **Ethics** — NCEES model rules of professional conduct (memorize the categories; specifics will be referenced)

## 1.2 Subject areas specific to Electrical and Computer

- **Electrical and Computer Engineering** — the discipline-specific material, where most of your look-ups will land
  - Electromagnetic fundamentals
  - Circuit analysis (Ohm's, Kirchhoff's, Thevenin/Norton, mesh/nodal)
  - AC analysis (phasors, impedance, power, three-phase)
  - Transient response (RC, RL, RLC second-order forms)
  - Transformers
  - Transmission lines
  - Rotating machines
  - Electronics (diodes, BJT, MOSFET, op-amp configurations)
  - Power electronics (buck/boost, PWM)
  - Linear systems (transfer functions, stability, Bode plots)
  - Signal processing (Fourier, Z-transform, filters)
  - Control systems (block diagrams, Routh, root locus, PID)
  - Communications (modulation, BER, Shannon-Hartley)
  - Digital systems (Boolean, K-maps, FSMs)
  - Computer networking (OSI model, IP subnetting basics)
  - Software (algorithms, data structures, complexity)

## 1.3 Strategy: build a personal bookmark map

Before exam day, spend ~10 hours total studying the actual handbook PDF (download from NCEES). For each major topic, NOTE:

- The section heading
- Its POSITION within that division — near the start, after a particular heading, inside a table or in running text. Position is what your eye uses when scrolling, and it survives a version change; a page number does not.
- Layout of the formulas (is it a table? a chart? a numbered list?)

Most candidates create a "personal index" cheat sheet that says:

| Need | Handbook Location |
|---|---|
| Laplace transform pairs | Mathematics division, transform subsection |
| Transformer turns ratio | EE section, near Transformers heading |
| Op-amp ideal model | EE section, Electronics subsection |
| Routh-Hurwitz template | EE section, Control subsection |
| Shannon-Hartley formula | EE section, Comms subsection |
| Power triangle | EE section, AC Power subsection |
| Three-phase line/phase relationships | EE section, Three-Phase subsection |
| Phasor impedance ZL = jωL, ZC = 1/(jωC) | EE section, AC Phasors subsection |
| Bode asymptote slopes | EE section, Linear Systems subsection |

Then during the exam, you have the look-up table memorized — you go straight to the location and don't waste time scanning the whole document.

## 1.4 Handbook quirks the exam tests

- **Notation differences** — a supplied reference may use notation that differs from the textbook you learned from; ω₀ and ω_n both appear for natural frequency, ζ and α are different damping parameters with different units, and α and β are heavily overloaded. Section 7 treats this in detail.
- **Implicit units** — the handbook sometimes shows formulas without unit notation. Verify the expected unit and convert if needed.
- **Multiple forms** — some formulas have multiple equivalent forms; learn which one matches the problem language the exam uses.
- **Calculator notation** — the handbook may show e^x or exp(x) interchangeably; same for log/ln distinctions (log is usually base 10 in EE contexts; ln is natural log).

## 1.5 The NCEES-approved calculator constraint

NCEES publishes an approved-calculator list and permits only the models on it.
The list is republished for each exam year, so treat what follows as the shape of
the policy rather than as a current inventory, and check ncees.org before you
buy. At the time of writing it admits three families:

- **Casio** — all fx-115 and fx-991 models (the model name must contain
  "fx-115" or "fx-991")
- **Hewlett Packard** — the HP 33s and HP 35s, and no other HP model
- **Texas Instruments** — all TI-30X and TI-36X models (the model name must
  contain "TI-30X" or "TI-36X")

Check the current list on the NCEES site before you buy, because it is
republished for each exam year. These calculators do NOT have programmable
memory or graphing — you cannot pre-store formulas. They DO have:

- Complex number arithmetic (essential for AC analysis)
- Equation solver (for some models)
- Matrix operations (limited — for solving 2x2 or 3x3 systems)
- Statistics functions

Practice WITH the model you'll bring. Calculator unfamiliarity costs more time than handbook unfamiliarity.

## 1.6 The on-screen reference is searchable

The on-screen handbook viewer includes a SEARCH function. Confirm its current behaviour against the NCEES practice materials rather than against any description written elsewhere, including this one, since the viewer changes. Practice using it:

- Common search terms: the section title (e.g., "Three-Phase"), a formula keyword (e.g., "Shannon")
- Search returns hits with context — scan results, click the most relevant
- Searches are FAST but require knowing the right term — your personal index helps generate good search queries

## 1.7 Time budgeting per question

Get this arithmetic right, because a great many candidates plan against the
wrong number. NCEES describes the FE as a 6-hour **appointment**, and the
appointment is not all exam. It comprises a 2-minute nondisclosure agreement, an
8-minute tutorial, **5 hours and 20 minutes of actual testing time**, and a
25-minute scheduled break.

Confirm both figures — the question count and the testing time — against the
current NCEES exam specification before you plan around them. What follows is a
method; the numbers are the ones NCEES published at the time of writing, and if
either changes, redo the division rather than reusing the result.

So the budget is 320 minutes for 110 questions:

**19,200 s / 110 = 174.5 seconds per question**, or 2 minutes 55 seconds.

Planning against 196 seconds — 6 hours divided by 110 — quietly overspends by
about 22 seconds a question, which is 40 minutes across the exam. Allocate the
real budget:

- ~25 seconds: read and understand the question
- ~25 seconds: navigate the handbook to the relevant formula
- ~55 seconds: identify variables, plug in numbers, calculate
- ~25 seconds: verify (units, sanity check, mark for review if uncertain)
- ~44 seconds: buffer for harder questions

If you're spending 60+ seconds JUST locating a formula, your handbook navigation needs work. Drill it.`,
      examTip: `The exam is open-reference, so the reference is not an advantage — everyone has it. The advantage is retrieval speed, and it is built by practising with the current handbook PDF, not by memorising anyone's description of it.`,
      importantNote: `Download the current NCEES FE Reference Handbook PDF from ncees.org BEFORE you start studying technical content. Use it as the primary reference for every problem you practice. Familiarity with the handbook is worth more raw exam points than mastering any single subject.`,
    },
    {
      id: 'time-saving-tactics',
      title: `2. Time-Saving Tactics and Common Pitfalls`,
      content: `## 2.1 Question-attack sequence (the 174.5-second budget in practice)

1. **Read the problem ONCE end-to-end** — 15-20 seconds. Identify: what's given (variables, units), what's asked (the unknown).
2. **Recognize the topic** — 5 seconds. "This is AC power factor correction." "This is op-amp inverting configuration." Pattern recognition comes from practice.
3. **Open the handbook to the right section** — 10-20 seconds. With practice, you don't search; you JUMP to the bookmark.
4. **Find the matching formula** — 10-15 seconds. Scan headers, not full text.
5. **Plug in numbers** — 30-60 seconds. Watch units carefully.
6. **Calculate** — 30-60 seconds. Use complex-number mode on your calculator for AC problems; don't manually compute magnitudes/angles.
7. **Sanity check** — 5-15 seconds. Does the answer have the right order of magnitude? Right units? Right sign?

Total: ~120-180 seconds. You'll have buffer for harder problems.

## 2.2 Mark-and-skip discipline

You CAN flag questions for review. Use it:

- If a problem will take >5 minutes, mark and skip on first pass. Easy points are scattered throughout the exam.
- After completing every easy question, return to flagged ones with whatever time remains.
- DO NOT spend 10 minutes on a single question while skipping five easy ones. NCEES does not publish per-question weights, and whatever the internal weighting is, the arithmetic favours the five over the one.

The exam is scored on raw correct answers with no deduction for a wrong one. ALWAYS GUESS on anything unanswered. Among four alternatives a blind guess returns 25% on average; not every FE item is four-option multiple choice, but no format rewards a blank.

## 2.3 Unit traps

Most exam mistakes are unit errors. Common traps:

- **Power in kW vs MW** — power-systems problems often give MW or MVA; circuits problems use W or mW
- **Time in seconds vs hours** — engineering economics uses years, control systems uses seconds, power systems often hours
- **Voltage RMS vs peak** — AC problems default to RMS for power, peak for waveform descriptions. Check which the question gives.
- **Decibels** — dB = 10·$\\log _{10}$(P/P_ref) for power, 20·$\\log _{10}$(V/V_ref) for voltage. dBm is referenced to 1 mW.
- **Frequency Hz vs rad/s** — Bode plots use rad/s convention; some problems give Hz. ω = 2πf.
- **Imperial vs SI** — most FE problems are SI but occasional imperial sneaks in (especially horsepower in power problems; 1 HP = 746 W).

When you start a problem, WRITE OUT the units you have AND the units you need. Convert at the start.

## 2.4 Phasor angle pitfalls

AC analysis uses phasors. Common mistakes:

- **Polar vs rectangular** — your calculator's polar mode displays as r∠θ; rectangular as a+jb. Set the right mode for the problem.
- **Angle in degrees vs radians** — most FE problems use DEGREES. Your calculator must be in DEG mode for trig functions, unless the problem explicitly uses radians.
- **Reference direction** — voltage and current have ASSUMED polarity/direction. The sign of the answer depends on whether your assumed direction matches the actual direction.
- **Inductor impedance** — Z_L = jωL = ωL∠90°. Capacitor impedance Z_C = 1/(jωC) = (1/ωC)∠-90°. Memorize the SIGNS of these angles.

## 2.5 Three-phase line vs phase relationships

Common trap on three-phase problems:

- **Y (Wye) connection**: V_line = √3 · V_phase, I_line = I_phase
- **Δ (Delta) connection**: V_line = V_phase, I_line = √3 · I_phase

Power formula for balanced three-phase: P = √3 · V_line · I_line · cos(θ) — uses LINE quantities and a √3 factor.

If you confuse line and phase, your answer is off by √3 (or 3 in some derived quantities).

## 2.6 Power factor sign convention

- **Lagging PF**: inductive load, current lags voltage. PF angle is POSITIVE in most conventions, but some texts/problems use the OPPOSITE convention.
- **Leading PF**: capacitive load, current leads voltage.
- **Reactive power Q**: positive for inductive loads, negative for capacitive.

Check the problem's convention. If unclear, the question text usually tells you "lagging" or "leading" — use that to determine the sign of the reactance.

## 2.7 Op-amp ideal model assumptions

- Infinite input impedance (no current into input pins)
- Zero output impedance
- Infinite open-loop gain (so V+ = V- in any negative-feedback configuration — "virtual short")
- Zero offset voltage
- Infinite bandwidth

Memorize the standard configurations and their gain formulas:

- **Inverting**: V_out = -(R_f/R_in) · V_in
- **Non-inverting**: V_out = (1 + R_f/R_in) · V_in
- **Summing inverting**: V_out = -(R_f/R_1 · V_1 + R_f/R_2 · V_2 + ...)
- **Difference**: V_out = (R_f/R_in) · (V_+ - V_-)
- **Integrator**: V_out = -(1/(R·C)) ∫V_in dt
- **Differentiator**: V_out = -R·C · dV_in/dt

The negative sign on inverting configurations is THE MOST COMMON mistake. The output is INVERTED.

## 2.8 Number-base conversions

Digital systems problems require fluent conversion among binary, hex, decimal, BCD:

- Hex: groups of 4 binary bits. 0xA = 1010, 0xF = 1111.
- BCD: each decimal digit encoded as 4 bits. 23 in BCD = 0010 0011, NOT 0001 0111 (which is binary 23).
- Two's complement: sign bit is MSB; negative number = invert bits + 1.

If you're slow at these, drill them. They appear in 4-6 questions.

## 2.9 K-map simplification

For digital combinational logic problems:

- Plot the truth table on a K-map (2-var, 3-var, or 4-var)
- Group adjacent 1s in rectangles of size 1, 2, 4, 8, 16
- Larger groups = simpler terms
- The simplified Boolean expression is the OR of the simplified group expressions

Common trap: forgetting that the K-map WRAPS AROUND (top edge connects to bottom; left to right). Adjacency includes wraparound.

## 2.10 Engineering economics — the factor tables

Memorize the symbolic names; the handbook gives the numeric values:

- **(P/F, i, n)** — present worth given future, single payment
- **(F/P, i, n)** — future worth given present, single payment
- **(P/A, i, n)** — present worth given annual, uniform series
- **(A/P, i, n)** — annual given present, capital recovery
- **(F/A, i, n)** — future worth given annual, uniform series sinking fund
- **(A/F, i, n)** — annual given future, sinking fund
- **(P/G, i, n)** — present worth of arithmetic gradient

When the problem describes a cash flow, identify whether you need P, F, or A as output and what you have as input — pick the right factor.

## 2.11 Skip strategy for known-weak topics

If you KNOW you're weak in a section (e.g., you struggle with electromagnetics), don't waste time perfecting it. Better strategy:

- Make sure you're STRONG in your top 4-5 sections (high-confidence answers)
- For your weakest sections, plan to answer the EASY questions only (~50% of the questions in that section are typically straightforward formula plug-ins)
- Guess on the rest — a blind guess among four alternatives returns 25% on average

This realistic accounting often produces a higher score than trying to be "balanced." Play to your strengths, mitigate weaknesses.`,
      examTip: `MARK and SKIP is your best tool. Never spend >3 minutes on a single question. The exam rewards completing many easy questions over solving a few hard ones.`,
    },
    {
      id: 'practice-strategy',
      title: `3. 30-Day Study Plan and Practice Cadence`,
      content: `## 3.1 A realistic 30-day plan from current state to exam-ready

This assumes you have a solid undergraduate EE background but haven't reviewed the FE topics formally. Adjust based on your starting point.

### Days 1-3: Baseline + handbook orientation

- Download NCEES handbook
- Read its introduction + scan section headings
- Take ONE diagnostic practice exam (NCEES official practice exam if you can buy it, or platform questions)
- Tally results by section to identify your strongest 4-5 sections and weakest 4-5

### Days 4-15: Section-by-section drilling

Allocate study time PROPORTIONAL to section weight × your weakness:

- Strong + heavy section (e.g., Circuits if you're solid): 1 day quick review
- Weak + heavy section (e.g., Power Systems if you skipped that course): 2-3 days deep study

For each section:
1. Read the platform's lesson topic
2. Look up the corresponding handbook section
3. Work 10-20 practice problems
4. For wrong answers: identify the CONCEPT gap (not just the math error), restudy, redo

### Days 16-22: Mixed practice exams

Take 1 full practice exam every 2-3 days under TIMED conditions. After each:

- Review every wrong answer
- Identify whether the miss was knowledge gap (study more), careless math (slow down), or unfamiliarity with handbook (drill navigation)
- Track your section-level scores; if a section is below 50%, give it more time

### Days 23-27: Targeted weakness elimination

By now you know exactly which 4-6 subtopics are dragging you down. Spend these days on ONLY those — no broad review.

### Days 28-29: Light review + handbook re-scan

Don't try to learn anything new. Re-read the formula sheets you struggle with. Get familiar with the handbook search.

### Day 30: Rest

Sleep well. Light review of your personal cheat sheet (your bookmark map). No new content.

## 3.2 Practice question quotas

Aim for total of 800-1200 practice questions over 30 days, distributed by section weight:

- Mathematics: ~80 practice questions
- Circuits: ~120
- Electronics: ~80
- Power Systems: ~90
- Control: ~70
- Digital: ~80
- (others proportional)

You'll see questions multiple times. That's FINE — repetition builds recognition speed. Aim for SECOND-TIME accuracy >90% on previously-seen questions.

## 3.3 Use the platform's QBank with discipline

- Don't peek at answers until you've genuinely attempted
- After answering: review the explanation EVEN IF you got it right (verify your reasoning matched the expected reasoning)
- Use flashcards in spaced repetition (10-15 minutes per day, more in the final week)

## 3.4 Day-before-exam checklist

- ID confirmed (NCEES + government photo)
- Calculator tested and packed (and spare batteries)
- Test center location + travel time verified
- Comfortable clothes (testing rooms vary in temperature)
- Light snack + water for breaks (you may step out)
- Sleep 7-9 hours

## 3.5 Day-of-exam tactics

- Arrive 30 minutes early
- Use the bathroom before starting. The scheduled break described in section 1.7 does not come out of your testing time; any additional break you take does
- First 5 minutes: skim the exam interface, verify handbook is accessible, verify calculator
- Start with your STRONGEST section to build confidence and momentum
- Use the flagging system aggressively
- Watch the clock; aim to finish all questions by 5h45min, leaving 15 min for flagged reviews
- Don't change answers in the final review unless you have a CLEAR reason — first instincts are usually right

## 3.6 What "ready" means, given how the exam is actually scored

Be careful with claims about cut scores, because NCEES publishes how the exam
is scored and the answer is not a fixed percentage. Your raw score is converted
to a scaled score that adjusts for small differences in difficulty between exam
forms, and that scaled score is compared with a standard set by subject-matter
experts. NCEES states plainly that **no predetermined percentage of examinees
passes or fails**, and it does not publish a raw cut score. Anyone quoting an
exact number of questions you must answer correctly is guessing.

Two facts about scoring that NCEES does publish, and that change how you should
behave in the room:

- **There are no deductions for wrong answers.** An unanswered question is
  strictly worse than a guessed one.
- **Results are reported as pass or fail**, typically within 7–10 days through
  your MyNCEES account, and a failing report includes a diagnostic breakdown of
  relative strengths and weaknesses by subject area.

Since the threshold is not published, use your practice results as a *relative*
signal rather than a prediction:

- Consistently scoring in the high 60s to 70s on full, timed practice exams
  means your preparation is at the level candidates typically pass from
- Scoring in the 50s means the outcome depends on which topics the form
  emphasises — keep studying
- Scoring below 50 means substantive gaps remain, and the diagnostic categories
  will tell you where

The honest summary: aim comfortably above where you think the line is, because
you cannot see the line.`,
      examTip: `The single biggest determinant of pass/fail is HANDBOOK FAMILIARITY combined with EXAM PACING. Both are skills you build through practice, not natural talent. 30 days of disciplined study, 800-1200 practice questions, and 5+ full timed practice exams should get most candidates with a solid EE undergrad to passing.`,
      importantNote: `Don't pay for premium "FE crash course" videos until you've exhausted free resources (NCEES sample questions, university OCW, YouTube channels like Engineer4Free, EE Power, electricalpe). The platform's lessons + QBank + handbook should suffice for most candidates.`,
    },
    {
      id: 'handbook-index-drill',
      title: '4. Building the Index: a Navigation Drill You Can Actually Do',
      content: `## 4.1 The difference between searching and looking up

Sections 1 and 2 said to build a personal index. This section is about how, and
about the distinction that makes it worth the effort.

**Searching** is what you do when you know what you need but not where it is:
you scan headings, try a search term, backtrack, try another. It costs 30 to 90
seconds and its cost is unpredictable, which is worse than its average.

**Looking up** is what you do when the question's phrasing has already told you
which division of the handbook to open. It costs five to ten seconds and its
cost is constant.

The whole discipline consists of converting searches into lookups, in advance,
for the two hundred or so question types this exam actually asks.

![Declared schematic: a two-column mapping showing phrases a question might use on the left — "find the steady-state error", "the line current in a delta load", "effective annual interest" — and the handbook division each one should send you to on the right. The diagram is a teaching device illustrating the KIND of personal index to build; it reproduces no part of the handbook's own layout or wording.](/courses/fe-ee/figures/strat-handbook-map.svg)

The figure shows the form the index should take: **question language on the
left, destination on the right.** Not topics on the left — topics are how you
studied, and they are not how questions are worded. A question rarely says "this
is a steady-state error problem"; it says a system is subjected to a ramp input
and asks what the tracking error settles to. Your index has to be keyed to the
words the exam actually uses.

## 4.2 The drill, in four passes

Build the index by working with the current handbook PDF open, not from memory.

**Pass 1 — skeleton (about an hour).** Open the handbook and write down its
top-level divisions in order, with nothing else. You are learning the shape of
the document: which divisions are general and shared, where the discipline
material starts, and roughly how big each part is.

**Pass 2 — anchors (two to three hours).** For each division, find and note the
five or six formulas you are most likely to need. Note *where* they sit within
the division — near the start, after a particular heading, in a table or in
running text. Position within a section is what your eye actually uses when
scrolling.

**Pass 3 — question language (three to four hours).** Work practice questions
with the handbook open. Every time you have to look something up, write the
phrase the question used and the destination you eventually reached. This is the
pass that produces the real index, and it cannot be done without practice
questions.

**Pass 4 — timed retrieval (ongoing).** Have someone read you question phrases,
or use your own list shuffled. Say the destination out loud, then verify. The
target is under five seconds, and reaching it is a memory task, not an
understanding task, so it responds well to spaced repetition.

## 4.3 Search terms, when you must search

The on-screen handbook is searchable, and searching is the fallback when the
index misses. Two rules make it effective:

- **Search for the noun in the formula, not the concept.** A search for a
  quantity name or symbol usually lands on the equation itself; a search for a
  concept name lands on prose, which then needs another hop.
- **Prefer a term that is rare in the document.** Common words return dozens of
  hits and cost more time than scrolling. Distinctive names — a person's name
  attached to a criterion, an uncommon symbol, a specific unit — return few.

Practise this in advance, because the sequence "search returns 40 hits, panic,
retype" is where the minutes go.

## 4.4 Notation reconciliation

The handbook's notation will differ in places from the textbook you learned
from, and reconciling it under time pressure is a needless cost. Build a short
table of the differences you personally hit while practising. Common ones worth
checking early:

| Concept | Notations you may meet | Watch for |
|---|---|---|
| Natural and damped frequency | ω_n, ω₀, ω_d | Which one a given formula expects |
| Damping | ζ (ratio) and α (Neper frequency) | α = ζω_n; the two are not interchangeable |
| Logarithms | log vs ln | log is base 10 in most electrical contexts |
| Angles | degrees vs radians | Phasor problems are almost always degrees |
| Current direction | assumed vs actual | The sign of the answer depends on the assumption stated |
| Efficiency and power factor | η, pf, cos θ | pf is cos θ only for sinusoidal steady state |

## 4.5 What NOT to spend time on

Two failure modes waste the preparation this section is meant to save.

**Do not memorise page numbers.** Handbook versions change and page numbers move
with them. Memorise *structure* — division order and position within a division —
which is far more stable.

**Do not transcribe the handbook.** Copying formulas onto your own sheet feels
productive and is not: you cannot bring it, and the exercise trains recall of
content you will be given anyway. Train **retrieval**, not recall. The one thing
the handbook cannot supply on exam day is knowing which page to open, and that
is precisely the skill this drill builds.`,
      examTip: `Key your index to the words questions use, not to the topics you studied. "Find the settling time" and "how long until the response is within 2% of final value" are the same lookup, and only practice with real question language teaches you that.`,
      importantNote: `Handbook versions change between exam cycles and page numbers move with them. Learn the ORDER of the divisions and the position of material within a division; both survive a version change, and memorised page numbers do not.`,
    },
    {
      id: 'pacing-and-scoring',
      title: '5. Pacing Arithmetic and the Mechanics of Scoring',
      content: `## 5.1 The pace line, and the checkpoints that keep you on it

Section 1.7 established the real budget: 320 minutes of testing time for 110
questions, which is **174.5 seconds each**. A budget is only useful if you can
tell mid-exam whether you are keeping to it, and that requires checkpoints you
have memorised — because doing the division under pressure is exactly when you
will get it wrong.

At the on-pace rate, one question takes 320/110 = 2.909 minutes, so:

| Elapsed testing time | You should be finishing about |
|---|---|
| 30 minutes | question 10 |
| 60 minutes | question 21 |
| 90 minutes | question 31 |
| 120 minutes | question 41 |
| 160 minutes (halfway) | question 55 |
| 200 minutes | question 69 |
| 240 minutes | question 82 |
| 280 minutes | question 96 |
| 320 minutes | question 110 |

Memorise three of them — 60 minutes / Q21, 160 minutes / Q55, 240 minutes /
Q82 — and you can audit your pace in two seconds without arithmetic.

![Questions completed against elapsed testing time, with the on-pace line computed from 110 questions in the 320 minutes NCEES publishes as FE testing time. Checkpoint dots mark the questions you should be finishing at 60, 120, 160 and 240 minutes; the dashed line shows the steeper 147-seconds-per-question rate needed to recover from being ten questions behind at the halfway mark.](/courses/fe-ee/figures/strat-pace-checkpoints.svg)

The dashed recovery line is the reason checkpoints matter more than good
intentions. Ten questions behind at halftime is not a disaster, but it leaves 65
questions in 9,600 seconds, which changes the remaining budget from 174.5 seconds
a question to **147.7 seconds** — a 15% cut you must sustain for two and a half
hours. Twenty behind at the same point leaves 75 questions in the same 9,600
seconds, or 128 seconds each, which is not achievable on a mixed set.
The cost of drift compounds, and the only cheap moment to correct it is early.

Concretely: **five minutes over budget on one question costs 1.7 questions of
time.** Two such indulgences and you have spent a question's worth of the exam
on nothing.

## 5.2 Mark-and-skip, quantified

Because there is no penalty for a wrong answer, every question has a positive
expected value and the only truly bad outcome is leaving one blank. That makes
the triage rule arithmetic rather than temperament:

- **Under 30 seconds in**, you should know whether this is a question you can do.
  If not, mark it and move on. You have spent 17% of a question's budget to buy
  a full budget elsewhere.
- **At 2× the budget** — about 6 minutes — a question you are still fighting is
  consuming another question's entire allowance. Answer with your best guess,
  mark it, and move.
- **On the final pass**, answer everything still blank, guessing where
  necessary.

The value of that last rule is computable. With four options and no penalty, a
blind guess is worth 0.25 questions. Ten blanks left unanswered are worth zero;
ten blanks guessed are worth **2.5 questions** on average. If you can eliminate
one option first, each guess is worth 0.33, and ten of those are worth 3.3.
There is no scenario in which leaving an answer blank helps.

## 5.3 How the scoring actually works

Four published facts, and their practical consequences:

| Fact | Consequence for you |
|---|---|
| Raw score is the number of correct answers; there are no deductions for wrong ones | Never leave a blank |
| Raw scores are converted to a scaled score to adjust for small differences between forms | A slightly harder form is not a disadvantage |
| The passing standard is set by subject-matter experts, with no predetermined pass percentage | You are not competing against other candidates |
| Results are reported as pass or fail, usually within 7–10 days, with a diagnostic report if you fail | Plan your retake from the diagnostic, not from memory |

The third row is worth dwelling on, because it changes the psychology. The exam
is criterion-referenced: you are measured against a standard of minimum
competence, not ranked against the room. Nothing anyone else does in the test
centre affects your result, and a form that feels brutal probably felt brutal to
everyone, which is what the scaling exists to handle.

## 5.4 The final-pass protocol

Reserve the last 15 minutes and spend them in this order:

1. **Answer every blank.** Non-negotiable, and it takes two minutes.
2. **Revisit flagged questions where you had a concrete unresolved doubt** — a
   unit you were not sure of, a factor you meant to check. These are the ones
   where a second look has real value.
3. **Leave alone the flagged questions where you simply feel uneasy.** Changing
   an answer without a specific reason is as likely to hurt as help; changing it
   because you have found an actual error is not. The distinction is whether you
   can name what was wrong.

## 5.5 The two-minute reset

If you find yourself stalled — reading the same sentence for the third time,
or calculating something whose purpose you have lost — stop for twenty seconds.
Look away from the screen, breathe, and re-read the question's final sentence,
which is where the actual ask lives. Most stalls are caused by having solved for
the wrong quantity, and twenty seconds spent confirming what is being asked is
the highest-return time on the whole exam. If it is still not moving after that,
mark it and go. Its 174.5 seconds are better spent on the next question, and
you can come back with a clear head and whatever time the checkpoints have
earned you.`,
      examTip: `Memorise three checkpoints — 60 min / Q21, 160 min / Q55, 240 min / Q82 — and check yourself against them. Mid-exam pace auditing has to be recall, not arithmetic; the moment you are doing division under pressure you are already losing time.`,
      importantNote: `There is no penalty for a wrong answer, so a blank is strictly worse than a guess. Ten blind guesses among four options are worth 2.5 questions on average, and 3.3 if you can eliminate one option first. Budget the final two minutes to make sure nothing is left unanswered.`,
    },
    {
      id: 'assumption-audit',
      title: '6. The Assumption Audit — Reading a Formula You Did Not Derive',
      content: `## 6.1 A correct relation is not the same as a correct answer

Everything so far in this chapter has been about *finding* a relation quickly.
This section is about the far more expensive mistake that happens afterwards. A
supplied reference states relations; it does not, and cannot, state whether a
given relation applies to the situation in front of you. That judgement stays
with you, it costs about fifteen seconds, and skipping it is the largest single
producer of confidently wrong answers among candidates who otherwise know the
material.

The failure has a distinctive and unpleasant shape. You do not get stuck. You do
not run out of time. You find something that looks exactly right, substitute
cleanly, obtain a number that is the correct evaluation of that expression,
recognise it among the choices, and move on feeling that the question went well.
Nothing in the process raises a flag. Worse, a plausible wrong answer is usually
sitting there waiting for you, because the alternatives on a well-built question
are frequently the numbers produced by the neighbouring relation — the one whose
hypotheses you failed to check.

Contrast that with running out of ideas, which announces itself immediately and
which you can price and manage with the triage rules of section 5. An unchecked
hypothesis costs you a mark and gives you nothing to notice.

## 6.2 The four-question audit

Before substituting anything into a relation you did not derive yourself, put
four questions to it. Each takes a couple of seconds, and together they cover
most of the failure space on this exam.

1. **What does it assume about the waveform?** Sinusoidal? A single frequency?
   Periodic at all? A large fraction of electrical relations are sinusoidal
   steady-state results wearing general clothing.
2. **What does it assume about the network?** Linear? Balanced? Lumped? In
   steady state, or mid-transient? One energy store, or two?
3. **What does it assume about the sources?** Ideal, or carrying internal
   resistance? Held constant after the switch closes? Independent of the load
   they drive?
4. **What does it assume about periods and prefixes?** Which quantity is per
   period and which is total, and which unit prefix is already baked into the
   constant?

The two cases below each take a relation that is entirely correct and put it in
front of a problem where exactly one of its hypotheses quietly fails.

### Worked Example 6.1 — The Neutral Conductor a Balanced-System Result Says Is Not There

**Given.** A four-wire wye service delivers 208 V line-to-line. Three
single-phase resistive loads are connected line-to-neutral: 3.0 kW on phase a,
5.0 kW on phase b, 4.0 kW on phase c. **Find** the current in the neutral
conductor.

**The trap.** Balanced three-phase results are among the most heavily used
relations in this discipline, and one of them says the three line currents sum
to zero, so the neutral carries nothing. Every symbol in that statement matches
this problem. Its hypothesis does not, because the three loads are unequal.

**Route 1 — phasor sum at the neutral node.** The line-to-neutral voltage is

$$V_{\\mathrm{ph}} = \\frac{V_{LL}}{\\sqrt{3}} = \\frac{208}{\\sqrt{3}} = 120.09\\ \\mathrm{V}$$

A resistive load draws current in phase with its own line-to-neutral voltage, so
each magnitude is simply $P/V_{\\mathrm{ph}}$:

$$I_a = \\frac{3000\\ \\mathrm{W}}{120.09\\ \\mathrm{V}} = 24.98\\ \\mathrm{A}$$

$$I_b = \\frac{5000\\ \\mathrm{W}}{120.09\\ \\mathrm{V}} = 41.64\\ \\mathrm{A}$$

$$I_c = \\frac{4000\\ \\mathrm{W}}{120.09\\ \\mathrm{V}} = 33.31\\ \\mathrm{A}$$

Taking phase a as reference and an a-b-c sequence, the three phase voltages, and
therefore these three currents, sit at $0^\\circ$, $-120^\\circ$ and
$+120^\\circ$. Kirchhoff's current law at the neutral point makes the returning
current the negative of their sum, so what we need is the magnitude of

$$I_a\\angle 0^\\circ + I_b\\angle{-120^\\circ} + I_c\\angle{+120^\\circ}$$

Since each magnitude is proportional to its phase's power, the components can be
resolved in kilowatts and converted once at the end. With
$\\cos 120^\\circ = -0.5000$ and $\\sin 120^\\circ = 0.8660$:

$$\\mathrm{real}: \\quad 3.000 - 0.5000 \\cdot 9.000 = -1.500\\ \\mathrm{kW}$$

$$\\mathrm{imag}: \\quad 0.8660 \\cdot 4.000 - 0.8660 \\cdot 5.000 = -0.866\\ \\mathrm{kW}$$

$$\\sqrt{1.500^{2} + 0.866^{2}} = \\sqrt{3.000} = 1.7321\\ \\mathrm{kW}$$

$$\\lvert I_N \\rvert = \\frac{1732.1}{120.09} = 14.42\\ \\mathrm{A}$$

The angle falls out cleanly as well: the ratio of the two components is
$\\frac{0.866}{1.500} = 0.577$, which is $\\tan 30^\\circ$, so the three line currents
sum to $14.42\\angle{-150.0^\\circ}$ and the neutral returns
$14.42\\angle{+30.0^\\circ}\\ \\mathrm{A}$.

**Route 2 — a power identity that never writes down an angle.** Expanding that
phasor sum symbolically, for three unity-power-factor loads on a balanced
source, collapses the angles entirely and leaves a purely real expression in the
three powers:

$$\\lvert I_N \\rvert = \\frac{1}{V_{\\mathrm{ph}}}\\sqrt{P_a^{2} + P_b^{2} + P_c^{2} - P_aP_b - P_bP_c - P_cP_a}$$

$$P_a^{2} + P_b^{2} + P_c^{2} = (9 + 25 + 16)\\times 10^{6} = 50\\times 10^{6}$$

$$P_aP_b + P_bP_c + P_cP_a = (15 + 20 + 12)\\times 10^{6} = 47\\times 10^{6}$$

$$\\lvert I_N \\rvert = \\frac{\\sqrt{3\\times 10^{6}}}{120.09} = \\frac{1732.1}{120.09} = 14.42\\ \\mathrm{A}$$

Two routes, one number, and no step shared between them — the second never forms
a complex quantity at all. The neutral carries **14.42 A**, roughly a third of
the heaviest phase current, against the zero the balanced result predicts.

![Neutral current magnitude for a four-wire wye service with 3 kW on phase a and 5 kW on phase b, as the phase-c load is swept from 0 to 8 kW. The solid curve is a phasor sum of the three line currents; the dashed curve is the closed-form power identity, computed without ever forming a phasor. The dotted line at zero is what the balanced-system result predicts for every point on this axis, and it is right at exactly one of them.](/courses/fe-ee/figures/ex2-neutral-unbalance.svg)

The figure makes the shape of the hypothesis visible. The balanced result is not
approximately true off-balance and exactly true on it; it is exactly true at one
point of a continuum and increasingly wrong away from that point, and nothing in
the relation itself tells you where on the axis you are standing. Only the
problem statement does — here, the words "3.0, 5.0 and 4.0 kW".

**Cross-reference.** Balanced and unbalanced wye and delta systems are developed
in \`fee_three_phase\`; three-phase power relations in \`fee_3phase_power\`.

### Worked Example 6.2 — A Peak-to-RMS Factor That Belongs to the Sinusoid, Not to the Problem

**Given.** A symmetric triangular voltage of 10 V peak amplitude drives a 50
$\\Omega$ resistor. **Find** the average power delivered.

**The trap.** The factor $1/\\sqrt{2}$ between peak and RMS is so familiar that
it stops reading as a result about sinusoids and starts reading as the
definition of RMS. It is not. It is what the defining integral evaluates to for
one particular shape.

$$P_{\\mathrm{assumed}} = \\frac{(10/\\sqrt{2})^{2}}{50} = \\frac{50.00}{50} = 1.000\\ \\mathrm{W}$$

**Route 1 — the defining integral.** RMS is defined by

$$V_{\\mathrm{rms}}^{2} = \\frac{1}{T}\\int_{0}^{T} v^{2}(t)\\,dt$$

By quarter-wave symmetry the mean square over a full period equals the mean
square over the first quarter, where the triangle is the straight line
$v(t) = 4V_m t / T$:

$$V_{\\mathrm{rms}}^{2} = \\frac{4}{T}\\int_{0}^{T/4}\\left(\\frac{4V_m t}{T}\\right)^{2}dt = \\frac{4}{T}\\cdot\\frac{16V_m^{2}}{T^{2}}\\cdot\\frac{(T/4)^{3}}{3} = \\frac{V_m^{2}}{3}$$

$$V_{\\mathrm{rms}} = \\frac{V_m}{\\sqrt{3}} = \\frac{10}{\\sqrt{3}} = 5.7735\\ \\mathrm{V}$$

$$P_{\\mathrm{true}} = \\frac{V_{\\mathrm{rms}}^{2}}{R} = \\frac{33.333}{50} = 0.6667\\ \\mathrm{W}$$

**Route 2 — a time-density argument with no integral over time.** A symmetric
triangle ramps at constant rate, so it spends equal time inside every equal band
of level between $-V_m$ and $+V_m$. Its amplitude is therefore uniformly
distributed over that interval, and the mean square of a quantity uniform on
$[-a, a]$ is

$$\\overline{v^{2}} = \\frac{1}{2a}\\int_{-a}^{a} u^{2}\\,du = \\frac{a^{2}}{3}$$

which returns $V_m^{2}/3$ without any reference to the time axis. The two routes
share no algebra: one integrates a ramp in time, the other counts how long the
waveform spends at each level. The figure generator behind this chapter adds a
third check, sampling one period and averaging the squares numerically.

$$\\frac{P_{\\mathrm{assumed}}}{P_{\\mathrm{true}}} = \\frac{1.000}{0.6667} = 1.500$$

Assuming the sinusoid overstates the delivered power by half. That is not a
rounding-level error you might catch on a sanity check; it is a different
answer, and it will be on the list of choices.

![Ratio of RMS to peak for a family of periodic waveforms that morphs continuously from a square wave to a triangle, parameterised by the fraction of a quarter period spent ramping. The solid curve is the closed form; the dots are numerical quadrature over one sampled period. The dashed line marks 0.7071, which is the value for a sinusoid alone and coincides with this family only near a ramp fraction of about three quarters.](/courses/fe-ee/figures/ex2-waveshape-rms.svg)

**Cross-reference.** RMS values, average power and the power triangle are
developed in \`fee_ac_power\`; the phasor machinery that assumes a sinusoid in
the first place is in \`fee_ac_phasors\`.

## 6.3 The hypotheses worth knowing cold

These are the relations whose hypotheses are most often violated by FE-style
problems, in the sense that the problem is deliberately constructed just outside
them. Learn the middle column, not the left one — you will be given the left one.

| Relation you will be given | Hypothesis that must hold | What a violation does | Chapter |
|---|---|---|---|
| Total power from line quantities and a single angle | Balanced load, sinusoidal steady state | An unbalanced load has no single line current and no single angle | \`fee_3phase_power\` |
| Peak divided by root two gives RMS | The waveform is a sinusoid | Every other shape has its own factor; see Worked Example 6.2 | \`fee_ac_power\` |
| Power factor equals the cosine of the phase angle | One frequency only | With harmonics present the true power factor is lower than the displacement cosine | \`fee_pf_correction\` |
| Capacitive and inductive reactance | Sinusoidal steady state at one frequency | Says nothing about the first microseconds after a switching event | \`fee_ac_phasors\` |
| Closed-loop gain from a resistor ratio | Ideal amplifier, ideal source, negative feedback intact | A source with output resistance changes the ratio; see Worked Example 10.1 | \`fee_opamp\` |
| Thevenin and Norton equivalents | The portion being reduced is linear | A diode or a saturating machine inside the box invalidates the reduction | \`fee_network_theorems\` |
| Single exponential approach to a final value | One energy store, source constant after the switching instant | Two stores make it second order, with possible overshoot | \`fee_transients\` |
| Twenty decibels per decade per pole | Minimum phase, poles well separated | Nearby poles and right-half-plane zeros break the asymptotic sketch | \`fee_bode_sketching\` |
| Sample above twice the highest frequency | The signal is strictly band-limited | Real signals need a guard band and an anti-alias filter | \`fee_signal_nyquist\` |
| Uniform-series interest factors | The rate is per period and the count is of the same periods | An annual rate with monthly periods; see Worked Example 8.2 | \`fee_tvm\` |

## 6.4 Making the audit a reflex

The audit only helps if it happens automatically, which means practising it as a
separate motion rather than hoping it emerges from doing problems. Two drills
work.

**Name the hypothesis out loud.** For every relation you look up while
practising, say the sentence "this holds provided that…" before you substitute.
It feels laborious for about a week and then compresses into a glance.

**Collect your own violations.** Every time you get a practice question wrong,
sort the cause into one of three bins: you did not know the relation, you knew it
and mis-evaluated it, or you knew it and applied it outside its hypotheses. The
third bin is the one this section addresses, and for most candidates with a
sound undergraduate background it is much the largest. Its contents are also
highly personal, which is why a generic list — including the one above — is a
starting point rather than a substitute.`,
      examTip: `The alternatives on a well-built question are often the numbers you get from the neighbouring relation. That means a wrong answer that "looks right in the list" is weak evidence, not strong evidence. Check the hypothesis before you check the options.`,
      importantNote: `A supplied reference tells you what is true. It cannot tell you what is true HERE. The fifteen seconds spent asking what a relation assumes about the waveform, the network, the sources and the periods is the highest-yield time in the whole solution.`,
    },
    {
      id: 'symbol-reconciliation',
      title: '7. Symbol Reconciliation — Your Notation and the Reference\'s',
      content: `## 7.1 A mis-mapped symbol fails silently

Section 6 dealt with relations applied outside their hypotheses. This section
deals with something narrower and, if anything, harder to catch: a relation
applied inside its hypotheses, to the right problem, with a symbol that means
one thing in your head and a different thing on the page you are reading from.

Notation is not standardised across engineering. It is standardised *within*
communities and textbooks, and the FE draws on several of them at once — circuit
theory, control theory, power engineering, communications and electromagnetics
all reached their present notation independently, and they collide. The result
is that a single Greek letter can mean four different things in four different
subsections of the same discipline, and that the reference you are handed will
sometimes use the convention your professor did not.

What makes this failure mode expensive is that it produces a number. A wrong
hypothesis at least sometimes yields something absurd; a wrong symbol map yields
a clean, plausible, precisely wrong result, and you have no reason to look at it
twice. The defence is mechanical: **before substituting, name every symbol in
the relation and confirm that your quantity is the same physical thing with the
same units.** Units are the tell, and they are free to check.

### Worked Example 7.1 — Two Damping Symbols, One Response

**Given.** A series RLC circuit has $R = 20\\ \\Omega$, $L = 10\\ \\mathrm{mH}$
and $C = 25\\ \\mu\\mathrm{F}$, driven by a voltage step. **Find** the damped
oscillation frequency and the percent overshoot of the capacitor voltage.

**The collision.** Circuit theory usually parameterises the second-order
response with the Neper frequency $\\alpha$ and the undamped natural frequency
$\\omega_0$. Control theory usually parameterises the identical response with a
dimensionless damping ratio $\\zeta$ and a natural frequency $\\omega_n$. Both
sets are standard, both may appear in the same reference within a few pages of
each other, and a candidate who carries a number from one set into a relation
written for the other gets a clean wrong answer.

**Building both symbol sets.**

$$\\alpha = \\frac{R}{2L} = \\frac{20}{0.020} = 1000\\ \\mathrm{s}^{-1}$$

$$\\omega_0 = \\frac{1}{\\sqrt{LC}} = \\frac{1}{\\sqrt{2.5\\times 10^{-7}}} = 2000\\ \\mathrm{rad/s}$$

$$\\zeta = \\frac{\\alpha}{\\omega_0} = \\frac{1000}{2000} = 0.5000$$

Note immediately what the units are doing. $\\alpha$ carries reciprocal seconds;
$\\zeta$ is a pure number. They are numerically equal only by accident and never
interchangeable, and a candidate who writes $\\zeta = 1000$ is asked in the next
step to evaluate $\\sqrt{1 - \\zeta^{2}}$, which is where the error would surface
if anyone looked.

**Route 1 — the circuit-theory form.**

$$\\omega_d = \\sqrt{\\omega_0^{2} - \\alpha^{2}} = \\sqrt{4\\times 10^{6} - 1\\times 10^{6}} = 1732\\ \\mathrm{rad/s}$$

$$M_p = \\exp\\left(\\frac{-\\pi\\alpha}{\\omega_d}\\right) = \\exp\\left(\\frac{-3141.6}{1732.1}\\right) = 0.1630$$

**Route 2 — the control-theory form.**

$$\\omega_d = \\omega_0\\sqrt{1 - \\zeta^{2}} = 2000\\sqrt{0.7500} = 1732\\ \\mathrm{rad/s}$$

$$M_p = \\exp\\left(\\frac{-\\pi\\zeta}{\\sqrt{1 - \\zeta^{2}}}\\right) = \\exp(-1.8138) = 0.1630$$

The two forms are the same relation written in two alphabets, and they agree to
every printed digit: **1732 rad/s and 16.30% overshoot**. That agreement is the
point of the exercise. If you can produce a result in both notations, you have
proved that your symbol map is right, and the check costs about twenty seconds.

Two derived quantities behave the same way, which is worth knowing because they
are asked for more often than the overshoot itself:

$$t_p = \\frac{\\pi}{\\omega_d} = \\frac{3.1416}{1732.1} = 1.814\\ \\mathrm{ms}$$

$$t_s \\approx \\frac{4}{\\alpha} = \\frac{4}{1000} = 4.000\\ \\mathrm{ms} \\quad\\text{and}\\quad t_s \\approx \\frac{4}{\\zeta\\omega_0} = \\frac{4}{1000} = 4.000\\ \\mathrm{ms}$$

![Step response of the series RLC capacitor voltage for the circuit of Worked Example 7.1, normalised to its final value. The marked peak sits 16.30% above unity, a figure computed independently from the circuit-theory pair and from the control-theory pair and confirmed against the actual maximum of the sampled response. The dotted curve is the decaying envelope set by the Neper frequency, and the annotation lists both symbol sets side by side.](/courses/fe-ee/figures/ex2-notation-second-order.svg)

**Cross-reference.** The second-order transient itself is developed in
\`fee_transients\`; the control-theory vocabulary of overshoot, peak time and
settling time in \`fee_time_specs\`; and the pole locations that unify the two in
\`fee_pzmap_analysis\`.

### Worked Example 7.2 — A Decibel That Is Not the Decibel You Want

**Given.** A receiver is specified to work down to an input level of
$-80\\ \\mathrm{dBm}$ at a $50\\ \\Omega$ input. **Find** the corresponding RMS
input voltage.

**The collision.** Decibels come in a power flavour, with a factor of ten in
front of the logarithm, and an amplitude flavour, with a factor of twenty. Both
are correct. Which one applies depends on whether the ratio inside the logarithm
is a power ratio or an amplitude ratio, and the reference will list both because
both are needed. On top of that, dBm carries a hidden reference of one
milliwatt, and converting it to volts requires an impedance that the decibel
value itself does not contain.

**Route 1 — through the linear power.**

$$P = 1\\ \\mathrm{mW}\\times 10^{-80/10} = 10^{-8}\\ \\mathrm{mW} = 1.0\\times 10^{-11}\\ \\mathrm{W}$$

$$V_{\\mathrm{rms}} = \\sqrt{PR} = \\sqrt{1.0\\times 10^{-11}\\times 50} = \\sqrt{5.0\\times 10^{-10}} = 22.36\\ \\mu\\mathrm{V}$$

**Route 2 — entirely inside the logarithmic domain.** First anchor the two
scales against each other. Zero dBm in 50 $\\Omega$ is one milliwatt, which is

$$V_0 = \\sqrt{10^{-3}\\times 50} = 0.2236\\ \\mathrm{V}$$

$$20\\log_{10}(0.2236) = -13.01\\ \\mathrm{dBV}$$

So the two scales are offset by a fixed 13.01 dB in this impedance, and the
conversion becomes an addition rather than a computation:

$$-80\\ \\mathrm{dBm} \;\\longrightarrow\; -80 - 13.01 = -93.01\\ \\mathrm{dBV}$$

$$V_{\\mathrm{rms}} = 10^{-93.01/20} = 10^{-4.6505} = 2.236\\times 10^{-5}\\ \\mathrm{V}$$

Both routes give **22.36 $\\mu$V**, and they share no step: one multiplies
watts by ohms, the other adds decibels. The second route is also the faster one
if you have to do several levels, which is exactly why the logarithmic scale
exists.

**What the reference cannot supply.** The impedance. A level quoted in dBm is a
power, and no power is a voltage until you say across what. If a problem gives
you dBm and asks for volts without naming an impedance, either the impedance is
elsewhere in the stem or the question wants something else — and noticing that is
faster than searching for a relation that does not exist.

**Cross-reference.** Decibel scales, noise figure and signal-to-noise ratio are
developed in \`fee_noise_snr\`; the logarithmic magnitude axis of a frequency
response in \`fee_bode_sketching\`.

## 7.2 The collisions worth memorising

Every letter below carries at least two standard meanings inside this one
discipline. The right column is the disambiguation that actually works under
time pressure, and it is almost always the units.

| Symbol | Meanings in circulation | How to tell which one you have |
|---|---|---|
| $\\alpha$ | Neper frequency; attenuation constant of a line; common-base current gain | Reciprocal seconds, nepers per metre, and dimensionless respectively |
| $\\beta$ | Common-emitter current gain; phase constant of a line; modulation index | Dimensionless, radians per metre, dimensionless |
| $\\zeta$ vs $\\alpha$ | Damping ratio vs Neper frequency | $\\zeta$ is a pure number; $\\alpha$ has units |
| $\\rho$ | Resistivity; volume charge density; reflection coefficient magnitude | Ohm-metres, coulombs per cubic metre, dimensionless |
| $\\eta$ | Efficiency; intrinsic impedance of a medium | Dimensionless vs ohms |
| $\\mu$ | Permeability; the prefix micro; a distribution mean | A leading $\\mu$ attached to a unit is the prefix, never permeability |
| $Q$ | Quality factor; reactive power; electric charge | Dimensionless, VAR, coulombs |
| $\\omega_0$ vs $f_0$ | Radian frequency vs cyclic frequency | A factor of $2\\pi$; radian forms appear in transfer functions, cyclic forms in specifications |
| $\\log$ vs $\\ln$ | Base ten vs base e | In electrical work an unqualified $\\log$ is base ten; decibels are always base ten |
| $j$ vs $i$ | The imaginary unit | This discipline reserves $i$ for current and uses $j$ |
| Turns ratio | Primary over secondary, or the reverse | Decide from which side the relation puts it on, not from the letter |

## 7.3 Subscripts carry as much meaning as the letters

The commonest reconciliation failure on this exam is not a Greek letter at all.
It is a subscript that distinguishes two quantities differing by a fixed factor,
where dropping the subscript loses the factor and gains a plausible answer.

- **Line against phase.** A voltage or current in a three-phase system is one or
  the other, and they differ by $\\sqrt{3}$ in one of them depending on the
  connection. The relation you look up will be written for one of them.
- **Peak against RMS.** These differ by a shape-dependent factor, as Worked
  Example 6.2 showed. Amplitude specifications tend to be peak; power
  specifications are essentially always RMS.
- **Per-unit against actual.** Per-unit quantities are dimensionless and refer to
  a stated base. A per-unit impedance dropped into a relation expecting ohms is
  wrong by the base impedance, which is rarely close to one.
- **Instantaneous against average against apparent.** Lower-case $p(t)$,
  upper-case $P$ and $S$ are three different quantities with three different
  units, and the power triangle relates them only under the sinusoidal
  assumption.

**The habit that fixes this**: when you copy a relation onto your scratch
material, copy the subscripts with it, and write your own given quantities using
the *same* subscripts before you substitute. If you cannot decide which
subscript one of your givens deserves, that is the question to resolve — and it
is a question about the problem statement, not about the reference.

**Cross-reference.** Line and phase quantities are developed in
\`fee_three_phase\`; per-unit normalisation in \`fee_per_unit\`; apparent, real
and reactive power in \`fee_ac_power\`.`,
      examTip: `Units disambiguate symbols for free. If a relation wants a dimensionless damping ratio and your number is in reciprocal seconds, you have caught the error before it costs anything. Make the units check part of copying the relation down, not part of checking the answer.`,
      importantNote: `A decibel value alone never determines a voltage. dBm is a power referenced to one milliwatt, and turning a power into a voltage needs an impedance, which is a fact about the circuit and not about the decibel scale.`,
    },
    {
      id: 'units-before-substitution',
      title: '8. Units, Prefixes and Periods — the Conversions That Come First',
      content: `## 8.1 What a formula reference is entitled to assume

A reference states relations in a coherent system of units and then, quite
reasonably, says nothing further about it. Whether your particular numbers are
already in that system is your problem, and the exam knows it: quantities in a
question stem arrive dressed in whatever prefix an engineer would actually use.
Capacitance turns up in microfarads, inductance in millihenries, resistance in
kilohms, power in kilowatts or megavolt-amperes, frequency in hertz when the
relation wants radians per second, and interest as an annual percentage when the
factor wants a rate per month.

None of that is a trick. It is what practice looks like. But it means that the
step between finding a relation and substituting into it is a real step with its
own failure mode, and the failure is quiet: prefixes are powers of ten, so a
prefix error moves the answer by a clean factor that still looks like a
number an engineer might write down.

The two examples below take the two commonest forms of the error. The first is a
prefix product, where the right answer is available almost for free once you have
done the arithmetic on the prefixes themselves. The second is a period mismatch,
where the units are not physical at all but temporal, and where the reference is
completely silent because nothing in the relation names a month.

## 8.2 Do the prefix arithmetic once, in advance

Products of prefixed units recur constantly, and each one is worth converting to
a single memorised fact rather than re-deriving under time pressure. The
mechanics are trivial — powers of ten add — and the payoff is that a whole class
of substitution becomes a two-digit multiplication.

| Product or quotient | Powers of ten | Result | Typical use |
|---|---|---|---|
| $\\mathrm{k\\Omega} \\times \\mu\\mathrm{F}$ | $10^{3}\\times 10^{-6}$ | milliseconds | RC time constants |
| $\\mathrm{M\\Omega} \\times \\mu\\mathrm{F}$ | $10^{6}\\times 10^{-6}$ | seconds | Long timing networks |
| $\\mathrm{mH} \\times \\mu\\mathrm{F}$ | $10^{-3}\\times 10^{-6}$ | $10^{-9}\\ \\mathrm{s}^{2}$ | $\\sqrt{LC}$ gives microseconds |
| $\\mathrm{V} / \\mathrm{k\\Omega}$ | $10^{0}/10^{3}$ | milliamperes | Every divider and bias network |
| $\\mathrm{V} / \\mathrm{M\\Omega}$ | $10^{0}/10^{6}$ | microamperes | Op-amp input and leakage currents |
| $\\mathrm{mA} \\times \\mathrm{k\\Omega}$ | $10^{-3}\\times 10^{3}$ | volts | Working a whole network in mA and k$\\Omega$ |
| $\\mathrm{kW} / \\mathrm{V}$ | $10^{3}/10^{0}$ | kiloamperes, so watch it | Service currents; convert to W first |
| $\\mathrm{mH} \\times \\mathrm{A}$ | $10^{-3}$ | millivolt-seconds | Flux linkage and $L\\,di/dt$ |

The sixth row deserves a moment. If every resistance in a DC network is written
in kilohms and every current in milliamperes, then every voltage comes out in
volts with no conversion anywhere, because the two prefixes cancel. Adopting
that convention for divider and bias problems removes an entire category of
error and saves keystrokes as well.

### Worked Example 8.1 — Kilohms Times Microfarads

**Given.** A 15 V source charges an initially uncharged 4.7 $\\mu$F capacitor
through a 22 k$\\Omega$ resistor, with the switch closing at $t = 0$. **Find**
the time at which the capacitor voltage reaches 10 V.

**Route 1 — convert everything to base units first.**

$$\\tau = RC = (22\\times 10^{3})(4.7\\times 10^{-6}) = 0.1034\\ \\mathrm{s}$$

The single-time-constant response for a capacitor starting from zero is

$$v_C(t) = V_s\\left(1 - e^{-t/\\tau}\\right)$$

Setting $v_C = 10$ with $V_s = 15$ leaves the deficit at one third of its
initial value:

$$e^{-t/\\tau} = 1 - \\frac{10}{15} = 0.3333 \;\\Longrightarrow\; \\frac{t}{\\tau} = \\ln 3 = 1.0986$$

$$t = 0.1034 \\times 1.0986 = 0.1136\\ \\mathrm{s} = 113.6\\ \\mathrm{ms}$$

**Route 2 — work in the prefixed units and bracket the answer.** Because
kilohms times microfarads is milliseconds, the time constant is available
directly as a two-digit product:

$$\\tau = 22 \\times 4.7 = 103.4\\ \\mathrm{ms}$$

Now instead of taking a logarithm, bracket the crossing with two landmark
values of the exponential, which is a check you can do without a calculator:

$$v_C(\\tau) = 15 \\times 0.63212 = 9.4818\\ \\mathrm{V}$$

$$v_C(1.1\\tau) = 15 \\times 0.66713 = 10.007\\ \\mathrm{V}$$

The target sits between them, so $t$ lies between 103.4 ms and 113.7 ms — which
already eliminates every alternative differing by a factor of ten. Interpolating
linearly across that short interval,

$$\\frac{0.5182}{0.5252} = 0.9867 \;\\Longrightarrow\; t \\approx 103.4 + 0.9867 \\times 10.34 = 113.6\\ \\mathrm{ms}$$

Both routes land on **113.6 ms**, and the second never evaluated a natural
logarithm. Note what the bracket bought: even if the interpolation had been
skipped entirely, the bracket alone is decisive against alternatives at 11.4 ms,
113.6 ms and 1.136 s, which is the usual way a prefix trap is offered.

![Charging of a 4.7 microfarad capacitor through 22 kilohms from a 15 V source, with the time axis in milliseconds because kilohms times microfarads is milliseconds. The dashed line marks the 10 V target and the highlighted point its crossing at 113.6 ms, equal to the time constant multiplied by the natural logarithm of three. The two smaller points are the bracketing landmarks at one and one-point-one time constants, whose voltages straddle the target.](/courses/fe-ee/figures/ex2-prefix-rc.svg)

**Cross-reference.** First-order charging and discharging, and the meaning of
the time constant, are developed in \`fee_transients\`.

### Worked Example 8.2 — A Rate Per Period and a Count of the Same Periods

**Given.** \\$12,000 is borrowed at a nominal annual rate of 9% compounded
monthly and repaid in 48 equal monthly payments. **Find** the payment.

**The silence in the reference.** Uniform-series interest factors are written
with a rate $i$ and a count $n$. Nothing in that notation says what a period is;
the relation is agnostic, and correctly so. Making $i$ and $n$ refer to the
*same* period is entirely the reader's job, and a problem that quotes an annual
rate alongside monthly payments is testing precisely that.

**Route 1 — the capital-recovery factor.** Compounding is monthly, so the period
is a month:

$$i = \\frac{0.09}{12} = 0.007500 \\quad\\text{per month}, \\qquad n = 48$$

$$(1 + i)^{n} = 1.007500^{48} = 1.431405$$

$$A = P\\,\\frac{i(1+i)^{n}}{(1+i)^{n} - 1} = 12000 \\times \\frac{0.007500 \\times 1.431405}{0.431405}$$

$$A = 12000 \\times 0.0248850 = 298.62$$

The payment is \\$298.62 per month.

**Route 2 — discount the payments back and see whether the principal returns.**
This is a genuinely different computation: it uses the series present-worth
factor rather than the capital-recovery factor, and it starts from the answer
rather than from the loan.

$$P = A\\,\\frac{1 - (1+i)^{-n}}{i} = 298.62 \\times \\frac{1 - 0.698614}{0.007500}$$

$$P = 298.62 \\times 40.1848 = 12000$$

The principal comes back, so the payment is right.

**What the period error costs.** A reader who takes the quoted 9% as the rate
and four years as the count computes

$$A_{\\mathrm{yr}} = 12000 \\times \\frac{0.09 \\times 1.41158}{0.41158} = 12000 \\times 0.30867 = 3704$$

which is \\$3,704 per year.
Divided over twelve months that is \\$308.67 — about 3.4% high, close enough
to look reasonable and far enough to be a distinct choice. The error has two
independent parts, and it is worth separating them: the rate was not converted
to the compounding period, and the count was expressed in a different period
from the rate. Either alone produces a wrong answer.

**The rate you would actually quote.** Because compounding happens twelve times
a year, the effective annual rate is not the nominal 9%:

$$i_{\\mathrm{eff}} = (1.007500)^{12} - 1 = 1.093807 - 1 = 0.093807$$

So 9.38% effective against 9% nominal. If a problem asks for an effective rate
and you hand back the nominal one, no relation was misapplied and no arithmetic
was wrong — only a definition went unchecked.

**Cross-reference.** Compound-interest factors, nominal and effective rates and
cash-flow diagrams are developed in \`fee_tvm\`; comparative economic analysis in
\`fee_cost_analysis\`.

## 8.3 The unit-first protocol

Four steps, in this order, every time. They take about fifteen seconds and they
subsume most of what this section is about.

1. **Write the givens with their units, in a column, before doing anything
   else.** Not in your head. The act of writing "4.7 $\\mu$F" rather than "4.7"
   is what makes the prefix visible later.
2. **Decide the working system and convert once.** Either everything in base SI,
   or everything in a consistent prefixed system such as milliamperes and
   kilohms. Mixing is where errors live.
3. **Carry units through the substitution.** If the units of the result are not
   the units of the answer, stop; you have found an error for free, and you have
   found it before committing to a choice.
4. **Check the answer's prefix against the alternatives.** When the choices
   differ by factors of ten, they are testing the conversion rather than the
   physics, and you can often settle the question by prefix arithmetic alone.

## 8.4 Conversions that recur, and one that is not a conversion

Beyond prefixes, a handful of conversions turn up often enough to be worth
holding rather than looking up: radian and cyclic frequency differ by $2\\pi$;
one horsepower is 745.7 W; a temperature *difference* is the same number in
kelvin and in degrees Celsius while a temperature is not; and apparent power in
kilovolt-amperes becomes real power in kilowatts only after multiplication by
the power factor.

The last one is not a unit conversion at all, and that is exactly why it is
listed here. Kilovolt-amperes and kilowatts have the same dimensions and
different meanings, so no dimensional check will ever catch the substitution of
one for the other. It has to be caught by knowing what the quantities are —
which is the subject of section 10.`,
      examTip: `When the alternatives differ by factors of ten, the question is testing your prefix arithmetic, not your physics. Bracketing the answer to within a decade is often enough to choose, and it is much faster than a careful evaluation.`,
      importantNote: `Interest factors are written with a rate and a count and no statement of what a period is, because the relation does not care. Making the rate and the count refer to the same period is entirely your responsibility, and a nominal annual rate with monthly compounding is the standard way that responsibility is tested.`,
    },
    {
      id: 'verification-routes',
      title: '9. Verifying a Result You Did Not Derive',
      content: `## 9.1 Four checks, ordered by what they cost

You have just produced a number from a relation you found two minutes ago and
have never derived. What would make you believe it? There are four answers, and
they differ by an order of magnitude in cost, so the order in which you reach
for them matters as much as knowing them.

**Dimensional analysis — free.** Carry the units through the substitution and
look at what comes out. This catches inverted ratios, missing or extra factors
that carry units, and the wrong relation entirely, and it costs nothing because
you were writing the units down anyway under the protocol of section 8. It
cannot catch a wrong dimensionless factor, and it cannot distinguish two
quantities that share dimensions — watts and volt-amperes, torque and energy.

**Limiting cases — about ten seconds.** Push one parameter to zero or to
infinity and ask whether your expression does the obvious thing. Open-circuit
the load; short it; take the frequency to zero and to infinity; set the coupling
to unity. This is the single most informative check available, because it tests
the *structure* of your result rather than its arithmetic, and structure is where
the expensive errors live.

**Order of magnitude — about five seconds.** Round every input to one
significant figure and redo the calculation in your head. This catches keystroke
errors and misplaced prefixes, which together account for a large share of wrong
answers among candidates who understood the problem perfectly.

**A second route — one to two minutes.** Solve the problem again by a method
that shares no step with the first. This is conclusive and expensive, which is
why it is last: it costs most of a question's budget, and section 11 works out
when that trade is worth making.

The important discipline is the phrase *shares no step*. Recomputing the same
expression on the calculator is not a second route; it repeats every conceptual
error and only catches typing. A second route has to enter the problem somewhere
else.

### Worked Example 9.1 — One Number, Four Confirmations

**Given.** A 24 V source feeds a divider of 6 k$\\Omega$ (upper) and 3 k$\\Omega$
(lower). A 6 k$\\Omega$ load is then connected across the lower resistor.
**Find** the voltage across the load.

**Route A — combine, then divide.**

$$R_{\\mathrm{eq}} = \\frac{3 \\times 6}{3 + 6} = \\frac{18}{9} = 2.000\\ \\mathrm{k\\Omega}$$

$$V_L = 24 \\times \\frac{2}{6 + 2} = 24 \\times 0.2500 = 6.000\\ \\mathrm{V}$$

**Route B — Thevenin equivalent, looking back from the load.** This route never
forms a parallel combination of the load with anything; it removes the load
first.

$$V_{\\mathrm{th}} = 24 \\times \\frac{3}{9} = 8.000\\ \\mathrm{V}, \\qquad R_{\\mathrm{th}} = \\frac{6 \\times 3}{6 + 3} = 2.000\\ \\mathrm{k\\Omega}$$

$$V_L = 8 \\times \\frac{6}{6 + 2} = 8 \\times 0.7500 = 6.000\\ \\mathrm{V}$$

**Route C — a node equation, which uses no equivalent circuit at all.** Working
in volts, milliamperes and kilohms, so that no prefix conversion appears
anywhere:

$$\\frac{24 - v}{6} = \\frac{v}{3} + \\frac{v}{6}$$

Multiplying through by 6 gives $24 - v = 2v + v$, so $v = 6.000\\ \\mathrm{V}$.

**Route D — a current balance, which is a check rather than a solution.** If the
answer is 6 V, then the load draws 1 mA and the 3 k$\\Omega$ resistor draws 2 mA,
so the upper resistor carries 3 mA and drops

$$3 \\times 6 = 18\\ \\mathrm{V}, \\qquad 24 - 18 = 6\\ \\mathrm{V}$$

which is consistent. This kind of check is cheap because it runs *forward* from
the answer instead of solving again, and it catches an arithmetic slip anywhere
in the chain.

**And the three free checks.** Dimensionally, a voltage multiplied by a ratio of
resistances is a voltage, which is what came out. As a limiting case, an
infinite load returns the unloaded divider value of 8 V and a zero load returns
0 V, so any correct answer lies strictly between them and 6 V does. By order of
magnitude, loading a divider with a resistance twice the lower leg should pull
the output down noticeably but not collapse it, and 8 V falling to 6 V is
exactly that.

![Load voltage against load resistance for the divider of Worked Example 9.1, over four decades of load, computed three ways: by parallel combination, by Thevenin equivalent, and by solving a node equation. The three curves coincide everywhere. The dotted line at 8 V is the unloaded limiting case that any correct answer must approach as the load resistance grows, and the marked point is the 6 kilohm load giving 6.00 V.](/courses/fe-ee/figures/ex2-loading-routes.svg)

The figure is worth a moment even though the arithmetic is elementary, because
it shows what a limiting case actually is. The 8 V asymptote is not an
approximation to the answer; it is a value the expression is *required* to
approach, derivable without solving the problem, and therefore a constraint you
can impose on a candidate answer before you trust it.

**Cross-reference.** Dividers, node analysis and current balance are developed in
\`fee_dc_fundamentals\`; Thevenin and Norton reductions in
\`fee_network_theorems\`.

## 9.2 Limiting cases worth having ready

The check only helps if a limit comes to mind quickly, so it pays to know the
standard ones by heart rather than inventing one under pressure.

| Push this to a limit | And the result should | Because |
|---|---|---|
| Load resistance to infinity | Return the unloaded, open-circuit value | No current is drawn, so no loading drop appears |
| Load resistance to zero | Give zero volts across the load, and short-circuit current | The load holds its terminals together |
| Frequency to zero | Make capacitors open and inductors short | Reactances go to infinity and to zero respectively |
| Frequency to infinity | Make capacitors short and inductors open | The reverse of the above |
| Damping ratio to zero | Give sustained oscillation and 100% overshoot | Nothing removes energy from the resonance |
| Damping ratio to one | Give the fastest response without overshoot | The two poles meet on the real axis |
| Coupling coefficient to one | Recover the ideal transformer relations | No leakage flux remains |
| Feedback gain to infinity | Make closed-loop response depend only on the feedback network | The forward path stops mattering |
| Interest rate to zero | Make present worth the plain sum of the cash flows | No discounting occurs |
| Number of periods to infinity | Make a uniform series approach a perpetuity value | The tail contributes negligibly |

Two of these are worth using habitually because they are so cheap. Any answer
involving a loaded network can be bracketed instantly between its no-load and
short-circuit values, and any answer involving a reactive network can be
bracketed between its zero-frequency and infinite-frequency behaviour. Both
brackets are usually enough to eliminate half the choices.

## 9.3 What dimensional analysis will and will not catch

Dimensional analysis is the cheapest check and the most over-trusted. It will
reliably catch an inverted ratio, a relation applied to the wrong quantity, and
a term that should not be in a sum. It will never catch a factor of $2\\pi$, a
factor of $\\sqrt{3}$, a sign, or the substitution of one quantity for another
with the same dimensions.

That last category is worth a list, because this discipline is unusually full of
it: real, reactive and apparent power all reduce to the same dimensions; torque
and energy do; a time constant and a period do; resistance, reactance and
impedance magnitude do. When two quantities are dimensionally identical and
physically different, only the definition separates them, and definitions are the
one thing a reference *can* supply — provided you notice you need one.

## 9.4 Choosing which check to run

In the budget of section 5, a question gets about 174 seconds and roughly a
quarter of that is set aside for verification. That buys the three free checks
comfortably, and it does not buy a second route. So the working rule is: run
dimensions, a limit and an order-of-magnitude estimate on **every** question,
and spend a second route only where a specific doubt survives all three. If a
result passes all three checks, the probability that a second route changes it is
low enough that the time is better spent elsewhere — which is an argument section
11 makes with numbers.`,
      examTip: `A second look at your own arithmetic is not verification; it repeats every conceptual error you already made. Verification means entering the problem somewhere else — a different equivalent circuit, a different conservation law, a limiting case.`,
      importantNote: `Limiting cases test structure, not arithmetic, which is why they catch the expensive errors. Bracketing a loaded network between its open-circuit and short-circuit values takes about ten seconds and usually eliminates half the alternatives.`,
    },
    {
      id: 'beyond-the-reference',
      title: '10. What a Supplied Reference Cannot Give You',
      content: `## 10.1 The boundary, stated plainly

A formula reference contains relations. It does not contain problems, and the
distance between a relation and a solved problem is where nearly all the
difficulty of this exam lives. It is worth being explicit about what falls on
your side of that boundary, because candidates who believe the reference will
carry them tend to under-prepare exactly these things.

**The setup.** Which node to write the equation at, which loop to take, which
part of the circuit to reduce to an equivalent and which to leave alone, whether
superposition is available, whether a transient has one energy store or two.
Nothing in a table of relations tells you this, and a wrong setup cannot be
rescued by a correct relation.

**Which relation applies.** The whole of section 6.

**The idealisations baked into a relation.** Some hypotheses are stated; others
are so standard that they are simply assumed by whoever wrote the relation down.
An amplifier gain written as a resistor ratio assumes an ideal source, and that
assumption is invisible because there is no symbol in the expression that stands
for the thing being assumed. Worked Example 10.1 is exactly this case.

**Intermediate derivations.** Real problems chain two or three relations
together, and the chaining is yours. A reference may give you a reactance and a
power relation without giving you the composite you actually need.

**Definitions.** As section 9.3 noted, quantities that share dimensions are
separated only by what they mean.

**Recognition.** Seeing that a network is a bridge, that a waveform is not a
sinusoid, that a specification is peak rather than RMS, that a question about a
"conductor sized for the neutral" is really the unbalanced-load question of
Worked Example 6.1. Recognition is pattern memory, it is built only by working
problems, and it is the fastest thing in your whole solution when you have it.

**Judgement about professional conduct.** Ethics questions are not formula
questions; they turn on a rule structure and on reasoning about obligations. See
\`fee_codes_ethics\` and \`fee_licensure\`.

### Worked Example 10.1 — The Ideal Source That Is Not in the Formula

**Given.** An inverting amplifier is built with a feedback resistor of
100 k$\\Omega$ and an input resistor of 10 k$\\Omega$. It is driven by a 0.3 V
signal source whose output resistance is 5 k$\\Omega$. **Find** the output
voltage.

**The naive answer.** The closed-loop gain of an inverting stage is a ratio of
two resistors, so

$$V_o = -\\frac{R_f}{R_{\\mathrm{in}}}V_s = -\\frac{100}{10} \\times 0.3 = -3.000\\ \\mathrm{V}$$

Every symbol in that relation has been matched to a given, the arithmetic is
right, and the answer is wrong by 50%.

**Why.** The relation is derived for a source that holds its stated voltage
whatever current is drawn from it. This source does not: it has 5 k$\\Omega$ in
series with it, and that resistance sits in the same current path as the input
resistor. There is no symbol for it in the expression, so nothing about the
expression can warn you.

**Route 1 — a current balance at the summing node.** In a working inverting
stage with negative feedback intact, the inverting input is held at the same
potential as the non-inverting input, which is ground here. So the entire source
voltage appears across the series combination of the source resistance and the
input resistor:

$$i = \\frac{0.3}{15 \\times 10^{3}} = 20.00\\ \\mu\\mathrm{A}$$

No current enters the amplifier input, so that same current flows through the
feedback resistor, and the output must sit below the summing node by

$$V_o = -iR_f = -(20.00 \\times 10^{-6})(100 \\times 10^{3}) = -2.000\\ \\mathrm{V}$$

**Route 2 — repair the ratio and use the original relation.** The relation is
not wrong; its $R_{\\mathrm{in}}$ means the total resistance between the source's
ideal internal node and the summing node, which here is 15 k$\\Omega$:

$$V_o = -\\frac{R_f}{R_s + R_{\\mathrm{in}}}V_s = -\\frac{100}{15} \\times 0.3 = -2.000\\ \\mathrm{V}$$

$$\\lvert A \\rvert = \\frac{100}{15} = 6.667$$

Both give **-2.000 V**, a gain magnitude of 6.667 rather than 10.

![Closed-loop gain magnitude of an inverting stage with a 100 kilohm feedback resistor and a 10 kilohm input resistor, plotted against the output resistance of the driving source. The solid curve is the corrected resistor ratio and the dots are an independent current balance at the summing node. The dashed line at 10.0 is what the ideal-source relation returns for every source, and the two agree only at the left-hand edge where the source resistance is zero.](/courses/fe-ee/figures/ex2-source-loading.svg)

The figure shows why this is a boundary question rather than an algebra
question. The dashed line is the relation as written; the curve is the circuit
as built. They meet at one point, and that point is a modelling assumption, not
a fact about the problem in front of you.

**A related trap in the same family.** The same reasoning applies at the output.
A gain relation says nothing about how much current the stage can deliver, so a
low-resistance load can invalidate it just as a high-resistance source does —
and again, no symbol in the expression represents the load.

**Cross-reference.** Ideal and non-ideal amplifier models and the standard
configurations are developed in \`fee_opamp\`; source and load resistance, and
maximum power transfer, in \`fee_network_theorems\`.

## 10.2 Looked up against brought with you

| You will be given | You must bring |
|---|---|
| The relation between overshoot and damping | Recognising that this is a second-order system |
| Interest factors | Knowing what a period is in this problem |
| The definition of a decibel | The impedance needed to turn a level into a voltage |
| Thevenin and Norton relations | Choosing where to cut the network |
| Boolean identities | Reading the specification into a truth table |
| Distribution formulas | Deciding which distribution the situation implies |
| Transform pairs | Setting up the differential equation in the first place |
| Line and phase relations | Knowing whether the given quantity is line or phase |
| Filter response forms | Recognising the topology from a schematic |
| Model rules of conduct | Judgement about an actual situation |

Read the right column as a study plan. It is the list of things that no amount
of familiarity with a reference will supply, and therefore the list of things
worth the bulk of your preparation time. The left column is worth exactly as
much preparation as it takes to find each item in five seconds — which is what
sections 1 to 4 of this chapter were about, and not more.

## 10.3 The consequence for how you practise

There is a specific and common way of practising that trains the wrong half of
this. Working problems with the solution visible, following each step and
agreeing with it, builds fluency at *recognising* correct work and no fluency at
*producing* it. The setup — which is the part the reference cannot give you —
gets skipped every time, because the solution has already done it.

The fix is uncomfortable and effective: attempt every problem to a final number
before looking at anything, including when you are fairly sure you cannot finish.
A failed attempt that got the setup right and stalled on algebra is a different
diagnosis from one that never found the setup, and only the attempt distinguishes
them.`,
      examTip: `When a relation contains no symbol for something the problem gives you — a source resistance, a load, a harmonic content — that is a signal, not a coincidence. Either the quantity is genuinely irrelevant or the relation assumes it away. Decide which before substituting.`,
      importantNote: `Practise to a final answer before consulting any solution. Reading a worked solution and agreeing with it trains recognition, not production, and the part it silently does for you — the setup — is precisely the part no reference can supply on exam day.`,
    },
    {
      id: 'lookup-economics',
      title: '11. The Economics of a Look-Up',
      content: `## 11.1 Every second is bought from somewhere

Sections 6 to 9 all recommend spending time: audit the hypothesis, reconcile the
symbols, convert the units, verify the result. Section 5 established that you
have 174.5 seconds a question and no more. Those two facts are in tension, and
resolving it by feel produces the two classic failures — the candidate who
verifies everything and does not finish, and the candidate who finishes early
with a page of confident errors.

The tension resolves cleanly if you notice that time on this exam is a closed
system. There is no such thing as spending an extra minute; there is only moving
a minute from one question to another. So the question is never "is this look-up
worth doing" but "is this look-up worth more than what the same minute buys
elsewhere", and that has an arithmetic answer.

### Worked Example 11.1 — When a Look-Up Becomes a Losing Trade

**Set up the quantities.** Let

- $b = 174.5$ seconds, the per-question budget established in section 1.7;
- $g = 0.25$, the expected value of a blind guess among four alternatives;
- $p$, the probability you answer *this* question correctly if you complete the
  look-up;
- $h$, your baseline hit rate on the questions that the borrowed time displaces;
- $\\Delta t$, the extra seconds the look-up costs beyond the budget.

**The trade.** Completing the look-up moves this question from a guess to a
solve, gaining $p - g$ of a mark. Paying for it displaces $\\Delta t / b$
questions' worth of time at the far end of the exam, each worth $h$. Setting
gain equal to cost gives the break-even:

$$p - g = \\frac{h\\,\\Delta t^{*}}{b} \;\\Longrightarrow\; \\Delta t^{*} = \\frac{b\\,(p - g)}{h}$$

**Route 1 — evaluate in seconds.** Take a look-up you are fairly confident will
settle the question, $p = 0.90$, against a solid baseline, $h = 0.70$:

$$\\Delta t^{*} = \\frac{174.5 \\times 0.65}{0.70} = \\frac{113.4}{0.70} = 162\\ \\mathrm{s}$$

**Route 2 — evaluate in questions, then convert.** The same trade expressed
without ever leaving units of "questions":

$$\\frac{\\Delta t^{*}}{b} = \\frac{p - g}{h} = \\frac{0.65}{0.70} = 0.9286$$

$$\\Delta t^{*} = 0.9286 \\times 174.5 = 162.0\\ \\mathrm{s}$$

So you may spend up to about **162 extra seconds** — roughly nine tenths of a
second question's budget — before the look-up costs you marks. Total time on the
question at break-even is $174.5 + 162 = 336.5$ seconds, a shade under six
minutes, which is a numerical justification for the rule of thumb in section 5.2
that a question still being fought at twice its budget should be marked and
abandoned.

**Two limiting cases, as section 9 recommends.** If the questions you displace
are ones you would answer correctly with certainty, $h = 1$ and the break-even
falls to $b(p-g) = 113$ seconds. If they are ones you would only guess at
anyway, $h = g = 0.25$ and the break-even rises to

$$\\Delta t^{*} = \\frac{174.5 \\times 0.65}{0.25} = 453.7\\ \\mathrm{s}$$

Both limits behave sensibly, which is the check that the expression is put
together correctly.

**Sensitivity, which is where the useful advice is.** Vary one input at a time:

| Change | Break-even | Reading |
|---|---|---|
| $p = 0.90$, $h = 0.70$ | 162 s | The reference case |
| $p = 0.90$, $h = 0.55$ | 206 s | Weak on what remains, so a look-up is cheaper |
| $p = 0.75$, $h = 0.70$ | 125 s | Less certain the look-up converts |
| $p = 0.60$, $h = 0.70$ | 87 s | A speculative search is barely worth a minute |
| $p = 0.90$, $h = 0.25$ | 454 s | Displacing questions you would guess anyway |

![Break-even extra seconds for a look-up, plotted against the baseline hit rate on the questions the borrowed time displaces, for three values of the probability that the look-up actually settles the question. The dashed line marks one whole question budget of 174.5 seconds, and the highlighted point is the reference case of 162 seconds. Every curve is computed in seconds and independently in question-budgets and the two agree.](/courses/fe-ee/figures/ex2-lookup-breakeven.svg)

**The counter-intuitive reading.** The break-even *rises* as $h$ falls, so a long
look-up is more defensible late in the exam than early. Early on, the time you
borrow is taken from questions you would probably have answered; late on, it is
taken from questions you were going to guess at. This inverts the instinct to
hurry as the clock runs down, and it is worth internalising: the panic that
makes candidates rush the last hour is spending exactly the cheapest time they
have.

**The variable that dominates.** Not $h$, and not the budget — it is $p$. Halving
your confidence that the look-up will settle the question roughly halves the time
it is worth. And $p$ is knowable in advance: a look-up you have rehearsed has
$p$ near one and $\\Delta t$ near ten seconds, so it is unconditionally worth
doing. A search for something you have never located before has an unknown $p$
and an unbounded $\\Delta t$, which is the only genuinely bad combination on this
whole table.

## 11.2 Bound the search before you start it

The analysis above assumes $\\Delta t$ is known when you decide, and in the bad
case it is not: open-ended searching has no natural stopping point, which is how
a forty-second look-up becomes four minutes. The remedy is procedural rather
than analytical. **Decide the abandonment rule before you begin**, out loud in
your head: "two search attempts, then I move on." Pre-commitment works here
because the decision is made while you are calm and applied while you are not.

Three rules that follow directly from the arithmetic:

- **Rehearsed look-ups are free.** Anything you have located ten times in
  practice costs seconds and converts near-certainly. This is the entire return
  on the index drill of section 4.
- **One reformulation, then stop.** If a search term returns nothing useful, you
  are allowed exactly one alternative term — the symbol instead of the concept,
  or the unit instead of the name, as section 12 sets out. After that the
  expected $\\Delta t$ has grown faster than $p$.
- **Never search for something you doubt is there.** If you are not confident
  the relation exists in the reference at all, $p$ collapses and no amount of
  time redeems the trade. Reason it out or guess.

## 11.3 What this means for the verification budget

The same arithmetic applies to checking. The three free checks of section 9 —
dimensions, a limit, an order of magnitude — cost perhaps fifteen seconds
combined, which against a 174.5-second budget is under nine per cent, and they
catch a large fraction of errors. That is an overwhelmingly good trade and
should be unconditional.

A full second route costs sixty to ninety seconds. Against a break-even in the
region of 160 seconds it is affordable, but only when it is buying something the
free checks did not: a specific surviving doubt. Running a second route on a
question that already passed all three free checks buys very little and costs
half a question, and the candidates who do it habitually are usually the ones
who do not finish.`,
      examTip: `Decide your abandonment rule before you begin searching, not while you are searching. "Two attempts, then I move on" made in advance survives contact with the clock; the same decision attempted mid-search never does.`,
      importantNote: `The break-even time for a look-up rises as your remaining questions get harder, so a long search is more defensible late in the exam than early. Rushing the final hour spends the cheapest minutes you have.`,
    },
    {
      id: 'searching-by-concept',
      title: '12. Finding a Term When You Do Not Know Its Name',
      content: `## 12.1 The specific difficulty

A searchable reference is only as good as the word you type into it. The
situation this section addresses is narrow and common: you know exactly what
physical quantity you need, you could derive it given ten minutes, and you do
not know what the document calls it. Searching for the concept in the words you
happen to use returns nothing, and the failure feels like ignorance when it is
actually a vocabulary mismatch.

The mismatch has a structural cause. Engineering vocabulary accreted over a
century across several communities, and the same quantity picked up a different
name in each. A quantity may equally be described by what it measures, by how it
is computed, by the person who first wrote it down, or by the ratio it forms —
and a reference will use whichever name was conventional in the sub-discipline
the section came from.

## 12.2 Four search strategies, in the order to try them

**Search the symbol, not the word.** Symbols are far more standardised than
names. If you know the quantity is conventionally written with a particular
letter, and the reference's search covers the text of equations, the symbol is
usually a shorter path than any English word.

**Search the unit.** Units are the most standardised thing in the document.
A quantity you cannot name has a unit you certainly know, and unusual units —
nepers, siemens, weber, volt-amperes reactive — appear in very few places.

**Search a rare co-occurring word rather than the common one.** A search term
that returns forty hits costs more time than scrolling. Proper names attached to
criteria and theorems, uncommon compound words, and specific unit names are
selective; general words such as "power", "current" or "response" are not.

**Search the neighbouring quantity.** If you cannot find a quantity, find
something that must be printed beside it. Relations travel in families, and
landing anywhere in the family puts the whole family on screen.

The order matters because it is roughly the order of decreasing selectivity, and
under the rule of section 11.2 you get about two attempts.

## 12.3 The same quantity under several names

The table below lists quantities that reliably cause this problem, with the
names that circulate for them across the general engineering literature. It is
not a claim about what any particular reference calls them — it is a list of
alternatives to try when the first word fails.

| What you might be looking for | Names in circulation |
|---|---|
| Time to settle inside a tolerance band | Settling time; response time |
| The frequency where response falls by three decibels | Corner frequency; break frequency; cutoff; half-power point |
| Ratio of reflected to incident wave amplitude | Reflection coefficient; related to standing-wave ratio and return loss |
| The slowest pole of a system | Dominant pole; dominant time constant |
| Current gain of a bipolar transistor | Beta; forward current transfer ratio; the h-parameter form |
| Root of the mean of the squares | RMS; effective value; quadratic mean |
| Voltage across an unloaded pair of terminals | Open-circuit voltage; no-load voltage; Thevenin voltage |
| Reciprocal of impedance | Admittance; its parts are conductance and susceptance |
| Interest including intra-year compounding | Effective annual rate; annual equivalent rate |
| Ratio of real to apparent power | Power factor; displacement factor when only the fundamental is meant |
| The resistance a source appears to have | Output resistance; internal resistance; source impedance; Thevenin resistance |
| Number of independent loops in a network | Mesh count; independent loop count; branches minus nodes plus one |
| The opposition a medium offers a propagating wave | Intrinsic impedance; wave impedance |
| Rate of decay of an exponential envelope | Neper frequency; attenuation constant; damping coefficient; reciprocal time constant |

Read the right-hand column as vocabulary to *recognise*, not to memorise. The
purpose is that when a search returns a heading you do not immediately connect
to your problem, you pause rather than scrolling past it.

## 12.4 Building the list that actually helps you

The table above is generic, and the useful version of it is personal. Build it
the same way section 4.3 builds the index: from your own misses.

Every time a search fails during practice, write down two things — the term you
tried, and the term that eventually worked. Nothing else. That pair is worth more
than any generic list because it records a gap in *your* vocabulary, and those
gaps are highly individual: a candidate who studied control theory recently and
electromagnetics four years ago has an entirely different missing vocabulary
from someone with the reverse history.

After thirty or forty practice questions the list stabilises at perhaps a dozen
entries, which is small enough to review in five minutes and specific enough to
matter.

## 12.5 When to stop searching and start deriving

Sometimes the right response to a failed search is to stop searching. A
surprising number of quantities on this exam are two steps from something you
certainly know, and two steps of algebra you can do is faster than a third
search whose outcome you cannot predict.

Cases where deriving beats searching:

- **A ratio you can build from two things you found.** If both parts are on
  screen, the ratio is arithmetic.
- **A special case of a general relation.** Setting a parameter to zero, one, or
  infinity in a relation you already have is usually quicker than finding the
  specialised form.
- **An inverse.** If you found the forward relation, solving it for the other
  variable is algebra, and the reference may not print the inverted form at all.
- **A quantity defined by its own name.** A half-power point is where the power
  halves; an effective value is the value that gives the same heating. Some
  quantities can be reconstructed from their definitions faster than they can be
  located.

**Cross-reference.** The vocabulary above spans most of the course, so the useful
cross-references are the chapters where each family lives:
\`fee_time_specs\` and \`fee_freq_domain\` for response vocabulary,
\`fee_em_tx_lines\` for wave and reflection vocabulary, \`fee_ac_power\` for
power vocabulary, and \`fee_tvm\` for interest vocabulary.`,
      examTip: `Search the unit or the symbol before searching the concept. Units and symbols are far more standardised than names, and an unusual unit appears in very few places in any reference.`,
      importantNote: `A failed search is sometimes a signal to derive rather than to search again. An inverse, a ratio of two things already on screen, or a special case of a relation you have found is often two lines of algebra — and unlike a second search, its cost is known before you start.`,
    },
    {
      id: 'strategy-problem-sets',
      title: '13. Problem Sets',
      content: `Each problem below is an ordinary FE-style calculation wrapped around one of
the reference-use skills this chapter teaches. Work them with a reference open
and a timer running, to the four-step protocol: audit the hypothesis, reconcile
the symbols, convert the units, then verify. Full solutions follow each set.

### Problem Set A — Hypotheses and Symbols

**A1.** A four-wire wye service at 480 V line-to-line supplies three resistive
line-to-neutral loads of 6.0 kW, 6.0 kW and 9.0 kW. Find the current in the
neutral conductor. State which hypothesis of the balanced-system result fails.

**A2.** A symmetric square wave of 12 V peak amplitude, equal time positive and
negative, drives a 100 $\\Omega$ resistor. Find the average power. Then state the
answer a candidate gets by assuming the sinusoidal peak-to-RMS factor, and the
ratio between them.

**A3.** A 10 V source feeds a divider of two 5 k$\\Omega$ resistors. A
5 k$\\Omega$ load is connected across the lower resistor. Find the load voltage,
and give the two limiting values that bracket it.

**A4.** A series RLC circuit has $R = 100\\ \\Omega$, $L = 50\\ \\mathrm{mH}$ and
$C = 0.2\\ \\mu\\mathrm{F}$. Find the Neper frequency, the undamped natural
frequency, the damping ratio and the damped frequency, and classify the
response. Then find the percent overshoot two ways.

**A5.** An amplifier delivers 2.0 W into an 8 $\\Omega$ load when driven by
50 mV RMS. Find the voltage gain in decibels. Explain why the power gain in
decibels cannot be found from the information given.

### Solutions to Problem Set A

**A1.** The hypothesis that fails is balance: the balanced-system result assumes
three equal loads, and these differ.

$$V_{\\mathrm{ph}} = \\frac{480}{\\sqrt{3}} = 277.13\\ \\mathrm{V}$$

Using the power identity of Worked Example 6.1, the sum of squares is
$(36 + 36 + 81)$ and the sum of pairwise products is $(36 + 54 + 54)$, both in
units of kilowatts squared:

$$\\sqrt{(153 - 144)} = 3.000\\ \\mathrm{kW}$$

$$\\lvert I_N \\rvert = \\frac{3000\\ \\mathrm{W}}{277.13\\ \\mathrm{V}} = 10.83\\ \\mathrm{A}$$

*Second route.* As a phasor sum, the two 6 kW phases draw 21.65 A each and the
9 kW phase 32.47 A, giving components $-5.41$ and $+9.37$, whose magnitude is
10.82 A. The routes agree to the printed digits.

**A2.** A symmetric square wave sits at its peak magnitude at every instant, so
its RMS value equals its peak: $V_{\\mathrm{rms}} = 12.00\\ \\mathrm{V}$.

$$P = \\frac{144}{100} = 1.440\\ \\mathrm{W}$$

Assuming the sinusoidal factor gives $12/\\sqrt{2} = 8.485$ V and

$$P_{\\mathrm{assumed}} = \\frac{72}{100} = 0.7200\\ \\mathrm{W}$$

a factor of exactly two low. Note the direction: on a triangle the sinusoidal
assumption was 50% *high*, on a square wave it is 50% low. The error has no fixed
sign, so it cannot be caught by a plausibility check.

**A3.** The load in parallel with the lower resistor is 2.5 k$\\Omega$:

$$V_L = 10 \\times \\frac{2.5}{7.5} = 3.333\\ \\mathrm{V}$$

The bracket is 0 V for a shorted load and 5.000 V for an open one, and 3.333 V
lies inside it. A candidate answering 5.000 V has used the unloaded divider,
which is the open-circuit limit rather than the answer.

**A4.**

$$\\alpha = \\frac{R}{2L} = \\frac{100}{0.1} = 1000\\ \\mathrm{s}^{-1}$$

$$\\omega_0 = \\frac{1}{\\sqrt{LC}} = \\frac{1}{\\sqrt{1.0 \\times 10^{-8}}} = 10000\\ \\mathrm{rad/s}$$

$$\\zeta = \\frac{1000}{10000} = 0.1000 \quad\\text{so the response is underdamped}$$

$$\\omega_d = 10000\\sqrt{0.9900} = 9950\\ \\mathrm{rad/s}$$

Percent overshoot from the control-theory pair, with
$\\pi\\zeta/\\sqrt{1-\\zeta^{2}} = 0.3157$:

$$M_p = \\exp(-0.3157) = 0.7293$$

and from the circuit-theory pair, with $\\pi\\alpha/\\omega_d = 0.3157$, the same
0.7293. So **72.9%** overshoot. A candidate who reads $\\alpha$ as a damping
ratio obtains $\\sqrt{1 - 10^{6}}$ and should notice.

**A5.** The output voltage follows from the power and the load:

$$V_o = \\sqrt{2 \\times 8} = 4.000\\ \\mathrm{V}$$

$$\\frac{4.000}{0.050} = 80.00 \\quad\\text{so}\\quad 20\\log_{10}(80) = 38.06\\ \\mathrm{dB}$$

The power gain cannot be found because the input power is not determined: it
needs the amplifier's input impedance, which is not given. This is the boundary
of section 10 in miniature — the missing quantity is a fact about the circuit,
and no reference supplies it. A candidate who writes $10\\log_{10}(80) = 19.03$
dB has answered a different question with the wrong constant as well.

### Problem Set B — Units, Verification and the Clock

**B1.** A 0.1 $\\mu$F capacitor charged to 20 V discharges through 47 k$\\Omega$.
Find the time for its voltage to fall to 10% of the initial value. Do the time
constant by prefix arithmetic rather than by converting to base units.

**B2.** A nominal annual interest rate of 6% is compounded quarterly. Find the
effective annual rate, and the present worth of 2,000 dollars received three
years from now. Verify the present worth by a second route.

**B3.** A low-pass RC network has $R = 1\\ \\mathrm{k\\Omega}$ and
$C = 1\\ \\mu\\mathrm{F}$. Find the magnitude of its response at 159.15 Hz, in
absolute terms and in decibels, and state the two limiting values that bracket
any correct answer.

**B4.** At 200 minutes of elapsed testing time you have completed 58 questions of
110. Are you ahead or behind the pace line of section 5.1, by how many questions,
and what pace do the remaining questions demand?

**B5.** You are 40 seconds into a question. You judge that a 60-second look-up
would give you an 85% chance of solving it, against a 25% blind guess, and your
baseline hit rate on the questions you would displace is 0.65. Should you do the
look-up?

### Solutions to Problem Set B

**B1.** Kilohms times microfarads is milliseconds, so no conversion is needed:

$$\\tau = 47 \\times 0.1 = 4.700\\ \\mathrm{ms}$$

A decay to a tenth takes $\\ln 10$ time constants:

$$t = 4.7 \\times 2.3026 = 10.82\\ \\mathrm{ms}$$

*Check by bracket.* Three time constants leave about 5% and two leave about 13.5%,
so the answer must fall between 9.4 and 14.1 ms, and 10.82 ms does. The initial
20 V is not needed, which is itself worth noticing: the decay to a *fraction* of
the initial value is independent of that value.

**B2.** The period is a quarter, so the rate per period is

$$i = \\frac{0.06}{4} = 0.01500, \\qquad n = 12 \;\\text{quarters}$$

$$i_{\\mathrm{eff}} = 1.015^{4} - 1 = 0.06136$$

so 6.136% effective against 6% nominal.

$$P = \\frac{2000}{1.19562} = 1672.77$$

The present worth is 1,672.77 dollars.

*Second route.* Discounting at the effective annual rate over three years instead
of the quarterly rate over twelve quarters uses different numbers entirely:
$1.061364^{3} = 1.19562$, giving the same 1,672.77. The agreement confirms that
the rate and the count were matched to the same period, which was the point of
the problem.

**B3.** The corner frequency is

$$f_c = \\frac{1}{2\\pi RC} = 159.15\\ \\mathrm{Hz}$$

so the stated frequency *is* the corner, where $\\omega RC = 1$ exactly:

$$\\lvert H \\rvert = \\frac{1}{\\sqrt{2}} = 0.7071 \\qquad 20\\log_{10}(0.7071) = -3.010\\ \\mathrm{dB}$$

The bracket is 1.000 at zero frequency, where the capacitor is an open circuit,
and 0 at infinite frequency, where it is a short. Any correct magnitude lies
between them, and a candidate who reports a value above unity for a passive RC
network has made an error the limit exposes immediately.

**B4.** The pace line runs at $320/110 = 2.909$ minutes a question, so at 200
minutes you should be finishing

$$\\frac{200}{2.909} = 68.75 \\quad\\text{that is, about question 69}$$

You are therefore **11 questions behind**. The remaining work is
$110 - 58 = 52$ questions in $320 - 200 = 120$ minutes:

$$\\frac{7200}{52} = 138.5\\ \\mathrm{s} \\ \\text{per question}$$

against the 174.5-second budget — a 21% reduction, sustainable but only if it
starts now. The correct response is to stop verifying twice and to tighten the
abandonment rule, not to rush the reading, which is where errors are cheapest to
avoid.

**B5.** Apply the break-even of Worked Example 11.1 with $p = 0.85$, $g = 0.25$
and $h = 0.65$:

$$\\Delta t^{*} = \\frac{174.5 \\times 0.60}{0.65} = 161\\ \\mathrm{s}$$

The proposed look-up costs 60 seconds, comfortably inside the break-even, so
**yes**. Note what the 40 seconds already spent contributes: nothing. It is
gone whatever you decide, and including it in the comparison is the sunk-cost
error — the same error that keeps candidates fighting a question at six minutes
because they have already given it five.

## 13.1 How to use these sets

Work each set twice, several days apart, and record for every miss which of the
four failures it was: hypothesis, symbol, unit, or arithmetic. The distribution
tells you which of sections 6 to 8 deserves your remaining preparation time, and
it is usually lopsided. Most candidates find one of the four accounts for over
half their errors, and it is rarely the one they expected.`,
      examTip: `Time already spent on a question is gone and must not enter the decision about whether to continue. The only question is what the NEXT sixty seconds buy, and the answer does not depend on how the previous five minutes went.`,
      importantNote: `Assuming the sinusoidal peak-to-RMS factor made the computed POWER 50% high on a triangle and 50% low on a square wave. The factor itself is off by less — 22.5% high and 29.3% low — because power goes as the square of RMS, so a modest error in the factor is a large one in the answer. Errors of assumption have no consistent sign, so they cannot be caught by asking whether an answer "looks too big" — only by checking the hypothesis.`,
    },
  ],
  keyTakeaways: [
    'The exam is OPEN-REFERENCE, so the reference is not an edge — everyone has it. The edge is retrieval speed, built by practising with the current handbook PDF from ncees.org.',
    'Key your personal index to the WORDS questions use, and to position within a division rather than to page numbers. Page numbers move between handbook versions; structure does not.',
    'Only calculators on the current NCEES-approved list are permitted, and the list is republished each exam year. Check ncees.org before buying, and practise with the model you will bring.',
    'Time budget: 174.5 seconds per question (320 minutes of testing time for 110 questions). Memorise three checkpoints rather than doing division under pressure.',
    'A correct relation applied outside its hypotheses gives a clean wrong answer and no warning. Audit four things before substituting: waveform, network, sources, periods.',
    'Reconcile symbols before substituting. Damping ratio is dimensionless and Neper frequency is per second; a decibel value alone never determines a voltage without an impedance.',
    'Verify with the three free checks on every question — dimensions, a limiting case, an order of magnitude. Reserve a full second route for a specific surviving doubt.',
    'A look-up is worth roughly 162 extra seconds when you are confident it converts, and the break-even RISES as your remaining questions get harder — so rushing the last hour spends your cheapest minutes.',
    'Unit traps are the #1 mistake source. Write out units at problem start; convert before calculating. Kilohms times microfarads is milliseconds.',
    'Phasors: degrees mode, polar/rectangular as needed, memorize Z_L = jωL (∠+90°), Z_C = 1/(jωC) (∠-90°)',
    'Three-phase: Y has V_line = √3·V_phase, I_line = I_phase. Δ has V_line = V_phase, I_line = √3·I_phase',
    'NCEES publishes no raw cut score, so treat practice percentages as a relative signal and aim comfortably above where you think the line is. There is no penalty for a wrong answer, so never leave a blank.',
  ],
},

};

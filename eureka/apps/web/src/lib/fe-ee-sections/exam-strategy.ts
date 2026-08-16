// FE EE course content — Exam Strategy (1 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_EXAM_STRATEGY: Record<string, TopicLesson> = {
fee_reference_handbook: {
  topicId: 'fee_reference_handbook',
  title: `NCEES Reference Handbook Navigation`,
  domainWeight: 'Exam Strategy',
  overview: `The FE exam is OPEN-HANDBOOK — NCEES provides the official 500+ page FE Reference Handbook on-screen during the exam. Candidates who can NAVIGATE the handbook quickly have a 10-15% time advantage over those who flip pages randomly. This topic is not about new technical content; it teaches the LAYOUT of the handbook, the section that contains each formula you need, and a memorized "table of contents" so you can jump directly to the right page mid-problem. Mastering this single discipline raises your effective score by 15-20 points.`,
  sections: [
    {
      id: 'handbook-layout',
      title: `1. Handbook Layout — Memorize the Section Order`,
      content: `The FE Reference Handbook (v10.x or later) is organized into ~30 numbered sections corresponding roughly to the exam sections, plus shared general sections. Memorize this order so you don't have to scan a table of contents under time pressure.

## 1.1 General sections (used across all FE disciplines)

- **Units, Conversion Factors, & Constants** — SI prefixes, metric/Imperial conversions, fundamental constants (e, k, mₑ, mₚ, c, h, ε₀, μ₀, N_A)
- **Mathematics** — algebra/trig identities, calculus formulas, ODE solutions, Laplace transform pairs, Fourier series, vector identities
- **Probability & Statistics** — distributions (binomial, Poisson, normal, exponential, t, χ², F), statistical inference, regression formulas, z-tables
- **Engineering Economics** — interest factor tables (P/A, F/A, P/F, A/P, A/F, A/G), depreciation formulas, NPV, IRR, BCR
- **Ethics** — NCEES model rules of professional conduct (memorize the categories; specifics will be referenced)

## 1.2 FE Electrical/Computer-specific sections

- **Electrical and Computer Engineering** (the largest section, ~80 pages)
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
- Approximate page number from start of the EE section (helps with "go to page X")
- Layout of the formulas (is it a table? a chart? a numbered list?)

Most candidates create a "personal index" cheat sheet that says:

| Need | Handbook Location |
|---|---|
| Laplace transform pairs | Math section, page ~12 of Math |
| Transformer turns ratio | EE section, near Transformers heading |
| Op-amp ideal model | EE section, Electronics subsection |
| Routh-Hurwitz template | EE section, Control subsection |
| Shannon-Hartley formula | EE section, Comms subsection |
| Power triangle | EE section, AC Power subsection |
| Three-phase line/phase relationships | EE section, Three-Phase subsection |
| Phasor impedance ZL = jωL, ZC = 1/(jωC) | EE section, AC Phasors subsection |
| Bode asymptote slopes | EE section, Linear Systems subsection |

Then during the exam, you have the look-up table memorized — you go straight to the location and don't waste time on a 500-page search.

## 1.4 Handbook quirks the exam tests

- **Notation differences** — the handbook uses specific notation that may differ from your textbook (e.g., uses ω₀ for natural frequency, sometimes ζ for damping, occasionally α and β for filter notations)
- **Implicit units** — the handbook sometimes shows formulas without unit notation. Verify the expected unit and convert if needed.
- **Multiple forms** — some formulas have multiple equivalent forms; learn which one matches the problem language the exam uses.
- **Calculator notation** — the handbook may show e^x or exp(x) interchangeably; same for log/ln distinctions (log is usually base 10 in EE contexts; ln is natural log).

## 1.5 The NCEES-approved calculator constraint

NCEES publishes an approved-calculator list each year and permits only the
models on it. For the 2026 administration the list is three families:

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

## 1.6 The handbook is searchable during the exam (in 2024+ rules)

The on-screen handbook viewer at the Pearson VUE testing center includes a SEARCH function. Practice using it:

- Common search terms: the section title (e.g., "Three-Phase"), a formula keyword (e.g., "Shannon")
- Search returns hits with context — scan results, click the most relevant
- Searches are FAST but require knowing the right term — your personal index helps generate good search queries

## 1.7 Time budgeting per question

Get this arithmetic right, because a great many candidates plan against the
wrong number. NCEES describes the FE as a 6-hour **appointment**, and the
appointment is not all exam. It comprises a 2-minute nondisclosure agreement, an
8-minute tutorial, **5 hours and 20 minutes of actual testing time**, and a
25-minute scheduled break.

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
      examTip: `The exam is open-handbook. Your COMPETITORS know the layout cold. Don't be the candidate flipping through 500 pages while everyone else jumps to the right section in 5 seconds.`,
      importantNote: `Download the current NCEES FE Reference Handbook PDF from ncees.org BEFORE you start studying technical content. Use it as the primary reference for every problem you practice. Familiarity with the handbook is worth more raw exam points than mastering any single subject.`,
    },
    {
      id: 'time-saving-tactics',
      title: `2. Time-Saving Tactics and Common Pitfalls`,
      content: `## 2.1 Question-attack sequence (the 196-second budget in practice)

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
- DO NOT spend 10 minutes on a single 2-point question while skipping 5 easy 2-point questions.

The exam is scored on raw correct answers (no penalty for wrong). ALWAYS GUESS on unanswered questions — your expected value from random guessing is 25%.

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
- Guess on the rest — random guessing gets 25% on average

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
- Use the bathroom before starting; you can take breaks but they count against your time
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
intentions. Ten questions behind at halftime is not a disaster, but it changes
the remaining budget from 174.5 seconds a question to **147 seconds** — a 16%
speed-up you must sustain for two and a half hours. Twenty behind at the same
point demands 120 seconds a question, which is not achievable on a mixed set.
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
  ],
  keyTakeaways: [
    'The exam is OPEN-HANDBOOK. Master the NCEES Reference Handbook layout BEFORE drilling content.',
    'Build a personal bookmark map: for each common formula, know which handbook section + approximate page',
    'NCEES-approved calculators only: HP 35s, Casio FX-115 ES Plus, TI-30 series. Practice with the model you\'ll bring.',
    'Time budget: ~196 seconds per question average. Mark and skip questions >5 minutes. ALWAYS guess unanswered (no penalty).',
    'Unit traps are the #1 mistake source. Write out units at problem start; convert before calculating.',
    'Phasors: degrees mode, polar/rectangular as needed, memorize Z_L = jωL (∠+90°), Z_C = 1/(jωC) (∠-90°)',
    'Three-phase: Y has V_line = √3·V_phase, I_line = I_phase. Δ has V_line = V_phase, I_line = √3·I_phase',
    '30-day plan: diagnose, drill weak sections, take 5+ timed practice exams. Score 65+ on practice = ready.',
  ],
},

};

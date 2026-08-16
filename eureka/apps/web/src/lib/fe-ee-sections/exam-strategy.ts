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

NCEES allows ONLY these calculator models (as of 2025):

- HP 35s
- Casio FX-115 ES Plus (and later approved variations)
- TI-30X (Pro / IIS)

These calculators do NOT have programmable memory or graphing — you cannot pre-store formulas. They DO have:

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

110 questions in 6 hours = 196 seconds per question on average, including breaks. Allocate:

- ~30 seconds: read and understand the question
- ~30 seconds: navigate the handbook to the relevant formula
- ~60 seconds: identify variables, plug in numbers, calculate
- ~30 seconds: verify (units, sanity check, mark for review if uncertain)
- ~46 seconds: buffer for harder questions

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

## 3.6 The 60-70% threshold

The FE EE pass rate is ~56% nationally. The cut score is ~50-65 raw points out of 110 (NCEES doesn't publish exact cut). Practically:

- Score 65+ on practice exams consistently → likely pass
- Score 50-64 → uncertain; depends on test difficulty calibration
- Score <50 → more study needed before exam day

If you can score 65+ on full practice exams under timed conditions, you are READY.`,
      examTip: `The single biggest determinant of pass/fail is HANDBOOK FAMILIARITY combined with EXAM PACING. Both are skills you build through practice, not natural talent. 30 days of disciplined study, 800-1200 practice questions, and 5+ full timed practice exams should get most candidates with a solid EE undergrad to passing.`,
      importantNote: `Don't pay for premium "FE crash course" videos until you've exhausted free resources (NCEES sample questions, university OCW, YouTube channels like Engineer4Free, EE Power, electricalpe). The platform's lessons + QBank + handbook should suffice for most candidates.`,
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

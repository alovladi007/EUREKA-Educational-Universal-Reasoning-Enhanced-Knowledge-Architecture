# The AXIOM Teaching Model

Why this document exists: AI platforms give results. A student pastes a
problem, gets an answer, learns nothing, and the platform calls that success.
AXIOM's design goal is the opposite: the platform succeeds only when the
learner can do the thing without it. Every content and engine decision below
serves that goal, and every new course must comply.

## 1. Never answer first

The default response to a learner attempt is never the solution. The order is
fixed: attempt, then diagnosis or hint, then another attempt, then solution
only after genuine effort or explicit surrender. Every item template ships a
three-rung hint ladder:

- Hint 1 (orient): restate what the problem is asking and what is known.
- Hint 2 (method): name the technique and why it applies, no execution.
- Hint 3 (first step): perform the first move only, leaving the rest.

The full worked solution is rung four, and reaching it lowers the mastery
credit for the attempt (the mastery engine already supports partial credit).

## 2. Diagnose beliefs, not answers

A wrong answer is evidence about a mental model. Multiple-choice distractors
are keyed to named misconceptions, and free-response graders (the CAS layer)
detect signature errors (particular-as-general, dropped constant, dropped
initial condition). Feedback names the belief, shows the one-line
counterexample, and the adaptive picker routes a remediation item to the node
the misconception lives on. Telling a learner "incorrect, the answer is 7"
is prohibited output.

## 3. Teach for transfer: lessons activate and retrieve

Every lesson follows the same teaching arc:

- Objective: what the learner will be able to do.
- Build on: one line connecting to the prerequisite node, because new
  knowledge attaches to old or attaches to nothing.
- Core idea: the concept, concrete before abstract.
- Worked example: one complete model of the skill.
- Try it: a retrieval question the learner answers before revealing the
  answer (the loader renders the answer click-to-reveal).
- Pitfall: the misconception most likely to bite, named.

Reading fluency is not learning. The Try it plus the item bank plus spaced
review through the mastery engine is where learning actually happens, and the
lesson is structured to push the learner there.

## 4. Mastery gates, spaced review, and honest progress

Nodes unlock when prerequisites reach mastery (BKT threshold), review items
resurface mastered nodes on a schedule, and the picker explains its choice to
the learner in plain language ("you missed X for reason Y, so we are
practicing Z"). Progress reporting counts what the learner can do unaided,
never time spent or answers revealed.

## 5. Compliance checklist for every new course

- Every node has a lesson in the six-part arc above.
- Every template has a three-rung hint ladder and a verified key.
- Every MC distractor keys a named misconception.
- Every misconception routes to a remediation node.
- No content path shows a solution before an attempt.

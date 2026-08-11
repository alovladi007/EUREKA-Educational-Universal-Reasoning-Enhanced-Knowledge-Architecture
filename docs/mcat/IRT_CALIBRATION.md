# MCAT item calibration: the threshold, and what is claimed before it

2026-08-11. Phase C6. This document exists so that "difficulty" and
"ability" on this platform mean something specific, and so that the point
at which they start meaning it is written down in advance rather than
decided once the numbers look flattering.

## What is being estimated

A two-parameter logistic (2PL) model, already implemented in
`eureka/services/api-core/app/services/irt.py`:

    P(correct | theta) = 1 / (1 + exp(-a * (theta - b)))

`b` is item difficulty on the same scale as learner ability `theta`; `a`
is discrimination, how sharply the item separates learners near `b`. The
fitter is EM over the response log (`attempt_logs`), and it writes
`items.irt_difficulty`, `items.irt_discrimination` and
`items.irt_calibrated_at`.

The response log is real and already accumulating: every graded answer in
MCAT practice (`source='mcat_qbank'`) and every answered position in a
simulated sitting (`source='mcat_mock'`) writes one row, with the item, the
chosen index, correctness, and timing. Nothing about this pipeline is
hypothetical - what is missing is volume.

## The threshold

An MCAT item is eligible for calibration when BOTH hold:

| Condition | Value |
|---|---|
| Responses to that item | >= 300 |
| Distinct learners answering it | >= 100 |

Both, not either. 300 responses from five very determined learners is not
300 independent observations: item parameters and person parameters are
estimated jointly, so a handful of learners answering repeatedly mostly
tells the model about those learners. The distinct-learner floor is what
keeps the item parameter from absorbing one person's idiosyncrasies.

Why 300: the standard error of an item parameter shrinks roughly as
1/sqrt(n), and discrimination is the unstable one at small n - `a` can
swing by a factor of two on a few dozen responses and produce an item that
looks sharply diagnostic purely by accident. Published practice for 2PL
calibration generally sits in the hundreds of responses per item; 300 is
this platform's floor, chosen inside that range and deliberately at the
conservative end because the consequence of a bad estimate here is telling
a learner their weakness is somewhere it is not.

300 is a floor, not a target. Clearing it makes an estimate publishable,
not good.

## What is claimed before the threshold is met

Nothing.

- No item is described as easy, medium, or hard on measured grounds. The
  bank carries an author-assigned `difficulty_nominal` label, which the API
  names exactly that so it cannot be mistaken for a measurement.
- No learner is given a theta, a scaled score, or a percentile. The
  simulator's `theta`, `scaled_score` and `pass_probability` columns stay
  NULL by design (see `docs/mcat/AUDIT.md` MC-2), and results are reported
  as raw and per-section counts.
- No cohort statistic of any kind is displayed, because there is no
  cohort. `GET /mcat/irt/status` reports the real counts against the
  threshold so the gap is visible rather than glossed.

## What changes when the threshold is met

Per item, and only for items that individually clear it:

1. `POST /mcat/irt/calibrate` (admin only) fits the 2PL over the MCAT bank
   and writes `a`, `b`, and the calibration timestamp for eligible items.
   Items below threshold are skipped, not estimated with a shrug.
2. A calibrated item may report measured difficulty, labelled as measured,
   with its response count beside it.
3. Uncalibrated items continue to report only the nominal label. A bank
   where some items are calibrated and others are not is the normal state
   and must read that way on screen.

Scaled scoring (472-528) is a separate question and is NOT unlocked by
calibration. That needs equating against a reference form with known
properties, which no amount of our own response data supplies. Until that
exists, the simulator reports raw and per-section results - calibration
does not change this.

## Related fixes recorded here

- `POST /irt/calibrate` (the generic, platform-wide endpoint) was gated on
  "any authenticated user" with a `min_attempts` floor of 1 and its own
  docstring conceding the gap ("auth-gate it role-wise in Phase 9"). Any
  logged-in learner could have rewritten every item parameter on the
  platform from three responses. It is now admin-only.
- The shared fitter's `min_attempts_per_item` default of 5 is documented
  in its own docstring as "enough to demo". It stays available for other
  verticals, but the MCAT path never uses the default: it passes the
  threshold above explicitly, every time.

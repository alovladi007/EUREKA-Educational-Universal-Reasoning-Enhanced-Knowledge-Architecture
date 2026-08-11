#!/usr/bin/env python3
"""Mathematics, third pass: the residual six topics, 74-236 words short each.

Short sections by design. The gap is small, and padding an existing section to
close it would be exactly the kind of word-count-chasing this programme is
supposed to avoid - so each of these is a real list of the errors that lose
marks in that topic, which is content a candidate can act on.
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from fe_ee_expand import apply  # noqa: E402


def sec(sid, title, body):
    return "\n".join(["{", "  id: '%s'," % sid, "  title: '%s'," % title,
                      "  content: `%s`," % body.strip(), "}"])


EXPANSIONS = {

'fee_complex': sec('cx-errors', '6. Where Marks Are Lost', r"""
## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Trusting arctan | quadrant II reported as quadrant IV | check the signs of the real and imaginary parts before accepting the angle |
| Adding in polar | magnitudes added directly | convert to rectangular; only multiplication and division work on magnitudes and angles |
| Matching instead of conjugating | Z_L = Z_s for maximum power | the load must be the conjugate, so the reactances cancel |
| Losing j² = −1 | a sign error in the real part | expand carefully, then verify the magnitude against the polar route |

The last one is worth a habit rather than care. After any rectangular
multiplication, compute the magnitude of your answer and compare it against the
product of the two input magnitudes — they must agree exactly, and if they do
not the error is in the expansion.
"""),

'fee_discrete_math': sec('dm-errors', '6. Where Marks Are Lost', r"""
## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Using C when order matters | 56 instead of 336 for arranging 3 of 8 | ask "would a different order be a different answer?" |
| Forgetting the overlap | 105 instead of 85 for a union | subtract the intersection once |
| Confusing converse with contrapositive | "the fuse blew, so it was shorted" | only "not Q implies not P" is equivalent |
| Counting repetition wrongly | using n! where nᵏ applies | decide independently whether repetition is allowed |

The permutation and combination check is free: **P(n,k) must exceed C(n,k) by
exactly k!**. If your two answers do not stand in that ratio, one of them uses
the wrong formula, and you know it before looking at the choices.
"""),

'fee_analytic_geom': sec('ag-errors', '6. Where Marks Are Lost', r"""
## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Reading the centre off the raw equation | (y + 2)² reported as k = +2 | the standard form is (y − k)², so the sign flips |
| Forgetting the coefficient when completing the square | adding 4 rather than 4×4 | whatever you add inside the bracket is multiplied by the coefficient outside |
| Negating instead of taking the negative reciprocal | slope 2 paired with −2 | perpendicular slopes multiply to −1 |
| Dropping the absolute value in the distance formula | a negative distance | distance is a magnitude |

Identifying the conic **before** any algebra also prevents wasted effort: the
signs of A and C settle it in one glance, and knowing you are looking at a
hyperbola stops you completing the square toward a circle that was never there.
"""),

'fee_diff_calc': sec('dc-errors', '6. Where Marks Are Lost', r"""
## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Reversing the quotient rule | sign flipped on every answer | numerator is u′v − uv′; or write u·v⁻¹ and use product plus chain |
| Skipping the inner derivative | d/dx sin(3x) given as cos(3x) | the chain rule multiplies by 3 |
| Applying L'Hopital to a determinate form | differentiating 1/0 | substitute first and confirm 0/0 or ∞/∞ |
| Stopping at f′ = 0 | reporting a minimum as a maximum | check the sign of f″ before naming it |

Optimisation answers also deserve a physical check. A box of minimum surface
area for a fixed volume should come out roughly cube-shaped; a maximum-power
load resistance should equal the source resistance. If the algebra produces a
dimension ten times the others, the derivative was taken with respect to the
wrong variable.
"""),

'fee_int_calc': sec('ic-errors', '6. Where Marks Are Lost', r"""
## 6.1 Five recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Applying 0.707 to everything | square-wave RMS given as 0.707 V_m | the factor depends on the waveform; square is 1.000, triangle 0.577 |
| Confusing average with RMS | using 0.637 in a heating calculation | RMS for power, average for charge and for DC meters |
| Half-wave against full-wave | 0.637 where 0.318 belongs | check whether the average is over half the period or all of it |
| Forgetting the constant of integration | an indefinite integral with no + C | only definite integrals may drop it |
| Not changing limits after substitution | integrating u over the x limits | either change the limits or convert back before evaluating |

A dimensional check catches several of these at once. An integral of current
over time is a **charge** in coulombs; an integral of power over time is an
**energy** in joules. If the units of your answer do not match what was asked
for, the integrand was wrong, not the arithmetic.
"""),

'fee_diffeq': sec('de-errors', '6. Where Marks Are Lost', r"""
## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Using a single resistor for τ | 0.4 s instead of 0.24 s | τ uses the Thevenin resistance the element sees |
| Omitting the t factor for a repeated root | one exponential where two solutions are needed | the second solution is t·e^(st) |
| Reporting ω_d above ω₀ | a damped frequency larger than the undamped one | damping always lowers the ringing frequency |
| Using only sine for a sinusoidal forcing term | no phase shift in the particular solution | include both sine and cosine |

The fastest structural check is the comparison **α against ω₀**. It names the
regime in one line, and it also tells you what the answer should look like
before you compute it: no overshoot means the response cannot cross its final
value, so a solution that does is wrong regardless of the algebra behind it.
"""),

}

if __name__ == "__main__":
    print("Mathematics section - appending pitfalls to the residual six")
    apply(EXPANSIONS)

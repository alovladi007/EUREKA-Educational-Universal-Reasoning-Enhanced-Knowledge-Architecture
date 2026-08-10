"""Grader 9: extract a quantity from a lab dataset.

The learner is shown a dataset a first-year lab actually produces - a
concentration-versus-time kinetics run, or a titration curve - and must
extract the quantity the experiment was run to measure. Grading the extracted
number reuses the numeric machinery (tolerance, sig figs, named wrong paths),
so this module's substance is on the other side: how the dataset and its key
are generated, and how the key is verified.

The verifier here is the whole point, and it is aimed at the author, the way
grader 10's spectra verifier is. The generator computes the key from the
scenario's hidden parameters (the rate constant it chose, the acid's Ka). The
verifier never touches those parameters: it recovers the quantity FROM THE
SERVED DATA by an independent numeric route - least-squares regression on the
linearized kinetics data, interpolation at half-equivalence on the titration
curve - and the item may only be served when the recovered value agrees with
the key. That check does double duty:

  1. It is a genuinely independent second computational path (closed-form
     integrated law forward vs least-squares fit backward; charge-balance
     solve forward vs curve interpolation backward).
  2. It proves the dataset DETERMINES its own key: an item whose data is too
     sparse, too rounded, or too ambiguous to yield its answer fails
     verification and is never served. For the kinetics items the verifier
     additionally requires the data to discriminate between reaction orders,
     because a dataset that fits first and second order equally well is not
     an exercise, it is a coin flip.

Nothing here invents measurement noise. The data is the exact simulation
output rounded to instrument-realistic figures, and the rounding is stated in
the prompt. Synthesizing "realistic" noise would mean choosing an error model
nobody measured, and the honesty rules of this platform put that with the
other numbers we refuse to fabricate.
"""

from __future__ import annotations

import math

from .numeric import grade_numeric
from .types import GradeResult, VerifierResult


def grade_labdata(
    key_value: float,
    key_unit: str,
    student_answer: str,
    *,
    expected_sig_figs: int | None = None,
    wrong_paths: list[dict] | None = None,
    rel_tolerance: float = 0.02,
) -> GradeResult:
    """Grade the extracted quantity. Numeric comparison, labdata identity.

    The tolerance is a little wider than the pure-calculation graders because
    the learner reads values off a table of rounded measurements; the item's
    verifier has already confirmed the table supports the key to well inside
    this tolerance.
    """
    result = grade_numeric(
        key_value,
        key_unit,
        student_answer,
        rel_tolerance=rel_tolerance,
        expected_sig_figs=expected_sig_figs,
        enforce_sig_figs=False,
        wrong_paths=wrong_paths,
    )
    result.grader = "labdata"
    return result


# ---------------------------------------------------------------------------
# Independent recovery routes. These are the verifier's half of the module:
# they compute the answer from the data alone, sharing no code with the
# closed-form generators in simulate.py.
# ---------------------------------------------------------------------------


def linear_fit(xs: list[float], ys: list[float]) -> tuple[float, float, float]:
    """Ordinary least squares: slope, intercept, r_squared.

    Written out as the textbook sums so this path shares nothing with the
    integrated rate laws it checks.
    """
    n = len(xs)
    if n < 3:
        return 0.0, 0.0, 0.0
    mean_x = sum(xs) / n
    mean_y = sum(ys) / n
    sxx = sum((x - mean_x) ** 2 for x in xs)
    sxy = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    syy = sum((y - mean_y) ** 2 for y in ys)
    if sxx <= 0 or syy <= 0:
        return 0.0, 0.0, 0.0
    slope = sxy / sxx
    intercept = mean_y - slope * mean_x
    r2 = (sxy * sxy) / (sxx * syy)
    return slope, intercept, r2


def fit_rate_constant(
    data: list[dict], order: int
) -> tuple[float, float] | None:
    """Recover k from (t, conc) data under the stated order, with r_squared.

    order 1: ln[A] vs t is linear with slope -k.
    order 2: 1/[A] vs t is linear with slope +k.
    order 0: [A] vs t is linear with slope -k.
    Returns None when the data cannot be transformed (a zero or negative
    concentration under a log or reciprocal transform).
    """
    xs: list[float] = []
    ys: list[float] = []
    for row in data:
        t = float(row["t"])
        c = float(row["conc"])
        if order == 1:
            if c <= 0:
                return None
            xs.append(t)
            ys.append(math.log(c))
        elif order == 2:
            if c <= 0:
                return None
            xs.append(t)
            ys.append(1.0 / c)
        else:
            xs.append(t)
            ys.append(c)
    slope, _, r2 = linear_fit(xs, ys)
    k = slope if order == 2 else -slope
    return k, r2


def interpolate_at(data: list[dict], x_key: str, y_key: str, x: float) -> float | None:
    """Linear interpolation of y at x from a sorted table. None outside range."""
    rows = sorted(({"x": float(r[x_key]), "y": float(r[y_key])} for r in data), key=lambda r: r["x"])
    if not rows or x < rows[0]["x"] or x > rows[-1]["x"]:
        return None
    for i in range(len(rows) - 1):
        x0, y0 = rows[i]["x"], rows[i]["y"]
        x1, y1 = rows[i + 1]["x"], rows[i + 1]["y"]
        if x0 <= x <= x1:
            if x1 == x0:
                return y0
            frac = (x - x0) / (x1 - x0)
            return y0 + frac * (y1 - y0)
    return rows[-1]["y"]


# ---------------------------------------------------------------------------
# Verifiers, one per dataset kind.
# ---------------------------------------------------------------------------

# The kinetics fit must reproduce the key this closely. The data is rounded
# to 4 significant figures, which perturbs a least-squares slope far less
# than this; a miss here means the data does not carry its own answer.
KINETICS_FIT_TOLERANCE = 5e-3
# And the stated order must beat the best wrong order by this much r_squared,
# or the dataset does not determine the order it claims.
ORDER_DISCRIMINATION = 1e-4

TITRATION_PKA_TOLERANCE = 0.05


def verify_kinetics_item(
    data: list[dict], key_k: float, order: int
) -> VerifierResult:
    """The served data must yield the key by regression, under the stated
    order and under no other."""
    fit = fit_rate_constant(data, order)
    if fit is None:
        return VerifierResult(
            ok=False, method="labdata-kinetics-fit",
            detail="data cannot be transformed under the stated order",
        )
    k_fit, r2 = fit
    if key_k <= 0:
        return VerifierResult(ok=False, method="labdata-kinetics-fit", detail="key k not positive")
    rel = abs(k_fit - key_k) / key_k
    if rel > KINETICS_FIT_TOLERANCE:
        return VerifierResult(
            ok=False, method="labdata-kinetics-fit",
            detail=f"regression recovers k={k_fit:.6g}, key is {key_k:.6g} (rel err {rel:.2e})",
        )
    best_wrong_r2 = 0.0
    for wrong in (o for o in (0, 1, 2) if o != order):
        wf = fit_rate_constant(data, wrong)
        if wf is not None:
            best_wrong_r2 = max(best_wrong_r2, wf[1])
    if r2 - best_wrong_r2 < ORDER_DISCRIMINATION:
        return VerifierResult(
            ok=False, method="labdata-kinetics-order",
            detail=(
                f"data does not discriminate the stated order "
                f"(r2 {r2:.6f} vs best wrong order {best_wrong_r2:.6f})"
            ),
        )
    return VerifierResult(
        ok=True, method="labdata-kinetics-fit",
        detail=f"regression recovers k to {rel:.2e}; order discriminated by {r2 - best_wrong_r2:.2e} r2",
    )


def verify_titration_item(
    data: list[dict], key_pka: float, equivalence_mL: float
) -> VerifierResult:
    """The served curve must yield the key pKa by interpolation at
    half-equivalence, and the curve must actually bracket that volume."""
    half = equivalence_mL / 2.0
    ph = interpolate_at(data, "vol_mL", "pH", half)
    if ph is None:
        return VerifierResult(
            ok=False, method="labdata-titration-halfeq",
            detail="curve does not bracket the half-equivalence volume",
        )
    if abs(ph - key_pka) > TITRATION_PKA_TOLERANCE:
        return VerifierResult(
            ok=False, method="labdata-titration-halfeq",
            detail=f"pH at half-equivalence reads {ph:.3f}, key pKa is {key_pka:.3f}",
        )
    return VerifierResult(
        ok=True, method="labdata-titration-halfeq",
        detail=f"curve reproduces pKa at half-equivalence within {abs(ph - key_pka):.3f}",
    )

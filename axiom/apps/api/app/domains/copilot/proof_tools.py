"""Copilot proof-authoring tools (Curriculum & Proof Extension, Section 7).

Two author-facing helpers that keep the proof item bank honest:

  - search_counterexample: given a (suspected-false) universal claim and a set of
    candidate objects, deterministically find one that breaks it, using the CAS
    (math_core.check_counterexample). This validates that a false statement
    really is false before it becomes a find-the-error or counterexample item.
  - generate_proof_practice: emit a provable statement at a target difficulty
    together with a KNOWN reference proof, so the free-form (4.3) grader always
    has ground truth. Every generated statement is verified before it can enter a
    bank: by the formal kernel when it is Lean-formalizable, otherwise flagged
    for human review. This is a curated template bank, not a model that invents
    statements -- inventing provable statements with trustworthy proofs is
    exactly what current models cannot do reliably, so we do not pretend to.
"""

from __future__ import annotations

from app.domains.grading.formal import get_formal_verifier

# Curated provable statements with a reference proof. lean is a core-Lean 4
# formalization when one exists (verified by the kernel), else None (the
# reference proof is prose and needs human review before entering a bank).
_PRACTICE_BANK: list[dict] = [
    {
        "difficulty": "intro",
        "statement": "For every natural number n, n + 0 = n.",
        "reference_proof": "By the definition of addition on the naturals, n + 0 = n.",
        "techniques": ["PT.DIRECT"],
        "lean": "theorem add_zero_ex (n : Nat) : n + 0 = n := rfl",
    },
    {
        "difficulty": "intro",
        "statement": "The sum of two even integers is even.",
        "reference_proof": (
            "Let a = 2m and b = 2k for integers m, k. Then a + b = 2(m + k), "
            "which is a multiple of 2, hence even."
        ),
        "techniques": ["PT.DIRECT"],
        "lean": None,
    },
    {
        "difficulty": "core",
        "statement": "For every natural number n, 0 + n = n.",
        "reference_proof": "By induction on n, using the definition of addition.",
        "techniques": ["PT.INDUCTION"],
        "lean": "theorem zero_add_ex (n : Nat) : 0 + n = n := by simp",
    },
    {
        "difficulty": "core",
        "statement": "If n^2 is even then n is even.",
        "reference_proof": (
            "By contraposition: if n is odd, n = 2k+1, then n^2 = 2(2k^2+2k)+1 is "
            "odd. So if n^2 is even, n is even."
        ),
        "techniques": ["PT.CONTRAPOS"],
        "lean": None,
    },
]


def _pick(difficulty: str, salt: int) -> dict:
    """Deterministically choose a bank entry for the difficulty (salt rotates the
    choice without any RNG, so the same request is reproducible)."""
    pool = [e for e in _PRACTICE_BANK if e["difficulty"] == difficulty] or _PRACTICE_BANK
    return pool[salt % len(pool)]


def search_counterexample(
    predicate: str, candidates: list[str], var: str = "n"
) -> dict:
    """Find a candidate that refutes a universal claim `for all var, predicate`.

    Returns the first candidate for which the predicate does NOT hold (a genuine
    counterexample), or reports that none was found in the searched set. Bad
    candidates that cannot be evaluated are skipped, not treated as refutations.
    """
    from math_core import check_counterexample

    for candidate in candidates:
        try:
            holds = check_counterexample(str(candidate), predicate, var)
        except Exception:
            continue
        if not holds:
            return {
                "found": True,
                "counterexample": str(candidate),
                "predicate": predicate,
                "var": var,
            }
    return {
        "found": False,
        "predicate": predicate,
        "var": var,
        "searched": len(candidates),
        "note": "No counterexample in the searched set; the claim may hold there.",
    }


async def generate_proof_practice(difficulty: str = "intro", salt: int = 0) -> dict:
    """Generate a provable statement with a verified reference proof.

    The statement comes from a curated bank. When it is Lean-formalizable, its
    formalization is run through the configured formal verifier; the practice
    item is marked verified only if the kernel accepts it. Otherwise the
    reference proof is prose and the item is flagged for human review before it
    can enter a bank -- never presented as verified on no evidence.
    """
    entry = _pick(difficulty, salt)
    verified = False
    backend = "none"
    detail = "prose reference proof; needs human review before entering a bank"
    if entry.get("lean"):
        verdict = await get_formal_verifier().verify(entry["lean"])
        verified = verdict.verified
        backend = verdict.backend
        detail = verdict.detail
    return {
        "statement": entry["statement"],
        "reference_proof": entry["reference_proof"],
        "techniques": entry["techniques"],
        "difficulty": entry["difficulty"],
        "formalization": entry.get("lean"),
        "verified": verified,
        "backend": backend,
        "needs_human_review": not verified,
        "detail": detail,
    }

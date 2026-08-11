"""What a variant's meta may carry to a learner during an open attempt.

One function, used by every serve path: practice sessions, /practice/next, and
exam assembly. It exists because two of those three paths shipped with a
BLACKLIST (drop "exact_g" and "exact_x", pass everything else), and a blacklist
on a growing meta dictionary fails open: when the numeric templates later
added "value", "raw", "key_text" and "wrong_paths", the exam serve path handed
every numeric answer to the client mid-attempt, and /practice/next did the
same. The review that found it read the keys straight off a live attempt
payload.

So this is a WHITELIST, per grader, and an unknown grader serves nothing. A
new grader whose items render poorly because a needed field is missing is a
visible, harmless failure; a new grader leaking its key through a permissive
default is neither.

What is allowed and why:

  mc          choices as index and text only. The misconception each
              distractor keys is rationale material, shown after the attempt.
  numeric     unit, sig figs, and naming context. Every given number already
              appears in the prompt text; nothing numeric from meta is needed
              to render the item, and value/raw/key_text/wrong_paths are the
              answer and its diagnosis.
  stoich      the given quantities and formulas, which the prompt states
              anyway, and never exact_g.
  equilibrium the problem's givens (formula, name, concentration, ka), never
              exact_x, the approximation flag, or percent ionization.
  formula     the question material: a name or structure to read a formula
              off. Never "molecular", which is the key.
  structure   name and grading policy flags. Never smiles: for a drawing item
              the SMILES is the answer.
  spectrum    the stated data: formula and signals. Not the derived degrees of
              unsaturation, which is the first step of the reasoning being
              assessed.
  retro       the disconnection menu (names, what bond each forms, the
              simplification note). Never key_disconnection or key_precursors.
  balance     the skeleton equation being balanced.
  mechanism   the starting material and the step menu as names and prose
              (what each step's electrons do, what it abstracts). Never the
              reaction SMARTS, the key path, its intermediates, the product,
              or the wrong-product diagnosis table: the intermediates ARE the
              answer, and the SMARTS would let a client compute them.
  labdata     the dataset itself, its rounding note, unit, sig figs and the
              scenario name and stated order. Never value or wrong_paths,
              which are the answer and its diagnosis.
"""

from __future__ import annotations

_SAFE_KEYS: dict[str, tuple[str, ...]] = {
    "numeric": ("unit", "sig_figs", "formula", "name"),
    "stoich": (
        "from_formula",
        "to_formula",
        "from_coefficient",
        "to_coefficient",
        "given_mass_g",
        "sig_figs",
    ),
    "equilibrium": ("formula", "name", "concentration", "ka"),
    "formula": ("mode", "name", "smiles", "percents"),
    "structure": ("name", "stereo", "tautomer"),
    "spectrum": ("formula", "name", "signals"),
    "retro": ("disconnections", "name"),
    "balance": ("skeleton",),
    "prediction": ("options", "scenario", "node"),
    "labdata": ("kind", "data", "unit", "sig_figs", "name", "order", "data_note"),
}


def public_meta(grader: str, meta: dict) -> dict:
    """The learner-visible slice of an item's meta. Fails closed."""
    if grader == "mechanism":
        return {
            "start": meta.get("start", ""),
            "name": meta.get("name", ""),
            "steps": [
                {
                    "name": s.get("name", ""),
                    "moves": s.get("moves", ""),
                    "abstracts": s.get("abstracts", ""),
                }
                for s in meta.get("steps", [])
            ],
        }
    if grader == "mc":
        return {
            "choices": [
                {"index": c["index"], "text": c["text"]}
                for c in meta.get("choices", [])
            ]
        }
    allowed = _SAFE_KEYS.get(grader, ())
    return {k: meta[k] for k in allowed if k in meta}

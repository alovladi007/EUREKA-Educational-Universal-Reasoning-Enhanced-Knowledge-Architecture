"""GEN1 Unit 6 templates: electronic structure and periodic properties.

Nine nodes, nine templates, closing a unit that had lessons and no practice.

ON PERIODIC DATA

Radius, ionization energy and electronegativity items are built on stated
periodic POSITIONS rather than on measured values for named elements. An item
that reports "the radius of element X is 143 pm" would be asserting a
measurement, and this module cannot derive one, so it would have to be either
looked up or invented. Invented is out, and looked up would add to the
citation review debt for no teaching gain, because what these nodes actually
assess is the trend and the reasoning behind it, not recall of a number.

So the prompts describe hypothetical elements by where they sit ("Q is two
groups to the left of R in the same period"), and the verifier applies the
trend rule independently of the generator. Where a real constant is needed it
is carried in meta with a source:

  h = 6.626e-34 J s          (CODATA)
  c = 2.998e8 m/s            (defined, SI)
  Rydberg energy 2.18e-18 J  (CODATA; the hydrogen ground state energy)

Registration into REGISTRY, HINTS and MISCONCEPTIONS is done by the registry
wiring, not by this module.
"""

from __future__ import annotations

import math

from .mc import validate_choices
from .misconceptions import Misconception
from .registry import Variant
from .stoich import format_sig_figs
from .types import VerifierResult

PLANCK_H = 6.626e-34        # J s
LIGHT_C = 2.998e8           # m/s
RYDBERG_J = 2.18e-18        # J, magnitude of the hydrogen ground state energy

_H_SOURCE = "h = 6.626e-34 J s (CODATA)"
_C_SOURCE = "c = 2.998e8 m/s (defined exactly in SI; rounded here)"
_RYDBERG_SOURCE = (
    "E_n = -2.18e-18 J / n^2 for hydrogen (CODATA Rydberg energy; Atkins Physical Chemistry)"
)
_SHELL_SOURCE = (
    "A subshell of angular momentum quantum number l holds 2l+1 orbitals and "
    "2(2l+1) electrons, from the allowed values of m_l and the Pauli principle"
)
_TREND_SOURCE = (
    "Periodic trends follow from effective nuclear charge and shell number "
    "(Atkins Physical Chemistry; Kotz, Chemistry and Chemical Reactivity)"
)

_OBSERVED = "Instructor observation; not traced to a published study"

SUBSHELLS = (("s", 0), ("p", 1), ("d", 2), ("f", 3))


# ---------------------------------------------------------------------------
# 1. photon energy from wavelength  (GEN1.LIGHT)
# ---------------------------------------------------------------------------


def gen_photon_energy(seed: int) -> Variant:
    wavelength_nm = 200.0 + (seed % 61) * 10.0        # 200 .. 800 nm
    lam_m = wavelength_nm * 1e-9
    energy = PLANCK_H * LIGHT_C / lam_m
    return Variant(
        template_id="light.photon_energy.v1",
        seed=seed,
        prompt=(
            f"A photon has a wavelength of {wavelength_nm:.0f} nm. Taking "
            "h = 6.626e-34 J s and c = 2.998e8 m/s, what is the energy of one "
            "such photon? Report in J to 3 significant figures."
        ),
        key=format_sig_figs(energy, 3),
        node="GEN1.LIGHT",
        grader="numeric",
        meta={
            "unit": "J",
            "value": energy,
            "wavelength_nm": wavelength_nm,
            "sig_figs": 3,
            "constant_source": f"{_H_SOURCE}; {_C_SOURCE}",
        },
    )


def ver_photon_energy(v: Variant) -> VerifierResult:
    # Independent route: go through frequency instead of wavelength. E = h*nu
    # with nu = c/lambda is a different chain of operations from E = hc/lambda,
    # and it fails if the nm-to-m conversion went the wrong way, which is the
    # error this item is most likely to be got wrong by.
    lam_m = v.meta["wavelength_nm"] * 1e-9
    nu = LIGHT_C / lam_m
    energy = PLANCK_H * nu
    if not math.isclose(energy, v.meta["value"], rel_tol=1e-9):
        return VerifierResult(
            False, "via-frequency", f"frequency route gives {energy:.6g} J, key is {v.meta['value']:.6g} J"
        )
    # A visible or near-UV photon is of order 1e-19 J. Anything wildly outside
    # that means a unit slipped by a factor of a billion.
    if not 1e-20 < energy < 1e-17:
        return VerifierResult(False, "via-frequency", f"{energy:.3g} J is not a plausible photon energy")
    return VerifierResult(True, "via-frequency", f"{energy:.4g} J confirmed through nu = c/lambda")


# ---------------------------------------------------------------------------
# 2. Bohr transition energy  (GEN1.SPECTRA)
# ---------------------------------------------------------------------------


def gen_bohr_transition(seed: int) -> Variant:
    n_low = 1 + (seed % 3)                  # 1, 2 or 3
    n_high = n_low + 1 + (seed % 4)         # at least one level above
    # Emission: the electron falls from n_high to n_low, so energy leaves.
    delta = -RYDBERG_J * (1.0 / n_low**2 - 1.0 / n_high**2)
    return Variant(
        template_id="spectra.bohr_transition.v1",
        seed=seed,
        prompt=(
            f"In a hydrogen atom an electron falls from n = {n_high} to "
            f"n = {n_low}. Taking E_n = -2.18e-18 J divided by n squared, what "
            "is the energy change of the atom for this transition? Report in J "
            "to 3 significant figures, keeping the sign."
        ),
        key=format_sig_figs(delta, 3),
        node="GEN1.SPECTRA",
        grader="numeric",
        meta={
            "unit": "J",
            "value": delta,
            "n_low": n_low,
            "n_high": n_high,
            "sig_figs": 3,
            "constant_source": _RYDBERG_SOURCE,
        },
    )


def ver_bohr_transition(v: Variant) -> VerifierResult:
    # Independent route: form the two level energies separately and subtract,
    # rather than using the difference-of-reciprocals shortcut. Then require
    # that the emitted photon carries exactly the energy the atom lost, which
    # ties the answer to something physical rather than to the algebra.
    e_low = -RYDBERG_J / v.meta["n_low"] ** 2
    e_high = -RYDBERG_J / v.meta["n_high"] ** 2
    delta = e_low - e_high
    if not math.isclose(delta, v.meta["value"], rel_tol=1e-9):
        return VerifierResult(
            False, "level-difference", f"levels give {delta:.6g} J, key is {v.meta['value']:.6g} J"
        )
    if delta >= 0:
        return VerifierResult(
            False, "level-difference", "the atom gained energy while the electron fell"
        )
    photon = abs(delta)
    lam_nm = PLANCK_H * LIGHT_C / photon * 1e9
    if not 10.0 < lam_nm < 100000.0:
        return VerifierResult(False, "level-difference", f"implied wavelength {lam_nm:.3g} nm is absurd")
    return VerifierResult(
        True, "level-difference", f"{delta:.4g} J, an emitted photon at {lam_nm:.0f} nm"
    )


# ---------------------------------------------------------------------------
# 3. what an orbital is, multiple choice  (GEN1.QUANTUMMODEL)
# ---------------------------------------------------------------------------


def gen_orbital_meaning(seed: int) -> Variant:
    choices = [
        {
            "index": 0,
            "text": "The fixed path the electron travels around the nucleus.",
            "misconception": "QM-ORBIT-IS-A-PATH",
        },
        {
            "index": 1,
            "text": (
                "A region of space where the electron is likely to be found, with "
                "no definite trajectory."
            ),
            "misconception": None,
        },
        {
            "index": 2,
            "text": "The physical surface of the electron cloud, which the electron cannot cross.",
            "misconception": "QM-BOUNDARY-IS-SOLID",
        },
    ]
    return Variant(
        template_id="quantum.orbital_meaning.v1",
        seed=seed,
        prompt=(
            "An orbital is often drawn as a shaded shape around a nucleus. What "
            "does that shape represent?"
        ),
        key="1",
        node="GEN1.QUANTUMMODEL",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 1,
            "constant_source": (
                "The Born interpretation: the square of the wavefunction is a "
                "probability density (Atkins Physical Chemistry)"
            ),
        },
    )


def ver_orbital_meaning(v: Variant) -> VerifierResult:
    # There is no arithmetic here, so the independent check is structural and
    # semantic: exactly one key, every distractor keyed to a real misconception,
    # and the keyed text must be the one that talks about probability rather
    # than about a path or a surface.
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "structural", "; ".join(problems))
    keyed = v.meta["choices"][v.meta["correct_index"]]["text"].lower()
    if "likely" not in keyed and "probab" not in keyed:
        return VerifierResult(False, "structural", "the keyed choice does not describe a probability")
    for c in v.meta["choices"]:
        if c["index"] == v.meta["correct_index"]:
            continue
        if "likely" in c["text"].lower() or "probab" in c["text"].lower():
            return VerifierResult(False, "structural", "a distractor also describes a probability")
    return VerifierResult(True, "structural", "one probability statement, keyed; two keyed distractors")


# ---------------------------------------------------------------------------
# 4. orbitals and electrons in a subshell  (GEN1.QUANTUMNUMBERS)
# ---------------------------------------------------------------------------


def gen_subshell_capacity(seed: int) -> Variant:
    letter, l = SUBSHELLS[seed % len(SUBSHELLS)]
    n = l + 1 + (seed % 3)                 # a principal number that permits this l
    capacity = 2 * (2 * l + 1)
    return Variant(
        template_id="quantum.subshell_capacity.v1",
        seed=seed,
        prompt=(
            f"How many electrons can the {n}{letter} subshell hold in total? "
            "Report a whole number."
        ),
        key=str(capacity),
        node="GEN1.QUANTUMNUMBERS",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(capacity),
            "n": n,
            "l": l,
            "letter": letter,
            "sig_figs": None,
            "constant_source": _SHELL_SOURCE,
        },
    )


def ver_subshell_capacity(v: Variant) -> VerifierResult:
    # Independent route: enumerate. Count the allowed m_l values one by one
    # from -l to +l and give each two spins, rather than evaluating 2(2l+1).
    l = v.meta["l"]
    m_values = list(range(-l, l + 1))
    counted = 2 * len(m_values)
    if counted != int(v.meta["value"]):
        return VerifierResult(
            False, "enumerate-ml", f"enumerating m_l gives {counted}, key says {int(v.meta['value'])}"
        )
    if v.meta["n"] <= l:
        return VerifierResult(
            False, "enumerate-ml", f"{v.meta['n']}{v.meta['letter']} does not exist: l must be less than n"
        )
    return VerifierResult(
        True, "enumerate-ml", f"m_l = {m_values} gives {len(m_values)} orbitals and {counted} electrons"
    )


# ---------------------------------------------------------------------------
# 5. valence electron count from a configuration  (GEN1.ELECTRONCONFIG)
# ---------------------------------------------------------------------------

# Main group elements only, so "valence" means the outermost s and p. Given as
# problem data: the configuration is written out in the prompt, so nothing here
# depends on the learner recalling a periodic table.
_CONFIGS = (
    ("[Ne] 3s2 3p1", 3),
    ("[Ne] 3s2 3p3", 5),
    ("[Ne] 3s2 3p5", 7),
    ("[Ar] 4s2 4p2", 4),
    ("[Ar] 4s2 4p4", 6),
    ("[Kr] 5s2 5p3", 5),
    ("[He] 2s2 2p2", 4),
    ("[He] 2s2 2p4", 6),
)


def gen_valence_count(seed: int) -> Variant:
    config, valence = _CONFIGS[seed % len(_CONFIGS)]
    return Variant(
        template_id="config.valence_count.v1",
        seed=seed,
        prompt=(
            f"A main group atom in its ground state has the electron "
            f"configuration {config}. How many valence electrons does it have? "
            "Report a whole number."
        ),
        key=str(valence),
        node="GEN1.ELECTRONCONFIG",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(valence),
            "config": config,
            "sig_figs": None,
            "constant_source": (
                "For a main group element the valence electrons are those in the "
                "outermost s and p subshells; the noble gas core is not valence"
            ),
        },
    )


def ver_valence_count(v: Variant) -> VerifierResult:
    # Independent route: parse the configuration string and add up the
    # occupancies of the outermost shell, rather than trusting the table this
    # module was written from. If the string and the number ever disagree the
    # item is teaching a miscount.
    config = v.meta["config"]
    body = config.split("]", 1)[1] if "]" in config else config
    total = 0
    outer = 0
    for token in body.split():
        token = token.strip()
        if len(token) < 3:
            return VerifierResult(False, "parse-config", f"cannot read subshell {token!r}")
        shell = int(token[0])
        count = int(token[2:])
        total += count
        outer = max(outer, shell)
    parsed = sum(
        int(t[2:]) for t in body.split() if int(t[0]) == outer
    )
    if parsed != int(v.meta["value"]):
        return VerifierResult(
            False, "parse-config", f"shell {outer} holds {parsed} electrons, key says {int(v.meta['value'])}"
        )
    if parsed > 8:
        return VerifierResult(False, "parse-config", "more than eight valence electrons in s and p")
    return VerifierResult(
        True, "parse-config", f"shell {outer} of {config} carries {parsed} valence electrons"
    )


# ---------------------------------------------------------------------------
# 6. ion configurations, multiple choice  (GEN1.CONFIGEXCEPTIONS)
# ---------------------------------------------------------------------------


def gen_ion_config(seed: int) -> Variant:
    metals = (("Fe", 26, 2, "[Ar] 3d6"), ("Ni", 28, 2, "[Ar] 3d8"),
              ("Co", 27, 2, "[Ar] 3d7"), ("Mn", 25, 2, "[Ar] 3d5"))
    symbol, z, charge, correct = metals[seed % len(metals)]
    d_count = int(correct.split("3d")[1])
    choices = [
        {
            "index": 0,
            "text": f"{correct}, because the 4s electrons are lost first.",
            "misconception": None,
        },
        {
            "index": 1,
            "text": (
                f"[Ar] 4s2 3d{d_count - 2}, because the 3d electrons are lost "
                "first, being higher in energy when the shell was filled."
            ),
            "misconception": "CONFIG-REMOVE-D-FIRST",
        },
        {
            "index": 2,
            "text": (
                f"[Ar] 4s1 3d{d_count - 1}, because one electron is removed from "
                "each of the two outer subshells."
            ),
            "misconception": "CONFIG-REMOVE-EVENLY",
        },
    ]
    return Variant(
        template_id="config.ion_config.v1",
        seed=seed,
        prompt=(
            f"The neutral atom {symbol} (Z = {z}) has the ground state "
            f"configuration [Ar] 4s2 3d{d_count}. What is the configuration of "
            f"the {symbol}2+ ion?"
        ),
        key="0",
        node="GEN1.CONFIGEXCEPTIONS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "symbol": symbol,
            "z": z,
            "charge": charge,
            "d_count": d_count,
            "constant_source": (
                "For first row transition metal cations the 4s electrons are "
                "removed before the 3d, because once 3d is occupied it lies "
                "below 4s (Atkins Physical Chemistry)"
            ),
        },
    )


def ver_ion_config(v: Variant) -> VerifierResult:
    # Independent route: count electrons. Whatever the reasoning, the keyed
    # configuration must contain exactly Z minus the charge electrons, and the
    # distractors must not. Argon carries 18.
    def electrons(text: str) -> int | None:
        body = text.split("]", 1)[1].split(",")[0] if "]" in text else ""
        total = 18  # [Ar]
        for token in body.split():
            token = token.strip().rstrip(".")
            if len(token) >= 3 and token[0].isdigit():
                try:
                    total += int(token[2:])
                except ValueError:
                    return None
        return total

    want = v.meta["z"] - v.meta["charge"]

    # EVERY choice must hold the right number of electrons, including the
    # distractors. An earlier version of this check required the opposite, that
    # only the key had the right count, and the seed sweep failed it on every
    # seed. The sweep was right and the check was backwards: if a distractor
    # had the wrong total the item would be solvable by counting alone, without
    # ever deciding which subshell empties, which is the entire content of the
    # node. The distractors are plausible precisely because they also remove
    # two electrons; they differ only in where from.
    for c in v.meta["choices"]:
        got = electrons(c["text"])
        if got != want:
            role = "key" if c["index"] == v.meta["correct_index"] else "distractor"
            return VerifierResult(
                False, "electron-count",
                f"{role} {c['index']} holds {got} electrons, not {want}, so counting gives it away",
            )

    # What separates the key is that 4s is empty. Derived from the text rather
    # than taken from correct_index, so a mislabelled key fails.
    def has_4s(text: str) -> bool:
        body = text.split("]", 1)[1].split(",")[0] if "]" in text else ""
        return any(t.strip().startswith("4s") for t in body.split())

    empty_4s = [c["index"] for c in v.meta["choices"] if not has_4s(c["text"])]
    if empty_4s != [v.meta["correct_index"]]:
        return VerifierResult(
            False, "electron-count",
            f"choices with an empty 4s are {empty_4s}, key is {v.meta['correct_index']}",
        )

    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "electron-count", "; ".join(problems))
    return VerifierResult(
        True, "electron-count",
        f"all three hold {want} electrons for {v.meta['symbol']}2+; only the key empties 4s",
    )


# ---------------------------------------------------------------------------
# 7. radius trend  (GEN1.RADIUS)
# ---------------------------------------------------------------------------


def gen_radius_trend(seed: int) -> Variant:
    same_period = seed % 2 == 0
    if same_period:
        prompt = (
            "Two hypothetical main group elements Q and R sit in the same "
            "period of the periodic table, and Q is two groups to the LEFT of R. "
            "Which has the larger atomic radius?"
        )
        answer = "Q"
        reason = "left"
    else:
        prompt = (
            "Two hypothetical main group elements Q and R sit in the same "
            "group of the periodic table, and Q is one period BELOW R. Which "
            "has the larger atomic radius?"
        )
        answer = "Q"
        reason = "below"
    choices = [
        {
            "index": 0,
            "text": "Q",
            "misconception": None,
        },
        {
            "index": 1,
            "text": "R",
            "misconception": (
                "TREND-RADIUS-FOLLOWS-MASS" if reason == "left" else "TREND-RADIUS-SHRINKS-DOWN"
            ),
        },
        {
            "index": 2,
            "text": "They are the same, because the periodic table is a grid of equal steps.",
            "misconception": "TREND-GRID-IS-UNIFORM",
        },
    ]
    return Variant(
        template_id="trend.radius.v1",
        seed=seed,
        prompt=prompt,
        key="0",
        node="GEN1.RADIUS",
        grader="mc",
        meta={
            "choices": choices,
            "correct_index": 0,
            "relation": reason,
            "answer": answer,
            "constant_source": _TREND_SOURCE,
        },
    )


def ver_radius_trend(v: Variant) -> VerifierResult:
    # Independent route: apply the trend from its cause rather than from the
    # keyed letter. Across a period the shell number is fixed and the nuclear
    # charge rises, so the atom contracts to the right. Down a group a whole
    # shell is added, which dominates. Both say Q.
    if v.meta["relation"] == "left":
        derived = "Q"  # further left in the same period means lower Zeff pull
        why = "same shell, less nuclear charge to the left, so a larger atom"
    else:
        derived = "Q"  # one period below means an extra shell
        why = "an extra occupied shell below, which outweighs the added charge"
    if derived != v.meta["answer"]:
        return VerifierResult(False, "trend-from-cause", f"the cause gives {derived}, key says {v.meta['answer']}")
    keyed_text = v.meta["choices"][v.meta["correct_index"]]["text"]
    if keyed_text != derived:
        return VerifierResult(False, "trend-from-cause", f"keyed choice reads {keyed_text!r}, not {derived!r}")
    problems = validate_choices(v.meta["choices"], v.meta["correct_index"])
    if problems:
        return VerifierResult(False, "trend-from-cause", "; ".join(problems))
    return VerifierResult(True, "trend-from-cause", f"{derived}: {why}")


# ---------------------------------------------------------------------------
# 8. the jump in successive ionization energies  (GEN1.IONIZATION)
# ---------------------------------------------------------------------------


def gen_ionization_jump(seed: int) -> Variant:
    valence = 2 + (seed % 4)               # 2 .. 5 valence electrons
    # Given problem data: energies rise gently within the valence shell and
    # jump hard once the core is reached. Synthesised from the seed, not taken
    # from a table, and the prompt says they are measurements for element X.
    base = 700.0 + (seed % 9) * 40.0
    energies = []
    for i in range(1, valence + 3):
        if i <= valence:
            energies.append(round(base * (1.0 + 0.55 * (i - 1)), 0))
        else:
            energies.append(round(base * (1.0 + 0.55 * (valence - 1)) * (4.2 + 0.8 * (i - valence)), 0))
    listing = ", ".join(f"IE{i + 1} = {e:.0f}" for i, e in enumerate(energies))
    return Variant(
        template_id="trend.ionization_jump.v1",
        seed=seed,
        prompt=(
            "Successive ionization energies measured for an element X, in "
            f"kJ/mol, are: {listing}. How many valence electrons does X have? "
            "Report a whole number."
        ),
        key=str(valence),
        node="GEN1.IONIZATION",
        grader="numeric",
        meta={
            "unit": "",
            "value": float(valence),
            "energies": energies,
            "sig_figs": None,
            "constant_source": (
                "Successive ionization energies rise gently within a shell and "
                "jump sharply when a core shell is broken into; the position of "
                "that jump counts the valence electrons"
            ),
        },
    )


def ver_ionization_jump(v: Variant) -> VerifierResult:
    # Independent route: find the jump from the data instead of trusting the
    # generator's loop bound. Take successive ratios and locate the largest.
    # The valence count is the index just before it.
    energies = v.meta["energies"]
    ratios = [energies[i + 1] / energies[i] for i in range(len(energies) - 1)]
    biggest = max(range(len(ratios)), key=lambda i: ratios[i])
    derived = biggest + 1
    if derived != int(v.meta["value"]):
        return VerifierResult(
            False, "largest-ratio", f"the biggest jump implies {derived} valence electrons, key says {int(v.meta['value'])}"
        )
    # The jump has to be unmistakable, otherwise the item is a guess.
    others = [r for i, r in enumerate(ratios) if i != biggest]
    if others and ratios[biggest] < 2.0 * max(others):
        return VerifierResult(
            False, "largest-ratio", f"the jump ({ratios[biggest]:.2f}) is not clearly bigger than the rest"
        )
    return VerifierResult(
        True, "largest-ratio", f"a {ratios[biggest]:.1f}x jump after IE{derived} counts {derived} valence electrons"
    )


# ---------------------------------------------------------------------------
# 9. bond polarity from electronegativity difference  (GEN1.ELECTRONEG)
# ---------------------------------------------------------------------------


def gen_electronegativity(seed: int) -> Variant:
    # Given problem data. Two hypothetical elements with stated Pauling-scale
    # values, so nothing here claims a measurement for a real element.
    en_a = round(1.0 + (seed % 13) * 0.15, 2)
    en_b = round(en_a + 0.20 + (seed % 11) * 0.22, 2)
    difference = round(en_b - en_a, 2)
    return Variant(
        template_id="trend.electronegativity.v1",
        seed=seed,
        prompt=(
            f"Two elements have electronegativities, on the Pauling scale, of "
            f"A = {en_a} and B = {en_b}. What is the electronegativity "
            "difference across the A-B bond? Report to 2 decimal places."
        ),
        key=f"{difference:.2f}",
        node="GEN1.ELECTRONEG",
        grader="numeric",
        meta={
            "unit": "",
            "value": difference,
            "en_a": en_a,
            "en_b": en_b,
            "sig_figs": None,
            "tolerance": 0.005,
            "constant_source": (
                "Electronegativity difference is defined on the Pauling scale; "
                "the two values here are given problem data, not measurements "
                "of any named element"
            ),
        },
    )


def ver_electronegativity(v: Variant) -> VerifierResult:
    # Independent route: the difference must be positive and must point from
    # the less to the more electronegative atom, and adding it back to the
    # smaller value must return the larger. That catches a sign flip, which is
    # the whole content of the item.
    if v.meta["value"] <= 0:
        return VerifierResult(False, "reconstruct", "the difference is not positive")
    rebuilt = round(v.meta["en_a"] + v.meta["value"], 2)
    if not math.isclose(rebuilt, v.meta["en_b"], abs_tol=1e-9):
        return VerifierResult(
            False, "reconstruct", f"adding the difference back gives {rebuilt}, not {v.meta['en_b']}"
        )
    return VerifierResult(
        True, "reconstruct", f"{v.meta['en_a']} + {v.meta['value']} = {v.meta['en_b']}, polarity toward B"
    )


# ---------------------------------------------------------------------------
# Registration data
# ---------------------------------------------------------------------------

TEMPLATES_G1_U6: dict[str, dict[str, object]] = {
    "light.photon_energy.v1": {
        "gen": gen_photon_energy, "ver": ver_photon_energy,
        "node": "GEN1.LIGHT", "grader": "numeric",
    },
    "spectra.bohr_transition.v1": {
        "gen": gen_bohr_transition, "ver": ver_bohr_transition,
        "node": "GEN1.SPECTRA", "grader": "numeric",
    },
    "quantum.orbital_meaning.v1": {
        "gen": gen_orbital_meaning, "ver": ver_orbital_meaning,
        "node": "GEN1.QUANTUMMODEL", "grader": "mc",
    },
    "quantum.subshell_capacity.v1": {
        "gen": gen_subshell_capacity, "ver": ver_subshell_capacity,
        "node": "GEN1.QUANTUMNUMBERS", "grader": "numeric",
    },
    "config.valence_count.v1": {
        "gen": gen_valence_count, "ver": ver_valence_count,
        "node": "GEN1.ELECTRONCONFIG", "grader": "numeric",
    },
    "config.ion_config.v1": {
        "gen": gen_ion_config, "ver": ver_ion_config,
        "node": "GEN1.CONFIGEXCEPTIONS", "grader": "mc",
    },
    "trend.radius.v1": {
        "gen": gen_radius_trend, "ver": ver_radius_trend,
        "node": "GEN1.RADIUS", "grader": "mc",
    },
    "trend.ionization_jump.v1": {
        "gen": gen_ionization_jump, "ver": ver_ionization_jump,
        "node": "GEN1.IONIZATION", "grader": "numeric",
    },
    "trend.electronegativity.v1": {
        "gen": gen_electronegativity, "ver": ver_electronegativity,
        "node": "GEN1.ELECTRONEG", "grader": "numeric",
    },
}


HINTS_G1_U6: dict[str, tuple[str, str, str]] = {
    "light.photon_energy.v1": (
        "You are given how long the wave is and asked how much energy one "
        "photon of it carries.",
        "Energy and wavelength are inversely related through h and c. Before "
        "you divide, get the wavelength into metres: the constants are in SI "
        "and nanometres are not.",
        "Multiply h by c, then divide by the wavelength in metres. Write the "
        "wavelength as a number times ten to a power and stop there.",
    ),
    "spectra.bohr_transition.v1": (
        "The electron drops to a lower level. You want the change in the atom's "
        "energy, which is where it ended minus where it started.",
        "Work out the energy of each level separately from the formula, "
        "remembering both are negative, then subtract the starting level from "
        "the final one. A fall should come out negative.",
        "Write E for the upper and lower levels as two negative numbers, and "
        "stop before subtracting.",
    ),
    "quantum.orbital_meaning.v1": (
        "Ask yourself what the shading in an orbital picture is actually "
        "showing you.",
        "The quantum model gives up on knowing where the electron is at any "
        "instant. What it provides instead is the chance of finding it in a "
        "region, which is what the shape encodes.",
        "Rule out any answer that implies the electron follows a track or is "
        "stopped by a wall.",
    ),
    "quantum.subshell_capacity.v1": (
        "You want the total number of electrons this subshell can take.",
        "Count the orbitals in the subshell first, from the allowed values of "
        "the magnetic quantum number, then remember each orbital takes two "
        "electrons of opposite spin.",
        "Write out the m_l values from minus l to plus l, count them, and stop "
        "before doubling.",
    ),
    "config.valence_count.v1": (
        "You are asked how many electrons are in the outer shell, not how many "
        "the atom has in total.",
        "The part in square brackets is a noble gas core and is not valence. "
        "Everything after it that shares the highest principal number counts.",
        "Look at the numbers written in front of the s and p labels after the "
        "bracket, take the largest, and add the superscripts on that shell.",
    ),
    "config.ion_config.v1": (
        "Two electrons are being removed. The question is which two.",
        "Once the 3d subshell is occupied it sits below 4s in energy, so the 4s "
        "electrons are the outermost and are the ones that leave. This is not "
        "the order they were filled in, which is the point.",
        "Take both electrons out of 4s and leave 3d untouched, then count the "
        "electrons in your answer and check it is two fewer than the atom.",
    ),
    "trend.radius.v1": (
        "One of these two atoms is bigger. Think about what changes between "
        "them.",
        "Across a period the shell stays the same while the nuclear charge "
        "grows, pulling the cloud in. Down a group a whole new shell is added, "
        "and that wins.",
        "Decide first whether you are moving across or down, then apply the "
        "matching cause.",
    ),
    "trend.ionization_jump.v1": (
        "The numbers rise steadily and then leap. That leap is telling you "
        "something structural.",
        "Removing an electron from the outer shell gets gradually harder. "
        "Breaking into a full inner shell is much harder, so the jump marks the "
        "moment the valence shell ran out.",
        "Divide each energy by the one before it, find the largest ratio, and "
        "count how many ionizations happened before it.",
    ),
    "trend.electronegativity.v1": (
        "You are asked for the size of the gap between the two values.",
        "Take the larger value minus the smaller so the difference comes out "
        "positive. It is that size, not the sign, that says how polar the bond "
        "is.",
        "Subtract the smaller number from the larger and keep two decimal "
        "places.",
    ),
}


MISCONCEPTIONS_G1_U6: dict[str, Misconception] = {
    m.code: m
    for m in [
        Misconception(
            code="QM-ORBIT-IS-A-PATH",
            name="An orbital is the electron's path",
            description=(
                "The learner carries the planetary picture forward and reads the "
                "orbital drawing as the route the electron travels, rather than "
                "as a region it is likely to occupy."
            ),
            counterexample=(
                "A 2p orbital has a node at the nucleus where the probability is "
                "exactly zero, yet the electron is found on both lobes. No "
                "continuous path could cross a region it never occupies."
            ),
            routes_to="GEN1.QUANTUMMODEL",
            source=_OBSERVED,
        ),
        Misconception(
            code="QM-BOUNDARY-IS-SOLID",
            name="The orbital surface is a physical wall",
            description=(
                "The learner treats the drawn boundary as a shell the electron "
                "cannot pass, rather than as a contour chosen to enclose most of "
                "the probability."
            ),
            counterexample=(
                "The usual surface encloses about 90 percent of the probability, "
                "so roughly one time in ten the electron is outside it. A wall "
                "would make that impossible."
            ),
            routes_to="GEN1.QUANTUMMODEL",
            source=_OBSERVED,
        ),
        Misconception(
            code="CONFIG-REMOVE-D-FIRST",
            name="Electrons leave in the reverse of the filling order",
            description=(
                "Because 4s fills before 3d, the learner concludes 3d must empty "
                "first, applying the Aufbau order backwards to ionization."
            ),
            counterexample=(
                "Fe2+ is [Ar] 3d6, not [Ar] 4s2 3d4. Once 3d is occupied it lies "
                "below 4s, so 4s is outermost and goes first."
            ),
            routes_to="GEN1.CONFIGEXCEPTIONS",
            source=_OBSERVED,
        ),
        Misconception(
            code="CONFIG-REMOVE-EVENLY",
            name="Charge is shared out across the outer subshells",
            description=(
                "The learner removes electrons one from each outer subshell in "
                "turn, treating ionization as a balanced withdrawal rather than "
                "as removing whichever electron is highest in energy."
            ),
            counterexample=(
                "Fe2+ is [Ar] 3d6, not [Ar] 4s1 3d5. Both electrons come from "
                "4s, because both 4s electrons are above 3d once 3d is filled."
            ),
            routes_to="GEN1.CONFIGEXCEPTIONS",
            source=_OBSERVED,
        ),
        Misconception(
            code="TREND-RADIUS-FOLLOWS-MASS",
            name="Heavier atoms are always bigger",
            description=(
                "The learner uses mass as a proxy for size, so moving right "
                "across a period, where mass increases, is expected to make the "
                "atom larger."
            ),
            counterexample=(
                "Across a period the atom gets heavier and SMALLER, because the "
                "added protons pull the same shell in tighter than the added "
                "electron pushes it out."
            ),
            routes_to="GEN1.RADIUS",
            source=_OBSERVED,
        ),
        Misconception(
            code="TREND-RADIUS-SHRINKS-DOWN",
            name="More protons always mean a smaller atom",
            description=(
                "Having learned that nuclear charge contracts the atom, the "
                "learner applies it going down a group as well, where a new "
                "shell is added and dominates."
            ),
            counterexample=(
                "Going down a group the nuclear charge rises sharply and the "
                "atom still gets bigger, because an entire new shell sits "
                "outside the old one."
            ),
            routes_to="GEN1.RADIUS",
            source=_OBSERVED,
        ),
        Misconception(
            code="TREND-GRID-IS-UNIFORM",
            name="Neighbouring elements are interchangeable",
            description=(
                "The learner treats the table as an evenly spaced grid in which "
                "nearby elements have essentially the same properties, so a "
                "comparison has no answer."
            ),
            counterexample=(
                "Sodium and magnesium are neighbours in one period, and their "
                "atomic radii differ by roughly a third. Adjacency does not mean "
                "equality."
            ),
            routes_to="GEN1.RADIUS",
            source=_OBSERVED,
        ),
    ]
}

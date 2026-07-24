# OCTET

**Orbitals, Compounds, Thermodynamics, Equilibria, Transformations.** The
chemistry vertical of EUREKA, from general chemistry through organic.

> The founding directive: AI platforms give students answers, OCTET teaches
> chemistry. The learner draws the structure, pushes the arrows, predicts the
> product before the simulation runs, and proposes the synthesis. The platform
> diagnoses the belief behind every error and withholds solutions behind hint
> ladders.

Current state: Phase 0 and Phase 1 complete. See [docs/STATUS.md](docs/STATUS.md)
for the honest register, including what is deliberately not built yet.

## What exists today

A deterministic chemistry grading engine with an independent verifier behind
every grader, exposed over an authenticated API.

- 5 graders live: formula, balance, stoichiometry, multiple choice, equilibrium.
- Every answer key is verified by a second computational path before it is
  served. The formula key is checked by RDKit, the balancing key by
  conservation arithmetic that never calls SymPy, the stoichiometry key by a
  pint route through different units, the equilibrium key by substituting the
  root back into the mass action expression.
- 19 named misconceptions with literature citations, counterexamples and
  remediation routing.
- Three rung hint ladders on every template, enforced in CI and at the API.

## Quick start

```bash
# Tests and the 12 seed verification sweep
cd octet
pip install -e packages/chem_core
pytest packages/chem_core/tests -q

# The API
docker compose up -d
curl localhost:8500/health
curl localhost:8500/ready     # reports whether the grading engine self verified
```

The API requires a EUREKA issued token. OCTET does not own identity.

## Layout

```
octet/
  apps/api/            FastAPI service (AXIOM skeleton, OCTET_ env prefix)
    app/core/          settings, async DB session, EUREKA SSO bridge
    app/domains/       grading (with the sandbox), chemistry models
  packages/chem_core/  every grader, verifier, misconception, hint ladder
  docs/                integration contract, status
```

`chem_core` has no database, no network and no web framework, so the chemistry
can be tested in isolation from everything else.

## The rules this codebase is built on

1. Every grader ships with an independent verifier or it does not ship.
2. Grading runs against the stored key of the issued variant, never a value
   recomputed at grade time.
3. No path shows a solution before an attempt. Hints ladder orient, method,
   first step. The API refuses a rung above the one the learner has unlocked.
4. A wrong answer is evidence about a belief. Feedback names the belief and
   shows a counterexample. "Incorrect, the answer is 7" is prohibited output.
5. No hand rolled science. SMILES parsing, stereo perception, molar masses and
   unit conversion come from pinned libraries.
6. Chemistry facts live in reviewed data files with cited sources, never inline
   in code, and nothing claims expert review it has not had.
7. Grading is sandboxed before it is publicly reachable.

## Safety

No synthesis routes, quantities or conditions for weapons, explosives,
chemical warfare agents or controlled substances. The retrosynthesis target
pool is the curated library only, and `molecules.safety_flags` excludes an
entry from every generative surface including tutor retrieval. Simulations
state plainly that they do not substitute for supervised laboratory training.

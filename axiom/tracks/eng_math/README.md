# AXIOM Linear Algebra Unit 1: seed data and grading core

Runnable proof-of-model for the AXIOM Engineering Mathematics track. This is the
first buildable slice: the Unit 1 knowledge graph, a verified item set with a
parameterized template, the misconception library, and the SymPy grading core
that all of it runs on. Everything here executes and is verified end to end.

## Files

- `axiom_schemas.py` Pydantic v2 schemas (the shape contract for seed data).
- `axiom_grading.py` SymPy grading and the verified-everything gate.
- `linalg_unit1_seed.json` The Unit 1 seed: 11 nodes, 10 edges, 10 misconceptions, 5 items (one a parameterized template).
- `demo_verify.py` End-to-end demo that validates and exercises everything.

## Run

```
pip install sympy pydantic
python3 demo_verify.py
```

## What the demo proves

1. The seed validates against the schemas and passes referential integrity (every edge, misconception route, and distractor key resolves).
2. The verified-everything gate recomputes each static key with SymPy, so no answer key is author-asserted.
3. The parameterized template seeds distinct variants, each verified to have a unique solution equal to its intended answer.
4. The graders accept correct responses in varied equivalent forms (4/2 for 2, any valid RREF reduction path, any valid basis for a solution set) and reject wrong ones, and a misconception-keyed distractor produces a diagnosis and a remediation node rather than just a score.

## How this maps to the platform

- `axiom_schemas.py` is the `shared_schemas` package from the build prompt.
- `axiom_grading.py` is the `math_core` package (the CAS grader plus the parameterized-item resolver).
- `linalg_unit1_seed.json` is what the curriculum and content loaders ingest.
- The misconception routing in the demo is the input to the adaptive engine.

The live-platform integration of this slice (fine-grained N1-N11 nodes, the
misconception model + remediation routing, and the rref / solution_set /
solution_point graders + the 3x3 template wired into `math_core` and the grading
service) is tracked separately as wave EM-2. This directory stays as the
self-contained, dependency-light proof that the model works.

## Next build targets

- Wrap `axiom_grading` in the grading service API and add step-credit milestone checking for partial credit on multi-step work.
- Add the remaining Unit 1 lessons and the interactive column-picture and row-picture visualizations tied to nodes N4 and N5.
- Extend the same pattern to Unit 2 (matrix algebra and inverses), then across the Linear Algebra skill graph, before starting ODEs.

# XR chemistry labs

Two built-in portals share this directory:

- `/dashboard/xr-labs/molecules` — Organic Chemistry 3D, against OCTET ORG1/ORG2
- `/dashboard/xr-labs/general-chemistry` — General Chemistry 3D, against GEN1/GEN2

## The rule this directory is built on

**Nothing chemical is typed by hand.** Coordinates, formulas, hybridisation,
aromaticity, CIP descriptors, lone pairs, titration curves, equilibrium
outcomes, proton environments and degrees of unsaturation are all derived by
RDKit or `chem_core` at export time. If a number is chemistry, it came out of
a program; if it came out of a book, it is labelled as cited and the source is
named.

This is not fastidiousness. Hand-typed chemistry is wrong in ways that survive
review, because a plausible wrong geometry renders as a confident, attractive
picture. Every defect this pipeline has caught was invisible to reading:

- `torsionLabel` had an inverted circular-distance helper and called the anti
  conformer "Syn" — telling learners the most stable conformer was the least.
- The Newman builder produced the negative of the dihedral it was asked for,
  so the readout disagreed with the model beside it.
- MMFF94 has no parameters for hypervalent S or P, or for boron. RDKit returns
  the raw embedding without saying so, and SF6 came out nothing like
  octahedral. BF3's angles were 118.2 / 119.1 / 122.7, close enough to 120 to
  pass a glance.
- Reading the triangle views from three modules produced 70 rows for 44 views,
  because the organic ones were counted twice.

Each of those was caught by a check, not by looking.

## Generated files

Both are committed, and both are reproducible. Do not edit them by hand.

| File | Produced by | Needs |
|---|---|---|
| `moleculeData.ts` | `scripts/gen_molecule_data.py` | RDKit |
| `chemContent.ts` | `scripts/gen_chem_content.py` | RDKit + `chem_core` + OCTET's `app.data` |

RDKit and `chem_core` live in the OCTET api image, not in this app, so both
scripts run inside that container. From the **octet** directory:

```sh
docker compose exec -T api python - \
  < ../eureka/apps/web/scripts/gen_molecule_data.py \
  > ../eureka/apps/web/src/app/dashboard/xr-labs/_chem/moleculeData.ts

docker compose exec -T api python - \
  < ../eureka/apps/web/scripts/gen_chem_content.py \
  > ../eureka/apps/web/src/app/dashboard/xr-labs/_chem/chemContent.ts
```

Both use a fixed random seed, so regenerating without changing an input
produces a byte-identical file. Both **fail the build rather than emit
something unverified**: `gen_molecule_data.py` refuses a geometry no force
field optimised, and `gen_chem_content.py` refuses a POE item whose answer key
disagrees with its own simulation.

## Layout

| File | What it is |
|---|---|
| `types.ts`, `contentTypes.ts` | Shapes only, no data |
| `elements.ts` | CPK colours, van der Waals radii, Pauling electronegativity, the VSEPR table |
| `procedural.ts` | Parametric geometry: torsions, chair inversion, VSEPR shapes, measurement |
| `genchem.ts` | VSEPR catalogue, ionic lattices, hydrogenic orbitals, water dimer |
| `MoleculeScene.tsx` | The shared renderer both labs use |
| `Bench.tsx` | Titration bench, equilibrium vessel, titration curve |
| `Triangle.tsx` | Johnstone tri-pane |
| `Spectra.tsx` | NMR / IR / MS panels |
| `Poe.tsx` | Predict-observe-explain loop |
| `Tour.tsx` | Guided tour and keyboard orbit |
| `mastery.ts` | Sends POE outcomes to `user_progress` |
| `ui.tsx` | Shared HUD chrome |

## Tests

`procedural.test.ts` and `content.test.ts`, run with `npx vitest run`.

They assert the claims the labs make in words against the geometry and data
they actually render: torsion energies against the cited stationary points,
chair bond lengths and axial/equatorial assignment, VSEPR angles and
lone-pair placement rules, titration curve monotonicity and landmark pH
values, derived NMR signal counts, and — most importantly — that the orbital
clouds are sampled from real hydrogenic wavefunctions, with nodes in the
correct places and the correct phase either side of them. A point cloud that
is merely the right general shape looks completely convincing in a
screenshot, so shape alone is not evidence.

## Honesty conventions carried in the UI

These are shown to learners, not just written here:

- **Computed vs idealised.** A conformer from RDKit is labelled computed and
  explicitly not a crystal structure. An exact chair or VSEPR shape is
  labelled idealised. Cited experimental numbers stay cited.
- **Coverage.** Four VSEPR shapes (seesaw, T-shaped, square pyramidal, square
  planar) are standard first-year content but absent from OCTET's GEN1.VSEPR
  lesson today. They carry no node badge, and the panel says the lab is
  extending the lesson rather than mirroring it.
- **Review status.** The triangle views are `REVIEW = "pending"` upstream, and
  the panel says so rather than implying expert verification.
- **Answer-key provenance.** Every POE item displays whether its key was
  checked against a simulation, and the chair-flip item — which is authored
  locally rather than exported from OCTET — says it was not.

## A correction, kept on the record

An earlier version of this file, and commit `d1b4d85f`, claimed that OCTET
documented an `outcome_rule` mechanism it did not implement, and that POE
answer keys "have never actually been checked upstream."

**That was wrong.** The mechanism exists and always did:

- `simulations.py` registers a rule per item through an `@_rule` decorator into
  `OUTCOME_RULES`
- `run_scenario(scenario_id)` executes the item's scenario
- `test_phase3.test_every_poe_key_agrees_with_its_own_simulation` already runs
  the pair over the whole registry

The error came from grepping for the lowercase `outcome_rule` used in the
module docstring rather than the `OUTCOME_RULES` identifier that implements it,
and treating one empty search as proof of absence. Acting on that false premise
then broke the working check by bolting a competing mechanism onto `PoeItem`,
which took six OCTET tests down with it. Both were reverted.

`gen_chem_content.py` now calls OCTET's own `OUTCOME_RULES` and
`verify_prediction_key` rather than re-deriving outcomes with its own
predicates. It still refuses to export an item that has no registered rule or
whose key disagrees, so the boundary is a gate rather than a second
implementation to keep in step.

The lesson generalises: absence is much harder to establish than presence, and
a single negative grep is not evidence of it.
## Simulation engines

`chem_core.simulate` carries four engines. Titration and equilibrium predate
this work; kinetics and gases were added with it.

| Engine | Solves | Outcome token |
|---|---|---|
| Titration | mass and charge balance, bisected on log10[H+] | read off the curve |
| Equilibrium | reaction quotient, extent solved numerically | direction of shift |
| Kinetics | integrated rate laws in closed form, Arrhenius as a ratio | rate ratio, classified |
| Gases | van der Waals, which reduces to ideal exactly at a = b = 0 | pressure ratio, classified |

Each ships a `verify_*` that re-derives the result by a different route: the
gas check runs the equation of state backwards, the kinetics check reads the
rate law directly rather than dividing two rates.

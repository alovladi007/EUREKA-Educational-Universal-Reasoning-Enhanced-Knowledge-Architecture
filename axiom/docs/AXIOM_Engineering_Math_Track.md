# AXIOM Engineering Mathematics Track

The first shippable slice of AXIOM. Three courses (Linear Algebra, Ordinary
Differential Equations, Partial Differential Equations with Fourier Analysis)
built as one sequenced track on a shared CAS grading engine, a shared skill
graph, and a shared misconception library. Aimed at undergraduates, graduate
students, and working engineers.

Companion to AXIOM_Build_Prompt.md and AXIOM_Curriculum_and_Proof_Extension.md.
This track is entirely CAS-gradable, so it needs none of the proof-grading
machinery. That is the point: it is buildable and trustworthy now.

## 1. Why these three, and the build order

They nest. The prerequisite structure forces the order you build in.

- Linear Algebra is the base. Eigenvalues and eigenvectors are the machinery
  that ODE systems and PDE eigenfunction expansions both run on.
- ODEs sit in the middle. Second-order linear ODEs are exactly what separation
  of variables reduces a PDE to.
- PDEs and Fourier are the flagship. Most underserved, strongest fit to the
  photonics and semiconductor background, and the reason the track has a moat.

Build order: Linear Algebra first, ODEs second, PDEs and Fourier third. Ship
Linear Algebra before starting PDEs. Linear Algebra here is the applied,
computational on-ramp to a moat course (verified practice at scale, numerical
conditioning, the direct line into ODEs and PDEs), not a standalone conceptual
intro. The product is the sequence into PDEs.

## 2. Unified skill graph (track level)

Three cross-course edges are the spine of the track:
- LA7 (eigenvalues) -> OD6 (ODE systems)
- OD3 (second-order ODEs) -> PF4 (heat equation, via separation of variables)
- LA7 + PF1 (eigenvalues + Fourier series) -> PF7 (Sturm-Liouville)

Clusters: LA1..LA9 (vectors -> systems -> matrix algebra -> subspaces ->
transformations -> determinants -> eigenvalues -> orthogonality/least squares ->
SVD); OD1..OD8 (first-order -> existence/uniqueness -> second-order linear ->
nonhomogeneous -> Laplace -> systems -> series -> phase plane/stability); and
PF1..PF9 (Fourier series -> Fourier transforms -> classification -> heat -> wave
-> Laplace -> Sturm-Liouville -> characteristics -> Green's functions).

## 3. Deep dive: Linear Algebra, Unit 1 (Vectors and Linear Systems)

The buildable beachhead. Build this unit fully (nodes, lessons, verified items,
misconceptions) before anything else. It validates the entire engine on the
largest audience and the cleanest grading.

Objectives: operate on vectors; read a linear system through both the row
picture and the column picture; reduce by elimination; classify the solution set
(none, one, or infinitely many); parameterize an infinite solution set.

Nodes N1..N11: vector operations; linear combinations; span; matrix-vector
product as a combination of columns; row picture and column picture; the system
as A x = b; Gaussian elimination to row echelon form; RREF and pivots; free
variables; existence and uniqueness; homogeneous systems. Prerequisite edges:
N1->N2->N3, N2->N4->N5->N6->N7->N8->N9->N10->N11.

Verified item set. Every answer key is checked by SymPy (linsolve, Matrix.rref,
nullspace) before the item ships; no key is author-asserted. Parameterized
templates seed distinct numbers per learner and the verifier runs on each seeded
variant.
- Item A (CAS point): solve 2x + y = 5, x - y = 1. Symbolic equivalence, step
  credit for a correct elimination step with an arithmetic slip.
- Item B (parameterized template): a seeded 3x3 integer system constrained to a
  unique integer solution; SymPy confirms uniqueness before display. One
  template, unlimited verified practice.
- Item C (RREF, exact): compare to Matrix.rref output; any valid reduction path
  is accepted because RREF is unique.
- Item D (misconception-keyed MC): classify the solution set; each wrong option
  is keyed to a specific misconception below.
- Item E (solution set): write the general solution in parametric form; the
  grader checks that the learner's parameterization spans the same solution set
  as the SymPy null space plus a particular solution; any valid basis accepted.

Misconception taxonomy (M1..M10), each with a keyed distractor and a remediation
node it routes to: M1 dimension-blind product -> N4; M2 row-picture lock-in ->
N5; M3 always-unique belief -> N10; M4 shape-equals-solvability -> N10; M5
illegal row operation -> N7; M6 REF/RREF confusion -> N8; M7 free-variable
mishandling -> N9; M8 inconsistent-homogeneous error -> N11; M9 count-based span
-> N3; M10 scalar-sign confusion -> N1. Every wrong answer maps to one code or a
plain arithmetic slip (handled by step credit). That mapping turns "you got 60
percent" into a diagnosis and a remediation target.

## 4. How ODEs and PDEs slot in (later waves)

Do not build these until Linear Algebra ships.
- ODEs, first unit: First-Order ODEs (separable, integrating factor, exact) with
  existence and uniqueness. CAS-gradable via SymPy dsolve and equivalence of the
  solution family including the arbitrary constant.
- PDEs and Fourier, first unit: Fourier Series. CAS-gradable (compute
  coefficients, check convergence, verify the series against the reference).
  Applied context lands hardest here: signal reconstruction, heat profiles, the
  setup for Fourier optics.

The shared engine means each new course adds content and a misconception set, not
new grading infrastructure.

## 5. Build status

- EM-1 (this repo, axiom/tracks/eng_math/): the runnable proof-of-model for
  Linear Algebra Unit 1 -- schemas, SymPy grading core, Unit 1 seed (11 nodes,
  10 edges, 10 misconceptions, 5 items incl. a parameterized template), and an
  end-to-end demo that validates and exercises everything. Proven: run
  `python3 demo_verify.py` -> ALL CHECKS PASSED.
- EM-2 (done): integrated the LA Unit 1 slice into the live AXIOM platform --
  the fine-grained N1..N11 nodes with lessons, a misconception model + library +
  adaptive remediation routing (new to AXIOM), and the rref / solution_set /
  solution_point graders + the 3x3 template wired into math_core and the grading
  service as first-class item kinds.
- EM-3..EM-7 (done): built out the courses on the shared engine, each adding
  content and a misconception set (and a grader only where a new one was needed):
  - ODEs, complete (Units 1-7): first-order (separable / integrating factor /
    exact) with existence-uniqueness; second-order linear (characteristic roots:
    real-distinct / repeated / complex, undetermined coefficients, superposition);
    nonhomogeneous methods (resonance, variation of parameters); Laplace
    transforms; systems (the eigenvalue method); power series solutions; and
    phase plane / stability. New graders: grade_ode (verify a proposed y(x) solves
    the ODE, with a general-solution order check), grade_laplace (forward /
    inverse transform vs SymPy).
  - Linear Algebra Unit 7 (Eigenvalues): eigenvalues, eigenvectors, algebraic vs
    geometric multiplicity, diagonalization. New grader: grade_eigenvalues /
    grade_eigenvector. The track spine edge LA7 -> ODE systems is wired.
  - PDEs and Fourier Unit 1 (Fourier Series): the Euler coefficient formulas,
    even/odd cosine/sine series, convergence and the Gibbs phenomenon, Parseval.
    New grader: grade_fourier_coefficient (a0 / a_n / b_n by SymPy exact
    integration). The spine edge second-order ODE -> Fourier is wired.
  Every grader has a verified-everything gate and a math_core test module; every
  new item kind (ode_solution, laplace_transform, inverse_laplace, eigenvalues,
  eigenvector, fourier_coefficient) is wired into the grading service; each unit
  was seeded live and grade-verified end-to-end.
- EM-8..EM-18 (done): ALL THREE COURSES COMPLETE. Linear Algebra LA1-LA9
  (vectors/systems, matrix algebra, subspaces, transformations, rank,
  determinants, eigenvalues, orthogonality/least squares, SVD); ODEs complete
  (Units 0-7 incl. the antiderivative foundation); PDEs and Fourier PF1-PF9
  (series, transforms, classification, heat, wave, Laplace's equation,
  Sturm-Liouville, characteristics, Green's functions). All three track-doc
  spine edges live: LA7 -> OD6 (systems), OD3 -> PF4 (heat via separation of
  variables), LA7 + PF1 -> PF7 (Sturm-Liouville). Nine CAS graders with
  verified-everything gates; the platform also gained explainable
  remediation-first serving (EM-14) and entitlement enforcement (EM-15).

"""AXIOM full curriculum: three courses, one track.

Defines the complete skill graphs, units, misconception libraries, and
diagnostic (misconception-keyed) items for:

  LA   Linear Algebra                 (9 units, 28 nodes)
  OD   Ordinary Differential Equations (8 units, 22 nodes)
  PF   PDEs and Fourier Analysis       (9 units, 24 nodes)

Cross-course prerequisite edges encode the Engineering Mathematics spine:
eigenvalues feed ODE systems, second-order ODEs feed separation of variables,
and eigen plus Fourier feed Sturm-Liouville.

Run this file to emit axiom_full_curriculum.json and print integrity results.
Plain ASCII throughout, per house style.
"""

from __future__ import annotations

import json


def N(nid, unit, kind, title, desc):
    return {"id": nid, "unit": unit, "kind": kind, "title": title,
            "description": desc, "standards": []}


def E(src, tgt):
    return {"source": src, "target": tgt, "relation": "prerequisite"}


def M(code, name, desc, routes_to):
    return {"code": code, "name": name, "description": desc,
            "routes_to": routes_to}


# ===========================================================================
# LINEAR ALGEBRA (LA)
# ===========================================================================

LA_UNITS = [
    ("LA-U1", "Vectors and Linear Systems"),
    ("LA-U2", "Matrix Algebra and Inverses"),
    ("LA-U3", "Subspaces, Basis, and Dimension"),
    ("LA-U4", "Linear Transformations"),
    ("LA-U5", "Determinants"),
    ("LA-U6", "Eigenvalues and Eigenvectors"),
    ("LA-U7", "Orthogonality and Projections"),
    ("LA-U8", "Least Squares and QR"),
    ("LA-U9", "SVD and Applications"),
]

LA_NODES = [
    # U1 (condenses the earlier N1..N11 pilot into course-scale nodes)
    N("LA01", "LA-U1", "computational", "Vector operations and linear combinations",
      "Addition, scalar multiplication, and forming weighted sums of vectors."),
    N("LA02", "LA-U1", "concept", "Span and the column picture",
      "The set of all combinations of given vectors; A x as a combination of columns."),
    N("LA03", "LA-U1", "computational", "Gaussian elimination and RREF",
      "Row reduction to echelon and reduced echelon form; pivots."),
    N("LA04", "LA-U1", "concept", "Existence, uniqueness, and free variables",
      "Classifying solution sets from pivots; parameterizing infinite families."),
    # U2
    N("LA05", "LA-U2", "computational", "Matrix multiplication",
      "Row-column products, composition meaning, non-commutativity."),
    N("LA06", "LA-U2", "computational", "Matrix inverse",
      "Invertibility, 2x2 formula, Gauss-Jordan inversion, inverse of a product."),
    N("LA07", "LA-U2", "concept", "Elementary matrices and LU",
      "Row operations as matrix multiplication; factoring A = LU."),
    # U3
    N("LA08", "LA-U3", "concept", "Subspaces, null space, column space",
      "Closure under the operations; the four ways a subspace arises from A."),
    N("LA09", "LA-U3", "concept", "Linear independence",
      "When the only combination giving zero is trivial; tests via RREF."),
    N("LA10", "LA-U3", "concept", "Basis and dimension",
      "Minimal spanning sets; every basis has the same size."),
    N("LA11", "LA-U3", "concept", "Rank and the rank-nullity theorem",
      "rank(A) + nullity(A) = n and what it forces about solutions."),
    # U4
    N("LA12", "LA-U4", "concept", "Linear transformations and their matrices",
      "T(x) = A x; finding A from the images of basis vectors."),
    N("LA13", "LA-U4", "computational", "Geometry of transformations",
      "Rotations, reflections, shears, scalings in the plane."),
    N("LA14", "LA-U4", "concept", "Kernel, image, and invertibility of maps",
      "One-to-one and onto in matrix language."),
    # U5
    N("LA15", "LA-U5", "computational", "Determinants: computation",
      "Cofactor expansion and row-reduction computation; triangular shortcut."),
    N("LA16", "LA-U5", "concept", "Determinants: properties and meaning",
      "Multiplicativity, det = 0 iff singular, volume scaling."),
    # U6
    N("LA17", "LA-U6", "computational", "Characteristic polynomial and eigenvalues",
      "det(A - lambda I) = 0; algebraic multiplicity."),
    N("LA18", "LA-U6", "computational", "Eigenvectors and eigenspaces",
      "Null space of A - lambda I; geometric multiplicity."),
    N("LA19", "LA-U6", "concept", "Diagonalization",
      "A = P D P^{-1}; when a basis of eigenvectors exists; powers of A."),
    N("LA20", "LA-U6", "concept", "Symmetric matrices and the spectral theorem",
      "Real eigenvalues, orthogonal eigenvectors, orthogonal diagonalization."),
    # U7
    N("LA21", "LA-U7", "computational", "Dot product, norms, and angles",
      "Inner products, length, orthogonality, Cauchy-Schwarz."),
    N("LA22", "LA-U7", "computational", "Projection onto lines and subspaces",
      "proj formulas; the projection matrix P = A (A^T A)^{-1} A^T."),
    N("LA23", "LA-U7", "computational", "Gram-Schmidt and orthonormal bases",
      "Producing orthonormal bases; why orthonormal columns are convenient."),
    # U8
    N("LA24", "LA-U8", "computational", "Least squares via normal equations",
      "Minimizing ||A x - b||; A^T A x = A^T b; fitting lines to data."),
    N("LA25", "LA-U8", "concept", "QR factorization and conditioning",
      "A = QR; why QR beats normal equations numerically."),
    # U9
    N("LA26", "LA-U9", "concept", "Singular value decomposition",
      "A = U S V^T; singular values as the geometry of any matrix."),
    N("LA27", "LA-U9", "concept", "Low-rank approximation and PCA",
      "Eckart-Young; principal components as an SVD of centered data."),
    N("LA28", "LA-U9", "computational", "Condition number and numerical sanity",
      "kappa(A) = s_max / s_min; when computed answers deserve distrust."),
]

LA_EDGES = [
    E("LA01", "LA02"), E("LA02", "LA03"), E("LA03", "LA04"),
    E("LA03", "LA05"), E("LA05", "LA06"), E("LA06", "LA07"),
    E("LA04", "LA08"), E("LA08", "LA09"), E("LA09", "LA10"),
    E("LA10", "LA11"),
    E("LA05", "LA12"), E("LA12", "LA13"), E("LA11", "LA14"), E("LA12", "LA14"),
    E("LA06", "LA15"), E("LA15", "LA16"),
    E("LA16", "LA17"), E("LA17", "LA18"), E("LA18", "LA19"),
    E("LA19", "LA20"),
    E("LA01", "LA21"), E("LA21", "LA22"), E("LA22", "LA23"),
    E("LA22", "LA24"), E("LA23", "LA25"), E("LA24", "LA25"),
    E("LA20", "LA26"), E("LA25", "LA26"), E("LA26", "LA27"), E("LA26", "LA28"),
]

LA_MISCONCEPTIONS = [
    M("LAM01", "Dimension-blind product",
      "Multiplies matrices entrywise or ignores shape compatibility.", "LA05"),
    M("LAM02", "Commutativity assumption",
      "Assumes A B = B A in general.", "LA05"),
    M("LAM03", "Always-unique belief",
      "Assumes every linear system has exactly one solution.", "LA04"),
    M("LAM04", "Inverse-always-exists belief",
      "Inverts a matrix without checking invertibility, or writes 1/A entrywise.", "LA06"),
    M("LAM05", "Determinant linearity error",
      "Believes det(A + B) = det A + det B or det(cA) = c det A for n > 1.", "LA16"),
    M("LAM06", "Independence by count",
      "Judges independence by how many vectors there are, not by combinations.", "LA09"),
    M("LAM07", "Rank equals row count",
      "Confuses the number of rows or equations with the rank.", "LA11"),
    M("LAM08", "Zero-vector eigenvector",
      "Offers the zero vector as an eigenvector, or rejects eigenvalue 0 as impossible.", "LA18"),
    M("LAM09", "Eigenvalue-of-sum error",
      "Assumes eigenvalues of A + B are sums of eigenvalues of A and B.", "LA17"),
    M("LAM10", "Projection idempotence miss",
      "Expects projecting twice to move the vector again; misses P^2 = P.", "LA22"),
    M("LAM11", "Normal-equations blindness",
      "Solves A x = b directly when the system is inconsistent instead of least squares.", "LA24"),
    M("LAM12", "Orthogonal-means-perpendicular-entries",
      "Thinks a matrix is orthogonal when entries look symmetric, not when Q^T Q = I.", "LA23"),
]

LA_MC_ITEMS = [
    {
        "id": "LA-D1", "node_id": "LA05", "grader": "mc",
        "stem": "A is 2x3 and B is 3x2. Which product is defined, and what is its shape?",
        "choices": [
            {"key": "a", "text": "AB is 2x2 and BA is 3x3; both are defined", "correct": True},
            {"key": "b", "text": "Only AB is defined; BA is not", "correct": False, "misconception": "LAM01"},
            {"key": "c", "text": "AB = BA whenever both are defined", "correct": False, "misconception": "LAM02"},
            {"key": "d", "text": "Neither is defined because the shapes differ", "correct": False, "misconception": "LAM01"},
        ],
    },
    {
        "id": "LA-D2", "node_id": "LA16", "grader": "mc",
        "stem": "A is 3x3 with det A = 2. What is det(2A)?",
        "choices": [
            {"key": "a", "text": "16", "correct": True},
            {"key": "b", "text": "4", "correct": False, "misconception": "LAM05"},
            {"key": "c", "text": "2", "correct": False, "misconception": "LAM05"},
            {"key": "d", "text": "8", "correct": False, "misconception": "LAM05"},
        ],
    },
    {
        "id": "LA-D3", "node_id": "LA18", "grader": "mc",
        "stem": "Which statement about eigenvectors is true?",
        "choices": [
            {"key": "a", "text": "An eigenvector must be nonzero, but eigenvalue 0 is allowed", "correct": True},
            {"key": "b", "text": "The zero vector is an eigenvector for every eigenvalue", "correct": False, "misconception": "LAM08"},
            {"key": "c", "text": "A matrix with eigenvalue 0 cannot exist", "correct": False, "misconception": "LAM08"},
            {"key": "d", "text": "Eigenvalues of A + B are the sums of eigenvalues of A and B", "correct": False, "misconception": "LAM09"},
        ],
    },
    {
        "id": "LA-D4", "node_id": "LA09", "grader": "mc",
        "stem": "Three vectors in R^3. Which conclusion is valid?",
        "choices": [
            {"key": "a", "text": "They may be independent or dependent; test the only-trivial-combination condition", "correct": True},
            {"key": "b", "text": "Three vectors in R^3 are always independent", "correct": False, "misconception": "LAM06"},
            {"key": "c", "text": "Three vectors always span R^3", "correct": False, "misconception": "LAM06"},
            {"key": "d", "text": "Independence is impossible to determine without lengths", "correct": False, "misconception": "LAM06"},
        ],
    },
    {
        "id": "LA-D5", "node_id": "LA22", "grader": "mc",
        "stem": "P projects onto a subspace. What is P(P(v))?",
        "choices": [
            {"key": "a", "text": "P(v): projecting an already-projected vector changes nothing", "correct": True},
            {"key": "b", "text": "A vector strictly closer to the subspace than P(v)", "correct": False, "misconception": "LAM10"},
            {"key": "c", "text": "The zero vector", "correct": False, "misconception": "LAM10"},
            {"key": "d", "text": "v itself", "correct": False, "misconception": "LAM10"},
        ],
    },
]

# ===========================================================================
# ORDINARY DIFFERENTIAL EQUATIONS (OD)
# ===========================================================================

OD_UNITS = [
    ("OD-U1", "First-Order Equations"),
    ("OD-U2", "Modeling and Qualitative Behavior"),
    ("OD-U3", "Second-Order Linear Equations"),
    ("OD-U4", "Nonhomogeneous Equations and Resonance"),
    ("OD-U5", "Laplace Transform Methods"),
    ("OD-U6", "Systems of ODEs"),
    ("OD-U7", "Series Solutions"),
    ("OD-U8", "Phase Plane and Stability"),
]

OD_NODES = [
    N("OD01", "OD-U1", "computational", "Separable equations",
      "Separating variables, integrating, and recovering the constant."),
    N("OD02", "OD-U1", "computational", "Linear first-order and integrating factors",
      "y' + p(x) y = q(x) solved by the integrating factor e^{int p}."),
    N("OD03", "OD-U1", "concept", "Existence, uniqueness, and interval of validity",
      "Picard conditions; where a solution is guaranteed and where it can fail."),
    N("OD04", "OD-U1", "computational", "Exact equations",
      "M dx + N dy = 0 with M_y = N_x; recovering the potential function."),
    N("OD05", "OD-U2", "concept", "Modeling with first-order ODEs",
      "Growth and decay, mixing, cooling, and reading a model from a scenario."),
    N("OD06", "OD-U2", "concept", "Autonomous equations and equilibria",
      "Phase line, stable and unstable equilibria, qualitative sketching."),
    N("OD07", "OD-U3", "computational", "Homogeneous constant-coefficient equations",
      "Characteristic roots: distinct real, repeated, complex."),
    N("OD08", "OD-U3", "concept", "Linear independence and the Wronskian",
      "Fundamental sets of solutions; general solution structure."),
    N("OD09", "OD-U3", "computational", "Initial value problems, second order",
      "Fitting constants to y(0) and y'(0)."),
    N("OD10", "OD-U4", "computational", "Undetermined coefficients",
      "Guessing particular solutions for polynomial, exponential, sinusoidal forcing."),
    N("OD11", "OD-U4", "computational", "Variation of parameters",
      "The general particular-solution formula from a fundamental set."),
    N("OD12", "OD-U4", "concept", "Oscillators and resonance",
      "Damped and forced oscillators; resonance and beats in engineering terms."),
    N("OD13", "OD-U5", "computational", "Laplace transforms and inverses",
      "Transform table, linearity, s-shifting."),
    N("OD14", "OD-U5", "computational", "Solving IVPs by Laplace transform",
      "Derivative rule turns an IVP into algebra; partial fractions back."),
    N("OD15", "OD-U5", "computational", "Step functions and impulses",
      "Heaviside and Dirac inputs; switched and impulsive forcing."),
    N("OD16", "OD-U6", "computational", "Linear systems x' = A x",
      "Eigenvalue method; straight-line solutions."),
    N("OD17", "OD-U6", "concept", "Complex and repeated eigenvalues in systems",
      "Spirals from complex pairs; generalized eigenvectors."),
    N("OD18", "OD-U6", "concept", "Matrix exponential",
      "e^{At} as the flow of the system; computing it via diagonalization."),
    N("OD19", "OD-U7", "computational", "Power series solutions",
      "Series about ordinary points; recurrence relations for coefficients."),
    N("OD20", "OD-U7", "concept", "Regular singular points and Frobenius",
      "Indicial equation; why Bessel-type equations need Frobenius."),
    N("OD21", "OD-U8", "concept", "Phase portraits and classification",
      "Nodes, saddles, spirals, centers from eigenvalues."),
    N("OD22", "OD-U8", "concept", "Linearization and stability of equilibria",
      "Jacobian at an equilibrium; when the linear picture is trustworthy."),
]

OD_EDGES = [
    E("OD01", "OD02"), E("OD01", "OD03"), E("OD02", "OD04"),
    E("OD01", "OD05"), E("OD05", "OD06"),
    E("OD02", "OD07"), E("OD07", "OD08"), E("OD07", "OD09"),
    E("OD09", "OD10"), E("OD10", "OD11"), E("OD09", "OD12"),
    E("OD07", "OD13"), E("OD13", "OD14"), E("OD14", "OD15"),
    E("OD07", "OD16"), E("OD16", "OD17"), E("OD17", "OD18"),
    E("OD07", "OD19"), E("OD19", "OD20"),
    E("OD16", "OD21"), E("OD21", "OD22"), E("OD06", "OD21"),
]

OD_MISCONCEPTIONS = [
    M("ODM01", "Lost constant of integration",
      "Drops the arbitrary constant, or adds it before integrating both sides.", "OD01"),
    M("ODM02", "Particular-as-general",
      "Presents one particular solution as the general solution.", "OD07"),
    M("ODM03", "Division by a vanishing factor",
      "Divides by an expression that can be zero and silently loses solutions.", "OD01"),
    M("ODM04", "Integrating factor misapplied",
      "Multiplies by e^{int p} but forgets the left side must become (mu y)'.", "OD02"),
    M("ODM05", "Characteristic-equation sign error",
      "Builds the characteristic polynomial with flipped signs from the ODE.", "OD07"),
    M("ODM06", "Complex roots discarded",
      "Treats complex characteristic roots as no solution instead of oscillation.", "OD07"),
    M("ODM07", "Resonant guess collision",
      "Uses an undetermined-coefficients guess that duplicates a homogeneous solution.", "OD10"),
    M("ODM08", "Laplace derivative rule dropped ICs",
      "Uses L{y'} = s Y instead of s Y - y(0).", "OD14"),
    M("ODM09", "Eigenvalue-free system solving",
      "Tries to solve x' = A x componentwise, ignoring the coupling.", "OD16"),
    M("ODM10", "Equilibrium stability by sign of value",
      "Judges stability by the sign of the equilibrium value, not the derivative test.", "OD06"),
    M("ODM11", "Interval-of-validity blindness",
      "Extends a solution across a singularity of the equation.", "OD03"),
    M("ODM12", "Wronskian as a number for all x",
      "Evaluates the Wronskian at one point incorrectly generalized, or treats a zero value at a point as dependence everywhere.", "OD08"),
]

OD_MC_ITEMS = [
    {
        "id": "OD-D1", "node_id": "OD07", "grader": "mc",
        "stem": "y'' + 4y = 0. Which is the general solution?",
        "choices": [
            {"key": "a", "text": "C1 cos(2x) + C2 sin(2x)", "correct": True},
            {"key": "b", "text": "C1 e^{2x} + C2 e^{-2x}", "correct": False, "misconception": "ODM05"},
            {"key": "c", "text": "No real solution exists because the roots are complex", "correct": False, "misconception": "ODM06"},
            {"key": "d", "text": "cos(2x) + sin(2x)", "correct": False, "misconception": "ODM02"},
        ],
    },
    {
        "id": "OD-D2", "node_id": "OD14", "grader": "mc",
        "stem": "Taking the Laplace transform of y' with y(0) = 3 gives:",
        "choices": [
            {"key": "a", "text": "s Y(s) - 3", "correct": True},
            {"key": "b", "text": "s Y(s)", "correct": False, "misconception": "ODM08"},
            {"key": "c", "text": "Y(s) / s", "correct": False, "misconception": "ODM08"},
            {"key": "d", "text": "s Y(s) + 3", "correct": False, "misconception": "ODM08"},
        ],
    },
    {
        "id": "OD-D3", "node_id": "OD10", "grader": "mc",
        "stem": "y'' - y = e^x. What particular-solution guess works?",
        "choices": [
            {"key": "a", "text": "A x e^x, because e^x already solves the homogeneous equation", "correct": True},
            {"key": "b", "text": "A e^x", "correct": False, "misconception": "ODM07"},
            {"key": "c", "text": "A constant", "correct": False, "misconception": "ODM07"},
            {"key": "d", "text": "A cos x + B sin x", "correct": False, "misconception": "ODM07"},
        ],
    },
    {
        "id": "OD-D4", "node_id": "OD01", "grader": "mc",
        "stem": "Solving dy/dx = y^2 by separation, dividing by y^2 requires what caution?",
        "choices": [
            {"key": "a", "text": "y = 0 is a solution that division silently discards; note it separately", "correct": True},
            {"key": "b", "text": "No caution; division is always valid", "correct": False, "misconception": "ODM03"},
            {"key": "c", "text": "The constant of integration is unnecessary here", "correct": False, "misconception": "ODM01"},
            {"key": "d", "text": "Separation does not apply to this equation", "correct": False, "misconception": "ODM03"},
        ],
    },
]

# ===========================================================================
# PDEs AND FOURIER (PF)
# ===========================================================================

PF_UNITS = [
    ("PF-U1", "Fourier Series"),
    ("PF-U2", "Fourier Convergence and Parseval"),
    ("PF-U3", "Fourier Transforms"),
    ("PF-U4", "PDE Classification and Boundary Conditions"),
    ("PF-U5", "The Heat Equation"),
    ("PF-U6", "The Wave Equation"),
    ("PF-U7", "Laplace's Equation"),
    ("PF-U8", "Sturm-Liouville Theory"),
    ("PF-U9", "Transform Methods and Green's Functions"),
]

PF_NODES = [
    N("PF01", "PF-U1", "computational", "Fourier coefficients",
      "Computing a0, an, bn on [-L, L]; even and odd shortcuts."),
    N("PF02", "PF-U1", "computational", "Half-range expansions",
      "Sine and cosine series on [0, L] for boundary-value problems."),
    N("PF03", "PF-U2", "concept", "Pointwise convergence and Gibbs",
      "Dirichlet conditions, convergence at jumps, the Gibbs overshoot."),
    N("PF04", "PF-U2", "concept", "Parseval and energy",
      "Series energy identity; mean-square convergence; engineering reading."),
    N("PF05", "PF-U3", "computational", "Fourier transform and inverse",
      "Transform pairs, linearity, shifting, scaling."),
    N("PF06", "PF-U3", "concept", "Convolution and filtering",
      "Convolution theorem; frequency-domain reasoning for signals."),
    N("PF07", "PF-U4", "concept", "Classification of second-order PDEs",
      "Elliptic, parabolic, hyperbolic; why the type dictates the method."),
    N("PF08", "PF-U4", "concept", "Boundary and initial conditions",
      "Dirichlet, Neumann, Robin; well-posedness in brief."),
    N("PF09", "PF-U5", "computational", "Heat equation by separation of variables",
      "u_t = alpha u_xx on a rod; eigenfunction expansion of the initial data."),
    N("PF10", "PF-U5", "concept", "Heat kernel intuition and steady state",
      "Smoothing, decay rates by mode, and the long-time limit."),
    N("PF11", "PF-U5", "computational", "Nonhomogeneous boundary conditions",
      "Shifting to steady state plus transient."),
    N("PF12", "PF-U6", "computational", "Wave equation by separation of variables",
      "Standing waves; normal modes of a string."),
    N("PF13", "PF-U6", "computational", "d'Alembert's solution",
      "Traveling waves u = f(x - ct) + g(x + ct); domain of dependence."),
    N("PF14", "PF-U6", "concept", "Energy and characteristics",
      "Energy conservation for the string; characteristic lines."),
    N("PF15", "PF-U7", "computational", "Laplace's equation on a rectangle",
      "Separation with boundary data on one side at a time; superposition."),
    N("PF16", "PF-U7", "concept", "Harmonic functions and mean value",
      "Maximum principle, mean-value property, physical reading as steady heat."),
    N("PF17", "PF-U7", "computational", "Laplace's equation on a disk",
      "Polar separation; Poisson kernel in brief."),
    N("PF18", "PF-U8", "concept", "Sturm-Liouville problems",
      "Self-adjoint form; real eigenvalues and orthogonal eigenfunctions."),
    N("PF19", "PF-U8", "concept", "Eigenfunction expansions",
      "Generalized Fourier series; why separation of variables always lands here."),
    N("PF20", "PF-U8", "concept", "Bessel and Legendre in brief",
      "Where cylindrical and spherical problems get their special functions."),
    N("PF21", "PF-U9", "computational", "Method of characteristics, first order",
      "Transport equations; solving along characteristic curves."),
    N("PF22", "PF-U9", "computational", "Transform methods on infinite domains",
      "Fourier transform in x for the heat equation on the line."),
    N("PF23", "PF-U9", "concept", "Green's functions",
      "Impulse response of a boundary-value problem; superposition of sources."),
    N("PF24", "PF-U9", "concept", "PDEs in engineering practice",
      "Fourier optics, diffusion in semiconductors, waveguides: the applied spine."),
]

PF_EDGES = [
    E("PF01", "PF02"), E("PF01", "PF03"), E("PF03", "PF04"),
    E("PF01", "PF05"), E("PF05", "PF06"),
    E("PF07", "PF08"),
    E("PF02", "PF09"), E("PF08", "PF09"), E("PF09", "PF10"), E("PF09", "PF11"),
    E("PF02", "PF12"), E("PF08", "PF12"), E("PF12", "PF13"), E("PF13", "PF14"),
    E("PF08", "PF15"), E("PF15", "PF16"), E("PF15", "PF17"),
    E("PF09", "PF18"), E("PF12", "PF18"), E("PF18", "PF19"), E("PF19", "PF20"),
    E("PF07", "PF21"), E("PF05", "PF22"), E("PF22", "PF23"),
    E("PF10", "PF24"), E("PF14", "PF24"), E("PF16", "PF24"),
]

PF_MISCONCEPTIONS = [
    M("PFM01", "Coefficient formula mix-up",
      "Swaps the an and bn integrals, or forgets the 1/L normalization.", "PF01"),
    M("PFM02", "Parity blindness",
      "Computes all coefficients for an odd or even function instead of using symmetry.", "PF01"),
    M("PFM03", "Convergence-at-jump error",
      "Believes the series converges to a one-sided value at a jump instead of the midpoint.", "PF03"),
    M("PFM04", "Gibbs disappears with more terms",
      "Expects the Gibbs overshoot to shrink to zero as terms are added.", "PF03"),
    M("PFM05", "Separation without homogeneous BCs",
      "Applies separation of variables directly despite nonhomogeneous boundary data.", "PF11"),
    M("PFM06", "Sign error in the separated ODEs",
      "Chooses the wrong sign for the separation constant and gets growing modes on a rod.", "PF09"),
    M("PFM07", "Heat and wave conflation",
      "Uses oscillatory time behavior for the heat equation or decaying for the wave equation.", "PF07"),
    M("PFM08", "d'Alembert direction error",
      "Writes f(x + ct) as the right-moving wave.", "PF13"),
    M("PFM09", "Laplace as evolution",
      "Treats Laplace's equation as if it has an initial condition to march in time.", "PF07"),
    M("PFM10", "Orthogonality assumed for any two functions",
      "Assumes any two eigenfunction-looking functions are orthogonal without the S-L structure.", "PF18"),
]

PF_MC_ITEMS = [
    {
        "id": "PF-D1", "node_id": "PF03", "grader": "mc",
        "stem": "A Fourier series at a jump discontinuity of f converges to:",
        "choices": [
            {"key": "a", "text": "The average of the left and right limits", "correct": True},
            {"key": "b", "text": "The left-hand value", "correct": False, "misconception": "PFM03"},
            {"key": "c", "text": "The right-hand value", "correct": False, "misconception": "PFM03"},
            {"key": "d", "text": "It diverges at the jump", "correct": False, "misconception": "PFM03"},
        ],
    },
    {
        "id": "PF-D2", "node_id": "PF07", "grader": "mc",
        "stem": "u_t = alpha u_xx and u_tt = c^2 u_xx differ how in time behavior of each spatial mode?",
        "choices": [
            {"key": "a", "text": "Heat modes decay exponentially; wave modes oscillate", "correct": True},
            {"key": "b", "text": "Both oscillate", "correct": False, "misconception": "PFM07"},
            {"key": "c", "text": "Both decay", "correct": False, "misconception": "PFM07"},
            {"key": "d", "text": "Heat modes oscillate; wave modes decay", "correct": False, "misconception": "PFM07"},
        ],
    },
    {
        "id": "PF-D3", "node_id": "PF13", "grader": "mc",
        "stem": "In u(x, t) = f(x - ct) + g(x + ct), the term f(x - ct) represents:",
        "choices": [
            {"key": "a", "text": "A shape moving right with speed c", "correct": True},
            {"key": "b", "text": "A shape moving left with speed c", "correct": False, "misconception": "PFM08"},
            {"key": "c", "text": "A standing wave", "correct": False, "misconception": "PFM08"},
            {"key": "d", "text": "A decaying mode", "correct": False, "misconception": "PFM07"},
        ],
    },
    {
        "id": "PF-D4", "node_id": "PF01", "grader": "mc",
        "stem": "f(x) = x on [-pi, pi] is odd. Its Fourier series therefore:",
        "choices": [
            {"key": "a", "text": "Has only sine terms; a0 and all an vanish by symmetry", "correct": True},
            {"key": "b", "text": "Has only cosine terms", "correct": False, "misconception": "PFM02"},
            {"key": "c", "text": "Requires computing all coefficients; symmetry gives no shortcut", "correct": False, "misconception": "PFM02"},
            {"key": "d", "text": "Has a nonzero a0 because f is nonzero", "correct": False, "misconception": "PFM02"},
        ],
    },
]

# ===========================================================================
# Cross-course spine
# ===========================================================================

CROSS_EDGES = [
    E("LA03", "OD02"),   # elimination fluency before integrating-factor algebra
    E("LA19", "OD16"),   # diagonalization before linear systems of ODEs
    E("OD07", "PF09"),   # second-order ODEs before separation of variables (heat)
    E("OD07", "PF12"),   # and before the wave equation
    E("LA20", "PF18"),   # spectral theorem before Sturm-Liouville
    E("PF01", "PF09"),   # already in PF, kept for clarity of the spine
    E("OD13", "PF22"),   # Laplace-transform fluency before transform methods
]

# ===========================================================================
# Assembly
# ===========================================================================

def build() -> dict:
    return {
        "track": "AXIOM Engineering Mathematics",
        "courses": [
            {"id": "LA", "title": "Linear Algebra", "units": LA_UNITS,
             "nodes": LA_NODES, "edges": LA_EDGES,
             "misconceptions": LA_MISCONCEPTIONS, "items": LA_MC_ITEMS},
            {"id": "OD", "title": "Ordinary Differential Equations",
             "units": OD_UNITS, "nodes": OD_NODES, "edges": OD_EDGES,
             "misconceptions": OD_MISCONCEPTIONS, "items": OD_MC_ITEMS},
            {"id": "PF", "title": "PDEs and Fourier Analysis", "units": PF_UNITS,
             "nodes": PF_NODES, "edges": PF_EDGES,
             "misconceptions": PF_MISCONCEPTIONS, "items": PF_MC_ITEMS},
        ],
        "cross_edges": CROSS_EDGES,
    }


def check(cur: dict) -> list[str]:
    problems = []
    all_nodes = set()
    for c in cur["courses"]:
        unit_ids = {u[0] for u in c["units"]}
        for n in c["nodes"]:
            all_nodes.add(n["id"])
            if n["unit"] not in unit_ids:
                problems.append(f"{n['id']} references unknown unit {n['unit']}")
        node_ids = {n["id"] for n in c["nodes"]}
        for e in c["edges"]:
            if e["source"] not in node_ids or e["target"] not in node_ids:
                problems.append(f"{c['id']} edge {e['source']}->{e['target']} broken")
        misc_codes = {m["code"] for m in c["misconceptions"]}
        for m in c["misconceptions"]:
            if m["routes_to"] not in node_ids:
                problems.append(f"{m['code']} routes to unknown node")
        for it in c["items"]:
            if it["node_id"] not in node_ids:
                problems.append(f"item {it['id']} on unknown node")
            correct = [ch for ch in it["choices"] if ch.get("correct")]
            if len(correct) != 1:
                problems.append(f"item {it['id']} must have exactly one correct choice")
            for ch in it["choices"]:
                if not ch.get("correct") and ch.get("misconception") not in misc_codes:
                    problems.append(f"item {it['id']} choice {ch['key']} keys unknown misconception")
    for e in cur["cross_edges"]:
        if e["source"] not in all_nodes or e["target"] not in all_nodes:
            problems.append(f"cross edge {e['source']}->{e['target']} broken")
    # Cycle check over the union graph.
    adj: dict[str, list[str]] = {n: [] for n in all_nodes}
    for c in cur["courses"]:
        for e in c["edges"]:
            adj[e["source"]].append(e["target"])
    for e in cur["cross_edges"]:
        adj[e["source"]].append(e["target"])
    seen, stack = set(), set()

    def dfs(u: str) -> bool:
        seen.add(u); stack.add(u)
        for v in adj[u]:
            if v in stack or (v not in seen and dfs(v)):
                return True
        stack.discard(u)
        return False

    for n in all_nodes:
        if n not in seen and dfs(n):
            problems.append("prerequisite graph contains a cycle")
            break
    return problems


if __name__ == "__main__":
    cur = build()
    probs = check(cur)
    n_nodes = sum(len(c["nodes"]) for c in cur["courses"])
    n_edges = sum(len(c["edges"]) for c in cur["courses"]) + len(cur["cross_edges"])
    n_misc = sum(len(c["misconceptions"]) for c in cur["courses"])
    n_items = sum(len(c["items"]) for c in cur["courses"])
    print(f"nodes: {n_nodes}  edges: {n_edges}  misconceptions: {n_misc}  "
          f"diagnostic items: {n_items}")
    print(f"integrity problems: {len(probs)}")
    for p in probs:
        print("  PROBLEM:", p)
    with open("axiom_full_curriculum.json", "w") as f:
        json.dump(cur, f, indent=2)
    print("wrote axiom_full_curriculum.json")

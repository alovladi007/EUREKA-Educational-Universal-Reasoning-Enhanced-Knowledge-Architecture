# AXIOM Linear Algebra: Complete Lessons

Course LA of the Engineering Mathematics track. One lesson per knowledge node,
28 lessons across 9 units. Each lesson gives the objective, the core idea, a
worked example, and the pitfall it is most often confused with (keyed to the
misconception library where applicable).

---

## Unit 1. Vectors and Linear Systems

### LA01. Vector operations and linear combinations

Objective: add vectors, scale them, and form weighted sums fluently, with the
geometric picture attached.

A vector in R^n is a list of n numbers, and only two operations matter:
addition (componentwise) and scalar multiplication (stretch every component by
the same factor). A negative scalar reverses direction and scales the length.
Everything in this course is built from the single move of combining these two
operations: a linear combination c1 v1 + c2 v2 + ... + ck vk.

Worked example: with v = (1, 2) and w = (3, -1), the combination 2v - w =
(2*1 - 3, 2*2 - (-1)) = (-1, 5). Geometrically: walk twice along v, then
backwards along w.

Pitfall: a negative scalar does not rotate a vector or change it arbitrarily;
it reverses it along the same line. If -3v points anywhere other than opposite
to v, recheck the arithmetic.

### LA02. Span and the column picture

Objective: read A x as a combination of the columns of A, and describe the span
of a set of vectors.

The span of v1, ..., vk is the set of all their linear combinations: every
point you can reach using those directions. The product A x is exactly a linear
combination of the columns of A with weights from x. This is the column
picture, and it sits beside the row picture (each equation is a line or plane,
solutions are intersections). They describe the same system; strong students
switch between them at will.

Worked example: A = [[1, 3], [2, 1]] and x = (2, -1) gives A x = 2*(1,2) -
1*(3,1) = (-1, 3). Asking whether A x = b has a solution is asking whether b
lies in the span of the columns.

Pitfall: span is about which combinations exist, not how many vectors you have.
Two parallel vectors in R^2 span only a line (misconception LAM06 previews
here).

### LA03. Gaussian elimination and RREF

Objective: reduce a system with row operations to echelon and reduced echelon
form, and identify pivots.

Three legal row operations preserve the solution set: swap two rows, multiply a
row by a nonzero constant, and add a multiple of one row to another. Echelon
form staircases the zeros; reduced row echelon form (RREF) additionally makes
each pivot 1 with zeros above it. RREF is unique, which is why any valid
reduction path earns full credit in this course.

Worked example: [[2, 1, 5], [1, -1, 1]] (augmented). R1 <-> R2, then
R2 - 2 R1: [[1, -1, 1], [0, 3, 3]], then R2 / 3 and R1 + R2:
[[1, 0, 2], [0, 1, 1]]. Read off x = 2, y = 1.

Pitfall: multiplying a row by zero is not a legal operation; it destroys an
equation and changes the solution set. The step grader will localize exactly
that line.

### LA04. Existence, uniqueness, and free variables

Objective: classify a solution set as empty, a single point, or an infinite
family, straight from the pivot pattern, and parameterize the infinite case.

After reduction, three outcomes only. A pivot in the augmented column (a row
0 = nonzero) means no solution. A pivot in every variable column means exactly
one. Any variable column without a pivot is a free variable, and each free
variable contributes one parameter to an infinite family.

Worked example: x + y = 2 with 2x + 2y = 4 reduces to one pivot and one free
variable: infinitely many solutions, written x = 2 - t, y = t.

Pitfall: the shape of the system does not decide solvability. More equations
than unknowns can still have infinitely many solutions, and fewer can have
none (misconceptions LAM03 and LAM04 in the pilot library; LAM03 here).

## Unit 2. Matrix Algebra and Inverses

### LA05. Matrix multiplication

Objective: compute products, know when they are defined, and read a product as
composition.

The (i, j) entry of A B is the dot product of row i of A with column j of B,
defined only when the inner dimensions agree: (m x n)(n x p) gives m x p. The
deeper reading: multiplying by a matrix applies a transformation, and A B means
apply B first, then A. That order is why multiplication is not commutative.

Worked example: A = [[1, 2], [0, 1]], B = [[3, 0], [1, 1]]. A B =
[[5, 2], [1, 1]] but B A = [[3, 6], [1, 3]]. Different answers, both legal.

Pitfall: entrywise multiplication is a different operation entirely
(misconception LAM01), and assuming A B = B A (LAM02) breaks almost every
matrix manipulation that follows. When in doubt, keep factors in order.

### LA06. Matrix inverse

Objective: decide invertibility, compute inverses (2x2 formula and
Gauss-Jordan), and manipulate inverses correctly.

A is invertible when some B satisfies A B = B A = I; then B is unique and
written A^{-1}. For 2x2, A^{-1} = (1/det A) [[d, -b], [-c, a]], which exists
exactly when det A = ad - bc is nonzero. In general, row reduce [A | I] to
[I | A^{-1}]. Key algebra: (A B)^{-1} = B^{-1} A^{-1}, order reversed.

Worked example: A = [[1, 2], [1, 3]] has det 1, so A^{-1} = [[3, -2], [-1, 1]].
Check: A A^{-1} = I. Solving A x = b is then x = A^{-1} b, though elimination
is cheaper in practice.

Pitfall: 1/A is not a matrix of reciprocals, and not every matrix has an
inverse (misconception LAM04). Check the determinant, or the pivot count,
before writing A^{-1}.

### LA07. Elementary matrices and LU

Objective: see each row operation as multiplication by an elementary matrix,
and factor A = LU.

Every row operation equals left-multiplication by an elementary matrix E, so
elimination is a product of E's applied to A. Collecting them gives A = LU: L
lower triangular holding the multipliers, U upper triangular holding the
echelon result. Once factored, solving A x = b is two cheap triangular solves,
which is why LU is what solvers actually run.

Worked example: A = [[2, 1], [4, 5]] eliminates with multiplier 2:
L = [[1, 0], [2, 1]], U = [[2, 1], [0, 3]], and L U rebuilds A.

Pitfall: the multiplier stored in L is the number you subtracted with, not its
negative. Rebuild L U once by hand to fix the sign convention permanently.

## Unit 3. Subspaces, Basis, and Dimension

### LA08. Subspaces, null space, column space

Objective: test whether a set is a subspace, and know the two subspaces every
matrix carries.

A subspace is a set closed under addition and scalar multiplication and
containing the zero vector. Lines and planes through the origin qualify;
anything shifted off the origin does not. Every matrix A brings two: the column
space C(A) (all A x, living in R^m) and the null space N(A) (all solutions of
A x = 0, living in R^n). Existence questions live in C(A); uniqueness
questions live in N(A).

Worked example: A = [[1, 2], [2, 4]]. Columns are parallel, so C(A) is the
line through (1, 2). N(A) is all multiples of (-2, 1): the solutions of
x + 2y = 0.

Pitfall: a plane not through the origin is not a subspace, no matter how flat
it looks. Test the zero vector first; it is the fastest disqualifier.

### LA09. Linear independence

Objective: decide independence by the definition and by row reduction.

Vectors v1, ..., vk are independent when the only combination equal to zero is
the all-zeros combination. Practically: put them as columns of A and row
reduce; a pivot in every column means independent, any free column means
dependent, and the free column's vector is a combination of the pivots before
it.

Worked example: (1, 2, 0), (0, 1, 1), (1, 3, 1). The third is the first plus
the second, so the set is dependent, and reduction shows a free third column.

Pitfall: counting is not a test (misconception LAM06). Three vectors in R^3
can be dependent, and two can be independent. Only the combination condition
decides, and RREF computes it.

### LA10. Basis and dimension

Objective: produce bases for standard subspaces and use dimension correctly.

A basis of a subspace is an independent set that spans it: enough directions
to reach everything, no redundancy. Every basis of a given subspace has the
same size, and that size is the dimension. For C(A): the pivot columns of the
original A. For N(A): one vector per free variable, read from RREF.

Worked example: A = [[1, 2, 1], [2, 4, 0]] reduces with pivots in columns 1
and 3, so C(A) has basis {(1, 2), (1, 0)} and dimension 2; the free variable
gives N(A) basis {(-2, 1, 0)}, dimension 1.

Pitfall: take basis columns from the original matrix, not from the RREF. Row
operations change the column space; they only preserve which columns are
pivots.

### LA11. Rank and the rank-nullity theorem

Objective: compute rank and use rank + nullity = n as an accounting identity.

The rank is the number of pivots: simultaneously the dimension of the column
space and of the row space. The nullity is the number of free variables, the
dimension of N(A). For an m x n matrix, rank + nullity = n, always. This one
line answers a surprising number of exam questions: a 3 x 5 matrix has rank at
most 3, hence nullity at least 2, hence A x = 0 has nonzero solutions,
guaranteed.

Worked example: a 4 x 6 matrix with rank 4 has nullity 2: every consistent
system A x = b has a 2-parameter family of solutions.

Pitfall: rank is not the number of rows or equations (misconception LAM07).
A thousand copies of the same equation still have rank 1.

## Unit 4. Linear Transformations

### LA12. Linear transformations and their matrices

Objective: verify linearity and build the matrix of a transformation from what
it does to basis vectors.

T is linear when T(u + v) = T(u) + T(v) and T(cv) = c T(v). Every linear map
from R^n to R^m is multiplication by exactly one m x n matrix, and its columns
are the images of the standard basis vectors: column j is T(e_j). That single
fact converts geometry into computation.

Worked example: if T rotates the plane 90 degrees counterclockwise, then
T(e1) = (0, 1) and T(e2) = (-1, 0), so A = [[0, -1], [1, 0]].

Pitfall: any map with a constant offset, like T(x) = A x + b with b nonzero,
is not linear (it fails T(0) = 0). Affine and linear are different words for a
reason.

### LA13. Geometry of transformations

Objective: recognize and construct the standard plane transformations.

Rotation by theta: [[cos, -sin], [sin, cos]]. Reflection across the x-axis:
[[1, 0], [0, -1]]. Scaling: diagonal matrices. Shear: [[1, k], [0, 1]] slides
horizontal layers. Composition is matrix multiplication in right-to-left
order, and the determinant of the matrix is the factor by which areas scale
(negative when orientation flips).

Worked example: shear then rotate 90 degrees is [[0, -1], [1, 0]] times
[[1, 1], [0, 1]] = [[0, -1], [1, 1]]; in the other order it is
[[1, -1], [1, 0]]. Order matters, as LA05 promised.

Pitfall: composing in the written order instead of right-to-left. In A B x,
the vector meets B first.

### LA14. Kernel, image, and invertibility of maps

Objective: translate one-to-one and onto into matrix language and decide
invertibility of a map.

The kernel of T is N(A); the image is C(A). T is one-to-one exactly when the
kernel is only the zero vector (nullity 0, a pivot in every column), and onto
exactly when the image is all of R^m (rank m, a pivot in every row). For
square matrices these coincide: invertible means rank n means det nonzero
means only the trivial kernel. That chain of equivalences is the invertible
matrix theorem in daily-use form.

Worked example: a 3 x 2 matrix can be one-to-one (rank 2) but never onto R^3;
a 2 x 3 matrix can be onto but never one-to-one. Rank-nullity makes both
statements one-line proofs.

Pitfall: for non-square matrices, one-to-one and onto are independent
questions. Answer each with its own pivot count; do not import square-matrix
intuition.

## Unit 5. Determinants

### LA15. Determinants: computation

Objective: compute determinants by cofactor expansion and, faster, by row
reduction.

For 2x2, ad - bc. For larger matrices, expand along any row or column with
alternating signs, or better: row reduce to triangular form, multiply the
diagonal, and track the bookkeeping (each row swap flips the sign; scaling a
row scales the determinant; adding a multiple of one row to another changes
nothing). Reduction is O(n^3) while raw cofactors are factorial; past 3x3,
reduce.

Worked example: [[2, 1, 0], [1, 1, 1], [0, 1, 3]]. Eliminate below the first
pivot: rows become [2, 1, 0], [0, 1/2, 1], [0, 1, 3], then eliminate again to
get diagonal 2, 1/2, 1: determinant 2 * 1/2 * 1 = 1.

Pitfall: forgetting that a row swap flips the sign is the classic silent error.
Count swaps as you go, not at the end from memory.

### LA16. Determinants: properties and meaning

Objective: use det(A B) = det A det B, det(A) = 0 iff singular, and the volume
interpretation.

The determinant is the volume scaling factor of the transformation, signed by
orientation. Hence det(A B) = det A det B (scalings compose), det(A^{-1}) =
1/det A, and det A = 0 exactly when A squashes space into a lower dimension,
which is exactly when A is singular. Also det(cA) = c^n det A for an n x n
matrix, because every one of the n dimensions scales by c.

Worked example: A is 3x3 with det A = 2. Then det(2A) = 2^3 * 2 = 16, not 4
(diagnostic item LA-D2 exists precisely for this).

Pitfall: the determinant is not linear over addition: det(A + B) is not
det A + det B (misconception LAM05). Almost no useful identity involves the
determinant of a sum.

## Unit 6. Eigenvalues and Eigenvectors

### LA17. Characteristic polynomial and eigenvalues

Objective: set up det(A - lambda I) = 0 and extract eigenvalues with
multiplicity.

An eigenvalue lambda is a scalar for which A v = lambda v has a nonzero
solution, which happens exactly when A - lambda I is singular, which happens
exactly when det(A - lambda I) = 0. For 2x2, the characteristic polynomial is
lambda^2 - (trace) lambda + det, a shortcut worth memorizing. The trace equals
the sum of eigenvalues and the determinant equals their product: two free
checks on every computation.

Worked example: A = [[4, 1], [2, 3]] has trace 7 and det 10, so lambda^2 -
7 lambda + 10 = 0 gives lambda = 5 and lambda = 2. Check: 5 + 2 = 7,
5 * 2 = 10.

Pitfall: eigenvalues do not add across matrices: the eigenvalues of A + B are
not generally sums of eigenvalues (misconception LAM09). The trace adds; the
spectrum does not.

### LA18. Eigenvectors and eigenspaces

Objective: compute eigenspaces as null spaces and handle multiplicity.

For each eigenvalue, the eigenspace is N(A - lambda I): solve
(A - lambda I) v = 0. Any nonzero vector there is an eigenvector, and any
scalar multiple works equally well, which is why the grader checks
A v = lambda v rather than comparing to a stored vector. Geometric
multiplicity (dimension of the eigenspace) is at most algebraic multiplicity
(root order in the characteristic polynomial).

Worked example: continuing LA17, lambda = 5 gives A - 5I = [[-1, 1], [2, -2]],
whose null space is spanned by (1, 1). Check: A (1, 1) = (5, 5).

Pitfall: the zero vector is never an eigenvector, but eigenvalue 0 is entirely
legal and means exactly that A is singular (misconception LAM08 covers both
directions of this confusion).

### LA19. Diagonalization

Objective: factor A = P D P^{-1} when possible, and use it to compute powers.

If A has n independent eigenvectors, stack them as the columns of P and their
eigenvalues on the diagonal of D; then A = P D P^{-1}. The payoff is powers:
A^k = P D^k P^{-1}, and D^k is trivial. Distinct eigenvalues guarantee
diagonalizability; a repeated eigenvalue requires checking whether its
eigenspace is large enough.

Worked example: A from LA17 diagonalizes with P = [[1, 1], [1, -2]] (columns
are the eigenvectors for 5 and 2) and D = diag(5, 2). A^10 is then one small
computation instead of nine multiplications.

Pitfall: [[1, 1], [0, 1]] has eigenvalue 1 twice but a one-dimensional
eigenspace: not diagonalizable. Repeated eigenvalues are a warning to check,
not a dead end by default.

### LA20. Symmetric matrices and the spectral theorem

Objective: state and use the spectral theorem: real eigenvalues, orthogonal
eigenvectors, A = Q D Q^T.

Symmetric matrices are the best-behaved matrices in the subject: every
eigenvalue is real, eigenvectors for distinct eigenvalues are orthogonal, and
there is always a full orthonormal eigenbasis, so A = Q D Q^T with Q
orthogonal (Q^T Q = I). This is the fact that powers Sturm-Liouville theory
and PCA later in the track, so it earns its own node.

Worked example: A = [[2, 1], [1, 2]] has eigenvalues 3 and 1 with eigenvectors
(1, 1) and (1, -1), visibly orthogonal. Normalize and A = Q diag(3, 1) Q^T.

Pitfall: the theorem needs symmetry. A general matrix can have complex
eigenvalues and skewed eigenvectors; do not quote spectral conclusions without
checking A = A^T.

## Unit 7. Orthogonality and Projections

### LA21. Dot product, norms, and angles

Objective: compute inner products, lengths, and angles, and use orthogonality.

The dot product u . v = sum of componentwise products carries all the
geometry: ||v|| = sqrt(v . v), cos(theta) = u . v / (||u|| ||v||), and
u . v = 0 means perpendicular. Cauchy-Schwarz, |u . v| <= ||u|| ||v||,
guarantees the cosine formula makes sense and underwrites every inequality in
the unit.

Worked example: u = (1, 2, 2), v = (2, 1, -2). u . v = 2 + 2 - 4 = 0:
orthogonal, no angle computation needed. ||u|| = 3.

Pitfall: orthogonality is a statement about the dot product, not about
components looking different. Compute the product; eyeballing misleads.

### LA22. Projection onto lines and subspaces

Objective: project onto a line and onto a column space, and know the
projection matrix.

Onto a line through a: proj(b) = (a . b / a . a) a. Onto C(A) with independent
columns: P = A (A^T A)^{-1} A^T, and proj(b) = P b. Two defining properties do
all the theory: P^2 = P (projecting twice changes nothing) and b - P b is
orthogonal to the subspace (the error is perpendicular). The second property
is exactly the geometry least squares runs on.

Worked example: project b = (3, 4) onto a = (1, 0): (3, 0). The error (0, 4)
is orthogonal to a, and projecting (3, 0) again gives (3, 0).

Pitfall: expecting P(P(b)) to move the vector further (misconception LAM10).
Idempotence is not a curiosity; it is the definition doing its job.

### LA23. Gram-Schmidt and orthonormal bases

Objective: orthonormalize a basis and exploit Q^T Q = I.

Gram-Schmidt takes independent vectors and subtracts, from each, its
projections onto the ones already processed, then normalizes. The result is an
orthonormal basis: q_i . q_j = 0 for i not j, each of length 1. Stacked as
columns of Q, orthonormality reads Q^T Q = I, and coordinates in the basis are
just dot products: no system solving.

Worked example: a1 = (1, 1, 0), a2 = (1, 0, 1). q1 = a1/sqrt(2); subtract from
a2 its projection (1/2, 1/2, 0), leaving (1/2, -1/2, 1); normalize for q2.

Pitfall: a matrix is orthogonal because Q^T Q = I, not because its entries
look symmetric or tidy (misconception LAM12). Test with the transpose product.

## Unit 8. Least Squares and QR

### LA24. Least squares via normal equations

Objective: solve inconsistent systems in the least-squares sense and fit lines
to data.

When A x = b has no solution, the next best x minimizes ||A x - b||, which
happens exactly when the residual is orthogonal to C(A): the normal equations
A^T A x = A^T b. Fitting y = m x + c to data points is the special case where
A has columns (x-values, ones); this is the workhorse of experimental data
reduction, which is why the template bank drills it.

Worked example: points (0, 1), (1, 1), (2, 3). A = [[0,1],[1,1],[2,1]],
b = (1, 1, 3). A^T A = [[5, 3], [3, 3]], A^T b = (7, 5); solving gives m = 1,
c = 2/3.

Pitfall: solving A x = b directly when it is inconsistent (misconception
LAM11) either fails or silently discards data. If the system came from
measurements, assume least squares.

### LA25. QR factorization and conditioning

Objective: factor A = QR and understand why QR beats normal equations
numerically.

Gram-Schmidt on the columns of A produces A = QR with Q orthonormal and R
upper triangular. Least squares then becomes R x = Q^T b: a triangular solve,
no A^T A formed. That matters because forming A^T A squares the condition
number, amplifying rounding error; QR works at the original conditioning.
This node is the course's first honest contact with numerical reality, and it
sets up LA28.

Worked example: with A from LA24, Q holds the orthonormalized columns and R
records the Gram-Schmidt coefficients; back-substitution reproduces m = 1,
c = 2/3 with better numerical behavior on ill-conditioned data.

Pitfall: normal equations are fine for clean textbook numbers and dangerous
for nearly-collinear data columns. The method choice is a conditioning
decision, not a taste decision.

## Unit 9. SVD and Applications

### LA26. Singular value decomposition

Objective: state A = U S V^T and interpret singular values geometrically.

Every matrix, square or not, factors as A = U S V^T with U and V orthogonal
and S diagonal with nonnegative entries s1 >= s2 >= ... (the singular values).
Geometrically: every linear map is a rotation, then an axis-aligned stretch,
then another rotation. Singular values are the stretch factors; the rank is
the count of nonzero ones. The SVD is the spectral theorem's generalization to
arbitrary matrices, via the symmetric matrices A^T A and A A^T.

Worked example: A = [[3, 0], [0, 2]] is already its own S with U = V = I;
tilt it by rotations on either side and the singular values stay 3 and 2.

Pitfall: singular values are not eigenvalues (they coincide only for symmetric
positive semidefinite matrices). They are the square roots of the eigenvalues
of A^T A.

### LA27. Low-rank approximation and PCA

Objective: truncate the SVD for the best low-rank approximation and connect it
to principal component analysis.

Keeping the top k singular triples gives the best rank-k approximation of A in
the least-squares sense (Eckart-Young). Applied to a centered data matrix,
the right singular vectors are the principal components: the directions of
greatest variance, in order. Compression, denoising, and PCA are all the same
move: keep the large singular values, drop the small.

Worked example: a data matrix with singular values 40, 12, 0.3 is effectively
rank 2; the third direction is noise, and a rank-2 truncation loses almost
nothing while halving storage.

Pitfall: PCA requires centering the data first. Skipping the mean subtraction
makes the first component point at the mean, not at the variance.

### LA28. Condition number and numerical sanity

Objective: compute kappa(A) = s_max / s_min and use it to judge computed
answers.

The condition number bounds how much relative error in the input can amplify
into relative error in the output of solving A x = b. Rule of thumb: kappa of
10^k costs about k digits of accuracy. A matrix with kappa near 10^16 is
numerically singular in double precision even if its determinant is nonzero.
This node is why professional code reports conditioning and why LA25 preferred
QR.

Worked example: A = [[1, 1], [1, 1.0001]] has singular values near 2 and
5e-5: kappa around 4e4, so expect to lose four to five digits solving with it.

Pitfall: a tiny determinant does not mean ill-conditioned (scale a well-behaved
matrix down and det shrinks harmlessly), and det near zero is not the test.
Singular values are the test.

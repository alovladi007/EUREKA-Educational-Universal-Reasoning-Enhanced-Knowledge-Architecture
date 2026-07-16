"""Coursework: Fourier analysis and PDE unit nodes PF.U1-PF.U9.

Five steps per lesson: two readings, a worked example, pitfalls, check.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------ U1: Fourier series ------------------------------
    "PF.U1.N1": {
        "summary": "Periodic functions and the Fourier series: decomposing signals into harmonics.",
        "steps": [
            (L, "The idea", (
                "A function with period $2L$ can be written as a superposition of harmonics:\n"
                "$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty \\left( a_n \\cos\\frac{n\\pi x}{L} "
                "+ b_n \\sin \\frac{n\\pi x}{L} \\right).$$\n\n"
                "Each term oscillates $n$ times per period — the FUNDAMENTAL ($n = 1$) plus "
                "OVERTONES. The claim is radical: square waves, sawtooths, any reasonable periodic "
                "shape — all are sums of smooth sines and cosines. Sound synthesis, signal "
                "processing, and half of PDE theory are applications of this one decomposition."
            )),
            (L, "Why these building blocks", (
                "Two reasons sines and cosines are THE basis:\n\n"
                "1. ORTHOGONALITY: over a period, $\\int \\cos\\frac{m\\pi x}{L}\\cos\\frac{n\\pi x}{L}\\,dx = 0$ "
                "for $m \\ne n$ (same for sines, and cos-sin always) — which makes the coefficients "
                "computable one at a time (N2).\n\n"
                "2. They are EIGENFUNCTIONS of $\\frac{d^2}{dx^2}$: differentiation acts on each "
                "harmonic by a scalar — so plugging a Fourier series into a linear PDE decouples it "
                "mode by mode (PF.U4). The series isn't a curiosity; it's the diagonalization of "
                "calculus's most important operator."
            )),
            (E, "Worked example", (
                "The square wave: $f(x) = 1$ on $(0, \\pi)$, $-1$ on $(-\\pi, 0)$, period $2\\pi$. "
                "Its Fourier series (derived in N2-N3):\n"
                "$$f(x) = \\frac{4}{\\pi}\\left( \\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots \\right).$$\n\n"
                "One term: a sine crudely aping the square. Three terms: shoulders form. Twenty: "
                "flat tops, sharp jumps. A discontinuous signal built from infinitely smooth pieces "
                "— with a fixed overshoot at the jumps that never dies (Gibbs, N4)."
            )),
            (P, "Pitfalls", (
                "1. Using period-$2\\pi$ formulas for period-$2L$ functions — the $\\frac{n\\pi x}{L}$ "
                "arguments must match the actual period.\n\n"
                "2. Forgetting the $\\frac{a_0}{2}$ convention (some texts write $a_0$ — know which "
                "your formulas assume).\n\n"
                "3. Expecting pointwise equality everywhere — at jumps the series converges to the "
                "MIDPOINT (N4).\n\n"
                "4. Treating the series as a Taylor series — Fourier is global (integrals over the "
                "period), Taylor is local (derivatives at a point).\n\n"
                "5. Applying it to non-periodic functions without deciding on an extension (N3) or "
                "moving to the transform (U2)."
            )),
            (K, "Check yourself", (
                "You should be able to: write the general series for period $2L$, explain "
                "orthogonality's role and the eigenfunction property, and describe partial-sum "
                "behavior.\n\n"
                "Self-test: what frequency does the $n = 3$ term of a period-$2\\pi$ series "
                "oscillate at, and why do PDEs damp it faster than $n = 1$? "
                "(3 cycles per period; $\\frac{d^2}{dx^2}$ scales it by $-9$ vs $-1$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "PF.U1.N2": {
        "summary": "Fourier coefficients: the Euler formulas and how orthogonality isolates each mode.",
        "steps": [
            (L, "The Euler formulas", (
                "For period $2L$:\n"
                "$$a_n = \\frac 1 L \\int_{-L}^{L} f(x) \\cos\\frac{n\\pi x}{L}\\, dx, \\qquad "
                "b_n = \\frac 1 L \\int_{-L}^{L} f(x) \\sin\\frac{n\\pi x}{L}\\, dx,$$\n"
                "with $a_0 = \\frac 1 L \\int_{-L}^L f\\,dx$ (so $\\frac{a_0}{2}$ = the average "
                "value of $f$).\n\n"
                "Derivation in one line: multiply the series by $\\cos\\frac{m\\pi x}{L}$, integrate "
                "over a period — orthogonality kills every term except $n = m$, whose integral is "
                "$L\\,a_m$. The coefficients are PROJECTIONS onto each harmonic, exactly as in "
                "LA.U8.N2."
            )),
            (L, "Computing in practice", (
                "• Piecewise $f$: split the integral at the breakpoints.\n"
                "• Integrals of $x\\cos nx$, $x^2 \\sin nx$: integration by parts, and expect "
                "$\\cos n\\pi = (-1)^n$ to appear — keeping that as $(-1)^n$ (not case-by-case) "
                "halves the writing.\n"
                "• SYMMETRY FIRST (N3): even $f$ → all $b_n = 0$; odd $f$ → all $a_n = 0$ — check "
                "before integrating anything.\n\n"
                "Any full period works as the integration window ($[0, 2L]$ instead of $[-L, L]$) — "
                "the answer can't depend on where you start."
            )),
            (E, "Worked example", (
                "Sawtooth: $f(x) = x$ on $(-\\pi, \\pi)$, period $2\\pi$.\n\n"
                "$f$ odd → $a_n = 0$. For $b_n$:\n"
                "$$b_n = \\frac 1 \\pi \\int_{-\\pi}^\\pi x \\sin nx \\, dx "
                "= \\frac 2 \\pi \\int_0^\\pi x\\sin nx\\,dx "
                "= \\frac 2 \\pi \\left[ \\frac{-x\\cos nx}{n} \\Big|_0^\\pi + \\frac 1 n \\int_0^\\pi \\cos nx\\,dx \\right] "
                "= \\frac{2(-1)^{n+1}}{n}.$$\n"
                "$$x \\sim 2\\left( \\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\cdots \\right).$$\n\n"
                "Sanity: at $x = \\frac\\pi2$ the series gives "
                "$2(1 - \\frac{...}{}) \\to$ Leibniz's $\\frac\\pi4$ series — coefficient formulas "
                "double as series-summing machines."
            )),
            (P, "Pitfalls", (
                "1. Normalization slips: the $\\frac1L$ out front, and $\\frac{a_0}{2}$ vs $a_0$ "
                "conventions.\n\n"
                "2. Integration-by-parts sign errors in $\\int x\\sin nx$ (the single biggest error "
                "source).\n\n"
                "3. Evaluating $\\cos n\\pi$ as $1$ or $-1$ instead of $(-1)^n$.\n\n"
                "4. Ignoring symmetry and grinding integrals that are provably zero.\n\n"
                "5. Wrong integration window (must cover exactly ONE period)."
            )),
            (K, "Check yourself", (
                "You should be able to: derive the formulas from orthogonality, compute "
                "coefficients for piecewise and polynomial $f$, and exploit $(-1)^n$ and symmetry.\n\n"
                "Self-test: for $f$ with average value 3, what is $a_0$? "
                "($a_0 = 6$, since $\\frac{a_0}{2}$ is the mean.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U1.N3": {
        "summary": "Even and odd functions: cosine series, sine series, and half-range expansions.",
        "steps": [
            (L, "Symmetry kills half the work", (
                "• EVEN $f$ ($f(-x) = f(x)$): all $b_n = 0$ — a pure COSINE series, and "
                "$a_n = \\frac 2 L \\int_0^L f \\cos\\frac{n\\pi x}{L}dx$ (double the half-range "
                "integral).\n"
                "• ODD $f$: all $a_n = 0$ — a pure SINE series, "
                "$b_n = \\frac2L \\int_0^L f\\sin\\frac{n\\pi x}{L}dx$.\n\n"
                "Reason: odd integrand over a symmetric interval integrates to zero. Parity "
                "arithmetic: even×even = even, odd×odd = even, even×odd = odd."
            )),
            (L, "Half-range expansions", (
                "A function given only on $[0, L]$ can be extended EITHER way:\n\n"
                "• EVEN extension → cosine series. Continuous at 0 and $L$ (mirror image) — "
                "better convergence; natural for insulated-end heat problems.\n"
                "• ODD extension → sine series. Vanishes at 0 and $L$ — exactly what fixed-end "
                "(Dirichlet) boundary conditions demand, which is why PDE solutions (PF.U4) almost "
                "always use sine series.\n\n"
                "SAME function, two different valid series — the choice is dictated by the boundary "
                "conditions of the problem, not by the function."
            )),
            (E, "Worked example", (
                "Expand $f(x) = x$ on $[0, \\pi]$ both ways.\n\n"
                "SINE (odd extension = the sawtooth of N2):\n"
                "$$x \\sim 2\\sum_{n \\ge 1} \\frac{(-1)^{n+1}}{n} \\sin nx.$$\n"
                "COSINE (even extension = triangle wave):\n"
                "$$x \\sim \\frac{\\pi}{2} - \\frac{4}{\\pi}\\left( \\cos x + \\frac{\\cos 3x}{9} + \\frac{\\cos 5x}{25} + \\cdots \\right).$$\n\n"
                "Note the decay rates: sine coefficients $\\sim \\frac1n$ (the extension has jumps), "
                "cosine $\\sim \\frac{1}{n^2}$ (continuous extension) — smoothness of the extension "
                "shows up directly as faster convergence."
            )),
            (P, "Pitfalls", (
                "1. Testing parity of the EXTENSION when the function is defined on $[0, L]$ — "
                "parity there is a CHOICE, not a property.\n\n"
                "2. Forgetting the factor 2 in half-range coefficient formulas.\n\n"
                "3. Declaring $f$ 'neither even nor odd' and giving up — every $f$ splits as "
                "even + odd parts.\n\n"
                "4. Using a cosine series against fixed-end boundary conditions (it won't vanish at "
                "the ends).\n\n"
                "5. Parity slips: $x^2 \\sin x$ is odd (even × odd), not even."
            )),
            (K, "Check yourself", (
                "You should be able to: use parity to zero out coefficients, build both half-range "
                "expansions, and pick the extension matching the boundary conditions.\n\n"
                "Self-test: which series represents $f$ on $[0, L]$ with $f(0) = f(L) = 0$ "
                "required? (Sine — the odd extension respects the zeros.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U1.N4": {
        "summary": "Convergence and the Gibbs phenomenon: where the series equals f, and the stubborn 9% overshoot.",
        "steps": [
            (L, "The convergence theorem", (
                "For piecewise-smooth $f$, the Fourier series converges at EVERY $x$:\n\n"
                "• to $f(x)$ where $f$ is continuous;\n"
                "• to the MIDPOINT $\\frac{f(x^-) + f(x^+)}{2}$ at jump discontinuities.\n\n"
                "Smoothness ↔ decay: jumps → coefficients $\\sim \\frac1n$; continuous with corner "
                "→ $\\frac{1}{n^2}$; smoother → faster. Reading coefficient decay tells you the "
                "worst singularity of $f$ without seeing $f$."
            )),
            (L, "Gibbs phenomenon", (
                "Near a jump, partial sums OVERSHOOT by about 9% of the jump size — and adding more "
                "terms does NOT shrink the overshoot; it only squeezes it closer to the jump. The "
                "limit function is fine (pointwise convergence holds); the approximation near the "
                "edge is what misbehaves — convergence is not UNIFORM near jumps.\n\n"
                "Consequences are practical: ringing artifacts at edges in JPEG images and filtered "
                "audio ARE Gibbs. Remedies exist (Fejér/Cesàro averaging smooths it away at the "
                "cost of slower convergence elsewhere)."
            )),
            (E, "Worked example", (
                "The square wave series at the jump $x = 0$: every term $\\sin(n \\cdot 0) = 0$, so "
                "the series sums to $0 = \\frac{(-1) + 1}{2}$ — the midpoint rule, verified "
                "exactly.\n\n"
                "Evaluate at $x = \\frac\\pi2$ instead (a continuity point): "
                "$1 = \\frac4\\pi (1 - \\frac13 + \\frac15 - \\cdots)$, i.e. "
                "$\\sum \\frac{(-1)^k}{2k+1} = \\frac\\pi4$ ✓.\n\n"
                "And plotting $S_{50}$: flat at $\\pm1$, midpoint at 0, with spikes to "
                "$\\approx 1.09$ hugging the jump — Gibbs in person."
            )),
            (P, "Pitfalls", (
                "1. Evaluating the series at a jump and expecting $f(x^+)$ — it's the midpoint.\n\n"
                "2. 'More terms will fix the overshoot' — Gibbs is permanent in height.\n\n"
                "3. Confusing pointwise convergence (holds) with uniform convergence (fails near "
                "jumps).\n\n"
                "4. Differentiating a Fourier series term-by-term across a jump — the result "
                "diverges; term-by-term calculus needs continuity.\n\n"
                "5. Reading slow $\\frac1n$ decay as an error — it's the honest signature of a "
                "discontinuous function."
            )),
            (K, "Check yourself", (
                "You should be able to: state the convergence theorem, evaluate series at jumps and "
                "smooth points, connect decay rate to smoothness, and describe Gibbs "
                "quantitatively.\n\n"
                "Self-test: a Fourier series has coefficients decaying like $\\frac{1}{n^4}$ — what "
                "does that say about $f$? (Quite smooth: roughly two continuous derivatives with a "
                "singularity in the third.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U1.N5": {
        "summary": "Parseval's theorem: energy equals the sum of squared coefficients.",
        "steps": [
            (L, "The statement", (
                "For period-$2L$ $f$ with Fourier coefficients $a_n, b_n$:\n"
                "$$\\frac 1 L \\int_{-L}^{L} f(x)^2\\, dx = \\frac{a_0^2}{2} + \\sum_{n=1}^\\infty (a_n^2 + b_n^2).$$\n\n"
                "Left: the ENERGY (mean square) of the signal. Right: energy mode by mode. Parseval "
                "says the harmonics partition the energy exactly — nothing lost, nothing double "
                "counted. It is the Pythagorean theorem in function space: orthogonal components' "
                "squared lengths add."
            )),
            (L, "What it's for", (
                "• SPECTRUM reading: $a_n^2 + b_n^2$ is the power in mode $n$ — the power spectral "
                "density of engineering; 'how much bass vs treble' is a Parseval statement.\n"
                "• TRUNCATION error: cutting the series at $N$ discards exactly "
                "$\\sum_{n > N}(a_n^2 + b_n^2)$ of energy — compression quality quantified.\n"
                "• SUMMING SERIES: equate the integral with the coefficient sum and famous "
                "identities fall out — the standard route to $\\sum \\frac{1}{n^2}$.\n\n"
                "It also underwrites the mean-square convergence of Fourier series: partial sums "
                "are the BEST approximations in the energy norm."
            )),
            (E, "Worked example", (
                "Apply Parseval to the sawtooth $f(x) = x$ on $(-\\pi, \\pi)$, "
                "$b_n = \\frac{2(-1)^{n+1}}{n}$:\n\n"
                "$$\\frac 1 \\pi \\int_{-\\pi}^\\pi x^2 dx = \\frac{2\\pi^2}{3}, \\qquad "
                "\\sum_n b_n^2 = \\sum_n \\frac 4{n^2}.$$\n\n"
                "Equate: $\\frac{2\\pi^2}{3} = 4\\sum \\frac1{n^2}$, so\n"
                "$$\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$\n"
                "— the Basel problem, solved as a byproduct of energy bookkeeping."
            )),
            (P, "Pitfalls", (
                "1. Normalization mismatches — the $\\frac1L$ and $\\frac{a_0^2}{2}$ must match "
                "your series convention; check against a constant function first.\n\n"
                "2. Forgetting to SQUARE coefficients.\n\n"
                "3. Using Parseval on $f$ but coefficients of a DIFFERENT extension of $f$.\n\n"
                "4. Summing $a_n^2 + b_n^2$ but integrating $f$ instead of $f^2$.\n\n"
                "5. Treating truncation error in the MAX norm — Parseval controls mean-square "
                "error; Gibbs still spikes pointwise."
            )),
            (K, "Check yourself", (
                "You should be able to: state Parseval with correct normalization, read mode "
                "energies, bound truncation error, and derive series identities.\n\n"
                "Self-test: a signal has $b_1 = 3, b_2 = 4$, all else 0. Total energy (RHS)? "
                "($9 + 16 = 25$ — and $f = 3\\sin x + 4\\sin 2x$ indeed has mean square "
                "$\\frac{9}{2} + \\frac{16}{2}$... with the $\\frac1L$ convention above both sides "
                "give 25.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U2: Fourier transform ------------------------------
    "PF.U2.N1": {
        "summary": "The Fourier transform: from series on a period to a spectrum on the whole line.",
        "steps": [
            (L, "The definition", (
                "For non-periodic $f$ on the whole line (period $\\to \\infty$; discrete harmonics "
                "merge into a continuum):\n"
                "$$\\hat f(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-i\\omega t}\\, dt, \\qquad "
                "f(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^\\infty \\hat f(\\omega) e^{i\\omega t}\\, d\\omega.$$\n\n"
                "$\\hat f(\\omega)$ is the SPECTRUM: how much of frequency $\\omega$ lives in $f$. "
                "The inverse formula reassembles $f$ from its frequencies. CONVENTION WARNING: the "
                "$2\\pi$ can sit on either integral or split as $\\frac{1}{\\sqrt{2\\pi}}$ on both — "
                "fix one convention and audit any table you borrow."
            )),
            (L, "First properties and reading spectra", (
                "Linearity is immediate. Realness/symmetry: real even $f$ → real even $\\hat f$; "
                "real odd → imaginary odd.\n\n"
                "The UNCERTAINTY tradeoff, visible already in examples: narrow in time ↔ wide in "
                "frequency. A sharp click contains all frequencies; a long pure tone has a "
                "needle-thin spectrum. Quantitatively, scaling: $f(at)$ has transform "
                "$\\frac{1}{|a|}\\hat f(\\frac\\omega a)$ (N3) — squeeze one domain, stretch the "
                "other. This tradeoff is the mathematical core of bandwidth limits and of "
                "Heisenberg's principle."
            )),
            (E, "Worked example", (
                "The rectangular pulse $f = 1$ on $[-a, a]$, else 0:\n"
                "$$\\hat f(\\omega) = \\int_{-a}^a e^{-i\\omega t} dt "
                "= \\frac{e^{-i\\omega t}}{-i\\omega}\\Big|_{-a}^{a} = \\frac{2 \\sin(a\\omega)}{\\omega}$$\n"
                "— the SINC function: a central lobe of width $\\sim \\frac{2\\pi}{a}$ with decaying "
                "ripples.\n\n"
                "Shrink the pulse ($a \\to 0$): the spectrum flattens (all frequencies equally — the "
                "delta/impulse limit). Widen it: the spectrum needles at 0. The uncertainty "
                "tradeoff, computed."
            )),
            (P, "Pitfalls", (
                "1. Mixing $2\\pi$ conventions between definition and table — the classic "
                "off-by-$2\\pi$.\n\n"
                "2. Sign of the exponent flipped between forward and inverse transforms.\n\n"
                "3. Treating $\\hat f$ as real in general — it's complex; magnitude is the "
                "amplitude spectrum, argument the phase.\n\n"
                "4. Applying the integral to functions that don't decay (pure $\\sin \\omega_0 t$ "
                "needs distributions/deltas — flag it, don't force it).\n\n"
                "5. Confusing angular frequency $\\omega$ with ordinary frequency "
                "$\\nu = \\frac{\\omega}{2\\pi}$."
            )),
            (K, "Check yourself", (
                "You should be able to: compute transforms of simple pulses from the definition, "
                "read amplitude/phase spectra, and narrate the time-frequency tradeoff.\n\n"
                "Self-test: without integrating — is the transform of a real even function real? "
                "(Yes, and even: the $\\sin$ part of $e^{-i\\omega t}$ integrates away.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "PF.U2.N2": {
        "summary": "Transforms of standard signals: the working table.",
        "steps": [
            (L, "The core table", (
                "(Convention: $\\hat f(\\omega) = \\int f e^{-i\\omega t} dt$.)\n\n"
                "• Rectangular pulse on $[-a,a]$ → $\\frac{2\\sin a\\omega}{\\omega}$ (sinc).\n"
                "• One-sided decay $e^{-at}u(t)$, $a>0$ → $\\frac{1}{a + i\\omega}$.\n"
                "• Two-sided decay $e^{-a|t|}$ → $\\frac{2a}{a^2 + \\omega^2}$ (Lorentzian).\n"
                "• GAUSSIAN $e^{-t^2/2}$ → $\\sqrt{2\\pi}\\, e^{-\\omega^2/2}$ — its own shape: "
                "the fixed point of the transform.\n"
                "• Delta $\\delta(t)$ → $1$ (all frequencies, flat)."
            )),
            (L, "Reading the table", (
                "Patterns worth internalizing:\n\n"
                "• Smoothness ↔ decay (again): the discontinuous pulse gets a slowly-decaying "
                "$\\frac1\\omega$ spectrum; the smooth Gaussian gets Gaussian (fastest possible) "
                "decay.\n"
                "• Sharp/localized ↔ broad: $\\delta \\to 1$ is the extreme.\n"
                "• The one-sided exponential's transform is exactly the Laplace transform at "
                "$s = i\\omega$ — the two transforms are one family (ODE.U4 meets PF.U2 on the "
                "imaginary axis).\n\n"
                "With deltas allowed: $1 \\to 2\\pi\\delta(\\omega)$, "
                "$\\cos\\omega_0 t \\to \\pi[\\delta(\\omega - \\omega_0) + \\delta(\\omega + \\omega_0)]$ "
                "— pure tones are spectral needles."
            )),
            (E, "Worked example", (
                "Compute $\\mathcal F\\{e^{-2|t|}\\}$ from halves:\n"
                "$$\\int_0^\\infty e^{-2t} e^{-i\\omega t} dt = \\frac{1}{2 + i\\omega}, \\qquad "
                "\\int_{-\\infty}^0 e^{2t}e^{-i\\omega t} dt = \\frac{1}{2 - i\\omega}.$$\n"
                "Sum: $\\frac{(2 - i\\omega) + (2 + i\\omega)}{4 + \\omega^2} = "
                "\\frac{4}{4 + \\omega^2}$ ✓ (the $a = 2$ Lorentzian).\n\n"
                "Real and even, as the symmetry rules predicted — and the two complex halves were "
                "conjugates, so the imaginary parts had to cancel."
            )),
            (P, "Pitfalls", (
                "1. Using a table from a different $2\\pi$ convention.\n\n"
                "2. $e^{-at}u(t)$ vs $e^{-a|t|}$ confusion — one-sided is complex "
                "($\\frac{1}{a+i\\omega}$), two-sided real.\n\n"
                "3. Forgetting $a > 0$ requirements (growing exponentials have no transform).\n\n"
                "4. The Gaussian's constant: $e^{-t^2/2} \\to \\sqrt{2\\pi}e^{-\\omega^2/2}$ — "
                "track it through rescalings.\n\n"
                "5. Writing $\\cos\\omega_0 t \\to$ a function — it's a pair of deltas; ordinary "
                "integrals diverge."
            )),
            (K, "Check yourself", (
                "You should be able to: reproduce the five core transforms, connect table patterns "
                "to smoothness/localization, and spot the Laplace connection.\n\n"
                "Self-test: which entry is its own transform (up to constants)? "
                "(The Gaussian.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U2.N3": {
        "summary": "Transform properties: linearity, shifts, scaling, differentiation, convolution.",
        "steps": [
            (L, "The operational rules", (
                "• LINEARITY: $\\alpha f + \\beta g \\to \\alpha \\hat f + \\beta \\hat g$.\n"
                "• TIME SHIFT: $f(t - t_0) \\to e^{-i\\omega t_0} \\hat f(\\omega)$ — delay = phase "
                "twist, magnitude unchanged.\n"
                "• FREQUENCY SHIFT (modulation): $e^{i\\omega_0 t} f(t) \\to \\hat f(\\omega - \\omega_0)$ "
                "— multiplying by a tone slides the spectrum (this is how radio works).\n"
                "• SCALING: $f(at) \\to \\frac{1}{|a|}\\hat f(\\frac{\\omega}{a})$.\n"
                "• DIFFERENTIATION: $f'(t) \\to i\\omega \\hat f(\\omega)$ — calculus becomes "
                "multiplication."
            )),
            (L, "Convolution, the crown rule", (
                "$$\\mathcal F\\{f * g\\} = \\hat f \\cdot \\hat g, \\qquad "
                "(f * g)(t) = \\int f(\\tau) g(t - \\tau)\\, d\\tau.$$\n\n"
                "Convolution in time = MULTIPLICATION in frequency. Every linear time-invariant "
                "system (filter, channel, blur) acts by convolution — so in the frequency domain it "
                "acts by simple multiplication with its 'frequency response.' Filtering, "
                "deblurring, and PDE solving (PF.U9's Green's functions) all run through this one "
                "identity.\n\n"
                "Dual: multiplication in time ↔ (scaled) convolution in frequency — windowing a "
                "signal smears its spectrum."
            )),
            (E, "Worked example", (
                "Transform of $t e^{-t^2/2}$ — no new integral needed.\n\n"
                "Note $t e^{-t^2/2} = -\\frac{d}{dt} e^{-t^2/2}$. With "
                "$\\mathcal F\\{e^{-t^2/2}\\} = \\sqrt{2\\pi} e^{-\\omega^2/2}$ and the "
                "differentiation rule ($f' \\to i\\omega \\hat f$):\n"
                "$$\\mathcal F\\{t e^{-t^2/2}\\} = -\\,i\\omega \\sqrt{2\\pi}\\, e^{-\\omega^2/2}.$$\n\n"
                "Odd real function → purely imaginary odd transform ✓ — the symmetry table "
                "confirming the calculus. Properties + a small table beat raw integration almost "
                "always."
            )),
            (P, "Pitfalls", (
                "1. Shift rule sign: DELAY ($t - t_0$) gives $e^{-i\\omega t_0}$ — plus sign means "
                "advance.\n\n"
                "2. Scaling's $\\frac{1}{|a|}$ forgotten, or applied inside $\\hat f$ too.\n\n"
                "3. Differentiation rule as $-i\\omega$ (depends on convention — derive it once "
                "under yours).\n\n"
                "4. $\\mathcal F\\{fg\\} = \\hat f \\hat g$ — FALSE: products transform to "
                "convolutions, not products.\n\n"
                "5. Convolution evaluated with the argument un-flipped "
                "($g(t - \\tau)$, not $g(\\tau - t)$... they differ unless $g$ is even)."
            )),
            (K, "Check yourself", (
                "You should be able to: apply each rule in both directions, chain them to avoid "
                "integrals, and use convolution↔multiplication fluently.\n\n"
                "Self-test: a filter multiplies spectra by $\\frac{1}{1 + i\\omega}$. What is its "
                "impulse response? ($e^{-t}u(t)$ — the table read backwards.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "PF.U2.N4": {
        "summary": "Parseval/Plancherel in the transform domain: energy across representations.",
        "steps": [
            (L, "The theorem", (
                "$$\\int_{-\\infty}^\\infty |f(t)|^2\\, dt = \\frac{1}{2\\pi} \\int_{-\\infty}^\\infty |\\hat f(\\omega)|^2\\, d\\omega.$$\n\n"
                "Total energy computed in time = total energy computed in frequency (with the "
                "convention-dependent $\\frac{1}{2\\pi}$). $|\\hat f(\\omega)|^2$ is the ENERGY "
                "SPECTRAL DENSITY — energy per unit frequency. The transform is (up to the "
                "constant) an ISOMETRY: it rearranges the signal's information without creating or "
                "destroying energy."
            )),
            (L, "Uses", (
                "• BAND ENERGY: energy in a frequency band $= \\frac{1}{2\\pi}\\int_{\\text{band}} "
                "|\\hat f|^2 d\\omega$ — what a bandpass filter passes; the basis of every "
                "equalizer display.\n"
                "• INTEGRAL EVALUATION: hard time-domain integrals become easy frequency ones (and "
                "vice versa) — compute $\\int \\frac{dt}{(1+t^2)^2}$-type integrals via the "
                "Lorentzian pair.\n"
                "• FILTER LOSS: energy removed by an ideal low-pass = the tail integral of "
                "$|\\hat f|^2$ — truncation error, transform edition.\n\n"
                "The general inner-product version (Plancherel): "
                "$\\int f \\bar g\\, dt = \\frac{1}{2\\pi}\\int \\hat f \\overline{\\hat g}\\, d\\omega$."
            )),
            (E, "Worked example", (
                "Evaluate $\\displaystyle\\int_{-\\infty}^\\infty \\frac{\\sin^2 t}{t^2}\\, dt$.\n\n"
                "Recognize $\\frac{\\sin t}{t} \\cdot 2 = \\frac{2\\sin t}{t}$ as the transform of the "
                "unit pulse on $[-1, 1]$... so let $f$ = that pulse: $\\hat f = \\frac{2\\sin\\omega}{\\omega}$.\n\n"
                "Parseval: $\\int |f|^2 dt = 2$ equals "
                "$\\frac{1}{2\\pi}\\int \\frac{4\\sin^2\\omega}{\\omega^2} d\\omega$, hence\n"
                "$$\\int_{-\\infty}^\\infty \\frac{\\sin^2 \\omega}{\\omega^2}\\, d\\omega = \\pi.$$\n\n"
                "A contour-integration-grade integral, done by energy accounting."
            )),
            (P, "Pitfalls", (
                "1. Dropping (or doubling) the $\\frac{1}{2\\pi}$ — convention discipline "
                "again.\n\n"
                "2. Forgetting the MODULUS on complex spectra ($\\hat f^2 \\ne |\\hat f|^2$).\n\n"
                "3. Band-energy computed over positive frequencies only when the signal is real "
                "(spectrum is two-sided; either double or integrate both sides).\n\n"
                "4. Using Parseval between $f$ and the transform of a DIFFERENT convention's "
                "table.\n\n"
                "5. Applying it to power signals (infinite energy) — those need power spectral "
                "density, a different normalization."
            )),
            (K, "Check yourself", (
                "You should be able to: state Plancherel with your convention, compute band "
                "energies, and evaluate integrals by moving domains.\n\n"
                "Self-test: what fraction of the pulse's energy does an ideal low-pass keeping "
                "$|\\omega| < \\frac{\\pi}{a}$... conceptually: most of it — the sinc's main lobe "
                "carries ~90% of the energy.\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U3: PDE classification ------------------------------
    "PF.U3.N1": {
        "summary": "PDE classification: elliptic, parabolic, hyperbolic — and why the type dictates everything.",
        "steps": [
            (L, "The discriminant test", (
                "For second-order linear PDEs $A u_{xx} + B u_{xy} + C u_{yy} + \\ldots = 0$, "
                "classify by $B^2 - 4AC$:\n\n"
                "• $< 0$: ELLIPTIC (Laplace $u_{xx} + u_{yy} = 0$).\n"
                "• $= 0$: PARABOLIC (heat $u_t = k u_{xx}$).\n"
                "• $> 0$: HYPERBOLIC (wave $u_{tt} = c^2 u_{xx}$).\n\n"
                "The names mirror conic sections — same discriminant, same trichotomy. "
                "Variable-coefficient equations can change type by region (transonic flow's "
                "mixed-type equations are the famous case)."
            )),
            (L, "Why type matters", (
                "Type dictates the PHYSICS and the well-posed problems:\n\n"
                "• ELLIPTIC: steady states, equilibrium. No time, no propagation; boundary data on "
                "a CLOSED curve; solutions instantly smooth inside.\n"
                "• PARABOLIC: diffusion. One time direction (irreversible!), initial + boundary "
                "data; infinite propagation speed but exponential damping; smooths rough data "
                "instantly.\n"
                "• HYPERBOLIC: waves. Time-reversible, FINITE propagation speed along "
                "characteristics; preserves (even propagates) singularities.\n\n"
                "Asking an elliptic question of a hyperbolic equation (or vice versa) gives "
                "ill-posed problems — the classification is a compatibility check between equation "
                "and data."
            )),
            (E, "Worked example", (
                "Classify $u_{xx} + 4u_{xy} + u_{yy} = 0$ and $y\\,u_{xx} + u_{yy} = 0$.\n\n"
                "First: $A = C = 1, B = 4$: $B^2 - 4AC = 12 > 0$ — HYPERBOLIC (despite "
                "resembling Laplace at a glance; the cross term decides).\n\n"
                "Second (Tricomi-type): $B^2 - 4AC = -4y$ — elliptic for $y > 0$, hyperbolic for "
                "$y < 0$, parabolic exactly on $y = 0$: one equation, three regimes, the model for "
                "flows crossing the speed of sound."
            )),
            (P, "Pitfalls", (
                "1. Reading $B$ as the FULL coefficient of $u_{xy}$ but using $B^2 - AC$ formulas "
                "from texts that write $2B$ — check the convention.\n\n"
                "2. Classifying by which letters appear ($t$ present ≠ not elliptic) — only the "
                "discriminant decides.\n\n"
                "3. Forgetting first-order terms don't affect type (only the principal part "
                "counts).\n\n"
                "4. Assigning one type to a variable-coefficient equation globally.\n\n"
                "5. Posing Cauchy (initial-value) data for elliptic equations — classically "
                "ill-posed (Hadamard's example)."
            )),
            (K, "Check yourself", (
                "You should be able to: compute the discriminant, name the three types with their "
                "canonical equations and physics, and flag mixed-type regions.\n\n"
                "Self-test: classify $u_{tt} + 2u_{tx} + u_{xx} = 0$. "
                "($B^2 - 4AC = 4 - 4 = 0$: parabolic — degenerate wave-like equation.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "PF.U3.N2": {
        "summary": "The three canonical equations: heat, wave, and Laplace — models and behavior.",
        "steps": [
            (L, "The heat and wave equations", (
                "HEAT: $u_t = k\\, u_{xx}$ — temperature in a rod; $k$ = diffusivity. Behavior: "
                "peaks flatten, energy spreads, information about initial roughness is destroyed "
                "(running it backwards is ill-posed). Needs: initial temperature + one boundary "
                "condition per end.\n\n"
                "WAVE: $u_{tt} = c^2 u_{xx}$ — vibrating string; $c$ = wave speed. Behavior: "
                "disturbances travel at exactly speed $c$, undistorted in 1D; energy conserved; "
                "time-reversible. Needs: initial displacement AND initial velocity (two time "
                "derivatives → two initial data)."
            )),
            (L, "Laplace's equation, and the family resemblance", (
                "LAPLACE: $u_{xx} + u_{yy} = 0$ — steady-state temperature, electrostatic "
                "potential, incompressible flow. Behavior: the MEAN VALUE property (each value = "
                "average over surrounding circles), hence maximum principle — no interior hot "
                "spots; extremes live on the boundary (PF.U6).\n\n"
                "Family view: Laplace is heat's $t \\to \\infty$ limit (steady state); wave and "
                "heat differ by one time derivative — and that single derivative flips "
                "reversibility, propagation speed, and smoothing. Dimensional sanity: $[k] = "
                "\\frac{\\text{length}^2}{\\text{time}}$, $[c] = \\frac{\\text{length}}{\\text{time}}$ "
                "— checkable in any modeling problem."
            )),
            (E, "Worked example", (
                "Same initial spike, three equations:\n\n"
                "• HEAT: the spike immediately becomes a smooth Gaussian-like bump, spreading as "
                "$\\sqrt{kt}$ and decaying — by $t = 1$ it's a gentle mound everywhere (infinite "
                "speed, tiny amplitude far away).\n\n"
                "• WAVE: the spike splits into two half-size copies racing apart at speed $c$, "
                "shapes intact (d'Alembert, PF.U5.N1).\n\n"
                "• LAPLACE (as a boundary bump on a disk): the interior responds smoothly, "
                "influence fading with distance, max on the boundary.\n\n"
                "One initial condition, three physics — the equation, not the data, sets the "
                "character."
            )),
            (P, "Pitfalls", (
                "1. Wave equation with only initial displacement — the velocity datum is not "
                "optional.\n\n"
                "2. Expecting heat to propagate at finite speed, or waves to smooth corners — "
                "swapped intuitions.\n\n"
                "3. Solving heat backwards in time.\n\n"
                "4. $k$ vs $c$ units confused (diffusivity is length²/time).\n\n"
                "5. Interior extrema in Laplace solutions — forbidden by the maximum principle; "
                "their appearance means an error."
            )),
            (K, "Check yourself", (
                "You should be able to: write all three equations with correct data requirements, "
                "contrast their behaviors, and dimension-check constants.\n\n"
                "Self-test: which equation conserves energy exactly, and which destroys "
                "information? (Wave conserves; heat destroys — irreversibly.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------ U4: separation ------------------------------
    "PF.U4.N1": {
        "summary": "Separation of variables: product solutions, the separation constant, and superposition.",
        "steps": [
            (L, "The method", (
                "Seek product solutions $u(x, t) = X(x)\\,T(t)$. Substituting into (say) "
                "$u_t = k u_{xx}$ and dividing by $kXT$:\n"
                "$$\\frac{T'}{kT} = \\frac{X''}{X} = -\\lambda$$\n"
                "— a function of $t$ alone equals a function of $x$ alone, so both equal a "
                "CONSTANT ($-\\lambda$). The PDE splits into two ODEs:\n"
                "$$X'' + \\lambda X = 0, \\qquad T' + \\lambda k T = 0.$$\n\n"
                "Boundary conditions transfer to $X$: $u(0,t) = 0$ becomes $X(0) = 0$."
            )),
            (L, "Eigenvalues, modes, and the grand assembly", (
                "The $X$-problem with its boundary conditions is an EIGENPROBLEM (PF.U7): only "
                "special $\\lambda_n$ admit nonzero solutions $X_n$ — the MODES. Each mode gets its "
                "own $T_n(t)$, giving building blocks $u_n = X_n T_n$.\n\n"
                "Superposition assembles the general solution "
                "$u = \\sum c_n X_n(x) T_n(t)$, and the INITIAL condition determines the $c_n$ — "
                "as the Fourier coefficients of the initial data in the $X_n$ basis. The whole U1 "
                "machinery exists exactly for this moment.\n\n"
                "Scope: linear, homogeneous PDEs with homogeneous boundary conditions on separable "
                "geometries. Nonhomogeneous pieces are split off first (steady state + "
                "transient)."
            )),
            (E, "Worked example", (
                "Heat in a rod of length $\\pi$, ends held at 0: $u_t = u_{xx}$, "
                "$u(0,t) = u(\\pi, t) = 0$.\n\n"
                "$X'' + \\lambda X = 0$, $X(0) = X(\\pi) = 0$ → $\\lambda_n = n^2$, "
                "$X_n = \\sin nx$ (PF.U7.N2's computation).\n"
                "$T_n' = -n^2 T_n$ → $T_n = e^{-n^2 t}$.\n"
                "$$u(x,t) = \\sum_{n=1}^\\infty b_n e^{-n^2 t} \\sin nx,$$\n"
                "with $b_n$ = sine coefficients of $u(x, 0)$.\n\n"
                "Physics visible: mode $n$ dies like $e^{-n^2 t}$ — fine structure vanishes "
                "fastest; after a short time only the fundamental $\\sin x$ bump remains."
            )),
            (P, "Pitfalls", (
                "1. The separation constant's SIGN: choosing $+\\lambda$ flips which problem "
                "oscillates; the boundary conditions decide (fixed ends want "
                "$X'' + \\lambda X = 0$ with $\\lambda > 0$).\n\n"
                "2. Applying the INITIAL condition to a single product solution instead of the "
                "superposition.\n\n"
                "3. Separating with NONhomogeneous boundary conditions ($u(0) = 5$) — subtract the "
                "steady state first.\n\n"
                "4. Losing the $k$ in $T' = -\\lambda k T$.\n\n"
                "5. Claiming separation works for every PDE — it needs linearity and geometry "
                "aligned with the coordinates."
            )),
            (K, "Check yourself", (
                "You should be able to: run the separation ritual, transfer boundary conditions, "
                "assemble the series, and fit initial data via Fourier coefficients.\n\n"
                "Self-test: separate the WAVE equation $u_{tt} = c^2 u_{xx}$ — what changes? "
                "($T'' + \\lambda c^2 T = 0$: oscillation $\\cos/\\sin(nct)$ instead of decay — "
                "standing waves.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U4.N2": {
        "summary": "Heat equation modes: decay rates, dominant-mode behavior, and steady states.",
        "steps": [
            (L, "Anatomy of the solution", (
                "$$u(x,t) = \\sum_n b_n\\, e^{-k n^2 \\pi^2 t / L^2} \\sin\\frac{n\\pi x}{L}$$\n"
                "(fixed-zero ends, length $L$). Each mode is a standing sine that decays in place; "
                "the DECAY RATE grows like $n^2$:\n\n"
                "• Mode 2 dies 4× faster than mode 1; mode 10, 100× faster.\n"
                "• The $\\frac{1}{L^2}$: doubling the rod length QUADRUPLES time scales — thick "
                "walls insulate quadratically.\n\n"
                "TIME SCALE: $\\tau = \\frac{L^2}{k\\pi^2}$ — after a few $\\tau$, only mode 1 "
                "survives: every initial condition ends up looking like a single sine arch "
                "melting away."
            )),
            (L, "Steady states and nonhomogeneous boundaries", (
                "Ends held at $T_1, T_2 \\ne 0$: split $u = v(x) + w(x, t)$ where the STEADY "
                "STATE $v$ solves $v'' = 0$ with the boundary values — a straight line "
                "$v = T_1 + (T_2 - T_1)\\frac{x}{L}$ — and the TRANSIENT $w$ has homogeneous "
                "conditions and the standard series.\n\n"
                "So: long-run = linear profile; approach = mode-1 exponential with rate "
                "$\\frac{k\\pi^2}{L^2}$. Insulated ends ($u_x = 0$) swap sines for COSINES and "
                "add the constant mode $n = 0$ — the average temperature, which never decays "
                "(nowhere for the heat to go)."
            )),
            (E, "Worked example", (
                "Rod of length $\\pi$, $k = 1$, $u(x, 0) = \\sin x + \\frac12 \\sin 3x$, ends at "
                "0.\n\n"
                "Coefficients read off directly: $b_1 = 1, b_3 = \\frac12$:\n"
                "$$u = e^{-t}\\sin x + \\tfrac12 e^{-9t} \\sin 3x.$$\n\n"
                "At $t = 0.5$: amplitudes $0.61$ and $0.006$ — the wiggle is already gone; the "
                "profile is a clean arch. At $t = 3$: amplitude $0.05$, shape pure $\\sin x$. "
                "Long-time behavior was predictable at $t = 0$: mode 1 always wins."
            )),
            (P, "Pitfalls", (
                "1. Linear decay intuition — decay is exponential, with $n^2$ in the "
                "exponent.\n\n"
                "2. Forgetting $\\frac{\\pi^2}{L^2}$ in the rate for general $L$ (rates are not "
                "just $n^2$).\n\n"
                "3. Series attacked with nonzero boundary values — steady state first.\n\n"
                "4. Insulated-end problems forced into sine series (they want cosines + the "
                "conserved average).\n\n"
                "5. Reporting 'equilibrium = 0' when ends are held at different temperatures — "
                "equilibrium is the LINE, not zero."
            )),
            (K, "Check yourself", (
                "You should be able to: read decay rates, estimate when one mode dominates, "
                "split steady + transient, and handle both boundary types.\n\n"
                "Self-test: two rods, lengths $L$ and $2L$ — ratio of times to lose their "
                "initial wiggles? (1 : 4.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U5: waves ------------------------------
    "PF.U5.N1": {
        "summary": "d'Alembert's solution: u = F(x − ct) + G(x + ct) and the domain of dependence.",
        "steps": [
            (L, "The formula", (
                "The 1D wave equation $u_{tt} = c^2 u_{xx}$ on the whole line has GENERAL "
                "solution\n"
                "$$u = F(x - ct) + G(x + ct)$$\n"
                "— a right-mover plus a left-mover, shapes arbitrary. With initial displacement "
                "$f$ and velocity $g$:\n"
                "$$u(x,t) = \\frac{f(x - ct) + f(x + ct)}{2} + \\frac{1}{2c}\\int_{x - ct}^{x + ct} g(s)\\, ds.$$\n\n"
                "Plucked string ($g = 0$): the shape splits into two half-height copies moving "
                "apart at speed $c$. Struck string ($f = 0$): a spreading plateau."
            )),
            (L, "Domain of dependence and influence", (
                "Read the formula's geometry: $u(x, t)$ uses initial data ONLY from "
                "$[x - ct, x + ct]$ — the DOMAIN OF DEPENDENCE. Nothing outside that interval "
                "can matter yet: information travels at speed exactly $c$, no faster.\n\n"
                "Dually, initial data at a point influences only the expanding cone "
                "$|x - x_0| \\le ct$ — the DOMAIN OF INFLUENCE (the light cone of relativity is "
                "this picture). Contrast with heat: there, everything influences everything "
                "instantly. Finite speed is hyperbolicity's signature."
            )),
            (E, "Worked example", (
                "$c = 1$, $f(x) = $ a bump on $[-1, 1]$ of height 1, $g = 0$.\n\n"
                "$$u(x, t) = \\tfrac12 f(x - t) + \\tfrac12 f(x + t).$$\n\n"
                "At $t = 0.5$: two half-bumps overlapping (sum still tall in the middle). "
                "At $t = 2$: two clean half-height bumps centered at $\\pm 2$, fully separated, "
                "traveling on forever undistorted.\n\n"
                "And $u(5, 3) = 0$: the interval $[5-3, 5+3] = [2, 8]$ misses the initial bump "
                "entirely — the signal simply hasn't arrived. Causality, computed."
            )),
            (P, "Pitfalls", (
                "1. Signs: $F(x - ct)$ moves RIGHT (the argument stays constant when $x$ grows "
                "with $t$).\n\n"
                "2. Forgetting the $\\frac12$'s — the initial shape SPLITS.\n\n"
                "3. The velocity term's $\\frac{1}{2c}$ and its INTEGRAL nature (struck strings "
                "spread; they don't translate).\n\n"
                "4. Applying the whole-line formula on a bounded string without reflections "
                "(method of images handles boundaries).\n\n"
                "5. Expecting dispersion or damping — the 1D wave equation has neither; shapes "
                "persist exactly."
            )),
            (K, "Check yourself", (
                "You should be able to: apply d'Alembert with both data, sketch splitting bumps, "
                "and compute domains of dependence/influence.\n\n"
                "Self-test: with $c = 2$, when does data at $x = 0$ first affect the point "
                "$x = 10$? ($t = 5$.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U5.N2": {
        "summary": "Traveling-wave solutions: the moving-profile ansatz across PDEs.",
        "steps": [
            (L, "The ansatz", (
                "A TRAVELING WAVE is a fixed profile moving at constant speed: "
                "$u(x, t) = \\phi(\\xi)$, $\\xi = x - ct$. Substituting turns PDE derivatives into "
                "ODE ones ($u_t = -c\\phi'$, $u_x = \\phi'$, $u_{tt} = c^2 \\phi''$...): the PDE "
                "collapses to an ODE for the profile $\\phi$, with the speed $c$ as a parameter "
                "— often determined by boundary conditions at $\\xi = \\pm\\infty$."
            )),
            (L, "Where it leads", (
                "• Wave equation: ANY profile works at $c = \\pm c_0$ (d'Alembert again — "
                "linearity puts no constraint on shape).\n"
                "• Dispersive equations: plug $e^{i(kx - \\omega t)}$ → the DISPERSION RELATION "
                "$\\omega(k)$; different wavelengths travel at different speeds, packets "
                "spread.\n"
                "• Nonlinear equations: profiles must fight it out — KdV's solitons, "
                "reaction-diffusion fronts (Fisher's equation), Burgers' shocks: special shapes "
                "at special speeds, found by solving the profile ODE's boundary-value problem.\n\n"
                "The ansatz is the standard first probe of any new evolution equation: what "
                "moves without changing shape, and how fast?"
            )),
            (E, "Worked example", (
                "Find traveling waves of the transport-with-decay equation "
                "$u_t + 2u_x = -u$.\n\n"
                "Ansatz $u = \\phi(x - ct)$: $-c\\phi' + 2\\phi' = -\\phi$, i.e. "
                "$(2 - c)\\phi' = -\\phi$.\n\n"
                "• $c = 2$: forced $\\phi = 0$ — no nontrivial profile survives at the transport "
                "speed (decay kills it).\n"
                "• $c \\ne 2$: $\\phi(\\xi) = A e^{-\\xi/(2 - c)}$ — exponential profiles, e.g. "
                "$c = 1$: $\\phi = Ae^{-\\xi}$, a decaying ramp sliding right at speed 1.\n\n"
                "Boundedness on the whole line then selects which $(c, \\phi)$ pairs are "
                "physical — the typical final step."
            )),
            (P, "Pitfalls", (
                "1. Chain-rule sign: $u_t = -c\\phi'$ — the minus is where most derivations "
                "die.\n\n"
                "2. Treating $c$ as known — for nonlinear problems the speed is part of the "
                "unknown.\n\n"
                "3. Accepting unbounded profiles without checking the problem's boundary "
                "conditions at infinity.\n\n"
                "4. Concluding no solution exists because ONE $c$ fails (scan the parameter).\n\n"
                "5. Expecting the ansatz to give ALL solutions — it finds the "
                "shape-preserving ones only."
            )),
            (K, "Check yourself", (
                "You should be able to: reduce PDEs to profile ODEs, track the speed parameter, "
                "and apply boundedness/boundary selection.\n\n"
                "Self-test: traveling waves of $u_t + 3u_x = 0$? "
                "(ANY profile at $c = 3$: $u = \\phi(x - 3t)$ — pure transport.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------ U6 ------------------------------
    "PF.U6.N1": {
        "summary": "Harmonic functions: the mean value property, maximum principle, and uniqueness.",
        "steps": [
            (L, "Harmonicity and the mean value property", (
                "$u$ is HARMONIC where $\\nabla^2 u = u_{xx} + u_{yy} = 0$. The defining miracle "
                "— the MEAN VALUE PROPERTY:\n"
                "$$u(x_0, y_0) = \\frac{1}{2\\pi}\\int_0^{2\\pi} u(x_0 + r\\cos\\theta,\\; y_0 + r\\sin\\theta)\\, d\\theta$$\n"
                "— every value equals the average over any surrounding circle. Harmonic "
                "functions are perfectly 'democratic': no value stands above its neighbors' "
                "average. Examples: $x^2 - y^2$, $e^x \\cos y$, $\\ln(x^2 + y^2)$ (away from 0); "
                "real/imaginary parts of complex-analytic functions, all of them."
            )),
            (L, "Maximum principle and its consequences", (
                "From the mean value property: a harmonic function on a bounded domain attains "
                "its MAX and MIN on the BOUNDARY (a strict interior max would beat its own "
                "average — contradiction).\n\n"
                "Consequences with teeth:\n"
                "• UNIQUENESS for the Dirichlet problem: two solutions with the same boundary "
                "data differ by a harmonic function vanishing on the boundary — whose max and "
                "min are both 0.\n"
                "• STABILITY: small boundary changes → small interior changes (the max of the "
                "difference is on the boundary).\n"
                "• Physical reading: no interior hot spots at steady state; potential has no "
                "local equilibria inside a charge-free region (Earnshaw's theorem)."
            )),
            (E, "Worked example", (
                "Check $u = x^2 - y^2$: $u_{xx} = 2$, $u_{yy} = -2$, sum 0 ✓ harmonic.\n\n"
                "Mean value at the origin over the unit circle: "
                "$\\frac{1}{2\\pi}\\int (\\cos^2\\theta - \\sin^2\\theta) d\\theta = "
                "\\frac{1}{2\\pi}\\int \\cos 2\\theta\\, d\\theta = 0 = u(0,0)$ ✓.\n\n"
                "Maximum principle in action: on the unit disk, $u$'s extremes $\\pm 1$ occur at "
                "boundary points $(\\pm1, 0), (0, \\pm1)$ — the interior saddle at the origin is "
                "no extremum at all."
            )),
            (P, "Pitfalls", (
                "1. Verifying harmonicity with FIRST derivatives — it's the Laplacian.\n\n"
                "2. Applying the maximum principle on UNBOUNDED domains without growth "
                "conditions.\n\n"
                "3. 'No interior max' misread as 'no interior critical points' — saddles are "
                "fine (generic, even).\n\n"
                "4. Assuming products/compositions of harmonic functions are harmonic (sums "
                "yes; $x^2 - y^2$ times itself, no).\n\n"
                "5. Using uniqueness without matching the boundary CONDITION TYPE (Dirichlet vs "
                "Neumann — the latter is unique only up to constants)."
            )),
            (K, "Check yourself", (
                "You should be able to: verify harmonicity, state and apply mean value and "
                "maximum principles, and run the uniqueness argument.\n\n"
                "Self-test: a harmonic function on the disk is 0 on the whole boundary. What is "
                "it inside? (Identically 0 — max = min = 0.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U7: eigenproblems ------------------------------
    "PF.U7.N1": {
        "summary": "Boundary value eigenproblems: when BVPs have nontrivial solutions.",
        "steps": [
            (L, "BVPs are different", (
                "An IVP pins all data at one point — existence/uniqueness is generic "
                "(ODE.U1.N4). A BOUNDARY value problem splits conditions between two points — "
                "and can have no solution, one, or infinitely many, depending delicately on the "
                "equation.\n\n"
                "The EIGENPROBLEM flips this bug into the feature: for "
                "$X'' + \\lambda X = 0$ with homogeneous boundary conditions, $X \\equiv 0$ "
                "always works; the question is for WHICH $\\lambda$ nontrivial solutions exist. "
                "Those $\\lambda_n$ are the EIGENVALUES, their solutions the EIGENFUNCTIONS — "
                "the modes of separation of variables (PF.U4)."
            )),
            (L, "Structure of the spectrum", (
                "For the classical Sturm-Liouville setups (this course's cases):\n\n"
                "• Eigenvalues form an increasing sequence $\\lambda_1 < \\lambda_2 < \\cdots \\to \\infty$ "
                "— a DISCRETE spectrum: boundaries quantize.\n"
                "• Eigenfunction $n$ has $n - 1$ interior zeros — more oscillation, higher "
                "eigenvalue.\n"
                "• Eigenfunctions of distinct eigenvalues are ORTHOGONAL (N3) — the property "
                "that makes Fourier coefficients computable.\n\n"
                "Physics: a guitar string of fixed length can't vibrate at arbitrary "
                "frequencies — only the quantized $\\lambda_n$. The same quantization, with the "
                "same math, runs quantum mechanics' particle in a box."
            )),
            (E, "Worked example", (
                "Contrast two BVPs for $X'' + \\lambda X = 0$ on $[0, \\pi]$:\n\n"
                "(a) $X(0) = 0, X(\\pi) = 0$: nontrivial solutions at $\\lambda = 1, 4, 9, \\ldots$ "
                "(N2's computation) — an eigenproblem with infinitely many successes.\n\n"
                "(b) $X(0) = 0, X(\\pi) = 1$ (NONhomogeneous) with $\\lambda = 4$ fixed: "
                "$X = c\\sin 2x$ satisfies the first condition, but $X(\\pi) = 0 \\ne 1$ — NO "
                "solution at all. Same equation, same interval: the boundary data decides "
                "everything. (At $\\lambda = 2$, by contrast, a unique solution exists.)"
            )),
            (P, "Pitfalls", (
                "1. Expecting IVP-style guaranteed uniqueness from BVPs.\n\n"
                "2. Reporting $X \\equiv 0$ as 'the solution' of an eigenproblem — trivial "
                "solutions are the wallpaper; eigenvalues are the question.\n\n"
                "3. Missing that eigenproblems need HOMOGENEOUS boundary conditions (both "
                "conditions zero-type).\n\n"
                "4. Assuming a continuous range of eigenvalues — bounded domains give discrete "
                "spectra.\n\n"
                "5. Forgetting negative/zero $\\lambda$ candidates when boundary conditions "
                "allow them (Neumann problems have $\\lambda_0 = 0$)."
            )),
            (K, "Check yourself", (
                "You should be able to: distinguish BVPs from IVPs, define eigenvalue/"
                "eigenfunction, and state the spectrum's structure.\n\n"
                "Self-test: why does a drum have discrete pitches? "
                "(Its boundary makes the Laplacian's eigenproblem discrete — the "
                "eigenfrequencies.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U7.N2": {
        "summary": "Eigenvalues and eigenfunctions of X'' + λX = 0: the three boundary classics.",
        "steps": [
            (L, "The Dirichlet case, in full", (
                "$X'' + \\lambda X = 0$, $X(0) = X(L) = 0$. Test the three $\\lambda$ regimes:\n\n"
                "• $\\lambda < 0$: $X = A e^{\\mu x} + B e^{-\\mu x}$ — boundary conditions force "
                "$A = B = 0$. Nothing.\n"
                "• $\\lambda = 0$: $X = Ax + B$ — again nothing.\n"
                "• $\\lambda > 0$: $X = A\\cos\\mu x + B \\sin \\mu x$; $X(0) = 0$ kills $A$; "
                "$X(L) = 0$ needs $\\sin \\mu L = 0$: $\\mu L = n\\pi$.\n\n"
                "$$\\lambda_n = \\left(\\frac{n\\pi}{L}\\right)^2, \\qquad X_n = \\sin\\frac{n\\pi x}{L}, "
                "\\quad n = 1, 2, \\ldots$$"
            )),
            (L, "Neumann and mixed cases", (
                "• NEUMANN ($X'(0) = X'(L) = 0$, insulated ends): "
                "$\\lambda_n = (\\frac{n\\pi}{L})^2$ with $X_n = \\cos\\frac{n\\pi x}{L}$ — and "
                "crucially $n = 0$ COUNTS: $\\lambda_0 = 0$, $X_0 = 1$ (the conserved "
                "average).\n\n"
                "• MIXED ($X(0) = 0, X'(L) = 0$): $\\cos \\mu L = 0$ → "
                "$\\mu L = \\frac{(2n-1)\\pi}{2}$ — QUARTER-wavelength modes "
                "$\\lambda_n = (\\frac{(2n-1)\\pi}{2L})^2$, the acoustics of a tube closed at "
                "one end (why clarinets play odd harmonics).\n\n"
                "Pattern: boundary conditions select which trig family and which frequencies — "
                "memorize the method (three-regime test), not just the answers."
            )),
            (E, "Worked example", (
                "Solve $X'' + \\lambda X = 0$, $X'(0) = 0$, $X(2) = 0$.\n\n"
                "$X'(0) = 0$ keeps the COSINE: $X = A\\cos\\mu x$. Then "
                "$X(2) = A\\cos 2\\mu = 0$ needs $2\\mu = \\frac{(2n-1)\\pi}{2}$:\n"
                "$$\\lambda_n = \\left(\\frac{(2n-1)\\pi}{4}\\right)^2, \\qquad "
                "X_n = \\cos\\frac{(2n-1)\\pi x}{4}.$$\n\n"
                "Check $n = 1$: $X = \\cos\\frac{\\pi x}{4}$ — slope 0 at 0 ✓, zero at "
                "$x = 2$ ✓. Negative and zero $\\lambda$ were tested and eliminated (do it "
                "once per problem; here $\\lambda = 0$ gives $X = A$, killed by $X(2) = 0$)."
            )),
            (P, "Pitfalls", (
                "1. Skipping the $\\lambda \\le 0$ regimes — usually empty, but the CHECK is "
                "part of the solution (and Neumann's $\\lambda = 0$ is a real eigenvalue).\n\n"
                "2. Dirichlet indexed from $n = 0$ ($\\sin 0 = 0$ is trivial) or Neumann from "
                "$n = 1$ (missing the constant).\n\n"
                "3. $\\lambda_n = \\frac{n\\pi}{L}$ without the SQUARE.\n\n"
                "4. Sine kept when the condition is on $X'$ (derivative conditions keep the "
                "cosine).\n\n"
                "5. Mixed problems forced into half-wavelength patterns — they're "
                "quarter-wavelength."
            )),
            (K, "Check yourself", (
                "You should be able to: run the three-regime analysis for all three boundary "
                "types and produce $\\lambda_n, X_n$ with correct indexing.\n\n"
                "Self-test: $X(0) = X(1) = 0$ — first three eigenvalues? "
                "($\\pi^2, 4\\pi^2, 9\\pi^2$.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U7.N3": {
        "summary": "Orthogonality and eigenfunction expansions: computing coefficients by projection.",
        "steps": [
            (L, "Orthogonality", (
                "Eigenfunctions of a Sturm-Liouville problem with DISTINCT eigenvalues are "
                "orthogonal:\n"
                "$$\\int_0^L X_m(x) X_n(x)\\, dx = 0 \\quad (m \\ne n).$$\n\n"
                "For the Dirichlet sines: $\\int_0^L \\sin\\frac{m\\pi x}{L}\\sin\\frac{n\\pi x}{L} dx = 0$ "
                "($m \\ne n$), $= \\frac L 2$ ($m = n$). The proof is integration by parts on "
                "the eigen-equations — orthogonality comes from the OPERATOR's symmetry, not "
                "from trig coincidence, which is why it survives into variable-coefficient and "
                "higher-dimensional problems."
            )),
            (L, "Expansions by projection", (
                "To expand $f(x) = \\sum c_n X_n(x)$: multiply by $X_m$, integrate, use "
                "orthogonality —\n"
                "$$c_n = \\frac{\\int_0^L f\\, X_n\\, dx}{\\int_0^L X_n^2\\, dx}.$$\n\n"
                "Fourier sine/cosine coefficients are this formula for the classical "
                "eigenfunctions; the SAME formula serves Bessel expansions (drums), Legendre "
                "expansions (spheres), quantum eigenstates. One geometry — projection onto "
                "orthogonal axes (LA.U8) — powering all of applied analysis.\n\n"
                "This is the step that completes separation of variables: initial data → "
                "coefficients → full PDE solution."
            )),
            (E, "Worked example", (
                "Expand $f(x) = 1$ on $[0, \\pi]$ in the Dirichlet eigenfunctions "
                "$\\sin nx$.\n\n"
                "$$c_n = \\frac{\\int_0^\\pi \\sin nx\\, dx}{\\int_0^\\pi \\sin^2 nx\\, dx} "
                "= \\frac{\\frac{1 - \\cos n\\pi}{n}}{\\pi/2} = \\frac{2(1 - (-1)^n)}{n\\pi} "
                "= \\begin{cases} \\frac{4}{n\\pi} & n \\text{ odd} \\\\ 0 & n \\text{ even.} \\end{cases}$$\n"
                "$$1 = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right) "
                "\\quad (0 < x < \\pi)$$\n"
                "— the square-wave series again, now born as an eigenfunction expansion. Feed "
                "it to the heat solution of PF.U4.N2 and the rod's cooling from uniform "
                "temperature is solved."
            )),
            (P, "Pitfalls", (
                "1. Forgetting the normalization denominator $\\int X_n^2$ (it is $\\frac L2$, "
                "not 1, for sines).\n\n"
                "2. Using orthogonality across DIFFERENT boundary problems (sines from one "
                "problem aren't orthogonal to cosines of another on the same interval in the "
                "needed sense).\n\n"
                "3. Weight functions ignored in general Sturm-Liouville problems "
                "(orthogonality may hold with $\\int X_m X_n\\, w\\,dx$).\n\n"
                "4. Expecting the expansion to match $f$ AT the boundaries when $f$ violates "
                "the boundary conditions (it converges to the eigenfunctions' behavior — e.g. "
                "0 at Dirichlet ends).\n\n"
                "5. Even-$n$ terms 'simplified' away by luck rather than by the "
                "$(1 - (-1)^n)$ bookkeeping."
            )),
            (K, "Check yourself", (
                "You should be able to: prove sine orthogonality, compute expansion "
                "coefficients by projection, and finish a separation-of-variables problem end "
                "to end.\n\n"
                "Self-test: in the expansion of $f = 1$ above, what does the series converge "
                "to at $x = 0$? (0 — the midpoint of the odd extension's jump, matching the "
                "boundary condition, not $f$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U8: characteristics ------------------------------
    "PF.U8.N1": {
        "summary": "Characteristic lines: curves along which first-order PDEs become ODEs.",
        "steps": [
            (L, "The idea", (
                "For $a\\,u_t + b\\,u_x = c$ (first-order linear), look along curves "
                "$x(t)$ with $\\frac{dx}{dt} = \\frac{b}{a}$: along them,\n"
                "$$\\frac{d}{dt} u(x(t), t) = u_t + \\frac{dx}{dt} u_x = \\frac{c}{a}$$\n"
                "— the PDE becomes an ODE along each curve. These are the CHARACTERISTICS: the "
                "paths information rides. Solve the family of ODEs, one per starting point, and "
                "the PDE is solved.\n\n"
                "For constant coefficients the characteristics are parallel straight lines "
                "$x - \\frac ba t = \\text{const}$."
            )),
            (L, "Reading solutions from characteristics", (
                "• $u_t + cu_x = 0$: $u$ CONSTANT along lines $x - ct = $ const → "
                "$u = f(x - ct)$: the initial profile slides at speed $c$ (PF.U8.N2).\n"
                "• With a source ($= g$): $u$ ACCUMULATES $g$ along the line — integrate along "
                "the characteristic.\n"
                "• Variable speed $u_t + v(x) u_x = 0$: characteristics curve; where they "
                "spread, profiles stretch; where they converge, gradients steepen.\n\n"
                "The second-order connection: the wave equation FACTORS as "
                "$(\\partial_t - c\\partial_x)(\\partial_t + c\\partial_x) u = 0$ — two "
                "characteristic families $x \\pm ct$, which is exactly why d'Alembert's answer "
                "is $F(x - ct) + G(x + ct)$."
            )),
            (E, "Worked example", (
                "Solve $u_t + 2u_x = 0$, $u(x, 0) = \\frac{1}{1 + x^2}$.\n\n"
                "Characteristics: $\\frac{dx}{dt} = 2$ → $x = x_0 + 2t$. Along each, "
                "$u$ is constant, equal to its initial value at $x_0 = x - 2t$:\n"
                "$$u(x, t) = \\frac{1}{1 + (x - 2t)^2}.$$\n\n"
                "Check: $u_t = \\frac{4(x - 2t)}{(1 + (x-2t)^2)^2}$, "
                "$u_x = \\frac{-2(x-2t)}{(\\cdot)^2}$ — indeed $u_t + 2u_x = 0$ ✓. The bump at "
                "the origin at $t = 0$ sits at $x = 6$ when $t = 3$: riding its "
                "characteristic."
            )),
            (P, "Pitfalls", (
                "1. Characteristic slope inverted ($\\frac{dx}{dt} = \\frac ba$ from "
                "$a u_t + b u_x$ — match the derivative pairing).\n\n"
                "2. Writing $u = f(x + ct)$ for $u_t + cu_x = 0$ — sign flips direction; check "
                "against 'profile moves right for $c > 0$.'\n\n"
                "3. Forgetting the source accumulation when $c \\ne 0$ — constancy along "
                "characteristics holds only for the homogeneous equation.\n\n"
                "4. Crossing characteristics treated as fine — where they cross (nonlinear "
                "problems), classical solutions END (shocks form).\n\n"
                "5. Using $t$-characteristics for problems where data sits on a curve the "
                "characteristics don't cross (no information reaches some regions)."
            )),
            (K, "Check yourself", (
                "You should be able to: derive the characteristic ODEs, solve constant and "
                "simple variable-speed transport, and connect factoring to d'Alembert.\n\n"
                "Self-test: along which lines is the solution of $u_t - 3u_x = 0$ constant? "
                "($x + 3t = $ const — leftward transport.)\n\nPractice the node."
            )),
        ],
    },
    "PF.U8.N2": {
        "summary": "The transport equation: the simplest PDE, solved completely.",
        "steps": [
            (L, "The equation and its solution", (
                "$$u_t + c\\, u_x = 0, \\qquad u(x, 0) = f(x) \\quad\\Longrightarrow\\quad "
                "u(x, t) = f(x - ct).$$\n\n"
                "The initial profile translates rigidly at speed $c$ — no spreading, no "
                "damping, no distortion. It models pure advection: dye in a uniform stream, "
                "cars on an (idealized) highway, a signal on an ideal line.\n\n"
                "Verify once by the chain rule: $u_t = -cf'$, $u_x = f'$ — sum zero. Every "
                "claim about transport reduces to this two-line check."
            )),
            (L, "Variations that preview the field", (
                "• WITH DECAY: $u_t + cu_x = -\\lambda u$ → $u = e^{-\\lambda t} f(x - ct)$ — "
                "translate AND fade.\n"
                "• WITH SOURCE: $u_t + cu_x = g(x, t)$ → integrate $g$ along "
                "characteristics.\n"
                "• NONLINEAR (Burgers): $u_t + u\\,u_x = 0$ — each height moves at its OWN "
                "speed $u$: tall parts overtake short parts, profiles steepen, and in finite "
                "time characteristics cross: a SHOCK. The transport equation is where shock "
                "theory, traffic modeling, and gas dynamics all begin.\n\n"
                "Numerically, transport is also the standard testbed: schemes that smear or "
                "wiggle $f(x - ct)$ reveal their dissipation/dispersion errors immediately."
            )),
            (E, "Worked example", (
                "Solve $u_t + 3u_x = -u$, $u(x, 0) = e^{-x^2}$.\n\n"
                "Along characteristics $x = x_0 + 3t$: $\\frac{du}{dt} = -u$ → "
                "$u = u_0 e^{-t}$ with $u_0 = e^{-x_0^2}$:\n"
                "$$u(x, t) = e^{-t}\\, e^{-(x - 3t)^2}.$$\n\n"
                "A Gaussian bump sliding right at speed 3 while shrinking by $e^{-t}$ — at "
                "$t = 2$ it is centered at $x = 6$ with 13.5% of its height. Translation and "
                "decay, cleanly factored."
            )),
            (P, "Pitfalls", (
                "1. $f(x + ct)$ vs $f(x - ct)$ — the eternal sign; positive $c$ moves RIGHT "
                "with the MINUS form.\n\n"
                "2. Adding spurious spreading — transport does not diffuse; if your solution "
                "widens, a $u_{xx}$ crept in.\n\n"
                "3. In decay problems, decaying in $x$ instead of $t$ (the factor is "
                "$e^{-\\lambda t}$, uniform in space).\n\n"
                "4. Extending Burgers solutions past the shock time with the "
                "characteristic formula — multivalued nonsense; shocks need jump "
                "conditions.\n\n"
                "5. Boundary data ignored on half-line problems (characteristics entering the "
                "domain must carry data from the boundary, not the initial line)."
            )),
            (K, "Check yourself", (
                "You should be able to: solve transport with decay/sources, verify by chain "
                "rule, and explain shock formation in one sentence.\n\n"
                "Self-test: $u_t + u u_x = 0$ with initial data decreasing in $x$ — why must a "
                "shock form? (Faster (taller) fluid starts BEHIND slower: characteristics "
                "converge and cross.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U9 ------------------------------
    "PF.U9.N1": {
        "summary": "Green's functions: the impulse response that solves every forcing by superposition.",
        "steps": [
            (L, "The idea", (
                "For a linear problem $L[u] = f$, the GREEN'S FUNCTION $G(x, s)$ is the "
                "response at $x$ to a UNIT IMPULSE (delta) at $s$: $L[G(\\cdot, s)] = "
                "\\delta(\\cdot - s)$, with the problem's homogeneous boundary conditions. "
                "Then any forcing is a superposition of impulses, so\n"
                "$$u(x) = \\int G(x, s)\\, f(s)\\, ds$$\n"
                "— solve ONCE for the impulse, solve FOREVER by integration. It is the "
                "continuous version of inverting a matrix: $G$ is $L^{-1}$'s kernel."
            )),
            (L, "Construction for two-point BVPs", (
                "For $-u'' = f$ on $[0, 1]$, $u(0) = u(1) = 0$: build $G(x, s)$ from "
                "homogeneous solutions satisfying ONE boundary condition each — $u_1 = x$ "
                "(good at 0), $u_2 = 1 - x$ (good at 1) — glued at $x = s$: continuous there, "
                "with a JUMP of the right size in the derivative (that jump integrates the "
                "delta):\n"
                "$$G(x, s) = \\begin{cases} x(1 - s), & x \\le s \\\\ s(1 - x), & x \\ge s. \\end{cases}$$\n\n"
                "Properties visible: symmetric ($G(x,s) = G(s,x)$ — reciprocity), positive, "
                "tent-shaped: the deflection of a string pinned at both ends under a point "
                "load. Time-dependent version: the heat KERNEL "
                "$\\frac{1}{\\sqrt{4\\pi kt}} e^{-x^2/4kt}$ plays the same role via "
                "convolution (PF.U2.N3's theorem in action)."
            )),
            (E, "Worked example", (
                "Solve $-u'' = 1$ on $[0,1]$, $u(0) = u(1) = 0$, via $G$:\n\n"
                "$$u(x) = \\int_0^1 G(x, s)\\,ds = \\int_0^x s(1-x)\\, ds + \\int_x^1 x(1 - s)\\, ds$$\n"
                "$$= (1-x)\\frac{x^2}{2} + x\\,\\frac{(1-x)^2}{2} = \\frac{x(1-x)}{2}.$$\n\n"
                "Check directly: $u = \\frac{x - x^2}{2}$, $-u'' = 1$ ✓, boundaries 0 ✓ — the "
                "parabolic sag of a uniformly loaded string. Any other load $f$ now costs one "
                "integral, not a new solve."
            )),
            (P, "Pitfalls", (
                "1. Boundary conditions on $G$ forgotten — a Green's function is tied to ITS "
                "boundary value problem; changing conditions changes $G$.\n\n"
                "2. The derivative-jump size wrong (it's $-1$ for $-u''$, sign per the "
                "operator's convention).\n\n"
                "3. Which piece for $x < s$ vs $x > s$ swapped — check each piece satisfies "
                "its OWN boundary.\n\n"
                "4. Using $G$ for a NONhomogeneous boundary problem without adding the "
                "boundary-term corrections.\n\n"
                "5. Expecting symmetry when the operator isn't self-adjoint — reciprocity is a "
                "theorem with hypotheses, not a freebie."
            )),
            (K, "Check yourself", (
                "You should be able to: define $G$ as impulse response, construct it for "
                "two-point problems by gluing, and solve arbitrary forcings by "
                "integration.\n\n"
                "Self-test: physically, what is $G(x, s)$ for the pinned string? "
                "(The string's shape when a unit point load hangs at $s$ — read at "
                "$x$.)\n\nPractice the node."
            )),
        ],
    },
}

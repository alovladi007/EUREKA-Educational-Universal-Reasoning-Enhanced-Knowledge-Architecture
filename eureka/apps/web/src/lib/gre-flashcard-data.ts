/**
 * Physics GRE flashcard deck.
 *
 * Formulas, constants and the facts this test asks for by recall rather than
 * derivation. Written for this course; maths is plain text (x^2, sqrt(2),
 * hbar) so it renders in a card without a maths engine.
 *
 * This replaced the GRE General Test deck (quant rules, vocabulary, essay
 * strategy). None of that content applies to a physics subject test, so it
 * was deleted rather than relabelled.
 */

export interface GREFlashcard {
  id: number;
  front: string;
  back: string;
  domain: string;      // one of the domain ids below
  domainName: string;  // the matching domain name
  category: string;    // 'definition' | 'concept' | 'formula' | 'strategy' | 'constant' | 'mnemonic'
  topics: string[];
}

export const GRE_FLASHCARD_DOMAINS = [
  { id: 'mechanics',  label: 'Mechanics',  name: 'Classical Mechanics',                   count: 14 },
  { id: 'em',         label: 'E&M',        name: 'Electromagnetism',                      count: 14 },
  { id: 'quantum',    label: 'Quantum',    name: 'Quantum Mechanics',                     count: 12 },
  { id: 'thermo',     label: 'Thermo',     name: 'Thermodynamics & Statistical Mechanics', count: 11 },
  { id: 'atomic',     label: 'Atomic',     name: 'Atomic Physics',                        count: 8 },
  { id: 'optics',     label: 'Optics',     name: 'Optics & Wave Phenomena',               count: 9 },
  { id: 'relativity', label: 'Relativity', name: 'Special Relativity',                    count: 7 },
  { id: 'special',    label: 'Specialized', name: 'Specialized Topics',                   count: 9 },
  { id: 'lab',        label: 'Lab',        name: 'Laboratory Methods',                    count: 8 },
  { id: 'constants',  label: 'Constants',  name: 'Constants & Numbers',                   count: 8 },
];

export const GRE_FLASHCARD_CATEGORIES = ['definition','concept','formula','strategy','constant','mnemonic'] as const;

const C = (
  id: number, domain: string, domainName: string, category: string,
  front: string, back: string,
): GREFlashcard => ({ id, front, back, domain, domainName, category, topics: ['PHYSICS_GRE'] });

const M = (id: number, cat: string, f: string, b: string) => C(id, 'mechanics', 'Classical Mechanics', cat, f, b);
const E = (id: number, cat: string, f: string, b: string) => C(id, 'em', 'Electromagnetism', cat, f, b);
const Q = (id: number, cat: string, f: string, b: string) => C(id, 'quantum', 'Quantum Mechanics', cat, f, b);
const T = (id: number, cat: string, f: string, b: string) => C(id, 'thermo', 'Thermodynamics & Statistical Mechanics', cat, f, b);
const A = (id: number, cat: string, f: string, b: string) => C(id, 'atomic', 'Atomic Physics', cat, f, b);
const O = (id: number, cat: string, f: string, b: string) => C(id, 'optics', 'Optics & Wave Phenomena', cat, f, b);
const R = (id: number, cat: string, f: string, b: string) => C(id, 'relativity', 'Special Relativity', cat, f, b);
const S = (id: number, cat: string, f: string, b: string) => C(id, 'special', 'Specialized Topics', cat, f, b);
const L = (id: number, cat: string, f: string, b: string) => C(id, 'lab', 'Laboratory Methods', cat, f, b);
const K = (id: number, cat: string, f: string, b: string) => C(id, 'constants', 'Constants & Numbers', cat, f, b);

export const GRE_FLASHCARDS: GREFlashcard[] = [
  // ── Classical Mechanics ─────────────────────────────────────
  M(1, 'formula', 'Range of a projectile launched and landing at the same height', 'R = v0^2 sin(2 theta)/g. Maximal at 45 degrees; complementary angles give equal range.'),
  M(2, 'formula', 'Moment of inertia about the symmetry axis: hoop, disc, solid sphere, spherical shell', 'Hoop MR^2, disc (1/2)MR^2, solid sphere (2/5)MR^2, shell (2/3)MR^2. Mass further out means a bigger coefficient.'),
  M(3, 'formula', 'Moment of inertia of a rod about its centre and about its end', 'Centre (1/12)ML^2, end (1/3)ML^2. The second follows from the first by the parallel-axis theorem with d = L/2.'),
  M(4, 'formula', 'Parallel-axis theorem', 'I = I_cm + M d^2. It runs only FROM the centre-of-mass axis; going between two arbitrary parallel axes means stepping through the centre of mass.'),
  M(5, 'formula', 'Speed of a body rolling without slipping from height h', 'v = sqrt(2gh/(1 + I_cm/MR^2)). Depends on shape only: sphere beats disc beats hoop, whatever the mass or radius.'),
  M(6, 'formula', 'Small oscillations about a potential minimum', 'omega = sqrt(U\'\'(x0)/m). Differentiate twice, evaluate at equilibrium, divide by m, take the root.'),
  M(7, 'concept', 'When is mechanical energy conserved?', 'Only when the non-conservative work is zero. With friction present use KE_i + U_i + W_nc = KE_f + U_f.'),
  M(8, 'formula', 'Reduced mass and the energy lost in a perfectly inelastic collision', 'mu = m1 m2/(m1+m2); energy lost = (1/2) mu (u1-u2)^2, depending only on the relative velocity.'),
  M(9, 'concept', 'Elastic collision, equal masses, target at rest', 'The velocities exchange: the incoming body stops dead and the target leaves at the incoming speed.'),
  M(10, 'formula', 'Orbital energy and the vis-viva equation', 'E = -GMm/(2a) for any bound orbit; v^2 = GM(2/r - 1/a) gives the speed anywhere on it.'),
  M(11, 'concept', 'Effective potential for a central force', 'U_eff = U(r) + L^2/(2 m r^2). The added centrifugal barrier keeps a particle with L != 0 away from the origin, and E on the curve classifies the orbit.'),
  M(12, 'concept', 'Cyclic coordinate in a Lagrangian', 'A coordinate absent from L (only its derivative appears) has a conserved conjugate momentum p = dL/d(q_dot). This is Noether\'s theorem in practice.'),
  M(13, 'formula', 'Gyroscopic precession rate', 'Omega_p = M g r/(I omega). Faster spin means slower precession.'),
  M(14, 'concept', 'Coriolis force', '-2m(omega x v\'): depends on velocity, is perpendicular to it, and therefore does no work. Deflects to the right in the northern hemisphere.'),

  // ── Electromagnetism ────────────────────────────────────────
  E(15, 'formula', 'Field of an infinite line, an infinite plane, and a dipole', 'Line lambda/(2 pi epsilon_0 r); plane sigma/(2 epsilon_0), uniform; dipole ~1/r^3. One power of r is traded per dimension the source extends along.'),
  E(16, 'concept', 'Field inside and outside a uniformly charged solid sphere', 'Inside E = kQr/R^3 (linear in r); outside E = kQ/r^2 as a point charge. Maximum at r = R.'),
  E(17, 'concept', 'Conductor in electrostatic equilibrium', 'Zero field inside, all excess charge on the surface, field just outside is sigma/epsilon_0 and perpendicular, cavity with no charge has zero field.'),
  E(18, 'formula', 'Capacitance combination rules', 'Parallel adds (C1 + C2); series adds reciprocals. Exactly the reverse of resistors.'),
  E(19, 'concept', 'Dielectric inserted: battery connected versus disconnected', 'Connected fixes V, so C, Q and U all rise. Disconnected fixes Q, so C rises while V, E and U all fall. Read which case the question describes.'),
  E(20, 'formula', 'Energy density of electric and magnetic fields', 'u_E = (1/2) epsilon_0 E^2 and u_B = B^2/(2 mu_0). Equal in an electromagnetic wave.'),
  E(21, 'concept', 'Boundary conditions at an interface', 'Tangential E continuous, normal D jumps by the free surface charge. Magnetically: tangential H and normal B.'),
  E(22, 'formula', 'Image charge above a grounded plane', 'Image -q at equal depth. Force kq^2/4d^2 attractive; energy -kq^2/4d, HALF the naive two-charge value.'),
  E(23, 'concept', 'Force between parallel currents', 'Parallel currents ATTRACT, antiparallel repel — the opposite sense to like charges.'),
  E(24, 'formula', 'Cyclotron radius and frequency', 'r = mv/(qB), omega_c = qB/m. The frequency is independent of speed until relativistic corrections matter.'),
  E(25, 'concept', 'Magnetic dipole in a field', 'Uniform field: torque m x B, energy -m.B, no net force. Non-uniform field: net force grad(m.B) — the Stern-Gerlach deflection.'),
  E(26, 'concept', 'Inductor and capacitor at t = 0 and t = infinity', 'Inductor: open circuit at t=0, plain wire at steady state. Capacitor: short at t=0, open at steady state. Sketching both limits eliminates most wrong answers.'),
  E(27, 'formula', 'Series RLC resonance', 'omega_0 = 1/sqrt(LC). Impedance is purely R and minimal; reactive voltages reach Q times the source and cancel.'),
  E(28, 'formula', 'Radiation pressure', 'I/c on a perfect absorber, 2I/c on a perfect reflector. Reflection reverses momentum rather than absorbing it.'),

  // ── Quantum Mechanics ───────────────────────────────────────
  Q(29, 'formula', 'Infinite square well energies and nodes', 'E_n = n^2 pi^2 hbar^2/(2mL^2); psi_n has n-1 interior nodes. For an electron, E_n ≈ 0.376 n^2/L^2 eV with L in nm.'),
  Q(30, 'formula', 'Harmonic oscillator spectrum', 'E_n = (n + 1/2) hbar omega. Equally spaced, with a nonzero zero-point energy; psi_n has n nodes.'),
  Q(31, 'formula', 'Tunnelling through a thick barrier', 'T ≈ exp(-2 kappa a) with kappa = sqrt(2m(V0-E))/hbar. Exponential in width and in sqrt(mass).'),
  Q(32, 'formula', 'Angular momentum eigenvalues', 'L^2 gives l(l+1) hbar^2 (NOT l^2 hbar^2) and L_z gives m hbar with 2l+1 values. |L| always exceeds max L_z.'),
  Q(33, 'concept', 'Pauli matrices', 'Each squares to the identity, they anticommute, they are traceless, eigenvalues ±1, and S_i = (hbar/2) sigma_i.'),
  Q(34, 'concept', 'Adding two angular momenta', 'j runs from |j1-j2| to j1+j2 in integer steps. Check by counting: multiplicities must sum to (2j1+1)(2j2+1).'),
  Q(35, 'formula', 'Hydrogen energies and degeneracy', 'E_n = -13.6 Z^2/n^2 eV, depending on n alone. Degeneracy n^2, or 2n^2 including spin — the periodic-table shell sizes.'),
  Q(36, 'formula', 'Radial nodes in a hydrogen orbital', 'n - l - 1 radial nodes, n - 1 total. Only l = 0 states are nonzero at the nucleus.'),
  Q(37, 'formula', 'First-order perturbation shift', "E^(1) = <psi^(0)|H'|psi^(0)>: the expectation of the perturbation in the UNPERTURBED state."),
  Q(38, 'concept', 'Variational principle', 'Any normalised trial function gives <H> >= E_ground. The bound is one-sided: an estimate can only be too high.'),
  Q(39, 'concept', 'Compatible observables', 'Two observables are simultaneously measurable exactly when their operators commute. [L^2, L_z] = 0 but the components do not commute among themselves.'),
  Q(40, 'concept', 'Conserved observable in quantum mechanics', 'Anything that commutes with H and has no explicit time dependence. Momentum is conserved iff H is translation-invariant.'),

  // ── Thermodynamics & Statistical Mechanics ──────────────────
  T(41, 'formula', 'Adiabatic relations and gamma', 'pV^gamma and TV^(gamma-1) constant. gamma = (f+2)/f: 5/3 monatomic, 7/5 diatomic at room temperature.'),
  T(42, 'formula', 'Carnot efficiency', 'eta = 1 - T_C/T_H, absolute temperatures. No engine between the same reservoirs beats it.'),
  T(43, 'concept', 'Entropy of a free expansion', 'Q = 0 and W = 0, so T is unchanged for an ideal gas — but Delta S = nR ln(V2/V1) > 0. Compute along any reversible path.'),
  T(44, 'formula', 'Boltzmann population ratio', 'N_2/N_1 = (g_2/g_1) exp(-Delta E/k_B T). Always below 1 at positive temperature, which is why lasers need pumping.'),
  T(45, 'formula', 'Everything from the partition function', 'F = -k_B T ln Z, <E> = -d(ln Z)/d beta, S = -(dF/dT)_V.'),
  T(46, 'concept', 'Which thermodynamic potential', 'Pick the one whose natural variables are held fixed: U(S,V), H(S,p), F(T,V), G(T,p).'),
  T(47, 'formula', 'Characteristic molecular speeds', 'v_p = sqrt(2kT/m) < <v> = sqrt(8kT/pi m) < v_rms = sqrt(3kT/m). All scale as sqrt(T/m).'),
  T(48, 'concept', 'Fermi-Dirac versus Bose-Einstein', 'Denominator +1 for fermions (occupation never above 1), -1 for bosons (unbounded). Both reduce to Maxwell-Boltzmann when occupation is small.'),
  T(49, 'concept', 'Low-temperature heat capacity signatures', 'C ∝ T means a degenerate electron gas; C ∝ T^3 means phonons or photons; exponential suppression means an energy gap.'),
  T(50, 'formula', 'Stefan-Boltzmann and Wien', 'Power per area = sigma T^4; lambda_max T = 2.898e-3 m K. Double T and the power rises 16-fold while the peak wavelength halves.'),
  T(51, 'formula', 'Clausius-Clapeyron', 'dp/dT = L/(T Delta V). Water\'s solid-liquid slope is negative because ice is less dense than water.'),

  // ── Atomic Physics ──────────────────────────────────────────
  A(52, 'concept', 'What the Bohr model gets right and wrong', 'Right: hydrogen energies and the r ∝ n^2/Z scaling. Wrong: the mechanism, and its ground-state L = hbar (the true 1s state has L = 0).'),
  A(53, 'formula', 'Hydrogen-like scaling', 'Energies scale as Z^2, radii as 1/Z. Reduced mass matters: positronium binds at 6.8 eV, half of hydrogen.'),
  A(54, 'concept', 'Electric-dipole selection rules', 'Delta l = ±1 and Delta m = 0, ±1. A Delta l = 0 transition is forbidden and gives a long-lived metastable state.'),
  A(55, 'concept', "Hund's rules", 'Maximise S, then L, then J = |L-S| below half filling and L+S above. Carbon 2p^2 is ^3P_0; oxygen 2p^4 is ^3P_2.'),
  A(56, 'concept', 'Relative sizes of atomic corrections', 'Gross 13.6 eV; fine structure ~alpha^2 of it (7e-4 eV); hyperfine smaller again by roughly m_e/m_p. Fine structure scales as Z^4.'),
  A(57, 'formula', 'Zeeman splitting and the Lande factor', 'Delta E = g_J mu_B B m_J with g_J = 1 + (J(J+1)+S(S+1)-L(L+1))/(2J(J+1)). S = 0 gives g_J = 1 and the normal three-line pattern.'),
  A(58, 'concept', 'X-ray tube spectrum', 'Bremsstrahlung cutoff lambda_min = hc/eV depends on VOLTAGE only. Characteristic lines depend on the TARGET only.'),
  A(59, 'concept', 'Why a two-level laser is impossible', 'B_12 = B_21, so the pump stimulates emission as strongly as absorption. The best steady state is equal populations and zero gain.'),

  // ── Optics & Wave Phenomena ─────────────────────────────────
  O(60, 'concept', 'What changes on refraction', 'Frequency is unchanged; speed becomes c/n and wavelength becomes lambda_0/n.'),
  O(61, 'formula', 'Critical angle and Brewster angle', 'theta_c = arcsin(n_2/n_1) for total internal reflection; theta_B = arctan(n_2/n_1) for fully polarised reflection.'),
  O(62, 'concept', 'Thin-lens sign conventions', 'Positive d_i is a real image; negative is virtual and on the object side. A single lens forming a real image always inverts it.'),
  O(63, 'formula', 'Double-slit fringe spacing', 'Delta y = lambda L/d. Wider slit separation gives NARROWER fringes; peaks reach 4 I_0 because amplitudes add before squaring.'),
  O(64, 'concept', 'Thin-film pi shift rule', 'Reflection off a higher-index medium adds a pi phase shift; off a lower-index one it does not. Count the shifts before writing the interference condition.'),
  O(65, 'formula', 'Single slit versus grating', 'Single-slit MINIMA at a sin(theta) = m lambda; grating MAXIMA at d sin(theta) = m lambda. Same form, opposite meaning.'),
  O(66, 'formula', 'Rayleigh criterion', 'theta_min = 1.22 lambda/D for a circular aperture. Limits telescopes, microscopes and eyes alike.'),
  O(67, 'concept', 'Polarisers', 'Unpolarised light always loses exactly half through the first polariser; Malus I = I_0 cos^2(theta) applies from the second onward. Three polarisers can pass I_0/8 where two pass nothing.'),
  O(68, 'concept', 'Sound speed and Doppler', 'Sound speed depends on temperature, not pressure. Sound Doppler is asymmetric between source and observer; light Doppler depends only on relative velocity.'),

  // ── Special Relativity ──────────────────────────────────────
  R(69, 'formula', 'gamma at useful speeds', 'gamma = 1.15 at 0.5c, 2 at 0.866c, 7.1 at 0.99c. gamma = 3 means beta = 0.943.'),
  R(70, 'concept', 'Proper time and proper length', 'Proper time is measured by a clock present at both events; proper length in the object\'s rest frame. Delta t = gamma Delta tau and L = L_0/gamma.'),
  R(71, 'formula', 'Relativistic velocity addition', "u' = (u - v)/(1 - uv/c^2). Never exceeds c, and returns exactly c whenever either input is c."),
  R(72, 'formula', 'Energy-momentum relation', 'E^2 = (pc)^2 + (mc^2)^2, and v/c = pc/E. Massless particles have E = pc exactly.'),
  R(73, 'strategy', 'Invariant-mass trick', 'Evaluate (sum E)^2 - (sum pc)^2 in whichever frame is easiest — usually the centre of momentum — and equate to its value in the lab frame.'),
  R(74, 'formula', 'Compton shift', 'Delta lambda = (h/m_e c)(1 - cos theta), with h/m_e c = 2.43 pm. Depends only on the angle, not on the incident wavelength.'),
  R(75, 'concept', 'Transverse Doppler effect', 'f_obs = f_src/gamma for motion purely across the line of sight: a pure time-dilation redshift with no classical analogue.'),

  // ── Specialized Topics ──────────────────────────────────────
  S(76, 'concept', 'Binding-energy curve', 'Peaks near iron-56 at about 8.8 MeV per nucleon. Fusion below and fission above both move toward the peak and release energy.'),
  S(77, 'formula', 'Decay relations', 't_(1/2) = ln2/lambda = 0.693/lambda; mean lifetime tau = 1/lambda, LONGER than the half-life.'),
  S(78, 'concept', 'Beta decay and the neutrino', 'Beta-minus emits an ANTI-neutrino; beta-plus and electron capture emit a neutrino. The continuous energy spectrum is what required a third body.'),
  S(79, 'concept', 'Decay lifetime identifies the interaction', 'About 1e-23 s strong, 1e-16 s electromagnetic, 1e-10 s or longer weak. A strangeness change forces the weak interaction.'),
  S(80, 'formula', "Bragg's law", '2 d sin(theta) = n lambda, with theta measured from the PLANES (not the normal). Detector sits at 2 theta.'),
  S(81, 'concept', 'Temperature coefficient of conductivity', 'Metals conduct WORSE when heated (phonon scattering); semiconductors conduct BETTER (exponentially more carriers).'),
  S(82, 'concept', 'What defines a superconductor', 'The Meissner effect — complete flux expulsion — not merely zero resistance. Gap is about 3.5 k_B T_c.'),
  S(83, 'formula', 'Magnitude scale', 'm_1 - m_2 = -2.5 log10(F_1/F_2). Inverted and logarithmic: 5 magnitudes is exactly a factor of 100, and larger means fainter.'),
  S(84, 'concept', 'Stellar endpoints', 'Below the 1.4 solar-mass Chandrasekhar limit a white dwarf (electron degeneracy); above it a neutron star; above that a black hole with r_s = 2GM/c^2.'),

  // ── Laboratory Methods ──────────────────────────────────────
  L(85, 'formula', 'Error propagation rules', 'Sums: absolute errors in quadrature. Products: RELATIVE errors in quadrature. Powers: relative error times |n|.'),
  L(86, 'concept', 'Statistical versus systematic error', 'Statistical falls as 1/sqrt(N) with repetition; systematic does not fall at all. Averaging a miscalibrated instrument gives a precise wrong answer.'),
  L(87, 'formula', 'Counting statistics', 'Poisson: uncertainty on N counts is sqrt(N), so relative uncertainty is 1/sqrt(N). 1% needs 10,000 counts.'),
  L(88, 'concept', 'Meter loading', 'Voltmeters need HIGH input impedance (parallel), ammeters LOW (series). Equal source and meter impedance halves the reading.'),
  L(89, 'formula', 'RC corner frequency and scope bandwidth', 'f_c = 1/(2 pi RC), -3 dB point with 45 degrees of phase. Scope rise time ≈ 0.35/bandwidth.'),
  L(90, 'formula', 'Johnson noise', 'V_rms = sqrt(4 k_B T R B). Reduce by cooling, lowering resistance, or narrowing bandwidth — the last is usually cheapest.'),
  L(91, 'concept', 'Which detector for what', 'Germanium for energy resolution, NaI for efficiency and cost, Geiger for counting only (no energy information), photomultiplier for single photons and timing.'),
  L(92, 'concept', 'Shielding by radiation type', 'Alpha: paper. Beta: LOW-Z (high-Z makes bremsstrahlung). Gamma: high-Z and dense. Neutrons: hydrogenous moderator then an absorber — lead is nearly useless.'),

  // ── Constants & Numbers ─────────────────────────────────────
  K(93, 'constant', 'Reduced Planck constant and hc', 'hbar = 1.055e-34 J s = 6.58e-16 eV s. hc = 1240 eV nm — the single most useful conversion on this test.'),
  K(94, 'constant', 'Electron, proton and neutron rest energies', 'Electron 0.511 MeV, proton 938.3 MeV, neutron 939.6 MeV.'),
  K(95, 'constant', 'Fine-structure constant', 'alpha = e^2/(4 pi epsilon_0 hbar c) ≈ 1/137. Sets v/c for the hydrogen ground state, so fine structure is order alpha^2.'),
  K(96, 'constant', 'Bohr radius and hydrogen ground state', 'a_0 = 0.529 Å; E_1 = -13.6 eV; ionisation energy 13.6 eV.'),
  K(97, 'constant', 'Thermal energy at room temperature', 'k_B T ≈ 0.0259 eV ≈ 1/40 eV at 300 K. Compare it to a level spacing to decide whether a degree of freedom is active.'),
  K(98, 'constant', 'Boltzmann and gas constants', 'k_B = 1.38e-23 J/K; R = 8.314 J/mol K; 1 mol = 6.022e23.'),
  K(99, 'constant', 'Atomic mass unit in energy', '1 u = 931.5 MeV/c^2. The conversion behind every mass-defect calculation.'),
  K(100, 'constant', 'Compton wavelength and electron radius', 'h/m_e c = 2.43 pm (Compton); classical electron radius 2.82 fm.'),
];

export function getGREFlashcards(domain?: string): GREFlashcard[] {
  if (!domain) return GRE_FLASHCARDS;
  return GRE_FLASHCARDS.filter(c => c.domain === domain);
}

export const GRE_FLASHCARD_COUNT = GRE_FLASHCARDS.length;

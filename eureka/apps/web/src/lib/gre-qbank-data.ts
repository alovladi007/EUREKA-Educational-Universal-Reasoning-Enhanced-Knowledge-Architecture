/**
 * Physics GRE (GRE Physics Subject Test) — question bank.
 *
 * Original questions written for this course. No ETS item, released test
 * question, or published explanation is reproduced. Every answer was worked
 * through independently and the explanation shows that working, so a wrong
 * key would be visible rather than hidden behind an assertion.
 *
 * This replaced the GRE General Test bank (Verbal + Quantitative Reasoning).
 * None of it carried over: a verbal-reasoning item cannot be relabelled as
 * physics, and pretending otherwise would misrepresent what a learner is
 * practising.
 *
 * `section` matches the section ids in exam-config.ts, so the section picker
 * filters correctly without a translation table.
 */

export interface PhysicsGREQuestion {
  id: string;
  /** Section id from EXAM_CONFIGS.GRE.sections */
  section: string;
  domain: string;
  skill: string;
  /**
   * Author-assigned difficulty, 1-3. This is a judgement about the number of
   * steps and the obscurity of the idea, NOT a measured p-value: no response
   * data exists for these items yet, and nothing here should be read as a
   * calibrated statistic.
   */
  difficulty: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const GRE_QUESTIONS: PhysicsGREQuestion[] = [
  // ── Classical Mechanics ─────────────────────────────────────
  {
    id: 'pgre_cm_001', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Kinematics', difficulty: 1,
    question: 'A ball is thrown vertically upward with speed v0. Ignoring air resistance, what is its acceleration at the highest point of its flight?',
    options: ['Zero', 'g downward', 'g upward', 'v0^2/(2h) downward', 'Undefined at that instant'],
    correct: 1,
    explanation: 'At the apex the velocity is momentarily zero but gravity has not switched off, so the acceleration is still g downward. Zero velocity and zero acceleration are independent conditions; the ball is at the top precisely because the downward acceleration has been reducing the upward velocity throughout.',
  },
  {
    id: 'pgre_cm_002', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Projectile motion', difficulty: 1,
    question: 'Two projectiles are launched from level ground with the same speed, one at 25 degrees and one at 65 degrees above the horizontal. Which statement is correct?',
    options: ['The 25-degree projectile travels farther', 'The 65-degree projectile travels farther', 'They travel the same horizontal distance', 'The comparison depends on the launch speed', 'The 65-degree projectile has the shorter flight time'],
    correct: 2,
    explanation: 'Range is R = v0^2 sin(2 theta)/g. Since 2(25) = 50 and 2(65) = 130 degrees, and sin(50) = sin(130), the ranges are equal — complementary angles always give equal range. The 65-degree launch does go higher and stay airborne longer, which rules out the last option.',
  },
  {
    id: 'pgre_cm_003', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Rolling motion', difficulty: 2,
    question: 'A solid sphere, a solid cylinder and a thin hoop of equal mass and radius are released from rest at the top of the same incline and roll without slipping. In what order do they reach the bottom?',
    options: ['Hoop, cylinder, sphere', 'Sphere, cylinder, hoop', 'All arrive together', 'Cylinder, sphere, hoop', 'The order depends on the mass'],
    correct: 1,
    explanation: 'For rolling from rest, v = sqrt(2gh/(1 + I/MR^2)). The bracket is 1 + 2/5 = 1.4 for the sphere, 1 + 1/2 = 1.5 for the cylinder and 1 + 1 = 2 for the hoop. Smaller bracket means larger speed, so the sphere arrives first and the hoop last. Mass and radius cancel entirely, which is why the last option fails.',
  },
  {
    id: 'pgre_cm_004', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Angular momentum', difficulty: 2,
    question: 'A skater spinning with arms extended pulls them in, halving her moment of inertia. Neglecting friction, what happens to her rotational kinetic energy?',
    options: ['It is halved', 'It is unchanged', 'It doubles', 'It quadruples', 'It falls to one quarter'],
    correct: 2,
    explanation: 'No external torque acts, so L = I omega is conserved and halving I doubles omega. Kinetic energy is L^2/(2I), and with L fixed and I halved it doubles. The extra energy comes from the work the skater does pulling her arms inward against the centripetal requirement — energy is not conserved here even though angular momentum is.',
  },
  {
    id: 'pgre_cm_005', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Collisions', difficulty: 2,
    question: 'A 3 kg block moving at 4 m/s collides head-on with a stationary 1 kg block and they stick together. How much kinetic energy is lost?',
    options: ['0 J', '6 J', '12 J', '18 J', '24 J'],
    correct: 1,
    explanation: 'Momentum gives v = 3(4)/4 = 3 m/s. Initial KE = (1/2)(3)(16) = 24 J; final KE = (1/2)(4)(9) = 18 J; the loss is 6 J. Cross-check with the reduced mass: mu = 3(1)/4 = 0.75, and (1/2)(0.75)(4)^2 = 6 J.',
  },
  {
    id: 'pgre_cm_006', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Oscillations', difficulty: 2,
    question: 'A particle of mass m moves in the potential U(x) = A x^4 - B x^2, with A and B positive. What is the angular frequency of small oscillations about a stable equilibrium?',
    options: ['sqrt(2B/m)', 'sqrt(4B/m)', 'sqrt(B/2m)', 'sqrt(8B/m)', 'sqrt(B/m)'],
    correct: 1,
    explanation: "U' = 4Ax^3 - 2Bx = 0 gives x = 0 and x = ±sqrt(B/2A). U'' = 12Ax^2 - 2B, which is -2B at the origin (unstable) and 12A(B/2A) - 2B = 4B at the outer roots (stable). Small oscillations have omega = sqrt(U''/m) = sqrt(4B/m). Note that A drops out.",
  },
  {
    id: 'pgre_cm_007', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Orbits', difficulty: 2,
    question: 'A satellite in a circular orbit receives a brief forward thrust along its velocity. Immediately afterwards, its orbital period',
    options: ['decreases, because it is moving faster', 'is unchanged, because the radius has not yet changed', 'increases, because its total energy has increased', 'decreases, because its angular momentum has increased', 'cannot be determined without the thrust magnitude'],
    correct: 2,
    explanation: 'For a bound orbit E = -GMm/(2a), so raising the energy raises the semi-major axis a. Kepler\'s third law then gives a longer period. Speeding a satellite up puts it in a larger, slower orbit — the standard counterintuitive result, and the reason orbital rendezvous requires thrusting backwards to catch up.',
  },
  {
    id: 'pgre_cm_008', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Lagrangian mechanics', difficulty: 3,
    question: 'A Lagrangian in plane polar coordinates is L = (1/2)m(r_dot^2 + r^2 theta_dot^2) - U(r). Which quantity is conserved?',
    options: ['r', 'm r_dot', 'm r^2 theta_dot', 'm r theta_dot', 'U(r) alone'],
    correct: 2,
    explanation: 'theta does not appear in L (only theta_dot does), so it is a cyclic coordinate and its conjugate momentum p_theta = dL/d(theta_dot) = m r^2 theta_dot is conserved. That is the angular momentum. Option (D) is m r theta_dot, which is the linear tangential momentum and is not conserved.',
  },
  {
    id: 'pgre_cm_009', section: 'classical_mechanics', domain: 'Classical Mechanics', skill: 'Non-inertial frames', difficulty: 2,
    question: 'Which statement about the Coriolis force is correct?',
    options: ['It does work on a moving body in the rotating frame', 'It acts on bodies at rest in the rotating frame', 'It is always perpendicular to the velocity in the rotating frame', 'It points away from the rotation axis', 'It vanishes at the poles'],
    correct: 2,
    explanation: 'The Coriolis term is -2m(omega x v\'), a cross product with the velocity, so it is always perpendicular to that velocity and therefore does no work. It vanishes for a body at rest in the rotating frame, which is what distinguishes it from the centrifugal term. It is maximal, not zero, at the poles for horizontal motion.',
  },

  // ── Electromagnetism ────────────────────────────────────────
  {
    id: 'pgre_em_001', section: 'electromagnetism', domain: 'Electromagnetism', skill: 'Gauss law', difficulty: 1,
    question: 'A point charge q sits at the centre of a cube. What is the electric flux through one face?',
    options: ['q/epsilon_0', 'q/(2 epsilon_0)', 'q/(6 epsilon_0)', 'q/(8 epsilon_0)', 'Zero'],
    correct: 2,
    explanation: 'The total flux through the closed cube is q/epsilon_0 by Gauss\'s law, and by symmetry the six faces share it equally, giving q/(6 epsilon_0) each. No integration is needed; the symmetry does all the work.',
  },
  {
    id: 'pgre_em_002', section: 'electromagnetism', domain: 'Electromagnetism', skill: 'Field of a charged sphere', difficulty: 2,
    question: 'A uniformly charged insulating sphere of radius R carries total charge Q. At what distance from the centre is the field strongest?',
    options: ['At the centre', 'At r = R/2', 'At r = R', 'At r = 2R', 'The field is uniform inside and zero outside'],
    correct: 2,
    explanation: 'Inside, only the enclosed fraction (r/R)^3 contributes, giving E = kQr/R^3, which rises linearly from zero. Outside, E = kQ/r^2 falls. The two meet at r = R, where E = kQ/R^2 is maximal. Note this is an insulator with charge throughout; a conductor would have zero field inside and the same exterior field.',
  },
  {
    id: 'pgre_em_003', section: 'electromagnetism', domain: 'Electromagnetism', skill: 'Capacitors and dielectrics', difficulty: 2,
    question: 'A parallel-plate capacitor is charged and then DISCONNECTED from the battery. A dielectric slab of constant kappa > 1 is inserted, filling the gap. Which quantity increases?',
    options: ['The stored energy', 'The voltage across the plates', 'The electric field between the plates', 'The capacitance', 'The charge on the plates'],
    correct: 3,
    explanation: 'Disconnected means Q is fixed. C rises by kappa, so V = Q/C falls, E = V/d falls, and U = Q^2/2C falls. Only C increases. Had the battery stayed connected, V would be fixed and Q and U would both rise instead — reading which case the question describes is the whole problem.',
  },
  {
    id: 'pgre_em_004', section: 'electromagnetism', domain: 'Electromagnetism', skill: 'Magnetic force', difficulty: 1,
    question: 'A charged particle enters a region of uniform magnetic field with its velocity perpendicular to the field. Which quantity changes?',
    options: ['Its speed', 'Its kinetic energy', 'The magnitude of its momentum', 'The direction of its velocity', 'Its cyclotron frequency'],
    correct: 3,
    explanation: 'The magnetic force qv x B is perpendicular to v, so it does no work: speed, kinetic energy and momentum magnitude are all unchanged. Only the direction changes, giving circular motion. The cyclotron frequency qB/m depends on field, charge and mass, none of which change.',
  },
  {
    id: 'pgre_em_005', section: 'electromagnetism', domain: 'Electromagnetism', skill: 'Induction', difficulty: 2,
    question: 'A conducting loop lies in a plane perpendicular to a magnetic field directed into the page. The field magnitude is increasing. The induced current in the loop is',
    options: ['clockwise, and the loop tends to contract', 'counterclockwise, and the loop tends to expand', 'clockwise, and the loop tends to expand', 'counterclockwise, and the loop tends to contract', 'zero, because the loop is not moving'],
    correct: 1,
    explanation: 'Flux into the page is increasing, so by Lenz\'s law the induced current opposes it by creating flux out of the page inside the loop, which requires a counterclockwise current. The force on that current in the external field pushes the loop outward, so it tends to expand — again opposing the increase in flux by increasing the area it would have to enclose against the field.',
  },
  {
    id: 'pgre_em_006', section: 'electromagnetism', domain: 'Electromagnetism', skill: 'AC circuits', difficulty: 2,
    question: 'In a series RLC circuit driven at its resonant frequency, which statement is true?',
    options: ['The impedance is maximal', 'The current lags the voltage by 90 degrees', 'The voltage across the inductor is zero', 'The impedance is purely resistive', 'The power factor is zero'],
    correct: 3,
    explanation: 'At resonance X_L = X_C, so the reactances cancel in the total impedance, leaving Z = R: purely resistive, minimal, with the current in phase with the source and a power factor of 1. The individual reactive voltages are NOT zero — each equals Q times the source voltage — they simply cancel each other.',
  },
  {
    id: 'pgre_em_007', section: 'electromagnetism', domain: 'Electromagnetism', skill: 'Electromagnetic waves', difficulty: 2,
    question: 'A plane electromagnetic wave in vacuum has peak electric field E_0. What is the radiation pressure it exerts on a perfectly reflecting surface at normal incidence?',
    options: ['epsilon_0 E_0^2 / 2', 'epsilon_0 E_0^2', 'epsilon_0 E_0^2 / 4', 'E_0^2/(2 mu_0 c)', '2 epsilon_0 c E_0^2'],
    correct: 0,
    explanation: 'Intensity is I = (1/2) epsilon_0 c E_0^2. Radiation pressure on an absorber is I/c and on a perfect reflector is 2I/c, because reflection reverses the photon momentum rather than merely stopping it. So P = 2(1/2 epsilon_0 c E_0^2)/c = epsilon_0 E_0^2/2.',
  },
  {
    id: 'pgre_em_008', section: 'electromagnetism', domain: 'Electromagnetism', skill: 'Radiation', difficulty: 2,
    question: 'An oscillating electric dipole radiates. In which direction is the radiated intensity greatest?',
    options: ['Along the dipole axis', 'At 45 degrees to the dipole axis', 'Perpendicular to the dipole axis', 'Uniformly in all directions', 'It depends on the oscillation frequency'],
    correct: 2,
    explanation: 'The angular distribution goes as sin^2(theta) measured from the acceleration (dipole) axis, so it is zero along the axis and maximal perpendicular to it. Frequency affects the total power (as omega^4) but not the shape of the pattern, which rules out the last option.',
  },

  // ── Quantum Mechanics ───────────────────────────────────────
  {
    id: 'pgre_qm_001', section: 'quantum_mechanics', domain: 'Quantum Mechanics', skill: 'Infinite square well', difficulty: 1,
    question: 'The ground-state energy of a particle in an infinite square well of width L is E_1. If the width is halved, the new ground-state energy is',
    options: ['E_1/4', 'E_1/2', '2 E_1', '4 E_1', 'unchanged'],
    correct: 3,
    explanation: 'E_n goes as n^2/L^2, so halving L quadruples every level. This is confinement energy: squeezing the particle into a smaller region forces a larger momentum spread by the uncertainty relation, and hence a larger kinetic energy.',
  },
  {
    id: 'pgre_qm_002', section: 'quantum_mechanics', domain: 'Quantum Mechanics', skill: 'Harmonic oscillator', difficulty: 1,
    question: 'Which statement distinguishes the energy spectrum of a quantum harmonic oscillator from that of an infinite square well?',
    options: ['The oscillator has a zero ground-state energy', 'The oscillator levels are equally spaced', 'The oscillator has finitely many levels', 'The oscillator levels go as n^2', 'The oscillator has no zero-point energy'],
    correct: 1,
    explanation: 'Oscillator levels are E_n = (n + 1/2) hbar omega, equally spaced, while square-well levels go as n^2 and spread out. Both have nonzero ground-state energy — the oscillator\'s is hbar omega/2 — so the first and last options are false, and both have infinitely many bound levels.',
  },
  {
    id: 'pgre_qm_003', section: 'quantum_mechanics', domain: 'Quantum Mechanics', skill: 'Angular momentum', difficulty: 2,
    question: 'For an electron in a state with orbital quantum number l = 2, what is the magnitude of the orbital angular momentum?',
    options: ['2 hbar', 'sqrt(2) hbar', 'sqrt(6) hbar', '4 hbar', 'sqrt(5) hbar'],
    correct: 2,
    explanation: '|L| = sqrt(l(l+1)) hbar = sqrt(2 x 3) hbar = sqrt(6) hbar = 2.45 hbar. The common error is 2 hbar, which is the maximum value of L_z rather than the magnitude. That |L| always exceeds max L_z is precisely why the angular momentum vector can never align fully with the z axis.',
  },
  {
    id: 'pgre_qm_004', section: 'quantum_mechanics', domain: 'Quantum Mechanics', skill: 'Hydrogen atom', difficulty: 2,
    question: 'Including electron spin, how many distinct quantum states does the n = 3 level of hydrogen contain?',
    options: ['3', '9', '18', '27', '6'],
    correct: 2,
    explanation: 'For a given n there are n^2 = 9 orbital states (l = 0, 1, 2 contributing 1 + 3 + 5), and each holds two spin orientations, giving 2n^2 = 18. That 2n^2 is exactly the shell capacity sequence 2, 8, 18, 32 in the periodic table.',
  },
  {
    id: 'pgre_qm_005', section: 'quantum_mechanics', domain: 'Quantum Mechanics', skill: 'Perturbation theory', difficulty: 2,
    question: 'A particle in an infinite square well of width L is subject to a small constant perturbation V_0 across the entire well. To first order, the energy of the n-th level shifts by',
    options: ['0', 'V_0', 'V_0/2', 'V_0/n', 'n V_0'],
    correct: 1,
    explanation: 'The first-order shift is the expectation of the perturbation in the unperturbed state. For a constant V_0 over the whole well, that expectation is V_0 times the integral of |psi_n|^2, which is 1 by normalisation. So every level shifts by exactly V_0 — as it must, since adding a constant to the potential just re-zeros the energy scale.',
  },
  {
    id: 'pgre_qm_006', section: 'quantum_mechanics', domain: 'Quantum Mechanics', skill: 'Tunnelling', difficulty: 2,
    question: 'The transmission probability of a particle through a thick rectangular barrier is proportional to exp(-2 kappa a), where a is the barrier width. If the barrier width is doubled, the transmission probability',
    options: ['is halved', 'is squared', 'is quartered', 'doubles', 'is unchanged'],
    correct: 1,
    explanation: 'Doubling a takes exp(-2 kappa a) to exp(-4 kappa a) = [exp(-2 kappa a)]^2. Since T is small, squaring it makes it dramatically smaller — a factor of 100 becomes a factor of 10,000. This exponential sensitivity to gap width is what gives the scanning tunnelling microscope its atomic resolution.',
  },
  {
    id: 'pgre_qm_007', section: 'quantum_mechanics', domain: 'Quantum Mechanics', skill: 'Commutators', difficulty: 3,
    question: 'Which pair of observables can be measured simultaneously with arbitrary precision?',
    options: ['L_x and L_y', 'x and p_x', 'L^2 and L_z', 'x and p_y is impossible', 'E and t'],
    correct: 2,
    explanation: '[L^2, L_z] = 0, so they share eigenfunctions and are simultaneously measurable — which is why states are labelled by both l and m. The components of L do not commute with each other, and [x, p_x] = i hbar. (Note x and p_y DO commute, so option (D) is a false statement rather than a valid answer, and energy-time is not an operator pair at all.)',
  },

  // ── Thermodynamics & Statistical Mechanics ──────────────────
  {
    id: 'pgre_th_001', section: 'thermo_stat_mech', domain: 'Thermodynamics', skill: 'Carnot efficiency', difficulty: 1,
    question: 'A heat engine operates between reservoirs at 600 K and 300 K. What is the maximum possible efficiency?',
    options: ['25%', '50%', '67%', '75%', '100%'],
    correct: 1,
    explanation: 'eta_Carnot = 1 - T_C/T_H = 1 - 300/600 = 0.5, so 50%. Any claimed efficiency above this is impossible regardless of engineering. The temperatures must be absolute — using Celsius here would give a badly wrong and superficially plausible answer.',
  },
  {
    id: 'pgre_th_002', section: 'thermo_stat_mech', domain: 'Thermodynamics', skill: 'Adiabatic processes', difficulty: 2,
    question: 'A monatomic ideal gas expands adiabatically and reversibly to twice its volume. By what factor does its absolute temperature change?',
    options: ['2', '2^(2/3)', '2^(-2/3)', '2^(-1)', '1'],
    correct: 2,
    explanation: 'For a reversible adiabat, T V^(gamma-1) is constant. A monatomic gas has gamma = 5/3, so gamma - 1 = 2/3 and T2 = T1 (V1/V2)^(2/3) = T1 2^(-2/3) = 0.63 T1. The gas cools because it does work with no heat input, and the internal energy pays for it.',
  },
  {
    id: 'pgre_th_003', section: 'thermo_stat_mech', domain: 'Thermodynamics', skill: 'Entropy', difficulty: 2,
    question: 'An ideal gas expands freely into an evacuated chamber, doubling its volume. Which statement is correct?',
    options: ['The temperature falls and the entropy is unchanged', 'The temperature is unchanged and the entropy increases', 'Both temperature and entropy are unchanged', 'The temperature rises and the entropy falls', 'The entropy change cannot be computed because the process is irreversible'],
    correct: 1,
    explanation: 'Free expansion has Q = 0 and W = 0, so Delta U = 0 and for an ideal gas the temperature is unchanged. Entropy is a state function, so compute it along any reversible path between the same endpoints: Delta S = nR ln 2 > 0. Irreversibility does not prevent the calculation — it is exactly why dS = dQ/T needs a reversible path.',
  },
  {
    id: 'pgre_th_004', section: 'thermo_stat_mech', domain: 'Statistical Mechanics', skill: 'Boltzmann distribution', difficulty: 2,
    question: 'A two-level system has an energy gap epsilon. In thermal equilibrium at temperature T, the ratio of upper to lower populations is',
    options: ['exp(epsilon/k_B T)', 'exp(-epsilon/k_B T)', 'epsilon/k_B T', '1 - exp(-epsilon/k_B T)', '1/2 always'],
    correct: 1,
    explanation: 'The Boltzmann factor gives N_2/N_1 = exp(-(E_2-E_1)/k_B T) = exp(-epsilon/k_B T), which is always less than 1 at positive temperature — the upper level is never more populated in equilibrium, which is exactly why a laser requires pumping. As T goes to infinity the ratio approaches 1, not above it.',
  },
  {
    id: 'pgre_th_005', section: 'thermo_stat_mech', domain: 'Statistical Mechanics', skill: 'Quantum statistics', difficulty: 2,
    question: 'The low-temperature heat capacity of a metal has the form C = gamma T + A T^3. The two terms come respectively from',
    options: ['phonons and electrons', 'electrons and phonons', 'electrons and photons', 'phonons and magnons', 'rotations and vibrations'],
    correct: 1,
    explanation: 'Conduction electrons form a degenerate Fermi gas; only a fraction ~T/T_F can be excited, so their contribution is linear in T. Lattice vibrations obey Bose statistics and the Debye model gives T^3. Plotting C/T against T^2 gives a straight line whose intercept and slope separate the two — a standard low-temperature measurement.',
  },
  {
    id: 'pgre_th_006', section: 'thermo_stat_mech', domain: 'Statistical Mechanics', skill: 'Blackbody radiation', difficulty: 1,
    question: 'A blackbody\'s absolute temperature is doubled. Its total radiated power per unit area and the wavelength of its peak emission change by factors of',
    options: ['4 and 2', '8 and 1/2', '16 and 1/2', '16 and 2', '2 and 1/2'],
    correct: 2,
    explanation: 'Stefan-Boltzmann gives power per area proportional to T^4, so doubling T multiplies it by 16. Wien displacement gives lambda_max inversely proportional to T, so the peak wavelength halves — the object gets much brighter and much bluer at once.',
  },

  // ── Atomic Physics ──────────────────────────────────────────
  {
    id: 'pgre_at_001', section: 'atomic_physics', domain: 'Atomic Physics', skill: 'Hydrogen spectrum', difficulty: 1,
    question: 'What is the energy of the photon emitted in the hydrogen transition n = 3 to n = 2?',
    options: ['1.51 eV', '1.89 eV', '3.40 eV', '10.2 eV', '13.6 eV'],
    correct: 1,
    explanation: 'E_3 = -13.6/9 = -1.51 eV and E_2 = -13.6/4 = -3.40 eV, so the emitted photon carries 3.40 - 1.51 = 1.89 eV. That is 656 nm, the red H-alpha line and the brightest member of the Balmer series. The distractors are the individual level energies, which is the intended trap.',
  },
  {
    id: 'pgre_at_002', section: 'atomic_physics', domain: 'Atomic Physics', skill: 'Selection rules', difficulty: 2,
    question: 'Which transition is forbidden by the electric-dipole selection rules?',
    options: ['3p to 2s', '3d to 2p', '2p to 1s', '3s to 2p', '3s to 2s'],
    correct: 4,
    explanation: 'Electric-dipole transitions require Delta l = ±1. The 3s to 2s transition has Delta l = 0 and is forbidden. All the others change l by exactly one: p to s, d to p, p to s and s to p. The rule follows from parity and from the photon carrying one unit of angular momentum.',
  },
  {
    id: 'pgre_at_003', section: 'atomic_physics', domain: 'Atomic Physics', skill: 'Term symbols', difficulty: 3,
    question: 'What is the ground-state term symbol of carbon (electron configuration 1s^2 2s^2 2p^2)?',
    options: ['^1S_0', '^3P_0', '^3P_2', '^1D_2', '^3S_1'],
    correct: 1,
    explanation: "Hund's rules in order: maximise S, so both p electrons have parallel spins, S = 1 and multiplicity 3. Then maximise L subject to exclusion, giving m_l = 1 and 0, so L = 1 (a P term). The 2p shell is less than half filled, so J = |L - S| = 0. The ground term is ^3P_0. Oxygen (2p^4) has the same S and L but is more than half filled, giving ^3P_2.",
  },
  {
    id: 'pgre_at_004', section: 'atomic_physics', domain: 'Atomic Physics', skill: 'X-rays', difficulty: 2,
    question: 'In an X-ray tube, increasing the accelerating voltage while keeping the target the same will',
    options: ['shift the characteristic line wavelengths to shorter values', 'shift the bremsstrahlung cutoff to shorter wavelength', 'have no effect on the spectrum', 'shift both the characteristic lines and the cutoff', 'eliminate the characteristic lines'],
    correct: 1,
    explanation: 'The bremsstrahlung short-wavelength cutoff is lambda_min = hc/eV, set entirely by the accelerating voltage. The characteristic line energies are set by the target element\'s inner-shell binding energies and do not move with voltage. Separating what depends on the tube from what depends on the target is the point of the question.',
  },
  {
    id: 'pgre_at_005', section: 'atomic_physics', domain: 'Atomic Physics', skill: 'Lasers', difficulty: 2,
    question: 'Why can a simple two-level system not be used to build a laser by optical pumping?',
    options: ['The upper level always decays too quickly', 'Stimulated emission is impossible between only two levels', 'The pump radiation stimulates emission as strongly as absorption, so at best the populations equalise', 'Two-level systems have no dipole matrix element', 'Spontaneous emission always exceeds stimulated emission'],
    correct: 2,
    explanation: 'Einstein showed B_12 = B_21, so the same radiation that pumps atoms up stimulates them back down at the same per-atom rate. The best achievable steady state is equal populations, which gives zero net gain. Three- and four-level schemes work because the pumping and lasing transitions are different, allowing inversion on the lasing pair.',
  },

  // ── Optics & Wave Phenomena ─────────────────────────────────
  {
    id: 'pgre_ow_001', section: 'optics_waves', domain: 'Optics', skill: 'Refraction', difficulty: 1,
    question: 'Light passes from air into glass of refractive index 1.5. Which quantity is unchanged?',
    options: ['Wavelength', 'Speed', 'Frequency', 'Direction of propagation', 'Amplitude'],
    correct: 2,
    explanation: 'Frequency is set by the source and is continuous across the boundary — the fields on either side must oscillate together. Speed drops to c/n and wavelength shortens to lambda_0/n, and the direction changes unless incidence is normal. This is why a colour looks the same underwater even though its wavelength there is shorter.',
  },
  {
    id: 'pgre_ow_002', section: 'optics_waves', domain: 'Optics', skill: 'Thin lenses', difficulty: 2,
    question: 'An object is placed 5 cm from a converging lens of focal length 10 cm. The image is',
    options: ['real, inverted and magnified', 'real, upright and reduced', 'virtual, upright and magnified', 'virtual, inverted and reduced', 'formed at infinity'],
    correct: 2,
    explanation: '1/d_i = 1/10 - 1/5 = -1/10, so d_i = -10 cm. The negative sign means a virtual image on the object side. Magnification m = -d_i/d_o = -(-10)/5 = +2: upright and twice the size. This is the magnifying-glass configuration, which requires the object inside the focal length.',
  },
  {
    id: 'pgre_ow_003', section: 'optics_waves', domain: 'Optics', skill: 'Interference', difficulty: 2,
    question: 'A soap film in air appears black at its very top just before it bursts. This is because',
    options: ['the film absorbs all incident light there', 'the film is thicker than a wavelength there', 'the two reflections interfere destructively, since only one carries a pi phase shift', 'total internal reflection occurs there', 'the film has become opaque'],
    correct: 2,
    explanation: 'As the thickness goes to zero, the geometric path difference vanishes. The reflection at the top surface (air to soap, low to high index) carries a pi shift while the bottom one (soap to air) does not, so the two reflected waves are exactly out of phase and cancel. The blackness is interference, not absorption.',
  },
  {
    id: 'pgre_ow_004', section: 'optics_waves', domain: 'Optics', skill: 'Polarisation', difficulty: 2,
    question: 'Unpolarised light of intensity I_0 passes through three ideal polarisers, the second at 45 degrees to the first and the third at 90 degrees to the first. What is the transmitted intensity?',
    options: ['0', 'I_0/2', 'I_0/4', 'I_0/8', 'I_0/16'],
    correct: 3,
    explanation: 'The first polariser halves unpolarised light regardless of orientation: I_0/2. Malus\'s law then gives (I_0/2)cos^2(45) = I_0/4 after the second, and (I_0/4)cos^2(45) = I_0/8 after the third. Without the middle polariser the crossed pair would transmit nothing — adding an element increases transmission, which is the surprise the question is built around.',
  },

  // ── Specialized Topics ──────────────────────────────────────
  {
    id: 'pgre_sp_001', section: 'specialized', domain: 'Nuclear Physics', skill: 'Radioactive decay', difficulty: 1,
    question: 'A radioactive sample falls to 1/16 of its initial activity in 40 minutes. What is its half-life?',
    options: ['2.5 minutes', '5 minutes', '10 minutes', '20 minutes', '40 minutes'],
    correct: 2,
    explanation: '1/16 = (1/2)^4, so four half-lives have elapsed in 40 minutes, giving a half-life of 10 minutes. The corresponding decay constant is ln2/10 = 0.069 per minute and the mean lifetime is 1/lambda = 14.4 minutes — longer than the half-life, which is a distinction the exam tests separately.',
  },
  {
    id: 'pgre_sp_002', section: 'specialized', domain: 'Nuclear Physics', skill: 'Binding energy', difficulty: 2,
    question: 'Both nuclear fission of heavy nuclei and fusion of light nuclei release energy because',
    options: ['both increase the total number of nucleons', 'both move products toward higher binding energy per nucleon', 'both convert protons into neutrons', 'both reduce the total charge', 'fission releases energy but fusion absorbs it'],
    correct: 1,
    explanation: 'The binding energy per nucleon peaks near iron-56. Light nuclei fusing and heavy nuclei splitting both produce products closer to that peak, so the products are more tightly bound and the difference is released. Nucleon number is conserved in both, which rules out the first option.',
  },
  {
    id: 'pgre_sp_003', section: 'specialized', domain: 'Particle Physics', skill: 'Conservation laws', difficulty: 2,
    question: 'The decay Lambda^0 -> p + pi^- has a lifetime of about 2.6e-10 s. This lifetime indicates that the decay proceeds via',
    options: ['the strong interaction', 'the electromagnetic interaction', 'the weak interaction', 'gravity', 'a combination of strong and electromagnetic'],
    correct: 2,
    explanation: 'Strong decays occur in about 1e-23 s and electromagnetic ones in about 1e-16 s. A lifetime of 1e-10 s is characteristic of the weak interaction, and consistently the decay changes strangeness from -1 to 0, which only the weak interaction permits. Lifetime is a reliable fingerprint of which force governed a decay.',
  },
  {
    id: 'pgre_sp_004', section: 'specialized', domain: 'Condensed Matter', skill: 'Bragg diffraction', difficulty: 2,
    question: 'X-rays of wavelength 0.15 nm undergo first-order Bragg reflection from crystal planes at a glancing angle of 30 degrees. What is the plane spacing?',
    options: ['0.075 nm', '0.15 nm', '0.20 nm', '0.30 nm', '0.60 nm'],
    correct: 1,
    explanation: '2 d sin(theta) = n lambda with n = 1 gives d = lambda/(2 sin 30) = 0.15/(2 x 0.5) = 0.15 nm. Note that theta is measured from the crystal planes, not from the normal — the opposite convention to Snell\'s law, and the most common source of error in these problems.',
  },
  {
    id: 'pgre_sp_005', section: 'specialized', domain: 'Condensed Matter', skill: 'Conduction', difficulty: 2,
    question: 'As temperature increases, the electrical conductivity of a pure semiconductor and that of a metal respectively',
    options: ['increases; increases', 'increases; decreases', 'decreases; increases', 'decreases; decreases', 'is unchanged; decreases'],
    correct: 1,
    explanation: 'In a semiconductor, heating excites exponentially more carriers across the gap, so conductivity rises steeply. In a metal the carrier density is essentially fixed and heating increases phonon scattering, so conductivity falls. The opposite temperature coefficients are a standard distinguishing test.',
  },

  // ── Special Relativity ──────────────────────────────────────
  {
    id: 'pgre_sr_001', section: 'special_relativity', domain: 'Special Relativity', skill: 'Time dilation', difficulty: 1,
    question: 'A muon travelling at 0.99c has a proper lifetime of 2.2 microseconds. How far does it travel in the laboratory frame before decaying, on average?',
    options: ['0.65 km', '4.6 km', '6.6 km', '46 km', '0.09 km'],
    correct: 1,
    explanation: 'gamma = 1/sqrt(1 - 0.9801) = 7.09, so the laboratory lifetime is 7.09(2.2 us) = 15.6 us. Distance = 0.99(3e8)(15.6e-6) = 4.6 km. Without dilation it would travel only 0.65 km, which is why atmospheric muons reach the ground at all.',
  },
  {
    id: 'pgre_sr_002', section: 'special_relativity', domain: 'Special Relativity', skill: 'Velocity addition', difficulty: 2,
    question: 'A spaceship moving at 0.8c relative to Earth fires a probe forward at 0.8c relative to itself. What is the probe\'s speed relative to Earth?',
    options: ['1.6c', 'c', '0.98c', '0.89c', '0.64c'],
    correct: 2,
    explanation: 'u = (0.8 + 0.8)c/(1 + 0.64) = 1.6c/1.64 = 0.976c. Relativistic velocity addition never produces a result at or above c for sublight inputs, and it returns exactly c whenever either input is c — which is the second postulate emerging from the algebra.',
  },
  {
    id: 'pgre_sr_003', section: 'special_relativity', domain: 'Special Relativity', skill: 'Relativistic energy', difficulty: 2,
    question: 'A particle has total energy equal to three times its rest energy. What is its speed?',
    options: ['0.94c', '0.87c', '0.75c', '0.67c', '0.50c'],
    correct: 0,
    explanation: 'E = gamma mc^2 = 3 mc^2 means gamma = 3, so 1 - beta^2 = 1/9 and beta = sqrt(8/9) = 0.943. Its kinetic energy is 2 mc^2, twice its rest energy — at these speeds most of the energy is kinetic, which is the regime particle accelerators work in.',
  },

  // ── Laboratory Methods ──────────────────────────────────────
  {
    id: 'pgre_lab_001', section: 'lab_methods', domain: 'Laboratory Methods', skill: 'Error propagation', difficulty: 1,
    question: 'A quantity is computed as z = x^2 y. If x and y each carry a 2% relative uncertainty, what is the relative uncertainty in z?',
    options: ['2%', '4%', '4.5%', '6%', '8%'],
    correct: 2,
    explanation: 'A power n multiplies the relative error by n, so x^2 contributes 4% and y contributes 2%. Independent errors add in quadrature: sqrt(16 + 4) = sqrt(20) = 4.5%. Simply adding to 6% ignores the quadrature and overestimates; the squared variable dominates, which is where extra measurement effort should go.',
  },
  {
    id: 'pgre_lab_002', section: 'lab_methods', domain: 'Laboratory Methods', skill: 'Counting statistics', difficulty: 1,
    question: 'A detector records 2500 counts. What is the approximate fractional uncertainty in this measurement?',
    options: ['0.02%', '0.2%', '2%', '5%', '20%'],
    correct: 2,
    explanation: 'Counting obeys Poisson statistics, so the uncertainty on N counts is sqrt(N) = 50, and the fractional uncertainty is 50/2500 = 2%. Halving that to 1% would require four times as many counts, which is why counting experiments are slow.',
  },
  {
    id: 'pgre_lab_003', section: 'lab_methods', domain: 'Laboratory Methods', skill: 'Systematic error', difficulty: 1,
    question: 'A balance is miscalibrated so that every reading is 0.5 g too high. Taking many more measurements and averaging will',
    options: ['eliminate the error', 'reduce the error as 1/sqrt(N)', 'reduce the error as 1/N', 'leave the error unchanged', 'double the error'],
    correct: 3,
    explanation: 'This is a systematic error: it shifts every reading in the same direction, so averaging does nothing to it. Only random error falls as 1/sqrt(N). Averaging a thousand readings on a miscalibrated balance gives a very precise wrong answer — which is why calibration, not repetition, is the fix.',
  },
  {
    id: 'pgre_lab_004', section: 'lab_methods', domain: 'Laboratory Methods', skill: 'Instrumentation', difficulty: 2,
    question: 'A voltmeter with 1 MΩ input impedance is used to measure the output of a source with 1 MΩ internal impedance. The reading will be approximately',
    options: ['the true voltage', 'half the true voltage', 'twice the true voltage', 'zero', 'the true voltage plus 1 V'],
    correct: 1,
    explanation: 'The meter and source impedances form a voltage divider with equal arms, so the meter reads half the open-circuit voltage. A voltmeter must have an input impedance far larger than the source impedance — a factor of 100 or more — or it loads the circuit it is trying to measure.',
  },
  {
    id: 'pgre_lab_005', section: 'lab_methods', domain: 'Laboratory Methods', skill: 'Detectors', difficulty: 2,
    question: 'Which detector is LEAST suitable for measuring the energy of individual gamma rays?',
    options: ['High-purity germanium detector', 'NaI(Tl) scintillator', 'Geiger-Muller tube', 'Silicon surface-barrier detector', 'Proportional counter'],
    correct: 2,
    explanation: 'A Geiger-Muller tube operates in full avalanche, so every ionising event produces the same size pulse regardless of the deposited energy. It counts but carries no spectroscopic information. All the others produce a signal proportional to energy, with germanium giving the best resolution because pair creation costs only about 3 eV.',
  },
  {
    id: 'pgre_lab_006', section: 'lab_methods', domain: 'Laboratory Methods', skill: 'Data analysis', difficulty: 2,
    question: 'Experimental data plotted on log-log axes fall on a straight line of slope 1.5. The relationship between the variables is best described as',
    options: ['y proportional to 1.5 x', 'y proportional to exp(1.5 x)', 'y proportional to x^1.5', 'y proportional to log(1.5 x)', 'y proportional to 1.5^x'],
    correct: 2,
    explanation: 'On log-log axes, log y = n log x + constant, so a straight line of slope n means a power law y ∝ x^n — here x^1.5. An exponential relationship would give a straight line on log-LINEAR axes instead, with the slope giving the rate rather than the exponent.',
  },
];

/** Section id -> display label, for the picker. */
export const PHYSICS_GRE_SECTIONS = [
  'classical_mechanics', 'electromagnetism', 'quantum_mechanics',
  'thermo_stat_mech', 'atomic_physics', 'optics_waves',
  'specialized', 'special_relativity', 'lab_methods',
] as const;

export const GRE_QUESTION_COUNT = GRE_QUESTIONS.length;

/**
 * Curriculum data for every exam — each section's topics with lesson titles.
 * This is the reading-lesson syllabus students study from.
 */

export interface LessonTopic {
  id: string;
  title: string;
  summary: string;
  readTimeMin: number;
}

export interface SectionCurriculum {
  sectionId: string;
  sectionName: string;
  topics: LessonTopic[];
}

export type ExamCurriculum = SectionCurriculum[];

function t(id: string, title: string, summary: string, readTimeMin = 12): LessonTopic {
  return { id, title, summary, readTimeMin };
}

// ═══════════════════════════════════════════════════════════════
// SAT
// ═══════════════════════════════════════════════════════════════

const SAT: ExamCurriculum = [
  {
    sectionId: 'reading_writing', sectionName: 'Reading and Writing',
    topics: [
      t('rw_central_ideas', 'Central Ideas & Details', 'Identify main ideas, key details, and how they support the central argument.'),
      t('rw_inferences', 'Inferences & Implicit Meaning', 'Draw conclusions from textual evidence and understand what the author implies.'),
      t('rw_command_evidence', 'Command of Evidence', 'Use textual and quantitative evidence to support claims and strengthen arguments.'),
      t('rw_words_context', 'Words in Context', 'Determine word meaning from context, connotation, and tone.'),
      t('rw_text_structure', 'Text Structure & Purpose', 'Analyze how authors organize information and the purpose of structural choices.'),
      t('rw_cross_text', 'Cross-Text Connections', 'Compare perspectives and arguments across paired passages.'),
      t('rw_rhetoric', 'Rhetorical Analysis', 'Evaluate rhetorical strategies: ethos, pathos, logos, and persuasive techniques.'),
      t('rw_conventions', 'Standard English Conventions', 'Grammar, punctuation, sentence structure, and usage rules.'),
      t('rw_expression', 'Expression of Ideas', 'Revise text for clarity, precision, style, and effective transitions.'),
    ],
  },
  {
    sectionId: 'math', sectionName: 'Math',
    topics: [
      t('math_linear_eq', 'Linear Equations & Inequalities', 'Solve and graph linear equations, inequalities, and systems.'),
      t('math_linear_func', 'Linear Functions', 'Understand slope, rate of change, intercepts, and linear models.'),
      t('math_systems', 'Systems of Equations', 'Solve systems algebraically and graphically; classify solutions.'),
      t('math_quadratic', 'Quadratic Equations & Functions', 'Factor, use the quadratic formula, vertex form, and parabola properties.'),
      t('math_polynomial', 'Polynomial & Rational Expressions', 'Simplify, factor, and perform operations on polynomials and rationals.'),
      t('math_exponents', 'Exponents & Radicals', 'Rules of exponents, radical expressions, and rational exponents.'),
      t('math_ratios', 'Ratios, Proportions & Percents', 'Solve ratio and proportion problems, percent change, and scaling.'),
      t('math_geometry', 'Geometry & Trigonometry', 'Area, volume, angles, triangles, circles, and basic trigonometry.'),
      t('math_statistics', 'Statistics & Probability', 'Mean, median, standard deviation, probability, and data interpretation.'),
      t('math_advanced', 'Advanced Math Topics', 'Complex numbers, absolute value, function composition, and transformations.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// Physics GRE (GRE Physics Subject Test) — exam id stays GRE
// ═══════════════════════════════════════════════════════════════
//
// The nine sections and their order follow the ETS-published content
// distribution for this test, heaviest first. This is a subject test in
// undergraduate physics, so the syllabus is the physics, not test tactics:
// the only section that is about the exam rather than about the subject is
// Laboratory Methods, and that is because ETS tests laboratory practice as
// content in its own right.
//
// Note for anyone comparing against git history: this replaced the GRE
// General Test syllabus (Verbal / Quantitative / Analytical Writing). None
// of that content carried over — a general-test lesson relabelled as a
// physics lesson would be a lie about what a learner is reading.

const GRE: ExamCurriculum = [
  {
    sectionId: 'classical_mechanics', sectionName: 'Classical Mechanics',
    topics: [
      t('pgre_cm_kinematics', 'Kinematics', 'Position, velocity and acceleration in one, two and three dimensions; projectile and circular motion.', 14),
      t('pgre_cm_newton', "Newton's Laws & Dynamics", 'Forces, free-body diagrams, friction, constraints, and the equations of motion they produce.', 16),
      t('pgre_cm_energy', 'Work, Energy & Conservation Laws', 'Work-energy theorem, conservative forces, potential energy curves, and when energy is and is not conserved.', 15),
      t('pgre_cm_momentum', 'Momentum, Collisions & Systems of Particles', 'Impulse, elastic and inelastic collisions, centre of mass, and variable-mass problems.', 14),
      t('pgre_cm_rotation', 'Rigid-Body Rotation & Angular Momentum', 'Moment of inertia, torque, rolling, the parallel-axis theorem, and gyroscopic precession.', 16),
      t('pgre_cm_oscillations', 'Oscillations', 'Simple, damped and driven harmonic motion; resonance and the small-angle pendulum.', 15),
      t('pgre_cm_gravitation', 'Gravitation & Central Forces', 'Kepler orbits, effective potential, escape velocity, and the two-body reduction.', 14),
      t('pgre_cm_lagrangian', 'Lagrangian & Hamiltonian Mechanics', 'Generalised coordinates, the Euler-Lagrange equation, cyclic coordinates, and the Hamiltonian.', 18),
      t('pgre_cm_noninertial', 'Non-Inertial Frames', 'Centrifugal and Coriolis terms, and how to recognise a rotating-frame problem on sight.', 12),
    ],
  },
  {
    sectionId: 'electromagnetism', sectionName: 'Electromagnetism',
    topics: [
      t('pgre_em_electrostatics', 'Electrostatics', "Coulomb's law, the electric field, Gauss's law, and the three standard symmetries.", 16),
      t('pgre_em_potential', 'Electric Potential & Conductors', 'Potential, capacitance, energy stored in a field, and the boundary conditions at a conductor.', 15),
      t('pgre_em_dielectrics', 'Dielectrics & Boundary-Value Problems', 'Polarisation, bound charge, the method of images, and separation of variables.', 16),
      t('pgre_em_magnetostatics', 'Magnetostatics', "Biot-Savart, Ampere's law, the vector potential, and forces on currents.", 16),
      t('pgre_em_induction', 'Faraday Induction & Inductance', 'Motional EMF, Lenz’s law, self and mutual inductance, and magnetic energy.', 15),
      t('pgre_em_circuits', 'Circuits', 'RC, RL and RLC transients, AC steady state, impedance, resonance and power factor.', 15),
      t('pgre_em_maxwell', "Maxwell's Equations & Electromagnetic Waves", 'The displacement current, the wave equation, polarisation, and the Poynting vector.', 18),
      t('pgre_em_radiation', 'Radiation & Moving Charges', 'The Larmor formula, dipole radiation, and the fields of a uniformly moving charge.', 14),
    ],
  },
  {
    sectionId: 'quantum_mechanics', sectionName: 'Quantum Mechanics',
    topics: [
      t('pgre_qm_foundations', 'Wave Functions & the Schrodinger Equation', 'The postulates, probability current, normalisation, and stationary states.', 16),
      t('pgre_qm_wells', 'One-Dimensional Potentials', 'Infinite and finite wells, the step, the barrier and tunnelling, and the delta-function potential.', 16),
      t('pgre_qm_oscillator', 'The Harmonic Oscillator', 'Ladder operators, the spectrum, and why this problem appears everywhere else.', 14),
      t('pgre_qm_formalism', 'Operators, Measurement & Uncertainty', 'Hermitian operators, commutators, expectation values, and the generalised uncertainty relation.', 15),
      t('pgre_qm_angular', 'Angular Momentum & Spin', 'The algebra of L and S, spherical harmonics, addition of angular momenta, and the Pauli matrices.', 17),
      t('pgre_qm_hydrogen', 'The Hydrogen Atom', 'The radial equation, quantum numbers, degeneracy, and the energy scale.', 15),
      t('pgre_qm_perturbation', 'Perturbation Theory & Approximations', 'Time-independent perturbation theory, the variational principle, and the WKB approximation.', 16),
    ],
  },
  {
    sectionId: 'thermo_stat_mech', sectionName: 'Thermodynamics & Statistical Mechanics',
    topics: [
      t('pgre_th_laws', 'The Laws of Thermodynamics', 'State functions, the first law, entropy, and what the second and third laws forbid.', 15),
      t('pgre_th_processes', 'Processes, Engines & Cycles', 'Isothermal, adiabatic and isobaric processes; Carnot efficiency and refrigerators.', 15),
      t('pgre_th_kinetic', 'Kinetic Theory', 'The ideal gas from molecular motion, equipartition, mean free path, and transport.', 14),
      t('pgre_th_ensembles', 'Statistical Ensembles', 'Microstates, the Boltzmann factor, the partition function, and free energies.', 17),
      t('pgre_th_quantum_stats', 'Quantum Statistics', 'Fermi-Dirac and Bose-Einstein distributions, the Fermi gas, blackbody radiation and the Bose condensate.', 17),
      t('pgre_th_phase', 'Phase Transitions & Real Gases', 'Latent heat, the Clausius-Clapeyron relation, and the van der Waals gas.', 13),
    ],
  },
  {
    sectionId: 'atomic_physics', sectionName: 'Atomic Physics',
    topics: [
      t('pgre_at_structure', 'Atomic Structure & Spectra', 'The Bohr model, hydrogenic energies, selection rules, and the spectral series.', 15),
      t('pgre_at_multielectron', 'Multi-Electron Atoms', 'The Pauli principle, shell filling, screening, and term symbols under LS coupling.', 16),
      t('pgre_at_finestructure', 'Fine & Hyperfine Structure', 'Spin-orbit coupling, relativistic corrections, and the Lamb and hyperfine splittings.', 15),
      t('pgre_at_fields', 'Atoms in External Fields', 'The Zeeman and Stark effects, weak and strong field limits.', 14),
      t('pgre_at_xray_lasers', 'X-Rays, Lasers & Transitions', "Characteristic X-rays and Moseley's law, stimulated emission, population inversion, and laser operation.", 14),
    ],
  },
  {
    sectionId: 'optics_waves', sectionName: 'Optics & Wave Phenomena',
    topics: [
      t('pgre_ow_waves', 'Wave Motion', 'The wave equation, superposition, standing waves, beats, and the Doppler effect.', 14),
      t('pgre_ow_geometric', 'Geometric Optics', 'Reflection, refraction, thin lenses and mirrors, and sign conventions that decide the answer.', 13),
      t('pgre_ow_interference', 'Interference', 'Double slit, thin films, the Michelson interferometer, and coherence.', 14),
      t('pgre_ow_diffraction', 'Diffraction & Polarisation', 'Single slit, gratings, the Rayleigh criterion, Brewster’s angle and Malus’s law.', 15),
    ],
  },
  {
    sectionId: 'specialized', sectionName: 'Specialized Topics',
    topics: [
      t('pgre_sp_nuclear', 'Nuclear Physics', 'Binding energy, radioactive decay, decay chains, fission and fusion, and cross sections.', 15),
      t('pgre_sp_particle', 'Particle Physics', 'The Standard Model inventory, conservation laws, and which reactions are allowed.', 14),
      t('pgre_sp_condensed', 'Condensed Matter', 'Crystal structure, Bragg diffraction, band theory, semiconductors and superconductivity.', 16),
      t('pgre_sp_astro', 'Astrophysics & Cosmology', 'Stellar structure and evolution, the magnitude scale, the Hubble law and the cosmic microwave background.', 14),
      t('pgre_sp_math', 'Mathematical Methods', 'Vector calculus, series, complex analysis, Fourier methods and the differential equations physics keeps reusing.', 16),
    ],
  },
  {
    sectionId: 'special_relativity', sectionName: 'Special Relativity',
    topics: [
      t('pgre_sr_kinematics', 'Relativistic Kinematics', 'The postulates, time dilation, length contraction, the Lorentz transformation and simultaneity.', 15),
      t('pgre_sr_dynamics', 'Relativistic Dynamics', 'Four-vectors, invariant mass, energy-momentum conservation and collisions.', 16),
      t('pgre_sr_applications', 'Applications & Common Traps', 'Velocity addition, the relativistic Doppler effect, and the paradoxes that catch people out.', 13),
    ],
  },
  {
    sectionId: 'lab_methods', sectionName: 'Laboratory Methods',
    topics: [
      t('pgre_lab_uncertainty', 'Measurement & Uncertainty', 'Significant figures, propagation of error, statistical against systematic uncertainty, and fitting.', 13),
      t('pgre_lab_electronics', 'Instrumentation & Electronics', 'Oscilloscopes, meters, amplifiers, filters, loading, and signal-to-noise.', 13),
      t('pgre_lab_detectors', 'Detectors & Radiation Safety', 'Photomultipliers, scintillators, semiconductor detectors, counting statistics and shielding.', 12),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// LSAT
// ═══════════════════════════════════════════════════════════════

// LSAT curriculum — current post-Aug-2024 format (2× LR + 1× RC; Analytical
// Reasoning / Logic Games REMOVED Aug 2024). Topic IDs match LSAT_COURSE keys
// in `lsat-course-data.ts` and the frequency heatmap in `lsat-frequency.ts`.
const LSAT: ExamCurriculum = [
  {
    sectionId: 'logical_reasoning', sectionName: 'Logical Reasoning',
    topics: [
      t('lr_strengthen', 'Strengthen', 'Find the answer that most supports / makes the conclusion more likely. Tier: Very High (~12% of LR).'),
      t('lr_weaken', 'Weaken', 'Find the answer that undermines / makes the conclusion less likely. Tier: Very High (~10%).'),
      t('lr_necessary_assumption', 'Necessary Assumption', 'Identify a premise the argument MUST rely on; test via the negation technique.'),
      t('lr_inference', 'Inference / Must Be True', 'What conclusion is supported by the stimulus? Stay strictly within the text.'),
      t('lr_flaw', 'Flaw', 'Identify the LOGICAL flaw in the argument (cause/correlation, equivocation, etc.).'),
      t('lr_principle', 'Principle (apply / strengthen)', 'Connect an abstract principle to a specific situation, in either direction.'),
      t('lr_main_point', 'Main Point / Main Conclusion', `Identify the author's primary conclusion; distinguish from subsidiary conclusions.`),
      t('lr_role', 'Role / Function in Argument', 'How does a bolded statement function — premise, sub-conclusion, evidence rejected, etc.'),
      t('lr_resolve_paradox', 'Resolve the Paradox', 'Find what RECONCILES two seemingly contradictory facts; look for a missing piece.'),
      t('lr_method', 'Method of Reasoning', 'Describe HOW the argument proceeds (analogy, generalization, eliminating alternatives).'),
      t('lr_sufficient_assumption', 'Sufficient Assumption', 'What assumption, if true, would GUARANTEE the conclusion? Look for conditional patterns.'),
      t('lr_parallel', 'Parallel Reasoning', 'Which answer matches the LOGICAL STRUCTURE of the stimulus argument?'),
      t('lr_parallel_flaw', 'Parallel Flaw', 'Which answer matches the FLAWED logical structure of the stimulus argument?'),
      t('lr_point_at_issue', 'Point at Issue / Disagreement', 'What do two speakers DISAGREE about? Look for direct contradiction.'),
      t('lr_eval_argument', 'Argument Evaluation', 'What information would help DETERMINE whether the argument is sound?'),
      t('lr_complete', 'Complete the Argument', 'Fill in a missing premise or conclusion that follows naturally.'),
      t('lr_necessary_sufficient', 'Conditional / Necessary-Sufficient', 'Manipulate conditional statements (contrapositive, contraposition errors).'),
    ],
  },
  {
    sectionId: 'reading_comprehension', sectionName: 'Reading Comprehension',
    topics: [
      t('rc_detail', 'Specific Reference / Detail', 'What did the passage SAY about X? Send-back to a specific line or paragraph.'),
      t('rc_inference', 'Inference (RC)', 'What can be reasonably concluded from the passage? Stay close to the text.'),
      t('rc_function', 'Function / Purpose / Role', 'Why did the author include X? Function of a paragraph, sentence, or example.'),
      t('rc_main_point', 'Main Point / Main Idea (RC)', 'Identify the CENTRAL claim of the passage.'),
      t('rc_comparative', 'Comparative Passage Relationship', 'How do the two passages relate? Agreement, disagreement, scope. (1 comparative set per test.)'),
      t('rc_structure', 'Structure / Organization', 'How is the passage organized? Compare-contrast, chronological, problem-solution, etc.'),
      t('rc_application', 'Application / Extrapolation', `Apply the passage's logic to a new scenario. Like LR Principle questions.`),
      t('rc_attitude', `Author's Attitude / Tone`, 'How does the author FEEL about the topic? Skeptical, supportive, ambivalent, etc.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// PATENT BAR
// ═══════════════════════════════════════════════════════════════

const PATENT_BAR: ExamCurriculum = [
  {
    sectionId: 'patentability', sectionName: 'Patentability & Prior Art',
    topics: [
      t('pa_subject_matter', 'Patent-Eligible Subject Matter (§101)', 'Alice/Mayo framework, abstract ideas, and laws of nature.'),
      t('pa_novelty', 'Novelty (35 USC §102)', 'Prior art search, anticipation, and novelty analysis.'),
      t('pa_aia_effective_filing_date', 'AIA Effective Filing Date & §102(a)(1) Grace Period', 'EFD determination, AIA §102(a)(1) prior art, one-year grace period for inventor disclosures, exceptions under §102(b)(1)(A) and (B). USPTO high-yield gap fill.'),
      t('pa_aia_102a2_secret_prior_art', '§102(a)(2) Prior Art (Secret Prior Art)', 'Earlier-filed US applications and PCTs that publish/issue as prior art, common-ownership and joint-research exceptions under §102(b)(2). USPTO high-yield gap fill.'),
      t('pa_novelty_preaia', 'Pre-AIA Novelty', 'Pre-AIA §102 rules and transitional issues.'),
      t('pa_prior_art', 'Prior Art Categories', 'Publications, patents, public use, and the one-year grace period.'),
      t('pa_obviousness', 'Obviousness (35 USC §103)', 'Graham factors, KSR analysis, and secondary considerations.'),
      t('pa_112a', '§112(a) Written Description & Enablement', 'Support, possession, and enablement across the full scope.'),
      t('pa_112b_112f', '§112(b) Definiteness & §112(f)', 'Claim clarity and means-plus-function practice.'),
      t('pa_112f_means_plus_function', '§112(f) Means-Plus-Function Deep Dive', 'Triggering language, claim construction under §112(f), corresponding structure requirement, computer-implemented MPF (Aristocrat/Williamson), invalidation under §112(b). USPTO high-yield gap fill.'),
      t('pa_double_patenting', 'Double Patenting & Terminal Disclaimers', 'Statutory and obviousness-type DP; TD practice.'),
      t('pa_terminal_disclaimer_odp', 'Terminal Disclaimer Practice & ODP Strategy', 'When TD is mandatory vs optional, common-ownership rule, expiration matching, broadening reissue and recapture interactions, two-way ODP test. USPTO high-yield gap fill.'),
      t('pa_utility', 'Utility Requirement', 'Specific, substantial, and credible utility under §101.'),
    ],
  },
  {
    sectionId: 'application_prep', sectionName: 'Specification, Claims & Formal Papers',
    topics: [
      t('pp_specification', 'Specification Structure', '§1.77 order, detailed description, and abstract.'),
      t('pp_claim_drafting', 'Claim Drafting', 'Independent/dependent claims, multiplicity, and strategy.'),
      t('pp_claim_antecedent_basis', 'Claim Antecedent Basis & Drafting Pitfalls', 'Antecedent basis errors, single vs. multiple basis (Packard), articles "a/an/the/said", extraneous matter, claim differentiation. USPTO high-yield gap fill.'),
      t('pp_drawings', 'Drawings & Views', 'Formal drawing requirements and corrections.'),
      t('pp_oath_declaration', 'Oath & Declaration', 'Inventor statements under §115 and §1.63.'),
      t('pp_ids', 'Information Disclosure (IDS)', 'Duty-related prior-art citations and timing.'),
      t('pp_ids_therasense_materiality', 'IDS Timing, Rule 56 & Therasense Materiality', 'Three IDS windows (§1.97), Therasense but-for materiality, cumulative references, intent to deceive, 30-day rule, foreign-counterpart citations. USPTO high-yield gap fill.'),
      t('pp_inventorship', 'Inventorship & Naming', 'Correct inventors, derivation, and corrections.'),
      t('pp_inventorship_correction', 'Inventorship Correction (§256) & Derivation', 'Pre- vs post-issue correction (§256/§116), error without deceptive intent, AIA derivation proceedings, joint-research exceptions, post-issue procedural pathway. USPTO high-yield gap fill.'),
    ],
  },
  {
    sectionId: 'filing_prosecution', sectionName: 'Filing Types & Prosecution Timeline',
    topics: [
      t('pf_provisional', 'Provisional Applications', 'Cover sheet, disclosure support, and 12-month bridge.'),
      t('pf_nonprovisional', 'Nonprovisional Applications', '§111(a) filing, fees, and papers.'),
      t('pf_priority', 'Priority & Benefit', '§§119–120, 365, domestic benefit, and Paris priority.'),
      t('pf_priority_paris_120', 'Foreign Priority (§119) & Domestic Benefit (§120) Deep Dive', 'Paris Convention 12-month rule, certified priority document, §119(e) provisional, §120 continuation chain, 16-month rule for amendments adding priority claim. USPTO high-yield gap fill.'),
      t('pf_continuations', 'Continuations & Divisionals', '§120 chains, CIPs, and divisional practice.'),
      t('pf_rce_vs_continuation_strategy', 'RCE vs Continuation vs Divisional vs CIP — Strategic Use', 'Decision tree for prosecution restart, copendency loss, claim-scope effects, PTA implications, fee schedules, deadline timing for each path. USPTO high-yield gap fill.'),
      t('pf_restriction', 'Restriction & Election', '§121, unity of invention, and election.'),
      t('pf_restriction_elections_detailed', 'Restriction Practice & Elections (Deep Dive)', 'Two-part test (independent + distinct), election with/without traverse, election by original presentation, withdrawal of restriction, divisional safe-harbor, generic claim election. USPTO high-yield gap fill.'),
      t('pf_office_action_timing', 'Office Action Timing', 'Response periods, notices, and suspensions.'),
      t('pf_extensions', 'Extensions of Time', '§1.136, PTE, and late papers.'),
      t('pf_allowance_issue', 'Allowance & Issue', 'Notice of allowance, issue fee, and publication.'),
      t('pf_preissuance', 'Pre-Issuance Submissions', 'RCE, after-allowance practice, and quick paths.'),
    ],
  },
  {
    sectionId: 'office_responses', sectionName: 'Office Actions & Responses',
    topics: [
      t('po_nonfinal', 'Non-Final Office Actions', 'Rejection types and first responses.'),
      t('po_final', 'Final Office Actions', 'After-final practice, AFCP, and pre-appeal.'),
      t('po_amendments', 'Amendments', 'Entry, new matter, and examiner objections.'),
      t('po_response_strategies', 'Response Strategies', 'Interviews, arguments, and traverse.'),
      t('po_appeal_brief_prep', 'Appeals & Briefs', 'Notice of appeal, brief content, and PTAB track.'),
      t('po_ptab_appeal_practice', 'PTAB Appeal Practice — Briefs, Oral Hearing & BRI', '§41.37 brief requirements, claim mapping, examiner answer & reply brief, oral hearing request, new rejection at PTAB, broadest reasonable interpretation vs Phillips. USPTO high-yield gap fill.'),
      t('po_reopen_prosecution', 'Reopening Prosecution', 'RCE, examiner reopening, and withdrawals.'),
    ],
  },
  {
    sectionId: 'pct_international', sectionName: 'PCT & International Filing',
    topics: [
      t('pct_overview', 'PCT Overview', 'RO, IB, international phase timeline.'),
      t('pct_international_phase', 'International Phase', 'ISA, WO publication, and deadlines.'),
      t('pct_chapter_ii', 'PCT Chapter II', 'IPEA, demand, and preliminary report.'),
      t('pct_chapter_ii_preliminary', 'PCT Chapter II Preliminary Examination (Deep Dive)', 'Demand filing (22-month deadline), Article 19 vs 34 amendments, IPEA selection, IPRP/IPER reception, Chapter II tactical use vs Chapter I. USPTO high-yield gap fill.'),
      t('pct_national', 'National Phase Entry', 'US §371 entry and conversion.'),
      t('pct_national_stage_371', 'PCT National Stage Entry (§371) — Deep Dive', '30-month deadline, national fee, English translation, oath/declaration timing, restoration of right of priority, §365(c) bypass continuation. USPTO high-yield gap fill.'),
      t('pct_strategy', 'International Strategy', 'RO/ISA choices and national-route planning.'),
    ],
  },
  {
    sectionId: 'post_issuance', sectionName: 'Appeals & Post-Grant',
    topics: [
      t('pg_ptab_appeal', 'Ex Parte PTAB Appeals', 'Notice of appeal, briefs, and oral hearing.'),
      t('pi_reissue', 'Reissue', '§251 correction, broadening, and recapture.'),
      t('pi_reexam', 'Reexamination', 'Ex parte and inter partes reexam procedures.'),
      t('pi_reissue_reexam_supplemental', 'Reissue vs Reexamination vs Supplemental Examination', 'When each is available, broadening reissue 2-year window, ex parte reexam grounds, §257 supplemental exam shield against inequitable conduct, petitioner standing. USPTO high-yield gap fill.'),
      t('pi_ipr', 'Inter Partes Review (IPR)', '§§311–319, petition, trial, and estoppel.'),
      t('pi_pgr', 'Post-Grant Review (PGR)', '§§321–329, timing, and grounds.'),
      t('pi_ipr_pgr_cbm_distinctions', 'IPR vs PGR vs CBM — Scope, Timing & Estoppel', 'IPR limited to 102/103 + patents/pubs; PGR 9-month window covers all grounds (including 101/112); CBM (sunset 2020) and AIA estoppel rules under §315(e)/§325(e). USPTO high-yield gap fill.'),
      t('pg_supplemental_exam', 'Supplemental Examination', '§§257–258 and inequitable conduct cleanup.'),
    ],
  },
  {
    sectionId: 'design_plant', sectionName: 'Design & Plant Patents',
    topics: [
      t('dp_design', 'Design Patents', '§171, ornamentality, figures, and infringement.'),
      t('dp_plant', 'Plant Patents', '§§161–164 and asexual reproduction.'),
    ],
  },
  {
    sectionId: 'ethics_conduct', sectionName: 'Ethics & Professional Conduct',
    topics: [
      t('eth_duty', 'Duty of Candor (Rule 56)', 'Materiality, IDS, and inequitable conduct.'),
      t('eth_discipline', 'OED Discipline', 'Investigations, sanctions, and practice before USPTO.'),
      t('eth_signatures', 'Signatures & Certifications', '§§1.4, 11.18, and paper formalities.'),
      t('eth_representation', 'Client Representation', 'Conflicts, confidentiality, POA, and withdrawal.'),
    ],
  },
  {
    sectionId: 'special_topics', sectionName: 'Special Topics',
    topics: [
      t('st_pta_pte', 'PTA / PTE', 'Patent term adjustment and extension.'),
      t('st_pta_calculation_abc', 'Patent Term Adjustment (A/B/C Delays) — Calculation', '§154(b) A-delays (Office response), B-delays (>3yr pendency), C-delays (interferences/secrecy/appeals), applicant delay offset, overlap rule, supplemental notice of PTA. USPTO high-yield gap fill.'),
      t('st_pte_hatch_waxman', 'Patent Term Extension (PTE) — Hatch-Waxman §156', 'FDA delay eligibility, regulatory review period, product linkage, term cap (14 yrs from approval), single PTE per product, interim PTE application. USPTO high-yield gap fill.'),
      t('st_maintenance_fees', 'Maintenance Fees & Late Payment Surcharge', '3.5/7.5/11.5-year due dates, 6-month grace with surcharge, reinstatement after expiration (unintentional/unavoidable), small/micro-entity reductions, fee schedule navigation. USPTO high-yield gap fill.'),
      t('st_ai_inventions', 'AI-Assisted Inventions', 'Inventorship policy and human contribution.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// MCAT
// ═══════════════════════════════════════════════════════════════

const MCAT: ExamCurriculum = [
  {
    sectionId: 'chem_phys', sectionName: 'Chemical & Physical Foundations',
    topics: [
      t('cp_gen_chem', 'General Chemistry', 'Atomic structure, bonding, stoichiometry, solutions, acids/bases, equilibrium, and thermochemistry.', 18),
      t('cp_acid_base_titration', 'Acid-Base Equilibria & Titration Curves', 'Henderson-Hasselbalch, buffer capacity, polyprotic acids, titration curve interpretation, equivalence vs half-equivalence points. AAMC high-yield gap fill.', 16),
      t('cp_thermodynamics_deep', 'Thermodynamics: ΔG, ΔH, ΔS Applied', 'Spontaneity prediction, coupling reactions, thermodynamic vs kinetic control, Gibbs free energy and equilibrium (ΔG = -RT·lnK). AAMC high-yield gap fill.', 14),
      t('cp_organic', 'Organic Chemistry', 'Functional groups, reactions, stereochemistry, spectroscopy, and lab techniques.', 18),
      t('cp_physics', 'Physics', 'Kinematics, forces, energy, fluids, electrostatics, circuits, waves, and optics.', 20),
      t('cp_kinematics_full', 'Kinematics: Projectile, Circular & Relative Motion', '2-D projectile motion, circular motion (centripetal force, banked curves), reference-frame transformations, terminal velocity. AAMC high-yield gap fill.', 14),
      t('cp_electrostatics_circuits', "Electrostatics, Ohm's Law & RC Circuits", "Coulomb's law, electric fields, capacitors in series/parallel, Ohm's law, Kirchhoff's rules, RC time constants. AAMC high-yield gap fill.", 14),
      // Biochemistry I chapters I.1–I.11 (docs/mcat/BIOCHEM_CHAPTERS.md);
      // the sequence is complete — Biochemistry II lands as bb_ chapters.
      t('cpb1_water', 'Water, pH, and the Chemistry of Life', 'Water as solvent, noncovalent forces, pH and pKa, physiological buffers, and Henderson-Hasselbalch in one variable.', 8),
      t('cpb1_amino_acids', 'Amino Acids and the Peptide Bond', 'The twenty side chains grouped by chemistry, ionization states and pI, the planar peptide bond, and primary structure.', 8),
      t('cpb1_protein_structure', 'Protein Architecture', 'Secondary motifs, tertiary folds, quaternary assemblies, the folding funnel, chaperones, and misfolding disease.', 8),
      t('cpb1_protein_binding', 'Proteins at Work: Binding', 'Myoglobin vs hemoglobin, cooperativity and the sigmoidal curve, Bohr effect, 2,3-BPG, fetal hemoglobin, and allostery.', 8),
      t('cpb1_enzymes', 'Enzymes: How Catalysis Happens', 'Activation energy and transition states, active-site catalytic strategies, and cofactors and vitamins as coenzyme precursors.', 8),
      t('cpb1_kinetics', 'Enzyme Kinetics and Inhibition', 'What Km, Vmax, and kcat mean, double-reciprocal reading, the four reversible inhibition patterns, and irreversible inactivation.', 8),
      t('cpb1_enzyme_control', 'Enzyme Control', 'Allosteric regulation and the Hill equation, covalent modification led by phosphorylation, zymogens, feedback in pathways, isozymes, and pH and temperature effects.', 8),
      t('cpb1_carbohydrates', 'Carbohydrates', 'Monosaccharide stereochemistry, ring forms and anomers, glycosidic bonds, storage and structural polysaccharides, and blood-group sugars.', 8),
      t('cpb1_lipids', 'Lipids', 'Fatty acid structure and nomenclature, triacylglycerols, the membrane lipid families, and steroids and fat-soluble vitamins as signals.', 8),
      t('cpb1_membranes', 'Membranes and Transport', 'Bilayer fluidity, integral vs peripheral proteins, passive and facilitated diffusion, primary and secondary active transport, and the Na⁺/K⁺ pump.', 8),
      t('cpb1_nucleotides', 'Nucleotides and Nucleic Acid Structure', 'Purines and pyrimidines, nucleoside and nucleotide naming, the double helix and base pairing, denaturation and hybridization, and ATP, cAMP, and NAD⁺ beyond heredity.', 8),
    ],
  },
  {
    sectionId: 'cars', sectionName: 'Critical Analysis & Reasoning (CARS)',
    topics: [
      t('cars_strategy', 'CARS Strategy & Timing', 'Passage mapping, question prioritization, and time management.'),
      t('cars_humanities', 'Humanities Passages', 'Philosophy, ethics, arts, and literary criticism passages.'),
      t('cars_social', 'Social Science Passages', 'Psychology, sociology, economics, and political science passages.'),
      t('cars_question_types', 'Question Type Mastery', 'Main idea, detail, inference, reasoning beyond the text, and application.'),
    ],
  },
  {
    sectionId: 'bio_biochem', sectionName: 'Biological & Biochemical Foundations',
    topics: [
      t('bb_cell_bio', 'Cell Biology', 'Cell structure, membrane transport, signaling, and the cell cycle.', 15),
      t('bb_molecular', 'Molecular Biology', 'DNA replication, transcription, translation, gene regulation, and biotechnology.', 15),
      t('bb_organ_systems', 'Organ Systems', 'Cardiovascular, respiratory, renal, digestive, nervous, endocrine, immune, and musculoskeletal systems.', 25),
      t('bb_neuron_action_potential', 'Neurons, Action Potentials & Synaptic Transmission', 'Resting potential, depolarization phases, Na+/K+ channel gating, refractory periods, neurotransmitter release, EPSPs/IPSPs. AAMC high-yield gap fill.', 14),
      t('bb_cardio_physiology', 'Cardiovascular Physiology: Output, Preload, Afterload', 'Cardiac output (CO = HR·SV), Frank-Starling, preload/afterload/contractility, baroreceptor reflex, pressure-volume loops. AAMC high-yield gap fill.', 14),
      t('bb_genetics', 'Genetics & Evolution', 'Mendelian genetics, population genetics, Hardy-Weinberg, and natural selection.', 12),
      t('bb_hardy_weinberg', 'Population Genetics & Hardy-Weinberg', 'HWE assumptions, p²+2pq+q² = 1, calculating allele/genotype frequencies, chi-square testing for HWE, linkage. AAMC high-yield gap fill.', 12),
      t('bb_biochem_2', 'Biochemistry II', 'Metabolism, glycolysis, Krebs cycle, oxidative phosphorylation, fatty acid metabolism.', 15),
    ],
  },
  {
    sectionId: 'psych_soc', sectionName: 'Psychological, Social & Biological Foundations',
    topics: [
      t('ps_behavior', 'Behavioral Sciences', 'Learning, memory, cognition, language, emotion, stress, and personality.', 15),
      t('ps_perception', 'Sensation & Perception', 'Visual, auditory, somatosensory processing, and attention.'),
      t('ps_social', 'Social Psychology', 'Attitudes, group dynamics, conformity, obedience, aggression, and prosocial behavior.'),
      t('ps_social_psych_advanced', 'Attribution, Conformity & Bystander Effect', 'Fundamental attribution error, actor-observer bias, Asch/Milgram findings, diffusion of responsibility, group polarization, deindividuation. AAMC high-yield gap fill.', 12),
      t('ps_sociology', 'Sociology', 'Social structures, stratification, demographics, culture, and institutions.'),
      t('ps_identity', 'Self & Identity', 'Self-concept, social identity, identity formation, and stigma.'),
      t('ps_research_methods', 'Research Methods, Statistics & Experimental Design', 'Independent vs dependent variables, randomization, control groups, p-values, Type I/II errors, ANOVA, effect size, confounders, blinding. AAMC high-yield gap fill.', 14),
      t('ps_health', 'Health Disparities & Ethics', 'Healthcare access, SES impacts, bioethics, and research ethics.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// FE MECHANICAL ENGINEERING
// ═══════════════════════════════════════════════════════════════

const FE_ME: ExamCurriculum = [
  {
    sectionId: 'fme_math', sectionName: 'Mathematics (6%)',
    topics: [
      t('fme_calculus', 'Differential & Integral Calculus', 'Limits, derivatives, integrals, series, multivariable calculus, and applications.'),
      t('fme_linear_algebra', 'Linear Algebra', 'Matrices, determinants, eigenvalues, systems of equations, and vector spaces.'),
      t('fme_diffeq', 'Differential Equations', 'First/second order ODEs, Laplace transforms, and initial value problems.'),
      t('fme_vector_calc', 'Vector Calculus', 'Gradient, divergence, curl, line/surface integrals, theorems of Green/Stokes/Gauss.'),
      t('fme_numerical', 'Numerical Methods', 'Root finding (Newton-Raphson, bisection), numerical integration, curve fitting.'),
    ],
  },
  {
    sectionId: 'fme_prob_stats', sectionName: 'Probability & Statistics (4%)',
    topics: [
      t('fme_prob_dist', 'Probability Distributions', 'Binomial, Poisson, normal, exponential; PDF, CDF, expected values.'),
      t('fme_regression', 'Regression & Curve Fitting', 'Linear regression, correlation coefficient, R-squared, least squares.'),
      t('fme_hypothesis', 'Hypothesis Testing & Confidence', 'Type I/II errors, p-values, t-test, chi-square, confidence intervals.'),
    ],
  },
  {
    sectionId: 'fme_comp_tools', sectionName: 'Computational Tools (3%)',
    topics: [
      t('fme_spreadsheets', 'Spreadsheets & Programming', 'Engineering calculations, iterative solutions, and data analysis tools.'),
      t('fme_modeling', 'Modeling & Simulation', 'FEA concepts, CFD basics, and computational approaches to engineering problems.'),
    ],
  },
  {
    sectionId: 'fme_ethics', sectionName: 'Ethics & Professional Practice (4%)',
    topics: [
      t('fme_codes_ethics', 'Codes of Ethics', 'NSPE code, public welfare, conflicts of interest, whistleblowing.'),
      t('fme_licensure', 'Professional Licensure', 'FE/PE path, EIT credentials, state licensure, comity, continuing education.'),
      t('fme_liability', 'Professional Liability & Contracts', 'Standard of care, stamping responsibility, contract types, ethical decisions.'),
    ],
  },
  {
    sectionId: 'fme_eng_econ', sectionName: 'Engineering Economics (4%)',
    topics: [
      t('fme_tvm', 'Time Value of Money', 'Present/future value, annuities, P/A, F/A, A/P factors, effective rates.'),
      t('fme_cost_analysis', 'Cost Analysis & Comparison', 'NPV, IRR, benefit-cost ratio, annual worth, payback period, MARR.'),
      t('fme_depreciation', 'Depreciation', 'Straight-line, MACRS, sum-of-years digits, book value, tax implications.'),
    ],
  },
  {
    sectionId: 'fme_statics', sectionName: 'Statics (8%)',
    topics: [
      t('fme_equilibrium', 'Force Systems & Equilibrium', 'Free-body diagrams, 2D/3D force systems, resultants, moment of a force, couple.'),
      t('fme_trusses', 'Trusses & Frames', 'Method of joints, method of sections, zero-force members, frames and machines.'),
      t('fme_centroids', 'Centroids & Moments of Inertia', 'Center of gravity, centroid of composite shapes, parallel axis theorem.'),
      t('fme_friction', 'Friction', 'Dry friction, wedges, belts, screws, bearings, Coulomb friction model.'),
    ],
  },
  {
    sectionId: 'fme_dynamics', sectionName: 'Dynamics, Kinematics & Vibrations (9%)',
    topics: [
      t('fme_kinematics', 'Kinematics of Particles & Rigid Bodies', 'Rectilinear, curvilinear, projectile, relative motion, rotating frames.'),
      t('fme_kinetics', 'Kinetics & Newton Laws', 'F=ma, work-energy theorem, impulse-momentum, impact, angular momentum.'),
      t('fme_energy_methods', 'Energy Methods', 'Conservation of energy, potential/kinetic energy, power, efficiency.'),
      t('fme_vibrations', 'Mechanical Vibrations', 'Free/forced vibration, damping, natural frequency, resonance, isolation.'),
      t('fme_rigid_body', 'Rigid Body Dynamics', 'Mass moment of inertia, rotation about fixed axis, general plane motion.'),
    ],
  },
  {
    sectionId: 'fme_mechanics', sectionName: 'Mechanics of Materials (8%)',
    topics: [
      t('fme_stress_strain', 'Stress & Strain', 'Normal, shear, bearing stress; Hooke law, Poisson ratio, stress-strain diagrams.'),
      t('fme_axial_torsion', 'Axial Loading & Torsion', 'Deformation, statically indeterminate, torsion of circular shafts, power transmission.'),
      t('fme_beams', 'Beams: Shear, Moment & Deflection', 'Shear/moment diagrams, bending stress, beam deflection methods.'),
      t('fme_combined', 'Combined Loading & Mohr Circle', 'Principal stresses, maximum shear, Mohr circle construction, transformation.'),
      t('fme_columns', 'Columns & Buckling', 'Euler critical load, effective length, slenderness ratio, eccentrically loaded.'),
    ],
  },
  {
    sectionId: 'fme_materials', sectionName: 'Material Science (5%)',
    topics: [
      t('fme_crystal', 'Crystal Structure & Defects', 'Unit cells (BCC, FCC, HCP), Miller indices, defects, diffusion.'),
      t('fme_mech_props', 'Mechanical Properties & Testing', 'Tensile test, yield/ultimate strength, hardness, fatigue, creep, fracture.'),
      t('fme_phase', 'Phase Diagrams & Heat Treatment', 'Iron-carbon diagram, eutectic/eutectoid, lever rule, TTT, quenching.'),
      t('fme_materials_select', 'Material Selection', 'Metals, polymers, ceramics, composites; selection criteria, Ashby charts.'),
    ],
  },
  {
    sectionId: 'fme_fluids', sectionName: 'Fluid Mechanics (8%)',
    topics: [
      t('fme_fluid_statics', 'Fluid Statics', 'Pressure distribution, hydrostatic force on surfaces, buoyancy, manometers.'),
      t('fme_fluid_dynamics', 'Fluid Dynamics & Bernoulli', 'Continuity, Bernoulli equation, energy/momentum equations, Pitot tubes.'),
      t('fme_pipe_flow', 'Internal Flow & Pipe Systems', 'Reynolds number, Darcy-Weisbach, Moody diagram, minor losses, pipe networks.'),
      t('fme_external_flow', 'External Flow & Drag', 'Boundary layers, drag coefficient, lift, flow over bodies.'),
      t('fme_turbomachinery', 'Turbomachinery', 'Pumps, turbines, fans, performance curves, NPSH, specific speed.'),
    ],
  },
  {
    sectionId: 'fme_thermo', sectionName: 'Thermodynamics (8%)',
    topics: [
      t('fme_thermo_laws', 'Laws of Thermodynamics', 'First law (energy balance), second law (entropy), property relations.'),
      t('fme_properties', 'Thermodynamic Properties & Tables', 'Ideal gas law, steam tables, refrigerant tables, quality, superheat.'),
      t('fme_cycles', 'Power & Refrigeration Cycles', 'Carnot, Rankine, Otto, Diesel, Brayton, vapor-compression, COP.'),
      t('fme_mixtures', 'Mixtures & Psychrometrics', 'Gas mixtures, humidity, wet-bulb, psychrometric chart.'),
      t('fme_combustion', 'Combustion & Energy Systems', 'Stoichiometry, air-fuel ratio, heating value, adiabatic flame temperature.'),
    ],
  },
  {
    sectionId: 'fme_heat', sectionName: 'Heat Transfer (7%)',
    topics: [
      t('fme_conduction', 'Conduction', 'Fourier law, thermal resistance, composite walls, fins, transient, Biot number.'),
      t('fme_convection', 'Convection', 'Newton cooling law, forced/natural convection, Nusselt/Reynolds/Prandtl numbers.'),
      t('fme_radiation', 'Radiation', 'Stefan-Boltzmann law, emissivity, view factors, blackbody, radiation networks.'),
      t('fme_exchangers', 'Heat Exchangers', 'LMTD method, NTU-effectiveness, parallel/counter flow, fouling, overall U.'),
    ],
  },
  {
    sectionId: 'fme_controls', sectionName: 'Measurements, Instrumentation & Controls (5%)',
    topics: [
      t('fme_sensors', 'Sensors & Measurement', 'Strain gauges, thermocouples, pressure transducers, flow meters, accuracy.'),
      t('fme_controls_basic', 'Control Systems Fundamentals', 'Block diagrams, transfer functions, feedback, stability, PID control.'),
      t('fme_signal', 'Signal Conditioning & DAQ', 'Amplifiers, filters, A/D conversion, sampling theorem, data acquisition.'),
    ],
  },
  {
    sectionId: 'fme_design', sectionName: 'Mechanical Design & Analysis (9%)',
    topics: [
      t('fme_fasteners', 'Fasteners & Joints', 'Bolted joints, preload, welded connections, adhesive bonds, rivets.'),
      t('fme_bearings', 'Bearings & Lubrication', 'Rolling element bearings, journal bearings, bearing life L10, lubricant selection.'),
      t('fme_gears', 'Gears & Power Transmission', 'Spur, helical, bevel, worm gears; gear trains, speed ratios, efficiency.'),
      t('fme_shafts', 'Shafts & Shaft Design', 'Combined loading, fatigue analysis (Goodman, Soderberg), keyways, critical speed.'),
      t('fme_springs', 'Springs & Mechanical Elements', 'Helical springs, leaf springs, spring rate, energy storage, Wahl factor.'),
      t('fme_fatigue', 'Fatigue & Failure Analysis', 'S-N curves, endurance limit, Miner rule, stress concentration, safety factors.'),
    ],
  },
  {
    sectionId: 'fme_manufacturing', sectionName: 'Manufacturing Processes (4%)',
    topics: [
      t('fme_machining', 'Machining & Material Removal', 'Turning, milling, drilling; cutting speed, feed, MRR, tool life (Taylor).'),
      t('fme_forming', 'Forming & Joining', 'Casting, forging, rolling, extrusion; welding (arc, MIG, TIG), brazing.'),
      t('fme_tolerancing', 'Tolerancing & GD&T', 'Dimensional tolerances, geometric tolerances, fits and clearances, surface finish.'),
    ],
  },
  {
    sectionId: 'fme_management', sectionName: 'Engineering Management (3%)',
    topics: [
      t('fme_project', 'Project Management', 'CPM, PERT, Gantt charts, critical path, resource allocation, scheduling.'),
      t('fme_quality', 'Quality & Reliability', 'Six Sigma, SPC, control charts, reliability, MTBF, FMEA, root cause analysis.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// PE
// ═══════════════════════════════════════════════════════════════

const PE_EE: ExamCurriculum = [
  { sectionId: 'pee_general', sectionName: 'General Power Engineering (9%)', topics: [
    t('pee_power_concepts', 'Power System Fundamentals', 'Single-phase and three-phase power, per-unit system, phasor diagrams, power triangle.', 15),
    t('pee_eng_economics', 'Engineering Economics for Power', 'Life-cycle cost analysis, present worth, benefit-cost ratio for utility projects.'),
    t('pee_reliability', 'System Reliability & Planning', 'SAIDI, SAIFI, CAIDI, LOLP, generation adequacy, capacity planning.'),
  ]},
  { sectionId: 'pee_measurement', sectionName: 'Measurement & Instrumentation (8%)', topics: [
    t('pee_instrument_xformers', 'Instrument Transformers', 'CTs and PTs: burden, accuracy class, ratio correction, polarity, saturation.'),
    t('pee_metering', 'Metering & Power Measurement', 'Wattmeters, VAR meters, demand meters, revenue metering, Blondel theorem.'),
    t('pee_transducers', 'Transducers & Data Acquisition', 'RTDs, thermocouples, strain gauges, SCADA, remote terminal units, PMUs.'),
  ]},
  { sectionId: 'pee_circuits', sectionName: 'Circuit Analysis (10%)', topics: [
    t('pee_dc_ac', 'DC & AC Circuit Analysis', 'KVL, KCL, mesh/nodal analysis, Thevenin/Norton, superposition, phasor methods.', 15),
    t('pee_three_phase', 'Three-Phase Circuit Analysis', 'Balanced and unbalanced systems, Y-Delta, symmetrical components, sequence networks.', 15),
    t('pee_transients', 'Transient Analysis', 'RL, RC, RLC transients, switching surges, TRV, inrush current, time constants.'),
  ]},
  { sectionId: 'pee_rotating', sectionName: 'Rotating Machines & Drives (12%)', topics: [
    t('pee_sync_machines', 'Synchronous Machines', 'Generator operation, excitation, power-angle curve, V-curve, stability limits, parallel operation.', 15),
    t('pee_induction', 'Induction Motors', 'Equivalent circuit, torque-speed curve, slip, efficiency, starting methods, VFD applications.', 15),
    t('pee_dc_machines', 'DC Machines', 'Shunt, series, compound motors/generators, speed control, armature reaction.'),
    t('pee_drives', 'Electric Drives & Motor Control', 'VFDs, soft starters, motor protection, NEC Article 430, duty cycle, service factor.'),
  ]},
  { sectionId: 'pee_electromagnetics', sectionName: 'Electromagnetic Devices (9%)', topics: [
    t('pee_transformers', 'Power Transformers', 'Equivalent circuit, voltage regulation, efficiency, tap changers, connections (Y, Delta, Zigzag).', 15),
    t('pee_special_xformers', 'Special Transformers & Reactors', 'Autotransformers, instrument transformers, current-limiting reactors, grounding transformers.'),
    t('pee_magnetics', 'Magnetic Circuits & Inductors', 'B-H curves, core losses, saturation, air gaps, mutual inductance, energy storage.'),
  ]},
  { sectionId: 'pee_transmission', sectionName: 'Transmission & Distribution (12%)', topics: [
    t('pee_overhead', 'Overhead Transmission Lines', 'Line parameters (R, L, C), ABCD parameters, short/medium/long models, surge impedance loading.', 15),
    t('pee_underground', 'Underground & Cable Systems', 'Cable construction, ampacity (Neher-McGrath), sheath currents, thermal resistance.'),
    t('pee_voltage_reg', 'Voltage Regulation', 'Regulators, LTCs, capacitor banks, Ferranti effect, voltage profiles, VAR compensation.'),
    t('pee_grounding', 'System Grounding', 'Solidly grounded, resistance grounded, ungrounded, reactance grounded, ground fault current.'),
  ]},
  { sectionId: 'pee_protection', sectionName: 'Protection (12%)', topics: [
    t('pee_overcurrent', 'Overcurrent Protection', 'Time-current curves, relay coordination, fuses, reclosers, sectionalizers, pickup/time-dial settings.', 15),
    t('pee_diff_protection', 'Differential Protection', 'Transformer differential, bus differential, generator differential, percentage restraint, slope.'),
    t('pee_distance', 'Distance & Pilot Protection', 'Impedance relays, mho circles, zones, pilot wire, POTT, DCB, transfer trip.'),
    t('pee_fault_analysis', 'Fault Analysis', 'Symmetrical components, three-phase/SLG/LLG/LL faults, fault current calculations, X/R ratio.', 15),
  ]},
  { sectionId: 'pee_power_quality', sectionName: 'Power Quality & Reliability (8%)', topics: [
    t('pee_harmonics', 'Harmonics', 'THD, harmonic sources, IEEE 519 limits, filters (passive/active), K-factor transformers.'),
    t('pee_sags_swells', 'Voltage Sags, Swells & Flicker', 'Causes, magnitude/duration, ITIC curve, mitigation (UPS, DVR, STATCOM).'),
    t('pee_pf_correction', 'Power Factor Correction', 'Capacitor bank sizing, switching transients, harmonic resonance, automatic PF controllers.'),
  ]},
  { sectionId: 'pee_codes', sectionName: 'Codes & Standards (10%)', topics: [
    t('pee_nec', 'National Electrical Code (NEC)', 'Article 210-240 branch circuits, Article 430 motors, Article 450 transformers, Article 480 batteries, grounding (Art 250).', 15),
    t('pee_nesc', 'National Electrical Safety Code (NESC)', 'Clearances, loading districts, strength/loading requirements, supply station rules.'),
    t('pee_ieee_standards', 'IEEE & NFPA Standards', 'IEEE C57 (transformers), IEEE 141/142 (Red/Green book), IEEE 242 (Buff book), NFPA 70E arc flash.'),
  ]},
  { sectionId: 'pee_power_system', sectionName: 'Power System Analysis (10%)', topics: [
    t('pee_load_flow', 'Load Flow Analysis', 'Bus types (slack, PV, PQ), Gauss-Seidel, Newton-Raphson, fast decoupled, contingency analysis.', 15),
    t('pee_stability', 'Power System Stability', 'Transient, steady-state, voltage stability, equal-area criterion, swing equation, PSS.'),
    t('pee_short_circuit', 'Short-Circuit Studies', 'ANSI/IEEE method, momentary vs. interrupting duty, equipment ratings, symmetrical components application.', 15),
    t('pee_economic_dispatch', 'Economic Dispatch & Generation', 'Incremental cost, lambda dispatch, loss coefficients, unit commitment, renewable integration.'),
  ]},
];

// ═══════════════════════════════════════════════════════════════
// SECURITY+
// ═══════════════════════════════════════════════════════════════

const SECURITY_PLUS: ExamCurriculum = [
  // Regrouped to the SY0-701 five-domain blueprint.
  { sectionId: 'general_concepts', sectionName: 'General Security Concepts (12%)', topics: [
    // sp_controls is foundational — placed first so learners build a mental
    // model of WHAT defenses exist before studying what they defend against.
    t('sp_controls', 'Security Control Types & Foundational Concepts', 'Preventive/detective/corrective controls, CIA triad, defense in depth, zero trust, least privilege, separation of duties. SY0-701 objectives 1.1, 1.2.'),
    t('sp_change_mgmt', 'Change & Configuration Management', 'Change advisory board (CAB), RFC, impact analysis, rollback, baselines, configuration drift, version control. SY0-701 objective 1.3.'),
    t('sp_crypto', 'Cryptographic Solutions', 'Symmetric/asymmetric encryption, hashing, PKI, certificates, digital signatures, and TLS. SY0-701 objective 1.4.'),
  ]},
  { sectionId: 'threats_vuln', sectionName: 'Threats, Vulnerabilities & Mitigations (22%)', topics: [
    t('sp_malware', 'Malware Types & Indicators', 'Viruses, worms, trojans, ransomware, rootkits, and fileless malware.'),
    t('sp_social_eng', 'Social Engineering Attacks', 'Phishing, spear phishing, vishing, smishing, pretexting, and watering hole.'),
    t('sp_app_attacks', 'Application Attacks', 'SQL injection, XSS, CSRF, buffer overflow, and directory traversal.'),
    t('sp_network_attacks', 'Network Attacks', 'DoS/DDoS, man-in-the-middle, ARP poisoning, DNS spoofing, and replay attacks.'),
    t('sp_threat_intel', 'Threat Intelligence & Indicators', 'IOCs, threat feeds, STIX/TAXII, and threat hunting.'),
  ]},
  { sectionId: 'architecture', sectionName: 'Security Architecture (18%)', topics: [
    t('sp_network_design', 'Secure Network Design', 'Segmentation, DMZ, VLANs, micro-segmentation, and SD-WAN.'),
    t('sp_cloud', 'Cloud Security', 'IaaS/PaaS/SaaS security, shared responsibility, CASB, and cloud-native controls.'),
    t('sp_virtualization', 'Virtualization & Containerization', 'Hypervisor security, container security, and serverless risks.'),
    t('sp_api_security', 'API Security & Modern Integrations', 'REST, OAuth 2.0, JWT, OWASP API Top 10, API gateways, rate limiting, BOLA/IDOR. SY0-701 objective 3.3.'),
    t('sp_sdlc', 'Secure SDLC & Development Practices', 'SDLC models, secure coding (input validation, parameterized queries, output encoding), SAST/DAST/IAST/SCA, DevSecOps, CI/CD security.'),
    t('sp_backup', 'Resilience, Backup & Disaster Recovery', 'Backup types, RTO, RPO, high availability, and business continuity planning. SY0-701 objective 3.4.'),
  ]},
  { sectionId: 'operations', sectionName: 'Security Operations (28%)', topics: [
    t('sp_hardening', 'System Hardening & Secure Baselines', 'Patch management, baseline configurations, and least privilege.'),
    t('sp_vuln_scanning', 'Vulnerability Management', 'Vulnerability scanners, CVE, CVSS, penetration testing methodologies, and remediation.'),
    t('sp_authentication', 'Identity & Access Management', 'MFA, SSO, OAuth, SAML, LDAP, Kerberos, and RADIUS.'),
    t('sp_endpoint', 'Endpoint Security', 'EDR, antivirus, DLP, application whitelisting, and mobile device management.'),
    t('sp_wireless', 'Wireless Security', 'WPA3, EAP types, evil twin, rogue access points, and Bluetooth attacks.'),
    t('sp_logging', 'Logging & Monitoring', 'SIEM, log aggregation, alerting, and continuous monitoring.'),
    t('sp_incident', 'Incident Response', 'IR process, containment, eradication, recovery, and lessons learned.'),
    t('sp_forensics', 'Digital Forensics', 'Evidence collection, chain of custody, imaging, and analysis tools.'),
  ]},
  { sectionId: 'program_mgmt', sectionName: 'Security Program Management & Oversight (20%)', topics: [
    t('sp_frameworks', 'Security Frameworks & Governance', 'NIST CSF/RMF, ISO 27001, CIS Controls, and governance structures.'),
    t('sp_policies', 'Policies & Procedures', 'AUPs, change management, separation of duties, and data classification.'),
    t('sp_risk', 'Risk Management', 'Risk assessment, risk register, quantitative/qualitative analysis, and risk treatment.'),
    t('sp_third_party', 'Third-Party Risk Management', 'Vendor risk assessment, SOC 2 reports, SLAs/MSAs/MOUs, right-to-audit, supply chain security, SBOM. SY0-701 objective 5.3.'),
    t('sp_compliance', 'Compliance & Regulations', 'GDPR, HIPAA, PCI-DSS, SOX, and FISMA.'),
    t('sp_audit', 'Audits, Assessments & Compliance Validation', 'Audit types (internal/external/compliance/attestation), SOC 1/2, ISO 27001 certification, PCI-DSS QSA, HIPAA OCR audits, audit lifecycle. SY0-701 objective 5.5.'),
    t('sp_awareness', 'Security Awareness & Training Programs', 'Program design, phishing simulation, role-based training, KPIs, insider threat awareness, building security culture. SY0-701 objective 5.6.'),
  ]},
];

// ═══════════════════════════════════════════════════════════════
// CISSP
// ═══════════════════════════════════════════════════════════════

const CISSP: ExamCurriculum = [
  { sectionId: 'security_risk', sectionName: 'Security & Risk Management', topics: [
    t('cissp_governance', 'Security Governance', 'Security policies, standards, procedures, and organizational roles.', 15),
    t('cissp_risk_mgmt', 'Risk Management', 'Risk identification, analysis (quantitative & qualitative), treatment, and monitoring.', 15),
    t('cissp_compliance', 'Compliance & Legal', 'Regulations (GDPR, HIPAA), intellectual property, privacy, and investigations.'),
    t('cissp_bcdr', 'Business Continuity & DR', 'BIA, BCP, DRP, testing, and recovery strategies.'),
    t('cissp_personnel', 'Personnel Security', 'Hiring, training, termination, and third-party management.'),
  ]},
  { sectionId: 'asset_security', sectionName: 'Asset Security', topics: [
    t('cissp_data_class', 'Data Classification & Handling', 'Classification levels, labeling, retention, and destruction.'),
    t('cissp_privacy', 'Privacy Protection', 'Data ownership, privacy controls, and data lifecycle management.'),
    t('cissp_data_lifecycle', 'Data States & Lifecycle', 'Data states (rest/transit/use), sanitization (DoD 5220.22-M, NIST 800-88), retention, secure deletion, media destruction. CBK D2 gap fix.'),
  ]},
  { sectionId: 'security_architecture', sectionName: 'Security Architecture & Engineering', topics: [
    t('cissp_models', 'Security Models & Frameworks', 'Bell-LaPadula, Biba, Clark-Wilson, and Brewer-Nash models.'),
    t('cissp_security_models_deep', 'Security Models In-Depth', 'Bell-LaPadula (no-read-up, no-write-down), Biba (no-read-down, no-write-up), Clark-Wilson (well-formed transactions), Brewer-Nash (Chinese Wall). State machine, lattice, access matrix. CBK D3 expansion.'),
    t('cissp_crypto', 'Cryptography', 'Symmetric, asymmetric, hashing, PKI, digital signatures, and key management.', 18),
    t('cissp_crypto_advanced', 'Advanced Cryptography & Key Management', 'Kerberos 5-step exchange, X.509 cert fields, ECDSA, post-quantum readiness, HSMs, key escrow vs key recovery, M-of-N. CBK D3 expansion.'),
    t('cissp_evaluation', 'Evaluation Criteria & Assurance', 'Common Criteria (EAL1-7), Protection Profiles, Security Targets, TCSEC (Orange Book), ITSEC, FIPS 140-3. CBK D3 gap fix.'),
    t('cissp_physical', 'Physical Security', 'Site selection, perimeter, surveillance, environmental controls, and fire suppression.'),
    t('cissp_secure_design', 'Secure Design Principles', 'Defense in depth, least privilege, separation of duties, and fail-safe defaults.'),
  ]},
  { sectionId: 'comm_network', sectionName: 'Communication & Network Security', topics: [
    t('cissp_network', 'Network Architecture', 'OSI/TCP-IP models, segmentation, SDN, and network devices.'),
    t('cissp_protocols', 'Secure Communications', 'TLS, IPSec, VPNs, SSH, and secure email protocols.'),
    t('cissp_wireless_net', 'Wireless & Remote Access', 'WPA3, 802.1X, remote access technologies, and telecommuting security.'),
    t('cissp_network_attacks', 'Network Attacks & Countermeasures', 'Spoofing, sniffing, DDoS, and network IDS/IPS.'),
  ]},
  { sectionId: 'iam', sectionName: 'Identity & Access Management (IAM)', topics: [
    t('cissp_auth', 'Authentication Methods', 'Knowledge, possession, biometric factors, and multi-factor authentication.'),
    t('cissp_access_control', 'Access Control Models', 'DAC, MAC, RBAC, ABAC, and rule-based access control.'),
    t('cissp_identity', 'Identity Management', 'Provisioning, federation, SSO, credential management, and session management.'),
    t('cissp_iam_attacks', 'IAM Attacks', 'Credential stuffing, pass-the-hash, privilege escalation, and Kerberoasting.'),
  ]},
  { sectionId: 'security_assessment', sectionName: 'Security Assessment & Testing', topics: [
    t('cissp_vuln', 'Vulnerability Assessment', 'Scanning, penetration testing, and red/blue/purple team exercises.'),
    t('cissp_audit', 'Security Auditing', 'Audit types, log review, SOC reports, and compliance testing.'),
    t('cissp_testing', 'Software Testing', 'SAST, DAST, fuzzing, code review, and security test planning.'),
    t('cissp_testing_taxonomy', 'Testing Tool Taxonomy & Strategies', 'SAST vs DAST vs IAST vs SCA distinctions, misuse case testing, synthetic transactions, interface testing, test coverage analysis, fuzzing strategies. CBK D6 gap fix.'),
  ]},
  { sectionId: 'security_operations', sectionName: 'Security Operations', topics: [
    t('cissp_ir', 'Incident Management', 'Detection, response, containment, recovery, and post-incident review.', 15),
    t('cissp_investigations', 'Investigations & Evidence', 'Forensics, chain of custody, e-discovery, and evidence handling.'),
    t('cissp_forensics_legal', 'Forensics & Legal Evidence Standards', 'Daubert standard, Frye test, Federal Rules of Evidence, regulatory investigations (SEC/FINRA/FBI), eDiscovery ESI requirements, sworn affidavits. CBK D7 gap fix.'),
    t('cissp_operations', 'Operational Security', 'Patch management, change management, configuration management, and monitoring.'),
    t('cissp_disaster', 'Disaster Recovery Operations', 'Recovery sites, backup strategies, and recovery testing.'),
  ]},
  { sectionId: 'software_security', sectionName: 'Software Development Security', topics: [
    t('cissp_sdlc', 'Secure SDLC', 'Security in requirements, design, implementation, testing, and deployment.'),
    t('cissp_app_vuln', 'Application Vulnerabilities', 'OWASP Top 10, injection, XSS, insecure deserialization, and API security.'),
    t('cissp_owasp_patterns', 'OWASP Top 10 Patterns & Defenses', 'OWASP Top 10 (2021/2024) per-item attack patterns and prevention. CWE/CVSS mapping, injection/XSS/deserialization defenses, secure coding patterns. CBK D8 expansion.'),
    t('cissp_devops', 'DevSecOps', 'CI/CD security, infrastructure as code, container security, and supply chain.'),
  ]},
];

// ═══════════════════════════════════════════════════════════════
// FE ELECTRICAL & COMPUTER
// ═══════════════════════════════════════════════════════════════

// Section names carry no percentage: the exam weight is stated once, by
// exam-config.ts, from the NCEES published specification. Percentages
// baked into these labels were a second source that disagreed with it.
const FE_EE: ExamCurriculum = [
  {
    sectionId: 'fee_math', sectionName: 'Mathematics',
    topics: [
      t('fee_reference_handbook', 'NCEES Reference Handbook Navigation', 'Layout of the official FE Reference Handbook, where to find formula sheets quickly, common pages bookmarked by section, time-saving navigation strategy. NCEES gap fix (exam strategy, not content).'),
      t('fee_algebra_trig', 'Algebra & Trigonometry', 'Quadratic formula, trig identities, polar/rectangular conversion, unit circle.'),
      t('fee_complex', 'Complex Numbers', 'Euler formula, magnitude, phasor representation, conjugate operations.'),
      t('fee_discrete_math', 'Discrete Math', 'Combinations, permutations, counting principles.'),
      t('fee_analytic_geom', 'Analytic Geometry', 'Distance formula, slopes, conic sections, coordinate systems.'),
      t('fee_diff_calc', 'Differential Calculus', 'Derivatives, product/chain rule, maxima/minima, implicit differentiation.'),
      t('fee_int_calc', 'Integral Calculus', 'Definite and indefinite integrals, integration techniques, area under curves.'),
      t('fee_diffeq', 'Differential Equations', 'First/second order ODEs, Laplace transforms, initial value problems.'),
      t('fee_linear_algebra', 'Linear Algebra', 'Determinants, matrix operations, eigenvalues, systems of equations.'),
      t('fee_vector_analysis', 'Vector Analysis', 'Dot/cross product, gradient, divergence, curl.'),
    ],
  },
  {
    sectionId: 'fee_prob_stats', sectionName: 'Probability & Statistics',
    topics: [
      t('fee_prob_dist', 'Probability Distributions', 'Binomial, Poisson, normal, exponential; CDF and PDF.'),
      t('fee_expected_values', 'Expected Values & Variance', 'Mean, variance, standard deviation, moments.'),
      t('fee_regression', 'Regression', 'Linear regression, R-squared, residuals, correlation coefficient.'),
      t('fee_hypothesis', 'Hypothesis Testing', 'Type I/II errors, p-values, confidence intervals, t-test, chi-square.'),
    ],
  },
  {
    sectionId: 'fee_ethics', sectionName: 'Ethics & Professional Practice',
    topics: [
      t('fee_codes_ethics', 'Codes of Ethics', 'NSPE code, public welfare, conflicts of interest, whistleblowing.'),
      t('fee_licensure', 'Professional Licensure', 'FE/PE path, EIT credentials, state licensure, comity.'),
      t('fee_liability', 'Professional Liability', 'Standard of care, stamping responsibility, ethical decision framework.'),
    ],
  },
  {
    sectionId: 'fee_eng_econ', sectionName: 'Engineering Economics',
    topics: [
      t('fee_tvm', 'Time Value of Money', 'Present/future value, annuities, P/A, F/A, A/P factors.'),
      t('fee_cost_analysis', 'Cost Analysis & Comparison', 'NPV, IRR, benefit-cost ratio, annual worth, payback period.'),
      t('fee_depreciation', 'Depreciation', 'Straight-line, MACRS, sum-of-years digits, book value.'),
    ],
  },
  {
    sectionId: 'fee_materials', sectionName: 'Electrical Materials',
    topics: [
      t('fee_conductors', 'Conductors & Resistivity', 'Resistivity, temperature coefficient, wire gauge, conductivity.'),
      t('fee_semiconductors', 'Semiconductors & Band Gap', 'Band structure, doping (n-type/p-type), carrier concentration.'),
      t('fee_dielectrics', 'Dielectrics & Insulators', 'Dielectric constant, breakdown voltage, permittivity, polarization.'),
      t('fee_magnetic_mat', 'Magnetic Materials', 'Permeability, B-H curves, hysteresis, ferromagnetism, Curie temperature.'),
    ],
  },
  {
    sectionId: 'fee_eng_sci', sectionName: 'Engineering Sciences',
    topics: [
      t('fee_work_energy', 'Work, Energy & Power', 'Mechanical/electrical work, efficiency, energy conservation.'),
      t('fee_charge_current', 'Charge, Current, Voltage & Power', 'Coulomb law, Ohm law, power dissipation, RMS values.'),
      t('fee_electromech', 'Electromechanical Conversion', 'Motors, generators, Lorentz force, torque, back-EMF.'),
    ],
  },
  {
    sectionId: 'fee_circuits', sectionName: 'Circuit Analysis — DC & AC',
    topics: [
      t('fee_dc_fundamentals', 'DC Fundamentals: Ohm, KCL, KVL', 'Series/parallel, voltage/current dividers, source transformation.'),
      t('fee_network_theorems', 'Network Theorems', 'Thevenin, Norton, superposition, maximum power transfer.'),
      t('fee_ac_phasors', 'AC Steady-State: Phasors & Impedance', 'Phasor representation, impedance (R, L, C), admittance, frequency dependence.'),
      t('fee_ac_power', 'AC Power Analysis', 'Real, reactive, apparent power, power factor, power triangle, correction.'),
      t('fee_resonance', 'Resonance & Frequency Response', 'Series/parallel resonance, Q factor, bandwidth, Bode plots.'),
      t('fee_three_phase', 'Three-Phase Circuits', 'Y and Delta connections, line/phase relationships, three-phase power.'),
      t('fee_transients', 'Transient Analysis: RC, RL, RLC', 'Time constants, step response, damping ratio, natural frequency.'),
    ],
  },
  {
    sectionId: 'fee_linear_sys', sectionName: 'Linear Systems',
    topics: [
      t('fee_time_domain', 'Time Domain Analysis', 'Impulse/step response, convolution, causality, LTI systems.'),
      t('fee_freq_domain', 'Frequency Domain Analysis', 'Fourier/Laplace transforms, Bode magnitude/phase, frequency response.'),
      t('fee_bode_sketching', 'Bode Plot Sketching Techniques', 'Asymptotic magnitude/phase rules, decade/octave slopes, corner frequencies, gain/phase margins. NCEES gap fix.'),
      t('fee_transfer_func', 'Transfer Functions & Stability', 'Poles, zeros, BIBO stability, partial fractions, DC gain.'),
      t('fee_z_transforms', 'Z-Transforms & Discrete Systems', 'Z-transform pairs, discrete stability (unit circle), sampling.'),
    ],
  },
  {
    sectionId: 'fee_signal_proc', sectionName: 'Signal Processing',
    topics: [
      t('fee_fourier', 'Fourier Series & Transform', 'Periodic decomposition, continuous spectrum, Parseval theorem.'),
      t('fee_sampling', 'Sampling Theorem & Aliasing', 'Nyquist rate, anti-aliasing filters, reconstruction.'),
      t('fee_signal_nyquist', 'Nyquist Criterion & Aliasing Pitfalls', 'Nyquist rate vs frequency, aliasing math, anti-aliasing filter design, reconstruction error, oversampling. NCEES gap fix.'),
      t('fee_filters', 'Analog Filters', 'LP, HP, BP, BS; Butterworth, Chebyshev; roll-off, cutoff frequency.'),
      t('fee_dft_fft', 'DFT, FFT & Windowing', 'Discrete Fourier transform, FFT algorithm, spectral leakage, window functions.'),
    ],
  },
  {
    sectionId: 'fee_electronics', sectionName: 'Electronics',
    topics: [
      t('fee_diodes', 'Diode Circuits', 'Rectifiers (half/full wave), Zener regulators, Shockley equation.'),
      t('fee_bjt', 'BJT Analysis & Amplifiers', 'CE/CC/CB configurations, biasing, small-signal model, gain.'),
      t('fee_mosfet', 'MOSFET Circuits', 'Enhancement/depletion, saturation/triode, CS/CD/CG amplifiers.'),
      t('fee_opamp', 'Operational Amplifiers', 'Inverting, non-inverting, summing, integrator, differentiator, comparator.'),
      t('fee_power_elec', 'Power Electronics', 'Buck, boost converters, duty cycle, PWM, inverters, rectifiers.'),
    ],
  },
  {
    sectionId: 'fee_power_sys', sectionName: 'Power Systems',
    topics: [
      t('fee_3phase_power', 'Three-Phase Power Systems', 'Balanced systems, per-phase analysis, Y-Delta conversion.'),
      t('fee_transformers', 'Transformers', 'Turns ratio, equivalent circuit, voltage regulation, efficiency.'),
      t('fee_per_unit', 'Per-Unit System', 'Base values, impedance normalization, fault calculations.'),
      t('fee_tx_lines', 'Transmission Lines', 'Short/medium/long models, surge impedance, voltage drop.'),
      t('fee_pf_correction', 'Power Factor Correction', 'Capacitor sizing, reactive power compensation.'),
      t('fee_power_faults', 'Fault Analysis & Symmetrical Components', 'Three-phase / single-line-to-ground / line-to-line / double-line-to-ground faults, positive/negative/zero sequence components, fault current calculation. NCEES gap fix.'),
      t('fee_motors', 'Rotating Machines', 'Induction motors (slip, torque), synchronous machines, DC motors.'),
    ],
  },
  {
    sectionId: 'fee_electromagnetics', sectionName: 'Electromagnetics',
    topics: [
      t('fee_electrostatics', 'Electrostatics', 'Coulomb law, Gauss law, electric field, potential, capacitance.'),
      t('fee_magnetostatics', 'Magnetostatics', 'Biot-Savart, Ampere law, solenoids, inductance, force on conductors.'),
      t('fee_maxwell', 'Maxwell Equations', 'Gauss, Faraday, Ampere-Maxwell; differential and integral forms.'),
      t('fee_wave_prop', 'Wave Propagation', 'Plane waves, wavelength, skin depth, Poynting vector.'),
      t('fee_em_tx_lines', 'Transmission Lines (EM)', 'Characteristic impedance, reflection coefficient, VSWR, matching.'),
    ],
  },
  {
    sectionId: 'fee_control', sectionName: 'Control Systems',
    topics: [
      t('fee_block_diagrams', 'Block Diagrams & Transfer Functions', 'Series/parallel/feedback reduction, Mason gain formula.'),
      t('fee_stability', 'Stability Analysis', 'Routh-Hurwitz criterion, characteristic equation, BIBO stability.'),
      t('fee_root_locus', 'Root Locus', 'Plotting rules, asymptotes, breakaway points, gain selection.'),
      t('fee_pzmap_analysis', 'Pole-Zero Maps & Dynamic Response', 'Pole locations vs time response (damping/oscillation/decay), zero effects, pole-zero cancellation, second-order system characterization (ωn, ζ). NCEES gap fix.'),
      t('fee_bode_nyquist', 'Bode & Nyquist Plots', 'Gain/phase margins, crossover frequencies, Nyquist stability.'),
      t('fee_pid', 'PID Controllers', 'P, I, D actions, Ziegler-Nichols tuning, anti-windup.'),
      t('fee_time_specs', 'Time Domain Specifications', 'Overshoot, settling time, rise time, steady-state error, system type.'),
    ],
  },
  {
    sectionId: 'fee_comms', sectionName: 'Communications',
    topics: [
      t('fee_am_fm', 'Analog Modulation (AM/FM)', 'AM bandwidth, modulation index, FM deviation, Carson rule.'),
      t('fee_digital_mod', 'Digital Modulation', 'ASK, FSK, PSK, QPSK, QAM, spectral efficiency, BER.'),
      t('fee_noise_snr', 'Noise & SNR', 'Thermal noise, noise figure, cascade formula, signal-to-noise ratio.'),
      t('fee_channel_cap', 'Channel Capacity', 'Shannon-Hartley theorem, bandwidth, Eb/N0.'),
      t('fee_comms_shannon', 'Shannon-Hartley Capacity & Link Budgets', 'Shannon limit C = B log₂(1+S/N), Eb/N0 vs BER curves, link budget (TX power, path loss, RX sensitivity), free-space path loss, fade margin. NCEES gap fix.'),
      t('fee_multiplexing', 'Multiplexing', 'FDM, TDM, CDM/CDMA, WDM; guard bands, time slots, spreading codes.'),
    ],
  },
  {
    sectionId: 'fee_networks', sectionName: 'Computer Networks',
    topics: [
      t('fee_osi_tcpip', 'OSI & TCP/IP Models', 'Seven layers, encapsulation, protocols, port numbers.'),
      t('fee_ip_subnetting', 'IP Addressing & Subnetting', 'IPv4, CIDR, subnet masks, usable hosts, broadcast address.'),
      t('fee_topologies', 'Network Topologies', 'Star, ring, mesh, bus; link counts, resilience, scalability.'),
      t('fee_net_security', 'Network Security', 'Firewalls, encryption (symmetric/asymmetric), VPN, SSL/TLS.'),
      t('fee_net_perf', 'Network Performance', 'Throughput, latency, jitter, packet loss, bandwidth-delay product.'),
    ],
  },
  {
    sectionId: 'fee_digital', sectionName: 'Digital Systems',
    topics: [
      t('fee_number_sys', 'Number Systems & Boolean Algebra', 'Binary/hex/octal, DeMorgan, K-maps, simplification.'),
      t('fee_comb_logic', 'Combinational Logic', 'MUX, decoders, encoders, adders, subtractors.'),
      t('fee_seq_logic', 'Sequential Logic', 'Flip-flops (D, JK, T, SR), counters, shift registers.'),
      t('fee_state_machines', 'State Machines', 'Moore vs Mealy, state tables, minimum flip-flops.'),
      t('fee_memory', 'Memory Systems', 'ROM, RAM, SRAM vs DRAM, cache, FPGA basics.'),
    ],
  },
  {
    sectionId: 'fee_comp_sys', sectionName: 'Computer Systems',
    topics: [
      t('fee_architecture', 'Computer Architecture', 'Von Neumann vs Harvard, RISC vs CISC, pipelining.'),
      t('fee_mem_hierarchy', 'Memory Hierarchy & Cache', 'Cache hit/miss, virtual memory, locality, EMAT.'),
      t('fee_io_interfacing', 'I/O & Interfacing', 'DMA, interrupts, bus protocols (I2C, SPI, USB, PCIe).'),
      t('fee_performance', 'Performance Metrics', 'CPI, MIPS, Amdahl law, execution time, throughput.'),
    ],
  },
  {
    sectionId: 'fee_software', sectionName: 'Software Development',
    topics: [
      t('fee_algorithms', 'Algorithms & Complexity', 'Big-O, binary search, sorting (merge, quick, bubble), recursion.'),
      t('fee_data_structures', 'Data Structures', 'Arrays, linked lists, stacks, queues, trees, hash tables.'),
      t('fee_oop', 'OOP & Programming Concepts', 'Encapsulation, inheritance, polymorphism, functional programming.'),
      t('fee_sdlc', 'Software Engineering & Testing', 'SDLC, Agile/Waterfall, unit/integration testing, version control.'),
      t('fee_databases', 'Databases & SQL', 'Relational model, normalization (1NF-3NF), ACID, basic SQL queries.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// NCLEX-RN (2026 test plan, frozen through 2029-03-31)
// ═══════════════════════════════════════════════════════════════

const NCLEX_RN: ExamCurriculum = [
  {
    sectionId: 'foundations', sectionName: 'How the NCLEX Works',
    topics: [
      t('nx_ngn_exam', 'The NGN Exam & CAT Strategy', 'Variable-length CAT (85-150 items, 5 hours), the six NGN item types, partial-credit scoring, and how the 0.00-logit standard decides pass/fail.', 14),
      t('nx_clinical_judgment', 'The Clinical Judgment Model', 'The six NCJMM steps behind every case study: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, evaluate outcomes.', 15),
    ],
  },
  {
    sectionId: 'mgmt_of_care', sectionName: 'Management of Care',
    topics: [
      t('nx_prioritization', 'Prioritization, Delegation & Assignment', 'Who to see first, what an RN can delegate to an LPN or AP, and the frameworks (ABC, Maslow, acute-vs-chronic, stable-vs-unstable) the exam expects.', 16),
      t('nx_legal_ethical', 'Legal & Ethical Practice', 'Informed consent, advance directives, confidentiality and HIPAA, incident reporting, and refusing an unsafe assignment.', 13),
    ],
  },
  {
    sectionId: 'safety_infection', sectionName: 'Safety & Infection Control',
    topics: [
      t('nx_infection_control', 'Infection Control & Precautions', 'Standard, contact, droplet, and airborne precautions; which diseases go with which; PPE donning and doffing order.', 14),
      t('nx_client_safety', 'Client Safety & Error Prevention', 'Falls, restraints and the orders they require, fire response (RACE/PASS), and the systems view of medication-error prevention.', 13),
    ],
  },
  {
    sectionId: 'health_promotion', sectionName: 'Health Promotion & Maintenance',
    topics: [
      t('nx_lifespan', 'Growth & Development Across the Lifespan', 'Milestones, developmental stages, immunization schedules, and age-appropriate screening the exam actually tests.', 14),
      t('nx_maternal_newborn', 'Maternal & Newborn Care', 'Antepartum through postpartum: fetal monitoring basics, labor stages, postpartum assessment, and normal newborn findings.', 16),
    ],
  },
  {
    sectionId: 'psychosocial', sectionName: 'Psychosocial Integrity',
    topics: [
      t('nx_therapeutic_comm', 'Therapeutic Communication & Mental Health', 'What a therapeutic response looks like, crisis intervention, suicide risk, abuse and neglect reporting, and substance withdrawal.', 15),
    ],
  },
  {
    sectionId: 'basic_care', sectionName: 'Basic Care & Comfort',
    topics: [
      t('nx_basic_care', 'Mobility, Nutrition & Elimination', 'Positioning, assistive devices, pressure-injury staging and prevention, therapeutic diets, tube feeding, and elimination care.', 14),
    ],
  },
  {
    sectionId: 'pharm_parenteral', sectionName: 'Pharmacological & Parenteral Therapies',
    topics: [
      t('nx_dosage_calc', 'Dosage Calculation & Med Math', 'Every calculation family on the exam: tablets and liquids, weight-based dosing, IV mL/hr and gtt/min, reconstitution, safe-dose ranges, and infusion time. Fully worked methods, not shortcuts.', 18),
      t('nx_pharm_principles', 'Pharmacology Principles & High-Alert Meds', 'Rights of administration, drug-class prototypes, therapeutic levels, antidotes, and the high-alert medications that end careers when they go wrong.', 16),
      t('nx_iv_therapy', 'IV Therapy, Blood Products & Parenteral Nutrition', 'Peripheral and central lines, complication recognition, transfusion reactions and the response sequence, and TPN rules.', 14),
    ],
  },
  {
    sectionId: 'reduction_risk', sectionName: 'Reduction of Risk Potential',
    topics: [
      t('nx_lab_values', 'Laboratory Values & Diagnostics', 'The reference ranges worth memorizing, what deviations mean, and nursing actions for critical values.', 15),
      t('nx_periop', 'Perioperative & Procedure Care', 'Pre-op checklists and consent, post-op complication windows, and monitoring after common procedures.', 13),
    ],
  },
  {
    sectionId: 'physio_adaptation', sectionName: 'Physiological Adaptation',
    topics: [
      t('nx_fluid_electrolyte', 'Fluids, Electrolytes & Acid-Base', 'The big six electrolytes with causes and ECG changes, ABG interpretation with a reliable method, and IV fluid tonicity.', 16),
      t('nx_emergencies', 'Medical Emergencies & Unexpected Responses', 'Recognition-and-first-action for the emergencies the exam loves: anaphylaxis, compartment syndrome, autonomic dysreflexia, malignant hyperthermia, and more.', 15),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════════

export const EXAM_CURRICULA: Record<string, ExamCurriculum> = {
  SAT, GRE, LSAT, PATENT_BAR, MCAT, FE_ME, FE_EE, PE_EE, SECURITY_PLUS, CISSP, NCLEX_RN,
};

export function getCurriculum(examType: string): ExamCurriculum {
  return EXAM_CURRICULA[examType] || [];
}

export function getTotalTopics(examType: string): number {
  return getCurriculum(examType).reduce((sum, sec) => sum + sec.topics.length, 0);
}

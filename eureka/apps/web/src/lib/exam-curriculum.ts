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
// GRE
// ═══════════════════════════════════════════════════════════════

const GRE: ExamCurriculum = [
  {
    sectionId: 'quantitative', sectionName: 'Quantitative Reasoning',
    topics: [
      t('quant_arithmetic', 'Arithmetic & Number Properties', 'Integers, fractions, decimals, primes, divisibility, and remainders.'),
      t('quant_algebra', 'Algebra & Equations', 'Linear and quadratic equations, inequalities, absolute value, and functions.'),
      t('quant_word', 'Word Problems & Translations', 'Translate word problems into equations; rates, work, mixture, and age problems.'),
      t('quant_geometry', 'Geometry', 'Lines, angles, triangles, quadrilaterals, circles, area, perimeter, and volume.'),
      t('quant_coordinate', 'Coordinate Geometry', 'Slope, distance, midpoint, and graphing equations in the xy-plane.'),
      t('quant_data', 'Data Analysis & Statistics', 'Mean, median, mode, range, standard deviation, percentiles, and distributions.'),
      t('quant_probability', 'Counting & Probability', 'Permutations, combinations, probability rules, and expected value.'),
      t('quant_comparison', 'Quantitative Comparison Strategies', 'Techniques for comparing quantities: plugging in, estimation, and algebraic simplification.'),
    ],
  },
  {
    sectionId: 'verbal', sectionName: 'Verbal Reasoning',
    topics: [
      t('verb_text_completion', 'Text Completion', 'Fill in blanks using context clues, structural signals, and vocabulary knowledge.'),
      t('verb_sentence_equiv', 'Sentence Equivalence', 'Identify pairs of words that complete sentences with equivalent meaning.'),
      t('verb_reading_comp', 'Reading Comprehension', 'Analyze passages: main idea, inference, function, author tone and perspective.'),
      t('verb_critical_reasoning', 'Critical Reasoning', 'Strengthen/weaken arguments, identify assumptions, and evaluate conclusions.'),
      t('verb_vocabulary', 'High-Frequency Vocabulary', 'Master the most tested GRE vocabulary words organized by difficulty.'),
      t('verb_passage_types', 'Passage Types & Strategies', 'Approach science, humanities, and social science passages efficiently.'),
    ],
  },
  {
    sectionId: 'writing', sectionName: 'Analytical Writing',
    topics: [
      t('aw_issue', 'Analyze an Issue', 'Develop a position on a given topic with reasoning and examples.'),
      t('aw_argument', 'Analyze an Argument', 'Evaluate the logic of an argument and identify logical fallacies.'),
      t('aw_structure', 'Essay Structure & Templates', 'Organize essays with thesis, body paragraphs, and conclusion templates.'),
      t('aw_scoring', 'Scoring Rubric & Sample Essays', 'Understand what graders look for and study scored sample essays.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// GMAT
// ═══════════════════════════════════════════════════════════════

const GMAT: ExamCurriculum = [
  {
    sectionId: 'quantitative', sectionName: 'Quantitative Reasoning',
    topics: [
      t('gq_problem_solving', 'Problem Solving', 'Arithmetic, algebra, and geometry problem-solving strategies.'),
      t('gq_number_props', 'Number Properties', 'Primes, factors, multiples, remainders, and divisibility rules.'),
      t('gq_algebra', 'Algebra & Inequalities', 'Linear and quadratic equations, systems, and inequality manipulation.'),
      t('gq_word_problems', 'Word Problems', 'Rates, work, mixtures, overlapping sets, and profit/loss.'),
      t('gq_geometry', 'Geometry', 'Triangles, circles, coordinate geometry, and 3D shapes.'),
      t('gq_data_sufficiency', 'Data Sufficiency', 'Evaluate whether given data is sufficient to answer a question.'),
    ],
  },
  {
    sectionId: 'verbal', sectionName: 'Verbal Reasoning',
    topics: [
      t('gv_reading_comp', 'Reading Comprehension', 'Main idea, inference, detail, structure, and tone questions.'),
      t('gv_critical_reasoning', 'Critical Reasoning', 'Strengthen, weaken, assumption, inference, and evaluate arguments.'),
      t('gv_sentence_correction', 'Sentence Correction', 'Grammar rules: subject-verb agreement, parallelism, modifiers, idioms.'),
    ],
  },
  {
    sectionId: 'data_insights', sectionName: 'Data Insights',
    topics: [
      t('gd_graphs_tables', 'Graphs & Table Interpretation', 'Read and analyze bar charts, line graphs, scatter plots, and tables.'),
      t('gd_multi_source', 'Multi-Source Reasoning', 'Synthesize data from multiple sources to answer questions.'),
      t('gd_two_part', 'Two-Part Analysis', 'Solve problems requiring two related answers simultaneously.'),
      t('gd_data_sufficiency_di', 'Data Sufficiency (DI)', 'Combined quantitative and verbal data sufficiency.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// LSAT
// ═══════════════════════════════════════════════════════════════

const LSAT: ExamCurriculum = [
  {
    sectionId: 'logical_reasoning', sectionName: 'Logical Reasoning',
    topics: [
      t('lr_arguments', 'Argument Structure', 'Identify premises, conclusions, assumptions, and intermediate conclusions.'),
      t('lr_strengthen_weaken', 'Strengthen & Weaken', 'Evaluate answer choices that make arguments more or less convincing.'),
      t('lr_assumptions', 'Necessary & Sufficient Assumptions', 'Find the unstated assumption required for an argument to hold.'),
      t('lr_flaws', 'Flaw Questions', 'Identify logical fallacies: ad hominem, false dichotomy, circular reasoning, etc.'),
      t('lr_inferences', 'Inferences & Must Be True', 'Determine what can be logically concluded from a set of statements.'),
      t('lr_parallel', 'Parallel Reasoning', 'Match the logical structure of an argument to a similar argument.'),
      t('lr_method', 'Method of Reasoning', 'Describe the role of a claim in an argument structure.'),
      t('lr_resolve', 'Resolve the Paradox', 'Find the explanation that reconciles two seemingly contradictory facts.'),
      t('lr_principle', 'Principle Questions', 'Apply general principles to specific situations and vice versa.'),
    ],
  },
  {
    sectionId: 'analytical_reasoning', sectionName: 'Analytical Reasoning (Logic Games)',
    topics: [
      t('ar_sequencing', 'Sequencing Games', 'Order elements in a line; basic and advanced linear ordering.'),
      t('ar_grouping', 'Grouping Games', 'Assign elements to groups with inclusion/exclusion constraints.'),
      t('ar_matching', 'Matching & Distribution', 'Match attributes to elements or distribute items into categories.'),
      t('ar_hybrid', 'Hybrid Games', 'Combine sequencing and grouping in a single game.'),
      t('ar_diagramming', 'Diagramming & Notation', 'Create efficient diagrams and use shorthand notation for constraints.'),
      t('ar_conditional', 'Conditional Logic', 'If-then statements, contrapositives, and chains of conditionals.'),
      t('ar_advanced', 'Advanced Deductions', 'Make inferences by combining multiple rules to derive must-be-true facts.'),
    ],
  },
  {
    sectionId: 'reading_comprehension', sectionName: 'Reading Comprehension',
    topics: [
      t('rc_main_point', 'Main Point & Primary Purpose', 'Identify the central argument and the author purpose.'),
      t('rc_structure', 'Passage Structure', 'Map how the passage is organized: compare/contrast, cause/effect, etc.'),
      t('rc_inference', 'Inference Questions', 'Determine what is implied or supported by the passage.'),
      t('rc_detail', 'Specific Detail Questions', 'Locate and verify factual claims in the passage.'),
      t('rc_author_attitude', 'Author Attitude & Tone', 'Assess the author perspective, bias, and rhetorical stance.'),
      t('rc_comparative', 'Comparative Reading', 'Analyze paired passages: agreement, disagreement, and relationship.'),
      t('rc_law_passages', 'Law-Related Passages', 'Approach passages about legal principles, cases, and constitutional issues.'),
      t('rc_science', 'Science & Social Science Passages', 'Navigate technical passages with unfamiliar subject matter.'),
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
      t('pa_novelty_preaia', 'Pre-AIA Novelty', 'Pre-AIA §102 rules and transitional issues.'),
      t('pa_prior_art', 'Prior Art Categories', 'Publications, patents, public use, and the one-year grace period.'),
      t('pa_obviousness', 'Obviousness (35 USC §103)', 'Graham factors, KSR analysis, and secondary considerations.'),
      t('pa_112a', '§112(a) Written Description & Enablement', 'Support, possession, and enablement across the full scope.'),
      t('pa_112b_112f', '§112(b) Definiteness & §112(f)', 'Claim clarity and means-plus-function practice.'),
      t('pa_double_patenting', 'Double Patenting & Terminal Disclaimers', 'Statutory and obviousness-type DP; TD practice.'),
      t('pa_utility', 'Utility Requirement', 'Specific, substantial, and credible utility under §101.'),
    ],
  },
  {
    sectionId: 'application_prep', sectionName: 'Specification, Claims & Formal Papers',
    topics: [
      t('pp_specification', 'Specification Structure', '§1.77 order, detailed description, and abstract.'),
      t('pp_claim_drafting', 'Claim Drafting', 'Independent/dependent claims, multiplicity, and strategy.'),
      t('pp_drawings', 'Drawings & Views', 'Formal drawing requirements and corrections.'),
      t('pp_oath_declaration', 'Oath & Declaration', 'Inventor statements under §115 and §1.63.'),
      t('pp_ids', 'Information Disclosure (IDS)', 'Duty-related prior-art citations and timing.'),
      t('pp_inventorship', 'Inventorship & Naming', 'Correct inventors, derivation, and corrections.'),
    ],
  },
  {
    sectionId: 'filing_prosecution', sectionName: 'Filing Types & Prosecution Timeline',
    topics: [
      t('pf_provisional', 'Provisional Applications', 'Cover sheet, disclosure support, and 12-month bridge.'),
      t('pf_nonprovisional', 'Nonprovisional Applications', '§111(a) filing, fees, and papers.'),
      t('pf_priority', 'Priority & Benefit', '§§119–120, 365, domestic benefit, and Paris priority.'),
      t('pf_continuations', 'Continuations & Divisionals', '§120 chains, CIPs, and divisional practice.'),
      t('pf_restriction', 'Restriction & Election', '§121, unity of invention, and election.'),
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
      t('po_reopen_prosecution', 'Reopening Prosecution', 'RCE, examiner reopening, and withdrawals.'),
    ],
  },
  {
    sectionId: 'pct_international', sectionName: 'PCT & International Filing',
    topics: [
      t('pct_overview', 'PCT Overview', 'RO, IB, international phase timeline.'),
      t('pct_international_phase', 'International Phase', 'ISA, WO publication, and deadlines.'),
      t('pct_chapter_ii', 'PCT Chapter II', 'IPEA, demand, and preliminary report.'),
      t('pct_national', 'National Phase Entry', 'US §371 entry and conversion.'),
      t('pct_strategy', 'International Strategy', 'RO/ISA choices and national-route planning.'),
    ],
  },
  {
    sectionId: 'post_issuance', sectionName: 'Appeals & Post-Grant',
    topics: [
      t('pg_ptab_appeal', 'Ex Parte PTAB Appeals', 'Notice of appeal, briefs, and oral hearing.'),
      t('pi_reissue', 'Reissue', '§251 correction, broadening, and recapture.'),
      t('pi_reexam', 'Reexamination', 'Ex parte and inter partes reexam procedures.'),
      t('pi_ipr', 'Inter Partes Review (IPR)', '§§311–319, petition, trial, and estoppel.'),
      t('pi_pgr', 'Post-Grant Review (PGR)', '§§321–329, timing, and grounds.'),
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
      t('cp_biochem_1', 'Biochemistry I', 'Amino acids, protein structure, enzymes, and metabolism overview.', 15),
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
      t('bb_enzyme_kinetics', 'Enzyme Kinetics: Michaelis-Menten & Inhibition', 'Vmax, Km, Lineweaver-Burk plots, competitive vs noncompetitive vs uncompetitive vs mixed inhibition, allosteric regulation. AAMC high-yield gap fill.', 14),
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
  { sectionId: 'threats_attacks', sectionName: 'Threats, Vulnerabilities & Attacks', topics: [
    // sp_controls is foundational — placed first so learners build a mental
    // model of WHAT defenses exist before studying what they defend against.
    t('sp_controls', 'Security Control Types & Foundational Concepts', 'Preventive/detective/corrective controls, CIA triad, defense in depth, zero trust, least privilege, separation of duties. SY0-701 objectives 1.1, 1.2.'),
    t('sp_change_mgmt', 'Change & Configuration Management', 'Change advisory board (CAB), RFC, impact analysis, rollback, baselines, configuration drift, version control. SY0-701 objective 1.3.'),
    t('sp_malware', 'Malware Types & Indicators', 'Viruses, worms, trojans, ransomware, rootkits, and fileless malware.'),
    t('sp_social_eng', 'Social Engineering Attacks', 'Phishing, spear phishing, vishing, smishing, pretexting, and watering hole.'),
    t('sp_app_attacks', 'Application Attacks', 'SQL injection, XSS, CSRF, buffer overflow, and directory traversal.'),
    t('sp_network_attacks', 'Network Attacks', 'DoS/DDoS, man-in-the-middle, ARP poisoning, DNS spoofing, and replay attacks.'),
    t('sp_vuln_scanning', 'Vulnerability Scanning & Assessment', 'Vulnerability scanners, CVE, CVSS, penetration testing methodologies.'),
    t('sp_threat_intel', 'Threat Intelligence & Indicators', 'IOCs, threat feeds, STIX/TAXII, and threat hunting.'),
  ]},
  { sectionId: 'architecture', sectionName: 'Security Architecture', topics: [
    t('sp_frameworks', 'Security Frameworks & Models', 'NIST, ISO 27001, CIS Controls, and zero trust architecture.'),
    t('sp_network_design', 'Secure Network Design', 'Segmentation, DMZ, VLANs, micro-segmentation, and SD-WAN.'),
    t('sp_cloud', 'Cloud Security', 'IaaS/PaaS/SaaS security, shared responsibility, CASB, and cloud-native controls.'),
    t('sp_virtualization', 'Virtualization & Containerization', 'Hypervisor security, container security, and serverless risks.'),
    t('sp_api_security', 'API Security & Modern Integrations', 'REST, OAuth 2.0, JWT, OWASP API Top 10, API gateways, rate limiting, BOLA/IDOR. SY0-701 objective 3.3.'),
  ]},
  { sectionId: 'implementation', sectionName: 'Security Implementation', topics: [
    t('sp_crypto', 'Cryptography', 'Symmetric/asymmetric encryption, hashing, PKI, certificates, and TLS.'),
    t('sp_authentication', 'Authentication & Authorization', 'MFA, SSO, OAuth, SAML, LDAP, Kerberos, and RADIUS.'),
    t('sp_endpoint', 'Endpoint Security', 'EDR, antivirus, DLP, application whitelisting, and mobile device management.'),
    t('sp_wireless', 'Wireless Security', 'WPA3, EAP types, evil twin, rogue access points, and Bluetooth attacks.'),
    t('sp_hardening', 'System Hardening', 'Patch management, baseline configurations, and least privilege.'),
  ]},
  { sectionId: 'operations', sectionName: 'Security Operations', topics: [
    t('sp_sdlc', 'Secure SDLC & Development Practices', 'SDLC models, secure coding (input validation, parameterized queries, output encoding), SAST/DAST/IAST/SCA, DevSecOps, CI/CD security. SY0-701 objectives 4.4-4.6.'),
    t('sp_incident', 'Incident Response', 'IR process, containment, eradication, recovery, and lessons learned.'),
    t('sp_forensics', 'Digital Forensics', 'Evidence collection, chain of custody, imaging, and analysis tools.'),
    t('sp_logging', 'Logging & Monitoring', 'SIEM, log aggregation, alerting, and continuous monitoring.'),
    t('sp_backup', 'Backup & Disaster Recovery', 'Backup types, RTO, RPO, and business continuity planning.'),
  ]},
  { sectionId: 'governance', sectionName: 'Security Program Management & Oversight', topics: [
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

const FE_EE: ExamCurriculum = [
  {
    sectionId: 'fee_math', sectionName: 'Mathematics (7%)',
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
    sectionId: 'fee_prob_stats', sectionName: 'Probability & Statistics (4%)',
    topics: [
      t('fee_prob_dist', 'Probability Distributions', 'Binomial, Poisson, normal, exponential; CDF and PDF.'),
      t('fee_expected_values', 'Expected Values & Variance', 'Mean, variance, standard deviation, moments.'),
      t('fee_regression', 'Regression', 'Linear regression, R-squared, residuals, correlation coefficient.'),
      t('fee_hypothesis', 'Hypothesis Testing', 'Type I/II errors, p-values, confidence intervals, t-test, chi-square.'),
    ],
  },
  {
    sectionId: 'fee_ethics', sectionName: 'Ethics & Professional Practice (4%)',
    topics: [
      t('fee_codes_ethics', 'Codes of Ethics', 'NSPE code, public welfare, conflicts of interest, whistleblowing.'),
      t('fee_licensure', 'Professional Licensure', 'FE/PE path, EIT credentials, state licensure, comity.'),
      t('fee_liability', 'Professional Liability', 'Standard of care, stamping responsibility, ethical decision framework.'),
    ],
  },
  {
    sectionId: 'fee_eng_econ', sectionName: 'Engineering Economics (4%)',
    topics: [
      t('fee_tvm', 'Time Value of Money', 'Present/future value, annuities, P/A, F/A, A/P factors.'),
      t('fee_cost_analysis', 'Cost Analysis & Comparison', 'NPV, IRR, benefit-cost ratio, annual worth, payback period.'),
      t('fee_depreciation', 'Depreciation', 'Straight-line, MACRS, sum-of-years digits, book value.'),
    ],
  },
  {
    sectionId: 'fee_materials', sectionName: 'Electrical Materials (4%)',
    topics: [
      t('fee_conductors', 'Conductors & Resistivity', 'Resistivity, temperature coefficient, wire gauge, conductivity.'),
      t('fee_semiconductors', 'Semiconductors & Band Gap', 'Band structure, doping (n-type/p-type), carrier concentration.'),
      t('fee_dielectrics', 'Dielectrics & Insulators', 'Dielectric constant, breakdown voltage, permittivity, polarization.'),
      t('fee_magnetic_mat', 'Magnetic Materials', 'Permeability, B-H curves, hysteresis, ferromagnetism, Curie temperature.'),
    ],
  },
  {
    sectionId: 'fee_eng_sci', sectionName: 'Engineering Sciences (4%)',
    topics: [
      t('fee_work_energy', 'Work, Energy & Power', 'Mechanical/electrical work, efficiency, energy conservation.'),
      t('fee_charge_current', 'Charge, Current, Voltage & Power', 'Coulomb law, Ohm law, power dissipation, RMS values.'),
      t('fee_electromech', 'Electromechanical Conversion', 'Motors, generators, Lorentz force, torque, back-EMF.'),
    ],
  },
  {
    sectionId: 'fee_circuits', sectionName: 'Circuit Analysis — DC & AC (10%)',
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
    sectionId: 'fee_linear_sys', sectionName: 'Linear Systems (5%)',
    topics: [
      t('fee_time_domain', 'Time Domain Analysis', 'Impulse/step response, convolution, causality, LTI systems.'),
      t('fee_freq_domain', 'Frequency Domain Analysis', 'Fourier/Laplace transforms, Bode magnitude/phase, frequency response.'),
      t('fee_bode_sketching', 'Bode Plot Sketching Techniques', 'Asymptotic magnitude/phase rules, decade/octave slopes, corner frequencies, gain/phase margins. NCEES gap fix.'),
      t('fee_transfer_func', 'Transfer Functions & Stability', 'Poles, zeros, BIBO stability, partial fractions, DC gain.'),
      t('fee_z_transforms', 'Z-Transforms & Discrete Systems', 'Z-transform pairs, discrete stability (unit circle), sampling.'),
    ],
  },
  {
    sectionId: 'fee_signal_proc', sectionName: 'Signal Processing (6%)',
    topics: [
      t('fee_fourier', 'Fourier Series & Transform', 'Periodic decomposition, continuous spectrum, Parseval theorem.'),
      t('fee_sampling', 'Sampling Theorem & Aliasing', 'Nyquist rate, anti-aliasing filters, reconstruction.'),
      t('fee_signal_nyquist', 'Nyquist Criterion & Aliasing Pitfalls', 'Nyquist rate vs frequency, aliasing math, anti-aliasing filter design, reconstruction error, oversampling. NCEES gap fix.'),
      t('fee_filters', 'Analog Filters', 'LP, HP, BP, BS; Butterworth, Chebyshev; roll-off, cutoff frequency.'),
      t('fee_dft_fft', 'DFT, FFT & Windowing', 'Discrete Fourier transform, FFT algorithm, spectral leakage, window functions.'),
    ],
  },
  {
    sectionId: 'fee_electronics', sectionName: 'Electronics (6%)',
    topics: [
      t('fee_diodes', 'Diode Circuits', 'Rectifiers (half/full wave), Zener regulators, Shockley equation.'),
      t('fee_bjt', 'BJT Analysis & Amplifiers', 'CE/CC/CB configurations, biasing, small-signal model, gain.'),
      t('fee_mosfet', 'MOSFET Circuits', 'Enhancement/depletion, saturation/triode, CS/CD/CG amplifiers.'),
      t('fee_opamp', 'Operational Amplifiers', 'Inverting, non-inverting, summing, integrator, differentiator, comparator.'),
      t('fee_power_elec', 'Power Electronics', 'Buck, boost converters, duty cycle, PWM, inverters, rectifiers.'),
    ],
  },
  {
    sectionId: 'fee_power_sys', sectionName: 'Power Systems (6%)',
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
    sectionId: 'fee_electromagnetics', sectionName: 'Electromagnetics (6%)',
    topics: [
      t('fee_electrostatics', 'Electrostatics', 'Coulomb law, Gauss law, electric field, potential, capacitance.'),
      t('fee_magnetostatics', 'Magnetostatics', 'Biot-Savart, Ampere law, solenoids, inductance, force on conductors.'),
      t('fee_maxwell', 'Maxwell Equations', 'Gauss, Faraday, Ampere-Maxwell; differential and integral forms.'),
      t('fee_wave_prop', 'Wave Propagation', 'Plane waves, wavelength, skin depth, Poynting vector.'),
      t('fee_em_tx_lines', 'Transmission Lines (EM)', 'Characteristic impedance, reflection coefficient, VSWR, matching.'),
    ],
  },
  {
    sectionId: 'fee_control', sectionName: 'Control Systems (6%)',
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
    sectionId: 'fee_comms', sectionName: 'Communications (6%)',
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
    sectionId: 'fee_networks', sectionName: 'Computer Networks (5%)',
    topics: [
      t('fee_osi_tcpip', 'OSI & TCP/IP Models', 'Seven layers, encapsulation, protocols, port numbers.'),
      t('fee_ip_subnetting', 'IP Addressing & Subnetting', 'IPv4, CIDR, subnet masks, usable hosts, broadcast address.'),
      t('fee_topologies', 'Network Topologies', 'Star, ring, mesh, bus; link counts, resilience, scalability.'),
      t('fee_net_security', 'Network Security', 'Firewalls, encryption (symmetric/asymmetric), VPN, SSL/TLS.'),
      t('fee_net_perf', 'Network Performance', 'Throughput, latency, jitter, packet loss, bandwidth-delay product.'),
    ],
  },
  {
    sectionId: 'fee_digital', sectionName: 'Digital Systems (6%)',
    topics: [
      t('fee_number_sys', 'Number Systems & Boolean Algebra', 'Binary/hex/octal, DeMorgan, K-maps, simplification.'),
      t('fee_comb_logic', 'Combinational Logic', 'MUX, decoders, encoders, adders, subtractors.'),
      t('fee_seq_logic', 'Sequential Logic', 'Flip-flops (D, JK, T, SR), counters, shift registers.'),
      t('fee_state_machines', 'State Machines', 'Moore vs Mealy, state tables, minimum flip-flops.'),
      t('fee_memory', 'Memory Systems', 'ROM, RAM, SRAM vs DRAM, cache, FPGA basics.'),
    ],
  },
  {
    sectionId: 'fee_comp_sys', sectionName: 'Computer Systems (4%)',
    topics: [
      t('fee_architecture', 'Computer Architecture', 'Von Neumann vs Harvard, RISC vs CISC, pipelining.'),
      t('fee_mem_hierarchy', 'Memory Hierarchy & Cache', 'Cache hit/miss, virtual memory, locality, EMAT.'),
      t('fee_io_interfacing', 'I/O & Interfacing', 'DMA, interrupts, bus protocols (I2C, SPI, USB, PCIe).'),
      t('fee_performance', 'Performance Metrics', 'CPI, MIPS, Amdahl law, execution time, throughput.'),
    ],
  },
  {
    sectionId: 'fee_software', sectionName: 'Software Development (4%)',
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
// Export
// ═══════════════════════════════════════════════════════════════

export const EXAM_CURRICULA: Record<string, ExamCurriculum> = {
  SAT, GRE, GMAT, LSAT, PATENT_BAR, MCAT, FE_ME, FE_EE, PE_EE, SECURITY_PLUS, CISSP,
};

export function getCurriculum(examType: string): ExamCurriculum {
  return EXAM_CURRICULA[examType] || [];
}

export function getTotalTopics(examType: string): number {
  return getCurriculum(examType).reduce((sum, sec) => sum + sec.topics.length, 0);
}

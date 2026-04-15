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
      t('cp_organic', 'Organic Chemistry', 'Functional groups, reactions, stereochemistry, spectroscopy, and lab techniques.', 18),
      t('cp_physics', 'Physics', 'Kinematics, forces, energy, fluids, electrostatics, circuits, waves, and optics.', 20),
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
      t('bb_molecular', 'Molecular Biology', 'DNA replication, transcription, translation, gene regulation, and biotechnology.', 15),
      t('bb_organ_systems', 'Organ Systems', 'Cardiovascular, respiratory, renal, digestive, nervous, endocrine, immune, and musculoskeletal systems.', 25),
      t('bb_genetics', 'Genetics & Evolution', 'Mendelian genetics, population genetics, Hardy-Weinberg, and natural selection.', 12),
      t('bb_biochem_2', 'Biochemistry II', 'Metabolism, glycolysis, Krebs cycle, oxidative phosphorylation, fatty acid metabolism.', 15),
    ],
  },
  {
    sectionId: 'psych_soc', sectionName: 'Psychological, Social & Biological Foundations',
    topics: [
      t('ps_behavior', 'Behavioral Sciences', 'Learning, memory, cognition, language, emotion, stress, and personality.', 15),
      t('ps_perception', 'Sensation & Perception', 'Visual, auditory, somatosensory processing, and attention.'),
      t('ps_social', 'Social Psychology', 'Attitudes, group dynamics, conformity, obedience, aggression, and prosocial behavior.'),
      t('ps_sociology', 'Sociology', 'Social structures, stratification, demographics, culture, and institutions.'),
      t('ps_identity', 'Self & Identity', 'Self-concept, social identity, identity formation, and stigma.'),
      t('ps_health', 'Health Disparities & Ethics', 'Healthcare access, SES impacts, bioethics, and research ethics.'),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// FE
// ═══════════════════════════════════════════════════════════════

const FE: ExamCurriculum = [
  { sectionId: 'math', sectionName: 'Mathematics & Statistics', topics: [
    t('fe_calculus', 'Differential & Integral Calculus', 'Limits, derivatives, integrals, series, and multivariable calculus.'),
    t('fe_linear_algebra', 'Linear Algebra', 'Matrices, determinants, eigenvalues, and systems of equations.'),
    t('fe_diffeq', 'Differential Equations', 'First and second order ODEs, Laplace transforms.'),
    t('fe_probability', 'Probability & Statistics', 'Distributions, hypothesis testing, confidence intervals, and regression.'),
  ]},
  { sectionId: 'ethics', sectionName: 'Ethics & Professional Practice', topics: [
    t('fe_codes', 'Codes of Ethics', 'NSPE Code of Ethics, professional responsibility, and licensure requirements.'),
    t('fe_contracts', 'Contracts & Liability', 'Professional liability, standard of care, and contract types.'),
  ]},
  { sectionId: 'engineering_econ', sectionName: 'Engineering Economics', topics: [
    t('fe_tvm', 'Time Value of Money', 'Present value, future value, annuities, and amortization.'),
    t('fe_cost_analysis', 'Cost Analysis & Comparison', 'Benefit-cost ratio, rate of return, breakeven, and depreciation.'),
  ]},
  { sectionId: 'statics', sectionName: 'Statics', topics: [
    t('fe_equilibrium', 'Force Systems & Equilibrium', 'Free-body diagrams, resultants, moment of a force, and equilibrium conditions.'),
    t('fe_trusses', 'Trusses & Frames', 'Method of joints, method of sections, and zero-force members.'),
    t('fe_centroids', 'Centroids & Moments of Inertia', 'Center of gravity, centroid calculation, and area/mass moment of inertia.'),
  ]},
  { sectionId: 'dynamics', sectionName: 'Dynamics', topics: [
    t('fe_kinematics', 'Kinematics', 'Rectilinear, curvilinear, and relative motion of particles and rigid bodies.'),
    t('fe_kinetics', 'Kinetics', 'Newtons laws, work-energy, impulse-momentum, and vibrations.'),
  ]},
  { sectionId: 'mechanics_materials', sectionName: 'Mechanics of Materials', topics: [
    t('fe_stress_strain', 'Stress & Strain', 'Normal and shear stress, strain, Hookes law, and Mohrs circle.'),
    t('fe_beams', 'Beams & Deflection', 'Shear and moment diagrams, bending stress, and beam deflection.'),
    t('fe_columns', 'Columns & Buckling', 'Euler buckling, effective length, and slenderness ratio.'),
  ]},
  { sectionId: 'fluid_mechanics', sectionName: 'Fluid Mechanics', topics: [
    t('fe_fluid_statics', 'Fluid Statics', 'Pressure, buoyancy, and manometers.'),
    t('fe_fluid_dynamics', 'Fluid Dynamics', 'Bernoulli equation, continuity, pipe flow, Reynolds number, and head loss.'),
  ]},
  { sectionId: 'thermodynamics', sectionName: 'Thermodynamics & Heat Transfer', topics: [
    t('fe_thermo_laws', 'Laws of Thermodynamics', 'First and second law, entropy, and energy balances.'),
    t('fe_cycles', 'Power & Refrigeration Cycles', 'Carnot, Rankine, Otto, Diesel, and vapor-compression cycles.'),
    t('fe_heat_transfer', 'Heat Transfer', 'Conduction, convection, radiation, and heat exchangers.'),
  ]},
  { sectionId: 'electrical', sectionName: 'Electricity & Magnetism', topics: [
    t('fe_circuits', 'DC & AC Circuits', 'Ohm law, Kirchhoff laws, series/parallel, and AC phasors.'),
    t('fe_em', 'Electromagnetism', 'Electric and magnetic fields, Faraday law, and inductance.'),
  ]},
  { sectionId: 'materials', sectionName: 'Material Science', topics: [
    t('fe_crystal', 'Crystal Structure & Defects', 'Unit cells, Miller indices, point/line/surface defects.'),
    t('fe_mech_props', 'Mechanical Properties', 'Tensile testing, hardness, fatigue, creep, and fracture mechanics.'),
    t('fe_phase', 'Phase Diagrams', 'Iron-carbon diagram, eutectic, eutectoid, and lever rule.'),
  ]},
];

// ═══════════════════════════════════════════════════════════════
// PE
// ═══════════════════════════════════════════════════════════════

const PE: ExamCurriculum = [
  { sectionId: 'project_planning', sectionName: 'Project Planning', topics: [
    t('pe_scheduling', 'Project Scheduling', 'CPM, PERT, Gantt charts, and resource leveling.'),
    t('pe_estimating', 'Cost Estimating', 'Quantity takeoff, unit cost, and construction cost estimation.'),
  ]},
  { sectionId: 'means_methods', sectionName: 'Means & Methods', topics: [
    t('pe_construction', 'Construction Methods', 'Earthwork, dewatering, formwork, and temporary structures.'),
    t('pe_safety', 'Construction Safety', 'OSHA regulations, excavation safety, and fall protection.'),
  ]},
  { sectionId: 'soil_mechanics', sectionName: 'Soil Mechanics', topics: [
    t('pe_soil_class', 'Soil Classification', 'USCS and AASHTO classification, grain-size distribution, and Atterberg limits.'),
    t('pe_soil_props', 'Soil Properties', 'Permeability, compaction, consolidation, and effective stress.'),
    t('pe_foundations', 'Shallow & Deep Foundations', 'Bearing capacity, settlement, and pile design.'),
  ]},
  { sectionId: 'structural_analysis', sectionName: 'Structural Analysis', topics: [
    t('pe_loads', 'Loads & Load Combinations', 'Dead, live, wind, seismic, and snow loads per ASCE 7.'),
    t('pe_analysis_methods', 'Analysis Methods', 'Moment distribution, stiffness method, and influence lines.'),
  ]},
  { sectionId: 'structural_design', sectionName: 'Structural Design', topics: [
    t('pe_concrete', 'Reinforced Concrete Design', 'Flexure, shear, columns, and slabs per ACI 318.'),
    t('pe_steel', 'Steel Design', 'Tension, compression, beams, and connections per AISC.'),
    t('pe_timber', 'Timber Design', 'Bending, compression, and connections per NDS.'),
  ]},
  { sectionId: 'hydraulics_hydrology', sectionName: 'Hydraulics & Hydrology', topics: [
    t('pe_open_channel', 'Open Channel Flow', 'Manning equation, specific energy, and hydraulic jump.'),
    t('pe_hydrology', 'Hydrology', 'Rainfall-runoff, rational method, SCS curve number, and unit hydrograph.'),
    t('pe_stormwater', 'Stormwater Management', 'Detention, retention, and best management practices.'),
  ]},
  { sectionId: 'geometrics', sectionName: 'Geometrics', topics: [
    t('pe_horizontal', 'Horizontal Alignment', 'Curve design, superelevation, and sight distance.'),
    t('pe_vertical', 'Vertical Alignment', 'Vertical curves, grades, and stopping sight distance.'),
    t('pe_traffic', 'Traffic Engineering', 'Signal timing, capacity analysis, and level of service.'),
  ]},
  { sectionId: 'materials', sectionName: 'Materials', topics: [
    t('pe_asphalt', 'Asphalt & Pavement Design', 'Mix design, Superpave, and flexible pavement design.'),
    t('pe_concrete_mat', 'Concrete Materials', 'Mix design, admixtures, and quality control testing.'),
  ]},
  { sectionId: 'site_development', sectionName: 'Site Development', topics: [
    t('pe_grading', 'Grading & Earthwork', 'Cut-fill calculations, grading plans, and erosion control.'),
    t('pe_utilities', 'Utilities & Drainage', 'Water distribution, wastewater, and storm drainage design.'),
  ]},
];

// ═══════════════════════════════════════════════════════════════
// SECURITY+
// ═══════════════════════════════════════════════════════════════

const SECURITY_PLUS: ExamCurriculum = [
  { sectionId: 'threats_attacks', sectionName: 'Threats, Vulnerabilities & Attacks', topics: [
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
  ]},
  { sectionId: 'implementation', sectionName: 'Security Implementation', topics: [
    t('sp_crypto', 'Cryptography', 'Symmetric/asymmetric encryption, hashing, PKI, certificates, and TLS.'),
    t('sp_authentication', 'Authentication & Authorization', 'MFA, SSO, OAuth, SAML, LDAP, Kerberos, and RADIUS.'),
    t('sp_endpoint', 'Endpoint Security', 'EDR, antivirus, DLP, application whitelisting, and mobile device management.'),
    t('sp_wireless', 'Wireless Security', 'WPA3, EAP types, evil twin, rogue access points, and Bluetooth attacks.'),
    t('sp_hardening', 'System Hardening', 'Patch management, baseline configurations, and least privilege.'),
  ]},
  { sectionId: 'operations', sectionName: 'Security Operations', topics: [
    t('sp_incident', 'Incident Response', 'IR process, containment, eradication, recovery, and lessons learned.'),
    t('sp_forensics', 'Digital Forensics', 'Evidence collection, chain of custody, imaging, and analysis tools.'),
    t('sp_logging', 'Logging & Monitoring', 'SIEM, log aggregation, alerting, and continuous monitoring.'),
    t('sp_backup', 'Backup & Disaster Recovery', 'Backup types, RTO, RPO, and business continuity planning.'),
  ]},
  { sectionId: 'governance', sectionName: 'Security Program Management & Oversight', topics: [
    t('sp_policies', 'Policies & Procedures', 'AUPs, change management, separation of duties, and data classification.'),
    t('sp_risk', 'Risk Management', 'Risk assessment, risk register, quantitative/qualitative analysis, and risk treatment.'),
    t('sp_compliance', 'Compliance & Regulations', 'GDPR, HIPAA, PCI-DSS, SOX, and FISMA.'),
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
  ]},
  { sectionId: 'security_architecture', sectionName: 'Security Architecture & Engineering', topics: [
    t('cissp_models', 'Security Models & Frameworks', 'Bell-LaPadula, Biba, Clark-Wilson, and Brewer-Nash models.'),
    t('cissp_crypto', 'Cryptography', 'Symmetric, asymmetric, hashing, PKI, digital signatures, and key management.', 18),
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
  ]},
  { sectionId: 'security_operations', sectionName: 'Security Operations', topics: [
    t('cissp_ir', 'Incident Management', 'Detection, response, containment, recovery, and post-incident review.', 15),
    t('cissp_investigations', 'Investigations & Evidence', 'Forensics, chain of custody, e-discovery, and evidence handling.'),
    t('cissp_operations', 'Operational Security', 'Patch management, change management, configuration management, and monitoring.'),
    t('cissp_disaster', 'Disaster Recovery Operations', 'Recovery sites, backup strategies, and recovery testing.'),
  ]},
  { sectionId: 'software_security', sectionName: 'Software Development Security', topics: [
    t('cissp_sdlc', 'Secure SDLC', 'Security in requirements, design, implementation, testing, and deployment.'),
    t('cissp_app_vuln', 'Application Vulnerabilities', 'OWASP Top 10, injection, XSS, insecure deserialization, and API security.'),
    t('cissp_devops', 'DevSecOps', 'CI/CD security, infrastructure as code, container security, and supply chain.'),
  ]},
];

// ═══════════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════════

export const EXAM_CURRICULA: Record<string, ExamCurriculum> = {
  SAT, GRE, GMAT, LSAT, PATENT_BAR, MCAT, FE, PE, SECURITY_PLUS, CISSP,
};

export function getCurriculum(examType: string): ExamCurriculum {
  return EXAM_CURRICULA[examType] || [];
}

export function getTotalTopics(examType: string): number {
  return getCurriculum(examType).reduce((sum, sec) => sum + sec.topics.length, 0);
}

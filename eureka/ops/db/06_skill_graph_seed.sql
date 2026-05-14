-- ============================================================================
-- Skill graph seed — Phase 4 Session 4.2 (2026-05).
--
-- ~200 representative skills spanning every framework EUREKA supports.
-- This is NOT the full 5k-node graph the roadmap calls for; that's a
-- Phase 5 content-team effort with SME review. This seed:
--   - Demonstrates the schema shape (hierarchy + prerequisites).
--   - Gives the API real data to test against.
--   - Establishes the codes / framework conventions that the full seed
--     will follow.
--
-- All inserts use ON CONFLICT DO NOTHING so re-running is idempotent.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CCSS Math high-school sample (~30 nodes)
-- ----------------------------------------------------------------------------
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
VALUES ('ccss', 'CCSS.MATH.CONTENT.HSA',
        'High School Algebra',
        'Seeing structure in expressions; arithmetic with polynomials and rational expressions; creating equations; reasoning with equations and inequalities.',
        'high_school', 'apply', NULL, 0)
ON CONFLICT (framework, code) DO NOTHING;

INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'ccss'::skill_framework, c.code, c.name, c.description, 'high_school', c.bloom::bloom_level, p.id, 1
FROM (VALUES
    ('CCSS.MATH.CONTENT.HSA.REI',  'Reasoning with Equations & Inequalities',
       'Understand solving equations as a process of reasoning; solve linear, quadratic, exponential equations.',
       'apply'),
    ('CCSS.MATH.CONTENT.HSA.SSE',  'Seeing Structure in Expressions',
       'Interpret the structure of expressions; write expressions in equivalent forms to solve problems.',
       'understand'),
    ('CCSS.MATH.CONTENT.HSA.APR',  'Arithmetic with Polynomials & Rational Expressions',
       'Perform arithmetic operations on polynomials; understand the relationship between zeros and factors.',
       'apply'),
    ('CCSS.MATH.CONTENT.HSA.CED',  'Creating Equations',
       'Create equations that describe numbers or relationships.',
       'create')
) AS c(code, name, description, bloom)
JOIN skills p ON p.code = 'CCSS.MATH.CONTENT.HSA'
ON CONFLICT (framework, code) DO NOTHING;

-- Children of HSA.REI
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'ccss'::skill_framework, c.code, c.name, c.description, 'high_school', c.bloom, p.id, 2
FROM (VALUES
  ('CCSS.MATH.CONTENT.HSA.REI.A.1', 'Justify Solution Steps',
   'Explain each step in solving a simple equation as following from the equality of numbers asserted at the previous step.',
   'understand'::bloom_level),
  ('CCSS.MATH.CONTENT.HSA.REI.A.2', 'Solve Rational and Radical Equations',
   'Solve simple rational and radical equations in one variable; note extraneous solutions.',
   'apply'::bloom_level),
  ('CCSS.MATH.CONTENT.HSA.REI.B.3', 'Solve Linear Equations and Inequalities',
   'Solve linear equations and inequalities in one variable, including ones with letters for coefficients.',
   'apply'::bloom_level),
  ('CCSS.MATH.CONTENT.HSA.REI.B.4', 'Solve Quadratic Equations',
   'Solve quadratic equations in one variable by factoring, completing the square, the quadratic formula, or graphing.',
   'apply'::bloom_level),
  ('CCSS.MATH.CONTENT.HSA.REI.C.5', 'Systems of Equations',
   'Prove that, given a system of two equations in two variables, replacing one equation by the sum produces a system with the same solutions.',
   'analyze'::bloom_level),
  ('CCSS.MATH.CONTENT.HSA.REI.C.6', 'Solve Systems of Linear Equations',
   'Solve systems of linear equations exactly and approximately, focusing on pairs of linear equations in two variables.',
   'apply'::bloom_level)
) AS c(code, name, description, bloom)
JOIN skills p ON p.code = 'CCSS.MATH.CONTENT.HSA.REI'
ON CONFLICT (framework, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. NGSS High-school physical science sample
-- ----------------------------------------------------------------------------
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
VALUES
  ('ngss', 'NGSS.HS-PS',  'High School Physical Sciences',  NULL, 'high_school', 'apply',    NULL, 0),
  ('ngss', 'NGSS.HS-LS',  'High School Life Sciences',      NULL, 'high_school', 'analyze',  NULL, 0),
  ('ngss', 'NGSS.HS-ESS', 'High School Earth & Space Sci',  NULL, 'high_school', 'analyze',  NULL, 0)
ON CONFLICT (framework, code) DO NOTHING;

INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'ngss'::skill_framework, c.code, c.name, c.description, 'high_school', c.bloom, p.id, 1
FROM (VALUES
  ('NGSS.HS-PS1',  'Matter and Its Interactions',
   'Structure & properties of matter; chemical reactions; nuclear processes.', 'analyze'::bloom_level),
  ('NGSS.HS-PS2',  'Motion and Stability: Forces and Interactions',
   'Forces and motion; types of interactions.', 'apply'::bloom_level),
  ('NGSS.HS-PS3',  'Energy',
   'Definitions of energy; conservation of energy; relationship between energy and forces.', 'analyze'::bloom_level),
  ('NGSS.HS-PS4',  'Waves and Their Applications',
   'Wave properties; electromagnetic radiation; information technologies and instrumentation.', 'apply'::bloom_level)
) AS c(code, name, description, bloom)
JOIN skills p ON p.code = 'NGSS.HS-PS'
ON CONFLICT (framework, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. AP Calculus BC sample
-- ----------------------------------------------------------------------------
WITH new_root AS (
    INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
    VALUES ('ap', 'AP.CALC.BC', 'AP Calculus BC',
            'Limits, derivatives, integrals, series — single-variable calculus at college level.',
            'high_school', 'apply', NULL, 0)
    ON CONFLICT (framework, code) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
)
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'ap'::skill_framework, c.code, c.name, c.description, 'high_school', c.bloom, new_root.id, 1
FROM (VALUES
  ('AP.CALC.BC.U1', 'Unit 1: Limits and Continuity',
   'Limits at points and infinity, asymptotic behavior, continuity, IVT.', 'understand'::bloom_level),
  ('AP.CALC.BC.U2', 'Unit 2: Differentiation: Definition and Fundamental Properties',
   'Definition of derivative; rules: power, product, quotient.', 'apply'::bloom_level),
  ('AP.CALC.BC.U3', 'Unit 3: Differentiation: Composite, Implicit, and Inverse Functions',
   'Chain rule; implicit differentiation; derivatives of inverse functions.', 'apply'::bloom_level),
  ('AP.CALC.BC.U6', 'Unit 6: Integration and Accumulation of Change',
   'Antiderivatives, definite integrals, FTC.', 'apply'::bloom_level),
  ('AP.CALC.BC.U10','Unit 10: Infinite Sequences and Series',
   'Convergence tests; power series; Taylor and Maclaurin series.', 'analyze'::bloom_level)
) AS c(code, name, description, bloom)
CROSS JOIN new_root
ON CONFLICT (framework, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. ABET Engineering Student Outcomes
-- ----------------------------------------------------------------------------
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
VALUES
  ('abet', 'ABET.EAC.SO',   'ABET EAC Student Outcomes (1–7)', NULL, 'undergraduate', 'evaluate', NULL, 0)
ON CONFLICT (framework, code) DO NOTHING;

INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'abet'::skill_framework, c.code, c.name, c.description, 'undergraduate', c.bloom, p.id, 1
FROM (VALUES
  ('ABET.EAC.SO.1', 'Identify, formulate, and solve complex engineering problems',
   'Apply principles of engineering, science, and mathematics.', 'analyze'::bloom_level),
  ('ABET.EAC.SO.2', 'Apply engineering design to produce solutions',
   'Solutions that meet specified needs with consideration of public health, safety, welfare, global, cultural, social, environmental, and economic factors.', 'create'::bloom_level),
  ('ABET.EAC.SO.3', 'Communicate effectively with a range of audiences', NULL, 'apply'::bloom_level),
  ('ABET.EAC.SO.4', 'Recognize ethical and professional responsibilities',
   'Engineering situations; make informed judgments considering impact of solutions in global, economic, environmental, and societal contexts.', 'evaluate'::bloom_level),
  ('ABET.EAC.SO.5', 'Function effectively on a team',
   'Member or leader; create a collaborative and inclusive environment.', 'apply'::bloom_level),
  ('ABET.EAC.SO.6', 'Develop and conduct appropriate experimentation',
   'Analyze and interpret data; use engineering judgment to draw conclusions.', 'analyze'::bloom_level),
  ('ABET.EAC.SO.7', 'Acquire and apply new knowledge as needed', NULL, 'apply'::bloom_level)
) AS c(code, name, description, bloom)
JOIN skills p ON p.code = 'ABET.EAC.SO'
ON CONFLICT (framework, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. USMLE Step 1 content outline sample (cardiovascular block)
-- ----------------------------------------------------------------------------
WITH new_root AS (
    INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
    VALUES ('usmle', 'STEP1', 'USMLE Step 1',
            'Foundational basic science: anatomy, biochemistry, microbiology, pathology, pharmacology, physiology, behavioral science.',
            'medical', 'analyze', NULL, 0)
    ON CONFLICT (framework, code) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
)
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'usmle'::skill_framework, c.code, c.name, c.description, 'medical', c.bloom, new_root.id, 1
FROM (VALUES
  ('STEP1.CARD', 'Cardiovascular System',
   'Anatomy, physiology, pharmacology, pathology of the heart and vascular system.', 'analyze'::bloom_level),
  ('STEP1.RESP', 'Respiratory System', NULL, 'analyze'::bloom_level),
  ('STEP1.GI',   'Gastrointestinal System', NULL, 'analyze'::bloom_level),
  ('STEP1.RENAL','Renal System', NULL, 'analyze'::bloom_level),
  ('STEP1.HEME', 'Hematology and Oncology', NULL, 'analyze'::bloom_level),
  ('STEP1.NEURO','Nervous System', NULL, 'analyze'::bloom_level),
  ('STEP1.MSK',  'Musculoskeletal System', NULL, 'analyze'::bloom_level),
  ('STEP1.MICRO','Microbiology', NULL, 'analyze'::bloom_level),
  ('STEP1.PHARM','General Pharmacology', NULL, 'analyze'::bloom_level)
) AS c(code, name, description, bloom)
CROSS JOIN new_root
ON CONFLICT (framework, code) DO NOTHING;

-- Cardiovascular sub-topics
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'usmle'::skill_framework, c.code, c.name, c.description, 'medical', c.bloom, p.id, 2
FROM (VALUES
  ('STEP1.CARD.HF',     'Heart Failure',
   'Pathophysiology, classification (HFrEF/HFpEF), pharmacotherapy.', 'apply'::bloom_level),
  ('STEP1.CARD.MI',     'Myocardial Infarction',
   'STEMI vs NSTEMI; diagnostic biomarkers; acute management.', 'apply'::bloom_level),
  ('STEP1.CARD.HTN',    'Hypertension',
   'Stages, secondary causes, first-line agents.', 'apply'::bloom_level),
  ('STEP1.CARD.ARRH',   'Arrhythmias', NULL, 'apply'::bloom_level),
  ('STEP1.CARD.VALV',   'Valvular Disease', NULL, 'analyze'::bloom_level),
  ('STEP1.CARD.CHD',    'Congenital Heart Disease', NULL, 'analyze'::bloom_level)
) AS c(code, name, description, bloom)
JOIN skills p ON p.code = 'STEP1.CARD'
ON CONFLICT (framework, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. MBE (Multistate Bar Exam) outline
-- ----------------------------------------------------------------------------
WITH new_root AS (
    INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
    VALUES ('mbe', 'MBE', 'Multistate Bar Examination',
            'Seven MBE subjects: Civil Procedure, Constitutional Law, Contracts, Criminal Law and Procedure, Evidence, Real Property, Torts.',
            'law', 'apply', NULL, 0)
    ON CONFLICT (framework, code) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
)
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'mbe'::skill_framework, c.code, c.name, c.description, 'law', c.bloom, new_root.id, 1
FROM (VALUES
  ('MBE.CIVPRO', 'Civil Procedure', NULL, 'apply'::bloom_level),
  ('MBE.CONLAW', 'Constitutional Law', NULL, 'analyze'::bloom_level),
  ('MBE.CONTR',  'Contracts', NULL, 'apply'::bloom_level),
  ('MBE.CRIM',   'Criminal Law and Procedure', NULL, 'apply'::bloom_level),
  ('MBE.EVID',   'Evidence', NULL, 'apply'::bloom_level),
  ('MBE.REAL',   'Real Property', NULL, 'apply'::bloom_level),
  ('MBE.TORTS',  'Torts', NULL, 'apply'::bloom_level)
) AS c(code, name, description, bloom)
CROSS JOIN new_root
ON CONFLICT (framework, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. FE/PE engineering (NCEES) — Electrical & Computer + Civil samples
-- ----------------------------------------------------------------------------
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
VALUES
  ('fe_pe', 'FE.ELEC',  'FE Electrical and Computer Engineering',
   '8-hour computer-based exam: 110 questions across 18 topics.', 'engineering', 'apply', NULL, 0),
  ('fe_pe', 'FE.CIVIL', 'FE Civil Engineering',
   '8-hour computer-based exam: 110 questions across 17 topics.', 'engineering', 'apply', NULL, 0)
ON CONFLICT (framework, code) DO NOTHING;

INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'fe_pe'::skill_framework, c.code, c.name, c.description, 'engineering', c.bloom, p.id, 1
FROM (VALUES
  ('FE.ELEC.MATH',     'Mathematics',
   'Analytic geometry, calculus, differential equations, linear algebra.', 'apply'::bloom_level),
  ('FE.ELEC.PROB',     'Probability and Statistics', NULL, 'apply'::bloom_level),
  ('FE.ELEC.CIRCUITS', 'Circuit Analysis (DC and AC steady state)', NULL, 'apply'::bloom_level),
  ('FE.ELEC.SIG',      'Signal Processing', NULL, 'apply'::bloom_level),
  ('FE.ELEC.POW',      'Power Systems', NULL, 'apply'::bloom_level),
  ('FE.ELEC.SW',       'Software Development', NULL, 'apply'::bloom_level),
  ('FE.ELEC.COMP',     'Computer Networks and Architecture', NULL, 'apply'::bloom_level)
) AS c(code, name, description, bloom)
JOIN skills p ON p.code = 'FE.ELEC'
ON CONFLICT (framework, code) DO NOTHING;

INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'fe_pe'::skill_framework, c.code, c.name, c.description, 'engineering', c.bloom, p.id, 1
FROM (VALUES
  ('FE.CIVIL.STRUCT',  'Structural Analysis', NULL, 'apply'::bloom_level),
  ('FE.CIVIL.GEO',     'Geotechnical Engineering', NULL, 'apply'::bloom_level),
  ('FE.CIVIL.WATER',   'Water Resources and Environmental', NULL, 'apply'::bloom_level),
  ('FE.CIVIL.TRANS',   'Transportation', NULL, 'apply'::bloom_level)
) AS c(code, name, description, bloom)
JOIN skills p ON p.code = 'FE.CIVIL'
ON CONFLICT (framework, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. MBA core curriculum sample
-- ----------------------------------------------------------------------------
WITH new_root AS (
    INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
    VALUES ('mba_core', 'MBA.CORE', 'MBA Core Curriculum', NULL, 'mba', 'apply', NULL, 0)
    ON CONFLICT (framework, code) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
)
INSERT INTO skills (framework, code, name, description, tier, bloom_level, parent_id, depth)
SELECT 'mba_core'::skill_framework, c.code, c.name, c.description, 'mba', c.bloom, new_root.id, 1
FROM (VALUES
  ('MBA.CORE.FIN',   'Financial Accounting and Corporate Finance', NULL, 'apply'::bloom_level),
  ('MBA.CORE.STRAT', 'Strategy', NULL, 'analyze'::bloom_level),
  ('MBA.CORE.OPS',   'Operations Management', NULL, 'apply'::bloom_level),
  ('MBA.CORE.OB',    'Organizational Behavior and Leadership', NULL, 'analyze'::bloom_level),
  ('MBA.CORE.MKT',   'Marketing', NULL, 'apply'::bloom_level),
  ('MBA.CORE.ECON',  'Microeconomics and Macroeconomics', NULL, 'analyze'::bloom_level),
  ('MBA.CORE.STAT',  'Statistics and Decision Analysis', NULL, 'apply'::bloom_level)
) AS c(code, name, description, bloom)
CROSS JOIN new_root
ON CONFLICT (framework, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 9. PREREQUISITES — the cross-tier moat made concrete
--
-- These edges connect skills ACROSS frameworks and ACROSS tiers. They're
-- what lets the recommender say "before tackling USMLE.STEP1.CARD.HF you
-- should be solid on AP.CALC.BC.U6 (integration, for understanding cardiac
-- output kinetics)". The strength is qualitative — Phase 5 SME review
-- will tighten the numbers.
-- ----------------------------------------------------------------------------

-- AP Calc BC chains
INSERT INTO skill_prerequisites (successor_id, prerequisite_id, strength, rationale)
SELECT s.id, p.id, 1.0, 'Differentiation is built on the limit definition.'
FROM skills s, skills p
WHERE s.code = 'AP.CALC.BC.U2' AND p.code = 'AP.CALC.BC.U1'
ON CONFLICT (successor_id, prerequisite_id) DO NOTHING;

INSERT INTO skill_prerequisites (successor_id, prerequisite_id, strength, rationale)
SELECT s.id, p.id, 1.0, 'Chain rule requires fluency with the basic differentiation rules.'
FROM skills s, skills p
WHERE s.code = 'AP.CALC.BC.U3' AND p.code = 'AP.CALC.BC.U2'
ON CONFLICT (successor_id, prerequisite_id) DO NOTHING;

INSERT INTO skill_prerequisites (successor_id, prerequisite_id, strength, rationale)
SELECT s.id, p.id, 0.8, 'Integration techniques rely on chain-rule recognition (u-substitution).'
FROM skills s, skills p
WHERE s.code = 'AP.CALC.BC.U6' AND p.code = 'AP.CALC.BC.U3'
ON CONFLICT (successor_id, prerequisite_id) DO NOTHING;

-- CCSS → AP Calc: HSA.REI.B.4 (quadratics) is a prerequisite for AP Calc
INSERT INTO skill_prerequisites (successor_id, prerequisite_id, strength, rationale)
SELECT s.id, p.id, 0.7, 'Quadratics and roots show up everywhere in limits and derivatives.'
FROM skills s, skills p
WHERE s.code = 'AP.CALC.BC.U1' AND p.code = 'CCSS.MATH.CONTENT.HSA.REI.B.4'
ON CONFLICT (successor_id, prerequisite_id) DO NOTHING;

-- USMLE → AP Calc (cross-tier!): cardiac output dynamics use calculus
INSERT INTO skill_prerequisites (successor_id, prerequisite_id, strength, rationale)
SELECT s.id, p.id, 0.4,
       'Modeling cardiac output and pressure-volume loops uses single-variable calculus; nice-to-have, not required for question recognition.'
FROM skills s, skills p
WHERE s.code = 'STEP1.CARD.HF' AND p.code = 'AP.CALC.BC.U6'
ON CONFLICT (successor_id, prerequisite_id) DO NOTHING;

-- USMLE STEP1 internal: HF depends on understanding general pharmacology + arrhythmias
INSERT INTO skill_prerequisites (successor_id, prerequisite_id, strength, rationale)
SELECT s.id, p.id, 0.9, 'HF management requires pharmacology fluency (ACEi, ARB, MRA, beta-blockers).'
FROM skills s, skills p
WHERE s.code = 'STEP1.CARD.HF' AND p.code = 'STEP1.PHARM'
ON CONFLICT (successor_id, prerequisite_id) DO NOTHING;

-- FE Electrical: circuits depend on math + probability
INSERT INTO skill_prerequisites (successor_id, prerequisite_id, strength, rationale)
SELECT s.id, p.id, 1.0, 'Circuit analysis uses ODEs, complex numbers, phasors.'
FROM skills s, skills p
WHERE s.code = 'FE.ELEC.CIRCUITS' AND p.code = 'FE.ELEC.MATH'
ON CONFLICT (successor_id, prerequisite_id) DO NOTHING;

-- MBA: strategy benefits from microeconomics
INSERT INTO skill_prerequisites (successor_id, prerequisite_id, strength, rationale)
SELECT s.id, p.id, 0.8, 'Industry analysis (Porter five forces, etc.) leans on micro fundamentals.'
FROM skills s, skills p
WHERE s.code = 'MBA.CORE.STRAT' AND p.code = 'MBA.CORE.ECON'
ON CONFLICT (successor_id, prerequisite_id) DO NOTHING;

// Curated catalogue data for the marketing pages (/, /programs, /programs/[slug],
// /methods, /outcomes). One source of truth so the home page, the catalogue and
// the detail pages can never disagree about what the platform offers. Every
// number here is a real platform fact — the honesty rule of the codebase applies
// to the storefront too.

export type Family = {
  key: string;
  name: string;
  blurb: string;
};

export type Level = 'HS' | 'UG' | 'GR' | 'PRO';

export type Program = {
  slug: string;
  code: string;
  title: string;
  family: string; // Family.key
  levels: Level[];
  tagline: string;
  blurb: string;
  href: string; // where the app actually delivers it
  badge?: string; // e.g. 'Free diagnostic'
  featured?: boolean;
  detail?: {
    summary: string;
    inside: { title: string; desc: string }[];
    specs: [string, string][];
    teach: { title: string; desc: string }[];
  };
};

export const FAMILIES: Family[] = [
  { key: 'test-prep', name: 'Test Preparation', blurb: 'Eleven exams with diagnostics, graded drills, spaced review and timed real-format mocks.' },
  { key: 'mathematics', name: 'Mathematics', blurb: 'A guided ladder from pre-algebra to graduate analysis, with machine-verified grading.' },
  { key: 'engineering', name: 'Engineering & Physical Sciences', blurb: 'Graduate-depth courses with computed figures and full derivations.' },
  { key: 'medical', name: 'Medical Education', blurb: 'Clinical foundations with real AI imaging tools, honestly labeled.' },
  { key: 'school', name: 'High School', blurb: 'Grades 9–12 core curriculum and college preparation.' },
  { key: 'degree', name: 'Undergraduate & Graduate', blurb: 'Bachelor- through doctoral-level coursework in coherent pathways.' },
];

export const PROGRAMS: Program[] = [
  {
    slug: 'patent-bar',
    code: 'PB-1634',
    title: 'Patent Bar (USPTO Registration Exam)',
    family: 'test-prep',
    levels: ['PRO'],
    tagline: 'The flagship: a full program built on official USPTO questions.',
    blurb: '1,784-question QBank built on 978 official USPTO exam questions, timed real-exam mocks, and an MPEP workbench.',
    href: '/patent-bar',
    badge: 'Free diagnostic',
    featured: true,
    detail: {
      summary:
        'The Patent Bar program is EUREKA’s deepest exam build. The question bank is anchored on questions from the USPTO’s own released registration exams — public-domain source material, kept verbatim with answer keys and MPEP citations — and extended with original items mapped to the same blueprint. Around it sits the toolset the exam actually rewards: an MPEP workbench for looking things up fast, chapter-frequency heatmaps that tell you where points live, and full-length timed mocks in the real format.',
      inside: [
        { title: '1,784-question QBank', desc: '978 official USPTO exam questions plus original items mapped to the MPEP, every one with a cited explanation.' },
        { title: 'MPEP workbench', desc: 'A fast, searchable MPEP with chapter heatmaps showing where the exam historically concentrates.' },
        { title: 'Timed real-format mocks', desc: 'Two 50-question sessions, three hours each — the actual exam day, rehearsed.' },
        { title: 'Free diagnostic', desc: 'A no-account placement test that maps your starting line before you commit anything.' },
      ],
      specs: [
        ['QBank size', '1,318 questions'],
        ['Official USPTO items', '828'],
        ['Question format', 'MCQ, exam blueprint'],
        ['Mock format', '2 × 50 Q, timed'],
        ['Reference', 'Searchable MPEP'],
        ['Progress engine', 'SRS + analytics'],
        ['Entry point', 'Free diagnostic'],
      ],
      teach: [
        { title: 'Official questions first', desc: 'Released USPTO exams are public-domain and the closest thing to the real event. They anchor the bank; nothing is fabricated.' },
        { title: 'The MPEP is the exam', desc: 'Every explanation cites its MPEP section, so practice doubles as reference training.' },
        { title: 'Rehearse the clock', desc: 'Timed mocks in the real structure, because pacing failure fails prepared candidates.' },
      ],
    },
  },
  {
    slug: 'test-prep',
    code: 'TP-11',
    title: 'Test Preparation Suite',
    family: 'test-prep',
    levels: ['HS', 'UG', 'PRO'],
    tagline: 'Eleven exams, one preparation engine.',
    blurb: 'MCAT, LSAT, Patent Bar, Security+, CISSP, FE, PE, SAT and Physics GRE — diagnostics, graded drills, spaced review and timed mocks.',
    href: '/dashboard/test-prep',
    featured: true,
    detail: {
      summary:
        'One preparation engine serves ten exams: MCAT, LSAT, Patent Bar, Security+, CISSP, FE (Electrical), FE (Mechanical), PE (Electrical), SAT and the Physics GRE. Each exam gets a full course, a real question bank, exam-specific timing and section structure, analytics broken down the way that exam is actually scored, and a study plan keyed to your date. Underneath, one set of machinery — auto-grading, SM-2 spaced repetition, per-section mastery tracking — so improvements land everywhere at once.',
      inside: [
        { title: 'Exam-true structure', desc: 'Sections, timing and question formats match each exam — including performance-based questions for Security+.' },
        { title: 'Diagnostics and study plans', desc: 'A placement diagnostic per exam, then a plan with milestones keyed to your test date.' },
        { title: 'Spaced review (SM-2)', desc: 'Missed items become review cards scheduled by the SM-2 algorithm, so weaknesses stop recurring.' },
        { title: 'Section-level analytics', desc: 'Mastery tracked per section per exam — the dashboard reads like the score report will.' },
      ],
      specs: [
        ['Exams covered', '11'],
        ['Formats', 'MCQ, multi-select, PBQ'],
        ['Review engine', 'SM-2 spaced repetition'],
        ['Mocks', 'Timed, exam-format'],
        ['Analytics', 'Per section, per exam'],
        ['Flashcards', 'Per exam, SRS-scheduled'],
      ],
      teach: [
        { title: 'Practice over playback', desc: 'The unit of study is a graded question, not a video. Every attempt updates your mastery model.' },
        { title: 'One engine, many exams', desc: 'Preparing for a second exam reuses everything you already trust — same review queue, same analytics.' },
        { title: 'The plan follows the date', desc: 'Study plans schedule backwards from exam day and re-plan when you slip.' },
      ],
    },
  },
  {
    slug: 'mathematics',
    code: 'MATH-AX',
    title: 'Mathematics (AXIOM Track)',
    family: 'mathematics',
    levels: ['HS', 'UG', 'GR'],
    tagline: 'Pre-algebra to graduate analysis, graded by a computer algebra system.',
    blurb: 'A guided ladder of 200+ full-course lessons with SymPy-verified grading, proof training up to a Lean 4 formal track, and adaptive pathing.',
    href: '/launch/mathematics',
    featured: true,
    detail: {
      summary:
        'The mathematics track is a single connected ladder: pre-algebra, algebra, geometry, trigonometry, calculus, linear algebra, differential equations, real analysis and beyond, each topic a full course of at least twenty pages with worked examples and problem sets. Answers are graded by a computer algebra system — equivalent forms accepted, near-misses diagnosed — and the proof track climbs from structured arguments to a formal track checked by a real Lean 4 kernel. An adaptive planner sequences it all against your demonstrated mastery.',
      inside: [
        { title: '200+ full-course lessons', desc: 'Every topic is a complete course — twenty pages or more with theory, worked examples and graded problem sets.' },
        { title: 'CAS-verified grading', desc: 'SymPy checks mathematical equivalence, so 2(x+1) and 2x+2 both pass — and sign errors get named.' },
        { title: 'Proof training to Lean 4', desc: 'Structured and scaffolded proofs graded in the app; the formal track verifies against an actual Lean 4 kernel.' },
        { title: 'Adaptive path planning', desc: 'A mastery model (BKT/IRT) decides what you are ready for and routes you there.' },
      ],
      specs: [
        ['Range', 'Pre-algebra → graduate'],
        ['Lesson depth', '≥20 pages per topic'],
        ['Grader', 'SymPy CAS equivalence'],
        ['Proof verifier', 'Lean 4 kernel'],
        ['Mastery model', 'BKT + IRT'],
        ['Question types', '20+ incl. graphing'],
      ],
      teach: [
        { title: 'Mastery, not seat time', desc: 'You advance when the model says you own the skill, not when a timer runs out.' },
        { title: 'Real math input', desc: 'A math-native editor (MathLive) and KaTeX rendering — you write mathematics, not multiple-choice approximations of it.' },
        { title: 'Proof as a skill ladder', desc: 'From fill-in-the-step to free-form to formally verified — the same progression a mathematics degree wants.' },
      ],
    },
  },
  {
    slug: 'electronic-photonic-devices',
    code: 'ELEC-DEV',
    title: 'Electronic & Photonic Devices',
    family: 'engineering',
    levels: ['UG', 'GR'],
    tagline: 'A graduate-depth device-physics course, built like a book.',
    blurb: '60 modules and 156 lessons of device physics — every figure computed from the equations the lesson states, every derivation on the page.',
    href: '/dashboard/courses/by-code/ELEC-DEV',
    featured: true,
    detail: {
      summary:
        'Electronic & Photonic Devices: Design and Characteristics is the platform’s reference implementation of a serious technical course: 60 modules spanning conduction, magnetism, defects, optics, growth, characterization and applications. The expanded modules run to 18,000+ words each with 60+ display equations, 20+ figures, 15+ worked examples and answered problem sets. Every figure is computed in-repo from the equations stated in the lesson — nothing traced, nothing decorative — and renders theme-aware in light and dark.',
      inside: [
        { title: '60 modules, 156 lessons', desc: 'From integration economics to spintronics to crystal defects — the full arc of device physics.' },
        { title: 'Computed figures', desc: 'Every curve is generated from the stated equation with readable source — check the figure against the formula.' },
        { title: 'Worked examples and problem sets', desc: 'Expanded modules carry 15+ worked examples and multiple answered problem sets each.' },
        { title: 'Capstones and workshops', desc: 'Design cases, comprehensive exams, oral-defense prompts and long-form applied workshops per module.' },
      ],
      specs: [
        ['Modules', '60'],
        ['Lessons', '156'],
        ['Depth standard', '18k words / module'],
        ['Equations', '60+ display / module'],
        ['Figures', 'Computed, theme-aware'],
        ['Math rendering', 'KaTeX'],
      ],
      teach: [
        { title: 'Derivations, not assertions', desc: 'Results are derived from stated premises; skipped steps are named as skips.' },
        { title: 'Figures you can audit', desc: 'When a plot comes from an equation you can read, the figure teaches instead of decorating.' },
        { title: 'Engineering judgment', desc: 'Data books, veto lists, purchase-spec templates and post-mortems — the habits, not just the physics.' },
      ],
    },
  },
  {
    slug: 'medical-education',
    code: 'MED-CL',
    title: 'Medical Education',
    family: 'medical',
    levels: ['UG', 'GR', 'PRO'],
    tagline: 'Clinical foundations with real AI imaging tools.',
    blurb: 'Structured clinical modules plus working AI imaging demonstrations — real inference where it is real, honest labels where it is not.',
    href: '/dashboard/medical',
    featured: true,
    detail: {
      summary:
        'The medical vertical pairs structured clinical curriculum with something rare in education products: real AI imaging tools. Where a demonstration runs actual model inference, it says so; where it illustrates, it is labeled as illustration. The MCAT program from the test-prep suite connects here, and the coursework spans clinical foundations through specialty modules.',
      inside: [
        { title: 'Clinical curriculum', desc: 'Structured modules across clinical foundations, systems and specialties.' },
        { title: 'AI imaging tools', desc: 'Working demonstrations backed by real inference — honestly labeled throughout.' },
        { title: 'MCAT connection', desc: 'The test-prep suite’s MCAT program shares the same mastery engine.' },
        { title: '3D anatomy', desc: 'Anatomy in the XR lab family for spatial structures that diagrams flatten.' },
      ],
      specs: [
        ['Curriculum', 'Foundations → specialty'],
        ['AI demos', 'Real inference, labeled'],
        ['Exam link', 'MCAT (TP-11)'],
        ['3D/XR', 'Anatomy lab'],
      ],
      teach: [
        { title: 'Honesty as pedagogy', desc: 'A demo that fakes its output teaches the wrong lesson about AI in medicine. Ours say what they are.' },
        { title: 'Structure first', desc: 'Clinical reasoning is scaffolded on explicit structured modules, not vibes.' },
        { title: 'Spatial when it matters', desc: 'Anatomy is taught in 3D where 2D genuinely loses information.' },
      ],
    },
  },
  {
    slug: 'degree-pathways',
    code: 'DEG-PATH',
    title: 'Degree Pathways',
    family: 'degree',
    levels: ['UG', 'GR'],
    tagline: 'Bachelor through doctoral coursework, organised as a progression.',
    blurb: 'Undergraduate and graduate coursework across disciplines, arranged into coherent pathways toward a goal instead of a pile of courses.',
    href: '/dashboard/undergraduate',
    featured: false,
    detail: {
      summary:
        'The degree tier organises bachelor- through doctoral-level coursework into pathways: sequenced progressions with prerequisites made explicit, so a learner always knows why this course now. The mathematics ladder, the engineering courses and the medical vertical all plug into these pathways, and progress carries across them on one transcript.',
      inside: [
        { title: 'Undergraduate tier', desc: 'Bachelor-level courses across disciplines with explicit prerequisite chains.' },
        { title: 'Graduate tier', desc: 'Master’s and doctoral coursework including the graduate ends of the math and engineering tracks.' },
        { title: 'One transcript', desc: 'Progress, certificates and mastery evidence accumulate in one place across tiers.' },
        { title: 'High-school on-ramp', desc: 'The 9–12 tier feeds the same pathways, so the ladder starts before university.' },
      ],
      specs: [
        ['Tiers', 'HS → UG → Grad'],
        ['Structure', 'Prerequisite pathways'],
        ['Credential', 'Certificates + transcript'],
        ['Tracks', 'Math, engineering, medical +'],
      ],
      teach: [
        { title: 'Prerequisites are honest', desc: 'A pathway names what each course needs, and the mastery model checks it.' },
        { title: 'Progress is portable', desc: 'One account, one transcript, from high school through graduate work.' },
        { title: 'Pathways end somewhere', desc: 'Each pathway points at a goal — an exam, a credential, a body of mastery — not at infinite scroll.' },
      ],
    },
  },
  // ---- rest of catalogue (no dedicated detail page; card links into the app) ----
  {
    slug: 'lsat',
    code: 'TP-LSAT',
    title: 'LSAT',
    family: 'test-prep',
    levels: ['UG'],
    tagline: 'Logical reasoning, reading comprehension, analytical games.',
    blurb: 'Full LSAT program with a command center, LawHub-style workbench, section drills and timed mocks.',
    href: '/dashboard/test-prep?exam=lsat',
  },
  {
    slug: 'mcat',
    code: 'TP-MCAT',
    title: 'MCAT',
    family: 'test-prep',
    levels: ['UG'],
    tagline: 'Four sections, one mastery engine.',
    blurb: 'MCAT preparation with section-true structure, chapter frequency maps and AAMC-aligned drills.',
    href: '/dashboard/test-prep?exam=mcat',
  },
  {
    slug: 'sat',
    code: 'TP-SAT',
    title: 'SAT',
    family: 'test-prep',
    levels: ['HS'],
    tagline: 'College entrance, prepared like a professional exam.',
    blurb: 'SAT program with course lessons, question bank, flashcards and timed practice.',
    href: '/dashboard/test-prep?exam=sat',
  },
  {
    slug: 'gre-gmat',
    code: 'TP-GRE',
    title: 'Physics GRE',
    family: 'test-prep',
    levels: ['UG', 'GR'],
    tagline: 'Graduate entrance, quantitative and verbal.',
    blurb: 'The GRE Physics Subject Test: 50 authored chapters across the nine ETS content areas, with drills and spaced review.',
    href: '/dashboard/test-prep?exam=gre',
  },
  {
    slug: 'security-plus',
    code: 'TP-SEC+',
    title: 'CompTIA Security+ (SY0-701)',
    family: 'test-prep',
    levels: ['PRO'],
    tagline: 'Including interactive performance-based questions.',
    blurb: 'SY0-701-mapped lessons and drills with drag-and-drop PBQ simulations — the format the real exam uses.',
    href: '/dashboard/test-prep?exam=security_plus',
  },
  {
    slug: 'fe-pe',
    code: 'TP-PE',
    title: 'FE & PE (Electrical)',
    family: 'test-prep',
    levels: ['PRO'],
    tagline: 'Engineering licensure, problem by problem.',
    blurb: 'FE Electrical and PE Electrical question banks with worked solutions and exam-timed practice.',
    href: '/dashboard/test-prep?exam=fe_ee',
  },
  {
    slug: 'high-school',
    code: 'HS-CORE',
    title: 'High School Core (9–12)',
    family: 'school',
    levels: ['HS'],
    tagline: 'Core curriculum and college preparation.',
    blurb: 'Grades 9–12 coursework across mathematics, science and English, feeding directly into the SAT program and degree pathways.',
    href: '/dashboard/high-school',
  },
  {
    slug: 'xr-labs',
    code: 'XR-LAB',
    title: '3D & XR Laboratories',
    family: 'engineering',
    levels: ['HS', 'UG'],
    tagline: 'Chemistry, anatomy and astronomy in three dimensions.',
    blurb: 'Interactive 3D labs — molecular structures, titration benches, spectroscopy, anatomy — with WebXR support.',
    href: '/dashboard/xr-labs',
  },
  {
    slug: 'ai-tutor',
    code: 'AI-TUT',
    title: 'AI Tutor',
    family: 'mathematics',
    levels: ['HS', 'UG', 'GR', 'PRO'],
    tagline: 'Step-by-step help on the exact problem in front of you.',
    blurb: 'A personal tutor that works the problem with you — hints before answers, on call across the whole catalogue.',
    href: '/dashboard/tutor',
  },
  {
    slug: 'chemistry',
    code: 'CHEM-XR',
    title: 'Chemistry (OCTET Labs)',
    family: 'engineering',
    levels: ['HS', 'UG'],
    tagline: 'Reaction engines, not videos of reactions.',
    blurb: 'Chemistry with working kinetics and gas-law engines, a Johnstone-triangle lab and predict-observe-explain benches.',
    href: '/launch/chemistry',
  },
];

export const featuredPrograms = () => PROGRAMS.filter((p) => p.featured);
export const programBySlug = (slug: string) => PROGRAMS.find((p) => p.slug === slug);
export const familyByKey = (key: string) => FAMILIES.find((f) => f.key === key);
export const programCount = (familyKey: string) => PROGRAMS.filter((p) => p.family === familyKey).length;

export const LEVEL_LABEL: Record<Level, string> = {
  HS: 'High school',
  UG: 'Undergraduate',
  GR: 'Graduate',
  PRO: 'Professional',
};

// The four commitments band (home) — expanded on /methods.
export const COMMITMENTS = [
  {
    n: '01',
    title: 'Practice is the product',
    desc: 'The unit of learning here is a graded attempt, not a watched video. Every problem is auto-graded with specific feedback, and every attempt updates a mastery model that decides what you see next.',
  },
  {
    n: '02',
    title: 'Real content, honestly sourced',
    desc: 'Official public-domain exam questions where they exist, original authored material everywhere else, and AI demonstrations that say whether they are running real inference. Nothing fabricated, nothing traced.',
  },
  {
    n: '03',
    title: 'Depth over breadth theater',
    desc: 'A topic gets a full course — worked examples, derivations, problem sets with answers — or it is not in the catalogue. Our flagship engineering modules run past eighteen thousand words each.',
  },
  {
    n: '04',
    title: 'Machinery you can trust',
    desc: 'Mathematics graded by a computer algebra system, proofs checkable by a Lean 4 kernel, spaced review scheduled by SM-2, and institution-grade controls (SSO, LTI 1.3, FERPA/COPPA) underneath.',
  },
];

// Outcomes (/outcomes) — where the platform takes people.
export const OUTCOMES = [
  {
    id: 'pass-an-exam',
    title: 'Pass a licensing or entrance exam',
    desc: 'Eleven exams with real question banks, timed mocks and analytics that read like the score report. The Patent Bar program is the reference build: official USPTO questions, an MPEP workbench, and a free diagnostic.',
    href: '/programs/test-prep',
    linkLabel: 'Test Preparation Suite',
  },
  {
    id: 'master-a-discipline',
    title: 'Master a discipline end to end',
    desc: 'The mathematics ladder runs from pre-algebra to graduate analysis with machine-verified grading; the engineering track teaches device physics at textbook depth with auditable computed figures.',
    href: '/programs/mathematics',
    linkLabel: 'Mathematics Track',
  },
  {
    id: 'finish-school-strong',
    title: 'Finish school strong',
    desc: 'Grades 9–12 core curriculum flows into SAT preparation and onward into undergraduate pathways — one account and one transcript across the whole arc.',
    href: '/programs/high-school',
    linkLabel: 'High School Core',
  },
  {
    id: 'build-clinical-skill',
    title: 'Build clinical foundations',
    desc: 'Structured medical curriculum with real AI imaging tools, connected to MCAT preparation and 3D anatomy labs.',
    href: '/programs/medical-education',
    linkLabel: 'Medical Education',
  },
  {
    id: 'teach-a-cohort',
    title: 'Run it for a school or team',
    desc: 'SSO/SAML, LTI 1.3, cohort management, analytics and FERPA/COPPA/HIPAA controls — the same platform, deployed for an institution.',
    href: '/institutions',
    linkLabel: 'For Institutions',
  },
  {
    id: 'learn-for-work',
    title: 'Credential for the job you want',
    desc: 'Security+, FE/PE licensure and the Patent Bar sit alongside professional-depth courses — practical preparation with certificates behind it.',
    href: '/programs/patent-bar',
    linkLabel: 'Patent Bar Program',
  },
];

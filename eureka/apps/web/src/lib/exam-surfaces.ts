/**
 * What each exam actually has, so a dashboard can only offer what exists.
 *
 * The tiles on an exam's home page are promises. "Question bank - 610
 * questions" has to be 610 real questions; "Full exam simulation" has to
 * open a simulation. Before this module the per-exam page decided that with
 * a scatter of `isFEEE || isFEME || isPEEE` conditionals and a QBANK_SIZES
 * map buried 2,300 lines in, and there was no way for a second surface to
 * ask the same questions without repeating the conditionals and drifting.
 *
 * Everything here is a statement about the repository, checkable by
 * grepping for the file it names. Nothing is aspirational: an exam that has
 * no simulation says `fullExam: false` and the tile does not render, rather
 * than rendering and landing on an empty page.
 */

export interface ExamExtra {
  /** Path suffix under /dashboard/test-prep/<exam>/ */
  path: string;
  label: string;
  blurb: string;
}

export interface ExamSurfaces {
  /**
   * Questions in the static bank. Kept identical to QBANK_SIZES in the
   * per-exam page, which is the map the QBank slider is bounded by - two
   * numbers for the same bank would be a bug waiting to happen, so both
   * read this.
   */
  qbankSize: number;
  /** The bank is served and graded by the server rather than shipped to the
   *  browser. True only for MCAT today (bank mcat-qbank-v1). */
  serverGraded?: boolean;
  /** A timed full-length simulation exists behind the 'exam' tab. */
  fullExam: boolean;
  /** A per-exam analytics surface exists behind the 'analytics' tab. */
  analytics: boolean;
  /** Deck size, when a flashcard deck exists. */
  flashcards?: number;
  /** Routes that belong to this exam alone. */
  extras: ExamExtra[];
}

/**
 * PATENT_BAR = 536 authored + 270 gap-fill + 828 official released USPTO
 * questions. The official set spans nine sitting dates, AM and PM; see
 * docs and the uspto-*-data.ts files. Every other count is the length of
 * that exam's single qbank data file.
 */
export const EXAM_SURFACES: Record<string, ExamSurfaces> = {
  MCAT: {
    qbankSize: 580,
    serverGraded: true,
    fullExam: true,
    analytics: true,
    flashcards: 501,
    extras: [
      {
        path: '/chemistry',
        label: 'Generated chemistry',
        blurb:
          'Fresh items from the OCTET engine, every answer key machine-verified, misses diagnosed by misconception.',
      },
    ],
  },
  PATENT_BAR: {
    qbankSize: 1634,
    fullExam: false,
    analytics: false,
    extras: [
      {
        path: '/patent-program',
        label: 'Full program',
        blurb: 'The whole registration-exam programme in study order.',
      },
      {
        path: '/command-center',
        label: 'Analytics & SRS',
        blurb: 'MPEP weakness analytics, time against accuracy, review queue.',
      },
      {
        path: '/mpep-workbench',
        label: 'MPEP workbench',
        blurb: 'Exam-style MPEP reader with tabs and bookmarks.',
      },
      {
        path: '/review-queue',
        label: 'SME review queue',
        blurb: 'Items awaiting subject-matter-expert sign-off.',
      },
      {
        path: '/live',
        label: 'Live instruction',
        blurb: 'Scheduled sessions and recordings.',
      },
    ],
  },
  LSAT: {
    qbankSize: 200,
    fullExam: false,
    analytics: false,
    extras: [
      {
        path: '/lsat-program',
        label: 'Full program',
        blurb: 'The whole LSAT programme in study order.',
      },
      {
        path: '/lsat-analytics',
        label: 'Analytics & SRS',
        blurb: 'Question-type weakness, LR against RC pacing.',
      },
      {
        path: '/lawhub-workbench',
        label: 'LawHub workbench',
        blurb: 'Passage reader with a question-type heatmap.',
      },
      {
        path: '/lsat-live',
        label: 'Live instruction',
        blurb: 'Scheduled sessions and recordings.',
      },
    ],
  },
  CISSP: { qbankSize: 400, fullExam: false, analytics: false, extras: [] },
  SECURITY_PLUS: {
    qbankSize: 472,
    fullExam: true,
    analytics: true,
    extras: [],
  },
  FE_EE: { qbankSize: 610, fullExam: true, analytics: true, extras: [] },
  FE_ME: { qbankSize: 554, fullExam: true, analytics: true, extras: [] },
  PE_EE: { qbankSize: 399, fullExam: true, analytics: true, extras: [] },
  SAT: { qbankSize: 139, fullExam: false, analytics: false, extras: [] },
  // The id stays GRE while the product is the Physics Subject Test: it is
  // the key in URLs, in user_progress rows and in the billing products, and
  // renaming a key to match a label would orphan every one of them.
  //
  // 53 questions is a small bank against the 1,634 of Patent Bar. It is
  // stated rather than rounded up because a learner deciding where to spend
  // an evening deserves the real number.
  GRE: { qbankSize: 53, fullExam: false, analytics: false, flashcards: 100, extras: [] },
  // NCLEX_RN = 41 dosage-calculation items with machine-verified keys (two
  // independent computation paths, gated in CI by nclex-dosage-verify.test.ts)
  // + 90 authored clinical items pending SME review, split across
  // nclex-qbank-data.ts and nclex-qbank-clinical2-data.ts.
  NCLEX_RN: { qbankSize: 131, fullExam: false, analytics: false, flashcards: 90, extras: [] },
};

const NONE: ExamSurfaces = {
  qbankSize: 0,
  fullExam: false,
  analytics: false,
  extras: [],
};

export function getExamSurfaces(examType: string): ExamSurfaces {
  return EXAM_SURFACES[examType] ?? NONE;
}

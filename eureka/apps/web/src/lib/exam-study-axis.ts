/**
 * The axis a course is studied on, for every exam.
 *
 * A prep course needs one organising spine: the list of units a learner
 * works through, in order, each with its chapters. For most exams that
 * spine is already the curriculum's own sections - a CISSP learner studies
 * Domain 1 then Domain 2, an FE EE learner works down the NCEES topic list.
 * The section IS the study unit, and inventing a second layer of "subjects"
 * on top of it would be decoration, not information.
 *
 * MCAT is the exception, and the reason this module exists. The AAMC
 * administers four sections, but nobody studies that way: you study
 * biochemistry, then physics, then sociology. `mcat-subjects.ts` carries
 * that second view - the same 29 topics regrouped into the seven subjects
 * every serious prep course uses - and this module hands it back for MCAT
 * while deriving the axis straight from the curriculum for everything else.
 *
 * Nothing here invents content. Every unit's topic ids come from
 * `exam-curriculum.ts`, so a chapter that appears in the rail is a chapter
 * that exists.
 */

import { getCurriculum } from '@/lib/exam-curriculum';
import { getExamConfig } from '@/lib/exam-config';
import { MCAT_SUBJECTS } from '@/lib/mcat-subjects';

export interface StudyUnit {
  id: string;
  name: string;
  /** One line on what this unit covers. Empty when the source has none. */
  blurb: string;
  /**
   * How much of the exam this unit carries, phrased as its source phrases
   * it. Empty when no published weight is available - we do not estimate
   * one.
   */
  examShare: string;
  /** Tailwind accent key, used for the rail. Decoration: the label carries
   *  identity, so repeating a hue past the palette length is harmless. */
  accent: string;
  /** Topic ids in teaching order. Every one exists in exam-curriculum. */
  topicIds: string[];
  kind: 'subject' | 'skill' | 'section';
}

const PALETTE = [
  'emerald', 'sky', 'violet', 'amber', 'rose',
  'teal', 'indigo', 'slate',
];

/**
 * Several curricula carry the published weight inside the section name -
 * "Mathematics (7%)", "Statics (8%)". Pull it out so the rail can show the
 * weight as a weight and the name as a name.
 */
function splitWeight(name: string): { name: string; share: string } {
  const m = name.match(/^(.*?)\s*\((\d+(?:\.\d+)?%)\)\s*$/);
  return m ? { name: m[1], share: `${m[2]} of the exam` } : { name, share: '' };
}

/**
 * The study axis for an exam. Returns [] when the exam has no curriculum,
 * which the caller should treat as "no course to show" rather than as an
 * error - it is how a newly configured exam looks before content lands.
 */
export function getStudyAxis(examType: string): StudyUnit[] {
  if (examType === 'MCAT') {
    return MCAT_SUBJECTS.map((s) => ({
      id: s.id,
      name: s.name,
      blurb: s.blurb,
      examShare: s.examShare,
      accent: s.accent,
      topicIds: s.topicIds,
      kind: s.kind,
    }));
  }

  const curriculum = getCurriculum(examType);
  const config = getExamConfig(examType);

  return curriculum.map((section, i) => {
    const { name, share } = splitWeight(section.sectionName);
    // When the config knows this section, prefer its published counts over
    // a percentage parsed out of a label.
    const cfg = config.sections.find((s) => s.id === section.sectionId);
    const fromConfig = cfg?.questionCount
      ? `${cfg.questionCount} question${cfg.questionCount === 1 ? '' : 's'} on the exam` +
        (cfg.timeMinutes ? ` · ${cfg.timeMinutes} min` : '')
      : '';
    return {
      id: section.sectionId,
      name,
      blurb: '',
      examShare: fromConfig || share,
      accent: PALETTE[i % PALETTE.length],
      topicIds: section.topics.map((t) => t.id),
      kind: 'section' as const,
    };
  });
}

/** Total chapters on the axis. */
export function countChapters(axis: StudyUnit[]): number {
  return axis.reduce((n, u) => n + u.topicIds.length, 0);
}

/**
 * How the course describes its own shape, in one clause. MCAT's axis is a
 * regrouping and says so; everywhere else the units are the exam's own
 * sections and the sentence should not pretend otherwise.
 */
export function axisNoun(examType: string, axis: StudyUnit[]): string {
  if (examType === 'MCAT') return `${axis.length} subjects`;
  return `${axis.length} section${axis.length === 1 ? '' : 's'}`;
}

/** localStorage key holding the ids of chapters marked read, per exam. */
export function readChaptersKey(examType: string): string {
  return `${examType.toLowerCase()}_study_read_chapters`;
}

/**
 * Every curriculum topic must appear on the axis exactly once. Returns the
 * problems rather than throwing: a gap is a content bug, not a crash.
 */
export function assertAxisCoverage(examType: string): {
  missing: string[];
  duplicated: string[];
  unknown: string[];
} {
  const real = new Set(
    getCurriculum(examType).flatMap((s) => s.topics.map((t) => t.id)),
  );
  const seen = new Map<string, number>();
  for (const u of getStudyAxis(examType)) {
    for (const id of u.topicIds) seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  return {
    missing: [...real].filter((id) => !seen.has(id)),
    duplicated: [...seen].filter(([, n]) => n > 1).map(([id]) => id),
    unknown: [...seen.keys()].filter((id) => !real.has(id)),
  };
}

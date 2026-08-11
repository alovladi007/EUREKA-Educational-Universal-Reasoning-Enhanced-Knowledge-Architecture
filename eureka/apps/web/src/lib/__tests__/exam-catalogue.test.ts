/**
 * Invariants of the exam catalogue.
 *
 * Three things must stay true no matter who edits the data files next:
 *   1. There are ten exams, and GMAT is not one of them.
 *   2. Every exam's study axis covers its curriculum exactly once, so the
 *      course rail can never silently drop or duplicate a chapter.
 *   3. Every chapter on the axis has written material behind it, so a rail
 *      entry is never a dead link to an empty book.
 *
 * (3) is the one that catches content regressions: adding a topic to the
 * curriculum without authoring its lesson fails here rather than in front
 * of a learner.
 */
import { describe, expect, it } from 'vitest';

import { EXAM_CONFIGS, EXAM_TYPE_LIST } from '@/lib/exam-config';
import { EXAM_CURRICULA, getCurriculum } from '@/lib/exam-curriculum';
import { getStudyAxis, assertAxisCoverage, countChapters } from '@/lib/exam-study-axis';
import { getExamSurfaces } from '@/lib/exam-surfaces';
import { loadExamCourse } from '@/lib/exam-course-loader';

const EXAM_IDS = Object.keys(EXAM_CONFIGS);

describe('the catalogue', () => {
  it('has exactly ten exams', () => {
    expect(EXAM_IDS).toHaveLength(10);
    expect(EXAM_TYPE_LIST).toHaveLength(10);
  });

  it('does not include GMAT', () => {
    expect(EXAM_IDS).not.toContain('GMAT');
    expect(Object.keys(EXAM_CURRICULA)).not.toContain('GMAT');
  });

  it('names the GRE entry as the Physics Subject Test', () => {
    // The id stays GRE (URLs, user_progress rows, billing products all key
    // off it) while the product is the physics test.
    expect(EXAM_CONFIGS.GRE.name).toMatch(/Physics/);
    expect(EXAM_CONFIGS.GRE.shortName).toBe('Physics GRE');
    expect(EXAM_CONFIGS.GRE.sections.map((s) => s.id)).toContain('quantum_mechanics');
  });

  it('gives every exam a curriculum', () => {
    for (const id of EXAM_IDS) {
      expect(getCurriculum(id).length, `${id} has no curriculum`).toBeGreaterThan(0);
    }
  });
});

describe('the study axis', () => {
  for (const id of EXAM_IDS) {
    it(`${id}: covers every curriculum topic exactly once`, () => {
      const gaps = assertAxisCoverage(id);
      expect(gaps.missing, `${id} topics missing from the axis`).toEqual([]);
      expect(gaps.duplicated, `${id} topics listed twice`).toEqual([]);
      expect(gaps.unknown, `${id} axis names topics that do not exist`).toEqual([]);
    });
  }

  it('counts the same chapters as the curriculum', () => {
    for (const id of EXAM_IDS) {
      const fromCurriculum = getCurriculum(id).reduce(
        (n, s) => n + s.topics.length, 0,
      );
      expect(countChapters(getStudyAxis(id)), id).toBe(fromCurriculum);
    }
  });

  it('regroups MCAT into subjects and leaves the others on their sections', () => {
    const mcat = getStudyAxis('MCAT');
    expect(mcat.every((u) => u.kind === 'subject' || u.kind === 'skill')).toBe(true);
    expect(mcat).toHaveLength(8); // seven subjects plus CARS as a skill

    for (const id of EXAM_IDS.filter((e) => e !== 'MCAT')) {
      const axis = getStudyAxis(id);
      expect(axis.every((u) => u.kind === 'section'), id).toBe(true);
      expect(axis).toHaveLength(getCurriculum(id).length);
    }
  });
});

describe('written material', () => {
  it('exists for every chapter on every axis', async () => {
    const gaps: string[] = [];
    for (const id of EXAM_IDS) {
      const pack = await loadExamCourse(id);
      for (const unit of getStudyAxis(id)) {
        for (const topicId of unit.topicIds) {
          if (!pack.has(topicId)) gaps.push(`${id}/${topicId}`);
        }
      }
    }
    // A rail entry with no lesson behind it renders "no written content
    // yet" to a learner who was just told the chapter was there.
    expect(gaps).toEqual([]);
  });
});

describe('the surface map', () => {
  it('describes every exam', () => {
    for (const id of EXAM_IDS) {
      const s = getExamSurfaces(id);
      // A zero bank is allowed and meaningful; an absent entry is not,
      // because the dashboard would then silently offer nothing.
      expect(typeof s.qbankSize, id).toBe('number');
      expect(Array.isArray(s.extras), id).toBe(true);
    }
  });

  it('only marks MCAT as server-graded', () => {
    for (const id of EXAM_IDS) {
      expect(Boolean(getExamSurfaces(id).serverGraded), id).toBe(id === 'MCAT');
    }
  });
});

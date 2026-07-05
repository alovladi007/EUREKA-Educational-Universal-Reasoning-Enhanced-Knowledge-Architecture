/**
 * Per-exam course-content lazy loader (P3-C / task #62).
 *
 * Background: `apps/web/src/app/dashboard/test-prep/[exam]/page.tsx`
 * used to import all 8 per-exam course-data modules at the top:
 *
 *   import { getCISSPCourseContent }       from '@/lib/cissp-course-data';
 *   import { getSecurityPlusCourseContent } from '@/lib/security-plus-course-data';
 *   import { getPatentBarCourseContent }    from '@/lib/patent-bar-course-data';
 *   // ... 5 more
 *
 * Each of those modules is multi-thousand lines (patent-bar is 13,181
 * lines on its own). The page renders only ONE exam at a time, but
 * every visitor shipped all 8. ~80 KB of gzipped JS for the course
 * data alone before the QBank+flashcard chunks even start.
 *
 * This module gives the page a single `loadExamCourse(examType)`
 * entry point that returns just the active exam's bundle. Next.js
 * code-splits each dynamic import into its own chunk, so PATENT_BAR
 * users no longer download MCAT/LSAT/CISSP/etc.
 *
 * Shape: every per-exam module exports `<NAME>_COURSE` (a
 * Record<topicId, TopicLesson>) and `has*CourseContent` /
 * `get*CourseContent` helpers. We normalize to a tiny CoursePack with
 * `get(id)` and `has(id)` so call sites are uniform.
 */

import type { TopicLesson } from '@/lib/cissp-course-data';

export interface CoursePack {
  get: (topicId: string) => TopicLesson | null;
  has: (topicId: string) => boolean;
}

const EMPTY_PACK: CoursePack = {
  get: () => null,
  has: () => false,
};

/**
 * Resolve the per-exam course bundle. Returns the EMPTY pack for
 * exams without a course-data module yet.
 *
 * Each branch dynamically imports a SINGLE module so webpack/Next
 * emits one chunk per exam. The branches that exist mirror the eight
 * `is<Exam>` checks the page used to do top-level.
 */
export async function loadExamCourse(examType: string): Promise<CoursePack> {
  switch (examType) {
    case 'CISSP': {
      const m = await import('@/lib/cissp-course-data');
      return { get: m.getCISSPCourseContent, has: m.hasCISSPCourseContent };
    }
    case 'SECURITY_PLUS': {
      const m = await import('@/lib/security-plus-course-data');
      return {
        get: m.getSecurityPlusCourseContent,
        has: m.hasSecurityPlusCourseContent,
      };
    }
    case 'PATENT_BAR': {
      const m = await import('@/lib/patent-bar-course-data');
      return {
        get: m.getPatentBarCourseContent,
        has: m.hasPatentBarCourseContent,
      };
    }
    case 'FE_EE': {
      const m = await import('@/lib/fe-ee-course-data');
      return { get: m.getFEEECourseContent, has: m.hasFEEECourseContent };
    }
    case 'FE_ME': {
      const m = await import('@/lib/fme-course-data');
      return { get: m.getFMECourseContent, has: m.hasFMECourseContent };
    }
    case 'PE_EE': {
      const m = await import('@/lib/pe-ee-course-data');
      return { get: m.getPEEECourseContent, has: m.hasPEEECourseContent };
    }
    case 'MCAT': {
      const m = await import('@/lib/mcat-course-data');
      return { get: m.getMCATCourseContent, has: m.hasMCATCourseContent };
    }
    case 'LSAT': {
      const m = await import('@/lib/lsat-course-data');
      return { get: m.getLsatCourseContent, has: m.hasLsatCourseContent };
    }
    case 'GRE': {
      const m = await import('@/lib/gre-course-data');
      return { get: m.getGRECourseContent, has: m.hasGRECourseContent };
    }
    case 'SAT': {
      const m = await import('@/lib/sat-course-data');
      return { get: m.getSATCourseContent, has: m.hasSATCourseContent };
    }
    case 'GMAT': {
      const m = await import('@/lib/gmat-course-data');
      return { get: m.getGMATCourseContent, has: m.hasGMATCourseContent };
    }
    default:
      return EMPTY_PACK;
  }
}

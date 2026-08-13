'use client';

/**
 * Test Prep home.
 *
 * This route used to be the first of two stacked dashboards. It showed a
 * welcome card with a "Readiness Score" and a "Predicted Score" that read
 * N/A for every exam and every learner because nothing ever populated
 * them, four Quick Action tiles, a "Performance Overview" grid that
 * repeated three figures from the card above it and added a streak
 * hardcoded to zero, and a performance chart. Behind all of it sat
 * /dashboard/test-prep/<exam>, a second page of cards and tabs, and only
 * then the actual course.
 *
 * Now both routes render the same exam home. Whichever way you arrive -
 * the sidebar, the exam pill, a bookmark - you land on one page with one
 * next action, and every figure on it comes from an answer you gave.
 *
 * The removed panels are in git history rather than commented out here.
 * If any of them is wanted back it should return as a tile on the exam
 * home wired to real data, not as another page in front of it.
 */

import React from 'react';
import { PatentBarCohortPanel } from '@/components/test-prep/patent/PatentBarCohortPanel';
import { NclexExamFactsPanel } from '@/components/test-prep/nclex/NclexExamFactsPanel';
import { ExamDashboard } from '@/components/test-prep/ExamDashboard';
import { examSummaryLine } from '@/lib/exam-config';
import { useActiveExam } from '@/hooks/use-active-exam';

export default function TestPrepDashboard() {
  // The platform-wide active exam (URL ?exam= → localStorage → default).
  const { examType, examConfig } = useActiveExam();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{examConfig.shortName}</h1>
        <p className="text-muted-foreground">
          {examConfig.name} &middot; {examSummaryLine(examType)}
        </p>
      </div>

      <ExamDashboard examSlug={examType.toLowerCase()} />

      {/* Real cohort data rather than navigation, so it stays. */}
      {examType === 'PATENT_BAR' && <PatentBarCohortPanel />}

      {/* NCSBN-published pass rates + the frozen 2026-2029 test-plan
          blueprint. Sourced statistics, not platform-invented metrics. */}
      {examType === 'NCLEX_RN' && <NclexExamFactsPanel />}
    </div>
  );
}

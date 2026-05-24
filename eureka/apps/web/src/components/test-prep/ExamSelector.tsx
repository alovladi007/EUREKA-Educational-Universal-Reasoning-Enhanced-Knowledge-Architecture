/**
 * ExamSelector — exam picker that drives `useActiveExam`.
 *
 * Two visual modes:
 *   variant="pill"    — Compact pill for the layout sub-nav strip. Shows
 *                       short name (e.g. "Patent Bar") with a chevron.
 *   variant="card"    — Full card for the top of a page (Practice, Analytics,
 *                       Study Plan, Exam). Shows long name + section count +
 *                       link into the exam workspace.
 *
 * Both render a native <select> for accessibility and to avoid wrestling
 * with a custom dropdown on mobile. The visual style is matched to the rest
 * of the test-prep UI.
 */

'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, ChevronRight, ArrowRight } from 'lucide-react';
import { EXAM_TYPE_LIST } from '@/lib/exam-config';
import { useActiveExam } from '@/hooks/use-active-exam';

export interface ExamSelectorProps {
  variant?: 'pill' | 'card';
  /** Optional override of the exam list ordering / filtering. */
  exams?: typeof EXAM_TYPE_LIST;
  /** When true, hide the "Open workspace" CTA on the card. */
  hideWorkspaceLink?: boolean;
}

export function ExamSelector({ variant = 'card', exams, hideWorkspaceLink }: ExamSelectorProps) {
  const { examType, examConfig, setActiveExam, isHydrated } = useActiveExam();
  const list = exams ?? EXAM_TYPE_LIST;

  if (variant === 'pill') {
    return (
      <label className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm shadow-sm">
        <GraduationCap className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Active exam:</span>
        <select
          value={examType}
          onChange={(e) => setActiveExam(e.target.value)}
          className="bg-transparent font-semibold focus:outline-none cursor-pointer"
          aria-label="Active exam"
        >
          {list.map((e) => (
            <option key={e.id} value={e.id}>
              {e.shortName}
            </option>
          ))}
        </select>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
      </label>
    );
  }

  return (
    <Card className="p-4 sm:p-5 border-primary/15 bg-gradient-to-br from-primary/[0.02] to-transparent">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-[260px]">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <label htmlFor="active-exam" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Active exam
              </label>
              {isHydrated && (
                <Badge variant="outline" className="text-[10px] font-mono">
                  {examConfig.sections.length} section{examConfig.sections.length === 1 ? '' : 's'}
                </Badge>
              )}
            </div>
            <select
              id="active-exam"
              value={examType}
              onChange={(e) => setActiveExam(e.target.value)}
              className="mt-1 w-full sm:w-auto bg-transparent text-lg font-bold focus:outline-none cursor-pointer pr-2"
              aria-label="Active exam"
            >
              {list.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{examConfig.description}</p>
          </div>
        </div>
        {!hideWorkspaceLink && (
          <Link
            href={`/dashboard/test-prep/${examType}`}
            className="inline-flex items-center"
          >
            <Button variant="default" size="sm" className="gap-1.5">
              Open {examConfig.shortName} workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}

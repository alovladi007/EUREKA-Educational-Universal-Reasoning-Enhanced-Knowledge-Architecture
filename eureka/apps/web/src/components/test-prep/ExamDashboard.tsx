'use client';

/**
 * The exam home page, for every exam.
 *
 * What it replaced: two stacked dashboards. The generic test-prep overview
 * showed Readiness Score / Predicted Score cards that read N/A because the
 * numbers behind them were removed for being invented. Behind that sat a
 * second page of cards and a strip of tabs, and only then the actual
 * course.
 *
 * What this is: one page that answers "where am I and what do I do next",
 * with every figure coming from a recorded answer and every tile leading to
 * something that exists. Where there is no data yet it says so - a new
 * account should see an honest empty state, not a dashboard of zeros
 * pretending to be telemetry.
 *
 * Two data paths, because the exams genuinely differ:
 *   MCAT      the server-side bank, simulator and review log built in
 *             Phase 9 - /mcat/review/summary, /mcat/review/missed and
 *             /mcat/mock/history.
 *   the rest  user_progress, which every static bank writes to after each
 *             answered question, read back through /me/progress/summary,
 *             plus the QBank session history.
 * Neither path estimates anything. Where an exam has no simulator or no
 * bank, `exam-surfaces.ts` says so and the tile does not render.
 */

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, BarChart3, BookOpen, FlaskConical, GraduationCap, Layers,
  Library, ListChecks, StickyNote, Timer, Video,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { getCurriculum } from '@/lib/exam-curriculum';
import { getExamConfig } from '@/lib/exam-config';
import { getExamSurfaces } from '@/lib/exam-surfaces';
import {
  getStudyAxis, countChapters, readChaptersKey,
} from '@/lib/exam-study-axis';

type McatSummary = Awaited<ReturnType<typeof apiClient.getMcatReviewSummary>>;
type McatMissed = Awaited<ReturnType<typeof apiClient.getMcatReviewMissed>>;
type McatHistory = Awaited<ReturnType<typeof apiClient.getMcatMockHistory>>;
type ProgressSummary = Awaited<ReturnType<typeof apiClient.getProgressSummary>>;

/** A section is not called weakest on two answers. Five is still small, but
 *  it is the point where a miss stops being a coin flip. */
const MIN_ATTEMPTS_TO_NAME_WEAKEST = 5;

interface Figures {
  /** Graded answers on record. null when the source could not be read. */
  answered: number | null;
  correct: number | null;
  /** Timed sittings completed. null when the exam has no simulator. */
  sittings: number | null;
  /** Questions the learner's latest answer got wrong. */
  toReview: number;
  /** Weakest unit, only once it clears the attempts floor. */
  weakest: { label: string; correct: number; attempts: number } | null;
}

const EMPTY: Figures = {
  answered: null, correct: null, sittings: null, toReview: 0, weakest: null,
};

export function ExamDashboard({ examSlug }: { examSlug: string }) {
  const exam = examSlug.toUpperCase();
  const config = getExamConfig(exam);
  const surfaces = getExamSurfaces(exam);
  const axis = React.useMemo(() => getStudyAxis(exam), [exam]);

  const [read, setRead] = React.useState<Set<string>>(new Set());
  const [figures, setFigures] = React.useState<Figures>(EMPTY);

  const chapters = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const s of getCurriculum(exam)) {
      for (const t of s.topics) m.set(t.id, t.title);
    }
    return m;
  }, [exam]);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(readChaptersKey(exam));
      setRead(saved ? new Set(JSON.parse(saved)) : new Set());
    } catch {
      setRead(new Set());
    }
    setFigures(EMPTY);

    let live = true;
    void (async () => {
      const next = { ...EMPTY };
      if (exam === 'MCAT') {
        const [summary, missed, history] = await Promise.all([
          apiClient.getMcatReviewSummary().catch(() => null as McatSummary | null),
          apiClient.getMcatReviewMissed(5).catch(() => null as McatMissed | null),
          apiClient.getMcatMockHistory().catch(() => null as McatHistory | null),
        ]);
        if (summary) {
          next.answered = summary.by_section.reduce((n, s) => n + s.attempts, 0);
          next.correct = summary.by_section.reduce((n, s) => n + s.correct, 0);
          const w = summary.by_section
            .filter((s) => s.attempts >= MIN_ATTEMPTS_TO_NAME_WEAKEST)
            .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))[0];
          // section is nullable server-side: an attempt logged before the
          // item carried a section has no label to show.
          if (w?.section) {
            next.weakest = {
              label: w.section, correct: w.correct, attempts: w.attempts,
            };
          }
        }
        next.toReview = missed?.missed.length ?? 0;
        next.sittings = history
          ? history.attempts.filter((a) => a.status === 'submitted').length
          : null;
      } else {
        const summary = await apiClient
          .getProgressSummary(exam)
          .catch(() => null as ProgressSummary | null);
        if (summary) {
          next.answered = summary.total_attempts;
          next.correct = summary.total_correct;
          const w = (summary.weakest_topics ?? [])
            .filter((t) => t.attempts >= MIN_ATTEMPTS_TO_NAME_WEAKEST)[0];
          if (w) {
            next.weakest = {
              label: chapters.get(w.topic_id) ?? w.topic_id,
              correct: w.correct,
              attempts: w.attempts,
            };
          }
        }
        // Only exams with a simulator get a sitting count; the rest keep
        // null, and the tile that would show it does not render.
        if (surfaces.fullExam) {
          const history = await apiClient.getQBankHistory(exam).catch(() => null);
          const sessions: Array<{ mode?: string }> = history?.sessions ?? [];
          next.sittings = sessions.filter((s) => s.mode === 'exam').length;
        }
      }
      if (live) setFigures(next);
    })();
    return () => { live = false; };
  }, [exam, surfaces.fullExam, chapters]);

  const totalChapters = countChapters(axis);
  const chaptersRead = axis.reduce(
    (n, u) => n + u.topicIds.filter((t) => read.has(t)).length, 0,
  );
  const pct = totalChapters ? Math.round((chaptersRead / totalChapters) * 100) : 0;

  // The next unread chapter, in course order. This is the whole point of
  // the page: one button that resumes the course.
  const next = React.useMemo(() => {
    for (const u of axis) {
      for (const id of u.topicIds) {
        if (!read.has(id)) return { unit: u, id, title: chapters.get(id) ?? id };
      }
    }
    return null;
  }, [axis, read, chapters]);

  const { answered, correct, sittings, toReview, weakest } = figures;
  const accuracy =
    answered && correct !== null ? Math.round((correct / answered) * 100) : null;

  const href = (p: string) => `/dashboard/test-prep/${examSlug}${p}`;
  const qbankHref = exam === 'MCAT' ? href('/qbank') : href('?tab=qbank');
  const examHref = exam === 'MCAT' ? href('/exam') : href('?tab=exam');
  const reviewHref = exam === 'MCAT' ? href('/review') : href('?tab=analytics');

  return (
    <div className="space-y-5" data-testid="exam-dashboard">
      {/* Resume - the primary action */}
      {totalChapters > 0 && (
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {chaptersRead === 0 ? 'Start here' : 'Continue'}
                </span>
              </div>
              {next ? (
                <>
                  <h2 className="text-xl font-bold tracking-tight">{next.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {next.unit.name} &middot; chapter{' '}
                    {next.unit.topicIds.indexOf(next.id) + 1} of{' '}
                    {next.unit.topicIds.length}
                    {chaptersRead > 0 && ` · ${chaptersRead} of ${totalChapters} read so far`}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold tracking-tight">
                    All {totalChapters} chapters read
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Practice and review are where the gains are now.
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-32">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Course</span>
                  <span className="font-mono">{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
              <Link href={href('/study')}>
                <Button className="gap-1.5" data-testid="exam-resume">
                  {chaptersRead === 0 ? 'Open the course' : next ? 'Resume' : 'Open the course'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Recorded figures. Every one comes from an answer you gave. */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Chapters read"
          value={totalChapters ? `${chaptersRead}/${totalChapters}` : '—'}
          hint={totalChapters ? undefined : 'no syllabus yet'}
          icon={<BookOpen className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Questions answered"
          value={answered ? String(answered) : '—'}
          hint={answered ? undefined : 'no answers recorded yet'}
          icon={<ListChecks className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Accuracy"
          value={accuracy !== null ? `${accuracy}%` : '—'}
          hint={accuracy !== null ? `${correct} of ${answered}` : 'needs answers first'}
          icon={<BarChart3 className="h-3.5 w-3.5" />}
        />
        {surfaces.fullExam ? (
          <Stat
            label="Sittings taken"
            value={sittings ? String(sittings) : '—'}
            hint={sittings ? undefined : 'no exam taken yet'}
            icon={<Timer className="h-3.5 w-3.5" />}
          />
        ) : (
          <Stat
            label="Question bank"
            value={surfaces.qbankSize ? surfaces.qbankSize.toLocaleString() : '—'}
            hint={surfaces.qbankSize ? 'questions available' : 'no bank yet'}
            icon={<Library className="h-3.5 w-3.5" />}
          />
        )}
      </div>

      {/* The places to actually work */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {totalChapters > 0 && (
          <Entry
            href={href('/study')}
            icon={<BookOpen className="h-4 w-4" />}
            title="Course"
            body={`${totalChapters} chapters across ${axis.length} ${
              exam === 'MCAT' ? 'subjects' : 'sections'
            }, with takeaways and exam tips beside the text.`}
            foot={`${chaptersRead}/${totalChapters} read`}
          />
        )}
        {surfaces.qbankSize > 0 && (
          <Entry
            href={qbankHref}
            icon={<ListChecks className="h-4 w-4" />}
            title="Question bank"
            body={
              surfaces.serverGraded
                ? `${surfaces.qbankSize.toLocaleString()} questions, graded server-side with the explanation after each answer.`
                : `${surfaces.qbankSize.toLocaleString()} questions with a written explanation on every one.`
            }
            foot={answered ? `${answered} answered` : 'not started'}
          />
        )}
        {surfaces.fullExam && (
          <Entry
            href={examHref}
            icon={<Timer className="h-4 w-4" />}
            title="Exam simulation"
            body={`A full ${config.totalQuestions}-question sitting under the real ${config.totalDuration}-minute clock.`}
            foot={sittings ? `${sittings} taken` : 'not started'}
          />
        )}
        {surfaces.extras.map((x) => (
          <Entry
            key={x.path}
            href={href(x.path)}
            testId={x.path === '/chemistry' ? 'mcat-chemistry-link' : undefined}
            icon={
              x.path === '/chemistry' ? <FlaskConical className="h-4 w-4" />
                : x.label.includes('Live') ? <Video className="h-4 w-4" />
                  : x.label.includes('Analytics') ? <BarChart3 className="h-4 w-4" />
                    : x.label.includes('workbench') ? <Library className="h-4 w-4" />
                      : <BookOpen className="h-4 w-4" />
            }
            title={x.label}
            body={x.blurb}
            foot={x.path === '/chemistry' ? 'verified keys' : 'open'}
          />
        ))}
      </div>

      {/* Where to go next, when there is evidence for it */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">What to fix next</h3>
            {toReview > 0 && (
              <Link href={reviewHref}>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                  Review centre <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
          {!answered ? (
            <p className="text-sm text-muted-foreground">
              Nothing recorded yet. Answer a few questions and this fills with
              your weakest {exam === 'MCAT' ? 'sections' : 'topics'} and the
              questions you have missed &mdash; measured, not predicted.
            </p>
          ) : (
            <div className="space-y-2.5">
              {weakest && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Weakest {exam === 'MCAT' ? 'section' : 'topic'}
                  </p>
                  <p className="text-sm font-medium">{weakest.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {weakest.correct}/{weakest.attempts} correct
                  </p>
                </div>
              )}
              {exam === 'MCAT' && (
                <div className="rounded-lg border p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {toReview === 0
                        ? 'Nothing outstanding'
                        : `${toReview} question${toReview === 1 ? '' : 's'} to review`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {toReview === 0
                        ? 'Your latest answer got every question right.'
                        : 'Questions your latest answer got wrong.'}
                    </p>
                  </div>
                  {toReview > 0 && (
                    <Link href={reviewHref}>
                      <Button size="sm" variant="outline">Open</Button>
                    </Link>
                  )}
                </div>
              )}
              {!weakest && (
                <p className="text-[11px] text-muted-foreground">
                  A {exam === 'MCAT' ? 'section' : 'topic'} needs at least{' '}
                  {MIN_ATTEMPTS_TO_NAME_WEAKEST} recorded answers before it is
                  called weakest &mdash; two answers is not a pattern.
                </p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Also here</h3>
          <div className="grid gap-2">
            {surfaces.flashcards !== 0 && (
              <Small href={href('?tab=flashcards')} icon={<Layers className="h-3.5 w-3.5" />}
                title="Flashcards" body="Spaced repetition, one queue shared with your missed questions." />
            )}
            <Small href={href('?tab=notes')} icon={<StickyNote className="h-3.5 w-3.5" />}
              title="My notes" body="Your own notes against any chapter." />
            {(surfaces.analytics || exam === 'MCAT') && (
              <Small href={reviewHref} icon={<BarChart3 className="h-3.5 w-3.5" />}
                title="Review centre" body="Accuracy per section and per topic, from recorded answers." />
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t">
            {exam === 'CISSP'
              ? 'Video lessons are recorded for CISSP and play inside the course.'
              : `Video lessons are not recorded yet for ${config.shortName}. The player is wired and appears in the course the moment a chapter has one.`}
          </p>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, hint, icon }: {
  label: string; value: string; hint?: string; icon: React.ReactNode;
}) {
  return (
    <Card className="p-3.5">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
        {icon}
        <span className="text-[11px] uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold font-mono tabular-nums leading-none">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
    </Card>
  );
}

function Entry({ href, icon, title, body, foot, testId }: {
  href: string; icon: React.ReactNode; title: string; body: string;
  foot: string; testId?: string;
}) {
  return (
    <Link href={href} className="block group" data-testid={testId}>
      <Card className="p-4 h-full transition-colors group-hover:border-primary">
        <div className="flex items-center gap-2 mb-1.5 text-primary">
          {icon}
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
        <p className="text-[11px] text-muted-foreground mt-2.5 font-mono">{foot}</p>
      </Card>
    </Link>
  );
}

function Small({ href, icon, title, body }: {
  href: string; icon: React.ReactNode; title: string; body: string;
}) {
  return (
    <Link href={href} className="flex items-start gap-2.5 rounded-lg border p-2.5 hover:border-primary/60 transition-colors">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{body}</span>
      </span>
    </Link>
  );
}

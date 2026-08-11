'use client';

/**
 * The MCAT home page.
 *
 * What it replaced: two stacked dashboards. The generic test-prep overview
 * showed Readiness Score / Predicted Score cards that read N/A because the
 * numbers behind them were removed for being invented, and an "Adaptive
 * Practice - IRT-based questions" tile whose IRT is not calibrated (no item
 * is within 300 responses of the threshold). Behind that sat a second page
 * of cards and seven tabs, and only then the actual course.
 *
 * What this is: one page that answers "where am I and what do I do next",
 * with every figure coming from a recorded answer and every tile leading to
 * something that exists. Where there is no data yet it says so - a new
 * account should see an honest empty state, not a dashboard of zeros
 * pretending to be telemetry.
 */

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, BarChart3, BookOpen, FlaskConical,
  GraduationCap, Layers, ListChecks, StickyNote, Timer,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { MCAT_SUBJECTS } from '@/lib/mcat-subjects';
import { getCurriculum } from '@/lib/exam-curriculum';

const READ_KEY = 'mcat_study_read_chapters';

type Summary = Awaited<ReturnType<typeof apiClient.getMcatReviewSummary>>;
type Missed = Awaited<ReturnType<typeof apiClient.getMcatReviewMissed>>;
type History = Awaited<ReturnType<typeof apiClient.getMcatMockHistory>>;

export function McatDashboard({ examSlug }: { examSlug: string }) {
  const [read, setRead] = React.useState<Set<string>>(new Set());
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [missed, setMissed] = React.useState<Missed | null>(null);
  const [history, setHistory] = React.useState<History | null>(null);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(READ_KEY);
      if (saved) setRead(new Set(JSON.parse(saved)));
    } catch {
      /* first visit */
    }
    void apiClient.getMcatReviewSummary().then(setSummary).catch(() => {});
    void apiClient.getMcatReviewMissed(5).then(setMissed).catch(() => {});
    void apiClient.getMcatMockHistory().then(setHistory).catch(() => {});
  }, []);

  const chapters = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const s of getCurriculum('MCAT')) {
      for (const t of s.topics) m.set(t.id, t.title);
    }
    return m;
  }, []);

  const totalChapters = MCAT_SUBJECTS.reduce((n, s) => n + s.topicIds.length, 0);
  const chaptersRead = MCAT_SUBJECTS.reduce(
    (n, s) => n + s.topicIds.filter((t) => read.has(t)).length, 0,
  );
  const pct = totalChapters ? Math.round((chaptersRead / totalChapters) * 100) : 0;

  // The next unread chapter, in course order. This is the whole point of
  // the page: one button that resumes the course.
  const next = React.useMemo(() => {
    for (const s of MCAT_SUBJECTS) {
      for (const id of s.topicIds) {
        if (!read.has(id)) return { subject: s, id, title: chapters.get(id) ?? id };
      }
    }
    return null;
  }, [read, chapters]);

  const answered = (summary?.by_section ?? []).reduce((n, s) => n + s.attempts, 0);
  const correct = (summary?.by_section ?? []).reduce((n, s) => n + s.correct, 0);
  const accuracy = answered ? Math.round((correct / answered) * 100) : null;
  const sittings = (history?.attempts ?? []).filter((a) => a.status === 'submitted').length;
  const toReview = missed?.missed.length ?? 0;
  const weakest = (summary?.by_section ?? [])
    .filter((s) => s.attempts >= 5)
    .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))[0];

  const href = (p: string) => `/dashboard/test-prep/${examSlug}${p}`;

  return (
    <div className="space-y-5" data-testid="mcat-dashboard">
      {/* Resume - the primary action */}
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
                  {next.subject.name} &middot; chapter{' '}
                  {next.subject.topicIds.indexOf(next.id) + 1} of{' '}
                  {next.subject.topicIds.length}
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
              <Button className="gap-1.5" data-testid="mcat-resume">
                {next ? (chaptersRead === 0 ? 'Open the course' : 'Resume') : 'Open the course'}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Recorded figures. Every one comes from an answer you gave. */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Chapters read" value={`${chaptersRead}/${totalChapters}`} icon={<BookOpen className="h-3.5 w-3.5" />} />
        <Stat
          label="Questions answered"
          value={answered > 0 ? String(answered) : '—'}
          hint={answered === 0 ? 'no answers recorded yet' : undefined}
          icon={<ListChecks className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Accuracy"
          value={accuracy !== null ? `${accuracy}%` : '—'}
          hint={accuracy !== null ? `${correct} of ${answered}` : 'needs answers first'}
          icon={<BarChart3 className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Sittings taken"
          value={sittings > 0 ? String(sittings) : '—'}
          hint={sittings === 0 ? 'no exam taken yet' : undefined}
          icon={<Timer className="h-3.5 w-3.5" />}
        />
      </div>

      {/* The four places to actually work */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Entry
          href={href('/study')}
          icon={<BookOpen className="h-4 w-4" />}
          title="Course"
          body={`${totalChapters} chapters across seven subjects, with takeaways and exam tips beside the text.`}
          foot={`${chaptersRead}/${totalChapters} read`}
        />
        <Entry
          href={href('/qbank')}
          icon={<ListChecks className="h-4 w-4" />}
          title="Question bank"
          body="580 questions and two passage sets, graded server-side with the explanation after each answer."
          foot={answered > 0 ? `${answered} answered` : 'not started'}
        />
        <Entry
          href={href('/exam')}
          icon={<Timer className="h-4 w-4" />}
          title="Exam simulation"
          body="Server-drawn and server-graded. Raw and per-section results only — no scaled score is estimated."
          foot={sittings > 0 ? `${sittings} taken` : 'not started'}
        />
        <Entry
          href={href('/chemistry')}
          testId="mcat-chemistry-link"
          icon={<FlaskConical className="h-4 w-4" />}
          title="Generated chemistry"
          body="Fresh items from the OCTET engine, every answer key machine-verified, misses diagnosed by misconception."
          foot="verified keys"
        />
      </div>

      {/* Where to go next, when there is evidence for it */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">What to fix next</h3>
            {toReview > 0 && (
              <Link href={href('/review')}>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                  Review centre <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
          {answered === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing recorded yet. Answer a few questions and this fills with
              your weakest sections and the questions you have missed &mdash;
              measured, not predicted.
            </p>
          ) : (
            <div className="space-y-2.5">
              {weakest && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Weakest section</p>
                  <p className="text-sm font-medium">{weakest.section}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {weakest.correct}/{weakest.attempts} correct
                  </p>
                </div>
              )}
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
                  <Link href={href('/review')}>
                    <Button size="sm" variant="outline">Open</Button>
                  </Link>
                )}
              </div>
              {!weakest && answered > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  A section needs at least five recorded answers before it is
                  called weakest &mdash; two answers is not a pattern.
                </p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Also here</h3>
          <div className="grid gap-2">
            <Small href={href('?tab=flashcards')} icon={<Layers className="h-3.5 w-3.5" />}
              title="Flashcards" body="Spaced repetition, one queue shared with your missed questions." />
            <Small href={href('?tab=notes')} icon={<StickyNote className="h-3.5 w-3.5" />}
              title="My notes" body="Your own notes against any chapter." />
            <Small href={href('/review')} icon={<BarChart3 className="h-3.5 w-3.5" />}
              title="Review centre" body="Accuracy per section and per topic, from recorded answers." />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t">
            Video lessons are not recorded yet for MCAT. The player is wired
            and appears in the course the moment a chapter has one.
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

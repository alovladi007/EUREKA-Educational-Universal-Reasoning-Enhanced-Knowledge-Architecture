'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Compass,
  FlaskConical,
  GraduationCap,
  Layers,
  ListChecks,
  Map as MapIcon,
  RotateCcw,
  Timer,
  Trophy,
} from 'lucide-react';
import {
  CurriculumNodes,
  ExamCatalogue,
  getCurriculumNodes,
  getExams,
} from '@/lib/api';
import {
  AnalyticsOverview,
  PracticeSessionRow,
  formatWhen,
  getAnalyticsOverview,
  getRecentPracticeSessions,
  percentOf,
} from '@/lib/analyticsApi';
import {
  Card,
  ErrorPanel,
  LoadingPanel,
  Page,
  errorMessage,
} from '@/app/_ui/shell';

// The OCTET home page.
//
// Rebuilt onto the architecture the prep test modules use, because a learner
// moving between OCTET and a prep test should not have to relearn where things
// are. Four bands, in this order, and the order is the argument:
//
//   1  RESUME       one primary action, the thing to do right now
//   2  RECORD       four figures, each from an answer actually given
//   3  ENTRIES      the places to work, each saying what it is for
//   4  EVIDENCE     what to fix next, and only once there is evidence for it
//
// What it replaced was the same information as a wall of equal-weight cards,
// which makes a learner choose before they have any basis to. A dashboard's
// job is to have already chosen.
//
// EVERY NUMBER IS RECORDED, NONE ARE PROJECTED. A figure with no data behind
// it renders as an em dash with a line saying why, not as a zero. There are no
// percentiles, no predicted scores and no streaks, because there is no cohort,
// no validated model, and nothing that measures a streak.

interface Figures {
  attempts: number | null;
  correct: number | null;
  accuracy: number | null;
  nodesWithLesson: number;
  nodesTotal: number;
  chaptersWritten: number;
  examsListed: number;
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [sessions, setSessions] = useState<PracticeSessionRow[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumNodes | null>(null);
  const [exams, setExams] = useState<ExamCatalogue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [over, recent, nodes, catalogue] = await Promise.all([
          getAnalyticsOverview(),
          getRecentPracticeSessions(5),
          getCurriculumNodes(),
          getExams(),
        ]);
        if (cancelled) return;
        setOverview(over);
        setSessions(recent.sessions);
        setCurriculum(nodes);
        setExams(catalogue);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const figures: Figures = useMemo(() => {
    const nodes = curriculum?.nodes ?? [];
    return {
      attempts: overview?.totals.attempts ?? null,
      correct: overview?.totals.correct ?? null,
      accuracy: overview?.totals.attempts
        ? Math.round(overview.totals.accuracy * 100)
        : null,
      nodesWithLesson: nodes.filter((n) => n.authored).length,
      nodesTotal: nodes.length,
      chaptersWritten: nodes.filter((n) => n.has_chapter).length,
      examsListed: exams?.exams.length ?? 0,
    };
  }, [overview, curriculum, exams]);

  // Where to resume.
  //
  // The weakest recorded node when there is one, because the evidence says
  // that is where the next hour pays. Otherwise the first node carrying a full
  // chapter: sending a new learner to a node with only the six part arc behind
  // it starts them on the thinnest thing the course has.
  //
  // Deliberately NOT "the node of your last practice session". The session
  // rows carry a mode, a status and a summary - they do not carry a node code,
  // so naming one from them would mean inventing it.
  const resume = useMemo(() => {
    const nodes = curriculum?.nodes ?? [];
    const weak = overview?.weakest_nodes?.[0];
    if (weak) {
      const match = nodes.find((n) => n.code === weak.node);
      if (match) {
        return {
          node: match,
          why: `your weakest recorded node — ${weak.correct} of ${weak.attempts} correct`,
        };
      }
    }
    const first = nodes.find((n) => n.has_chapter) ?? nodes.find((n) => n.authored);
    return first ? { node: first, why: 'the first chapter of the program' } : null;
  }, [curriculum, overview]);

  const weakest = overview?.weakest_nodes?.[0] ?? null;

  return (
    <Page>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">OCTET</h1>
        <p className="mt-1 text-muted-foreground">
          Orbitals, Compounds, Thermodynamics, Equilibria, Transformations ·
          two years of chemistry as {figures.nodesTotal || '—'} nodes across
          four courses
        </p>
      </header>

      {loading && <LoadingPanel label="Loading your record." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && (
        <div className="space-y-5">
          {/* 1 — resume */}
          {resume && (
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {figures.attempts ? 'Work on this next' : 'Start here'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">
                    {resume.node.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {resume.node.course} · {resume.node.unit_title} ·{' '}
                    {resume.why}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/learn/${encodeURIComponent(resume.node.code)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    {figures.attempts ? 'Open it' : 'Open the chapter'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* 2 — the record. Every figure is an answer you gave. */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="Chapters written"
              value={
                figures.nodesTotal
                  ? `${figures.chaptersWritten}/${figures.nodesTotal}`
                  : '—'
              }
              hint={
                figures.chaptersWritten
                  ? 'the rest carry the six part arc'
                  : 'none yet'
              }
            />
            <Stat
              icon={<ListChecks className="h-3.5 w-3.5" />}
              label="Questions answered"
              value={figures.attempts ? String(figures.attempts) : '—'}
              hint={figures.attempts ? undefined : 'no answers recorded yet'}
            />
            <Stat
              icon={<BarChart3 className="h-3.5 w-3.5" />}
              label="Accuracy"
              value={figures.accuracy !== null ? `${figures.accuracy}%` : '—'}
              hint={
                figures.accuracy !== null
                  ? `${figures.correct} of ${figures.attempts}`
                  : 'needs answers first'
              }
            />
            <Stat
              icon={<Timer className="h-3.5 w-3.5" />}
              label="Exams listed"
              value={figures.examsListed ? String(figures.examsListed) : '—'}
              hint={figures.examsListed ? 'in the catalogue' : 'none yet'}
            />
          </div>

          {/* 3 — the places to work */}
          <div>
            <h2 className="mb-2.5 text-sm font-semibold">Where to work</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Entry
                href="/learn"
                icon={<BookOpen className="h-4 w-4" />}
                title="Learn"
                body={`${figures.nodesTotal} nodes by course and chapter, with figures, tables and a video slot beside the text.`}
                foot={`${figures.chaptersWritten} full chapters`}
              />
              <Entry
                href="/practice"
                icon={<ListChecks className="h-4 w-4" />}
                title="Practice"
                body="Items generated per learner and graded on the server, with a three rung hint ladder before the answer."
                foot={
                  figures.attempts ? `${figures.attempts} answered` : 'not started'
                }
              />
              <Entry
                href="/review"
                icon={<RotateCcw className="h-4 w-4" />}
                title="Review"
                body="Spaced repetition over what you got wrong, scheduled by SM-2 rather than by when you last felt like it."
                foot="queue"
              />
              <Entry
                href="/exams"
                icon={<Trophy className="h-4 w-4" />}
                title="Exams"
                body="Timed papers assembled from the item bank, scored the way the real thing is."
                foot={`${figures.examsListed} listed`}
              />
              <Entry
                href="/analytics"
                icon={<BarChart3 className="h-4 w-4" />}
                title="Analytics"
                body="Accuracy by course, unit and node, from graded attempts only. No percentiles: there is no cohort."
                foot={figures.attempts ? 'has data' : 'needs answers'}
              />
              <Entry
                href="/path"
                icon={<MapIcon className="h-4 w-4" />}
                title="Path"
                body="The prerequisite graph in topological order, so you can see what a node stands on."
                foot="open"
              />
              <Entry
                href="/planner"
                icon={<Layers className="h-4 w-4" />}
                title="Planner"
                body="Set a target date and it divides the remaining work by the days left. Arithmetic, not a prediction."
                foot="needs a date"
              />
              <Entry
                href="/simulations"
                icon={<FlaskConical className="h-4 w-4" />}
                title="Simulations & 3D labs"
                body="Predict-observe-explain benches and the molecular labs on EUREKA, for the nodes where turning the thing is the lesson."
                foot="open"
              />
            </div>
          </div>

          {/* 4 — evidence, and only where there is some */}
          <div className="grid gap-3 lg:grid-cols-2">
            <Card className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">What to fix next</h3>
                {weakest && (
                  <Link
                    href="/analytics"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                  >
                    Analytics <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
              {!figures.attempts ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Nothing recorded yet. Answer a few questions and this fills
                  with the nodes you actually missed, rather than a guess about
                  which ones are hard.
                </p>
              ) : weakest ? (
                <div>
                  <Link
                    href={`/learn/${encodeURIComponent(weakest.node)}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {weakest.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {weakest.correct} of {weakest.attempts} correct ·{' '}
                    {percentOf(weakest.accuracy)}
                  </p>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  No node has enough attempts on it yet to be called the weakest
                  one. A miss on two questions is a coin flip, not a weakness.
                </p>
              )}
            </Card>

            <Card className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent practice</h3>
                {sessions.length > 0 && (
                  <Link
                    href="/practice"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                  >
                    Practice <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
              {sessions.length === 0 ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  No sessions yet. Practice is where the item bank is, and it is
                  the only surface that records anything.
                </p>
              ) : (
                <ul className="space-y-2">
                  {sessions.slice(0, 4).map((row) => (
                    <li
                      key={row.session_id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0 truncate">
                        {row.mode} · {formatWhen(row.started_at, 'not started')}
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {row.status === 'submitted' && row.summary
                          ? `${row.summary.correct ?? 0}/${row.summary.total ?? row.item_count}`
                          : `${row.item_count} items`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* The API's own caveat about what these figures are. Verbatim. */}
          {overview?.note && (
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {overview.note}
            </p>
          )}
        </div>
      )}
    </Page>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="p-3.5">
      <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-mono text-2xl font-bold leading-none tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </Card>
  );
}

function Entry({
  href,
  icon,
  title,
  body,
  foot,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  foot: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full p-4 transition-colors group-hover:border-brand-500">
        <div className="mb-1.5 flex items-center gap-2 text-brand-600 dark:text-brand-400">
          {icon}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
        <p className="mt-2.5 font-mono text-[11px] text-muted-foreground">
          {foot}
        </p>
      </Card>
    </Link>
  );
}

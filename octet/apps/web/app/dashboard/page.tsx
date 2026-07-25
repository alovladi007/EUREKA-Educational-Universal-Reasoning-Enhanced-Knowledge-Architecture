'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  Pill,
  SectionTitle,
  errorMessage,
} from '@/app/_ui/shell';

// The dashboard is content-first: the thing to continue, the record so far,
// what exists to work on, and the doors to everything else. Every number on
// it comes from a live endpoint. Nothing is projected, streaked or invented,
// and a zero from the API is stated as what it is rather than dressed up.

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
        if (cancelled) {
          return;
        }
        setOverview(over);
        setSessions(recent.sessions);
        setCurriculum(nodes);
        setExams(catalogue);
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Orbitals, Compounds, Thermodynamics, Equilibria, Transformations.
      </p>

      {loading && <LoadingPanel label="Loading the chemistry workspace." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && (
        <div className="space-y-8">
          <section>
            <SectionTitle>Continue</SectionTitle>
            <ContinueCard sessions={sessions} />
          </section>

          <section>
            <SectionTitle>Your record</SectionTitle>
            <RecordCard overview={overview} />
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section>
              <SectionTitle>Coverage</SectionTitle>
              <CoverageCard curriculum={curriculum} />
            </section>
            <section>
              <SectionTitle>Exams</SectionTitle>
              <ExamsCard catalogue={exams} />
            </section>
          </div>

          <section>
            <SectionTitle>Where to go</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
              <NavCard
                href="/learn"
                title="Learn"
                detail="The whole program by course and unit, lessons in the six part arc."
              />
              <NavCard
                href="/practice"
                title="Practice"
                detail="Generated items with a three rung hint ladder."
              />
              <NavCard
                href="/simulations"
                title="Simulations"
                detail="Predict, observe, explain. The result waits for your prediction."
              />
            </div>
          </section>
        </div>
      )}
    </Page>
  );
}

// -------------------------------------------------------------------------
// Continue
// -------------------------------------------------------------------------

// The most recent open session wins; failing that the most recent finished
// one; failing that the honest start-from-nothing prompt. The list arrives
// newest first, so the first match in order is the right one.
function ContinueCard({ sessions }: { sessions: PracticeSessionRow[] }) {
  const open = sessions.find((s) => s.status === 'in_progress');
  const finished = sessions.find((s) => s.status !== 'in_progress');

  if (open) {
    return (
      <SessionCard
        row={open}
        label="In progress"
        tone="amber"
        action="Resume"
        detail="You have an open practice session. Picking it back up keeps its items and answers."
      />
    );
  }

  if (finished) {
    return (
      <SessionCard
        row={finished}
        label="Finished"
        tone="neutral"
        action="Review"
        detail="Your most recent practice session is finished. Reviewing it shows every item with your answer."
      />
    );
  }

  return (
    <Card>
      <p className="text-sm text-card-foreground">
        No practice sessions yet. The record on this page builds from graded
        practice attempts, so the first session is what starts everything else
        filling in.
      </p>
      <Link
        href="/practice"
        className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        Start practicing
      </Link>
    </Card>
  );
}

function SessionCard({
  row,
  label,
  tone,
  action,
  detail,
}: {
  row: PracticeSessionRow;
  label: string;
  tone: 'amber' | 'neutral';
  action: string;
  detail: string;
}) {
  const summary = row.summary;
  const scored =
    summary &&
    typeof summary.correct === 'number' &&
    typeof summary.total === 'number';
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={tone}>{label}</Pill>
        <span className="text-sm text-card-foreground">
          {row.mode} session, {row.item_count}{' '}
          {row.item_count === 1 ? 'item' : 'items'}
        </span>
        <span className="text-xs text-muted-foreground">
          started {formatWhen(row.started_at, 'at an unrecorded time')}
        </span>
        {scored && (
          <span className="text-sm tabular-nums text-muted-foreground">
            {summary.correct} of {summary.total} correct
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
      <Link
        href={`/practice/session/${encodeURIComponent(row.session_id)}`}
        className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {action}
      </Link>
    </Card>
  );
}

// -------------------------------------------------------------------------
// Your record
// -------------------------------------------------------------------------

// Accuracy is shown only when there are attempts to compute it from. The API
// sends 0.0 alongside zero attempts, and rendering that as "0% accuracy"
// would present a placeholder as a measurement.
function RecordCard({ overview }: { overview: AnalyticsOverview | null }) {
  if (!overview) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">
          The analytics endpoint returned nothing.
        </p>
      </Card>
    );
  }
  const { attempts, correct, accuracy } = overview.totals;
  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-3xl font-bold tabular-nums">{attempts}</p>
          <p className="mt-1 text-sm text-muted-foreground">Graded attempts</p>
        </div>
        <div>
          <p className="text-3xl font-bold tabular-nums">{correct}</p>
          <p className="mt-1 text-sm text-muted-foreground">Correct</p>
        </div>
        <div>
          <p className="text-3xl font-bold tabular-nums">
            {attempts > 0 ? percentOf(accuracy) : '-'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {attempts > 0 ? 'Accuracy' : 'Accuracy needs an attempt'}
          </p>
        </div>
      </div>
      <Link
        href="/analytics"
        className="mt-4 inline-block border-t border-border pt-4 text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
      >
        See the full breakdown
      </Link>
    </Card>
  );
}

// -------------------------------------------------------------------------
// Coverage
// -------------------------------------------------------------------------

// Authored over total, stated plainly. Most of the program is mapped but not
// yet written, and this card says so instead of hiding the unwritten part.
function CoverageCard({ curriculum }: { curriculum: CurriculumNodes | null }) {
  if (!curriculum || curriculum.nodes.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">
          The curriculum endpoint returned an empty program.
        </p>
      </Card>
    );
  }
  const total = curriculum.nodes.length;
  const authored = curriculum.nodes.filter((n) => n.authored).length;
  return (
    <Card>
      <p className="text-3xl font-bold tabular-nums">
        {authored} of {total}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        nodes have a lesson written. The rest are mapped and marked not yet
        available.
      </p>
      <Link
        href="/learn"
        className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
      >
        Open the map
      </Link>
    </Card>
  );
}

// -------------------------------------------------------------------------
// Exams
// -------------------------------------------------------------------------

function ExamsCard({ catalogue }: { catalogue: ExamCatalogue | null }) {
  if (!catalogue || catalogue.exams.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">
          The exam catalogue is empty.
        </p>
      </Card>
    );
  }
  const total = catalogue.exams.length;
  const available = catalogue.exams.filter((e) => e.available).length;
  return (
    <Card>
      <p className="text-3xl font-bold tabular-nums">{available}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        of {total} listed {total === 1 ? 'exam' : 'exams'}{' '}
        {available === 1 ? 'is' : 'are'} available to start now.
      </p>
      <Link
        href="/exams"
        className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
      >
        See the catalogue
      </Link>
    </Card>
  );
}

// -------------------------------------------------------------------------
// Quick links
// -------------------------------------------------------------------------

function NavCard({
  href,
  title,
  detail,
}: {
  href: string;
  title: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <p className="text-base font-semibold text-card-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </Link>
  );
}

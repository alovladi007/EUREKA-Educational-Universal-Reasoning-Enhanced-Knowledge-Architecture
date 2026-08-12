'use client';

import {
  BarChart3,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AnalyticsOverview,
  AnalyticsRollupRow,
  PracticeSessionList,
  PracticeSessionRow,
  RecentExam,
  formatWhen,
  getAnalyticsOverview,
  getRecentPracticeSessions,
  percentOf, examTitle} from '@/lib/analyticsApi';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  PageHeader,
  Pill,
  SectionTitle,
  Stat,
  errorMessage,
} from '@/app/_ui/shell';

// The analytics page is a mirror, not a scoreboard. Every figure on it is
// this account's own recorded attempts, read from the overview endpoint and
// rendered as sent. There are no percentiles, no cohort comparisons and no
// projections, because the API does not compute any, and the API's own note
// saying why is rendered verbatim at the bottom.

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [sessions, setSessions] = useState<PracticeSessionList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [over, recent] = await Promise.all([
          getAnalyticsOverview(),
          getRecentPracticeSessions(5),
        ]);
        if (!cancelled) {
          setOverview(over);
          setSessions(recent);
        }
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

  const hasAttempts = (overview?.totals.attempts ?? 0) > 0;

  return (
    <Page>
      <PageHeader
        title="Analytics"
        lead="Your own recorded attempts, rolled up by course, unit and node. Nothing here is estimated or compared against anyone else: there is no cohort, so there are no percentiles."
      />

      {loading && <LoadingPanel label="Loading your record." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && overview && (
        <div className="space-y-8">
          {!hasAttempts && (
            <EmptyState
              title="Nothing recorded yet"
              detail="Analytics builds from graded practice attempts, and this account has none yet. The first practice session you finish will start filling this page in."
            />
          )}
          {!hasAttempts && (
            <p className="text-center text-sm">
              <Link
                href="/practice"
                className="font-medium text-brand-700 hover:underline dark:text-brand-300"
              >
                Start practicing
              </Link>
            </p>
          )}

          {hasAttempts && (
            <>
              <section>
                <SectionTitle>Totals</SectionTitle>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Stat
                    icon={<ListChecks className="h-3.5 w-3.5" />}
                    label="Graded attempts"
                    value={String(overview.totals.attempts)}
                  />
                  <Stat
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    label="Correct"
                    value={String(overview.totals.correct)}
                  />
                  <Stat
                    icon={<BarChart3 className="h-3.5 w-3.5" />}
                    label="Accuracy"
                    value={percentOf(overview.totals.accuracy)}
                    hint={`${overview.totals.correct} of ${overview.totals.attempts}`}
                  />
                </div>
              </section>

              <section>
                <SectionTitle>By course</SectionTitle>
                <CourseBars rows={overview.by_course} />
              </section>

              <section>
                <SectionTitle>By unit</SectionTitle>
                <UnitTable rows={overview.by_unit} />
              </section>

              <section>
                <SectionTitle>Weakest nodes</SectionTitle>
                <WeakNodes overview={overview} />
              </section>
            </>
          )}

          <section>
            <SectionTitle>Recent exams</SectionTitle>
            <RecentExams exams={overview.recent_exams} />
          </section>

          <section>
            <SectionTitle>Recent practice sessions</SectionTitle>
            <RecentSessions sessions={sessions?.sessions ?? []} />
          </section>

          {/* The API's own caveat, verbatim. It is the sentence that explains
              why no percentile appears anywhere above. */}
          <p className="text-xs text-muted-foreground">{overview.note}</p>
        </div>
      )}
    </Page>
  );
}

// -------------------------------------------------------------------------
// By course
// -------------------------------------------------------------------------

// One horizontal bar per course. The bar is decoration; the percent and the
// attempt count beside it are the content, so colour is never the only
// carrier.
function CourseBars({ rows }: { rows: AnalyticsRollupRow[] }) {
  const withAttempts = rows.filter((r) => r.attempts > 0);
  if (withAttempts.length === 0) {
    return (
      <EmptyState
        title="No course rollup yet"
        detail="No course has a graded attempt recorded against it."
      />
    );
  }
  return (
    <Card>
      <ul className="space-y-4">
        {withAttempts.map((row) => (
          <li key={row.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-sm font-medium text-card-foreground">
                {row.title}
              </span>
              <span className="text-sm tabular-nums text-muted-foreground">
                {percentOf(row.accuracy)} accuracy, {row.correct} of{' '}
                {row.attempts} {row.attempts === 1 ? 'attempt' : 'attempts'}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: percentOf(row.accuracy) }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// -------------------------------------------------------------------------
// By unit
// -------------------------------------------------------------------------

// Worst first, because the point of the table is to say where to go next.
// Units with no attempts are simply absent rather than shown as zero rows
// that would read like measured failure.
function UnitTable({ rows }: { rows: AnalyticsRollupRow[] }) {
  const withAttempts = rows
    .filter((r) => r.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);

  if (withAttempts.length === 0) {
    return (
      <EmptyState
        title="No unit rollup yet"
        detail="No unit has a graded attempt recorded against it."
      />
    );
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Units with recorded attempts, lowest accuracy first
        </caption>
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="px-5 py-3">
              Unit
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Attempts
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Correct
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Accuracy
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {withAttempts.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-3 font-medium text-card-foreground">
                {row.title}
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                {row.attempts}
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                {row.correct}
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-card-foreground">
                {percentOf(row.accuracy)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        Sorted lowest accuracy first. Units without a graded attempt are not
        listed.
      </p>
    </Card>
  );
}

// -------------------------------------------------------------------------
// Weakest nodes
// -------------------------------------------------------------------------

function WeakNodes({ overview }: { overview: AnalyticsOverview }) {
  const nodes = overview.weakest_nodes;
  if (nodes.length === 0) {
    return (
      <EmptyState
        title="No weak nodes to report"
        detail="A node appears here after at least two graded attempts, and none has that many yet."
      />
    );
  }
  return (
    <Card>
      <ul className="divide-y divide-border">
        {nodes.map((weak) => (
          <li key={weak.node} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <Link
                href={`/learn/${encodeURIComponent(weak.node)}`}
                className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
              >
                {weak.title}
              </Link>
              <span className="text-sm tabular-nums text-muted-foreground">
                {percentOf(weak.accuracy)} accuracy, {weak.correct} of{' '}
                {weak.attempts} correct
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
        Lowest accuracy first, counting only nodes with at least two graded
        attempts. Each link opens the lesson.
      </p>
    </Card>
  );
}

// -------------------------------------------------------------------------
// Recent exams
// -------------------------------------------------------------------------

function RecentExams({ exams }: { exams: RecentExam[] }) {
  if (exams.length === 0) {
    return (
      <EmptyState
        title="No submitted exams"
        detail="No exam attempt has been submitted from this account yet."
      />
    );
  }
  return (
    <Card>
      <ul className="divide-y divide-border">
        {exams.map((exam) => (
          <li
            key={exam.attempt_id}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0"
          >
            <span className="min-w-0">
              <Link
                href={`/exams/${encodeURIComponent(exam.attempt_id)}`}
                className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
              >
                {examTitle(exam.blueprint_code)}
              </Link>
              <span className="ml-3 text-xs text-muted-foreground">
                {formatWhen(exam.submitted_at, 'submission time not recorded')}
              </span>
            </span>
            <span className="text-sm tabular-nums text-muted-foreground">
              <ExamResultText result={exam.result} />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// The API forwards correct, total and fraction only when the stored result
// has them, so each is rendered only when present rather than defaulted.
function ExamResultText({ result }: { result: RecentExam['result'] }) {
  if (!result) {
    return <>no result stored</>;
  }
  const parts: string[] = [];
  if (typeof result.correct === 'number' && typeof result.total === 'number') {
    parts.push(`${result.correct} of ${result.total} correct`);
  }
  if (typeof result.fraction === 'number') {
    parts.push(percentOf(result.fraction));
  }
  if (parts.length === 0) {
    return <>result recorded</>;
  }
  return <>{parts.join(', ')}</>;
}

// -------------------------------------------------------------------------
// Recent practice sessions
// -------------------------------------------------------------------------

function RecentSessions({ sessions }: { sessions: PracticeSessionRow[] }) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No practice sessions"
        detail="No practice session has been started from this account yet."
      />
    );
  }
  return (
    <Card>
      <ul className="divide-y divide-border">
        {sessions.map((row) => {
          const open = row.status === 'in_progress';
          const summary = row.summary;
          const scored =
            summary &&
            typeof summary.correct === 'number' &&
            typeof summary.total === 'number';
          return (
            <li
              key={row.session_id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0"
            >
              <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <Pill tone={open ? 'amber' : 'neutral'}>
                  {open ? 'In progress' : 'Finished'}
                </Pill>
                <span className="text-sm text-card-foreground">
                  {row.mode} session, {row.item_count}{' '}
                  {row.item_count === 1 ? 'item' : 'items'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatWhen(row.started_at, 'start time not recorded')}
                </span>
              </span>
              <span className="flex items-center gap-4">
                {scored && (
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {summary.correct} of {summary.total} correct
                  </span>
                )}
                <Link
                  href={`/practice/session/${encodeURIComponent(row.session_id)}`}
                  className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
                >
                  {open ? 'Resume' : 'Review'}
                </Link>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ApiError,
  ExamSummary,
  getExams,
  startExamAttempt,
} from '@/lib/api';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  PageHeader,
  Pill,
  errorMessage,
} from '@/app/_ui/shell';

// The exam catalogue.
//
// This page states what an exam on this platform is before it offers to start
// one, because the blueprint is a claim about what the score will mean. Three
// things are therefore not decoration here:
//
//   1. The API's own note is rendered verbatim. It says these blueprints come
//      from this platform's curriculum and claim alignment with no external
//      examination. Dropping it would leave the learner to assume otherwise.
//   2. basis and review are shown per exam. review reads "pending" until a
//      subject matter expert signs the blueprint off, and a pending blueprint
//      must not be presented as a verified one.
//   3. An exam the item bank cannot assemble is listed and marked unavailable
//      rather than hidden. Hiding it would make a broken exam look like an
//      exam that does not exist.
//
// Nothing on this page grades anything, and no exam is started without the
// learner pressing start.

export default function ExamsPage() {
  const router = useRouter();

  const [exams, setExams] = useState<ExamSummary[] | null>(null);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Which exam is being started, and the failure that came back for it. The
  // API refuses with 409 and a message written for the learner (already open,
  // or cannot be assembled), so that message is shown exactly as sent.
  const [starting, setStarting] = useState<string | null>(null);
  const [startError, setStartError] = useState<{
    code: string;
    message: string;
    alreadyOpen: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const catalogue = await getExams();
        if (!cancelled) {
          setExams(catalogue.exams ?? []);
          setNote(catalogue.note ?? '');
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(errorMessage(err));
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

  async function start(exam: ExamSummary) {
    if (starting) {
      return;
    }
    setStarting(exam.code);
    setStartError(null);
    try {
      const attempt = await startExamAttempt(exam.code);
      router.push(`/exams/${encodeURIComponent(attempt.attempt_id)}`);
    } catch (err) {
      const conflict = err instanceof ApiError && err.status === 409;
      setStartError({
        code: exam.code,
        message: errorMessage(err),
        alreadyOpen: conflict,
      });
      setStarting(null);
    }
  }

  return (
    <Page>
      <PageHeader
        title="Exams"
        lead="An exam is timed, it gives no hints, and it marks nothing right or wrong until you submit it. Your score is reported as raw counts, with no grade or pass mark attached."
      />

      {note && (
        <p className="mb-8 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          {note}
        </p>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Exam catalogue
        </h2>

        {loading && <LoadingPanel label="Loading the exam catalogue." />}
        {!loading && loadError && <ErrorPanel message={loadError} />}
        {!loading && !loadError && exams && exams.length === 0 && (
          <EmptyState
            title="No exams are published"
            detail="The API returned an empty catalogue, so there is no exam to take yet."
          />
        )}

        {!loading && !loadError && exams && exams.length > 0 && (
          <ul className="space-y-4">
            {exams.map((exam) => (
              <li key={exam.code}>
                <ExamCard
                  exam={exam}
                  starting={starting === exam.code}
                  disabled={starting !== null && starting !== exam.code}
                  error={
                    startError && startError.code === exam.code
                      ? startError
                      : null
                  }
                  onStart={() => void start(exam)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Page>
  );
}

function ExamCard({
  exam,
  starting,
  disabled,
  error,
  onStart,
}: {
  exam: ExamSummary;
  starting: boolean;
  disabled: boolean;
  error: { message: string; alreadyOpen: boolean } | null;
  onStart: () => void;
}) {
  const verified = exam.review.toLowerCase() === 'verified';

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">
            {exam.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {exam.description}
          </p>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {exam.code}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill tone="neutral">scope {exam.scope}</Pill>
        <Pill tone="neutral">{exam.items} items</Pill>
        <Pill tone="neutral">{exam.minutes} minutes</Pill>
        <Pill tone={verified ? 'green' : 'amber'}>
          blueprint review: {exam.review}
        </Pill>
        <Pill tone={exam.available ? 'green' : 'red'}>
          {exam.available ? 'Available now' : 'Not available now'}
        </Pill>
      </div>

      {exam.sections.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sections
          </h4>
          <ul className="mt-2 space-y-1">
            {exam.sections.map((section) => (
              <li
                key={section.id}
                className="flex flex-wrap items-baseline gap-x-2 text-sm text-card-foreground"
              >
                <span className="font-medium">{section.title}</span>
                <span className="text-muted-foreground">
                  {section.items} items, {section.minutes} minutes
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-sm text-muted-foreground">{exam.basis}</p>

      <p className="mt-2 text-xs text-muted-foreground">
        The minutes above are an allowance the blueprint states, not a figure
        measured from real attempts.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          disabled={!exam.available || starting || disabled}
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {starting ? 'Starting' : 'Start this exam'}
        </button>
        <span className="text-xs text-muted-foreground">
          Starting opens the clock straight away.
        </span>
      </div>

      {!exam.available && (
        <p className="mt-3 text-sm text-amber-800 dark:text-amber-300">
          The item bank cannot build this exam at the moment, so it cannot be
          started. It is listed here rather than hidden so that the gap is
          visible.
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950"
        >
          <p className="text-sm text-red-800 dark:text-red-200">
            {error.message}
          </p>
          {error.alreadyOpen && (
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              The catalogue does not carry the address of that open attempt, so
              this page cannot link you to it. Return to the tab where you
              opened it and submit it there.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

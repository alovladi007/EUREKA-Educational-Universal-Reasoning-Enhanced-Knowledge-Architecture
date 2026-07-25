'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  PracticeMode,
  PracticeSessionRow,
  PracticeUnit,
  getPracticeCatalogue,
  getPracticeHistory,
  savePracticeSession,
  startPracticeSession,
} from '@/lib/practiceApi';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  SectionTitle,
  errorMessage,
} from '@/app/_ui/shell';

// The practice session builder.
//
// A learner picks units, an item count and a mode, and starts a session. Two
// choices here are deliberate:
//
//   1. Units with no practice items are listed and disabled, not hidden. A
//      course looks the size it actually is, and the gap is visible instead
//      of silent.
//   2. The started session's items are written to sessionStorage before the
//      route changes. The API serves an open session's items exactly once,
//      in the start response, so the tab that starts a session is the tab
//      that holds it. Review of a finished session opens from anywhere.

const COURSE_TITLES: Record<string, string> = {
  GEN1: 'General Chemistry I',
  GEN2: 'General Chemistry II',
  ORG1: 'Organic Chemistry I',
  ORG2: 'Organic Chemistry II',
};

const COUNT_OPTIONS = [5, 10, 20, 40];

const MODE_OPTIONS: Array<{
  mode: PracticeMode;
  label: string;
  explanation: string;
}> = [
  {
    mode: 'tutor',
    label: 'Tutor',
    explanation: 'Feedback and explanation after every question.',
  },
  {
    mode: 'timed',
    label: 'Timed',
    explanation: 'No feedback until you finish; a timer runs.',
  },
];

function formatStartedAt(iso: string | null): string {
  if (!iso) {
    return 'unknown date';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'unknown date';
  }
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PracticePage() {
  const router = useRouter();

  const [units, setUnits] = useState<PracticeUnit[] | null>(null);
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<PracticeMode>('tutor');

  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const [history, setHistory] = useState<PracticeSessionRow[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const catalogue = await getPracticeCatalogue();
        if (!cancelled) {
          setUnits(catalogue.units ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setCatalogueError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingCatalogue(false);
        }
      }
    })();
    (async () => {
      try {
        const list = await getPracticeHistory(10);
        if (!cancelled) {
          setHistory(list.sessions ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setHistoryError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Units grouped by course, in the order the API lists them, which is
  // curriculum order.
  const groups = useMemo(() => {
    if (!units) {
      return [];
    }
    const order: string[] = [];
    const byCourse: Record<string, PracticeUnit[]> = {};
    for (const unit of units) {
      if (!byCourse[unit.course]) {
        byCourse[unit.course] = [];
        order.push(unit.course);
      }
      byCourse[unit.course].push(unit);
    }
    return order.map((course) => ({ course, units: byCourse[course] }));
  }, [units]);

  function toggleUnit(unitId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  }

  // Select or clear every available unit of one course. Disabled units are
  // never selected, because a selection that cannot supply items is refused
  // at start.
  function setCourse(courseUnits: PracticeUnit[], on: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const unit of courseUnits) {
        if (!unit.available) {
          continue;
        }
        if (on) {
          next.add(unit.unit_id);
        } else {
          next.delete(unit.unit_id);
        }
      }
      return next;
    });
  }

  async function start() {
    if (starting || selected.size === 0) {
      return;
    }
    setStarting(true);
    setStartError(null);
    try {
      const session = await startPracticeSession(
        Array.from(selected),
        count,
        mode,
      );
      // The one moment the items exist client side. Persist them for this
      // tab before navigating, so the player can render them.
      savePracticeSession({
        session_id: session.session_id,
        mode: session.mode,
        items: session.items,
        answers: {},
      });
      router.push(
        `/practice/session/${encodeURIComponent(session.session_id)}`,
      );
    } catch (err) {
      // A 409 carries the API's own reason, for example that the selection
      // has no practice items. Shown as sent.
      setStartError(errorMessage(err));
      setStarting(false);
    }
  }

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Practice</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Build a session from the units you choose. Every item is generated and
        its answer key is verified before it is served, and every answer you
        submit is final.
      </p>

      <section className="mb-10">
        <SectionTitle>Build a session</SectionTitle>

        {loadingCatalogue && (
          <LoadingPanel label="Loading the practice catalogue." />
        )}
        {!loadingCatalogue && catalogueError && (
          <ErrorPanel message={catalogueError} />
        )}
        {!loadingCatalogue &&
          !catalogueError &&
          units &&
          units.length === 0 && (
            <EmptyState
              title="No units in the catalogue"
              detail="The API returned no units, so there is nothing to build a session from."
            />
          )}

        {!loadingCatalogue && !catalogueError && units && units.length > 0 && (
          <div className="space-y-4">
            <Card>
              <h3 className="mb-1 text-base font-semibold text-card-foreground">
                Units
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Pick at least one. A session mixes items across every unit you
                select.
              </p>

              <div className="space-y-6">
                {groups.map((group) => {
                  const availableIds = group.units
                    .filter((u) => u.available)
                    .map((u) => u.unit_id);
                  const pickedHere = availableIds.filter((id) =>
                    selected.has(id),
                  ).length;
                  return (
                    <fieldset key={group.course}>
                      <legend className="mb-2 flex w-full flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-card-foreground">
                          {COURSE_TITLES[group.course] ?? group.course}
                        </span>
                        {availableIds.length > 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setCourse(
                                group.units,
                                pickedHere < availableIds.length,
                              )
                            }
                            className="text-xs text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          >
                            {pickedHere < availableIds.length
                              ? 'Select all'
                              : 'Clear'}
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            no items yet in this course
                          </span>
                        )}
                      </legend>
                      <div className="space-y-1">
                        {group.units.map((unit) => (
                          <label
                            key={unit.unit_id}
                            className={[
                              'flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors',
                              unit.available
                                ? 'cursor-pointer border-border hover:border-brand-500'
                                : 'cursor-not-allowed border-border/60',
                            ].join(' ')}
                          >
                            <input
                              type="checkbox"
                              checked={selected.has(unit.unit_id)}
                              disabled={!unit.available}
                              onChange={() => toggleUnit(unit.unit_id)}
                              className="mt-0.5 h-4 w-4 accent-brand-600"
                            />
                            <span
                              className={
                                unit.available
                                  ? 'text-card-foreground'
                                  : 'text-muted-foreground'
                              }
                            >
                              <span className="font-medium">
                                {unit.index}. {unit.title}
                              </span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {unit.available
                                  ? `${unit.templates} ${
                                      unit.templates === 1
                                        ? 'template'
                                        : 'templates'
                                    }`
                                  : 'no items yet'}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 text-base font-semibold text-card-foreground">
                Length and mode
              </h3>

              <div className="mb-5">
                <label
                  htmlFor="item-count"
                  className="mb-2 block text-sm font-medium text-card-foreground"
                >
                  Items in this session
                </label>
                <select
                  id="item-count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {COUNT_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} items
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="mb-5">
                <legend className="mb-2 text-sm font-medium text-card-foreground">
                  Mode
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {MODE_OPTIONS.map((option) => (
                    <label
                      key={option.mode}
                      className={[
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                        mode === option.mode
                          ? 'border-brand-500 bg-brand-500/5'
                          : 'border-border hover:border-brand-500',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={option.mode}
                        checked={mode === option.mode}
                        onChange={() => setMode(option.mode)}
                        className="mt-0.5 h-4 w-4 accent-brand-600"
                      />
                      <span>
                        <span className="block text-sm font-medium text-card-foreground">
                          {option.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {option.explanation}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void start()}
                  disabled={starting || selected.size === 0}
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  {starting ? 'Starting' : 'Start session'}
                </button>
                <span className="text-xs text-muted-foreground">
                  {selected.size === 0
                    ? 'Pick at least one unit to start.'
                    : `${selected.size} ${
                        selected.size === 1 ? 'unit' : 'units'
                      } selected.`}
                </span>
              </div>

              {startError && (
                <p
                  role="alert"
                  className="mt-3 text-sm text-red-700 dark:text-red-300"
                >
                  {startError}
                </p>
              )}
            </Card>
          </div>
        )}
      </section>

      <section>
        <SectionTitle>Recent sessions</SectionTitle>

        {loadingHistory && <LoadingPanel label="Loading recent sessions." />}
        {!loadingHistory && historyError && (
          <ErrorPanel message={historyError} />
        )}
        {!loadingHistory &&
          !historyError &&
          history &&
          history.length === 0 && (
            <EmptyState
              title="No sessions yet"
              detail="Build one above."
            />
          )}

        {!loadingHistory && !historyError && history && history.length > 0 && (
          <ul className="space-y-3">
            {history.map((session) => (
              <li key={session.session_id}>
                <SessionRow session={session} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Page>
  );
}

// One row of history. An in-progress session links to Resume, which only has
// the items in the tab that started it; the player says so if this is a
// different tab. A finished session links to Review, which works anywhere.
function SessionRow({ session }: { session: PracticeSessionRow }) {
  const inProgress = session.status === 'in_progress';
  const summary = session.summary;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={session.mode === 'timed' ? 'amber' : 'brand'}>
              {session.mode === 'timed' ? 'Timed' : 'Tutor'}
            </Pill>
            <Pill tone={inProgress ? 'neutral' : 'green'}>
              {inProgress ? 'In progress' : 'Finished'}
            </Pill>
            <span className="text-xs text-muted-foreground">
              {formatStartedAt(session.started_at)}
            </span>
          </div>
          <p className="mt-2 text-sm text-card-foreground">
            {summary
              ? `${summary.correct} of ${summary.total} correct`
              : `${session.item_count} ${
                  session.item_count === 1 ? 'item' : 'items'
                }, not finished yet`}
          </p>
        </div>
        <Link
          href={`/practice/session/${encodeURIComponent(session.session_id)}`}
          className={
            inProgress
              ? 'inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500'
              : 'inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2'
          }
        >
          {inProgress ? 'Resume' : 'Review'}
        </Link>
      </div>
    </Card>
  );
}

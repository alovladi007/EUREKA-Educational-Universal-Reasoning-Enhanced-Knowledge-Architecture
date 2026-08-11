'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  errorMessage,
} from '@/app/_ui/shell';

// The study planner: the route /path recommends, divided across the days to a
// target date the learner picks. The API is explicit that this is schedule
// arithmetic and nothing more, and this page keeps that statement in view
// rather than burying it: no completion probability, no minutes-per-node, no
// predicted score, because none of those numbers has been measured.

interface PlannerNode {
  node: string;
  title: string;
  course: string;
  unit: string;
  group: 'review' | 'continue' | 'frontier';
  accuracy?: number;
}

interface PlannerDay {
  date: string;
  nodes: PlannerNode[];
}

interface PlannerPlan {
  target_date: string;
  days_remaining: number;
  total_nodes: number;
  review_count?: number;
  continue_count?: number;
  frontier_count?: number;
  per_day?: number;
  finishes_early?: boolean;
  days: PlannerDay[];
  note: string;
}

const DATE_KEY = 'octet:planner-target-date';

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const GROUP_TONE: Record<PlannerNode['group'], 'amber' | 'brand' | 'neutral'> = {
  review: 'amber',
  continue: 'brand',
  frontier: 'neutral',
};

const GROUP_LABEL: Record<PlannerNode['group'], string> = {
  review: 'Review',
  continue: 'Continue',
  frontier: 'New',
};

export default function PlannerPage() {
  const [targetDate, setTargetDate] = useState('');
  const [plan, setPlan] = useState<PlannerPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (date: string) => {
    if (!date) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const got = await apiGet<PlannerPlan>(
        `/planner?target_date=${encodeURIComponent(date)}`,
      );
      setPlan(got);
      try {
        window.localStorage.setItem(DATE_KEY, date);
      } catch {
        // Storage unavailable is fine; the date just does not persist.
      }
    } catch (err) {
      setPlan(null);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(DATE_KEY);
    } catch {
      saved = null;
    }
    if (saved && saved > new Date().toISOString().slice(0, 10)) {
      setTargetDate(saved);
      void load(saved);
    }
  }, [load]);

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Planner</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Pick a date and the route is divided across the days until it: what
        needs review first, then what you started, then new material in
        course order.
      </p>

      <Card className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(targetDate);
          }}
          className="flex flex-wrap items-end gap-3"
        >
          <div>
            <label
              htmlFor="planner-date"
              className="mb-1 block text-sm font-medium text-card-foreground"
            >
              Target date
            </label>
            <input
              id="planner-date"
              type="date"
              min={tomorrowISO()}
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={!targetDate || loading}
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {loading ? 'Building' : 'Build the plan'}
          </button>
        </form>
      </Card>

      {error && <ErrorPanel message={error} />}
      {loading && <LoadingPanel label="Building the plan" />}

      {!loading && !error && !plan && (
        <EmptyState
          title="No plan yet"
          detail="Choose a target date and build the plan. It is recomputed from your recorded practice every time, so it stays current as you work."
        />
      )}

      {!loading && plan && (
        <>
          <Card className="mb-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span>
                <span className="text-2xl font-bold tabular-nums text-card-foreground">
                  {plan.total_nodes}
                </span>{' '}
                <span className="text-muted-foreground">nodes on the route</span>
              </span>
              {typeof plan.per_day === 'number' && plan.total_nodes > 0 && (
                <span>
                  <span className="text-2xl font-bold tabular-nums text-card-foreground">
                    {plan.per_day}
                  </span>{' '}
                  <span className="text-muted-foreground">per day</span>
                </span>
              )}
              <span>
                <span className="text-2xl font-bold tabular-nums text-card-foreground">
                  {plan.days_remaining}
                </span>{' '}
                <span className="text-muted-foreground">
                  days to {plan.target_date}
                </span>
              </span>
              {plan.finishes_early && (
                <Pill tone="brand">Finishes ahead of the date</Pill>
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {plan.note}
            </p>
          </Card>

          {plan.total_nodes === 0 ? (
            <EmptyState
              title="Nothing to schedule"
              detail={plan.note}
            />
          ) : (
            <ol className="space-y-4">
              {plan.days.map((day) => (
                <li key={day.date}>
                  <Card>
                    <h2 className="mb-3 text-sm font-semibold text-card-foreground">
                      {day.date}
                    </h2>
                    <ul className="space-y-2">
                      {day.nodes.map((n) => (
                        <li
                          key={n.node}
                          className="flex flex-wrap items-center gap-2 text-sm"
                        >
                          <Pill tone={GROUP_TONE[n.group]}>
                            {GROUP_LABEL[n.group]}
                          </Pill>
                          <Link
                            href={`/learn/${encodeURIComponent(n.node)}`}
                            className="text-card-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          >
                            {n.title}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {n.course}
                          </span>
                          {typeof n.accuracy === 'number' && (
                            <span className="text-xs tabular-nums text-muted-foreground">
                              {Math.round(n.accuracy * 100)}% recorded
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </Page>
  );
}

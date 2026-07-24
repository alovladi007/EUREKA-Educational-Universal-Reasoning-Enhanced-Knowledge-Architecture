'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PathEntry, PathPlan, getPath } from '@/lib/api';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  errorMessage,
  tierName,
} from '@/app/_ui/shell';

// The planned route through the graph.
//
// Every entry carries a reason, and the reason is shown. The planner is
// required to explain itself to the learner rather than just asserting an
// order, so hiding the reason would remove the point of the page.

export default function PathPage() {
  const [plan, setPlan] = useState<PathPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ready' | 'blocked' | 'mastered'>(
    'all',
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getPath();
        if (!cancelled) {
          setPlan(result);
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

  const entries = plan?.plan ?? [];
  const shown =
    filter === 'all' ? entries : entries.filter((e) => e.state === filter);

  const counts = {
    ready: entries.filter((e) => e.state === 'ready').length,
    blocked: entries.filter((e) => e.state === 'blocked').length,
    mastered: entries.filter((e) => e.state === 'mastered').length,
  };

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Path</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        The order the course plans for you, with the reason behind each
        decision.
      </p>

      {loading && <LoadingPanel label="Planning your route." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && entries.length === 0 && (
        <EmptyState
          title="No plan to show"
          detail="The path endpoint returned an empty plan."
        />
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="space-y-6">
          {plan?.note && (
            <Card className="border-amber-300 dark:border-amber-800">
              <p className="text-sm text-card-foreground">{plan.note}</p>
            </Card>
          )}

          {plan?.recommended_node && (
            <Card className="border-brand-500">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Recommended next
              </p>
              <Link
                href={`/learn/${encodeURIComponent(plan.recommended_node)}`}
                className="mt-1 inline-block text-lg font-semibold text-brand-700 hover:underline dark:text-brand-300"
              >
                {entries.find((e) => e.node === plan.recommended_node)?.title ||
                  plan.recommended_node}
              </Link>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {plan.recommended_node}
              </p>
            </Card>
          )}

          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              label={`All (${entries.length})`}
            />
            <FilterButton
              active={filter === 'ready'}
              onClick={() => setFilter('ready')}
              label={`Ready (${counts.ready})`}
            />
            <FilterButton
              active={filter === 'blocked'}
              onClick={() => setFilter('blocked')}
              label={`Blocked (${counts.blocked})`}
            />
            <FilterButton
              active={filter === 'mastered'}
              onClick={() => setFilter('mastered')}
              label={`Mastered (${counts.mastered})`}
            />
          </div>

          {shown.length === 0 ? (
            <EmptyState
              title="Nothing in this state"
              detail="No node in the plan currently matches this filter."
            />
          ) : (
            <ol className="space-y-2">
              {shown.map((entry) => (
                <li key={entry.node}>
                  <PlanRow entry={entry} />
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </Page>
  );
}

function stateTone(state: string): 'green' | 'red' | 'brand' | 'neutral' {
  if (state === 'mastered') {
    return 'green';
  }
  if (state === 'ready') {
    return 'brand';
  }
  if (state === 'blocked') {
    return 'red';
  }
  return 'neutral';
}

function PlanRow({ entry }: { entry: PathEntry }) {
  return (
    <Link
      href={`/learn/${encodeURIComponent(entry.node)}`}
      className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={stateTone(entry.state)}>{entry.state}</Pill>
        <Pill tone="neutral">{tierName(entry.tier)}</Pill>
        <span className="font-mono text-xs text-muted-foreground">
          {entry.node}
        </span>
        {entry.level && (
          <span className="text-xs text-muted-foreground">
            level {entry.level}
          </span>
        )}
      </div>
      <p className="mt-1 text-base font-semibold text-card-foreground">
        {entry.title}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{entry.reason}</p>
    </Link>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-border text-muted-foreground hover:border-brand-500'
      }`}
    >
      {label}
    </button>
  );
}

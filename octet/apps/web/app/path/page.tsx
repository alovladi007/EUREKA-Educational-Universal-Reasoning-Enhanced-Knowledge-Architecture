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
  PageHeader,
  Pill,
  errorMessage,
} from '@/app/_ui/shell';

// The recommended route, built from recorded practice.
//
// Three groups, in the order a learner should act on them: review what is
// failing, continue what is under way, then open what is newly ready. Every
// entry carries a reason, and the reason is shown. The planner is required to
// explain itself to the learner rather than just asserting an order, so
// hiding the reason would remove the point of the page.

export default function PathPage() {
  const [plan, setPlan] = useState<PathPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const review = plan?.review ?? [];
  const cont = plan?.continue ?? [];
  const next = plan?.next ?? [];
  const empty = review.length === 0 && cont.length === 0 && next.length === 0;

  return (
    <Page>
      <PageHeader
        title="Path"
        lead="What to do next, with the reason behind each recommendation. The order comes from the prerequisite graph and your recorded attempts, not from a guess."
      />

      {loading && <LoadingPanel label="Planning your route." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && plan && (
        <div className="space-y-6">
          {plan.note && (
            <Card className="border-amber-300 dark:border-amber-800">
              <p className="text-sm text-card-foreground">{plan.note}</p>
            </Card>
          )}

          {empty && (
            <EmptyState
              title="Nothing to recommend"
              detail="The path endpoint returned no recommendations."
            />
          )}

          <PathGroup
            title="Review first"
            detail="Recorded accuracy fell below the review bar. Weakest first."
            entries={review}
          />
          <PathGroup
            title="Continue"
            detail="Started but not yet mastered. Most recently practiced first."
            entries={cont}
          />
          <PathGroup
            title="Up next"
            detail="Not attempted yet, prerequisites in place. Course order."
            entries={next}
          />
        </div>
      )}
    </Page>
  );
}

function PathGroup({
  title,
  detail,
  entries,
}: {
  title: string;
  detail: string;
  entries: PathEntry[];
}) {
  if (entries.length === 0) {
    return null;
  }
  return (
    <section>
      <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
      <p className="mb-2 text-sm text-muted-foreground">{detail}</p>
      <ol className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.node}>
            <PlanRow entry={entry} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function stateTone(state: string): 'green' | 'red' | 'brand' | 'neutral' {
  if (state === 'needs_review') {
    return 'red';
  }
  if (state === 'in_progress') {
    return 'brand';
  }
  if (state === 'ready') {
    return 'green';
  }
  return 'neutral';
}

function stateLabel(state: string): string {
  if (state === 'needs_review') {
    return 'needs review';
  }
  if (state === 'in_progress') {
    return 'in progress';
  }
  return state;
}

function PlanRow({ entry }: { entry: PathEntry }) {
  return (
    <Link
      href={`/learn/${encodeURIComponent(entry.node)}`}
      className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={stateTone(entry.state)}>{stateLabel(entry.state)}</Pill>
        <span className="font-mono text-xs text-muted-foreground">
          {entry.node}
        </span>
        {typeof entry.accuracy === 'number' && (
          <span className="text-xs text-muted-foreground">
            {Math.round(entry.accuracy * 100)}% over {entry.attempts} {entry.attempts === 1 ? 'attempt' : 'attempts'}
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

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  fetchDueReviews,
  fetchLearningPath,
  getToken,
  type DueReview,
  type LearningPath,
  type PathNode,
} from '@/lib/api';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';
import { ProgressBar, toPercent } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';

// The learning-path view. It renders the prerequisite-aware plan as an ordered
// list. Each node carries a status badge (available, locked, mastered). The
// recommended node is highlighted, and every available node links to practice.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

// Human labels for the Curriculum & Proof Extension tiers, so the path reads as
// a ladder rather than a flat list. Nodes without a tier (the demo algebra
// graph) fall into "Other skills".
const TIER_LABELS: Record<string, string> = {
  '0': 'Tier 0 · Foundations',
  '1': 'Tier 1 · Secondary',
  '2': 'Tier 2 · Calculus',
  '3': 'Tier 3 · Core methods',
  '4': 'Tier 4 · Proof transition',
  '5': 'Tier 5 · Proof core',
  '6': 'Tier 6 · Advanced and graduate',
};

function tierLabel(tier: number | null | undefined): string {
  if (tier === null || tier === undefined) {
    return 'Other skills';
  }
  return TIER_LABELS[String(tier)] ?? `Tier ${tier}`;
}

type TierGroup = { key: string; label: string; nodes: PathNode[] };

// Group the (already prerequisite-ordered) plan by tier, preserving order. Tiers
// ascend with prerequisites, so grouping keeps the ladder readable.
function groupByTier(plan: PathNode[]): TierGroup[] {
  const groups: TierGroup[] = [];
  const byKey = new Map<string, TierGroup>();
  for (const node of plan) {
    const key =
      node.tier === null || node.tier === undefined ? 'none' : String(node.tier);
    let group = byKey.get(key);
    if (!group) {
      group = { key, label: tierLabel(node.tier), nodes: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.nodes.push(node);
  }
  return groups;
}

// A small badge for the node's kind. Computational skills get no badge (they are
// the default and would just add noise); the proof kinds are the ones worth
// calling out.
function KindBadge({ kind }: { kind?: string }) {
  const label =
    kind === 'proof_technique'
      ? 'Technique'
      : kind === 'theorem_with_proof'
        ? 'Theorem'
        : kind === 'concept'
          ? 'Concept'
          : null;
  if (!label) {
    return null;
  }
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {label}
    </span>
  );
}

// A badge for the applied/pure track when set.
function TrackBadge({ track }: { track?: string | null }) {
  if (track !== 'applied' && track !== 'pure') {
    return null;
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
      {track}
    </span>
  );
}

export default function PathPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [path, setPath] = useState<LearningPath | null>(null);
  const [due, setDue] = useState<DueReview[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchLearningPath();
        if (cancelled) {
          return;
        }
        setPath(result);
        // Spaced-repetition reviews are best-effort; a failure must not block
        // the path from rendering.
        try {
          const reviews = await fetchDueReviews();
          if (!cancelled) {
            setDue(reviews.reviews);
          }
        } catch {
          // ignore
        }
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load your path.',
        );
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading AXIOM.</p>
      </main>
    );
  }

  if (state === 'signed-out') {
    return <SignInScreen />;
  }

  const recommendedId = path?.recommended_node_id ?? null;

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">
          Your learning path
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Skills run from pre-algebra through the proof-based core, grouped by
          tier with prerequisites first. Locked skills open up as you master what
          they depend on. Proof techniques and theorems are called out with a
          badge.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading your path.
          </p>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && due.length > 0 && (
          <section className="mt-6 rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-950">
            <h2 className="text-sm font-semibold text-brand-800 dark:text-brand-200">
              Spaced-repetition reviews due ({due.length})
            </h2>
            <p className="mt-1 text-xs text-brand-700 dark:text-brand-300">
              You have mastered these skills. A quick review now keeps them from
              fading.
            </p>
            <ul className="mt-3 space-y-2">
              {due.map((review) => (
                <li
                  key={review.node_id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-brand-200 bg-background p-3 dark:border-brand-900"
                >
                  <span className="text-sm font-medium text-card-foreground">
                    {review.title}
                  </span>
                  <Link
                    href={`/practice?node=${encodeURIComponent(review.code)}`}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    Review now
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {state === 'ready' && path && (
          <>
            {path.plan.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  There is no path to show yet. Once the curriculum has skills,
                  your path will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-8">
                {groupByTier(path.plan).map((group) => (
                  <section key={group.key} aria-label={group.label}>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.label}
                    </h2>
                    <ol className="space-y-3">
                      {group.nodes.map((node: PathNode) => {
                        const recommended = node.node_id === recommendedId;
                        const clickable = node.status === 'available';
                        return (
                          <li
                            key={node.node_id}
                            className={`rounded-lg border p-4 ${
                              recommended
                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                                : 'border-border bg-card'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-card-foreground">
                                    {node.title}
                                  </span>
                                  <KindBadge kind={node.kind} />
                                  <TrackBadge track={node.track} />
                                  {recommended && (
                                    <span className="inline-flex items-center rounded-full bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
                                      Recommended
                                    </span>
                                  )}
                                </div>
                                <span className="mt-1 block font-mono text-xs text-muted-foreground">
                                  {node.code}
                                </span>
                              </div>
                              <StatusBadge status={node.status} />
                            </div>

                            <div className="mt-3">
                              <ProgressBar
                                value={node.p_known}
                                label={`Mastery of ${node.title}`}
                              />
                              <p className="mt-1 text-xs text-muted-foreground">
                                {toPercent(node.p_known)}%{' '}
                                <span className="capitalize">({node.level})</span>
                              </p>
                              {node.reason && (
                                <p className="mt-1 text-xs italic text-muted-foreground">
                                  {node.reason}
                                </p>
                              )}
                            </div>

                            {clickable && (
                              <div className="mt-3">
                                <Link
                                  href={`/practice?node=${encodeURIComponent(node.code)}`}
                                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                                >
                                  Practice this skill
                                </Link>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}

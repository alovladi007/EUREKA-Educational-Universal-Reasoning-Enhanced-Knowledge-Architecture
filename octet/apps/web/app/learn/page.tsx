'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CurriculumNode, getCurriculumNodes } from '@/lib/api';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  errorMessage,
  tierName,
} from '@/app/_ui/shell';

// The lesson index, grouped by tier in course order. Ordering inside a tier is
// the order the API returns, which is the authored order of the graph.

const TIER_ORDER = ['CF', 'G1', 'G2'];

export default function LearnPage() {
  const [nodes, setNodes] = useState<CurriculumNode[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getCurriculumNodes();
        if (!cancelled) {
          setNodes(result.nodes);
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

  const grouped = new Map<string, CurriculumNode[]>();
  for (const node of nodes ?? []) {
    const bucket = grouped.get(node.tier);
    if (bucket) {
      bucket.push(node);
    } else {
      grouped.set(node.tier, [node]);
    }
  }
  const tiers = TIER_ORDER.filter((t) => grouped.has(t)).concat(
    Array.from(grouped.keys()).filter((t) => !TIER_ORDER.includes(t)),
  );

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Learn</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Every node carries one lesson in the six part arc. A node lists the
        prerequisites it builds directly on.
      </p>

      {loading && <LoadingPanel label="Loading the curriculum." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && tiers.length === 0 && (
        <EmptyState
          title="No nodes to show"
          detail="The curriculum endpoint returned an empty list."
        />
      )}

      {!loading && !error && tiers.length > 0 && (
        <div className="space-y-10">
          {tiers.map((tier) => {
            const tierNodes = grouped.get(tier) ?? [];
            return (
              <section key={tier}>
                <div className="mb-3 flex flex-wrap items-baseline gap-3">
                  <h2 className="text-lg font-semibold">{tierName(tier)}</h2>
                  <span className="text-sm text-muted-foreground">
                    {tierNodes.length}{' '}
                    {tierNodes.length === 1 ? 'node' : 'nodes'}
                  </span>
                </div>
                <ul className="space-y-2">
                  {tierNodes.map((node) => (
                    <li key={node.code}>
                      <Link
                        href={`/learn/${encodeURIComponent(node.code)}`}
                        className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {node.code}
                          </span>
                          {node.lab_adjacent && (
                            <Pill tone="amber">lab adjacent</Pill>
                          )}
                          {node.triangle_eligible && (
                            <Pill tone="brand">triangle</Pill>
                          )}
                        </div>
                        <p className="mt-1 text-base font-semibold text-card-foreground">
                          {node.title}
                        </p>
                        {node.summary && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {node.summary}
                          </p>
                        )}
                        {node.prerequisites.length > 0 && (
                          <p className="mt-2 font-mono text-xs text-muted-foreground">
                            Builds on: {node.prerequisites.join(', ')}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </Page>
  );
}

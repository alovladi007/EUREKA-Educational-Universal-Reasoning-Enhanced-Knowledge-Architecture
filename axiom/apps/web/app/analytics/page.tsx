'use client';

import { useEffect, useState } from 'react';
import {
  ApiError,
  downloadAuthed,
  fetchAnalyticsItems,
  fetchGrowth,
  fetchStandards,
  getToken,
  type AnalyticsItem,
  type GrowthEvent,
  type GrowthResponse,
  type StandardNode,
} from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';
import { ProgressBar, toPercent } from '@/components/ProgressBar';

// The teacher-facing analytics view. Item analysis, a standards heatmap, and the
// current user's growth summary. The analytics endpoints are teacher-gated, so a
// 403 renders a friendly "teachers and admins" panel instead of an error.

type LoadState =
  | 'checking'
  | 'signed-out'
  | 'loading'
  | 'ready'
  | 'forbidden'
  | 'error';

function isForbidden(err: unknown): boolean {
  return err instanceof ApiError && err.status === 403;
}

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function formatIrt(value: number): string {
  return value.toFixed(2);
}

export default function AnalyticsPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const [items, setItems] = useState<AnalyticsItem[]>([]);
  const [nodes, setNodes] = useState<StandardNode[]>([]);
  const [growth, setGrowth] = useState<GrowthResponse | null>(null);

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        // The analytics calls are teacher-gated. Run items first so a 403 is
        // detected before anything renders.
        const [itemsRes, standardsRes, growthRes] = await Promise.all([
          fetchAnalyticsItems(),
          fetchStandards(),
          fetchGrowth(),
        ]);
        if (cancelled) {
          return;
        }
        setItems(itemsRes.items);
        setNodes(standardsRes.nodes);
        setGrowth(growthRes);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (isForbidden(err)) {
          setState('forbidden');
          return;
        }
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load analytics.',
        );
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function exportFile(path: string, filename: string) {
    setExporting(true);
    setExportError('');
    try {
      await downloadAuthed(path, filename);
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : 'Failed to download the export.',
      );
    } finally {
      setExporting(false);
    }
  }

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

  const recentEvents: GrowthEvent[] = growth ? growth.events.slice(-12) : [];

  return (
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/teacher">Teacher</HeaderLink>
        <HeaderLink href="/grading-review">Grading</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/review">Review</HeaderLink>
        <HeaderLink href="/copilot">Copilot</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Item analysis, standards mastery, and growth over time.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading analytics.
          </p>
        )}

        {state === 'forbidden' && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
            <h2 className="mb-1 text-base font-semibold text-amber-800 dark:text-amber-200">
              Analytics is available to teachers and admins
            </h2>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Your account does not have access to analytics, so there is
              nothing to show here.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && (
          <div className="mt-8 space-y-10">
            <section aria-label="Item analysis">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Item analysis
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      void exportFile(
                        '/api/v1/analytics/items.csv',
                        'item-analysis.csv',
                      )
                    }
                    disabled={exporting}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                  >
                    Download CSV
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void exportFile(
                        '/api/v1/analytics/items.pdf',
                        'item-analysis.pdf',
                      )
                    }
                    disabled={exporting}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                  >
                    Download PDF
                  </button>
                </div>
              </div>

              {exportError && (
                <p className="mb-3 text-sm text-red-700 dark:text-red-300">
                  {exportError}
                </p>
              )}

              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No item responses recorded yet.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border bg-card">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Node</th>
                        <th className="px-3 py-2 font-medium">Title</th>
                        <th className="px-3 py-2 font-medium">Kind</th>
                        <th className="px-3 py-2 font-medium">N</th>
                        <th className="px-3 py-2 font-medium">p-value</th>
                        <th className="px-3 py-2 font-medium">Avg score</th>
                        <th className="px-3 py-2 font-medium">IRT a/b/c</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.item_id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {item.node_code}
                          </td>
                          <td className="px-3 py-2 text-card-foreground">
                            {item.node_title}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {item.kind}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {item.n_responses}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {item.p_value.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {item.avg_score.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {item.irt
                              ? `${formatIrt(item.irt.a)} / ${formatIrt(
                                  item.irt.b,
                                )} / ${formatIrt(item.irt.c)}`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section aria-label="Standards mastery">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Standards mastery
              </h2>
              {nodes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No standards data yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {nodes.map((node) => (
                    <li
                      key={node.code}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold text-card-foreground">
                          {node.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {toPercent(node.avg_p_known)}% average -{' '}
                          {node.n_learners} learner
                          {node.n_learners === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <ProgressBar
                          value={node.avg_p_known}
                          label={`Average mastery of ${node.title}`}
                        />
                      </div>
                      <span className="mt-2 block font-mono text-xs text-muted-foreground">
                        {node.code}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-label="Your growth">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Your growth
              </h2>
              {growth && growth.n_events > 0 ? (
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm text-card-foreground">
                    Average mastery now:{' '}
                    <span className="font-semibold">
                      {toPercent(growth.avg_p_known_now)}%
                    </span>{' '}
                    across {growth.n_events} recorded event
                    {growth.n_events === 1 ? '' : 's'}.
                  </p>
                  <ol className="mt-4 space-y-2">
                    {recentEvents.map((event, index) => (
                      <li
                        key={`${event.t}-${index}`}
                        className="flex flex-wrap items-center gap-2 text-sm"
                      >
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            event.correct
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {event.correct ? 'Correct' : 'Incorrect'}
                        </span>
                        <span className="text-muted-foreground">
                          mastery now {toPercent(event.p_known_after)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatWhen(event.t)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No growth events recorded yet.
                </p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

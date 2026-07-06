'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  fetchLearningPath,
  getToken,
  type LearningPath,
  type PathNode,
} from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';
import { ProgressBar, toPercent } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';

// The learning-path view. It renders the prerequisite-aware plan as an ordered
// list. Each node carries a status badge (available, locked, mastered). The
// recommended node is highlighted, and every available node links to practice.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

export default function PathPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [path, setPath] = useState<LearningPath | null>(null);
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
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/practice">Practice</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/review">Review</HeaderLink>
        <HeaderLink href="/copilot">Copilot</HeaderLink>
        <HeaderLink href="/cat">Adaptive Test</HeaderLink>
        <HeaderLink href="/achievements">Achievements</HeaderLink>
        <HeaderLink href="/analytics">Analytics</HeaderLink>
        <HeaderLink href="/grading-review">Grading</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">
          Your learning path
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Skills are ordered so prerequisites come first. Locked skills open up
          as you master what they depend on.
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
              <ol className="mt-8 space-y-3">
                {path.plan.map((node: PathNode, index) => {
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
                            <span className="text-xs font-medium text-muted-foreground">
                              {index + 1}.
                            </span>
                            <span className="text-sm font-semibold text-card-foreground">
                              {node.title}
                            </span>
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
            )}
          </>
        )}
      </main>
    </div>
  );
}

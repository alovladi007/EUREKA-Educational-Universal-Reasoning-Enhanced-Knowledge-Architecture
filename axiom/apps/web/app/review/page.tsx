'use client';

import { useEffect, useState } from 'react';
import { fetchMistakes, getToken, type MistakeItem } from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';

// The "Review your mistakes" view. It lists the learner's recent incorrect
// answers, most recent first, so each mistake can be revisited: the prompt, the
// answer that was submitted, the correct answer, and the graded explanation.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function MistakeCard({ item }: { item: MistakeItem }) {
  return (
    <li className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-card-foreground">
            {item.node_title}
          </h2>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {item.kind}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatWhen(item.submitted_at)}
        </span>
      </div>

      <p className="mt-3 text-sm text-card-foreground">{item.prompt}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950">
          <p className="text-xs font-medium uppercase tracking-wide text-rose-700 dark:text-rose-300">
            Your answer
          </p>
          <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">
            {item.your_answer}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            Correct answer
          </p>
          <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
            {item.correct_answer}
          </p>
        </div>
      </div>

      {item.explanation && (
        <p className="mt-4 text-sm text-muted-foreground">{item.explanation}</p>
      )}
    </li>
  );
}

export default function ReviewPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [items, setItems] = useState<MistakeItem[]>([]);
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
        const result = await fetchMistakes();
        if (cancelled) {
          return;
        }
        setItems(result.items);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Failed to load your mistakes.',
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

  return (
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/practice">Practice</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/copilot">Copilot</HeaderLink>
        <HeaderLink href="/cat">Adaptive Test</HeaderLink>
        <HeaderLink href="/achievements">Achievements</HeaderLink>
        <HeaderLink href="/analytics">Analytics</HeaderLink>
        <HeaderLink href="/grading-review">Grading</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">
          Review your mistakes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your recent incorrect answers, most recent first. Revisit each one to
          see the correct answer and why.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading your mistakes.
          </p>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && (
          <>
            {items.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No mistakes to review. Great work - keep practicing.
                </p>
                <div className="mt-4">
                  <HeaderLink href="/practice">Go to practice</HeaderLink>
                </div>
              </div>
            ) : (
              <ul className="mt-8 space-y-4">
                {items.map((item) => (
                  <MistakeCard key={item.response_id} item={item} />
                ))}
              </ul>
            )}

            <div className="mt-8">
              <HeaderLink href="/practice">Back to practice</HeaderLink>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

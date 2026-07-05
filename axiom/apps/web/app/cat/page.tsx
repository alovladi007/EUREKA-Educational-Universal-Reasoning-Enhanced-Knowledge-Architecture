'use client';

import { useEffect, useState } from 'react';
import {
  catAnswer,
  catStart,
  getToken,
  isCatDone,
  type CatItem,
} from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';

// The adaptive-test runner. It does not auto-start: the learner presses "Start
// adaptive test", then answers one served item at a time. Selection kinds render
// as option buttons; everything else is a text input. After each answer the
// current ability estimate (theta), its standard error, and the item count are
// shown, then the next item loads. A "done" response shows a completion card.

type Phase =
  | 'checking'
  | 'signed-out'
  | 'idle'
  | 'starting'
  | 'question'
  | 'submitting'
  | 'done'
  | 'error';

// The three kinds that render as selectable options rather than a text field.
const SELECTION_KINDS = ['mcq_single', 'mcq_multi', 'true_false'];

function isSelectionKind(kind: string): boolean {
  return SELECTION_KINDS.includes(kind);
}

function formatTheta(value: number): string {
  return value.toFixed(2);
}

export default function CatPage() {
  const [phase, setPhase] = useState<Phase>('checking');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [item, setItem] = useState<CatItem | null>(null);

  const [theta, setTheta] = useState<number | null>(null);
  const [standardError, setStandardError] = useState<number | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const [answer, setAnswer] = useState('');
  const [doneMessage, setDoneMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!getToken()) {
      setPhase('signed-out');
      return;
    }
    setPhase('idle');
  }, []);

  function resetProgress() {
    setSessionId(null);
    setItem(null);
    setTheta(null);
    setStandardError(null);
    setItemCount(0);
    setLastCorrect(null);
    setAnswer('');
    setDoneMessage('');
    setErrorMessage('');
  }

  async function start() {
    resetProgress();
    setPhase('starting');
    try {
      const res = await catStart();
      if (isCatDone(res)) {
        setDoneMessage(res.message);
        setPhase('done');
        return;
      }
      setSessionId(res.session_id);
      setItem(res.item);
      setTheta(res.theta);
      setStandardError(res.standard_error);
      setItemCount(res.item_count);
      setPhase('question');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to start the test.',
      );
      setPhase('error');
    }
  }

  async function submit() {
    if (!sessionId || !item) {
      return;
    }
    const trimmed = answer.trim();
    if (!trimmed) {
      return;
    }
    setPhase('submitting');
    setErrorMessage('');
    try {
      const res = await catAnswer(sessionId, trimmed);
      setTheta(res.theta);
      setStandardError(res.standard_error);
      setItemCount(res.item_count);
      setLastCorrect(res.is_correct);
      if (res.done || !res.item) {
        setItem(null);
        setDoneMessage('You have finished the adaptive test.');
        setPhase('done');
        return;
      }
      setItem(res.item);
      setAnswer('');
      setPhase('question');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to submit your answer.',
      );
      setPhase('error');
    }
  }

  if (phase === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading AXIOM.</p>
      </main>
    );
  }

  if (phase === 'signed-out') {
    return <SignInScreen />;
  }

  const submitting = phase === 'submitting';

  return (
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/practice">Practice</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/copilot">Copilot</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Adaptive test</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A short test that adapts to your answers. Each item is chosen to learn
          the most about your ability. Your estimate updates as you go.
        </p>

        {phase === 'idle' && (
          <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-lg font-semibold text-card-foreground">
              Ready when you are
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The test starts only when you begin. You can stop by leaving the
              page.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => void start()}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Start adaptive test
              </button>
            </div>
          </div>
        )}

        {phase === 'starting' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Starting the test.
          </p>
        )}

        {phase === 'error' && (
          <div className="mt-8 space-y-4">
            <ErrorPanel message={errorMessage} />
            <button
              type="button"
              onClick={() => void start()}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Start again
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-lg font-semibold text-card-foreground">
              Test complete
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {doneMessage || 'You have finished the adaptive test.'}
            </p>
            {theta !== null && standardError !== null && (
              <dl className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-4 text-left">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Ability (theta)
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-card-foreground">
                    {formatTheta(theta)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Std error
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-card-foreground">
                    {formatTheta(standardError)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Items
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-card-foreground">
                    {itemCount}
                  </dd>
                </div>
              </dl>
            )}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => void start()}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Start again
              </button>
            </div>
          </div>
        )}

        {(phase === 'question' || phase === 'submitting') && item && (
          <section className="mt-8 rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>Item {itemCount + 1}</span>
              {theta !== null && standardError !== null && (
                <span aria-live="polite">
                  Ability {formatTheta(theta)} (std error{' '}
                  {formatTheta(standardError)})
                </span>
              )}
            </div>

            {lastCorrect !== null && (
              <p
                className={`mt-2 text-xs font-medium ${
                  lastCorrect
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-red-700 dark:text-red-300'
                }`}
                aria-live="polite"
              >
                Previous answer: {lastCorrect ? 'correct' : 'incorrect'}
              </p>
            )}

            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-card-foreground">
              {item.prompt}
            </p>

            {isSelectionKind(item.kind) && item.options ? (
              <fieldset className="mt-5" disabled={submitting}>
                <legend className="sr-only">Choose an answer</legend>
                <div className="space-y-2">
                  {item.options.map((option) => {
                    const selected = answer === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswer(option)}
                        aria-pressed={selected}
                        className={`w-full rounded-lg border p-3 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                          selected
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                            : 'border-border bg-background hover:border-brand-300'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <div className="mt-5">
                <label
                  htmlFor="cat-answer-input"
                  className="mb-1 block text-sm font-medium text-card-foreground"
                >
                  Your answer
                </label>
                <input
                  id="cat-answer-input"
                  type="text"
                  value={answer}
                  disabled={submitting}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !submitting) {
                      void submit();
                    }
                  }}
                  autoComplete="off"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                  placeholder="Type your answer"
                />
              </div>
            )}

            <div className="mt-5">
              <button
                type="button"
                onClick={() => void submit()}
                disabled={submitting || answer.trim() === ''}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Checking.' : 'Submit answer'}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

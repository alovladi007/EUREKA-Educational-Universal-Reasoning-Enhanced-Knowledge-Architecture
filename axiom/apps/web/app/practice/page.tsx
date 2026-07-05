'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getToken,
  isPracticeDone,
  practiceAnswer,
  practiceNext,
  type AnswerResult,
  type PracticeDone,
  type PracticeQuestion,
} from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';
import { toPercent } from '@/components/ProgressBar';

// The practice loop:
//   1. POST /practice/next to serve a question (optionally scoped to ?node=)
//   2. render the prompt (buttons for mcq_single, a text input otherwise)
//   3. POST /practice/answer to grade it and show the mastery delta
//   4. offer a "Next question" button that starts the loop again
// A "done" response shows an encouraging empty state.

type Phase =
  | 'checking'
  | 'signed-out'
  | 'loading'
  | 'question'
  | 'answered'
  | 'done'
  | 'error';

function PracticeInner() {
  const searchParams = useSearchParams();
  const nodeParam = searchParams.get('node') ?? undefined;

  const [phase, setPhase] = useState<Phase>('checking');
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [doneMessage, setDoneMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);

  const loadNext = useCallback(async () => {
    setPhase('loading');
    setResult(null);
    setAnswer('');
    setErrorMessage('');
    try {
      const next = await practiceNext(nodeParam);
      if (isPracticeDone(next)) {
        setDoneMessage((next as PracticeDone).message);
        setPhase('done');
        return;
      }
      setQuestion(next as PracticeQuestion);
      setPhase('question');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load a question.',
      );
      setPhase('error');
    }
  }, [nodeParam]);

  useEffect(() => {
    if (!getToken()) {
      setPhase('signed-out');
      return;
    }
    void loadNext();
  }, [loadNext]);

  async function submit() {
    if (!question) {
      return;
    }
    const trimmed = answer.trim();
    if (!trimmed) {
      return;
    }
    setSubmitting(true);
    setErrorMessage('');
    try {
      const graded = await practiceAnswer(question.response_token, trimmed);
      setResult(graded);
      setPhase('answered');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to submit your answer.',
      );
      setPhase('error');
    } finally {
      setSubmitting(false);
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

  const isMcq = question?.kind === 'mcq_single';

  return (
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/learn">Learn</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Practice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Answer one question at a time. Your mastery updates after each answer.
        </p>

        {phase === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading a question.
          </p>
        )}

        {phase === 'error' && (
          <div className="mt-8 space-y-4">
            <ErrorPanel message={errorMessage} />
            <button
              type="button"
              onClick={() => void loadNext()}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Try again
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-lg font-semibold text-card-foreground">
              You are all caught up
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {doneMessage || 'Nothing to practice right now. Great work.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <HeaderLink href="/mastery">Review your mastery</HeaderLink>
              <HeaderLink href="/path">See your learning path</HeaderLink>
            </div>
          </div>
        )}

        {(phase === 'question' || phase === 'answered') && question && (
          <section className="mt-8 rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-300">
              {question.node_title}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-card-foreground">
              {question.prompt}
            </p>

            {isMcq && question.options ? (
              <fieldset className="mt-5" disabled={phase === 'answered'}>
                <legend className="sr-only">Choose an answer</legend>
                <div className="space-y-2">
                  {question.options.map((option) => {
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
                        } ${phase === 'answered' ? 'opacity-70' : ''}`}
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
                  htmlFor="answer-input"
                  className="mb-1 block text-sm font-medium text-card-foreground"
                >
                  Your answer
                </label>
                <input
                  id="answer-input"
                  type="text"
                  value={answer}
                  disabled={phase === 'answered'}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && phase === 'question') {
                      void submit();
                    }
                  }}
                  autoComplete="off"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                  placeholder="Type your answer"
                />
              </div>
            )}

            {phase === 'question' && (
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
            )}

            {phase === 'answered' && result && (
              <div className="mt-6 border-t border-border pt-6" aria-live="polite">
                <p
                  className={`text-sm font-semibold ${
                    result.is_correct
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {result.is_correct ? 'Correct' : 'Incorrect'}
                </p>
                <p className="mt-2 text-sm text-card-foreground">
                  <span className="font-medium">Correct answer:</span>{' '}
                  {result.correct_answer}
                </p>
                {result.explanation && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {result.explanation}
                  </p>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
                  Mastery moved from {toPercent(result.mastery.p_known_before)}%
                  to {toPercent(result.mastery.p_known_after)}% (
                  {result.mastery.level}).
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => void loadNext()}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  >
                    Next question
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading practice.</p>
        </main>
      }
    >
      <PracticeInner />
    </Suspense>
  );
}

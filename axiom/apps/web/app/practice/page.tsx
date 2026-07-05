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
  // Selected option indices for mcq_multi, submitted as a JSON array string.
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);

  const loadNext = useCallback(async () => {
    setPhase('loading');
    setResult(null);
    setAnswer('');
    setSelectedIndices([]);
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

  // Build the answer payload string for the current item kind. mcq_multi is
  // submitted as a JSON array of the selected option indices, e.g. "[0,2]".
  // Every other kind submits the trimmed text/selection as-is.
  function buildPayload(): string {
    if (!question) {
      return '';
    }
    if (question.kind === 'mcq_multi') {
      const sorted = [...selectedIndices].sort((a, b) => a - b);
      return JSON.stringify(sorted);
    }
    return answer.trim();
  }

  // Whether the current input has enough to submit.
  function canSubmit(): boolean {
    if (!question) {
      return false;
    }
    if (question.kind === 'mcq_multi') {
      return selectedIndices.length > 0;
    }
    return answer.trim() !== '';
  }

  function toggleIndex(index: number) {
    setSelectedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  }

  async function submit() {
    if (!question || !canSubmit()) {
      return;
    }
    const payload = buildPayload();
    if (!payload) {
      return;
    }
    setSubmitting(true);
    setErrorMessage('');
    try {
      const graded = await practiceAnswer(question.response_token, payload);
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

  const kind = question?.kind;

  return (
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/learn">Learn</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/cat">Adaptive Test</HeaderLink>
        <HeaderLink href="/achievements">Achievements</HeaderLink>
        <HeaderLink href="/analytics">Analytics</HeaderLink>
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

            {kind === 'mcq_single' && question.options ? (
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
            ) : kind === 'mcq_multi' && question.options ? (
              <fieldset className="mt-5" disabled={phase === 'answered'}>
                <legend className="mb-2 block text-sm font-medium text-card-foreground">
                  Select all that apply
                </legend>
                <div className="space-y-2">
                  {question.options.map((option, index) => {
                    const checked = selectedIndices.includes(index);
                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm transition-colors ${
                          checked
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                            : 'border-border bg-background hover:border-brand-300'
                        } ${phase === 'answered' ? 'opacity-70' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={phase === 'answered'}
                          onChange={() => toggleIndex(index)}
                          className="mt-0.5"
                        />
                        <span className="text-card-foreground">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : kind === 'true_false' ? (
              <fieldset className="mt-5" disabled={phase === 'answered'}>
                <legend className="sr-only">Choose true or false</legend>
                <div className="flex gap-2">
                  {[
                    { label: 'True', value: 'true' },
                    { label: 'False', value: 'false' },
                  ].map((choice) => {
                    const selected = answer === choice.value;
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        onClick={() => setAnswer(choice.value)}
                        aria-pressed={selected}
                        className={`flex-1 rounded-lg border p-3 text-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                          selected
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                            : 'border-border bg-background hover:border-brand-300'
                        } ${phase === 'answered' ? 'opacity-70' : ''}`}
                      >
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : kind === 'show_work' ? (
              <div className="mt-5">
                <label
                  htmlFor="answer-textarea"
                  className="mb-1 block text-sm font-medium text-card-foreground"
                >
                  Your work
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Show each step on its own line.
                </p>
                <textarea
                  id="answer-textarea"
                  value={answer}
                  rows={6}
                  disabled={phase === 'answered'}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                  placeholder="One step per line"
                />
              </div>
            ) : (
              <div className="mt-5">
                <label
                  htmlFor="answer-input"
                  className="mb-1 block text-sm font-medium text-card-foreground"
                >
                  Your answer
                </label>
                {kind === 'plot_points' && (
                  <p className="mb-2 text-xs text-muted-foreground">
                    Enter a JSON list of [x, y] pairs, for example
                    [[1,5],[2,7]].
                  </p>
                )}
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
                  placeholder={
                    kind === 'plot_points'
                      ? '[[1,5],[2,7]]'
                      : 'Type your answer'
                  }
                />
              </div>
            )}

            {phase === 'question' && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => void submit()}
                  disabled={submitting || !canSubmit()}
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

                {result.step_credits && result.step_credits.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Step credit
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {result.step_credits.map((credit, index) => (
                        <li
                          key={`${credit.milestone}-${index}`}
                          className="flex flex-wrap items-center gap-2 text-sm"
                        >
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              credit.awarded
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {credit.awarded ? 'Awarded' : 'Not yet'}
                          </span>
                          <span className="text-card-foreground">
                            {credit.milestone}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.gamification && (
                  <p
                    className="mt-4 text-sm font-medium text-brand-600 dark:text-brand-300"
                    aria-live="polite"
                  >
                    {`+XP to ${result.gamification.xp_total} total (level ${result.gamification.level}, streak ${result.gamification.streak_days} ${
                      result.gamification.streak_days === 1 ? 'day' : 'days'
                    }).`}
                    {result.gamification.new_badges.length > 0 &&
                      ` New badge: ${result.gamification.new_badges.join(', ')}.`}
                  </p>
                )}

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

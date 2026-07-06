'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  copilotHint,
  fetchResponseResult,
  getToken,
  isPracticeDone,
  practiceAnswer,
  practiceNext,
  type AnswerResult,
  type CopilotHintResult,
  type PracticeDone,
  type PracticeQuestion,
  type ResponseResult,
} from '@/lib/api';
import { ErrorPanel, HeaderLink, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';
import { toPercent } from '@/components/ProgressBar';

// The practice loop:
//   1. POST /practice/next to serve a question (optionally scoped to ?node=)
//   2. render the prompt (buttons for mcq_single, a text input otherwise)
//   3. POST /practice/answer to grade it and show the mastery delta
//   4. offer a "Next question" button that starts the loop again
// A "done" response shows an encouraging empty state.
//
// Free_response items are graded asynchronously: POST /practice/answer returns
// a "grading" state instead of the grade, and the client polls
// GET /practice/response/{token} until the grade is ready. That poll is driven
// by the "grading" phase and the effect below. Every other kind is graded
// synchronously and lands directly in "answered" as before.

type Phase =
  | 'checking'
  | 'signed-out'
  | 'loading'
  | 'question'
  | 'grading'
  | 'answered'
  | 'done'
  | 'error';

// How often to poll for an async grade, and how many attempts before giving up.
const GRADING_POLL_MS = 1200;
const GRADING_MAX_ATTEMPTS = 25;

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

  // Async free_response grading. When the answer POST returns a "grading"
  // state, the response_token is held here and the effect below polls until the
  // grade lands (mapped into gradedResponse) or an error/timeout is reported.
  const [gradingToken, setGradingToken] = useState<string | null>(null);
  const [gradedResponse, setGradedResponse] = useState<ResponseResult | null>(
    null,
  );
  const [gradingError, setGradingError] = useState('');

  // AI hint state. The hint is guidance, not the answer, and is fetched on
  // demand for the currently served question via its response_token.
  const [hint, setHint] = useState<CopilotHintResult | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState('');

  const loadNext = useCallback(async () => {
    setPhase('loading');
    setResult(null);
    setGradingToken(null);
    setGradedResponse(null);
    setGradingError('');
    setAnswer('');
    setSelectedIndices([]);
    setErrorMessage('');
    setHint(null);
    setHintError('');
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
    setGradingError('');
    setGradedResponse(null);
    try {
      const graded = await practiceAnswer(question.response_token, payload);
      // Async free_response grading: the grade is not ready yet. Hold the token
      // and enter the "grading" phase; the polling effect takes it from here.
      if (graded.status === 'grading') {
        setResult(graded);
        setGradingToken(graded.response_token ?? question.response_token);
        setPhase('grading');
        return;
      }
      // Synchronous path (fast kinds): the full grade is present and renders
      // immediately, exactly as before.
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

  // Ask the AI copilot for a hint on the current question. The hint is
  // grounding-aware guidance keyed off the served response_token, presented as
  // help rather than the answer. Failures are shown inline and do not disturb
  // the practice flow.
  async function getHint() {
    if (!question || hintLoading) {
      return;
    }
    setHintLoading(true);
    setHintError('');
    try {
      const result = await copilotHint({
        response_token: question.response_token,
      });
      setHint(result);
    } catch (err) {
      setHintError(
        err instanceof Error ? err.message : 'Failed to load a hint.',
      );
    } finally {
      setHintLoading(false);
    }
  }

  // Poll the grading status for an async free_response answer. Runs only while a
  // gradingToken is held (set when the answer POST returned status "grading").
  // A recursive setTimeout keeps ~GRADING_POLL_MS between attempts regardless of
  // request latency. Stops on graded (renders the result card), on error (shows
  // a message), on unmount (cancelled flag + cleared timer), and after
  // GRADING_MAX_ATTEMPTS (shows a "taking longer" message).
  useEffect(() => {
    if (!gradingToken) {
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetchResponseResult(gradingToken);
        if (cancelled) {
          return;
        }
        if (res.status === 'graded') {
          setGradedResponse(res);
          setPhase('answered');
          return;
        }
        // Still "grading" (or "unanswered", transiently): keep polling until the
        // attempt budget is exhausted.
        if (attempts >= GRADING_MAX_ATTEMPTS) {
          setGradingError(
            'Grading is taking longer than expected - check back shortly.',
          );
          return;
        }
        timer = setTimeout(() => {
          void poll();
        }, GRADING_POLL_MS);
      } catch (err) {
        if (cancelled) {
          return;
        }
        setGradingError(
          err instanceof Error
            ? err.message
            : 'Failed to load your grade. Check back shortly.',
        );
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [gradingToken]);

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

  // The answered card consumes a single normalized shape regardless of how the
  // grade arrived: synchronously in `result` (an AnswerResult, which also
  // carries a mastery delta and gamification) or asynchronously in
  // `gradedResponse` (a ResponseResult from polling, which carries neither).
  // Preferring the polled grade lets the async free_response path render the
  // very same card as the fast kinds. The mastery/gamification lines are only
  // rendered when present, so their absence on the async path is handled.
  const graded: AnswerResult | null = gradedResponse
    ? {
        status: 'graded',
        is_correct: gradedResponse.is_correct,
        score: gradedResponse.score,
        grader: gradedResponse.grader,
        correct_answer: gradedResponse.correct_answer,
        explanation: gradedResponse.explanation,
        step_credits: gradedResponse.step_credits,
        ai_graded: gradedResponse.ai_graded,
        overridable: gradedResponse.overridable,
        confidence: gradedResponse.confidence,
      }
    : result;

  // Inputs are locked once the answer is submitted: while an async grade is
  // being polled ("grading") and after any grade lands ("answered").
  const inputsLocked = phase === 'answered' || phase === 'grading';

  return (
    <AppShell>
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

        {(phase === 'question' ||
          phase === 'grading' ||
          phase === 'answered') &&
          question && (
          <section className="mt-8 rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-300">
              {question.node_title}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-card-foreground">
              {question.prompt}
            </p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => void getHint()}
                disabled={hintLoading}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {hintLoading ? 'Getting a hint.' : 'Get a hint'}
              </button>

              {hintError && (
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {hintError}
                </p>
              )}

              {hint && (
                <div
                  className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950"
                  aria-live="polite"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                      AI hint
                    </span>
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      AI - via {hint.provider || 'copilot'}
                    </span>
                    {hint.grounded === false && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        Not grounded
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    AI-assisted guidance, not the answer. It points you in the
                    right direction - work the problem yourself.
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-amber-900 dark:text-amber-100">
                    {hint.hint}
                  </p>
                  {hint.sources.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-amber-800 dark:text-amber-200">
                        Sources
                      </p>
                      <ul className="mt-2 space-y-2">
                        {hint.sources.map((src, index) => (
                          <li
                            key={`${src.source}-${index}`}
                            className="rounded-lg border border-amber-200 bg-amber-100/50 p-3 dark:border-amber-900 dark:bg-amber-900/40"
                          >
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                                {src.source}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                                {src.kind}
                              </span>
                            </div>
                            {src.text && (
                              <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                                {src.text}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {kind === 'mcq_single' && question.options ? (
              <fieldset className="mt-5" disabled={inputsLocked}>
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
                        } ${inputsLocked ? 'opacity-70' : ''}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : kind === 'mcq_multi' && question.options ? (
              <fieldset className="mt-5" disabled={inputsLocked}>
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
                        } ${inputsLocked ? 'opacity-70' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={inputsLocked}
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
              <fieldset className="mt-5" disabled={inputsLocked}>
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
                        } ${inputsLocked ? 'opacity-70' : ''}`}
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
                  disabled={inputsLocked}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                  placeholder="One step per line"
                />
              </div>
            ) : kind === 'free_response' ? (
              <div className="mt-5">
                <label
                  htmlFor="answer-textarea"
                  className="mb-1 block text-sm font-medium text-card-foreground"
                >
                  Your written response
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Answer in your own words. An AI grader scores your response,
                  and a teacher can review and adjust the grade.
                </p>
                <textarea
                  id="answer-textarea"
                  value={answer}
                  rows={8}
                  disabled={inputsLocked}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                  placeholder="Write your response"
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
                  disabled={inputsLocked}
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

            {phase === 'grading' && (
              <div
                className="mt-6 border-t border-border pt-6"
                aria-live="polite"
                aria-busy={!gradingError}
              >
                {gradingError ? (
                  <div className="space-y-4">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {gradingError}
                    </p>
                    <button
                      type="button"
                      onClick={() => void loadNext()}
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      Next question
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-card-foreground">
                      Grading your response.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      An AI grader is scoring your response. This can take a few
                      seconds - hang tight.
                    </p>
                  </>
                )}
              </div>
            )}

            {phase === 'answered' && graded && (
              <div className="mt-6 border-t border-border pt-6" aria-live="polite">
                <p
                  className={`text-sm font-semibold ${
                    graded.is_correct
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {graded.is_correct ? 'Correct' : 'Incorrect'}
                </p>
                {graded.correct_answer && (
                  <p className="mt-2 text-sm text-card-foreground">
                    <span className="font-medium">Correct answer:</span>{' '}
                    {graded.correct_answer}
                  </p>
                )}
                {graded.explanation && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {graded.explanation}
                  </p>
                )}
                {graded.mastery && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Mastery moved from{' '}
                    {toPercent(graded.mastery.p_known_before)}% to{' '}
                    {toPercent(graded.mastery.p_known_after)}% (
                    {graded.mastery.level}).
                  </p>
                )}

                {graded.ai_graded && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        AI-graded
                      </span>
                      {typeof graded.confidence === 'number' && (
                        <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
                          confidence {graded.confidence.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                      This response was scored by AI. A teacher can review and
                      adjust this grade.
                    </p>

                    {graded.step_credits &&
                      graded.step_credits.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium uppercase tracking-wide text-amber-800 dark:text-amber-200">
                            Criteria
                          </p>
                          <ul className="mt-2 space-y-2">
                            {graded.step_credits.map((credit, index) => (
                              <li
                                key={`${credit.milestone}-${index}`}
                                className="rounded-lg border border-amber-200 bg-amber-100/50 p-3 dark:border-amber-900 dark:bg-amber-900/40"
                              >
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                      credit.awarded
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    {credit.awarded
                                      ? 'Awarded'
                                      : 'Not awarded'}
                                  </span>
                                  <span className="font-medium text-amber-900 dark:text-amber-100">
                                    {credit.milestone}
                                  </span>
                                  {typeof credit.points === 'number' && (
                                    <span className="text-xs text-amber-800 dark:text-amber-200">
                                      {(credit.awarded_points ?? 0)} /{' '}
                                      {credit.points} pts
                                    </span>
                                  )}
                                </div>
                                {credit.note && (
                                  <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                                    {credit.note}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}

                {!graded.ai_graded &&
                  graded.step_credits &&
                  graded.step_credits.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Step credit
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {graded.step_credits.map((credit, index) => (
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

                {graded.gamification && (
                  <p
                    className="mt-4 text-sm font-medium text-brand-600 dark:text-brand-300"
                    aria-live="polite"
                  >
                    {`+XP to ${graded.gamification.xp_total} total (level ${graded.gamification.level}, streak ${graded.gamification.streak_days} ${
                      graded.gamification.streak_days === 1 ? 'day' : 'days'
                    }).`}
                    {graded.gamification.new_badges.length > 0 &&
                      ` New badge: ${graded.gamification.new_badges.join(', ')}.`}
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
    </AppShell>
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

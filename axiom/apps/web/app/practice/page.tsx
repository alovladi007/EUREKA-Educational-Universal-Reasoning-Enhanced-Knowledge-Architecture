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
  proofTutor,
  verifyFormalProof,
  type AnswerResult,
  type CopilotHintResult,
  type FormalVerdict,
  type PracticeDone,
  type PracticeQuestion,
  type ProofTutorResult,
  type ResponseResult,
} from '@/lib/api';
import { ErrorPanel, HeaderLink, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';
import { toPercent } from '@/components/ProgressBar';
import dynamic from 'next/dynamic';
import { RichMath } from '@/components/Math';
import { MathField } from '@/components/MathField';

// Mafs is a browser-only graphing library, so the coordinate-plane inputs load
// client-side only (no SSR) with a skeleton placeholder while they hydrate.
const GraphInput = dynamic(() => import('@/components/CoordinatePlane'), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] w-full animate-pulse rounded-lg border border-border bg-muted" />
  ),
});

// The item kinds whose answer is a math expression, equation, or numeric value.
// These get the MathLive editor (real fractions/exponents) instead of a plain
// text box, and submit ASCII-math that the SymPy grader parses.
const MATH_INPUT_KINDS = new Set(['math_expression', 'equation', 'numeric']);

// Per-kind helper text shown under the math editor.
const MATH_INPUT_HELP: Record<string, string> = {
  math_expression: 'Enter an expression. Use ^ for powers (x^2) and / for fractions.',
  equation: 'Enter an equation, for example y = 2x + 3.',
  numeric: 'Enter a number or exact value, for example 3/4 or sqrt(2).',
};

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
  // The learner's current ordering for the `ordering` and `proof_assembly`
  // kinds (the option strings in their chosen order), submitted as a JSON array.
  const [ordered, setOrdered] = useState<string[]>([]);
  // justification_matching: step index -> chosen justification from the bank.
  const [matchAssign, setMatchAssign] = useState<Record<number, string>>({});
  // proof_gap_fill: one string per gap, submitted as a JSON array of fills.
  const [gapFills, setGapFills] = useState<string[]>([]);
  // mixed: one answer per part, submitted as a JSON array in part order.
  const [mixedAnswers, setMixedAnswers] = useState<string[]>([]);
  // cloze_math: one string per blank, submitted as a JSON array.
  const [clozeBlanks, setClozeBlanks] = useState<string[]>([]);
  // categorize_sort: item -> chosen category, submitted as a JSON object.
  const [categorize, setCategorize] = useState<Record<string, string>>({});
  // drag_tokens: the chosen tokens in order, submitted as a JSON array.
  const [tokenOrder, setTokenOrder] = useState<string[]>([]);
  // table_completion: a 2D array of cell strings, submitted as JSON.
  const [tableCells, setTableCells] = useState<string[][]>([]);
  // formal_proof: the last kernel verdict from the Check button, if any.
  const [formalVerdict, setFormalVerdict] = useState<FormalVerdict | null>(null);
  const [formalChecking, setFormalChecking] = useState(false);
  // free_form_proof: proof-tutor guidance (graduated hint + first gap).
  const [tutorResult, setTutorResult] = useState<ProofTutorResult | null>(null);
  const [tutorLevel, setTutorLevel] = useState(0);
  const [tutorLoading, setTutorLoading] = useState(false);
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
    setOrdered([]);
    setMatchAssign({});
    setGapFills([]);
    setMixedAnswers([]);
    setClozeBlanks([]);
    setCategorize({});
    setTokenOrder([]);
    setTableCells([]);
    setFormalVerdict(null);
    setFormalChecking(false);
    setTutorResult(null);
    setTutorLevel(0);
    setTutorLoading(false);
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
      const question = next as PracticeQuestion;
      setQuestion(question);
      if (question.kind === 'ordering' || question.kind === 'proof_assembly') {
        setOrdered(question.options ?? []);
      }
      if (question.kind === 'proof_gap_fill') {
        const gapCount = question.presentation?.gap_count ?? 1;
        setGapFills(Array.from({ length: gapCount }, () => ''));
      }
      if (question.kind === 'mixed') {
        const partCount = question.presentation?.parts?.length ?? 0;
        setMixedAnswers(Array.from({ length: partCount }, () => ''));
      }
      if (question.kind === 'cloze_math') {
        const segments = question.presentation?.segments;
        const blankCount = Array.isArray(segments)
          ? segments.filter((s) => s === '').length
          : question.presentation?.blank_count ?? 1;
        setClozeBlanks(Array.from({ length: Math.max(1, blankCount) }, () => ''));
      }
      if (question.kind === 'drag_tokens') {
        setTokenOrder([]);
      }
      if (question.kind === 'table_completion') {
        const display = question.presentation?.display ?? [];
        // Pre-filled cells stay fixed; blank cells (empty string) become inputs.
        setTableCells(display.map((row) => row.map((cell) => String(cell ?? ''))));
      }
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
    if (question.kind === 'ordering' || question.kind === 'proof_assembly') {
      return JSON.stringify(ordered);
    }
    if (question.kind === 'justification_matching') {
      const pairs = (question.options ?? []).map((step, i) => [
        step,
        matchAssign[i] ?? '',
      ]);
      return JSON.stringify(pairs);
    }
    if (question.kind === 'proof_gap_fill') {
      return JSON.stringify(gapFills);
    }
    if (question.kind === 'mixed') {
      return JSON.stringify(mixedAnswers);
    }
    if (question.kind === 'cloze_math') {
      return JSON.stringify(clozeBlanks);
    }
    if (question.kind === 'categorize_sort') {
      return JSON.stringify(categorize);
    }
    if (question.kind === 'drag_tokens') {
      return JSON.stringify(tokenOrder);
    }
    if (question.kind === 'table_completion') {
      return JSON.stringify(tableCells);
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
    if (question.kind === 'ordering' || question.kind === 'proof_assembly') {
      return ordered.length > 0;
    }
    if (question.kind === 'justification_matching') {
      const steps = question.options ?? [];
      return steps.length > 0 && steps.every((_, i) => (matchAssign[i] ?? '') !== '');
    }
    if (question.kind === 'proof_gap_fill') {
      return gapFills.length > 0 && gapFills.every((g) => g.trim() !== '');
    }
    if (question.kind === 'mixed') {
      return mixedAnswers.length > 0 && mixedAnswers.every((a) => a.trim() !== '');
    }
    if (question.kind === 'cloze_math') {
      return clozeBlanks.length > 0 && clozeBlanks.every((b) => b.trim() !== '');
    }
    if (question.kind === 'categorize_sort') {
      const items = question.presentation?.items ?? [];
      return items.length > 0 && items.every((it) => (categorize[it] ?? '') !== '');
    }
    if (question.kind === 'drag_tokens') {
      return tokenOrder.length > 0;
    }
    if (question.kind === 'table_completion') {
      return tableCells.some((row) => row.some((cell) => cell.trim() !== ''));
    }
    return answer.trim() !== '';
  }

  // Move an item in the ordering up or down by one position.
  function moveOrdered(index: number, delta: number) {
    setOrdered((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) {
        return prev;
      }
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
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
            <div className="mt-3 text-base leading-relaxed text-card-foreground">
              <RichMath text={question.prompt} />
            </div>

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
            ) : kind === 'ordering' ? (
              <fieldset className="mt-5" disabled={inputsLocked}>
                <legend className="mb-2 block text-sm font-medium text-card-foreground">
                  Put the steps in order
                </legend>
                <ol className="space-y-2">
                  {ordered.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background p-2"
                    >
                      <span className="w-6 text-center text-xs text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm text-card-foreground">{item}</span>
                      <button
                        type="button"
                        onClick={() => moveOrdered(index, -1)}
                        disabled={inputsLocked || index === 0}
                        aria-label={`Move "${item}" up`}
                        className="rounded border border-border px-2 py-1 text-xs text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveOrdered(index, 1)}
                        disabled={inputsLocked || index === ordered.length - 1}
                        aria-label={`Move "${item}" down`}
                        className="rounded border border-border px-2 py-1 text-xs text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40"
                      >
                        Down
                      </button>
                    </li>
                  ))}
                </ol>
              </fieldset>
            ) : kind === 'proof_assembly' ? (
              <fieldset className="mt-5" disabled={inputsLocked}>
                <legend className="mb-2 block text-sm font-medium text-card-foreground">
                  Assemble the proof in order
                </legend>
                <ol className="space-y-2">
                  {ordered.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background p-2"
                    >
                      <span className="w-6 text-center text-xs text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm text-card-foreground">{item}</span>
                      <button
                        type="button"
                        onClick={() => moveOrdered(index, -1)}
                        disabled={inputsLocked || index === 0}
                        aria-label={`Move "${item}" up`}
                        className="rounded border border-border px-2 py-1 text-xs text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveOrdered(index, 1)}
                        disabled={inputsLocked || index === ordered.length - 1}
                        aria-label={`Move "${item}" down`}
                        className="rounded border border-border px-2 py-1 text-xs text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40"
                      >
                        Down
                      </button>
                    </li>
                  ))}
                </ol>
              </fieldset>
            ) : kind === 'find_the_error' ? (
              <fieldset className="mt-5" disabled={inputsLocked}>
                <legend className="mb-2 block text-sm font-medium text-card-foreground">
                  Select the invalid step
                </legend>
                <div className="space-y-2">
                  {(question.options ?? []).map((step, index) => (
                    <label
                      key={index}
                      className="flex items-start gap-2 rounded-lg border border-border bg-background p-2 text-sm text-card-foreground"
                    >
                      <input
                        type="radio"
                        name="find-the-error"
                        className="mt-1"
                        checked={answer === String(index)}
                        disabled={inputsLocked}
                        onChange={() => setAnswer(String(index))}
                      />
                      <span>
                        <span className="mr-2 text-xs text-muted-foreground">
                          Step {index + 1}
                        </span>
                        {step}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : kind === 'justification_matching' ? (
              <fieldset className="mt-5" disabled={inputsLocked}>
                <legend className="mb-2 block text-sm font-medium text-card-foreground">
                  Match each step to its justification
                </legend>
                <div className="space-y-2">
                  {(question.options ?? []).map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2 sm:flex-row sm:items-center"
                    >
                      <span className="flex-1 text-sm text-card-foreground">{step}</span>
                      <select
                        aria-label={`Justification for "${step}"`}
                        value={matchAssign[index] ?? ''}
                        disabled={inputsLocked}
                        onChange={(e) =>
                          setMatchAssign((prev) => ({ ...prev, [index]: e.target.value }))
                        }
                        className="rounded border border-border bg-card px-2 py-1 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="">Choose a justification</option>
                        {(question.presentation?.justification_bank ?? []).map((j) => (
                          <option key={j} value={j}>
                            {j}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </fieldset>
            ) : kind === 'proof_gap_fill' ? (
              <fieldset className="mt-5" disabled={inputsLocked}>
                <legend className="mb-2 block text-sm font-medium text-card-foreground">
                  Fill each gap in the proof
                </legend>
                <div className="space-y-2">
                  {gapFills.map((fill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-16 text-xs text-muted-foreground">
                        Gap {index + 1}
                      </span>
                      <input
                        type="text"
                        value={fill}
                        disabled={inputsLocked}
                        aria-label={`Fill for gap ${index + 1}`}
                        onChange={(e) =>
                          setGapFills((prev) => {
                            const next = [...prev];
                            next[index] = e.target.value;
                            return next;
                          })
                        }
                        className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            ) : kind === 'counterexample' ? (
              <div className="mt-5">
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Your counterexample
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Enter a value that breaks the claim. Use ^ for powers.
                </p>
                <MathField
                  key={question.response_token}
                  readOnly={inputsLocked}
                  ariaLabel="Counterexample value"
                  placeholder="for example 1/2"
                  onChange={(ascii) => setAnswer(ascii)}
                  onEnter={() => {
                    if (phase === 'question') {
                      void submit();
                    }
                  }}
                />
              </div>
            ) : kind === 'state_definition' || kind === 'state_theorem' ? (
              <div className="mt-5">
                <label
                  htmlFor="state-input"
                  className="mb-1 block text-sm font-medium text-card-foreground"
                >
                  {kind === 'state_definition'
                    ? 'State the definition'
                    : 'State the theorem'}
                </label>
                <textarea
                  id="state-input"
                  rows={3}
                  value={answer}
                  disabled={inputsLocked}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Write it in your own words."
                />
              </div>
            ) : kind === 'mixed' ? (
              <div className="mt-5 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Answer each part. Computation parts are graded by the CAS; proof
                  parts get an AI-assisted first pass and instructor sign-off.
                </p>
                {(question.presentation?.parts ?? []).map((part, index) => {
                  const isProof =
                    part.kind === 'free_form_proof' ||
                    part.kind === 'free_response' ||
                    part.kind === 'formal_proof';
                  return (
                    <div key={index}>
                      <label
                        htmlFor={`mixed-part-${index}`}
                        className="mb-1 block text-sm font-medium text-card-foreground"
                      >
                        {part.label}
                      </label>
                      {isProof ? (
                        <textarea
                          id={`mixed-part-${index}`}
                          rows={5}
                          value={mixedAnswers[index] ?? ''}
                          disabled={inputsLocked}
                          onChange={(e) =>
                            setMixedAnswers((prev) => {
                              const next = [...prev];
                              next[index] = e.target.value;
                              return next;
                            })
                          }
                          className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="Write your argument."
                        />
                      ) : (
                        <input
                          id={`mixed-part-${index}`}
                          type="text"
                          value={mixedAnswers[index] ?? ''}
                          disabled={inputsLocked}
                          onChange={(e) =>
                            setMixedAnswers((prev) => {
                              const next = [...prev];
                              next[index] = e.target.value;
                              return next;
                            })
                          }
                          className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="Your answer (use ^ for powers)"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : kind === 'free_form_proof' ? (
              <div className="mt-5">
                <label
                  htmlFor="proof-input"
                  className="mb-1 block text-sm font-medium text-card-foreground"
                >
                  Your proof
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Write your proof. It gets an AI-assisted first pass and always
                  goes to an instructor for final sign-off. Use the proof tutor
                  for a nudge (it never hands over the proof).
                </p>
                <textarea
                  id="proof-input"
                  rows={8}
                  value={answer}
                  disabled={inputsLocked}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Assume ... Then ... Therefore ..."
                />
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={inputsLocked || tutorLoading}
                    onClick={async () => {
                      setTutorLoading(true);
                      try {
                        const level = tutorResult ? Math.min(2, tutorLevel + 1) : 0;
                        const res = await proofTutor(
                          question.response_token,
                          answer,
                          level,
                        );
                        setTutorResult(res);
                        setTutorLevel(res.level);
                      } catch {
                        setTutorResult(null);
                      } finally {
                        setTutorLoading(false);
                      }
                    }}
                    className="rounded border border-border px-3 py-1 text-sm text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40"
                  >
                    {tutorLoading
                      ? 'Thinking...'
                      : tutorResult
                        ? 'More help'
                        : 'Proof tutor'}
                  </button>
                </div>
                {tutorResult ? (
                  <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-sm">
                    <p className="text-card-foreground">{tutorResult.hint}</p>
                    {tutorResult.gap ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Next gap to address: {tutorResult.gap} (
                        {tutorResult.established} of {tutorResult.milestone_count}{' '}
                        steps established).
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      AI-assisted guidance, not the answer.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : kind === 'formal_proof' ? (
              <div className="mt-5">
                <label
                  htmlFor="formal-input"
                  className="mb-1 block text-sm font-medium text-card-foreground"
                >
                  Lean 4 proof
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Your proof is checked by the Lean kernel, not by AI. Use Check
                  to run the verifier; submitting records the result. If no
                  toolchain is configured, the proof is sent for manual review.
                </p>
                <textarea
                  id="formal-input"
                  rows={8}
                  value={answer}
                  disabled={inputsLocked}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="theorem my_proof : 2 + 2 = 4 := by decide"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={inputsLocked || formalChecking || answer.trim() === ''}
                    onClick={async () => {
                      setFormalChecking(true);
                      try {
                        setFormalVerdict(await verifyFormalProof(answer));
                      } catch {
                        setFormalVerdict(null);
                      } finally {
                        setFormalChecking(false);
                      }
                    }}
                    className="rounded border border-border px-3 py-1 text-sm text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40"
                  >
                    {formalChecking ? 'Checking...' : 'Check proof'}
                  </button>
                  {formalVerdict ? (
                    <span
                      className={`text-sm ${
                        formalVerdict.verified
                          ? 'text-emerald-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formalVerdict.verified
                        ? `Kernel verified (${formalVerdict.backend}).`
                        : formalVerdict.available
                          ? 'Kernel rejected the proof.'
                          : 'No toolchain configured; will be sent for review.'}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : kind === 'plot_points' ? (
              <div className="mt-5">
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Plot the points
                </label>
                <GraphInput
                  key={question.response_token}
                  mode="points"
                  readOnly={inputsLocked}
                  onChange={(payload) => setAnswer(payload)}
                />
              </div>
            ) : kind === 'draw_line' ? (
              <div className="mt-5">
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Draw the line
                </label>
                <GraphInput
                  key={question.response_token}
                  mode="line"
                  readOnly={inputsLocked}
                  onChange={(payload) => setAnswer(payload)}
                />
              </div>
            ) : kind === 'plot_function' ? (
              <div className="mt-5">
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Enter and graph the function
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Type f(x) using ^ for powers. The graph updates as you type.
                </p>
                <MathField
                  key={question.response_token}
                  readOnly={inputsLocked}
                  ariaLabel="Function of x"
                  placeholder="f(x), for example x^2 - 1"
                  onChange={(ascii) => setAnswer(ascii)}
                  onEnter={() => {
                    if (phase === 'question') {
                      void submit();
                    }
                  }}
                />
                <div className="mt-3">
                  <GraphInput mode="function" expression={answer} />
                </div>
              </div>
            ) : kind === 'number_line' ? (
              <div className="mt-5">
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Drag to place your value on the number line
                </label>
                {(() => {
                  const min = question.presentation?.min ?? -10;
                  const max = question.presentation?.max ?? 10;
                  const step = question.presentation?.step ?? 1;
                  const current = answer === '' ? (min + max) / 2 : Number(answer);
                  return (
                    <div>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={current}
                        disabled={inputsLocked}
                        aria-label="Value on the number line"
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full"
                      />
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>{min}</span>
                        <span className="font-mono text-sm text-foreground">
                          {answer === '' ? '(drag to choose)' : answer}
                        </span>
                        <span>{max}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : kind === 'cloze_math' ? (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-card-foreground">
                  Fill in the blanks
                </label>
                <div className="flex flex-wrap items-center gap-2 text-sm text-card-foreground">
                  {(() => {
                    const segments = question.presentation?.segments;
                    const blankInput = (bi: number) => (
                      <input
                        key={`blank-${bi}`}
                        type="text"
                        value={clozeBlanks[bi] ?? ''}
                        disabled={inputsLocked}
                        aria-label={`Blank ${bi + 1}`}
                        onChange={(e) =>
                          setClozeBlanks((prev) => {
                            const next = [...prev];
                            next[bi] = e.target.value;
                            return next;
                          })
                        }
                        className="w-24 rounded border border-border bg-background px-2 py-1 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                      />
                    );
                    if (Array.isArray(segments)) {
                      let blankIdx = -1;
                      return segments.map((seg, i) => {
                        if (seg === '') {
                          blankIdx += 1;
                          return blankInput(blankIdx);
                        }
                        return <span key={`seg-${i}`}>{seg}</span>;
                      });
                    }
                    return clozeBlanks.map((_, bi) => blankInput(bi));
                  })()}
                </div>
              </div>
            ) : kind === 'categorize_sort' ? (
              <div className="mt-5 space-y-2">
                <label className="block text-sm font-medium text-card-foreground">
                  Sort each item into a category
                </label>
                {(question.presentation?.items ?? []).map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-2"
                  >
                    <span className="text-sm font-medium text-card-foreground">{item}</span>
                    <select
                      value={categorize[item] ?? ''}
                      disabled={inputsLocked}
                      aria-label={`Category for ${item}`}
                      onChange={(e) =>
                        setCategorize((prev) => ({ ...prev, [item]: e.target.value }))
                      }
                      className="rounded border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                    >
                      <option value="">Choose...</option>
                      {(question.presentation?.categories ?? []).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ) : kind === 'drag_tokens' ? (
              <div className="mt-5 space-y-3">
                <label className="block text-sm font-medium text-card-foreground">
                  Tap tokens in order to build the expression
                </label>
                <div className="min-h-[2.5rem] rounded-lg border border-border bg-card p-2 font-mono text-sm text-foreground">
                  {tokenOrder.length === 0 ? (
                    <span className="text-muted-foreground">Your expression appears here</span>
                  ) : (
                    tokenOrder.join(' ')
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(question.presentation?.tokens ?? []).map((tok, i) => (
                    <button
                      key={`${tok}-${i}`}
                      type="button"
                      disabled={inputsLocked}
                      onClick={() => setTokenOrder((prev) => [...prev, tok])}
                      className="rounded border border-border bg-background px-3 py-1 font-mono text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                    >
                      {tok}
                    </button>
                  ))}
                </div>
                {tokenOrder.length > 0 && (
                  <button
                    type="button"
                    disabled={inputsLocked}
                    onClick={() => setTokenOrder([])}
                    className="text-xs text-muted-foreground underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            ) : kind === 'table_completion' ? (
              <div className="mt-5 overflow-x-auto">
                <label className="mb-2 block text-sm font-medium text-card-foreground">
                  Complete the table
                </label>
                <table className="border-collapse text-sm">
                  {(question.presentation?.col_headers?.length ?? 0) > 0 && (
                    <thead>
                      <tr>
                        {(question.presentation?.row_headers?.length ?? 0) > 0 && (
                          <th className="border border-border px-2 py-1" />
                        )}
                        {(question.presentation?.col_headers ?? []).map((h, i) => (
                          <th
                            key={`col-${i}`}
                            className="border border-border px-2 py-1 text-card-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {tableCells.map((row, r) => (
                      <tr key={`row-${r}`}>
                        {question.presentation?.row_headers?.[r] !== undefined && (
                          <th className="border border-border px-2 py-1 text-card-foreground">
                            {question.presentation?.row_headers?.[r]}
                          </th>
                        )}
                        {row.map((cell, c) => {
                          const given =
                            (question.presentation?.display?.[r]?.[c] ?? '') !== '';
                          return (
                            <td key={`cell-${r}-${c}`} className="border border-border px-1 py-1">
                              {given ? (
                                <span className="px-2 font-mono text-card-foreground">{cell}</span>
                              ) : (
                                <input
                                  type="text"
                                  value={cell}
                                  disabled={inputsLocked}
                                  aria-label={`Row ${r + 1} column ${c + 1}`}
                                  onChange={(e) =>
                                    setTableCells((prev) =>
                                      prev.map((rr, ri) =>
                                        ri === r
                                          ? rr.map((cc, ci) => (ci === c ? e.target.value : cc))
                                          : rr,
                                      ),
                                    )
                                  }
                                  className="w-16 rounded border border-border bg-background px-2 py-1 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                                />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : kind && MATH_INPUT_KINDS.has(kind) ? (
              <div className="mt-5">
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Your answer
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  {MATH_INPUT_HELP[kind]}
                </p>
                <MathField
                  key={question.response_token}
                  readOnly={inputsLocked}
                  ariaLabel="Math answer"
                  placeholder="Enter your answer"
                  onChange={(ascii) => setAnswer(ascii)}
                  onEnter={() => {
                    if (phase === 'question') {
                      void submit();
                    }
                  }}
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
                  placeholder="Type your answer"
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
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    <RichMath text={graded.explanation} />
                  </div>
                )}
                {graded.worked_solution && graded.worked_solution.length > 0 && (
                  <div className="mt-4 rounded-lg border border-border bg-background p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Worked solution
                    </p>
                    <ol className="mt-2 space-y-1">
                      {graded.worked_solution.map((step, index) => (
                        <li
                          key={index}
                          className="flex items-baseline gap-2 text-sm text-card-foreground"
                        >
                          <span className="text-xs text-muted-foreground">
                            {index + 1}.
                          </span>
                          <span className="font-mono">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
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

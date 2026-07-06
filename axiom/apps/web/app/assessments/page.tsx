'use client';

import { useEffect, useState } from 'react';
import {
  ApiError,
  fetchAssignedAssessments,
  fetchResponseResult,
  getToken,
  practiceAnswer,
  startAssessment,
  type AssignedAssessment,
} from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';

// The student "assigned assessments" surface. It lists the assessments assigned
// to the signed-in student with an availability status derived from the
// open_at/close_at window, and lets a student start one that is Open and take it
// inline. Each served item is answered through the same grading path as
// practice, including the async free_response poll.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

// The availability status of an assigned assessment relative to now.
type Availability = 'Upcoming' | 'Open' | 'Closed';

// How often to poll for an async grade, and how many attempts before giving up.
// Matches the practice loop's cadence.
const GRADING_POLL_MS = 1200;
const GRADING_MAX_ATTEMPTS = 25;

// One served item within a started attempt.
interface AttemptItem {
  response_token: string;
  kind: string;
  prompt: string;
  options: string[] | null;
}

// The per-item grade shown once an answer is checked.
interface ItemGrade {
  is_correct: boolean;
  correct_answer?: string;
  explanation?: string;
}

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

// Derive the availability status from the window bounds versus now. A null bound
// is open-ended on that side, so an assessment with no window is always Open.
function availabilityOf(item: AssignedAssessment, now: number): Availability {
  if (item.open_at) {
    const opens = new Date(item.open_at).getTime();
    if (!Number.isNaN(opens) && now < opens) {
      return 'Upcoming';
    }
  }
  if (item.close_at) {
    const closes = new Date(item.close_at).getTime();
    if (!Number.isNaN(closes) && now > closes) {
      return 'Closed';
    }
  }
  return 'Open';
}

function StatusBadge({ status }: { status: Availability }) {
  const styles: Record<Availability, string> = {
    Open: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    Upcoming: 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300',
    Closed: 'bg-muted text-muted-foreground',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// Read a 403 detail message from an ApiError body ({ detail }), falling back to
// the error message when the body is missing or not the expected shape.
function forbiddenDetail(err: ApiError): string {
  if (err.body) {
    try {
      const parsed = JSON.parse(err.body) as { detail?: unknown };
      if (typeof parsed.detail === 'string' && parsed.detail.trim() !== '') {
        return parsed.detail;
      }
    } catch {
      // Not JSON; fall through to the message.
    }
  }
  return err.message;
}

export default function AssessmentsPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [assigned, setAssigned] = useState<AssignedAssessment[]>([]);

  // A steady clock so availability statuses refresh without a reload as a
  // window opens or closes.
  const [now, setNow] = useState(() => Date.now());

  // The active taking flow, keyed by the assessment being taken. Null when the
  // list is shown.
  const [takingId, setTakingId] = useState<string | null>(null);
  const [items, setItems] = useState<AttemptItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [complete, setComplete] = useState(false);

  // Per-assessment start state.
  const [starting, setStarting] = useState<Record<string, boolean>>({});
  const [startError, setStartError] = useState<Record<string, string>>({});

  // Answer input for the current item. mcq_multi tracks selected option indices.
  const [answer, setAnswer] = useState('');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [grade, setGrade] = useState<ItemGrade | null>(null);
  const [gradingToken, setGradingToken] = useState<string | null>(null);
  const [gradingError, setGradingError] = useState('');
  const [answerError, setAnswerError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchAssignedAssessments();
        if (cancelled) {
          return;
        }
        setAssigned(result);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to load your assessments.',
          );
        }
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Tick the clock every 30s so statuses stay current while the page is open.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Poll the grading status for an async free_response answer, mirroring the
  // practice loop. Runs only while a gradingToken is held.
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
          const isCorrect = res.is_correct === true;
          setGrade({
            is_correct: isCorrect,
            correct_answer: res.correct_answer,
            explanation: res.explanation,
          });
          if (isCorrect) {
            setCorrectCount((prev) => prev + 1);
          }
          setGradingToken(null);
          return;
        }
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

  function resetItemInput() {
    setAnswer('');
    setSelectedIndices([]);
    setGrade(null);
    setGradingToken(null);
    setGradingError('');
    setAnswerError('');
    setSubmitting(false);
  }

  async function start(id: string) {
    setStarting((prev) => ({ ...prev, [id]: true }));
    setStartError((prev) => ({ ...prev, [id]: '' }));
    try {
      const res = await startAssessment(id);
      setTakingId(id);
      setItems(res.items);
      setCurrent(0);
      setCorrectCount(0);
      setComplete(false);
      resetItemInput();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setStartError((prev) => ({ ...prev, [id]: forbiddenDetail(err) }));
      } else {
        setStartError((prev) => ({
          ...prev,
          [id]:
            err instanceof Error
              ? err.message
              : 'Failed to start this assessment.',
        }));
      }
    } finally {
      setStarting((prev) => ({ ...prev, [id]: false }));
    }
  }

  function exitTaking() {
    setTakingId(null);
    setItems([]);
    setCurrent(0);
    setCorrectCount(0);
    setComplete(false);
    resetItemInput();
  }

  const item: AttemptItem | undefined = items[current];

  function toggleIndex(index: number) {
    setSelectedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  }

  function buildPayload(): string {
    if (!item) {
      return '';
    }
    if (item.kind === 'mcq_multi') {
      const sorted = [...selectedIndices].sort((a, b) => a - b);
      return JSON.stringify(sorted);
    }
    return answer.trim();
  }

  function canSubmit(): boolean {
    if (!item) {
      return false;
    }
    if (item.kind === 'mcq_multi') {
      return selectedIndices.length > 0;
    }
    return answer.trim() !== '';
  }

  async function submitItem() {
    if (!item || !canSubmit()) {
      return;
    }
    const payload = buildPayload();
    if (!payload) {
      return;
    }
    setSubmitting(true);
    setAnswerError('');
    setGradingError('');
    try {
      const result = await practiceAnswer(item.response_token, payload);
      // Async grade: hold the token and let the polling effect finish it.
      if (result.status === 'grading') {
        setGradingToken(result.response_token ?? item.response_token);
        return;
      }
      const isCorrect = result.is_correct === true;
      setGrade({
        is_correct: isCorrect,
        correct_answer: result.correct_answer,
        explanation: result.explanation,
      });
      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      setAnswerError(
        err instanceof Error ? err.message : 'Failed to submit your answer.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function nextItem() {
    if (current + 1 >= items.length) {
      setComplete(true);
      return;
    }
    setCurrent((prev) => prev + 1);
    resetItemInput();
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

  const takingTitle =
    assigned.find((a) => a.id === takingId)?.title ?? 'Assessment';
  const kind = item?.kind;
  const isGrading = gradingToken !== null;
  const inputsLocked = grade !== null || isGrading;

  return (
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/practice">Practice</HeaderLink>
        <HeaderLink href="/assessments">Assessments</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/review">Review</HeaderLink>
        <HeaderLink href="/copilot">Copilot</HeaderLink>
        <HeaderLink href="/cat">Adaptive Test</HeaderLink>
        <HeaderLink href="/achievements">Achievements</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Assessments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The assessments assigned to you. Start one while it is open to take it
          here.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading your assessments.
          </p>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && takingId === null && (
          <>
            {assigned.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No assessments are assigned to you yet.
                </p>
              </div>
            ) : (
              <ul className="mt-8 space-y-4">
                {assigned.map((a) => {
                  const status = availabilityOf(a, now);
                  const busy = starting[a.id];
                  const err = startError[a.id];
                  return (
                    <li
                      key={a.id}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-semibold text-card-foreground">
                              {a.title}
                            </h2>
                            <StatusBadge status={status} />
                          </div>
                          <dl className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                            {a.open_at && (
                              <div className="flex gap-1">
                                <dt className="font-medium">Opens:</dt>
                                <dd>{formatWhen(a.open_at)}</dd>
                              </div>
                            )}
                            {a.close_at && (
                              <div className="flex gap-1">
                                <dt className="font-medium">Closes:</dt>
                                <dd>{formatWhen(a.close_at)}</dd>
                              </div>
                            )}
                            {a.due_at && (
                              <div className="flex gap-1">
                                <dt className="font-medium">Due:</dt>
                                <dd>{formatWhen(a.due_at)}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                        <button
                          type="button"
                          onClick={() => void start(a.id)}
                          disabled={status !== 'Open' || busy}
                          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {busy ? 'Starting.' : 'Start'}
                        </button>
                      </div>

                      {status === 'Upcoming' && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          This assessment is not open yet.
                        </p>
                      )}
                      {status === 'Closed' && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          This assessment has closed.
                        </p>
                      )}

                      {err && (
                        <p
                          className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
                          aria-live="polite"
                        >
                          {err}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        {state === 'ready' && takingId !== null && (
          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">
                {takingTitle}
              </h2>
              <button
                type="button"
                onClick={exitTaking}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                Back to assessments
              </button>
            </div>

            {complete || items.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Assessment complete.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {items.length === 0
                    ? 'This assessment has no questions to answer.'
                    : `You answered ${correctCount} of ${items.length} correctly.`}
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={exitTaking}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  >
                    Back to assessments
                  </button>
                </div>
              </div>
            ) : (
              item && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-300">
                    Question {current + 1} of {items.length}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-card-foreground">
                    {item.prompt}
                  </p>

                  {(kind === 'mcq_single' || kind === 'true_false') &&
                  (item.options || kind === 'true_false') ? (
                    <fieldset className="mt-5" disabled={inputsLocked}>
                      <legend className="sr-only">Choose an answer</legend>
                      <div
                        className={
                          kind === 'true_false' ? 'flex gap-2' : 'space-y-2'
                        }
                      >
                        {(kind === 'true_false'
                          ? [
                              { label: 'True', value: 'true' },
                              { label: 'False', value: 'false' },
                            ]
                          : (item.options ?? []).map((option) => ({
                              label: option,
                              value: option,
                            }))
                        ).map((choice) => {
                          const selected = answer === choice.value;
                          return (
                            <button
                              key={choice.value}
                              type="button"
                              onClick={() => setAnswer(choice.value)}
                              aria-pressed={selected}
                              className={`rounded-lg border p-3 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                                kind === 'true_false'
                                  ? 'flex-1 text-center font-medium'
                                  : 'w-full'
                              } ${
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
                  ) : kind === 'mcq_multi' && item.options ? (
                    <fieldset className="mt-5" disabled={inputsLocked}>
                      <legend className="mb-2 block text-sm font-medium text-card-foreground">
                        Select all that apply
                      </legend>
                      <div className="space-y-2">
                        {item.options.map((option, index) => {
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
                              <span className="text-card-foreground">
                                {option}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : kind === 'show_work' || kind === 'free_response' ? (
                    <div className="mt-5">
                      <label
                        htmlFor="assessment-answer-textarea"
                        className="mb-1 block text-sm font-medium text-card-foreground"
                      >
                        {kind === 'show_work'
                          ? 'Your work'
                          : 'Your written response'}
                      </label>
                      <textarea
                        id="assessment-answer-textarea"
                        value={answer}
                        rows={kind === 'show_work' ? 6 : 8}
                        disabled={inputsLocked}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                        placeholder={
                          kind === 'show_work'
                            ? 'One step per line'
                            : 'Write your response'
                        }
                      />
                    </div>
                  ) : (
                    <div className="mt-5">
                      <label
                        htmlFor="assessment-answer-input"
                        className="mb-1 block text-sm font-medium text-card-foreground"
                      >
                        Your answer
                      </label>
                      <input
                        id="assessment-answer-input"
                        type="text"
                        value={answer}
                        disabled={inputsLocked}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !inputsLocked) {
                            void submitItem();
                          }
                        }}
                        autoComplete="off"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                        placeholder="Type your answer"
                      />
                    </div>
                  )}

                  {answerError && (
                    <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                      {answerError}
                    </p>
                  )}

                  {grade === null && !isGrading && (
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => void submitItem()}
                        disabled={submitting || !canSubmit()}
                        className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? 'Checking.' : 'Submit answer'}
                      </button>
                    </div>
                  )}

                  {isGrading && (
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
                            onClick={nextItem}
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            {current + 1 >= items.length
                              ? 'Finish'
                              : 'Next question'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-card-foreground">
                            Grading your response.
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            An AI grader is scoring your response. This can take
                            a few seconds - hang tight.
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {grade && (
                    <div
                      className="mt-6 border-t border-border pt-6"
                      aria-live="polite"
                    >
                      <p
                        className={`text-sm font-semibold ${
                          grade.is_correct
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}
                      >
                        {grade.is_correct ? 'Correct' : 'Incorrect'}
                      </p>
                      {grade.correct_answer && (
                        <p className="mt-2 text-sm text-card-foreground">
                          <span className="font-medium">Correct answer:</span>{' '}
                          {grade.correct_answer}
                        </p>
                      )}
                      {grade.explanation && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {grade.explanation}
                        </p>
                      )}
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={nextItem}
                          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                        >
                          {current + 1 >= items.length
                            ? 'Finish'
                            : 'Next question'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </section>
        )}
      </main>
    </div>
  );
}

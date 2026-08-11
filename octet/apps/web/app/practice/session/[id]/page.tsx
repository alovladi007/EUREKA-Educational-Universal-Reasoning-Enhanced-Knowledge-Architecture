'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Flag, X } from 'lucide-react';
import { ApiError } from '@/lib/api';
import {
  type MechanismStepOption,
  PracticeItem,
  PracticeReview,
  PracticeReviewItem,
  Rationale,
  RetroDisconnectionOption,
  StoredPracticeAnswer,
  StoredPracticeSession,
  TutorAnswerResult,
  answerPracticeItem,
  clearPracticeSession,
  finishPracticeSession,
  getPracticeCatalogue,
  getPracticeReview,
  loadPracticeSession,
  savePracticeSession,
} from '@/lib/practiceApi';
import {
  Card,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  SectionTitle,
  errorMessage,
} from '@/app/_ui/shell';

// One practice session: the player while it is open, the review after it is
// finished.
//
// Three rules from the platform are enforced here rather than merely
// respected:
//
//   1. Answers are final. An answered item locks the moment the server
//      confirms it, and nothing on this page offers a way to change it.
//   2. Timed mode shows no correctness anywhere before finish. The answer
//      response in that mode is a receipt, and the receipt is all that is
//      rendered. Feedback appears only in the review, after the finish call.
//   3. An open session lives in the tab that started it. The API serves a
//      session's items exactly once, in the start response, so this page
//      reads them from sessionStorage. When they are not there and the
//      session is not finished, it says so honestly instead of pretending to
//      resume. Review of a finished session is served by the API and opens
//      from anywhere.

const MAX_SECONDS = 36000;

type View =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'orphan' }
  | { kind: 'player' }
  | { kind: 'review'; review: PracticeReview };

type ReviewFilter = 'all' | 'incorrect' | 'flagged';

function formatSeconds(total: number): string {
  const t = Math.max(0, Math.floor(total));
  const minutes = Math.floor(t / 60);
  const seconds = t % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// A retro item is answered with a structured value that travels through the
// plain-text answer field as JSON: the chosen disconnection and the precursor
// SMILES the backend runs forward to check. These two helpers are the only
// places that shape and read that JSON, so the player and the review agree.

// The list of disconnection options a retro item offers, or null when the
// served item did not carry them (in which case the player falls back to a
// plain text box rather than crashing).
function retroDisconnections(
  item: PracticeItem | undefined,
): RetroDisconnectionOption[] | null {
  const list = item?.meta.disconnections;
  return Array.isArray(list) && list.length > 0 ? list : null;
}

// Build the answer string for a retro item: JSON with the chosen disconnection
// and the non-empty, trimmed precursor fields. Returns '' when nothing usable
// has been entered, so the caller can treat it like any other empty draft.
function buildRetroAnswer(disconnection: string, precursors: string[]): string {
  const clean = precursors.map((p) => p.trim()).filter((p) => p.length > 0);
  if (!disconnection || clean.length === 0) {
    return '';
  }
  return JSON.stringify({ disconnection, precursors: clean });
}

// Read a stored retro answer back into its parts for display. Returns null
// when the stored string is not the JSON shape (an older or hand-entered
// answer), so the caller shows the raw string instead.
function parseRetroAnswer(
  raw: string,
): { disconnection: string; precursors: string[] } | null {
  try {
    const obj = JSON.parse(raw) as unknown;
    if (!obj || typeof obj !== 'object') {
      return null;
    }
    const record = obj as Record<string, unknown>;
    const disconnection =
      typeof record.disconnection === 'string' ? record.disconnection : '';
    const precursors = Array.isArray(record.precursors)
      ? record.precursors.filter((p): p is string => typeof p === 'string')
      : [];
    if (!disconnection && precursors.length === 0) {
      return null;
    }
    return { disconnection, precursors };
  } catch {
    return null;
  }
}

// A mechanism item is answered with an ordered list of steps, each a chosen
// elementary step and the SMILES it produces, travelling as JSON through the
// plain-text answer field, the same shape grader 8 parses.
type MechanismRow = { step: string; intermediate: string };

function mechanismSteps(
  item: PracticeItem | undefined,
): MechanismStepOption[] | null {
  const list = item?.meta.steps;
  return Array.isArray(list) && list.length > 0 ? list : null;
}

function buildMechanismAnswer(rows: MechanismRow[]): string {
  const clean = rows.filter((r) => r.step && r.intermediate.trim());
  if (clean.length === 0 || clean.length !== rows.length) {
    return '';
  }
  return JSON.stringify({
    path: clean.map((r) => ({ step: r.step, intermediate: r.intermediate.trim() })),
  });
}

function parseMechanismAnswer(answer: string | undefined): MechanismRow[] | null {
  if (!answer) {
    return null;
  }
  try {
    const record = JSON.parse(answer) as { path?: unknown };
    if (!Array.isArray(record.path) || record.path.length === 0) {
      return null;
    }
    return record.path.map((r) => ({
      step: typeof (r as MechanismRow).step === 'string' ? (r as MechanismRow).step : '',
      intermediate:
        typeof (r as MechanismRow).intermediate === 'string'
          ? (r as MechanismRow).intermediate
          : '',
    }));
  } catch {
    return null;
  }
}

export default function PracticeSessionPage() {
  const params = useParams<{ id: string }>();
  const raw = params?.id;
  const sessionId = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw || '');

  const [view, setView] = useState<View>({ kind: 'loading' });
  const [stored, setStored] = useState<StoredPracticeSession | null>(null);
  const [index, setIndex] = useState(0);

  const [draft, setDraft] = useState('');
  // Retro items carry their own drafting state: the selected disconnection and
  // a small list of precursor SMILES fields. For every other grader these stay
  // at their defaults and the plain draft string is the answer.
  const [retroDisc, setRetroDisc] = useState('');
  const [retroPrecursors, setRetroPrecursors] = useState<string[]>(['', '']);
  // Mechanism items carry their own drafting state: ordered step rows. For
  // every other grader these stay untouched.
  const [mechRows, setMechRows] = useState<MechanismRow[]>([
    { step: '', intermediate: '' },
  ]);
  const [flagged, setFlagged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [confirmingFinish, setConfirmingFinish] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  // Ticks once a second so the stopwatch readouts move. The recorded value
  // is always computed from the start timestamp, never from the tick count.
  const [, setTick] = useState(0);
  const itemStartRef = useRef<number>(Date.now());

  // Unit titles for the review's per-unit bars. The review payload carries
  // unit ids; the catalogue names them. A failure here is not fatal: the id
  // is shown instead.
  const [unitTitles, setUnitTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!sessionId) {
      setView({ kind: 'error', message: 'No session was named in the address.' });
      return;
    }
    // The tab that started the session holds its items. When they are here,
    // play. When they are not, the session is either finished (review loads)
    // or open in another tab (say so).
    const local = loadPracticeSession(sessionId);
    if (local) {
      const firstOpen = local.items.findIndex(
        (item) => !local.answers[item.position],
      );
      setStored(local);
      setIndex(firstOpen === -1 ? Math.max(0, local.items.length - 1) : firstOpen);
      itemStartRef.current = Date.now();
      setView({ kind: 'player' });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const review = await getPracticeReview(sessionId);
        if (!cancelled) {
          setView({ kind: 'review', review });
        }
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (err instanceof ApiError && err.status === 409) {
          // The API's refusal means the session exists but is not finished,
          // and this tab has no items for it.
          setView({ kind: 'orphan' });
        } else {
          setView({ kind: 'error', message: errorMessage(err) });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (view.kind !== 'review') {
      return;
    }
    let cancelled = false;
    getPracticeCatalogue()
      .then((catalogue) => {
        if (cancelled) {
          return;
        }
        const map: Record<string, string> = {};
        for (const unit of catalogue.units ?? []) {
          map[unit.unit_id] = unit.title;
        }
        setUnitTitles(map);
      })
      .catch(() => {
        // Unit ids are shown instead of titles.
      });
    return () => {
      cancelled = true;
    };
  }, [view.kind]);

  // The stopwatch tick, running while the session is being played.
  useEffect(() => {
    if (view.kind !== 'player') {
      return;
    }
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [view.kind]);

  // Arriving at an item resets the drafting state and starts its stopwatch.
  // An already answered item (a resume landing on the end of the session)
  // shows what was recorded.
  useEffect(() => {
    if (view.kind !== 'player' || !stored) {
      return;
    }
    const item = stored.items[index];
    if (!item) {
      return;
    }
    const done = stored.answers[item.position];
    setDraft(done ? done.answer : '');
    setFlagged(done ? done.flagged : false);
    setSubmitError(null);
    // Seed the retro fields: from the recorded answer on an already answered
    // item, or empty (one disconnection unchosen, two blank precursors) on a
    // fresh one. Harmless for non-retro items, which ignore this state.
    if (item.grader === 'mechanism') {
      const parsedMech = done ? parseMechanismAnswer(done.answer) : null;
      setMechRows(parsedMech ?? [{ step: '', intermediate: '' }]);
    }
    if (item.grader === 'retro') {
      const parsed = done ? parseRetroAnswer(done.answer) : null;
      setRetroDisc(parsed?.disconnection ?? '');
      const pre = parsed?.precursors ?? [];
      setRetroPrecursors(pre.length > 0 ? pre : ['', '']);
    } else {
      setRetroDisc('');
      setRetroPrecursors(['', '']);
    }
    itemStartRef.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, view.kind]);

  const items = useMemo(() => stored?.items ?? [], [stored]);
  const currentItem: PracticeItem | undefined = items[index];
  const currentDone: StoredPracticeAnswer | undefined = currentItem
    ? stored?.answers[currentItem.position]
    : undefined;
  const answeredCount = stored ? Object.keys(stored.answers).length : 0;
  const isLast = index >= items.length - 1;

  const elapsedSeconds = Math.min(
    MAX_SECONDS,
    Math.max(0, Math.floor((Date.now() - itemStartRef.current) / 1000)),
  );

  // The running total in timed mode: everything recorded so far plus the
  // clock on the current item. This survives a reload in the same tab,
  // because recorded seconds are persisted with each answer.
  const totalSeconds = useMemo(() => {
    if (!stored) {
      return 0;
    }
    let sum = 0;
    for (const item of stored.items) {
      const done = stored.answers[item.position];
      if (done) {
        sum += done.seconds;
      }
    }
    return sum;
  }, [stored]);

  const submit = useCallback(async () => {
    if (!stored || submitting) {
      return;
    }
    const item = stored.items[index];
    if (!item || stored.answers[item.position]) {
      return;
    }
    // A retro item with its options present submits structured JSON; anything
    // else (including a retro item served without options) submits the plain
    // draft string exactly as before.
    const value =
      item.grader === 'retro' && retroDisconnections(item)
        ? buildRetroAnswer(retroDisc, retroPrecursors)
        : item.grader === 'mechanism' && mechanismSteps(item)
          ? buildMechanismAnswer(mechRows)
          : draft.trim();
    if (!value) {
      return;
    }
    const seconds = Math.min(
      MAX_SECONDS,
      Math.max(0, Math.floor((Date.now() - itemStartRef.current) / 1000)),
    );
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await answerPracticeItem(
        stored.session_id,
        item.position,
        value,
        seconds,
        flagged,
      );
      const record: StoredPracticeAnswer = { answer: value, seconds, flagged };
      if (!('recorded' in result)) {
        record.result = result;
      }
      const next: StoredPracticeSession = {
        ...stored,
        answers: { ...stored.answers, [item.position]: record },
      };
      setStored(next);
      savePracticeSession(next);
    } catch (err) {
      // Includes the 409 for a repeated answer: the message says answers are
      // final, and it is shown as sent.
      setSubmitError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [stored, submitting, index, draft, flagged, retroDisc, retroPrecursors, mechRows]);

  const runFinish = useCallback(async () => {
    if (!stored || finishing) {
      return;
    }
    setFinishing(true);
    setFinishError(null);
    setConfirmingFinish(false);
    try {
      await finishPracticeSession(stored.session_id);
      clearPracticeSession(stored.session_id);
      const review = await getPracticeReview(stored.session_id);
      setView({ kind: 'review', review });
    } catch (err) {
      setFinishError(errorMessage(err));
      setFinishing(false);
    }
  }, [stored, finishing]);

  // Finish, with one honest gate: items left blank are scored as unanswered
  // and the session cannot be reopened, so finishing early asks first.
  const requestFinish = useCallback(() => {
    if (!stored || finishing) {
      return;
    }
    const open = stored.items.filter((i) => !stored.answers[i.position]).length;
    if (open > 0) {
      setConfirmingFinish(true);
    } else {
      void runFinish();
    }
  }, [stored, finishing, runFinish]);

  const advance = useCallback(() => {
    if (!stored || finishing) {
      return;
    }
    if (index < stored.items.length - 1) {
      setIndex(index + 1);
    } else {
      requestFinish();
    }
  }, [stored, finishing, index, requestFinish]);

  // Keyboard: 1-4 select a multiple choice option, Enter submits or, once
  // the item is answered, advances. Keys are ignored while focus sits on a
  // button or link so pressing Enter there does not fire twice, and digits
  // are ignored inside the text input because they are part of the answer.
  useEffect(() => {
    if (view.kind !== 'player') {
      return;
    }
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName ?? '';
      if (tag === 'BUTTON' || tag === 'A' || tag === 'SELECT' || tag === 'TEXTAREA') {
        return;
      }
      const isTextInput =
        tag === 'INPUT' && (target as HTMLInputElement).type === 'text';
      if (!stored) {
        return;
      }
      const item = stored.items[index];
      if (!item) {
        return;
      }
      const done = stored.answers[item.position];
      if (event.key === 'Enter') {
        event.preventDefault();
        if (done) {
          advance();
        } else {
          void submit();
        }
        return;
      }
      if (isTextInput) {
        return;
      }
      if (!done && item.grader === 'mc' && /^[1-9]$/.test(event.key)) {
        const choices = item.meta.choices ?? [];
        const pick = choices[Number(event.key) - 1];
        if (pick) {
          setDraft(String(pick.index));
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view.kind, stored, index, advance, submit]);

  if (view.kind === 'loading') {
    return (
      <Page>
        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          Practice session
        </h1>
        <LoadingPanel label="Loading this session." />
      </Page>
    );
  }

  if (view.kind === 'error') {
    return (
      <Page>
        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          Practice session
        </h1>
        <ErrorPanel message={view.message} />
        <BackToPractice />
      </Page>
    );
  }

  if (view.kind === 'orphan') {
    return (
      <Page>
        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          Practice session
        </h1>
        <Card>
          <h2 className="text-base font-semibold text-card-foreground">
            This session&apos;s items live in the tab that started it
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The API serves a session&apos;s items once, when the session
            starts, so an open session can only be worked in the tab that
            holds them. Return to that tab to keep going. Once the session is
            finished, its review opens from anywhere, including here.
          </p>
        </Card>
        <BackToPractice />
      </Page>
    );
  }

  if (view.kind === 'review') {
    return (
      <ReviewScreen
        review={view.review}
        unitTitles={unitTitles}
      />
    );
  }

  // The player.
  if (!stored || !currentItem) {
    return (
      <Page>
        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          Practice session
        </h1>
        <ErrorPanel message="This session holds no items." />
        <BackToPractice />
      </Page>
    );
  }

  const timed = stored.mode === 'timed';
  const progressPercent = Math.round(((index + 1) / items.length) * 100);

  // The options for a retro item, or null when the item is any other grader or
  // was served without them. The value the Submit button would send, computed
  // the same way submit() does, so the button disables until there is one.
  const retroOptions =
    currentItem.grader === 'retro' ? retroDisconnections(currentItem) : null;
  const mechOptions =
    currentItem.grader === 'mechanism' ? mechanismSteps(currentItem) : null;
  const pendingValue = retroOptions
    ? buildRetroAnswer(retroDisc, retroPrecursors)
    : mechOptions
      ? buildMechanismAnswer(mechRows)
      : draft.trim();

  return (
    <Page>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Practice session</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={timed ? 'amber' : 'brand'}>
            {timed ? 'Timed' : 'Tutor'}
          </Pill>
          {timed && (
            <span className="font-mono text-sm tabular-nums text-card-foreground">
              {formatSeconds(
                totalSeconds + (currentDone ? 0 : elapsedSeconds),
              )}{' '}
              total
            </span>
          )}
        </div>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        {timed
          ? 'No feedback until you finish. Answers are final.'
          : 'Feedback after every question. Answers are final.'}
      </p>

      <div className="mb-6">
        <div className="mb-1 flex items-baseline justify-between text-sm">
          <span className="font-medium text-card-foreground">
            Item {index + 1} of {items.length}
          </span>
          <span className="text-muted-foreground">
            {answeredCount} answered
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={index + 1}
          aria-label={`Item ${index + 1} of ${items.length}`}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="neutral">{currentItem.node_title}</Pill>
            <span className="font-mono text-xs text-muted-foreground">
              {currentItem.unit}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {formatSeconds(currentDone ? currentDone.seconds : elapsedSeconds)}
              {currentDone ? ' recorded' : ''}
            </span>
            <button
              type="button"
              onClick={() => setFlagged((f) => !f)}
              disabled={Boolean(currentDone)}
              aria-pressed={flagged}
              className={[
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-60',
                'focus:outline-none focus:ring-2 focus:ring-brand-500',
                flagged
                  ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'border-border text-muted-foreground hover:border-brand-500',
              ].join(' ')}
            >
              <Flag className="h-3.5 w-3.5" />
              {flagged ? 'Flagged' : 'Flag'}
            </button>
          </div>
        </div>

        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
          {currentItem.prompt}
        </p>

        <div className="mt-5">
          {currentItem.grader === 'mc' ? (
            (currentItem.meta.choices ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This item is multiple choice but carried no options, so there
                is nothing to select.
              </p>
            ) : (
              <fieldset disabled={Boolean(currentDone) || submitting}>
                <legend className="sr-only">Select an option</legend>
                <div className="space-y-2">
                  {(currentItem.meta.choices ?? []).map((choice, i) => (
                    <label
                      key={choice.index}
                      className={[
                        'flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors',
                        currentDone
                          ? 'cursor-default border-border'
                          : 'cursor-pointer border-border hover:border-brand-500',
                        draft === String(choice.index)
                          ? 'border-brand-500 bg-brand-500/5'
                          : '',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="practice-choice"
                        value={String(choice.index)}
                        checked={draft === String(choice.index)}
                        onChange={(e) => setDraft(e.target.value)}
                        className="mt-0.5 h-4 w-4 accent-brand-600"
                      />
                      <span className="text-card-foreground">
                        <span className="mr-1.5 font-mono text-xs text-muted-foreground">
                          {i + 1}.
                        </span>
                        {choice.text}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )
          ) : retroOptions ? (
            <div className="space-y-5">
              <fieldset disabled={Boolean(currentDone) || submitting}>
                <legend className="mb-2 block text-sm font-medium text-card-foreground">
                  Disconnection
                </legend>
                <div className="space-y-2">
                  {retroOptions.map((d) => (
                    <label
                      key={d.name}
                      className={[
                        'flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors',
                        currentDone
                          ? 'cursor-default border-border'
                          : 'cursor-pointer border-border hover:border-brand-500',
                        retroDisc === d.name
                          ? 'border-brand-500 bg-brand-500/5'
                          : '',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="retro-disconnection"
                        value={d.name}
                        checked={retroDisc === d.name}
                        onChange={(e) => setRetroDisc(e.target.value)}
                        className="mt-0.5 h-4 w-4 accent-brand-600"
                      />
                      <span className="min-w-0 text-card-foreground">
                        <span className="block font-medium">{d.name}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {d.forms}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <span className="mb-2 block text-sm font-medium text-card-foreground">
                  Precursors (SMILES)
                </span>
                <div className="space-y-2">
                  {retroPrecursors.map((value, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        aria-label={`Precursor ${i + 1} SMILES`}
                        value={value}
                        disabled={Boolean(currentDone) || submitting}
                        onChange={(e) =>
                          setRetroPrecursors((prev) =>
                            prev.map((v, j) => (j === i ? e.target.value : v)),
                          )
                        }
                        autoComplete="off"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      {i > 0 && !currentDone && (
                        <button
                          type="button"
                          onClick={() =>
                            setRetroPrecursors((prev) =>
                              prev.filter((_, j) => j !== i),
                            )
                          }
                          disabled={submitting}
                          aria-label={`Remove precursor ${i + 1}`}
                          className="inline-flex items-center justify-center rounded-lg border border-border px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {!currentDone && retroPrecursors.length < 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      setRetroPrecursors((prev) => [...prev, ''])
                    }
                    disabled={submitting}
                    className="mt-2 inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    Add precursor
                  </button>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Give each precursor as SMILES. Up to 4. Your precursors are
                  correct when running the chosen disconnection forward
                  reproduces the target.
                </p>
              </div>
            </div>
          ) : mechOptions ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Build the mechanism one step at a time. Pick the elementary
                step that fires, then give the species it produces as SMILES.
              </p>
              <div className="space-y-3">
                {mechRows.map((row, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-card-foreground">
                        Step {i + 1}
                      </span>
                      {i > 0 && !currentDone && (
                        <button
                          type="button"
                          onClick={() =>
                            setMechRows((prev) => prev.filter((_, j) => j !== i))
                          }
                          disabled={submitting}
                          aria-label={`Remove step ${i + 1}`}
                          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`mech-step-${i}`}>
                      Elementary step
                    </label>
                    <select
                      id={`mech-step-${i}`}
                      value={row.step}
                      disabled={Boolean(currentDone) || submitting}
                      onChange={(e) =>
                        setMechRows((prev) =>
                          prev.map((r, j) =>
                            j === i ? { ...r, step: e.target.value } : r,
                          ),
                        )
                      }
                      className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Choose a step</option>
                      {mechOptions.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}: {s.moves}
                        </option>
                      ))}
                    </select>
                    <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`mech-smiles-${i}`}>
                      Species produced (SMILES)
                    </label>
                    <input
                      id={`mech-smiles-${i}`}
                      type="text"
                      value={row.intermediate}
                      disabled={Boolean(currentDone) || submitting}
                      onChange={(e) =>
                        setMechRows((prev) =>
                          prev.map((r, j) =>
                            j === i
                              ? { ...r, intermediate: e.target.value }
                              : r,
                          ),
                        )
                      }
                      autoComplete="off"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                ))}
              </div>
              {!currentDone && mechRows.length < 6 && (
                <button
                  type="button"
                  onClick={() =>
                    setMechRows((prev) => [
                      ...prev,
                      { step: '', intermediate: '' },
                    ])
                  }
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  Add step
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                Every step is graded by running its chemistry forward: the
                step must fire on the current species and produce the
                structure you wrote.
              </p>
            </div>
          ) : (
            <div>
              {currentItem.grader === 'labdata' &&
                Array.isArray(currentItem.meta.data) &&
                currentItem.meta.data.length > 0 && (
                  <div className="mb-4 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <caption className="sr-only">
                        The measured dataset for this item
                      </caption>
                      <thead>
                        <tr>
                          {Object.keys(currentItem.meta.data[0]).map((k) => (
                            <th
                              key={k}
                              scope="col"
                              className="border border-border px-3 py-1.5 text-left font-medium text-card-foreground"
                            >
                              {k}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentItem.meta.data.map((row, ri) => (
                          <tr key={ri}>
                            {Object.keys(currentItem.meta.data![0]).map(
                              (k) => (
                                <td
                                  key={k}
                                  className="border border-border px-3 py-1.5 font-mono tabular-nums text-card-foreground"
                                >
                                  {String(row[k])}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {typeof currentItem.meta.data_note === 'string' && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {currentItem.meta.data_note}
                      </p>
                    )}
                  </div>
                )}
              <label
                htmlFor="practice-answer"
                className="mb-2 block text-sm font-medium text-card-foreground"
              >
                Your answer
              </label>
              <input
                id="practice-answer"
                type="text"
                value={draft}
                disabled={Boolean(currentDone) || submitting}
                onChange={(e) => setDraft(e.target.value)}
                autoComplete="off"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {currentItem.grader === 'retro'
                  ? 'This item did not include its disconnection options, so answer it as text in the form the prompt asks for.'
                  : 'Give it in the form the prompt asks for.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!currentDone && (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={submitting || !pendingValue}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              {submitting ? 'Submitting' : 'Submit'}
            </button>
          )}
          {currentDone && (
            <button
              type="button"
              onClick={advance}
              disabled={finishing}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              {isLast
                ? timed
                  ? finishing
                    ? 'Finishing'
                    : 'Finish session'
                  : finishing
                    ? 'Finishing'
                    : 'Finish and review'
                : 'Next'}
            </button>
          )}
          {timed && !isLast && (
            <button
              type="button"
              onClick={requestFinish}
              disabled={finishing}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Finish early
            </button>
          )}
          <span className="text-xs text-muted-foreground">
            Keys: 1-4 pick an option, Enter submits and advances. Submitting
            locks the answer.
          </span>
        </div>

        {submitError && (
          <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">
            {submitError}
          </p>
        )}
      </Card>

      {currentDone && !timed && currentDone.result && (
        <div className="mt-4">
          <TutorFeedback
            result={currentDone.result}
            yourAnswer={currentDone.answer}
            grader={currentItem.grader}
          />
        </div>
      )}

      {currentDone && timed && (
        <Card className="mt-4">
          <p className="text-sm text-card-foreground">
            Recorded. {answeredCount} of {items.length} answered.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            No correctness is shown in timed mode until you finish.
          </p>
        </Card>
      )}

      {confirmingFinish && (
        <Card className="mt-4">
          <p className="text-sm font-medium text-card-foreground">
            {items.length - answeredCount}{' '}
            {items.length - answeredCount === 1 ? 'item has' : 'items have'} no
            answer. Finishing scores them as unanswered, and the session cannot
            be reopened.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void runFinish()}
              disabled={finishing}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              {finishing ? 'Finishing' : 'Finish now'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingFinish(false)}
              disabled={finishing}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Keep working
            </button>
          </div>
        </Card>
      )}

      {finishError && (
        <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">
          {finishError}
        </p>
      )}
    </Page>
  );
}

function BackToPractice() {
  return (
    <p className="mt-4">
      <Link
        href="/practice"
        className="text-sm text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        Back to practice
      </Link>
    </p>
  );
}

// The tutor-mode feedback shown immediately after a submission. graded false
// is its own state: a submission the grader could not read is a different
// fact from a wrong answer, and it is labelled as one.
function TutorFeedback({
  result,
  yourAnswer,
  grader,
}: {
  result: TutorAnswerResult;
  yourAnswer: string;
  grader: string;
}) {
  const tone = !result.graded ? 'amber' : result.is_correct ? 'green' : 'red';
  const label = !result.graded
    ? 'Could not be read'
    : result.is_correct
      ? 'Correct'
      : 'Not correct';

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={tone}>{label}</Pill>
        <span className="text-sm text-muted-foreground">
          {result.answered} of {result.total} answered
        </span>
      </div>

      {result.detail && (
        <p className="mt-3 text-[15px] leading-relaxed text-card-foreground">
          {result.detail}
        </p>
      )}

      <div className="mt-4">
        <RationaleBlock
          rationale={result.rationale}
          grader={grader}
          yourAnswer={yourAnswer}
          answered
        />
      </div>
    </Card>
  );
}

// The rationale, rendered identically in tutor feedback and in review: every
// choice explained, the correct one marked with a check, the picked wrong
// one marked in red, distractor explanations and counterexamples where the
// library has them, the named misconception where one was diagnosed, and the
// way back to the lesson.
function RationaleBlock({
  rationale,
  grader,
  yourAnswer,
  answered,
  showCorrect = true,
}: {
  rationale: Rationale;
  grader: string;
  yourAnswer: string;
  answered: boolean;
  // The review-item card already shows the correct answer beside the
  // learner's, so it passes false to suppress the duplicate here. Tutor
  // feedback, which has no such line of its own, keeps the default.
  showCorrect?: boolean;
}) {
  const choices = rationale.choices ?? [];
  const isMc = grader === 'mc' && choices.length > 0;

  return (
    <div className="space-y-4">
      {isMc ? (
        <ul className="space-y-2">
          {choices.map((choice, i) => {
            const picked = answered && yourAnswer === String(choice.index);
            const frame = choice.correct
              ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950'
              : picked
                ? 'border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950'
                : 'border-border';
            return (
              <li
                key={choice.index}
                className={`rounded-lg border p-3 ${frame}`}
              >
                <div className="flex items-start gap-2">
                  {choice.correct ? (
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400"
                    />
                  ) : picked ? (
                    <X
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-400"
                    />
                  ) : (
                    <span aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-card-foreground">
                      <span className="mr-1.5 font-mono text-xs text-muted-foreground">
                        {i + 1}.
                      </span>
                      {choice.text}
                      {choice.correct && (
                        <span className="ml-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          correct
                        </span>
                      )}
                      {picked && !choice.correct && (
                        <span className="ml-2 text-xs font-medium text-red-700 dark:text-red-400">
                          your answer
                        </span>
                      )}
                      {picked && choice.correct && (
                        <span className="ml-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          your answer
                        </span>
                      )}
                    </p>
                    {choice.why_wrong && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {choice.why_wrong}
                      </p>
                    )}
                    {choice.counterexample && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Counterexample: {choice.counterexample}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        showCorrect &&
        rationale.correct_display && (
          <p className="text-sm text-card-foreground">
            Correct answer:{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              {rationale.correct_display}
            </code>
          </p>
        )
      )}

      {rationale.misconception && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            Named misconception
          </p>
          <p className="mt-1 text-sm font-medium text-amber-900 dark:text-amber-200">
            {rationale.misconception.name}{' '}
            <span className="font-mono text-xs">
              ({rationale.misconception.code})
            </span>
          </p>
          <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
            {rationale.misconception.description}
          </p>
          {rationale.misconception.counterexample && (
            <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
              Counterexample: {rationale.misconception.counterexample}
            </p>
          )}
          {rationale.misconception.review_node && (
            <p className="mt-2 text-sm">
              <Link
                href={`/learn/${encodeURIComponent(
                  rationale.misconception.review_node,
                )}`}
                className="text-amber-900 underline dark:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Relearn this idea
              </Link>
            </p>
          )}
        </div>
      )}

      {rationale.lesson_node && (
        <p className="text-sm">
          <Link
            href={`/learn/${encodeURIComponent(rationale.lesson_node)}`}
            className="text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Review the lesson
          </Link>
        </p>
      )}
    </div>
  );
}

// The post-session walkthrough: summary first, then every item in full.
function ReviewScreen({
  review,
  unitTitles,
}: {
  review: PracticeReview;
  unitTitles: Record<string, string>;
}) {
  const [filter, setFilter] = useState<ReviewFilter>('all');

  const items = review.items ?? [];
  const summary = review.summary;

  const incorrectCount = items.filter((i) => !i.is_correct).length;
  const flaggedCount = items.filter((i) => i.flagged).length;

  const shown = items.filter((item) => {
    if (filter === 'incorrect') {
      return !item.is_correct;
    }
    if (filter === 'flagged') {
      return item.flagged;
    }
    return true;
  });

  const filters: Array<{ id: ReviewFilter; label: string }> = [
    { id: 'all', label: `All (${items.length})` },
    { id: 'incorrect', label: `Incorrect (${incorrectCount})` },
    { id: 'flagged', label: `Flagged (${flaggedCount})` },
  ];

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        Session review
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Every item, what you answered, and the full explanation.
      </p>

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl font-bold tabular-nums text-card-foreground">
            {summary ? `${summary.correct} of ${summary.total}` : 'No summary'}
          </span>
          {summary && (
            <span className="text-sm text-muted-foreground">correct</span>
          )}
          <Pill tone={review.mode === 'timed' ? 'amber' : 'brand'}>
            {review.mode === 'timed' ? 'Timed' : 'Tutor'}
          </Pill>
          {summary &&
            typeof summary.answered === 'number' &&
            summary.answered < summary.total && (
              <span className="text-sm text-muted-foreground">
                {summary.total - summary.answered} left unanswered
              </span>
            )}
        </div>

        {summary && Object.keys(summary.by_unit ?? {}).length > 0 && (
          <div className="mt-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              By unit
            </h2>
            {Object.entries(summary.by_unit).map(([unitId, score]) => {
              const percent =
                score.total > 0
                  ? Math.round((score.correct / score.total) * 100)
                  : 0;
              return (
                <div key={unitId}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                    <span className="text-card-foreground">
                      {unitTitles[unitId] ?? unitId}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {score.correct} of {score.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <section>
        <SectionTitle>Items</SectionTitle>

        <div
          role="group"
          aria-label="Filter items"
          className="mb-4 flex flex-wrap gap-2"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={[
                'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-500',
                filter === f.id
                  ? 'bg-brand-600 text-white'
                  : 'border border-border text-muted-foreground hover:border-brand-500',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {shown.length === 0 && (
          <Card>
            <p className="text-sm text-muted-foreground">
              {filter === 'incorrect'
                ? 'No incorrect items. Every answer was right.'
                : 'No flagged items in this session.'}
            </p>
          </Card>
        )}

        <ol className="space-y-4">
          {shown.map((item) => (
            <li key={item.position}>
              <ReviewItemCard item={item} />
            </li>
          ))}
        </ol>
      </section>

      <BackToPractice />
    </Page>
  );
}

function ReviewItemCard({ item }: { item: PracticeReviewItem }) {
  // What the learner picked, in words. For multiple choice the stored answer
  // is the option index, so the option's text is looked up for display.
  const yourAnswerText = (() => {
    if (!item.answered) {
      return null;
    }
    if (item.grader === 'mc') {
      const match = (item.rationale.choices ?? []).find(
        (c) => String(c.index) === item.your_answer,
      );
      if (match) {
        return match.text;
      }
    }
    return item.your_answer;
  })();

  // A retro answer is stored as JSON; parse it so the review shows the chosen
  // disconnection and precursors rather than the raw string. A parse failure
  // (an older or hand-entered answer) falls back to the raw string below.
  const retroAnswer =
    item.grader === 'retro' && item.answered
      ? parseRetroAnswer(item.your_answer)
      : null;

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-card-foreground">
            Item {item.position}
          </h3>
          <Pill tone="neutral">{item.node_title}</Pill>
          <span className="font-mono text-xs text-muted-foreground">
            {item.unit}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {item.flagged && (
            <Pill tone="amber">
              <Flag aria-hidden="true" className="mr-1 h-3 w-3" />
              Flagged
            </Pill>
          )}
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {formatSeconds(item.seconds)}
          </span>
          <Pill
            tone={
              !item.answered ? 'neutral' : item.is_correct ? 'green' : 'red'
            }
          >
            {!item.answered
              ? 'Not answered'
              : item.is_correct
                ? 'Correct'
                : 'Not correct'}
          </Pill>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
        {item.prompt}
      </p>

      <div className="mt-4 space-y-1 text-sm">
        {retroAnswer ? (
          <>
            <p className="text-card-foreground">
              Your disconnection:{' '}
              {retroAnswer.disconnection ? (
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                  {retroAnswer.disconnection}
                </code>
              ) : (
                <span className="text-muted-foreground">none recorded</span>
              )}
            </p>
            <p className="text-card-foreground">
              Your precursors:{' '}
              {retroAnswer.precursors.length > 0 ? (
                retroAnswer.precursors.map((p, i) => (
                  <code
                    key={i}
                    className="mr-1 rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
                  >
                    {p}
                  </code>
                ))
              ) : (
                <span className="text-muted-foreground">none recorded</span>
              )}
            </p>
          </>
        ) : (
          <p className="text-card-foreground">
            Your answer:{' '}
            {yourAnswerText === null ? (
              <span className="text-muted-foreground">none recorded</span>
            ) : (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                {yourAnswerText}
              </code>
            )}
          </p>
        )}
        {/* The correct answer is shown once, here beside the learner's own
            answer. RationaleBlock below renders the same line for a non-mc
            item, so it is told to omit it (showCorrect={false}) to avoid the
            duplicate a review found. */}
        {item.rationale.correct_display && (
          <p className="text-card-foreground">
            Correct answer:{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              {item.rationale.correct_display}
            </code>
          </p>
        )}
      </div>

      <div className="mt-4">
        <RationaleBlock
          rationale={item.rationale}
          grader={item.grader}
          yourAnswer={item.your_answer}
          answered={item.answered}
          showCorrect={false}
        />
      </div>
    </Card>
  );
}

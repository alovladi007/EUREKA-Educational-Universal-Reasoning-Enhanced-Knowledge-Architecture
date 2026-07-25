'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ExamAttemptStatus,
  ExamAttemptView,
  ExamItem,
  ExamResult,
  ExamSummary,
  getExamAttempt,
  getExams,
  saveExamAnswer,
  submitExamAttempt,
} from '@/lib/api';
import {
  Card,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  errorMessage,
} from '@/app/_ui/shell';

// Taking one exam, and reading its result afterwards.
//
// Six rules are enforced on this page rather than merely respected by it. They
// are the difference between an exam and a practice session with a clock on
// it, so each one is written down where it is implemented as well:
//
//   1. No hints. There is no hint control on this page and no route to one,
//      because the API has no exam hint endpoint. There is also no link to
//      practice while the attempt is open: the navigation back to the rest of
//      OCTET appears only once the attempt is closed.
//   2. No feedback while the exam is open. Nothing here marks an answer right
//      or wrong, colours an item by correctness or keeps a running score. The
//      only per item state shown is whether an answer has been recorded.
//   3. The clock is the server's. seconds_remaining is authoritative. It is
//      ticked down locally for smoothness and resynchronised to the value the
//      server returns with every saved answer. Nothing here computes remaining
//      time from a client timestamp, because a clock the client owns is a
//      clock the client can be wrong about.
//   4. Every answer is autosaved, and the save state is reported honestly. A
//      failed request never reads as saved.
//   5. The result reports what the API sent and nothing more. No letter grade,
//      pass mark, scaled score or percentile is computed here, because the API
//      deliberately does not compute one and a number invented in the client
//      would look exactly like the psychometric claim the server refused to
//      make.
//   6. was_late is stated plainly. It means the server closed the attempt when
//      its time ran out.

// The clock is announced to assistive technology at these thresholds only, in
// seconds. A per second live region would announce a hundred times during an
// exam and make the page unusable with a screen reader, so the visible seconds
// tick outside the live region and only these four crossings are spoken.
const ANNOUNCE_THRESHOLDS = [600, 300, 60, 0];

const ANNOUNCEMENTS: Record<number, string> = {
  600: 'Less than 10 minutes remaining.',
  300: 'Less than 5 minutes remaining.',
  60: 'Less than 1 minute remaining.',
  0: 'Time has run out. Submit this exam to close it.',
};

function formatClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

// How a single answer's last write went. "saved" is only ever set after a
// response actually came back, so it cannot appear over a failed request.
type SaveState =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved' }
  | { kind: 'failed'; message: string };

export default function ExamAttemptPage() {
  const params = useParams<{ attempt: string }>();
  const raw = params?.attempt;
  const attemptId = decodeURIComponent(
    Array.isArray(raw) ? raw[0] : raw || '',
  );

  const [attempt, setAttempt] = useState<ExamAttemptView | null>(null);
  const [status, setStatus] = useState<ExamAttemptStatus>('in_progress');
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Section titles live on the blueprint, not on the attempt, so the catalogue
  // is fetched alongside to name them. A failure here is not fatal: the
  // section id is shown instead of a title.
  const [blueprint, setBlueprint] = useState<ExamSummary | null>(null);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');

  // Positions the server says it holds a response for. null means it has not
  // told us yet, which is a different fact from "none" and is rendered as one.
  // The attempt view now returns this on load, so after a reload the count is
  // correct immediately rather than reading as unknown until the first save.
  const [serverAnswered, setServerAnswered] = useState<number[] | null>(null);
  const [saveNote, setSaveNote] = useState('');
  const [saveStates, setSaveStates] = useState<Record<number, SaveState>>({});
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Refs, not state, because saveItem must read the current draft and the last
  // written value synchronously from inside an event handler and a timer.
  const draftsRef = useRef<Record<number, string>>({});
  const savedRef = useRef<Record<number, string>>({});
  const inFlightRef = useRef<Record<number, boolean>>({});
  const controlRefs = useRef<Record<number, HTMLElement | null>>({});

  const timeUp = secondsLeft !== null && secondsLeft <= 0;
  const open = status === 'in_progress';
  // Locked covers both "the server closed this" and "the clock hit zero".
  const locked = !open || timeUp;

  useEffect(() => {
    if (!attemptId) {
      setLoadError('No attempt was named in the address.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const view = await getExamAttempt(attemptId);
        if (cancelled) {
          return;
        }
        setAttempt(view);
        setStatus(view.status);
        setSecondsLeft(view.seconds_remaining);
        setResult(view.result ?? null);
        setServerAnswered(view.answered ?? null);
        // Rehydrate the fields from what the server holds. Without this a
        // reload shows empty inputs, and the reasonable thing to conclude
        // from an empty input during a timed exam is that the answer was
        // lost, so the learner types it again while the clock runs.
        const saved: Record<number, string> = {};
        for (const item of view.items) {
          if (item.answer) {
            saved[item.position] = item.answer;
          }
        }
        setDrafts(saved);
        draftsRef.current = { ...saved };
        savedRef.current = { ...saved };
      } catch (err) {
        if (!cancelled) {
          setLoadError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  useEffect(() => {
    if (!attempt) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const catalogue = await getExams();
        if (cancelled) {
          return;
        }
        const found = (catalogue.exams ?? []).find(
          (e) => e.code === attempt.blueprint_code,
        );
        setBlueprint(found ?? null);
      } catch {
        // The paper is readable without its blueprint title, so a failure
        // here is swallowed rather than blocking the exam.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // Rule 3, first half. The local tick is cosmetic: it exists so the readout
  // does not sit still between requests. It never sets the value from a
  // client timestamp, and it is torn down the moment the attempt closes or the
  // clock reaches zero.
  const ticking = open && secondsLeft !== null && secondsLeft > 0;
  useEffect(() => {
    if (!ticking) {
      return;
    }
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s === null ? null : Math.max(0, s - 1)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [ticking]);

  // The coarse announcement. Setting the same string twice is a no-op in
  // React, so the live region's text only changes when a threshold is crossed
  // and only those crossings are spoken.
  useEffect(() => {
    if (secondsLeft === null || !open) {
      return;
    }
    let band: number | null = null;
    for (const threshold of ANNOUNCE_THRESHOLDS) {
      if (secondsLeft <= threshold) {
        band = threshold;
      }
    }
    setAnnouncement(band === null ? '' : ANNOUNCEMENTS[band]);
  }, [secondsLeft, open]);

  const setDraft = useCallback((position: number, value: string) => {
    draftsRef.current = { ...draftsRef.current, [position]: value };
    setDrafts((prev) => ({ ...prev, [position]: value }));
  }, []);

  // Rule 4. One answer, written to the server, with the outcome reported as it
  // actually was.
  //
  // Nothing is written when the value has not changed since the last confirmed
  // write, and nothing is written for an item that was never touched, so a
  // blank row is not created for every item on the paper. Clearing an answer
  // that was already saved does write the empty string, because that is a real
  // edit the learner made.
  const saveItem = useCallback(
    async (position: number): Promise<void> => {
      if (!attemptId || locked) {
        return;
      }
      if (inFlightRef.current[position]) {
        // A write is already running for this item. The loop below re-reads
        // the draft after every write, so the newer value is not lost.
        return;
      }
      inFlightRef.current[position] = true;
      try {
        for (;;) {
          const value = draftsRef.current[position] ?? '';
          const written = savedRef.current[position];
          if (written === value) {
            break;
          }
          if (written === undefined && value === '') {
            break;
          }
          setSaveStates((prev) => ({
            ...prev,
            [position]: { kind: 'saving' },
          }));
          try {
            const res = await saveExamAnswer(attemptId, position, value);
            savedRef.current[position] = value;
            setServerAnswered(res.answered ?? []);
            // Rule 3, second half. Every answer response carries a fresh
            // clock, and the local countdown is resynchronised to it here.
            setSecondsLeft(res.seconds_remaining);
            setSaveNote(res.note ?? '');
            setSaveStates((prev) => ({
              ...prev,
              [position]: { kind: 'saved' },
            }));
          } catch (err) {
            // The real message, and no retry. Retrying a refusal would spin,
            // and the learner needs to read what the server said.
            setSaveStates((prev) => ({
              ...prev,
              [position]: { kind: 'failed', message: errorMessage(err) },
            }));
            break;
          }
        }
      } finally {
        inFlightRef.current[position] = false;
      }
    },
    [attemptId, locked],
  );

  // Write everything that has not been written. Used on explicit navigation
  // between items, when the tab is hidden, and immediately before submitting.
  const flushAll = useCallback(async () => {
    const positions = Object.keys(draftsRef.current).map((k) => Number(k));
    for (const position of positions) {
      await saveItem(position);
    }
  }, [saveItem]);

  // A learner who switches away from the tab must not lose what is typed.
  useEffect(() => {
    if (!open || timeUp) {
      return;
    }
    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        void flushAll();
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [open, timeUp, flushAll]);

  function goToItem(position: number) {
    // Moving focus blurs the control being left, which saves it. flushAll
    // covers anything that never had focus, for example an item restored from
    // a draft.
    void flushAll();
    const el = controlRefs.current[position];
    if (el) {
      el.focus();
      el.scrollIntoView({ block: 'center' });
    }
  }

  async function submit() {
    if (!attemptId || submitting) {
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await flushAll();
      const graded = await submitExamAttempt(attemptId);
      setResult(graded);
      setStatus('submitted');
      setConfirming(false);
    } catch (err) {
      // A late or repeated submission comes back as 409 with a message written
      // for the learner. It is shown as it stands, never replaced with a
      // generic failure.
      setSubmitError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function reload() {
    if (!attemptId) {
      return;
    }
    setSubmitError(null);
    setLoading(true);
    try {
      const view = await getExamAttempt(attemptId);
      setAttempt(view);
      setStatus(view.status);
      setSecondsLeft(view.seconds_remaining);
      setResult(view.result ?? null);
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const sectionTitles = useMemo(() => {
    const map: Record<string, string> = {};
    for (const section of blueprint?.sections ?? []) {
      map[section.id] = section.title;
    }
    return map;
  }, [blueprint]);

  const items = useMemo(() => attempt?.items ?? [], [attempt]);
  const unanswered = useMemo(() => {
    if (serverAnswered === null) {
      return null;
    }
    const known = new Set(serverAnswered);
    return items.filter((i) => !known.has(i.position)).map((i) => i.position);
  }, [items, serverAnswered]);

  if (loading) {
    return (
      <Page>
        <h1 className="mb-4 text-2xl font-bold tracking-tight">Exam</h1>
        <LoadingPanel label="Loading this attempt." />
      </Page>
    );
  }

  if (loadError || !attempt) {
    return (
      <Page>
        <h1 className="mb-4 text-2xl font-bold tracking-tight">Exam</h1>
        <ErrorPanel message={loadError ?? 'This attempt could not be read.'} />
        <p className="mt-4">
          <Link
            href="/exams"
            className="text-sm text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Back to the exam catalogue
          </Link>
        </p>
      </Page>
    );
  }

  const title = blueprint?.title ?? attempt.blueprint_code;

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mb-6 font-mono text-xs text-muted-foreground">
        {attempt.blueprint_code}
      </p>

      {/* Rule 2. The policy is stated where the learner reads it, not buried
          in an API response nobody sees. */}
      <div className="mb-6 rounded-lg border border-border bg-muted/40 p-4">
        <p className="text-sm text-card-foreground">{attempt.feedback_policy}</p>
        {!attempt.hints_available && (
          <p className="mt-2 text-sm text-muted-foreground">
            Hints are not available on this page, and no answer is marked
            correct or incorrect until you submit.
          </p>
        )}
      </div>

      {attempt.notes.length > 0 && (
        <section className="mb-6" aria-labelledby="paper-notes">
          <h2
            id="paper-notes"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            About this paper
          </h2>
          <Card>
            <ul className="space-y-2">
              {attempt.notes.map((note) => (
                <li key={note} className="text-sm text-card-foreground">
                  {note}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {open && (
        <ClockPanel
          secondsLeft={secondsLeft}
          announcement={announcement}
          timeUp={timeUp}
        />
      )}

      {status === 'expired' && (
        <Card className="mb-6">
          <h2 className="text-base font-semibold text-card-foreground">
            This attempt is closed
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Time on this attempt ran out, so it is no longer accepting answers.
            The server scores an overdue attempt on what was answered, so a
            result may appear here shortly. Reload to check.
          </p>
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-3 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Reload this attempt
          </button>
        </Card>
      )}

      {open && (
        <section className="mb-6" aria-labelledby="progress-heading">
          <h2
            id="progress-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Progress and navigation
          </h2>
          <Card>
            <p className="text-sm text-card-foreground">
              {serverAnswered === null
                ? `This attempt has ${items.length} items. The server has not yet reported which of them already have an answer recorded.`
                : `The server has recorded an answer for ${serverAnswered.length} of ${items.length} items.`}
            </p>
            {serverAnswered === null && (
              <p className="mt-1 text-sm text-muted-foreground">
                The attempt does not return answers you saved earlier, so the
                fields below start empty and the count above appears once you
                save an answer here. Saving an answer replaces whatever was
                recorded for that item.
              </p>
            )}
            {unanswered !== null && unanswered.length > 0 && (
              <p className="mt-2 text-sm text-card-foreground">
                Items with no answer recorded: {unanswered.join(', ')}.
              </p>
            )}
            {unanswered !== null && unanswered.length === 0 && (
              <p className="mt-2 text-sm text-card-foreground">
                Every item has an answer recorded.
              </p>
            )}
            {saveNote && (
              <p className="mt-2 text-sm text-muted-foreground">{saveNote}</p>
            )}

            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Jump to an item
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item.position}>
                  <button
                    type="button"
                    onClick={() => goToItem(item.position)}
                    disabled={locked}
                    className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border px-2 text-sm text-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <span className="sr-only">Go to item </span>
                    {item.position}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      <section aria-labelledby="questions-heading">
        <h2
          id="questions-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Questions
        </h2>
        <ol className="space-y-4">
          {items.map((item) => (
            <li key={item.position} id={`exam-item-${item.position}`}>
              <ItemCard
                item={item}
                total={items.length}
                sectionTitle={sectionTitles[item.section_id]}
                value={drafts[item.position] ?? ''}
                saveState={saveStates[item.position] ?? { kind: 'idle' }}
                answered={
                  serverAnswered === null
                    ? null
                    : serverAnswered.includes(item.position)
                }
                locked={locked}
                closed={!open}
                onChange={(value) => setDraft(item.position, value)}
                onCommit={() => void saveItem(item.position)}
                registerControl={(el) => {
                  controlRefs.current[item.position] = el;
                }}
              />
            </li>
          ))}
        </ol>
      </section>

      {open && (
        <section className="mt-8" aria-labelledby="submit-heading">
          <h2
            id="submit-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Submit
          </h2>
          <Card>
            <p className="text-sm text-card-foreground">
              Submitting closes this attempt and grades every answer the server
              holds. It cannot be reopened.
            </p>
            {timeUp && (
              <p className="mt-2 text-sm text-card-foreground">
                Time has run out, so answers are no longer being saved. Submit
                to close the attempt. The server may refuse a submission made
                after time expired, and if it does the refusal is shown below.
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!confirming && (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Submit this exam
                </button>
              )}
              {confirming && (
                <>
                  <span className="text-sm font-medium text-card-foreground">
                    Submit now and close this attempt?
                  </span>
                  <button
                    type="button"
                    onClick={() => void submit()}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  >
                    {submitting ? 'Submitting' : 'Yes, submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    Keep working
                  </button>
                </>
              )}
            </div>
            {submitError && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950"
              >
                <p className="text-sm text-red-800 dark:text-red-200">
                  {submitError}
                </p>
                <button
                  type="button"
                  onClick={() => void reload()}
                  className="mt-3 inline-flex items-center justify-center rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 transition-colors hover:bg-red-100 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  Reload this attempt
                </button>
              </div>
            )}
          </Card>
        </section>
      )}

      {/* Rule 2, structurally. The result panel is gated on the attempt being
          closed as well as on there being a result, so no score can reach the
          screen while the exam is open even if a payload changed shape. */}
      {!open && result && (
        <ResultSection result={result} titles={sectionTitles} />
      )}

      {!open && (
        <p className="mt-8">
          <Link
            href="/exams"
            className="text-sm text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Back to the exam catalogue
          </Link>
        </p>
      )}
    </Page>
  );
}

// The clock. The seconds readout updates every second and sits outside the
// live region. The live region holds the coarse announcement only.
function ClockPanel({
  secondsLeft,
  announcement,
  timeUp,
}: {
  secondsLeft: number | null;
  announcement: string;
  timeUp: boolean;
}) {
  return (
    <Card className="mb-6">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Time remaining
        </h2>
        <span className="font-mono text-2xl font-bold tabular-nums text-card-foreground">
          {secondsLeft === null ? 'unknown' : formatClock(secondsLeft)}
        </span>
        {timeUp && <Pill tone="red">Time has run out</Pill>}
      </div>

      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-card-foreground">
        {announcement}
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        The clock is kept by the server. This readout counts down between
        requests and is reset to the value the server returns each time an
        answer is saved.
      </p>
    </Card>
  );
}

// One question. Nothing here reports correctness: the only state shown is
// whether an answer has been recorded, and it is shown as words.
function ItemCard({
  item,
  total,
  sectionTitle,
  value,
  saveState,
  answered,
  locked,
  closed,
  onChange,
  onCommit,
  registerControl,
}: {
  item: ExamItem;
  total: number;
  sectionTitle?: string;
  value: string;
  saveState: SaveState;
  answered: boolean | null;
  locked: boolean;
  closed: boolean;
  onChange: (value: string) => void;
  onCommit: () => void;
  registerControl: (el: HTMLElement | null) => void;
}) {
  const choices = item.meta?.choices ?? [];
  const isMultipleChoice = item.grader === 'mc';
  const answerId = `exam-item-${item.position}-answer`;

  let stateText: string;
  if (saveState.kind === 'saving') {
    stateText = 'Saving';
  } else if (saveState.kind === 'failed') {
    stateText = 'Not saved';
  } else if (answered === null) {
    stateText = 'Not reported yet';
  } else {
    stateText = answered ? 'Answered' : 'Not answered';
  }

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-card-foreground">
          Item {item.position} of {total}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="neutral">
            {sectionTitle ? sectionTitle : item.section_id}
          </Pill>
          <span className="text-xs font-medium text-muted-foreground">
            {stateText}
          </span>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
        {item.prompt}
      </p>

      <div className="mt-5">
        {closed ? (
          <p className="text-sm text-muted-foreground">
            This attempt is closed. The API does not return the answers you
            gave, so this item is shown as the question only.
          </p>
        ) : isMultipleChoice ? (
          choices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This item is multiple choice but carried no options, so there is
              nothing to select. Tell your instructor which item number this
              is.
            </p>
          ) : (
            <fieldset disabled={locked}>
              <legend className="mb-2 text-sm font-medium text-card-foreground">
                Select one answer for item {item.position}
              </legend>
              <div className="space-y-2">
                {choices.map((choice, index) => {
                  const id = `exam-item-${item.position}-choice-${choice.index}`;
                  return (
                    <div
                      key={choice.index}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <input
                        id={id}
                        ref={index === 0 ? registerControl : undefined}
                        type="radio"
                        name={`exam-item-${item.position}`}
                        value={String(choice.index)}
                        checked={value === String(choice.index)}
                        onChange={(e) => {
                          onChange(e.target.value);
                          // A radio has no useful blur, so the write happens
                          // on selection.
                          onCommit();
                        }}
                        className="mt-0.5 h-4 w-4 accent-brand-600"
                      />
                      <label
                        htmlFor={id}
                        className="cursor-pointer text-sm text-card-foreground"
                      >
                        {choice.text}
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )
        ) : (
          <div>
            <label
              htmlFor={answerId}
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Your answer for item {item.position}
            </label>
            <input
              id={answerId}
              ref={registerControl}
              type="text"
              value={value}
              disabled={locked}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onCommit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCommit();
                }
              }}
              autoComplete="off"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {item.grader === 'structure'
                ? 'This item is graded on a chemical structure. Type it as SMILES. Your answer is saved when you leave this field.'
                : 'Your answer is saved when you leave this field.'}
            </p>
          </div>
        )}
      </div>

      {saveState.kind === 'failed' && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-700 dark:text-red-300"
        >
          This answer was not saved. {saveState.message}
        </p>
      )}
      {saveState.kind === 'saved' && (
        <p className="mt-3 text-sm text-muted-foreground">
          Saved. It is not graded yet.
        </p>
      )}
    </Card>
  );
}

// The result.
//
// Everything below is a number the API sent. There is no letter grade, no pass
// mark, no scaled score and no percentile anywhere on this page, and none is
// derived from these counts. raw_percent is shown when the API sent one and
// explained when it sent null, because null means nothing gradable was
// measured and printing zero would report a result that was never measured.
function ResultSection({
  result,
  titles,
}: {
  result: ExamResult;
  titles: Record<string, string>;
}) {
  return (
    <section className="mt-8" aria-labelledby="result-heading">
      <h2
        id="result-heading"
        className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      >
        Result
      </h2>

      {result.was_late && (
        <Card className="mb-4">
          <h3 className="text-base font-semibold text-card-foreground">
            This attempt was closed by the clock
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Time ran out before the exam was submitted, so the server closed it
            and scored the answers it already held. Anything unanswered at that
            moment stayed unanswered.
          </p>
        </Card>
      )}

      <Card className="mb-4">
        <h3 className="text-base font-semibold text-card-foreground">
          Overall
        </h3>
        <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Figure label="Items" value={String(result.items)} />
          <Figure label="Answered" value={String(result.answered)} />
          <Figure label="Correct" value={String(result.correct)} />
          <Figure
            label="Could not be read"
            value={String(result.ungradable)}
          />
        </dl>

        {result.raw_percent === null ? (
          <p className="mt-4 text-sm text-card-foreground">
            No percentage is reported for this attempt. Nothing gradable was
            measured, so there is no denominator to divide by. That is not the
            same as scoring zero.
          </p>
        ) : (
          <p className="mt-4 text-sm text-card-foreground">
            Raw percentage: {result.raw_percent} percent of the gradable items
            were correct. Answers the grader could not read are excluded from
            that figure rather than counted as wrong.
          </p>
        )}

        <p className="mt-2 text-sm text-muted-foreground">
          These are raw counts. No grade, pass mark, scaled score or percentile
          is reported, here or by the API.
        </p>
      </Card>

      {result.sections.length > 0 && (
        <Card className="mb-4">
          <h3 className="mb-3 text-base font-semibold text-card-foreground">
            By section
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Section
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Items
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Answered
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Correct
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Could not be read
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    Raw percent
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.sections.map((section) => (
                  <tr
                    key={section.section_id}
                    className="border-b border-border last:border-0"
                  >
                    <th
                      scope="row"
                      className="py-2 pr-4 font-medium text-card-foreground"
                    >
                      {titles[section.section_id] ?? section.section_id}
                    </th>
                    <td className="py-2 pr-4">{section.items}</td>
                    <td className="py-2 pr-4">{section.answered}</td>
                    <td className="py-2 pr-4">{section.correct}</td>
                    <td className="py-2 pr-4">{section.ungradable}</td>
                    <td className="py-2">
                      {section.raw_percent === null
                        ? 'not measured'
                        : `${section.raw_percent} percent`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {result.nodes.length > 0 && (
        <Card className="mb-4">
          <h3 className="mb-1 text-base font-semibold text-card-foreground">
            By curriculum node
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            How many items on each node were asked, and how many were correct.
            A node with one or two items is a thin sample, so read it as a
            pointer to what to revisit rather than a measurement of what you
            know.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Node
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Items
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    Correct
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.nodes.map((node) => (
                  <tr
                    key={node.node}
                    className="border-b border-border last:border-0"
                  >
                    <th
                      scope="row"
                      className="py-2 pr-4 font-mono text-xs font-medium text-card-foreground"
                    >
                      {node.node}
                    </th>
                    <td className="py-2 pr-4">{node.items}</td>
                    <td className="py-2">{node.correct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {result.misconceptions.length > 0 && (
        <Card className="mb-4">
          <h3 className="mb-1 text-base font-semibold text-card-foreground">
            Named misconceptions
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Wrong answers on this paper matched these named misconceptions, and
            how many times each was matched.
          </p>
          <ul className="space-y-1">
            {result.misconceptions.map((entry) => (
              <li key={entry.code} className="text-sm text-card-foreground">
                <span className="font-mono text-xs">{entry.code}</span>
                <span className="ml-2 text-muted-foreground">
                  {entry.count} {entry.count === 1 ? 'item' : 'items'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {result.notes.length > 0 && (
        <Card>
          <h3 className="mb-3 text-base font-semibold text-card-foreground">
            What this result does and does not mean
          </h3>
          <ul className="space-y-2">
            {result.notes.map((note) => (
              <li key={note} className="text-sm text-card-foreground">
                {note}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-bold tabular-nums text-card-foreground">
        {value}
      </dd>
    </div>
  );
}

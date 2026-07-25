'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  SrsCard,
  SrsQueueCounts,
  SrsReviewResult,
  getSrsQueue,
  reviewSrsCard,
} from '@/lib/srsApi';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  SectionTitle,
  errorMessage,
} from '@/app/_ui/shell';

// The spaced review player.
//
// Cards are derived server side from the authored lessons: each complete
// lesson contributes its try-it question and its pitfall, verbatim. Nothing
// on this page invents content, and every card links back to the lesson it
// was cut from.
//
// Two honesty rules are enforced here rather than merely respected:
//
//   1. The back of a card stays hidden until the learner flips it. The
//      payload carries it (the same text sits openly on the lesson page),
//      but retrieval practice only works if the attempt comes first.
//   2. The interval shown after grading is the one the server scheduled,
//      read off the review response. The page never predicts an interval it
//      did not receive.
//
// Keyboard: Space flips the card, 1-4 grade it once flipped.

const BATCH_SIZE = 20;

// The four grading buttons, mapped onto the SM-2 0..5 scale the API takes.
// Again is a lapse; the rest are passing grades of increasing ease.
const GRADES: Array<{ label: string; grade: number; hotkey: string; tone: string }> = [
  {
    label: 'Again',
    grade: 0,
    hotkey: '1',
    tone: 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950',
  },
  {
    label: 'Hard',
    grade: 3,
    hotkey: '2',
    tone: 'border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950',
  },
  {
    label: 'Good',
    grade: 4,
    hotkey: '3',
    tone: 'border-brand-300 text-brand-700 hover:bg-brand-50 dark:border-brand-900 dark:text-brand-100 dark:hover:bg-brand-900',
  },
  {
    label: 'Easy',
    grade: 5,
    hotkey: '4',
    tone: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950',
  },
];

const KIND_LABELS: Record<string, string> = {
  try_it: 'Try it',
  pitfall: 'Pitfall',
};

type View =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready' };

// The scheduled interval, said plainly. The API sends days as a float whose
// value is always a whole number of days.
function formatInterval(days: number): string {
  const d = Math.round(days);
  return d === 1 ? '1 day' : `${d} days`;
}

export default function ReviewPage() {
  const [view, setView] = useState<View>({ kind: 'loading' });
  const [cards, setCards] = useState<SrsCard[]>([]);
  const [counts, setCounts] = useState<SrsQueueCounts | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // The receipt for the previous card, shown so the schedule is visible
  // rather than silent.
  const [lastResult, setLastResult] = useState<SrsReviewResult | null>(null);
  const [reviewed, setReviewed] = useState(0);

  const loadQueue = useCallback(async () => {
    setView({ kind: 'loading' });
    setLastResult(null);
    setSubmitError(null);
    try {
      const queue = await getSrsQueue(BATCH_SIZE);
      setCards(queue.due);
      setCounts(queue.counts);
      setIndex(0);
      setFlipped(false);
      setView({ kind: 'ready' });
    } catch (err) {
      setView({ kind: 'error', message: errorMessage(err) });
    }
  }, []);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const current = index < cards.length ? cards[index] : null;

  const grade = useCallback(
    async (value: number) => {
      if (!current || submitting) {
        return;
      }
      setSubmitting(true);
      setSubmitError(null);
      try {
        const result = await reviewSrsCard(current.card_id, value);
        setLastResult(result);
        setReviewed((n) => n + 1);
        setIndex((i) => i + 1);
        setFlipped(false);
      } catch (err) {
        // The card stays on screen so the grade can be retried; the message
        // is the API's own reason.
        setSubmitError(errorMessage(err));
      } finally {
        setSubmitting(false);
      }
    },
    [current, submitting],
  );

  // Space flips, 1-4 grade. Grading keys work only after the flip, because
  // grading an answer you have not read is not review.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!current || submitting) {
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        setFlipped(true);
        return;
      }
      if (!flipped) {
        return;
      }
      const match = GRADES.find((g) => g.hotkey === event.key);
      if (match) {
        event.preventDefault();
        void grade(match.grade);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, flipped, submitting, grade]);

  const remaining = Math.max(0, cards.length - index);

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Review</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Spaced repetition over the lessons. Every card is the try-it question
        or the pitfall of a lesson, word for word, and links back to it.
      </p>

      {view.kind === 'loading' && <LoadingPanel label="Loading your review queue." />}

      {view.kind === 'error' && <ErrorPanel message={view.message} />}

      {view.kind === 'ready' && cards.length === 0 && (
        <div className="space-y-4">
          <EmptyState
            title="Nothing due."
            detail="Cards come from lessons you can read on Learn."
          />
          <p className="text-center text-sm">
            <Link
              href="/learn"
              className="font-medium text-brand-600 hover:underline"
            >
              Go to Learn
            </Link>
          </p>
        </div>
      )}

      {view.kind === 'ready' && cards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle>
              {remaining > 0
                ? `${remaining} left today`
                : 'Batch finished'}
            </SectionTitle>
            {counts && (
              <p className="text-xs text-muted-foreground">
                {counts.due} due, {counts.new} new, {counts.total} cards in
                total
              </p>
            )}
          </div>

          {lastResult && (
            <p className="text-sm text-muted-foreground">
              Last card scheduled: next review in{' '}
              {formatInterval(lastResult.interval_days)}.
            </p>
          )}

          {current && (
            <Card>
              <div className="mb-4 flex items-center justify-between gap-3">
                <Pill tone={current.kind === 'pitfall' ? 'amber' : 'brand'}>
                  {KIND_LABELS[current.kind] ?? current.kind}
                </Pill>
                <Link
                  href={`/learn/${encodeURIComponent(current.node)}`}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  {current.node_title}
                </Link>
              </div>

              <p className="whitespace-pre-wrap text-base text-card-foreground">
                {current.front}
              </p>

              {!flipped && (
                <button
                  type="button"
                  onClick={() => setFlipped(true)}
                  className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Show answer (Space)
                </button>
              )}

              {flipped && (
                <>
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Answer
                    </p>
                    <p className="whitespace-pre-wrap text-base text-card-foreground">
                      {current.back}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {GRADES.map((g) => (
                      <button
                        key={g.label}
                        type="button"
                        disabled={submitting}
                        onClick={() => void grade(g.grade)}
                        className={`rounded-lg border bg-card px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 ${g.tone}`}
                      >
                        {g.label}
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {g.hotkey}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {submitError && (
                <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                  {submitError}
                </p>
              )}
            </Card>
          )}

          {!current && (
            <Card>
              <p className="text-sm text-card-foreground">
                You reviewed {reviewed} {reviewed === 1 ? 'card' : 'cards'} in
                this sitting.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Load the queue again to keep going, or stop here. The
                schedule keeps its own count of what is due.
              </p>
              <button
                type="button"
                onClick={() => void loadQueue()}
                className="mt-4 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Load more cards
              </button>
            </Card>
          )}
        </div>
      )}
    </Page>
  );
}

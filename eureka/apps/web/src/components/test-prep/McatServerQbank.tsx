'use client';

/**
 * MCAT QBank on the server item bank (C1 step 2b - AUDIT MC-1).
 *
 * Replaces the client-bundled question data. The properties this component
 * exists to uphold:
 * - No answer key or explanation in the page until an answer is submitted;
 *   the server grades and only its verdict is rendered.
 * - Every response is recorded server-side (attempt_logs), so analytics
 *   derive from real rows instead of client claims.
 * - Review honesty on screen: these items are AI-generated pending SME
 *   review, and the banner says so (the API sends the disclaimer).
 */

import React from 'react';
import toast from 'react-hot-toast';
import {
  ArrowRight, CheckCircle2, Layers, RefreshCw, XCircle,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';

type Overview = Awaited<ReturnType<typeof apiClient.getMcatQbankOverview>>;
type QbankItem = Awaited<
  ReturnType<typeof apiClient.getMcatQbankItems>
>['items'][number];
type Verdict = Awaited<ReturnType<typeof apiClient.submitMcatQbank>>;

const COUNTS = [10, 20, 40];

export function McatServerQbank() {
  const [overview, setOverview] = React.useState<Overview | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = React.useState<number[]>([]);
  const [count, setCount] = React.useState(10);

  const [session, setSession] = React.useState<{
    items: QbankItem[];
    index: number;
    correct: number;
    answered: number;
  } | null>(null);
  const [verdict, setVerdict] = React.useState<Verdict | null>(null);
  const [chosen, setChosen] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const startedAt = React.useRef<number>(Date.now());

  const loadOverview = React.useCallback(async () => {
    try {
      setError(null);
      setOverview(await apiClient.getMcatQbankOverview());
    } catch {
      setError('Could not load the question bank from the server.');
    }
  }, []);

  React.useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const start = async () => {
    setBusy(true);
    try {
      // One request per selected topic keeps the draw proportional; no
      // topic selected = one unfiltered draw.
      const topics = selectedTopics.length ? selectedTopics : [null];
      const per = Math.max(1, Math.floor(count / topics.length));
      const batches = await Promise.all(
        topics.map((t) =>
          apiClient.getMcatQbankItems({
            topic_id: t ?? undefined,
            count: per,
          }),
        ),
      );
      const items = batches.flatMap((b) => b.items).slice(0, count);
      if (!items.length) {
        toast.error('No questions available for that selection.');
        return;
      }
      setSession({ items, index: 0, correct: 0, answered: 0 });
      setVerdict(null);
      setChosen(null);
      startedAt.current = Date.now();
    } catch {
      toast.error('Could not start the session.');
    } finally {
      setBusy(false);
    }
  };

  const answer = async (position: number) => {
    if (!session || verdict || busy) return;
    const item = session.items[session.index];
    setBusy(true);
    setChosen(position);
    try {
      const out = await apiClient.submitMcatQbank({
        item_id: item.item_id,
        choice_index: position,
        seconds: Math.min(3600, Math.round((Date.now() - startedAt.current) / 1000)),
      });
      setVerdict(out);
      setSession({
        ...session,
        correct: session.correct + (out.is_correct ? 1 : 0),
        answered: session.answered + 1,
      });
    } catch {
      setChosen(null);
      toast.error('Submission failed - nothing was recorded.');
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    if (!session) return;
    if (session.index + 1 >= session.items.length) {
      setSession(null);
    } else {
      setSession({ ...session, index: session.index + 1 });
      startedAt.current = Date.now();
    }
    setVerdict(null);
    setChosen(null);
  };

  const addMissToSrs = async (item: QbankItem, v: Verdict) => {
    try {
      await apiClient.createSrsCard({
        deck: 'MCAT',
        front: item.stem,
        back: `${v.correct_text}${v.explanation ? `\n\nWhy: ${v.explanation}` : ''}`,
        tags: {
          source: 'mcat_qbank',
          section: item.section ?? undefined,
          subtopic: item.subtopic ?? undefined,
        },
      });
      toast.success('Added to your review queue (deck MCAT).');
    } catch {
      toast.error('Could not add the card.');
    }
  };

  if (error) {
    return (
      <Card className="p-6 text-center space-y-2">
        <p className="text-sm text-red-600">{error}</p>
        <Button size="sm" variant="outline" onClick={() => void loadOverview()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
        </Button>
      </Card>
    );
  }

  if (!session) {
    return (
      <div className="space-y-4" data-testid="mcat-qbank-picker">
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm">MCAT Question Bank</h3>
          <p className="text-xs text-muted-foreground">
            Served and graded server-side; answers and explanations appear
            only after you submit each question, and every response is
            recorded to your practice history.
          </p>
          {!overview ? (
            <p className="text-sm text-muted-foreground">Loading sections&hellip;</p>
          ) : (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                {overview.sections.map((s) => {
                  const on = selectedTopics.includes(s.topic_id);
                  return (
                    <button
                      key={s.topic_id}
                      type="button"
                      onClick={() =>
                        setSelectedTopics((prev) =>
                          on
                            ? prev.filter((t) => t !== s.topic_id)
                            : [...prev, s.topic_id],
                        )
                      }
                      className={`text-left rounded-lg border p-3 text-sm transition ${
                        on
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{s.section}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {s.items} questions
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Questions:</span>
                {COUNTS.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={count === c ? 'default' : 'outline'}
                    onClick={() => setCount(c)}
                  >
                    {c}
                  </Button>
                ))}
                <Button
                  size="sm"
                  className="ml-auto"
                  disabled={busy}
                  onClick={() => void start()}
                  data-testid="mcat-qbank-start"
                >
                  Start practice <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">{overview.disclaimer}</p>
            </>
          )}
        </Card>
      </div>
    );
  }

  const item = session.items[session.index];
  return (
    <Card className="p-5 space-y-4" data-testid="mcat-qbank-session">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {session.index + 1} of {session.items.length}
        </span>
        <span>
          {session.correct}/{session.answered} correct so far
        </span>
      </div>
      <div className="flex items-center gap-2">
        {item.section && <Badge variant="secondary" className="text-xs">{item.section}</Badge>}
        {item.subtopic && <Badge variant="outline" className="text-xs">{item.subtopic}</Badge>}
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.stem}</p>
      <div className="space-y-2">
        {item.options.map((text, i) => {
          const isChosen = chosen === i;
          const isCorrect = verdict?.correct_index === i;
          const showState = verdict !== null;
          return (
            <button
              key={i}
              type="button"
              disabled={verdict !== null || busy}
              onClick={() => void answer(i)}
              className={`w-full text-left rounded-md border px-3 py-2 text-sm transition ${
                showState && isCorrect
                  ? 'border-green-600 bg-green-50 dark:bg-green-950/30'
                  : showState && isChosen
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : 'hover:border-primary hover:bg-primary/5'
              }`}
            >
              <span className="font-mono text-xs mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {text}
            </button>
          );
        })}
      </div>

      {verdict && (
        <div
          className={`rounded-md border p-3 space-y-2 text-sm ${
            verdict.is_correct
              ? 'border-green-600/40 bg-green-50/60 dark:bg-green-950/20'
              : 'border-red-500/40 bg-red-50/60 dark:bg-red-950/20'
          }`}
          data-testid="mcat-qbank-verdict"
        >
          <p className="font-semibold flex items-center gap-1.5">
            {verdict.is_correct ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Correct
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" /> Incorrect - the
                answer is {String.fromCharCode(65 + verdict.correct_index)}:{' '}
                {verdict.correct_text}
              </>
            )}
          </p>
          {verdict.explanation && (
            <p className="text-muted-foreground">{verdict.explanation}</p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {!verdict.is_correct && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => void addMissToSrs(item, verdict)}
              >
                <Layers className="h-3.5 w-3.5" /> Add to flashcards
              </Button>
            )}
            <Button size="sm" onClick={next} className="gap-1.5">
              {session.index + 1 >= session.items.length
                ? 'Finish session'
                : 'Next question'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {!verdict && (
        <Button size="sm" variant="ghost" onClick={() => setSession(null)}>
          End session
        </Button>
      )}
    </Card>
  );
}

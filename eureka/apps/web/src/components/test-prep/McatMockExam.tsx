'use client';

/**
 * MCAT full-length simulator on the server engine (C3 - AUDIT MC-2/MC-9).
 *
 * Replaces the removed client-side simulation. The server draws the form,
 * holds the deadline, and grades the sitting; this component shows
 * questions (no keys anywhere in the page until results), collects
 * choices, and renders exactly what the server returns: raw and
 * per-section results. There is deliberately no 472-528 scaled score -
 * the API note explaining why is rendered verbatim.
 */

import React from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Clock, Trophy } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';

type StartOut = Awaited<ReturnType<typeof apiClient.startMcatMock>>;
type ResultOut = Awaited<ReturnType<typeof apiClient.submitMcatMock>>;
type HistoryOut = Awaited<ReturnType<typeof apiClient.getMcatMockHistory>>;

export function McatMockExam() {
  const [phase, setPhase] = React.useState<'intro' | 'exam' | 'results'>('intro');
  const [attempt, setAttempt] = React.useState<StartOut | null>(null);
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [idx, setIdx] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState(0);
  const [result, setResult] = React.useState<ResultOut | null>(null);
  const [history, setHistory] = React.useState<HistoryOut | null>(null);
  const [busy, setBusy] = React.useState(false);
  const submittingRef = React.useRef(false);

  const loadHistory = React.useCallback(async () => {
    try {
      setHistory(await apiClient.getMcatMockHistory());
    } catch {
      /* history stays empty */
    }
  }, []);

  React.useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const submit = React.useCallback(
    async (current: StartOut, answered: Record<number, number>) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setBusy(true);
      try {
        const payload = current.items.map((i) => ({
          position: i.position,
          choice_index: answered[i.position] ?? null,
        }));
        const out = await apiClient.submitMcatMock(current.attempt_id, payload);
        setResult(out);
        setPhase('results');
        void loadHistory();
      } catch {
        toast.error('Submission failed - your attempt is still open; try again.');
        submittingRef.current = false;
      } finally {
        setBusy(false);
      }
    },
    [loadHistory],
  );

  // Countdown from the server deadline; auto-submit at zero.
  React.useEffect(() => {
    if (phase !== 'exam' || !attempt) return;
    const tick = () => {
      const left = Math.max(
        0,
        Math.round(
          (new Date(attempt.deadline_at).getTime() - Date.now()) / 1000,
        ),
      );
      setSecondsLeft(left);
      if (left <= 0) void submit(attempt, answers);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [phase, attempt, answers, submit]);

  const start = async (form: 'mini' | 'full') => {
    setBusy(true);
    try {
      const out = await apiClient.startMcatMock(form);
      submittingRef.current = false;
      setAttempt(out);
      setAnswers({});
      setIdx(0);
      setResult(null);
      setPhase('exam');
    } catch {
      toast.error('Could not start the exam - the item bank may be unavailable.');
    } finally {
      setBusy(false);
    }
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(
      Math.floor((s % 3600) / 60),
    ).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (phase === 'intro') {
    return (
      <div className="space-y-4" data-testid="mcat-mock-intro">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">MCAT exam simulation</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Drawn, timed, and graded by the server. Answers and explanations
            are revealed only after you submit. Results are raw and
            per-section: no 472&ndash;528 scaled score is shown, because
            estimating one requires equating data this platform does not
            have &mdash; a percentage is not a scaled score, and we will not
            dress one up as one.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={busy}
              onClick={() => void start('mini')}
              data-testid="mcat-mock-start-mini"
            >
              Mini form &middot; 16 questions &middot; 40 min
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => void start('full')}
            >
              Full form &middot; 230 questions &middot; 6 h 15 min
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Items are AI-generated and awaiting subject-matter-expert review.
          </p>
        </Card>

        {history && history.attempts.length > 0 && (
          <Card className="p-4 space-y-2" data-testid="mcat-mock-history">
            <h4 className="font-semibold text-sm">Previous sittings</h4>
            {history.attempts.slice(0, 8).map((a) => (
              <div
                key={a.attempt_id}
                className="flex items-center justify-between rounded-md border p-2.5 text-sm"
              >
                <span className="text-muted-foreground">
                  {new Date(a.started_at).toLocaleDateString()} &middot;{' '}
                  {a.form} form
                </span>
                <span className="font-medium">
                  {a.status === 'submitted' && a.correct !== null
                    ? `${a.correct}/${a.total} correct`
                    : a.status}
                </span>
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground">{history.note}</p>
          </Card>
        )}
      </div>
    );
  }

  if (phase === 'exam' && attempt) {
    const q = attempt.items[idx];
    const answeredCount = Object.keys(answers).length;
    return (
      <div className="space-y-4" data-testid="mcat-mock-exam">
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">
              Q {idx + 1} / {attempt.items.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {answeredCount} answered
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 font-mono text-lg font-bold ${
              secondsLeft < 300 ? 'text-red-600' : ''
            }`}
          >
            <Clock className="h-4 w-4" /> {fmt(secondsLeft)}
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            {q.section && (
              <Badge variant="secondary" className="text-xs">{q.section}</Badge>
            )}
            {q.subtopic && (
              <Badge variant="outline" className="text-xs">{q.subtopic}</Badge>
            )}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{q.stem}</p>
          <div className="space-y-2">
            {q.options.map((text, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [q.position]: i }))
                }
                className={`w-full text-left rounded-md border px-3 py-2 text-sm transition ${
                  answers[q.position] === i
                    ? 'border-primary bg-primary/10'
                    : 'hover:border-primary/50'
                }`}
              >
                <span className="font-mono text-xs mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {text}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <Button
              size="sm"
              variant="outline"
              disabled={idx === 0}
              onClick={() => setIdx(idx - 1)}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Prev
            </Button>
            {idx < attempt.items.length - 1 ? (
              <Button size="sm" onClick={() => setIdx(idx + 1)}>
                Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={busy}
                data-testid="mcat-mock-submit"
                onClick={() => {
                  if (window.confirm('Submit the exam for grading?')) {
                    void submit(attempt, answers);
                  }
                }}
              >
                Submit for grading
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex flex-wrap gap-1">
            {attempt.items.map((it, i) => (
              <button
                key={it.position}
                type="button"
                onClick={() => setIdx(i)}
                className={`w-7 h-7 rounded text-[10px] font-bold transition ${
                  i === idx
                    ? 'bg-primary text-primary-foreground'
                    : answers[it.position] !== undefined
                      ? 'bg-green-200 dark:bg-green-900'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (phase === 'results' && result) {
    const pct = result.raw.total
      ? Math.round((result.raw.correct / result.raw.total) * 100)
      : 0;
    return (
      <div className="space-y-4" data-testid="mcat-mock-results">
        <Card className="p-6 text-center space-y-1">
          <p className="text-5xl font-black">
            {result.raw.correct}/{result.raw.total}
          </p>
          <p className="text-sm text-muted-foreground">
            {pct}% raw &middot; {result.raw.answered} answered
          </p>
          <p className="text-[11px] text-muted-foreground max-w-lg mx-auto pt-2">
            {result.note}
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <h4 className="font-semibold text-sm">By section</h4>
          {Object.entries(result.by_section).map(([tid, s]) => {
            const spct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <div key={tid}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.section}</span>
                  <span data-testid={`mcat-mock-sec-${tid}`}>
                    {s.correct}/{s.total} ({spct}%)
                    {s.answered < s.total && ` · ${s.total - s.answered} unanswered`}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${spct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Card>

        <Card className="p-5 space-y-3">
          <h4 className="font-semibold text-sm">
            Review ({result.review.filter((r) => !r.is_correct).length} missed)
          </h4>
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {result.review
              .filter((r) => !r.is_correct)
              .map((r) => (
                <div key={r.position} className="border-l-2 border-red-400 pl-3 py-1 text-sm">
                  <p className="font-medium">{r.stem}</p>
                  <p className="text-xs text-red-600 mt-1">
                    You: {r.chosen_index !== null
                      ? r.options[r.chosen_index]
                      : 'Not answered'}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-500">
                    Correct: {r.options[r.correct_index]}
                  </p>
                  {r.explanation && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {r.explanation}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setPhase('intro');
            setResult(null);
            setAttempt(null);
          }}
        >
          Back to exam start
        </Button>
      </div>
    );
  }

  return null;
}

'use client';

/**
 * MCAT review center (C4 - AUDIT MC-12).
 *
 * Replaces the localStorage-fed analytics tab. Everything on this screen
 * comes from attempt_logs - the server's record of this account's graded
 * responses in practice and simulator sittings. Counts sit beside every
 * accuracy figure, there is no percentile (no cohort exists), and the
 * missed list is self-maintaining: answer a question correctly anywhere
 * and it leaves.
 */

import React from 'react';
import toast from 'react-hot-toast';
import { BarChart3, Layers, RefreshCw } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';

type Summary = Awaited<ReturnType<typeof apiClient.getMcatReviewSummary>>;
type Missed = Awaited<ReturnType<typeof apiClient.getMcatReviewMissed>>;

export function McatReviewCenter() {
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [missed, setMissed] = React.useState<Missed | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      setError(null);
      const [s, m] = await Promise.all([
        apiClient.getMcatReviewSummary(),
        apiClient.getMcatReviewMissed(20),
      ]);
      setSummary(s);
      setMissed(m);
    } catch {
      setError('Could not load your review data from the server.');
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const addToSrs = async (m: Missed['missed'][number]) => {
    try {
      await apiClient.createSrsCard({
        deck: 'MCAT',
        front: m.stem,
        back:
          `${m.options[m.correct_index]}` +
          (m.explanation ? `\n\nWhy: ${m.explanation}` : ''),
        tags: {
          source: 'mcat_review',
          section: m.section ?? undefined,
          subtopic: m.subtopic ?? undefined,
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
        <Button size="sm" variant="outline" onClick={() => void load()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
        </Button>
      </Card>
    );
  }

  const hasData = summary && summary.by_section.length > 0;

  return (
    <div className="space-y-4" data-testid="mcat-review-center">
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Your recorded performance</h3>
        </div>
        {!summary ? (
          <p className="text-sm text-muted-foreground">Loading&hellip;</p>
        ) : !hasData ? (
          <p className="text-sm text-muted-foreground">
            No recorded responses yet. Answer questions in the QBank or take a
            simulated sitting and this screen fills with your real record -
            nothing here is estimated.
          </p>
        ) : (
          <>
            <div className="space-y-2.5">
              {summary.by_section.map((s) => {
                const pct =
                  s.accuracy !== null ? Math.round(s.accuracy * 100) : 0;
                return (
                  <div key={s.section ?? 'unknown'}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{s.section}</span>
                      <span
                        className="text-muted-foreground"
                        data-testid="mcat-review-section"
                      >
                        {s.correct}/{s.attempts} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {summary.weakest_subtopics.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold mb-1.5">Weakest topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {summary.weakest_subtopics.map((t) => (
                    <span
                      key={`${t.section}-${t.subtopic}`}
                      className="text-xs rounded-full border px-2 py-0.5 text-muted-foreground"
                    >
                      {t.subtopic} &middot; {t.correct}/{t.attempts}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">{summary.note}</p>
          </>
        )}
      </Card>

      <Card className="p-5 space-y-3">
        <h3 className="font-semibold text-sm">
          Questions to review
          {missed ? ` (${missed.missed.length})` : ''}
        </h3>
        {!missed ? (
          <p className="text-sm text-muted-foreground">Loading&hellip;</p>
        ) : missed.missed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing outstanding - every question you have answered, your
            latest response got right.
          </p>
        ) : (
          <>
            <div className="space-y-3 max-h-[520px] overflow-y-auto">
              {missed.missed.map((m) => (
                <div
                  key={m.item_id}
                  className="rounded-md border p-3 space-y-1.5 text-sm"
                  data-testid="mcat-review-missed-item"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    {m.section && (
                      <Badge variant="secondary" className="text-xs">
                        {m.section}
                      </Badge>
                    )}
                    {m.subtopic && (
                      <Badge variant="outline" className="text-xs">
                        {m.subtopic}
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground ml-auto">
                      {m.source === 'mcat_mock' ? 'simulator' : 'practice'} &middot;{' '}
                      {m.times_attempted}x attempted
                    </span>
                  </div>
                  <p className="font-medium">{m.stem}</p>
                  <p className="text-xs text-red-600">
                    You: {m.chosen_index !== null
                      ? m.options[m.chosen_index]
                      : 'Not answered'}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-500">
                    Correct: {m.options[m.correct_index]}
                  </p>
                  {m.explanation && (
                    <p className="text-xs text-muted-foreground">{m.explanation}</p>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 mt-1"
                    onClick={() => void addToSrs(m)}
                  >
                    <Layers className="h-3.5 w-3.5" /> Add to flashcards
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">{missed.note}</p>
          </>
        )}
      </Card>
    </div>
  );
}

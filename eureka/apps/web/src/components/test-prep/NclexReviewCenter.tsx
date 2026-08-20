'use client';

/**
 * NCLEX review center (NX-11).
 *
 * Mirrors McatReviewCenter: everything on this screen comes from
 * attempt_logs — the server's record of this account's graded responses.
 * Counts sit beside every accuracy figure, there is no percentile (no
 * cohort exists), and the missed list is self-maintaining: answer a
 * question correctly and it leaves.
 *
 * The NCLEX addition: SATA misses show the chosen SET against the correct
 * SET, option by option, because "incorrect" on an all-or-nothing item
 * teaches nothing without knowing which selections were wrong.
 */

import React from 'react';
import toast from 'react-hot-toast';
import { BarChart3, Layers, RefreshCw } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';

type Summary = Awaited<ReturnType<typeof apiClient.getNclexReviewSummary>>;
type Missed = Awaited<ReturnType<typeof apiClient.getNclexReviewMissed>>;
type MissedEntry = Missed['missed'][number];

function correctText(m: MissedEntry): string {
  if (m.kind === 'mcq_multi') {
    return (m.correct_indices ?? []).map((i) => m.options[i]).join('; ');
  }
  return m.correct_index !== undefined ? m.options[m.correct_index] : '';
}

function chosenText(m: MissedEntry): string {
  if (m.kind === 'mcq_multi') {
    const chosen = m.chosen_indices ?? [];
    return chosen.length
      ? chosen.map((i) => m.options[i]).join('; ')
      : 'Not answered';
  }
  return m.chosen_index !== null && m.chosen_index !== undefined
    ? m.options[m.chosen_index]
    : 'Not answered';
}

export function NclexReviewCenter() {
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [missed, setMissed] = React.useState<Missed | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      setError(null);
      const [s, m] = await Promise.all([
        apiClient.getNclexReviewSummary(),
        apiClient.getNclexReviewMissed(20),
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

  const answered = (summary?.by_section ?? []).reduce(
    (n, s) => n + s.attempts, 0,
  );

  const addToSrs = async (m: MissedEntry) => {
    try {
      await apiClient.createSrsCard({
        deck: 'NCLEX',
        front: m.stem,
        back:
          correctText(m) +
          (m.explanation ? `\n\nWhy: ${m.explanation}` : ''),
        tags: {
          source: 'nclex_review',
          section: m.section ?? undefined,
          subtopic: m.subtopic ?? undefined,
        },
      });
      toast.success('Added to your review queue (deck NCLEX).');
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
    <div className="space-y-4" data-testid="nclex-review-center">
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Your recorded performance</h3>
        </div>
        {!summary ? (
          <p className="text-sm text-muted-foreground">Loading&hellip;</p>
        ) : !hasData ? (
          <p className="text-sm text-muted-foreground">
            No recorded responses yet. Answer questions in the QBank and this
            screen fills with your real record - nothing here is estimated.
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
                        data-testid="nclex-review-section"
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
          // An empty missed list means two different things, and saying the
          // wrong one reads as a performance claim that was never measured.
          <p className="text-sm text-muted-foreground">
            {answered === 0
              ? 'Nothing answered yet, so there is nothing to review.'
              : 'Nothing outstanding - every question you have answered, your latest response got right.'}
          </p>
        ) : (
          <>
            <div className="space-y-3 max-h-[520px] overflow-y-auto">
              {missed.missed.map((m) => (
                <div
                  key={m.item_id}
                  className="rounded-md border p-3 space-y-1.5 text-sm"
                  data-testid="nclex-review-missed-item"
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
                    {m.kind === 'mcq_multi' && (
                      <Badge variant="outline" className="text-[10px]">
                        SATA
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground ml-auto">
                      {m.times_attempted}x attempted
                    </span>
                  </div>
                  <p className="font-medium">{m.stem}</p>
                  <p className="text-xs text-red-600">You: {chosenText(m)}</p>
                  <p className="text-xs text-green-700 dark:text-green-500">
                    Correct: {correctText(m)}
                  </p>
                  {m.explanation && (
                    <p className="text-xs text-muted-foreground">{m.explanation}</p>
                  )}
                  {m.strategy && (
                    <p className="text-xs border-l-2 border-primary/40 pl-2 text-muted-foreground">
                      <span className="font-semibold">Strategy:</span> {m.strategy}
                    </p>
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

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, ExternalLink, RotateCcw } from 'lucide-react';
import { MPEP_CHAPTER_LIST, eMpepChapterUrl } from '@/lib/mpep-chapters';

/**
 * Gamified retrieval drill: pick a random chapter, open official eMPEP in a new tab, stop the clock when done.
 * Mirrors time-pressure search practice (not the Prometric UI itself).
 */
export function MpepSearchRace() {
  const [chapter, setChapter] = useState<{ num: string; title: string } | null>(null);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const pickChapter = useCallback(() => {
    const i = Math.floor(Math.random() * MPEP_CHAPTER_LIST.length);
    const ch = MPEP_CHAPTER_LIST[i];
    setChapter({ num: ch.num, title: ch.title });
    setElapsed(0);
    setRunning(true);
    const url = eMpepChapterUrl(ch.num);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const finish = () => {
    setRunning(false);
    setBest((prev) => {
      if (elapsed <= 0) return prev;
      if (prev === null || elapsed < prev) return elapsed;
      return prev;
    });
  };

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-sm">Search retrieval race</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            A random MPEP chapter opens in a new tab. Use the USPTO reader search/navigation; when you have landed on the chapter (or
            found your target section), stop the timer. Beat your best time—under pressure is the point.
          </p>
        </div>
        <Badge variant="secondary" className="font-mono shrink-0">
          <Timer className="h-3 w-3 mr-1 inline" />
          {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
        </Badge>
      </div>
      {chapter && (
        <p className="text-sm mb-3">
          <span className="font-mono text-muted-foreground">Ch. {chapter.num}</span> — {chapter.title}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={pickChapter} className="gap-2">
          <RotateCcw className="h-3.5 w-3.5" /> New chapter &amp; start
        </Button>
        <Button size="sm" variant="secondary" disabled={!running} onClick={finish}>
          Stop timer
        </Button>
        {chapter && (
          <Button size="sm" variant="outline" className="gap-1" onClick={() => window.open(eMpepChapterUrl(chapter.num), '_blank', 'noopener,noreferrer')}>
            <ExternalLink className="h-3.5 w-3.5" /> Open again
          </Button>
        )}
      </div>
      {best !== null && <p className="text-xs text-muted-foreground mt-3">Best stop time this session: {best}s</p>}
    </Card>
  );
}

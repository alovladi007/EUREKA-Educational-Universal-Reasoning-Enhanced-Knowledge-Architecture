'use client';

/**
 * SRS review session (P2-1).
 *
 * Pulls up to N due cards via GET /me/srs/cards/due, walks the user
 * through them one at a time:
 *   1) Show `front`.
 *   2) User clicks "Show answer" → reveal `back`.
 *   3) User grades Again / Hard / Good / Easy (mapped to SM-2 0/3/4/5).
 *   4) POST /me/srs/cards/{id}/review with the quality, advance card,
 *      move to the next.
 *
 * URL params:
 *   ?deck=PATENT_BAR   — filter to one deck
 *   ?action=new        — open the authoring drawer immediately
 *
 * Authoring mode (the "+ New card" button) drops a tiny form to
 * POST /me/srs/cards so users can create cards manually without
 * needing a separate page. After save, refreshes the due queue.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Brain,
  Check,
  ChevronRight,
  Eye,
  Plus,
  Trophy,
  X,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { SrsCard } from '@/types';

const DUE_BATCH_LIMIT = 50;

// SM-2 grade buttons. Quality follows the canonical SuperMemo 2 scale:
//   0 = total blackout, 3 = correct with serious effort,
//   4 = correct with hesitation, 5 = perfect recall.
const GRADE_BUTTONS: Array<{
  quality: 0 | 3 | 4 | 5;
  label: string;
  helper: string;
  classes: string;
  icon: React.ReactNode;
}> = [
  {
    quality: 0,
    label: 'Again',
    helper: 'See tomorrow',
    classes:
      'bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:hover:bg-rose-900/60 border-rose-200 dark:border-rose-800',
    icon: <X className="h-4 w-4" />,
  },
  {
    quality: 3,
    label: 'Hard',
    helper: 'Shorter interval',
    classes:
      'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60 border-amber-200 dark:border-amber-800',
    icon: <RotateCcw className="h-4 w-4" />,
  },
  {
    quality: 4,
    label: 'Good',
    helper: 'Normal step',
    classes:
      'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800',
    icon: <Check className="h-4 w-4" />,
  },
  {
    quality: 5,
    label: 'Easy',
    helper: 'Push out aggressively',
    classes:
      'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60 border-blue-200 dark:border-blue-800',
    icon: <Sparkles className="h-4 w-4" />,
  },
];

export default function SrsReviewPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SrsReview />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function SrsReview() {
  const router = useRouter();
  const params = useSearchParams();
  const deck = params.get('deck') || undefined;
  const initialAction = params.get('action');

  const [queue, setQueue] = useState<SrsCard[]>([]);
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  // Authoring drawer state
  const [authoring, setAuthoring] = useState(initialAction === 'new');
  // Session tally so the summary screen has real numbers.
  const [counts, setCounts] = useState<Record<number, number>>({ 0: 0, 3: 0, 4: 0, 5: 0 });

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const list = await apiClient.listDueSrsCards({
        deck,
        limit: DUE_BATCH_LIMIT,
      });
      setQueue(list.cards ?? []);
      setPosition(0);
      setRevealed(false);
    } catch {
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, [deck]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const currentCard = queue[position] ?? null;
  const done = !loading && (queue.length === 0 || position >= queue.length);

  const handleGrade = async (quality: 0 | 3 | 4 | 5) => {
    if (!currentCard || grading) return;
    setGrading(true);
    try {
      await apiClient.reviewSrsCard(currentCard.id, quality);
      setCounts((c) => ({ ...c, [quality]: (c[quality] || 0) + 1 }));
      setPosition((p) => p + 1);
      setRevealed(false);
    } catch {
      // On failure: still advance so the user isn't stuck.
      setPosition((p) => p + 1);
      setRevealed(false);
    } finally {
      setGrading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCard || grading) return;
    if (!confirm('Delete this card permanently?')) return;
    setGrading(true);
    try {
      await apiClient.deleteSrsCard(currentCard.id);
      // Remove from queue and stay at same position (next card slides up).
      setQueue((q) => q.filter((_, i) => i !== position));
      setRevealed(false);
    } catch {
      // ignore
    } finally {
      setGrading(false);
    }
  };

  // Keyboard shortcuts — space to flip, 1-4 for the grade buttons.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (authoring || done) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!revealed) setRevealed(true);
      }
      if (revealed && !grading) {
        if (e.key === '1') handleGrade(0);
        else if (e.key === '2') handleGrade(3);
        else if (e.key === '3') handleGrade(4);
        else if (e.key === '4') handleGrade(5);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, grading, authoring, done, currentCard]);

  const progressPct = queue.length === 0 ? 0 : Math.min(100, (position / queue.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <Link href="/dashboard/srs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to overview
        </Link>
        <div className="flex items-center gap-2">
          {deck && (
            <Badge variant="outline" className="text-xs">
              Deck: {deck}
            </Badge>
          )}
          <Button size="sm" variant="ghost" onClick={() => setAuthoring(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New card
          </Button>
        </div>
      </div>

      {/* Authoring drawer */}
      {authoring && (
        <AuthorCardForm
          defaultDeck={deck || 'general'}
          onCancel={() => setAuthoring(false)}
          onSaved={() => {
            setAuthoring(false);
            // New cards are immediately due — refresh the queue.
            loadQueue();
          }}
        />
      )}

      {/* Progress bar */}
      {!loading && queue.length > 0 && !done && (
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>
              Card {position + 1} of {queue.length}
            </span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      {loading ? (
        <Card className="p-12 text-center">
          <Brain className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading review queue…</p>
        </Card>
      ) : done ? (
        <DoneScreen counts={counts} deck={deck} onRefresh={loadQueue} />
      ) : currentCard ? (
        <ReviewCard
          card={currentCard}
          revealed={revealed}
          grading={grading}
          onReveal={() => setRevealed(true)}
          onGrade={handleGrade}
          onDelete={handleDelete}
        />
      ) : null}

      {/* Keyboard hint */}
      {!loading && !done && (
        <p className="text-center text-[11px] text-muted-foreground">
          Tip: <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">Space</kbd> to flip ·
          <kbd className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">1</kbd> Again ·
          <kbd className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">2</kbd> Hard ·
          <kbd className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">3</kbd> Good ·
          <kbd className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">4</kbd> Easy
        </p>
      )}
    </div>
  );
}

function ReviewCard({
  card,
  revealed,
  grading,
  onReveal,
  onGrade,
  onDelete,
}: {
  card: SrsCard;
  revealed: boolean;
  grading: boolean;
  onReveal: () => void;
  onGrade: (q: 0 | 3 | 4 | 5) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-6 sm:p-8">
      {/* Card meta strip */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px]">
            {card.deck}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            EF {card.ease_factor.toFixed(2)}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            Reps {card.repetitions}
          </Badge>
          {card.interval_days > 0 && (
            <Badge variant="outline" className="text-[10px]">
              Interval {card.interval_days}d
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          onClick={onDelete}
          disabled={grading}
          title="Delete this card"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Front */}
      <div className="mb-6">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
          Question
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
          {card.front}
        </div>
      </div>

      {/* Back (revealed) */}
      {revealed ? (
        <div className="rounded-xl border-2 border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 mb-6">
          <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300 mb-1.5">
            Answer
          </p>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {card.back}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <Button onClick={onReveal} className="w-full gap-2" size="lg">
            <Eye className="h-4 w-4" />
            Show answer
          </Button>
        </div>
      )}

      {/* Grade buttons */}
      {revealed && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {GRADE_BUTTONS.map((b) => (
            <button
              key={b.quality}
              onClick={() => onGrade(b.quality)}
              disabled={grading}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${b.classes}`}
            >
              <span className="flex items-center gap-1.5">
                {b.icon}
                {b.label}
              </span>
              <span className="text-[10px] opacity-80 mt-0.5 font-normal">
                {b.helper}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

function DoneScreen({
  counts,
  deck,
  onRefresh,
}: {
  counts: Record<number, number>;
  deck?: string;
  onRefresh: () => void;
}) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <Card className="p-10 text-center">
      <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-3" />
      <h2 className="text-2xl font-bold mb-1">
        {total === 0 ? 'Nothing due right now' : 'Session complete'}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {total === 0
          ? deck
            ? `No cards in deck "${deck}" are due. Come back later or pick a different deck.`
            : 'All your cards are scheduled for later. Come back tomorrow.'
          : `You reviewed ${total} card${total === 1 ? '' : 's'} this session.`}
      </p>
      {total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-md mx-auto mb-6 text-xs">
          {GRADE_BUTTONS.map((b) => (
            <div
              key={b.quality}
              className={`p-2.5 rounded-lg border ${b.classes}`}
            >
              <div className="font-semibold text-lg">{counts[b.quality] || 0}</div>
              <div className="opacity-80">{b.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" onClick={onRefresh} className="gap-2">
          <ChevronRight className="h-4 w-4" />
          Check for more
        </Button>
        <Link href="/dashboard/srs">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to overview
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function AuthorCardForm({
  defaultDeck,
  onCancel,
  onSaved,
}: {
  defaultDeck: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [deck, setDeck] = useState(defaultDeck);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!front.trim() || !back.trim()) {
      setError('Front and back are required.');
      return;
    }
    setSaving(true);
    try {
      await apiClient.createSrsCard({
        deck: deck.trim() || 'general',
        front: front.trim(),
        back: back.trim(),
      });
      onSaved();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to save card.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4 text-indigo-500" />
          New card
        </h2>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        <div>
          <Label htmlFor="srs-deck" className="text-xs">Deck</Label>
          <Input
            id="srs-deck"
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
            placeholder="e.g. PATENT_BAR, LSAT, general"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="srs-front" className="text-xs">Front (question)</Label>
          <Textarea
            id="srs-front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            rows={2}
            className="mt-1"
            placeholder="What is the rule of …?"
          />
        </div>
        <div>
          <Label htmlFor="srs-back" className="text-xs">Back (answer)</Label>
          <Textarea
            id="srs-back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            rows={3}
            className="mt-1"
            placeholder="The rule is …"
          />
        </div>
        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        )}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save card'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

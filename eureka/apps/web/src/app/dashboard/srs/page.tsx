'use client';

/**
 * SRS overview (P2-1 / consumes P1-4 backend).
 *
 * Three things on one screen:
 *  1) KPI strip — total cards, due now, learning (reps<2), mature (≥21d),
 *     reviews today, average ease — sourced from GET /me/srs/stats.
 *  2) Per-deck breakdown — counts grouped by `deck` string so users
 *     can drill into one exam's queue (Patent Bar vs LSAT vs general).
 *  3) Primary CTA — "Review N due" routes to /dashboard/srs/review
 *     which applies SM-2 grading.
 *
 * Add-card UI is intentionally out of scope here — cards are normally
 * authored by other flows (QBank "Add to SRS after miss", flashcard
 * imports). A "+ New card" link is rendered so users can still author
 * manually via a simple form (handled by the same review page in
 * authoring mode — future enhancement).
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Clock,
  Sparkles,
  TrendingUp,
  Calendar,
  Brain,
  PlayCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { SrsCard, SrsStats } from '@/types';

interface DeckRollup {
  deck: string;
  total: number;
  due: number;
  mature: number;
}

// Local skeleton — the shared @/components/ui/loading module exports
// Loading/LoadingSpinner/etc. but not a generic Skeleton box.
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`}
    />
  );
}

export default function SrsOverviewPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SrsOverview />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function SrsOverview() {
  const [stats, setStats] = useState<SrsStats | null>(null);
  const [allCards, setAllCards] = useState<SrsCard[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, list] = await Promise.all([
        apiClient.getSrsStats().catch(() => null),
        // 1000 is the API cap; for the per-deck rollup we need every
        // card. If a power user ever exceeds 1k cards this should
        // switch to a backend group-by endpoint.
        apiClient.listSrsCards({ limit: 1000 }).catch(() => ({ cards: [], total: 0 })),
      ]);
      setStats(s);
      setAllCards(list.cards ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Roll up cards by deck so the page can show "PATENT_BAR: 42 / 8 due".
  // Done client-side from listSrsCards to avoid a per-deck stats call
  // for every distinct deck name.
  const deckRollups: DeckRollup[] = useMemo(() => {
    const now = Date.now();
    const map = new Map<string, DeckRollup>();
    for (const c of allCards) {
      const r = map.get(c.deck) ?? { deck: c.deck, total: 0, due: 0, mature: 0 };
      r.total += 1;
      if (c.next_review && new Date(c.next_review).getTime() <= now) r.due += 1;
      if (c.interval_days >= 21) r.mature += 1;
      map.set(c.deck, r);
    }
    return Array.from(map.values()).sort((a, b) => b.due - a.due || b.total - a.total);
  }, [allCards]);

  const totalDue = stats?.due_now ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-7 w-7 text-indigo-500" />
            Spaced-Repetition Review
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Review cards scheduled via the SM-2 algorithm. Cards you grade
            <span className="font-medium text-foreground"> Again </span>
            come back tomorrow; cards you grade
            <span className="font-medium text-foreground"> Easy </span>
            get pushed out aggressively. Mature cards (≥21 days) are
            considered well-retained.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {totalDue > 0 ? (
            <Link href="/dashboard/srs/review">
              <Button className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Review {totalDue} due
              </Button>
            </Link>
          ) : (
            <Button disabled className="gap-2" title="No cards due right now">
              <PlayCircle className="h-4 w-4" />
              Nothing due
            </Button>
          )}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatTile
          icon={<Layers className="h-4 w-4" />}
          label="Total cards"
          value={loading ? null : stats?.total_cards ?? 0}
          accent="text-slate-600 dark:text-slate-300"
        />
        <StatTile
          icon={<Clock className="h-4 w-4" />}
          label="Due now"
          value={loading ? null : stats?.due_now ?? 0}
          accent={
            (stats?.due_now ?? 0) > 0
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }
        />
        <StatTile
          icon={<Sparkles className="h-4 w-4" />}
          label="Learning"
          value={loading ? null : stats?.learning ?? 0}
          accent="text-indigo-600 dark:text-indigo-400"
          help="Cards still in the early SM-2 ramp (reps < 2)"
        />
        <StatTile
          icon={<TrendingUp className="h-4 w-4" />}
          label="Mature"
          value={loading ? null : stats?.mature ?? 0}
          accent="text-emerald-600 dark:text-emerald-400"
          help="Cards with interval ≥ 21 days (long-term retention)"
        />
        <StatTile
          icon={<Calendar className="h-4 w-4" />}
          label="Reviewed today"
          value={loading ? null : stats?.reviews_today ?? 0}
          accent="text-fuchsia-600 dark:text-fuchsia-400"
        />
        <StatTile
          icon={<Brain className="h-4 w-4" />}
          label="Avg ease"
          value={
            loading
              ? null
              : stats
                ? Number(stats.average_ease).toFixed(2)
                : '—'
          }
          accent="text-blue-600 dark:text-blue-400"
          help="EF average across all your cards (2.5 starting value, 1.3 floor)"
        />
      </div>

      {/* Per-deck breakdown */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Decks</h2>
            <p className="text-xs text-muted-foreground">
              Cards are tagged with a free-form deck name — typically the exam
              type. Click a deck to review only its due cards.
            </p>
          </div>
          <Link href="/dashboard/srs/review">
            <Button size="sm" variant="ghost" className="gap-2">
              <Plus className="h-4 w-4" />
              Add card
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : deckRollups.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-8 text-center">
            <Brain className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm font-medium">No SRS cards yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Cards get created from QBank misses (coming soon) or you can
              author them manually.
            </p>
            <Link href="/dashboard/srs/review?action=new">
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create your first card
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {deckRollups.map((d) => (
              <Link
                key={d.deck}
                href={`/dashboard/srs/review?deck=${encodeURIComponent(d.deck)}`}
                className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {d.deck.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{d.deck}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.total} card{d.total === 1 ? '' : 's'}
                      {d.mature > 0 ? ` · ${d.mature} mature` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {d.due > 0 ? (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300">
                      {d.due} due
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-800">
                      0 due
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* About SM-2 (collapsed footer) */}
      <Card className="p-5 bg-gradient-to-br from-indigo-50/40 to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40">
        <h3 className="text-sm font-semibold mb-2">How the SM-2 scheduler works</h3>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>
            Every card starts at <b>ease factor 2.5</b> with a 0-day interval — it&apos;s
            due immediately.
          </li>
          <li>
            On review, you grade the card 0–5 (the UI maps Again=0 / Hard=3 / Good=4 / Easy=5).
          </li>
          <li>
            Pass (≥3) advances the interval: <b>1 → 6 → round(interval × EF)</b> days.
            Fail (&lt;3) resets the streak and you see it tomorrow.
          </li>
          <li>
            EF moves with quality, floor 1.3. Easy reviews stretch the next interval; hard ones compress it.
          </li>
        </ul>
      </Card>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  accent,
  help,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string | null;
  accent: string;
  help?: string;
}) {
  return (
    <Card className="p-4" title={help}>
      <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wide ${accent}`}>
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold mt-1.5">
        {value === null ? <Skeleton className="h-6 w-12 inline-block align-middle" /> : value}
      </p>
    </Card>
  );
}

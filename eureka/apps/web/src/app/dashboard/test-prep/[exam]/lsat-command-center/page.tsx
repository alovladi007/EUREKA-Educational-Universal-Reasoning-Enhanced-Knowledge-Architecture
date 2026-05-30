'use client';

/**
 * LSAT Command Center (P3-15).
 *
 * Patent Bar already has /[exam]/command-center — a unified surface
 * for weakness-by-topic + slow/inaccurate flags + SRS deck shortcut.
 * LSAT has lsat-analytics (stats-focused) but no equivalent action
 * hub. This page mirrors the Patent Bar shape but is fed by the
 * generic api-core endpoints (P0-5 + P1-4):
 *
 *   • GET /me/progress?exam_type=LSAT          → per-topic weakness
 *   • GET /me/progress/summary?exam_type=LSAT  → headline KPIs
 *   • GET /me/srs/stats?deck=LSAT              → due-card counter
 *
 * Click-throughs land on the LawHub workbench (official practice),
 * the SRS deck for LSAT, and the QBank LR/RC drill paths so the
 * student can act on every signal the panel surfaces.
 *
 * Tier classification mirrors lsat-frequency.ts — mastery ≥ 0.8
 * "strong", 0.55-0.8 "developing", <0.55 "weakness" — so weak
 * topics get visual emphasis without needing a backend tier field.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  AlertTriangle,
  Target,
  Sparkles,
  Loader2,
  Brain,
  Library,
  BrainCircuit,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { LSAT_QUESTION_TYPES, LAWHUB_PREPTESTS, LSAC_LAWHUB_LANDING } from '@/lib/lsat-frequency';

const EXAM = 'LSAT';

interface ProgressRow {
  id: string;
  topic_id: string;
  attempts: number;
  correct: number;
  avg_seconds: number;
  mastery_level: number;
  last_seen_at: string;
}

interface ProgressSummary {
  exam_type: string;
  total_topics: number;
  topics_attempted: number;
  total_attempts: number;
  total_correct: number;
  accuracy: number;
  average_mastery: number;
  average_seconds_per_question: number;
  weakest_topics: ProgressRow[];
}

interface SrsStatsShape {
  total_cards: number;
  due_now: number;
  learning: number;
  mature: number;
  reviews_today: number;
  average_ease: number;
}

// Map topic_id (lr_strengthen, rc_function, …) → human label using
// the curriculum data we already ship to the heatmap. Keeps the
// labels consistent across the platform.
const TOPIC_LABEL = Object.fromEntries(
  LSAT_QUESTION_TYPES.map((q) => [q.id, q.name]),
);

function tierForMastery(m: number): {
  label: string;
  bg: string;
  text: string;
} {
  if (m >= 0.8) return { label: 'Strong', bg: '#d1fae5', text: '#065f46' };
  if (m >= 0.55) return { label: 'Developing', bg: '#fef3c7', text: '#78350f' };
  return { label: 'Weakness', bg: '#fee2e2', text: '#7f1d1d' };
}

export default function LsatCommandCenterPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [srsStats, setSrsStats] = useState<SrsStatsShape | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const [s, r, srs] = await Promise.all([
          apiClient.getProgressSummary?.('LSAT').catch(() => null),
          apiClient.getUserProgress?.('LSAT').catch(() => null),
          apiClient.getSrsStats?.('LSAT').catch(() => null),
        ]);
        setSummary((s as unknown as ProgressSummary) ?? null);
        setRows(Array.isArray(r) ? (r as unknown as ProgressRow[]) : []);
        setSrsStats((srs as unknown as SrsStatsShape) ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [exam, params.exam, router]);

  // Group rows into LR vs RC by topic_id prefix so the weakness panels
  // mirror how LSAC publishes the test (LR and RC are separate
  // sections). Skip unattempted topics — the panel is action-oriented.
  const { lrRows, rcRows } = useMemo(() => {
    const lr: ProgressRow[] = [];
    const rc: ProgressRow[] = [];
    for (const row of rows) {
      if (row.attempts <= 0) continue;
      if (row.topic_id.startsWith('lr_')) lr.push(row);
      else if (row.topic_id.startsWith('rc_')) rc.push(row);
    }
    const byMastery = (a: ProgressRow, b: ProgressRow) =>
      a.mastery_level - b.mastery_level;
    lr.sort(byMastery);
    rc.sort(byMastery);
    return { lrRows: lr, rcRows: rc };
  }, [rows]);

  const hasAttempts = (summary?.total_attempts ?? 0) > 0;

  if (exam !== EXAM) return null;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to LSAT study hub
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">LSAT Command Center</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Per-topic weakness across the {LSAT_QUESTION_TYPES.length} current LSAT
            question types (post-Aug-2024 format — Logic Games removed), fed by your
            QBank attempts and SRS deck. Click through to LawHub for official practice
            or the SRS deck to clear the day&apos;s reviews.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/srs/review?deck=LSAT`}>
            <Button variant="default" className="gap-2">
              <Brain className="h-4 w-4" aria-hidden="true" />
              SRS deck
              {srsStats && srsStats.due_now > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">
                  {srsStats.due_now}
                </span>
              )}
            </Button>
          </Link>
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/lawhub-workbench`}>
            <Button variant="secondary" className="gap-2">
              <Library className="h-4 w-4" aria-hidden="true" /> LawHub workbench
            </Button>
          </Link>
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}?tab=qbank`}>
            <Button variant="outline" className="gap-2">
              <BrainCircuit className="h-4 w-4" aria-hidden="true" /> QBank
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      ) : !hasAttempts ? (
        <Card className="p-8 text-center bg-gradient-to-br from-indigo-50/40 to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40">
          <Target className="h-12 w-12 text-indigo-400 dark:text-indigo-500 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-xl font-semibold mb-1">No attempts yet</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            The Command Center fills in once you start answering LSAT QBank questions.
            Every answer feeds per-topic mastery (P0-5) and surfaces the weakest
            question types here so you know what to drill next.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}?tab=qbank`}>
              <Button className="gap-2">
                <BrainCircuit className="h-4 w-4" aria-hidden="true" /> Start a QBank session
              </Button>
            </Link>
            <a href={LAWHUB_PREPTESTS} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Library className="h-4 w-4" aria-hidden="true" /> LawHub PrepTests
              </Button>
            </a>
          </div>
        </Card>
      ) : (
        <>
          {/* KPI strip */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Target className="h-4 w-4" aria-hidden="true" /> Attempts tracked
              </div>
              <p className="text-3xl font-bold">{summary?.total_attempts ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Accuracy {Math.round((summary?.accuracy ?? 0) * 100)}%
              </p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" aria-hidden="true" /> Avg mastery
              </div>
              <p className="text-3xl font-bold">
                {Math.round((summary?.average_mastery ?? 0) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Across {summary?.topics_attempted ?? 0} topics
              </p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" aria-hidden="true" /> Avg time / Q
              </div>
              <p className="text-3xl font-bold">
                {Math.round(summary?.average_seconds_per_question ?? 0)}s
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Target ≈ 85s (LR) · 80s (RC)
              </p>
            </Card>
            <Link href={`/dashboard/srs/review?deck=LSAT`} className="block">
              <Card className="p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer h-full">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Sparkles className="h-4 w-4" aria-hidden="true" /> SRS reviews due
                </div>
                <p className="text-3xl font-bold">{srsStats?.due_now ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to open the LSAT deck
                </p>
              </Card>
            </Link>
          </div>

          {/* Weakest topics callout — only show if there are any below 0.55 */}
          {(summary?.weakest_topics?.length ?? 0) > 0 && (
            <Card className="p-5 border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                    Focus next session
                  </h3>
                  <p className="text-xs text-amber-800/80 dark:text-amber-200/80 mt-0.5">
                    Lowest-mastery topics with ≥3 attempts. Drill these on LawHub or in
                    the QBank.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(summary?.weakest_topics ?? []).map((row) => (
                      <Badge
                        key={row.id}
                        variant="outline"
                        className="text-xs border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100"
                      >
                        {TOPIC_LABEL[row.topic_id] ?? row.topic_id} ·{' '}
                        {Math.round(row.mastery_level * 100)}%
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Two-column weakness tables — LR + RC */}
          <div className="grid gap-6 lg:grid-cols-2">
            <WeaknessTable
              title="Logical Reasoning"
              count="2 sections · ~50 questions / scored test"
              rows={lrRows}
            />
            <WeaknessTable
              title="Reading Comprehension"
              count="1 section · ~27 questions / scored test"
              rows={rcRows}
            />
          </div>

          {/* Footer — context + escape hatches */}
          <Card className="p-5 bg-muted/40">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Layers className="h-4 w-4" aria-hidden="true" /> About this view
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>
                Mastery is Laplace-smoothed accuracy: <code>(correct + 1) / (attempts + 2)</code>.
                A topic with 1/1 correct shows 0.67 — not 1.0 — so a single answer
                doesn&apos;t overstate competence.
              </li>
              <li>
                Tier thresholds: <b>≥ 80%</b> Strong, <b>55-80%</b> Developing,{' '}
                <b>&lt; 55%</b> Weakness. Adjusted with at least 3 attempts.
              </li>
              <li>
                Need real practice questions?{' '}
                <a
                  className="text-primary hover:underline"
                  href={LAWHUB_PREPTESTS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LawHub PrepTests
                </a>{' '}
                is LSAC&apos;s official QBank — use the Eureka QBank for drill and
                LawHub for full timed sections (
                <a
                  className="text-muted-foreground hover:text-foreground hover:underline"
                  href={LSAC_LAWHUB_LANDING}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LSAC LawHub landing
                </a>
                ).
              </li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}

function WeaknessTable({
  title,
  count,
  rows,
}: {
  title: string;
  count: string;
  rows: ProgressRow[];
}) {
  return (
    <Card className="p-5">
      <div className="mb-3">
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{count}</p>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4">
          No attempts in this section yet.
        </p>
      ) : (
        <div className="space-y-1.5 max-h-96 overflow-y-auto">
          {rows.map((row) => {
            const tier = tierForMastery(row.mastery_level);
            const acc = row.attempts > 0 ? row.correct / row.attempts : 0;
            return (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs"
              >
                <span className="font-medium truncate max-w-[180px]" title={row.topic_id}>
                  {TOPIC_LABEL[row.topic_id] ?? row.topic_id}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    style={{ backgroundColor: tier.bg, color: tier.text }}
                    className="text-[10px] border-none hover:opacity-90"
                  >
                    {tier.label}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {Math.round(acc * 100)}%
                  </Badge>
                  <span className="text-muted-foreground tabular-nums">
                    {Math.round(row.avg_seconds)}s
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

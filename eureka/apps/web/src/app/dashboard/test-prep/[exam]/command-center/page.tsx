'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Library,
  BrainCircuit,
  AlertTriangle,
  Timer,
  Target,
  Sparkles,
  Loader2,
  Video,
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Brain } from 'lucide-react';

const EXAM = 'PATENT_BAR';

export default function PatentBarCommandCenterPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();
  const [data, setData] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [missBusy, setMissBusy] = useState(false);

  useEffect(() => {
    if (exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const [a, r] = await Promise.all([
          apiClient.getPatentBarAnalytics().catch(() => null),
          apiClient.getPatentBarReviewQueue(20).catch(() => null),
        ]);
        setData(a);
        setReview(r);
      } finally {
        setLoading(false);
      }
    })();
  }, [exam, params.exam, router]);

  if (exam !== EXAM) {
    return null;
  }

  const rawPoints = data?.time_accuracy_points ?? [];
  const scatterCorrect = rawPoints
    .filter((p: any) => p.is_correct)
    .map((p: any) => ({
      ...p,
      x: Math.max(0, Number(p.time_spent_seconds) || 0),
      y: 1,
    }));
  const scatterMiss = rawPoints
    .filter((p: any) => !p.is_correct)
    .map((p: any) => ({
      ...p,
      x: Math.max(0, Number(p.time_spent_seconds) || 0),
      y: 0,
    }));

  const onMisses = async () => {
    setMissBusy(true);
    try {
      const res = await apiClient.createFlashcardsFromMisses(30);
      const n = res?.created ?? 0;
      if (n > 0) {
        toast.success(`Created ${n} flashcards from missed questions.`);
      } else {
        toast('No new misses to convert — try more QBank sessions first.', { icon: 'ℹ️' });
      }
    } catch {
      toast.error('Could not create flashcards. Complete some QBank sessions first.');
    }
    setMissBusy(false);
  };

  const hasAttempts = (data?.total_answered ?? 0) > 0;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Patent Bar study hub
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Patent Bar Command Center</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Weakness by MPEP chapter, statute, and topic — plus time vs accuracy for every attempt. Use the MPEP
            workbench to practice exam-style navigation; turn misses into spaced-repetition cards tied to MPEP anchors.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/live`}>
            <Button variant="default" className="gap-2">
              <Video className="h-4 w-4" /> Live instruction
            </Button>
          </Link>
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/patent-program`}>
            <Button variant="secondary" className="gap-2">
              <Sparkles className="h-4 w-4" /> Full program
            </Button>
          </Link>
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/mpep-workbench`}>
            <Button className="gap-2">
              <Library className="h-4 w-4" /> MPEP workbench
            </Button>
          </Link>
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}>
            <Button variant="outline" className="gap-2">
              <BrainCircuit className="h-4 w-4" /> QBank
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !hasAttempts ? (
        // Empty state — no QBank attempts yet. Direct the user to the
        // three actions that fill this page with data: practice the QBank,
        // start an SRS deck, or open the MPEP workbench.
        <Card className="p-8 text-center bg-gradient-to-br from-indigo-50/40 to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40">
          <Target className="h-12 w-12 text-indigo-400 dark:text-indigo-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-1">No attempts yet</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            The Command Center fills in once you start answering QBank questions. Every
            attempt feeds weakness-by-chapter, time-vs-accuracy, and the SRS review queue.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}?tab=qbank`}>
              <Button className="gap-2">
                <BrainCircuit className="h-4 w-4" />
                Start a QBank session
              </Button>
            </Link>
            <Link href="/dashboard/srs/review?deck=PATENT_BAR">
              <Button variant="outline" className="gap-2">
                <Brain className="h-4 w-4" />
                Open SRS deck
              </Button>
            </Link>
            <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/mpep-workbench`}>
              <Button variant="ghost" className="gap-2">
                <Library className="h-4 w-4" />
                MPEP workbench
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Target className="h-4 w-4" /> Attempts tracked
              </div>
              <p className="text-3xl font-bold">{data?.total_answered ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Patent Bar QBank answers with timing</p>
            </Card>
            <Card className="p-5 border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200 mb-1">
                <AlertTriangle className="h-4 w-4" /> Slow + inaccurate
              </div>
              <p className="text-sm font-medium leading-snug">
                {(data?.summary?.slow_inaccurate_buckets?.length ?? 0) > 0
                  ? (data?.summary?.slow_inaccurate_buckets ?? []).join(', ')
                  : 'No buckets yet — keep practicing.'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">&gt;120s avg and &lt;55% accuracy (2+ attempts)</p>
            </Card>
            <Link
              href="/dashboard/srs/review?deck=PATENT_BAR"
              className="block"
              title="Open the Patent Bar SRS deck"
            >
              <Card className="p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Sparkles className="h-4 w-4" /> Anchored reviews due
                </div>
                <p className="text-3xl font-bold">{review?.total ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to open the SRS deck (MPEP/statute-tagged misses)
                </p>
              </Card>
            </Link>
          </div>

          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Timer className="h-5 w-5" /> Time vs outcome
                </h2>
                <p className="text-sm text-muted-foreground">
                  Each point is one question attempt. Green: correct. Red: incorrect. Long times on misses suggest
                  lookup friction or weak rule recognition.
                </p>
              </div>
            </div>
            {rawPoints.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Complete Patent Bar QBank sessions to populate this chart.</p>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" dataKey="x" name="Time" unit="s" />
                    <YAxis type="number" dataKey="y" domain={[-0.15, 1.15]} ticks={[0, 1]} tickFormatter={(v) => (v === 1 ? 'Correct' : 'Miss')} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const p = payload[0].payload;
                        return (
                          <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-md">
                            <div>Time: {Math.round(p.time_spent_seconds ?? p.x)}s</div>
                            <div>{p.is_correct ? 'Correct' : 'Incorrect'}</div>
                            {p.mpep_chapter && <div>MPEP Ch. {p.mpep_chapter}</div>}
                            {p.topic && <div className="text-muted-foreground truncate max-w-[240px]">{p.topic}</div>}
                          </div>
                        );
                      }}
                    />
                    <Legend />
                    <Scatter name="Correct" data={scatterCorrect} fill="hsl(142, 76%, 36%)" />
                    <Scatter name="Incorrect" data={scatterMiss} fill="hsl(0, 72%, 51%)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <WeaknessTable title="By MPEP chapter" rows={data?.weakness_by_mpep_chapter ?? []} />
            <WeaknessTable title="By statute / rule" rows={data?.weakness_by_statute ?? []} />
            <WeaknessTable title="By topic" rows={data?.weakness_by_topic ?? []} />
            <WeaknessTable title="By content type (tagged)" rows={data?.weakness_by_content_type ?? []} />
            <WeaknessTable title="By trap type (tagged)" rows={data?.weakness_by_trap_type ?? []} />
          </div>

          <Card className="p-6 bg-muted/40">
            <h3 className="font-semibold mb-2">Spaced repetition from misses</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Builds flashcards from incorrect QBank answers and tags them with MPEP chapter and statute when available.
              Those cards feed the normal SM-2 queue alongside your other Patent Bar cards.
            </p>
            <Button onClick={onMisses} disabled={missBusy} className="gap-2">
              {missBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
              Generate flashcards from recent misses
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}

function WeaknessTable({ title, rows }: { title: string; rows: any[] }) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 text-sm">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">No data yet.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {rows.map((r) => (
            <div
              key={r.key}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-xs ${
                r.risk_slow_inaccurate ? 'border-amber-300 bg-amber-50/80 dark:bg-amber-950/40' : ''
              }`}
            >
              <span className="font-medium truncate max-w-[160px]" title={r.key}>
                {r.key}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="secondary">{Math.round((r.accuracy ?? 0) * 100)}%</Badge>
                <span className="text-muted-foreground">{r.avg_time_seconds}s avg</span>
                {r.risk_slow_inaccurate && (
                  <Badge variant="outline" className="text-amber-800 border-amber-400">
                    risk
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

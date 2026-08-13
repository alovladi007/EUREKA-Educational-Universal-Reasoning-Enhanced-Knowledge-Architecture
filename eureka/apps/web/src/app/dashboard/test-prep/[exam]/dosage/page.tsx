'use client';

/**
 * NCLEX Dosage Mastery — the med-math engine surface.
 *
 * Two modes, honestly labeled:
 *
 *  - SERVER mode (default): items are generated fresh by api-core, whose
 *    engine verifies every key through two independent computation paths
 *    before serving. The answer is a typed number (the real NCLEX
 *    calculation format), graded server-side — no key ever reaches this
 *    page before submission. A wrong answer that matches a classic error's
 *    value for THIS item's parameters comes back with the error named and
 *    coached.
 *
 *  - OFFLINE mode (automatic fallback when api-core is unreachable): the
 *    200-item static bank emitted from the same engine
 *    (nclex-dosage-bank2-data.ts) serves as multiple choice. Each distractor
 *    carries its misconception key, so a miss is still coached — and the
 *    banner says plainly that this is the static bank, not fresh generation.
 *
 * Session numbers on this page are counts of graded answers in this
 * sitting; lifetime numbers come from the server's attempt log. Nothing is
 * predicted.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle, ArrowRight, Calculator, CheckCircle2, WifiOff, XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import type { NclexDosageBank2Item } from '@/lib/nclex-dosage-bank2-data';

type Overview = Awaited<ReturnType<typeof apiClient.getNclexDosageOverview>>;
type ServedItem = Awaited<ReturnType<typeof apiClient.nextNclexDosage>>;
type Verdict = Awaited<ReturnType<typeof apiClient.submitNclexDosage>>;

type Mode = 'server' | 'offline';

const FAMILY_KEYS = [
  'tablets', 'liquid-volume', 'dose-by-weight', 'iv-rate-mlhr', 'iv-drip-gtt',
  'unit-conversion', 'reconstitution', 'pediatric-safe-dose', 'infusion-time',
  'iv-dose-mlhr',
] as const;

const FAMILY_LABELS: Record<string, string> = {
  'tablets': 'Tablets & capsules',
  'liquid-volume': 'Oral liquids',
  'dose-by-weight': 'Weight-based dosing',
  'iv-rate-mlhr': 'IV pump rate',
  'iv-drip-gtt': 'Gravity drip rate',
  'unit-conversion': 'Unit conversions',
  'reconstitution': 'Reconstitution',
  'pediatric-safe-dose': 'Pediatric safe dose',
  'infusion-time': 'Infusion time',
  'iv-dose-mlhr': 'Critical-care infusions',
};

export default function DosageMasteryPage() {
  const params = useParams<{ exam: string }>();
  const examId = ((params?.exam as string) || '').toUpperCase();

  if (examId !== 'NCLEX_RN') {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Dosage Mastery is part of NCLEX-RN prep.{' '}
          <Link className="text-primary underline" href="/dashboard/test-prep?exam=NCLEX_RN">
            Switch to NCLEX
          </Link>
        </CardContent>
      </Card>
    );
  }
  return <DosageMastery />;
}

function DosageMastery() {
  const [mode, setMode] = useState<Mode>('server');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [family, setFamily] = useState<string | null>(null);

  // Server-mode state
  const [item, setItem] = useState<ServedItem | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  // Offline-mode state
  const [bank2, setBank2] = useState<NclexDosageBank2Item[] | null>(null);
  const [offlineItem, setOfflineItem] = useState<NclexDosageBank2Item | null>(null);
  const [offlineChoice, setOfflineChoice] = useState<number | null>(null);
  const [offlineSubmitted, setOfflineSubmitted] = useState(false);

  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState({ answered: 0, correct: 0 });
  const startedAt = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const loadOverview = useCallback(async () => {
    try {
      setOverview(await apiClient.getNclexDosageOverview());
      setMode('server');
    } catch {
      setMode('offline');
    }
  }, []);

  useEffect(() => { loadOverview(); }, [loadOverview]);

  const ensureBank2 = useCallback(async () => {
    if (bank2) return bank2;
    const m = await import('@/lib/nclex-dosage-bank2-data');
    setBank2(m.NCLEX_DOSAGE_BANK2);
    return m.NCLEX_DOSAGE_BANK2;
  }, [bank2]);

  const nextOffline = useCallback(async (fam: string | null) => {
    const pool0 = await ensureBank2();
    const pool = fam ? pool0.filter((q) => q.calc?.kind === fam) : pool0;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setOfflineItem(pick);
    setOfflineChoice(null);
    setOfflineSubmitted(false);
  }, [ensureBank2]);

  const next = useCallback(async (fam: string | null) => {
    setLoading(true);
    setVerdict(null);
    setAnswer('');
    try {
      if (mode === 'server') {
        const served = await apiClient.nextNclexDosage(fam);
        setItem(served);
        startedAt.current = Date.now();
        setTimeout(() => inputRef.current?.focus(), 50);
        return;
      }
    } catch {
      setMode('offline');
    } finally {
      setLoading(false);
    }
    await nextOffline(fam);
  }, [mode, nextOffline]);

  // Keep the offline path warm whenever we land in offline mode.
  useEffect(() => {
    if (mode === 'offline' && !offlineItem) nextOffline(family);
  }, [mode, offlineItem, family, nextOffline]);

  const submit = useCallback(async () => {
    if (!item || verdict) return;
    const value = parseFloat(answer.replace(',', '.'));
    if (Number.isNaN(value)) return;
    setLoading(true);
    try {
      const v = await apiClient.submitNclexDosage({
        item_id: item.item_id,
        answer: value,
        seconds: Math.min(3600, Math.round((Date.now() - startedAt.current) / 1000)),
      });
      setVerdict(v);
      setSession((s) => ({ answered: s.answered + 1, correct: s.correct + (v.is_correct ? 1 : 0) }));
    } catch {
      // Grading is server-side by design; if the server vanished mid-item we
      // drop to offline mode rather than pretending to grade locally.
      setMode('offline');
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [item, verdict, answer]);

  const submitOffline = useCallback(() => {
    if (!offlineItem || offlineChoice === null || offlineSubmitted) return;
    setOfflineSubmitted(true);
    const correct = offlineChoice === offlineItem.correct;
    setSession((s) => ({ answered: s.answered + 1, correct: s.correct + (correct ? 1 : 0) }));
  }, [offlineItem, offlineChoice, offlineSubmitted]);

  const pickFamily = (fam: string | null) => {
    setFamily(fam);
    setItem(null);
    setVerdict(null);
    setOfflineItem(null);
    next(fam);
  };

  const offlineMisconception = useMemo(() => {
    if (!offlineItem || !offlineSubmitted || offlineChoice === null) return null;
    if (offlineChoice === offlineItem.correct) return null;
    const key = offlineItem.misconceptionByOption[offlineChoice];
    return key ? { key, coaching: offlineItem.coaching[key] } : null;
  }, [offlineItem, offlineSubmitted, offlineChoice]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-base">
            <Calculator className="h-4 w-4" />
            Dosage Mastery
            <Badge className="bg-emerald-600 text-white text-[10px]" title={overview?.key_note ?? 'Answer keys are machine-verified through two independent computation paths.'}>
              Machine-verified keys
            </Badge>
            <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400 text-[10px]" title={overview?.template_note ?? 'Item templates are authored practice material, not yet SME-reviewed.'}>
              Templates unreviewed
            </Badge>
            {mode === 'offline' && (
              <Badge variant="outline" className="text-[10px]" title="api-core is unreachable; serving the 200-item static bank emitted from the same engine, as multiple choice.">
                <WifiOff className="mr-1 h-3 w-3" />
                Offline bank
              </Badge>
            )}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {mode === 'server'
              ? 'Fresh items, generated and graded on the server. Type the number — the real exam records calculations, it does not offer choices.'
              : 'Server unreachable — practicing against the static bank (same engine, frozen), multiple choice.'}
            {' '}Session: {session.answered} answered · {session.correct} correct.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            <FamilyChip active={family === null} label="Mixed" onClick={() => pickFamily(null)} />
            {FAMILY_KEYS.map((k) => {
              const row = overview?.families.find((f) => f.key === k);
              return (
                <FamilyChip
                  key={k}
                  active={family === k}
                  label={FAMILY_LABELS[k]}
                  detail={row && row.answered > 0 ? `${row.correct}/${row.answered}` : undefined}
                  onClick={() => pickFamily(k)}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* SERVER MODE */}
      {mode === 'server' && !item && (
        <Card>
          <CardContent className="py-8 text-center">
            <Button onClick={() => next(family)} disabled={loading}>
              {loading ? 'Generating…' : 'Start practicing'}
            </Button>
          </CardContent>
        </Card>
      )}

      {mode === 'server' && item && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[10px]">{item.family_label}</Badge>
              answer in <span className="font-mono">{item.unit}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{item.stem}</p>

            <form
              className="flex items-center gap-2"
              onSubmit={(e) => { e.preventDefault(); verdict ? next(family) : submit(); }}
            >
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                value={answer}
                disabled={!!verdict}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="0"
                aria-label={`Your answer in ${item.unit}`}
                className="w-36 rounded-md border border-input bg-background px-3 py-2 text-right font-mono text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
              <span className="text-sm text-muted-foreground">{item.unit}</span>
              {!verdict ? (
                <Button type="submit" disabled={loading || answer.trim() === ''}>
                  {loading ? 'Grading…' : 'Submit'}
                </Button>
              ) : (
                <Button type="submit">
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </form>

            {verdict && (
              <div className="space-y-3 border-t pt-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  {verdict.is_correct ? (
                    <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Correct — {verdict.expected_display}</>
                  ) : (
                    <><XCircle className="h-4 w-4 text-red-500" /> Not quite — the answer is {verdict.expected_display}</>
                  )}
                </p>
                {verdict.misconception && (
                  <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      {verdict.misconception.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{verdict.misconception.coaching}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Worked solution</p>
                  <p className="mt-1 text-sm leading-relaxed">{verdict.explanation}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* OFFLINE MODE */}
      {mode === 'offline' && offlineItem && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[10px]">{offlineItem.subtopic}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{offlineItem.question}</p>
            <div className="space-y-1.5">
              {offlineItem.options.map((opt, i) => {
                const isKey = offlineSubmitted && i === offlineItem.correct;
                const isMiss = offlineSubmitted && i === offlineChoice && i !== offlineItem.correct;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={offlineSubmitted}
                    onClick={() => setOfflineChoice(i)}
                    className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition
                      ${offlineChoice === i && !offlineSubmitted ? 'border-primary ring-1 ring-primary' : 'border-input'}
                      ${isKey ? 'border-emerald-600 bg-emerald-600/10' : ''}
                      ${isMiss ? 'border-red-500 bg-red-500/10' : ''}`}
                  >
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {!offlineSubmitted ? (
              <Button onClick={submitOffline} disabled={offlineChoice === null}>Submit</Button>
            ) : (
              <div className="space-y-3 border-t pt-3">
                {offlineMisconception && (
                  <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      A classic error
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{offlineMisconception.coaching}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Worked solution</p>
                  <p className="mt-1 text-sm leading-relaxed">{offlineItem.explanation}</p>
                </div>
                <Button onClick={() => nextOffline(family)}>
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FamilyChip({
  active, label, detail, onClick,
}: { active: boolean; label: string; detail?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition
        ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:border-primary'}`}
    >
      {label}
      {detail && <span className={`ml-1.5 font-mono ${active ? 'opacity-80' : 'text-muted-foreground'}`}>{detail}</span>}
    </button>
  );
}

'use client';

/**
 * LSAT LawHub workbench — counterpart to Patent Bar's MPEP workbench.
 * Layout:
 *   1. Top bar:  Hub / Analytics + LawHub launch buttons
 *   2. Info bar: explains LawHub-vs-LSAC distinction and key timing facts
 *   3. Frequency heatmap (LsatFrequencyHeatmap) — "which question types first?"
 *   4. Two-pane workbench:
 *        Left  - TOC of question types (LR + RC) with filter
 *        Right - target panel showing the selected LSAC reference URL and
 *                buttons to open it / launch LawHub / copy the URL
 */

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, List, Search as SearchIcon, ExternalLink, Copy, Info, ShieldAlert, Clock,
} from 'lucide-react';
import {
  LSAT_QUESTION_TYPES,
  LSAC_QUESTION_TYPES,
  LSAC_RC,
  LSAC_LR,
  LSAC_PRACTICE,
  LAWHUB_PREPTESTS,
  LAWHUB_FREE,
  LSAC_LAWHUB_LANDING,
  lsacReferenceUrl,
  type LsatQuestionType,
} from '@/lib/lsat-frequency';
import { LsatFrequencyHeatmap } from '@/components/test-prep/LsatFrequencyHeatmap';

const EXAM = 'LSAT';

export default function LawhubWorkbenchPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();
  const [filter, setFilter] = useState('');
  const [target, setTarget] = useState<LsatQuestionType | null>(null);
  const [tab, setTab] = useState<'lr' | 'rc'>('lr');

  React.useEffect(() => {
    if (exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
    }
  }, [exam, params.exam, router]);

  if (exam !== EXAM) return null;

  const lr = LSAT_QUESTION_TYPES.filter((q) => q.section === 'LR');
  const rc = LSAT_QUESTION_TYPES.filter((q) => q.section === 'RC');
  const active = (tab === 'lr' ? lr : rc).filter(
    (q) => !filter.trim() || q.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const openLink = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const targetUrl = target?.url || LAWHUB_PREPTESTS;
  const targetRef = target ? lsacReferenceUrl(target) : LSAC_QUESTION_TYPES;

  const copyUrl = async () => {
    try { await navigator.clipboard.writeText(targetUrl); } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col gap-3 min-h-[calc(100vh-6rem)]">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Hub
          </Link>
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/lsat-analytics`}>
            <Button variant="outline" size="sm">Analytics</Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px]">LawHub R-2024+ practice shell</Badge>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => openLink(LAWHUB_PREPTESTS)}>
            <ExternalLink className="h-3.5 w-3.5" /> Open LawHub
          </Button>
        </div>
      </div>

      {/* Info bar */}
      <div className="rounded-lg border border-purple-200/80 bg-purple-50/60 dark:bg-purple-950/25 text-sm p-3 flex flex-wrap gap-2 items-start">
        <ShieldAlert className="h-4 w-4 text-purple-700 dark:text-purple-400 shrink-0 mt-0.5" />
        <p className="text-muted-foreground flex-1 min-w-[200px]">
          <strong className="text-foreground">Question-type cells open LawHub</strong>
          {' '}(<span className="font-mono text-[11px]">lawhub.lsac.org/preptests</span>) — LSAC&apos;s
          official QBank platform, the same interface the real LSAT uses. The LSAC question-types
          page (<span className="font-mono text-[11px]">lsac.org/lsat/prepare/types-lsat-questions</span>)
          is a content reference, not a QBank — kept in the detail panel as a description-only link.
          Practice in LawHub for muscle memory.
        </p>
      </div>

      {/* Quick LSAT facts strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {[
          { k: 'Sections', v: '2× LR · 1× RC · 1 experimental' },
          { k: 'Section time', v: '35 min · ≈25–27 Q' },
          { k: 'Score range', v: '120 – 180' },
          { k: 'Logic Games', v: 'REMOVED (Aug 2024)' },
        ].map((f) => (
          <Card key={f.k} className="p-2.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{f.k}</p>
            <p className="text-sm font-semibold leading-tight mt-0.5">{f.v}</p>
          </Card>
        ))}
      </div>

      {/* Frequency heatmap */}
      <LsatFrequencyHeatmap />

      {/* Two-pane workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,340px)_1fr] gap-3 flex-1 min-h-[480px]">
        {/* Left pane: TOC */}
        <Card className="flex flex-col overflow-hidden p-0">
          <div className="flex border-b">
            {(
              [
                ['lr', 'Logical Reasoning', List],
                ['rc', 'Reading Comp', List],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  tab === id ? 'bg-muted border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
          <div className="p-3 flex-1 overflow-y-auto max-h-[60vh] space-y-2">
            <Input
              placeholder="Filter question types…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-9"
            />
            <div className="space-y-1">
              {active.map((q) => {
                const selected = target?.id === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setTarget(q)}
                    className={`w-full text-left rounded-md px-2 py-1.5 text-xs hover:bg-accent flex justify-between gap-2 ${
                      selected ? 'bg-accent ring-1 ring-primary/30' : ''
                    }`}
                  >
                    <span className="font-mono text-muted-foreground w-10 shrink-0">{q.frequency}%</span>
                    <span className="flex-1 leading-snug">{q.name}</span>
                  </button>
                );
              })}
              {active.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No matching question types.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Right pane: target URL panel */}
        <div className="relative rounded-lg border bg-muted/20 overflow-hidden flex flex-col min-h-[420px]">
          <div className="p-6 flex flex-col flex-1 justify-center gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {target ? `Selected: ${target.name}` : 'Pick a question type'}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {target
                  ? `${target.section} · ${target.frequency}% of section · ${target.description}`
                  : 'Choose a Logical Reasoning or Reading Comprehension question type from the left. Click "Open LawHub" to drill that section in LSAC\'s official QBank.'}
              </p>
            </div>
            <div className="rounded-md border bg-background p-3 font-mono text-[11px] break-all leading-relaxed text-muted-foreground">
              {targetUrl}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="lg" className="gap-2" onClick={() => openLink(targetUrl)}>
                <ExternalLink className="h-4 w-4" /> Open LawHub
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={() => openLink(targetRef)}>
                <ExternalLink className="h-4 w-4" /> LSAC reference
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={copyUrl}>
                <Copy className="h-4 w-4" /> Copy URL
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <a href={LAWHUB_FREE} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                LawHub Free <ExternalLink className="h-3 w-3" />
              </a>
              <a href={LSAC_PRACTICE} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-1">
                Official LSAT practice tests <ExternalLink className="h-3 w-3" />
              </a>
              <a href={LSAC_LAWHUB_LANDING} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-1">
                LawHub overview <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 inline mr-1 align-text-bottom" />
              Tip: tile this window with the LawHub tab. The real LSAT runs in LawHub, so practising
              side-by-side builds the muscle memory for navigation, flagging, and timer pressure.
            </p>
            <p className="text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 inline mr-1 align-text-bottom" />
              Section pacing: roughly <strong>1:25 / LR question</strong>, <strong>1:20 / RC question</strong>.
              Most candidates finish LR before RC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

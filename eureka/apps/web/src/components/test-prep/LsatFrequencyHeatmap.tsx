'use client';

/**
 * LSAT Question-Type Frequency Heatmap
 * ─────────────────────────────────────────────────────────────────────────
 * Visualises which LSAT question types (Logical Reasoning + Reading
 * Comprehension) appear most often in the modern LSAT (post-Aug 2024 format
 * with Logic Games REMOVED).
 *
 * Click any cell to open the LSAC official content reference for that type.
 * Hover/focus reveals a description of what the question type is testing.
 *
 * Data: lib/lsat-frequency.ts
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, Info, Target } from 'lucide-react';
import {
  LSAT_QUESTION_TYPES,
  LSAT_TIER_COLORS,
  LSAC_QUESTION_TYPES,
  LSAC_PRACTICE,
  LAWHUB_BASE,
  LAWHUB_PREPTESTS,
  LAWHUB_FREE,
  lsatOfficialUrl,
  lsatInternalQbankUrl,
  lsacReferenceUrl,
  type LsatQuestionType,
  type LsatTier,
} from '@/lib/lsat-frequency';

const TIER_ORDER: LsatTier[] = ['very-high', 'high', 'medium', 'low', 'minimal'];

function Section({
  title,
  subtitle,
  types,
  active,
  setActive,
}: {
  title: string;
  subtitle: string;
  types: LsatQuestionType[];
  active: LsatQuestionType | null;
  setActive: (t: LsatQuestionType | null) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
        {types.map((q) => {
          const color = LSAT_TIER_COLORS[q.tier];
          const isActive = active?.id === q.id;
          return (
            <a
              key={q.id}
              // Primary click → LawHub, LSAC's OFFICIAL QBank platform.
              // Same pattern as Patent Bar (eMPEP) and MCAT (AAMC store).
              href={lsatOfficialUrl(q)}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActive(q)}
              onFocus={() => setActive(q)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              style={{
                backgroundColor: color.bg,
                color: color.text,
                boxShadow: isActive
                  ? `0 0 0 2px var(--background, #fff), 0 0 0 4px ${color.ring}`
                  : undefined,
              }}
              className="group relative rounded-md p-2 flex flex-col gap-1 text-left transition-transform hover:scale-105 hover:z-10 cursor-pointer min-h-[64px]"
              title={`${q.name} — open LawHub (LSAC's official ${q.section} PrepTest library)`}
            >
              <span className="text-[10px] font-mono opacity-80">{q.frequency}%</span>
              <span className="text-xs font-semibold leading-tight">{q.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function LsatFrequencyHeatmap() {
  const [active, setActive] = useState<LsatQuestionType | null>(null);
  const lr = LSAT_QUESTION_TYPES.filter((q) => q.section === 'LR');
  const rc = LSAT_QUESTION_TYPES.filter((q) => q.section === 'RC');

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            LSAT Question-Type Frequency
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Empirical frequency of each LSAT question type in the current format (post-Aug 2024:
            2× Logical Reasoning + 1× Reading Comprehension; Logic Games removed).{' '}
            <strong className="text-foreground">Click any cell to open LawHub</strong>{' '}
            — LSAC&apos;s official PrepTest library and QBank platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={LAWHUB_PREPTESTS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            LawHub PrepTests <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={LAWHUB_FREE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            LawHub Free <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={LSAC_QUESTION_TYPES}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            LSAC reference <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <Section
          title="Logical Reasoning (LR)"
          subtitle="≈50 questions across 2 sections · ~66% of scored exam"
          types={lr}
          active={active}
          setActive={setActive}
        />
        <Section
          title="Reading Comprehension (RC)"
          subtitle="≈27 questions in 1 section · ~34% of scored exam · 1 comparative-passage set"
          types={rc}
          active={active}
          setActive={setActive}
        />
      </div>

      {/* Active question-type detail */}
      <div className="rounded-md border bg-muted/30 p-3 min-h-[88px] text-sm">
        {active ? (
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">
                {active.name}{' '}
                <span className="text-xs font-normal text-muted-foreground">· {active.section} · {active.frequency}%</span>
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href={lsatOfficialUrl(active)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="h-3 w-3" /> Open LawHub for {active.section}
                </a>
                <Link
                  href={lsatInternalQbankUrl(active, 20)}
                  className="text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-1"
                >
                  <Target className="h-3 w-3" /> Or practice on Eureka
                </Link>
                <a
                  href={lsacReferenceUrl(active)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-1"
                >
                  LSAC reference <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div>
              <Badge
                className="border-0 text-[10px]"
                style={{
                  backgroundColor: LSAT_TIER_COLORS[active.tier].bg,
                  color: LSAT_TIER_COLORS[active.tier].text,
                }}
              >
                {active.tier.replace('-', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{active.description}</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Hover a cell to preview a question type.{' '}
            <strong className="text-foreground">Click any cell to open LawHub</strong>{' '}
            — LSAC&apos;s official QBank with full PrepTest content for that section.
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted-foreground font-medium">Legend:</span>
        {TIER_ORDER.map((tier) => {
          const color = LSAT_TIER_COLORS[tier];
          return (
            <span key={tier} className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color.bg }} />
              <span className="text-muted-foreground">{color.label}</span>
            </span>
          );
        })}
      </div>
    </Card>
  );
}

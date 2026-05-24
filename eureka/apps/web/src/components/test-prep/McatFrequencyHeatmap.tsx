'use client';

/**
 * MCAT Foundational Concept Frequency Heatmap
 * ─────────────────────────────────────────────────────────────────────────
 * Visualises which AAMC Foundational Concepts (FC1–FC10) plus CARS make up
 * the most of the MCAT. Click any cell to open AAMC's official content
 * outline / prep materials.
 *
 * Data: lib/mcat-frequency.ts
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, Info, FileText } from 'lucide-react';
import {
  MCAT_FOUNDATIONAL_CONCEPTS,
  MCAT_TIER_COLORS,
  MCAT_SECTION_COLORS,
  AAMC_MCAT_BASE,
  AAMC_OUTLINE_PDF,
  AAMC_PREP_LANDING,
  type McatTopic,
  type McatTier,
  type McatSection,
} from '@/lib/mcat-frequency';

const TIER_ORDER: McatTier[] = ['very-high', 'high', 'medium', 'low'];
const SECTION_ORDER: McatSection[] = ['chem_phys', 'cars', 'bio_biochem', 'psych_soc'];

export function McatFrequencyHeatmap() {
  const [active, setActive] = useState<McatTopic | null>(null);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            MCAT Foundational Concept Frequency
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            How AAMC distributes the 230-question MCAT across the four sections and ten foundational
            concepts (FC1–FC10) plus CARS. Percentages are share of the WHOLE exam.{' '}
            <strong className="text-foreground">Click any cell to open AAMC&apos;s official content outline</strong>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={AAMC_OUTLINE_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <FileText className="h-3 w-3" /> AAMC content outline (PDF)
          </a>
          <a
            href={AAMC_PREP_LANDING}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            AAMC prep <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Section legend */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        {SECTION_ORDER.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: MCAT_SECTION_COLORS[s].dot }}
            />
            <span className="text-muted-foreground">{MCAT_SECTION_COLORS[s].label}</span>
          </span>
        ))}
      </div>

      {/* Grouped grid — one row per section */}
      <div className="space-y-3 mb-4">
        {SECTION_ORDER.map((sec) => {
          const items = MCAT_FOUNDATIONAL_CONCEPTS.filter((t) => t.section === sec);
          if (items.length === 0) return null;
          const sectionTotal = items.reduce((acc, t) => acc + t.frequency, 0);
          return (
            <div key={sec} className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: MCAT_SECTION_COLORS[sec].dot }}
                />
                <span className="font-semibold">{MCAT_SECTION_COLORS[sec].label}</span>
                <span className="text-muted-foreground">≈ {sectionTotal}% of exam</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                {items.map((t) => {
                  const color = MCAT_TIER_COLORS[t.tier];
                  const isActive = active?.id === t.id;
                  return (
                    <a
                      key={t.id}
                      href={t.url || AAMC_OUTLINE_PDF}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setActive(t)}
                      onFocus={() => setActive(t)}
                      onMouseLeave={() => setActive(null)}
                      onBlur={() => setActive(null)}
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                        boxShadow: isActive
                          ? `0 0 0 2px var(--background, #fff), 0 0 0 4px ${color.ring}`
                          : undefined,
                      }}
                      className="group relative rounded-md p-3 transition-transform hover:scale-105 hover:z-10 cursor-pointer min-h-[64px]"
                      title={`${t.name} — ${t.frequency}% of exam`}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold leading-tight">{t.name}</span>
                        <span className="text-[11px] font-mono opacity-80 shrink-0">{t.frequency}%</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active topic detail */}
      <div className="rounded-md border bg-muted/30 p-3 min-h-[80px] text-sm">
        {active ? (
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">
                {active.name}{' '}
                <span className="text-xs font-normal text-muted-foreground">· {active.sectionLabel}</span>
              </p>
              <Link
                href={active.url || AAMC_OUTLINE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Open AAMC outline <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className="border-0 text-[10px]"
                style={{
                  backgroundColor: MCAT_TIER_COLORS[active.tier].bg,
                  color: MCAT_TIER_COLORS[active.tier].text,
                }}
              >
                {active.tier.replace('-', ' ')} · {active.frequency}% of exam
              </Badge>
              <span className="text-xs text-muted-foreground">
                ≈ {Math.round((active.frequency / 100) * 230)} questions of 230
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{active.description}</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Hover a Foundational Concept to preview it. Click to open AAMC&apos;s official content outline.
          </p>
        )}
      </div>

      {/* Tier legend */}
      <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted-foreground font-medium">Legend:</span>
        {TIER_ORDER.map((tier) => {
          const color = MCAT_TIER_COLORS[tier];
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

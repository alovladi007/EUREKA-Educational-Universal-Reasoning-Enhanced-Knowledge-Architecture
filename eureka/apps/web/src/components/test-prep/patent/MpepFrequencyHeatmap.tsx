'use client';

/**
 * MPEP Chapter Frequency Heatmap
 * ─────────────────────────────────────────────────────────────────────────
 * Visualizes which MPEP chapters appear most often on the USPTO Patent Bar
 * exam. Color intensity = frequency (red = very high, slate = minimal).
 * Click any cell to open that chapter in the official eMPEP reader.
 *
 * Place this in the MPEP workbench (or anywhere a user needs to prioritise
 * study time).
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, Info } from 'lucide-react';
import {
  MPEP_CHAPTER_FREQUENCY,
  MPEP_FREQUENCY_TOTAL,
  TIER_COLORS,
  type MpepChapterFrequency,
  type FrequencyTier,
} from '@/lib/mpep-frequency';
import { eMpepChapterUrl } from '@/lib/mpep-chapters';
import { cn } from '@/lib/utils';

const TIER_ORDER: FrequencyTier[] = ['very-high', 'high', 'medium', 'low', 'minimal'];

export function MpepFrequencyHeatmap() {
  const [active, setActive] = useState<MpepChapterFrequency | null>(null);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            MPEP Chapter Frequency
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Empirical frequency of each MPEP chapter on the USPTO Patent Bar exam, based on the
            OED blueprint and aggregated released exam analyses. Color = how often the chapter
            shows up. <strong className="text-foreground">Click any cell to open the chapter</strong>.
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono shrink-0">
          {MPEP_CHAPTER_FREQUENCY.length} chapters
        </Badge>
      </div>

      {/* Heatmap grid — inline styles (not Tailwind classes) because the
          per-tier color strings live in an object lookup that Tailwind's
          JIT can't follow, so dynamic Tailwind classes get purged. Using
          inline hex values guarantees every tier renders correctly. */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-1.5 mb-4">
        {MPEP_CHAPTER_FREQUENCY.map((ch) => {
          const color = TIER_COLORS[ch.tier];
          const isActive = active?.num === ch.num;
          return (
            <a
              key={ch.num}
              href={eMpepChapterUrl(ch.num)}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActive(ch)}
              onFocus={() => setActive(ch)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              style={{
                backgroundColor: color.bg,
                color: color.text,
                boxShadow: isActive
                  ? `0 0 0 2px var(--background, #fff), 0 0 0 4px ${color.ring}`
                  : undefined,
              }}
              className="group relative aspect-square rounded-md flex flex-col items-center justify-center font-mono text-xs font-bold transition-transform hover:scale-110 hover:z-10 cursor-pointer"
              title={`Ch. ${ch.num} — ${ch.title} (frequency: ${ch.frequency}/100)`}
            >
              <span className="text-sm leading-none">{ch.num}</span>
              <span className="text-[9px] opacity-80 mt-0.5">{ch.frequency}</span>
            </a>
          );
        })}
      </div>

      {/* Active chapter detail */}
      <div className="rounded-md border bg-muted/30 p-3 min-h-[68px] text-sm">
        {active ? (
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">
                MPEP Ch. {active.num} — {active.title}
              </p>
              <Link
                href={eMpepChapterUrl(active.num)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Open in eMPEP <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge
                className="border-0"
                style={{
                  backgroundColor: TIER_COLORS[active.tier].bg,
                  color: TIER_COLORS[active.tier].text,
                }}
              >
                {active.tier.replace('-', ' ')} · {active.frequency}/100
              </Badge>
              <span className="text-muted-foreground">
                ≈ {((active.frequency / MPEP_FREQUENCY_TOTAL) * 100).toFixed(1)}% of expected exam weight
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{active.topics}</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Hover (or focus) a cell to preview a chapter. Click to open it in the official eMPEP reader.
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted-foreground font-medium">Legend:</span>
        {TIER_ORDER.map((tier) => {
          const color = TIER_COLORS[tier];
          return (
            <span key={tier} className="inline-flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: color.bg }}
              />
              <span className="text-muted-foreground">{color.label}</span>
            </span>
          );
        })}
      </div>
    </Card>
  );
}

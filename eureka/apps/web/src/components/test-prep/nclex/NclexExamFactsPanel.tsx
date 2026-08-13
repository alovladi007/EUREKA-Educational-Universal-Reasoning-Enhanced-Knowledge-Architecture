'use client';

/**
 * NCLEX-RN exam facts panel — the honest version of a "command center" card.
 *
 * Everything here is either NCSBN-published statistics (pass rates, candidate
 * volume, test-plan dates) with the source named, or the test plan's own
 * category weight ranges. Nothing is a platform-invented percentile, cohort
 * claim, or predicted score — the same no-fabricated-data rule the rest of
 * the test-prep module follows.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, CalendarClock, ClipboardList } from 'lucide-react';

// NCSBN-published NCLEX-RN pass rates, 2024 vs 2025 full year.
const PASS_RATES = [
  { cohort: 'US-educated, first-time', y2024: 91.2, y2025: 86.7 },
  { cohort: 'All candidates', y2024: 73.3, y2025: 69.1 },
  { cohort: 'Internationally educated, first-time', y2024: 53.8, y2025: 47.3 },
];

// 2026 test plan Client Needs weight ranges (percent of scored items).
const BLUEPRINT = [
  { name: 'Management of Care', range: '15–21%' },
  { name: 'Pharmacological & Parenteral Therapies', range: '13–19%' },
  { name: 'Physiological Adaptation', range: '11–17%' },
  { name: 'Safety & Infection Control', range: '10–16%' },
  { name: 'Reduction of Risk Potential', range: '10–16%' },
  { name: 'Health Promotion & Maintenance', range: '6–12%' },
  { name: 'Psychosocial Integrity', range: '6–12%' },
  { name: 'Basic Care & Comfort', range: '6–12%' },
];

export function NclexExamFactsPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="h-4 w-4" />
          NCLEX-RN: the exam, by the numbers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Pass rates */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              Pass rates fell in 2025
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-1 font-normal">Cohort</th>
                  <th className="pb-1 text-right font-normal">2024</th>
                  <th className="pb-1 text-right font-normal">2025</th>
                </tr>
              </thead>
              <tbody>
                {PASS_RATES.map((r) => (
                  <tr key={r.cohort} className="border-t border-border/60">
                    <td className="py-1.5 pr-2">{r.cohort}</td>
                    <td className="py-1.5 text-right font-mono tabular-nums">{r.y2024}%</td>
                    <td className="py-1.5 text-right font-mono tabular-nums text-red-600 dark:text-red-400">
                      {r.y2025}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Roughly 193,000 US-educated candidates tested for the first time in
              2025. The passing standard did not change — the drop is performance,
              not a harder bar. Many programs sit near state-board thresholds
              (commonly 80% first-time pass), so preparation quality matters
              institutionally, not just individually.
            </p>
          </div>

          {/* Blueprint */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
              <CalendarClock className="h-3.5 w-3.5" />
              2026 test plan — frozen through March 2029
            </p>
            <ul className="space-y-1 text-sm">
              {BLUEPRINT.map((b) => (
                <li key={b.name} className="flex items-baseline justify-between gap-2 border-t border-border/60 py-1 first:border-t-0">
                  <span className="text-[13px]">{b.name}</span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{b.range}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[10px]">CAT: 85–150 items</Badge>
              <Badge variant="outline" className="text-[10px]">5 hours</Badge>
              <Badge variant="outline" className="text-[10px]">Pass/fail at 0.00 logits</Badge>
            </div>
          </div>
        </div>

        <p className="border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
          Sources: NCSBN published NCLEX pass-rate statistics (2024–2025 full-year)
          and the NCLEX-RN Test Plan effective 2026-04-01 through 2029-03-31.
          Category weights are percentages of scored items.
        </p>
      </CardContent>
    </Card>
  );
}

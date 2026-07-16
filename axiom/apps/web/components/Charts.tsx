'use client';

// Dependency-free SVG charts for AXIOM's analytics surfaces.
//
// The analytics DATA layer has been rich for a while (item analysis with
// discrimination, standards mastery, per-learner growth events) but nothing
// in the web app drew any of it — every view was a table or a list. These
// components close that gap without adding a charting dependency: plain SVG,
// theme-consistent via Tailwind fill-/stroke- utilities, responsive via
// viewBox, and honest axes (mastery is always drawn on the full 0..1 range so
// a flat learner never looks like a rocket ship).

import { useMemo, useState } from 'react';

// ---------------------------------------------------------------------------
// Growth line chart: a learner's mastery-after-each-event series.
// ---------------------------------------------------------------------------

export interface GrowthPoint {
  t: string;
  v: number; // p_known_after, 0..1
  correct: boolean;
}

export function GrowthLineChart({ points }: { points: GrowthPoint[] }) {
  const W = 640;
  const H = 200;
  const PAD = { left: 40, right: 12, top: 12, bottom: 24 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const [hover, setHover] = useState<number | null>(null);

  const coords = useMemo(() => {
    if (points.length === 0) return [];
    // x = event index (timestamps cluster within a session; the sequence is
    // the pedagogically meaningful axis), y = mastery on the FULL 0..1 range.
    const dx = points.length > 1 ? innerW / (points.length - 1) : 0;
    return points.map((p, i) => ({
      x: PAD.left + (points.length > 1 ? i * dx : innerW / 2),
      y: PAD.top + (1 - Math.max(0, Math.min(1, p.v))) * innerH,
      p,
    }));
  }, [points, innerW, innerH, PAD.left, PAD.top]);

  if (points.length === 0) return null;

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ');
  const areaPath =
    `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${PAD.top + innerH} ` +
    `L${coords[0].x.toFixed(1)},${PAD.top + innerH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const hovered = hover !== null ? coords[hover] : null;

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Mastery growth over ${points.length} graded events, from ${Math.round(points[0].v * 100)}% to ${Math.round(points[points.length - 1].v * 100)}%`}
      >
        {gridLines.map((g) => {
          const y = PAD.top + (1 - g) * innerH;
          return (
            <g key={g}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={y + 3.5}
                textAnchor="end"
                className="fill-current text-muted-foreground"
                fontSize={10}
              >
                {Math.round(g * 100)}%
              </text>
            </g>
          );
        })}
        <path d={areaPath} className="fill-brand-500/10" />
        <path
          d={linePath}
          className="stroke-brand-500"
          strokeWidth={2}
          fill="none"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={hover === i ? 5 : 3}
            className={
              c.p.correct ? 'fill-emerald-500' : 'fill-red-500'
            }
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <title>
              {`${c.p.correct ? 'Correct' : 'Incorrect'} — mastery ${Math.round(c.p.v * 100)}% — ${new Date(c.p.t).toLocaleString()}`}
            </title>
          </circle>
        ))}
        {hovered && (
          <text
            x={Math.min(hovered.x, W - PAD.right - 80)}
            y={Math.max(hovered.y - 10, PAD.top + 10)}
            className="fill-current text-foreground"
            fontSize={11}
            fontWeight={600}
          >
            {Math.round(hovered.p.v * 100)}%
          </text>
        )}
        <text
          x={PAD.left}
          y={H - 6}
          className="fill-current text-muted-foreground"
          fontSize={10}
        >
          first event
        </text>
        <text
          x={W - PAD.right}
          y={H - 6}
          textAnchor="end"
          className="fill-current text-muted-foreground"
          fontSize={10}
        >
          latest event
        </text>
      </svg>
      <figcaption className="mt-1 text-xs text-muted-foreground">
        Mastery after each graded response. Green dots are correct answers,
        red are incorrect. The y-axis is the full 0–100% range.
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Item scatter: difficulty (p-value) x discrimination — one dot per item.
// ---------------------------------------------------------------------------

export interface ScatterItem {
  label: string;
  pValue: number; // 0..1 (share answering correctly)
  discrimination: number; // roughly -1..1
  n: number;
}

export function ItemScatterChart({ items }: { items: ScatterItem[] }) {
  const W = 640;
  const H = 260;
  const PAD = { left: 44, right: 12, top: 14, bottom: 34 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  if (items.length === 0) return null;

  // Fixed, honest domains: p-value 0..1; discrimination clamped to [-1, 1].
  const x = (p: number) => PAD.left + Math.max(0, Math.min(1, p)) * innerW;
  const y = (d: number) =>
    PAD.top + (1 - (Math.max(-1, Math.min(1, d)) + 1) / 2) * innerH;

  const zeroY = y(0);

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Item difficulty versus discrimination for ${items.length} items`}
      >
        {/* discrimination = 0 line: everything below it deserves attention */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={zeroY}
          y2={zeroY}
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        {[0, 0.5, 1].map((g) => (
          <text
            key={g}
            x={x(g)}
            y={H - 16}
            textAnchor="middle"
            className="fill-current text-muted-foreground"
            fontSize={10}
          >
            {g}
          </text>
        ))}
        {[-1, 0, 1].map((g) => (
          <text
            key={g}
            x={PAD.left - 8}
            y={y(g) + 3.5}
            textAnchor="end"
            className="fill-current text-muted-foreground"
            fontSize={10}
          >
            {g}
          </text>
        ))}
        <text
          x={PAD.left + innerW / 2}
          y={H - 3}
          textAnchor="middle"
          className="fill-current text-muted-foreground"
          fontSize={10}
        >
          p-value (share correct) — right = easier
        </text>
        <text
          x={12}
          y={PAD.top + innerH / 2}
          textAnchor="middle"
          transform={`rotate(-90 12 ${PAD.top + innerH / 2})`}
          className="fill-current text-muted-foreground"
          fontSize={10}
        >
          discrimination
        </text>
        {items.map((it, i) => (
          <circle
            key={i}
            cx={x(it.pValue)}
            cy={y(it.discrimination)}
            r={Math.min(9, 3 + Math.sqrt(it.n))}
            className={
              it.discrimination < 0
                ? 'fill-red-500/70'
                : 'fill-brand-500/60'
            }
          >
            <title>
              {`${it.label} — p=${it.pValue.toFixed(2)}, discrimination=${it.discrimination.toFixed(2)}, n=${it.n}${it.discrimination < 0 ? ' — NEGATIVE: strong students did worse; check the answer key' : ''}`}
            </title>
          </circle>
        ))}
      </svg>
      <figcaption className="mt-1 text-xs text-muted-foreground">
        One dot per item; larger dots have more responses. Dots below the
        dashed line have negative discrimination — strong students did worse,
        which usually means a broken answer key.
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Level distribution: how a cohort splits across mastery bands for one node.
// ---------------------------------------------------------------------------

// Deterministic colors for whatever level labels appear in the data — the
// order encodes progression when the labels are the known BKT bands, and any
// unknown label still gets a stable slot.
const LEVEL_ORDER = ['novice', 'developing', 'practicing', 'proficient', 'mastered'];
const LEVEL_CLASSES: Record<string, string> = {
  novice: 'fill-red-400',
  developing: 'fill-amber-400',
  practicing: 'fill-yellow-400',
  proficient: 'fill-lime-500',
  mastered: 'fill-emerald-500',
};
const FALLBACK_CLASSES = [
  'fill-sky-400',
  'fill-violet-400',
  'fill-pink-400',
  'fill-teal-400',
];

export function levelClass(level: string, index: number): string {
  return LEVEL_CLASSES[level] ?? FALLBACK_CLASSES[index % FALLBACK_CLASSES.length];
}

export function sortLevels(levels: Record<string, number>): [string, number][] {
  return Object.entries(levels).sort(([a], [b]) => {
    const ia = LEVEL_ORDER.indexOf(a);
    const ib = LEVEL_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function LevelDistributionBar({
  levels,
  totalLearners,
  label,
}: {
  levels: Record<string, number>;
  totalLearners: number;
  label: string;
}) {
  const entries = sortLevels(levels);
  const total = entries.reduce((s, [, n]) => s + n, 0);
  if (total === 0 || totalLearners === 0) return null;

  let acc = 0;
  return (
    <svg
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className="h-2.5 w-full rounded"
      role="img"
      aria-label={`${label}: ${entries.map(([l, n]) => `${n} ${l}`).join(', ')}`}
    >
      {entries.map(([level, n], i) => {
        const w = (n / total) * 100;
        const seg = (
          <rect
            key={level}
            x={acc}
            y={0}
            width={w}
            height={8}
            className={levelClass(level, i)}
          >
            <title>{`${level}: ${n} learner${n === 1 ? '' : 's'}`}</title>
          </rect>
        );
        acc += w;
        return seg;
      })}
    </svg>
  );
}

export function LevelLegend({ nodes }: { nodes: { levels: Record<string, number> }[] }) {
  const seen = new Map<string, number>();
  for (const node of nodes) {
    for (const level of Object.keys(node.levels)) {
      if (!seen.has(level)) seen.set(level, seen.size);
    }
  }
  const entries = sortLevels(Object.fromEntries([...seen.keys()].map((k) => [k, 1])));
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      {entries.map(([level], i) => (
        <span key={level} className="inline-flex items-center gap-1.5">
          <svg viewBox="0 0 8 8" className="h-2.5 w-2.5 rounded-sm">
            <rect width={8} height={8} className={levelClass(level, i)} />
          </svg>
          {level}
        </span>
      ))}
    </div>
  );
}

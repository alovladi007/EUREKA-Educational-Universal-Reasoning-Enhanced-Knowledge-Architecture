'use client';

/**
 * Shared chrome for the two XR chemistry labs.
 *
 * The visual language is deliberately the same as the Solar System Explorer:
 * a full-bleed dark canvas with floating translucent panels, a top bar that
 * carries the back link and the mode switch, a left rail for choosing what to
 * look at, and a right panel for what it means. A learner moving between the
 * built-in portals should feel one product.
 */

import type { ReactNode } from 'react';

export function Panel({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`pointer-events-auto rounded-lg border border-white/10 bg-black/60 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">
      {children}
    </div>
  );
}

export function ToggleButton({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-sky-500 text-white'
          : 'bg-white/5 text-white/70 hover:bg-white/15 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * A labelled statistic. Used for the derived facts in the info panel, where
 * every value is read off the geometry rather than authored.
 */
export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 py-1.5 last:border-0">
      <span className="shrink-0 text-[11px] text-white/50" title={hint}>
        {label}
      </span>
      <span className="text-right text-xs font-medium text-white">{value}</span>
    </div>
  );
}

/**
 * The badge that names an OCTET curriculum node. Clicking it opens that
 * lesson, which is the whole point of aligning the lab to the course: the
 * model on screen and the words about it are one click apart.
 */
export function NodeBadge({ code }: { code: string }) {
  const octetBase =
    process.env.NEXT_PUBLIC_OCTET_URL ?? 'http://localhost:4200';
  return (
    <a
      href={`${octetBase}/learn/${encodeURIComponent(code)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-sky-300 ring-1 ring-sky-400/30 transition-colors hover:bg-sky-500/30 hover:text-sky-100"
      title={`Open the OCTET lesson for ${code}`}
    >
      {code}
    </a>
  );
}

/**
 * The honesty banner.
 *
 * Every view in these labs is a model, and which kind of model it is changes
 * what a learner may conclude from it. A computed conformer is not a crystal
 * structure; an idealised chair is not a measured one. Saying which is on
 * screen is not a disclaimer, it is part of the teaching.
 */
export function ModelNote({ kind }: { kind: 'computed' | 'idealised' }) {
  const text =
    kind === 'computed'
      ? 'Computed geometry: RDKit ETKDG embedding, MMFF94 optimised. A plausible low-energy conformer, not a crystal structure. Cited experimental numbers are shown as cited.'
      : 'Idealised geometry: exact textbook angles and bond lengths, built from the model rather than measured. Energies shown are the cited experimental values.';
  return (
    <div className="pointer-events-auto max-w-sm rounded border border-amber-400/25 bg-amber-950/40 px-2.5 py-1.5 text-[10px] leading-relaxed text-amber-200/90 backdrop-blur-md">
      {text}
    </div>
  );
}

export function HelpLine({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-auto rounded-md border border-white/10 bg-black/50 px-3 py-2 text-[11px] text-white/50 backdrop-blur-md">
      {children}
    </div>
  );
}

/** A labelled slider, used for dihedral angle and ring pucker. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[11px] text-white/60">{label}</span>
        <span className="font-mono text-xs font-semibold text-white">
          {value.toFixed(step < 1 ? 2 : 0)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-sky-400"
        aria-label={label}
      />
    </label>
  );
}

/**
 * A small inline energy plot for the conformational modes.
 *
 * Drawn as an SVG path over the supplied function so the curve and the model
 * cannot disagree: both read the same energy function.
 */
export function EnergyCurve({
  energyAt,
  current,
  width = 260,
  height = 92,
  maxEnergy,
  markers = [],
}: {
  energyAt: (deg: number) => number;
  current: number;
  width?: number;
  height?: number;
  maxEnergy: number;
  markers?: { deg: number; label: string }[];
}) {
  const pad = 4;
  const pts: string[] = [];
  for (let d = 0; d <= 360; d += 2) {
    const x = pad + (d / 360) * (width - pad * 2);
    const y = height - pad - (energyAt(d) / maxEnergy) * (height - pad * 2);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const cx = pad + ((((current % 360) + 360) % 360) / 360) * (width - pad * 2);
  const cy =
    height - pad - (energyAt(current) / maxEnergy) * (height - pad * 2);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <line
        x1={pad}
        y1={height - pad}
        x2={width - pad}
        y2={height - pad}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
      {markers.map((m) => {
        const x = pad + (m.deg / 360) * (width - pad * 2);
        return (
          <g key={m.deg}>
            <line
              x1={x}
              y1={pad}
              x2={x}
              y2={height - pad}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <text
              x={x}
              y={height + 9}
              textAnchor="middle"
              className="fill-white/35 text-[8px]"
            >
              {m.label}
            </text>
          </g>
        );
      })}
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={1.8}
      />
      <circle cx={cx} cy={cy} r={4} fill="#fbbf24" />
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={height - pad}
        stroke="#fbbf24"
        strokeWidth={1}
        strokeDasharray="2 2"
      />
    </svg>
  );
}

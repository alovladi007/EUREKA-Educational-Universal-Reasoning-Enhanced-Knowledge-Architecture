'use client';

/**
 * Johnstone's triangle, as three linked panes.
 *
 * Johnstone, A. H. (1991), "Why is science difficult to learn? Things are
 * seldom what they seem", Journal of Computer Assisted Learning 7(2). His
 * argument is that chemistry is taught by moving constantly between three
 * representations -- what you can see, what the particles are doing, and what
 * gets written down -- without ever announcing which one is in play, and that
 * novices lose the thread because the switches are invisible.
 *
 * The usual response is to mention the triangle once and carry on. This shows
 * all three at the same time for the same node, and puts the CONNECTOR
 * underneath: the one quantity or object that is identical across all three.
 * That sentence is the load-bearing part of every view in OCTET's collection,
 * and it is the part a learner cannot reconstruct alone.
 *
 * The particulate pane carries the author's `caption`. Those captions were
 * written when the system had no artwork at all, as prose descriptions of a
 * picture that did not exist -- which makes them, read the other way round, a
 * specification for the scene beside them.
 */

import { useMemo, useState } from 'react';
import { Eye, FlaskConical, Link2, PenLine } from 'lucide-react';

import type { TriangleView } from './contentTypes';
import { TRIANGLE_REVIEW_STATUS, TRIANGLE_VIEWS } from './chemContent';
import { NodeBadge, PanelTitle } from './ui';

const LEVELS = [
  {
    key: 'macroscopic' as const,
    label: 'Macroscopic',
    sub: 'what you could observe',
    icon: FlaskConical,
    accent: 'text-amber-300',
    ring: 'ring-amber-400/25',
    bg: 'bg-amber-950/20',
  },
  {
    key: 'particulate' as const,
    label: 'Particulate',
    sub: 'what the particles are doing',
    icon: Eye,
    accent: 'text-sky-300',
    ring: 'ring-sky-400/25',
    bg: 'bg-sky-950/20',
  },
  {
    key: 'symbolic' as const,
    label: 'Symbolic',
    sub: 'what gets written down',
    icon: PenLine,
    accent: 'text-violet-300',
    ring: 'ring-violet-400/25',
    bg: 'bg-violet-950/20',
  },
];

/** Views for one course prefix, e.g. 'ORG' matches ORG1 and ORG2. */
export function triangleViewsFor(prefixes: string[]): TriangleView[] {
  return TRIANGLE_VIEWS.filter((v) =>
    prefixes.some((p) => v.course.startsWith(p)),
  );
}

export function TrianglePanel({ view }: { view: TriangleView }) {
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-bold leading-tight">{view.title}</h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          <NodeBadge code={view.node} />
        </div>
      </div>

      {/* The three levels. Clicking one dims the others, which is the point:
          a learner should be able to ask "which level am I on right now". */}
      <div className="space-y-2">
        {LEVELS.map((lvl) => {
          const Icon = lvl.icon;
          const dimmed = focus !== null && focus !== lvl.key;
          return (
            <button
              key={lvl.key}
              type="button"
              onClick={() => setFocus(focus === lvl.key ? null : lvl.key)}
              aria-pressed={focus === lvl.key}
              className={`w-full rounded-lg p-3 text-left ring-1 transition-all ${lvl.bg} ${lvl.ring} ${
                dimmed ? 'opacity-35' : 'opacity-100'
              }`}
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 ${lvl.accent}`} />
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${lvl.accent}`}>
                  {lvl.label}
                </span>
                <span className="text-[10px] text-white/35">{lvl.sub}</span>
              </div>
              <p className="text-xs leading-relaxed text-white/85">
                {view[lvl.key]}
              </p>

              {/* The symbolic pane shows the notation the course writes. */}
              {lvl.key === 'symbolic' && view.katex && (
                <p className="mt-2 rounded bg-black/40 px-2 py-1 font-mono text-[11px] text-violet-200">
                  {view.katex}
                </p>
              )}

              {/* The particulate pane carries the scene description. */}
              {lvl.key === 'particulate' && view.caption && (
                <div className="mt-2 rounded border-l-2 border-sky-400/40 bg-black/25 py-1.5 pl-2.5 pr-2">
                  <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-sky-400/70">
                    the picture
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/70">
                    {view.caption}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* The connector: the whole reason for showing three panes at once. */}
      <div className="rounded-lg border border-emerald-400/30 bg-emerald-950/25 p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <Link2 className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            The same thing in all three
          </span>
        </div>
        <p className="text-xs leading-relaxed text-emerald-100/90">
          {view.connector}
        </p>
      </div>

      <div className="rounded-lg border border-amber-400/25 bg-amber-950/20 p-3">
        <PanelTitle>Where this goes wrong</PanelTitle>
        <p className="text-[11px] leading-relaxed text-amber-200/85">
          {view.pitfall}
        </p>
      </div>

      <p className="text-[10px] leading-relaxed text-white/35">
        Johnstone, A. H. (1991), Journal of Computer Assisted Learning 7(2).
        Expert review of these views is {TRIANGLE_REVIEW_STATUS}, so nothing
        here is presented as expert-verified.
      </p>
    </div>
  );
}

/** The picker for a course's triangle views. */
export function TriangleList({
  views,
  selected,
  onSelect,
}: {
  views: TriangleView[];
  selected: string;
  onSelect: (node: string) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, TriangleView[]>();
    views.forEach((v) => {
      const arr = map.get(v.course) ?? [];
      arr.push(v);
      map.set(v.course, arr);
    });
    return [...map.entries()].sort();
  }, [views]);

  return (
    <div className="space-y-3">
      {grouped.map(([course, list]) => (
        <div key={course}>
          <PanelTitle>{course}</PanelTitle>
          <div className="flex flex-col gap-1">
            {list.map((v) => (
              <button
                key={v.node}
                type="button"
                onClick={() => onSelect(v.node)}
                className={`rounded px-2.5 py-1.5 text-left transition-colors ${
                  v.node === selected ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-semibold leading-tight">
                  {v.title}
                </div>
                <div className="font-mono text-[9px] text-white/50">
                  {v.node.split('.')[1]}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

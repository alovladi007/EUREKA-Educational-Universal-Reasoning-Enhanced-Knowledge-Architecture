'use client';

// The curriculum map: the skill DAG, drawn.
//
// AXIOM has carried a full knowledge graph (nodes + prerequisite edges)
// since P1, and until now there was no way to SEE it — the graph existed
// only as JSON behind /curriculum/graph and as the invisible machinery of
// the path planner. This page renders it as a layered DAG:
//
//   - columns = prerequisite depth (Kahn layering), so an edge always flows
//     left -> right and a learner can read the page as "what unlocks what";
//   - node color = MY mastery of that node (gray = never practiced), so the
//     map doubles as a personal progress chart over the whole curriculum;
//   - click a node for its details and my mastery evidence link.
//
// Rendering is plain SVG with wheel-zoom + drag-pan — no graph library.

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchGraph,
  fetchMasteryMe,
  getToken,
  type CurriculumGraph,
  type GraphNode,
  type MasteryStateRow,
} from '@/lib/api';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

interface PlacedNode {
  node: GraphNode;
  x: number;
  y: number;
  layer: number;
}

const NODE_R = 9;
const COL_W = 150;
const ROW_H = 34;
const PAD = 40;

// Kahn layering: a node's layer is 1 + max(layer of its prerequisites).
// Cycles shouldn't exist in a prerequisite DAG; if one ever does, the
// leftover nodes are appended in a final layer rather than dropped, so the
// map never silently hides content.
function layerGraph(graph: CurriculumGraph): Map<string, number> {
  const layer = new Map<string, number>();
  const indeg = new Map<string, number>();
  const out = new Map<string, string[]>();
  for (const n of graph.nodes) {
    indeg.set(n.id, 0);
    out.set(n.id, []);
  }
  for (const e of graph.edges) {
    if (!indeg.has(e.from_id) || !indeg.has(e.to_id)) continue;
    indeg.set(e.to_id, (indeg.get(e.to_id) ?? 0) + 1);
    out.get(e.from_id)!.push(e.to_id);
  }
  const queue: string[] = [];
  for (const [id, d] of indeg) {
    if (d === 0) {
      queue.push(id);
      layer.set(id, 0);
    }
  }
  while (queue.length > 0) {
    const id = queue.shift()!;
    for (const next of out.get(id) ?? []) {
      layer.set(next, Math.max(layer.get(next) ?? 0, (layer.get(id) ?? 0) + 1));
      indeg.set(next, (indeg.get(next) ?? 1) - 1);
      if (indeg.get(next) === 0) queue.push(next);
    }
  }
  const maxLayer = Math.max(0, ...layer.values());
  for (const n of graph.nodes) {
    if (!layer.has(n.id)) layer.set(n.id, maxLayer + 1);
  }
  return layer;
}

function masteryClass(p: number | undefined): string {
  if (p === undefined) return 'fill-muted stroke-border';
  if (p >= 0.85) return 'fill-emerald-500 stroke-emerald-600';
  if (p >= 0.5) return 'fill-amber-400 stroke-amber-500';
  return 'fill-red-400 stroke-red-500';
}

export default function CurriculumMapPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [graph, setGraph] = useState<CurriculumGraph | null>(null);
  const [mastery, setMastery] = useState<Map<string, MasteryStateRow>>(new Map());
  const [selected, setSelected] = useState<GraphNode | null>(null);

  // Pan/zoom as a plain SVG transform.
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const dragRef = useRef<{ startX: number; startY: number; vx: number; vy: number } | null>(null);

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const [graphRes, masteryRes] = await Promise.all([
          fetchGraph(),
          fetchMasteryMe(),
        ]);
        if (cancelled) return;
        setGraph(graphRes);
        setMastery(new Map(masteryRes.states.map((s) => [s.node_id, s])));
        setState('ready');
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load the curriculum map.',
        );
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const placed = useMemo<{ nodes: PlacedNode[]; byId: Map<string, PlacedNode>; width: number; height: number }>(() => {
    if (!graph) return { nodes: [], byId: new Map(), width: 800, height: 400 };
    const layers = layerGraph(graph);
    const byLayer = new Map<number, GraphNode[]>();
    for (const n of graph.nodes) {
      const l = layers.get(n.id) ?? 0;
      if (!byLayer.has(l)) byLayer.set(l, []);
      byLayer.get(l)!.push(n);
    }
    // Stable vertical order inside a layer: tier first, then code — keeps
    // related material adjacent and the layout deterministic across loads.
    for (const nodes of byLayer.values()) {
      nodes.sort((a, b) => a.tier - b.tier || a.code.localeCompare(b.code));
    }
    const nodes: PlacedNode[] = [];
    const byId = new Map<string, PlacedNode>();
    let maxRows = 0;
    const layerKeys = [...byLayer.keys()].sort((a, b) => a - b);
    for (const l of layerKeys) {
      const column = byLayer.get(l)!;
      maxRows = Math.max(maxRows, column.length);
      column.forEach((node, row) => {
        const pn: PlacedNode = {
          node,
          layer: l,
          x: PAD + l * COL_W,
          y: PAD + row * ROW_H,
        };
        nodes.push(pn);
        byId.set(node.id, pn);
      });
    }
    return {
      nodes,
      byId,
      width: PAD * 2 + Math.max(1, layerKeys.length) * COL_W,
      height: PAD * 2 + Math.max(1, maxRows) * ROW_H,
    };
  }, [graph]);

  const selectedMastery = selected ? mastery.get(selected.id) : undefined;
  const prereqCount = useMemo(() => {
    if (!graph || !selected) return 0;
    return graph.edges.filter((e) => e.to_id === selected.id).length;
  }, [graph, selected]);
  const unlocksCount = useMemo(() => {
    if (!graph || !selected) return 0;
    return graph.edges.filter((e) => e.from_id === selected.id).length;
  }, [graph, selected]);

  if (state === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading AXIOM.</p>
      </main>
    );
  }
  if (state === 'signed-out') {
    return <SignInScreen />;
  }

  const practiced = mastery.size;
  const masteredCount = [...mastery.values()].filter((s) => s.p_known >= 0.85).length;

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Curriculum map</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The whole skill graph, laid out by prerequisite depth. Colors show
          your mastery; gray nodes you haven&apos;t practiced yet. Scroll to
          zoom, drag to pan, click a node for details.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">Loading the graph.</p>
        )}
        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && graph && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span>
                {graph.nodes.length} skills · {graph.edges.length} prerequisite
                links · {practiced} practiced · {masteredCount} mastered
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5"><circle cx="5" cy="5" r="5" className="fill-emerald-500" /></svg>
                mastered (≥85%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5"><circle cx="5" cy="5" r="5" className="fill-amber-400" /></svg>
                developing
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5"><circle cx="5" cy="5" r="5" className="fill-red-400" /></svg>
                struggling (&lt;50%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5"><circle cx="5" cy="5" r="5" className="fill-muted stroke-border" strokeWidth="1" /></svg>
                not practiced
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div
                className="overflow-hidden rounded-lg border border-border bg-card"
                style={{ height: 520 }}
              >
                <svg
                  className="h-full w-full cursor-grab active:cursor-grabbing"
                  role="img"
                  aria-label="Curriculum skill graph"
                  onWheel={(e) => {
                    const k = Math.max(0.3, Math.min(3, view.k * (e.deltaY < 0 ? 1.12 : 0.9)));
                    setView((v) => ({ ...v, k }));
                  }}
                  onMouseDown={(e) => {
                    dragRef.current = {
                      startX: e.clientX,
                      startY: e.clientY,
                      vx: view.x,
                      vy: view.y,
                    };
                  }}
                  onMouseMove={(e) => {
                    const d = dragRef.current;
                    if (!d) return;
                    setView((v) => ({
                      ...v,
                      x: d.vx + (e.clientX - d.startX),
                      y: d.vy + (e.clientY - d.startY),
                    }));
                  }}
                  onMouseUp={() => (dragRef.current = null)}
                  onMouseLeave={() => (dragRef.current = null)}
                >
                  <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
                    {graph.edges.map((e, i) => {
                      const a = placed.byId.get(e.from_id);
                      const b = placed.byId.get(e.to_id);
                      if (!a || !b) return null;
                      const midX = (a.x + b.x) / 2;
                      return (
                        <path
                          key={i}
                          d={`M${a.x + NODE_R},${a.y} C${midX},${a.y} ${midX},${b.y} ${b.x - NODE_R},${b.y}`}
                          className={
                            selected && (e.from_id === selected.id || e.to_id === selected.id)
                              ? 'stroke-brand-500'
                              : 'stroke-border'
                          }
                          strokeWidth={selected && (e.from_id === selected.id || e.to_id === selected.id) ? 1.6 : 0.8}
                          fill="none"
                        />
                      );
                    })}
                    {placed.nodes.map((pn) => {
                      const m = mastery.get(pn.node.id);
                      const isSelected = selected?.id === pn.node.id;
                      return (
                        <g
                          key={pn.node.id}
                          transform={`translate(${pn.x},${pn.y})`}
                          className="cursor-pointer"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => setSelected(pn.node)}
                        >
                          <circle
                            r={isSelected ? NODE_R + 3 : NODE_R}
                            className={masteryClass(m?.p_known)}
                            strokeWidth={isSelected ? 2.5 : 1}
                          >
                            <title>
                              {`${pn.node.code} — ${pn.node.title}${m ? ` — mastery ${Math.round(m.p_known * 100)}%` : ' — not practiced'}`}
                            </title>
                          </circle>
                          <text
                            x={NODE_R + 4}
                            y={3.5}
                            fontSize={9}
                            className="fill-current text-muted-foreground"
                          >
                            {pn.node.code}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>

              <aside className="rounded-lg border border-border bg-card p-4">
                {selected ? (
                  <div className="space-y-3">
                    <div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {selected.code}
                      </span>
                      <h2 className="text-sm font-semibold text-card-foreground">
                        {selected.title}
                      </h2>
                    </div>
                    {selected.description && (
                      <p className="text-xs text-muted-foreground">
                        {selected.description}
                      </p>
                    )}
                    <dl className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Kind</dt>
                        <dd className="text-card-foreground">{selected.kind}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Tier</dt>
                        <dd className="text-card-foreground">{selected.tier ?? '\u2014'}</dd>
                      </div>
                      {selected.track && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Track</dt>
                          <dd className="text-card-foreground">{selected.track}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Prerequisites</dt>
                        <dd className="text-card-foreground">{prereqCount}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Unlocks</dt>
                        <dd className="text-card-foreground">{unlocksCount}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">My mastery</dt>
                        <dd className="font-semibold text-card-foreground">
                          {selectedMastery
                            ? `${Math.round(selectedMastery.p_known * 100)}% (${selectedMastery.level})`
                            : 'not practiced'}
                        </dd>
                      </div>
                    </dl>
                    <a
                      href={`/practice?node=${encodeURIComponent(selected.code)}`}
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Practice this skill
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Click any node to see its details, prerequisites, and your
                    mastery.
                  </p>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}

'use client';

import { Mafs, Coordinates, Point, Line, Plot, useMovablePoint } from 'mafs';
import 'mafs/core.css';
import { useEffect, useState } from 'react';
import { compileExpression } from '@/lib/mathEval';

// Interactive coordinate-plane inputs built on Mafs, used by the graphing item
// kinds. Each reports its answer as a JSON string in the exact shape the grader
// expects:
//   PointPlotter  -> plot_points  -> "[[x,y],...]" (unordered set of points)
//   LineDrawer    -> draw_line    -> "[[x1,y1],[x2,y2]]" (two points on a line)
//   FunctionGraph -> plot_function preview (display only; the answer is the
//                    expression typed in the MathLive editor, CAS-graded)
//
// The plane spans -10..10 on both axes and snaps interactions to integer
// coordinates, which is what the seeded and authored graphing items assume.

const VIEW_BOX = { x: [-10, 10] as [number, number], y: [-10, 10] as [number, number] };

function snap(value: number): number {
  return Math.max(-10, Math.min(10, Math.round(value)));
}

function snapPoint(pt: readonly [number, number]): [number, number] {
  return [snap(pt[0]), snap(pt[1])];
}

// A wrapper that gives the plane a stable height and a light border.
function PlaneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-background"
      style={{ height: 340 }}
    >
      {children}
    </div>
  );
}

// plot_points: click empty space to add an integer point, click a point to
// remove it. Reports the current set as "[[x,y],...]".
export function PointPlotter({
  readOnly = false,
  onChange,
}: {
  readOnly?: boolean;
  onChange?: (payload: string) => void;
}) {
  const [points, setPoints] = useState<[number, number][]>([]);

  function emit(next: [number, number][]) {
    setPoints(next);
    onChange?.(JSON.stringify(next));
  }

  function handleClick(p: [number, number]) {
    if (readOnly) {
      return;
    }
    const [x, y] = snapPoint(p);
    const existing = points.findIndex((pt) => pt[0] === x && pt[1] === y);
    if (existing >= 0) {
      emit(points.filter((_, i) => i !== existing));
    } else {
      emit([...points, [x, y]]);
    }
  }

  return (
    <div>
      <PlaneFrame>
        <Mafs viewBox={VIEW_BOX} onClick={readOnly ? undefined : handleClick}>
          <Coordinates.Cartesian />
          {points.map((pt, i) => (
            <Point key={`${pt[0]},${pt[1]},${i}`} x={pt[0]} y={pt[1]} />
          ))}
        </Mafs>
      </PlaneFrame>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Click to place a point; click a point to remove it.
        </p>
        {!readOnly && points.length > 0 && (
          <button
            type="button"
            onClick={() => emit([])}
            className="rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// draw_line: two draggable points define a line. Reports "[[x1,y1],[x2,y2]]".
export function LineDrawer({
  readOnly = false,
  onChange,
}: {
  readOnly?: boolean;
  onChange?: (payload: string) => void;
}) {
  const p1 = useMovablePoint([-3, -1]);
  const p2 = useMovablePoint([3, 2]);

  const a = snapPoint(p1.point);
  const b = snapPoint(p2.point);

  useEffect(() => {
    onChange?.(JSON.stringify([a, b]));
    // Only re-emit when the snapped coordinates change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a[0], a[1], b[0], b[1]]);

  return (
    <div>
      <PlaneFrame>
        <Mafs viewBox={VIEW_BOX}>
          <Coordinates.Cartesian />
          <Line.ThroughPoints point1={p1.point} point2={p2.point} />
          {!readOnly && p1.element}
          {!readOnly && p2.element}
          {readOnly && <Point x={a[0]} y={a[1]} />}
          {readOnly && <Point x={b[0]} y={b[1]} />}
        </Mafs>
      </PlaneFrame>
      <p className="mt-2 text-xs text-muted-foreground">
        Drag the two points to position your line. Snaps to whole numbers:
        currently through ({a[0]}, {a[1]}) and ({b[0]}, {b[1]}).
      </p>
    </div>
  );
}

// plot_function preview: renders the curve for a typed expression. Display only.
export function FunctionGraph({ expression }: { expression: string }) {
  const fn = compileExpression(expression);
  return (
    <PlaneFrame>
      <Mafs viewBox={VIEW_BOX}>
        <Coordinates.Cartesian />
        {fn && <Plot.OfX y={fn} />}
      </Mafs>
    </PlaneFrame>
  );
}

// A single mode-switching entry point, so callers can dynamic-import one thing
// with ssr:false (Mafs is a browser-only library).
export default function GraphInput({
  mode,
  readOnly,
  onChange,
  expression,
}: {
  mode: 'points' | 'line' | 'function';
  readOnly?: boolean;
  onChange?: (payload: string) => void;
  expression?: string;
}) {
  if (mode === 'points') {
    return <PointPlotter readOnly={readOnly} onChange={onChange} />;
  }
  if (mode === 'line') {
    return <LineDrawer readOnly={readOnly} onChange={onChange} />;
  }
  return <FunctionGraph expression={expression ?? ''} />;
}

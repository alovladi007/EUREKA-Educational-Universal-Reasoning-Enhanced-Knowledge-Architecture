'use client';

import { useEffect, useState } from 'react';
import {
  TriangleView as TriangleViewData,
  getTriangle,
  getTriangleIndex,
} from '@/lib/api';
import { TriangleView } from '@/components';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  SectionTitle,
  errorMessage,
} from '@/app/_ui/shell';

// The Johnstone triangle surface.
//
// The three panels are three descriptions of one event. The field that does the
// teaching is connector: it names the one thing that is identical across all
// three levels. Without it the page is three panels side by side, which is the
// exact failure the triangle exists to prevent. So connector is given its own
// block rather than being tucked into a caption, and pitfall sits with it,
// because that is where the level confusion actually shows up.

interface TriangleIndex {
  nodes: string[];
  count: number;
  review: string;
}

export default function TrianglePage() {
  const [index, setIndex] = useState<TriangleIndex | null>(null);
  const [indexLoading, setIndexLoading] = useState(true);
  const [indexError, setIndexError] = useState<string | null>(null);

  const [node, setNode] = useState<string>('');
  const [view, setView] = useState<TriangleViewData | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getTriangleIndex();
        if (!cancelled) {
          setIndex(result);
          setNode(result.nodes[0] ?? '');
        }
      } catch (err) {
        if (!cancelled) {
          setIndexError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setIndexLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!node) {
      setView(null);
      return;
    }
    let cancelled = false;
    setViewLoading(true);
    setView(null);
    setViewError(null);
    (async () => {
      try {
        const found = await getTriangle(node);
        if (!cancelled) {
          setView(found);
        }
      } catch (err) {
        if (!cancelled) {
          setViewError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setViewLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [node]);

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        Chemistry triangle
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        What you see, what the particles do, and what chemists write. Three
        views of one thing, not three topics.
      </p>

      {indexLoading && <LoadingPanel label="Loading the covered nodes." />}
      {!indexLoading && indexError && <ErrorPanel message={indexError} />}

      {!indexLoading && !indexError && index && index.nodes.length === 0 && (
        <EmptyState
          title="No triangle views yet"
          detail="The triangle index returned no covered nodes, so there is nothing to show."
        />
      )}

      {!indexLoading && !indexError && index && index.nodes.length > 0 && (
        <div className="space-y-6">
          <Card>
            <SectionTitle>Covered nodes</SectionTitle>
            <p className="mb-3 text-sm text-muted-foreground">
              {index.count} {index.count === 1 ? 'node has' : 'nodes have'} a
              triangle view. Every other node in the curriculum has none, and
              none is invented here.
            </p>
            <div className="flex flex-wrap gap-2">
              {index.nodes.map((code) => {
                const active = code === node;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setNode(code)}
                    aria-pressed={active}
                    className={[
                      'rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-brand-500',
                      active
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-border text-foreground hover:border-brand-500',
                    ].join(' ')}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </Card>

          {viewLoading && <LoadingPanel label="Loading the triangle view." />}
          {!viewLoading && viewError && <ErrorPanel message={viewError} />}
          {!viewLoading && !viewError && view && <TriangleDetail view={view} />}
        </div>
      )}
    </Page>
  );
}

function TriangleDetail({ view }: { view: TriangleViewData }) {
  const pending = view.review.toLowerCase() === 'pending';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="neutral">{view.node}</Pill>
        <Pill tone={pending ? 'amber' : 'neutral'}>review: {view.review}</Pill>
      </div>

      {/* The connector, first and unmissable. It is the one sentence that turns
          three panels into one account. */}
      <Card className="border-brand-500">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
          The connector
        </p>
        <p className="text-[17px] font-medium leading-relaxed text-card-foreground">
          {view.connector}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          This names the one thing that is identical across all three panels
          below. Read it first, then check that you can find it in each one.
        </p>
      </Card>

      <Card>
        <TriangleView
          nodeTitle={view.title}
          macroscopic={{ caption: view.macroscopic }}
          particulate={{ caption: view.particulate }}
          symbolic={{ caption: view.symbolic, equation: view.katex }}
        />
      </Card>

      {view.caption && (
        <Card>
          <SectionTitle>The particulate picture in words</SectionTitle>
          <p className="text-[15px] leading-relaxed text-card-foreground">
            {view.caption}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            There is no artwork in this system, so this sentence is what
            completes the particulate corner. No diagram is drawn in its place,
            because an invented diagram would teach an invented model.
          </p>
        </Card>
      )}

      <Card className="border-amber-400 dark:border-amber-600">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
          The pitfall
        </p>
        <p className="text-[15px] leading-relaxed text-card-foreground">
          {view.pitfall}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          This is the level confusion learners actually fall into at this node.
          It is here because naming it is more useful than warning about it in
          general terms.
        </p>
      </Card>
    </div>
  );
}

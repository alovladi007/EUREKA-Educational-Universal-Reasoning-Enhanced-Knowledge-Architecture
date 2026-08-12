'use client';

import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Layers,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { fetchGraph, getToken, type GraphNode } from '@/lib/api';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';
import {
  Card,
  EmptyState,
  Entry,
  LoadingPanel,
  PageHeading,
  Stat,
  Tag,
} from '@/components/ui';
import { groupCurriculum } from '@/lib/curriculum-groups';

// The chapter index.
//
// This page used to be half of a split pane: skill tree on the left, the
// selected lesson rendered inline on the right. That put a 5,000-word chapter
// into a column beside a scrolling tree, which is why the reading was
// unreadable regardless of how it was styled. The chapter now has its own
// route (/learn/[node]) with a rail, a book column and a companion, matching
// the prep test course reader, and this page is what it always should have
// been: a way to find one.
//
// Every count on this page is measured from the graph the API returns. There
// are no coverage percentages here, because a percentage needs a denominator
// that means something and "chapters we intend to write" is not one.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

const READ_KEY = 'axiom:chapters-read';

export default function LearnPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [read, setRead] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');

  useEffect(() => {
    try {
      const rawRead = window.localStorage.getItem(READ_KEY);
      if (rawRead) {
        setRead(new Set(JSON.parse(rawRead) as string[]));
      }
    } catch {
      // No read state. The page works without it.
    }

    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const graph = await fetchGraph();
        if (cancelled) {
          return;
        }
        setNodes(graph.nodes);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load the curriculum.',
        );
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sections = useMemo(() => groupCurriculum(nodes), [nodes]);

  const needle = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!needle) {
      return [] as GraphNode[];
    }
    return nodes.filter(
      (n) =>
        n.title.toLowerCase().includes(needle) ||
        n.code.toLowerCase().includes(needle) ||
        (n.description ?? '').toLowerCase().includes(needle),
    );
  }, [nodes, needle]);

  // Which nodes are whole-course entry points is decided by
  // lib/curriculum-groups.ts, which claims them by CODE. It is NOT the API's
  // `kind` field - that is the pedagogy taxonomy (concept /
  // computational_skill / proof_technique) and has no "overview" value at all,
  // so testing kind === 'overview' reported 0 courses on a page listing 11.
  const overviewCodes = useMemo(
    () => new Set(sections.flatMap((s) => s.overviews.map((n) => n.code))),
    [sections],
  );
  const courseCount = overviewCodes.size;
  const readCount = nodes.filter((n) => read.has(n.code)).length;

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

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHeading
          title="Learn"
          lead="Every chapter in the mathematics ladder, grouped by subject. Each one opens as a full written course with worked examples, pitfalls and a self-test."
        />

        {state === 'loading' && <LoadingPanel label="Loading the curriculum." />}
        {state === 'error' && <ErrorPanel message={errorMessage} />}

        {state === 'ready' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat
                icon={<Layers className="h-3.5 w-3.5" />}
                label="Subjects"
                value={String(sections.length)}
                hint="Foundations through graduate topics."
              />
              <Stat
                icon={<BookOpen className="h-3.5 w-3.5" />}
                label="Chapters"
                value={String(nodes.length)}
                hint="Every node carries a written chapter."
              />
              <Stat
                icon={<GraduationCap className="h-3.5 w-3.5" />}
                label="Course overviews"
                value={String(courseCount)}
                hint="The whole-course entry points."
              />
              <Stat
                icon={<ChevronRight className="h-3.5 w-3.5" />}
                label="Marked read"
                value={readCount > 0 ? String(readCount) : '—'}
                hint={
                  readCount > 0
                    ? 'Kept in this browser, not on the server.'
                    : 'Nothing marked read in this browser yet.'
                }
              />
            </div>

            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <span className="sr-only">Search chapters</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chapters by title, code or description"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </label>

            {needle ? (
              matches.length === 0 ? (
                <EmptyState
                  title="No chapter matches that"
                  detail={`Nothing in the ${nodes.length} chapters has "${query.trim()}" in its title, code or description.`}
                />
              ) : (
                <section>
                  <h2 className="mb-2.5 text-sm font-semibold text-foreground">
                    {matches.length} match{matches.length === 1 ? '' : 'es'}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {matches.map((n) => (
                      <ChapterCard
                        key={n.id}
                        node={n}
                        read={read.has(n.code)}
                        isCourse={overviewCodes.has(n.code)}
                      />
                    ))}
                  </div>
                </section>
              )
            ) : (
              <div className="space-y-3">
                {sections.map(({ group, overviews, skills }) => {
                  const all = [...overviews, ...skills];
                  const doneHere = all.filter((n) => read.has(n.code)).length;
                  return (
                    <details
                      key={group.key}
                      className="group rounded-xl border border-border bg-card/40"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 [&::-webkit-details-marker]:hidden">
                        <span className="flex min-w-0 items-start gap-2.5">
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground">
                              {group.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                              {group.blurb}
                            </span>
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          {doneHere > 0 && (
                            <span className="font-mono text-[11px] tabular-nums text-emerald-600 dark:text-emerald-400">
                              {doneHere} read
                            </span>
                          )}
                          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                            {all.length}
                          </span>
                        </span>
                      </summary>
                      <div className="border-t border-border px-4 py-4">
                        {all.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No chapters have been published in this subject yet.
                          </p>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {all.map((n) => (
                              <ChapterCard
                                key={n.id}
                                node={n}
                                read={read.has(n.code)}
                                isCourse={overviewCodes.has(n.code)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            )}

            <Card className="p-4">
              <h2 className="text-sm font-semibold text-foreground">
                What a chapter contains
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Numbered sections of prose with the mathematics set inline,
                worked examples, the misconceptions this topic actually
                produces, and a self-test with solutions. Graded questions are
                not on the page: they are served and marked on the server
                through Practice, so the answer key never reaches the browser
                before you submit.
              </p>
            </Card>
          </div>
        )}
      </main>
    </AppShell>
  );
}

function ChapterCard({
  node,
  read,
  isCourse,
}: {
  node: GraphNode;
  read: boolean;
  isCourse: boolean;
}) {
  return (
    <Entry
      href={`/learn/${encodeURIComponent(node.code)}`}
      icon={
        isCourse ? (
          <GraduationCap className="h-4 w-4" />
        ) : (
          <BookOpen className="h-4 w-4" />
        )
      }
      title={node.title}
      body={node.description ?? 'No description was written for this chapter.'}
      accent={isCourse}
      foot={
        <>
          <Tag>{node.code}</Tag>
          {isCourse && <Tag tone="brand">course</Tag>}
          {read && (
            <span className="rounded bg-emerald-500/12 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              read
            </span>
          )}
        </>
      }
    />
  );
}

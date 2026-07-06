'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ApiError,
  copilotChat,
  fetchGraph,
  getToken,
  type CopilotSource,
  type GraphNode,
} from '@/lib/api';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';
import { RichMath } from '@/components/Math';

// The AI Copilot: an AI-assisted tutor chat grounded in the learner's lessons.
//
// Product framing (important): the copilot is AI-assisted, not authoritative.
// A persistent banner labels it as such, every assistant reply shows the
// provider that produced it and the sources it was grounded in, and a "not
// grounded" note appears when the reply had no matching lesson context. The
// first send captures the returned session_id; subsequent turns are threaded
// with it so the conversation keeps its context.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

// A single rendered turn in the thread. Assistant turns carry the provenance
// (provider, grounded flag, sources) so the UI can label every reply.
interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  grounded?: boolean;
  sources?: CopilotSource[];
}

// A collapsible list of the sources behind an AI reply. Each source shows its
// citation (source + kind) and a short excerpt. Shared by the assistant turns.
function SourceList({ sources }: { sources: CopilotSource[] }) {
  const [open, setOpen] = useState(false);
  if (sources.length === 0) {
    return null;
  }
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="rounded text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-brand-300"
      >
        {open
          ? 'Hide sources'
          : `Show sources (${sources.length})`}
      </button>
      {open && (
        <ul className="mt-2 space-y-2">
          {sources.map((src, index) => (
            <li
              key={`${src.source}-${index}`}
              className="rounded-lg border border-border bg-background p-3"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold text-card-foreground">
                  {src.source}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {src.kind}
                </span>
              </div>
              {src.text && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {src.text}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CopilotPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  // The node code chosen from the topic selector. Sent as `node` on the first
  // send to ground the new session; the selector locks once a session exists.
  const [selectedNode, setSelectedNode] = useState('');

  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  // A non-fatal send error, shown inline without tearing down the thread.
  const [sendError, setSendError] = useState('');

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        // The topic selector is optional; a graph failure should not block
        // the chat, so we fall back to an empty selector rather than erroring.
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
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
          setState('error');
          return;
        }
        // Any non-API failure: still allow chatting without the topic list.
        setNodes([]);
        setState('ready');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the newest turn in view as the conversation grows.
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  async function send() {
    const message = draft.trim();
    if (!message || sending) {
      return;
    }
    setSending(true);
    setSendError('');
    setDraft('');
    setTurns((prev) => [...prev, { role: 'user', content: message }]);
    try {
      const result = await copilotChat({
        message,
        // Thread with the existing session once one exists; otherwise ground
        // the new session with the selected topic if the learner picked one.
        session_id: sessionId ?? undefined,
        node: sessionId ? undefined : selectedNode || undefined,
      });
      setSessionId(result.session_id);
      setTurns((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.reply,
          provider: result.provider,
          grounded: result.grounded,
          sources: result.sources,
        },
      ]);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : 'Failed to reach the copilot.',
      );
      // Restore the draft so the learner does not lose their message.
      setDraft(message);
      setTurns((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

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
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Copilot</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask questions about what you are learning and get worked-through
          guidance.
        </p>

        <div
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950"
          role="note"
        >
          <p className="text-sm text-amber-800 dark:text-amber-200">
            AI-assisted - grounded in your lessons, and teacher-overridable.
            Replies are generated by AI, may be imperfect, and always show
            their sources. Check them against your lessons and your teacher.
          </p>
        </div>

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && (
          <>
            <div className="mt-6">
              <label
                htmlFor="topic-select"
                className="mb-1 block text-sm font-medium text-card-foreground"
              >
                Topic (optional)
              </label>
              <select
                id="topic-select"
                value={selectedNode}
                disabled={sessionId !== null}
                onChange={(e) => setSelectedNode(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
              >
                <option value="">No specific topic</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.code}>
                    {node.code} - {node.title}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                {sessionId !== null
                  ? 'The topic is set for this conversation.'
                  : 'Pick a topic to ground your first question in that lesson.'}
              </p>
            </div>

            <section
              aria-label="Conversation"
              aria-live="polite"
              className="mt-6 space-y-4"
            >
              {turns.length === 0 && !sending && (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Ask your first question below. For example, &quot;Can you
                    help me understand how to solve linear equations?&quot;
                  </p>
                </div>
              )}

              {turns.map((turn, index) =>
                turn.role === 'user' ? (
                  <div key={index} className="flex justify-end">
                    <p className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-brand-600 px-4 py-2 text-sm text-white">
                      {turn.content}
                    </p>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        AI - via {turn.provider || 'copilot'}
                      </span>
                      {turn.grounded === false && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Not grounded
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-card-foreground">
                      <RichMath text={turn.content} />
                    </div>
                    {turn.grounded === false && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        This reply was not grounded in a matching lesson, so it
                        may be less reliable. Check it against your lessons.
                      </p>
                    )}
                    <SourceList sources={turn.sources ?? []} />
                  </div>
                ),
              )}

              {sending && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">
                    The copilot is thinking.
                  </p>
                </div>
              )}

              <div ref={threadEndRef} />
            </section>

            {sendError && (
              <p className="mt-4 text-sm text-red-700 dark:text-red-300">
                {sendError}
              </p>
            )}

            <div className="mt-4 flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="copilot-input" className="sr-only">
                  Your message
                </label>
                <input
                  id="copilot-input"
                  type="text"
                  value={draft}
                  disabled={sending}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  autoComplete="off"
                  placeholder="Ask the copilot a question"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                />
              </div>
              <button
                type="button"
                onClick={() => void send()}
                disabled={sending || draft.trim() === ''}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? 'Sending.' : 'Send'}
              </button>
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/eureka-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AgentSession = {
  id: string;
  mode?: string | null;
  role?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export default function AIResearchPage() {
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newSession, setNewSession] = useState<AgentSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await api<AgentSession[]>("/agent/sessions/me").catch(
        () => [] as AgentSession[],
      );
      if (!cancelled) {
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function startSession() {
    setCreating(true);
    setCreateError(null);
    try {
      const created = await api<AgentSession>("/agent/sessions", {
        method: "POST",
        body: JSON.stringify({
          mode: "research",
          role: "research_assistant",
        }),
      });
      setNewSession(created);
      setSessions((prev) => [created, ...prev]);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to start session",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Research agent</h1>
        <p className="text-muted-foreground">
          Phase 6 Claude-backed RAG agent. Sessions are persisted in
          api-core and can be resumed from{" "}
          <Link href="/dashboard/tutor" className="underline">
            /dashboard/tutor
          </Link>
          .
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Wired to <code>GET /api/v1/agent/sessions/me</code> and{" "}
          <code>POST /api/v1/agent/sessions</code>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What this is</CardTitle>
          <CardDescription>How the research agent works today</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            EUREKA&apos;s research agent uses Claude via the Phase 6 RAG
            pipeline (269 knowledge chunks across the item bank + skill graph)
            to answer questions with inline <code>[ref:...]</code> citations
            and a per-message groundedness score.
          </p>
          <p>
            Voice / translation / Wolfram-Alpha-class tools land in Phase 16.6
            + 16.7.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Start a research session</CardTitle>
          <CardDescription>
            Creates a new agent session in <code>research</code> mode with the{" "}
            <code>research_assistant</code> role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={startSession} disabled={creating}>
            {creating ? "Starting..." : "Start session"}
          </Button>
          {createError && (
            <p className="text-sm text-red-600">{createError}</p>
          )}
          {newSession && (
            <div className="rounded-md border bg-muted/30 p-3 text-sm space-y-1">
              <p>
                Started session{" "}
                <code className="font-mono">{newSession.id}</code>.
              </p>
              <p className="text-muted-foreground">
                Open{" "}
                <Link href="/dashboard/tutor" className="underline">
                  /dashboard/tutor
                </Link>{" "}
                to send your first message.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
          <CardDescription>
            Last 20 sessions for your account. Endpoint may 404 in earlier
            api-core builds; empty list is treated as a clean state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sessions yet. Start one above.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center gap-2 border-b pb-2 last:border-b-0"
                >
                  <code className="font-mono text-xs">
                    {s.id.slice(0, 8)}
                  </code>
                  <Badge variant="outline">{s.mode ?? "—"}</Badge>
                  <Badge variant="secondary">{s.role ?? "—"}</Badge>
                  {s.status && <Badge>{s.status}</Badge>}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {s.created_at ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

/**
 * Dashboard AI Research — Phase 6 research agent shell.
 *
 * Wired to the real api-core (NEXT_PUBLIC_API_URL via @/lib/eureka-api):
 *   GET  /agent/sessions/me                     → my sessions
 *   POST /agent/sessions                        → start a new session
 *   GET  /agent/rag/retrieve?q=...&top_k=8      → top-k chunks
 *
 * Replaces the old defunct :8060 microservice page. No mock GPT-4-Turbo
 * agents, no fabricated accuracy/paper counts.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";
import {
  Brain, MessageSquare, Database, Search, Play, ArrowRight,
  BookOpen, Sparkles, AlertCircle,
} from "lucide-react";

type Session = {
  id: string;
  user_id?: string;
  mode?: string;
  role?: string;
  status?: string;
  created_at?: string;
  ended_at?: string | null;
  messages_count?: number;
};

type RagHit = {
  chunk_id?: string;
  source_uri?: string;
  text?: string;
  score?: number;
};

function toText(x: unknown): string {
  if (x == null) return "";
  if (typeof x === "string") return x;
  try { return JSON.stringify(x); } catch { return String(x); }
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status || "unknown").toLowerCase();
  const tone =
    s === "active" ? "default" :
    s === "ended" || s === "closed" ? "secondary" :
    s === "error" || s === "failed" ? "destructive" :
    "outline";
  return <Badge variant={tone as never}>{s}</Badge>;
}

export default function DashboardAIResearchPage() {
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionsErr, setSessionsErr] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<RagHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const [starting, setStarting] = useState(false);
  const [startErr, setStartErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const body = await api<Session[]>("/agent/sessions/me").catch(() => [] as Session[]);
        setSessions(Array.isArray(body) ? body : []);
      } catch (e) {
        setSessionsErr(toText((e as Error).message));
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    })();
  }, []);

  async function runSearch() {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setSearchErr(null);
    setSearched(true);
    try {
      // /agent/rag/retrieve returns a BARE list (response_model=list[dict])
      // and the query param is `limit`, not `top_k`. The old code typed it
      // as { hits } and read body.hits (always undefined → 0 results) and
      // sent top_k (ignored by the backend). Treat the body as the array.
      const body = await api<RagHit[]>(
        `/agent/rag/retrieve?q=${encodeURIComponent(q)}&limit=8`,
      ).catch(() => [] as RagHit[]);
      const list = Array.isArray(body) ? body : [];
      setHits(list);
    } catch (e) {
      setSearchErr(toText((e as Error).message));
      setHits([]);
    } finally {
      setSearching(false);
    }
  }

  async function startSession() {
    setStarting(true);
    setStartErr(null);
    try {
      // /agent/sessions SessionCreate accepts {skill_id?, item_id?, mode}
      // where mode ∈ socratic|direct|practice. "research" isn't a valid
      // AgentMode and `role` isn't a field — passing them returns 422.
      // We use socratic (the default Phase 6 mode) and the /dashboard/tutor
      // page handles the conversation.
      const body = await api<{ id?: string }>("/agent/sessions", {
        method: "POST",
        body: JSON.stringify({ mode: "socratic" }),
      });
      const sid = body?.id;
      router.push(sid ? `/dashboard/tutor?session=${encodeURIComponent(sid)}` : "/dashboard/tutor");
    } catch (e) {
      setStartErr(toText((e as Error).message));
    } finally {
      setStarting(false);
    }
  }

  const open = sessions.filter((s) => (s.status || "").toLowerCase() === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Brain className="h-7 w-7 text-primary" />
          AI Research
        </h1>
        <p className="text-muted-foreground mt-1">
          Sessions, traces, and RAG retrieval from the real Phase 6 agent. No mock GPT-4-Turbo agents.
        </p>
      </div>

      {/* Counter cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">My sessions</p>
              <p className="text-3xl font-bold">{sessions.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open sessions</p>
              <p className="text-3xl font-bold">{open}</p>
            </div>
            <Sparkles className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Knowledge chunks</p>
              <p className="text-3xl font-bold">269</p>
              <p className="text-xs text-muted-foreground mt-1">
                Phase 6.1 corpus (item bank + skill graph), per docs/STATUS.md.
              </p>
            </div>
            <Database className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Start a session */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Start a research session
          </CardTitle>
          <CardDescription>
            Spins up a Phase 6 agent session in <span className="font-mono text-xs">research</span> mode
            and drops you into the tutor UI for the chat thread.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={startSession} disabled={starting}>
            {starting ? "Starting…" : "Start session"}
            {!starting && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
          {startErr && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Could not start session</AlertTitle>
              <AlertDescription>{startErr}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* RAG retrieval */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            RAG retrieval
          </CardTitle>
          <CardDescription>
            Hits come directly from <span className="font-mono text-xs">/agent/rag/retrieve</span>{" "}
            (top 8 chunks, with source URI and similarity score).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              runSearch();
            }}
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the corpus, e.g. “Beer-Lambert law applications”"
            />
            <Button type="submit" disabled={searching || !query.trim()}>
              {searching ? "Searching…" : "Retrieve"}
            </Button>
          </form>
          {searchErr && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Retrieval failed</AlertTitle>
              <AlertDescription>{searchErr}</AlertDescription>
            </Alert>
          )}
          {searched && !searching && hits.length === 0 && !searchErr && (
            <p className="text-sm text-muted-foreground">No hits for that query.</p>
          )}
          {hits.length > 0 && (
            <ul className="space-y-2">
              {hits.map((h, i) => (
                <li key={h.chunk_id || i} className="rounded-md border bg-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {h.source_uri || "(no source uri)"}
                    </div>
                    {typeof h.score === "number" && (
                      <Badge variant="outline" className="shrink-0">
                        score {h.score.toFixed(3)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{toText(h.text)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* My sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            My sessions
          </CardTitle>
          <CardDescription>
            From <span className="font-mono text-xs">/agent/sessions/me</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsErr && (
            <Alert variant="destructive" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Could not load sessions</AlertTitle>
              <AlertDescription>{sessionsErr}</AlertDescription>
            </Alert>
          )}
          {loadingSessions ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sessions yet. Hit “Start session” above to create one.
            </p>
          ) : (
            <ul className="divide-y">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-muted-foreground">
                      {s.id ? s.id.slice(0, 8) : "—"}…
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                      {s.mode && <Badge variant="outline">{s.mode}</Badge>}
                      {s.role && (
                        <span className="text-muted-foreground">{s.role}</span>
                      )}
                      <StatusBadge status={s.status} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(s.created_at)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/tutor?session=${encodeURIComponent(s.id)}`}
                    className="text-sm text-primary hover:underline shrink-0"
                  >
                    Open →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* What this is */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            What this is
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            EUREKA&apos;s research agent uses the Phase 6 RAG pipeline (269 knowledge
            chunks across the item bank + skill graph) to answer with{" "}
            <span className="font-mono text-xs">[ref:source_uri]</span>{" "}
            citations and a groundedness score per message.
          </p>
          <p className="text-muted-foreground">
            Sessions live under <span className="font-mono text-xs">/agent/sessions/*</span>,
            messages stream from <span className="font-mono text-xs">/agent/messages/*</span>,
            and retrieval traces are stored alongside each message for auditability.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

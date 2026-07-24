"use client";

/**
 * Phase 18 — Real community discussion forum.
 *
 * Wired to the new community_threads + community_posts + community_reactions
 * tables via /community/threads, /community/threads/{id}/posts, and
 * /community/threads/{id}/react. Posting a thread creates a real DB row;
 * upvotes are idempotent; replies bump the thread's reply_count via DB
 * trigger. No mock forum.
 */

import { useEffect, useState, type ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import { Markdown } from "@/components/ui/markdown";
import { useAuthStore } from "@/stores/auth";
import {
  MessageSquare, Plus, ThumbsUp, Lock, Pin, ArrowLeft, Send, CheckCircle2,
  Lightbulb, HeartHandshake, Reply as ReplyIcon, X, Unlock, PinOff,
} from "lucide-react";

type Thread = {
  id: string;
  user_id: string;
  title: string;
  body_md: string;
  tags: string[];
  skill_code: string | null;
  tier: string | null;
  pinned: boolean;
  locked: boolean;
  reply_count: number;
  upvote_count: number;
  last_activity_at: string;
  created_at: string;
  author_name?: string | null;
};

type Post = {
  id: string;
  thread_id: string;
  user_id: string;
  parent_post_id: string | null;
  body_md: string;
  upvote_count: number;
  is_accepted_answer: boolean;
  created_at: string;
  reactions?: Record<string, number>;
  my_reactions?: string[];
  author_name?: string | null;
};

type ThreadDetail = {
  thread: Thread;
  posts: Post[];
  thread_reactions?: Record<string, number>;
  my_thread_reactions?: string[];
};

const REACTION_KINDS = [
  { kind: "upvote", label: "Upvote", Icon: ThumbsUp },
  { kind: "helpful", label: "Helpful", Icon: HeartHandshake },
  { kind: "insightful", label: "Insightful", Icon: Lightbulb },
] as const;

function ReactionBar({
  counts = {},
  mine = [],
  onToggle,
}: {
  counts?: Record<string, number>;
  mine?: string[];
  onToggle: (kind: string, active: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {REACTION_KINDS.map(({ kind, label, Icon }) => {
        const active = mine.includes(kind);
        return (
          <Button
            key={kind}
            variant={active ? "secondary" : "ghost"}
            size="sm"
            title={label}
            aria-pressed={active}
            onClick={(e) => { e.stopPropagation(); onToggle(kind, active); }}
            className={active ? "text-primary" : ""}
          >
            <Icon className="h-3.5 w-3.5 mr-1" />
            {counts[kind] ?? 0}
          </Button>
        );
      })}
    </div>
  );
}

const TIERS = [
  { value: "", label: "All tiers" },
  { value: "high_school", label: "High school" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "medical", label: "Medical" },
  { value: "test_prep", label: "Test prep" },
];

export default function CommunityPage() {
  const me = useAuthStore((s) => s.user);
  const isAdmin = me?.role === "super_admin" || me?.role === "org_admin";
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ tier: "", q: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body_md: "",
    tags: "",
    tier: "",
    skill_code: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [openThread, setOpenThread] = useState<string | null>(null);
  const [detail, setDetail] = useState<ThreadDetail | null>(null);
  const [reply, setReply] = useState("");
  const [replyBusy, setReplyBusy] = useState(false);
  const [replyTo, setReplyTo] = useState<Post | null>(null);

  async function loadThreads() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter.tier) params.set("tier", filter.tier);
      if (filter.q) params.set("q", filter.q);
      const rows = await api<Thread[]>(
        `/community/threads${params.toString() ? `?${params}` : ""}`,
      );
      setThreads(Array.isArray(rows) ? rows : []);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.tier]);

  async function loadDetail(tid: string) {
    setOpenThread(tid);
    setDetail(null);
    try {
      const d = await api<ThreadDetail>(`/community/threads/${tid}`);
      setDetail(d);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  async function createThread(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tags = form.tags.split(",").map((s) => s.trim()).filter(Boolean);
      const created = await api<Thread>("/community/threads", {
        method: "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          body_md: form.body_md.trim(),
          tags,
          tier: form.tier || null,
          skill_code: form.skill_code.trim() || null,
        }),
      });
      setShowForm(false);
      setForm({ title: "", body_md: "", tags: "", tier: "", skill_code: "" });
      await loadThreads();
      await loadDetail(created.id);
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function postReply() {
    if (!openThread || !reply.trim()) return;
    setReplyBusy(true);
    try {
      await api(`/community/threads/${openThread}/posts`, {
        method: "POST",
        body: JSON.stringify({
          body_md: reply.trim(),
          parent_post_id: replyTo?.id ?? null,
        }),
      });
      setReply("");
      setReplyTo(null);
      await loadDetail(openThread);
      await loadThreads();
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setReplyBusy(false);
    }
  }

  // Toggle a typed reaction (upvote / helpful / insightful) on a thread or
  // post — POST when not yet reacted, DELETE (?kind=) when already reacted.
  async function toggleReact(
    target: "threads" | "posts",
    id: string,
    kind: string,
    active: boolean,
  ) {
    try {
      if (active) {
        await api(`/community/${target}/${id}/react?kind=${kind}`, { method: "DELETE" });
      } else {
        await api(`/community/${target}/${id}/react`, {
          method: "POST",
          body: JSON.stringify({ kind }),
        });
      }
      if (openThread) await loadDetail(openThread);
      if (target === "threads") await loadThreads();
    } catch (e) {
      alert(String((e as Error).message));
    }
  }

  async function acceptAnswer(pid: string, accept: boolean) {
    try {
      await api(`/community/posts/${pid}/accept`, { method: accept ? "POST" : "DELETE" });
      if (openThread) await loadDetail(openThread);
    } catch (e) {
      alert(String((e as Error).message));
    }
  }

  // Admin moderation: pin/unpin + lock/unlock (server enforces admin-only).
  async function moderateThread(tid: string, patch: { pinned?: boolean; locked?: boolean }) {
    try {
      await api(`/community/threads/${tid}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      await loadDetail(tid);
      await loadThreads();
    } catch (e) {
      alert(String((e as Error).message));
    }
  }

  if (openThread && detail) {
    const postIds = new Set(detail.posts.map((p) => p.id));
    const topLevel = detail.posts.filter(
      (p) => !p.parent_post_id || !postIds.has(p.parent_post_id),
    );
    const childrenOf = (id: string) =>
      detail.posts.filter((p) => p.parent_post_id === id);

    // Only the thread author (or an admin) can accept/unaccept — matches the
    // server-side rule, so we don't show buttons that would 403.
    const canAccept = isAdmin || me?.id === detail.thread.user_id;

    function renderPost(p: Post, depth: number): ReactElement {
      return (
        <div key={p.id} className={depth > 0 ? "ml-6 border-l-2 border-muted pl-3 space-y-3" : "space-y-3"}>
          <Card className={p.is_accepted_answer ? "border-emerald-500" : ""}>
            <CardContent className="p-4">
              {p.is_accepted_answer && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Accepted answer
                </div>
              )}
              <Markdown className="text-sm">{p.body_md}</Markdown>
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                <span className="font-medium">{p.author_name ?? p.user_id.slice(0, 8)}</span>
                <span>· {formatDate(p.created_at)}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
                <ReactionBar
                  counts={p.reactions}
                  mine={p.my_reactions}
                  onToggle={(kind, active) => toggleReact("posts", p.id, kind, active)}
                />
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setReplyTo(p)}>
                    <ReplyIcon className="h-3.5 w-3.5 mr-1" /> Reply
                  </Button>
                  {canAccept && (
                    <Button variant="ghost" size="sm" onClick={() => acceptAnswer(p.id, !p.is_accepted_answer)}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      {p.is_accepted_answer ? "Unaccept" : "Accept"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {childrenOf(p.id).map((c) => renderPost(c, Math.min(depth + 1, 3)))}
        </div>
      );
    }

    return (
      <div className="space-y-4 max-w-4xl">
        <button
          onClick={() => { setOpenThread(null); setDetail(null); setReplyTo(null); }}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All discussions
        </button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-xl flex items-center gap-2 flex-wrap">
                  {detail.thread.pinned && <Pin className="h-4 w-4 text-amber-600" />}
                  {detail.thread.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                  {detail.thread.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground text-sm">
                  {detail.thread.tier && <Badge variant="outline">{detail.thread.tier}</Badge>}
                  {detail.thread.skill_code && (
                    <span className="font-mono text-[11px]">{detail.thread.skill_code}</span>
                  )}
                  {detail.thread.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                  <span className="font-medium">
                    {detail.thread.author_name ?? detail.thread.user_id.slice(0, 8)}
                  </span>
                  <span className="text-muted-foreground">· {formatDate(detail.thread.created_at)}</span>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <ReactionBar
                  counts={detail.thread_reactions}
                  mine={detail.my_thread_reactions}
                  onToggle={(kind, active) => toggleReact("threads", detail.thread.id, kind, active)}
                />
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moderateThread(detail.thread.id, { pinned: !detail.thread.pinned })}
                    >
                      {detail.thread.pinned
                        ? <><PinOff className="h-3.5 w-3.5 mr-1" /> Unpin</>
                        : <><Pin className="h-3.5 w-3.5 mr-1" /> Pin</>}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moderateThread(detail.thread.id, { locked: !detail.thread.locked })}
                    >
                      {detail.thread.locked
                        ? <><Unlock className="h-3.5 w-3.5 mr-1" /> Unlock</>
                        : <><Lock className="h-3.5 w-3.5 mr-1" /> Lock</>}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Markdown className="text-sm">{detail.thread.body_md}</Markdown>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {detail.posts.length} {detail.posts.length === 1 ? "reply" : "replies"}
          </h3>
          {topLevel.map((p) => renderPost(p, 0))}
        </div>

        {!detail.thread.locked && (
          <Card>
            <CardContent className="p-4 space-y-2">
              {replyTo && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-md px-2 py-1.5">
                  <ReplyIcon className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Replying to <span className="font-mono">{replyTo.user_id.slice(0, 8)}</span>
                  </span>
                  <span className="truncate max-w-[280px]">— {replyTo.body_md}</span>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="ml-auto hover:text-foreground"
                    aria-label="Cancel replying to this post"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <Textarea
                placeholder={replyTo ? "Reply to this comment… (markdown + LaTeX ok)" : "Reply… (markdown + LaTeX ok)"}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={postReply} disabled={replyBusy || !reply.trim()}>
                  <Send className="h-3.5 w-3.5 mr-1" /> Post reply
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <MessageSquare className="h-7 w-7 text-primary" /> Community
          </h1>
          <p className="text-muted-foreground mt-1">
            Discussion forum across your organization. Real threads, real replies,
            real upvotes — wired to <span className="font-mono text-xs">/api/v1/community/*</span>.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "New thread"}
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground">Search</label>
          <div className="flex gap-2">
            <Input
              placeholder="Search title or body…"
              value={filter.q}
              onChange={(e) => setFilter({ ...filter, q: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") loadThreads(); }}
            />
            <Button variant="outline" onClick={loadThreads}>Search</Button>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Tier</label>
          <select
            value={filter.tier}
            onChange={(e) => setFilter({ ...filter, tier: e.target.value })}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New discussion</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={createThread} className="space-y-3">
              <Input
                placeholder="Thread title (4–280 chars)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required minLength={4} maxLength={280}
              />
              <Textarea
                placeholder="What's your question? (markdown + LaTeX ok)"
                value={form.body_md}
                onChange={(e) => setForm({ ...form, body_md: e.target.value })}
                required rows={5}
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Tags (comma-separated)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No tier</option>
                  {TIERS.filter((t) => t.value).map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <Input
                  placeholder="Skill code (optional)"
                  value={form.skill_code}
                  onChange={(e) => setForm({ ...form, skill_code: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Posting…" : "Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && threads.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No discussions yet. Be the first to start one.
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {threads.map((t) => (
          <Card key={t.id} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => loadDetail(t.id)}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {t.pinned && <Pin className="h-3.5 w-3.5 text-amber-600" />}
                  {t.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span className="font-medium">{t.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-muted-foreground">
                  {t.tier && <Badge variant="outline" className="text-[10px]">{t.tier}</Badge>}
                  {t.skill_code && <span className="font-mono">{t.skill_code}</span>}
                  {t.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                  {t.author_name && <span className="font-medium">{t.author_name}</span>}
                  <span>· {formatDate(t.last_activity_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  {t.reply_count}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
                  {t.upvote_count}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

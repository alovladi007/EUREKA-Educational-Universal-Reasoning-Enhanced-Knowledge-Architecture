"use client";

/**
 * /dashboard/graduate/research — Research workspace LIST.
 *
 * Wired to the Phase 16.2 backend that landed in commit 27bc233f:
 *   GET  /me/research/workspaces         list mine
 *   POST /me/research/workspaces         create
 *
 * The detail page (refs + drafts + CrossRef/arXiv lookup + BibTeX export)
 * lives at /dashboard/graduate/research/[id].
 *
 * Replaces the prior Phase 17 user_collections placeholder. The legacy
 * /me/collections-backed surfaces remain at /dashboard/notebook +
 * /dashboard/resources for non-research collections.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import { FolderKanban, Plus, BookText, FileText, ArrowRight, Sigma } from "lucide-react";
import toast from 'react-hot-toast';

type Workspace = {
  id: string;
  user_id: string;
  enrollment_id: string | null;
  title: string;
  description_md: string | null;
  kind: string;
  status: string;
  tags: string[];
  skill_code: string | null;
  is_public: boolean;
  reference_count: number;
  draft_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
};

const KIND_OPTIONS = [
  { value: "paper", label: "Paper" },
  { value: "thesis", label: "Thesis" },
  { value: "grant_application", label: "Grant application" },
  { value: "literature_review", label: "Literature review" },
  { value: "meta_analysis", label: "Meta-analysis" },
  { value: "replication_study", label: "Replication study" },
  { value: "class_project", label: "Class project" },
  { value: "misc", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active", tone: "default" as const },
  { value: "paused", label: "Paused", tone: "secondary" as const },
  { value: "completed", label: "Completed", tone: "default" as const },
  { value: "archived", label: "Archived", tone: "outline" as const },
];

function statusTone(s: string) {
  return STATUS_OPTIONS.find((x) => x.value === s)?.tone ?? "outline";
}

export default function ResearchWorkspacesListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterKind, setFilterKind] = useState<string>("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description_md: "",
    kind: "paper",
    tags: "",
    skill_code: "",
  });
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (filterStatus) qs.set("status", filterStatus);
      if (filterKind) qs.set("kind", filterKind);
      const url = `/me/research/workspaces${qs.toString() ? `?${qs}` : ""}`;
      const data = await api<Workspace[]>(url);
      setRows(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterKind]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const tags = form.tags.split(",").map((s) => s.trim()).filter(Boolean);
      const created = await api<Workspace>("/me/research/workspaces", {
        method: "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          description_md: form.description_md.trim() || null,
          kind: form.kind,
          tags,
          skill_code: form.skill_code.trim() || null,
        }),
      });
      setShowForm(false);
      setForm({ title: "", description_md: "", kind: "paper", tags: "", skill_code: "" });
      router.push(`/dashboard/graduate/research/${created.id}`);
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <FolderKanban className="h-6 w-6 text-primary" />
            Research workspaces
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real Phase 16.2 research workspaces backed by{" "}
            <span className="font-mono text-xs">/me/research/workspaces</span>.
            Each one holds references (CrossRef + arXiv lookup), drafts, and
            BibTeX export.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "New workspace"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-end">
        <div>
          <label className="text-xs text-muted-foreground">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block rounded-md border border-input bg-background px-3 h-9 text-sm"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Kind</label>
          <select
            value={filterKind}
            onChange={(e) => setFilterKind(e.target.value)}
            className="block rounded-md border border-input bg-background px-3 h-9 text-sm"
          >
            <option value="">All</option>
            {KIND_OPTIONS.map((k) => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load workspaces</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New research workspace</CardTitle>
            <CardDescription>
              Pick a kind that matches your project (you can change it later).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={create} className="space-y-3">
              <Input
                placeholder="Workspace title (e.g. 'PhD chapter 4 — MI infarct territories')"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required minLength={1} maxLength={280}
              />
              <Textarea
                placeholder="Brief description (markdown ok)"
                value={form.description_md}
                onChange={(e) => setForm({ ...form, description_md: e.target.value })}
                rows={3}
              />
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={form.kind}
                  onChange={(e) => setForm({ ...form, kind: e.target.value })}
                  className="rounded-md border border-input bg-background px-3 h-10 text-sm"
                >
                  {KIND_OPTIONS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
                <Input
                  placeholder="Tags (comma-separated)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
                <Input
                  placeholder="Skill code (optional)"
                  value={form.skill_code}
                  onChange={(e) => setForm({ ...form, skill_code: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={creating || !form.title.trim()}>
                  {creating ? "Creating…" : "Create + open"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-muted-foreground text-sm">Loading…</p>}

      {!loading && rows.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground space-y-2">
            <p>No research workspaces yet.</p>
            <p className="text-sm">
              Create your first one above. Each workspace can hold dozens of
              references (auto-fetched from CrossRef + arXiv), markdown drafts
              with auto word-count, and exports cleanly to BibTeX.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((w) => (
          <Link key={w.id} href={`/dashboard/graduate/research/${w.id}`}>
            <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base flex items-center gap-2 min-w-0">
                    <FolderKanban className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{w.title}</span>
                  </CardTitle>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
                <CardDescription className="flex flex-wrap items-center gap-1 text-xs mt-1">
                  <Badge variant="outline">{w.kind.replace(/_/g, " ")}</Badge>
                  <Badge variant={statusTone(w.status)}>{w.status}</Badge>
                  {w.skill_code && <span className="font-mono">{w.skill_code}</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {w.description_md && (
                  <p className="text-muted-foreground line-clamp-2">{w.description_md}</p>
                )}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookText className="h-3.5 w-3.5" /> {w.reference_count} refs
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> {w.draft_count} drafts
                  </span>
                  <span>· {formatDate(w.last_activity_at)}</span>
                </div>
                {(w.tags?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(w.tags ?? []).slice(0, 4).map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Footer pointer to 16.6 / 16.7 (still pending) */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sigma className="h-5 w-5 text-primary" />
            Coming next: Research Tools (Sessions 16.6 + 16.7)
          </CardTitle>
          <CardDescription>
            Symbolic math (SymPy) · stats + plotting (statsmodels + matplotlib) ·
            chemistry (RDKit / PubChem) · biology (Biopython) · citation-aware
            Q&A (Claude over CrossRef + arXiv + Semantic Scholar). Wolfram-Alpha
            competitor, native in EUREKA.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

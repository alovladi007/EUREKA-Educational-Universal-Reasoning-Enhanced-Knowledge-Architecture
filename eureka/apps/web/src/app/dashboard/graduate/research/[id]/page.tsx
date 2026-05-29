"use client";

/**
 * /dashboard/graduate/research/[id] — Research workspace DETAIL.
 *
 * Wired to the Phase 16.2 backend (15 endpoints), this page exercises:
 *   GET    /me/research/workspaces/{id}              workspace + nested refs + drafts
 *   PATCH  /me/research/workspaces/{id}              update workspace meta
 *   DELETE /me/research/workspaces/{id}              cascade-delete the whole thing
 *   POST   /me/research/workspaces/{id}/references                  add ref (manual)
 *   POST   /me/research/workspaces/{id}/references/lookup           CrossRef or arXiv
 *   PATCH  /me/research/references/{ref_id}                         update ref
 *   DELETE /me/research/references/{ref_id}                         delete ref
 *   POST   /me/research/workspaces/{id}/drafts                      add draft
 *   PATCH  /me/research/drafts/{draft_id}                           update draft
 *   DELETE /me/research/drafts/{draft_id}                           delete draft
 *   GET    /me/research/workspaces/{id}/export/bibtex               download .bib
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import {
  ArrowLeft, FolderKanban, Plus, Trash2, Download, Search, ExternalLink,
  Star, BookText, FileText, Edit3, Save,
} from "lucide-react";
import toast from 'react-hot-toast';

type Workspace = {
  id: string;
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

type Reference = {
  id: string;
  workspace_id: string;
  source: string;
  doi: string | null;
  arxiv_id: string | null;
  pubmed_id: string | null;
  isbn: string | null;
  title: string;
  authors: string[];
  venue: string | null;
  year: number | null;
  abstract: string | null;
  user_notes_md: string | null;
  tags: string[];
  read_status: string;
  rating: number | null;
  bibtex: string | null;
  raw_metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type Draft = {
  id: string;
  workspace_id: string;
  title: string;
  kind: string;
  sort_index: number;
  body_md: string;
  word_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
};

// Detail endpoint returns either { workspace, references, drafts } OR
// (per agent's implementation) the workspace fields flat + references + drafts.
// Handle both.
type DetailRaw = (Workspace & { references?: Reference[]; drafts?: Draft[] }) & {
  workspace?: Workspace;
};

const DRAFT_KIND_OPTIONS = [
  { value: "paper_section", label: "Paper section" },
  { value: "thesis_chapter", label: "Thesis chapter" },
  { value: "grant_section", label: "Grant section" },
  { value: "lit_review_summary", label: "Lit review summary" },
  { value: "talk_outline", label: "Talk outline" },
  { value: "misc", label: "Other" },
];

const READ_STATUS_OPTIONS = ["unread", "reading", "read", "dismissed"];

export default function ResearchWorkspaceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [refs, setRefs] = useState<Reference[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // forms
  const [refForm, setRefForm] = useState({ title: "", authors: "", year: "", doi: "", venue: "" });
  const [draftForm, setDraftForm] = useState({ title: "", kind: "paper_section", body_md: "" });
  const [lookup, setLookup] = useState<{ kind: "doi" | "arxiv"; value: string }>({ kind: "doi", value: "" });
  const [lookupResult, setLookupResult] = useState<Partial<Reference> | null>(null);
  const [lookupErr, setLookupErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // inline-edit a draft body
  const [editingDraft, setEditingDraft] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  async function refresh() {
    if (!id) return;
    setLoading(true);
    try {
      const raw = await api<DetailRaw>(`/me/research/workspaces/${id}`);
      const w: Workspace = (raw as { workspace?: Workspace }).workspace ?? (raw as Workspace);
      setWorkspace(w);
      setRefs(Array.isArray(raw.references) ? raw.references : []);
      setDrafts(Array.isArray(raw.drafts) ? raw.drafts : []);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  async function addRefManual(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !refForm.title.trim()) return;
    setBusy(true);
    try {
      const authors = refForm.authors.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
      await api(`/me/research/workspaces/${id}/references`, {
        method: "POST",
        body: JSON.stringify({
          source: "manual",
          title: refForm.title.trim(),
          authors,
          year: refForm.year ? Number(refForm.year) : null,
          doi: refForm.doi.trim() || null,
          venue: refForm.venue.trim() || null,
        }),
      });
      setRefForm({ title: "", authors: "", year: "", doi: "", venue: "" });
      await refresh();
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally { setBusy(false); }
  }

  async function doLookup() {
    if (!id || !lookup.value.trim()) return;
    setBusy(true);
    setLookupErr(null);
    setLookupResult(null);
    try {
      const r = await api<Partial<Reference>>(`/me/research/workspaces/${id}/references/lookup`, {
        method: "POST",
        body: JSON.stringify({ kind: lookup.kind, value: lookup.value.trim() }),
      });
      if (!r || !r.title) {
        setLookupErr("No metadata returned. The DOI / arXiv ID may not be resolvable.");
      } else {
        setLookupResult(r);
      }
    } catch (e) {
      setLookupErr(String((e as Error).message));
    } finally { setBusy(false); }
  }

  async function addLookupResult() {
    if (!id || !lookupResult) return;
    setBusy(true);
    try {
      const body = {
        source: lookup.kind === "doi" ? "crossref" : "arxiv",
        title: lookupResult.title ?? "Untitled",
        authors: lookupResult.authors ?? [],
        venue: lookupResult.venue ?? null,
        year: lookupResult.year ?? null,
        abstract: lookupResult.abstract ?? null,
        doi: lookup.kind === "doi" ? lookup.value.trim() : (lookupResult.doi ?? null),
        arxiv_id: lookup.kind === "arxiv" ? lookup.value.trim() : (lookupResult.arxiv_id ?? null),
      };
      await api(`/me/research/workspaces/${id}/references`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setLookup({ kind: lookup.kind, value: "" });
      setLookupResult(null);
      await refresh();
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      toast.error(msg);
    } finally { setBusy(false); }
  }

  async function rateRef(refId: string, rating: number) {
    try {
      await api(`/me/research/references/${refId}`, {
        method: "PATCH",
        body: JSON.stringify({ rating }),
      });
      await refresh();
    } catch (e) { toast.error(String((e as Error).message)); }
  }

  async function cycleReadStatus(refId: string, current: string) {
    const idx = READ_STATUS_OPTIONS.indexOf(current);
    const next = READ_STATUS_OPTIONS[(idx + 1) % READ_STATUS_OPTIONS.length];
    try {
      await api(`/me/research/references/${refId}`, {
        method: "PATCH",
        body: JSON.stringify({ read_status: next }),
      });
      await refresh();
    } catch (e) { toast.error(String((e as Error).message)); }
  }

  async function deleteRef(refId: string) {
    if (!window.confirm("Delete this reference?")) return;
    try {
      await api(`/me/research/references/${refId}`, { method: "DELETE" });
      await refresh();
    } catch (e) { toast.error(String((e as Error).message)); }
  }

  async function addDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !draftForm.title.trim()) return;
    setBusy(true);
    try {
      await api(`/me/research/workspaces/${id}/drafts`, {
        method: "POST",
        body: JSON.stringify({
          title: draftForm.title.trim(),
          kind: draftForm.kind,
          body_md: draftForm.body_md,
          sort_index: drafts.length,
        }),
      });
      setDraftForm({ title: "", kind: "paper_section", body_md: "" });
      await refresh();
    } catch (e) { toast.error(String((e as Error).message)); }
    finally { setBusy(false); }
  }

  async function saveDraftBody(draftId: string) {
    try {
      await api(`/me/research/drafts/${draftId}`, {
        method: "PATCH",
        body: JSON.stringify({ body_md: editBody }),
      });
      setEditingDraft(null);
      setEditBody("");
      await refresh();
    } catch (e) { toast.error(String((e as Error).message)); }
  }

  async function deleteDraft(draftId: string) {
    if (!window.confirm("Delete this draft?")) return;
    try {
      await api(`/me/research/drafts/${draftId}`, { method: "DELETE" });
      await refresh();
    } catch (e) { toast.error(String((e as Error).message)); }
  }

  async function exportBibtex() {
    if (!id || !workspace) return;
    try {
      const r = await api<{ bibtex: string; format: string; count: number }>(
        `/me/research/workspaces/${id}/export/bibtex`,
      );
      const blob = new Blob([r.bibtex], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${workspace.title.replace(/[^a-z0-9-]+/gi, "_").toLowerCase()}.bib`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { toast.error(String((e as Error).message)); }
  }

  async function deleteWorkspace() {
    if (!id) return;
    if (!window.confirm("Delete the whole workspace? This removes all references and drafts.")) return;
    try {
      await api(`/me/research/workspaces/${id}`, { method: "DELETE" });
      router.push("/dashboard/graduate/research");
    } catch (e) { toast.error(String((e as Error).message)); }
  }

  if (error) {
    return (
      <div className="space-y-3 max-w-3xl">
        <Link href="/dashboard/graduate/research" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> All workspaces
        </Link>
        <Alert variant="destructive">
          <AlertTitle>Could not load workspace</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (loading || !workspace) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/dashboard/graduate/research" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> All workspaces
      </Link>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <FolderKanban className="h-7 w-7 text-primary" />
            {workspace.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
            <Badge variant="outline">{workspace.kind.replace(/_/g, " ")}</Badge>
            <Badge>{workspace.status}</Badge>
            {workspace.skill_code && <span className="font-mono text-xs">{workspace.skill_code}</span>}
            <span className="text-muted-foreground">· updated {formatDate(workspace.last_activity_at)}</span>
          </div>
          {workspace.description_md && (
            <p className="mt-2 text-sm text-muted-foreground">{workspace.description_md}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Button onClick={exportBibtex} variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1" /> Export .bib
          </Button>
          <Button onClick={deleteWorkspace} variant="destructive" size="sm">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete workspace
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardDescription>References</CardDescription></CardHeader>
          <CardContent className="text-2xl font-bold flex items-center gap-2">
            <BookText className="h-5 w-5 text-primary" />
            {workspace.reference_count}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Drafts</CardDescription></CardHeader>
          <CardContent className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {workspace.draft_count}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Total words</CardDescription></CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums">
            {drafts.reduce((s, d) => s + (d.word_count ?? 0), 0)}
          </CardContent>
        </Card>
      </div>

      {/* CrossRef / arXiv lookup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" /> CrossRef + arXiv lookup
          </CardTitle>
          <CardDescription>
            Paste a DOI (e.g. <code className="font-mono text-xs">10.1038/nature12373</code>) or
            arXiv ID (e.g. <code className="font-mono text-xs">1706.03762</code>). Live lookup —
            metadata is pre-filled for review before saving.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap items-end">
            <select
              value={lookup.kind}
              onChange={(e) => setLookup({ ...lookup, kind: e.target.value as "doi" | "arxiv" })}
              className="rounded-md border border-input bg-background px-3 h-10 text-sm"
            >
              <option value="doi">DOI (CrossRef)</option>
              <option value="arxiv">arXiv ID</option>
            </select>
            <Input
              placeholder={lookup.kind === "doi" ? "10.1038/nature12373" : "1706.03762"}
              value={lookup.value}
              onChange={(e) => setLookup({ ...lookup, value: e.target.value })}
              className="flex-1 min-w-[200px]"
              onKeyDown={(e) => { if (e.key === "Enter") doLookup(); }}
            />
            <Button onClick={doLookup} disabled={busy || !lookup.value.trim()}>
              {busy ? "Looking up…" : "Lookup"}
            </Button>
          </div>
          {lookupErr && (
            <Alert variant="destructive">
              <AlertDescription>{lookupErr}</AlertDescription>
            </Alert>
          )}
          {lookupResult && (
            <div className="border rounded-md p-3 space-y-1">
              <div className="font-medium">{lookupResult.title}</div>
              {(lookupResult.authors ?? []).length > 0 && (
                <div className="text-sm text-muted-foreground">{(lookupResult.authors ?? []).join(", ")}</div>
              )}
              {(lookupResult.venue || lookupResult.year) && (
                <div className="text-xs text-muted-foreground">
                  {lookupResult.venue && <span>{lookupResult.venue}</span>}
                  {lookupResult.year && <span> · {lookupResult.year}</span>}
                </div>
              )}
              {lookupResult.abstract && (
                <p className="text-xs text-muted-foreground line-clamp-3">{lookupResult.abstract}</p>
              )}
              <div className="pt-2 flex gap-2">
                <Button size="sm" onClick={addLookupResult} disabled={busy}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add to workspace
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setLookupResult(null)}>Discard</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookText className="h-5 w-5 text-primary" /> References ({refs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={addRefManual} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
            <Input
              placeholder="Title"
              value={refForm.title}
              onChange={(e) => setRefForm({ ...refForm, title: e.target.value })}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Authors (comma)"
              value={refForm.authors}
              onChange={(e) => setRefForm({ ...refForm, authors: e.target.value })}
            />
            <Input
              placeholder="Year"
              value={refForm.year}
              type="number"
              onChange={(e) => setRefForm({ ...refForm, year: e.target.value })}
            />
            <Button type="submit" disabled={busy || !refForm.title.trim()}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add manual
            </Button>
          </form>
          {refs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No references yet. Use the CrossRef / arXiv lookup above, or add one manually.
            </p>
          ) : (
            <ul className="divide-y">
              {refs.map((r) => (
                <li key={r.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{r.title}</div>
                    {r.authors.length > 0 && (
                      <div className="text-xs text-muted-foreground">{r.authors.join(", ")}</div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      {r.venue && <span className="text-muted-foreground">{r.venue}</span>}
                      {r.year && <span className="text-muted-foreground">{r.year}</span>}
                      <Badge variant="outline" className="text-[10px]">{r.source}</Badge>
                      {r.doi && (
                        <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noopener noreferrer"
                           className="font-mono text-[10px] text-primary hover:underline inline-flex items-center gap-0.5">
                          {r.doi} <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {r.arxiv_id && (
                        <a href={`https://arxiv.org/abs/${r.arxiv_id}`} target="_blank" rel="noopener noreferrer"
                           className="font-mono text-[10px] text-primary hover:underline inline-flex items-center gap-0.5">
                          arXiv:{r.arxiv_id} <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button onClick={() => cycleReadStatus(r.id, r.read_status)}
                        className="text-[10px] underline-offset-2 hover:underline">
                        {r.read_status}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => rateRef(r.id, n)}
                          aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
                          className={(r.rating ?? 0) >= n ? "text-yellow-500" : "text-muted-foreground/30"}>
                          <Star className="h-3.5 w-3.5" fill={(r.rating ?? 0) >= n ? "currentColor" : "none"} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteRef(r.id)} aria-label="Delete this reference">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Drafts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Drafts ({drafts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={addDraft} className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Draft title"
                value={draftForm.title}
                onChange={(e) => setDraftForm({ ...draftForm, title: e.target.value })}
                className="flex-1"
              />
              <select
                value={draftForm.kind}
                onChange={(e) => setDraftForm({ ...draftForm, kind: e.target.value })}
                className="rounded-md border border-input bg-background px-3 h-10 text-sm"
              >
                {DRAFT_KIND_OPTIONS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </div>
            <Textarea
              placeholder="Body (markdown). Leave blank to fill in later."
              value={draftForm.body_md}
              onChange={(e) => setDraftForm({ ...draftForm, body_md: e.target.value })}
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={busy || !draftForm.title.trim()}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add draft
              </Button>
            </div>
          </form>
          {drafts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No drafts yet.</p>
          ) : (
            <ul className="space-y-3">
              {drafts.map((d) => (
                <li key={d.id} className="border rounded-md p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{d.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-[10px]">{d.kind.replace(/_/g, " ")}</Badge>
                        <span>{d.word_count} words</span>
                        <span>· {formatDate(d.updated_at)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {editingDraft === d.id ? (
                        <Button size="sm" onClick={() => saveDraftBody(d.id)}>
                          <Save className="h-3.5 w-3.5 mr-1" /> Save
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => { setEditingDraft(d.id); setEditBody(d.body_md); }} aria-label="Edit this draft">
                          <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteDraft(d.id)} aria-label="Delete this draft">
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  {editingDraft === d.id ? (
                    <Textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={10}
                      className="mt-2 font-mono text-xs"
                    />
                  ) : (
                    d.body_md && (
                      <pre className="mt-2 text-xs whitespace-pre-wrap font-sans text-muted-foreground line-clamp-6">
                        {d.body_md}
                      </pre>
                    )
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

/**
 * Phase 19.2 — Notebook landing, rewired to api-core.
 *
 * Previously called notebookAPI on a defunct :8120 microservice and
 * fell back to nothing — page hung with "Failed to load notebook data".
 *
 * Now wired to the real Phase 17 user_collections backend:
 *   /me/collections?kind=notebook    list my notebooks
 *   POST /me/collections             create a notebook
 *   GET /me/collections/{id}         drill into items
 *   POST /me/collections/{id}/items  add a note
 *
 * The subroutes under /dashboard/notebook/{projects,tasks,search,payments}
 * still talk to the legacy :8120 service; they're left in place but the
 * landing page works standalone against the real api-core.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import {
  FolderKanban, Plus, FileText, ArrowLeft, Trash2, Edit3, Tag,
} from "lucide-react";

type Notebook = {
  id: string;
  kind: string;
  title: string;
  description_md: string | null;
  tags: string[];
  skill_code: string | null;
  is_pinned: boolean;
  is_public: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
};

type Note = {
  id: string;
  collection_id: string;
  kind: string;
  title: string | null;
  body_md: string | null;
  url: string | null;
  sort_index: number;
  created_at: string;
  updated_at: string;
};

type NotebookDetail = {
  collection: Notebook;
  items: Note[];
};

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newNb, setNewNb] = useState({ title: "", description_md: "", tags: "", skill_code: "" });
  const [creating, setCreating] = useState(false);

  // Notebook detail state
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<NotebookDetail | null>(null);
  const [noteForm, setNoteForm] = useState({ title: "", body_md: "" });
  const [noteBusy, setNoteBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const rows = await api<Notebook[]>("/me/collections?kind=notebook");
      setNotebooks(Array.isArray(rows) ? rows : []);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function createNotebook(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const tags = newNb.tags.split(",").map((s) => s.trim()).filter(Boolean);
      const created = await api<Notebook>("/me/collections", {
        method: "POST",
        body: JSON.stringify({
          kind: "notebook",
          title: newNb.title.trim(),
          description_md: newNb.description_md.trim() || null,
          tags,
          skill_code: newNb.skill_code.trim() || null,
        }),
      });
      setShowForm(false);
      setNewNb({ title: "", description_md: "", tags: "", skill_code: "" });
      await refresh();
      await loadDetail(created.id);
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      alert(msg);
    } finally {
      setCreating(false);
    }
  }

  async function loadDetail(id: string) {
    setOpenId(id);
    setDetail(null);
    try {
      const d = await api<NotebookDetail>(`/me/collections/${id}`);
      setDetail(d);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  async function addNote() {
    if (!openId || !noteForm.body_md.trim()) return;
    setNoteBusy(true);
    try {
      await api(`/me/collections/${openId}/items`, {
        method: "POST",
        body: JSON.stringify({
          kind: "note",
          title: noteForm.title.trim() || null,
          body_md: noteForm.body_md.trim(),
        }),
      });
      setNoteForm({ title: "", body_md: "" });
      await loadDetail(openId);
      await refresh();
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setNoteBusy(false);
    }
  }

  async function deleteNote(itemId: string) {
    if (!openId) return;
    if (!window.confirm("Delete this note?")) return;
    try {
      await api(`/me/collections/${openId}/items/${itemId}`, { method: "DELETE" });
      await loadDetail(openId);
      await refresh();
    } catch (e) {
      alert(String((e as Error).message));
    }
  }

  async function deleteNotebook(id: string) {
    if (!window.confirm("Delete this notebook and all its notes?")) return;
    try {
      await api(`/me/collections/${id}`, { method: "DELETE" });
      if (openId === id) { setOpenId(null); setDetail(null); }
      await refresh();
    } catch (e) {
      alert(String((e as Error).message));
    }
  }

  // Detail view
  if (openId && detail) {
    return (
      <div className="space-y-4 max-w-4xl">
        <button
          onClick={() => { setOpenId(null); setDetail(null); }}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All notebooks
        </button>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderKanban className="h-6 w-6 text-primary" />
              {detail.collection.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Badge variant="outline">{detail.items.length} note{detail.items.length === 1 ? "" : "s"}</Badge>
              {detail.collection.skill_code && (
                <span className="font-mono">{detail.collection.skill_code}</span>
              )}
              {(detail.collection.tags ?? []).map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
              ))}
            </div>
            {detail.collection.description_md && (
              <p className="mt-2 text-sm text-muted-foreground">{detail.collection.description_md}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => deleteNotebook(detail.collection.id)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete notebook
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              placeholder="Title (optional)"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            />
            <Textarea
              placeholder="Note body (markdown ok)"
              rows={5}
              value={noteForm.body_md}
              onChange={(e) => setNoteForm({ ...noteForm, body_md: e.target.value })}
            />
            <div className="flex justify-end">
              <Button onClick={addNote} disabled={noteBusy || !noteForm.body_md.trim()}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Notes</h3>
          {detail.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet — add the first above.</p>
          ) : (
            detail.items.map((n) => (
              <Card key={n.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {n.title && <div className="font-medium mb-1">{n.title}</div>}
                      {n.body_md && (
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{n.body_md}</p>
                      )}
                      <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        {formatDate(n.created_at)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteNote(n.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <FolderKanban className="h-7 w-7 text-primary" />
            Notebook
          </h1>
          <p className="text-muted-foreground mt-1">
            Real notebooks backed by{" "}
            <span className="font-mono text-xs">/me/collections?kind=notebook</span>.
            Each notebook holds notes (markdown), bookmarks, references.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "New notebook"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New notebook</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={createNotebook} className="space-y-3">
              <Input
                placeholder="Notebook title"
                value={newNb.title}
                onChange={(e) => setNewNb({ ...newNb, title: e.target.value })}
                required minLength={1} maxLength={200}
              />
              <Textarea
                placeholder="Description (optional, markdown ok)"
                value={newNb.description_md}
                onChange={(e) => setNewNb({ ...newNb, description_md: e.target.value })}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Tags (comma-separated)"
                  value={newNb.tags}
                  onChange={(e) => setNewNb({ ...newNb, tags: e.target.value })}
                />
                <Input
                  placeholder="Skill code (optional)"
                  value={newNb.skill_code}
                  onChange={(e) => setNewNb({ ...newNb, skill_code: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={creating || !newNb.title.trim()}>
                  {creating ? "Creating…" : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && notebooks.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No notebooks yet. Create your first one above.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {notebooks.map((n) => (
          <Card
            key={n.id}
            className="cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => loadDetail(n.id)}
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 min-w-0">
                <FolderKanban className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{n.title}</span>
              </CardTitle>
              <CardDescription>
                {n.item_count} item{n.item_count === 1 ? "" : "s"} ·
                updated {formatDate(n.updated_at)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {n.description_md && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {n.description_md}
                </p>
              )}
              {(n.tags?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(n.tags ?? []).slice(0, 4).map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legacy subroutes — these still call the old notebook microservice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Other notebook tools</CardTitle>
          <CardDescription>
            These subroutes were built against an older notebook microservice
            (port 8120). They may show empty state if that service isn&apos;t
            running.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/dashboard/notebook/projects", label: "Projects" },
            { href: "/dashboard/notebook/tasks", label: "Tasks" },
            { href: "/dashboard/notebook/search", label: "Search" },
            { href: "/dashboard/notebook/payments", label: "Payments" },
          ].map((s) => (
            <Link key={s.href} href={s.href}>
              <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <Edit3 className="h-3.5 w-3.5 text-primary" />
                    {s.label}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

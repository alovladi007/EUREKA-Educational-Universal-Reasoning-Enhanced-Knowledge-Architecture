"use client";

/**
 * /dashboard/graduate/research — research workspace for graduate learners.
 * Phase 16.2's research_workspaces table doesn't ship until later, so we
 * use the Phase 17 user_collections backend as a real placeholder:
 *  - notebook collections = research notebooks
 *  - reading_list collections = lit-review reading lists
 *  - bookmark_set collections = citation bookmarks
 *
 * All real DB rows via /me/collections. When 16.2 lands we'll add
 * graduate-specific schema (research_workspaces, lit_review_entries,
 * workspace_drafts) — but this surface is already useful today.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import { FolderKanban, BookOpen, Bookmark, Plus, Sigma } from "lucide-react";

type Collection = {
  id: string;
  kind: string;
  title: string;
  description_md: string | null;
  tags: string[];
  item_count: number;
  updated_at: string;
};

const KINDS = [
  { value: "notebook", label: "Research notebook", icon: FolderKanban },
  { value: "reading_list", label: "Reading list", icon: BookOpen },
  { value: "bookmark_set", label: "Citation bookmarks", icon: Bookmark },
] as const;

export default function ResearchPage() {
  const [collections, setCollections] = useState<Record<string, Collection[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newKind, setNewKind] = useState<string>("notebook");
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const results = await Promise.all(KINDS.map(async (k) => {
        const rows = await api<Collection[]>(`/me/collections?kind=${k.value}`).catch(() => [] as Collection[]);
        // Add research tag-affinity: only show collections tagged with "research" or skill_code starting with grad / phd
        return [k.value, Array.isArray(rows) ? rows : []] as const;
      }));
      const map: Record<string, Collection[]> = {};
      for (const [k, v] of results) map[k] = v;
      setCollections(map);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await api("/me/collections", {
        method: "POST",
        body: JSON.stringify({
          kind: newKind,
          title: newTitle.trim(),
          tags: ["research", "graduate"],
        }),
      });
      setNewTitle("");
      await refresh();
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      alert(msg);
    } finally { setCreating(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-primary" />
          Research workspace
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Research notebooks, reading lists, and citation bookmarks. Real
          collections backed by{" "}
          <span className="font-mono text-xs">/me/collections</span> (Phase 17).
          A dedicated <code className="font-mono text-xs">research_workspaces</code> schema
          lands in Phase 16.2 with CrossRef + arXiv lookup and BibTeX export.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">New research collection</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={create} className="flex gap-2 flex-wrap items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground">Title</label>
              <Input
                placeholder="e.g. 'Cardiac MI mechanisms — literature'"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Kind</label>
              <select
                value={newKind}
                onChange={(e) => setNewKind(e.target.value)}
                className="block w-full rounded-md border border-input bg-background px-3 h-10 text-sm"
              >
                {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </div>
            <Button type="submit" disabled={creating || !newTitle.trim()}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Create
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && <p className="text-muted-foreground text-sm">Loading…</p>}

      {KINDS.map((k) => {
        const list = collections[k.value] ?? [];
        return (
          <Card key={k.value}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <k.icon className="h-5 w-5 text-primary" />
                {k.label}s
                <span className="text-xs font-normal text-muted-foreground">({list.length})</span>
              </CardTitle>
              <CardDescription>
                Wired to <span className="font-mono text-[11px]">/me/collections?kind={k.value}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {list.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  None yet. Use the form above to create one with kind = <code className="font-mono text-xs">{k.value}</code>.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((c) => (
                    <Link key={c.id} href={`/dashboard/notebook?open=${c.id}`}>
                      <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
                        <CardContent className="p-3">
                          <div className="font-medium text-sm truncate">{c.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {c.item_count} item{c.item_count === 1 ? "" : "s"} · updated {formatDate(c.updated_at)}
                          </div>
                          {(c.tags?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(c.tags ?? []).slice(0, 4).map((t) => (
                                <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sigma className="h-5 w-5 text-primary" />
            Coming in 16.2 + 16.6 + 16.7
          </CardTitle>
          <CardDescription>
            CrossRef + arXiv lookup with BibTeX export · symbolic math (SymPy) ·
            stats + plotting (statsmodels + matplotlib) · chemistry (RDKit /
            PubChem) · biology (Biopython) · citation-aware Q&A (Claude over
            CrossRef + arXiv + Semantic Scholar). The Wolfram-Alpha competitor
            surface for graduate research, native in EUREKA.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

"use client";

/**
 * Research Collaboration — R-1 of the Phase 16.2 program
 * (docs/RESEARCH_TIER_16_2_16_5_SPEC.md).
 *
 * Extends the existing solo research workspace (AI Research) with:
 *  - workspace sharing (owner adds org members by email; viewer = read,
 *    collaborator = read + edit references/drafts — R-2 shipped)
 *  - research groups (labs / reading groups, org-visible, open-join)
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/eureka-api";
import { useAuthStore } from "@/stores/auth";
import { Markdown } from "@/components/ui/markdown";
import { FlaskConical, Plus, UserPlus, LogIn, LogOut, Trash2 } from "lucide-react";

type RGroup = {
  id: string;
  user_id: string;
  name: string;
  description_md: string | null;
  tags: string[];
  member_count: number;
  is_member: boolean;
  owner_name: string | null;
};

type SharedWs = { id: string; title: string; kind: string; status: string; owner_name: string | null; my_role: string };
type MyWs = {
  id: string; title: string; kind?: string; status?: string;
  reference_count?: number; draft_count?: number;
};
type LitEntry = { id: string; title: string; authors: string[]; venue: string | null; year: number | null; read_status: string; user_notes_md: string | null };
type Draft = { id: string; title: string; kind: string; updated_at: string };
type Overview = {
  id: string; title: string; description_md: string | null; kind: string; status: string;
  tags: string[]; owner_name: string | null; my_role: string; lit_review: LitEntry[]; drafts: Draft[];
};
type WsMember = { user_id: string; role: string; name: string | null };

export default function ResearchCollabPage() {
  const me = useAuthStore((s) => s.user);
  const [groups, setGroups] = useState<RGroup[]>([]);
  const [shared, setShared] = useState<SharedWs[]>([]);
  const [myWs, setMyWs] = useState<MyWs[]>([]);
  const [wsMembers, setWsMembers] = useState<Record<string, WsMember[]>>({});
  const [overview, setOverview] = useState<Overview | null>(null);

  const [lookup, setLookup] = useState({ kind: "doi", value: "" });
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);

  async function runLookup() {
    if (!overview || !lookup.value.trim()) return;
    setBusy(true);
    setPreview(null);
    try {
      const r = await api<Record<string, unknown>>(
        `/me/research/workspaces/${overview.id}/references/lookup`,
        { method: "POST", body: JSON.stringify({ kind: lookup.kind, value: lookup.value.trim() }) },
      );
      if (!r.found) { alert("Not found — check the identifier."); return; }
      setPreview(r);
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function addReference() {
    if (!overview || !preview) return;
    setBusy(true);
    try {
      await api(`/me/research/workspaces/${overview.id}/references`, {
        method: "POST",
        body: JSON.stringify({
          source: preview.source ?? lookup.kind,
          doi: preview.doi ?? null,
          arxiv_id: preview.arxiv_id ?? null,
          title: preview.title,
          authors: preview.authors ?? [],
          venue: preview.venue ?? null,
          year: preview.year ?? null,
          abstract: preview.abstract ?? null,
          raw_metadata: (preview.raw as Record<string, unknown>) ?? {},
        }),
      });
      setPreview(null);
      setLookup({ kind: lookup.kind, value: "" });
      setOverview(await api<Overview>(`/research/workspaces/${overview.id}/overview`));
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function exportBibtex() {
    if (!overview) return;
    try {
      const r = await api<{ bibtex: string }>(`/me/research/workspaces/${overview.id}/export/bibtex`);
      const blob = new Blob([r.bibtex], { type: "application/x-bibtex" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${overview.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "workspace"}.bib`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(String((e as Error).message));
    }
  }

  async function openOverview(wsId: string) {
    if (overview?.id === wsId) { setOverview(null); return; }
    try {
      setOverview(await api<Overview>(`/research/workspaces/${wsId}/overview`));
    } catch (e) {
      alert(String((e as Error).message));
    }
  }
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [groupName, setGroupName] = useState("");

  async function load() {
    setLoading(true);
    const [g, s, w] = await Promise.all([
      api<RGroup[]>("/research-groups").catch(() => [] as RGroup[]),
      api<SharedWs[]>("/me/research/shared-workspaces").catch(() => [] as SharedWs[]),
      api<MyWs[]>("/me/research/workspaces").catch(() => [] as MyWs[]),
    ]);
    setGroups(Array.isArray(g) ? g : []);
    setShared(Array.isArray(s) ? s : []);
    setMyWs(Array.isArray(w) ? w : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim()) return;
    setBusy(true);
    try {
      await api("/research-groups", { method: "POST", body: JSON.stringify({ name: groupName.trim() }) });
      setGroupName("");
      await load();
    } catch (e2) {
      alert(String((e2 as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function joinLeave(g: RGroup) {
    setBusy(true);
    try {
      await api(`/research-groups/${g.id}/${g.is_member ? "leave" : "join"}`, { method: "POST" });
      await load();
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function removeGroup(g: RGroup) {
    if (!window.confirm(`Delete research group "${g.name}"?`)) return;
    setBusy(true);
    try {
      await api(`/research-groups/${g.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function loadMembers(wsId: string) {
    const rows = await api<WsMember[]>(`/me/research/workspaces/${wsId}/members`).catch(() => [] as WsMember[]);
    setWsMembers((prev) => ({ ...prev, [wsId]: Array.isArray(rows) ? rows : [] }));
  }

  async function shareWorkspace(wsId: string) {
    const email = window.prompt("Share with (email of a member of your organization):");
    if (!email) return;
    const asCollab = window.confirm(
      "OK = collaborator (can edit references + drafts)\nCancel = viewer (read-only)",
    );
    setBusy(true);
    try {
      await api(`/me/research/workspaces/${wsId}/members`, {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), role: asCollab ? "collaborator" : "viewer" }),
      });
      await loadMembers(wsId);
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function unshare(wsId: string, userId: string) {
    setBusy(true);
    try {
      await api(`/me/research/workspaces/${wsId}/members/${userId}`, { method: "DELETE" });
      await loadMembers(wsId);
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <FlaskConical className="h-7 w-7 text-primary" /> Research Collaboration
        </h1>
        <p className="text-muted-foreground mt-1">
          Share your research workspaces and join lab groups. Viewers get
          read access; collaborators can also edit references and drafts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Share my workspaces</CardTitle>
          <CardDescription>
            Add org members by email — viewer (read) or collaborator (edit).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : myWs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No workspaces yet — create one under AI Research.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {myWs.map((w) => (
                <li key={w.id} className="border rounded-md p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{w.title}</span>
                    {w.kind && <Badge variant="outline" className="text-[10px]">{w.kind}</Badge>}
                    {w.status && <Badge variant="secondary" className="text-[10px]">{w.status}</Badge>}
                    {typeof w.reference_count === "number" && (
                      <span className="text-xs text-muted-foreground">{w.reference_count} refs · {w.draft_count ?? 0} drafts</span>
                    )}
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openOverview(w.id)}>
                        Open
                      </Button>
                      <Button size="sm" variant="outline" disabled={busy} onClick={() => shareWorkspace(w.id)}>
                        <UserPlus className="h-3.5 w-3.5 mr-1" /> Share
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => loadMembers(w.id)}>
                        Members
                      </Button>
                    </div>
                  </div>
                  {wsMembers[w.id] && (
                    <ul className="mt-2 border-t pt-2 space-y-1 text-xs">
                      {wsMembers[w.id].length === 0 && (
                        <li className="text-muted-foreground">Not shared with anyone yet.</li>
                      )}
                      {wsMembers[w.id].map((m) => (
                        <li key={m.user_id} className="flex items-center gap-2">
                          <span>{m.name ?? m.user_id.slice(0, 8)}</span>
                          <Badge variant="outline" className="text-[10px]">{m.role}</Badge>
                          <button
                            className="ml-auto underline text-muted-foreground hover:text-foreground"
                            onClick={() => unshare(w.id, m.user_id)}
                          >
                            remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shared with me</CardTitle>
          <CardDescription>Workspaces other researchers shared with you (read access).</CardDescription>
        </CardHeader>
        <CardContent>
          {shared.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing shared with you yet.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {shared.map((w) => (
                <li key={w.id} className="flex items-center gap-2 border-b pb-1.5 last:border-b-0">
                  <span className="font-medium">{w.title}</span>
                  <Badge variant="outline" className="text-[10px]">{w.kind}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{w.my_role}</Badge>
                  <span className="ml-auto text-xs text-muted-foreground">
                    by {w.owner_name ?? "unknown"}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => openOverview(w.id)}>Open</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {overview && (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 flex-wrap">
              {overview.title}
              <Badge variant="outline" className="text-[10px]">{overview.kind}</Badge>
              <Badge variant="secondary" className="text-[10px]">{overview.status}</Badge>
              <Badge variant="secondary" className="text-[10px]">{overview.my_role}</Badge>
              <span className="ml-auto flex items-center gap-2">
                {overview.lit_review.length > 0 && (
                  <button className="text-xs underline text-primary" onClick={exportBibtex}>
                    Export BibTeX
                  </button>
                )}
                <button className="text-xs underline text-muted-foreground" onClick={() => setOverview(null)}>close</button>
              </span>
            </CardTitle>
            <CardDescription>
              {overview.owner_name ? `Owned by ${overview.owner_name}` : ""}
              {overview.my_role !== "owner" ? " — read-only view" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview.description_md && <Markdown className="text-sm">{overview.description_md}</Markdown>}
            {overview.my_role !== "viewer" && (
              <div className="border rounded-md p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  Add reference by identifier (live CrossRef / arXiv lookup)
                </p>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={lookup.kind}
                    onChange={(e) => setLookup({ ...lookup, kind: e.target.value })}
                    className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                  >
                    <option value="doi">DOI</option>
                    <option value="arxiv">arXiv ID</option>
                  </select>
                  <Input
                    className="flex-1 min-w-[220px]"
                    placeholder={lookup.kind === "doi" ? "10.1038/nature14539" : "1706.03762"}
                    value={lookup.value}
                    onChange={(e) => setLookup({ ...lookup, value: e.target.value })}
                  />
                  <Button size="sm" onClick={runLookup} disabled={busy || !lookup.value.trim()}>
                    {busy ? "Looking up…" : "Look up"}
                  </Button>
                </div>
                {preview && (
                  <div className="bg-muted rounded-md p-2 text-sm space-y-1">
                    <p className="font-medium">{String(preview.title ?? "")}</p>
                    <p className="text-xs text-muted-foreground">
                      {(preview.authors as string[] | undefined)?.join(", ")}
                      {preview.venue ? ` · ${preview.venue}` : ""}{preview.year ? ` · ${preview.year}` : ""}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={addReference} disabled={busy}>Add to lit review</Button>
                      <Button size="sm" variant="ghost" onClick={() => setPreview(null)}>Discard</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                Literature review ({overview.lit_review.length})
              </p>
              {overview.lit_review.length === 0 ? (
                <p className="text-sm text-muted-foreground">No references yet.</p>
              ) : (
                <ul className="space-y-1.5 text-sm">
                  {overview.lit_review.map((e) => (
                    <li key={e.id} className="border-b pb-1.5 last:border-b-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{e.title}</span>
                        <Badge variant="outline" className="text-[10px]">{e.read_status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {e.authors.join(", ")}{e.venue ? ` · ${e.venue}` : ""}{e.year ? ` · ${e.year}` : ""}
                      </p>
                      {e.user_notes_md && <Markdown className="text-xs mt-1">{e.user_notes_md}</Markdown>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                Drafts ({overview.drafts.length})
              </p>
              {overview.drafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No drafts yet.</p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {overview.drafts.map((d) => (
                    <li key={d.id} className="flex items-center gap-2">
                      <span>{d.title}</span>
                      <Badge variant="outline" className="text-[10px]">{d.kind}</Badge>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(d.updated_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Research groups</CardTitle>
          <CardDescription>Labs and reading groups — org-visible, open to join.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={createGroup} className="flex gap-2">
            <Input
              placeholder="New group name (e.g. ML Theory reading group)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              minLength={3}
              maxLength={160}
            />
            <Button type="submit" disabled={busy || groupName.trim().length < 3}>
              <Plus className="h-4 w-4 mr-1" /> Create
            </Button>
          </form>
          {groups.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">No research groups yet.</p>
          )}
          <ul className="space-y-2 text-sm">
            {groups.map((g) => (
              <li key={g.id} className="flex items-center gap-2 flex-wrap border rounded-md p-3">
                <span className="font-medium">{g.name}</span>
                {g.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                ))}
                {g.is_member && <Badge variant="outline" className="text-[10px]">member</Badge>}
                <span className="text-xs text-muted-foreground">
                  {g.member_count} member{g.member_count === 1 ? "" : "s"}
                  {g.owner_name ? ` · PI ${g.owner_name}` : ""}
                </span>
                <div className="ml-auto flex gap-1">
                  {g.user_id !== me?.id && (
                    <Button size="sm" variant={g.is_member ? "ghost" : "default"} disabled={busy} onClick={() => joinLeave(g)}>
                      {g.is_member
                        ? <><LogOut className="h-3.5 w-3.5 mr-1" /> Leave</>
                        : <><LogIn className="h-3.5 w-3.5 mr-1" /> Join</>}
                    </Button>
                  )}
                  {g.user_id === me?.id && (
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => removeGroup(g)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

/**
 * Research Collaboration — R-1 of the Phase 16.2 program
 * (docs/RESEARCH_TIER_16_2_16_5_SPEC.md).
 *
 * Extends the existing solo research workspace (AI Research) with:
 *  - workspace sharing (owner adds org members by email; members get READ
 *    access — collaborator co-editing lands in R-2)
 *  - research groups (labs / reading groups, org-visible, open-join)
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/eureka-api";
import { useAuthStore } from "@/stores/auth";
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
type MyWs = { id: string; title: string };
type WsMember = { user_id: string; role: string; name: string | null };

export default function ResearchCollabPage() {
  const me = useAuthStore((s) => s.user);
  const [groups, setGroups] = useState<RGroup[]>([]);
  const [shared, setShared] = useState<SharedWs[]>([]);
  const [myWs, setMyWs] = useState<MyWs[]>([]);
  const [wsMembers, setWsMembers] = useState<Record<string, WsMember[]>>({});
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
    setBusy(true);
    try {
      await api(`/me/research/workspaces/${wsId}/members`, {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), role: "viewer" }),
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
          Share your research workspaces and join lab groups. Shared members
          get read access today; co-editing arrives in the next research wave.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Share my workspaces</CardTitle>
          <CardDescription>
            Give org members read access to a workspace (by email).
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
                    <div className="ml-auto flex gap-1">
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
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

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

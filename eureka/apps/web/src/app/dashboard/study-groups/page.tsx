"use client";

/**
 * Study Groups — exam/tier cohorts (ops/db/24_study_groups.sql).
 * v1: org-visible, open-join. Group discussions open in Community
 * scoped via /dashboard/community?group={id}.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { useAuthStore } from "@/stores/auth";
import { UsersRound, Plus, MessageSquare, LogOut, LogIn, Trash2 } from "lucide-react";

type Group = {
  id: string;
  user_id: string;
  name: string;
  description_md: string | null;
  exam_code: string | null;
  tier: string | null;
  member_count: number;
  is_member: boolean;
  owner_name: string | null;
  created_at: string;
};

const EXAMS = [
  "", "PATENT_BAR", "USMLE", "LSAT", "MCAT", "SAT", "GRE", "GMAT",
  "FE_EE", "PE_EE", "FME", "SECURITY_PLUS", "CISSP",
];

export default function StudyGroupsPage() {
  const me = useAuthStore((s) => s.user);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examFilter, setExamFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description_md: "", exam_code: "" });
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = examFilter ? `?exam_code=${examFilter}` : "";
      const rows = await api<Group[]>(`/study-groups${params}`);
      setGroups(Array.isArray(rows) ? rows : []);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examFilter]);

  async function createGroup(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/study-groups", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          description_md: form.description_md.trim() || null,
          exam_code: form.exam_code || null,
        }),
      });
      setShowForm(false);
      setForm({ name: "", description_md: "", exam_code: "" });
      await load();
    } catch (e2) {
      alert(String((e2 as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function joinLeave(g: Group) {
    setBusy(true);
    try {
      await api(`/study-groups/${g.id}/${g.is_member ? "leave" : "join"}`, { method: "POST" });
      await load();
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function remove(g: Group) {
    if (!window.confirm(`Delete study group "${g.name}"? Its group threads are removed too.`)) return;
    setBusy(true);
    try {
      await api(`/study-groups/${g.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      alert(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <UsersRound className="h-7 w-7 text-primary" /> Study Groups
          </h1>
          <p className="text-muted-foreground mt-1">
            Cohorts around a specific exam. Groups are visible to your whole
            organization and open to join; you must join to post in a group.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "New group"}
        </Button>
      </div>

      <div>
        <label className="text-xs text-muted-foreground">Exam</label>
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="block rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {EXAMS.map((x) => (
            <option key={x} value={x}>{x || "All exams"}</option>
          ))}
        </select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New study group</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={createGroup} className="space-y-3">
              <Input
                placeholder="Group name (e.g. Patent Bar Oct 2026 cohort)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required minLength={3} maxLength={160}
              />
              <Textarea
                placeholder="What is this group about? (markdown ok)"
                value={form.description_md}
                onChange={(e) => setForm({ ...form, description_md: e.target.value })}
                rows={3}
              />
              <select
                value={form.exam_code}
                onChange={(e) => setForm({ ...form, exam_code: e.target.value })}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {EXAMS.map((x) => (
                  <option key={x} value={x}>{x || "No specific exam"}</option>
                ))}
              </select>
              <div className="flex justify-end">
                <Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && groups.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No study groups yet{examFilter ? ` for ${examFilter}` : ""}. Start one.
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {groups.map((g) => (
          <Card key={g.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{g.name}</span>
                {g.exam_code && <Badge variant="outline" className="text-[10px]">{g.exam_code}</Badge>}
                {g.is_member && <Badge variant="secondary" className="text-[10px]">member</Badge>}
              </div>
              {g.description_md && (
                <p className="text-sm text-muted-foreground line-clamp-2">{g.description_md}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {g.member_count} member{g.member_count === 1 ? "" : "s"}
                {g.owner_name ? ` · started by ${g.owner_name}` : ""}
              </p>
              <div className="flex items-center gap-2 pt-1">
                {g.is_member && (
                  <Link href={`/dashboard/community?group=${g.id}`}>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3.5 w-3.5 mr-1" /> Discussions
                    </Button>
                  </Link>
                )}
                {g.user_id !== me?.id && (
                  <Button size="sm" variant={g.is_member ? "ghost" : "default"} disabled={busy} onClick={() => joinLeave(g)}>
                    {g.is_member
                      ? <><LogOut className="h-3.5 w-3.5 mr-1" /> Leave</>
                      : <><LogIn className="h-3.5 w-3.5 mr-1" /> Join</>}
                  </Button>
                )}
                {g.user_id === me?.id && (
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => remove(g)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

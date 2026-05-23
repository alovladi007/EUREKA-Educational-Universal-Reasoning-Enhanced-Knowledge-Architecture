"use client";

/**
 * /dashboard/graduate/admin — IN-SHELL admin view of graduate programs.
 *
 * Replaces the /institutions/graduate-programs duplicate. Same backend
 * (POST /graduate/programs + GET /graduate/programs), but inside the
 * dashboard sidebar so the user never has to jump between two shells.
 *
 * Visible to org_admin + super_admin only (the sub-nav hides the tab
 * for other roles; this page also re-checks and renders a friendly
 * "admin only" message if reached directly).
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import { Settings, PlusCircle, Archive } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

type Program = {
  id: string;
  slug: string;
  name: string;
  degree_kind: string;
  department: string | null;
  target_years: number;
  min_credits: number;
  requires_thesis: boolean;
  requires_qualifying_exam: boolean;
  completion_cert_code: string | null;
  status: string;
  created_at: string;
};

const DEGREE_KINDS = [
  { value: "masters_thesis", label: "Master's (thesis)" },
  { value: "masters_coursework", label: "Master's (coursework)" },
  { value: "masters_professional", label: "Master's (professional)" },
  { value: "phd", label: "PhD" },
  { value: "doctoral_professional", label: "Doctorate (professional)" },
  { value: "postdoc", label: "Postdoc" },
  { value: "certificate", label: "Certificate" },
];

export default function GraduateAdminPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const role = user?.role || "";
  const isAdmin = role === "org_admin" || role === "super_admin";

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    slug: "",
    name: "",
    degree_kind: "phd",
    department: "",
    target_years: 5,
    min_credits: 72,
    requires_thesis: true,
    requires_qualifying_exam: true,
    completion_cert_code: "",
  });

  async function refresh() {
    setLoading(true);
    try {
      const rows = await api<Program[]>("/graduate/programs");
      setPrograms(Array.isArray(rows) ? rows : []);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api<Program>("/graduate/programs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          completion_cert_code: form.completion_cert_code || null,
          department: form.department || null,
          skill_targets: [],
        }),
      });
      setShowForm(false);
      setForm({ ...form, slug: "", name: "", completion_cert_code: "" });
      await refresh();
      router.push(`/dashboard/graduate/admin/${created.id}`);
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function archive(id: string) {
    if (!window.confirm("Archive this program? It will be hidden from learners but historical enrollments remain.")) return;
    try {
      await api(`/graduate/programs/${id}`, { method: "PATCH", body: JSON.stringify({ status: "archived" }) });
      await refresh();
    } catch (e) {
      alert(String((e as Error).message));
    }
  }

  if (user && !isAdmin) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-2">
          <p className="text-base">Admin only.</p>
          <p className="text-sm text-muted-foreground">
            You need <code className="font-mono text-xs">org_admin</code> or{" "}
            <code className="font-mono text-xs">super_admin</code> role to manage graduate programs.
          </p>
        </CardContent>
      </Card>
    );
  }

  const visible = showArchived ? programs : programs.filter((p) => p.status !== "archived");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Settings className="h-6 w-6 text-primary" />
            Manage graduate programs
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Author and maintain the graduate programs your organization offers.
            Once a program is <Badge variant="default" className="text-[10px]">active</Badge> it
            shows up in <Link href="/dashboard/graduate/programs" className="text-primary hover:underline">the learner browser</Link>.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
            Show archived
          </label>
          <Button onClick={() => setShowForm(!showForm)}>
            <PlusCircle className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "New program"}
          </Button>
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
          <CardHeader>
            <CardTitle className="text-base">Create graduate program</CardTitle>
            <CardDescription>
              The slug becomes part of the URL; the completion cert code is what graduates
              receive in their Open Badges 3.0 transcript on graduation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                    placeholder="phd-cs"
                    required
                    pattern="[a-z0-9][a-z0-9-]*"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Display name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="PhD in Computer Science"
                    required
                    minLength={3}
                  />
                </div>
                <div>
                  <Label htmlFor="degree_kind">Degree kind</Label>
                  <select
                    id="degree_kind"
                    value={form.degree_kind}
                    onChange={(e) => setForm({ ...form, degree_kind: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {DEGREE_KINDS.map((k) => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <Label htmlFor="target_years">Target years</Label>
                  <Input
                    id="target_years"
                    type="number" step="0.5" min={0.5} max={12}
                    value={form.target_years}
                    onChange={(e) => setForm({ ...form, target_years: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="min_credits">Min credits</Label>
                  <Input
                    id="min_credits"
                    type="number" min={0} max={500}
                    value={form.min_credits}
                    onChange={(e) => setForm({ ...form, min_credits: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="completion_cert_code">Completion cert code (optional)</Label>
                  <Input
                    id="completion_cert_code"
                    value={form.completion_cert_code}
                    onChange={(e) => setForm({ ...form, completion_cert_code: e.target.value })}
                    placeholder="phd-cs-2026"
                  />
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.requires_thesis}
                    onChange={(e) => setForm({ ...form, requires_thesis: e.target.checked })}
                  />
                  Requires thesis
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.requires_qualifying_exam}
                    onChange={(e) => setForm({ ...form, requires_qualifying_exam: e.target.checked })}
                  />
                  Requires qualifying exam
                </label>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating…" : "Create program"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-muted-foreground text-sm">Loading…</p>}

      {!loading && visible.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {programs.length === 0
              ? "No graduate programs yet. Click \"New program\" above to author your first one."
              : "All programs are archived. Toggle \"Show archived\" to see them."}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <Card key={p.id} className="hover:border-primary/40 transition-colors h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <Link href={`/dashboard/graduate/admin/${p.id}`} className="flex-1 min-w-0">
                  <CardTitle className="text-base hover:underline">{p.name}</CardTitle>
                </Link>
                <Badge variant={p.status === "active" ? "default" : "secondary"}>{p.status}</Badge>
              </div>
              <CardDescription>
                <span className="font-mono text-[11px] text-muted-foreground">{p.slug}</span>
                {p.department && <span className="ml-2 text-muted-foreground">· {p.department}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">{p.degree_kind.replace(/_/g, " ")}</Badge>
                {p.requires_thesis && <Badge variant="outline">thesis</Badge>}
                {p.requires_qualifying_exam && <Badge variant="outline">quals</Badge>}
              </div>
              <div className="text-muted-foreground">
                {p.target_years}y · {p.min_credits} credits · created {formatDate(p.created_at)}
              </div>
              {p.status !== "archived" && (
                <div className="flex justify-end pt-1">
                  <Button variant="ghost" size="sm" onClick={() => archive(p.id)}>
                    <Archive className="h-3.5 w-3.5 mr-1" /> Archive
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

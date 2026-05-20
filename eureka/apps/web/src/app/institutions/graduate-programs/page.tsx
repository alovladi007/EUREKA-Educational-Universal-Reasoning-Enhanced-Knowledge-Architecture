"use client";

/**
 * Phase 16.1 — Institutions admin view of graduate programs.
 * Lists every graduate_programs row for the current org and lets an
 * org_admin spin up a new one (slug + degree_kind + completion cert).
 *
 * Click a program to drill into its detail page.
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
import { BookMarked, PlusCircle } from "lucide-react";

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

export default function GraduateProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setPrograms(rows);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

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
      router.push(`/institutions/graduate-programs/${created.id}`);
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <BookMarked className="h-7 w-7 text-amber-600" />
            Graduate programs
          </h1>
          <p className="text-slate-600 mt-1">
            Master&apos;s, PhD, postdoc, and certificate programs authored by your institution.
            Per the 2026-05 design, each enrollment has a single supervisor — no committees.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-amber-600 hover:bg-amber-700 text-white">
          <PlusCircle className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "New program"}
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
          <CardHeader>
            <CardTitle className="text-base">Create graduate program</CardTitle>
            <CardDescription>
              Slug becomes part of the URL; the completion cert code is what graduates
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
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
                    type="number"
                    step="0.5"
                    min={0.5}
                    max={12}
                    value={form.target_years}
                    onChange={(e) => setForm({ ...form, target_years: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="min_credits">Min credits</Label>
                  <Input
                    id="min_credits"
                    type="number"
                    min={0}
                    max={500}
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
                <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                  {submitting ? "Creating…" : "Create program"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-slate-500">Loading…</p>}

      {!loading && programs.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-slate-500">
            No graduate programs yet. Click <b>New program</b> above to author one.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {programs.map((p) => (
          <Link key={p.id} href={`/institutions/graduate-programs/${p.id}`}>
            <Card className="hover:border-amber-400 transition-colors h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <Badge variant={p.status === "active" ? "default" : "secondary"}>{p.status}</Badge>
                </div>
                <CardDescription>
                  <span className="font-mono text-[11px] text-slate-500">{p.slug}</span>
                  {p.department && <span className="ml-2 text-slate-500">· {p.department}</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-1">
                <div>
                  <Badge variant="outline" className="mr-1">{p.degree_kind}</Badge>
                  {p.requires_thesis && <Badge variant="outline" className="mr-1">thesis</Badge>}
                  {p.requires_qualifying_exam && <Badge variant="outline" className="mr-1">quals</Badge>}
                </div>
                <div className="text-slate-500">
                  {p.target_years}y · {p.min_credits} credits · created {formatDate(p.created_at)}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

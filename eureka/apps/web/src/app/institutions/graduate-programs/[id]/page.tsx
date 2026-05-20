"use client";

/**
 * Phase 16.1 — Graduate program detail (admin).
 * Tabs: overview · skill targets · enrollments.
 * Right now this is a single scroll page; we can split into tabs later if
 * the page grows past a couple screens.
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import { BookMarked, ArrowLeft } from "lucide-react";

type SkillTarget = {
  id: string;
  skill_code: string;
  target_mastery: number;
  is_required: boolean;
  description: string | null;
};

type ProgramDetail = {
  id: string;
  org_id: string;
  slug: string;
  name: string;
  degree_kind: string;
  department: string | null;
  description_md: string | null;
  target_years: number;
  min_credits: number;
  requires_thesis: boolean;
  requires_qualifying_exam: boolean;
  completion_cert_code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  skill_targets: SkillTarget[];
  enrollments_count: number;
};

type Enrollment = {
  id: string;
  user_id: string;
  supervisor_user_id: string | null;
  status: string;
  enrolled_at: string | null;
  expected_graduation: string | null;
  milestones_done: number;
  milestones_total: number;
};

export default function GraduateProgramDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState<string | null>(null);

  // enroll form
  const [enrollUserId, setEnrollUserId] = useState("");
  const [enrollSupervisor, setEnrollSupervisor] = useState("");
  const [enrollYear, setEnrollYear] = useState<number>(new Date().getFullYear() + 4);
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    if (!id) return;
    try {
      const [p, es] = await Promise.all([
        api<ProgramDetail>(`/graduate/programs/${id}`),
        api<Enrollment[]>(`/graduate/programs/${id}/enrollments`),
      ]);
      setProgram(p);
      setEnrollments(es);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  useEffect(() => {
    loadAll();
  }, [id]);

  async function onEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setBusy(true);
    try {
      await api(`/graduate/programs/${id}/enrollments`, {
        method: "POST",
        body: JSON.stringify({
          user_id: enrollUserId.trim(),
          supervisor_user_id: enrollSupervisor.trim() || null,
          expected_graduation_year: Number(enrollYear),
        }),
      });
      setEnrollUserId("");
      setEnrollSupervisor("");
      await loadAll();
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      alert(msg);
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load program</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!program) return <p className="text-slate-500">Loading…</p>;

  return (
    <div className="max-w-5xl space-y-6">
      <Link href="/institutions/graduate-programs" className="inline-flex items-center gap-1 text-sm text-amber-700 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> All graduate programs
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <BookMarked className="h-7 w-7 text-amber-600" />
          {program.name}
        </h1>
        <p className="text-slate-600 mt-1">
          <span className="font-mono text-xs">{program.slug}</span>
          <span className="mx-2">·</span>
          <Badge variant="outline">{program.degree_kind}</Badge>
          <span className="ml-2">{program.department || "—"}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardDescription>Status</CardDescription></CardHeader>
          <CardContent><Badge>{program.status}</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Target length</CardDescription></CardHeader>
          <CardContent className="text-2xl font-semibold">{program.target_years}y</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Min credits</CardDescription></CardHeader>
          <CardContent className="text-2xl font-semibold">{program.min_credits}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Enrolled learners</CardDescription></CardHeader>
          <CardContent className="text-2xl font-semibold">{program.enrollments_count}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skill targets</CardTitle>
          <CardDescription>Phase 4.2 skill codes this program builds.</CardDescription>
        </CardHeader>
        <CardContent>
          {program.skill_targets.length === 0 ? (
            <p className="text-slate-500 text-sm">No skill targets set.</p>
          ) : (
            <ul className="divide-y">
              {program.skill_targets.map((t) => (
                <li key={t.id} className="py-2 text-sm flex justify-between">
                  <span className="font-mono">{t.skill_code}</span>
                  <span className="text-slate-500">
                    target {Math.round(t.target_mastery * 100)}%{t.is_required ? " · required" : " · optional"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enroll a learner</CardTitle>
          <CardDescription>
            One supervisor per enrollment — no committee tracking, by design.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onEnroll} className="grid grid-cols-3 gap-3 items-end">
            <div className="col-span-1">
              <Label htmlFor="user_id">Learner user_id</Label>
              <Input id="user_id" value={enrollUserId} onChange={(e) => setEnrollUserId(e.target.value)} required placeholder="uuid" />
            </div>
            <div className="col-span-1">
              <Label htmlFor="supervisor_user_id">Supervisor user_id (optional)</Label>
              <Input id="supervisor_user_id" value={enrollSupervisor} onChange={(e) => setEnrollSupervisor(e.target.value)} placeholder="uuid" />
            </div>
            <div className="col-span-1">
              <Label htmlFor="year">Expected graduation year</Label>
              <Input id="year" type="number" min={2024} max={2050} value={enrollYear} onChange={(e) => setEnrollYear(Number(e.target.value))} />
            </div>
            <div className="col-span-3 flex justify-end">
              <Button type="submit" disabled={busy} className="bg-amber-600 hover:bg-amber-700 text-white">
                {busy ? "Enrolling…" : "Enroll"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrollments ({enrollments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-slate-500 text-sm">No enrollments yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr><th className="text-left py-1">Learner</th><th className="text-left py-1">Supervisor</th><th className="text-left py-1">Status</th><th className="text-left py-1">Milestones</th><th className="text-left py-1">Expected</th></tr>
              </thead>
              <tbody className="divide-y">
                {enrollments.map((e) => (
                  <tr key={e.id}>
                    <td className="py-1 font-mono text-[11px]">{e.user_id.slice(0, 8)}…</td>
                    <td className="py-1 font-mono text-[11px]">{e.supervisor_user_id ? `${e.supervisor_user_id.slice(0, 8)}…` : "—"}</td>
                    <td className="py-1"><Badge variant="outline">{e.status}</Badge></td>
                    <td className="py-1 tabular-nums">{e.milestones_done}/{e.milestones_total}</td>
                    <td className="py-1">{e.expected_graduation || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

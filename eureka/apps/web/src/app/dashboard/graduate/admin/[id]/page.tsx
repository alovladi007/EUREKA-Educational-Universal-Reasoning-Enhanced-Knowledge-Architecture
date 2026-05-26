"use client";

/**
 * /dashboard/graduate/admin/[id] — in-shell admin detail for one program.
 * Combines the program metadata view + the list of enrollments under it.
 * Replaces /institutions/graduate-programs/[id].
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";
import { ArrowLeft, BookMarked, Archive, RotateCcw } from "lucide-react";
import toast from 'react-hot-toast';

type SkillTarget = {
  id: string;
  skill_code: string;
  target_mastery: number;
  is_required: boolean;
};

type ProgramDetail = {
  id: string;
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
  expected_graduation: string | null;
  milestones_done?: number;
  milestones_total?: number;
};

export default function GraduateAdminDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!id) return;
    try {
      const [p, es] = await Promise.all([
        api<ProgramDetail>(`/graduate/programs/${id}`),
        api<Enrollment[]>(`/graduate/programs/${id}/enrollments`).catch(() => [] as Enrollment[]),
      ]);
      setProgram(p);
      setEnrollments(Array.isArray(es) ? es : []);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [id]);

  async function setStatus(status: string) {
    if (!id) return;
    setBusy(true);
    try {
      await api(`/graduate/programs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await refresh();
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-3 max-w-3xl">
        <Link href="/dashboard/graduate/admin" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Manage programs
        </Link>
        <Alert variant="destructive">
          <AlertTitle>Could not load program</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (!program) return <p className="text-muted-foreground">Loading…</p>;

  const liveEnrollments = enrollments.filter((e) => e.status !== "withdrawn" && e.status !== "dismissed");
  const pastEnrollments = enrollments.filter((e) => e.status === "withdrawn" || e.status === "dismissed");

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/dashboard/graduate/admin" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Manage programs
      </Link>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <BookMarked className="h-7 w-7 text-primary" />
            {program.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
            <span className="font-mono text-xs">{program.slug}</span>
            <Badge variant="outline">{program.degree_kind.replace(/_/g, " ")}</Badge>
            <Badge variant={program.status === "active" ? "default" : "secondary"}>{program.status}</Badge>
            {program.department && <span className="text-muted-foreground">· {program.department}</span>}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {program.status === "draft" && (
            <Button onClick={() => setStatus("active")} disabled={busy}>Publish</Button>
          )}
          {program.status === "active" && (
            <Button onClick={() => setStatus("archived")} disabled={busy} variant="destructive">
              <Archive className="h-3.5 w-3.5 mr-1" /> Archive
            </Button>
          )}
          {program.status === "archived" && (
            <Button onClick={() => setStatus("active")} disabled={busy} variant="outline">
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reactivate
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardDescription>Target length</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{program.target_years}y</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Min credits</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{program.min_credits}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Skill targets</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{program.skill_targets?.length ?? 0}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Enrolled learners</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{liveEnrollments.length}</CardContent></Card>
      </div>

      {program.description_md && (
        <Card>
          <CardHeader><CardTitle className="text-base">About this program</CardTitle></CardHeader>
          <CardContent><p className="text-sm whitespace-pre-wrap">{program.description_md}</p></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            <li>· {program.min_credits} credits</li>
            <li>· Target completion in {program.target_years} years</li>
            {program.requires_qualifying_exam && <li>· Qualifying exam required</li>}
            {program.requires_thesis && <li>· Thesis defense required</li>}
            {program.completion_cert_code && (
              <li>· Confers <code className="font-mono text-xs">{program.completion_cert_code}</code> Open Badges 3.0 credential on graduation</li>
            )}
          </ul>
        </CardContent>
      </Card>

      {(program.skill_targets?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill targets</CardTitle>
            <CardDescription>Phase 4.2 skills this program builds toward.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {program.skill_targets.map((t) => (
                <li key={t.id} className="py-2 flex justify-between">
                  <span className="font-mono">{t.skill_code}</span>
                  <span className="text-muted-foreground">
                    target {Math.round(t.target_mastery * 100)}% {t.is_required ? "· required" : "· optional"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active enrollments ({liveEnrollments.length})</CardTitle>
          {pastEnrollments.length > 0 && (
            <CardDescription>{pastEnrollments.length} past enrollment{pastEnrollments.length === 1 ? "" : "s"} hidden.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {liveEnrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active enrollments yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b">
                <tr>
                  <th className="py-1.5 font-medium">Learner</th>
                  <th className="py-1.5 font-medium">Supervisor</th>
                  <th className="py-1.5 font-medium">Status</th>
                  <th className="py-1.5 font-medium">Expected</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {liveEnrollments.map((e) => (
                  <tr key={e.id}>
                    <td className="py-1.5 font-mono text-[11px]">{e.user_id.slice(0, 8)}</td>
                    <td className="py-1.5 font-mono text-[11px]">
                      {e.supervisor_user_id ? e.supervisor_user_id.slice(0, 8) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-1.5"><Badge variant="outline">{e.status}</Badge></td>
                    <td className="py-1.5">{e.expected_graduation || <span className="text-muted-foreground">—</span>}</td>
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

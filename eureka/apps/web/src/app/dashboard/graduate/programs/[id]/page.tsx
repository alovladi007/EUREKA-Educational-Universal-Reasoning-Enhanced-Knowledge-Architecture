"use client";

/**
 * /dashboard/graduate/programs/[id] — learner-side program detail.
 * Shows the program info + skill targets + an "Enroll me" button that
 * POSTs /me/graduate/programs/{id}/enroll then redirects to the new
 * enrollment detail page.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import { ArrowLeft, BookMarked, CheckCircle2 } from "lucide-react";

type SkillTarget = {
  id: string;
  skill_code: string;
  target_mastery: number;
  is_required: boolean;
  description: string | null;
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

type MyEnrolRow = { enrollment_id: string; program_id: string };

export default function LearnerProgramDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [alreadyEnrolledAs, setAlreadyEnrolledAs] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [p, me] = await Promise.all([
          api<ProgramDetail>(`/graduate/programs/${id}`),
          api<{ enrollments: MyEnrolRow[] }>("/me/graduate").catch(() => ({ enrollments: [] as MyEnrolRow[] })),
        ]);
        setProgram(p);
        const existing = (me?.enrollments ?? []).find((e) => e.program_id === id);
        setAlreadyEnrolledAs(existing ? existing.enrollment_id : null);
      } catch (e) {
        setError(String((e as Error).message));
      }
    })();
  }, [id]);

  async function enroll() {
    if (!id) return;
    setEnrolling(true);
    try {
      const e = await api<{ id: string }>(`/me/graduate/programs/${id}/enroll`, { method: "POST" });
      router.push(`/dashboard/graduate/enrollments/${e.id}`);
    } catch (err) {
      const msg = err instanceof ApiError ? `${err.status} — ${JSON.stringify(err.detail)}` : (err as Error).message;
      alert(msg);
    } finally {
      setEnrolling(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-3 max-w-2xl">
        <Link href="/dashboard/graduate/programs" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> All programs
        </Link>
        <Alert variant="destructive">
          <AlertTitle>Could not load program</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (!program) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/dashboard/graduate/programs" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> All programs
      </Link>

      <div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <BookMarked className="h-7 w-7 text-primary" />
              {program.name}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono text-xs">{program.slug}</span>
              <Badge variant="outline">{program.degree_kind}</Badge>
              {program.department && <span>· {program.department}</span>}
              <Badge variant={program.status === "active" ? "default" : "secondary"}>{program.status}</Badge>
            </p>
          </div>
          <div className="shrink-0">
            {alreadyEnrolledAs ? (
              <Link href={`/dashboard/graduate/enrollments/${alreadyEnrolledAs}`}>
                <Button variant="outline">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Open my enrollment
                </Button>
              </Link>
            ) : (
              <Button onClick={enroll} disabled={enrolling || program.status !== "active"}>
                {enrolling ? "Enrolling…" : "Enroll me"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardDescription>Target length</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{program.target_years}y</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Min credits</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{program.min_credits}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Skill targets</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{program.skill_targets?.length ?? 0}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Enrolled learners</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{program.enrollments_count}</CardContent></Card>
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
            {program.completion_cert_code && <li>· Confers Open Badges 3.0 credential <code className="font-mono text-xs">{program.completion_cert_code}</code> on graduation</li>}
          </ul>
        </CardContent>
      </Card>

      {(program.skill_targets?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill targets</CardTitle>
            <CardDescription>Phase 4.2 skill codes this program builds.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {program.skill_targets.map((t) => (
                <li key={t.id} className="py-2 flex justify-between">
                  <span className="font-mono">{t.skill_code}</span>
                  <span className="text-muted-foreground">
                    target {Math.round(t.target_mastery * 100)}%{t.is_required ? " · required" : " · optional"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Metadata</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Created</dt><dd>{formatDate(program.created_at)}</dd>
            <dt className="text-muted-foreground">Updated</dt><dd>{program.updated_at ? formatDate(program.updated_at) : "—"}</dd>
            <dt className="text-muted-foreground">Program ID</dt><dd className="font-mono text-[11px]">{program.id}</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

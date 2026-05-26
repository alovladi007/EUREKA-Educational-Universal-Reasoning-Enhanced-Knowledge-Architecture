"use client";

/**
 * /dashboard/graduate/enrollments/[id] — full enrollment detail:
 * the program info, every milestone (not just "next"), submit button
 * on submittable ones, lifecycle action buttons (withdraw, leave),
 * supervisor decision notes.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import { ArrowLeft, GraduationCap, Clock, FileText, MessageSquare, LogOut } from "lucide-react";
import toast from 'react-hot-toast';

type Enrollment = {
  id: string;
  program_id: string;
  user_id: string;
  supervisor_user_id: string | null;
  status: string;
  applied_at: string | null;
  admitted_at: string | null;
  enrolled_at: string | null;
  expected_graduation: string | null;
  graduated_at: string | null;
  withdrawn_at: string | null;
  withdrawal_reason: string | null;
  credits_earned: number;
  milestones_done: number;
  milestones_total: number;
  gpa: number | null;
  research_focus: string | null;
  created_at: string;
  updated_at: string;
};

type Milestone = {
  id: string;
  enrollment_id: string;
  kind: string;
  title: string;
  description_md: string | null;
  sequence: number;
  due_at: string | null;
  status: string;
  submitted_at: string | null;
  decided_at: string | null;
  decided_by: string | null;
  decision_notes: string | null;
  artifact_url: string | null;
  counts_for_graduation: boolean;
  created_at: string;
};

type Program = { id: string; name: string; degree_kind: string };

const ACTIONABLE = new Set(["not_started", "in_progress", "changes_requested"]);

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "approved" ? "default" :
    status === "submitted" ? "secondary" :
    status === "changes_requested" ? "destructive" :
    status === "failed" ? "destructive" :
    "outline";
  return <Badge variant={tone as never}>{status.replace(/_/g, " ")}</Badge>;
}

export default function EnrollmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [enrol, setEnrol] = useState<Enrollment | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!id) return;
    try {
      const [ms, mine] = await Promise.all([
        api<Milestone[]>(`/graduate/enrollments/${id}/milestones`).catch(() => [] as Milestone[]),
        api<{ enrollments: { enrollment_id: string; program_id: string; program_name: string; degree_kind: string }[] }>("/me/graduate").catch(() => ({ enrollments: [] })),
      ]);
      setMilestones(Array.isArray(ms) ? ms : []);
      const row = mine.enrollments.find((e) => e.enrollment_id === id);
      if (row) {
        setProgram({ id: row.program_id, name: row.program_name, degree_kind: row.degree_kind });
        // Pull full enrollment via the admin-shaped endpoint (we're the learner so we pass auth)
        const full = await api<Enrollment>(`/graduate/enrollments/${id}`).catch(async () => {
          // No GET-by-id exists for enrollments — synthesize from /me/graduate row
          return null as unknown as Enrollment;
        });
        if (full && full.id) setEnrol(full);
        else setEnrol({
          id, program_id: row.program_id, user_id: "", supervisor_user_id: null,
          status: "enrolled", applied_at: null, admitted_at: null, enrolled_at: null,
          expected_graduation: null, graduated_at: null, withdrawn_at: null,
          withdrawal_reason: null, credits_earned: 0,
          milestones_done: 0, milestones_total: 0, gpa: null, research_focus: null,
          created_at: "", updated_at: "",
        });
      } else {
        setError("You're not enrolled in that program");
      }
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  useEffect(() => { refresh(); }, [id]);

  async function submitMilestone(mid: string) {
    const url = window.prompt("Optional artifact URL (PDF, repo, presentation) — leave blank to skip");
    setBusy(true);
    try {
      await api(`/graduate/milestones/${mid}/submit`, {
        method: "POST",
        body: JSON.stringify({ artifact_url: url || null }),
      });
      await refresh();
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      toast.error(msg);
    } finally { setBusy(false); }
  }

  async function lifecycle(action: string, prompt?: string) {
    if (!id) return;
    const reason = prompt ? window.prompt(prompt) : undefined;
    if (prompt && reason === null) return; // cancelled
    setBusy(true);
    try {
      await api(`/graduate/enrollments/${id}/action`, {
        method: "POST",
        body: JSON.stringify({ action, reason: reason || null }),
      });
      await refresh();
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      toast.error(msg);
    } finally { setBusy(false); }
  }

  if (error) {
    return (
      <div className="space-y-3 max-w-2xl">
        <Link href="/dashboard/graduate/enrollments" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> All enrollments
        </Link>
        <Alert variant="destructive"><AlertTitle>Could not load enrollment</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
      </div>
    );
  }
  if (!enrol || !program) return <p className="text-muted-foreground">Loading…</p>;

  const canLeave = enrol.status === "enrolled";
  const canResume = enrol.status === "on_leave";
  const canWithdraw = !["withdrawn", "graduated", "dismissed"].includes(enrol.status);

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/dashboard/graduate/enrollments" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> All enrollments
      </Link>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <GraduationCap className="h-7 w-7 text-primary" />
            {program.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
            <Badge variant="outline">{program.degree_kind}</Badge>
            <Badge>{enrol.status}</Badge>
            {enrol.expected_graduation && <span className="text-muted-foreground">· expected {enrol.expected_graduation}</span>}
            {enrol.supervisor_user_id && <span className="text-muted-foreground">· supervisor {enrol.supervisor_user_id.slice(0, 8)}</span>}
          </div>
        </div>
        <Link href={`/dashboard/graduate/programs/${program.id}`}>
          <Button variant="outline" size="sm">View program</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardDescription>Milestones</CardDescription></CardHeader><CardContent className="text-2xl font-bold tabular-nums">{enrol.milestones_done}/{enrol.milestones_total}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Credits earned</CardDescription></CardHeader><CardContent className="text-2xl font-bold tabular-nums">{enrol.credits_earned}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>GPA</CardDescription></CardHeader><CardContent className="text-2xl font-bold">{enrol.gpa ?? "—"}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Status</CardDescription></CardHeader><CardContent><Badge>{enrol.status}</Badge></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Milestones ({milestones.length})</CardTitle>
          <CardDescription>Submit work, see supervisor decisions, track sequence.</CardDescription>
        </CardHeader>
        <CardContent>
          {milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No milestones yet — your supervisor will add them. (Admins can author at{" "}
              <Link href={`/institutions/graduate-programs/${program.id}`} className="text-primary hover:underline">the program detail page</Link>.)
            </p>
          ) : (
            <ul className="divide-y">
              {milestones.map((m) => (
                <li key={m.id} className="py-3 flex justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{m.title}</span>
                      <Badge variant="outline" className="text-[10px]">{m.kind.replace(/_/g, " ")}</Badge>
                      <StatusBadge status={m.status} />
                      {m.due_at && (
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-0.5" /> due {m.due_at}
                        </span>
                      )}
                    </div>
                    {m.description_md && <p className="text-xs text-muted-foreground mt-1">{m.description_md}</p>}
                    {m.artifact_url && (
                      <p className="text-xs mt-1">
                        <FileText className="h-3 w-3 inline mr-1" />
                        <a href={m.artifact_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {m.artifact_url}
                        </a>
                      </p>
                    )}
                    {m.decision_notes && (
                      <p className="text-xs mt-1 italic text-muted-foreground">
                        <MessageSquare className="h-3 w-3 inline mr-1" />
                        Supervisor: {m.decision_notes}
                      </p>
                    )}
                  </div>
                  {ACTIONABLE.has(m.status) && (
                    <div className="shrink-0">
                      <Button size="sm" onClick={() => submitMilestone(m.id)} disabled={busy}>
                        Submit
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrollment actions</CardTitle>
          <CardDescription>Take a leave of absence, resume, or withdraw.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {canLeave && (
            <Button variant="outline" size="sm" disabled={busy} onClick={() => lifecycle("leave")}>
              Take leave
            </Button>
          )}
          {canResume && (
            <Button variant="outline" size="sm" disabled={busy} onClick={() => lifecycle("resume")}>
              Resume
            </Button>
          )}
          {canWithdraw && (
            <Button variant="destructive" size="sm" disabled={busy} onClick={() => lifecycle("withdraw", "Reason for withdrawal (optional):")}>
              <LogOut className="h-3.5 w-3.5 mr-1" /> Withdraw
            </Button>
          )}
          {!canLeave && !canResume && !canWithdraw && (
            <p className="text-xs text-muted-foreground">
              This enrollment is in a terminal state ({enrol.status}). No further actions possible.
            </p>
          )}
        </CardContent>
      </Card>

      {(enrol.applied_at || enrol.admitted_at || enrol.enrolled_at || enrol.graduated_at || enrol.withdrawn_at) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lifecycle timestamps</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {enrol.applied_at && (<><dt className="text-muted-foreground">Applied</dt><dd>{formatDate(enrol.applied_at)}</dd></>)}
              {enrol.admitted_at && (<><dt className="text-muted-foreground">Admitted</dt><dd>{formatDate(enrol.admitted_at)}</dd></>)}
              {enrol.enrolled_at && (<><dt className="text-muted-foreground">Enrolled</dt><dd>{formatDate(enrol.enrolled_at)}</dd></>)}
              {enrol.graduated_at && (<><dt className="text-muted-foreground">Graduated</dt><dd>{formatDate(enrol.graduated_at)}</dd></>)}
              {enrol.withdrawn_at && (<><dt className="text-muted-foreground">Withdrawn</dt><dd>{formatDate(enrol.withdrawn_at)}</dd></>)}
              {enrol.withdrawal_reason && (<><dt className="text-muted-foreground">Reason</dt><dd>{enrol.withdrawal_reason}</dd></>)}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

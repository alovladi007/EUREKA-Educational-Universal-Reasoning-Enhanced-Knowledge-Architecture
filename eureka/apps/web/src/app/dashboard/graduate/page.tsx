"use client";

/**
 * Phase 17.1 — Graduate tier dashboard page (in-shell).
 *
 * Previously a redirect to /graduate, which bounced learners out of the
 * dashboard sidebar into a different top-bar shell. This page now lives
 * IN the dashboard (same sidebar / header) and pulls from the same live
 * APIs as /graduate: /me/graduate (Phase 16.1 rollup) plus the per-
 * enrollment milestone list.
 *
 * Per the 2026-05 design constraint there are no advisors / committees —
 * each enrollment has a single optional supervisor, and milestones drive
 * the workflow.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import {
  GraduationCap, Sigma, BarChart3, Atom, Microscope, FlaskConical,
  BookMarked, Clock, ArrowRight,
} from "lucide-react";

type MyEnrol = {
  enrollment_id: string;
  program_id: string;
  program_name: string;
  degree_kind: string;
  status: string;
  milestones_done: number;
  milestones_total: number;
  next_milestone_title: string | null;
  next_milestone_due_at: string | null;
  expected_graduation: string | null;
  supervisor_user_id: string | null;
};

type Milestone = {
  id: string;
  enrollment_id: string;
  kind: string;
  title: string;
  status: string;
  due_at: string | null;
  artifact_url: string | null;
  decision_notes?: string | null;
};

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));
  return (
    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "approved" ? "default" :
    status === "submitted" ? "secondary" :
    status === "changes_requested" ? "destructive" :
    status === "failed" ? "destructive" :
    "outline";
  return <Badge variant={tone as never}>{status.replace(/_/g, " ")}</Badge>;
}

export default function DashboardGraduatePage() {
  const [rows, setRows] = useState<MyEnrol[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const body = await api<{ enrollments: MyEnrol[] }>("/me/graduate");
        setRows(body.enrollments ?? []);
      } catch (e) {
        setError(String((e as Error).message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function loadMilestones(eid: string) {
    if (milestones[eid]) return;
    try {
      const list = await api<Milestone[]>(`/graduate/enrollments/${eid}/milestones`);
      setMilestones((m) => ({ ...m, [eid]: list ?? [] }));
    } catch {
      setMilestones((m) => ({ ...m, [eid]: [] }));
    }
  }

  async function submitMilestone(mid: string, eid: string) {
    const url = window.prompt("Optional artifact URL (PDF, repo, etc.) — leave blank to skip");
    try {
      await api(`/graduate/milestones/${mid}/submit`, {
        method: "POST",
        body: JSON.stringify({ artifact_url: url || null }),
      });
      // Force refresh of this enrollment's milestones.
      setMilestones((m) => {
        const next = { ...m };
        delete next[eid];
        return next;
      });
      await loadMilestones(eid);
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      alert(msg);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <GraduationCap className="h-7 w-7 text-primary" />
            Graduate
          </h1>
          <p className="text-muted-foreground mt-1">
            Your master&apos;s / PhD / postdoc programs, milestones, and research progress.
            Wired to <span className="font-mono text-xs">/me/graduate</span> (Phase 16.1).
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/institutions/graduate-programs">
            <Button variant="outline" size="sm">
              Browse programs (admin) <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load graduate work</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && rows.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground space-y-2">
            <p>You&apos;re not enrolled in any graduate programs yet.</p>
            <p className="text-sm">
              An institution administrator enrolls learners from{" "}
              <Link href="/institutions/graduate-programs" className="text-primary hover:underline">
                /institutions/graduate-programs
              </Link>{" "}
              — once enrolled, your program, supervisor, and milestones show up here.
            </p>
          </CardContent>
        </Card>
      )}

      {rows.map((e) => (
        <Card key={e.enrollment_id}>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="text-base">{e.program_name}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline">{e.degree_kind}</Badge>
                  <span className="text-muted-foreground capitalize">{e.status}</span>
                  {e.expected_graduation && (
                    <span className="text-muted-foreground">· expected {e.expected_graduation}</span>
                  )}
                  {e.supervisor_user_id && (
                    <span className="text-muted-foreground">· supervisor {e.supervisor_user_id.slice(0, 8)}…</span>
                  )}
                </CardDescription>
              </div>
              <button
                className="shrink-0 text-sm text-primary hover:underline whitespace-nowrap"
                onClick={() => {
                  const next = expanded === e.enrollment_id ? null : e.enrollment_id;
                  setExpanded(next);
                  if (next) loadMilestones(next);
                }}
              >
                {expanded === e.enrollment_id ? "Hide milestones" : "Show milestones →"}
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Milestones completed</span>
                <span className="tabular-nums">
                  {e.milestones_done}/{e.milestones_total}
                </span>
              </div>
              <ProgressBar done={e.milestones_done} total={e.milestones_total} />
            </div>
            {e.next_milestone_title && (
              <p className="text-sm">
                <Clock className="h-3.5 w-3.5 inline-block mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">Next up:</span>{" "}
                <span className="font-medium">{e.next_milestone_title}</span>
                {e.next_milestone_due_at && (
                  <span className="text-muted-foreground"> · due {e.next_milestone_due_at}</span>
                )}
              </p>
            )}

            {expanded === e.enrollment_id && (
              <div className="border-t pt-3 mt-2">
                <h3 className="text-sm font-semibold mb-2">Milestones</h3>
                {(milestones[e.enrollment_id] || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No milestones yet — your supervisor will add some.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {(milestones[e.enrollment_id] || []).map((m) => (
                      <li key={m.id} className="py-2 flex justify-between gap-3 items-center">
                        <div className="min-w-0">
                          <div className="font-medium text-sm">{m.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px]">{m.kind.replace(/_/g, " ")}</Badge>
                            <StatusBadge status={m.status} />
                            {m.due_at && <span>due {m.due_at}</span>}
                          </div>
                          {m.decision_notes && (
                            <div className="text-xs text-muted-foreground mt-1 italic">
                              Supervisor: {m.decision_notes}
                            </div>
                          )}
                        </div>
                        {(m.status === "not_started" ||
                          m.status === "in_progress" ||
                          m.status === "changes_requested") && (
                          <Button size="sm" onClick={() => submitMilestone(m.id, e.enrollment_id)}>
                            Submit
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Research Tools preview — these ship in Sessions 16.6 + 16.7 */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Research Tools (Sessions 16.6 + 16.7)
          </CardTitle>
          <CardDescription>
            EUREKA&apos;s research-suite — open access, integrated with your skill graph,
            transcripts, and tutor sessions. Competing surface to Wolfram Alpha / Mathematica.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3 text-xs">
          <ToolPreview icon={Sigma} label="Symbolic math" detail="Algebra, calculus, ODEs (SymPy)" />
          <ToolPreview icon={BarChart3} label="Stats + plotting" detail="Regression, ANOVA, PNG plots (statsmodels + matplotlib)" />
          <ToolPreview icon={Atom} label="Chemistry" detail="Molecule lookup + descriptors (RDKit + PubChem)" />
          <ToolPreview icon={Microscope} label="Biology" detail="Sequence I/O, BLAST helpers (Biopython)" />
          <ToolPreview icon={FlaskConical} label="Units" detail="Dimensional analysis (Pint)" />
          <ToolPreview icon={BookMarked} label="Citation-aware Q&A" detail="CrossRef + arXiv + Semantic Scholar, answered by Claude" />
        </CardContent>
      </Card>
    </div>
  );
}

function ToolPreview({
  icon: Icon, label, detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex items-center gap-2 font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <div className="text-muted-foreground mt-1">{detail}</div>
    </div>
  );
}

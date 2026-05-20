"use client";

/**
 * Phase 16.1 — Learner-side graduate dashboard.
 *
 * Shows my graduate enrollments, milestone progress, and what's next.
 * The "Research Tools" callout previews Phase 16.6 + 16.7 (symbolic math,
 * stats, plotting, units, chemistry, biology, citation-aware Q&A) — the
 * differentiator that justifies choosing EUREKA over a generic grad
 * dashboard.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EurekaNav } from "@/components/eureka-nav";
import { api } from "@/lib/eureka-api";
import { BookMarked, FlaskConical, Sigma, BarChart3, Atom, Microscope } from "lucide-react";

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
};

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));
  return (
    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
      <div className="h-full bg-amber-600 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function MyGraduatePage() {
  const [rows, setRows] = useState<MyEnrol[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const body = await api<{ enrollments: MyEnrol[] }>("/me/graduate");
        setRows(body.enrollments);
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
      setMilestones((m) => ({ ...m, [eid]: list }));
    } catch {
      /* ignore */
    }
  }

  async function submitMilestone(mid: string, eid: string) {
    const url = prompt("Artifact URL (optional)") || "";
    try {
      await api(`/graduate/milestones/${mid}/submit`, {
        method: "POST",
        body: JSON.stringify({ artifact_url: url || null }),
      });
      delete milestones[eid];
      setMilestones({ ...milestones });
      await loadMilestones(eid);
    } catch (e) {
      alert(String((e as Error).message));
    }
  }

  return (
    <>
      <EurekaNav />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <BookMarked className="h-7 w-7 text-amber-600" />
            My graduate work
          </h1>
          <p className="text-slate-600 mt-1">
            Your enrolled programs, milestones, and supervisor decisions. Submit work directly
            from this page.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Could not load</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && <p className="text-slate-500">Loading…</p>}

        {!loading && rows.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-slate-500">
              You&apos;re not enrolled in any graduate programs yet. An institution administrator
              has to enroll you from{" "}
              <Link href="/institutions/graduate-programs" className="text-amber-700 hover:underline">
                /institutions/graduate-programs
              </Link>.
            </CardContent>
          </Card>
        )}

        {rows.map((e) => (
          <Card key={e.enrollment_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{e.program_name}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline">{e.degree_kind}</Badge>
                    <span className="ml-2">{e.status}</span>
                    {e.expected_graduation && (
                      <span className="ml-2 text-slate-500">· expected {e.expected_graduation}</span>
                    )}
                  </CardDescription>
                </div>
                <button
                  className="text-sm text-amber-700 hover:underline"
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
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Milestones completed</span>
                  <span>{e.milestones_done}/{e.milestones_total}</span>
                </div>
                <ProgressBar done={e.milestones_done} total={e.milestones_total} />
              </div>
              {e.next_milestone_title && (
                <p className="text-sm text-slate-700">
                  <span className="text-slate-500">Next up:</span>{" "}
                  <span className="font-medium">{e.next_milestone_title}</span>
                  {e.next_milestone_due_at && (
                    <span className="text-slate-500"> · due {e.next_milestone_due_at}</span>
                  )}
                </p>
              )}

              {expanded === e.enrollment_id && (
                <div className="border-t pt-3 mt-2">
                  <h3 className="text-sm font-semibold mb-2">Milestones</h3>
                  {(milestones[e.enrollment_id] || []).length === 0 ? (
                    <p className="text-xs text-slate-500">No milestones yet — your supervisor will add some.</p>
                  ) : (
                    <ul className="divide-y">
                      {(milestones[e.enrollment_id] || []).map((m) => (
                        <li key={m.id} className="py-2 flex justify-between text-sm items-center">
                          <div>
                            <div className="font-medium">{m.title}</div>
                            <div className="text-xs text-slate-500">
                              {m.kind} · {m.status}{m.due_at && ` · due ${m.due_at}`}
                            </div>
                          </div>
                          {(m.status === "not_started" ||
                            m.status === "in_progress" ||
                            m.status === "changes_requested") && (
                            <button
                              className="rounded-md bg-amber-600 px-3 py-1 text-xs text-white hover:bg-amber-700"
                              onClick={() => submitMilestone(m.id, e.enrollment_id)}
                            >
                              Submit
                            </button>
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

        {/* Research Tools preview — the actual API ships in Phase 16.6/16.7. */}
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-amber-600" /> Research Tools (coming next)
            </CardTitle>
            <CardDescription>
              EUREKA&apos;s research-suite competes with Wolfram Alpha & Mathematica — open access
              and integrated with your skill graph, transcripts, and tutor sessions.
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
    </>
  );
}

function ToolPreview({
  icon: Icon,
  label,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border bg-white p-3">
      <div className="flex items-center gap-2 font-medium text-slate-800">
        <Icon className="h-4 w-4 text-amber-600" />
        {label}
      </div>
      <div className="text-slate-500 mt-1">{detail}</div>
    </div>
  );
}

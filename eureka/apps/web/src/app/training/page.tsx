"use client";

/**
 * Phase 15.5 — Worker training portal.
 * Shows assigned programs (with due dates + progress) and compliance status.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EurekaNav } from "@/components/eureka-nav";
import { EngagementBanner } from "@/components/engagement-banner";
import { api, formatDate } from "@/lib/eureka-api";

type Assignment = {
  id: string;
  program_id: string;
  user_id: string;
  assigned_at: string;
  due_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  status: string;
  progress_pct: number;
  study_plan_id: string | null;
};

type Program = {
  id: string;
  name: string;
  description_md: string | null;
  target_role: string | null;
  target_skill_codes: string[];
  duration_weeks: number;
  is_mandatory: boolean;
};

type Requirement = {
  id: string;
  code: string;
  name: string;
  regulation: string;
  attestation_required: boolean;
  description_md: string | null;
};

type DueDate = {
  id: string;
  requirement_id: string;
  due_at: string;
  last_completed_at: string | null;
  status: "compliant" | "due_soon" | "overdue" | "expired" | "not_applicable";
};

type MyTraining = {
  programs: { assignment: Assignment; program: Program }[];
  compliance: { requirement: Requirement; due_date: DueDate }[];
};

const STATUS_COLOR: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  compliant: "default",
  due_soon: "secondary",
  overdue: "destructive",
  expired: "destructive",
  not_applicable: "outline",
};

export default function MyTrainingPage() {
  const [data, setData] = useState<MyTraining | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [statement, setStatement] = useState<Record<string, string>>({});

  async function reload() {
    try {
      setData(await api<MyTraining>("/me/training"));
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function attest(reqId: string) {
    const text = (statement[reqId] || "").trim();
    if (text.length < 10) {
      setError("Attestation must be at least 10 characters.");
      return;
    }
    setBusy(reqId);
    try {
      await api(`/me/compliance/${reqId}/attest`, {
        method: "POST",
        body: JSON.stringify({ statement: text }),
      });
      setStatement((s) => ({ ...s, [reqId]: "" }));
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <EurekaNav />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">My training</h1>
          <p className="text-slate-600">
            Programs assigned to you + your compliance status.
          </p>
        </div>

        <EngagementBanner />

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data && (
          <>
            <section>
              <h2 className="text-xl font-semibold mb-3">Programs</h2>
              {data.programs.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-slate-500 text-sm">
                      No programs assigned yet. Your employer&apos;s L&amp;D admin will assign these.
                    </p>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-3">
                {data.programs.map(({ assignment, program }) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">{program.name}</CardTitle>
                          <CardDescription>
                            {program.is_mandatory && (
                              <Badge variant="destructive" className="mr-1">mandatory</Badge>
                            )}
                            {program.target_role && (
                              <Badge variant="secondary" className="mr-1">{program.target_role}</Badge>
                            )}
                            {program.duration_weeks} weeks · {program.target_skill_codes.length} skill targets
                          </CardDescription>
                        </div>
                        <Badge variant={assignment.status === "completed" ? "default" : "outline"}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {program.description_md && (
                        <p className="text-sm text-slate-700 whitespace-pre-line">
                          {program.description_md}
                        </p>
                      )}
                      <div>
                        <div className="text-xs text-slate-500 mb-1 flex justify-between">
                          <span>Progress</span>
                          <span>{Number(assignment.progress_pct).toFixed(0)}%</span>
                        </div>
                        <Progress value={Number(assignment.progress_pct)} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Assigned {formatDate(assignment.assigned_at)}</span>
                        {assignment.due_at && (
                          <span>· due {formatDate(assignment.due_at)}</span>
                        )}
                        {assignment.completed_at && (
                          <span>· completed {formatDate(assignment.completed_at)}</span>
                        )}
                      </div>
                      {assignment.study_plan_id && (
                        <Button asChild variant="outline" size="sm">
                          <Link href="/learner">Open my study plan →</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Compliance</h2>
              {data.compliance.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-slate-500 text-sm">
                      No compliance requirements assigned.
                    </p>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-3">
                {data.compliance.map(({ requirement, due_date }) => (
                  <Card key={requirement.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">{requirement.name}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="mr-1 uppercase">
                              {requirement.regulation}
                            </Badge>
                            <code className="text-xs">{requirement.code}</code>
                          </CardDescription>
                        </div>
                        <Badge variant={STATUS_COLOR[due_date.status] || "outline"}>
                          {due_date.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {requirement.description_md && (
                        <p className="text-sm text-slate-700 whitespace-pre-line">
                          {requirement.description_md}
                        </p>
                      )}
                      <div className="text-xs text-slate-500">
                        Due {formatDate(due_date.due_at)}
                        {due_date.last_completed_at && (
                          <> · last completed {formatDate(due_date.last_completed_at)}</>
                        )}
                      </div>
                      {requirement.attestation_required &&
                        ["due_soon", "overdue", "expired"].includes(due_date.status) && (
                          <div className="space-y-2 pt-2 border-t">
                            <p className="text-sm">
                              Attest that you have completed the required training:
                            </p>
                            <Textarea
                              rows={3}
                              value={statement[requirement.id] || ""}
                              onChange={(e) =>
                                setStatement((s) => ({
                                  ...s,
                                  [requirement.id]: e.target.value,
                                }))
                              }
                              placeholder="I have completed the HIPAA training and understand the requirements…"
                            />
                            <Button
                              size="sm"
                              onClick={() => attest(requirement.id)}
                              disabled={busy === requirement.id}
                            >
                              {busy === requirement.id ? "Submitting…" : "Submit attestation"}
                            </Button>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}

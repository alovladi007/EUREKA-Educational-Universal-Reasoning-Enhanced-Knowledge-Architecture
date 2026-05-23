"use client";

/**
 * Phase 16.1 — Graduate overview, in-shell. Updated to navigate to the
 * new in-shell subroutes (Programs / Enrollments / Research) instead of
 * bouncing out to /institutions/graduate-programs.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/eureka-api";
import { GraduationCap, Clock, BookMarked, FolderKanban, Sigma, Layers, ArrowRight } from "lucide-react";

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

type Program = { id: string; slug: string; name: string; degree_kind: string; department: string | null; target_years: number; min_credits: number };

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));
  return (
    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function GraduateOverviewPage() {
  const [rows, setRows] = useState<MyEnrol[]>([]);
  const [available, setAvailable] = useState<Program[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [me, avail] = await Promise.all([
          api<{ enrollments: MyEnrol[] }>("/me/graduate").catch(() => ({ enrollments: [] as MyEnrol[] })),
          api<Program[]>("/me/graduate/available-programs").catch(() => [] as Program[]),
        ]);
        setRows(Array.isArray(me?.enrollments) ? me.enrollments : []);
        setAvailable(Array.isArray(avail) ? avail : []);
      } catch (e) {
        setError(String((e as Error).message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <GraduationCap className="h-7 w-7 text-primary" />
            Graduate
          </h1>
          <p className="text-muted-foreground mt-1">
            Your master&apos;s / PhD / postdoc programs, milestones, and research.
            All in-shell — no more bouncing to a separate admin app.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load graduate work</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/graduate/programs">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                Browse programs
              </CardTitle>
              <CardDescription>
                {available.length} program{available.length === 1 ? "" : "s"} available in your org to enroll in.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/dashboard/graduate/enrollments">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                My enrollments
              </CardTitle>
              <CardDescription>
                {rows.length} active enrollment{rows.length === 1 ? "" : "s"} · view milestones, submit work, see decisions.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/dashboard/graduate/research">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                Research workspace
              </CardTitle>
              <CardDescription>
                Notebooks, reading lists, and citation collections for your research.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && rows.length === 0 && available.length > 0 && (
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <p className="text-base">
              You&apos;re not enrolled in a graduate program yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Your organization has {available.length}{" "}
              {available.length === 1 ? "active program" : "active programs"} you can join.
            </p>
            <div className="pt-2">
              <Link href="/dashboard/graduate/programs">
                <Button>
                  Browse programs <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && rows.length === 0 && available.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <p className="text-base">No graduate programs yet.</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your org admin authors programs at{" "}
              <Link href="/institutions/graduate-programs" className="text-primary hover:underline">
                Institutions → Graduate programs
              </Link>
              . Once a program is set to active, it shows up here for any
              learner in the org to enroll in.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <Link href="/institutions/graduate-programs">
                <Button variant="outline">Open admin shell</Button>
              </Link>
              <Link href="/dashboard/graduate/research">
                <Button>Start a research workspace</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {rows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active enrollment{rows.length === 1 ? "" : "s"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {rows.map((e) => (
                <li key={e.enrollment_id} className="py-3">
                  <Link
                    href={`/dashboard/graduate/enrollments/${e.enrollment_id}`}
                    className="block hover:bg-muted/30 -mx-3 px-3 py-1 rounded-md transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{e.program_name}</div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant="outline">{e.degree_kind}</Badge>
                          <span className="capitalize">{e.status}</span>
                          {e.expected_graduation && <span>· expected {e.expected_graduation}</span>}
                        </div>
                        {e.next_milestone_title && (
                          <p className="text-xs mt-1">
                            <Clock className="h-3 w-3 inline mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Next:</span>{" "}
                            <span className="font-medium">{e.next_milestone_title}</span>
                            {e.next_milestone_due_at && <span className="text-muted-foreground"> · due {e.next_milestone_due_at}</span>}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums shrink-0 mt-1">
                        {e.milestones_done}/{e.milestones_total} milestones
                      </div>
                    </div>
                    <div className="mt-2"><ProgressBar done={e.milestones_done} total={e.milestones_total} /></div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Research Tools preview (16.6 + 16.7 — the differentiator) */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sigma className="h-5 w-5 text-primary" />
            Research Tools — coming in Sessions 16.6 + 16.7
          </CardTitle>
          <CardDescription>
            EUREKA&apos;s research suite: symbolic math (SymPy), stats + plotting
            (statsmodels + matplotlib), chemistry (RDKit / PubChem), biology
            (Biopython), units (Pint), and citation-aware Q&A (Claude + CrossRef
            + arXiv + Semantic Scholar). Open-access, integrated with your skill
            graph + transcripts + tutor sessions. Wolfram-Alpha competitor.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Tool dependencies already in <code className="font-mono">requirements.txt</code>;
          backends ship in 16.6 / 16.7.
        </CardContent>
      </Card>
    </div>
  );
}

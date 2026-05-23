"use client";

/**
 * /dashboard/graduate/enrollments — list of my graduate enrollments.
 * (The detail view lives at /enrollments/[id].)
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { Layers, Clock, ArrowRight } from "lucide-react";

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
};

function Bar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));
  return (
    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function MyEnrollmentsPage() {
  const [rows, setRows] = useState<MyEnrol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const body = await api<{ enrollments: MyEnrol[] }>("/me/graduate");
        setRows(Array.isArray(body?.enrollments) ? body.enrollments : []);
      } catch (e) {
        setError(String((e as Error).message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          My enrollments
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          All your graduate program enrollments. Click into one for milestones + submit flow.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && rows.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <p className="text-base">You&apos;re not enrolled in a graduate program yet.</p>
            <p className="text-sm text-muted-foreground">
              Browse what your organization offers and enroll in one click.
            </p>
            <div className="pt-2">
              <Link href="/dashboard/graduate/programs">
                <Button>Browse programs <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {rows.map((e) => (
          <Link key={e.enrollment_id} href={`/dashboard/graduate/enrollments/${e.enrollment_id}`}>
            <Card className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{e.program_name}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline">{e.degree_kind}</Badge>
                      <span className="capitalize">{e.status}</span>
                      {e.expected_graduation && <span>· expected {e.expected_graduation}</span>}
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Milestones completed</span>
                  <span className="tabular-nums">{e.milestones_done}/{e.milestones_total}</span>
                </div>
                <Bar done={e.milestones_done} total={e.milestones_total} />
                {e.next_milestone_title && (
                  <p className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Next: <span className="font-medium text-foreground">{e.next_milestone_title}</span>
                    {e.next_milestone_due_at && <span> · due {e.next_milestone_due_at}</span>}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

/**
 * /dashboard/medical/enrollment — detail view of the user's active medical
 * tier enrolment. Parallel to /dashboard/undergraduate/enrollment with
 * med-specific tier_context fields (school, year, intended_specialty,
 * usmle_step_1_score, usmle_step_2_score).
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { Layers, ArrowRight } from "lucide-react";

const TIER = "medical";

type TierEnrollment = {
  id: string;
  tier: string;
  tier_context: {
    framework?: string;
    school?: string;
    year?: string | number;
    intended_specialty?: string;
    usmle_step_1_score?: number;
    usmle_step_2_score?: number;
    clerkships_completed?: string[];
  } & Record<string, unknown>;
  status: string;
  target_completion_at: string | null;
  started_at: string | null;
  last_activity_at: string | null;
  progress_pct?: string | number;
  created_at: string;
};

export default function MedicalEnrollmentPage() {
  const [rows, setRows] = useState<TierEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const es = await api<TierEnrollment[]>("/tier-enrollments/me");
        setRows((Array.isArray(es) ? es : []).filter((e) => e.tier === TIER));
      } catch (e) {
        setError(String((e as Error)?.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const active = rows.find((e) => e.status === "active" || e.status === "pending");
  const past = rows.filter((e) => e.status !== "active" && e.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          My enrollment
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Your medical tier enrolment — school, year, USMLE framework, target
          board exams, and intended specialty. Live from{" "}
          <code className="font-mono">/tier-enrollments/me</code>.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load enrolment</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && !active && past.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <p className="text-base">
              You&apos;re not enrolled in the medical tier yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Pick your framework (USMLE Step 1 / Step 2 / COMLEX), school,
              year, and intended specialty to start.
            </p>
            <div className="pt-2">
              <Link href="/learner">
                <Button>
                  Enroll now <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {active && <EnrolmentCard e={active} highlight />}

      {past.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Past enrolments
          </h3>
          {past.map((e) => (
            <EnrolmentCard key={e.id} e={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function EnrolmentCard({
  e,
  highlight = false,
}: {
  e: TierEnrollment;
  highlight?: boolean;
}) {
  const ctx = e.tier_context ?? {};
  const framework = typeof ctx.framework === "string" ? ctx.framework : null;
  const school = typeof ctx.school === "string" ? ctx.school : null;
  const year = ctx.year != null ? String(ctx.year) : null;
  const specialty =
    typeof ctx.intended_specialty === "string" ? ctx.intended_specialty : null;
  const step1 =
    typeof ctx.usmle_step_1_score === "number" ? ctx.usmle_step_1_score : null;
  const step2 =
    typeof ctx.usmle_step_2_score === "number" ? ctx.usmle_step_2_score : null;
  const clerkships = Array.isArray(ctx.clerkships_completed)
    ? (ctx.clerkships_completed as string[])
    : [];
  const target = e.target_completion_at
    ? new Date(e.target_completion_at).toLocaleDateString()
    : null;
  const started = e.started_at
    ? new Date(e.started_at).toLocaleDateString()
    : null;
  const last = e.last_activity_at
    ? new Date(e.last_activity_at).toLocaleString()
    : null;
  const progress =
    typeof e.progress_pct === "string"
      ? Number(e.progress_pct)
      : typeof e.progress_pct === "number"
        ? e.progress_pct
        : 0;
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <Card className={highlight ? "border-primary/30 bg-primary/5" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <CardTitle className="text-base flex items-center gap-2 flex-wrap">
              {school || "Medical school"}
              {framework && (
                <Badge variant="outline" className="uppercase">
                  {framework}
                </Badge>
              )}
              {year && (
                <Badge variant="secondary" className="text-xs">
                  Year {year}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {e.status}
              </Badge>
              {specialty && (
                <span className="text-xs">intended: {specialty}</span>
              )}
              {target && (
                <span className="text-xs">· target {target}</span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {(step1 !== null || step2 !== null) && (
          <div className="grid grid-cols-2 gap-3">
            {step1 !== null && (
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Step 1</div>
                <div className="text-2xl font-bold tabular-nums">{step1}</div>
              </div>
            )}
            {step2 !== null && (
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Step 2 CK</div>
                <div className="text-2xl font-bold tabular-nums">{step2}</div>
              </div>
            )}
          </div>
        )}

        {clerkships.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Clerkships completed
            </p>
            <div className="flex flex-wrap gap-1">
              {clerkships.map((c) => (
                <Badge key={c} variant="outline" className="text-xs capitalize">
                  {c.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {started && (
            <>
              <dt className="text-muted-foreground">Started</dt>
              <dd>{started}</dd>
            </>
          )}
          {last && (
            <>
              <dt className="text-muted-foreground">Last activity</dt>
              <dd>{last}</dd>
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

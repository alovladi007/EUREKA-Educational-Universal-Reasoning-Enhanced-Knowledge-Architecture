"use client";

/**
 * /dashboard/undergraduate/enrollment — detail view of the user's active
 * undergrad tier enrolment. Extracted from the original mega-page.
 *
 * Why singular "enrollment" not plural: a user has at most ONE active
 * tier_enrollment per tier (enforced by unique_partial index on
 * (user_id, tier) WHERE deleted_at IS NULL). The graduate tier carries
 * one row per program enrollment (potentially many); undergrad/HS carry
 * one row per tier.
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

const TIER = "undergraduate";

type TierEnrollment = {
  id: string;
  tier: string;
  tier_context: {
    framework?: string;
    major?: string;
    minor?: string;
    expected_credits?: number;
  } & Record<string, unknown>;
  status: string;
  target_completion_at: string | null;
  started_at: string | null;
  last_activity_at: string | null;
  progress_pct?: string | number;
  created_at: string;
};

export default function UndergradEnrollmentPage() {
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
          My enrolment
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Your undergraduate tier enrolment — framework, intended major,
          target graduation, and status. Live from{" "}
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
              You&apos;re not enrolled in the undergraduate tier yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Pick your framework (ABET / ACM / IEEE / AACSB / Liberal Arts),
              intended major, and target graduation to start.
            </p>
            <div className="pt-2">
              <Link href="/learner">
                <Button>
                  Enrol now <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
  const major = typeof ctx.major === "string" ? ctx.major : null;
  const minor = typeof ctx.minor === "string" ? ctx.minor : null;
  const expected =
    typeof ctx.expected_credits === "number" ? ctx.expected_credits : null;
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
            <CardTitle className="text-base flex items-center gap-2">
              {major || "Undergraduate"}
              {framework && (
                <Badge variant="outline" className="uppercase">
                  {framework}
                </Badge>
              )}
            </CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
              <Badge variant="secondary" className="capitalize">
                {e.status}
              </Badge>
              {minor && <span className="text-xs">minor: {minor}</span>}
              {expected !== null && (
                <span className="text-xs">· {expected} cr expected</span>
              )}
              {target && <span className="text-xs">· target {target}</span>}
            </div>
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

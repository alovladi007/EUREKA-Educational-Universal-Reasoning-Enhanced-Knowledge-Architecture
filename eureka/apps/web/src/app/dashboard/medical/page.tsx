"use client";

/**
 * /dashboard/medical — Overview tab of the medical education module.
 *
 * Previously a single 621-line mega-page mirroring the HS/undergrad mold.
 * Refactored into an Overview that surfaces the 5 med-specific learner
 * tools (QBank, Cases, Anatomy, OSCE, AI Tutor) as prominent cards plus
 * the standard tier-shaped cards (Enrollment, Skills, Resources). The
 * full sub-pages are reachable from the pill nav (see ./layout.tsx).
 *
 * Mirrors graduate's Overview shape (../graduate/page.tsx) — surface the
 * differentiator content first, then the tier metadata.
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
import {
  Stethoscope,
  ClipboardList,
  FileText,
  Activity,
  UserCheck,
  Brain,
  Layers,
  Target,
  Folder,
  ArrowRight,
} from "lucide-react";

const TIER = "medical";
const TITLE = "Medical Education";
const FRAMEWORKS = ["usmle", "usmle_step_1", "usmle_step_2", "comlex", "mbe"];

type TierEnrollment = {
  id: string;
  tier: string;
  tier_context: {
    framework?: string;
    school?: string;
    year?: string | number;
    intended_specialty?: string;
  } & Record<string, unknown>;
  status: string;
  target_completion_at: string | null;
  progress_pct?: string | number;
};

export default function MedicalOverview() {
  const [enrolment, setEnrolment] = useState<TierEnrollment | null>(null);
  const [counts, setCounts] = useState({ skills: 0, resources: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [es, ms, rsx] = await Promise.all([
          api<TierEnrollment[]>("/tier-enrollments/me").catch(() => []),
          api<unknown[]>("/analytics/me/skills").catch(() => []),
          api<unknown[]>(`/resources?tier=${TIER}&limit=50`).catch(() => []),
        ]);
        const active = (Array.isArray(es) ? es : []).find(
          (e) =>
            e.tier === TIER &&
            e.status !== "withdrawn" &&
            e.status !== "archived",
        );
        setEnrolment(active ?? null);
        setCounts({
          skills: Array.isArray(ms) ? ms.length : 0,
          resources: Array.isArray(rsx) ? rsx.length : 0,
        });
      } catch (e) {
        setError(String((e as Error)?.message ?? e));
      }
    })();
  }, []);

  const ctx = enrolment?.tier_context ?? {};
  const framework = typeof ctx.framework === "string" ? ctx.framework : null;
  const school = typeof ctx.school === "string" ? ctx.school : null;
  const year = ctx.year != null ? String(ctx.year) : null;
  const specialty =
    typeof ctx.intended_specialty === "string" ? ctx.intended_specialty : null;
  const target = enrolment?.target_completion_at
    ? new Date(enrolment.target_completion_at).toLocaleDateString()
    : null;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent">
        <CardContent className="flex items-start justify-between gap-4 pt-6 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-rose-500/10 p-3">
              <Stethoscope className="h-8 w-8 text-rose-600" />
            </div>
            <div className="min-w-0">
              <h1 className="mb-1 text-3xl font-bold">{TITLE}</h1>
              <p className="text-muted-foreground">
                USMLE / COMLEX prep plus integrated learner tools — question
                bank, clinical cases, interactive anatomy, OSCE simulator, and
                a med-specific AI tutor. Tabs above let you drill in.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FRAMEWORKS.map((f) => (
                  <Badge key={f} variant="secondary" className="uppercase">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert>
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Enrolment summary hero — only when actually enrolled */}
      {enrolment && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Active enrolment
                </CardTitle>
                {/* Not <CardDescription>: it renders a <p>, and the <Badge>
                    below renders a <div> — a div inside a p is invalid HTML
                    (validateDOMNesting warning). Use a div with the same
                    muted-description styling instead. */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {framework && (
                    <Badge variant="outline" className="uppercase">
                      {framework}
                    </Badge>
                  )}
                  {year && (
                    <span className="font-medium text-foreground">
                      Year {year}
                    </span>
                  )}
                  {school && <span>· {school}</span>}
                  <span className="capitalize">{enrolment.status}</span>
                  {specialty && <span>· {specialty}</span>}
                  {target && <span>· target {target}</span>}
                </div>
              </div>
              <Link href="/dashboard/medical/enrollment">
                <Button variant="outline" size="sm">
                  Open enrolment <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Medical-specific learner tools — the differentiator */}
      <div>
        <h2 className="text-base font-semibold mb-3">Learner tools</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          <ToolCard
            href="/dashboard/medical/qbank"
            icon={ClipboardList}
            color="text-rose-500"
            title="QBank"
            desc="USMLE-style question bank with explanations and skill-tagged practice."
          />
          <ToolCard
            href="/dashboard/medical/cases"
            icon={FileText}
            color="text-blue-500"
            title="Cases"
            desc="Patient cases with structured H&P, differential, and Socratic prompts."
          />
          <ToolCard
            href="/dashboard/medical/anatomy"
            icon={Activity}
            color="text-emerald-500"
            title="Anatomy"
            desc="Interactive anatomy explorer with system + region drill-down."
          />
          <ToolCard
            href="/dashboard/medical/osce"
            icon={UserCheck}
            color="text-amber-500"
            title="OSCE simulator"
            desc="Standardized-patient encounters with rubric-driven feedback."
          />
          <ToolCard
            href="/dashboard/medical/ai-tutor"
            icon={Brain}
            color="text-purple-500"
            title="AI Tutor"
            desc="Med-specific Socratic tutor with citations to UpToDate / FirstAid."
          />
        </div>
      </div>

      {/* Tier-shaped cards (Enrollment / Skills / Resources) */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Link href="/dashboard/medical/enrollment">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolment</p>
                  <p className="text-2xl font-bold">{enrolment ? 1 : 0}</p>
                </div>
                <Layers className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/medical/skills">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Skills</p>
                  <p className="text-2xl font-bold">{counts.skills}</p>
                </div>
                <Target className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/medical/resources">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resources</p>
                  <p className="text-2xl font-bold">{counts.resources}</p>
                </div>
                <Folder className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Keep going */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Keep going</CardTitle>
          <CardDescription>
            Common next steps from the rest of the EUREKA dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/tutor">
            <Button variant="outline">General AI tutor</Button>
          </Link>
          <Link href="/dashboard/assessments">
            <Button variant="outline">Practice a question</Button>
          </Link>
          <Link href="/dashboard/learning-path">
            <Button variant="outline">Open learning path</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function ToolCard({
  href,
  icon: Icon,
  color,
  title,
  desc,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2">{desc}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

"use client";

/**
 * Dashboard Futures — the EUREKA roadmap.
 *
 * Pure static page — no fetches, no defunct :8110 microservice calls,
 * no fabricated "AR/VR Education Future" or "BCI" content. The roadmap
 * below is hand-maintained; the "Project docs" links point at files that
 * actually exist in the repo.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, ExternalLink, Rocket } from "lucide-react";

const GITHUB_BASE = "https://github.com/alovladi007/EUREKA/blob/main";

const SHIPPED: { label: string; detail: string }[] = [
  { label: "Phase 1", detail: "Tier scaffolding" },
  { label: "Phase 2", detail: "Horizontal services" },
  { label: "Phase 3", detail: "Auth + observability + secrets" },
  { label: "Phase 4", detail: "Skill graph + transcript + recommender" },
  { label: "Phase 5", detail: "Item bank + AI variant generator" },
  { label: "Phase 6", detail: "AI tutor (Claude tool-use)" },
  { label: "Phase 7", detail: "IRT + analytics + mock exams + FSRS" },
  { label: "Phase 8", detail: "Mobile + offline (partially via 12.2 + 12.4)" },
  { label: "Phase 9", detail: "Institutional / B2B" },
  { label: "Phase 10", detail: "Marketplace + creator economy" },
  { label: "Phase 11", detail: "GTM (subscriptions, SEO, email, support)" },
  { label: "Phase 12", detail: "Engagement (streaks, push, study plans, live)" },
  { label: "Phase 13", detail: "Platform integrations (API keys, webhooks, OAuth, compliance)" },
  { label: "Phase 14", detail: "Production scale (cache, jobs, metrics, autocomplete)" },
  { label: "Phase 15", detail: "Workforce training affiliate platform" },
  { label: "Phase 16.1", detail: "Graduate tier (programs/enrollments/milestones)" },
  { label: "Phase 17", detail: "Real activity feed + user_collections + no-mocks dashboard" },
  { label: "Phase 18", detail: "Real community + curated resources catalog" },
];

const NEXT: { label: string; detail: string }[] = [
  { label: "16.2", detail: "Research workspace + lit review" },
  { label: "16.3", detail: "Thesis lifecycle + IRB" },
  { label: "16.4", detail: "Grants + fellowships" },
  { label: "16.5", detail: "Publications + scholarly profile" },
  { label: "16.6", detail: "Research Tools I: symbolic math + stats + plotting (Wolfram Alpha competitor)" },
  { label: "16.7", detail: "Research Tools II: physics + chemistry + biology + citation-aware Q&A" },
];

// Only files that actually exist in the repo (the former STATUS.md /
// ROADMAP.md / ARCHITECTURE.md links 404'd — those docs don't exist).
const DOCS: { label: string; path: string }[] = [
  { label: "README.md", path: "README.md" },
  { label: "docs/PROJECT_SUMMARY.md", path: "docs/PROJECT_SUMMARY.md" },
  { label: "docs/BACKEND_ARCHITECTURE.md", path: "docs/BACKEND_ARCHITECTURE.md" },
  { label: "docs/INTEGRATIONS_FEATURE_FLAGS.md", path: "docs/INTEGRATIONS_FEATURE_FLAGS.md" },
];

export default function DashboardFuturesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Rocket className="h-7 w-7 text-primary" />
          Futures — the EUREKA roadmap
        </h1>
        <p className="text-muted-foreground mt-1">
          A hand-maintained snapshot of where the platform is and where it&apos;s
          headed. Project docs are linked below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Where we are (done)</CardTitle>
          <CardDescription>Shipped phases — all in main.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {SHIPPED.map((row) => (
              <li
                key={row.label}
                className="flex items-start gap-3 text-sm"
              >
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">{row.label}</span>
                  <span className="text-muted-foreground"> — {row.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">What&apos;s next</CardTitle>
          <CardDescription>
            Upcoming Phase 16 sub-sessions — research-tier surfaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {NEXT.map((row) => (
              <li key={row.label} className="flex items-start gap-3 text-sm">
                <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">{row.label}</span>
                  <span className="text-muted-foreground"> — {row.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project docs</CardTitle>
          <CardDescription>
            Reference documentation in the repository.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2 text-sm">
          {DOCS.map((d) => (
            <a
              key={d.path}
              href={`${GITHUB_BASE}/${d.path}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border bg-card p-3 hover:bg-accent flex items-center justify-between"
            >
              <span className="font-mono text-xs">{d.label}</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

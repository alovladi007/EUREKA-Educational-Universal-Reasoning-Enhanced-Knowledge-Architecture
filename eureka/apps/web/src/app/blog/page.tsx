import Link from "next/link";
import { EurekaNav } from "@/components/eureka-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, ExternalLink } from "lucide-react";

type Entry = {
  phase: string;
  title: string;
  summary: string;
  tag?: string;
};

const ENTRIES: Entry[] = [
  {
    phase: "Phase 19",
    title: "Mocks ripped out; real backends end-to-end",
    summary:
      "Every dashboard surface now reads from the live api-core. Removed remaining placeholder data fixtures across learner, marketplace, and admin shells.",
    tag: "today",
  },
  {
    phase: "Phase 18",
    title: "Real community + curated resources catalog",
    summary:
      "Shipped 5 new tables and 19 endpoints powering threaded discussions, upvotes, accepted answers, and a tagged resource library with admin curation.",
  },
  {
    phase: "Phase 17",
    title: "No-mocks dashboard, activity feed, user collections",
    summary:
      "Dashboard, activity timeline, and personal collections all read from real per-user state. No more seeded placeholder content on first login.",
  },
  {
    phase: "Phase 16.1",
    title: "Graduate school tier (programs / enrollments / milestones)",
    summary:
      "Added programs, enrollments, and milestone tracking for graduate learners with full advisor and committee workflows.",
  },
  {
    phase: "Phase 15",
    title: "Workforce training affiliate platform (B2B L&D)",
    summary:
      "Partnerships, team training rosters, and revenue-sharing affiliate links live for enterprise L&D customers.",
  },
  {
    phase: "Phase 14",
    title: "Production scale (cache, jobs, metrics, autocomplete)",
    summary:
      "Redis caching layer, async job queue, Prometheus metrics, and OpenSearch-backed autocomplete across content surfaces.",
  },
  {
    phase: "Phase 13",
    title: "Platform integrations (API keys, webhooks, OAuth, compliance)",
    summary:
      "Scoped API keys, HMAC-signed webhooks, third-party OAuth, plus GDPR/CCPA export and delete endpoints for compliance.",
  },
  {
    phase: "Phase 12",
    title: "Engagement (streaks, push, study plans, live tutoring)",
    summary:
      "Daily streaks, native push notifications, AI-generated study plans, and 1:1 live tutoring sessions with calendar handoff.",
  },
  {
    phase: "Phase 11",
    title: "GTM (subscriptions, SEO, email lifecycle, support tickets, KB)",
    summary:
      "Stripe subscriptions, SEO landing pages, lifecycle email automation, support-ticket system, and the public knowledge base now live.",
  },
  {
    phase: "Phase 10",
    title: "Marketplace + creator economy",
    summary:
      "Course marketplace with creator dashboards, 70/30 platform/instructor revenue share, and payouts via Stripe Connect.",
  },
  {
    phase: "Phase 9",
    title: "Institutional / B2B (cohorts, SSO, LTI 1.3)",
    summary:
      "Tenant management, SAML/OIDC SSO, LTI 1.3 deep linking for LMS integration, and cohort enrollment for schools.",
  },
  {
    phase: "Phase 7",
    title: "Exam realism + analytics (IRT, mock exams, FSRS spaced repetition)",
    summary:
      "Item Response Theory calibration on the question bank, timed mock exams with section pacing, and FSRS-driven spaced repetition.",
  },
  {
    phase: "Phase 6",
    title: "AI tutor (Claude tool-use, RAG, Socratic hints)",
    summary:
      "Tutor backed by Claude with retrieval against course content (pgvector), tool-use for math/grading, and progressive Socratic hinting.",
  },
  {
    phase: "Phase 5",
    title: "Item bank + AI variant generator",
    summary:
      "Authoring tools for the item bank, AI-generated variants of seed questions, and reviewer workflow before items go live.",
  },
  {
    phase: "Phase 4",
    title: "Skill graph + transcript + recommender",
    summary:
      "Persistent skill graph, ed25519-signed Open Badges 3.0 transcript, and recommender that picks the next best skill to practice.",
  },
];

const REPO =
  "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture";

export default function BlogPage() {
  return (
    <>
      <EurekaNav />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Rocket className="w-7 h-7 text-blue-600" />
            EUREKA Changelog
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            A chronological record of what shipped — phase by phase. Drawn
            directly from <code className="text-slate-700">docs/STATUS.md</code>{" "}
            in the repo, not a marketing rewrite.
          </p>
        </header>

        <ol className="space-y-4">
          {ENTRIES.map((e) => (
            <li key={e.phase}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="secondary">{e.phase}</Badge>
                    {e.tag && (
                      <span className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
                        {e.tag}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{e.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {e.summary}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Read the source docs</CardTitle>
            <CardDescription>
              These changelog entries are summarized from the canonical
              in-repo docs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href={`${REPO}/blob/main/docs/STATUS.md`} target="_blank">
              <Button variant="outline" className="gap-1">
                docs/STATUS.md
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href={`${REPO}/blob/main/docs/ROADMAP.md`} target="_blank">
              <Button variant="outline" className="gap-1">
                docs/ROADMAP.md
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href={REPO} target="_blank">
              <Button variant="outline" className="gap-1">
                Source on GitHub
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

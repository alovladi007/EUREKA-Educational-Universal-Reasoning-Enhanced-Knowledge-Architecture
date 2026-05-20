"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PhaseMarker = { id: string; title: string; status: "done" | "pending" };

const PHASES: PhaseMarker[] = [
  { id: "1", title: "Foundations + auth", status: "done" },
  { id: "2", title: "Learner + content domain", status: "done" },
  { id: "3", title: "Item bank + assessment scaffold", status: "done" },
  { id: "4", title: "Skill graph + recommendations", status: "done" },
  { id: "5", title: "Adaptive assessment engine", status: "done" },
  { id: "6", title: "RAG + agent (Claude)", status: "done" },
  { id: "7", title: "IRT + FSRS-lite", status: "done" },
  { id: "9", title: "Marketplace + courses", status: "done" },
  { id: "10", title: "Institutional accounts", status: "done" },
  { id: "11", title: "Workforce + compliance", status: "done" },
  { id: "12", title: "GTM + billing", status: "done" },
  { id: "13", title: "Platform integrations", status: "done" },
  { id: "14", title: "ECG + medical pipelines", status: "done" },
  { id: "15", title: "BraTS + image → 12-lead", status: "done" },
  { id: "16.1", title: "Research-agent surface", status: "done" },
  { id: "16.2", title: "Research workspace + lit review", status: "pending" },
  { id: "16.3", title: "Thesis lifecycle + IRB", status: "pending" },
  { id: "16.4", title: "Grants + fellowships", status: "pending" },
  { id: "16.5", title: "Publications + scholarly profile", status: "pending" },
  {
    id: "16.6",
    title: "Research Tools I: symbolic math + stats + plotting",
    status: "pending",
  },
  {
    id: "16.7",
    title: "Research Tools II: physics + chemistry + biology + citation Q&A",
    status: "pending",
  },
];

const WHATS_NEXT: { id: string; title: string; blurb: string }[] = [
  {
    id: "16.2",
    title: "Research workspace + lit review",
    blurb:
      "CrossRef + arXiv lookup, deduped reading queue, BibTeX export — the literature-review surface on top of the Phase 6 agent.",
  },
  {
    id: "16.3",
    title: "Thesis lifecycle + IRB",
    blurb:
      "Proposal → IRB protocol → defense scheduling, with milestone gates wired to advisor approvals.",
  },
  {
    id: "16.4",
    title: "Grants + fellowships",
    blurb:
      "Funder catalog, deadline tracker, and budget-narrative scaffolding tied to your active project.",
  },
  {
    id: "16.5",
    title: "Publications + scholarly profile",
    blurb:
      "ORCID-linked publication record, citation graph, h-index, and venue-fit suggestions.",
  },
  {
    id: "16.6",
    title: "Research Tools I",
    blurb:
      "Symbolic math, statistics, and plotting — EUREKA's first Wolfram-Alpha-class tool surface, with results that are citable inside an agent turn.",
  },
  {
    id: "16.7",
    title: "Research Tools II",
    blurb:
      "Physics + chemistry + biology helpers and citation-aware Q&A; tool calls show up in the agent trace with full provenance.",
  },
];

const ANCHOR_DOCS = [
  {
    label: "docs/ROADMAP.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/ROADMAP.md",
  },
  {
    label: "docs/STATUS.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/STATUS.md",
  },
];

export default function FuturesPage() {
  const done = PHASES.filter((p) => p.status === "done").length;
  const pct = Math.round((done / PHASES.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Futures — the EUREKA roadmap
        </h1>
        <p className="text-muted-foreground">
          The roadmap IS the &quot;futures&quot; surface. Pulled from the
          in-repo roadmap; no live fetch.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Where we are</CardTitle>
          <CardDescription>
            {done} of {PHASES.length} markers complete ({pct}%).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-2 bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <ul className="space-y-1.5 text-sm">
            {PHASES.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <Badge
                  variant={p.status === "done" ? "default" : "outline"}
                  className="min-w-[3.5rem] justify-center"
                >
                  {p.id}
                </Badge>
                <span
                  className={
                    p.status === "done"
                      ? ""
                      : "text-muted-foreground"
                  }
                >
                  {p.title}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What&apos;s next</CardTitle>
          <CardDescription>
            Phase 16.2 → 16.7. These are the upcoming research-platform
            surfaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {WHATS_NEXT.map((n) => (
              <li key={n.id} className="border-l-2 border-primary/40 pl-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{n.id}</Badge>
                  <span className="font-medium">{n.title}</span>
                </div>
                <p className="text-muted-foreground mt-1">{n.blurb}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anchor docs</CardTitle>
          <CardDescription>
            Source of truth for what&apos;s shipped and what&apos;s queued.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {ANCHOR_DOCS.map((d) => (
              <li key={d.href}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  {d.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

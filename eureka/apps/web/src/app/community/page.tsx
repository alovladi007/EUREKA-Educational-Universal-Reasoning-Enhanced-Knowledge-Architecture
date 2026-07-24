import Link from "next/link";
import { EurekaNav } from "@/components/eureka-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, ThumbsUp, CheckCircle2 } from "lucide-react";

const SAMPLE_CATEGORIES = [
  {
    name: "USMLE prep",
    tier: "Professional · Medicine",
    description:
      "Step 1, Step 2 CK, and Step 3 — case discussions, high-yield reviews, and weekly NBME debriefs.",
  },
  {
    name: "FE Electrical",
    tier: "Professional · Engineering",
    description:
      "Fundamentals of Engineering (Electrical & Computer) — circuits, signals, and exam-day strategy threads.",
  },
  {
    name: "AP Calculus BC",
    tier: "High school",
    description:
      "Series convergence, parametric/polar, and FRQ scoring rubrics for the May AP exam.",
  },
];

export default function CommunityPublicPage() {
  return (
    <>
      <EurekaNav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            EUREKA Community
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            A real discussion forum with upvotes, accepted answers, and
            instructor-moderated threads — scoped per learning tier so the
            content stays relevant to what you&apos;re studying.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Threaded discussions
              </CardTitle>
              <CardDescription>
                Ask, answer, and follow up. Markdown and code blocks render inline.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-blue-600" />
                Real upvotes
              </CardTitle>
              <CardDescription>
                Reactions are tied to your account — one upvote per learner per
                post, surfaced in the ranking.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Accepted answers
              </CardTitle>
              <CardDescription>
                Thread authors and instructors can mark the answer that
                actually solved the problem, with reputation rewards.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>See the discussion in-shell</CardTitle>
            <CardDescription>
              The live community is available to signed-in learners at{" "}
              <code className="text-slate-700">/dashboard/community</code>.
              You&apos;ll see threads and reactions scoped to your enrolled
              tiers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/auth/login?next=/dashboard/community">
              <Button>Sign in to view discussions</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline">Create an account</Button>
            </Link>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            Sample categories from real tiers
          </h2>
          <p className="text-sm text-slate-600 mb-4 max-w-2xl">
            These map to actual tier enrollments on the platform. After you
            sign in, your community feed is filtered to the tiers you study.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {SAMPLE_CATEGORIES.map((c) => (
              <Card key={c.name}>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2 text-xs">
                    {c.tier}
                  </Badge>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

'use client';

/**
 * LSAT full-program page — counterpart to Patent Bar's patent-program.
 * Shows the 7-pillar program (live, full curriculum, practice, analytics,
 * etc.) with LSAT-specific milestones and study path.
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, CheckCircle2, BookOpen, Library, BrainCircuit, BarChart3, Video, Users, Target,
  Clock, FileText, Sparkles, ExternalLink,
} from 'lucide-react';
import { LsatFrequencyHeatmap } from '@/components/test-prep/LsatFrequencyHeatmap';

const EXAM = 'LSAT';

const PILLARS = [
  {
    icon: Video,
    title: '1. Live instruction',
    body: 'Weekly cohort sessions on Logical Reasoning patterns, Reading Comprehension structure, and full-section pacing. Replays available 48 h.',
    cta: { label: 'Schedule', href: 'lsat-live' },
  },
  {
    icon: Library,
    title: '2. LawHub-style workbench',
    body: 'TOC of every LR + RC question type, frequency heatmap, bookmarks, and deep-links into LSAC LawHub for drilling the real interface.',
    cta: { label: 'Open workbench', href: 'lawhub-workbench' },
  },
  {
    icon: BookOpen,
    title: '3. Question-type lessons',
    body: '17 LR types + 8 RC types — each with the standard wrong-answer traps, conditional logic diagrams, and 5+ worked examples.',
    cta: { label: 'Read lessons', href: '?tab=read' },
  },
  {
    icon: BrainCircuit,
    title: '4. Adaptive QBank',
    body: 'IRT-calibrated questions tagged by type and difficulty. Misses feed into the spaced-repetition queue automatically.',
    cta: { label: 'Practice', href: '?tab=qbank' },
  },
  {
    icon: Target,
    title: '5. Timed sections + full PT',
    body: 'Drill a single 35-min section or simulate the full 4-section LSAT with the 10-min intermission and the LawHub interface.',
    cta: { label: 'Take a section', href: '/dashboard/test-prep/practice?exam=LSAT' },
  },
  {
    icon: BarChart3,
    title: '6. Analytics & SRS',
    body: 'Question-type weakness, time-vs-accuracy, score predictor (120–180), and a calibrated readiness band against admitted-class medians.',
    cta: { label: 'Open analytics', href: 'lsat-analytics' },
  },
  {
    icon: Users,
    title: '7. Cohort & accountability',
    body: 'Study groups, weekly check-ins, and a shared error log. Schools track collective progress vs target medians.',
    cta: { label: 'See cohort', href: '' },
  },
];

const STUDY_PATH = [
  { week: 'Weeks 1–2', goal: 'Diagnostic + format orientation', detail: 'Take a free LawHub PrepTest cold to establish baseline. Read every question type lesson; flag your 3 weakest.' },
  { week: 'Weeks 3–6', goal: 'Type-specific drills', detail: 'Daily 25-question LR drill on rotating types (Strengthen → Weaken → Necessary Assumption → Flaw → Inference). Add 1 RC passage per day.' },
  { week: 'Weeks 7–10', goal: 'Section practice + timing', detail: 'Move to full 35-minute timed sections. Use the section timer in LawHub. Focus on the LR section that drained the most time.' },
  { week: 'Weeks 11–14', goal: 'Full-length PrepTests', detail: '2 full PrepTests per week. Same time of day as your real exam slot. Score on the standard curve; review every miss.' },
  { week: 'Week 15+', goal: 'Polish + reset week', detail: 'Light practice only. Sleep, hydrate, walk through LawHub interface. One short LR drill the day before — no full PT in the last 3 days.' },
];

const KEY_LSAT_FACTS = [
  { k: 'Scored sections', v: '3' },
  { k: 'Section time', v: '35 min' },
  { k: 'Total questions', v: '~75 scored' },
  { k: 'Score range', v: '120 – 180' },
  { k: 'Median', v: '~152' },
  { k: 'T14 medians', v: '170+' },
  { k: 'Intermission', v: '10 min after section 2' },
  { k: 'Writing', v: 'Separate, take-at-home' },
];

export default function LsatProgramPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();
  const base = `/dashboard/test-prep/${String(params.exam).toLowerCase()}`;

  useEffect(() => {
    if (exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
    }
  }, [exam, params.exam, router]);

  if (exam !== EXAM) return null;

  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <Link href={base} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to LSAT hub
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">LSAT full program</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          How Eureka covers the modern LSAT (post-Aug-2024, no Logic Games) end-to-end: live
          instruction, type-specific lessons, adaptive QBank, full-length PrepTests in a LawHub-style
          shell, analytics, and cohort accountability.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href={`${base}/lsat-live`}>
            <Button size="sm" variant="default" className="gap-1.5">
              <Video className="h-3.5 w-3.5" /> Live instruction
            </Button>
          </Link>
          <Link href={`${base}/lawhub-workbench`}>
            <Button size="sm" variant="secondary" className="gap-1.5">
              <Library className="h-3.5 w-3.5" /> LawHub workbench
            </Button>
          </Link>
          <Link href={`${base}/lsat-analytics`}>
            <Button size="sm" variant="secondary" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Button>
          </Link>
          <a href="https://lawhub.lsac.org/preptests" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> Open LawHub
            </Button>
          </a>
        </div>
      </div>

      {/* Key facts strip */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KEY_LSAT_FACTS.map((f) => (
            <div key={f.k} className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{f.k}</p>
              <p className="text-lg font-semibold">{f.v}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 7 Pillars */}
      <div>
        <h2 className="text-xl font-bold mb-1">7-pillar program</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Mapped to what high-end LSAT prep courses (PowerScore, 7Sage, LSAT Demon) emphasise — but
          integrated into a single platform with shared analytics.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            const href = p.cta.href.startsWith('/') || p.cta.href.startsWith('?')
              ? `${base}${p.cta.href.startsWith('?') ? p.cta.href : ''}`
              : p.cta.href
                ? `${base}/${p.cta.href}`
                : base;
            return (
              <Card key={p.title} className="p-5 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.body}</p>
                  </div>
                </div>
                {p.cta.label && (
                  <div>
                    <Link href={p.cta.href.startsWith('/dashboard') ? p.cta.href : href}>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        {p.cta.label} <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Study path */}
      <div>
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" /> Suggested 15-week study path
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Compressed timelines (4–8 weeks) work for high-baseline students, but most candidates
          benefit from 3–4 months of deliberate practice. Adjust to your starting score.
        </p>
        <div className="space-y-2">
          {STUDY_PATH.map((s) => (
            <Card key={s.week} className="p-4 flex flex-wrap items-start gap-3">
              <Badge variant="secondary" className="font-mono text-[10px] shrink-0 mt-0.5">{s.week}</Badge>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{s.goal}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.detail}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Heatmap reference */}
      <div>
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-500" /> Question-type frequency reference
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          The same heatmap from the LSAT hub. Use it to prioritise which types to drill first.
        </p>
        <LsatFrequencyHeatmap />
      </div>

      {/* Closing CTA */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border-purple-200 dark:border-purple-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-xl">
            <p className="font-semibold">Ready to start?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Open the LawHub workbench, pick your weakest question type from the heatmap, and run a
              20-question drill in Eureka&apos;s QBank to warm up before LawHub.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`${base}/lawhub-workbench`}>
              <Button className="gap-1.5"><Library className="h-4 w-4" /> Open workbench</Button>
            </Link>
            <Link href={`/dashboard/test-prep/practice?exam=LSAT`}>
              <Button variant="outline" className="gap-1.5"><BrainCircuit className="h-4 w-4" /> Start a drill</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

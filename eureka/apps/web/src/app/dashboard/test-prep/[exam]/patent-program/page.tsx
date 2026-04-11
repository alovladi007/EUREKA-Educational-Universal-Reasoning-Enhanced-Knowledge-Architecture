'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, BookOpen, Library, BrainCircuit, BarChart3, Shield, Users, Video } from 'lucide-react';
import { MpepSearchRace } from '@/components/test-prep/patent/MpepSearchRace';
import {
  MPEP_REVISION_LABEL,
  QUESTION_TAG_SCHEMA,
  TRUST_AND_SOURCING,
  COMMUNITY_PLACEHOLDER,
  OED_LOGISTICS_CHECKLIST,
  DATE_CONFLICT_DRILLS,
  CLAIM_CONSTRUCTION_DRILLS,
} from '@/lib/patent-bar-program';
import { PATENT_TOPIC_ANCHORS } from '@/lib/patent-topic-anchors';

const EXAM = 'PATENT_BAR';

export default function PatentBarProgramPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();
  const base = `/dashboard/test-prep/${String(params.exam).toLowerCase()}`;

  useEffect(() => {
    if (exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
    }
  }, [exam, params.exam, router]);

  if (exam !== EXAM) {
    return null;
  }

  const clusterCount = Object.keys(PATENT_TOPIC_ANCHORS).length;

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <Link href={base} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to Patent Bar hub
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Patent Bar full program</h1>
        <p className="text-muted-foreground mt-2">
          How EUREKA covers exam-faithful practice, curriculum, tagging, skills labs, analytics, trust, and community—mapped to what
          high-end courses emphasize.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href={`${base}/live`}>
            <Button size="sm" variant="default" className="gap-1.5">
              <Video className="h-3.5 w-3.5" /> Live instruction
            </Button>
          </Link>
          <Link href={`${base}/mpep-workbench`}>
            <Button size="sm" variant="secondary" className="gap-1.5">
              <Library className="h-3.5 w-3.5" /> MPEP workbench
            </Button>
          </Link>
          <Link href={`${base}/command-center`}>
            <Button size="sm" variant="secondary" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Button>
          </Link>
          <Link href={base}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5" /> QBank hub
            </Button>
          </Link>
        </div>
      </div>

      <section id="exam-faithful" className="scroll-mt-24">
        <h2 className="text-xl font-semibold mb-3">1. Exam-faithful practice environment</h2>
        <Card className="p-6 space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">MPEP-heavy UI:</strong> The{' '}
            <Link href={`${base}/mpep-workbench`} className="text-primary underline">
              MPEP workbench
            </Link>{' '}
            provides TOC tabs, bookmarks, search helpers, and opens the official eMPEP in a new tab (USPTO blocks iframes). That matches
            how you will use two surfaces on test day: navigation + reader.
          </p>
          <p>
            <strong className="text-foreground">OED-style stems &amp; distractors:</strong> QBank items can be tagged as OED-style
            fact patterns; explanations support per-option MPEP framing via <code className="text-xs bg-muted px-1 rounded">distractor_explanations</code>{' '}
            in question metadata (see schema below).
          </p>
          <p>
            <strong className="text-foreground">AIA vs legacy:</strong> Each item should declare{' '}
            <code className="text-xs bg-muted px-1 rounded">aia_era</code> (<Badge variant="outline" className="text-[10px] mx-0.5">post_aia</Badge>{' '}
            dominant). Filters in the QBank let you drill post-AIA-only sets once your bank is tagged.
          </p>
        </Card>
      </section>

      <section id="curriculum" className="scroll-mt-24">
        <h2 className="text-xl font-semibold mb-3">2. Curriculum aligned to the tested universe</h2>
        <Card className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 inline mr-1" />
            Reading lessons use the Patent Bar syllabus; <strong className="text-foreground">{clusterCount} topics</strong> include a{' '}
            <strong className="text-foreground">topic → MPEP chapter &amp; statute map</strong> with drill hints in{' '}
            <code className="text-xs">patent-topic-anchors.ts</code>. Open any lesson in <strong>Read Lessons</strong> to see anchors on
            the Patent Bar exam.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Why wrong answers are wrong:</strong> Tutor mode surfaces{' '}
            <code className="text-xs bg-muted px-1 rounded">why_wrong_mpep</code> when authors provide per-index distractor notes in
            tags—tied to MPEP/statute anchors, not generic text only.
          </p>
        </Card>
      </section>

      <section id="qbank-quality" className="scroll-mt-24">
        <h2 className="text-xl font-semibold mb-3">3. Question bank quality &amp; revision log</h2>
        <Card className="p-6 space-y-4">
          <p className="text-sm font-medium text-foreground">{MPEP_REVISION_LABEL}</p>
          <p className="text-sm text-muted-foreground">{QUESTION_TAG_SCHEMA.description}</p>
          <ul className="text-sm space-y-2 border rounded-lg p-4 bg-muted/30">
            {QUESTION_TAG_SCHEMA.fields.map((f) => (
              <li key={f.key}>
                <code className="text-xs font-mono bg-background px-1 rounded">{f.key}</code> — {f.note}
                <span className="text-muted-foreground block text-xs mt-0.5">Example: {f.example}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Analytics break down weakness by <strong>content_type</strong> and <strong>trap_type</strong> when items are tagged.
          </p>
        </Card>
      </section>

      <section id="skills" className="scroll-mt-24">
        <h2 className="text-xl font-semibold mb-3">4. Skills that transfer to the exam UI</h2>
        <div className="space-y-4">
          <MpepSearchRace />
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-2">Date &amp; priority micro-drills (AIA framing)</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Short scenarios—timed QBank sessions add global timer; use these for quick pattern checks.
            </p>
            <div className="space-y-4">
              {DATE_CONFLICT_DRILLS.map((d) => (
                <DateClaimMini key={d.id} item={d} />
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-2">Claim construction mini-scenarios</h3>
            <div className="space-y-4">
              {CLAIM_CONSTRUCTION_DRILLS.map((d) => (
                <DateClaimMini key={d.id} item={d} mode="claim" />
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section id="analytics" className="scroll-mt-24">
        <h2 className="text-xl font-semibold mb-3">5. Analytics that drive study</h2>
        <Card className="p-6 text-sm text-muted-foreground space-y-2">
          <p>
            The{' '}
            <Link href={`${base}/command-center`} className="text-primary underline">
              Command Center
            </Link>{' '}
            reports weakness by MPEP chapter, statute, topic, <strong className="text-foreground">content type</strong>, and{' '}
            <strong className="text-foreground">trap type</strong>; scatter plot of time vs outcome; flashcards from misses with MPEP
            anchors; anchored SRS queue.
          </p>
        </Card>
      </section>

      <section id="trust" className="scroll-mt-24">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5" /> 6. Trust &amp; compliance
        </h2>
        <Card className="p-6 space-y-3">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            {TRUST_AND_SOURCING.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground border-t pt-3">
            <strong className="text-foreground">Instructor / office hours:</strong>{' '}
            <Link href={`${base}/live`} className="text-primary underline">
              Live instruction framework
            </Link>{' '}
            (office hours &amp; cohorts UI shell)—wire calendar, video, and enrollment when product enables them.
          </p>
        </Card>
      </section>

      <section id="community" className="scroll-mt-24">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Users className="h-5 w-5" /> 7. Community &amp; accountability
        </h2>
        <Card className="p-6 space-y-4">
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {COMMUNITY_PLACEHOLDER.items.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          <p className="text-sm mt-3">
            <Link href={`${base}/live`} className="text-primary font-medium underline">
              Open live instruction roadmap →
            </Link>
          </p>
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" /> Registration &amp; exam-day checklist
            </h4>
            <ul className="space-y-2">
              {OED_LOGISTICS_CHECKLIST.map((c) => (
                <li key={c.id} className="flex gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="mt-1 rounded border" readOnly />
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}

function DateClaimMini({
  item,
  mode,
}: {
  item: (typeof DATE_CONFLICT_DRILLS)[0] | (typeof CLAIM_CONSTRUCTION_DRILLS)[0];
  mode?: 'claim';
}) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const isDate = !mode;
  const correct = item.correctIndex;
  const show = picked !== null;

  return (
    <div className="rounded-lg border p-4 text-sm">
      <p className="font-medium text-foreground mb-3">{item.prompt}</p>
      <div className="space-y-2">
        {item.choices.map((ch, i) => {
          const wrong = show && picked === i && i !== correct;
          const right = show && i === correct;
          return (
            <button
              key={i}
              type="button"
              disabled={show}
              onClick={() => setPicked(i)}
              className={`w-full text-left rounded-md px-3 py-2 text-xs border transition-colors ${
                wrong ? 'border-red-300 bg-red-50 dark:bg-red-950/40' : right ? 'border-green-400 bg-green-50 dark:bg-green-950/40' : 'hover:bg-muted/50'
              }`}
            >
              <span className="font-mono mr-2 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
              {ch}
            </button>
          );
        })}
      </div>
      {show && (
        <div className="mt-3 text-xs text-muted-foreground space-y-1 border-t pt-3">
          {'aiaNote' in item && isDate && <p><strong>AIA note:</strong> {(item as any).aiaNote}</p>}
          {'mpepHint' in item && isDate && <p><strong>MPEP:</strong> {(item as any).mpepHint}</p>}
          {'why' in item && mode === 'claim' && <p><strong>Why:</strong> {(item as any).why}</p>}
        </div>
      )}
      {show && (
        <Button variant="ghost" size="sm" className="mt-2 h-8 text-xs" onClick={() => setPicked(null)}>
          Reset
        </Button>
      )}
    </div>
  );
}

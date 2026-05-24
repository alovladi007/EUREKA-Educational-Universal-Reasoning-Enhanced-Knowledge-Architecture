'use client';

/**
 * LSAT live instruction — counterpart to Patent Bar's /live page.
 * Lists upcoming cohort sessions, office hours, and recorded replays.
 * Static schedule for now (no backend wiring yet); structure mirrors the
 * Patent Bar live page so the UX is consistent.
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Video, Calendar, Users, Clock, ExternalLink, BookOpen, Mic,
} from 'lucide-react';

const EXAM = 'LSAT';

// Static demonstration roster — replace with API once the live-cohorts
// endpoint is generalised for LSAT (currently it's Patent-Bar specific).
const COHORT_SESSIONS = [
  { title: 'LR pattern hour: Strengthen / Weaken', when: 'Mon · 6:00 PM ET · 60 min', instructor: 'Sara K. (179 LSAT)', focus: 'Two LR types together — the symmetry between them is most candidates\' biggest gain.' },
  { title: 'LR conditional logic deep-dive', when: 'Wed · 6:00 PM ET · 60 min', instructor: 'Marcus T.', focus: 'A→B, contrapositive, "unless/only/no" translations. Live diagramming exercises.' },
  { title: 'RC structure & pacing clinic', when: 'Thu · 7:00 PM ET · 75 min', instructor: 'Sara K.', focus: 'Mapping passages in 3 minutes, identifying the main point, working comparative pairs.' },
  { title: 'Full-section autopsy', when: 'Sat · 11:00 AM ET · 90 min', instructor: 'Rotating', focus: 'Group reviews of a 35-min LR section together — flag traps, talk through wrong-answer types.' },
];

const OFFICE_HOURS = [
  { day: 'Tuesday', when: '5:00–6:00 PM ET', staffed: 'Sara K.' },
  { day: 'Thursday', when: '8:00–9:00 PM ET', staffed: 'Marcus T.' },
  { day: 'Sunday', when: '2:00–4:00 PM ET (drop-in)', staffed: 'Rotating' },
];

const REPLAYS = [
  { title: 'Necessary vs Sufficient Assumption', date: 'Last week', duration: '58 min', viewed: false },
  { title: 'Parallel Reasoning shortcuts', date: '2 weeks ago', duration: '47 min', viewed: true },
  { title: 'Comparative RC walkthrough', date: '3 weeks ago', duration: '52 min', viewed: false },
  { title: 'How to flag and skip without panic', date: '1 month ago', duration: '38 min', viewed: false },
];

export default function LsatLivePage() {
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
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link href={base} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to LSAT hub
        </Link>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Video className="h-7 w-7 text-purple-600" /> LSAT live instruction
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Weekly cohort sessions with instructors who scored 175+. Each session focuses on a single
          high-yield LR pattern, RC structural skill, or full-section autopsy. Replays available
          for 48 hours.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href={`${base}/lsat-program`}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Full program
            </Button>
          </Link>
          <Link href={`${base}/lawhub-workbench`}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> LawHub workbench
            </Button>
          </Link>
        </div>
      </div>

      {/* This week's cohort sessions */}
      <div>
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" /> This week&apos;s cohort sessions
        </h2>
        <div className="grid gap-3">
          {COHORT_SESSIONS.map((s) => (
            <Card key={s.title} className="p-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline flex-wrap gap-2">
                  <p className="font-semibold">{s.title}</p>
                  <Badge variant="secondary" className="text-[10px]">{s.when}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.focus}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Mic className="h-3 w-3 inline mr-1 align-text-bottom" />
                  {s.instructor}
                </p>
              </div>
              <Button size="sm" variant="default" className="gap-1.5 shrink-0">
                <Calendar className="h-3.5 w-3.5" /> Add to calendar
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Office hours */}
      <div>
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" /> Drop-in office hours
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {OFFICE_HOURS.map((o) => (
            <Card key={o.day} className="p-3">
              <p className="text-xs text-muted-foreground">{o.day}</p>
              <p className="font-semibold text-sm mt-1">{o.when}</p>
              <p className="text-[11px] text-muted-foreground mt-1">with {o.staffed}</p>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <Clock className="h-3 w-3 inline mr-1 align-text-bottom" />
          Bring a recent practice section — instructors will help you decode wrong-answer traps in real time.
        </p>
      </div>

      {/* Replays */}
      <div>
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Video className="h-5 w-5 text-purple-600" /> Recent replays
        </h2>
        <div className="space-y-2">
          {REPLAYS.map((r) => (
            <Card key={r.title} className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 flex items-center justify-center shrink-0">
                <Video className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.date} · {r.duration}</p>
              </div>
              {r.viewed && (
                <Badge variant="outline" className="text-[10px] shrink-0">Watched</Badge>
              )}
              <Button size="sm" variant="outline" className="shrink-0">
                Watch
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

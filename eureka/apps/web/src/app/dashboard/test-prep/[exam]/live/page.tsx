'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Video,
  Users,
  CalendarClock,
  Bell,
  Plug,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { SCHEDULING_INTEGRATION_POINTS } from '@/lib/patent-live-instruction';
import type { PatentOfficeHoursSlot, PatentCohort } from '@/lib/patent-live-instruction';
import { apiClient } from '@/lib/api-client';

const EXAM = 'PATENT_BAR';

export default function PatentBarLiveInstructionPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();
  const base = `/dashboard/test-prep/${String(params.exam).toLowerCase()}`;

  const [slots, setSlots] = useState<PatentOfficeHoursSlot[]>([]);
  const [cohorts, setCohorts] = useState<PatentCohort[]>([]);
  const [schedulingConnected, setSchedulingConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
    }
  }, [exam, params.exam, router]);

  useEffect(() => {
    if (exam !== EXAM) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [oh, co] = await Promise.all([
          apiClient.getPatentLiveOfficeHours(),
          apiClient.getPatentLiveCohorts(),
        ]);
        if (cancelled) return;
        setSlots(oh?.slots ?? []);
        setCohorts(co?.cohorts ?? []);
        setSchedulingConnected(Boolean(oh?.scheduling_connected));
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Could not load live instruction schedule.');
          setSlots([]);
          setCohorts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [exam]);

  if (exam !== EXAM) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link href={base} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to Patent Bar hub
        </Link>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Live instruction</h1>
          {loading ? (
            <Badge variant="secondary" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading
            </Badge>
          ) : schedulingConnected && !error ? (
            <Badge className="gap-1 bg-green-700">Schedule API</Badge>
          ) : (
            <Badge variant="secondary">Offline</Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Office hours and cohorts are loaded from the test-prep API. Default rows are seeded in the database on first request.
        </p>
      </div>

      <Card className="p-5 border-dashed bg-muted/30">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <CalendarClock className="h-10 w-10 text-muted-foreground shrink-0" />
            <div>
              <h2 className="font-semibold text-lg">Interest list</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Notify-me enrollment can be wired to a POST endpoint later. For now this is a placeholder.
              </p>
            </div>
          </div>
          <Button disabled variant="secondary" className="gap-2 shrink-0">
            <Bell className="h-4 w-4" /> Notify me
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-destructive/50 bg-destructive/5 text-sm text-destructive">
          {error}
        </Card>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Live office hours</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          <code className="text-xs bg-muted px-1 rounded">GET /api/v1/patent-bar/live/office-hours</code>
        </p>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published slots.</p>
        ) : (
          <div className="space-y-3">
            {slots.map((slot) => (
              <Card key={slot.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium">{slot.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {slot.cadence} · {slot.time_local} · {slot.duration_min} min · {slot.topic_focus}
                  </p>
                  {slot.next_occurrence_at && (
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">Next: {slot.next_occurrence_at}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" disabled>
                    Add to calendar
                  </Button>
                  {slot.join_url ? (
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => window.open(slot.join_url!, '_blank', 'noopener,noreferrer')}
                    >
                      Join <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button size="sm" disabled variant="secondary">
                      Join (set join_url in admin)
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Cohort tracks</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          <code className="text-xs bg-muted px-1 rounded">GET /api/v1/patent-bar/live/cohorts</code>
        </p>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : cohorts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published cohorts.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {cohorts.map((c) => (
              <Card key={c.id} className="p-5 flex flex-col">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1">{c.description}</p>
                <ul className="text-xs text-muted-foreground mt-3 space-y-1 border-t pt-3">
                  <li>Duration: {c.weeks_planned} week(s)</li>
                  <li>Start: {c.start_window}</li>
                  <li>
                    {c.capacity_planned != null
                      ? `Enrolled ${c.enrolled_count} / ${c.capacity_planned}`
                      : `Enrolled ${c.enrolled_count} (cap TBD)`}
                  </li>
                </ul>
                <Button
                  className="mt-4 w-full"
                  disabled={!c.enrollment_open}
                  variant={c.enrollment_open ? 'default' : 'secondary'}
                >
                  {c.enrollment_open ? 'Enroll (wire checkout)' : 'Enrollment closed'}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Plug className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Product / engineering hooks</h2>
        </div>
        <Card className="p-5">
          <ul className="space-y-4">
            {SCHEDULING_INTEGRATION_POINTS.map((p) => (
              <li key={p.id} className="flex gap-3 text-sm">
                <span className="font-medium text-foreground min-w-[140px]">{p.title}</span>
                <span className="text-muted-foreground">{p.detail}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href={`${base}/patent-program`}>
          <Button variant="outline" size="sm">
            Full program overview
          </Button>
        </Link>
        <Link href={`${base}/command-center`}>
          <Button variant="outline" size="sm">
            Analytics
          </Button>
        </Link>
      </div>
    </div>
  );
}

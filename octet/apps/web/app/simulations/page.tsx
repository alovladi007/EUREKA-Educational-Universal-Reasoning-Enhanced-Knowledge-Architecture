'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SimulationCatalogue, getSimulations } from '@/lib/api';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  MainNav,
  Page,
  Pill,
  SectionTitle,
  errorMessage,
} from '@/app/_ui/shell';

// The simulation index.
//
// Each activity runs a predict, observe, explain cycle. The prediction comes
// first and the server will not release the simulation until it is recorded, so
// this page describes the activity and links into it without showing any part
// of a result.

export default function SimulationsPage() {
  const [catalogue, setCatalogue] = useState<SimulationCatalogue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getSimulations();
        if (!cancelled) {
          setCatalogue(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activities = catalogue?.activities ?? [];
  const scenarios = catalogue?.scenarios ?? [];

  return (
    <Page nav={<MainNav />}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Simulations</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Predict, observe, explain. You commit to a prediction, then the result
        appears, then you account for it.
      </p>

      {loading && <LoadingPanel label="Loading the simulation catalogue." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && activities.length === 0 && (
        <EmptyState
          title="No activities registered"
          detail="The simulations endpoint returned no activities, so there is nothing to run."
        />
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="space-y-8">
          <section>
            <SectionTitle>Activities</SectionTitle>
            <div className="space-y-3">
              {activities.map((activity) => {
                const scenario = scenarios.find(
                  (candidate) => candidate.id === activity.scenario,
                );
                return (
                  <Link
                    key={activity.id}
                    href={`/simulations/${encodeURIComponent(activity.id)}`}
                    className="block rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Pill tone="neutral">{activity.node}</Pill>
                      {scenario ? (
                        <Pill tone="brand">{scenario.kind}</Pill>
                      ) : (
                        <Pill tone="amber">scenario not in catalogue</Pill>
                      )}
                      <span className="font-mono text-xs text-muted-foreground">
                        {activity.scenario}
                      </span>
                    </div>

                    <p className="text-base font-semibold text-card-foreground">
                      {scenario ? scenario.title : activity.id}
                    </p>

                    {scenario && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {scenario.description}
                      </p>
                    )}

                    <p className="mt-3 text-[15px] leading-relaxed text-card-foreground">
                      {activity.prompt}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {scenarios.length > 0 && (
            <section>
              <SectionTitle>Scenarios behind these activities</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                {scenarios.map((scenario) => (
                  <Card key={scenario.id}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Pill tone="neutral">{scenario.node}</Pill>
                      <Pill tone="brand">{scenario.kind}</Pill>
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">
                      {scenario.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {scenario.description}
                    </p>
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      {scenario.id}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Page>
  );
}

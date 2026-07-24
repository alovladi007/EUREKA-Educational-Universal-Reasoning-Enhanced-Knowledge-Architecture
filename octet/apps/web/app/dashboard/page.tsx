'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ComplianceReport,
  CurriculumNodes,
  TemplateList,
  getCompliance,
  getCurriculumNodes,
  getTemplates,
} from '@/lib/api';
import {
  Card,
  EmptyState,
  ErrorPanel,
  HeaderLink,
  LoadingPanel,
  Page,
  Pill,
  SectionTitle,
  errorMessage,
  tierName,
} from '@/app/_ui/shell';

// The dashboard is a status readout, not a summary of achievements. Every
// number on it comes from a live endpoint, and anything the API has not
// answered yet says so rather than showing a zero that looks like data.

const TIER_ORDER = ['CF', 'G1', 'G2'];

export default function DashboardPage() {
  const [curriculum, setCurriculum] = useState<CurriculumNodes | null>(null);
  const [templates, setTemplates] = useState<TemplateList | null>(null);
  const [compliance, setCompliance] = useState<ComplianceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [nodes, tmpl, comp] = await Promise.all([
          getCurriculumNodes(),
          getTemplates(),
          getCompliance(),
        ]);
        if (cancelled) {
          return;
        }
        setCurriculum(nodes);
        setTemplates(tmpl);
        setCompliance(comp);
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

  const tierCounts = curriculum?.tier_counts ?? {};
  const tiers = TIER_ORDER.filter((t) => t in tierCounts).concat(
    Object.keys(tierCounts).filter((t) => !TIER_ORDER.includes(t)),
  );
  const nodeTotal = Object.values(tierCounts).reduce((a, b) => a + b, 0);

  return (
    <Page
      nav={
        <>
          <HeaderLink href="/learn">Learn</HeaderLink>
          <HeaderLink href="/practice">Practice</HeaderLink>
          <HeaderLink href="/path">Path</HeaderLink>
        </>
      }
    >
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Orbitals, Compounds, Thermodynamics, Equilibria, Transformations.
      </p>

      {loading && <LoadingPanel label="Loading the chemistry workspace." />}

      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && (
        <div className="space-y-8">
          <section>
            <SectionTitle>Compliance</SectionTitle>
            <ComplianceCard report={compliance} />
          </section>

          <section>
            <SectionTitle>Curriculum</SectionTitle>
            {nodeTotal === 0 ? (
              <EmptyState
                title="No curriculum nodes yet"
                detail="The API returned an empty graph. Nothing is being shown in its place."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="text-3xl font-bold tabular-nums">{nodeTotal}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nodes in total
                  </p>
                </Card>
                {tiers.map((tier) => (
                  <Card key={tier}>
                    <p className="text-3xl font-bold tabular-nums">
                      {tierCounts[tier]}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tierName(tier)}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionTitle>Practice items</SectionTitle>
            <TemplatesCard templates={templates} />
          </section>

          <section>
            <SectionTitle>Where to go</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
              <NavCard
                href="/learn"
                title="Learn"
                detail="Lessons in the six part arc, grouped by tier."
              />
              <NavCard
                href="/practice"
                title="Practice"
                detail="Generated items with a three rung hint ladder."
              />
              <NavCard
                href="/path"
                title="Path"
                detail="The planned route, with a reason on every node."
              />
            </div>
          </section>
        </div>
      )}
    </Page>
  );
}

// The compliance badge. Green means the teaching model checklist passed with
// nothing blocking. Red states how many blocking problems are outstanding,
// because a course that cannot show a green checklist should not be trusted
// and hiding the count would defeat the purpose of running the check.
function ComplianceCard({ report }: { report: ComplianceReport | null }) {
  if (!report) {
    return (
      <EmptyState
        title="No compliance report"
        detail="The compliance endpoint returned nothing."
      />
    );
  }

  const blocking = report.blocking_count;
  const topChecks = Object.entries(report.by_check).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={report.green ? 'green' : 'red'}>
          {report.green ? 'Checklist green' : 'Checklist red'}
        </Pill>
        <span className="text-sm text-muted-foreground">
          {blocking === 0
            ? 'Zero blocking problems.'
            : `${blocking} blocking ${blocking === 1 ? 'problem' : 'problems'}.`}
        </span>
        {report.warnings_count > 0 && (
          <Pill tone="amber">
            {report.warnings_count} pending for a later phase
          </Pill>
        )}
      </div>

      {topChecks.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm">
          {topChecks.map(([check, count]) => (
            <li key={check} className="flex justify-between gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {check}
              </span>
              <span className="tabular-nums text-red-700 dark:text-red-300">
                {count}
              </span>
            </li>
          ))}
        </ul>
      )}

      {Object.keys(report.counts).length > 0 && (
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-sm">
          {Object.entries(report.counts).map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-1.5">
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  );
}

function TemplatesCard({ templates }: { templates: TemplateList | null }) {
  if (!templates || templates.templates.length === 0) {
    return (
      <EmptyState
        title="No templates registered"
        detail="The API returned an empty template list, so there is nothing to practice yet."
      />
    );
  }

  const total = templates.templates.length;
  const withLadder = templates.templates.filter((t) => t.hint_rungs >= 3).length;
  const graders = Array.from(
    new Set(templates.templates.map((t) => t.grader)),
  ).sort();

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-3xl font-bold tabular-nums">{total}</p>
          <p className="mt-1 text-sm text-muted-foreground">Live templates</p>
        </div>
        <div>
          <p className="text-3xl font-bold tabular-nums">{withLadder}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            With a three rung hint ladder
          </p>
        </div>
        <div>
          <p className="text-3xl font-bold tabular-nums">{graders.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">Graders in use</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {graders.map((g) => (
          <Pill key={g} tone="neutral">
            {g}
          </Pill>
        ))}
      </div>
      <Link
        href="/practice"
        className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
      >
        Start practicing
      </Link>
    </Card>
  );
}

function NavCard({
  href,
  title,
  detail,
}: {
  href: string;
  title: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <p className="text-base font-semibold text-card-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </Link>
  );
}

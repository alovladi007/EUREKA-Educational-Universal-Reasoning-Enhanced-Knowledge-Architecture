'use client';

import Link from 'next/link';
import { MainNav, Page, SectionTitle } from '@/app/_ui/shell';

// The explore index. Three surfaces sit under it, and each one is a way of
// looking at chemistry rather than a way of being tested on it.
//
// This page fetches nothing. It is a set of links, and it does not claim any
// counts or coverage numbers, because the surfaces themselves report those from
// the live API.

const SURFACES: Array<{ href: string; title: string; detail: string }> = [
  {
    href: '/explore/periodic',
    title: 'Periodic table',
    detail:
      'Every element, with one periodic property drawn as a colour layer. The coverage of each layer is stated, and an element with no value is left as a visible gap.',
  },
  {
    href: '/explore/molecules',
    title: 'Molecule library',
    detail:
      'The curated molecule set, searchable by name or formula and filterable by category. Each entry carries its formula, molar mass, InChIKey and a note on where it turns up in the world.',
  },
  {
    href: '/explore/triangle',
    title: 'Chemistry triangle',
    detail:
      'One concept shown three ways at once: what you see, what the particles do, and what chemists write. The connector names the one thing that is identical across all three.',
  },
];

export default function ExplorePage() {
  return (
    <Page nav={<MainNav />}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Explore</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Three ways to look at the same subject. Nothing here is graded.
      </p>

      <section>
        <SectionTitle>Surfaces</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {SURFACES.map((surface) => (
            <Link
              key={surface.href}
              href={surface.href}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <p className="text-base font-semibold text-card-foreground">
                {surface.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {surface.detail}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle>Simulations</SectionTitle>
        <Link
          href="/simulations"
          className="block rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <p className="text-base font-semibold text-card-foreground">
            Predict, observe, explain
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Titration and equilibrium activities. The result is withheld until a
            prediction is recorded, because a prediction made after seeing the
            answer teaches nothing.
          </p>
        </Link>
      </section>
    </Page>
  );
}

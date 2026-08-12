'use client';

import { Atom, FlaskConical, Grid3x3, Triangle } from 'lucide-react';
import { Band, Entry, Page, PageHeader } from '@/app/_ui/shell';

// The explore index. Three surfaces sit under it, and each one is a way of
// looking at chemistry rather than a way of being tested on it.
//
// This page fetches nothing. It is a set of doors, and it claims no counts or
// coverage numbers, because the surfaces themselves report those from the
// live API - a number repeated here would be a second source for one fact.

export default function ExplorePage() {
  return (
    <Page>
      <PageHeader
        title="Explore"
        lead="Three ways to look at the same subject. Nothing here is graded, and nothing here records an attempt."
      />

      <div className="space-y-6">
        <Band title="Surfaces">
          <div className="grid gap-3 sm:grid-cols-3">
            <Entry
              href="/explore/periodic"
              icon={<Grid3x3 className="h-4 w-4" />}
              title="Periodic table"
              body="Every element, with one periodic property drawn as a colour layer. Each layer states its coverage, and an element with no value stays a visible gap."
              foot="open"
            />
            <Entry
              href="/explore/molecules"
              icon={<Atom className="h-4 w-4" />}
              title="Molecule library"
              body="The curated set, searchable by name or formula. Each entry carries its formula, molar mass, InChIKey and a note on where it turns up in the world."
              foot="open"
            />
            <Entry
              href="/explore/triangle"
              icon={<Triangle className="h-4 w-4" />}
              title="Chemistry triangle"
              body="One concept three ways at once: what you see, what the particles do, and what chemists write. The connector names what is identical across all three."
              foot="open"
            />
          </div>
        </Band>

        <Band title="Simulations">
          <div className="grid gap-3 sm:grid-cols-3">
            <Entry
              href="/simulations"
              icon={<FlaskConical className="h-4 w-4" />}
              title="Predict, observe, explain"
              body="Titration and equilibrium benches. The result is withheld until a prediction is recorded, because a prediction made after seeing the answer teaches nothing."
              foot="open"
            />
          </div>
        </Band>
      </div>
    </Page>
  );
}

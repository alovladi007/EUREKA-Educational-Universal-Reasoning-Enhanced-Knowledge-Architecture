'use client';

import { useEffect, useState } from 'react';
import { Molecule, MoleculeList, getMolecule, getMolecules } from '@/lib/api';
import { MolViewer } from '@/components';
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

// The molecule library.
//
// One thing on this page is easy to get wrong and matters: the library stores
// SMILES, which records which atoms are bonded to which and nothing about where
// they sit in space. has_3d is false for every entry and coordinates_note says
// why. So nothing here is described as a measured three dimensional structure,
// and the viewer is left to say plainly that it has no coordinates to draw.

type MoleculeRow = MoleculeList['molecules'][number];

const SEARCH_DEBOUNCE_MS = 250;

export default function MoleculesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const [list, setList] = useState<MoleculeList | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [molecule, setMolecule] = useState<Molecule | null>(null);
  const [moleculeLoading, setMoleculeLoading] = useState(false);
  const [moleculeError, setMoleculeError] = useState<string | null>(null);

  // Search and category run through one effect. The timer keeps a request off
  // every keystroke, and the cancelled flag keeps a slow response from
  // overwriting a newer one.
  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    const timer = setTimeout(() => {
      (async () => {
        try {
          const result = await getMolecules({
            search: query.trim() || undefined,
            category: category || undefined,
          });
          if (!cancelled) {
            setList(result);
            setListError(null);
          }
        } catch (err) {
          if (!cancelled) {
            setListError(errorMessage(err));
          }
        } finally {
          if (!cancelled) {
            setListLoading(false);
          }
        }
      })();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, category]);

  useEffect(() => {
    if (!selectedName) {
      setMolecule(null);
      setMoleculeError(null);
      return;
    }
    let cancelled = false;
    setMoleculeLoading(true);
    setMolecule(null);
    setMoleculeError(null);
    (async () => {
      try {
        const found = await getMolecule(selectedName);
        if (!cancelled) {
          setMolecule(found);
        }
      } catch (err) {
        if (!cancelled) {
          setMoleculeError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setMoleculeLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedName]);

  const rows: MoleculeRow[] = list?.molecules ?? [];
  const categories = list?.categories ?? [];

  return (
    <Page nav={<MainNav />}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        Molecule library
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        A curated set, searchable by name or formula. Every entry carries what
        the library actually stores, which is connectivity rather than
        coordinates.
      </p>

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="molecule-search"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Search by name or formula
            </label>
            <input
              id="molecule-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label
              htmlFor="molecule-category"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Category
            </label>
            <select
              id="molecule-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All categories</option>
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <section className="mb-8">
        <SectionTitle>Results</SectionTitle>

        {listLoading && <LoadingPanel label="Loading the molecule library." />}
        {!listLoading && listError && <ErrorPanel message={listError} />}

        {!listLoading && !listError && rows.length === 0 && (
          <EmptyState
            title="No molecules match"
            detail="Nothing in the library matches this search and category. Nothing is being shown in their place."
          />
        )}

        {!listLoading && !listError && rows.length > 0 && list && (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              Showing {rows.length} of {list.total_matching} matching{' '}
              {list.total_matching === 1 ? 'entry' : 'entries'}. The library
              holds {list.library_size} in total.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {rows.map((row) => {
                const active = row.name === selectedName;
                return (
                  <button
                    key={row.name}
                    type="button"
                    onClick={() => setSelectedName(row.name)}
                    aria-pressed={active}
                    className={[
                      'rounded-xl border bg-card p-4 text-left shadow-sm transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-brand-500',
                      active
                        ? 'border-brand-600'
                        : 'border-border hover:border-brand-500',
                    ].join(' ')}
                  >
                    <p className="text-base font-semibold text-card-foreground">
                      {row.name}
                    </p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {row.formula}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {row.category}, molar mass {row.molar_mass} g/mol
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      {selectedName && (
        <section>
          <SectionTitle>Selected molecule</SectionTitle>
          {moleculeLoading && <LoadingPanel label="Loading the molecule." />}
          {!moleculeLoading && moleculeError && (
            <ErrorPanel message={moleculeError} />
          )}
          {!moleculeLoading && !moleculeError && molecule && (
            <MoleculeDetail molecule={molecule} />
          )}
        </section>
      )}
    </Page>
  );
}

function MoleculeDetail({ molecule }: { molecule: Molecule }) {
  const pending = molecule.review.toLowerCase() === 'pending';

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-xl font-bold tracking-tight">{molecule.name}</h2>
          <Pill tone="neutral">{molecule.category}</Pill>
          <Pill tone={pending ? 'amber' : 'neutral'}>
            review: {molecule.review}
          </Pill>
        </div>

        <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Formula
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-card-foreground">
              {molecule.formula}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Molar mass
            </dt>
            <dd className="mt-0.5 text-sm tabular-nums text-card-foreground">
              {molecule.molar_mass} g/mol
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              InChIKey
            </dt>
            <dd className="mt-0.5 break-all font-mono text-sm text-card-foreground">
              {molecule.inchikey || 'No InChIKey is carried for this entry.'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              SMILES
            </dt>
            <dd className="mt-0.5 break-all font-mono text-sm text-card-foreground">
              {molecule.smiles}
            </dd>
          </div>
        </dl>

        {molecule.real_world_note && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Where this turns up
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-card-foreground">
              {molecule.real_world_note}
            </p>
          </div>
        )}
      </Card>

      {/* What the library stores, stated before the viewer rather than after
          it, so the panel below is read for what it is. */}
      <Card>
        <SectionTitle>What this structure is and is not</SectionTitle>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Pill tone="neutral">
            {molecule.has_3d
              ? 'coordinates supplied'
              : 'no coordinates supplied'}
          </Pill>
        </div>
        <p className="text-[15px] leading-relaxed text-card-foreground">
          {molecule.coordinates_note}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {molecule.has_3d
            ? 'This entry carries coordinates, so the viewer below has a geometry to draw.'
            : 'This entry carries no coordinates, so nothing below is a measured three dimensional structure. The viewer says so rather than drawing a shape that would be read as one.'}
        </p>
      </Card>

      <MolViewer smiles={molecule.smiles} name={molecule.name} />

      {molecule.hazard_notes.length > 0 && (
        <Card>
          <SectionTitle>Hazard notes</SectionTitle>
          <p className="mb-3 text-sm text-muted-foreground">
            These are here as chemistry to learn from. They describe how the
            substance behaves and why, and they are not instructions for
            handling it.
          </p>
          <ul className="space-y-2">
            {molecule.hazard_notes.map((note) => (
              <li
                key={note}
                className="rounded-lg border border-border p-3 text-sm leading-relaxed text-card-foreground"
              >
                {note}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  PeriodicElement,
  PeriodicTable as PeriodicTableData,
  TrendCoverage,
  getPeriodicTable,
} from '@/lib/api';
import { PeriodicTable } from '@/components';
import type { ElementData, PeriodicTrend } from '@/components';
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

// The periodic table surface.
//
// The honesty requirement is the point of this page, so it is stated once here
// and then enforced below:
//
//   1. A trend layer that covers part of the table must say so. The coverage
//      block is on screen whenever a layer is active, with the measured count,
//      the missing count and the elements that carry no value.
//
//   2. An element with no value renders as a visible gap. It is never
//      interpolated from its neighbours and never coloured as if the value were
//      zero. The shipped table component draws those cells grey and writes
//      "n/a" in them, which is what a gap should look like.
//
//   3. A missing value is not always missing data. Helium carries no Pauling
//      electronegativity because it forms no bonds from which one could be
//      defined. That is chemistry, not a hole in the data set, and the page says
//      so rather than papering over it.
//
//   4. The review status travels with the data. While it reads "pending" no
//      number on this page may be presented as expert verified.

interface TrendMeta {
  label: string;
  unit: string;
  // The shipped table draws three colour layers. A field with no layer here is
  // still a real trend field from the API; it just cannot be coloured, and the
  // page says that instead of borrowing another layer's scale.
  layer?: PeriodicTrend;
}

const TREND_META: Record<string, TrendMeta> = {
  electronegativity: {
    label: 'Electronegativity',
    unit: 'Pauling scale',
    layer: 'electronegativity',
  },
  atomic_radius_pm: {
    label: 'Atomic radius',
    unit: 'pm',
    layer: 'radius',
  },
  ionization_energy_kJmol: {
    label: 'First ionization energy',
    unit: 'kJ/mol',
    layer: 'ionization',
  },
  electron_affinity_kJmol: {
    label: 'Electron affinity',
    unit: 'kJ/mol',
  },
  atomic_mass: {
    label: 'Atomic mass',
    unit: 'u',
  },
};

// A field the API adds later still gets a working selector entry. It is
// labelled with its own name rather than a made up one, and carries no unit,
// because inventing a unit would be inventing a claim.
function metaFor(field: string): TrendMeta {
  return TREND_META[field] ?? { label: field, unit: '' };
}

function unitSuffix(field: string): string {
  const unit = metaFor(field).unit;
  return unit ? ` ${unit}` : '';
}

function valueFor(element: PeriodicElement, field: string): number | null {
  switch (field) {
    case 'electronegativity':
      return element.electronegativity;
    case 'atomic_radius_pm':
      return element.atomic_radius_pm;
    case 'ionization_energy_kJmol':
      return element.ionization_energy_kJmol;
    case 'electron_affinity_kJmol':
      return element.electron_affinity_kJmol;
    case 'atomic_mass':
      return element.atomic_mass;
    default:
      return null;
  }
}

// Show the number the API sent, with float noise trimmed. No rounding to a
// precision the source did not carry.
function formatNumber(value: number): string {
  return String(Math.round(value * 1000) / 1000);
}

export default function PeriodicPage() {
  const [table, setTable] = useState<PeriodicTableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [field, setField] = useState<string>('');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPeriodicTable();
        if (!cancelled) {
          setTable(data);
          setField(data.trend_fields[0] ?? '');
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

  // Each API field is mapped into the slot the table component reads for that
  // same property. Nothing is moved into a slot it does not belong in.
  const elements: ElementData[] = useMemo(() => {
    if (!table) {
      return [];
    }
    return table.elements.map((element) => ({
      symbol: element.symbol,
      name: element.name,
      number: element.number,
      group: element.group,
      period: element.period,
      category: element.category,
      atomic_mass: element.atomic_mass,
      radius_pm: element.atomic_radius_pm,
      electronegativity: element.electronegativity,
      ionization_kj_mol: element.ionization_energy_kJmol,
    }));
  }, [table]);

  const meta = metaFor(field);
  const coverage: TrendCoverage | null = table?.coverage[field] ?? null;
  const range = table?.ranges[field] ?? null;
  const selected =
    table?.elements.find((element) => element.symbol === selectedSymbol) ?? null;

  return (
    <Page nav={<MainNav />}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Periodic table</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        One property at a time, drawn over the whole table. Every value on this
        page comes from the API, and every element that carries no value is left
        as a gap.
      </p>

      {loading && <LoadingPanel label="Loading the periodic table." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && table && table.elements.length === 0 && (
        <EmptyState
          title="No elements returned"
          detail="The periodic table endpoint returned an empty element list, so there is nothing to draw."
        />
      )}

      {!loading && !error && table && table.elements.length > 0 && (
        <div className="space-y-6">
          <Card>
            <SectionTitle>Trend layer</SectionTitle>
            {table.trend_fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                The API returned no trend fields, so there is no layer to
                select.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {table.trend_fields.map((candidate) => {
                    const active = candidate === field;
                    return (
                      <button
                        key={candidate}
                        type="button"
                        onClick={() => setField(candidate)}
                        aria-pressed={active}
                        className={[
                          'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-brand-500',
                          active
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-border text-foreground hover:border-brand-500',
                        ].join(' ')}
                      >
                        {metaFor(candidate).label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  {field}
                </p>
              </>
            )}
          </Card>

          {field && (
            <CoverageCard
              field={field}
              coverage={coverage}
              range={range}
              tableReview={table.review}
              elements={table.elements}
            />
          )}

          {field && meta.layer ? (
            <Card>
              <PeriodicTable
                elements={elements}
                trend={meta.layer}
                onSelect={(symbol) => setSelectedSymbol(symbol)}
              />
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                Grey cells marked n/a carry no value for this layer. They are
                drawn as gaps on purpose. Nothing is interpolated across them,
                and they are not treated as zero, which would place them at one
                end of the colour scale and misread as a real measurement.
              </p>
            </Card>
          ) : (
            field && (
              <UncolouredLayer
                field={field}
                elements={table.elements}
                onSelect={(symbol) => setSelectedSymbol(symbol)}
              />
            )
          )}

          <section>
            <SectionTitle>Element detail</SectionTitle>
            {selected ? (
              <ElementDetail element={selected} />
            ) : (
              <EmptyState
                title="No element selected"
                detail="Pick an element above to see its full record, including which of its properties carry no value."
              />
            )}
          </section>
        </div>
      )}
    </Page>
  );
}

// Coverage for the active layer, stated in words and in numbers. This block is
// on screen whenever a layer is active, which is the requirement.
function CoverageCard({
  field,
  coverage,
  range,
  tableReview,
  elements,
}: {
  field: string;
  coverage: TrendCoverage | null;
  range: [number, number] | null;
  tableReview: string;
  elements: PeriodicElement[];
}) {
  const meta = metaFor(field);

  if (!coverage) {
    return (
      <Card>
        <SectionTitle>Coverage</SectionTitle>
        <p className="text-sm text-muted-foreground">
          The API returned no coverage record for {meta.label.toLowerCase()}, so
          this page cannot say how much of the table the layer covers. Read the
          colours as incomplete until it can.
        </p>
      </Card>
    );
  }

  const missingSymbols = coverage.missing_numbers
    .map((number) => elements.find((element) => element.number === number))
    .filter((element): element is PeriodicElement => Boolean(element))
    .map((element) => `${element.symbol} (${element.number})`);

  const heliumMissing =
    field === 'electronegativity' && coverage.missing_numbers.includes(2);

  const review = coverage.review || tableReview;
  const pending = review.toLowerCase() === 'pending';

  return (
    <Card>
      <SectionTitle>Coverage</SectionTitle>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Pill tone="brand">{meta.label}</Pill>
        <Pill tone={pending ? 'amber' : 'neutral'}>review: {review}</Pill>
      </div>

      <p className="text-[15px] leading-relaxed text-card-foreground">
        {coverage.measured} of {coverage.total} elements carry a measured value
        for {meta.label.toLowerCase()}. {coverage.missing} carry none.
      </p>

      {range ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Across the elements that do carry a value, the range is{' '}
          {formatNumber(range[0])} to {formatNumber(range[1])}
          {unitSuffix(field)}. The colour scale spans exactly that range and
          nothing outside it.
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          No element carries a value for this layer, so there is no range to
          draw a scale from.
        </p>
      )}

      {missingSymbols.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Carries no value for this layer
          </p>
          <p className="mt-1 break-words text-sm text-card-foreground">
            {missingSymbols.join(', ')}.
          </p>
        </div>
      )}

      {heliumMissing && (
        <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
          Helium is on that list, and it is not a hole in the data set. Helium
          forms no bonds from which a Pauling electronegativity could be
          defined, so there is no value to carry. A blank here can mean nobody
          has measured it, or it can mean the quantity is not defined for that
          element. This page shows the gap either way and does not guess which.
        </p>
      )}

      {pending && (
        <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
          The review status for this data reads pending. No value on this page
          is presented as expert verified while that is true.
        </p>
      )}
    </Card>
  );
}

// A trend field the shipped table cannot colour. The values are real and are
// listed as they came back. No other layer's colour scale is borrowed for
// them, because a legend that names one property while showing another is a
// false statement about the data.
function UncolouredLayer({
  field,
  elements,
  onSelect,
}: {
  field: string;
  elements: PeriodicElement[];
  onSelect: (symbol: string) => void;
}) {
  const meta = metaFor(field);

  return (
    <Card>
      <SectionTitle>{meta.label}</SectionTitle>
      <p className="mb-4 text-sm text-muted-foreground">
        The table in this build draws three colour layers: electronegativity,
        atomic radius and first ionization energy. It does not draw{' '}
        {meta.label.toLowerCase()}, so the values are listed here instead of
        being pushed through a colour scale and a legend that name a different
        property. Every element is still selectable.
      </p>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {elements.map((element) => {
          const value = valueFor(element, field);
          return (
            <button
              key={element.symbol}
              type="button"
              onClick={() => onSelect(element.symbol)}
              className="rounded-lg border border-border p-2 text-left transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <span className="block text-sm font-semibold text-card-foreground">
                {element.symbol}
              </span>
              <span className="block text-[11px] tabular-nums text-muted-foreground">
                {value === null
                  ? 'no value'
                  : `${formatNumber(value)}${unitSuffix(field)}`}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// One element in full. A property with no value says so in words. It is never
// left blank and never shown as a dash, because both of those read as zero at a
// glance and zero is a measurement.
function ElementDetail({ element }: { element: PeriodicElement }) {
  const properties: Array<{ field: string; value: number | null }> = [
    { field: 'electronegativity', value: element.electronegativity },
    { field: 'atomic_radius_pm', value: element.atomic_radius_pm },
    {
      field: 'ionization_energy_kJmol',
      value: element.ionization_energy_kJmol,
    },
    {
      field: 'electron_affinity_kJmol',
      value: element.electron_affinity_kJmol,
    },
  ];

  const anyMissing = properties.some((property) => property.value === null);

  return (
    <Card>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-bold tracking-tight">
          {element.symbol}
        </span>
        <span className="text-lg font-semibold text-card-foreground">
          {element.name}
        </span>
        <Pill tone="neutral">Z = {element.number}</Pill>
        <Pill tone="neutral">{element.category}</Pill>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <Field label="Atomic number">{element.number}</Field>
        <Field label="Atomic mass">
          {formatNumber(element.atomic_mass)} u
        </Field>
        <Field label="Electron configuration">
          <span className="font-mono text-sm">
            {element.electron_configuration || 'No configuration is carried.'}
          </span>
        </Field>
        <Field label="Category">{element.category}</Field>
        <Field label="State at STP">{element.state_at_stp}</Field>
        <Field label="Period and group">
          period {element.period},{' '}
          {element.group === null
            ? 'no group number is carried for this element'
            : `group ${element.group}`}
        </Field>
      </dl>

      <div className="mt-5 border-t border-border pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Trend properties
        </p>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {properties.map((property) => (
            <Field key={property.field} label={metaFor(property.field).label}>
              {property.value === null ? (
                <span className="text-muted-foreground">
                  No value is carried for this element.
                </span>
              ) : (
                <span className="tabular-nums">
                  {formatNumber(property.value)}
                  {unitSuffix(property.field)}
                </span>
              )}
            </Field>
          ))}
        </dl>

        {anyMissing && (
          <p className="mt-4 text-sm text-muted-foreground">
            At least one property above carries no value. Some are absent
            because nobody has measured them, and some, such as the Pauling
            electronegativity of helium, are absent because the quantity is not
            defined for that element. This page does not decide which, so it
            states the absence and stops there.
          </p>
        )}
      </div>

      {element.note && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Note
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-card-foreground">
            {element.note}
          </p>
        </div>
      )}
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-card-foreground">{children}</dd>
    </div>
  );
}

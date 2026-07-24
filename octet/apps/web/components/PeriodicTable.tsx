'use client';

import React, { useMemo } from 'react';

/**
 * Periodic table rendered as a heat layer over one periodic property.
 *
 * The component makes no chemistry claims of its own. It renders the numbers it
 * is given, states their units, and says plainly when a value is missing. Every
 * value on screen comes from the elements prop.
 */

export interface ElementData {
  symbol: string;
  name: string;
  number: number;
  /** Null or absent for the f block, which is placed by atomic number instead. */
  group?: number | null;
  period: number;
  category?: string;
  atomic_mass?: number;
  /** Any of the three trend values may be missing for a given element. */
  radius_pm?: number | null;
  electronegativity?: number | null;
  ionization_kj_mol?: number | null;
}

export type PeriodicTrend = 'radius' | 'electronegativity' | 'ionization';

export interface PeriodicTableProps {
  elements: ElementData[];
  trend: PeriodicTrend;
  onSelect?: (symbol: string) => void;
}

interface TrendMeta {
  label: string;
  /** Unit shown on the legend. Empty string means the scale is dimensionless. */
  unit: string;
  decimals: number;
}

const TREND_META: Record<PeriodicTrend, TrendMeta> = {
  radius: { label: 'Atomic radius', unit: 'pm', decimals: 0 },
  electronegativity: { label: 'Electronegativity', unit: 'Pauling scale', decimals: 2 },
  ionization: { label: 'First ionization energy', unit: 'kJ/mol', decimals: 0 },
};

/**
 * A single hue blue ramp built on the EUREKA brand colour, so the table reads
 * as part of the platform rather than as a separate tool.
 *
 * These are the sky stops from 100 through 900, which keeps the ramp
 * monotonically darkening. That matters more than it looks: a reader compares
 * two cells by lightness, so a scale that brightens and then darkens again
 * would make two different values look equally intense. Viridis was here
 * before and is perceptually excellent, but it sweeps through purple, green
 * and yellow, which is three hues this product does not otherwise use.
 */
const RAMP = ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#0369a1', '#0c4a6e'];
const RAMP_CSS = `linear-gradient(to right, ${RAMP.join(', ')})`;

/** Grid geometry. Row 1 carries the group headers, so a period sits at period + 1. */
const HEADER_ROW = 1;
const SPACER_ROW = 9;
const LANTHANIDE_ROW = 10;
const ACTINIDE_ROW = 11;
const F_BLOCK_START_COLUMN = 3;

function trendValue(element: ElementData, trend: PeriodicTrend): number | null {
  const raw =
    trend === 'radius'
      ? element.radius_pm
      : trend === 'electronegativity'
        ? element.electronegativity
        : element.ionization_kj_mol;
  if (raw === null || raw === undefined) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatValue(value: number, trend: PeriodicTrend): string {
  const { decimals } = TREND_META[trend];
  return value.toFixed(decimals);
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

/** Interpolate the ramp at t in [0, 1] and pick a text colour that stays legible on it. */
function rampColour(t: number): { background: string; foreground: string } {
  const clamped = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0));
  const scaled = clamped * (RAMP.length - 1);
  const index = Math.min(RAMP.length - 2, Math.floor(scaled));
  const fraction = scaled - index;

  const from = hexToRgb(RAMP[index]);
  const to = hexToRgb(RAMP[index + 1]);
  const mixed = from.map((channel, i) =>
    Math.round(channel + (to[i] - channel) * fraction),
  ) as [number, number, number];

  const luminance =
    (0.2126 * mixed[0] + 0.7152 * mixed[1] + 0.0722 * mixed[2]) / 255;

  return {
    background: `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`,
    foreground: luminance > 0.55 ? '#0f172a' : '#f8fafc',
  };
}

interface CellPlacement {
  row: number;
  column: number;
}

/**
 * Lanthanides and actinides are placed by atomic number in the two offset rows
 * below the main block, which is where a printed table puts them. Everything
 * else is placed by its group and period.
 */
function placeElement(element: ElementData): CellPlacement | null {
  if (element.number >= 57 && element.number <= 71) {
    return { row: LANTHANIDE_ROW, column: element.number - 57 + F_BLOCK_START_COLUMN };
  }
  if (element.number >= 89 && element.number <= 103) {
    return { row: ACTINIDE_ROW, column: element.number - 89 + F_BLOCK_START_COLUMN };
  }
  const group = element.group;
  if (
    typeof group === 'number' &&
    group >= 1 &&
    group <= 18 &&
    element.period >= 1 &&
    element.period <= 7
  ) {
    return { row: element.period + HEADER_ROW, column: group };
  }
  return null;
}

const GROUP_NUMBERS = Array.from({ length: 18 }, (_, i) => i + 1);

export default function PeriodicTable({
  elements,
  trend,
  onSelect,
}: PeriodicTableProps) {
  const meta = TREND_META[trend];

  const { min, max, withData, withoutData, placed, unplaced } = useMemo(() => {
    const safeElements = Array.isArray(elements) ? elements : [];

    // Elements with no value for this trend are excluded from the scale
    // entirely, so one missing number cannot stretch the colour ramp.
    const values = safeElements
      .map((element) => trendValue(element, trend))
      .filter((value): value is number => value !== null);

    const placedRows: Array<{ element: ElementData; placement: CellPlacement }> = [];
    const unplacedRows: ElementData[] = [];

    safeElements.forEach((element) => {
      const placement = placeElement(element);
      if (placement) {
        placedRows.push({ element, placement });
      } else {
        unplacedRows.push(element);
      }
    });

    return {
      min: values.length > 0 ? Math.min(...values) : null,
      max: values.length > 0 ? Math.max(...values) : null,
      withData: values.length,
      withoutData: safeElements.length - values.length,
      placed: placedRows,
      unplaced: unplacedRows,
    };
  }, [elements, trend]);

  const span = min !== null && max !== null ? max - min : 0;

  function cellColours(value: number | null) {
    if (value === null || min === null || max === null) return null;
    // A flat scale (every element identical) maps to the middle of the ramp
    // rather than dividing by zero.
    const t = span === 0 ? 0.5 : (value - min) / span;
    return rampColour(t);
  }

  if (!Array.isArray(elements) || elements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          No element data was supplied.
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The table renders once the page passes an elements array.
        </p>
      </div>
    );
  }

  return (
    <section
      className="w-full text-slate-900 dark:text-slate-100"
      aria-label={`Periodic table coloured by ${meta.label.toLowerCase()}`}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{meta.label}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Colour shows the value carried in the data for each element.
            {withoutData > 0
              ? ` ${withoutData} of ${elements.length} elements carry no value for this property and are drawn grey.`
              : ' Every supplied element carries a value for this property.'}
          </p>
        </div>

        {/* Legend. The end labels are the real extremes of the supplied data. */}
        <div className="min-w-[15rem]">
          <div
            className="h-3 w-full rounded-full ring-1 ring-inset ring-slate-300 dark:ring-slate-600"
            style={{ background: RAMP_CSS }}
            role="img"
            aria-label={
              min !== null && max !== null
                ? `Colour scale from ${formatValue(min, trend)} to ${formatValue(max, trend)} ${meta.unit}`
                : 'Colour scale with no data'
            }
          />
          <div className="mt-1 flex items-center justify-between text-xs tabular-nums text-slate-600 dark:text-slate-400">
            <span>{min !== null ? formatValue(min, trend) : 'no data'}</span>
            <span className="font-medium">{meta.unit}</span>
            <span>{max !== null ? formatValue(max, trend) : 'no data'}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-sm bg-slate-300 ring-1 ring-inset ring-slate-400 dark:bg-slate-600 dark:ring-slate-500"
            />
            <span>Value not supplied ({withoutData})</span>
            <span className="ml-auto">{withData} on scale</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div
          className="grid min-w-[62rem] gap-[3px]"
          style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
        >
          {GROUP_NUMBERS.map((group) => (
            <div
              key={`group-header-${group}`}
              aria-hidden="true"
              className="pb-1 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500"
              style={{ gridRow: HEADER_ROW, gridColumn: group }}
            >
              {group}
            </div>
          ))}

          {/* Markers standing in for the two f block rows drawn below. */}
          <div
            aria-hidden="true"
            className="flex aspect-square items-center justify-center rounded-sm border border-dashed border-slate-300 text-[9px] leading-tight text-slate-400 dark:border-slate-600 dark:text-slate-500"
            style={{ gridRow: 6 + HEADER_ROW, gridColumn: F_BLOCK_START_COLUMN }}
          >
            57-71
          </div>
          <div
            aria-hidden="true"
            className="flex aspect-square items-center justify-center rounded-sm border border-dashed border-slate-300 text-[9px] leading-tight text-slate-400 dark:border-slate-600 dark:text-slate-500"
            style={{ gridRow: 7 + HEADER_ROW, gridColumn: F_BLOCK_START_COLUMN }}
          >
            89-103
          </div>

          <div
            aria-hidden="true"
            style={{ gridRow: SPACER_ROW, gridColumn: '1 / -1', height: '0.75rem' }}
          />

          <div
            aria-hidden="true"
            className="flex items-center justify-end pr-1 text-[9px] font-medium text-slate-400 dark:text-slate-500"
            style={{ gridRow: LANTHANIDE_ROW, gridColumn: '1 / 3' }}
          >
            Lanthanides
          </div>
          <div
            aria-hidden="true"
            className="flex items-center justify-end pr-1 text-[9px] font-medium text-slate-400 dark:text-slate-500"
            style={{ gridRow: ACTINIDE_ROW, gridColumn: '1 / 3' }}
          >
            Actinides
          </div>

          {placed.map(({ element, placement }) => {
            const value = trendValue(element, trend);
            const colours = cellColours(value);
            const readable =
              value === null
                ? 'value not supplied'
                : `${formatValue(value, trend)} ${meta.unit}`;

            return (
              <button
                key={element.symbol || element.number}
                type="button"
                onClick={() => onSelect?.(element.symbol)}
                title={`${element.name} (${element.symbol}), number ${element.number}${
                  element.category ? `, ${element.category}` : ''
                }. ${meta.label}: ${readable}.`}
                aria-label={`${element.name}, symbol ${element.symbol}, atomic number ${element.number}. ${meta.label}: ${readable}.`}
                style={{
                  gridRow: placement.row,
                  gridColumn: placement.column,
                  ...(colours
                    ? { backgroundColor: colours.background, color: colours.foreground }
                    : {}),
                }}
                className={[
                  'flex aspect-square flex-col justify-between rounded-sm p-[3px] text-left leading-none',
                  'transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
                  'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950',
                  'hover:z-10 hover:scale-[1.12] hover:shadow-lg',
                  colours
                    ? ''
                    : 'bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
                ].join(' ')}
              >
                <span className="text-[8px] font-medium opacity-80">
                  {element.number}
                </span>
                <span className="text-center text-[13px] font-bold">
                  {element.symbol}
                </span>
                <span className="text-center text-[8px] tabular-nums opacity-90">
                  {value === null ? 'n/a' : formatValue(value, trend)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {unplaced.length > 0 && (
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
          {unplaced.length} supplied{' '}
          {unplaced.length === 1 ? 'element has' : 'elements have'} no usable
          group and period and could not be placed on the grid:{' '}
          {unplaced.map((element) => element.symbol).join(', ')}.
        </p>
      )}
    </section>
  );
}

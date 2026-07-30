'use client';

/**
 * Spectroscopy: reading a structure back out of its spectra.
 *
 * ORG1 unit 10 is nine nodes of structure determination -- mass spectrometry,
 * infrared, proton and carbon NMR -- and none of it had any visual surface.
 * That is a poor fit for text, because the skill being taught is a mapping
 * between a picture of a molecule and a picture of a trace, and a learner who
 * only ever sees one of the two never practises the mapping.
 *
 * What is derived and what is cited is kept strictly apart, because they carry
 * different authority:
 *
 *   Derived   The number of 1H signals and the ratio between them, from
 *             chem_core's proton_environments, which works out which protons
 *             are equivalent by molecular symmetry. Degrees of unsaturation
 *             from the formula. Molecular ion mass from the formula.
 *   Cited     Every chemical shift range and IR wavenumber. chem_core has no
 *             NMR or vibrational model, so these come from correlation tables
 *             and are labelled as such. Computing them here would be
 *             inventing numbers, which is the failure this whole pipeline is
 *             built to prevent.
 *
 * The integration heights ARE real: they are the environment ratio the
 * symmetry analysis produced, not drawn to look plausible.
 */

import { useMemo, useState } from 'react';

import type { SpectrumSubject } from './contentTypes';
import { IR_BANDS } from './chemContent';
import { PanelTitle, Stat } from './ui';

type Technique = 'nmr' | 'ir' | 'ms';

/**
 * Shift ranges for the 1H NMR sketch, cited not computed.
 *
 * Source: Silverstein, Webster and Kiemle, Spectrometric Identification of
 * Organic Compounds, 8th edition, proton chemical shift correlation tables.
 * The lab uses these to place a signal in the right REGION; it does not claim
 * to predict a shift, and says so on screen.
 */
const SHIFT_REGIONS: { label: string; low: number; high: number; note: string }[] = [
  { label: 'alkyl C-H', low: 0.8, high: 1.8, note: 'far from anything electronegative' },
  { label: 'next to C=O or halogen', low: 2.0, high: 3.0, note: 'deshielded a little' },
  { label: 'on C-O', low: 3.3, high: 4.5, note: 'oxygen pulls density away' },
  { label: 'vinyl', low: 4.5, high: 6.5, note: 'on a double bond' },
  { label: 'aromatic', low: 6.5, high: 8.5, note: 'ring current deshields strongly' },
  { label: 'aldehyde', low: 9.0, high: 10.0, note: '' },
  { label: 'carboxylic acid O-H', low: 10.0, high: 13.0, note: 'broad, exchangeable' },
];

export function SpectraPanel({ subject }: { subject: SpectrumSubject }) {
  const [technique, setTechnique] = useState<Technique>('nmr');

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {(
          [
            ['nmr', '1H NMR'],
            ['ir', 'IR'],
            ['ms', 'MS'],
          ] as [Technique, string][]
        ).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTechnique(t)}
            aria-pressed={technique === t}
            className={`flex-1 rounded px-2 py-1.5 text-[11px] font-medium transition-colors ${
              technique === t
                ? 'bg-sky-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/15'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {technique === 'nmr' && <NmrView subject={subject} />}
      {technique === 'ir' && <IrView subject={subject} />}
      {technique === 'ms' && <MsView subject={subject} />}
    </div>
  );
}

// ---------------------------------------------------------------------------

function NmrView({ subject }: { subject: SpectrumSubject }) {
  const total = subject.environments.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <PanelTitle>What symmetry decides</PanelTitle>
        <Stat
          label="Distinct 1H environments"
          value={<span className="text-sky-300">{subject.signalCount}</span>}
          hint="Derived from molecular symmetry, not counted by eye"
        />
        <Stat label="Integration ratio" value={subject.environments.join(' : ')} />
        <Stat label="Total protons" value={total} />
        {subject.degreesUnsaturation !== null && (
          <Stat
            label="Degrees of unsaturation"
            value={subject.degreesUnsaturation}
            hint="Rings plus pi bonds, from the molecular formula"
          />
        )}
      </div>

      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <PanelTitle>Signals and their integrals</PanelTitle>
        {/* Bars whose HEIGHTS are the real environment ratio. Their horizontal
            placement is even spacing, not a predicted shift, and the caption
            says so rather than letting the picture imply otherwise. */}
        <div className="flex h-24 items-end justify-around gap-2 border-b border-l border-white/20 px-2">
          {subject.environments.map((n, i) => {
            const h = (n / Math.max(...subject.environments)) * 100;
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end">
                <span className="mb-1 text-[9px] font-semibold text-sky-300">
                  {n}H
                </span>
                <div
                  className="w-full rounded-t bg-sky-400/70"
                  style={{ height: `${Math.max(6, h)}%` }}
                />
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-white/40">
          Bar heights are the derived integration ratio. Their left-to-right
          order is NOT a predicted chemical shift: this platform has no NMR
          prediction model, and placing them at specific ppm values would be
          inventing data. The regions below are the cited correlation ranges a
          learner would match against.
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <PanelTitle>Shift regions to match against</PanelTitle>
        <div className="space-y-1">
          {SHIFT_REGIONS.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] text-white/75">{r.label}</span>
              <span className="shrink-0 font-mono text-[10px] text-white/50">
                {r.low.toFixed(1)}-{r.high.toFixed(1)} ppm
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-white/35">
          Cited from Silverstein, Webster and Kiemle, Spectrometric
          Identification of Organic Compounds, 8th ed.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function IrView({ subject }: { subject: SpectrumSubject }) {
  const bands = useMemo(
    () => IR_BANDS.filter((b) => subject.irBands.includes(b.group)),
    [subject.irBands],
  );

  // The plot runs right to left, as an IR spectrum conventionally does.
  const lo = 600;
  const hi = 4000;
  const x = (wn: number) => ((hi - wn) / (hi - lo)) * 100;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <PanelTitle>Which bands this structure should show</PanelTitle>
        <div className="relative h-24 border-b border-l border-white/20">
          {bands.map((b) => {
            const left = x(b.high);
            const width = x(b.low) - x(b.high);
            return (
              <div
                key={b.group}
                title={`${b.group}: ${b.low}-${b.high} cm-1, ${b.shape}`}
                className="absolute bottom-0 rounded-t border-t-2 border-amber-400 bg-amber-400/25"
                style={{
                  left: `${left}%`,
                  width: `${Math.max(1.5, width)}%`,
                  height: b.shape.includes('very strong')
                    ? '85%'
                    : b.shape.includes('strong')
                      ? '65%'
                      : '40%',
                }}
              />
            );
          })}
          {!bands.length && (
            <span className="absolute inset-0 flex items-center justify-center text-[11px] text-white/35">
              No characteristic bands in this set for this structure.
            </span>
          )}
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-white/35">
          <span>4000</span>
          <span>wavenumber (cm-1)</span>
          <span>600</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {bands.map((b) => (
          <div key={b.group} className="rounded-lg border border-white/10 bg-white/5 p-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-white/90">{b.group}</span>
              <span className="shrink-0 font-mono text-[10px] text-amber-300">
                {b.low}-{b.high} cm-1
              </span>
            </div>
            <div className="text-[10px] text-white/50">{b.shape}</div>
          </div>
        ))}
      </div>

      <p className="text-[10px] leading-relaxed text-white/35">
        Which bands appear is decided structurally, by substructure match
        against the molecule on screen. The wavenumbers themselves are cited
        correlation values, not computed: there is no vibrational model here.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

function MsView({ subject }: { subject: SpectrumSubject }) {
  const maxMz = Math.max(...subject.msFragments.map((f) => f.mz), 1);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <PanelTitle>Molecular ion and plausible losses</PanelTitle>
        <div className="relative h-28 border-b border-l border-white/20">
          {subject.msFragments.map((f, i) => (
            <div
              key={f.label}
              title={`${f.mz}: ${f.label}`}
              className="absolute bottom-0 w-[3px] rounded-t bg-emerald-400"
              style={{
                left: `${(f.mz / (maxMz * 1.12)) * 100}%`,
                height: i === 0 ? '90%' : '55%',
              }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-white/35">
          <span>0</span>
          <span>m/z</span>
          <span>{Math.round(maxMz * 1.12)}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {subject.msFragments.map((f) => (
          <div key={f.label} className="rounded-lg border border-white/10 bg-white/5 p-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-white/90">{f.label}</span>
              <span className="shrink-0 font-mono text-[11px] text-emerald-300">
                m/z {f.mz}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] leading-relaxed text-white/55">
              {f.note}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[10px] leading-relaxed text-white/35">
        Masses are computed from the formula. Which losses are listed is decided
        by substructure: a fragment is only offered when the group that would
        produce it is actually present. Peak HEIGHTS are illustrative, because
        relative abundance depends on ionisation conditions this lab does not
        model.
      </p>
    </div>
  );
}

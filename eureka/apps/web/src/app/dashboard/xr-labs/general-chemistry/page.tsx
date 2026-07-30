'use client';

/**
 * General Chemistry 3D -- a built-in XR portal aligned to the OCTET GEN1/GEN2
 * curriculum.
 *
 * Every mode here targets a named misconception from OCTET's own library,
 * because the ones a 3D view fixes are exactly the ones that are failures of
 * spatial imagination rather than of arithmetic:
 *
 *   VSEPR      GEN1M10, "electron domains equal atoms". The panel counts
 *              domains on screen and derives the shape from the count, so the
 *              answer visibly comes from the electrons rather than the
 *              formula.
 *   Polarity   GEN1M11, "polar bonds mean polar molecule". CCl4 and BF3 are
 *              here to be watched cancelling.
 *   Lattice    GEN1M03, "ionic compounds as molecules". No sticks are drawn,
 *              because sticks would smuggle molecules back in.
 *   Orbitals   GEN1M04, "electron shells as planetary orbits". A cloud of
 *              samples, with nodes where the probability is actually zero.
 *   Forces     GEN1M12 and GEN1M13, hydrogen bonding mistaken for a covalent
 *              bond, and covalent bonds believed to break on boiling.
 *   Bench      GEN2M04 and the titration nodes. The burette and the curve stay
 *              locked until a prediction has been committed, because a result
 *              you are allowed to read first is not one you can predict.
 *   Triangle   Johnstone's three levels for one node at a time, with the
 *              particulate pane beside the model it was describing.
 *
 * Structural data is derived, not typed: molecules come from the RDKit
 * generator, and the shapes RDKit cannot embed (hypervalent centres, boron)
 * are built exactly in _chem/genchem.ts with the angles asserted in tests.
 */

import { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Boxes,
  Droplets,
  FlaskConical,
  Magnet,
  Orbit,
  Pause,
  Play,
  Shapes,
  Triangle,
} from 'lucide-react';

import { useXrSession } from '@/lib/xr/use-xr-session';
import { ChemLights, MoleculeScene } from '../_chem/MoleculeScene';
import { GENERAL_MOLECULES } from '../_chem/moleculeData';
import { ELEMENTS, vsepr } from '../_chem/elements';
import {
  LATTICES,
  ORBITALS,
  VSEPR_CASES,
  buildLattice,
  buildVsepr,
  orbitalPoints,
  waterDimer,
} from '../_chem/genchem';
import {
  EquilibriumVessel,
  TitrationBench,
  TitrationCurve,
} from '../_chem/Bench';
import { PoePanel, type PoeOutcome } from '../_chem/Poe';
import {
  KeyboardHint,
  TourOverlay,
  useKeyboardOrbit,
  type TourStep,
} from '../_chem/Tour';
import { TriangleList, TrianglePanel, triangleViewsFor } from '../_chem/Triangle';
import { POE_ITEMS, SCENARIOS } from '../_chem/chemContent';
import { recordOutcome } from '../_chem/mastery';
import {
  ModelNote,
  NodeBadge,
  Panel,
  PanelTitle,
  Slider,
  Stat,
  ToggleButton,
} from '../_chem/ui';
import { DEFAULT_OVERLAYS, type RenderStyle, type SceneOverlays } from '../_chem/types';

type Mode =
  | 'vsepr'
  | 'polarity'
  | 'lattice'
  | 'orbitals'
  | 'forces'
  | 'bench'
  | 'triangle';

const MODES: { id: Mode; label: string; icon: typeof Shapes }[] = [
  { id: 'vsepr', label: 'VSEPR shapes', icon: Shapes },
  { id: 'polarity', label: 'Polarity', icon: Magnet },
  { id: 'lattice', label: 'Ionic lattice', icon: Boxes },
  { id: 'orbitals', label: 'Orbitals', icon: Orbit },
  { id: 'forces', label: 'Forces between', icon: Droplets },
  { id: 'bench', label: 'Bench', icon: FlaskConical },
  { id: 'triangle', label: 'Triangle', icon: Triangle },
];

/** This portal is the general-chemistry half of the collection. */
const GEN_TRIANGLE_VIEWS = triangleViewsFor(['GEN']);

/**
 * What each mode is for, and one thing to do in it.
 *
 * Written per mode rather than once for the portal because the modes teach
 * different things, and a tour that says "drag to rotate" is a tour that has
 * told a learner nothing they could not have guessed.
 */
const TOURS: Record<Mode, TourStep[]> = {
  vsepr: [
    {
      title: 'The count is the answer',
      body: 'Every value in the right panel is read off the model in front of you. The shape comes from how many electron domains the central atom carries, and the formula is never consulted.',
      tryIt: 'Open AX4 and then AX2E2. Both have four domains and the same electron geometry, and only the one carrying two lone pairs is bent.',
    },
    {
      title: 'The domains with no atom on the end',
      body: 'A lone pair pushes on the other domains exactly as a bond does, but the shape is named from the atoms alone. That gap between what shapes the molecule and what names it is where most of the marks go.',
      tryIt: 'Turn Lone pairs off on AX3E. Without the overlay the model looks like it has no reason not to be flat.',
    },
  ],
  polarity: [
    {
      title: 'Polar bonds, no dipole',
      body: 'Whether a bond is polar and whether the molecule is polar are two different questions. The second one is settled by geometry, which is the thing a flat drawing cannot show you.',
      tryIt: 'Turn Dipoles on and pick Carbon tetrachloride. Four strongly polar bonds, arranged so the four arrows cancel exactly.',
    },
    {
      title: 'Break the symmetry',
      body: 'Swapping one atom is enough to stop the cancellation, and none of the individual bonds changed when you did it.',
      tryIt: 'Go from Carbon tetrachloride to Chloroform and watch the sum stop being zero.',
    },
  ],
  lattice: [
    {
      title: 'There are no molecules here',
      body: 'The scene draws ions and no sticks at all. Bonds would smuggle molecules back into a picture whose whole point is that there is no NaCl particle to find.',
      tryIt: 'Try to pick out one sodium that belongs to one particular chloride. Every ion is held by all six of its neighbours instead.',
    },
    {
      title: 'A formula that names a ratio',
      body: 'NaCl states the one to one ratio of ions in the repeating pattern. It is not a count of atoms in a particle, because there is no particle.',
      tryIt: 'Switch to Caesium chloride. The same one to one ratio, packed differently, because the caesium ion is much larger.',
    },
  ],
  orbitals: [
    {
      title: 'A cloud, not an orbit',
      body: 'Each dot is one sample of where the electron could be found. There is no path and no lap time, so asking where the electron is right now has no answer to give.',
      tryIt: 'Pause the rotation and look straight at the centre of the 2p orbital. The nucleus sits in a gap, because the density there is zero.',
    },
    {
      title: 'Nodes are genuinely empty',
      body: 'The dots are drawn from the exact hydrogenic wavefunction, so an empty shell is empty because the wavefunction is zero across it, not because a gap was drawn in to look convincing.',
      tryIt: 'Pick 2s and find the empty shell between the inner ball and the outer one. That is the single radial node the panel counts.',
    },
    {
      title: 'Colour is phase',
      body: 'Blue and pink are the sign of the wavefunction, not charge. Sign is what decides whether two orbitals reinforce or cancel when a bond forms, so it is worth reading as a real feature rather than decoration.',
    },
  ],
  forces: [
    {
      title: 'Two different bonds in one picture',
      body: 'The solid sticks inside each water are covalent bonds. The dashed line running between the two molecules is a hydrogen bond, and it is roughly twenty times weaker than the sticks it connects.',
      tryIt: 'Read both numbers at once: about 0.96 A inside a molecule, about 2.8 A across the gap.',
    },
    {
      title: 'What boiling actually breaks',
      body: 'Separating the molecules costs the hydrogen bond and nothing else. Steam is still water, because the O-H bonds were never involved.',
      tryIt: 'Drag the O to O distance out to 7 A and watch the O-H bond length stay exactly where it started.',
    },
  ],
  bench: [
    {
      title: 'Commit before you look',
      body: 'The burette is locked and the readouts are hidden until a prediction has been committed. A result you are allowed to read first is not one you can predict, and the predicting is the part that does the work.',
      tryIt: 'Answer the Predict question in the right panel, then come back to the burette.',
    },
    {
      title: 'One slider, two representations',
      body: 'The flask colour and the moving point on the curve are driven by the same volume. Watching them together is the link between a colour changing in front of you and a line going vertical.',
      tryIt: 'Walk the burette up to 25 mL a quarter of a millilitre at a time, and count how few drops the whole colour change takes.',
    },
    {
      title: 'The vessel counts particles',
      body: 'For the equilibrium scenarios the vessel holds the mixture at the instant the stress is applied, and switches to where it settles once you have observed. The particles never stop reacting; it is the counts that stop moving.',
      tryIt: 'Run the catalyst scenario and compare the two states. Nothing moves, which is exactly what a catalyst does to a position of equilibrium.',
    },
    {
      title: 'What gets recorded',
      body: 'Finishing the loop writes the prediction and the explanation to your progress on this curriculum node as two separate attempts, so being right for the wrong reason stays visible instead of being averaged away.',
    },
  ],
  triangle: [
    {
      title: 'Three levels, said out loud',
      body: 'Chemistry teaching moves constantly between what you could observe, what the particles are doing, and what gets written down, usually without announcing the switch. This shows all three for one node at once.',
      tryIt: 'Click one level to dim the other two, then ask which level the last thing you read was on.',
    },
    {
      title: 'The connector carries the load',
      body: 'The green box names the one quantity or object that is identical across all three panes. That sentence is the part a learner cannot reconstruct alone, so it is not left implied.',
      tryIt: 'Read the particulate pane, then the connector, then look at the model on the canvas and check all three are about the same object.',
    },
    {
      title: 'The picture beside the words',
      body: 'The particulate pane carries a caption written when this system had no artwork at all. Read the other way round, it is a specification for the scene sitting next to it.',
      tryIt: 'The molecule on the canvas is whatever Polarity currently has selected, so choose there first if you want a particular one beside these words.',
    },
  ],
};

export default function GeneralChemistryPortal() {
  const [mode, setMode] = useState<Mode>('vsepr');
  const [vseprKey, setVseprKey] = useState('ax2e2');
  const [polarKey, setPolarKey] = useState('gc_water');
  const [latticeKey, setLatticeKey] = useState('nacl');
  const [orbitalKey, setOrbitalKey] = useState('2p');
  const [dimerGap, setDimerGap] = useState(2.8);
  const [style, setStyle] = useState<RenderStyle>('ball-and-stick');
  const [overlays, setOverlays] = useState<SceneOverlays>({
    ...DEFAULT_OVERLAYS,
    lonePairs: true,
  });
  const [spinning, setSpinning] = useState(true);
  const [selectedAtom, setSelectedAtom] = useState<number | null>(null);
  const [showStars, setShowStars] = useState(false);
  const [triangleNode, setTriangleNode] = useState(GEN_TRIANGLE_VIEWS[0].node);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [burette, setBurette] = useState(0);
  const [observed, setObserved] = useState(false);
  const [masteryNote, setMasteryNote] = useState<{
    ok: boolean;
    node: string;
    level: number;
  } | null>(null);

  const { recorded, endWithRating } = useXrSession(
    '/dashboard/xr-labs/general-chemistry',
  );

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { onKeyDown, announcement } = useKeyboardOrbit(controlsRef);
  // Time on the current POE item, which is what a mastery attempt is timed
  // against. Reset whenever a different item comes on screen.
  const attemptStartedAt = useRef(Date.now());

  const vseprCase = VSEPR_CASES.find((c) => c.key === vseprKey) ?? VSEPR_CASES[0];
  const latticeSpec = LATTICES.find((l) => l.key === latticeKey) ?? LATTICES[0];
  const orbitalSpec = ORBITALS.find((o) => o.key === orbitalKey) ?? ORBITALS[0];
  const triangleView =
    GEN_TRIANGLE_VIEWS.find((v) => v.node === triangleNode) ?? GEN_TRIANGLE_VIEWS[0];

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const titration = scenario.derived.kind === 'titration' ? scenario.derived : null;
  const equilibrium =
    scenario.derived.kind === 'equilibrium' ? scenario.derived : null;
  const poeItem = POE_ITEMS.filter((i) => i.scenario === scenario.id)[0] ?? null;
  // A scenario with no authored item has nothing to predict, so gating it
  // would leave a dead bench rather than enforce anything.
  const revealed = observed || poeItem === null;
  const buretteMax = titration
    ? (titration.curve[titration.curve.length - 1]?.v ?? 0)
    : 0;

  const built = useMemo(() => buildVsepr(vseprCase), [vseprCase]);
  const lattice = useMemo(() => buildLattice(latticeSpec, 2), [latticeSpec]);
  const dimer = useMemo(() => waterDimer(dimerGap), [dimerGap]);
  const cloud = useMemo(() => orbitalPoints(orbitalSpec), [orbitalSpec]);

  const shown = useMemo(() => {
    if (mode === 'vsepr') return built.molecule;
    if (mode === 'lattice') return lattice;
    if (mode === 'forces') return dimer;
    return GENERAL_MOLECULES.find((m) => m.key === polarKey) ?? GENERAL_MOLECULES[0];
  }, [mode, built, lattice, dimer, polarKey]);

  const onPickAtom = useCallback(
    (i: number) => setSelectedAtom((p) => (p === i ? null : i)),
    [],
  );

  const pickScenario = useCallback((id: string) => {
    setScenarioId(id);
    setBurette(0);
    setObserved(false);
    setMasteryNote(null);
    attemptStartedAt.current = Date.now();
  }, []);

  const onObserve = useCallback(() => setObserved(true), []);

  const onPoeComplete = useCallback(async (outcome: PoeOutcome) => {
    const row = await recordOutcome(
      outcome,
      (Date.now() - attemptStartedAt.current) / 1000,
    );
    setMasteryNote({
      ok: row !== null,
      node: outcome.node,
      level: row?.mastery_level ?? 0,
    });
  }, []);

  const finishAndRate = async (rating: number | null) => {
    setShowStars(false);
    const xp = await endWithRating(rating);
    if (xp !== null) {
      toast.success(xp ? `Session recorded, +${xp} XP` : 'Session recorded');
    }
  };

  const toggle = (k: keyof SceneOverlays) =>
    setOverlays((o) => ({ ...o, [k]: !o[k] }));

  const selected = selectedAtom !== null ? shown.atoms[selectedAtom] : null;
  // The lattice and the VSEPR catalogue are exact constructions; the polarity
  // molecules are optimised conformers. Say which is on screen. Triangle mode
  // borrows the polarity molecule, so it borrows the note with it.
  const modelKind =
    mode === 'polarity' || mode === 'forces' || mode === 'triangle'
      ? 'computed'
      : 'idealised';

  // Auto-frame: a lattice is far bigger than a molecule, and the bench is a
  // stand of glassware rather than a particle.
  const camDistance =
    mode === 'lattice' ? 26 : mode === 'orbitals' ? 12 : mode === 'bench' ? 11 : 9;

  const modeLabel = MODES.find((m) => m.id === mode)?.label ?? '';

  /**
   * The result the POE loop is asking about.
   *
   * Built once and rendered in exactly one place, because a second copy of it
   * somewhere ungated would hand over the answer before the prediction.
   */
  const readout = titration ? (
    <div className="space-y-2">
      <TitrationCurve
        derived={titration}
        volume={burette}
        width={286}
        height={168}
      />
      <div>
        <Stat
          label="Equivalence volume"
          value={`${titration.landmarks.equivalence_volume_mL.toFixed(2)} mL`}
        />
        <Stat
          label="pH at equivalence"
          value={
            <span className="text-amber-300">
              {titration.landmarks.equivalence_pH.toFixed(2)}
            </span>
          }
        />
        <Stat
          label="pH at half equivalence"
          value={titration.landmarks.half_equivalence_pH.toFixed(2)}
          hint="For a weak acid this one is the pKa."
        />
        <Stat
          label="pH before any titrant"
          value={titration.landmarks.initial_pH.toFixed(2)}
        />
      </div>
    </div>
  ) : equilibrium ? (
    <div>
      <Stat
        label="Which way it shifted"
        value={
          <span className="text-amber-300">{equilibrium.result.direction}</span>
        }
      />
      <Stat
        label="Q before the shift"
        value={equilibrium.result.q_before.toFixed(3)}
        hint="Compare it with K. That comparison is the whole prediction."
      />
      <Stat
        label="K at this temperature"
        value={equilibrium.result.k.toFixed(3)}
        hint="Only temperature moves this number."
      />
      {Object.entries(equilibrium.result.final).map(([name, molar]) => (
        <Stat
          key={name}
          label={`${name} once it settles`}
          value={`${molar.toFixed(4)} M`}
        />
      ))}
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070a14] text-white">
      {/* Focusable so the scene can be orbited without a pointer. */}
      <div
        className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400/60"
        tabIndex={0}
        role="application"
        aria-label={`3D view: ${modeLabel}. Arrow keys rotate, plus and minus zoom, 0 resets the view.`}
        onKeyDown={onKeyDown}
      >
        <Canvas
          camera={{ position: [0, 2.2, camDistance], fov: 48, near: 0.05, far: 500 }}
          legacy
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ChemLights />

            {mode === 'orbitals' ? (
              <OrbitalCloud points={cloud} spinning={spinning} />
            ) : mode === 'bench' ? (
              <>
                {titration && (
                  <TitrationBench
                    derived={titration}
                    volume={burette}
                    running={revealed}
                  />
                )}
                {equilibrium && (
                  <EquilibriumVessel
                    derived={equilibrium}
                    showStressed={revealed}
                  />
                )}
              </>
            ) : (
              <>
                <MoleculeScene
                  molecule={shown}
                  style={mode === 'lattice' ? 'space-filling' : style}
                  overlays={mode === 'lattice' ? { ...overlays, lonePairs: false } : overlays}
                  spinning={spinning}
                  selectedAtom={selectedAtom}
                  measureSet={[]}
                  onPickAtom={onPickAtom}
                />
                {mode === 'vsepr' && overlays.lonePairs && (
                  <VseprLonePairs dirs={built.lonePairDirs} />
                )}
                {mode === 'forces' && <HydrogenBond molecule={shown} />}
              </>
            )}

            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.08}
              minDistance={2}
              maxDistance={120}
              makeDefault
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ---------------- Top bar ---------------- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-3 p-4">
        <Link
          href="/dashboard/xr-labs"
          className="pointer-events-auto flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur-md transition-colors hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
          XR Labs
        </Link>

        <Panel className="flex items-center gap-1 p-1">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  setSelectedAtom(null);
                  attemptStartedAt.current = Date.now();
                }}
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === m.id
                    ? 'bg-sky-500 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            );
          })}
        </Panel>

        <Panel className="flex items-center gap-1 p-1">
          <button
            type="button"
            onClick={() => setSpinning((s) => !s)}
            className="rounded p-2 transition-colors hover:bg-white/10"
            title={spinning ? 'Pause rotation' : 'Rotate'}
          >
            {spinning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowStars(true)}
            disabled={recorded}
            className="rounded px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            {recorded ? 'Recorded' : 'Finish'}
          </button>
        </Panel>
      </div>

      {/* ---------------- Left rail ---------------- */}
      <div className="pointer-events-none absolute left-4 top-24 z-10 flex max-h-[calc(100vh-12rem)] w-56 flex-col gap-3 overflow-y-auto">
        {mode === 'vsepr' && (
          <Panel className="p-3">
            <PanelTitle>Shape</PanelTitle>
            <div className="flex flex-col gap-1">
              {VSEPR_CASES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setVseprKey(c.key)}
                  className={`rounded px-2.5 py-1.5 text-left transition-colors ${
                    c.key === vseprKey ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[10px] text-white/70">{c.ax}</span>
                    <span className="font-mono text-[10px] text-white/50">{c.formula}</span>
                  </div>
                  <div className="text-xs font-semibold">{c.name}</div>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {mode === 'polarity' && (
          <Panel className="p-3">
            <PanelTitle>Molecule</PanelTitle>
            <div className="flex flex-col gap-1">
              {GENERAL_MOLECULES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setPolarKey(m.key)}
                  className={`rounded px-2.5 py-1.5 text-left transition-colors ${
                    m.key === polarKey ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-semibold">{m.name}</div>
                  <div className="font-mono text-[10px] text-white/60">{m.formula}</div>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {mode === 'lattice' && (
          <Panel className="p-3">
            <PanelTitle>Lattice</PanelTitle>
            <div className="flex flex-col gap-1">
              {LATTICES.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => setLatticeKey(l.key)}
                  className={`rounded px-2.5 py-1.5 text-left transition-colors ${
                    l.key === latticeKey ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-semibold">{l.name}</div>
                  <div className="font-mono text-[10px] text-white/60">{l.formula}</div>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {mode === 'orbitals' && (
          <Panel className="p-3">
            <PanelTitle>Orbital</PanelTitle>
            <div className="flex flex-col gap-1">
              {ORBITALS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setOrbitalKey(o.key)}
                  className={`rounded px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                    o.key === orbitalKey ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Panel>
        )}

        {mode === 'forces' && (
          <Panel className="p-3">
            <PanelTitle>Pull them apart</PanelTitle>
            <Slider
              label="O to O distance"
              value={dimerGap}
              min={2.6}
              max={7}
              step={0.05}
              onChange={setDimerGap}
              suffix=" A"
            />
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              At about 2.8 A the hydrogen bond is at its best. Drag them apart
              and it fades. Notice what does not change: every O-H bond inside
              each molecule stays exactly as it was.
            </p>
            <button
              type="button"
              onClick={() => setDimerGap(2.8)}
              className="mt-2 w-full rounded bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
            >
              Back to 2.8 A
            </button>
          </Panel>
        )}

        {mode === 'bench' && (
          <>
            <Panel className="p-3">
              <PanelTitle>Scenario</PanelTitle>
              <div className="flex flex-col gap-1">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickScenario(s.id)}
                    className={`rounded px-2.5 py-1.5 text-left transition-colors ${
                      s.id === scenarioId ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-[11px] font-semibold leading-tight">
                      {s.title}
                    </div>
                    <div className="font-mono text-[9px] text-white/50">{s.kind}</div>
                  </button>
                ))}
              </div>
            </Panel>

            {titration && (
              <Panel className="p-3">
                <PanelTitle>Burette</PanelTitle>
                {/* The shared Slider has no disabled state, and this control
                    has to be genuinely inert before a prediction exists. */}
                <label className="block">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-[11px] text-white/60">Titrant added</span>
                    <span className="font-mono text-xs font-semibold text-white">
                      {burette.toFixed(2)} mL
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={buretteMax}
                    step={0.25}
                    value={burette}
                    disabled={!revealed}
                    onChange={(e) => setBurette(Number(e.target.value))}
                    aria-label="Titrant added, mL"
                    className="h-1.5 w-full appearance-none rounded-full bg-white/15 accent-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </label>
                <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                  {revealed
                    ? 'The flask colour and the moving point on the curve are this one volume read twice. The pH is the nearest computed point rather than an interpolation, so no value on screen was invented between them.'
                    : 'Locked until you commit a prediction in the right panel. Running it first would leave nothing to predict.'}
                </p>
              </Panel>
            )}
          </>
        )}

        {mode === 'triangle' && (
          <Panel className="p-3">
            <TriangleList
              views={GEN_TRIANGLE_VIEWS}
              selected={triangleNode}
              onSelect={setTriangleNode}
            />
          </Panel>
        )}

        {mode !== 'orbitals' && mode !== 'bench' && (
          <Panel className="p-3">
            <PanelTitle>Show</PanelTitle>
            <div className="flex flex-wrap gap-1">
              <ToggleButton active={overlays.lonePairs} onClick={() => toggle('lonePairs')}>
                Lone pairs
              </ToggleButton>
              <ToggleButton active={overlays.dipoles} onClick={() => toggle('dipoles')}>
                Dipoles
              </ToggleButton>
              <ToggleButton active={overlays.labels} onClick={() => toggle('labels')}>
                Labels
              </ToggleButton>
            </div>
            {mode !== 'lattice' && (
              <>
                <div className="mt-3">
                  <PanelTitle>Style</PanelTitle>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(['ball-and-stick', 'space-filling', 'wireframe'] as RenderStyle[]).map((s) => (
                    <ToggleButton key={s} active={style === s} onClick={() => setStyle(s)}>
                      {s === 'ball-and-stick' ? 'Ball' : s === 'space-filling' ? 'Space' : 'Wire'}
                    </ToggleButton>
                  ))}
                </div>
              </>
            )}
          </Panel>
        )}
      </div>

      {/* ---------------- Right panel ---------------- */}
      <div className="pointer-events-none absolute right-4 top-24 z-10 max-h-[calc(100vh-12rem)] w-[22rem] overflow-y-auto">
        <Panel className="p-4">
          {mode === 'orbitals' ? (
            <>
              <h2 className="text-lg font-bold">{orbitalSpec.label} orbital</h2>
              <div className="mt-2 flex flex-wrap gap-1">
                {orbitalSpec.teaches.map((c) => (
                  <NodeBadge key={c} code={c} />
                ))}
              </div>
              <div className="mt-3">
                <Stat label="Principal quantum number" value={orbitalSpec.n} />
                <Stat label="Radial nodes" value={orbitalSpec.radialNodes} />
                <Stat
                  label="Angular nodes"
                  value={
                    orbitalSpec.kind === 's' ? 0 : orbitalSpec.kind === 'p' ? 1 : 2
                  }
                />
                <Stat label="Sample points drawn" value={cloud.length} />
              </div>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400" />
                  positive phase
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-400" />
                  negative phase
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {orbitalSpec.facts.map((f, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/80">
                    <span className="shrink-0 text-sky-400">-</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10px] leading-relaxed text-white/40">
                Every dot is one sample of the exact hydrogenic wavefunction
                with Z equal to 1, drawn from the probability density
                |psi|^2 = |R(n,l,r)|^2 |Y(theta,phi)|^2. The density of the
                dots IS the probability density rather than standing in for it,
                and a radial node is empty because the wavefunction is
                genuinely zero across that shell.
              </p>
            </>
          ) : mode === 'triangle' ? (
            <TrianglePanel view={triangleView} />
          ) : mode === 'bench' ? (
            <>
              <h2 className="text-lg font-bold leading-tight">{scenario.title}</h2>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <NodeBadge code={scenario.node} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                {scenario.description}
              </p>

              {!revealed && (
                <div className="mt-3 rounded-lg border border-dashed border-white/15 bg-white/5 p-3">
                  <PanelTitle>Result withheld</PanelTitle>
                  <p className="text-[11px] leading-relaxed text-white/60">
                    {titration
                      ? 'The curve, the landmarks and the burette unlock once you commit a prediction below. Reading the answer first would turn the question into a lookup.'
                      : 'The vessel is holding the mixture at the instant the stress lands. Where it settles, and the numbers behind it, appear once you commit a prediction below.'}
                  </p>
                </div>
              )}

              {poeItem ? (
                <div className="mt-3">
                  <PoePanel
                    key={poeItem.id}
                    item={poeItem}
                    onObserve={onObserve}
                    onComplete={onPoeComplete}
                    observation={readout}
                  />
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <PanelTitle>Readout</PanelTitle>
                  {readout}
                  <p className="mt-2 text-[10px] leading-relaxed text-white/40">
                    No predict-observe-explain item is authored against this
                    scenario, so there is nothing to commit to and the bench is
                    open from the start.
                  </p>
                </div>
              )}

              {masteryNote && (
                <div
                  className={`mt-3 rounded-lg border p-3 ${
                    masteryNote.ok
                      ? 'border-emerald-400/30 bg-emerald-950/25'
                      : 'border-amber-400/30 bg-amber-950/25'
                  }`}
                >
                  {masteryNote.ok ? (
                    <p className="text-[11px] leading-relaxed text-emerald-200/90">
                      Recorded against {masteryNote.node}. Mastery on that node
                      is now {Math.round(masteryNote.level * 100)} percent.
                    </p>
                  ) : (
                    <p className="text-[11px] leading-relaxed text-amber-200/85">
                      Not recorded. The write to your progress did not land, so
                      nothing was stored against {masteryNote.node}. What you
                      answered still stands; only the record of it is missing.
                    </p>
                  )}
                </div>
              )}

              <p className="mt-3 text-[10px] leading-relaxed text-white/40">
                The curve and the concentrations were computed by chem_core when
                this content was exported. The bench indexes into that result
                and reads the flask colour off the pH at the point it lands on,
                so nothing on screen is deciding any chemistry.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold leading-tight">{shown.name}</h2>
              <div className="mt-0.5 font-mono text-xs text-white/70">{shown.formula}</div>

              {shown.teaches.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {shown.teaches.map((c) => (
                    <NodeBadge key={c} code={c} />
                  ))}
                </div>
              )}

              {mode === 'vsepr' && (
                <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <PanelTitle>Count first, then name the shape</PanelTitle>
                  <Stat label="Notation" value={<span className="font-mono">{vseprCase.ax}</span>} />
                  <Stat label="Bonded atoms" value={vseprCase.steric - vseprCase.lonePairs} />
                  <Stat label="Lone pairs" value={vseprCase.lonePairs} />
                  <Stat
                    label="Electron domains"
                    value={<span className="text-sky-300">{vseprCase.steric}</span>}
                    hint="The sum. This, and only this, sets the electron geometry."
                  />
                  <Stat
                    label="Electron geometry"
                    value={vsepr(vseprCase.steric, vseprCase.lonePairs)?.electron ?? '-'}
                  />
                  <Stat
                    label="Molecular shape"
                    value={
                      <span className="text-amber-300">
                        {vsepr(vseprCase.steric, vseprCase.lonePairs)?.molecular ?? '-'}
                      </span>
                    }
                    hint="Named from the ATOMS only. This is where lone pairs stop counting."
                  />
                  <Stat
                    label="Ideal angle"
                    value={`${vsepr(vseprCase.steric, vseprCase.lonePairs)?.angle ?? '-'} deg`}
                  />
                  <Stat
                    label="Hybridisation"
                    value={vsepr(vseprCase.steric, vseprCase.lonePairs)?.hybrid ?? '-'}
                  />
                  {vseprCase.teaches.length === 0 && (
                    <p className="mt-2 text-[10px] leading-relaxed text-amber-200/60">
                      Standard first-year content, but this shape is not in
                      OCTET&apos;s GEN1.VSEPR lesson today, so it carries no
                      node link. The lab is extending the lesson here rather
                      than mirroring it.
                    </p>
                  )}
                </div>
              )}

              {mode === 'lattice' && (
                <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <Stat label="Structure" value={shown.geometry} />
                  <Stat label="Ions drawn" value={shown.atoms.length} />
                  <Stat label="Sticks drawn" value={<span className="text-amber-300">0</span>}
                    hint="Deliberate. Drawing bonds would put molecules back into a picture whose point is that there are none." />
                  <Stat
                    label="Cation radius"
                    value={`${latticeSpec.cationRadius} A`}
                  />
                  <Stat label="Anion radius" value={`${latticeSpec.anionRadius} A`} />
                  <Stat label="Lattice parameter" value={`${latticeSpec.a} A`} />
                </div>
              )}

              {mode === 'forces' && (
                <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <Stat label="O to O" value={`${dimerGap.toFixed(2)} A`} />
                  <Stat
                    label="Hydrogen bond"
                    value={
                      <span className={dimerGap < 3.5 ? 'text-emerald-400' : 'text-white/40'}>
                        {dimerGap < 3.2 ? 'strong' : dimerGap < 3.8 ? 'weakening' : 'effectively gone'}
                      </span>
                    }
                  />
                  <Stat label="O-H covalent bond" value="0.96 A, unchanged" />
                  <p className="mt-2 text-[10px] leading-relaxed text-white/40">
                    The strength wording tracks the separation qualitatively.
                    It is a description of the trend, not a computed energy.
                  </p>
                </div>
              )}

              {selected && (
                <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-4 w-4 rounded-full ring-1 ring-white/30"
                      style={{ backgroundColor: ELEMENTS[selected.el].color }}
                    />
                    <span className="font-bold">{ELEMENTS[selected.el].name}</span>
                    {selected.charge ? (
                      <span className="rounded bg-amber-500/25 px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-amber-400/40">
                        {selected.charge > 0 ? `${selected.charge}+` : `${Math.abs(selected.charge)}-`}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <Stat label="Valence electrons" value={ELEMENTS[selected.el].valence} />
                    <Stat label="Lone pairs" value={selected.lp} />
                    <Stat label="Electronegativity" value={ELEMENTS[selected.el].en.toFixed(2)} />
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                    {ELEMENTS[selected.el].blurb}
                  </p>
                </div>
              )}

              {shown.facts.length > 0 && (
                <div className="mt-4">
                  <PanelTitle>Why it matters</PanelTitle>
                  <ul className="space-y-2">
                    {shown.facts.map((f, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/80">
                        <span className="shrink-0 text-sky-400">-</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Panel>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-col items-start gap-2">
        <TourOverlay steps={TOURS[mode]} storageKey={`genchem-${mode}`} />
        <KeyboardHint announcement={announcement} />
      </div>
      {/* Both kinds of model note describe geometry, and the bench has none of
          its own. Its provenance is in the panel instead. */}
      {mode !== 'bench' && (
        <div className="pointer-events-none absolute bottom-4 right-4 z-10">
          <ModelNote kind={modelKind} />
        </div>
      )}

      {showStars && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/20 bg-slate-900 p-6 text-center">
            <h2 className="mb-4 text-xl font-bold">How was this portal?</h2>
            <div className="mb-5 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => finishAndRate(n)}
                  aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
                  className="text-3xl transition-transform hover:scale-125"
                >
                  *
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => finishAndRate(null)}
              className="w-full rounded-lg bg-white/10 py-2 text-sm transition-colors hover:bg-white/20"
            >
              Finish without rating
            </button>
            <button
              type="button"
              onClick={() => setShowStars(false)}
              className="mt-2 w-full py-2 text-sm text-white/50 hover:text-white"
            >
              Keep exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scene pieces used only by this lab
// ---------------------------------------------------------------------------

/** Lone pairs for the exact VSEPR builds, whose directions are known. */
function VseprLonePairs({ dirs }: { dirs: [number, number, number][] }) {
  return (
    <>
      {dirs.map((d, i) => {
        const v = new THREE.Vector3(...d).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          v,
        );
        return (
          <group key={i} position={v.clone().multiplyScalar(1.05)} quaternion={q}>
            <mesh scale={[1, 0.6, 1]}>
              <sphereGeometry args={[0.34, 20, 14]} />
              <meshStandardMaterial
                color="#c4b5fd"
                transparent
                opacity={0.45}
                emissive="#8b5cf6"
                emissiveIntensity={0.55}
              />
            </mesh>
            <Html center distanceFactor={11} position={[0, 0.55, 0]}>
              <div className="pointer-events-none whitespace-nowrap rounded bg-violet-600/85 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                lone pair
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

/** The dashed hydrogen bond between the two waters. */
function HydrogenBond({ molecule }: { molecule: { atoms: { el: string; pos: [number, number, number] }[] } }) {
  // Donor hydrogen is the one closest to the acceptor oxygen.
  const oxygens = molecule.atoms
    .map((a, i) => ({ a, i }))
    .filter((x) => x.a.el === 'O');
  const hydrogens = molecule.atoms
    .map((a, i) => ({ a, i }))
    .filter((x) => x.a.el === 'H');
  if (oxygens.length < 2 || !hydrogens.length) return null;

  const acceptor = oxygens[1];
  let best = hydrogens[0];
  let bestD = Infinity;
  hydrogens.forEach((h) => {
    const d = new THREE.Vector3(...h.a.pos).distanceTo(
      new THREE.Vector3(...acceptor.a.pos),
    );
    if (d < bestD) {
      bestD = d;
      best = h;
    }
  });

  return (
    <>
      <Line
        points={[best.a.pos, acceptor.a.pos]}
        color="#38bdf8"
        lineWidth={2.5}
        dashed
        dashSize={0.12}
        gapSize={0.1}
      />
      <Html
        center
        distanceFactor={12}
        position={[
          (best.a.pos[0] + acceptor.a.pos[0]) / 2,
          (best.a.pos[1] + acceptor.a.pos[1]) / 2 + 0.35,
          (best.a.pos[2] + acceptor.a.pos[2]) / 2,
        ]}
      >
        <div className="pointer-events-none whitespace-nowrap rounded bg-sky-600/85 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          hydrogen bond, {bestD.toFixed(2)} A
        </div>
      </Html>
    </>
  );
}

/** The orbital probability cloud, drawn as instanced points. */
function OrbitalCloud({
  points,
  spinning,
}: {
  points: { pos: [number, number, number]; sign: 1 | -1 }[];
  spinning: boolean;
}) {
  const { positive, negative } = useMemo(() => {
    const pos: number[] = [];
    const neg: number[] = [];
    points.forEach((p) => {
      (p.sign > 0 ? pos : neg).push(...p.pos);
    });
    return {
      positive: new Float32Array(pos),
      negative: new Float32Array(neg),
    };
  }, [points]);

  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spinning && group.current) group.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positive, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.055} color="#38bdf8" transparent opacity={0.75} sizeAttenuation />
      </points>
      {negative.length > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[negative, 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.055} color="#fb7185" transparent opacity={0.75} sizeAttenuation />
        </points>
      )}
      {/* The nucleus, for scale. */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

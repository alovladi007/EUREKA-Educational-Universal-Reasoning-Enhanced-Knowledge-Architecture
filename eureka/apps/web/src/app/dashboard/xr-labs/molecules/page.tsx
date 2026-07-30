'use client';

/**
 * Organic Chemistry 3D -- a built-in XR portal aligned to the OCTET
 * ORG1/ORG2 curriculum.
 *
 * The earlier version of this page was a molecule viewer: pick from a list,
 * spin it, read three sentences. That is a fine toy and a poor teacher,
 * because the things ORG1 actually struggles to convey are not shapes, they
 * are RELATIONSHIPS BETWEEN SHAPES -- what changes when you rotate a bond,
 * what a ring flip does and does not do, why one mirror image is a different
 * compound and another is the same one. None of those fit in a static model.
 *
 * So this is seven modes, each aimed at a specific node and, where possible,
 * at a specific named misconception from OCTET's library:
 *
 *   Explore    ORG1.HYBRIDORG, ORG1.FUNCTIONALGROUPS, GEN1.POLARITY
 *              Click an atom and the panel shows the COUNT that decides its
 *              hybridisation, not a lookup keyed on the element.
 *   Orbitals   ORG1.ORBITALS -- "one bond that turns, one that cannot".
 *              Try to rotate a double bond and watch the pi overlap break.
 *   Conformers ORG1.NEWMAN -- a real Newman projection with the dihedral on
 *              a slider and the energy curve tracking it.
 *   Chair      ORG1.CHAIR, ORG1.AVALUES -- run a ring inversion and watch
 *              every axial bond become equatorial. Targets the belief that a
 *              flip can turn cis into trans.
 *   Stereo     ORG1.CHIRALITY, ORG1.RS, ORG1.ENANTIODIA -- build the mirror
 *              image and try to superimpose it. Targets ORG1M06, meso called
 *              chiral.
 *   Triangle   Johnstone's three levels for one ORG node at a time, with the
 *              connector named. The 3D model stays on screen throughout,
 *              because it IS the particulate level the panel is discussing.
 *   Spectra    ORG1 unit 10. The structure and the spectra of the SAME
 *              compound side by side, because the skill being taught is the
 *              mapping between the two and until now only one half of it was
 *              ever visible.
 *
 * Chair mode also runs a predict-observe-explain loop. Without one a lab can
 * be operated for a quarter of an hour without the learner ever committing to
 * anything, and a viewer you cannot be wrong in front of teaches nothing. That
 * item is authored here rather than exported from OCTET, so its key is marked
 * unverified: see CHAIR_FLIP_POE.
 *
 * All structural data is derived, never typed: see _chem/moleculeData.ts for
 * the generated library and _chem/procedural.ts for the parametric geometry,
 * whose claims are asserted in procedural.test.ts. The chair builder pins the
 * substituent to a FACE of the ring rather than to the axial or equatorial
 * label, so a ring flip converts it between the two instead of moving it
 * across the ring.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import toast from 'react-hot-toast';
import {
  Activity,
  ArrowLeft,
  Atom as AtomIcon,
  FlaskConical,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  Ruler,
  Sparkles,
  Triangle as TriangleIcon,
} from 'lucide-react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import { useXrSession } from '@/lib/xr/use-xr-session';
import { ChemLights, MoleculeScene } from '../_chem/MoleculeScene';
import { ORGANIC_MOLECULES } from '../_chem/moleculeData';
import { ELEMENTS, vsepr } from '../_chem/elements';
import {
  A_VALUES,
  angle as angleBetween,
  cyclohexaneChair,
  distance,
  equatorialPercent,
  torsionEnergy,
  torsionLabel,
  torsionMolecule,
  type TorsionKind,
} from '../_chem/procedural';
import {
  EnergyCurve,
  ModelNote,
  NodeBadge,
  Panel,
  PanelTitle,
  Slider,
  Stat,
  ToggleButton,
} from '../_chem/ui';
import { TriangleList, TrianglePanel, triangleViewsFor } from '../_chem/Triangle';
import { SpectraPanel } from '../_chem/Spectra';
import { PoePanel, type PoeOutcome } from '../_chem/Poe';
import {
  KeyboardHint,
  TourOverlay,
  useKeyboardOrbit,
  type TourStep,
} from '../_chem/Tour';
import { recordOutcome } from '../_chem/mastery';
import { SPECTRA } from '../_chem/chemContent';
import type { PoeItem } from '../_chem/contentTypes';
import { DEFAULT_OVERLAYS, type Molecule, type RenderStyle, type SceneOverlays } from '../_chem/types';

type Mode =
  | 'explore'
  | 'orbitals'
  | 'conformers'
  | 'chair'
  | 'stereo'
  | 'triangle'
  | 'spectra';

const MODES: { id: Mode; label: string; icon: typeof AtomIcon; nodes: string[] }[] = [
  { id: 'explore', label: 'Explore', icon: AtomIcon, nodes: ['ORG1.HYBRIDORG'] },
  { id: 'orbitals', label: 'Sigma and pi', icon: Orbit, nodes: ['ORG1.ORBITALS'] },
  { id: 'conformers', label: 'Conformations', icon: RotateCcw, nodes: ['ORG1.NEWMAN'] },
  { id: 'chair', label: 'Chair flip', icon: FlaskConical, nodes: ['ORG1.CHAIR', 'ORG1.AVALUES'] },
  { id: 'stereo', label: 'Stereochemistry', icon: Sparkles, nodes: ['ORG1.CHIRALITY', 'ORG1.RS'] },
  // Triangle ranges over every ORG view rather than sitting on one node, so it
  // names none here instead of picking one arbitrarily.
  { id: 'triangle', label: 'Triangle', icon: TriangleIcon, nodes: [] },
  { id: 'spectra', label: 'Spectra', icon: Activity, nodes: ['ORG1.NMRTHEORY'] },
];

/** The Johnstone views for this course, both ORG1 and ORG2. */
const ORG_TRIANGLE_VIEWS = triangleViewsFor(['ORG']);

/**
 * The predict-observe-explain item for the ring flip.
 *
 * Every item in POE_ITEMS is a GEN2 titration or equilibrium question exported
 * from OCTET with a chem_core run behind it, and the export checks each answer
 * key against what the simulation actually produced. There is no ORG1.CHAIR
 * item there and no chair engine to check one against, so this one is written
 * by hand, lives in this file, and says so: keyVerified stays false and
 * keyVerdict explains what the reader is trusting instead.
 *
 * The distractors are the two ways this goes wrong in practice. Confusing a
 * conformational change with a configurational one is the serious error, since
 * it makes cis and trans look like two shapes of one compound rather than two
 * compounds, so both the wrong prediction and the wrong explanation that carry
 * it key the same code.
 */
const CHAIR_FLIP_POE: PoeItem = {
  id: 'poe.local.chair-flip',
  node: 'ORG1.CHAIR',
  scenario: 'local.chair',
  scenarioTitle: 'Ring inversion of a substituted cyclohexane',
  predictPrompt:
    'The substituent on this ring starts AXIAL: its bond runs straight up along the ring axis rather than out around the rim. Commit before you run anything. When the ring inverts, what happens to that group?',
  predictOptions: [
    {
      id: 'stays-axial',
      text: 'It stays axial, because the flip only changes the shape of the ring',
      misconception: null,
      feedback:
        'The flip does change the shape of the ring, and that is exactly why the group cannot stay axial. Axial and equatorial are directions defined relative to the ring, and the ring has turned inside out underneath the group.',
    },
    {
      id: 'becomes-equatorial',
      text: 'It becomes equatorial, pointing out around the rim',
      misconception: null,
      feedback:
        'Correct. Every axial position on one chair is the equatorial position on the other, at all six carbons at once.',
    },
    {
      id: 'other-face',
      text: 'It swings across to the other face of the ring, so a group that pointed up ends up pointing down',
      misconception: 'CONFORMATION-IS-CONFIGURATION',
      feedback:
        'Nothing crosses the ring. A group that was on the upper face is still on the upper face afterwards; only its direction relative to the ring changed. Moving it to the other face would mean breaking and remaking a bond, which is a change of configuration, not of conformation.',
    },
  ],
  predictKey: 'becomes-equatorial',
  observePrompt:
    'Run the inversion from the left rail and keep your eye on the substituent the whole way. Everything below is measured off the model on screen: the angle that bond makes with the ring axis, where near 0 degrees is axial and near 70 is equatorial, and which face of the ring the group is on.',
  explainPrompt:
    'You have watched it and read the angles. Why does an axial group end up equatorial?',
  explainOptions: [
    {
      id: 'inversion-swaps',
      text: 'The ring turns inside out: every carbon above the mean plane drops below it, which makes every axial bond equatorial and every equatorial bond axial in one motion',
      misconception: null,
      feedback:
        'Correct. It is one motion of the ring, not six separate events, and it exchanges the two sets completely.',
    },
    {
      id: 'migrates',
      text: 'The group slides around the ring to a neighbouring carbon whose equatorial position was free',
      misconception: null,
      feedback:
        'Nothing migrates. Each group stays bonded to the carbon it started on for the whole inversion; only the geometry around that carbon changes.',
    },
    {
      id: 'cis-to-trans',
      text: 'The flip converts the compound from cis to trans, and the trans form is the one with the equatorial group',
      misconception: 'CONFORMATION-IS-CONFIGURATION',
      feedback:
        'cis and trans are fixed by which face of the ring each group is on, and no amount of flipping moves a group between faces. A ring flip cannot interconvert them: that would need a bond broken.',
    },
  ],
  explainKey: 'inversion-swaps',
  reflectionPrompt:
    'A ring flip cannot turn cis into trans. What would have to happen to the molecule for that conversion to occur at all?',
  keyVerified: false,
  keyVerdict:
    'Authored in this lab, not exported from OCTET. There is no chair-inversion engine in chem_core, so no simulation was run to check this key against; it rests on the cited course content and on the geometry drawn on screen.',
};

/**
 * Two to four steps per mode, shown once and then only on request.
 *
 * The chair steps deliberately withhold what the flip does. That mode opens
 * with a prediction, and a tour that answers the question on the way in would
 * make the prediction pointless.
 */
const TOURS: Record<Mode, TourStep[]> = {
  explore: [
    {
      title: 'Hybridisation is a count, not a lookup',
      body: 'Clicking an atom shows the arithmetic before the conclusion: how many atoms are attached, how many lone pairs, and the steric number those two add up to. The shape follows from that number, which is why the same element can appear as sp3 in one molecule and sp2 in another.',
      tryIt: 'Click the oxygen in ethanol, then the carbon next to it. Both come out sp3, and the panel shows the same steric number for both.',
    },
    {
      title: 'The overlays are the same geometry, drawn differently',
      body: 'Lone pairs, dipoles and pi lobes are all placed from the coordinates already on screen rather than added by hand, so they cannot disagree with the model they sit on.',
      tryIt: 'Select chloromethane and switch on Dipoles. The arrow points at chlorine because that is where the electronegativity difference puts it.',
    },
    {
      title: 'Measure instead of trusting the picture',
      body: 'The ruler turns the model into something you can interrogate: two atoms give a bond length, three an angle, four a torsion. A picture can mislead about depth; a number cannot.',
      tryIt: 'Switch on the ruler and click the two carbons in ethane, then do the same in ethene. The double bond is the shorter one.',
    },
  ],
  orbitals: [
    {
      title: 'One bond turns, one cannot',
      body: 'A sigma bond is cylindrically symmetric about the line between the two nuclei, so spinning the ends leaves it untouched. A pi bond is two p orbitals overlapping side on, and that overlap only exists while they stay parallel.',
      tryIt: 'Switch on the Pi orbitals overlay before you touch the slider, so you can see the two lobes you are about to pull apart.',
    },
    {
      title: 'Break it and watch the number fall',
      body: 'The remaining overlap follows the cosine squared of the twist angle, so it does not fall off evenly: the first twenty degrees cost little and the last twenty cost almost everything.',
      tryIt: 'Drag the twist to 90 degrees. The p orbitals are perpendicular, the overlap reads zero, and the pi bond has gone.',
    },
    {
      title: 'Why cis and trans are separate compounds',
      body: 'Rotating a C=C means paying for the whole pi bond, which room temperature cannot afford. That single fact is what makes geometric isomers two compounds you can bottle separately rather than two shapes of one.',
      tryIt: 'Reset to planar, then compare with Conformations mode, where a single bond turns freely for exactly the opposite reason.',
    },
  ],
  conformers: [
    {
      title: 'A Newman projection you can turn',
      body: 'The dihedral angle is on a slider and the energy curve tracks it, so the shape and the strain are never more than a glance apart. Staggered and eclipsed alternate every 60 degrees.',
      tryIt: 'Drag slowly from 0 to 60 and watch the marker on the curve fall from a peak into a trough.',
    },
    {
      title: 'Not all staggered conformers are equal',
      body: 'Butane has three staggered arrangements and they are not the same energy. Anti puts the two methyls as far apart as the bond allows; gauche puts them 60 degrees apart and pays for the crowding.',
      tryIt: 'Set butane to 180, then to 60. Both are staggered, and the second sits several kJ/mol higher.',
    },
    {
      title: 'The curve is fitted, not calculated',
      body: 'It is a three-term torsional potential passed through the experimental stationary points the course cites, so it interpolates between real numbers rather than predicting them. The note under the plot says which numbers.',
      tryIt: 'Read the caption under the curve, then check the barrier height at 0 degrees against it.',
    },
  ],
  chair: [
    {
      title: 'Commit first, then run it',
      body: 'This mode opens with a prediction, and the inversion button and the pucker slider stay locked until you have made one. Ordering it that way is the entire point: an answer you form after seeing the result is not a prediction of anything.',
      tryIt: 'Pick the option you actually believe. A wrong answer that keys a named misconception tells you more than a lucky guess does.',
    },
    {
      title: 'Follow one bond, not the whole ring',
      body: 'The whole ring moving at once reads as a blur. Pick a single bond, note where it points before you start, and keep your eye on that one bond through the animation.',
      tryIt: 'Before running it, find the substituent and note where it points relative to the ring. That is the one bond to watch.',
    },
    {
      title: 'The path shown is simplified',
      body: 'A real inversion climbs through a half-chair transition state and pauses at a twist-boat, over a barrier of roughly 45 kJ/mol. The flat ring this animation passes through is not on that path; it is there to make the swap legible.',
      tryIt: 'Once the slider unlocks, drag the pucker to 0 and read what the panel says about that state.',
    },
  ],
  stereo: [
    {
      title: 'The reflection is computed, not authored',
      body: 'The model on the right is the one on the left reflected through the vertical plane, generated live. The R and S labels come from a CIP implementation rather than from the compound name, so they cannot quietly disagree with the coordinates.',
      tryIt: 'Rotate the pair and try to bring the right-hand model onto the left. For an enantiomer no rotation will do it.',
    },
    {
      title: 'Stereocentres do not make a molecule chiral',
      body: 'The usual shortcut is to count stereocentres and stop. meso-tartaric acid has two, one R and one S, and an internal mirror plane that makes it superimposable on its own reflection. It is achiral with stereocentres present.',
      tryIt: 'Select meso-tartaric acid and read the line that says whether the mirror image is the same compound.',
    },
    {
      title: 'Same everything, until the environment is chiral',
      body: 'Two enantiomers share a melting point, a density and a spectrum. They differ only when whatever they meet is itself handed, which is why one enantiomer of a drug can work while its mirror image does not.',
      tryIt: 'Compare the R and S butan-2-ol entries. Everything the panel derives is identical except the descriptor.',
    },
  ],
  triangle: [
    {
      title: 'Three ways of saying one thing',
      body: 'Johnstone argued that chemistry teaching moves constantly between what you could observe, what the particles are doing, and what gets written down, without announcing which one is in play. Here all three are on screen at once for the same node, and each is labelled.',
      tryIt: 'Pick a view and click the Particulate pane. The other two dim, which makes it obvious how often you were switching levels without noticing.',
    },
    {
      title: 'The connector is the load-bearing part',
      body: 'The green box names the one quantity or object that is identical across all three levels. That sentence is the bridge a learner cannot build alone, and it is the part most explanations leave out.',
      tryIt: 'Read the connector first, then re-read the three panes and check that you can point to it in each.',
    },
    {
      title: 'The model on screen is the particulate level',
      body: 'The 3D scene keeps showing whichever molecule is selected in Explore mode, so the particulate pane is not asking you to imagine a picture. Expert review of these views is still pending, and the panel says so rather than presenting them as checked.',
      tryIt: 'Switch to Explore, choose a different molecule, and come back. The particulate level now has that structure sitting beside it.',
    },
  ],
  spectra: [
    {
      title: 'Structure and spectra, same compound',
      body: 'The skill in ORG1 unit 10 is a mapping between a picture of a molecule and a picture of a trace. Choosing a compound here changes both at once, so the two halves of that mapping are never separated.',
      tryIt: 'Select Ethanol. Three signals in a 3 to 2 to 1 ratio, and three genuinely different proton environments in the model beside it.',
    },
    {
      title: 'What is derived and what is cited',
      body: 'The number of signals and the integration ratio come from a symmetry analysis of the structure, so they are derived. Every chemical shift range and every wavenumber is a correlation-table value, because this platform has no NMR or vibrational model and inventing one would be inventing data.',
      tryIt: 'Open the IR tab for acetic acid. The O-H and C=O bands are there because those groups are present, but their positions are quoted.',
    },
    {
      title: 'Degrees of unsaturation come free',
      body: 'The formula alone tells you how many rings plus pi bonds a structure must contain, before you look at a single peak. It is the cheapest constraint in structure determination and the most often skipped.',
      tryIt: 'Step through ethane, ethene and ethyne and watch the count go 0, 1, 2. Then try benzene, which has to account for 4.',
    },
  ],
};

export default function OrganicChemistryPortal() {
  const [mode, setMode] = useState<Mode>('explore');
  const [molKey, setMolKey] = useState('methane');
  const [style, setStyle] = useState<RenderStyle>('ball-and-stick');
  const [overlays, setOverlays] = useState<SceneOverlays>(DEFAULT_OVERLAYS);
  const [spinning, setSpinning] = useState(true);
  const [selectedAtom, setSelectedAtom] = useState<number | null>(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measureSet, setMeasureSet] = useState<number[]>([]);
  const [showStars, setShowStars] = useState(false);

  // Mode-specific state.
  const [torsionKind, setTorsionKind] = useState<TorsionKind>('butane');
  const [phi, setPhi] = useState(180);
  const [pucker, setPucker] = useState(1);
  const [flipping, setFlipping] = useState(false);
  const [substituent, setSubstituent] = useState<'none' | 'methyl' | 'tert-butyl'>('methyl');
  const [twistPi, setTwistPi] = useState(0);
  const [mirrorKey, setMirrorKey] = useState('butan2ol_r');
  const [triangleNode, setTriangleNode] = useState(
    () => ORG_TRIANGLE_VIEWS[0]?.node ?? '',
  );
  const [spectraKey, setSpectraKey] = useState(() => SPECTRA[0]?.key ?? '');

  // Chair mode's predict-observe-explain loop. `poeArmed` is what the locks on
  // the inversion controls read: nothing in that mode moves until a prediction
  // has been committed.
  const [poeArmed, setPoeArmed] = useState(false);
  const [poeSaved, setPoeSaved] = useState<boolean | null>(null);
  const poeStartedAt = useRef(Date.now());

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { onKeyDown, announcement } = useKeyboardOrbit(controlsRef);

  const { recorded, endWithRating } = useXrSession('/dashboard/xr-labs/molecules');

  const libraryMolecule =
    ORGANIC_MOLECULES.find((m) => m.key === molKey) ?? ORGANIC_MOLECULES[0];

  // ---- the molecule currently on screen, per mode ------------------------
  const chair = useMemo(
    () => cyclohexaneChair(pucker, substituent),
    [pucker, substituent],
  );

  const shown: Molecule = useMemo(() => {
    if (mode === 'conformers') return torsionMolecule(torsionKind, phi);
    if (mode === 'chair') {
      return chair.molecule;
    }
    if (mode === 'stereo') {
      return ORGANIC_MOLECULES.find((m) => m.key === mirrorKey) ?? libraryMolecule;
    }
    if (mode === 'spectra') {
      // The whole point of the mode is that both panes describe one compound,
      // so the scene follows the spectrum. A key with no model behind it falls
      // back to the library selection rather than emptying the canvas.
      return ORGANIC_MOLECULES.find((m) => m.key === spectraKey) ?? libraryMolecule;
    }
    if (mode === 'orbitals') {
      // The pi-rotation demo runs on ethene; twisting it is the whole point.
      const base = ORGANIC_MOLECULES.find((m) => m.key === 'ethene')!;
      if (twistPi === 0) return base;
      return twistAboutDoubleBond(base, twistPi);
    }
    return libraryMolecule;
  }, [mode, torsionKind, phi, chair, mirrorKey, spectraKey, libraryMolecule, twistPi]);

  const triangleView =
    ORG_TRIANGLE_VIEWS.find((v) => v.node === triangleNode) ?? ORG_TRIANGLE_VIEWS[0];
  const spectrumSubject =
    SPECTRA.find((s) => s.key === spectraKey) ?? SPECTRA[0];

  // The mirror partner shown alongside in stereo mode.
  const mirrorPartner = useMemo(() => {
    if (mode !== 'stereo') return null;
    return mirrorImage(shown);
  }, [mode, shown]);

  // Ring-flip animation.
  useEffect(() => {
    if (!flipping) return;
    let raf = 0;
    const start = performance.now();
    const from = pucker;
    const to = -Math.sign(pucker || 1);
    const DURATION = 2200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease so the slow part is the middle, where the swap happens.
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      setPucker(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setFlipping(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Intentionally not depending on pucker: the animation owns it while running.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipping]);

  // Reset per-molecule UI state when the subject changes.
  useEffect(() => {
    setSelectedAtom(null);
    setMeasureSet([]);
  }, [molKey, mode, mirrorKey, spectraKey]);

  // The POE panel unmounts when the mode changes, so the lock it controls has
  // to reset with it. A fresh panel back in the predict phase sitting beside
  // unlocked controls would let the inversion be run before anything is
  // committed, which is the one thing the loop exists to prevent.
  useEffect(() => {
    setPoeArmed(false);
    setPoeSaved(null);
    poeStartedAt.current = Date.now();
  }, [mode]);

  const onPoeComplete = useCallback(async (outcome: PoeOutcome) => {
    const elapsed = (Date.now() - poeStartedAt.current) / 1000;
    const row = await recordOutcome(outcome, elapsed);
    // recordOutcome returns null when the write did not land. Saying it was
    // recorded anyway would be the one failure mode worth avoiding here.
    setPoeSaved(row !== null);
    if (row) toast.success(`Recorded against ${outcome.node}`);
    else toast('Your answers are on screen, but progress could not be saved');
  }, []);

  const onPickAtom = useCallback(
    (i: number) => {
      if (measureMode) {
        setMeasureSet((prev) => {
          if (prev.includes(i)) return prev.filter((x) => x !== i);
          if (prev.length >= 4) return [i];
          return [...prev, i];
        });
        return;
      }
      setSelectedAtom((prev) => (prev === i ? null : i));
    },
    [measureMode],
  );

  const measurement = useMemo(() => {
    const a = shown.atoms;
    if (measureSet.length === 2) {
      return {
        text: `${distance(a[measureSet[0]], a[measureSet[1]]).toFixed(3)} A`,
        kind: 'Bond length',
      };
    }
    if (measureSet.length === 3) {
      return {
        text: `${angleBetween(a[measureSet[0]], a[measureSet[1]], a[measureSet[2]]).toFixed(1)} deg`,
        kind: 'Angle at the middle atom',
      };
    }
    if (measureSet.length === 4) {
      const t = torsionOf(a, measureSet);
      return { text: `${t.toFixed(1)} deg`, kind: 'Torsion' };
    }
    return null;
  }, [measureSet, shown]);

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
  const modelKind =
    mode === 'conformers' || mode === 'chair' ? 'idealised' : 'computed';

  return (
    <div className="fixed inset-0 z-50 bg-[#070a14] text-white">
      {/* The canvas is wrapped in a focusable region so the scene can be
          operated without a pointer. OrbitControls is mouse and touch only, so
          without this the 3D view is a dead area for keyboard users. */}
      <div
        className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400/70"
        tabIndex={0}
        role="application"
        aria-label="Molecule viewer. Arrow keys rotate, plus and minus zoom, 0 resets the view."
        onKeyDown={onKeyDown}
      >
        <Canvas
          camera={{ position: [0, 2.2, 9], fov: 48, near: 0.05, far: 200 }}
          legacy
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ChemLights />
            <group position={mirrorPartner ? [-2.6, 0, 0] : [0, 0, 0]}>
              <MoleculeScene
                molecule={shown}
                style={style}
                overlays={overlays}
                spinning={spinning && !flipping}
                selectedAtom={selectedAtom}
                measureSet={measureSet}
                onPickAtom={onPickAtom}
              />
            </group>
            {mirrorPartner && (
              <group position={[2.6, 0, 0]}>
                <MoleculeScene
                  molecule={mirrorPartner}
                  style={style}
                  overlays={overlays}
                  spinning={spinning}
                  selectedAtom={null}
                  measureSet={[]}
                  onPickAtom={() => {}}
                />
              </group>
            )}
            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.08}
              minDistance={2.5}
              maxDistance={40}
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
                onClick={() => setMode(m.id)}
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
            onClick={() => {
              setMeasureMode((m) => !m);
              setMeasureSet([]);
            }}
            className={`rounded p-2 transition-colors ${
              measureMode ? 'bg-amber-500 text-black' : 'hover:bg-white/10'
            }`}
            title="Measure: click 2 atoms for a length, 3 for an angle, 4 for a torsion"
          >
            <Ruler className="h-4 w-4" />
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
        {mode === 'explore' && (
          <Panel className="p-3">
            <PanelTitle>Molecules</PanelTitle>
            <div className="flex flex-col gap-1">
              {ORGANIC_MOLECULES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMolKey(m.key)}
                  className={`rounded px-2.5 py-1.5 text-left transition-colors ${
                    m.key === molKey ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-semibold">{m.name}</div>
                  <div className="font-mono text-[10px] text-white/60">{m.formula}</div>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {mode === 'conformers' && (
          <Panel className="p-3">
            <PanelTitle>Molecule</PanelTitle>
            <div className="flex flex-col gap-1">
              {(['ethane', 'butane'] as TorsionKind[]).map((k) => (
                <ToggleButton
                  key={k}
                  active={torsionKind === k}
                  onClick={() => setTorsionKind(k)}
                >
                  {k === 'ethane' ? 'Ethane' : 'Butane'}
                </ToggleButton>
              ))}
            </div>
            <div className="mt-3">
              <Slider
                label="Dihedral angle"
                value={phi}
                min={0}
                max={360}
                onChange={setPhi}
                suffix=" deg"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {(torsionKind === 'butane'
                ? [0, 60, 120, 180, 240, 300]
                : [0, 60, 120, 180]
              ).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPhi(d)}
                  className="rounded bg-white/5 px-1.5 py-1 text-[10px] hover:bg-white/15"
                >
                  {d}
                </button>
              ))}
            </div>
          </Panel>
        )}

        {mode === 'chair' && (
          <Panel className="p-3">
            <PanelTitle>Substituent</PanelTitle>
            <div className="flex flex-col gap-1">
              {(['none', 'methyl', 'tert-butyl'] as const).map((s) => (
                <ToggleButton
                  key={s}
                  active={substituent === s}
                  onClick={() => setSubstituent(s)}
                >
                  {s === 'none' ? 'Cyclohexane' : s === 'methyl' ? 'Methyl' : 'tert-Butyl'}
                </ToggleButton>
              ))}
            </div>
            {/* Running the inversion IS the observation half of the loop, so
                both controls that can produce it stay shut until a prediction
                has been committed. A learner who can watch first and answer
                afterwards is not predicting anything. */}
            <fieldset disabled={!poeArmed} className="mt-3 disabled:opacity-40">
              <Slider
                label="Ring pucker"
                value={pucker}
                min={-1}
                max={1}
                step={0.01}
                onChange={setPucker}
              />
            </fieldset>
            <button
              type="button"
              onClick={() => setFlipping(true)}
              disabled={flipping || !poeArmed}
              className="mt-2 w-full rounded bg-sky-500 px-3 py-2 text-xs font-semibold transition-colors hover:bg-sky-400 disabled:opacity-50"
            >
              {flipping ? 'Flipping...' : 'Run ring inversion'}
            </button>
            {!poeArmed && (
              <p className="mt-2 text-[10px] leading-relaxed text-white/40">
                Locked until you commit a prediction in the right panel.
              </p>
            )}
          </Panel>
        )}

        {mode === 'triangle' && (
          <Panel className="p-3">
            <PanelTitle>Johnstone views</PanelTitle>
            <TriangleList
              views={ORG_TRIANGLE_VIEWS}
              selected={triangleNode}
              onSelect={setTriangleNode}
            />
          </Panel>
        )}

        {mode === 'spectra' && (
          <Panel className="p-3">
            <PanelTitle>Compound</PanelTitle>
            <div className="flex flex-col gap-1">
              {SPECTRA.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSpectraKey(s.key)}
                  className={`rounded px-2.5 py-1.5 text-left transition-colors ${
                    s.key === spectraKey ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-semibold">{s.name}</div>
                  <div className="font-mono text-[10px] text-white/60">{s.smiles}</div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-white/40">
              Choosing a compound moves the model and the spectra together. The
              two panes are always the same substance.
            </p>
          </Panel>
        )}

        {mode === 'stereo' && (
          <Panel className="p-3">
            <PanelTitle>Compare with its mirror</PanelTitle>
            <div className="flex flex-col gap-1">
              {ORGANIC_MOLECULES.filter((m) =>
                ['butan2ol_r', 'butan2ol_s', 'tartaric_meso', 'l_alanine', 'glucose_beta', 'methane'].includes(
                  m.key,
                ),
              ).map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMirrorKey(m.key)}
                  className={`rounded px-2.5 py-1.5 text-left transition-colors ${
                    m.key === mirrorKey ? 'bg-sky-500' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-semibold">{m.name}</div>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {mode === 'orbitals' && (
          <Panel className="p-3">
            <PanelTitle>Twist the double bond</PanelTitle>
            <Slider
              label="Twist about C=C"
              value={twistPi}
              min={0}
              max={90}
              onChange={setTwistPi}
              suffix=" deg"
            />
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              Turn the far carbon and watch the two p lobes fall out of
              alignment. At 90 degrees they are perpendicular and the overlap,
              which is the pi bond, is gone.
            </p>
            <button
              type="button"
              onClick={() => setTwistPi(0)}
              className="mt-2 w-full rounded bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
            >
              Reset to planar
            </button>
          </Panel>
        )}

        {/* Rendering controls, shared by every mode. */}
        <Panel className="p-3">
          <PanelTitle>Show</PanelTitle>
          <div className="flex flex-wrap gap-1">
            <ToggleButton active={overlays.lonePairs} onClick={() => toggle('lonePairs')}>
              Lone pairs
            </ToggleButton>
            <ToggleButton active={overlays.dipoles} onClick={() => toggle('dipoles')}>
              Dipoles
            </ToggleButton>
            <ToggleButton active={overlays.piSystems} onClick={() => toggle('piSystems')}>
              Pi orbitals
            </ToggleButton>
            <ToggleButton active={overlays.labels} onClick={() => toggle('labels')}>
              Labels
            </ToggleButton>
            <ToggleButton active={overlays.stereo} onClick={() => toggle('stereo')}>
              R / S
            </ToggleButton>
          </div>
          <PanelTitle>
            <span className="mt-3 block">Style</span>
          </PanelTitle>
          <div className="flex flex-wrap gap-1">
            {(['ball-and-stick', 'space-filling', 'wireframe'] as RenderStyle[]).map((s) => (
              <ToggleButton key={s} active={style === s} onClick={() => setStyle(s)}>
                {s === 'ball-and-stick' ? 'Ball' : s === 'space-filling' ? 'Space' : 'Wire'}
              </ToggleButton>
            ))}
          </div>
        </Panel>
      </div>

      {/* ---------------- Right panel ---------------- */}
      <div className="pointer-events-none absolute right-4 top-24 z-10 max-h-[calc(100vh-12rem)] w-[22rem] overflow-y-auto">
        <Panel className="p-4">
          <h2 className="text-lg font-bold leading-tight">{shown.name}</h2>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="font-mono text-xs text-white/70">{shown.formula}</span>
            {shown.mass > 0 && (
              <span className="text-[11px] text-white/40">{shown.mass} g/mol</span>
            )}
          </div>

          {shown.teaches.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {shown.teaches.map((c) => (
                <NodeBadge key={c} code={c} />
              ))}
            </div>
          )}

          {/* -------- mode-specific readouts -------- */}
          {mode === 'conformers' && (
            <ConformerPanel kind={torsionKind} phi={phi} />
          )}
          {mode === 'chair' && (
            <>
              <div className="mt-3">
                <PoePanel
                  item={CHAIR_FLIP_POE}
                  onObserve={() => setPoeArmed(true)}
                  onComplete={onPoeComplete}
                  observation={
                    <ChairObservation
                      molecule={shown}
                      substitutedCarbon={chair.substitutedCarbon}
                      pucker={pucker}
                    />
                  }
                />
                {/* PoePanel only prints keyVerdict for keys the export
                    checked, so the verdict for this hand-written one is shown
                    here rather than being silently dropped. */}
                <p className="mt-2 text-[10px] leading-relaxed text-white/35">
                  {CHAIR_FLIP_POE.keyVerdict}
                </p>
                {poeSaved !== null && (
                  <p
                    className={`mt-2 text-[11px] leading-relaxed ${
                      poeSaved ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {poeSaved
                      ? `Both answers were recorded against ${CHAIR_FLIP_POE.node} in your progress.`
                      : 'Nothing was recorded. Your answers are above, but the write to your progress did not land.'}
                  </p>
                )}
              </div>
              {/* The pitfall note names the answer, so it waits until the
                  prediction is locked. */}
              <ChairPanel
                pucker={pucker}
                substituent={substituent}
                revealPitfall={poeArmed}
              />
            </>
          )}
          {mode === 'stereo' && <StereoPanel molecule={shown} />}
          {mode === 'orbitals' && <OrbitalPanel twist={twistPi} />}
          {mode === 'triangle' && triangleView && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <TrianglePanel view={triangleView} />
              <p className="mt-3 text-[10px] leading-relaxed text-white/35">
                The model on the canvas is whichever molecule is selected in
                Explore mode. It is there because it is the particulate level
                this panel is describing, not because it illustrates this
                particular node.
              </p>
            </div>
          )}
          {mode === 'spectra' && spectrumSubject && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <SpectraPanel subject={spectrumSubject} />
            </div>
          )}

          {/* -------- selected atom -------- */}
          {selected && (
            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-full ring-1 ring-white/30"
                  style={{ backgroundColor: ELEMENTS[selected.el].color }}
                />
                <span className="font-bold">{ELEMENTS[selected.el].name}</span>
                {selected.hyb && (
                  <span className="rounded bg-sky-500/25 px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-sky-400/40">
                    {selected.hyb}
                  </span>
                )}
                {selected.cip && (
                  <span className="rounded bg-fuchsia-500/25 px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-fuchsia-400/40">
                    {selected.cip}
                  </span>
                )}
              </div>

              {/* The count, shown as a count. The lesson's rule is that
                  hybridisation follows from how many groups an atom carries,
                  not from which element it is, so the arithmetic is on
                  screen rather than the conclusion alone. */}
              <div className="mt-2">
                <Stat
                  label="Attached atoms"
                  value={shown.bonds.filter(
                    (b) => b.a === selectedAtom || b.b === selectedAtom,
                  ).length}
                />
                <Stat label="Lone pairs" value={selected.lp} />
                <Stat
                  label="Steric number"
                  value={<span className="text-sky-300">{selected.sn}</span>}
                  hint="Attached atoms plus lone pairs. This is what sets the geometry."
                />
                {vsepr(selected.sn, selected.lp) && (
                  <>
                    <Stat
                      label="Electron geometry"
                      value={vsepr(selected.sn, selected.lp)!.electron}
                    />
                    <Stat
                      label="Molecular shape"
                      value={vsepr(selected.sn, selected.lp)!.molecular}
                    />
                    <Stat
                      label="Ideal angle"
                      value={`${vsepr(selected.sn, selected.lp)!.angle} deg`}
                    />
                  </>
                )}
                {selected.charge ? (
                  <Stat label="Formal charge" value={selected.charge > 0 ? `+${selected.charge}` : selected.charge} />
                ) : null}
                <Stat label="Electronegativity" value={ELEMENTS[selected.el].en.toFixed(2)} />
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                {ELEMENTS[selected.el].blurb}
              </p>
            </div>
          )}

          {measureMode && (
            <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-950/30 p-3">
              <PanelTitle>Measure</PanelTitle>
              {measurement ? (
                <>
                  <div className="text-lg font-bold text-amber-300">{measurement.text}</div>
                  <div className="text-[11px] text-white/60">{measurement.kind}</div>
                </>
              ) : (
                <p className="text-[11px] text-white/60">
                  Click 2 atoms for a bond length, 3 for an angle, 4 for a
                  torsion. Selected: {measureSet.length}.
                </p>
              )}
              <p className="mt-2 text-[10px] text-white/40">
                Read off this model. In the computed modes that is an optimised
                conformer, not a measurement.
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

          {!selected && mode === 'explore' && (
            <p className="mt-4 text-[11px] text-white/40">
              Click any atom to see the count that fixes its hybridisation and
              geometry.
            </p>
          )}
        </Panel>
      </div>

      {/* ---------------- Bottom ---------------- */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-col items-start gap-2">
        <TourOverlay steps={TOURS[mode]} storageKey={`organic-${mode}`} />
        <KeyboardHint announcement={announcement} />
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 z-10">
        <ModelNote kind={modelKind} />
      </div>

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
// Mode panels
// ---------------------------------------------------------------------------

function ConformerPanel({ kind, phi }: { kind: TorsionKind; phi: number }) {
  const label = torsionLabel(kind, phi);
  const energy = torsionEnergy(kind, phi);
  const max = kind === 'ethane' ? 12 : 19;
  return (
    <div className="mt-3">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="text-sm font-bold text-sky-300">{label.name}</div>
        <div className="mt-1 text-[11px] leading-relaxed text-white/70">{label.note}</div>
        <div className="mt-2">
          <Stat label="Dihedral" value={`${phi.toFixed(0)} deg`} />
          <Stat
            label="Strain above the minimum"
            value={`${energy.toFixed(1)} kJ/mol`}
          />
        </div>
      </div>
      <div className="mt-3">
        <PanelTitle>Energy against dihedral</PanelTitle>
        <EnergyCurve
          energyAt={(d) => torsionEnergy(kind, d)}
          current={phi}
          maxEnergy={max}
          markers={[
            { deg: 0, label: '0' },
            { deg: 60, label: '60' },
            { deg: 120, label: '120' },
            { deg: 180, label: '180' },
            { deg: 240, label: '240' },
            { deg: 300, label: '300' },
          ]}
        />
        <p className="mt-3 text-[10px] leading-relaxed text-white/40">
          The curve is a three-term torsional potential fitted to the
          experimental stationary points the course cites: for butane, anti 0,
          gauche 3.8, methyl-hydrogen eclipsed 16 and methyl-methyl eclipsed 19
          kJ/mol. It interpolates between cited values rather than computing
          them.
        </p>
      </div>
    </div>
  );
}

/**
 * What the learner reads off the model during the observe step.
 *
 * Every line here is measured from the geometry on screen rather than
 * asserted. A readout that printed "now equatorial" from a hardcoded string
 * would agree with the answer key even if the model disagreed with it, which
 * is the one failure the observe step exists to catch.
 *
 * The measurement is the angle between the substituent bond and the ring axis,
 * because that is what axial and equatorial mean: axial runs along the axis,
 * equatorial lies out towards the ring plane. Taking it against the axis
 * rather than against the neighbouring C-H also keeps the reading independent
 * of where that hydrogen happens to be placed. Mid inversion the bond is at
 * neither extreme, and the label says so instead of rounding to one.
 */
function ChairObservation({
  molecule,
  substitutedCarbon,
  pucker,
}: {
  molecule: Molecule;
  substitutedCarbon: number | null;
  pucker: number;
}) {
  if (substitutedCarbon === null) {
    return (
      <p className="text-[11px] text-white/60">
        Choose a substituent, so that there is something on the ring worth
        following through the flip.
      </p>
    );
  }

  const c = molecule.atoms[substitutedCarbon];
  // cyclohexaneChair emits the six ring carbons first, so a heavy atom bonded
  // to this carbon and sitting past them is the substituent.
  const RING_CARBONS = 6;
  const subIdx = molecule.bonds
    .map((b) =>
      b.a === substitutedCarbon ? b.b : b.b === substitutedCarbon ? b.a : -1,
    )
    .find((i) => i >= RING_CARBONS && molecule.atoms[i].el !== 'H');
  if (subIdx === undefined) return null;

  const p = molecule.atoms[subIdx].pos;
  const v: [number, number, number] = [
    p[0] - c.pos[0],
    p[1] - c.pos[1],
    p[2] - c.pos[2],
  ];
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  // The ring is built around the y axis, so y is the ring axis.
  const tilt = (Math.acos(Math.min(1, Math.abs(v[1]) / len)) * 180) / Math.PI;
  const role =
    tilt < 30 ? 'axial' : tilt > 55 ? 'equatorial' : 'neither, mid inversion';
  const tone =
    tilt < 30 ? 'text-amber-300' : tilt > 55 ? 'text-emerald-300' : 'text-white/70';

  return (
    <div className="space-y-2">
      <Stat
        label="Substituent bond to ring axis"
        value={`${tilt.toFixed(0)} deg`}
        hint="Measured off the model on screen, not asserted"
      />
      <Stat
        label="Which makes it"
        value={<span className={tone}>{role}</span>}
        hint="Along the axis is axial, out towards the ring plane is equatorial"
      />
      <Stat
        label="Face of the ring"
        value={v[1] > 0 ? 'upper' : 'lower'}
        hint="Which side of the ring mean plane the group sits on"
      />
      <Stat label="Ring pucker" value={pucker.toFixed(2)} />
      <p className="text-[10px] leading-relaxed text-white/45">
        Run the inversion and watch these lines. One of them changes and one of
        them does not, and which is which is the whole answer.
      </p>
    </div>
  );
}

function ChairPanel({
  pucker,
  substituent,
  revealPitfall = true,
}: {
  pucker: number;
  substituent: 'none' | 'methyl' | 'tert-butyl';
  /**
   * The pitfall note states the answer in plain words, so in POE mode it
   * stays hidden until the prediction has been committed.
   */
  revealPitfall?: boolean;
}) {
  const a = substituent === 'none' ? null : A_VALUES[substituent];
  const flat = Math.abs(pucker) < 0.12;
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="text-sm font-bold text-sky-300">
          {flat ? 'Mid inversion' : pucker > 0 ? 'Chair A' : 'Chair B'}
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-white/70">
          {flat
            ? 'Between the two chairs. Every axial bond is on its way to becoming equatorial and every equatorial to becoming axial.'
            : 'Three carbons above the mean plane and three below. Every angle sits near tetrahedral and every bond is staggered, which is why the chair is essentially strain free.'}
        </p>
      </div>

      {a && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <PanelTitle>A value</PanelTitle>
          <Stat label="Preference for equatorial" value={`${a.kj} kJ/mol`} />
          <Stat label="In kcal/mol" value={`${a.kcal}`} />
          <Stat
            label="Equatorial at 298 K"
            value={`${equatorialPercent(a.kj).toFixed(1)} %`}
            hint="From K = exp(dG/RT) with RT = 2.479 kJ/mol"
          />
          <p className="mt-2 text-[10px] leading-relaxed text-white/40">
            The A value is cited experimental data. The percentage is computed
            from it here.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-amber-400/25 bg-amber-950/25 p-3">
        {revealPitfall ? (
          <p className="text-[11px] leading-relaxed text-amber-200/80">
            A ring flip swaps axial and equatorial at every carbon. It does NOT
            move a group from one face of the ring to the other, so it cannot
            turn cis into trans. Conformation is not configuration.
          </p>
        ) : (
          <p className="text-[11px] leading-relaxed text-amber-200/60">
            There is a note here about what a ring flip does and does not
            change. It is withheld until you have committed a prediction,
            because it answers the question.
          </p>
        )}
        <p className="mt-2 text-[10px] leading-relaxed text-amber-200/50">
          The path drawn here is simplified. The real inversion passes through
          a half-chair transition state and a twist-boat intermediate, over a
          barrier of about 45 kJ/mol; a flat ring is not on that path.
        </p>
      </div>
    </div>
  );
}

function StereoPanel({ molecule }: { molecule: Molecule }) {
  const centres = molecule.atoms.filter((a) => a.cip);
  const superimposable = isAchiral(molecule);
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <Stat label="Stereocentres" value={centres.length} />
        <Stat
          label="Descriptors"
          value={centres.length ? centres.map((c) => c.cip).join(', ') : 'none'}
        />
        <Stat
          label="Mirror image is"
          value={
            <span className={superimposable ? 'text-emerald-400' : 'text-amber-300'}>
              {superimposable ? 'the same compound' : 'a different compound'}
            </span>
          }
        />
      </div>
      <p className="text-[11px] leading-relaxed text-white/70">
        {superimposable
          ? centres.length > 0
            ? 'This molecule has stereocentres and is still achiral: an internal mirror plane makes it superimposable on its own reflection. That is what meso means. Having stereocentres is not the same as being chiral.'
            : 'No stereocentres, so the mirror image is just the molecule again.'
          : 'The reflection cannot be rotated onto the original, so the two are enantiomers: same formula, same connectivity, same melting point, and different behaviour only in a chiral environment.'}
      </p>
      <p className="text-[10px] leading-relaxed text-white/40">
        The right-hand model is the reflection of the left through the yz
        plane, computed live. R and S labels come from RDKit&apos;s CIP
        implementation, not from the name.
      </p>
    </div>
  );
}

function OrbitalPanel({ twist }: { twist: number }) {
  // cos^2 is the standard angular dependence of p-orbital overlap.
  const overlap = Math.cos((twist * Math.PI) / 180) ** 2;
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <Stat label="Twist" value={`${twist.toFixed(0)} deg`} />
        <Stat
          label="Remaining pi overlap"
          value={
            <span className={overlap < 0.15 ? 'text-rose-400' : 'text-emerald-400'}>
              {(overlap * 100).toFixed(0)} %
            </span>
          }
          hint="Proportional to cos squared of the twist angle"
        />
      </div>
      <p className="text-[11px] leading-relaxed text-white/70">
        The sigma bond is cylindrically symmetric about the C-C axis, so
        turning the ends does nothing to it. The pi bond is made from two p
        orbitals that must stay parallel to overlap at all. Twist them and the
        bond weakens; at 90 degrees the overlap is zero and the pi bond is
        broken.
      </p>
      <p className="text-[11px] leading-relaxed text-white/70">
        That is the whole reason a C=C does not rotate at room temperature, and
        therefore the reason cis and trans isomers are separate compounds
        rather than two shapes of one.
      </p>
      <p className="text-[10px] leading-relaxed text-white/40">
        Switch on the pi orbital overlay to see the lobes. The overlap figure
        is the textbook cos-squared angular dependence, shown to make the trend
        legible rather than as a calculated bond energy.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Geometry helpers used only by this page
// ---------------------------------------------------------------------------

/** Reflect through the yz plane: the mirror image. */
function mirrorImage(m: Molecule): Molecule {
  return {
    ...m,
    key: `${m.key}-mirror`,
    name: `${m.name} (mirror image)`,
    atoms: m.atoms.map((a) => ({
      ...a,
      pos: [-a.pos[0], a.pos[1], a.pos[2]] as [number, number, number],
      // Reflection inverts every descriptor.
      cip: a.cip === 'R' ? 'S' : a.cip === 'S' ? 'R' : undefined,
    })),
  };
}

/**
 * Is the molecule superimposable on its mirror image?
 *
 * Decided from the CIP descriptors rather than by attempting a 3D alignment:
 * a molecule with no stereocentres is achiral, and one whose descriptors come
 * in matched R/S pairs has an internal mirror plane and is meso. That covers
 * every molecule in this library. It would not cover axial or planar
 * chirality, which the library does not contain.
 */
function isAchiral(m: Molecule): boolean {
  const codes = m.atoms.map((a) => a.cip).filter(Boolean) as string[];
  if (codes.length === 0) return true;
  const r = codes.filter((c) => c === 'R').length;
  const s = codes.filter((c) => c === 'S').length;
  return r === s && codes.length % 2 === 0;
}

/** Rotate one end of the ethene double bond, to break the pi overlap. */
function twistAboutDoubleBond(base: Molecule, deg: number): Molecule {
  const bond = base.bonds.find((b) => b.order === 2);
  if (!bond) return base;
  const a = new THREE.Vector3(...base.atoms[bond.a].pos);
  const b = new THREE.Vector3(...base.atoms[bond.b].pos);
  const axis = new THREE.Vector3().subVectors(b, a).normalize();
  const q = new THREE.Quaternion().setFromAxisAngle(axis, (deg * Math.PI) / 180);

  // Everything attached to the far carbon turns with it.
  const moving = new Set<number>();
  base.bonds.forEach((bd) => {
    if (bd === bond) return;
    if (bd.a === bond.b) moving.add(bd.b);
    if (bd.b === bond.b) moving.add(bd.a);
  });

  return {
    ...base,
    key: 'ethene-twisted',
    name: `Ethene, twisted ${deg.toFixed(0)} deg`,
    atoms: base.atoms.map((atom, i) => {
      if (!moving.has(i)) return atom;
      const p = new THREE.Vector3(...atom.pos).sub(b).applyQuaternion(q).add(b);
      return { ...atom, pos: [p.x, p.y, p.z] as [number, number, number] };
    }),
  };
}

function torsionOf(atoms: Molecule['atoms'], idx: number[]): number {
  const [p0, p1, p2, p3] = idx.map((i) => new THREE.Vector3(...atoms[i].pos));
  const b1 = new THREE.Vector3().subVectors(p1, p0);
  const b2 = new THREE.Vector3().subVectors(p2, p1);
  const b3 = new THREE.Vector3().subVectors(p3, p2);
  const n1 = new THREE.Vector3().crossVectors(b1, b2);
  const n2 = new THREE.Vector3().crossVectors(b2, b3);
  const m = new THREE.Vector3().crossVectors(n1, b2.clone().normalize());
  return (Math.atan2(m.dot(n2), n1.dot(n2)) * 180) / Math.PI;
}

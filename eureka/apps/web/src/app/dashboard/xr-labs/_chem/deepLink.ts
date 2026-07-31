/**
 * Where an OCTET lesson lands when it links into a lab.
 *
 * The lesson pages link in by curriculum node rather than by mode:
 *
 *   /dashboard/xr-labs/molecules?node=ORG1.CHAIR
 *   /dashboard/xr-labs/general-chemistry?node=GEN2.BUFFER
 *
 * That is the right way round. A lesson knows which node it is teaching and
 * has no business knowing that this lab happens to call the relevant view
 * "chair"; the labs can rename or merge a mode without every lesson breaking.
 * The cost is that somebody has to hold the mapping, and it has to be ONE
 * somebody: a table copied into both pages would drift the first time a mode
 * moved, and the failure would be a learner landing in the wrong view with no
 * error anywhere to notice.
 *
 * Resolution has three tiers, in order:
 *
 *   1. A node named in the table opens that mode.
 *   2. Otherwise, a node with a Johnstone view for this lab's course opens
 *      triangle mode on that view. Most nodes have no 3D mode of their own but
 *      do have something worth saying at three levels, so this catches far more
 *      of the curriculum than the table does.
 *   3. Otherwise the lab opens where it always does. An unrecognised node is
 *      not an error: it means the lesson linked to a lab that has nothing
 *      specific for it yet, and dropping the learner into the default view is a
 *      better answer than a blank page or a toast.
 *
 * Nothing here reaches into React or three, so it is directly testable; see
 * deepLink.test.ts.
 */

import { POE_ITEMS, SCENARIOS, TRIANGLE_VIEWS } from './chemContent';

// ---------------------------------------------------------------------------
// The modes each lab has
// ---------------------------------------------------------------------------

/**
 * The canonical mode lists.
 *
 * Both pages derive their `Mode` type from these rather than declaring their
 * own, so the table below cannot name a mode that does not exist: the type
 * check fails first. The test then restates it at runtime, which is what
 * catches a future refactor that loosens these types.
 */
export const MOLECULES_MODES = [
  'explore',
  'orbitals',
  'conformers',
  'chair',
  'stereo',
  'triangle',
  'spectra',
] as const;

export type MoleculesMode = (typeof MOLECULES_MODES)[number];

export const GENERAL_MODES = [
  'vsepr',
  'polarity',
  'lattice',
  'orbitals',
  'forces',
  'bench',
  'triangle',
] as const;

export type GeneralMode = (typeof GENERAL_MODES)[number];

/** The course prefixes whose Johnstone views each lab carries. */
const MOLECULES_COURSES = ['ORG'];
const GENERAL_COURSES = ['GEN'];

// ---------------------------------------------------------------------------
// The table
// ---------------------------------------------------------------------------

export interface DeepLinkGroup<M extends string> {
  readonly mode: M;
  readonly nodes: readonly string[];
}

/**
 * Organic lab: node to mode.
 *
 * Triangle mode names no nodes on purpose. It is not aimed at any one node, so
 * it is reached by the fallback rather than by being listed against forty of
 * them.
 */
export const MOLECULES_DEEP_LINKS: readonly DeepLinkGroup<MoleculesMode>[] = [
  { mode: 'explore', nodes: ['ORG1.HYBRIDORG', 'ORG1.FUNCTIONALGROUPS'] },
  { mode: 'orbitals', nodes: ['ORG1.ORBITALS'] },
  { mode: 'conformers', nodes: ['ORG1.NEWMAN'] },
  { mode: 'chair', nodes: ['ORG1.CHAIR', 'ORG1.AVALUES'] },
  { mode: 'stereo', nodes: ['ORG1.CHIRALITY', 'ORG1.RS', 'ORG1.ENANTIODIA'] },
  {
    mode: 'spectra',
    nodes: [
      'ORG1.NMRTHEORY',
      'ORG1.NMRINTEGRATION',
      'ORG1.IRREGIONS',
      'ORG1.IRINTERPRET',
      'ORG1.MSBASICS',
      'ORG1.MSFRAGMENT',
    ],
  },
];

/** General chemistry lab: node to mode. */
export const GENERAL_DEEP_LINKS: readonly DeepLinkGroup<GeneralMode>[] = [
  { mode: 'vsepr', nodes: ['GEN1.VSEPR', 'GEN1.LEWIS', 'GEN1.OCTETEXCEPTIONS'] },
  { mode: 'polarity', nodes: ['GEN1.POLARITY', 'GEN1.COVALENTBOND'] },
  {
    mode: 'lattice',
    nodes: [
      'GEN1.IONICBOND',
      'GEN1.NOMENIONIC',
      'GEN1.SOLIDTYPES',
      'GEN1.UNITCELLS',
    ],
  },
  { mode: 'orbitals', nodes: ['GEN1.QUANTUMMODEL', 'GEN1.QUANTUMNUMBERS'] },
  { mode: 'forces', nodes: ['GEN1.IMF', 'GEN1.IMFPROPERTIES'] },
  {
    mode: 'bench',
    nodes: [
      'GEN2.TITRATIONSTRONG',
      'GEN2.TITRATIONWEAK',
      'GEN2.BUFFER',
      'GEN2.LECHATELIER',
      // The kinetics and gas scenarios. These arrived with their bench scenes
      // in the same change, so a lesson on any of them had nowhere to link
      // until now even though the scene existed.
      'GEN2.RATELAW',
      'GEN2.CATALYSIS',
      'GEN1.SIMPLEGASLAWS',
      'GEN1.KMT',
    ],
  },
];

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

/** What the bench should be showing when a link names a bench node. */
export interface BenchSelection {
  scenarioId: string;
  /**
   * The POE item within that scenario, when the node names one. A scenario can
   * carry more than one item on different nodes, and the point of arriving from
   * a lesson is to land on the question that lesson was about.
   */
  poeItemId?: string;
}

export interface DeepLinkTarget<M extends string> {
  mode: M;
  /** Set only when triangle mode was reached, naming the view to open. */
  triangleNode?: string;
  /** Set only for bench mode. */
  bench?: BenchSelection;
}

function modeFor<M extends string>(
  groups: readonly DeepLinkGroup<M>[],
  node: string,
): M | null {
  for (const g of groups) {
    if (g.nodes.includes(node)) return g.mode;
  }
  return null;
}

/**
 * Does this lab carry a Johnstone view for the node?
 *
 * The course filter matters: the organic lab shows only the ORG views and the
 * general one only GEN, so GEN1.MOLE arriving at the molecules lab has no
 * triangle to fall back to and must land on the default instead of on an empty
 * picker.
 *
 * This repeats the predicate in Triangle.tsx rather than importing it, because
 * that module is a client component pulling in React and icons, and this one is
 * meant to stay importable from a plain test.
 */
export function triangleNodeFor(
  node: string,
  courses: readonly string[],
): string | null {
  const view = TRIANGLE_VIEWS.find(
    (v) => v.node === node && courses.some((c) => v.course.startsWith(c)),
  );
  return view ? view.node : null;
}

/**
 * The bench scenario and question a node points at.
 *
 * Two lookups, in order. A scenario authored against the node is the direct
 * answer. Failing that, a POE item on the node hanging off somebody else's
 * scenario still is one: GEN2.BUFFER has no simulation of its own and is a
 * question asked about the weak-acid curve, so it opens that curve on that
 * question.
 */
export function benchSelectionFor(node: string): BenchSelection | null {
  const scenario = SCENARIOS.find((s) => s.node === node);
  if (scenario) {
    const item = POE_ITEMS.find(
      (i) => i.scenario === scenario.id && i.node === node,
    );
    return item
      ? { scenarioId: scenario.id, poeItemId: item.id }
      : { scenarioId: scenario.id };
  }
  const item = POE_ITEMS.find((i) => i.node === node);
  return item ? { scenarioId: item.scenario, poeItemId: item.id } : null;
}

/**
 * `triangleMode` is passed in rather than written as a literal so the generic
 * stays honest: a lab without a triangle mode could not call this at all.
 */
function resolve<M extends string>(
  groups: readonly DeepLinkGroup<M>[],
  courses: readonly string[],
  triangleMode: M,
  node: string | null | undefined,
): DeepLinkTarget<M> | null {
  if (!node) return null;
  const mode = modeFor(groups, node);
  if (mode) return { mode };
  const triangleNode = triangleNodeFor(node, courses);
  if (triangleNode) return { mode: triangleMode, triangleNode };
  return null;
}

/** Resolve a `?node=` for the organic lab. Null means leave it at its default. */
export function resolveMoleculesDeepLink(
  node: string | null | undefined,
): DeepLinkTarget<MoleculesMode> | null {
  return resolve(MOLECULES_DEEP_LINKS, MOLECULES_COURSES, 'triangle', node);
}

/** Resolve a `?node=` for the general chemistry lab. */
export function resolveGeneralDeepLink(
  node: string | null | undefined,
): DeepLinkTarget<GeneralMode> | null {
  const target = resolve(GENERAL_DEEP_LINKS, GENERAL_COURSES, 'triangle', node);
  // Only this lab has a bench, so the scenario lookup hangs off this resolver
  // rather than off the shared one.
  if (target?.mode === 'bench' && node) {
    const bench = benchSelectionFor(node);
    if (bench) target.bench = bench;
  }
  return target;
}

// ---------------------------------------------------------------------------
// Preselecting within a mode
// ---------------------------------------------------------------------------

/**
 * The first entry in a catalogue that names this node in its `teaches` list.
 *
 * Every catalogue the labs pick from -- molecules, VSEPR cases, lattices,
 * orbitals -- already carries the nodes it teaches, so the preselection needs
 * no second table to fall out of step with the first. Returns null rather than
 * a default, so the caller keeps whatever it already had selected.
 */
export function teachingKey<T extends { key: string; teaches: readonly string[] }>(
  items: readonly T[],
  node: string | null | undefined,
): string | null {
  if (!node) return null;
  const hit = items.find((i) => i.teaches.includes(node));
  return hit ? hit.key : null;
}

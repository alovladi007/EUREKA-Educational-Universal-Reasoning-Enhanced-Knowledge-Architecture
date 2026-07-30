/**
 * Types for the authored OCTET content the labs render.
 *
 * The values live in chemContent.ts, which is generated. These describe the
 * shape rather than the content, so the two can be checked against each other
 * at compile time.
 */

// ---------------------------------------------------------------------------
// Johnstone triangle
// ---------------------------------------------------------------------------

/**
 * One node seen at all three of Johnstone's levels.
 *
 * Johnstone, A. H. (1991), "Why is science difficult to learn? Things are
 * seldom what they seem", Journal of Computer Assisted Learning 7(2). The
 * argument is that chemistry is taught by moving between three
 * representations without ever saying that is what is happening, and that
 * novices lose the thread because nobody names which level they are on.
 *
 * `connector` is the load-bearing field. It names the ONE thing that is
 * identical across all three levels, which is the whole point of putting them
 * side by side. `caption` describes the particulate picture in words, and was
 * written when there was no artwork anywhere in the system: it is a scene
 * specification that had no renderer until now.
 */
export interface TriangleView {
  node: string;
  course: string;
  title: string;
  macroscopic: string;
  particulate: string;
  symbolic: string;
  connector: string;
  pitfall: string;
  katex: string;
  caption: string;
}

// ---------------------------------------------------------------------------
// Simulations
// ---------------------------------------------------------------------------

export interface TitrationPoint {
  /** Titrant volume added, mL. */
  v: number;
  ph: number;
}

export interface TitrationDerived {
  kind: 'titration';
  curve: TitrationPoint[];
  landmarks: {
    initial_pH: number;
    half_equivalence_pH: number;
    equivalence_pH: number;
    equivalence_volume_mL: number;
    past_equivalence_pH: number;
  };
}

export interface EquilibriumDerived {
  kind: 'equilibrium';
  result: {
    direction: string;
    extent: number;
    q_before: number;
    q_after: number;
    k: number;
    stressed: Record<string, number>;
    final: Record<string, number>;
  };
}

export type Derived = TitrationDerived | EquilibriumDerived;

export interface Scenario {
  id: string;
  kind: string;
  engineKey: string;
  title: string;
  description: string;
  stress: Record<string, number>;
  node: string;
  /**
   * What chem_core produced when this scenario was run, computed at export
   * time. The lab plots this rather than a curve anybody drew.
   */
  derived: Derived;
}

// ---------------------------------------------------------------------------
// Predict, observe, explain
// ---------------------------------------------------------------------------

export interface PoeOption {
  id: string;
  text: string;
  /** Set on every option except the key, so a wrong pick routes somewhere. */
  misconception: string | null;
  feedback: string;
}

export interface PoeItem {
  id: string;
  node: string;
  scenario: string;
  scenarioTitle: string;
  predictPrompt: string;
  predictOptions: PoeOption[];
  predictKey: string;
  observePrompt: string;
  explainPrompt: string;
  explainOptions: PoeOption[];
  explainKey: string;
  reflectionPrompt: string;
  /** Whether the answer key was checked against the simulation at export. */
  keyVerified: boolean;
  keyVerdict: string;
}

export type PoePhase = 'predict' | 'observe' | 'explain' | 'done';

// ---------------------------------------------------------------------------
// Spectroscopy
// ---------------------------------------------------------------------------

export interface MsFragment {
  mz: number;
  label: string;
  note: string;
}

export interface SpectrumSubject {
  key: string;
  name: string;
  smiles: string;
  /**
   * Protons per distinct environment, as a ratio. The LENGTH is the number of
   * 1H signals and comes from molecular symmetry via chem_core, not from
   * counting by eye.
   */
  environments: number[];
  signalCount: number;
  degreesUnsaturation: number | null;
  /** Names of the cited IR bands this structure should show. */
  irBands: string[];
  msFragments: MsFragment[];
}

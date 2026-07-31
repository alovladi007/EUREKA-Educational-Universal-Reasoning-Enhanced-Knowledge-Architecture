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
    source?: string;
  };
}

/**
 * Rate response to one change: a different concentration, temperature, or
 * activation barrier. `outcome` is the token the answer key is checked
 * against, derived by classifying the computed rate ratio.
 */
export interface KineticsDerived {
  kind: 'kinetics';
  result: {
    outcome: string;
    rate_before: number;
    rate_after: number;
    ratio: number;
    order: number;
    k_before: number;
    k_after: number;
    half_life_s: number;
    source?: string;
  };
}

/**
 * Pressure response to one change. Both the real and ideal pressures are
 * carried so the departure can be shown rather than asserted.
 */
export interface GasDerived {
  kind: 'gas';
  result: {
    outcome: string;
    pressure_before_bar: number;
    pressure_after_bar: number;
    ideal_before_bar: number;
    ideal_after_bar: number;
    ratio: number;
    departure_before: number;
    departure_after: number;
    rms_before_m_per_s: number;
    rms_after_m_per_s: number;
    source?: string;
  };
}

/**
 * Two gases compared at one temperature.
 *
 * `energy` and `speed` are separate fields because the whole teaching point is
 * that they come apart: equal temperature makes the energies equal and leaves
 * the speeds different.
 */
export interface GasComparisonDerived {
  kind: 'gas-comparison';
  result: {
    outcome: string;
    energy: string;
    speed: string;
    same_temperature: boolean;
    ke_a_J_per_mol: number;
    ke_b_J_per_mol: number;
    rms_a_m_per_s: number;
    rms_b_m_per_s: number;
    effusion_ratio_a_over_b: number;
    source?: string;
  };
}

export type Derived =
  | TitrationDerived
  | EquilibriumDerived
  | KineticsDerived
  | GasDerived
  | GasComparisonDerived;

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

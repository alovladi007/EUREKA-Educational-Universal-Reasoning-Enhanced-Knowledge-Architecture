/**
 * Shared types for the XR chemistry labs.
 *
 * Two labs consume these: Organic Chemistry 3D (/xr-labs/molecules) and
 * General Chemistry 3D (/xr-labs/general-chemistry). Both are built on the
 * same scene component so a learner who crosses between them is not learning
 * two viewers.
 *
 * The structural fields (pos, hyb, lp, sn, cip, aromatic, charge) are
 * generated from SMILES by scripts/gen_molecule_data.py rather than authored,
 * so they cannot drift from the chemistry they claim to show. The teaching
 * fields (name, geometry, polarity, teaches, facts) are authored.
 */

export type ElementSymbol =
  | 'H' | 'B' | 'C' | 'N' | 'O' | 'F'
  | 'Si' | 'P' | 'S' | 'Cl'
  | 'Br' | 'I' | 'Xe' | 'Se'
  | 'Na' | 'Mg' | 'Al' | 'K';

export interface Atom {
  el: ElementSymbol;
  /** Cartesian position in angstroms, centred on the molecular centroid. */
  pos: [number, number, number];
  /** Lone pairs, derived from the valence-electron count. */
  lp: number;
  /** Steric number: attached atoms + lone pairs. The VSEPR input. */
  sn: number;
  hyb?: string;
  aromatic?: boolean;
  charge?: number;
  /** CIP descriptor, present only on assigned stereocentres. */
  cip?: 'R' | 'S';
}

export interface Bond {
  a: number;
  b: number;
  /** 1, 2, 3, or 1.5 for a delocalised aromatic bond. */
  order: number;
}

export interface Molecule {
  key: string;
  name: string;
  smiles: string;
  formula: string;
  mass: number;
  geometry: string;
  polarity: string;
  /**
   * OCTET curriculum node codes this molecule serves. This is what makes the
   * lab course-aligned rather than a molecule zoo: the panel tells a learner
   * which lesson the thing on screen belongs to.
   */
  teaches: string[];
  facts: string[];
  atoms: Atom[];
  bonds: Bond[];
}

/** How the scene renders a molecule. */
export type RenderStyle = 'ball-and-stick' | 'space-filling' | 'wireframe';

/** Optional overlays, each tied to something the course teaches. */
export interface SceneOverlays {
  /** Lone pairs as translucent lobes. VSEPR shape vs electron geometry. */
  lonePairs: boolean;
  /** Per-bond dipole arrows plus the vector sum. */
  dipoles: boolean;
  /** Pi systems as the p-orbital lobes that make them. */
  piSystems: boolean;
  /** Element labels pinned to each atom. */
  labels: boolean;
  /** CIP R/S badges on stereocentres. */
  stereo: boolean;
}

export const DEFAULT_OVERLAYS: SceneOverlays = {
  lonePairs: false,
  dipoles: false,
  piSystems: false,
  labels: false,
  stereo: false,
};

/**
 * A measurement the learner took by clicking atoms: two atoms give a bond
 * length, three give an angle, four give a torsion. Values are read off the
 * computed geometry, so the UI labels them as computed.
 */
export interface Measurement {
  indices: number[];
  kind: 'distance' | 'angle' | 'torsion';
  value: number;
  unit: 'A' | 'deg';
}

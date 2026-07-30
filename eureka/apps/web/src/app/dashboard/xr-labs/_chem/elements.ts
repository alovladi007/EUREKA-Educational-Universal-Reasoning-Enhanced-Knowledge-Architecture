/**
 * Element reference data for the XR chemistry labs.
 *
 * Colours follow the CPK convention (Corey-Pauling-Koltun), which is what
 * every textbook, PyMOL, Jmol and PubChem use. A learner who has seen red
 * oxygen and blue nitrogen everywhere else should not have to relearn a
 * palette here.
 *
 * Radii are van der Waals radii in angstroms, from Bondi (1964) with the
 * later Rowland/Taylor revision for hydrogen. Space-filling mode draws these
 * at true scale relative to the bond lengths, so the "why does water pack
 * like that" question has a picture. Ball-and-stick scales them down by a
 * fixed factor, which is a drawing convention, not a claim about size.
 *
 * Electronegativity is the Pauling scale. The labs use it to compute bond
 * dipole directions and magnitudes for the polarity overlay, rather than
 * hard-coding which way each arrow points.
 */

import type { ElementSymbol } from './types';

export interface ElementInfo {
  name: string;
  /** CPK colour. */
  color: string;
  /** van der Waals radius in angstroms (Bondi 1964). */
  vdw: number;
  /** Pauling electronegativity. */
  en: number;
  /** Valence electrons, for the lone-pair arithmetic shown in the panel. */
  valence: number;
  blurb: string;
}

export const ELEMENTS: Record<ElementSymbol, ElementInfo> = {
  H: {
    name: 'Hydrogen', color: '#f5f5f5', vdw: 1.1, en: 2.2, valence: 1,
    blurb: 'One electron, one bond, no lone pairs. Terminal on almost every organic skeleton.',
  },
  B: {
    name: 'Boron', color: '#ffb5b5', vdw: 1.92, en: 2.04, valence: 3,
    blurb: 'Only three bonds and an empty p orbital: electron deficient, trigonal planar, a Lewis acid.',
  },
  C: {
    name: 'Carbon', color: '#3b3b42', vdw: 1.7, en: 2.55, valence: 4,
    blurb: 'Four valence electrons and no lone pairs. Hybridises sp3, sp2 or sp depending on how many groups it carries.',
  },
  N: {
    name: 'Nitrogen', color: '#2f52d4', vdw: 1.55, en: 3.04, valence: 5,
    blurb: 'Three bonds plus one lone pair in its neutral form. That lone pair is the base and the nucleophile.',
  },
  O: {
    name: 'Oxygen', color: '#d43a2f', vdw: 1.52, en: 3.44, valence: 6,
    blurb: 'Two bonds plus two lone pairs. Highly electronegative, so it is the usual source of polarity and hydrogen bonding.',
  },
  F: {
    name: 'Fluorine', color: '#8ce05a', vdw: 1.47, en: 3.98, valence: 7,
    blurb: 'The most electronegative element. One bond, three lone pairs, and it never expands its octet.',
  },
  Si: {
    name: 'Silicon', color: '#c8a06e', vdw: 2.1, en: 1.9, valence: 4,
    blurb: 'The heavier analogue of carbon: same four bonds, but longer and weaker, and willing to exceed an octet.',
  },
  P: {
    name: 'Phosphorus', color: '#ff8000', vdw: 1.8, en: 2.19, valence: 5,
    blurb: 'Third row, so it can hold more than eight electrons. That is how PCl5 exists and NCl5 does not.',
  },
  S: {
    name: 'Sulfur', color: '#e6c229', vdw: 1.8, en: 2.58, valence: 6,
    blurb: 'Bigger and more polarisable than oxygen. A better nucleophile, a weaker hydrogen-bond donor.',
  },
  Cl: {
    name: 'Chlorine', color: '#3fbf3f', vdw: 1.75, en: 3.16, valence: 7,
    blurb: 'One bond, three lone pairs. Electronegative enough to polarise a C-Cl bond and make a good leaving group as chloride.',
  },
  Br: {
    name: 'Bromine', color: '#a52a2a', vdw: 1.85, en: 2.96, valence: 7,
    blurb: 'Larger and more polarisable than chlorine, and a better leaving group for the same reason.',
  },
  I: {
    name: 'Iodine', color: '#8f3fbf', vdw: 1.98, en: 2.66, valence: 7,
    blurb: 'The largest common halogen: weakest C-X bond, best leaving group, most polarisable.',
  },
  Xe: {
    name: 'Xenon', color: '#40b7c4', vdw: 2.16, en: 2.6, valence: 8,
    blurb: 'A noble gas that does bond. XeF4 is the standard demonstration that the octet rule is a guideline, not a law.',
  },
  Se: {
    name: 'Selenium', color: '#ffa100', vdw: 1.9, en: 2.55, valence: 6,
    blurb: 'Below sulfur: same two-bond, two-lone-pair pattern, larger and more polarisable again.',
  },
  Na: {
    name: 'Sodium', color: '#ab5cf2', vdw: 2.27, en: 0.93, valence: 1,
    blurb: 'Gives its single valence electron away completely. In a lattice it is Na+, not a bonded atom.',
  },
  Mg: {
    name: 'Magnesium', color: '#8aff00', vdw: 1.73, en: 1.31, valence: 2,
    blurb: 'Loses two electrons to reach a noble-gas core. Mg2+ carries twice the charge in half the room, so its lattices are held harder.',
  },
  Al: {
    name: 'Aluminium', color: '#bfa6a6', vdw: 1.84, en: 1.61, valence: 3,
    blurb: 'Three valence electrons, and as AlCl3 an electron-deficient Lewis acid used to start Friedel-Crafts reactions.',
  },
  K: {
    name: 'Potassium', color: '#8f40d4', vdw: 2.75, en: 0.82, valence: 1,
    blurb: 'Larger than sodium and even more willing to lose its electron. Bigger ion, weaker lattice.',
  },
};

/** Ball-and-stick shrinks the van der Waals radius by this factor. */
export const BALL_SCALE = 0.28;

/**
 * Bond dipole magnitude proxy: the electronegativity difference. Not in
 * debye, and the labs never label it as such -- it sizes the arrow so a
 * learner can see that C-O outweighs C-H, which is the teaching point.
 * Anything below this cutoff is treated as a nonpolar bond and drawn without
 * an arrow, matching the usual textbook threshold.
 */
export const NONPOLAR_CUTOFF = 0.4;

export function electronegativityGap(a: ElementSymbol, b: ElementSymbol): number {
  return Math.abs(ELEMENTS[a].en - ELEMENTS[b].en);
}

/** Which element of a bonded pair pulls electron density toward itself. */
export function moreElectronegative(
  a: ElementSymbol,
  b: ElementSymbol,
): ElementSymbol {
  return ELEMENTS[a].en >= ELEMENTS[b].en ? a : b;
}

/**
 * The VSEPR table, keyed by steric number and lone-pair count.
 *
 * This is the whole of VSEPR as a lookup, which is deliberate: the labs teach
 * that the shape follows from counting, so the counting has to be visible and
 * the answer has to come out of the count rather than out of the molecule's
 * name. `electron` is the electron-domain geometry (where everything is,
 * including lone pairs); `molecular` is the shape (where the atoms are).
 * Confusing those two is the single most common VSEPR error.
 */
export interface VseprEntry {
  electron: string;
  molecular: string;
  angle: string;
  hybrid: string;
  example: string;
}

export const VSEPR_TABLE: Record<string, VseprEntry> = {
  '2-0': { electron: 'Linear', molecular: 'Linear', angle: '180', hybrid: 'sp', example: 'CO2' },
  '3-0': { electron: 'Trigonal planar', molecular: 'Trigonal planar', angle: '120', hybrid: 'sp2', example: 'BF3' },
  '3-1': { electron: 'Trigonal planar', molecular: 'Bent', angle: '<120', hybrid: 'sp2', example: 'SO2' },
  '4-0': { electron: 'Tetrahedral', molecular: 'Tetrahedral', angle: '109.5', hybrid: 'sp3', example: 'CH4' },
  '4-1': { electron: 'Tetrahedral', molecular: 'Trigonal pyramidal', angle: '~107', hybrid: 'sp3', example: 'NH3' },
  '4-2': { electron: 'Tetrahedral', molecular: 'Bent', angle: '~104.5', hybrid: 'sp3', example: 'H2O' },
  '5-0': { electron: 'Trigonal bipyramidal', molecular: 'Trigonal bipyramidal', angle: '120 and 90', hybrid: 'sp3d', example: 'PCl5' },
  '5-1': { electron: 'Trigonal bipyramidal', molecular: 'Seesaw', angle: '<120, <90', hybrid: 'sp3d', example: 'SF4' },
  '5-2': { electron: 'Trigonal bipyramidal', molecular: 'T-shaped', angle: '<90', hybrid: 'sp3d', example: 'ClF3' },
  '5-3': { electron: 'Trigonal bipyramidal', molecular: 'Linear', angle: '180', hybrid: 'sp3d', example: 'XeF2' },
  '6-0': { electron: 'Octahedral', molecular: 'Octahedral', angle: '90', hybrid: 'sp3d2', example: 'SF6' },
  '6-1': { electron: 'Octahedral', molecular: 'Square pyramidal', angle: '<90', hybrid: 'sp3d2', example: 'BrF5' },
  '6-2': { electron: 'Octahedral', molecular: 'Square planar', angle: '90', hybrid: 'sp3d2', example: 'XeF4' },
};

export function vsepr(steric: number, lonePairs: number): VseprEntry | null {
  return VSEPR_TABLE[`${steric}-${lonePairs}`] ?? null;
}

/**
 * Parametric molecular geometry for the interactive modes.
 *
 * The static library in moleculeData.ts is one fixed conformer per molecule,
 * which is right for reading shape but useless for the things the course
 * teaches as MOTION: rotation about a sigma bond, ring inversion, and how a
 * VSEPR shape follows from a count. Those need geometry that is a function of
 * a parameter, so they are built here from exact math instead.
 *
 * Everything in this file is IDEALISED: exact tetrahedral angles, exact bond
 * lengths, exact ring symmetry. That is the point. A learner studying why a
 * chair is strain free should see the textbook chair, not a slightly relaxed
 * MMFF one. The labs label these views as idealised, and where the course
 * cites an experimental energy the cited number is what is displayed.
 */

import type { Atom, Bond, Molecule } from './types';

const DEG = Math.PI / 180;

/** Tetrahedral angle, exactly. */
export const TETRAHEDRAL = 109.4712206;

type Vec = [number, number, number];

function add(a: Vec, b: Vec): Vec {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function scale(a: Vec, k: number): Vec {
  return [a[0] * k, a[1] * k, a[2] * k];
}
function sub(a: Vec, b: Vec): Vec {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function norm(a: Vec): Vec {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
}
function cross(a: Vec, b: Vec): Vec {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function dot(a: Vec, b: Vec): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

const C_C = 1.54;
const C_H = 1.09;

// ===========================================================================
// Torsional modes (Newman projections)
// ===========================================================================

export type TorsionKind = 'ethane' | 'butane';

/**
 * Torsional strain as a function of the dihedral angle, in kJ/mol.
 *
 * Both curves are three-term torsional potentials whose coefficients were
 * solved so that the curve passes exactly through the stationary-point
 * energies the course cites. They are a smooth interpolation between cited
 * values, not an independent calculation, and the UI says so.
 *
 * Ethane (cited): 12 kJ/mol barrier, staggered minima at 60/180/300.
 *   V = 6(1 + cos 3phi) gives V(0) = 12 and V(60) = 0 exactly.
 *
 * Butane (cited): anti 0, gauche 3.8, methyl-H eclipsed 16, methyl-methyl
 * eclipsed 19, all in kJ/mol, with phi measured C1-C2-C3-C4 so that anti is
 * 180 degrees.
 *   V = A(1 + cos phi) + B(1 - cos 2phi) + C(1 + cos 3phi)
 *   with A = 2.2667, B = 0.2667, C = 7.2333 the curve reproduces all four.
 */
export function torsionEnergy(kind: TorsionKind, phiDeg: number): number {
  const p = phiDeg * DEG;
  if (kind === 'ethane') {
    return 6 * (1 + Math.cos(3 * p));
  }
  const A = 2.2667;
  const B = 0.2667;
  const C = 7.2333;
  return (
    A * (1 + Math.cos(p)) +
    B * (1 - Math.cos(2 * p)) +
    C * (1 + Math.cos(3 * p))
  );
}

/** What the conformer at this dihedral is called, and why it costs what it does. */
export function torsionLabel(
  kind: TorsionKind,
  phiDeg: number,
): { name: string; note: string } {
  const p = ((phiDeg % 360) + 360) % 360;
  // Shortest way round the circle between p and target. Written out rather
  // than folded into one modular expression because the compact version of
  // this was wrong by exactly 180 degrees, which labelled anti as syn: it
  // told the learner the most stable conformer was the least stable one.
  const near = (target: number, tol = 12) => {
    const raw = Math.abs(((p - target) % 360) + 360) % 360;
    return Math.min(raw, 360 - raw) <= tol;
  };

  if (kind === 'ethane') {
    if (near(0) || near(120) || near(240)) {
      return {
        name: 'Eclipsed',
        note: 'Front and back C-H bonds line up. Torsional strain is at its maximum, 12 kJ/mol above staggered.',
      };
    }
    if (near(60) || near(180) || near(300)) {
      return {
        name: 'Staggered',
        note: 'Back bonds sit in the gaps between the front ones. This is a minimum, and all three are identical.',
      };
    }
    return { name: 'Skew', note: 'Between a minimum and a maximum.' };
  }

  if (near(180)) {
    return {
      name: 'Anti',
      note: 'The two methyls are as far apart as they can get, 180 degrees. This is the global minimum.',
    };
  }
  if (near(60) || near(300)) {
    return {
      name: 'Gauche',
      note: 'Staggered, but the two methyls are only 60 degrees apart. Steric strain puts it 3.8 kJ/mol above anti.',
    };
  }
  if (near(0)) {
    return {
      name: 'Syn (methyl-methyl eclipsed)',
      note: 'The worst conformer: the two methyls eclipse each other. 19 kJ/mol above anti.',
    };
  }
  if (near(120) || near(240)) {
    return {
      name: 'Methyl-hydrogen eclipsed',
      note: 'Eclipsed, but methyl against hydrogen rather than methyl against methyl. 16 kJ/mol above anti.',
    };
  }
  return { name: 'Skew', note: 'Between a minimum and a maximum.' };
}

/**
 * Build ethane or butane with the central C-C dihedral set to phi.
 *
 * The front carbon sits at the origin and the back carbon along +z, which is
 * exactly the Newman viewpoint: look down the z axis and the front atom hides
 * the back one.
 */
export function torsionMolecule(kind: TorsionKind, phiDeg: number): Molecule {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];

  const front: Vec = [0, 0, 0];
  const back: Vec = [0, 0, C_C];
  atoms.push({ el: 'C', pos: front, lp: 0, sn: 4, hyb: 'sp3' });
  atoms.push({ el: 'C', pos: back, lp: 0, sn: 4, hyb: 'sp3' });
  bonds.push({ a: 0, b: 1, order: 1 });

  // Substituents sit on a cone about the C-C axis. The half angle is
  // 180 - 109.47 measured from the far direction, i.e. they lean away from
  // the other carbon by the tetrahedral angle.
  const lean = (180 - TETRAHEDRAL) * DEG;

  const place = (
    origin: Vec,
    axisSign: number,
    baseAngle: number,
    el: 'H' | 'C',
  ): number => {
    const a = baseAngle * DEG;
    const r = Math.sin(lean);
    const z = Math.cos(lean) * axisSign;
    const len = el === 'C' ? C_C : C_H;
    const dir: Vec = [Math.cos(a) * r, Math.sin(a) * r, z];
    atoms.push({
      el,
      pos: add(origin, scale(dir, len)),
      lp: 0,
      sn: el === 'C' ? 4 : 1,
      ...(el === 'C' ? { hyb: 'sp3' } : {}),
    });
    return atoms.length - 1;
  };

  // Front carbon: its three substituents are fixed and define phi = 0 at the
  // top of the circle.
  const frontSubs: ('H' | 'C')[] =
    kind === 'butane' ? ['C', 'H', 'H'] : ['H', 'H', 'H'];
  const frontIdx = frontSubs.map((el, i) => place(front, -1, 90 + i * 120, el));

  // Back carbon: rotated by phi. The sign is negative because the two
  // carbons face opposite ways down the axis, so a positive turn of the back
  // atom in its own frame reads as a negative dihedral when measured
  // front-to-back. Getting this backwards makes the readout disagree with the
  // model it is describing.
  const backSubs: ('H' | 'C')[] =
    kind === 'butane' ? ['C', 'H', 'H'] : ['H', 'H', 'H'];
  const backIdx = backSubs.map((el, i) =>
    place(back, +1, 90 - phiDeg + i * 120, el),
  );

  frontIdx.forEach((i) => bonds.push({ a: 0, b: i, order: 1 }));
  backIdx.forEach((i) => bonds.push({ a: 1, b: i, order: 1 }));

  // Cap the butane methyls with hydrogens so they read as methyls rather
  // than bare carbons.
  if (kind === 'butane') {
    [frontIdx[0], backIdx[0]].forEach((ci) => {
      const anchor = ci === frontIdx[0] ? front : back;
      const axis = norm(sub(atoms[ci].pos, anchor));
      // Any two vectors perpendicular to the methyl axis.
      let ref: Vec = Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
      const u = norm(cross(axis, ref));
      const w = cross(axis, u);
      for (let k = 0; k < 3; k += 1) {
        const t = (k * 120 + 30) * DEG;
        const radial = add(scale(u, Math.cos(t)), scale(w, Math.sin(t)));
        const dir = norm(
          add(scale(axis, Math.cos(lean)), scale(radial, Math.sin(lean))),
        );
        atoms.push({ el: 'H', pos: add(atoms[ci].pos, scale(dir, C_H)), lp: 0, sn: 1 });
        bonds.push({ a: ci, b: atoms.length - 1, order: 1 });
      }
    });
  }

  const isButane = kind === 'butane';
  return {
    key: `${kind}-torsion`,
    name: isButane ? 'Butane' : 'Ethane',
    smiles: isButane ? 'CCCC' : 'CC',
    formula: isButane ? 'C4H10' : 'C2H6',
    mass: isButane ? 58.12 : 30.07,
    geometry: 'Idealised tetrahedral, dihedral under your control',
    polarity: 'Nonpolar',
    teaches: ['ORG1.NEWMAN'],
    facts: [],
    atoms,
    bonds,
  };
}

// ===========================================================================
// Cyclohexane chair
// ===========================================================================

/**
 * A cyclohexane ring, puckered by `pucker`.
 *
 * pucker = +1 is one chair, -1 is the other, 0 is the flat ring. Animating
 * from +1 to -1 runs a ring inversion.
 *
 * The path through pucker = 0 is a SIMPLIFICATION, and the lab says so. The
 * real inversion goes through a half-chair transition state and a twist-boat
 * intermediate, over a barrier of about 45 kJ/mol; a planar ring is not on the
 * real path at all. What this animation is faithful about is the thing the
 * course cares about: every axial bond becomes equatorial and every equatorial
 * becomes axial, while nothing moves from one face of the ring to the other.
 *
 * Ring geometry is solved rather than typed. With ring atoms at radius R and
 * alternating height +/- d, the C-C distance is sqrt(R^2 + 4d^2), so R is
 * chosen to hold that at 1.54 A for whatever d the pucker gives.
 */
export interface ChairResult {
  molecule: Molecule;
  /** Indices of the six axial hydrogens (or the substituent). */
  axial: number[];
  /** Indices of the six equatorial hydrogens. */
  equatorial: number[];
  /** Index of the substituted ring carbon, if any. */
  substitutedCarbon: number | null;
}

export function cyclohexaneChair(
  pucker: number,
  substituent: 'none' | 'methyl' | 'tert-butyl' = 'none',
  /**
   * Which side of the ring the substituent sits on, +1 or -1.
   *
   * A substituent is bonded to one face of the ring and stays there. Whether
   * that bond is called axial or equatorial is a fact about the current chair,
   * not about the molecule, and it is what the ring flip changes.
   */
  substituentFace: 1 | -1 = 1,
): ChairResult {
  const dMax = 0.25;
  const d = dMax * pucker;
  const R = Math.sqrt(Math.max(0.01, C_C * C_C - 4 * d * d));

  const atoms: Atom[] = [];
  const bonds: Bond[] = [];

  // Ring carbons.
  const ring: number[] = [];
  for (let i = 0; i < 6; i += 1) {
    const t = i * 60 * DEG;
    atoms.push({
      el: 'C',
      pos: [R * Math.cos(t), (i % 2 === 0 ? d : -d), R * Math.sin(t)],
      lp: 0,
      sn: 4,
      hyb: 'sp3',
    });
    ring.push(i);
  }
  for (let i = 0; i < 6; i += 1) {
    bonds.push({ a: i, b: (i + 1) % 6, order: 1 });
  }

  const axial: number[] = [];
  const equatorial: number[] = [];

  // For each ring carbon, the two exocyclic directions are fully determined by
  // its two ring neighbours: bisect them, then open to the tetrahedral angle
  // in the perpendicular plane. Nothing here is hand-placed.
  for (let i = 0; i < 6; i += 1) {
    const c = atoms[i].pos as Vec;
    const prev = atoms[(i + 5) % 6].pos as Vec;
    const next = atoms[(i + 1) % 6].pos as Vec;
    const n1 = norm(sub(prev, c));
    const n2 = norm(sub(next, c));

    const bisector = norm(scale(add(n1, n2), -1));
    let perp = cross(n1, n2);
    if (Math.hypot(...perp) < 1e-6) perp = [0, 1, 0];
    perp = norm(perp);

    const half = (TETRAHEDRAL / 2) * DEG;
    const dirA = norm(
      add(scale(bisector, Math.cos(half)), scale(perp, Math.sin(half))),
    );
    const dirB = norm(
      add(scale(bisector, Math.cos(half)), scale(perp, -Math.sin(half))),
    );

    // Axial is whichever points more nearly along the ring axis (y).
    const aIsAxial = Math.abs(dirA[1]) >= Math.abs(dirB[1]);
    const axDir = aIsAxial ? dirA : dirB;
    const eqDir = aIsAxial ? dirB : dirA;

    const subHere = substituent !== 'none' && i === 0;
    const subLen = C_C;

    if (subHere) {
      // The substituent is placed by which FACE of the ring it is on, not by
      // whether that position is currently called axial or equatorial.
      //
      // This matters, and getting it wrong inverts the lesson. Placing it
      // "equatorial" unconditionally means that when the ring inverts, the
      // group follows whichever direction has become equatorial -- so it
      // appears to jump to the other face of the ring. That is precisely the
      // belief the chair lesson exists to kill: a flip swaps axial and
      // equatorial and moves nothing between faces. Pinning the face instead
      // makes the model do what the chemistry does, and the group converts
      // from equatorial to axial on its own.
      const subDir = Math.sign(axDir[1]) === substituentFace ? axDir : eqDir;
      const hDir = subDir === axDir ? eqDir : axDir;
      const subIsAxial = subDir === axDir;

      atoms.push({ el: 'C', pos: add(c, scale(subDir, subLen)), lp: 0, sn: 4, hyb: 'sp3' });
      const subIdx = atoms.length - 1;
      bonds.push({ a: i, b: subIdx, order: 1 });
      (subIsAxial ? axial : equatorial).push(subIdx);

      if (substituent === 'tert-butyl') {
        // Three methyls on the quaternary carbon.
        const axis = norm(sub(atoms[subIdx].pos as Vec, c));
        const ref: Vec = Math.abs(axis[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
        const u = norm(cross(axis, ref));
        const w = cross(axis, u);
        const lean = (180 - TETRAHEDRAL) * DEG;
        for (let k = 0; k < 3; k += 1) {
          const t = k * 120 * DEG;
          const radial = add(scale(u, Math.cos(t)), scale(w, Math.sin(t)));
          const dir = norm(
            add(scale(axis, Math.cos(lean)), scale(radial, Math.sin(lean))),
          );
          atoms.push({
            el: 'C',
            pos: add(atoms[subIdx].pos as Vec, scale(dir, C_C)),
            lp: 0,
            sn: 4,
            hyb: 'sp3',
          });
          bonds.push({ a: subIdx, b: atoms.length - 1, order: 1 });
        }
      }

      // The geminal hydrogen takes whichever direction the substituent did
      // not. Placing it along axDir unconditionally put it on top of an axial
      // substituent, 0.45 A apart instead of 2.16, and left the axial and
      // equatorial index arrays wrong for this carbon.
      atoms.push({ el: 'H', pos: add(c, scale(hDir, C_H)), lp: 0, sn: 1 });
      bonds.push({ a: i, b: atoms.length - 1, order: 1 });
      (subIsAxial ? equatorial : axial).push(atoms.length - 1);
    } else {
      atoms.push({ el: 'H', pos: add(c, scale(axDir, C_H)), lp: 0, sn: 1 });
      bonds.push({ a: i, b: atoms.length - 1, order: 1 });
      axial.push(atoms.length - 1);

      atoms.push({ el: 'H', pos: add(c, scale(eqDir, C_H)), lp: 0, sn: 1 });
      bonds.push({ a: i, b: atoms.length - 1, order: 1 });
      equatorial.push(atoms.length - 1);
    }
  }

  const names: Record<string, string> = {
    none: 'Cyclohexane',
    methyl: 'Methylcyclohexane',
    'tert-butyl': 'tert-Butylcyclohexane',
  };

  return {
    molecule: {
      key: `chair-${substituent}`,
      name: names[substituent],
      smiles:
        substituent === 'none'
          ? 'C1CCCCC1'
          : substituent === 'methyl'
            ? 'CC1CCCCC1'
            : 'CC(C)(C)C1CCCCC1',
      formula:
        substituent === 'none'
          ? 'C6H12'
          : substituent === 'methyl'
            ? 'C7H14'
            : 'C10H20',
      mass: substituent === 'none' ? 84.16 : substituent === 'methyl' ? 98.19 : 140.27,
      geometry: 'Idealised chair',
      polarity: 'Nonpolar',
      teaches: ['ORG1.CHAIR', 'ORG1.AVALUES'],
      facts: [],
      atoms,
      bonds,
    },
    axial,
    equatorial,
    substitutedCarbon: substituent === 'none' ? null : 0,
  };
}

/**
 * A values: the free-energy preference for equatorial over axial, kJ/mol.
 * These are cited experimental values, not computed from the model geometry.
 */
export const A_VALUES: Record<string, { kj: number; kcal: number }> = {
  methyl: { kj: 7.3, kcal: 1.7 },
  'tert-butyl': { kj: 20.9, kcal: 5.0 },
};

/** Equatorial fraction at 298 K from an A value, via K = exp(dG/RT). */
export function equatorialPercent(kj: number): number {
  const RT = 2.4789; // kJ/mol at 298.15 K
  const K = Math.exp(kj / RT);
  return (100 * K) / (1 + K);
}

// ===========================================================================
// VSEPR shapes
// ===========================================================================

/**
 * Ideal electron-domain directions for a given steric number.
 *
 * Lone pairs are assigned to the positions VSEPR says they take: equatorial in
 * a trigonal bipyramid (where they have the most room, at 120 rather than 90
 * to their neighbours), and trans to each other in an octahedron. Those two
 * rules are why SF4 is a seesaw rather than a trigonal pyramid, and why XeF4
 * is square planar rather than a seesaw, so they are applied rather than
 * approximated.
 */
function domainDirections(steric: number): { dir: Vec; site: 'ax' | 'eq' | '' }[] {
  switch (steric) {
    case 2:
      return [
        { dir: [0, 1, 0], site: '' },
        { dir: [0, -1, 0], site: '' },
      ];
    case 3:
      return [0, 120, 240].map((a) => ({
        dir: [Math.cos(a * DEG), 0, Math.sin(a * DEG)] as Vec,
        site: '' as const,
      }));
    case 4: {
      const k = 1 / Math.sqrt(3);
      return [
        { dir: [k, k, k], site: '' },
        { dir: [k, -k, -k], site: '' },
        { dir: [-k, k, -k], site: '' },
        { dir: [-k, -k, k], site: '' },
      ];
    }
    case 5:
      return [
        { dir: [1, 0, 0], site: 'eq' },
        { dir: [Math.cos(120 * DEG), 0, Math.sin(120 * DEG)], site: 'eq' },
        { dir: [Math.cos(240 * DEG), 0, Math.sin(240 * DEG)], site: 'eq' },
        { dir: [0, 1, 0], site: 'ax' },
        { dir: [0, -1, 0], site: 'ax' },
      ];
    case 6:
      return [
        { dir: [1, 0, 0], site: '' },
        { dir: [-1, 0, 0], site: '' },
        { dir: [0, 1, 0], site: '' },
        { dir: [0, -1, 0], site: '' },
        { dir: [0, 0, 1], site: '' },
        { dir: [0, 0, -1], site: '' },
      ];
    default:
      return [];
  }
}

export interface VseprBuild {
  molecule: Molecule;
  /** Which domain indices ended up as lone pairs (for the overlay). */
  lonePairDirs: Vec[];
}

export function vseprMolecule(
  steric: number,
  lonePairs: number,
  centralEl: Atom['el'],
  ligandEl: Atom['el'],
  label: string,
): VseprBuild {
  const domains = domainDirections(steric);
  const bondLen = 1.6;

  // Choose which domains the lone pairs occupy.
  let lpIndices: number[] = [];
  if (steric === 5) {
    // Equatorial first: more room there.
    const eq = domains.map((d, i) => (d.site === 'eq' ? i : -1)).filter((i) => i >= 0);
    lpIndices = eq.slice(0, lonePairs);
  } else if (steric === 6 && lonePairs === 2) {
    // Trans, so they are as far apart as possible.
    lpIndices = [4, 5];
  } else {
    lpIndices = domains.map((_, i) => i).slice(0, lonePairs);
  }

  const atoms: Atom[] = [
    { el: centralEl, pos: [0, 0, 0], lp: lonePairs, sn: steric },
  ];
  const bonds: Bond[] = [];
  const lonePairDirs: Vec[] = [];

  domains.forEach((d, i) => {
    if (lpIndices.includes(i)) {
      lonePairDirs.push(norm(d.dir));
      return;
    }
    atoms.push({
      el: ligandEl,
      pos: scale(norm(d.dir), bondLen),
      lp: 3,
      sn: 4,
    });
    bonds.push({ a: 0, b: atoms.length - 1, order: 1 });
  });

  return {
    molecule: {
      key: `vsepr-${steric}-${lonePairs}`,
      name: label,
      smiles: '',
      formula: label,
      mass: 0,
      geometry: '',
      polarity: '',
      teaches: ['GEN1.VSEPR'],
      facts: [],
      atoms,
      bonds,
    },
    lonePairDirs,
  };
}

// ===========================================================================
// Measurement
// ===========================================================================

/** Distance in angstroms between two atoms. */
export function distance(a: Atom, b: Atom): number {
  return Math.hypot(a.pos[0] - b.pos[0], a.pos[1] - b.pos[1], a.pos[2] - b.pos[2]);
}

/** Angle in degrees at atom b, between a-b and c-b. */
export function angle(a: Atom, b: Atom, c: Atom): number {
  const u = norm(sub(a.pos as Vec, b.pos as Vec));
  const v = norm(sub(c.pos as Vec, b.pos as Vec));
  return (Math.acos(Math.max(-1, Math.min(1, dot(u, v)))) / DEG);
}

/** Torsion in degrees about the b-c bond, from a to d. */
export function torsion(a: Atom, b: Atom, c: Atom, d: Atom): number {
  const b1 = sub(b.pos as Vec, a.pos as Vec);
  const b2 = sub(c.pos as Vec, b.pos as Vec);
  const b3 = sub(d.pos as Vec, c.pos as Vec);
  const n1 = cross(b1, b2);
  const n2 = cross(b2, b3);
  const m = cross(n1, norm(b2));
  const x = dot(n1, n2);
  const y = dot(m, n2);
  return Math.atan2(y, x) / DEG;
}

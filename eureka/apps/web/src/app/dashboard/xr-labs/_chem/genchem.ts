/**
 * General-chemistry scene builders: the exact VSEPR catalogue, ionic
 * lattices, and hydrogen-target atomic orbitals.
 *
 * Everything here is built from exact geometry rather than from a force
 * field, and that is deliberate rather than a shortcut. Three of these
 * subjects cannot be produced any other way:
 *
 *   - The VSEPR catalogue is the ideal shape BY DEFINITION. A learner asking
 *     what octahedral means wants exactly 90 degrees, not a relaxed 89.4.
 *     RDKit could not have supplied these anyway: MMFF94 has no parameters
 *     for hypervalent sulfur or phosphorus, or for boron, and quietly returns
 *     the raw embedding, which is not the shape at all. See the note in
 *     scripts/gen_molecule_data.py.
 *   - A lattice has no molecules in it to optimise. That is the entire point
 *     of the lesson.
 *   - An orbital is a probability distribution, not a set of nuclei.
 */

import type { Atom, Bond, ElementSymbol, Molecule } from './types';
import { vseprMolecule } from './procedural';

// ===========================================================================
// The VSEPR catalogue
// ===========================================================================

export interface VseprCase {
  key: string;
  /** AXnEm label, the notation the course uses. */
  ax: string;
  name: string;
  formula: string;
  steric: number;
  lonePairs: number;
  central: ElementSymbol;
  ligand: ElementSymbol;
  /** OCTET nodes this case serves. Empty when the lab is going beyond them. */
  teaches: string[];
  facts: string[];
}

/**
 * Every shape a first-year course asks for, in steric-number order.
 *
 * A caveat worth being straight about: OCTET's GEN1.VSEPR lesson works
 * through AX2, AX3, AX4, AX3E and AX2E2 and its examples are CO2, H2O, NH3,
 * BF3, CH4, SF6 and PCl5. The seesaw, T-shaped, square-planar and
 * square-pyramidal cases below are standard first-year content but are NOT in
 * OCTET today, so they carry no node badge. The lab is extending the lesson
 * there rather than mirroring it, and it should not pretend otherwise.
 */
export const VSEPR_CASES: VseprCase[] = [
  {
    key: 'ax2', ax: 'AX2', name: 'Linear', formula: 'CO2', steric: 2, lonePairs: 0,
    central: 'C', ligand: 'O', teaches: ['GEN1.VSEPR'],
    facts: [
      'Two electron domains, no lone pairs. They get as far apart as possible: 180 degrees.',
      'A double bond counts as ONE domain. Domains are groups of electrons, not bonds, which is why CO2 is AX2 and not AX4.',
      'Both bonds are polar and the molecule is not, because the two dipoles point exactly opposite.',
    ],
  },
  {
    key: 'ax3', ax: 'AX3', name: 'Trigonal planar', formula: 'BF3', steric: 3, lonePairs: 0,
    central: 'B', ligand: 'F', teaches: ['GEN1.VSEPR', 'GEN1.OCTETEXCEPTIONS'],
    facts: [
      'Three domains spread into a flat triangle at exactly 120 degrees.',
      'Boron ends up with only six electrons. An incomplete octet, and a perfectly stable compound.',
      'The empty p orbital perpendicular to the plane is what makes BF3 a Lewis acid.',
      'B-F is intensely polar and BF3 has no dipole at all: three equal arrows at 120 degrees in one plane sum to zero.',
    ],
  },
  {
    key: 'ax2e', ax: 'AX2E', name: 'Bent (from trigonal planar)', formula: 'SO2', steric: 3, lonePairs: 1,
    central: 'S', ligand: 'O', teaches: ['GEN1.VSEPR'],
    facts: [
      'Three domains, one of them a lone pair. The electron geometry is still trigonal planar.',
      'The shape is bent, because shape names where the ATOMS are.',
      'The lone pair pushes harder than a bonding pair, so the angle drops a little below 120.',
    ],
  },
  {
    key: 'ax4', ax: 'AX4', name: 'Tetrahedral', formula: 'CH4', steric: 4, lonePairs: 0,
    central: 'C', ligand: 'H', teaches: ['GEN1.VSEPR', 'GEN1.HYBRIDIZATION'],
    facts: [
      'Four domains, no lone pairs: the undistorted tetrahedron at 109.47 degrees.',
      'This is the reference angle everything else in the four-domain family is measured against.',
    ],
  },
  {
    key: 'ax3e', ax: 'AX3E', name: 'Trigonal pyramidal', formula: 'NH3', steric: 4, lonePairs: 1,
    central: 'N', ligand: 'H', teaches: ['GEN1.VSEPR'],
    facts: [
      'Four domains with one lone pair. Electron geometry tetrahedral, molecular shape pyramidal.',
      'One lone pair squeezes the bond angle from 109.5 to about 107.',
      'Switch the lone-pair overlay on and off: with it on the tetrahedron is obvious, with it off the pyramid looks arbitrary. That gap is the lesson.',
    ],
  },
  {
    key: 'ax2e2', ax: 'AX2E2', name: 'Bent (from tetrahedral)', formula: 'H2O', steric: 4, lonePairs: 2,
    central: 'O', ligand: 'H', teaches: ['GEN1.VSEPR', 'GEN1.POLARITY'],
    facts: [
      'Four domains, two of them lone pairs. Electron geometry tetrahedral, shape bent.',
      'Two lone pairs squeeze harder than ammonia one: 104.5 degrees against 107.',
      'Compare with CO2. Both have a central atom with two atoms attached, and they could not behave less alike. The domains no formula shows are what decide it.',
    ],
  },
  {
    key: 'ax5', ax: 'AX5', name: 'Trigonal bipyramidal', formula: 'PCl5', steric: 5, lonePairs: 0,
    central: 'P', ligand: 'Cl', teaches: ['GEN1.VSEPR', 'GEN1.OCTETEXCEPTIONS'],
    facts: [
      'Five domains, and the only common geometry with two different bond angles: 120 within the equatorial triangle, 90 from equatorial to axial.',
      'Ten electrons around phosphorus. Third-row atoms can exceed an octet; second-row atoms cannot, which is why PCl5 exists and NCl5 does not.',
      'The two axial positions are more crowded, so axial bonds run slightly longer than equatorial ones.',
    ],
  },
  {
    key: 'ax4e', ax: 'AX4E', name: 'Seesaw', formula: 'SF4', steric: 5, lonePairs: 1,
    central: 'S', ligand: 'F', teaches: [],
    facts: [
      'The lone pair takes an EQUATORIAL position, not an axial one. Equatorial neighbours sit at 120 degrees while axial ones would sit at 90, so a fat lone pair has more room there.',
      'That single placement rule is why the shape is a seesaw rather than a trigonal pyramid.',
      'Turn on the lone-pair overlay to see the position it claimed.',
    ],
  },
  {
    key: 'ax3e2', ax: 'AX3E2', name: 'T-shaped', formula: 'ClF3', steric: 5, lonePairs: 2,
    central: 'Cl', ligand: 'F', teaches: [],
    facts: [
      'Both lone pairs go equatorial, for the same reason the single one did in SF4.',
      'That leaves the two axial bonds and one equatorial bond: a T.',
      'Three atoms attached and it is not trigonal planar. Counting atoms would have got this wrong.',
    ],
  },
  {
    key: 'ax6', ax: 'AX6', name: 'Octahedral', formula: 'SF6', steric: 6, lonePairs: 0,
    central: 'S', ligand: 'F', teaches: ['GEN1.VSEPR', 'GEN1.OCTETEXCEPTIONS'],
    facts: [
      'Six domains, every angle exactly 90 or 180 degrees. Twelve electrons around sulfur.',
      'Six identical bonds in full octahedral symmetry: no net dipole despite six polar bonds.',
      'So unreactive it is used as an electrical insulator, and a potent greenhouse gas for the same reason.',
    ],
  },
  {
    key: 'ax5e', ax: 'AX5E', name: 'Square pyramidal', formula: 'BrF5', steric: 6, lonePairs: 1,
    central: 'Br', ligand: 'F', teaches: [],
    facts: [
      'One lone pair takes one of the six octahedral positions, leaving a square base and one apex.',
      'The lone pair pushes the four basal bonds down slightly, so the angles fall just under 90.',
    ],
  },
  {
    key: 'ax4e2', ax: 'AX4E2', name: 'Square planar', formula: 'XeF4', steric: 6, lonePairs: 2,
    central: 'Xe', ligand: 'F', teaches: [],
    facts: [
      'The two lone pairs go TRANS to each other, as far apart as an octahedron allows.',
      'That leaves four bonds in a perfect square in the plane between them.',
      'A noble gas in a stable compound, and the standard demonstration that the octet rule is a guideline rather than a law.',
    ],
  },
];

export function buildVsepr(c: VseprCase): { molecule: Molecule; lonePairDirs: [number, number, number][] } {
  const built = vseprMolecule(c.steric, c.lonePairs, c.central, c.ligand, c.formula);
  return {
    molecule: {
      ...built.molecule,
      key: c.key,
      name: `${c.name} (${c.ax})`,
      formula: c.formula,
      geometry: `${c.name}, ${c.steric} domains, ${c.lonePairs} lone pair${c.lonePairs === 1 ? '' : 's'}`,
      teaches: c.teaches,
      facts: c.facts,
    },
    lonePairDirs: built.lonePairDirs,
  };
}

// ===========================================================================
// Ionic lattices
// ===========================================================================

export interface LatticeSpec {
  key: string;
  name: string;
  formula: string;
  /** Cation and anion symbols, for colour and radius. */
  cation: ElementSymbol;
  anion: ElementSymbol;
  /** Ionic radii in angstroms (Shannon), so the size contrast is real. */
  cationRadius: number;
  anionRadius: number;
  /** Lattice parameter in angstroms. */
  a: number;
  type: 'rock-salt' | 'caesium-chloride';
  teaches: string[];
  facts: string[];
}

export const LATTICES: LatticeSpec[] = [
  {
    key: 'nacl',
    name: 'Sodium chloride',
    formula: 'NaCl',
    cation: 'Na',
    anion: 'Cl',
    cationRadius: 1.02,
    anionRadius: 1.81,
    a: 5.64,
    type: 'rock-salt',
    teaches: ['GEN1.IONICBOND', 'GEN1.NOMENIONIC', 'GEN1.SOLIDTYPES'],
    facts: [
      'There is no NaCl molecule anywhere in this picture. Try to draw a circle around one sodium and one chloride and call it a unit: you cannot do it without cutting bonds that are the same as all the others.',
      'Every sodium touches six chlorides and every chloride touches six sodiums. The formula NaCl states a RATIO, not a particle.',
      'This is OCTET misconception GEN1M03, ionic compounds pictured as molecules.',
      'Melting means overcoming the whole electrostatic network at once, which is why NaCl melts at 801 C while a molecular solid of similar mass melts far below room temperature.',
      'Chloride is much larger than sodium: 1.81 A against 1.02 A. The anion gained an electron and the cation lost one.',
    ],
  },
  {
    key: 'cscl',
    name: 'Caesium chloride',
    formula: 'CsCl',
    cation: 'K', // stands in for caesium: the labs' element table stops at K
    anion: 'Cl',
    cationRadius: 1.67,
    anionRadius: 1.81,
    a: 4.12,
    type: 'caesium-chloride',
    teaches: ['GEN1.IONICBOND', 'GEN1.SOLIDTYPES'],
    facts: [
      'A different packing from rock salt: each ion sits at the centre of a cube of eight of the other kind, so the coordination number is 8 rather than 6.',
      'The cation here is nearly as large as the anion, and that size ratio is what selects the packing. Geometry decides the structure.',
      'Still no molecules. The same argument as sodium chloride applies.',
      'Rendered with a potassium-coloured sphere: the labs carry no caesium in their element table, and the point being made is about packing rather than about caesium.',
    ],
  },
];

/**
 * Build a lattice as a grid of ions.
 *
 * `cells` is how many unit cells to repeat along each axis. Two is enough to
 * show that the pattern continues and that no molecule can be cut out of it,
 * which is the whole argument.
 */
export function buildLattice(spec: LatticeSpec, cells = 2): Molecule {
  const atoms: Atom[] = [];
  const half = spec.a / 2;

  if (spec.type === 'rock-salt') {
    // Interpenetrating face-centred cubic: an ion sits at every point of a
    // simple cubic grid of spacing a/2, alternating by the parity of the sum
    // of its indices.
    const n = cells * 2;
    for (let i = 0; i <= n; i += 1) {
      for (let j = 0; j <= n; j += 1) {
        for (let k = 0; k <= n; k += 1) {
          const cation = (i + j + k) % 2 === 0;
          atoms.push({
            el: cation ? spec.cation : spec.anion,
            pos: [
              (i - n / 2) * half,
              (j - n / 2) * half,
              (k - n / 2) * half,
            ],
            lp: 0,
            sn: 6,
            charge: cation ? 1 : -1,
          });
        }
      }
    }
  } else {
    // Caesium chloride: a simple cubic array of anions with a cation at the
    // centre of every cube.
    for (let i = 0; i <= cells; i += 1) {
      for (let j = 0; j <= cells; j += 1) {
        for (let k = 0; k <= cells; k += 1) {
          atoms.push({
            el: spec.anion,
            pos: [
              (i - cells / 2) * spec.a,
              (j - cells / 2) * spec.a,
              (k - cells / 2) * spec.a,
            ],
            lp: 0,
            sn: 8,
            charge: -1,
          });
        }
      }
    }
    for (let i = 0; i < cells; i += 1) {
      for (let j = 0; j < cells; j += 1) {
        for (let k = 0; k < cells; k += 1) {
          atoms.push({
            el: spec.cation,
            pos: [
              (i - cells / 2 + 0.5) * spec.a,
              (j - cells / 2 + 0.5) * spec.a,
              (k - cells / 2 + 0.5) * spec.a,
            ],
            lp: 0,
            sn: 8,
            charge: 1,
          });
        }
      }
    }
  }

  // No bonds. That is the point: there are no molecules here, only a network
  // of electrostatic attraction, and drawing sticks would smuggle molecules
  // back into the picture the lesson is trying to remove them from.
  const bonds: Bond[] = [];

  return {
    key: spec.key,
    name: spec.name,
    smiles: '',
    formula: spec.formula,
    mass: 0,
    geometry: spec.type === 'rock-salt'
      ? 'Rock salt, 6:6 coordination'
      : 'Caesium chloride, 8:8 coordination',
    polarity: 'Ionic network',
    teaches: spec.teaches,
    facts: spec.facts,
    atoms,
    bonds,
  };
}

// ===========================================================================
// Atomic orbitals
// ===========================================================================

export interface OrbitalSpec {
  key: string;
  label: string;
  /** Number of angular lobes and their arrangement. */
  kind: 's' | 'p' | 'd-cloverleaf' | 'd-z2';
  n: number;
  /** Radial nodes, which show as concentric shells in an s orbital. */
  radialNodes: number;
  teaches: string[];
  facts: string[];
}

export const ORBITALS: OrbitalSpec[] = [
  {
    key: '1s', label: '1s', kind: 's', n: 1, radialNodes: 0,
    teaches: ['GEN1.QUANTUMMODEL', 'GEN1.QUANTUMNUMBERS'],
    facts: [
      'Spherical, and densest right at the nucleus.',
      'This is a region where the electron is LIKELY to be, not a path it travels. There is no orbit and no lap time.',
      'OCTET names the alternative belief GEN1M04, electron shells as planetary orbits.',
    ],
  },
  {
    key: '2s', label: '2s', kind: 's', n: 2, radialNodes: 1,
    teaches: ['GEN1.QUANTUMNUMBERS'],
    facts: [
      'Still spherical, but larger, and with one radial node: a shell where the probability falls to exactly zero.',
      'The electron is found inside that shell and outside it, and never at it. That is not something a particle on a track could do.',
    ],
  },
  {
    key: '2p', label: '2p', kind: 'p', n: 2, radialNodes: 0,
    teaches: ['GEN1.QUANTUMNUMBERS', 'GEN1.SIGMAPI'],
    facts: [
      'Two lobes with a nodal PLANE through the nucleus. The probability of finding the electron exactly in that plane is zero.',
      'Three of these exist per shell, along x, y and z, mutually perpendicular.',
      'These are the orbitals that make pi bonds, and the nodal plane is exactly why a pi bond stops a double bond from rotating.',
    ],
  },
  {
    key: '3d', label: '3d (cloverleaf)', kind: 'd-cloverleaf', n: 3, radialNodes: 0,
    teaches: ['GEN1.QUANTUMNUMBERS', 'GEN2.CRYSTALFIELD'],
    facts: [
      'Four lobes and two nodal planes. Four of the five d orbitals have this shape, in different orientations.',
      'How these lobes point relative to approaching ligands is what splits their energies in a complex, which is where transition-metal colour comes from.',
    ],
  },
  {
    key: '3dz2', label: '3d z-squared', kind: 'd-z2', n: 3, radialNodes: 0,
    teaches: ['GEN1.QUANTUMNUMBERS', 'GEN2.CRYSTALFIELD'],
    facts: [
      'The odd one out: two lobes along z plus a doughnut around the middle.',
      'It looks unlike the other four and is exactly degenerate with them in a free atom. Shape and energy are different questions.',
    ],
  },
];

/**
 * The exact hydrogenic radial wavefunction R(n,l,r), in Bohr radii with Z=1.
 *
 * These are the real closed forms, not an envelope shaped to look right. The
 * earlier version used exp(-r/a) multiplied by (r/a - k) once per radial node,
 * which puts nodes in roughly the correct places and gets the amplitudes and
 * the spacing wrong. Since the whole point of the orbital mode is that a node
 * is a surface where the probability is genuinely zero, an approximation that
 * merely has the right NUMBER of zeroes was teaching the shape of the idea
 * rather than the thing itself.
 *
 * Normalisation constants are omitted throughout: the cloud is produced by
 * rejection sampling, which only needs the density up to a constant factor.
 */
function radialWavefunction(n: number, l: number, r: number): number {
  const rho = r / n; // 2Zr/(n a0) folded into the standard forms below
  switch (`${n}${l}`) {
    case '10': // 1s
      return Math.exp(-r);
    case '20': // 2s: one radial node at r = 2
      return (2 - r) * Math.exp(-r / 2);
    case '21': // 2p: no radial node
      return r * Math.exp(-r / 2);
    case '30': // 3s: two radial nodes
      return (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3);
    case '31': // 3p
      return r * (6 - r) * Math.exp(-r / 3);
    case '32': // 3d: no radial node
      return r * r * Math.exp(-r / 3);
    default:
      // Nothing outside 1s..3d is offered by the lab, so an unknown
      // combination is a programming error rather than something to
      // approximate around.
      throw new Error(`no radial wavefunction for n=${n} l=${l} (rho ${rho})`);
  }
}

/** Real spherical harmonic, up to normalisation, for the shapes on offer. */
function angular(kind: OrbitalSpec['kind'], theta: number, phi: number): number {
  switch (kind) {
    case 's':
      return 1;
    case 'p':
      // p_z
      return Math.cos(theta);
    case 'd-cloverleaf':
      // d_xz
      return Math.sin(theta) * Math.cos(theta) * Math.cos(phi);
    case 'd-z2':
      return (3 * Math.cos(theta) ** 2 - 1) / 2;
    default:
      return 1;
  }
}

const L_OF_KIND: Record<OrbitalSpec['kind'], number> = {
  s: 0,
  p: 1,
  'd-cloverleaf': 2,
  'd-z2': 2,
};

/**
 * Point cloud for an orbital, sampled from the real hydrogenic wavefunction.
 *
 * Each point is one sample of the position probability density
 * |psi|^2 = |R(n,l,r)|^2 |Y(theta,phi)|^2, drawn by rejection sampling, so the
 * density of dots IS the probability density rather than standing in for it.
 * Radial nodes appear as genuinely empty shells because the wavefunction is
 * genuinely zero there, not because a factor was inserted to make a gap.
 *
 * The sign of psi is carried per point so the two phases can be drawn in
 * different colours. That is what makes constructive and destructive overlap
 * meaningful later, and it is a property of the wavefunction rather than a
 * decoration.
 */
export function orbitalPoints(
  spec: OrbitalSpec,
  count = 2600,
): { pos: [number, number, number]; sign: 1 | -1 }[] {
  const out: { pos: [number, number, number]; sign: 1 | -1 }[] = [];
  const l = L_OF_KIND[spec.kind];
  // Sample out to where the density has become negligible for this shell.
  const rMax = 4 + 6 * spec.n;

  // Deterministic sampling so the cloud does not shimmer between renders.
  let seed = 12345;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // Find a ceiling for the density so rejection sampling stays efficient and,
  // more importantly, unbiased: a guessed ceiling that is too low silently
  // truncates the tail.
  let peak = 0;
  for (let i = 1; i <= 600; i += 1) {
    const r = (i / 600) * rMax;
    const d = radialWavefunction(spec.n, l, r) ** 2 * r * r;
    if (d > peak) peak = d;
  }
  const angularPeak = spec.kind === 'd-cloverleaf' ? 0.5 : 1;
  const ceiling = peak * angularPeak * angularPeak * 1.05;

  let tries = 0;
  while (out.length < count && tries < count * 400) {
    tries += 1;
    // Uniform direction on the sphere, radius uniform in r with the r^2
    // Jacobian carried in the density below.
    const u = rnd() * 2 - 1;
    const theta = Math.acos(u);
    const phi = rnd() * Math.PI * 2;
    const r = rnd() * rMax;

    const R = radialWavefunction(spec.n, l, r);
    const Y = angular(spec.kind, theta, phi);
    const density = R * R * r * r * Y * Y;

    if (rnd() * ceiling < density) {
      const st = Math.sin(theta);
      // Scale into scene units. Bohr radii would make 3d fill the screen.
      const k = 0.42;
      out.push({
        pos: [
          r * st * Math.cos(phi) * k,
          r * Math.cos(theta) * k,
          r * st * Math.sin(phi) * k,
        ],
        sign: R * Y >= 0 ? 1 : -1,
      });
    }
  }
  return out;
}

// ===========================================================================
// Intermolecular forces
// ===========================================================================

/**
 * Two water molecules at hydrogen-bonding distance.
 *
 * Built rather than embedded because the teaching point is the relationship
 * between the two molecules: the O-H of one aimed at a lone pair of the
 * other, at about 2.8 A oxygen to oxygen, nearly linear through the hydrogen.
 * Those numbers are the lesson, so they are set rather than discovered.
 */
export function waterDimer(separation = 2.8): Molecule {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const OH = 0.96;
  const halfAngle = (104.5 / 2) * (Math.PI / 180);

  const addWater = (
    ox: number,
    oy: number,
    oz: number,
    yaw: number,
  ): number => {
    const oIdx = atoms.length;
    atoms.push({ el: 'O', pos: [ox, oy, oz], lp: 2, sn: 4, hyb: 'sp3' });
    for (const s of [1, -1]) {
      const a = yaw + s * halfAngle;
      atoms.push({
        el: 'H',
        pos: [ox + OH * Math.sin(a), oy + OH * Math.cos(a), oz],
        lp: 0,
        sn: 1,
      });
      bonds.push({ a: oIdx, b: atoms.length - 1, order: 1 });
    }
    return oIdx;
  };

  // Donor on the left with one O-H aimed right; acceptor on the right.
  addWater(-separation / 2, 0, 0, Math.PI / 2 - halfAngle);
  addWater(separation / 2, 0, 0, -Math.PI / 2);

  return {
    key: 'water-dimer',
    name: 'Water dimer',
    smiles: 'O.O',
    formula: '(H2O)2',
    mass: 36.03,
    geometry: `Hydrogen bonded, O to O ${separation.toFixed(2)} A`,
    polarity: 'Two polar molecules, hydrogen bonded',
    teaches: ['GEN1.IMF', 'GEN1.IMFPROPERTIES'],
    facts: [
      'The hydrogen bond is the dashed link: an O-H on one molecule aimed at a lone pair on the other.',
      'It is an attraction BETWEEN molecules, not a bond within one. OCTET names the alternative belief GEN1M12.',
      'About 20 kJ/mol, roughly a twentieth of the O-H covalent bond it sits next to. Strong for an intermolecular force, weak for a bond.',
      'Boiling breaks these and leaves every O-H intact. That is why water boils at 100 C without decomposing, and it is OCTET misconception GEN1M13.',
      'Each water can donate two hydrogen bonds and accept two, so liquid water is a network rather than a set of pairs.',
    ],
    atoms,
    bonds,
  };
}

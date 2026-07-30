/**
 * Geometry checks for the XR chemistry labs.
 *
 * These exist because the failure mode for this code is silent. A chair with
 * subtly wrong bond lengths, a torsion curve that misses the cited barrier, or
 * a lone pair placed axially in a trigonal bipyramid all render as a
 * confident, attractive picture that teaches the wrong thing. Nobody reviewing
 * a screenshot would catch any of them.
 *
 * So every claim the labs make in words is asserted here against the geometry
 * they actually draw.
 */

import { describe, expect, it } from 'vitest';

import {
  A_VALUES,
  TETRAHEDRAL,
  angle,
  cyclohexaneChair,
  distance,
  equatorialPercent,
  torsion,
  torsionEnergy,
  torsionLabel,
  torsionMolecule,
  vseprMolecule,
} from './procedural';
import { ORGANIC_MOLECULES } from './moleculeData';
import { ELEMENTS, vsepr } from './elements';
import type { ElementSymbol } from './types';

describe('torsional energy curves reproduce the cited stationary points', () => {
  // Ethane: 12 kJ/mol barrier, staggered minima. Cited in ORG1.NEWMAN.
  it('ethane eclipsed is 12 kJ/mol above staggered', () => {
    expect(torsionEnergy('ethane', 0)).toBeCloseTo(12, 6);
    expect(torsionEnergy('ethane', 120)).toBeCloseTo(12, 6);
    expect(torsionEnergy('ethane', 60)).toBeCloseTo(0, 6);
    expect(torsionEnergy('ethane', 180)).toBeCloseTo(0, 6);
  });

  // Butane: anti 0, gauche 3.8, Me-H eclipsed 16, Me-Me eclipsed 19.
  it('butane hits all four cited conformer energies', () => {
    expect(torsionEnergy('butane', 180)).toBeCloseTo(0, 2);
    expect(torsionEnergy('butane', 60)).toBeCloseTo(3.8, 2);
    expect(torsionEnergy('butane', 300)).toBeCloseTo(3.8, 2);
    expect(torsionEnergy('butane', 120)).toBeCloseTo(16, 2);
    expect(torsionEnergy('butane', 0)).toBeCloseTo(19, 2);
  });

  it('anti is the global minimum and syn the global maximum', () => {
    let lowest = Infinity;
    let highest = -Infinity;
    let lowAt = -1;
    let highAt = -1;
    for (let p = 0; p < 360; p += 1) {
      const e = torsionEnergy('butane', p);
      if (e < lowest) { lowest = e; lowAt = p; }
      if (e > highest) { highest = e; highAt = p; }
    }
    expect(lowAt).toBe(180);
    expect(highAt).toBe(0);
  });

  it('names the conformer the geometry actually is', () => {
    expect(torsionLabel('butane', 180).name).toBe('Anti');
    expect(torsionLabel('butane', 60).name).toBe('Gauche');
    expect(torsionLabel('butane', 0).name).toContain('Syn');
    expect(torsionLabel('ethane', 60).name).toBe('Staggered');
    expect(torsionLabel('ethane', 0).name).toBe('Eclipsed');
  });
});

describe('the Newman model draws the dihedral it was asked for', () => {
  it.each([0, 30, 60, 90, 120, 180, 240, 300])(
    'phi = %i degrees round-trips through the built geometry',
    (phi) => {
      const m = torsionMolecule('butane', phi);
      // 0 and 1 are the central carbons; 2 and 5 the two methyl carbons.
      const measured = torsion(m.atoms[2], m.atoms[0], m.atoms[1], m.atoms[5]);
      const wrapped = ((measured % 360) + 360) % 360;
      const target = ((phi % 360) + 360) % 360;
      const diff = Math.min(
        Math.abs(wrapped - target),
        360 - Math.abs(wrapped - target),
      );
      expect(diff).toBeLessThan(0.01);
    },
  );

  it('keeps every C-H bond at 1.09 A regardless of the dihedral', () => {
    const m = torsionMolecule('ethane', 37);
    m.bonds
      .filter((b) => m.atoms[b.a].el === 'H' || m.atoms[b.b].el === 'H')
      .forEach((b) => {
        expect(distance(m.atoms[b.a], m.atoms[b.b])).toBeCloseTo(1.09, 6);
      });
  });
});

describe('cyclohexane chair is solved, not hand placed', () => {
  const chair = cyclohexaneChair(1, 'none');

  it('holds every ring C-C bond at exactly 1.54 A', () => {
    for (let i = 0; i < 6; i += 1) {
      const d = distance(chair.molecule.atoms[i], chair.molecule.atoms[(i + 1) % 6]);
      expect(d).toBeCloseTo(1.54, 6);
    }
  });

  it('opens every exocyclic pair to the tetrahedral angle', () => {
    for (let i = 0; i < 6; i += 1) {
      const a = chair.molecule.atoms[chair.axial[i]];
      const e = chair.molecule.atoms[chair.equatorial[i]];
      expect(angle(a, chair.molecule.atoms[i], e)).toBeCloseTo(TETRAHEDRAL, 4);
    }
  });

  it('gives six axial and six equatorial positions', () => {
    expect(chair.axial).toHaveLength(6);
    expect(chair.equatorial).toHaveLength(6);
  });

  it('puts axial bonds along the ring axis and equatorial around the rim', () => {
    for (let i = 0; i < 6; i += 1) {
      const c = chair.molecule.atoms[i].pos;
      const ax = chair.molecule.atoms[chair.axial[i]].pos;
      const eq = chair.molecule.atoms[chair.equatorial[i]].pos;
      const axTilt = Math.abs(ax[1] - c[1]);
      const eqTilt = Math.abs(eq[1] - c[1]);
      // Axial must be markedly steeper, or the picture teaches nothing.
      expect(axTilt).toBeGreaterThan(eqTilt * 2);
    }
  });

  it('alternates ring carbons above and below the mean plane', () => {
    for (let i = 0; i < 6; i += 1) {
      const y = chair.molecule.atoms[i].pos[1];
      const next = chair.molecule.atoms[(i + 1) % 6].pos[1];
      expect(Math.sign(y)).toBe(-Math.sign(next));
    }
  });

  it('inverts every carbon to the opposite face on a ring flip', () => {
    const up = cyclohexaneChair(1, 'none');
    const down = cyclohexaneChair(-1, 'none');
    for (let i = 0; i < 6; i += 1) {
      expect(Math.sign(up.molecule.atoms[i].pos[1])).toBe(
        -Math.sign(down.molecule.atoms[i].pos[1]),
      );
    }
  });
});

describe('a substituent stays on its face through a ring flip', () => {
  // This is the exact claim the chair lesson makes and the POE item asks
  // about, so it is asserted rather than trusted. The builder used to place
  // the substituent "equatorial" unconditionally, which meant inverting the
  // ring moved it to the other face -- teaching the opposite of the lesson.
  const faceOf = (c: ReturnType<typeof cyclohexaneChair>) => {
    const ring = c.molecule.atoms[0];
    const sub = c.molecule.atoms.find(
      (a, i) => i > 5 && a.el === 'C' && Math.abs(a.pos[1] - ring.pos[1]) < 2,
    )!;
    return Math.sign(sub.pos[1] - ring.pos[1]);
  };

  it.each(['methyl', 'tert-butyl'] as const)(
    'keeps %s on the same side of the ring when the chair inverts',
    (sub) => {
      const up = cyclohexaneChair(1, sub);
      const down = cyclohexaneChair(-1, sub);
      expect(faceOf(up)).not.toBe(0);
      expect(faceOf(down)).toBe(faceOf(up));
    },
  );

  it('converts the substituent between axial and equatorial instead', () => {
    // Lean along the ring axis is what distinguishes axial from equatorial.
    const lean = (c: ReturnType<typeof cyclohexaneChair>) => {
      const ring = c.molecule.atoms[0];
      const sub = c.molecule.atoms.find(
        (a, i) => i > 5 && a.el === 'C' && Math.abs(a.pos[1] - ring.pos[1]) < 2,
      )!;
      return Math.abs(sub.pos[1] - ring.pos[1]);
    };
    const up = lean(cyclohexaneChair(1, 'methyl'));
    const down = lean(cyclohexaneChair(-1, 'methyl'));
    // One chair holds it steeply (axial), the other shallowly (equatorial).
    const steep = Math.max(up, down);
    const shallow = Math.min(up, down);
    expect(steep).toBeGreaterThan(shallow * 2);
  });

  it('honours an explicit face request', () => {
    const upper = cyclohexaneChair(1, 'methyl', 1);
    const lower = cyclohexaneChair(1, 'methyl', -1);
    expect(faceOf(upper)).toBe(-faceOf(lower));
  });

  it('never lets the substituent collide with its geminal hydrogen', () => {
    // Pinning the substituent to a face means it is axial in one chair, and
    // the hydrogen has to take the other direction. Leaving the hydrogen on
    // the axial vector unconditionally put the two 0.45 A apart -- physically
    // impossible, and completely invisible in a screenshot because the
    // hydrogen simply disappears inside the carbon.
    for (const sub of ['methyl', 'tert-butyl'] as const) {
      for (const face of [1, -1] as const) {
        for (const pucker of [1, -1, 0.5]) {
          const c = cyclohexaneChair(pucker, sub, face);
          const ring = c.molecule.atoms[0];
          const exo = c.molecule.bonds
            .filter((b) => (b.a === 0 || b.b === 0))
            .map((b) => (b.a === 0 ? b.b : b.a))
            .filter((i) => i !== 1 && i !== 5);
          expect(exo.length, `${sub} face ${face}`).toBe(2);
          const [p, q] = exo.map((i) => c.molecule.atoms[i]);
          expect(
            distance(p, q),
            `${sub} face ${face} pucker ${pucker}: exocyclic atoms overlap`,
          ).toBeGreaterThan(1.7);
          // Both must actually be bonded at a sane length to the ring carbon.
          expect(distance(ring, p)).toBeGreaterThan(0.9);
          expect(distance(ring, q)).toBeGreaterThan(0.9);
        }
      }
    }
  });

  it('reports the substituted carbon in exactly one of axial or equatorial', () => {
    for (const face of [1, -1] as const) {
      const c = cyclohexaneChair(1, 'methyl', face);
      // Six carbons, one exocyclic group each in either list, no double count.
      expect(c.axial).toHaveLength(6);
      expect(c.equatorial).toHaveLength(6);
      const all = [...c.axial, ...c.equatorial];
      expect(new Set(all).size, `face ${face}`).toBe(all.length);
    }
  });
});

describe('A values give the equilibrium the course cites', () => {
  it('puts methylcyclohexane about 95 percent equatorial at 298 K', () => {
    const pct = equatorialPercent(A_VALUES.methyl.kj);
    expect(pct).toBeGreaterThan(94);
    expect(pct).toBeLessThan(96);
  });

  it('makes tert-butyl essentially locked equatorial', () => {
    expect(equatorialPercent(A_VALUES['tert-butyl'].kj)).toBeGreaterThan(99.9);
  });

  it('is monotonic in the A value', () => {
    expect(equatorialPercent(20.9)).toBeGreaterThan(equatorialPercent(7.3));
  });
});

describe('VSEPR shapes come out at the ideal angles', () => {
  const at = (steric: number, lp: number) =>
    vseprMolecule(steric, lp, 'C', 'F', 'test');

  it('tetrahedral is 109.47', () => {
    const m = at(4, 0).molecule;
    expect(angle(m.atoms[1], m.atoms[0], m.atoms[2])).toBeCloseTo(TETRAHEDRAL, 4);
  });

  it('trigonal planar is 120 and flat', () => {
    const m = at(3, 0).molecule;
    expect(angle(m.atoms[1], m.atoms[0], m.atoms[2])).toBeCloseTo(120, 6);
    m.atoms.slice(1).forEach((a) => expect(a.pos[1]).toBeCloseTo(0, 6));
  });

  it('linear is 180', () => {
    const m = at(2, 0).molecule;
    expect(angle(m.atoms[1], m.atoms[0], m.atoms[2])).toBeCloseTo(180, 6);
  });

  it('octahedral has 90 degree cis and 180 degree trans pairs', () => {
    const m = at(6, 0).molecule;
    expect(angle(m.atoms[1], m.atoms[0], m.atoms[2])).toBeCloseTo(180, 6);
    expect(angle(m.atoms[1], m.atoms[0], m.atoms[3])).toBeCloseTo(90, 6);
  });
});

describe('lone pairs take the positions VSEPR says they take', () => {
  // Equatorial in a trigonal bipyramid: that is why SF4 is a seesaw.
  it('puts a trigonal-bipyramidal lone pair equatorial', () => {
    const sf4 = vseprMolecule(5, 1, 'S', 'F', 'SF4');
    expect(sf4.molecule.atoms).toHaveLength(5);
    expect(Math.abs(sf4.lonePairDirs[0][1])).toBeCloseTo(0, 6);
  });

  it('puts both ClF3 lone pairs equatorial, leaving a T shape', () => {
    const clf3 = vseprMolecule(5, 2, 'Cl', 'F', 'ClF3');
    expect(clf3.molecule.atoms).toHaveLength(4);
    clf3.lonePairDirs.forEach((d) => expect(Math.abs(d[1])).toBeCloseTo(0, 6));
  });

  // Trans in an octahedron: that is why XeF4 is square planar.
  it('puts the two octahedral lone pairs trans and leaves the rest coplanar', () => {
    const xef4 = vseprMolecule(6, 2, 'Xe', 'F', 'XeF4');
    const [d0, d1] = xef4.lonePairDirs;
    const dotp = d0[0] * d1[0] + d0[1] * d1[1] + d0[2] * d1[2];
    expect(dotp).toBeCloseTo(-1, 6);

    const ligands = xef4.molecule.atoms.slice(1);
    expect(ligands).toHaveLength(4);
    const spread =
      Math.max(...ligands.map((a) => a.pos[2])) -
      Math.min(...ligands.map((a) => a.pos[2]));
    expect(spread).toBeCloseTo(0, 6);
  });
});

describe('the VSEPR lookup and the built geometry agree', () => {
  it.each([
    [2, 0, 'Linear'],
    [3, 0, 'Trigonal planar'],
    [3, 1, 'Bent'],
    [4, 0, 'Tetrahedral'],
    [4, 1, 'Trigonal pyramidal'],
    [4, 2, 'Bent'],
    [5, 1, 'Seesaw'],
    [5, 2, 'T-shaped'],
    [6, 2, 'Square planar'],
  ])('steric %i with %i lone pairs is %s', (sn, lp, shape) => {
    expect(vsepr(sn, lp)?.molecular).toBe(shape);
    // The built molecule must carry exactly the ligands that shape implies.
    const built = vseprMolecule(sn, lp, 'C', 'F', 'x');
    expect(built.molecule.atoms.length - 1).toBe(sn - lp);
  });
});

describe('the generated molecule library is internally consistent', () => {
  it('has a unique key for every molecule', () => {
    const keys = ORGANIC_MOLECULES.map((m) => m.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('references only elements the labs can render', () => {
    ORGANIC_MOLECULES.forEach((m) => {
      m.atoms.forEach((a) => {
        expect(ELEMENTS[a.el as ElementSymbol], `${m.key} uses ${a.el}`).toBeDefined();
      });
    });
  });

  it('has in-range bond indices everywhere', () => {
    ORGANIC_MOLECULES.forEach((m) => {
      m.bonds.forEach((b) => {
        expect(b.a).toBeGreaterThanOrEqual(0);
        expect(b.b).toBeLessThan(m.atoms.length);
        expect(b.a).not.toBe(b.b);
      });
    });
  });

  it('keeps every bond length physically plausible', () => {
    // A generated conformer with a 4 A "bond" means the embedding failed and
    // the picture is nonsense. Nothing real here is outside 0.9 to 2.4 A.
    ORGANIC_MOLECULES.forEach((m) => {
      m.bonds.forEach((b) => {
        const d = distance(m.atoms[b.a], m.atoms[b.b]);
        expect(d, `${m.key} bond ${b.a}-${b.b}`).toBeGreaterThan(0.9);
        expect(d, `${m.key} bond ${b.a}-${b.b}`).toBeLessThan(2.4);
      });
    });
  });

  it('never lets two atoms occupy the same point', () => {
    ORGANIC_MOLECULES.forEach((m) => {
      for (let i = 0; i < m.atoms.length; i += 1) {
        for (let j = i + 1; j < m.atoms.length; j += 1) {
          expect(distance(m.atoms[i], m.atoms[j]), `${m.key} ${i}/${j}`)
            .toBeGreaterThan(0.5);
        }
      }
    });
  });

  it('gives every heavy atom a steric number its lone pairs agree with', () => {
    ORGANIC_MOLECULES.forEach((m) => {
      m.atoms.forEach((a, i) => {
        if (a.el === 'H') return;
        const degree = m.bonds.filter((b) => b.a === i || b.b === i).length;
        expect(a.sn, `${m.key} atom ${i} (${a.el})`).toBe(degree + a.lp);
      });
    });
  });

  it('assigns the stereochemistry the names claim', () => {
    const cip = (key: string) =>
      ORGANIC_MOLECULES.find((m) => m.key === key)!.atoms
        .map((a) => a.cip)
        .filter(Boolean);

    expect(cip('butan2ol_r')).toEqual(['R']);
    expect(cip('butan2ol_s')).toEqual(['S']);
    // meso: two stereocentres of opposite descriptor.
    expect(cip('tartaric_meso').sort()).toEqual(['R', 'S']);
    // L-alanine is (S).
    expect(cip('l_alanine')).toEqual(['S']);
    // beta-D-glucopyranose has five stereocentres.
    expect(cip('glucose_beta')).toHaveLength(5);
  });

  it('carries the formula RDKit derived, not a typed one', () => {
    const formula = (k: string) => ORGANIC_MOLECULES.find((m) => m.key === k)!.formula;
    expect(formula('methane')).toBe('CH4');
    expect(formula('benzene')).toBe('C6H6');
    expect(formula('caffeine')).toBe('C8H10N4O2');
    expect(formula('glucose_beta')).toBe('C6H12O6');
  });

  it('marks benzene fully aromatic with delocalised ring bonds', () => {
    const benzene = ORGANIC_MOLECULES.find((m) => m.key === 'benzene')!;
    expect(benzene.atoms.filter((a) => a.aromatic)).toHaveLength(6);
    const ringBonds = benzene.bonds.filter((b) => b.order === 1.5);
    expect(ringBonds).toHaveLength(6);
  });

  it('gives the glycine zwitterion balanced formal charges', () => {
    const g = ORGANIC_MOLECULES.find((m) => m.key === 'glycine_zwitterion')!;
    const total = g.atoms.reduce((s, a) => s + (a.charge ?? 0), 0);
    expect(total).toBe(0);
    expect(g.atoms.some((a) => a.charge === 1)).toBe(true);
    expect(g.atoms.some((a) => a.charge === -1)).toBe(true);
  });

  it('points every molecule at an OCTET curriculum node', () => {
    ORGANIC_MOLECULES.forEach((m) => {
      expect(m.teaches.length, m.key).toBeGreaterThan(0);
      m.teaches.forEach((code) => {
        expect(code, `${m.key}: ${code}`).toMatch(/^(ORG1|ORG2|GEN\d)\.[A-Z0-9]+$/);
      });
    });
  });

  it('shows the sp/sp2/sp3 series the hybridisation lesson is built on', () => {
    const hyb = (key: string) =>
      ORGANIC_MOLECULES.find((m) => m.key === key)!.atoms.find((a) => a.el === 'C')!.hyb;
    expect(hyb('ethane')).toBe('sp3');
    expect(hyb('ethene')).toBe('sp2');
    expect(hyb('ethyne')).toBe('sp');
  });

  it('reproduces the C-C bond-length trend as bond order rises', () => {
    const ccLength = (key: string) => {
      const m = ORGANIC_MOLECULES.find((x) => x.key === key)!;
      const b = m.bonds.find(
        (bond) => m.atoms[bond.a].el === 'C' && m.atoms[bond.b].el === 'C',
      )!;
      return distance(m.atoms[b.a], m.atoms[b.b]);
    };
    // The cited values are 154 / 134 / 120 pm. The generated conformer should
    // land near them and, more importantly, in the right order.
    const single = ccLength('ethane');
    const double = ccLength('ethene');
    const triple = ccLength('ethyne');
    expect(single).toBeGreaterThan(double);
    expect(double).toBeGreaterThan(triple);
    expect(single).toBeCloseTo(1.54, 1);
    expect(double).toBeCloseTo(1.34, 1);
    expect(triple).toBeCloseTo(1.20, 1);
  });
});

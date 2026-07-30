/**
 * Checks on the exported OCTET content and the orbital wavefunctions.
 *
 * The orbital tests carry the most weight. A point cloud that is roughly the
 * right shape looks completely convincing in a screenshot, so "it renders as
 * two lobes" is not evidence that the maths is right. These assert the
 * properties that distinguish a real hydrogenic wavefunction from a plausible
 * envelope: nodes in the correct PLACES, the correct number of them, and
 * orthogonality between phases.
 */

import { describe, expect, it } from 'vitest';

import {
  POE_ITEMS,
  SCENARIOS,
  SPECTRA,
  TRIANGLE_VIEWS,
} from './chemContent';
import { ORBITALS, VSEPR_CASES, buildLattice, LATTICES, orbitalPoints, waterDimer } from './genchem';
import { ORGANIC_MOLECULES } from './moleculeData';
import { distance } from './procedural';

describe('triangle views', () => {
  it('exports every view exactly once', () => {
    const nodes = TRIANGLE_VIEWS.map((v) => v.node);
    expect(new Set(nodes).size).toBe(nodes.length);
    // 18 general plus 13 ORG1 plus 13 ORG2.
    expect(nodes.length).toBe(44);
  });

  it('gives every view all three levels and a connector', () => {
    TRIANGLE_VIEWS.forEach((v) => {
      expect(v.macroscopic.length, v.node).toBeGreaterThan(40);
      expect(v.particulate.length, v.node).toBeGreaterThan(40);
      expect(v.symbolic.length, v.node).toBeGreaterThan(10);
      // The connector is the load-bearing field: it names the one thing that
      // is the same across all three. A view without it is just three
      // paragraphs side by side.
      expect(v.connector.length, v.node).toBeGreaterThan(40);
      expect(v.pitfall.length, v.node).toBeGreaterThan(40);
    });
  });

  it('gives every view a particulate caption to render from', () => {
    TRIANGLE_VIEWS.forEach((v) => {
      expect(v.caption.length, v.node).toBeGreaterThan(20);
    });
  });

  it('uses node codes from the four OCTET courses', () => {
    TRIANGLE_VIEWS.forEach((v) => {
      expect(v.node, v.node).toMatch(/^(GEN1|GEN2|ORG1|ORG2)\.[A-Z0-9]+$/);
    });
  });
});

describe('simulation scenarios', () => {
  it('carries a derived result for every scenario', () => {
    expect(SCENARIOS.length).toBe(4);
    SCENARIOS.forEach((s) => {
      expect(s.derived, s.id).toBeDefined();
      expect(['titration', 'equilibrium']).toContain(s.derived.kind);
    });
  });

  it('gives titrations a monotonic non-decreasing pH curve', () => {
    // Adding base to acid cannot lower the pH. A curve that dips would mean
    // the solver is wrong, and a dip is invisible on a small plot.
    SCENARIOS.filter((s) => s.derived.kind === 'titration').forEach((s) => {
      const { curve } = s.derived as { curve: { v: number; ph: number }[] };
      expect(curve.length).toBeGreaterThan(50);
      for (let i = 1; i < curve.length; i += 1) {
        expect(curve[i].ph, `${s.id} at ${curve[i].v} mL`).toBeGreaterThanOrEqual(
          curve[i - 1].ph - 1e-6,
        );
        expect(curve[i].v).toBeGreaterThan(curve[i - 1].v);
      }
    });
  });

  it('puts the weak-acid equivalence point above pH 7 and the strong one at 7', () => {
    const weak = SCENARIOS.find((s) => s.id === 'sim.titr.weak')!;
    const strong = SCENARIOS.find((s) => s.id === 'sim.titr.strong')!;
    const w = (weak.derived as { landmarks: { equivalence_pH: number } }).landmarks;
    const st = (strong.derived as { landmarks: { equivalence_pH: number } }).landmarks;
    // Acetate is a weak base, so the weak-acid equivalence point is basic.
    expect(w.equivalence_pH).toBeGreaterThan(7.5);
    // Strong acid with strong base leaves only spectator ions.
    expect(st.equivalence_pH).toBeCloseTo(7, 0);
  });

  it('shows the half-equivalence pH sitting at the pKa for the weak acid', () => {
    const weak = SCENARIOS.find((s) => s.id === 'sim.titr.weak')!;
    const { half_equivalence_pH } = (
      weak.derived as { landmarks: { half_equivalence_pH: number } }
    ).landmarks;
    // Ka for acetic acid is 1.75e-5, so pKa is 4.76.
    expect(half_equivalence_pH).toBeCloseTo(4.76, 1);
  });

  it('shifts forward when hydrogen is added and not at all for a catalyst', () => {
    const added = SCENARIOS.find((s) => s.id === 'sim.eq.add-h2')!;
    const cat = SCENARIOS.find((s) => s.id === 'sim.eq.catalyst')!;
    expect((added.derived as { result: { direction: string } }).result.direction).toBe(
      'forward',
    );
    // A catalyst changes no concentration, so the position cannot move.
    expect((cat.derived as { result: { direction: string } }).result.direction).toBe(
      'none',
    );
  });
});

describe('POE items', () => {
  it('has a verified key for every item', () => {
    expect(POE_ITEMS.length).toBe(4);
    POE_ITEMS.forEach((i) => {
      expect(i.keyVerified, `${i.id}: ${i.keyVerdict}`).toBe(true);
      expect(i.keyVerdict.length).toBeGreaterThan(10);
    });
  });

  it('keys an option that actually exists', () => {
    POE_ITEMS.forEach((i) => {
      expect(i.predictOptions.map((o) => o.id)).toContain(i.predictKey);
      expect(i.explainOptions.map((o) => o.id)).toContain(i.explainKey);
    });
  });

  it('routes every wrong option to a misconception', () => {
    // A bare "incorrect" teaches nothing. Every distractor should name the
    // belief it represents so the outcome can go somewhere.
    POE_ITEMS.forEach((i) => {
      i.predictOptions
        .filter((o) => o.id !== i.predictKey)
        .forEach((o) => {
          expect(o.misconception, `${i.id}/${o.id}`).toBeTruthy();
        });
    });
  });

  it('binds each item to a scenario that exists', () => {
    const ids = new Set(SCENARIOS.map((s) => s.id));
    POE_ITEMS.forEach((i) => expect(ids.has(i.scenario), i.id).toBe(true));
  });
});

describe('spectroscopy', () => {
  it('derives the 1H signal count from symmetry', () => {
    const byKey = Object.fromEntries(SPECTRA.map((s) => [s.key, s]));
    // Every proton equivalent: one signal.
    expect(byKey.methane.signalCount).toBe(1);
    expect(byKey.benzene.signalCount).toBe(1);
    // CH3, CH2 and OH are three different environments.
    expect(byKey.ethanol.signalCount).toBe(3);
    // Methyl and acid protons.
    expect(byKey.acetic_acid.signalCount).toBe(2);
    // The two methyls of acetone are equivalent by symmetry.
    expect(byKey.acetone.signalCount).toBe(1);
  });

  it('makes the integration ratio consistent with the signal count', () => {
    SPECTRA.forEach((s) => {
      expect(s.environments.length, s.key).toBe(s.signalCount);
      expect(s.environments.every((n) => n > 0), s.key).toBe(true);
    });
  });

  it('gets degrees of unsaturation right across the series', () => {
    const dou = (k: string) => SPECTRA.find((s) => s.key === k)!.degreesUnsaturation;
    expect(dou('ethane')).toBe(0);
    expect(dou('ethene')).toBe(1);
    expect(dou('ethyne')).toBe(2);
    // A ring plus three double bonds.
    expect(dou('benzene')).toBe(4);
  });

  it('only claims IR bands the structure can produce', () => {
    const byKey = Object.fromEntries(SPECTRA.map((s) => [s.key, s]));
    expect(byKey.ethanol.irBands).toContain('O-H (alcohol)');
    expect(byKey.ethane.irBands).not.toContain('O-H (alcohol)');
    expect(byKey.ethane.irBands).not.toContain('C=O');
    expect(byKey.acetone.irBands).toContain('C=O');
    expect(byKey.acetic_acid.irBands).toContain('O-H (carboxylic acid)');
    expect(byKey.ethyne.irBands).toContain('C#C');
  });

  it('starts every MS trace at the molecular ion', () => {
    SPECTRA.forEach((s) => {
      expect(s.msFragments[0].label, s.key).toContain('M+');
      // Fragments are losses, so nothing may be heavier than the parent.
      s.msFragments.slice(1).forEach((f) => {
        expect(f.mz, `${s.key} ${f.label}`).toBeLessThan(s.msFragments[0].mz);
      });
    });
  });

  it('pairs every spectrum with a molecule the lab can render', () => {
    const keys = new Set(ORGANIC_MOLECULES.map((m) => m.key));
    SPECTRA.forEach((s) => {
      expect(keys.has(s.key), `${s.key} has no 3D model`).toBe(true);
    });
  });
});

describe('hydrogenic orbitals', () => {
  const cloud = (key: string) =>
    orbitalPoints(ORBITALS.find((o) => o.key === key)!, 1500);
  const radius = (p: { pos: [number, number, number] }) =>
    Math.hypot(...p.pos);

  it('samples every offered orbital without starving', () => {
    ORBITALS.forEach((o) => {
      const pts = orbitalPoints(o, 800);
      // Rejection sampling that cannot reach its target means the density
      // ceiling is wrong and the tail is being silently truncated.
      expect(pts.length, o.key).toBe(800);
    });
  });

  it('makes 1s spherical and single phase', () => {
    const pts = cloud('1s');
    expect(pts.every((p) => p.sign === 1)).toBe(true);
    // No preferred direction: the mean position sits at the nucleus.
    const mean = pts.reduce((a, p) => a + p.pos[1], 0) / pts.length;
    expect(Math.abs(mean)).toBeLessThan(0.25);
  });

  it('puts a real radial node in 2s where the wavefunction vanishes', () => {
    // R(2,0) is proportional to (2 - r) exp(-r/2), which is exactly zero at
    // r = 2 Bohr radii. With the scene scale of 0.42 that lands at 0.84.
    const pts = cloud('2s');
    const nodeAt = 2 * 0.42;
    const inShell = pts.filter(
      (p) => Math.abs(radius(p) - nodeAt) < 0.06,
    ).length;
    const nearby = pts.filter(
      (p) => Math.abs(radius(p) - nodeAt) > 0.2 && Math.abs(radius(p) - nodeAt) < 0.5,
    ).length;
    // The shell at the node must be far emptier than its surroundings.
    expect(inShell).toBeLessThan(nearby * 0.25);
  });

  it('flips the sign of 2s across its radial node', () => {
    const pts = cloud('2s');
    const nodeAt = 2 * 0.42;
    const inner = pts.filter((p) => radius(p) < nodeAt - 0.1);
    const outer = pts.filter((p) => radius(p) > nodeAt + 0.1);
    expect(inner.length).toBeGreaterThan(20);
    expect(outer.length).toBeGreaterThan(20);
    // (2 - r) is positive inside and negative outside.
    expect(inner.every((p) => p.sign === 1)).toBe(true);
    expect(outer.every((p) => p.sign === -1)).toBe(true);
  });

  it('gives 1s no radial node at all', () => {
    const pts = cloud('1s');
    // exp(-r) never vanishes, so density falls off smoothly with no gap.
    for (let r = 0.2; r < 1.6; r += 0.2) {
      const shell = pts.filter((p) => Math.abs(radius(p) - r) < 0.1).length;
      expect(shell, `empty shell at r=${r}`).toBeGreaterThan(0);
    }
  });

  it('gives 2p a nodal plane and two opposite phases', () => {
    const pts = cloud('2p');
    // cos(theta) is zero in the xz plane, so y near zero must be empty.
    const inPlane = pts.filter((p) => Math.abs(p.pos[1]) < 0.12).length;
    expect(inPlane / pts.length).toBeLessThan(0.05);
    // Lobes above and below carry opposite sign.
    expect(pts.filter((p) => p.pos[1] > 0).every((p) => p.sign === 1)).toBe(true);
    expect(pts.filter((p) => p.pos[1] < 0).every((p) => p.sign === -1)).toBe(true);
  });

  it('gives the d cloverleaf four lobes with alternating phase', () => {
    const pts = cloud('3d');
    // d_xz: sign follows the product of x and y, so opposite quadrants match
    // and adjacent ones differ. That alternation is the whole reason phase is
    // tracked at all.
    const q = (sx: number, sy: number) =>
      pts.filter(
        (p) => Math.sign(p.pos[0]) === sx && Math.sign(p.pos[1]) === sy,
      );
    const pp = q(1, 1);
    const pm = q(1, -1);
    expect(pp.length).toBeGreaterThan(20);
    expect(pm.length).toBeGreaterThan(20);
    expect(pp.every((p) => p.sign === 1)).toBe(true);
    expect(pm.every((p) => p.sign === -1)).toBe(true);
  });

  it('gives 3d z-squared a positive cone and a negative belt', () => {
    const pts = cloud('3dz2');
    // (3cos^2 - 1)/2 is positive along z and negative around the equator.
    const alongAxis = pts.filter(
      (p) => Math.abs(p.pos[1]) / (Math.hypot(...p.pos) || 1) > 0.9,
    );
    const equator = pts.filter(
      (p) => Math.abs(p.pos[1]) / (Math.hypot(...p.pos) || 1) < 0.2,
    );
    expect(alongAxis.length).toBeGreaterThan(10);
    expect(equator.length).toBeGreaterThan(10);
    expect(alongAxis.every((p) => p.sign === 1)).toBe(true);
    expect(equator.every((p) => p.sign === -1)).toBe(true);
  });

  it('grows with the principal quantum number', () => {
    const meanR = (k: string) => {
      const pts = cloud(k);
      return pts.reduce((a, p) => a + radius(p), 0) / pts.length;
    };
    expect(meanR('2s')).toBeGreaterThan(meanR('1s'));
    expect(meanR('3d')).toBeGreaterThan(meanR('2p'));
  });
});

describe('lattices and the water dimer', () => {
  it('draws no bonds in an ionic lattice', () => {
    // Sticks would put molecules back into a picture whose entire argument is
    // that there are none.
    LATTICES.forEach((spec) => {
      const l = buildLattice(spec, 1);
      expect(l.bonds.length, spec.key).toBe(0);
      expect(l.atoms.length).toBeGreaterThan(7);
    });
  });

  it('alternates charge through the rock-salt lattice', () => {
    const nacl = buildLattice(LATTICES.find((l) => l.key === 'nacl')!, 1);
    const cations = nacl.atoms.filter((a) => a.charge === 1).length;
    const anions = nacl.atoms.filter((a) => a.charge === -1).length;
    // A finite cut of the lattice will not be exactly balanced, but it cannot
    // be lopsided.
    expect(Math.abs(cations - anions)).toBeLessThan(nacl.atoms.length * 0.2);
  });

  it('keeps the hydrogen bond long and the covalent bonds short', () => {
    const d = waterDimer(2.8);
    // Every O-H inside a molecule stays at its covalent length whatever the
    // separation, which is the point the forces mode makes.
    d.bonds.forEach((b) => {
      expect(distance(d.atoms[b.a], d.atoms[b.b])).toBeCloseTo(0.96, 2);
    });
    const oxygens = d.atoms.filter((a) => a.el === 'O');
    expect(oxygens).toHaveLength(2);
    expect(distance(oxygens[0], oxygens[1])).toBeCloseTo(2.8, 2);
  });

  it('leaves covalent bonds untouched as the dimer is pulled apart', () => {
    const far = waterDimer(6.5);
    far.bonds.forEach((b) => {
      expect(distance(far.atoms[b.a], far.atoms[b.b])).toBeCloseTo(0.96, 2);
    });
  });
});

describe('the VSEPR catalogue is honest about coverage', () => {
  it('badges only the shapes OCTET actually teaches', () => {
    // Seesaw, T-shaped, square pyramidal and square planar are standard
    // first-year content but are absent from OCTET's GEN1.VSEPR lesson, so
    // they must not carry a node link implying otherwise.
    const unbadged = VSEPR_CASES.filter((c) => c.teaches.length === 0).map((c) => c.key);
    expect(unbadged.sort()).toEqual(['ax3e2', 'ax4e', 'ax4e2', 'ax5e']);
  });

  it('gives every badged case a real OCTET node code', () => {
    VSEPR_CASES.forEach((c) => {
      c.teaches.forEach((code) => {
        expect(code, c.key).toMatch(/^GEN[12]\.[A-Z]+$/);
      });
    });
  });
});

/**
 * Independent verification of the PV-loop engine.
 *
 * The house rule on this platform is that computed figures are checked by an
 * INDEPENDENT route, not by restating the same arithmetic. Two things here
 * satisfy that:
 *
 *   1. `solvePvLoop` returns P_es twice — once from the ESPVR (P = Ees(V-V0))
 *      and once from the arterial load line (P = Ea * SV). Different equations,
 *      must agree.
 *
 *   2. The closed-form ESV is checked against a BISECTION root-find on
 *      f(V) = Ees(V - V0) - Ea(EDV - V). Solving numerically is a different
 *      method from solving algebraically; if the algebra were rearranged wrong
 *      the two would diverge.
 *
 * Plus the behavioural checks that matter pedagogically: Frank-Starling and the
 * afterload/contractility responses must EMERGE from the model, not be
 * hard-coded. If someone later "simplifies" the engine into splines that merely
 * look right, these fail.
 */

import { describe, it, expect } from "vitest";
import {
  solvePvLoop,
  traceLoop,
  edPressure,
  esPressure,
  NORMAL_INPUTS,
  PV_PARAMS,
  type PvInputs,
} from "../physiology/pv-loop";

/** Independent route: bisection on the coupling equation. */
function esvByBisection(p: PvInputs): number {
  const f = (v: number) => p.ees * (v - p.v0) - p.ea * (p.edv - v);
  let lo = p.v0;
  let hi = p.edv;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

describe("PV loop — independent verification", () => {
  it("computes P_es identically by two different equations", () => {
    const r = solvePvLoop(NORMAL_INPUTS);
    expect(r.pes).toBeCloseTo(r.pesCheck, 9);
  });

  it("closed-form ESV matches a numerical root-find", () => {
    const r = solvePvLoop(NORMAL_INPUTS);
    expect(r.esv).toBeCloseTo(esvByBisection(NORMAL_INPUTS), 6);
  });

  it("agrees with bisection across the whole parameter space, not just normal", () => {
    for (const edv of [70, 120, 200]) {
      for (const ees of [0.5, 2.3, 5.0]) {
        for (const ea of [0.6, 1.6, 4.0]) {
          const input = { ...NORMAL_INPUTS, edv, ees, ea };
          const r = solvePvLoop(input);
          expect(r.esv).toBeCloseTo(esvByBisection(input), 6);
          expect(r.pes).toBeCloseTo(r.pesCheck, 9);
        }
      }
    }
  });
});

describe("PV loop — normal adult physiology", () => {
  const r = solvePvLoop(NORMAL_INPUTS);

  it("produces a normal stroke volume", () => {
    // Normal SV ~70 mL.
    expect(r.sv).toBeGreaterThan(60);
    expect(r.sv).toBeLessThan(80);
  });

  it("produces a normal ejection fraction", () => {
    // Normal LVEF 55-70%.
    expect(r.ef).toBeGreaterThan(0.5);
    expect(r.ef).toBeLessThan(0.7);
  });

  it("produces a normal end-systolic pressure", () => {
    // Should land near a normal systolic pressure, ~100-120 mmHg.
    expect(r.pes).toBeGreaterThan(95);
    expect(r.pes).toBeLessThan(125);
  });

  it("produces a normal end-diastolic pressure", () => {
    // Normal LVEDP ~5-12 mmHg. This is the number that backs up into the
    // pulmonary circulation, so getting it wrong teaches the wrong thing.
    expect(r.ped).toBeGreaterThan(4);
    expect(r.ped).toBeLessThan(14);
  });

  it("produces a normal end-systolic volume", () => {
    expect(r.esv).toBeGreaterThan(40);
    expect(r.esv).toBeLessThan(60);
  });
});

describe("PV loop — the three levers behave as physiology says", () => {
  it("Frank-Starling: raising preload raises stroke volume", () => {
    const lo = solvePvLoop({ ...NORMAL_INPUTS, edv: 100 });
    const hi = solvePvLoop({ ...NORMAL_INPUTS, edv: 160 });
    expect(hi.sv).toBeGreaterThan(lo.sv);
  });

  it("raising afterload lowers stroke volume and raises end-systolic pressure", () => {
    const lo = solvePvLoop({ ...NORMAL_INPUTS, ea: 1.0 });
    const hi = solvePvLoop({ ...NORMAL_INPUTS, ea: 3.5 });
    expect(hi.sv).toBeLessThan(lo.sv);
    expect(hi.pes).toBeGreaterThan(lo.pes);
  });

  it("raising contractility raises BOTH stroke volume and pressure", () => {
    // This is the discriminating case. Increasing afterload also raises
    // pressure, but lowers SV. Only inotropy raises both.
    const lo = solvePvLoop({ ...NORMAL_INPUTS, ees: 1.0 });
    const hi = solvePvLoop({ ...NORMAL_INPUTS, ees: 4.0 });
    expect(hi.sv).toBeGreaterThan(lo.sv);
    expect(hi.pes).toBeGreaterThan(lo.pes);
  });

  it("systolic failure: low contractility gives a low ejection fraction", () => {
    const failing = solvePvLoop({ ...NORMAL_INPUTS, ees: 0.5 });
    expect(failing.ef).toBeLessThan(0.4); // HFrEF range
  });

  it("a stiff ventricle needs a far higher filling pressure", () => {
    const normal = solvePvLoop(NORMAL_INPUTS);
    const stiff = solvePvLoop({ ...NORMAL_INPUTS, alpha: 0.08 });
    expect(stiff.ped).toBeGreaterThan(normal.ped * 2);
  });
});

describe("PV loop — invariants", () => {
  it("ESV never falls below V0 and never exceeds EDV", () => {
    for (const ea of [0.4, 1.0, 2.0, 4.0, 6.0]) {
      for (const ees of [0.3, 1.0, 3.0, 6.0]) {
        const r = solvePvLoop({ ...NORMAL_INPUTS, ea, ees });
        expect(r.esv).toBeGreaterThanOrEqual(NORMAL_INPUTS.v0);
        expect(r.esv).toBeLessThanOrEqual(r.edv);
        expect(r.sv).toBeGreaterThanOrEqual(0);
        expect(r.ef).toBeLessThanOrEqual(1);
      }
    }
  });

  it("the EDPVR is monotonically increasing", () => {
    let prev = -Infinity;
    for (let v = 5; v <= 250; v += 5) {
      const p = edPressure(v, NORMAL_INPUTS);
      expect(p).toBeGreaterThanOrEqual(prev);
      prev = p;
    }
  });

  it("the ESPVR passes through (V0, 0)", () => {
    expect(esPressure(NORMAL_INPUTS.v0, NORMAL_INPUTS)).toBeCloseTo(0, 12);
  });

  it("the traced loop is closed and every point is finite", () => {
    const pts = traceLoop(NORMAL_INPUTS);
    expect(pts.length).toBeGreaterThan(20);
    for (const [v, p] of pts) {
      expect(Number.isFinite(v)).toBe(true);
      expect(Number.isFinite(p)).toBe(true);
    }
    const [v0, p0] = pts[0];
    const [vn, pn] = pts[pts.length - 1];
    expect(Math.abs(v0 - vn)).toBeLessThan(1.5);
    expect(Math.abs(p0 - pn)).toBeLessThan(1.5);
  });
});

describe("PV loop — the constants table is usable by a reviewer", () => {
  it("every parameter has a range that brackets its normal value", () => {
    for (const p of PV_PARAMS) {
      expect(p.min).toBeLessThan(p.max);
      expect(p.normal).toBeGreaterThanOrEqual(p.min);
      expect(p.normal).toBeLessThanOrEqual(p.max);
      expect(p.note.length).toBeGreaterThan(20);
      expect(p.units.length).toBeGreaterThan(0);
    }
  });

  it("the table's normal values are exactly the defaults the sim opens with", () => {
    // If these drift apart, the reviewer reviews one set of numbers and the
    // student sees another.
    for (const p of PV_PARAMS) {
      expect((NORMAL_INPUTS as unknown as Record<string, number>)[p.key]).toBe(p.normal);
    }
  });
});

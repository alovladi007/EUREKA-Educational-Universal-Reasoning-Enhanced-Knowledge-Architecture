/**
 * Left-ventricular pressure-volume loop — time-varying elastance model.
 *
 * MODEL
 * -----
 * This is the Suga-Sagawa time-varying elastance framework with Sunagawa's
 * ventricular-arterial coupling. Three relationships fully determine the loop:
 *
 *   1. ESPVR (end-systolic pressure-volume relationship), linear:
 *        P_es = E_es * (V_es - V0)
 *      E_es is the slope — the load-INDEPENDENT index of contractility. V0 is
 *      the volume-axis intercept, the theoretical volume at zero pressure.
 *
 *   2. EDPVR (end-diastolic pressure-volume relationship), exponential —
 *      passive myocardial stiffness is not linear:
 *        P_ed = beta * (exp(alpha * (V - V0d)) - 1)
 *
 *   3. Effective arterial elastance E_a, the lumped afterload seen by the
 *      ventricle, as a load line from (EDV, 0) with slope -E_a:
 *        P_es = E_a * (EDV - V_es)
 *
 * SOLVING THE COUPLED OPERATING POINT
 * -----------------------------------
 * End-systole is where the ESPVR meets the arterial load line. Setting (1)=(3):
 *
 *      E_es * (V_es - V0)  =  E_a * (EDV - V_es)
 *      E_es*V_es - E_es*V0 =  E_a*EDV - E_a*V_es
 *      V_es * (E_es + E_a) =  E_a*EDV + E_es*V0
 *
 *      V_es = (E_a*EDV + E_es*V0) / (E_es + E_a)          [closed form]
 *
 * Everything else follows: SV = EDV - V_es, EF = SV/EDV, and P_es may be
 * computed by EITHER route — which is exactly the independent check this
 * codebase requires. See pv-loop.test.ts: the two routes must agree.
 *
 * WHY THIS MODEL AND NOT A PRETTIER ONE
 * ------------------------------------
 * Because it is the one that makes the three teaching levers behave correctly
 * and for the RIGHT reason:
 *   - raise preload (EDV)        -> SV rises   (Frank-Starling, emergent here,
 *                                               not hard-coded)
 *   - raise afterload (E_a)      -> SV falls, P_es rises
 *   - raise contractility (E_es) -> SV rises AND P_es rises; ESPVR steepens
 * A loop drawn from splines would look the same and teach nothing.
 *
 * PARAMETERS ARE NOT YET FACULTY-REVIEWED. The values below are the standard
 * ranges reported in cardiovascular physiology for the normal adult human left
 * ventricle; they are tabulated here with their ranges so a reviewer can check
 * them in one place rather than hunting through render code. Until that review
 * happens the UI must say so.
 */

/** A tabulated parameter: value, plausible range, units, and what it means. */
export interface PhysParam {
  readonly key: string;
  readonly label: string;
  readonly units: string;
  readonly normal: number;
  readonly min: number;
  readonly max: number;
  readonly note: string;
}

/**
 * CONSTANTS TABLE — the single place a reviewer needs to look.
 *
 * Normal adult human left ventricle. Ranges are deliberately wider than
 * "normal" so the sim can be driven into failure states (that is the point of
 * the Neuro action-potential sim too: let it fail, visibly).
 */
export const PV_PARAMS: readonly PhysParam[] = [
  {
    key: "edv",
    label: "Preload (end-diastolic volume)",
    units: "mL",
    normal: 120,
    min: 60,
    max: 250,
    note:
      "Normal EDV ~110-130 mL. Rises in volume overload and dilated " +
      "cardiomyopathy; falls in hypovolaemia and tamponade.",
  },
  {
    key: "ees",
    label: "Contractility (end-systolic elastance, E_es)",
    units: "mmHg/mL",
    normal: 2.3,
    min: 0.3,
    max: 6.0,
    note:
      "Slope of the ESPVR. Normal ~2-3 mmHg/mL. The load-INDEPENDENT index of " +
      "contractility — this is why it is the correct lever, not ejection " +
      "fraction. Falls markedly in systolic heart failure (<1.0).",
  },
  {
    key: "ea",
    label: "Afterload (effective arterial elastance, E_a)",
    units: "mmHg/mL",
    normal: 1.6,
    min: 0.4,
    max: 6.0,
    note:
      "Lumped arterial load. Normal ~1.5-2.2 mmHg/mL. Rises with systemic " +
      "vascular resistance and aortic stenosis. E_a/E_es ~0.6-0.8 is optimal " +
      "ventricular-arterial coupling for stroke work.",
  },
  {
    key: "v0",
    label: "ESPVR volume intercept (V0)",
    units: "mL",
    normal: 5,
    min: 0,
    max: 40,
    note: "Volume-axis intercept of the ESPVR. Small and positive in health.",
  },
  {
    key: "alpha",
    label: "EDPVR stiffness constant (alpha)",
    units: "1/mL",
    normal: 0.03,
    min: 0.005,
    max: 0.12,
    note:
      "Exponential stiffness of the passive ventricle. Rises in restrictive " +
      "and hypertrophic disease — a stiff ventricle needs a much higher " +
      "filling pressure for the same volume.",
  },
  {
    key: "beta",
    label: "EDPVR scale (beta)",
    units: "mmHg",
    normal: 0.3,
    min: 0.05,
    max: 2.0,
    note: "Scale term of the EDPVR. With alpha=0.03, gives EDP ~9 mmHg at EDV 120.",
  },
] as const;

export interface PvInputs {
  edv: number;   // mL
  ees: number;   // mmHg/mL
  ea: number;    // mmHg/mL
  v0: number;    // mL
  alpha: number; // 1/mL
  beta: number;  // mmHg
}

export interface PvResult {
  edv: number;
  esv: number;
  sv: number;
  ef: number;        // fraction 0-1
  pes: number;       // end-systolic pressure, mmHg
  ped: number;       // end-diastolic pressure, mmHg
  strokeWork: number; // mmHg*mL
  /** Second, independent computation of P_es. Must match `pes`. */
  pesCheck: number;
}

export const NORMAL_INPUTS: PvInputs = {
  edv: 120,
  ees: 2.3,
  ea: 1.6,
  v0: 5,
  alpha: 0.03,
  beta: 0.3,
};

/** EDPVR: passive filling pressure at a given volume. */
export function edPressure(v: number, p: Pick<PvInputs, "alpha" | "beta" | "v0">): number {
  const dv = Math.max(0, v - p.v0);
  return p.beta * (Math.exp(p.alpha * dv) - 1);
}

/** ESPVR: end-systolic pressure the myocardium can generate at a volume. */
export function esPressure(v: number, p: Pick<PvInputs, "ees" | "v0">): number {
  return p.ees * (v - p.v0);
}

/**
 * Solve the coupled operating point.
 *
 * `pes` comes from the ESPVR; `pesCheck` from the arterial load line. They are
 * derived from different equations and must agree — that is the independent
 * verification, not a restatement of the same arithmetic.
 */
export function solvePvLoop(input: PvInputs): PvResult {
  const { edv, ees, ea, v0 } = input;

  const esv = (ea * edv + ees * v0) / (ees + ea);
  const sv = edv - esv;

  const pes = esPressure(esv, input);      // route 1: ESPVR
  const pesCheck = ea * sv;                // route 2: arterial load line

  const ped = edPressure(edv, input);

  // Stroke work ~ area of the loop. Trapezoid between the ejection pressure
  // and the filling pressure over the stroke volume — an approximation, and
  // labelled as one rather than dressed up as exact.
  const strokeWork = sv * (pes - ped);

  return { edv, esv, sv, ef: sv / edv, pes, ped, strokeWork, pesCheck };
}

/**
 * Trace the loop as an ordered polygon of [volume, pressure] points.
 *
 * Four phases, traversed counter-clockwise as the real loop is:
 *   1. isovolumetric contraction — V held at EDV, P rises from EDP to P_open
 *   2. ejection                  — V falls EDV->ESV along the arterial line
 *   3. isovolumetric relaxation  — V held at ESV, P falls to the EDPVR
 *   4. filling                   — V rises ESV->EDV along the EDPVR
 */
export function traceLoop(input: PvInputs, steps = 60): Array<[number, number]> {
  const r = solvePvLoop(input);
  const pts: Array<[number, number]> = [];

  // Aortic valve opens at diastolic pressure. Approximated from the operating
  // point: for a normal loop this lands near 80 mmHg.
  const pOpen = Math.max(r.ped, r.pes * 0.72);

  // 1. isovolumetric contraction
  for (let i = 0; i <= steps / 4; i++) {
    const f = i / (steps / 4);
    pts.push([r.edv, r.ped + f * (pOpen - r.ped)]);
  }
  // 2. ejection: pressure rides up to P_es then the valve closes
  for (let i = 0; i <= steps / 2; i++) {
    const f = i / (steps / 2);
    const v = r.edv - f * r.sv;
    // parabolic arc peaking mid-ejection, ending at P_es
    const p = pOpen + (r.pes - pOpen) * Math.sin(f * Math.PI * 0.5) + 8 * Math.sin(f * Math.PI);
    pts.push([v, p]);
  }
  // 3. isovolumetric relaxation
  const pEsvFill = edPressure(r.esv, input);
  for (let i = 0; i <= steps / 4; i++) {
    const f = i / (steps / 4);
    pts.push([r.esv, r.pes + f * (pEsvFill - r.pes)]);
  }
  // 4. filling along the EDPVR
  for (let i = 0; i <= steps / 2; i++) {
    const f = i / (steps / 2);
    const v = r.esv + f * r.sv;
    pts.push([v, edPressure(v, input)]);
  }
  return pts;
}

/** Plain-language read-out of where this loop sits clinically. */
export function interpret(r: PvResult, input: PvInputs): string[] {
  const out: string[] = [];
  const coupling = input.ea / input.ees;

  if (r.ef < 0.4) out.push(`Ejection fraction ${(r.ef * 100).toFixed(0)}% — reduced (HFrEF range).`);
  else if (r.ef > 0.7) out.push(`Ejection fraction ${(r.ef * 100).toFixed(0)}% — supranormal.`);
  else out.push(`Ejection fraction ${(r.ef * 100).toFixed(0)}% — within normal range.`);

  if (r.ped > 18) out.push(`End-diastolic pressure ${r.ped.toFixed(0)} mmHg — elevated; this is the pressure that backs up into the pulmonary circulation.`);
  if (input.ees < 1.0) out.push(`E_es ${input.ees.toFixed(1)} mmHg/mL — depressed contractility.`);
  if (coupling > 1.3) out.push(`E_a/E_es ${coupling.toFixed(2)} — uncoupled; the ventricle is working against a load it is poorly matched to, and stroke work falls.`);
  else if (coupling >= 0.5 && coupling <= 1.0) out.push(`E_a/E_es ${coupling.toFixed(2)} — near-optimal ventricular-arterial coupling.`);

  return out;
}

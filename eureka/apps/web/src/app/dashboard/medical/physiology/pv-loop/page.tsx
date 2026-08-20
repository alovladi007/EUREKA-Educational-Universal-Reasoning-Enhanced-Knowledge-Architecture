"use client";

/**
 * Cardiac pressure-volume loop — interactive.
 *
 * Reference implementation for the physiology-sim programme. Every curve here
 * is computed from the equations in lib/physiology/pv-loop.ts; nothing is drawn
 * from a spline or traced from a textbook figure. The three sliders are the
 * three independent determinants of cardiac performance, and the responses are
 * emergent from the model — see lib/__tests__/pv-loop.test.ts, which fails if
 * anyone replaces the engine with something that merely looks right.
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, RotateCcw, Info } from "lucide-react";
import {
  solvePvLoop,
  traceLoop,
  edPressure,
  esPressure,
  interpret,
  NORMAL_INPUTS,
  PV_PARAMS,
  type PvInputs,
} from "@/lib/physiology/pv-loop";

/** Clinical presets — each is a real haemodynamic state, not a random slider set. */
const PRESETS: Array<{ name: string; blurb: string; inputs: PvInputs }> = [
  {
    name: "Normal",
    blurb: "Healthy adult left ventricle.",
    inputs: NORMAL_INPUTS,
  },
  {
    name: "Systolic failure (HFrEF)",
    blurb: "Contractility collapses; the ventricle dilates to compensate. Note EF falls but the loop also shifts right.",
    inputs: { ...NORMAL_INPUTS, ees: 0.6, edv: 190, ea: 2.0 },
  },
  {
    name: "Hypertension",
    blurb: "High afterload. Pressure rises, stroke volume falls, and the loop grows taller and narrower.",
    inputs: { ...NORMAL_INPUTS, ea: 3.4 },
  },
  {
    name: "Hypovolaemia",
    blurb: "Preload falls. The whole loop shifts left and shrinks — Frank-Starling in reverse.",
    inputs: { ...NORMAL_INPUTS, edv: 75 },
  },
  {
    name: "Stiff ventricle (HFpEF)",
    blurb: "Contractility is preserved, but passive stiffness is high — filling pressure is high at a normal volume.",
    inputs: { ...NORMAL_INPUTS, alpha: 0.075, edv: 110 },
  },
];

// Plot geometry (SVG user units).
const W = 620;
const H = 460;
const PAD = { l: 62, r: 22, t: 20, b: 52 };
const V_MAX = 260; // mL
const P_MAX = 220; // mmHg

const vx = (v: number) => PAD.l + (v / V_MAX) * (W - PAD.l - PAD.r);
const py = (p: number) => H - PAD.b - (p / P_MAX) * (H - PAD.t - PAD.b);

export default function PvLoopPage() {
  const [inputs, setInputs] = useState<PvInputs>(NORMAL_INPUTS);

  const result = useMemo(() => solvePvLoop(inputs), [inputs]);
  const loop = useMemo(() => traceLoop(inputs, 80), [inputs]);
  const notes = useMemo(() => interpret(result, inputs), [result, inputs]);

  // Reference loop (normal) drawn faintly behind, so the student always has a
  // baseline to compare against — the single most useful teaching affordance.
  const refLoop = useMemo(() => traceLoop(NORMAL_INPUTS, 80), []);

  const loopPath = loop.map(([v, p], i) => `${i ? "L" : "M"}${vx(v)},${py(p)}`).join(" ") + " Z";
  const refPath = refLoop.map(([v, p], i) => `${i ? "L" : "M"}${vx(v)},${py(p)}`).join(" ") + " Z";

  // ESPVR: straight line from V0 to the top of the plot.
  const espvrEnd = Math.min(V_MAX, inputs.v0 + P_MAX / inputs.ees);
  // EDPVR: sampled exponential.
  const edpvrPts: Array<[number, number]> = [];
  for (let v = inputs.v0; v <= V_MAX; v += 4) {
    const p = edPressure(v, inputs);
    if (p > P_MAX) break;
    edpvrPts.push([v, p]);
  }
  const edpvrPath = edpvrPts.map(([v, p], i) => `${i ? "L" : "M"}${vx(v)},${py(p)}`).join(" ");

  const set = (key: keyof PvInputs, value: number) =>
    setInputs((s) => ({ ...s, [key]: value }));

  const isNormal = JSON.stringify(inputs) === JSON.stringify(NORMAL_INPUTS);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <div className="flex items-center gap-3">
          <Heart className="w-7 h-7 text-rose-500" />
          <h1 className="text-3xl font-bold">Pressure–Volume Loop</h1>
          <Badge variant="outline" className="ml-1">Interactive</Badge>
        </div>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          The left ventricle modelled with time-varying elastance. Drag the three
          independent determinants of cardiac performance and watch the loop
          respond. Every curve is computed from the equations below — none of it
          is drawn by hand.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------------- plot ---------------- */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[520px]" role="img"
                   aria-label="Left ventricular pressure-volume loop">
                {/* grid */}
                {[0, 50, 100, 150, 200].map((p) => (
                  <g key={`h${p}`}>
                    <line x1={PAD.l} y1={py(p)} x2={W - PAD.r} y2={py(p)}
                          className="stroke-border" strokeWidth={1} strokeDasharray="3 4" />
                    <text x={PAD.l - 10} y={py(p) + 4} textAnchor="end"
                          className="fill-muted-foreground text-[11px]">{p}</text>
                  </g>
                ))}
                {[0, 50, 100, 150, 200, 250].map((v) => (
                  <g key={`v${v}`}>
                    <line x1={vx(v)} y1={PAD.t} x2={vx(v)} y2={H - PAD.b}
                          className="stroke-border" strokeWidth={1} strokeDasharray="3 4" />
                    <text x={vx(v)} y={H - PAD.b + 18} textAnchor="middle"
                          className="fill-muted-foreground text-[11px]">{v}</text>
                  </g>
                ))}

                {/* axes */}
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="stroke-foreground" strokeWidth={1.5} />
                <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-foreground" strokeWidth={1.5} />
                <text x={W / 2} y={H - 8} textAnchor="middle" className="fill-foreground text-[12px] font-medium">
                  Left ventricular volume (mL)
                </text>
                <text x={16} y={H / 2} textAnchor="middle" className="fill-foreground text-[12px] font-medium"
                      transform={`rotate(-90 16 ${H / 2})`}>
                  Pressure (mmHg)
                </text>

                {/* ESPVR — contractility */}
                <line x1={vx(inputs.v0)} y1={py(0)} x2={vx(espvrEnd)} y2={py(esPressure(espvrEnd, inputs))}
                      className="stroke-violet-500" strokeWidth={2} />
                <text x={vx(espvrEnd) - 6} y={py(esPressure(espvrEnd, inputs)) + 14}
                      textAnchor="end" className="fill-violet-500 text-[11px] font-semibold">ESPVR</text>

                {/* EDPVR — passive stiffness */}
                <path d={edpvrPath} fill="none" className="stroke-sky-500" strokeWidth={2} />
                <text x={vx(V_MAX) - 24} y={py(edPressure(V_MAX - 10, inputs)) - 8}
                      textAnchor="end" className="fill-sky-500 text-[11px] font-semibold">EDPVR</text>

                {/* arterial load line */}
                <line x1={vx(result.edv)} y1={py(0)} x2={vx(result.esv)} y2={py(result.pes)}
                      className="stroke-amber-500" strokeWidth={1.5} strokeDasharray="5 4" />

                {/* reference (normal) loop */}
                {!isNormal && (
                  <path d={refPath} fill="none" className="stroke-muted-foreground" strokeWidth={1.5}
                        strokeDasharray="4 5" opacity={0.5} />
                )}

                {/* the loop */}
                <path d={loopPath} className="fill-rose-500/15 stroke-rose-500" strokeWidth={2.5}
                      strokeLinejoin="round" />

                {/* operating points */}
                <circle cx={vx(result.esv)} cy={py(result.pes)} r={5} className="fill-violet-500" />
                <circle cx={vx(result.edv)} cy={py(result.ped)} r={5} className="fill-sky-500" />
              </svg>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-muted-foreground">
              <span><span className="inline-block w-3 h-[2px] bg-violet-500 align-middle mr-1" />ESPVR (contractility)</span>
              <span><span className="inline-block w-3 h-[2px] bg-sky-500 align-middle mr-1" />EDPVR (passive stiffness)</span>
              <span><span className="inline-block w-3 h-[2px] bg-amber-500 align-middle mr-1" />Arterial load line</span>
              {!isNormal && <span><span className="inline-block w-3 h-[2px] bg-muted-foreground align-middle mr-1" />Normal (reference)</span>}
            </div>
          </CardContent>
        </Card>

        {/* ---------------- readout ---------------- */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Haemodynamics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                ["Stroke volume", `${result.sv.toFixed(1)} mL`],
                ["Ejection fraction", `${(result.ef * 100).toFixed(0)} %`],
                ["End-diastolic volume", `${result.edv.toFixed(0)} mL`],
                ["End-systolic volume", `${result.esv.toFixed(1)} mL`],
                ["End-systolic pressure", `${result.pes.toFixed(0)} mmHg`],
                ["End-diastolic pressure", `${result.ped.toFixed(1)} mmHg`],
                ["Stroke work (approx.)", `${(result.strokeWork / 1000).toFixed(2)} J×10⁻³`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-border/50 pb-1.5 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono font-medium tabular-nums">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {notes.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-4 h-4" /> Reading the loop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {notes.map((n, i) => <li key={i}>• {n}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ---------------- controls ---------------- */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg">Determinants</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setInputs(NORMAL_INPUTS)}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> Reset to normal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button key={p.name} variant="secondary" size="sm" title={p.blurb}
                      onClick={() => setInputs(p.inputs)}>
                {p.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {PV_PARAMS.map((p) => {
              const value = (inputs as unknown as Record<string, number>)[p.key];
              const step = p.key === "alpha" ? 0.001 : p.key === "beta" ? 0.01 : p.key === "edv" || p.key === "v0" ? 1 : 0.1;
              return (
                <div key={p.key}>
                  <div className="flex justify-between items-baseline gap-3 mb-1.5">
                    <label htmlFor={`sl-${p.key}`} className="text-sm font-medium">{p.label}</label>
                    <span className="font-mono text-sm tabular-nums">
                      {value.toFixed(p.key === "alpha" ? 3 : p.key === "edv" || p.key === "v0" ? 0 : 2)} {p.units}
                    </span>
                  </div>
                  <input
                    id={`sl-${p.key}`}
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={step}
                    value={value}
                    onChange={(e) => set(p.key as keyof PvInputs, parseFloat(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">{p.note}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ---------------- the model, stated ---------------- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">The model</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>Three relationships determine the loop completely:</p>
          <div className="font-mono text-xs bg-muted/50 rounded-md p-3 space-y-1 overflow-x-auto">
            <div>ESPVR   P_es = E_es · (V_es − V₀)</div>
            <div>EDPVR   P_ed = β · (exp(α · (V − V₀)) − 1)</div>
            <div>Load    P_es = E_a · (EDV − V_es)</div>
          </div>
          <p>
            End-systole is where the ESPVR meets the arterial load line. Setting them
            equal and solving gives the operating point in closed form:
          </p>
          <div className="font-mono text-xs bg-muted/50 rounded-md p-3 overflow-x-auto">
            V_es = (E_a·EDV + E_es·V₀) / (E_es + E_a)
          </div>
          <p>
            Stroke volume, ejection fraction and pressure all follow. Nothing about
            Frank–Starling is coded in — it <em>emerges</em>: raise EDV and the load
            line moves right, so stroke volume grows.
          </p>
          <p className="text-xs border-l-2 border-amber-500 pl-3 py-1">
            <strong className="text-foreground">Parameter ranges are not yet faculty-reviewed.</strong>{" "}
            The values are the standard ranges reported for the normal adult human
            left ventricle and are tabulated in one place so a reviewer can check
            them without reading render code. The <em>arithmetic</em> is verified: the
            closed form above is tested against an independent numerical root-find
            across the whole parameter space.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

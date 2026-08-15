'use client';

/**
 * Animated chemistry scenes.
 *
 * WHAT THESE ARE
 *
 * Each scene is a pure function of normalised time t in [0, 1] returning SVG
 * and a caption. Nothing is recorded, streamed or fetched: the geometry is
 * computed from the same numbers the chapter states, every frame, in the
 * browser.
 *
 * WHY NOT A VIDEO FILE
 *
 * What is worth animating in organic chemistry is geometry and electron flow -
 * a p orbital rotating until its overlap goes to zero, a lone pair becoming a
 * bond, a carbon climbing the oxidation ladder one C-H at a time. All of that
 * is exactly reproducible from coordinates. Computing it has four properties a
 * recording does not:
 *
 *   correct by construction - the sigma bond really is drawn from the two
 *     orbitals overlapping, and the pi bond's overlap really is scaled by the
 *     cosine of the twist, so the picture cannot disagree with the prose
 *   scrubbable - a learner can stop on the frame where the overlap is half
 *     gone, which is the frame that carries the idea
 *   scalable - vector at any size, legible on a phone and on a projector
 *   about 300x smaller than the equivalent recording
 *
 * The UI says what it is showing. It does not call this footage.
 *
 * STAGE COLOURS
 *
 * Scenes draw with explicit slate, brand and amber classes rather than the
 * page's foreground and muted-foreground tokens. The stage is always dark -
 * that is what a video panel looks like in either theme - so a token that
 * resolves to near-black ink in light mode would draw an invisible bond.
 *
 * ACCESSIBILITY
 *
 * Every scene carries a caption per phase, which is the caption track, and the
 * player renders it as text rather than burning it into the picture. The
 * lesson payload also carries a prose `summary` of the whole animation, which
 * is the SVG's aria-label and the description for a reader who cannot see it.
 */

import type { ReactNode } from 'react';

export interface SceneFrame {
  caption: string;
  svg: ReactNode;
}

export interface Scene {
  /** SVG user units. Every scene draws inside this box. */
  viewBox: string;
  frame: (t: number) => SceneFrame;
}

// ---------------------------------------------------------------------------
// timing helpers
// ---------------------------------------------------------------------------

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** Smoothstep. Motion that starts and stops abruptly reads as a glitch. */
const ease = (u: number) => u * u * (3 - 2 * u);

/** Local progress within [a, b] of the global timeline, eased. */
function phase(t: number, a: number, b: number): number {
  return ease(clamp((t - a) / (b - a)));
}

// ---------------------------------------------------------------------------
// shared marks
// ---------------------------------------------------------------------------

/** One p-orbital lobe: an ellipse pushed out from (cx, cy) along `deg`. */
function Lobe({
  cx,
  cy,
  deg,
  len,
  wid,
  filled,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  deg: number;
  len: number;
  wid: number;
  filled: boolean;
  opacity?: number;
}) {
  const r = (deg * Math.PI) / 180;
  const ex = cx + (len / 2) * Math.cos(r);
  const ey = cy + (len / 2) * Math.sin(r);
  return (
    <ellipse
      cx={ex}
      cy={ey}
      rx={len / 2}
      ry={wid / 2}
      transform={`rotate(${deg} ${ex} ${ey})`}
      className={
        filled
          ? 'fill-brand-500/85 stroke-slate-100'
          : 'fill-transparent stroke-slate-100'
      }
      strokeWidth={1.6}
      opacity={opacity}
    />
  );
}

function Nucleus({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} className="fill-brand-600" />
      {label && (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-white"
          style={{ font: '700 10px ui-sans-serif, system-ui' }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function Bond({
  x1,
  y1,
  x2,
  y2,
  width = 2,
  dashed = false,
  opacity = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className="stroke-slate-100"
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? '5 4' : undefined}
      opacity={opacity}
    />
  );
}

function Atom({
  x,
  y,
  label,
  sub,
}: {
  x: number;
  y: number;
  label: string;
  sub?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="fill-slate-100"
      style={{ font: '600 15px ui-sans-serif, system-ui' }}
    >
      {label}
      {sub && (
        <tspan dy={4} style={{ font: '600 11px ui-sans-serif, system-ui' }}>
          {sub}
        </tspan>
      )}
    </text>
  );
}

/**
 * A curved electron-pushing arrow from one point to another.
 *
 * The tail sits on the electron pair that moves and the head on where it goes,
 * which is the convention the mechanism chapters enforce. `bow` is how far the
 * arc bulges perpendicular to the chord.
 */
function CurvedArrow({
  x1,
  y1,
  x2,
  y2,
  bow = 34,
  opacity = 1,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bow?: number;
  opacity?: number;
  id: string;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const n = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / n) * bow;
  const cy = my + (dx / n) * bow;
  return (
    <g opacity={opacity}>
      <defs>
        <marker
          id={`ah-${id}`}
          markerWidth="7"
          markerHeight="7"
          refX="5.4"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" className="fill-amber-400" />
        </marker>
      </defs>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        className="fill-none stroke-amber-400"
        strokeWidth={2}
        markerEnd={`url(#ah-${id})`}
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// 1. sigma-pi-overlap
// ---------------------------------------------------------------------------
//
// Four phases, and the third and fourth are the point: the same two orbitals
// that rotate freely as a sigma bond lose all their overlap when a pi bond is
// twisted. That contrast is what the prose asserts and it is hard to believe
// from two static pictures.
const sigmaPi: Scene = {
  viewBox: '0 0 620 300',
  frame: (t) => {
    const A = { x: 210, y: 150 };
    const B = { x: 410, y: 150 };

    // 0.00-0.22 approach end-on   0.22-0.46 rotate the sigma
    // 0.46-0.72 approach side-on  0.72-1.00 twist the pi
    if (t < 0.46) {
      const close = phase(t, 0.0, 0.22);
      const gap = lerp(140, 0, close);
      const spin = t < 0.22 ? 0 : phase(t, 0.24, 0.46) * 360;
      return {
        caption:
          t < 0.22
            ? 'End-on approach. The two lobes meet along the line joining the nuclei.'
            : 'Rotating one end changes nothing: the overlap is cylindrically symmetric, so rotation about a sigma bond is nearly free.',
        svg: (
          <g>
            <line
              x1={90}
              y1={150}
              x2={530}
              y2={150}
              className="stroke-slate-100/25"
              strokeDasharray="5 5"
              strokeWidth={1}
            />
            <g transform={`translate(${-gap / 2} 0)`}>
              <Lobe cx={A.x} cy={A.y} deg={0} len={92} wid={54} filled />
              <Lobe cx={A.x} cy={A.y} deg={180} len={92} wid={54} filled={false} />
              <Nucleus x={A.x} y={A.y} />
            </g>
            <g transform={`translate(${gap / 2} 0) rotate(${spin} ${B.x} ${B.y})`}>
              <Lobe cx={B.x} cy={B.y} deg={180} len={92} wid={54} filled />
              <Lobe cx={B.x} cy={B.y} deg={0} len={92} wid={54} filled={false} />
              <Nucleus x={B.x} y={B.y} />
            </g>
            <text
              x={310}
              y={252}
              textAnchor="middle"
              className="fill-slate-400"
              style={{ font: '600 13px ui-sans-serif, system-ui' }}
            >
              {close >= 1 ? 'σ bond' : 'σ forming'}
            </text>
          </g>
        ),
      };
    }

    const close = phase(t, 0.46, 0.68);
    const gap = lerp(140, 0, close);
    const twist = phase(t, 0.74, 1.0); // 0 -> 1 maps to 0 -> 90 degrees
    // Side-on overlap goes as cos of the twist angle. At 90 degrees it is zero,
    // which is the whole reason a pi bond cannot rotate.
    const overlap = Math.cos((twist * Math.PI) / 2);
    // The far orbital is drawn foreshortened by the same cosine, so what the
    // viewer sees IS the overlap rather than a caption asserting it.
    const squash = Math.max(0.06, overlap);

    return {
      caption:
        t < 0.72
          ? 'Side-on approach. Density builds above and below the axis, with a node containing the axis itself.'
          : `Twisting one end drives the overlap toward zero (${Math.round(
              overlap * 100,
            )}% left). At ninety degrees the pi bond is broken - which is why alkene geometry is fixed.`,
      svg: (
        <g>
          <line
            x1={90}
            y1={150}
            x2={530}
            y2={150}
            className="stroke-slate-100/25"
            strokeDasharray="5 5"
            strokeWidth={1}
          />
          <g transform={`translate(${-gap / 2} 0)`}>
            <Lobe cx={A.x} cy={A.y} deg={-90} len={80} wid={48} filled />
            <Lobe cx={A.x} cy={A.y} deg={90} len={80} wid={48} filled={false} />
            <Nucleus x={A.x} y={A.y} />
          </g>
          <g
            transform={`translate(${gap / 2} 0) translate(${B.x} ${B.y}) scale(${squash} 1) translate(${-B.x} ${-B.y})`}
          >
            <Lobe cx={B.x} cy={B.y} deg={-90} len={80} wid={48} filled />
            <Lobe cx={B.x} cy={B.y} deg={90} len={80} wid={48} filled={false} />
          </g>
          <Nucleus x={B.x + gap / 2} y={B.y} />
          {close >= 1 && (
            <>
              <path
                d={`M ${A.x} ${A.y - 34} Q 310 ${A.y - 68} ${B.x} ${B.y - 34}`}
                className="fill-none stroke-brand-500"
                strokeWidth={2}
                opacity={overlap * 0.9}
              />
              <path
                d={`M ${A.x} ${A.y + 34} Q 310 ${A.y + 68} ${B.x} ${B.y + 34}`}
                className="fill-none stroke-brand-500"
                strokeWidth={2}
                opacity={overlap * 0.9}
              />
            </>
          )}
          <text
            x={310}
            y={252}
            textAnchor="middle"
            className="fill-slate-400"
            style={{ font: '600 13px ui-sans-serif, system-ui' }}
          >
            {t < 0.72 ? 'π bond' : `overlap ${Math.round(overlap * 100)}%`}
          </text>
        </g>
      ),
    };
  },
};

// ---------------------------------------------------------------------------
// 2. hybridisation-morph
// ---------------------------------------------------------------------------
const hybridMorph: Scene = {
  viewBox: '0 0 620 300',
  frame: (t) => {
    const cx = 310;
    const cy = 158;
    // sp3 (4 hybrids) -> sp2 (3 hybrids + 1 spare p) -> sp (2 + 2 spare)
    const toSp2 = phase(t, 0.34, 0.60);
    const toSp = phase(t, 0.68, 0.94);
    const nHybrid = t < 0.34 ? 4 : t < 0.68 ? lerp(4, 3, toSp2) : lerp(3, 2, toSp);

    // Hybrid directions interpolate between the three geometries so the
    // viewer sees the angles open out rather than three separate diagrams.
    const sp3 = [145, 35, 250, 290];
    const sp2 = [0, 152, 208];
    const sp1 = [0, 180];
    const dirs =
      t < 0.34
        ? sp3
        : t < 0.68
          ? sp2.map((a, i) => lerp(sp3[i], a, toSp2))
          : sp1.map((a, i) => lerp(sp2[i], a, toSp));

    const caption =
      t < 0.16
        ? 'One 2s orbital and three 2p orbitals. Four orbitals, four valence electrons.'
        : t < 0.34
          ? 'Mixed, they give four equivalent sp3 hybrids pointing at the corners of a tetrahedron: 109.5 degrees.'
          : t < 0.68
            ? 'Withdraw one p and three sp2 hybrids remain in a plane at 120 degrees, with the spare p perpendicular to it. That spare p is what a pi bond is made of.'
            : 'Withdraw a second and two sp hybrids remain on a line at 180 degrees, with two spare p orbitals - the two pi bonds of a triple bond.';

    return {
      caption,
      svg: (
        <g>
          {dirs.map((deg, i) => (
            <g key={i}>
              <Lobe cx={cx} cy={cy} deg={-deg} len={88} wid={40} filled />
            </g>
          ))}
          {/* spare p orbitals, faded in as they are withdrawn from the mix */}
          {toSp2 > 0 && (
            <g opacity={toSp2}>
              <Lobe cx={cx} cy={cy} deg={-90} len={70} wid={28} filled={false} />
              <Lobe cx={cx} cy={cy} deg={90} len={70} wid={28} filled={false} />
            </g>
          )}
          {toSp > 0 && (
            <g opacity={toSp}>
              <Lobe cx={cx} cy={cy} deg={-28} len={58} wid={16} filled={false} />
              <Lobe cx={cx} cy={cy} deg={152} len={58} wid={16} filled={false} />
            </g>
          )}
          <Nucleus x={cx} y={cy} label="C" />
          <text
            x={cx}
            y={258}
            textAnchor="middle"
            className="fill-slate-400"
            style={{ font: '600 13px ui-sans-serif, system-ui' }}
          >
            {Math.round(nHybrid)} hybrid orbitals ·{' '}
            {t < 0.34 ? 'sp³' : t < 0.68 ? 'sp²' : 'sp'}
          </text>
        </g>
      ),
    };
  },
};

// ---------------------------------------------------------------------------
// 3. resonance-delocalisation
// ---------------------------------------------------------------------------
//
// The acetate ion. Two contributors and the hybrid, with the nuclei held
// deliberately fixed the whole way through: the single most common error in
// the topic is reading the double headed arrow as motion, so nothing moves
// except electrons.
const resonance: Scene = {
  viewBox: '0 0 620 300',
  frame: (t) => {
    const C = { x: 310, y: 160 };
    const OU = { x: 310, y: 74 };
    const OD = { x: 392, y: 208 };
    const ME = { x: 228, y: 208 };

    const arrows = t >= 0.24 && t < 0.52;
    const flipped = t >= 0.46 && t < 0.74;
    const hybrid = t >= 0.74;
    const hybFade = phase(t, 0.74, 0.88);

    const dbl = (a: typeof C, b: typeof C, show: boolean, op = 1) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const n = Math.hypot(dx, dy);
      const px = (-dy / n) * 4;
      const py = (dx / n) * 4;
      const sh = 15;
      return (
        <>
          <Bond
            x1={a.x + px}
            y1={a.y + py}
            x2={b.x - (sh * dx) / n + px}
            y2={b.y - (sh * dy) / n + py}
            opacity={op}
          />
          {show && (
            <Bond
              x1={a.x - px}
              y1={a.y - py}
              x2={b.x - (sh * dx) / n - px}
              y2={b.y - (sh * dy) / n - py}
              opacity={op}
            />
          )}
        </>
      );
    };

    return {
      caption: hybrid
        ? 'The hybrid: one ion, two equal carbon-oxygen bonds, half a negative charge on each oxygen. Sodium formate shows a single C-O distance of 127 pm, between a double bond and a single one.'
        : arrows
          ? 'A lone pair on the lower oxygen becomes a bond; the upper pi bond collapses to a lone pair. Only electrons move - every nucleus stays exactly where it was.'
          : flipped
            ? 'The second contributor. Same atoms in the same places, different electron placement.'
            : 'One contributing structure: a C=O to the upper oxygen and a negative charge on the lower one.',
      svg: (
        <g>
          <Bond x1={ME.x} y1={ME.y} x2={C.x} y2={C.y} />
          {hybrid ? (
            <g>
              {dbl(C, OU, false)}
              {dbl(C, OD, false)}
              <g opacity={hybFade}>
                <line
                  x1={C.x + 8}
                  y1={C.y}
                  x2={OU.x + 8}
                  y2={OU.y + 15}
                  className="stroke-slate-100"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                />
                <line
                  x1={C.x + 4}
                  y1={C.y + 7}
                  x2={OD.x - 9}
                  y2={OD.y - 4}
                  className="stroke-slate-100"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                />
                <text
                  x={OU.x + 44}
                  y={OU.y}
                  className="fill-amber-400"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ font: '600 14px ui-sans-serif, system-ui' }}
                >
                  ½−
                </text>
                <text
                  x={OD.x + 46}
                  y={OD.y}
                  className="fill-amber-400"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ font: '600 14px ui-sans-serif, system-ui' }}
                >
                  ½−
                </text>
              </g>
              <Atom x={OU.x} y={OU.y} label="O" />
              <Atom x={OD.x} y={OD.y} label="O" />
            </g>
          ) : (
            <g>
              {dbl(C, OU, !flipped)}
              {dbl(C, OD, flipped)}
              <Atom x={OU.x} y={OU.y} label={flipped ? 'O⁻' : 'O'} />
              <Atom x={OD.x} y={OD.y} label={flipped ? 'O' : 'O⁻'} />
              {arrows && (
                <>
                  <CurvedArrow
                    id="a"
                    x1={OD.x - 6}
                    y1={OD.y - 22}
                    x2={C.x + 26}
                    y2={C.y + 26}
                    bow={18}
                  />
                  <CurvedArrow
                    id="b"
                    x1={C.x - 12}
                    y1={C.y - 40}
                    x2={OU.x - 26}
                    y2={OU.y + 6}
                    bow={20}
                  />
                </>
              )}
            </g>
          )}
          <text
            x={310}
            y={268}
            textAnchor="middle"
            className="fill-slate-400"
            style={{ font: '600 13px ui-sans-serif, system-ui' }}
          >
            {hybrid ? 'the hybrid — the only thing that exists' : 'a contributing structure'}
          </text>
        </g>
      ),
    };
  },
};

// ---------------------------------------------------------------------------
// 4. oxidation-ladder
// ---------------------------------------------------------------------------
const oxidationLadder: Scene = {
  viewBox: '0 0 620 300',
  frame: (t) => {
    // rung 0 primary alcohol, 1 aldehyde, 2 carboxylic acid, then back down,
    // then the tertiary alcohol that cannot climb.
    const tert = t >= 0.82;
    const up = t < 0.52;
    const rung = tert
      ? 0
      : up
        ? Math.min(2, Math.floor(t / 0.175))
        : Math.max(0, 2 - Math.floor((t - 0.52) / 0.1));

    const C = { x: 300, y: 160 };
    const R = { x: 218, y: 208 };

    const names = ['primary alcohol', 'aldehyde', 'carboxylic acid'];
    const caption = tert
      ? 'A tertiary alcohol cannot climb at all. Oxidation replaces a C-H with a C-O, and this carbon has no hydrogen to replace - the only way up is to break a carbon-carbon bond.'
      : up
        ? `${names[rung]} — ${rung + 1} bond${rung ? 's' : ''} from this carbon to oxygen. Oxidation replaces one more C-H with a C-O.`
        : `Reduction walks back down the ladder: ${names[rung]}, ${rung + 1} bond${rung ? 's' : ''} to oxygen.`;

    return {
      caption,
      svg: (
        <g>
          <Bond x1={R.x} y1={R.y} x2={C.x} y2={C.y} />
          {tert ? (
            <>
              {/* two extra alkyl groups where the hydrogens would be */}
              <Bond x1={C.x} y1={C.y} x2={C.x + 78} y2={C.y + 48} />
              <Bond x1={C.x} y1={C.y} x2={C.x + 6} y2={C.y + 84} />
              <Bond x1={C.x} y1={C.y} x2={C.x} y2={C.y - 60} />
              <Atom x={C.x} y={C.y - 76} label="OH" />
              <text
                x={C.x + 96}
                y={C.y + 88}
                className="fill-slate-400"
                style={{ font: '600 12px ui-sans-serif, system-ui' }}
                textAnchor="middle"
              >
                no C–H here
              </text>
            </>
          ) : (
            <>
              {/* the C=O or C-O, by rung */}
              <Bond x1={C.x} y1={C.y} x2={C.x} y2={C.y - 60} />
              {rung >= 1 && (
                <Bond x1={C.x + 8} y1={C.y} x2={C.x + 8} y2={C.y - 60} />
              )}
              <Atom x={C.x + (rung >= 1 ? 4 : 0)} y={C.y - 76} label="O" />
              {rung === 0 && <Atom x={C.x + 34} y={C.y - 76} label="H" />}
              {rung === 2 ? (
                <>
                  <Bond x1={C.x} y1={C.y} x2={C.x + 74} y2={C.y + 44} />
                  <Atom x={C.x + 100} y={C.y + 54} label="OH" />
                </>
              ) : (
                <>
                  <Bond
                    x1={C.x}
                    y1={C.y}
                    x2={C.x + 60}
                    y2={C.y + 38}
                    dashed
                    opacity={0.35}
                  />
                  <text
                    x={C.x + 84}
                    y={C.y + 46}
                    className="fill-slate-400"
                    style={{ font: '600 13px ui-sans-serif, system-ui' }}
                    textAnchor="middle"
                  >
                    H
                  </text>
                </>
              )}
            </>
          )}
          <Nucleus x={C.x} y={C.y} label="C" />
          {/* the ladder gauge: how many bonds this carbon has to oxygen */}
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={452 + i * 34}
              y={244}
              width={26}
              height={9}
              rx={4}
              className={
                !tert && i <= rung ? 'fill-brand-500' : 'fill-slate-100/20'
              }
            />
          ))}
          <text
            x={438}
            y={249}
            textAnchor="end"
            dominantBaseline="central"
            className="fill-slate-400"
            style={{ font: '600 12px ui-sans-serif, system-ui' }}
          >
            C–O bonds
          </text>
        </g>
      ),
    };
  },
};

// Keyed by the lesson data's video SLUG (VideoLesson.slug), so the learn page
// can ask "is there a computed scene for this slot?" with the same identifier
// that names the uploaded file. The old scene ids died with the schema's
// `scene` field in 49244e14.
export const SCENES: Record<string, Scene> = {
  'org1-sigma-pi-overlap': sigmaPi,
  'org1-hybridisation': hybridMorph,
  'org1-resonance': resonance,
  'org1-oxidation-ladder': oxidationLadder,
};

export function hasScene(id: string): boolean {
  return id in SCENES;
}

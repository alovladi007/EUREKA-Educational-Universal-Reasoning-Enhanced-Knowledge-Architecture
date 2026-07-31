'use client';

/**
 * The bench: one scene and one readout per kind of scenario.
 *
 * These render the scenarios in OCTET's simulations.py, whose curves and
 * outcomes were computed by chem_core at export time. Nothing here decides
 * any chemistry: the burette position indexes into a curve that already
 * exists, and the flask colour is read off the pH at that point.
 *
 * The bench is deliberately a bench rather than a graph. A titration curve on
 * its own is a symbolic object, and the thing a learner needs is the link
 * between the colour changing in front of them and the vertical stretch of
 * that curve. Showing both, driven by one slider, is the Johnstone connector
 * made operable.
 *
 * The rule the newer scenes are built under is that a scene may only show what
 * the export actually carries. A kinetics result carries rates and rate
 * constants and no concentrations, so a kinetics scene may not claim a particle
 * count it was not given; a catalyst changes no temperature, so its particles
 * may not be drawn moving faster. Where a quantity cannot be drawn faithfully
 * the scene either omits it or states the distortion on screen, because a
 * plausible wrong animation is more convincing, and therefore worse, than no
 * animation at all.
 */

import { useMemo, useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import type {
  EquilibriumDerived,
  GasComparisonDerived,
  GasDerived,
  KineticsDerived,
  TitrationDerived,
} from './contentTypes';
import { PanelTitle, Stat } from './ui';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * A deterministic generator, so a vessel does not reshuffle its contents on
 * every render. Which particle is where carries no meaning; a cloud that
 * jumps every time React re-renders implies that it does.
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Formats a value that may span several orders of magnitude. */
function num(n: number): string {
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 1000) return n.toFixed(0);
  if (abs >= 1) return n.toFixed(3);
  if (abs >= 0.001) {
    // Trim the zeros toPrecision pads with, so 0.0054 is not printed as
    // 0.00540 and claiming a significant figure the export did not give.
    return n.toPrecision(3).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  }
  return n.toExponential(2);
}

/**
 * The units of a rate constant, which depend on the overall order. Derived
 * rather than written next to each scenario, because a hardcoded "1/s" beside
 * a second order constant is exactly the kind of quiet wrongness that survives
 * review.
 */
function rateConstantUnits(order: number): string {
  if (order === 1) return '1/s';
  if (order === 2) return '1/(M s)';
  if (order === 0) return 'M/s';
  return `M^${1 - order} 1/s`;
}

/** The wireframe edges of a reaction vessel. */
function BoxFrame({ side, colour = '#64748b' }: { side: number; colour?: string }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(side, side, side), [side]);
  return (
    <lineSegments>
      <edgesGeometry args={[geometry]} />
      <lineBasicMaterial color={colour} transparent opacity={0.5} />
    </lineSegments>
  );
}

/**
 * Particles bouncing inside a cube.
 *
 * Every particle carries the SAME speed, because in these scenarios speed is
 * set by temperature and by nothing else. Giving them a spread would look more
 * convincing and would be a claim about a distribution the export does not
 * carry.
 */
function ParticleBox({
  side,
  count,
  speed,
  colour,
  seed,
}: {
  side: number;
  count: number;
  /** Scene units per second. */
  speed: number;
  colour: string;
  seed: number;
}) {
  const geomRef = useRef<THREE.BufferGeometry>(null);

  const sim = useMemo(() => {
    const rnd = seededRandom(seed);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      for (let a = 0; a < 3; a += 1) {
        pos[i * 3 + a] = (rnd() - 0.5) * side * 0.94;
        vel[i * 3 + a] = rnd() - 0.5;
      }
      const n =
        Math.hypot(vel[i * 3], vel[i * 3 + 1], vel[i * 3 + 2]) || 1;
      for (let a = 0; a < 3; a += 1) vel[i * 3 + a] /= n;
    }
    return { pos, vel };
  }, [count, side, seed]);

  useFrame((_, dt) => {
    // Clamped: a tab that was backgrounded returns one enormous delta, which
    // would teleport every particle out through a wall.
    const step = Math.min(dt, 0.05) * speed;
    const half = side / 2;
    const { pos, vel } = sim;
    for (let i = 0; i < pos.length; i += 1) {
      let p = pos[i] + vel[i] * step;
      if (p > half) {
        p = half;
        vel[i] = -vel[i];
      } else if (p < -half) {
        p = -half;
        vel[i] = -vel[i];
      }
      pos[i] = p;
    }
    const attr = geomRef.current?.attributes.position;
    if (attr) attr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[sim.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={colour}
        sizeAttenuation
        transparent
        opacity={0.95}
      />
    </points>
  );
}

/** The placeholder standing where a withheld half of a comparison will go. */
function WithheldBox({
  position,
  side,
  label,
}: {
  position: [number, number, number];
  side: number;
  label: string;
}) {
  return (
    <group position={position}>
      <BoxFrame side={side} colour="#475569" />
      <Html center distanceFactor={11}>
        <div className="pointer-events-none w-40 rounded-lg border border-dashed border-white/25 bg-black/70 px-2.5 py-2 text-center text-[10px] leading-relaxed text-white/55 backdrop-blur-md">
          {label}
        </div>
      </Html>
    </group>
  );
}

/** A caption fixed above a vessel. */
function VesselLabel({
  position,
  children,
}: {
  position: [number, number, number];
  children: React.ReactNode;
}) {
  return (
    <Html center distanceFactor={11} position={position}>
      <div className="pointer-events-none whitespace-nowrap rounded-lg border border-white/15 bg-black/75 px-2.5 py-1.5 text-center text-[10px] leading-relaxed text-white/80 backdrop-blur-md">
        {children}
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Indicator colour
// ---------------------------------------------------------------------------

/**
 * Phenolphthalein, the indicator these titrations would actually use.
 *
 * Colourless below about pH 8.3, pink above about 10, with the transition in
 * between. Those endpoints are the standard cited range (Silverman /
 * Harris, Quantitative Chemical Analysis, indicator tables), and the
 * interpolation between them is a rendering choice, not a claim about the
 * dye's absorbance curve.
 */
function indicatorColour(ph: number): THREE.Color {
  const clear = new THREE.Color('#dbeafe');
  const pink = new THREE.Color('#ec4899');
  const t = Math.max(0, Math.min(1, (ph - 8.3) / (10.0 - 8.3)));
  return clear.clone().lerp(pink, t);
}

// ---------------------------------------------------------------------------
// Titration bench
// ---------------------------------------------------------------------------

export function TitrationBench({
  derived,
  volume,
  running,
}: {
  derived: TitrationDerived;
  /** Titrant delivered so far, mL. */
  volume: number;
  running: boolean;
}) {
  const dropRef = useRef<THREE.Mesh>(null);
  const maxV = derived.curve[derived.curve.length - 1]?.v ?? 50;

  const ph = useMemo(() => {
    // Nearest computed point. No interpolation: the curve is the result, and
    // inventing values between its points would be inventing chemistry.
    let best = derived.curve[0];
    for (const p of derived.curve) {
      if (Math.abs(p.v - volume) < Math.abs(best.v - volume)) best = p;
    }
    return best.ph;
  }, [derived.curve, volume]);

  const colour = useMemo(() => indicatorColour(ph), [ph]);
  // Liquid level rises as titrant is added.
  const fill = 0.55 + (volume / maxV) * 0.25;

  useFrame(({ clock }) => {
    if (!dropRef.current) return;
    if (!running) {
      dropRef.current.visible = false;
      return;
    }
    dropRef.current.visible = true;
    // A drop falling from the burette tip to the surface, on a loop.
    const t = (clock.getElapsedTime() * 1.6) % 1;
    dropRef.current.position.y = 1.5 - t * (1.5 - (fill - 0.4));
  });

  return (
    <group>
      {/* Burette: a tall thin cylinder above the flask. */}
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 2.2, 24, 1, true]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          roughness={0.1}
        />
      </mesh>
      {/* Titrant remaining in the burette. */}
      <mesh position={[0, 2.6 + (volume / maxV) * 1.05, 0]}>
        <cylinderGeometry
          args={[0.11, 0.11, Math.max(0.02, 2.1 * (1 - volume / maxV)), 20]}
        />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.75} />
      </mesh>
      {/* Tip. */}
      <mesh position={[0, 1.42, 0]}>
        <coneGeometry args={[0.1, 0.24, 16]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.35} />
      </mesh>

      {/* The falling drop. */}
      <mesh ref={dropRef} position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshStandardMaterial color="#bfdbfe" />
      </mesh>

      {/* Conical flask, as a truncated cone. */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.42, 0.95, 1.4, 32, 1, true]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
          roughness={0.05}
        />
      </mesh>
      {/* Neck. */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 24, 1, true]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* The solution. Its colour is the indicator reading the computed pH. */}
      <mesh position={[0, 0.03 + (fill - 0.55) / 2, 0]}>
        <cylinderGeometry args={[0.62, 0.93, Math.max(0.1, fill - 0.1), 32]} />
        <meshStandardMaterial
          color={colour}
          transparent
          opacity={0.82}
          roughness={0.25}
          emissive={colour}
          emissiveIntensity={0.16}
        />
      </mesh>

      {/* Live pH readout, floating beside the flask like a probe display. */}
      <Html center distanceFactor={9} position={[1.55, 0.7, 0]}>
        <div className="pointer-events-none rounded-lg border border-white/15 bg-black/75 px-2.5 py-1.5 text-center backdrop-blur-md">
          <div className="text-[9px] uppercase tracking-wider text-white/50">
            pH meter
          </div>
          <div className="font-mono text-lg font-bold text-white">
            {ph.toFixed(2)}
          </div>
          <div className="text-[9px] text-white/45">
            {volume.toFixed(2)} mL added
          </div>
        </div>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Equilibrium vessel
// ---------------------------------------------------------------------------

/**
 * A closed vessel of particles at equilibrium, and what a stress does to it.
 *
 * The particle counts are proportional to the concentrations chem_core
 * derived, before and after the stress. What the animation shows honestly is
 * the thing GEN2M04 gets wrong: at equilibrium the particles keep reacting,
 * and it is the counts that stop changing, not the chemistry.
 */
export function EquilibriumVessel({
  derived,
  showStressed,
}: {
  derived: EquilibriumDerived;
  showStressed: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const conc = showStressed ? derived.result.final : derived.result.stressed;

  const species = useMemo(() => {
    const colours: Record<string, string> = {
      H2: '#f1f5f9',
      I2: '#a855f7',
      HI: '#38bdf8',
    };
    const entries = Object.entries(conc);
    const scale = 260; // particles per molar, chosen for legibility
    return entries.map(([name, molar]) => ({
      name,
      colour: colours[name] ?? '#94a3b8',
      count: Math.max(1, Math.round(molar * scale)),
      molar,
    }));
  }, [conc]);

  const points = useMemo(() => {
    const rnd = seededRandom(7);
    return species.map((s) => {
      const arr = new Float32Array(s.count * 3);
      for (let i = 0; i < s.count; i += 1) {
        arr[i * 3] = (rnd() - 0.5) * 3.2;
        arr[i * 3 + 1] = (rnd() - 0.5) * 3.2;
        arr[i * 3 + 2] = (rnd() - 0.5) * 3.2;
      }
      return { ...s, arr };
    });
  }, [species]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.12;
  });

  return (
    <group ref={group}>
      {/* The vessel. */}
      <mesh>
        <boxGeometry args={[3.4, 3.4, 3.4]} />
        <meshStandardMaterial
          color="#94a3b8"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3.4, 3.4, 3.4)]} />
        <lineBasicMaterial color="#64748b" transparent opacity={0.5} />
      </lineSegments>

      {points.map((s) => (
        <points key={s.name}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[s.arr, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.13}
            color={s.colour}
            sizeAttenuation
            transparent
            opacity={0.95}
          />
        </points>
      ))}

      <Html center distanceFactor={11} position={[0, 2.4, 0]}>
        <div className="pointer-events-none flex gap-2 rounded-lg border border-white/15 bg-black/75 px-2.5 py-1.5 backdrop-blur-md">
          {species.map((s) => (
            <span key={s.name} className="flex items-center gap-1 whitespace-nowrap">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: s.colour }}
              />
              <span className="text-[10px] text-white/80">
                {s.name} {s.molar.toFixed(4)} M
              </span>
            </span>
          ))}
        </div>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// The curve, as a 2D overlay
// ---------------------------------------------------------------------------

export function TitrationCurve({
  derived,
  volume,
  width = 280,
  height = 150,
}: {
  derived: TitrationDerived;
  volume: number;
  width?: number;
  height?: number;
}) {
  const pad = 26;
  const maxV = derived.curve[derived.curve.length - 1]?.v ?? 50;
  const x = (v: number) => pad + (v / maxV) * (width - pad - 8);
  const y = (ph: number) => height - pad - (ph / 14) * (height - pad - 8);

  const path = derived.curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.v).toFixed(1)} ${y(p.ph).toFixed(1)}`)
    .join(' ');

  const eqV = derived.landmarks.equivalence_volume_mL;
  const eqPh = derived.landmarks.equivalence_pH;
  const halfPh = derived.landmarks.half_equivalence_pH;

  // The visible point is the nearest computed one, matching the bench.
  let cur = derived.curve[0];
  for (const p of derived.curve) {
    if (Math.abs(p.v - volume) < Math.abs(cur.v - volume)) cur = p;
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* pH 7 reference. */}
      <line
        x1={pad} y1={y(7)} x2={width - 8} y2={y(7)}
        stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3"
      />
      <text x={pad - 4} y={y(7) + 3} textAnchor="end" className="fill-white/35 text-[8px]">7</text>
      <text x={pad - 4} y={y(14) + 3} textAnchor="end" className="fill-white/35 text-[8px]">14</text>
      <text x={pad - 4} y={y(0) + 3} textAnchor="end" className="fill-white/35 text-[8px]">0</text>

      {/* Equivalence marker. */}
      <line
        x1={x(eqV)} y1={pad - 18} x2={x(eqV)} y2={height - pad}
        stroke="rgba(251,191,36,0.45)" strokeDasharray="3 3"
      />
      <circle cx={x(eqV)} cy={y(eqPh)} r={3.5} fill="#fbbf24" />
      <text x={x(eqV) + 5} y={y(eqPh) - 5} className="fill-amber-300 text-[8px]">
        equivalence {eqPh.toFixed(2)}
      </text>

      {/* Half equivalence, where pH = pKa for a weak acid. */}
      <circle cx={x(eqV / 2)} cy={y(halfPh)} r={3} fill="#a78bfa" />
      <text x={x(eqV / 2) + 5} y={y(halfPh) + 10} className="fill-violet-300 text-[8px]">
        half eq {halfPh.toFixed(2)}
      </text>

      <path d={path} fill="none" stroke="#38bdf8" strokeWidth={2} />

      {/* Where the burette currently is. */}
      <circle cx={x(cur.v)} cy={y(cur.ph)} r={4.5} fill="#f43f5e" />

      <line
        x1={pad} y1={height - pad} x2={width - 8} y2={height - pad}
        stroke="rgba(255,255,255,0.2)"
      />
      <text
        x={(width + pad) / 2} y={height - pad + 12}
        textAnchor="middle" className="fill-white/35 text-[8px]"
      >
        titrant added (mL)
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Kinetics
// ---------------------------------------------------------------------------

/**
 * How far apart the two pulse rates are allowed to look.
 *
 * The exported ratios run from 4 to 3190. Pulsing three thousand times faster
 * is not a faster pulse, it is a solid glow, and a learner counting flashes
 * would read it as perhaps twenty. So the scene compresses the ratio and says
 * on screen that it has, with the true number sitting unrounded in the panel.
 */
const MAX_VISIBLE_RATE_RATIO = 8;

/** Base pulse rate for the unstressed vessel, in events per second. */
const BASE_PULSE_HZ = 0.7;

/** One flash per reaction event. */
function ReactionPulse({ hz, colour }: { hz: number; colour: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useRef(0);

  useFrame((_, dt) => {
    if (!ref.current) return;
    phase.current = (phase.current + Math.min(dt, 0.05) * hz) % 1;
    // A sharp flash decaying over the first quarter of each cycle, so the
    // events stay countable rather than blurring into a throb.
    const s = Math.max(0, 1 - phase.current * 4);
    // Small and nearly invisible at rest. A sphere that is always plainly there
    // reads as an object in the vessel rather than as an event happening in it,
    // and there is no such object.
    ref.current.scale.setScalar(0.09 + s * 0.4);
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.opacity = 0.05 + s * 0.85;
    m.emissiveIntensity = 0.1 + s * 2.4;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 20, 16]} />
      <meshStandardMaterial
        color={colour}
        emissive={colour}
        transparent
        opacity={0.05}
      />
    </mesh>
  );
}

/**
 * Two vessels, before and after the change, with the reaction rate carried by
 * how often each one pulses.
 *
 * Three decisions here are about what may NOT be drawn.
 *
 * The particles move at the same speed on both sides. Every kinetics scenario
 * in the export holds the temperature fixed, so drawing the catalysed vessel
 * with faster particles would illustrate the exact misconception the catalysis
 * item is about.
 *
 * The particle COUNT only differs when the scenario says a concentration
 * changed. The derived result carries rates and rate constants and no
 * concentrations at all, so a count read off anything else would be invented.
 * Where the stress is a concentration factor, the count carries it, and the
 * second-order case then shows its own teaching: twice the particles, four
 * times the pulse.
 *
 * The pulse ratio is capped, and the cap is printed rather than hidden.
 */
export function KineticsVessels({
  derived,
  stress,
  showAfter,
}: {
  derived: KineticsDerived;
  stress: Record<string, number>;
  showAfter: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { ratio } = derived.result;
  const side = 2.7;
  const baseCount = 40;
  // Only a stress that names a concentration may move the count.
  const concentrationFactor = stress.concentration_factor ?? 1;
  const afterCount = Math.max(1, Math.round(baseCount * concentrationFactor));
  const shownRatio = Math.min(ratio, MAX_VISIBLE_RATE_RATIO);
  const capped = ratio > MAX_VISIBLE_RATE_RATIO;

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.1;
  });

  return (
    <group>
      {/* Rotating together, so the rotation makes no claim about either side. */}
      <group ref={group}>
        <group position={[-2.3, 0, 0]}>
          <BoxFrame side={side} />
          <ParticleBox
            side={side}
            count={baseCount}
            speed={0.55}
            colour="#94a3b8"
            seed={11}
          />
          <ReactionPulse hz={BASE_PULSE_HZ} colour="#38bdf8" />
        </group>

        {showAfter && (
          <group position={[2.3, 0, 0]}>
            <BoxFrame side={side} />
            <ParticleBox
              side={side}
              count={afterCount}
              speed={0.55}
              colour="#94a3b8"
              seed={29}
            />
            <ReactionPulse hz={BASE_PULSE_HZ * shownRatio} colour="#fbbf24" />
          </group>
        )}
      </group>

      <VesselLabel position={[-2.3, 2.1, 0]}>
        before: {baseCount} particles
      </VesselLabel>

      {showAfter ? (
        <VesselLabel position={[2.3, 2.1, 0]}>
          after: {afterCount} particles
          <br />
          {capped
            ? `pulse shown ${MAX_VISIBLE_RATE_RATIO} times faster, capped`
            : `pulse ${num(ratio)} times faster`}
        </VesselLabel>
      ) : (
        <WithheldBox
          position={[2.3, 0, 0]}
          side={side}
          label="After the change. Hidden until you commit a prediction."
        />
      )}

      <Html center distanceFactor={13} position={[0, -2.45, 0]}>
        <div className="pointer-events-none w-72 rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-center text-[10px] leading-relaxed text-white/50 backdrop-blur-md">
          Each flash is one reaction event. Particle speed is the same on both
          sides because every one of these scenarios holds the temperature
          fixed. The counts differ only when the scenario changed a
          concentration.
          {capped
            ? ' The true rate ratio is too large to animate, so the flashes are compressed; the panel has the real number.'
            : ''}
        </div>
      </Html>
    </group>
  );
}

export function KineticsReadout({ derived }: { derived: KineticsDerived }) {
  const r = derived.result;
  const units = rateConstantUnits(r.order);
  const constantHeld = Math.abs(r.k_after - r.k_before) < 1e-12;

  return (
    <div>
      <Stat
        label="Order in the changed species"
        value={<span className="text-sky-300">{r.order}</span>}
        hint="The exponent in the rate law. It is what turns a change in concentration into a change in rate, and it is not read off the balanced equation."
      />
      <Stat label="Rate before" value={`${num(r.rate_before)} M/s`} />
      <Stat
        label="Rate after"
        value={<span className="text-amber-300">{num(r.rate_after)} M/s</span>}
      />
      <Stat
        label="Rate after over rate before"
        value={<span className="text-amber-300">{num(r.ratio)} times</span>}
        hint="The whole prediction is this one number."
      />
      <Stat label="Rate constant before" value={`${num(r.k_before)} ${units}`} />
      <Stat
        label="Rate constant after"
        value={
          <span className={constantHeld ? 'text-white' : 'text-amber-300'}>
            {num(r.k_after)} {units}
          </span>
        }
        hint="Only temperature and the activation barrier move this number. Changing a concentration does not."
      />
      <Stat
        label="Half life"
        value={`${num(r.half_life_s)} s`}
        hint={
          r.order === 1
            ? 'For a first order reaction this is the same whatever the concentration.'
            : 'For this order the half life depends on the starting concentration, so it is not a constant of the reaction.'
        }
      />
      <p className="mt-2 text-[10px] leading-relaxed text-white/40">
        The rate constant units are derived from the order rather than written
        alongside the numbers.
        {r.source ? ` ${r.source}` : ''}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gases
// ---------------------------------------------------------------------------

/**
 * Metres per second per scene unit.
 *
 * Absolute speed is meaningless on screen, so it is scaled for legibility. The
 * RATIO between any two speeds drawn is exact, which is the only thing these
 * scenes claim about them.
 */
const RMS_PER_SCENE_UNIT = 700;

/** How far a real pressure sits from the ideal one, as a percentage. */
function departurePercent(real: number, ideal: number): number {
  if (ideal === 0) return 0;
  return ((real - ideal) / ideal) * 100;
}

/**
 * One gas, before and after the container changed.
 *
 * The two boxes hold the same number of particles at the same speed, and only
 * the volume differs. That is the whole of Boyle's law at the particulate
 * level: nothing was added, nothing sped up, and the walls simply arrived
 * sooner.
 */
export function GasVessels({
  derived,
  stress,
  showAfter,
}: {
  derived: GasDerived;
  stress: Record<string, number>;
  showAfter: boolean;
}) {
  const r = derived.result;
  const sideBefore = 2.8;
  const volumeFactor = stress.volume_factor ?? 1;
  // A volume factor is a factor on the volume, so the side goes as its cube
  // root. Scaling the side by the factor directly would understate a
  // compression by a factor of four.
  const sideAfter = sideBefore * Math.cbrt(volumeFactor);
  const count = 55;

  return (
    <group>
      <group position={[-2.3, 0, 0]}>
        <BoxFrame side={sideBefore} />
        <ParticleBox
          side={sideBefore}
          count={count}
          speed={r.rms_before_m_per_s / RMS_PER_SCENE_UNIT}
          colour="#bfdbfe"
          seed={13}
        />
      </group>
      <VesselLabel position={[-2.3, 2.2, 0]}>
        before: {count} particles
        <br />
        {r.pressure_before_bar.toFixed(3)} bar
      </VesselLabel>

      {showAfter ? (
        <>
          <group position={[2.3, 0, 0]}>
            <BoxFrame side={sideAfter} colour="#fbbf24" />
            <ParticleBox
              side={sideAfter}
              count={count}
              speed={r.rms_after_m_per_s / RMS_PER_SCENE_UNIT}
              colour="#bfdbfe"
              seed={31}
            />
          </group>
          <VesselLabel position={[2.3, 2.2, 0]}>
            after: {count} particles
            <br />
            {r.pressure_after_bar.toFixed(3)} bar
          </VesselLabel>
        </>
      ) : (
        <WithheldBox
          position={[2.3, 0, 0]}
          side={sideBefore}
          label="After the container changed. Hidden until you commit a prediction."
        />
      )}

      <Html center distanceFactor={13} position={[0, -2.45, 0]}>
        <div className="pointer-events-none w-72 rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-center text-[10px] leading-relaxed text-white/50 backdrop-blur-md">
          The same particles at the same speed in a different amount of room.
          Nothing was added and nothing was heated, so the only thing that
          changed is how soon each particle meets a wall.
        </div>
      </Html>
    </group>
  );
}

export function GasReadout({ derived }: { derived: GasDerived }) {
  const r = derived.result;
  // Computed from the two pressures on the panel rather than read from the
  // exported departure field, whose units the export does not state. Both
  // numbers are on screen, so the arithmetic is checkable.
  const before = departurePercent(r.pressure_before_bar, r.ideal_before_bar);
  const after = departurePercent(r.pressure_after_bar, r.ideal_after_bar);
  const speedHeld =
    Math.abs(r.rms_after_m_per_s - r.rms_before_m_per_s) < 1e-6;

  return (
    <div>
      <Stat label="Pressure before" value={`${r.pressure_before_bar.toFixed(3)} bar`} />
      <Stat
        label="Pressure after"
        value={
          <span className="text-amber-300">
            {r.pressure_after_bar.toFixed(3)} bar
          </span>
        }
      />
      <Stat
        label="Pressure after over before"
        value={<span className="text-amber-300">{r.ratio.toFixed(3)}</span>}
      />
      <Stat
        label="Ideal pressure before"
        value={`${r.ideal_before_bar.toFixed(3)} bar`}
        hint="What the ideal gas law alone would give for this state."
      />
      <Stat
        label="Ideal pressure after"
        value={`${r.ideal_after_bar.toFixed(3)} bar`}
      />
      <Stat
        label="Departure from ideal, before"
        value={`${before.toFixed(2)} percent`}
        hint="Real minus ideal, over ideal. Computed from the two pressures above."
      />
      <Stat
        label="Departure from ideal, after"
        value={`${after.toFixed(2)} percent`}
      />
      <Stat
        label="rms speed before"
        value={`${r.rms_before_m_per_s.toFixed(1)} m/s`}
      />
      <Stat
        label="rms speed after"
        value={
          <span className={speedHeld ? 'text-emerald-300' : 'text-amber-300'}>
            {r.rms_after_m_per_s.toFixed(1)} m/s
          </span>
        }
        hint="Root mean square molecular speed, which is set by temperature and molar mass."
      />
      {speedHeld && (
        <p className="mt-2 text-[11px] leading-relaxed text-emerald-200/80">
          The two speeds are identical to every figure the export carries. The
          gas was compressed and the molecules did not speed up, because nothing
          changed the temperature.
        </p>
      )}
      {r.source && (
        <p className="mt-2 text-[10px] leading-relaxed text-white/40">
          {r.source}
        </p>
      )}
    </div>
  );
}

/**
 * Two gases at one temperature, side by side.
 *
 * Same box, same particle count, and speeds in exactly the exported ratio. The
 * contrast IS the teaching, so nothing else is allowed to differ between the
 * two halves: different sizes or different colours per mass would give a
 * learner a second thing to attribute the difference to.
 */
export function GasComparisonVessels({
  derived,
  show,
}: {
  derived: GasComparisonDerived;
  show: boolean;
}) {
  const r = derived.result;
  const side = 2.7;
  const count = 50;

  if (!show) {
    return (
      <WithheldBox
        position={[0, 0, 0]}
        side={side}
        label="Two gases in identical containers at the same temperature. The comparison appears once you commit a prediction."
      />
    );
  }

  return (
    <group>
      <group position={[-2.2, 0, 0]}>
        <BoxFrame side={side} />
        <ParticleBox
          side={side}
          count={count}
          speed={r.rms_a_m_per_s / RMS_PER_SCENE_UNIT}
          colour="#7dd3fc"
          seed={17}
        />
      </group>
      <VesselLabel position={[-2.2, 2.1, 0]}>
        gas A
        <br />
        rms {r.rms_a_m_per_s.toFixed(0)} m/s
      </VesselLabel>

      <group position={[2.2, 0, 0]}>
        <BoxFrame side={side} />
        <ParticleBox
          side={side}
          count={count}
          speed={r.rms_b_m_per_s / RMS_PER_SCENE_UNIT}
          colour="#c4b5fd"
          seed={37}
        />
      </group>
      <VesselLabel position={[2.2, 2.1, 0]}>
        gas B
        <br />
        rms {r.rms_b_m_per_s.toFixed(0)} m/s
      </VesselLabel>

      <Html center distanceFactor={13} position={[0, -2.45, 0]}>
        <div className="pointer-events-none w-72 rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-center text-[10px] leading-relaxed text-white/50 backdrop-blur-md">
          Same container, same particle count, same temperature. The speeds are
          drawn in the exported ratio; the absolute pace is scaled to be
          watchable. Which gas is A and which is B is named in the scenario
          description.
        </div>
      </Html>
    </group>
  );
}

export function GasComparisonReadout({
  derived,
}: {
  derived: GasComparisonDerived;
}) {
  const r = derived.result;
  const energiesEqual = Math.abs(r.ke_a_J_per_mol - r.ke_b_J_per_mol) < 1e-6;
  const speedRatio =
    r.rms_b_m_per_s === 0 ? 0 : r.rms_a_m_per_s / r.rms_b_m_per_s;

  return (
    <div>
      <PanelTitle>Mean kinetic energy</PanelTitle>
      <Stat label="Gas A" value={`${r.ke_a_J_per_mol.toFixed(1)} J/mol`} />
      <Stat
        label="Gas B"
        value={
          <span className={energiesEqual ? 'text-emerald-300' : 'text-amber-300'}>
            {r.ke_b_J_per_mol.toFixed(1)} J/mol
          </span>
        }
        hint="Mean translational kinetic energy per mole."
      />
      <Stat
        label="Difference"
        value={
          energiesEqual ? (
            <span className="text-emerald-300">none</span>
          ) : (
            `${Math.abs(r.ke_a_J_per_mol - r.ke_b_J_per_mol).toFixed(1)} J/mol`
          )
        }
      />

      <div className="mt-3">
        <PanelTitle>Root mean square speed</PanelTitle>
      </div>
      <Stat label="Gas A" value={`${r.rms_a_m_per_s.toFixed(1)} m/s`} />
      <Stat
        label="Gas B"
        value={
          <span className="text-amber-300">{r.rms_b_m_per_s.toFixed(1)} m/s</span>
        }
      />
      <Stat
        label="Speed ratio A over B"
        value={<span className="text-amber-300">{speedRatio.toFixed(3)}</span>}
      />

      <div className="mt-3">
        <PanelTitle>What follows from the speeds</PanelTitle>
      </div>
      <Stat
        label="Effusion ratio A over B"
        value={r.effusion_ratio_a_over_b.toFixed(3)}
        hint="Graham's law. It matches the speed ratio because effusion goes with molecular speed."
      />
      <Stat
        label="Same temperature"
        value={r.same_temperature ? 'yes' : 'no'}
        hint="The premise of the comparison, and the reason the energies come out where they do."
      />

      <p className="mt-2 text-[11px] leading-relaxed text-white/70">
        {energiesEqual
          ? 'One pair is equal and the other is not, from the same two gases at the same temperature. Speed and kinetic energy are not the same quantity, and the heavier gas makes up in mass exactly what it loses in speed.'
          : 'The energies differ, so something other than temperature is different between these two gases.'}
      </p>
      {r.source && (
        <p className="mt-2 text-[10px] leading-relaxed text-white/40">
          {r.source}
        </p>
      )}
    </div>
  );
}

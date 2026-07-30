'use client';

/**
 * The titration bench and the equilibrium vessel.
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
 */

import { useMemo, useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import type { EquilibriumDerived, TitrationDerived } from './contentTypes';

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
    // Deterministic placement so the vessel does not reshuffle every render.
    let seed = 7;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
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

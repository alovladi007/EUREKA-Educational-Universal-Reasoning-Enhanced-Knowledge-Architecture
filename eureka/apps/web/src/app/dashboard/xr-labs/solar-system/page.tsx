"use client";

/**
 * /dashboard/xr-labs/solar-system — interactive 3D solar system viewer.
 *
 * Inspired by NASA's "Eyes on the Solar System" (eyes.nasa.gov) but built
 * from scratch with original code + procedural visuals — no NASA / JPL
 * imagery, no third-party textures, no copyrighted assets. The body data
 * (mass, orbital period, day length, etc.) is factual scientific
 * information which is not copyrightable.
 *
 * Visual approach (no textures, all procedural):
 *   - Each planet uses MeshStandardMaterial with a representative solid
 *     color + roughness tuning. Saturn gets a translucent ring.
 *   - Background: drei's <Stars> primitive (procedural starfield).
 *   - The Sun is emissive (MeshBasicMaterial) and also acts as the
 *     scene's single PointLight, so planets are lit from the center.
 *
 * Scaling caveats (necessary for visibility):
 *   - Real Sun radius / Neptune orbit ratio ≈ 1 : 6500. We can't show
 *     both at true scale. Planet sizes are inflated 1000x+ to be
 *     visible, and orbital distances are compressed logarithmically.
 *     The relative ordering and proportions are roughly preserved.
 *   - Real orbital periods ARE proportional (Earth = 1.0, Mercury 0.241,
 *     Jupiter 11.86, etc.) — simulation time is the only thing we
 *     stretch via the speed control.
 *
 * Interactions:
 *   - OrbitControls (mouse drag = rotate, wheel = zoom, right-drag = pan)
 *   - Click a body → info panel with real-world facts
 *   - Space = pause/play, R = reset camera
 *   - Speed selector (0.5x / 1x / 5x / 50x / 500x of "Earth year in 30s")
 *
 * Performance: ~20k vertices total, runs at 60fps on any modern GPU.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Info,
  X,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────
// Real planetary data — sourced from publicly-available astronomy facts.
// Facts (mass, period, distance, day length) are not copyrightable.
// ────────────────────────────────────────────────────────────────────────

type Body = {
  id: string;
  name: string;
  color: number;
  emissive?: number;
  emissiveIntensity?: number;
  size: number; // visual scene units
  orbit: number; // visual scene units from Sun center
  period: number; // orbital period in Earth years (Earth = 1.0)
  day: number; // sidereal rotation in Earth days (negative = retrograde)
  tilt: number; // axial tilt in radians
  rings?: { inner: number; outer: number; color: number };
  moons?: number;
  facts: {
    type: string;
    diameter: string;
    mass: string;
    distance: string;
    period: string;
    day: string;
    moons: string;
    description: string;
  };
};

const SUN: Body = {
  id: "sun",
  name: "Sun",
  color: 0xfdb813,
  emissive: 0xfdb813,
  emissiveIntensity: 1,
  size: 2.5,
  orbit: 0,
  period: 0,
  day: 25.05,
  tilt: 0.127,
  facts: {
    type: "G-type main-sequence star (yellow dwarf)",
    diameter: "1,392,700 km (≈109 × Earth)",
    mass: "1.989 × 10³⁰ kg (333,000 × Earth)",
    distance: "—",
    period: "—",
    day: "25.05 days at equator (differential rotation)",
    moons: "—",
    description:
      "The Sun contains 99.86% of the Solar System's mass. Its core fuses ~4 million tonnes of hydrogen to helium per second, releasing energy as photons that take ~170,000 years to random-walk from core to surface, then 8.3 minutes to reach Earth.",
  },
};

const PLANETS: Body[] = [
  {
    id: "mercury",
    name: "Mercury",
    color: 0x8c7853,
    size: 0.38,
    orbit: 6,
    period: 0.241,
    day: 58.6,
    tilt: 0.0006, // basically no tilt
    facts: {
      type: "Terrestrial (rocky)",
      diameter: "4,879 km",
      mass: "3.301 × 10²³ kg (0.055 × Earth)",
      distance: "57.9 million km (0.39 AU)",
      period: "88 Earth days",
      day: "58.6 Earth days (3:2 spin-orbit resonance)",
      moons: "0",
      description:
        "The smallest planet and closest to the Sun. Surface temperatures swing from −173°C at night to +427°C in sunlight. Mercury has no atmosphere to retain heat. Day length here means one sidereal day; a solar day is 176 Earth days.",
    },
  },
  {
    id: "venus",
    name: "Venus",
    color: 0xe8c87a,
    size: 0.55,
    orbit: 9,
    period: 0.615,
    day: -243.02, // retrograde
    tilt: 3.0962,
    facts: {
      type: "Terrestrial (rocky)",
      diameter: "12,104 km",
      mass: "4.867 × 10²⁴ kg (0.815 × Earth)",
      distance: "108.2 million km (0.72 AU)",
      period: "224.7 Earth days",
      day: "243 Earth days (retrograde — rotates backwards)",
      moons: "0",
      description:
        "Venus rotates backwards. Its CO₂ atmosphere is 92× denser than Earth's, producing a runaway greenhouse effect with surface temperatures of 462°C — hot enough to melt lead. A Venusian day is longer than its year.",
    },
  },
  {
    id: "earth",
    name: "Earth",
    color: 0x4a90e2,
    size: 0.58,
    orbit: 12.5,
    period: 1,
    day: 1,
    tilt: 0.4091, // 23.44°
    moons: 1,
    facts: {
      type: "Terrestrial (rocky), inhabited",
      diameter: "12,756 km",
      mass: "5.972 × 10²⁴ kg",
      distance: "149.6 million km (1.00 AU, by definition)",
      period: "365.25 days",
      day: "23.93 hours (sidereal)",
      moons: "1 (Luna — visible orbiting Earth in this view)",
      description:
        "The only known planet with life. ~71% surface water. 23.4° axial tilt drives the seasons. Magnetic field shields the atmosphere from the solar wind. Average orbital velocity 29.78 km/s.",
    },
  },
  {
    id: "mars",
    name: "Mars",
    color: 0xc1440e,
    size: 0.45,
    orbit: 17,
    period: 1.881,
    day: 1.026,
    tilt: 0.4396, // 25.19°
    moons: 2,
    facts: {
      type: "Terrestrial (rocky)",
      diameter: "6,792 km",
      mass: "6.39 × 10²³ kg (0.107 × Earth)",
      distance: "227.9 million km (1.52 AU)",
      period: "687 Earth days (1.88 Earth years)",
      day: "24.6 hours (sidereal) — almost identical to Earth",
      moons: "2 (Phobos, Deimos)",
      description:
        "The red color is iron oxide (rust) on the surface. Hosts the Solar System's tallest volcano (Olympus Mons, 21.9 km) and longest canyon (Valles Marineris, 4,000 km). Polar ice caps cycle CO₂ + water ice with the seasons.",
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    color: 0xd4a96a,
    size: 1.6,
    orbit: 26,
    period: 11.862,
    day: 0.413,
    tilt: 0.0546, // 3.13°
    moons: 95,
    facts: {
      type: "Gas giant",
      diameter: "142,984 km (11.2 × Earth)",
      mass: "1.898 × 10²⁷ kg (318 × Earth, 2.5× all other planets combined)",
      distance: "778.5 million km (5.20 AU)",
      period: "11.86 Earth years",
      day: "9.93 hours — fastest rotation in the Solar System",
      moons: "95 confirmed (Io, Europa, Ganymede, Callisto are the four Galilean moons)",
      description:
        "Mostly hydrogen and helium. The Great Red Spot is a storm at least 350 years old, ~1.3× Earth's diameter. Jupiter's gravity protects the inner solar system from comet impacts (the Shoemaker-Levy 9 impact in 1994 was one of the most-observed).",
    },
  },
  {
    id: "saturn",
    name: "Saturn",
    color: 0xebd9a4,
    size: 1.35,
    orbit: 38,
    period: 29.457,
    day: 0.444,
    tilt: 0.4665, // 26.73°
    rings: { inner: 1.9, outer: 3.2, color: 0xc9a877 },
    moons: 146,
    facts: {
      type: "Gas giant",
      diameter: "120,536 km (9.45 × Earth)",
      mass: "5.683 × 10²⁶ kg (95.2 × Earth)",
      distance: "1.434 billion km (9.58 AU)",
      period: "29.46 Earth years",
      day: "10.66 hours",
      moons: "146 confirmed (Titan, the second-largest moon in the Solar System, has a denser atmosphere than Earth)",
      description:
        "The least dense planet (0.687 g/cm³ — less than water; Saturn would float). Its ring system is mostly water ice particles ranging from micrometers to meters, spanning ~282,000 km but only ~10–100 m thick.",
    },
  },
  {
    id: "uranus",
    name: "Uranus",
    color: 0x9ad9d9,
    size: 0.95,
    orbit: 48,
    period: 84.011,
    day: -0.718, // retrograde
    tilt: 1.7064, // 97.77° — basically rolls on its side
    moons: 28,
    facts: {
      type: "Ice giant",
      diameter: "51,118 km (4.0 × Earth)",
      mass: "8.681 × 10²⁵ kg (14.5 × Earth)",
      distance: "2.871 billion km (19.22 AU)",
      period: "84.01 Earth years",
      day: "17.24 hours (retrograde)",
      moons: "28",
      description:
        "Rotates on its side — axial tilt of 97.77°, so it 'rolls' around the Sun. The pale cyan color comes from atmospheric methane absorbing red light. Its magnetic axis is tilted 59° from its rotation axis (also unusual).",
    },
  },
  {
    id: "neptune",
    name: "Neptune",
    color: 0x4166f5,
    size: 0.92,
    orbit: 58,
    period: 164.79,
    day: 0.671,
    tilt: 0.4943, // 28.32°
    moons: 16,
    facts: {
      type: "Ice giant",
      diameter: "49,528 km (3.88 × Earth)",
      mass: "1.024 × 10²⁶ kg (17.1 × Earth)",
      distance: "4.495 billion km (30.05 AU)",
      period: "164.79 Earth years (has not completed one full orbit since its 1846 discovery)",
      day: "16.11 hours",
      moons: "16 (Triton orbits retrograde and is thought to be a captured Kuiper-belt object)",
      description:
        "The windiest planet in the Solar System — supersonic winds reach 2,100 km/h. Triton, its largest moon, is geologically active with nitrogen geysers and is one of the coldest places in the Solar System (−235°C).",
    },
  },
];

// ────────────────────────────────────────────────────────────────────────
// Simulation clock — single source of truth for time.
// One Earth year = 30 simulated seconds at speed=1x. Speed control
// multiplies that. Pause halts the advance without stopping renders.
// ────────────────────────────────────────────────────────────────────────

const EARTH_YEAR_SECONDS = 30;

function SimulationClock({
  paused,
  speed,
  simTimeRef,
}: {
  paused: boolean;
  speed: number;
  simTimeRef: React.MutableRefObject<number>;
}) {
  useFrame((_, delta) => {
    if (!paused) {
      // delta is wall-clock seconds; convert to "Earth years" of sim time
      simTimeRef.current += (delta * speed) / EARTH_YEAR_SECONDS;
    }
  });
  return null;
}

// ────────────────────────────────────────────────────────────────────────
// Orbit trail — faint circle on the orbital plane.
// ────────────────────────────────────────────────────────────────────────

function OrbitTrail({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  return (
    <line>
      {/* @ts-expect-error r3f lowercases primitives; TS doesn't have type for <line> child */}
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial
        color={0x444444}
        transparent
        opacity={0.35}
      />
    </line>
  );
}

// ────────────────────────────────────────────────────────────────────────
// One planet (or the Moon) — orbits a pivot, self-rotates with axial tilt.
// ────────────────────────────────────────────────────────────────────────

function OrbitingBody({
  body,
  simTimeRef,
  onSelect,
  isSun = false,
  parentRef,
}: {
  body: Body;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
  isSun?: boolean;
  parentRef?: React.MutableRefObject<THREE.Object3D | null>;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = simTimeRef.current;
    if (orbitRef.current && !isSun) {
      // Angular position = 2π * (t / period)
      orbitRef.current.rotation.y = (t * Math.PI * 2) / body.period;
    }
    if (meshRef.current) {
      const dayPeriodInYears = Math.abs(body.day) / 365.25;
      const sign = Math.sign(body.day) || 1;
      meshRef.current.rotation.y =
        (t * Math.PI * 2 * sign) / dayPeriodInYears;
    }
  });

  // Tilt is applied to a wrapper group so self-rotation stays on the
  // tilted body axis (otherwise the spin would precess weirdly).
  return (
    <group ref={orbitRef}>
      <group position={[body.orbit, 0, 0]} rotation={[0, 0, body.tilt]}>
        <mesh
          ref={(el) => {
            meshRef.current = el;
            if (parentRef && el) parentRef.current = el;
          }}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onSelect(body);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[body.size, 48, 48]} />
          {isSun ? (
            <meshBasicMaterial color={body.color} />
          ) : (
            <meshStandardMaterial
              color={body.color}
              roughness={0.85}
              metalness={0.05}
              emissive={body.emissive ?? 0}
              emissiveIntensity={body.emissiveIntensity ?? 0}
            />
          )}
          {body.rings && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[body.rings.inner, body.rings.outer, 96]}
              />
              <meshBasicMaterial
                color={body.rings.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.55}
              />
            </mesh>
          )}
        </mesh>
      </group>
      {!isSun && <OrbitTrail radius={body.orbit} />}
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Earth's Moon — same logic as a planet but parented to Earth's mesh
// rather than the scene root.
// ────────────────────────────────────────────────────────────────────────

function Moon({
  earthRef,
  simTimeRef,
}: {
  earthRef: React.MutableRefObject<THREE.Object3D | null>;
  simTimeRef: React.MutableRefObject<number>;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const tetheredRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (orbitRef.current) {
      // Moon orbits Earth roughly every 27.3 days = 0.0748 Earth years.
      orbitRef.current.rotation.y =
        (simTimeRef.current * Math.PI * 2) / 0.0748;
    }
    // Snap moon-orbit pivot to Earth's world position each frame.
    if (tetheredRef.current && earthRef.current) {
      earthRef.current.getWorldPosition(tetheredRef.current.position);
    }
  });

  return (
    <group ref={tetheredRef}>
      <group ref={orbitRef}>
        <mesh position={[0.95, 0, 0]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color={0xb0b0b0} roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────

export default function SolarSystemPage() {
  const simTimeRef = useRef(0); // simulation time in Earth years
  const earthRef = useRef<THREE.Object3D | null>(null);
  const orbitControlsRef = useRef<unknown>(null);

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<Body | null>(null);

  // Keyboard shortcuts: Space = pause/play, R = reset camera, Esc = close panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.code === "KeyR") {
        const c = orbitControlsRef.current as { reset?: () => void } | null;
        c?.reset?.();
      } else if (e.code === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 text-white">
      <Canvas
        camera={{ position: [0, 35, 75], fov: 50, near: 0.1, far: 5000 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#000010"]} />
          <ambientLight intensity={0.18} />
          {/* The Sun also acts as the scene's PointLight — physically
              accurate-ish: planets are lit from the center. */}
          <pointLight
            position={[0, 0, 0]}
            intensity={2.5}
            distance={500}
            decay={0.4}
            color={0xffffff}
          />
          <Stars
            radius={300}
            depth={80}
            count={6000}
            factor={5}
            saturation={0}
            fade
            speed={0.5}
          />

          <SimulationClock
            paused={paused}
            speed={speed}
            simTimeRef={simTimeRef}
          />

          {/* Sun */}
          <OrbitingBody
            body={SUN}
            simTimeRef={simTimeRef}
            onSelect={setSelected}
            isSun
          />

          {/* 8 planets */}
          {PLANETS.map((p) => (
            <OrbitingBody
              key={p.id}
              body={p}
              simTimeRef={simTimeRef}
              onSelect={setSelected}
              parentRef={p.id === "earth" ? earthRef : undefined}
            />
          ))}

          {/* Earth's moon */}
          <Moon earthRef={earthRef} simTimeRef={simTimeRef} />

          <OrbitControls
            ref={
              orbitControlsRef as React.MutableRefObject<
                unknown
              > as React.RefObject<unknown> as never
            }
            enableDamping
            dampingFactor={0.08}
            minDistance={4}
            maxDistance={300}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* ──────────────── Top bar ──────────────── */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between gap-3 z-10 pointer-events-none">
        <Link
          href="/dashboard/xr-labs"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          XR Labs
        </Link>

        <div className="pointer-events-auto bg-black/50 backdrop-blur-md rounded-md px-4 py-2 text-center">
          <div className="text-xs uppercase tracking-wider text-white/60">
            Built-in portal
          </div>
          <div className="text-base font-semibold">Solar System Explorer</div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-md px-2 py-1">
          <button
            onClick={() => setPaused((p) => !p)}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            title={paused ? "Play (Space)" : "Pause (Space)"}
          >
            {paused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-transparent text-sm px-2 py-1 rounded border border-white/20 hover:border-white/40 outline-none cursor-pointer"
            title="Time multiplier"
          >
            <option value={0.5} className="bg-black">
              0.5×
            </option>
            <option value={1} className="bg-black">
              1× (1 yr / 30s)
            </option>
            <option value={5} className="bg-black">
              5×
            </option>
            <option value={50} className="bg-black">
              50×
            </option>
            <option value={500} className="bg-black">
              500×
            </option>
          </select>
          <button
            onClick={() => {
              const c = orbitControlsRef.current as {
                reset?: () => void;
              } | null;
              c?.reset?.();
            }}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            title="Reset camera (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ──────────────── Info panel ──────────────── */}
      {selected && (
        <div className="absolute top-20 right-4 w-96 max-w-[90vw] max-h-[calc(100vh-7rem)] overflow-y-auto bg-black/70 backdrop-blur-lg border border-white/10 rounded-lg p-5 z-10 pointer-events-auto">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="h-8 w-8 rounded-full shrink-0 border border-white/20"
                style={{
                  background: `#${selected.color.toString(16).padStart(6, "0")}`,
                  boxShadow: selected.id === "sun" ? "0 0 20px #fdb813" : "none",
                }}
              />
              <h2 className="text-2xl font-bold truncate">{selected.name}</h2>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <Fact label="Type" value={selected.facts.type} />
            <Fact label="Diameter" value={selected.facts.diameter} />
            <Fact label="Mass" value={selected.facts.mass} />
            <Fact label="Distance from Sun" value={selected.facts.distance} />
            <Fact label="Orbital period" value={selected.facts.period} />
            <Fact label="Day length" value={selected.facts.day} />
            <Fact label="Moons" value={selected.facts.moons} />
          </div>
          <p className="text-sm text-white/80 mt-4 leading-relaxed">
            {selected.facts.description}
          </p>
        </div>
      )}

      {/* ──────────────── Help / hint footer ──────────────── */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto text-xs text-white/50 bg-black/40 backdrop-blur-md rounded-md px-3 py-2">
        <Info className="h-3 w-3 inline mr-1" />
        Drag to rotate · scroll to zoom · click a body for facts ·{" "}
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
          Space
        </kbd>{" "}
        pause ·{" "}
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">R</kbd>{" "}
        reset camera
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2 text-xs">
      <dt className="text-white/50">{label}</dt>
      <dd className="text-white/90">{value}</dd>
    </div>
  );
}

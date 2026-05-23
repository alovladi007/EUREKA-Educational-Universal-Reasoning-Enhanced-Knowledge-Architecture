"use client";

/**
 * /dashboard/xr-labs/solar-system — interactive 3D solar system viewer.
 *
 * Visual quality target: as close to NASA "Eyes on the Solar System" as
 * we can get with self-contained Three.js + a single set of static
 * texture assets. The previous version used solid colors and looked
 * cartoonish; this version uses real NASA-derived equirectangular
 * planetary maps (Solar System Scope, CC BY 4.0).
 *
 * Asset attribution:
 *   - All planetary textures + Milky Way background are from
 *     https://www.solarsystemscope.com/textures/ (CC BY 4.0)
 *   - Underlying imagery is NASA mission data (Voyager, Cassini,
 *     Magellan, MESSENGER, MRO, LRO, Galileo, SDO/SOHO, etc.) which is
 *     in the U.S. public domain.
 *   - Solar System Scope's contribution is the equirectangular
 *     processing + consistent visual styling.
 *   - Attribution is satisfied by the visible credit line in the
 *     bottom-left HUD (CC BY 4.0 requirement).
 *
 * Visual upgrades over the v1 (procedural-only) version:
 *   - Real photographic textures on every body
 *   - Earth: composite material — day map + cloud layer + atmosphere halo
 *   - Venus: surface + thick atmosphere overlay (twin layers)
 *   - Sun: textured surface + additive-blend outer corona glow
 *   - Saturn: textured surface + properly-textured ring (alpha channel)
 *   - Background: Milky Way skybox (inverted-normal sphere) instead of
 *     point-cloud stars
 *   - Asteroid belt: 2,000 instanced asteroids between Mars and Jupiter
 *   - ACESFilmic tone mapping for cinematic lighting
 *
 * Scaling caveats (same as v1 — necessary for visibility):
 *   - Planet sizes are inflated ~1000× and orbital distances are
 *     compressed. True scale would put Mercury at sub-pixel and Neptune
 *     off-screen by default.
 *   - Orbital periods are proportional (Earth = 1.0, Mercury 0.241,
 *     Jupiter 11.86, Neptune 164.79). Only wall-clock time is stretched
 *     via the speed control.
 *   - Retrograde rotation on Venus and Uranus is preserved (negative
 *     day values flip the spin direction).
 */

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Info,
  X,
  ExternalLink,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────
// Real planetary data — scientific facts (not copyrightable).
// ────────────────────────────────────────────────────────────────────────

type Body = {
  id: string;
  name: string;
  textureKey: string;
  size: number; // visual scene units
  orbit: number; // visual scene units from Sun center
  period: number; // orbital period in Earth years (Earth = 1.0)
  day: number; // sidereal rotation in Earth days (negative = retrograde)
  tilt: number; // axial tilt in radians
  rings?: { inner: number; outer: number };
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
  textureKey: "sun",
  size: 2.8,
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
    textureKey: "mercury",
    size: 0.42,
    orbit: 6.5,
    period: 0.241,
    day: 58.6,
    tilt: 0.0006,
    facts: {
      type: "Terrestrial (rocky)",
      diameter: "4,879 km",
      mass: "3.301 × 10²³ kg (0.055 × Earth)",
      distance: "57.9 million km (0.39 AU)",
      period: "88 Earth days",
      day: "58.6 Earth days (3:2 spin-orbit resonance)",
      moons: "0",
      description:
        "The smallest planet and closest to the Sun. Surface temperatures swing from −173°C at night to +427°C in sunlight. Mercury has no atmosphere to retain heat. Imagery here is from the MESSENGER orbital mission (2011–2015).",
    },
  },
  {
    id: "venus",
    name: "Venus",
    textureKey: "venusSurface", // surface beneath the cloud layer
    size: 0.58,
    orbit: 9.5,
    period: 0.615,
    day: -243.02,
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
        "Venus rotates backwards. Its CO₂ atmosphere is 92× denser than Earth's, producing a runaway greenhouse effect with surface temperatures of 462°C — hot enough to melt lead. The surface here is from Magellan radar (1990–1994); the swirling cloud layer rendered above is from Galileo and Mariner UV imagery.",
    },
  },
  {
    id: "earth",
    name: "Earth",
    textureKey: "earthDay",
    size: 0.6,
    orbit: 13.5,
    period: 1,
    day: 1,
    tilt: 0.4091,
    facts: {
      type: "Terrestrial (rocky), inhabited",
      diameter: "12,756 km",
      mass: "5.972 × 10²⁴ kg",
      distance: "149.6 million km (1.00 AU, by definition)",
      period: "365.25 days",
      day: "23.93 hours (sidereal)",
      moons: "1 (Luna — visible orbiting Earth in this view)",
      description:
        "Day map from the NASA Blue Marble Next Generation composite. Cloud layer is a separate NASA composite mesh rendered above the surface (visible as it rotates independently). Atmospheric glow is a Fresnel-style outer shell. 23.4° axial tilt drives the seasons.",
    },
  },
  {
    id: "mars",
    name: "Mars",
    textureKey: "mars",
    size: 0.48,
    orbit: 18,
    period: 1.881,
    day: 1.026,
    tilt: 0.4396,
    facts: {
      type: "Terrestrial (rocky)",
      diameter: "6,792 km",
      mass: "6.39 × 10²³ kg (0.107 × Earth)",
      distance: "227.9 million km (1.52 AU)",
      period: "687 Earth days (1.88 Earth years)",
      day: "24.6 hours — almost identical to Earth",
      moons: "2 (Phobos, Deimos)",
      description:
        "Iron oxide (rust) gives the surface its red color. Hosts the tallest volcano in the Solar System (Olympus Mons, 21.9 km) and the longest canyon (Valles Marineris, 4,000 km). Surface texture combines MOLA elevation with MRO color imagery.",
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    textureKey: "jupiter",
    size: 1.7,
    orbit: 28,
    period: 11.862,
    day: 0.413,
    tilt: 0.0546,
    facts: {
      type: "Gas giant",
      diameter: "142,984 km (11.2 × Earth)",
      mass: "1.898 × 10²⁷ kg (318 × Earth, 2.5× all other planets combined)",
      distance: "778.5 million km (5.20 AU)",
      period: "11.86 Earth years",
      day: "9.93 hours — fastest rotation in the Solar System",
      moons: "95 confirmed (Io, Europa, Ganymede, Callisto — the four Galilean moons)",
      description:
        "Mostly hydrogen and helium. The Great Red Spot is visible in the texture — a storm at least 350 years old, ~1.3× Earth's diameter. Composite imagery from Voyager, Cassini, and JunoCam.",
    },
  },
  {
    id: "saturn",
    name: "Saturn",
    textureKey: "saturn",
    size: 1.45,
    orbit: 40,
    period: 29.457,
    day: 0.444,
    tilt: 0.4665,
    rings: { inner: 1.9, outer: 3.4 },
    facts: {
      type: "Gas giant",
      diameter: "120,536 km (9.45 × Earth)",
      mass: "5.683 × 10²⁶ kg (95.2 × Earth)",
      distance: "1.434 billion km (9.58 AU)",
      period: "29.46 Earth years",
      day: "10.66 hours",
      moons: "146 confirmed (Titan has a denser atmosphere than Earth)",
      description:
        "The least dense planet (0.687 g/cm³ — would float on water). Ring system rendered here uses the Cassini-imaged ring alpha map — particles are mostly water ice, ~10–100 m thick across ~282,000 km.",
    },
  },
  {
    id: "uranus",
    name: "Uranus",
    textureKey: "uranus",
    size: 1.0,
    orbit: 50,
    period: 84.011,
    day: -0.718,
    tilt: 1.7064,
    facts: {
      type: "Ice giant",
      diameter: "51,118 km (4.0 × Earth)",
      mass: "8.681 × 10²⁵ kg (14.5 × Earth)",
      distance: "2.871 billion km (19.22 AU)",
      period: "84.01 Earth years",
      day: "17.24 hours (retrograde)",
      moons: "28",
      description:
        "Rotates on its side — 97.77° axial tilt (geometrically visible here as the body 'rolls' rather than spinning upright). Cyan color from atmospheric methane absorbing red light. Imagery from Voyager 2's 1986 flyby (still the only spacecraft visit).",
    },
  },
  {
    id: "neptune",
    name: "Neptune",
    textureKey: "neptune",
    size: 0.97,
    orbit: 60,
    period: 164.79,
    day: 0.671,
    tilt: 0.4943,
    facts: {
      type: "Ice giant",
      diameter: "49,528 km (3.88 × Earth)",
      mass: "1.024 × 10²⁶ kg (17.1 × Earth)",
      distance: "4.495 billion km (30.05 AU)",
      period: "164.79 Earth years (has not completed one full orbit since 1846 discovery)",
      day: "16.11 hours",
      moons: "16 (Triton orbits retrograde — likely a captured Kuiper-belt object)",
      description:
        "The windiest planet — supersonic winds reach 2,100 km/h. Deep blue color is methane + an unknown chromophore. Imagery from Voyager 2's 1989 flyby.",
    },
  },
];

// ────────────────────────────────────────────────────────────────────────
// Simulation clock — one Earth year = 30 simulated seconds at speed=1x.
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
      simTimeRef.current += (delta * speed) / EARTH_YEAR_SECONDS;
    }
  });
  return null;
}

// ────────────────────────────────────────────────────────────────────────
// Orbit trail
// ────────────────────────────────────────────────────────────────────────

function OrbitTrail({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 192;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: 0x555566,
            transparent: true,
            opacity: 0.25,
          }),
        )
      }
    />
  );
}

// ────────────────────────────────────────────────────────────────────────
// Sun — surface texture + additive-blend outer corona glow
// ────────────────────────────────────────────────────────────────────────

function Sun({
  body,
  texture,
  simTimeRef,
  onSelect,
}: {
  body: Body;
  texture: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const dayPeriodInYears = Math.abs(body.day) / 365.25;
      meshRef.current.rotation.y =
        (simTimeRef.current * Math.PI * 2) / dayPeriodInYears;
    }
  });

  return (
    <group>
      {/* The surface itself — emissive so it lights itself */}
      <mesh
        ref={meshRef}
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
        rotation={[0, 0, body.tilt]}
      >
        <sphereGeometry args={[body.size, 96, 96]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[body.size * 1.15, 32, 32]} />
        <meshBasicMaterial
          color={0xffd070}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer corona — bigger, redder, more transparent */}
      <mesh>
        <sphereGeometry args={[body.size * 1.4, 32, 32]} />
        <meshBasicMaterial
          color={0xff9030}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* The Sun is the scene's only light source */}
      <pointLight intensity={3} distance={500} decay={0.5} color={0xfff5e0} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Generic textured planet (orbiting body without special composites)
// ────────────────────────────────────────────────────────────────────────

function Planet({
  body,
  texture,
  ringTexture,
  simTimeRef,
  onSelect,
  meshOutRef,
}: {
  body: Body;
  texture: THREE.Texture;
  ringTexture?: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
  meshOutRef?: React.MutableRefObject<THREE.Object3D | null>;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = simTimeRef.current;
    if (orbitRef.current) {
      orbitRef.current.rotation.y = (t * Math.PI * 2) / body.period;
    }
    if (meshRef.current) {
      const dayPeriodInYears = Math.abs(body.day) / 365.25;
      const sign = Math.sign(body.day) || 1;
      meshRef.current.rotation.y =
        (t * Math.PI * 2 * sign) / dayPeriodInYears;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[body.orbit, 0, 0]} rotation={[0, 0, body.tilt]}>
        <mesh
          ref={(el) => {
            meshRef.current = el;
            if (meshOutRef && el) meshOutRef.current = el;
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
          <sphereGeometry args={[body.size, 96, 96]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.95}
            metalness={0.0}
          />
        </mesh>
        {body.rings && ringTexture && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[body.rings.inner, body.rings.outer, 128]}
            />
            <meshBasicMaterial
              map={ringTexture}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
      <OrbitTrail radius={body.orbit} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Earth — composite: day map + cloud layer + atmospheric halo
// ────────────────────────────────────────────────────────────────────────

function Earth({
  body,
  dayMap,
  cloudsMap,
  simTimeRef,
  onSelect,
  meshOutRef,
}: {
  body: Body;
  dayMap: THREE.Texture;
  cloudsMap: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
  meshOutRef: React.MutableRefObject<THREE.Object3D | null>;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = simTimeRef.current;
    if (orbitRef.current) {
      orbitRef.current.rotation.y = (t * Math.PI * 2) / body.period;
    }
    if (surfaceRef.current) {
      const dayPeriodInYears = Math.abs(body.day) / 365.25;
      surfaceRef.current.rotation.y =
        (t * Math.PI * 2) / dayPeriodInYears;
    }
    // Clouds rotate slightly faster than the surface for parallax
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y =
        (t * Math.PI * 2) / (Math.abs(body.day) / 365.25) * 1.08;
    }
  });

  return (
    <group ref={orbitRef}>
      <group
        position={[body.orbit, 0, 0]}
        rotation={[0, 0, body.tilt]}
        ref={(el) => {
          if (meshOutRef) meshOutRef.current = el;
        }}
      >
        {/* Surface */}
        <mesh
          ref={surfaceRef}
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
          <sphereGeometry args={[body.size, 96, 96]} />
          <meshStandardMaterial
            map={dayMap}
            roughness={0.92}
            metalness={0.02}
          />
        </mesh>

        {/* Cloud layer — slightly larger, transparent, rotates faster */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[body.size * 1.012, 96, 96]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent
            opacity={0.55}
            depthWrite={false}
            roughness={1}
          />
        </mesh>

        {/* Atmosphere halo — Fresnel-style outer shell, BackSide */}
        <mesh>
          <sphereGeometry args={[body.size * 1.05, 64, 64]} />
          <meshBasicMaterial
            color={0x4a90e2}
            transparent
            opacity={0.18}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      <OrbitTrail radius={body.orbit} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Venus — surface + thick atmospheric cloud overlay
// ────────────────────────────────────────────────────────────────────────

function Venus({
  body,
  surfaceMap,
  atmosphereMap,
  simTimeRef,
  onSelect,
}: {
  body: Body;
  surfaceMap: THREE.Texture;
  atmosphereMap: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = simTimeRef.current;
    if (orbitRef.current) {
      orbitRef.current.rotation.y = (t * Math.PI * 2) / body.period;
    }
    if (surfaceRef.current) {
      const dayPeriodInYears = Math.abs(body.day) / 365.25;
      const sign = Math.sign(body.day) || 1;
      surfaceRef.current.rotation.y =
        (t * Math.PI * 2 * sign) / dayPeriodInYears;
    }
    // Venus' upper atmosphere super-rotates ~60× faster than the surface
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y =
        (t * Math.PI * 2 * -1 * 60) / (Math.abs(body.day) / 365.25);
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[body.orbit, 0, 0]} rotation={[0, 0, body.tilt]}>
        <mesh
          ref={surfaceRef}
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
          <sphereGeometry args={[body.size, 96, 96]} />
          <meshStandardMaterial
            map={surfaceMap}
            roughness={0.95}
          />
        </mesh>
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[body.size * 1.02, 64, 64]} />
          <meshStandardMaterial
            map={atmosphereMap}
            transparent
            opacity={0.65}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      </group>
      <OrbitTrail radius={body.orbit} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Earth's Moon — tethered to Earth's world position
// ────────────────────────────────────────────────────────────────────────

function Moon({
  earthRef,
  texture,
  simTimeRef,
}: {
  earthRef: React.MutableRefObject<THREE.Object3D | null>;
  texture: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const tetheredRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y =
        (simTimeRef.current * Math.PI * 2) / 0.0748;
    }
    if (meshRef.current) {
      // Tidal lock — Moon's day = Moon's year (always same face to Earth)
      meshRef.current.rotation.y =
        (simTimeRef.current * Math.PI * 2) / 0.0748;
    }
    if (tetheredRef.current && earthRef.current) {
      earthRef.current.getWorldPosition(tetheredRef.current.position);
    }
  });

  return (
    <group ref={tetheredRef}>
      <group ref={orbitRef}>
        <mesh ref={meshRef} position={[1.05, 0, 0]}>
          <sphereGeometry args={[0.17, 48, 48]} />
          <meshStandardMaterial map={texture} roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Asteroid belt — instanced rocks between Mars and Jupiter orbits
// ────────────────────────────────────────────────────────────────────────

const ASTEROID_COUNT = 2000;

function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const tempObj = new THREE.Object3D();
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Between Mars (orbit=18) and Jupiter (orbit=28), with some spread.
      // Real asteroid belt: 2.2–3.2 AU which roughly fits this band.
      const radius = 20 + Math.random() * 5.5;
      const height = (Math.random() - 0.5) * 0.5;
      tempObj.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius,
      );
      tempObj.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      const scale = 0.015 + Math.random() * 0.045;
      tempObj.scale.set(scale, scale, scale);
      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // Slowly rotate the whole belt
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, ASTEROID_COUNT]}
      frustumCulled={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={0x807060}
        roughness={1}
        metalness={0}
      />
    </instancedMesh>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Milky Way background — inverted-normal giant sphere with texture
// ────────────────────────────────────────────────────────────────────────

function MilkyWayBackground({ texture }: { texture: THREE.Texture }) {
  return (
    <mesh>
      <sphereGeometry args={[2500, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Scene root — loads all textures + composes the bodies
// ────────────────────────────────────────────────────────────────────────

function SolarSystemScene({
  simTimeRef,
  onSelect,
}: {
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
}) {
  // useTexture (drei) suspends until all are loaded.
  const t = useTexture({
    sun: "/textures/solar-system/2k_sun.jpg",
    mercury: "/textures/solar-system/2k_mercury.jpg",
    venusSurface: "/textures/solar-system/2k_venus_surface.jpg",
    venusAtmosphere: "/textures/solar-system/2k_venus_atmosphere.jpg",
    earthDay: "/textures/solar-system/2k_earth_daymap.jpg",
    earthClouds: "/textures/solar-system/2k_earth_clouds.jpg",
    mars: "/textures/solar-system/2k_mars.jpg",
    jupiter: "/textures/solar-system/2k_jupiter.jpg",
    saturn: "/textures/solar-system/2k_saturn.jpg",
    saturnRing: "/textures/solar-system/2k_saturn_ring_alpha.png",
    uranus: "/textures/solar-system/2k_uranus.jpg",
    neptune: "/textures/solar-system/2k_neptune.jpg",
    moon: "/textures/solar-system/2k_moon.jpg",
    stars: "/textures/solar-system/2k_stars_milky_way.jpg",
  });

  // Set proper color space on all sRGB textures (Three r152+)
  useEffect(() => {
    Object.values(t).forEach((tex) => {
      (tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
      (tex as THREE.Texture).anisotropy = 8;
    });
  }, [t]);

  const earthRef = useRef<THREE.Object3D | null>(null);

  return (
    <>
      <MilkyWayBackground texture={t.stars} />

      {/* Very dim ambient so the night sides aren't pure black */}
      <ambientLight intensity={0.04} />

      <Sun
        body={SUN}
        texture={t.sun}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
      />

      <Planet
        body={PLANETS[0]}
        texture={t.mercury}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
      />

      <Venus
        body={PLANETS[1]}
        surfaceMap={t.venusSurface}
        atmosphereMap={t.venusAtmosphere}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
      />

      <Earth
        body={PLANETS[2]}
        dayMap={t.earthDay}
        cloudsMap={t.earthClouds}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={earthRef}
      />
      <Moon earthRef={earthRef} texture={t.moon} simTimeRef={simTimeRef} />

      <Planet
        body={PLANETS[3]}
        texture={t.mars}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
      />

      <AsteroidBelt />

      <Planet
        body={PLANETS[4]}
        texture={t.jupiter}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
      />

      <Planet
        body={PLANETS[5]}
        texture={t.saturn}
        ringTexture={t.saturnRing}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
      />

      <Planet
        body={PLANETS[6]}
        texture={t.uranus}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
      />

      <Planet
        body={PLANETS[7]}
        texture={t.neptune}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────

export default function SolarSystemPage() {
  const simTimeRef = useRef(0);
  const orbitControlsRef = useRef<unknown>(null);

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<Body | null>(null);
  const [loaded, setLoaded] = useState(false);

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
        camera={{ position: [0, 30, 75], fov: 50, near: 0.1, far: 8000 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SimulationClock
            paused={paused}
            speed={speed}
            simTimeRef={simTimeRef}
          />
          <SolarSystemScene
            simTimeRef={simTimeRef}
            onSelect={(b) => {
              setSelected(b);
              if (!loaded) setLoaded(true);
            }}
          />
          <OrbitControls
            ref={
              orbitControlsRef as React.MutableRefObject<
                unknown
              > as React.RefObject<unknown> as never
            }
            enableDamping
            dampingFactor={0.08}
            minDistance={4}
            maxDistance={500}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* ──────────────── Loading overlay ──────────────── */}
      <Suspense fallback={null}>
        <LoadingHint />
      </Suspense>

      {/* ──────────────── Top bar ──────────────── */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between gap-3 z-10 pointer-events-none">
        <Link
          href="/dashboard/xr-labs"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md text-sm font-medium transition-colors border border-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          XR Labs
        </Link>

        <div className="pointer-events-auto bg-black/50 backdrop-blur-md rounded-md px-4 py-2 text-center border border-white/10">
          <div className="text-[10px] uppercase tracking-wider text-white/60">
            Built-in portal · Phase 19
          </div>
          <div className="text-base font-semibold">Solar System Explorer</div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-md px-2 py-1 border border-white/10">
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
            <option value={0.5} className="bg-black">0.5×</option>
            <option value={1} className="bg-black">1× (1 yr / 30s)</option>
            <option value={5} className="bg-black">5×</option>
            <option value={50} className="bg-black">50×</option>
            <option value={500} className="bg-black">500×</option>
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
        <div className="absolute top-24 right-4 w-96 max-w-[90vw] max-h-[calc(100vh-9rem)] overflow-y-auto bg-black/70 backdrop-blur-lg border border-white/15 rounded-lg p-5 z-10 pointer-events-auto">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-2xl font-bold truncate">{selected.name}</h2>
            <button
              onClick={() => setSelected(null)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors shrink-0"
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

      {/* ──────────────── Footer: controls hint + attribution ──────────────── */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto text-xs text-white/50 bg-black/40 backdrop-blur-md rounded-md px-3 py-2 border border-white/10">
        <Info className="h-3 w-3 inline mr-1" />
        Drag to rotate · scroll to zoom · click a body for facts ·{" "}
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Space</kbd>{" "}
        pause ·{" "}
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">R</kbd>{" "}
        reset camera
      </div>

      {/* CC BY 4.0 attribution — required by the texture license */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-auto text-[10px] text-white/40 bg-black/30 backdrop-blur-md rounded px-2.5 py-1.5 border border-white/10">
        Textures:{" "}
        <a
          href="https://www.solarsystemscope.com/textures/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white/90 underline inline-flex items-center gap-0.5"
        >
          Solar System Scope <ExternalLink className="h-2.5 w-2.5" />
        </a>{" "}
        ·{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white/90 underline"
        >
          CC BY 4.0
        </a>{" "}
        · derived from NASA mission data
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-2 text-xs">
      <dt className="text-white/50">{label}</dt>
      <dd className="text-white/90">{value}</dd>
    </div>
  );
}

// Renders briefly while textures stream in (~5-10MB on first load)
function LoadingHint() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-white/40 text-xs animate-pulse">
        Loading planetary textures…
      </div>
    </div>
  );
}

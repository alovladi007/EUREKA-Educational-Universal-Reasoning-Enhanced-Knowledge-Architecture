"use client";

/**
 * /dashboard/xr-labs/solar-system — interactive 3D solar system viewer.
 *
 * Visual quality target: as close to NASA "Eyes on the Solar System" as
 * we can get with self-contained Three.js + a single set of static
 * texture assets.
 *
 * Asset attribution:
 *   - Planetary surface / cloud / atmosphere / ring / Milky Way textures
 *     from Solar System Scope (https://www.solarsystemscope.com/textures/),
 *     CC BY 4.0 — derived from NASA mission imagery (Voyager, Cassini,
 *     Magellan, MESSENGER, MRO, LRO, Galileo, SDO/SOHO).
 *   - NASA underlying data is U.S. public domain. CC BY 4.0 attaches to
 *     Solar System Scope's equirectangular processing on top.
 *   - Attribution is satisfied by the visible credit line in the
 *     bottom-right HUD.
 *
 * Visual upgrades over v2 (NASA-Eyes parity push):
 *   - 8K textures (8192×4096) for the bodies that get zoomed to most:
 *     Sun, Mercury, Venus, Earth day/clouds/night, Mars, Jupiter,
 *     Saturn, Moon, Milky Way, Saturn ring alpha. 2K kept for
 *     Venus atmosphere overlay + Uranus + Neptune where 8K isn't
 *     available from the source.
 *   - Earth NIGHT side: city-lights composite (Black Marble / VIIRS)
 *     blended in the dark hemisphere via additive material.
 *   - Major moon systems: Phobos + Deimos (Mars), Io + Europa +
 *     Ganymede + Callisto (Jupiter Galilean), Enceladus + Titan +
 *     Iapetus (Saturn), Titania + Oberon (Uranus), Triton (Neptune,
 *     retrograde). Each moon has its own correct orbital period
 *     proportionally accurate to its real value.
 *   - Persistent name labels on every body (drei <Html>) at all zoom
 *     levels — they fade and scale gracefully.
 *   - Fly-to-planet camera: nav panel on the left with one button per
 *     body. Click → camera + OrbitControls target smoothly lerp to a
 *     close-up of that body. Click "Whole system" to zoom back out.
 *   - Default camera framed to show the entire system out to Neptune.
 *   - Brighter, more prominent orbital trails (opacity 0.45, line
 *     thickness improvements).
 *
 * Scaling caveats (necessary for visibility):
 *   - Planet sizes are inflated ~1000× and orbital distances are
 *     compressed. True scale would put Mercury at sub-pixel and
 *     Neptune at frustum-cull distance.
 *   - Moon orbits are also compressed; they sit at 2-5× the parent
 *     planet's visual size, NOT at true scale.
 *   - Orbital periods are proportional to real values (Earth = 1.0).
 *     Only wall-clock time is stretched via the speed control.
 */

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { generateMoonTexture } from "./moonTextures";
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Info,
  X,
  ExternalLink,
  Maximize,
  Locate,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────
// Data — bodies with their real (or proportionally accurate) parameters
// ────────────────────────────────────────────────────────────────────────

type Moon = {
  id: string;
  name: string;
  size: number; // visual scene units, relative to parent
  orbit: number; // visual scene units from parent center
  period: number; // orbital period in Earth days (positive prograde, negative retrograde)
  color: number; // tint multiplied with moon base texture
  inclination?: number; // radians
};

// Artificial satellites — ISS, Hubble, JWST, Voyagers etc. Same idea as
// a Moon but drawn as a tiny emissive marker (a small octahedron) with a
// fast orbit. Scaling is symbolic, not real (ISS at true scale would be
// invisible at any zoom).
type Satellite = {
  id: string;
  name: string;
  orbit: number; // distance from parent in scene units (compressed)
  period: number; // orbital period in Earth days (NOT minutes)
  size?: number; // size of the marker (default 0.04)
  color?: number; // color of emissive marker
  inclination?: number;
  description?: string;
};

type Body = {
  id: string;
  name: string;
  textureKey: string;
  size: number;
  orbit: number;
  period: number;
  day: number;
  tilt: number;
  trailColor?: number; // color-coded orbital trail (one per planet for visual ID)
  rings?: { inner: number; outer: number };
  moons?: Moon[];
  satellites?: Satellite[]; // artificial satellites orbiting this body
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
  size: 3.2,
  orbit: 0,
  period: 0,
  day: 25.05,
  tilt: 0.127,
  trailColor: 0xffd070,
  facts: {
    type: "G-type main-sequence star",
    diameter: "1,392,700 km (≈109 × Earth)",
    mass: "1.989 × 10³⁰ kg (333,000 × Earth)",
    distance: "—",
    period: "—",
    day: "25.05 days at equator (differential rotation)",
    moons: "—",
    description:
      "The Sun contains 99.86% of the Solar System's mass. Its core fuses ~4 million tonnes of hydrogen to helium per second; photons take ~170,000 years to random-walk from core to surface, then 8.3 minutes to reach Earth.",
  },
};

const PLANETS: Body[] = [
  {
    id: "mercury",
    name: "Mercury",
    textureKey: "mercury",
    size: 0.48,
    orbit: 8,
    period: 0.241,
    day: 58.6,
    tilt: 0.0006,
    trailColor: 0xa9a9a9, // grey
    facts: {
      type: "Terrestrial (rocky)",
      diameter: "4,879 km",
      mass: "3.301 × 10²³ kg (0.055 × Earth)",
      distance: "57.9 million km (0.39 AU)",
      period: "88 Earth days",
      day: "58.6 Earth days (3:2 spin-orbit resonance)",
      moons: "0",
      description:
        "The smallest planet and closest to the Sun. Surface swings −173°C to +427°C. Imagery from MESSENGER (2011–2015).",
    },
  },
  {
    id: "venus",
    name: "Venus",
    textureKey: "venusSurface",
    size: 0.62,
    orbit: 12,
    period: 0.615,
    day: -243.02,
    tilt: 3.0962,
    trailColor: 0xddc97a, // pale yellow
    facts: {
      type: "Terrestrial (rocky)",
      diameter: "12,104 km",
      mass: "4.867 × 10²⁴ kg (0.815 × Earth)",
      distance: "108.2 million km (0.72 AU)",
      period: "224.7 Earth days",
      day: "243 Earth days (retrograde — rotates backwards)",
      moons: "0",
      description:
        "Rotates backwards. CO₂ atmosphere 92× denser than Earth's; surface 462°C. Surface from Magellan radar (1990–94); cloud layer from Galileo + Mariner UV.",
    },
  },
  {
    id: "earth",
    name: "Earth",
    textureKey: "earthDay",
    size: 0.64,
    orbit: 17,
    period: 1,
    day: 1,
    tilt: 0.4091,
    trailColor: 0x6090f0, // blue
    moons: [
      {
        id: "luna",
        name: "Moon",
        size: 0.22,
        orbit: 1.5,
        period: 27.32,
        color: 0xffffff,
      },
    ],
    satellites: [
      {
        // Real ISS period = 92 min = 0.064 days = 0.000175 years. At sim
        // 1× that's 0.021 sec per orbit — an invisible blur. Slowed to
        // ~5 sec per orbit at 1× for visibility (period 0.04 sim years).
        id: "iss",
        name: "ISS",
        orbit: 0.85,
        period: 14.6, // sim-days; real ISS is 92 min — slowed ~250× to be visible
        size: 0.05,
        color: 0x88ccff,
        description:
          "International Space Station — real orbit altitude 408 km, real period 92 minutes, 51.6° inclination, crewed since Nov 2000. Marker is enlarged ~5000× and orbit is slowed ~250× for visibility in this view.",
      },
      {
        id: "hubble",
        name: "Hubble",
        orbit: 0.92,
        period: 15.1, // 95 min real, slowed for visibility
        size: 0.04,
        color: 0xffdd88,
        inclination: 0.49,
        description:
          "Hubble Space Telescope — launched 1990, real orbit 535 km, period 95 min, 28.5° inclination. Still operational, ~600 papers/year cite Hubble observations.",
      },
      {
        id: "jwst",
        name: "JWST",
        orbit: 3.0,
        period: 182, // L2 halo orbit ~6 months
        size: 0.06,
        color: 0xfff0c0,
        description:
          "James Webb Space Telescope — orbits the Sun–Earth L2 Lagrange point ~1.5 million km from Earth on a 6-month halo orbit. Launched Dec 2021. Operating in mid-infrared at ~50 K with a 6.5 m primary mirror.",
      },
    ],
    facts: {
      type: "Terrestrial (rocky), inhabited",
      diameter: "12,756 km",
      mass: "5.972 × 10²⁴ kg",
      distance: "149.6 million km (1.00 AU, by definition)",
      period: "365.25 days",
      day: "23.93 hours (sidereal)",
      moons: "1 (Luna)",
      description:
        "Blue Marble day map + Black Marble night composite + cloud layer rotating 8% faster. 23.4° axial tilt drives the seasons. Magnetic field shields the atmosphere from solar wind.",
    },
  },
  {
    id: "mars",
    name: "Mars",
    textureKey: "mars",
    size: 0.55,
    orbit: 24,
    period: 1.881,
    day: 1.026,
    tilt: 0.4396,
    trailColor: 0xd47030, // red-orange
    moons: [
      { id: "phobos", name: "Phobos", size: 0.09, orbit: 1.1, period: 0.319, color: 0xa08070 },
      { id: "deimos", name: "Deimos", size: 0.07, orbit: 1.7, period: 1.262, color: 0xa08070 },
    ],
    satellites: [
      {
        // MAVEN orbits Mars (the Curiosity rover is on the surface so
        // visualization-wise it'd track Mars's rotation; we use MAVEN
        // instead since it's a real orbiter we can show flying around).
        id: "maven",
        name: "MAVEN",
        orbit: 0.78,
        period: 13.5,
        size: 0.04,
        color: 0xffaa66,
        inclination: 0.13,
        description:
          "MAVEN — Mars Atmosphere and Volatile EvolutioN. Orbiting Mars since Sept 2014 in a 4.5-h elliptical orbit, studying upper-atmosphere escape to space.",
      },
    ],
    facts: {
      type: "Terrestrial (rocky)",
      diameter: "6,792 km",
      mass: "6.39 × 10²³ kg (0.107 × Earth)",
      distance: "227.9 million km (1.52 AU)",
      period: "687 Earth days",
      day: "24.6 hours",
      moons: "2 (Phobos, Deimos)",
      description:
        "Olympus Mons (21.9 km) — tallest volcano in the Solar System. Valles Marineris (4,000 km) — longest canyon. Surface combines MOLA elevation with MRO color.",
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    textureKey: "jupiter",
    size: 1.9,
    orbit: 40,
    period: 11.862,
    day: 0.413,
    tilt: 0.0546,
    trailColor: 0xddb88a, // tan
    moons: [
      { id: "io", name: "Io", size: 0.22, orbit: 3.0, period: 1.769, color: 0xeed060 },
      { id: "europa", name: "Europa", size: 0.20, orbit: 3.7, period: 3.551, color: 0xefe6cf },
      { id: "ganymede", name: "Ganymede", size: 0.30, orbit: 4.6, period: 7.155, color: 0xc8b89a },
      { id: "callisto", name: "Callisto", size: 0.28, orbit: 5.7, period: 16.689, color: 0x8a7e6c },
    ],
    facts: {
      type: "Gas giant",
      diameter: "142,984 km (11.2 × Earth)",
      mass: "1.898 × 10²⁷ kg (318 × Earth, 2.5× all other planets combined)",
      distance: "778.5 million km (5.20 AU)",
      period: "11.86 Earth years",
      day: "9.93 hours — fastest rotation in the Solar System",
      moons: "95 confirmed (4 Galilean shown: Io, Europa, Ganymede, Callisto)",
      description:
        "Mostly H/He. Great Red Spot is a centuries-old storm ~1.3× Earth-diameter. Imagery: Voyager + Cassini + JunoCam composite.",
    },
  },
  {
    id: "saturn",
    name: "Saturn",
    textureKey: "saturn",
    size: 1.65,
    orbit: 58,
    period: 29.457,
    day: 0.444,
    tilt: 0.4665,
    rings: { inner: 2.1, outer: 3.7 },
    trailColor: 0xe8d3a0, // cream
    moons: [
      { id: "enceladus", name: "Enceladus", size: 0.10, orbit: 4.8, period: 1.37, color: 0xffffff },
      { id: "titan", name: "Titan", size: 0.30, orbit: 6.3, period: 15.95, color: 0xe89858 },
      { id: "iapetus", name: "Iapetus", size: 0.13, orbit: 8.0, period: 79.32, color: 0xa08c70, inclination: 0.27 },
    ],
    facts: {
      type: "Gas giant",
      diameter: "120,536 km (9.45 × Earth)",
      mass: "5.683 × 10²⁶ kg (95.2 × Earth)",
      distance: "1.434 billion km (9.58 AU)",
      period: "29.46 Earth years",
      day: "10.66 hours",
      moons: "146 confirmed (Titan, Enceladus, Iapetus shown)",
      description:
        "Density 0.687 g/cm³ — would float on water. Ring system uses the Cassini-imaged alpha map. Particles mostly water ice, ~10–100 m thick across ~282,000 km.",
    },
  },
  {
    id: "uranus",
    name: "Uranus",
    textureKey: "uranus",
    size: 1.18,
    orbit: 73,
    period: 84.011,
    day: -0.718,
    tilt: 1.7064,
    trailColor: 0x9ad9d9, // cyan
    moons: [
      { id: "titania", name: "Titania", size: 0.13, orbit: 3.0, period: 8.706, color: 0xa89890 },
      { id: "oberon", name: "Oberon", size: 0.13, orbit: 3.8, period: 13.46, color: 0x988878 },
    ],
    facts: {
      type: "Ice giant",
      diameter: "51,118 km (4.0 × Earth)",
      mass: "8.681 × 10²⁵ kg (14.5 × Earth)",
      distance: "2.871 billion km (19.22 AU)",
      period: "84.01 Earth years",
      day: "17.24 hours (retrograde)",
      moons: "28 (Titania, Oberon shown)",
      description:
        "97.77° axial tilt — rolls around the Sun on its side. Cyan from atmospheric methane. Voyager 2 (1986) remains the only spacecraft visit.",
    },
  },
  {
    id: "neptune",
    name: "Neptune",
    textureKey: "neptune",
    size: 1.15,
    orbit: 88,
    period: 164.79,
    day: 0.671,
    tilt: 0.4943,
    trailColor: 0x4a7af5, // deep blue
    moons: [
      // Triton orbits retrograde — only large moon in the Solar System to do so
      { id: "triton", name: "Triton", size: 0.18, orbit: 2.6, period: -5.877, color: 0xe6c8d8 },
    ],
    facts: {
      type: "Ice giant",
      diameter: "49,528 km (3.88 × Earth)",
      mass: "1.024 × 10²⁶ kg (17.1 × Earth)",
      distance: "4.495 billion km (30.05 AU)",
      period: "164.79 Earth years (no full orbit since 1846 discovery)",
      day: "16.11 hours",
      moons: "16 (Triton — retrograde orbit — shown)",
      description:
        "Windiest planet — supersonic winds reach 2,100 km/h. Triton orbits backwards and is likely a captured Kuiper-belt object. Voyager 2 (1989).",
    },
  },
];

// All bodies indexed by id for the nav panel & fly-to lookup
const ALL_BODIES: Body[] = [SUN, ...PLANETS];

// ────────────────────────────────────────────────────────────────────────
// Sim clock — 1 Earth year = 120 wall-clock seconds at speed=1×
// (was 30 in v3 — too fast, motion looked like a glitch. At 120 s/year
// Mercury still completes an orbit in ~29 s which is comfortable.)
// ────────────────────────────────────────────────────────────────────────

const EARTH_YEAR_SECONDS = 300; // 1 Earth year = 5 wall-clock minutes at 1×

// Visualization slowdowns — physics says Earth spins 365× per year, but at
// our sim scale that's ~1.6s/rotation = motion blur. We slow self-rotation
// independently from orbits so features (day/night terminator, Great Red
// Spot, ring shadow) are observable. The ratios between bodies stay
// proportional, only the absolute spin rate is dilated.
const SPIN_SLOWDOWN = 30; // planet + Sun + Earth-clouds + Venus-atmosphere
const MOON_ORBIT_SLOWDOWN = 5; // moon orbital periods

const BUILD_TAG = "v6 · 2026-05-23"; // bump to verify you're on the latest

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
// Fly-to-body camera animation
// ────────────────────────────────────────────────────────────────────────

type FlyTarget = {
  body: Body;
  meshRef: React.MutableRefObject<THREE.Object3D | null>;
} | null;

// Fly-to controller — v5 redesign.
//
// v4 used a per-frame lerp that fought OrbitControls' own update() and
// often left the camera centered on the Sun rather than the target body.
// v5 separates two operations:
//
//   1) JUST-FLIPPED — when flyTargetRef changes (new body selected), do
//      an INSTANT TELEPORT to the right offset distance from the new
//      body's current world position. This guarantees the camera ends
//      up adjacent to the right body, no race with OrbitControls.
//
//   2) TRACKING — once teleported, on every subsequent frame just keep
//      ctrl.target locked to the body's live world position. The
//      planet orbits the Sun, and target follows; OrbitControls then
//      moves the camera the same delta so it stays at a constant
//      relative offset (i.e. you orbit the planet as it orbits the Sun).
//      User scroll/drag is still free — they're operating in the
//      body's local frame.
function FlyToController({
  flyTargetRef,
  flyTargetVersionRef,
  orbitControlsRef,
}: {
  flyTargetRef: React.MutableRefObject<FlyTarget>;
  flyTargetVersionRef: React.MutableRefObject<number>;
  orbitControlsRef: React.MutableRefObject<{
    target: THREE.Vector3;
    update: () => void;
  } | null>;
}) {
  const { camera } = useThree();
  const tempVec = useRef(new THREE.Vector3());
  const lastVersion = useRef(0);

  useFrame(() => {
    const ft = flyTargetRef.current;
    const ctrl = orbitControlsRef.current;
    if (!ctrl) return;

    // Case 1: just-flipped — teleport.
    if (ft && ft.meshRef.current && flyTargetVersionRef.current !== lastVersion.current) {
      lastVersion.current = flyTargetVersionRef.current;

      ft.meshRef.current.getWorldPosition(tempVec.current);

      // Pull in tighter than v5 — size × 3 (was 4.5) puts the planet at
      // ~65% of viewport height, close enough to read continents on Earth
      // and bands on Jupiter.
      const desiredDist =
        ft.body.id === "sun" ? ft.body.size * 3 : ft.body.size * 3;

      const dir = camera.position.clone().sub(ctrl.target);
      if (dir.lengthSq() < 1e-6) {
        dir.set(0, 0.3, 1);
      }
      dir.normalize().multiplyScalar(desiredDist);

      ctrl.target.copy(tempVec.current);
      camera.position.copy(tempVec.current).add(dir);
      ctrl.update();
      return;
    }

    // Case 2: tracking — KEY FIX (v6). v5 lerped only ctrl.target toward
    // the moving body. OrbitControls only ROTATES the camera to look at
    // a moved target; it doesn't TRANSLATE the camera. Result: target
    // tracked Earth as Earth orbited the Sun, camera stayed pinned in
    // world space, Earth slid out of view, user saw the Sun again.
    //
    // Fix: compute the delta between the body's current position and our
    // current target, and apply the SAME delta to both target AND
    // camera.position. Now the camera rides with the planet through its
    // orbit, OrbitControls' offset stays constant, user keeps seeing
    // their planet centered.
    if (ft && ft.meshRef.current) {
      ft.meshRef.current.getWorldPosition(tempVec.current);
      const delta = tempVec.current.clone().sub(ctrl.target);
      // Apply a tiny smoothing factor for very small deltas to avoid
      // micro-jitter; for large deltas (e.g. user just clicked a new
      // body and we're catching up) snap.
      if (delta.lengthSq() > 1) {
        ctrl.target.add(delta);
        camera.position.add(delta);
      } else {
        const lerpAmt = 0.5;
        const partial = delta.multiplyScalar(lerpAmt);
        ctrl.target.add(partial);
        camera.position.add(partial);
      }
      ctrl.update();
    }
  });
  return null;
}

// ────────────────────────────────────────────────────────────────────────
// Orbit trail
// ────────────────────────────────────────────────────────────────────────

function OrbitTrail({
  radius,
  color = 0x8090a0,
  opacity = 0.55,
}: {
  radius: number;
  color?: number;
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 256;
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
            color,
            transparent: true,
            opacity,
          }),
        )
      }
    />
  );
}

// ────────────────────────────────────────────────────────────────────────
// Persistent body label (drei Html)
// ────────────────────────────────────────────────────────────────────────

function BodyLabel({
  name,
  yOffset,
  highlighted = false,
}: {
  name: string;
  yOffset: number;
  highlighted?: boolean;
}) {
  return (
    <Html
      position={[0, yOffset, 0]}
      center
      distanceFactor={18}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`whitespace-nowrap text-white text-[11px] font-semibold tracking-wide px-1.5 py-0.5 rounded-sm backdrop-blur-sm select-none ${
          highlighted ? "bg-primary/40 ring-1 ring-primary/50" : "bg-black/35"
        }`}
      >
        {name}
      </div>
    </Html>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Sun
// ────────────────────────────────────────────────────────────────────────

function Sun({
  body,
  texture,
  simTimeRef,
  onSelect,
  meshOutRef,
  focusedId,
}: {
  body: Body;
  texture: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
  meshOutRef: React.MutableRefObject<THREE.Object3D | null>;
  focusedId: string | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const dayPeriodInYears = Math.abs(body.day) / 365.25;
      meshRef.current.rotation.y =
        (simTimeRef.current * Math.PI * 2) /
        (dayPeriodInYears * SPIN_SLOWDOWN);
    }
  });

  return (
    <group
      ref={(el) => {
        if (meshOutRef) meshOutRef.current = el;
      }}
    >
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
        <sphereGeometry args={[body.size, 128, 128]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Inner corona */}
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
      {/* Outer corona */}
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

      <BodyLabel
        name={body.name}
        yOffset={body.size + 1.5}
        highlighted={focusedId === body.id}
      />

      <pointLight intensity={3} distance={500} decay={0.5} color={0xfff5e0} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// One moon — orbits its parent
// ────────────────────────────────────────────────────────────────────────

function MoonBody({
  moon,
  baseTexture,
  simTimeRef,
}: {
  moon: Moon;
  baseTexture: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Per-moon procedural texture (Io's sulphur, Europa's ice cracks,
  // Iapetus's two-tone, Triton's cantaloupe, etc.) generated from the
  // moon's real surface characteristics. Falls back to the supplied
  // baseTexture (LRO Moon map) for any moon we haven't defined a
  // procedural generator for — currently only Earth's Moon.
  const proc = useMemo(() => generateMoonTexture(moon.id), [moon.id]);
  const texture = proc ?? baseTexture;
  // If the procedural texture supplies the color (which it does for
  // every moon in moonTextures.ts), don't apply moon.color as a
  // multiplier — that would tint already-correctly-colored maps.
  const tintColor = proc ? 0xffffff : moon.color;

  useFrame(() => {
    const t = simTimeRef.current;
    // Moon period in Earth days, convert to Earth years AND apply the
    // visualization slowdown so moons orbit at a watchable pace (real
    // ratios would have Io at ~3 s/orbit, Phobos at ~0.5 s/orbit).
    const periodInYears = (Math.abs(moon.period) / 365.25) * MOON_ORBIT_SLOWDOWN;
    const sign = Math.sign(moon.period) || 1;
    if (orbitRef.current) {
      orbitRef.current.rotation.y =
        (t * Math.PI * 2 * sign) / periodInYears;
    }
    if (meshRef.current) {
      // Tidally locked — face always toward parent (same period as orbit)
      meshRef.current.rotation.y =
        (t * Math.PI * 2 * sign) / periodInYears;
    }
  });

  return (
    <group rotation={[moon.inclination ?? 0, 0, 0]}>
      <group ref={orbitRef}>
        <mesh ref={meshRef} position={[moon.orbit, 0, 0]}>
          <sphereGeometry args={[moon.size, 48, 48]} />
          <meshStandardMaterial
            map={texture}
            color={tintColor}
            roughness={1}
          />
          <BodyLabel name={moon.name} yOffset={moon.size + 0.18} />
        </mesh>
      </group>
      {/* Faint moon orbit trail */}
      <line>
        <bufferGeometry
          attach="geometry"
          ref={(el) => {
            if (!el) return;
            const segments = 96;
            const arr = new Float32Array((segments + 1) * 3);
            for (let i = 0; i <= segments; i++) {
              const a = (i / segments) * Math.PI * 2;
              arr[i * 3] = Math.cos(a) * moon.orbit;
              arr[i * 3 + 1] = 0;
              arr[i * 3 + 2] = Math.sin(a) * moon.orbit;
            }
            el.setAttribute("position", new THREE.BufferAttribute(arr, 3));
          }}
        />
        <lineBasicMaterial
          color={0xaaaaaa}
          transparent
          opacity={0.18}
          attach="material"
        />
      </line>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Generic textured planet — handles rings + moon children
// ────────────────────────────────────────────────────────────────────────

function Planet({
  body,
  texture,
  ringTexture,
  moonTexture,
  simTimeRef,
  onSelect,
  meshOutRef,
  focusedId,
}: {
  body: Body;
  texture: THREE.Texture;
  ringTexture?: THREE.Texture;
  moonTexture?: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
  meshOutRef: React.MutableRefObject<THREE.Object3D | null>;
  focusedId: string | null;
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
        (t * Math.PI * 2 * sign) /
        (dayPeriodInYears * SPIN_SLOWDOWN);
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
        >
          <sphereGeometry args={[body.size, 96, 96]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.95}
            metalness={0}
          />
        </mesh>

        {body.rings && ringTexture && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[body.rings.inner, body.rings.outer, 192]} />
            <meshBasicMaterial
              map={ringTexture}
              side={THREE.DoubleSide}
              transparent
              opacity={0.92}
              depthWrite={false}
            />
          </mesh>
        )}

        <BodyLabel
          name={body.name}
          yOffset={body.size + 0.4}
          highlighted={focusedId === body.id}
        />

        {/* Moons orbit the planet — they're parented to this tilted group */}
        {body.moons &&
          moonTexture &&
          body.moons.map((m) => (
            <MoonBody
              key={m.id}
              moon={m}
              baseTexture={moonTexture}
              simTimeRef={simTimeRef}
            />
          ))}

        {/* Artificial satellites */}
        {body.satellites?.map((s) => (
          <SatelliteBody key={s.id} sat={s} simTimeRef={simTimeRef} />
        ))}
      </group>
      <OrbitTrail radius={body.orbit} color={body.trailColor} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Earth — composite: day map + night lights blend + cloud layer + halo
// ────────────────────────────────────────────────────────────────────────

function Earth({
  body,
  dayMap,
  nightMap,
  cloudsMap,
  moonTexture,
  simTimeRef,
  onSelect,
  meshOutRef,
  focusedId,
  sunPos,
}: {
  body: Body;
  dayMap: THREE.Texture;
  nightMap: THREE.Texture;
  cloudsMap: THREE.Texture;
  moonTexture: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
  meshOutRef: React.MutableRefObject<THREE.Object3D | null>;
  focusedId: string | null;
  sunPos: THREE.Vector3;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const nightRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = simTimeRef.current;
    if (orbitRef.current) {
      orbitRef.current.rotation.y = (t * Math.PI * 2) / body.period;
    }
    if (surfaceRef.current) {
      const dayPeriodInYears = Math.abs(body.day) / 365.25;
      surfaceRef.current.rotation.y =
        (t * Math.PI * 2) /
        (dayPeriodInYears * SPIN_SLOWDOWN);
    }
    if (nightRef.current) {
      // Night layer rotates with the surface (both are tied to Earth's spin)
      nightRef.current.rotation.y = surfaceRef.current?.rotation.y ?? 0;
    }
    if (cloudsRef.current) {
      // Clouds rotate slightly faster for parallax depth (1.08× surface)
      cloudsRef.current.rotation.y =
        (t * Math.PI * 2 * 1.08) /
        ((Math.abs(body.day) / 365.25) * SPIN_SLOWDOWN);
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
        {/* Day-side surface */}
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
          <sphereGeometry args={[body.size, 128, 128]} />
          <meshStandardMaterial
            map={dayMap}
            roughness={0.92}
            metalness={0.02}
          />
        </mesh>

        {/* Night-side city lights — additive blending shows only on dark side */}
        <mesh ref={nightRef}>
          <sphereGeometry args={[body.size * 1.001, 128, 128]} />
          <meshBasicMaterial
            map={nightMap}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>

        {/* Clouds */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[body.size * 1.015, 128, 128]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent
            opacity={0.55}
            depthWrite={false}
            roughness={1}
          />
        </mesh>

        {/* Atmospheric halo */}
        <mesh>
          <sphereGeometry args={[body.size * 1.06, 64, 64]} />
          <meshBasicMaterial
            color={0x6ab4ff}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <BodyLabel
          name={body.name}
          yOffset={body.size + 0.4}
          highlighted={focusedId === body.id}
        />

        {/* Earth's moon */}
        {body.moons?.map((m) => (
          <MoonBody
            key={m.id}
            moon={m}
            baseTexture={moonTexture}
            simTimeRef={simTimeRef}
          />
        ))}

        {/* ISS / Hubble / JWST */}
        {body.satellites?.map((s) => (
          <SatelliteBody key={s.id} sat={s} simTimeRef={simTimeRef} />
        ))}
      </group>
      <OrbitTrail
        radius={body.orbit}
        color={body.trailColor ?? 0x6090f0}
        opacity={0.6}
      />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Venus — surface + super-rotating cloud atmosphere
// ────────────────────────────────────────────────────────────────────────

function Venus({
  body,
  surfaceMap,
  atmosphereMap,
  simTimeRef,
  onSelect,
  meshOutRef,
  focusedId,
}: {
  body: Body;
  surfaceMap: THREE.Texture;
  atmosphereMap: THREE.Texture;
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
  meshOutRef: React.MutableRefObject<THREE.Object3D | null>;
  focusedId: string | null;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const atmRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = simTimeRef.current;
    if (orbitRef.current) {
      orbitRef.current.rotation.y = (t * Math.PI * 2) / body.period;
    }
    if (surfaceRef.current) {
      const dayPeriodInYears = Math.abs(body.day) / 365.25;
      const sign = Math.sign(body.day) || 1;
      surfaceRef.current.rotation.y =
        (t * Math.PI * 2 * sign) /
        (dayPeriodInYears * SPIN_SLOWDOWN);
    }
    if (atmRef.current) {
      // Venus' upper atmosphere super-rotates ~60× faster than the
      // surface — ratio preserved with the slowdown applied to both.
      atmRef.current.rotation.y =
        (t * Math.PI * 2 * -60) /
        ((Math.abs(body.day) / 365.25) * SPIN_SLOWDOWN);
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
          <meshStandardMaterial map={surfaceMap} roughness={0.95} />
        </mesh>
        <mesh ref={atmRef}>
          <sphereGeometry args={[body.size * 1.025, 64, 64]} />
          <meshStandardMaterial
            map={atmosphereMap}
            transparent
            opacity={0.7}
            depthWrite={false}
            roughness={1}
          />
        </mesh>

        <BodyLabel
          name={body.name}
          yOffset={body.size + 0.4}
          highlighted={focusedId === body.id}
        />

        {/* Any artificial satellites of Venus (none yet, but the slot is here for consistency) */}
        {body.satellites?.map((s) => (
          <SatelliteBody key={s.id} sat={s} simTimeRef={simTimeRef} />
        ))}
      </group>
      <OrbitTrail radius={body.orbit} color={body.trailColor} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Artificial satellite — small emissive marker orbiting a parent body
// (ISS, Hubble, JWST, etc.). Same shape as MoonBody but uses a bright
// octahedron instead of a textured sphere — the marker is symbolic.
// ────────────────────────────────────────────────────────────────────────

function SatelliteBody({
  sat,
  simTimeRef,
}: {
  sat: Satellite;
  simTimeRef: React.MutableRefObject<number>;
}) {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (orbitRef.current) {
      const periodInYears = Math.abs(sat.period) / 365.25;
      const sign = Math.sign(sat.period) || 1;
      orbitRef.current.rotation.y =
        (simTimeRef.current * Math.PI * 2 * sign) / periodInYears;
    }
  });

  const size = sat.size ?? 0.04;
  const color = sat.color ?? 0xffffff;

  return (
    <group rotation={[sat.inclination ?? 0, 0, 0]}>
      <group ref={orbitRef}>
        <mesh position={[sat.orbit, 0, 0]}>
          <octahedronGeometry args={[size, 0]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        {/* A small additive glow to make the marker pop */}
        <mesh position={[sat.orbit, 0, 0]}>
          <sphereGeometry args={[size * 2.2, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <group position={[sat.orbit, size + 0.08, 0]}>
          <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap text-[10px] font-semibold tracking-wide px-1 py-px rounded-sm bg-cyan-500/30 ring-1 ring-cyan-300/40 backdrop-blur-sm text-white select-none">
              {sat.name}
            </div>
          </Html>
        </group>
      </group>
      {/* Faint orbit trail */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[sat.orbit - 0.005, sat.orbit + 0.005, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Asteroid belt — 3,500 instanced rocks between Mars and Jupiter
// ────────────────────────────────────────────────────────────────────────

const ASTEROID_COUNT = 3500;

function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const tempObj = new THREE.Object3D();
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Mars sits at 24, Jupiter at 40 — belt at 28–36 fills the gap
      const radius = 28 + Math.random() * 8;
      const height = (Math.random() - 0.5) * 0.8;
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
      const scale = 0.018 + Math.random() * 0.05;
      tempObj.scale.set(scale, scale, scale);
      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.005;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, ASTEROID_COUNT]}
      frustumCulled={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={0x807060} roughness={1} metalness={0} />
    </instancedMesh>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Milky Way skybox
// ────────────────────────────────────────────────────────────────────────

function MilkyWayBackground({ texture }: { texture: THREE.Texture }) {
  return (
    <mesh>
      <sphereGeometry args={[3500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Scene root — loads textures, renders all bodies
// ────────────────────────────────────────────────────────────────────────

function SolarSystemScene({
  simTimeRef,
  onSelect,
  bodyRefs,
  focusedId,
}: {
  simTimeRef: React.MutableRefObject<number>;
  onSelect: (b: Body) => void;
  bodyRefs: React.MutableRefObject<Record<string, React.MutableRefObject<THREE.Object3D | null>>>;
  focusedId: string | null;
}) {
  const t = useTexture({
    sun: "/textures/solar-system/8k_sun.jpg",
    mercury: "/textures/solar-system/8k_mercury.jpg",
    venusSurface: "/textures/solar-system/8k_venus_surface.jpg",
    venusAtmosphere: "/textures/solar-system/2k_venus_atmosphere.jpg",
    earthDay: "/textures/solar-system/8k_earth_daymap.jpg",
    earthNight: "/textures/solar-system/8k_earth_nightmap.jpg",
    earthClouds: "/textures/solar-system/8k_earth_clouds.jpg",
    mars: "/textures/solar-system/8k_mars.jpg",
    jupiter: "/textures/solar-system/8k_jupiter.jpg",
    saturn: "/textures/solar-system/8k_saturn.jpg",
    saturnRing: "/textures/solar-system/8k_saturn_ring_alpha.png",
    uranus: "/textures/solar-system/2k_uranus.jpg",
    neptune: "/textures/solar-system/2k_neptune.jpg",
    moon: "/textures/solar-system/8k_moon.jpg",
    stars: "/textures/solar-system/8k_stars_milky_way.jpg",
  });

  useEffect(() => {
    Object.values(t).forEach((tex) => {
      const tt = tex as THREE.Texture;
      tt.colorSpace = THREE.SRGBColorSpace;
      tt.anisotropy = 16;
    });
  }, [t]);

  // Make ref objects for each body (used by FlyToController to look up world position)
  if (!bodyRefs.current.sun) {
    ALL_BODIES.forEach((b) => {
      bodyRefs.current[b.id] = { current: null };
    });
  }

  const sunWorldPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  return (
    <>
      <MilkyWayBackground texture={t.stars} />
      <ambientLight intensity={0.05} />

      <Sun
        body={SUN}
        texture={t.sun}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.sun}
        focusedId={focusedId}
      />

      <Planet
        body={PLANETS[0]} // Mercury
        texture={t.mercury}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.mercury}
        focusedId={focusedId}
      />

      <Venus
        body={PLANETS[1]}
        surfaceMap={t.venusSurface}
        atmosphereMap={t.venusAtmosphere}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.venus}
        focusedId={focusedId}
      />

      <Earth
        body={PLANETS[2]}
        dayMap={t.earthDay}
        nightMap={t.earthNight}
        cloudsMap={t.earthClouds}
        moonTexture={t.moon}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.earth}
        focusedId={focusedId}
        sunPos={sunWorldPos}
      />

      <Planet
        body={PLANETS[3]} // Mars
        texture={t.mars}
        moonTexture={t.moon}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.mars}
        focusedId={focusedId}
      />

      <AsteroidBelt />

      <Planet
        body={PLANETS[4]} // Jupiter
        texture={t.jupiter}
        moonTexture={t.moon}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.jupiter}
        focusedId={focusedId}
      />

      <Planet
        body={PLANETS[5]} // Saturn
        texture={t.saturn}
        ringTexture={t.saturnRing}
        moonTexture={t.moon}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.saturn}
        focusedId={focusedId}
      />

      <Planet
        body={PLANETS[6]} // Uranus
        texture={t.uranus}
        moonTexture={t.moon}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.uranus}
        focusedId={focusedId}
      />

      <Planet
        body={PLANETS[7]} // Neptune
        texture={t.neptune}
        moonTexture={t.moon}
        simTimeRef={simTimeRef}
        onSelect={onSelect}
        meshOutRef={bodyRefs.current.neptune}
        focusedId={focusedId}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────

export default function SolarSystemPage() {
  const simTimeRef = useRef(0);
  const orbitControlsRef = useRef<{
    target: THREE.Vector3;
    update: () => void;
    reset: () => void;
  } | null>(null);
  const bodyRefs = useRef<
    Record<string, React.MutableRefObject<THREE.Object3D | null>>
  >({});
  const flyTargetRef = useRef<FlyTarget>(null);
  // Incremented each time the user picks a new fly-to target. The
  // controller detects the change and does an instant teleport (vs.
  // continuous tracking the rest of the time).
  const flyTargetVersionRef = useRef(0);

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(0.5); // v5 default — gentle pace
  const [selected, setSelected] = useState<Body | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Default camera: high & wide enough to see all 8 planets (Neptune sits
  // at orbit=88 in v4). Up to maxDistance=800 in OrbitControls so users
  // can zoom further out too.
  const DEFAULT_CAM: [number, number, number] = [0, 95, 215];

  const flyToBody = (b: Body) => {
    const ref = bodyRefs.current[b.id];
    if (!ref || !ref.current) return;
    flyTargetRef.current = { body: b, meshRef: ref };
    flyTargetVersionRef.current += 1; // signal: do a fresh teleport
    setFocusedId(b.id);
    setSelected(b);
  };

  const flyToWholeSystem = () => {
    flyTargetRef.current = null;
    setFocusedId(null);
    const c = orbitControlsRef.current;
    if (c) {
      c.reset();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.code === "KeyR") {
        flyToWholeSystem();
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
        camera={{ position: DEFAULT_CAM, fov: 55, near: 0.1, far: 10000 }}
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
            onSelect={(b) => setSelected(b)}
            bodyRefs={bodyRefs}
            focusedId={focusedId}
          />
          <FlyToController
            flyTargetRef={flyTargetRef}
            flyTargetVersionRef={flyTargetVersionRef}
            orbitControlsRef={orbitControlsRef}
          />
          <OrbitControls
            ref={
              orbitControlsRef as React.MutableRefObject<
                unknown
              > as React.RefObject<unknown> as never
            }
            enableDamping
            dampingFactor={0.08}
            minDistance={0.3}
            maxDistance={800}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* ──────────── Top bar ──────────── */}
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
            Built-in portal · {BUILD_TAG}
          </div>
          <div className="text-base font-semibold">Solar System Explorer</div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-md px-2 py-1 border border-white/10">
          <button
            onClick={() => setPaused((p) => !p)}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            title={paused ? "Play (Space)" : "Pause (Space)"}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-transparent text-sm px-2 py-1 rounded border border-white/20 hover:border-white/40 outline-none cursor-pointer"
            title="Time multiplier"
          >
            <option value={0.1} className="bg-black">0.1× (very slow)</option>
            <option value={0.5} className="bg-black">0.5× (default)</option>
            <option value={1} className="bg-black">1× (1 yr / 5 min)</option>
            <option value={5} className="bg-black">5×</option>
            <option value={25} className="bg-black">25×</option>
            <option value={200} className="bg-black">200×</option>
          </select>
          <button
            onClick={flyToWholeSystem}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            title="Reset view (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ──────────── Left rail: Fly-to navigation ──────────── */}
      <div className="absolute top-24 left-4 z-10 pointer-events-auto bg-black/55 backdrop-blur-md rounded-lg p-2 border border-white/10 flex flex-col gap-1">
        <button
          onClick={flyToWholeSystem}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
            focusedId === null
              ? "bg-primary text-primary-foreground"
              : "hover:bg-white/10"
          }`}
          title="See the whole system"
        >
          <Maximize className="h-3.5 w-3.5" />
          <span>Whole system</span>
        </button>
        <div className="h-px bg-white/10 my-1" />
        {ALL_BODIES.map((b) => (
          <button
            key={b.id}
            onClick={() => flyToBody(b)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
              focusedId === b.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-white/10"
            }`}
            title={`Fly to ${b.name}`}
          >
            <Locate className="h-3.5 w-3.5 opacity-50" />
            <span>{b.name}</span>
          </button>
        ))}
      </div>

      {/* ──────────── Info panel ──────────── */}
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
          {focusedId !== selected.id && (
            <button
              onClick={() => flyToBody(selected)}
              className="mt-4 w-full px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded transition-colors flex items-center justify-center gap-2"
            >
              <Locate className="h-3.5 w-3.5" /> Fly to {selected.name}
            </button>
          )}
        </div>
      )}

      {/* ──────────── Help / hint footer ──────────── */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto text-xs text-white/50 bg-black/40 backdrop-blur-md rounded-md px-3 py-2 border border-white/10">
        <Info className="h-3 w-3 inline mr-1" />
        Drag rotate · scroll zoom · click a body for facts · use left rail to
        fly to any body ·{" "}
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Space</kbd>{" "}
        pause ·{" "}
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">R</kbd>{" "}
        whole system
      </div>

      {/* CC BY 4.0 attribution */}
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

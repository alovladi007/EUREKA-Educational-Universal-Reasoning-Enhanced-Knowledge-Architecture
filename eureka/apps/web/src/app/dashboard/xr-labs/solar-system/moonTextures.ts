/**
 * Procedural moon textures for the Solar System Explorer.
 *
 * Why procedural?
 *   The 8K Solar System Scope set only covers Earth's Moon. Real
 *   equirectangular maps of Phobos / Io / Europa / Titan / etc. exist
 *   (USGS Astrogeology Cartographic Atlas), but their site is a
 *   JavaScript-driven SPA and the actual high-res file URLs aren't
 *   reliably scriptable from a curl-only environment. Hashed thumbnails
 *   are visible but no full-res endpoint.
 *
 *   Wikipedia / Wikimedia has some moon imagery, but mostly as full-disk
 *   portrait photos (round images) rather than equirectangular sphere
 *   maps — those map poorly onto a UV sphere (center → point, edges →
 *   wraparound).
 *
 *   So instead of either (a) shipping low-fidelity full-disk maps that
 *   look distorted on a sphere or (b) showing every moon as a flat
 *   color-tinted copy of the Luna texture (the v3 approach), this module
 *   generates a unique 2D-canvas texture per moon that reflects that
 *   moon's *actual* signature features:
 *
 *     - Io       : sulphur volcanism — yellow base, red/orange splotches,
 *                  white sulphur deposits, NO craters (resurfaces too fast)
 *     - Europa   : ice base with brown/red linear cracks (lineae /
 *                  chaos terrain), very few craters
 *     - Ganymede : alternating dark and light terrain bands (grooved
 *                  terrain), moderate cratering
 *     - Callisto : the most heavily cratered body in the Solar System —
 *                  densely speckled with dark and bright impact spots
 *     - Enceladus: nearly pure white with the famous "tiger stripes"
 *                  near the south pole (active geyser fractures)
 *     - Titan    : smooth orange — its thick haze obscures surface
 *                  detail completely in visible light
 *     - Iapetus  : the famous TWO-TONE moon — one hemisphere black
 *                  (Cassini Regio), the opposite hemisphere white
 *     - Phobos   : dark grey, dominated by the Stickney crater + radial
 *                  grooves; densely cratered elsewhere
 *     - Deimos   : smoother than Phobos (regolith-covered), less
 *                  prominent cratering
 *     - Titania  : grey-brown, moderate craters + canyon system
 *                  (Messina Chasmata)
 *     - Oberon   : darker, heavily cratered, mountainous
 *     - Triton   : pink-purple "cantaloupe terrain" — characteristic
 *                  polygonal cell network from Voyager 2 imaging
 *
 *   Generation is deterministic (seeded pseudo-random) so the same moon
 *   produces the same texture on every page load.
 *
 * Real moon textures (USGS / NASA SVS / Celestia community) can be
 * swapped in later if anyone wants to do the manual texture sourcing
 * pass — replace the entry in MOON_TEXTURE_FACTORY with a
 * useTexture("/textures/solar-system/<moon>.jpg") lookup.
 */
import * as THREE from "three";

const W = 1024;
const H = 512;

// Mulberry32 PRNG — small, fast, deterministic from a seed.
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Each moon-id maps to a generator function. All canvases are W×H (2:1
// aspect ratio for equirectangular sphere mapping).
type Gen = (ctx: CanvasRenderingContext2D, rand: () => number) => void;

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function fill(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
}

function speckleNoise(
  ctx: CanvasRenderingContext2D,
  rand: () => number,
  count: number,
  color: string,
  minR: number,
  maxR: number,
  alphaMin = 0.1,
  alphaMax = 0.4,
) {
  for (let i = 0; i < count; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = minR + rand() * (maxR - minR);
    ctx.globalAlpha = alphaMin + rand() * (alphaMax - alphaMin);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function craters(
  ctx: CanvasRenderingContext2D,
  rand: () => number,
  count: number,
  minR: number,
  maxR: number,
  rimColor = "rgba(255,255,255,0.18)",
  bowlColor = "rgba(0,0,0,0.35)",
) {
  for (let i = 0; i < count; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = minR + rand() * (maxR - minR);
    // Bowl (darker inside)
    ctx.fillStyle = bowlColor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    // Bright rim
    ctx.strokeStyle = rimColor;
    ctx.lineWidth = Math.max(0.5, r * 0.2);
    ctx.beginPath();
    ctx.arc(x, y, r * 1.05, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function jaggedLine(
  ctx: CanvasRenderingContext2D,
  rand: () => number,
  startX: number,
  startY: number,
  totalLength: number,
  segments: number,
  jitter: number,
) {
  let x = startX;
  let y = startY;
  const dx = totalLength / segments;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let s = 0; s < segments; s++) {
    x += dx + (rand() - 0.5) * jitter * 2;
    y += (rand() - 0.5) * jitter;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// ──────────────────────────────────────────────────────────────────
// Per-moon generators
// ──────────────────────────────────────────────────────────────────

const GENERATORS: Record<string, Gen> = {
  // ───── Mars's moons ─────
  phobos: (ctx, rand) => {
    fill(ctx, "#6f5e4e");
    speckleNoise(ctx, rand, 700, "#3a2e22", 0.5, 2.5, 0.1, 0.25);
    speckleNoise(ctx, rand, 250, "#a5907a", 0.5, 3, 0.08, 0.18);
    craters(ctx, rand, 350, 1.5, 8);
    // Stickney crater — the giant one, ~9 km on a ~22 km body
    const sx = W * 0.4;
    const sy = H * 0.45;
    const sr = 60;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(220,210,200,0.4)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 1.08, 0, Math.PI * 2);
    ctx.stroke();
    // Radial grooves emanating from Stickney
    ctx.strokeStyle = "rgba(40,30,20,0.4)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 30; i++) {
      const a = rand() * Math.PI * 2;
      const len = 80 + rand() * 200;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(a) * sr, sy + Math.sin(a) * sr);
      ctx.lineTo(sx + Math.cos(a) * (sr + len), sy + Math.sin(a) * (sr + len));
      ctx.stroke();
    }
  },

  deimos: (ctx, rand) => {
    // Smoother (regolith-covered), less prominent cratering
    fill(ctx, "#8a7565");
    speckleNoise(ctx, rand, 400, "#5a4634", 0.5, 2, 0.08, 0.18);
    speckleNoise(ctx, rand, 200, "#a08c78", 0.5, 2.5, 0.06, 0.14);
    craters(ctx, rand, 120, 1, 4, "rgba(255,255,255,0.1)", "rgba(0,0,0,0.2)");
  },

  // ───── Jupiter's Galilean moons ─────
  io: (ctx, rand) => {
    // Base yellow-orange
    fill(ctx, "#dfb04e");
    // Lighter sulphur frost patches
    speckleNoise(ctx, rand, 80, "#fff2a6", 8, 28, 0.45, 0.7);
    // Active volcanic deposits (red/orange)
    speckleNoise(ctx, rand, 70, "#c14a16", 6, 24, 0.55, 0.8);
    // Dark plume fallout / pateras
    speckleNoise(ctx, rand, 35, "#6e2a0a", 8, 35, 0.6, 0.85);
    // Bright white spots (SO2 ice)
    speckleNoise(ctx, rand, 50, "#ffffff", 2, 8, 0.5, 0.8);
    // No craters — Io resurfaces too fast for them to persist
  },

  europa: (ctx, rand) => {
    // Pale icy base with subtle warmth
    fill(ctx, "#e0d8c4");
    // Slight color variation across the surface
    speckleNoise(ctx, rand, 60, "#c8b89a", 30, 80, 0.05, 0.12);
    // Lineae — the famous brown/red linear fractures
    ctx.lineCap = "round";
    for (let i = 0; i < 60; i++) {
      const x1 = rand() * W;
      const y1 = rand() * H;
      const len = 100 + rand() * 400;
      const w = 1 + rand() * 2.5;
      ctx.strokeStyle = `rgba(${130 + Math.floor(rand() * 30)},${70 + Math.floor(rand() * 30)},${50 + Math.floor(rand() * 20)},0.55)`;
      ctx.lineWidth = w;
      jaggedLine(ctx, rand, x1, y1, len, 14, 8);
    }
    // Triple-band lineae (lighter parallel stripes)
    for (let i = 0; i < 25; i++) {
      const x1 = rand() * W;
      const y1 = rand() * H;
      const len = 150 + rand() * 250;
      ctx.strokeStyle = "rgba(190,170,150,0.4)";
      ctx.lineWidth = 0.8;
      jaggedLine(ctx, rand, x1, y1, len, 12, 5);
    }
    // Very few small craters
    craters(ctx, rand, 18, 1, 4);
  },

  ganymede: (ctx, rand) => {
    // Base dark grey-brown
    fill(ctx, "#8a7866");
    // Alternating bands of grooved (light) and cratered (dark) terrain
    for (let i = 0; i < 16; i++) {
      const yc = rand() * H;
      const bh = 20 + rand() * 70;
      const light = rand() > 0.45;
      ctx.fillStyle = light
        ? "rgba(180,165,150,0.35)"
        : "rgba(55,45,38,0.35)";
      ctx.fillRect(0, yc, W, bh);
    }
    // Fine vertical grooves on lighter bands
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 0.6;
    for (let i = 0; i < 200; i++) {
      const x = rand() * W;
      const y = rand() * H;
      const len = 10 + rand() * 40;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 5, y + len);
      ctx.stroke();
    }
    craters(ctx, rand, 250, 1, 6);
  },

  callisto: (ctx, rand) => {
    // The most heavily cratered body in the Solar System
    fill(ctx, "#52453a");
    speckleNoise(ctx, rand, 400, "#2c241c", 1, 4, 0.18, 0.35);
    // Dense small craters
    craters(ctx, rand, 1200, 0.8, 5, "rgba(255,255,255,0.14)", "rgba(0,0,0,0.32)");
    // A few prominent larger ones with bright rays
    for (let i = 0; i < 8; i++) {
      const x = rand() * W;
      const y = rand() * H;
      const r = 15 + rand() * 25;
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.1, 0, Math.PI * 2);
      ctx.stroke();
      // Ray system
      ctx.strokeStyle = "rgba(220,210,200,0.15)";
      ctx.lineWidth = 1;
      for (let j = 0; j < 12; j++) {
        const a = (j / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        ctx.lineTo(x + Math.cos(a) * (r + 30 + rand() * 50), y + Math.sin(a) * (r + 30 + rand() * 50));
        ctx.stroke();
      }
    }
  },

  // ───── Saturn's moons ─────
  enceladus: (ctx, rand) => {
    // Pristine icy white
    fill(ctx, "#f4f4ff");
    // Subtle blue-tinged shading
    speckleNoise(ctx, rand, 40, "#d0d8e8", 30, 100, 0.08, 0.15);
    // Tiger stripes near the south pole (bottom of equirectangular map)
    ctx.strokeStyle = "rgba(80,100,140,0.5)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const yBase = H * 0.78 + i * 18;
      const xStart = W * 0.25 + i * 30;
      ctx.beginPath();
      ctx.moveTo(xStart, yBase);
      for (let s = 0; s < 24; s++) {
        const px = xStart + (s / 24) * W * 0.5 + (rand() - 0.5) * 6;
        const py = yBase + (rand() - 0.5) * 12;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    // A few small craters
    craters(ctx, rand, 25, 1, 4, "rgba(180,200,230,0.18)", "rgba(40,60,90,0.15)");
  },

  titan: (ctx, rand) => {
    // Smooth orange — thick haze obscures the surface in visible light
    fill(ctx, "#d68e3e");
    // Subtle banding (faint atmospheric structure)
    for (let i = 0; i < 30; i++) {
      const y = rand() * H;
      const bh = 8 + rand() * 24;
      ctx.fillStyle = `rgba(${180 + Math.floor(rand() * 20)},${110 + Math.floor(rand() * 20)},${50 + Math.floor(rand() * 15)},${0.1 + rand() * 0.1})`;
      ctx.fillRect(0, y, W, bh);
    }
    // No craters / no surface features visible
    speckleNoise(ctx, rand, 30, "#a96e22", 80, 200, 0.05, 0.1);
  },

  iapetus: (ctx, rand) => {
    // The famous two-tone moon — one hemisphere dark, one light.
    // Left half (Cassini Regio) is jet black; right half is icy white.
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "#1a1410");
    grad.addColorStop(0.25, "#1a1410");
    grad.addColorStop(0.42, "#5a4030");
    grad.addColorStop(0.58, "#a09080");
    grad.addColorStop(0.75, "#c8baa6");
    grad.addColorStop(1, "#c8baa6");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Wrap (the texture wraps around horizontally — left/right edges meet)
    speckleNoise(ctx, rand, 600, "#000000", 0.5, 2, 0.15, 0.3);
    speckleNoise(ctx, rand, 200, "#e8dcc8", 0.5, 2, 0.1, 0.25);
    craters(ctx, rand, 240, 1, 7);
    // The famous equatorial ridge on Iapetus — a single linear feature
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, H * 0.495, W, 6);
  },

  // ───── Uranus's moons ─────
  titania: (ctx, rand) => {
    fill(ctx, "#988478");
    speckleNoise(ctx, rand, 200, "#5e4e44", 1, 4, 0.18, 0.35);
    speckleNoise(ctx, rand, 100, "#b4a294", 1, 3, 0.12, 0.25);
    craters(ctx, rand, 200, 1, 6);
    // Messina Chasmata — long canyon
    ctx.strokeStyle = "rgba(40,30,25,0.5)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(W * 0.3, H * 0.4);
    for (let s = 0; s < 20; s++) {
      const px = W * 0.3 + (s / 20) * W * 0.4 + (rand() - 0.5) * 5;
      const py = H * 0.4 + (rand() - 0.5) * 10 + s * 1.5;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  },

  oberon: (ctx, rand) => {
    fill(ctx, "#806c5e");
    speckleNoise(ctx, rand, 250, "#3e342c", 1, 4, 0.2, 0.4);
    speckleNoise(ctx, rand, 80, "#9c8a7a", 1, 3, 0.1, 0.2);
    craters(ctx, rand, 280, 1, 6);
    // Mt. Bishop (a possible mountain visible on Oberon's terminator)
    ctx.fillStyle = "rgba(30,20,15,0.6)";
    ctx.beginPath();
    ctx.arc(W * 0.55, H * 0.5, 8, 0, Math.PI * 2);
    ctx.fill();
  },

  // ───── Neptune's moons ─────
  triton: (ctx, rand) => {
    // Pink-purple base
    fill(ctx, "#e0c0d0");
    // Pinker tinted regions
    speckleNoise(ctx, rand, 40, "#c890a8", 40, 130, 0.1, 0.22);
    // "Cantaloupe terrain" — polygonal cell network from Voyager 2 imaging
    ctx.strokeStyle = "rgba(150,110,135,0.45)";
    ctx.lineWidth = 1.2;
    const cells = 35;
    for (let i = 0; i < cells; i++) {
      const cx = rand() * W;
      const cy = rand() * H;
      const r = 25 + rand() * 35;
      const sides = 5 + Math.floor(rand() * 3);
      ctx.beginPath();
      for (let s = 0; s < sides; s++) {
        const a = (s / sides) * Math.PI * 2 + rand() * 0.3;
        const rr = r * (0.85 + rand() * 0.3);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    // South-pole geyser deposits (dark streaks)
    ctx.strokeStyle = "rgba(80,40,60,0.4)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 25; i++) {
      const x = rand() * W;
      const y = H * 0.7 + rand() * H * 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 6, y - 15 - rand() * 30);
      ctx.stroke();
    }
  },
};

// ──────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────

// Cache so the textures aren't regenerated on every render. SSR-safe
// guard: only create when window/document is available.
const cache: Record<string, THREE.CanvasTexture> = {};

export function generateMoonTexture(moonId: string): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  if (cache[moonId]) return cache[moonId];
  const gen = GENERATORS[moonId];
  if (!gen) return null;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Per-moon deterministic seed so the texture is stable across reloads
  const seed = Array.from(moonId).reduce((a, c) => a + c.charCodeAt(0) * 1103515245, 1);
  const rand = mulberry32(seed);

  gen(ctx, rand);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.needsUpdate = true;
  cache[moonId] = tex;
  return tex;
}

export const MOON_IDS_WITH_TEXTURE = Object.keys(GENERATORS);

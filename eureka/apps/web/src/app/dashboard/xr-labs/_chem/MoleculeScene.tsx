'use client';

/**
 * The shared molecule renderer for both XR chemistry labs.
 *
 * One scene component serves Organic Chemistry 3D and General Chemistry 3D,
 * so a learner crossing between them is not learning two viewers. Everything
 * it draws is derived from the Molecule record: it holds no per-molecule
 * special cases, which is what stops the picture and the data from drifting
 * apart.
 *
 * Overlays exist because the course teaches things a plain ball-and-stick
 * model cannot show:
 *
 *   lonePairs  - VSEPR shape is about where the ATOMS are, but the geometry
 *                is set by where the ELECTRON DOMAINS are. Without the lone
 *                pairs on screen, bent water looks arbitrary instead of
 *                inevitable.
 *   dipoles    - bond dipoles are computed from the Pauling electronegativity
 *                gap and summed as vectors, so "the dipoles cancel" becomes
 *                something a learner watches happen rather than is told.
 *   piSystems  - the leftover p orbitals that make a pi bond, drawn as the
 *                two lobes above and below the sigma framework. This is the
 *                picture behind why a double bond does not rotate.
 *   stereo     - CIP R/S badges, on stereocentres only.
 */

import { useMemo, useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import {
  BALL_SCALE,
  ELEMENTS,
  NONPOLAR_CUTOFF,
  electronegativityGap,
  moreElectronegative,
} from './elements';
import type { Atom, Bond, Molecule, RenderStyle, SceneOverlays } from './types';

const UP = new THREE.Vector3(0, 1, 0);

function v3(p: [number, number, number]) {
  return new THREE.Vector3(p[0], p[1], p[2]);
}

/** Radius a given atom is drawn at, in the current style. */
function atomRadius(atom: Atom, style: RenderStyle): number {
  const vdw = ELEMENTS[atom.el].vdw;
  if (style === 'space-filling') return vdw;
  if (style === 'wireframe') return vdw * BALL_SCALE * 0.35;
  return vdw * BALL_SCALE;
}

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------

function AtomMesh({
  atom,
  index,
  style,
  selected,
  measuring,
  onPick,
}: {
  atom: Atom;
  index: number;
  style: RenderStyle;
  selected: boolean;
  measuring: boolean;
  onPick: (i: number) => void;
}) {
  const info = ELEMENTS[atom.el];
  const r = atomRadius(atom, style);
  return (
    <group position={atom.pos}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onPick(index);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[r, 32, 24]} />
        <meshStandardMaterial
          color={info.color}
          roughness={0.32}
          metalness={0.05}
          transparent={style === 'space-filling'}
          opacity={style === 'space-filling' ? 0.92 : 1}
        />
      </mesh>

      {/* Selection / measurement ring. Drawn as a slightly larger shell rather
          than an outline so it reads from any angle. */}
      {(selected || measuring) && (
        <mesh>
          <sphereGeometry args={[r * 1.28, 24, 18]} />
          <meshBasicMaterial
            color={measuring ? '#fbbf24' : '#38bdf8'}
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Bonds
// ---------------------------------------------------------------------------

/**
 * A bond is drawn as one cylinder per order, offset perpendicular to the bond
 * axis. Aromatic bonds (order 1.5) get one solid cylinder plus one thinner
 * inner one, which is the standard way of saying "delocalised" without
 * claiming a localised double bond sits here.
 *
 * Each half is coloured by the atom it touches, so a bond between unlike
 * atoms reads as two-toned. That is what makes polarity legible at a glance
 * before the dipole overlay is even switched on.
 */
function BondMesh({
  bond,
  atoms,
  style,
}: {
  bond: Bond;
  atoms: Atom[];
  style: RenderStyle;
}) {
  const { segments, quaternion, mid, length } = useMemo(() => {
    const a = v3(atoms[bond.a].pos);
    const b = v3(atoms[bond.b].pos);
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
    let perp = new THREE.Vector3().crossVectors(dir, UP);
    if (perp.lengthSq() < 1e-8) perp = new THREE.Vector3(1, 0, 0);
    perp.normalize();

    const gap = 0.14;
    let offsets: number[];
    if (bond.order === 3) offsets = [-gap, 0, gap];
    else if (bond.order === 2) offsets = [-gap * 0.62, gap * 0.62];
    else offsets = [0];

    return {
      segments: offsets.map((o) => perp.clone().multiplyScalar(o)),
      quaternion: q,
      mid: new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5),
      length: len,
    };
  }, [bond, atoms]);

  if (style === 'space-filling') return null;

  const radius = style === 'wireframe' ? 0.035 : bond.order === 1 ? 0.075 : 0.055;
  const colorA = ELEMENTS[atoms[bond.a].el].color;
  const colorB = ELEMENTS[atoms[bond.b].el].color;
  const aromatic = bond.order === 1.5;

  return (
    <>
      {segments.map((offset, i) => (
        <group key={i} position={mid.clone().add(offset)} quaternion={quaternion}>
          {/* Two half-cylinders, each in its own atom's colour. */}
          <mesh position={[0, -length / 4, 0]}>
            <cylinderGeometry args={[radius, radius, length / 2, 16]} />
            <meshStandardMaterial color={colorA} roughness={0.45} metalness={0.05} />
          </mesh>
          <mesh position={[0, length / 4, 0]}>
            <cylinderGeometry args={[radius, radius, length / 2, 16]} />
            <meshStandardMaterial color={colorB} roughness={0.45} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* The delocalised inner rod for an aromatic bond. */}
      {aromatic && (
        <group position={mid} quaternion={quaternion}>
          <mesh>
            <cylinderGeometry args={[radius * 0.45, radius * 0.45, length * 0.82, 12]} />
            <meshStandardMaterial
              color="#a78bfa"
              roughness={0.3}
              emissive="#7c3aed"
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Lone pairs
// ---------------------------------------------------------------------------

/**
 * Lone pairs are placed by completing the electron geometry: take the
 * directions of the bonds already present, and put the remaining domains
 * where they are furthest from those and from each other.
 *
 * This is a real (if small) VSEPR solve rather than a per-molecule lookup,
 * done by repelling points on a sphere. It matters that it is computed: a
 * learner rotating water should see the two lone pairs sit where VSEPR says
 * they must, not where an author decided to draw them.
 */
function lonePairDirections(
  atom: Atom,
  index: number,
  atoms: Atom[],
  bonds: Bond[],
): THREE.Vector3[] {
  if (atom.lp <= 0) return [];

  const origin = v3(atom.pos);
  const bonded: THREE.Vector3[] = [];
  bonds.forEach((b) => {
    const other = b.a === index ? b.b : b.b === index ? b.a : -1;
    if (other >= 0) {
      bonded.push(v3(atoms[other].pos).sub(origin).normalize());
    }
  });

  // Seed the free domains away from the bonded ones, then relax.
  const seeds: THREE.Vector3[] = [];
  for (let i = 0; i < atom.lp; i += 1) {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (2 * (i + 0.5)) / Math.max(1, atom.lp) ;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * (i + 1);
    seeds.push(
      new THREE.Vector3(Math.cos(theta) * rad, y, Math.sin(theta) * rad).normalize(),
    );
  }

  // Coulomb-style relaxation against the fixed bond directions and each other.
  for (let step = 0; step < 220; step += 1) {
    seeds.forEach((s, i) => {
      const force = new THREE.Vector3();
      const push = (other: THREE.Vector3) => {
        const d = new THREE.Vector3().subVectors(s, other);
        const d2 = Math.max(0.05, d.lengthSq());
        force.add(d.normalize().multiplyScalar(1 / d2));
      };
      bonded.forEach(push);
      seeds.forEach((o, j) => {
        if (i !== j) push(o);
      });
      s.addScaledVector(force, 0.02).normalize();
    });
  }
  return seeds;
}

function LonePairs({
  atom,
  index,
  atoms,
  bonds,
  style,
}: {
  atom: Atom;
  index: number;
  atoms: Atom[];
  bonds: Bond[];
  style: RenderStyle;
}) {
  const dirs = useMemo(
    () => lonePairDirections(atom, index, atoms, bonds),
    [atom, index, atoms, bonds],
  );
  if (!dirs.length) return null;

  const r = atomRadius(atom, style);
  return (
    <>
      {dirs.map((d, i) => {
        const pos = v3(atom.pos).addScaledVector(d, r + 0.34);
        const q = new THREE.Quaternion().setFromUnitVectors(UP, d);
        return (
          <group key={i} position={pos} quaternion={q}>
            {/* A squashed lobe, wider than it is long, reading as a cloud
                rather than another bond. */}
            <mesh scale={[1, 0.62, 1]}>
              <sphereGeometry args={[0.2, 20, 14]} />
              <meshStandardMaterial
                color="#c4b5fd"
                transparent
                opacity={0.5}
                emissive="#8b5cf6"
                emissiveIntensity={0.5}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Dipoles
// ---------------------------------------------------------------------------

/**
 * Bond dipoles and their vector sum.
 *
 * Each polar bond gets an arrow pointing toward the more electronegative
 * atom, scaled by the electronegativity gap. The net arrow is their sum. When
 * the sum comes out near zero -- CO2, CCl4, benzene -- the scene says so in
 * words instead of drawing a misleading stub, because "no net dipole" is the
 * lesson and a tiny arrow would teach the opposite.
 */
function Dipoles({ molecule }: { molecule: Molecule }) {
  const { arrows, net } = useMemo(() => {
    const list: { from: THREE.Vector3; dir: THREE.Vector3; mag: number }[] = [];
    const sum = new THREE.Vector3();
    molecule.bonds.forEach((b) => {
      const ea = molecule.atoms[b.a].el;
      const eb = molecule.atoms[b.b].el;
      const gap = electronegativityGap(ea, eb);
      if (gap < NONPOLAR_CUTOFF) return;
      const pa = v3(molecule.atoms[b.a].pos);
      const pb = v3(molecule.atoms[b.b].pos);
      const toward = moreElectronegative(ea, eb) === ea ? pa : pb;
      const from = toward === pa ? pb : pa;
      const dir = new THREE.Vector3().subVectors(toward, from).normalize();
      list.push({
        from: new THREE.Vector3().addVectors(pa, pb).multiplyScalar(0.5),
        dir,
        mag: gap,
      });
      sum.addScaledVector(dir, gap);
    });
    return { arrows: list, net: sum };
  }, [molecule]);

  const netMag = net.length();
  // Below this the vector sum is cancellation, not a small real dipole.
  const cancels = netMag < 0.25;

  return (
    <>
      {arrows.map((a, i) => {
        const len = 0.28 + a.mag * 0.34;
        const end = a.from.clone().addScaledVector(a.dir, len);
        const q = new THREE.Quaternion().setFromUnitVectors(UP, a.dir);
        return (
          <group key={i}>
            <Line
              points={[a.from.toArray(), end.toArray()]}
              color="#fbbf24"
              lineWidth={2}
              transparent
              opacity={0.9}
            />
            <group position={end} quaternion={q}>
              <mesh position={[0, 0.055, 0]}>
                <coneGeometry args={[0.055, 0.11, 12]} />
                <meshBasicMaterial color="#fbbf24" />
              </mesh>
            </group>
          </group>
        );
      })}

      {!cancels && (
        <group>
          <Line
            points={[
              [0, 0, 0],
              net.clone().normalize().multiplyScalar(1.1 + netMag * 0.3).toArray(),
            ]}
            color="#f43f5e"
            lineWidth={4}
          />
          <group
            position={net.clone().normalize().multiplyScalar(1.1 + netMag * 0.3)}
            quaternion={new THREE.Quaternion().setFromUnitVectors(
              UP,
              net.clone().normalize(),
            )}
          >
            <mesh position={[0, 0.09, 0]}>
              <coneGeometry args={[0.095, 0.19, 14]} />
              <meshBasicMaterial color="#f43f5e" />
            </mesh>
            <Html center distanceFactor={9} position={[0, 0.4, 0]}>
              <div className="whitespace-nowrap rounded bg-rose-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                net dipole
              </div>
            </Html>
          </group>
        </group>
      )}

      {cancels && arrows.length > 0 && (
        <Html center distanceFactor={11} position={[0, 0, 0]}>
          <div className="whitespace-nowrap rounded bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
            bond dipoles cancel: no net dipole
          </div>
        </Html>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Pi systems
// ---------------------------------------------------------------------------

/**
 * The p orbitals that make a pi bond, as paired lobes above and below the
 * sigma axis.
 *
 * This is the picture behind the course's "one bond that turns, one that
 * cannot": the sigma bond is cylindrically symmetric so its overlap survives
 * rotation, while these lobes must stay parallel to overlap at all. Twist the
 * ends and the pi bond is gone.
 *
 * For aromatic rings every ring bond carries lobes, which is as close as a
 * localised picture gets to showing a delocalised ring. The panel says in
 * words that the real system is one ring-wide cloud.
 */
function PiSystems({ molecule }: { molecule: Molecule }) {
  const lobes = useMemo(() => {
    const out: { pos: THREE.Vector3; dir: THREE.Vector3; aromatic: boolean }[] = [];
    molecule.bonds.forEach((b) => {
      if (b.order < 1.5) return;
      const pa = v3(molecule.atoms[b.a].pos);
      const pb = v3(molecule.atoms[b.b].pos);
      const axis = new THREE.Vector3().subVectors(pb, pa).normalize();

      // The p-orbital axis is perpendicular to the sigma bond and, where we
      // can tell, perpendicular to the local plane of the substituents.
      const neighbours: THREE.Vector3[] = [];
      molecule.bonds.forEach((o) => {
        if (o === b) return;
        if (o.a === b.a || o.b === b.a || o.a === b.b || o.b === b.b) {
          const p1 = v3(molecule.atoms[o.a].pos);
          const p2 = v3(molecule.atoms[o.b].pos);
          neighbours.push(new THREE.Vector3().subVectors(p2, p1).normalize());
        }
      });
      let normal = new THREE.Vector3();
      if (neighbours.length) {
        normal.crossVectors(axis, neighbours[0]);
        if (normal.lengthSq() < 1e-6 && neighbours[1]) {
          normal.crossVectors(axis, neighbours[1]);
        }
      }
      if (normal.lengthSq() < 1e-6) {
        normal = new THREE.Vector3(0, 0, 1).cross(axis);
      }
      if (normal.lengthSq() < 1e-6) normal = new THREE.Vector3(0, 1, 0);
      normal.normalize();

      const mid = new THREE.Vector3().addVectors(pa, pb).multiplyScalar(0.5);
      out.push({ pos: mid, dir: normal, aromatic: b.order === 1.5 });
    });
    return out;
  }, [molecule]);

  return (
    <>
      {lobes.map((l, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(UP, l.dir);
        const color = l.aromatic ? '#a78bfa' : '#38bdf8';
        return (
          <group key={i} position={l.pos} quaternion={q}>
            {[1, -1].map((sign) => (
              <mesh key={sign} position={[0, sign * 0.42, 0]} scale={[1, 1.5, 1]}>
                <sphereGeometry args={[0.26, 20, 14]} />
                <meshStandardMaterial
                  color={color}
                  transparent
                  opacity={0.34}
                  emissive={color}
                  emissiveIntensity={0.45}
                  roughness={0.15}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

function AtomLabels({
  molecule,
  overlays,
  style,
}: {
  molecule: Molecule;
  overlays: SceneOverlays;
  style: RenderStyle;
}) {
  return (
    <>
      {molecule.atoms.map((atom, i) => {
        const showEl = overlays.labels;
        const showCip = overlays.stereo && atom.cip;
        if (!showEl && !showCip) return null;
        const r = atomRadius(atom, style);
        return (
          <Html
            key={i}
            center
            distanceFactor={10}
            position={[atom.pos[0], atom.pos[1] + r + 0.2, atom.pos[2]]}
            zIndexRange={[5, 0]}
          >
            <div className="pointer-events-none flex items-center gap-1 whitespace-nowrap">
              {showEl && (
                <span className="rounded-sm bg-black/70 px-1 py-px text-[10px] font-semibold text-white ring-1 ring-white/20">
                  {atom.el}
                  {atom.charge ? (
                    <sup className="ml-px text-amber-300">
                      {atom.charge > 0 ? `${atom.charge > 1 ? atom.charge : ''}+`
                        : `${atom.charge < -1 ? Math.abs(atom.charge) : ''}-`}
                    </sup>
                  ) : null}
                </span>
              )}
              {showCip && (
                <span className="rounded-sm bg-fuchsia-600/90 px-1 py-px text-[10px] font-bold text-white">
                  {atom.cip}
                </span>
              )}
            </div>
          </Html>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// The scene
// ---------------------------------------------------------------------------

export function MoleculeScene({
  molecule,
  style,
  overlays,
  spinning,
  selectedAtom,
  measureSet,
  onPickAtom,
}: {
  molecule: Molecule;
  style: RenderStyle;
  overlays: SceneOverlays;
  spinning: boolean;
  selectedAtom: number | null;
  measureSet: number[];
  onPickAtom: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (spinning && group.current) {
      group.current.rotation.y += dt * 0.32;
    }
  });

  return (
    <group ref={group}>
      {molecule.atoms.map((atom, i) => (
        <AtomMesh
          key={i}
          atom={atom}
          index={i}
          style={style}
          selected={selectedAtom === i}
          measuring={measureSet.includes(i)}
          onPick={onPickAtom}
        />
      ))}

      {molecule.bonds.map((bond, i) => (
        <BondMesh key={i} bond={bond} atoms={molecule.atoms} style={style} />
      ))}

      {overlays.lonePairs &&
        molecule.atoms.map((atom, i) => (
          <LonePairs
            key={i}
            atom={atom}
            index={i}
            atoms={molecule.atoms}
            bonds={molecule.bonds}
            style={style}
          />
        ))}

      {overlays.dipoles && <Dipoles molecule={molecule} />}
      {overlays.piSystems && <PiSystems molecule={molecule} />}
      <AtomLabels molecule={molecule} overlays={overlays} style={style} />

      {/* Measurement guide lines between the atoms the learner picked. */}
      {measureSet.length > 1 && (
        <Line
          points={measureSet.map((i) => molecule.atoms[i].pos)}
          color="#fbbf24"
          lineWidth={2}
          dashed
          dashSize={0.08}
          gapSize={0.06}
        />
      )}
    </group>
  );
}

/** Lighting shared by both labs, so molecules read identically across them. */
export function ChemLights() {
  return (
    <>
      <ambientLight intensity={0.62} />
      <directionalLight position={[6, 9, 7]} intensity={1.15} />
      <directionalLight position={[-7, -4, -6]} intensity={0.4} color="#93c5fd" />
      <pointLight position={[0, 0, 8]} intensity={0.35} />
    </>
  );
}

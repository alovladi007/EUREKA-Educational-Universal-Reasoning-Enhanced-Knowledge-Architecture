'use client';

/**
 * Organic Chemistry 3D — built-in XR portal (XR-4).
 *
 * Interactive ball-and-stick molecule explorer, self-contained like the
 * Solar System Explorer: every geometry is internal coordinate data (no
 * external assets, no network fetches for content). Click an atom for its
 * element + hybridization at that center; pick molecules from the panel.
 *
 * Honesty note (rendered in the UI too): geometries are IDEALIZED textbook
 * shapes (VSEPR angles, standard bond lengths) — right for learning shape,
 * hybridization, and polarity; not crystallographic data.
 *
 * Sessions: tracked through the shared useXrSession hook, so runs count,
 * completion is elapsed-derived, and ratings/XP flow like any experience.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import toast from 'react-hot-toast';
import { useXrSession } from '@/lib/xr/use-xr-session';

// ── Chemistry data (all internal — the whole portal is offline) ────────────

type Element = 'C' | 'H' | 'O' | 'N';

const ELEMENTS: Record<
  Element,
  { name: string; color: number; radius: number; blurb: string }
> = {
  C: {
    name: 'Carbon',
    color: 0x333338,
    radius: 0.4,
    blurb: 'Four valence electrons; the backbone of organic chemistry. Hybridizes sp³/sp²/sp.',
  },
  H: {
    name: 'Hydrogen',
    color: 0xf2f2f2,
    radius: 0.25,
    blurb: 'One electron, one bond. Terminal atom on almost every organic skeleton.',
  },
  O: {
    name: 'Oxygen',
    color: 0xd43a2f,
    radius: 0.38,
    blurb: 'Two bonds + two lone pairs. Strongly electronegative — the usual source of polarity.',
  },
  N: {
    name: 'Nitrogen',
    color: 0x2f52d4,
    radius: 0.38,
    blurb: 'Three bonds + one lone pair. Basic sites and H-bond acceptors in biomolecules.',
  },
};

type AtomDef = { el: Element; pos: [number, number, number]; hyb?: string };
type BondDef = { a: number; b: number; order: 1 | 2 | 3 };
type Molecule = {
  key: string;
  name: string;
  formula: string;
  geometry: string;
  polarity: string;
  atoms: AtomDef[];
  bonds: BondDef[];
  facts: string[];
};

const T = 0.63; // tetrahedral H offset for C-H ~1.09 Å

const MOLECULES: Molecule[] = [
  {
    key: 'methane', name: 'Methane', formula: 'CH₄',
    geometry: 'Tetrahedral · 109.5°', polarity: 'Nonpolar',
    atoms: [
      { el: 'C', pos: [0, 0, 0], hyb: 'sp³' },
      { el: 'H', pos: [T, T, T] }, { el: 'H', pos: [T, -T, -T] },
      { el: 'H', pos: [-T, T, -T] }, { el: 'H', pos: [-T, -T, T] },
    ],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }, { a: 0, b: 4, order: 1 }],
    facts: [
      'The simplest alkane and the textbook sp³ carbon: four equivalent σ bonds at 109.5°.',
      'Perfectly symmetric, so the four C–H dipoles cancel — nonpolar despite polar-ish bonds.',
      'Main component of natural gas; a potent greenhouse gas.',
    ],
  },
  {
    key: 'ammonia', name: 'Ammonia', formula: 'NH₃',
    geometry: 'Trigonal pyramidal · 107°', polarity: 'Polar',
    atoms: [
      { el: 'N', pos: [0, 0.07, 0], hyb: 'sp³ (one lone pair)' },
      { el: 'H', pos: [0.94, -0.33, 0] }, { el: 'H', pos: [-0.47, -0.33, 0.81] }, { el: 'H', pos: [-0.47, -0.33, -0.81] },
    ],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }],
    facts: [
      'sp³ nitrogen with a lone pair squeezing the H–N–H angle from 109.5° down to ~107°.',
      'The lone pair makes it a classic Brønsted base and nucleophile.',
      'VSEPR poster child: electron geometry tetrahedral, molecular shape pyramidal.',
    ],
  },
  {
    key: 'water', name: 'Water', formula: 'H₂O',
    geometry: 'Bent · 104.5°', polarity: 'Strongly polar',
    atoms: [
      { el: 'O', pos: [0, 0.06, 0], hyb: 'sp³ (two lone pairs)' },
      { el: 'H', pos: [0.76, -0.47, 0] }, { el: 'H', pos: [-0.76, -0.47, 0] },
    ],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }],
    facts: [
      'Two lone pairs compress the bond angle to 104.5° — the classic bent geometry.',
      'Large dipole moment + hydrogen bonding explain its absurdly high boiling point for its size.',
      'Universal solvent for ionic and polar species.',
    ],
  },
  {
    key: 'co2', name: 'Carbon dioxide', formula: 'CO₂',
    geometry: 'Linear · 180°', polarity: 'Nonpolar (dipoles cancel)',
    atoms: [
      { el: 'C', pos: [0, 0, 0], hyb: 'sp' },
      { el: 'O', pos: [0, 1.16, 0] }, { el: 'O', pos: [0, -1.16, 0] },
    ],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, order: 2 }],
    facts: [
      'sp carbon with two σ + two π bonds — both C=O double bonds, 180° apart.',
      'Each C=O is polar, but the two dipoles point opposite ways and cancel exactly.',
      'Great contrast case with water when teaching molecular vs bond polarity.',
    ],
  },
  {
    key: 'ethane', name: 'Ethane', formula: 'C₂H₆',
    geometry: 'Tetrahedral at each C', polarity: 'Nonpolar',
    atoms: [
      { el: 'C', pos: [0, 0.77, 0], hyb: 'sp³' }, { el: 'C', pos: [0, -0.77, 0], hyb: 'sp³' },
      { el: 'H', pos: [0.96, 1.16, 0] }, { el: 'H', pos: [-0.48, 1.16, 0.83] }, { el: 'H', pos: [-0.48, 1.16, -0.83] },
      { el: 'H', pos: [-0.96, -1.16, 0] }, { el: 'H', pos: [0.48, -1.16, -0.83] }, { el: 'H', pos: [0.48, -1.16, 0.83] },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }, { a: 0, b: 4, order: 1 },
      { a: 1, b: 5, order: 1 }, { a: 1, b: 6, order: 1 }, { a: 1, b: 7, order: 1 },
    ],
    facts: [
      'Free rotation about the C–C σ bond; drawn here in the staggered conformation.',
      'Staggered beats eclipsed by ~12 kJ/mol of torsional strain — conformational analysis starts here.',
    ],
  },
  {
    key: 'ethene', name: 'Ethene (ethylene)', formula: 'C₂H₄',
    geometry: 'Trigonal planar · 120°', polarity: 'Nonpolar',
    atoms: [
      { el: 'C', pos: [0, 0.67, 0], hyb: 'sp²' }, { el: 'C', pos: [0, -0.67, 0], hyb: 'sp²' },
      { el: 'H', pos: [0.92, 1.23, 0] }, { el: 'H', pos: [-0.92, 1.23, 0] },
      { el: 'H', pos: [0.92, -1.23, 0] }, { el: 'H', pos: [-0.92, -1.23, 0] },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }, { a: 1, b: 4, order: 1 }, { a: 1, b: 5, order: 1 },
    ],
    facts: [
      'The π bond locks the molecule flat — no rotation about C=C, hence cis/trans isomerism.',
      'sp² carbons, all angles ≈120°.',
      'The most-produced organic compound on Earth (polyethylene starts here).',
    ],
  },
  {
    key: 'ethyne', name: 'Ethyne (acetylene)', formula: 'C₂H₂',
    geometry: 'Linear · 180°', polarity: 'Nonpolar',
    atoms: [
      { el: 'C', pos: [0, 0.6, 0], hyb: 'sp' }, { el: 'C', pos: [0, -0.6, 0], hyb: 'sp' },
      { el: 'H', pos: [0, 1.66, 0] }, { el: 'H', pos: [0, -1.66, 0] },
    ],
    bonds: [{ a: 0, b: 1, order: 3 }, { a: 0, b: 2, order: 1 }, { a: 1, b: 3, order: 1 }],
    facts: [
      'A triple bond: one σ + two orthogonal π bonds. Shortest, strongest C–C bond of the series.',
      'sp carbons make the terminal C–H unusually acidic (pKa ≈ 25).',
      'Compare bond lengths across ethane → ethene → ethyne as bond order rises.',
    ],
  },
  {
    key: 'ethanol', name: 'Ethanol', formula: 'C₂H₅OH',
    geometry: 'Tetrahedral centers, bent at O', polarity: 'Polar (–OH)',
    atoms: [
      { el: 'C', pos: [-1.17, -0.25, 0], hyb: 'sp³' }, { el: 'C', pos: [0.13, 0.55, 0], hyb: 'sp³' },
      { el: 'O', pos: [1.25, -0.31, 0], hyb: 'sp³ (two lone pairs)' }, { el: 'H', pos: [2.03, 0.24, 0] },
      { el: 'H', pos: [-2.05, 0.38, 0] }, { el: 'H', pos: [-1.2, -0.89, 0.88] }, { el: 'H', pos: [-1.2, -0.89, -0.88] },
      { el: 'H', pos: [0.17, 1.19, 0.88] }, { el: 'H', pos: [0.17, 1.19, -0.88] },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 }, { a: 1, b: 2, order: 1 }, { a: 2, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 }, { a: 0, b: 5, order: 1 }, { a: 0, b: 6, order: 1 },
      { a: 1, b: 7, order: 1 }, { a: 1, b: 8, order: 1 },
    ],
    facts: [
      'The –OH group hydrogen-bonds: miscible with water and boils far above propane.',
      'Oxidation ladder: ethanol → acetaldehyde → acetic acid.',
      'Functional-group thinking: the hydroxyl dominates its chemistry.',
    ],
  },
  {
    key: 'acetic', name: 'Acetic acid', formula: 'CH₃COOH',
    geometry: 'Trigonal planar at carboxyl C', polarity: 'Polar (carboxylic acid)',
    atoms: [
      { el: 'C', pos: [-1.38, -0.22, 0], hyb: 'sp³ (methyl)' },
      { el: 'C', pos: [0.05, 0.3, 0], hyb: 'sp² (carboxyl)' },
      { el: 'O', pos: [0.32, 1.49, 0] }, { el: 'O', pos: [1.02, -0.62, 0] }, { el: 'H', pos: [1.9, -0.18, 0] },
      { el: 'H', pos: [-2.11, 0.58, 0] }, { el: 'H', pos: [-1.55, -0.85, 0.88] }, { el: 'H', pos: [-1.55, -0.85, -0.88] },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 }, { a: 1, b: 2, order: 2 }, { a: 1, b: 3, order: 1 }, { a: 3, b: 4, order: 1 },
      { a: 0, b: 5, order: 1 }, { a: 0, b: 6, order: 1 }, { a: 0, b: 7, order: 1 },
    ],
    facts: [
      'The carboxyl group: one sp² carbon carrying both C=O and C–OH.',
      'Acidic because the conjugate base (acetate) delocalizes charge over both oxygens.',
      'Vinegar is ~5% acetic acid.',
    ],
  },
  {
    key: 'benzene', name: 'Benzene', formula: 'C₆H₆',
    geometry: 'Planar hexagon · 120°', polarity: 'Nonpolar',
    atoms: [
      ...Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return { el: 'C' as Element, pos: [1.39 * Math.cos(a), 1.39 * Math.sin(a), 0] as [number, number, number], hyb: 'sp² (aromatic)' };
      }),
      ...Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return { el: 'H' as Element, pos: [2.48 * Math.cos(a), 2.48 * Math.sin(a), 0] as [number, number, number] };
      }),
    ],
    bonds: [
      ...Array.from({ length: 6 }, (_, i) => ({ a: i, b: (i + 1) % 6, order: (i % 2 === 0 ? 2 : 1) as 1 | 2 })),
      ...Array.from({ length: 6 }, (_, i) => ({ a: i, b: i + 6, order: 1 as const })),
    ],
    facts: [
      'Drawn with alternating double bonds, but the 6 π electrons are fully delocalized — all six C–C bonds are identical (1.39 Å).',
      'Aromatic stability (~150 kJ/mol) is why benzene substitutes rather than adds.',
      'Every carbon is sp², the whole ring is rigidly planar.',
    ],
  },
  {
    key: 'caffeine', name: 'Caffeine', formula: 'C₈H₁₀N₄O₂',
    geometry: 'Planar fused bicyclic core', polarity: 'Polar (two C=O, four N)',
    atoms: [
      { el: 'N', pos: [-2.24, 0.31, 0], hyb: 'sp² (amide N)' },   // 0  N1
      { el: 'C', pos: [-1.53, 1.44, 0], hyb: 'sp² (carbonyl)' },  // 1  C2
      { el: 'N', pos: [-0.16, 1.49, 0], hyb: 'sp² (amide N)' },   // 2  N3
      { el: 'C', pos: [0.51, 0.33, 0], hyb: 'sp²' },              // 3  C4
      { el: 'C', pos: [-0.19, -0.85, 0], hyb: 'sp²' },            // 4  C5
      { el: 'C', pos: [-1.63, -0.91, 0], hyb: 'sp² (carbonyl)' }, // 5  C6
      { el: 'O', pos: [-2.29, -1.95, 0] },                        // 6  O6
      { el: 'O', pos: [-2.13, 2.51, 0] },                         // 7  O2
      { el: 'N', pos: [0.76, -1.79, 0], hyb: 'sp²' },             // 8  N7
      { el: 'C', pos: [1.95, -1.19, 0], hyb: 'sp²' },             // 9  C8
      { el: 'N', pos: [1.86, 0.14, 0], hyb: 'sp² (pyridine-like)' }, // 10 N9
      { el: 'C', pos: [-3.69, 0.35, 0], hyb: 'sp³ (N-methyl)' },  // 11
      { el: 'C', pos: [0.58, 2.77, 0], hyb: 'sp³ (N-methyl)' },   // 12
      { el: 'C', pos: [0.63, -3.24, 0], hyb: 'sp³ (N-methyl)' },  // 13
      { el: 'H', pos: [2.86, -1.76, 0] },                         // 14
      { el: 'H', pos: [-4.1, 1.36, 0] }, { el: 'H', pos: [-4.1, -0.16, 0.88] }, { el: 'H', pos: [-4.1, -0.16, -0.88] },
      { el: 'H', pos: [1.66, 2.7, 0] }, { el: 'H', pos: [0.27, 3.32, 0.88] }, { el: 'H', pos: [0.27, 3.32, -0.88] },
      { el: 'H', pos: [1.63, -3.66, 0] }, { el: 'H', pos: [0.12, -3.6, 0.88] }, { el: 'H', pos: [0.12, -3.6, -0.88] },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 }, { a: 1, b: 2, order: 1 }, { a: 2, b: 3, order: 1 },
      { a: 3, b: 4, order: 2 }, { a: 4, b: 5, order: 1 }, { a: 5, b: 0, order: 1 },
      { a: 1, b: 7, order: 2 }, { a: 5, b: 6, order: 2 },
      { a: 4, b: 8, order: 1 }, { a: 8, b: 9, order: 1 }, { a: 9, b: 10, order: 2 }, { a: 10, b: 3, order: 1 },
      { a: 0, b: 11, order: 1 }, { a: 2, b: 12, order: 1 }, { a: 8, b: 13, order: 1 },
      { a: 9, b: 14, order: 1 },
      { a: 11, b: 15, order: 1 }, { a: 11, b: 16, order: 1 }, { a: 11, b: 17, order: 1 },
      { a: 12, b: 18, order: 1 }, { a: 12, b: 19, order: 1 }, { a: 12, b: 20, order: 1 },
      { a: 13, b: 21, order: 1 }, { a: 13, b: 22, order: 1 }, { a: 13, b: 23, order: 1 },
    ],
    facts: [
      'A xanthine alkaloid: fused 6- and 5-membered rings, both aromatic-ish and planar.',
      'Blocks adenosine receptors — the reason it keeps you awake.',
      'Find the three N-methyl groups: the only sp³ carbons in the molecule.',
      'Two amide carbonyls (C=O) make the core strongly polar despite no O–H.',
    ],
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

const SCALE = 1.6;

export default function MoleculesPortal() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const frameRef = useRef(0);

  const [molKey, setMolKey] = useState('methane');
  const [selectedAtom, setSelectedAtom] = useState<AtomDef | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);
  const [showStars, setShowStars] = useState(false);

  const { recorded, endWithRating } = useXrSession('/dashboard/xr-labs/molecules');

  const molecule = MOLECULES.find((m) => m.key === molKey) ?? MOLECULES[0];

  // Scene bootstrap (once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0e1a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 9);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 30;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(5, 8, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8899ff, 0.35);
    rim.position.set(-6, -4, -5);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    const onResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (autoRotateRef.current && groupRef.current) groupRef.current.rotation.y += 0.004;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // (Re)build the molecule mesh when the selection changes
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.clear();
    group.rotation.set(0, 0, 0);
    setSelectedAtom(null);

    // Atoms
    molecule.atoms.forEach((atom, idx) => {
      const info = ELEMENTS[atom.el];
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(info.radius * SCALE * 0.55, 32, 32),
        new THREE.MeshStandardMaterial({ color: info.color, roughness: 0.35, metalness: 0.05 }),
      );
      mesh.position.set(atom.pos[0] * SCALE, atom.pos[1] * SCALE, atom.pos[2] * SCALE);
      mesh.userData.atomIndex = idx;
      group.add(mesh);
    });

    // Bonds — order N renders as N parallel cylinders
    const up = new THREE.Vector3(0, 1, 0);
    molecule.bonds.forEach((bond) => {
      const a = new THREE.Vector3(...molecule.atoms[bond.a].pos).multiplyScalar(SCALE);
      const b = new THREE.Vector3(...molecule.atoms[bond.b].pos).multiplyScalar(SCALE);
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      // Offset axis perpendicular to the bond for multi-order rendering
      const perp = new THREE.Vector3().crossVectors(dir, up);
      if (perp.lengthSq() < 1e-6) perp.set(1, 0, 0);
      perp.normalize();
      const offsets =
        bond.order === 1 ? [0] : bond.order === 2 ? [-0.09, 0.09] : [-0.13, 0, 0.13];
      offsets.forEach((off) => {
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(bond.order === 1 ? 0.07 : 0.05, bond.order === 1 ? 0.07 : 0.05, len, 16),
          new THREE.MeshStandardMaterial({ color: 0x9aa1b5, roughness: 0.5 }),
        );
        cyl.position.copy(mid).addScaledVector(perp, off * SCALE);
        cyl.quaternion.setFromUnitVectors(up, dir.clone().normalize());
        group.add(cyl);
      });
    });
  }, [molecule]);

  // Atom picking
  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const group = groupRef.current;
    if (!canvas || !camera || !group) return;
    const rect = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    );
    raycasterRef.current.setFromCamera(ndc, camera);
    const hits = raycasterRef.current
      .intersectObjects(group.children, false)
      .filter((h) => h.object.userData.atomIndex !== undefined);
    if (hits.length > 0) {
      const idx = hits[0].object.userData.atomIndex as number;
      setSelectedAtom(molecule.atoms[idx]);
    } else {
      setSelectedAtom(null);
    }
  };

  const finishAndRate = async (rating: number | null) => {
    setShowStars(false);
    const xp = await endWithRating(rating);
    if (xp !== null) {
      toast.success(xp ? `Session recorded — +${xp} XP` : 'Session recorded');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e1a] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/xr-labs')}
            className="px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm"
          >
            ← XR Labs
          </button>
          <h1 className="text-lg font-bold">🧪 Organic Chemistry 3D</h1>
          <span className="text-[11px] text-amber-300/80 border border-amber-300/30 rounded px-2 py-0.5">
            idealized geometries — for learning shape &amp; hybridization
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              autoRotateRef.current = !autoRotateRef.current;
              setAutoRotate(autoRotateRef.current);
            }}
            className="px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm"
          >
            {autoRotate ? '⏸ Pause spin' : '▶ Spin'}
          </button>
          <button
            onClick={() => setShowStars(true)}
            disabled={recorded}
            className="px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm disabled:opacity-50"
          >
            {recorded ? '✓ Recorded' : '■ Finish & rate'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Molecule list */}
        <div className="lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 p-3 overflow-y-auto">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Molecules</div>
          <div className="flex lg:flex-col gap-1 flex-wrap">
            {MOLECULES.map((m) => (
              <button
                key={m.key}
                onClick={() => setMolKey(m.key)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  m.key === molKey ? 'bg-indigo-600' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold">{m.name}</div>
                <div className="text-[11px] text-gray-300">{m.formula}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative min-h-[320px]">
          <canvas ref={canvasRef} className="w-full h-full block" onClick={onCanvasClick} />
          <div className="absolute bottom-3 left-3 text-[11px] text-gray-400 bg-black/50 rounded px-2 py-1">
            drag to rotate · scroll to zoom · click an atom
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 p-4 overflow-y-auto space-y-4">
          <div>
            <h2 className="text-xl font-bold">{molecule.name}</h2>
            <div className="text-sm text-gray-300">{molecule.formula}</div>
            <div className="mt-2 space-y-1 text-sm">
              <div><span className="text-gray-400">Geometry:</span> {molecule.geometry}</div>
              <div><span className="text-gray-400">Polarity:</span> {molecule.polarity}</div>
            </div>
          </div>

          {selectedAtom ? (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full border border-white/30"
                  style={{ backgroundColor: `#${ELEMENTS[selectedAtom.el].color.toString(16).padStart(6, '0')}` }}
                />
                <span className="font-bold">{ELEMENTS[selectedAtom.el].name}</span>
                {selectedAtom.hyb && (
                  <span className="text-xs bg-indigo-500/30 border border-indigo-400/40 rounded px-1.5 py-0.5">
                    {selectedAtom.hyb}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-2">{ELEMENTS[selectedAtom.el].blurb}</p>
            </div>
          ) : (
            <div className="text-xs text-gray-500">Click an atom to inspect its element and hybridization.</div>
          )}

          <div>
            <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Why it matters</div>
            <ul className="space-y-2">
              {molecule.facts.map((f, i) => (
                <li key={i} className="text-sm text-gray-200 flex gap-2">
                  <span className="text-indigo-400 shrink-0">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-gray-500 border-t border-white/10 pt-3">
            Bond orders render as parallel rods (double = 2, triple = 3). Colors follow the CPK
            convention: C dark, H white, O red, N blue.
          </div>
        </div>
      </div>

      {/* Rating dialog (same contract as the experience viewer) */}
      {showStars && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">How was this portal?</h2>
            <div className="flex justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => finishAndRate(n)}
                  aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
                  className="text-3xl hover:scale-125 transition-transform"
                >
                  ⭐
                </button>
              ))}
            </div>
            <button
              onClick={() => finishAndRate(null)}
              className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm"
            >
              Finish without rating
            </button>
            <button
              onClick={() => setShowStars(false)}
              className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white"
            >
              Keep exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

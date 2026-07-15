'use client';

/**
 * Anatomy 3D — built-in XR portal (XR-4).
 *
 * Layered, clickable human-body walkthrough: skeletal → organs →
 * circulatory, each toggleable, every structure clickable for facts.
 * Fully self-contained (procedural primitives; no external assets), like
 * the Solar System and Molecules portals.
 *
 * HONESTY (stated in the UI, not just here): this is a SCHEMATIC — blocked
 * volumes standing in for structures at roughly correct positions and
 * relative sizes. It teaches layer order, spatial relationships, and
 * vocabulary. It is NOT anatomically exact and is not a clinical reference.
 *
 * Sessions run through the shared useXrSession hook (same contract as every
 * other experience: real rows, elapsed completion, ratings, XP).
 */

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import toast from 'react-hot-toast';
import { useXrSession } from '@/lib/xr/use-xr-session';

type LayerKey = 'skeletal' | 'organs' | 'circulatory';

type Part = {
  id: string;
  name: string;
  layer: LayerKey;
  system: string;
  shape: 'box' | 'sphere' | 'capsule' | 'cylinder';
  size: [number, number, number]; // box: w/h/d · sphere: r · capsule: r/len · cylinder: r/h
  pos: [number, number, number];
  rot?: [number, number, number];
  color: number;
  facts: string[];
};

const LAYERS: { key: LayerKey; label: string; hint: string; color: string }[] = [
  { key: 'skeletal', label: 'Skeletal', hint: 'framework + protection', color: 'text-slate-200' },
  { key: 'organs', label: 'Organs', hint: 'thoracic + abdominal viscera', color: 'text-rose-300' },
  { key: 'circulatory', label: 'Circulatory', hint: 'heart + great vessels', color: 'text-red-400' },
];

const BONE = 0xe8e2d5;

const PARTS: Part[] = [
  // ── Skeletal ────────────────────────────────────────────────────────────
  {
    id: 'skull', name: 'Skull (cranium)', layer: 'skeletal', system: 'Axial skeleton',
    shape: 'sphere', size: [0.62, 0, 0], pos: [0, 3.5, 0], color: BONE,
    facts: [
      '22 bones: 8 cranial (brain case) + 14 facial.',
      'Adult sutures are immovable fibrous joints; in infants they are open fontanelles.',
      'The foramen magnum at its base is where the brainstem becomes the spinal cord.',
    ],
  },
  {
    id: 'mandible', name: 'Mandible', layer: 'skeletal', system: 'Axial skeleton',
    shape: 'box', size: [0.62, 0.24, 0.5], pos: [0, 3.02, 0.08], color: 0xded7c8,
    facts: [
      'The only freely movable skull bone — the temporomandibular joint.',
      'Strongest facial bone; anchors the lower teeth.',
    ],
  },
  {
    id: 'spine', name: 'Vertebral column', layer: 'skeletal', system: 'Axial skeleton',
    shape: 'capsule', size: [0.15, 2.5, 0], pos: [0, 1.7, -0.22], color: 0xd9d2c2,
    facts: [
      '33 vertebrae: 7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral, 4 coccygeal.',
      'Its S-curve absorbs shock; discs between bodies act as cushions.',
      'Encloses and protects the spinal cord.',
    ],
  },
  {
    id: 'ribs', name: 'Rib cage', layer: 'skeletal', system: 'Axial skeleton',
    shape: 'box', size: [1.55, 1.5, 0.95], pos: [0, 2.05, 0], color: 0xf0ead9,
    facts: [
      '12 pairs: 7 true (direct to sternum), 3 false, 2 floating.',
      'Protects heart and lungs; its movement drives breathing mechanics.',
      'Shown as a shell — real ribs are individual arches with intercostal gaps.',
    ],
  },
  {
    id: 'sternum', name: 'Sternum', layer: 'skeletal', system: 'Axial skeleton',
    shape: 'box', size: [0.28, 0.95, 0.1], pos: [0, 2.15, 0.5], color: BONE,
    facts: [
      'Manubrium + body + xiphoid process.',
      'CPR compressions target its lower half.',
      'A common site for bone-marrow aspiration.',
    ],
  },
  {
    id: 'pelvis', name: 'Pelvis', layer: 'skeletal', system: 'Appendicular girdle',
    shape: 'box', size: [1.1, 0.5, 0.6], pos: [0, 0.65, 0], color: 0xe3dccb,
    facts: [
      'Two hip bones + sacrum + coccyx.',
      'Transfers upper-body load to the legs; wider and shallower in the female pelvis.',
    ],
  },
  {
    id: 'femur-l', name: 'Femur (left)', layer: 'skeletal', system: 'Lower limb',
    shape: 'capsule', size: [0.13, 1.4, 0], pos: [-0.32, -0.35, 0], color: BONE,
    facts: [
      'Longest, strongest bone in the body.',
      'Its head sits in the acetabulum — a ball-and-socket joint.',
    ],
  },
  {
    id: 'femur-r', name: 'Femur (right)', layer: 'skeletal', system: 'Lower limb',
    shape: 'capsule', size: [0.13, 1.4, 0], pos: [0.32, -0.35, 0], color: BONE,
    facts: [
      'Longest, strongest bone in the body.',
      'Bears roughly 4× body weight when running.',
    ],
  },
  {
    id: 'humerus-l', name: 'Humerus (left)', layer: 'skeletal', system: 'Upper limb',
    shape: 'capsule', size: [0.1, 1.1, 0], pos: [-1.0, 2.05, 0], rot: [0, 0, 0.12], color: BONE,
    facts: ['Upper-arm bone; the shoulder is the body’s most mobile (and most dislocated) joint.'],
  },
  {
    id: 'humerus-r', name: 'Humerus (right)', layer: 'skeletal', system: 'Upper limb',
    shape: 'capsule', size: [0.1, 1.1, 0], pos: [1.0, 2.05, 0], rot: [0, 0, -0.12], color: BONE,
    facts: ['Upper-arm bone; the radial nerve spirals along its shaft.'],
  },

  // ── Organs ──────────────────────────────────────────────────────────────
  {
    id: 'brain', name: 'Brain', layer: 'organs', system: 'Nervous',
    shape: 'sphere', size: [0.5, 0, 0], pos: [0, 3.52, 0], color: 0xd8a0b8,
    facts: [
      '~2% of body mass, ~20% of resting oxygen and glucose use.',
      'Cerebrum, cerebellum, brainstem; floats in cerebrospinal fluid.',
    ],
  },
  {
    id: 'lung-l', name: 'Left lung', layer: 'organs', system: 'Respiratory',
    shape: 'sphere', size: [0.42, 0, 0], pos: [-0.42, 2.2, 0], color: 0xef9a9a,
    facts: [
      'Two lobes (not three) — it yields space to the heart via the cardiac notch.',
      'Gas exchange happens in ~300 million alveoli.',
    ],
  },
  {
    id: 'lung-r', name: 'Right lung', layer: 'organs', system: 'Respiratory',
    shape: 'sphere', size: [0.45, 0, 0], pos: [0.44, 2.2, 0], color: 0xef9a9a,
    facts: [
      'Three lobes — slightly larger than the left.',
      'Its main bronchus is steeper, so aspirated objects usually land here.',
    ],
  },
  {
    id: 'diaphragm', name: 'Diaphragm', layer: 'organs', system: 'Respiratory',
    shape: 'cylinder', size: [0.72, 0.08, 0], pos: [0, 1.62, 0], color: 0xc98b8b,
    facts: [
      'The primary muscle of breathing — contracts (flattens) to draw air in.',
      'Splits thorax from abdomen; the esophagus and aorta pass through it.',
    ],
  },
  {
    id: 'liver', name: 'Liver', layer: 'organs', system: 'Digestive',
    shape: 'box', size: [0.85, 0.4, 0.5], pos: [0.25, 1.35, 0.05], color: 0x8d5a4a,
    facts: [
      'Largest internal organ; 500+ known functions.',
      'Detoxification, bile production, glycogen storage, plasma proteins.',
      'The only human organ that regenerates substantially.',
    ],
  },
  {
    id: 'stomach', name: 'Stomach', layer: 'organs', system: 'Digestive',
    shape: 'sphere', size: [0.32, 0, 0], pos: [-0.35, 1.28, 0.05], color: 0xc98a5e,
    facts: [
      'Holds ~1–1.5 L; pH ~1.5–3.5 from hydrochloric acid.',
      'Its mucus layer is what stops it digesting itself.',
    ],
  },
  {
    id: 'kidney-l', name: 'Left kidney', layer: 'organs', system: 'Urinary',
    shape: 'sphere', size: [0.2, 0, 0], pos: [-0.42, 1.0, -0.28], color: 0x9c5f5f,
    facts: [
      'Filters ~180 L of blood plasma per day, returning almost all of it.',
      'Sits slightly higher than the right (no liver above it).',
    ],
  },
  {
    id: 'kidney-r', name: 'Right kidney', layer: 'organs', system: 'Urinary',
    shape: 'sphere', size: [0.2, 0, 0], pos: [0.42, 0.92, -0.28], color: 0x9c5f5f,
    facts: [
      'Pushed down by the liver — the lower of the pair.',
      'Also an endocrine organ: renin, erythropoietin, vitamin D activation.',
    ],
  },
  {
    id: 'intestines', name: 'Intestines', layer: 'organs', system: 'Digestive',
    shape: 'sphere', size: [0.55, 0, 0], pos: [0, 0.85, 0.05], color: 0xd0a066,
    facts: [
      'Small intestine ~6 m — where most absorption happens.',
      'Large intestine ~1.5 m — water reclamation and the microbiome.',
    ],
  },

  // ── Circulatory ─────────────────────────────────────────────────────────
  {
    id: 'heart', name: 'Heart', layer: 'circulatory', system: 'Circulatory',
    shape: 'sphere', size: [0.3, 0, 0], pos: [-0.1, 2.1, 0.12], color: 0xc62828,
    facts: [
      'Four chambers; sits slightly left of midline (hence the left lung’s notch).',
      '~100,000 beats/day, ~7,500 L pumped.',
      'Right side → lungs (pulmonary), left side → body (systemic).',
    ],
  },
  {
    id: 'aorta', name: 'Aorta', layer: 'circulatory', system: 'Circulatory',
    shape: 'capsule', size: [0.07, 1.6, 0], pos: [0.02, 1.5, -0.06], color: 0xd32f2f,
    facts: [
      'The body’s largest artery — carries oxygenated blood from the left ventricle.',
      'Arches over the heart, then descends through thorax and abdomen.',
    ],
  },
  {
    id: 'vena-cava', name: 'Vena cava', layer: 'circulatory', system: 'Circulatory',
    shape: 'capsule', size: [0.07, 1.5, 0], pos: [-0.2, 1.55, -0.12], color: 0x3f51b5,
    facts: [
      'Superior + inferior: return deoxygenated blood to the right atrium.',
      'Rendered blue by convention — deoxygenated blood is dark red, never blue.',
    ],
  },
  {
    id: 'carotid', name: 'Carotid arteries', layer: 'circulatory', system: 'Circulatory',
    shape: 'capsule', size: [0.04, 0.55, 0], pos: [0.13, 2.95, 0], color: 0xd32f2f,
    facts: [
      'Supply the brain; the pulse point in the neck.',
      'Carotid bodies here sense blood oxygen and pH.',
    ],
  },
];

export default function AnatomyPortal() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const frameRef = useRef(0);
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const [active, setActive] = useState<Record<LayerKey, boolean>>({
    skeletal: true, organs: true, circulatory: true,
  });
  const activeRef = useRef(active);
  const [selected, setSelected] = useState<Part | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);
  const [showStars, setShowStars] = useState(false);

  const { recorded, endWithRating } = useXrSession('/dashboard/xr-labs/anatomy');

  // Scene bootstrap (once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c14);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.set(0, 2.0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.8, 0);
    controls.minDistance = 3;
    controls.maxDistance = 20;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(4, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x88aaff, 0.4);
    fill.position.set(-5, 2, -4);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Build every part once; visibility is toggled per layer.
    PARTS.forEach((part) => {
      let geo: THREE.BufferGeometry;
      switch (part.shape) {
        case 'sphere':
          geo = new THREE.SphereGeometry(part.size[0], 32, 32);
          break;
        case 'capsule':
          geo = new THREE.CapsuleGeometry(part.size[0], part.size[1], 8, 16);
          break;
        case 'cylinder':
          geo = new THREE.CylinderGeometry(part.size[0], part.size[0], part.size[1], 24);
          break;
        default:
          geo = new THREE.BoxGeometry(part.size[0], part.size[1], part.size[2]);
      }
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color: part.color,
          roughness: 0.55,
          metalness: 0.05,
          transparent: true,
          opacity: part.layer === 'skeletal' ? 0.55 : 0.95,
        }),
      );
      mesh.position.set(...part.pos);
      if (part.rot) mesh.rotation.set(...part.rot);
      mesh.userData.partId = part.id;
      group.add(mesh);
      meshesRef.current.set(part.id, mesh);
    });

    const onResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (autoRotateRef.current && groupRef.current) groupRef.current.rotation.y += 0.003;
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

  // Layer visibility
  useEffect(() => {
    activeRef.current = active;
    PARTS.forEach((part) => {
      const mesh = meshesRef.current.get(part.id);
      if (mesh) mesh.visible = active[part.layer];
    });
    setSelected((cur) => (cur && !active[cur.layer] ? null : cur));
  }, [active]);

  // Selection highlight
  useEffect(() => {
    meshesRef.current.forEach((mesh, id) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissive = new THREE.Color(selected?.id === id ? 0x4466ff : 0x000000);
      mat.emissiveIntensity = selected?.id === id ? 0.55 : 0;
    });
  }, [selected]);

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
      .filter((h) => h.object.visible && h.object.userData.partId);
    if (hits.length > 0) {
      const id = hits[0].object.userData.partId as string;
      setSelected(PARTS.find((p) => p.id === id) ?? null);
    } else {
      setSelected(null);
    }
  };

  const finishAndRate = async (rating: number | null) => {
    setShowStars(false);
    const xp = await endWithRating(rating);
    if (xp !== null) toast.success(xp ? `Session recorded — +${xp} XP` : 'Session recorded');
  };

  const visibleParts = PARTS.filter((p) => active[p.layer]);

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white flex flex-col">
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => router.push('/dashboard/xr-labs')}
            className="px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm"
          >
            ← XR Labs
          </button>
          <h1 className="text-lg font-bold">🫀 Anatomy 3D</h1>
          <span className="text-[11px] text-amber-300/90 border border-amber-300/30 rounded px-2 py-0.5">
            schematic — relative positions &amp; layer order, not anatomically exact
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
        {/* Layers + structure list */}
        <div className="lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 p-3 overflow-y-auto">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Layers</div>
          <div className="space-y-1 mb-4">
            {LAYERS.map((l) => (
              <button
                key={l.key}
                onClick={() => setActive((a) => ({ ...a, [l.key]: !a[l.key] }))}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  active[l.key] ? 'bg-white/10' : 'bg-white/[0.03] text-gray-500'
                }`}
              >
                <span>
                  <span className={`font-semibold ${active[l.key] ? l.color : ''}`}>{l.label}</span>
                  <span className="block text-[11px] text-gray-500">{l.hint}</span>
                </span>
                <span>{active[l.key] ? '👁' : '🚫'}</span>
              </button>
            ))}
          </div>
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Structures ({visibleParts.length})
          </div>
          <div className="space-y-0.5">
            {visibleParts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left px-2 py-1.5 rounded text-[13px] transition-colors ${
                  selected?.id === p.id ? 'bg-indigo-600' : 'hover:bg-white/10'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative min-h-[320px]">
          <canvas ref={canvasRef} className="w-full h-full block" onClick={onCanvasClick} />
          <div className="absolute bottom-3 left-3 text-[11px] text-gray-400 bg-black/50 rounded px-2 py-1">
            drag to rotate · scroll to zoom · click a structure · toggle layers to peel inward
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 p-4 overflow-y-auto space-y-4">
          {selected ? (
            <>
              <div>
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: `#${selected.color.toString(16).padStart(6, '0')}` }}
                  />
                  <span className="text-sm text-gray-300">{selected.system}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {selected.facts.map((f, i) => (
                  <li key={i} className="text-sm text-gray-200 flex gap-2">
                    <span className="text-rose-400 shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-sm text-gray-400">
              <p className="mb-3">
                Click any structure in the viewport (or the list) to read about it.
              </p>
              <p className="text-xs text-gray-500">
                Turn layers off to peel inward: hide the skeletal layer to see the viscera, hide
                the organs to isolate the heart and great vessels.
              </p>
            </div>
          )}
          <div className="text-[11px] text-gray-500 border-t border-white/10 pt-3">
            Each structure is a simplified volume at roughly the right position and relative size.
            Use this for orientation and vocabulary — not for clinical or exam-detail work.
          </div>
        </div>
      </div>

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

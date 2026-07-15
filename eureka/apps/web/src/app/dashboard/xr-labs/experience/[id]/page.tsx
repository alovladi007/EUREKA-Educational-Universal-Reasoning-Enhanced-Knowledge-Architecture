'use client';

/**
 * XR Experience Viewer (Phase 19 — WebXR launch)
 *
 * Migrated from (dashboard)/xr-labs/experience/[id]/page.tsx — that
 * route's parent /(dashboard)/xr-labs/ is being collapsed into a
 * redirect to /dashboard/xr-labs/ (the sidebar-canonical location).
 * This route was the only one missing from /dashboard/xr-labs/, so it
 * moves over verbatim. Internal "Back to XR Labs" buttons updated to
 * push to /dashboard/xr-labs.
 *
 * Individual experience page with WebXR launch capability — displays
 * experience details, reviews, and launch options.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import toast from 'react-hot-toast';
import { api } from '@/lib/eureka-api';
import {
  hasRenderableContent,
  populateScene,
  type SceneData,
} from '@/lib/xr/scene-serializer';

interface XRExperience {
  id: string;
  title: string;
  description: string;
  experience_type: string;
  lab_subject?: string;
  difficulty_level: string;
  duration_minutes: number;
  supported_devices: string[];
  scene_file_url: string;
  thumbnail_url?: string;
  preview_video_url?: string;
  motion_intensity?: string;
  min_age?: number;
  max_concurrent_users: number;
  tags: string[];
  learning_objectives: string[];
  prerequisites: string[];
  total_sessions: number;
  avg_rating?: number;
  created_at: string;
  // XR-1: scene-builder experiences carry their JSON scene graph instead of
  // a glTF URL; the viewer renders whichever the experience has.
  scene_data?: SceneData | null;
  source_project_id?: string | null;
}

// XR data is served by api-core (/api/v1/xr/*) via the shared `api()` client,
// which targets NEXT_PUBLIC_API_URL and attaches the access_token.

export default function ExperienceViewerPage() {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;

  const [experience, setExperience] = useState<XRExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInVR, setIsInVR] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [sessionRecorded, setSessionRecorded] = useState(false);

  // XR-2: one honest session per viewer visit. Started when the experience
  // loads (desktop viewing counts — not just VR launches), ended with the
  // REAL elapsed-derived completion on leave, or explicitly via the rating
  // dialog. The old code only tracked VR sessions and hardcoded 100%/5★.
  const sessionIdRef = useRef<string | null>(null);
  const sessionStartRef = useRef<number>(0);
  const sessionEndedRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const assetUrlCacheRef = useRef<Map<string, string> | null>(null);

  // Resolve an xr_3d_assets id to its glTF URL (older saves lack the stamped
  // fileUrl). One library fetch, then cached for the page's lifetime.
  const resolveAssetUrl = async (assetId: string): Promise<string | null> => {
    if (!assetUrlCacheRef.current) {
      try {
        const data = await api<{ assets: { id: string; file_url: string }[] }>(
          '/xr/asset-library/search?limit=500',
        );
        assetUrlCacheRef.current = new Map(
          (data.assets ?? []).map((a) => [a.id, a.file_url]),
        );
      } catch {
        assetUrlCacheRef.current = new Map();
      }
    }
    return assetUrlCacheRef.current.get(assetId) ?? null;
  };

  // Ground + grid so scenes (and load failures) never render as a black void.
  const addEnvironment = (scene: THREE.Scene) => {
    scene.add(new THREE.GridHelper(30, 30, 0x555577, 0x333355));
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x1c1c2e, roughness: 0.9 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
  };

  // XR-1: one content loader for both the desktop preview and the WebXR
  // session — glTF experiences load their file (with a visible failure path
  // instead of the old silent void); scene-builder experiences render their
  // JSON scene graph through the shared serializer.
  const loadContentIntoScene = (scene: THREE.Scene, exp: XRExperience) => {
    if (exp.scene_file_url) {
      const loader = new GLTFLoader();
      loader.load(
        exp.scene_file_url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (gltf: any) => scene.add(gltf.scene),
        undefined,
        () => {
          toast.error('Failed to load the 3D scene file — showing an empty environment.');
          addEnvironment(scene);
        },
      );
      return;
    }
    if (hasRenderableContent(exp.scene_data)) {
      addEnvironment(scene);
      const total = exp.scene_data.objects.length;
      populateScene(scene, exp.scene_data, resolveAssetUrl).then((restored) => {
        if (restored.length < total) {
          toast(`${total - restored.length} scene object(s) could not be loaded.`, {
            icon: '⚠️',
          });
        }
      });
      return;
    }
    addEnvironment(scene);
  };

  const computeCompletion = () => {
    if (!experience || !sessionStartRef.current) return 0;
    const elapsedMin = (Date.now() - sessionStartRef.current) / 60000;
    return Math.max(
      1,
      Math.min(100, Math.round((elapsedMin / Math.max(1, experience.duration_minutes)) * 100)),
    );
  };

  const endSessionSilently = async () => {
    if (!sessionIdRef.current || sessionEndedRef.current) return;
    sessionEndedRef.current = true;
    try {
      await api(`/xr/sessions/${sessionIdRef.current}/end`, {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({
          completion_percentage: computeCompletion(),
          user_rating: null,
        }),
      });
    } catch {
      // Best effort on page leave.
    }
  };

  const endSessionWithRating = async (rating: number | null) => {
    if (!sessionIdRef.current || sessionEndedRef.current) {
      setShowRating(false);
      return;
    }
    sessionEndedRef.current = true;
    setShowRating(false);
    try {
      const res = await api<{ xp_awarded?: number }>(
        `/xr/sessions/${sessionIdRef.current}/end`,
        {
          method: 'POST',
          body: JSON.stringify({
            completion_percentage: computeCompletion(),
            user_rating: rating,
          }),
        },
      );
      setSessionRecorded(true);
      toast.success(
        res.xp_awarded ? `Session recorded — +${res.xp_awarded} XP` : 'Session recorded',
      );
    } catch {
      toast.error('Could not record the session');
    }
  };

  // Start the session when the experience loads; end it on leave.
  useEffect(() => {
    if (!experience) return;
    if (experience.scene_file_url?.startsWith('/dashboard/')) return; // portal tracks itself
    let cancelled = false;
    (async () => {
      try {
        const data = await api<{ session: { id: string } }>('/xr/sessions/start', {
          method: 'POST',
          body: JSON.stringify({
            experience_id: experience.id,
            device_type: 'web_browser',
          }),
        });
        if (!cancelled) {
          sessionIdRef.current = data.session.id;
          sessionStartRef.current = Date.now();
        }
      } catch {
        // Signed out or API down — viewing still works, just untracked.
      }
    })();
    const onBeforeUnload = () => {
      void endSessionSilently();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      cancelled = true;
      window.removeEventListener('beforeunload', onBeforeUnload);
      void endSessionSilently();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience?.id]);

  // XR-4: built-in portals store their internal route in scene_url — they are
  // whole pages, not glTF payloads, so hand off instead of trying to render.
  useEffect(() => {
    if (experience?.scene_file_url?.startsWith('/dashboard/')) {
      router.replace(experience.scene_file_url);
    }
  }, [experience, router]);

  // Fetch experience details
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await api<{ experience: XRExperience }>(
          `/xr/experiences/${experienceId}`,
        );
        setExperience(data.experience);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (experienceId) {
      fetchExperience();
    }
  }, [experienceId]);

  // Initialize 3D preview
  useEffect(() => {
    if (experience && canvasRef.current && !isInVR) {
      initPreview();
    }
  }, [experience, isInVR]);

  const initPreview = () => {
    if (!canvasRef.current || !experience) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 3);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load scene content (glTF or scene-builder scene graph)
    loadContentIntoScene(scene, experience);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  const launchWebXR = async () => {
    if (!navigator.xr) {
      toast.error('WebXR is not supported in your browser. Try Chrome or Edge on desktop/mobile, or use a VR headset browser.');
      return;
    }

    try {
      const isVRSupported = await navigator.xr.isSessionSupported('immersive-vr');

      if (!isVRSupported) {
        toast.error('VR mode is not available. Make sure you have a VR headset connected.');
        return;
      }

      // Request VR session (tracked by the page-level session — no second
      // session row, no fabricated completion)
      const session = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'eye-tracking'],
      });

      setIsInVR(true);

      // Setup WebXR
      if (canvasRef.current && experience) {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl', { xrCompatible: true });

        if (!gl) throw new Error('WebGL not supported');

        const renderer = new THREE.WebGLRenderer({ canvas, context: gl as any });
        renderer.xr.enabled = true;
        renderer.xr.setSession(session);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Load scene content (glTF or scene-builder scene graph)
        loadContentIntoScene(scene, experience);

        // VR controllers
        const controller1 = renderer.xr.getController(0);
        scene.add(controller1);

        const controller2 = renderer.xr.getController(1);
        scene.add(controller2);

        // Animation loop
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });

        // Handle VR session end — the page session keeps running; it ends
        // with real numbers when the user leaves or rates.
        session.addEventListener('end', () => {
          setIsInVR(false);
          renderer.setAnimationLoop(null);
        });
      }
    } catch (err: any) {
      console.error('Error launching WebXR:', err);
      toast.error('Failed to launch VR: ' + err.message);
      setIsInVR(false);
    }
  };

  const launchAR = async () => {
    if (!navigator.xr) {
      toast.error('WebXR is not supported in your browser.');
      return;
    }

    try {
      const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');

      if (!isARSupported) {
        toast.error('AR mode is not supported on this device.');
        return;
      }

      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
      });

      toast.success('AR session started!');
    } catch (err: any) {
      console.error('Error launching AR:', err);
      toast.error('Failed to launch AR: ' + err.message);
    }
  };

  // G10: the API hardcodes supported_devices for every row, so derive what
  // this experience can actually do. Internal portals are pages (handled by
  // the redirect above); glTF and scene-graph experiences render in WebXR.
  const isPortal = Boolean(experience?.scene_file_url?.startsWith('/dashboard/'));
  const supportsVR = !isPortal;
  const supportsAR = !isPortal && Boolean(experience?.scene_file_url);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin text-6xl mb-4">🥽</div>
          <p className="text-xl">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl">Experience not found</p>
          <button
            onClick={() => router.push('/dashboard/xr-labs')}
            className="mt-6 px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
          >
            ← Back to XR Labs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/xr-labs')}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            ← Back to XR Labs
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRating(true)}
              disabled={sessionRecorded}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {sessionRecorded ? '✓ Session recorded' : '■ End session & rate'}
            </button>
            {supportsVR && (
              <button
                onClick={launchWebXR}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                disabled={isInVR}
              >
                {isInVR ? 'In VR Mode...' : '🥽 Launch VR'}
              </button>
            )}
            {supportsAR && (
              <button
                onClick={launchAR}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-700 transition-all shadow-lg"
              >
                📱 Launch AR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 3D Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl overflow-hidden border border-white/20">
              <canvas ref={canvasRef} className="w-full h-[600px]" />
            </div>

            {/* Learning Objectives */}
            {experience.learning_objectives.length > 0 && (
              <div className="mt-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4">📚 Learning Objectives</h3>
                <ul className="space-y-2">
                  {experience.learning_objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title & Description */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
              <h1 className="text-3xl font-bold mb-4">{experience.title}</h1>
              <p className="text-gray-300 mb-6">{experience.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {experience.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">📊 Experience Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="font-semibold">{experience.experience_type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subject</span>
                  <span className="font-semibold">{experience.lab_subject || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty</span>
                  <span className="font-semibold capitalize">{experience.difficulty_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-semibold">{experience.duration_minutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Motion</span>
                  <span className="font-semibold capitalize">{experience.motion_intensity || 'Moderate'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Age</span>
                  <span className="font-semibold">{experience.min_age || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Sessions</span>
                  <span className="font-semibold">{experience.total_sessions.toLocaleString()}</span>
                </div>
                {experience.avg_rating && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating</span>
                    <span className="font-semibold">⭐ {experience.avg_rating.toFixed(1)}/5</span>
                  </div>
                )}
              </div>
            </div>

            {/* Supported Devices */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">🎮 Supported Devices</h3>
              <div className="space-y-2">
                {experience.supported_devices.map((device, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2">
                    <span className="text-green-400">✓</span>
                    <span className="capitalize">{device.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            {experience.prerequisites.length > 0 && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4">⚠️ Prerequisites</h3>
                <ul className="space-y-2">
                  {experience.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* XR-2: the rating is the user's, not a hardcoded 5★ */}
      {showRating && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-1">How was this experience?</h2>
            <p className="text-sm text-gray-400 mb-4">
              Your completion so far: {computeCompletion()}%
            </p>
            <div className="flex justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => endSessionWithRating(n)}
                  aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
                  className="text-3xl hover:scale-125 transition-transform"
                >
                  ⭐
                </button>
              ))}
            </div>
            <button
              onClick={() => endSessionWithRating(null)}
              className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm"
            >
              End without rating
            </button>
            <button
              onClick={() => setShowRating(false)}
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

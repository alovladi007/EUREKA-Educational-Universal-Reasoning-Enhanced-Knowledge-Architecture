'use client';

/**
 * XR Experience Viewer
 *
 * Individual experience page with WebXR launch capability
 * Displays experience details, reviews, and launch options
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
}

const API_BASE_URL = process.env.NEXT_PUBLIC_XR_API_URL || 'http://localhost:3005/api/xr';

export default function ExperienceViewerPage() {
  // Microservice health gate — see scene-builder/page.tsx for rationale.
  const [msHealthy, setMsHealthy] = useState<boolean | null>(null);
  useEffect(() => {
    const ctl = new AbortController();
    fetch(`${API_BASE_URL}/experiences`, { signal: ctl.signal })
      .then((r) => setMsHealthy(r.ok))
      .catch(() => setMsHealthy(false));
    return () => ctl.abort();
  }, []);

  if (msHealthy === false) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card className="p-6 space-y-3">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6 text-amber-600" />
            XR microservice not running
          </h1>
          <p className="text-muted-foreground text-sm">
            The Experience Viewer fetches scenes from the separate{" "}
            <code className="font-mono text-xs">services/xr-labs/</code> Node
            microservice on <code className="font-mono text-xs">:3005</code>.
            That service isn&apos;t reachable right now.
          </p>
          <div className="rounded-md bg-muted p-3 font-mono text-xs">
            cd services/xr-labs && npm install && npm run dev
          </div>
          <p className="text-xs text-muted-foreground">
            Until then, use{" "}
            <Link href="/dashboard/xr-labs" className="text-primary hover:underline">XR Labs</Link>{" "}
            (real EUREKA study sets + resources) which works without the microservice.
          </p>
        </Card>
      </div>
    );
  }
  if (msHealthy === null) {
    return <div className="p-8 text-muted-foreground text-sm">Connecting to XR microservice…</div>;
  }

  return <ExperienceViewerInner />;
}

function ExperienceViewerInner() {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;

  const [experience, setExperience] = useState<XRExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInVR, setIsInVR] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch experience details
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/experiences/${experienceId}`);
        const data = await response.json();
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

    // Load scene
    const loader = new GLTFLoader();
    loader.load(experience.scene_file_url, (gltf) => {
      scene.add(gltf.scene);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  const startSession = async (deviceType: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          experience_id: experienceId,
          device_type: deviceType,
        }),
      });

      const data = await response.json();
      setSessionId(data.session.id);
      return data.session.id;
    } catch (err) {
      console.error('Error starting session:', err);
      return null;
    }
  };

  const launchWebXR = async () => {
    if (!navigator.xr) {
      alert('WebXR is not supported in your browser. Try Chrome or Edge on desktop/mobile, or use a VR headset browser.');
      return;
    }

    try {
      const isVRSupported = await navigator.xr.isSessionSupported('immersive-vr');

      if (!isVRSupported) {
        alert('VR mode is not available. Make sure you have a VR headset connected.');
        return;
      }

      // Start session tracking
      const sessId = await startSession('web_browser');

      // Request VR session
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

        // Load scene
        const loader = new GLTFLoader();
        loader.load(experience.scene_file_url, (gltf) => {
          scene.add(gltf.scene);
        });

        // VR controllers
        const controller1 = renderer.xr.getController(0);
        scene.add(controller1);

        const controller2 = renderer.xr.getController(1);
        scene.add(controller2);

        // Animation loop
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });

        // Handle session end
        session.addEventListener('end', async () => {
          setIsInVR(false);
          renderer.setAnimationLoop(null);

          // End session tracking
          if (sessId) {
            const token = localStorage.getItem('auth_token');
            await fetch(`${API_BASE_URL}/sessions/${sessId}/end`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                completion_percentage: 100,
                user_rating: 5,
              }),
            });
          }
        });
      }
    } catch (err: any) {
      console.error('Error launching WebXR:', err);
      alert('Failed to launch VR: ' + err.message);
      setIsInVR(false);
    }
  };

  const launchAR = async () => {
    if (!navigator.xr) {
      alert('WebXR is not supported in your browser.');
      return;
    }

    try {
      const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');

      if (!isARSupported) {
        alert('AR mode is not supported on this device.');
        return;
      }

      await startSession('mobile_ar');

      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
      });

      alert('AR session started!');
    } catch (err: any) {
      console.error('Error launching AR:', err);
      alert('Failed to launch AR: ' + err.message);
    }
  };

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
            onClick={() => router.push('/xr-labs')}
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
            onClick={() => router.push('/xr-labs')}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            ← Back to XR Labs
          </button>
          <div className="flex gap-2">
            {experience.supported_devices.includes('web_browser') && (
              <button
                onClick={launchWebXR}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                disabled={isInVR}
              >
                {isInVR ? 'In VR Mode...' : '🥽 Launch VR'}
              </button>
            )}
            {experience.supported_devices.includes('mobile_ar') && (
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
    </div>
  );
}

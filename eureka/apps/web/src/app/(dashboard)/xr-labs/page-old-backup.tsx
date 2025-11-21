'use client';

/**
 * XR Labs Dashboard
 *
 * Extended Reality (VR/AR/MR) Platform for Immersive STEM Education
 *
 * Features:
 * - Browse VR/AR/MR experiences
 * - 3D asset preview with Three.js
 * - Launch WebXR experiences
 * - Collaborative VR room management
 * - Session tracking and analytics
 * - Achievement progress
 * - Equipment checkout
 */

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import io, { Socket } from 'socket.io-client';

// =====================================================
// TYPES
// =====================================================

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
  total_sessions: number;
  avg_rating?: number;
  is_published: boolean;
}

interface Asset3D {
  id: string;
  asset_name: string;
  category: string;
  file_format: string;
  file_url: string;
  file_size_mb: number;
  polygon_count?: number;
  has_animations: boolean;
  thumbnail_url?: string;
}

interface VRRoom {
  id: string;
  room_code: string;
  experience_id: string;
  experience_title?: string;
  current_participants: number;
  max_participants: number;
  status: string;
  voice_chat_enabled: boolean;
  text_chat_enabled: boolean;
}

interface UserSession {
  id: string;
  experience_title: string;
  experience_type: string;
  session_duration: number;
  completion_percentage: number;
  user_rating?: number;
  started_at: string;
}

interface Achievement {
  achievement_name: string;
  description: string;
  icon_url?: string;
  points: number;
  rarity: string;
  earned_at?: string;
}

// =====================================================
// CONSTANTS
// =====================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_XR_API_URL || 'http://localhost:3005/api/xr';
const WS_URL = process.env.NEXT_PUBLIC_XR_WS_URL || 'http://localhost:3005';

const EXPERIENCE_TYPES = [
  { value: 'all', label: 'All Types', icon: '🎮' },
  { value: 'vr_lab', label: 'VR Laboratory', icon: '🧪' },
  { value: 'ar_overlay', label: 'AR Overlay', icon: '📱' },
  { value: 'mixed_reality', label: 'Mixed Reality', icon: '🥽' },
  { value: '3d_model', label: '3D Model Viewer', icon: '🗿' },
  { value: 'simulation', label: 'Simulation', icon: '⚛️' },
  { value: 'virtual_tour', label: 'Virtual Tour', icon: '🏛️' },
  { value: '360_video', label: '360° Video', icon: '📹' },
  { value: 'hologram', label: 'Hologram', icon: '✨' },
];

const SUBJECTS = [
  { value: 'all', label: 'All Subjects' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'physics', label: 'Physics' },
  { value: 'biology', label: 'Biology' },
  { value: 'anatomy', label: 'Anatomy' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'astronomy', label: 'Astronomy' },
  { value: 'geology', label: 'Geology' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'computer_science', label: 'Computer Science' },
];

const DIFFICULTY_LEVELS = [
  { value: 'all', label: 'All Levels', color: 'gray' },
  { value: 'beginner', label: 'Beginner', color: 'green' },
  { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
  { value: 'advanced', label: 'Advanced', color: 'red' },
];

const DEVICES = [
  { value: 'meta_quest', label: 'Meta Quest', icon: '🥽' },
  { value: 'htc_vive', label: 'HTC Vive', icon: '🎮' },
  { value: 'valve_index', label: 'Valve Index', icon: '🎯' },
  { value: 'web_browser', label: 'Web Browser', icon: '🌐' },
  { value: 'mobile_ar', label: 'Mobile AR', icon: '📱' },
  { value: 'hololens', label: 'HoloLens', icon: '👓' },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function XRLabsDashboard() {
  // State Management
  const [view, setView] = useState<'experiences' | 'rooms' | 'assets' | 'sessions' | 'achievements'>('experiences');
  const [experiences, setExperiences] = useState<XRExperience[]>([]);
  const [rooms, setRooms] = useState<VRRoom[]>([]);
  const [assets, setAssets] = useState<Asset3D[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Items
  const [selectedExperience, setSelectedExperience] = useState<XRExperience | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset3D | null>(null);

  // VR Room State
  const [currentRoom, setCurrentRoom] = useState<VRRoom | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // 3D Preview
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // =====================================================
  // API CALLS
  // =====================================================

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedSubject !== 'all') params.append('subject', selectedSubject);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`${API_BASE_URL}/experiences?${params}`);
      const data = await response.json();

      setExperiences(data.experiences || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/active`);
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
    }
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/assets?limit=50`);
      const data = await response.json();
      setAssets(data.assets || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/sessions/my-sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/achievements/my-achievements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAchievements(data.achievements || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // WEBXR LAUNCH
  // =====================================================

  const launchWebXR = async (experience: XRExperience) => {
    if (!navigator.xr) {
      alert('WebXR is not supported in this browser. Please use a WebXR-compatible browser or VR device.');
      return;
    }

    try {
      // Check if VR is supported
      const isVRSupported = await navigator.xr.isSessionSupported('immersive-vr');

      if (!isVRSupported) {
        alert('VR mode not supported. Opening in 3D preview mode instead.');
        setSelectedExperience(experience);
        return;
      }

      // Start XR session tracking
      const token = localStorage.getItem('auth_token');
      await fetch(`${API_BASE_URL}/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          experience_id: experience.id,
          device_type: 'web_browser',
        }),
      });

      // Launch VR session
      const session = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'eye-tracking'],
      });

      // Load the 3D scene
      loadXRScene(session, experience);
    } catch (err: any) {
      console.error('Error launching WebXR:', err);
      alert('Failed to launch VR experience: ' + err.message);
    }
  };

  const loadXRScene = async (session: XRSession, experience: XRExperience) => {
    // This is a simplified version - real implementation would be more complex
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { xrCompatible: true });

    if (!gl) {
      throw new Error('WebGL not supported');
    }

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

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(experience.scene_file_url, (gltf) => {
      scene.add(gltf.scene);
    });

    // Animation loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    session.addEventListener('end', () => {
      renderer.setAnimationLoop(null);
    });
  };

  // =====================================================
  // 3D PREVIEW (THREE.JS)
  // =====================================================

  const init3DPreview = (assetUrl: string) => {
    if (!canvasRef.current) return;

    // Clean up previous scene
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      assetUrl,
      (gltf) => {
        scene.add(gltf.scene);

        // Center and scale model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        gltf.scene.scale.multiplyScalar(scale);

        gltf.scene.position.sub(center.multiplyScalar(scale));

        // Animation
        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });

          const clock = new THREE.Clock();
          const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.update(delta);
            controls.update();
            renderer.render(scene, camera);
          };
          animate();
        } else {
          // Static render loop
          const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          };
          animate();
        }
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model:', error);
      }
    );
  };

  // =====================================================
  // VR ROOM WEBSOCKET
  // =====================================================

  const connectToRoom = (roomCode: string) => {
    const token = localStorage.getItem('auth_token');
    const newSocket = io(WS_URL, {
      auth: { token },
    });

    newSocket.emit('join_room', {
      roomCode,
      userId: 'current-user-id', // Replace with actual user ID
    });

    newSocket.on('room_state', (data) => {
      console.log('Room state:', data);
      setCurrentRoom(data.room);
    });

    newSocket.on('participant_joined', (data) => {
      console.log('Participant joined:', data);
    });

    newSocket.on('participant_left', (data) => {
      console.log('Participant left:', data);
    });

    newSocket.on('chat_message', (data) => {
      console.log('Chat message:', data);
    });

    setSocket(newSocket);
  };

  const disconnectFromRoom = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setCurrentRoom(null);
    }
  };

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    if (view === 'experiences') {
      fetchExperiences();
    } else if (view === 'rooms') {
      fetchRooms();
      const interval = setInterval(fetchRooms, 5000); // Refresh every 5s
      return () => clearInterval(interval);
    } else if (view === 'assets') {
      fetchAssets();
    } else if (view === 'sessions') {
      fetchSessions();
    } else if (view === 'achievements') {
      fetchAchievements();
    }
  }, [view, selectedType, selectedSubject, selectedDifficulty, searchQuery]);

  useEffect(() => {
    if (selectedAsset && canvasRef.current) {
      init3DPreview(selectedAsset.file_url);
    }
  }, [selectedAsset]);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">🥽</span>
              XR Labs
            </h1>
            <p className="text-gray-300">Extended Reality Platform for Immersive STEM Learning</p>
          </div>

          {/* Device Compatibility */}
          <div className="flex gap-2">
            {DEVICES.map((device) => (
              <div
                key={device.value}
                className="px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                title={device.label}
              >
                <span className="text-2xl">{device.icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-white/10 rounded-xl p-2 backdrop-blur-sm border border-white/20">
          {[
            { id: 'experiences', label: 'VR/AR Experiences', icon: '🎮' },
            { id: 'rooms', label: 'Collaborative Rooms', icon: '👥' },
            { id: 'assets', label: '3D Assets', icon: '🗿' },
            { id: 'sessions', label: 'My Sessions', icon: '📊' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                view === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* EXPERIENCES VIEW */}
        {view === 'experiences' && (
          <div>
            {/* Filters */}
            <div className="mb-6 bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {EXPERIENCE_TYPES.map((type) => (
                      <option key={type.value} value={type.value} className="bg-gray-900">
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {SUBJECTS.map((subject) => (
                      <option key={subject.value} value={subject.value} className="bg-gray-900">
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value} className="bg-gray-900">
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Experiences Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin text-6xl mb-4">🥽</div>
                <p className="text-xl">Loading XR experiences...</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center">
                <p className="text-xl">❌ Error: {error}</p>
              </div>
            ) : experiences.length === 0 ? (
              <div className="bg-white/10 rounded-xl p-12 text-center border border-white/20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl">No experiences found matching your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl overflow-hidden border border-white/20 hover:border-pink-500 transition-all hover:shadow-2xl hover:shadow-pink-500/50 cursor-pointer"
                    onClick={() => setSelectedExperience(exp)}
                  >
                    {/* Thumbnail */}
                    <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                      {exp.thumbnail_url ? (
                        <img src={exp.thumbnail_url} alt={exp.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">
                          {EXPERIENCE_TYPES.find((t) => t.value === exp.experience_type)?.icon || '🎮'}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold">
                        {exp.experience_type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{exp.description}</p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                        <span>⏱️ {exp.duration_minutes} min</span>
                        <span>
                          {exp.difficulty_level === 'beginner' && '🟢'}
                          {exp.difficulty_level === 'intermediate' && '🟡'}
                          {exp.difficulty_level === 'advanced' && '🔴'}
                          {exp.difficulty_level}
                        </span>
                        {exp.avg_rating && <span>⭐ {exp.avg_rating.toFixed(1)}/5</span>}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {exp.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          launchWebXR(exp);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                      >
                        Launch Experience 🚀
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COLLABORATIVE ROOMS VIEW */}
        {view === 'rooms' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Collaborative VR Rooms</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 transition-all shadow-lg">
                + Create New Room
              </button>
            </div>

            {rooms.length === 0 ? (
              <div className="bg-white/10 rounded-xl p-12 text-center border border-white/20">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-xl">No active collaborative rooms</p>
                <p className="text-gray-400 mt-2">Create a room to start learning with others!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20 hover:border-teal-500 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{room.experience_title}</h3>
                        <p className="text-sm text-gray-400">Room Code: {room.room_code}</p>
                      </div>
                      <div className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-full text-xs font-semibold">
                        {room.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <span>👥 {room.current_participants}/{room.max_participants}</span>
                      {room.voice_chat_enabled && <span>🎤 Voice</span>}
                      {room.text_chat_enabled && <span>💬 Chat</span>}
                    </div>

                    <button
                      onClick={() => connectToRoom(room.room_code)}
                      className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg font-semibold hover:from-teal-600 hover:to-blue-700 transition-all"
                    >
                      Join Room
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3D ASSETS VIEW */}
        {view === 'assets' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">3D Asset Library</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg">
                + Upload Asset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assets List */}
              <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedAsset?.id === asset.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <h3 className="font-bold mb-2">{asset.asset_name}</h3>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>📁 {asset.file_format.toUpperCase()}</p>
                      <p>💾 {asset.file_size_mb.toFixed(2)} MB</p>
                      {asset.polygon_count && <p>🔺 {asset.polygon_count.toLocaleString()} polygons</p>}
                      {asset.has_animations && <p>🎬 Animated</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* 3D Preview */}
              <div className="lg:col-span-2 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20 overflow-hidden">
                {selectedAsset ? (
                  <div className="relative h-full">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="font-bold mb-2">{selectedAsset.asset_name}</h3>
                      <p className="text-sm text-gray-300">Category: {selectedAsset.category}</p>
                    </div>
                    <canvas ref={canvasRef} className="w-full h-[600px]" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[600px]">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗿</div>
                      <p className="text-xl">Select an asset to preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SESSIONS VIEW */}
        {view === 'sessions' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My XR Sessions</h2>

            {sessions.length === 0 ? (
              <div className="bg-white/10 rounded-xl p-12 text-center border border-white/20">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl">No sessions yet</p>
                <p className="text-gray-400 mt-2">Start exploring VR/AR experiences!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{session.experience_title}</h3>
                        <p className="text-sm text-gray-400">{session.experience_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          {new Date(session.started_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-400">{session.session_duration.toFixed(1)}</p>
                        <p className="text-sm text-gray-400">Minutes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-400">{session.completion_percentage}%</p>
                        <p className="text-sm text-gray-400">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">
                          {session.user_rating ? `${session.user_rating}/5` : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-400">Rating</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACHIEVEMENTS VIEW */}
        {view === 'achievements' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Achievements</h2>

            {achievements.length === 0 ? (
              <div className="bg-white/10 rounded-xl p-12 text-center border border-white/20">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-xl">No achievements yet</p>
                <p className="text-gray-400 mt-2">Complete experiences to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-6 border-2 ${
                      achievement.rarity === 'legendary'
                        ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500'
                        : achievement.rarity === 'epic'
                        ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500'
                        : achievement.rarity === 'rare'
                        ? 'bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500'
                        : 'bg-gradient-to-br from-gray-600/20 to-gray-700/20 border-gray-500'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">
                        {achievement.icon_url ? (
                          <img src={achievement.icon_url} alt={achievement.achievement_name} className="w-16 h-16 mx-auto" />
                        ) : (
                          '🏆'
                        )}
                      </div>
                      <h3 className="text-xl font-bold">{achievement.achievement_name}</h3>
                    </div>

                    <p className="text-sm text-gray-300 text-center mb-4">{achievement.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">
                        {achievement.rarity.toUpperCase()}
                      </span>
                      <span className="text-yellow-400 font-bold">+{achievement.points} pts</span>
                    </div>

                    {achievement.earned_at && (
                      <p className="text-xs text-gray-400 text-center mt-4">
                        Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

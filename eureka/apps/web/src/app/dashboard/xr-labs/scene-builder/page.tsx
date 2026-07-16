'use client';

/**
 * XR Labs Scene Builder
 *
 * No-code drag-and-drop 3D scene creation tool
 * Build VR/AR experiences without writing code
 *
 * Features:
 * - Three.js 3D viewport with transform gizmo (move/rotate/scale)
 * - Primitives (cube/sphere/cylinder/cone/torus/plane) + glTF assets
 * - Asset library browser with upload (XR-3)
 * - Scene templates
 * - Object hierarchy + properties panel
 * - Save / reopen / delete projects (XR-1)
 * - Publish to the XR Labs catalog — the published experience renders the
 *   authored scene through the shared serializer (src/lib/xr/scene-serializer)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import toast from 'react-hot-toast';
import { api, getToken } from '@/lib/eureka-api';
import { populateScene, serializeObjects } from '@/lib/xr/scene-serializer';

// =====================================================
// TYPES
// =====================================================

interface SceneObject {
  id: string;
  name: string;
  type: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'model' | 'light' | 'text';
  mesh: THREE.Object3D;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  properties: Record<string, any>;
}

// XR-5: real type narrowing for three.js objects, replacing the file-wide
// @ts-nocheck. The jsm shims type OrbitControls/TransformControls as `any`
// values, so we alias their instance types here; disposeObject3D walks a
// subtree and frees GPU resources with proper Mesh/Material narrowing.
type OrbitControlsInstance = InstanceType<typeof OrbitControls>;
type TransformControlsInstance = InstanceType<typeof TransformControls>;

function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((child: THREE.Object3D) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((m) => m.dispose());
    } else {
      material?.dispose();
    }
  });
}

interface Project {
  id?: string;
  projectName: string;
  description: string;
  category: string;
  sceneData: {
    objects: any[];
    lights: any[];
    cameras: any[];
  };
}

interface Asset {
  id: string;
  asset_name: string;
  category_name: string;
  file_url: string;
  thumbnail_url?: string;
  file_format: string;
  has_animations: boolean;
}

interface Template {
  id: string;
  template_name: string;
  description: string;
  template_type: string;
  thumbnail_url?: string;
  scene_data: any;
}

// =====================================================
// CONSTANTS
// =====================================================

// Scene-builder data is served by api-core under /api/v1/xr/* (templates,
// asset-library, scene-builder projects + publish).
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1'}/xr`;
// XR-3: uploads go to the file-storage service (magic-byte validated),
// then get registered in the shared asset library via api-core.
const FILE_STORAGE_URL = process.env.NEXT_PUBLIC_FILE_STORAGE_URL || 'http://localhost:8300';

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function SceneBuilderPage() {
  // API health gate: if api-core's /xr endpoints are unreachable, every call
  // here fails and Three.js crashes trying to add(undefined) to the scene.
  // Show a clean error page in that case instead of mounting the editor.
  const [msHealthy, setMsHealthy] = useState<boolean | null>(null);
  useEffect(() => {
    const ctl = new AbortController();
    fetch(`${API_BASE_URL}/scene-builder/templates`, { signal: ctl.signal })
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
            XR API unavailable
          </h1>
          <p className="text-muted-foreground text-sm">
            The Scene Builder is a full Three.js editor backed by api-core&apos;s
            XR endpoints (<code className="font-mono text-xs">/api/v1/xr/*</code> —
            templates, asset library, scene projects). The API isn&apos;t
            reachable right now, so we can&apos;t load assets, templates, or save
            scenes. Check that api-core is running and{" "}
            <code className="font-mono text-[11px]">NEXT_PUBLIC_API_URL</code> points at it.
          </p>
          <p className="text-xs text-muted-foreground">
            In the meantime,{" "}
            <Link href="/dashboard/xr-labs" className="text-primary hover:underline">XR Labs</Link>{" "}
            (experiences, study sets + resources) works independently.
          </p>
        </Card>
      </div>
    );
  }
  if (msHealthy === null) {
    return <div className="p-8 text-muted-foreground text-sm">Connecting to XR microservice…</div>;
  }

  return <SceneBuilderEditor />;
}

function SceneBuilderEditor() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const orbitControlsRef = useRef<OrbitControlsInstance | null>(null);
  const transformControlsRef = useRef<TransformControlsInstance | null>(null);
  const animationFrameRef = useRef<number>(0);

  // State
  const [project, setProject] = useState<Project>({
    projectName: 'Untitled Project',
    description: '',
    category: 'science',
    sceneData: { objects: [], lights: [], cameras: [] }
  });

  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  // UI State
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [assetSearch, setAssetSearch] = useState('');

  // =====================================================
  // THREE.JS INITIALIZATION
  // =====================================================

  useEffect(() => {
    if (!canvasRef.current) return;

    initScene();
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cleanup();
    };
  }, []);

  const initScene = () => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 20, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Orbit Controls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.screenSpacePanning = false;
    orbitControls.minDistance = 1;
    orbitControls.maxDistance = 100;
    orbitControlsRef.current = orbitControls;

    // Transform Controls
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', (event: { value: boolean }) => {
      orbitControls.enabled = !event.value;
    });
    transformControls.addEventListener('objectChange', handleObjectTransform);
    // three r169: TransformControls is a Controls object, not an Object3D —
    // its visual gizmo lives on getHelper(). Adding the controls object was
    // silently failing, so the move/rotate/scale gizmo never appeared and
    // drag-manipulation was dead.
    scene.add(transformControls.getHelper ? transformControls.getHelper() : transformControls);
    transformControlsRef.current = transformControls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Axis Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Ground Plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d2d44,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !camera || !renderer) return;

      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  };

  const animate = () => {
    animationFrameRef.current = requestAnimationFrame(animate);

    if (orbitControlsRef.current) {
      orbitControlsRef.current.update();
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const cleanup = () => {
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    objects.forEach(obj => disposeObject3D(obj.mesh));
  };

  // =====================================================
  // OBJECT MANAGEMENT
  // =====================================================

  const addPrimitive = (type: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane') => {
    if (!sceneRef.current) return;

    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(0.5, 1, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.4, 0.16, 16, 48);
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(1, 1);
        break;
      default:
        return;
    }

    material = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      roughness: 0.5,
      metalness: 0.5
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const objectId = `obj_${Date.now()}`;
    mesh.userData.id = objectId;

    sceneRef.current.add(mesh);

    const newObject: SceneObject = {
      id: objectId,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.length + 1}`,
      type,
      mesh,
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      properties: { color: (material as THREE.MeshStandardMaterial).color.getHex() }
    };

    setObjects([...objects, newObject]);
    selectObject(newObject);
  };

  const loadAsset = async (asset: Asset) => {
    if (!sceneRef.current) return;

    const loader = new GLTFLoader();

    try {
      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load(
          asset.file_url,
          resolve,
          undefined,
          reject
        );
      });

      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const objectId = `model_${Date.now()}`;
      model.userData.id = objectId;

      sceneRef.current.add(model);

      const newObject: SceneObject = {
        id: objectId,
        name: asset.asset_name,
        type: 'model',
        mesh: model,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        properties: { assetId: asset.id, fileUrl: asset.file_url, hasAnimations: asset.has_animations }
      };

      setObjects([...objects, newObject]);
      selectObject(newObject);
      setShowAssetLibrary(false);

      // Track asset usage
      await fetch(`${API_BASE_URL}/asset-library/assets/${asset.id}/use`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
    } catch (error) {
      console.error('Error loading asset:', error);
      toast.error('Failed to load 3D asset');
    }
  };

  // XR-1: restore a serialized scene graph into the editor via the SHARED
  // serializer (the same code the viewer renders with, so save/open/publish/
  // view cannot drift). Replaces the old loadTemplate body, which set project
  // state but never actually instantiated the template's objects in 3D.
  const restoreScene = async (sceneData: any) => {
    if (!sceneRef.current) return;
    if (transformControlsRef.current) transformControlsRef.current.detach();
    const scene = sceneRef.current;
    objects.forEach(obj => scene.remove(obj.mesh));
    setSelectedObject(null);

    const restored = await populateScene(
      sceneRef.current,
      sceneData ?? { objects: [] },
      async (assetId: string) => {
        const found = assets.find(a => a.id === assetId);
        return found ? found.file_url : null;
      },
    );
    const restoredObjects: SceneObject[] = restored.map(({ data, object3D }) => ({
      id: data.id,
      name: data.name,
      type: data.type,
      mesh: object3D,
      position: data.position,
      rotation: data.rotation,
      scale: data.scale,
      properties: data.properties ?? {}
    }));
    setObjects(restoredObjects);
    const total = (sceneData?.objects ?? []).length;
    if (restored.length < total) {
      toast(`${total - restored.length} object(s) could not be restored.`, { icon: '⚠️' });
    }
  };

  const loadTemplate = async (template: Template) => {
    await restoreScene(template.scene_data);
    setProject({
      ...project,
      projectName: template.template_name,
      description: template.description,
      sceneData: template.scene_data
    });
    setShowTemplates(false);
    toast.success('Template loaded! Start customizing your scene.');
  };

  // ── My Projects (XR-1: saved work must be reopenable) ──

  const fetchMyProjects = async () => {
    try {
      const data = await api<{ projects: any[] }>('/xr/scene-builder/projects');
      setMyProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load your projects');
    }
  };

  const openProject = async (projectId: string) => {
    try {
      const data = await api<{ project: any }>(`/xr/scene-builder/projects/${projectId}`);
      const p = data.project;
      await restoreScene(p.sceneData);
      setProject({
        id: p.id,
        projectName: p.projectName,
        description: p.description,
        category: p.category,
        sceneData: p.sceneData
      });
      setShowMyProjects(false);
      toast.success(`Opened "${p.projectName}"`);
    } catch (error) {
      console.error('Error opening project:', error);
      toast.error('Failed to open project');
    }
  };

  const deleteProjectById = async (projectId: string) => {
    try {
      await api(`/xr/scene-builder/projects/${projectId}`, { method: 'DELETE' });
      setMyProjects((prev: any[]) => prev.filter((p) => p.id !== projectId));
      if (project.id === projectId) {
        setProject({ ...project, id: undefined });
      }
      toast.success('Project deleted');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  // XR-8: publishing used to be one-way. Unpublish flips the linked
  // experiences to unpublished (soft — session history survives) and clears
  // the project's public flag.
  const unpublishProjectById = async (projectId: string) => {
    try {
      const res = await api<{ unpublished: number }>(
        `/xr/scene-builder/projects/${projectId}/unpublish`,
        { method: 'POST' },
      );
      setMyProjects((prev: any[]) => prev.map((p) =>
        p.id === projectId ? { ...p, isPublic: false, publishedCount: 0 } : p
      ));
      toast.success(
        res.unpublished > 0
          ? 'Scene unpublished — removed from the experiences catalog'
          : 'Nothing was published for this project',
      );
    } catch (error) {
      console.error('Error unpublishing project:', error);
      toast.error('Failed to unpublish');
    }
  };

  const selectObject = (obj: SceneObject) => {
    setSelectedObject(obj);
    if (transformControlsRef.current) {
      transformControlsRef.current.attach(obj.mesh);
    }
  };

  const deleteObject = (obj: SceneObject) => {
    if (sceneRef.current) {
      sceneRef.current.remove(obj.mesh);
    }

    if (transformControlsRef.current) {
      transformControlsRef.current.detach();
    }

    // Safe because duplicates deep-clone geometry+material (never shared).
    disposeObject3D(obj.mesh);
    setObjects(objects.filter(o => o.id !== obj.id));
    setSelectedObject(null);
  };

  // XR-8: duplicate the selected object. Geometry and material are cloned
  // (not shared) so recoloring or deleting one never affects the other.
  const duplicateObject = (obj: SceneObject) => {
    if (!sceneRef.current) return;
    const cloned = obj.mesh.clone(true);
    cloned.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry = mesh.geometry.clone();
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((m) => m.clone())
          : mesh.material.clone();
      }
    });
    const objectId = `obj_${Date.now()}`;
    cloned.userData.id = objectId;
    cloned.position.x += 0.75;
    sceneRef.current.add(cloned);

    const newObject: SceneObject = {
      id: objectId,
      name: `${obj.name} copy`,
      type: obj.type,
      mesh: cloned,
      position: [cloned.position.x, cloned.position.y, cloned.position.z],
      rotation: [...obj.rotation] as [number, number, number],
      scale: [...obj.scale] as [number, number, number],
      properties: { ...obj.properties }
    };
    setObjects(prev => [...prev, newObject]);
    selectObject(newObject);
  };

  // XR-8: recolor the selected primitive (models keep their own materials).
  // Writes properties.color so the serializer persists it through
  // save -> reopen -> publish -> view.
  const setObjectColor = (hex: string) => {
    if (!selectedObject) return;
    const mesh = selectedObject.mesh as THREE.Mesh;
    if (!mesh.isMesh || Array.isArray(mesh.material)) return;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (!mat.color) return;
    const num = parseInt(hex.replace('#', ''), 16);
    if (Number.isNaN(num)) return;
    mat.color.setHex(num);
    const updated = {
      ...selectedObject,
      properties: { ...selectedObject.properties, color: num }
    };
    setSelectedObject(updated);
    setObjects(objects.map(o => o.id === selectedObject.id ? updated : o));
  };

  const handleObjectTransform = () => {
    if (!selectedObject || !transformControlsRef.current) return;

    const mesh = selectedObject.mesh;
    const updatedObject = {
      ...selectedObject,
      position: [mesh.position.x, mesh.position.y, mesh.position.z] as [number, number, number],
      rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z] as [number, number, number],
      scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z] as [number, number, number]
    };

    setSelectedObject(updatedObject);
    setObjects(objects.map(obj => obj.id === selectedObject.id ? updatedObject : obj));
  };

  // =====================================================
  // TRANSFORM CONTROLS
  // =====================================================

  useEffect(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(transformMode);
    }
  }, [transformMode]);

  // XR-8: the controls help always advertised "Del: Delete Selected" but no
  // handler existed. Guarded so typing in the name/position inputs (or any
  // dialog field) never nukes the selection.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const target = e.target as HTMLElement | null;
      if (target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )) return;
      if (!selectedObject) return;
      e.preventDefault();
      deleteObject(selectedObject);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject, objects]);

  // =====================================================
  // PROJECT MANAGEMENT
  // =====================================================

  const saveProject = async () => {
    try {
      setIsSaving(true);

      const sceneData = serializeObjects(objects);

      const token = localStorage.getItem('access_token');
      const url = project.id
        ? `${API_BASE_URL}/scene-builder/projects/${project.id}`
        : `${API_BASE_URL}/scene-builder/projects`;

      const method = project.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectName: project.projectName,
          description: project.description,
          category: project.category,
          sceneData
        })
      });

      const data = await response.json();

      if (response.ok) {
        setProject({ ...project, id: data.project.id });
        toast.success('Project saved successfully!');
        setShowSaveDialog(false);
      } else {
        toast.error('Failed to save project: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const publishProject = async () => {
    if (!project.id) {
      toast('Please save your project first before publishing', { icon: 'ℹ️' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/scene-builder/projects/${project.id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          experience_type: 'vr_lab',
          difficulty_level: 'beginner',
          duration_minutes: 30,
          supported_devices: ['web_browser', 'meta_quest'],
          tags: ['custom', 'student-created']
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Project published successfully!');
        setShowPublishDialog(false);
        router.push(`/dashboard/xr-labs/experience/${data.experienceId}`);
      } else {
        toast.error('Failed to publish: ' + data.error);
      }
    } catch (error) {
      console.error('Error publishing project:', error);
      toast.error('Failed to publish project');
    }
  };

  // =====================================================
  // DATA FETCHING
  // =====================================================

  useEffect(() => {
    fetchAssets();
    fetchTemplates();
  }, []);

  const [isUploading, setIsUploading] = useState(false);

  // XR-3: upload a .glb/.gltf to file-storage, register it in the shared
  // library, and refresh the panel so it's immediately placeable.
  const uploadAsset = async (file: File) => {
    const ext = file.name.toLowerCase().split('.').pop();
    if (ext !== 'glb' && ext !== 'gltf') {
      toast.error('Only .glb / .gltf models can be uploaded');
      return;
    }
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'xr-assets');
      form.append('description', 'XR Labs asset-library upload');
      const upRes = await fetch(`${FILE_STORAGE_URL}/api/v1/files/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken() ?? ''}` },
        body: form,
      });
      const upData = await upRes.json();
      if (!upRes.ok) {
        toast.error('Upload rejected: ' + (upData.detail || upRes.status));
        return;
      }
      // file_path is 'xr-assets/{user}/{id}.glb' — the public route serves
      // everything under xr-assets/ without auth (GLTFLoader can't send one).
      const publicUrl = `${FILE_STORAGE_URL}/api/v1/files/public/${upData.file_path}`;
      await api('/xr/asset-library/assets', {
        method: 'POST',
        body: JSON.stringify({
          asset_name: file.name.replace(/\.(glb|gltf)$/i, ''),
          file_url: publicUrl,
          file_format: ext,
          category_name: 'Uploads',
          file_size_kb: Math.round(file.size / 1024),
        }),
      });
      toast.success(`"${file.name}" added to the asset library`);
      await fetchAssets();
    } catch (error) {
      console.error('Error uploading asset:', error);
      toast.error('Failed to upload asset');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/asset-library/search?limit=100`);
      const data = await response.json();
      setAssets(data.assets || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/scene-builder/templates`);
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.asset_name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    asset.category_name?.toLowerCase().includes(assetSearch.toLowerCase())
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* TOP TOOLBAR */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/xr-labs')}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            ← Back
          </button>

          <div className="border-l border-gray-600 pl-4">
            <input
              type="text"
              value={project.projectName}
              onChange={(e) => setProject({ ...project, projectName: e.target.value })}
              className="px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-lg font-semibold"
              placeholder="Project Name"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { fetchMyProjects(); setShowMyProjects(true); }}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors font-semibold"
          >
            📂 My Projects
          </button>

          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            💾 Save
          </button>

          <button
            onClick={() => setShowPublishDialog(true)}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors font-semibold"
          >
            🚀 Publish
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - TOOLS */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto p-4 space-y-6">
          {/* Add Objects */}
          <div>
            <h3 className="font-bold mb-3 text-lg">Add Objects</h3>
            <div className="space-y-2">
              <button
                onClick={() => addPrimitive('cube')}
                className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-left px-3"
              >
                🟦 Cube
              </button>
              <button
                onClick={() => addPrimitive('sphere')}
                className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-left px-3"
              >
                🔵 Sphere
              </button>
              <button
                onClick={() => addPrimitive('cylinder')}
                className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-left px-3"
              >
                🔶 Cylinder
              </button>
              <button
                onClick={() => addPrimitive('cone')}
                className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-left px-3"
              >
                🔺 Cone
              </button>
              <button
                onClick={() => addPrimitive('torus')}
                className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-left px-3"
              >
                🍩 Torus
              </button>
              <button
                onClick={() => addPrimitive('plane')}
                className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-left px-3"
              >
                ▭ Plane
              </button>
              <button
                onClick={() => setShowAssetLibrary(true)}
                className="w-full py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors text-left px-3 font-semibold"
              >
                📚 Asset Library
              </button>
              <button
                onClick={() => setShowTemplates(true)}
                className="w-full py-2 bg-pink-600 rounded hover:bg-pink-700 transition-colors text-left px-3 font-semibold"
              >
                📐 Templates
              </button>
            </div>
          </div>

          {/* Transform Tools */}
          <div>
            <h3 className="font-bold mb-3 text-lg">Transform</h3>
            <div className="space-y-2">
              <button
                onClick={() => setTransformMode('translate')}
                className={`w-full py-2 rounded transition-colors text-left px-3 ${
                  transformMode === 'translate' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                ↔️ Move
              </button>
              <button
                onClick={() => setTransformMode('rotate')}
                className={`w-full py-2 rounded transition-colors text-left px-3 ${
                  transformMode === 'rotate' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                🔄 Rotate
              </button>
              <button
                onClick={() => setTransformMode('scale')}
                className={`w-full py-2 rounded transition-colors text-left px-3 ${
                  transformMode === 'scale' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                ⬍⬎ Scale
              </button>
            </div>
          </div>

          {/* Scene Hierarchy */}
          <div>
            <h3 className="font-bold mb-3 text-lg">Scene Objects ({objects.length})</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {objects.map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => selectObject(obj)}
                  className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                    selectedObject?.id === obj.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{obj.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteObject(obj);
                      }}
                      aria-label={`Delete ${obj.name}`}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      <span aria-hidden="true">🗑️</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER - 3D VIEWPORT */}
        <div className="flex-1 relative bg-gray-900">
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Viewport Overlay Info */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3 flex gap-6 text-sm">
            <span>Objects: {objects.length}</span>
            <span>|</span>
            <span>Mode: {transformMode.toUpperCase()}</span>
            <span>|</span>
            <span>{selectedObject ? `Selected: ${selectedObject.name}` : 'No selection'}</span>
          </div>

          {/* Controls Help */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-sm space-y-1">
            <div className="font-bold mb-2">Controls</div>
            <div>🖱️ Left Click: Select</div>
            <div>🖱️ Right Click + Drag: Rotate View</div>
            <div>🖱️ Scroll: Zoom</div>
            <div>⌨️ Del: Delete Selected</div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - PROPERTIES */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 overflow-y-auto p-4">
          <h3 className="font-bold mb-4 text-lg">Properties</h3>

          {selectedObject ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-400">Name</label>
                <input
                  type="text"
                  value={selectedObject.name}
                  onChange={(e) => {
                    const updated = { ...selectedObject, name: e.target.value };
                    setSelectedObject(updated);
                    setObjects(objects.map(obj => obj.id === selectedObject.id ? updated : obj));
                  }}
                  className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis, idx) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-500">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedObject.position[idx].toFixed(2)}
                        onChange={(e) => {
                          const newPos = [...selectedObject.position] as [number, number, number];
                          newPos[idx] = parseFloat(e.target.value) || 0;
                          selectedObject.mesh.position.set(...newPos);
                          setSelectedObject({ ...selectedObject, position: newPos });
                        }}
                        className="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Rotation</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis, idx) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-500">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={(selectedObject.rotation[idx] * 180 / Math.PI).toFixed(1)}
                        onChange={(e) => {
                          const degrees = parseFloat(e.target.value) || 0;
                          const radians = degrees * Math.PI / 180;
                          const newRot = [...selectedObject.rotation] as [number, number, number];
                          newRot[idx] = radians;
                          selectedObject.mesh.rotation.set(...newRot);
                          setSelectedObject({ ...selectedObject, rotation: newRot });
                        }}
                        className="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">degrees</div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Scale</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis, idx) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-500">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={selectedObject.scale[idx].toFixed(2)}
                        onChange={(e) => {
                          const newScale = [...selectedObject.scale] as [number, number, number];
                          newScale[idx] = Math.max(0.1, parseFloat(e.target.value) || 1);
                          selectedObject.mesh.scale.set(...newScale);
                          setSelectedObject({ ...selectedObject, scale: newScale });
                        }}
                        className="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {selectedObject.type !== 'model' && (
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Color</label>
                  <input
                    type="color"
                    aria-label="Object color"
                    value={`#${(typeof selectedObject.properties?.color === 'number'
                      ? selectedObject.properties.color
                      : 0x8888ff
                    ).toString(16).padStart(6, '0')}`}
                    onChange={(e) => setObjectColor(e.target.value)}
                    className="w-full h-9 bg-gray-700 rounded border border-gray-600 cursor-pointer"
                  />
                </div>
              )}

              <button
                onClick={() => duplicateObject(selectedObject)}
                className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors font-semibold"
              >
                📄 Duplicate
              </button>

              <button
                onClick={() => deleteObject(selectedObject)}
                className="w-full py-2 bg-red-600 rounded hover:bg-red-700 transition-colors font-semibold"
              >
                🗑️ Delete Object
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Select an object to edit its properties
            </div>
          )}
        </div>
      </div>

      {/* ASSET LIBRARY MODAL */}
      {showAssetLibrary && (
        <AssetLibraryModal
          assets={filteredAssets}
          search={assetSearch}
          onSearchChange={setAssetSearch}
          onSelectAsset={loadAsset}
          onUpload={uploadAsset}
          isUploading={isUploading}
          onClose={() => setShowAssetLibrary(false)}
        />
      )}

      {/* MY PROJECTS MODAL */}
      {showMyProjects && (
        <MyProjectsModal
          projects={myProjects}
          currentProjectId={project.id}
          onOpenProject={openProject}
          onDeleteProject={deleteProjectById}
          onUnpublishProject={unpublishProjectById}
          onClose={() => setShowMyProjects(false)}
        />
      )}

      {/* TEMPLATES MODAL */}
      {showTemplates && (
        <TemplatesModal
          templates={templates}
          onSelectTemplate={loadTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* SAVE DIALOG */}
      {showSaveDialog && (
        <SaveDialog
          project={project}
          onSave={saveProject}
          onClose={() => setShowSaveDialog(false)}
          isSaving={isSaving}
        />
      )}

      {/* PUBLISH DIALOG */}
      {showPublishDialog && (
        <PublishDialog
          onPublish={publishProject}
          onClose={() => setShowPublishDialog(false)}
        />
      )}
    </div>
  );
}

// =====================================================
// MODAL COMPONENTS
// =====================================================

function AssetLibraryModal({ assets, search, onSearchChange, onSelectAsset, onUpload, isUploading, onClose }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold">Asset Library</h2>
            <p className="text-sm text-gray-400">{assets.length} model{assets.length === 1 ? '' : 's'} — upload your own .glb/.gltf</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              {isUploading ? 'Uploading…' : '⬆️ Upload model'}
            </button>
            <button onClick={onClose} aria-label="Close asset library" className="text-3xl hover:text-gray-400"><span aria-hidden="true">×</span></button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map((asset: Asset) => (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <div className="aspect-square bg-gray-600 flex items-center justify-center text-4xl">
                  {asset.thumbnail_url ? (
                    <img src={asset.thumbnail_url} alt={asset.asset_name} className="w-full h-full object-cover" />
                  ) : (
                    '🗿'
                  )}
                </div>
                <div className="p-3">
                  <div className="font-semibold text-sm truncate">{asset.asset_name}</div>
                  <div className="text-xs text-gray-400 capitalize">{asset.category_name}</div>
                  {asset.has_animations && (
                    <div className="text-xs text-green-400 mt-1">🎬 Animated</div>
                  )}
                  {typeof asset.file_url === 'string' && asset.file_url.includes('modelviewer.dev') && (
                    <div className="text-[10px] text-amber-400/80 mt-1">external sample</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyProjectsModal({ projects, currentProjectId, onOpenProject, onDeleteProject, onUnpublishProject, onClose }: any) {
  const [armedDelete, setArmedDelete] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold">My Projects</h2>
            <p className="text-sm text-gray-400">Reopen a saved scene or delete old ones</p>
          </div>
          <button onClick={onClose} aria-label="Close my projects" className="text-3xl hover:text-gray-400"><span aria-hidden="true">×</span></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {projects.length === 0 && (
            <p className="text-gray-400 text-sm">
              No saved projects yet. Build a scene and hit 💾 Save — it will show up here.
            </p>
          )}
          {projects.map((p: any) => (
            <div
              key={p.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg ${
                p.id === currentProjectId ? 'bg-blue-900/40 border border-blue-700' : 'bg-gray-700'
              }`}
            >
              <div className="min-w-0">
                <div className="font-semibold truncate">
                  {p.projectName}
                  {p.id === currentProjectId && <span className="ml-2 text-xs text-blue-300">(open)</span>}
                  {p.publishedCount > 0 && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide bg-green-900/60 text-green-300 border border-green-700 rounded px-1.5 py-0.5">
                      Published
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {p.category}{p.description ? ` · ${p.description}` : ''}
                  {p.updatedAt ? ` · ${new Date(p.updatedAt).toLocaleString()}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenProject(p.id)}
                  className="px-3 py-1.5 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  Open
                </button>
                {p.publishedCount > 0 && (
                  <button
                    onClick={() => onUnpublishProject(p.id)}
                    className="px-3 py-1.5 bg-amber-700 rounded hover:bg-amber-600 transition-colors text-sm font-semibold"
                  >
                    Unpublish
                  </button>
                )}
                {armedDelete === p.id ? (
                  <button
                    onClick={() => { onDeleteProject(p.id); setArmedDelete(null); }}
                    className="px-3 py-1.5 bg-red-600 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    Confirm?
                  </button>
                ) : (
                  <button
                    onClick={() => setArmedDelete(p.id)}
                    aria-label={`Delete ${p.projectName}`}
                    className="px-3 py-1.5 bg-gray-600 rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplatesModal({ templates, onSelectTemplate, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-5xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Scene Templates</h2>
          <button onClick={onClose} aria-label="Close templates" className="text-3xl hover:text-gray-400"><span aria-hidden="true">×</span></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: Template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <div className="aspect-video bg-gray-600 flex items-center justify-center text-5xl">
                  {template.thumbnail_url ? (
                    <img src={template.thumbnail_url} alt={template.template_name} className="w-full h-full object-cover" />
                  ) : (
                    '📐'
                  )}
                </div>
                <div className="p-4">
                  <div className="font-bold mb-1">{template.template_name}</div>
                  <div className="text-sm text-gray-400">{template.description}</div>
                  <div className="mt-2 text-xs text-gray-500 capitalize">{template.template_type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveDialog({ project, onSave, onClose, isSaving }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Save Project</h2>
        <p className="text-sm text-gray-400 mb-4">Your scene will be saved to your projects</p>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : '💾 Save Project'}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PublishDialog({ onPublish, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Publish to XR Labs</h2>
        <p className="text-sm text-gray-400 mb-4">
          Your scene becomes a published experience in the XR Labs catalog: anyone
          can open it in the browser viewer, and a headset browser with WebXR can
          enter it immersively. Sessions and ratings are recorded like any other
          experience.
        </p>

        <button
          onClick={onPublish}
          className="w-full py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          🚀 Publish Now
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

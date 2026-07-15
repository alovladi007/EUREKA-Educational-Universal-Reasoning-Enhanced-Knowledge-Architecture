/**
 * XR scene-graph serializer (XR-1: the shared contract that closes the
 * authoring loop).
 *
 * The Scene Builder saves scenes as JSON scene graphs (`scene_data` on
 * xr_scene_projects, copied onto xr_experiences at publish). This module is
 * the ONE place that knows that shape: the builder writes it and restores it
 * (open project / load template), and the experience viewer renders it.
 * Keeping both sides on this file means they cannot drift apart again —
 * drift is exactly what produced the old publish-to-empty-void bug.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export type Vec3 = [number, number, number];

export interface SerializedObjectProperties {
  /** Primitive tint as a numeric hex (e.g. 0xff0000). */
  color?: number;
  /** For type "model": the xr_3d_assets row this instance came from. */
  assetId?: string;
  /**
   * For type "model": the asset's glTF URL, stamped at placement time so the
   * viewer can render without an asset-library lookup. Older saves may lack
   * it — callers can pass resolveAssetUrl to recover from assetId.
   */
  fileUrl?: string;
  hasAnimations?: boolean;
  [key: string]: unknown;
}

export interface SerializedSceneObject {
  id: string;
  name: string;
  type:
    | "cube"
    | "sphere"
    | "cylinder"
    | "cone"
    | "torus"
    | "plane"
    | "model"
    | "light"
    | "text";
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  properties?: SerializedObjectProperties;
}

export interface SceneData {
  objects: SerializedSceneObject[];
  lights?: unknown[];
  cameras?: unknown[];
}

/** True when the payload has at least one renderable object. */
export function hasRenderableContent(data: unknown): data is SceneData {
  return Boolean(
    data &&
      typeof data === "object" &&
      Array.isArray((data as SceneData).objects) &&
      (data as SceneData).objects.length > 0,
  );
}

/** Build the mesh for a primitive object type. Returns null for non-primitives. */
export function createPrimitiveMesh(
  type: SerializedSceneObject["type"],
  color?: number,
): THREE.Mesh | null {
  let geometry: THREE.BufferGeometry;
  switch (type) {
    case "cube":
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(0.5, 32, 32);
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
      break;
    case "cone":
      geometry = new THREE.ConeGeometry(0.5, 1, 32);
      break;
    case "torus":
      geometry = new THREE.TorusGeometry(0.4, 0.16, 16, 48);
      break;
    case "plane":
      geometry = new THREE.PlaneGeometry(1, 1);
      break;
    default:
      return null;
  }
  const material = new THREE.MeshStandardMaterial({
    color: typeof color === "number" ? color : 0x8888ff,
    roughness: 0.5,
    metalness: 0.5,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function applyTransform(obj: THREE.Object3D, data: SerializedSceneObject): void {
  obj.position.set(...data.position);
  obj.rotation.set(...data.rotation);
  obj.scale.set(...data.scale);
  obj.userData.id = data.id;
}

async function loadGltf(url: string): Promise<THREE.Object3D> {
  const loader = new GLTFLoader();
  // GLTFLoader is shimmed as `any` (src/types/three-modules.d.ts).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gltf = await new Promise<any>((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
  const model: THREE.Object3D = gltf.scene;
  model.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return model;
}

/**
 * Instantiate one serialized object as a THREE.Object3D.
 * Returns null when the object can't be built (unknown type, missing model
 * URL, failed glTF load) — callers should render the rest of the scene.
 */
export async function instantiateSceneObject(
  data: SerializedSceneObject,
  resolveAssetUrl?: (assetId: string) => Promise<string | null>,
): Promise<THREE.Object3D | null> {
  if (data.type === "model") {
    let url = data.properties?.fileUrl ?? null;
    if (!url && data.properties?.assetId && resolveAssetUrl) {
      url = await resolveAssetUrl(data.properties.assetId);
    }
    if (!url) return null;
    try {
      const model = await loadGltf(url);
      applyTransform(model, data);
      return model;
    } catch {
      return null;
    }
  }
  const mesh = createPrimitiveMesh(data.type, data.properties?.color);
  if (!mesh) return null;
  applyTransform(mesh, data);
  return mesh;
}

export interface RestoredObject {
  data: SerializedSceneObject;
  object3D: THREE.Object3D;
}

/**
 * Instantiate a full scene graph into `scene`. Objects that fail to build are
 * skipped (reported via the return value's length vs. input length), never
 * thrown — a half-renderable scene beats a black void.
 */
export async function populateScene(
  scene: THREE.Scene,
  data: SceneData,
  resolveAssetUrl?: (assetId: string) => Promise<string | null>,
): Promise<RestoredObject[]> {
  const restored: RestoredObject[] = [];
  const results = await Promise.all(
    (data.objects ?? []).map(async (objData) => ({
      objData,
      object3D: await instantiateSceneObject(objData, resolveAssetUrl),
    })),
  );
  for (const { objData, object3D } of results) {
    if (!object3D) continue;
    scene.add(object3D);
    restored.push({ data: objData, object3D });
  }
  return restored;
}

/** Serialize builder state back to the persisted shape (single write path). */
export function serializeObjects(
  objects: Array<{
    id: string;
    name: string;
    type: SerializedSceneObject["type"];
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
    properties?: SerializedObjectProperties;
  }>,
): SceneData {
  return {
    objects: objects.map((obj) => ({
      id: obj.id,
      name: obj.name,
      type: obj.type,
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
      properties: obj.properties ?? {},
    })),
    lights: [],
    cameras: [],
  };
}

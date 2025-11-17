import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid, Environment } from "@react-three/drei";
import * as THREE from "three";

interface LayerConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  visible: boolean;
}

function Skeleton({ visible, opacity }: { visible: boolean; opacity: number }) {
  return (
    <group visible={visible}>
      {/* Skull */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
      </mesh>
      {/* Spine */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.6, 16]} />
        <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
      </mesh>
      {/* Ribs */}
      {[-0.2, -0.1, 0, 0.1, 0.2].map((z, i) => (
        <group key={i} position={[0, 1.2 - i * 0.1, z]}>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
            <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
          </mesh>
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
            <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
          </mesh>
        </group>
      ))}
      {/* Pelvis */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.15, 0.02, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.3, 0.9, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0.3, 0.9, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, -0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.025, 1, 12]} />
        <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0.1, -0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.025, 1, 12]} />
        <meshStandardMaterial color="#e8dcc4" opacity={opacity} transparent />
      </mesh>
    </group>
  );
}

function Heart3D({ visible, opacity }: { visible: boolean; opacity: number }) {
  return (
    <group visible={visible} position={[0.05, 1, 0.1]}>
      <mesh position={[-0.04, 0, 0]}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color="#c41e3a" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0.04, 0, 0]}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color="#c41e3a" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <coneGeometry args={[0.08, 0.12, 4]} />
        <meshStandardMaterial color="#c41e3a" opacity={opacity} transparent />
      </mesh>
    </group>
  );
}

function Brain3D({ visible, opacity }: { visible: boolean; opacity: number }) {
  return (
    <group visible={visible} position={[0, 1.65, 0]}>
      <mesh position={[-0.05, 0, 0]}>
        <sphereGeometry args={[0.08, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial color="#f5c2c7" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0.05, 0, 0]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[0.08, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial color="#f5c2c7" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0, -0.06, -0.04]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#e8b4bc" opacity={opacity} transparent />
      </mesh>
    </group>
  );
}

function Organs({ visible, opacity }: { visible: boolean; opacity: number }) {
  return (
    <group visible={visible}>
      <mesh position={[-0.12, 1.05, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ff9999" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0.12, 1.05, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ff9999" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0.08, 0.7, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.08]} />
        <meshStandardMaterial color="#8b4513" opacity={opacity} transparent />
      </mesh>
      <mesh position={[-0.05, 0.65, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff6b6b" opacity={opacity} transparent />
      </mesh>
      <mesh position={[-0.1, 0.5, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.03, 0.08, 8, 16]} />
        <meshStandardMaterial color="#8B0000" opacity={opacity} transparent />
      </mesh>
      <mesh position={[0.1, 0.5, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.03, 0.08, 8, 16]} />
        <meshStandardMaterial color="#8B0000" opacity={opacity} transparent />
      </mesh>
    </group>
  );
}

function RotatingModel({ children, autoRotate }: { children: React.ReactNode; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

interface ThreeViewerProps {
  layers: LayerConfig[];
  autoRotate: boolean;
  showGrid: boolean;
}

export default function ThreeViewer({ layers, autoRotate, showGrid }: ThreeViewerProps) {
  const skeletonLayer = layers.find((l) => l.id === "skeleton");
  const heartLayer = layers.find((l) => l.id === "heart");
  const brainLayer = layers.find((l) => l.id === "brain");
  const organsLayer = layers.find((l) => l.id === "organs");

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[2, 1.5, 2]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      {showGrid && <Grid args={[10, 10]} />}

      <RotatingModel autoRotate={autoRotate}>
        <Skeleton visible={skeletonLayer?.visible || false} opacity={1.0} />
        <Heart3D visible={heartLayer?.visible || false} opacity={0.9} />
        <Brain3D visible={brainLayer?.visible || false} opacity={0.9} />
        <Organs visible={organsLayer?.visible || false} opacity={0.8} />
      </RotatingModel>

      <Environment preset="studio" />
    </Canvas>
  );
}

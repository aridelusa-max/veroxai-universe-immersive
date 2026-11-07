import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Core() {
  const group = useRef(null);
  const shell = useRef(null);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = Math.sin(time * 0.22) * 0.12;
    group.current.position.y = Math.sin(time * 0.55) * 0.12;
    if (shell.current) shell.current.rotation.z -= delta * 0.08;
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.28} floatIntensity={0.45}>
        <mesh
          onPointerOver={() => setActive(true)}
          onPointerOut={() => setActive(false)}
          scale={active ? 1.12 : 1}
        >
          <icosahedronGeometry args={[1.12, 5]} />
          <MeshDistortMaterial
            color="#ff168f"
            roughness={0.18}
            metalness={0.72}
            distort={0.28}
            speed={2.1}
          />
        </mesh>

        <mesh ref={shell} scale={1.34}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#ffd6ed" wireframe transparent opacity={0.34} />
        </mesh>

        <mesh rotation={[0.8, 0.2, 0.4]} scale={1.55}>
          <torusGeometry args={[1.18, 0.009, 8, 180]} />
          <meshBasicMaterial color="#ff7cbd" transparent opacity={0.8} />
        </mesh>

        <mesh rotation={[1.35, 0.6, -0.3]} scale={1.82}>
          <torusGeometry args={[1.18, 0.006, 8, 180]} />
          <meshBasicMaterial color="#b9a4ff" transparent opacity={0.72} />
        </mesh>
      </Float>

      <mesh position={[1.95, 0.65, -0.25]} scale={0.28}>
        <octahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#d6c6ff"
          metalness={0.85}
          roughness={0.2}
          emissive="#6b36a8"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[-1.85, -0.72, 0.3]} scale={0.2}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#ff8bc5"
          metalness={0.8}
          roughness={0.24}
          emissive="#8d174f"
          emissiveIntensity={0.55}
        />
      </mesh>
    </group>
  );
}

function MovingParticles() {
  const ref = useRef(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.018;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
  });

  return (
    <group ref={ref}>
      <Stars radius={9} depth={5} count={650} factor={2.2} saturation={0.4} fade speed={0.45} />
      <Sparkles count={85} scale={6.5} size={2.1} speed={0.28} color="#ff9bce" opacity={0.7} />
    </group>
  );
}

function Scene() {
  const root = useRef(null);

  useFrame((state) => {
    if (!root.current) return;
    const { x, y } = state.pointer;
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, x * 0.13, 0.025);
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -y * 0.08, 0.025);
  });

  return (
    <>
      <color attach="background" args={['#08070a']} />
      <fog attach="fog" args={['#08070a', 7, 13]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[3, 3, 4]} intensity={30} color="#ff4aa8" distance={10} />
      <pointLight position={[-4, -2, 2]} intensity={18} color="#8d63ff" distance={9} />
      <directionalLight position={[2, 5, 5]} intensity={1.5} />
      <group ref={root}>
        <Core />
        <MovingParticles />
      </group>
    </>
  );
}

export default function UniverseCanvas() {
  return (
    <div
      className="universe-canvas"
      aria-label="Interactive 3D universe with a rotating geometric core"
    >
      <Canvas
        camera={{ position: [0, 0, 6.6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

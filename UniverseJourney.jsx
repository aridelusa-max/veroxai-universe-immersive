import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ScrollControls, useScroll, Sparkles, Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const portals = [
  { id: 'minds', title: 'THE THINKERS', color: '#ff168f', position: [-2.1, 0.15, -8] },
  { id: 'mathematics', title: 'THE PATTERNS', color: '#9b72ff', position: [2.0, -0.25, -17] },
  { id: 'business', title: 'THE STRATEGY', color: '#48a9ff', position: [-1.8, 0.2, -26] },
  { id: 'creative-lab', title: 'THE CREATIVE LAB', color: '#ff8bca', position: [1.9, 0.1, -35] },
];

function EnergyCore({ color = '#ff168f', position = [0, 0, 0], scale = 1 }) {
  const mesh = useRef();
  const shell = useRef();
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uAccent: { value: new THREE.Color('#b58aff') },
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 p = position;
        float wave = sin(p.y * 5.0 + uTime * 1.5) * cos(p.x * 4.0 - uTime);
        p += normal * wave * 0.075;
        vPosition = p;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uAccent;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.0);
        float pulse = 0.5 + 0.5 * sin(uTime * 1.8 + vPosition.y * 3.0);
        vec3 color = mix(uColor, uAccent, smoothstep(-0.8, 0.9, vPosition.y + pulse * 0.25));
        color += rim * vec3(0.9, 0.35, 0.75);
        gl_FragColor = vec4(color, 0.94);
      }
    `,
    transparent: true,
  }), [color]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    mesh.current.rotation.y += delta * 0.18;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.16;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.045;
    mesh.current.scale.setScalar(scale * pulse);
    if (shell.current) {
      shell.current.rotation.x += delta * 0.12;
      shell.current.rotation.y -= delta * 0.16;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.1} floatIntensity={0.25} rotationIntensity={0.18}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.12, 5]} />
          <primitive object={material} attach="material" />
        </mesh>
        <mesh ref={shell} scale={1.3}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[0.8, 0.3, 0.2]} scale={1.58}>
          <torusGeometry args={[1.1, 0.012, 8, 120]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

function Portal({ portal, onOpen }) {
  const ring = useRef();
  const orb = useRef();
  useFrame((state, delta) => {
    if (ring.current) {
      ring.current.rotation.z += delta * 0.12;
      ring.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.18;
    }
    if (orb.current) orb.current.rotation.y += delta * 0.5;
  });
  return (
    <group position={portal.position}>
      <mesh ref={ring} onClick={(e) => { e.stopPropagation(); onOpen(portal.id); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
        <torusGeometry args={[1.05, 0.075, 16, 100]} />
        <meshStandardMaterial color={portal.color} emissive={portal.color} emissiveIntensity={1.8} metalness={0.75} roughness={0.18} />
      </mesh>
      <mesh ref={orb} onClick={(e) => { e.stopPropagation(); onOpen(portal.id); }}>
        <sphereGeometry args={[0.78, 48, 48]} />
        <meshPhysicalMaterial color={portal.color} emissive={portal.color} emissiveIntensity={0.3} roughness={0.12} metalness={0.25} transmission={0.28} thickness={1.5} />
      </mesh>
      <pointLight color={portal.color} intensity={5} distance={5} />
      <Sparkles count={24} scale={3.4} size={2} speed={0.35} color={portal.color} />
    </group>
  );
}

function Environment({ position, color, kind = 0 }) {
  const group = useRef();
  const artifact = useRef();
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (0.025 + kind * 0.012);
    if (artifact.current) {
      const t = state.clock.elapsedTime;
      artifact.current.rotation.x += delta * 0.32;
      artifact.current.rotation.y += delta * 0.48;
      const morph = 0.72 + (Math.sin(t * 0.8 + kind) + 1) * 0.18;
      artifact.current.scale.set(morph, 1.2 - morph * 0.25, morph);
    }
  });
  return (
    <group ref={group} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
        <ringGeometry args={[3.8, 4.5, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
      <group ref={artifact} position={[kind % 2 ? -2.6 : 2.6, 1.2, -0.8]}>
        {kind % 2 === 0 ? (
          <mesh>
            <octahedronGeometry args={[0.72, 1]} />
            <meshPhysicalMaterial color={color} metalness={0.9} roughness={0.16} clearcoat={1} emissive={color} emissiveIntensity={0.25} />
          </mesh>
        ) : (
          <mesh>
            <torusKnotGeometry args={[0.52, 0.17, 120, 16]} />
            <meshPhysicalMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.32} />
          </mesh>
        )}
      </group>
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <mesh key={n} position={[Math.cos(n * Math.PI / 3) * 3.2, Math.sin(n * 2.1) * 0.8, Math.sin(n * Math.PI / 3) * 2.6]}>
          <icosahedronGeometry args={[0.13 + (n % 2) * 0.08, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function JourneyScene() {
  const scroll = useScroll();
  const cameraRig = useRef();
  const navigate = useNavigate();

  useFrame((state, delta) => {
    const progress = scroll.offset;
    const targetZ = 7 - progress * 43;
    const targetX = Math.sin(progress * Math.PI * 2) * 0.7;
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 3.2, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, Math.sin(progress * Math.PI * 3) * 0.5, 2, delta);
    state.camera.lookAt(0, 0, state.camera.position.z - 7);
    if (cameraRig.current) cameraRig.current.rotation.z = Math.sin(progress * Math.PI * 2) * 0.025;
  });

  return (
    <group ref={cameraRig}>
      <Stars radius={75} depth={55} count={1700} factor={3} saturation={0.65} fade speed={0.35} />
      <ambientLight intensity={0.42} />
      <pointLight position={[0, 3, 4]} intensity={38} color="#ff4aa8" distance={25} />
      <pointLight position={[3, -4, -17]} intensity={32} color="#7850ff" distance={24} />
      <pointLight position={[-3, 2, -30]} intensity={34} color="#398dff" distance={24} />
      <Environment position={[0, 0, 0]} color="#ff168f" kind={0} />
      <Environment position={[0, 0, -12]} color="#9b72ff" kind={1} />
      <Environment position={[0, 0, -22]} color="#48a9ff" kind={2} />
      <Environment position={[0, 0, -32]} color="#ff8bca" kind={3} />
      <EnergyCore color="#ff168f" position={[0, 0, 0]} scale={1.25} />
      <EnergyCore color="#9b72ff" position={[0, 0, -12]} scale={1.05} />
      <EnergyCore color="#48a9ff" position={[0, 0, -22]} scale={1.12} />
      <EnergyCore color="#ff8bca" position={[0, 0, -32]} scale={1.0} />
      {portals.map((portal) => <Portal key={portal.id} portal={portal} onOpen={navigate} />)}
      {[-5, -15, -25, -36].map((z, i) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.5 + i * 0.35, 0.012, 8, 160]} />
          <meshBasicMaterial color={i % 2 ? '#9b72ff' : '#ff168f'} transparent opacity={0.24} />
        </mesh>
      ))}
    </group>
  );
}

export default function UniverseJourney() {
  return (
    <section className="journey-section" id="journey">
      <div className="journey-heading">
        <small className="mono pink">[ 03 — THE IMMERSIVE EXPEDITION ]</small>
        <h2>SCROLL INTO<br /><em>THE UNKNOWN.</em></h2>
        <p>Move through connected dimensions. Tap a glowing portal to enter its world.</p>
      </div>
      <div className="journey-canvas" aria-label="Scroll-controlled 3D journey through four interactive portals">
        <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <ScrollControls pages={4} damping={0.22}>
            <JourneyScene />
          </ScrollControls>
        </Canvas>
        <div className="journey-hint mono"><span>↑ ↓</span> SCROLL TO TRAVEL <span>·</span> TAP A PORTAL</div>
        <div className="journey-mobile mono">SWIPE UP TO TRAVEL THROUGH WORLDS</div>
      </div>
      <div className="journey-links">
        {portals.map((p, i) => (
          <a href={`/${p.id}`} key={p.id}><span>0{i + 1}</span>{p.title}<b>↗</b></a>
        ))}
      </div>
    </section>
  );
}

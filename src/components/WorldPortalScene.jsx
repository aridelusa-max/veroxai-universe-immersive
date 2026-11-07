import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function WorldObject({ color }) {
  const ref = useRef();
  const shader = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } },
    vertexShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPos;
      void main(){
        vNormal=normalize(normalMatrix*normal);
        vec3 p=position;
        p+=normal*(sin(position.y*5.0+uTime)*cos(position.x*4.0-uTime*.7))*.12;
        vPos=p;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }`,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vPos;
      void main(){
        float rim=pow(1.0-abs(dot(normalize(vNormal),vec3(0.0,0.0,1.0))),2.0);
        float bands=.5+.5*sin(vPos.y*5.0+uTime*1.4);
        vec3 c=mix(uColor,vec3(.55,.35,1.0),bands*.48)+rim*.7;
        gl_FragColor=vec4(c,1.0);
      }`,
  }), [color]);
  useFrame((state, delta) => {
    shader.uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y += delta * .2;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * .3) * .18;
      const pulse = 1 + Math.sin(state.clock.elapsedTime) * .055;
      ref.current.scale.set(pulse, 1 / pulse, pulse);
    }
  });
  return <group>
    <Float speed={1.2} floatIntensity={.3} rotationIntensity={.25}>
      <mesh ref={ref}><icosahedronGeometry args={[1.45, 5]} /><primitive object={shader} attach="material" /></mesh>
      <mesh scale={1.8} rotation={[.8,.2,.3]}><torusGeometry args={[1.15,.014,8,140]} /><meshBasicMaterial color={color} transparent opacity={.8}/></mesh>
      <mesh scale={2.1} rotation={[1.2,.5,-.4]}><torusGeometry args={[1.15,.008,8,140]} /><meshBasicMaterial color="#b9a4ff" transparent opacity={.6}/></mesh>
    </Float>
    <Stars radius={9} depth={5} count={900} factor={2.2} fade speed={.4}/>
    <Sparkles count={110} scale={7} size={2.4} speed={.35} color={color}/>
    <ambientLight intensity={.65}/>
    <pointLight position={[3,3,4]} color={color} intensity={32} distance={12}/>
    <pointLight position={[-4,-2,2]} color="#8d63ff" intensity={22} distance={10}/>
    <directionalLight position={[2,5,5]} intensity={1.5}/>
  </group>;
}

export default function WorldPortalScene({ color = '#ff168f' }) {
  return <div className="world-scene"><Canvas camera={{position:[0,0,6.5],fov:42}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}}><color attach="background" args={['#08070a']}/><fog attach="fog" args={['#08070a',7,14]}/><WorldObject color={color}/></Canvas></div>;
}

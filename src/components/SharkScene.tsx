'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Shark() {
  const { scene } = useGLTF('/models/shark.glb');
  const sharkRef = useRef<THREE.Group>(null);

  // Позиция и движение
  const posRef = useRef(new THREE.Vector3(0, 0, -8));
  const targetRef = useRef(new THREE.Vector3(2, 0, -6));
  const directionRef = useRef(1);
  const swimPhaseRef = useRef(0);

  // Инициализация при загрузке
  useEffect(() => {
    if (sharkRef.current) {
      posRef.current.set(0, 0, -8);
      targetRef.current.set(2, 0, -6);
    }
  }, []);

  // Анимация плавания - выполняется каждый кадр
  useFrame((state, delta) => {
    if (!sharkRef.current) return;

    const shark = sharkRef.current;
    const time = state.clock.elapsedTime;
    swimPhaseRef.current += delta * 2;

    // Непрерывное плавание - движение по синусоиде
    const swimX = Math.sin(time * 0.5) * 3;
    const swimY = Math.sin(time * 0.3) * 0.5;
    const swimZ = -8 + Math.sin(time * 0.2) * 1;

    shark.position.set(swimX, swimY, swimZ);

    // Поворот по направлению движения
    const targetX = swimX + Math.cos(time * 0.5) * 2;
    shark.lookAt(targetX, swimY, swimZ + 1);

    // Покачивание хвоста (вращение вокруг Z)
    shark.rotation.z += delta * 3;

    // Плавное покачивание тела
    shark.rotation.x = Math.sin(time * 0.8) * 0.1;
    shark.rotation.y = Math.PI + Math.sin(time * 0.5) * 0.2;
  });

  // Клонируем сцену
  const clonedScene = scene.clone();

  return (
    <group ref={sharkRef} position={[0, 0, -8]}>
      <primitive
        object={clonedScene}
        scale={0.6}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 0, -8]}>
      <boxGeometry args={[3, 1.5, 1]} />
      <meshStandardMaterial color="#4488cc" wireframe />
    </mesh>
  );
}

// Частицы
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  const particleCount = 300;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = -3 - Math.random() * 15;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#66aaff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function SharkScene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Подводный фон */}
          <color attach="background" args={['#000a18']} />
          <fog attach="fog" args={['#000a18', 5, 20]} />

          {/* Световые лучи сверху */}
          <directionalLight position={[0, 10, 5]} intensity={0.6} color="#1a3a5c" />
          <ambientLight intensity={0.4} color="#0a1a2a" />
          <pointLight position={[3, 4, -3]} intensity={0.5} color="#004488" distance={12} />
          <pointLight position={[-3, 2, -5]} intensity={0.4} color="#002244" distance={10} />

          {/* Акула с анимацией */}
          <Shark />

          {/* Частицы */}
          <Particles />

          {/* Пузыри */}
          <Stars
            radius={25}
            depth={15}
            count={400}
            factor={3}
            saturation={0}
            fade
            speed={0.3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Предзагрузка
useGLTF.preload('/models/shark.glb');
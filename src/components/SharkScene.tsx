'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Shark() {
  const { scene, animations } = useGLTF('/models/shark.glb');
  const sharkRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const targetRef = useRef(new THREE.Vector3(0, -2, -8));
  const isAttackingRef = useRef(false);
  const attackPhaseRef = useRef<'idle' | 'approach' | 'retreat'>('idle');
  const lastTargetChangeRef = useRef(0);

  // Настройка анимаций
  useEffect(() => {
    if (animations.length > 0 && sharkRef.current) {
      mixerRef.current = new THREE.AnimationMixer(sharkRef.current);
      animations.forEach((clip) => {
        const action = mixerRef.current?.clipAction(clip);
        action?.play();
      });
    }
  }, [animations]);

  // Инициализация позиции
  useEffect(() => {
    if (sharkRef.current) {
      sharkRef.current.position.set(0, -2, -8);
      sharkRef.current.rotation.set(0, Math.PI, 0);
    }
  }, []);

  // Основной цикл анимации
  useFrame((state, delta) => {
    if (!sharkRef.current) return;

    // Обновление анимации
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    const shark = sharkRef.current;
    const target = targetRef.current;
    const now = state.clock.elapsedTime;

    // Меняем цель каждые 3-5 секунд
    if (now - lastTargetChangeRef.current > 3 + Math.random() * 2) {
      lastTargetChangeRef.current = now;

      // 30% шанс атаки
      if (Math.random() < 0.3 && attackPhaseRef.current === 'idle') {
        isAttackingRef.current = true;
        attackPhaseRef.current = 'approach';
        // Цель - ближе к камере
        target.set(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1,
          -3
        );
      } else {
        // Обычное случайное движение
        attackPhaseRef.current = 'idle';
        isAttackingRef.current = false;
        target.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 2,
          -5 - Math.random() * 4
        );
      }
    }

    // Плавное движение к цели
    const speed = isAttackingRef.current ? 0.03 : 0.008;
    shark.position.lerp(target, speed);

    // Поворот по направлению движения
    if (shark.position.distanceTo(target) > 0.1) {
      const lookTarget = new THREE.Vector3(target.x, target.y, target.z + 3);
      shark.lookAt(lookTarget);
    }

    // Плавное покачивание
    shark.rotation.z = Math.sin(now * 0.8) * 0.1;
    shark.rotation.x = Math.sin(now * 0.5) * 0.05 + 0.1;
  });

  // Клонируем сцену для анимаций
  const clonedScene = scene.clone();

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <primitive
        ref={sharkRef}
        object={clonedScene}
        scale={0.5}
        position={[0, -2, -8]}
        rotation={[0, Math.PI, 0]}
      />
    </Float>
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, -2, -8]}>
      <boxGeometry args={[2, 1, 0.5]} />
      <meshStandardMaterial color="#4488cc" wireframe />
    </mesh>
  );
}

// Частицы (подводный планктон)
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = -5 - Math.random() * 15;
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
        size={0.03}
        color="#88ccff"
        transparent
        opacity={0.6}
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
          {/* Тёмно-синий подводный фон */}
          <color attach="background" args={['#001122']} />
          <fog attach="fog" args={['#001122', 3, 18]} />

          {/* Освещение */}
          <ambientLight intensity={0.3} color="#224466" />
          <directionalLight
            position={[5, 10, 2]}
            intensity={0.8}
            color="#4488aa"
          />
          <pointLight
            position={[0, 5, -5]}
            intensity={0.5}
            color="#00aaff"
            distance={15}
          />
          <pointLight
            position={[-5, -3, -8]}
            intensity={0.3}
            color="#004466"
            distance={10}
          />

          {/* Акула */}
          <Shark />

          {/* Подводные частицы */}
          <Particles />

          {/* Звёзды (как подводные пузыри) */}
          <Stars
            radius={20}
            depth={10}
            count={300}
            factor={2}
            saturation={0}
            fade
            speed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Предварительная загрузка модели
useGLTF.preload('/models/shark.glb');
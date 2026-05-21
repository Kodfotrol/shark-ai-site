'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Shark() {
  const { scene, animations } = useGLTF('/models/shark.glb');
  const sharkRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  
  // Состояние для анимации
  const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, -2, -8));
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackPhase, setAttackPhase] = useState<'idle' | 'approach' | 'retreat'>('idle');

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

  // Хаотичное движение
  useFrame((state, delta) => {
    if (!sharkRef.current) return;

    // Обновление анимации
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    const currentPos = sharkRef.current.position;
    const target = targetPos;

    // Плавное движение к цели
    currentPos.lerp(target, 0.015);

    // Достиг цели - выбираем новую
    if (currentPos.distanceTo(target) < 0.5) {
      // 30% шанс атаки
      if (Math.random() < 0.3 && attackPhase === 'idle') {
        setIsAttacking(true);
        setAttackPhase('approach');
        // Резко приближаем к камере (но не близко - на заднем плане)
        setTargetPos(new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 2,
          -5 // Все ещё на заднем плане
        ));
      } else {
        // Случайная позиция на заднем плане
        setTargetPos(new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 3,
          -6 - Math.random() * 4 // Задний план: z от -6 до -10
        ));
      }
    }

    // Поворот акулы по направлению движения
    if (currentPos.distanceTo(target) > 0.1) {
      const lookTarget = new THREE.Vector3(
        target.x,
        target.y,
        target.z + 2
      );
      sharkRef.current.lookAt(lookTarget);
    }

    // Плавное покачивание
    sharkRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    sharkRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
  });

  // Клонируем сцену для анимаций
  const clonedScene = scene.clone();

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <primitive 
        ref={sharkRef} 
        object={clonedScene} 
        scale={0.6} 
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

          {/* Акула на заднем плане */}
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
'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, OrbitControls, Float } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

interface SharkProps {
  onLoad?: () => void;
}

function Shark({ onLoad }: SharkProps) {
  const gltf = useLoader(GLTFLoader, '/models/shark.glb');
  const sharkRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  
  // Состояние для режима атаки
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackPhase, setAttackPhase] = useState<'idle' | 'approach' | 'bite' | 'retreat'>('idle');
  
  // Целевая позиция для движения
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const currentPosition = useRef(new THREE.Vector3(0, 0, 0));
  
  // Параметры движения
  const speed = useRef(0.015);
  const wanderRadius = 5;
  const attackStartPos = useRef(new THREE.Vector3());
  
  // Уведомляем о загрузке
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  // Настройка анимаций
  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      
      gltf.animations.forEach((clip) => {
        const action = mixerRef.current!.clipAction(clip);
        action.play();
      });
    }
  }, [gltf]);

  // Обновление целевой позиции для блуждания
  const updateTarget = () => {
    targetPosition.current.set(
      (Math.random() - 0.5) * wanderRadius * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * wanderRadius * 2
    );
    targetRotation.current.y = Math.random() * Math.PI * 2;
  };

  // Инициализация целевой позиции
  useEffect(() => {
    updateTarget();
  }, []);

  // Таймер для случайной атаки (30% вероятность)
  useEffect(() => {
    const attackInterval = setInterval(() => {
      if (!isAttacking && Math.random() < 0.3) {
        if (sharkRef.current) {
          attackStartPos.current.copy(sharkRef.current.position);
        }
        setIsAttacking(true);
        setAttackPhase('approach');
        
        // Завершение атаки через 3 секунды
        setTimeout(() => {
          setIsAttacking(false);
          setAttackPhase('idle');
          updateTarget();
        }, 3000);
      }
    }, 2000);
    
    return () => clearInterval(attackInterval);
  }, [isAttacking]);

  useFrame((state, delta, xrFrame) => {
    if (!sharkRef.current) return;

    // Обновление анимаций
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    const shark = sharkRef.current;
    const lerpFactor = 0.02;

    if (isAttacking) {
      // Режим атаки
      if (attackPhase === 'approach') {
        // Резко приближается к камере
        const cameraPos = state.camera.position;
        const direction = new THREE.Vector3();
        direction.subVectors(cameraPos, shark.position).normalize();
        
        // Целевая позиция - перед камерой
        const attackTarget = cameraPos.clone().multiplyScalar(0.4);
        
        shark.position.lerp(attackTarget, 0.08);
        
        // Поворот к камере
        shark.lookAt(cameraPos);
        
        setTimeout(() => {
          setAttackPhase('bite');
        }, 1000);
        
      } else if (attackPhase === 'bite') {
        // Пасть открыта - можно добавить анимацию
        const cameraPos = state.camera.position;
        shark.lookAt(cameraPos);
        
      } else if (attackPhase === 'retreat') {
        // Отдаляется
        shark.position.lerp(attackStartPos.current, 0.05);
      }
    } else {
      // Обычное блуждание
      const distToTarget = shark.position.distanceTo(targetPosition.current);
      
      if (distToTarget < 0.5) {
        updateTarget();
      }

      // Плавное движение к цели
      shark.position.lerp(targetPosition.current, speed.current);
      
      // Поворот по направлению движения
      const lookTarget = targetPosition.current.clone();
      const currentLook = new THREE.Vector3();
      shark.getWorldDirection(currentLook);
      
      const targetDir = new THREE.Vector3();
      targetDir.subVectors(lookTarget, shark.position).normalize();
      
      // Интерполяция поворота
      const targetQuaternion = new THREE.Quaternion();
      const up = new THREE.Vector3(0, 1, 0);
      const matrix = new THREE.Matrix4();
      matrix.lookAt(new THREE.Vector3(0, 0, 0), targetDir, up);
      targetQuaternion.setFromRotationMatrix(matrix);
      
      shark.quaternion.slerp(targetQuaternion, 0.02);
    }
  });

  return (
    <primitive 
      object={gltf.scene} 
      ref={sharkRef}
      scale={0.8}
      rotation={[0, Math.PI, 0]}
    />
  );
}

// Компонент сцены с фоном и освещением
function Scene({ onLoad }: { onLoad?: () => void }) {
  return (
    <>
      {/* Подводный фон - тёмно-синий */}
      <color attach="background" args={['#001a33']} />
      
      {/* Туман для глубины */}
      <fog attach="fog" args={['#001a33', 5, 25]} />
      
      {/* Основной свет (солнечные лучи сверху) */}
      <ambientLight intensity={0.3} color="#4488cc" />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.5} 
        color="#88ccff"
        castShadow
      />
      
      {/* Дополнительные лучи света для подводной атмосферы */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={2}
        color="#00aaff"
        castShadow
      />
      
      {/* Боковые подсветки */}
      <pointLight position={[-5, 3, 0]} intensity={0.5} color="#0066aa" />
      <pointLight position={[5, 3, 0]} intensity={0.5} color="#0066aa" />
      
      {/* Свет снизу (отражение от дна) */}
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#003366" />
      
      {/* Акула внутри Float для плавного движения */}
      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.3}
      >
        <Shark onLoad={onLoad} />
      </Float>
      
      {/* Контроллеры камеры */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Компонент загрузки
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#001a33]">
      <div className="text-white text-xl animate-pulse">
        Загрузка акулы...
      </div>
    </div>
  );
}

// Главный экспорт
export default function SharkScene() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-0">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          shadows
        >
          <Scene onLoad={() => setLoaded(true)} />
        </Canvas>
      </Suspense>
    </div>
  );
}
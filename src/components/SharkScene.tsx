'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

interface SharkProps {
  onLoad?: () => void;
}

function Shark({ onLoad }: SharkProps) {
  const gltf = useLoader(GLTFLoader, '/models/shark.glb');
  const sharkRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackPhase, setAttackPhase] = useState<'idle' | 'approach' | 'bite' | 'retreat'>('idle');
  
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const currentPosition = useRef(new THREE.Vector3(0, 0, 0));
  
  const speed = useRef(0.015);
  const wanderRadius = 5;
  const attackStartPos = useRef(new THREE.Vector3());
  
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      
      gltf.animations.forEach((clip) => {
        const action = mixerRef.current!.clipAction(clip);
        action.play();
      });
    }
  }, [gltf]);

  const updateTarget = () => {
    targetPosition.current.set(
      (Math.random() - 0.5) * wanderRadius * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * wanderRadius * 2
    );
    targetRotation.current.y = Math.random() * Math.PI * 2;
  };

  useEffect(() => {
    updateTarget();
  }, []);

  useEffect(() => {
    const attackInterval = setInterval(() => {
      if (!isAttacking && Math.random() < 0.3) {
        if (sharkRef.current) {
          attackStartPos.current.copy(sharkRef.current.position);
        }
        setIsAttacking(true);
        setAttackPhase('approach');
        speed.current = 0.04;
        
        setTimeout(() => {
          setAttackPhase('bite');
        }, 2000);
        
        setTimeout(() => {
          setAttackPhase('retreat');
          speed.current = 0.03;
          
          setTimeout(() => {
            setIsAttacking(false);
            setAttackPhase('idle');
            speed.current = 0.015;
            updateTarget();
          }, 2000);
        }, 2500);
      }
    }, 5000);
    
    return () => clearInterval(attackInterval);
  }, [isAttacking]);

  useFrame((state, delta) => {
    if (!sharkRef.current) return;
    
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    const pos = sharkRef.current.position;
    const dist = pos.distanceTo(targetPosition.current);
    
    if (dist < 0.5 && !isAttacking) {
      updateTarget();
    }
    
    const dir = new THREE.Vector3()
      .subVectors(targetPosition.current, pos)
      .normalize();
    
    pos.add(dir.multiplyScalar(speed.current));
    
    if (attackPhase === 'approach') {
      pos.z = THREE.MathUtils.lerp(pos.z, 2, 0.02);
    } else if (attackPhase === 'retreat') {
      pos.z = THREE.MathUtils.lerp(pos.z, -8, 0.02);
    }
    
    const lookTarget = new THREE.Vector3()
      .copy(pos)
      .add(dir);
    sharkRef.current.lookAt(lookTarget);
  });

  return (
    <primitive 
      object={gltf.scene} 
      ref={sharkRef}
      scale={1.5}
      rotation={[0, Math.PI, 0]}
    />
  );
}

function LoadingFallback() {
  return null;
}

export default function SharkScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a9eff" />
        
        <Suspense fallback={<LoadingFallback />}>
          <Shark />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
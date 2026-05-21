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

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    const shark = sharkRef.current;
    const lerpFactor = 0.02;

    if (isAttacking) {
      if (attackPhase === 'approach') {
        const cameraPos = state.camera.position;
        const direction = new THREE.Vector3();
        direction.subVectors(cameraPos, shark.position).normalize();
        
        shark.position.add(direction.multiplyScalar(speed.current * 2));
        shark.lookAt(cameraPos);
      } else if (attackPhase === 'bite') {
        // Bite animation
      } else if (attackPhase === 'retreat') {
        const direction = new THREE.Vector3();
        direction.subVectors(attackStartPos.current, shark.position).normalize();
        shark.position.add(direction.multiplyScalar(speed.current));
      }
    } else {
      // WANDER BEHAVIOR
      const dist = shark.position.distanceTo(targetPosition.current);
      
      if (dist < 0.5) {
        updateTarget();
      } else {
        const direction = new THREE.Vector3();
        direction.subVectors(targetPosition.current, shark.position).normalize();
        shark.position.add(direction.multiplyScalar(speed.current));
        
        // Smooth rotation
        const targetQuat = new THREE.Quaternion();
        const lookMatrix = new THREE.Matrix4();
        lookMatrix.lookAt(shark.position, targetPosition.current, shark.up);
        targetQuat.setFromRotationMatrix(lookMatrix);
        shark.quaternion.slerp(targetQuat, lerpFactor);
      }
    }
  });

  return (
    <primitive 
      object={gltf.scene} 
      ref={sharkRef}
      scale={3} 
      position={[0, 0, 0]}
    />
  );
}

function Loading() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" wireframe />
    </mesh>
  );
}

export default function SharkScene() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#001420' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00ffff" />
        
        <Suspense fallback={<Loading />}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Shark onLoad={() => setLoaded(true)} />
          </Float>
          <Environment preset="night" />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={20}
          autoRotate={!loaded}
          autoRotateSpeed={0.5}
        />
        
        {/* Ocean floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#0a1520" />
        </mesh>
        
        {/* Caustics effect */}
        <fog attach="fog" args={['#001420', 5, 30]} />
      </Canvas>
    </div>
  );
}
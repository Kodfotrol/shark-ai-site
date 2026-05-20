'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, Vector3 } from 'three';

const Shark = () => {
  const gltf = useLoader(GLTFLoader, '/models/shark.glb');
  const mixer = useRef<AnimationMixer>();
  const target = useMemo(() => new Vector3(), []);
  const position = useRef(new Vector3(0, 0, 0));
  const velocity = useRef(new Vector3());
  const attackMode = useRef(false);
  const attackCooldown = useRef(0);

  useEffect(() => {
    if (gltf.animations.length) {
      mixer.current = new AnimationMixer(gltf.scene);
      mixer.current.clipAction(gltf.animations[0]).play();
    }
    newTarget();
    const interval = setInterval(newTarget, 3000);
    return () => clearInterval(interval);
  }, []);

  const newTarget = () => {
    target.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 6 - 5
    );
    if (Math.random() < 0.3 && attackCooldown.current <= 0) {
      attackMode.current = true;
      attackCooldown.current = 120;
      target.set(0, 0, 1);
    }
  };

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta);
    const pos = position.current;
    const vel = velocity.current;
    const dir = new Vector3().copy(target).sub(pos).normalize();
    vel.lerp(dir, 0.05);
    pos.add(vel.clone().multiplyScalar(delta * 2));
    gltf.scene.position.copy(pos);
    gltf.scene.lookAt(pos.clone().add(vel));
    if (attackMode.current && pos.distanceTo(target) < 0.5) {
      attackMode.current = false;
    }
    if (attackCooldown.current > 0) attackCooldown.current--;
  });

  return <primitive object={gltf.scene} />;
};

export default function SharkScene() {
  return (
    <div className="fixed inset-0 z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Shark />
      </Canvas>
    </div>
  );
}
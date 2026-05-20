'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SharkScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Создание сцены
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#001122');

    // Камера
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 1, 8);

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Освещение
    const ambientLight = new THREE.AmbientLight('#4488cc', 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Создание группы акулы
    const shark = new THREE.Group();
    scene.add(shark);

    // Тело акулы
    const bodyGeometry = new THREE.ConeGeometry(1, 4, 8, 4);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: '#6B7B8D', flatShading: true });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    body.scale.set(0.5, 0.8, 1);
    shark.add(body);

    // Плавники
    const finGeometry = new THREE.ConeGeometry(0.5, 1.5, 4, 2);
    const finMaterial = new THREE.MeshPhongMaterial({ color: '#5A6B7C', flatShading: true });
    const fin = new THREE.Mesh(finGeometry, finMaterial);
    fin.position.set(0, 1, 0);
    fin.rotation.x = Math.PI / 2;
    shark.add(fin);

    // Хвост
    const tailGeometry = new THREE.ConeGeometry(0.6, 1.5, 4, 2);
    const tailMaterial = new THREE.MeshPhongMaterial({ color: '#4A5B6C', flatShading: true });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, -2.5, 0);
    tail.rotation.x = Math.PI / 2;
    shark.add(tail);

    // Глаза
    const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 'white' });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.3, 1.8, 0.4);
    shark.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.3, 1.8, 0.4);
    shark.add(rightEye);

    // Параметры движения
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let attackMode = false;
    let attackCooldown = 0;
    let mouthOpen = 0;

    // Функция новой цели
    const newTarget = () => {
      targetX = (Math.random() - 0.5) * 8;
      targetY = (Math.random() - 0.5) * 4;
      targetZ = (Math.random() - 0.5) * 3 + 5;
      if (Math.random() < 0.3 && attackCooldown <= 0) {
        attackMode = true;
        attackCooldown = 120;
        targetX = 0;
        targetY = 0;
        targetZ = 6;
      }
    };
    newTarget();
    setInterval(newTarget, 3000);

    // Анимация
    const animate = () => {
      requestAnimationFrame(animate);

      // Плавное движение к цели
      const dx = targetX - shark.position.x;
      const dy = targetY - shark.position.y;
      const dz = targetZ - shark.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist > 0.1) {
        shark.position.x += dx * 0.02;
        shark.position.y += dy * 0.02;
        shark.position.z += dz * 0.02;
      }

      // Поворот к направлению движения
      shark.lookAt(targetX, targetY, targetZ);

      // Покачивание хвоста
      tail.rotation.y = Math.sin(Date.now() * 0.01) * 0.5;

      // Открытие пасти при атаке
      if (attackMode) {
        mouthOpen = Math.min(1, mouthOpen + 0.02);
        if (mouthOpen >= 1) {
          attackMode = false;
        }
      } else {
        mouthOpen = Math.max(0, mouthOpen - 0.01);
      }
      body.scale.z = 1 + mouthOpen * 0.3;

      // Кулдаун атаки
      if (attackCooldown > 0) attackCooldown--;

      renderer.render(scene, camera);
    };
    animate();

    // Ресайз
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-10" />;
};

export default SharkScene;
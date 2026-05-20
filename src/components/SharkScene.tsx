'use client';

import { useEffect, useRef } from 'react';

const SharkScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Параметры акулы
    let shark = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: 1.2,
      vy: 0.4,
      direction: 1, // 1 = right, -1 = left
      targetX: canvas.width / 2,
      targetY: canvas.height / 2,
      mouthOpen: 0, // 0..1
      attackMode: false,
      attackCooldown: 0,
    };

    // Функция для смены цели
    const newTarget = () => {
      shark.targetX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      shark.targetY = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
      // Иногда включаем режим атаки
      if (Math.random() < 0.3 && shark.attackCooldown <= 0) {
        shark.attackMode = true;
        shark.attackCooldown = 120;
      }
    };
    newTarget();
    setInterval(newTarget, 3000 + Math.random() * 2000);

    // Рисование акулы
    const drawShark = () => {
      ctx.save();
      ctx.translate(shark.x, shark.y);
      ctx.scale(shark.direction, 1);

      // Хвост
      ctx.beginPath();
      ctx.moveTo(-70, 0);
      ctx.lineTo(-100, -25 + Math.sin(Date.now() * 0.01) * 5);
      ctx.lineTo(-100, 25 + Math.sin(Date.now() * 0.01) * 5);
      ctx.closePath();
      ctx.fillStyle = '#6B7B8D';
      ctx.fill();

      // Тело
      ctx.beginPath();
      ctx.moveTo(70, 0);
      ctx.quadraticCurveTo(30, -35, -30, -25);
      ctx.lineTo(-70, -5);
      ctx.lineTo(-70, 5);
      ctx.quadraticCurveTo(-30, 30, 30, 35);
      ctx.quadraticCurveTo(60, 28, 70, 0);
      ctx.fillStyle = '#5A6B7C';
      ctx.fill();
      ctx.strokeStyle = '#3A4B5C';
      ctx.stroke();

      // Плавники
      ctx.beginPath();
      ctx.moveTo(20, -30);
      ctx.quadraticCurveTo(10, -55, -10, -40);
      ctx.quadraticCurveTo(0, -25, 15, -15);
      ctx.fillStyle = '#4A5B6C';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(20, 30);
      ctx.quadraticCurveTo(10, 55, -10, 40);
      ctx.quadraticCurveTo(0, 25, 15, 15);
      ctx.fill();

      // Глаз
      ctx.beginPath();
      ctx.arc(30, -8, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(32, -8, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();

      // Пасть
      const mouthY = 5 + shark.mouthOpen * 12;
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.quadraticCurveTo(60, mouthY, 30, mouthY);
      ctx.lineTo(10, mouthY);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Зубы
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(45 - i * 8, 0);
        ctx.lineTo(45 - i * 8 - 3, mouthY * 0.7);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
    };

    // Главный цикл анимации
    const animate = () => {
      // Обновление позиции
      const dx = shark.targetX - shark.x;
      const dy = shark.targetY - shark.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        shark.x += (dx / dist) * shark.vx;
        shark.y += (dy / dist) * shark.vy;
      }

      // Направление
      if (dx > 0) shark.direction = 1;
      else if (dx < 0) shark.direction = -1;

      // Открытие пасти
      if (shark.attackMode) {
        shark.mouthOpen = Math.min(1, shark.mouthOpen + 0.02);
        if (shark.mouthOpen >= 1) {
          shark.attackMode = false;
        }
      } else {
        shark.mouthOpen = Math.max(0, shark.mouthOpen - 0.01);
      }

      // Кулдаун атаки
      if (shark.attackCooldown > 0) shark.attackCooldown--;

      // Отрисовка
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Фон
      ctx.fillStyle = '#001122';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Лучи света
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.2 + i * 150, 0);
        ctx.lineTo(canvas.width * 0.1 + i * 100, canvas.height);
        ctx.stroke();
      }

      drawShark();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-10" />;
};

export default SharkScene;
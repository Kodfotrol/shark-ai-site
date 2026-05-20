'use client';

import { useEffect, useRef } from 'react';

interface SharkProps {
  className?: string;
}

export default function Shark({ className = '' }: SharkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Shark state
    const shark = {
      x: -200,
      y: Math.random() * (window.innerHeight - 200) + 100,
      speed: 1.5 + Math.random() * 1.5,
      scale: 0.8 + Math.random() * 0.4,
      tailPhase: 0,
      bodyPhase: 0,
      direction: 1, // 1 = right, -1 = left
    };

    // Animation loop
    let animationId: number;

    const drawShark = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x, y, speed, scale, tailPhase, bodyPhase, direction } = shark;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(direction * scale, scale);

      // Body color - dark gray with gradient
      const bodyGradient = ctx.createLinearGradient(0, -30, 0, 30);
      bodyGradient.addColorStop(0, '#4a5568');
      bodyGradient.addColorStop(0.5, '#2d3748');
      bodyGradient.addColorStop(1, '#1a202c');

      // Main body (torpedo shape)
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.bezierCurveTo(60, -25, 20, -35, -60, -20);
      ctx.bezierCurveTo(-100, -10, -120, 0, -100, 10);
      ctx.bezierCurveTo(-60, 20, 20, 35, 60, 25);
      ctx.closePath();
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      // Underbelly (lighter)
      ctx.beginPath();
      ctx.moveTo(70, 5);
      ctx.bezierCurveTo(40, 20, -20, 25, -60, 15);
      // @ts-ignore
      ctx.bezierCurveTo(-90, 5, -90, 5, -60, -5);
      ctx.bezierCurveTo(-20, -15, 40, -10, 70, -5);
      ctx.closePath();
      ctx.fillStyle = '#a0aec0';
      ctx.fill();

      // Dorsal fin (top fin)
      const finWave = Math.sin(bodyPhase * 2) * 3;
      ctx.beginPath();
      ctx.moveTo(-10, -25);
      ctx.quadraticCurveTo(0, -55 + finWave, 30, -30);
      ctx.quadraticCurveTo(20, -25, 10, -22);
      ctx.closePath();
      ctx.fillStyle = '#4a5568';
      ctx.fill();

      // Tail fin (caudal fin)
      const tailWave = Math.sin(tailPhase) * 15;
      ctx.beginPath();
      ctx.moveTo(-95, 0);
      ctx.quadraticCurveTo(-120, -40 + tailWave, -150, -50 + tailWave);
      ctx.lineTo(-140, 0);
      ctx.lineTo(-150, 50 + tailWave);
      ctx.quadraticCurveTo(-120, 40 + tailWave, -95, 0);
      ctx.closePath();
      ctx.fillStyle = '#4a5568';
      ctx.fill();

      // Pectoral fins (side fins)
      ctx.beginPath();
      ctx.moveTo(10, 20);
      ctx.quadraticCurveTo(30, 45, 50, 35);
      ctx.quadraticCurveTo(40, 25, 20, 18);
      ctx.closePath();
      ctx.fillStyle = '#4a5568';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(10, -20);
      ctx.quadraticCurveTo(30, -45, 50, -35);
      ctx.quadraticCurveTo(40, -25, 20, -18);
      ctx.closePath();
      ctx.fillStyle = '#4a5568';
      ctx.fill();

      // Eye (menacing)
      ctx.beginPath();
      ctx.arc(55, -8, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#1a202c';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(56, -9, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Gills
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(15 + i * 8, -18);
        ctx.lineTo(15 + i * 8, 18);
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Teeth (sharp, dangerous)
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(75 + i * 4, 15);
        ctx.lineTo(77 + i * 4, 25);
        ctx.lineTo(79 + i * 4, 15);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      // Update shark position
      shark.x += shark.speed * shark.direction;
      shark.tailPhase += 0.15;
      shark.bodyPhase += 0.1;

      // Reset when off screen
      if (shark.x > canvas.width + 200) {
        shark.x = -200;
        shark.y = Math.random() * (canvas.height - 200) + 100;
        shark.speed = 1.5 + Math.random() * 1.5;
        shark.scale = 0.8 + Math.random() * 0.4;
      }

      animationId = requestAnimationFrame(drawShark);
    };

    drawShark();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.7 }}
    />
  );
}
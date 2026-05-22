'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Image, Bot, Code } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

function SimpleShark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let vx = 1.5;
    let vy = 0.5;
    let targetX = x;
    let targetY = y;

    const newTarget = () => {
      targetX = Math.random() * canvas.width;
      targetY = Math.random() * canvas.height;
    };
    newTarget();
    setInterval(newTarget, 2000);

    const draw = () => {
      // двигаемся к цели
      x += (targetX - x) * 0.02;
      y += (targetY - y) * 0.02;

      // рисуем серый силуэт акулы
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#556677';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 40, y - 15);
      ctx.lineTo(x - 40, y + 15);
      ctx.closePath();
      ctx.fill();

      // хвост
      ctx.beginPath();
      ctx.moveTo(x - 40, y);
      ctx.lineTo(x - 70, y - 20);
      ctx.lineTo(x - 70, y + 20);
      ctx.closePath();
      ctx.fill();

      // плавник
      ctx.beginPath();
      ctx.moveTo(x - 10, y - 15);
      ctx.lineTo(x - 20, y - 35);
      ctx.lineTo(x - 30, y - 15);
      ctx.closePath();
      ctx.fill();

      // глаз
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x - 5, y - 5, 3, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}

export default function Home() {
  const features = [
    { icon: Image, title: 'енерация изображений', description: 'Создавай уникальные картинки по текстовому описанию.' },
    { icon: Bot, title: 'Telegram-боты', description: 'Создавай ботов для автоматизации общения и бизнеса.' },
    { icon: Code, title: 'Создание сайтов', description: 'енерируй готовые сайты по описанию.' },
  ];

  const steps = [
    { step: '1', title: 'пишите задачу', description: 'апишите, что нужно создать.' },
    { step: '2', title: ' приступает', description: 'ейросеть генерирует результат.' },
    { step: '3', title: 'олучите готовый продукт', description: 'Скачайте код или изображение.' },
  ];

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0 z-0"><SimpleShark /></div>

      <div className="relative z-10">
        <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Shark AI</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10">Создавай изображения, сайты, ботов и приложения с помощью нейросетей — в одном месте.</p>
            <Link href="/generator" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105 shadow-lg">ачать бесплатно <ArrowRight size={20} /></Link>
          </motion.div>
        </section>

        <section className="px-6 py-16 max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-center mb-12">то умеет Shark AI</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <f.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-6 py-16 max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-center mb-12">ак это работает</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-400">{s.step}</div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="text-center text-gray-500 text-sm py-8 border-t border-white/10">
          <div className="flex justify-center gap-4 mb-2">
            <a href="https://github.com/Kodfotrol/shark-ai-site" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://t.me/Shark_AI_bot" className="hover:text-white transition-colors">Telegram</a>
          </div>
          © 2026 Shark AI. се права защищены.
        </footer>
      </div>
    </main>
  );
}

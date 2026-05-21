'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SharkScene from '@/components/SharkScene';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#001122]">
        <div className="text-cyan-400 text-xl animate-pulse">Загрузка...</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Акула на заднем фоне */}
      <SharkScene />
      
      {/* Контент поверх */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🦈</span>
            </div>
            <h1 className="text-2xl font-bold text-white">SharkGen</h1>
          </div>
          <nav className="flex gap-4">
            <Link 
              href="/generator" 
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              Создать
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Создай свою{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                акулу
              </span>
            </h2>
            <p className="text-xl text-cyan-100/80 mb-8 max-w-xl mx-auto">
              Генерируй уникальных акул с помощью AI. Настраивай внешность, стиль и характер. 
              Получай реалистичные 3D-модели за секунды.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/generator"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
              >
                Начать генерацию
              </Link>
              <button 
                className="px-8 py-4 border-2 border-cyan-400/50 text-cyan-100 font-semibold rounded-xl hover:bg-cyan-400/10 transition-colors"
              >
                Посмотреть примеры
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 bg-gradient-to-t from-black/50 to-transparent">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon="🎨"
              title="Полный контроль"
              description="Настраивай цвет, размер, плавники и текстуры"
            />
            <FeatureCard 
              icon="⚡"
              title="Быстрая генерация"
              description="AI создаёт модель за секунды"
            />
            <FeatureCard 
              icon="📦"
              title="Экспорт"
              description="Скачивай в GLB, OBJ или PNG"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="p-6 text-center text-cyan-100/50 text-sm">
          © 2026 SharkGen. Все права защищены.
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6 hover:bg-white/10 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-cyan-100/70 text-sm">{description}</p>
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Image, Bot, Code, Brain } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Shark AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10">
            Создавай изображения, сайты, ботов и приложения с помощью нейросетей — в одном месте.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105 shadow-lg"
          >
            Начать бесплатно <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
        >
          Что умеет Shark AI
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-8 border-t border-white/10">
        © 2026 Shark AI. Все права защищены.
      </footer>
    </main>
  );
}

const features = [
  {
    icon: Image,
    title: 'Генерация изображений',
    description: 'Создавай уникальные картинки по текстовому описанию с помощью DALL‑E, Stable Diffusion и других моделей.',
  },
  {
    icon: Bot,
    title: 'Telegram-боты',
    description: 'Создавай своих ботов для автоматизации общения, бизнеса или развлечений.',
  },
  {
    icon: Code,
    title: 'Веб-сайты',
    description: 'Генерируй готовые HTML/CSS/JS сайты или React-приложения по описанию.',
  },
  {
    icon: Brain,
    title: 'Продвинутые нейросети',
    description: 'Используй Claude, Gemini, DeepSeek и другие модели для написания кода и контента.',
  },
  {
    icon: Sparkles,
    title: 'Итеративная доработка',
    description: 'Отправляй запрос на изменение уже сгенерированного кода — ИИ улучшит его.',
  },
  {
    icon: ArrowRight,
    title: 'API для разработчиков',
    description: 'Подключай наши возможности к своим проектам через простой REST API.',
  },
];
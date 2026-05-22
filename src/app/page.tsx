'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Image, Bot, Code } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const SharkScene = dynamic(() => import('@/components/SharkScene'), { ssr: false });

export default function Home() {
  const features = [
    { icon: Image, title: 'енерация изображений', description: 'Создавай уникальные картинки по текстовому описанию с помощью DALL‑E, Stable Diffusion и других моделей.' },
    { icon: Bot, title: 'Telegram-боты', description: 'Создавай своих ботов для автоматизации общения, бизнеса или развлечений.' },
    { icon: Code, title: 'Создание сайтов', description: 'енерируй готовые HTML/CSS/JS сайты или React-приложения по описанию.' },
  ];

  const steps = [
    { step: '1', title: 'пишите задачу', description: 'росто напишите, что нужно создать — сайт, бота или изображение.' },
    { step: '2', title: ' приступает к работе', description: 'ейросеть анализирует запрос и генерирует результат за считанные секунды.' },
    { step: '3', title: 'олучите готовый продукт', description: 'Скачайте код, изображение или запустите бота — всё готово к использованию.' },
  ];

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <SharkScene />
      </div>

      <div className="relative z-10">
        <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Shark AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10">
              Создавай изображения, сайты, ботов и приложения с помощью нейросетей — в одном месте.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105 shadow-lg"
            >
              ачать бесплатно <ArrowRight size={20} />
            </Link>
          </motion.div>
        </section>

        <section className="px-6 py-16 max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            то умеет Shark AI
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
                <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-6 py-16 max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            ак это работает
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-400">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
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

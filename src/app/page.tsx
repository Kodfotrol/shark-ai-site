'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Image, Bot, Code, Brain } from 'lucide-react';
import Link from 'next/link';
import Shark from '@/components/Shark';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Animated Shark */}
      <Shark />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 relative z-10">
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
            href="/generate"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105 shadow-lg"
          >
            Начать бесплатно <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto relative z-10">
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
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
        >
          Как это работает
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы попробовать?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Присоединяйтесь к тысячам пользователей, которые уже используют Shark AI
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105 shadow-lg"
          >
            Начать генерацию <Sparkles size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 Shark AI. Все права защищены.</p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: <Image size={24} />,
    title: 'Генерация изображений',
    description: 'Создавайте уникальные изображения по текстовому описанию',
  },
  {
    icon: <Code size={24} />,
    title: 'Создание сайтов',
    description: 'Генерируйте готовые сайты и лендинги за секунды',
  },
  {
    icon: <Bot size={24} />,
    title: 'ИИ-боты',
    description: 'Создавайте умных ботов для Telegram и других платформ',
  },
  {
    icon: <Brain size={24} />,
    title: 'Приложения',
    description: 'Генерируйте код мобильных и десктопных приложений',
  },
];

const steps = [
  {
    title: 'Опишите идею',
    description: 'Напишите, что хотите создать, на любом языке',
  },
  {
    title: 'Выберите тип',
    description: 'Укажите — изображение, сайт, бот или приложение',
  },
  {
    title: 'Получите результат',
    description: 'ИИ сгенерирует готовый продукт за несколько секунд',
  },
];
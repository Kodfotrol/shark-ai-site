'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Image, Bot, Code, Brain } from 'lucide-react';
import Link from 'next/link';
import SharkScene from '@/components/SharkScene';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* 3D Shark Scene */}
      <SharkScene />

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
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
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
              transition={{ delay: index * 0.15 }}
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
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готов создавать с помощью AI?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Присоединяйся к тысячам пользователей, которые уже используют Shark AI
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105 shadow-lg"
          >
            Начать бесплатно <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© 2026 Shark AI. Все права защищены.</p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    title: 'Генерация изображений',
    description: 'Создавай потрясающие изображения с помощью нейросетей. Достаточно просто описать идею.',
    icon: <Image className="text-purple-400" size={24} />,
  },
  {
    title: 'Создание ботов',
    description: 'Создавай умных ботов для Telegram и других платформ за считанные минуты.',
    icon: <Bot className="text-purple-400" size={24} />,
  },
  {
    title: 'Написание кода',
    description: 'Получай готовый код для твоих проектов. От фронтенда до бэкенда.',
    icon: <Code className="text-purple-400" size={24} />,
  },
  {
    title: 'AI ассистент',
    description: 'Получай помощь от AI в любое время. Ответы на вопросы, идеи, советы.',
    icon: <Brain className="text-purple-400" size={24} />,
  },
  {
    title: 'Автоматизация',
    description: 'Автоматизируй рутинные задачи и экономь время на важном.',
    icon: <Sparkles className="text-purple-400" size={24} />,
  },
  {
    title: 'Без ограничений',
    description: 'Используй все функции без ограничений. Создавай сколько хочешь.',
    icon: <Sparkles className="text-purple-400" size={24} />,
  },
];

const steps = [
  {
    title: 'Выбери инструмент',
    description: 'Выбери нужный инструмент из списка доступных функций',
  },
  {
    title: 'Опиши задачу',
    description: 'Расскажи AI, что ты хочешь создать или сделать',
  },
  {
    title: 'Получи результат',
    description: 'Получи готовый результат за считанные секунды',
  },
];
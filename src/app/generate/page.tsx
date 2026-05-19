'use client';

import { useState } from 'react';

export default function GeneratePage() {
  const [type, setType] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description: prompt }),
      });
      const data = await res.json();
      setResult(JSON.stringify(data));
    } catch (err: any) {
      setResult('шибка: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Shark AI — енерация</h1>
      <select value={type} onChange={(e) => setType(e.target.value)} className="bg-gray-800 rounded px-3 py-2 mr-2">
        <option value="image">🖼️ зображение</option>
        <option value="web">💻 Сайт</option>
        <option value="bot">🤖 от</option>
        <option value="app">📱 риложение</option>
      </select>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="пишите, что создать..." className="bg-gray-800 rounded px-3 py-2 mr-2 flex-1" />
      <button onClick={handleGenerate} disabled={loading} className="bg-purple-600 hover:bg-purple-700 rounded px-6 py-2 font-semibold">
        {loading ? 'енерация...' : 'Сгенерировать'}
      </button>
      {result && <div className="bg-gray-900 rounded p-4 mt-4 whitespace-pre-wrap">{result}</div>}
    </main>
  );
}

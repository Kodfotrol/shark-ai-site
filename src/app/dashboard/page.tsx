'use client';

import { useEffect, useState } from 'react';

interface GenerationItem {
  id: number;
  type: string;
  description: string;
  status: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<GenerationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${API_URL}/generations`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">📋 стория генераций</h1>
      {loading ? <p>агрузка...</p> : items.length === 0 ? <p>ока ничего не сгенерировано.</p> : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="bg-gray-900 rounded p-3">
              <span className="font-mono text-purple-400">{item.type}</span> — {item.description?.slice(0, 60)}...
              <span className="ml-2 text-gray-400">({item.status})</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

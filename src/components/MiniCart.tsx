'use client';

import { useEffect, useState } from 'react';

export default function MiniCart() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch('/api/cart', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(c => setCount((c.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0)))
      .catch(() => {});
  }, []);
  return <span className="text-xs rounded bg-zinc-900 text-white px-2 py-0.5">{count}</span>;
}
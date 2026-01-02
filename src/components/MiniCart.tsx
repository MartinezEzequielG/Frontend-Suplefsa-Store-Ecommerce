'use client';

import { useEffect, useRef, useState } from 'react';

export default function MiniCart() {
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    fetch('/api/cart', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(c => setCount((c.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (prevCount.current !== count) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 400);
      prevCount.current = count;
      return () => clearTimeout(timeout);
    }
  }, [count]);

  return (
    <span className={animate ? 'animate-bounce' : ''} style={{ position: 'relative', display: 'inline-block' }}>
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
        <path d="M5 6h16l-1.5 9h-13z" />
        <path d="M5 6V4a2 2 0 0 1 2-2h2" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow">
          {count}
        </span>
      )}
    </span>
  );
}
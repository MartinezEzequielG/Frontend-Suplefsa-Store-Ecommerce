'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function MiniCart() {
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(count);

  const loadCount = useCallback(() => {
    fetch('/api/cart', {
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((cart) => {
        const nextCount = (cart.items || []).reduce(
          (sum: number, item: any) => sum + Number(item.quantity || 0),
          0,
        );

        setCount(nextCount);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadCount();
  }, [loadCount]);

  useEffect(() => {
    function onCartUpdated() {
      loadCount();
    }

    function onCartCountUpdated(event: Event) {
      const customEvent = event as CustomEvent<{ count?: number }>;
      const nextCount = Number(customEvent.detail?.count ?? 0);

      if (Number.isFinite(nextCount)) {
        setCount(nextCount);
      } else {
        loadCount();
      }
    }

    window.addEventListener('cart-updated', onCartUpdated);
    window.addEventListener('cart-count-updated', onCartCountUpdated);

    return () => {
      window.removeEventListener('cart-updated', onCartUpdated);
      window.removeEventListener('cart-count-updated', onCartCountUpdated);
    };
  }, [loadCount]);

  useEffect(() => {
    if (prevCount.current !== count) {
      setAnimate(true);

      const timeout = setTimeout(() => setAnimate(false), 400);

      prevCount.current = count;

      return () => clearTimeout(timeout);
    }
  }, [count]);

  function openCartDrawer() {
    window.dispatchEvent(new Event('open-cart-drawer'));
  }

  return (
    <button
      type="button"
      onClick={openCartDrawer}
      aria-label="Abrir carrito"
      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-orange-300 hover:text-orange-600 ${
        animate ? 'animate-bounce' : ''
      }`}
    >
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="9" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
        <path d="M5 6h16l-1.5 9h-13z" />
        <path d="M5 6V4a2 2 0 0 1 2-2h2" />
      </svg>

      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] font-bold text-white shadow">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  );
}
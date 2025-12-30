'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import MiniCart from '@/components/MiniCart';

const POPULAR = [
  'vestidos',
  'tops',
  'jeans',
  'polleras',
  'bikinis',
  'body',
  'accesorios',
];

function Icon({ name, className }: { name: 'search' | 'menu' | 'close'; className?: string }) {
  // SVGs simples, sin librerías
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 4a6 6 0 104.472 10.03l3.749 3.748 1.414-1.414-3.748-3.749A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z"
        />
      </svg>
    );
  }
  if (name === 'menu') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.31 6.3-6.31 1.41 1.42z"
      />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const trimmed = q.trim();
  const searchHref = useMemo(() => `/products?search=${encodeURIComponent(trimmed)}`, [trimmed]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setSearchOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      // enfoque inmediato para UX tipo “command palette”
      setTimeout(() => inputRef.current?.focus(), 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Left: mobile menu */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-sm"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>

          {/* Center: brand */}
          <Link
            href="/"
            className="text-[13px] font-extrabold tracking-[0.28em] text-[var(--text)] uppercase"
            aria-label="Ir al inicio"
          >
            HAMSA
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              onClick={() => setSearchOpen(true)}
              aria-label="Abrir búsqueda"
            >
              <Icon name="search" className="h-5 w-5" />
              <span className="hidden sm:inline">Buscar</span>
              <span className="hidden sm:inline text-xs text-[var(--text-muted)] ml-1">Ctrl K</span>
            </button>

            <Link href="/cart" className="inline-flex items-center gap-2 rounded-lg px-2 py-2">
              <span className="sr-only">Carrito</span>
              <MiniCart />
            </Link>
          </div>
        </div>

        {/* Desktop nav minimal (opcional) */}
        <nav className="hidden md:flex items-center justify-center gap-7 pb-3 text-[13px] text-[var(--text)]">
          <Link href="/products" className="hover:text-[var(--accent)]">Shop</Link>
          <Link href="/about" className="hover:text-[var(--accent)]">Nosotros</Link>
          <Link href="/contact" className="hover:text-[var(--accent)]">Contacto</Link>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[290px] bg-[var(--surface)] border-r border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Menú</p>
              <button
                type="button"
                className="rounded-md px-2 py-2"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-5 grid gap-3 text-sm">
              <Link href="/products" onClick={() => setMobileOpen(false)} className="hover:text-[var(--accent)]">
                Productos
              </Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="hover:text-[var(--accent)]">
                Nosotros
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="hover:text-[var(--accent)]">
                Contacto
              </Link>
              <Link href="/cart" onClick={() => setMobileOpen(false)} className="hover:text-[var(--accent)]">
                Carrito
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Search overlay (estilo “premium”) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Cerrar búsqueda"
            onClick={() => setSearchOpen(false)}
          />

          <div className="absolute left-1/2 top-10 w-[min(720px,92vw)] -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <Icon name="search" className="h-5 w-5 text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar productos…"
                className="w-full bg-transparent outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                ESC
              </button>
            </div>

            <div className="px-4 py-4">
              <p className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-[var(--text-muted)]">
                Búsquedas populares
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {POPULAR.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setQ(t)}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-xs text-[var(--text-muted)]">
                  Tip: Enter para buscar, ESC para cerrar.
                </p>

                <Link
                  href={trimmed ? searchHref : '/products'}
                  onClick={() => setSearchOpen(false)}
                  className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white"
                >
                  Ver resultados
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

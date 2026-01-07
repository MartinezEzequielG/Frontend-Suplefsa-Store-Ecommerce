'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import MiniCart from '@/components/MiniCart';
import { cartEnabledFrom } from '@/lib/checkoutMode';

function Icon({ name, className }: { name: 'search' | 'menu' | 'close'; className?: string }) {
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

type HeaderProps = {
  logoUrl?: string | null;
  brandName?: string;
  checkoutMode?: 'CATALOG' | 'CART';
};

export function Header({ logoUrl, brandName = 'Suplementacion Formosa', checkoutMode }: HeaderProps) {
  const cartEnabled = cartEnabledFrom(checkoutMode);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Shadow al hacer scroll
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Foco automático en buscador
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
    document.body.style.overflow = searchOpen || mobileMenu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen, mobileMenu]);

  // Cerrar overlays al navegar
  useEffect(() => {
    const handler = () => {
      setMobileMenu(false);
      setSearchOpen(false);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const trimmed = q.trim();
  const searchHref = `/products?search=${encodeURIComponent(trimmed)}`;

  return (
    <header
      className={`
        sf-header
        sticky top-0 z-50 border-b
        backdrop-blur-md
        transition-all duration-300
        ${
          scrolled
            ? 'bg-[#0a2540]/98 shadow-xl border-[#1565c0]/30'
            : 'bg-gradient-to-br from-[#1565c0]/95 via-[#2196f3]/90 to-[#42a5f5]/85 border-white/10'
        }
      `}
    >
      <div className="mx-auto max-w-6xl px-2 sm:px-6">
        <div
          className={`
            flex items-center justify-between relative
            ${scrolled ? 'h-16 sm:h-16 lg:h-16' : 'h-20 sm:h-24 lg:h-28'}
          `}
        >
          {/* Hamburguesa a la izquierda */}
          <button
            type="button"
            className="p-2 md:hidden flex items-center justify-center rounded-full hover:bg-white/20 focus:bg-white/25 active:scale-95 transition-all"
            onClick={() => setMobileMenu(true)}
            aria-label="Menú"
            aria-expanded={mobileMenu}
            style={{ minWidth: 44 }}
          >
            <Icon name="menu" className="h-6 w-6 text-white" />
          </button>

          {/* Logo centrado */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none group"
            aria-label="Ir al inicio"
            style={{ minWidth: 0 }}
          >
            {logoUrl ? (
              <span className="block group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={brandName}
                  className={`
                    w-auto drop-shadow-2xl
                    ${scrolled ? 'h-10 sm:h-10 lg:h-10' : 'h-14 sm:h-18 lg:h-20'}
                  `}
                />
              </span>
            ) : (
              <span
                className={`
                  text-white drop-shadow-2xl leading-none font-extrabold tracking-[0.18em] group-hover:scale-105 transition-transform
                  ${scrolled ? 'text-3xl sm:text-4xl lg:text-4xl' : 'text-5xl sm:text-6xl lg:text-7xl'}
                `}
              >
                SF
              </span>
            )}

            <span className="hidden md:block mt-1 text-xs font-semibold tracking-[0.22em] uppercase text-white/90">
              {brandName}
            </span>
          </Link>

          {/* Acciones a la derecha */}
          <div className="flex items-center gap-1 absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              className="p-2 flex items-center justify-center rounded-full hover:bg-white/20 focus:bg-white/25 active:scale-95 transition-all"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              style={{ minWidth: 44 }}
            >
              <Icon name="search" className="h-6 w-6 text-white" />
            </button>
            {cartEnabled && (
              <Link
                href="/cart"
                className="p-2 flex items-center justify-center rounded-full hover:bg-white/20 focus:bg-white/25 active:scale-95 transition-all"
                aria-label="Carrito"
                style={{ minWidth: 44 }}
              >
                <MiniCart />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Desktop nav - con hover mejorado */}
      <nav className="hidden md:flex items-center justify-center gap-8 py-3 text-[17px] font-semibold text-white/95">
        <Link
          href="/products"
          className="
            relative px-4 py-2 rounded-lg
            transition-all duration-200
            hover:text-white hover:bg-white/15
            focus:bg-white/20 focus:outline-none
            active:scale-95
          "
        >
          Catálogo
        </Link>
        <Link
          href="/about"
          className="
            relative px-4 py-2 rounded-lg
            transition-all duration-200
            hover:text-white hover:bg-white/15
            focus:bg-white/20 focus:outline-none
            active:scale-95
          "
        >
          Nosotros
        </Link>
        <Link
          href="/contact"
          className="
            relative px-4 py-2 rounded-lg
            transition-all duration-200
            hover:text-white hover:bg-white/15
            focus:bg-white/20 focus:outline-none
            active:scale-95
          "
        >
          Contacto
        </Link>
      </nav>

      {/* Mobile menu bottom sheet */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* overlay */}
          <button
            type="button"
            className="flex-1 bg-black/55"
            aria-label="Cerrar menú"
            onClick={() => setMobileMenu(false)}
          />
          {/* sheet */}
          <div className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-[var(--border)]">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[var(--border)]">
              <span className="text-lg font-semibold text-[var(--text)]">Menú</span>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-zinc-100 focus:bg-zinc-100 transition"
                onClick={() => setMobileMenu(false)}
                aria-label="Cerrar"
              >
                <Icon name="close" className="h-5 w-5 text-zinc-700" />
              </button>
            </div>

            <nav className="px-6 py-5 grid gap-4 text-base font-medium text-[var(--text)]">
              <Link
                href="/products"
                onClick={() => setMobileMenu(false)}
                className="flex items-center justify-between py-1.5 border-b border-zinc-100 last:border-b-0"
              >
                <span>Catálogo</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenu(false)}
                className="flex items-center justify-between py-1.5 border-b border-zinc-100 last:border-b-0"
              >
                <span>Nosotros</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenu(false)}
                className="flex items-center justify-between py-1.5 border-b border-zinc-100 last:border-b-0"
              >
                <span>Contacto</span>
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenu(false)}
                className="flex items-center justify-between py-1.5 border-b border-zinc-100 last:border-b-0"
              >
                <span>Carrito</span>
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenu(false)}
                className="flex items-center justify-between py-1.5"
              >
                <span>Iniciar sesión</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <button
            type="button"
            className="flex-1 bg-black/55"
            aria-label="Cerrar búsqueda"
            onClick={() => setSearchOpen(false)}
          />
          <div className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-[var(--border)]">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[var(--border)]">
              <span className="text-lg font-semibold text-[var(--text)]">Buscar productos</span>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-zinc-100 focus:bg-zinc-100 transition"
                onClick={() => setSearchOpen(false)}
                aria-label="Cerrar"
              >
                <Icon name="close" className="h-5 w-5 text-zinc-700" />
              </button>
            </div>

            <form
              action={searchHref}
              onSubmit={e => {
                e.preventDefault();
                if (trimmed) window.location.href = searchHref;
              }}
              className="px-6 py-5 flex gap-2"
            >
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                type="text"
                placeholder="Buscar proteínas, creatina, etc."
                className="input-bordered input w-full rounded-md pr-10 text-base py-2.5"
                aria-label="Buscar productos"
              />
              <button
                type="submit"
                className="btn-primary btn rounded-md px-4 text-sm font-semibold"
                disabled={!trimmed}
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

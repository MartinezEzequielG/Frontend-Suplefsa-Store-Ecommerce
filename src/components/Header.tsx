'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
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

function HeaderIconButton({
  onClick,
  ariaLabel,
  children,
}: {
  onClick?: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="
        inline-flex items-center justify-center
        rounded-full
        bg-white/10 hover:bg-white/16
        border border-white/10
        shadow-[0_6px_20px_rgba(0,0,0,0.18)]
        transition
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0
      "
      style={{ width: 46, height: 46 }}
    >
      {children}
    </button>
  );
}

export function Header({ logoUrl, brandName = 'Suplementacion Formosa', checkoutMode }: HeaderProps) {
  const cartEnabled = cartEnabledFrom(checkoutMode);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayOpen = mobileMenu || searchOpen;

  // ✅ Umbral más alto + menos toggles
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : '';
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlayOpen, searchOpen]);

  useEffect(() => {
    const handler = () => {
      setMobileMenu(false);
      setSearchOpen(false);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileMenu(false);
        setSearchOpen(false);
      }
    }
    if (overlayOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlayOpen]);

  const trimmed = q.trim();
  const searchHref = useMemo(
    () => `/products?q=${encodeURIComponent(trimmed)}&page=1&sort=createdAt:desc`,
    [trimmed]
  );

  return (
    <header
      className={[
        'sf-header sticky top-0 z-50 border-b backdrop-blur-md',
        'transition-[box-shadow,border-color] duration-300',
        'pt-[env(safe-area-inset-top)]',
        'bg-gradient-to-br from-[#0b2a4a]/94 via-[#1565c0]/88 to-[#2196f3]/78',
        scrolled
          ? 'border-white/15 shadow-[0_16px_44px_rgba(0,0,0,0.34)]'
          : 'border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
      ].join(' ')}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-2 sm:py-4">
        <div className={['relative flex items-center justify-between', scrolled ? 'h-20' : 'h-20 sm:h-28'].join(' ')}>
          {/* Left */}
          <div className="flex items-center">
            <div className="md:hidden">
              <HeaderIconButton onClick={() => setMobileMenu(true)} ariaLabel="Menú">
                <Icon name="menu" className="h-6 w-6 text-white" />
              </HeaderIconButton>
            </div>

            {/* Desktop placeholder para balance visual */}
            <div className="hidden md:block" style={{ width: 46, height: 46 }} aria-hidden />
          </div>

          {/* Center logo (con aire lateral) */}
          <Link
            href="/"
            className={[
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'flex flex-col items-center select-none',
              'px-10 sm:px-14',
            ].join(' ')}
            aria-label="Ir al inicio"
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={brandName}
                className={[
                  'w-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-[1.03]',
                  scrolled ? 'h-16 sm:h-16' : 'h-16 sm:h-24',
                ].join(' ')}
              />
            ) : (
              <span
                className={[
                  'text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] leading-none font-extrabold tracking-[0.18em]',
                  scrolled ? 'text-4xl' : 'text-5xl sm:text-6xl',
                ].join(' ')}
              >
                SF
              </span>
            )}

            <span className="hidden md:block mt-2 text-[13px] font-semibold tracking-[0.22em] uppercase text-white/90">
              {brandName}
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-2">
            <HeaderIconButton onClick={() => setSearchOpen(true)} ariaLabel="Buscar">
              <Icon name="search" className="h-6 w-6 text-white" />
            </HeaderIconButton>

            {cartEnabled && (
              <Link
                href="/cart"
                aria-label="Carrito"
                className="
                  inline-flex items-center justify-center
                  rounded-full
                  bg-white/10 hover:bg-white/16
                  border border-white/10
                  shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                  transition
                  active:scale-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0
                "
                style={{ width: 46, height: 46 }}
              >
                <MiniCart />
              </Link>
            )}
          </div>
        </div>

        {/* Desktop nav (único lugar donde aparece) */}
        <nav className="hidden md:flex items-center justify-center gap-2 pb-3">
          {[
            { href: '/products', label: 'Catálogo' },
            { href: '/about', label: 'Nosotros' },
            { href: '/contact', label: 'Contacto' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                px-4 py-2 rounded-xl
                text-[15px] font-semibold text-white/95
                hover:text-white hover:bg-white/10
                border border-transparent hover:border-white/10
                transition
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <button type="button" className="flex-1 bg-black/55" aria-label="Cerrar menú" onClick={() => setMobileMenu(false)} />
          <div className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]">
            <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-[var(--border)]">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-widest uppercase">Menú</div>
                <div className="text-base font-extrabold text-[var(--text)] truncate">{brandName}</div>
              </div>

              <button
                type="button"
                className="p-2 rounded-full hover:bg-zinc-100 focus:bg-zinc-100 transition"
                onClick={() => setMobileMenu(false)}
                aria-label="Cerrar"
              >
                <Icon name="close" className="h-5 w-5 text-zinc-700" />
              </button>
            </div>

            <nav className="px-5 py-4 grid gap-2 text-[15px] font-semibold text-[var(--text)]">
              <Link
                href="/products"
                onClick={() => setMobileMenu(false)}
                className="h-12 px-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between"
              >
                <span>Catálogo</span>
                <span className="text-[var(--text-muted)]">→</span>
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenu(false)}
                className="h-12 px-4 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-between"
              >
                <span>Nosotros</span>
                <span className="text-[var(--text-muted)]">→</span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenu(false)}
                className="h-12 px-4 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-between"
              >
                <span>Contacto</span>
                <span className="text-[var(--text-muted)]">→</span>
              </Link>

              {cartEnabled && (
                <Link
                  href="/cart"
                  onClick={() => setMobileMenu(false)}
                  className="h-12 px-4 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-between"
                >
                  <span>Carrito</span>
                  <span className="text-[var(--text-muted)]">→</span>
                </Link>
              )}
            </nav>

            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenu(false);
                  setSearchOpen(true);
                }}
                className="w-full h-12 rounded-2xl bg-[var(--primary)] text-white font-extrabold text-sm hover:bg-[var(--primary-2)] transition"
              >
                Buscar productos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <button type="button" className="flex-1 bg-black/55" aria-label="Cerrar búsqueda" onClick={() => setSearchOpen(false)} />

          <div className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[var(--border)]">
              <span className="text-base sm:text-lg font-extrabold text-[var(--text)]">Buscar productos</span>
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
              onSubmit={(e) => {
                e.preventDefault();
                if (trimmed) window.location.href = searchHref;
              }}
              className="px-6 py-5 flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="text"
                  placeholder="Buscar proteínas, creatina, etc."
                  className="input"
                  aria-label="Buscar productos"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <Icon name="search" className="h-5 w-5" />
                </span>
              </div>

              <button type="submit" className="btn btn-primary rounded-2xl" disabled={!trimmed}>
                Buscar
              </button>
            </form>

            <div className="px-6 pb-6">
              <div className="text-xs font-semibold text-[var(--text-muted)]">
                Sugerencias: creatina, whey, pre entreno, aminoácidos.
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
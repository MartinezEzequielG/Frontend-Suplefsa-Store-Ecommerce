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

function IconBtn({
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
        h-11 w-11
        rounded-2xl
        bg-white/80 hover:bg-white
        border border-[rgba(2,6,23,0.10)]
        shadow-[0_10px_30px_rgba(2,6,23,0.06)]
        transition
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(33,150,243,0.35)]
      "
    >
      {children}
    </button>
  );
}

export function Header({ logoUrl, brandName = 'Suplementación Formosa', checkoutMode }: HeaderProps) {
  const cartEnabled = cartEnabledFrom(checkoutMode);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayOpen = mobileMenu || searchOpen;

  // ✅ Scroll sin loop: rAF + hysteresis (entra > 24, sale < 8)
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY || 0;

      setScrolled((prev) => {
        if (!prev && y > 24) return true;
        if (prev && y < 8) return false;
        return prev;
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenu(false);
        setSearchOpen(false);
      }
    };
    if (overlayOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlayOpen]);

  const trimmed = q.trim();
  const searchHref = useMemo(
    () => `/products?q=${encodeURIComponent(trimmed)}&page=1&sort=createdAt:desc`,
    [trimmed]
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .sfh{
            position: sticky; top: 0; z-index: 50;
            padding-top: env(safe-area-inset-top);
            background: rgba(255,255,255,0.76);
            border-bottom: 1px solid rgba(2,6,23,0.10);
            backdrop-filter: saturate(170%) blur(14px);
            -webkit-backdrop-filter: saturate(170%) blur(14px);
            transition: background .22s ease, box-shadow .22s ease, border-color .22s ease;
            transform: translateZ(0);
          }
          .sfh--scrolled{
            background: rgba(255,255,255,0.92);
            border-bottom-color: rgba(33,150,243,0.22);
            box-shadow: 0 18px 60px rgba(2,6,23,0.10);
          }

          /* ✅ Altura constante SIEMPRE (evita loops) */
          .sfhRow{
            position: relative;
            height: 92px; /* fijo */
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          @media(min-width:640px){ .sfhRow{ height: 108px; } }

          /* Logo centrado sin tocar layout */
          .sfhLogoWrap{
            position:absolute; left:50%; top:50%;
            transform: translate(-50%, -50%);
            display:flex;
            flex-direction:column;
            align-items:center;
            padding: 0 72px; /* aire para botones */
            user-select:none;
          }
          .sfhHalo{
            position:absolute;
            inset:-18px -34px;
            border-radius: 999px;
            background:
              radial-gradient(circle at 30% 25%, rgba(33,150,243,0.18), transparent 62%),
              radial-gradient(circle at 80% 75%, rgba(33,150,243,0.10), transparent 60%);
            filter: blur(10px);
            opacity: .85;
            pointer-events:none;
          }
          .sfhLogo{
            display:block;
            opacity:.94;
            filter: drop-shadow(0 22px 55px rgba(2,6,23,0.14));
            transition: transform .22s ease, opacity .22s ease, filter .22s ease;
            will-change: transform, opacity, filter;
            transform-origin: center;
          }
          /* ✅ Achicamos con scale, no con height */
          .sfhLogo--normal{ transform: scale(1.18); }
          .sfhLogo--scrolled{ transform: scale(1.00); }

          /* Brand solo desktop, limpio */
          .sfhBrand{
            margin-top: 10px;
            font-size: 12px;
            font-weight: 900;
            letter-spacing: .16em;
            text-transform: uppercase;
            color: rgba(15,23,42,0.68);
          }

          /* Línea azul abajo: identidad */
          .sfhLine{
            height: 3px;
            background: linear-gradient(90deg,
              rgba(33,150,243,0.00),
              rgba(33,150,243,0.80),
              rgba(33,150,243,0.20),
              rgba(33,150,243,0.80),
              rgba(33,150,243,0.00)
            );
            opacity: .85;
          }

          /* Nav desktop usable y minimal */
          .sfhNav a{ position:relative; }
          .sfhNav a::after{
            content:"";
            position:absolute;
            left: 14px; right: 14px; bottom: 6px;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(33,150,243,0.95), transparent);
            transform: scaleX(.2);
            opacity: 0;
            transition: transform .20s ease, opacity .20s ease;
          }
          .sfhNav a:hover::after{ transform: scaleX(1); opacity: 1; }

          @media (max-width: 640px){
            .sfhBrand{ display:none; }
            .sfhLogoWrap{ padding: 0 60px; }
            .sfhLogo--normal{ transform: scale(1.22); } /* mobile un toque más */
          }
        `,
        }}
      />

      <header className={['sfh', scrolled ? 'sfh--scrolled' : ''].join(' ')}>
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <div className="sfhRow">
            {/* Left */}
            <div className="flex items-center">
              <div className="md:hidden">
                <IconBtn onClick={() => setMobileMenu(true)} ariaLabel="Menú">
                  <Icon name="menu" className="h-6 w-6 text-[var(--text)]" />
                </IconBtn>
              </div>
              <div className="hidden md:block" style={{ width: 44, height: 44 }} aria-hidden />
            </div>

            {/* Center Logo */}
            <Link href="/" className="sfhLogoWrap" aria-label="Ir al inicio">
              <span className="sfhHalo" aria-hidden="true" />
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={brandName}
                  className={[
                    'sfhLogo w-auto',
                    scrolled ? 'sfhLogo--scrolled' : 'sfhLogo--normal',
                  ].join(' ')}
                  style={{
                    height: 64, // altura base fija (NO cambia)
                  }}
                />
              ) : (
                <span
                  className={[
                    'sfhLogo font-black text-[var(--text)]',
                    scrolled ? 'sfhLogo--scrolled' : 'sfhLogo--normal',
                  ].join(' ')}
                >
                  {brandName}
                </span>
              )}

              <span className="hidden md:block sfhBrand">{brandName}</span>
            </Link>

            {/* Right */}
            <div className="flex items-center gap-2">
              <IconBtn onClick={() => setSearchOpen(true)} ariaLabel="Buscar">
                <Icon name="search" className="h-6 w-6 text-[var(--text)]" />
              </IconBtn>

              {cartEnabled && (
                <Link
                  href="/cart"
                  aria-label="Carrito"
                  className="
                    inline-flex items-center justify-center
                    h-11 w-11
                    rounded-2xl
                    bg-white/80 hover:bg-white
                    border border-[rgba(2,6,23,0.10)]
                    shadow-[0_10px_30px_rgba(2,6,23,0.06)]
                    transition
                    active:scale-95
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(33,150,243,0.35)]
                  "
                >
                  <MiniCart />
                </Link>
              )}
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="sfhNav hidden md:flex items-center justify-center gap-2 pb-3">
            {[
              { href: '/products', label: 'Catálogo' },
              { href: '/about', label: 'Nosotros' },
              { href: '/contact', label: 'Contacto' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  px-4 py-2 rounded-2xl
                  text-[15px] font-semibold text-[rgba(15,23,42,0.82)]
                  hover:text-[var(--primary-2)]
                  hover:bg-[rgba(33,150,243,0.06)]
                  border border-transparent hover:border-[rgba(33,150,243,0.14)]
                  transition
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sfhLine" />

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
                <Link href="/products" onClick={() => setMobileMenu(false)} className="h-12 px-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                  <span>Catálogo</span><span className="text-[var(--text-muted)]">→</span>
                </Link>
                <Link href="/about" onClick={() => setMobileMenu(false)} className="h-12 px-4 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-between">
                  <span>Nosotros</span><span className="text-[var(--text-muted)]">→</span>
                </Link>
                <Link href="/contact" onClick={() => setMobileMenu(false)} className="h-12 px-4 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-between">
                  <span>Contacto</span><span className="text-[var(--text-muted)]">→</span>
                </Link>
                {cartEnabled && (
                  <Link href="/cart" onClick={() => setMobileMenu(false)} className="h-12 px-4 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-between">
                    <span>Carrito</span><span className="text-[var(--text-muted)]">→</span>
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
                <button type="button" className="p-2 rounded-full hover:bg-zinc-100 focus:bg-zinc-100 transition" onClick={() => setSearchOpen(false)} aria-label="Cerrar">
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
    </>
  );
}

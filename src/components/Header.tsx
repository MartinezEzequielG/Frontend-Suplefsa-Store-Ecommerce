'use client';

import Link from 'next/link';
import type { FormEvent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cartEnabledFrom } from '@/lib/checkoutMode';

type HeaderProps = {
  logoUrl?: string | null;
  brandName?: string;
  checkoutMode?: 'CATALOG' | 'CART';
};

const navItems = [
  { href: '/products', label: 'Catálogo' },
  { href: '/about', label: 'Nosotros' },
  { href: '/contact', label: 'Contacto' },
];

const quickSearches = ['creatina', 'whey', 'pre entreno', 'proteína'];

function Icon({
  name,
  className,
}: {
  name: 'search' | 'menu' | 'close' | 'arrow' | 'cart';
  className?: string;
}) {
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M10.5 4a6.5 6.5 0 014.94 10.72l3.42 3.42-1.42 1.42-3.42-3.42A6.5 6.5 0 1110.5 4zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
        />
      </svg>
    );
  }

  if (name === 'menu') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 6.5h16v2H4v-2zm0 4.5h16v2H4v-2zm0 4.5h16v2H4v-2z"
        />
      </svg>
    );
  }

  if (name === 'close') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42-6.3-6.3-6.3 6.3-1.41-1.42L9.17 12 2.88 5.71l1.41-1.42 6.3 6.3 6.3-6.3 1.41 1.42z"
        />
      </svg>
    );
  }

  if (name === 'arrow') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M13.17 12 8.22 7.05l1.41-1.41L16 12l-6.37 6.36-1.41-1.41L13.17 12z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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
  );
}

function IconButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="
        inline-flex h-11 w-11 items-center justify-center rounded-full
        border border-slate-200 bg-white text-slate-900
        transition
        hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200
      "
    >
      {children}
    </button>
  );
}

function CartButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir carrito"
      className="
        relative inline-flex h-11 w-11 items-center justify-center rounded-full
        border border-slate-200 bg-white text-slate-900
        transition
        hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200
      "
    >
      <Icon name="cart" className="h-[22px] w-[22px]" />

      {count > 0 ? (
        <span
          className="
            absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center
            rounded-full bg-sky-500 px-1.5 text-[11px] font-black text-white shadow-sm
          "
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  );
}

function BrandMark({
  logoUrl,
  brandName,
}: {
  logoUrl?: string | null;
  brandName: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-3.5">
      <span className="relative flex h-[62px] w-[62px] shrink-0 items-center justify-center">
        <span className="absolute -top-1 left-1/2 z-20 flex -translate-x-1/2 items-center gap-[1px]">
          <span className="text-[10px] leading-none text-amber-400">★</span>
          <span className="text-[11px] leading-none text-amber-400">★</span>
          <span className="text-[10px] leading-none text-amber-400">★</span>
        </span>

        <span
          className="
            relative flex h-[52px] w-[52px] items-center justify-center overflow-hidden
            rounded-full border border-sky-100 bg-white shadow-sm ring-4 ring-sky-50/80
          "
        >
          <span className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-sky-300 via-white to-sky-300" />

          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={brandName}
              className="relative z-10 h-10 w-10 object-contain"
            />
          ) : (
            <span className="relative z-10 text-[15px] font-black tracking-tight text-slate-950">
              SF
            </span>
          )}
        </span>
      </span>

      <span className="hidden min-w-0 leading-none sm:block">
        <span className="block text-[12px] font-bold uppercase tracking-[0.24em] text-sky-700/80">
          Suplementación
        </span>
        <span className="mt-1 block text-[22px] font-black tracking-tight text-slate-950">
          Formosa
        </span>
      </span>
    </span>
  );
}

export function Header({
  logoUrl,
  brandName = 'Suplementación Formosa',
  checkoutMode,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const cartEnabled = cartEnabledFrom(checkoutMode);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const overlayOpen = mobileMenu || searchOpen;
  const trimmed = q.trim();

  const searchHref = useMemo(
    () => `/products?q=${encodeURIComponent(trimmed)}&page=1&sort=createdAt:desc`,
    [trimmed],
  );

  const loadCartCount = useCallback(() => {
    if (!cartEnabled) return;

    fetch('/api/cart', {
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((cart) => {
        const nextCount = (cart.items || []).reduce(
          (sum: number, item: any) => sum + Number(item.quantity || 0),
          0,
        );

        setCartCount(nextCount);
      })
      .catch(() => {});
  }, [cartEnabled]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      setScrolled((window.scrollY || 0) > 6);
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
    loadCartCount();
  }, [loadCartCount, pathname]);

  useEffect(() => {
    function onCartUpdated() {
      loadCartCount();
    }

    function onCartCountUpdated(event: Event) {
      const customEvent = event as CustomEvent<{ count?: number }>;
      const nextCount = Number(customEvent.detail?.count ?? 0);

      if (Number.isFinite(nextCount)) {
        setCartCount(nextCount);
      } else {
        loadCartCount();
      }
    }

    window.addEventListener('cart-updated', onCartUpdated);
    window.addEventListener('cart-count-updated', onCartCountUpdated);
    window.addEventListener('focus', onCartUpdated);

    return () => {
      window.removeEventListener('cart-updated', onCartUpdated);
      window.removeEventListener('cart-count-updated', onCartCountUpdated);
      window.removeEventListener('focus', onCartUpdated);
    };
  }, [loadCartCount]);

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : '';

    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [overlayOpen, searchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenu(false);
        setSearchOpen(false);
      }
    };

    if (overlayOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlayOpen]);

  function closeOverlays() {
    setMobileMenu(false);
    setSearchOpen(false);
  }

  function openCartDrawer() {
    closeOverlays();
    window.dispatchEvent(new Event('open-cart-drawer'));
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmed) return;

    closeOverlays();
    router.push(searchHref);
  }

  function goQuickSearch(term: string) {
    closeOverlays();
    setQ(term);
    router.push(`/products?q=${encodeURIComponent(term)}&page=1&sort=createdAt:desc`);
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 bg-white/95 backdrop-blur-xl
          transition-shadow duration-200
          ${scrolled ? 'shadow-[0_8px_24px_rgba(15,23,42,0.08)]' : 'shadow-none'}
        `}
      >
        <div className="h-[3px] w-full bg-[linear-gradient(90deg,#7dd3fc_0%,#ffffff_48%,#7dd3fc_100%)]" />

        <div className="border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid h-[80px] grid-cols-[auto_1fr_auto] items-center gap-3 md:h-[84px] md:grid-cols-[1fr_auto_1fr]">
              <div className="flex min-w-0 items-center gap-3 md:justify-self-start">
                <div className="md:hidden">
                  <IconButton onClick={() => setMobileMenu(true)} ariaLabel="Abrir menú">
                    <Icon name="menu" className="h-5 w-5" />
                  </IconButton>
                </div>

                <Link
                  href="/"
                  onClick={closeOverlays}
                  aria-label="Ir al inicio"
                  className="min-w-0"
                >
                  <BrandMark logoUrl={logoUrl} brandName={brandName} />
                </Link>
              </div>

              <nav className="hidden items-center justify-center gap-1 md:flex md:justify-self-center">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeOverlays}
                    className={`
                      rounded-full px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.06em] transition
                      ${
                        isActive(item.href)
                          ? 'bg-sky-50 text-sky-800'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex shrink-0 items-center justify-end gap-2 md:justify-self-end">
                <IconButton onClick={() => setSearchOpen(true)} ariaLabel="Buscar productos">
                  <Icon name="search" className="h-5 w-5" />
                </IconButton>

                {cartEnabled ? (
                  <CartButton count={cartCount} onClick={openCartDrawer} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileMenu ? (
        <div className="fixed inset-0 z-[1000] md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileMenu(false)}
            className="absolute inset-0 bg-slate-950/45"
          />

          <aside className="absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/"
                  onClick={closeOverlays}
                  className="min-w-0"
                >
                  <BrandMark logoUrl={logoUrl} brandName={brandName} />
                </Link>

                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-700"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-2 p-5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className={`
                    flex h-12 items-center justify-between rounded-2xl border px-4
                    text-sm font-semibold
                    ${
                      isActive(item.href)
                        ? 'border-sky-200 bg-sky-50 text-sky-800'
                        : 'border-slate-200 bg-white text-slate-900'
                    }
                  `}
                >
                  <span>{item.label}</span>
                  <Icon name="arrow" className="h-5 w-5 opacity-60" />
                </Link>
              ))}

              {cartEnabled ? (
                <button
                  type="button"
                  onClick={openCartDrawer}
                  className="
                    flex h-12 w-full items-center justify-between rounded-2xl
                    border border-slate-200 bg-white px-4 text-left
                    text-sm font-semibold text-slate-900
                  "
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon name="cart" className="h-5 w-5" />
                    Carrito
                  </span>
                  <Icon name="arrow" className="h-5 w-5 opacity-60" />
                </button>
              ) : null}
            </nav>

            <div className="border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenu(false);
                  setSearchOpen(true);
                }}
                className="
                  flex h-12 w-full items-center justify-center gap-2 rounded-full
                  bg-sky-500 px-4 text-sm font-bold text-white
                  transition hover:bg-sky-600
                "
              >
                <Icon name="search" className="h-5 w-5" />
                Buscar
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-[1000]">
          <button
            type="button"
            aria-label="Cerrar búsqueda"
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 bg-slate-950/45"
          />

          <div className="absolute left-1/2 top-20 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-[2rem] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="text-lg font-extrabold text-slate-950">Buscar</h2>

              <button
                type="button"
                aria-label="Cerrar búsqueda"
                onClick={() => setSearchOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-700"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitSearch}>
              <div className="relative">
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(event) => setQ(event.target.value)}
                  type="text"
                  placeholder="Creatina, whey, pre entreno..."
                  aria-label="Buscar productos"
                  className="
                    h-14 w-full rounded-2xl border border-slate-200 bg-slate-50
                    pl-4 pr-14 text-sm font-medium text-slate-900 outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100
                  "
                />

                <button
                  type="submit"
                  disabled={!trimmed}
                  aria-label="Buscar"
                  className="
                    absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center
                    rounded-xl bg-slate-900 text-white transition
                    hover:bg-sky-600
                    disabled:cursor-not-allowed disabled:bg-slate-300
                  "
                >
                  <Icon name="search" className="h-5 w-5" />
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => goQuickSearch(term)}
                  className="
                    rounded-full border border-slate-200 bg-white px-3 py-2
                    text-xs font-bold text-slate-700
                    transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800
                  "
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
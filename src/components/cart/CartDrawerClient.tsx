'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { imageUrl } from '@/lib/backend';

type CartItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  product?: {
    name?: string | null;
    slug?: string | null;
    images?: { url: string }[];
  } | null;
  productVariant?: {
    sku?: string | null;
    options?: Array<{
      optionValue?: {
        value?: string | null;
        product?: { name?: string | null } | null;
      } | null;
    }>;
  } | null;
};

type CartResponse = {
  id?: number;
  items?: CartItem[];
};

function variantLabel(it: CartItem) {
  const pairs =
    it.productVariant?.options
      ?.map((o) => {
        const label = o.optionValue?.product?.name;
        const value = o.optionValue?.value;

        if (label && value) return `${label}: ${value}`;
        if (value) return value;

        return null;
      })
      .filter(Boolean) || [];

  if (pairs.length) return pairs.join(' / ');

  return it.productVariant?.sku ?? null;
}

function removeCartParam(pathname: string, searchParams: URLSearchParams) {
  const next = new URLSearchParams(searchParams.toString());
  next.delete('cart');

  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export default function CartDrawerClient() {
  const router = useRouter();
  const pathname = usePathname();
  const readonlySearchParams = useSearchParams();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const searchParams = useMemo(
    () => new URLSearchParams(readonlySearchParams.toString()),
    [readonlySearchParams],
  );

  const shouldHide =
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/orders');

  const items = cart?.items || [];

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + Number(item.unitPrice || 0) * Number(item.quantity || 0),
      0,
    );
  }, [items]);

  const loadCart = useCallback(async () => {
    const res = await fetch('/api/cart', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      setCart({ items: [] });
      return;
    }

    const data = await res.json();
    setCart(data);
  }, []);

  const close = useCallback(() => {
    setOpen(false);

    const nextUrl = removeCartParam(pathname || '/', searchParams);
    window.history.replaceState(null, '', nextUrl);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (shouldHide) return;

    if (readonlySearchParams.get('cart') === 'open') {
      setOpen(true);
      void loadCart();
    }
  }, [readonlySearchParams, loadCart, shouldHide]);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      void loadCart();
    };

    window.addEventListener('open-cart-drawer', handler);

    return () => window.removeEventListener('open-cart-drawer', handler);
  }, [loadCart]);

  async function updateQuantity(itemId: number, quantity: number) {
    if (quantity < 1) return;

    setPendingItemId(itemId);

    const fd = new FormData();
    fd.set('quantity', String(quantity));

    const res = await fetch(`/cart/actions/update?id=${itemId}&mode=json`, {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
    });

    setPendingItemId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message || 'No se pudo actualizar el carrito');
      return;
    }

    await loadCart();

    startTransition(() => {
      router.refresh();
    });
  }

  async function removeItem(itemId: number) {
    setPendingItemId(itemId);

    const res = await fetch(`/cart/actions/remove?id=${itemId}&mode=json`, {
      method: 'POST',
      body: new FormData(),
      headers: { Accept: 'application/json' },
    });

    setPendingItemId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message || 'No se pudo eliminar el producto');
      return;
    }

    await loadCart();

    startTransition(() => {
      router.refresh();
    });
  }

  if (shouldHide) return null;

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Cerrar carrito"
          onClick={close}
          className="fixed inset-0 z-[1100] bg-black/30 backdrop-blur-[1px]"
        />
      ) : null}

      <aside
        className={`
          fixed right-0 top-0 z-[1110] h-dvh w-full max-w-md bg-white shadow-2xl
          transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900">Tu carrito</h2>
              <p className="text-xs text-zinc-500">
                {items.length ? `${items.length} producto${items.length === 1 ? '' : 's'}` : 'Sin productos'}
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-semibold"
            >
              Cerrar
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {items.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center">
                <p className="text-sm font-semibold text-zinc-900">Tu carrito está vacío.</p>
                <p className="mt-1 text-xs text-zinc-500">Agregá productos para continuar.</p>

                <Link
                  href="/products"
                  onClick={close}
                  className="mt-4 inline-flex rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
                >
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((it) => {
                  const img = it.product?.images?.[0]?.url;
                  const label = variantLabel(it);
                  const line = Number(it.unitPrice || 0) * Number(it.quantity || 0);
                  const itemPending = pendingItemId === it.id || isPending;

                  return (
                    <li
                      key={it.id}
                      className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl(img || '/placeholder.svg')}
                          alt={it.product?.name || 'Producto'}
                          className="h-16 w-16 shrink-0 rounded-lg bg-zinc-100 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-bold text-zinc-900">
                            {it.product?.name ?? 'Producto'}
                          </p>

                          {label ? (
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {label}
                            </p>
                          ) : null}

                          <p className="mt-1 text-xs text-zinc-500">
                            {formatPrice(it.unitPrice)} c/u
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-lg border border-zinc-200">
                              <button
                                type="button"
                                disabled={itemPending || it.quantity <= 1}
                                onClick={() => updateQuantity(it.id, it.quantity - 1)}
                                className="px-3 py-1.5 text-sm font-bold disabled:opacity-40"
                              >
                                −
                              </button>

                              <span className="min-w-8 text-center text-sm font-semibold">
                                {it.quantity}
                              </span>

                              <button
                                type="button"
                                disabled={itemPending}
                                onClick={() => updateQuantity(it.id, it.quantity + 1)}
                                className="px-3 py-1.5 text-sm font-bold disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              disabled={itemPending}
                              onClick={() => removeItem(it.id)}
                              className="text-xs font-semibold text-red-600 disabled:opacity-40"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Subtotal</p>
                          <p className="text-sm font-extrabold text-zinc-900">
                            {formatPrice(line)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <footer className="border-t border-zinc-200 bg-white px-4 py-4">
            <div className="mb-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-bold text-zinc-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Envío</span>
                <span className="font-semibold text-zinc-900">A convenir</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-zinc-300 px-4 py-3 text-sm font-semibold"
              >
                Seguir comprando
              </button>

              <Link
                href="/checkout"
                className={`rounded-lg px-4 py-3 text-center text-sm font-extrabold text-white ${
                  items.length ? 'bg-black' : 'pointer-events-none bg-zinc-300'
                }`}
              >
                Finalizar compra
              </Link>
            </div>

            <Link
              href="/cart"
              className="mt-3 block text-center text-xs font-semibold text-zinc-500 underline"
            >
              Ver carrito completo
            </Link>
          </footer>
        </div>
      </aside>
    </>
  );
}
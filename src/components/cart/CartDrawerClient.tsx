'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { imageUrl } from '@/lib/backend';
import CartRecommendations from './CartRecommendations';

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

function variantLabel(item: CartItem) {
  const pairs =
    item.productVariant?.options
      ?.map((option) => {
        const label = option.optionValue?.product?.name;
        const value = option.optionValue?.value;

        if (label && value) return `${label}: ${value}`;
        if (value) return value;

        return null;
      })
      .filter(Boolean) ?? [];

  if (pairs.length) return pairs.join(' / ');

  return item.productVariant?.sku ?? null;
}

function removeCartParam(pathname: string, searchParams: URLSearchParams) {
  const next = new URLSearchParams(searchParams.toString());
  next.delete('cart');

  const qs = next.toString();

  return qs ? `${pathname}?${qs}` : pathname;
}

function getCartCount(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
}

function emitCartCount(items: CartItem[]) {
  window.dispatchEvent(
    new CustomEvent('cart-count-updated', {
      detail: { count: getCartCount(items) },
    }),
  );
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

  const items = cart?.items ?? [];

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
      emitCartCount([]);
      return;
    }

    const data = await res.json();
    const nextItems = data?.items ?? [];

    setCart({
      ...data,
      items: nextItems,
    });

    emitCartCount(nextItems);
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

    return () => {
      window.removeEventListener('open-cart-drawer', handler);
    };
  }, [loadCart]);

  async function updateQuantity(itemId: number, quantity: number) {
    if (quantity < 1) return;

    setPendingItemId(itemId);

    const formData = new FormData();
    formData.set('quantity', String(quantity));

    const res = await fetch(`/cart/actions/update?id=${itemId}&mode=json`, {
      method: 'POST',
      body: formData,
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
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950">
                Tu carrito
              </h2>

              <p className="text-xs text-slate-500">
                {items.length
                  ? `${items.length} producto${items.length === 1 ? '' : 's'}`
                  : 'Sin productos'}
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              className="
                rounded-full border border-slate-200 px-3 py-1.5
                text-sm font-semibold text-slate-700
                transition hover:border-slate-300 hover:bg-slate-50
              "
            >
              Cerrar
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                  <span className="text-xl" aria-hidden="true">
                    🛒
                  </span>
                </div>

                <p className="text-sm font-extrabold text-slate-950">
                  Tu carrito está vacío
                </p>

                <p className="mx-auto mt-1 max-w-[240px] text-xs leading-5 text-slate-500">
                  Agregá productos para continuar con tu compra.
                </p>

                <Link
                  href="/products"
                  onClick={close}
                  className="
                    mt-5 inline-flex h-11 items-center justify-center rounded-full
                    bg-slate-950 px-5 text-sm font-black !text-white
                    transition hover:bg-sky-600 active:scale-[0.98]
                  "
                >
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => {
                  const image = item.product?.images?.[0]?.url;
                  const label = variantLabel(item);
                  const line =
                    Number(item.unitPrice || 0) * Number(item.quantity || 0);
                  const itemPending = pendingItemId === item.id || isPending;

                  return (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl(image || '/placeholder.svg')}
                          alt={item.product?.name || 'Producto'}
                          className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-bold text-slate-950">
                            {item.product?.name ?? 'Producto'}
                          </p>

                          {label ? (
                            <p className="mt-0.5 text-xs text-slate-500">
                              {label}
                            </p>
                          ) : null}

                          <p className="mt-1 text-xs text-slate-500">
                            {formatPrice(item.unitPrice)} c/u
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-xl border border-slate-200">
                              <button
                                type="button"
                                disabled={itemPending || item.quantity <= 1}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="
                                  px-3 py-1.5 text-sm font-bold text-slate-800
                                  disabled:cursor-not-allowed disabled:opacity-40
                                "
                              >
                                −
                              </button>

                              <span className="min-w-8 text-center text-sm font-semibold text-slate-950">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                disabled={itemPending}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="
                                  px-3 py-1.5 text-sm font-bold text-slate-800
                                  disabled:cursor-not-allowed disabled:opacity-40
                                "
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              disabled={itemPending}
                              onClick={() => removeItem(item.id)}
                              className="
                                text-xs font-semibold text-red-600
                                disabled:cursor-not-allowed disabled:opacity-40
                              "
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-xs text-slate-500">Subtotal</p>

                          <p className="text-sm font-extrabold text-slate-950">
                            {formatPrice(line)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <CartRecommendations
              cartItems={items}
              onAdded={loadCart}
              onClose={close}
            />
          </div>

          <footer className="border-t border-slate-200 bg-white px-4 py-4">
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-extrabold text-slate-950">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Envío</span>
                <span className="font-semibold text-slate-950">
                  A convenir
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={close}
                className="
                  h-12 rounded-xl border border-slate-300 bg-white px-4
                  text-sm font-bold text-slate-800
                  transition hover:border-slate-950 hover:bg-slate-50
                  active:scale-[0.98]
                "
              >
                Seguir comprando
              </button>

              {items.length ? (
                <Link
                  href="/checkout"
                  onClick={close}
                  className="
                    flex h-12 items-center justify-center rounded-xl
                    bg-slate-950 px-4 text-center text-sm font-black !text-white
                    transition hover:bg-sky-600 active:scale-[0.98]
                  "
                >
                  Finalizar compra
                </Link>
              ) : (
                <span
                  className="
                    flex h-12 items-center justify-center rounded-xl
                    bg-slate-200 px-4 text-center text-sm font-black text-slate-400
                  "
                >
                  Finalizar compra
                </span>
              )}
            </div>

            <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
              Revisá tu pedido antes de confirmar.
            </p>
          </footer>
        </div>
      </aside>
    </>
  );
}
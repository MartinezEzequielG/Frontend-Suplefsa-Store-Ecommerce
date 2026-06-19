'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { imageUrl } from '@/lib/backend';

type CartItem = {
  product?: {
    id?: number;
    slug?: string | null;
    name?: string | null;
  } | null;
};

type Product = {
  id: number;
  slug: string;
  name: string;
  basePrice?: number | string | null;
  salePrice?: number | string | null;
  discountTransfer?: number | string | null;
  discountMp?: number | string | null;
  images?: Array<{ url?: string | null }>;
  variants?: any[];
  options?: any[];
};

type Props = {
  cartItems: CartItem[];
  onAdded: () => Promise<void> | void;
  onClose: () => void;
};

function toNumber(value: any) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function getDiscountedPrice(price: number, discount: number) {
  if (!discount || discount <= 0) return price;
  return Math.round(price * (1 - discount / 100));
}

function getBestPrice(product: Product) {
  const base = toNumber(product.salePrice ?? product.basePrice);
  const transferDiscount = toNumber(product.discountTransfer);
  const mpDiscount = toNumber(product.discountMp);

  const prices = [
    {
      label: '',
      price: base,
      discount: 0,
    },
  ];

  if (transferDiscount > 0) {
    prices.push({
      label: 'con transferencia',
      price: getDiscountedPrice(base, transferDiscount),
      discount: transferDiscount,
    });
  }

  if (mpDiscount > 0) {
    prices.push({
      label: 'con Mercado Pago',
      price: getDiscountedPrice(base, mpDiscount),
      discount: mpDiscount,
    });
  }

  return prices.sort((a, b) => a.price - b.price)[0];
}

function productHasVariants(product: Product) {
  return (
    (Array.isArray(product.variants) && product.variants.length > 0) ||
    (Array.isArray(product.options) && product.options.length > 0)
  );
}

function normalizeKey(value: any) {
  return String(value ?? '').trim().toLowerCase();
}

export default function CartRecommendations({
  cartItems,
  onAdded,
  onClose,
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const cartProductKeys = useMemo(() => {
    const keys = new Set<string>();

    cartItems.forEach((item) => {
      const id = item.product?.id;
      const slug = normalizeKey(item.product?.slug);
      const name = normalizeKey(item.product?.name);

      if (id) keys.add(`id:${id}`);
      if (slug) keys.add(`slug:${slug}`);
      if (name) keys.add(`name:${name}`);
    });

    return keys;
  }, [cartItems]);

  const recommendedProducts = useMemo(() => {
    const productsNotInCart = products.filter((product) => {
      const id = product.id;
      const slug = normalizeKey(product.slug);
      const name = normalizeKey(product.name);

      if (id && cartProductKeys.has(`id:${id}`)) return false;
      if (slug && cartProductKeys.has(`slug:${slug}`)) return false;
      if (name && cartProductKeys.has(`name:${name}`)) return false;

      return true;
    });

    return productsNotInCart.slice(0, 3);
  }, [products, cartProductKeys]);

  const loadRecommendations = useCallback(async () => {
    const res = await fetch('/api/cart/recommendations', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return;

    const data = await res.json();
    setProducts(Array.isArray(data?.items) ? data.items : []);
  }, []);

  useEffect(() => {
    void loadRecommendations();
  }, [loadRecommendations]);

  async function addProduct(product: Product) {
    setAddingId(product.id);

    const formData = new FormData();
    formData.set('productId', String(product.id));
    formData.set('slug', product.slug);
    formData.set('quantity', '1');

    const res = await fetch('/cart/actions/add?mode=json', {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    setAddingId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message || 'No se pudo agregar el producto');
      return;
    }

    await onAdded();

    window.dispatchEvent(new Event('cart-updated'));

    startTransition(() => {
      router.refresh();
    });
  }

  if (!recommendedProducts.length) return null;

  return (
    <section className="mt-6 border-t border-slate-200 pt-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <div className="mb-1 h-[3px] w-9 rounded-full bg-sky-500" />

          <h3 className="text-sm font-black uppercase tracking-[0.08em] text-slate-950">
            {cartItems.length ? 'Sumá a tu pedido' : 'Más elegidos'}
          </h3>

          <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
            Productos seleccionados para completar tu compra.
          </p>
        </div>

        <Link
          href="/products"
          onClick={onClose}
          className="shrink-0 text-xs font-bold !text-slate-500 transition hover:!text-slate-950"
        >
          Ver catálogo
        </Link>
      </div>

      <div className="space-y-2.5">
        {recommendedProducts.map((product) => {
          const image = product.images?.[0]?.url;
          const bestPrice = getBestPrice(product);
          const hasVariants = productHasVariants(product);
          const isAdding = addingId === product.id || isPending;

          return (
            <article
              key={product.id}
              className="
                flex items-center gap-3 rounded-2xl border border-slate-200
                bg-white p-2.5 transition
                hover:border-slate-300 hover:shadow-sm
              "
            >
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="
                  flex h-[68px] w-[68px] shrink-0 items-center justify-center
                  overflow-hidden rounded-xl bg-slate-50
                "
                aria-label={product.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(image || '/placeholder.svg')}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="line-clamp-2 text-sm font-extrabold leading-snug !text-slate-950"
                >
                  {product.name}
                </Link>

                <div className="mt-1">
                  <p className="text-sm font-black leading-none text-slate-950">
                    {formatPrice(bestPrice.price)}
                  </p>

                  {bestPrice.label ? (
                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      {bestPrice.label}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 items-center">
                {hasVariants ? (
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="
                      flex h-9 items-center justify-center rounded-xl
                      bg-slate-950 px-3 text-xs font-black !text-white
                      transition hover:bg-slate-800 active:scale-[0.98]
                    "
                  >
                    Ver
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={isAdding}
                    onClick={() => addProduct(product)}
                    className="
                      flex h-9 items-center justify-center rounded-xl
                      bg-slate-950 px-3 text-xs font-black text-white
                      transition hover:bg-slate-800 active:scale-[0.98]
                      disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400
                    "
                  >
                    {isAdding ? '...' : 'Agregar'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
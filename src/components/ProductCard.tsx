'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { formatPrice } from '@/lib/format';
import { imageUrl } from '@/lib/backend';
import { cartEnabledFrom } from '@/lib/checkoutMode';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="9" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
      <path d="M5 6h16l-1.5 9h-13z" />
      <path d="M5 6V4a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function toNumber(value: any) {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function getDiscountedPrice(price: number, discount: number) {
  if (!discount || discount <= 0) return price;
  return Math.round(price * (1 - discount / 100));
}

export function ProductCard({
  p,
  idx,
  checkoutMode,
  whatsappNumber,
  onAddToCart,
}: any) {
  const reduceMotion = useReducedMotion();

  const cartEnabled = cartEnabledFrom(checkoutMode);
  const waDigits = whatsappNumber ? String(whatsappNumber).replace(/\D/g, '') : '';

  const basePrice = toNumber(p.basePrice);
  const salePrice = p.salePrice != null ? toNumber(p.salePrice) : null;
  const currentPrice = salePrice ?? basePrice;

  const transferDiscount = toNumber(p.discountTransfer);
  const mpDiscount = toNumber(p.discountMp);

  const paymentOptions = [
    ...(mpDiscount > 0
      ? [
          {
            key: 'MP',
            label: 'Mercado Pago',
            price: getDiscountedPrice(currentPrice, mpDiscount),
            discount: mpDiscount,
          },
        ]
      : []),
    ...(transferDiscount > 0
      ? [
          {
            key: 'TRANSFER',
            label: 'transferencia',
            price: getDiscountedPrice(currentPrice, transferDiscount),
            discount: transferDiscount,
          },
        ]
      : []),
  ].sort((a, b) => a.price - b.price);

  const bestPayment = paymentOptions[0] ?? null;
  const mainPrice = bestPayment?.price ?? currentPrice;
  const showOriginalPrice = mainPrice < currentPrice;
  const maxDiscount = Math.max(transferDiscount, mpDiscount);

  const hasVariants =
    (Array.isArray(p.variants) && p.variants.length > 0) ||
    (Array.isArray(p.options) && p.options.length > 0);

  const imgSrc = imageUrl(p.images?.[0]?.url) || '/placeholder.svg';

  const initial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 };
  const animate = { opacity: 1, y: 0 };

  return (
    <motion.article
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: reduceMotion ? 0 : Math.min(idx * 0.025, 0.14),
      }}
      className="
        group relative overflow-hidden rounded-[18px] bg-white
        transition duration-300
        hover:-translate-y-[2px]
      "
    >
      <Link href={`/products/${p.slug}`} className="block" aria-label={p.name}>
        <div className="relative overflow-hidden rounded-[18px] bg-white">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-white">
            <Image
              src={imgSrc}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="
                object-contain
                transition-transform duration-500
                group-hover:scale-[1.025]
              "
              priority={idx < 4}
              quality={90}
            />

            {maxDiscount > 0 ? (
              <span
                className="
                  absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1
                  text-[10px] font-black text-slate-950 shadow-sm
                "
              >
                {maxDiscount}% OFF
              </span>
            ) : null}

            {p.isNew ? (
              <span
                className="
                  absolute right-2 top-2 rounded-full bg-sky-500 px-2.5 py-1
                  text-[10px] font-black text-white shadow-sm
                "
              >
                NUEVO
              </span>
            ) : null}
          </div>
        </div>

        <div className="px-2.5 pb-2 pt-3 text-center">
          <h3
            className="
              mx-auto line-clamp-2 min-h-[40px] max-w-[210px]
              text-[14px] font-semibold leading-tight text-slate-950
            "
          >
            {p.name}
          </h3>

          <div className="mt-2 space-y-0.5">
            {showOriginalPrice ? (
              <p className="text-[12px] font-medium text-slate-400 line-through">
                {formatPrice(currentPrice)}
              </p>
            ) : null}

            <p className="text-[16px] font-black leading-none text-slate-950">
              {formatPrice(mainPrice)}
            </p>

            {bestPayment ? (
              <p className="text-[12px] font-medium text-slate-500">
                con {bestPayment.label}
              </p>
            ) : null}

            {!bestPayment && salePrice != null && salePrice < basePrice ? (
              <p className="text-[12px] font-medium text-slate-500">
                precio especial
              </p>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="px-2.5 pb-3">
        {cartEnabled ? (
          hasVariants ? (
            <Link
              href={`/products/${p.slug}`}
              className="
                flex h-10 w-full items-center justify-center rounded-xl
                bg-slate-950 px-3 text-[12px] font-black !text-white
                transition hover:bg-slate-800 active:scale-[0.99]
              "
            >
              Ver opciones
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart?.(p)}
              className="
                flex h-10 w-full items-center justify-center gap-2 rounded-xl
                bg-slate-950 px-3 text-[12px] font-black text-white
                transition hover:bg-slate-800 active:scale-[0.99]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-950
              "
            >
              <CartIcon className="h-4 w-4" />
              Agregar
            </button>
          )
        ) : waDigits ? (
          <a
            href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
              `Hola! Quiero pedir: ${p.name}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex h-10 w-full items-center justify-center gap-2 rounded-xl
              border border-emerald-200 bg-white px-3
              text-[12px] font-black text-emerald-700
              transition hover:bg-emerald-50 active:scale-[0.99]
            "
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            WhatsApp
          </a>
        ) : (
          <Link
            href={`/products/${p.slug}`}
            className="
              flex h-10 w-full items-center justify-center rounded-xl
              border border-slate-200 px-3
              text-[12px] font-black !text-slate-900
              transition hover:border-slate-950
            "
          >
            Ver producto
          </Link>
        )}
      </div>
    </motion.article>
  );
}
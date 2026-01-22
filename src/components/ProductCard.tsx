'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { formatPrice } from '@/lib/format';
import { imageUrl } from '@/lib/backend';
import { cartEnabledFrom } from '@/lib/checkoutMode';

function CashIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M7 12h.01M17 12h.01" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" />
    </svg>
  );
}

export function ProductCard({ p, idx, checkoutMode, whatsappNumber, onAddToCart }: any) {
  const reduceMotion = useReducedMotion();

  const cartEnabled = cartEnabledFrom(checkoutMode);
  const waDigits = whatsappNumber ? String(whatsappNumber).replace(/\D/g, '') : '';

  const hasTransfer = Number(p.discountTransfer || 0) > 0;
  const hasMp = Number(p.discountMp || 0) > 0;

  const base = p.salePrice ?? p.basePrice;

  const transferPrice = hasTransfer ? base * (1 - p.discountTransfer / 100) : null;
  const mpPrice = hasMp ? base * (1 - p.discountMp / 100) : null;

  const imgSrc = imageUrl(p.images?.[0]?.url) || '/placeholder.svg';

  const initial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 };
  const animate = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: reduceMotion ? 0 : Math.min(idx * 0.03, 0.18),
      }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      className="
        group bg-white
        border border-[var(--border)]
        rounded-2xl overflow-hidden
        transition
        hover:-translate-y-[2px]
        hover:shadow-[0_14px_40px_rgba(10,37,64,0.10)]
        hover:border-[color:rgba(255,107,53,0.45)]
        focus-within:ring-2 focus-within:ring-[color:rgba(33,150,243,0.22)]
      "
    >
      <Link href={`/products/${p.slug}`} className="block" aria-label={p.name}>
        {/* ✅ Imagen “estándar anterior”: full width + h auto, sin padding, sin recorte */}
        <div className="relative w-full bg-white">
          <Image
            src={imgSrc}
            alt={p.name}
            width={800}
            height={1200}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.015]"
            priority={idx < 4}
            quality={90}
          />

          {/* Badges */}
          {(p.isNew || p.isHot || p.freeShipping) && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
              {p.isNew && (
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-blue-600 text-white shadow-sm">
                  NUEVO
                </span>
              )}
              {p.isHot && (
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-[var(--accent)] text-white shadow-sm">
                  HOT
                </span>
              )}
              {p.freeShipping && (
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                  ENVÍO GRATIS
                </span>
              )}
            </div>
          )}
        </div>

        {/* Info (ligeramente más grande, como pediste) */}
        <div className="px-3.5 pt-3 pb-2.5">
          <h3 className="font-semibold text-[15px] leading-snug text-[var(--text)] line-clamp-2">
            {p.name}
          </h3>

          <div className="mt-2">
            {hasTransfer ? (
              <>
                <div className="text-[11px] text-gray-400 line-through">{formatPrice(base)}</div>

                <div className="text-[19px] font-extrabold text-emerald-600 leading-none">
                  {formatPrice(transferPrice)}
                </div>

                <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 uppercase">
                  <CashIcon />
                  Transferencia
                </div>
              </>
            ) : hasMp ? (
              <>
                <div className="text-[11px] text-gray-400 line-through">{formatPrice(base)}</div>

                <div className="text-[19px] font-extrabold text-blue-600 leading-none">
                  {formatPrice(mpPrice)}
                </div>

                <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-700 uppercase">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  MercadoPago
                </div>
              </>
            ) : (
              <div className="text-[19px] font-extrabold text-[color:var(--accent)] leading-none">
                {formatPrice(base)}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* CTA */}
      <div className="px-3.5 pb-3.5">
        {cartEnabled ? (
          <button
            type="button"
            onClick={() => onAddToCart?.(p)}
            className="
              w-full rounded-xl
              bg-[var(--primary)] text-white
              font-extrabold
              py-2.5 text-[12px]
              shadow-[0_10px_22px_rgba(33,150,243,0.18)]
              hover:bg-[var(--primary-2)]
              active:translate-y-[1px]
              transition
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]
            "
          >
            Agregar al carrito
          </button>
        ) : waDigits ? (
          <a
            href={`https://wa.me/${waDigits}?text=${encodeURIComponent(`Hola! Quiero pedir: ${p.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-full inline-flex items-center justify-center gap-2
              rounded-xl py-2.5 px-3
              text-[12px] font-bold
              text-[#1f9e57]
              bg-white
              border border-transparent
              shadow-sm
              transition-all duration-300
              hover:-translate-y-[1px]
              active:translate-y-[1px]
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]
            "
            style={{
              background:
                'linear-gradient(white, white) padding-box, linear-gradient(135deg, #25D366, #128C7E) border-box',
            }}
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            Pedir por WhatsApp
          </a>
        ) : (
          <Link
            href={`/products/${p.slug}`}
            className="
              w-full inline-flex items-center justify-center
              rounded-xl border border-[var(--border)]
              py-2.5 text-[12px] font-extrabold
              text-[var(--text)]
              hover:border-[var(--primary)] hover:text-[var(--primary)]
              transition
            "
          >
            Ver producto
          </Link>
        )}
      </div>
    </motion.div>
  );
}

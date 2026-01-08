'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import { imageUrl } from '@/lib/backend';
import { cartEnabledFrom } from '@/lib/checkoutMode';

export function ProductCard({ p, idx, checkoutMode, whatsappNumber }: any) {
  const cartEnabled = cartEnabledFrom(checkoutMode);
  const waDigits = whatsappNumber ? String(whatsappNumber).replace(/\D/g, '') : '';

  const hasTransfer = !!(p.discountTransfer && p.discountTransfer > 0);
  const hasMp = !!(p.discountMp && p.discountMp > 0);

  const base = p.salePrice ?? p.basePrice;

  const transferPrice = hasTransfer ? Math.round(base * (1 - p.discountTransfer / 100)) : null;
  const mpPrice = hasMp ? Math.round(base * (1 - p.discountMp / 100)) : null;

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden transition hover:border-[var(--accent)] hover:shadow-sm">
      <Link href={`/products/${p.slug}`} className="block group" aria-label={p.name}>
        {/* ✅ Imagen adapt: grande, completa, sin aire lateral, sin recorte */}
        <div className="relative w-full bg-white">
          <Image
            src={imageUrl(p.images?.[0]?.url)}
            alt={p.name}
            width={800}
            height={1200}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-auto object-contain"
            priority={idx < 4}
            quality={90}
          />

          {/* Badges sobre la imagen */}
          {(p.isNew || p.isHot || p.freeShipping) && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
              {p.isNew && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-600 text-white shadow-sm">
                  NUEVO
                </span>
              )}
              {p.isHot && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--accent)] text-white shadow-sm">
                  HOT
                </span>
              )}
              {p.freeShipping && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-600 text-white shadow-sm">
                  ENVÍO
                </span>
              )}
            </div>
          )}
        </div>

        {/* ✅ Info compacta (tipo BlackMamba) */}
        <div className="px-2.5 pt-2 pb-2">
          {/* Título: compacto, jerarquía separada del precio */}
          <h3 className="font-semibold text-[13px] leading-snug text-[var(--text)] line-clamp-2">
            {p.name}
          </h3>

          {/* Precio */}
          <div className="mt-1">
            {hasTransfer ? (
              <>
                <div className="text-[10px] text-gray-400 line-through">{formatPrice(base)}</div>
                <div className="text-[17px] font-extrabold text-green-600 leading-none">
                  {formatPrice(transferPrice)}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-green-700 uppercase">
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
                  >
                    <rect x="3" y="7" width="18" height="10" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  Transferencia
                </div>
              </>
            ) : hasMp ? (
              <>
                <div className="text-[10px] text-gray-400 line-through">{formatPrice(base)}</div>
                <div className="text-[17px] font-extrabold text-blue-600 leading-none">
                  {formatPrice(mpPrice)}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-blue-700 uppercase">
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
                  >
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                  MercadoPago
                </div>
              </>
            ) : (
              <div className="text-[17px] font-extrabold text-[color:var(--accent)] leading-none">
                {formatPrice(base)}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* CTA (compacto) */}
      <div className="px-2.5 pb-2">
        {cartEnabled ? (
          <button
            type="button"
            className="w-full rounded-lg bg-blue-600 text-white font-semibold py-1.5 text-xs hover:bg-blue-700 transition"
          >
            Agregar al carrito
          </button>
        ) : waDigits ? (
          <a
            href={`https://wa.me/${waDigits}?text=${encodeURIComponent(`Hola! Quiero pedir: ${p.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-full inline-flex items-center justify-center gap-1.5
              rounded-lg px-3 py-1.5
              text-xs font-semibold
              text-white
              bg-[#25d366]
              border border-black/5
              shadow-[0_6px_14px_rgba(16,185,129,0.18)]
              hover:bg-[#20bd5a]
              active:translate-y-[1px]
              transition
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-offset-2
              focus-visible:ring-[#25d366]
            "
          >
            {/* Ícono WhatsApp */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="opacity-95"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/>
            </svg>

            <span>Pedir por WhatsApp</span>
          </a>
        ) : (
          <Link
            href={`/products/${p.slug}`}
            className="w-full inline-flex items-center justify-center rounded-lg border border-[var(--border)] py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
          >
            Ver producto
          </Link>
        )}
      </div>
    </div>
  );
}

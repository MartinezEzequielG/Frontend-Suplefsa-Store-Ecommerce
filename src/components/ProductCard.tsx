import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import { imageUrl } from '@/lib/backend';

export function ProductCard({ p, idx }: any) {
  const hasTransfer = p.discountTransfer && p.discountTransfer > 0;
  const hasMp = p.discountMp && p.discountMp > 0;
  const transferPrice = hasTransfer
    ? Math.round((p.salePrice ?? p.basePrice) * (1 - p.discountTransfer / 100))
    : null;
  const mpPrice = hasMp
    ? Math.round((p.salePrice ?? p.basePrice) * (1 - p.discountMp / 100))
    : null;

  return (
    <Link
      href={`/products/${p.slug}`}
      className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:border-[var(--accent)]"
      style={{
        animationDelay: `${idx * 60}ms`,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        background: '#fff',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      <div
        className="relative"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          background: '#f8fafc',
        }}
      >
        <Image
          src={imageUrl(p.images?.[0]?.url)}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          priority={idx < 4}
        />
        {/* Opcional: iconos en vez de badges */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 6,
            zIndex: 10,
          }}
        >
          {p.isNew && (
            <span title="Nuevo" style={{ fontSize: 18 }}>🆕</span>
          )}
          {p.isHot && (
            <span title="Más vendido" style={{ fontSize: 18 }}>🔥</span>
          )}
          {p.freeShipping && (
            <span title="Envío gratis" style={{ fontSize: 18 }}>🚚</span>
          )}
        </div>
      </div>
      <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{p.name}</h3>
        {p.description && (
          <p style={{
            fontSize: 13,
            color: '#666',
            marginBottom: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {p.description}
          </p>
        )}
        {/* Precios claros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {hasTransfer ? (
            <>
              <span style={{ color: '#888', textDecoration: 'line-through', fontSize: 14 }}>
                {formatPrice(p.salePrice ?? p.basePrice)}
              </span>
              <span style={{ color: '#059669', fontWeight: 700, fontSize: 18 }}>
                {formatPrice(transferPrice)}
              </span>
              <span style={{ fontSize: 13, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16 }}>💸</span>
                Pagando por transferencia
              </span>
            </>
          ) : hasMp ? (
            <>
              <span style={{ color: '#888', textDecoration: 'line-through', fontSize: 14 }}>
                {formatPrice(p.salePrice ?? p.basePrice)}
              </span>
              <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 18 }}>
                {formatPrice(mpPrice)}
              </span>
              <span style={{ fontSize: 13, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16 }}>💳</span>
                Pagando con MercadoPago
              </span>
            </>
          ) : (
            <span style={{ color: '#111', fontWeight: 700, fontSize: 18 }}>
              {formatPrice(p.salePrice ?? p.basePrice)}
            </span>
          )}
        </div>
        {/* CTA */}
        <button
          style={{
            marginTop: 8,
            background: '#2563eb',
            color: '#fff',
            borderRadius: 8,
            padding: '10px 0',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
            width: '100%',
          }}
          type="button"
        >
          Comprar ahora
        </button>
      </div>
    </Link>
  );
}
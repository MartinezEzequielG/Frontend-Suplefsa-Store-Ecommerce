import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { imageUrl } from '@/lib/backend';

export function ProductCard({ p, idx }: any) {
  return (
    <Link
      key={p.id}
      href={`/products/${p.slug}`}
      className={`product-card ... product-fadein`}
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-[#f8fafc]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl(p.images?.[0]?.url)}
          alt={p.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium tracking-wide text-sm mb-1">{p.name}</h3>
        <p className="text-(--text-muted) group-hover:text-(--accent) transition">
          {formatPrice(p.salePrice ?? p.basePrice)}
        </p>
      </div>
    </Link>
  );
}
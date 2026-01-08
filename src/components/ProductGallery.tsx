'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { imageUrl } from '@/lib/backend';

type Img = { url?: string };

export default function ProductGallery({ images }: { images: Img[] }) {
  const imgs = useMemo(() => (images || []).filter(Boolean), [images]);
  const [idx, setIdx] = useState(0);

  // ✅ ratio dinámico para que el contenedor se adapte a la imagen (sin recorte y sin “aires” raros)
  const [ratio, setRatio] = useState<string>('1 / 1');

  const current = imageUrl(imgs[idx]?.url || '/placeholder.svg');

  return (
    <div className="space-y-3">
      {/* Imagen principal: completa + contenedor con aspect ratio real */}
      <div
        className="relative overflow-hidden rounded-lg border border-(--border) bg-white shadow-sm max-h-[70vh] md:max-h-[520px]"
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={current}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
          onLoadingComplete={(img) => {
            const w = img?.naturalWidth || 1;
            const h = img?.naturalHeight || 1;
            setRatio(`${w} / ${h}`);
          }}
        />
      </div>

      {imgs.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {imgs.map((im, i) => (
            <button
              key={`${im.url}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              className={`rounded-md overflow-hidden border ${
                i === idx ? 'border-(--accent)' : 'border-(--border)'
              } bg-(--surface)`}
              aria-label={`Imagen ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(im.url)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
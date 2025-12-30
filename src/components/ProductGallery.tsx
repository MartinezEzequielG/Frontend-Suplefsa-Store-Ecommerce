'use client';

import { useState } from 'react';
import { imageUrl } from '@/lib/backend';

type Img = { url?: string };
export default function ProductGallery({ images }: { images: Img[] }) {
  const imgs = (images || []).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const current = imageUrl(imgs[idx]?.url || '/placeholder.svg');

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-(--border) bg-(--surface)">
        <img
          src={current}
          alt=""
          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02]"
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
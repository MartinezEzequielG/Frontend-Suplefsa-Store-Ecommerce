'use client';

import { useMemo, useState } from 'react';
import { imageUrl } from '@/lib/backend';

type ProductImage = {
  id?: number | string;
  url?: string | null;
  position?: number | null;
};

export default function ProductMedia({
  images,
  productName,
  badge,
}: {
  images?: ProductImage[];
  productName: string;
  badge?: string | null;
}) {
  const normalizedImages = useMemo(() => {
    return (images || [])
      .filter((img) => !!img?.url)
      .sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0));
  }, [images]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage =
    normalizedImages[selectedIndex]?.url ||
    normalizedImages[0]?.url ||
    '/placeholder.svg';

  const hasMultipleImages = normalizedImages.length > 1;

  return (
    <div className="relative">
      {badge ? (
        <div
          className="
            absolute left-2 top-2 z-20 rounded-xl bg-orange-300
            px-3 py-2 text-xs font-black uppercase leading-tight
            tracking-wide text-white shadow-sm
          "
        >
          {badge}
        </div>
      ) : null}

      <div
        className={
          hasMultipleImages
            ? 'flex flex-col gap-4 lg:grid lg:grid-cols-[72px_minmax(0,1fr)]'
            : 'block'
        }
      >
        {hasMultipleImages ? (
          <div
            className="
              order-2 flex justify-center gap-3 overflow-x-auto pb-1
              lg:order-1 lg:flex-col lg:justify-start lg:overflow-visible lg:pb-0
            "
          >
            {normalizedImages.map((img, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={img.id ?? index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`
                    h-14 w-14 shrink-0 overflow-hidden rounded-2xl border bg-white transition
                    sm:h-16 sm:w-16
                    ${
                      active
                        ? 'border-black shadow-sm'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }
                  `}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl(img.url || '/placeholder.svg')}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : null}

        <div className={hasMultipleImages ? 'order-1 lg:order-2' : ''}>
          <div
            className="
              relative flex min-h-[420px] w-full items-center justify-center
              overflow-hidden rounded-[22px] bg-white
              sm:min-h-[560px] lg:min-h-[700px]
            "
          >
            {hasMultipleImages ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev === 0 ? normalizedImages.length - 1 : prev - 1,
                    )
                  }
                  className="
                    absolute left-2 top-1/2 z-10 hidden -translate-y-1/2
                    text-lg text-slate-300 transition hover:text-slate-700 sm:block
                  "
                  aria-label="Imagen anterior"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev === normalizedImages.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="
                    absolute right-2 top-1/2 z-10 hidden -translate-y-1/2
                    text-lg text-slate-300 transition hover:text-slate-700 sm:block
                  "
                  aria-label="Imagen siguiente"
                >
                  →
                </button>
              </>
            ) : null}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(currentImage)}
              alt={productName}
              className="
                h-[400px] w-auto max-w-full object-contain
                sm:h-[540px]
                lg:h-[680px]
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useMemo, useState } from 'react';

type ProductOption = { id: number; name: string; values: { id: number; value: string }[] };

type Variant = {
  id: number;
  // Nuevo modelo
  onHand?: number | null;
  reserved?: number | null;

  // Legacy (por si algún endpoint aún lo devuelve)
  stock?: number | null;

  options?: { optionValue?: { id: number; value: string } | null }[];
};

function availableQty(v: Variant) {
  // preferimos onHand/reserved; fallback a stock
  if (typeof v.onHand === 'number' || typeof v.reserved === 'number') {
    const onHand = v.onHand ?? 0;
    const reserved = v.reserved ?? 0;
    return onHand - reserved;
  }
  return v.stock ?? 0;
}

export default function VariantsSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: Variant[];
}) {
  const inStock = useMemo(() => {
    return (variants || []).filter((v) => availableQty(v) > 0);
  }, [variants]);

  const [sel, setSel] = useState<Record<number, number | ''>>(() => {
    const init: Record<number, number | ''> = {};
    for (const opt of options || []) init[opt.id] = '';
    return init;
  });

  const selectedValueIds = Object.values(sel).filter((x): x is number => typeof x === 'number');

  const matchedVariant = useMemo(() => {
    if (!options?.length) return null;
    // requiere 1 valor por opción
    if (selectedValueIds.length !== options.length) return null;

    const desiredKey = [...selectedValueIds].sort((a, b) => a - b).join('-');

    return (
      inStock.find((v) => {
        const vIds = (v.options || [])
          .map((o) => o.optionValue?.id)
          .filter((x): x is number => typeof x === 'number');

        if (vIds.length !== options.length) return false;

        const key = [...vIds].sort((a, b) => a - b).join('-');
        return key === desiredKey;
      }) ?? null
    );
  }, [inStock, options, selectedValueIds]);

  const matchedVariantId = matchedVariant?.id ?? '';
  const matchedAvailable = matchedVariant ? availableQty(matchedVariant) : 0;

  if (!options?.length || !variants?.length) return null;

  return (
    <div className="space-y-3">
      {(options || []).map((opt) => (
        <label key={opt.id} className="block text-sm">
          <span className="text-xs text-(--text-muted)">{opt.name}</span>

          <select
            className="mt-1 w-full border border-(--border) rounded-md px-3 py-2 text-sm bg-(--surface)"
            value={sel[opt.id]}
            onChange={(e) =>
              setSel((p) => ({
                ...p,
                [opt.id]: e.target.value ? Number(e.target.value) : '',
              }))
            }
          >
            <option value="">Elegí {opt.name.toLowerCase()}</option>
            {opt.values.map((v) => (
              <option key={v.id} value={v.id}>
                {v.value}
              </option>
            ))}
          </select>
        </label>
      ))}

      {/* Enviamos variantId al carrito */}
      <input type="hidden" name="variantId" value={matchedVariantId} />

      <button
        type="submit"
        className="w-full bg-(--accent) text-white font-semibold py-3 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!matchedVariantId}
      >
        Agregar al carrito
      </button>

      {!matchedVariantId ? (
        <p className="text-xs text-red-600">
          Elegí una combinación válida (con stock) para continuar.
        </p>
      ) : (
        <p className="text-xs text-(--text-muted)">
          Stock disponible: <strong>{matchedAvailable}</strong>
        </p>
      )}
    </div>
  );
}

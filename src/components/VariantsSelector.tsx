'use client';

import { useMemo, useState } from 'react';

type ProductOption = { id: number; name: string; values: { id: number; value: string }[] };

type Variant = {
  id: number;
  onHand?: number | null;
  reserved?: number | null;
  stock?: number | null;
  options?: { optionValue?: { id: number; value: string } | null }[];
};

function availableQty(v: Variant) {
  const onHand = Number(v.onHand ?? 0);
  const reserved = Number(v.reserved ?? 0);

  // modelo nuevo
  if (v.onHand != null || v.reserved != null) return Math.max(0, onHand - reserved);

  // modelo legacy: stock number o stock { available }
  const s: any = v.stock;

  if (typeof s === 'number') return Math.max(0, s);
  if (s && typeof s === 'object') return Math.max(0, Number(s.available ?? 0));

  return 0;
}

export default function VariantsSelector({
  options,
  variants,
  mode = 'CART',
  whatsappNumber,
  productName,
}: {
  options: ProductOption[];
  variants: Variant[];
  mode?: 'CATALOG' | 'CART';
  whatsappNumber?: string;
  productName?: string;
}) {
  const inStock = useMemo(() => (variants || []).filter((v) => availableQty(v) > 0), [variants]);

  const [sel, setSel] = useState<Record<number, number | ''>>(() => {
    const init: Record<number, number | ''> = {};
    for (const opt of options || []) init[opt.id] = '';
    return init;
  });

  const selectedValueIds = Object.values(sel).filter((x): x is number => typeof x === 'number');

  const matchedVariant = useMemo(() => {
    if (!options?.length) return null;
    if (selectedValueIds.length !== options.length) return null;

    const desiredSet = new Set(selectedValueIds);

    return (
      inStock.find((v) => {
        const vIds = (v.options || [])
          .map((o) => o.optionValue?.id)
          .filter((x): x is number => typeof x === 'number');

        return (
          vIds.length >= selectedValueIds.length &&
          selectedValueIds.every((id) => vIds.includes(id))
        );
      }) ?? null
    );
  }, [inStock, options, selectedValueIds]);

  const matchedVariantId = matchedVariant?.id ?? '';
  const matchedAvailable = matchedVariant ? availableQty(matchedVariant) : 0;

  // ✅ Texto humano de la variante (ej: "Chocolate / 2 kg")
  const selectedLabel = useMemo(() => {
    if (!options?.length) return '';
    if (selectedValueIds.length !== options.length) return '';

    const parts = options
      .map((opt) => {
        const valueId = sel[opt.id];
        if (typeof valueId !== 'number') return null;
        const v = opt.values.find((x) => x.id === valueId);
        return v?.value ?? null;
      })
      .filter(Boolean) as string[];

    return parts.join(' / ');
  }, [options, sel, selectedValueIds.length]);

  const waDigits = useMemo(
    () => (whatsappNumber ? whatsappNumber.replace(/\D/g, '') : ''),
    [whatsappNumber],
  );

  const waUrl = useMemo(() => {
    if (!waDigits) return '';

    const lines: string[] = [];
    lines.push('Hola! Quiero pedir este producto.');
    if (productName) lines.push(`Producto: ${productName}`);

    // ✅ Enviar descripción en vez del id interno
    if (matchedVariantId && selectedLabel) lines.push(`Variante: ${selectedLabel}`);

    const text = lines.join('\n');
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(text)}`;
  }, [waDigits, productName, matchedVariantId, selectedLabel]);

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

      <input type="hidden" name="variantId" value={matchedVariantId} />

      {mode === 'CATALOG' ? (
        waDigits ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center bg-[#25d366] hover:bg-[#1ebe57] text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={!matchedVariantId}
            onClick={(e) => {
              if (!matchedVariantId) e.preventDefault();
            }}
          >
            Pedilo por WhatsApp
          </a>
        ) : (
          <button
            type="button"
            className="w-full bg-zinc-200 text-zinc-700 font-semibold py-3 rounded-md cursor-not-allowed"
            disabled
          >
            WhatsApp no configurado
          </button>
        )
      ) : (
        <button
          type="submit"
          className="w-full bg-(--accent) text-white font-semibold py-3 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!matchedVariantId}
        >
          Agregar al carrito
        </button>
      )}

      {!matchedVariantId ? (
        <p className="text-xs text-red-600">Elegí una combinación válida (con stock) para continuar.</p>
      ) : (
        <p className="text-xs text-(--text-muted)">
          Stock disponible: <strong>{matchedAvailable}</strong>
        </p>
      )}
    </div>
  );
}

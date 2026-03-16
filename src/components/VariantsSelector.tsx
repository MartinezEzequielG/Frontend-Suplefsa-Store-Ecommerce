'use client';

import { useMemo, useState } from 'react';

type ProductOption = { id: number; name: string; values: { id: number; value: string }[] };

type Variant = {
  id: number;
  onHand?: number | null;
  reserved?: number | null;
  stock?: number | { available?: number | null } | null;
  options?: { optionValue?: { id: number; value: string } | null }[];
};

function availableQty(v: Variant) {
  const onHand = Number(v.onHand ?? 0);
  const reserved = Number(v.reserved ?? 0);

  if (v.onHand != null || v.reserved != null) {
    return Math.max(0, onHand - reserved);
  }

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
  const allOptions = options || [];
  const allVariants = variants || [];

  const [sel, setSel] = useState<Record<number, number | ''>>(() => {
    const init: Record<number, number | ''> = {};
    for (const opt of allOptions) init[opt.id] = '';
    return init;
  });

  const selectedValueIds = Object.values(sel).filter((x): x is number => typeof x === 'number');
  const allSelected = allOptions.length > 0 && selectedValueIds.length === allOptions.length;

  const matchedVariant = useMemo(() => {
    if (!allOptions.length) return null;
    if (!allSelected) return null;

    return (
      allVariants.find((variant) => {
        const variantIds = (variant.options || [])
          .map((entry) => entry.optionValue?.id)
          .filter((id): id is number => typeof id === 'number');

        return selectedValueIds.every((id) => variantIds.includes(id));
      }) ?? null
    );
  }, [allOptions, allVariants, allSelected, selectedValueIds]);

  const matchedVariantId = matchedVariant?.id ?? '';
  const matchedAvailable = matchedVariant ? availableQty(matchedVariant) : 0;
  const hasStockForMatch = matchedVariant ? matchedAvailable > 0 : false;

  const selectedLabel = useMemo(() => {
    if (!allOptions.length || !allSelected) return '';

    const parts = allOptions
      .map((opt) => {
        const valueId = sel[opt.id];
        if (typeof valueId !== 'number') return null;
        const value = opt.values.find((item) => item.id === valueId);
        return value?.value ?? null;
      })
      .filter(Boolean) as string[];

    return parts.join(' / ');
  }, [allOptions, allSelected, sel]);

  const waDigits = useMemo(
    () => (whatsappNumber ? whatsappNumber.replace(/\D/g, '') : ''),
    [whatsappNumber],
  );

  const waUrl = useMemo(() => {
    if (!waDigits) return '';

    const lines: string[] = [];
    lines.push('Hola! Quiero pedir este producto.');
    if (productName) lines.push(`Producto: ${productName}`);
    if (matchedVariantId && selectedLabel) lines.push(`Variante: ${selectedLabel}`);

    return `https://wa.me/${waDigits}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [waDigits, productName, matchedVariantId, selectedLabel]);

  if (!allOptions.length || !allVariants.length) return null;

  const canSubmit = !!matchedVariantId && hasStockForMatch;
  const missingSelection = selectedValueIds.length < allOptions.length;
  const combinationNotFound = allSelected && !matchedVariantId;
  const noStockForCombination = !!matchedVariantId && !hasStockForMatch;

  return (
    <div className="space-y-3">
      {allOptions.map((opt) => (
        <label key={opt.id} className="block text-sm">
          <span className="text-xs text-(--text-muted)">{opt.name}</span>

          <select
            className="mt-1 w-full border border-(--border) rounded-md px-3 py-2 text-sm bg-(--surface)"
            value={sel[opt.id]}
            onChange={(e) =>
              setSel((prev) => ({
                ...prev,
                [opt.id]: e.target.value ? Number(e.target.value) : '',
              }))
            }
          >
            <option value="">Elegí {opt.name.toLowerCase()}</option>
            {opt.values.map((value) => (
              <option key={value.id} value={value.id}>
                {value.value}
              </option>
            ))}
          </select>
        </label>
      ))}

      <input type="hidden" name="variantId" value={canSubmit ? matchedVariantId : ''} />

      {mode === 'CATALOG' ? (
        waDigits ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center bg-[#25d366] hover:bg-[#1ebe57] text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={!canSubmit}
            onClick={(e) => {
              if (!canSubmit) e.preventDefault();
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
          disabled={!canSubmit}
        >
          Agregar al carrito
        </button>
      )}

      {missingSelection ? (
        <p className="text-xs text-zinc-500">Seleccioná una opción en cada atributo para continuar.</p>
      ) : combinationNotFound ? (
        <p className="text-xs text-red-600">La combinación elegida no existe para este producto.</p>
      ) : noStockForCombination ? (
        <p className="text-xs text-red-600">La combinación elegida no tiene stock disponible.</p>
      ) : canSubmit ? (
        <p className="text-xs text-(--text-muted)">
          Stock disponible: <strong>{matchedAvailable}</strong>
        </p>
      ) : null}
    </div>
  );
}

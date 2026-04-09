'use client';

import { useMemo } from 'react';
import { formatPrice } from '@/lib/format';

type CartItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  product?: { name: string; slug: string; images?: { url: string }[] } | null;
  productVariant?: {
    id: number;
    options?: { optionValue?: { value: string; product?: { name: string } } | null }[];
  } | null;
};

function variantPairs(it: CartItem) {
  const opts = it.productVariant?.options || [];
  return opts
    .map((o) => {
      const ov = o.optionValue;
      const k = ov?.product?.name;
      const v = ov?.value;
      if (!k || !v) return null;
      return { k, v };
    })
    .filter(Boolean) as { k: string; v: string }[];
}

export default function CheckoutSidebar({
  items,
  subtotal,
}: {
  items: CartItem[];
  subtotal: number;
}) {
  // Envío "a convenir" => no se suma al total por ahora
  const total = useMemo(() => subtotal, [subtotal]);

  return (
    <aside className="border border-(--border) rounded-lg p-4 bg-(--surface) h-fit space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Resumen</h2>
        <p className="text-xs text-(--text-muted)">
          Revisá items, envío y total antes de confirmar.
        </p>
      </div>

      <ul className="space-y-3">
        {items.map((it) => {
          const line = it.unitPrice * it.quantity;
          const pairs = variantPairs(it);

          return (
            <li key={it.id} className="text-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{it.product?.name ?? 'Producto'}</p>

                  {pairs.length > 0 && (
                    <div className="mt-1 text-xs text-(--text-muted) space-y-0.5">
                      {pairs.map((p) => (
                        <p key={`${it.id}-${p.k}`}>
                          {p.k}: <span className="font-medium">{p.v}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  <p className="mt-1 text-xs text-(--text-muted)">
                    {it.quantity} × {formatPrice(it.unitPrice)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-(--text-muted)">Subtotal</p>
                  <p className="font-semibold">{formatPrice(line)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-(--border) pt-3 space-y-3">
        {/* Seguimos enviando shippingCost al backend, pero fijo en 0 */}
        <input type="hidden" name="shippingCost" value="0" />

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-(--text-muted)">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-(--text-muted)">Envío</span>
            <span className="font-medium">A convenir</span>
          </div>

          <div className="border-t border-(--border) pt-2 flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>
        </div>

        <p className="text-xs text-(--text-muted)">
          El costo de envío se coordina luego de la compra.
        </p>
      </div>
    </aside>
  );
}
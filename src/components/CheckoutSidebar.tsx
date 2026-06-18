'use client';

import { useMemo, useState } from 'react';
import { formatPrice } from '@/lib/format';

type PaymentMethod = 'MERCADOPAGO' | 'TRANSFER';
type CopiedKey = 'alias' | 'cbu' | null;

type CartItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  product?: {
    name: string;
    slug: string;
    discountTransfer?: number | null;
    discountMp?: number | null;
    images?: { url: string }[];
  } | null;
  productVariant?: {
    id: number;
    options?: { optionValue?: { value: string; product?: { name: string } } | null }[];
  } | null;
};

const transferInfo = {
  alias: process.env.NEXT_PUBLIC_TRANSFER_ALIAS || '',
  cbu: process.env.NEXT_PUBLIC_TRANSFER_CBU || '',
  holder: process.env.NEXT_PUBLIC_TRANSFER_HOLDER || '',
  bank: process.env.NEXT_PUBLIC_TRANSFER_BANK || '',
  note:
    process.env.NEXT_PUBLIC_TRANSFER_NOTE ||
    'Luego de confirmar la compra, envianos el comprobante para coordinar la entrega.',
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

function getDiscountByPaymentMethod(item: CartItem, paymentMethod: PaymentMethod) {
  if (paymentMethod === 'TRANSFER') {
    return Number(item.product?.discountTransfer ?? 0);
  }

  if (paymentMethod === 'MERCADOPAGO') {
    return Number(item.product?.discountMp ?? 0);
  }

  return 0;
}

function getFinalUnitPrice(item: CartItem, paymentMethod: PaymentMethod) {
  const unitPrice = Number(item.unitPrice);
  const discount = getDiscountByPaymentMethod(item, paymentMethod);

  if (!discount || discount <= 0) {
    return unitPrice;
  }

  return unitPrice - (unitPrice * discount) / 100;
}

function CopyButton({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-md border border-green-300 bg-white px-2 py-1 text-[11px] font-semibold text-green-800 transition hover:bg-green-100"
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

function TransferInfoBox({
  copied,
  onCopy,
  compact = false,
}: {
  copied: CopiedKey;
  onCopy: (value: string, key: Exclude<CopiedKey, null>) => void;
  compact?: boolean;
}) {
  return (
    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-xs space-y-2">
      <div>
        <p className="font-semibold text-green-900">Datos para transferencia</p>
        {!compact ? (
          <p className="text-green-800">
            Usá estos datos para realizar el pago una vez confirmada la compra.
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 text-green-950">
        {transferInfo.alias ? (
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0">
              <span className="font-medium">Alias:</span>{' '}
              <span className="break-all">{transferInfo.alias}</span>
            </p>

            <CopyButton
              copied={copied === 'alias'}
              onClick={() => onCopy(transferInfo.alias, 'alias')}
            />
          </div>
        ) : null}

        {transferInfo.cbu ? (
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0">
              <span className="font-medium">CBU/CVU:</span>{' '}
              <span className="break-all">{transferInfo.cbu}</span>
            </p>

            <CopyButton
              copied={copied === 'cbu'}
              onClick={() => onCopy(transferInfo.cbu, 'cbu')}
            />
          </div>
        ) : null}

        {!compact && transferInfo.holder ? (
          <p>
            <span className="font-medium">Titular:</span> {transferInfo.holder}
          </p>
        ) : null}

        {!compact && transferInfo.bank ? (
          <p>
            <span className="font-medium">Banco/Billetera:</span> {transferInfo.bank}
          </p>
        ) : null}
      </div>

      {!compact ? <p className="text-green-800">{transferInfo.note}</p> : null}
    </div>
  );
}

export default function CheckoutSidebar({
  items,
  paymentMethod,
  onPaymentMethodChange,
}: {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (value: PaymentMethod) => void;
}) {
  const [copied, setCopied] = useState<CopiedKey>(null);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const finalUnitPrice = getFinalUnitPrice(item, paymentMethod);
      return acc + finalUnitPrice * item.quantity;
    }, 0);
  }, [items, paymentMethod]);

  const total = useMemo(() => subtotal, [subtotal]);

  const copyToClipboard = async (value: string, key: Exclude<CopiedKey, null>) => {
    if (!value) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <aside className="border border-(--border) rounded-lg p-4 bg-(--surface) h-fit space-y-4 md:sticky md:top-24">
      <input type="hidden" name="shippingCost" value="0" />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />

      <div>
        <h2 className="text-lg font-semibold">Resumen</h2>
        <p className="text-xs text-(--text-muted)">
          Revisá items, envío y total antes de confirmar.
        </p>
      </div>

      <ul className="space-y-3">
        {items.map((it) => {
          const discount = getDiscountByPaymentMethod(it, paymentMethod);
          const finalUnitPrice = getFinalUnitPrice(it, paymentMethod);
          const originalLine = Number(it.unitPrice) * it.quantity;
          const line = finalUnitPrice * it.quantity;
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
                    {it.quantity} × {formatPrice(finalUnitPrice)}
                  </p>

                  {discount > 0 ? (
                    <p className="mt-1 text-xs text-green-700 font-medium">
                      {discount}% OFF por{' '}
                      {paymentMethod === 'TRANSFER' ? 'transferencia' : 'Mercado Pago'}
                    </p>
                  ) : null}
                </div>

                <div className="text-right">
                  <p className="text-xs text-(--text-muted)">Subtotal</p>

                  {discount > 0 ? (
                    <p className="text-xs text-(--text-muted) line-through">
                      {formatPrice(originalLine)}
                    </p>
                  ) : null}

                  <p className="font-semibold">{formatPrice(line)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-(--border) pt-3 space-y-3">
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

      <div className="hidden md:block border-t border-(--border) pt-4 space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="paymentMethod" className="text-sm font-semibold">
            Pago
          </label>

          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          >
            <option value="MERCADOPAGO">Mercado Pago</option>
            <option value="TRANSFER">Transferencia</option>
          </select>
        </div>

        {paymentMethod === 'TRANSFER' ? (
          <>
            <p className="text-xs text-green-700 font-medium">
              Se aplicará el descuento por transferencia en el resumen.
            </p>

            <TransferInfoBox copied={copied} onCopy={copyToClipboard} />
          </>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-md bg-black text-white px-4 py-3 font-semibold transition hover:bg-zinc-800"
        >
          Confirmar compra
        </button>

        <p className="text-xs text-(--text-muted)">
          Al confirmar, reservamos stock de tus variantes y generamos tu orden.
        </p>
      </div>

      <div className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.12)]">
        <div className="mx-auto max-w-md space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-lg font-bold text-slate-900">{formatPrice(total)}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Envío</p>
              <p className="text-sm font-medium text-slate-900">A convenir</p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <select
              value={paymentMethod}
              onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
              className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            >
              <option value="MERCADOPAGO">Mercado Pago</option>
              <option value="TRANSFER">Transferencia</option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white"
            >
              Comprar
            </button>
          </div>

          {paymentMethod === 'TRANSFER' ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-950">
              <div className="flex items-center justify-between gap-2">
                <p className="min-w-0">
                  <span className="font-semibold">Alias:</span>{' '}
                  <span className="break-all">{transferInfo.alias}</span>
                </p>

                {transferInfo.alias ? (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferInfo.alias, 'alias')}
                    className="shrink-0 rounded-md border border-green-300 bg-white px-2 py-1 text-[11px] font-semibold text-green-800"
                  >
                    {copied === 'alias' ? 'Copiado' : 'Copiar'}
                  </button>
                ) : null}
              </div>

              {transferInfo.cbu ? (
                <details className="mt-1">
                  <summary className="cursor-pointer text-green-800 font-medium">
                    Ver CBU/CVU
                  </summary>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="min-w-0 break-all">
                      <span className="font-semibold">CBU/CVU:</span> {transferInfo.cbu}
                    </p>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(transferInfo.cbu, 'cbu')}
                      className="shrink-0 rounded-md border border-green-300 bg-white px-2 py-1 text-[11px] font-semibold text-green-800"
                    >
                      {copied === 'cbu' ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </details>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
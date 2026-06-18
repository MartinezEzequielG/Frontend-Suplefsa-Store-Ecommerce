'use client';

import { useState } from 'react';

type CopiedKey = 'alias' | 'cbu' | null;

type OrderTransferInfoProps = {
  orderId: number;
  alias?: string;
  cbu?: string;
  holder?: string;
  bank?: string;
  note?: string;
  whatsappHref?: string;
};

export default function OrderTransferInfo({
  orderId,
  alias,
  cbu,
  holder,
  bank,
  note,
  whatsappHref,
}: OrderTransferInfoProps) {
  const [copied, setCopied] = useState<CopiedKey>(null);

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
    <section className="rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6 print:hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="inline-flex rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white">
            Pago por transferencia
          </p>

          <h2 className="mt-3 text-xl font-extrabold text-green-950">
            Datos para abonar tu pedido #{orderId}
          </h2>

          <p className="mt-2 text-sm text-green-800">
            Usá estos datos para realizar la transferencia. Después envianos el comprobante
            por WhatsApp para coordinar la entrega o el retiro.
          </p>
        </div>

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Enviar comprobante por WhatsApp
          </a>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {alias ? (
          <div className="rounded-xl border border-green-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Alias
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="min-w-0 break-all text-base font-bold text-green-950">
                {alias}
              </p>

              <button
                type="button"
                onClick={() => copyToClipboard(alias, 'alias')}
                className="shrink-0 rounded-md border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800 transition hover:bg-green-100"
              >
                {copied === 'alias' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        ) : null}

        {cbu ? (
          <div className="rounded-xl border border-green-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              CBU/CVU
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="min-w-0 break-all text-base font-bold text-green-950">
                {cbu}
              </p>

              <button
                type="button"
                onClick={() => copyToClipboard(cbu, 'cbu')}
                className="shrink-0 rounded-md border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800 transition hover:bg-green-100"
              >
                {copied === 'cbu' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        ) : null}

        {holder ? (
          <div className="rounded-xl border border-green-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Titular
            </p>
            <p className="mt-1 text-sm font-semibold text-green-950">{holder}</p>
          </div>
        ) : null}

        {bank ? (
          <div className="rounded-xl border border-green-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Banco/Billetera
            </p>
            <p className="mt-1 text-sm font-semibold text-green-950">{bank}</p>
          </div>
        ) : null}
      </div>

      {note ? (
        <p className="mt-4 text-xs text-green-800">{note}</p>
      ) : null}
    </section>
  );
}
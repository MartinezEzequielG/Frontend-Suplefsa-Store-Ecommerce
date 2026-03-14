'use client';

type Props = {
  whatsappHref?: string;
};

export default function OrderActions({ whatsappHref }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
      >
        Descargar comprobante
      </button>

      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1fb458] transition"
        >
          Enviar comprobante por WhatsApp
        </a>
      ) : null}
    </div>
  );
}
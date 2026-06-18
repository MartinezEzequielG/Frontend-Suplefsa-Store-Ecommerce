'use client';

import { usePathname } from 'next/navigation';

type WhatsappFloatButtonClientProps = {
  whatsappNumber: string;
};

export default function WhatsappFloatButtonClient({
  whatsappNumber,
}: WhatsappFloatButtonClientProps) {
  const pathname = usePathname();

  const isCheckout = pathname?.startsWith('/checkout');

  if (isCheckout) return null;

  const phone = whatsappNumber.replace(/\D/g, '');
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(
    'Hola! Vengo de la web. Tengo una consulta sobre los productos.',
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-[1000] group"
      title="Contactar por WhatsApp"
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#25d366] to-[#128c7e] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(37,211,102,0.4)] group-hover:scale-110 group-active:scale-95">
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-20" />

        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
          aria-hidden="true"
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            fill="white"
          />
          <path
            d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c-.001 2.096.548 4.14 1.595 5.945L0 24l6.335-1.652a12.033 12.033 0 005.71 1.447h.005c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.479-8.45zm-8.475 18.297c-1.777 0-3.518-.478-5.03-1.378l-.36-.214-3.742.98 1-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.993c-.003 5.45-4.437 9.887-9.891 9.887z"
            fill="white"
          />
        </svg>
      </div>

      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm font-semibold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        Escribinos
        <span className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900" />
      </span>
    </a>
  );
}
import Link from 'next/link';
import { getSiteConfig } from '@/lib/site';
import { imageUrl } from '@/lib/backend';

export default async function HeroEcommerce({
  brandName = 'Suplementación Formosa',
  whatsappNumber,
}: {
  brandName?: string;
  whatsappNumber?: string;
}) {
  const site = await getSiteConfig();
  const logoUrl = site?.logoUrl ? imageUrl(site.logoUrl) : null;
  const waDigits = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2540] via-[#1565c0] to-[#2196f3] border-b border-white/10">
      {/* Logo visible de fondo (derecha) */}
      {logoUrl && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 sm:pr-16 md:pr-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt=""
            className="h-[300px] sm:h-[400px] md:h-[500px] w-auto opacity-[0.18]"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Gradientes atmosféricos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-black/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 md:py-28">
        <div className="max-w-2xl">
          {/* Nombre grande (izquierda) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-4 leading-[1.05] tracking-tight">
            {brandName}
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
            Tu tienda de suplementación deportiva de confianza.
            <strong className="block mt-1 text-white">
              Envíos a todo el país • Asesoramiento real • Calidad garantizada
            </strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className="
                inline-flex items-center justify-center
                bg-white text-[#0a2540]
                font-extrabold px-6 py-3.5 rounded-xl text-sm
                shadow-xl hover:shadow-2xl hover:scale-[1.02]
                transition
              "
            >
              Ver catálogo completo
            </Link>

            {waDigits ? (
              <a
                href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
                  'Hola! Quiero consultar sobre suplementos.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center gap-2
                  border-2 border-white/30
                  bg-white/10 hover:bg-white/15
                  text-white font-bold
                  px-6 py-3.5 rounded-xl text-sm
                  backdrop-blur-sm
                  transition
                "
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
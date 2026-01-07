import { getSiteConfig, type SiteConfig } from '@/lib/site';

export default async function AboutPage() {
  const site: SiteConfig = await getSiteConfig();
  const brandName = site?.name || 'Suplementacion Formosa';

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          {brandName}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Más de <strong>3 años</strong> acompañando y suplementando a todo un país.
        </p>
      </section>

      {/* Historia */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra historia</h2>
            <div className="space-y-4 text-gray-700 leading-7">
              <p>
                En <strong>{brandName}</strong>, nacimos con una misión simple pero poderosa:
                llevar suplementación deportiva de primera línea a cada atleta, desde principiantes
                hasta profesionales, en toda la Argentina.
              </p>
              <p>
                Comenzamos con pocos suplementos en un showroom pero con un objetivo en claro, ser los mejores en este ámbito así ayudando a miles de Argentinos.
                Hoy en día contamos con 2 locales en Formosa capital y cientos de envíos por mes a todo el país.
                Así eligiéndonos en cada rincón de la Argentina
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-orange-100 border border-gray-200">
              {/* Placeholder para imagen */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                [Imagen de la tienda / equipo]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Nuestros valores</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
          {
            title: 'Calidad',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            ),
            desc: 'Solo marcas reconocidas y productos con respaldo científico.',
          },
          {
            title: 'Transparencia',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 5C7.5 5 3.73 7.91 2 12c1.73 4.09 5.5 7 10 7s8.27-2.91 10-7c-1.73-4.09-5.5-7-10-7z" />
              </svg>
            ),
            desc: 'Te asesoramos sin presión, con información clara y honesta.',
          },
          {
            title: 'Comunidad',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            ),
            desc: 'Somos parte de tu progreso: te acompañamos en cada etapa.',
          },
          {
            title: 'Accesibilidad',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            ),
            desc: 'Envíos rápidos y precios justos para toda la provincia.',
          },
          {
            title: 'Resultados',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            ),
            desc: 'No vendemos promesas: vendemos lo que funciona.',
          },
          {
            title: 'Compromiso',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ),
            desc: 'Tu satisfacción y salud son nuestra prioridad número uno.',
          }].map((v, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex justify-center mb-3 text-blue-600">{v.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-600 leading-6">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Local */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8 sm:p-12 border border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-gray-700 leading-7 mb-6">
              En {brandName}, no sos solo un número de pedido. Somos tu tienda de suplementación
              de confianza: te conocemos, te escuchamos y te ayudamos a encontrar
              exactamente lo que necesitás para tu objetivo.
            </p>
            <p className="text-gray-700 leading-7 font-semibold">
              Visitanos en nuestro local o pedí online. Estamos para vos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Tenés dudas o querés asesoramiento?</h2>
        <p className="text-gray-600 mb-6">
          Escribinos por WhatsApp o pasá por nuestro local. Te ayudamos a elegir lo mejor para vos.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {site?.whatsappNumber && (
            <a
              href={`https://wa.me/${site.whatsappNumber.replace(/\D/g, '')}?text=Hola! Quiero saber más sobre ustedes.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe57] text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path
                  d="M16 2C8.268 2 2 8.268 2 16c0 2.44.628 4.736 1.732 6.732L2.004 28.996l6.464-1.696A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6c-2.236 0-4.344-.632-6.128-1.728l-.44-.264-4.56 1.196 1.216-4.456-.288-.456A11.567 11.567 0 014.4 16c0-6.408 5.192-11.6 11.6-11.6 6.408 0 11.6 5.192 11.6 11.6 0 6.408-5.192 11.6-11.6 11.6z"
                  fill="currentColor"
                />
                <path
                  d="M22.003 18.59c-.302-.151-1.787-.882-2.063-.983-.276-.101-.477-.151-.678.151-.201.302-.778.983-.954 1.184-.176.201-.352.226-.654.075-.302-.151-1.276-.47-2.43-1.497-.899-.803-1.507-1.795-1.684-2.097-.176-.302-.019-.465.132-.616.136-.135.302-.352.453-.528.151-.176.201-.302.302-.503.101-.201.05-.377-.025-.528-.075-.151-.678-1.634-.929-2.237-.245-.59-.495-.509-.678-.518-.176-.008-.377-.01-.578-.01-.201 0-.528.075-.805.377-.276.302-1.053 1.03-1.053 2.509 0 1.479 1.078 2.909 1.228 3.111.151.201 2.124 3.247 5.149 4.425.72.311 1.282.497 1.721.636.722.23 1.38.198 1.899.12.579-.086 1.787-.729 2.041-1.434.252-.705.252-1.309.176-1.434-.075-.126-.276-.201-.578-.352z"
                  fill="currentColor"
                />
              </svg>
              Contactanos por WhatsApp
            </a>
          )}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Formulario de contacto
          </a>
        </div>
      </section>
    </main>
  );
}
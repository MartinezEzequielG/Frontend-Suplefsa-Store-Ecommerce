import { getSiteConfig } from '@/lib/site';
import InstagramLink from '@/components/InstagramLink';

function mapsEmbedFromQuery(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export default async function ContactPage() {
  const site = await getSiteConfig();
  const whatsappNumber = site?.whatsappNumber || '';
  const waDigits = whatsappNumber.replace(/\D/g, '');
  const address = site?.address || '';
  const contactEmail = site?.contactEmail || '';
  const socials = (site?.socialLinks || []).filter((s: any) => s?.url);

  const locations = [
    {
      name: 'Showroom Norte',
      address: 'Av. Circunvalación 2244, Formosa Capital',
      phone: '+54 370 470-1300',
      hours: 'Lun-Vie 9-13hs / 17-21hs • Sáb 9-12hs',
    },
    {
      name: 'Local Centro',
      address: 'Pringles 378, Formosa Capital',
      phone: '+54 370 521-6381',
      hours: 'Lun-Vie 9-13hs / 17-21hs • Sáb 9-12hs',
    },
  ];

  const faqs = [
    { q: '¿Hacen envíos?', a: 'Sí, enviamos a toda Argentina. Costo y tiempo según zona.' },
    { q: '¿Puedo retirar en el local?', a: 'Sí, podés retirar gratis en cualquiera de nuestros showrooms.' },
    { q: '¿Aceptan MercadoPago?', a: 'Sí, aceptamos MercadoPago, transferencia y efectivo.' },
    { q: '¿Dan asesoramiento?', a: 'Sí, nuestro equipo te ayuda a elegir según tu objetivo.' },
  ];

  const whatsappLinks = [
    { label: 'Consulta sobre productos', text: 'Hola! Quiero consultar sobre un producto.' },
    { label: 'Estado de mi pedido', text: 'Hola! Quiero saber el estado de mi pedido.' },
    { label: 'Asesoramiento personalizado', text: 'Hola! Necesito asesoramiento para elegir suplementos.' },
    { label: 'Horarios y ubicación', text: 'Hola! Quiero saber horarios y cómo llegar.' },
  ];

  return (
    <main className="relative">
      {/* Hero alineado a paleta: azul + naranja */}
      <div className="relative bg-gradient-to-br from-[#1565c0] via-[#2196f3] to-[#42a5f5] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3">
            Hablemos
          </h1>
          <p className="text-base sm:text-lg text-blue-50 max-w-xl mx-auto">
            Escribinos, llamanos o vení a conocernos. Te respondemos al instante.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Acciones rápidas de contacto */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-4">Contacto directo</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {waDigits && whatsappLinks.map((link, i) => (
              <a
                key={i}
                href={`https://wa.me/${waDigits}?text=${encodeURIComponent(link.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-bold text-sm text-gray-900">{link.label}</p>
                  <p className="text-xs text-gray-500">Respuesta inmediata</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-green-500 transition">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}
          </div>

          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="mt-3 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {contactEmail}
            </a>
          )}
        </section>

        {/* FAQs colapsables */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 hover:bg-gray-50 transition">
                  {faq.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-open:rotate-180 transition">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Locales con horarios */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">Nuestros locales</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {locations.map((loc, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                  <h3 className="font-black text-white mb-1">{loc.name}</h3>
                  <p className="text-xs text-blue-100">{loc.hours}</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-gray-700">{loc.address}</span>
                  </div>
                  <a
                    href={`tel:${loc.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {loc.phone}
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Cómo llegar
                  </a>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={mapsEmbedFromQuery(loc.address)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${loc.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Redes */}
        {socials.length > 0 && (
          <section className="mt-10 text-center">
            <h3 className="text-sm font-bold text-gray-700 mb-3">También estamos en</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {socials.map((s: any) => {
                if (s.label?.toLowerCase().includes('instagram')) {
                  const username =
                    s.label.replace(/instagram|@/gi, '').trim() ||
                    s.url.split('/').filter(Boolean).pop();

                  return (
                    <InstagramLink
                      key={s.id}
                      url={s.url}
                      username={username}
                      size={20}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-pink-400 hover:shadow-sm transition"
                    />
                  );
                }
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-400 transition"
                  >
                    {s.label}
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
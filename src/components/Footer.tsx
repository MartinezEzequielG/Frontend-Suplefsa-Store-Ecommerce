import Link from 'next/link';
import { getSiteConfig } from '@/lib/site';
import { cartEnabledFrom } from '@/lib/checkoutMode';

export async function Footer() {
  const site = await getSiteConfig();
  const cartEnabled = cartEnabledFrom((site as any)?.checkoutMode);
  const year = new Date().getFullYear();

  const brandName = site?.name || 'Suplementacion Formosa';
  const logoUrl = site?.logoUrl || null;
  const socials = (site?.socialLinks || []).filter((s: any) => s?.url);
  const address = site?.address || '';
  const whatsapp = site?.whatsappNumber || '';
  const contactEmail = site?.contactEmail || '';
  const waDigits = whatsapp ? whatsapp.replace(/\D/g, '') : '';

  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 opacity-60" />
      
      <div className="relative border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          {/* Grid principal: mobile 1 columna, tablet 2, desktop 3 */}
          <div className="grid gap-8 sm:gap-10 md:gap-12 md:grid-cols-[1.2fr_1fr_1fr] mb-8 sm:mb-10">
            
            {/* Columna 1: Marca + contacto */}
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-3 sm:mb-4 group">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={brandName}
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                    {brandName}
                  </span>
                )}
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5 max-w-xs">
                Potenciá tu rendimiento con suplementación de calidad. 
                <strong className="block mt-1 text-gray-800">Tu progreso, nuestra prioridad.</strong>
              </p>

              {/* Contacto */}
              <div className="space-y-2.5 sm:space-y-3 text-sm">
                {waDigits && (
                  <a
                    href={`https://wa.me/${waDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 sm:gap-3 text-gray-700 hover:text-green-600 transition group"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-green-600 sm:w-[18px] sm:h-[18px]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span className="font-medium text-sm break-all">{whatsapp || `+${waDigits}`}</span>
                  </a>
                )}
                {contactEmail && (
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="flex items-center gap-2.5 sm:gap-3 text-gray-700 hover:text-blue-600 transition group"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[18px] sm:h-[18px]">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm break-all">{contactEmail}</span>
                  </a>
                )}
                {address && (
                  <div className="flex items-start gap-2.5 sm:gap-3 text-gray-600">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[18px] sm:h-[18px]">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <span className="leading-relaxed text-sm">{address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Columna 2: Links de navegación */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 sm:mb-4">Navegación</h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {[
                  { href: '/products', label: 'Catálogo' },
                  { href: '/about', label: 'Nosotros' },
                  { href: '/contact', label: 'Contacto' },
                  { href: '/cart', label: 'Carrito' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-700 hover:text-blue-600 transition inline-flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-blue-600 transition" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Newsletter + Redes */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 sm:mb-4">Mantenete conectado</h4>
              
              {/* Newsletter */}
              <form className="mb-4 sm:mb-5">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-20 sm:pr-24 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 sm:px-4 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                  >
                    Enviar
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">Ofertas y novedades en tu inbox.</p>
              </form>

              {/* Redes sociales */}
              {socials.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2 sm:mb-3">Seguinos</p>
                  <div className="flex flex-wrap gap-2">
                    {socials.map((s: any) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divisor con gradiente */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4 sm:mb-6" />

          {/* Footer bottom: mobile stack, desktop inline */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
            <p className="flex flex-wrap items-center gap-1 sm:gap-2">
              © {year} <span className="font-semibold text-gray-700">{brandName}</span> — Todos los derechos reservados.
            </p>
            
            <a
              href="https://innova-webdev.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group w-fit"
            >
              <span>Desarrollado por</span>
              <span className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                Innova
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

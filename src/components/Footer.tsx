import Link from 'next/link';
import { getSiteConfig } from '@/lib/site';
import { cartEnabledFrom } from '@/lib/checkoutMode';
import InnovaBrand from '@/components/InnovaBrand';
import InstagramLink from '@/components/InstagramLink';

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="1.5" />
      <circle cx="18" cy="19" r="1.5" />
      <path d="M5.5 19H6" />
      <path d="M15.5 19H16" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SupportIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 13v2a4 4 0 004 4h1" />
      <path d="M20 13v2a4 4 0 01-4 4h-1" />
      <path d="M6 13a6 6 0 0112 0" />
      <path d="M6 13v-1a6 6 0 0112 0v1" />
      <path d="M8 13v4" />
      <path d="M16 13v4" />
    </svg>
  );
}

function clampWaDigits(input?: string) {
  return input ? input.replace(/\D/g, '') : '';
}

export async function Footer() {
  const site = await getSiteConfig();
  const year = new Date().getFullYear();

  const brandName = site?.name || 'Suplementación Formosa';
  const logoUrl = site?.logoUrl;
  const cartEnabled = cartEnabledFrom(site?.checkoutMode);

  const contactEmail = site?.contactEmail;
  const address = site?.address;
  const whatsapp = site?.whatsappNumber;

  const socials = (site?.socialLinks || []).filter((s: any) => s?.url);
  const isInstagram = (s: any) => String(s?.label || '').toLowerCase().includes('instagram');

  const instagramLinks = socials.filter(isInstagram);
  const otherSocials = socials.filter((s: any) => !isInstagram(s));

  const waDigits = clampWaDigits(whatsapp);

  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Footer-only CSS (acorde al look actual: blanco + azul, glass, líneas, shine) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .sff{
            position: relative;
            border-top: 1px solid var(--border);
            background:
              linear-gradient(180deg, rgba(33,150,243,0.04), rgba(33,150,243,0.02) 55%, rgba(255,255,255,1) 100%);
          }

          /* overlay de grilla sutil (sin orbs) */
          .sff-grid{
            position:absolute; inset:0;
            background-image:
              linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px);
            background-size: 54px 54px;
            opacity: .22;
            pointer-events:none;
            mask-image: radial-gradient(circle at 30% 10%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 62%);
          }

          /* separador "corte" como venís usando en secciones */
          .sff-cut{
            position:absolute; left:0; right:0; top:-1px; height: 16px;
            background: linear-gradient(90deg, rgba(33,150,243,0.18), rgba(33,150,243,0.08), rgba(33,150,243,0.16));
            clip-path: polygon(0 0, 100% 35%, 100% 100%, 0 100%);
            pointer-events:none;
          }

          .sff-wrap{
            position: relative;
            z-index: 1;
          }

          /* top CTA band (no texto largo, solo acciones y confianza) */
          .sff-band{
            border: 1px solid rgba(2,6,23,0.08);
            background: rgba(255,255,255,0.70);
            backdrop-filter: blur(10px) saturate(160%);
            -webkit-backdrop-filter: blur(10px) saturate(160%);
            box-shadow: 0 18px 55px rgba(2,6,23,0.07);
            border-radius: 22px;
            overflow: hidden;
          }
          .sff-bandRow{
            display:grid;
            gap: 10px;
            grid-template-columns: 1fr;
            padding: 14px;
          }
          @media(min-width: 640px){
            .sff-bandRow{
              grid-template-columns: 1.2fr .9fr .9fr;
              align-items: center;
              padding: 18px;
            }
          }

          .sff-brand{
            display:flex;
            align-items:center;
            gap: 12px;
            min-width: 0;
          }

          .sff-logo{
            width:auto;
            height: 44px;
            opacity:.95;
            filter: drop-shadow(0 18px 45px rgba(2,6,23,0.14));
          }
          @media(min-width: 640px){
            .sff-logo{ height: 52px; }
          }

          .sff-pill{
            border: 1px solid rgba(33,150,243,0.18);
            background: rgba(33,150,243,0.08);
            border-radius: 16px;
          }

          .sff-cta{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap: 12px;
            padding: 12px 14px;
            border-radius: 18px;
            border: 1px solid rgba(2,6,23,0.10);
            background: rgba(255,255,255,0.72);
            backdrop-filter: blur(8px) saturate(160%);
            -webkit-backdrop-filter: blur(8px) saturate(160%);
            transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
            box-shadow: 0 12px 34px rgba(2,6,23,0.06);
          }
          .sff-cta:hover{
            transform: translateY(-2px);
            border-color: rgba(33,150,243,0.30);
            box-shadow: 0 22px 60px rgba(2,6,23,0.10), 0 18px 45px rgba(33,150,243,0.10);
            background: rgba(255,255,255,0.88);
          }
          .sff-ctaIcon{
            width: 44px; height: 44px;
            border-radius: 16px;
            display:grid;
            place-items:center;
            color: var(--primary-2);
            background: rgba(33,150,243,0.10);
            border: 1px solid rgba(33,150,243,0.18);
            flex: 0 0 auto;
          }

          .sff-title{
            font-size: 12px;
            font-weight: 900;
            letter-spacing: .12em;
            text-transform: uppercase;
            color: rgba(15,23,42,0.80);
            margin-bottom: 8px;
          }

          .sff-link{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap: 10px;
            padding: 12px 12px;
            border-radius: 16px;
            border: 1px solid rgba(2,6,23,0.08);
            background: rgba(255,255,255,0.60);
            transition: border-color .18s ease, transform .18s ease, background .18s ease;
          }
          .sff-link:hover{
            transform: translateY(-1px);
            border-color: rgba(33,150,243,0.25);
            background: rgba(255,255,255,0.85);
          }

          /* social chip */
          .sff-socialChip{
            display:inline-flex;
            align-items:center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 999px;
            border: 1px solid rgba(2,6,23,0.10);
            background: rgba(255,255,255,0.70);
            transition: border-color .18s ease, transform .18s ease, background .18s ease;
          }
          .sff-socialChip:hover{
            transform: translateY(-1px);
            border-color: rgba(33,150,243,0.28);
            background: rgba(255,255,255,0.90);
          }

          /* bottom bar */
          .sff-bottom{
            border-top: 1px solid rgba(2,6,23,0.08);
            background: rgba(255,255,255,0.55);
            backdrop-filter: blur(10px) saturate(160%);
            -webkit-backdrop-filter: blur(10px) saturate(160%);
          }

          @media (prefers-reduced-motion: reduce){
            .sff-cta, .sff-link, .sff-socialChip { transition:none !important; transform:none !important; }
          }
        `,
        }}
      />

      <div className="sff">
        <div className="sff-grid" aria-hidden="true" />
        <div className="sff-cut" aria-hidden="true" />

        <div className="sff-wrap">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14">
            {/* TOP BAND: marca + 2 CTAs (densidad + pro, sin "IA cards" típicas) */}
            <div className="sff-band">
              <div className="sff-bandRow">
                {/* Brand */}
                <div className="sff-brand">
                  <Link href="/" className="inline-flex items-center gap-3 min-w-0" aria-label="Ir al inicio">
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt={brandName} className="sff-logo" />
                    ) : (
                      <span className="text-xl sm:text-2xl font-extrabold text-[color:var(--text)] truncate">{brandName}</span>
                    )}
                  </Link>
                </div>

                {/* CTA 1 */}
                <Link href="/products" className="sff-cta" aria-label="Ir al catálogo">
                  <span className="flex items-center gap-12">
                    <span className="sff-ctaIcon">
                      <TruckIcon className="w-6 h-6" />
                    </span>
                    <span className="min-w-0">
                      <div className="text-sm font-extrabold text-[color:var(--text)]">Catálogo</div>
                      <div className="text-xs text-[color:var(--text-muted)]">Explorá por categoría</div>
                    </span>
                  </span>
                  <ArrowIcon className="w-5 h-5 text-[var(--primary-2)] opacity-70" />
                </Link>

                {/* CTA 2 */}
                {waDigits ? (
                  <a
                    href={`https://wa.me/${waDigits}?text=${encodeURIComponent('Hola! Quiero hacer una consulta 👋')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sff-cta"
                    aria-label="Escribir por WhatsApp"
                  >
                    <span className="flex items-center gap-12">
                      <span className="sff-ctaIcon" style={{ color: 'rgb(22 163 74)' }}>
                        {/* WhatsApp icon */}
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <div className="text-sm font-extrabold text-[color:var(--text)]">WhatsApp</div>
                        <div className="text-xs text-[color:var(--text-muted)]">Asesoramiento directo</div>
                      </span>
                    </span>
                    <ArrowIcon className="w-5 h-5 text-[var(--primary-2)] opacity-70" />
                  </a>
                ) : (
                  <div className="sff-cta" aria-hidden="true">
                    <span className="flex items-center gap-12">
                      <span className="sff-ctaIcon">
                        <SupportIcon className="w-6 h-6" />
                      </span>
                      <span className="min-w-0">
                        <div className="text-sm font-extrabold text-[color:var(--text)]">Soporte</div>
                        <div className="text-xs text-[color:var(--text-muted)]">Consultas y ayuda</div>
                      </span>
                    </span>
                    <ArrowIcon className="w-5 h-5 text-[var(--primary-2)] opacity-70" />
                  </div>
                )}
              </div>
            </div>

            {/* BODY: 3 columnas, pero con layout tipo “panel” + chips, no footer clásico */}
            <div className="mt-10 sm:mt-12 grid gap-8 sm:gap-10 md:grid-cols-12 pb-10 sm:pb-12">
              {/* Col 1: info + dire/ mail (panel) */}
              <div className="md:col-span-5">
                <div className="rounded-2xl border border-[rgba(2,6,23,0.08)] bg-white/70 backdrop-blur-md shadow-[0_18px_55px_rgba(2,6,23,0.06)] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="h-11 w-11 rounded-2xl grid place-items-center bg-[rgba(33,150,243,0.10)] border border-[rgba(33,150,243,0.18)] text-[var(--primary-2)]">
                      <ShieldIcon className="w-6 h-6" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-[color:var(--text)]">Compra segura</div>
                      <div className="text-xs text-[color:var(--text-muted)]">Productos verificados y atención real</div>
                    </div>
                  </div>

                  {(contactEmail || address) && (
                    <div className="mt-5 grid gap-2">
                      {contactEmail && (
                        <a
                          href={`mailto:${contactEmail}`}
                          className="sff-link"
                          aria-label="Enviar email"
                        >
                          <span className="min-w-0">
                            <div className="text-sm font-semibold text-[color:var(--text)]">Email</div>
                            <div className="text-xs text-[color:var(--text-muted)] break-all">{contactEmail}</div>
                          </span>
                          <ArrowIcon className="w-5 h-5 text-[var(--primary-2)] opacity-70" />
                        </a>
                      )}

                      {address && (
                        <div className="sff-link">
                          <span className="min-w-0">
                            <div className="text-sm font-semibold text-[color:var(--text)]">Dirección</div>
                            <div className="text-xs text-[color:var(--text-muted)]">{address}</div>
                          </span>
                          <span className="text-[var(--primary-2)] opacity-70">•</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Col 2: navegación en “tiles” */}
              <div className="md:col-span-4">
                <div className="sff-title">Navegación</div>
                <div className="grid gap-2.5">
                  {[
                    { href: '/products', label: 'Tienda' },
                    { href: '/about', label: 'Nosotros' },
                    { href: '/contact', label: 'Contacto' },
                    ...(cartEnabled ? [{ href: '/cart', label: 'Carrito' }] : []),
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="sff-link">
                      <span className="text-sm font-semibold text-[color:var(--text)]">{link.label}</span>
                      <ArrowIcon className="w-5 h-5 text-[var(--primary-2)] opacity-70" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Col 3: redes + “chips” */}
              <div className="md:col-span-3">
                <div className="sff-title">Redes</div>

                {instagramLinks.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-3">
                      {instagramLinks.map((s: any) => (
                        <div key={s.id} className="sff-socialChip">
                          <InstagramLink url={s.url} size={22} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {otherSocials.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {otherSocials.map((s: any) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sff-socialChip"
                      >
                        <span className="text-sm font-semibold text-[color:var(--text)]">{s.label}</span>
                        <ArrowIcon className="w-4 h-4 text-[var(--primary-2)] opacity-70" />
                      </a>
                    ))}
                  </div>
                )}

                {/* fallback si no hay redes */}
                {instagramLinks.length === 0 && otherSocials.length === 0 && (
                  <div className="rounded-2xl border border-[rgba(2,6,23,0.08)] bg-white/70 p-4 text-sm text-[color:var(--text-muted)]">
                    Agregá tus redes desde el panel para que aparezcan acá.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="sff-bottom">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-[rgba(15,23,42,0.55)]">
                <p className="flex flex-wrap items-center gap-1 sm:gap-2">
                  © {year} <span className="font-semibold text-[color:var(--text)]">{brandName}</span> — Todos los derechos reservados.
                </p>

                <InnovaBrand className="flex items-center gap-2 text-[rgba(15,23,42,0.55)] hover:text-[color:var(--text)] transition group w-fit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

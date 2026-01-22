import { SectionFadeIn } from '@/components/SectionFadeIn';
import { getSiteConfig, type SiteConfig } from '@/lib/site';

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
      {children}
    </div>
  );
}

function ValueItem({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        <IconWrap>{icon}</IconWrap>
        <div>
          <h3 className="text-[16px] font-extrabold text-[var(--text)]">{title}</h3>
          <p className="mt-1 text-[14px] leading-6 text-[var(--text-muted)]">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>
      <div className="mt-1 text-[18px] font-extrabold text-[var(--text)]">{value}</div>
    </div>
  );
}

function WhatsAppButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn wa-cta"
      style={{
        background: '#25d366',
        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.28)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 2C8.268 2 2 8.268 2 16c0 2.44.628 4.736 1.732 6.732L2.004 28.996l6.464-1.696A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6c-2.236 0-4.344-.632-6.128-1.728l-.44-.264-4.56 1.196 1.216-4.456-.288-.456A11.567 11.567 0 014.4 16c0-6.408 5.192-11.6 11.6-11.6 6.408 0 11.6 5.192 11.6 11.6 0 6.408-5.192 11.6-11.6 11.6z"
          fill="currentColor"
        />
        <path
          d="M22.003 18.59c-.302-.151-1.787-.882-2.063-.983-.276-.101-.477-.151-.678.151-.201.302-.778.983-.954 1.184-.176.201-.352.226-.654.075-.302-.151-1.276-.47-2.43-1.497-.899-.803-1.507-1.795-1.684-2.097-.176-.302-.019-.465.132-.616.136-.135.302-.352.453-.528.151-.176.201-.302.302-.503.101-.201.05-.377-.025-.528-.075-.151-.678-1.634-.929-2.237-.245-.59-.495-.509-.678-.518-.176-.008-.377-.01-.578-.01-.201 0-.528.075-.805.377-.276.302-1.053 1.03-1.053 2.509 0 1.479 1.078 2.909 1.228 3.111.151.201 2.124 3.247 5.149 4.425.72.311 1.282.497 1.721.636.722.23 1.38.198 1.899.12.579-.086 1.787-.729 2.041-1.434.252-.705.252-1.309.176-1.434-.075-.126-.276-.201-.578-.352z"
          fill="currentColor"
        />
      </svg>
      {children}
    </a>
  );
}

export default async function AboutPage() {
  const site: SiteConfig = await getSiteConfig();
  const brandName = site?.name || 'Suplementación Formosa';

  const whatsappNumber = site?.whatsappNumber?.replace(/\D/g, '');
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hola! Quiero saber más sobre ustedes.'
      )}`
    : null;

  const values = [
    {
      title: 'Calidad',
      desc: 'Marcas reconocidas y productos verificados. Priorizamos lo confiable.',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--primary)]"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
    },
    {
      title: 'Transparencia',
      desc: 'Te asesoramos con info clara y honesta, sin presión.',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--primary)]"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 5C7.5 5 3.73 7.91 2 12c1.73 4.09 5.5 7 10 7s8.27-2.91 10-7c-1.73-4.09-5.5-7-10-7z" />
        </svg>
      ),
    },
    {
      title: 'Comunidad',
      desc: 'Acompañamos tu progreso: entrenes por salud o por rendimiento.',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--primary)]"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      title: 'Accesibilidad',
      desc: 'Comprá fácil: envíos ágiles y atención rápida cuando lo necesitás.',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--primary)]"
        >
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      title: 'Resultados',
      desc: 'No vendemos promesas: te ayudamos a elegir lo que suma.',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--primary)]"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      title: 'Compromiso',
      desc: 'Tu experiencia es prioridad: antes, durante y después de comprar.',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--primary)]"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionFadeIn>
        {/* HERO */}
        <section className="card relative overflow-hidden p-7 sm:p-10 animate-slide-up">
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">Envíos a todo el país</span>
              <span className="chip">Asesoramiento real</span>
              <span className="chip">Atención rápida</span>
            </div>

            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)]">
              {brandName}
            </h1>

            <p className="mt-4 max-w-2xl text-[15px] sm:text-[18px] leading-7 text-[var(--text-muted)]">
              Más de <span className="font-extrabold text-[var(--text)]">3 años</span> acompañando y suplementando
              a todo un país.
            </p>

            {/* ✅ CTA: solo Contacto + Catálogo */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/contact" className="btn btn-primary">
                Contacto
              </a>
              <a href="/products" className="btn btn-ghost">
                Catálogo
              </a>
            </div>
          </div>
        </section>
      </SectionFadeIn>

      <SectionFadeIn delay={0.08}>
        {/* HISTORIA + MEDIA */}
        <section className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="card p-7 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">
                Nuestra historia
              </h2>

              <div className="mt-4 space-y-4 text-[15px] leading-7 text-[var(--text-muted)]">
                <p>
                  En <span className="font-extrabold text-[var(--text)]">{brandName}</span> nacimos con una misión simple:
                  acercar suplementación confiable a cada atleta, desde principiantes hasta profesionales.
                </p>

                <p>
                  Empezamos con pocos productos en un showroom, pero con un estándar claro: buena atención, productos reales
                  y recomendaciones con criterio. Hoy contamos con{' '}
                  <span className="font-extrabold text-[var(--text)]">2 locales en Formosa capital</span> y hacemos envíos
                  constantes a todo el país.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-white/70 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Atención
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">
                    Te asesoramos según tu objetivo
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-white/70 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Envíos
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">
                    Rápidos y con seguimiento
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid gap-4">
            <div className="card overflow-hidden">
              <div className="relative aspect-[4/3] bg-white/60">
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-[var(--text-muted)]">
                  Foto real del local / equipo / envíos
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Trayectoria" value="+3 años" />
              <StatCard label="Locales" value="2" />
            </div>
          </div>
        </section>
      </SectionFadeIn>

      <SectionFadeIn delay={0.16}>
        {/* VALORES */}
        <section className="mt-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">
              Nuestros valores
            </h2>
            <p className="mt-2 max-w-2xl text-[14px] sm:text-[15px] leading-6 text-[var(--text-muted)]">
              Lo que define cómo trabajamos y cómo elegimos productos.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <ValueItem key={i} title={v.title} desc={v.desc} icon={v.icon} />
            ))}
          </div>
        </section>
      </SectionFadeIn>

      <SectionFadeIn delay={0.24}>
        {/* BLOQUE CONFIANZA + CTA WHATSAPP */}
        <section className="mt-10">
          <div className="card p-7 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">
                  ¿Por qué elegirnos?
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-[var(--text-muted)]">
                  Te atendemos con criterio y con productos reales. Si no sabés qué llevar, te guiamos para que compres con
                  confianza.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="badge">Atención personalizada</span>
                  <span className="badge">Productos verificados</span>
                  <span className="badge">Envíos rápidos</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionFadeIn>

      <SectionFadeIn delay={0.32}>
        {/* CTA FINAL */}
        <section className="mt-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">
            ¿Tenés dudas o querés asesoramiento?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-[var(--text-muted)]">
            Escríbanos por WhatsApp o pasá por el local. Te ayudamos a elegir lo mejor para vos.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {whatsappHref ? (
              <WhatsAppButton href={whatsappHref}>Contactanos por WhatsApp</WhatsAppButton>
            ) : null}
            <a href="/contact" className="btn btn-primary">
              Formulario de contacto
            </a>
            <a href="/products" className="btn btn-ghost">
              Ver catálogo
            </a>
          </div>
        </section>
      </SectionFadeIn>
    </main>
  );
}
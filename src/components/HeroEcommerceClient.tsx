'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

function clampWaDigits(input?: string) {
  return input ? input.replace(/\D/g, '') : '';
}

function Icon({
  name,
  className,
}: {
  name: 'arrow' | 'whatsapp' | 'bag';
  className?: string;
}) {
  if (name === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
        <path d="M12.04 0C5.42 0 .04 5.38.04 12c0 2.12.56 4.19 1.62 6.01L0 24l6.15-1.61A11.9 11.9 0 0012.04 24C18.66 24 24.04 18.62 24.04 12S18.66 0 12.04 0zm0 21.86h-.01c-1.93 0-3.83-.52-5.5-1.51l-.39-.23-3.65.96.98-3.56-.25-.4a9.85 9.85 0 01-1.52-5.12c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.96 2.88a9.79 9.79 0 012.9 6.97c0 5.44-4.42 9.86-9.86 9.86zm5.74-7.37c-.31-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.36.23-.67.08-.31-.16-1.3-.48-2.48-1.53-.91-.8-1.52-1.79-1.7-2.1-.18-.31-.02-.48.13-.64.14-.14.31-.36.46-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.71-1.72-.97-2.35-.25-.6-.51-.52-.71-.53l-.6-.01c-.21 0-.54.08-.82.39-.28.31-1.08 1.06-1.08 2.59s1.11 3 1.26 3.2c.15.2 2.17 3.33 5.26 4.67.74.32 1.32.51 1.77.65.74.24 1.41.2 1.94.12.59-.09 1.82-.75 2.07-1.48.26-.72.26-1.34.18-1.47-.08-.12-.28-.2-.59-.36z" />
      </svg>
    );
  }
  if (name === 'bag') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 8h12l-1 13H7L6 8z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function QuickIconButton({
  href,
  label,
  children,
  external,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const common =
    'group inline-flex items-center justify-between gap-3 rounded-2xl px-4 h-12 ' +
    'border border-[var(--border)] bg-white/85 backdrop-blur ' +
    'shadow-[var(--shadow-soft)] ' +
    'transition hover:bg-white hover:border-[rgba(var(--primary-rgb),0.45)] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--primary-rgb),0.25)]';

  const content = (
    <>
      <span className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[var(--text)]">
        {label}
      </span>
      <span
        className="
          inline-flex h-9 w-9 items-center justify-center rounded-full
          bg-[rgba(var(--primary-rgb),0.08)]
          border border-[rgba(var(--primary-rgb),0.16)]
          text-[var(--primary)]
          transition-transform group-hover:translate-x-[2px]
        "
        aria-hidden="true"
      >
        {children}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={common} aria-label={label}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={common} aria-label={label}>
      {content}
    </Link>
  );
}

export default function HeroEcommerceClient({
  brandName,
  whatsappNumber,
  logoUrl,
}: {
  brandName: string;
  whatsappNumber?: string;
  logoUrl?: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const waDigits = useMemo(() => clampWaDigits(whatsappNumber), [whatsappNumber]);

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .hero-grid {
            background-image:
              linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px);
            background-size: 56px 56px;
            -webkit-mask-image: radial-gradient(circle at 50% 18%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
            mask-image: radial-gradient(circle at 50% 18%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
            opacity: .68;
          }

          .hero-brand{
            letter-spacing: -0.045em;
            line-height: 0.98;
          }

          .hero-accent{
            height: 3px;
            border-radius: 999px;
            background: linear-gradient(
              90deg,
              rgba(var(--primary-rgb),0.0),
              rgba(var(--primary-rgb),0.70),
              rgba(var(--primary-rgb),0.22),
              rgba(var(--primary-rgb),0.70),
              rgba(var(--primary-rgb),0.0)
            );
            opacity: .9;
          }

          /* LOGO WATERMARK */
          .hero-watermark{
            position:absolute;
            left:50%;
            top:52%;
            transform: translate(-50%, -50%);
            width: min(980px, 140vw);
            height: min(560px, 92vw);
            opacity: .40; /* 👈 base */
            filter: saturate(1.05) contrast(1.02) blur(0.2px);
            mix-blend-mode: multiply;
            pointer-events:none;
            user-select:none;
          }

          /* máscara para que se esfume en bordes y no “ensucie” */
          .hero-watermask{
            -webkit-mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 72%);
            mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 72%);
          }

          /* halo suave detrás del watermark para “marca” */
          .hero-waterhalo{
            position:absolute;
            inset:-18%;
            border-radius: 999px;
            background:
              radial-gradient(circle at 35% 30%, rgba(var(--primary-rgb),0.18), transparent 60%),
              radial-gradient(circle at 75% 60%, rgba(var(--primary-rgb),0.10), transparent 62%);
            filter: blur(26px);
            opacity: .65;
          }

          /* Mobile: más grande y un toque más visible */
          @media (max-width: 640px){
            .hero-watermark{
              top: 56%;
              width: 165vw;
              height: auto;
              opacity: .50; /* 👈 un poquito más */
              filter: saturate(1.04) contrast(1.02) blur(0.6px);
            }
          }
        `,
        }}
      />

      {/* Fondo base */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute -top-24 right-[-140px] h-[280px] w-[620px] rotate-[18deg] bg-[rgba(var(--primary-rgb),0.06)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>

      {/* Watermark logo (fondo) */}
      {logoUrl ? (
        <div className="absolute inset-0 hero-watermask" aria-hidden="true">
          <div className="hero-watermark">
            <div className="hero-waterhalo" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt=""
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        </div>
      ) : null}

      {/* Contenido */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="hero-brand text-[40px] sm:text-6xl md:text-7xl font-black text-[var(--text)]">
              {brandName}
            </h1>
            <div className="mx-auto mt-3 w-48 sm:w-64 hero-accent" />
          </motion.div>

          <motion.div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuickIconButton href="/products" label="Catálogo">
              <Icon name="arrow" className="h-5 w-5" />
            </QuickIconButton>

            {waDigits ? (
              <QuickIconButton
                href={`https://wa.me/${waDigits}?text=${encodeURIComponent('Hola! Quiero hacer una consulta.')}`}
                label="WhatsApp"
                external
              >
                <Icon name="whatsapp" className="h-5 w-5" />
              </QuickIconButton>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* separador diagonal */}
      <div
        className="pointer-events-none absolute left-0 right-0 -bottom-1 h-10"
        aria-hidden="true"
        style={{
          clipPath: 'polygon(0 0, 100% 45%, 100% 100%, 0% 100%)',
          background:
            'linear-gradient(90deg, rgba(var(--primary-rgb),0.14), rgba(var(--primary-rgb),0.06), rgba(var(--primary-rgb),0.12))',
        }}
      />
    </section>
  );
}

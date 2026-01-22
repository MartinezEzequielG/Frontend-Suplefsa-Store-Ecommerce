'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

function clampWaDigits(input?: string) {
  return input ? input.replace(/\D/g, '') : '';
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
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
    <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#ff6b35] via-[#0a3f86] to-[#1a86ff] min-h-[340px] flex items-center">
      {/* Fondo animado */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_18%_20%,rgba(255,255,255,0.10),transparent_60%)] animate-pulse" />
        <div className="absolute -top-24 -right-24 h-[320px] w-[320px] md:h-[520px] md:w-[520px] rounded-full bg-[var(--accent)]/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--accent)]/80 to-transparent animate-pulse" />
      </motion.div>

      {/* Logo marca de agua: ocupa todo el hero en mobile, a la derecha en desktop */}
      {logoUrl && (
        <motion.img
          src={logoUrl}
          alt=""
          aria-hidden="true"
          className="
            absolute inset-0 w-full h-full object-contain
            opacity-10
            pointer-events-none
            select-none
            z-0
            md:static md:w-auto md:h-auto md:max-h-[420px] md:opacity-15 md:right-0 md:inset-0
          "
          style={{
            objectFit: 'contain',
            // En desktop, el style de antes sigue aplicando por las clases md:
          }}
          initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.10, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between py-10 sm:py-20 gap-8">
        {/* Texto principal */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="z-10 w-full max-w-xl text-left"
        >
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.22)] leading-tight">
            Suplementación Formosa
          </h1>
          <p className="mt-5 text-base xs:text-lg sm:text-xl md:text-2xl text-white/90 font-semibold drop-shadow">
            Envíos a todo el país &bull; Asesoramiento real &bull; Calidad garantizada
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="
                group w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                rounded-2xl px-7 py-4
                bg-[var(--accent)] text-white
                text-base font-extrabold
                shadow-lg
                transition hover:-translate-y-1 hover:shadow-xl
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
              "
            >
              Ver catálogo
              <span className="h-9 w-9 rounded-full bg-white/20 text-white border border-white/30 flex items-center justify-center transition group-hover:bg-white/30">
                <ArrowIcon className="h-[20px] w-[20px]" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
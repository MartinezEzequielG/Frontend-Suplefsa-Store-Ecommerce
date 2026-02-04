'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type FadeVariant = 'reveal' | 'lift';

export function SectionFadeIn({
  children,
  delay = 0,
  className = '',
  variant = 'reveal',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: FadeVariant;
}) {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const cfg = useMemo(() => {
    if (reduceMotion) {
      return {
        initial: { opacity: 1, y: 0 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0 },
        viewport: { once: true, amount: 0.08 as const },
      };
    }

    // ✅ Mobile: evitar “pantalla vacía”
    const effectiveVariant: FadeVariant = isMobile ? 'lift' : variant;

    // cap del delay para que no “llegue tarde” en mobile
    const d = isMobile ? Math.min(delay, 0.08) : delay;

    if (effectiveVariant === 'lift') {
      return {
        // ✅ visible desde el inicio
        initial: { opacity: 1, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        transition: {
          duration: isMobile ? 0.38 : 0.42,
          ease: [0.22, 1, 0.36, 1] as const,
          delay: d,
        },
        viewport: { once: true, amount: 0.08 as const },
      };
    }

    // ✅ reveal “seguro”: NO arranca en opacity 0 (evita invisibles al navegar)
    return {
      initial: { opacity: 0.92, y: 14 },
      whileInView: { opacity: 1, y: 0 },
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: d,
      },
      viewport: { once: true, amount: 0.12 as const },
    };
  }, [delay, isMobile, reduceMotion, variant]);

  return (
    <motion.div
      className={className}
      initial={cfg.initial}
      whileInView={cfg.whileInView}
      viewport={cfg.viewport}
      transition={cfg.transition}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}
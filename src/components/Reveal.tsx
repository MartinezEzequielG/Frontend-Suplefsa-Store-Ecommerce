'use client';

import * as React from 'react';
import { useMemo } from 'react';
import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
  scale?: number;
  once?: boolean;
  amount?: number; // viewport amount
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  scale = 0.99,
  once = true,
  amount = 0.22,
  ...rest
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  const variants = useMemo<Variants>(() => {
    if (reduceMotion) {
      return {
        hidden: { opacity: 1, y: 0, scale: 1, filter: 'none' },
        show: { opacity: 1, y: 0, scale: 1, filter: 'none', transition: { duration: 0 } },
      };
    }

    return {
      hidden: { opacity: 0, y: 14, scale: 0.985, filter: 'blur(6px)' },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.55, ease: EASE, delay },
      },
    };
  }, [reduceMotion, delay]);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<'div'> & {
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
};

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.06,
  once = true,
  amount = 0.18,
  ...rest
}: StaggerProps) {
  const reduce = useReducedMotion();

  const variants = React.useMemo<Variants>(() => {
    if (reduce) {
      return {
        hidden: { opacity: 1 },
        show: { opacity: 1, transition: { duration: 0 } },
      };
    }

    return {
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: { delayChildren: delay, staggerChildren: stagger },
      },
    };
  }, [reduce, delay, stagger]);

  const child = React.useMemo<Variants>(() => {
    if (reduce) {
      return {
        hidden: { opacity: 1, y: 0, filter: 'none' },
        show: { opacity: 1, y: 0, filter: 'none', transition: { duration: 0 } },
      };
    }

    return {
      hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
      show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.45, ease: EASE },
      },
    };
  }, [reduce]);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {React.Children.map(children as any, (node: any, i: number) => {
        if (!node) return null;
        return (
          <motion.div key={node?.key ?? i} variants={child}>
            {node}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

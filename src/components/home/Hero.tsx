import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Magnetic } from '../motion/Magnetic';
import { buttonClasses } from '../ui/Button';
import { HeroBackdrop } from './HeroBackdrop';
import { HeroMedia } from './HeroMedia';

const ease = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay }: { children: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    // El relleno/margen negativo evita que el recorte tape la tilde de las mayúsculas.
    <span className="-mt-[0.22em] block overflow-hidden whitespace-nowrap pt-[0.22em]">
      <motion.span
        className="text-metal block"
        initial={reduce ? false : { y: '115%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section data-theme="dark" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg text-text">
      <HeroBackdrop />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[40%] -z-10 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-from/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,var(--color-bg)_80%)]"
      />

      {/* Todo centrado: etiqueta, título, bajada y botones en una sola columna. */}
      <div className="relative mx-auto flex w-full max-w-[100rem] flex-1 flex-col items-center justify-center gap-8 px-4 pb-16 pt-36 text-center md:gap-10 md:px-8 md:pb-20 md:pt-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-sm font-medium text-text-muted backdrop-blur"
        >
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          Apps para el aula · 1.º a 6.º año
        </motion.p>

        <h1 className="display text-[clamp(1.4rem,8.4vw,11rem)] md:text-[clamp(1.6rem,8.4vw,11rem)]">
          <Line delay={0.15}>Matemática</Line>
          <Line delay={0.3}>que engancha</Line>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="max-w-xl text-lg text-text-muted md:text-xl"
        >
          Apps interactivas para practicar, enseñar y evaluar. Tus estudiantes juegan, vos ves cómo aprenden.
        </motion.p>

        <div className="relative z-20 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Magnetic>
            <Link to="/catalogo" className={buttonClasses({ size: 'lg', className: 'w-full sm:w-auto' })}>
              Ver catálogo
              <ArrowDown className="size-5" aria-hidden="true" />
            </Link>
          </Magnetic>
          <Link to="/servicios" className={buttonClasses({ size: 'lg', variant: 'secondary', className: 'w-full sm:w-auto' })}>
            Pedir app a medida
          </Link>
        </div>
      </div>

      <HeroMedia />
    </section>
  );
}

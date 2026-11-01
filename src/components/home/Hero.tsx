import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Magnetic } from '../motion/Magnetic';
import { buttonClasses } from '../ui/Button';
import { HeroMedia } from './HeroMedia';
import { MathField } from './MathField';

const ease = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay }: { children: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    // El relleno/margen negativo evita que el recorte tape la tilde de las mayúsculas.
    <span className="-mt-[0.22em] block overflow-hidden pt-[0.22em]">
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
  return (
    <section data-theme="dark" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg text-text">
      <MathField className="absolute inset-0 -z-10 size-full" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[40%] -z-10 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-from/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,var(--color-bg)_80%)]"
      />

      {/* Ancho casi total: el título gigante llega de borde a borde, como en las referencias. */}
      <div className="relative mx-auto flex w-full max-w-[110rem] flex-1 flex-col justify-between gap-10 px-4 pb-10 pt-32 md:px-8 md:pb-14 md:pt-40">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-sm font-medium text-text-muted backdrop-blur"
          >
            <span className="size-2 rounded-full bg-linear-to-r from-brand-from to-brand-to" aria-hidden="true" />
            Apps para el aula · 1.º a 6.º año
          </motion.p>
          <h1 className="display text-[clamp(1.4rem,10.2vw,12rem)] md:text-[clamp(1.6rem,9.2vw,12rem)]">
            <Line delay={0.15}>Matemática</Line>
            <Line delay={0.3}>que se juega</Line>
          </h1>
        </div>

        <div className="relative z-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-sm text-lg text-text-muted">
            Practicá, enseñá y evaluá con apps interactivas. ¿Necesitás otra materia? La creamos a medida.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </div>

      <HeroMedia />
    </section>
  );
}

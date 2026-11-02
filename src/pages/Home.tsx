import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AppGrid } from '../components/AppGrid';
import { Hero } from '../components/home/Hero';
import { Marquee } from '../components/home/Marquee';
import { Container } from '../components/layout/Page';
import { CountUp } from '../components/motion/CountUp';
import { Magnetic } from '../components/motion/Magnetic';
import { Reveal } from '../components/motion/Reveal';
import { ScrollText } from '../components/motion/ScrollText';
import { buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TOPICS } from '../config';
import { useAsync } from '../hooks/useAsync';
import { listPublishedApps } from '../services/catalog';

export default function Home() {
  const { data, loading, error, reload } = useAsync(listPublishedApps);

  const stats = data
    ? [
        { label: 'Apps publicadas', value: data.length },
        { label: 'Años cubiertos', value: new Set(data.map((a) => a.level)).size },
        { label: 'Temas', value: new Set(data.flatMap((a) => a.topics)).size },
      ]
    : [];

  return (
    <>
      <Hero />
      <Marquee items={TOPICS} />

      <section className="py-24 md:py-40">
        <Container>
          <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">Qué hacemos</p>
          <ScrollText
            className="max-w-5xl text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
            text="Creamos apps de matemática para usar en el aula: claras, interactivas y listas para jugar. Y si tu materia no está, la construimos juntos."
          />
        </Container>
      </section>

      <section aria-labelledby="catalogo" className="pb-16 md:pb-24">
        <Container>
          <Reveal className="mb-10 flex items-end justify-between gap-4">
            <h2 id="catalogo" className="display text-[clamp(2.25rem,9vw,7rem)]">
              Catálogo
            </h2>
            <Link to="/catalogo" className="hidden items-center gap-2 font-semibold text-primary hover:underline sm:inline-flex">
              Ver todo <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
          <AppGrid apps={data?.slice(0, 6) ?? null} loading={loading} error={error} onRetry={reload} />
          <div className="mt-8 sm:hidden">
            <Link to="/catalogo" className={buttonClasses({ variant: 'secondary', className: 'w-full' })}>
              Ver todo el catálogo
            </Link>
          </div>
        </Container>
      </section>

      {stats.length > 0 && (
        <section aria-label="Resumen del catálogo" className="pb-24 md:pb-32">
          <Container>
            <dl className="grid gap-4 md:grid-cols-3">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1}>
                  <Card className="p-6 md:p-8">
                    <dd className="display text-brand text-6xl md:text-7xl">
                      <CountUp value={s.value} />
                    </dd>
                    <dt className="mt-3 text-text-muted">{s.label}</dt>
                  </Card>
                </Reveal>
              ))}
            </dl>
          </Container>
        </section>
      )}

      <section data-theme="dark" className="relative isolate overflow-hidden bg-bg py-24 text-text md:py-40">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 size-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-from/8 blur-3xl"
        />
        <Container className="text-center">
          <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">¿Otra materia?</p>
          <Reveal>
            <h2 className="display text-metal text-[clamp(2.4rem,11vw,9rem)]">Apps a medida</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
              Lengua, Ciencias, Física… Contanos la idea y la construimos. El precio se acuerda según el proyecto.
            </p>
          </Reveal>
          <Magnetic className="mt-10">
            <Link to="/servicios" className={buttonClasses({ size: 'lg' })}>
              Pedir presupuesto
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </Magnetic>
        </Container>
      </section>
    </>
  );
}

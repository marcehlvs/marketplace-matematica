import { Link } from 'react-router-dom';
import { KeyRound, Rocket, Search, Wand2 } from 'lucide-react';
import { AppGrid } from '../components/AppGrid';
import { Container } from '../components/layout/Page';
import { buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAsync } from '../hooks/useAsync';
import { listPublishedApps } from '../services/catalog';

const steps = [
  { icon: Search, title: 'Elegí', text: 'Buscá por año y tema en el catálogo.' },
  { icon: KeyRound, title: 'Obtené acceso', text: 'Comprala y queda en tu biblioteca.' },
  { icon: Rocket, title: 'Usala', text: 'Abrila en el aula o en casa, cuando quieras.' },
];

export default function Home() {
  const { data, loading, error, reload } = useAsync(listPublishedApps);

  return (
    <Container className="space-y-16 md:space-y-20">
      <section className="flex flex-col items-start gap-6 py-4 md:py-10">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          Apps de matemática listas para usar en el aula
        </h1>
        <p className="max-w-2xl text-lg text-text-muted">
          Practicá, enseñá y evaluá con apps interactivas. ¿Necesitás otra materia? La creamos a medida.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link to="/catalogo" className={buttonClasses({ size: 'lg' })}>
            Ver catálogo
          </Link>
          <Link to="/servicios" className={buttonClasses({ size: 'lg', variant: 'secondary' })}>
            Pedir una app a medida
          </Link>
        </div>
      </section>

      <section aria-labelledby="recientes">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="recientes" className="text-2xl font-bold tracking-tight">
            Últimas apps
          </h2>
          <Link to="/catalogo" className="text-sm font-medium text-primary hover:underline">
            Ver todas
          </Link>
        </div>
        <AppGrid apps={data?.slice(0, 3) ?? null} loading={loading} error={error} onRetry={reload} />
      </section>

      <section aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="mb-6 text-2xl font-bold tracking-tight">
          Cómo funciona
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Card className="flex h-full gap-4 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold">
                    {i + 1}. {title}
                  </h3>
                  <p className="text-sm text-text-muted">{text}</p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <Card className="flex flex-col items-start gap-4 bg-surface-2 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex gap-4">
            <Wand2 className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-bold">¿Querés una app para otra materia?</h2>
              <p className="text-text-muted">Contanos la idea y te pasamos un presupuesto.</p>
            </div>
          </div>
          <Link to="/servicios" className={buttonClasses({ className: 'w-full md:w-auto' })}>
            Pedir presupuesto
          </Link>
        </Card>
      </section>
    </Container>
  );
}

import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, PageHeader } from '../components/layout/Page';
import { buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

/** Preguntas frecuentes. Describen cómo funciona hoy la compra (manual); se actualizan al sumar Mercado Pago. */
const faqs = [
  {
    q: '¿Cómo compro una app?',
    a: 'Entrá al catálogo, elegí la app y tocá “Comprar”. Las apps gratuitas quedan disponibles en “Mi biblioteca” al instante. En las pagas se genera un pedido y te contactamos para coordinar el pago; cuando lo confirmamos, la app aparece en tu biblioteca.',
  },
  {
    q: '¿Necesito crear una cuenta?',
    a: 'Sí, para comprar y guardar tus apps. Podés entrar con Google o con email y contraseña.',
  },
  {
    q: '¿Dónde uso la app después de comprarla?',
    a: 'En “Mi biblioteca” encontrás todas tus apps con el botón “Abrir app”. Funcionan desde el navegador, en computadora, tablet o celular.',
  },
  {
    q: '¿Puedo usarla en clase con mis estudiantes?',
    a: 'Sí, las apps están pensadas para el aula. Si querés usarla en toda una escuela, escribinos desde “Servicios” y vemos una licencia institucional.',
  },
  {
    q: '¿Pueden hacer una app para otra materia?',
    a: 'Sí. Contanos qué necesitás en el formulario de “Servicios” (materia, año y ejemplos) y te respondemos con una propuesta. El precio se acuerda según el trabajo.',
  },
  {
    q: '¿Qué pasa si una app falla o tiene un error?',
    a: 'Escribinos por el formulario de “Servicios” indicando el nombre de la app y qué ocurrió, y lo revisamos.',
  },
];

export default function Help() {
  return (
    <Container>
      <PageHeader title="Preguntas frecuentes" description="Cómo comprar, usar y pedir apps a medida." />
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map(({ q, a }) => (
          <Card key={q} className="p-0">
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg p-5 font-medium">
                {q}
                <ChevronDown className="size-5 shrink-0 text-text-muted transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-text-muted">{a}</p>
            </details>
          </Card>
        ))}
        <div className="flex flex-col items-start gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-muted">¿No encontraste tu duda?</p>
          <Link to="/servicios" className={buttonClasses({ variant: 'secondary' })}>
            Escribinos
          </Link>
        </div>
      </div>
    </Container>
  );
}

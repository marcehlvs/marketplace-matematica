import { Link } from 'react-router-dom';
import { Container, PageHeader } from '../components/layout/Page';
import { buttonClasses } from '../components/ui/Button';
import { Faq } from '../components/ui/Faq';
import { faqs } from '../data/faqs';

export default function Help() {
  return (
    <Container>
      <PageHeader title="Preguntas frecuentes" description="Cómo comprar, usar y pedir apps a medida." />
      <div className="mx-auto max-w-3xl">
        <Faq items={faqs} />
        <div className="flex flex-col items-start gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-muted">¿No encontraste tu duda?</p>
          <Link to="/servicios" className={buttonClasses({ variant: 'secondary' })}>
            Escribinos
          </Link>
        </div>
      </div>
    </Container>
  );
}

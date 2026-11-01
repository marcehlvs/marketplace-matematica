import { Link } from 'react-router-dom';
import { BRAND } from '../../config';
import { Container } from './Page';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <Container className="flex flex-col gap-4 py-8 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND}. Apps de matemática para el aula.
        </p>
        <nav aria-label="Pie de página" className="flex gap-4">
          <Link to="/catalogo" className="hover:text-text">
            Catálogo
          </Link>
          <Link to="/servicios" className="hover:text-text">
            Servicios
          </Link>
        </nav>
      </Container>
    </footer>
  );
}

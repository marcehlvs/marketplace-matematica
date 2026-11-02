import { Link } from 'react-router-dom';
import { BRAND } from '../../config';
import { Container } from './Page';

export function Footer() {
  return (
    <footer data-theme="dark" className="relative mt-20 overflow-hidden border-t border-border bg-bg text-text">
      <Container className="flex flex-col gap-4 pb-6 pt-10 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND}. Apps de matemática para el aula.
        </p>
        <nav aria-label="Pie de página" className="flex gap-6">
          <Link to="/catalogo" className="hover:text-text">
            Catálogo
          </Link>
          <Link to="/servicios" className="hover:text-text">
            Servicios
          </Link>
          <Link to="/ayuda" className="hover:text-text">
            Ayuda
          </Link>
        </nav>
      </Container>
      <p
        aria-hidden="true"
        className="display pointer-events-none select-none whitespace-nowrap text-center text-[clamp(2.5rem,10.5vw,14rem)] leading-[0.8] text-text/[0.06]"
      >
        {BRAND}
      </p>
    </footer>
  );
}

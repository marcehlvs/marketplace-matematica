import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Footer } from './Footer';
import { Header } from './Header';
import { Container } from './Page';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Con llaves a propósito: scrollTo() puede devolver una Promise y React exige que un efecto no devuelva nada.
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  const { demo } = useAuth();
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-contrast"
      >
        Saltar al contenido
      </a>
      {demo && (
        <div className="bg-surface-2 text-sm text-text-muted">
          <Container className="flex items-center gap-2 py-2">
            <Info className="size-4 shrink-0" aria-hidden="true" />
            <p>Modo demo: los datos se guardan solo en este navegador. Configurá Firebase para usar datos reales.</p>
          </Container>
        </div>
      )}
      <Header />
      <main id="contenido" tabIndex={-1} className="flex-1 py-8 outline-none md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

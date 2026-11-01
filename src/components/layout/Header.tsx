import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogOut, Menu, Moon, Sigma, Sun, X } from 'lucide-react';
import { BRAND } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { Button, buttonClasses } from '../ui/Button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-surface-2 text-text' : 'text-text-muted hover:bg-surface-2 hover:text-text',
  );

const panel = 'rounded-full border border-border bg-surface/60 backdrop-blur-xl';

/** Navegación flotante tipo "píldora de vidrio". El contenedor mide 0 de alto para superponerse al hero. */
export function Header() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/servicios', label: 'Servicios' },
    ...(user ? [{ to: '/biblioteca', label: 'Mi biblioteca' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 h-0">
      <div className="mx-auto max-w-5xl px-3 pt-3 md:px-6">
        <div className={cn(panel, 'flex h-14 items-center justify-between gap-2 pl-4 pr-2')}>
          <Link to="/" className="flex items-center gap-2 rounded-full font-bold">
            <span className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-brand-from to-brand-to text-white">
              <Sigma className="size-4" aria-hidden="true" />
            </span>
            {BRAND}
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-10"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
            </Button>

            <div className="hidden md:block">
              {user ? (
                <Button variant="secondary" size="sm" onClick={() => void signOut()}>
                  <LogOut className="size-4" aria-hidden="true" />
                  Salir
                </Button>
              ) : (
                <Link to="/login" className={buttonClasses({ size: 'sm' })}>
                  Ingresar
                </Link>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="size-10 md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        <div
          id="menu-movil"
          className={cn('mt-2 rounded-lg border border-border bg-surface/90 p-3 backdrop-blur-xl md:hidden', !open && 'hidden')}
        >
          <nav aria-label="Principal móvil" className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={cn(navLinkClass, 'py-3 text-base')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3">
            {user ? (
              <Button variant="secondary" className="w-full" onClick={() => void signOut()}>
                <LogOut className="size-4" aria-hidden="true" />
                Salir
              </Button>
            ) : (
              <Link to="/login" className={buttonClasses({ className: 'w-full' })}>
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

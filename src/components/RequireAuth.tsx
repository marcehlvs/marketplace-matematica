import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { Container } from './layout/Page';
import { Skeleton } from './ui/Skeleton';
import { ErrorState } from './ui/States';

/** Protege una ruta: pide sesión y, opcionalmente, un rol. */
export function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container className="space-y-4" role="status" aria-label="Cargando">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </Container>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (role && user.role !== role) {
    return (
      <Container>
        <ErrorState title="Sin permiso" description="No tenés acceso a esta sección." />
      </Container>
    );
  }

  return <>{children}</>;
}

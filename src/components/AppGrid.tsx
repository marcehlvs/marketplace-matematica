import type { ReactNode } from 'react';
import type { AppData, WithId } from '../types';
import { AppCard } from './AppCard';
import { GridSkeleton } from './ui/Skeleton';
import { EmptyState, ErrorState } from './ui/States';

interface AppGridProps {
  apps: WithId<AppData>[] | null;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  /** Contenido para el estado vacío. */
  empty?: ReactNode;
  skeletonCount?: number;
}

/** Grilla de apps con los 4 estados: cargando, error, vacío y datos. */
export function AppGrid({ apps, loading, error, onRetry, empty, skeletonCount }: AppGridProps) {
  if (loading) return <GridSkeleton count={skeletonCount} />;
  if (error) return <ErrorState onRetry={onRetry} />;
  if (!apps || apps.length === 0) {
    return <>{empty ?? <EmptyState title="Todavía no hay apps" description="Volvé pronto: estamos sumando contenido." />}</>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {apps.map((app) => (
        <li key={app.id}>
          <AppCard app={app} />
        </li>
      ))}
    </ul>
  );
}

import { cn } from '../../lib/utils';
import { Card } from './Card';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-surface-2', className)} />;
}

export function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-36 rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    </Card>
  );
}

/** Grilla de esqueletos mientras carga el catálogo. */
export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div role="status" aria-label="Cargando" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

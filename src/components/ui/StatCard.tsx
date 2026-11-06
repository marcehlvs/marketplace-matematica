import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { Skeleton } from './Skeleton';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: number | string | null;
  icon: LucideIcon;
  /** Aviso corto debajo del número (por ejemplo, “requieren tu atención”). */
  hint?: string;
  /** Resalta la tarjeta cuando hay algo pendiente. */
  attention?: boolean;
  loading?: boolean;
}

/** Tarjeta de métrica (estilo EasyUI "StatCard"): ícono, número grande y estado de carga. */
export function StatCard({ label, value, icon: Icon, hint, attention, loading }: StatCardProps) {
  return (
    <Card className={cn('p-5', attention && 'border-border-strong')}>
      <div className="flex items-center justify-between text-text-muted">
        <p className="text-sm font-medium">{label}</p>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-16" />
      ) : (
        <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">{value ?? '—'}</p>
      )}
      {hint && !loading && <p className="mt-1 text-sm text-text-muted">{hint}</p>}
    </Card>
  );
}

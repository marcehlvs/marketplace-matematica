import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, type LucideIcon } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong px-6 py-12 text-center">
      <Icon className="size-10 text-text-muted" aria-hidden="true" />
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="max-w-md text-text-muted">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos cargar la información. Revisá tu conexión e intentá de nuevo.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-danger/40 bg-danger/5 px-6 py-12 text-center">
      <AlertTriangle className="size-10 text-danger" aria-hidden="true" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-md text-text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

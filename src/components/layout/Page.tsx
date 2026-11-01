import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

/** Contenedor de página: gutter de 16px en móvil, crece en tablet y desktop. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 md:px-6 xl:px-8', className)} {...props} />;
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

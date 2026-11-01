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
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="display text-3xl md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-lg text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

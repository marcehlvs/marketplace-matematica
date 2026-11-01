import { BarChart3, Calculator, Shapes, Sigma, TrendingUp, type LucideIcon } from 'lucide-react';
import type { AppData } from '../types';
import { cn } from '../lib/utils';

const TOPIC_ICONS: Record<string, LucideIcon> = {
  Aritmética: Calculator,
  Álgebra: Sigma,
  Geometría: Shapes,
  Funciones: TrendingUp,
  Estadística: BarChart3,
  Análisis: Sigma,
};

function hueFrom(text: string) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

/** Portada: imagen si hay URL; si no, degradé + ícono del tema (sin necesitar Storage). */
export function AppCover({
  app,
  alt = '',
  className,
}: {
  app: Pick<AppData, 'title' | 'topics' | 'coverUrl'> & { id: string };
  alt?: string;
  className?: string;
}) {
  if (app.coverUrl) {
    return <img src={app.coverUrl} alt={alt} loading="lazy" className={cn('h-36 w-full object-cover', className)} />;
  }
  const hue = hueFrom(app.id);
  const Icon = TOPIC_ICONS[app.topics[0] ?? ''] ?? Calculator;
  return (
    <div
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn('flex h-36 w-full items-center justify-center text-white', className)}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 65% 38%), hsl(${(hue + 45) % 360} 70% 28%))` }}
    >
      <Icon className="size-14 opacity-90" aria-hidden="true" strokeWidth={1.5} />
    </div>
  );
}

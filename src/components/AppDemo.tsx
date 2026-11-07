import { useState } from 'react';
import { ExternalLink, FlaskConical } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Skeleton } from './ui/Skeleton';

/** Botón + ventana para probar la demo de la app antes de comprar. */
export function AppDemo({ url, title, className }: { url: string; title: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="lg"
        className={className}
        onClick={() => {
          setLoaded(false);
          setOpen(true);
        }}
      >
        <FlaskConical className="size-4" aria-hidden="true" />
        Probar demo
      </Button>
      <Modal open={open} onOpenChange={setOpen} title={`Demo de ${title}`} description="Versión de prueba, con contenido limitado." size="xl">
        <div className="relative h-[70dvh] overflow-hidden rounded-md border border-border bg-surface-2">
          {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
          <iframe
            src={url}
            title={`Demo de ${title}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="relative size-full bg-white"
          />
        </div>
        <p className="mt-3 text-sm text-text-muted">
          ¿No se ve bien?{' '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-text underline underline-offset-4">
            Abrir la demo en otra pestaña
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </p>
      </Modal>
    </>
  );
}

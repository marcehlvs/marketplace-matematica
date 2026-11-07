import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Modal } from './ui/Modal';

/**
 * Galería de capturas: imagen principal, miniaturas y vista ampliada.
 * Si una imagen no carga se muestra un aviso en lugar de un hueco roto.
 */
export function AppGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [failed, setFailed] = useState<Set<string>>(new Set());

  const visible = images.filter((src) => !failed.has(src));
  if (visible.length === 0) return null;
  const current = visible[Math.min(index, visible.length - 1)];
  const label = (i: number) => `Captura ${i + 1} de ${visible.length} de ${title}`;
  const onError = (src: string) => setFailed((prev) => new Set(prev).add(src));

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label={`Ampliar: ${label(visible.indexOf(current))}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface-2"
      >
        <img
          src={current}
          alt={label(visible.indexOf(current))}
          onError={() => onError(current)}
          className="size-full object-contain"
        />
        <span className="absolute bottom-3 right-3 inline-flex size-9 items-center justify-center rounded-md border border-border bg-bg/80 text-text opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="size-4" aria-hidden="true" />
        </span>
      </button>

      {visible.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto" aria-label="Miniaturas">
          {visible.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={label(i)}
                aria-pressed={src === current}
                className={cn(
                  'block h-16 w-24 overflow-hidden rounded-md border bg-surface-2 transition',
                  src === current ? 'border-text' : 'border-border opacity-70 hover:opacity-100',
                )}
              >
                <img src={src} alt="" loading="lazy" onError={() => onError(src)} className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={zoom} onOpenChange={setZoom} title={title} description={label(visible.indexOf(current))} size="xl">
        <img src={current} alt={label(visible.indexOf(current))} className="mx-auto max-h-[75dvh] w-auto max-w-full rounded-md" />
      </Modal>
    </div>
  );
}

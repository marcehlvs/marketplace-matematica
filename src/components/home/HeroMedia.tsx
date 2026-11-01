import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { HERO_MEDIA_BLACK_BACKGROUND } from '../../config';
import { cn } from '../../lib/utils';

type Kind = 'video' | 'image';
interface Found {
  src: string;
  kind: Kind;
}

/** Se prueba en este orden. Alcanza con poner UNO de estos archivos en /public/media/. */
const CANDIDATES: Found[] = [
  { src: '/media/hero.webm', kind: 'video' },
  { src: '/media/hero.mp4', kind: 'video' },
  { src: '/media/hero.webp', kind: 'image' },
  { src: '/media/hero.png', kind: 'image' },
];

async function findMedia(): Promise<Found | null> {
  for (const candidate of CANDIDATES) {
    try {
      const res = await fetch(candidate.src, { method: 'HEAD' });
      // Si el archivo no existe, el servidor devuelve la página (text/html): se ignora.
      if (res.ok && (res.headers.get('content-type') ?? '').startsWith(candidate.kind)) return candidate;
    } catch {
      /* sin red o bloqueado: se prueba el siguiente */
    }
  }
  return null;
}

/**
 * Espacio para el video/personaje que generes con IA.
 * Si no hay archivo en /public/media/ no muestra nada y se ve solo el fondo animado.
 */
export function HeroMedia() {
  const [media, setMedia] = useState<Found | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    void findMedia().then((found) => {
      if (alive) setMedia(found);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!media) return null;

  const className = cn(
    'pointer-events-none absolute bottom-0 left-1/2 z-10 h-[72%] max-h-[900px] w-auto max-w-full -translate-x-1/2 object-contain',
    HERO_MEDIA_BLACK_BACKGROUND && 'mix-blend-screen',
  );

  if (media.kind === 'image') return <img src={media.src} alt="" className={className} />;

  return (
    <video
      src={media.src}
      className={className}
      aria-hidden="true"
      tabIndex={-1}
      muted
      playsInline
      disablePictureInPicture
      // Con "reducir movimiento" queda en el primer cuadro, sin reproducir.
      autoPlay={!reduce}
      loop={!reduce}
      preload={reduce ? 'metadata' : 'auto'}
    />
  );
}

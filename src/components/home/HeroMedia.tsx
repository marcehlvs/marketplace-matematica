import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { HERO_MEDIA_BLACK_BACKGROUND } from '../../config';
import { cn } from '../../lib/utils';
import { findMedia, type FoundMedia } from '../../lib/media';

/** Se prueban en este orden. Alcanza con poner UNO de estos archivos en /public/media/. */
const CANDIDATES: FoundMedia[] = [
  { src: '/media/hero.webm', kind: 'video' },
  { src: '/media/hero.mp4', kind: 'video' },
  { src: '/media/hero.webp', kind: 'image' },
  { src: '/media/hero.png', kind: 'image' },
];

/**
 * Pieza en PRIMER PLANO (personaje, objeto 3D) que se ve delante del título.
 * Si no hay archivo en /public/media/ no muestra nada.
 */
export function HeroMedia() {
  const [media, setMedia] = useState<FoundMedia | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    void findMedia(CANDIDATES).then((found) => {
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

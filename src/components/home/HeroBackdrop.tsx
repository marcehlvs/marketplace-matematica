import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { findMedia, type FoundMedia } from '../../lib/media';
import { MathField } from './MathField';

/** Video de FONDO, detrás del título. Se prueban en este orden. */
const CANDIDATES: FoundMedia[] = [
  { src: '/media/hero-bg.webm', kind: 'video' },
  { src: '/media/hero-bg.mp4', kind: 'video' },
];

/** Imagen que se ve antes de que cargue el video, con "reducir movimiento" o si el celular bloquea el autoplay. */
const POSTER = '/media/hero-bg-poster.webp';

function BackdropVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  // Se pausa cuando la portada sale de pantalla, para no gastar batería ni procesador.
  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={POSTER}
        className="absolute inset-0 -z-10 size-full object-cover"
        aria-hidden="true"
        tabIndex={-1}
        muted
        playsInline
        disablePictureInPicture
        autoPlay={!reduce}
        loop={!reduce}
        preload={reduce ? 'metadata' : 'auto'}
      />
      {/* Capas para que el título se lea y el video se funda con el resto de la página */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg/20" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-bg/85 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-linear-to-t from-bg to-transparent" />
    </>
  );
}

/**
 * Fondo de la portada: usa tu video si está en /public/media/ (hero-bg.mp4 o hero-bg.webm);
 * si no, dibuja el fondo animado de funciones en código.
 */
export function HeroBackdrop() {
  // undefined = todavía comprobando si existe el video
  const [media, setMedia] = useState<FoundMedia | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    void findMedia(CANDIDATES).then((found) => {
      if (alive) setMedia(found);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (media === undefined) return null;
  if (media === null) return <MathField className="absolute inset-0 -z-10 size-full" />;
  return <BackdropVideo src={media.src} />;
}

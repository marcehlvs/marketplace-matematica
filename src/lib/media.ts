export type MediaKind = 'video' | 'image';

export interface FoundMedia {
  src: string;
  kind: MediaKind;
}

/**
 * Devuelve el primer archivo de la lista que realmente exista en el servidor.
 * Si un archivo no existe, el servidor responde con la página (text/html) y se ignora.
 */
export async function findMedia(candidates: FoundMedia[]): Promise<FoundMedia | null> {
  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate.src, { method: 'HEAD' });
      if (res.ok && (res.headers.get('content-type') ?? '').startsWith(candidate.kind)) return candidate;
    } catch {
      /* sin red o bloqueado: se prueba el siguiente */
    }
  }
  return null;
}

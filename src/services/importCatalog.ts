import { LEVELS } from '../config';
import type { AppData } from '../types';

/**
 * Lee el JSON que genera `scripts/import-repos.mjs` y lo convierte en apps listas para guardar.
 * Siempre entran como BORRADOR y gratis: el precio y la publicación los decidís vos en el panel.
 */
/** Acepta URL completa o ruta del propio sitio (/capturas/x.jpg). */
function cleanPath(v: unknown): string | undefined {
  return typeof v === 'string' && /^(https?:\/\/|\/[^/])/.test(v) ? v : undefined;
}
function cleanList(v: unknown): string[] {
  return Array.isArray(v) ? v.map(cleanPath).filter((x): x is string => !!x).slice(0, 8) : [];
}

export function parseImportedApps(raw: string): AppData[] {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }
  const list = (json as { apps?: unknown }).apps;
  if (!Array.isArray(list)) throw new Error('No encontré la lista "apps" en el archivo.');

  const now = Date.now();
  const apps = list.flatMap((item): AppData[] => {
    const a = item as Partial<AppData>;
    if (typeof a.title !== 'string' || !a.title.trim() || typeof a.url !== 'string' || !/^https?:\/\//.test(a.url)) return [];
    return [
      {
        title: a.title.trim().slice(0, 80),
        summary: (a.summary ?? '').toString().slice(0, 160),
        description: (a.description ?? '').toString().slice(0, 2000),
        level: LEVELS.includes(a.level as (typeof LEVELS)[number]) ? (a.level as string) : LEVELS[0],
        topics: Array.isArray(a.topics) ? a.topics.filter((t): t is string => typeof t === 'string').slice(0, 6) : [],
        price: 0,
        url: a.url,
        ...(cleanPath(a.coverUrl) && { coverUrl: cleanPath(a.coverUrl) }),
        ...(cleanList(a.screenshots).length && { screenshots: cleanList(a.screenshots) }),
        ...(cleanPath(a.previewUrl) && { previewUrl: cleanPath(a.previewUrl) }),
        published: false,
        createdAt: typeof a.createdAt === 'number' ? a.createdAt : now,
      },
    ];
  });
  if (apps.length === 0) throw new Error('El archivo no tiene apps válidas (cada una necesita título y URL).');
  return apps;
}

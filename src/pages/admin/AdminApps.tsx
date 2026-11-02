import { useRef, useState } from 'react';
import { Package, Plus, Upload } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import { useAsync } from '../../hooks/useAsync';
import { formatPrice } from '../../lib/utils';
import { appsStore } from '../../services/catalog';
import { parseImportedApps } from '../../services/importCatalog';
import type { AppData, WithId } from '../../types';
import { AppForm } from './AppForm';

export function AdminApps() {
  const { data, loading, error, reload } = useAsync(async () => {
    const apps = await appsStore.list();
    return apps.sort((a, b) => b.createdAt - a.createdAt);
  });
  const [editing, setEditing] = useState<WithId<AppData> | 'new' | null>(null);
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  /** Sube el archivo catalogo-importado.json (generado con scripts/import-repos.mjs). Todo entra como borrador. */
  async function importCatalog(file: File) {
    setImporting(true);
    try {
      const incoming = parseImportedApps(await file.text());
      const known = new Set((data ?? (await appsStore.list())).map((a) => a.url));
      const fresh = incoming.filter((a) => !known.has(a.url));
      for (const app of fresh) await appsStore.create(app);
      toast({
        tone: 'success',
        title: `${fresh.length} apps importadas como borrador`,
        description: fresh.length < incoming.length ? `${incoming.length - fresh.length} ya estaban cargadas y se omitieron.` : 'Revisá precio y descripción, y publicalas.',
      });
      reload();
    } catch (e) {
      toast({ tone: 'danger', title: 'No pudimos importar el archivo', description: e instanceof Error ? e.message : undefined });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function togglePublished(app: WithId<AppData>) {
    try {
      await appsStore.update(app.id, { published: !app.published });
      reload();
    } catch {
      toast({ tone: 'danger', title: 'No pudimos actualizar la app' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Archivo de catálogo a importar"
          onChange={(e) => e.target.files?.[0] && void importCatalog(e.target.files[0])}
        />
        <Button variant="secondary" disabled={importing} onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" aria-hidden="true" />
          {importing ? 'Importando…' : 'Importar catálogo'}
        </Button>
        <Button onClick={() => setEditing('new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nueva app
        </Button>
      </div>

      {loading && <GridSkeleton count={3} />}
      {error && <ErrorState onRetry={reload} />}
      {data && data.length === 0 && (
        <EmptyState icon={Package} title="Todavía no cargaste apps" description="Creá la primera con el botón “Nueva app”." />
      )}

      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((app) => (
            <li key={app.id}>
              <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium">{app.title}</p>
                  <p className="text-sm text-text-muted">
                    {app.level} · {formatPrice(app.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={app.published ? 'success' : 'neutral'}>{app.published ? 'Publicada' : 'Borrador'}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => void togglePublished(app)}>
                    {app.published ? 'Despublicar' : 'Publicar'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(app)}>
                    Editar
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing === 'new' ? 'Nueva app' : 'Editar app'}
      >
        {editing && (
          <AppForm
            app={editing === 'new' ? null : editing}
            onSaved={() => {
              setEditing(null);
              reload();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

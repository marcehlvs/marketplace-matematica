import { useState } from 'react';
import { Package, Plus } from 'lucide-react';
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
import type { AppData, WithId } from '../../types';
import { AppForm } from './AppForm';

export function AdminApps() {
  const { data, loading, error, reload } = useAsync(async () => {
    const apps = await appsStore.list();
    return apps.sort((a, b) => b.createdAt - a.createdAt);
  });
  const [editing, setEditing] = useState<WithId<AppData> | 'new' | null>(null);
  const { toast } = useToast();

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
      <div className="flex justify-end">
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

import { Link } from 'react-router-dom';
import { ExternalLink, Library as LibraryIcon } from 'lucide-react';
import { AppCover } from '../components/AppCover';
import { Container, PageHeader } from '../components/layout/Page';
import { Badge } from '../components/ui/Badge';
import { buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GridSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { formatDate } from '../lib/utils';
import { appsStore } from '../services/catalog';
import { listMyEntitlements, listMyOrders } from '../services/library';
import type { AppData, Order, WithId } from '../types';

interface LibraryData {
  owned: WithId<AppData>[];
  pending: WithId<Order>[];
}

export default function Library() {
  const { user } = useAuth();

  const { data, loading, error, reload } = useAsync<LibraryData>(async () => {
    if (!user) return { owned: [], pending: [] };
    const [entitlements, orders, apps] = await Promise.all([
      listMyEntitlements(user.uid),
      listMyOrders(user.uid),
      appsStore.listWhere('published', true),
    ]);
    const ownedIds = new Set(entitlements.map((e) => e.appId));
    return {
      owned: apps.filter((a) => ownedIds.has(a.id)),
      pending: orders.filter((o) => o.status === 'pending'),
    };
  }, [user?.uid]);

  return (
    <Container>
      <PageHeader title="Mi biblioteca" description="Tus apps y pedidos." />

      {loading && <GridSkeleton count={3} />}
      {error && <ErrorState onRetry={reload} />}

      {data && data.owned.length === 0 && data.pending.length === 0 && (
        <EmptyState
          icon={LibraryIcon}
          title="Todavía no tenés apps"
          description="Cuando compres una, la vas a encontrar acá."
          action={
            <Link to="/catalogo" className={buttonClasses()}>
              Explorar catálogo
            </Link>
          }
        />
      )}

      {data && data.owned.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.owned.map((app) => (
            <li key={app.id}>
              <Card className="flex h-full flex-col overflow-hidden">
                <AppCover app={app} />
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <h2 className="text-lg font-semibold">{app.title}</h2>
                  <p className="line-clamp-2 flex-1 text-sm text-text-muted">{app.summary}</p>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses({ className: 'w-full' })}
                  >
                    Abrir
                    <ExternalLink className="size-4" aria-hidden="true" />
                    <span className="sr-only">{app.title} (se abre en una pestaña nueva)</span>
                  </a>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {data && data.pending.length > 0 && (
        <section aria-labelledby="pendientes" className="mt-10">
          <h2 id="pendientes" className="mb-3 text-xl font-bold">
            Pedidos pendientes
          </h2>
          <ul className="space-y-2">
            {data.pending.map((order) => (
              <li key={order.id}>
                <Card className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium">{order.appTitle}</p>
                    <p className="text-sm text-text-muted">Pedido del {formatDate(order.createdAt)}</p>
                  </div>
                  <Badge tone="warning">Pendiente</Badge>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}

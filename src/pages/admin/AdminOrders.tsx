import { useState } from 'react';
import { ReceiptText } from 'lucide-react';
import { Badge, type BadgeTone } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, formatPrice } from '../../lib/utils';
import { approveOrder, ordersStore, rejectOrder } from '../../services/library';
import type { Order, OrderStatus, WithId } from '../../types';

const statusLabel: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pendiente', tone: 'warning' },
  approved: { label: 'Aprobado', tone: 'success' },
  rejected: { label: 'Rechazado', tone: 'danger' },
};

export function AdminOrders() {
  const { data, loading, error, reload } = useAsync(async () => {
    const orders = await ordersStore.list();
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const { toast } = useToast();

  async function act(order: WithId<Order>, action: 'approve' | 'reject') {
    setBusyId(order.id);
    try {
      if (action === 'approve') await approveOrder(order);
      else await rejectOrder(order);
      toast({ tone: 'success', title: action === 'approve' ? 'Pedido aprobado: acceso otorgado' : 'Pedido rechazado' });
      reload();
    } catch {
      toast({ tone: 'danger', title: 'No pudimos actualizar el pedido' });
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <GridSkeleton count={2} />;
  if (error) return <ErrorState onRetry={reload} />;
  if (!data || data.length === 0) {
    return <EmptyState icon={ReceiptText} title="Sin pedidos todavía" description="Los pedidos de compra aparecen acá." />;
  }

  return (
    <ul className="space-y-2">
      {data.map((order) => {
        const status = statusLabel[order.status];
        return (
          <li key={order.id}>
            <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium">{order.appTitle}</p>
                <p className="truncate text-sm text-text-muted">
                  {order.email} · {formatPrice(order.amount)} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={status.tone}>{status.label}</Badge>
                {order.status === 'pending' && (
                  <>
                    <Button size="sm" loading={busyId === order.id} onClick={() => void act(order, 'approve')}>
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busyId === order.id}
                      onClick={() => void act(order, 'reject')}
                    >
                      Rechazar
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

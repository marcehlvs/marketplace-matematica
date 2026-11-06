import { AppWindow, MessageSquareText, ReceiptText } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { useAsync } from '../../hooks/useAsync';
import { appsStore } from '../../services/catalog';
import { ordersStore } from '../../services/library';
import { quotesStore } from '../../services/quotes';

/** Resumen del panel: apps publicadas, pedidos pendientes y presupuestos nuevos. */
export function AdminStats() {
  const { data, loading, error } = useAsync(async () => {
    const [apps, orders, quotes] = await Promise.all([appsStore.list(), ordersStore.list(), quotesStore.list()]);
    return {
      published: apps.filter((a) => a.published).length,
      drafts: apps.filter((a) => !a.published).length,
      pending: orders.filter((o) => o.status === 'pending').length,
      newQuotes: quotes.filter((q) => q.status === 'new').length,
    };
  });

  // Si falla la carga no se bloquea el panel: las tarjetas muestran "—".
  const v = error ? null : data;
  return (
    <section aria-label="Resumen" className="mb-6 grid gap-3 sm:grid-cols-3">
      <StatCard
        label="Apps publicadas"
        icon={AppWindow}
        loading={loading}
        value={v?.published ?? null}
        hint={v && v.drafts > 0 ? `${v.drafts} en borrador` : undefined}
      />
      <StatCard
        label="Pedidos pendientes"
        icon={ReceiptText}
        loading={loading}
        value={v?.pending ?? null}
        attention={!!v && v.pending > 0}
        hint={v && v.pending > 0 ? 'Esperan tu aprobación' : undefined}
      />
      <StatCard
        label="Presupuestos nuevos"
        icon={MessageSquareText}
        loading={loading}
        value={v?.newQuotes ?? null}
        attention={!!v && v.newQuotes > 0}
        hint={v && v.newQuotes > 0 ? 'Sin responder' : undefined}
      />
    </section>
  );
}

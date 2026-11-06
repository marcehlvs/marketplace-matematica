import { useState } from 'react';
import { Container, PageHeader } from '../../components/layout/Page';
import { Tabs } from '../../components/ui/Tabs';
import { AdminApps } from './AdminApps';
import { AdminOrders } from './AdminOrders';
import { AdminQuotes } from './AdminQuotes';
import { AdminStats } from './AdminStats';

const tabs = [
  { id: 'apps', label: 'Apps', Panel: AdminApps },
  { id: 'pedidos', label: 'Pedidos', Panel: AdminOrders },
  { id: 'presupuestos', label: 'Presupuestos', Panel: AdminQuotes },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function Admin() {
  const [active, setActive] = useState<TabId>('apps');
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <Container>
      <PageHeader title="Panel admin" description="Gestioná el catálogo, los pedidos y los presupuestos." />
      <AdminStats />

      <Tabs
        tabs={tabs.map(({ id, label }) => ({ id, label }))}
        value={active}
        onChange={setActive}
        label="Secciones del panel"
        idPrefix="admin"
        className="mb-6"
      />

      <div role="tabpanel" id={`admin-panel-${current.id}`} aria-labelledby={`admin-tab-${current.id}`}>
        <current.Panel />
      </div>
    </Container>
  );
}

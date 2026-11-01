import { useState } from 'react';
import { Container, PageHeader } from '../../components/layout/Page';
import { cn } from '../../lib/utils';
import { AdminApps } from './AdminApps';
import { AdminOrders } from './AdminOrders';
import { AdminQuotes } from './AdminQuotes';

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

      <div role="tablist" aria-label="Secciones del panel" className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(e) => {
              const i = tabs.findIndex((t) => t.id === active);
              if (e.key === 'ArrowRight') setActive(tabs[(i + 1) % tabs.length].id);
              if (e.key === 'ArrowLeft') setActive(tabs[(i - 1 + tabs.length) % tabs.length].id);
            }}
            className={cn(
              '-mb-px h-11 shrink-0 border-b-2 px-4 font-medium transition-colors',
              active === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
        <current.Panel />
      </div>
    </Container>
  );
}

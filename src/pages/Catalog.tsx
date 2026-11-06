import { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { AppGrid } from '../components/AppGrid';
import { Container, PageHeader } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/States';
import { LEVELS, TOPICS } from '../config';
import { useAsync } from '../hooks/useAsync';
import { listPublishedApps } from '../services/catalog';

export default function Catalog() {
  const { data, loading, error, reload } = useAsync(listPublishedApps);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter(
      (app) =>
        (!q || `${app.title} ${app.summary}`.toLowerCase().includes(q)) &&
        (!level || app.level === level) &&
        (!topic || app.topics.includes(topic)),
    );
  }, [data, search, level, topic]);

  const hasFilters = Boolean(search || level || topic);
  const clear = () => {
    setSearch('');
    setLevel('');
    setTopic('');
  };

  return (
    <Container>
      <PageHeader title="Catálogo" description="Apps de matemática para cada año y tema." />

      <form
        role="search"
        aria-label="Filtrar apps"
        onSubmit={(e) => e.preventDefault()}
        className="mb-6 grid gap-3 md:grid-cols-[1fr_14rem]"
      >
        <Input
          label="Buscar"
          type="search"
          placeholder="Ej: derivadas"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select label="Tema" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Todos</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </form>

      <Tabs
        label="Filtrar por año"
        value={level}
        onChange={setLevel}
        tabs={[{ id: '', label: 'Todos' }, ...LEVELS.map((l) => ({ id: l as string, label: l }))]}
        className="mb-6"
      />

      <p className="sr-only" aria-live="polite">
        {!loading && !error ? `${filtered.length} apps encontradas` : ''}
      </p>

      <AppGrid
        apps={filtered}
        loading={loading}
        error={error}
        onRetry={reload}
        skeletonCount={6}
        empty={
          hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No encontramos apps con esos filtros"
              description="Probá con otro año o tema."
              action={
                <Button variant="secondary" onClick={clear}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : undefined
        }
      />
    </Container>
  );
}

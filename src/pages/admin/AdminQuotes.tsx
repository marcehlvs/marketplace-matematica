import { MessageSquareText } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Field';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import { useAsync } from '../../hooks/useAsync';
import { formatDate } from '../../lib/utils';
import { listQuotes, setQuoteStatus } from '../../services/quotes';
import type { QuoteStatus } from '../../types';

const statusLabel: Record<QuoteStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  closed: 'Cerrado',
};

export function AdminQuotes() {
  const { data, loading, error, reload } = useAsync(listQuotes);
  const { toast } = useToast();

  async function changeStatus(id: string, status: QuoteStatus) {
    try {
      await setQuoteStatus(id, status);
      reload();
    } catch {
      toast({ tone: 'danger', title: 'No pudimos actualizar el presupuesto' });
    }
  }

  if (loading) return <GridSkeleton count={2} />;
  if (error) return <ErrorState onRetry={reload} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="Sin pedidos de presupuesto"
        description="Los pedidos de apps a medida aparecen acá."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {data.map((quote) => (
        <li key={quote.id}>
          <Card className="space-y-3 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">
                  {quote.name} <span className="font-normal text-text-muted">· {quote.email}</span>
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge tone="primary">{quote.subject}</Badge>
                  <span className="text-sm text-text-muted">{formatDate(quote.createdAt)}</span>
                  {quote.budget && <span className="text-sm text-text-muted">Presupuesto: {quote.budget}</span>}
                </div>
              </div>
              <div className="sm:w-44">
                <Select
                  label={`Estado de ${quote.name}`}
                  hideLabel
                  value={quote.status}
                  onChange={(e) => void changeStatus(quote.id, e.target.value as QuoteStatus)}
                >
                  {(Object.keys(statusLabel) as QuoteStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <p className="whitespace-pre-line text-sm">{quote.description}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}

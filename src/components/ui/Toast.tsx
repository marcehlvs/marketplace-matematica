import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

type Tone = 'success' | 'danger' | 'info';

interface ToastInput {
  title: string;
  description?: string;
  tone?: Tone;
}

interface ToastItem extends ToastInput {
  id: number;
}

const toneStyles: Record<Tone, { icon: LucideIcon; className: string }> = {
  success: { icon: CheckCircle2, className: 'text-success' },
  danger: { icon: AlertCircle, className: 'text-danger' },
  info: { icon: Info, className: 'text-primary' },
};

const ToastContext = createContext<{ toast: (input: ToastInput) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { ...input, id }]);
    setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 5000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 md:inset-x-auto md:right-4 md:w-96"
      >
        {items.map(({ id, title, description, tone = 'info' }) => {
          const { icon: Icon, className } = toneStyles[tone];
          return (
            <div key={id} className="flex gap-3 rounded-lg border border-border bg-surface p-4 shadow-md">
              <Icon className={cn('mt-0.5 size-5 shrink-0', className)} aria-hidden="true" />
              <div>
                <p className="font-medium">{title}</p>
                {description && <p className="text-sm text-text-muted">{description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}

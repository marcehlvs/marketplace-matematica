import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  badge?: number | string;
  icon?: ReactNode;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  /** Prefijo para enlazar cada pestaña con su panel (aria-controls). */
  idPrefix?: string;
  className?: string;
}

/**
 * Pestañas con indicador animado (estilo EasyUI "AnimatedTabs"), con teclado completo:
 * flechas, Inicio y Fin. Si no hay paneles asociados, usarlo como selector de filtro.
 */
export function Tabs<T extends string>({ tabs, value, onChange, label, idPrefix, className }: TabsProps<T>) {
  const reduce = useReducedMotion();
  const layoutId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const next =
      e.key === 'ArrowRight' ? (index + 1) % tabs.length
      : e.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('inline-flex max-w-full gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1', className)}
    >
      {tabs.map((tab, i) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={idPrefix ? `${idPrefix}-tab-${tab.id}` : undefined}
            aria-selected={active}
            aria-controls={idPrefix ? `${idPrefix}-panel-${tab.id}` : undefined}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'relative h-9 shrink-0 rounded-md px-3.5 text-sm font-medium transition-colors',
              active ? 'text-text' : 'text-text-muted hover:text-text',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                aria-hidden="true"
                className="absolute inset-0 rounded-md border border-border-strong/40 bg-surface-2"
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32, mass: 0.6 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && tab.badge !== 0 && (
                <span className="rounded bg-bg px-1.5 py-0.5 font-mono text-[11px] leading-none text-text-muted">{tab.badge}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

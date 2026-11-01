import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../../lib/utils';

interface FieldMeta {
  label: string;
  /** Oculta la etiqueta visualmente pero la mantiene para lectores de pantalla. */
  hideLabel?: boolean;
  error?: string;
  hint?: string;
}

interface ControlProps {
  id: string;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
}

function FieldShell({
  label,
  hideLabel,
  error,
  hint,
  id,
  children,
}: FieldMeta & { id?: string; children: (control: ControlProps) => ReactNode }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const descId = `${fieldId}-desc`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className={cn('text-sm font-medium text-text', hideLabel && 'sr-only')}>
        {label}
      </label>
      {children({
        id: fieldId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error || hint ? descId : undefined,
      })}
      {(error || hint) && (
        <p
          id={descId}
          role={error ? 'alert' : undefined}
          className={cn('text-sm', error ? 'text-danger' : 'text-text-muted')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

const control =
  'w-full rounded-md border border-border-strong bg-surface px-3 text-base text-text placeholder:text-text-muted disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldMeta>(function Input(
  { label, hideLabel, error, hint, id, className, ...props },
  ref,
) {
  return (
    <FieldShell label={label} hideLabel={hideLabel} error={error} hint={hint} id={id}>
      {(a) => (
        <input ref={ref} className={cn(control, 'h-11', error && 'border-danger', className)} {...a} {...props} />
      )}
    </FieldShell>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldMeta>(
  function Textarea({ label, hideLabel, error, hint, id, className, ...props }, ref) {
    return (
      <FieldShell label={label} hideLabel={hideLabel} error={error} hint={hint} id={id}>
        {(a) => (
          <textarea
            ref={ref}
            className={cn(control, 'min-h-28 py-2', error && 'border-danger', className)}
            {...a}
            {...props}
          />
        )}
      </FieldShell>
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & FieldMeta>(
  function Select({ label, hideLabel, error, hint, id, className, children, ...props }, ref) {
    return (
      <FieldShell label={label} hideLabel={hideLabel} error={error} hint={hint} id={id}>
        {(a) => (
          <select ref={ref} className={cn(control, 'h-11', error && 'border-danger', className)} {...a} {...props}>
            {children}
          </select>
        )}
      </FieldShell>
    );
  },
);

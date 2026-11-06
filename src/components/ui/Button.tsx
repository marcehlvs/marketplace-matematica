import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-150 active:scale-[0.97] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-contrast shadow-md hover:bg-primary-hover',
  secondary: 'border border-border bg-surface text-text hover:border-border-strong hover:bg-surface-2',
  ghost: 'text-text hover:bg-surface-2',
  danger: 'bg-danger text-danger-contrast hover:opacity-90',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-7 text-base md:h-14 md:px-8 md:text-lg',
  icon: 'size-11',
};

/** Clases de botón reutilizables, para darle aspecto de botón a un <Link> o <a>. */
export function buttonClasses(options: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  const { variant = 'primary', size = 'md', className } = options;
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, disabled, className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});

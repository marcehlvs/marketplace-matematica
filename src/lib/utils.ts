import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return amount === 0 ? 'Gratis' : ars.format(amount);
}

export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(timestamp);
}

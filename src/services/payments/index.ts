import { manualProvider } from './ManualProvider';
import type { PaymentProvider } from './PaymentProvider';

/** Proveedor activo. Para activar Mercado Pago, cambiar solo esta línea. */
export const paymentProvider: PaymentProvider = manualProvider;

export type { CheckoutResult, PaymentProvider } from './PaymentProvider';

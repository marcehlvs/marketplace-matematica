import type { AppData, WithId } from '../../types';

export type CheckoutResult =
  /** El acceso ya quedó otorgado (apps gratuitas). */
  | { kind: 'granted' }
  /** Quedó un pedido pendiente que un admin debe aprobar. */
  | { kind: 'pending'; orderId: string }
  /** Hay que mandar a la persona a pagar a otro sitio (Mercado Pago). */
  | { kind: 'redirect'; url: string };

export interface CheckoutUser {
  uid: string;
  email: string;
}

/**
 * Contrato de cualquier forma de cobro. Las pantallas solo conocen esta interfaz.
 * Hoy: ManualProvider. Mañana: MercadoPagoProvider (ver README, sección "Mercado Pago").
 */
export interface PaymentProvider {
  id: string;
  checkout(app: WithId<AppData>, user: CheckoutUser): Promise<CheckoutResult>;
}

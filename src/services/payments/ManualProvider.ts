import { createPendingOrder, grantEntitlement } from '../library';
import type { PaymentProvider } from './PaymentProvider';

/**
 * Cobro coordinado a mano: no procesa pagos.
 *  - App gratuita  → acceso inmediato.
 *  - App paga      → crea un pedido "pendiente"; el admin lo aprueba cuando cobró por fuera.
 */
export const manualProvider: PaymentProvider = {
  id: 'manual',
  async checkout(app, user) {
    if (app.price === 0) {
      await grantEntitlement(user.uid, app.id);
      return { kind: 'granted' };
    }
    const order = await createPendingOrder(user, app);
    return { kind: 'pending', orderId: order.id };
  },
};

import type { AppData, Entitlement, Order, WithId } from '../types';
import { createStore } from './store';

export const entitlementsStore = createStore<Entitlement>('entitlements');
export const ordersStore = createStore<Order>('orders');

export const entitlementId = (uid: string, appId: string) => `${uid}_${appId}`;

export function listMyEntitlements(uid: string) {
  return entitlementsStore.listWhere('uid', uid);
}

export async function listMyOrders(uid: string) {
  const orders = await ordersStore.listWhere('uid', uid);
  return orders.sort((a, b) => b.createdAt - a.createdAt);
}

export async function grantEntitlement(uid: string, appId: string) {
  await entitlementsStore.set(entitlementId(uid, appId), { uid, appId, createdAt: Date.now() });
}

export async function createPendingOrder(user: { uid: string; email: string }, app: WithId<AppData>) {
  return ordersStore.create({
    uid: user.uid,
    email: user.email,
    appId: app.id,
    appTitle: app.title,
    amount: app.price,
    status: 'pending',
    createdAt: Date.now(),
  });
}

/** Aprobar un pedido otorga el acceso a la app. Lo hace un admin. */
export async function approveOrder(order: WithId<Order>) {
  await grantEntitlement(order.uid, order.appId);
  await ordersStore.update(order.id, { status: 'approved' });
}

export function rejectOrder(order: WithId<Order>) {
  return ordersStore.update(order.id, { status: 'rejected' });
}

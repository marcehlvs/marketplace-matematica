export type WithId<T> = T & { id: string };

export type Role = 'user' | 'admin';

/** Una app del catálogo. Cada app es un sitio aparte; acá se guarda su URL. */
export interface AppData {
  title: string;
  summary: string;
  description: string;
  level: string;
  topics: string[];
  /** Precio en pesos argentinos. 0 = gratis. */
  price: number;
  url: string;
  coverUrl?: string;
  published: boolean;
  createdAt: number;
}

export type OrderStatus = 'pending' | 'approved' | 'rejected';

export interface Order {
  uid: string;
  email: string;
  appId: string;
  appTitle: string;
  amount: number;
  status: OrderStatus;
  createdAt: number;
}

/** Acceso de una persona a una app. El id del documento es `${uid}_${appId}`. */
export interface Entitlement {
  uid: string;
  appId: string;
  createdAt: number;
}

export type QuoteStatus = 'new' | 'contacted' | 'closed';

export interface Quote {
  name: string;
  email: string;
  subject: string;
  description: string;
  budget?: string;
  status: QuoteStatus;
  createdAt: number;
}

import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { WithId } from '../types';

/**
 * Capa de acceso a datos. Misma interfaz para:
 *  - Firestore (cuando hay variables VITE_FIREBASE_* configuradas)
 *  - localStorage (modo demo, sin Firebase)
 * Las pantallas solo conocen esta interfaz, así que el cambio es transparente.
 */
export interface Store<T> {
  list(): Promise<WithId<T>[]>;
  listWhere(field: keyof T & string, value: unknown): Promise<WithId<T>[]>;
  get(id: string): Promise<WithId<T> | null>;
  create(data: T): Promise<WithId<T>>;
  set(id: string, data: T): Promise<void>;
  update(id: string, patch: Partial<T>): Promise<void>;
}

function firestoreStore<T extends object>(name: string): Store<T> {
  const col = () => collection(db!, name);
  const withId = (id: string, data: DocumentData) => ({ ...(data as T), id }) as WithId<T>;

  return {
    async list() {
      const snap = await getDocs(col());
      return snap.docs.map((d) => withId(d.id, d.data()));
    },
    async listWhere(field, value) {
      const snap = await getDocs(query(col(), where(field, '==', value)));
      return snap.docs.map((d) => withId(d.id, d.data()));
    },
    async get(id) {
      const snap = await getDoc(doc(db!, name, id));
      return snap.exists() ? withId(snap.id, snap.data()) : null;
    },
    async create(data) {
      const ref = await addDoc(col(), data as DocumentData);
      return { ...data, id: ref.id };
    },
    async set(id, data) {
      await setDoc(doc(db!, name, id), data as DocumentData);
    },
    async update(id, patch) {
      await updateDoc(doc(db!, name, id), patch as DocumentData);
    },
  };
}

function localStore<T extends object>(name: string, seed: WithId<T>[]): Store<T> {
  const key = `mm:${name}`;

  const read = (): WithId<T>[] => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as WithId<T>[];
    } catch {
      /* ignorar: se usa la semilla */
    }
    write(seed);
    return seed;
  };

  function write(rows: WithId<T>[]) {
    try {
      localStorage.setItem(key, JSON.stringify(rows));
    } catch {
      /* almacenamiento no disponible */
    }
  }

  return {
    async list() {
      return read();
    },
    async listWhere(field, value) {
      return read().filter((row) => (row as Record<string, unknown>)[field] === value);
    },
    async get(id) {
      return read().find((row) => row.id === id) ?? null;
    },
    async create(data) {
      const row = { ...data, id: crypto.randomUUID() } as WithId<T>;
      write([...read(), row]);
      return row;
    },
    async set(id, data) {
      const row = { ...data, id } as WithId<T>;
      write([...read().filter((r) => r.id !== id), row]);
    },
    async update(id, patch) {
      write(read().map((row) => (row.id === id ? { ...row, ...patch } : row)));
    },
  };
}

export function createStore<T extends object>(name: string, seed: WithId<T>[] = []): Store<T> {
  return db ? firestoreStore<T>(name) : localStore<T>(name, seed);
}

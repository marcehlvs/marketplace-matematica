import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { createStore } from '../services/store';
import type { Role } from '../types';

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: Role;
}

interface UserDoc {
  email: string;
  name: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** true cuando no hay Firebase configurado (usuario simulado en el navegador). */
  demo: boolean;
  signInWithGoogle(): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<void>;
  signUpWithEmail(email: string, password: string): Promise<void>;
  signInDemo(role: Role): void;
  signOut(): Promise<void>;
}

const usersStore = createStore<UserDoc>('users');
const DEMO_KEY = 'mm:demo-user';

function readDemoUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(readDemoUser());
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const email = fbUser.email ?? '';
      const name = fbUser.displayName ?? email;
      let role: Role = 'user';
      try {
        const profile = await usersStore.get(fbUser.uid);
        if (profile) {
          role = profile.role;
        } else {
          await usersStore.set(fbUser.uid, { email, name, role: 'user' });
        }
      } catch {
        /* si falla la lectura del perfil, se sigue como usuario común */
      }
      setUser({ uid: fbUser.uid, email, name, role });
      setLoading(false);
    });
  }, []);

  const requireAuth = () => {
    if (!auth) throw new Error('Firebase no está configurado');
    return auth;
  };

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(requireAuth(), new GoogleAuthProvider());
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(requireAuth(), email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(requireAuth(), email, password);
  }, []);

  const signInDemo = useCallback((role: Role) => {
    const demoUser: AuthUser = {
      uid: `demo-${role}`,
      email: `${role}@demo.local`,
      name: role === 'admin' ? 'Admin demo' : 'Usuario demo',
      role,
    };
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
    } catch {
      /* almacenamiento no disponible */
    }
    setUser(demoUser);
  }, []);

  const signOut = useCallback(async () => {
    if (auth) {
      await firebaseSignOut(auth);
    } else {
      try {
        localStorage.removeItem(DEMO_KEY);
      } catch {
        /* almacenamiento no disponible */
      }
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      demo: !isFirebaseConfigured,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInDemo,
      signOut,
    }),
    [user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signInDemo, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

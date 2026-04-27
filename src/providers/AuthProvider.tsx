import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        console.error('Firebase Auth: Listener error', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // CRÍTICO: No hacer ningún setState (como setLoading) ANTES de abrir el popup.
    // De lo contrario, los navegadores móviles pierden el contexto del "click"
    // del usuario y bloquean el popup pensando que es spam.
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Firebase Auth: login failed –', err?.code, err?.message);
      
      // Manejar el caso de que la IP local no esté en Firebase
      if (err?.code === 'auth/unauthorized-domain') {
        toast.error('Dominio no autorizado. Agrega tu IP local a Firebase Console.');
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('No se pudo iniciar sesión. Intenta de nuevo.');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (err) {
      console.error('Firebase Auth: logout failed', err);
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

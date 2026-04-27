import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';



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
    console.log('Firebase Auth: Starting listener...');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Firebase Auth: State changed', firebaseUser?.email || 'Logged out');
      setUser(firebaseUser);
      setLoading(false);
    }, (error) => {
      console.error('Firebase Auth: Listener error', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log('Firebase Auth: Initiating popup...');
      await signInWithPopup(auth, googleProvider);
      console.log('Firebase Auth: Popup resolved');
    } catch (error) {
      console.error('Firebase Auth: Login failed', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Firebase Auth: Logout failed', error);
      setLoading(false);
      throw error;
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

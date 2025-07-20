import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState, LoginFormData, RegisterFormData } from '../types';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout,
  resetPassword,
  updateUserProfile,
  onAuthStateChange,
} from '../services/authService';

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const unsubscribe = onAuthStateChange((user) => {
      setState({
        user,
        loading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  const login = async (data: LoginFormData): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await loginWithEmail(data);
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await registerWithEmail(data);
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await loginWithGoogle();
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await logout();
      setState(prev => ({ ...prev, user: null, loading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const handleResetPassword = async (email: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await resetPassword(email);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const handleUpdateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateUserProfile(state.user.uid, updates);
      
      // Mettre à jour l'état local
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    loginWithGoogle: handleGoogleLogin,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    updateProfile: handleUpdateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}; 
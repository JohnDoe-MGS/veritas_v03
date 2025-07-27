"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEST_USERS: Record<string, { pass: string, user: User }> = {
    'admin@veritas.com': {
        pass: 'compliance2024',
        user: { id: 'user-01', email: 'admin@veritas.com', name: 'Admin VERITAS', role: 'admin' }
    },
    'user@veritas.com': {
        pass: 'user2024',
        user: { id: 'user-02', email: 'user@veritas.com', name: 'Usuário Padrão', role: 'user' }
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const router = useRouter();

  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = TEST_USERS[email];
        if (userData && userData.pass === pass) {
          setUser(userData.user);
          router.push('/dashboard');
          resolve();
        } else {
          reject(new Error('Credenciais inválidas.'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
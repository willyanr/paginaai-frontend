"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, logout as logoutService } from '../services/auth';
import { useRouter } from 'next/navigation';


interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsAuthenticated(!!token); 
  }, []);

  
  const login = async (username: string, password: string) => {
    try {
      await loginService(username, password);
      localStorage.setItem('access', 'true'); 
      setIsAuthenticated(true);
      router.push('/editor')
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  };

  const logout = () => {
    logoutService(); 
    localStorage.removeItem('access');
    setIsAuthenticated(false);
    router.push('/signin')
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
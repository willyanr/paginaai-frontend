"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService,
    logout as logoutService,
    getAccessToken,
    registerUser as ServiceRegisterUser,
    verifyCodeOtp as ServiceVerifyCodeOtp,
    resetPassword as ServiceResetPassword,
    resetPasswordFinal as ServiceResetPasswordFinal,
    
  
  } from '../services/auth';
import { useRouter } from 'next/navigation';
import { useAlertContext } from './AlertContext';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  register: (payload: any) => Promise<void>;
  verifyCode:  (payload: any) => Promise<void>;
  userResetPassword: (payload: any) => Promise<void>;
  verifyCodeResetPassword: (payload: any) => Promise<void>;
  resetPasswordFinal: (payload: any) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onAlert } = useAlertContext();
  // Verifica o token ao carregar a página
  useEffect(() => {
    const checkAuthentication = () => {
      const token = getAccessToken();
      setIsAuthenticated(!!token);
    };

    checkAuthentication();
    
    window.addEventListener('storage', checkAuthentication);
    
    return () => {
      window.removeEventListener('storage', checkAuthentication);
    };
  }, []);

  const login = async (payload: any) => {
    try {
      await loginService(payload);
      setIsAuthenticated(true);
      router.push('/editor');
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setIsAuthenticated(false);
    router.push('/signin');
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      await ServiceRegisterUser(payload);
      localStorage.setItem('cpf', payload.profile.cpf)
      localStorage.setItem('email', payload.email)
      router.push('/otp')
    } catch (error) {
      onAlert(true, 'error', error.message)
     
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const verifyCode = async (payload: any) => {
    setIsLoading(true);
    try {
      await ServiceVerifyCodeOtp(payload);
      setTimeout(() => {
        router.push('/signin');
      }, 2000);  
    } catch (error) {
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const userResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const payload = {
        email: email
      }
      await ServiceResetPassword(payload);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const verifyCodeResetPassword = async (payload: any) => {
    setIsLoading(true);
    try {
      await ServiceResetPassword(payload);
    } catch (error) {
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordFinal = async (payload: any) => {
    setIsLoading(true);
    try {
      await ServiceResetPasswordFinal(payload);
      setTimeout(() => {
        router.push('/signin');
      }, 2000);  
    } catch (error) {
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  
  
  
  const checkAuth = () => {
    const token = getAccessToken();
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
       isLoading,
        login,
         logout,
          checkAuth,
           register,
            verifyCode,
             userResetPassword,
             verifyCodeResetPassword,
             resetPasswordFinal
             
             }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
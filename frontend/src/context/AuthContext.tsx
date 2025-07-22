"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  login as loginService,
  logout as logoutService,
  getAccessToken,
  registerUser as ServiceRegisterUser,
  verifyCodeOtp as ServiceVerifyCodeOtp,
  resetPassword as ServiceResetPassword,
  resetPasswordFinal as ServiceResetPasswordFinal,

} from '../services/auth';
import { useRouter } from 'next/navigation';
import { useAlertContext } from './AlertContext';
import { ResetUserPasswordPayload, VerifyCodePayload } from '@/interfaces/user.interface';
import { RegisterUser } from '@/interfaces/user.interface';

interface LoginType {
  email: string;
  password: string;
}




interface VerifyCodeType {
  cpf: string;
  otp: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginType) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  register: (payload: RegisterUser) => Promise<void>;
  verifyCode: (payload: VerifyCodeType) => Promise<void>;
  userResetPassword: (email: string) => Promise<void>;
  verifyCodeResetPassword: (payload: VerifyCodePayload | VerifyCodePayload) => Promise<void>;
  resetPasswordFinal: (payload: ResetUserPasswordPayload) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onAlert } = useAlertContext();


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

  const login = async (payload: LoginType) => {
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

  const register = async (payload: RegisterUser) => {
    setIsLoading(true);
    try {
      await ServiceRegisterUser(payload);
      localStorage.setItem('cpf', payload.profile.cpf)
      localStorage.setItem('email', payload.email)
      router.push('/otp')
   } catch (error: unknown) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Erro ao Registrar Usuário.';
      onAlert(true, 'error', errorMessage)
    } finally {
      setIsLoading(false);
    }
  };
  const verifyCode = async (payload: VerifyCodeType) => {
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
    
      await ServiceResetPassword(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const verifyCodeResetPassword = async (payload: VerifyCodePayload) => {
    setIsLoading(true);
    console.log('body', payload);
    try {
      await ServiceResetPassword(payload);
    } catch (error) {

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordFinal = async (payload: ResetUserPasswordPayload) => {
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
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  login as loginService,
  registerUser as ServiceRegisterUser,
  verifyCodeOtp as ServiceVerifyCodeOtp,
  resetPassword as ServiceResetPassword,
  resetPasswordFinal as ServiceResetPasswordFinal,
  createSubscription as ServiceCreateSSubscription,
} from '../services/auth';
import { useRouter } from 'next/navigation';
import { useAlertContext } from './AlertContext';
import { DataSubscription, ResetUserPasswordPayload, VerifyCodePayload } from '@/interfaces/user.interface';
import { RegisterUser } from '@/interfaces/user.interface';
import { useApi } from '@/services/api';

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
  isLoading: boolean;
  login: (payload: LoginType) => Promise<void>;
  subscription: () => Promise<DataSubscription | undefined>;
  register: (payload: RegisterUser) => Promise<void>;
  verifyCode: (payload: VerifyCodeType) => Promise<void>;
  userResetPassword: (email: string) => Promise<void>;
  verifyCodeResetPassword: (payload: VerifyCodePayload | VerifyCodePayload) => Promise<void>;
  resetPasswordFinal: (payload: ResetUserPasswordPayload) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onAlert } = useAlertContext();
  const api = useApi();
  //   useEffect(() => {
  //   const verifyAuth = async () => {
  //     try {
  //       await AuthService.checkAuth(); 
  //       setIsAuthenticated(true);
        
  //     } catch {
  //       setIsAuthenticated(false);
  //     } finally{
  //       setIsAuthChecked(true);
  //     }
  //   };

  //   verifyAuth();
  // }, [router]);


  const login = async (payload: LoginType) => {
      await loginService(api, payload);
      router.push('/');
  };

  
    const subscription = async () => {
      try{
        const sub = await ServiceCreateSSubscription(api);
        return sub
      }
      catch (error: unknown) {
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Erro ao criar assinatura.';
        onAlert(true, 'error', errorMessage)
      } 
  };

  const register = async (payload: RegisterUser) => {
    setIsLoading(true);
    try {
      await ServiceRegisterUser(api, payload);
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
      await ServiceVerifyCodeOtp(api, payload);
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

      await ServiceResetPassword(api, email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const verifyCodeResetPassword = async (payload: VerifyCodePayload) => {
    setIsLoading(true);
    try {
      await ServiceResetPassword(api, payload);
    } catch (error) {

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordFinal = async (payload: ResetUserPasswordPayload) => {
    setIsLoading(true);
    try {
      await ServiceResetPasswordFinal(api, payload);
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error) {

      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <AuthContext.Provider value={{
      isLoading,
      login,
      subscription,
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
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

interface LoginType {
  email: string;
  password: string;
}

interface ResetUserPasswordType {
  otp: string;
  email: string;
  password: string;
}

interface RegisterUserType {
  email: string,
  password: string,
  profile: {
    name: string,
    whatsapp: string,
    cpf: string,
    how_did_you_hear_about_us: string,
  }
}

interface VerifyCodeResetPasswordType {
  otp: string;
  email: string;
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
  register: (payload: RegisterUserType) => Promise<void>;
  verifyCode: (payload: VerifyCodeType) => Promise<void>;
  userResetPassword: (payload: ResetUserPasswordType) => Promise<void>;
  verifyCodeResetPassword: (payload: VerifyCodeResetPasswordType) => Promise<void>;
  resetPasswordFinal: (payload: ResetUserPasswordType) => Promise<void>;
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

  const register = async (payload: RegisterUserType) => {
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
  const verifyCodeResetPassword = async (payload: VerifyCodeResetPasswordType) => {
    setIsLoading(true);
    try {
      await ServiceResetPassword(payload);
    } catch (error) {

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordFinal = async (payload: ResetUserPasswordType) => {
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
"use client";

import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import Button from '../ui/button/Button';
import { useRouter } from 'next/navigation';
import { useAlertContext } from '@/context/AlertContext';
import { useAuth } from '@/context/AuthContext';
import Alert from '../ui/alert/Alert';

export default function OTPVerify() {
  const [otp, setOtp] = useState('');
  const [userID, setUserID] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();
  const { onAlert, isAlert, messageAlert, typeAlert } = useAlertContext();
  const { verifyCode, isLoading } = useAuth();

  useEffect(() => {
    const resultCpf = localStorage.getItem('cpf');
    const resultEmail = localStorage.getItem('email');
    if (resultCpf && resultEmail) {
      setUserID(resultCpf)
      setUserEmail(resultEmail)
    } else {
      router.push('/signup')
    }
  }, [setUserID, setUserEmail, router]);

  const handleVerify = async () => {
    if (!otp) return onAlert(true, 'error', 'Por favor, digite o código com 6 digítos.')
    try {
      const payload = {
        cpf: userID,
        otp: otp,
        email: userEmail
      }
      await verifyCode(payload);
      onAlert(true, 'success', 'Código verificado com sucesso!')
    } catch (error) {
      onAlert(true, 'error', error.message)
      if (error.message === "Registro temporário não encontrado ou expirado") {
        setTimeout(() => {
          router.push('/signup');
        }, 2000); 
      }
    }
  };




  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 w-full dark:bg-black">
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-6 max-w-md w-full border border-gray-300 dark:border-gray-600">
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 dark:text-white">
        Vamos verificar seu e-mail.
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6 dark:text-gray-300">
        Insira o código enviado para seu e-mail.
      </p>
      <div className="flex flex-col justify-center mb-6">
  
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputType="text"
          renderSeparator={<span className="mx-1"> </span>}
          inputStyle={{ width: 'calc(100% / 6 - 0.5rem)', height: "3.5rem", margin: '0.25rem' }}
          containerStyle="flex justify-center mb-6 w-full"
          renderInput={(props) => <input {...props} className="text-gray-500 text-center rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:text-white dark:border-gray-600" />}
  
        />
        <span className='text-center text-sm dark:text-gray-400'>Você tem 3 tentativas, verifique em seu e-mail na caixa de spam ou lixeira.</span>
      </div>
  
  
      <div className='flex flex-col sm:flex-row justify-between gap-4'>
        <Button
          variant='outline'
          onClick={() => router.push('/signup')}
          className="w-full sm:w-auto"
        >
          Corrigir dados
        </Button>
        <Button
          onClick={() => handleVerify()}
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          Verificar Código
        </Button>
  
      </div>
    </div>
    {isAlert && (
      <div className="fixed top-24 right-4 z-50">
        <Alert
          message={messageAlert}
          variant={typeAlert}
          title={typeAlert === "success" ? "Sucesso" : "Erro"}
        />
      </div>
    )}
  </div>
  );
}

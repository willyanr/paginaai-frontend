"use client";

import React, { useState } from 'react';
import Button from '../ui/button/Button';
import { useAlertContext } from '@/context/AlertContext';
import Alert from '../ui/alert/Alert';
import { useAuth } from '@/context/AuthContext';
import OtpInput from 'react-otp-input';
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function ResetPassword() {
  const { isAlert, messageAlert, typeAlert, onAlert } = useAlertContext();
  const { userResetPassword, verifyCodeResetPassword, resetPasswordFinal, isLoading } = useAuth();
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [InputPassword, setIsInputPassword] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [otp, setOtp] = useState('');



  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required("A senha é obrigatória.")
      .min(6, "A senha deve ter pelo menos 6 caracteres.")
      .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
      .matches(/\d/, "A senha deve conter pelo menos um número.")
      .matches(/[\W_]/, "A senha deve conter pelo menos um caractere especial."),
    confirmPassword: yup
      .string()
      .required("Confirme a senha.")
      .oneOf([yup.ref("password"), null], "As senhas não coincidem."),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });



  const sendEmail = async () => {
    if (!userEmail) return onAlert(true, 'error', 'Por favor, digite um e-mail.');
    try {
      await userResetPassword(userEmail);
      onAlert(true, 'success', 'Código enviado para seu email.')
      setIsOTP(true);
    } catch (error) {
      onAlert(true, 'error', error.message)
    } finally {

    }
  };


  const verifyCodeOTPPassword = async () => {
    if (!otp) return onAlert(true, 'error', 'Por favor, digite o código de 6 digitos.');
    try {

      const payload = {
        email: userEmail,
        otp: otp
      }
      await verifyCodeResetPassword(payload);
      onAlert(true, 'success', 'Boa! agora só cadastrar uma nova senha.')
      setIsInputPassword(true);
    } catch (error) {
      onAlert(true, 'error', error.message)
    } finally {

    }
  };
  const onSubmit = async (data) => {
    try {
      const payload = {
        otp: otp,
        email: userEmail,
        password: data.password,
      };
  
      await resetPasswordFinal(payload);
      onAlert(true, "success", 'Senha alterada com sucesso!');
    } catch (error) {
      console.error("Erro no reset:", error);
      onAlert(true, "error", error.message || "Erro ao realizar cadastro.");
    }
  };
  



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 w-full dark:bg-black">
      {!isOTP && !InputPassword &&
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-6 max-w-md w-full border border-gray-300 dark:border-gray-600">
          <div className='flex flex-col gap-5 justify-center'>
            <Label>
              Por favor, digite seu e-mail
            </Label>
            <div>
              <Input
                type='text'
                name='email'
                placeholder='Digite seu e-mail'
                defaultValue={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />

              <div className='py-3'>
                <span className='text-sm dark:text-gray-400'>Vamos enviar um código para seu e-mail para você redefinir sua senha.</span>
              </div>
            </div>
            <div className='mx-auto'>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                onClick={() => sendEmail()}
              >
                Enviar código para alterar senha
              </Button>
            </div>
          </div>
        </div>
      }
      {isOTP && !InputPassword &&
        <div>
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 w-full dark:bg-black">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-6 max-w-md w-full border border-gray-300 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 dark:text-white">
                Quase lá...
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
                  onClick={() => setIsOTP(false)}
                  className="w-full sm:w-auto"
                >
                  Corrigir dados
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                  onClick={() => verifyCodeOTPPassword()}
                >
                  Verificar Código
                </Button>

              </div>
            </div>
          </div>
        </div>
      }
      {InputPassword &&
        <div>
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 w-full dark:bg-black">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-6 max-w-md w-full border border-gray-300 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 dark:text-white">
                Boa! agora só digitar uma nova senha
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6 dark:text-gray-300">
               Digite sua nova senha.
              </p>
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Label>
                  Digite sua nova senha
                </Label>
                <Input
                  type='text'
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-error-500">
                    {errors.password.message}
                  </p>
                )}
                <Label>
                  Repita a senha digitada
                </Label>
                <Input
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-error-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
                <div className='flex flex-col sm:flex-row justify-between gap-4 py-5'>
                  <Button
                    variant='outline'
                    type='button'
                    onClick={() => setIsInputPassword(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    Redefinir Senha
                  </Button>

                </div>
              </form>

            </div>
          </div>
        </div>

      }
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

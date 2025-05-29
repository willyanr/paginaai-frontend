"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Select from "../form/Select";
import { useAuth } from "@/context/AuthContext";
import { useAlertContext } from "@/context/AlertContext";
import Alert from "../ui/alert/Alert";


import * as yup from "yup";
import { useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePhoneMask } from "@/hooks/useFormatNumberTel";
import { useCPFMask } from "@/hooks/useFormatCpf";
import Button from "../ui/button/Button";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { onAlert, isAlert, messageAlert, typeAlert } = useAlertContext();
  const { register: authRegister, isLoading } = useAuth();

  function isValidCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove qualquer caracter não numérico
  
    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;
  
    // Verifica se todos os números são iguais (exemplo: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;
  
    // Validação dos dois últimos dígitos (os verificadores)
    let sum = 0;
    let remainder: number;
  
    // Validação do primeiro dígito
    for (let i = 0; i < 9; i++) {
      sum += Number(cpf[i]) * (10 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number(cpf[9])) return false;
  
    // Validação do segundo dígito
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += Number(cpf[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number(cpf[10])) return false;
  
    return true;
  }
  
  const validationSchema = yup.object().shape({
    fname: yup
      .string()
      .required("O nome é obrigatório.")
      .matches(/^[^<>]*$/, "O nome não pode conter caracteres < ou >.")
      .max(100, "O nome deve ter no máximo 100 caracteres."),

    tel: yup
      .string()
      .required("O WhatsApp é obrigatório.")
      .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato de WhatsApp inválido."),
    cpf: yup
      .string()
      .required("O CPF é obrigatório.")
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido.")
      .test("valid-cpf", "CPF inválido", (value) => isValidCPF(value || '')),
    email: yup
      .string()
      .email("Digite um e-mail válido.")
      .required("O e-mail é obrigatório."),
    password: yup
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres.")
      .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
      .matches(/\d/, "A senha deve conter pelo menos um número.")
      .matches(/[\W_]/, "A senha deve conter pelo menos um caractere especial.")
      .required("A senha é obrigatória."),
    
    terms: yup
      .boolean()
      .oneOf([true], "Você deve concordar com os Termos e Condições."),

  });
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const telValue = watch("tel");
  const cpfValue = watch("cpf");
  const termsValue = watch("terms");
  const { formatPhone } = usePhoneMask();
  const { formatCPF } = useCPFMask();
  const fonts = [
    { label: "Google", value: "google" },
    { label: "Instagram", value: "instagram" },
    { label: "Facebook", value: "facebook" },
    { label: "Indicação", value: "friend" },
    { label: "Outros", value: "other" },
  ];

  
  useEffect(() => {
    const storedUserPayload = localStorage.getItem('userPayload') 
    if (!storedUserPayload) return
    const userPayload =  JSON.parse(storedUserPayload);
    setValue('fname', userPayload?.profile?.name);
    setValue('tel', userPayload?.profile?.whatsapp);
    setValue('cpf', userPayload?.profile?.cpf);
    

  }, [setValue]);

  useEffect(() => {
    if (cpfValue) {
      const formatted = formatCPF(cpfValue); 
      setValue("cpf", formatted); 
    }
  }, [cpfValue, formatCPF, setValue]);
  
  useEffect(() => {
    if (telValue) {
      const masked = formatPhone(telValue);
      if (masked !== telValue) {
        setValue("tel", masked);
      }
    }
  }, [telValue, setValue, formatPhone]);

  useEffect(() => {
    if (termsValue) {
      setValue("terms", true);
    }
  }, [termsValue, setValue]);


  const onSubmit = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      profile: {
        name: data.fname,
        whatsapp: data.tel,
        cpf: data.cpf,
        how_did_you_hear_about_us: data.how_did_you_hear_about_us,
      },
    };

    try {
      await authRegister(payload);
      localStorage.setItem('userPayload', JSON.stringify(payload));
    } catch (error) {
      onAlert(true, "error", error.message || "Erro ao realizar cadastro.");
    }
  };

  

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Fazer meu cadastro
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Super rápido e sem burocracias...
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    Seu Nome<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Digite seu nome"
                    {...register("fname")}
                  />
                  {errors.fname && (
                    <p className="mt-1 text-xs text-error-500">
                      {errors.fname.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <Label>
                    WhatsApp<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="(99) 9999-9999"
                    {...register("tel")}
                  
                  />
                  {errors.tel && (
                    <p className="mt-1 text-xs text-error-500">
                      {errors.tel.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    Seu CPF<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Digite seu CPF"
                    {...register("cpf")}
                   
                  />
                  {errors.cpf && (
                    <p className="mt-1 text-xs text-error-500">
                      {errors.cpf.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <Label>Como nos conheceu:</Label>
                  <Select
                    placeholder="Selecione uma opção"
                    options={fonts}
                    {...register("email")}
                    onChange={(value) => setValue("how_did_you_hear_about_us", value)}
                  />
                  {errors.how_did_you_hear_about_us && (
                    <p className="mt-1 text-xs text-error-500">
                      {errors.how_did_you_hear_about_us.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>
                  E-mail<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-error-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Sua senha<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    {...register("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-white text-sm"
                  >
                    {showPassword ? "Esconder" : "Mostrar"}
                  </span>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-error-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={true}
                  {...register("terms")}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400 text-sm">
                  Ao criar uma conta, você concorda com os{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Termos e Condições,
                  </span>{" "}
                  e com a nossa{" "}
                  <span className="text-gray-800 dark:text-white">
                    Política de Privacidade.
                  </span>
                </p>
              </div>
              {errors.terms && (
                <p className="mt-1 text-xs text-error-500">{errors.terms.message}</p>
              )}

              <div>
              <Button
                className="w-full"
                type="submit"
                isLoading={isLoading}
              >
                Cadastrar
              </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Você já tem uma conta?
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400 ms-1"
              >
                Login
              </Link>
            </p>
          </div>
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
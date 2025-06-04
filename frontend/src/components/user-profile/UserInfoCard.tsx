"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useFormattedDate } from "@/hooks/useFormattedDate";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAlertContext } from "@/context/AlertContext";
import Alert from "../ui/alert/Alert";



export default function UserInfoCard({ user }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { onAlert, typeAlert, messageAlert, isAlert } = useAlertContext();
  const { formatDate } = useFormattedDate();
  const { putUserApi, isLoading } = useUser();


  const isValidCNPJ = (value: string | undefined): boolean => {
    if (!value) return true; 
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length !== 14) return false;

    if (/^(\d)\1{13}$/.test(cleaned)) return false;

    const t = cleaned.length - 2,
      d = cleaned.substring(t),
      d1 = parseInt(d.charAt(0)),
      d2 = parseInt(d.charAt(1)),
      calc = (x: number) => {
        let n = 0, j = 0;
        for (let i = x; i >= 1; i--) {
          n += parseInt(cleaned.charAt(j)) * i;
          j++;
          if (i === 2) i = 10;
        }
        return ((n % 11) < 2 ? 0 : 11 - (n % 11));
      };

    return calc(t) === d1 && calc(t + 1) === d2;
  };

  const validationSchema = yup.object().shape({
    name: yup.string(),
    whatsapp: yup.string(),
    zip_code: yup.string(),
    city: yup.string(),
    state: yup.string(),
    cnpj: yup
      .string()
      .test("valid-cnpj", "CNPJ inválido", (value) => isValidCNPJ(value)),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });


  const onSubmit = async (data) => {
    try {
      await putUserApi(data)
      onAlert(true, 'success', 'Dados atualizados com sucesso!');
      closeModal();
    } catch (error) {
      onAlert(true, 'error', error.message);
    } finally {

    }
  }

 
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informações pessoais
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nome
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                CPF
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.cpf}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                E-mail
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Whatsapp
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.whatsapp}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Usuário desde:
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(user?.created_at)}
              </p>
            </div>

          </div>
          <div className="mt-4">
            <Link href="/reset-password" className="text-brand-500">
              Alterar senha
            </Link>
          </div>
        </div>

        <button
          onClick={() => openModal('edit-profile')}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Editar
        </button>
      </div>

      <Modal isOpen={isOpen("edit-profile")} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edite seus dados
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Você pode editar sua informações e salvar.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      type="text"
                      defaultValue={user?.name}
                      {...register("name")}
                    />
                  </div>

                  <div>
                    <Label>Whatsapp</Label>
                    <Input
                      type="text"
                      defaultValue={user?.whatsapp}
                      {...register("whatsapp")}
                    />
                  </div>
                  <div>
                    <Label>CEP</Label>
                    <Input
                      type="text"
                      defaultValue={user?.zip_code}
                      placeholder="Digite seu CEP"
                      {...register("zip_code")}
                    />
                  </div>
                  <div>
                    <Label>Cidade</Label>
                    <Input
                      type="text"
                      defaultValue={user?.city}
                      placeholder="Digite sua cidade"
                      {...register("city")}
                    />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Input
                      type="text"
                      defaultValue={user?.state}
                      placeholder="Digite seu Estado"
                      {...register("state")}
                    />
                  </div>
                  <div>
                    <Label>CNPJ</Label>
                    <Input
                      type="text"
                      defaultValue={user?.cnpj}
                      placeholder="Digite seu CNPJ"
                      {...register("cnpj")}
                    />
                    <p className="text-xs text-error-500 mt-1">
                      {errors.cnpj?.message}
                    </p>
                  </div>


                </div>
              </div>
              {/* <div className="mt-7">
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>E-mail</Label>
                    <Input 
                    type="text" 
                    defaultValue={user?.email}
                    
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fechar
              </Button>
              <Button 
              isLoading={isLoading}
              size="sm" type='submit'>
                Salvar alterações
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      {isAlert &&
        <div className="fixed top-24 right-4 z-50">
          <Alert
            message={messageAlert}
            variant={typeAlert}
            title={typeAlert === 'success' ? 'Sucesso' : 'Erro'}
          />
        </div>

      }

    </div>
  );
}

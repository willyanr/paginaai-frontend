"use client";
import Button from '../ui/button/Button';
import ListProjects from './ListProjects';
import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';

import { useProjects } from '@/context/ProjectsContext';
import { useModalContext } from '@/context/ModalContext';
import { useAlertContext } from '@/context/AlertContext';

import iaGif from '../../../public/images/brand/ai.gif'
import Image from 'next/image';
import bannerOne from '../../../public/images/brand/b1.png'
import * as Yup from "yup";
export default function ModalEditor() {
  const { fetchProjects, createNewProject } = useProjects();
  const { isOpen, closeModal } = useModalContext();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [errorInput, setErrorInput] = useState<string | null>(null);
  const [isDisabledButton, setIsDisabledButton] = useState(false);
  const { onAlert } = useAlertContext();
  const [index, setIndex] = useState(0);



  useEffect(() => {
    fetchProjects();

  }, [fetchProjects]);
  const projectSchema = Yup.object().shape({
    name: Yup.string()
      .required("Nome obrigatório")
      .max(100, "Máximo 100 caracteres"),
    description: Yup.string()
      .required("Descrição é obrigatória.")
      .max(500, "Máximo 500 caracteres"),
  });
  const texts = [
    "Criando sua página de vendas...",
    "Gerando HTML responsivo...",
    "Adicionando seções incríveis...",
    "Mais um pouco..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [texts.length]);

const startNewProject = async () => {
  try {
    // valida os dados
    await projectSchema.validate(
      { name: projectName, description: projectDescription },
      { abortEarly: false }
    );

    setIsDisabledButton(true);

    const payload = {
      name: projectName,
      description: projectDescription,
    };

    await createNewProject(payload);

  } catch (error: unknown) {
    if (error instanceof Yup.ValidationError) {
      onAlert(true, "error", error.errors[0]);
      setErrorInput(error.errors[0]);
      return;
    }

    if (error instanceof Error) {
      // exibe diretamente a mensagem do erro (vindo da API ou outro)
      onAlert(true, "error", error.message);
      setErrorInput(error.message);
    }
  } finally {
    setIsDisabledButton(false);
  }
};

  return (
    <div>
      {isOpen("project") && (
        <div className="fixed inset-0 z-9999999 flex items-center justify-center bg-black/50 p-10">
          <Modal
            isOpen={true} onClose={closeModal}
            className="m-4 dark:text-white w-full"
          >
            {!isDisabledButton ? (
              <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl w-full max-w-5xl mx-auto overflow-auto max-h-[90vh] shadow-brand-md p-6 flex flex-col md:flex-row gap-6 ">

                {/* Form Section */}
                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Selecione seu projeto</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Bora começar seu projeto e escalar muito suas vendas!
                    </p>
                  </div>

                  {/* Inputs */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do projeto</label>
                      <input
                        type="text"
                        placeholder="Digite um nome para seu primeiro projeto"
                        onChange={(e) => setProjectName(e.target.value)}
                        className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errorInput ? 'border-red-400 ring-red-200' : 'border-gray-200'}`}
                      />
                      {errorInput && <p className="text-xs text-red-500 mt-2">{errorInput}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Descrição do projeto</label>
                      <textarea
                        placeholder="Ex.: Crie uma página de vendas para vender meu curso de morango do amor, use paletas de cores rosas e vermelho.."
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="mt-2 w-full min-h-[120px] rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                      {errorInput && <p className="text-xs text-red-500 mt-1">{errorInput}</p>}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Máximo até 500 caracteres.
                      </p>
                    </div>

                    <div className="flex w-full justify-center">
                      <Button
                        startIcon={<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 16V20M6 4V8M7 18H3M8 6H4M13 4L14.7528 8.44437C14.9407 8.92083 15.0347 9.15906 15.1786 9.35994C15.3061 9.538 15.462 9.69391 15.6401 9.82143C15.8409 9.9653 16.0792 10.0593 16.5556 10.2472L21 12L16.5556 13.7528C16.0792 13.9407 15.8409 14.0347 15.6401 14.1786C15.462 14.3061 15.3061 14.462 15.1786 14.6401C15.0347 14.8409 14.9407 15.0792 14.7528 15.5556L13 20L11.2472 15.5556C11.0593 15.0792 10.9653 14.8409 10.8214 14.6401C10.6939 14.462 10.538 14.3061 10.3599 14.1786C10.1591 14.0347 9.92083 13.9407 9.44437 13.7528L5 12L9.44437 10.2472C9.92083 10.0593 10.1591 9.9653 10.3599 9.82143C10.538 9.69391 10.6939 9.538 10.8214 9.35994C10.9653 9.15906 11.0593 8.92083 11.2472 8.44437L13 4Z" stroke="#ffffff" stroke-width="1.128" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>}
                        size='md'
                        className='w-full'
                        variant='primary'
                        onClick={startNewProject}
                        disabled={isDisabledButton}
                      >
                        Criar com um clique
                      </Button>

                    </div>
                  </div>

                  {/* Lista de projetos */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Seus projetos</h3>
                    <div className="space-y-2 overflow-auto max-h-[200px]">
                      <ListProjects closeModal={closeModal} />
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-between dark:bg-white/5 dark:border-gray-600 bg-brand-50 rounded-xl p-3 border border-brand-100">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Gere suas páginas de vendas</p>
                      <p className="text-sm font-bold text-brand-500">Páginas responsivas e rápidas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qualidade</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">HTML + Tailwind</p>
                    </div>
                  </div>

                  {/* Preview placeholder */}
                  <div className="flex-1 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="p-2 min-h-[160px] flex items-center justify-center">

                      <Image
                        src={bannerOne}
                        alt='banner-1'
                        className='rounded-xl'
                      />

                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full items-center mt-6 gap-5 py-5">
                <div className="w-1/2 bg-brand-500/20 rounded-full w-40 h-40 flex items-center justify-center">
                  <Image
                    src={iaGif}
                    width={120}
                    height={120}
                    alt="ia"
                  />
                </div>
                <div>
                  <h1 className="w-1/2 text-2xl dark:text-white font-bold w-72">
                    {texts[index]}
                  </h1>
                </div>
              </div>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
}
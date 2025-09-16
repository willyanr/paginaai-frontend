import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import ListProjects from './ListProjects';
import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';

import { useProjects } from '@/context/ProjectsContext';
import { useModalContext } from '@/context/ModalContext';
import { useAlertContext } from '@/context/AlertContext';




export default function ModalEditor() {
  const { fetchProjects, createNewProject } = useProjects();
  const { isOpen, closeModal } = useModalContext();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [errorInput, setErrorInput] = useState(false);
  const [isDisabledButton, setIsDisabledButton] = useState(false);
  const { onAlert } = useAlertContext();

  useEffect(() => {
    fetchProjects();

  }, [fetchProjects]);


  const startNewProject = async () => {
    if (!projectName) {
      setErrorInput(true);
      return;
    }
    try {
      setIsDisabledButton(true);
      const payload = {
        name: projectName,
        description: projectDescription
      }

      await createNewProject(payload);
    } catch (error: unknown) {
      let message = 'Erro ao criar projeto.';
      if (error instanceof Error) {
        message = error.message;
      }
      onAlert(true,'error', message)

    } finally {
      setIsDisabledButton(false);
    }

  };

  return (
    <div>
      <Modal isOpen={isOpen("project")} onClose={closeModal} className="max-w-[700px] m-4 dark:text-white">
        <div className="p-8">
          <h2 className="text-lg font-bold mb-4">Selecione seu projeto</h2>
          <div className=''>
            <p className="text-lg text-gray-600 mb-2 dark:text-white">Bora começar seu projeto, e escalar muito suas vendas!</p>
            <div className="flex items-center gap-4 py-3">
              <div className='w-1/2'>
                <Label className='dark:text-gray-200'>
                  Nome do projeto
                </Label>
                <Input
                  error={errorInput}
                  type='text'
                  placeholder='Digite um nome para seu primeiro projeto'
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className='w-1/2'>
                <Label className='dark:text-gray-200'>
                  Descrição do projeto
                </Label>
                <Input
                  type='text'
                  placeholder='Digite uma descrição para seu primeiro projeto'
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>

            </div>

            <ListProjects
              closeModal={closeModal}
            />

          </div>
          <div className="flex justify-end mt-4">
            <div className='space-x-5'>
              <Button
                variant="primary"
                size="sm"
                onClick={startNewProject}
                disabled={isDisabledButton}
              >
                Criar novo Projeto
              </Button>

            </div>
          </div>
        </div>
      </Modal>

      <div>

      </div>
    </div>

  );
}
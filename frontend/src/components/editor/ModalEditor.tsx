import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import ListProjects from './ListProjects';
import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';

import { useModal } from '@/hooks/useModal';
import { useProjects } from '@/context/ProjectsContext';
import { useModalContext } from '@/context/ModalContext';
import DeleteModal from '../ui/alert/DeleteModal';




export default function ModalEditor({ isListProject }) {
  const { projects, isNewProject, fetchProjects, updateProject, createNewProject } = useProjects();
  const { isOpen, closeModal, openModal } = useModalContext();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [errorInput, setErrorInput] = useState(false);
  const [setSuccessInput] = useState(false);
  const [isDisabledButton, setIsDisabledButton] = useState(false);


  useEffect(() => {
    fetchProjects();

  }, []);


  const startNewProject = async () => {
    if (!projectName) {
      setErrorInput(true);
      return;
    }
    try {
      setIsDisabledButton(true);
      const payload = new FormData();
      payload.append('name', projectName);
      payload.append('description', projectDescription);
      await createNewProject(payload);
    } catch (error) {
      return new Error('Error ao criar projeto');
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
                <Label
                  children="Nome do projeto"
                  className='dark:text-gray-200'
                />
                <Input
                  error={errorInput}
                  type='text'
                  placeholder='Digite um nome para seu primeiro projeto'
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className='w-1/2'>
                <Label
                  children="Descrição do projeto"
                  className='dark:text-gray-200'
                />
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
                children="Criar novo Projeto"
                variant="primary"
                size="sm"
                onClick={startNewProject}
                disabled={isDisabledButton}
              />

            </div>
          </div>
        </div>
      </Modal>

      <div>

      </div>
    </div>

  );
}
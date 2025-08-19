import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { useProjectsDomains } from '@/context/DomainsContext';
import { useProjects } from '@/context/ProjectsContext';
import { useModalContext } from '@/context/ModalContext';
import Button from '../ui/button/Button';
import { ModalEditDomainPropsType } from '@/interfaces/modalEdit.interface';
import { UpdateDomainPayload } from '@/interfaces/domains.interface';



const ModalEditDomain: React.FC<ModalEditDomainPropsType> = ({ domain, id_domain }) => {
    const { isOpen, closeModal } = useModalContext();
    const [selected, setSelected] = useState<{ [key: string]: string }>({});
    const { userProjects } = useProjects();
    const { isLoading } = useProjectsDomains();
    const [selectedIDProject, setSelectedIDProject] = useState<number>();
    const { updateProjectsDomains } = useProjectsDomains();

    const select = (id?: number) => {
        setSelected({ [id!]: 'border-2 border-brand-500' });
        setSelectedIDProject(id ?? undefined);
    };

    const icon = (<svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-500 dark:text-brand-400"
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>)


    const updateDomain = async () => {
        if (!selectedIDProject) return;
        try {
            const payload: UpdateDomainPayload = {
                id: id_domain,
                project: selectedIDProject
            }
            await updateProjectsDomains(payload)
            closeModal();
        } catch {
            throw new Error('Erro ao atualizar domínio');
        }
    };

    return (
        <div>
            <Modal isOpen={isOpen("2")} onClose={closeModal} 
            isFullscreen={false}
            className="">
                <div className="p-5">
                    <h2 className="text-lg font-bold mb-4 dark:text-white">
                        Vamos associar seus projetos em seus domínios
                    </h2>

                    <p className="text-sm lg:text-lg text-gray-600 mb-2 dark:text-white">
                        Bora, pra começar, selecione um projeto que deseja associar ao seu domínio.
                    </p>

                    <div className="mb-3">
                        <div className="mt-3">
                            <span className="mt-3">Selecione seu projeto:</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Domínio selecionado */}
                            <div className="py-3">
                                <span className="bg-green-50 text-green-600 dark:bg-brand-500/15 dark:text-brand-400 rounded-2xl py-2 px-4 text-sm flex items-center gap-2 border-2 border-brand-500">
                                    {domain}
                                </span>
                            </div>

                            {/* Ícone seta */}
                            <div className="flex justify-center sm:justify-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-600"
                                >
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>

                            {/* Lista de projetos */}
                            <div className="flex flex-col py-4 w-full sm:w-auto">
                                <ul className="space-y-3">
                                    {userProjects?.map((project) => {
                                        if (project.domain) return null;
                                        return (
                                            <li
                                                key={project.id}
                                                onClick={() => select(project.id)}
                                                className={`bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 cursor-pointer rounded-2xl py-2 px-4 text-sm flex items-center gap-2 truncate w-full sm:w-72 ${selected[project.id]}`}
                                            >
                                                {icon}
                                                {project.name}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        {/* Confirmação */}
                        {Object.keys(selected).length >= 1 && (
                            <div>
                                <div className="bg-gray-100 border text-gray-600 dark:bg-gray-800 dark:text-gray-200 mt-2 p-5 rounded-xl dark:border-gray-700">
                                    <p className="text-center mt-3 text-xs lg:text-sm dark:text-gray-200">
                                        Você está associando o seguinte domínio, deseja confirmar?
                                    </p>
                                </div>

                                <div className="flex justify-center py-1 mt-5">
                                    <Button
                                        isLoading={isLoading}
                                        variant="primary"
                                        onClick={() => updateDomain()}
                                    >
                                        Confirmar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </Modal>
        </div>
    );
};

export default ModalEditDomain;
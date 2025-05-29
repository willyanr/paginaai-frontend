import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import Badge from '../ui/badge/Badge';
import { useProjectsDomains } from '@/context/DomainsContext';
import { useProjects } from '@/context/ProjectsContext';
import { useModalContext } from '@/context/ModalContext';
import Button from '../ui/button/Button';

interface ModalEditDomainProps {
    domain: string;
    id_domain: string;
}

const ModalEditDomain: React.FC<ModalEditDomainProps> = ({ domain, id_domain }) => {
    const { isOpen, closeModal } = useModalContext();
    const [selected, setSelected] = useState<{ [key: string]: string }>({});
    const { userProjects } = useProjects();
    const { isLoading } = useProjectsDomains();
    const [selectedIDProject, setSelectedIDProject] = useState<string>('');
    const { updateProjectsDomains } = useProjectsDomains();

    const select = (id?: string) => {
        setSelected({ [id!]: 'border-2 border-brand-500' });
        setSelectedIDProject(id)
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
       if (!selectedIDProject ) return;
       try{
            const payload = {
                id: id_domain,
                project: selectedIDProject
            }
            await updateProjectsDomains(payload)
            closeModal();
       } catch(error){

       }
    };


    return (
        <div>
            <Modal isOpen={isOpen("2")} onClose={closeModal} className="max-w-[700px] m-4 dark:text-white">
                <div className="p-8">
                    <h2 className="text-lg font-bold mb-4">Vamos associar seus projetos em seus domínios</h2>
                    <div className=''>
                        <p className="text-lg text-gray-600 mb-2 dark:text-white">Bora, pra começar, selecione um projeto que deseja associar ao seu domínio.</p>
                        <div className="mb-3 py-2">
                            <div>
                                <div className='mt-3 mb-4'>
                                    <span className='mt-3'>Selecione seu projeto:</span>
                                </div>
                                  <div className="flex items-center justify-between">
                                    <div className='py-3'>
                                            <span className='bg-green-50 text-green-600 dark:bg-brand-500/15 dark:text-brand-400 rounded-2xl py-2 px-4 text-sm flex items-center gap-2 border-2 border-brand-500'>
                                                {domain}
                                            </span>
                                        </div>
                                        <div>
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
                                        <div className="flex flex-col py-4">
                                            <ul className="space-y-3">
                                                {userProjects?.map((project) => {
                                                    if (project.domain) return null; 
                                                    return (
                                                        <li
                                                            key={project.id} // Melhor usar ID do que index
                                                            onClick={() => select(project.id)}
                                                            className={`bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 cursor-pointer rounded-2xl py-2 px-4 text-sm flex items-center gap-2 ${selected[project.id]}
                                                            w-72 truncate
                                                            `}
                                                        >
                                                            {icon}
                                                            {project.name}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>

                                  </div>
                                {Object.keys(selected).length >= 1 &&
                                    <div>

                                        <div className="bg-gray-100 border text-gray-600 dark:bg-gray-800 dark:text-gray-200 mt-2 p-5 rounded-xl dark:border-gray-700">

                                            <p className='text-center mt-3 text-sm dark:text-gray-200'>Você está associando o seguinte domínio, deseja confirmar?</p>
                                        </div>
                                        <div className="flex justify-center py-1 mt-5">
                                            <Button
                                                isLoading={isLoading}
                                                children="Confirmar"
                                                variant='primary'
                                                onClick={() => updateDomain()}



                                            />
                                        </div>
                                    </div>
                                }
                            </div>

                        </div>

                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default ModalEditDomain;
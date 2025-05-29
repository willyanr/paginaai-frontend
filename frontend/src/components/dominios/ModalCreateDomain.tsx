import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { useModalContext } from '@/context/ModalContext';
import Button from '../ui/button/Button';
import Badge from '../ui/badge/Badge';
import { useProjectsDomains } from '@/context/DomainsContext';
import ListProjects from '../editor/ListProjects';
import { useProjects } from "../../context/ProjectsContext";
import Alert from '../ui/alert/Alert';
import { useAlertContext } from '@/context/AlertContext';


const ModalCreateDomain: React.FC = () => {
    const { isOpen, closeModal, openModal } = useModalContext();
    const { isLoading, createProjectsDomains, fetchProjectsDomains } = useProjectsDomains();
    const [domainName, setDomainName] = useState<string | undefined>();
    const [isDomain, setIsDomain] = useState<boolean | undefined>();
    const { userProjects, fetchProjects } = useProjects();
    const [selectedProject, setSelectedProject] = useState<string>('');
    const { onAlert, isAlert, typeAlert, messageAlert } = useAlertContext();


    useEffect(() => {
        fetchProjects();
    }, []);


    useEffect(() => {
        if (domainName) {
            setIsDomain(true);
        } else {
            setDomainName('')
            setIsDomain(false);
        }
    }, [domainName]);

    const createNewDomain = async () => {
        const payload = {
            domain: domainName || '',
            project: selectedProject || '',
        };
        try {
            const response = await createProjectsDomains(payload);
            fetchProjectsDomains();
            closeModal();
        } catch (erro) {
            throw new Error('Erro ao criar domínio');
        } finally {
            setSelectedProject('');
            setDomainName('');
        }
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


    return (
        <div>

            <Modal isOpen={isOpen("1")}  onClose={() => {
                closeModal();
                setDomainName('')
            }} className="max-w-[700px] m-4 dark:text-white">
                <div className="p-8">
                    <h2 className="text-lg font-bold mb-4">Vamos cadastrar seus domínios</h2>
                    <div className=''>
                        <p className="text-lg text-gray-600 mb-2 dark:text-white">Bora começar seu projeto, e escalar muito suas vendas!</p>
                        <div className="mb-3 py-2">
                            <div className=''>
                                <Label
                                    children="Cole seu domínio"
                                />
                                <Input
                                    type='text'
                                    placeholder='Digite um nome para seu primeiro projeto'
                                    onChange={(e) => setDomainName(e.target.value)}
                                />

                            </div>

                            {isDomain &&
                                <div>
                                    <div className='mt-3'>
                                        <span className='mt-3'>Quer associar um projeto?</span>
                                    </div>
                                    
                                    <div className="bg-gray-100 border text-gray-600 dark:bg-gray-800 dark:text-gray-200 mt-2 p-5 rounded-xl dark:border-gray-600">
                                        <div className="flex justify-between">
                                            <span className='font-semibold'>Domínio:</span>
                                            <h2 className='font-bold truncate px-3 w-2/3 justify-center flex'>
                                                {domainName}
                                            </h2>
                                            <Badge
                                                children='Não verificado'
                                                color='error'
                                                size='sm'
                                            />
                                        </div>
                                        <p className='text-center mt-3 text-sm dark:text-gray-200'>Você está cadastrando o seguinte domínio, deseja confirmar?</p>
                                    </div>
                                    <div className="flex justify-center py-1 mt-5">
                                        <Button
                                            isLoading={isLoading}
                                            children="Cadastrar novo domínio"
                                            variant='primary'
                                            onClick={createNewDomain}

                                        />
                                    </div>
                                </div>
                            }
                        </div>

                    </div>

                </div>
                {isAlert &&
                    <div className="fixed top-24 right-4 z-50">
                        <Alert
                            message={messageAlert}
                            variant={typeAlert}
                            title={typeAlert === 'success' ? 'Sucesso' : 'Erro'}

                        />
                    </div>

                }

            </Modal>

        </div>
    );
};

export default ModalCreateDomain;
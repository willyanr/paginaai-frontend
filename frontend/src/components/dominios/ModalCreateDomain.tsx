import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { useModalContext } from '@/context/ModalContext';
import Button from '../ui/button/Button';
import Badge from '../ui/badge/Badge';
import { useProjectsDomains } from '@/context/DomainsContext';
import { useProjects } from "../../context/ProjectsContext";
import Alert from '../ui/alert/Alert';
import { useAlertContext } from '@/context/AlertContext';


const ModalCreateDomain: React.FC = () => {
    const { isOpen, closeModal } = useModalContext();
    const { isLoading, createProjectsDomains, fetchProjectsDomains } = useProjectsDomains();
    const [domainName, setDomainName] = useState<string | undefined>();
    const [isDomain, setIsDomain] = useState<boolean | undefined>();
    const { fetchProjects } = useProjects();
    const [selectedProject, setSelectedProject] = useState<string>('');
    const { isAlert, typeAlert, messageAlert } = useAlertContext();


    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);


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
            await createProjectsDomains(payload);
            fetchProjectsDomains();
            closeModal();
        } catch {
            throw new Error('Erro ao criar domínio');
        } finally {
            setSelectedProject('');
            setDomainName('');
        }
    };
  


    return (
        <div>

            <Modal isOpen={isOpen("1")}  onClose={() => {
                closeModal();
                setDomainName('')
            }} className="max-w-[700px] m-4 dark:text-white">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Vamos cadastrar seus domínios</h2>
                    <div className=''>
                        <p className="text-sm lg:text-lg text-gray-600 mb-2 dark:text-white">Bora começar seu projeto, e escalar muito suas vendas!</p>
                        <div className="mb-3 py-2">
                            <div className=''>
                                <Label className='text-xs lg:text-sm'>
                                    Cole seu domínio
                                </Label>
                                <Input
                                    type='text'
                                    placeholder='Digite um nome para seu primeiro projeto'
                                    onChange={(e) => setDomainName(e.target.value)}
                                />

                            </div>

                            {isDomain &&
                                <div className=''>
                                    <div className='mt-3'>
                                        <span className='mt-3 text-sm  lg:text-base'>Quer associar um projeto?</span>
                                    </div>
                                    
                                    <div className="bg-gray-100 border text-gray-600 dark:bg-gray-800 dark:text-gray-200 mt-2 p-5 rounded-xl dark:border-gray-600">
                                        <div className="lg:flex lg:justify-between">
                                            <span className='font-semibold text-sm lg:text-base'>Domínio:</span>
                                            <h2 className='font-bold truncate lg:px-3 lg:w-2/3 justify-center flex'>
                                                {domainName}
                                            </h2>
                                            <Badge
                                                color='error'
                                                size='sm'
                                            >
                                                Não verificado
                                            </Badge>
                                        </div>
                                        <p className='lg:text-center mt-3 text-sm dark:text-gray-200'>Você está cadastrando o seguinte domínio, deseja confirmar?</p>
                                    </div>
                                    <div className="flex justify-center py-1 mt-5">
                                        <Button
                                            size='sm'
                                            isLoading={isLoading}
                                            variant='primary'
                                            onClick={createNewDomain}
                                        >
                                            Cadastrar novo domínio
                                        </Button>
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
                            variant={typeAlert as 'success' | 'error'}
                            title={typeAlert === 'success' ? 'Sucesso' : 'Erro'}

                        />
                    </div>

                }

            </Modal>

        </div>
    );
};

export default ModalCreateDomain;
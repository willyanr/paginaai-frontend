import React, { useState, useEffect } from 'react';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import { useProjectsDomains } from '@/context/DomainsContext';
import { useModalContext } from '@/context/ModalContext';
import { useProjects } from '@/context/ProjectsContext';
import ModalEditDomain from './ModalEditDomain';
import DeleteModal from '../ui/alert/DeleteModal';
import { useAlertContext } from '@/context/AlertContext';
import Alert from '../ui/alert/Alert';
import { Card } from '../ui/card/Card';

const ListDomains: React.FC = () => {
    const { domainsData, fetchProjectsDomains, deleteProjectsDomains, verifyProjectsDomains } = useProjectsDomains();
    const [isLoadingButton, setIsLoadingButton] = useState<{ [key: string]: boolean }>({});
    const { openModal, closeModal } = useModalContext();
    const { fetchProjects } = useProjects();
    const [domainSelectedEdit, setDomainSelectedEdit] = useState<string>('');
    const [domainSelectedEditID, setDomainSelectedEditID] = useState<number>();
    const [deleteDomainID, setDomainDelete] = useState<number>();
    const { isAlert, messageAlert, typeAlert, onAlert } = useAlertContext();



    useEffect(() => {
        fetchProjects();

    }, [fetchProjects]);



    const deleteDomain = async () => {
        if (!deleteDomainID) return;
        setIsLoadingButton(isLoadingButton => ({ ...isLoadingButton, [deleteDomainID]: true }));
        try {
            await deleteProjectsDomains(deleteDomainID);
            fetchProjectsDomains();
            closeModal();
        } catch (erro) {
            console.error(erro);
            throw new Error('Erro ao criar domínio');
        } finally {
            setIsLoadingButton(isLoadingButton => ({ ...isLoadingButton, [deleteDomainID]: false }));
        }
    };

    const verifyDomain = async (domain: string) => {
        if (!domain) return;
        setIsLoadingButton(isLoadingButton => ({ ...isLoadingButton, [domain]: true }));
        try {
            await verifyProjectsDomains(domain)
        } catch (error: unknown) {
            const errorMessage = typeof error === 'object' && error !== null && 'message' in error
                ? (error as { message: string }).message
                : 'Erro ao verificar domínio';
            onAlert(true, 'error', errorMessage)
        } finally {
            setIsLoadingButton(isLoadingButton => ({ ...isLoadingButton, [domain]: false }));
        }
    };

    const editDomain = async (domain: string, id: number) => {
        if (!domain) return;
        setDomainSelectedEdit(domain);
        setDomainSelectedEditID(id);
        openModal("2");
    };







    return (
        <div>
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-6 dark:text-white">
                {domainsData?.map((item, index) => (
                   <Card
                   key={index}
                   >
                     <li
                        
                        className=""
                    >
                        <div className="lg:flex justify-between items-center mb-2">
                            <div className="lg:flex flex-col">
                                <h2 className="text-xl font-medium mb-2 text-gray-600 dark:text-gray-100">
                                    {item?.domain}
                                </h2>
                                <span className="text-xs font-normal text-gray-600 dark:text-gray-300">
                                    {item?.created_at && new Date(item.created_at).toLocaleDateString('pt-BR')}
                                </span>

                            </div>
                            <div className="lg:flex gap-2 items-center">
                                <Badge
                                    variant="light"
                                    color={item?.verified ? 'success' : 'error'}
                                >
                                    {item?.verified ? 'Verificado' : 'Não verificado'}
                                </Badge>
                                <Badge
                                    color={item?.ssl_enabled ? 'success' : 'error'}
                                    variant="light"
                                >
                                    SSL
                                </Badge>
                            </div>
                            <div onClick={() => editDomain(item.domain, item.id)}
                                className="mt-4 lg:mt-0 justify-end flex cursor-pointer">
                                <Badge color="dark">
                                    Editar
                                </Badge>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <Badge>
                                {item?.project_name}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-5 justify-between">
                            <div>
                                {!item.verified ? (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => verifyDomain(item?.domain)}
                                        isLoading={isLoadingButton[item.domain] || false}
                                    >
                                        Verificar Domínio
                                    </Button>
                                ) : (
                                    <div className="w-[140px] h-[32px]" />
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setDomainDelete(item.id)
                                    openModal('delete-domain')
                                }}
                                isLoading={isLoadingButton[item.id] || false}
                            >
                                Remover
                            </Button>
                        </div>
                    </li>
                   </Card>
                ))}
            </ul>
            <ModalEditDomain
                domain={domainSelectedEdit}
                id_domain={domainSelectedEditID}
            />
            <DeleteModal onDelete={deleteDomain} />
            {isAlert &&
                <div className="fixed top-24 right-4 z-50">
                    <Alert
                        message={messageAlert}
                        variant={typeAlert as 'success' | 'error'}
                        title={typeAlert === 'success' ? 'Sucesso' : 'Erro'}

                    />
                </div>

            }

        </div>
    );
};

export default ListDomains;


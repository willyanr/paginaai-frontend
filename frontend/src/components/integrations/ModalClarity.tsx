"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import logoClarity from '../../../public/images/logo/clarity-logo.png';
import { Modal } from '../ui/modal';
import { useModalContext } from '@/context/ModalContext';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Select from '../form/Select';
import Input from '../form/input/InputField';
import { useProjects } from '@/context/ProjectsContext';
import { useMonitoring } from '@/context/MonitoringContext';
import Alert from '../ui/alert/Alert';
import { useAlertContext } from '@/context/AlertContext';

// const plataforms = [
//     {
//         id: 1,
//         name: "Microsoft Clarity",
//         logoWhite: logoClarity,
//         logoDark: logoClarity,
//         description: "Permite medir a eficácia dos anúncios do Facebook, ajudando a entender o comportamento dos usuários no site após interagirem com os anúncios.",
//     },

// ];




export const ModalClarity = ({ }) => {
    const { userProjects, fetchProjects } = useProjects();
    const [selectUseProject, setSelectUseProject] = useState<string>();
    const { createNewIntegrationClarity } = useMonitoring();

    const [codeClarity, setCodeClarity] = useState<string>();
    const { isAlert, typeAlert, messageAlert, onAlert } = useAlertContext();


    useEffect(() => {
        fetchProjects();

    }, [fetchProjects]);

    const selectOptions = userProjects ? userProjects.map(project => ({
        value: project.id.toString(),
        label: project.name,
    })) : [];

    const handleSelectChange = (value: string) => {
        setSelectUseProject(value)
    };

    const teste = async () => {
        try {
            if (codeClarity && selectUseProject) {
                await createNewIntegrationClarity({
                    code_clarity: codeClarity,
                    project: Number(selectUseProject)
                });
                closeModal();
                onAlert(true, 'success',  'Integração salva com sucesso!')
            } else {
                alert('Preencha todos os campos obrigatórios!');
            }

        } catch {
            alert('erro')
        }


    }

    const { isOpen, closeModal } = useModalContext();
    return (
        <div>
            <Modal
                isOpen={isOpen("clarity")}
                onClose={closeModal}
                className="max-w-[700px] m-4 dark:text-white"
            >
                <div className='p-8'>
                    <h1>
                        Criar integração com Microsoft Clarity.
                    </h1>
                    <div className='py-4'>
                        <p className='text-gray-600 dark:text-gray-400 text-sm'>
                            Para integrar o Microsoft Clarity, você precisa criar uma conta no site oficial e obter o código de rastreamento. Após isso, adicione o código ao seu site para começar a coletar dados de interação dos usuários.
                        </p>
                    </div>

                    <div className="flex justify-left items-center gap-4">
                        <div>
                            <Image
                                src={logoClarity}
                                alt="Logo do Microsoft Clarity"
                                className="object-cover"
                                width={40}
                                height={40}
                            />
                        </div>
                        <div>
                            <Label
                                className=''
                            >
                                Selecione o projeto para integrar:
                            </Label>

                            <Select
                                options={selectOptions}
                                onChange={handleSelectChange}
                                className="cursor-pointer"
                            />
                        </div>
                        <div>
                            <Label>
                                Cole seu código do Microsoft Clarity
                            </Label>
                            <Input
                                defaultValue={codeClarity}
                                onChange={(e) => {
                                    setCodeClarity(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end mt-10'>
                        <Button
                            onClick={teste}
                        >
                            Criar integração
                        </Button>
                    </div>
                </div>
                

            </Modal>
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












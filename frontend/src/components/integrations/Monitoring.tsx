"use client";
import Image from 'next/image';
import React, { useEffect } from 'react';
import logoClarity from '../../../public/images/logo/clarity-logo.png';


import { useTheme } from "@/context/ThemeContext";
import { ModalClarity } from './ModalClarity';
import { useModalContext } from '@/context/ModalContext';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import { useMonitoring } from '@/context/MonitoringContext';








const plataforms = [
    {
        id: 1,
        name: "Microsoft Clarity",
        logoWhite: logoClarity,
        logoDark: logoClarity,
        description: "Permite medir a eficácia dos anúncios do Facebook, ajudando a entender o comportamento dos usuários no site após interagirem com os anúncios.",
    },

];


export const Monitoring = ({ }) => {
    const { theme } = useTheme();
    const { openModal } = useModalContext();
    const { monitoringData, fetchMonitoring, removeIntegrationClarity } = useMonitoring();


    useEffect(() => {
        fetchMonitoring();
    }, [fetchMonitoring]);

    if (monitoringData) {
    }

    return (
        <div>
            <div className="w-full flex">
                {plataforms.map((platform) => (
                    <div className="max-w-xl" key={platform.id}>
                        <div
                            className="flex gap-3 bg-white border-2 border-gray-300 rounded-xl overflow-hidden items-center justify-start dark:bg-gray-800 hover:border-b-8 hover:border-brand-500 cursor-pointer transition-all duration-300 dark:border-gray-600 hover:dark:border-brand-500 p-2">
                            <div className="h-20 p-2">
                                <Image
                                    src={
                                        theme === 'light'
                                            ? platform.logoWhite
                                            : platform.logoDark || platform.logoWhite
                                    }
                                    alt={`Logo da plataforma ${platform.name}`}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col gap-2 py-2 p-3  transition-all duration-300">
                                <p className="text-xl font-bold dark:text-white">
                                    {platform.name}
                                </p>

                                <p className="text-gray-600 dark:text-gray-400 text-sm">

                                    {platform.description}
                                </p>
                                <div>
                                    <p className='font-semibold text-sm dark:text-white'>Projetos Ativos:</p>

                                    {!monitoringData ? (
                                        <div className='py-4'>
                                            <div className='flex justify-between items-center'>
                                                <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-28 mb-4 animate-pulse"></div>
                                                <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-28 mb-4 animate-pulse"></div>
                                                <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-28 mb-4 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ) : Array.isArray(monitoringData) && monitoringData.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-white mt-3">Nenhum projeto associado.</p>
                                    ) : (
                                        <div className='flex py-3 gap-4 flex-col'>
                                            {Array.isArray(monitoringData) && monitoringData.map((item) => (
                                                <div
                                                    className='flex gap-2 justify-between items-center'
                                                    key={item.id}
                                                >
                                                    <Badge>{item.project_name}</Badge>

                                                    <div className='text-xs'>
                                                        <p className='dark:text-white'>{item.code_clarity}</p>
                                                    </div>

                                                    <div onClick={() => {
                                                        removeIntegrationClarity(item.id)
                                                    }
                                                    }>
                                                        <Badge color='dark' size='md'>Remover</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>


                                <div className='flex justify-end mt-6'>
                                    <Button
                                        onClick={() => {
                                            openModal("clarity")
                                        }}
                                    >
                                        Cadastrar +
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}

            </div>
            <div>
                <ModalClarity />
            </div>
        </div>
    );
};












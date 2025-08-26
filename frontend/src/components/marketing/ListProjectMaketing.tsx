import { useProjects } from '@/context/ProjectsContext';
import React, { useEffect } from 'react';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import logoMeta from '../../../public/images/pixel/meta.png';
import logoDarkUtmify from '../../../public/images/pixel/logo-dark-utmify.png';
import logoWhiteUtmify from '../../../public/images/pixel/logo-white-utmify.png';
import logoGoogleAds from '../../../public/images/pixel/google-adwords-logo.png';
import logoDarkMeta from '../../../public/images/pixel/meta-dark.png';
import logoGoogleAdsDark from '../../../public/images/pixel/google-adwords-logo-dark.png';


import { useProjectsMarketing } from "@/context/MarketingContext";
import { useTheme } from '@/context/ThemeContext';
import { useAlertContext } from '@/context/AlertContext';
import { Card } from '../ui/card/Card';


const ListProjectMarketing: React.FC = () => {
    const { userProjects, fetchProjects } = useProjects();
    const { deleteProjectsMarketing } = useProjectsMarketing();
    const { theme } = useTheme();
    const { onAlert } = useAlertContext();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);


    const removePixel = async (pixel: number) => {
        try {
            await deleteProjectsMarketing(pixel)
        } catch {
            onAlert(true, "error", "Erro ao remover o pixel do projeto.");
        }

    };

    if (userProjects) {
        return (
            <div>
                <ul>
                    {userProjects.map((item) => (
                       <Card>
                         <li
                            key={item.id}
                        >
                            <div>

                            </div>
                            <div className="flex flex-col items-left gap-4 py-3 justify-between">
                                <div className='flex flex-col'>
                                    <span className='font-medium text-sm px-2 dark:text-gray-300 text-gray-700'>Seu Projeto:</span>
                                    <div className='flex justify-between'>
                                        <span className='font-bold px-2 dark:text-white text-xl'>{item.name}</span>
                                        <Badge color='success'>
                                            Ativo
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {item?.pixels.map(
                                        (
                                            pixel: { id: number, pixel_type: string; pixel_value: string },
                                            index: number
                                        ) => (
                                            <div
                                                key={index}
                                                className="lg:flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl"
                                            >
                                                {/* Esquerda: Imagem + Valor */}
                                                <div className="lg:flex items-center gap-3 py-3 lg:py-0">
                                                    <Image
                                                        src={
                                                            pixel.pixel_type === "meta"
                                                                ? theme === 'dark'
                                                                    ? logoDarkMeta
                                                                    : logoMeta
                                                                : pixel.pixel_type === "google_ads"
                                                                    ? theme === 'dark'
                                                                        ? logoGoogleAdsDark
                                                                        : logoGoogleAds
                                                                    : pixel.pixel_type === "utmify"
                                                                        ? theme === 'dark'
                                                                            ? logoDarkUtmify
                                                                            : logoWhiteUtmify
                                                                        : logoMeta // fallback image
                                                        }

                                                        alt={pixel.pixel_type || "Project image"}
                                                        width={70}
                                                        height={40}
                                                        className="rounded"
                                                    />
                                                    <div className="py-5 truncate rounded-xl">
                                                        <span className="bg-yellow-500/20 !text-yellow-500 px-3 rounded-xl">{pixel.pixel_value}</span>

                                                    </div>
                                                </div>

                                                <div
                                                    onClick={() => removePixel(pixel.id)}
                                                    className='cursor-pointer'>

                                                    <Badge
                                                        color="dark"
                                                        size="sm"
                                                    >
                                                        Remover
                                                    </Badge>
                                                </div>

                                            </div>
                                        )
                                    )}
                                </div>

                            </div>
                        </li>
                       </Card>
                    ))}
                </ul>
               
            </div>

        );
    }
};

export default ListProjectMarketing;
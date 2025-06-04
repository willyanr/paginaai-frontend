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


const ListProjectMarketing: React.FC = () => {
    const { userProjects, fetchProjects } = useProjects();
    const { deleteProjectsMarketing } = useProjectsMarketing();
    const { theme } = useTheme();


    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);


    const removePixel = async (pixel: number) => {

        try {
            await deleteProjectsMarketing(pixel)
        } catch  {
            alert('erro')
        }

    };

    return (
        <ul>
            {userProjects.map((item) => (
                <li
                    key={item.id}
                    className="py-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-10"
                >
                    <div>

                    </div>
                    <div className="flex flex-col items-left gap-4 py-3 justify-between">
                        <div className='flex flex-col'>
                            <span className='font-semibold px-2 dark:text-white text-gray-700'>Projeto:</span>
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
                                    pixel: { pixel_type: string; pixel_value: string },
                                    index: number
                                ) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl"
                                    >
                                        {/* Esquerda: Imagem + Valor */}
                                        <div className="flex items-center gap-3">
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
                                                                : null
                                                }

                                                alt={pixel.pixel_type || "Project image"}
                                                width={70}
                                                height={40}
                                                className="rounded"
                                            />
                                            <Badge>{pixel.pixel_value}</Badge>
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
            ))}
        </ul>

    );
};

export default ListProjectMarketing;
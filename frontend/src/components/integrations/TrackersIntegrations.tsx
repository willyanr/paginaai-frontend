"use client";
import Image from 'next/image';
import React from 'react';
import logoMeta from '../../../public/images/pixel/meta.png';
import logoDarkMeta from '../../../public/images/pixel/meta-dark.png';

import logoDarkUtmify from '../../../public/images/pixel/logo-dark-utmify.png';
import logoWhiteUtmify from '../../../public/images/pixel/logo-white-utmify.png';
import logoGoogleAds from '../../../public/images/pixel/google-adwords-logo.png';
import logoGoogleAdsDark from '../../../public/images/pixel/google-adwords-logo-dark.png';


import { useTheme } from "@/context/ThemeContext";
import Link from 'next/link';

const plataforms = [
    {
        id: 1,
        name: "Meta",
        logoWhite: logoMeta,
        logoDark: logoDarkMeta,
        description: "Permite medir a eficácia dos anúncios do Facebook, ajudando a entender o comportamento dos usuários no site após interagirem com os anúncios.",
    },
    {
        id: 2,
        name: "Utmify",
        logoDark: logoDarkUtmify,
        logoWhite: logoWhiteUtmify,
        description: "Facilite o gerenciamento e trackeamento de suas campanhas de forma mais robusta, permitindo rastrear o desempenho de campanhas de marketing digital de forma mais eficiente.",
    },
    {
        id: 3,
        name: "Google Ads",
        logoWhite: logoGoogleAds,
        logoDark: logoGoogleAdsDark,
        description: "Gerencie anúncios para serem exibidos nos resultados de pesquisa do Google e em outros sites parceiros, ajudando a alcançar um público amplo e direcionado.",
    },

];


export const TrackersIntegrations = ({ }) => {
    const { theme } = useTheme();

    return (
        <div className="w-full flex gap-5">
            {plataforms.map((platform) => (
                <div className="max-w-2xl mx-auto p-2" key={platform.id}>
                    <Link href={`/marketing`} 
                    className="flex gap-3 bg-white border border-gray-300 rounded-xl overflow-hidden items-center justify-start dark:bg-gray-800 hover:border-b-8 hover:border-brand-500 cursor-pointer transition-all duration-300 dark:hover:text-white dark:border-gray-600 hover:dark:border-brand-500 p-2">
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
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};












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
import { CreativeCommons, Package, Plus, Projector } from 'lucide-react';
import Button from '../ui/button/Button';
import Link from 'next/link';


const ListProjectMarketing: React.FC = () => {
    const { userProjects, fetchProjects } = useProjects();
    const { deleteProjectsMarketing } = useProjectsMarketing();
    const { theme } = useTheme();
    const { onAlert } = useAlertContext();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const removePixel = async (pixelId: number) => {
        try {
            await deleteProjectsMarketing(pixelId);
        } catch {
            onAlert(true, "error", "Erro ao remover o pixel do projeto.");
        }
    };

    if (!userProjects || userProjects.length === 0) {
        return (
            <Card>
                <div className="flex items-center justify-center min-h-[60vh] w-full h-screen">
                    <div className="text-center py-12">
                        <Projector className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                            Nenhum projeto encontrado
                        </p>
                        <p className="text-gray-500 dark:text-gray-500">
                            Adicione um projeto para começar a adicionar seus rastrementos.
                        </p>
                        <Link href="/editor" passHref >
                            <Button className="mt-4 flex items-center" startIcon={<Plus />}>
                                Criar Projeto
                            </Button>
                        </Link>

                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {userProjects.map((item) => (
                <Card key={item.id} className="p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-start">
                            <span className="font-medium text-sm px-2 dark:text-gray-300 text-gray-700">
                                Seu Projeto:
                            </span>
                            <div className="flex justify-between items-center">
                                <span className="font-bold px-2 dark:text-white text-xl">{item.name}</span>
                                <Badge color="success">Ativo</Badge>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {item?.pixels?.map(
                                (
                                    pixel: { id: number; pixel_type: string; pixel_value: string },
                                    index: number
                                ) => (
                                    <div
                                        key={pixel.id}
                                        className="lg:flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl"
                                    >
                                        {/* Esquerda: Imagem + Valor */}
                                        <div className="lg:flex items-center gap-3">
                                            <Image
                                                src={
                                                    pixel.pixel_type === "meta"
                                                        ? theme === "dark"
                                                            ? logoDarkMeta
                                                            : logoMeta
                                                        : pixel.pixel_type === "google_ads"
                                                            ? theme === "dark"
                                                                ? logoGoogleAdsDark
                                                                : logoGoogleAds
                                                            : pixel.pixel_type === "utmify"
                                                                ? theme === "dark"
                                                                    ? logoDarkUtmify
                                                                    : logoWhiteUtmify
                                                                : logoMeta
                                                }
                                                alt={pixel.pixel_type || "Project image"}
                                                width={70}
                                                height={40}
                                                className="rounded"
                                            />
                                            <div className="py-2 truncate">
                                                <span className="bg-yellow-500/20 !text-yellow-500 px-3 rounded-xl">
                                                    {pixel.pixel_value}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => removePixel(pixel.id)}
                                            className="cursor-pointer mt-2 lg:mt-0"
                                        >
                                            <Badge color="dark" size="sm">
                                                Remover
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ListProjectMarketing;

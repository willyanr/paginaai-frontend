"use client";
import React, { useState } from "react";
import Image from "next/image";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useMemo } from "react";

import logoMeta from '../../../public/images/pixel/meta.png';
import logoDarkMeta from '../../../public/images/pixel/meta-dark.png';

import logoDarkUtmify from '../../../public/images/pixel/logo-dark-utmify.png';
import logoWhiteUtmify from '../../../public/images/pixel/logo-white-utmify.png';
import logoGoogleAds from '../../../public/images/pixel/google-adwords-logo.png';
import logoGoogleAdsDark from '../../../public/images/pixel/google-adwords-logo-dark.png';


import { useProjectsMarketing } from "@/context/MarketingContext";
import Button from "../ui/button/Button";
import { useProjects } from "@/context/ProjectsContext";
import Select from "../form/Select";
import ListProjectMarketing from "./ListProjectMaketing";
import { useTheme } from "@/context/ThemeContext";
import { MarketingData } from "@/interfaces/marketing.interface";
import { useAlertContext } from "@/context/AlertContext";
import { Card } from "../ui/card/Card";



export default function CardPixel() {
  const { marketingData, fetchProjectsMarketing, updateProjectMarketing } = useProjectsMarketing();
  const { userProjects, fetchProjects } = useProjects();
  const [userProjectSelectedID, setUserProjectSelectedID] = useState<string>();
  const { onAlert } = useAlertContext();

  const [isLoadingButton, setIsLoadingButton] = useState<Record<string, boolean>>({});

  const [inputPixel, setInputPixel] = useState<{ [key: string]: string }>({});
  const { theme } = useTheme();


  useEffect(() => {
    fetchProjectsMarketing();
    fetchProjects();

  }, [fetchProjectsMarketing, fetchProjects]);

  const safeMarketingData: MarketingData = useMemo(() => {
    return marketingData || {};
  }, [marketingData]);


  const plataforms = [
    {
      id: 1,
      name: "Meta",
      logoWhite: logoMeta,
      logoDark: logoDarkMeta,
      information: "Adicione o pixel de rastreamento do Facebook para acompanhar as conversões e otimizar suas campanhas.",
      pixel: safeMarketingData?.pixel_meta,
      key: "pixel_meta",
      type: "meta",


    },
    {
      id: 2,
      name: "Utmify",
      logoDark: logoDarkUtmify,
      logoWhite: logoWhiteUtmify,
      information: "Adicione o pixel de rastreamento do Facebook para acompanhar as conversões e otimizar suas campanhas.",
      pixel: safeMarketingData?.pixel_utmify,
      key: "pixel_utmify",
      type: "utmify",
      info: `Cole apenas o ID do seu Pixel Utmify ex.: "67b685db1dbb22525effef90". o código logo após window.pixelId = "67b685db1dbb22525effef90`
    },
    {
      id: 3,
      name: "Goole Ads",
      logoWhite: logoGoogleAds,
      logoDark: logoGoogleAdsDark,
      information: "Adicione o pixel de rastreamento do Facebook para acompanhar as conversões e otimizar suas campanhas.",
      pixel: safeMarketingData?.pixel_google_ads,
      key: "pixel_google_ads",
      type: "google_ads",
      info: `Substitua AW-XXXXXXXXXX pelo ID do seu pixel do Google Ads (também chamado de ID de conversão).`
    },

  ];



  const selectOptions = userProjects ? userProjects.map(project => ({
    value: project.id.toString(),
    label: project.name,
  })) : [];


  const handleSelectChange = (value: string) => {
    console.log("Projeto selecionado:", value);
    setUserProjectSelectedID(value)
  };

  const createPixelProject = async (type: string) => {
    try {
      const payload = {
        project: Number(userProjectSelectedID),
        pixel_type: type,
        pixel_value: inputPixel[type],

      };
      await updateProjectMarketing(payload);
      onAlert(true, 'success', 'Pixel criado com sucesso!')
  
    } catch (error: unknown) {
      if(!userProjectSelectedID){
        onAlert(true, 'error', 'Por favor, selecione um projeto.')
      } else {
        onAlert(true, 'error', error instanceof Error ? error.message : 'Ocorreu um erro ao cria pixel.')
      }

      

    } finally {
      setIsLoadingButton(isLoadingButton => ({ ...isLoadingButton, [type]: false }));
      setInputPixel({});

    }

  };





  return (




    <div>
      
      <div className=" lg:p-5 flex flex-col lg:flex-row gap-6">

        {/* Coluna esquerda */}
        <div className="w-full lg:w-1/2 lg:overflow-auto lg:h-screen">
          <ul>
            {plataforms.map((platform) => (
              <Card className="mb-5">
                <li
                key={platform.id}
                className=""
              >
                <div className="flex items-center gap-4 py-3">
                  <Image
                    src={theme === 'light' ? platform.logoWhite : platform.logoDark || platform.logoWhite}
                    alt={`Logo ${platform.name}`}
                    width={100}
                    height={40}
                    className="object-contain"
                  />
                  <h4 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white/90">
                    Pixel {platform.name}
                  </h4>
                </div>

                {/* Select */}
                <div className="py-3">
                  <Label>Selecione um projeto</Label>
                  <Select
                    options={selectOptions}
                    onChange={handleSelectChange}
                    className="cursor-pointer"
                  />
                </div>

                {/* Input */}
                <div className="py-3 z-0">
                  <Label>Cole seu código do Pixel</Label>
                  <Input
                  
                    className="cursor-pointer"
                    type="text"
                    defaultValue={inputPixel[platform.type]}
                    placeholder={
                      platform.type === 'google_ads'
                        ? 'AW-XXXXXXXXXX'
                        : platform.type === 'utmify'
                          ? '67b685db1dbb22525effef90'
                          : platform.type === 'meta'
                            ? '123213213421213'
                            : ''
                    }
                    onChange={(e) => {
                      setInputPixel((value) => ({
                        ...value,
                        [platform.type]: e.target.value,
                      }));
                    }}
                  />
                </div>

                {/* Info */}
               
                {platform.info && (
                  <div className="py-2">
                    <div className="bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 p-4 rounded-lg">
                      <span className="text-xs">{platform?.info}</span>
                    </div>
                  </div>
                )}

                {/* Botão */}
                <div className="flex justify-end py-4">
                  <Button
                  size="sm"
                    onClick={() => {
                      createPixelProject(platform.type);
                      setIsLoadingButton((isLoadingButton) => ({
                        ...isLoadingButton,
                        [platform.type]: true,
                      }));
                    }}
                    isLoading={isLoadingButton[platform.type]}
                  >
                    + Adicionar Pixel
                  </Button>
                </div>
              </li>
              </Card>
            ))}
          </ul>
        </div>

        {/* Coluna direita */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {marketingData && (
            <div className="flex items-center justify-center py-10 lg:min-h-screen">
              <div className="flex w-72">
                <h1 className="mx-auto font-bold text-xl lg:text-2xl text-center">
                  Nenhum pixel foi associado a nenhum projeto.
                </h1>
              </div>
            </div>
          )}

          <div className="w-full lg:overflow-auto">
            <ListProjectMarketing />
          </div>
        </div>
      </div>




    </div>


  );
}

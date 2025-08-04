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
import Alert from "../ui/alert/Alert";
import Button from "../ui/button/Button";
import { useProjects } from "@/context/ProjectsContext";
import Select from "../form/Select";
import ListProjectMarketing from "./ListProjectMaketing";
import { useTheme } from "@/context/ThemeContext";
import { MarketingData } from "@/interfaces/marketing.interface";



export default function CardPixel() {
  const { marketingData, fetchProjectsMarketing, updateProjectMarketing } = useProjectsMarketing();
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertError, setIsAlerttError] = useState(false);
  const { userProjects, fetchProjects } = useProjects();
  const [userProjectSelectedID, setUserProjectSelectedID] = useState<string>();

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
      setIsAlert(true);
      setTimeout(() => {
        setIsAlert(false);
      }, 3000);
    } catch {
      setIsAlerttError(true);
      setTimeout(() => {
        setIsAlerttError(false);
      }, 3000);
    } finally {
      setIsLoadingButton(isLoadingButton => ({ ...isLoadingButton, [type]: false }));
      setInputPixel({});

    }

  };





  return (




    <div>
      {isAlert &&

        <div className="w-72">
          <div className="fixed top-26 right-4">
            <Alert
              variant="success"
              title="Pixel atualizado com sucesso!"
              message="Seu pixel foi atualizado, confira."
            />
          </div>
        </div>

      }
      {!isAlert && isAlertError &&

        <div className="w-72">
          <div className="fixed top-26 right-4">
            <Alert
              variant="error"
              title="Erro ao atualizar o pixel!"
              message="Houve um erro ao atualizar o pixel, tente novamente."
            />
          </div>
        </div>

      }

      <div className="p-5 flex gap-6">
       
        <div className="flex flex-col w-1/2">
          {marketingData &&
            <div className="flex min-h-screen items-center justify-center">
              <div className="flex w-72"> {/* Removi mx-auto daqui, pois o pai já está centralizando */}
                <h1 className="mx-auto font-bold text-2xl text-center">Nenhum pixel foi associado a nenhum projeto.</h1>
              </div>
            </div>
          }
          <div className="w-full overflow-auto">
            <ListProjectMarketing />
          </div>
        </div>
         <div className="w-1/2 overflow-auto h-screen">
          <ul className="">
            {plataforms.map((platform) => (
              <li
                key={platform.id}
                className="border-2 border-gray-200 rounded-2xl dark:border-gray-600 lg:p-6 dark:bg-gray-800 mb-10"
              >
                <div className="flex items-center gap-4 py-3">
                  <Image
                    src={theme === 'light' ? platform.logoWhite : platform.logoDark || platform.logoWhite }
                    alt={`Logo ${platform.name}`}
                    width={100}
                    height={40}
                    className="object-contain"
                  />
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Pixel {platform.name}
                  </h4>
                </div>
                <div className="py-3">
                  <Label>Selecione um projeto</Label>

                  <Select
                    options={selectOptions}
                    onChange={handleSelectChange}
                    className="cursor-pointer"
                  />


                </div>
                <div className="py-3">
                  <Label>Cole seu código do Pixel</Label>
                  <Input
                  className="cursor-pointer"
                    type="text"
                    defaultValue={inputPixel[platform.type]}
                    placeholder={
                      platform.type === 'google_ads' ? 'AW-XXXXXXXXXX' :
                        platform.type === 'utmify' ? '67b685db1dbb22525effef90' :
                          platform.type === 'meta' ? '123213213421213' :
                            ''
                    }
                    onChange={(e) => {
                      setInputPixel(value => ({ ...value, [platform.type]: e.target.value }));
                    }}

                  />
                </div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  {platform.information}
                </p>
                {platform.info &&

                  <div className="py-2">

                    <div className="bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 p-4 py-4 rounded-lg">
                      <span className="text-xs">{platform?.info}</span>
                    </div>

                  </div>

                }

                <div className="flex justify-end py-2">
                  <Button
                    onClick={() => {
                      createPixelProject(platform.type);
                      setIsLoadingButton(isLoadingButton => ({ ...isLoadingButton, [platform.type]: true }));
                    }}
                    isLoading={isLoadingButton[platform.type]}
                  >
                    + Adicionar Pixel
                  </Button>
                </div>
              </li>
            ))}

          </ul>
        </div>
      </div>



    </div>


  );
}

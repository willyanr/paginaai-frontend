"use client";
import React, { useState } from "react";
import Image from "next/image";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useMemo } from "react";

import logoMeta from '../../../public/images/pixel/meta.png';
import logoDarkUtmify from '../../../public/images/pixel/logo-dark-utmify.png';
import logoGoogleAds from '../../../public/images/pixel/google-adwords-logo.png';
import { MarketingProvider } from "@/context/MarketingContext";
import { useProjectsMarketing } from "@/context/MarketingContext";
import Alert from "../ui/alert/Alert";



export default function CardPixel() {
   const { marketingData, fetchProjectsMarketing, updateProject } = useProjectsMarketing();
   const [ isAlert, setIsAlert ] = useState(false);
   const [ isAlertError, setIsAlerttError ] = useState(false);
  



   useEffect(() => {
    fetchProjectsMarketing();
    
   }, []);

   const safeMarketingData = useMemo(() => {
      return marketingData || {};
    }, [marketingData]);


  const plataforms = [
    {
      id: safeMarketingData.project,
      name: "Meta",
      logo: logoMeta,
      information: "Adicione o pixel de rastreamento do Facebook para acompanhar as conversões e otimizar suas campanhas.",
      pixel: safeMarketingData?.pixel_meta,
      key: "pixel_meta",

    },
    {
      id: safeMarketingData.project,
      name: "Utmify",
      logo: logoDarkUtmify,
      information: "Adicione o pixel de rastreamento do Facebook para acompanhar as conversões e otimizar suas campanhas.",
      pixel: safeMarketingData?.pixel_utmify,
      key: "pixel_utmify",
    },
    {
      id: safeMarketingData.project,
      name: "Goole Ads",
      logo: logoGoogleAds,
      information: "Adicione o pixel de rastreamento do Facebook para acompanhar as conversões e otimizar suas campanhas.",
      pixel: safeMarketingData?.pixel_google_ads,
      key: "pixel_google_ads",
    },
   
  ];

  const updatePixel = async (platformKey: string, newValue: string, projectID: string) => {
    if (!safeMarketingData?.id) {
      alert("Dados do projeto não carregados.");
      return;
    }

    const payload = {
      id: safeMarketingData.id,
      project: projectID,
      [platformKey]: newValue,
    };

    try {
      await updateProject(payload); 
      setIsAlert(true);
      setTimeout(() => {      
        setIsAlert(false);
      }, 3000); 
    } catch (error) {
      console.error(error);
      setIsAlerttError(true);
      setTimeout(() => {      
        setIsAlerttError(false);
      }, 3000);
    }
  };


  return (

    

 
    <div>
      {isAlert && 
      
        <div className="fixed top-20 right-0 z-10 p-4 mt-4 mr-4">
        <div className="w-72">
          <Alert
              variant="success"
              title="Pixel atualizado com sucesso!" 
              message="Seu pixel foi atualizado, confira."
            />
        </div>
      </div>
      
      }
      {!isAlert && isAlertError && 
      
      <div className="fixed top-20 right-0 z-10 p-4 mt-4 mr-4">
      <div className="w-72">
        <Alert
            variant="error"
            title="Erro ao atualizar o pixel!" 
            message="Houve um erro ao atualizar o pixel, tente novamente."
          />
      </div>
    </div>
    
    }

      <div className="p-5">
        <ul>
        {plataforms.map((platform) => (
          <li
            key={platform.id}
            className="py-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-10"
          >
            <div className="flex items-center gap-4 py-3">
              <Image
                src={platform.logo}
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
              <Label>Cole seu código do Pixel</Label>
              <Input type="text" defaultValue={platform.pixel} 
              onChange={(e) => updatePixel(platform.key, e.target.value, platform.id)}
              />
            </div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {platform.information}
            </p>
          </li>
        ))}
        
      </ul>
        </div>
    
     
      
    </div>
    
    
  );
}

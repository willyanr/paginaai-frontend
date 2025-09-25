"use client";
import React from "react";
import CardPixel from "@/components/marketing/CardPixel";
import { MarketingProvider } from "@/context/MarketingContext";
import { InfoPage } from "@/components/ui/info/InfoPage";





export default function Marketing() {



  return (
    <MarketingProvider>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
                                  <InfoPage 
                                 
                                 title='Marketing e Pixels'
                                 subtitle='Gerencie seus pixels e converta muito mais.'
                          
                                 /> 
                                 </div>
          <CardPixel />
        </div>
    </MarketingProvider>
  );
}

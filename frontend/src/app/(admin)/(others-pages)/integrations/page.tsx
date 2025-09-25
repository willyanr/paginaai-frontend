"use client"
import React from "react";
import { Breadcrumb } from "@/components/integrations/Breadcrumb";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { MonitoringProvider } from "@/context/MonitoringContext";
import { InfoPage } from "@/components/ui/info/InfoPage";




export default function Marketing() {
  return (
    <ProjectsProvider>
      <MonitoringProvider>
        <div className="max-w-7xl mx-auto">
           <div className="mb-6">
                        <InfoPage 
                       
                       title='Integrações'
                       subtitle='Integre suas páginas de vendas com as melhores ferramentas de marketing e trackemento.'
                
                       /> 
                       </div>
          <Breadcrumb />
        </div>
      </MonitoringProvider>
    </ProjectsProvider>
  );
}

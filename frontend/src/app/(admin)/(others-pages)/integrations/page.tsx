"use client"
import React from "react";
import { Breadcrumb } from "@/components/integrations/Breadcrumb";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { MonitoringProvider } from "@/context/MonitoringContext";




export default function Marketing() {
  return (
    <ProjectsProvider>
      <MonitoringProvider>
        <div className="w-full">
          <Breadcrumb />
        </div>
      </MonitoringProvider>
    </ProjectsProvider>
  );
}

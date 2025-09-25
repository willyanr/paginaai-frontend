"use client";

import DomainsManager from "@/components/dominios/DomainsManager";
import { InfoPage } from "@/components/ui/info/InfoPage";
import { AlertProvider } from "@/context/AlertContext";
import { DomainsProvider } from "@/context/DomainsContext";
import React from "react";


export default function DomainsPage() {
 



  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <AlertProvider>
        <DomainsProvider>
          <div className="mb-6">
                  <InfoPage
                    title="Domínios "
                    subtitle="Gerencie seus domínios e realize a integração com seus projeots. Sua página estára disponpivel 24 horas online, seus prondutos vendendo muito."
                  />
                </div>
          <DomainsManager />
        </DomainsProvider>
      </AlertProvider>
    </div>
  );
}

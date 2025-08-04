"use client";

import DomainsManager from "@/components/dominios/DomainsManager";
import { AlertProvider } from "@/context/AlertContext";
import { DomainsProvider } from "@/context/DomainsContext";
import React from "react";


export default function DomainsPage() {
 



  return (
    <div className="min-h-screen">
      <AlertProvider>
        <DomainsProvider>
          <DomainsManager />
        </DomainsProvider>
      </AlertProvider>
    </div>
  );
}

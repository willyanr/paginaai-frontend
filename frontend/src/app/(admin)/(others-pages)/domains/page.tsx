"use client";

import DomainsManager from "@/components/dominios/DomainsManager";
import { AlertProvider } from "@/context/AlertContext";
import { DomainsProvider } from "@/context/DomainsContext";
import React from "react";


export default function DomainsPage() {
 



  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <AlertProvider>
        <DomainsProvider>
          <DomainsManager />
        </DomainsProvider>
      </AlertProvider>
    </div>
  );
}

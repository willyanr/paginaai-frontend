"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MyPage from "@/components/editor/MyPage";
import { UserProvider } from "@/context/UserContext";
import React from "react";


export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Minha página de venda" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
         
         
        </div>
        <UserProvider>
              <div className="border-4 p-3 border-dashed border-gray-300 rounded-2xl">
                <MyPage />
              </div>
          </UserProvider>
      </div>
    </div>
  );
}

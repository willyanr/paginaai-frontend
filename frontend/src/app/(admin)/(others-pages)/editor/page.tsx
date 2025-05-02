"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Editor from "@/components/editor/Editor";
import { ProjectsProvider, useProjects } from "@/context/ProjectsContext";
import { Metadata } from "next";
import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect } from "react";
import ModalEditor from "@/components/editor/ModalEditor";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { ModalProvider, useModalContext } from "@/context/ModalContext";
// export const metadata: Metadata = {
//   title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
//   // other metadata
// };
export default function Page() {
  const { setIsExpanded } = useSidebar();
  const { isOpen, openModal, closeModal } = useModalContext();
  const { projectSelected, projectSelectedID, updateProject } = useProjects();

  useEffect(() => {
    setIsExpanded(false);
    openModal;

    return () => {
      setIsExpanded(true);
    };
  }, []);



  if (!projectSelected) {

    return <div className="bg-gray-100 rounded-2xl h-screen flex items-center justify-center dark:bg-indigo-500 dark:text-white">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-indigo-500 mb-4 dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <h1 className="text-2xl text-indigo-500 text-center dark:text-white font-bold">Carregando seu editor...</h1>
      </div>
      <div className="">
        <ModalEditor />
      </div>
      {!isOpen &&
        <div className="fixed bottom-0 right-6 z-50">
          <div className="flex justify-end py-2">
            <Button
              startIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>}
              size='sm'
              variant="primary"
              children="Trocar de projeto"
              onClick={openModal}
            />
          </div>
        </div>

      }
    </div>


  }

  return (
    <div className="">
      <div className="fixed bottom-0 right-6 z-50">
        <div className="flex justify-end py-2">
          <Button
            startIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>}
            size='sm'
            variant="primary"
            children="Trocar de projeto"
            onClick={openModal}
          />
        </div>
      </div>
      <div className="">
        <ModalEditor />
      </div>
      <div>
        {projectSelected &&
          <Editor
            key={projectSelectedID}
            projectSelected={projectSelected}
            projectSelectedID={projectSelectedID}
          />
        }
      </div>
    </div>
  );
}

"use client";

import Editor from "@/components/editor/Editor";
import { useProjects } from "@/context/ProjectsContext";
import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect } from "react";
import ModalEditor from "@/components/editor/ModalEditor";
import Button from "@/components/ui/button/Button";
import { useModalContext } from "@/context/ModalContext";

export default function Page() {
  const { setIsExpanded } = useSidebar();
  const { isOpen, openModal } = useModalContext();
  const { projectSelected, projectSelectedID } = useProjects();

  
  useEffect(() => {
    setIsExpanded(false);
    openModal("project");
    

    return () => {
      setIsExpanded(true);
    };
  }, [openModal, setIsExpanded]);



  if (!projectSelected) {

    return <div className="bg-yellow-400/20 rounded-2xl h-screen flex items-center justify-center dark:bg-orange-500 dark:text-white">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-orange-500 mb-4 dark:text-white"
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
        <h1 className="text-2xl text-orange-500 text-center dark:text-white font-bold">Carregando seu editor...</h1>
      </div>
      <div className="">
        <ModalEditor 
        isListProject={true}
        />
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
              onClick={()=>{
                openModal("project")
              }}
            >
              Trocar de projeto
            </Button>
          </div>
        </div>

      }
    </div>


  }

  return (
    <div className="">
      <div className="">
        <ModalEditor 
        isListProject={true}
        />
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

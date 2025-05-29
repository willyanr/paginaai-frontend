"use client";

import React from "react";
import { ProjectsProvider } from "@/context/ProjectsContext";
import ModalEditor from "@/components/editor/ModalEditor";
import ListProjectPage  from '@/components/projects/ListProjectsPage'




export default function ProjectsPage() {
    return (
        <ProjectsProvider>
            <div>
               <ListProjectPage />
            </div>
            <div>
                <ModalEditor 
                isListProject={false}
                />
            </div>
            
    </ProjectsProvider>
    );
}

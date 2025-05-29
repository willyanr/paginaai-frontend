"use client";
import React from "react";
import { useProjects } from "../../context/ProjectsContext";
import Badge from "../ui/badge/Badge";
import { useModal } from "@/hooks/useModal";
import Button from "../ui/button/Button";
import DeleteModal from "../ui/alert/DeleteModal";






export const ListProjects = ({closeModal}) => {
    const { userProjects, setProjectSelected, fetchProjects, setProjectSelectedID, setProjectSelectedName, deleteProject } = useProjects();

    return (
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-5">
        {userProjects?.map((project, index) => (
          <div
            key={index}
            className="border dark:border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              setProjectSelected(project.project_data);
              if (setProjectSelected){
                closeModal();
                 setProjectSelectedID(project.id);
                setProjectSelectedName(project.name);
                 fetchProjects();
              }
             
              
            }}
          >
            <div className="flex items-center mb-2 justify-between">
              <h3 className="text-md font-semibold truncate">{project.name}</h3>
              
            </div>
            <Badge
                children={project?.domain?.domain || "Sem Domínio"}
                size="sm"
                color={project?.domain?.verified ? "success" : "error"}
              />
          
      
            <div className="flex items-center justify-between mt-5">
              <p className="text-sm text-gray-500 truncate">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    
    );
};
export default ListProjects;
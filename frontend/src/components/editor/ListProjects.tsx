"use client";
import React from "react";
import { useProjects } from "../../context/ProjectsContext";
import Badge from "../ui/badge/Badge";
import { useModal } from "@/hooks/useModal";
import Button from "../ui/button/Button";






export const ListProjects = ({closeModal}) => {
    const { userProjects, setProjectSelected, fetchProjects, setProjectSelectedID, deleteProject } = useProjects();

    return (
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-5">
        {userProjects?.map((project, index) => (
          <div
            key={index}
            className="border dark:border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              setProjectSelected(project.project_data);
              closeModal();
              setProjectSelectedID(project.id);
              fetchProjects();
              
            }}
          >
            <div className="flex items-center mb-2 justify-between">
              <h3 className="text-md font-semibold">{project.name}</h3>
              <Badge
                children={project.domain_verified ? "Com Domínio" : "Sem domínio"}
                size="sm"
                color={project.domain_verified ? "success" : "error"}
              />
            </div>
      
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{project.description}</p>
      
              {/* Botão Excluir com stopPropagation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      
    );
};
export default ListProjects;
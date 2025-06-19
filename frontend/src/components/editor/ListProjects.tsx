"use client";
import React from "react";
import { useProjects } from "../../context/ProjectsContext";
import Badge from "../ui/badge/Badge";


interface ListProjectsProps {
  closeModal: () => void;
}


export const ListProjects: React.FC<ListProjectsProps> = ({ closeModal }) => {
  const { userProjects, setProjectSelected, fetchProjects, setProjectSelectedID, setProjectSelectedName } = useProjects();

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
            setProjectSelectedName(project.name);
            fetchProjects();
          }}
        >
          <div className="flex items-center mb-2 justify-between">
            <h3 className="text-md font-semibold truncate">{project.name}</h3>

          </div>
          <Badge
            size="sm"
            color={project?.domain?.verified ? "success" : "error"}
          >
            {project?.domain?.domain || "Sem Domínio"}
          </Badge>


          <div className="flex items-center justify-between mt-5">
            <p className="text-sm text-gray-500 truncate">{project.description}</p>
          </div>
        </div>
      ))}
    </div>

  );
};
export default ListProjects;
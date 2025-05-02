import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getProjects as projectsService, updateProject as projectUpdate, deleteProject as projectServiceDelete, createProject } from '../services/projects';


interface ProjectsContextType {
    projectGraper: any[] | null;
    userProjects: any[] | null;
    projectSelected: any | null;
    projectSelectedID: any | null;
    isNewProject: boolean;
    isSuccess: boolean;
    isError: boolean;
    fetchProjects: () => Promise<void>;
    updateProject: (body: any) => Promise<void>;
    createNewProject: (payload: any) => Promise<void>;
    setProjectSelected: (project: any) => void;
    setProjectSelectedID: (id: any) => void;
    deleteProject: (id: any) => Promise<void>;
    // addProject: (project: Omit<Project, 'id'>) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userProjects, setUserProjects] = useState<any[]>([]);
    
    const [projectSelected, setProjectSelected] = useState(null);
    const [projectSelectedID, setProjectSelectedID] = useState(null);
    
    const [projectGraper, setProjects] = useState(null);
    const [isNewProject, setIsNewProject] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchProjects = async () => {
        try {
          const response = await projectsService();
          setUserProjects(response);
          const raw = response[0].project_data;
          setProjects(raw);
          
        } catch (error) {
            console.error('Erro real:', error.response?.data || error.message);
            throw new Error('Erro ao carregar projetos:'); 
        }
      };

      const updateProject = async (body:any) => {
        try{
            console.log('body', body)
            await projectUpdate(body, projectSelectedID);
          
        } catch (error) {
            throw new Error('Error update Project:');
        }
      };

      const createNewProject = async (payload:any) => {
        try{
            await createProject(payload);
            await fetchProjects();

            setIsSuccess(true);
        } catch (error) {
            throw new Error('Error update Project:');
        }
      };

      const deleteProject = async (id: string) => {
        try{
            await projectServiceDelete(id);
            await fetchProjects();
            setIsSuccess(true);
        } catch (error) {
            throw new Error('Error update Project:');
        }
      };

    // const addProject = async (project: Omit<Project, 'id'>) => {
    //     try {
    //         setProjects((prevProjects) => [...prevProjects, project]);
    //     } catch (error) {
    //         console.error('Error adding project:', error);
    //     }
    // };

  

    return (
        <ProjectsContext.Provider value={{ 
            projectGraper, 
            userProjects,
            isSuccess,
            isError,
            projectSelected,
            projectSelectedID,
            fetchProjects, 
            updateProject, 
            createNewProject,
            setProjectSelected, 
            setProjectSelectedID,
            deleteProject,
            isNewProject }}>
            {children}
        </ProjectsContext.Provider>
    );
};

export const useProjects = (): ProjectsContextType => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
};
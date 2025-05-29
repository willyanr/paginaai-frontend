import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
    getProjects as projectsService,
    updateProject as projectUpdate,
    deleteProject as projectServiceDelete,
    getAssets as ServiceGetAssets,
    createProject
} from '../services/projects';


interface ProjectsContextType {
    projectGraper: any[] | null;
    userProjects: any[] | null;
    projectSelected: unknown[];
    projectSelectedID: string | null;
    projectSelectedName: any | null;
    isNewProject: boolean;
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    fetchProjects: () => Promise<void>;
    updateProject: (body: any) => Promise<void>;
    createNewProject: (payload: any) => Promise<void>;
    setProjectSelected: (project: string) => void;
    setProjectSelectedID: (id: any) => void;
    setProjectSelectedName: (name: any) => void;
    deleteProject: (id: any) => Promise<void>;
    fetchProjectsAssets: () => Promise<void>;

    // addProject: (project: Omit<Project, 'id'>) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userProjects, setUserProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [projectSelected, setProjectSelected] = useState(null);
    const [projectSelectedID, setProjectSelectedID] = useState(null);
    const [projectSelectedName, setProjectSelectedName] = useState(null);


    const [projectGraper, setProjects] = useState(null);
    const [isNewProject, setIsNewProject] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchProjects = useCallback(async () => {
        try {
            const response = await projectsService();
            setUserProjects(response);
            const raw = response[0].project_data;
            setProjects(raw);

        } catch (error) {
            console.error('Erro real:', error.response?.data || error.message);
            throw new Error('Erro ao carregar projetos:');
        }
     }, []); 


    

    const updateProject = async (body: any, id: string) => {
        setIsLoading(true);
        try {
            const response = await projectUpdate(body, id);
            setProjectSelected(response.project_data);
            fetchProjects();
        } catch (error: any) {
            throw new Error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const createNewProject = async (payload: any) => {
        try {
            await createProject(payload);
            await fetchProjects();

            setIsSuccess(true);
        } catch (error) {
            throw new Error('Error update Project:');
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await projectServiceDelete(id);
            await fetchProjects();
        } catch (error) {
            throw new Error('Error update Project:');
        }
    };
    const fetchProjectsAssets = async () => {
        try {
            return await ServiceGetAssets();
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
            isLoading,
            projectSelected,
            projectSelectedID,
            projectSelectedName,
            fetchProjects,
            updateProject,
            createNewProject,
            setProjectSelected,
            setProjectSelectedID,
            setProjectSelectedName,
            deleteProject,
            fetchProjectsAssets,
            isNewProject
        }}>
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
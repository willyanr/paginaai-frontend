import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    getProjects as projectsService,
    updateProject as projectUpdate,
    deleteProject as projectServiceDelete,
    getAssets as ServiceGetAssets,
    createProject
} from '../services/projects';
import { CreateProjectUserPayload, DataProjectUser, ProjectsContextType, UpdateProjectUserPayload } from '@/interfaces/projects.interface';


const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userProjects, setUserProjects] = useState<DataProjectUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [projectSelected, setProjectSelected] = useState<string | null >(null);
    const [projectSelectedID, setProjectSelectedID] = useState<number | null>(null);
    const [projectSelectedName, setProjectSelectedName] = useState<string | null>(null);


    const [projectGraper, setProjects] = useState(null);
    const [isNewProject] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError] = useState(false);

    const fetchProjects = React.useCallback(async () => {
        try {
            const response = await projectsService();
            setUserProjects(response);
            const raw = response[0].project_data;
            setProjects(raw);

        } catch {
            throw new Error('Erro ao carregar projetos:');
        }
    }, []);




    const updateProject = async (body: UpdateProjectUserPayload, id: number) => {
        setIsLoading(true);
        try {
            const response = await projectUpdate(body, id);
            setProjectSelected(response.project_data);
            fetchProjects();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred while updating the project.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const createNewProject = async (payload: CreateProjectUserPayload) => {
        try {
            await createProject(payload);
            await fetchProjects();
            setIsSuccess(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error updating project: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred while updating the project.');
            }
        }
    };


    const deleteProject = async (id: number) => {
        try {
            await projectServiceDelete(id);
            await fetchProjects();
        } catch {
            throw new Error('Error update Project:');
        }
    };

    const fetchProjectsAssets = async () => {
        try {
            return await ServiceGetAssets();
        } catch {
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
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CreateDomainPayload, DomainsContextType, UpdateDomainPayload } from '@/interfaces/domains.interface';
import {
    getProjectsDomains as ServiceGetProjectDomains,
    createProjectsDomains as ServiceCreateProjectDomains,
    deleteProjectDomains as ServiceDeleteProjectDomains,
    verifyProjectsDomains as ServiceVerifyProjectsDomains,
    updateProjectsDomains as ServiceUpdateProjectDomains
} from '../services/domains';
import { useProjects } from './ProjectsContext';
import { useAlertContext } from './AlertContext';
import { useApi } from '@/services/api';

const DomainsContext = createContext<DomainsContextType | undefined>(undefined);

export const DomainsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [domainsData, setDomainsData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { fetchProjects } = useProjects();
    const { onAlert } = useAlertContext();

    const api = useApi();

    const fetchProjectsDomains = useCallback(async () => {
        try {
            const response = await ServiceGetProjectDomains(api);
            setDomainsData(response);
        } catch {
            throw new Error('Erro ao carregar os domínios:');
        }
    }, [api]); 


    const createProjectsDomains = async (payload: CreateDomainPayload) => {
        setIsLoading(true);
        try {
            await ServiceCreateProjectDomains(api, payload);
            fetchProjects();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            onAlert(true, 'error', message);
            throw new Error('Erro ao carregar os domínios:');
        } finally {
            setIsLoading(false);

        }
    };

    const deleteProjectsDomains = async (id: number) => {
        setIsLoading(true);
        try {
            if (id !== undefined && id !== null){
                 await ServiceDeleteProjectDomains(api, id.toString());
            }
            fetchProjectsDomains();
        } catch {
            throw new Error('Erro ao carregar os domínios:');
        } finally {
            setIsLoading(false);
    
        }
    };

    const verifyProjectsDomains = async (domain: string) => {
        setIsLoading(true);
        try {
            await ServiceVerifyProjectsDomains(api, domain);
            fetchProjectsDomains();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(message);
        } finally {
            setIsLoading(false);

        }
    };
    const updateProjectsDomains = async (payload: UpdateDomainPayload) => {
        setIsLoading(true);
        try {
            await ServiceUpdateProjectDomains(api, payload);
            fetchProjectsDomains();
        } catch {
            throw new Error('Erro ao carregar atualizar projeto:');
        } finally {
            setIsLoading(false);

        }
    };

    
    return (
        <DomainsContext.Provider value={{
            domainsData,
            isLoading,
            fetchProjectsDomains,
            createProjectsDomains,
            deleteProjectsDomains,
            verifyProjectsDomains,
            updateProjectsDomains

        }}>
            {children}
        </DomainsContext.Provider>
    );
};

export const useProjectsDomains = (): DomainsContextType => {
    const context = useContext(DomainsContext);
    if (!context) {
        throw new Error('useProjectsDomains must be used within a DomainsProvider');
    }
    return context;
};
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { DomainsContextType } from '@/interfaces/domains.interface';
import {
    getProjectsDomains as ServiceGetProjectDomains,
    createProjectsDomains as ServiceCreateProjectDomains,
    deleteProjectDomains as ServiceDeleteProjectDomains,
    verifyProjectsDomains as ServiceVerifyProjectsDomains,
    updateProjectsDomains as ServiceUpdateProjectDomains
} from '../services/domains';
import { useProjects } from './ProjectsContext';
import { useAlertContext } from './AlertContext';

const DomainsContext = createContext<DomainsContextType | undefined>(undefined);

export const DomainsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [domainsData, setDomainsData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { fetchProjects } = useProjects();
    const { onAlert } = useAlertContext();

    const fetchProjectsDomains = useCallback(async () => {
        try {
            const response = await ServiceGetProjectDomains();
            setDomainsData(response);
        } catch (error) {
            throw new Error('Erro ao carregar os domínios:');
        }
    }, []); 


    const createProjectsDomains = async (payload: any) => {
        setIsLoading(true);
        try {
            const response = await ServiceCreateProjectDomains(payload);
            fetchProjects();
        } catch (error: any) {
            onAlert(true, 'error', error.message)
            throw new Error('Erro ao carregar os domínios:');
        } finally {
            setIsLoading(false);

        }
    };

    const deleteProjectsDomains = async (id: string) => {
        setIsLoading(true);
        try {
            await ServiceDeleteProjectDomains(id);
            fetchProjectsDomains();
        } catch (error) {
            throw new Error('Erro ao carregar os domínios:');
        } finally {
            setIsLoading(false);

        }
    };

    const verifyProjectsDomains = async (domain: string) => {
        setIsLoading(true);
        try {
            await ServiceVerifyProjectsDomains(domain);
            fetchProjectsDomains();

        } catch (error) {
            onAlert(true, 'error', error.message)
            throw new Error('Erro ao carregar os domínios:');
        } finally {
            setIsLoading(false);

        }
    };
    const updateProjectsDomains = async (payload: any) => {
        setIsLoading(true);
        try {
            const response = await ServiceUpdateProjectDomains(payload);
            fetchProjectsDomains();
        } catch (error: any) {
            onAlert(true, 'error', error.message)
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
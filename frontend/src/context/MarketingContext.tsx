'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    getProjectsMarketing as getProjectsMarketing,
    putProjectsMarketing as UpdateServiceProjectsMarketing,
    deleteProjectsPixel as DeleteServiceProjectPixel
} from '../services/maketingProject';
import { useProjects } from './ProjectsContext';
import { MarketingContextType, UpdatePixelPayload } from '@/interfaces/marketing.interface';
import { useApi } from '@/services/api';



const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export const MarketingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [marketingData, setMarketingData] = useState(null);
    const { fetchProjects } = useProjects();
    const [isLoading, setIsloading] = useState<boolean>()

    const api = useApi(); 

    const fetchProjectsMarketing = React.useCallback(async () => {
        try {
            const response = await getProjectsMarketing(api);
            setMarketingData(response[0]);
            fetchProjects();
            return response[0];
        } catch {
            throw new Error('Erro ao carregar o marketing:');
        }
    }, [api, fetchProjects]);

    const updateProjectMarketing = async (payload: UpdatePixelPayload) => {
        setIsloading(true);
        try {
            await UpdateServiceProjectsMarketing(api, payload);
            fetchProjects();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(message);
        } finally {
        }
    };
    const deleteProjectsMarketing = async (id: number) => {
        try {
            await DeleteServiceProjectPixel(api, id);
            fetchProjects();
        } catch {
            throw new Error('Error delete Pixel:');
        }
    };

    return (
        <MarketingContext.Provider value={{
            marketingData,
            fetchProjectsMarketing,
            updateProjectMarketing,
            deleteProjectsMarketing,
            isLoading

        }}>
            {children}
        </MarketingContext.Provider>
    );
};

export const useProjectsMarketing = (): MarketingContextType => {
    const context = useContext(MarketingContext);
    if (!context) {
        throw new Error('useProjectsMarketing must be used within a MarketingProvider');
    }
    return context;
};
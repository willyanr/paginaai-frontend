"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DataCreateMonitoring, DataMonitoring, MonitoringContextType } from '@/interfaces/monitoring.interface';
import { getMonitoring, postMonitoring as CreateNewIntegrationApi, deleteMonitoring as removeMonitoringApi } from '@/services/monitoring';
import { useApi } from '@/services/api';



const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export const MonitoringProvider = ({ children }: { children: ReactNode }) => {
    const [monitoringData, setMonitoringData] = useState<DataMonitoring | null>(null);
    const api = useApi();


    const fetchMonitoring = React.useCallback(async () => {
        try {
            const response = await getMonitoring(api);
            setMonitoringData(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }, [api]);

    const createNewIntegrationClarity = async (payload: DataCreateMonitoring) => {
        try {
            await CreateNewIntegrationApi(api, payload);
            fetchMonitoring();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    };

    const removeIntegrationClarity = async (id: number) => {
        try {
            await removeMonitoringApi(api, id);
            fetchMonitoring();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }





    return (
        <MonitoringContext.Provider value={{
            fetchMonitoring,
            createNewIntegrationClarity,
            removeIntegrationClarity,
            monitoringData
        }}>
            {children}
        </MonitoringContext.Provider>
    );
};

export const useMonitoring = () => {
    const context = useContext(MonitoringContext);
    if (!context) {
        throw new Error('useMonitoring must be used within a TestsABProvider');
    }
    return context;
};
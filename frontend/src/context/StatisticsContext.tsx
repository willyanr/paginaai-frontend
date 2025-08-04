"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

import {
    getStatistics as ServiceGetStatistics
} from '@/services/statistics';
import { StatisticsContextType } from '@/interfaces/statistics.interface';




const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export const StatisticsProvider = ({ children }: { children: ReactNode }) => {
     const [ statistics, setStatistics] = useState<  | null >(null);   

    const fetchStatistics= React.useCallback(async () => {
        try {
            const response = await ServiceGetStatistics();
            setStatistics(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        } finally {
        }
    }, []);

  



    
    




    return (
        <StatisticsContext.Provider value={{ 
            fetchStatistics,
            statistics
          }}>
            {children}
        </StatisticsContext.Provider>
    );
};

export const useStatistics = () => {
    const context = useContext(StatisticsContext);
    if (!context) {
        throw new Error('useStatistic must be used within a TestsABProvider');
    }
    return context;
};
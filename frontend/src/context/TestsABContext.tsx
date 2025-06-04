"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DataTestsAB, TestsABContextType } from '@/interfaces/testsab.interface';

import {
    getTestsAB as ServiceGetTestAB
} from '@/services/testsAB'



const TestsABContext = createContext<TestsABContextType | undefined>(undefined);

export const TestsABProvider = ({ children }: { children: ReactNode }) => {
     const [ testsAB, setTestsAB ] = useState< DataTestsAB | null >(null);   

    const fetchTestsAB = React.useCallback(async () => {
        try {
            const response = await ServiceGetTestAB();
            setTestsAB(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }, []);
    




    return (
        <TestsABContext.Provider value={{ 
            fetchTestsAB,
            testsAB
          }}>
            {children}
        </TestsABContext.Provider>
    );
};

export const useTestsAB = () => {
    const context = useContext(TestsABContext);
    if (!context) {
        throw new Error('useTestsAB must be used within a TestsABProvider');
    }
    return context;
};
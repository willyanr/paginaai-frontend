"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DataCreateTestAB, DataTestsAB, TestsABContextType } from '@/interfaces/testsab.interface';

import {
    getTestsAB as ServiceGetTestAB,
    postProjectTest as ServiceCreateNewTest,
    deleteProjectTest as ServiceDeleteProjectTest
} from '@/services/testsAB'
import { useApi } from '@/services/api';



const TestsABContext = createContext<TestsABContextType | undefined>(undefined);

export const TestsABProvider = ({ children }: { children: ReactNode }) => {
     const [ testsAB, setTestsAB ] = useState< DataTestsAB | null >(null);   
     const [ isLoading, setIsLoading ] = useState<boolean>(false);
        const api = useApi(); 
    const fetchTestsAB = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await ServiceGetTestAB(api);
            setTestsAB(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    }, [api]);

     const createNewProjectTest = async (payload: DataCreateTestAB) => {
            setIsLoading(true)
            try {
                await ServiceCreateNewTest(api, payload);
                await fetchTestsAB();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new Error(`Error ao criar teste: ${error.message}`);
                } else {
                    throw new Error('An unknown error occurred while updating the project.');
                }
            } finally {
                setIsLoading(false);
            }
        };

          const deleteProjectTest = async (id: number) => {
            setIsLoading(true);
            try {
                await ServiceDeleteProjectTest(api, id);
                await fetchTestsAB();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new Error(`Erro ao deletar teste: ${error.message}`);
                } else {
                    throw new Error('An unknown error occurred while updating the project.');
                }
            } finally {
                setIsLoading(false);
            }
        };




    
    




    return (
        <TestsABContext.Provider value={{ 
            fetchTestsAB,
            createNewProjectTest,
            deleteProjectTest,
            testsAB,
            isLoading
            
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
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TestsABContextType } from '@/interfaces/testsab.interface';

import {
    getTestsAB as ServiceGetTestAB
} from '@/services/testsAB'



const TestsABContext = createContext<TestsABContextType | undefined>(undefined);

export const TestsABProvider = ({ children }: { children: ReactNode }) => {
     const [ testsAB, setTestsAB ] = useState();   


    const fetchTestsAB = async () => {
        try{
            const reponse = await ServiceGetTestAB();
            setTestsAB(reponse);
        } catch(error : any){
            alert(error)
        }
    }
    




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
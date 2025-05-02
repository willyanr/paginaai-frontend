import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getProjectsMarketing as getProjectsMarketing,  putProjectsMarketing  } from '../services/maketingProject';





interface MarketingContextType {
    marketingData: any[] | null;
    fetchProjectsMarketing: () => Promise<void>;
    updateProject: (payload: any) => Promise<void>;

}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export const MarketingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ marketingData , setMarketingData] = useState(null);

    const fetchProjectsMarketing = async () => {
        try {
            const response = await getProjectsMarketing();
            setMarketingData(response[0]);
        } catch (error) {
            
            throw new Error('Erro ao carregar o marketing:'); 
        }
      };

      const updateProject = async (payload:any) => {
        try{
            console.log('body', payload)
            await putProjectsMarketing(payload);
        } catch (error) {
            throw new Error('Error update Project:');
        }
      };

    return (
        <MarketingContext.Provider value={{ marketingData, fetchProjectsMarketing, updateProject }}>
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
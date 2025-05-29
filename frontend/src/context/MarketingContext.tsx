import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
    getProjectsMarketing as getProjectsMarketing,
    putProjectsMarketing as UpdateServiceProjectsMarketing,
    deleteProjectsPixel as DeleteServiceProjectPixel
} from '../services/maketingProject';
import { useProjects } from './ProjectsContext';





interface MarketingContextType {
    marketingData: any[] | null;
    fetchProjectsMarketing: () => Promise<void>;
    updateProjectMarketing: (payload: any) => Promise<void>;
    deleteProjectsMarketing: (id: id) => Promise<void>;
    isLoading: boolean;

}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export const MarketingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ marketingData , setMarketingData] = useState(null);
    const {fetchProjects} = useProjects();
    const [ isLoading, setIsloading ] = useState<boolean>()

    const fetchProjectsMarketing = async () => {
        try {
            const response = await getProjectsMarketing();
            setMarketingData(response[0]);
            fetchProjects();
        } catch (error) {
            
            throw new Error('Erro ao carregar o marketing:'); 
        }
      };

      const updateProjectMarketing = async (payload:any) => {
        setIsloading(true);
        try{
            await UpdateServiceProjectsMarketing(payload);
            fetchProjects();
        } catch (error) {
            throw new Error('Error atualizar Pixel:');
        } finally {
        }
      };
      const deleteProjectsMarketing = async (id: string) => {
        try{
            await DeleteServiceProjectPixel(id);
            fetchProjects();
        } catch (error) {
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
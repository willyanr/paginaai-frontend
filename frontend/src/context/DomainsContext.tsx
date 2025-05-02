import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DomainsContextType } from '@/interfaces/domains.interface';
import { getProjectsDomains as ServiceGetProjectDomains } from '../services/domains';

const DomainsContext = createContext<DomainsContextType | undefined>(undefined);

export const DomainsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ domainsData , setDomainsData] = useState(null);

    const fetchProjectsDomains = async () => {
        try {
            const response = await ServiceGetProjectDomains();
            setDomainsData(response);
        } catch (error) {
            throw new Error('Erro ao carregar os domínios:'); 
        }
      };

    return (
        <DomainsContext.Provider value={{ domainsData, fetchProjectsDomains }}>
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
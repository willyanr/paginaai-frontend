

export interface DataMonitoring {
  id: number;
  code_clarity: string;
  project: number;
}

export interface DataCreateMonitoring {
  code_clarity: string;
  project: number;
}



export interface MonitoringContextType {
    monitoringData: DataMonitoring | null;
    fetchMonitoring: () => Promise<void>;
    createNewIntegrationClarity: (payload: DataCreateMonitoring) => Promise<void>;
    removeIntegrationClarity: (id: number) => Promise<void>;
}
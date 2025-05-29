export interface DomainsContextType {
    domainsData: any[] | null;
    isLoading: boolean;
    fetchProjectsDomains: (() => Promise<void>) | null;
    createProjectsDomains: ((payload: any) => Promise<void>) | null;
    deleteProjectsDomains: ((id: string) => Promise<void>) | null;
    verifyProjectsDomains: ((domain: string) => Promise<void>) | null;
    updateProjectsDomains:((payload: any) => Promise<void>) | null;

  }
  
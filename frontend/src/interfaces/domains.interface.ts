export interface DomainsContextType {
    domainsData: any[] | null;
    isLoading: boolean;
    fetchProjectsDomains: (() => Promise<void>);
    createProjectsDomains: ((payload: any) => Promise<void>);
    deleteProjectsDomains: ((id: string) => Promise<void>);
    verifyProjectsDomains: ((domain: string) => Promise<void>);
    updateProjectsDomains:((payload: any) => Promise<void>);

  }
  
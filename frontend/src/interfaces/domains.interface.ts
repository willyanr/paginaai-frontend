
export interface DataDomain{
    id: number,
    project_name: string,
    domain: string,
    expected_cname: string,
    verified: true,
    ssl_enabled: true,
    created_at: string,
    last_checked: string,
    project: number
  }

export interface CreateDomainPayload  {
    domain: string;
    project: string;

}
export interface UpdateDomainPayload  {
    id: string,
    project: string

}

export interface DomainsContextType {
    domainsData: DataDomain[] | null;
    isLoading: boolean;
    fetchProjectsDomains: (() => Promise<void>);
    createProjectsDomains: ((payload: CreateDomainPayload) => Promise<void>);
    deleteProjectsDomains: ((id: string) => Promise<void>);
    verifyProjectsDomains: ((domain: string) => Promise<void>);
    updateProjectsDomains: ((payload: UpdateDomainPayload) => Promise<void>);

}

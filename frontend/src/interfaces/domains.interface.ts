export interface DomainsContextType {
    domainsData: any[] | null;
    fetchProjectsDomains: (() => Promise<void>) | null
  }
  
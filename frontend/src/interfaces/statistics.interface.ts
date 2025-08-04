export interface DataStatistics {
    total_projects: number,
    total_views: number,
    total_clicks: number,
    total_domains: number
}



export interface StatisticsContextType {
    fetchStatistics: () => Promise<DataStatistics | void>;
    statistics: DataStatistics | null;
}
export interface DataStatistics {
    total_projects: number,
    total_views: number,
    total_clicks: number,
    total_domains: number
    top_utm_campaign: string,
    utm_created: string,
    top_utm_campaign_count: string
    
}



export interface StatisticsContextType {
    fetchStatistics: () => Promise<DataStatistics | void>;
    statistics: DataStatistics | null;
}

export interface DataMarketing {
    id: number
    project_name: string,
    project: number
}
export interface UpdatePixelPayload {
  pixel_type: string,
  pixel_value: string,
  project: number
} 

export interface DataPixel {
  id: number;
  pixel_type: string;
  pixel_value: string;
  project: number;
}

export interface MarketingData {
  pixel_meta?: string;
  pixel_utmify?: string;
  pixel_google_ads?: string;
};


export interface MarketingContextType {
    marketingData: DataMarketing[] | null;
    fetchProjectsMarketing: () => Promise<DataMarketing>;
    updateProjectMarketing: (payload: UpdatePixelPayload) => Promise<void>;
    deleteProjectsMarketing: (id: number) => Promise<void>;
    isLoading: boolean | undefined;

}

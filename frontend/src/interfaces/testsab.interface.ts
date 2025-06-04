import { DataPixel } from "./marketing.interface";


export interface Domain {
  id: number;
  project_name: string;
  domain: string;
  expected_cname: string;
  verified: boolean;
  ssl_enabled: boolean;
  created_at: string;
  last_checked: string;
  user: number;
  project: number;
}

export interface VariantProject {
  id: number;
  name: string;
  description: string;
  domain_verified: boolean;
  project_data: string;
  html: string;
  css: string;
  created_at: string;
  updated_at: string;
  user: number;
  domain: Domain;
  pixels: DataPixel[]
}

export interface DataTestsAB {
  id: number;
  variant_a_project_name: VariantProject;
  variant_b_project_name: VariantProject;
  name: string;
  description: string;
  winner_variant: string;
  created_at: string;
  updated_at: string;
  user: number;
  variant_a_project: number;
  variant_b_project: number;
}




export interface TestsABContextType {
    testsAB: DataTestsAB | null;
    fetchTestsAB: () => Promise<void>;
}
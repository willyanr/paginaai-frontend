export interface DataProjectUser {
 id: number,
    domain: {
      id: number,
      project_name: string,
      domain: string,
      expected_cname: string,
      verified: boolean,
      ssl_enabled: boolean,
      created_at: string,
      last_checked: string,
      project: number
    },
    pixels: [
      {
        id: number,
        pixel_type: string,
        pixel_value: string,
        project: number
      }
    ],
    name: string,
    description: string,
    domain_verified: boolean,
    project_data: string,
    html: string,
    css: string,
    created_at: string,
    updated_at: string,
  }

export interface CreateProjectUserPayload {
  name: string,
  description: string,
  domain_verified: boolean,
  project_data: string,
  html: string,
  css: string,
  user: number
} 

export interface UpdateProjectUserPayload {
  name: string,
  description: string,
  domain_verified: boolean,
  project_data: string,
  html: string,
  css: string,
}


export interface ProjectsContextType {
    projectGraper: unknown[] | null;
    userProjects: DataProjectUser[] | null;
    projectSelected: unknown[];
    projectSelectedID: number | null;
    projectSelectedName: string | null;
    isNewProject: boolean;
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    fetchProjects: () => Promise<void>;
    updateProject: (body: UpdateProjectUserPayload, id: number) => Promise<void>;
    createNewProject: (payload: CreateProjectUserPayload) => Promise<void>;
    setProjectSelected: (project: []) => void;
    setProjectSelectedID: (id: number) => void;
    setProjectSelectedName: (name: string) => void;
    deleteProject: (id: number) => Promise<void>;
    fetchProjectsAssets: () => Promise<void>;

}
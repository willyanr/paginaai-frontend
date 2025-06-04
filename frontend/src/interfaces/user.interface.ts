export interface DataUser {
  id: number;
  email: string;
  name: string;
  whatsapp: string;
  cpf: string;
  cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  created_at: string;
  how_did_you_hear_about_us: string;
}

export interface UserContextType {
  user: DataUser | null;
  isLoading: boolean;
  getUserApi: () => void;
  putUserApi: (payload: DataUser) => Promise<void>;
}

export interface Subscription {
  id: number;
  status: 'pending' | 'active' | 'canceled';
  start_date: string;
  end_date: string;
  last_payment_qrcode: string;
  last_payment_date: string;
  external_id: string;
  plan: number;
}

export interface DataSubscription {
  id: string;
  last_payment_qrcode: string;
  status?: string;
}

export interface DataUser {
  id: number;
  email: string;
  name: string;
  whatsapp: string;
  cpf: string;
  cnpj: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  created_at: string;
  how_did_you_hear_about_us: string | null;
  subscriptions: Subscription[]; // adicionando aqui
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface ResetUserPassword {
  password: string;
  confirmPassword: string;
}


export interface ResetUserPasswordPayload {
  otp: string,
  email: string,
  password: string,
}

export interface SignUpFormData {
  fname: string;
  tel: string;
  cpf: string;
  email: string;
  password: string;
  terms?: boolean;
  how_did_you_hear_about_us?: string;
}

export interface VerifyCodePayload {
  name?: string;
  otp: string;

  
}

export interface UserFormData {
    name?: string;
    whatsapp?: string;
    zip_code?: string;
    city?: string;
    state?: string;
    cnpj?: string;
  };

export interface VerifyCodeOTPPassword{
  otp: string;
  email: string;  
}

export interface RegisterUser {
  email: string,
  password: string,
  profile: {
    name: string,
    whatsapp: string,
    cpf: string,
    cnpj?: string,
    address?: string,
    city?: string,
    state?: string,
    country?: string,
    zip_code?: string,
    how_did_you_hear_about_us?: string,
  }
}

export interface UserContextType {
  user: DataUser | null;
  getUserApi: () => void;
  putUserApi: (payload: UserFormData) => Promise<void>;
}

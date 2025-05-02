import { createContext, useContext, useState, ReactNode } from 'react';
import { getUser } from '../services/user';

interface User {
  id: number;  
  name: string;
  email?: string; 
  domain: string;  
  project_data: string;
  html: string;
  css: string;
}


interface UserContextType {
  user: User | null; 
  getUserApi: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); 

  const getUserApi = async () => {
    try {
      const data = await getUser();
      setUser(data[0]);
    } catch (err) {
      alert('Erro ao obter dados do usuário');
    }
  };

  return (
    <UserContext.Provider value={{ user, getUserApi }}>
      {children}
    </UserContext.Provider>
  );
}

import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  getUser as ServiceGetUser,
  putUser as ServicePutUser
 } from '../services/user';
import { UserContextType, User } from '@/interfaces/user.interface';




const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); 
  const [isLoading, setIsLoading] = useState(false);

  const getUserApi = async () => {
    try {
      const data = await ServiceGetUser();
      setUser(data[0]);
    } catch (err) {
      alert('Erro ao obter dados do usuário');
    }
  };
  
  const putUserApi = async (payload: User) => {
    setIsLoading(true);
    try {
      await ServicePutUser(payload);
    } catch (err) {
      throw new Error('Erro ao atualizar User:');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, getUserApi, putUserApi, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

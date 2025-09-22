import { createContext, useContext, useState, ReactNode } from 'react';
import {
  getUser as ServiceGetUser,
  putUser as ServicePutUser
} from '../services/user';
import { UserContextType, DataUser, UserFormData } from '@/interfaces/user.interface';
import { useCallback } from 'react';




const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DataUser | null>(null);

  const getUserApi = useCallback(async () => {
    try {
      const data = await ServiceGetUser();
      setUser(data[0]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  }, []);

  const putUserApi = async (payload: UserFormData) => {
    try {
      await ServicePutUser(payload);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    } finally {
    }
  };

  return (
    <UserContext.Provider value={{ user, getUserApi, putUserApi }}>
      {children}
    </UserContext.Provider>
  );
}

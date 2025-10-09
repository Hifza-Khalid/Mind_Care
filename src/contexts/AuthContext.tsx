import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, mockUsers } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mindbuddy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 800));

    const usersDbJson = localStorage.getItem('mindbuddy_users_db');
    const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

    const allUsers = { ...mockUsers, ...usersDb };

    const foundUser = allUsers[credentials.email];

    if (
      foundUser &&
      foundUser.password === credentials.password &&
      foundUser.user.role === credentials.role
    ) {
      setUser(foundUser.user);
      localStorage.setItem('mindbuddy_user', JSON.stringify(foundUser.user));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindbuddy_user');
    localStorage.removeItem('selected_institution');
    localStorage.removeItem('recent_institutions');
    localStorage.removeItem('institution_favorites');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('mindbuddy_user', JSON.stringify(updatedUser));

      const usersDbJson = localStorage.getItem('mindbuddy_users_db');
      const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};
      
      if (usersDb[user.email]) {
        usersDb[user.email].user = updatedUser;
        localStorage.setItem('mindbuddy_users_db', JSON.stringify(usersDb));
      }
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

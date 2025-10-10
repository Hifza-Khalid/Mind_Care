import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, mockUsers } from '@/types/auth';
import { User as UserType } from '@/types/auth'; // Ensure this is imported if UserType is used

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
    // Check for stored user session
    const storedUser = localStorage.getItem('mindbuddy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = mockUsers[credentials.email];

    if (
      mockUser &&
      mockUser.password === credentials.password &&
      mockUser.user.role === credentials.role
    ) {
      setUser(mockUser.user);
      localStorage.setItem('mindbuddy_user', JSON.stringify(mockUser.user));
      setIsLoading(false);
      // Redirect to institution selection instead of directly to dashboard
      window.location.href = '/select-institution';
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindbuddy_user');
    // Clear institution-related data for privacy
    localStorage.removeItem('selected_institution');
    localStorage.removeItem('recent_institutions');
    localStorage.removeItem('institution_favorites');
    // Redirect to the main landing page
    window.location.href = '/';
  };

  const updateUser = (data: Partial<User>) => { // Changed UserType to User for simplicity
    if (user) {
      const updatedUser = { ...user, ...data };
      
      // 1. Update React state in context
      setUser(updatedUser); 

      // 2. WRITE TO PERSISTENCE (FIXED)
      localStorage.setItem('mindbuddy_user', JSON.stringify(updatedUser));
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
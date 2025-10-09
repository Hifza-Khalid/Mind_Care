import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, mockUsers } from '@/types/auth';
import CryptoJS from 'crypto-js';

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

// Encryption utilities 
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

// Secure storage utilities
const secureStorage = {
  setItem: (key: string, value: any): void => {
    const stringValue = JSON.stringify(value);
    const encrypted = encryptData(stringValue);
    sessionStorage.setItem(key, encrypted);
  },
  
  getItem: (key: string): any | null => {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    
    const decrypted = decryptData(encrypted);
    if (!decrypted) return null;
    
    try {
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Parse failed:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  }
};

// Hash password 
const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = secureStorage.getItem('mindbuddy_user');
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const usersDb = secureStorage.getItem('mindbuddy_users_db') || {};
    const allUsers = { ...mockUsers, ...usersDb };
    const foundUser = allUsers[credentials.email];
    
    // Hash password and compare
    const hashedPassword = hashPassword(credentials.password);
    
    if (
      foundUser &&
      foundUser.password === hashedPassword &&
      foundUser.user.role === credentials.role
    ) {
      // Store only user data and don't store the password
      const userDataWithoutPassword = { ...foundUser.user };
      setUser(userDataWithoutPassword);
      secureStorage.setItem('mindbuddy_user', userDataWithoutPassword);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    secureStorage.removeItem('mindbuddy_user');
    secureStorage.removeItem('selected_institution');
    secureStorage.removeItem('recent_institutions');
    secureStorage.removeItem('institution_favorites');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      secureStorage.setItem('mindbuddy_user', updatedUser);
      
      const usersDb = secureStorage.getItem('mindbuddy_users_db') || {};
      
      if (usersDb[user.email]) {
        // Update user data without storing password
        usersDb[user.email].user = updatedUser;
        secureStorage.setItem('mindbuddy_users_db', usersDb);
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

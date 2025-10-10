import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, mockUsers } from '@/types/auth';
import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

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

// Encryption utilities for data storage
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

// Helper function to ensure user data doesn't contain password field
const sanitizeUserData = (userData: any): User => {
  // Create a copy and explicitly remove password field
  const { password, ...cleanUserData } = userData;
  return cleanUserData as User;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = secureStorage.getItem('mindbuddy_user');
    if (storedUser) {
      // Sanitize user data on load to ensure no password field exists
      setUser(sanitizeUserData(storedUser));
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
    
    // Use bcrypt.compareSync for secure password comparison
    if (
      foundUser &&
      bcrypt.compareSync(credentials.password, foundUser.password) &&
      foundUser.user.role === credentials.role
    ) {
      // Explicitly sanitize user data - remove ANY password field
      const cleanUserData = sanitizeUserData(foundUser.user);
      
      setUser(cleanUserData);
      secureStorage.setItem('mindbuddy_user', cleanUserData);
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
      //Ensure no password data flows through update
      // Explicitly remove password field if it somehow exists in userData
      const { password: _, ...safeUserData } = userData as any;
      
      const updatedUser = { ...user, ...safeUserData };
      
      // sanitize before storing
      const cleanUpdatedUser = sanitizeUserData(updatedUser);
      
      setUser(cleanUpdatedUser);
      secureStorage.setItem('mindbuddy_user', cleanUpdatedUser);
      
      // Update in database without password
      const usersDb = secureStorage.getItem('mindbuddy_users_db') || {};
      
      if (usersDb[user.email]) {
        // Only update the user object, NOT the password
        usersDb[user.email].user = cleanUpdatedUser;
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

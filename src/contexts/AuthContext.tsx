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

// Encryption utilities for NON-SENSITIVE data storage
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

// Secure storage for user profile data ONLY (never contains passwords)
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

// SEPARATE storage for password database (uses sessionStorage directly, no encryption)
// This is acceptable because passwords are already hashed with bcrypt
const passwordStorage = {
  setItem: (key: string, value: any): void => {
    // Store password database directly without AES encryption
    // Passwords are already protected by bcrypt hashing
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  
  getItem: (key: string): any | null => {
    const data = sessionStorage.getItem(key);
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Parse failed:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load ONLY user profile (never contains password)
    const storedUser = secureStorage.getItem('mindbuddy_user');
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Get password database from separate storage
    const usersDb = passwordStorage.getItem('mindbuddy_users_db') || {};
    const allUsers = { ...mockUsers, ...usersDb };
    const foundUser = allUsers[credentials.email];
    
    if (
      foundUser &&
      bcrypt.compareSync(credentials.password, foundUser.password) &&
      foundUser.user.role === credentials.role
    ) {
      // Extract ONLY user profile data (no password field)
      const userProfile: User = foundUser.user;
      
      // Store user profile separately from password database
      setUser(userProfile);
      secureStorage.setItem('mindbuddy_user', userProfile);
      
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
      
      // Update ONLY in user profile storage (never touches password database)
      secureStorage.setItem('mindbuddy_user', updatedUser);
      
      // Update user profile in password database
      const usersDb = passwordStorage.getItem('mindbuddy_users_db') || {};
      
      if (usersDb[user.email]) {
        // Update only the user object, password hash remains separate
        usersDb[user.email].user = updatedUser;
        passwordStorage.setItem('mindbuddy_users_db', usersDb);
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

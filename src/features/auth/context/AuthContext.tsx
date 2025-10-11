import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../../../api/auth.api';
import { storageService } from '../../../services/storage.service';
import type { User, AuthContextType, RegisterFormData } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize - Check if user is already logged in
  useEffect(() => {
    const initAuth = () => {
      const savedUser = storageService.getUser<User>();
      const accessToken = storageService.getAccessToken();

      if (savedUser && accessToken) {
        setUser(savedUser);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      // Save tokens and user
      storageService.setAccessToken(response.accessToken);
      storageService.setRefreshToken(response.refreshToken);
      storageService.setUser(response.user);

      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      const response = await authApi.register(data);

      // Save tokens and user
      storageService.setAccessToken(response.accessToken);
      storageService.setRefreshToken(response.refreshToken);
      storageService.setUser(response.user);

      setUser(response.user);
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  };

  const logout = () => {
    storageService.clearAll();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

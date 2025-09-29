"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginResponse, authApi, apiUtils, ApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
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
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = apiUtils.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response: LoginResponse = await authApi.login(username, password);
      
      // Store user data
      apiUtils.setUser(response);
      setUser(response.user);
      
      // Redirect based on user type
      if (response.role === 'pharmacy') {
        router.push('/pharmacy');
      } else if (response.role === 'government' || response.role === 'admin') {
        router.push('/government');
      } else {
        throw new Error('Invalid user role');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    apiUtils.logout();
    setUser(null);
    router.push('/');
  };

  const refreshUser = async () => {
    try {
      console.log('Refreshing user data...');
      const updatedUser = await authApi.getCurrentUser();
      console.log('Updated user data:', updatedUser);
      setUser(updatedUser);
      // Update localStorage with fresh user data
      const currentData = JSON.parse(localStorage.getItem('user') || '{}');
      currentData.user = updatedUser;
      localStorage.setItem('user', JSON.stringify(currentData));
      console.log('User data refreshed successfully');
      return true; // Success
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Don't logout on 401 - just return false to indicate failure
      return false;
    }
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    refreshUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

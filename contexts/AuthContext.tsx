"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'admin' | 'client';
  phone?: string;
  company?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string; errorCode?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
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
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('userData');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          const response = await fetch('/api/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`,
            },
            body: JSON.stringify({
              type: 'verify-token',
              data: {}
            })
          });
          
          if (!response.ok) {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        // Network or server error during verification - keep existing session to avoid UX loop
        console.error('Auth check failed (keeping session):', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string; errorCode?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'login',
          data: { username, password }
        })
      });

      // Check if response is ok first
      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
      }

      const result = await response.json();
      console.log('Login API Response:', result); // Debug log
      
      if (result.success && result.data && result.data.token && result.data.user) {
        const { token: authToken, user: userData } = result.data;
        
        // Store authentication data
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);
        
        return { success: true };
      } else {
        // Return detailed error with error code
        const errorCode = result.error_code || 'unknown_error';
        const errorMessage = result.error || 'Login failed';
        
        console.log('Login failed:', { errorCode, errorMessage }); // Debug log
        
        return { 
          success: false, 
          error: errorMessage,
          errorCode: errorCode
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.',
        errorCode: 'network_error'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminAuth'); // Legacy support
    localStorage.removeItem('clientAuth'); // Legacy support
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'get-user',
          data: {}
        })
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        setUser(result.data);
        localStorage.setItem('userData', JSON.stringify(result.data));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

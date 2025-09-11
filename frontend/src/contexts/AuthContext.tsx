import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, type User, type RegisterData, type AuthContextType } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('vybe_token');
      const storedUser = localStorage.getItem('vybe_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by making a request
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.user) {
              setUser(data.data.user);
              localStorage.setItem('vybe_user', JSON.stringify(data.data.user));
            }
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.error('Failed to restore auth session:', error);
          clearAuthData();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [API_BASE_URL]);

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vybe_token');
    localStorage.removeItem('vybe_user');
  };

  const saveAuthData = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('vybe_token', authToken);
    localStorage.setItem('vybe_user', JSON.stringify(userData));
  };

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.data) {
        saveAuthData(data.data.user, data.data.token);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success && data.data) {
        saveAuthData(data.data.user, data.data.token);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    
    // Optional: Call logout endpoint
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).catch(console.error);
    }
  };

  const updateProfile = async (profileData: Partial<User['profile']>): Promise<void> => {
    try {
      const data = await makeAuthenticatedRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (data.success && data.data.profile) {
        const updatedUser = { ...user!, profile: data.data.profile };
        saveAuthData(updatedUser, token!);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (!token) return;

      const data = await makeAuthenticatedRequest('/api/auth/me');

      if (data.success && data.data.user) {
        const updatedUser = data.data.user;
        setUser(updatedUser);
        localStorage.setItem('vybe_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      // If token is invalid, clear auth data
      if (error.message.includes('token') || error.message.includes('401')) {
        clearAuthData();
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

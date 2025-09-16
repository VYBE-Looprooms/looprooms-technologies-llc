import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { ApiResponse } from '@/lib/api';
import {
  login as loginRequest,
  register as registerRequest,
  AuthPayload,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '@/services/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginRequest) => Promise<ApiResponse<AuthPayload>>;
  register: (payload: RegisterRequest) => Promise<ApiResponse<AuthPayload>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'vybe.auth';

const loadStoredAuth = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isLoading: false };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { user: null, token: null, isLoading: false };
    }

    const parsed = JSON.parse(raw) as { user: AuthUser; token: string } | null;
    if (!parsed?.user || !parsed?.token) {
      return { user: null, token: null, isLoading: false };
    }

    return { user: parsed.user, token: parsed.token, isLoading: false };
  } catch (error) {
    console.warn('[VYBE] Failed to parse stored auth payload', error);
    return { user: null, token: null, isLoading: false };
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<AuthState>(() => loadStoredAuth());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!state.user || !state.token) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: state.user, token: state.token })
    );
  }, [state.user, state.token]);

  const login = async (payload: LoginRequest) => {
    const response = await loginRequest(payload);

    if (response.success && response.data) {
      setState({ user: response.data.user, token: response.data.token, isLoading: false });
    }

    return response;
  };

  const register = async (payload: RegisterRequest) => {
    const response = await registerRequest(payload);

    if (response.success && response.data) {
      setState({ user: response.data.user, token: response.data.token, isLoading: false });
    }

    return response;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setState({ user: null, token: null, isLoading: false });
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      isLoading: state.isLoading,
      login,
      register,
      logout,
    }),
    [state.user, state.token, state.isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

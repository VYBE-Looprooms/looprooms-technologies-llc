import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { ApiResponse } from '@/lib/api';
import {
  login as loginRequest,
  register as registerRequest,
  refresh as refreshRequest,
  type AuthPayload,
  type AuthUser,
  type LoginRequest,
  type RegisterRequest,
} from '@/services/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expiresAt: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginRequest) => Promise<ApiResponse<AuthPayload>>;
  register: (payload: RegisterRequest) => Promise<ApiResponse<AuthPayload>>;
  refreshSession: () => Promise<ApiResponse<AuthPayload> | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'vybe.auth';

type StoredAuth = {
  user: AuthUser;
  token: string;
  expiresAt?: string | null;
};

const toIsoString = (value?: string | Date | null): string | null => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const loadStoredAuth = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, expiresAt: null, isLoading: false };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { user: null, token: null, expiresAt: null, isLoading: false };
    }

    const parsed = JSON.parse(raw) as StoredAuth | null;
    if (!parsed?.user || !parsed?.token) {
      return { user: null, token: null, expiresAt: null, isLoading: false };
    }

    return {
      user: parsed.user,
      token: parsed.token,
      expiresAt: parsed.expiresAt ?? null,
      isLoading: false,
    };
  } catch (error) {
    console.warn('[VYBE] Failed to parse stored auth payload', error);
    return { user: null, token: null, expiresAt: null, isLoading: false };
  }
};

const persistAuth = (payload: AuthPayload | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!payload) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: payload.user,
      token: payload.token,
      expiresAt: toIsoString(payload.expiresAt),
    })
  );
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<AuthState>(() => loadStoredAuth());
  const refreshTimerRef = useRef<number | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearRefreshTimer(), [clearRefreshTimer]);

  const applyAuthPayload = useCallback((payload: AuthPayload) => {
    persistAuth(payload);
    setState({
      user: payload.user,
      token: payload.token,
      expiresAt: toIsoString(payload.expiresAt),
      isLoading: false,
    });
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await loginRequest(payload);

    if (response.success && response.data) {
      applyAuthPayload(response.data);
    }

    return response;
  }, [applyAuthPayload]);

  const register = useCallback(async (payload: RegisterRequest) => {
    const response = await registerRequest(payload);

    if (response.success && response.data) {
      applyAuthPayload(response.data);
    }

    return response;
  }, [applyAuthPayload]);

  const refreshSession = useCallback(async () => {
    if (!state.token) {
      return null;
    }

    const shouldBlockUI = !state.user;

    if (shouldBlockUI) {
      setState((previous) => ({ ...previous, isLoading: true }));
    }

    const response = await refreshRequest(state.token);

    if (response.success && response.data) {
      applyAuthPayload(response.data);
    } else {
      persistAuth(null);
      setState({ user: null, token: null, expiresAt: null, isLoading: false });
    }

    return response;
  }, [state.token, state.user, applyAuthPayload]);

  const logout = useCallback(() => {
    persistAuth(null);
    clearRefreshTimer();
    setState({ user: null, token: null, expiresAt: null, isLoading: false });
  }, [clearRefreshTimer]);

  useEffect(() => {
    clearRefreshTimer();

    if (!state.token || !state.expiresAt) {
      return;
    }

    const expiresAtMs = new Date(state.expiresAt).getTime();
    if (Number.isNaN(expiresAtMs)) {
      return;
    }

    const refreshLeadMs = 60 * 1000; // refresh one minute before expiry
    const delay = expiresAtMs - Date.now() - refreshLeadMs;

    if (delay <= 0) {
      refreshSession();
      return;
    }

    refreshTimerRef.current = window.setTimeout(() => {
      refreshSession();
    }, delay);
  }, [state.token, state.expiresAt, refreshSession, clearRefreshTimer]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      expiresAt: state.expiresAt,
      isLoading: state.isLoading,
      login,
      register,
      refreshSession,
      logout,
    }),
    [state.user, state.token, state.expiresAt, state.isLoading, login, register, refreshSession, logout]
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

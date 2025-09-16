import { apiRequest, ApiResponse } from '@/lib/api';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string | null;
}

export interface AuthPayload {
  user: AuthUser;
  token: string;
  expiresAt?: string | null;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const register = (payload: RegisterRequest): Promise<ApiResponse<AuthPayload>> => {
  return apiRequest<AuthPayload>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const login = (payload: LoginRequest): Promise<ApiResponse<AuthPayload>> => {
  return apiRequest<AuthPayload>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

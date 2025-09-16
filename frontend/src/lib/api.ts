export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(API_BASE_URL + path, {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: 'include',
    body: options.body,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || 'Something went wrong';
    const errors = payload?.errors;
    return {
      success: false,
      message,
      errors,
    };
  }

  return payload ?? { success: true, message: 'Request successful' };
}

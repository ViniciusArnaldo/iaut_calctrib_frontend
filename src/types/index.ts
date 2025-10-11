export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  tenant: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  tenantName: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

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

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  tenantName: string;
}

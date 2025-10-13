export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3010/api/v1';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CALCULADORA: '/calculadora',
  HISTORICO: '/historico',
  SUBSCRIPTIONS: '/subscriptions',
  USERS: '/users',
  FERRAMENTAS: '/ferramentas',
  CADASTROS: '/cadastros',
} as const;

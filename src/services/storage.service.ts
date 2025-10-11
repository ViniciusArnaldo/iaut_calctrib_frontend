import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  // Access Token (in-memory for security)
  private accessToken: string | null = null;

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  // Refresh Token (localStorage)
  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  clearRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // User Data
  setUser(user: unknown): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  clearUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Clear All
  clearAll(): void {
    this.clearAccessToken();
    this.clearRefreshToken();
    this.clearUser();
  }
}

export const storageService = new StorageService();

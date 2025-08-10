// TokenStorage Service - Following SOLID principles and Clean Architecture
// Single Responsibility: Manages token storage only
// Open/Closed: Extensible for new storage methods
// Liskov Substitution: Consistent storage behavior
// Interface Segregation: Specific interfaces for different storage concerns
// Dependency Inversion: Depends on storage abstractions

// Storage interface following Interface Segregation Principle
export interface ITokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  getTokenExpiry(): Date | null;
  setTokens(accessToken: string, refreshToken?: string, expiresAt?: Date): void;
  clearTokens(): void;
  hasValidToken(): boolean;
}

// Local storage implementation
export class LocalTokenStorage implements ITokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly TOKEN_EXPIRY_KEY = 'tokenExpiresAt';

  getAccessToken(): string | null {
    return localStorage.getItem(LocalTokenStorage.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(LocalTokenStorage.REFRESH_TOKEN_KEY);
  }

  getTokenExpiry(): Date | null {
    const expiry = localStorage.getItem(LocalTokenStorage.TOKEN_EXPIRY_KEY);
    return expiry ? new Date(expiry) : null;
  }

  setTokens(accessToken: string, refreshToken?: string, expiresAt?: Date): void {
    localStorage.setItem(LocalTokenStorage.ACCESS_TOKEN_KEY, accessToken);
    
    if (refreshToken) {
      localStorage.setItem(LocalTokenStorage.REFRESH_TOKEN_KEY, refreshToken);
    }
    
    if (expiresAt) {
      localStorage.setItem(LocalTokenStorage.TOKEN_EXPIRY_KEY, expiresAt.toISOString());
    } else {
      // Default expiry: 1 hour from now
      const defaultExpiry = new Date(Date.now() + 3600000);
      localStorage.setItem(LocalTokenStorage.TOKEN_EXPIRY_KEY, defaultExpiry.toISOString());
    }
  }

  clearTokens(): void {
    localStorage.removeItem(LocalTokenStorage.ACCESS_TOKEN_KEY);
    localStorage.removeItem(LocalTokenStorage.REFRESH_TOKEN_KEY);
    localStorage.removeItem(LocalTokenStorage.TOKEN_EXPIRY_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    const expiry = this.getTokenExpiry();
    
    if (!token || !expiry) {
      return false;
    }
    
    // Check if token is expired (with 5 minute buffer)
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return expiry.getTime() > (now.getTime() + bufferTime);
  }
}

// Session storage implementation (alternative)
export class SessionTokenStorage implements ITokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly TOKEN_EXPIRY_KEY = 'tokenExpiresAt';

  getAccessToken(): string | null {
    return sessionStorage.getItem(SessionTokenStorage.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(SessionTokenStorage.REFRESH_TOKEN_KEY);
  }

  getTokenExpiry(): Date | null {
    const expiry = sessionStorage.getItem(SessionTokenStorage.TOKEN_EXPIRY_KEY);
    return expiry ? new Date(expiry) : null;
  }

  setTokens(accessToken: string, refreshToken?: string, expiresAt?: Date): void {
    sessionStorage.setItem(SessionTokenStorage.ACCESS_TOKEN_KEY, accessToken);
    
    if (refreshToken) {
      sessionStorage.setItem(SessionTokenStorage.REFRESH_TOKEN_KEY, refreshToken);
    }
    
    if (expiresAt) {
      sessionStorage.setItem(SessionTokenStorage.TOKEN_EXPIRY_KEY, expiresAt.toISOString());
    } else {
      // Default expiry: 1 hour from now
      const defaultExpiry = new Date(Date.now() + 3600000);
      sessionStorage.setItem(SessionTokenStorage.TOKEN_EXPIRY_KEY, defaultExpiry.toISOString());
    }
  }

  clearTokens(): void {
    sessionStorage.removeItem(SessionTokenStorage.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(SessionTokenStorage.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(SessionTokenStorage.TOKEN_EXPIRY_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    const expiry = this.getTokenExpiry();
    
    if (!token || !expiry) {
      return false;
    }
    
    // Check if token is expired (with 5 minute buffer)
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return expiry.getTime() > (now.getTime() + bufferTime);
  }
}

// Factory for creating storage instances
export class TokenStorageFactory {
  static createLocalStorage(): ITokenStorage {
    return new LocalTokenStorage();
  }

  static createSessionStorage(): ITokenStorage {
    return new SessionTokenStorage();
  }

  // Can be extended for other storage methods (IndexedDB, cookies, etc.)
  static createSecureStorage(): ITokenStorage {
    // TODO: Implement secure storage (encrypted localStorage, etc.)
    return new LocalTokenStorage();
  }
}

// Default export for convenience
export const tokenStorage = TokenStorageFactory.createLocalStorage();

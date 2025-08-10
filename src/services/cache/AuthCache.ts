// AuthCache Service - Following SOLID principles and Clean Architecture
// Single Responsibility: Manages authentication cache only
// Open/Closed: Extensible for new cache strategies
// Liskov Substitution: Consistent cache behavior
// Interface Segregation: Specific interfaces for different cache concerns
// Dependency Inversion: Depends on cache abstractions

// Cache interface following Interface Segregation Principle
export interface IAuthCache {
  getUser(): any | null;
  setUser(user: any): void;
  clearUser(): void;
  hasUser(): boolean;
  getUserRole(): string | null;
  isUserAdmin(): boolean;
  isUserStaff(): boolean;
}

// Memory cache implementation
export class MemoryAuthCache implements IAuthCache {
  private user: any = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  getUser(): any | null {
    if (this.isExpired()) {
      this.clearUser();
      return null;
    }
    return this.user;
  }

  setUser(user: any): void {
    this.user = user;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
  }

  clearUser(): void {
    this.user = null;
    this.cacheExpiry = 0;
  }

  hasUser(): boolean {
    return this.user !== null && !this.isExpired();
  }

  getUserRole(): string | null {
    return this.user?.role || null;
  }

  isUserAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isUserStaff(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN' || role === 'STAFF';
  }

  private isExpired(): boolean {
    return Date.now() > this.cacheExpiry;
  }
}

// Local storage cache implementation
export class LocalStorageAuthCache implements IAuthCache {
  private static readonly USER_KEY = 'cachedUser';
  private static readonly CACHE_EXPIRY_KEY = 'userCacheExpiry';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  getUser(): any | null {
    try {
      const userData = localStorage.getItem(LocalStorageAuthCache.USER_KEY);
      const expiry = localStorage.getItem(LocalStorageAuthCache.CACHE_EXPIRY_KEY);
      
      if (!userData || !expiry) {
        return null;
      }

      if (Date.now() > parseInt(expiry)) {
        this.clearUser();
        return null;
      }

      return JSON.parse(userData);
    } catch (error) {
      console.error('Error reading user from cache:', error);
      this.clearUser();
      return null;
    }
  }

  setUser(user: any): void {
    try {
      const expiry = Date.now() + this.CACHE_DURATION;
      localStorage.setItem(LocalStorageAuthCache.USER_KEY, JSON.stringify(user));
      localStorage.setItem(LocalStorageAuthCache.CACHE_EXPIRY_KEY, expiry.toString());
    } catch (error) {
      console.error('Error setting user in cache:', error);
    }
  }

  clearUser(): void {
    try {
      localStorage.removeItem(LocalStorageAuthCache.USER_KEY);
      localStorage.removeItem(LocalStorageAuthCache.CACHE_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing user from cache:', error);
    }
  }

  hasUser(): boolean {
    return this.getUser() !== null;
  }

  getUserRole(): string | null {
    return this.getUser()?.role || null;
  }

  isUserAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isUserStaff(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN' || role === 'STAFF';
  }
}

// Factory for creating cache instances
export class AuthCacheFactory {
  static createMemoryCache(): IAuthCache {
    return new MemoryAuthCache();
  }

  static createLocalStorageCache(): IAuthCache {
    return new LocalStorageAuthCache();
  }

  // Can be extended for other cache methods (Redis, etc.)
  static createPersistentCache(): IAuthCache {
    return new LocalStorageAuthCache();
  }
}

// Default export for convenience
export const authCache = AuthCacheFactory.createLocalStorageCache();

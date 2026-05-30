import {
  MemoryAuthCache,
  LocalStorageAuthCache,
  AuthCacheFactory,
  authCache,
} from '../AuthCache';
import type { IAuthUser } from '@/types/auth';

const makeUser = (role = 'customer'): IAuthUser => ({
  id: 'u-1',
  email: 'test@example.com',
  role,
  isActive: true,
  emailVerified: true,
  lastLoginAt: null,
  profile: {
    id: 'p-1',
    firstName: 'Juan',
    lastName: 'García',
    phone: null,
    dateOfBirth: null,
    avatar: null,
  },
});

describe('MemoryAuthCache', () => {
  let cache: MemoryAuthCache;

  beforeEach(() => {
    cache = new MemoryAuthCache();
  });

  it('getUser returns null when no user set', () => {
    expect(cache.getUser()).toBeNull();
  });

  it('setUser / getUser stores and retrieves user', () => {
    const user = makeUser();
    cache.setUser(user);
    expect(cache.getUser()).toEqual(user);
  });

  it('clearUser removes stored user', () => {
    cache.setUser(makeUser());
    cache.clearUser();
    expect(cache.getUser()).toBeNull();
  });

  it('hasUser returns false when empty', () => {
    expect(cache.hasUser()).toBe(false);
  });

  it('hasUser returns true after setUser', () => {
    cache.setUser(makeUser());
    expect(cache.hasUser()).toBe(true);
  });

  it('hasUser returns false after clearUser', () => {
    cache.setUser(makeUser());
    cache.clearUser();
    expect(cache.hasUser()).toBe(false);
  });

  it('getUserRole returns null when no user', () => {
    expect(cache.getUserRole()).toBeNull();
  });

  it('getUserRole returns role when user set', () => {
    cache.setUser(makeUser('ADMIN'));
    expect(cache.getUserRole()).toBe('ADMIN');
  });

  it('isUserAdmin returns true for ADMIN role', () => {
    cache.setUser(makeUser('ADMIN'));
    expect(cache.isUserAdmin()).toBe(true);
  });

  it('isUserAdmin returns false for non-ADMIN role', () => {
    cache.setUser(makeUser('customer'));
    expect(cache.isUserAdmin()).toBe(false);
  });

  it('isUserStaff returns true for ADMIN role', () => {
    cache.setUser(makeUser('ADMIN'));
    expect(cache.isUserStaff()).toBe(true);
  });

  it('isUserStaff returns true for STAFF role', () => {
    cache.setUser(makeUser('STAFF'));
    expect(cache.isUserStaff()).toBe(true);
  });

  it('isUserStaff returns false for customer role', () => {
    cache.setUser(makeUser('customer'));
    expect(cache.isUserStaff()).toBe(false);
  });

  it('expires after cache duration (fake timers)', () => {
    vi.useFakeTimers();
    cache.setUser(makeUser());
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    expect(cache.getUser()).toBeNull();
    expect(cache.hasUser()).toBe(false);
    vi.useRealTimers();
  });
});

describe('LocalStorageAuthCache', () => {
  const localMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localMock, writable: true });
    vi.clearAllMocks();
  });

  let cache: LocalStorageAuthCache;
  beforeEach(() => { cache = new LocalStorageAuthCache(); });

  it('getUser returns null when nothing stored', () => {
    localMock.getItem.mockReturnValue(null);
    expect(cache.getUser()).toBeNull();
  });

  it('getUser returns null when expired', () => {
    const user = makeUser();
    const pastExpiry = (Date.now() - 1000).toString();
    localMock.getItem.mockImplementation((key: string) => {
      if (key === 'cachedUser') return JSON.stringify(user);
      if (key === 'userCacheExpiry') return pastExpiry;
      return null;
    });
    expect(cache.getUser()).toBeNull();
  });

  it('getUser returns user when valid', () => {
    const user = makeUser();
    const futureExpiry = (Date.now() + 300_000).toString();
    localMock.getItem.mockImplementation((key: string) => {
      if (key === 'cachedUser') return JSON.stringify(user);
      if (key === 'userCacheExpiry') return futureExpiry;
      return null;
    });
    expect(cache.getUser()).toEqual(user);
  });

  it('setUser stores serialized user and expiry', () => {
    const user = makeUser();
    cache.setUser(user);
    expect(localMock.setItem).toHaveBeenCalledWith('cachedUser', JSON.stringify(user));
    expect(localMock.setItem).toHaveBeenCalledWith('userCacheExpiry', expect.any(String));
  });

  it('clearUser removes both keys', () => {
    cache.clearUser();
    expect(localMock.removeItem).toHaveBeenCalledWith('cachedUser');
    expect(localMock.removeItem).toHaveBeenCalledWith('userCacheExpiry');
  });

  it('isUserAdmin returns true for ADMIN', () => {
    const user = makeUser('ADMIN');
    const futureExpiry = (Date.now() + 300_000).toString();
    localMock.getItem.mockImplementation((key: string) => {
      if (key === 'cachedUser') return JSON.stringify(user);
      if (key === 'userCacheExpiry') return futureExpiry;
      return null;
    });
    expect(cache.isUserAdmin()).toBe(true);
  });

  it('handles localStorage.getItem throwing', () => {
    localMock.getItem.mockImplementation(() => { throw new Error('QuotaExceeded'); });
    expect(cache.getUser()).toBeNull();
  });
});

describe('AuthCacheFactory', () => {
  it('createMemoryCache returns MemoryAuthCache', () => {
    expect(AuthCacheFactory.createMemoryCache()).toBeInstanceOf(MemoryAuthCache);
  });

  it('createLocalStorageCache returns LocalStorageAuthCache', () => {
    expect(AuthCacheFactory.createLocalStorageCache()).toBeInstanceOf(LocalStorageAuthCache);
  });

  it('createPersistentCache returns LocalStorageAuthCache', () => {
    expect(AuthCacheFactory.createPersistentCache()).toBeInstanceOf(LocalStorageAuthCache);
  });
});

describe('authCache default export', () => {
  it('is a LocalStorageAuthCache instance', () => {
    expect(authCache).toBeInstanceOf(LocalStorageAuthCache);
  });
});

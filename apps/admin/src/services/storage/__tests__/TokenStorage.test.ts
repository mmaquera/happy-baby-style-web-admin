import {
  LocalTokenStorage,
  SessionTokenStorage,
  TokenStorageFactory,
  tokenStorage,
} from '../TokenStorage';

const localMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
const sessionMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionMock });

describe('LocalTokenStorage', () => {
  let storage: LocalTokenStorage;

  beforeEach(() => {
    storage = new LocalTokenStorage();
    vi.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('returns value from localStorage', () => {
      localMock.getItem.mockReturnValue('my-token');
      expect(storage.getAccessToken()).toBe('my-token');
      expect(localMock.getItem).toHaveBeenCalledWith('accessToken');
    });

    it('returns null when not set', () => {
      localMock.getItem.mockReturnValue(null);
      expect(storage.getAccessToken()).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('returns refresh token from localStorage', () => {
      localMock.getItem.mockReturnValue('refresh-token');
      expect(storage.getRefreshToken()).toBe('refresh-token');
      expect(localMock.getItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('getTokenExpiry', () => {
    it('returns Date when expiry is stored', () => {
      const iso = '2026-01-01T00:00:00.000Z';
      localMock.getItem.mockReturnValue(iso);
      const result = storage.getTokenExpiry();
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe(iso);
    });

    it('returns null when no expiry stored', () => {
      localMock.getItem.mockReturnValue(null);
      expect(storage.getTokenExpiry()).toBeNull();
    });
  });

  describe('setTokens', () => {
    it('stores access token', () => {
      storage.setTokens('access-123');
      expect(localMock.setItem).toHaveBeenCalledWith(
        'accessToken',
        'access-123'
      );
    });

    it('stores refresh token when provided', () => {
      storage.setTokens('access-123', 'refresh-456');
      expect(localMock.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-456'
      );
    });

    it('does not store refresh token when not provided', () => {
      storage.setTokens('access-123');
      const calls = localMock.setItem.mock.calls.map((c: string[]) => c[0]);
      expect(calls).not.toContain('refreshToken');
    });

    it('stores provided expiresAt', () => {
      const expiry = new Date('2026-12-31T00:00:00.000Z');
      storage.setTokens('access-123', undefined, expiry);
      expect(localMock.setItem).toHaveBeenCalledWith(
        'tokenExpiresAt',
        expiry.toISOString()
      );
    });

    it('stores default 1-hour expiry when none provided', () => {
      const before = Date.now();
      storage.setTokens('access-123');
      const after = Date.now();

      const storedISO = localMock.setItem.mock.calls.find(
        (c: string[]) => c[0] === 'tokenExpiresAt'
      )?.[1];
      const stored = new Date(storedISO).getTime();
      expect(stored).toBeGreaterThanOrEqual(before + 3600000);
      expect(stored).toBeLessThanOrEqual(after + 3600000);
    });
  });

  describe('clearTokens', () => {
    it('removes all three token keys', () => {
      storage.clearTokens();
      expect(localMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localMock.removeItem).toHaveBeenCalledWith('tokenExpiresAt');
    });
  });

  describe('hasValidToken', () => {
    it('returns false when no access token', () => {
      localMock.getItem.mockReturnValue(null);
      expect(storage.hasValidToken()).toBe(false);
    });

    it('returns false when no expiry', () => {
      localMock.getItem.mockImplementation((key: string) =>
        key === 'accessToken' ? 'token' : null
      );
      expect(storage.hasValidToken()).toBe(false);
    });

    it('returns true for unexpired token (> 5 min buffer)', () => {
      const futureExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      localMock.getItem.mockImplementation((key: string) => {
        if (key === 'accessToken') return 'token';
        if (key === 'tokenExpiresAt') return futureExpiry;
        return null;
      });
      expect(storage.hasValidToken()).toBe(true);
    });

    it('returns false for token expiring within 5 min buffer', () => {
      const soonExpiry = new Date(Date.now() + 2 * 60 * 1000).toISOString();
      localMock.getItem.mockImplementation((key: string) => {
        if (key === 'accessToken') return 'token';
        if (key === 'tokenExpiresAt') return soonExpiry;
        return null;
      });
      expect(storage.hasValidToken()).toBe(false);
    });

    it('returns false for expired token', () => {
      const pastExpiry = new Date(Date.now() - 1000).toISOString();
      localMock.getItem.mockImplementation((key: string) => {
        if (key === 'accessToken') return 'token';
        if (key === 'tokenExpiresAt') return pastExpiry;
        return null;
      });
      expect(storage.hasValidToken()).toBe(false);
    });
  });
});

describe('SessionTokenStorage', () => {
  let storage: SessionTokenStorage;

  beforeEach(() => {
    storage = new SessionTokenStorage();
    vi.clearAllMocks();
  });

  it('getAccessToken uses sessionStorage', () => {
    sessionMock.getItem.mockReturnValue('sess-token');
    expect(storage.getAccessToken()).toBe('sess-token');
    expect(sessionMock.getItem).toHaveBeenCalledWith('accessToken');
  });

  it('setTokens writes to sessionStorage', () => {
    storage.setTokens('token-abc');
    expect(sessionMock.setItem).toHaveBeenCalledWith(
      'accessToken',
      'token-abc'
    );
  });

  it('clearTokens removes from sessionStorage', () => {
    storage.clearTokens();
    expect(sessionMock.removeItem).toHaveBeenCalledWith('accessToken');
    expect(sessionMock.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(sessionMock.removeItem).toHaveBeenCalledWith('tokenExpiresAt');
  });

  it('hasValidToken returns false when no token', () => {
    sessionMock.getItem.mockReturnValue(null);
    expect(storage.hasValidToken()).toBe(false);
  });
});

describe('TokenStorageFactory', () => {
  it('createLocalStorage returns a LocalTokenStorage', () => {
    const s = TokenStorageFactory.createLocalStorage();
    expect(s).toBeInstanceOf(LocalTokenStorage);
  });

  it('createSessionStorage returns a SessionTokenStorage', () => {
    const s = TokenStorageFactory.createSessionStorage();
    expect(s).toBeInstanceOf(SessionTokenStorage);
  });

  it('createSecureStorage returns LocalTokenStorage (pending backend migration)', () => {
    const s = TokenStorageFactory.createSecureStorage();
    expect(s).toBeInstanceOf(LocalTokenStorage);
  });
});

describe('tokenStorage default export', () => {
  it('is a LocalTokenStorage instance', () => {
    expect(tokenStorage).toBeInstanceOf(LocalTokenStorage);
  });
});

import { clearAuthTokens, resetAuthState } from '../authUtils';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

describe('clearAuthTokens', () => {
  beforeEach(() => vi.clearAllMocks());

  it('removes accessToken from localStorage', () => {
    clearAuthTokens();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
  });

  it('removes refreshToken from localStorage', () => {
    clearAuthTokens();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
  });

  it('removes tokenExpiresAt from localStorage', () => {
    clearAuthTokens();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('tokenExpiresAt');
  });

  it('removes authState from sessionStorage', () => {
    clearAuthTokens();
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('authState');
  });

  it('calls removeItem exactly 3 times on localStorage', () => {
    clearAuthTokens();
    expect(localStorageMock.removeItem).toHaveBeenCalledTimes(3);
  });
});

describe('resetAuthState', () => {
  beforeEach(() => vi.clearAllMocks());

  it('clears auth tokens', () => {
    resetAuthState();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
  });

  it('redirects to /login when not already there', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/products', href: '' },
      writable: true,
    });

    resetAuthState();

    expect(window.location.href).toBe('/login');
  });

  it('does not redirect when already on /login', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/login', href: '' },
      writable: true,
    });

    resetAuthState();

    expect(window.location.href).toBe('');
  });
});

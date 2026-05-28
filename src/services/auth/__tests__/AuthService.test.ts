import { ApolloClient, InMemoryCache } from '@apollo/client';
import {
  AuthServiceFactory,
  GraphQLAuthService,
  LoginCredentials,
  AuthError,
} from '../AuthService';
import { UserRole } from '../../../types/unified';

// Mock Apollo Client
const mockApolloClient = {
  query: vi.fn(),
  mutate: vi.fn(),
  watchQuery: vi.fn(),
  subscribe: vi.fn(),
  readQuery: vi.fn(),
  readFragment: vi.fn(),
  writeQuery: vi.fn(),
  writeFragment: vi.fn(),
  resetStore: vi.fn(),
  clearStore: vi.fn(),
  onClearStore: vi.fn(),
  onResetStore: vi.fn(),
  cache: new InMemoryCache(),
} as unknown as ApolloClient<unknown>;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthService', () => {
  let authService: GraphQLAuthService;

  beforeEach(() => {
    authService = new GraphQLAuthService(mockApolloClient);
    vi.clearAllMocks();
  });

  describe('GraphQLAuthService', () => {
    describe('login', () => {
      it('should successfully login with valid credentials', async () => {
        const credentials: LoginCredentials = {
          email: 'test@example.com',
          password: 'password123',
        };

        const mockResponse = {
          data: {
            login: {
              success: true,
              user: {
                id: '1',
                email: 'test@example.com',
                role: UserRole.ADMIN,
                isActive: true,
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              tokens: {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                expiresAt: new Date(Date.now() + 3600000),
              },
              message: 'Login successful',
            },
          },
        };

        vi.mocked(mockApolloClient.mutate).mockResolvedValue(mockResponse);

        const result = await authService.login(credentials);

        expect(result.success).toBe(true);
        expect(result.tokens.accessToken).toBe('access-token');
        expect(result.tokens.refreshToken).toBe('refresh-token');
        expect(result.user).toEqual(mockResponse.data.login.user);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'accessToken',
          'access-token'
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'refreshToken',
          'refresh-token'
        );
      });

      it('should throw AuthError when login fails', async () => {
        const credentials: LoginCredentials = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };

        vi.mocked(mockApolloClient.mutate).mockRejectedValue(
          new Error('Invalid credentials')
        );

        await expect(authService.login(credentials)).rejects.toThrow(
          'Invalid credentials'
        );
      });

      it('should throw AuthError on network error', async () => {
        const credentials: LoginCredentials = {
          email: 'test@example.com',
          password: 'password123',
        };

        vi.mocked(mockApolloClient.mutate).mockRejectedValue(
          new Error('Network error')
        );

        await expect(authService.login(credentials)).rejects.toThrow(
          'Network error'
        );
      });
    });

    describe('logout', () => {
      it('should successfully logout', async () => {
        vi.mocked(mockApolloClient.mutate).mockResolvedValue({
          data: { logout: true },
        });

        await authService.logout();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(
          'refreshToken'
        );
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(
          'tokenExpiresAt'
        );
      });

      it('should clear tokens even if server logout fails', async () => {
        vi.mocked(mockApolloClient.mutate).mockRejectedValue(
          new Error('Server error')
        );

        await authService.logout();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(
          'refreshToken'
        );
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(
          'tokenExpiresAt'
        );
      });
    });

    describe('refreshToken', () => {
      it('should successfully refresh token', async () => {
        const mockResponse = {
          data: {
            refreshToken: {
              accessToken: 'new-access-token',
              refreshToken: 'new-refresh-token',
              expiresAt: new Date(Date.now() + 3600000),
            },
          },
        };

        vi.mocked(mockApolloClient.mutate).mockResolvedValue(mockResponse);

        const result = await authService.refreshToken('old-refresh-token');

        expect(result.accessToken).toBe('new-access-token');
        expect(result.refreshToken).toBe('new-refresh-token');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'accessToken',
          'new-access-token'
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'refreshToken',
          'new-refresh-token'
        );
      });

      it('should throw AuthError when refresh fails', async () => {
        vi.mocked(mockApolloClient.mutate).mockResolvedValue({
          data: { refreshToken: null },
          errors: [{ message: 'Invalid refresh token' }],
        });

        await expect(authService.refreshToken('invalid-token')).rejects.toThrow(
          'Invalid refresh token'
        );
      });
    });

    describe('getCurrentUser', () => {
      it('should return current user when authenticated', async () => {
        const mockUser = {
          id: '1',
          email: 'test@example.com',
          role: UserRole.ADMIN,
          isActive: true,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        localStorageMock.getItem.mockReturnValue('valid-token');

        vi.mocked(mockApolloClient.query).mockResolvedValue({
          data: { me: mockUser },
        });

        const result = await authService.getCurrentUser();

        expect(result).toEqual(mockUser);
      });

      it('should return null when no token exists', async () => {
        localStorageMock.getItem.mockReturnValue(null);

        const result = await authService.getCurrentUser();

        expect(result).toBeNull();
      });

      it('should return null when token is expired', async () => {
        localStorageMock.getItem.mockReturnValue('expired-token');

        vi.mocked(mockApolloClient.query).mockRejectedValue(
          new Error('Token expired')
        );

        const result = await authService.getCurrentUser();

        expect(result).toBeNull();
      });

      it('should return null when query fails', async () => {
        localStorageMock.getItem.mockReturnValue('valid-token');

        vi.mocked(mockApolloClient.query).mockRejectedValue(
          new Error('Query failed')
        );

        const result = await authService.getCurrentUser();

        expect(result).toBeNull();
      });
    });

    describe('isAuthenticated', () => {
      it('should return true when valid token exists', () => {
        localStorageMock.getItem.mockReturnValue('valid-token');

        const result = authService.isAuthenticated();

        expect(result).toBe(true);
      });

      it('should return false when no token exists', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const result = authService.isAuthenticated();

        expect(result).toBe(false);
      });

      it('should return false when token is expired', () => {
        localStorageMock.getItem.mockReturnValue('expired-token');

        const result = authService.isAuthenticated();

        expect(result).toBe(false);
      });
    });
  });

  describe('AuthError', () => {
    it('should create AuthError with correct properties', () => {
      const error = new AuthError('TEST_ERROR', 'Test error message', {
        detail: 'test',
      });

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test error message');
      expect(error.details).toEqual({ detail: 'test' });
      expect(error.name).toBe('AuthError');
    });
  });

  describe('AuthServiceFactory', () => {
    it('should create GraphQLAuthService instance', () => {
      const service =
        AuthServiceFactory.createGraphQLAuthService(mockApolloClient);

      expect(service).toBeInstanceOf(GraphQLAuthService);
    });
  });
});

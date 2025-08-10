// AuthService Tests - Following testing best practices
// Tests the authentication service functionality

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { AuthServiceFactory, GraphQLAuthService, LoginCredentials, AuthError } from '../AuthService';
import { UserRole } from '../../../types/unified';

// Mock Apollo Client
const mockApolloClient = {
  query: jest.fn(),
  mutate: jest.fn(),
  watchQuery: jest.fn(),
  subscribe: jest.fn(),
  readQuery: jest.fn(),
  readFragment: jest.fn(),
  writeQuery: jest.fn(),
  writeFragment: jest.fn(),
  resetStore: jest.fn(),
  clearStore: jest.fn(),
  onClearStore: jest.fn(),
  onResetStore: jest.fn(),
  cache: new InMemoryCache(),
} as unknown as ApolloClient<any>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthService', () => {
  let authService: GraphQLAuthService;

  beforeEach(() => {
    authService = new GraphQLAuthService(mockApolloClient);
    jest.clearAllMocks();
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

        (mockApolloClient.mutate as jest.Mock).mockResolvedValue(mockResponse);

        const result = await authService.login(credentials);

        expect(result.success).toBe(true);
        expect(result.tokens.accessToken).toBe('access-token');
        expect(result.tokens.refreshToken).toBe('refresh-token');
        expect(result.user).toEqual(mockResponse.data.login.user);
        expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'access-token');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token');
      });

      it('should throw AuthError when login fails', async () => {
        const credentials: LoginCredentials = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };

        (mockApolloClient.mutate as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
      });

      it('should throw AuthError on network error', async () => {
        const credentials: LoginCredentials = {
          email: 'test@example.com',
          password: 'password123',
        };

        (mockApolloClient.mutate as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(authService.login(credentials)).rejects.toThrow('Network error');
      });
    });

    describe('logout', () => {
      it('should successfully logout', async () => {
        (mockApolloClient.mutate as jest.Mock).mockResolvedValue({ data: { logout: true } });

        await authService.logout();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('tokenExpiresAt');
      });

      it('should clear tokens even if server logout fails', async () => {
        (mockApolloClient.mutate as jest.Mock).mockRejectedValue(new Error('Server error'));

        await authService.logout();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('tokenExpiresAt');
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

        (mockApolloClient.mutate as jest.Mock).mockResolvedValue(mockResponse);

        const result = await authService.refreshToken('old-refresh-token');

        expect(result.accessToken).toBe('new-access-token');
        expect(result.refreshToken).toBe('new-refresh-token');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
      });

      it('should throw AuthError when refresh fails', async () => {
        (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
          data: { refreshToken: null },
          errors: [{ message: 'Invalid refresh token' }],
        });

        await expect(authService.refreshToken('invalid-token')).rejects.toThrow('Invalid refresh token');
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

        (mockApolloClient.query as jest.Mock).mockResolvedValue({
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
        const expiredToken = 'expired-token';
        localStorageMock.getItem.mockReturnValue(expiredToken);

        (mockApolloClient.query as jest.Mock).mockRejectedValue(new Error('Token expired'));

        const result = await authService.getCurrentUser();

        expect(result).toBeNull();
      });

      it('should return null when query fails', async () => {
        localStorageMock.getItem.mockReturnValue('valid-token');

        (mockApolloClient.query as jest.Mock).mockRejectedValue(new Error('Query failed'));

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
        const expiredToken = 'expired-token';
        localStorageMock.getItem.mockReturnValue(expiredToken);

        const result = authService.isAuthenticated();

        expect(result).toBe(false);
      });
    });
  });

  describe('AuthError', () => {
    it('should create AuthError with correct properties', () => {
      const error = new AuthError('TEST_ERROR', 'Test error message', { detail: 'test' });

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test error message');
      expect(error.details).toEqual({ detail: 'test' });
      expect(error.name).toBe('AuthError');
    });
  });

  describe('AuthServiceFactory', () => {
    it('should create GraphQLAuthService instance', () => {
      const service = AuthServiceFactory.createGraphQLAuthService(mockApolloClient);

      expect(service).toBeInstanceOf(GraphQLAuthService);
    });
  });
});

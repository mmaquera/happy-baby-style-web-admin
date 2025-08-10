import { useState } from 'react';
import { User, UserRole, AuthProvider } from '@/types/unified';

// Datos mock para demostración
const mockUsers: User[] = [
  {
    id: '1',
    email: 'juan.perez@gmail.com',
    role: UserRole.CUSTOMER,
    isActive: true,
    emailVerified: true,
    lastLoginAt: '2024-01-08T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T10:30:00Z',
    profile: {
      id: '1',
      userId: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+34 600 123 456',
      birthDate: '1985-06-15T00:00:00Z',
      avatarUrl: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    accounts: [
      {
        id: 'acc1',
        userId: '1',
        provider: AuthProvider.GOOGLE,
        providerAccountId: 'google_12345',
        accessToken: 'ya29.validtoken',
        refreshToken: 'refresh_token_valid',
        tokenType: 'Bearer',
        scope: 'openid email profile',
        idToken: 'id_token_valid',
        expiresAt: Date.now() + 3600000, // 1 hour from now
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T10:30:00Z'
      }
    ],
    sessions: [
      {
        id: 'sess1',
        userId: '1',
        sessionToken: 'session_token_valid',
        expiresAt: '2024-01-15T10:30:00Z',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        ipAddress: '192.168.1.100',
        isActive: true,
        accessToken: 'access_token_valid',
        refreshToken: 'refresh_token_valid',
        createdAt: '2024-01-08T10:30:00Z',
        updatedAt: '2024-01-08T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    email: 'maria.garcia@hotmail.com',
    role: UserRole.CUSTOMER,
    isActive: true,
    emailVerified: true,
    lastLoginAt: '2024-01-07T15:20:00Z',
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-07T15:20:00Z',
    profile: {
      id: '2',
      userId: '2',
      firstName: 'María',
      lastName: 'García',
      phone: '+34 655 987 654',
      birthDate: '1990-03-22T00:00:00Z',
      avatarUrl: undefined,
      createdAt: '2023-12-15T00:00:00Z',
      updatedAt: '2023-12-15T00:00:00Z'
    },
    accounts: [
      {
        id: 'acc2',
        userId: '2',
        provider: AuthProvider.EMAIL,
        providerAccountId: 'email_maria',
        accessToken: undefined,
        refreshToken: undefined,
        tokenType: undefined,
        scope: undefined,
        idToken: undefined,
        expiresAt: undefined,
        createdAt: '2023-12-15T00:00:00Z',
        updatedAt: '2023-12-15T00:00:00Z'
      }
    ],
    sessions: [
      {
        id: 'sess2',
        userId: '2',
        sessionToken: 'session_token_maria',
        expiresAt: '2024-01-14T15:20:00Z',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        ipAddress: '192.168.1.101',
        isActive: true,
        accessToken: 'access_token_maria',
        refreshToken: 'refresh_token_maria',
        createdAt: '2024-01-07T15:20:00Z',
        updatedAt: '2024-01-07T15:20:00Z'
      }
    ]
  },
  {
    id: '3',
    email: 'admin@happybaby.com',
    role: UserRole.ADMIN,
    isActive: true,
    emailVerified: true,
    lastLoginAt: '2024-01-08T09:00:00Z',
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2024-01-08T09:00:00Z',
    profile: {
      id: '3',
      userId: '3',
      firstName: 'Admin',
      lastName: 'Sistema',
      phone: '+34 600 000 000',
      birthDate: undefined,
      avatarUrl: undefined,
      createdAt: '2023-11-01T00:00:00Z',
      updatedAt: '2023-11-01T00:00:00Z'
    },
    accounts: [
      {
        id: 'acc3',
        userId: '3',
        provider: AuthProvider.EMAIL,
        providerAccountId: 'email_admin',
        accessToken: undefined,
        refreshToken: undefined,
        tokenType: undefined,
        scope: undefined,
        idToken: undefined,
        expiresAt: undefined,
        createdAt: '2023-11-01T00:00:00Z',
        updatedAt: '2023-11-01T00:00:00Z'
      }
    ],
    sessions: [
      {
        id: 'sess3',
        userId: '3',
        sessionToken: 'session_token_admin',
        expiresAt: '2024-01-15T09:00:00Z',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ipAddress: '192.168.1.102',
        isActive: true,
        accessToken: 'access_token_admin',
        refreshToken: 'refresh_token_admin',
        createdAt: '2024-01-08T09:00:00Z',
        updatedAt: '2024-01-08T09:00:00Z'
      }
    ]
  },
  {
    id: '4',
    email: 'carlos.rodriguez@yahoo.com',
    role: UserRole.STAFF,
    isActive: false,
    emailVerified: true,
    lastLoginAt: '2024-01-05T12:00:00Z',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
    profile: {
      id: '4',
      userId: '4',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      phone: '+34 644 555 333',
      birthDate: '1978-11-10T00:00:00Z',
      avatarUrl: undefined,
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z'
    },
    accounts: [
      {
        id: 'acc4',
        userId: '4',
        provider: AuthProvider.GOOGLE,
        providerAccountId: 'google_54321',
        accessToken: 'ya29.expiredtoken',
        refreshToken: 'refresh_expired',
        tokenType: 'Bearer',
        scope: 'openid email profile',
        idToken: 'id_token_expired',
        expiresAt: Date.now() - 3600000, // Expired token
        createdAt: '2023-12-01T00:00:00Z',
        updatedAt: '2024-01-05T12:00:00Z'
      }
    ],
    sessions: [
      {
        id: 'sess4',
        userId: '4',
        sessionToken: 'session_token_expired',
        expiresAt: '2024-01-12T12:00:00Z',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
        ipAddress: '192.168.1.103',
        isActive: false,
        accessToken: 'access_token_expired',
        refreshToken: 'refresh_token_expired',
        createdAt: '2024-01-05T12:00:00Z',
        updatedAt: '2024-01-06T00:00:00Z'
      }
    ]
  }
];

const mockAuthProviderStats = {
  totalUsers: 4,
  activeSessionsCount: 3,
  usersByProvider: [
    {
      provider: AuthProvider.GOOGLE,
      count: 2,
      percentage: 50.0
    },
    {
      provider: AuthProvider.EMAIL,
      count: 2,
      percentage: 50.0
    }
  ],
  recentLogins: [
    {
      userId: '1',
      email: 'juan.perez@gmail.com',
      provider: AuthProvider.GOOGLE,
      loginAt: '2024-01-08T10:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0 Desktop'
    },
    {
      userId: '3',
      email: 'admin@happybabystyle.com',
      provider: AuthProvider.EMAIL,
      loginAt: '2024-01-08T09:00:00Z',
      ipAddress: '10.0.0.50',
      userAgent: 'Chrome/120.0.0.0 Desktop'
    },
    {
      userId: '2',
      email: 'maria.garcia@hotmail.com',
      provider: AuthProvider.EMAIL,
      loginAt: '2024-01-07T15:20:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Safari/17.0 iPhone'
    }
  ]
};

export const useMockUsers = () => {
  const [users] = useState<User[]>(mockUsers);
  const [loading] = useState(false);
  const [error] = useState(null);

  return {
    users,
    loading,
    error
  };
};

export const useMockUserStats = () => {
  return {
    stats: mockAuthProviderStats,
    loading: false,
    error: null
  };
};

export const useMockUserSessions = (userId: string) => {
  const user = mockUsers.find(u => u.id === userId);
  return {
    sessions: user?.sessions || [],
    loading: false,
    error: null,
    refetch: () => {}
  };
};

export const useMockAuthProviderStats = () => {
  return {
    stats: mockAuthProviderStats,
    loading: false,
    error: null,
    refetch: () => {}
  };
};

export const useMockUsersByProvider = (provider: AuthProvider) => {
  const filteredUsers = mockUsers.filter(user => 
    user.accounts?.some(account => account.provider === provider)
  );
  
  return {
    users: filteredUsers,
    loading: false,
    error: null,
    refetch: () => {}
  };
};
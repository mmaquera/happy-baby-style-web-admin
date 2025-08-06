import { useState, useEffect } from 'react';
import { User, UserRole, AuthProvider, UserAccount, UserSession } from '@/types';

// Datos mock para demostración
const mockUsers: User[] = [
  {
    id: '1',
    email: 'juan.perez@gmail.com',
    role: UserRole.CUSTOMER,
    isActive: true,
    emailVerified: true,
    lastLoginAt: new Date('2024-01-08T10:30:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-08T10:30:00Z'),
    profile: {
      id: '1',
      userId: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      fullName: 'Juan Pérez',
      phone: '+34 600 123 456',
      birthDate: new Date('1985-06-15'),
      avatarUrl: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    },
    accounts: [
      {
        id: 'acc1',
        userId: '1',
        provider: AuthProvider.GOOGLE,
        providerAccountId: 'google_12345',
        accessToken: 'ya29.mocktoken',
        refreshToken: 'refresh_mock',
        tokenType: 'Bearer',
        scope: 'openid email profile',
        idToken: 'id_token_mock',
        expiresAt: new Date('2024-01-08T14:30:00Z'),
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-08T10:30:00Z')
      }
    ],
    sessions: [
      {
        id: 'sess1',
        userId: '1',
        sessionToken: 'session_token_1',
        accessToken: 'access_token_1',
        refreshToken: 'refresh_token_1',
        expiresAt: new Date('2024-01-15T10:30:00Z'),
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ipAddress: '192.168.1.100',
        isActive: true,
        createdAt: new Date('2024-01-08T10:30:00Z'),
        updatedAt: new Date('2024-01-08T10:30:00Z')
      }
    ],
    addresses: [
      {
        id: 'addr1',
        userId: '1',
        title: 'Casa',
        firstName: 'Juan',
        lastName: 'Pérez',
        addressLine1: 'Calle Gran Vía 123',
        addressLine2: 'Piso 4, Puerta A',
        city: 'Madrid',
        state: 'Madrid',
        postalCode: '28013',
        country: 'España',
        isDefault: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      }
    ]
  },
  {
    id: '2',
    email: 'maria.garcia@hotmail.com',
    role: UserRole.CUSTOMER,
    isActive: true,
    emailVerified: true,
    lastLoginAt: new Date('2024-01-07T15:20:00Z'),
    createdAt: new Date('2023-12-15T00:00:00Z'),
    updatedAt: new Date('2024-01-07T15:20:00Z'),
    profile: {
      id: '2',
      userId: '2',
      firstName: 'María',
      lastName: 'García',
      fullName: 'María García',
      phone: '+34 655 987 654',
      birthDate: new Date('1990-03-22'),
      avatarUrl: null,
      createdAt: new Date('2023-12-15T00:00:00Z'),
      updatedAt: new Date('2023-12-15T00:00:00Z')
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
        createdAt: new Date('2023-12-15T00:00:00Z'),
        updatedAt: new Date('2023-12-15T00:00:00Z')
      }
    ],
    sessions: [
      {
        id: 'sess2',
        userId: '2',
        sessionToken: 'session_token_2',
        accessToken: 'access_token_2',
        refreshToken: 'refresh_token_2',
        expiresAt: new Date('2024-01-14T15:20:00Z'),
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        ipAddress: '192.168.1.101',
        isActive: true,
        createdAt: new Date('2024-01-07T15:20:00Z'),
        updatedAt: new Date('2024-01-07T15:20:00Z')
      }
    ],
    addresses: []
  },
  {
    id: '3',
    email: 'admin@happybabystyle.com',
    role: UserRole.ADMIN,
    isActive: true,
    emailVerified: true,
    lastLoginAt: new Date('2024-01-08T09:00:00Z'),
    createdAt: new Date('2023-11-01T00:00:00Z'),
    updatedAt: new Date('2024-01-08T09:00:00Z'),
    profile: {
      id: '3',
      userId: '3',
      firstName: 'Administrador',
      lastName: 'Sistema',
      fullName: 'Administrador Sistema',
      phone: '+34 600 000 000',
      birthDate: undefined,
      avatarUrl: null,
      createdAt: new Date('2023-11-01T00:00:00Z'),
      updatedAt: new Date('2023-11-01T00:00:00Z')
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
        createdAt: new Date('2023-11-01T00:00:00Z'),
        updatedAt: new Date('2023-11-01T00:00:00Z')
      }
    ],
    sessions: [
      {
        id: 'sess3',
        userId: '3',
        sessionToken: 'session_token_3',
        accessToken: 'access_token_3',
        refreshToken: 'refresh_token_3',
        expiresAt: new Date('2024-01-15T09:00:00Z'),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ipAddress: '10.0.0.50',
        isActive: true,
        createdAt: new Date('2024-01-08T09:00:00Z'),
        updatedAt: new Date('2024-01-08T09:00:00Z')
      }
    ],
    addresses: []
  },
  {
    id: '4',
    email: 'carlos.rodriguez@gmail.com',
    role: UserRole.CUSTOMER,
    isActive: false,
    emailVerified: true,
    lastLoginAt: new Date('2024-01-05T12:00:00Z'),
    createdAt: new Date('2023-12-01T00:00:00Z'),
    updatedAt: new Date('2024-01-06T00:00:00Z'),
    profile: {
      id: '4',
      userId: '4',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      fullName: 'Carlos Rodríguez',
      phone: '+34 644 555 333',
      birthDate: new Date('1978-11-10'),
      avatarUrl: null,
      createdAt: new Date('2023-12-01T00:00:00Z'),
      updatedAt: new Date('2023-12-01T00:00:00Z')
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
        expiresAt: new Date('2024-01-06T12:00:00Z'), // Token expirado
        createdAt: new Date('2023-12-01T00:00:00Z'),
        updatedAt: new Date('2024-01-05T12:00:00Z')
      }
    ],
    sessions: [
      {
        id: 'sess4',
        userId: '4',
        sessionToken: 'session_token_4',
        accessToken: 'access_token_4',
        refreshToken: 'refresh_token_4',
        expiresAt: new Date('2024-01-12T12:00:00Z'),
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ipAddress: '203.0.113.45',
        isActive: false,
        createdAt: new Date('2024-01-05T12:00:00Z'),
        updatedAt: new Date('2024-01-06T00:00:00Z')
      }
    ],
    addresses: []
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
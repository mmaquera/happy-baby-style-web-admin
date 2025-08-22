import { useMutation } from '@apollo/client';
import { 
  LoginUserDocument,
  RefreshTokenDocument,
  LogoutUserDocument,
  LoginUserMutation, 
  LoginUserMutationVariables,
  RefreshTokenMutation,
  RefreshTokenMutationVariables,
  LogoutUserMutation,
  UserRole
} from '@/generated/graphql';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  profile?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    birthDate?: string | null;
    avatar?: string | null;
  } | null;
}

// Enhanced AuthResult interface following Open/Closed Principle
export interface AuthResult {
  success: boolean;
  user?: AuthUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  message: string;
  // New fields from backend schema
  code?: string;
  timestamp?: string;
  metadata?: {
    requestId?: string;
    traceId?: string;
    duration?: number;
    timestamp?: string;
  } | undefined;
}

export const useAuthGraphQL = () => {
  const [loginUserMutation] = useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument);
  const [refreshTokenMutation] = useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument);
  const [logoutUserMutation] = useMutation<LogoutUserMutation>(LogoutUserDocument);

  const loginUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const { data } = await loginUserMutation({
        variables: {
          email: credentials.email,
          password: credentials.password
        }
      });

      if (data?.loginUser) {
        const response = data.loginUser;
        return {
          success: response.success,
          user: response.data?.user ? {
            id: response.data.user.id,
            email: response.data.user.email,
            role: response.data.user.role,
            isActive: response.data.user.isActive,
            emailVerified: response.data.user.emailVerified,
            lastLoginAt: response.data.user.lastLoginAt ?? null,
            profile: response.data.user.profile ? {
              id: response.data.user.profile.id,
              firstName: response.data.user.profile.firstName ?? null,
              lastName: response.data.user.profile.lastName ?? null,
              phone: response.data.user.profile.phone ?? null,
              birthDate: response.data.user.profile.dateOfBirth ?? null,
              avatar: response.data.user.profile.avatar ?? null,
            } : null
          } : null,
          accessToken: response.data?.accessToken ?? null,
          refreshToken: response.data?.refreshToken ?? null,
          message: response.message,
          // New fields from backend schema
          code: response.code,
          timestamp: response.timestamp,
          metadata: response.metadata ? {
            ...(response.metadata.requestId && { requestId: response.metadata.requestId }),
            ...(response.metadata.traceId && { traceId: response.metadata.traceId }),
            ...(response.metadata.duration && { duration: response.metadata.duration }),
            timestamp: response.metadata.timestamp
          } : undefined
        };
      }

      return {
        success: false,
        message: 'No se recibió respuesta del servidor'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle GraphQL errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        return {
          success: false,
          message: graphQLError.message || 'Error de autenticación'
        };
      }
      
      // Handle network errors
      if (error.networkError) {
        return {
          success: false,
          message: 'Error de conexión. Verifica tu conexión a internet.'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Error inesperado durante el login'
      };
    }
  };

  const refreshToken = async (token: string): Promise<AuthResult> => {
    try {
      const { data } = await refreshTokenMutation({
        variables: {
          refreshToken: token
        }
      });

      if (data?.refreshToken) {
        const response = data.refreshToken;
        return {
          success: response.success,
          user: response.data?.user ? {
            id: response.data.user.id,
            email: response.data.user.email,
            role: response.data.user.role,
            isActive: response.data.user.isActive,
            emailVerified: response.data.user.emailVerified,
            lastLoginAt: response.data.user.lastLoginAt ?? null,
            profile: response.data.user.profile ? {
              id: response.data.user.profile.id,
              firstName: response.data.user.profile.firstName ?? null,
              lastName: response.data.user.profile.lastName ?? null,
              phone: response.data.user.profile.phone ?? null,
              birthDate: response.data.user.profile.dateOfBirth ?? null,
              avatar: response.data.user.profile.avatar ?? null,
            } : null
          } : null,
          accessToken: response.data?.accessToken ?? null,
          refreshToken: response.data?.refreshToken ?? null,
          message: response.message,
          // New fields from backend schema
          code: response.code,
          timestamp: response.timestamp,
          metadata: response.metadata ? {
            ...(response.metadata.requestId && { requestId: response.metadata.requestId }),
            ...(response.metadata.traceId && { traceId: response.metadata.traceId }),
            ...(response.metadata.duration && { duration: response.metadata.duration }),
            timestamp: response.metadata.timestamp
          } : undefined
        };
      }

      return {
        success: false,
        message: 'No se pudo renovar el token'
      };
    } catch (error: any) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: error.message || 'Error al renovar el token'
      };
    }
  };

  const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await logoutUserMutation();
      
      if (data?.logoutUser) {
        return {
          success: data.logoutUser.success,
          message: data.logoutUser.message
        };
      }

      return {
        success: false,
        message: 'Error al cerrar sesión'
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Manejar errores específicos de GraphQL
      if (error?.graphQLErrors?.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        const errorCode = graphQLError.extensions?.['code'];
        
        switch (errorCode) {
          case 'UNAUTHENTICATED':
            return {
              success: false,
              message: 'Sesión expirada o inválida'
            };
          case 'FORBIDDEN':
            return {
              success: false,
              message: 'No tienes permisos para realizar esta acción'
            };
          default:
            return {
              success: false,
              message: graphQLError.message || 'Error al cerrar sesión'
            };
        }
      }
      
      // Manejar errores de red
      if (error?.networkError) {
        return {
          success: false,
          message: 'Error de conexión. Verifica tu conexión a internet.'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Error inesperado al cerrar sesión'
      };
    }
  };

  return {
    loginUser,
    refreshToken,
    logoutUser
  };
};
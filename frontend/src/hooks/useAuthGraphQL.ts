import { useMutation } from '@apollo/client';
import { 
  LoginUserDocument,
  RefreshTokenDocument,
  LogoutUserDocument,
  LoginUserMutation, 
  LoginUserMutationVariables,
  RefreshTokenMutation,
  RefreshTokenMutationVariables,
  LogoutUserMutation 
} from '@/generated/graphql';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  profile?: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    birthDate?: string;
    avatarUrl?: string;
  };
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  accessToken?: string;
  refreshToken?: string;
  message: string;
}

export const useAuthGraphQL = () => {
  const [loginUserMutation] = useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument);
  const [refreshTokenMutation] = useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument);
  const [logoutUserMutation] = useMutation<LogoutUserMutation>(LogoutUserDocument);

  const loginUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const { data } = await loginUserMutation({
        variables: {
          input: {
            email: credentials.email,
            password: credentials.password
          }
        }
      });

      if (data?.loginUser) {
        const response = data.loginUser;
        return {
          success: response.success,
          user: response.user ? {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
            isActive: response.user.isActive,
            emailVerified: response.user.emailVerified,
            lastLoginAt: response.user.lastLoginAt || undefined,
            profile: response.user.profile ? {
              id: response.user.profile.id,
              firstName: response.user.profile.firstName || undefined,
              lastName: response.user.profile.lastName || undefined,
              phone: response.user.profile.phone || undefined,
              birthDate: response.user.profile.birthDate || undefined,
              avatarUrl: response.user.profile.avatarUrl || undefined,
            } : undefined
          } : undefined,
          accessToken: response.accessToken || undefined,
          refreshToken: response.refreshToken || undefined,
          message: response.message
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
          message: 'Error de conexión. Verifique su conexión a internet.'
        };
      }
      
      return {
        success: false,
        message: 'Error inesperado al iniciar sesión'
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
          user: response.user ? {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
            isActive: response.user.isActive,
            emailVerified: response.user.emailVerified,
            lastLoginAt: response.user.lastLoginAt || undefined,
            profile: response.user.profile ? {
              id: response.user.profile.id,
              firstName: response.user.profile.firstName || undefined,
              lastName: response.user.profile.lastName || undefined,
              phone: response.user.profile.phone || undefined,
              birthDate: response.user.profile.birthDate || undefined,
              avatarUrl: response.user.profile.avatarUrl || undefined,
            } : undefined
          } : undefined,
          accessToken: response.accessToken || undefined,
          refreshToken: response.refreshToken || undefined,
          message: response.message
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
        message: 'Error al renovar la sesión'
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
      return {
        success: false,
        message: 'Error al cerrar sesión'
      };
    }
  };

  return {
    loginUser,
    refreshToken,
    logoutUser
  };
};
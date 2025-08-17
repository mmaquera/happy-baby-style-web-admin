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

export interface AuthResult {
  success: boolean;
  user?: AuthUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
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
          email: credentials.email,
          password: credentials.password
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
            lastLoginAt: response.user.lastLoginAt ?? null,
            profile: response.user.profile ? {
              id: response.user.profile.id,
              firstName: response.user.profile.firstName ?? null,
              lastName: response.user.profile.lastName ?? null,
              phone: response.user.profile.phone ?? null,
              birthDate: response.user.profile.dateOfBirth ?? null,
              avatar: response.user.profile.avatar ?? null,
            } : null
          } : null,
          accessToken: response.accessToken ?? null,
          refreshToken: response.refreshToken ?? null,
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
          user: response.user ? {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
            isActive: response.user.isActive,
            emailVerified: response.user.emailVerified,
            lastLoginAt: response.user.lastLoginAt ?? null,
            profile: response.user.profile ? {
              id: response.user.profile.id,
              firstName: response.user.profile.firstName ?? null,
              lastName: response.user.profile.lastName ?? null,
              phone: response.user.profile.phone ?? null,
              birthDate: response.user.profile.dateOfBirth ?? null,
              avatar: response.user.profile.avatar ?? null,
            } : null
          } : null,
          accessToken: response.accessToken ?? null,
          refreshToken: response.refreshToken ?? null,
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
      return {
        success: false,
        message: error.message || 'Error al cerrar sesión'
      };
    }
  };

  return {
    loginUser,
    refreshToken,
    logoutUser
  };
};
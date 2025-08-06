import { useState } from 'react';
import { 
  useGetAuthProviderStatsQuery,
  useGetUsersByProviderQuery,
  useGetUserSessionsQuery,
  useGetActiveSessionsQuery,
  useRevokeUserSessionMutation,
  useRevokeAllUserSessionsMutation,
  useUnlinkUserAccountMutation,
  useForcePasswordResetMutation,
  useImpersonateUserMutation,
  AuthProvider
} from '@/generated/graphql';
// import { useMockAuthProviderStats, useMockUsersByProvider, useMockUserSessions } from './useMockUsers';
import toast from 'react-hot-toast';

export const useAuthProviderStats = () => {
  const { data, loading, error, refetch } = useGetAuthProviderStatsQuery({
    errorPolicy: 'all'
  });

  return {
    stats: data?.authProviderStats,
    loading,
    error,
    refetch
  };
};

export const useUsersByProvider = (provider: AuthProvider) => {
  const { data, loading, error, refetch } = useGetUsersByProviderQuery({
    variables: { provider },
    errorPolicy: 'all'
  });

  return {
    users: data?.usersByProvider || [],
    loading,
    error,
    refetch
  };
};

export const useUserSessions = (userId: string) => {
  const { data, loading, error, refetch } = useGetUserSessionsQuery({
    variables: { userId },
    errorPolicy: 'all',
    skip: !userId
  });

  return {
    sessions: data?.userSessions || [],
    loading,
    error,
    refetch
  };
};

export const useActiveSessions = (userId: string) => {
  const { data, loading, error, refetch } = useGetActiveSessionsQuery({
    variables: { userId },
    errorPolicy: 'all',
    skip: !userId
  });

  return {
    activeSessions: data?.activeSessions || [],
    loading,
    error,
    refetch
  };
};

export const useSessionManagement = () => {
  const [loading, setLoading] = useState(false);
  
  const [revokeSessionMutation] = useRevokeUserSessionMutation();
  const [revokeAllSessionsMutation] = useRevokeAllUserSessionsMutation();

  const revokeSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const result = await revokeSessionMutation({
        variables: { sessionId }
      });
      
      if (result.data?.revokeUserSession?.success) {
        toast.success(result.data.revokeUserSession.message || 'Sesión revocada exitosamente');
      } else {
        toast.error('Error al revocar sesión');
      }
      
      return result.data?.revokeUserSession;
    } catch (error) {
      toast.error('Error al revocar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const revokeAllSessions = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres revocar todas las sesiones de este usuario?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await revokeAllSessionsMutation({
        variables: { userId }
      });
      
      if (result.data?.revokeAllUserSessions?.success) {
        toast.success(result.data.revokeAllUserSessions.message || 'Todas las sesiones han sido revocadas');
      } else {
        toast.error('Error al revocar sesiones');
      }
      
      return result.data?.revokeAllUserSessions;
    } catch (error) {
      toast.error('Error al revocar sesiones');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    revokeSession,
    revokeAllSessions
  };
};

export const useAccountManagement = () => {
  const [loading, setLoading] = useState(false);
  
  const [unlinkAccountMutation] = useUnlinkUserAccountMutation();
  const [forcePasswordResetMutation] = useForcePasswordResetMutation();

  const unlinkAccount = async (accountId: string, provider: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres desvincular la cuenta de ${provider}?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await unlinkAccountMutation({
        variables: { accountId }
      });
      
      if (result.data?.unlinkUserAccount?.success) {
        toast.success(result.data.unlinkUserAccount.message || 'Cuenta desvinculada exitosamente');
      } else {
        toast.error('Error al desvincular cuenta');
      }
      
      return result.data?.unlinkUserAccount;
    } catch (error) {
      toast.error('Error al desvincular cuenta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forcePasswordReset = async (userId: string, userEmail: string) => {
    if (!window.confirm(`¿Forzar reset de contraseña para ${userEmail}?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await forcePasswordResetMutation({
        variables: { userId }
      });
      
      if (result.data?.forcePasswordReset?.success) {
        toast.success(result.data.forcePasswordReset.message || 'Reset de contraseña enviado');
      } else {
        toast.error('Error al forzar reset de contraseña');
      }
      
      return result.data?.forcePasswordReset;
    } catch (error) {
      toast.error('Error al forzar reset de contraseña');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    unlinkAccount,
    forcePasswordReset
  };
};

export const useUserImpersonation = () => {
  const [loading, setLoading] = useState(false);
  
  const [impersonateMutation] = useImpersonateUserMutation();

  const impersonateUser = async (userId: string, userEmail: string) => {
    if (!window.confirm(`¿Impersonar usuario ${userEmail}? Esta acción será registrada en logs de auditoría.`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await impersonateMutation({
        variables: { userId }
      });
      
      if (result.data?.impersonateUser?.success) {
        toast.success(`Impersonando a ${userEmail}`);
        
        // En una implementación real, aquí se manejaría la redirección
        // o cambio de contexto de usuario
        const { accessToken } = result.data.impersonateUser;
        console.log('Impersonation token:', accessToken);
        
      } else {
        toast.error('Error al impersonar usuario');
      }
      
      return result.data?.impersonateUser;
    } catch (error) {
      toast.error('Error al impersonar usuario');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    impersonateUser
  };
};

// Utility hook for provider-specific operations
export const useProviderUtils = () => {
  const getProviderLabel = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.Google:
        return 'Google';
      case AuthProvider.Facebook:
        return 'Facebook';
      case AuthProvider.Apple:
        return 'Apple';
      case AuthProvider.Email:
        return 'Email/Contraseña';
      default:
        return provider;
    }
  };

  const getProviderIcon = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.Google:
        return '🔍'; // En producción usar iconos apropiados
      case AuthProvider.Facebook:
        return '📘';
      case AuthProvider.Apple:
        return '🍎';
      case AuthProvider.Email:
        return '📧';
      default:
        return '🔐';
    }
  };

  const getProviderColor = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.Google:
        return '#4285f4';
      case AuthProvider.Facebook:
        return '#1877f2';
      case AuthProvider.Apple:
        return '#000000';
      case AuthProvider.Email:
        return '#6366f1';
      default:
        return '#64748b';
    }
  };

  return {
    getProviderLabel,
    getProviderIcon,
    getProviderColor
  };
};
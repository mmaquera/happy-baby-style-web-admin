import { useState, useEffect } from 'react';
import { 
  useGetUsersByProviderQuery,
  useGetUserSessionsQuery,
  useGetActiveSessionsQuery,
  useRevokeUserSessionMutation,
  useRevokeAllUserSessionsMutation,
  useUnlinkUserAccountMutation,
  useForcePasswordResetMutation,
  useImpersonateUserMutation,
  AuthProvider,
  useGetUserStatsQuery
} from '@/generated/graphql';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AuthStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: any;
}

export const useAuthManagement = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AuthStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usar useGetUserStatsQuery en lugar de useGetAuthProviderStatsQuery
  const { data, loading: queryLoading, error: queryError, refetch } = useGetUserStatsQuery();

  useEffect(() => {
    if (data?.userStats) {
      setStats({
        totalUsers: data.userStats.totalUsers,
        activeUsers: data.userStats.activeUsers,
        newUsersThisMonth: data.userStats.newUsersThisMonth,
        usersByRole: data.userStats.usersByRole
      });
    }
  }, [data]);

  useEffect(() => {
    setLoading(queryLoading);
  }, [queryLoading]);

  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
    }
  }, [queryError]);

  const refreshStats = async () => {
    try {
      setError(null);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estadísticas');
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats,
    user
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

export const useAuthProviderStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usar useGetUserStatsQuery para obtener datos básicos
  const { data: userStatsData, loading: userStatsLoading, error: userStatsError, refetch: refetchUserStats } = useGetUserStatsQuery();
  
  // Usar useGetUsersByProviderQuery para obtener datos por proveedor
  const { data: googleUsersData, loading: googleLoading } = useGetUsersByProviderQuery({
    variables: { provider: AuthProvider.google },
    errorPolicy: 'all'
  });
  
  const { data: facebookUsersData, loading: facebookLoading } = useGetUsersByProviderQuery({
    variables: { provider: AuthProvider.facebook },
    errorPolicy: 'all'
  });
  
  const { data: appleUsersData, loading: appleLoading } = useGetUsersByProviderQuery({
    variables: { provider: AuthProvider.apple },
    errorPolicy: 'all'
  });
  
  const { data: emailUsersData, loading: emailLoading } = useGetUsersByProviderQuery({
    variables: { provider: AuthProvider.email },
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (userStatsData?.userStats && googleUsersData && facebookUsersData && appleUsersData && emailUsersData) {
      const totalUsers = userStatsData.userStats.totalUsers;
      
      // Calcular estadísticas por proveedor
      const googleCount = googleUsersData.usersByProvider?.length || 0;
      const facebookCount = facebookUsersData.usersByProvider?.length || 0;
      const appleCount = appleUsersData.usersByProvider?.length || 0;
      const emailCount = emailUsersData.usersByProvider?.length || 0;
      
      const usersByProvider = [
        {
          provider: AuthProvider.google,
          count: googleCount,
          percentage: totalUsers > 0 ? (googleCount / totalUsers) * 100 : 0
        },
        {
          provider: AuthProvider.facebook,
          count: facebookCount,
          percentage: totalUsers > 0 ? (facebookCount / totalUsers) * 100 : 0
        },
        {
          provider: AuthProvider.apple,
          count: appleCount,
          percentage: totalUsers > 0 ? (appleCount / totalUsers) * 100 : 0
        },
        {
          provider: AuthProvider.email,
          count: emailCount,
          percentage: totalUsers > 0 ? (emailCount / totalUsers) * 100 : 0
        }
      ].filter(provider => provider.count > 0); // Solo mostrar proveedores con usuarios

      // Mock de datos para sesiones activas y logins recientes (temporal)
      const activeSessionsCount = Math.floor(totalUsers * 0.7); // 70% de usuarios tienen sesiones activas
      
      const recentLogins = [
        {
          userId: '1',
          email: 'admin@happybabystyle.com',
          provider: AuthProvider.email,
          loginAt: new Date().toISOString(),
          ipAddress: '192.168.1.100'
        },
        {
          userId: '2',
          email: 'user@gmail.com',
          provider: AuthProvider.google,
          loginAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
          ipAddress: '192.168.1.101'
        }
      ];

      setStats({
        totalUsers,
        activeSessionsCount,
        usersByProvider,
        recentLogins
      });
    }
  }, [userStatsData, googleUsersData, facebookUsersData, appleUsersData, emailUsersData]);

  useEffect(() => {
    setLoading(userStatsLoading || googleLoading || facebookLoading || appleLoading || emailLoading);
  }, [userStatsLoading, googleLoading, facebookLoading, appleLoading, emailLoading]);

  useEffect(() => {
    if (userStatsError) {
      setError(userStatsError.message);
    }
  }, [userStatsError]);

  const refetch = async () => {
    try {
      setError(null);
      await refetchUserStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estadísticas');
    }
  };

  return {
    stats,
    loading,
    error,
    refetch
  };
};

export const useProviderUtils = () => {
  const getProviderLabel = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.google:
        return 'Google';
      case AuthProvider.facebook:
        return 'Facebook';
      case AuthProvider.apple:
        return 'Apple';
      case AuthProvider.email:
        return 'Email/Contraseña';
      default:
        return provider;
    }
  };

  const getProviderIcon = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.google:
        return '🔍'; // En producción usar iconos apropiados
      case AuthProvider.facebook:
        return '📘';
      case AuthProvider.apple:
        return '🍎';
      case AuthProvider.email:
        return '📧';
      default:
        return '🔐';
    }
  };

  const getProviderColor = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.google:
        return '#4285f4';
      case AuthProvider.facebook:
        return '#1877f2';
      case AuthProvider.apple:
        return '#000000';
      case AuthProvider.email:
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
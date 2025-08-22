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
  useGetUsersWithRecentActivityQuery,
  useGetActiveSessionsCountQuery,
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

// Nueva interfaz para las estadísticas del dashboard de proveedores de autenticación
export interface AuthProviderStats {
  totalUsers: number;
  activeSessionsCount: number;
  usersByProvider: Array<{
    provider: AuthProvider;
    count: number;
    percentage: number;
  }>;
  recentLogins: Array<{
    userId: string;
    email: string;
    provider: AuthProvider;
    loginAt: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }>;
}

export const useAuthManagement = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AuthStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usar useGetUserStatsQuery en lugar de useGetAuthProviderStatsQuery
  const { data, loading: queryLoading, error: queryError, refetch } = useGetUserStatsQuery();

  useEffect(() => {
    if (data?.userStats?.data) {
      setStats({
        totalUsers: data.userStats.data.totalUsers,
        activeUsers: data.userStats.data.activeUsers,
        newUsersThisMonth: data.userStats.data.newUsersThisMonth,
        usersByRole: data.userStats.data.usersByRole
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
  const { user } = useAuth(); // Obtener el usuario actual para requestingUserId
  
  const [revokeSessionMutation] = useRevokeUserSessionMutation();
  const [revokeAllSessionsMutation] = useRevokeAllUserSessionsMutation();

  const revokeSession = async (sessionId: string, userId: string) => {
    setLoading(true);
    try {
      const result = await revokeSessionMutation({
        variables: { 
          sessionId,
          userId 
        }
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

    if (!user?.id) {
      toast.error('Usuario no autenticado');
      return;
    }

    setLoading(true);
    try {
      const result = await revokeAllSessionsMutation({
        variables: { 
          userId,
          requestingUserId: user.id 
        }
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
        const { accessToken } = result.data.impersonateUser.data || {};
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
  const [stats, setStats] = useState<AuthProviderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Query para obtener usuarios con actividad reciente
  const { data: recentActivityData, loading: recentActivityLoading, error: recentActivityError } = useGetUsersWithRecentActivityQuery({
    variables: { limit: 10 },
    errorPolicy: 'all'
  });

  // Query para obtener conteo de sesiones activas
  const { data: activeSessionsData, loading: activeSessionsLoading, error: activeSessionsError } = useGetActiveSessionsCountQuery({
    errorPolicy: 'all'
  });

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
    // Crear datos de fallback con valores en 0
    const createFallbackStats = (): AuthProviderStats => ({
      totalUsers: 0,
      activeSessionsCount: 0,
      usersByProvider: [
        {
          provider: AuthProvider.google,
          count: 0,
          percentage: 0
        },
        {
          provider: AuthProvider.facebook,
          count: 0,
          percentage: 0
        },
        {
          provider: AuthProvider.apple,
          count: 0,
          percentage: 0
        },
        {
          provider: AuthProvider.email,
          count: 0,
          percentage: 0
        }
      ],
      recentLogins: []
    });

    // Si tenemos datos reales, usarlos; si no, usar fallback
    if (userStatsData?.userStats?.data && 
        googleUsersData?.usersByProvider?.data && 
        facebookUsersData?.usersByProvider?.data && 
        appleUsersData?.usersByProvider?.data && 
        emailUsersData?.usersByProvider?.data &&
        recentActivityData?.users?.data?.items &&
        activeSessionsData?.users?.data?.items) {
      
      const totalUsers = userStatsData.userStats.data.totalUsers;
      
      // Calcular estadísticas por proveedor usando datos reales
      const googleCount = Array.isArray(googleUsersData.usersByProvider.data) ? googleUsersData.usersByProvider.data.length : 0;
      const facebookCount = Array.isArray(facebookUsersData.usersByProvider.data) ? facebookUsersData.usersByProvider.data.length : 0;
      const appleCount = Array.isArray(appleUsersData.usersByProvider.data) ? appleUsersData.usersByProvider.data.length : 0;
      const emailCount = Array.isArray(emailUsersData.usersByProvider.data) ? emailUsersData.usersByProvider.data.length : 0;
      
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

      // Calcular sesiones activas usando datos reales
      const activeSessionsCount = activeSessionsData.users.data.items.reduce((total, user) => {
        return total + (user.sessions?.filter(session => session.isActive)?.length || 0);
      }, 0);
      
      // Generar logins recientes usando datos reales de lastLoginAt
      const recentLogins = recentActivityData.users.data.items
        .filter(user => user.lastLoginAt) // Solo usuarios con login reciente
        .sort((a, b) => new Date(b.lastLoginAt!).getTime() - new Date(a.lastLoginAt!).getTime()) // Ordenar por fecha más reciente
        .slice(0, 5) // Tomar solo los 5 más recientes
        .map(user => {
          // Determinar el proveedor principal del usuario
          const primaryProvider = user.accounts?.[0]?.provider || AuthProvider.email;
          
          return {
            userId: user.id,
            email: user.email,
            provider: primaryProvider,
            loginAt: user.lastLoginAt!,
            ipAddress: user.sessions?.[0]?.ipAddress || 'N/A',
            userAgent: user.sessions?.[0]?.userAgent || 'N/A'
          };
        });

      setStats({
        totalUsers,
        activeSessionsCount,
        usersByProvider: usersByProvider.length > 0 ? usersByProvider : createFallbackStats().usersByProvider,
        recentLogins
      });
    } else {
      // Usar datos de fallback cuando no hay datos reales
      setStats(createFallbackStats());
    }
  }, [
    userStatsData, 
    googleUsersData, 
    facebookUsersData, 
    appleUsersData, 
    emailUsersData,
    recentActivityData,
    activeSessionsData
  ]);

  useEffect(() => {
    setLoading(
      userStatsLoading || 
      googleLoading || 
      facebookLoading || 
      appleLoading || 
      emailLoading ||
      recentActivityLoading ||
      activeSessionsLoading
    );
  }, [
    userStatsLoading, 
    googleLoading, 
    facebookLoading, 
    appleLoading, 
    emailLoading,
    recentActivityLoading,
    activeSessionsLoading
  ]);

  useEffect(() => {
    if (userStatsError || recentActivityError || activeSessionsError) {
      const errorMessage = userStatsError?.message || 
                          recentActivityError?.message || 
                          activeSessionsError?.message || 
                          'Error al cargar estadísticas';
      setError(errorMessage);
    }
  }, [userStatsError, recentActivityError, activeSessionsError]);

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
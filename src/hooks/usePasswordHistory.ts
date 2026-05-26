import { useState, useEffect, useCallback } from 'react';
import { useGetUserPasswordHistoryQuery } from '@/generated/graphql';
import toast from 'react-hot-toast';

export interface PasswordAction {
  id: string;
  type: 'reset' | 'temporary' | 'admin_set' | 'user_change';
  timestamp: Date;
  description: string;
  adminUser?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface UsePasswordHistoryReturn {
  passwordHistory: PasswordAction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Maps SecurityEvent eventType to PasswordAction type
 */
const mapEventTypeToActionType = (eventType: string): PasswordAction['type'] => {
  const normalizedType = eventType.toLowerCase();
  
  if (normalizedType.includes('reset')) {
    return 'reset';
  } else if (normalizedType.includes('temporary') || normalizedType.includes('temp')) {
    return 'temporary';
  } else if (normalizedType.includes('admin') || normalizedType.includes('set')) {
    return 'admin_set';
  } else if (normalizedType.includes('change') || normalizedType.includes('update')) {
    return 'user_change';
  }
  
  // Default fallback
  return 'reset';
};

/**
 * Maps SecurityEvent status from metadata to PasswordAction status
 */
const mapStatusFromMetadata = (metadata: any): PasswordAction['status'] => {
  if (!metadata || typeof metadata !== 'object') {
    return 'completed'; // Default status
  }
  
  const status = metadata.status?.toLowerCase();
  if (status === 'pending') return 'pending';
  if (status === 'failed' || status === 'error') return 'failed';
  return 'completed';
};

/**
 * Extracts admin user from metadata or user object
 */
const extractAdminUser = (metadata: any, userEmail?: string | null): string | undefined => {
  if (metadata?.adminUser) {
    return metadata.adminUser;
  }
  if (metadata?.adminEmail) {
    return metadata.adminEmail;
  }
  if (metadata?.performedBy) {
    return metadata.performedBy;
  }
  // If eventType indicates admin action, use user email
  if (userEmail) {
    return userEmail;
  }
  return undefined;
};

/**
 * Filters security events to only password-related events
 */
const isPasswordRelatedEvent = (eventType: string): boolean => {
  const normalizedType = eventType.toLowerCase();
  return normalizedType.includes('password') || 
         normalizedType.includes('reset') ||
         normalizedType.includes('temporary');
};

/**
 * Transforms SecurityEvent to PasswordAction
 */
const transformSecurityEventToPasswordAction = (event: any): PasswordAction | null => {
  try {
    // Filter only password-related events
    if (!isPasswordRelatedEvent(event.eventType)) {
      return null;
    }

    const metadata = typeof event.metadata === 'string' 
      ? JSON.parse(event.metadata) 
      : event.metadata || {};

    const adminUser = extractAdminUser(metadata, event.user?.email);

    return {
      id: event.id,
      type: mapEventTypeToActionType(event.eventType),
      timestamp: new Date(event.createdAt),
      description: event.description || 'Evento de contraseña',
      ...(adminUser && { adminUser }),
      status: mapStatusFromMetadata(metadata)
    };
  } catch (error) {
    console.error('Error transforming security event:', error);
    return null;
  }
};

/**
 * Hook for fetching user password history
 * Follows ERROR_HANDLING_STANDARDS.md patterns
 */
export const usePasswordHistory = (userId: string | null): UsePasswordHistoryReturn => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [passwordHistory, setPasswordHistory] = useState<PasswordAction[]>([]);

  const { 
    data, 
    loading, 
    error: queryError, 
    refetch: refetchQuery 
  } = useGetUserPasswordHistoryQuery({
    variables: { userId: userId || '' },
    skip: !userId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  // Process response and transform data
  useEffect(() => {
    try {
      setLocalError(null);

      if (!data?.userSecurityEvents) {
        return;
      }

      const response = data.userSecurityEvents;

      // ✅ Validate response structure
      if (!response.success) {
        const errorMessage = response.message || 'Error al obtener historial de contraseñas';
        const errorCode = response.code || 'UNKNOWN_ERROR';
        setLocalError(`${errorMessage} (${errorCode})`);
        setPasswordHistory([]);
        return;
      }

      // ✅ Transform security events to password actions
      const events = response.data?.items || [];
      const transformedActions = events
        .map(transformSecurityEventToPasswordAction)
        .filter((action): action is PasswordAction => action !== null)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by most recent first

      setPasswordHistory(transformedActions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al procesar historial';
      setLocalError(errorMessage);
      setPasswordHistory([]);
      console.error('Error processing password history:', error);
    }
  }, [data]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      const errorMessage = queryError.message || 'Error al cargar historial de contraseñas';
      setLocalError(errorMessage);
      setPasswordHistory([]);
    }
  }, [queryError]);

  const refetch = useCallback(async () => {
    try {
      setLocalError(null);
      await refetchQuery();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar historial';
      setLocalError(errorMessage);
      toast.error(errorMessage);
    }
  }, [refetchQuery]);

  // Combine errors
  const combinedError = localError || (queryError?.message || null);

  return {
    passwordHistory,
    loading,
    error: combinedError,
    refetch
  };
};

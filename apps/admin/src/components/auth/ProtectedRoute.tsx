import type React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader2Icon from 'lucide-react/dist/esm/icons/loader-2';
import { useAuth } from '@/contexts/AuthContext';
import { type UserRole } from '@/types/unified';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login',
}) => {
  const { isAuthenticated, isLoading, isInitialized, hasAnyRole } = useAuth();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#f3e8ff] to-muted'>
        <Loader2Icon size={48} className='animate-spin text-brand-purple' />
        <p className='m-0 text-lg text-muted-foreground'>
          Verificando autenticación...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

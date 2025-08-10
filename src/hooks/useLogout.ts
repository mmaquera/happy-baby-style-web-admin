import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Types
interface UseLogoutReturn {
  isLogoutModalOpen: boolean;
  isLoggingOut: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  handleLogout: () => Promise<void>;
}

// Hook
export const useLogout = (): UseLogoutReturn => {
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const openLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const closeLogoutModal = useCallback(() => {
    if (!isLoggingOut) {
      setIsLogoutModalOpen(false);
    }
  }, [isLoggingOut]);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      
      // Simular delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ejecutar logout
      logout();
      
      // Mostrar mensaje de éxito
      toast.success('Sesión cerrada exitosamente');
      
      // Cerrar modal
      setIsLogoutModalOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error al cerrar sesión');
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  return {
    isLogoutModalOpen,
    isLoggingOut,
    openLogoutModal,
    closeLogoutModal,
    handleLogout,
  };
}; 
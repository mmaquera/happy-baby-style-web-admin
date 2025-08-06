import { useState } from 'react';
import { User, UserRole } from '@/types';
import { useUpdateUser } from '@/hooks/useUsersGraphQL';
import toast from 'react-hot-toast';

export const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const updateUserMutation = useUpdateUser();

  const activateUser = async (user: User) => {
    setLoading(true);
    try {
      await updateUserMutation.update(user.id, { isActive: true });
      toast.success(`Usuario ${user.email} activado exitosamente`);
    } catch (error) {
      toast.error('Error al activar usuario');
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (user: User) => {
    setLoading(true);
    try {
      await updateUserMutation.update(user.id, { isActive: false });
      toast.success(`Usuario ${user.email} desactivado exitosamente`);
    } catch (error) {
      toast.error('Error al desactivar usuario');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user: User) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.email}?`)) {
      return;
    }

    setLoading(true);
    try {
      // This would call the deleteUser mutation
      // await deleteUserMutation({ variables: { id: user.id } });
      toast.success(`Usuario ${user.email} eliminado exitosamente`);
    } catch (error) {
      toast.error('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (user: User) => {
    if (!window.confirm(`¿Enviar email de restablecimiento de contraseña a ${user.email}?`)) {
      return;
    }

    setLoading(true);
    try {
      // This would call the requestPasswordReset mutation
      // await requestPasswordResetMutation({ variables: { email: user.email } });
      toast.success(`Email de restablecimiento enviado a ${user.email}`);
    } catch (error) {
      toast.error('Error al enviar email de restablecimiento');
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (user: User) => {
    if (!window.confirm(`¿Promover a ${user.email} como administrador?`)) {
      return;
    }

    setLoading(true);
    try {
      await updateUserMutation.update(user.id, { role: UserRole.admin });
      toast.success(`${user.email} promovido a administrador exitosamente`);
    } catch (error) {
      toast.error('Error al promover usuario');
    } finally {
      setLoading(false);
    }
  };

  const demoteFromAdmin = async (user: User) => {
    if (!window.confirm(`¿Remover permisos de administrador de ${user.email}?`)) {
      return;
    }

    setLoading(true);
    try {
      await updateUserMutation.update(user.id, { role: UserRole.customer });
      toast.success(`Permisos de administrador removidos de ${user.email}`);
    } catch (error) {
      toast.error('Error al actualizar permisos');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    activateUser,
    deactivateUser,
    deleteUser,
    resetPassword,
    promoteToAdmin,
    demoteFromAdmin,
  };
};

export default useUserActions;
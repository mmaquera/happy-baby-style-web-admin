import { useState, useCallback } from 'react';
import { 
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
  useSetDefaultAddressMutation,
  GetUserProfileDocument,
  CreateUserAddressInput,
  UpdateUserAddressInput
} from '../generated/graphql';
import toast from 'react-hot-toast';

interface UseUserProfileOptions {
  userId: string;
  skip?: boolean;
}

export const useUserProfile = ({ userId, skip = false }: UseUserProfileOptions) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Query para obtener el perfil del usuario
  const { 
    data, 
    loading, 
    error, 
    refetch 
  } = useGetUserProfileQuery({
    variables: { userId },
    skip,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  // Mutation para actualizar el perfil
  const [updateProfileMutation, { loading: updatingProfile }] = useUpdateUserProfileMutation({
    refetchQueries: [GetUserProfileDocument],
    awaitRefetchQueries: true
  });

  // Mutation para crear dirección
  const [createAddressMutation, { loading: creatingAddress }] = useCreateUserAddressMutation({
    refetchQueries: [GetUserProfileDocument],
    awaitRefetchQueries: true
  });

  // Mutation para actualizar dirección
  const [updateAddressMutation, { loading: updatingAddress }] = useUpdateUserAddressMutation({
    refetchQueries: [GetUserProfileDocument],
    awaitRefetchQueries: true
  });

  // Mutation para eliminar dirección
  const [deleteAddressMutation, { loading: deletingAddress }] = useDeleteUserAddressMutation({
    refetchQueries: [GetUserProfileDocument],
    awaitRefetchQueries: true
  });

  // Mutation para establecer dirección predeterminada
  const [setDefaultAddressMutation, { loading: settingDefault }] = useSetDefaultAddressMutation({
    refetchQueries: [GetUserProfileDocument],
    awaitRefetchQueries: true
  });

  // Actualizar perfil del usuario
  const updateProfile = useCallback(async (input: any) => {
    try {
      const result = await updateProfileMutation({
        variables: { userId, input }
      });

      if (result.data?.updateUserProfile) {
        toast.success('Perfil actualizado exitosamente');
        setIsEditing(false);
        return result.data.updateUserProfile;
      } else {
        throw new Error('No se pudo actualizar el perfil');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil';
      toast.error(errorMessage);
      throw error;
    }
  }, [userId, updateProfileMutation]);

  // Crear nueva dirección
  const createAddress = useCallback(async (input: CreateUserAddressInput) => {
    try {
      const result = await createAddressMutation({
        variables: { input }
      });

      if (result.data?.createUserAddress?.success) {
        toast.success('Dirección creada exitosamente');
      } else {
        const errorMessage = result.data?.createUserAddress?.message || 'Error al crear dirección';
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear dirección';
      toast.error(errorMessage);
      throw error;
    }
  }, [createAddressMutation]);

  // Actualizar dirección existente
  const updateAddress = useCallback(async (addressId: string, input: UpdateUserAddressInput) => {
    try {
      const result = await updateAddressMutation({
        variables: { id: addressId, input }
      });

      if (result.data?.updateUserAddress?.success) {
        toast.success('Dirección actualizada exitosamente');
        setEditingAddressId(null);
      } else {
        const errorMessage = result.data?.updateUserAddress?.message || 'Error al actualizar dirección';
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar dirección';
      toast.error(errorMessage);
      throw error;
    }
  }, [updateAddressMutation]);

  // Eliminar dirección
  const deleteAddress = useCallback(async (addressId: string) => {
    try {
      const result = await deleteAddressMutation({
        variables: { id: addressId }
      });

      if (result.data?.deleteUserAddress?.success) {
        toast.success('Dirección eliminada exitosamente');
      } else {
        const errorMessage = result.data?.deleteUserAddress?.message || 'Error al crear dirección';
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar dirección';
      toast.error(errorMessage);
      throw error;
    }
  }, [deleteAddressMutation]);

  // Establecer dirección predeterminada
  const setDefaultAddress = useCallback(async (addressId: string) => {
    try {
      const result = await setDefaultAddressMutation({
        variables: { userId, addressId }
      });

      if (result.data?.setDefaultAddress?.success) {
        toast.success('Dirección predeterminada establecida');
      } else {
        const errorMessage = result.data?.setDefaultAddress?.message || 'Error al establecer dirección predeterminada';
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al establecer dirección predeterminada';
      toast.error(errorMessage);
      throw error;
    }
  }, [userId, setDefaultAddressMutation]);

  // Iniciar edición de dirección
  const startEditingAddress = useCallback((addressId: string) => {
    setEditingAddressId(addressId);
  }, []);

  // Cancelar edición de dirección
  const cancelEditingAddress = useCallback(() => {
    setEditingAddressId(null);
  }, []);

  // Iniciar edición del perfil
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Cancelar edición del perfil
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  return {
    // Data
    profile: data?.userProfile,
    loading,
    error,
    
    // Profile operations
    isEditing,
    updatingProfile,
    updateProfile,
    startEditing,
    cancelEditing,
    
    // Address operations
    editingAddressId,
    creatingAddress,
    updatingAddress,
    deletingAddress,
    settingDefault,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    startEditingAddress,
    cancelEditingAddress,
    
    // Utilities
    refetch
  };
};

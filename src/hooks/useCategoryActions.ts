import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCategoriesGraphQL } from './useCategoriesGraphQL';
import { UpdateCategoryInput } from '@/generated/graphql';

export interface UseCategoryActionsReturn {
  // Actions
  handleEditCategory: (categoryId: string) => void;
  handleDeleteCategory: (categoryId: string) => Promise<boolean>;
  handleToggleStatus: (categoryId: string, isActive: boolean) => Promise<boolean>;
  handleViewDetails: (categoryId: string) => void;
  handleBulkDelete: (categoryIds: string[]) => Promise<boolean>;
  handleBulkToggleStatus: (categoryIds: string[], isActive: boolean) => Promise<boolean>;
  
  // State
  isActionLoading: boolean;
  selectedCategories: string[];
  
  // Utilities
  selectCategory: (categoryId: string) => void;
  deselectCategory: (categoryId: string) => void;
  selectAllCategories: (categoryIds: string[]) => void;
  clearSelection: () => void;
  isCategorySelected: (categoryId: string) => boolean;
}

export const useCategoryActions = (): UseCategoryActionsReturn => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const {
    categories,
    updateCategory,
    deleteCategory,
    refetchCategories
  } = useCategoriesGraphQL();

  // Select category
  const selectCategory = useCallback((categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) ? prev : [...prev, categoryId]
    );
  }, []);

  // Deselect category
  const deselectCategory = useCallback((categoryId: string) => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  }, []);

  // Select all categories
  const selectAllCategories = useCallback((categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Check if category is selected
  const isCategorySelected = useCallback((categoryId: string) => {
    return selectedCategories.includes(categoryId);
  }, [selectedCategories]);

  // Edit category
  const handleEditCategory = useCallback((categoryId: string) => {
    // This will be handled by the parent component to open edit modal
    console.log('Edit category:', categoryId);
  }, []);

  // Delete category
  const handleDeleteCategory = useCallback(async (categoryId: string): Promise<boolean> => {
    try {
      setIsActionLoading(true);
      
      const success = await deleteCategory(categoryId);
      
      if (success) {
        // Remove from selection if it was selected
        setSelectedCategories(prev => prev.filter(id => id !== categoryId));
        toast.success('Categoría eliminada exitosamente');
        return true;
      }
      
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al eliminar categoría: ${errorMessage}`);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [deleteCategory]);

  // Toggle category status
  const handleToggleStatus = useCallback(async (categoryId: string, isActive: boolean): Promise<boolean> => {
    try {
      setIsActionLoading(true);
      
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) {
        toast.error('Categoría no encontrada');
        return false;
      }

      const updateInput: UpdateCategoryInput = {
        isActive
      };

      const updatedCategory = await updateCategory(categoryId, updateInput);
      
      if (updatedCategory) {
        const statusText = isActive ? 'activada' : 'desactivada';
        toast.success(`Categoría ${statusText} exitosamente`);
        return true;
      }
      
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al cambiar estado de categoría: ${errorMessage}`);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [categories, updateCategory]);

  // View category details
  const handleViewDetails = useCallback((categoryId: string) => {
    // This will be handled by the parent component to open details modal
    console.log('View category details:', categoryId);
  }, []);

  // Bulk delete categories
  const handleBulkDelete = useCallback(async (categoryIds: string[]): Promise<boolean> => {
    try {
      setIsActionLoading(true);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const categoryId of categoryIds) {
        try {
          const success = await deleteCategory(categoryId);
          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }
      
      // Clear selection
      setSelectedCategories([]);
      
      // Show results
      if (successCount > 0 && errorCount === 0) {
        toast.success(`${successCount} categorías eliminadas exitosamente`);
        return true;
      } else if (successCount > 0 && errorCount > 0) {
        toast.success(`${successCount} categorías eliminadas, ${errorCount} con errores`);
        return true;
      } else {
        toast.error(`Error al eliminar ${errorCount} categorías`);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error en eliminación masiva: ${errorMessage}`);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [deleteCategory]);

  // Bulk toggle status
  const handleBulkToggleStatus = useCallback(async (categoryIds: string[], isActive: boolean): Promise<boolean> => {
    try {
      setIsActionLoading(true);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const categoryId of categoryIds) {
        try {
          const success = await handleToggleStatus(categoryId, isActive);
          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }
      
      // Clear selection
      setSelectedCategories([]);
      
      // Show results
      const statusText = isActive ? 'activadas' : 'desactivadas';
      if (successCount > 0 && errorCount === 0) {
        toast.success(`${successCount} categorías ${statusText} exitosamente`);
        return true;
      } else if (successCount > 0 && errorCount > 0) {
        toast.success(`${successCount} categorías ${statusText}, ${errorCount} con errores`);
        return true;
      } else {
        toast.error(`Error al cambiar estado de ${errorCount} categorías`);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error en cambio masivo de estado: ${errorMessage}`);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [handleToggleStatus]);

  return {
    // Actions
    handleEditCategory,
    handleDeleteCategory,
    handleToggleStatus,
    handleViewDetails,
    handleBulkDelete,
    handleBulkToggleStatus,
    
    // State
    isActionLoading,
    selectedCategories,
    
    // Utilities
    selectCategory,
    deselectCategory,
    selectAllCategories,
    clearSelection,
    isCategorySelected
  };
};

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { 
  CategoryHeader, 
  CategoryGrid,
  CategoryListView,
  CreateCategoryModal,
  EditCategoryModal,
  CategoryDetailModal,
  CategoryFilters
} from '@/components/categories';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'react-hot-toast';

const CategoriesContainer = styled.div`
  padding: ${theme.spacing[6]};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[4]};
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.white}80;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${theme.colors.background.accent};
  border-top: 4px solid ${theme.colors.primaryPurple};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: ${theme.spacing[4]};
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

const ErrorContainer = styled.div`
  background: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  text-align: center;
`;

const ErrorTitle = styled.h3`
  color: ${theme.colors.error};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.error};
  margin: 0;
`;

export const Categories: React.FC = () => {
  // State for UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Use the main categories hook
  const {
    categories,
    loading,
    error,
    pagination,
    filters,
    sortConfig,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
    setFilters,
    clearFilters,
    handleSort,
    goToPage,
    selectCategory,
    deselectCategory,
    selectAllCategories,
    clearSelection,
    isCategorySelected,
    clearError
  } = useCategories();

  // Computed stats
  const stats = {
    totalCategories: pagination.total,
    activeCategories: categories.filter(cat => cat.isActive).length,
    inactiveCategories: categories.filter(cat => !cat.isActive).length
  };

  // Event handlers
  const handleAddCategory = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateModalClose = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleCreateCategorySuccess = useCallback((newCategory: any) => {
    toast.success('Categoría creada exitosamente');
    setIsCreateModalOpen(false);
  }, []);

  const handleBulkActions = useCallback(() => {
    // TODO: Implement bulk actions modal
    console.log('Bulk actions clicked');
  }, []);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export clicked');
  }, []);

  const handleImport = useCallback(() => {
    // TODO: Implement import functionality
    console.log('Import clicked');
  }, []);

  const handleEditCategory = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setIsEditModalOpen(true);
    }
  }, [categories]);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  }, []);

  const handleEditCategorySuccess = useCallback((updatedCategory: any) => {
    toast.success('Categoría actualizada exitosamente');
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  }, []);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  }, [deleteCategory]);

  const handleToggleStatus = useCallback(async (categoryId: string, isActive: boolean) => {
    try {
      await toggleStatus(categoryId, isActive);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }, [toggleStatus]);

  const handleViewDetails = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setIsDetailModalOpen(true);
    }
  }, [categories]);

  const handleDetailModalClose = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedCategory(null);
  }, []);

  const handleEditFromDetail = useCallback((category: any) => {
    setIsDetailModalOpen(false);
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleSortChange = useCallback((field: string, direction: 'asc' | 'desc') => {
    handleSort(field);
  }, [handleSort]);

  const handlePageChange = useCallback((page: number) => {
    goToPage(page);
  }, [goToPage]);

  // Toggle filters visibility
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Loading state
  if (loading && categories.length === 0) {
    return (
      <LoadingOverlay>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <LoadingText>Cargando categorías...</LoadingText>
        </div>
      </LoadingOverlay>
    );
  }

  return (
    <CategoriesContainer>
      <CategoryHeader
        title="Categorías Happy Baby Style"
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onAddCategory={handleAddCategory}
        onBulkActions={handleBulkActions}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Filters Section */}
      {showFilters && (
        <CategoryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          loading={loading}
        />
      )}

      {/* Error Display */}
      {error && (
        <ErrorContainer>
          <ErrorTitle>Error al cargar categorías</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <button onClick={clearError}>Reintentar</button>
        </ErrorContainer>
      )}

      {/* Categories Display */}
      {viewMode === 'grid' ? (
        <CategoryGrid
          categories={categories}
          loading={loading}
          error={error}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
          emptyMessage="No se encontraron categorías"
        />
      ) : (
        <CategoryListView
          categories={categories}
          loading={loading}
          error={error}
          total={pagination.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasMore={pagination.hasMore}
          onPageChange={handlePageChange}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
          onSort={handleSortChange}
          onFilter={() => {}}
        />
      )}

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSuccess={handleCreateCategorySuccess}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditCategorySuccess}
        category={selectedCategory}
      />

      {/* Category Detail Modal */}
      <CategoryDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        category={selectedCategory}
        onEdit={handleEditFromDetail}
      />
    </CategoriesContainer>
  );
};

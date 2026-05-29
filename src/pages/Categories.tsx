import type React from 'react';
import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import {
  CategoryHeader,
  CategoryGrid,
  CategoryListView,
  CategoryFilters,
} from '@/components/categories';

const CreateCategoryModal = lazy(() =>
  import('@/components/categories/CreateCategoryModal').then(m => ({
    default: m.CreateCategoryModal,
  }))
);
const EditCategoryModal = lazy(() =>
  import('@/components/categories/EditCategoryModal').then(m => ({
    default: m.EditCategoryModal,
  }))
);
const CategoryDetailModal = lazy(() =>
  import('@/components/categories/CategoryDetailModal').then(m => ({
    default: m.CategoryDetailModal,
  }))
);
import type {
  CategoryFilters as CategoryFiltersType,
  Category,
} from '@/components/categories/types';
import { useCategoryActions } from '@/hooks/useCategoryActions';
import { logger } from '@/utils/logger';

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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: ${theme.spacing[4]};
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

const UpdateIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${theme.colors.primaryPurple};
  color: ${theme.colors.white};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: ${theme.zIndex?.modal || 1000};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const UpdateSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${theme.colors.white}40;
  border-top: 2px solid ${theme.colors.white};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showFilters, _setShowFilters] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filters, setFilters] = useState<CategoryFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const {
    categories,
    total,
    hasMore,
    loading,
    error,
    clearError,
    loadCategories,
    deleteCategory,
    updateCategory,
  } = useCategoryActions();

  const buildDomainFilter = useCallback(
    () =>
      Object.keys(filters).length > 0
        ? {
            ...(filters.search ? { search: filters.search } : {}),
            ...(filters.isActive !== undefined
              ? { isActive: filters.isActive }
              : {}),
          }
        : undefined,
    [filters]
  );

  useEffect(() => {
    void loadCategories(
      buildDomainFilter(),
      PAGE_SIZE,
      (currentPage - 1) * PAGE_SIZE
    );
  }, [loadCategories, buildDomainFilter, currentPage]);

  const stats = {
    totalCategories: total,
    activeCategories: categories.filter(c => c.isActive).length,
    inactiveCategories: categories.filter(c => !c.isActive).length,
  };

  const handleAddCategory = useCallback(() => setIsCreateModalOpen(true), []);

  const handleCreateCategorySuccess = useCallback(
    (_result: unknown) => {
      setIsCreateModalOpen(false);
      setIsUpdating(true);
      void loadCategories(buildDomainFilter(), PAGE_SIZE, 0).then(() =>
        setTimeout(() => setIsUpdating(false), 800)
      );
    },
    [loadCategories, buildDomainFilter]
  );

  const handleEditCategory = useCallback(
    (categoryId: string) => {
      const cat = categories.find(c => c.id === categoryId);
      if (cat) {
        setSelectedCategory(cat);
        setIsEditModalOpen(true);
      }
    },
    [categories]
  );

  const handleEditCategorySuccess = useCallback(
    (_result: unknown) => {
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      setIsUpdating(true);
      void loadCategories(buildDomainFilter(), PAGE_SIZE, 0).then(() =>
        setTimeout(() => setIsUpdating(false), 800)
      );
    },
    [loadCategories, buildDomainFilter]
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      if (!window.confirm('¿Eliminar esta categoría?')) return;
      setIsUpdating(true);
      await deleteCategory(categoryId);
      setIsUpdating(false);
    },
    [deleteCategory]
  );

  const handleToggleStatus = useCallback(
    async (categoryId: string, isActive: boolean) => {
      setIsUpdating(true);
      await updateCategory(categoryId, { isActive });
      setIsUpdating(false);
    },
    [updateCategory]
  );

  const handleViewDetails = useCallback(
    (categoryId: string) => {
      const cat = categories.find(c => c.id === categoryId);
      if (cat) {
        setSelectedCategory(cat);
        setIsDetailModalOpen(true);
      }
    },
    [categories]
  );

  const handleEditFromDetail = useCallback((category: Category) => {
    setIsDetailModalOpen(false);
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  }, []);

  const handleFiltersChange = useCallback((newFilters: CategoryFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (_field: string, _direction: 'asc' | 'desc') => {
      logger.debug('Sort change — not yet implemented in domain layer');
    },
    []
  );

  const handleBulkActions = useCallback(() => {
    logger.debug('Bulk actions — not yet implemented');
  }, []);

  const handleExport = useCallback(() => {
    logger.debug('Export — not yet implemented');
  }, []);

  const handleImport = useCallback(() => {
    logger.debug('Import — not yet implemented');
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
      {isUpdating ? (
        <UpdateIndicator>
          <UpdateSpinner />
          Actualizando categorías...
        </UpdateIndicator>
      ) : null}

      <CategoryHeader
        title='Categorías Happy Baby Style'
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddCategory={handleAddCategory}
        onBulkActions={handleBulkActions}
        onExport={handleExport}
        onImport={handleImport}
      />

      {showFilters ? (
        <CategoryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          loading={loading}
        />
      ) : null}

      {error ? (
        <ErrorContainer>
          <ErrorTitle>Error al cargar categorías</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <button onClick={clearError}>Reintentar</button>
        </ErrorContainer>
      ) : null}

      {viewMode === 'grid' ? (
        <CategoryGrid
          categories={categories}
          loading={loading}
          error={error}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
          emptyMessage='No se encontraron categorías'
        />
      ) : (
        <CategoryListView
          categories={categories}
          loading={loading}
          error={error}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
          onPageChange={setCurrentPage}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
          onSort={handleSortChange}
          onFilter={() => {}}
        />
      )}

      {isCreateModalOpen && (
        <Suspense fallback={null}>
          <CreateCategoryModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateCategorySuccess}
          />
        </Suspense>
      )}

      {isEditModalOpen && (
        <Suspense fallback={null}>
          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCategory(null);
            }}
            onSuccess={handleEditCategorySuccess}
            category={selectedCategory}
          />
        </Suspense>
      )}

      {isDetailModalOpen && (
        <Suspense fallback={null}>
          <CategoryDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedCategory(null);
            }}
            category={selectedCategory}
            onEdit={handleEditFromDetail}
          />
        </Suspense>
      )}
    </CategoriesContainer>
  );
};

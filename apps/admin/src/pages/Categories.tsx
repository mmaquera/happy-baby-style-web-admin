import type React from 'react';
import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { useUIPreferencesStore } from '@happy-baby/shared-stores';
import {
  CategoryHeader,
  CategoryGrid,
  CategoryListView,
  CategoryFilters,
} from '@/components/categories';
import type {
  CategoryFilters as CategoryFiltersType,
  Category,
} from '@/components/categories/types';
import { useCategoryActions } from '@/hooks/useCategoryActions';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/Button';

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

const PAGE_SIZE = 20;

export const Categories: React.FC = () => {
  const { categoriesViewMode: viewMode, setCategoriesViewMode: setViewMode } =
    useUIPreferencesStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [filters, setFilters] = useState<CategoryFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);

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
      // eslint-disable-next-line no-alert
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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (loading && categories.length === 0) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary' />
          <p className='text-lg text-muted-foreground'>
            Cargando categorías...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-screen-xl p-6'>
      {isUpdating ? (
        <div className='fixed right-5 top-5 z-50 flex items-center gap-2 rounded-lg bg-brand-purple px-4 py-3 text-sm font-medium text-white shadow-lg'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
          Actualizando categorías...
        </div>
      ) : null}

      <CategoryHeader
        title='Categorías Happy Baby Style'
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddCategory={handleAddCategory}
        onBulkActions={() => logger.debug('Bulk actions — not yet implemented')}
        onExport={() => logger.debug('Export — not yet implemented')}
        onImport={() => logger.debug('Import — not yet implemented')}
      />

      <CategoryFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      {error ? (
        <div className='mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center'>
          <h3 className='mb-1 font-medium text-destructive'>
            Error al cargar categorías
          </h3>
          <p className='text-sm text-destructive'>{error}</p>
          <Button
            variant='outline'
            size='sm'
            className='mt-3'
            onClick={clearError}
          >
            Reintentar
          </Button>
        </div>
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

      {isCreateModalOpen ? (
        <Suspense fallback={null}>
          <CreateCategoryModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateCategorySuccess}
          />
        </Suspense>
      ) : null}

      {isEditModalOpen ? (
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
      ) : null}

      {isDetailModalOpen ? (
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
      ) : null}
    </div>
  );
};

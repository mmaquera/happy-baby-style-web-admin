import type React from 'react';
import { lazy, Suspense, useState, useCallback, useMemo } from 'react';
import { useUIPreferencesStore } from '@/stores/uiPreferencesStore';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import {
  ProductHeader,
  ProductFilters,
  ProductGrid,
  ProductListView,
} from '@/components/products';

// Heavy modals — lazy-loaded so they don't bloat the initial Products chunk
const CreateProductModal = lazy(() =>
  import('@/components/products/CreateProductModal').then(m => ({
    default: m.CreateProductModal,
  }))
);
const EditProductModal = lazy(() =>
  import('@/components/products/EditProductModal').then(m => ({
    default: m.EditProductModal,
  }))
);
const ProductDetailModal = lazy(() =>
  import('@/components/products/ProductDetailModal').then(m => ({
    default: m.ProductDetailModal,
  }))
);
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProductsGraphQL';
import { useCategories } from '@/hooks/useCategories';
import type { ProductFilterInput } from '@/components/products/types';
import type { Product } from '@/components/products/types';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { logger } from '@/utils/logger';

// =====================================================
// PRODUCTS PAGE - GraphQL Integration
// =====================================================
// Following Clean Architecture principles and DEVELOPMENT_STANDARDS.md
// - Single Responsibility: Product management only
// - Dependency Inversion: Depends on hooks, not implementations
// - Error handling: Centralized and consistent
// - State management: Local UI state + GraphQL state

const ProductsContainer = styled.div`
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
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.colors.border.light};
  border-top: 4px solid ${theme.colors.primary};
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

const LoadingText = styled.div`
  margin-top: ${theme.spacing[4]};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.base};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${theme.spacing[6]};
  color: ${theme.colors.error};
`;

export const Products: React.FC = () => {
  // =====================================================
  // STATE MANAGEMENT - Following Clean Architecture
  // =====================================================

  // UI State - Local component state only
  const { productsViewMode: viewMode, setProductsViewMode: setViewMode } =
    useUIPreferencesStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [_sortField, setSortField] = useState<string>('');
  const [_sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter State - Mapped to GraphQL filters
  const [filters, setFilters] = useState<{
    search: string;
    categoryId: string;
    isActive: boolean;
    inStock: boolean;
    minPrice: number | null;
    maxPrice: number | null;
    tags: string[];
  }>({
    search: '',
    categoryId: '',
    isActive: true,
    inStock: true,
    minPrice: null,
    maxPrice: null,
    tags: [],
  });

  // =====================================================
  // HELPER FUNCTIONS - Clean and focused
  // =====================================================

  // Map local filters to GraphQL filter format
  const mapFiltersToGraphQL = useCallback(
    (localFilters: typeof filters): ProductFilterInput => {
      const graphqlFilters: ProductFilterInput = {
        isActive: localFilters.isActive,
        inStock: localFilters.inStock,
        tags: localFilters.tags.length > 0 ? localFilters.tags : null,
      };

      // Add optional filters only if they have values
      if (localFilters.categoryId) {
        graphqlFilters.categoryId = localFilters.categoryId;
      }
      if (localFilters.minPrice !== null) {
        graphqlFilters.minPrice = localFilters.minPrice;
      }
      if (localFilters.maxPrice !== null) {
        graphqlFilters.maxPrice = localFilters.maxPrice;
      }
      if (localFilters.search) {
        graphqlFilters.search = localFilters.search;
      }

      return graphqlFilters;
    },
    []
  );

  // =====================================================
  // GRAPHQL INTEGRATION - Using existing hooks
  // =====================================================

  // Products data from GraphQL
  const {
    products,
    loading: productsLoading,
    error: productsError,
    total,
    hasMore,
    loadMore,
    refetch: refetchProducts,
  } = useProducts({
    filter: mapFiltersToGraphQL(filters),
    limit: 20,
  });

  // Categories data from GraphQL
  const {
    categories: graphqlCategories,
    loading: categoriesLoading,
    error: categoriesError,
    refetchCategories,
  } = useCategories();

  // Product mutations
  const { create: _createProduct, loading: _creatingProduct } =
    useCreateProduct();
  const { update: updateProduct, loading: _updatingProduct } =
    useUpdateProduct();
  const { remove: deleteProduct, loading: _deletingProduct } =
    useDeleteProduct();

  // =====================================================
  // COMPUTED VALUES - Using useMemo for performance
  // =====================================================

  // Compute available categories (GraphQL + fallback)
  const availableCategories = useMemo(() => {
    if (graphqlCategories.length > 0) {
      return graphqlCategories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return [];
  }, [graphqlCategories]);

  // Compute product statistics from real data
  const productStats = useMemo(() => {
    if (!products.length)
      return {
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
      };

    const activeProducts = products.filter(p => p.isActive).length;
    const lowStockProducts = products.filter(
      p => p.stockQuantity <= 10 && p.stockQuantity > 0
    ).length;
    const outOfStockProducts = products.filter(
      p => p.stockQuantity === 0
    ).length;

    return {
      totalProducts: total,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
    };
  }, [products, total]);

  // =====================================================
  // EVENT HANDLERS - Following Single Responsibility
  // =====================================================

  const handleFilterChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
      setCurrentPage(1); // Reset to first page when filters change
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      categoryId: '',
      isActive: true,
      inStock: true,
      minPrice: null,
      maxPrice: null,
      tags: [],
    });
    setCurrentPage(1);
  }, []);

  const handleAddProduct = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateProductSuccess = useCallback(
    (product: Product) => {
      logger.debug('Producto creado exitosamente:', product);
      refetchProducts(); // Refresh products list
      setIsCreateModalOpen(false);
    },
    [refetchProducts]
  );

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleEditProduct = useCallback(
    (productId: string) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        setEditingProduct(product as Product);
        setIsEditModalOpen(true);
      }
    },
    [products]
  );

  const handleEditProductSuccess = useCallback(
    (product: Product) => {
      logger.debug('Producto editado exitosamente:', product);
      refetchProducts(); // Refresh products list
      setIsEditModalOpen(false);
      setEditingProduct(null);
    },
    [refetchProducts]
  );

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      if (
        window.confirm('¿Estás seguro de que quieres eliminar este producto?')
      ) {
        try {
          await deleteProduct(productId);
          // Product will be automatically removed from list via Apollo cache
        } catch (error) {
          logger.error('Error deleting product:', error);
        }
      }
    },
    [deleteProduct]
  );

  const handleToggleStatus = useCallback(
    async (productId: string, isActive: boolean) => {
      try {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        await updateProduct(productId, { isActive });
        // Product will be automatically updated via Apollo cache
      } catch (error) {
        logger.error('Error updating product status:', error);
      }
    },
    [products, updateProduct]
  );

  const handleViewDetails = useCallback(
    (productId: string) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product as Product);
      }
    },
    [products]
  );

  const handleCloseProductDetailModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Page-based GraphQL pagination: wire currentPage → offset in useProducts (Fase 2 backlog)
  }, []);

  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    // Server-side sorting: pass sort params to useProducts query (Fase 2 backlog)
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      loadMore();
    }
  }, [hasMore, loadMore]);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  // =====================================================
  // LOADING AND ERROR STATES - Following standards
  // =====================================================

  // Initial loading state - only show when loading categories for the first time
  const isInitialLoading = categoriesLoading && graphqlCategories.length === 0;

  // Products loading state
  const isProductsLoading = productsLoading && products.length === 0;

  // Show loading overlay only on initial load
  if (isInitialLoading) {
    return (
      <ProductsContainer>
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>Cargando módulo de productos...</LoadingText>
        </LoadingOverlay>
      </ProductsContainer>
    );
  }

  // Error state for categories - only show if we can't get any categories
  if (categoriesError && graphqlCategories.length === 0) {
    return (
      <ProductsContainer>
        <Card>
          <ErrorState>
            <AlertTriangle
              size={48}
              style={{ marginBottom: theme.spacing[4] }}
            />
            <h2>Error al cargar categorías</h2>
            <p>{categoriesError}</p>
            <Button
              variant='primary'
              onClick={() => refetchCategories()}
              style={{ marginTop: theme.spacing[4] }}
            >
              Reintentar
            </Button>
          </ErrorState>
        </Card>
      </ProductsContainer>
    );
  }

  // Error state for products
  if (productsError && products.length === 0) {
    return (
      <ProductsContainer>
        <Card>
          <ErrorState>
            <AlertTriangle
              size={48}
              style={{ marginBottom: theme.spacing[4] }}
            />
            <h2>Error al cargar productos</h2>
            <p>{productsError.message}</p>
            <Button
              variant='primary'
              onClick={() => refetchProducts()}
              style={{ marginTop: theme.spacing[4] }}
            >
              Reintentar
            </Button>
          </ErrorState>
        </Card>
      </ProductsContainer>
    );
  }

  // =====================================================
  // RENDER - Clean and focused
  // =====================================================

  return (
    <ProductsContainer>
      {/* Consolidated ProductHeader with all controls */}
      <ProductHeader
        title='Productos Happy Baby Style'
        stats={productStats}
        viewMode={viewMode}
        onAddProduct={handleAddProduct}
        onBulkActions={() => logger.debug('Bulk actions clicked')}
        onExport={() => logger.debug('Export clicked')}
        onImport={() => logger.debug('Import clicked')}
        onViewModeChange={handleViewModeChange}
      />

      {/* Subtle loading indicator for category updates */}
      {categoriesLoading && graphqlCategories.length > 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing[2],
            padding: theme.spacing[2],
            backgroundColor: theme.colors.background.accent,
            borderRadius: theme.borderRadius.base,
            marginBottom: theme.spacing[4],
            fontSize: theme.fontSizes.sm,
            color: theme.colors.text.secondary,
          }}
        >
          <LoadingSpinner
            style={{ width: '16px', height: '16px', borderWidth: '2px' }}
          />
          Actualizando categorías...
        </div>
      ) : null}

      {/* Subtle loading indicator for product updates */}
      {productsLoading && products.length > 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing[2],
            padding: theme.spacing[2],
            backgroundColor: theme.colors.background.accent,
            borderRadius: theme.borderRadius.base,
            marginBottom: theme.spacing[4],
            fontSize: theme.fontSizes.sm,
            color: theme.colors.text.secondary,
          }}
        >
          <LoadingSpinner
            style={{ width: '16px', height: '16px', borderWidth: '2px' }}
          />
          Actualizando productos...
        </div>
      ) : null}

      {/* Product Filters - Clean and focused */}
      <ProductFilters
        filters={(() => {
          const filterObj: {
            search?: string;
            categoryId?: string;
            isActive?: boolean;
            inStock?: boolean;
            tags?: string[];
            minPrice?: number;
            maxPrice?: number;
          } = {
            search: filters.search,
            categoryId: filters.categoryId,
            isActive: filters.isActive,
            inStock: filters.inStock,
            tags: filters.tags,
          };

          if (filters.minPrice !== null) filterObj.minPrice = filters.minPrice;
          if (filters.maxPrice !== null) filterObj.maxPrice = filters.maxPrice;

          return filterObj;
        })()}
        categories={availableCategories}
        availableTags={[]} // Tags query pendiente en Fase 2
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Products Display - Single source of truth for view mode */}
      {viewMode === 'grid' ? (
        <ProductGrid
          products={products}
          loading={isProductsLoading}
          error={productsError?.message || null}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
          emptyMessage='No se encontraron productos que coincidan con los filtros aplicados.'
        />
      ) : (
        <ProductListView
          products={products}
          loading={isProductsLoading}
          error={productsError?.message || null}
          total={total}
          currentPage={currentPage}
          totalPages={Math.ceil(total / 20)}
          hasMore={hasMore}
          onPageChange={handlePageChange}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
          onSort={handleSort}
          onFilter={handleFilterChange}
        />
      )}

      {/* Modals — lazy-loaded; only mounted when open */}
      {isCreateModalOpen && (
        <Suspense fallback={null}>
          <CreateProductModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onSuccess={handleCreateProductSuccess}
            categories={availableCategories}
            availableTags={[]}
          />
        </Suspense>
      )}

      {isEditModalOpen && (
        <Suspense fallback={null}>
          <EditProductModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSuccess={handleEditProductSuccess}
            product={editingProduct}
            categories={availableCategories}
            availableTags={[]}
          />
        </Suspense>
      )}

      {!!selectedProduct && (
        <Suspense fallback={null}>
          <ProductDetailModal
            isOpen={!!selectedProduct}
            onClose={handleCloseProductDetailModal}
            product={selectedProduct}
            onEdit={product => handleEditProduct(product.id)}
          />
        </Suspense>
      )}
    </ProductsContainer>
  );
};

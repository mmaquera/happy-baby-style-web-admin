import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { 
  ProductHeader, 
  ProductFilters, 
  ProductGrid,
  ProductListView,
  CreateProductModal
} from '@/components/products';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProductsGraphQL';
import { useProductActions } from '@/hooks/useProductActions';
import { useCategories } from '@/hooks/useCategories';
import type { Category, Product, ProductFilterInput } from '@/components/products/types';
import { 
  Package,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Grid3X3,
  List,
  Printer,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[6]};
  color: ${theme.colors.text.secondary};
`;

export const Products: React.FC = () => {
  // =====================================================
  // STATE MANAGEMENT - Following Clean Architecture
  // =====================================================
  
  // UI State - Local component state only
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
    tags: []
  });

  // =====================================================
  // HELPER FUNCTIONS - Clean and focused
  // =====================================================
  
  // Map local filters to GraphQL filter format
  const mapFiltersToGraphQL = useCallback((localFilters: typeof filters): ProductFilterInput => {
    const graphqlFilters: ProductFilterInput = {
      isActive: localFilters.isActive,
      inStock: localFilters.inStock,
      tags: localFilters.tags.length > 0 ? localFilters.tags : null
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
  }, []);

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
    refetch: refetchProducts 
  } = useProducts({ 
    filter: mapFiltersToGraphQL(filters),
    limit: 20 
  });

  // Categories data from GraphQL
  const { 
    categories: graphqlCategories, 
    loading: categoriesLoading, 
    error: categoriesError,
    refetchCategories 
  } = useCategories();

  // Product mutations
  const { create: createProduct, loading: creatingProduct } = useCreateProduct();
  const { update: updateProduct, loading: updatingProduct } = useUpdateProduct();
  const { remove: deleteProduct, loading: deletingProduct } = useDeleteProduct();

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
    if (!products.length) return {
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0
    };

    const activeProducts = products.filter(p => p.isActive).length;
    const lowStockProducts = products.filter(p => p.stockQuantity <= 10 && p.stockQuantity > 0).length;
    const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length;

    return {
      totalProducts: total,
      activeProducts,
      lowStockProducts,
      outOfStockProducts
    };
  }, [products, total]);

  // =====================================================
  // EVENT HANDLERS - Following Single Responsibility
  // =====================================================
  
  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      categoryId: '',
      isActive: true,
      inStock: true,
      minPrice: null,
      maxPrice: null,
      tags: []
    });
    setCurrentPage(1);
  }, []);

  const handleAddProduct = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateProductSuccess = useCallback((product: Product) => {
    console.log('Producto creado exitosamente:', product);
    refetchProducts(); // Refresh products list
    setIsCreateModalOpen(false);
  }, [refetchProducts]);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleEditProduct = useCallback((productId: string) => {
    // TODO: Implement edit product modal/form
    console.log('Edit product:', productId);
  }, []);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        // Product will be automatically removed from list via Apollo cache
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  }, [deleteProduct]);

  const handleToggleStatus = useCallback(async (productId: string, isActive: boolean) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      await updateProduct(productId, { isActive });
      // Product will be automatically updated via Apollo cache
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  }, [products, updateProduct]);

  const handleViewDetails = useCallback((productId: string) => {
    // TODO: Implement view details modal/page
    console.log('View details:', productId);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // TODO: Implement pagination with GraphQL
    // This would require updating the useProducts hook to support page-based pagination
  }, []);

  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    // TODO: Implement sorting with GraphQL
    // This would require updating the useProducts hook to support sorting
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
          <LoadingText>
            Cargando módulo de productos...
          </LoadingText>
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
            <AlertTriangle size={48} style={{ marginBottom: theme.spacing[4] }} />
            <h2>Error al cargar categorías</h2>
            <p>{categoriesError}</p>
            <Button 
              variant="primary" 
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
            <AlertTriangle size={48} style={{ marginBottom: theme.spacing[4] }} />
            <h2>Error al cargar productos</h2>
            <p>{productsError.message}</p>
            <Button 
              variant="primary" 
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
        title="Productos Happy Baby Style"
        stats={productStats}
        viewMode={viewMode}
        onAddProduct={handleAddProduct}
        onBulkActions={() => console.log('Bulk actions clicked')}
        onExport={() => console.log('Export clicked')}
        onImport={() => console.log('Import clicked')}
        onViewModeChange={handleViewModeChange}
      />

      {/* Subtle loading indicator for category updates */}
      {categoriesLoading && graphqlCategories.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing[2],
          padding: theme.spacing[2],
          backgroundColor: theme.colors.background.accent,
          borderRadius: theme.borderRadius.base,
          marginBottom: theme.spacing[4],
          fontSize: theme.fontSizes.sm,
          color: theme.colors.text.secondary
        }}>
          <LoadingSpinner style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
          Actualizando categorías...
        </div>
      )}

      {/* Subtle loading indicator for product updates */}
      {productsLoading && products.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing[2],
          padding: theme.spacing[2],
          backgroundColor: theme.colors.background.accent,
          borderRadius: theme.borderRadius.base,
          marginBottom: theme.spacing[4],
          fontSize: theme.fontSizes.sm,
          color: theme.colors.text.secondary
        }}>
          <LoadingSpinner style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
          Actualizando productos...
        </div>
      )}

      {/* Product Filters - Clean and focused */}
      <ProductFilters
        filters={(() => {
          const filterObj: any = {
            search: filters.search,
            categoryId: filters.categoryId,
            isActive: filters.isActive,
            inStock: filters.inStock,
            tags: filters.tags
          };
          
          if (filters.minPrice !== null) filterObj.minPrice = filters.minPrice;
          if (filters.maxPrice !== null) filterObj.maxPrice = filters.maxPrice;
          
          return filterObj;
        })()}
        categories={availableCategories}
        availableTags={[]} // TODO: Implement tags from GraphQL
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
          emptyMessage="No se encontraron productos que coincidan con los filtros aplicados."
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

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateProductSuccess}
        categories={availableCategories}
        availableTags={[]} // TODO: Implement tags from GraphQL
      />
    </ProductsContainer>
  );
};
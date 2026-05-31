import type React from 'react';
import { lazy, Suspense, useState, useCallback, useMemo } from 'react';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import { useUIPreferencesStore } from '@happy-baby/shared-stores';
import {
  ProductHeader,
  ProductFilters,
  ProductGrid,
  ProductListView,
} from '@/components/products';

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
  import('@happy-baby/feature-products').then(m => ({
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
import type { ProductFilterInput, Product } from '@happy-baby/feature-products';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { logger } from '@/utils/logger';

export const Products: React.FC = () => {
  const { productsViewMode: viewMode, setProductsViewMode: setViewMode } =
    useUIPreferencesStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [_sortField, setSortField] = useState<string>('');
  const [_sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const mapFiltersToGraphQL = useCallback(
    (localFilters: typeof filters): ProductFilterInput => {
      const graphqlFilters: ProductFilterInput = {
        isActive: localFilters.isActive,
        inStock: localFilters.inStock,
        tags: localFilters.tags.length > 0 ? localFilters.tags : null,
      };
      if (localFilters.categoryId)
        graphqlFilters.categoryId = localFilters.categoryId;
      if (localFilters.minPrice !== null)
        graphqlFilters.minPrice = localFilters.minPrice;
      if (localFilters.maxPrice !== null)
        graphqlFilters.maxPrice = localFilters.maxPrice;
      if (localFilters.search) graphqlFilters.search = localFilters.search;
      return graphqlFilters;
    },
    []
  );

  const {
    products,
    loading: productsLoading,
    error: productsError,
    total,
    hasMore,
    loadMore,
    refetch: refetchProducts,
  } = useProducts({ filter: mapFiltersToGraphQL(filters), limit: 20 });

  const {
    categories: graphqlCategories,
    loading: categoriesLoading,
    error: categoriesError,
    refetchCategories,
  } = useCategories();

  const { create: _createProduct, loading: _creatingProduct } =
    useCreateProduct();
  const { update: updateProduct, loading: _updatingProduct } =
    useUpdateProduct();
  const { remove: deleteProduct, loading: _deletingProduct } =
    useDeleteProduct();

  const availableCategories = useMemo(() => {
    if (graphqlCategories.length > 0) {
      return graphqlCategories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return [];
  }, [graphqlCategories]);

  const productStats = useMemo(() => {
    if (!products.length)
      return {
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
      };
    return {
      totalProducts: total,
      activeProducts: products.filter(p => p.isActive).length,
      lowStockProducts: products.filter(
        p => p.stockQuantity <= 10 && p.stockQuantity > 0
      ).length,
      outOfStockProducts: products.filter(p => p.stockQuantity === 0).length,
    };
  }, [products, total]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
      setCurrentPage(1);
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
      refetchProducts();
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
      refetchProducts();
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
      } catch (error) {
        logger.error('Error updating product status:', error);
      }
    },
    [products, updateProduct]
  );

  const handleViewDetails = useCallback(
    (productId: string) => {
      const product = products.find(p => p.id === productId);
      if (product) setSelectedProduct(product as Product);
    },
    [products]
  );

  const handleCloseProductDetailModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore) loadMore();
  }, [hasMore, loadMore]);

  const handleViewModeChange = useCallback(
    (mode: 'grid' | 'list') => {
      setViewMode(mode);
    },
    [setViewMode]
  );

  const isInitialLoading = categoriesLoading && graphqlCategories.length === 0;
  const isProductsLoading = productsLoading && products.length === 0;

  if (isInitialLoading) {
    return (
      <div className='mx-auto max-w-[1400px] px-6 py-6 max-md:px-4'>
        <div className='fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/50'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-border border-t-brand-purple' />
          <div className='mt-4 text-base text-muted-foreground'>
            Cargando módulo de productos...
          </div>
        </div>
      </div>
    );
  }

  if (categoriesError && graphqlCategories.length === 0) {
    return (
      <div className='mx-auto max-w-[1400px] px-6 py-6 max-md:px-4'>
        <Card>
          <div className='p-6 text-center text-destructive'>
            <AlertTriangleIcon size={48} className='mb-4' />
            <h2>Error al cargar categorías</h2>
            <p>{categoriesError}</p>
            <Button
              variant='primary'
              onClick={() => refetchCategories()}
              className='mt-4'
            >
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (productsError && products.length === 0) {
    return (
      <div className='mx-auto max-w-[1400px] px-6 py-6 max-md:px-4'>
        <Card>
          <div className='p-6 text-center text-destructive'>
            <AlertTriangleIcon size={48} className='mb-4' />
            <h2>Error al cargar productos</h2>
            <p>{productsError.message}</p>
            <Button
              variant='primary'
              onClick={() => refetchProducts()}
              className='mt-4'
            >
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-[1400px] px-6 py-6 max-md:px-4'>
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

      {categoriesLoading && graphqlCategories.length > 0 ? (
        <div className='mb-4 flex items-center justify-center gap-2 rounded-md bg-brand-purple/10 py-2 text-sm text-muted-foreground'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand-purple' />
          Actualizando categorías...
        </div>
      ) : null}

      {productsLoading && products.length > 0 ? (
        <div className='mb-4 flex items-center justify-center gap-2 rounded-md bg-brand-purple/10 py-2 text-sm text-muted-foreground'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand-purple' />
          Actualizando productos...
        </div>
      ) : null}

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
        availableTags={[]}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

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

      {isCreateModalOpen ? (
        <Suspense fallback={null}>
          <CreateProductModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onSuccess={handleCreateProductSuccess}
            categories={availableCategories}
            availableTags={[]}
          />
        </Suspense>
      ) : null}

      {isEditModalOpen ? (
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
      ) : null}

      {selectedProduct ? (
        <Suspense fallback={null}>
          <ProductDetailModal
            isOpen={!!selectedProduct}
            onClose={handleCloseProductDetailModal}
            product={selectedProduct}
            onEdit={product => handleEditProduct(product.id)}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

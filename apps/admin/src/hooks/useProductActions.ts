import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useProductUseCases } from '@/app/di/products';
import type { Product as DomainProduct } from '@happy-baby/domain-product';
import type { Result } from '@happy-baby/domain-shared';
import { isErr, ValidationError } from '@happy-baby/domain-shared';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  BulkProductOperation,
} from '@/components/products/types';

// Bridge: domain Product → legacy Product (keeps existing modal/page API intact).
// Relations are empty — callers only use id/name/sku/price for onSuccess callbacks.
const toPresentation = (d: DomainProduct): Product => ({
  id: d.id,
  name: d.name,
  description: d.description ?? null,
  sku: d.sku,
  price: d.price,
  salePrice: d.salePrice ?? null,
  images: d.images,
  tags: d.tags,
  attributes: d.attributes as Record<string, string>,
  isActive: d.isActive,
  stockQuantity: d.stockQuantity,
  totalStock: d.stockQuantity,
  categoryId: d.categoryId ?? null,
  rating: d.rating ?? null,
  reviewCount: d.reviewCount,
  createdAt: d.createdAt.toISOString(),
  updatedAt: d.updatedAt.toISOString(),
  currentPrice: d.salePrice ?? d.price,
  hasDiscount: d.salePrice !== null && d.salePrice < d.price,
  discountPercentage:
    d.salePrice !== null
      ? Math.round(((d.price - (d.salePrice ?? 0)) / d.price) * 100)
      : 0,
  isInStock: d.stockQuantity > 0,
  variants: [],
  cartItems: [],
  favorites: [],
  orderItems: [],
  reviews: [],
  appEvents: [],
  inventoryTransactions: [],
  stockAlerts: [],
  category: null,
});

const handleResult = <T>(
  result: Result<T>,
  fallbackMsg: string,
  setError: (msg: string) => void
): T | null => {
  if (isErr(result)) {
    const msg =
      result.error instanceof ValidationError
        ? result.error.message
        : (result.error?.message ?? fallbackMsg);
    setError(msg);
    toast.error(msg);
    return null;
  }
  return result.value;
};

export const useProductActions = () => {
  const useCases = useProductUseCases();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const createProduct = useCallback(
    async (input: CreateProductInput): Promise<Product | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.create.execute(
          input as Parameters<typeof useCases.create.execute>[0]
        );
        const product = handleResult(
          result,
          'Error al crear el producto',
          setError
        );
        if (!product) return null;
        toast.success('Producto creado exitosamente');
        return toPresentation(product);
      } finally {
        setLoading(false);
      }
    },
    [useCases.create]
  );

  const updateProduct = useCallback(
    async (id: string, input: UpdateProductInput): Promise<Product | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.update.execute(
          id,
          input as Parameters<typeof useCases.update.execute>[1]
        );
        const product = handleResult(
          result,
          'Error al actualizar el producto',
          setError
        );
        if (!product) return null;
        toast.success('Producto actualizado exitosamente');
        return toPresentation(product);
      } finally {
        setLoading(false);
      }
    },
    [useCases.update]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.delete.execute(id);
        const ok = handleResult(
          result,
          'Error al eliminar el producto',
          setError
        );
        if (!ok) return false;
        toast.success('Producto eliminado exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.delete]
  );

  const toggleProductStatus = useCallback(
    async (id: string, isActive: boolean): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.update.execute(id, { isActive });
        const product = handleResult(
          result,
          'Error al cambiar el estado del producto',
          setError
        );
        if (!product) return false;
        toast.success(
          `Producto ${isActive ? 'activado' : 'desactivado'} exitosamente`
        );
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.update]
  );

  const updateProductStock = useCallback(
    async (id: string, quantity: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.update.execute(id, {
          stockQuantity: quantity,
        });
        const product = handleResult(
          result,
          'Error al actualizar el stock',
          setError
        );
        if (!product) return false;
        toast.success('Stock actualizado exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.update]
  );

  const bulkUpdateProducts = useCallback(
    async (operations: BulkProductOperation[]): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const tasks = operations.flatMap(op =>
          op.ids.map(id => {
            switch (op.operation) {
              case 'activate':
                return useCases.update.execute(id, { isActive: true });
              case 'deactivate':
                return useCases.update.execute(id, { isActive: false });
              case 'updateCategory':
                return op.data?.['categoryId']
                  ? useCases.update.execute(id, {
                      categoryId: op.data['categoryId'] as string,
                    })
                  : Promise.resolve(null);
              case 'updateStock':
                return op.data?.['stockQuantity'] !== undefined
                  ? useCases.update.execute(id, {
                      stockQuantity: op.data['stockQuantity'] as number,
                    })
                  : Promise.resolve(null);
              case 'delete':
                return useCases.delete.execute(id);
              default:
                return Promise.resolve(null);
            }
          })
        );
        const results = await Promise.allSettled(tasks);
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        if (successful > 0) toast.success(`${successful} productos procesados`);
        if (failed > 0) toast.error(`${failed} productos fallaron`);
        return successful > 0;
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : 'Error en operación masiva';
        setError(msg);
        toast.error(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [useCases.update, useCases.delete]
  );

  const uploadProductImage = useCallback(
    async (file: File, entityId: string): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.uploadImage.execute(file, entityId);
        return handleResult(result, 'Error al subir la imagen', setError);
      } finally {
        setLoading(false);
      }
    },
    [useCases.uploadImage]
  );

  return {
    loading,
    error,
    clearError,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    updateProductStock,
    bulkUpdateProducts,
    uploadProductImage,
    // kept for backward compat with legacy form components
    validateProductInput: () => [] as string[],
  };
};

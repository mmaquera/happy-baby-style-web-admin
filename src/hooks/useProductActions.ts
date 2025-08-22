import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  useUploadProductImage 
} from './useProductsGraphQL';
import type { 
  Product, 
  CreateProductInput, 
  UpdateProductInput,
  ProductFilterInput,
  BulkProductOperation 
} from '@/components/products/types';

interface UseProductActionsReturn {
  // State
  loading: boolean;
  error: string | null;
  
  // Actions
  createProduct: (input: CreateProductInput) => Promise<Product | null>;
  updateProduct: (id: string, input: UpdateProductInput) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductStatus: (id: string, isActive: boolean) => Promise<boolean>;
  updateProductStock: (id: string, quantity: number) => Promise<boolean>;
  bulkUpdateProducts: (operations: BulkProductOperation[]) => Promise<boolean>;
  uploadProductImage: (file: File, entityId: string) => Promise<string | null>;
  
  // Utilities
  clearError: () => void;
  validateProductInput: (input: CreateProductInput | UpdateProductInput) => string[];
}

export const useProductActions = (): UseProductActionsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GraphQL hooks
  const { create: createProductMutation, loading: creating } = useCreateProduct();
  const { update: updateProductMutation, loading: updating } = useUpdateProduct();
  const { remove: deleteProductMutation, loading: deleting } = useDeleteProduct();
  const { upload: uploadImageMutation, loading: uploading } = useUploadProductImage();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const validateProductInput = useCallback((input: CreateProductInput | UpdateProductInput): string[] => {
    const errors: string[] = [];

    // Required fields validation
    if (!input.name?.trim()) {
      errors.push('El nombre del producto es requerido');
    }

    if (!input.sku?.trim()) {
      errors.push('El SKU es requerido');
    }

    if (input.price !== undefined && input.price !== null && (input.price <= 0)) {
      errors.push('El precio debe ser mayor a 0');
    }

    if (input.stockQuantity !== undefined && input.stockQuantity !== null && input.stockQuantity < 0) {
      errors.push('El stock no puede ser negativo');
    }

    // Business logic validation
    if (input.salePrice !== undefined && input.salePrice !== null && input.price !== undefined && input.price !== null) {
      if (input.salePrice >= input.price) {
        errors.push('El precio de oferta debe ser menor al precio regular');
      }
    }

    if (input.sku && input.sku.length < 3) {
      errors.push('El SKU debe tener al menos 3 caracteres');
    }

    if (input.name && input.name.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    return errors;
  }, []);

  const createProduct = useCallback(async (input: CreateProductInput): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      // Validate input
      const validationErrors = validateProductInput(input);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        toast.error('Error de validación: ' + validationErrors.join(', '));
        return null;
      }

      const result = await createProductMutation(input);
      
      // 🔍 Log para debugging - verificar respuesta del servidor
      console.log('🔍 useProductActions - Respuesta del servidor:', {
        success: result.data?.createProduct?.success,
        message: result.data?.createProduct?.message,
        code: result.data?.createProduct?.code,
        hasEntity: !!result.data?.createProduct?.data?.entity
      });
      
      // ✅ Verificar primero si la operación fue exitosa según el servidor
      if (result.data?.createProduct?.success === false) {
        const serverMessage = result.data.createProduct.message || 'Error del servidor';
        console.log('❌ useProductActions - Servidor reportó error:', serverMessage);
        throw new Error(serverMessage);
      }
      
      // ✅ Verificar que hay datos de entidad
      if (result.data?.createProduct?.data?.entity) {
        // ✅ Removido toast duplicado - useProductsGraphQL.onCompleted ya lo muestra
        // Convert the GraphQL result to our Product type
        const graphqlProduct = result.data.createProduct.data.entity;
        const newProduct: Product = {
          ...graphqlProduct,
          variants: [],
          cartItems: [],
          favorites: [],
          orderItems: [],
          reviews: [],
          appEvents: [],
          inventoryTransactions: [],
          stockAlerts: [],
          category: graphqlProduct.category ? {
            ...graphqlProduct.category,
            description: null,
            isActive: true,
            sortOrder: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            products: []
          } : null
        };
        return newProduct;
      } else {
        throw new Error('No se pudo crear el producto - respuesta inválida del servidor');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear el producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [createProductMutation, validateProductInput]);

  const updateProduct = useCallback(async (id: string, input: UpdateProductInput): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      // Validate input
      const validationErrors = validateProductInput(input);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        toast.error('Error de validación: ' + validationErrors.join(', '));
        return null;
      }

      const result = await updateProductMutation(id, input);
      
      // ✅ Verificar primero si la operación fue exitosa según el servidor
      if (result.data?.updateProduct?.success === false) {
        const serverMessage = result.data.updateProduct.message || 'Error del servidor';
        throw new Error(serverMessage);
      }
      
      // ✅ Verificar que hay datos de entidad
      if (result.data?.updateProduct?.data?.entity) {
        // ✅ Removido toast duplicado - useProductsGraphQL.onCompleted ya lo muestra
        // Convert the GraphQL result to our Product type
        const graphqlProduct = result.data.updateProduct.data.entity;
        const updatedProduct: Product = {
          ...graphqlProduct,
          variants: [],
          cartItems: [],
          favorites: [],
          orderItems: [],
          reviews: [],
          appEvents: [],
          inventoryTransactions: [],
          stockAlerts: [],
          category: graphqlProduct.category ? {
            ...graphqlProduct.category,
            description: null,
            isActive: true,
            sortOrder: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            products: []
          } : null
        };
        return updatedProduct;
      } else {
        throw new Error('No se pudo actualizar el producto - respuesta inválida del servidor');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar el producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateProductMutation, validateProductInput]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteProductMutation(id);
      toast.success('Producto eliminado exitosamente');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar el producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [deleteProductMutation]);

  const toggleProductStatus = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateProductMutation(id, { isActive });
      
      // ✅ Verificar primero si la operación fue exitosa según el servidor
      if (result.data?.updateProduct?.success === false) {
        const serverMessage = result.data.updateProduct.message || 'Error del servidor';
        throw new Error(serverMessage);
      }
      
      // ✅ Verificar que hay datos de entidad
      if (result.data?.updateProduct?.data?.entity) {
        const status = isActive ? 'activado' : 'desactivado';
        // ✅ Mantener toast específico para toggle status (diferente al update genérico)
        toast.success(`Producto ${status} exitosamente`);
        return true;
      } else {
        throw new Error('No se pudo cambiar el estado del producto - respuesta inválida del servidor');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cambiar el estado del producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateProductMutation]);

  const updateProductStock = useCallback(async (id: string, quantity: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (quantity < 0) {
        throw new Error('La cantidad de stock no puede ser negativa');
      }

      const result = await updateProductMutation(id, { stockQuantity: quantity });
      
      // ✅ Verificar primero si la operación fue exitosa según el servidor
      if (result.data?.updateProduct?.success === false) {
        const serverMessage = result.data.updateProduct.message || 'Error del servidor';
        throw new Error(serverMessage);
      }
      
      // ✅ Verificar que hay datos de entidad
      if (result.data?.updateProduct?.data?.entity) {
        // ✅ Mantener toast específico para stock (diferente al update genérico)
        toast.success('Stock actualizado exitosamente');
        return true;
      } else {
        throw new Error('No se pudo actualizar el stock del producto - respuesta inválida del servidor');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar el stock';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateProductMutation]);

  const bulkUpdateProducts = useCallback(async (operations: BulkProductOperation[]): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled(
        operations.map(async (operation) => {
          const firstId = operation.ids[0];
          if (!firstId) return null;

          switch (operation.operation) {
            case 'activate':
              return updateProductMutation(firstId, { isActive: true });
            case 'deactivate':
              return updateProductMutation(firstId, { isActive: false });
            case 'updateCategory':
              if (operation.data && operation.data['categoryId']) {
                return updateProductMutation(firstId, { categoryId: operation.data['categoryId'] });
              }
              break;
            case 'updateStock':
              if (operation.data && operation.data['stockQuantity'] !== undefined) {
                return updateProductMutation(firstId, { stockQuantity: operation.data['stockQuantity'] });
              }
              break;
            case 'delete':
              return deleteProductMutation(firstId);
            default:
              return null;
          }
          return null;
        })
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      if (successful > 0) {
        toast.success(`${successful} productos procesados exitosamente`);
      }
      
      if (failed > 0) {
        toast.error(`${failed} productos fallaron al procesarse`);
      }

      return successful > 0;
    } catch (err: any) {
      const errorMessage = err.message || 'Error en la operación masiva';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateProductMutation, deleteProductMutation]);

  const uploadProductImage = useCallback(async (file: File, entityId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // ✅ VERIFICACIÓN: Logs para diagnosticar el problema
      console.log('📁 uploadProductImage - Archivo recibido:', file);
      console.log('📁 uploadProductImage - Tipo MIME:', file?.type);
      console.log('📁 uploadProductImage - Tamaño:', file?.size);
      console.log('📁 uploadProductImage - Nombre:', file?.name);
      console.log('📁 uploadProductImage - Es File?:', file instanceof File);
      console.log('📁 uploadProductImage - Es Blob?:', file instanceof Blob);
      
      // ✅ Validación de archivo antes de intentar upload
      if (!file) {
        throw new Error('No se seleccionó ningún archivo');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 5MB');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no soportado. Solo JPG, PNG y WebP');
      }

      // ✅ Upload al servidor
      const result = await uploadImageMutation(file, entityId);
      
      // ✅ Verificar respuesta del servidor
      if (result.data?.uploadImage?.success && result.data?.uploadImage?.data?.url) {
        // ✅ Solo mostrar toast de éxito si realmente fue exitoso
        return result.data.uploadImage.data.url;
      } else {
        // ✅ Usar mensaje del servidor o mensaje por defecto
        const errorMessage = result.data?.uploadImage?.message || 'No se pudo subir la imagen';
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      // ✅ Manejo centralizado de errores
      const errorMessage = err.message || 'Error al subir la imagen';
      setError(errorMessage);
      
      // ✅ Solo mostrar toast de error, no de éxito
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [uploadImageMutation]);

  return {
    // State
    loading: loading || creating || updating || deleting || uploading,
    error,
    
    // Actions
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    updateProductStock,
    bulkUpdateProducts,
    uploadProductImage,
    
    // Utilities
    clearError,
    validateProductInput
  };
};

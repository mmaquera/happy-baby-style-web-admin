import { useState, useCallback, useEffect } from 'react';
import { productFormSchema } from '@happy-baby/domain-shared';
import type { Product, ProductFormData } from '../types/product';
import type { UploadResult } from '../types/upload';

const generateShortSku = () =>
  `SKU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

export interface UseProductFormReturn {
  formData: ProductFormData;
  errors: Record<string, string>;
  successMessage: string;
  setSuccessMessage: (msg: string) => void;
  setErrors: (e: Record<string, string>) => void;
  sessionId: string;
  handleInputChange: (field: keyof ProductFormData, value: unknown) => void;
  handleTagToggle: (tag: string) => void;
  handleImageUploadSuccess: (result: UploadResult) => void;
  removeImage: (index: number) => void;
  newAttributeKey: string;
  newAttributeValue: string;
  setNewAttributeKey: (v: string) => void;
  setNewAttributeValue: (v: string) => void;
  addAttribute: () => void;
  removeAttribute: (key: string) => void;
  newTagName: string;
  newTagColor: string;
  newTagDescription: string;
  setNewTagName: (v: string) => void;
  setNewTagColor: (v: string) => void;
  setNewTagDescription: (v: string) => void;
  handleGenerateSku: () => void;
  validateForm: () => boolean;
  resetForm: (autoSku?: boolean) => void;
}

const emptyFormData = (withSku = false): ProductFormData => ({
  name: '',
  description: '',
  price: '',
  salePrice: '',
  sku: withSku ? generateShortSku() : '',
  categoryId: '',
  stockQuantity: '0',
  tags: [],
  isActive: true,
  images: [],
  attributes: {},
});

const productToFormData = (product: Product): ProductFormData => ({
  name: product.name || '',
  description: product.description || '',
  price: product.price?.toString() || '',
  salePrice: product.salePrice?.toString() || '',
  sku: product.sku || '',
  categoryId: product.categoryId || product.category?.id || '',
  stockQuantity: product.stockQuantity?.toString() || '0',
  tags: product.tags || [],
  isActive: product.isActive ?? true,
  images: product.images || [],
  attributes: (product.attributes as Record<string, string>) || {},
});

export const useProductForm = (
  product: Product | null = null,
  prefix = 'product-session'
): UseProductFormReturn => {
  const [sessionId] = useState(
    () => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  const [formData, setFormData] = useState<ProductFormData>(() =>
    product ? productToFormData(product) : emptyFormData(true)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [newAttributeKey, setNewAttributeKey] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ff6b6b');
  const [newTagDescription, setNewTagDescription] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(productToFormData(product));
      setErrors({});
      setSuccessMessage('');
    }
  }, [product]);

  const handleInputChange = useCallback(
    (field: keyof ProductFormData, value: unknown) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field as string]) {
        setErrors(prev => ({ ...prev, [field as string]: '' }));
      }
    },
    [errors]
  );

  const handleTagToggle = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const handleImageUploadSuccess = useCallback((result: UploadResult) => {
    if (result.success && result.url) {
      setFormData(prev => ({ ...prev, images: [...prev.images, result.url!] }));
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const addAttribute = useCallback(() => {
    if (newAttributeKey.trim() && newAttributeValue.trim()) {
      setFormData(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [newAttributeKey.trim()]: newAttributeValue.trim(),
        },
      }));
      setNewAttributeKey('');
      setNewAttributeValue('');
    }
  }, [newAttributeKey, newAttributeValue]);

  const removeAttribute = useCallback((key: string) => {
    setFormData(prev => {
      const attrs = { ...prev.attributes };
      delete attrs[key];
      return { ...prev, attributes: attrs };
    });
  }, []);

  const handleGenerateSku = useCallback(() => {
    const sku = generateShortSku();
    setFormData(prev => ({ ...prev, sku }));
    if (errors['sku']) setErrors(prev => ({ ...prev, sku: '' }));
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const result = productFormSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string | undefined;
      if (key && !newErrors[key]) newErrors[key] = issue.message;
    }
    setErrors(newErrors);
    return false;
  }, [formData]);

  const resetForm = useCallback((autoSku = false) => {
    setFormData(emptyFormData(autoSku));
    setErrors({});
    setSuccessMessage('');
    setNewAttributeKey('');
    setNewAttributeValue('');
    setNewTagName('');
    setNewTagColor('#ff6b6b');
    setNewTagDescription('');
  }, []);

  return {
    formData,
    errors,
    successMessage,
    setSuccessMessage,
    setErrors,
    sessionId,
    handleInputChange,
    handleTagToggle,
    handleImageUploadSuccess,
    removeImage,
    newAttributeKey,
    newAttributeValue,
    setNewAttributeKey,
    setNewAttributeValue,
    addAttribute,
    removeAttribute,
    newTagName,
    newTagColor,
    newTagDescription,
    setNewTagName,
    setNewTagColor,
    setNewTagDescription,
    handleGenerateSku,
    validateForm,
    resetForm,
  };
};

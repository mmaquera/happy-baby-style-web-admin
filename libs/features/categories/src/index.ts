// DI / Context
export { CategoryProvider, useCategoryUseCases, CategoryContext } from './di';
export type { CategoryUseCases } from './di';

// Components
export { CategoryCard } from './components/CategoryCard';
export { CategoryGrid } from './components/CategoryGrid';
export { CategoryListView } from './components/CategoryListView';
export { CategoryHeader } from './components/CategoryHeader';
export { CategoryFilters } from './components/CategoryFilters';
export { CategoryDetailModal } from './components/CategoryDetailModal';
export { CreateCategoryModal } from './components/CreateCategoryModal';
export { EditCategoryModal } from './components/EditCategoryModal';
export { SVGUpload } from './components/SVGUpload';

// Hooks
export { useCategories } from './hooks/useCategories';
export { useCategoriesGraphQL } from './hooks/useCategoriesGraphQL';
export { useCategoryActions } from './hooks/useCategoryActions';
export { useCategoryFilters } from './hooks/useCategoryFilters';
export { useCreateCategory } from './hooks/useCreateCategory';
export { useUpdateCategory } from './hooks/useUpdateCategory';
export { useSVGUpload } from './hooks/useSVGUpload';

// Types
export type {
  Category,
  CategoryFilterInput,
  CategorySortInput,
  CategoryFilters as CategoryFiltersState,
} from './types/category';
export type {
  SVGUploadProps,
  SVGUploadResult,
  SVGUploadProgress,
  SVGUploadError,
  SVGValidationResult,
  UseSVGUploadReturn,
} from './types/svgUpload';
export { SVG_UPLOAD_DEFAULTS, SVG_VALIDATION_RULES } from './types/svgUpload';

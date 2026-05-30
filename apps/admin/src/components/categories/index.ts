// =====================================================
// CATEGORIES MODULE EXPORTS
// =====================================================
// Following Clean Architecture principles and module organization

// Core Components
export { CategoryCard } from './CategoryCard';
export { CategoryGrid } from './CategoryGrid';
export { CategoryListView } from './CategoryListView';
export { CategoryHeader } from './CategoryHeader';
export { CategoryFilters } from './CategoryFilters';

// Modal Components
export { CreateCategoryModal } from './CreateCategoryModal';
export { EditCategoryModal } from './EditCategoryModal';
export { CategoryDetailModal } from './CategoryDetailModal';

// SVG Upload Component
export { SVGUpload } from './SVGUpload';
export type { SVGUploadProps, SVGUploadResult } from './SVGUpload';

// Types
export type { Category } from './types';

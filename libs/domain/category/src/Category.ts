export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
  slug?: string;
  image?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string | null;
  slug?: string;
  image?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CategoryFilter {
  search?: string;
  isActive?: boolean;
}

export interface CategoryPage {
  items: Category[];
  total: number;
  hasMore: boolean;
}

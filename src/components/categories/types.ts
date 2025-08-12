export interface Category {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

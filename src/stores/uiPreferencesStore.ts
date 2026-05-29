import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'grid' | 'list';

interface UIPreferencesStore {
  productsViewMode: ViewMode;
  categoriesViewMode: ViewMode;
  setProductsViewMode: (mode: ViewMode) => void;
  setCategoriesViewMode: (mode: ViewMode) => void;
}

export const useUIPreferencesStore = create<UIPreferencesStore>()(
  persist(
    set => ({
      productsViewMode: 'list',
      categoriesViewMode: 'list',
      setProductsViewMode: (mode: ViewMode) =>
        set({ productsViewMode: mode }),
      setCategoriesViewMode: (mode: ViewMode) =>
        set({ categoriesViewMode: mode }),
    }),
    {
      name: 'ui-preferences',
      partialize: state => ({
        productsViewMode: state.productsViewMode,
        categoriesViewMode: state.categoriesViewMode,
      }),
    }
  )
);

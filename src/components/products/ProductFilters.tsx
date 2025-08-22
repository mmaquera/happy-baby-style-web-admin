import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Search,
  Filter,
  X,
  Tag
} from 'lucide-react';

interface ProductFiltersProps {
  filters: {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  availableTags: string[];
  onFilterChange: (filters: Partial<ProductFiltersProps['filters']>) => void;
  onClearFilters: () => void;
}

const FiltersContainer = styled(Card)`
  margin-bottom: ${theme.spacing[6]};
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
`;

const FiltersTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const ClearButton = styled(Button)`
  font-size: ${theme.fontSizes.sm};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
`;

const Select = styled.select`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.primaryPurple};
    box-shadow: 0 0 0 3px ${theme.colors.primaryPurple}20;
  }

  &:hover {
    border-color: ${theme.colors.border.medium};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${theme.colors.primaryPurple};
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
`;

const PriceRangeContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
`;

const PriceInput = styled(Input)`
  flex: 1;
`;

const PriceSeparator = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

const TagChip = styled.div<{ isSelected: boolean }>`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${({ isSelected }) => 
    isSelected ? theme.colors.primaryPurple : theme.colors.background.accent};
  color: ${({ isSelected }) => 
    isSelected ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  border: 1px solid ${({ isSelected }) => 
    isSelected ? theme.colors.primaryPurple : theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  &:hover {
    background: ${({ isSelected }) => 
      isSelected ? theme.colors.primaryPurple : theme.colors.softPurple};
    transform: translateY(-1px);
  }
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing[4]};
`;

const ActiveFilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${theme.colors.primaryPurple};
  color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.white};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;

  &:hover {
    background: ${theme.colors.white}20;
  }
`;

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  categories,
  availableTags,
  onFilterChange,
  onClearFilters
}) => {
  const handleInputChange = (field: keyof ProductFiltersProps['filters'], value: any) => {
    onFilterChange({ [field]: value });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onFilterChange({ tags: newTags });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId) count++;
    if (filters.isActive !== undefined) count++;
    if (filters.inStock !== undefined) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>
          <Filter size={16} />
          Filtros de Productos
        </FiltersTitle>
        {hasActiveFilters && (
          <ClearButton
            variant="ghost"
            size="small"
            onClick={onClearFilters}
          >
            <X size={14} />
            Limpiar Filtros
          </ClearButton>
        )}
      </FiltersHeader>

      <FiltersGrid>
        <FilterGroup>
          <FilterLabel>Buscar Productos</FilterLabel>
          <Input
            placeholder="Nombre, descripción o SKU..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Categoría</FilterLabel>
          <Select
            value={filters.categoryId || ''}
            onChange={(e) => handleInputChange('categoryId', e.target.value || undefined)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Estado</FilterLabel>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="isActive"
              checked={filters.isActive !== false}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
            <CheckboxLabel htmlFor="isActive">Solo productos activos</CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="inStock"
              checked={filters.inStock !== false}
              onChange={(e) => handleInputChange('inStock', e.target.checked)}
            />
            <CheckboxLabel htmlFor="inStock">Solo en stock</CheckboxLabel>
          </CheckboxContainer>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Rango de Precios</FilterLabel>
          <PriceRangeContainer>
            <PriceInput
              type="number"
              placeholder="Mínimo"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              min="0"
              step="0.01"
            />
            <PriceSeparator>-</PriceSeparator>
            <PriceInput
              type="number"
              placeholder="Máximo"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              min="0"
              step="0.01"
            />
          </PriceRangeContainer>
        </FilterGroup>
      </FiltersGrid>

      {availableTags.length > 0 && (
        <FilterGroup>
          <FilterLabel>Etiquetas</FilterLabel>
          <TagsContainer>
            {availableTags.map(tag => (
              <TagChip
                key={tag}
                isSelected={filters.tags?.includes(tag) || false}
                onClick={() => handleTagToggle(tag)}
              >
                <Tag size={12} />
                {tag}
              </TagChip>
            ))}
          </TagsContainer>
        </FilterGroup>
      )}

      {hasActiveFilters && (
        <ActiveFiltersContainer>
          <span style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text.secondary }}>
            Filtros activos:
          </span>
          
          {filters.search && (
            <ActiveFilterTag>
              Búsqueda: "{filters.search}"
              <RemoveFilterButton onClick={() => handleInputChange('search', '')}>
                <X size={12} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}
          
          {filters.categoryId && (
            <ActiveFilterTag>
              Categoría: {categories.find(c => c.id === filters.categoryId)?.name}
              <RemoveFilterButton onClick={() => handleInputChange('categoryId', undefined)}>
                <X size={12} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}
          
          {filters.minPrice && (
            <ActiveFilterTag>
              Precio mínimo: S/ {filters.minPrice}
              <RemoveFilterButton onClick={() => handleInputChange('minPrice', undefined)}>
                <X size={12} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}
          
          {filters.maxPrice && (
            <ActiveFilterTag>
              Precio máximo: S/ {filters.maxPrice}
              <RemoveFilterButton onClick={() => handleInputChange('maxPrice', undefined)}>
                <X size={12} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}
          
          {filters.tags?.map(tag => (
            <ActiveFilterTag key={tag}>
              Etiqueta: {tag}
              <RemoveFilterButton onClick={() => handleTagToggle(tag)}>
                <X size={12} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          ))}
        </ActiveFiltersContainer>
      )}
    </FiltersContainer>
  );
};

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  Search,
  Filter,
  X,
  RefreshCw,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  FileText,
  Package,
  Calendar,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CategoryFilters as CategoryFiltersType } from './types';

interface CategoryFiltersProps {
  filters: CategoryFiltersType;
  onFiltersChange: (filters: CategoryFiltersType) => void;
  onClearFilters: () => void;
  loading?: boolean;
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

const FiltersActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
`;

const FiltersForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing[4]};
  align-items: end;
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
`;

const StatusToggleContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
`;

const StatusToggleButton = styled.button<{
  isActive: boolean;
  isSelected: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid
    ${({ isSelected, isActive }) =>
      isSelected
        ? isActive
          ? theme.colors.success
          : theme.colors.warning
        : theme.colors.border.light};
  background: ${({ isSelected, isActive }) =>
    isSelected
      ? isActive
        ? theme.colors.success + '15'
        : theme.colors.warning + '15'
      : theme.colors.white};
  color: ${({ isSelected, isActive }) =>
    isSelected
      ? isActive
        ? theme.colors.success
        : theme.colors.warning
      : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${({ isSelected, isActive }) =>
      isSelected
        ? isActive
          ? theme.colors.success + '25'
          : theme.colors.warning + '25'
        : theme.colors.background.accent};
    border-color: ${({ isActive }) =>
      isActive ? theme.colors.success : theme.colors.warning};
  }

  svg {
    width: 16px;
    height: 16px;
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
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
`;

const DateInput = styled(Input)`
  flex: 1;
`;

const DateSeparator = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
`;

const ProductsRangeContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
`;

const NumberInput = styled(Input)`
  flex: 1;
`;

const RangeSeparator = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
`;

const CollapsibleSection = styled.div`
  margin-top: ${theme.spacing[4]};
`;

const CollapsibleHeader = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.secondary};
  transition: color ${theme.transitions.base};

  &:hover {
    color: ${theme.colors.text.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'grid' : 'none')};
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.border.light};
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[4]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.border.light};
`;

const ActiveFilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${theme.colors.primaryPurple + '15'};
  border: 1px solid ${theme.colors.primaryPurple + '30'};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primaryPurple};
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primaryPurple};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.primaryPurple + '25'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== filters.search) {
        handleInputChange('search', searchValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Update search value when filters change externally
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  // Handle input changes with immediate application
  const handleInputChange = useCallback(
    (key: keyof CategoryFiltersType, value: CategoryFiltersType[typeof key]) => {
      const newFilters = { ...filters, [key]: value };
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  // Handle search input changes (with debouncing)
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // Clear all filters
  const handleClearAll = useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  // Remove specific filter
  const handleRemoveFilter = useCallback(
    (key: keyof CategoryFiltersType) => {
      const { [key]: _removed, ...rest } = filters;
      onFiltersChange(rest as CategoryFiltersType);
    },
    [filters, onFiltersChange]
  );

  // Get active filters count
  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof CategoryFiltersType];
    return value !== undefined && value !== '' && value !== null;
  }).length;

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>
          <Filter size={20} />
          Filtros de Categorías
        </FiltersTitle>

        <FiltersActions>
          {activeFiltersCount > 0 && (
            <Button
              variant='ghost'
              size='small'
              onClick={handleClearAll}
              disabled={loading}
            >
              <X size={16} />
              Limpiar Todo
            </Button>
          )}

          <Button
            variant='outline'
            size='small'
            onClick={handleClearAll}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Restablecer
          </Button>
        </FiltersActions>
      </FiltersHeader>

      <FiltersForm>
        {/* Search Filter */}
        <FilterField>
          <FilterLabel htmlFor='search'>Buscar categorías</FilterLabel>
          <Input
            id='search'
            type='text'
            placeholder='Buscar por nombre, descripción o slug...'
            value={searchValue}
            onChange={e => handleSearchChange(e.target.value)}
            disabled={loading}
            icon={<Search size={16} />}
          />
        </FilterField>

        {/* Status Filter */}
        <FilterField>
          <FilterLabel>Estado de la categoría</FilterLabel>
          <StatusToggleContainer>
            <StatusToggleButton
              isActive={true}
              isSelected={filters.isActive === true}
              onClick={() =>
                handleInputChange(
                  'isActive',
                  filters.isActive === true ? undefined : true
                )
              }
              disabled={loading}
            >
              <CheckCircle size={16} />
              Activas
            </StatusToggleButton>

            <StatusToggleButton
              isActive={false}
              isSelected={filters.isActive === false}
              onClick={() =>
                handleInputChange(
                  'isActive',
                  filters.isActive === false ? undefined : false
                )
              }
              disabled={loading}
            >
              <XCircle size={16} />
              Inactivas
            </StatusToggleButton>
          </StatusToggleContainer>
        </FilterField>

        {/* Content Filters */}
        <FilterField>
          <FilterLabel>Contenido</FilterLabel>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing[2],
            }}
          >
            <CheckboxContainer>
              <Checkbox
                type='checkbox'
                id='hasImage'
                checked={filters.hasImage === true}
                onChange={e =>
                  handleInputChange(
                    'hasImage',
                    e.target.checked ? true : undefined
                  )
                }
              />
              <CheckboxLabel htmlFor='hasImage'>
                <ImageIcon size={14} />
                Con imagen
              </CheckboxLabel>
            </CheckboxContainer>

            <CheckboxContainer>
              <Checkbox
                type='checkbox'
                id='hasDescription'
                checked={filters.hasDescription === true}
                onChange={e =>
                  handleInputChange(
                    'hasDescription',
                    e.target.checked ? true : undefined
                  )
                }
              />
              <CheckboxLabel htmlFor='hasDescription'>
                <FileText size={14} />
                Con descripción
              </CheckboxLabel>
            </CheckboxContainer>
          </div>
        </FilterField>
      </FiltersForm>

      {/* Advanced Filters Section */}
      <CollapsibleSection>
        <CollapsibleHeader
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
          Filtros Avanzados
        </CollapsibleHeader>

        <CollapsibleContent isOpen={showAdvancedFilters}>
          {/* Products Filter */}
          <FilterField>
            <FilterLabel>Productos</FilterLabel>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing[2],
              }}
            >
              <CheckboxContainer>
                <Checkbox
                  type='checkbox'
                  id='hasProducts'
                  checked={filters.hasProducts === true}
                  onChange={e =>
                    handleInputChange(
                      'hasProducts',
                      e.target.checked ? true : undefined
                    )
                  }
                />
                <CheckboxLabel htmlFor='hasProducts'>
                  <Package size={14} />
                  Con productos
                </CheckboxLabel>
              </CheckboxContainer>

              <ProductsRangeContainer>
                <NumberInput
                  type='number'
                  placeholder='Mín. productos'
                  value={filters.minProducts || ''}
                  onChange={e =>
                    handleInputChange(
                      'minProducts',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  min='0'
                />
                <RangeSeparator>-</RangeSeparator>
                <NumberInput
                  type='number'
                  placeholder='Máx. productos'
                  value={filters.maxProducts || ''}
                  onChange={e =>
                    handleInputChange(
                      'maxProducts',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  min='0'
                />
              </ProductsRangeContainer>
            </div>
          </FilterField>

          {/* Date Filters */}
          <FilterField>
            <FilterLabel>Fecha de Creación</FilterLabel>
            <DateRangeContainer>
              <DateInput
                type='date'
                value={filters.createdAfter || ''}
                onChange={e =>
                  handleInputChange('createdAfter', e.target.value || undefined)
                }
              />
              <DateSeparator>-</DateSeparator>
              <DateInput
                type='date'
                value={filters.createdBefore || ''}
                onChange={e =>
                  handleInputChange(
                    'createdBefore',
                    e.target.value || undefined
                  )
                }
              />
            </DateRangeContainer>
          </FilterField>

          <FilterField>
            <FilterLabel>Fecha de Actualización</FilterLabel>
            <DateRangeContainer>
              <DateInput
                type='date'
                value={filters.updatedAfter || ''}
                onChange={e =>
                  handleInputChange('updatedAfter', e.target.value || undefined)
                }
              />
              <DateSeparator>-</DateSeparator>
              <DateInput
                type='date'
                value={filters.updatedBefore || ''}
                onChange={e =>
                  handleInputChange(
                    'updatedBefore',
                    e.target.value || undefined
                  )
                }
              />
            </DateRangeContainer>
          </FilterField>

          {/* Sort Order Filter */}
          <FilterField>
            <FilterLabel>Orden de Clasificación</FilterLabel>
            <Input
              type='number'
              placeholder='Orden específico'
              value={filters.sortOrder || ''}
              onChange={e =>
                handleInputChange(
                  'sortOrder',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              min='0'
            />
          </FilterField>
        </CollapsibleContent>
      </CollapsibleSection>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <ActiveFilters>
          {filters.search && (
            <ActiveFilterTag>
              Búsqueda: "{filters.search}"
              <RemoveFilterButton onClick={() => handleRemoveFilter('search')}>
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.isActive === true && (
            <ActiveFilterTag>
              Solo activas
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('isActive')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.isActive === false && (
            <ActiveFilterTag>
              Solo inactivas
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('isActive')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.hasImage && (
            <ActiveFilterTag>
              Con imagen
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('hasImage')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.hasDescription && (
            <ActiveFilterTag>
              Con descripción
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('hasDescription')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.hasProducts && (
            <ActiveFilterTag>
              Con productos
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('hasProducts')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.minProducts && (
            <ActiveFilterTag>
              Min. productos: {filters.minProducts}
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('minProducts')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.maxProducts && (
            <ActiveFilterTag>
              Max. productos: {filters.maxProducts}
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('maxProducts')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.createdAfter && (
            <ActiveFilterTag>
              Creado después: {filters.createdAfter}
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('createdAfter')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.createdBefore && (
            <ActiveFilterTag>
              Creado antes: {filters.createdBefore}
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('createdBefore')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}

          {filters.sortOrder && (
            <ActiveFilterTag>
              Orden: {filters.sortOrder}
              <RemoveFilterButton
                onClick={() => handleRemoveFilter('sortOrder')}
              >
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}
        </ActiveFilters>
      )}
    </FiltersContainer>
  );
};

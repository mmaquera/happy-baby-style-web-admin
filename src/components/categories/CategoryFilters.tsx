import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Filter, 
  X, 
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface CategoryFiltersProps {
  filters: {
    isActive?: boolean;
    search?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const FiltersContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

const StatusToggleButton = styled.button<{ isActive: boolean; isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${({ isSelected, isActive }) => 
    isSelected 
      ? (isActive ? theme.colors.success : theme.colors.warning)
      : theme.colors.border.light
  };
  background: ${({ isSelected, isActive }) => 
    isSelected 
      ? (isActive ? theme.colors.success + '15' : theme.colors.warning + '15')
      : theme.colors.white
  };
  color: ${({ isSelected, isActive }) => 
    isSelected 
      ? (isActive ? theme.colors.success : theme.colors.warning)
      : theme.colors.text.secondary
  };
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${({ isSelected, isActive }) => 
      isSelected 
        ? (isActive ? theme.colors.success + '25' : theme.colors.warning + '25')
        : theme.colors.background.accent
    };
    border-color: ${({ isActive }) => 
      isActive ? theme.colors.success : theme.colors.warning
    };
  }

  svg {
    width: 16px;
    height: 16px;
  }
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
  loading = false
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Handle input changes
  const handleInputChange = useCallback((key: string, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  // Clear all filters
  const handleClearAll = useCallback(() => {
    setLocalFilters({});
    onClearFilters();
  }, [onClearFilters]);

  // Remove specific filter
  const handleRemoveFilter = useCallback((key: string) => {
    const newFilters = { ...localFilters };
    delete (newFilters as any)[key];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  // Get active filters count
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof typeof filters] !== undefined && 
    filters[key as keyof typeof filters] !== ''
  ).length;

  // Check if filters have changed
  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);

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
              variant="ghost"
              size="small"
              onClick={handleClearAll}
              disabled={loading}
            >
              <X size={16} />
              Limpiar Todo
            </Button>
          )}
          
          <Button
            variant="outline"
            size="small"
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
          <FilterLabel htmlFor="search">Buscar categorías</FilterLabel>
          <Input
            id="search"
            type="text"
            placeholder="Buscar por nombre, descripción o slug..."
            value={localFilters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
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
              isSelected={localFilters.isActive === true}
              onClick={() => handleInputChange('isActive', 
                localFilters.isActive === true ? undefined : true
              )}
              disabled={loading}
            >
              <CheckCircle size={16} />
              Activas
            </StatusToggleButton>
            
            <StatusToggleButton
              isActive={false}
              isSelected={localFilters.isActive === false}
              onClick={() => handleInputChange('isActive', 
                localFilters.isActive === false ? undefined : false
              )}
              disabled={loading}
            >
              <XCircle size={16} />
              Inactivas
            </StatusToggleButton>
          </StatusToggleContainer>
        </FilterField>

        {/* Apply Button */}
        <FilterField>
          <Button
            onClick={handleApplyFilters}
            disabled={loading || !hasChanges}
            style={{ height: '40px' }}
          >
            Aplicar Filtros
          </Button>
        </FilterField>
      </FiltersForm>

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
              <RemoveFilterButton onClick={() => handleRemoveFilter('isActive')}>
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}
          
          {filters.isActive === false && (
            <ActiveFilterTag>
              Solo inactivas
              <RemoveFilterButton onClick={() => handleRemoveFilter('isActive')}>
                <X size={14} />
              </RemoveFilterButton>
            </ActiveFilterTag>
          )}
        </ActiveFilters>
      )}
    </FiltersContainer>
  );
};

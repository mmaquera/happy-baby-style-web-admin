import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  List, Grid3X3, Eye, Edit, Trash2, Folder, CheckCircle, AlertTriangle, XCircle, Tag, Filter, Search, SortAsc, SortDesc, MoreHorizontal, Download, Upload, Settings
} from 'lucide-react';

import { Category } from './types';

interface CategoryListViewProps {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string, isActive: boolean) => void;
  onViewDetails: (categoryId: string) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onFilter: (filters: any) => void;
}

const ListViewContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  overflow: hidden;
`;

const ListViewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.background.light};
  flex-wrap: wrap;
  gap: ${theme.spacing[3]};
`;

const ViewToggleContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
`;

const ViewToggleButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${({ isActive }) => isActive ? theme.colors.primaryPurple : theme.colors.border.light};
  background: ${({ isActive }) => isActive ? theme.colors.primaryPurple : theme.colors.white};
  color: ${({ isActive }) => isActive ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${({ isActive }) => isActive ? theme.colors.primaryPurple : theme.colors.background.accent};
    border-color: ${theme.colors.primaryPurple};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CategoryCount = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeights.medium};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
  flex-wrap: wrap;
`;

const CategoryTable = styled.div`
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 120px 100px 120px 120px 120px;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.background.light};
  border-bottom: 1px solid ${theme.colors.border.light};
  font-weight: ${theme.fontWeights.medium};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 60px 2fr 1fr 120px 100px 120px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 2fr 1fr 120px;
  }
`;

const CategoryRow = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 120px 100px 120px 120px 120px;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};
  align-items: center;
  transition: background ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 60px 2fr 1fr 120px 100px 120px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 2fr 1fr 120px;
  }
`;

const CategoryImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.background.light};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const CategoryName = styled.div`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.base};
`;

const CategoryDescription = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.4;
`;

const CategorySlug = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.background.accent};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  text-align: center;
`;

const CategoryStatus = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${({ isActive }) => isActive ? theme.colors.success : theme.colors.warning};
  justify-content: center;
`;

const CategorySortOrder = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
  font-weight: ${theme.fontWeights.medium};
`;

const CategoryDate = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.text.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.background.light};
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${({ isActive }) => isActive ? theme.colors.primaryPurple : theme.colors.border.light};
  background: ${({ isActive }) => isActive ? theme.colors.primaryPurple : theme.colors.white};
  color: ${({ isActive }) => isActive ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  font-size: ${theme.fontSizes.sm};

  &:hover {
    background: ${({ isActive }) => isActive ? theme.colors.primaryPurple : theme.colors.background.accent};
    border-color: ${theme.colors.primaryPurple};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CategoryListView: React.FC<CategoryListViewProps> = ({
  categories, loading = false, error = null, total, currentPage, totalPages, hasMore,
  onPageChange, onEdit, onDelete, onToggleStatus, onViewDetails, onSort, onFilter
}) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = useCallback((field: string) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  }, [sortField, sortDirection, onSort]);

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />;
  };

  if (loading) {
    return (
      <ListViewContainer>
        <div style={{ padding: theme.spacing[12], textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing[4] }}>⏳</div>
          <h3>Cargando categorías...</h3>
        </div>
      </ListViewContainer>
    );
  }

  if (error) {
    return (
      <ListViewContainer>
        <div style={{ padding: theme.spacing[12], textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing[4] }}>❌</div>
          <h3>Error al cargar categorías</h3>
          <p>{error}</p>
        </div>
      </ListViewContainer>
    );
  }

  if (categories.length === 0) {
    return (
      <ListViewContainer>
        <div style={{ padding: theme.spacing[12], textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing[4] }}>📁</div>
          <h3>No hay categorías</h3>
          <p>No se encontraron categorías para mostrar</p>
        </div>
      </ListViewContainer>
    );
  }

  return (
    <ListViewContainer>
      <ListViewHeader>
        <ViewToggleContainer>
          <ViewToggleButton isActive={true}>
            <List size={16} /> Lista
          </ViewToggleButton>
          <ViewToggleButton isActive={false}>
            <Grid3X3 size={16} /> Grid
          </ViewToggleButton>
        </ViewToggleContainer>
        <CategoryCount>Mostrando {categories.length} de {total} categorías</CategoryCount>
        <HeaderActions>
          <Button variant="outline" size="small">
            <Filter size={14} />
            Filtros
          </Button>
          <Button variant="outline" size="small">
            <Download size={14} />
            Exportar
          </Button>
          <Button variant="outline" size="small">
            <Settings size={14} />
            Acciones
          </Button>
        </HeaderActions>
      </ListViewHeader>

      <CategoryTable>
        <TableHeader>
          <div>Imagen</div>
          <div>Información</div>
          <div>Slug</div>
          <div>Estado</div>
          <div>Orden</div>
          <div>Creado</div>
          <div>Actualizado</div>
          <div>Acciones</div>
        </TableHeader>

        {categories.map((category) => (
          <CategoryRow key={category.id}>
            <CategoryImage>
              {category.image ? (
                <img src={category.image} alt={category.name} />
              ) : (
                <Folder size={24} color={theme.colors.warmGray} />
              )}
            </CategoryImage>

            <CategoryInfo>
              <CategoryName>{category.name}</CategoryName>
              {category.description && (
                <CategoryDescription>{category.description}</CategoryDescription>
              )}
            </CategoryInfo>

            <CategorySlug>{category.slug}</CategorySlug>

            <CategoryStatus isActive={category.isActive}>
              {category.isActive ? (
                <CheckCircle size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {category.isActive ? 'Activa' : 'Inactiva'}
            </CategoryStatus>

            <CategorySortOrder>{category.sortOrder}</CategorySortOrder>

            <CategoryDate>
              {new Date(category.createdAt).toLocaleDateString()}
            </CategoryDate>

            <CategoryDate>
              {new Date(category.updatedAt).toLocaleDateString()}
            </CategoryDate>

            <CategoryActions>
              <ActionButton onClick={() => onViewDetails(category.id)} title="Ver detalles">
                <Eye size={16} />
              </ActionButton>
              <ActionButton onClick={() => onEdit(category.id)} title="Editar">
                <Edit size={16} />
              </ActionButton>
              <ActionButton onClick={() => onToggleStatus(category.id, !category.isActive)} title="Cambiar estado">
                {category.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
              </ActionButton>
              <ActionButton onClick={() => onDelete(category.id)} title="Eliminar">
                <Trash2 size={16} />
              </ActionButton>
            </CategoryActions>
          </CategoryRow>
        ))}
      </CategoryTable>

      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </PageButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PageButton
              key={page}
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PageButton>
          ))}
          
          <PageButton 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </PageButton>
        </PaginationContainer>
      )}
    </ListViewContainer>
  );
};

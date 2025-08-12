import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { CategoryCard } from './CategoryCard';
import { 
  Folder,
  AlertTriangle
} from 'lucide-react';

import { Category } from './types';

interface CategoryGridProps {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string, isActive: boolean) => void;
  onViewDetails: (categoryId: string) => void;
  emptyMessage?: string;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};
  padding: ${theme.spacing[4]} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${theme.spacing[4]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[3]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  color: ${theme.colors.warmGray};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const EmptyMessage = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.text.secondary};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${theme.colors.background.accent};
  border-top: 4px solid ${theme.colors.primaryPurple};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto ${theme.spacing[4]};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.text.secondary};
`;

const ErrorIcon = styled.div`
  color: ${theme.colors.error};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
  emptyMessage = "No se encontraron categorías"
}) => {
  if (loading) {
    return (
      <LoadingState>
        <LoadingSpinner />
        <EmptyTitle>Cargando categorías...</EmptyTitle>
        <EmptyMessage>Por favor espera mientras se cargan los datos</EmptyMessage>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState>
        <ErrorIcon>
          <AlertTriangle size={48} />
        </ErrorIcon>
        <EmptyTitle>Error al cargar categorías</EmptyTitle>
        <EmptyMessage>{error}</EmptyMessage>
      </ErrorState>
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>
          <Folder size={48} />
        </EmptyIcon>
        <EmptyTitle>No hay categorías</EmptyTitle>
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onViewDetails={onViewDetails}
        />
      ))}
    </GridContainer>
  );
};

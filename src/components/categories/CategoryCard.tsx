import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { 
  Folder,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { Category } from './types';

interface CategoryCardProps {
  category: Category;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onViewDetails: (categoryId: string) => void;
  onToggleStatus: (categoryId: string, isActive: boolean) => void;
}

const CategoryCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform ${theme.transitions.base}, box-shadow ${theme.transitions.base};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const CategoryImage = styled.div`
  width: 100%;
  height: 160px;
  border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  overflow: hidden;
  background: ${theme.colors.background.light};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[4]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryContent = styled.div`
  flex: 1;
  padding: 0 ${theme.spacing[4]} ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
`;

const CategoryName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
  line-height: 1.3;
`;

const CategoryDescription = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[3]} 0;
  line-height: 1.5;
  flex: 1;
`;

const CategoryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
`;

const CategorySlug = styled.span`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.background.accent};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
`;

const CategoryStatus = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${({ isActive }) => isActive ? theme.colors.success : theme.colors.warning};
`;

const CategoryActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  justify-content: flex-end;
  padding-top: ${theme.spacing[3]};
  border-top: 1px solid ${theme.colors.border.light};
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
`;

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleStatus
}) => {
  return (
    <CategoryCardContainer>
      <CategoryImage>
        {category.image ? (
          <img src={category.image} alt={category.name} />
        ) : (
          <Folder size={48} color={theme.colors.warmGray} />
        )}
      </CategoryImage>

      <CategoryContent>
        <CategoryName>{category.name}</CategoryName>
        
        {category.description && (
          <CategoryDescription>{category.description}</CategoryDescription>
        )}

        <CategoryMeta>
          <CategorySlug>{category.slug}</CategorySlug>
          <CategoryStatus isActive={category.isActive}>
            {category.isActive ? (
              <CheckCircle size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {category.isActive ? 'Activa' : 'Inactiva'}
          </CategoryStatus>
        </CategoryMeta>

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
      </CategoryContent>
    </CategoryCardContainer>
  );
};

import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  clickable?: boolean;
}

const StyledCard = styled.div<CardProps>`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.base};
  overflow: hidden;

  ${({ padding }) => {
    switch (padding) {
      case 'small':
        return css`
          padding: ${theme.spacing[4]};
        `;
      case 'large':
        return css`
          padding: ${theme.spacing[8]};
        `;
      default: // medium
        return css`
          padding: ${theme.spacing[6]};
        `;
    }
  }}

  ${({ shadow }) => {
    switch (shadow) {
      case 'small':
        return css`
          box-shadow: ${theme.shadows.sm};
        `;
      case 'medium':
        return css`
          box-shadow: ${theme.shadows.md};
        `;
      case 'large':
        return css`
          box-shadow: ${theme.shadows.lg};
        `;
      case 'none':
      default:
        return css`
          box-shadow: none;
        `;
    }
  }}

  ${({ hover, clickable }) => (hover || clickable) && css`
    cursor: ${clickable ? 'pointer' : 'default'};

    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.card};
      border-color: ${theme.colors.primaryPurple}20;
    }

    &:active {
      transform: translateY(-2px);
    }
  `}
`;

const CardHeader = styled.div`
  margin-bottom: ${theme.spacing[4]};
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const CardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const CardSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.border.light};
  justify-content: flex-end;

  &:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
`;

const CardImage = styled.div`
  margin: -${theme.spacing[6]} -${theme.spacing[6]} ${theme.spacing[4]} -${theme.spacing[6]};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform ${theme.transitions.base};
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

interface CardComponent extends React.FC<CardProps> {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Content: typeof CardContent;
  Actions: typeof CardActions;
  Image: typeof CardImage;
}

export const Card: CardComponent = ({
  children,
  padding = 'medium',
  shadow = 'small',
  hover = false,
  clickable = false,
  ...props
}) => {
  return (
    <StyledCard
      padding={padding}
      shadow={shadow}
      hover={hover}
      clickable={clickable}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

// Export sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Actions = CardActions;
Card.Image = CardImage;
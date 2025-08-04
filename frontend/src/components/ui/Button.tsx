import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'sm';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.fonts.primary};
  font-weight: ${theme.fontWeights.normal};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transitions.base};
  cursor: pointer;
  border: 2px solid transparent;
  outline: none;
  text-decoration: none;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  ${({ size }) => {
    switch (size) {
      case 'small':
      case 'sm':
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.fontSizes.sm};
          min-height: 36px;
        `;
      case 'large':
        return css`
          padding: ${theme.spacing[4]} ${theme.spacing[6]};
          font-size: ${theme.fontSizes.lg};
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${theme.spacing[3]} ${theme.spacing[5]};
          font-size: ${theme.fontSizes.base};
          min-height: 40px;
        `;
    }
  }}

  ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.turquoise};
          color: ${theme.colors.white};
          border-color: ${theme.colors.turquoise};

          &:hover:not(:disabled) {
            background: transparent;
            color: ${theme.colors.turquoise};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.coralAccent};
          border-color: ${theme.colors.coralAccent};

          &:hover:not(:disabled) {
            background: ${theme.colors.coralAccent};
            color: ${theme.colors.white};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.accent};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.warmGray};
          border-color: transparent;

          &:hover:not(:disabled) {
            background: ${theme.colors.background.accent};
            color: ${theme.colors.primaryPurple};
          }

          &:active:not(:disabled) {
            background: ${theme.colors.softPurple};
          }
        `;
      case 'danger':
        return css`
          background: ${theme.colors.error};
          color: ${theme.colors.white};
          border-color: ${theme.colors.error};

          &:hover:not(:disabled) {
            background: transparent;
            color: ${theme.colors.error};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      default: // primary
        return css`
          background: ${theme.colors.primaryPurple};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primaryPurple};

          &:hover:not(:disabled) {
            background: transparent;
            color: ${theme.colors.primaryPurple};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
    }
  }}

  ${({ isLoading }) => isLoading && css`
    pointer-events: none;
    
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
  `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}) => {
  const content = (
    <>
      {isLoading && <LoadingSpinner className="loading-spinner" />}
      {!isLoading && icon && iconPosition === 'left' && icon}
      {children}
      {!isLoading && icon && iconPosition === 'right' && icon}
    </>
  );

  return (
    <StyledButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </StyledButton>
  );
};
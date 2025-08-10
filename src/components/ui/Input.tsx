import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // Alias for leftIcon for compatibility
  fullWidth?: boolean;
  onRightIconClick?: () => void;
  rightIconClickable?: boolean;
  rightIconAriaLabel?: string;
  isError?: boolean; // Add support for isError prop
}

const InputContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};

  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => !['hasLeftIcon', 'hasRightIcon', 'hasError'].includes(prop),
})<{ hasLeftIcon?: boolean; hasRightIcon?: boolean; hasError?: boolean }>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  background: ${theme.colors.white};
  border: 2px solid ${({ hasError }) => hasError ? theme.colors.error : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};
  outline: none;

  ${({ hasLeftIcon }) => hasLeftIcon && css`
    padding-left: ${theme.spacing[10]};
  `}

  ${({ hasRightIcon }) => hasRightIcon && css`
    padding-right: ${theme.spacing[10]};
  `}

  &:focus {
    border-color: ${({ hasError }) => hasError ? theme.colors.error : theme.colors.primaryPurple};
    box-shadow: 0 0 0 3px ${({ hasError }) => 
      hasError ? `${theme.colors.error}20` : `${theme.colors.primaryPurple}20`};
  }

  &:disabled {
    background: ${theme.colors.lightGray};
    color: ${theme.colors.warmGray};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${theme.colors.warmGray};
  }
`;

const IconWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['position', 'clickable'].includes(prop),
})<{ position: 'left' | 'right'; clickable?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${theme.spacing[6]};
  height: ${theme.spacing[6]};
  color: ${theme.colors.warmGray};
  pointer-events: ${({ clickable }) => clickable ? 'auto' : 'none'};
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};

  ${({ position }) => position === 'left' ? css`
    left: ${theme.spacing[2]};
  ` : css`
    right: ${theme.spacing[2]};
  `}

  ${({ clickable }) => clickable && css`
    &:hover {
      color: ${theme.colors.primaryPurple};
      background: ${theme.colors.background.accent};
    }

    &:active {
      transform: translateY(-50%) scale(0.95);
    }
  `}
`;

const HelperText = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isError',
})<{ isError?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${({ isError }) => isError ? theme.colors.error : theme.colors.warmGray};
  line-height: 1.4;
`;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  icon,
  fullWidth = false,
  className,
  onRightIconClick,
  rightIconClickable = false,
  rightIconAriaLabel,
  isError,
  ...props
}, ref) => {
  // Use icon as leftIcon if provided
  const finalLeftIcon = leftIcon || icon;
  
  // Determine if there's an error (support both error and isError props)
  const hasError = !!(error || isError);
  
  // Filter out custom props that shouldn't be passed to DOM
  const { isError: _, ...domProps } = props;
  
  const handleRightIconClick = () => {
    if (rightIconClickable && onRightIconClick) {
      onRightIconClick();
    }
  };

  return (
    <InputContainer fullWidth={fullWidth} className={className}>
      {label && <Label>{label}</Label>}
      
      <InputWrapper>
        {finalLeftIcon && <IconWrapper position="left">{finalLeftIcon}</IconWrapper>}
        
        <StyledInput
          ref={ref}
          hasLeftIcon={!!finalLeftIcon}
          hasRightIcon={!!rightIcon}
          hasError={hasError}
          {...domProps}
        />
        
        {rightIcon && (
          <IconWrapper 
            position="right" 
            clickable={rightIconClickable}
            onClick={handleRightIconClick}
            role={rightIconClickable ? 'button' : undefined}
            aria-label={rightIconAriaLabel}
            tabIndex={rightIconClickable ? 0 : undefined}
          >
            {rightIcon}
          </IconWrapper>
        )}
      </InputWrapper>
      
      {(error || helperText) && (
        <HelperText isError={hasError}>
          {error || helperText}
        </HelperText>
      )}
    </InputContainer>
  );
});

Input.displayName = 'Input';
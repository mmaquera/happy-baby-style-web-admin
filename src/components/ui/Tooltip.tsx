import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface TooltipProps {
  children: React.ReactNode;
  isVisible: boolean;
  position?: 'right' | 'left' | 'top' | 'bottom';
}

const TooltipContainer = styled.div<{ 
  isVisible: boolean; 
  position: string;
  adjustedPosition: string;
}>`
  position: fixed;
  background: ${theme.colors.darkGray};
  color: ${theme.colors.white};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  white-space: nowrap;
  z-index: 9999;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity ${theme.transitions.fast};
  pointer-events: none;
  max-width: 150px;
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  
  ${props => {
    switch (props.adjustedPosition) {
      case 'top':
        return `
          transform: translate(-50%, -100%);
          margin-bottom: 8px;
        `;
      case 'bottom':
        return `
          transform: translate(-50%, 8px);
        `;
      case 'left':
        return `
          transform: translate(-100%, -50%);
          margin-right: 8px;
        `;
      default: // right
        return `
          transform: translate(8px, -50%);
        `;
    }
  }}

  &::before {
    content: '';
    position: absolute;
    border: 4px solid transparent;
    
    ${props => {
      switch (props.adjustedPosition) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: ${theme.colors.darkGray};
          `;
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: ${theme.colors.darkGray};
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-left-color: ${theme.colors.darkGray};
          `;
        default: // right
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-right-color: ${theme.colors.darkGray};
          `;
      }
    }}
  }
`;

export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  isVisible, 
  position = 'right' 
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return;

    const updatePosition = () => {
      const parentElement = tooltipRef.current?.parentElement;
      if (!parentElement) return;

      const parentRect = parentElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Tooltip dimensions (approximate)
      const tooltipWidth = 150;
      const tooltipHeight = 40;
      
      let newPosition = position;
      let top = parentRect.top + parentRect.height / 2;
      let left = parentRect.left;

      // Check if tooltip would overflow on the right
      if (position === 'right' && parentRect.right + tooltipWidth + 8 > viewportWidth) {
        newPosition = 'top';
        top = parentRect.top - tooltipHeight - 8;
        left = parentRect.left + parentRect.width / 2;
      }
      // Check if tooltip would overflow on the left  
      else if (position === 'left' && parentRect.left - tooltipWidth - 8 < 0) {
        newPosition = 'top';
        top = parentRect.top - tooltipHeight - 8;
        left = parentRect.left + parentRect.width / 2;
      }
      // Check if tooltip would overflow on top
      else if (position === 'top' && parentRect.top - tooltipHeight - 8 < 0) {
        newPosition = 'bottom';
        top = parentRect.bottom + 8;
        left = parentRect.left + parentRect.width / 2;
      }
      // Check if tooltip would overflow on bottom
      else if (position === 'bottom' && parentRect.bottom + tooltipHeight + 8 > viewportHeight) {
        newPosition = 'top';
        top = parentRect.top - tooltipHeight - 8;
        left = parentRect.left + parentRect.width / 2;
      }
      // Default positions
      else if (position === 'right') {
        left = parentRect.right;
      } else if (position === 'left') {
        left = parentRect.left;
      } else if (position === 'top') {
        top = parentRect.top;
        left = parentRect.left + parentRect.width / 2;
      } else if (position === 'bottom') {
        top = parentRect.bottom;
        left = parentRect.left + parentRect.width / 2;
      }

      setAdjustedPosition(newPosition);
      setTooltipPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible, position]);

  if (!isVisible) return null;

  return (
    <TooltipContainer 
      ref={tooltipRef}
      isVisible={isVisible} 
      position={position}
      adjustedPosition={adjustedPosition}
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
      }}
    >
      {children}
    </TooltipContainer>
  );
};

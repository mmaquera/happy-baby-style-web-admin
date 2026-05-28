import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing[4]};
`;

export const ModalContainer = styled(Card)`
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 0;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.border.light};
  position: sticky;
  top: 0;
  background: ${theme.colors.white};
  z-index: 1;
`;

export const ModalTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.text.primary};
  }
`;

export const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

export const FormSection = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

export const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

export const FormLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

export const RequiredIndicator = styled.span`
  color: ${theme.colors.error};
  font-weight: ${theme.fontWeights.bold};
`;

export const Select = styled.select`
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

export const Textarea = styled.textarea`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};
  outline: none;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: ${theme.colors.primaryPurple};
    box-shadow: 0 0 0 3px ${theme.colors.primaryPurple}20;
  }

  &:hover {
    border-color: ${theme.colors.border.medium};
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  cursor: pointer;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${theme.colors.primaryPurple};
  cursor: pointer;
`;

export const CheckboxLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[2]};
`;

export const TagChip = styled.div<{ isSelected: boolean; color?: string }>`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${({ isSelected, color }) =>
    isSelected
      ? (color ?? theme.colors.primaryPurple)
      : theme.colors.background.accent};
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  border: 1px solid
    ${({ isSelected, color }) =>
      isSelected
        ? (color ?? theme.colors.primaryPurple)
        : theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  position: relative;

  &:hover {
    background: ${({ isSelected, color }) =>
      isSelected
        ? (color ?? theme.colors.primaryPurple)
        : theme.colors.softPurple};
    transform: translateY(-1px);
  }

  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.colors.text.primary};
    color: ${theme.colors.white};
    padding: ${theme.spacing[1]} ${theme.spacing[2]};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.fontSizes.xs};
    white-space: nowrap;
    z-index: 1000;
    margin-bottom: ${theme.spacing[2]};
    pointer-events: none;
  }
`;

export const AttributesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

export const AttributeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: ${theme.spacing[3]};
  align-items: end;
`;

export const RemoveAttributeButton = styled.button`
  background: ${theme.colors.error};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.error}dd;
  }
`;

export const AddAttributeButton = styled(Button)`
  align-self: flex-start;
`;

export const SkuFieldContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

export const GenerateSkuButton = styled(Button)`
  min-width: auto;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.fontSizes.sm};
  white-space: nowrap;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  position: sticky;
  bottom: 0;
  background: ${theme.colors.white};
  z-index: 1;
`;

export const ErrorMessage = styled.div`
  background: ${theme.colors.error}20;
  color: ${theme.colors.error};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
`;

export const SuccessMessage = styled.div`
  background: ${theme.colors.success}20;
  color: ${theme.colors.success};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.white}80;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${theme.colors.background.accent};
  border-top: 4px solid ${theme.colors.primaryPurple};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

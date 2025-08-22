import React, { useState } from 'react';
import styled from 'styled-components';
import { UserAddress } from '@/types';
import { Button } from '@/components/ui/Button';
import { UserAddressEditForm } from './UserAddressEditForm';
import { theme } from '@/styles/theme';


interface UserAddressManagerProps {
  addresses: UserAddress[];
  userId: string;
  onCreateAddress: (input: any) => Promise<void>;
  onUpdateAddress: (addressId: string, input: any) => Promise<void>;
  onDeleteAddress: (addressId: string) => Promise<void>;
  onSetDefaultAddress: (addressId: string) => Promise<void>;
  loading?: boolean;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const AddressCard = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.base};
  padding: ${theme.spacing[4]};
  transition: border-color ${theme.transitions.fast};
  
  &:hover {
    border-color: ${theme.colors.border.medium};
  }
`;

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[2]};
`;

const AddressInfo = styled.div`
  flex: 1;
`;

const AddressTitle = styled.div`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.base};
  margin-bottom: ${theme.spacing[1]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const AddressType = styled.span<{ type: string }>`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  text-transform: capitalize;
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.secondary};
`;

const AddressText = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.4;
  margin-bottom: ${theme.spacing[3]};
`;

const AddressMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing[2]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
`;

const DefaultBadge = styled.div`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.primary};
  margin-top: ${theme.spacing[1]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[6]};
  color: ${theme.colors.text.secondary};
`;

const EmptyText = styled.p`
  font-size: ${theme.fontSizes.sm};
  margin: 0;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.base};
  padding: ${theme.spacing[6]};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const ModalTitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const UserAddressManager: React.FC<UserAddressManagerProps> = ({
  addresses,
  userId,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  loading = false
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  const handleCreateAddress = async (input: any) => {
    try {
      await onCreateAddress(input);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const handleUpdateAddress = async (input: any) => {
    if (!editingAddress) return;
    
    try {
      await onUpdateAddress(editingAddress.id, input);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta dirección?')) {
      try {
        await onDeleteAddress(addressId);
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await onSetDefaultAddress(addressId);
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Casa';
      case 'work': return 'Trabajo';
      case 'billing': return 'Facturación';
      case 'shipping': return 'Envío';
      default: return type;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Container>
      <Header>
        <Title>Direcciones ({addresses.length})</Title>
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowCreateForm(true)}
        >
          Agregar
        </Button>
      </Header>

      {addresses.length === 0 ? (
        <EmptyState>
          <EmptyText>No hay direcciones registradas</EmptyText>
        </EmptyState>
      ) : (
        <AddressList>
          {addresses.map((address) => (
            <AddressCard key={address.id}>
              <AddressHeader>
                <AddressInfo>
                  <AddressTitle>
                    {address.fullName}
                    <AddressType type={address.type}>
                      {getTypeLabel(address.type)}
                    </AddressType>
                  </AddressTitle>
                  
                  <AddressText>
                    {address.address1}<br />
                    {address.address2 && <>{address.address2}<br /></>}
                    {address.city}, {address.state} {address.postalCode}<br />
                    {address.country}
                  </AddressText>

                  <AddressMeta>
                    {address.company && <span>{address.company}</span>}
                    {address.phone && <span>{address.phone}</span>}
                  </AddressMeta>

                  {address.isDefault && (
                    <DefaultBadge>
                      Predeterminada
                    </DefaultBadge>
                  )}
                </AddressInfo>

                <ActionButtons>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setEditingAddress(address)}
                    title="Editar"
                  >
                    Editar
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleDeleteAddress(address.id)}
                    title="Eliminar"
                  >
                    Eliminar
                  </Button>
                  
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleSetDefault(address.id)}
                      title="Establecer como predeterminada"
                    >
                      Predeterminar
                    </Button>
                  )}
                </ActionButtons>
              </AddressHeader>
            </AddressCard>
          ))}
        </AddressList>
      )}

      {/* Create Address Modal */}
      {showCreateForm && (
        <Modal onClick={() => setShowCreateForm(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Nueva Dirección</ModalTitle>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowCreateForm(false)}
              >
                Cerrar
              </Button>
            </ModalHeader>
            
            <UserAddressEditForm
              userId={userId}
              onSave={handleCreateAddress}
              onCancel={() => setShowCreateForm(false)}
              loading={loading}
            />
          </ModalContent>
        </Modal>
      )}

      {/* Edit Address Modal */}
      {editingAddress && (
        <Modal onClick={() => setEditingAddress(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Editar Dirección</ModalTitle>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setEditingAddress(null)}
              >
                Cerrar
              </Button>
            </ModalHeader>
            
            <UserAddressEditForm
              address={editingAddress}
              userId={userId}
              onSave={handleUpdateAddress}
              onCancel={() => setEditingAddress(null)}
              loading={loading}
              isEditing={true}
            />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default UserAddressManager;

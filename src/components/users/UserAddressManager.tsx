import type React from 'react';
import { useState } from 'react';
import { type UserAddress } from '@/types';
import { Button } from '@/components/ui/Button';
import { UserAddressEditForm } from './UserAddressEditForm';
import { logger } from '@/utils/logger';

interface AddressInput {
  userId: string;
  type: string;
  firstName: string;
  lastName: string;
  company?: string | undefined;
  address1: string;
  address2?: string | undefined;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | undefined;
  isDefault: boolean;
}

interface UserAddressManagerProps {
  addresses: UserAddress[];
  userId: string;
  onCreateAddress: (input: AddressInput) => Promise<void>;
  onUpdateAddress: (addressId: string, input: AddressInput) => Promise<void>;
  onDeleteAddress: (addressId: string) => Promise<void>;
  onSetDefaultAddress: (addressId: string) => Promise<void>;
  loading?: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  home: 'Casa',
  work: 'Trabajo',
  billing: 'Facturación',
  shipping: 'Envío',
};

export const UserAddressManager: React.FC<UserAddressManagerProps> = ({
  addresses,
  userId,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  loading = false,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  const handleCreateAddress = async (input: AddressInput) => {
    try {
      await onCreateAddress(input);
      setShowCreateForm(false);
    } catch (error) {
      logger.error('Error creating address:', error);
    }
  };

  const handleUpdateAddress = async (input: AddressInput) => {
    if (!editingAddress) return;
    try {
      await onUpdateAddress(editingAddress.id, input);
      setEditingAddress(null);
    } catch (error) {
      logger.error('Error updating address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta dirección?')) {
      try {
        await onDeleteAddress(addressId);
      } catch (error) {
        logger.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await onSetDefaultAddress(addressId);
    } catch (error) {
      logger.error('Error setting default address:', error);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='m-0 text-lg font-semibold text-foreground'>
          Direcciones ({addresses.length})
        </h3>
        <Button
          variant='primary'
          size='small'
          onClick={() => setShowCreateForm(true)}
        >
          Agregar
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className='py-6 text-center text-muted-foreground'>
          <p className='m-0 text-sm'>No hay direcciones registradas</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {addresses.map(address => (
            <div
              key={address.id}
              className='rounded-md border border-border bg-white p-4 transition-colors hover:border-border/80'
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-1 flex items-center gap-2 font-medium text-foreground'>
                    {address.fullName}
                    <span className='rounded-sm bg-muted px-2 py-1 text-xs font-medium capitalize text-muted-foreground'>
                      {TYPE_LABEL[address.type] ?? address.type}
                    </span>
                  </div>

                  <div className='mb-3 text-sm leading-[1.4] text-muted-foreground'>
                    {address.address1}
                    <br />
                    {address.address2 ? (
                      <>{address.address2}<br /></>
                    ) : null}
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                  </div>

                  <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
                    {address.company ? <span>{address.company}</span> : null}
                    {address.phone ? <span>{address.phone}</span> : null}
                  </div>

                  {address.isDefault ? (
                    <div className='mt-1 text-xs font-medium text-brand-purple'>
                      Predeterminada
                    </div>
                  ) : null}
                </div>

                <div className='flex gap-1'>
                  <Button
                    variant='ghost'
                    size='small'
                    onClick={() => setEditingAddress(address)}
                    title='Editar'
                  >
                    Editar
                  </Button>
                  <Button
                    variant='ghost'
                    size='small'
                    onClick={() => handleDeleteAddress(address.id)}
                    title='Eliminar'
                  >
                    Eliminar
                  </Button>
                  {!address.isDefault ? (
                    <Button
                      variant='ghost'
                      size='small'
                      onClick={() => handleSetDefault(address.id)}
                      title='Establecer como predeterminada'
                    >
                      Predeterminar
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateForm ? (
        <div
          className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/40'
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className='max-h-[90vh] w-[90%] max-w-[500px] overflow-y-auto rounded-md bg-white p-6'
            onClick={e => e.stopPropagation()}
          >
            <div className='mb-4 flex items-center justify-between border-b border-border pb-4'>
              <h3 className='m-0 text-xl font-semibold text-foreground'>
                Nueva Dirección
              </h3>
              <Button
                variant='ghost'
                size='small'
                onClick={() => setShowCreateForm(false)}
              >
                Cerrar
              </Button>
            </div>
            <UserAddressEditForm
              userId={userId}
              onSave={handleCreateAddress}
              onCancel={() => setShowCreateForm(false)}
              loading={loading}
            />
          </div>
        </div>
      ) : null}

      {/* Edit Modal */}
      {editingAddress ? (
        <div
          className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/40'
          onClick={() => setEditingAddress(null)}
        >
          <div
            className='max-h-[90vh] w-[90%] max-w-[500px] overflow-y-auto rounded-md bg-white p-6'
            onClick={e => e.stopPropagation()}
          >
            <div className='mb-4 flex items-center justify-between border-b border-border pb-4'>
              <h3 className='m-0 text-xl font-semibold text-foreground'>
                Editar Dirección
              </h3>
              <Button
                variant='ghost'
                size='small'
                onClick={() => setEditingAddress(null)}
              >
                Cerrar
              </Button>
            </div>
            <UserAddressEditForm
              address={editingAddress}
              userId={userId}
              onSave={handleUpdateAddress}
              onCancel={() => setEditingAddress(null)}
              loading={loading}
              isEditing={true}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserAddressManager;

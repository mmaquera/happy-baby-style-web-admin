import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Eye,
  Filter,
  Search,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOrders, Order } from '@/hooks/useOrders';
import { theme } from '@/styles/theme';

// These interfaces are already defined in the hook, so we don't need them here

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: theme.colors.warning,
    icon: Clock,
    bgColor: theme.colors.warning + '20'
  },
  confirmed: {
    label: 'Confirmado',
    color: theme.colors.info,
    icon: CheckCircle,
    bgColor: theme.colors.info + '20'
  },
  processing: {
    label: 'En Proceso',
    color: theme.colors.primary,
    icon: Package,
    bgColor: theme.colors.primary + '20'
  },
  shipped: {
    label: 'Enviado',
    color: theme.colors.secondary,
    icon: Truck,
    bgColor: theme.colors.secondary + '20'
  },
  delivered: {
    label: 'Entregado',
    color: theme.colors.success,
    icon: CheckCircle,
    bgColor: theme.colors.success + '20'
  },
  cancelled: {
    label: 'Cancelado',
    color: theme.colors.error,
    icon: XCircle,
    bgColor: theme.colors.error + '20'
  }
};

export const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Use custom hook for orders
  const { 
    orders, 
    isLoading, 
    error, 
    refetch, 
    updateOrderStatus 
  } = useOrders({ status: statusFilter });

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔄</div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>❌</div>
        <p>Error al cargar los pedidos</p>
        <Button onClick={() => refetch()} style={{ marginTop: '1rem' }}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ 
            fontFamily: theme.fonts.heading,
            fontSize: theme.fontSizes['3xl'],
            fontWeight: theme.fontWeights.light,
            color: theme.colors.text.primary,
            marginBottom: '0.5rem'
          }}>
            Pedidos
          </h1>
          <p style={{ 
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.lg
          }}>
            Gestiona todos los pedidos de Happy Baby Style
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline">
            <Calendar size={16} style={{ marginRight: '0.5rem' }} />
            Exportar
          </Button>
          <Button>
            <Package size={16} style={{ marginRight: '0.5rem' }} />
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Input
              placeholder="Buscar por cliente, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: `1px solid ${theme.colors.border.light}`,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.white,
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.sm,
              minWidth: '150px'
            }}
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
          
          <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter(''); }}>
            <Filter size={16} style={{ marginRight: '0.5rem' }} />
            Limpiar
          </Button>
        </div>
      </Card>

      {/* Orders List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredOrders.length === 0 ? (
          <Card style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: theme.colors.text.secondary
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ 
              fontFamily: theme.fonts.heading,
              fontSize: theme.fontSizes.xl,
              marginBottom: '0.5rem',
              color: theme.colors.text.primary
            }}>
              No se encontraron pedidos
            </h3>
            <p>No hay pedidos que coincidan con los filtros aplicados</p>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const status = getStatusConfig(order.status);
            const StatusIcon = status.icon;
            
            return (
              <Card key={order.id} style={{ padding: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  {/* Order Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: theme.borderRadius.full,
                        backgroundColor: status.bgColor,
                        color: status.color,
                        fontSize: theme.fontSizes.sm,
                        fontWeight: theme.fontWeights.medium
                      }}>
                        <StatusIcon size={16} />
                        {status.label}
                      </div>
                      
                      <span style={{ 
                        color: theme.colors.text.secondary,
                        fontSize: theme.fontSizes.sm
                      }}>
                        #{order.id.slice(0, 8)}
                      </span>
                    </div>
                    
                    <h3 style={{ 
                      fontFamily: theme.fonts.heading,
                      fontSize: theme.fontSizes.lg,
                      fontWeight: theme.fontWeights.medium,
                      marginBottom: '0.5rem',
                      color: theme.colors.text.primary
                    }}>
                      {order.customerName}
                    </h3>
                    
                    <p style={{ 
                      color: theme.colors.text.secondary,
                      marginBottom: '0.5rem'
                    }}>
                      {order.customerEmail}
                    </p>
                    
                    {order.customerPhone && (
                      <p style={{ 
                        color: theme.colors.text.secondary,
                        marginBottom: '0.5rem'
                      }}>
                        📞 {order.customerPhone}
                      </p>
                    )}
                    
                    <p style={{ 
                      color: theme.colors.text.secondary,
                      fontSize: theme.fontSizes.sm
                    }}>
                      📅 {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  {/* Order Actions */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '1rem'
                  }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontSize: theme.fontSizes.xl,
                        fontWeight: theme.fontWeights.bold,
                        color: theme.colors.text.primary,
                        marginBottom: '0.25rem'
                      }}>
                        {formatCurrency(order.total)}
                      </p>
                      <p style={{ 
                        color: theme.colors.text.secondary,
                        fontSize: theme.fontSizes.sm
                      }}>
                        {order.items?.length || 0} producto{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={16} style={{ marginRight: '0.25rem' }} />
                        Ver
                      </Button>
                      
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            border: `1px solid ${theme.colors.border.light}`,
                            borderRadius: theme.borderRadius.md,
                            backgroundColor: theme.colors.white,
                            color: theme.colors.text.primary,
                            fontSize: theme.fontSizes.sm,
                            cursor: 'pointer'
                          }}
                        >
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>
                              {config.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <Card style={{ 
            maxWidth: '600px', 
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: `1px solid ${theme.colors.border.light}`
            }}>
              <h2 style={{ 
                fontFamily: theme.fonts.heading,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontWeights.medium
              }}>
                Detalles del Pedido
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </Button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontFamily: theme.fonts.heading,
                fontSize: theme.fontSizes.lg,
                marginBottom: '1rem'
              }}>
                Información del Cliente
              </h3>
              <p><strong>Nombre:</strong> {selectedOrder.customerName}</p>
              <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
              {selectedOrder.customerPhone && (
                <p><strong>Teléfono:</strong> {selectedOrder.customerPhone}</p>
              )}
            </div>
            
            {selectedOrder.shippingAddress && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontFamily: theme.fonts.heading,
                  fontSize: theme.fontSizes.lg,
                  marginBottom: '1rem'
                }}>
                  Dirección de Envío
                </h3>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                <p>{selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}</p>
              </div>
            )}
            
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontFamily: theme.fonts.heading,
                  fontSize: theme.fontSizes.lg,
                  marginBottom: '1rem'
                }}>
                  Productos
                </h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      backgroundColor: theme.colors.background.light,
                      borderRadius: theme.borderRadius.md
                    }}>
                      <div>
                        <p style={{ fontWeight: theme.fontWeights.medium }}>
                          Producto ID: {item.productId}
                        </p>
                        <p style={{ 
                          color: theme.colors.text.secondary,
                          fontSize: theme.fontSizes.sm
                        }}>
                          Cantidad: {item.quantity} | Talla: {item.size} | Color: {item.color}
                        </p>
                      </div>
                      <p style={{ fontWeight: theme.fontWeights.medium }}>
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1rem',
              borderTop: `1px solid ${theme.colors.border.light}`
            }}>
              <div>
                <p style={{ 
                  fontSize: theme.fontSizes.lg,
                  fontWeight: theme.fontWeights.bold
                }}>
                  Total: {formatCurrency(selectedOrder.total)}
                </p>
                <p style={{ 
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm
                }}>
                  Creado: {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              
              <Button onClick={() => setSelectedOrder(null)}>
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}; 
import { SupabaseClient } from '@supabase/supabase-js';
import { IOrderRepository, OrderFilters, OrderStats } from '@domain/repositories/IOrderRepository';
import { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  OrderItem, 
  ShippingAddress,
  OrderEntity,
  OrderItemEntity,
  ShippingAddressEntity
} from '@domain/entities/Order';
import { SupabaseConfig } from '@infrastructure/config/supabase';

export class SupabaseOrderRepository implements IOrderRepository {
  private supabase: SupabaseClient;

  constructor(supabaseConfig: SupabaseConfig) {
    this.supabase = SupabaseConfig.getInstance();
  }

  async create(orderData: CreateOrderRequest): Promise<Order> {
    try {
      // 1. Crear dirección de envío
      const { data: shippingAddress, error: addressError } = await this.supabase
        .from('shipping_addresses')
        .insert({
          street: orderData.shippingAddress.street,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          zip_code: orderData.shippingAddress.zipCode,
          country: orderData.shippingAddress.country || 'Colombia'
        })
        .select()
        .single();

      if (addressError) throw new Error(`Error creating shipping address: ${addressError.message}`);

      // 2. Calcular total del pedido
      const total = orderData.items.reduce((sum, item) => sum + (item.quantity * 0), 0); // TODO: Get product price

      // 3. Crear pedido
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert({
          customer_email: orderData.customerEmail,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          status: 'pending',
          total,
          shipping_address_id: shippingAddress.id
        })
        .select()
        .single();

      if (orderError) throw new Error(`Error creating order: ${orderError.message}`);

      // 4. Crear items del pedido
      const orderItems = await Promise.all(
        orderData.items.map(async (item) => {
          const { data: orderItem, error: itemError } = await this.supabase
            .from('order_items')
            .insert({
              order_id: order.id,
              product_id: item.productId,
              quantity: item.quantity,
              price: 0, // TODO: Get product price
              size: item.size,
              color: item.color
            })
            .select()
            .single();

          if (itemError) throw new Error(`Error creating order item: ${itemError.message}`);
          return orderItem;
        })
      );

      // 5. Retornar pedido completo
      return {
        ...order,
        items: orderItems,
        shippingAddress: shippingAddress,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
        deliveredAt: order.delivered_at ? new Date(order.delivered_at) : undefined
      } as Order;

    } catch (error) {
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const { data: order, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          shipping_addresses (*),
          order_items (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw new Error(`Error finding order: ${error.message}`);
      }

      return {
        ...order,
        items: order.order_items || [],
        shippingAddress: order.shipping_addresses,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
        deliveredAt: order.delivered_at ? new Date(order.delivered_at) : undefined
      } as Order;

    } catch (error) {
      throw new Error(`Failed to find order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(filters?: OrderFilters): Promise<Order[]> {
    try {
      let query = this.supabase
        .from('orders')
        .select(`
          *,
          shipping_addresses (*),
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.customerEmail) {
        query = query.eq('customer_email', filters.customerEmail);
      }
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data: orders, error } = await query;

      if (error) throw new Error(`Error finding orders: ${error.message}`);

      return orders.map(order => ({
        ...order,
        items: order.order_items || [],
        shippingAddress: order.shipping_addresses,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
        deliveredAt: order.delivered_at ? new Date(order.delivered_at) : undefined
      })) as Order[];

    } catch (error) {
      throw new Error(`Failed to find orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(id: string, orderData: UpdateOrderRequest): Promise<Order> {
    try {
      const updateData: any = {};
      
      if (orderData.status !== undefined) updateData.status = orderData.status;
      if (orderData.customerEmail !== undefined) updateData.customer_email = orderData.customerEmail;
      if (orderData.customerName !== undefined) updateData.customer_name = orderData.customerName;
      if (orderData.customerPhone !== undefined) updateData.customer_phone = orderData.customerPhone;
      if (orderData.deliveredAt !== undefined) updateData.delivered_at = orderData.deliveredAt.toISOString();

      const { data: order, error } = await this.supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Error updating order: ${error.message}`);

      return {
        ...order,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
        deliveredAt: order.delivered_at ? new Date(order.delivered_at) : undefined
      } as Order;

    } catch (error) {
      throw new Error(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw new Error(`Error deleting order: ${error.message}`);

      return true;
    } catch (error) {
      throw new Error(`Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.findAll({ status });
  }

  async findByCustomerEmail(email: string): Promise<Order[]> {
    return this.findAll({ customerEmail: email });
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    return this.update(id, { status: status as any });
  }

  async addOrderItem(orderId: string, item: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>): Promise<OrderItem> {
    try {
      const { data: orderItem, error } = await this.supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color
        })
        .select()
        .single();

      if (error) throw new Error(`Error adding order item: ${error.message}`);

      return {
        ...orderItem,
        createdAt: new Date(orderItem.created_at)
      } as OrderItem;

    } catch (error) {
      throw new Error(`Failed to add order item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeOrderItem(orderId: string, itemId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('order_items')
        .delete()
        .eq('id', itemId)
        .eq('order_id', orderId);

      if (error) throw new Error(`Error removing order item: ${error.message}`);

      return true;
    } catch (error) {
      throw new Error(`Failed to remove order item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    try {
      const { data: items, error } = await this.supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw new Error(`Error getting order items: ${error.message}`);

      return items.map(item => ({
        ...item,
        createdAt: new Date(item.created_at)
      })) as OrderItem[];

    } catch (error) {
      throw new Error(`Failed to get order items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createShippingAddress(addressData: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> {
    try {
      const { data: address, error } = await this.supabase
        .from('shipping_addresses')
        .insert({
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          zip_code: addressData.zipCode,
          country: addressData.country
        })
        .select()
        .single();

      if (error) throw new Error(`Error creating shipping address: ${error.message}`);

      return {
        ...address,
        zipCode: address.zip_code
      } as ShippingAddress;

    } catch (error) {
      throw new Error(`Failed to create shipping address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateShippingAddress(id: string, addressData: Partial<Omit<ShippingAddress, 'id'>>): Promise<ShippingAddress> {
    try {
      const updateData: any = {};
      
      if (addressData.street !== undefined) updateData.street = addressData.street;
      if (addressData.city !== undefined) updateData.city = addressData.city;
      if (addressData.state !== undefined) updateData.state = addressData.state;
      if (addressData.zipCode !== undefined) updateData.zip_code = addressData.zipCode;
      if (addressData.country !== undefined) updateData.country = addressData.country;

      const { data: address, error } = await this.supabase
        .from('shipping_addresses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Error updating shipping address: ${error.message}`);

      return {
        ...address,
        zipCode: address.zip_code
      } as ShippingAddress;

    } catch (error) {
      throw new Error(`Failed to update shipping address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getShippingAddress(id: string): Promise<ShippingAddress | null> {
    try {
      const { data: address, error } = await this.supabase
        .from('shipping_addresses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Error getting shipping address: ${error.message}`);
      }

      return {
        ...address,
        zipCode: address.zip_code
      } as ShippingAddress;

    } catch (error) {
      throw new Error(`Failed to get shipping address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrderStats(): Promise<OrderStats> {
    try {
      // Obtener estadísticas básicas
      const { data: stats, error } = await this.supabase
        .rpc('get_order_stats');

      if (error) {
        // Si no existe la función, calcular manualmente
        const orders = await this.findAll();
        
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        const statusCounts = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          totalOrders,
          pendingOrders: statusCounts.pending || 0,
          processingOrders: statusCounts.processing || 0,
          shippedOrders: statusCounts.shipped || 0,
          deliveredOrders: statusCounts.delivered || 0,
          cancelledOrders: statusCounts.cancelled || 0,
          totalRevenue,
          averageOrderValue
        };
      }

      return stats;

    } catch (error) {
      throw new Error(`Failed to get order stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.findAll({ startDate, endDate });
  }
} 
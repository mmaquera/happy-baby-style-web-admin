import { IOrderRepository, OrderFilters, OrderStats } from '@domain/repositories/IOrderRepository';
import { Order, CreateOrderRequest, UpdateOrderRequest, OrderItem, ShippingAddress, OrderEntity, OrderItemEntity, ShippingAddressEntity } from '@domain/entities/Order';
import { Pool } from 'pg';

export class PostgresOrderRepository implements IOrderRepository {
  constructor(private pool: Pool) {}

  async create(orderData: CreateOrderRequest): Promise<Order> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Crear la dirección de envío
      const addressQuery = `
        INSERT INTO shipping_addresses (
          street, city, state, zip_code, country, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `;

      const addressValues = [
        orderData.shippingAddress.street,
        orderData.shippingAddress.city,
        orderData.shippingAddress.state,
        orderData.shippingAddress.zipCode,
        orderData.shippingAddress.country || 'Colombia'
      ];

      const addressResult = await client.query(addressQuery, addressValues);
      const address = addressResult.rows[0];

      // Calcular el total del pedido (esto debería venir del use case)
      const total = orderData.items.reduce((sum, item) => sum + 0, 0);

      // Crear el pedido
      const orderQuery = `
        INSERT INTO orders (
          customer_email, customer_name, customer_phone, status, total, 
          shipping_address_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *
      `;

      const orderValues = [
        orderData.customerEmail,
        orderData.customerName,
        orderData.customerPhone,
        'pending',
        total,
        address.id
      ];

      const orderResult = await client.query(orderQuery, orderValues);
      const order = orderResult.rows[0];

      // Crear los items del pedido
      for (const item of orderData.items) {
        const itemQuery = `
          INSERT INTO order_items (
            order_id, product_id, quantity, price, 
            size, color, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `;

        const itemValues = [
          order.id,
          item.productId,
          item.quantity,
          0, // El precio debería venir del producto
          item.size,
          item.color
        ];

        await client.query(itemQuery, itemValues);
      }

      await client.query('COMMIT');

      // Obtener el pedido completo con items
      return await this.findById(order.id) as Order;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<Order | null> {
    const query = `
      SELECT 
        o.*,
        oa.id as address_id,
        oa.street_address,
        oa.city,
        oa.state,
        oa.postal_code,
        oa.country,
        oa.phone,
        oa.created_at as address_created_at,
        oa.updated_at as address_updated_at
      FROM orders o
      LEFT JOIN shipping_addresses oa ON o.shipping_address_id = oa.id
      WHERE o.id = $1
    `;

    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const orderData = result.rows[0];
    
    // Obtener items del pedido
    const itemsQuery = `
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;

    const itemsResult = await this.pool.query(itemsQuery, [id]);
    const items = itemsResult.rows.map(this.mapToOrderItem);

    return this.mapToOrder(orderData, items);
  }

  async findAll(filters?: OrderFilters): Promise<Order[]> {
    let query = `
      SELECT 
        o.*,
        oa.id as address_id,
        oa.street_address,
        oa.city,
        oa.state,
        oa.postal_code,
        oa.country,
        oa.phone,
        oa.created_at as address_created_at,
        oa.updated_at as address_updated_at
      FROM orders o
      LEFT JOIN shipping_addresses oa ON o.shipping_address_id = oa.id
    `;

    const values: any[] = [];
    let whereConditions: string[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      whereConditions.push(`o.status = $${paramIndex}`);
      values.push(filters.status);
      paramIndex++;
    }

    if (filters?.customerEmail) {
      whereConditions.push(`o.customer_email = $${paramIndex}`);
      values.push(filters.customerEmail);
      paramIndex++;
    }

    if (filters?.startDate) {
      whereConditions.push(`o.created_at >= $${paramIndex}`);
      values.push(filters.startDate);
      paramIndex++;
    }

    if (filters?.endDate) {
      whereConditions.push(`o.created_at <= $${paramIndex}`);
      values.push(filters.endDate);
      paramIndex++;
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += ` ORDER BY o.created_at DESC`;

    const result = await this.pool.query(query, values);
    
    // Obtener items para cada pedido
    const orders: Order[] = [];
    for (const orderData of result.rows) {
      const itemsQuery = `
        SELECT 
          oi.*,
          p.name as product_name,
          p.description as product_description
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `;

      const itemsResult = await this.pool.query(itemsQuery, [orderData.id]);
      const items = itemsResult.rows.map(this.mapToOrderItem);
      
      orders.push(this.mapToOrder(orderData, items));
    }

    return orders;
  }

  async update(id: string, orderData: UpdateOrderRequest): Promise<Order> {
    const query = `
      UPDATE orders 
      SET status = COALESCE($1, status),
          customer_email = COALESCE($2, customer_email),
          customer_name = COALESCE($3, customer_name),
          customer_phone = COALESCE($4, customer_phone),
          delivered_at = COALESCE($5, delivered_at),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const values = [
      orderData.status,
      orderData.customerEmail,
      orderData.customerName,
      orderData.customerPhone,
      orderData.deliveredAt,
      id
    ];

    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error(`Order with id ${id} not found`);
    }

    return await this.findById(id) as Order;
  }

  async delete(id: string): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Eliminar items del pedido
      await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);
      
      // Eliminar el pedido
      const result = await client.query('DELETE FROM orders WHERE id = $1', [id]);

      await client.query('COMMIT');
      return (result.rowCount || 0) > 0;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
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
    const query = `
      INSERT INTO order_items (
        order_id, product_id, quantity, price, 
        size, color, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      orderId,
      item.productId,
      item.quantity,
      item.price,
      item.size,
      item.color
    ];

    const result = await this.pool.query(query, values);
    return this.mapToOrderItem(result.rows[0]);
  }

  async removeOrderItem(orderId: string, itemId: string): Promise<boolean> {
    const query = 'DELETE FROM order_items WHERE order_id = $1 AND id = $2';
    const result = await this.pool.query(query, [orderId, itemId]);
    return (result.rowCount || 0) > 0;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const query = `
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;

    const result = await this.pool.query(query, [orderId]);
    return result.rows.map((row: any) => this.mapToOrderItem(row));
  }

  async updateShippingAddress(id: string, addressData: Partial<Omit<ShippingAddress, 'id'>>): Promise<ShippingAddress> {
    const query = `
      UPDATE shipping_addresses 
      SET street = COALESCE($1, street),
          city = COALESCE($2, city),
          state = COALESCE($3, state),
          zip_code = COALESCE($4, zip_code),
          country = COALESCE($5, country),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const values = [
      addressData.street,
      addressData.city,
      addressData.state,
      addressData.zipCode,
      addressData.country,
      id
    ];

    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error(`Shipping address with id ${id} not found`);
    }

    return this.mapToShippingAddress(result.rows[0]);
  }

  async getShippingAddress(id: string): Promise<ShippingAddress | null> {
    const query = 'SELECT * FROM shipping_addresses WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToShippingAddress(result.rows[0]);
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.findAll({ startDate, endDate });
  }

  async createShippingAddress(addressData: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> {
    const query = `
      INSERT INTO shipping_addresses (
        street, city, state, zip_code, country, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      addressData.street,
      addressData.city,
      addressData.state,
      addressData.zipCode,
      addressData.country
    ];

    const result = await this.pool.query(query, values);
    return this.mapToShippingAddress(result.rows[0]);
  }

  async getOrderStats(): Promise<OrderStats> {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        COALESCE(SUM(total), 0) as total_revenue,
        COALESCE(AVG(total), 0) as average_order_value
      FROM orders
    `;

    const result = await this.pool.query(statsQuery);
    const stats = result.rows[0];

    return {
      totalOrders: parseInt(stats.total_orders),
      pendingOrders: parseInt(stats.pending_orders),
      processingOrders: parseInt(stats.processing_orders),
      shippedOrders: parseInt(stats.shipped_orders),
      deliveredOrders: parseInt(stats.delivered_orders),
      cancelledOrders: parseInt(stats.cancelled_orders),
      totalRevenue: parseFloat(stats.total_revenue),
      averageOrderValue: parseFloat(stats.average_order_value)
    };
  }

  private mapToOrder(row: any, items: OrderItem[]): Order {
    return {
      id: row.id,
      customerEmail: row.customer_email,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      status: row.status,
      total: parseFloat(row.total),
      shippingAddressId: row.shipping_address_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deliveredAt: row.delivered_at,
      items: items,
      shippingAddress: row.address_id ? this.mapToShippingAddress({
        id: row.address_id,
        street: row.street,
        city: row.city,
        state: row.state,
        zip_code: row.zip_code,
        country: row.country
      }) : undefined
    };
  }

  private mapToOrderItem(row: any): OrderItem {
    return {
      id: row.id,
      orderId: row.order_id,
      productId: row.product_id,
      quantity: row.quantity,
      price: parseFloat(row.price),
      size: row.size,
      color: row.color,
      createdAt: row.created_at
    };
  }

  private mapToShippingAddress(row: any): ShippingAddress {
    return {
      id: row.id,
      street: row.street,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      country: row.country
    };
  }
} 
import { Request, Response } from 'express';
import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrderUseCase';
import { GetOrdersUseCase } from '@application/use-cases/order/GetOrdersUseCase';
import { GetOrderByIdUseCase } from '@application/use-cases/order/GetOrderByIdUseCase';
import { UpdateOrderUseCase } from '@application/use-cases/order/UpdateOrderUseCase';
import { GetOrderStatsUseCase } from '@application/use-cases/order/GetOrderStatsUseCase';
import { CreateOrderRequest, UpdateOrderRequest } from '@domain/entities/Order';

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private getOrdersUseCase: GetOrdersUseCase,
    private getOrderByIdUseCase: GetOrderByIdUseCase,
    private updateOrderUseCase: UpdateOrderUseCase,
    private getOrderStatsUseCase: GetOrderStatsUseCase
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateOrderRequest = req.body;

      // Validaciones básicas
      if (!orderData.customerEmail || !orderData.customerName) {
        res.status(400).json({
          success: false,
          message: 'Customer email and name are required'
        });
        return;
      }

      if (!orderData.items || orderData.items.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Order must contain at least one item'
        });
        return;
      }

      if (!orderData.shippingAddress) {
        res.status(400).json({
          success: false,
          message: 'Shipping address is required'
        });
        return;
      }

      const order = await this.createOrderUseCase.execute(orderData);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        status: req.query.status as string,
        customerEmail: req.query.customerEmail as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      const orders = await this.getOrdersUseCase.execute(filters);

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
        return;
      }

      const order = await this.getOrderByIdUseCase.execute(id);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: order
      });
    } catch (error) {
      console.error('Error getting order:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const orderData: UpdateOrderRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
        return;
      }

      const order = await this.updateOrderUseCase.execute(id, orderData);

      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: order
      });
    } catch (error) {
      console.error('Error updating order:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error instanceof Error && error.message.includes('Invalid status transition')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async getOrderStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.getOrderStatsUseCase.execute();

      res.status(200).json({
        success: true,
        message: 'Order statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting order stats:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async getOrdersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required'
        });
        return;
      }

      const orders = await this.getOrdersUseCase.execute({ status });

      res.status(200).json({
        success: true,
        message: `Orders with status ${status} retrieved successfully`,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Error getting orders by status:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
} 
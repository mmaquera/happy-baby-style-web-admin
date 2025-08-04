import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, Product, CreateProductForm, ProductFilters, Image } from '@/types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Product methods
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    const response = await this.client.get('/products', { params: filters });
    return response.data;
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(data: CreateProductForm): Promise<ApiResponse<Product>> {
    const response = await this.client.post('/products', data);
    return response.data;
  }

  async updateProduct(id: string, data: Partial<CreateProductForm>): Promise<ApiResponse<Product>> {
    const response = await this.client.put(`/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/products/${id}`);
    return response.data;
  }

  // Image methods
  async uploadImage(file: File, entityType: string, entityId: string): Promise<ApiResponse<Image>> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);

    const response = await this.client.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getImagesByEntity(entityType: string, entityId: string): Promise<ApiResponse<Image[]>> {
    const response = await this.client.get(`/images/${entityType}/${entityId}`);
    return response.data;
  }

  async deleteImage(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/images/${id}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Generic HTTP methods for compatibility
  async get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  async post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  async delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }
}

export const apiService = new ApiService();
export const api = apiService;
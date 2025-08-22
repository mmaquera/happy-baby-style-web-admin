import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import type { Product } from '../types';

// Mock data
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 29.99,
  salePrice: 24.99,
  sku: 'TEST-001',
  images: ['https://via.placeholder.com/300x300'],
  attributes: { color: 'blue', size: 'M' },
  isActive: true,
  stockQuantity: 10,
  tags: ['test', 'sample'],
  rating: 4.5,
  reviewCount: 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  currentPrice: 24.99,
  hasDiscount: true,
  discountPercentage: 17,
  totalStock: 10,
  isInStock: true,
  category: {
    id: '1',
    name: 'Test Category',
    slug: 'test-category',
    description: null,
    image: null,
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    products: []
  },
  variants: [],
  cartItems: [],
  favorites: [],
  orderItems: [],
  reviews: [],
  appEvents: [],
  inventoryTransactions: [],
  stockAlerts: []
};

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggleStatus: jest.fn(),
  onViewDetails: jest.fn()
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('S/ 24.99')).toBeInTheDocument();
    expect(screen.getByText('S/ 29.99')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  it('displays discount badge when product has discount', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    expect(screen.getByText('-17%')).toBeInTheDocument();
  });

  it('shows correct stock status', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    expect(screen.getByText('En stock')).toBeInTheDocument();
  });

  it('displays tags correctly', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('sample')).toBeInTheDocument();
  });

  it('shows rating and review count', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(5)')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    const editButton = screen.getByLabelText('Editar producto');
    fireEvent.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    const deleteButton = screen.getByLabelText('Eliminar producto');
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('calls onToggleStatus when status toggle is clicked', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    const statusToggle = screen.getByLabelText('Cambiar estado del producto');
    fireEvent.click(statusToggle);

    expect(mockHandlers.onToggleStatus).toHaveBeenCalledWith('1', false);
  });

  it('calls onViewDetails when view details button is clicked', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);

    const viewButton = screen.getByLabelText('Ver detalles del producto');
    fireEvent.click(viewButton);

    expect(mockHandlers.onViewDetails).toHaveBeenCalledWith('1');
  });

  it('displays inactive status correctly', () => {
    const inactiveProduct = { ...mockProduct, isActive: false };
    render(<ProductCard product={inactiveProduct} {...mockHandlers} />);

    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('displays out of stock status correctly', () => {
    const outOfStockProduct = { ...mockProduct, stockQuantity: 0, isInStock: false };
    render(<ProductCard product={outOfStockProduct} {...mockHandlers} />);

    expect(screen.getByText('Sin stock')).toBeInTheDocument();
  });

  it('displays low stock status correctly', () => {
    const lowStockProduct = { ...mockProduct, stockQuantity: 5 };
    render(<ProductCard product={lowStockProduct} {...mockHandlers} />);

    expect(screen.getByText('Stock bajo')).toBeInTheDocument();
  });

  it('handles product without images gracefully', () => {
    const productWithoutImages = { ...mockProduct, images: [] };
    render(<ProductCard product={productWithoutImages} {...mockHandlers} />);

    // Should show placeholder icon instead of image
    const placeholderIcon = screen.getByTestId('placeholder-icon');
    expect(placeholderIcon).toBeInTheDocument();
  });

  it('handles product without description gracefully', () => {
    const productWithoutDescription = { ...mockProduct, description: null };
    render(<ProductCard product={productWithoutDescription} {...mockHandlers} />);

    // Should not crash and should handle null description
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('handles product without rating gracefully', () => {
    const productWithoutRating = { ...mockProduct, rating: null, reviewCount: 0 };
    render(<ProductCard product={productWithoutRating} {...mockHandlers} />);

    // Should not show rating section
    expect(screen.queryByText('(5 reseñas)')).not.toBeInTheDocument();
  });
});

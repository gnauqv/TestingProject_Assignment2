import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Import đúng 1 lần duy nhất

import * as productService from '../services/productService';
import ProductList from '../components/ProductList';

// Mock service
jest.mock('../services/productService');

describe('ProductList Component Integration Tests', () => {

  const mockProducts = [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // (a) Test kịch bản thành công
  test('Hiển thị danh sách sản phẩm khi API thành công', async () => {
    productService.getAllProducts.mockResolvedValue({ data: mockProducts });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    // Kiểm tra loading
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Chờ render
    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    // Loading biến mất
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  // (a) Test kịch bản lỗi
  test('Hiển thị thông báo lỗi khi API thất bại', async () => {
    const errorMsg = 'Failed to fetch products';
    productService.getAllProducts.mockRejectedValue(new Error(errorMsg));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    await waitFor(() => {
      const errorElement = screen.getByTestId('error-message');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(errorMsg);
    });
  });
});
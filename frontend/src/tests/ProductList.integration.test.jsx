import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import * as productService from '../services/productService';
import ProductList from '../components/ProductList';

// (a) Test ProductList component với API
describe('ProductList Component Integration Tests', () => {
  const mockProducts = [
    { id: 1, name: 'Product A', price: 100, description: 'Desc A' },
    { id: 2, name: 'Product B', price: 200, description: 'Desc B' },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test trường hợp thành công: Hiển thị danh sách
  test('Hiển thị danh sách sản phẩm khi API thành công', async () => {
    jest.spyOn(productService, 'getAllProducts').mockImplementation(async () => {
      await new Promise(r => setTimeout(r, 100));
      return { data: mockProducts };
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();

      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });
  });

  // Test trường hợp lỗi: API thất bại
  test('Hiển thị thông báo lỗi khi API thất bại', async () => {
    const errorMsg = 'Failed to fetch products';

    jest.spyOn(productService, 'getAllProducts').mockImplementation(async () => {
      await new Promise(r => setTimeout(r, 100));
      throw new Error(errorMsg);
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    await waitFor(() => {
      const errorElement = screen.getByTestId('error-message');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(/Failed|Lỗi/i);
    });
  });
});
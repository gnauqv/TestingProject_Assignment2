import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// SỬA 1: Thêm dòng này để dùng được .toBeInTheDocument()
import '@testing-library/jest-dom'; 

import * as productService from '../services/productService';
import ProductList from '../components/ProductList';

// Mock service
jest.mock('../services/productService');

describe('ProductList Component Integration Tests', () => {

  // Dữ liệu giả
  const mockProducts = [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // (a) Test kịch bản thành công
  test('Hiển thị danh sách sản phẩm khi API thành công', async () => {
    
    // SỬA 2: Mock trả về object có thuộc tính 'data' (cho giống Axios thật)
    // Thay vì: productService.getAllProducts.mockResolvedValue(mockProducts);
    productService.getAllProducts.mockResolvedValue({ data: mockProducts });
    
    render(<ProductList />);

    // Kiểm tra trạng thái loading (nếu có)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Chờ cho component re-render sau khi API call
    await waitFor(() => {
      // (a) Kiểm tra API đã được gọi
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
      
      // (a) Kiểm tra sản phẩm đã được render
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    // Kiểm tra loading đã biến mất
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  // (a) Test kịch bản lỗi
  test('Hiển thị thông báo lỗi khi API thất bại', async () => {
    // Giả lập API trả về lỗi
    const errorMsg = 'Failed to fetch products';
    productService.getAllProducts.mockRejectedValue(new Error(errorMsg));

    render(<ProductList />);

    await waitFor(() => {
      // (a) Kiểm tra thông báo lỗi được hiển thị
      const errorElement = screen.getByTestId('error-message');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(errorMsg);
    });
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom'; // QUAN TRỌNG: Import Router

import * as productService from '../services/productService';
import ProductForm from '../components/ProductForm';

// Mock service
jest.mock('../services/productService');

describe('ProductForm Component Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // (b) Test chế độ CREATE
  test('Chế độ CREATE: Điền form và gọi API tạo mới', async () => {
    // SỬA 1: Mock trả về cấu trúc { data: ... } giống Axios thật
    productService.createProduct.mockResolvedValue({ data: { id: 3, name: 'New Product' } });

    // SỬA 2: Bọc trong MemoryRouter để dùng được useNavigate
    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    // (a) Tương tác: điền form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '150' } });

    // (b) Tương tác: submit
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      // (b) Kiểm tra API create đã được gọi đúng
      expect(productService.createProduct).toHaveBeenCalledWith({
        name: 'New Product',
        price: 150 // SỬA 3: Component đã ép kiểu sang Number nên ở đây check số 150
      });
    });
  });

  // (b) Test chế độ EDIT
  test('Chế độ EDIT: Tải dữ liệu, điền form và gọi API cập nhật', async () => {
    const mockProduct = { id: 1, name: 'Old Product', price: 100 };

    // SỬA 1: Mock trả về cấu trúc { data: ... }
    productService.getProductById.mockResolvedValue({ data: mockProduct });
    productService.updateProduct.mockResolvedValue({ data: { ...mockProduct, name: 'Updated Product' } });

    // SỬA 2: Setup Router để giả lập URL có ID (cho useParams hoạt động)
    render(
      <MemoryRouter initialEntries={['/product/edit/1']}>
        <Routes>
          <Route path="/product/edit/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    );

    // --- Giai đoạn 1: Chờ load dữ liệu cũ ---
    await waitFor(() => {
      expect(productService.getProductById).toHaveBeenCalledWith('1'); // ID từ URL thường là string
      // Kiểm tra form đã được điền dữ liệu cũ
      expect(screen.getByTestId('name-input').value).toBe('Old Product');
    });

    // --- Giai đoạn 2: Cập nhật và submit ---

    // (a) Tương tác: sửa tên sản phẩm
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Updated Product' }
    });

    // (b) Tương tác: submit
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      // (b) Kiểm tra API update đã được gọi
      expect(productService.updateProduct).toHaveBeenCalledWith('1', {
        name: 'Updated Product',
        price: 100 
      });
    });
  });
});
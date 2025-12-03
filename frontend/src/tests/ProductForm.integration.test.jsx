import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import * as productService from '../services/productService';
import ProductForm from '../components/ProductForm';

// (a) Test ProductForm component (create/edit)
describe('ProductForm Component Integration Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test chế độ CREATE
  test('Chế độ CREATE: Điền form và gọi API tạo mới', async () => {
    const createSpy = jest.spyOn(productService, 'createProduct').mockImplementation(async (data) => {
      await new Promise(r => setTimeout(r, 100));
      return { data: { id: 3, ...data } };
    });

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '150' } });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({
        name: 'New Product',
        price: 150
      });
    });
  });

  // Test chế độ EDIT
  test('Chế độ EDIT: Tải dữ liệu, điền form và gọi API cập nhật', async () => {
    const mockProduct = { id: 1, name: 'Old Product', price: 100 };

    jest.spyOn(productService, 'getProductById').mockImplementation(async (id) => {
      return { data: mockProduct };
    });

    const updateSpy = jest.spyOn(productService, 'updateProduct').mockImplementation(async (id, data) => {
      return { data: { ...mockProduct, ...data } };
    });

    render(
      <MemoryRouter initialEntries={['/products/edit/1']}>
        <Routes>
          <Route path="/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Old Product');
      expect(screen.getByTestId('price-input')).toHaveValue(100);
    });

    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Updated Product' }
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('1', expect.objectContaining({
        name: 'Updated Product',
        price: 100
      }));
    });
  });
});
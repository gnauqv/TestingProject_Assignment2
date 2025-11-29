import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as productService from '../services/productService';
import ProductList from '../components/ProductList';
import ProductDetail from '../components/ProductDetail';
import ProductForm from '../components/ProductForm';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../services/productService', () => ({
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

describe('Product components with mocked productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test('ProductList: shows products on success and calls getAllProducts', async () => {
    const products = [
      { id: 1, name: 'Alpha', price: 10 },
      { id: 2, name: 'Beta', price: 20 },
    ];
    productService.getAllProducts.mockResolvedValue({ data: products });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    // loading appears then list is rendered
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
  });

  test('ProductList: shows error when getAllProducts fails', async () => {
    productService.getAllProducts.mockRejectedValue(new Error('Network Error'));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(productService.getAllProducts).toHaveBeenCalled();
  });

  test('ProductDetail: displays product on success and handles failure', async () => {
    const prod = { id: 5, name: 'Widget', price: 99, description: 'Nice' };
    productService.getProductById.mockResolvedValue({ data: prod });

    render(
      <MemoryRouter initialEntries={[`/products/${prod.id}`]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId('product-name')).toBeInTheDocument());
    expect(screen.getByTestId('product-name')).toHaveTextContent('Widget');
    expect(productService.getProductById).toHaveBeenCalledWith(String(prod.id));

    // Now mock failure
    jest.clearAllMocks();
    productService.getProductById.mockRejectedValue(new Error('Not found'));

    render(
      <MemoryRouter initialEntries={[`/products/999`]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId('error-message')).toBeInTheDocument());
    expect(screen.getByTestId('error-message')).toHaveTextContent(/Product not found/i);
  });

  test('ProductForm: create and update flows call respective service methods and handle errors', async () => {
    // Create flow
    productService.createProduct.mockResolvedValue({ data: { id: 10 } });

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'New Name' } });
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith({ name: 'New Name', price: 123 });
    });
    // Create failure
    cleanup();
    jest.clearAllMocks();
    productService.createProduct.mockRejectedValue(new Error('Save failed'));

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Bad' } });
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '1' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => expect(screen.getByText(/Lỗi khi lưu sản phẩm/i)).toBeInTheDocument());

    // Update (edit) flow: ensure getProductById populates fields and updateProduct is called
    cleanup();
    jest.clearAllMocks();
    productService.getProductById.mockResolvedValue({ data: { name: 'Old', price: 50 } });
    productService.updateProduct.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={[`/products/42`]}>
        <Routes>
          <Route path="/products/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    );

    // wait for initial data population
    await waitFor(() => expect(screen.getByTestId('name-input')).toHaveValue('Old'));

    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '60' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith('42', { name: 'Old', price: 60 });
    });
  });
});

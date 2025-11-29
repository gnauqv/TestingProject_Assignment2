import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductForm from '../components/ProductForm';
import * as productService from '../services/productService';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../services/productService');

// We'll mock useNavigate to assert navigation calls
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ProductForm component tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => cleanup());

  test('renders form fields and cancel link', () => {
    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('price-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();

    // Cancel link href
    const cancel = screen.getByText('Hủy bỏ');
    expect(cancel.closest('a').getAttribute('href')).toBe('/products');

    // required attributes exist
    expect(screen.getByTestId('name-input')).toHaveAttribute('required');
    expect(screen.getByTestId('price-input')).toHaveAttribute('required');
  });

  test('create flow calls createProduct with numeric price and navigates', async () => {
    productService.createProduct.mockResolvedValue({ data: { id: 10 } });

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'New Name' } });
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '123.45' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => expect(productService.createProduct).toHaveBeenCalledWith({ name: 'New Name', price: 123.45 }));

    // navigate called to /products
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });

  test('show error when createProduct fails', async () => {
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
  });

  test('edit flow: populates initial data and updateProduct called; navigates after success', async () => {
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

    // change and submit
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '60' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => expect(productService.updateProduct).toHaveBeenCalledWith('42', { name: 'Old', price: 60 }));
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });

  test('shows load error when getProductById fails', async () => {
    productService.getProductById.mockRejectedValue(new Error('Not found'));

    render(
      <MemoryRouter initialEntries={[`/products/999`]}>
        <Routes>
          <Route path="/products/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Không thể tải thông tin sản phẩm/i)).toBeInTheDocument());
  });

  test('shows loading state and disables submit during create', async () => {
    let resolvePromise;
    const createPromise = new Promise((res) => (resolvePromise = res));
    productService.createProduct.mockReturnValue(createPromise);

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'New Name' } });
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '123' } });

    fireEvent.click(screen.getByTestId('submit-button'));

    // Button should be disabled and show 'Đang lưu...'
    expect(screen.getByTestId('submit-button')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Đang lưu...');

    // Resolve the promise and wait for button to re-enable (navigate also called)
    resolvePromise({ data: { id: 11 } });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/products');
    });
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import * as productService from '../services/productService';
import ProductDetail from '../components/ProductDetail';

// Mock service
jest.mock('../services/productService');

describe('ProductDetail Component Integration Tests', () => {

    const mockProduct = {
        id: 1,
        name: 'Single Product',
        price: 500,
        description: 'This is a test product.'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // (c) Test kịch bản thành công
    test('Hiển thị chi tiết sản phẩm khi API thành công', async () => {
        productService.getProductById.mockResolvedValue({ data: mockProduct });

        render(
            <MemoryRouter initialEntries={['/products/1']}>
                <Routes>
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(productService.getProductById).toHaveBeenCalledWith('1');

            expect(screen.getByText('Single Product')).toBeInTheDocument();
            expect(screen.getByText('This is a test product.')).toBeInTheDocument();

            // SỬA: Dùng Regex /500/ để tìm số 500 nằm trong chuỗi "500 VNĐ" hoặc "500,000"
            expect(screen.getByText(/500/)).toBeInTheDocument();
        });
    });

    // (c) Test kịch bản lỗi
    test('Hiển thị lỗi khi API không tìm thấy sản phẩm', async () => {
        productService.getProductById.mockRejectedValue(new Error('Product not found'));

        render(
            <MemoryRouter initialEntries={['/products/999']}>
                <Routes>
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(productService.getProductById).toHaveBeenCalledWith('999');

            const errorElement = screen.getByTestId('error-message');
            expect(errorElement).toBeInTheDocument();
            expect(errorElement).toHaveTextContent('Product not found');
        });
    });
});
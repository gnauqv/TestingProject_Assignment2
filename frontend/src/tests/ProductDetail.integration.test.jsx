import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as productService from '../services/productService';
import ProductDetail from '../components/ProductDetail';

// (c) Test ProductDetail component
describe('ProductDetail Component Integration Tests', () => {
    const mockProduct = {
        id: 1,
        name: 'Single Product',
        price: 500,
        description: 'This is a test product.'
    };

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Test trường hợp thành công
    test('Hiển thị chi tiết sản phẩm khi API thành công', async () => {
        jest.spyOn(productService, 'getProductById').mockImplementation(async (id) => {
            await new Promise(r => setTimeout(r, 50));
            return { data: mockProduct };
        });

        render(
            <MemoryRouter initialEntries={['/products/1']}>
                <Routes>
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Single Product')).toBeInTheDocument();
            expect(screen.getByText('This is a test product.')).toBeInTheDocument();
            expect(screen.getByText(/500/)).toBeInTheDocument();
        });
    });

    // Test trường hợp lỗi
    test('Hiển thị lỗi khi API không tìm thấy sản phẩm', async () => {
        const errorMsg = 'Product not found';

        jest.spyOn(productService, 'getProductById').mockImplementation(async () => {
            await new Promise(r => setTimeout(r, 50));
            throw new Error(errorMsg);
        });

        render(
            <MemoryRouter initialEntries={['/products/999']}>
                <Routes>
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            const errorElement = screen.getByTestId('error-message');
            expect(errorElement).toBeInTheDocument();
            expect(errorElement).toHaveTextContent(errorMsg);
        });
    });
});
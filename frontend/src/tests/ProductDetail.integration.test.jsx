import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// SỬA 1: Import các thành phần Router để giả lập URL
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import * as productService from '../services/productService';
import ProductDetail from '../components/ProductDetail';

// Mock service
jest.mock('../services/productService');

describe('ProductDetail Component Integration Tests', () => {

    const mockProduct = {
        id: 1,
        name: 'Single Product',
        price: 500, // Thêm giá để test hiển thị đầy đủ
        description: 'This is a test product.'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // (c) Test kịch bản thành công
    test('Hiển thị chi tiết sản phẩm khi API thành công', async () => {
        // SỬA 2: Mock trả về object { data: ... } giống Axios thật
        productService.getProductById.mockResolvedValue({ data: mockProduct });

        // SỬA 3: Dùng MemoryRouter để truyền ID = 1 qua URL
        render(
            <MemoryRouter initialEntries={['/products/1']}>
                <Routes>
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Chờ cho API call
        await waitFor(() => {
            // (c) Kiểm tra API đã được gọi đúng với id là '1' (lấy từ URL)
            expect(productService.getProductById).toHaveBeenCalledWith('1');

            // (c) Kiểm tra chi tiết đã được render
            expect(screen.getByText('Single Product')).toBeInTheDocument();
            expect(screen.getByText('This is a test product.')).toBeInTheDocument();
            // Kiểm tra giá (nếu component hiển thị)
            expect(screen.getByText('500')).toBeInTheDocument();
        });
    });

    // (c) Test kịch bản không tìm thấy (lỗi)
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
            // (c) Kiểm tra API được gọi với ID 999
            expect(productService.getProductById).toHaveBeenCalledWith('999');

            // (c) Kiểm tra thông báo lỗi
            const errorElement = screen.getByTestId('error-message');
            expect(errorElement).toBeInTheDocument();
            expect(errorElement).toHaveTextContent('Product not found');
        });
    });
});
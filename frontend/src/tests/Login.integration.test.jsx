import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// --- Thư viện chứa các phương thức DOM test bằng jest ---
import '@testing-library/jest-dom'; 
// --------------------------------------------------------

import * as authService from '../services/authService'; 
import Login from '../components/Login'; 

jest.mock('../services/authService', () => ({
  loginUser: jest.fn(),
}));

describe('Login Component Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // (a) Test rendering & interaction
  test('Hiển thị các thành phần và xử lý nhập liệu', () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    expect(usernameInput).toBeInTheDocument(); // Giờ sẽ chạy ngon lành
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: 'quang' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(usernameInput.value).toBe('quang');
    expect(passwordInput.value).toBe('123456');
  });

  // (c) Error handling (Client)
  test('Hiển thị lỗi client-side khi submit form rỗng', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      const errorMsg = screen.getByTestId('username-error');
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveTextContent(/Vui lòng nhập tên đăng nhập/i);
    });
    
    expect(authService.loginUser).not.toHaveBeenCalled();
  });

  // (b) & (c) Success Case
  test('Gọi API khi submit form hợp lệ và hiển thị thông báo thành công', async () => {
    const mockSuccessResponse = { user: 'quang', token: 'abc123' };
    authService.loginUser.mockResolvedValue(mockSuccessResponse);
    
    render(<Login />);
    
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'quang' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
        expect(authService.loginUser).toHaveBeenCalledWith('quang', '123456');
        expect(screen.getByTestId('login-message')).toHaveTextContent(/Đăng nhập thành công/i);
    });
  });

  // (c) Error handling (API)
  test('Hiển thị thông báo lỗi khi API trả về thất bại', async () => {
    const errorMessage = 'Đăng nhập thất bại';
    authService.loginUser.mockRejectedValue(new Error(errorMessage));

    render(<Login />);
    
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'quang' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'sai' } });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
        expect(authService.loginUser).toHaveBeenCalledWith('quang', 'sai');
        expect(screen.getByTestId('login-message')).toHaveTextContent(errorMessage);
    });
  });
});
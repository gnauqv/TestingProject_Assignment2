import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as authService from '../services/authService';
import Login from '../components/Login';

describe('Login Component Integration Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // (a) Test rendering & interaction
  test('Hiển thị các thành phần và xử lý nhập liệu', () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: 'quang' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(usernameInput.value).toBe('quang');
    expect(passwordInput.value).toBe('123456');
  });

  // (c) Case 1: Error handling (empty fields)
  test('Hiển thị lỗi client-side khi submit form rỗng', async () => {
    render(<Login />);

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      const errorMsg = screen.getByTestId('username-error');
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveTextContent(/Vui lòng nhập tên đăng nhập/i);
    });
  });

  // (b) & (c) Form submission & success handling
  test('Gọi API khi submit form hợp lệ và hiển thị thông báo thành công', async () => {
    jest.spyOn(authService, 'loginUser').mockImplementation(async (username, password) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Giả lập độ trễ
      if (username === 'quang' && password === '123456') {
        return { user: 'quang', token: 'real-token-123' };
      }
      throw new Error('Đăng nhập thất bại');
    });

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'quang' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent(/Đăng nhập thành công/i);
    });
  });

  // (c) Case 2: Error handling (API failure, invalid credentials)
  test('Hiển thị thông báo lỗi khi API trả về thất bại', async () => {
    const errorMessage = 'Đăng nhập thất bại';

    jest.spyOn(authService, 'loginUser').mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      throw new Error(errorMessage);
    });

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'quang' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'sai' } });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent(errorMessage);
    });
  });
});
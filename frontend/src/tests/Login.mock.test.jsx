import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import * as authService from '../services/authService';

jest.mock('../services/authService');

describe('Login Mock Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Mock: Login thành công', async () => {
    authService.loginUser.mockResolvedValue({
      success: true,
      token: 'mock-token-123',
      user: { username: 'testuser' },
    });

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('testuser', 'Test123');
      expect(screen.getByTestId('login-message')).toHaveTextContent(/thành công/i);
    });
  });

  test('Mock: Login thất bại', async () => {
    authService.loginUser.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('testuser', 'wrongpass');
      // component surfaces either the server message or a generic failure message
      expect(screen.getByTestId('login-message')).toHaveTextContent(/Invalid credentials|Đăng nhập thất bại/i);
    });
  });
});

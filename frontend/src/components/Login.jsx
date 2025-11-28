import React, { useState } from 'react';
// Import function loginUser từ service (để khớp với mock trong file test)
import { loginUser } from '../services/authService';

const Login = () => {
  // State lưu trữ dữ liệu nhập
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State lưu trữ thông báo lỗi/thành công
  const [usernameError, setUsernameError] = useState('');
  const [generalMessage, setGeneralMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset các thông báo cũ trước khi xử lý mới
    setUsernameError('');
    setGeneralMessage('');

    // --- Yêu cầu (c): Test error handling (Client-side) ---
    // Kiểm tra nếu username rỗng
    if (!username) {
      setUsernameError('Vui lòng nhập tên đăng nhập');
      return; // Dừng lại, không gọi API
    }

    try {
      // --- Yêu cầu (b): Test API calls ---
      // Gọi service loginUser với tham số username, password
      const response = await loginUser(username, password);

      // --- Yêu cầu (b) & (c): Success Message ---
      // Nếu thành công (không có lỗi throw ra)
      setGeneralMessage('Đăng nhập thành công');
      // Có thể lưu token vào localStorage tại đây nếu cần
      
    } catch (error) {
      // --- Yêu cầu (c): Test error handling (API-side) ---
      // Lấy message lỗi từ error object hoặc dùng message mặc định
      const msg = error.message || 'Đăng nhập thất bại';
      setGeneralMessage(msg);
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        
        {/* --- Yêu cầu (a): Rendering input username --- */}
        <div>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            id="username"
            type="text"
            data-testid="username-input" // Quan trọng: Khớp với test
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* Hiển thị lỗi validation username */}
          {usernameError && (
            <span style={{ color: 'red' }} data-testid="username-error">
              {usernameError}
            </span>
          )}
        </div>

        {/* --- Yêu cầu (a): Rendering input password --- */}
        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            id="password"
            type="password"
            data-testid="password-input" // Quan trọng: Khớp với test
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* --- Yêu cầu (a): Rendering button --- */}
        <button type="submit" data-testid="login-button">
          Đăng nhập
        </button>
      </form>

      {/* --- Yêu cầu (c): Hiển thị thông báo chung (Thành công hoặc Lỗi API) --- */}
      {generalMessage && (
        <div 
          data-testid="login-message" // Quan trọng: Khớp với test
          style={{ marginTop: '10px', color: generalMessage.includes('thành công') ? 'green' : 'red' }}
        >
          {generalMessage}
        </div>
      )}
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { loginUser } from '../services/authService';

// Icon SVG đơn giản (không cần cài thêm thư viện)
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [generalMessage, setGeneralMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading cho UX tốt hơn

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setGeneralMessage('');

    if (!username) {
      setUsernameError('Vui lòng nhập tên đăng nhập');
      return;
    }

    setIsLoading(true); // Bắt đầu loading

    try {
      await loginUser(username, password);
      setGeneralMessage('Đăng nhập thành công');
      // Logic lưu token...
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      setGeneralMessage(msg);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    // Background Gradient hiện đại
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      
      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
        
        {/* Header trang trí */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 tracking-tight">
            Kiểm thử phần mềm <br />Nhóm 3
          </h2>
          <p className="text-center text-gray-500 text-sm mt-2">
            Đăng nhập để tiếp tục vào hệ thống
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  id="username"
                  type="text"
                  data-testid="username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập username của bạn"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none ${
                    usernameError ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                  }`}
                />
              </div>
              {usernameError && (
                <div className="flex items-center mt-2 text-red-500 text-sm animate-pulse" data-testid="username-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {usernameError}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  type="password"
                  data-testid="password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              data-testid="login-button"
              className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-md transition-all duration-300 transform 
                ${isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* General message (Success/Error Alert) */}
          {generalMessage && (
            <div
              data-testid="login-message"
              className={`mt-6 p-4 rounded-lg flex items-start space-x-3 text-sm font-medium animate-fade-in-up border ${
                generalMessage.includes("thành công")
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {generalMessage.includes("thành công") ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span>{generalMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
import React from 'react';
// Import các thành phần của Router
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

// Import các Component bạn đã tạo
import Login from './components/Login';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';

function App() {
  return (
    <BrowserRouter>
      {/* (Tùy chọn) Menu đơn giản để bạn dễ click chuyển trang khi test tay */}
      <nav style={{ padding: 10, borderBottom: '1px solid #ccc', marginBottom: 20 }}>
        <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
        <Link to="/products" style={{ marginRight: 10 }}>Danh sách SP</Link>
        <Link to="/product/create">Thêm mới SP</Link>
      </nav>

      <div className="container" style={{ padding: 20 }}>
        <Routes>
          {/* 1. Trang Login */}
          <Route path="/login" element={<Login />} />

          {/* 2. Trang Danh sách sản phẩm */}
          <Route path="/products" element={<ProductList />} />

          {/* 3. Trang Chi tiết sản phẩm (nhận id từ URL) */}
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* 4. Trang Tạo mới sản phẩm (Dùng chung ProductForm) */}
          <Route path="/product/create" element={<ProductForm />} />

          {/* 5. Trang Sửa sản phẩm (Dùng chung ProductForm, có thêm param id) */}
          <Route path="/product/edit/:id" element={<ProductForm />} />

          {/* 6. Mặc định: Nếu vào trang chủ "/" thì chuyển hướng sang login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 7. Route 404 (Nếu nhập linh tinh) */}
          <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
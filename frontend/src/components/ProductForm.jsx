import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createProduct, updateProduct, getProductById } from '../services/productService';

const ProductForm = () => {
  const { id } = useParams(); // Lấy ID từ URL (nếu có)
  const navigate = useNavigate(); // Dùng để chuyển trang
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load dữ liệu cũ nếu đang ở chế độ Edit
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await getProductById(id);
          const data = res.data || res; // Xử lý cả 2 trường hợp response
          setName(data.name);
          setPrice(data.price);
        } catch (err) {
          setError('Không thể tải thông tin sản phẩm');
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = { name, price: Number(price) };
      
      if (id) {
        await updateProduct(id, productData); // API Sửa
      } else {
        await createProduct(productData); // API Thêm mới
      }

      // --- SỬA LỖI Ở ĐÂY ---
      // Sau khi thành công, chuyển hướng về trang danh sách
      navigate('/products'); 
      
    } catch (err) {
      setError('Lỗi khi lưu sản phẩm. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Tên sản phẩm */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tên sản phẩm
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  data-testid="name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Giá sản phẩm */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Giá bán
              </label>
              <div className="mt-1">
                <input
                  id="price"
                  data-testid="price-input"
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/products"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy bỏ
              </Link>
              
              <button
                type="submit"
                data-testid="submit-button"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
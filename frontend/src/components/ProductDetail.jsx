import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data || res);
      } catch {
        setError('Không tìm thấy sản phẩm'); // không dùng biến err nên ESLint OK
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!product) return <div className="text-center py-10">Không tìm thấy sản phẩm</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="border rounded-lg shadow p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-700 mb-2">
          Giá: <span className="font-semibold">{product.price.toLocaleString()} VNĐ</span>
        </p>
        <p className="text-gray-600 mb-4">{product.description || 'Không có mô tả'}</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Đảm bảo đường dẫn import service đúng
import { getProductById } from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Thêm state để lưu lỗi
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data || res);
      } catch (err) {
        console.error(err);
        // 2. Cập nhật state lỗi khi gọi API thất bại
        setError('Product not found'); 
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  // 3. Render thông báo lỗi nếu có state error (để pass test)
  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div>
      <h1>Chi tiết sản phẩm</h1>
      <h2 data-testid="product-name">{product.name}</h2>
      <p data-testid="product-price">{product.price}</p>
      <p data-testid="product-desc">{product.description || 'Không có mô tả'}</p>
    </div>
  );
};

export default ProductDetail;
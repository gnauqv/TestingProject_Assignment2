import React, { useEffect, useState } from 'react';
// SỬA: Import cụ thể hàm cần dùng (Named Import) thay vì import *
import { getAllProducts } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // SỬA: Gọi trực tiếp hàm, không cần productService.getAllProducts
        const response = await getAllProducts();
        
        const data = response.data ? response.data : response;
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div data-testid="loading-spinner">Đang tải dữ liệu...</div>;
  if (error) return <div data-testid="error-message">{error}</div>;

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Giá: {product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
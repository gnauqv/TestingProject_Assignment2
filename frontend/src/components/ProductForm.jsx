import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import các hàm service
import { createProduct, updateProduct, getProductById } from '../services/productService';

const ProductForm = () => {
  const { id } = useParams(); // Lấy ID nếu đang edit
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  // Nếu có ID (Edit mode), load dữ liệu cũ
  useEffect(() => {
    if (id) {
      getProductById(id).then((res) => {
        const data = res.data || res;
        setName(data.name);
        setPrice(data.price);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { name, price: Number(price) };
      if (id) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }
      // Điều hướng hoặc hiển thị thông báo thành công (tuỳ logic app)
    } catch (err) {
      setError('Lỗi khi lưu sản phẩm');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
      {error && <div>{error}</div>}
      
      <label htmlFor="name">Tên sản phẩm</label>
      <input
        id="name"
        data-testid="name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="price">Giá</label>
      <input
        id="price"
        type="number"
        data-testid="price-input"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button type="submit" data-testid="submit-button">
        Lưu
      </button>
    </form>
  );
};

export default ProductForm;
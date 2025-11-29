import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      const data = response.data ? response.data : response;
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa không?')) {
      try {
        await deleteProduct(id);
        // Load lại danh sách sau khi xóa
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Xóa thất bại');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64" data-testid="loading-spinner">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" data-testid="error-message">
      <strong className="font-bold">Lỗi! </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Danh sách sản phẩm</h2>
        <Link to="/product/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition duration-300">
          + Thêm sản phẩm
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Chưa có sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  ${product.price?.toLocaleString()}
                </p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <Link 
                    to={`/products/${product.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Chi tiết
                  </Link>
                  
                  <div className="space-x-2">
                    <Link 
                      to={`/product/edit/${product.id}`}
                      className="text-yellow-600 hover:text-yellow-800 font-medium text-sm"
                    >
                      Sửa
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm ml-2"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
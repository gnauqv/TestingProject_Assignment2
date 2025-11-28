import axios from 'axios';

// Đường dẫn API giả định (Trong test nó sẽ bị mock đè lên nên URL này không quan trọng)
const API_URL = 'http://localhost:8080/api/products';

// 1. Lấy danh sách sản phẩm
export const getAllProducts = () => {
  return axios.get(API_URL);
};

// 2. Lấy chi tiết 1 sản phẩm theo ID
export const getProductById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// 3. Tạo sản phẩm mới
export const createProduct = (productData) => {
  return axios.post(API_URL, productData);
};

// 4. Cập nhật sản phẩm
export const updateProduct = (id, productData) => {
  return axios.put(`${API_URL}/${id}`, productData);
};

// 5. Xóa sản phẩm
export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Không dùng export default để tương thích tốt nhất với "import * as ..." trong file test
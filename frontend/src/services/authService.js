import axios from 'axios';

// Hàm này chỉ để giữ chỗ, logic thực tế sẽ bị Jest Mock đè lên khi chạy test
export const loginUser = async (username, password) => {
  const response = await axios.post('/api/login', { username, password });
  return response.data;
};
// validation.js
// Implement validation functions used by tests

export function validateUsername(username) {
  if (username === null || username === undefined) return 'Username không được để trống';
  const trimmed = String(username).trim();
  if (trimmed.length === 0) return 'Username không được để trống';
  if (trimmed.length < 3 || trimmed.length > 20) return 'Username phải từ 3 đến 20 ký tự';
  const usernameRegex = /^[A-Za-z0-9_]+$/;
  if (!usernameRegex.test(trimmed)) return 'Username chỉ được chứa chữ, số và dấu gạch dưới';
  return null;
}

export function validatePassword(password) {
  if (password === null || password === undefined) return 'Password không được để trống';
  const trimmed = String(password).trim();
  if (trimmed.length === 0) return 'Password không được để trống';
  if (trimmed.length < 6 || trimmed.length > 30) return 'Password phải từ 6 đến 30 ký tự';
  const hasLetter = /[A-Za-z]/.test(trimmed);
  const hasNumber = /[0-9]/.test(trimmed);
  if (!(hasLetter && hasNumber)) return 'Password phải bao gồm cả chữ và số';
  return null;
}

export function validateProduct(product) {
  // product is expected to be an object; return an errors object or null
  const errors = {};
  if (!product || typeof product !== 'object') {
    // return an object indicating missing name at least
    return { name: 'Tên sản phẩm không được để trống' };
  }

  // Name
  const name = product.name === undefined ? '' : String(product.name).trim();
  if (!name) {
    errors.name = 'Tên sản phẩm không được để trống';
  } else if (name.length < 3 || name.length > 100) {
    errors.name = 'Tên sản phẩm phải từ 3 đến 100 ký tự';
  }

  // Price
  if (product.price === undefined || product.price === null || product.price === '') {
    errors.price = 'Giá không được để trống';
  } else {
    const priceNum = Number(product.price);
    if (Number.isNaN(priceNum)) {
      errors.price = 'Giá không hợp lệ';
    } else if (priceNum < 0.01 || priceNum > 1000000) {
      errors.price = 'Giá phải nằm trong khoảng từ 0.01 đến 1,000,000';
    }
  }

  // Quantity
  if (product.quantity === undefined || product.quantity === null || product.quantity === '') {
    errors.quantity = 'Số lượng không được để trống';
  } else {
    const qty = product.quantity;
    if (!Number.isInteger(Number(qty))) {
      errors.quantity = 'Số lượng phải là số nguyên';
    } else if (Number(qty) < 0 || Number(qty) > 10000) {
      errors.quantity = 'Số lượng phải nằm trong khoảng từ 0 đến 10000';
    }
  }

  // Description
  if (product.description !== undefined && product.description !== null) {
    const desc = String(product.description);
    if (desc.length > 500) {
      errors.description = 'Mô tả không được vượt quá 500 ký tự';
    }
  }

  // Category
  const allowedCategories = ['Electronics', 'Furniture', 'Clothing', 'Other'];
  if (product.category === undefined || product.category === null || product.category === '') {
    errors.category = 'Category không được để trống';
  } else if (!allowedCategories.includes(product.category)) {
    errors.category = 'Category không hợp lệ';
  }

  return Object.keys(errors).length ? errors : null;
}

export default {
  validateUsername,
  validatePassword,
  validateProduct,
};

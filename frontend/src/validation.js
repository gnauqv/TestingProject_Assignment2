// src/validation.js
function validateUsername(username) {
  if (!username || username.trim() === '') {
    return 'Username không được để trống';
  }

  if (username.length < 3 || username.length > 20) {
    return 'Username phải từ 3 đến 20 ký tự';
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username chỉ được chứa chữ, số và dấu gạch dưới';
  }

  return null;
}

function validatePassword(password) {
  if (!password || password.trim() === '') {
    return 'Password không được để trống';
  }

  if (password.length < 6 || password.length > 30) {
    return 'Password phải từ 6 đến 30 ký tự';
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return 'Password phải bao gồm cả chữ và số';
  }

  return null;
}

export {validateUsername, validatePassword};
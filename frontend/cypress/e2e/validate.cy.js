// cypress/e2e/validateUsername.cy.js
// Unit tests cho validateUsername() dùng Cypress (Mocha + Chai)

import { validateUsername, validatePassword } from '../../src/validation'; // chỉnh path nếu project khác

describe('Unit: validateUsername()', () => {
  // 1. Username rỗng
  it('Trả về lỗi khi username rỗng', () => {
    const msg = validateUsername('');
    expect(msg).to.equal('Username không được để trống');
  });

  // 2. Username quá ngắn
  it('Trả về lỗi khi username quá ngắn', () => {
    const msg = validateUsername('ab'); // giả sử min = 3
    expect(msg).to.equal('Username phải từ 3 đến 20 ký tự');
  });

  // 2b. Username quá dài
  it('Trả về lỗi khi username quá dài', () => {
    const msg = validateUsername('abcdefghijklmnopqrstu'); // >20
    expect(msg).to.equal('Username phải từ 3 đến 20 ký tự');
  });

  // 3. Ký tự đặc biệt không hợp lệ
  it('Trả về lỗi khi username chứa ký tự đặc biệt', () => {
    const msg = validateUsername('abc$#@');
    expect(msg).to.equal('Username chỉ được chứa chữ, số và dấu gạch dưới');
  });

  // 4. Username hợp lệ
  it('Trả về null khi username hợp lệ', () => {
    const msg = validateUsername('kiet_123');
    expect(msg).to.be.null;
  });

  // 1. Password rỗng
    it('Trả về lỗi khi password rỗng', () => {
      const msg = validatePassword('');
      expect(msg).to.equal('Password không được để trống');
    });
  
    // 2. Password quá ngắn
    it('Trả về lỗi khi password quá ngắn', () => {
      const msg = validatePassword('abc'); // giả sử min = 6
      expect(msg).to.equal('Password phải từ 6 đến 30 ký tự');
    });
  
    // 2b. Password quá dài
    it('Trả về lỗi khi password quá dài', () => {
      const msg = validatePassword('a'.repeat(31)); // > 30 ký tự
      expect(msg).to.equal('Password phải từ 6 đến 30 ký tự');
    });
  
    // 3. Không có chữ hoặc không có số
    it('Trả về lỗi khi password không chứa chữ hoặc không chứa số', () => {
      const msg1 = validatePassword('123456');   // toàn số
      const msg2 = validatePassword('abcdef');   // toàn chữ
  
      expect(msg1).to.equal('Password phải bao gồm cả chữ và số');
      expect(msg2).to.equal('Password phải bao gồm cả chữ và số');
    });
  
    // 4. Password hợp lệ
    it('Trả về null khi password hợp lệ', () => {
      const msg = validatePassword('abc123');
      expect(msg).to.be.null;
    });
});

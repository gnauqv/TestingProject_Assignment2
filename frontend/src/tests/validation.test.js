import { validateUsername, validatePassword } from '../validation';

describe('Validation Module', () => {
  describe('validateUsername', () => {
    test('empty or whitespace-only username', () => {
      expect(validateUsername('')).toBe('Username không được để trống');
      expect(validateUsername('   ')).toBe('Username không được để trống');
      expect(validateUsername(null)).toBe('Username không được để trống');
      expect(validateUsername(undefined)).toBe('Username không được để trống');
    });

    test('username too short or too long', () => {
      expect(validateUsername('ab')).toBe('Username phải từ 3 đến 20 ký tự');
      const long = 'a'.repeat(21);
      expect(validateUsername(long)).toBe('Username phải từ 3 đến 20 ký tự');
    });

    test('username invalid characters', () => {
      expect(validateUsername('user!name')).toBe('Username chỉ được chứa chữ, số và dấu gạch dưới');
      expect(validateUsername('user-name')).toBe('Username chỉ được chứa chữ, số và dấu gạch dưới');
    });

    test('username valid (boundaries and typical)', () => {
      expect(validateUsername('abc')).toBeNull();
      expect(validateUsername('a'.repeat(20))).toBeNull();
      expect(validateUsername('user_name123')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    test('empty or whitespace-only password', () => {
      expect(validatePassword('')).toBe('Password không được để trống');
      expect(validatePassword('   ')).toBe('Password không được để trống');
      expect(validatePassword(null)).toBe('Password không được để trống');
      expect(validatePassword(undefined)).toBe('Password không được để trống');
    });

    test('password too short or too long', () => {
      expect(validatePassword('a1b2')).toBe('Password phải từ 6 đến 30 ký tự');
      const longPass = 'a1'.repeat(16) + 'b'; // 33 chars or so
      expect(validatePassword(longPass)).toBe('Password phải từ 6 đến 30 ký tự');
    });

    test('password must include both letters and numbers', () => {
      expect(validatePassword('abcdef')).toBe('Password phải bao gồm cả chữ và số');
      expect(validatePassword('1234567')).toBe('Password phải bao gồm cả chữ và số');
    });

    test('password valid (boundaries and typical)', () => {
      expect(validatePassword('a1b2c3')).toBeNull();
      expect(validatePassword('a1'.repeat(15))).toBeNull(); // length 30
      expect(validatePassword('  abc123 ')).toBeNull();
    });
  });
});

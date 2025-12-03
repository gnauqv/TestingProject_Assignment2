import { validateProduct } from '../validation';

describe('validateProduct', () => {
  test('name validation - required', () => {
    expect(validateProduct(null)).not.toBeNull();
    expect(validateProduct({})).not.toBeNull();
    expect(validateProduct({ name: '' })).not.toBeNull();
    const err = validateProduct({ name: '' });
    expect(err.name).toBe('Tên sản phẩm không được để trống');
  });

  test('name validation - length boundaries', () => {
    const short = { name: 'ab', price: 1, quantity: 1, category: 'Other' };
    expect(validateProduct(short).name).toBe('Tên sản phẩm phải từ 3 đến 100 ký tự');

    const longStr = 'a'.repeat(101);
    const long = { name: longStr, price: 1, quantity: 1, category: 'Other' };
    expect(validateProduct(long).name).toBe('Tên sản phẩm phải từ 3 đến 100 ký tự');

    const ok = { name: 'ABC', price: 1, quantity: 1, category: 'Other' };
    expect(validateProduct(ok)).toBeNull();
  });

  test('price validation - required and numeric & boundaries', () => {
    const noPrice = { name: 'Prod', quantity: 1, category: 'Other' };
    expect(validateProduct(noPrice).price).toBe('Giá không được để trống');

    const notNumber = { name: 'Prod', price: 'abc', quantity: 1, category: 'Other' };
    expect(validateProduct(notNumber).price).toBe('Giá không hợp lệ');

    const tooLow = { name: 'Prod', price: 0, quantity: 1, category: 'Other' };
    expect(validateProduct(tooLow).price).toBe('Giá phải nằm trong khoảng từ 0.01 đến 1,000,000');

    const tooHigh = { name: 'Prod', price: 1000001, quantity: 1, category: 'Other' };
    expect(validateProduct(tooHigh).price).toBe('Giá phải nằm trong khoảng từ 0.01 đến 1,000,000');

    const okPrice = { name: 'Prod', price: 0.01, quantity: 1, category: 'Other' };
    expect(validateProduct(okPrice)).toBeNull();
  });

  test('quantity validation - integer and boundaries', () => {
    const noQty = { name: 'Prod', price: 1, category: 'Other' };
    expect(validateProduct(noQty).quantity).toBe('Số lượng không được để trống');

    const notInt = { name: 'Prod', price: 1, quantity: 1.5, category: 'Other' };
    expect(validateProduct(notInt).quantity).toBe('Số lượng phải là số nguyên');

    const negative = { name: 'Prod', price: 1, quantity: -1, category: 'Other' };
    expect(validateProduct(negative).quantity).toBe('Số lượng phải nằm trong khoảng từ 0 đến 10000');

    const tooLarge = { name: 'Prod', price: 1, quantity: 10001, category: 'Other' };
    expect(validateProduct(tooLarge).quantity).toBe('Số lượng phải nằm trong khoảng từ 0 đến 10000');

    const ok = { name: 'Prod', price: 1, quantity: 0, category: 'Other' };
    expect(validateProduct(ok)).toBeNull();
  });

  test('description length validation', () => {
    const longDesc = { name: 'P', price: 1, quantity: 1, category: 'Other', description: 'a'.repeat(501) };
    expect(validateProduct(longDesc).description).toBe('Mô tả không được vượt quá 500 ký tự');

    const ok = { name: 'Poon', price: 1, quantity: 1, category: 'Other', description: 'short' };
    expect(validateProduct(ok)).toBeNull();
  });

  test('category validation - required and allowed', () => {
    const noCategory = { name: 'Prod', price: 1, quantity: 1 };
    expect(validateProduct(noCategory).category).toBe('Category không được để trống');

    const invalid = { name: 'Prod', price: 1, quantity: 1, category: 'Invalid' };
    expect(validateProduct(invalid).category).toBe('Category không hợp lệ');

    const ok = { name: 'Prod', price: 1, quantity: 1, category: 'Electronics' };
    expect(validateProduct(ok)).toBeNull();
  });
});

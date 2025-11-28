describe('Chức năng Đăng Nhập', () => {
  
  beforeEach(() => {
    // 1. Giả lập API Login (Mock API)
    // Khi app gọi POST tới /api/login, Cypress sẽ chặn lại và trả về thành công ngay lập tức
   // SAI (quá cứng nhắc, lệch 1 chữ là lỗi)
// cy.intercept('POST', 'http://localhost:8080/api/login', ...)

// ĐÚNG (Dùng wildcard **, bắt tất cả domain/port miễn là đuôi khớp)
cy.intercept('POST', '**/api/login', {
  statusCode: 200,
  body: {
    token: 'fake-token-123',
    user: { name: 'Quang' }
  }
}).as('loginApi');

    // 2. Truy cập vào trang web thật
    cy.visit('http://localhost:5173/login'); 
    // (Lưu ý: Bạn phải cấu hình Router để đường dẫn /login hiển thị component Login)
  });

  it('Đăng nhập thành công', () => {
    // Tìm input username qua data-testid và gõ chữ
    cy.get('[data-testid="username-input"]').type('quang');
    
    // Tìm input password và gõ chữ
    cy.get('[data-testid="password-input"]').type('123456');
    
    // Click nút đăng nhập
    cy.get('[data-testid="login-button"]').click();

    // Chờ API được gọi
    cy.wait('@loginApi');

    // Kiểm tra kết quả (Ví dụ: thông báo thành công hiện ra)
    cy.get('[data-testid="login-message"]')
      .should('be.visible')
      .and('contain', 'Đăng nhập thành công');
  });

  it('Báo lỗi khi để trống', () => {
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="username-error"]')
      .should('contain', 'Vui lòng nhập tên đăng nhập');
  });
});
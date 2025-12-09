describe('Chức năng Đăng Nhập (Chế độ Demo)', () => {
  
  const VIEW_TIME = 200; 
  const TYPING_SPEED = 100;

  beforeEach(() => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      body: { token: 'token-vip-123', user: { name: 'Quang' } }
    }).as('loginSuccess');

    cy.visit('http://localhost:5173/login'); 
  });

  // --- CASE 1: THÀNH CÔNG ---
  it('1. Đăng nhập thành công (User đúng, Pass đúng)', () => {
    cy.get('[data-testid="username-input"]').type('quang', { delay: TYPING_SPEED });
    cy.get('[data-testid="password-input"]').type('123456', { delay: TYPING_SPEED });
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginSuccess');
    
    cy.get('[data-testid="login-message"]')
      .should('be.visible')
      .and('contain', 'Đăng nhập thành công');

    cy.wait(VIEW_TIME);
  });

  // --- CASE 2: USERNAME SAI ---
  it('2. Tên đăng nhập SAI, Mật khẩu ĐÚNG', () => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 404, 
      body: { message: 'Tài khoản không tồn tại' }
    }).as('loginFailUser');

    cy.get('[data-testid="username-input"]').type('user_bi_sai', { delay: TYPING_SPEED });
    cy.get('[data-testid="password-input"]').type('123456', { delay: TYPING_SPEED });
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginFailUser');

    cy.get('[data-testid="login-message"]')
      .should('contain', 'Tài khoản không tồn tại');

    cy.wait(VIEW_TIME);
  });

  // --- CASE 3: PASSWORD SAI ---
  it('3. Tên đăng nhập ĐÚNG, Mật khẩu SAI', () => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 401, 
      body: { message: 'Sai mật khẩu' }
    }).as('loginFailPass');

    cy.get('[data-testid="username-input"]').type('quang', { delay: TYPING_SPEED });
    cy.get('[data-testid="password-input"]').type('mat_khau_bay_ba', { delay: TYPING_SPEED });
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginFailPass');

    cy.get('[data-testid="login-message"]')
      .should('contain', 'Sai mật khẩu');

    cy.wait(VIEW_TIME);
  });

  // --- CASE 4: USERNAME RỖNG ---
  it('4. Tên đăng nhập RỖNG, Mật khẩu ĐÚNG', () => {
    cy.get('[data-testid="password-input"]').type('123456', { delay: TYPING_SPEED });
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="username-error"]')
      .should('be.visible')
      .and('contain', 'Vui lòng nhập tên đăng nhập');

    cy.wait(VIEW_TIME);
  });

  // --- CASE 5: PASSWORD RỖNG ---
  it('5. Tên đăng nhập ĐÚNG, Mật khẩu RỖNG', () => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 400, 
      body: { message: 'Vui lòng nhập mật khẩu' }
    }).as('loginFailEmptyPass');

    cy.get('[data-testid="username-input"]').type('quang', { delay: TYPING_SPEED });
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginFailEmptyPass');

    cy.get('[data-testid="login-message"]')
      .should('contain', 'Vui lòng nhập mật khẩu');

    cy.wait(VIEW_TIME);
  });

  // --- CASE 6: CẢ 2 CÙNG RỖNG ---
  it('6. Cả Tên đăng nhập và Mật khẩu đều RỖNG', () => {
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="username-error"]')
      .should('contain', 'Vui lòng nhập tên đăng nhập');

    cy.wait(VIEW_TIME);
  });
});
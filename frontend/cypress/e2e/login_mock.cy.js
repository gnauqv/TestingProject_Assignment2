describe('Login Mocking (meets 5.1.1)', () => {
  const VIEW_TIME = 200;

  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('Mock: Login thành công (stub /api/login, verify request & response)', () => {
    // a) Mock the backend call
    cy.intercept('POST', '**/api/login', (req) => {
      // allow the test to inspect the outgoing request if needed
      req.continue((res) => {
        // respond with mocked success payload
        res.send({ statusCode: 200, body: { token: 'mock-token-123', user: { username: 'testuser' } } });
      });
    }).as('login');

    // Fill form and submit
    cy.get('[data-testid="username-input"]').clear().type('testuser');
    cy.get('[data-testid="password-input"]').clear().type('Test123');
    cy.get('[data-testid="login-button"]').click();

    // b) Wait for the mocked network call and verify payload + response
    cy.wait('@login').then((interception) => {
      expect(interception.request.body).to.deep.equal({ username: 'testuser', password: 'Test123' });
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.token).to.equal('mock-token-123');
    });

    // UI shows success message
    cy.get('[data-testid="login-message"]').should('contain', 'Đăng nhập thành công');

    // c) Verify mock interactions (called once)
    cy.get('@login.all').should('have.length', 1);

    cy.wait(VIEW_TIME);
  });

  it('Mock: Login thất bại (stub /api/login with error, verify request & response)', () => {
    cy.intercept('POST', '**/api/login', (req) => {
      req.continue((res) => {
        res.send({ statusCode: 401, body: { message: 'Invalid credentials' } });
      });
    }).as('loginFail');

    cy.get('[data-testid="username-input"]').clear().type('testuser');
    cy.get('[data-testid="password-input"]').clear().type('wrongpass');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginFail').then((interception) => {
      expect(interception.request.body).to.deep.equal({ username: 'testuser', password: 'wrongpass' });
      expect(interception.response.statusCode).to.equal(401);
      expect(interception.response.body.message).to.equal('Invalid credentials');
    });

    cy.get('[data-testid="login-message"]').should('contain', 'Invalid credentials');

    cy.get('@loginFail.all').should('have.length', 1);

    cy.wait(VIEW_TIME);
  });
});

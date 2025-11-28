# TestingProject_Assignment2
- Frontend: React
- Backend: Spring Boot

# Run Cypress
- B1: cd frontend 
- B2: cài đặt cypress nếu chưa có 
    npm install cypress --save-dev
- B3: Mở 2 teminal
    + Terminal 1: npx cypress open
    + Terminal 2: npm run dev 
- B4: Trong giao diện chọn E2E Testing -> chọn trình duyệt -> Start -> new file 
-> login.cy.js

1. Analysis and Desgin

2. Unit Test & Test-Driven Development

3. Integration Test
    - Frontend:
        + 4.1.1. Integration test Login component with API service:
            Login.integration.test.jsx

        + 4.2.1. Integration test Product component with API service:
            ProductDetail.Integration.test.jsx
            ProductForm.Integration.test.jsx
            ProductList.Integration.test.jsx

    - Backend:
        + 4.1.2. Test API endpoints of Login.
            AuthControllerIntegrationTest.java

        + 4.2.2. Test API endpoints of Product.
            ProductControllerIntegrationTest.java

    - Run Test:
        + B1: cd frontend/
        + B2: npm test

        
4. Mock Testing
5. Automation Testing & CI/CD
6. Performance Testing + Security Testing
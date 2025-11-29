/// <reference types="cypress" />

describe('Chức năng Quản lý Sản phẩm (Chế độ Demo)', () => {
    const VIEW_TIME = 1500; // Thời gian dừng để bạn nhìn cho rõ
    const TYPING_SPEED = 100;
    
    const mockProducts = [
        { id: 1, name: 'iPhone 15 Pro', price: 999 },
        { id: 2, name: 'Samsung S24 Ultra', price: 1200 }
    ];

    beforeEach(() => {
        // Luôn giả lập có danh sách sản phẩm khi vào trang chủ
        cy.intercept('GET', '**/api/products', {
            statusCode: 200,
            body: mockProducts
        }).as('getProducts');
    });

    // --- CASE 1: Hiển thị danh sách ---
    it('1. Hiển thị danh sách sản phẩm thành công', () => {
        cy.visit('http://localhost:5173/products');
        cy.wait('@getProducts');

        cy.get('h2').should('contain', 'Danh sách sản phẩm');
        // Kiểm tra render đủ 2 sản phẩm mock
        cy.contains('iPhone 15 Pro').should('be.visible');
        cy.contains('Samsung S24 Ultra').should('be.visible');
        
        cy.wait(VIEW_TIME);
    });

    // --- CASE 2: Tạo sản phẩm mới (ĐÃ SỬA LỖI TIMING) ---
    it('2. Tạo sản phẩm mới', () => {
        const newProduct = { name: 'Macbook Air M3', price: 1500 };

        cy.visit('http://localhost:5173/products');
        
        // Click nút Thêm
        cy.contains('Thêm sản phẩm').click();
        cy.url().should('include', '/product/create'); // Sửa lại đúng route trong App.jsx

        // Intercept lệnh POST
        cy.intercept('POST', '**/api/products', {
            statusCode: 201,
            body: { id: 99, ...newProduct }
        }).as('createProduct');

        // Định nghĩa Mock API GET mới sẽ được gọi sau khi tạo
        // Đây là mock chứa sản phẩm mới và ta sẽ đặt alias cho nó
        cy.intercept('GET', '**/api/products', {
            body: [...mockProducts, { id: 99, ...newProduct }]
        }).as('getNewProductList');
        // Lưu ý: Mock này chỉ có hiệu lực sau khi nó được định nghĩa
        
        // Điền form
        cy.get('[data-testid="name-input"]').type(newProduct.name, { delay: TYPING_SPEED });
        cy.get('[data-testid="price-input"]').type(newProduct.price, { delay: TYPING_SPEED });
        cy.get('[data-testid="submit-button"]').click();

        // Chờ API POST gọi xong
        cy.wait('@createProduct');

        // THAY VÌ CHỜ CỨNG (cy.wait(1000)), TA CHỜ CUỘC GỌI MẠNG ĐÃ ĐƯỢC MOCK
        // Điều này đảm bảo ứng dụng đã chuyển hướng và tải lại danh sách mới
        cy.wait('@getNewProductList');
        
        cy.contains('Danh sách sản phẩm').should('be.visible');
        cy.contains(newProduct.name).should('be.visible');

        cy.wait(VIEW_TIME);
    });

    // --- CASE 3: Sửa sản phẩm ---
    it('3. Sửa giá sản phẩm', () => {
        const editId = 1;
        const newPrice = 1050;

        // Giả lập lấy chi tiết sp ID=1 để điền vào form edit
        cy.intercept('GET', `**/api/products/${editId}`, {
            body: mockProducts[0]
        }).as('getProductDetail');

        // Vào thẳng trang edit
        cy.visit(`http://localhost:5173/product/edit/${editId}`);
        cy.wait('@getProductDetail');

        // Intercept lệnh PUT
        cy.intercept('PUT', `**/api/products/${editId}`, {
            statusCode: 200,
            body: { ...mockProducts[0], price: newPrice }
        }).as('updateProduct');

        // Sửa giá
        cy.get('[data-testid="price-input"]').clear().type(newPrice, { delay: TYPING_SPEED });
        cy.get('[data-testid="submit-button"]').click();

        cy.wait('@updateProduct');

        // Quay lại list, kiểm tra giá mới (Mock lại list với giá mới)
        // Lưu ý: Logic này tùy thuộc vào cách App bạn xử lý sau khi update
        cy.url().should('include', '/products');
        
        cy.wait(VIEW_TIME);
    });

    // --- CASE 4: Xóa sản phẩm ---
    it('4. Xóa sản phẩm', () => {
        cy.visit('http://localhost:5173/products');
        cy.wait('@getProducts');

        const deleteId = 1;

        cy.intercept('DELETE', `**/api/products/${deleteId}`, {
            statusCode: 204
        }).as('deleteProduct');

        // Tìm card chứa 'iPhone 15 Pro' và bấm nút Xóa bên trong nó
        cy.contains('iPhone 15 Pro')
            .parents('div') // Lên cấp cha (card container)
            .contains('button', 'Xóa') // Tìm nút Xóa
            .click();

        // Xử lý window.confirm (Cypress tự động accept confirm, nhưng cần event)
        cy.on('window:confirm', () => true);

        cy.wait('@deleteProduct');

        // Kiểm tra UI đã xóa (ẩn đi)
        cy.contains('iPhone 15 Pro').should('not.exist');

        cy.wait(VIEW_TIME);
    });
});
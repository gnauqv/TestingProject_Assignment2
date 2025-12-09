class ProductPage {
    productPageUrl = '/products'; 
    nameInput = '[data-testid="name-input"]';
    priceInput = '[data-testid="price-input"]';
    submitButton = '[data-testid="submit-button"]';
    loadingSpinner = '[data-testid="loading-spinner"]';
    errorMessage = '[data-testid="error-message"]';

    visit() {
        cy.visit(this.productPageUrl);
    }
    
    getLoadingSpinner() {
        return cy.get(this.loadingSpinner);
    }
    
    getErrorMessage() {
        return cy.get(this.errorMessage);
    }

    clickAddNew() {
        cy.contains('+ Thêm sản phẩm').click(); 
    }
    
    getProductItem(name) {
        return cy.contains('h3', name) 
                   .closest('.bg-white'); 
    }

    clickEditButton(name) {
        this.getProductItem(name)
            .contains('a', 'Sửa') 
            .click();
    }
    
    clickDeleteButton(name) {
        this.getProductItem(name)
            .contains('button', 'Xóa')
            .click();
    }

    fillProductForm(product) {
        cy.get(this.nameInput).clear().type(product.name); 
        cy.get(this.priceInput).clear().type(product.price); 
    }
    
    submitForm() {
        cy.get(this.submitButton).click();
    }

    getNameInputValue() {
        return cy.get(this.nameInput);
    }
}

export default ProductPage;
package com.assignment2.backend.controller;

/*
 ==================== 4.2.2 ==================== 
 */
import com.assignment2.backend.dto.ProductDto;
import com.assignment2.backend.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    // --- Yêu cầu (a): Test POST /api/products (Create) ---
    @Test
    @DisplayName("POST /api/products - Tạo mới sản phẩm (201 Created)")
    void testCreateProduct() throws Exception {
        ProductDto newProduct = new ProductDto(null, "Laptop Dell", 25000.0);
        ProductDto savedProduct = new ProductDto(1L, "Laptop Dell", 25000.0);

        // Mock service trả về sản phẩm đã có ID sau khi lưu
        when(productService.createProduct(any(ProductDto.class))).thenReturn(savedProduct);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isCreated()) // Mong đợi 201 Created
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop Dell"));
    }

    // --- Yêu cầu (b): Test GET /api/products (Read all) ---
    @Test
    @DisplayName("GET /api/products - Lấy danh sách sản phẩm (200 OK)")
    void testGetAllProducts() throws Exception {
        List<ProductDto> products = Arrays.asList(
                new ProductDto(1L, "Product A", 100.0),
                new ProductDto(2L, "Product B", 200.0)
        );

        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2)) // Kiểm tra mảng có 2 phần tử
                .andExpect(jsonPath("$[0].name").value("Product A")) // Phần tử đầu tiên
                .andExpect(jsonPath("$[1].name").value("Product B")); // Phần tử thứ hai
    }

    // --- Yêu cầu (c): Test GET /api/products/{id} (Read one) ---
    @Test
    @DisplayName("GET /api/products/{id} - Lấy chi tiết 1 sản phẩm (200 OK)")
    void testGetProductById() throws Exception {
        Long productId = 1L;
        ProductDto product = new ProductDto(productId, "Phone Samsung", 15000.0);

        when(productService.getProductById(productId)).thenReturn(product);

        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.name").value("Phone Samsung"));
    }

    // --- Yêu cầu (d): Test PUT /api/products/{id} (Update) ---
    @Test
    @DisplayName("PUT /api/products/{id} - Cập nhật sản phẩm (200 OK)")
    void testUpdateProduct() throws Exception {
        Long productId = 1L;
        ProductDto updateInfo = new ProductDto(null, "Phone Samsung Updated", 16000.0);
        ProductDto updatedProduct = new ProductDto(productId, "Phone Samsung Updated", 16000.0);

        // Mock service update
        when(productService.updateProduct(eq(productId), any(ProductDto.class)))
                .thenReturn(updatedProduct);

        mockMvc.perform(put("/api/products/{id}", productId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Phone Samsung Updated"))
                .andExpect(jsonPath("$.price").value(16000.0));
    }

    // --- Yêu cầu (e): Test DELETE /api/products/{id} (Delete) ---
    @Test
    @DisplayName("DELETE /api/products/{id} - Xóa sản phẩm (204 No Content)")
    void testDeleteProduct() throws Exception {
        Long productId = 1L;

        // Mock service delete (hàm void)
        doNothing().when(productService).deleteProduct(productId);

        mockMvc.perform(delete("/api/products/{id}", productId))
                .andExpect(status().isNoContent()); // Mong đợi 204 No Content (xóa thành công, không trả về body)
    }
}

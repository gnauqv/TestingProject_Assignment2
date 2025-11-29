package com.assignment2.backend.service;

import com.assignment2.backend.dto.ProductDto;
import com.assignment2.backend.entity.Product;
import com.assignment2.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceUnitTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setup() {
        clearInvocations(productRepository);
    }

    @Test
    @DisplayName("createProduct: should call repository.save and return mapped ProductDto")
    void createProduct_callsRepositoryAndReturnsDto() {
        ProductDto createDto = new ProductDto(null, "Laptop", 999.0);
        Product saved = new Product(1L, "Laptop", 999.0);
        when(productRepository.save(any(Product.class))).thenReturn(saved);

        ProductDto result = productService.createProduct(createDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Laptop", result.getName());
        assertEquals(999.0, result.getPrice());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("getAllProducts: should return mapped list of ProductDto")
    void getAllProducts_returnsMappedList() {
        List<Product> list = Arrays.asList(
                new Product(1L, "A", 10.0),
                new Product(2L, "B", 20.0)
        );
        when(productRepository.findAll()).thenReturn(list);

        List<ProductDto> dtos = productService.getAllProducts();

        assertEquals(2, dtos.size());
        assertEquals("A", dtos.get(0).getName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAllProducts(Pageable): should return mapped page")
    void getAllProducts_withPagination_returnsPage() {
        List<Product> list = Arrays.asList(
                new Product(1L, "A", 10.0),
                new Product(2L, "B", 20.0),
                new Product(3L, "C", 30.0)
        );
        Pageable pageable = PageRequest.of(0, 2);
        Page<Product> page = new PageImpl<>(list.subList(0, 2), pageable, list.size());

        when(productRepository.findAll(pageable)).thenReturn(page);

        Page<ProductDto> result = (Page)productService.getAllProducts();

        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals(3, result.getTotalElements());
        assertEquals(2, result.getSize());
        assertEquals(0, result.getNumber());
        assertEquals("A", result.getContent().get(0).getName());
        verify(productRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("getProductById: found returns ProductDto, not found throws RuntimeException")
    void getProductById_foundAndNotFound() {
        when(productRepository.findById(5L)).thenReturn(Optional.of(new Product(5L, "Widget", 99.0)));

        ProductDto dto = productService.getProductById(5L);
        assertNotNull(dto);
        assertEquals(5L, dto.getId());

        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> productService.getProductById(99L));
        verify(productRepository, times(2)).findById(anyLong());
    }

    @Test
    @DisplayName("updateProduct: when exists should update and return ProductDto; when not exists throws")
    void updateProduct_existingAndNotExisting() {
        Product existing = new Product(3L, "Old", 5.0);
        when(productRepository.findById(3L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductDto updateDto = new ProductDto(null, "New Name", 7.5);
        ProductDto result = productService.updateProduct(3L, updateDto);

        assertNotNull(result);
        assertEquals("New Name", result.getName());
        assertEquals(7.5, result.getPrice());

        // non-existent
        when(productRepository.findById(10L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> productService.updateProduct(10L, updateDto));
    }

    @Test
    @DisplayName("deleteProduct: should call repository.deleteById")
    void deleteProduct_callsRepositoryDelete() {
        doNothing().when(productRepository).deleteById(7L);

        productService.deleteProduct(7L);

        verify(productRepository, times(1)).deleteById(7L);
    }
}

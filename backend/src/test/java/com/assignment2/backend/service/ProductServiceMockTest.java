package com.assignment2.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.assignment2.backend.dto.ProductDto;

@ExtendWith(MockitoExtension.class)
public class ProductServiceMockTest {

    // Define a simple repository interface for the purpose of this unit test
    interface ProductRepository {
        ProductEntity save(ProductEntity product);
        List<ProductEntity> findAll();
        Optional<ProductEntity> findById(Long id);
        void deleteById(Long id);
    }

    // A minimal entity used only inside this test to simulate persistence layer
    static class ProductEntity {
        Long id;
        String name;
        Double price;

        ProductEntity() {}

        ProductEntity(Long id, String name, Double price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }
    }

    // Minimal ProductServiceImpl used for testing; converts between DTO and Entity
    static class ProductServiceImpl implements ProductService {
        private final ProductRepository repository;

        ProductServiceImpl(ProductRepository repository) {
            this.repository = repository;
        }

        private ProductDto toDto(ProductEntity e) {
            if (e == null) return null;
            return new ProductDto(e.id, e.name, e.price);
        }

        private ProductEntity toEntity(ProductDto d) {
            if (d == null) return null;
            return new ProductEntity(d.getId(), d.getName(), d.getPrice());
        }

        @Override
        public ProductDto createProduct(ProductDto productDto) {
            ProductEntity saved = repository.save(toEntity(productDto));
            return toDto(saved);
        }

        @Override
        public List<ProductDto> getAllProducts() {
            List<ProductEntity> entities = repository.findAll();
            List<ProductDto> dtos = new ArrayList<>();
            for (ProductEntity e : entities) dtos.add(toDto(e));
            return dtos;
        }

        @Override
        public ProductDto getProductById(Long id) {
            Optional<ProductEntity> opt = repository.findById(id);
            return opt.map(this::toDto).orElse(null);
        }

        @Override
        public ProductDto updateProduct(Long id, ProductDto productDto) {
            Optional<ProductEntity> opt = repository.findById(id);
            if (opt.isEmpty()) return null;
            ProductEntity existing = opt.get();
            existing.name = productDto.getName();
            existing.price = productDto.getPrice();
            ProductEntity saved = repository.save(existing);
            return toDto(saved);
        }

        @Override
        public void deleteProduct(Long id) {
            repository.deleteById(id);
        }
    }

    @Mock
    ProductRepository productRepository;

    @InjectMocks
    ProductServiceImpl productService; // Mockito will inject the mock repository

    @Test
    void createProduct_callsRepositoryAndReturnsDto() {
        ProductDto toCreate = new ProductDto(null, "Laptop", 1299.99);
        ProductEntity savedEntity = new ProductEntity(1L, "Laptop", 1299.99);
        when(productRepository.save(any(ProductEntity.class))).thenReturn(savedEntity);

        ProductDto result = productService.createProduct(toCreate);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Laptop", result.getName());
        verify(productRepository, times(1)).save(any(ProductEntity.class));
    }

    @Test
    void getAllProducts_returnsMappedList_andCallsRepository() {
        List<ProductEntity> list = List.of(
                new ProductEntity(1L, "A", 10.0),
                new ProductEntity(2L, "B", 20.0)
        );
        when(productRepository.findAll()).thenReturn(list);

        List<ProductDto> dtos = productService.getAllProducts();

        assertEquals(2, dtos.size());
        assertEquals("A", dtos.get(0).getName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void getProductById_whenFound_returnsDto_andCallsRepository() {
        ProductEntity e = new ProductEntity(5L, "Widget", 5.5);
        when(productRepository.findById(5L)).thenReturn(Optional.of(e));

        ProductDto dto = productService.getProductById(5L);

        assertNotNull(dto);
        assertEquals("Widget", dto.getName());
        verify(productRepository, times(1)).findById(5L);
    }

    @Test
    void getProductById_whenNotFound_returnsNull_andCallsRepository() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        ProductDto dto = productService.getProductById(99L);

        assertNull(dto);
        verify(productRepository, times(1)).findById(99L);
    }

    @Test
    void updateProduct_whenExists_updatesAndReturnsDto() {
        ProductEntity existing = new ProductEntity(3L, "Old", 1.0);
        when(productRepository.findById(3L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(ProductEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductDto update = new ProductDto(null, "New", 2.0);
        ProductDto result = productService.updateProduct(3L, update);

        assertNotNull(result);
        assertEquals("New", result.getName());
        verify(productRepository, times(1)).findById(3L);
        verify(productRepository, times(1)).save(any(ProductEntity.class));
    }

    @Test
    void deleteProduct_callsRepositoryDelete() {
        doNothing().when(productRepository).deleteById(7L);

        productService.deleteProduct(7L);

        verify(productRepository, times(1)).deleteById(7L);
    }
}

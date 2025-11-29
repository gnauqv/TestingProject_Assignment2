package com.assignment2.backend.service;

import com.assignment2.backend.dto.ProductDto;
import com.assignment2.backend.entity.Product;
import com.assignment2.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // 1. Create
    public ProductDto createProduct(ProductDto dto) {
        Product product = new Product(null, dto.getName(), dto.getPrice());
        Product savedProduct = productRepository.save(product);
        return new ProductDto(savedProduct.getId(), savedProduct.getName(), savedProduct.getPrice());
    }

    // 2. Read All
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(p -> new ProductDto(p.getId(), p.getName(), p.getPrice()))
                .collect(Collectors.toList());
        // return productRepository.findAll(pageable);
    }

    // 3. Read One
    public ProductDto getProductById(Long id) {
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return new ProductDto(p.getId(), p.getName(), p.getPrice());
    }

    // 4. Update
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        existingProduct.setName(dto.getName());
        existingProduct.setPrice(dto.getPrice());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return new ProductDto(updatedProduct.getId(), updatedProduct.getName(), updatedProduct.getPrice());
    }

    // 5. Delete
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
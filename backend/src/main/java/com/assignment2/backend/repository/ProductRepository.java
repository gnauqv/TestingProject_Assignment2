package com.assignment2.backend.repository;

import com.assignment2.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Có thể thêm hàm tìm kiếm nếu cần, ví dụ:
    // List<Product> findByNameContaining(String name);
}
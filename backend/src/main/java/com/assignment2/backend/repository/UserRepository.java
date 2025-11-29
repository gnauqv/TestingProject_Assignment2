package com.assignment2.backend.repository;

import com.assignment2.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Hàm này rất quan trọng để Spring Security tìm user
    Optional<User> findByUsername(String username);
}
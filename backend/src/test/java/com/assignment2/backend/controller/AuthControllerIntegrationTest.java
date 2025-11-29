package com.assignment2.backend.controller;

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.entity.User;
import com.assignment2.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest // Load toàn bộ hệ thống (Logic thật)
@AutoConfigureMockMvc // Giả lập Client
@ActiveProfiles("test") // Dùng DB H2
@Transactional // Xóa dữ liệu sau khi test xong
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Tạo dữ liệu mẫu trong DB H2 trước mỗi bài test
        // Phải mã hóa mật khẩu thì lúc login mới khớp được
        User testUser = new User();
        testUser.setUsername("realuser");
        testUser.setPassword(passwordEncoder.encode("Test123456")); 
        testUser.setEmail("real@example.com");
        testUser.setRole("ROLE_USER");

        userRepository.save(testUser);
    }

    // --- CASE 1: Đăng nhập thành công ---
    @Test
    @DisplayName("Login Success - Trả về 200 và Token")
    void testLoginSuccess_RealLogic() throws Exception {
        LoginRequest request = new LoginRequest("realuser", "Test123456");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()) // Kỳ vọng 200 OK
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists());
    }

    // --- CASE 2: Sai mật khẩu ---
    @Test
    @DisplayName("Login Fail - Sai mật khẩu trả về 401")
    void testLoginFailure_WrongPassword() throws Exception {
        LoginRequest request = new LoginRequest("realuser", "MatKhauSai");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()) // Kỳ vọng 401 (Nhờ try-catch ở Controller)
                .andExpect(jsonPath("$.message").value("Sai tên đăng nhập hoặc mật khẩu"));
    }

    // --- CASE 3: User không tồn tại ---
    @Test
    @DisplayName("Login Fail - User không tồn tại trả về 401")
    void testLoginFailure_UserNotFound() throws Exception {
        LoginRequest request = new LoginRequest("ghostuser", "123456");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()) // Kỳ vọng 401
                .andExpect(jsonPath("$.message").value("Sai tên đăng nhập hoặc mật khẩu"));
    }
}
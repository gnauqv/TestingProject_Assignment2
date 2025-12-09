package com.assignment2.backend.controller;

import static org.hamcrest.Matchers.containsString;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.entity.User;
import com.assignment2.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
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
        userRepository.deleteAll();

        User testUser = new User();
        testUser.setUsername("realuser");
        testUser.setPassword(passwordEncoder.encode("Test123456"));
        testUser.setEmail("real@example.com");
        testUser.setRole("ROLE_USER");

        userRepository.save(testUser);
    }

    // --- CASE 1: Đăng nhập thành công + Kiểm tra Headers/CORS (Yêu cầu a, b, c) ---
    @Test
    @DisplayName("Login Success - Check Status, Body, Headers & CORS")
    void testLoginSuccess_RealLogic() throws Exception {
        LoginRequest request = new LoginRequest("realuser", "Test123456");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(header().string("Content-Type", containsString("application/json")));
    }

    // --- CASE 2: Sai mật khẩu ---
    @Test
    @DisplayName("Login Fail - Sai mật khẩu trả về 401")
    void testLoginFailure_WrongPassword() throws Exception {
        LoginRequest request = new LoginRequest("realuser", "MatKhauSai");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").exists());
    }

    // --- CASE 3: User không tồn tại ---
    @Test
    @DisplayName("Login Fail - User không tồn tại trả về 401")
    void testLoginFailure_UserNotFound() throws Exception {
        LoginRequest request = new LoginRequest("ghostuser", "123456");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}

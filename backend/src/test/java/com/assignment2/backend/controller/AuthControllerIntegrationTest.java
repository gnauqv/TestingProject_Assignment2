package com.assignment2.backend.controller; // Thay đổi package cho phù hợp

/*
 ==================== 4.1.2 ==================== 
*/

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.dto.LoginResponse;
import com.assignment2.backend.dto.UserDto;
import com.assignment2.backend.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class) // Chỉ load Controller này để test cho nhẹ
@DisplayName("Login API Integration Tests")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc; // Công cụ giả lập gửi request

    @Autowired
    private ObjectMapper objectMapper; // Công cụ chuyển Object Java <-> JSON

    @MockBean
    private AuthService authService; // Giả lập Service

    // --- TEST CASE 1: Đăng nhập thành công ---
    // Phủ yêu cầu: (a) POST endpoint, (b) Structure/Status 200, (c) Headers
    @Test
    @DisplayName("POST /api/auth/login - Thành công (200 OK)")
    void testLoginSuccess() throws Exception {
        // 1. Chuẩn bị dữ liệu (Arrange)
        LoginRequest request = new LoginRequest("testuser", "Test123456");
        
        LoginResponse mockResponse = new LoginResponse(
                true, 
                "Đăng nhập thành công", 
                "eyJhbGciOiJIUzI1NiIsIn...", // token giả
                new UserDto("testuser", "test@example.com")
        );

        // Giả lập behavior của Service: Khi gọi authenticate thì trả về mockResponse
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(mockResponse);

        // 2. Thực thi và Kiểm tra (Act & Assert)
        // (a) Test POST request
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))) // Chuyển object request thành chuỗi JSON
                
                // (b) Test Status Code
                .andExpect(status().isOk()) // Mong đợi 200 OK

                // (b) Test Response Structure (JSONPath)
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
                .andExpect(jsonPath("$.token").exists()) // Phải có token
                .andExpect(jsonPath("$.user.username").value("testuser"))

                // (c) Test Headers
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // Header Content-Type
                // Dòng dưới này kiểm tra CORS (tùy thuộc vào config Security của bạn có bật không)
                // .andExpect(header().string("Access-Control-Allow-Origin", "*")) 
                ;
    }

    // --- TEST CASE 2: Đăng nhập thất bại (Sai mật khẩu) ---
    // Phủ yêu cầu: (a) POST endpoint, (b) Status 401
    @Test
    @DisplayName("POST /api/auth/login - Thất bại (401 Unauthorized)")
    void testLoginFailure_WrongPassword() throws Exception {
        // 1. Chuẩn bị
        LoginRequest request = new LoginRequest("testuser", "WrongPass");

        // Giả lập Service ném ra lỗi khi sai pass
        when(authService.authenticate(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Tên đăng nhập hoặc mật khẩu không đúng"));

        // 2. Thực thi & Kiểm tra
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // (b) Test Status Code cho lỗi
                .andExpect(status().isUnauthorized()) // Mong đợi 401
                
                // (b) Test cấu trúc lỗi trả về (nếu Controller có xử lý ExceptionHandler)
                // Ví dụ: kiểm tra xem message lỗi có đúng không
                // .andExpect(jsonPath("$.error").value("Unauthorized"))
                ;
    }

    // --- TEST CASE 3: Validate dữ liệu đầu vào (Rỗng) ---
    // Phủ yêu cầu: (a) POST endpoint, (b) Status 400
    @Test
    @DisplayName("POST /api/auth/login - Lỗi Validation (400 Bad Request)")
    void testLogin_Validation_EmptyFields() throws Exception {
        // 1. Chuẩn bị: Request với username rỗng (giả sử DTO có @NotBlank)
        LoginRequest request = new LoginRequest("", "");

        // 2. Thực thi & Kiểm tra
        // Lưu ý: Request này sẽ bị chặn ngay tại Controller (nhờ @Valid) trước khi vào Service
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // (b) Test Status Code
                .andExpect(status().isBadRequest()); // Mong đợi 400
    }
}
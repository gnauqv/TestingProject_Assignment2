package com.assignment2.backend.controller;

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.dto.LoginResponse;
import com.assignment2.backend.dto.UserDto;
import com.assignment2.backend.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService; // a) mocked with @MockBean

    @DisplayName("Mock : Controller voi mocked service success")
    @Test
    public void login_success_returnsTokenAndUser_and_verifiesServiceCalled() throws Exception {
        // Arrange
        LoginRequest req = new LoginRequest("testuser", "Test123");
        LoginResponse resp = new LoginResponse(true, "Đăng nhập thành công", "mock-token-123", new UserDto("testuser", "test@example.com"));
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(resp);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("mock-token-123"))
                .andExpect(jsonPath("$.user.username").value("testuser"));

                // c) verify interaction: called exactly once with any LoginRequest
                verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }

    @DisplayName("Mock : Controller voi mocked service failure")
    @Test
    public void login_failure_returnsMessage_and_verifiesServiceCalled() throws Exception {
        // Arrange
        LoginRequest req = new LoginRequest("testuser", "wrongpass");
        LoginResponse resp = new LoginResponse(false, "Invalid credentials", null, null);
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(resp);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));

        // c) verify interaction: called exactly once
        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }
}

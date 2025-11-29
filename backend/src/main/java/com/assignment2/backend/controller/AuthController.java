package com.assignment2.backend.controller;

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.dto.LoginResponse;
import com.assignment2.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException; // Import này quan trọng
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Validate dữ liệu đầu vào
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Username is required", null, null));
        }

        // --- ĐÂY LÀ ĐOẠN CODE CẦN THÊM ĐỂ FIX LỖI 403 ---
        try {
            LoginResponse response = authService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            // Nếu sai mật khẩu hoặc không tìm thấy user, trả về 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Sai tên đăng nhập hoặc mật khẩu", null, null));
        }
        // ------------------------------------------------
    }
}
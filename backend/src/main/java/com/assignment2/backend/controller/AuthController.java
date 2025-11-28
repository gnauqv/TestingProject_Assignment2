package com.assignment2.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.dto.LoginResponse;
import com.assignment2.backend.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Trong test integration dùng @MockBean, nên code ở đây thực ra không chạy logic thật
        // nhưng hàm này phải tồn tại để test gọi vào.
        return authService.authenticate(request);
    }
}
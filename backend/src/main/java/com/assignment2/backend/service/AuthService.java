package com.assignment2.backend.service;

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.dto.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(LoginRequest request);
}
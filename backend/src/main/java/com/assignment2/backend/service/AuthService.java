package com.assignment2.backend.service;

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.dto.LoginResponse;
import com.assignment2.backend.dto.UserDto;
import com.assignment2.backend.entity.User;
import com.assignment2.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    public LoginResponse authenticate(LoginRequest request) {
        // 1. Logic xác thực thực sự (So sánh username & password hash)
        // Nếu sai pass, dòng này sẽ ném BadCredentialsException -> Controller sẽ bắt hoặc trả 401
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // 2. Nếu login thành công, tìm user để trả về info
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        
        // 3. Giả lập sinh token (trong thực tế dùng JwtUtils)
        String fakeToken = "jwt-token-" + user.getUsername();

        return new LoginResponse(true, "Đăng nhập thành công", fakeToken, 
                new UserDto(user.getUsername(), user.getEmail()));
    }
}
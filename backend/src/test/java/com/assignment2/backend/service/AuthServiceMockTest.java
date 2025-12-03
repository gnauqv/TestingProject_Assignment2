package com.assignment2.backend.service;

import com.assignment2.backend.dto.LoginRequest;
import com.assignment2.backend.dto.LoginResponse;
import com.assignment2.backend.dto.UserDto;
import com.assignment2.backend.entity.User;
import com.assignment2.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceMockTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private final String username = "testuser";
    private final String password = "Test123";

    @BeforeEach
    void setup() {
        // clear interactions before each test (MockitoExtension handles it, but keep explicit)
        clearInvocations(authenticationManager, userRepository);
    }

    @DisplayName("Service: login thành công trả về LoginResponse với token và user")
    @Test
    void authenticate_success_returnsLoginResponse() {
        // Arrange
        LoginRequest request = new LoginRequest(username, password);
        Authentication auth = new UsernamePasswordAuthenticationToken(username, password);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        User user = new User(1L, username, "hashedpass", "test@example.com", "ROLE_USER");
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Đăng nhập thành công", response.getMessage());
        assertEquals("jwt-token-" + username, response.getToken());
        assertNotNull(response.getUser());
        assertEquals(username, response.getUser().getUsername());
        assertEquals("test@example.com", response.getUser().getEmail());

        // Verify interactions
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByUsername(eq(username));
    }

    @DisplayName("Service: login với username không tồn tại -> ném NoSuchElementException")
    @Test
    void authenticate_usernameNotFound_throwsNoSuchElement() {
        // Arrange
        LoginRequest request = new LoginRequest(username, password);
        Authentication auth = new UsernamePasswordAuthenticationToken(username, password);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NoSuchElementException.class, () -> authService.authenticate(request));

        // Verify
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByUsername(eq(username));
    }

    @DisplayName("Service: login với password sai -> ném BadCredentialsException và không gọi repository")
    @Test
    void authenticate_wrongPassword_throwsBadCredentialsException() {
        // Arrange
        LoginRequest request = new LoginRequest(username, "wrongpass");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.authenticate(request));

        // Verify repository never called
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verifyNoInteractions(userRepository);
    }

    @DisplayName("Service: validation error - null request should throw NullPointerException")
    @Test
    void authenticate_nullRequest_throwsNullPointerException() {
        // Arrange
        LoginRequest request = null;

        // Act & Assert
        assertThrows(NullPointerException.class, () -> authService.authenticate(request));

        // No interactions expected
        verifyNoInteractions(authenticationManager);
        verifyNoInteractions(userRepository);
    }

}

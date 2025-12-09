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
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
public class AuthServiceUnitTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private LoginRequest validLoginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Setup test data
        validLoginRequest = new LoginRequest("john_doe", "password123");
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("john_doe");
        testUser.setEmail("john@example.com");
        testUser.setPassword("hashedPassword123");
    }

    // ============= Test authenticate() method with Success Scenario =============

    @Test
    @DisplayName("authenticate: Should successfully login with valid credentials")
    void authenticate_WithValidCredentials_ReturnsSuccessfulLogin() {
        // Arrange
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("john_doe"))
                .thenReturn(Optional.of(testUser));

        // Act
        LoginResponse response = authService.authenticate(validLoginRequest);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Đăng nhập thành công", response.getMessage());
        assertNotNull(response.getToken());
        assertTrue(response.getToken().contains("jwt-token-john_doe"));
        
        // Verify user data
        assertNotNull(response.getUser());
        assertEquals("john_doe", response.getUser().getUsername());
        assertEquals("john@example.com", response.getUser().getEmail());

        // Verify interactions
        verify(authenticationManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByUsername("john_doe");
    }

    // ============= Test authenticate() method with Invalid Username =============

    @Test
    @DisplayName("authenticate: Should throw exception when username does not exist")
    void authenticate_WithNonExistentUsername_ThrowsException() {
        // Arrange
        LoginRequest invalidRequest = new LoginRequest("nonexistent_user", "password123");
        Authentication mockAuth = mock(Authentication.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("nonexistent_user"))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(Exception.class, () -> {
            authService.authenticate(invalidRequest);
        });

        // Verify interactions
        verify(authenticationManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByUsername("nonexistent_user");
    }

    // ============= Test authenticate() method with Invalid Password =============

    @Test
    @DisplayName("authenticate: Should throw BadCredentialsException when password is incorrect")
    void authenticate_WithInvalidPassword_ThrowsBadCredentialsException() {
        // Arrange
        LoginRequest invalidPasswordRequest = new LoginRequest("john_doe", "wrongpassword");
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> {
            authService.authenticate(invalidPasswordRequest);
        });

        // Verify that AuthenticationManager was called
        verify(authenticationManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
        
        // UserRepository should not be called when authentication fails
        verify(userRepository, never()).findByUsername(anyString());
    }

    // ============= Test Validation Errors =============

    @Test
    @DisplayName("authenticate: Should handle null username validation")
    void authenticate_WithNullUsername_ThrowsException() {
        // Arrange
        LoginRequest nullUsernameRequest = new LoginRequest(null, "password123");

        // Act & Assert
        assertThrows(Exception.class, () -> {
            authService.authenticate(nullUsernameRequest);
        });
    }

    @Test
    @DisplayName("authenticate: Should handle null password validation")
    void authenticate_WithNullPassword_ThrowsException() {
        // Arrange
        LoginRequest nullPasswordRequest = new LoginRequest("john_doe", null);

        // Act & Assert
        assertThrows(Exception.class, () -> {
            authService.authenticate(nullPasswordRequest);
        });
    }

    @Test
    @DisplayName("authenticate: Should handle empty username validation")
    void authenticate_WithEmptyUsername_ThrowsException() {
        // Arrange
        LoginRequest emptyUsernameRequest = new LoginRequest("", "password123");

        // Act & Assert
        assertThrows(Exception.class, () -> {
            authService.authenticate(emptyUsernameRequest);
        });
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "   "})
    @DisplayName("authenticate: Should reject empty or whitespace passwords")
    void authenticate_WithEmptyOrWhitespacePassword_ThrowsException(String password) {
        // Arrange
        LoginRequest request = new LoginRequest("john_doe", password);

        // Act & Assert
        assertThrows(Exception.class, () -> {
            authService.authenticate(request);
        });
    }

    // ============= Test Token Generation =============

    @Test
    @DisplayName("authenticate: Should generate JWT token with correct format")
    void authenticate_GeneratesCorrectTokenFormat() {
        // Arrange
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("john_doe"))
                .thenReturn(Optional.of(testUser));

        // Act
        LoginResponse response = authService.authenticate(validLoginRequest);

        // Assert
        String token = response.getToken();
        assertTrue(token.startsWith("jwt-token-"));
        assertTrue(token.contains("john_doe"));
    }

    // ============= Test UserDto Mapping =============

    @Test
    @DisplayName("authenticate: Should correctly map User to UserDto")
    void authenticate_CorrectlyMapsUserToUserDto() {
        // Arrange
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("john_doe"))
                .thenReturn(Optional.of(testUser));

        // Act
        LoginResponse response = authService.authenticate(validLoginRequest);

        // Assert
        UserDto userDto = response.getUser();
        assertEquals(testUser.getUsername(), userDto.getUsername());
        assertEquals(testUser.getEmail(), userDto.getEmail());
    }

    // ============= Test Different User Scenarios =============

    @Test
    @DisplayName("authenticate: Should handle multiple different users")
    void authenticate_WithDifferentUsers_WorksCorrectly() {
        // Arrange
        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("jane_smith");
        user2.setEmail("jane@example.com");

        LoginRequest user2Request = new LoginRequest("jane_smith", "password456");
        Authentication mockAuth = mock(Authentication.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("jane_smith"))
                .thenReturn(Optional.of(user2));

        // Act
        LoginResponse response = authService.authenticate(user2Request);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("jane_smith", response.getUser().getUsername());
        assertEquals("jane@example.com", response.getUser().getEmail());
    }

    // ============= Test Case Sensitivity =============

    @Test
    @DisplayName("authenticate: Should treat usernames as case-sensitive")
    void authenticate_WithDifferentCaseUsername_TreatsAsCaseSensitive() {
        // Arrange
        LoginRequest differentCaseRequest = new LoginRequest("JOHN_DOE", "password123");
        Authentication mockAuth = mock(Authentication.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("JOHN_DOE"))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(Exception.class, () -> {
            authService.authenticate(differentCaseRequest);
        });
    }

    // ============= Test Response Message Validation =============

    @Test
    @DisplayName("authenticate: Should return appropriate success message")
    void authenticate_ReturnsCorrectSuccessMessage() {
        // Arrange
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("john_doe"))
                .thenReturn(Optional.of(testUser));

        // Act
        LoginResponse response = authService.authenticate(validLoginRequest);

        // Assert
        assertTrue(response.getMessage().contains("thành công"));
    }

    // ============= Test Authentication Manager Interaction =============

    @Test
    @DisplayName("authenticate: Should call AuthenticationManager with correct credentials")
    void authenticate_CallsAuthenticationManagerWithCorrectCredentials() {
        // Arrange
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("john_doe"))
                .thenReturn(Optional.of(testUser));

        // Act
        authService.authenticate(validLoginRequest);

        // Assert
        verify(authenticationManager, times(1)).authenticate(
                argThat(token -> 
                    token.getPrincipal().equals("john_doe") &&
                    token.getCredentials().equals("password123")
                )
        );
    }

    // ============= Test Repository Interaction =============

    @Test
    @DisplayName("authenticate: Should call UserRepository to fetch user details after successful authentication")
    void authenticate_CallsRepositoryAfterSuccessfulAuthentication() {
        // Arrange
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("john_doe"))
                .thenReturn(Optional.of(testUser));

        // Act
        authService.authenticate(validLoginRequest);

        // Assert
        verify(userRepository, times(1)).findByUsername("john_doe");
    }

    // ============= Test Edge Cases =============

    @Test
    @DisplayName("authenticate: Should handle very long username")
    void authenticate_WithVeryLongUsername_HandlesCorrectly() {
        // Arrange
        String longUsername = "a".repeat(255);
        LoginRequest longUsernameRequest = new LoginRequest(longUsername, "password123");
        User longUsernameUser = new User();
        longUsernameUser.setId(3L);
        longUsernameUser.setUsername(longUsername);
        longUsernameUser.setEmail("long@example.com");

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername(longUsername))
                .thenReturn(Optional.of(longUsernameUser));

        // Act
        LoginResponse response = authService.authenticate(longUsernameRequest);

        // Assert
        assertNotNull(response);
        assertEquals(longUsername, response.getUser().getUsername());
    }

    @Test
    @DisplayName("authenticate: Should handle special characters in email")
    void authenticate_WithSpecialCharactersInEmail_HandlesCorrectly() {
        // Arrange
        User userWithSpecialEmail = new User();
        userWithSpecialEmail.setId(4L);
        userWithSpecialEmail.setUsername("special_user");
        userWithSpecialEmail.setEmail("user+tag@example.co.uk");

        LoginRequest request = new LoginRequest("special_user", "password123");
        Authentication mockAuth = mock(Authentication.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(userRepository.findByUsername("special_user"))
                .thenReturn(Optional.of(userWithSpecialEmail));

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertEquals("user+tag@example.co.uk", response.getUser().getEmail());
    }
}

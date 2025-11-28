package com.assignment2.backend.dto;

public class LoginRequest {
    private String username;
    private String password;

    // Constructor không tham số (Bắt buộc cho Jackson library)
    public LoginRequest() {}

    // Constructor có tham số (Dùng trong file test)
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getters và Setters (Bắt buộc)
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
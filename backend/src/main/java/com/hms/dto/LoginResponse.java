package com.hms.dto;

public class LoginResponse {

    private String token;
    private String role;
    private Long userId;
    private String loginEmail;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            String role,
            Long userId,
            String loginEmail) {

        this.token = token;
        this.role = role;
        this.userId = userId;
        this.loginEmail = loginEmail;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getLoginEmail() {
        return loginEmail;
    }

    public void setLoginEmail(String loginEmail) {
        this.loginEmail = loginEmail;
    }
}
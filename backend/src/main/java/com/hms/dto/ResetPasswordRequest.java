package com.hms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @NotBlank(message = "Login email is required")
    @Email(message = "Enter a valid email")
    private String loginEmail;

    @NotBlank(message = "Password is required")
    @Size(
            min = 6,
            message = "Password must contain at least 6 characters"
    )
    private String newPassword;

    public ResetPasswordRequest() {
    }

    public String getLoginEmail() {
        return loginEmail;
    }

    public void setLoginEmail(String loginEmail) {
        this.loginEmail = loginEmail;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}